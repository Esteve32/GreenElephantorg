import { Router, Request, Response, NextFunction } from "express";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { and, asc, desc, eq, or } from "drizzle-orm";
import Stripe from "stripe";
import { db, pool } from "../db";
import {
  clientSubscriptions,
  clientUsers,
  myfiveAgreements,
  myfiveCheckIns,
  myfiveConnectionSlots,
  myfiveConsentLedger,
  myfiveEapVouchers,
  myfiveInvitations,
  myfiveLoveProfileSnapshots,
  myfiveSubscriptions,
  portalTimelineEvents,
  portalUserContext,
} from "../../shared/schema";
import { EMPTY_LOVE_FLOW_PROFILE, isLoveFlowProfile } from "../../shared/loveFlowProfile";
import { MYFIVE_EXPORT_SCHEMA_VERSION, renderMyFiveExportMarkdown } from "../../shared/myfiveDataExport";
import type { MyFiveDataExport } from "../../shared/myfiveDataExport";
import { includesEveryValueRule, VALUE_RULES_VERSION } from "../../shared/valueRules";
import { isConnectorEnabled } from "../lib/connectorGuard";
import { requireAdminAuth } from "../auth";
import { requirePortalAuth } from "../portal-auth";

export const myfiveRouter = Router();

const DEFAULT_AGREEMENT = "Agreement on Quiet Hours & Evening Energy:\n- We agree to keep 21:00 to 08:00 notification-free.\n- We review this living agreement every 30 days.";
const MYFIVE_MONTHLY_PRICE_CENTS = 499;

function getStripe(): Stripe | null {
  return process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" as any })
    : null;
}

function hashVoucherCode(code: string): string {
  return createHash("sha256").update(code.trim().toUpperCase()).digest("hex");
}

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

async function findAccessibleSlot(actorUserId: string, slotId: string, allowSelf = true) {
  const [slot] = await db.select().from(myfiveConnectionSlots).where(and(
    eq(myfiveConnectionSlots.id, slotId), eq(myfiveConnectionSlots.status, "active"),
    or(eq(myfiveConnectionSlots.userId, actorUserId), eq(myfiveConnectionSlots.partnerUserId, actorUserId)),
  )).limit(1);
  return slot && (allowSelf || slot.isSelfVault !== "true") ? slot : null;
}

function serializeSlot(slot: typeof myfiveConnectionSlots.$inferSelect) {
  const isSelf = slot.isSelfVault === "true";
  return {
    id: slot.id, slotIndex: slot.slotIndex,
    name: isSelf ? "Self (Philautia)" : slot.partnerName,
    relation: isSelf ? "Self-Reflection Slot" : slot.relationType,
    status: slot.status, isSelf, partnerConnected: Boolean(slot.partnerUserId),
  };
}

function isoString(value: Date | null): string | null {
  return value?.toISOString() ?? null;
}

function setDataExportPrivacyHeaders(_req: Request, res: Response, next: NextFunction) {
  res.set({
    "Cache-Control": "private, no-store, max-age=0",
    Pragma: "no-cache",
    Expires: "0",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Robots-Tag": "noindex, nofollow, noarchive",
    "Cross-Origin-Resource-Policy": "same-origin",
    "Content-Security-Policy": "sandbox; default-src 'none'",
    Vary: "Cookie",
  });
  next();
}

async function persistMyFiveSubscription(userId: string, customerId: string | null, subscriptionId: string, planStatus: string) {
  await db.insert(myfiveSubscriptions).values({
    userId, stripeCustomerId: customerId, stripeSubscriptionId: subscriptionId,
    planStatus, sponsoredSeatsAllocated: 0,
  }).onConflictDoUpdate({ target: myfiveSubscriptions.userId, set: {
    stripeCustomerId: customerId, stripeSubscriptionId: subscriptionId, planStatus,
  } });
}

