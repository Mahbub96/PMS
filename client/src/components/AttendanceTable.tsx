import React, { useState } from 'react';
import { AttendanceRecord } from '../types/index.js';
import { getEmployeeAvatar } from '../utils/avatars.js';
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  RotateCw,
  MessageSquare,
  ShieldAlert,
  Filter,
  PartyPopper,
} from 'lucide-react';

interface AttendanceTableProps {
  records: AttendanceRecord[];
  onSync: () => void;
  isLoading: boolean;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  records,
  onSync,
  isLoading,
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'COMPLIANT' | 'PENALIZED' | 'ABSENT'>('ALL');

  const compliantCount = records.filter((r) => r.present && r.doneMessageSent).length;
  const penalizedCount = records.filter((r) => r.penaltyTriggered).length;
  const absentCount = records.filter((r) => !r.present).length;

  const filtered = records.filter((r) => {
    const matchesSearch =
      r.officialName.toLowerCase().includes(search.toLowerCase()) ||
      r.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'COMPLIANT') return r.present && r.doneMessageSent;
    if (filter === 'PENALIZED') return r.penaltyTriggered;
    if (filter === 'ABSENT') return !r.present;
    return true;
  });

  const formatTime = (iso?: string | null) => {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return '—';
    }
  };

  return (
    <div className="rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 overflow-hidden transition-colors">
      {/* Consolidated Console Toolbar */}
      <div className="p-4 sm:p-5 border-b border-border-default flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-bold text-content-primary tracking-tight">
              Daily Attendance & WhatsApp Reconciliation
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-subtle text-brand-primary border border-brand-border">
              {records.length} Employees
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] font-mono">
            <span className="text-content-secondary">
              <strong className="text-content-primary">{records.length}</strong> Logged
            </span>
            <span className="text-content-muted">•</span>
            <span className="text-status-success font-semibold">
              {compliantCount} Confirmed
            </span>
            <span className="text-content-muted">•</span>
            <span className="text-status-danger font-semibold">
              {penalizedCount} Infractions
            </span>
            <span className="text-content-muted">•</span>
            <span className="text-content-muted">
              {absentCount} Leave
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Search */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee, ID..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-surface-subtle border border-border-default text-content-primary placeholder:text-content-muted focus:outline-none focus:border-brand-primary transition"
            />
          </div>

          {/* Segmented Filter Pills with Counters */}
          <div className="flex items-center p-1 rounded-xl bg-surface-subtle border border-border-default text-xs">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all cursor-pointer ${
                filter === 'ALL'
                  ? 'bg-surface-card text-brand-primary font-bold shadow-2xs'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              All ({records.length})
            </button>
            <button
              onClick={() => setFilter('COMPLIANT')}
              className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all cursor-pointer ${
                filter === 'COMPLIANT'
                  ? 'bg-surface-card text-status-success font-bold shadow-2xs'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Compliant ({compliantCount})
            </button>
            <button
              onClick={() => setFilter('PENALIZED')}
              className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all cursor-pointer ${
                filter === 'PENALIZED'
                  ? 'bg-surface-card text-status-danger font-bold shadow-2xs'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Penalized ({penalizedCount})
            </button>
            <button
              onClick={() => setFilter('ABSENT')}
              className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all cursor-pointer ${
                filter === 'ABSENT'
                  ? 'bg-surface-card text-content-primary font-bold shadow-2xs'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Absent ({absentCount})
            </button>
          </div>

          {/* Biometric Sync Button */}
          <button
            onClick={onSync}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-content-secondary hover:text-content-primary bg-surface-subtle hover:bg-surface-hover border border-border-default active:scale-95 transition cursor-pointer disabled:opacity-50"
            title="Fetch latest biometric punches from HRM"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Operational Table Console */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left border-collapse text-xs">
          <thead>
            <tr className="bg-surface-subtle text-[11px] font-bold uppercase tracking-wider text-content-muted border-b border-border-default whitespace-nowrap">
              <th className="py-2.5 px-4 sm:px-6">Employee</th>
              <th className="py-2.5 px-4">Biometric Punch</th>
              <th className="py-2.5 px-4">WhatsApp Confirmation</th>
              <th className="py-2.5 px-4">10:25 Status</th>
              <th className="py-2.5 px-4 sm:px-6 text-right">Adjudication</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-content-muted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Filter className="w-6 h-6 text-content-muted opacity-50" />
                    <p className="text-xs font-medium">No employee records found matching your filter.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((r) => {
                const avatar = getEmployeeAvatar(r.officialName, r.employeeId);
                const isMahbub = r.officialName.includes('Mahbub');
                return (
                  <tr
                    key={r.employeeId}
                    className="hover:bg-surface-hover/60 transition-colors h-14"
                  >
                    {/* Employee Identity */}
                    <td className="py-2.5 px-4 sm:px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="relative shrink-0">
                          <img
                            src={avatar}
                            alt={r.officialName}
                            className="w-8 h-8 rounded-lg object-cover border border-border-default shadow-2xs"
                          />
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-surface-card ${
                              r.present ? 'bg-status-success' : 'bg-content-muted'
                            }`}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-content-primary tracking-tight whitespace-nowrap flex items-center gap-1.5 leading-tight">
                            <span>{r.officialName}</span>
                            {isMahbub && (
                              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-brand-subtle text-brand-primary border border-brand-border">
                                Architect
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-content-muted font-mono whitespace-nowrap leading-tight mt-0.5">
                            {r.employeeId} • {r.department}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Biometric Punch */}
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      {r.present ? (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface-subtle border border-border-default font-mono text-[11px] font-medium text-content-primary">
                          <Clock className="w-3 h-3 text-status-success" />
                          <span>{formatTime(r.checkInTime)}</span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-subtle border border-border-default text-content-muted font-mono text-[11px]">
                          <XCircle className="w-3 h-3" />
                          <span>Absent / Leave</span>
                        </span>
                      )}
                    </td>

                    {/* WhatsApp Morning Confirmation */}
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      {r.doneMessageSent ? (
                        <div className="inline-flex items-center gap-2 whitespace-nowrap">
                          <span
                            title={r.doneMessageRaw || 'done'}
                            className="inline-flex items-center gap-1 text-brand-primary font-bold font-mono px-2 py-0.5 rounded-md bg-brand-subtle border border-brand-border text-[11px] max-w-[130px] truncate"
                          >
                            <MessageSquare className="w-3 h-3 shrink-0" />
                            <span className="truncate">"{r.doneMessageRaw || 'done'}"</span>
                          </span>
                          <span className="text-[10px] text-content-muted font-mono shrink-0">
                            ({formatTime(r.doneMessageTimestamp)})
                          </span>
                        </div>
                      ) : r.present ? (
                        <div className="inline-flex items-center gap-1.5 text-status-danger font-medium whitespace-nowrap text-[11px]">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span>Missed 10:25 Cutoff</span>
                        </div>
                      ) : (
                        <span className="text-content-muted font-mono text-[11px]">—</span>
                      )}
                    </td>

                    {/* 10:25 Status Pill */}
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      {r.present && r.doneMessageSent ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-status-success/15 text-status-success border border-status-success/30 uppercase tracking-wide">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Compliant</span>
                        </span>
                      ) : r.penaltyTriggered ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-status-danger/15 text-status-danger border border-status-danger/30 uppercase tracking-wide">
                          <ShieldAlert className="w-3 h-3" />
                          <span>Infraction</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface-subtle text-content-muted border border-border-default uppercase tracking-wide">
                          Excused
                        </span>
                      )}
                    </td>

                    {/* Adjudication Fine */}
                    <td className="py-2.5 px-4 sm:px-6 text-right whitespace-nowrap">
                      {r.penaltyTriggered ? (
                        <span className="inline-flex items-center gap-1 font-bold font-mono text-amber-500 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-md text-[11px] whitespace-nowrap">
                          <PartyPopper className="w-3 h-3" />
                          <span>+৳500 Party Fund</span>
                        </span>
                      ) : r.present ? (
                        <span className="text-[11px] font-semibold text-status-success font-mono whitespace-nowrap">
                          ৳0 (Fluency ⭐)
                        </span>
                      ) : (
                        <span className="font-mono text-content-muted text-[11px] whitespace-nowrap">৳0</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
