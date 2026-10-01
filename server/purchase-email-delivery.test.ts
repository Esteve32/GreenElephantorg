import assert from "node:assert/strict";
import test from "node:test";
import { attemptPurchaseEmails } from "./purchase-email-delivery";

test("both messages report provider acceptance with their own IDs", async () => {
  const results = await attemptPurchaseEmails({
    admin: async () => ({ data: { id: "admin-123" }, error: null }),
    customer: async () => ({ data: { id: "customer-456" }, error: null }),
  });
  assert.deepEqual(results, [
    { role: "admin", accepted: true, messageId: "admin-123" },
    { role: "customer", accepted: true, messageId: "customer-456" },
  ]);
  assert.equal(results.every(result => result.accepted), true);
});

test("a returned provider error fails the overall result but still attempts the customer", async () => {
  let customerCalls = 0;
  const results = await attemptPurchaseEmails({
    admin: async () => ({ data: null, error: { name: "validation_error" } }),
    customer: async () => { customerCalls++; return { data: { id: "customer-456" } }; },
  });
  assert.equal(customerCalls, 1);
  assert.deepEqual(results[0], { role: "admin", accepted: false, errorType: "provider_rejected" });
  assert.equal(results[1].accepted, true);
  assert.equal(results.every(result => result.accepted), false);
});

test("thrown errors cannot suppress the other attempt or expose private exception text", async () => {
  const results = await attemptPurchaseEmails({
    admin: async () => { throw new Error("private recipient and request payload"); },
    customer: async () => ({ data: { id: "customer-456" } }),
  });
  assert.deepEqual(results[0], { role: "admin", accepted: false, errorType: "provider_exception" });
  assert.equal(results[1].accepted, true);
  assert.equal(JSON.stringify(results).includes("private"), false);
});

test("customer rejection makes the combined boolean false even when admin succeeds", async () => {
  const results = await attemptPurchaseEmails({
    admin: async () => ({ data: { id: "admin-123" } }),
    customer: async () => ({ error: { name: "rate_limit_exceeded" } }),
  });
  assert.equal(results[0].accepted, true);
  assert.equal(results[1].accepted, false);
  assert.equal(results.every(result => result.accepted), false);
});

test("missing IDs and unsafe response values cannot be reported as accepted", async () => {
  const results = await attemptPurchaseEmails({
    admin: async () => ({ data: {} }),
    customer: async () => ({ data: { id: "recipient@example.org\nprivate" } }),
  });
  assert.deepEqual(results, [
    { role: "admin", accepted: false, errorType: "invalid_response" },
    { role: "customer", accepted: false, errorType: "invalid_response" },
  ]);
});
