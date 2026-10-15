import { eq } from 'drizzle-orm';
import { db } from './db';
import { adminSettings, contacts, privacyPreferenceEvents } from '@shared/schema';
import { operationKey } from './delivery-security';
import { createMarketingWithdrawal, type WithdrawalStore } from './marketing-withdrawal';

// No transaction starts at import time. The reviewed additive migration must
// precede deployment; missing storage makes a withdrawal fail, never claim success.
const store: WithdrawalStore = {
  transaction: work => db.transaction(async tx => work({
    async lockContact(contactId) {
      const rows = await tx.select({ id: contacts.id }).from(contacts)
        .where(eq(contacts.id, contactId)).limit(1).for('update');
      return rows.length === 1;
    },
    async suppress(contactId, recordedAt) {
      await tx.insert(adminSettings).values({
        key: operationKey('marketing-suppressed', contactId),
        value: JSON.stringify({ suppressed: true, updatedAt: recordedAt.toISOString() }),
      }).onConflictDoNothing();
    },
    async clearMarketingFlag(contactId) {
      // Preserve historical consent wording and timestamp; do not rewrite evidence.
      await tx.update(contacts).set({ consentGiven: 'false' }).where(eq(contacts.id, contactId));
    },
    async appendOnce(event) {
      const rows = await tx.insert(privacyPreferenceEvents).values(event)
        .onConflictDoNothing({ target: privacyPreferenceEvents.subjectKey })
        .returning({ id: privacyPreferenceEvents.id });
      return rows.length === 1;
    },
  })),
};

export const withdrawMarketingWithHistory = createMarketingWithdrawal(store);
