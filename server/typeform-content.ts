import { createHash } from 'node:crypto';
import { z } from 'zod';
import { typeformMappingSchema, successfulTypeformCompletion } from './typeform-mapping';

const id = z.string().regex(/^[A-Za-z0-9_-]{1,128}$/);
export const typeformContentMapping = typeformMappingSchema;
export type TypeformContentMapping = z.infer<typeof typeformContentMapping>;
export class TypeformRecoveryError extends Error {
  constructor(public code: 'recovery_pending' | 'recovery_conflict' | 'recovery_unavailable') { super(code); }
}
export function canonicalJson(value: unknown): string {
  if (value instanceof Date) return JSON.stringify(value.toISOString());
  if (value === null || typeof value !== 'object') {
    const result = JSON.stringify(value); if (result === undefined) throw new TypeformRecoveryError('recovery_conflict'); return result;
  }
  if (Array.isArray(value)) return '[' + value.map(canonicalJson).join(',') + ']';
  return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + canonicalJson((value as Record<string,unknown>)[key])).join(',') + '}';
}
export const contentHash = (value: unknown) => createHash('sha256').update(canonicalJson(value)).digest('hex');
const string = z.string().max(100_000);
const choice = z.object({ id: id.optional(), ref: id.optional(), label: string.optional(), other: string.optional() }).strict().refine(v => v.label || v.other);
const choices = z.object({ ids: z.array(id).max(1000).optional(), refs: z.array(id).max(1000).optional(),
  labels: z.array(string).max(1000).optional(), other: string.optional() }).strict().refine(v => v.labels?.length || v.other);
const field = z.object({ id: id.optional(), ref: id.optional(), type: id.optional() }).strict().refine(v => v.id || v.ref);
const answer = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text'), field, text: string }).strip(),
  z.object({ type: z.literal('email'), field, email: z.string().email().max(320) }).strip(),
  z.object({ type: z.literal('boolean'), field, boolean: z.boolean() }).strip(),
  z.object({ type: z.literal('number'), field, number: z.number().finite() }).strip(),
  z.object({ type: z.literal('date'), field, date: string }).strip(),
  z.object({ type: z.literal('choice'), field, choice }).strip(),
  z.object({ type: z.literal('choices'), field, choices }).strip(),
]);
const responseSchema = z.object({ token: id, submitted_at: z.string().datetime({ offset:true }),
  hidden: z.record(z.unknown()), answers: z.array(answer).min(1).max(2000),
  response_type: z.literal('completed').optional() }).passthrough();

/** Explicit v1 projection: object-key/answer order is ignored; choice/ranking array order is preserved. */
export function normalizeTypeformContent(value: unknown, suppliedMapping: unknown) {
  const mapping = typeformContentMapping.parse(suppliedMapping), response = responseSchema.parse(value);
  const proof = response.hidden[mapping.bindingField];
  if (typeof proof !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(proof)) throw new TypeformRecoveryError('recovery_conflict');
  if (!successfulTypeformCompletion(response,mapping,false)) throw new TypeformRecoveryError('recovery_conflict');
  const answers = response.answers.map(a => ({ ...a, ...('version' in mapping && a.type==='choice' ? {choice:Object.fromEntries(Object.entries(a.choice).filter(([key])=>key!=='ref'))} : {}), ...('version' in mapping && a.type==='choices' ? {choices:Object.fromEntries(Object.entries(a.choices).filter(([key])=>key!=='refs'))} : {}), field: { id: a.field.id ?? null, ref: 'version' in mapping ? null : a.field.ref ?? null, type: a.field.type ?? null } }))
    .sort((a,b) => canonicalJson(a.field) < canonicalJson(b.field) ? -1 : canonicalJson(a.field) > canonicalJson(b.field) ? 1 : 0);
  if ('version' in mapping && answers.some(a=>!a.field.id)) throw new TypeformRecoveryError('recovery_conflict');
  const keys = answers.map(a => a.field.ref ?? a.field.id!);
  if (new Set(keys).size !== keys.length) throw new TypeformRecoveryError('recovery_conflict');
  const content = { version: 1 as const, formId: mapping.formId, responseId: response.token,
    submittedAt: new Date(response.submitted_at).toISOString(), bindingDigest: createHash('sha256').update(proof).digest('hex'),
    mappingDigest: createHash('sha256').update(JSON.stringify(mapping)).digest('hex'), answers };
  return { content, digest: contentHash(content) };
}
export type TypeformContent = ReturnType<typeof normalizeTypeformContent>['content'];

/** Labels must be recovered from the immutable signed definition, never guessed from current form titles. */
export function typeformContentLabels(content: TypeformContent, definition: unknown) {
  const parsed = z.object({ fields: z.array(z.object({ id: id.optional(), ref: id.optional(), title: z.string().min(1).max(2000) }).passthrough()).max(2000) }).passthrough().parse(definition);
  const flatten = (fields:any[]):any[] => fields.flatMap(f=>[f,...flatten(f.properties?.fields??f.fields??[])]);
  const allFields = flatten(parsed.fields);
  const labels = content.answers.map(a => {
    const matches = allFields.filter(f => (a.field.id ? f.id === a.field.id : true) && (a.field.ref ? f.ref === a.field.ref : true));
    if (matches.length !== 1) throw new TypeformRecoveryError('recovery_conflict');
    return { field: a.field.ref ?? a.field.id!, title: matches[0].title, index:allFields.indexOf(matches[0]) };
  }).sort((a,b) => a.index - b.index).map(({index:_index,...label}) => label);
  return { labels, digest: contentHash(labels) };
}
