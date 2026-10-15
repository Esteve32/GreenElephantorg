import { createHash } from 'node:crypto';
import { z } from 'zod';
import { verifyTypeformSignature } from './delivery-security';
import { validScanReferenceField } from '../shared/scan-typeform-link';
import { normalizeTypeformContent, typeformContentLabels } from './typeform-content';

const reference = z.string().regex(/^[A-Za-z0-9_-]{1,128}$/);
const configSchema = z.object({ formId: reference, bindingField: z.string().refine(validScanReferenceField), completionFieldRef: reference });
const eventSchema = z.object({
  event_id: reference,
  event_type: z.enum(['form_response', 'form_response_partial']),
  form_response: z.object({
    form_id: reference, token: reference,
    submitted_at: z.string().datetime({ offset: true }).optional(),
    hidden: z.record(z.unknown()).optional(),
    response_type: z.enum(['completed', 'partial']).optional(),
    answers: z.array(z.unknown()).max(2000).optional(),
  }).passthrough(),
});

export class TypeformIntakeError extends Error {
  constructor(public readonly status: 400 | 401 | 409 | 503) { super('typeform_intake_unavailable'); }
}
export type TypeformReceipt = {
  eventId: string; eventType: 'form_response' | 'form_response_partial';
  formId: string; responseId: string; payloadDigest: string; responseDigest: string;
  bindingDigest: string | null; submittedAt: Date | null; receivedAt: Date;
  completionVerified: boolean;
  mappingDigest?: string;
  contentVersion?: number; contentDigest?: string; labelsDigest?: string;
};
export type TypeformIntakeOutcome = 'recorded' | 'partial' | 'review' | 'duplicate';
export type TypeformIntakeStore = { receive(receipt: TypeformReceipt): Promise<{ outcome: TypeformIntakeOutcome; replayed: boolean }> };
export const typeformDigest = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');

/** The caller supplies reviewed form/hidden-field mapping; there are no live defaults. */
export function parseTypeformReceipt(raw: Buffer, signature: unknown, secret: string, mapping: unknown, now = new Date()): TypeformReceipt {
  const config = configSchema.safeParse(mapping);
  if (!config.success || !secret || !Number.isFinite(now.getTime())) throw new TypeformIntakeError(503);
  if (!Buffer.isBuffer(raw) || raw.length > 2 * 1024 * 1024) throw new TypeformIntakeError(400);
  if (!verifyTypeformSignature(raw, signature, secret)) throw new TypeformIntakeError(401);
  let body: unknown;
  try { body = JSON.parse(raw.toString('utf8')); } catch { throw new TypeformIntakeError(400); }
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) throw new TypeformIntakeError(400);
  const event = parsed.data, response = event.form_response;
  if (response.form_id !== config.data.formId) throw new TypeformIntakeError(400);
  const final = event.event_type === 'form_response';
  if ((final && (!response.submitted_at || response.response_type === 'partial'))
    || (!final && response.response_type === 'completed')) throw new TypeformIntakeError(400);
  const submittedAt = response.submitted_at ? new Date(response.submitted_at) : null;
  if (submittedAt && (!Number.isFinite(submittedAt.getTime()) || submittedAt.getTime() > now.getTime() + 300_000)) throw new TypeformIntakeError(400);
  const proof = response.hidden?.[config.data.bindingField];
  const readiness = (response.answers ?? []).filter((answer): answer is Record<string, unknown> => {
    if (!answer || typeof answer !== 'object') return false;
    const field = (answer as Record<string, unknown>).field;
    return !!field && typeof field === 'object' && (field as Record<string, unknown>).ref === config.data.completionFieldRef;
  });
  const completionVerified = final && readiness.length === 1 && readiness[0].type === 'boolean' && readiness[0].boolean === true;
  let commitment: { contentVersion?: number; contentDigest?: string; labelsDigest?: string } = {};
  if (completionVerified) {
    try {
      const normalized = normalizeTypeformContent(response,config.data);
      const labels = typeformContentLabels(normalized.content,response.definition);
      commitment = { contentVersion:1,contentDigest:normalized.digest,labelsDigest:labels.digest };
    } catch { /* Unsupported/missing content metadata stays a visible recovery gate; never infer it. */ }
  }
  return {
    eventId: event.event_id, eventType: event.event_type, formId: response.form_id, responseId: response.token,
    payloadDigest: typeformDigest(raw), responseDigest: typeformDigest(JSON.stringify(response)),
    bindingDigest: typeof proof === 'string' && /^[A-Za-z0-9_-]{43}$/.test(proof) ? typeformDigest(proof) : null,
    submittedAt, receivedAt: now, completionVerified, mappingDigest: typeformDigest(JSON.stringify(config.data)), ...commitment,
  };
}

/** Not mounted until actual mapping and connection within the existing emailed-link flow are reviewed. */
export function createTypeformIntakeHandler(deps: {
  secret(): string; mapping(): unknown; enabled(): Promise<boolean>; store: TypeformIntakeStore; now?(): Date;
}) {
  return async (req: import('express').Request, res: import('express').Response) => {
    res.setHeader('Cache-Control', 'no-store');
    try {
      if (!(await deps.enabled())) throw new TypeformIntakeError(503);
      const receipt = parseTypeformReceipt(req.body, req.headers['typeform-signature'], deps.secret(), deps.mapping(), deps.now?.());
      const result = await deps.store.receive(receipt);
      // Receipt acknowledgement is neither mail acceptance nor completed report delivery.
      return res.status(result.outcome === 'review' ? 202 : 200).json({ received: true, outcome: result.outcome, replayed: result.replayed, emailDelivery: 'not_attempted' });
    } catch (error) {
      const status = error instanceof TypeformIntakeError ? error.status : 503;
      return res.status(status).json({ received: false, message: 'Typeform intake could not be acknowledged. Retry or request operator review.' });
    }
  };
}
