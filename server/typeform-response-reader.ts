import { createHash } from 'node:crypto';
import { z } from 'zod';
import { normalizeTypeformContent, typeformContentLabels, typeformContentMapping, TypeformRecoveryError } from './typeform-content';

export type RecoveryReceipt = { eventId: string; formId: string; responseId: string; submittedAt: Date | null;
  completionVerified: string | null; bindingDigest: string | null; mappingDigest: string | null;
  contentVersion: number | null; contentDigest: string | null; labelsDigest: string | null };
export type RecoveredTypeformResponse = Awaited<ReturnType<ReturnType<typeof createTypeformResponseReader>>>;
function freezeSnapshot<T>(value:T): Readonly<T> {
  if (value && typeof value === 'object') { for (const child of Object.values(value)) freezeSnapshot(child); Object.freeze(value); }
  return value;
}

/** Unconnected, injected transport only. No global fetch, environment, credential lookup or default reader. */
export function createTypeformResponseReader(options: {
  mapping: unknown; token: string;
  request: (url: string, init: RequestInit) => Promise<Response>;
  signedDefinition(eventId: string): Promise<unknown>; now?(): Date; timeoutMs?: number;
}) {
  const mapping = typeformContentMapping.parse(options.mapping);
  const timeoutMs = options.timeoutMs ?? 5000;
  if (!Number.isInteger(timeoutMs) || timeoutMs < 10 || timeoutMs > 5000) throw new TypeformRecoveryError('recovery_unavailable');
  if (typeof options.token !== 'string' || !options.token || /[\s\r\n]/.test(options.token) || options.token.length > 4096)
    throw new TypeformRecoveryError('recovery_unavailable');
  return async (receipt: RecoveryReceipt) => {
    const now = options.now?.() ?? new Date();
    if (receipt.formId !== mapping.formId || receipt.contentVersion !== 1 || !receipt.contentDigest || !receipt.labelsDigest
      || !receipt.bindingDigest || !receipt.mappingDigest || !receipt.submittedAt || receipt.completionVerified !== 'true'
      || !/^[A-Za-z0-9_-]{1,128}$/.test(receipt.responseId) || !Number.isFinite(now.getTime())) throw new TypeformRecoveryError('recovery_conflict');
    const submittedAt = receipt.submittedAt.toISOString();
    const controller = new AbortController(); let timer: ReturnType<typeof setTimeout>;
    const timeout = new Promise<never>((_resolve,reject) => { timer=setTimeout(() => { controller.abort(); reject(new TypeformRecoveryError('recovery_unavailable')); },timeoutMs); });
    try {
      return await Promise.race([(async () => {
      const url = new URL('https://api.typeform.com/forms/' + encodeURIComponent(mapping.formId) + '/responses');
      url.searchParams.set('included_response_ids',receipt.responseId); url.searchParams.set('response_type','completed'); url.searchParams.set('page_size','2');
      const response = await options.request(url.href,{ method:'GET',headers:{ Authorization:'Bearer ' + options.token, Accept:'application/json' },
        redirect:'error',cache:'no-store',signal:controller.signal });
      if (!response.ok || response.redirected || !/^application\/json(?:;|$)/i.test(response.headers.get('content-type') ?? ''))
        throw new TypeformRecoveryError('recovery_unavailable');
      if (Number(response.headers.get('content-length')) > 2 * 1024 * 1024 || !response.body) throw new TypeformRecoveryError('recovery_unavailable');
      const stream = response.body.getReader(); let size = 0; const parts: Uint8Array[] = [];
      const cancel = () => { void stream.cancel().catch(() => {}); }; controller.signal.addEventListener('abort',cancel,{once:true});
      try { for (;;) { const part = await stream.read(); if (part.done) break; size += part.value.byteLength;
        if (size > 2 * 1024 * 1024) { await stream.cancel(); throw new TypeformRecoveryError('recovery_unavailable'); } parts.push(part.value); } }
      finally { controller.signal.removeEventListener('abort',cancel); stream.releaseLock(); }
      const raw = Buffer.concat(parts), parsed = z.object({ items:z.array(z.unknown()).max(2),total_items:z.number().int().min(0) }).passthrough().parse(JSON.parse(raw.toString('utf8')));
      if (!parsed.items.length && parsed.total_items === 0) throw new TypeformRecoveryError('recovery_pending');
      if (parsed.items.length !== 1 || parsed.total_items !== 1) throw new TypeformRecoveryError('recovery_conflict');
      const item = z.object({response_id:z.string(),token:z.string().optional(),form_id:z.string().optional()}).passthrough().parse(parsed.items[0]);
      // Docs map webhook token to response_id. Conflicting identity fields require reconciliation.
      if (item.response_id !== receipt.responseId || (item.token && item.token !== receipt.responseId) || (item.form_id && item.form_id !== mapping.formId))
        throw new TypeformRecoveryError('recovery_conflict');
      const normalized = normalizeTypeformContent({ ...item, token:item.response_id },mapping);
      if (normalized.digest !== receipt.contentDigest || normalized.content.bindingDigest !== receipt.bindingDigest
        || normalized.content.mappingDigest !== receipt.mappingDigest || normalized.content.submittedAt !== submittedAt)
        throw new TypeformRecoveryError('recovery_conflict');
      const labels = typeformContentLabels(normalized.content,await options.signedDefinition(receipt.eventId));
      if (labels.digest !== receipt.labelsDigest) throw new TypeformRecoveryError('recovery_conflict');
      return freezeSnapshot({ content: structuredClone(normalized.content), labels: structuredClone(labels.labels),
        contentDigest: normalized.digest, labelsDigest: labels.digest, provenance: Object.freeze({ version:1 as const,
          source:'typeform-responses-api' as const, formId:mapping.formId,responseId:receipt.responseId,
          retrievedAt:now.toISOString(),apiBodyDigest:createHash('sha256').update(raw).digest('hex') }) });
      })(),timeout]);
    } catch (error) {
      if (error instanceof TypeformRecoveryError) throw error;
      throw new TypeformRecoveryError('recovery_unavailable');
    } finally { clearTimeout(timer!); controller.abort(); }
  };
}
