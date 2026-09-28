import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/penalty_management_cloud'),
  TIMEZONE: z.string().default('Asia/Dhaka'),
  CUTOFF_HOUR: z.string().default('10').transform((val) => parseInt(val, 10)),
  CUTOFF_MINUTE: z.string().default('25').transform((val) => parseInt(val, 10)),
  ATTENDANCE_API_URL: z.string().default('https://api.corporate-hrm.local'),
  ATTENDANCE_API_KEY: z.string().default('test-attendance-token'),
  WHATSAPP_GROUP_ID: z.string().default('120363024823482348@g.us'),
  WHATSAPP_AUTH_PATH: z.string().default('./.wwebjs_auth'),
});

export const env = envSchema.parse(process.env);
