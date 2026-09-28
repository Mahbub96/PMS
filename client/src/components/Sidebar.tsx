import React from 'react';
import {
  LayoutDashboard,
  Users,
  AlertOctagon,
  BookOpen,
  MessageSquareCode,
  ShieldCheck,
  ChevronsUpDown,
  Search,
  Sparkles,
  Zap,
  Clock,
  Settings,
  HelpCircle,
  Activity,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingPenaltiesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingPenaltiesCount,
}) => {
  const mainNav = [
    {
      id: 'dashboard',
      label: 'Executive Overview',
      icon: LayoutDashboard,
      shortcut: '⌘1',
      badge: null,
    },
    {
      id: 'attendance',
      label: 'Attendance & Done Feed',
      icon: Users,
      shortcut: '⌘2',
      badge: null,
    },
    {
      id: 'penalties',
      label: 'Infractions Ledger',
      icon: AlertOctagon,
      shortcut: '⌘3',
      badge: pendingPenaltiesCount > 0 ? `${pendingPenaltiesCount} due` : null,
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    },
  ];

  const governanceNav = [
    {
      id: 'constitution',
      label: 'Constitution Rule Book',
      icon: BookOpen,
      shortcut: '⌘4',
      badge: 'PDF',
      badgeColor: 'bg-brand-subtle text-brand-primary border-brand-border',
    },
    {
      id: 'simulator',
      label: 'WhatsApp Test Lab',
      icon: MessageSquareCode,
      shortcut: '⌘5',
      badge: 'Live',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col justify-between border-r border-border-default bg-surface-card p-3.5 sticky top-[53px] h-[calc(100vh-53px)] overflow-y-auto transition-colors select-none">
      <div className="space-y-4">
        {/* Modern Workspace / Organization Switcher */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-subtle hover:bg-surface-hover border border-border-default cursor-pointer transition group">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <img
                src="/assets/logo.png"
                alt="Workspace"
                className="w-8 h-8 rounded-lg object-cover border border-border-default shadow-xs"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-status-success border-2 border-surface-card" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-content-primary truncate flex items-center gap-1.5">
                <span>Office Operations</span>
              </div>
              <div className="text-[10px] text-content-muted font-mono truncate">
                corp-dhaka.asia
              </div>
            </div>
          </div>
          <ChevronsUpDown className="w-4 h-4 text-content-muted group-hover:text-content-secondary shrink-0" />
        </div>

        {/* Quick Search Shortcut Bar */}
        <button
          onClick={() => setActiveTab('penalties')}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-surface-subtle hover:bg-surface-hover border border-border-default text-xs text-content-muted hover:text-content-secondary transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span className="text-[11px]">Quick search...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[9px] font-mono font-semibold rounded bg-surface-card text-content-secondary border border-border-default shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Section 1: Main Platform */}
        <div>
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-content-muted mb-1.5">
            Main Platform
          </p>
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`group relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-brand-subtle text-brand-primary font-semibold shadow-2xs'
                      : 'text-content-secondary hover:text-content-primary hover:bg-surface-hover'
                  }`}
                >
                  {/* Left accent bar on active */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-brand-primary" />
                  )}
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? 'text-brand-primary'
                          : 'text-content-muted group-hover:text-content-primary'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge ? (
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md border ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-content-muted opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.shortcut}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Section 2: Statutory & Governance */}
        <div>
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-content-muted mb-1.5">
            Governance & Compliance
          </p>
          <nav className="space-y-1">
            {governanceNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`group relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-brand-subtle text-brand-primary font-semibold shadow-2xs'
                      : 'text-content-secondary hover:text-content-primary hover:bg-surface-hover'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-brand-primary" />
                  )}
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? 'text-brand-primary'
                          : 'text-content-muted group-hover:text-content-primary'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md border ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Live Cutoff Mini-Widget */}
        <div className="p-3.5 rounded-2xl bg-surface-subtle border border-border-default space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-content-primary">
              <Clock className="w-3.5 h-3.5 text-brand-primary" />
              <span>10:25 Cutoff Rules</span>
            </div>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success" />
            </span>
          </div>
          <p className="text-[11px] text-content-secondary leading-relaxed">
            WhatsApp <code className="text-brand-primary font-mono font-bold">done</code> message required daily before 10:25 AM. Automatic penalty: <strong>৳500</strong>.
          </p>
          <div className="w-full h-1.5 rounded-full bg-surface-active overflow-hidden">
            <div className="h-full bg-brand-primary w-3/4 rounded-full" />
          </div>
        </div>
      </div>

      {/* Modern Profile & Infrastructure Footer */}
      <div className="pt-3.5 border-t border-border-default space-y-2.5 mt-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src="/assets/mahbub_alam.jpg"
                alt="Mahbub Alam"
                className="w-9 h-9 rounded-xl object-cover border border-border-default shadow-xs"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-status-success border-2 border-surface-card" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-content-primary truncate">
                Mahbub Alam
              </div>
              <div className="text-[10px] text-content-muted truncate">
                Lead Architect
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('constitution')}
            className="p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-surface-hover transition cursor-pointer shrink-0"
            title="Governance Handbook"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between px-1 text-[10px] text-content-muted font-mono">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-status-success" />
            <span>DB & WS Live</span>
          </span>
          <span className="text-content-muted">v2.4.2</span>
        </div>
      </div>
    </aside>
  );
};
