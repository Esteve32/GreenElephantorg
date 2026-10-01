import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {publicSiteOrigin,verifyTypeformSignature,operationKey,normalizeEmail,emailLanguage,verifiedEmailToken,verifyEmailToken} from './delivery-security';
import {couponCanCoverScan,validScanPayment} from './scan-purchase-validation';
import {scanServiceEmail} from './scan-service-email';
test('Typeform signature authenticates exact raw bytes and fails closed',()=>{
 const raw=Buffer.from('{"answer":"é"}'),secret='fixture-secret';
 const header='sha256='+createHmac('sha256',secret).update(raw).digest('base64');
 assert.equal(verifyTypeformSignature(raw,header,secret),true);
 for(const [body,sig,key] of [[Buffer.from('{"answer":"é"} '),header,secret],[raw,header,'wrong'],[raw,undefined,secret],[raw,header,'']]) assert.equal(verifyTypeformSignature(body as Buffer,sig,key as string),false);
});
test('public origin ignores request headers and disallows unsafe URL shapes',()=>{
 assert.equal(publicSiteOrigin(),'https://www.greenelephant.org');
 for(const origin of ['http://evil.test','https://a:b@evil.test','https://good.test/path','https://good.test?redirect=evil']) assert.throws(()=>publicSiteOrigin(origin));
});
test('unsubscribe signatures are purpose and contact bound',()=>{
 const secret='x'.repeat(32),token=verifiedEmailToken('contact-1',secret);
 assert.equal(verifyEmailToken('contact-1',token,secret),true);
 assert.equal(verifyEmailToken('contact-2',token,secret),false);
 assert.equal(verifyEmailToken('contact-1',token,'y'.repeat(32)),false);
 assert.equal(verifyEmailToken('contact-1',token,''),false);
 assert.throws(()=>verifiedEmailToken('contact-1','short'));
});
test('identities are validated and operation keys do not expose addresses',()=>{
 assert.equal(normalizeEmail(' TEST@Example.test '),'test@example.test');
 assert.throws(()=>normalizeEmail('a@b.test\nBcc:other@example.test'));
 assert.equal(emailLanguage('fr'),'fr');assert.throws(()=>emailLanguage('xx'));
 assert.equal(operationKey('x','private@example.test'),operationKey('x','private@example.test'));
 assert.doesNotMatch(operationKey('x','private@example.test'),/private|example/);
});
test('vouchers reject malformed amounts, limits and exhaustion; paid Scan checks exact cents',()=>{
 const good={isActive:'true',discountAmount:'100',usedCount:'0',maxUses:'1'};
 assert.equal(couponCanCoverScan(good),true);
 for(const patch of [{discountAmount:'NaN'},{discountAmount:'Infinity'},{discountAmount:'99'},{usedCount:'1'},{usedCount:'-1'},{maxUses:'garbage'},{usedCount:'0.5'},{usedCount:''},{maxUses:'Infinity'},{isActive:'false'}]) assert.equal(couponCanCoverScan({...good,...patch}),false);
 assert.equal(validScanPayment(9995,'eur'),true);assert.equal(validScanPayment(9994,'eur'),false);assert.equal(validScanPayment(9995,'usd'),false);
});
test('Scan service messages have EN/FR text, safe names, real links and no false delivery claim',()=>{
 for(const language of ['en','fr'] as const) for(const kind of ['purchase','reminder'] as const){
  const email=scanServiceEmail(kind,'<img src=x>',language);
  assert.doesNotMatch(email.html,/<img src=x>/);assert.match(email.html,/&lt;img src=x&gt;/);
  assert.match(email.text,/language=(en|fr)/);assert.match(email.text,language==='fr'?/Répondez/:/Reply/);
  assert.match(email.text,/org\/resources/);assert.doesNotMatch(email.text,/fr\/resources/);if(language==='fr')assert.match(email.text,/en anglais/);
 }
});
