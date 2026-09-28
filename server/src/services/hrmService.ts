import { Employee } from '../models/Employee.js';

export interface HrmAttendanceRecord {
  employeeId: string;
  officialName: string;
  department: string;
  present: boolean;
  checkInTime: Date | null;
}

export class HrmService {
  /**
   * Fetches biometric attendance for a given date.
   * In local/dev environment, synchronizes against registered employees in MongoDB,
   * simulating realistic biometric check-in times (e.g. 09:45 AM - 10:15 AM).
   */
  async getDailyAttendance(dateString: string): Promise<HrmAttendanceRecord[]> {
    const employees = await Employee.find({ isActive: true });

    return employees.map((emp, index) => {
      // For demonstration / dev realism:
      // Almost all employees are present, e.g. 1st 5 present, others conditionally
      const isPresent = index !== 4; // employee index 4 is on leave/absent
      
      const checkInHour = 9;
      const checkInMinute = (40 + index * 3) % 60; // 09:40 - 09:55
      const checkInDate = new Date(`${dateString}T${String(checkInHour).padStart(2, '0')}:${String(checkInMinute).padStart(2, '0')}:00+06:00`);

      return {
        employeeId: emp.employeeId,
        officialName: emp.name,
        department: emp.department,
        present: isPresent,
        checkInTime: isPresent ? checkInDate : null,
      };
    });
  }
}

export const hrmService = new HrmService();
