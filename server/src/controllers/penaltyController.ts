import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { Penalty } from '../models/Penalty.js';
import { broadcastEvent, SocketEvents } from '../sockets/socketManager.js';

export class PenaltyController {
  /**
   * GET /api/v1/penalties
   * List penalties with filtering, search and pagination
   */
  async getPenalties(req: Request, res: Response): Promise<void> {
    try {
      const { date, status, employeeId, search, page = '1', limit = '50' } = req.query;

      const query: any = {};
      if (date) query.date = date;
      if (status) query.status = status;
      if (employeeId) query.employeeId = employeeId;
      if (search) {
        query.$or = [
          { employeeName: { $regex: search as string, $options: 'i' } },
          { employeeId: { $regex: search as string, $options: 'i' } },
          { penaltyId: { $regex: search as string, $options: 'i' } },
          { articleNumber: { $regex: search as string, $options: 'i' } },
        ];
      }

      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const skip = (pageNum - 1) * limitNum;

      const [penalties, total] = await Promise.all([
        Penalty.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
        Penalty.countDocuments(query),
      ]);

      res.json({
        success: true,
        data: penalties,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Helper to query by _id (if valid ObjectId) or penaltyId string
   */
  private buildIdQuery(id: string | string[]): any {
    const idStr = Array.isArray(id) ? id[0] : id;
    return mongoose.Types.ObjectId.isValid(idStr)
      ? { $or: [{ _id: idStr }, { penaltyId: idStr }] }
      : { penaltyId: idStr };
  }

  /**
   * GET /api/v1/penalties/:id
   */
  async getPenaltyById(req: Request, res: Response): Promise<void> {
    try {
      const penalty = await Penalty.findOne(this.buildIdQuery(req.params.id));

      if (!penalty) {
        res.status(404).json({ success: false, error: 'Penalty record not found' });
        return;
      }

      res.json({ success: true, data: penalty });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * PATCH /api/v1/penalties/:id/status
   * Mark as PAID or WAIVED
   */
  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status, paidVia, transactionRef, notes } = req.body;

      const penalty = await Penalty.findOne(this.buildIdQuery(req.params.id));

      if (!penalty) {
        res.status(404).json({ success: false, error: 'Penalty record not found' });
        return;
      }

      penalty.status = status;
      if (status === 'PAID') {
        penalty.paidAt = new Date();
        penalty.paidVia = paidVia || 'SALARY_DEDUCTION';
        penalty.transactionRef = transactionRef || null;
      }
      if (notes) {
        penalty.resolutionNotes = notes;
      }

      await penalty.save();

      broadcastEvent(SocketEvents.PENALTY_STATUS_CHANGED, penalty);
      broadcastEvent(SocketEvents.PENALTIES_UPDATED, { penaltyId: penalty.penaltyId, status });

      res.json({ success: true, data: penalty });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * POST /api/v1/penalties/:id/dispute
   * File an appeal against a penalty
   */
  async submitDispute(req: Request, res: Response): Promise<void> {
    try {
      const { disputeReason } = req.body;

      const penalty = await Penalty.findOne(this.buildIdQuery(req.params.id));

      if (!penalty) {
        res.status(404).json({ success: false, error: 'Penalty record not found' });
        return;
      }

      penalty.status = 'DISPUTED';
      penalty.disputeReason = disputeReason;
      penalty.disputeStatus = 'UNDER_REVIEW';
      penalty.disputedAt = new Date();

      await penalty.save();

      broadcastEvent(SocketEvents.PENALTY_STATUS_CHANGED, penalty);

      res.json({ success: true, message: 'Dispute submitted successfully', data: penalty });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * POST /api/v1/penalties
   * Manual penalty creation by Admin
   */
  async createManualPenalty(req: Request, res: Response): Promise<void> {
    try {
      const { employeeId, employeeName, department, articleNumber, reason, amount, date } = req.body;

      const penaltyId = `PEN-${date.replace(/-/g, '')}-${employeeId}-${Date.now().toString().slice(-4)}`;

      const penalty = new Penalty({
        penaltyId,
        date,
        employeeId,
        employeeName,
        department: department || 'General',
        articleNumber,
        reason,
        amount,
        status: 'PENDING',
        disputeStatus: 'NONE',
        isAutomated: false,
      });

      await penalty.save();

      broadcastEvent(SocketEvents.PENALTY_CREATED, penalty);
      broadcastEvent(SocketEvents.PENALTIES_UPDATED, { penaltyId });

      res.status(201).json({ success: true, data: penalty });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export const penaltyController = new PenaltyController();
