import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  ACCOUNT_DELETION_SURVIVOR_DISCLOSURE,
  agreementCapabilities,
  JOINT_AGREEMENT_CREATION_DISCLOSURE,
  MYFIVE_INVITATION_RETENTION_DAYS,
  planJointAgreementDeletion,
} from "../shared/myfiveSurvivorCustody";

test("agreement capabilities fail closed and give a frozen record only survivor actions", () => {
  assert.deepEqual(agreementCapabilities("active", "active"), {
    canRead: true,
    canEdit: true,
    canExport: true,
    canDelete: false,
  });
  assert.deepEqual(agreementCapabilities("survivor", "frozen"), {
    canRead: true,
    canEdit: false,
    canExport: true,
    canDelete: true,
  });
  assert.deepEqual(agreementCapabilities("active", "frozen"), {
    canRead: false,
    canEdit: false,
    canExport: false,
    canDelete: false,
  });
  assert.deepEqual(agreementCapabilities("revoked", "active"), {
    canRead: false,
    canEdit: false,
    canExport: false,
    canDelete: false,
  });
});

test("the shared disclosures state survivor access, final erasure, and free-text risk", async () => {
  assert.match(JOINT_AGREEMENT_CREATION_DISCLOSURE, /remaining participant may continue to read, export, and delete/);
  assert.match(JOINT_AGREEMENT_CREATION_DISCLOSURE, /until they delete it or their account/);
  assert.match(ACCOUNT_DELETION_SURVIVOR_DISCLOSURE, /permanently revokes your access/);
  assert.match(ACCOUNT_DELETION_SURVIVOR_DISCLOSURE, /Free text may still refer to you/);
  assert.equal(MYFIVE_INVITATION_RETENTION_DAYS, 30);
  const prd = await readFile("docs/PRD.md", "utf8");
  assert.equal(prd.includes(JOINT_AGREEMENT_CREATION_DISCLOSURE), true);
  assert.equal(prd.includes(ACCOUNT_DELETION_SURVIVOR_DISCLOSURE), true);
});

test("joint-record deletion is symmetric for owner and partner and erases after the last account", () => {
  assert.deepEqual(planJointAgreementDeletion("owner-a", ["owner-a", "partner-b"]), {
    action: "freeze_for_survivor",
    survivorUserId: "partner-b",
  });
  assert.deepEqual(planJointAgreementDeletion("partner-b", ["owner-a", "partner-b"]), {
    action: "freeze_for_survivor",
    survivorUserId: "owner-a",
  });
  assert.deepEqual(planJointAgreementDeletion("partner-b", ["partner-b"]), {
    action: "erase_final_copy",
    survivorUserId: null,
  });
  assert.throws(
    () => planJointAgreementDeletion("owner-a", ["partner-b", "unexpected-c"]),
    /cannot have more than one surviving participant/,
  );
});

test("the additive migration models explicit participants without touching quarantined check-ins", async () => {
  const migration = await readFile("migrations/20260912_myfive_ownership_boundaries.sql", "utf8");
  assert.match(migration, /CREATE TABLE IF NOT EXISTS "myfive_connection_participants"/);
  assert.match(migration, /CHECK \("role" IN \('owner', 'partner'\)\)/);
  assert.match(migration, /CHECK \("lifecycle_state" IN \('active', 'survivor', 'revoked'\)\)/);
  assert.match(migration, /SELECT "id", "user_id", 'owner'/);
  assert.match(migration, /SELECT "id", "partner_user_id", 'partner'/);
  assert.match(migration, /ALTER COLUMN "creator_user_id" DROP NOT NULL/);
  assert.match(migration, /ADD COLUMN IF NOT EXISTS "survivor_user_id"/);
  assert.match(migration, /myfive_connection_slot_lifecycle_timestamp_check/);
  assert.match(migration, /myfive_agreement_lifecycle_custody_check/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS "myfive_agreement_custody_events"/);
  const custodyLedger = migration.slice(migration.indexOf('CREATE TABLE IF NOT EXISTS "myfive_agreement_custody_events"'), migration.indexOf('-- Acceptance, revocation'));
  assert.match(custodyLedger, /"actor_user_id" varchar NOT NULL/);
  assert.match(custodyLedger, /"connection_id" varchar NOT NULL/);
  assert.doesNotMatch(custodyLedger, /"(?:agreement_text|email|receipt_id|partner_user_id)"/);
  assert.doesNotMatch(migration, /(?:DELETE|UPDATE|INSERT)\s+(?:FROM|INTO)?\s*"?myfive_check_ins"?/i);
  assert.match(migration, /Roll back application queries without dropping columns or data/);
});