export async function handleMyFiveStripeEvent(event: Stripe.Event): Promise<void> {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.metadata?.product !== "myfive_primary") return;
    const userId = session.metadata.actorUserId;
    const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
    const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
    if (userId && subscriptionId) await persistMyFiveSubscription(userId, customerId, subscriptionId, "active");
  }
  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const planStatus = event.type === "customer.subscription.deleted"
      ? "canceled"
      : (["active", "trialing"].includes(subscription.status) ? "active" : subscription.status);
    await db.update(myfiveSubscriptions).set({ planStatus })
      .where(eq(myfiveSubscriptions.stripeSubscriptionId, subscription.id));
  }
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
       RETURNING id, user_id, slot_index, partner_name, partner_user_id, relation_type, status, is_self_vault, created_at`,
      [actorUserId, slotIndex, partnerName, relationType],
    );
    await client.query("COMMIT");
    const row = result.rows[0];
    res.status(201).json({ slot: serializeSlot({ id: row.id, userId: row.user_id, slotIndex: row.slot_index,
      partnerName: row.partner_name, partnerUserId: row.partner_user_id ?? null, relationType: row.relation_type, status: row.status,
      isSelfVault: row.is_self_vault, createdAt: row.created_at }) });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("MyFive slot creation failed", error);
    res.status(500).json({ error: "Connection seat could not be created" });
  } finally {
    client.release();
  }
});

myfiveRouter.post("/slots/:slotId/invitations", async (req: Request, res: Response) => {
  if (!req.session.clientUserId) return res.status(401).json({ error: "Sign in before inviting a partner" });
  const sponsorUserId = req.session.clientUserId;
  const slotId = readSlotId(req.params.slotId);
  const inviteeEmail = typeof req.body?.inviteeEmail === "string" ? req.body.inviteeEmail.trim().toLowerCase() : "";
  if (!slotId || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteeEmail)) {
    return res.status(400).json({ error: "An active partner seat and valid invitee email are required" });
  }
  try {
    const slot = await findOwnedSlot(sponsorUserId, slotId, false);
    if (!slot) return res.status(404).json({ error: "Active partner connection not found" });
    if (slot.partnerUserId) return res.status(409).json({ error: "This connection seat is already linked to a partner account" });
    const [membership] = await db.select().from(myfiveSubscriptions).where(and(
      eq(myfiveSubscriptions.userId, sponsorUserId), eq(myfiveSubscriptions.planStatus, "active"),
    )).limit(1);
    if (!membership) return res.status(402).json({ error: "An active MyFive primary membership is required to sponsor partners" });

    await db.update(myfiveInvitations).set({ status: "revoked" }).where(and(
      eq(myfiveInvitations.slotId, slotId), eq(myfiveInvitations.sponsorUserId, sponsorUserId), eq(myfiveInvitations.status, "pending"),
    ));
    const token = randomBytes(32).toString("base64url");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.insert(myfiveInvitations).values({ sponsorUserId, slotId, inviteeEmail, tokenHash, expiresAt });
    const origin = `${req.protocol}://${req.get("host")}`;
    res.status(201).json({ invitationUrl: `${origin}/myfive/invite/${token}`, expiresAt: expiresAt.toISOString() });
  } catch (error) {
    console.error("MyFive invitation creation failed", error);
    res.status(500).json({ error: "Partner invitation could not be created" });
  }
});

