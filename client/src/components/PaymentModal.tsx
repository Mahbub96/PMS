import React, { useState } from 'react';
import { PenaltyRecord, PaymentMethod } from '../types/index.js';
import { X, CheckCircle, CreditCard, DollarSign } from 'lucide-react';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirmPayment(penalty._id || penalty.penaltyId, method, ref, notes);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentMethods: Array<{ id: PaymentMethod; label: string; icon: string }> = [
    { id: 'BKASH', label: 'bKash Merchant Pay', icon: '📱' },
    { id: 'SALARY_DEDUCTION', label: 'Payroll Salary Deduction', icon: '💼' },
    { id: 'NAGAD', label: 'Nagad Digital Wallet', icon: '⚡' },
    { id: 'CASH', label: 'Cash at HR Desk', icon: '💵' },
    { id: 'BANK_TRANSFER', label: 'Corporate Bank Transfer', icon: '🏦' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl glass-panel p-6 border border-slate-200 dark:border-white/10 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-200 hover:bg-white/10 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Settle Infraction Fine
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              {penalty.penaltyId}
            </p>
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 mb-5 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-400">Employee:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{penalty.employeeName} ({penalty.employeeId})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Infraction:</span>
            <span className="text-slate-700 dark:text-slate-300">Article {penalty.articleNumber}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800 font-bold">
            <span className="text-slate-900 dark:text-white">Fine Payable:</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 text-sm">৳{penalty.amount.toLocaleString()} BDT</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Select Settlement Channel
            </label>
            <div className="grid grid-cols-1 gap-2">
              {paymentMethods.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition ${
                    method === m.id
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{m.icon}</span>
                    <span>{m.label}</span>
                  </span>
                  {method === m.id && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Transaction ID / Slip Reference
            </label>
            <input
              type="text"
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              placeholder="e.g. TRX992838192 or SLIP-049"
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Internal Resolution Note
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Verified by HR Accounts"
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 transition shadow-lg shadow-emerald-600/20"
            >
              {isSubmitting ? 'Recording...' : 'Mark as Settle (PAID)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
