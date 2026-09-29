import React, { useState } from 'react';
import { AttendanceRecord, PenaltyRecord } from '../types/index.js';
import { getEmployeeAvatar } from '../utils/avatars.js';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  RotateCw,
  MessageSquare,
  ShieldAlert,
  Filter,
  LayoutGrid,
  Table as TableIcon,
  Sparkles,
  Zap,
  PartyPopper,
  Send,
  Check,
  CheckCheck,
  Play,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AttendanceFeedPageProps {
  records: AttendanceRecord[];
  penalties: PenaltyRecord[];
  onSync: () => void;
  isLoading: boolean;
  onRunProsecution: () => void;
  onSimulateMessage?: (sender: string, text: string) => void;
}

export const AttendanceFeedPage: React.FC<AttendanceFeedPageProps> = ({
  records,
  penalties,
  onSync,
  isLoading,
  onRunProsecution,
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'COMPLIANT' | 'PENALIZED' | 'ABSENT'>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>(() => {
    return new URLSearchParams(window.location.search).get('view') === 'grid' ? 'grid' : 'table';
  });

  // Quick live WhatsApp tester state
  const [quickSender, setQuickSender] = useState('Mahbub Alam');
  const [quickMessage, setQuickMessage] = useState('done');
  const [chatMessages, setChatMessages] = useState<
    Array<{
      id: string;
      sender: string;
      message: string;
      timestamp: string;
      isBeforeCutoff: boolean;
      isValidDone: boolean;
    }>
  >([
    {
      id: '1',
      sender: 'Mahbub Alam',
      message: 'done',
      timestamp: '10:12 AM',
      isBeforeCutoff: true,
      isValidDone: true,
    },
    {
      id: '2',
      sender: 'Arif Hossain',
      message: 'Done',
      timestamp: '10:18 AM',
      isBeforeCutoff: true,
      isValidDone: true,
    },
    {
      id: '3',
      sender: 'Tanzina Akhter',
      message: 'Done for the day',
      timestamp: '10:22 AM',
      isBeforeCutoff: true,
      isValidDone: true,
    },
  ]);

  const compliantCount = records.filter((r) => r.present && r.doneMessageSent).length;
  const penalizedCount = records.filter((r) => r.penaltyTriggered).length;
  const absentCount = records.filter((r) => !r.present).length;
  const presentCount = records.filter((r) => r.present).length;
  const partyVaultTotal = penalizedCount * 500;

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

  const handleSendTestMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMessage.trim()) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Dhaka',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const isDone = quickMessage.toLowerCase().startsWith('done');

    const newMsg = {
      id: Date.now().toString(),
      sender: quickSender,
      message: quickMessage,
      timestamp: timeStr,
      isBeforeCutoff: true, // test mode
      isValidDone: isDone,
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setQuickMessage('');

    if (isDone) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* 1. Header Command Strip */}
      <div className="rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 p-5 lg:p-6 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-subtle text-brand-primary border border-brand-border">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                <span>Cloud & DevSecOps Department</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-status-warning/10 text-status-warning border border-status-warning/20">
                <PartyPopper className="w-3 h-3" />
                <span>Party Vault Active: ৳{partyVaultTotal.toLocaleString()} BDT</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-content-primary">
              Attendance & WhatsApp Done Feed
            </h1>

            {/* High-density live telemetry chips */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface-subtle border border-border-default text-[10px] font-mono font-medium text-content-secondary">
                <Clock className="w-3 h-3 text-brand-primary" />
                Cutoff: 10:25 AM (Asia/Dhaka)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-subtle border border-border-default text-[10px] font-mono font-medium text-content-secondary">
                English Fluency Habit: Active
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-subtle border border-border-default text-[10px] font-mono font-medium text-content-secondary">
                Self-Governed by Team Members
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onSync}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-content-secondary hover:text-content-primary bg-surface-subtle hover:bg-surface-hover border border-border-default active:scale-95 transition cursor-pointer disabled:opacity-50"
              title="Fetch latest biometric punches from HRM"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Sync Biometrics</span>
            </button>

            <button
              onClick={onRunProsecution}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-primary hover:bg-brand-primaryHover shadow-xs active:scale-95 transition cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Adjudication</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Analytical KPI Strip (4 High-Density Telemetry Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Physical Check-In */}
        <div className="p-4 rounded-2xl bg-surface-card border border-border-default shadow-2xs dark:shadow-md dark:shadow-black/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-content-muted">
              Office Presence
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold font-mono text-content-primary">
                {presentCount} / {records.length}
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {Math.round((presentCount / records.length) * 100)}%
              </span>
            </div>
            <p className="text-[11px] font-mono text-content-muted mt-0.5">
              Avg punch at 09:46 AM
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2: WhatsApp "Done" Verifications */}
        <div className="p-4 rounded-2xl bg-surface-card border border-border-default shadow-2xs dark:shadow-md dark:shadow-black/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-content-muted">
              English "Done" Confirmed
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold font-mono text-status-success">
                {compliantCount} / {presentCount}
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-status-success/10 text-status-success border border-status-success/20">
                {presentCount > 0 ? Math.round((compliantCount / presentCount) * 100) : 100}%
              </span>
            </div>
            <p className="text-[11px] font-mono text-content-muted mt-0.5">
              Article 1.1 Verified
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-status-success/10 text-status-success border border-status-success/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3: Party Vault Addition Today */}
        <div className="p-4 rounded-2xl bg-surface-card border border-border-default shadow-2xs dark:shadow-md dark:shadow-black/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-content-muted">
              Party & Feasts Pool
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold font-mono text-status-warning">
                +৳{partyVaultTotal.toLocaleString()}
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-status-warning/10 text-status-warning border border-status-warning/20">
                {penalizedCount} Infractions
              </span>
            </div>
            <p className="text-[11px] font-mono text-content-muted mt-0.5">
              Pizza & tea treat funded 🍕
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-status-warning/10 text-status-warning border border-status-warning/20">
            <PartyPopper className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4: Top Responder */}
        <div className="p-4 rounded-2xl bg-surface-card border border-border-default shadow-2xs dark:shadow-md dark:shadow-black/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-content-muted">
              Fastest English "Done"
            </span>
            <div className="flex items-center gap-2 mt-1">
              <img
                src="/assets/mahbub_alam.jpg"
                alt="Mahbub Alam"
                className="w-6 h-6 rounded-lg object-cover border border-brand-border"
              />
              <span className="text-sm font-extrabold text-content-primary">
                Mahbub Alam
              </span>
            </div>
            <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
              10:12 AM (13m before cutoff)
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-brand-subtle text-brand-primary border border-brand-border">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Main Split View: Attendance Console (8 cols) + Live WhatsApp Stream (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (8 cols): Attendance Ledger & Grid View */}
        <div className="lg:col-span-8 rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 overflow-hidden transition-colors flex flex-col justify-between">
          <div>
            {/* Toolbar */}
            <div className="p-4 sm:p-5 border-b border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-content-primary tracking-tight">
                  Colleague Adjudication Matrix
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-subtle text-brand-primary border border-brand-border">
                  {records.length} Members
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* View Switcher Toggle */}
                <div className="flex items-center p-0.5 rounded-xl bg-surface-subtle border border-border-default">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                      viewMode === 'table'
                        ? 'bg-surface-card text-brand-primary shadow-2xs font-bold'
                        : 'text-content-muted hover:text-content-primary'
                    }`}
                    title="Dense Table View"
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-surface-card text-brand-primary shadow-2xs font-bold'
                        : 'text-content-muted hover:text-content-primary'
                    }`}
                    title="Interactive Member Cards Grid"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quick Search */}
                <div className="relative min-w-[160px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, ID..."
                    className="w-full pl-8 pr-3 py-1 rounded-xl text-xs bg-surface-subtle border border-border-default text-content-primary placeholder:text-content-muted focus:outline-none focus:border-brand-primary transition"
                  />
                </div>
              </div>
            </div>

            {/* Segmented Filter Bar */}
            <div className="px-4 py-2 bg-surface-subtle/50 border-b border-border-subtle flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                  filter === 'ALL'
                    ? 'bg-surface-card text-brand-primary font-bold shadow-2xs'
                    : 'text-content-secondary hover:text-content-primary'
                }`}
              >
                All ({records.length})
              </button>
              <button
                onClick={() => setFilter('COMPLIANT')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                  filter === 'COMPLIANT'
                    ? 'bg-surface-card text-status-success font-bold shadow-2xs'
                    : 'text-content-secondary hover:text-content-primary'
                }`}
              >
                Compliant ({compliantCount})
              </button>
              <button
                onClick={() => setFilter('PENALIZED')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                  filter === 'PENALIZED'
                    ? 'bg-surface-card text-status-danger font-bold shadow-2xs'
                    : 'text-content-secondary hover:text-content-primary'
                }`}
              >
                Party Vault Contributors ({penalizedCount})
              </button>
              <button
                onClick={() => setFilter('ABSENT')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                  filter === 'ABSENT'
                    ? 'bg-surface-card text-content-muted font-bold shadow-2xs'
                    : 'text-content-secondary hover:text-content-primary'
                }`}
              >
                Excused / Leave ({absentCount})
              </button>
            </div>

            {/* View Mode 1: Dense Table */}
            {viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-surface-subtle text-[11px] font-bold uppercase tracking-wider text-content-muted border-b border-border-default whitespace-nowrap">
                      <th className="py-2.5 px-3 w-[26%]">Colleague</th>
                      <th className="py-2.5 px-2.5 w-[15%]">Biometrics</th>
                      <th className="py-2.5 px-2.5 w-[26%]">WhatsApp English</th>
                      <th className="py-2.5 px-2.5 w-[15%]">10:25 Cutoff</th>
                      <th className="py-2.5 px-3 w-[18%] text-right">Party Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-content-muted">
                          <Filter className="w-6 h-6 mx-auto opacity-50 mb-2" />
                          <p className="text-xs font-medium">No colleagues found matching criteria.</p>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((r) => {
                        const avatar = getEmployeeAvatar(r.officialName, r.employeeId);
                        const isMahbub = r.officialName.includes('Mahbub');

                        return (
                          <tr
                            key={r.employeeId}
                            className="hover:bg-surface-hover/70 transition-colors h-14"
                          >
                            {/* Colleague Profile with Avatar */}
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <div className="relative shrink-0">
                                  <img
                                    src={avatar}
                                    alt={r.officialName}
                                    className="w-8 h-8 rounded-lg object-cover border border-border-default shadow-2xs"
                                  />
                                  <span
                                    className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-surface-card ${
                                      r.present ? 'bg-status-success' : 'bg-content-muted'
                                    }`}
                                  />
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-content-primary tracking-tight whitespace-nowrap flex items-center gap-1 leading-tight text-xs">
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
                            <td className="py-2.5 px-2.5 whitespace-nowrap">
                              {r.present ? (
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface-subtle border border-border-default font-mono text-[11px] text-content-primary">
                                  <Clock className="w-3 h-3 text-sky-500" />
                                  <span>{formatTime(r.checkInTime)}</span>
                                </div>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-subtle border border-border-default text-content-muted font-mono text-[11px]">
                                  <XCircle className="w-3 h-3" />
                                  <span>Absent</span>
                                </span>
                              )}
                            </td>

                            {/* WhatsApp Morning Confirmation Bubble */}
                            <td className="py-2.5 px-2.5 whitespace-nowrap">
                              {r.doneMessageSent ? (
                                <div className="inline-flex items-center gap-1.5 whitespace-nowrap">
                                  <span
                                    title={r.doneMessageRaw || 'done'}
                                    className="inline-flex items-center gap-1 text-brand-primary font-bold font-mono px-2 py-0.5 rounded-md bg-brand-subtle border border-brand-border text-[11px] max-w-[130px] truncate"
                                  >
                                    <MessageSquare className="w-3 h-3 shrink-0" />
                                    <span className="truncate">"{r.doneMessageRaw || 'done'}"</span>
                                  </span>
                                  <span className="text-[10px] text-content-muted font-mono flex items-center gap-0.5 shrink-0">
                                    <CheckCheck className="w-3 h-3 text-status-success" />
                                    <span>{formatTime(r.doneMessageTimestamp)}</span>
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
                            <td className="py-2.5 px-2.5 whitespace-nowrap">
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

                            {/* Party Fund Impact */}
                            <td className="py-2.5 px-3 text-right font-mono whitespace-nowrap">
                              {r.penaltyTriggered ? (
                                <span className="inline-flex items-center gap-1 font-bold text-status-warning bg-status-warning/15 border border-status-warning/30 px-2 py-0.5 rounded-md text-[11px] whitespace-nowrap">
                                  <PartyPopper className="w-3 h-3" />
                                  <span>+৳500 Vault</span>
                                </span>
                              ) : r.present ? (
                                <span className="text-[11px] font-semibold text-status-success whitespace-nowrap">
                                  ৳0 (Pass ⭐)
                                </span>
                              ) : (
                                <span className="text-content-muted text-[11px] whitespace-nowrap">৳0</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              /* View Mode 2: Interactive Member Cards Grid */
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((r) => {
                  const avatar = getEmployeeAvatar(r.officialName, r.employeeId);
                  const isCompliant = r.present && r.doneMessageSent;

                  return (
                    <div
                      key={r.employeeId}
                      className="p-4 rounded-xl bg-surface-subtle border border-border-default hover:border-brand-primary/40 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={avatar}
                            alt={r.officialName}
                            className="w-12 h-12 rounded-xl object-cover border-2 border-brand-border shadow-xs"
                          />
                          <div>
                            <div className="font-extrabold text-content-primary text-sm">
                              {r.officialName}
                            </div>
                            <div className="text-[11px] text-content-muted font-mono">
                              {r.employeeId} • {r.department}
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        {isCompliant ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-status-success/15 text-status-success border border-status-success/30">
                            COMPLIANT
                          </span>
                        ) : r.penaltyTriggered ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-status-danger/15 text-status-danger border border-status-danger/30">
                            INFRACTION
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface-card text-content-muted border border-border-default">
                            EXCUSED
                          </span>
                        )}
                      </div>

                      {/* Detail Chips */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="p-2 rounded-lg bg-surface-card border border-border-subtle">
                          <span className="block text-[10px] text-content-muted uppercase">Biometric Punch</span>
                          <span className="font-bold text-content-primary">
                            {r.present ? formatTime(r.checkInTime) : 'Absent'}
                          </span>
                        </div>

                        <div className="p-2 rounded-lg bg-surface-card border border-border-subtle">
                          <span className="block text-[10px] text-content-muted uppercase">WhatsApp English</span>
                          <span className="font-bold text-brand-primary truncate block">
                            {r.doneMessageSent ? `"${r.doneMessageRaw}"` : 'Missed'}
                          </span>
                        </div>
                      </div>

                      {/* Party Vault Bar */}
                      <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] font-mono">
                        <span className="text-content-muted">Party Vault Impact:</span>
                        {r.penaltyTriggered ? (
                          <span className="font-bold text-status-warning flex items-center gap-1">
                            <PartyPopper className="w-3 h-3" />
                            +৳500 (Pizza & Tea Pool)
                          </span>
                        ) : (
                          <span className="font-bold text-status-success">
                            ৳0 (Fluency Champion ⭐)
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Telemetry Summary */}
          <div className="p-3.5 bg-surface-subtle/70 border-t border-border-default flex flex-wrap items-center justify-between text-[11px] font-mono text-content-muted">
            <span>Official Group: 120363024823482348@g.us</span>
            <span className="text-content-primary font-bold">
              100% Internal Member Governance
            </span>
          </div>
        </div>

        {/* Right Column (4 cols): Live WhatsApp Morning Done Stream */}
        <div className="lg:col-span-4 rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 p-5 flex flex-col justify-between">
          <div>
            {/* Stream Header */}
            <div className="pb-3 border-b border-border-default flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-content-primary">
                    Live WhatsApp Done Stream
                  </h4>
                  <p className="text-[10px] font-mono text-content-muted">
                    Cloud & DevSecOps Group Feed
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </span>
            </div>

            {/* WhatsApp Chat Bubbles Stream */}
            <div className="py-4 space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {chatMessages.map((msg) => {
                const avatar = getEmployeeAvatar(msg.sender);

                return (
                  <div
                    key={msg.id}
                    className="p-3 rounded-2xl bg-surface-subtle border border-border-default space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={avatar}
                          alt={msg.sender}
                          className="w-5 h-5 rounded-full object-cover border border-border-default"
                        />
                        <span className="font-bold text-content-primary text-xs">
                          {msg.sender}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-content-muted">
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* WhatsApp Green Message Bubble */}
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                      <div className="font-mono text-content-primary font-medium">
                        "{msg.message}"
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[10px] font-mono">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCheck className="w-3 h-3" />
                          <span>English Verified (On-Time)</span>
                        </span>
                        <span className="text-content-muted">Article 1.1</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* 10:25 Cutoff Threshold Line */}
              <div className="relative py-2 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dashed border-rose-500/40" />
                </div>
                <span className="relative px-2 py-0.5 rounded bg-surface-card border border-rose-500/30 text-[9px] font-mono font-bold text-rose-500">
                  10:25 AM CUTOFF REACHED
                </span>
              </div>

              {/* Missed Colleagues Pill */}
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs space-y-1">
                <div className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>2 Cutoff Breaches Logged</span>
                </div>
                <p className="text-[11px] text-content-secondary leading-snug">
                  Farhan Ahmed & Kamrul Islam missed the morning English message before 10:25 AM.
                </p>
                <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-status-warning font-bold">
                  <span>+৳1,000 to Party Vault</span>
                  <span>Treats on the way! 🍕</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Message Test Input at bottom */}
          <div className="pt-3 border-t border-border-default">
            <form onSubmit={handleSendTestMessage} className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-content-muted">
                <span>Quick WhatsApp Tester:</span>
                <select
                  value={quickSender}
                  onChange={(e) => setQuickSender(e.target.value)}
                  className="bg-surface-subtle text-content-primary rounded px-1.5 py-0.5 border border-border-default text-[10px] focus:outline-none"
                >
                  <option value="Mahbub Alam">Mahbub Alam</option>
                  <option value="Arif Hossain">Arif Hossain</option>
                  <option value="Tanzina Akhter">Tanzina Akhter</option>
                  <option value="Farhan Ahmed">Farhan Ahmed</option>
                  <option value="Kamrul Islam">Kamrul Islam</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={quickMessage}
                  onChange={(e) => setQuickMessage(e.target.value)}
                  placeholder='Type "done" or morning update...'
                  className="flex-1 px-3 py-1.5 rounded-xl text-xs bg-surface-subtle border border-border-default text-content-primary placeholder:text-content-muted focus:outline-none focus:border-brand-primary"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-brand-primary hover:bg-brand-primaryHover text-white shadow-xs active:scale-95 transition cursor-pointer"
                  title="Simulate WhatsApp Message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