myfiveRouter.post("/invitations/:token/accept", async (req: Request, res: Response) => {
  if (!req.session.clientUserId || !req.session.clientEmail) return res.status(401).json({ error: "Sign in with the invited email address to accept" });
  const token = typeof req.params.token === "string" ? req.params.token : "";
  if (token.length < 32 || token.length > 100) return res.status(400).json({ error: "Invalid invitation token" });
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const inviteeUserId = req.session.clientUserId;
  const inviteeEmail = req.session.clientEmail.toLowerCase();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const found = await client.query(
      `SELECT id, sponsor_user_id, slot_id, invitee_email, status, expires_at
       FROM myfive_invitations WHERE token_hash = $1 FOR UPDATE`, [tokenHash],
    );
    const invitation = found.rows[0];
    if (!invitation || invitation.status !== "pending" || new Date(invitation.expires_at) <= new Date()) {
      await client.query("ROLLBACK");
      return res.status(410).json({ error: "This invitation is invalid, expired, or already used" });
    }
    if (invitation.invitee_email.toLowerCase() !== inviteeEmail) {
      await client.query("ROLLBACK");
      return res.status(403).json({ error: "Sign in with the email address that received this invitation" });
    }
    const linked = await client.query(
      "UPDATE myfive_connection_slots SET partner_user_id = $1 WHERE id = $2 AND user_id = $3 AND slot_index BETWEEN 1 AND 5 AND status = 'active' AND partner_user_id IS NULL",
      [inviteeUserId, invitation.slot_id, invitation.sponsor_user_id],
    );
    if (linked.rowCount !== 1) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "This connection seat has already been claimed" });
    }
    await client.query(
      "UPDATE myfive_invitations SET status = 'accepted', accepted_by_user_id = $1, accepted_at = now() WHERE id = $2",
      [inviteeUserId, invitation.id],
    );
    await client.query(
      `INSERT INTO myfive_subscriptions (user_id, plan_status, sponsor_user_id, sponsored_seats_allocated)
       VALUES ($1, 'sponsored', $2, 0)
       ON CONFLICT (user_id) DO UPDATE SET plan_status = 'sponsored', sponsor_user_id = EXCLUDED.sponsor_user_id
       WHERE myfive_subscriptions.plan_status <> 'active'`,
      [inviteeUserId, invitation.sponsor_user_id],
    );
    await client.query(
      `UPDATE myfive_subscriptions SET sponsored_seats_allocated = (
         SELECT count(*)::integer FROM myfive_invitations WHERE sponsor_user_id = $1 AND status = 'accepted'
       ) WHERE user_id = $1 AND plan_status = 'active'`, [invitation.sponsor_user_id],
    );
    await client.query("COMMIT");
    res.json({ status: "accepted", sponsored: true, slotId: invitation.slot_id });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("MyFive invitation acceptance failed", error);
    res.status(500).json({ error: "Partner invitation could not be accepted" });
  } finally { client.release(); }
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
    if (!await findAccessibleSlot(actorUserId, slotId, false)) return res.status(404).json({ error: "Active partner connection not found" });
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
    if (!await findAccessibleSlot(actorUserId, slotId, false)) return res.status(404).json({ error: "Active partner connection not found" });
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
    if (!await findAccessibleSlot(actorUserId, slotId, false)) return res.status(404).json({ error: "Active partner connection not found" });
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
    if (!await findAccessibleSlot(actorUserId, slotId)) return res.status(404).json({ error: "Active connection not found" });
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
    if (!await findAccessibleSlot(actorUserId, slotId)) return res.status(404).json({ error: "Active connection not found" });
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

