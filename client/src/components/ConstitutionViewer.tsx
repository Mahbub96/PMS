import React, { useState } from 'react';
import { ConstitutionRule, RuleSeverity } from '../types/index.js';
import {
  BookOpen,
  Download,
  ShieldAlert,
  Clock,
  CheckCircle,
  FileText,
  Search,
  AlertTriangle,
  RotateCw,
} from 'lucide-react';

interface ConstitutionViewerProps {
  rules: ConstitutionRule[];
  onExportPdf: () => Promise<void>;
  isExportingPdf: boolean;
}

export const ConstitutionViewer: React.FC<ConstitutionViewerProps> = ({
  rules,
  onExportPdf,
  isExportingPdf,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const categories = ['ALL', ...Array.from(new Set(rules.map((r) => r.category)))];

  const filteredRules = rules.filter((r) => {
    const matchesCategory = selectedCategory === 'ALL' || r.category === selectedCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.articleNumber.includes(search);
    return matchesCategory && matchesSearch;
  });

  const getSeverityBadge = (sev: RuleSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 uppercase tracking-wide">
            Critical Severity
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wide">
            High Severity
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 uppercase tracking-wide">
            Medium Severity
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-wide">
            Low Severity
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Official Header Banner */}
      <div className="rounded-3xl glass-panel p-6 md:p-8 border border-slate-200/80 dark:border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-cyan-400 text-xs font-semibold border border-indigo-500/20">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Official Statutory Code of Conduct</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Company Constitution & Disciplinary Rule Book
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Approved by HR Compliance & Executive Management. All employees are legally bound by these articles.
              Penalties are automatically adjudicated daily at <strong>10:25 AM Asia/Dhaka</strong> through biometric and WhatsApp monitoring.
            </p>
          </div>

          {/* Export PDF Button */}
          <div className="shrink-0">
            <button
              onClick={onExportPdf}
              disabled={isExportingPdf}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50 transition-all"
            >
              {isExportingPdf ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Export Rule Book (PDF)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat === 'ALL' ? 'All Articles' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search constitution..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRules.map((rule) => (
          <div
            key={rule.articleNumber}
            className="rounded-2xl glass-panel p-5 border border-slate-200/80 dark:border-white/10 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20">
                    Art. {rule.articleNumber}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    {rule.category}
                  </span>
                </div>
                {getSeverityBadge(rule.severity)}
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                {rule.title}
              </h4>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                {rule.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Grace: <strong>{rule.gracePeriodMinutes} mins</strong>
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-[11px] text-slate-400 font-medium">Fine:</span>
                <span className="font-mono font-extrabold text-base text-emerald-600 dark:text-emerald-400">
                  ৳{rule.fineAmount.toLocaleString()} BDT
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
