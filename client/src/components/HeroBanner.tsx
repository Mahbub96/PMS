import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Clock,
  RotateCw,
  Scale,
  Play,
  Sparkles,
  Zap,
} from 'lucide-react';

interface HeroBannerProps {
  onRunProsecution: () => void;
  onOpenConstitution: () => void;
  onSyncAttendance?: () => void;
  isSyncing?: boolean;
  totalCompliant: number;
  totalPresent: number;
  totalPenalized: number;
  totalLogged?: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onRunProsecution,
  onOpenConstitution,
  onSyncAttendance,
  isSyncing = false,
  totalCompliant,
  totalPresent,
  totalPenalized,
  totalLogged = 6,
}) => {
  const compliancePct = totalPresent > 0 ? Math.round((totalCompliant / totalPresent) * 100) : 100;
  const totalAbsent = Math.max(0, totalLogged - totalPresent);

  // SVG Radial Donut calculations (radius = 44)
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (compliancePct / 100) * circumference;

  const [dhakaTime, setDhakaTime] = useState<string>('');
  const [cutoffStatus, setCutoffStatus] = useState<string>('Adjudicated');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      setDhakaTime(timeStr);

      const dhakaDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }));
      const cutoff = new Date(dhakaDate);
      cutoff.setHours(10, 25, 0, 0);

      const diff = cutoff.getTime() - dhakaDate.getTime();
      if (diff > 0) {
        const mins = Math.floor(diff / 60000);
        setCutoffStatus(`Cutoff in ${mins}m`);
      } else {
        setCutoffStatus('Cutoff Reached • Adjudicated');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 transition-colors p-5 lg:p-6">
      {/* Subtle ambient brand tint */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Column (5 cols): Title, Operational Context & Primary CTA */}
        <div className="md:col-span-12 lg:col-span-5 space-y-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-subtle text-brand-primary border border-brand-border">
              <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
              <span>Real-Time Adjudication Engine</span>
            </span>
            <span className="text-[11px] font-mono text-content-muted">
              Dhaka Shift (10:25 Cutoff)
            </span>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-content-primary">
              Executive Overview
            </h1>
            {/* High-density telemetry strip instead of paragraphs */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface-subtle border border-border-default text-[10px] font-mono font-medium text-content-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
                Cutoff: 10:25:00 AM (Dhaka)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-subtle border border-border-default text-[10px] font-mono font-medium text-content-secondary">
                ZKTeco HRM: Connected
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-subtle border border-border-default text-[10px] font-mono font-medium text-content-secondary">
                Article 1.1 Enforcement: Active
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              onClick={onRunProsecution}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-primary hover:bg-brand-primaryHover shadow-xs active:scale-95 transition cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Adjudication</span>
            </button>

            {onSyncAttendance && (
              <button
                onClick={onSyncAttendance}
                disabled={isSyncing}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-content-secondary hover:text-content-primary bg-surface-subtle hover:bg-surface-hover border border-border-default active:scale-95 transition cursor-pointer disabled:opacity-50"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync Biometrics</span>
              </button>
            )}

            <button
              onClick={onOpenConstitution}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-content-secondary hover:text-content-primary bg-surface-subtle hover:bg-surface-hover border border-border-default active:scale-95 transition cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5 text-brand-primary" />
              <span>Rule Book</span>
            </button>
          </div>
        </div>

        {/* Center Column (4 cols): Radial Compliance Gauge */}
        <div className="md:col-span-6 lg:col-span-4 p-4 rounded-xl bg-surface-subtle border border-border-default flex flex-col items-center justify-center">
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-content-muted">
              Reconciliation Rate
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-brand-subtle text-brand-primary border border-brand-border">
              {totalPresent} Present / {totalLogged} Total
            </span>
          </div>

          <div className="flex items-center gap-5 my-1">
            {/* SVG Donut */}
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg className="w-24 h-24 -rotate-90 transform drop-shadow-xs" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="complianceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                </defs>
                {/* Background circle track */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-border-default"
                  fill="transparent"
                />
                {/* Active progress stroke */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="url(#complianceGradient)"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  fill="transparent"
                />
              </svg>
              {/* Center percentage */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold font-mono text-content-primary leading-none">
                  {compliancePct}%
                </span>
                <span className="text-[9px] font-bold text-content-muted tracking-tight mt-0.5 uppercase">
                  Compliant
                </span>
              </div>
            </div>

            {/* Breakdown Legend */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-status-success shrink-0" />
                <span className="text-content-secondary text-[11px]">Compliant:</span>
                <span className="font-mono font-bold text-content-primary text-[11px]">{totalCompliant}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-status-danger shrink-0" />
                <span className="text-content-secondary text-[11px]">Penalized:</span>
                <span className="font-mono font-bold text-content-primary text-[11px]">{totalPenalized}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-content-muted shrink-0" />
                <span className="text-content-secondary text-[11px]">Absent/Leave:</span>
                <span className="font-mono font-bold text-content-primary text-[11px]">{totalAbsent}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (3 cols): Cutoff Status & Statutory Governance */}
        <div className="md:col-span-6 lg:col-span-3 p-4 rounded-xl bg-surface-subtle border border-border-default space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border-default">
            <span className="text-[11px] font-bold uppercase tracking-wider text-content-muted">
              Cutoff State
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-status-success">
              <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
              <span>ACTIVE</span>
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="text-xs font-bold text-content-primary flex items-center justify-between">
              <span>Cutoff Adjudication</span>
              <span className="font-mono text-brand-primary">10:25 AM</span>
            </div>
            <p className="text-[11px] text-content-secondary leading-snug">
              {cutoffStatus}
            </p>
          </div>

          <div className="pt-2 border-t border-border-default text-[10px] font-mono text-content-muted flex items-center justify-between">
            <span>Fine: ৳500 / infraction</span>
            <span>Article 1.1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
