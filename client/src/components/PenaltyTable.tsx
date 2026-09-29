import React, { useState } from 'react';
import { PenaltyRecord, PenaltyStatus } from '../types/index.js';
import { getEmployeeAvatar } from '../utils/avatars.js';
import {
  Search,
  CheckCircle,
  CreditCard,
  AlertCircle,
  Clock,
  ShieldCheck,
  RotateCcw,
  Scale,
  Filter,
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

  const pendingCount = penalties.filter((p) => p.status === 'PENDING').length;
  const paidCount = penalties.filter((p) => p.status === 'PAID').length;
  const disputedCount = penalties.filter((p) => p.status === 'DISPUTED').length;

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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-status-success/10 text-status-success border border-status-success/20 uppercase tracking-wide">
            <CheckCircle className="w-3 h-3" />
            <span>PAID</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-status-warning/10 text-status-warning border border-status-warning/20 uppercase tracking-wide">
            <Clock className="w-3 h-3" />
            <span>PENDING</span>
          </span>
        );
      case 'DISPUTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 uppercase tracking-wide">
            <AlertCircle className="w-3 h-3" />
            <span>DISPUTED</span>
          </span>
        );
      case 'WAIVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-surface-subtle text-content-muted border border-border-default uppercase tracking-wide">
            <span>WAIVED</span>
          </span>
        );
    }
  };

  const getMethodBadge = (via?: string | null) => {
    if (!via) return null;
    if (via === 'BKASH') {
      return (
        <span className="text-[10px] font-mono font-medium text-pink-600 dark:text-pink-400 bg-pink-500/10 border border-pink-500/20 px-1.5 py-0.5 rounded">
          bKash
        </span>
      );
    }
    if (via === 'SALARY_DEDUCTION') {
      return (
        <span className="text-[10px] font-mono font-medium text-brand-primary bg-brand-subtle border border-brand-border px-1.5 py-0.5 rounded">
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
    <div className="rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 overflow-hidden transition-colors">
      {/* Controls Header */}
      <div className="p-4 sm:p-5 border-b border-border-default flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-bold text-content-primary tracking-tight">
              Infraction Adjudication & Recovery Ledger
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-subtle text-brand-primary border border-brand-border">
              {penalties.length} Total
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] font-mono">
            <span className="text-content-secondary">
              ৳<strong className="text-content-primary">1,000</strong> Assessed
            </span>
            <span className="text-content-muted">•</span>
            <span className="text-status-success font-semibold">
              ৳500 Settled (bKash)
            </span>
            <span className="text-content-muted">•</span>
            <span className="text-status-warning font-semibold">
              ৳500 Pending (Payroll)
            </span>
            <span className="text-content-muted">•</span>
            <span className="text-content-muted">
              0 Disputes
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ID, employee..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-surface-subtle border border-border-default text-content-primary placeholder:text-content-muted focus:outline-none focus:border-brand-primary transition"
            />
          </div>

          {/* Segmented Filter Pills */}
          <div className="flex items-center p-1 rounded-xl bg-surface-subtle border border-border-default text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-surface-card text-brand-primary font-bold shadow-2xs'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              All ({penalties.length})
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all cursor-pointer ${
                statusFilter === 'PENDING'
                  ? 'bg-surface-card text-status-warning font-bold shadow-2xs'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('PAID')}
              className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all cursor-pointer ${
                statusFilter === 'PAID'
                  ? 'bg-surface-card text-status-success font-bold shadow-2xs'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Paid ({paidCount})
            </button>
            <button
              onClick={() => setStatusFilter('DISPUTED')}
              className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all cursor-pointer ${
                statusFilter === 'DISPUTED'
                  ? 'bg-surface-card text-purple-600 dark:text-purple-400 font-bold shadow-2xs'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Disputed ({disputedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-surface-subtle text-[11px] font-bold uppercase tracking-wider text-content-muted border-b border-border-default">
              <th className="py-3 px-4 sm:px-6">Infraction ID</th>
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Rule & Reason</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-content-muted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Filter className="w-6 h-6 text-content-muted opacity-50" />
                    <p className="text-xs font-medium">No penalty records found matching criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
                const isMahbub = p.employeeName.includes('Mahbub');
                return (
                  <tr
                    key={p._id || p.penaltyId}
                    className="hover:bg-surface-hover/60 transition-colors"
                  >
                    {/* Infraction ID */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-mono font-bold text-brand-primary">
                        {p.penaltyId}
                      </div>
                      <div className="text-[10px] text-content-muted font-mono mt-0.5">
                        {p.date} • 10:25 AM Cutoff
                      </div>
                    </td>

                    {/* Employee */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={getEmployeeAvatar(p.employeeName, p.employeeId)}
                          alt={p.employeeName}
                          className="w-7 h-7 rounded-lg object-cover border border-border-default shrink-0"
                        />
                        <div>
                          <div className="font-bold text-content-primary">
                            {p.employeeName}
                          </div>
                          <div className="text-[10px] text-content-muted font-mono">
                            {p.employeeId} • {p.department}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Rule & Reason */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-brand-subtle text-brand-primary border border-brand-border">
                          {p.articleNumber}
                        </span>
                      </div>
                      <p className="text-[11px] text-content-secondary line-clamp-1">
                        {p.reason}
                      </p>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-extrabold text-content-primary text-sm">
                        ৳{p.amount.toLocaleString()}
                      </div>
                      <div className="mt-0.5">
                        {getMethodBadge(p.paidVia)}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(p.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {p.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => onOpenPaymentModal(p)}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-status-success hover:opacity-90 shadow-2xs active:scale-95 transition cursor-pointer"
                              title="Settle Penalty"
                            >
                              Settle
                            </button>
                            <button
                              onClick={() => onOpenDisputeModal(p)}
                              className="px-2 py-1 rounded-lg text-xs font-medium text-content-secondary hover:text-content-primary bg-surface-subtle hover:bg-surface-hover border border-border-default active:scale-95 transition cursor-pointer"
                              title="File Formal Appeal"
                            >
                              Dispute
                            </button>
                          </>
                        )}

                        {p.status === 'PAID' && p.transactionRef && (
                          <span className="text-[10px] font-mono text-content-muted">
                            Ref: {p.transactionRef}
                          </span>
                        )}

                        {p.status === 'DISPUTED' && (
                          <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400">
                            Appeal Pending Review
                          </span>
                        )}

                        {p.status === 'WAIVED' && (
                          <span className="text-[10px] font-mono text-content-muted">
                            Waived by Admin
                          </span>
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
    </div>
  );
};
