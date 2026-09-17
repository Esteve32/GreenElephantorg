export const MYFIVE_INVITATION_RETENTION_DAYS = 30;

export const JOINT_AGREEMENT_CREATION_DISCLOSURE =
  "This is a joint record. If either participant deletes their account, that account immediately loses access. The remaining participant may continue to read, export, and delete the frozen agreement until they delete it or their account. Green Elephant removes the deleted account's direct identifiers, does not permit further editing or sharing through MyFive, and handles any erasure or objection request under the published privacy process.";

export const ACCOUNT_DELETION_SURVIVOR_DISCLOSURE =
  "Deleting your account removes your private and account data and permanently revokes your access. A frozen copy of each joint agreement may remain available only to the other participant until they delete it or their account, subject to Green Elephant's published lawful-basis and rights-request process. Free text may still refer to you. Export anything you need before deleting.";

export type MyFiveParticipantLifecycle = "active" | "survivor" | "revoked";
export type MyFiveAgreementLifecycle = "active" | "frozen";

export interface AgreementCapabilities {
  canRead: boolean;
  canEdit: boolean;
  canExport: boolean;
  canDelete: boolean;
}

export type JointAgreementDeletionPlan =
  | { action: "freeze_for_survivor"; survivorUserId: string }
  | { action: "erase_final_copy"; survivorUserId: null };

const NO_AGREEMENT_CAPABILITIES: AgreementCapabilities = {
  canRead: false,
  canEdit: false,
  canExport: false,
  canDelete: false,
};

export function agreementCapabilities(
  participantLifecycle: MyFiveParticipantLifecycle | null,
  agreementLifecycle: MyFiveAgreementLifecycle,
): AgreementCapabilities {
  if (participantLifecycle === "active" && agreementLifecycle === "active") {
    return { canRead: true, canEdit: true, canExport: true, canDelete: false };
  }
  if (participantLifecycle === "survivor" && agreementLifecycle === "frozen") {
    return { canRead: true, canEdit: false, canExport: true, canDelete: true };
  }
  return NO_AGREEMENT_CAPABILITIES;
}

export function planJointAgreementDeletion(
  deletingUserId: string,
  participantUserIds: readonly string[],
): JointAgreementDeletionPlan {
  const remaining = Array.from(new Set(participantUserIds))
    .filter((participantUserId) => participantUserId !== deletingUserId);
  if (remaining.length > 1) {
    throw new Error("A MyFive joint agreement cannot have more than one surviving participant");
  }
  return remaining.length === 1
    ? { action: "freeze_for_survivor", survivorUserId: remaining[0] }
    : { action: "erase_final_copy", survivorUserId: null };
}
