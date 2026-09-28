import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { env } from '../config/env.js';
import { Employee } from '../models/Employee.js';
import { ConstitutionRule } from '../models/ConstitutionRule.js';
import { AttendanceLog } from '../models/AttendanceLog.js';
import { Penalty } from '../models/Penalty.js';
import { hrmService } from './hrmService.js';
import { waTrackerService } from './waTracker.js';
import { broadcastEvent, SocketEvents } from '../sockets/socketManager.js';

dayjs.extend(utc);
dayjs.extend(timezone);

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

export class RulesEngine {
  /**
   * Calculates the cutoff timestamp for a given date in Asia/Dhaka (e.g. 10:25:00 AM)
   */
  public getCutoffTime(dateStr: string): dayjs.Dayjs {
    return dayjs
      .tz(`${dateStr} ${String(env.CUTOFF_HOUR).padStart(2, '0')}:${String(env.CUTOFF_MINUTE).padStart(2, '0')}:00`, env.TIMEZONE);
  }

  /**
   * Executes the automated 10:25 AM compliance prosecution algorithm.
   */
  public async runDailyProsecution(targetDate?: string): Promise<ProsecutionResult> {
    const todayDhaka = dayjs().tz(env.TIMEZONE);
    const dateStr = targetDate || todayDhaka.format('YYYY-MM-DD');
    const cutoff = this.getCutoffTime(dateStr);

    console.log(`[RulesEngine] Running prosecution for ${dateStr}. Cutoff: ${cutoff.format('YYYY-MM-DD HH:mm:ss')} (${env.TIMEZONE})`);

    // 1. Fetch present employees from HRM Biometric service
    const attendanceRecords = await hrmService.getDailyAttendance(dateStr);
    const presentRecords = attendanceRecords.filter((r) => r.present);

    // 2. Fetch incoming WhatsApp messages for the date
    const waMessages = waTrackerService.getMessagesForDate(dateStr);

    // 3. Find Article 1.1 rule definition
    const rule1_1 = await ConstitutionRule.findOne({ articleNumber: '1.1' });
    const penaltyAmount = rule1_1 ? rule1_1.fineAmount : 500;

    // 4. Determine which employees sent "done" BEFORE the cutoff
    const doneEmployeeIds = new Set<string>();
    const employeeDoneDetails = new Map<string, { timestamp: Date; raw: string; sender: string }>();

    for (const msg of waMessages) {
      if (!waTrackerService.isDoneMessage(msg.messageText)) {
        continue;
      }

      const msgTime = dayjs(msg.timestampIso).tz(env.TIMEZONE);
      if (msgTime.isAfter(cutoff)) {
        // Sent after cutoff: doesn't count for compliance
        continue;
      }

      const empId = await waTrackerService.resolveSenderToEmployeeId(msg.senderName);
      if (empId) {
        doneEmployeeIds.add(empId);
        employeeDoneDetails.set(empId, {
          timestamp: new Date(msg.timestampIso),
          raw: msg.messageText,
          sender: msg.senderName,
        });
      }
    }

    // 5. Evaluate compliance & prepare bulk DB operations
    const attendanceBulkOps: any[] = [];
    const penaltyBulkOps: any[] = [];
    const details: ProsecutionResult['details'] = [];
    let penaltiesCreated = 0;

    for (const record of attendanceRecords) {
      const isPresent = record.present;
      const isDone = isPresent && doneEmployeeIds.has(record.employeeId);
      const isViolator = isPresent && !isDone;
      const doneInfo = employeeDoneDetails.get(record.employeeId);

      // Attendance record upsert
      attendanceBulkOps.push({
        updateOne: {
          filter: { date: dateStr, employeeId: record.employeeId },
          update: {
            $set: {
              officialName: record.officialName,
              department: record.department,
              present: isPresent,
              checkInTime: record.checkInTime,
              doneMessageSent: isDone,
              doneMessageTimestamp: doneInfo?.timestamp || null,
              doneMessageRaw: doneInfo?.raw || null,
              whatsappSender: doneInfo?.sender || null,
              penaltyTriggered: isViolator,
              syncedFromHrm: true,
            },
          },
          upsert: true,
        },
      });

      let penaltyId: string | undefined;

      // If violator: issue Article 1.1 penalty
      if (isViolator) {
        penaltyId = `PEN-${dateStr.replace(/-/g, '')}-${record.employeeId}-1`;
        penaltyBulkOps.push({
          updateOne: {
            filter: { date: dateStr, employeeId: record.employeeId, articleNumber: '1.1' },
            update: {
              $setOnInsert: {
                penaltyId,
                date: dateStr,
                employeeId: record.employeeId,
                employeeName: record.officialName,
                department: record.department,
                ruleId: rule1_1?._id,
                articleNumber: '1.1',
                reason: 'Present in office but failed to send mandatory "done" message before 10:25 AM cutoff',
                amount: penaltyAmount,
                status: 'PENDING',
                disputeStatus: 'NONE',
                waMessaged: false,
                isAutomated: true,
              },
            },
            upsert: true,
          },
        });
        penaltiesCreated++;
      }

      details.push({
        employeeId: record.employeeId,
        employeeName: record.officialName,
        present: isPresent,
        done: isDone,
        penaltyIssued: isViolator,
        penaltyId,
      });
    }

    // 6. Execute bulk operations
    if (attendanceBulkOps.length > 0) {
      await AttendanceLog.bulkWrite(attendanceBulkOps);
    }
    if (penaltyBulkOps.length > 0) {
      await Penalty.bulkWrite(penaltyBulkOps);
    }

    const summary: ProsecutionResult = {
      date: dateStr,
      totalPresent: presentRecords.length,
      totalCompliant: presentRecords.length - penaltiesCreated,
      totalPenalized: penaltiesCreated,
      penaltiesCreated,
      details,
    };

    console.log(`[RulesEngine] Prosecution completed: ${summary.totalPresent} present, ${summary.totalPenalized} penalized.`);

    // 7. Broadcast real-time Socket.io events
    broadcastEvent(SocketEvents.PROSECUTION_RUN_COMPLETED, summary);
    broadcastEvent(SocketEvents.PENALTIES_UPDATED, { date: dateStr, count: penaltiesCreated });

    return summary;
  }
}

export const rulesEngine = new RulesEngine();
