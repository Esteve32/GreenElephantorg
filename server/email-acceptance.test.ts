import test from "node:test";
import assert from "node:assert/strict";
import { checkedEmailSend } from "./email-acceptance";

test("provider errors never reach a sender's success path", async () => {
  let success = false;
  await assert.rejects(async () => { await checkedEmailSend(async () => ({ data: null, error: { message: "private response" } }))(); success = true; }, /^Error: email_provider_rejected$/);
  assert.equal(success, false);
});
test("network exceptions are redacted and never retried", async () => {
  let calls = 0;
  await assert.rejects(checkedEmailSend(async () => { calls++; throw new Error("private token"); }), /^Error: email_provider_exception$/);
  assert.equal(calls, 1);
});
test("missing or malformed IDs cannot count as accepted", async () => {
  for (const id of [undefined, "", "<script>", "bad\nid"]) {
    await assert.rejects(checkedEmailSend(async () => ({ data: { id } })), /^Error: email_provider_invalid_response$/);
  }
});
test("accepted payload and idempotency options pass through unchanged", async () => {
  const message = { to: "synthetic@example.test", attachments: [{ filename: "answers.txt", content: "all answers" }] };
  const options = { idempotencyKey: "synthetic-test" };
  const response = { data: { id: "accepted-123" }, error: null };
  const send = checkedEmailSend(async (m: typeof message, o: typeof options) => { assert.equal(m, message); assert.equal(o, options); return response; });
  assert.equal(await send(message, options), response);
});
