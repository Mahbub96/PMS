import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  RotateCw,
  Sun,
  Moon,
  Bell,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onRunProsecution: () => void;
  onSyncAttendance: () => void;
  isProcessingProsecution: boolean;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  onRunProsecution,
  onSyncAttendance,
  isProcessingProsecution,
}) => {
  const [dhakaTime, setDhakaTime] = useState<string>('');
  const [timeUntilCutoff, setTimeUntilCutoff] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setDhakaTime(timeStr);

      const dhakaDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }));
      const cutoff = new Date(dhakaDate);
      cutoff.setHours(10, 25, 0, 0);

      const diff = cutoff.getTime() - dhakaDate.getTime();
      if (diff > 0) {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeUntilCutoff(`${mins}m ${secs}s left`);
      } else {
        setTimeUntilCutoff('Cutoff Adjudicated');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-card/95 backdrop-blur-md border-b border-border-default px-4 sm:px-6 py-2.5 transition-colors">
      <div className="flex items-center justify-between gap-4 w-full">
        {/* Brand & Workspace Identity */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <img
              src="/assets/logo.png"
              alt="PenaltyCloud"
              className="w-8 h-8 rounded-xl object-cover border border-border-default shadow-xs transition group-hover:scale-105"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-status-success border-2 border-surface-card" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-content-primary">
                PENALTY<span className="text-brand-primary">CLOUD</span>
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider rounded-md bg-brand-subtle text-brand-primary border border-brand-border uppercase">
                v2.4 Live
              </span>
            </div>
            <p className="text-[10px] text-content-muted hidden sm:block">
              Automated Attendance & WhatsApp Adjudication
            </p>
          </div>
        </div>

        {/* Center: Live Asia/Dhaka Clock & 10:25 Cutoff Countdown */}
        <div className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-surface-subtle border border-border-default text-xs shadow-2xs">
          <div className="flex items-center gap-1.5 text-content-secondary">
            <Clock className="w-3.5 h-3.5 text-brand-primary" />
            <span className="text-content-muted font-medium text-[11px]">Dhaka:</span>
            <span className="font-mono font-bold text-content-primary">{dhakaTime}</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-border-active" />
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
            <span className="text-content-muted text-[11px]">10:25 Cutoff:</span>
            <span className="font-mono font-semibold text-brand-primary text-[11px]">{timeUntilCutoff}</span>
          </div>
        </div>

        {/* Right: Actions, Sync, Notification & Profile */}
        <div className="flex items-center gap-2.5">
          {/* Biometric Sync Button */}
          <button
            onClick={onSyncAttendance}
            title="Synchronize Biometric Logs with HRM"
            className="p-2 rounded-xl text-content-secondary hover:text-content-primary hover:bg-surface-subtle border border-border-default transition active:scale-95 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Run Adjudication Button */}
          <button
            onClick={onRunProsecution}
            disabled={isProcessingProsecution}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs tracking-wide text-white bg-brand-primary hover:bg-brand-primaryHover shadow-xs active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isProcessingProsecution ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden sm:inline">Adjudicating...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Adjudication</span>
              </>
            )}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Light / Dark Mode"
            className="p-2 rounded-xl text-content-secondary hover:text-content-primary hover:bg-surface-subtle border border-border-default transition active:scale-95 cursor-pointer"
          >
            {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-content-secondary hover:text-content-primary" />}
          </button>

          {/* Mahbub Alam User Profile Pod */}
          <div
            title="Mahbub Alam (Admin)"
            className="flex items-center gap-2 pl-1 cursor-pointer group"
          >
            <div className="relative">
              <img
                src="/assets/mahbub_alam.jpg"
                alt="Mahbub Alam"
                className="w-8 h-8 rounded-xl object-cover border border-border-default shadow-xs group-hover:scale-105 transition"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-status-success border border-surface-card" />
            </div>
            <div className="hidden lg:block text-left leading-tight">
              <div className="text-xs font-bold text-content-primary group-hover:text-brand-primary transition">
                Mahbub Alam
              </div>
              <div className="text-[10px] text-content-muted">Admin</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
