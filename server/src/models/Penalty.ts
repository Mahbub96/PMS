import mongoose, { Schema, Document } from 'mongoose';

export type PenaltyStatus = 'PENDING' | 'PAID' | 'DISPUTED' | 'WAIVED';
export type PaymentMethod = 'SALARY_DEDUCTION' | 'BKASH' | 'NAGAD' | 'CASH' | 'BANK_TRANSFER';
export type DisputeStatus = 'NONE' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED';

export interface IPenalty extends Document {
  penaltyId: string;
  date: string; // YYYY-MM-DD
  employeeId: string;
  employee?: mongoose.Types.ObjectId;
  employeeName: string;
  department: string;
  ruleId?: mongoose.Types.ObjectId;
  articleNumber: string;
  reason: string;
  amount: number; // in BDT (৳)
  status: PenaltyStatus;
  paidAt?: Date | null;
  paidVia?: PaymentMethod | null;
  transactionRef?: string | null;
  disputeReason?: string | null;
  disputeStatus: DisputeStatus;
  disputedAt?: Date | null;
  resolvedBy?: string | null;
  resolutionNotes?: string | null;
  waMessaged: boolean;
  isAutomated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PenaltySchema: Schema = new Schema(
  {
    penaltyId: { type: String, required: true, unique: true, index: true },
    date: { type: String, required: true, index: true },
    employeeId: { type: String, required: true, index: true },
    employee: { type: Schema.Types.ObjectId, ref: 'Employee' },
    employeeName: { type: String, required: true },
    department: { type: String, default: 'General' },
    ruleId: { type: Schema.Types.ObjectId, ref: 'ConstitutionRule' },
    articleNumber: { type: String, required: true, default: '1.1' },
    reason: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'PAID', 'DISPUTED', 'WAIVED'],
      default: 'PENDING',
      index: true,
    },
    paidAt: { type: Date, default: null },
    paidVia: {
      type: String,
      enum: ['SALARY_DEDUCTION', 'BKASH', 'NAGAD', 'CASH', 'BANK_TRANSFER'],
      default: null,
    },
    transactionRef: { type: String, default: null },
    disputeReason: { type: String, default: null },
    disputeStatus: {
      type: String,
      enum: ['NONE', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED'],
      default: 'NONE',
    },
    disputedAt: { type: Date, default: null },
    resolvedBy: { type: String, default: null },
    resolutionNotes: { type: String, default: null },
    waMessaged: { type: Boolean, default: false },
    isAutomated: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

PenaltySchema.index({ date: 1, employeeId: 1, articleNumber: 1 });
PenaltySchema.index({ date: 1, status: 1 });

export const Penalty = mongoose.model<IPenalty>('Penalty', PenaltySchema);
