import test from 'node:test';
import assert from 'node:assert/strict';
import { createMarketingWithdrawal, type WithdrawalStore, type WithdrawalEvent } from './marketing-withdrawal';

function fixture(exists = true) {
  let state = { consent: 'true', suppressed: false, events: [] as WithdrawalEvent[] };
  let failAt = '';
  let queue = Promise.resolve();
  const store: WithdrawalStore = {
    async transaction(work) {
      const previous = queue;
      let release!: () => void;
      queue = new Promise<void>(resolve => { release = resolve; });
      await previous;
      const draft = structuredClone(state);
      try {
        const result = await work({
          async lockContact() { return exists; },
          async suppress() { draft.suppressed = true; if (failAt === 'suppression') throw Error('synthetic failure'); },
          async clearMarketingFlag() { draft.consent = 'false'; },
          async appendOnce(event) {
            if (failAt === 'evidence') throw Error('synthetic failure');
            if (draft.events.some(e => e.subjectKey === event.subjectKey)) return false;
            draft.events.push(event); return true;
          },
        });
        if (failAt === 'commit') throw Error('synthetic commit failure');
        state = draft;
        return result;
      } finally { release(); }
    },
  };
  return {
    withdraw: createMarketingWithdrawal(store, () => new Date('2026-10-08T09:00:00Z')),
    state: () => state,
    fail: (at: string) => { failAt = at; },
  };
}

test('withdrawal records minimal evidence and suppression in one successful transaction', async () => {
  const f = fixture();
  assert.equal(await f.withdraw('fixture-contact'), 'recorded');
  assert.equal(f.state().suppressed, true);
  assert.equal(f.state().consent, 'false');
  const [event] = f.state().events;
  assert.equal(event.contactId, 'fixture-contact');
  assert.equal(event.purpose, 'marketing_updates');
  assert.equal(event.action, 'withdrawn');
  assert.equal(event.source, 'email_preferences');
  assert.equal(event.recordedAt.toISOString(), '2026-10-08T09:00:00.000Z');
  assert.deepEqual(Object.keys(event).sort(), ['contactId','subjectKey','purpose','action','source','interfaceVersion','recordedAt'].sort());
  assert.doesNotMatch(event.subjectKey, /fixture-contact/);
});

test('retries and concurrent duplicate clicks preserve the first transition', async () => {
  const f = fixture();
  const results = await Promise.all(Array.from({length:8}, () => f.withdraw('fixture-contact')));
  assert.equal(results.filter(r => r === 'recorded').length, 1);
  assert.equal(f.state().events.length, 1);
  assert.equal(f.state().suppressed, true);
  assert.equal(f.state().consent, 'false');
});

test('evidence, suppression or commit failure cannot leave a partial successful change', async () => {
  for (const point of ['suppression','evidence','commit']) {
    const f = fixture(); f.fail(point);
    await assert.rejects(f.withdraw('fixture-contact'));
    assert.deepEqual(f.state(), {consent:'true',suppressed:false,events:[]});
    f.fail('');
    assert.equal(await f.withdraw('fixture-contact'), 'recorded');
  }
});

test('an old link for a deleted contact suppresses stale queued work without recreating the person', async () => {
  const f = fixture(false);
  await f.withdraw('deleted-fixture');
  assert.equal(f.state().suppressed, true);
  assert.equal(f.state().events[0].contactId, null);
  assert.equal(f.state().events[0].action, 'withdrawn');
});

test('invalid references cannot begin a withdrawal', async () => {
  const f = fixture();
  for (const id of ['', 'fixture@example.test', '../contact', 'x'.repeat(129)]) {
    await assert.rejects(f.withdraw(id), /invalid_contact_reference/);
  }
  assert.equal(f.state().events.length, 0);
});
