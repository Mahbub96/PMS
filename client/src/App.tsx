import React, { useState, useEffect } from 'react';
import {
  ConstitutionRule,
  AttendanceRecord,
  PenaltyRecord,
  DashboardStats,
  ProsecutionResult,
  PaymentMethod,
} from './types/index.js';
import { api } from './services/api.js';
import { getSocket } from './services/socket.js';
import { Navbar } from './components/Navbar.js';
import { Sidebar } from './components/Sidebar.js';
import { HeroBanner } from './components/HeroBanner.js';
import { MetricCard } from './components/MetricCard.js';
import { AttendanceTable } from './components/AttendanceTable.js';
import { PenaltyTable } from './components/PenaltyTable.js';
import { ConstitutionViewer } from './components/ConstitutionViewer.js';
import { WhatsAppSimulator } from './components/WhatsAppSimulator.js';
import { PaymentModal } from './components/PaymentModal.js';
import { DisputeModal } from './components/DisputeModal.js';
import { ProsecutionModal } from './components/ProsecutionModal.js';
import {
  AlertOctagon,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeTab, setActiveTabState] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return ['dashboard', 'attendance', 'penalties', 'constitution', 'simulator'].includes(hash)
      ? hash
      : 'dashboard';
  });

  const setActiveTab = (tab: string) => {
    window.location.hash = tab;
    setActiveTabState(tab);
  };

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['dashboard', 'attendance', 'penalties', 'constitution', 'simulator'].includes(hash)) {
        setActiveTabState(hash);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Core Data State
  const [stats, setStats] = useState<DashboardStats>({
    totalPenalties: 2,
    totalFinesIssued: 1000,
    totalCollected: 500,
    totalPending: 500,
    collectionRate: 50,
    statusBreakdown: { PENDING: 1, PAID: 1, DISPUTED: 0, WAIVED: 0 },
    attendanceOverview: { totalLogged: 6, totalPresent: 5, totalDone: 3, totalPenalized: 2 },
  });

  const [penalties, setPenalties] = useState<PenaltyRecord[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [constitutionRules, setConstitutionRules] = useState<ConstitutionRule[]>([]);

  // Modals & Action States
  const [selectedPenaltyForPayment, setSelectedPenaltyForPayment] = useState<PenaltyRecord | null>(null);
  const [selectedPenaltyForDispute, setSelectedPenaltyForDispute] = useState<PenaltyRecord | null>(null);
  const [prosecutionResult, setProsecutionResult] = useState<ProsecutionResult | null>(null);
  const [isProsecuting, setIsProsecuting] = useState<boolean>(false);
  const [isProsecutionModalOpen, setIsProsecutionModalOpen] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [isSyncingAttendance, setIsSyncingAttendance] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Sync Dark Mode class with <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Initial Data Fetch
  const loadAllData = async () => {
    try {
      const [s, p, a, c] = await Promise.all([
        api.getDashboardStats(),
        api.getPenalties(),
        api.getAttendance(),
        api.getConstitution(),
      ]);
      setStats(s);
      setPenalties(p);
      setAttendance(a);
      setConstitutionRules(c);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  useEffect(() => {
    loadAllData();

    // Listen to real-time WebSockets
    const socket = getSocket();
    socket.on('PENALTIES_UPDATED', () => {
      loadAllData();
      showToast('Live update received: Penalties updated in real-time!', 'info');
    });

    socket.on('PROSECUTION_RUN_COMPLETED', (data: ProsecutionResult) => {
      setProsecutionResult(data);
      loadAllData();
      showToast(`Prosecution executed: ${data.totalPenalized} infractions adjudicated`, 'info');
    });

    return () => {
      socket.off('PENALTIES_UPDATED');
      socket.off('PROSECUTION_RUN_COMPLETED');
    };
  }, []);

  // Handlers
  const handleRunProsecution = async () => {
    setIsProsecuting(true);
    setIsProsecutionModalOpen(true);
    try {
      const result = await api.runProsecution();
      setProsecutionResult(result);
      await loadAllData();
      showToast('10:25 AM Adjudication completed successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Prosecution failed', 'error');
    } finally {
      setIsProsecuting(false);
    }
  };

  const handleSyncAttendance = async () => {
    setIsSyncingAttendance(true);
    try {
      await api.syncAttendance();
      await loadAllData();
      showToast('Biometric attendance synchronized with HRM', 'success');
    } catch (err: any) {
      showToast(err.message || 'Sync failed', 'error');
    } finally {
      setIsSyncingAttendance(false);
    }
  };

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      await api.exportConstitutionPdf();
      showToast('Constitution Rule Book exported as PDF', 'success');
    } catch (err: any) {
      showToast(err.message || 'Export failed', 'error');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleConfirmPayment = async (
    id: string,
    method: PaymentMethod,
    ref: string,
    notes: string
  ) => {
    await api.updatePenaltyStatus(id, 'PAID', method, ref, notes);
    await loadAllData();
    showToast('Infraction payment recorded successfully!', 'success');
  };

  const handleSubmitDispute = async (id: string, reason: string) => {
    await api.submitDispute(id, reason);
    await loadAllData();
    showToast('Appeal registered and forwarded to committee', 'info');
  };

  const handleWaivePenalty = async (id: string) => {
    await api.updatePenaltyStatus(id, 'WAIVED', undefined, undefined, 'Waived by Compliance Administrator');
    await loadAllData();
    showToast('Penalty waived by administrator', 'info');
  };

  const pendingCount = penalties.filter((p) => p.status === 'PENDING').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl glass-panel border border-indigo-500/30 text-xs font-semibold shadow-2xl text-slate-900 dark:text-white animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onRunProsecution={handleRunProsecution}
        onSyncAttendance={handleSyncAttendance}
        isProcessingProsecution={isProsecuting}
        activeTab={activeTab}
      />

      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingPenaltiesCount={pendingCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Hero Banner */}
              <HeroBanner
                onRunProsecution={handleRunProsecution}
                onOpenConstitution={() => setActiveTab('constitution')}
                totalCompliant={stats.attendanceOverview.totalDone}
                totalPresent={stats.attendanceOverview.totalPresent}
                totalPenalized={stats.attendanceOverview.totalPenalized}
              />

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Total Infractions"
                  value={stats.totalPenalties}
                  subtitle="Statutory penalties assessed"
                  icon={AlertOctagon}
                  trend={{ value: `${stats.statusBreakdown.PENDING} pending`, isPositive: false }}
                  accentColor="rose"
                />

                <MetricCard
                  title="Fines Assessed"
                  value={`৳${stats.totalFinesIssued.toLocaleString()}`}
                  subtitle="Total value of penalties"
                  icon={DollarSign}
                  trend={{ value: `৳${stats.totalCollected.toLocaleString()} paid`, isPositive: true }}
                  accentColor="indigo"
                />

                <MetricCard
                  title="Outstanding Dues"
                  value={`৳${stats.totalPending.toLocaleString()}`}
                  subtitle="Awaiting payroll/bkash settlement"
                  icon={Clock}
                  accentColor="amber"
                  progress={stats.collectionRate}
                />

                <MetricCard
                  title="Today's Attendance"
                  value={`${stats.attendanceOverview.totalPresent}/${stats.attendanceOverview.totalLogged}`}
                  subtitle={`${stats.attendanceOverview.totalDone} sent morning "done"`}
                  icon={Users}
                  trend={{
                    value: `${stats.attendanceOverview.totalPenalized} fined`,
                    isPositive: stats.attendanceOverview.totalPenalized === 0,
                  }}
                  accentColor="cyan"
                />
              </div>

              {/* Attendance Table Preview */}
              <AttendanceTable
                records={attendance}
                onSync={handleSyncAttendance}
                isLoading={isSyncingAttendance}
              />

              {/* Penalties Ledger Preview */}
              <PenaltyTable
                penalties={penalties}
                onOpenPaymentModal={(p) => setSelectedPenaltyForPayment(p)}
                onOpenDisputeModal={(p) => setSelectedPenaltyForDispute(p)}
                onWaivePenalty={handleWaivePenalty}
              />
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div className="space-y-6 animate-fadeIn">
              <AttendanceTable
                records={attendance}
                onSync={handleSyncAttendance}
                isLoading={isSyncingAttendance}
              />
            </div>
          )}

          {/* Penalties Tab */}
          {activeTab === 'penalties' && (
            <div className="space-y-6 animate-fadeIn">
              <PenaltyTable
                penalties={penalties}
                onOpenPaymentModal={(p) => setSelectedPenaltyForPayment(p)}
                onOpenDisputeModal={(p) => setSelectedPenaltyForDispute(p)}
                onWaivePenalty={handleWaivePenalty}
              />
            </div>
          )}

          {/* Constitution Tab */}
          {activeTab === 'constitution' && (
            <div className="space-y-6 animate-fadeIn">
              <ConstitutionViewer
                rules={constitutionRules}
                onExportPdf={handleExportPdf}
                isExportingPdf={isExportingPdf}
              />
            </div>
          )}

          {/* Simulator Tab */}
          {activeTab === 'simulator' && (
            <div className="space-y-6 animate-fadeIn">
              <WhatsAppSimulator onRunAdjudication={handleRunProsecution} />
            </div>
          )}
        </main>
      </div>

      {/* Payment Settlement Modal */}
      <PaymentModal
        penalty={selectedPenaltyForPayment}
        onClose={() => setSelectedPenaltyForPayment(null)}
        onConfirmPayment={handleConfirmPayment}
      />

      {/* Dispute / Appeal Modal */}
      <DisputeModal
        penalty={selectedPenaltyForDispute}
        onClose={() => setSelectedPenaltyForDispute(null)}
        onSubmitDispute={handleSubmitDispute}
      />

      {/* Prosecution Execution Modal */}
      <ProsecutionModal
        isOpen={isProsecutionModalOpen}
        onClose={() => setIsProsecutionModalOpen(false)}
        result={prosecutionResult}
        isRunning={isProsecuting}
        onRunAgain={handleRunProsecution}
      />
    </div>
  );
}

export default App;
