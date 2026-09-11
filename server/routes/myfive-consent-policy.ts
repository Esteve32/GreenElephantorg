import { includesEveryValueRule } from "../../shared/valueRules";

export type MyFiveConsentEventType = "accepted" | "withdrawn";

export interface MyFiveConsentEvent {
  id: string;
  actorUserId: string;
  slotId: string;
  consentType: string;
  eventType: MyFiveConsentEventType;
  rulesVersion: string;
  acceptedRuleIds: readonly string[];
  acceptedAt: Date;
}

export interface MyFiveBilateralSlot {
  id: string;
  userId: string;
  partnerUserId: string | null;
  status: string;
  isSelfVault: string;
}

export type MyFiveAgreementGateReason =
  | "slot_not_linked"
  | "actor_not_linked_participant"
  | "owner_current_consent_missing"
  | "partner_current_consent_missing";

export interface MyFiveAgreementGateAllowed {
  allowed: true;
  ownerUserId: string;
  partnerUserId: string;
  ownerConsentReceiptId: string;
  partnerConsentReceiptId: string;
  rulesVersion: string;
}

export interface MyFiveAgreementGateDenied {
  allowed: false;
  reasonCode: MyFiveAgreementGateReason;
  ownerUserId: string | null;
  partnerUserId: string | null;
  rulesVersion: string;
}

export type MyFiveAgreementGateResult = MyFiveAgreementGateAllowed | MyFiveAgreementGateDenied;

export function agreementMutationLockKey(slotId: string): string {
  return `myfive-agreement:${slotId}`;
}

export function latestCurrentValueRulesReceipt(
  events: readonly MyFiveConsentEvent[],
  subjectUserId: string,
  slotId: string,
  rulesVersion: string,
): MyFiveConsentEvent | null {
  const ordered = events
    .filter((event) =>
      event.actorUserId === subjectUserId
      && event.slotId === slotId
      && event.consentType === "agreement-sharing"
      && event.rulesVersion === rulesVersion,
    )
    .sort((left, right) => right.acceptedAt.getTime() - left.acceptedAt.getTime());
  const latest = ordered[0];
  if (!latest || latest.eventType === "withdrawn") return null;
  if (!includesEveryValueRule(latest.acceptedRuleIds)) return null;
  return latest;
}

export function evaluateBilateralValueRulesGate(input: {
  actorUserId: string;
  slot: MyFiveBilateralSlot;
  consentEvents: readonly MyFiveConsentEvent[];
  rulesVersion: string;
}): MyFiveAgreementGateResult {
  const ownerUserId = input.slot.userId || null;
  const partnerUserId = input.slot.partnerUserId;
  if (input.slot.status !== "active" || input.slot.isSelfVault === "true" || !ownerUserId || !partnerUserId) {
    return { allowed: false, reasonCode: "slot_not_linked", ownerUserId, partnerUserId, rulesVersion: input.rulesVersion };
  }
  if (input.actorUserId !== ownerUserId && input.actorUserId !== partnerUserId) {
    return { allowed: false, reasonCode: "actor_not_linked_participant", ownerUserId, partnerUserId, rulesVersion: input.rulesVersion };
  }

  const ownerReceipt = latestCurrentValueRulesReceipt(input.consentEvents, ownerUserId, input.slot.id, input.rulesVersion);
  if (!ownerReceipt) {
    return { allowed: false, reasonCode: "owner_current_consent_missing", ownerUserId, partnerUserId, rulesVersion: input.rulesVersion };
  }

  const partnerReceipt = latestCurrentValueRulesReceipt(input.consentEvents, partnerUserId, input.slot.id, input.rulesVersion);
  if (!partnerReceipt) {
    return { allowed: false, reasonCode: "partner_current_consent_missing", ownerUserId, partnerUserId, rulesVersion: input.rulesVersion };
  }

  return {
    allowed: true,
    ownerUserId,
    partnerUserId,
    ownerConsentReceiptId: ownerReceipt.id,
    partnerConsentReceiptId: partnerReceipt.id,
    rulesVersion: input.rulesVersion,
  };
}

export function agreementConsentStateForActor(result: MyFiveAgreementGateResult, actorUserId: string) {
  if (result.allowed) return "eligible";
  if (result.reasonCode === "slot_not_linked") return "partner_not_linked";
  if (result.reasonCode === "actor_not_linked_participant") return "not_participant";
  const actorIsOwner = result.ownerUserId === actorUserId;
  const missingOwn = (actorIsOwner && result.reasonCode === "owner_current_consent_missing")
    || (!actorIsOwner && result.reasonCode === "partner_current_consent_missing");
  return missingOwn ? "own_consent_required" : "partner_consent_pending";
}
