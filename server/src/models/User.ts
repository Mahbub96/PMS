import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'ADMIN' | 'MANAGER' | 'AUDITOR';

export interface IUser extends Document {
  username: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ['ADMIN', 'MANAGER', 'AUDITOR'], default: 'ADMIN' },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);
