import { operationKey } from './delivery-security';

export const MARKETING_PURPOSE = 'marketing_updates' as const;
export const WITHDRAWAL_INTERFACE_VERSION = 'email-unsubscribe-v1' as const;

export type WithdrawalEvent = {
  contactId: string | null;
  subjectKey: string;
  purpose: typeof MARKETING_PURPOSE;
  action: 'withdrawn';
  source: 'email_preferences';
  interfaceVersion: typeof WITHDRAWAL_INTERFACE_VERSION;
  recordedAt: Date;
};

export interface WithdrawalTransaction {
  lockContact(contactId: string): Promise<boolean>;
  suppress(contactId: string, recordedAt: Date): Promise<void>;
  clearMarketingFlag(contactId: string): Promise<void>;
  appendOnce(event: WithdrawalEvent): Promise<boolean>;
}

export interface WithdrawalStore {
  transaction<T>(work: (tx: WithdrawalTransaction) => Promise<T>): Promise<T>;
}

/**
 * This first slice only withdraws permission; it cannot grant or resubscribe.
 * Repeated signed-link requests record one transition, never a fabricated grant.
 */
export function createMarketingWithdrawal(store: WithdrawalStore, now = () => new Date()) {
  return async (contactId: string): Promise<'recorded' | 'already_recorded'> => {
    if (!/^[a-zA-Z0-9_-]{1,128}$/.test(contactId)) throw new Error('invalid_contact_reference');
    return store.transaction(async tx => {
      const exists = await tx.lockContact(contactId);
      const recordedAt = now();
      if (!Number.isFinite(recordedAt.getTime())) throw new Error('invalid_event_time');
      // Retain suppression for old queued recipients even if the person was erased.
      await tx.suppress(contactId, recordedAt);
      if (exists) await tx.clearMarketingFlag(contactId);
      const appended = await tx.appendOnce({
        contactId: exists ? contactId : null,
        subjectKey: operationKey('marketing-withdrawal', contactId),
        purpose: MARKETING_PURPOSE,
        action: 'withdrawn',
        source: 'email_preferences',
        interfaceVersion: WITHDRAWAL_INTERFACE_VERSION,
        recordedAt,
      });
      return appended ? 'recorded' : 'already_recorded';
    });
  };
}
