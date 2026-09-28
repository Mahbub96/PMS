import React, { useState } from 'react';
import { AttendanceRecord } from '../types/index.js';
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  RotateCw,
  MessageSquare,
  ShieldAlert,
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

  const getAvatarGradient = (id: string) => {
    const gradients = [
      'from-cyan-500 to-blue-600',
      'from-indigo-500 to-purple-600',
      'from-emerald-500 to-teal-600',
      'from-amber-500 to-orange-600',
      'from-rose-500 to-pink-600',
    ];
    const index = (id.charCodeAt(id.length - 1) || 0) % gradients.length;
    return gradients[index];
  };

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
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] shadow-xl overflow-hidden">
      {/* Header & Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-bold text-white tracking-tight">
              Daily Attendance & WhatsApp Reconciliation Log
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/15 text-cyan-400 border border-indigo-500/30">
              {records.length} Employees
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Biometric office punches reconciled with WhatsApp group 10:25 AM cutoff.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative min-w-[210px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by name, ID..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-900/90 border border-white/[0.08] text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-white/[0.08] text-xs">
            {(['ALL', 'COMPLIANT', 'PENALIZED', 'ABSENT'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 rounded-lg font-medium text-[11px] transition-all ${
                  filter === tab
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'ALL'
                  ? 'All'
                  : tab === 'COMPLIANT'
                  ? 'Compliant'
                  : tab === 'PENALIZED'
                  ? 'Penalized'
                  : 'Absent'}
              </button>
            ))}
          </div>

          {/* Sync Button */}
          <button
            onClick={onSync}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] transition active:scale-95 disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/60 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/[0.06]">
              <th className="py-3 px-4 sm:px-6">Employee</th>
              <th className="py-3 px-4">Biometric Punch</th>
              <th className="py-3 px-4">WhatsApp Confirmation</th>
              <th className="py-3 px-4">10:25 Status</th>
              <th className="py-3 px-4 sm:px-6 text-right">Adjudication</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400">
                  No attendance records found matching filters.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={r.employeeId}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  {/* Employee Info */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${getAvatarGradient(r.employeeId)} p-[1px] shrink-0 shadow-sm`}>
                        <div className="w-full h-full rounded-xl bg-slate-950 flex items-center justify-center font-bold text-white text-[11px]">
                          {r.officialName.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-white tracking-tight">
                          {r.officialName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {r.employeeId} <span className="text-slate-600 font-sans">•</span> {r.department}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Biometric Punch */}
                  <td className="py-3.5 px-4">
                    {r.present ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-medium">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        <span>{formatTime(r.checkInTime)}</span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                        <XCircle className="w-3 h-3 text-slate-500" />
                        <span>Absent / Leave</span>
                      </span>
                    )}
                  </td>

                  {/* WhatsApp Message */}
                  <td className="py-3.5 px-4">
                    {r.doneMessageSent ? (
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-cyan-400 font-semibold font-mono">
                          <MessageSquare className="w-3 h-3" />
                          <span>"{r.doneMessageRaw || 'done'}"</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Received at {formatTime(r.doneMessageTimestamp)}
                        </div>
                      </div>
                    ) : r.present ? (
                      <div className="text-rose-400 font-medium flex items-center gap-1.5">
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        <span>No message before 10:25</span>
                      </div>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>

                  {/* Compliance Status Pill */}
                  <td className="py-3.5 px-4">
                    {r.present && r.doneMessageSent ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Compliant</span>
                      </span>
                    ) : r.penaltyTriggered ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wide">
                        <ShieldAlert className="w-3 h-3" />
                        <span>Infraction</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/[0.04] text-slate-400 border border-white/[0.06] uppercase tracking-wide">
                        Excused
                      </span>
                    )}
                  </td>

                  {/* Adjudication Fine */}
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    {r.penaltyTriggered ? (
                      <span className="inline-flex items-center font-bold font-mono text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                        ৳500 Fine
                      </span>
                    ) : (
                      <span className="font-mono text-slate-500">৳0</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
