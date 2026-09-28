import cron from 'node-cron';
import { env } from '../config/env.js';
import { rulesEngine } from '../services/rulesEngine.js';

export function initCronJobs(): void {
  // Run daily at 10:25 AM in Asia/Dhaka timezone
  const cronExpression = `${env.CUTOFF_MINUTE} ${env.CUTOFF_HOUR} * * *`;

  console.log(`[CronScheduler] Scheduling daily prosecution job with expression "${cronExpression}" in timezone "${env.TIMEZONE}"`);

  cron.schedule(
    cronExpression,
    async () => {
      console.log(`[CronScheduler] 10:25 AM Cutoff reached! Initiating automated daily prosecution...`);
      try {
        const result = await rulesEngine.runDailyProsecution();
        console.log(`[CronScheduler] Prosecution completed successfully:`, {
          present: result.totalPresent,
          penalties: result.totalPenalized,
        });
      } catch (error) {
        console.error(`[CronScheduler] Error executing automated prosecution:`, error);
      }
    },
    {
      timezone: env.TIMEZONE,
    }
  );
}
