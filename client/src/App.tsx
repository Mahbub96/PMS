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
import { Footer } from './components/Footer.js';
import { HeroBanner } from './components/HeroBanner.js';
import { MetricCard } from './components/MetricCard.js';
import { ExecutiveAnalytics } from './components/ExecutiveAnalytics.js';
import { AttendanceTable } from './components/AttendanceTable.js';
import { AttendanceFeedPage } from './components/AttendanceFeedPage.js';
import { PenaltyTable } from './components/PenaltyTable.js';
import { InfractionsLedgerPage } from './components/InfractionsLedgerPage.js';
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
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search);
    const theme = params.get('theme');
    if (theme) return theme === 'dark';
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return true;
  });
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

  // Sync Dark Mode class with <html> and persist in localStorage
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
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

      const testModal = new URLSearchParams(window.location.search).get('modal');
      if (testModal === 'settle' && p.length > 0) {
        const pending = p.find((item) => item.status === 'PENDING') || p[0];
        setSelectedPenaltyForPayment(pending);
      }
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
    <div className="min-h-screen flex flex-col bg-surface-app text-content-primary transition-colors duration-150">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl glass-panel border border-brand-border text-xs font-semibold shadow-2xl text-content-primary animate-bounce">
          <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
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

        {/* Main Content & Pinned Footer Column */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Executive Summary Command Console */}
              <HeroBanner
                onRunProsecution={handleRunProsecution}
                onOpenConstitution={() => setActiveTab('constitution')}
                onSyncAttendance={handleSyncAttendance}
                isSyncing={isSyncingAttendance}
                totalCompliant={stats.attendanceOverview.totalDone}
                totalPresent={stats.attendanceOverview.totalPresent}
                totalPenalized={stats.attendanceOverview.totalPenalized}
                totalLogged={stats.attendanceOverview.totalLogged}
              />

              {/* Analytical KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Total Infractions"
                  value={stats.totalPenalties}
                  subtitle="Statutory penalties issued"
                  icon={AlertOctagon}
                  trend={{ value: `${stats.statusBreakdown.PENDING} pending`, isPositive: stats.statusBreakdown.PENDING === 0 }}
                  accentColor="rose"
                  progress={stats.totalPenalties > 0 ? Math.round((stats.statusBreakdown.PAID / stats.totalPenalties) * 100) : 100}
                  progressLabel="Settlement Rate"
                />

                <MetricCard
                  title="Fines Assessed"
                  value={`৳${stats.totalFinesIssued.toLocaleString()}`}
                  subtitle="Total monetary penalties assessed"
                  icon={DollarSign}
                  trend={{ value: `৳${stats.totalCollected.toLocaleString()} paid`, isPositive: true }}
                  accentColor="indigo"
                  progress={stats.totalFinesIssued > 0 ? Math.round((stats.totalCollected / stats.totalFinesIssued) * 100) : 0}
                  progressLabel="Collected"
                />

                <MetricCard
                  title="Outstanding Dues"
                  value={`৳${stats.totalPending.toLocaleString()}`}
                  subtitle="Awaiting payroll/bKash settlement"
                  icon={Clock}
                  accentColor="amber"
                  progress={stats.collectionRate}
                  progressLabel="Recovery Rate"
                />

                <MetricCard
                  title="Today's Attendance"
                  value={`${stats.attendanceOverview.totalPresent} / ${stats.attendanceOverview.totalLogged}`}
                  subtitle={`${stats.attendanceOverview.totalDone} WhatsApp "done" verified`}
                  icon={Users}
                  trend={{
                    value: `${stats.attendanceOverview.totalPenalized} penalized`,
                    isPositive: stats.attendanceOverview.totalPenalized === 0,
                  }}
                  accentColor="cyan"
                  progress={stats.attendanceOverview.totalPresent > 0 ? Math.round((stats.attendanceOverview.totalDone / stats.attendanceOverview.totalPresent) * 100) : 100}
                  progressLabel="Reconciled"
                />
              </div>

              {/* Data Visualizer & Telemetry Analytics Section */}
              <ExecutiveAnalytics
                attendance={attendance}
                penalties={penalties}
                stats={stats}
              />

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

          {/* Attendance & Done Feed Tab */}
          {activeTab === 'attendance' && (
            <AttendanceFeedPage
              records={attendance}
              penalties={penalties}
              onSync={handleSyncAttendance}
              isLoading={isSyncingAttendance}
              onRunProsecution={handleRunProsecution}
            />
          )}

          {/* Penalties Tab */}
          {activeTab === 'penalties' && (
            <InfractionsLedgerPage
              penalties={penalties}
              onOpenPaymentModal={(p) => setSelectedPenaltyForPayment(p)}
              onOpenDisputeModal={(p) => setSelectedPenaltyForDispute(p)}
              onWaivePenalty={handleWaivePenalty}
              onExportPdf={handleExportPdf}
              isExportingPdf={isExportingPdf}
              onRunProsecution={handleRunProsecution}
              isProsecuting={isProsecuting}
            />
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

        {/* Enterprise Governance & Telemetry Footer */}
        <Footer
          onNavigateTab={setActiveTab}
          onExportConstitutionPdf={handleExportPdf}
        />
      </div>
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
