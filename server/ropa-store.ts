import { isDeepStrictEqual } from 'node:util';
import { and, asc, desc, eq, gt, sql } from 'drizzle-orm';
import type { db } from './db';
import { adminUsers, auditLogs, ropaActivities as activities, ropaActivityVersions as versions } from '@shared/schema';
import { RopaConflict, RopaNotFound, RopaAccessDenied, type RopaSave } from '@shared/ropa';
import type { PrivacyAdminIdentity } from './privacy-admin-access';

export function createRopaStore(database: Pick<typeof db, 'transaction'>) {
  type Tx = Parameters<Parameters<typeof database.transaction>[0]>[0];
  async function audit(tx: Tx, actor: PrivacyAdminIdentity, action: string, count: number) {
    await tx.insert(auditLogs).values({ userEmail: actor.email, actionType: action, resource: '/admin/ropa',
      details: { actorId: actor.id, returnedRows: count }, ipAddress: null });
  }
  const activityView = (row: typeof activities.$inferSelect) => ({ ...row, updatedAt: row.updatedAt.toISOString() });
  return {
    async list(actor: PrivacyAdminIdentity, query: { after?: string; search?: string; status?: string }, exporting = false) {
      return database.transaction(async tx => {
        const clauses = [query.after ? gt(activities.id, query.after) : undefined,
          query.status ? sql`${activities.record}->>'status' = ${query.status}` : undefined,
          query.search ? sql`position(lower(${query.search}) in lower(${activities.record}::text)) > 0` : undefined];
        const limit = exporting ? 1001 : 26;
        const rows = await tx.select().from(activities).where(and(...clauses)).orderBy(asc(activities.id)).limit(limit);
        // Never silently truncate an export. Larger registers need an explicit paged export design.
        if (exporting && rows.length === limit) throw new Error('Export exceeds bounded limit');
        const page = exporting ? rows : rows.slice(0, 25);
        await audit(tx, actor, exporting ? 'ropa_export' : 'ropa_list', page.length);
        return { activities: page.map(activityView), nextCursor: !exporting && rows.length > 25 ? page[page.length - 1].id : null };
      });
    },
    async detail(actor: PrivacyAdminIdentity, id: string, before?: number) {
      return database.transaction(async tx => {
        const [current] = await tx.select().from(activities).where(eq(activities.id, id));
        if (!current) throw new RopaNotFound();
        const history = await tx.select({ version: versions.version, record: versions.record, reason: versions.reason,
          actorId: versions.actorId, recordedAt: versions.recordedAt }).from(versions)
          .where(and(eq(versions.activityId, id), before ? sql`${versions.version} < ${before}` : undefined))
          .orderBy(desc(versions.version)).limit(26);
        await audit(tx, actor, 'ropa_history_read', Math.min(history.length, 25));
        return { activity: activityView(current), revisions: history.slice(0,25).map(r => ({ ...r, recordedAt: r.recordedAt.toISOString() })),
          nextBefore: history.length > 25 ? history[24].version : null };
      });
    },
    async save(actor: PrivacyAdminIdentity, input: RopaSave, id?: string) {
      return database.transaction(async tx => {
        // Lock the named account while writing so deactivation/role changes cannot
        // race this transaction using only a previously checked session.
        const [current] = await tx.select().from(adminUsers).where(eq(adminUsers.id, actor.id)).for('share');
        if (!current || current.isActive !== 'true' || current.email !== actor.email ||
          current.googleId !== actor.googleId || current.role !== actor.role || !['admin','super_admin'].includes(current.role)) throw new RopaAccessDenied();
        const [prior] = await tx.select().from(versions).where(eq(versions.mutationId, input.mutationId));
        if (prior) {
          if (prior.actorId !== actor.id || (id && id !== prior.activityId) || prior.version !== input.expectedVersion + 1 ||
            prior.reason !== input.reason || !isDeepStrictEqual(prior.record, input.record)) throw new RopaConflict();
          await audit(tx, actor, 'ropa_save_replay', 0);
          return { id: prior.activityId, version: prior.version, replayed: true };
        }
        const version = input.expectedVersion + 1;
        let activityId: string;
        if (id) {
          if (input.expectedVersion === 0) throw new RopaConflict();
          const updated = await tx.update(activities).set({ version, record: input.record, updatedAt: new Date() })
            .where(and(eq(activities.id, id), eq(activities.version, input.expectedVersion))).returning({ id: activities.id });
          if (!updated.length) throw new RopaConflict();
          activityId = id;
        } else {
          if (input.expectedVersion !== 0) throw new RopaConflict();
          const [created] = await tx.insert(activities).values({ version, record: input.record }).returning({ id: activities.id });
          activityId = created.id;
        }
        await tx.insert(versions).values({ activityId, version, record: input.record, reason: input.reason, actorId: actor.id, mutationId: input.mutationId });
        await audit(tx, actor, 'ropa_save', 1);
        return { id: activityId, version, replayed: false };
      });
    },
  };
}
export type RopaStore = ReturnType<typeof createRopaStore>;
