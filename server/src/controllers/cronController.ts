import { Request, Response } from 'express';
import { rulesEngine } from '../services/rulesEngine.js';

export class CronController {
  /**
   * POST /api/v1/cron/prosecution/run
   * Triggers the 10:25 AM prosecution engine manually
   */
  async triggerProsecution(req: Request, res: Response): Promise<void> {
    try {
      const { targetDate } = req.body;
      const result = await rulesEngine.runDailyProsecution(targetDate);
      res.json({
        success: true,
        message: 'Prosecution executed successfully',
        summary: result,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export const cronController = new CronController();
