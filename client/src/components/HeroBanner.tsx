import React from 'react';
import { ShieldAlert, ArrowRight, CheckCircle2, AlertTriangle, Sparkles, Scale } from 'lucide-react';

interface HeroBannerProps {
  onRunProsecution: () => void;
  onOpenConstitution: () => void;
  totalCompliant: number;
  totalPresent: number;
  totalPenalized: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onRunProsecution,
  onOpenConstitution,
  totalCompliant,
  totalPresent,
  totalPenalized,
}) => {
  const compliancePct = totalPresent > 0 ? Math.round((totalCompliant / totalPresent) * 100) : 100;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-slate-900 via-[#0d1424] to-[#080d1a] p-6 lg:p-8 shadow-2xl">
      {/* Subtle Ambient Background Gradients */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Left: Headline & Purpose */}
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-cyan-400 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Autonomous Disciplinary Governance Engine</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Penalty Management <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
              Cloud Suite
            </span>
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl">
            Automated compliance pipeline bridging physical biometric check-ins with official WhatsApp morning communications.
            Enforces the <strong>10:25 AM Asia/Dhaka cutoff</strong>, auto-adjudicating statutory fines under Constitution Article 1.1 with complete audit integrity.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onRunProsecution}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-indigo-300 hover:from-cyan-300 hover:to-indigo-200 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
            >
              <ShieldAlert className="w-4 h-4 text-slate-950" />
              <span>Simulate Today's Adjudication</span>
            </button>

            <button
              onClick={onOpenConstitution}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] active:scale-95 transition-all"
            >
              <Scale className="w-3.5 h-3.5 text-indigo-400" />
              <span>Constitution Rule Book</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Right: Clean Holographic Metric Pod (No Busy Background Clutter) */}
        <div className="w-full lg:w-72 shrink-0 rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/logo.jpg"
                alt="Emblem"
                className="w-9 h-9 rounded-xl object-cover border border-white/20 shadow-md"
              />
              <div>
                <div className="text-xs font-bold text-white tracking-wide">STATUTORY STATUS</div>
                <div className="text-[10px] text-slate-400 font-mono">Asia/Dhaka Shift</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              10:25 AM
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-400 font-medium">Compliance Rate</span>
              <span className="text-2xl font-extrabold font-mono text-cyan-400">{compliancePct}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-700"
                style={{ width: `${compliancePct}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <div className="font-mono font-bold text-emerald-400 text-sm">{totalCompliant}</div>
              <div className="text-[10px] text-emerald-500/80 font-medium mt-0.5">Compliant</div>
            </div>
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
              <div className="font-mono font-bold text-rose-400 text-sm">{totalPenalized}</div>
              <div className="text-[10px] text-rose-500/80 font-medium mt-0.5">Penalized</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