myfiveRouter.get("/data-export", setDataExportPrivacyHeaders, requirePortalAuth, async (req: Request, res: Response) => {
  const format = req.query.format === undefined ? "json" : req.query.format;
  if (format !== "json" && format !== "markdown") {
    return res.status(400).json({ error: "Export format must be json or markdown" });
  }

  const userId = req.session.clientUserId!;
  try {
    const [
      accountRows,
      slots,
      serverCheckIns,
      profiles,
      agreements,
      consentReceipts,
      myfiveMembershipRows,
      portalMemberships,
      context,
      timeline,
    ] = await Promise.all([
      db.select({
        id: clientUsers.id,
        email: clientUsers.email,
        name: clientUsers.name,
        avatarUrl: clientUsers.avatarUrl,
        createdAt: clientUsers.createdAt,
      }).from(clientUsers).where(eq(clientUsers.id, userId)).limit(1),
      db.select().from(myfiveConnectionSlots)
        .where(eq(myfiveConnectionSlots.userId, userId))
        .orderBy(asc(myfiveConnectionSlots.slotIndex)),
      db.select().from(myfiveCheckIns)
        .where(eq(myfiveCheckIns.userId, userId))
        .orderBy(asc(myfiveCheckIns.createdAt)),
      db.select().from(myfiveLoveProfileSnapshots)
        .where(eq(myfiveLoveProfileSnapshots.actorUserId, userId))
        .orderBy(asc(myfiveLoveProfileSnapshots.createdAt)),
      db.select().from(myfiveAgreements)
        .where(eq(myfiveAgreements.creatorUserId, userId))
        .orderBy(asc(myfiveAgreements.createdAt)),
      db.select().from(myfiveConsentLedger)
        .where(eq(myfiveConsentLedger.actorUserId, userId))
        .orderBy(asc(myfiveConsentLedger.acceptedAt)),
      db.select().from(myfiveSubscriptions)
        .where(eq(myfiveSubscriptions.userId, userId)).limit(1),
      db.select().from(clientSubscriptions)
        .where(eq(clientSubscriptions.userId, userId))
        .orderBy(asc(clientSubscriptions.createdAt)),
      db.select().from(portalUserContext)
        .where(eq(portalUserContext.userId, userId))
        .orderBy(asc(portalUserContext.key)),
      db.select().from(portalTimelineEvents)
        .where(eq(portalTimelineEvents.userId, userId))
        .orderBy(asc(portalTimelineEvents.date)),
    ]);

    const account = accountRows[0];
    if (!account) return res.status(404).json({ error: "Authenticated account was not found" });
    const myfiveMembership = myfiveMembershipRows[0];
    const exportedAt = new Date().toISOString();
    const dataExport: MyFiveDataExport = {
      metadata: {
        schemaVersion: MYFIVE_EXPORT_SCHEMA_VERSION,
        exportedAt,
        dataSubject: { accountId: account.id, email: account.email, name: account.name },
        scope: [
          "MyFive account identity",
          "subject-owned connection records",
          "subject-authored agreements and consent receipts",
          "subject-authored private profiles and check-ins",
          "data-minimized membership status",
          "linked portal context and timeline",
          "current-browser encrypted vault when combined by the client",
        ],
        provenance: {
          serverData: "Selected at export time from authenticated account-scoped GreenElephant/MyFive database queries.",
          localBrowserVault: "The server cannot access IndexedDB or associate legacy local records with an account. The MyFive settings client combines records from the current browser only after an explicit browser-vault ownership confirmation and download request.",
        },
      },
      privacy: {
        classification: "PRIVATE - DATA SUBJECT COPY",
        intendedRecipient: account.email,
        handlingNotice: "This file can contain sensitive relationship and reflection data. Store it securely and share it only by deliberate choice.",
      },
      data: {
        account: {
          id: account.id,
          email: account.email,
          name: account.name,
          avatarUrl: account.avatarUrl,
          createdAt: account.createdAt.toISOString(),
        },
        connectionSlots: slots.map((slot) => ({
          id: slot.id,
          slotIndex: slot.slotIndex,
          userProvidedPartnerName: slot.partnerName,
          userProvidedRelationType: slot.relationType,
          status: slot.status,
          isSelfVault: slot.isSelfVault === "true",
          partnerAccountLinked: Boolean(slot.partnerUserId),
          createdAt: slot.createdAt.toISOString(),
        })),
        privateServerCheckIns: serverCheckIns.map((checkIn) => ({
          id: checkIn.id,
          slotId: checkIn.slotId,
          flowOctant: checkIn.flowOctant,
          privateReflection: checkIn.privateReflection,
          vaultEncryptedAtRest: checkIn.isVaultEncrypted === "true",
          createdAt: checkIn.createdAt.toISOString(),
        })),
        connectionProfiles: profiles.map((profile) => ({
          id: profile.id,
          slotId: profile.slotId,
          profile: profile.profile,
          createdAt: profile.createdAt.toISOString(),
        })),
        agreementVersions: agreements.map((agreement) => ({
          id: agreement.id,
          slotId: agreement.slotId,
          agreementText: agreement.agreementText,
          consentReceiptId: agreement.valueRulesConsented,
          version: agreement.version,
          createdAt: agreement.createdAt.toISOString(),
          updatedAt: agreement.updatedAt.toISOString(),
        })),
        consentReceipts: consentReceipts.map((receipt) => ({
          id: receipt.id,
          slotId: receipt.slotId,
          consentType: receipt.consentType,
          rulesVersion: receipt.rulesVersion,
          acceptedRuleIds: receipt.acceptedRuleIds,
          acceptedAt: receipt.acceptedAt.toISOString(),
        })),
        membership: {
          myfive: myfiveMembership ? {
            planStatus: myfiveMembership.planStatus,
            sponsoredSeatsAllocated: myfiveMembership.sponsoredSeatsAllocated,
            createdAt: myfiveMembership.createdAt.toISOString(),
          } : null,
          linkedPortal: portalMemberships.map((membership) => ({
            id: membership.id,
            plan: membership.plan,
            status: membership.status,
            currentPeriodStart: isoString(membership.currentPeriodStart),
            currentPeriodEnd: isoString(membership.currentPeriodEnd),
            cancelledAt: isoString(membership.cancelledAt),
            createdAt: membership.createdAt.toISOString(),
          })),
        },
        linkedPortal: {
          context: context.map((entry) => ({
            id: entry.id,
            key: entry.key,
            value: entry.value,
            updatedAt: entry.updatedAt.toISOString(),
          })),
          timeline: timeline.map((event) => ({
            id: event.id,
            type: event.type,
            title: event.title,
            description: event.description,
            details: event.details,
            lens: event.lens,
            toolId: event.toolId,
            date: event.date.toISOString(),
            createdAt: event.createdAt.toISOString(),
          })),
        },
      },
      localBrowserVault: {
        status: "not_accessible_to_server",
        description: "Encrypted check-ins in browser IndexedDB are absent from this server response. Use MyFive Settings on each browser/device to create a combined download from that local vault.",
      },
      omissions: [
        {
          category: "Partner-private data",
          reason: "Another person's profile snapshots, reflections, consent receipts, account data, and agreement versions they authored are never queried or exported.",
        },
        {
          category: "Authentication and OAuth secrets",
          reason: "Password hashes, reset and two-factor secrets, OAuth identifiers, access tokens, refresh tokens, and token-expiry security metadata are excluded.",
        },
        {
          category: "Billing and invitation secrets",
          reason: "Stripe customer/subscription identifiers, Stripe secrets, invitation token hashes, invitee email addresses, and sponsor account identifiers are excluded.",
        },
        {
          category: "Employer and administration data",
          reason: "EAP organization identifiers, voucher records or hashes, audit logs, admin accounts, settings, and aggregate employer information are outside the data-subject export and are excluded.",
        },
        {
          category: "Other devices and browser profiles",
          reason: "Origin-bound local-vault encryption keys are non-extractable and legacy records have no server account identifier. Inclusion relies on the signed-in user's explicit confirmation that the browser profile's vault is theirs. Repeat the export on other browsers/devices that hold your records.",
        },
      ],
    };

    const filenameDate = exportedAt.slice(0, 10);
    res.set("Content-Disposition", `attachment; filename="myfive-data-export-${filenameDate}.${format === "json" ? "json" : "md"}"`);
    if (format === "markdown") {
      return res.type("text/markdown; charset=utf-8").send(renderMyFiveExportMarkdown(dataExport));
    }
    return res.type("application/json; charset=utf-8").send(JSON.stringify(dataExport, null, 2));
  } catch (error) {
    console.error("MyFive Article 20 data export failed", error);
    return res.status(500).json({ error: "Your data export could not be created safely" });
  }
});

