import { Request, Response } from 'express';
import dayjs from 'dayjs';
import { env } from '../config/env.js';
import { AttendanceLog } from '../models/AttendanceLog.js';
import { rulesEngine } from '../services/rulesEngine.js';

export class AttendanceController {
  /**
   * GET /api/v1/attendance
   * Fetch daily attendance records
   */
  async getDailyAttendance(req: Request, res: Response): Promise<void> {
    try {
      const targetDate = (req.query.date as string) || dayjs().tz(env.TIMEZONE).format('YYYY-MM-DD');

      let records = await AttendanceLog.find({ date: targetDate }).sort({ officialName: 1 });

      // If no records found for today, trigger a sync run automatically
      if (records.length === 0) {
        await rulesEngine.runDailyProsecution(targetDate);
        records = await AttendanceLog.find({ date: targetDate }).sort({ officialName: 1 });
      }

      res.json({
        success: true,
        date: targetDate,
        total: records.length,
        presentCount: records.filter((r) => r.present).length,
        doneCount: records.filter((r) => r.doneMessageSent).length,
        penalizedCount: records.filter((r) => r.penaltyTriggered).length,
        data: records,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * POST /api/v1/attendance/sync
   * Manually trigger biometric attendance and rule evaluation
   */
  async syncAttendance(req: Request, res: Response): Promise<void> {
    try {
      const targetDate = req.body.date || dayjs().tz(env.TIMEZONE).format('YYYY-MM-DD');
      const result = await rulesEngine.runDailyProsecution(targetDate);
      res.json({ success: true, result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export const attendanceController = new AttendanceController();
