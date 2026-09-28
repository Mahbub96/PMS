import { Employee } from '../models/Employee.js';

export interface WhatsAppMessageRecord {
  senderName: string;
  senderPhone?: string;
  messageText: string;
  timestampIso: string;
}

export class WhatsAppTrackerService {
  private recentMessages: WhatsAppMessageRecord[] = [];

  constructor() {
    this.seedDefaultMessages();
  }

  private seedDefaultMessages(): void {
    // Populate realistic default "done" messages for testing today
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    this.recentMessages = [
      {
        senderName: 'Mahbubur Rahman',
        messageText: 'done',
        timestampIso: `${dateStr}T10:12:00+06:00`,
      },
      {
        senderName: 'Arif Hossain',
        messageText: 'Done',
        timestampIso: `${dateStr}T10:18:22+06:00`,
      },
      {
        senderName: 'Tanzina Akhter',
        messageText: 'Done for the day',
        timestampIso: `${dateStr}T10:22:45+06:00`,
      },
      {
        senderName: 'Kamrul Islam',
        // Sent after 10:25 AM cutoff -> Should be penalized
        messageText: 'done',
        timestampIso: `${dateStr}T10:29:15+06:00`,
      },
      // Note: 'Farhan Ahmed' sent NO done message at all -> Should be penalized
    ];
  }

  public recordIncomingMessage(record: WhatsAppMessageRecord): void {
    this.recentMessages.push(record);
  }

  public getMessagesForDate(dateStr: string): WhatsAppMessageRecord[] {
    return this.recentMessages.filter((msg) => msg.timestampIso.startsWith(dateStr));
  }

  public isDoneMessage(text: string): boolean {
    const cleaned = text.trim().toLowerCase();
    return (
      cleaned === 'done' ||
      cleaned.startsWith('done ') ||
      cleaned.startsWith('done!') ||
      cleaned.startsWith('done.')
    );
  }

  /**
   * Resolves a WhatsApp sender name to a registered Employee ID
   */
  public async resolveSenderToEmployeeId(senderName: string): Promise<string | null> {
    const cleanSender = senderName.trim().toLowerCase();
    
    const employee = await Employee.findOne({
      $or: [
        { whatsappName: { $regex: new RegExp(`^${cleanSender}$`, 'i') } },
        { name: { $regex: new RegExp(`^${cleanSender}$`, 'i') } },
        { aliases: { $in: [new RegExp(`^${cleanSender}$`, 'i')] } },
      ],
    });

    return employee ? employee.employeeId : null;
  }
}

export const waTrackerService = new WhatsAppTrackerService();
