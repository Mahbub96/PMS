import { Request, Response } from 'express';
import { Penalty } from '../models/Penalty.js';
import { AttendanceLog } from '../models/AttendanceLog.js';

export class StatsController {
  /**
   * GET /api/v1/stats/dashboard
   * Returns aggregated statistics: total penalties, collected amount, pending amount, dispute counts
   */
  async getDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      const [
        totalPenalties,
        totalAmountResult,
        collectedAmountResult,
        pendingAmountResult,
        statusCounts,
        attendanceCounts,
      ] = await Promise.all([
        Penalty.countDocuments(),
        Penalty.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
        Penalty.aggregate([
          { $match: { status: 'PAID' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        Penalty.aggregate([
          { $match: { status: 'PENDING' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        Penalty.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        AttendanceLog.aggregate([
          {
            $group: {
              _id: null,
              totalLogged: { $sum: 1 },
              totalPresent: { $sum: { $cond: ['$present', 1, 0] } },
              totalDone: { $sum: { $cond: ['$doneMessageSent', 1, 0] } },
              totalPenalized: { $sum: { $cond: ['$penaltyTriggered', 1, 0] } },
            },
          },
        ]),
      ]);

      const totalFinesIssued = totalAmountResult[0]?.total || 0;
      const totalCollected = collectedAmountResult[0]?.total || 0;
      const totalPending = pendingAmountResult[0]?.total || 0;
      const collectionRate = totalFinesIssued > 0 ? Math.round((totalCollected / totalFinesIssued) * 100) : 0;

      const countsByStatus: Record<string, number> = {
        PENDING: 0,
        PAID: 0,
        DISPUTED: 0,
        WAIVED: 0,
      };

      statusCounts.forEach((s) => {
        countsByStatus[s._id] = s.count;
      });

      res.json({
        success: true,
        data: {
          totalPenalties,
          totalFinesIssued,
          totalCollected,
          totalPending,
          collectionRate,
          statusBreakdown: countsByStatus,
          attendanceOverview: attendanceCounts[0] || {
            totalLogged: 0,
            totalPresent: 0,
            totalDone: 0,
            totalPenalized: 0,
          },
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export const statsController = new StatsController();