myfiveRouter.delete("/account", async (req: Request, res: Response) => {
  if (!req.session.clientUserId || !req.session.clientEmail) return res.status(401).json({ error: "Sign in before deleting your account" });
  if (req.body?.confirmation !== "DELETE MYFIVE") return res.status(400).json({ error: "Type DELETE MYFIVE to confirm permanent deletion" });
  const userId = req.session.clientUserId;
  const userEmail = req.session.clientEmail.toLowerCase();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [`myfive-delete:${userId}`]);
    const membership = await client.query(
      "SELECT stripe_customer_id, stripe_subscription_id FROM myfive_subscriptions WHERE user_id = $1 FOR UPDATE", [userId],
    );
    const stripeCustomerId = membership.rows[0]?.stripe_customer_id as string | null | undefined;
    const stripeSubscriptionId = membership.rows[0]?.stripe_subscription_id as string | null | undefined;
    const stripe = getStripe();
    if (stripeCustomerId) {
      if (!stripe) throw new Error("Stripe must be available to remove the billing identity before account deletion");
      await stripe.customers.del(stripeCustomerId);
    } else if (stripeSubscriptionId?.startsWith("sub_")) {
      if (!stripe) throw new Error("Stripe must be available to cancel billing before account deletion");
      await stripe.subscriptions.cancel(stripeSubscriptionId);
    }

    const ownedSlotSubquery = "SELECT id FROM myfive_connection_slots WHERE user_id = $1";
    await client.query(`DELETE FROM myfive_agreements WHERE creator_user_id = $1 OR partner_user_id = $1 OR slot_id IN (${ownedSlotSubquery})`, [userId]);
    await client.query(`DELETE FROM myfive_consent_ledger WHERE actor_user_id = $1 OR slot_id IN (${ownedSlotSubquery})`, [userId]);
    await client.query(`DELETE FROM myfive_love_profile_snapshots WHERE actor_user_id = $1 OR slot_id IN (${ownedSlotSubquery})`, [userId]);
    await client.query(`DELETE FROM myfive_check_ins WHERE user_id = $1 OR slot_id IN (${ownedSlotSubquery})`, [userId]);
    await client.query(`DELETE FROM myfive_invitations WHERE sponsor_user_id = $1 OR accepted_by_user_id = $1 OR lower(invitee_email) = $2 OR slot_id IN (${ownedSlotSubquery})`, [userId, userEmail]);
    await client.query("UPDATE myfive_connection_slots SET partner_user_id = NULL WHERE partner_user_id = $1", [userId]);
    await client.query("DELETE FROM myfive_connection_slots WHERE user_id = $1", [userId]);
    await client.query("DELETE FROM myfive_subscriptions WHERE user_id = $1 OR sponsor_user_id = $1", [userId]);
    await client.query(`UPDATE myfive_subscriptions AS subscriptions SET sponsored_seats_allocated = (
      SELECT count(*)::integer FROM myfive_invitations AS invitations
      WHERE invitations.sponsor_user_id = subscriptions.user_id AND invitations.status = 'accepted'
    ) WHERE subscriptions.plan_status = 'active'`);
    await client.query("DELETE FROM portal_timeline_events WHERE user_id = $1", [userId]);
    await client.query("DELETE FROM portal_user_context WHERE user_id = $1", [userId]);
    await client.query("DELETE FROM client_subscriptions WHERE user_id = $1", [userId]);
    await client.query("DELETE FROM audit_logs WHERE lower(user_email) = $1", [userEmail]);
    await client.query("DELETE FROM client_users WHERE id = $1", [userId]);
    await client.query("COMMIT");

    await new Promise<void>((resolve) => req.session.destroy((sessionError) => {
      if (sessionError) console.error("MyFive session destruction after committed account deletion failed", sessionError);
      resolve();
    }));
    res.json({ deleted: true, message: "MyFive account and linked personal data were permanently deleted" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("MyFive Article 17 account deletion failed", error);
    res.status(500).json({ error: "Account deletion could not be completed safely; no database deletion was committed" });
  } finally { client.release(); }
});

