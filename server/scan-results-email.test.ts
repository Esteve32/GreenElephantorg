import assert from 'node:assert/strict';
import test from 'node:test';
import { renderScanResultDraft, dashboardHttpsUrl, acceptScanResultEmail, serializeScanAnswers } from './scan-results-email';

test('all supplied answers, including blanks and multiline values, survive text serialization', () => {
  const rawData = { 'First question': 'Line one\nLine two', Empty: '', Number: 0, Choice: false };
  const text = serializeScanAnswers(rawData);
  assert.equal(text, 'First question\nLine one\nLine two\n\nEmpty\n\n\nNumber\n0\n\nChoice\nfalse');
  const draft = renderScanResultDraft({ kind: 'completion', rawData });
  assert.ok(draft.text.includes(text));
  assert.match(draft.bodyHtml, /<pre /);
  assert.doesNotMatch(draft.bodyHtml, /max-height|onclick|<script|<textarea/i);
});

test('untrusted names, answer keys, answer values and timestamps are escaped in HTML', () => {
  const draft = renderScanResultDraft({ kind: 'completion', name: '<img src=x onerror=alert(1)>', rawData: { '<script>': '<a href="https://evil.test">answer & stuff</a>' }, submittedAt: '<b>now</b>' });
  assert.doesNotMatch(draft.bodyHtml, /<img|<script|<b>now/);
  assert.match(draft.bodyHtml, /&lt;script&gt;/);
  assert.match(draft.bodyHtml, /&amp; stuff/);
  assert.ok(draft.text.includes('<script>'));
});

test('dashboard report text cannot introduce HTML and URL attributes are escaped', () => {
  const draft = renderScanResultDraft({ kind: 'dashboard', docUrl: 'https://example.test/dashboard?a=1&b=2', reportText: '<img src=x>\nSecond line' });
  assert.match(draft.bodyHtml, /a=1&amp;b=2/);
  assert.match(draft.bodyHtml, /&lt;img src=x&gt;/);
  assert.ok(draft.text.includes('<img src=x>\nSecond line'));
});

test('dashboard links reject active schemes, plain HTTP, credentials and control characters', () => {
  for (const value of ['javascript:alert(1)', 'data:text/html,test', 'http://example.test', 'https://user:pass@example.test', 'https://example.test/\npath', '//example.test', '']) {
    assert.throws(() => dashboardHttpsUrl(value), undefined, value);
  }
  assert.equal(dashboardHttpsUrl('https://example.test/path'), 'https://example.test/path');
});

test('English and French cover each of the three templates with privacy and copy guidance', () => {
  for (const language of ['en', 'fr'] as const) {
    for (const kind of ['completion', 'raw-data', 'dashboard'] as const) {
      const draft = renderScanResultDraft({ kind, language, rawData: { Question: 'Synthetic answer' }, docUrl: 'https://example.test/dashboard', reportText: 'Synthetic summary' });
      assert.ok(draft.subject.length);
      assert.ok(draft.text.includes(language === 'fr' ? 'retirez les noms' : 'remove names'));
      if (kind !== 'dashboard') assert.ok(draft.text.includes(language === 'fr' ? 'choisissez Copier' : 'choose Copy'));
    }
  }
});

test('provider rejection and exceptions never become accepted or expose error text', async () => {
  assert.deepEqual(await acceptScanResultEmail(async () => ({ error: { message: 'private payload' } })), { accepted: false, errorType: 'provider_rejected' });
  assert.deepEqual(await acceptScanResultEmail(async () => { throw new Error('private payload'); }), { accepted: false, errorType: 'provider_exception' });
  assert.deepEqual(await acceptScanResultEmail(async () => ({ data: {} })), { accepted: false, errorType: 'invalid_response' });
  assert.deepEqual(await acceptScanResultEmail(async () => ({ data: { id: 'accepted-123' } })), { accepted: true, messageId: 'accepted-123' });
});


test('complete download survives a long 129-answer message without truncation', () => {
  const rawData = Object.fromEntries(Array.from({ length: 129 }, (_, i) => [`Question ${i + 1}`, `Réponse ${i + 1}: ${'detail '.repeat(200)}`]));
  const draft = renderScanResultDraft({ kind: 'completion', language: 'fr', rawData });
  assert.equal(draft.filename, 'satellite-scan-responses.txt');
  assert.equal(draft.downloadText, serializeScanAnswers(rawData));
  assert.ok(draft.downloadText.includes('Question 129'));
  assert.ok(draft.downloadText.length > 100_000);
  assert.equal(Buffer.from(draft.downloadText, 'utf8').toString('utf8'), draft.downloadText);
});
