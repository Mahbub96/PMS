import React, { useState } from 'react';
import { ConstitutionRule, RuleSeverity } from '../types/index.js';
import {
  BookOpen,
  Download,
  Clock,
  Search,
  RotateCw,
  ShieldCheck,
  PartyPopper,
  Pizza,
  Coffee,
  Sparkles,
  Table as TableIcon,
  LayoutGrid,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  ExternalLink,
  Users,
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
  const [viewMode, setViewMode] = useState<'grid' | 'table'>(() => {
    return new URLSearchParams(window.location.search).get('view') === 'table' ? 'table' : 'grid';
  });
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const categories = ['ALL', ...Array.from(new Set(rules.map((r) => r.category)))];

  const filteredRules = rules.filter((r) => {
    const matchesCategory = selectedCategory === 'ALL' || r.category === selectedCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.articleNumber.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getSeverityBadge = (sev: RuleSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-status-danger/15 text-status-danger border border-status-danger/30 uppercase tracking-wide">
            Critical Severity
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-status-warning/15 text-status-warning border border-status-warning/30 uppercase tracking-wide">
            High Severity
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-status-warning border border-status-warning/20 uppercase tracking-wide">
            Medium Severity
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-status-success/15 text-status-success border border-status-success/30 uppercase tracking-wide">
            Low Severity
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Official Header Command Hub */}
      <div className="p-5 sm:p-6 rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-subtle text-brand-primary border border-brand-border">
              <BookOpen className="w-3.5 h-3.5" />
              Cloud & DevSecOps Department
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-status-warning/15 text-status-warning border border-status-warning/30">
              <PartyPopper className="w-3.5 h-3.5" />
              English Fluency Daily Habit Charter
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-surface-subtle text-content-muted border border-border-default">
              Self-Governed by Team Members (Not HR)
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-content-primary tracking-tight">
            Department Constitution & English Fluency Charter
          </h2>

          <p className="text-xs text-content-muted leading-relaxed">
            Internal governance code created and ratified by Cloud & DevSecOps colleagues. Established to build
            daily morning English conversational fluency. Fines collected under Article 1.1 are pooled 100% into the{' '}
            <strong className="text-status-warning font-semibold">Party Vault</strong> for Friday feasts, pizzas, and snacks.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-content-muted font-mono pt-1">
            <span className="flex items-center gap-1 text-content-secondary">
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              10:25:00 AM Strict Asia/Dhaka Adjudication
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-content-secondary">
              <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
              Ratified by Mahbub Alam & Department Peers
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-content-secondary">
              <Pizza className="w-3.5 h-3.5 text-status-warning" />
              100% Funds Team Food & Outings
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={onExportPdf}
            disabled={isExportingPdf}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-primary hover:bg-brand-primaryHover shadow-sm active:scale-95 disabled:opacity-50 transition cursor-pointer"
            title="Download Formal Department Rulebook as PDF"
          >
            {isExportingPdf ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export Rule Book (PDF)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Telemetry KPI Pods */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pod 1: Total Articles */}
        <div className="p-4 rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 flex items-center justify-between transition-colors">
          <div>
            <div className="text-[11px] font-bold text-content-muted uppercase tracking-wider">
              Ratified Articles
            </div>
            <div className="text-2xl font-black text-content-primary mt-1 font-mono tracking-tight">
              {rules.length} Rules
            </div>
            <p className="text-[11px] text-content-muted mt-0.5">
              Primary Habit: Article 1.1
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-brand-subtle text-brand-primary border border-brand-border">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        {/* Pod 2: Cutoff Time */}
        <div className="p-4 rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 flex items-center justify-between transition-colors">
          <div>
            <div className="text-[11px] font-bold text-content-muted uppercase tracking-wider">
              Adjudication Cutoff
            </div>
            <div className="text-2xl font-black text-sky-500 mt-1 font-mono tracking-tight">
              10:25 AM
            </div>
            <p className="text-[11px] text-content-muted mt-0.5">
              Asia/Dhaka Automated Run
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-500 border border-sky-500/20">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Pod 3: Fine Rule */}
        <div className="p-4 rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 flex items-center justify-between transition-colors">
          <div>
            <div className="text-[11px] font-bold text-content-muted uppercase tracking-wider">
              Fluency Fine Standard
            </div>
            <div className="text-2xl font-black text-status-warning mt-1 font-mono tracking-tight">
              ৳500 BDT
            </div>
            <p className="text-[11px] text-status-warning mt-0.5 font-medium">
              100% Pooled for Friday Feasts 🍕
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-status-warning/15 text-status-warning border border-status-warning/30">
            <PartyPopper className="w-5 h-5" />
          </div>
        </div>

        {/* Pod 4: Peer Consensus */}
        <div className="p-4 rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 flex items-center justify-between transition-colors">
          <div>
            <div className="text-[11px] font-bold text-content-muted uppercase tracking-wider">
              Peer Governance
            </div>
            <div className="text-2xl font-black text-status-success mt-1 font-mono tracking-tight">
              100% Peer-Led
            </div>
            <p className="text-[11px] text-content-muted mt-0.5">
              Zero HR / Management Intrusion
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-status-success/15 text-status-success border border-status-success/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Main Split Section: Articles View (8 cols) + Sidecar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (8 cols): Articles Catalog */}
        <div className="lg:col-span-8 rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 overflow-hidden transition-colors flex flex-col justify-between">
          <div>
            {/* Toolbar */}
            <div className="p-4 sm:p-5 border-b border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-content-primary tracking-tight">
                  Charter Articles & Statutory Guidelines
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-subtle text-brand-primary border border-brand-border">
                  {filteredRules.length} Active
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* View Switcher Toggle */}
                <div className="flex items-center p-0.5 rounded-xl bg-surface-subtle border border-border-default">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-surface-card text-brand-primary shadow-2xs font-bold'
                        : 'text-content-muted hover:text-content-primary'
                    }`}
                    title="Interactive Cards Grid"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                      viewMode === 'table'
                        ? 'bg-surface-card text-brand-primary shadow-2xs font-bold'
                        : 'text-content-muted hover:text-content-primary'
                    }`}
                    title="Dense Matrix Table"
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative min-w-[160px] sm:min-w-[200px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search articles, keywords..."
                    className="w-full pl-8 pr-3 py-1 rounded-xl text-xs bg-surface-subtle border border-border-default text-content-primary placeholder:text-content-muted focus:outline-none focus:border-brand-primary transition"
                  />
                </div>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="px-4 py-2 bg-surface-subtle/50 border-b border-border-subtle flex flex-wrap items-center gap-1.5 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-surface-card text-brand-primary font-bold shadow-2xs'
                      : 'text-content-secondary hover:text-content-primary'
                  }`}
                >
                  {cat === 'ALL' ? `All Articles (${rules.length})` : cat}
                </button>
              ))}
            </div>

            {/* View Mode 1: Interactive Cards Grid */}
            {viewMode === 'grid' ? (
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRules.map((rule) => {
                  const isPrimaryHabit = rule.articleNumber === '1.1';
                  const isExpanded = expandedArticle === rule.articleNumber;

                  return (
                    <div
                      key={rule.articleNumber}
                      className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between gap-3 ${
                        isPrimaryHabit
                          ? 'bg-brand-subtle/25 border-brand-border/80 shadow-xs ring-1 ring-brand-border/40'
                          : 'bg-surface-subtle/30 border-border-default hover:border-brand-border hover:shadow-xs'
                      }`}
                    >
                      <div>
                        {/* Article Header */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md text-xs font-mono font-black bg-brand-subtle text-brand-primary border border-brand-border">
                              Art. {rule.articleNumber}
                            </span>
                            <span className="text-[10px] text-content-muted font-medium truncate max-w-[120px]">
                              {rule.category}
                            </span>
                          </div>
                          {getSeverityBadge(rule.severity)}
                        </div>

                        {/* Title */}
                        <h4 className="text-sm font-bold text-content-primary leading-snug mb-1.5">
                          {rule.title}
                        </h4>

                        {/* Description */}
                        <p
                          className={`text-xs text-content-secondary leading-relaxed transition-all ${
                            isExpanded ? '' : 'line-clamp-2'
                          }`}
                        >
                          {rule.description}
                        </p>

                        {rule.description.length > 90 && (
                          <button
                            onClick={() => setExpandedArticle(isExpanded ? null : rule.articleNumber)}
                            className="text-[10px] font-mono text-brand-primary hover:underline mt-1 cursor-pointer"
                          >
                            {isExpanded ? 'Show less' : 'Read full text'}
                          </button>
                        )}
                      </div>

                      {/* Footer Metadata */}
                      <div className="pt-2.5 border-t border-border-subtle flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-[11px] text-content-muted font-mono">
                          <Clock className="w-3 h-3 text-sky-500" />
                          <span>Grace: {rule.gracePeriodMinutes}m</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-extrabold text-sm text-status-success">
                            ৳{rule.fineAmount.toLocaleString()} BDT
                          </span>
                          {isPrimaryHabit && (
                            <span className="text-[9px] font-mono font-bold text-status-warning bg-status-warning/15 px-1.5 py-0.2 rounded border border-status-warning/30">
                              🍕 Party Vault
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* View Mode 2: Dense Matrix Table */
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-surface-subtle text-[11px] font-bold uppercase tracking-wider text-content-muted border-b border-border-default whitespace-nowrap">
                      <th className="py-2.5 px-3 w-[15%]">Article</th>
                      <th className="py-2.5 px-3 w-[22%]">Category</th>
                      <th className="py-2.5 px-3 w-[33%]">Title & Intent</th>
                      <th className="py-2.5 px-2.5 w-[15%]">Grace</th>
                      <th className="py-2.5 px-3 w-[15%] text-right">Fine Pool</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {filteredRules.map((rule) => {
                      const isPrimary = rule.articleNumber === '1.1';
                      return (
                        <tr
                          key={rule.articleNumber}
                          className="hover:bg-surface-hover/70 transition-colors h-14"
                        >
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded text-xs font-mono font-black bg-brand-subtle text-brand-primary border border-brand-border">
                              Art. {rule.articleNumber}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap text-content-muted text-[11px]">
                            {rule.category}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <div className="font-bold text-content-primary text-xs truncate max-w-[240px]">
                              {rule.title}
                            </div>
                            <div className="text-[10px] text-content-muted truncate max-w-[240px]">
                              {rule.description}
                            </div>
                          </td>
                          <td className="py-2.5 px-2.5 whitespace-nowrap font-mono text-content-muted text-[11px]">
                            {rule.gracePeriodMinutes} mins
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono">
                            <span className="font-extrabold text-status-success text-xs">
                              ৳{rule.fineAmount.toLocaleString()}
                            </span>
                            {isPrimary && (
                              <span className="ml-1 text-[9px] text-status-warning font-bold">🍕</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer Metadata Banner */}
          <div className="p-3 sm:px-5 bg-surface-subtle/60 border-t border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-content-muted font-mono">
            <div>
              Consensus Document: <strong className="text-content-primary">Article 1.1 through 3.2</strong> • Shift: Core 09:00 - 18:00
            </div>
            <div className="flex items-center gap-1 text-content-secondary">
              <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
              <span>Ratified by Lead Architect Mahbub Alam & Colleagues</span>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Sidecar Panels */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: 3D Holographic Banner */}
          <div className="rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 overflow-hidden transition-colors">
            <div className="relative aspect-16/9 w-full bg-slate-950 overflow-hidden">
              <img
                src="/assets/charter_banner.jpg"
                alt="Cloud & DevSecOps Digital Governance Rulebook"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    Autonomous Peer Governance
                  </div>
                  <h4 className="text-sm font-extrabold text-white leading-tight">
                    The English Fluency & Feast Charter
                  </h4>
                </div>
              </div>
            </div>
            <div className="p-4 text-xs text-content-secondary leading-relaxed border-t border-border-subtle">
              Established by our Cloud & DevSecOps engineers to build daily English confidence while enjoying Friday meals together.
            </div>
          </div>

          {/* Card 2: The "Fluency Feast" Philosophy */}
          <div className="rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 p-5 space-y-3.5 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-status-warning/15 text-status-warning border border-status-warning/30">
                  <Pizza className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-content-primary tracking-tight">
                    The "Fluency Feast" Philosophy
                  </h4>
                  <p className="text-[11px] text-content-muted">Why Article 1.1 Exists</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-status-warning bg-status-warning/10 px-2 py-0.5 rounded-full border border-status-warning/20">
                🍕 Fun Habit
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle text-xs text-content-secondary leading-relaxed space-y-2">
              <p>
                Morning WhatsApp updates were previously inconsistent. Instead of corporate memos, we established a friendly rule:
              </p>
              <div className="p-2 rounded-lg bg-surface-card border border-border-subtle font-mono text-[11px] text-brand-primary font-semibold">
                "Message 'done' in English before 10:25 AM. If you miss, you fund the team's Friday snacks (৳500)!"
              </div>
              <p className="text-[11px] text-content-muted">
                Zero management involvement. 100% peer accountability and team bonding.
              </p>
            </div>
          </div>

          {/* Card 3: Feast Milestones Funded by Article 1.1 */}
          <div className="rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 p-5 space-y-3 transition-colors">
            <h4 className="text-xs font-bold text-content-primary flex items-center gap-1.5">
              <PartyPopper className="w-3.5 h-3.5 text-status-warning" />
              Party Vault Treat Milestones
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-subtle/60 border border-border-subtle">
                <div className="flex items-center gap-2">
                  <Coffee className="w-3.5 h-3.5 text-status-success" />
                  <span className="text-content-secondary font-medium">Afternoon Tea & Singaras</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-status-success bg-status-success/15 px-1.5 py-0.2 rounded border border-status-success/30">
                  ৳500 Tier
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-status-warning/10 border border-status-warning/20">
                <div className="flex items-center gap-2">
                  <Pizza className="w-3.5 h-3.5 text-status-warning" />
                  <span className="text-content-primary font-bold">Deep Dish Pizza & Cold Drinks</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-status-warning bg-status-warning/20 px-1.5 py-0.2 rounded">
                  ৳1,500 Tier
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-subtle/60 border border-border-subtle opacity-75">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-content-muted" />
                  <span className="text-content-muted">Department Buffet & Dinner</span>
                </div>
                <span className="text-[10px] font-mono text-content-muted">
                  ৳3,000 Tier
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Signatory Peer Consensus */}
          <div className="rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 p-5 space-y-3 transition-colors">
            <h4 className="text-xs font-bold text-content-primary flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-brand-primary" />
              Signatory Peers & Department Leads
            </h4>
            <div className="space-y-1.5 text-[11px] font-mono text-content-secondary">
              <div className="flex items-center justify-between">
                <span>Mahbub Alam</span>
                <span className="text-brand-primary font-bold">Lead Architect ✍️</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Arif Hossain</span>
                <span className="text-content-muted">DevOps Engineering</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tanzina Akhter</span>
                <span className="text-content-muted">UI/UX Design</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Kamrul Islam</span>
                <span className="text-content-muted">QA & Automation</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Sadia Jahan</span>
                <span className="text-content-muted">Talent & People</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Farhan Ahmed</span>
                <span className="text-content-muted">Cloud Engineering</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