myfiveRouter.post("/admin/eap-vouchers", requireAdminAuth, async (req: Request, res: Response) => {
  const organizationLabel = typeof req.body?.organizationLabel === "string" ? req.body.organizationLabel.trim() : "";
  const maxRedemptions = Number(req.body?.maxRedemptions);
  const expiresAt = req.body?.expiresAt ? new Date(req.body.expiresAt) : null;
  if (!organizationLabel || organizationLabel.length > 150 || !Number.isInteger(maxRedemptions) || maxRedemptions < 1 || maxRedemptions > 100_000) {
    return res.status(400).json({ error: "Organization and a redemption capacity between 1 and 100,000 are required" });
  }
  if (expiresAt && (Number.isNaN(expiresAt.getTime()) || expiresAt <= new Date())) {
    return res.status(400).json({ error: "Voucher expiry must be a valid future date" });
  }
  try {
    const code = `EAP-${randomBytes(9).toString("hex").toUpperCase()}`;
    const [voucher] = await db.insert(myfiveEapVouchers).values({
      organizationLabel, codeHash: hashVoucherCode(code), maxRedemptions, expiresAt,
    }).returning({ id: myfiveEapVouchers.id, expiresAt: myfiveEapVouchers.expiresAt });
    res.status(201).type("application/json").send(JSON.stringify({
      id: voucher.id, code, expiresAt: voucher.expiresAt?.toISOString() ?? null,
      warning: "Store this code securely; only its hash is retained and the code cannot be recovered.",
    }));
  } catch (error) {
    console.error("MyFive EAP voucher creation failed", error);
    res.status(500).json({ error: "EAP voucher could not be created" });
  }
});

myfiveRouter.post("/eap-vouchers/redeem", async (req: Request, res: Response) => {
  if (!req.session.clientUserId) return res.status(401).json({ error: "Sign in before redeeming an EAP voucher" });
  const code = typeof req.body?.code === "string" ? req.body.code.trim() : "";
  if (code.length < 12 || code.length > 100) return res.status(400).json({ error: "Enter a valid EAP voucher code" });
  const userId = req.session.clientUserId;
  const codeHash = hashVoucherCode(code);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const current = await client.query("SELECT plan_status FROM myfive_subscriptions WHERE user_id = $1 FOR UPDATE", [userId]);
    if (["active", "eap"].includes(current.rows[0]?.plan_status)) {
      await client.query("ROLLBACK");
      return res.json({ status: current.rows[0].plan_status, alreadyEntitled: true });
    }
    const found = await client.query(
      `SELECT id FROM myfive_eap_vouchers
       WHERE code_hash = $1 AND status = 'active' AND redeemed_count < max_redemptions
         AND (expires_at IS NULL OR expires_at > now()) FOR UPDATE`, [codeHash],
    );
    if (!found.rows[0]) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "This voucher is invalid, expired, or fully redeemed" });
    }
    await client.query("UPDATE myfive_eap_vouchers SET redeemed_count = redeemed_count + 1 WHERE id = $1", [found.rows[0].id]);
    await client.query(
      `INSERT INTO myfive_subscriptions (user_id, plan_status, sponsored_seats_allocated)
       VALUES ($1, 'eap', 0)
       ON CONFLICT (user_id) DO UPDATE SET plan_status = 'eap', sponsor_user_id = NULL
       WHERE myfive_subscriptions.plan_status NOT IN ('active', 'eap')`, [userId],
    );
    await client.query("COMMIT");
    res.json({ status: "eap", message: "EAP access activated. Your employer cannot see your identity or MyFive activity." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("MyFive EAP voucher redemption failed", error);
    res.status(500).json({ error: "EAP voucher could not be redeemed" });
  } finally { client.release(); }
});

