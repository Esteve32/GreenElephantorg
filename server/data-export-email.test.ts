import assert from 'node:assert/strict';
import test from 'node:test';
import { renderDataExportEmail } from './data-export-email';

test('attachment preserves the entire JSON export beyond the HTML preview limit', () => {
  const data = { timeline: Array.from({ length: 129 }, (_, id) => ({ id, note: 'Réflexion '.repeat(40) })), context: { goal: 'Write clearly' } };
  const draft = renderDataExportEmail('Alex', data);
  assert.ok(draft.attachment.length > 3000);
  assert.deepEqual(JSON.parse(Buffer.from(draft.attachment, 'utf8').toString('utf8')), data);
  assert.equal(draft.filename, 'greenelephant-data-export.json');
  assert.match(draft.bodyHtml, /Preview shortened/);
  assert.ok(draft.text.includes('attached greenelephant-data-export.json'));
});

test('HTML preview and greeting cannot render injected markup', () => {
  const draft = renderDataExportEmail('<img src=x>', { timeline: ['<script>alert(1)</script>'], context: { note: '& text' } });
  assert.doesNotMatch(draft.bodyHtml, /<img|<script/);
  assert.match(draft.bodyHtml, /&lt;script&gt;/);
  assert.match(draft.bodyHtml, /&amp; text/);
  assert.ok(draft.attachment.includes('<script>'));
});

test('French and English export explanations accurately name the real attachment', () => {
  for (const language of ['en', 'fr'] as const) {
    const draft = renderDataExportEmail(null, { timeline: [], context: {} }, language);
    assert.ok(draft.text.includes(draft.filename));
    assert.doesNotMatch(draft.bodyHtml, /Preview shortened|Aperçu abrégé/);
    assert.ok(draft.subject.includes(language === 'fr' ? 'Votre export' : 'Your Green'));
  }
});
