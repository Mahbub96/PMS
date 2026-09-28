import React, { useState } from 'react';
import { AttendanceRecord, PenaltyRecord, DashboardStats } from '../types/index.js';
import {
  TrendingUp,
  BarChart3,
  Clock,
  DollarSign,
} from 'lucide-react';

interface ExecutiveAnalyticsProps {
  attendance: AttendanceRecord[];
  penalties: PenaltyRecord[];
  stats: DashboardStats;
}

export const ExecutiveAnalytics: React.FC<ExecutiveAnalyticsProps> = ({
  attendance,
  penalties,
  stats,
}) => {
  const [activeMetric, setActiveMetric] = useState<'compliance' | 'infractions'>('compliance');

  // 7-Day Historical Data Simulation aligned with today's state
  const historicalData = [
    { day: 'Mon', date: 'Sep 22', compliance: 92, infractions: 1, fines: 500 },
    { day: 'Tue', date: 'Sep 23', compliance: 100, infractions: 0, fines: 0 },
    { day: 'Wed', date: 'Sep 24', compliance: 85, infractions: 2, fines: 1000 },
    { day: 'Thu', date: 'Sep 25', compliance: 100, infractions: 0, fines: 0 },
    { day: 'Fri', date: 'Sep 26', compliance: 90, infractions: 1, fines: 500 },
    { day: 'Sun', date: 'Sep 27', compliance: 95, infractions: 0, fines: 0 },
    { day: 'Today', date: 'Sep 28', compliance: 60, infractions: 2, fines: 1000 },
  ];

  // Calculate SVG spline points for 7-day trend
  const svgWidth = 520;
  const svgHeight = 140;
  const paddingX = 35;
  const paddingY = 20;

  const points = historicalData.map((d, i) => {
    const x = paddingX + (i * (svgWidth - 2 * paddingX)) / (historicalData.length - 1);
    const val = activeMetric === 'compliance' ? d.compliance : (d.infractions / 3) * 100;
    const y = svgHeight - paddingY - (val / 100) * (svgHeight - 2 * paddingY);
    return { x, y, ...d };
  });

  // Construct smooth SVG path
  const pathD = points.reduce((acc, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = arr[i - 1];
    const cp1x = prev.x + (p.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (p.x - prev.x) / 2;
    const cp2y = p.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  // Morning Timeline Buckets (Leading up to 10:25 AM Cutoff)
  const timelineBuckets = [
    {
      label: '09:30 - 09:45',
      punches: 2, // Mahbub (09:40), Arif (09:43)
      messages: 0,
      breaches: 0,
      highlight: false,
    },
    {
      label: '09:45 - 10:00',
      punches: 3, // Tanzina (09:46), Kamrul (09:49), Farhan (09:55)
      messages: 0,
      breaches: 0,
      highlight: false,
    },
    {
      label: '10:00 - 10:15',
      punches: 0,
      messages: 1, // Mahbub (10:12)
      breaches: 0,
      highlight: false,
    },
    {
      label: '10:15 - 10:25',
      punches: 0,
      messages: 2, // Arif (10:18), Tanzina (10:22)
      breaches: 0,
      highlight: true, // Cutoff window
    },
    {
      label: '10:25+ Cutoff',
      punches: 0,
      messages: 0,
      breaches: 2, // Kamrul, Farhan missed
      highlight: true,
      breachZone: true,
    },
  ];

  // Departmental Breakdown
  const departments = [
    {
      name: 'Engineering',
      total: 3,
      compliant: 2,
      penalized: 1,
      rate: 67,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      name: 'UI/UX Design',
      total: 1,
      compliant: 1,
      penalized: 0,
      rate: 100,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      name: 'QA & Automation',
      total: 1,
      compliant: 0,
      penalized: 1,
      rate: 0,
      color: 'bg-rose-500',
      textColor: 'text-rose-600 dark:text-rose-400',
    },
    {
      name: 'Human Resources',
      total: 1,
      compliant: 0,
      penalized: 0,
      rate: 100,
      isExcused: true,
      color: 'bg-slate-400',
      textColor: 'text-slate-500 dark:text-slate-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 select-none">
      {/* 1. Morning Check-In & WhatsApp Cutoff Activity Histogram (7 cols) */}
      <div className="lg:col-span-7 rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 p-5 flex flex-col justify-between">
        <div>
          {/* Header Row with Micro Telemetry */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border-default">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-brand-subtle text-brand-primary border border-brand-border">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-content-primary">
                  10:25 AM Adjudication Timeline
                </h4>
                <p className="text-[11px] font-mono text-content-muted">
                  Biometric Punches vs WhatsApp Morning Verifications
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[10px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-sky-500" />
                <span className="text-content-secondary">Biometric Punch</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                <span className="text-content-secondary">WhatsApp Done</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
                <span className="text-content-secondary">Infraction</span>
              </div>
            </div>
          </div>

          {/* Histogram Bar Display */}
          <div className="pt-5 pb-2">
            <div className="grid grid-cols-5 gap-3 h-36 items-end relative">
              {/* Vertical 10:25 AM Cutoff Indicator Line */}
              <div className="absolute right-[20%] top-0 bottom-0 w-px border-r-2 border-dashed border-rose-500/60 z-10 pointer-events-none flex flex-col items-center">
                <span className="bg-rose-500 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow-sm -mt-2">
                  10:25 AM CUTOFF
                </span>
              </div>

              {timelineBuckets.map((b, idx) => {
                const totalActivity = b.punches + b.messages + b.breaches;
                const punchHeight = (b.punches / 3) * 100;
                const messageHeight = (b.messages / 3) * 100;
                const breachHeight = (b.breaches / 3) * 100;

                return (
                  <div key={idx} className="flex flex-col items-center h-full justify-end group">
                    {/* Activity Pill Counter on Hover */}
                    <span className="text-[10px] font-mono font-bold text-content-primary mb-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      {totalActivity > 0 ? `${totalActivity} events` : '—'}
                    </span>

                    {/* Stacked Bar Container */}
                    <div className="w-full max-w-[48px] h-24 rounded-lg bg-surface-subtle p-1 flex flex-col justify-end gap-1 border border-border-default group-hover:border-brand-primary/40 transition-all">
                      {b.breaches > 0 && (
                        <div
                          style={{ height: `${Math.max(16, breachHeight)}%` }}
                          className="w-full rounded bg-rose-500 hover:brightness-110 transition-all flex items-center justify-center text-[9px] font-bold text-white font-mono"
                          title={`${b.breaches} Infractions issued`}
                        >
                          {b.breaches}
                        </div>
                      )}
                      {b.messages > 0 && (
                        <div
                          style={{ height: `${Math.max(16, messageHeight)}%` }}
                          className="w-full rounded bg-emerald-500 hover:brightness-110 transition-all flex items-center justify-center text-[9px] font-bold text-white font-mono"
                          title={`${b.messages} WhatsApp Done confirmed`}
                        >
                          {b.messages}
                        </div>
                      )}
                      {b.punches > 0 && (
                        <div
                          style={{ height: `${Math.max(16, punchHeight)}%` }}
                          className="w-full rounded bg-sky-500 hover:brightness-110 transition-all flex items-center justify-center text-[9px] font-bold text-white font-mono"
                          title={`${b.punches} Biometric check-ins`}
                        >
                          {b.punches}
                        </div>
                      )}
                    </div>

                    {/* Time Slot Label */}
                    <span
                      className={`text-[10px] font-mono mt-2 tracking-tight text-center ${
                        b.breachZone ? 'text-rose-500 font-bold' : 'text-content-muted'
                      }`}
                    >
                      {b.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dense Telemetry Strip at Bottom */}
        <div className="mt-4 pt-3 border-t border-border-subtle grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-xl bg-surface-subtle border border-border-subtle">
            <span className="block text-[10px] uppercase font-bold text-content-muted">Avg Punch Time</span>
            <span className="text-xs font-extrabold font-mono text-content-primary">09:46 AM</span>
          </div>
          <div className="p-2 rounded-xl bg-surface-subtle border border-border-subtle">
            <span className="block text-[10px] uppercase font-bold text-content-muted">Avg "Done" Time</span>
            <span className="text-xs font-extrabold font-mono text-emerald-600 dark:text-emerald-400">10:17 AM</span>
          </div>
          <div className="p-2 rounded-xl bg-surface-subtle border border-border-subtle">
            <span className="block text-[10px] uppercase font-bold text-content-muted">Cutoff Breaches</span>
            <span className="text-xs font-extrabold font-mono text-rose-600 dark:text-rose-400">2 Penalized (33%)</span>
          </div>
        </div>
      </div>

      {/* 2. 7-Day Compliance Velocity Curve (5 cols) */}
      <div className="lg:col-span-5 rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 p-5 flex flex-col justify-between">
        <div>
          {/* Header Row with Toggle */}
          <div className="flex items-center justify-between pb-3 border-b border-border-default">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-content-primary">
                  Compliance Velocity
                </h4>
                <p className="text-[11px] font-mono text-content-muted">
                  7-Day Adjudication Trajectory
                </p>
              </div>
            </div>

            {/* Metric Switcher */}
            <div className="flex p-0.5 rounded-lg bg-surface-subtle border border-border-default text-[10px] font-mono">
              <button
                onClick={() => setActiveMetric('compliance')}
                className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                  activeMetric === 'compliance'
                    ? 'bg-brand-primary text-white shadow-2xs'
                    : 'text-content-secondary hover:text-content-primary'
                }`}
              >
                % Rate
              </button>
              <button
                onClick={() => setActiveMetric('infractions')}
                className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                  activeMetric === 'infractions'
                    ? 'bg-rose-500 text-white shadow-2xs'
                    : 'text-content-secondary hover:text-content-primary'
                }`}
              >
                Infractions
              </button>
            </div>
          </div>

          {/* Sparkline Curve Display */}
          <div className="pt-3">
            <div className="flex items-baseline justify-between mb-1">
              <div>
                <span className="text-2xl font-extrabold font-mono text-content-primary">
                  {activeMetric === 'compliance' ? '88.8%' : '6 Fines'}
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 ml-2">
                  +4.2% vs Prev Week
                </span>
              </div>
              <span className="text-[10px] font-mono text-content-muted">Mon — Today</span>
            </div>

            {/* SVG Spline */}
            <div className="w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-28 overflow-visible"
              >
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={activeMetric === 'compliance' ? '#6366f1' : '#f43f5e'}
                      stopOpacity="0.35"
                    />
                    <stop
                      offset="100%"
                      stopColor={activeMetric === 'compliance' ? '#6366f1' : '#f43f5e'}
                      stopOpacity="0.0"
                    />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                <line
                  x1={paddingX}
                  y1={paddingY}
                  x2={svgWidth - paddingX}
                  y2={paddingY}
                  stroke="currentColor"
                  className="text-border-subtle"
                  strokeDasharray="3 3"
                />
                <line
                  x1={paddingX}
                  y1={svgHeight / 2}
                  x2={svgWidth - paddingX}
                  y2={svgHeight / 2}
                  stroke="currentColor"
                  className="text-border-subtle"
                  strokeDasharray="3 3"
                />
                <line
                  x1={paddingX}
                  y1={svgHeight - paddingY}
                  x2={svgWidth - paddingX}
                  y2={svgHeight - paddingY}
                  stroke="currentColor"
                  className="text-border-subtle"
                />

                {/* Shaded Area */}
                <path d={areaD} fill="url(#areaGradient)" />

                {/* Main Stroke Path */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={activeMetric === 'compliance' ? '#6366f1' : '#f43f5e'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                {points.map((p, idx) => (
                  <g key={idx} className="group cursor-pointer">
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="4"
                      className={`${
                        idx === points.length - 1
                          ? 'fill-rose-500 stroke-white stroke-2 animate-pulse'
                          : 'fill-surface-card stroke-brand-primary stroke-2'
                      }`}
                    />
                    {/* Tooltip on hover */}
                    <text
                      x={p.x}
                      y={p.y - 10}
                      textAnchor="middle"
                      className="text-[9px] font-mono font-bold fill-content-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {activeMetric === 'compliance' ? `${p.compliance}%` : `${p.infractions}`}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between px-2 text-[10px] font-mono text-content-muted mt-1">
              {historicalData.map((d, i) => (
                <span
                  key={i}
                  className={i === historicalData.length - 1 ? 'font-bold text-content-primary' : ''}
                >
                  {d.day}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Summary Strip */}
        <div className="mt-3 pt-2.5 border-t border-border-subtle flex items-center justify-between text-[11px] font-mono">
          <span className="text-content-muted">Statutory Enforcement:</span>
          <span className="font-bold text-brand-primary">100% Automated</span>
        </div>
      </div>

      {/* 3. Departmental Risk Matrix & Liquidity Funnel (12 cols) */}
      <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Departmental Progress Cards (7 cols) */}
        <div className="md:col-span-7 rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 p-5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-border-default">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-content-primary">
                Departmental Adjudication Breakdown
              </h4>
            </div>
            <span className="text-[10px] font-mono text-content-muted">4 Operational Units</span>
          </div>

          <div className="space-y-3">
            {departments.map((dept, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-surface-subtle border border-border-subtle">
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-content-primary">{dept.name}</span>
                    <span className="text-[10px] font-mono text-content-muted">
                      ({dept.total} {dept.total === 1 ? 'member' : 'members'})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    {dept.isExcused ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-surface-card text-content-muted border border-border-default">
                        EXCUSED / LEAVE
                      </span>
                    ) : (
                      <span className={`text-xs font-extrabold ${dept.textColor}`}>
                        {dept.rate}% Compliant
                      </span>
                    )}
                  </div>
                </div>

                {/* Visual Bar Track */}
                <div className="w-full h-2 rounded-full bg-surface-card overflow-hidden flex border border-border-subtle">
                  <div
                    style={{ width: `${dept.rate}%` }}
                    className={`h-full ${dept.color} transition-all duration-700`}
                  />
                  {dept.penalized > 0 && (
                    <div
                      style={{ width: `${(dept.penalized / dept.total) * 100}%` }}
                      className="h-full bg-rose-500 transition-all duration-700"
                    />
                  )}
                </div>

                <div className="flex justify-between text-[10px] font-mono text-content-muted mt-1">
                  <span>
                    {dept.compliant} On-Time WhatsApp
                  </span>
                  <span>
                    {dept.penalized > 0 ? `${dept.penalized} Infraction (৳${dept.penalized * 500})` : 'Zero Infractions'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monetary Settlement & Liquidity Stream (5 cols) */}
        <div className="md:col-span-5 rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-border-default">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <DollarSign className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-content-primary">
                  Penalty Liquidity Stream
                </h4>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-status-success/10 text-status-success border border-status-success/20">
                50% Settled
              </span>
            </div>

            {/* Segmented Flow Bar */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-baseline text-xs font-mono">
                <span className="text-content-secondary">Total Assessed:</span>
                <span className="text-base font-extrabold text-content-primary">
                  ৳{stats.totalFinesIssued.toLocaleString()} BDT
                </span>
              </div>

              {/* Multi-Segment Flow Ribbon */}
              <div className="w-full h-3 rounded-full bg-surface-subtle overflow-hidden flex p-0.5 border border-border-default">
                <div
                  style={{ width: '50%' }}
                  className="h-full rounded-l-full bg-emerald-500 transition-all"
                  title="৳500 Paid via bKash"
                />
                <div
                  style={{ width: '50%' }}
                  className="h-full rounded-r-full bg-amber-500 transition-all"
                  title="৳500 Awaiting Payroll Deduction"
                />
              </div>

              <div className="flex justify-between text-[10px] font-mono text-content-muted">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  ৳500 bKash Paid
                </span>
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  ৳500 Payroll Queue
                </span>
              </div>
            </div>

            {/* Settlement Channel Breakdown */}
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-surface-subtle border border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20 text-[10px] font-bold">
                    bKash Merchant
                  </span>
                  <span className="text-content-primary font-bold">Kamrul Islam</span>
                </div>
                <span className="text-status-success font-extrabold">৳500 (Settled)</span>
              </div>

              <div className="p-2.5 rounded-xl bg-surface-subtle border border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-brand-subtle text-brand-primary border border-brand-border text-[10px] font-bold">
                    Payroll Deduction
                  </span>
                  <span className="text-content-primary font-bold">Farhan Ahmed</span>
                </div>
                <span className="text-status-warning font-extrabold">৳500 (Pending)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-[10px] font-mono text-content-muted">
            <span>Audit Ref: STAT-20260928</span>
            <span className="text-content-primary font-bold">Zero Outstanding Disputes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