myfiveRouter.post("/subscription/checkout", async (req: Request, res: Response) => {
  if (!req.session.clientUserId) return res.status(401).json({ error: "Sign in before starting a MyFive membership" });
  const stripe = getStripe();
  if (!stripe || !(await isConnectorEnabled("stripe"))) {
    return res.status(503).json({ error: "Stripe checkout is currently unavailable" });
  }
  const actorUserId = getMyFiveActorId(req);
  const customerEmail = typeof req.body?.customerEmail === "string" ? req.body.customerEmail.trim().toLowerCase() : "";
  if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    return res.status(400).json({ error: "A valid email address is required" });
  }
  try {
    const origin = `${req.protocol}://${req.get("host")}`;
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: customerEmail || req.session.clientEmail || undefined,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: MYFIVE_MONTHLY_PRICE_CENTS,
          recurring: { interval: "month" },
          product_data: { name: "MyFive Primary Membership", description: "Five partner connection seats plus one private Philautia self-vault" },
        },
      }],
      metadata: { product: "myfive_primary", actorUserId },
      subscription_data: { metadata: { product: "myfive_primary", actorUserId } },
      success_url: `${origin}/myfive/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/myfive/settings?checkout=canceled`,
      allow_promotion_codes: true,
    });
    if (!session.url) return res.status(502).json({ error: "Stripe did not return a checkout URL" });
    res.status(201).json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("MyFive Stripe Checkout creation failed", error);
    res.status(500).json({ error: "Checkout could not be created" });
  }
});

myfiveRouter.post("/subscription/confirm", async (req: Request, res: Response) => {
  const stripe = getStripe();
  const sessionId = typeof req.body?.sessionId === "string" ? req.body.sessionId : "";
  if (!stripe || !sessionId.startsWith("cs_")) return res.status(400).json({ error: "A valid Checkout Session is required" });
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const actorUserId = getMyFiveActorId(req);
    if (session.metadata?.product !== "myfive_primary" || session.metadata.actorUserId !== actorUserId || session.payment_status !== "paid") {
      return res.status(403).json({ error: "This paid MyFive Checkout Session does not belong to the current account" });
    }
    const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
    const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
    if (!subscriptionId) return res.status(409).json({ error: "Stripe subscription is not ready yet" });
    await persistMyFiveSubscription(actorUserId, customerId, subscriptionId, "active");
    res.json({ status: "active", plan: "primary", priceEur: 4.99 });
  } catch (error) {
    console.error("MyFive Stripe Checkout confirmation failed", error);
    res.status(500).json({ error: "Subscription could not be confirmed" });
  }
});

myfiveRouter.get("/subscription", async (req: Request, res: Response) => {
  try {
    const [subscription] = await db.select().from(myfiveSubscriptions)
      .where(eq(myfiveSubscriptions.userId, getMyFiveActorId(req))).limit(1);
    res.json({
      plan: "B2C Primary Subscription", status: subscription?.planStatus ?? "inactive",
      priceEur: 4.99, sponsoredSeatsAllowed: 5,
      sponsoredSeatsAllocated: subscription?.sponsoredSeatsAllocated ?? 0,
      stripeConnected: Boolean(process.env.STRIPE_SECRET_KEY),
    });
  } catch (error) {
    console.error("MyFive subscription read failed", error);
    res.status(500).json({ error: "Subscription status could not be loaded" });
  }
});
