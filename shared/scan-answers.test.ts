import test from "node:test";
import assert from "node:assert/strict";
import { appendScanAnswer, typeformAnswerValue } from "./scan-answers";

test("duplicate question titles and suffix collisions preserve every answer", () => {
  const out: Record<string, string> = {};
  for (const [key, value] of [["Question", "one"], ["Question (2)", "two"], ["Question", "three"], ["Question", "four"]]) appendScanAnswer(out, key, value);
  assert.deepEqual(Object.values(out), ["one", "two", "three", "four"]);
});
test("special property titles remain data without changing the prototype", () => {
  const out = {};
  appendScanAnswer(out, "__proto__", "answer");
  assert.equal(Object.getPrototypeOf(out), Object.prototype);
  assert.deepEqual(Object.entries(out), [["__proto__", "answer"]]);
});
test("multiple choices include both named choices and the other response", () => {
  assert.equal(typeformAnswerValue({ type: "choices", choices: { labels: ["One", "Two"], other: "My answer" } }), "One, Two, My answer");
});
test("zero, false, missing and multiline answers stay distinct", () => {
  assert.equal(typeformAnswerValue({ type: "number", number: 0 }), "0");
  assert.equal(typeformAnswerValue({ type: "boolean", boolean: false }), "No");
  assert.equal(typeformAnswerValue({ type: "boolean" }), "");
  assert.equal(typeformAnswerValue({ type: "text", text: "line 1\nline 2" }), "line 1\nline 2");
});
test("payment display keeps amount/currency while unfamiliar response types remain intact", () => {
  assert.equal(typeformAnswerValue({type:"payment",payment:{amount:0,currency:"EUR",last4:"0000"}}), "0 EUR");
  const answer = {type:"new_type",nested:{value:"answer"}};
  assert.deepEqual(JSON.parse(typeformAnswerValue(answer)),answer);
});
