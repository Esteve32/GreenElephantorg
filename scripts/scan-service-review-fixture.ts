/** Synthetic, in-memory fixture only. Never imported by application startup. */
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { readFile } from 'node:fs/promises';
import { createHmac } from 'node:crypto';
import { createTypeformIntakeStore } from '../server/typeform-intake-store';
import { parseTypeformReceipt, typeformDigest } from '../server/typeform-intake';
import { createScanServiceReviewStore, type ScanAssignmentEvidence } from '../server/scan-service-review-store';
import { createTypeformResponseReader } from '../server/typeform-response-reader';
import { createScanCompletionPreview } from '../server/scan-completion-preview';
import { operationKey } from '../server/delivery-security';

export async function scanServiceReviewFixture() {
  const client = new PGlite(), database = drizzle(client);
  const actor = { id: 'synthetic-owner', email: 'owner@greenelephant.org', googleId: '12345', role: 'super_admin', isActive: 'true' };
  const now = new Date('2026-10-14T18:00:00Z'), evidence = new Map<string, ScanAssignmentEvidence[]>();
  const proofs = ['A'.repeat(43), 'B'.repeat(43)];
  const apiItems = new Map<string,unknown>(), definitions = new Map<string,unknown>();
  await client.exec(`CREATE TABLE admin_users(id varchar PRIMARY KEY,email text UNIQUE NOT NULL,name text,avatar_url text,google_id text UNIQUE,role text NOT NULL,invited_by text,is_active text NOT NULL,created_at timestamp NOT NULL DEFAULT now(),last_login_at timestamp);
    CREATE TABLE satellitescan_purchases(id varchar PRIMARY KEY,customer_email text NOT NULL,customer_name text,amount text NOT NULL,stripe_payment_intent_id text UNIQUE NOT NULL,status text NOT NULL,typeform_completed text NOT NULL DEFAULT 'false',typeform_completed_at timestamp,dashboard_sent text NOT NULL DEFAULT 'false',reminders_count text NOT NULL DEFAULT '0',role text,created_at timestamp NOT NULL DEFAULT now());
    CREATE TABLE audit_logs(id varchar PRIMARY KEY DEFAULT gen_random_uuid(),user_email text NOT NULL,action_type text NOT NULL,resource text,details jsonb,ip_address text,created_at timestamp NOT NULL DEFAULT now());
    CREATE TABLE admin_settings(id varchar PRIMARY KEY DEFAULT gen_random_uuid(),key text UNIQUE NOT NULL,value text NOT NULL,updated_at timestamp NOT NULL DEFAULT now());`);
  for (const migration of ['20261014_typeform_service_intake.sql', '20261014_scan_service_review.sql','20261014_scan_response_content.sql'])
    await client.exec(await readFile('migrations/' + migration, 'utf8'));
  const intake = createTypeformIntakeStore(database as any);
  const store = createScanServiceReviewStore(database as any, { owner: () => actor.email,
    evidence: async eventId => evidence.get(eventId) ?? [], now: () => now });
  const mapping = { formId:'synthetic-form',bindingField:'service_reference',completionFieldRef:'synthetic-ready' };
  const recover = createTypeformResponseReader({mapping,token:'synthetic-only-token',now:() => now,
    signedDefinition:async eventId => definitions.get(eventId), request:async (url) => {
      const responseId = new URL(url).searchParams.get('included_response_ids')!, item = apiItems.get(responseId);
      return Response.json({total_items:item ? 1 : 0,items:item ? [item] : []});
    } });
  const preview = createScanCompletionPreview(database as any,{owner:() => actor.email,sender:'service@example.test',recover,now:() => now});
  function receipt(eventId: string, order = 0, ready = true, responseId = 'synthetic-response-' + order) {
    const formResponse = {
      form_id: 'synthetic-form', token: responseId, submitted_at: '2026-10-14T17:00:00Z',
      hidden: { service_reference: proofs[order] }, answers: [
        { type: 'boolean', field: { id:'field-ready',ref: 'synthetic-ready',type:'yes_no' }, boolean: ready },
        { type:'text',field:{id:'field-reflection',ref:'synthetic-reflection',type:'long_text'},text:'Fictional reflection for local review only.' }],
      definition:{fields:[{id:'field-ready',ref:'synthetic-ready',title:'Ready for the purchased service?'},
        {id:'field-reflection',ref:'synthetic-reflection',title:'Your fictional reflection'}]},
    };
    definitions.set(eventId,structuredClone(formResponse.definition));
    apiItems.set(responseId,{response_id:responseId,token:responseId,response_type:'completed',submitted_at:formResponse.submitted_at,
      hidden:structuredClone(formResponse.hidden),answers:structuredClone(formResponse.answers),metadata:{synthetic:true}});
    const raw = Buffer.from(JSON.stringify({ event_id: eventId, event_type: 'form_response', form_response:formResponse }));
    return parseTypeformReceipt(raw, 'sha256=' + createHmac('sha256', 'synthetic-secret').update(raw).digest('base64'),
      'synthetic-secret',mapping, now);
  }
  async function seedEvent(id: string, order = 0, ready = true, responseId?: string) {
    const event = receipt(id, order, ready, responseId);
    await intake.receive(event);
    evidence.set(id, [{ reference: 'evidence-' + id, eventId: id, purchaseId: 'synthetic-order-' + order,
      formId: event.formId, responseId: event.responseId, payloadDigest: event.payloadDigest, responseDigest: event.responseDigest,
      bindingDigest: event.bindingDigest!, mappingDigest: event.mappingDigest!, participantRef: 'synthetic-participant-' + order,
      recipientEmail: 'participant-' + order + '@example.test', assignmentEvidenceRef: 'synthetic-assignment-' + order,
      recipientEvidenceRef: 'synthetic-recipient-' + order, recordedAt: now.toISOString() }]);
    return event;
  }
  async function reset() {
    await client.exec(`DROP TRIGGER IF EXISTS fail_review_audit ON audit_logs; DROP TRIGGER IF EXISTS fail_review_task ON scan_typeform_service_tasks;
      TRUNCATE scan_typeform_review_actions,scan_typeform_service_tasks,scan_typeform_events,scan_typeform_bindings,satellitescan_purchases,audit_logs,admin_users,admin_settings;
      INSERT INTO admin_users(id,email,google_id,role,is_active) VALUES('synthetic-owner','owner@greenelephant.org','12345','super_admin','true');`);
    evidence.clear(); apiItems.clear(); definitions.clear();
    for (let order = 0; order < 2; order++) {
      await client.query(`INSERT INTO satellitescan_purchases(id,customer_email,amount,stripe_payment_intent_id,status) VALUES($1,'same-payer@example.test',$2,$3,'succeeded')`,
        ['synthetic-order-' + order, order === 0 ? '49.00' : '0.00', 'synthetic-payment-' + order]);
      await client.query(`INSERT INTO scan_typeform_bindings(id,reference_digest,purchase_id,participant_ref,form_id,expires_at) VALUES($1,$2,$3,$4,'synthetic-form','2026-11-14T18:00:00Z')`,
        ['synthetic-binding-' + order, typeformDigest(proofs[order]), 'synthetic-order-' + order, 'unassigned-order:synthetic-order-' + order]);
      await client.query('INSERT INTO admin_settings(key,value) VALUES($1,$2)',[operationKey('purchase-language','synthetic-order-' + order),order ? 'fr':'en']);
    }
    await seedEvent('synthetic-paid'); await seedEvent('synthetic-voucher', 1);
    await seedEvent('synthetic-refusal', 0, false);
    const legacy = receipt('synthetic-legacy'); await intake.receive({ ...legacy, bindingDigest: null });
  }
  await reset();
  return { client, database, actor, now, evidence, store, intake, reset, seedEvent, receipt,apiItems,definitions,recover,preview,mapping };
}