test("participant relations, rather than slot ownership, govern shared reads and exports", async () => {
  const source = await readFile("server/routes/myfive.ts", "utf8");
  const access = source.slice(source.indexOf("async function findAccessibleSlot"), source.indexOf("function serializeSlot"));
  assert.match(access, /from\(myfiveConnectionParticipants\)/);
  assert.match(access, /myfiveConnectionParticipants\.userId, actorUserId/);
  assert.match(access, /myfiveConnectionParticipants\.lifecycleState, "survivor"/);

  const dataExport = source.slice(source.indexOf('myfiveRouter.get("/data-export"'), source.indexOf('myfiveRouter.delete("/account"'));
  assert.match(dataExport, /from\(myfiveConnectionParticipants\)[\s\S]*innerJoin\(myfiveConnectionSlots/);
  assert.match(dataExport, /innerJoin\(myfiveAgreements/);
  assert.match(dataExport, /myfiveAgreements\.survivorUserId, userId/);
  assert.match(dataExport, /myfiveConnectionSlots\.lifecycleState, "locked"/);
  assert.match(dataExport, /myfiveConnectionSlots\.status, "siloed"/);
  assert.match(dataExport, /myfiveLoveProfileSnapshots\.actorUserId, userId/);
  assert.match(dataExport, /myfiveConsentLedger\.actorUserId, userId/);
  const agreementProjection = dataExport.slice(dataExport.indexOf("agreementVersions:"), dataExport.indexOf("consentReceipts:"));
  assert.doesNotMatch(agreementProjection, /slotOwnerUserId|slotPartnerUserId|ownerConsentReceiptId|partnerConsentReceiptId|partnerUserId/);

  const agreementRead = source.slice(source.indexOf('myfiveRouter.get("/agreements/:slotId"'), source.indexOf("// Append a new version"));
  const serializedActiveRead = agreementRead.slice(agreementRead.indexOf("res.json(latest ?"));
  assert.doesNotMatch(serializedActiveRead, /\bconsentGate\b/);
  assert.match(access, /myfiveConnectionSlots\.status, "active"/);
  assert.match(access, /myfiveConnectionSlots\.status, "siloed"/);
});

test("account deletion preserves the other author and freezes joint records for either survivor role", async () => {
  const source = await readFile("server/routes/myfive.ts", "utf8");
  const deletion = source.slice(source.indexOf('myfiveRouter.delete("/account"'), source.indexOf('myfiveRouter.post("/admin/eap-vouchers"'));
  assert.doesNotMatch(deletion, /ownedSlotSubquery/);
  assert.doesNotMatch(deletion, /DELETE FROM myfive_check_ins/);
  assert.match(deletion, /DELETE FROM myfive_love_profile_snapshots WHERE actor_user_id = \$1/);
  assert.match(deletion, /DELETE FROM myfive_consent_ledger WHERE actor_user_id = \$1/);
  assert.match(deletion, /DELETE FROM myfive_agreement_denied_events WHERE actor_user_id = \$1/);
  assert.match(deletion, /DELETE FROM myfive_agreement_custody_events WHERE actor_user_id = \$1/);
  assert.match(deletion, /creator_user_id = CASE WHEN creator_user_id = \$1 THEN NULL/);
  assert.match(deletion, /owner_consent_receipt_id = NULL/);
  assert.match(deletion, /lifecycle_state = 'frozen'/);
  assert.match(deletion, /survivor_user_id = \$2/);
  assert.match(deletion, /SET lifecycle_state = 'survivor'/);
  assert.match(deletion, /DELETE FROM myfive_connection_participants WHERE connection_id = \$1 AND user_id = \$2/);
  assert.match(deletion, /NOT EXISTS \(SELECT 1 FROM myfive_check_ins WHERE slot_id = slots\.id\)/);
});

test("survivor reads, exports, and deletions append data-minimized custody events", async () => {
  const source = await readFile("server/routes/myfive.ts", "utf8");
  const schema = await readFile("shared/schema.ts", "utf8");
  const custodySchema = schema.slice(
    schema.indexOf('myfiveAgreementCustodyEvents = pgTable'),
    schema.indexOf('// Immutable authorization events'),
  );
  assert.match(custodySchema, /actorUserId/);
  assert.match(custodySchema, /connectionId/);
  assert.match(custodySchema, /eventType/);
  assert.match(custodySchema, /outcome/);
  assert.doesNotMatch(custodySchema, /agreementText|email|receipt|partnerUserId/);

  const read = source.slice(source.indexOf('myfiveRouter.get("/agreements/:slotId"'), source.indexOf("// Append a new version"));
  assert.match(read, /eventType: "read"/);
  const deletion = source.slice(source.indexOf('myfiveRouter.delete("/agreements/:slotId"'), source.indexOf("// Read only the current actor"));
  assert.match(deletion, /'delete'/);
  assert.match(deletion, /"success" : "not_found"/);
  const dataExport = source.slice(source.indexOf('myfiveRouter.get("/data-export"'), source.indexOf('myfiveRouter.delete("/account"'));
  assert.match(dataExport, /eventType: "export"/);
});

test("provisional data expires or is owner-deleted and invitation secrets are purged on acceptance", async () => {
  const source = await readFile("server/routes/myfive.ts", "utf8");
  const cleanup = await readFile("server/myfive-provisional-cleanup.ts", "utf8");
  const server = await readFile("server/index.ts", "utf8");
  assert.match(source, /MYFIVE_INVITATION_RETENTION_DAYS \* 24 \* 60 \* 60 \* 1000/);
  assert.match(cleanup, /DELETE FROM myfive_invitations[\s\S]*expires_at <= now\(\)/);
  assert.match(cleanup, /SET partner_name = NULL, relation_type = NULL, status = 'empty'/);
  assert.match(server, /startMyFiveProvisionalCleanupScheduler\(\)/);
  assert.match(source, /myfiveRouter\.delete\("\/slots\/:slotId"/);
  assert.match(source, /Only an unaccepted provisional partner connection can be removed here/);
  const acceptance = source.slice(source.indexOf('myfiveRouter.post("/invitations/:token/accept"'), source.indexOf("// Alpha privacy boundary"));
  assert.match(acceptance, /INSERT INTO myfive_connection_participants/);
  assert.match(acceptance, /DELETE FROM myfive_invitations WHERE id = \$1/);

  const agreementUi = await readFile("client/src/pages/myfive/AgreementPage.tsx", "utf8");
  const consentUi = await readFile("client/src/components/myfive/ValueRulesConsentGate.tsx", "utf8");
  const settingsUi = await readFile("client/src/pages/myfive/SettingsPage.tsx", "utf8");
  assert.match(agreementUi, /survivor_locked/);
  assert.match(agreementUi, /Permanently delete frozen agreement/);
  assert.match(consentUi, /JOINT_AGREEMENT_CREATION_DISCLOSURE/);
  assert.match(settingsUi, /ACCOUNT_DELETION_SURVIVOR_DISCLOSURE/);
  assert.match(agreementUi, /highly sensitive personal data/);
  assert.match(source, /survivorAgreementAvailable/);
});
