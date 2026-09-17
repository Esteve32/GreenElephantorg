import Stripe from "stripe";
import { pool } from "./db";
import {
  createStripeDeletionGateway,
  isResumableMyFiveDeletionEnabled,
  resumeDueMyFiveAccountDeletions,
} from "./myfive-account-deletion";
import { writeMyFiveOperationalFailure } from "./myfive-security";

const RETRY_INTERVAL_MS = 5 * 60 * 1000;

function deletionGateway() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" as any });
  return createStripeDeletionGateway(stripe);
}

export function startMyFiveDeletionScheduler(): void {
  if (!isResumableMyFiveDeletionEnabled()) return;
  let running = false;
  const run = async () => {
    if (running) return;
    running = true;
    try {
      const result = await resumeDueMyFiveAccountDeletions(pool, deletionGateway());
      if (result.attempted > 0) {
        console.log(`MyFive deletion worker processed ${result.attempted} request(s); ${result.completed} completed`);
      }
    } catch {
      writeMyFiveOperationalFailure("deletion_worker_unavailable");
    } finally {
      running = false;
    }
  };
  void run();
  setInterval(() => void run(), RETRY_INTERVAL_MS);
}
