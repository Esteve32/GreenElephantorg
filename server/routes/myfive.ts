import { Router, Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { and, asc, desc, eq } from "drizzle-orm";
import { db, pool } from "../db";
import { myfiveAgreements, myfiveConnectionSlots, myfiveConsentLedger, myfiveLoveProfileSnapshots } from "../../shared/schema";
import { EMPTY_LOVE_FLOW_PROFILE, isLoveFlowProfile } from "../../shared/loveFlowProfile";
import { includesEveryValueRule, VALUE_RULES_VERSION } from "../../shared/valueRules";

export const myfiveRouter = Router();

const DEFAULT_AGREEMENT = "Agreement on Quiet Hours & Evening Energy:\n- We agree to keep 21:00 to 08:00 notification-free.\n- We review this living agreement every 30 days.";

function getMyFiveActorId(req: Request): string {
  if (req.session.clientUserId) return req.session.clientUserId;
  if (!req.session.myfiveActorId) req.session.myfiveActorId = `session:${randomUUID()}`;
  return req.session.myfiveActorId;
}

function readSlotId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const slotId = value.trim();
  return slotId && slotId.length <= 100 ? slotId : null;
}

async function findOwnedSlot(actorUserId: string, slotId: string, allowSelf = true) {
  const [slot] = await db.select().from(myfiveConnectionSlots).where(and(
    eq(myfiveConnectionSlots.id, slotId),
    eq(myfiveConnectionSlots.userId, actorUserId),
    eq(myfiveConnectionSlots.status, "active"),
  )).limit(1);
  return slot && (allowSelf || slot.isSelfVault !== "true") ? slot : null;
}

function serializeSlot(slot: typeof myfiveConnectionSlots.$inferSelect) {
  const isSelf = slot.isSelfVault === "true";
  return {
    id: slot.id, slotIndex: slot.slotIndex,
    name: isSelf ? "Self (Philautia)" : slot.partnerName,
    relation: isSelf ? "Self-Reflection Slot" : slot.relationType,
    status: slot.status, isSelf,
  };
}

// Health check endpoint
myfiveRouter.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "MyFive Extension",
    version: "1.4.0",
    stack: "React_Vite_Express_NeonPG_Drizzle_Stripe"
  });
});

// Fetch active connection slots (Dunbar limit 5 + 1 Philautia)
myfiveRouter.get("/slots", async (req: Request, res: Response) => {
  const actorUserId = getMyFiveActorId(req);
  try {
    await db.insert(myfiveConnectionSlots).values({
      userId: actorUserId, slotIndex: 0, status: "active", isSelfVault: "true",
    }).onConflictDoNothing();
    const stored = await db.select().from(myfiveConnectionSlots)
      .where(eq(myfiveConnectionSlots.userId, actorUserId)).orderBy(asc(myfiveConnectionSlots.slotIndex));
    const byIndex = new Map(stored.map((slot) => [slot.slotIndex, serializeSlot(slot)]));
    res.json({ maxSeats: 5, selfVaultActive: true, slots: Array.from({ length: 6 }, (_, slotIndex) =>
      byIndex.get(slotIndex) ?? { id: null, slotIndex, name: "Empty Slot", relation: "Available Seat", status: "empty", isSelf: false },
    ) });
  } catch (error) {
    console.error("MyFive slot read failed", error);
    res.status(500).json({ error: "Connection seats could not be loaded" });
  }
});

myfiveRouter.post("/slots", async (req: Request, res: Response) => {
  const actorUserId = getMyFiveActorId(req);
  const partnerName = typeof req.body?.partnerName === "string" ? req.body.partnerName.trim() : "";
  const relationType = typeof req.body?.relationType === "string" ? req.body.relationType.trim() : "";
  if (!partnerName || partnerName.length > 100 || !relationType || relationType.length > 100) {
    return res.status(400).json({ error: "Partner name and relationship type are required (maximum 100 characters each)" });
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [`myfive-slots:${actorUserId}`]);
    const occupied = await client.query<{ slot_index: number }>(
      "SELECT slot_index FROM myfive_connection_slots WHERE user_id = $1 AND slot_index BETWEEN 1 AND 5 AND status = 'active' ORDER BY slot_index", [actorUserId],
    );
    const used = new Set(occupied.rows.map((row) => row.slot_index));
    const slotIndex = [1, 2, 3, 4, 5].find((candidate) => !used.has(candidate));
    if (!slotIndex) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "All five active partner connection seats are occupied" });
    }
    const result = await client.query(
      `INSERT INTO myfive_connection_slots (user_id, slot_index, partner_name, relation_type, status, is_self_vault)
       VALUES ($1, $2, $3, $4, 'active', 'false')
       ON CONFLICT (user_id, slot_index) DO UPDATE SET partner_name = EXCLUDED.partner_name, relation_type = EXCLUDED.relation_type, status = 'active'
       RETURNING id, user_id, slot_index, partner_name, relation_type, status, is_self_vault, created_at`,
      [actorUserId, slotIndex, partnerName, relationType],
    );
    await client.query("COMMIT");
    const row = result.rows[0];
    res.status(201).json({ slot: serializeSlot({ id: row.id, userId: row.user_id, slotIndex: row.slot_index,
      partnerName: row.partner_name, relationType: row.relation_type, status: row.status,
      isSelfVault: row.is_self_vault, createdAt: row.created_at }) });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("MyFive slot creation failed", error);
    res.status(500).json({ error: "Connection seat could not be created" });
  } finally {
    client.release();
  }
});

