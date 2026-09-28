export type PenaltyStatus = 'PENDING' | 'PAID' | 'DISPUTED' | 'WAIVED';
export type PaymentMethod = 'SALARY_DEDUCTION' | 'BKASH' | 'NAGAD' | 'CASH' | 'BANK_TRANSFER';
export type DisputeStatus = 'NONE' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED';
export type RuleSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ConstitutionRule {
  _id: string;
  articleNumber: string;
  title: string;
  category: string;
  description: string;
  fineAmount: number;
  severity: RuleSeverity;
  gracePeriodMinutes: number;
  isActive: boolean;
  applicableShift: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendanceRecord {
  _id?: string;
  date: string;
  employeeId: string;
  officialName: string;
  department: string;
  present: boolean;
  checkInTime: string | null;
  doneMessageSent: boolean;
  doneMessageTimestamp: string | null;
  doneMessageRaw: string | null;
  whatsappSender: string | null;
  penaltyTriggered: boolean;
  syncedFromHrm: boolean;
}

export interface PenaltyRecord {
  _id: string;
  penaltyId: string;
  date: string;
  employeeId: string;
  employeeName: string;
  department: string;
  articleNumber: string;
  reason: string;
  amount: number;
  status: PenaltyStatus;
  paidAt?: string | null;
  paidVia?: PaymentMethod | null;
  transactionRef?: string | null;
  disputeReason?: string | null;
  disputeStatus: DisputeStatus;
  disputedAt?: string | null;
  resolutionNotes?: string | null;
  waMessaged: boolean;
  isAutomated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalPenalties: number;
  totalFinesIssued: number;
  totalCollected: number;
  totalPending: number;
  collectionRate: number;
  statusBreakdown: Record<PenaltyStatus, number>;
  attendanceOverview: {
    totalLogged: number;
    totalPresent: number;
    totalDone: number;
    totalPenalized: number;
  };
}

export interface ProsecutionResult {
  date: string;
  totalPresent: number;
  totalCompliant: number;
  totalPenalized: number;
  penaltiesCreated: number;
  details: Array<{
    employeeId: string;
    employeeName: string;
    present: boolean;
    done: boolean;
    penaltyIssued: boolean;
    penaltyId?: string;
  }>;
}
