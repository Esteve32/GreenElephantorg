import type { SatellitescanPurchase } from './schema';

type ReminderPurchase = Pick<SatellitescanPurchase,
  'status' | 'typeformCompleted' | 'typeformCompletedAt' | 'dashboardSent' | 'remindersCount' | 'createdAt'>;

/** Necessary service reminder only; uncertain/inconsistent records require review. */
export function isScanReminderDue(purchase: ReminderPurchase, now = new Date(), hoursThreshold = 72): boolean {
  const createdAt = new Date(purchase.createdAt).getTime();
  const currentTime = now.getTime();
  return purchase.status === 'succeeded'
    && purchase.typeformCompleted === 'false'
    && purchase.typeformCompletedAt === null
    && purchase.dashboardSent === 'false'
    && purchase.remindersCount === '0'
    && Number.isFinite(createdAt) && Number.isFinite(currentTime)
    && Number.isFinite(hoursThreshold) && hoursThreshold >= 0
    && currentTime - createdAt >= hoursThreshold * 60 * 60 * 1000;
}
