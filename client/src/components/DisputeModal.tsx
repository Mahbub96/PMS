import React, { useState } from 'react';
import { PenaltyRecord } from '../types/index.js';
import { getEmployeeAvatar } from '../utils/avatars.js';
import { X, AlertCircle, Scale, ShieldCheck, User } from 'lucide-react';

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

  const avatar = getEmployeeAvatar(penalty.employeeName, penalty.employeeId);
  const isMahbub = penalty.employeeName.includes('Mahbub');

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-surface-card border border-border-default shadow-2xl p-5 sm:p-6 relative transition-colors">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-content-muted hover:text-content-primary hover:bg-surface-hover transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-content-primary tracking-tight">
              File Peer Review Dispute
            </h3>
            <p className="text-xs text-content-muted font-mono mt-0.5">
              Case Ref: <span className="text-brand-primary font-bold">{penalty.penaltyId}</span>
            </p>
          </div>
        </div>

        {/* Colleague Details */}
        <div className="p-3.5 rounded-xl bg-surface-subtle border border-border-default mb-4 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={avatar}
                alt={penalty.employeeName}
                className="w-8 h-8 rounded-lg object-cover border border-border-default shadow-2xs shrink-0"
              />
              <div>
                <div className="font-bold text-content-primary flex items-center gap-1">
                  <span>{penalty.employeeName}</span>
                  {isMahbub && (
                    <span className="text-[8px] font-mono px-1 rounded bg-brand-subtle text-brand-primary border border-brand-border">
                      Architect
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-content-muted font-mono">
                  {penalty.employeeId} • {penalty.department}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-content-muted uppercase font-bold block">Assessed Due</span>
              <span className="font-mono font-bold text-status-danger text-sm">৳{penalty.amount} BDT</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px]">
            <span className="text-content-muted">Infraction Rule:</span>
            <span className="font-mono text-content-primary font-semibold">Article {penalty.articleNumber}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-content-secondary mb-1.5">
              Grounds for Dispute / Technical Context
            </label>
            <textarea
              rows={4}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. WhatsApp message was sent at 10:24 AM but encountered network latency due to office Wi-Fi switch reboot. Router timestamp logs attached."
              className="w-full px-3 py-2.5 rounded-xl bg-surface-subtle border border-border-default text-content-primary placeholder:text-content-muted focus:outline-none focus:border-purple-500 resize-none transition"
            />
          </div>

          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-700 dark:text-purple-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-purple-600 dark:text-purple-400" />
            <p className="leading-tight">
              Appeals are reviewed fairly by department colleagues and Lead Architect Mahbub Alam within 24 hours.
            </p>
          </div>

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
              disabled={isSubmitting || !reason.trim()}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 active:scale-95 disabled:opacity-50 transition shadow-sm cursor-pointer"
            >
              {isSubmitting ? 'Filing Appeal...' : 'Submit Peer Appeal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
