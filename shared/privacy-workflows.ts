import { z } from 'zod';
export const privacyId=z.string().regex(/^[A-Za-z0-9_-]{1,128}$/);
export const mutationId=z.string().uuid();
export const privacyKind=z.enum(['notice','consent','case','attention','connector','retention','digest','recovery','configuration']);
export type PrivacyKind=z.infer<typeof privacyKind>;
export const purpose=z.literal('marketing_updates');
export const noticeInput=z.object({mutationId,purpose,noticeVersion:z.string().trim().min(1).max(64),english:z.string().trim().min(20).max(5000),french:z.string().trim().min(20).max(5000),reviewRef:z.string().trim().min(3).max(200)}).strict();
export const caseIntake=z.object({mutationId,source:z.enum(['operator','gmail','typeform']),sourceId:privacyId,receivedAt:z.string().datetime({offset:true}),subjectId:privacyId.optional(),kind:z.enum(['unclassified','access','correction','erasure','restriction','objection','portability','incident','intake_failure']),correspondenceRef:privacyId.optional()}).strict();
export const caseAction=z.object({mutationId,expectedVersion:z.number().int().nonnegative(),action:z.enum(['start_review','verify_identity','await_information','hold','resolve','reopen','record_outcome','extend_deadline']),reason:z.string().trim().min(3).max(1000),receiptRef:privacyId.optional(),deadline:z.string().datetime({offset:true}).optional()}).strict();
export const notificationSettings=z.object({mutationId,expectedVersion:z.number().int().nonnegative(),weeklyEnabled:z.boolean(),deadlineHours:z.number().int().min(1).max(744).optional(),timeZone:z.string().min(1).max(100).refine(v=>{try{new Intl.DateTimeFormat('en',{timeZone:v});return true;}catch{return false;}}),weekday:z.number().int().min(0).max(6),hour:z.number().int().min(0).max(23),minute:z.number().int().min(0).max(59),recipientRefs:z.array(z.enum(['owner','daily'])).min(1).max(2),reviewRef:z.string().trim().min(3).max(200)}).strict();
export const retentionInput=z.object({mutationId,expectedVersion:z.number().int().nonnegative(),scope:z.enum(['closed_case_links','connector_receipts','expired_confirmation']),days:z.number().int().min(1).max(36500),purpose:z.string().trim().min(3).max(500),reviewRef:z.string().trim().min(3).max(200)}).strict();
export const PRIVACY_LEARNING={
 notice:{meaning:'The exact words a person saw when making a choice.',example:'Keep version 2 after publishing version 3.',action:'Record the reviewed wording in both languages before collecting a new choice.'},
 pending:{meaning:'A person asked to subscribe. Their email address is not confirmed yet.',example:'An old confirmation link cannot undo a newer withdrawal.',action:'Check the new request and confirmation. Keep marketing blocked until both match.'},
 case:{meaning:'One privacy request, with a responsible person and a review date.',example:'Two requests from the same email address can be two different cases.',action:'Review the request. Confirm identity before disclosing personal records.'},
 outbox:{meaning:'Saved email work that survives a page closing or a server restart.',example:'Accepted means the mail provider took the message. It does not mean it arrived.',action:'Review the exact draft. Reconcile an unknown result before retrying.'},
 retention:{meaning:'A reviewed rule for when a particular kind of record is removed.',example:'A legal hold can stop one planned deletion.',action:'Review a dry run and its affected records. Never choose a time limit just because it is suggested.'},
 recovery:{meaning:'Bring the service back without bringing back old permissions.',example:'After restoring a backup, keep sending paused until withdrawals are reconciled.',action:'Record the incident and reconcile current evidence before resuming sends.'},
};
export function monthReviewTarget(receivedAt:Date):Date {
 const d=new Date(receivedAt);if(!Number.isFinite(d.getTime()))throw Error('invalid_receipt_time');
 const day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+1);const end=new Date(d);end.setUTCMonth(end.getUTCMonth()+1);end.setUTCDate(0);d.setUTCDate(Math.min(day,end.getUTCDate()));return d;
}
