import test from 'node:test';
import assert from 'node:assert/strict';
import {serviceEmailConfiguration} from '../scripts/service-email-preflight';
test('read-only service preflight reports unknown local provider state honestly',()=>{
 const result=serviceEmailConfiguration({});assert.equal(result.emailsSent,0);assert.equal(result.databaseChecked,false);assert.equal(result.liveProviderVerified,false);assert.equal(result.credentialSource,'not available here');
});
test('preflight identifies a Replit connector without contacting it or exposing tokens',()=>{
 const result=serviceEmailConfiguration({REPLIT_CONNECTORS_HOSTNAME:'private-host',REPL_IDENTITY:'private-token',RESEND_SERVICE_WEBHOOK_SECRET:'private-secret'});
 assert.equal(result.credentialSource,'Replit connector (not queried)');assert.doesNotMatch(JSON.stringify(result),/private-host|private-token|private-secret/);
});
test('pending-message encryption key must be valid and separate, including hex case changes',()=>{
 assert.equal(serviceEmailConfiguration({SERVICE_EMAIL_ENCRYPTION_KEY:'ab'.repeat(32),TYPEFORM_EVIDENCE_KEY:'AB'.repeat(32)}).evidenceKeyConfigured,false);
 assert.equal(serviceEmailConfiguration({SERVICE_EMAIL_ENCRYPTION_KEY:'ab'.repeat(32)}).evidenceKeyConfigured,true);
 assert.equal(serviceEmailConfiguration({SERVICE_EMAIL_ENCRYPTION_KEY:'invalid'}).evidenceKeyConfigured,false);
});
