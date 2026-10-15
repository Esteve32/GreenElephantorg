import { z } from 'zod';

export const ROPA_FIELDS = {
  controller: 'Controller / organisation and contact details',
  jointControllers: 'Joint controllers and representatives, or not applicable',
  privacyContact: 'Privacy contact / DPO if appointed',
  owner: 'Responsible activity owner',
  purpose: 'Purpose of processing',
  subjects: 'Categories of people',
  dataCategories: 'Categories of personal data',
  lawfulBasis: 'Lawful-basis assessment and reference',
  recipients: 'Recipients and processors',
  transfers: 'International transfers and safeguards, or none',
  retention: 'Retention periods / deletion triggers and assessment',
  security: 'General technical and organisational safeguards',
  rights: 'Rights-request route and responsibilities',
  risks: 'Risk / DPIA assessment and open issues',
} as const;
export type RopaField = keyof typeof ROPA_FIELDS;
const fieldShape = Object.fromEntries(Object.keys(ROPA_FIELDS).map(key => [key, z.string().trim().max(4000)])) as Record<RopaField, z.ZodString>;
export const ropaStatus = z.enum(['draft', 'review_required', 'reviewed', 'live_verified', 'archived']);
const safeLink = z.string().max(1000).refine(value => {
  if (!value) return true;
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; } catch { return false; }
}, 'Use an HTTPS link without credentials, or leave blank.');
export const ropaRecordSchema = z.object({
  title: z.string().trim().min(1).max(160),
  status: ropaStatus,
  fields: z.object(fieldShape).strict(),
  links: z.array(z.object({
    kind: z.enum(['purpose', 'notice', 'surface', 'provider', 'assessment', 'evidence']),
    reference: z.string().trim().min(1).max(160),
    version: z.string().trim().max(80), url: safeLink,
  }).strict()).max(100),
  reviewDue: z.string().regex(/^$|^\d{4}-\d{2}-\d{2}$/).refine(value => !value || (Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value), 'Use a valid calendar date.'),
  reviewEvidence: z.string().trim().max(4000),
  liveEvidence: z.string().trim().max(4000),
}).strict().superRefine((record, ctx) => {
  if (record.status === 'reviewed' || record.status === 'live_verified') {
    for (const key of Object.keys(ROPA_FIELDS) as RopaField[]) if (!record.fields[key]) {
      ctx.addIssue({ code: 'custom', path: ['fields', key], message: 'Complete this field or explain why it does not apply before marking reviewed.' });
    }
    if (!record.reviewEvidence) ctx.addIssue({ code: 'custom', path: ['reviewEvidence'], message: 'Record the human review evidence.' });
  }
  if (record.status === 'live_verified' && !record.liveEvidence) ctx.addIssue({ code: 'custom', path: ['liveEvidence'], message: 'Record the observed live verification evidence.' });
});
export type RopaRecord = z.infer<typeof ropaRecordSchema>;
export function emptyRopaRecord(): RopaRecord {
  return { title: '', status: 'draft', fields: Object.fromEntries(Object.keys(ROPA_FIELDS).map(k => [k, ''])) as Record<RopaField, string>,
    links: [], reviewDue: '', reviewEvidence: '', liveEvidence: '' };
}
export const ropaSaveSchema = z.object({
  mutationId: z.string().uuid(), expectedVersion: z.number().int().min(0).max(1000000),
  reason: z.string().trim().min(3).max(1000), record: ropaRecordSchema, attestReview: z.boolean(),
}).strict().refine(input => !['reviewed','live_verified'].includes(input.record.status) || input.attestReview, 'Human review confirmation is required.');
export type RopaSave = z.infer<typeof ropaSaveSchema>;
export interface RopaActivity { id: string; version: number; record: RopaRecord; updatedAt: string }
export interface RopaRevision { version: number; record: RopaRecord; reason: string; actorId: string; recordedAt: string }
export interface RopaPage { activities: RopaActivity[]; nextCursor: string | null; accessExpiresAt: string }
export class RopaConflict extends Error {}
export class RopaNotFound extends Error {}
export class RopaAccessDenied extends Error {}
