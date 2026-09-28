import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accentColor: 'indigo' | 'cyan' | 'rose' | 'amber' | 'emerald';
  progress?: number;
}

const colorMap = {
  indigo: {
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    text: 'text-indigo-400',
    bar: 'bg-indigo-500',
    glow: 'from-indigo-500/10',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    text: 'text-cyan-400',
    bar: 'bg-cyan-500',
    glow: 'from-cyan-500/10',
  },
  rose: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    text: 'text-rose-400',
    bar: 'bg-rose-500',
    glow: 'from-rose-500/10',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    bar: 'bg-amber-500',
    glow: 'from-amber-500/10',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    bar: 'bg-emerald-500',
    glow: 'from-emerald-500/10',
  },
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor,
  progress,
}) => {
  const c = colorMap[accentColor];

  return (
    <div className="relative group overflow-hidden rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/[0.15] p-5 transition-all duration-200">
      {/* Top subtle glow */}
      <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-${accentColor}-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`p-2 rounded-xl ${c.bg} border ${c.border} ${c.text}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-2.5 mb-1.5">
        <span className="text-2xl lg:text-3xl font-extrabold font-mono text-white tracking-tight">
          {value}
        </span>
        {trend && (
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              trend.isPositive
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-400 leading-tight">
          {subtitle}
        </p>
      )}

      {typeof progress === 'number' && (
        <div className="mt-3.5 pt-2 border-t border-white/[0.05]">
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full ${c.bar} transition-all duration-500`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-1">
            <span>Recovery Rate</span>
            <span className="text-slate-300 font-semibold">{progress}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
