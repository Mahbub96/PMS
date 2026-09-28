import PDFDocument from 'pdfkit';
import { ConstitutionRule } from '../models/ConstitutionRule.js';

export class PdfService {
  /**
   * Generates a high-quality PDF document of the official Constitution Rule Book.
   */
  async generateConstitutionPdf(): Promise<InstanceType<typeof PDFDocument>> {
    const rules = await ConstitutionRule.find({ isActive: true }).sort({ articleNumber: 1 });

    const doc = new PDFDocument({
      size: 'A4',
      margin: 40,
      info: {
        Title: 'Penalty Management Cloud - Official Constitution Rule Book',
        Author: 'Executive Board / HR Compliance',
        Subject: 'Disciplinary Code and Fine Schedule',
      },
    });

    // Header Background Accent
    doc.rect(40, 40, 515, 60).fill('#0f172a');

    // Title text inside banner
    doc.fillColor('#ffffff').fontSize(18).font('Helvetica-Bold')
      .text('PENALTY MANAGEMENT CLOUD', 55, 52);
    doc.fontSize(10).font('Helvetica')
      .text('OFFICIAL CONSTITUTION & DISCIPLINARY RULE BOOK (v2.4)', 55, 75);

    doc.moveDown(3);
    doc.fillColor('#334155').fontSize(9).font('Helvetica')
      .text(`Exported on: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} | Timezone: Asia/Dhaka | Authorized by: Human Resources Compliance`, 40, 115);

    // Decorative line
    doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(40, 130).lineTo(555, 130).stroke();

    let currentY = 145;

    // Table Header
    doc.rect(40, currentY, 515, 24).fill('#f1f5f9');
    doc.fillColor('#1e293b').fontSize(9).font('Helvetica-Bold');
    doc.text('ARTICLE', 50, currentY + 7);
    doc.text('TITLE & DESCRIPTION', 115, currentY + 7);
    doc.text('SEVERITY', 410, currentY + 7);
    doc.text('FINE (BDT)', 485, currentY + 7);

    currentY += 28;

    // Rules listing
    rules.forEach((rule, index) => {
      // Check if page overflow
      if (currentY > 720) {
        doc.addPage();
        currentY = 40;
      }

      const rowHeight = 44;
      const isEven = index % 2 === 0;

      if (isEven) {
        doc.rect(40, currentY, 515, rowHeight).fill('#f8fafc');
      }

      // Article tag
      doc.fillColor('#2563eb').fontSize(9).font('Helvetica-Bold')
        .text(`Art. ${rule.articleNumber}`, 50, currentY + 6);

      // Title & Description
      doc.fillColor('#0f172a').fontSize(9).font('Helvetica-Bold')
        .text(rule.title, 115, currentY + 6, { width: 280, ellipsis: true });
      doc.fillColor('#64748b').fontSize(8).font('Helvetica')
        .text(rule.description, 115, currentY + 18, { width: 280, height: 22, ellipsis: true });

      // Severity Badge color
      let sevColor = '#64748b';
      if (rule.severity === 'CRITICAL') sevColor = '#dc2626';
      else if (rule.severity === 'HIGH') sevColor = '#ea580c';
      else if (rule.severity === 'MEDIUM') sevColor = '#d97706';

      doc.fillColor(sevColor).fontSize(8).font('Helvetica-Bold')
        .text(rule.severity, 410, currentY + 14);

      // Fine Amount
      doc.fillColor('#059669').fontSize(10).font('Helvetica-Bold')
        .text(`৳${rule.fineAmount.toLocaleString()}`, 485, currentY + 14);

      currentY += rowHeight;
    });

    // Footer & Signature Section
    if (currentY > 660) {
      doc.addPage();
      currentY = 50;
    } else {
      currentY += 20;
    }

    doc.rect(40, currentY, 515, 70).fill('#f8fafc');
    doc.strokeColor('#e2e8f0').lineWidth(1).rect(40, currentY, 515, 70).stroke();

    doc.fillColor('#334155').fontSize(9).font('Helvetica-Bold')
      .text('STATUTORY GOVERNANCE & ENFORCEMENT NOTICE', 50, currentY + 10);
    doc.fillColor('#64748b').fontSize(8).font('Helvetica')
      .text(
        'Penalties auto-adjudicated at 10:25 AM Asia/Dhaka daily via Biometric Attendance Logs & WhatsApp Done Verification. All appeals must be filed via the Penalty Management Cloud portal within 48 hours of assessment.',
        50,
        currentY + 24,
        { width: 495 }
      );

    return doc;
  }
}

export const pdfService = new PdfService();
