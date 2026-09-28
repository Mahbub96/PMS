import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendanceLog extends Document {
  date: string; // YYYY-MM-DD in Asia/Dhaka
  employeeId: string;
  employee?: mongoose.Types.ObjectId;
  officialName: string;
  department: string;
  present: boolean;
  checkInTime?: Date;
  doneMessageSent: boolean;
  doneMessageTimestamp?: Date;
  doneMessageRaw?: string;
  whatsappSender?: string;
  penaltyTriggered: boolean;
  syncedFromHrm: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceLogSchema: Schema = new Schema(
  {
    date: { type: String, required: true, index: true },
    employeeId: { type: String, required: true, index: true },
    employee: { type: Schema.Types.ObjectId, ref: 'Employee' },
    officialName: { type: String, required: true },
    department: { type: String, default: 'General' },
    present: { type: Boolean, required: true, default: false },
    checkInTime: { type: Date, default: null },
    doneMessageSent: { type: Boolean, default: false },
    doneMessageTimestamp: { type: Date, default: null },
    doneMessageRaw: { type: String, default: null },
    whatsappSender: { type: String, default: null },
    penaltyTriggered: { type: Boolean, default: false },
    syncedFromHrm: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

AttendanceLogSchema.index({ date: 1, employeeId: 1 }, { unique: true });
AttendanceLogSchema.index({ date: 1, present: 1, doneMessageSent: 1 });

export const AttendanceLog = mongoose.model<IAttendanceLog>('AttendanceLog', AttendanceLogSchema);
