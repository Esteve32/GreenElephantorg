import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  agreementConsentStateForActor,
  evaluateBilateralValueRulesGate,
  latestCurrentValueRulesReceipt,
  type MyFiveBilateralSlot,
  type MyFiveConsentEvent,
} from "../server/routes/myfive-consent-policy";
import { VALUE_RULE_IDS } from "../shared/valueRules";

const currentVersion = "1.0";
const nextVersion = "2.0";
const linkedSlot: MyFiveBilateralSlot = {
  id: "slot-1",
  userId: "client-a",
  partnerUserId: "client-b",
  status: "active",
  isSelfVault: "false",
};

function accepted(id: string, actorUserId: string, overrides: Partial<MyFiveConsentEvent> = {}): MyFiveConsentEvent {
  return {
    id,
    actorUserId,
    slotId: "slot-1",
    consentType: "agreement-sharing",
    eventType: "accepted",
    rulesVersion: currentVersion,
    acceptedRuleIds: VALUE_RULE_IDS,
    acceptedAt: new Date(`2030-01-01T00:00:0${id.slice(-1)}.000Z`),
    ...overrides,
  };
}

test("first consent cannot satisfy the linked partner's bilateral ValueRules requirement", () => {
  const result = evaluateBilateralValueRulesGate({
    actorUserId: "client-a",
    slot: linkedSlot,
    rulesVersion: currentVersion,
    consentEvents: [accepted("receipt-a1", "client-a")],
  });

  assert.deepEqual(result, {
    allowed: false,
    reasonCode: "partner_current_consent_missing",
    ownerUserId: "client-a",
    partnerUserId: "client-b",
    rulesVersion: currentVersion,
  });
  assert.equal(agreementConsentStateForActor(result, "client-a"), "partner_consent_pending");
});

test("second independent consent unlocks shared agreement writes with exact receipt evidence", () => {
  const result = evaluateBilateralValueRulesGate({
    actorUserId: "client-b",
    slot: linkedSlot,
    rulesVersion: currentVersion,
    consentEvents: [
      accepted("receipt-a1", "client-a"),
      accepted("receipt-b1", "client-b"),
    ],
  });

  assert.deepEqual(result, {
    allowed: true,
    ownerUserId: "client-a",
    partnerUserId: "client-b",
    ownerConsentReceiptId: "receipt-a1",
    partnerConsentReceiptId: "receipt-b1",
    rulesVersion: currentVersion,
  });
});

test("missing, incomplete, withdrawn, and outdated consent all fail closed", () => {
  assert.equal(latestCurrentValueRulesReceipt([], "client-a", "slot-1", currentVersion), null);
  assert.equal(latestCurrentValueRulesReceipt([
    accepted("receipt-a1", "client-a", { acceptedRuleIds: VALUE_RULE_IDS.slice(0, 8) }),
  ], "client-a", "slot-1", currentVersion), null);
  assert.equal(latestCurrentValueRulesReceipt([
    accepted("receipt-a1", "client-a"),
    accepted("receipt-a2", "client-a", {
      eventType: "withdrawn",
      acceptedRuleIds: [],
      acceptedAt: new Date("2030-01-01T00:00:09.000Z"),
    }),
  ], "client-a", "slot-1", currentVersion), null);
  assert.equal(latestCurrentValueRulesReceipt([
    accepted("receipt-a1", "client-a", { rulesVersion: nextVersion }),
  ], "client-a", "slot-1", currentVersion), null);
});

test("relinking a slot invalidates the prior partner receipt and unrelated users are rejected", () => {
  const relinkedSlot = { ...linkedSlot, partnerUserId: "client-c" };
  const relinked = evaluateBilateralValueRulesGate({
    actorUserId: "client-a",
    slot: relinkedSlot,
    rulesVersion: currentVersion,
    consentEvents: [
      accepted("receipt-a1", "client-a"),
      accepted("receipt-b1", "client-b"),
    ],
  });
  assert.equal(relinked.allowed, false);
  assert.equal(relinked.reasonCode, "partner_current_consent_missing");

  const unrelated = evaluateBilateralValueRulesGate({
    actorUserId: "outsider",
    slot: linkedSlot,
    rulesVersion: currentVersion,
    consentEvents: [
      accepted("receipt-a1", "client-a"),
      accepted("receipt-b1", "client-b"),
      accepted("receipt-outsider", "outsider"),
    ],
  });
  assert.equal(unrelated.allowed, false);
  assert.equal(unrelated.reasonCode, "actor_not_linked_participant");
});

test("labels, email strings, session ids, and replayed receipt ids cannot substitute for linked account ids", () => {
  const unlinkedSlot = {
    ...linkedSlot,
    partnerUserId: null,
  };
  const result = evaluateBilateralValueRulesGate({
    actorUserId: "client-a",
    slot: unlinkedSlot,
    rulesVersion: currentVersion,
    consentEvents: [
      accepted("receipt-a1", "client-a"),
      accepted("receipt-email", "partner@example.test"),
      accepted("receipt-session", "session:slot-1"),
    ],
  });
  assert.equal(result.allowed, false);
  assert.equal(result.reasonCode, "slot_not_linked");

  const replayAttempt = evaluateBilateralValueRulesGate({
    actorUserId: "client-a",
    slot: linkedSlot,
    rulesVersion: currentVersion,
    consentEvents: [
      accepted("replayed-partner-receipt", "client-a"),
      accepted("receipt-a1", "client-a"),
    ],
  });
  assert.equal(replayAttempt.allowed, false);
  assert.equal(replayAttempt.reasonCode, "partner_current_consent_missing");
});

test("agreement route uses a transaction lock, appends sanitized denials, and does not trust client receipt ids", async () => {
  const source = await readFile("server/routes/myfive.ts", "utf8");
  assert.match(source, /pg_advisory_xact_lock\(hashtext\(\$1\)\)/);
  assert.match(source, /INSERT INTO myfive_agreement_denied_events/);
  assert.match(source, /reason_code, rules_version/);
  const deniedInsert = source.slice(
    source.indexOf("INSERT INTO myfive_agreement_denied_events"),
    source.indexOf("await client.query(\"COMMIT\");", source.indexOf("INSERT INTO myfive_agreement_denied_events")),
  );
  assert.doesNotMatch(deniedInsert, /private_reflection|profile|agreement_text/);
  assert.doesNotMatch(source, /const \{ agreementText, consentReceiptId, expectedVersion \}/);
  assert.match(source, /owner_consent_receipt_id, partner_consent_receipt_id/);

  const migration = await readFile("migrations/20260911_myfive_bilateral_value_rules_consent.sql", "utf8");
  assert.match(migration, /not promoted to receipt evidence/);
  assert.match(migration, /ADD COLUMN IF NOT EXISTS "event_type"/);
});
