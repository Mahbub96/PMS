import mongoose, { Schema, Document } from 'mongoose';

export type RuleSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface IConstitutionRule extends Document {
  articleNumber: string;
  title: string;
  category: string;
  description: string;
  fineAmount: number; // in BDT (৳)
  severity: RuleSeverity;
  gracePeriodMinutes: number;
  isActive: boolean;
  applicableShift: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConstitutionRuleSchema: Schema = new Schema(
  {
    articleNumber: { type: String, required: true, unique: true, index: true, trim: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Attendance & Punctuality', 'Daily Standup & Sync', 'Office Discipline', 'Workstation & Security', 'Reporting & Compliance', 'General Conduct'],
      default: 'Attendance & Punctuality',
    },
    description: { type: String, required: true },
    fineAmount: { type: Number, required: true, min: 0 },
    severity: {
      type: String,
      required: true,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    gracePeriodMinutes: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
    applicableShift: { type: String, default: 'General (10:00 - 18:00)' },
  },
  {
    timestamps: true,
  }
);

export const ConstitutionRule = mongoose.model<IConstitutionRule>('ConstitutionRule', ConstitutionRuleSchema);
