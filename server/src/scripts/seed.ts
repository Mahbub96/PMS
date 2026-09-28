import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { connectDB } from '../config/db.js';
import { ConstitutionRule } from '../models/ConstitutionRule.js';
import { Employee } from '../models/Employee.js';
import { User } from '../models/User.js';

async function seed() {
  console.log('[Seed] Connecting to MongoDB...');
  await connectDB();

  console.log('[Seed] Seeding Constitution Rules...');
  await ConstitutionRule.deleteMany({});
  const rules = await ConstitutionRule.insertMany([
    {
      articleNumber: '1.1',
      title: 'Daily WhatsApp "Done" Confirmation before 10:25 AM',
      category: 'Attendance & Punctuality',
      description: 'All employees present in the office must explicitly send the confirmation message "done" in the official WhatsApp group before 10:25 AM. Failure results in automatic prosecution.',
      fineAmount: 500,
      severity: 'CRITICAL',
      gracePeriodMinutes: 0,
      isActive: true,
      applicableShift: 'Morning (10:00 - 18:00)',
    },
    {
      articleNumber: '1.2',
      title: 'Unannounced Late Office Arrival',
      category: 'Attendance & Punctuality',
      description: 'Arriving at office after 10:30 AM without prior notification on the attendance portal or Slack team channel.',
      fineAmount: 300,
      severity: 'HIGH',
      gracePeriodMinutes: 15,
      isActive: true,
      applicableShift: 'Morning (10:00 - 18:00)',
    },
    {
      articleNumber: '2.1',
      title: 'Core Hours Workstation Absence Without Status Update',
      category: 'Office Discipline',
      description: 'Leaving workstation or premises during core operational hours (02:00 PM - 05:00 PM) exceeding 30 minutes without updating team lead or status channel.',
      fineAmount: 200,
      severity: 'MEDIUM',
      gracePeriodMinutes: 10,
      isActive: true,
      applicableShift: 'Core Hours (14:00 - 17:00)',
    },
    {
      articleNumber: '2.2',
      title: 'Missed Mandatory Daily Standup / Sync',
      category: 'Daily Standup & Sync',
      description: 'Unexcused absence from the scheduled daily engineering and product standup sync.',
      fineAmount: 250,
      severity: 'MEDIUM',
      gracePeriodMinutes: 5,
      isActive: true,
      applicableShift: 'All Shifts',
    },
    {
      articleNumber: '3.1',
      title: 'Workstation Security & Clean Desk Violation',
      category: 'Workstation & Security',
      description: 'Leaving workstation unlocked with active sessions overnight, or leaving sensitive corporate credentials physically exposed.',
      fineAmount: 500,
      severity: 'HIGH',
      gracePeriodMinutes: 0,
      isActive: true,
      applicableShift: 'Overnight / End of Day',
    },
    {
      articleNumber: '3.2',
      title: 'Failure to Submit Weekly Progress Report',
      category: 'Reporting & Compliance',
      description: 'Failure to log and submit weekly task completion summary by Thursday 06:00 PM.',
      fineAmount: 400,
      severity: 'MEDIUM',
      gracePeriodMinutes: 60,
      isActive: true,
      applicableShift: 'Weekly (Thursday)',
    },
  ]);
  console.log(`[Seed] Seeded ${rules.length} Constitution rules.`);

  console.log('[Seed] Seeding Registered Employees...');
  await Employee.deleteMany({});
  const employees = await Employee.insertMany([
    {
      employeeId: 'EMP-101',
      name: 'Mahbubur Rahman',
      email: 'mahbub@company.com',
      department: 'Engineering',
      designation: 'Lead Software Architect',
      whatsappName: 'Mahbubur Rahman',
      aliases: ['Mahbub', '+8801700000001', 'MRajibH'],
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isActive: true,
    },
    {
      employeeId: 'EMP-102',
      name: 'Arif Hossain',
      email: 'arif@company.com',
      department: 'Engineering',
      designation: 'Senior Frontend Developer',
      whatsappName: 'Arif Hossain',
      aliases: ['Arif', 'Arif H.'],
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      isActive: true,
    },
    {
      employeeId: 'EMP-103',
      name: 'Tanzina Akhter',
      email: 'tanzina@company.com',
      department: 'UI/UX Design',
      designation: 'Senior Product Designer',
      whatsappName: 'Tanzina Akhter',
      aliases: ['Tanzina', 'Tanzi'],
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      isActive: true,
    },
    {
      employeeId: 'EMP-104',
      name: 'Kamrul Islam',
      email: 'kamrul@company.com',
      department: 'QA & Automation',
      designation: 'Lead QA Engineer',
      whatsappName: 'Kamrul Islam',
      aliases: ['Kamrul', 'Kamrul QA'],
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      isActive: true,
    },
    {
      employeeId: 'EMP-105',
      name: 'Sadia Jahan',
      email: 'sadia@company.com',
      department: 'Human Resources',
      designation: 'HR Executive',
      whatsappName: 'Sadia Jahan',
      aliases: ['Sadia'],
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      isActive: true,
    },
    {
      employeeId: 'EMP-106',
      name: 'Farhan Ahmed',
      email: 'farhan@company.com',
      department: 'Engineering',
      designation: 'Backend Developer',
      whatsappName: 'Farhan Ahmed',
      aliases: ['Farhan', 'Farhan Dev'],
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      isActive: true,
    },
  ]);
  console.log(`[Seed] Seeded ${employees.length} employees.`);

  console.log('[Seed] Seeding Default Admin...');
  await User.deleteMany({});
  await User.create({
    username: 'admin',
    email: 'admin@penaltycloud.local',
    name: 'Compliance Administrator',
    role: 'ADMIN',
    isActive: true,
  });

  console.log('[Seed] Seeding completed successfully!');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[Seed] Error during seeding:', err);
  process.exit(1);
});
