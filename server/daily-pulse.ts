import { storage } from './storage';
import { sendDailyPulseEmail } from './email-notifications';

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function isWithin24Hours(timestamp: Date | string | null, windowStart: Date): boolean {
  if (!timestamp) return false;
  const ts = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return ts >= windowStart;
}

export async function runDailyPulse(): Promise<boolean> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const dateLabel = formatDate(now);

  console.log(`\n📊 Running daily pulse for ${dateLabel}...`);

  try {
    const [
      scanPurchases,
      newsletterSubs,
      webinarSignups,
      flowChecks,
      quizResults,
      contactMessages,
    ] = await Promise.all([
      storage.getAllSatellitescanPurchases(),
      storage.getAllNewsletterSubscriptions(),
      storage.getAllWebinarWaitlistEntries(),
      storage.getAllFlowCheckResults(),
      storage.getAllSignalsQuizResults(),
      storage.getAllContactMessages(),
    ]);

    const recentScans = scanPurchases.filter(p => isWithin24Hours(p.createdAt, windowStart));
    const recentNewsletter = newsletterSubs.filter(s => isWithin24Hours(s.createdAt, windowStart));
    const recentWebinar = webinarSignups.filter(w => isWithin24Hours(w.createdAt, windowStart));
    const recentFlow = flowChecks.filter(f => isWithin24Hours(f.createdAt, windowStart));
    const recentQuiz = quizResults.filter(q => isWithin24Hours(q.createdAt, windowStart));
    const recentContact = contactMessages.filter(c => isWithin24Hours(c.createdAt, windowStart));

    const revenue = recentScans.reduce((sum, p) => sum + (parseFloat(p.amount) || 99.95), 0);

    const flowZones: Record<string, number> = {};
    for (const f of recentFlow) {
      const zone = f.zone ?? 'unknown';
      flowZones[zone] = (flowZones[zone] ?? 0) + 1;
    }

    await sendDailyPulseEmail({
      date: dateLabel,
      scanPurchases: recentScans.length,
      revenue,
      newsletterSubs: recentNewsletter.length,
      webinarSignups: recentWebinar.length,
      flowChecks: recentFlow.length,
      flowZones,
      quizCompletions: recentQuiz.length,
      contactMessages: recentContact.length,
    });

    console.log('✅ Daily pulse email sent.');
    return true;
  } catch (error) {
    console.error('❌ Daily pulse failed:', error);
    return false;
  }
}

export function startDailyPulseScheduler(): void {
  const now = new Date();

  const nextRun = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + (now.getUTCHours() >= 8 ? 1 : 0),
      8, 0, 0, 0
    )
  );

  const msUntilNext = nextRun.getTime() - now.getTime();

  console.log(`📊 Daily pulse scheduler initialized — first run in ${Math.round(msUntilNext / 60000)} minutes (${nextRun.toISOString()})`);

  setTimeout(() => {
    runDailyPulse();
    setInterval(runDailyPulse, 24 * 60 * 60 * 1000);
  }, msUntilNext);
}
