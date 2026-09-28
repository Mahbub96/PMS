import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  RotateCw,
  Sun,
  Moon,
  Sparkles,
  Zap,
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
        setTimeUntilCutoff(`${mins}m ${secs}s until cutoff`);
      } else {
        setTimeUntilCutoff('10:25 Cutoff Adjudicated');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080c14]/90 backdrop-blur-md border-b border-white/[0.08] px-4 lg:px-8 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <img
              src="/assets/logo.jpg"
              alt="Penalty Management Cloud"
              className="w-9 h-9 rounded-xl object-cover border border-white/20 shadow-md transition group-hover:scale-105"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                PENALTY<span className="text-cyan-400">CLOUD</span>
              </span>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider rounded-md bg-indigo-500/20 text-cyan-300 border border-indigo-500/30 uppercase">
                v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Automated Attendance & WhatsApp Adjudication
            </p>
          </div>
        </div>

        {/* Center: Live Clock & Cutoff Tracker */}
        <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Dhaka:</span>
            <span className="font-mono font-bold text-white">{dhakaTime}</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-indigo-400 font-mono text-[11px]">{timeUntilCutoff}</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Sync */}
          <button
            onClick={onSyncAttendance}
            title="Sync Biometrics with HRM"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] border border-white/[0.08] transition active:scale-95"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Run Adjudication Button */}
          <button
            onClick={onRunProsecution}
            disabled={isProcessingProsecution}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs tracking-wide text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-indigo-300 hover:from-cyan-300 hover:to-indigo-200 shadow-md shadow-cyan-500/20 active:scale-95 disabled:opacity-50 transition-all"
          >
            {isProcessingProsecution ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Adjudicating...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Run Adjudication</span>
              </>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Theme"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] border border-white/[0.08] transition"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Admin Avatar */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] cursor-pointer">
            <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-xs font-bold text-white font-mono">
              MR
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
