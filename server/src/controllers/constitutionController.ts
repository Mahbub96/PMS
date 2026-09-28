import { Request, Response } from 'express';
import { ConstitutionRule } from '../models/ConstitutionRule.js';
import { pdfService } from '../services/pdfService.js';

export class ConstitutionController {
  /**
   * GET /api/v1/constitution
   */
  async getAllRules(req: Request, res: Response): Promise<void> {
    try {
      const rules = await ConstitutionRule.find().sort({ articleNumber: 1 });
      res.json({ success: true, count: rules.length, data: rules });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * GET /api/v1/constitution/export-pdf
   * Generates and streams PDF to the client
   */
  async exportPdf(req: Request, res: Response): Promise<void> {
    try {
      const doc = await pdfService.generateConstitutionPdf();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="Penalty_Management_Constitution_Rule_Book.pdf"'
      );

      doc.pipe(res);
      doc.end();
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * PATCH /api/v1/constitution/:id
   */
  async updateRule(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { fineAmount, description, severity, isActive } = req.body;

      const rule = await ConstitutionRule.findByIdAndUpdate(
        id,
        { fineAmount, description, severity, isActive },
        { new: true }
      );

      if (!rule) {
        res.status(404).json({ success: false, error: 'Rule not found' });
        return;
      }

      res.json({ success: true, data: rule });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export const constitutionController = new ConstitutionController();
