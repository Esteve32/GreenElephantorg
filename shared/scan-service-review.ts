import { z } from 'zod';

export const scanReviewId = z.string().regex(/^[A-Za-z0-9_-]{1,128}$/);
export const scanReviewReason = z.enum(['awaiting_evidence', 'assignment_unclear', 'not_qualifying', 'duplicate_or_conflict', 'service_reviewed']);
export const scanReviewAction = z.object({
  mutationId: z.string().uuid(), expectedVersion: z.number().int().min(0).max(1_000_000),
  decision: z.enum(['held', 'rejected', 'resolved']), reason: scanReviewReason,
  evidenceRef: scanReviewId.optional(),
}).strict().superRefine((value, ctx) => {
  if (value.decision === 'resolved' && (value.reason !== 'service_reviewed' || !value.evidenceRef))
    ctx.addIssue({ code: 'custom', message: 'Select reviewed evidence to resolve this submission.' });
  if (value.decision !== 'resolved' && (value.evidenceRef || value.reason === 'service_reviewed'))
    ctx.addIssue({ code: 'custom', message: 'Hold or reject with a reason; assignment evidence is separate.' });
});
export type ScanReviewAction = z.infer<typeof scanReviewAction>;
export class ScanReviewError extends Error {
  constructor(public code: 'review_conflict' | 'review_not_found' | 'review_evidence_required' | 'review_access_required') { super(code); }
}
export type ScanReviewState = 'open' | 'held' | 'rejected' | 'resolved';
export interface ScanReviewRow {
  eventId: string; formId: string; responseId: string; outcome: string; reason: string;
  receivedAt: string; submittedAt: string | null; version: number; state: ScanReviewState;
  nextAction: string; dueAt: string | null;
}
export interface ScanCoachTask {
  id: string; purchaseId: string; state: string; ownerId: string | null;
  dueAt: string | null; participantRef: string | null; recipientEmail: string | null;
  assignmentEvidenceRef: string | null; recipientEvidenceRef: string | null;
  nextAction: string;
}
export interface ScanReviewDetail {
  receipt: ScanReviewRow; purchaseId: string | null;
  evidenceOptions: { reference: string; participantRef: string; recipientEmail: string }[];
  task: ScanCoachTask | null;
  history: { version: number; decision: string; reason: string; actorId: string; recordedAt: string }[];
  canResolve: boolean;
}
export interface ScanCompletionPreview {
  previewVersion: 1; taskId: string; eventId: string; reviewVersion: number; fingerprint: string; contentDigest: string;
  provenance: { version:1; source:'typeform-responses-api'; formId:string; responseId:string; retrievedAt:string; apiBodyDigest:string };
  message: { from:string; to:string; cc:string[]; replyTo:string; subject:string; html:string; text:string;
    attachments:{ filename:string; contentType:string; contentUtf8:string }[] };
  approvalStatus:'not_approved'; emailDelivery:'not_attempted';
}
export const scanReviewNextAction = (state: string, outcome: string) => state === 'resolved' || outcome === 'recorded'
  ? 'Retrieve the exact response and prepare the coach report. Sending needs separate approval.'
  : state === 'rejected' ? 'Retained for reconciliation. No service completion or email was triggered.'
  : outcome === 'partial' ? 'Wait for a qualifying final response. No completed report is due.'
  : outcome === 'duplicate' ? 'Use the existing service task; do not create another.'
  : 'Review exact-order, completion, assignment and recipient evidence. Keep unclear cases on hold.';
