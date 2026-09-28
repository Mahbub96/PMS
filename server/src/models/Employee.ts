import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  employeeId: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  whatsappName: string;
  aliases: string[];
  avatarUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema: Schema = new Schema(
  {
    employeeId: { type: String, required: true, unique: true, index: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    department: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    whatsappName: { type: String, required: true, trim: true, index: true },
    aliases: [{ type: String, trim: true }],
    avatarUrl: { type: String, default: '' },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

export const Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema);
