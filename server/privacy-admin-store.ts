import { desc, sql } from 'drizzle-orm';
import { db } from './db';
import { auditLogs, privacyPreferenceEvents as events } from '@shared/schema';
import type { PrivacyAdminIdentity } from './privacy-admin-access';
import type { PrivacyWithdrawalPage } from '@shared/privacy-admin';

const PAGE_SIZE = 25;

export async function readPrivacyWithdrawalsAudited(
  actor: PrivacyAdminIdentity, after?: string,
): Promise<Omit<PrivacyWithdrawalPage, 'accessExpiresAt'>> {
  return db.transaction(async tx => {
    // Compare in PostgreSQL to preserve timestamp precision. Cursor is only an event ID.
    const rows = await tx.select({
      id: events.id, recordedAt: events.recordedAt,
      contactLinked: sql<boolean>`${events.contactId} is not null`,
    }).from(events).where(after ? sql`(${events.recordedAt}, ${events.id}) <
      (select recorded_at, id from privacy_preference_events where id = ${after})` : undefined)
      .orderBy(desc(events.recordedAt), desc(events.id)).limit(PAGE_SIZE + 1);
    const page = rows.slice(0, PAGE_SIZE);
    // Direct insert, deliberately NOT best-effort logAuditEvent. No contact/event IDs,
    // query values, messages or recipient addresses in the general admin audit.
    await tx.insert(auditLogs).values({
      userEmail: actor.email, actionType: 'privacy_withdrawals_read',
      resource: '/admin/ropa', details: { actorId: actor.id, returnedRows: page.length },
      ipAddress: null,
    });
    return {
      events: page.map(row => ({ ...row, recordedAt: row.recordedAt.toISOString() })),
      nextCursor: rows.length > PAGE_SIZE ? page[page.length - 1].id : null,
    };
  });
}
