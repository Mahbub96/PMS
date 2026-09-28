import React, { useState } from 'react';
import { PenaltyRecord } from '../types/index.js';
import { X, AlertCircle } from 'lucide-react';

interface DisputeModalProps {
  penalty: PenaltyRecord | null;
  onClose: () => void;
  onSubmitDispute: (id: string, reason: string) => Promise<void>;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({
  penalty,
  onClose,
  onSubmitDispute,
}) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!penalty) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmitDispute(penalty._id || penalty.penaltyId, reason);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              File Dispute / Appeal
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Infraction: {penalty.penaltyId}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 mb-4 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Employee:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{penalty.employeeName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Charge:</span>
            <span className="text-rose-500 font-medium">Article {penalty.articleNumber} (৳{penalty.amount})</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Grounds for Dispute / Justification
            </label>
            <textarea
              rows={4}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. WhatsApp message was sent at 10:24 AM but experienced network latency due to office Wi-Fi switch reboot. Router timestamp logs attached."
              className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
            />
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Appeals are reviewed by the Disciplinary Committee within 24 hours. Frivolous disputes may incur administrative review fees.
          </p>

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
              disabled={isSubmitting || !reason.trim()}
              className="px-5 py-2.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 active:scale-95 disabled:opacity-50 transition shadow-lg shadow-purple-600/20"
            >
              {isSubmitting ? 'Filing Appeal...' : 'Submit Formal Appeal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