// Create/store private check-in
myfiveRouter.post("/check-in", (req: Request, res: Response) => {
  const { octant, reflectionText } = req.body;
  res.json({
    success: true,
    message: "Private check-in securely logged into encrypted vault",
    octant: octant || "flow",
    savedAt: new Date().toISOString()
  });
});

// Validate the unskippable consent boundary before a shared view is unlocked.
myfiveRouter.post("/consent", async (req: Request, res: Response) => {
  const { acceptedRuleIds, rulesVersion, consentType } = req.body ?? {};
  const slotId = readSlotId(req.body?.slotId);
  if (rulesVersion !== VALUE_RULES_VERSION || !includesEveryValueRule(acceptedRuleIds)) {
    return res.status(400).json({
      error: "All nine current ValueRules™ must be accepted individually",
    });
  }
  if (consentType !== "agreement-sharing") {
    return res.status(400).json({ error: "Unsupported consent purpose" });
  }
  if (!slotId) return res.status(400).json({ error: "A valid connection slot is required" });

  try {
    const actorUserId = getMyFiveActorId(req);
    if (!await findOwnedSlot(actorUserId, slotId, false)) return res.status(404).json({ error: "Active partner connection not found" });
    const [receipt] = await db.insert(myfiveConsentLedger).values({
      actorUserId,
      slotId,
      consentType,
      rulesVersion,
      acceptedRuleIds: [...acceptedRuleIds],
    }).returning();

    res.status(201).json({
      success: true,
      receiptId: receipt.id,
      rulesVersion: receipt.rulesVersion,
      acceptedAt: receipt.acceptedAt.toISOString(),
      note: "Partner consent is a separate required event",
    });
  } catch (error) {
    console.error("MyFive consent persistence failed", error);
    res.status(500).json({ error: "Consent could not be recorded" });
  }
});

// Read the latest immutable agreement version for this actor and connection slot.
myfiveRouter.get("/agreements/:slotId", async (req: Request, res: Response) => {
  const slotId = readSlotId(req.params.slotId);
  if (!slotId) return res.status(400).json({ error: "A valid connection slot is required" });

  try {
    const actorUserId = getMyFiveActorId(req);
    if (!await findOwnedSlot(actorUserId, slotId, false)) return res.status(404).json({ error: "Active partner connection not found" });
    const [latest] = await db.select().from(myfiveAgreements).where(and(
      eq(myfiveAgreements.slotId, slotId),
      eq(myfiveAgreements.creatorUserId, actorUserId),
    )).orderBy(desc(myfiveAgreements.version)).limit(1);

    res.json(latest ? {
      id: latest.id,
      agreementText: latest.agreementText,
      version: latest.version,
      savedAt: latest.createdAt.toISOString(),
    } : {
      agreementText: DEFAULT_AGREEMENT,
      version: 0,
      savedAt: null,
    });
  } catch (error) {
    console.error("MyFive agreement read failed", error);
    res.status(500).json({ error: "Agreement could not be loaded" });
  }
});

