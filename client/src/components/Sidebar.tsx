import React from 'react';
import {
  LayoutDashboard,
  Users,
  AlertOctagon,
  BookOpen,
  MessageSquareCode,
  ShieldCheck,
  Zap,
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
  const navItems = [
    {
      id: 'dashboard',
      label: 'Executive Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'attendance',
      label: 'Attendance & Done Feed',
      icon: Users,
      badge: null,
    },
    {
      id: 'penalties',
      label: 'Penalties & Infractions',
      icon: AlertOctagon,
      badge: pendingPenaltiesCount > 0 ? `${pendingPenaltiesCount} due` : null,
      badgeColor: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    },
    {
      id: 'constitution',
      label: 'Constitution Rule Book',
      icon: BookOpen,
      badge: 'PDF',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    },
    {
      id: 'simulator',
      label: 'WhatsApp Test Lab',
      icon: MessageSquareCode,
      badge: 'Test',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col justify-between border-r border-white/[0.08] bg-[#090d16] p-4 min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Governance Console
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Clean Article 1.1 Card */}
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Article 1.1 Enforcer</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Attendance present without morning WhatsApp <code className="text-cyan-400">done</code> before 10:25 AM triggers an automatic <strong>৳500</strong> penalty.
          </p>
        </div>
      </div>

      {/* System Status Footer */}
      <div className="pt-4 border-t border-white/[0.06] text-[11px] text-slate-400 flex items-center justify-between font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>MongoDB Live</span>
        </div>
        <span className="text-[10px] text-slate-400">REST + WS</span>
      </div>
    </aside>
  );
};
