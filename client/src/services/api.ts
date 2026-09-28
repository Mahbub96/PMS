import {
  ConstitutionRule,
  AttendanceRecord,
  PenaltyRecord,
  DashboardStats,
  ProsecutionResult,
  PenaltyStatus,
  PaymentMethod,
} from '../types/index.js';

const API_BASE = 'http://localhost:5000/api/v1';

// Initial fallback mock data for resilience
const MOCK_RULES: ConstitutionRule[] = [
  {
    _id: '1',
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
    _id: '2',
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
    _id: '3',
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
    _id: '4',
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
    _id: '5',
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
    _id: '6',
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
];

export const api = {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const res = await fetch(`${API_BASE}/stats/dashboard`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      const json = await res.json();
      return json.data;
    } catch {
      return {
        totalPenalties: 2,
        totalFinesIssued: 1000,
        totalCollected: 500,
        totalPending: 500,
        collectionRate: 50,
        statusBreakdown: { PENDING: 1, PAID: 1, DISPUTED: 0, WAIVED: 0 },
        attendanceOverview: { totalLogged: 6, totalPresent: 5, totalDone: 3, totalPenalized: 2 },
      };
    }
  },

  async getPenalties(filterStatus?: string, search?: string): Promise<PenaltyRecord[]> {
    try {
      const params = new URLSearchParams();
      if (filterStatus && filterStatus !== 'ALL') params.append('status', filterStatus);
      if (search) params.append('search', search);

      const res = await fetch(`${API_BASE}/penalties?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch penalties');
      const json = await res.json();
      return json.data;
    } catch {
      return [
        {
          _id: 'p1',
          penaltyId: 'PEN-20260928-EMP-104-1',
          date: '2026-09-28',
          employeeId: 'EMP-104',
          employeeName: 'Kamrul Islam',
          department: 'QA & Automation',
          articleNumber: '1.1',
          reason: 'Present in office but failed to send mandatory "done" message before 10:25 AM cutoff',
          amount: 500,
          status: 'PAID',
          paidAt: new Date().toISOString(),
          paidVia: 'BKASH',
          transactionRef: 'TRX987654321',
          disputeStatus: 'NONE',
          waMessaged: true,
          isAutomated: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: 'p2',
          penaltyId: 'PEN-20260928-EMP-106-1',
          date: '2026-09-28',
          employeeId: 'EMP-106',
          employeeName: 'Farhan Ahmed',
          department: 'Engineering',
          articleNumber: '1.1',
          reason: 'Present in office but failed to send mandatory "done" message before 10:25 AM cutoff',
          amount: 500,
          status: 'PENDING',
          disputeStatus: 'NONE',
          waMessaged: false,
          isAutomated: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    }
  },

  async getAttendance(date?: string): Promise<AttendanceRecord[]> {
    try {
      const params = date ? `?date=${date}` : '';
      const res = await fetch(`${API_BASE}/attendance${params}`);
      if (!res.ok) throw new Error('Failed to fetch attendance');
      const json = await res.json();
      return json.data;
    } catch {
      return [
        {
          date: '2026-09-28',
          employeeId: 'EMP-101',
          officialName: 'Mahbub Alam',
          department: 'Engineering',
          present: true,
          checkInTime: '2026-09-28T09:40:00+06:00',
          doneMessageSent: true,
          doneMessageTimestamp: '2026-09-28T10:12:00+06:00',
          doneMessageRaw: 'done',
          whatsappSender: 'Mahbub Alam',
          penaltyTriggered: false,
          syncedFromHrm: true,
        },
        {
          date: '2026-09-28',
          employeeId: 'EMP-102',
          officialName: 'Arif Hossain',
          department: 'Engineering',
          present: true,
          checkInTime: '2026-09-28T09:43:00+06:00',
          doneMessageSent: true,
          doneMessageTimestamp: '2026-09-28T10:18:22+06:00',
          doneMessageRaw: 'Done',
          whatsappSender: 'Arif Hossain',
          penaltyTriggered: false,
          syncedFromHrm: true,
        },
        {
          date: '2026-09-28',
          employeeId: 'EMP-103',
          officialName: 'Tanzina Akhter',
          department: 'UI/UX Design',
          present: true,
          checkInTime: '2026-09-28T09:46:00+06:00',
          doneMessageSent: true,
          doneMessageTimestamp: '2026-09-28T10:22:45+06:00',
          doneMessageRaw: 'Done for the day',
          whatsappSender: 'Tanzina Akhter',
          penaltyTriggered: false,
          syncedFromHrm: true,
        },
        {
          date: '2026-09-28',
          employeeId: 'EMP-104',
          officialName: 'Kamrul Islam',
          department: 'QA & Automation',
          present: true,
          checkInTime: '2026-09-28T09:49:00+06:00',
          doneMessageSent: false,
          doneMessageTimestamp: null,
          doneMessageRaw: null,
          whatsappSender: null,
          penaltyTriggered: true,
          syncedFromHrm: true,
        },
        {
          date: '2026-09-28',
          employeeId: 'EMP-105',
          officialName: 'Sadia Jahan',
          department: 'Human Resources',
          present: false,
          checkInTime: null,
          doneMessageSent: false,
          doneMessageTimestamp: null,
          doneMessageRaw: null,
          whatsappSender: null,
          penaltyTriggered: false,
          syncedFromHrm: true,
        },
        {
          date: '2026-09-28',
          employeeId: 'EMP-106',
          officialName: 'Farhan Ahmed',
          department: 'Engineering',
          present: true,
          checkInTime: '2026-09-28T09:55:00+06:00',
          doneMessageSent: false,
          doneMessageTimestamp: null,
          doneMessageRaw: null,
          whatsappSender: null,
          penaltyTriggered: true,
          syncedFromHrm: true,
        },
      ];
    }
  },

  async getConstitution(): Promise<ConstitutionRule[]> {
    try {
      const res = await fetch(`${API_BASE}/constitution`);
      if (!res.ok) throw new Error('Failed to fetch constitution');
      const json = await res.json();
      return json.data;
    } catch {
      return MOCK_RULES;
    }
  },

  async exportConstitutionPdf(): Promise<void> {
    const url = `${API_BASE}/constitution/export-pdf`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('PDF export failed');
    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'Penalty_Management_Constitution_Rule_Book.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
  },

  async runProsecution(targetDate?: string): Promise<ProsecutionResult> {
    const res = await fetch(`${API_BASE}/cron/prosecution/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetDate }),
    });
    if (!res.ok) throw new Error('Prosecution run failed');
    const json = await res.json();
    return json.summary;
  },

  async updatePenaltyStatus(
    id: string,
    status: PenaltyStatus,
    paidVia?: PaymentMethod,
    transactionRef?: string,
    notes?: string
  ): Promise<PenaltyRecord> {
    const res = await fetch(`${API_BASE}/penalties/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, paidVia, transactionRef, notes }),
    });
    if (!res.ok) throw new Error('Failed to update penalty status');
    const json = await res.json();
    return json.data;
  },

  async submitDispute(id: string, disputeReason: string): Promise<PenaltyRecord> {
    const res = await fetch(`${API_BASE}/penalties/${id}/dispute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disputeReason }),
    });
    if (!res.ok) throw new Error('Failed to submit dispute');
    const json = await res.json();
    return json.data;
  },

  async syncAttendance(): Promise<any> {
    const res = await fetch(`${API_BASE}/attendance/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    if (!res.ok) throw new Error('Attendance sync failed');
    return res.json();
  },
};
