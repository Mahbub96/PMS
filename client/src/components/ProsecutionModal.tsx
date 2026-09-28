import React from 'react';
import { ProsecutionResult } from '../types/index.js';
import { X, CheckCircle2, ShieldAlert, AlertTriangle, Play, Sparkles } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl rounded-3xl glass-panel p-6 border border-slate-200 dark:border-white/10 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-200 hover:bg-white/10 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 dark:text-cyan-400 border border-indigo-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Autonomous 10:25 AM Adjudication Engine
            </h3>
            <p className="text-xs text-slate-400">
              Biometric Attendance vs. WhatsApp Morning Done Verification
            </p>
          </div>
        </div>

        {isRunning ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-indigo-500/20 border-t-cyan-400 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Auditing Office Attendees & Message Timestamps...
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Comparing biometric punch logs against Asia/Dhaka 10:25:00 cutoff.
              </p>
            </div>
          </div>
        ) : result ? (
          <div className="space-y-5">
            {/* Summary Stat Pills */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center">
                <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
                  {result.totalPresent}
                </div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">
                  Present in Office
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <div className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                  {result.totalCompliant}
                </div>
                <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase mt-0.5">
                  Done on Time
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
                <div className="text-xl font-extrabold font-mono text-rose-600 dark:text-rose-400">
                  {result.totalPenalized}
                </div>
                <div className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 uppercase mt-0.5">
                  Fined (Art. 1.1)
                </div>
              </div>
            </div>

            {/* Infraction Details List */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Audited Employee Roster ({result.date})
              </h4>
              <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
                {result.details.map((emp) => (
                  <div
                    key={emp.employeeId}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {emp.employeeName}
                      </span>
                      <span className="text-slate-400 text-[11px] ml-1.5 font-mono">
                        ({emp.employeeId})
                      </span>
                    </div>

                    <div>
                      {emp.penaltyIssued ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-500 border border-rose-500/20">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Penalized (৳500)</span>
                        </span>
                      ) : emp.present ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Compliant</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Absent</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
              <button
                onClick={onRunAgain}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Play className="w-3 h-3" />
                <span>Re-run Adjudication</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20"
              >
                Accept & Review Ledger
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
