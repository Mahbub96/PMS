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
  progressLabel?: string;
}

const colorMap = {
  indigo: {
    iconBg: 'bg-brand-subtle text-brand-primary border border-brand-border',
    bar: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
  },
  cyan: {
    iconBg: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/25',
    bar: 'bg-gradient-to-r from-cyan-500 to-sky-500',
  },
  rose: {
    iconBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25',
    bar: 'bg-gradient-to-r from-rose-500 to-red-500',
  },
  amber: {
    iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25',
    bar: 'bg-gradient-to-r from-amber-400 to-orange-500',
  },
  emerald: {
    iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25',
    bar: 'bg-gradient-to-r from-emerald-400 to-teal-500',
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
  progressLabel = 'Recovery Rate',
}) => {
  const c = colorMap[accentColor];

  return (
    <div className="relative group overflow-hidden rounded-2xl bg-surface-card hover:bg-surface-hover/70 border border-border-default hover:border-border-active shadow-2xs hover:shadow-xs transition-all duration-200 p-5 flex flex-col justify-between dark:shadow-md dark:shadow-black/20">
      <div>
        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-content-muted">
            {title}
          </span>
          <div className={`p-2 rounded-xl shrink-0 transition-transform group-hover:scale-105 ${c.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        {/* Primary Value & Context Badge */}
        <div className="flex items-baseline gap-2.5 mb-1">
          <span className="text-2xl lg:text-3xl font-extrabold font-mono text-content-primary tracking-tight">
            {value}
          </span>
          {trend && (
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                trend.isPositive
                  ? 'bg-status-success/10 text-status-success border-status-success/20'
                  : 'bg-status-danger/10 text-status-danger border-status-danger/20'
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="text-xs text-content-secondary leading-snug">
            {subtitle}
          </p>
        )}
      </div>

      {/* Optional Analytical Progress Bar */}
      {typeof progress === 'number' && (
        <div className="mt-3.5 pt-2.5 border-t border-border-subtle">
          <div className="w-full h-1.5 rounded-full bg-surface-active overflow-hidden">
            <div
              className={`h-full rounded-full ${c.bar} transition-all duration-700 ease-out`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-content-muted font-mono mt-1.5">
            <span>{progressLabel}</span>
            <span className="text-content-primary font-bold">{progress}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