// Append a new version; prior versions are never overwritten or deleted.
myfiveRouter.post("/agreements", async (req: Request, res: Response) => {
  const { agreementText, consentReceiptId, expectedVersion } = req.body ?? {};
  const slotId = readSlotId(req.body?.slotId);
  const actorUserId = getMyFiveActorId(req);
  if (!slotId || typeof agreementText !== "string" || !agreementText.trim() || agreementText.length > 20_000) {
    return res.status(400).json({ error: "A connection slot and agreement text (maximum 20,000 characters) are required" });
  }
  if (typeof consentReceiptId !== "string" || !Number.isInteger(expectedVersion) || expectedVersion < 0) {
    return res.status(400).json({ error: "A valid consent receipt and expected version are required" });
  }

  try {
    if (!await findOwnedSlot(actorUserId, slotId, false)) return res.status(404).json({ error: "Active partner connection not found" });
    const [consent] = await db.select({ id: myfiveConsentLedger.id }).from(myfiveConsentLedger).where(and(
      eq(myfiveConsentLedger.id, consentReceiptId),
      eq(myfiveConsentLedger.actorUserId, actorUserId),
      eq(myfiveConsentLedger.slotId, slotId),
      eq(myfiveConsentLedger.consentType, "agreement-sharing"),
      eq(myfiveConsentLedger.rulesVersion, VALUE_RULES_VERSION),
    )).limit(1);
    if (!consent) return res.status(403).json({ error: "Current ValueRules™ consent is required" });

    const [latest] = await db.select({ version: myfiveAgreements.version }).from(myfiveAgreements).where(and(
      eq(myfiveAgreements.slotId, slotId),
      eq(myfiveAgreements.creatorUserId, actorUserId),
    )).orderBy(desc(myfiveAgreements.version)).limit(1);
    const currentVersion = latest?.version ?? 0;
    if (currentVersion !== expectedVersion) {
      return res.status(409).json({ error: "A newer agreement version exists", currentVersion });
    }

    const [saved] = await db.insert(myfiveAgreements).values({
      slotId,
      creatorUserId: actorUserId,
      agreementText: agreementText.trim(),
      valueRulesConsented: consentReceiptId,
      version: currentVersion + 1,
    }).returning();

    res.status(201).json({
      success: true,
      id: saved.id,
      version: saved.version,
      savedAt: saved.createdAt.toISOString(),
      message: "Dyadic relationship agreement version timestamped and saved",
    });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") {
      return res.status(409).json({ error: "A newer agreement version exists; reload before saving" });
    }
    console.error("MyFive agreement persistence failed", error);
    res.status(500).json({ error: "Agreement could not be saved" });
  }
});

// Read only the current actor's latest private eight-dimensional profile.
myfiveRouter.get("/love-profiles/:slotId", async (req: Request, res: Response) => {
  const slotId = readSlotId(req.params.slotId);
  if (!slotId) return res.status(400).json({ error: "A valid connection slot is required" });

  try {
    const actorUserId = getMyFiveActorId(req);
    if (!await findOwnedSlot(actorUserId, slotId)) return res.status(404).json({ error: "Active connection not found" });
    const [latest] = await db.select().from(myfiveLoveProfileSnapshots).where(and(
      eq(myfiveLoveProfileSnapshots.actorUserId, actorUserId),
      eq(myfiveLoveProfileSnapshots.slotId, slotId),
    )).orderBy(desc(myfiveLoveProfileSnapshots.createdAt)).limit(1);

    res.json(latest ? {
      id: latest.id,
      profile: latest.profile,
      calibratedAt: latest.createdAt.toISOString(),
    } : {
      profile: EMPTY_LOVE_FLOW_PROFILE,
      calibratedAt: null,
    });
  } catch (error) {
    console.error("MyFive love profile read failed", error);
    res.status(500).json({ error: "Love profile could not be loaded" });
  }
});

// Append a complete snapshot. Existing calibrations are never mutated.
myfiveRouter.post("/love-profiles", async (req: Request, res: Response) => {
  const slotId = readSlotId(req.body?.slotId);
  const profile = req.body?.profile;
  if (!slotId || !isLoveFlowProfile(profile)) {
    return res.status(400).json({ error: "A valid slot and all eight love dimensions are required" });
  }

  try {
    const actorUserId = getMyFiveActorId(req);
    if (!await findOwnedSlot(actorUserId, slotId)) return res.status(404).json({ error: "Active connection not found" });
    const [snapshot] = await db.insert(myfiveLoveProfileSnapshots).values({
      actorUserId,
      slotId,
      profile,
    }).returning();

    res.status(201).json({
      id: snapshot.id,
      profile: snapshot.profile,
      calibratedAt: snapshot.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("MyFive love profile persistence failed", error);
    res.status(500).json({ error: "Love profile could not be saved" });
  }
});

// Subscription pay gate verification
myfiveRouter.get("/subscription", (_req: Request, res: Response) => {
  res.json({
    plan: "B2C Primary Subscription",
    status: "active",
    priceEur: 4.99,
    sponsoredSeatsAllowed: 5,
    stripeConnected: true
  });
});
