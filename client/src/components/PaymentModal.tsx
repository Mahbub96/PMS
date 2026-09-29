import React, { useState } from 'react';
import { PenaltyRecord, PaymentMethod } from '../types/index.js';
import { getEmployeeAvatar } from '../utils/avatars.js';
import {
  X,
  CheckCircle,
  CreditCard,
  PartyPopper,
  ShieldCheck,
  Check,
  Smartphone,
  Briefcase,
  Zap,
  Coins,
  Building,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  penalty: PenaltyRecord | null;
  onClose: () => void;
  onConfirmPayment: (
    id: string,
    method: PaymentMethod,
    transactionRef: string,
    notes: string
  ) => Promise<void>;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  penalty,
  onClose,
  onConfirmPayment,
}) => {
  const [method, setMethod] = useState<PaymentMethod>('BKASH');
  const [ref, setRef] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!penalty) return null;

  const avatar = getEmployeeAvatar(penalty.employeeName, penalty.employeeId);
  const isMahbub = penalty.employeeName.includes('Mahbub');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirmPayment(penalty._id || penalty.penaltyId, method, ref, notes || 'Settled to Cloud & DevSecOps Party Vault');
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentMethods: Array<{
    id: PaymentMethod;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    badge: string;
  }> = [
    {
      id: 'BKASH',
      label: 'bKash Personal Transfer',
      sublabel: 'Send to Department Vault Treasurer',
      icon: <Smartphone className="w-4 h-4 text-pink-500" />,
      badge: 'Instant',
    },
    {
      id: 'SALARY_DEDUCTION',
      label: 'Monthly Payroll Reconciliation',
      sublabel: 'Reconciled automatically at payroll cycle',
      icon: <Briefcase className="w-4 h-4 text-brand-primary" />,
      badge: 'Auto',
    },
    {
      id: 'NAGAD',
      label: 'Nagad Digital Wallet',
      sublabel: 'Direct peer transfer to fund pot',
      icon: <Zap className="w-4 h-4 text-amber-500" />,
      badge: 'Fast',
    },
    {
      id: 'CASH',
      label: 'Department Cash Pot',
      sublabel: 'Direct hand-off to Mahbub Alam / Treasurer',
      icon: <Coins className="w-4 h-4 text-emerald-500" />,
      badge: 'Manual',
    },
    {
      id: 'BANK_TRANSFER',
      label: 'Direct Bank Hand-off',
      sublabel: 'Peer bank deposit / transfer',
      icon: <Building className="w-4 h-4 text-sky-500" />,
      badge: 'Standard',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl bg-surface-card border border-border-default shadow-2xl p-5 sm:p-6 relative transition-colors">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-content-muted hover:text-content-primary hover:bg-surface-hover transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-status-success/15 text-status-success border border-status-success/30">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-content-primary tracking-tight">
                Settle Infraction Fine
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-status-warning border border-status-warning/30 flex items-center gap-1">
                <PartyPopper className="w-3 h-3" />
                Party Vault
              </span>
            </div>
            <p className="text-xs text-content-muted font-mono mt-0.5">
              Case Ref: <span className="text-brand-primary font-bold">{penalty.penaltyId}</span>
            </p>
          </div>
        </div>

        {/* Colleague & Fine Breakdown Card */}
        <div className="p-3.5 rounded-xl bg-surface-subtle border border-border-default mb-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <img
                src={avatar}
                alt={penalty.employeeName}
                className="w-10 h-10 rounded-xl object-cover border border-border-default shadow-2xs shrink-0"
              />
              <div>
                <div className="font-bold text-content-primary text-xs sm:text-sm flex items-center gap-1.5">
                  <span>{penalty.employeeName}</span>
                  {isMahbub && (
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-brand-subtle text-brand-primary border border-brand-border">
                      Architect
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-content-muted font-mono">
                  {penalty.employeeId} • {penalty.department}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-content-muted block">
                Fine Due
              </span>
              <span className="text-base sm:text-lg font-black font-mono text-status-success">
                ৳{penalty.amount.toLocaleString()} <span className="text-[11px] font-normal text-content-muted">BDT</span>
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-xs">
            <span className="text-content-secondary flex items-center gap-1">
              <span className="font-mono font-bold text-brand-primary bg-brand-subtle px-1.5 py-0.5 rounded text-[10px] border border-brand-border">
                {penalty.articleNumber}
              </span>
              <span className="truncate max-w-[200px] sm:max-w-[260px] text-content-muted text-[11px]">
                {penalty.reason}
              </span>
            </span>
            <span className="text-[10px] font-mono text-status-warning bg-status-warning/10 px-1.5 py-0.5 rounded border border-status-warning/20 shrink-0">
              100% Snack Fund 🍕
            </span>
          </div>
        </div>

        {/* Settlement Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-content-secondary mb-2">
              Select Settlement Channel
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {paymentMethods.map((m) => {
                const isSelected = method === m.id;
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? 'border-status-success bg-status-success/10 text-content-primary shadow-2xs font-semibold'
                        : 'border-border-default bg-surface-subtle/50 text-content-secondary hover:bg-surface-subtle hover:text-content-primary'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-1 rounded-lg bg-surface-card border border-border-subtle shrink-0">
                        {m.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-content-primary truncate">
                          {m.label}
                        </div>
                        <div className="text-[10px] text-content-muted truncate">
                          {m.sublabel}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-4 h-4 text-status-success shrink-0 ml-1.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-content-secondary mb-1">
                Transaction ID / Ref #
              </label>
              <input
                type="text"
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                placeholder="e.g. TRX992838192"
                className="w-full px-3 py-2 rounded-xl bg-surface-subtle border border-border-default text-content-primary placeholder:text-content-muted focus:outline-none focus:border-brand-primary text-xs font-mono transition"
              />
            </div>

            <div>
              <label className="block font-semibold text-content-secondary mb-1">
                Peer Resolution Note
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Verified by Peer Treasurer"
                className="w-full px-3 py-2 rounded-xl bg-surface-subtle border border-border-default text-content-primary placeholder:text-content-muted focus:outline-none focus:border-brand-primary text-xs transition"
              />
            </div>
          </div>

          {/* Peer Governance Notice */}
          <div className="p-2.5 rounded-xl bg-brand-subtle/50 border border-brand-border/60 text-[11px] text-content-secondary flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
            <p className="leading-tight">
              Self-governed by Cloud & DevSecOps members. Settling immediately clears the due from the active ledger and updates the Party Vault balance.
            </p>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-border-default">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-content-muted hover:text-content-primary hover:bg-surface-hover transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-status-success hover:opacity-90 active:scale-95 disabled:opacity-50 transition shadow-sm cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Recording...' : 'Mark as Settled (PAID)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
