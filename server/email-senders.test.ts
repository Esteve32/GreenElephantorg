import test, { before } from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Bundle the actual sender functions with a provider stub: no credentials, DB or network.
let fixture: any;
before(async () => {
  const root = dirname(fileURLToPath(import.meta.url));
  const result = await build({
    stdin: { contents: 'export * from "./email-notifications"; export { messages, reset } from "./resend-client";', resolveDir: root },
    bundle: true, write: false, platform: "node", format: "esm",
    plugins: [{ name: "isolated-email-provider", setup(b) {
      b.onResolve({filter: /resend-client$/}, () => ({path:"provider",namespace:"email-test"}));
      b.onResolve({filter: /connectorGuard$/}, () => ({path:"guard",namespace:"email-test"}));
      b.onLoad({filter: /.*/, namespace:"email-test"}, ({path}) => path === "guard"
        ? {contents:'export async function isConnectorEnabled(){return true;}',loader:"js"}
        : {contents: `import { checkedEmailSend } from ${JSON.stringify(join(root,"email-acceptance.ts"))};
          export const messages = []; let fail = false;
          export function reset(reject = false){ messages.length = 0; fail = reject; }
          export async function getUncachableResendClient(){ return {fromEmail:"sender@example.test",client:{emails:{send:checkedEmailSend(async message=>{messages.push(message);return fail?{data:null,error:{message:"synthetic rejection"}}:{data:{id:"mock-accepted-123"},error:null};})}}}; }`,loader:"js",resolveDir:root});
    }}],
  });
  fixture = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString("base64")}`);
});

test("actual completion sender carries every answer, two coaches, reply address and real attachment", async () => {
  for (const language of ["en", "fr"]) {
    fixture.reset();
    const rawData = Object.fromEntries(Array.from({length:129},(_,i)=>[`Question ${i+1}`,`Synthetic answer ${i+1}`]));
    assert.equal(await fixture.sendTypeformScanCompletionEmail({customerEmail:"synthetic@example.test",customerName:"<img src=x>",formattedSummary:{firstName:"<img src=x>"},rawData,submittedAt:"Synthetic date",language}),true);
    const [message] = fixture.messages;
    assert.deepEqual(message.cc,["esteve@greenelephant.org","anu@greenelephant.org"]);
    assert.equal(message.replyTo,"esteve@greenelephant.org");
    assert.equal(message.to,"synthetic@example.test");
    assert.ok(message.text.includes("Question 129"));
    assert.ok(message.attachments[0].content.toString("utf8").includes("Synthetic answer 129"));
    assert.doesNotMatch(message.html,/<img src=x>|onclick=/);
    assert.ok(message.subject.includes(language === "fr" ? "Vos réponses" : "Your Satellite"));
  }
});
test("actual dashboard sender validates link before send and preserves the report attachment", async () => {
  fixture.reset();
  assert.equal(await fixture.sendCoachingDocLinkEmail({coacheeEmail:"synthetic@example.test",coacheeName:"Alex",docUrl:"javascript:alert(1)",reportText:"Report"}),false);
  assert.equal(fixture.messages.length,0);
  assert.equal(await fixture.sendCoachingDocLinkEmail({coacheeEmail:"synthetic@example.test",docUrl:"https://example.test/dashboard?a=1&b=2",reportText:"Full report\nFinal line",language:"fr"}),true);
  const [message] = fixture.messages;
  assert.match(message.html,/a=1&amp;b=2/);
  assert.equal(message.attachments[0].content.toString("utf8"),"Full report\nFinal line");
  assert.equal(message.replyTo,"esteve@greenelephant.org");
});
test("actual raw-answer and export senders attach complete content", async () => {
  fixture.reset();
  await fixture.sendCoachingRawDataEmail({coacheeEmail:"synthetic@example.test",rawData:{Question:"First\nLast"},language:"fr"});
  assert.equal(fixture.messages[0].attachments[0].content.toString("utf8"),"Question\nFirst\nLast");
  const data = {timeline:Array.from({length:129},(_,i)=>({id:i,note:"Synthetic ".repeat(50)})),context:{goal:"Learn"}};
  await fixture.sendPortalDataExportEmail("synthetic@example.test","Alex",data,"fr");
  assert.deepEqual(JSON.parse(fixture.messages[1].attachments[0].content.toString("utf8")),data);
});
test("legacy verification and result sender return failure on provider rejection", async () => {
  fixture.reset(true);
  assert.equal(await fixture.sendVerificationEmail({email:"synthetic@example.test",code:"000000"}),false);
  assert.equal(await fixture.sendCoachingRawDataEmail({coacheeEmail:"synthetic@example.test",rawData:{Question:"Answer"}}),false);
  assert.equal(fixture.messages.length,2);
});

test("purchase and reminder senders deliver the selected language and independently report acceptance", async()=>{
 for(const language of ['en','fr']) {
  fixture.reset();
  assert.equal(await fixture.sendSatellitescanPurchaseEmail({customerEmail:'synthetic@example.test',customerName:'<img src=x>',amount:'0.00',paymentIntentId:'fixture-payment',purchaseId:'fixture-purchase',language,idempotencyKey:'fixture-key'}),true);
  assert.equal(fixture.messages.length,2);
  assert.match(fixture.messages[1].subject,language==='fr'?/confirmé/:/confirmed/);
  assert.equal(fixture.messages[1].replyTo,'esteve@greenelephant.org');
  assert.doesNotMatch(fixture.messages[1].html,/<img src=x>/);
  assert.equal(await fixture.sendSatellitescanReminderEmail('synthetic@example.test','Alex',language,'fixture-reminder'),true);
 }
 fixture.reset(true);
 assert.equal(await fixture.sendSatellitescanPurchaseEmail({customerEmail:'synthetic@example.test',customerName:'Alex',amount:'0.00',paymentIntentId:'fixture-payment',purchaseId:'fixture-purchase'}),false);
 assert.equal(fixture.messages.length,2);
});
