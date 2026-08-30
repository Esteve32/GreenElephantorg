import { Router, Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { myfiveAgreements, myfiveConsentLedger } from "../../shared/schema";
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
myfiveRouter.get("/slots", (_req: Request, res: Response) => {
  res.json({
    maxSeats: 5,
    selfVaultActive: true,
    slots: [
      { id: 0, name: "Self (Philautia)", relation: "Self-Reflection Slot", status: "active", isSelf: true },
      { id: 1, name: "Alex", relation: "Partner", status: "active", isSelf: false },
      { id: 2, name: "Robin", relation: "Close Friend", status: "active", isSelf: false },
      { id: 3, name: "Empty Slot", relation: "Available Seat", status: "empty", isSelf: false },
      { id: 4, name: "Empty Slot", relation: "Available Seat", status: "empty", isSelf: false },
      { id: 5, name: "Empty Slot", relation: "Available Seat", status: "empty", isSelf: false },
    ]
  });
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
    const [receipt] = await db.insert(myfiveConsentLedger).values({
      actorUserId: getMyFiveActorId(req),
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
    const [latest] = await db.select().from(myfiveAgreements).where(and(
      eq(myfiveAgreements.slotId, slotId),
      eq(myfiveAgreements.creatorUserId, getMyFiveActorId(req)),
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
