import React from 'react';
import { ProsecutionResult } from '../types/index.js';
import { getEmployeeAvatar } from '../utils/avatars.js';
import { X, CheckCircle2, ShieldAlert, AlertTriangle, Sparkles, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProsecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ProsecutionResult | null;
  isRunning: boolean;
  onRunAgain: () => void;
}

export const ProsecutionModal: React.FC<ProsecutionModalProps> = ({
  isOpen,
  onClose,
  result,
  isRunning,
  onRunAgain,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl rounded-2xl bg-surface-card border border-border-default shadow-2xl p-5 sm:p-6 relative transition-colors">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-content-muted hover:text-content-primary hover:bg-surface-hover transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-brand-subtle text-brand-primary border border-brand-border">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-content-primary tracking-tight">
              10:25 AM Adjudication Cutoff Engine
            </h3>
            <p className="text-xs text-content-muted">
              Biometric Attendance vs. WhatsApp English "Done" Reconciliation
            </p>
          </div>
        </div>

        {isRunning ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-brand-subtle border-t-brand-primary animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand-primary animate-pulse" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-content-primary">
                Auditing Office Attendees & Message Timestamps...
              </p>
              <p className="text-xs text-content-muted mt-1">
                Comparing biometric punch logs against Asia/Dhaka 10:25:00 cutoff.
              </p>
            </div>
          </div>
        ) : result ? (
          <div className="space-y-4">
            {/* Summary Stat Pills */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-surface-subtle border border-border-default text-center">
                <div className="text-xl font-black font-mono text-content-primary">
                  {result.totalPresent}
                </div>
                <div className="text-[10px] font-bold text-content-muted uppercase mt-0.5">
                  Present in Office
                </div>
              </div>
              <div className="p-3 rounded-xl bg-status-success/15 border border-status-success/30 text-center">
                <div className="text-xl font-black font-mono text-status-success">
                  {result.totalCompliant}
                </div>
                <div className="text-[10px] font-bold text-status-success uppercase mt-0.5">
                  Verified On-Time
                </div>
              </div>
              <div className="p-3 rounded-xl bg-status-danger/15 border border-status-danger/30 text-center">
                <div className="text-xl font-black font-mono text-status-danger">
                  {result.totalPenalized}
                </div>
                <div className="text-[10px] font-bold text-status-danger uppercase mt-0.5">
                  Fined (Art. 1.1)
                </div>
              </div>
            </div>

            {/* Infraction Details List */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-content-muted mb-2">
                Audited Colleague Roster ({result.date})
              </h4>
              <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                {result.details.map((d) => {
                  const avatar = getEmployeeAvatar(d.employeeName, d.employeeId);
                  const isMahbub = d.employeeName.includes('Mahbub');

                  return (
                    <div
                      key={d.employeeId}
                      className="p-2.5 rounded-xl bg-surface-subtle/50 border border-border-default flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={avatar}
                          alt={d.employeeName}
                          className="w-7 h-7 rounded-lg object-cover border border-border-default shadow-2xs shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-content-primary flex items-center gap-1 leading-tight">
                            <span>{d.employeeName}</span>
                            {isMahbub && (
                              <span className="text-[8px] font-mono px-1 rounded bg-brand-subtle text-brand-primary border border-brand-border">
                                Arch
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-content-muted font-mono leading-tight mt-0.5">
                            {d.employeeId}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {d.penaltyIssued ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-status-danger bg-status-danger/15 px-2 py-0.5 rounded-full border border-status-danger/30 uppercase">
                            <AlertTriangle className="w-3 h-3" />
                            +৳500 Vault Due
                          </span>
                        ) : d.present && d.done ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-status-success bg-status-success/15 px-2 py-0.5 rounded-full border border-status-success/30 uppercase">
                            <CheckCircle2 className="w-3 h-3" />
                            Compliant
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-content-muted bg-surface-subtle px-2 py-0.5 rounded-full border border-border-default uppercase">
                            Excused
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-border-default">
              <span className="text-[11px] text-content-muted font-mono">
                {result.penaltiesCreated > 0
                  ? `+৳${(result.penaltiesCreated * 500).toLocaleString()} directed to Party Vault`
                  : '100% Department Compliance Today!'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={onRunAgain}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-content-secondary hover:text-content-primary bg-surface-subtle hover:bg-surface-hover border border-border-default transition cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Re-run</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-brand-primary hover:bg-brand-hover active:scale-95 transition shadow-sm cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
