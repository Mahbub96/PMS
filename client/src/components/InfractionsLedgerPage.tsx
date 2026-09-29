import React, { useState } from 'react';
import { PenaltyRecord, PenaltyStatus } from '../types/index.js';
import { getEmployeeAvatar } from '../utils/avatars.js';
import {
  Scale,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  CreditCard,
  PartyPopper,
  Download,
  Zap,
  Filter,
  Trophy,
  Pizza,
  Coffee,
  Table as TableIcon,
  LayoutGrid,
  ShieldCheck,
  CheckCheck,
  ChevronRight,
  Info,
  Sparkles,
  DollarSign,
  ArrowUpRight,
  HelpCircle,
  XCircle,
} from 'lucide-react';

interface InfractionsLedgerPageProps {
  penalties: PenaltyRecord[];
  onOpenPaymentModal: (penalty: PenaltyRecord) => void;
  onOpenDisputeModal: (penalty: PenaltyRecord) => void;
  onWaivePenalty: (penaltyId: string) => void;
  onExportPdf?: () => void;
  isExportingPdf?: boolean;
  onRunProsecution?: () => void;
  isProsecuting?: boolean;
}

export const InfractionsLedgerPage: React.FC<InfractionsLedgerPageProps> = ({
  penalties,
  onOpenPaymentModal,
  onOpenDisputeModal,
  onWaivePenalty,
  onExportPdf,
  isExportingPdf = false,
  onRunProsecution,
  isProsecuting = false,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | PenaltyStatus>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>(() => {
    return new URLSearchParams(window.location.search).get('view') === 'grid' ? 'grid' : 'table';
  });

  // Metrics calculations
  const totalAssessed = penalties.reduce((sum, p) => sum + p.amount, 0);
  const paidPenalties = penalties.filter((p) => p.status === 'PAID');
  const pendingPenalties = penalties.filter((p) => p.status === 'PENDING');
  const disputedPenalties = penalties.filter((p) => p.status === 'DISPUTED');
  const waivedPenalties = penalties.filter((p) => p.status === 'WAIVED');

  const totalCollected = paidPenalties.reduce((sum, p) => sum + p.amount, 0);
  const totalPending = pendingPenalties.reduce((sum, p) => sum + p.amount, 0);
  const recoveryRate = totalAssessed > 0 ? Math.round((totalCollected / totalAssessed) * 100) : 100;

  // Department members list for Fluency Champions widget
  const teamMembers = [
    { name: 'Mahbub Alam', id: 'EMP-101', role: 'Lead Architect', dept: 'Engineering', status: 'CHAMPION', fines: 0 },
    { name: 'Arif Hossain', id: 'EMP-102', role: 'DevOps Engineer', dept: 'Engineering', status: 'CHAMPION', fines: 0 },
    { name: 'Tanzina Akhter', id: 'EMP-103', role: 'UI/UX Designer', dept: 'UI/UX Design', status: 'CHAMPION', fines: 0 },
    { name: 'Sadia Jahan', id: 'EMP-105', role: 'Talent Lead', dept: 'Human Resources', status: 'EXCUSED', fines: 0 },
    { name: 'Kamrul Islam', id: 'EMP-104', role: 'QA Lead', dept: 'QA & Automation', status: 'SETTLED', fines: 1 },
    { name: 'Farhan Ahmed', id: 'EMP-106', role: 'Cloud Engineer', dept: 'Engineering', status: 'PENDING', fines: 1 },
  ];

  // Filtering
  const filtered = penalties.filter((p) => {
    const matchesSearch =
      p.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      p.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      p.penaltyId.toLowerCase().includes(search.toLowerCase()) ||
      p.articleNumber.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    return true;
  });

  const getStatusBadge = (status: PenaltyStatus) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-status-success/15 text-status-success border border-status-success/30 uppercase tracking-wide">
            <CheckCircle className="w-3 h-3" />
            <span>PAID</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-status-warning/15 text-status-warning border border-status-warning/30 uppercase tracking-wide">
            <Clock className="w-3 h-3" />
            <span>PENDING</span>
          </span>
        );
      case 'DISPUTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 uppercase tracking-wide">
            <AlertCircle className="w-3 h-3" />
            <span>DISPUTED</span>
          </span>
        );
      case 'WAIVED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface-subtle text-content-muted border border-border-default uppercase tracking-wide">
            <span>WAIVED</span>
          </span>
        );
    }
  };

  const getMethodBadge = (via?: string | null) => {
    if (!via) return null;
    if (via === 'BKASH') {
      return (
        <span className="text-[10px] font-mono font-bold text-pink-600 dark:text-pink-400 bg-pink-500/15 border border-pink-500/30 px-1.5 py-0.5 rounded">
          bKash
        </span>
      );
    }
    if (via === 'SALARY_DEDUCTION') {
      return (
        <span className="text-[10px] font-mono font-bold text-brand-primary bg-brand-subtle border border-brand-border px-1.5 py-0.5 rounded">
          Payroll
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono text-content-muted bg-surface-subtle px-1.5 py-0.5 rounded border border-border-default">
        {via}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Header Command Hub */}
      <div className="p-5 sm:p-6 rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-subtle text-brand-primary border border-brand-border">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
              Cloud & DevSecOps Department
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-status-warning/15 text-status-warning border border-status-warning/30">
              <PartyPopper className="w-3.5 h-3.5" />
              Party Vault Active: ৳{totalCollected.toLocaleString()} BDT
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-surface-subtle text-content-muted border border-border-default">
              Article 1.1 Adjudication
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-content-primary tracking-tight">
            Infraction Adjudication & Recovery Ledger
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-xs text-content-muted font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              10:25 AM Mandatory WhatsApp Cutoff
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
              Self-Governed by Team Members (Not HR)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Pizza className="w-3.5 h-3.5 text-status-warning" />
              100% Funds Team Snacks & Celebrations
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {onExportPdf && (
            <button
              onClick={onExportPdf}
              disabled={isExportingPdf}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-surface-subtle hover:bg-surface-hover text-content-primary border border-border-default transition cursor-pointer disabled:opacity-50"
              title="Download Department Audit Ledger as PDF"
            >
              <Download className={`w-3.5 h-3.5 ${isExportingPdf ? 'animate-bounce' : ''}`} />
              <span>{isExportingPdf ? 'Generating PDF...' : 'Export Audit PDF'}</span>
            </button>
          )}

          {onRunProsecution && (
            <button
              onClick={onRunProsecution}
              disabled={isProsecuting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-primary hover:bg-brand-hover shadow-sm active:scale-95 transition cursor-pointer disabled:opacity-50"
              title="Trigger Cutoff Adjudication"
            >
              <Zap className={`w-3.5 h-3.5 ${isProsecuting ? 'animate-spin' : ''}`} />
              <span>{isProsecuting ? 'Adjudicating...' : 'Run Adjudication'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Telemetry KPI Pods */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pod 1: Total Assessed */}
        <div className="p-4 rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 flex items-center justify-between transition-colors">
          <div>
            <div className="text-[11px] font-bold text-content-muted uppercase tracking-wider">
              Total Fines Assessed
            </div>
            <div className="text-2xl font-black text-content-primary mt-1 font-mono tracking-tight">
              ৳{totalAssessed.toLocaleString()}
            </div>
            <p className="text-[11px] text-content-muted mt-0.5">
              {penalties.length} Infractions under Article 1.1
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <Scale className="w-5 h-5" />
          </div>
        </div>

        {/* Pod 2: Vault Settled */}
        <div className="p-4 rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 flex items-center justify-between transition-colors">
          <div>
            <div className="text-[11px] font-bold text-content-muted uppercase tracking-wider">
              Party Vault Recovered
            </div>
            <div className="text-2xl font-black text-status-success mt-1 font-mono tracking-tight">
              ৳{totalCollected.toLocaleString()}
            </div>
            <p className="text-[11px] text-status-success mt-0.5 font-medium">
              {paidPenalties.length} Settled via bKash / Payroll ({recoveryRate}%)
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-status-success/10 text-status-success border border-status-success/20">
            <PartyPopper className="w-5 h-5" />
          </div>
        </div>

        {/* Pod 3: Pending Dues */}
        <div className="p-4 rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 flex items-center justify-between transition-colors">
          <div>
            <div className="text-[11px] font-bold text-content-muted uppercase tracking-wider">
              Pending Recovery
            </div>
            <div className="text-2xl font-black text-status-warning mt-1 font-mono tracking-tight">
              ৳{totalPending.toLocaleString()}
            </div>
            <p className="text-[11px] text-content-muted mt-0.5">
              {pendingPenalties.length} Dues awaiting clearance
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-status-warning/10 text-status-warning border border-status-warning/20">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Pod 4: Department Habit Index */}
        <div className="p-4 rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 flex items-center justify-between transition-colors">
          <div>
            <div className="text-[11px] font-bold text-content-muted uppercase tracking-wider">
              Fluency Habit Index
            </div>
            <div className="text-2xl font-black text-brand-primary mt-1 font-mono tracking-tight">
              66.7%
            </div>
            <p className="text-[11px] text-content-muted mt-0.5">
              4 of 6 Members Infraction-Free ⭐
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-brand-subtle text-brand-primary border border-brand-border">
            <Trophy className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Main Split View: Ledger Table/Cards (8 cols) + Sidecar Panels (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (8 cols): The Main Infraction Ledger */}
        <div className="lg:col-span-8 rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 overflow-hidden transition-colors flex flex-col justify-between">
          <div>
            {/* Header & Controls Toolbar */}
            <div className="p-4 sm:p-5 border-b border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-content-primary tracking-tight">
                  Adjudication Case Ledger
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-subtle text-brand-primary border border-brand-border">
                  {filtered.length} Cases
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
                    title="Cards Grid View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quick Search */}
                <div className="relative min-w-[160px] sm:min-w-[200px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search colleague, ID, case..."
                    className="w-full pl-8 pr-3 py-1 rounded-xl text-xs bg-surface-subtle border border-border-default text-content-primary placeholder:text-content-muted focus:outline-none focus:border-brand-primary transition"
                  />
                </div>
              </div>
            </div>

            {/* Segmented Filter Bar */}
            <div className="px-4 py-2 bg-surface-subtle/50 border-b border-border-subtle flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                  statusFilter === 'ALL'
                    ? 'bg-surface-card text-brand-primary font-bold shadow-2xs'
                    : 'text-content-secondary hover:text-content-primary'
                }`}
              >
                All ({penalties.length})
              </button>
              <button
                onClick={() => setStatusFilter('PENDING')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                  statusFilter === 'PENDING'
                    ? 'bg-surface-card text-status-warning font-bold shadow-2xs'
                    : 'text-content-secondary hover:text-content-primary'
                }`}
              >
                Pending Recovery ({pendingPenalties.length})
              </button>
              <button
                onClick={() => setStatusFilter('PAID')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                  statusFilter === 'PAID'
                    ? 'bg-surface-card text-status-success font-bold shadow-2xs'
                    : 'text-content-secondary hover:text-content-primary'
                }`}
              >
                Vault Settled ({paidPenalties.length})
              </button>
              <button
                onClick={() => setStatusFilter('DISPUTED')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                  statusFilter === 'DISPUTED'
                    ? 'bg-surface-card text-purple-500 font-bold shadow-2xs'
                    : 'text-content-secondary hover:text-content-primary'
                }`}
              >
                Under Review ({disputedPenalties.length})
              </button>
              {waivedPenalties.length > 0 && (
                <button
                  onClick={() => setStatusFilter('WAIVED')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                    statusFilter === 'WAIVED'
                      ? 'bg-surface-card text-content-muted font-bold shadow-2xs'
                      : 'text-content-secondary hover:text-content-primary'
                  }`}
                >
                  Waived ({waivedPenalties.length})
                </button>
              )}
            </div>

            {/* View Mode 1: Dense Table */}
            {viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-surface-subtle text-[11px] font-bold uppercase tracking-wider text-content-muted border-b border-border-default whitespace-nowrap">
                      <th className="py-2.5 px-2.5 w-[21%]">Case ID & Date</th>
                      <th className="py-2.5 px-2.5 w-[23%]">Colleague</th>
                      <th className="py-2.5 px-2 w-[18%]">Rule & Breach</th>
                      <th className="py-2.5 px-2 w-[16%]">Fine & Vault</th>
                      <th className="py-2.5 px-2.5 w-[22%] text-right">Action / Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-content-muted">
                          <Filter className="w-6 h-6 mx-auto opacity-50 mb-2" />
                          <p className="text-xs font-medium">No infraction cases match criteria.</p>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((p) => {
                        const avatar = getEmployeeAvatar(p.employeeName, p.employeeId);
                        const isMahbub = p.employeeName.includes('Mahbub');

                        return (
                          <tr
                            key={p._id || p.penaltyId}
                            className="hover:bg-surface-hover/70 transition-colors h-14"
                          >
                            {/* Case ID & Date */}
                            <td className="py-2.5 px-2.5 whitespace-nowrap">
                              <div className="font-mono font-bold text-brand-primary text-xs tracking-tight">
                                {p.penaltyId}
                              </div>
                              <div className="text-[10px] text-content-muted font-mono leading-tight mt-0.5">
                                {p.date} • 10:25 Cutoff
                              </div>
                            </td>

                            {/* Colleague Profile with Avatar */}
                            <td className="py-2.5 px-2.5 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <img
                                  src={avatar}
                                  alt={p.employeeName}
                                  className="w-8 h-8 rounded-lg object-cover border border-border-default shrink-0 shadow-2xs"
                                />
                                <div className="min-w-0">
                                  <div className="font-bold text-content-primary tracking-tight whitespace-nowrap flex items-center gap-1 leading-tight text-xs">
                                    <span>{p.employeeName}</span>
                                    {isMahbub && (
                                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-brand-subtle text-brand-primary border border-brand-border">
                                        Architect
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-content-muted font-mono whitespace-nowrap leading-tight mt-0.5">
                                    {p.employeeId} • {p.department}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Rule Article & Concise Reason */}
                            <td className="py-2.5 px-2.5 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-subtle text-brand-primary border border-brand-border shrink-0">
                                  {p.articleNumber}
                                </span>
                                <span
                                  className="text-[11px] text-content-secondary truncate max-w-[110px]"
                                  title={p.reason}
                                >
                                  {p.reason}
                                </span>
                              </div>
                            </td>

                            {/* Fine Amount & Settlement Channel */}
                            <td className="py-2.5 px-2.5 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-extrabold text-content-primary text-xs">
                                  ৳{p.amount.toLocaleString()}
                                </span>
                                {getMethodBadge(p.paidVia)}
                              </div>
                            </td>

                            {/* Status & Action Buttons */}
                            <td className="py-2.5 px-3 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {p.status === 'PENDING' ? (
                                  <>
                                    <button
                                      onClick={() => onOpenPaymentModal(p)}
                                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-status-success hover:opacity-90 shadow-2xs active:scale-95 transition cursor-pointer"
                                      title="Settle to Party Vault"
                                    >
                                      Settle
                                    </button>
                                    <button
                                      onClick={() => onOpenDisputeModal(p)}
                                      className="px-2 py-1 rounded-lg text-xs font-medium text-content-secondary hover:text-content-primary bg-surface-subtle hover:bg-surface-hover border border-border-default active:scale-95 transition cursor-pointer"
                                      title="File Peer Review Dispute"
                                    >
                                      Dispute
                                    </button>
                                  </>
                                ) : (
                                  <div className="flex items-center gap-1.5">
                                    {getStatusBadge(p.status)}
                                    {p.status === 'PAID' && p.transactionRef && (
                                      <span
                                        className="text-[10px] font-mono text-content-muted truncate max-w-[80px]"
                                        title={`Transaction: ${p.transactionRef}`}
                                      >
                                        #{p.transactionRef.slice(-6)}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              /* View Mode 2: Interactive Cards Grid */
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((p) => {
                  const avatar = getEmployeeAvatar(p.employeeName, p.employeeId);
                  const isMahbub = p.employeeName.includes('Mahbub');

                  return (
                    <div
                      key={p._id || p.penaltyId}
                      className="p-4 rounded-xl bg-surface-subtle/40 border border-border-default hover:border-brand-border hover:shadow-sm transition flex flex-col justify-between gap-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={avatar}
                            alt={p.employeeName}
                            className="w-10 h-10 rounded-xl object-cover border border-border-default shadow-2xs"
                          />
                          <div>
                            <div className="font-bold text-content-primary text-sm flex items-center gap-1.5">
                              <span>{p.employeeName}</span>
                              {isMahbub && (
                                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-brand-subtle text-brand-primary border border-brand-border">
                                  Architect
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-content-muted font-mono mt-0.5">
                              {p.employeeId} • {p.department}
                            </div>
                          </div>
                        </div>
                        {getStatusBadge(p.status)}
                      </div>

                      <div className="p-2.5 rounded-lg bg-surface-card border border-border-subtle space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-content-muted font-mono">
                            {p.penaltyId}
                          </span>
                          <span className="font-mono font-extrabold text-content-primary text-sm">
                            ৳{p.amount.toLocaleString()} BDT
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-content-secondary">
                          <span className="px-1.5 py-0.2 rounded bg-brand-subtle text-brand-primary font-mono text-[9px] font-bold">
                            {p.articleNumber}
                          </span>
                          <span className="truncate">{p.reason}</span>
                        </div>
                      </div>

                      <div className="flex items-between justify-between pt-1">
                        <div className="text-[10px] text-content-muted font-mono">
                          {p.paidVia ? `Paid via ${p.paidVia}` : 'Pending Vault Clearance'}
                        </div>
                        {p.status === 'PENDING' && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => onOpenPaymentModal(p)}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-status-success hover:opacity-90 shadow-2xs active:scale-95 transition cursor-pointer"
                            >
                              Settle ৳500
                            </button>
                            <button
                              onClick={() => onOpenDisputeModal(p)}
                              className="px-2 py-1 rounded-lg text-xs font-medium text-content-secondary hover:text-content-primary bg-surface-subtle border border-border-default transition cursor-pointer"
                            >
                              Dispute
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Ledger Footer Audit Telemetry */}
          <div className="p-3 sm:px-5 bg-surface-subtle/60 border-t border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-content-muted font-mono">
            <div>
              Total Assessed: <strong className="text-content-primary">৳{totalAssessed.toLocaleString()}</strong> • Vaulted:{' '}
              <strong className="text-status-success">৳{totalCollected.toLocaleString()}</strong> • Pending:{' '}
              <strong className="text-status-warning">৳{totalPending.toLocaleString()}</strong>
            </div>
            <div className="flex items-center gap-1 text-content-secondary">
              <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
              <span>100% Peer-Governed Department Initiative</span>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Sidecar Panels */}
        <div className="lg:col-span-4 space-y-5">
          {/* Sidecar 1: Party Vault & Feast Goal Tracker */}
          <div className="rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 p-5 space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-status-warning/15 text-status-warning border border-status-warning/30">
                  <Pizza className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-content-primary tracking-tight">
                    Party & Feast Vault
                  </h4>
                  <p className="text-[11px] text-content-muted">Cloud & DevSecOps Treat Fund</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-status-warning bg-status-warning/10 px-2 py-0.5 rounded-full border border-status-warning/20">
                🍕 Active
              </span>
            </div>

            {/* Fund Balance Display */}
            <div className="p-3.5 rounded-xl bg-surface-subtle border border-border-subtle space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-content-secondary">Current Party Pool</span>
                <span className="text-xl font-black font-mono text-content-primary">
                  ৳{totalCollected.toLocaleString()} <span className="text-xs font-normal text-content-muted">/ ৳1,500</span>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-border-default overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((totalCollected / 1500) * 100))}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-content-muted">
                <span>{Math.round((totalCollected / 1500) * 100)}% to Next Feast</span>
                <span>Target: ৳1,500</span>
              </div>
            </div>

            {/* Feast Milestones List */}
            <div className="space-y-2 text-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-content-muted">
                Department Treat Milestones
              </div>

              {/* Milestone 1 */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-subtle/50 border border-border-subtle">
                <div className="flex items-center gap-2">
                  <Coffee className="w-3.5 h-3.5 text-status-success" />
                  <span className="text-content-secondary font-medium">Afternoon Tea & Singaras</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-status-success bg-status-success/15 px-1.5 py-0.2 rounded border border-status-success/20">
                  Unlocked! (৳500)
                </span>
              </div>

              {/* Milestone 2 */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-status-warning/10 border border-status-warning/20">
                <div className="flex items-center gap-2">
                  <Pizza className="w-3.5 h-3.5 text-status-warning" />
                  <span className="text-content-primary font-bold">Deep Dish Pizza & Cold Drinks</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-status-warning bg-status-warning/20 px-1.5 py-0.2 rounded">
                  In Progress (৳1,500)
                </span>
              </div>

              {/* Milestone 3 */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-subtle/50 border border-border-subtle opacity-70">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-content-muted" />
                  <span className="text-content-muted">Team Outing & Dinner Treat</span>
                </div>
                <span className="text-[10px] font-mono text-content-muted">
                  Goal (৳3,000)
                </span>
              </div>
            </div>

            <p className="text-[10px] text-content-muted leading-relaxed italic border-t border-border-subtle pt-2.5">
              "Every single taka collected stays strictly within our Cloud & DevSecOps group for team enjoyment and English fluency bonding."
            </p>
          </div>

          {/* Sidecar 2: Colleague Fluency Standing */}
          <div className="rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 p-5 space-y-3.5 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-brand-subtle text-brand-primary border border-brand-border">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-content-primary tracking-tight">
                    Colleague Fluency Roster
                  </h4>
                  <p className="text-[11px] text-content-muted">Daily English Habit Standings</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-brand-primary bg-brand-subtle px-2 py-0.5 rounded-full border border-brand-border">
                6 Members
              </span>
            </div>

            <div className="space-y-2">
              {teamMembers.map((m) => {
                const avatar = getEmployeeAvatar(m.name, m.id);
                const isMahbub = m.name.includes('Mahbub');

                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-surface-subtle/40 border border-border-subtle hover:bg-surface-subtle transition"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={avatar}
                        alt={m.name}
                        className="w-7 h-7 rounded-lg object-cover border border-border-default shrink-0 shadow-2xs"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-content-primary truncate flex items-center gap-1">
                          <span>{m.name}</span>
                          {isMahbub && (
                            <span className="text-[8px] font-mono px-1 rounded bg-brand-subtle text-brand-primary border border-brand-border">
                              Arch
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-content-muted font-mono truncate">
                          {m.id} • {m.dept}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      {m.status === 'CHAMPION' && (
                        <span className="text-[10px] font-mono font-bold text-status-success bg-status-success/15 px-1.5 py-0.2 rounded border border-status-success/30">
                          100% Fluent ⭐
                        </span>
                      )}
                      {m.status === 'SETTLED' && (
                        <span className="text-[10px] font-mono font-bold text-pink-600 dark:text-pink-400 bg-pink-500/15 px-1.5 py-0.2 rounded border border-pink-500/30">
                          Settled (bKash)
                        </span>
                      )}
                      {m.status === 'PENDING' && (
                        <span className="text-[10px] font-mono font-bold text-status-warning bg-status-warning/15 px-1.5 py-0.2 rounded border border-status-warning/30">
                          ৳500 Pending
                        </span>
                      )}
                      {m.status === 'EXCUSED' && (
                        <span className="text-[10px] font-mono text-content-muted bg-surface-subtle px-1.5 py-0.2 rounded border border-border-default">
                          Excused
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidecar 3: Settlement Channels Info */}
          <div className="rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 p-5 space-y-3 transition-colors">
            <h4 className="text-xs font-bold text-content-primary flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-brand-primary" />
              Settlement & Recovery Protocol
            </h4>
            <div className="space-y-2 text-[11px] text-content-secondary">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-pink-500/15 text-pink-600 dark:text-pink-400 font-mono font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-content-primary">bKash Personal Transfer:</strong> Send ৳500 to Vault pool with reference <code className="text-[10px] font-mono text-brand-primary">EMP-ID</code>.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-brand-subtle text-brand-primary font-mono font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-content-primary">Monthly Payroll Reconciliation:</strong> Unsettled dues get deducted automatically into the party pot.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 font-mono font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-content-primary">Peer Appeal:</strong> Legitimate network or WhatsApp delays can be appealed under Article 3.2.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
