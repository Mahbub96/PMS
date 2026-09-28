import React, { useState } from 'react';
import { PenaltyRecord, PenaltyStatus } from '../types/index.js';
import {
  Search,
  CheckCircle,
  CreditCard,
  AlertCircle,
  Clock,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface PenaltyTableProps {
  penalties: PenaltyRecord[];
  onOpenPaymentModal: (penalty: PenaltyRecord) => void;
  onOpenDisputeModal: (penalty: PenaltyRecord) => void;
  onWaivePenalty: (penaltyId: string) => void;
}

export const PenaltyTable: React.FC<PenaltyTableProps> = ({
  penalties,
  onOpenPaymentModal,
  onOpenDisputeModal,
  onWaivePenalty,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | PenaltyStatus>('ALL');

  const filtered = penalties.filter((p) => {
    const matchesSearch =
      p.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      p.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      p.penaltyId.toLowerCase().includes(search.toLowerCase()) ||
      p.articleNumber.includes(search);

    if (!matchesSearch) return false;
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    return true;
  });

  const getStatusBadge = (status: PenaltyStatus) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            <span>PAID</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wide">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>PENDING</span>
          </span>
        );
      case 'DISPUTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-wide">
            <AlertCircle className="w-3 h-3 text-purple-400" />
            <span>DISPUTED</span>
          </span>
        );
      case 'WAIVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/[0.04] text-slate-400 border border-white/[0.08] uppercase tracking-wide">
            <span>WAIVED</span>
          </span>
        );
    }
  };

  const getMethodBadge = (via?: string | null) => {
    if (!via) return null;
    if (via === 'BKASH') {
      return (
        <span className="text-[10px] font-mono text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
          bKash
        </span>
      );
    }
    if (via === 'SALARY_DEDUCTION') {
      return (
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
          Payroll
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono text-slate-400 bg-white/[0.05] px-2 py-0.5 rounded border border-white/[0.08]">
        {via}
      </span>
    );
  };

  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] shadow-xl overflow-hidden">
      {/* Controls Header */}
      <div className="p-4 sm:p-5 border-b border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-bold text-white tracking-tight">
              Infraction Adjudication & Recovery Ledger
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
              {penalties.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time statutory assessments, payments, and employee dispute tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative min-w-[210px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ID, employee..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-900/90 border border-white/[0.08] text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-white/[0.08] text-xs">
            {(['ALL', 'PENDING', 'PAID', 'DISPUTED', 'WAIVED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 rounded-lg font-medium text-[11px] transition-all ${
                  statusFilter === tab
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/60 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/[0.06]">
              <th className="py-3 px-4 sm:px-6">Infraction ID</th>
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Rule & Reason</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <ShieldCheck className="w-8 h-8 text-emerald-400/60" />
                    <p className="text-sm font-semibold text-slate-300">No penalties recorded under this filter</p>
                    <p className="text-xs text-slate-500">All present employees are in compliance.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr
                  key={p.penaltyId}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  {/* Infraction ID */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="font-mono font-bold text-cyan-400">
                      {p.penaltyId}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {p.date} • {p.isAutomated ? '10:25 AM Cutoff' : 'Manual'}
                    </div>
                  </td>

                  {/* Employee */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">
                      {p.employeeName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {p.employeeId} <span className="text-slate-600 font-sans">•</span> {p.department}
                    </div>
                  </td>

                  {/* Reason & Article */}
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 mb-1">
                      Art. {p.articleNumber}
                    </div>
                    <p className="text-slate-300 text-[11px] leading-snug line-clamp-1">
                      {p.reason}
                    </p>
                    {p.disputeReason && (
                      <div className="mt-1 text-[10px] text-purple-300 bg-purple-500/10 p-1.5 rounded-lg border border-purple-500/20">
                        <strong className="text-purple-400">Appeal:</strong> {p.disputeReason}
                      </div>
                    )}
                  </td>

                  {/* Fine Amount */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-sm text-white tabular-nums">
                      ৳{p.amount.toLocaleString()}
                    </div>
                    {p.paidVia && (
                      <div className="mt-0.5 flex items-center gap-1">
                        {getMethodBadge(p.paidVia)}
                      </div>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">{getStatusBadge(p.status)}</td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {p.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => onOpenPaymentModal(p)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-md shadow-emerald-500/20 active:scale-95 transition"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Settle</span>
                          </button>
                          <button
                            onClick={() => onOpenDisputeModal(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition active:scale-95"
                          >
                            <span>Dispute</span>
                          </button>
                        </>
                      )}
                      {p.status === 'DISPUTED' && (
                        <button
                          onClick={() => onWaivePenalty(p.penaltyId)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition active:scale-95"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Waive Fine</span>
                        </button>
                      )}
                      {p.status === 'PAID' && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          Ref: {p.transactionRef || 'TRX-PAYROLL'}
                        </span>
                      )}
                      {p.status === 'WAIVED' && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          Admin Waived
                        </span>
                      )}
                    </div>
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
