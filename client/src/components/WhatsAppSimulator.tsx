import React, { useState, useMemo } from 'react';
import { getEmployeeAvatar } from '../utils/avatars.js';
import {
  MessageSquare,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  PartyPopper,
  Pizza,
  Zap,
  CheckCheck,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Check,
  X,
  ArrowRight,
  Info,
  Flame,
  Bot,
  Hash,
  Play,
} from 'lucide-react';

interface SimulatorProps {
  onRunAdjudication: () => void;
}

interface SimMessage {
  id: string;
  sender: string;
  employeeId: string;
  time: string;
  timeMinutes: number; // minutes from midnight
  text: string;
  status: 'VALID' | 'LATE' | 'IGNORED';
}

interface Colleague {
  name: string;
  id: string;
  role: string;
  roleBadgeColor: string;
  dept: string;
}

export const WhatsAppSimulator: React.FC<SimulatorProps> = ({ onRunAdjudication }) => {
  // Official Colleagues
  const team: Colleague[] = [
    {
      name: 'Mahbub Alam',
      id: 'EMP-101',
      role: 'Lead Architect',
      roleBadgeColor: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/25',
      dept: 'Engineering',
    },
    {
      name: 'Arif Hossain',
      id: 'EMP-102',
      role: 'DevOps Engineer',
      roleBadgeColor: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/25',
      dept: 'Engineering',
    },
    {
      name: 'Tanzina Akhter',
      id: 'EMP-103',
      role: 'UI/UX Designer',
      roleBadgeColor: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/25',
      dept: 'UI/UX Design',
    },
    {
      name: 'Kamrul Islam',
      id: 'EMP-104',
      role: 'QA Lead',
      roleBadgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25',
      dept: 'QA & Automation',
    },
    {
      name: 'Sadia Jahan',
      id: 'EMP-105',
      role: 'Talent Lead',
      roleBadgeColor: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/25',
      dept: 'Human Resources',
    },
    {
      name: 'Farhan Ahmed',
      id: 'EMP-106',
      role: 'Cloud Engineer',
      roleBadgeColor: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/25',
      dept: 'Engineering',
    },
  ];

  const initialMessages: SimMessage[] = [
    {
      id: '1',
      sender: 'Mahbub Alam',
      employeeId: 'EMP-101',
      time: '10:12 AM',
      timeMinutes: 10 * 60 + 12,
      text: 'done',
      status: 'VALID',
    },
    {
      id: '2',
      sender: 'Arif Hossain',
      employeeId: 'EMP-102',
      time: '10:18 AM',
      timeMinutes: 10 * 60 + 18,
      text: 'Done',
      status: 'VALID',
    },
    {
      id: '3',
      sender: 'Tanzina Akhter',
      employeeId: 'EMP-103',
      time: '10:22 AM',
      timeMinutes: 10 * 60 + 22,
      text: 'Done for the day',
      status: 'VALID',
    },
    {
      id: '4',
      sender: 'Kamrul Islam',
      employeeId: 'EMP-104',
      time: '10:29 AM',
      timeMinutes: 10 * 60 + 29,
      text: 'done',
      status: 'LATE',
    },
    {
      id: '5',
      sender: 'Farhan Ahmed',
      employeeId: 'EMP-106',
      time: '10:31 AM',
      timeMinutes: 10 * 60 + 31,
      text: 'Good morning team!',
      status: 'IGNORED',
    },
  ];

  const [messages, setMessages] = useState<SimMessage[]>(initialMessages);
  const [inputSender, setInputSender] = useState('Mahbub Alam');
  const [inputText, setInputText] = useState('done');
  const [inputTime, setInputTime] = useState('10:20');

  // Interactive Live Tester state
  const [liveTestText, setLiveTestText] = useState('Done for today');
  const [liveTestTime, setLiveTestTime] = useState('10:24');

  // Sort messages chronologically by minutes from midnight
  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => a.timeMinutes - b.timeMinutes);
  }, [messages]);

  // Derived KPI metrics
  const validCount = sortedMessages.filter((m) => m.status === 'VALID').length;
  const lateCount = sortedMessages.filter((m) => m.status === 'LATE').length;
  const ignoredCount = sortedMessages.filter((m) => m.status === 'IGNORED').length;
  const simulatedPartyVault = lateCount * 500;

  // Selected colleague info for input
  const currentMember = team.find((t) => t.name === inputSender) || team[0];

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputSender || !inputText.trim()) return;

    const [h, m] = inputTime.split(':').map(Number);
    const minutes = h * 60 + m;
    const cutoffMinutes = 10 * 60 + 25; // 10:25:00 AM

    const isLate = minutes > cutoffMinutes;
    const isDone = inputText.toLowerCase().trim().startsWith('done');

    let status: 'VALID' | 'LATE' | 'IGNORED' = 'IGNORED';
    if (isDone) {
      status = isLate ? 'LATE' : 'VALID';
    }

    const member = team.find((t) => t.name === inputSender) || team[0];

    const newMsg: SimMessage = {
      id: Date.now().toString(),
      sender: member.name,
      employeeId: member.id,
      time: `${h > 12 ? h - 12 : h === 0 ? 12 : h}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`,
      timeMinutes: minutes,
      text: inputText.trim(),
      status,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('done');
  };

  const handleReset = () => {
    setMessages(initialMessages);
  };

  const setPreset = (sender: string, time: string, text: string) => {
    setInputSender(sender);
    setInputTime(time);
    setInputText(text);
  };

  // Live NLP phrase evaluator
  const liveTestResult = useMemo(() => {
    const isMatch = liveTestText.toLowerCase().trim().startsWith('done');
    const [h, m] = liveTestTime.split(':').map(Number);
    const mins = h * 60 + m;
    const isLate = mins > 10 * 60 + 25;

    let verdict: 'PASS' | 'LATE' | 'REJECT';
    if (!isMatch) {
      verdict = 'REJECT';
    } else if (isLate) {
      verdict = 'LATE';
    } else {
      verdict = 'PASS';
    }

    return { isMatch, isLate, verdict, mins };
  }, [liveTestText, liveTestTime]);

  const handleInjectLiveTest = () => {
    const [h, m] = liveTestTime.split(':').map(Number);
    const mins = h * 60 + m;
    const member = currentMember;

    let status: 'VALID' | 'LATE' | 'IGNORED' = 'IGNORED';
    if (liveTestResult.isMatch) {
      status = liveTestResult.isLate ? 'LATE' : 'VALID';
    }

    const newMsg: SimMessage = {
      id: Date.now().toString(),
      sender: member.name,
      employeeId: member.id,
      time: `${h > 12 ? h - 12 : h === 0 ? 12 : h}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`,
      timeMinutes: mins,
      text: liveTestText.trim(),
      status,
    };

    setMessages((prev) => [...prev, newMsg]);
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-12">
      {/* 1. Header Command Hub */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-subtle text-brand-primary border border-brand-border">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
              Cloud & DevSecOps Department
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-status-warning/15 text-status-warning border border-status-warning/30">
              <PartyPopper className="w-3.5 h-3.5" />
              Article 1.1 Webhook & Cutoff Simulator
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-surface-subtle text-content-muted border border-border-default">
              Autonomous NLP Parser
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-content-primary tracking-tight">
            WhatsApp Group & 10:25 AM Cutoff Simulator
          </h2>

          <p className="text-xs text-content-muted leading-relaxed">
            Test and verify how the automated adjudication rules engine evaluates real morning WhatsApp check-in messages
            against biometric hardware punches and the strict <strong>10:25:00 AM Asia/Dhaka</strong> statutory deadline.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-content-muted font-mono pt-0.5">
            <span className="flex items-center gap-1 text-content-secondary">
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              10:25:00 AM Strict Gate
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-content-secondary">
              <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
              Self-Governed by Team Peers (Not HR)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-content-secondary">
              <Pizza className="w-3.5 h-3.5 text-status-warning" />
              Late "Done" = +৳500 Friday Pizza Pool
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-content-secondary hover:text-content-primary bg-surface-subtle hover:bg-surface-hover border border-border-default transition cursor-pointer shadow-2xs"
            title="Reset Simulator to default message set"
          >
            <RotateCcw className="w-3.5 h-3.5 text-content-muted" />
            <span>Reset Feed</span>
          </button>
          <button
            type="button"
            onClick={onRunAdjudication}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-brand-primary hover:bg-brand-primaryHover shadow-sm active:scale-95 transition cursor-pointer"
            title="Trigger Full Cutoff Adjudication"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Adjudicate Current Stream</span>
          </button>
        </div>
      </div>

      {/* 2. Telemetry KPI Pods */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Pod 1: Total Streamed */}
        <div className="p-3.5 rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 flex items-center justify-between transition-colors">
          <div>
            <div className="text-[10px] font-bold text-content-muted uppercase tracking-wider">
              Simulated Stream
            </div>
            <div className="text-xl sm:text-2xl font-black text-content-primary mt-0.5 font-mono tracking-tight">
              {messages.length} Messages
            </div>
            <p className="text-[10px] text-content-muted mt-0.5">
              Live Webhook Active
            </p>
          </div>
          <div className="p-2 rounded-xl bg-brand-subtle text-brand-primary border border-brand-border">
            <MessageSquare className="w-4 h-4" />
          </div>
        </div>

        {/* Pod 2: Cutoff Threshold */}
        <div className="p-3.5 rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 flex items-center justify-between transition-colors">
          <div>
            <div className="text-[10px] font-bold text-content-muted uppercase tracking-wider">
              Cutoff Gate
            </div>
            <div className="text-xl sm:text-2xl font-black text-sky-500 mt-0.5 font-mono tracking-tight">
              10:25:00 AM
            </div>
            <p className="text-[10px] text-content-muted mt-0.5">
              Asia/Dhaka Reconciliation
            </p>
          </div>
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500 border border-sky-500/20">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Pod 3: Verified On-Time */}
        <div className="p-3.5 rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 flex items-center justify-between transition-colors">
          <div>
            <div className="text-[10px] font-bold text-content-muted uppercase tracking-wider">
              Verified English "Done"
            </div>
            <div className="text-xl sm:text-2xl font-black text-status-success mt-0.5 font-mono tracking-tight">
              {validCount} On-Time
            </div>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
              Habits Confirmed ⭐
            </p>
          </div>
          <div className="p-2 rounded-xl bg-status-success/15 text-status-success border border-status-success/30">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        {/* Pod 4: Party Vault Potential */}
        <div className="p-3.5 rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 flex items-center justify-between transition-colors">
          <div>
            <div className="text-[10px] font-bold text-content-muted uppercase tracking-wider">
              Simulated Party Vault
            </div>
            <div className="text-xl sm:text-2xl font-black text-status-warning mt-0.5 font-mono tracking-tight">
              +৳{simulatedPartyVault.toLocaleString()}
            </div>
            <p className="text-[10px] text-status-warning mt-0.5 font-medium">
              {lateCount} Late = Friday Snack Pool 🍕
            </p>
          </div>
          <div className="p-2 rounded-xl bg-status-warning/15 text-status-warning border border-status-warning/30">
            <PartyPopper className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 3. Main Split Section: Interactive WhatsApp Terminal (7 cols) + Engine Sidecar (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (7 cols): Authentic WhatsApp Test Terminal */}
        <div className="lg:col-span-7 rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 overflow-hidden transition-colors flex flex-col">
          {/* WhatsApp Group Terminal Header */}
          <div className="p-3.5 sm:p-4 border-b border-border-default flex items-center justify-between bg-surface-subtle/50">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-surface-card" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-content-primary truncate">
                    Cloud & DevSecOps Standup
                  </h3>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-status-success border border-emerald-500/25">
                    LIVE
                  </span>
                </div>
                <p className="text-[11px] text-content-muted font-mono truncate">
                  Mahbub, Arif, Tanzina, Kamrul, Sadia, Farhan
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/25">
                <Clock className="w-3.5 h-3.5 text-sky-500" />
                <span>Cutoff: 10:25:00 AM</span>
              </div>
            </div>
          </div>

          {/* Quick Scenario Preset Chips */}
          <div className="px-3.5 py-2 bg-surface-subtle/30 border-b border-border-subtle flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-content-muted flex items-center gap-1 shrink-0 mr-1">
              <Sliders className="w-3 h-3 text-brand-primary" />
              Presets:
            </span>
            <button
              type="button"
              onClick={() => setPreset('Mahbub Alam', '10:15', 'done')}
              className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-surface-card hover:bg-surface-hover text-content-secondary border border-border-default transition cursor-pointer shrink-0 flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Mahbub (10:15)
            </button>
            <button
              type="button"
              onClick={() => setPreset('Tanzina Akhter', '10:23', 'Done for the day')}
              className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-surface-card hover:bg-surface-hover text-content-secondary border border-border-default transition cursor-pointer shrink-0 flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Tanzina (10:23)
            </button>
            <button
              type="button"
              onClick={() => setPreset('Arif Hossain', '10:25', 'done')}
              className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-surface-card hover:bg-surface-hover text-sky-600 dark:text-sky-400 border border-border-default transition cursor-pointer shrink-0 flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              Arif (10:25 Gate)
            </button>
            <button
              type="button"
              onClick={() => setPreset('Kamrul Islam', '10:27', 'done')}
              className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition cursor-pointer shrink-0 flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Kamrul (10:27 Late)
            </button>
            <button
              type="button"
              onClick={() => setPreset('Farhan Ahmed', '10:19', 'Good morning team!')}
              className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/20 transition cursor-pointer shrink-0 flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Farhan (No "Done")
            </button>
          </div>

          {/* Authentic WhatsApp Message Feed */}
          <div className="p-3.5 sm:p-4 space-y-2.5 h-[440px] overflow-y-auto bg-surface-subtle/25">
            {sortedMessages.map((m, idx) => {
              const avatar = getEmployeeAvatar(m.sender, m.employeeId);
              const cutoffMinutes = 10 * 60 + 25;
              const isAfterCutoff = m.timeMinutes > cutoffMinutes;

              // Show cutoff divider line immediately before the first message exceeding 10:25 AM
              const prevMsg = idx > 0 ? sortedMessages[idx - 1] : null;
              const showCutoffDivider =
                isAfterCutoff && (!prevMsg || prevMsg.timeMinutes <= cutoffMinutes);

              const colleague = team.find((t) => t.name === m.sender);

              return (
                <React.Fragment key={m.id}>
                  {showCutoffDivider && (
                    <div className="flex items-center gap-2 my-3 py-0.5">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-rose-500/50 to-rose-500" />
                      <div className="px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center gap-1.5 shadow-2xs">
                        <Clock className="w-3 h-3 text-rose-500 animate-pulse" />
                        <span>10:25:00 AM Strict Adjudication Threshold</span>
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-rose-500/50 to-rose-500" />
                    </div>
                  )}

                  <div className="flex items-start gap-2.5 group">
                    <img
                      src={avatar}
                      alt={m.sender}
                      className="w-8 h-8 rounded-full object-cover border border-border-default shadow-2xs shrink-0 mt-0.5"
                    />

                    <div className="flex-1 min-w-0 max-w-[92%]">
                      {/* WhatsApp Speech Bubble */}
                      <div
                        className={`rounded-2xl px-3.5 py-2 shadow-xs border transition ${
                          m.status === 'VALID'
                            ? 'bg-surface-card border-border-default hover:border-emerald-500/30'
                            : m.status === 'LATE'
                            ? 'bg-rose-500/5 dark:bg-rose-950/25 border-rose-500/30 hover:border-rose-500/40'
                            : 'bg-surface-card border-border-default hover:border-amber-500/30'
                        }`}
                      >
                        {/* Bubble Header: Sender Name & Role */}
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="font-bold text-xs text-content-primary truncate">
                              {m.sender}
                            </span>
                            {colleague && (
                              <span
                                className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-medium ${colleague.roleBadgeColor}`}
                              >
                                {colleague.role}
                              </span>
                            )}
                            <span className="text-[10px] text-content-muted font-mono hidden sm:inline">
                              {m.employeeId}
                            </span>
                          </div>
                        </div>

                        {/* Bubble Content & Timestamp */}
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="text-xs text-content-primary font-medium tracking-wide">
                            "{m.text}"
                          </p>
                          <div className="flex items-center gap-1 shrink-0 text-[10px] font-mono text-content-muted">
                            <span>{m.time}</span>
                            <CheckCheck
                              className={`w-3.5 h-3.5 ${
                                m.status === 'VALID'
                                  ? 'text-emerald-500'
                                  : m.status === 'LATE'
                                  ? 'text-rose-500'
                                  : 'text-content-muted'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Compact Statutory Adjudication Badge */}
                      <div className="mt-1 flex items-center gap-2 px-1">
                        {m.status === 'VALID' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span>Article 1.1 Verified &bull; On-Time Check-In</span>
                          </span>
                        )}
                        {m.status === 'LATE' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                            <AlertTriangle className="w-3 h-3 text-rose-500" />
                            <span>Late Cutoff Violation &bull; +৳500 Party Fund Pizza Pool</span>
                          </span>
                        )}
                        {m.status === 'IGNORED' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 dark:text-amber-400">
                            <X className="w-3 h-3 text-amber-500" />
                            <span>No "Done" Keyword Detected &bull; Missing English Habit Check-in</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Interactive Composer Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 sm:p-3.5 bg-surface-subtle/50 border-t border-border-default flex flex-col gap-2 text-xs"
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {/* Colleague Select */}
              <div className="flex items-center gap-2 shrink-0">
                <img
                  src={getEmployeeAvatar(currentMember.name, currentMember.id)}
                  alt={currentMember.name}
                  className="w-7 h-7 rounded-full object-cover border border-border-default shrink-0"
                />
                <select
                  value={inputSender}
                  onChange={(e) => setInputSender(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-surface-card border border-border-default text-content-primary font-medium text-xs focus:outline-none focus:border-brand-primary min-w-[170px] cursor-pointer shadow-2xs"
                >
                  {team.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name} ({t.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Picker */}
              <div className="flex items-center gap-1.5 shrink-0">
                <Clock className="w-3.5 h-3.5 text-content-muted shrink-0 hidden sm:block" />
                <input
                  type="time"
                  value={inputTime}
                  onChange={(e) => setInputTime(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-surface-card border border-border-default text-content-primary font-mono text-xs focus:outline-none focus:border-brand-primary w-full sm:w-[125px] shadow-2xs"
                />
              </div>

              {/* Message Input & Send Button */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder='Type WhatsApp text (e.g. "done", "Done for today")...'
                  className="px-3 py-1.5 rounded-xl bg-surface-card border border-border-default text-content-primary placeholder:text-content-muted font-mono text-xs flex-1 min-w-[140px] focus:outline-none focus:border-brand-primary shadow-2xs"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 shadow-xs transition cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column (5 cols): Automated Rules Engine & Real-Time Phrase Evaluator */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: 10:25 AM Automated NLP Engine */}
          <div className="rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 overflow-hidden transition-colors">
            <div className="relative h-24 sm:h-28 w-full bg-slate-950 overflow-hidden">
              <img
                src="/assets/simulator_banner.jpg"
                alt="10:25 AM WhatsApp Cutoff Simulator"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-3.5">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    Automated Biometric & WhatsApp Engine
                  </div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-white leading-tight">
                    10:25:00 AM Strict Gate Pipeline
                  </h4>
                </div>
              </div>
            </div>

            <div className="p-3.5 space-y-2.5">
              <h5 className="text-[10px] font-bold text-content-primary uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-brand-primary" />
                Article 1.1 Adjudication Flow
              </h5>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-start gap-2 p-2 rounded-xl bg-surface-subtle/70 border border-border-subtle">
                  <span className="w-4 h-4 rounded-full bg-brand-subtle text-brand-primary text-[9px] font-mono flex items-center justify-center font-bold shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <div className="font-bold text-content-primary text-xs">Biometric Punch Scan</div>
                    <p className="text-[11px] text-content-muted leading-tight">
                      Fingerprint reader logs on-site colleagues punched in before 10:25 AM.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 rounded-xl bg-surface-subtle/70 border border-border-subtle">
                  <span className="w-4 h-4 rounded-full bg-brand-subtle text-brand-primary text-[9px] font-mono flex items-center justify-center font-bold shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <div className="font-bold text-content-primary text-xs">NLP Regex Evaluation</div>
                    <p className="text-[11px] text-content-muted leading-tight">
                      Matches WhatsApp text against <code className="text-brand-primary font-mono text-[10px]">/^done/i</code> to cultivate spoken fluency.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 rounded-xl bg-surface-subtle/70 border border-border-subtle">
                  <span className="w-4 h-4 rounded-full bg-brand-subtle text-brand-primary text-[9px] font-mono flex items-center justify-center font-bold shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <div className="font-bold text-content-primary text-xs">10:25:00 AM Gate Adjudication</div>
                    <p className="text-[11px] text-content-muted leading-tight">
                      If present without on-time "done": logs <strong className="text-status-warning">৳500</strong> to the Friday pizza pool.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Interactive Real-Time NLP Phrase & Time Tester */}
          <div className="rounded-2xl bg-surface-card border border-border-default shadow-xs dark:shadow-md dark:shadow-black/20 p-4 sm:p-5 space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-content-primary flex items-center gap-1.5 uppercase tracking-wider">
                <Bot className="w-3.5 h-3.5 text-brand-primary" />
                Live NLP Phrase & Time Tester
              </h4>
              <span className="text-[10px] font-mono text-content-muted">Real-Time Sandbox</span>
            </div>

            {/* Test Inputs */}
            <div className="space-y-2.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-content-muted uppercase tracking-wider flex items-center justify-between">
                  <span>Test Custom Phrase</span>
                  <span className="font-mono text-brand-primary">regex: /^done/i</span>
                </label>
                <input
                  type="text"
                  value={liveTestText}
                  onChange={(e) => setLiveTestText(e.target.value)}
                  placeholder="e.g. done, Done for today, hello..."
                  className="w-full px-3 py-1.5 rounded-xl bg-surface-subtle border border-border-default text-content-primary font-mono text-xs focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold text-content-muted uppercase tracking-wider">
                    Simulated Time
                  </label>
                  <input
                    type="time"
                    value={liveTestTime}
                    onChange={(e) => setLiveTestTime(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-surface-subtle border border-border-default text-content-primary font-mono text-xs focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="shrink-0 pt-4">
                  <button
                    type="button"
                    onClick={handleInjectLiveTest}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-brand-primary hover:bg-brand-primaryHover shadow-2xs transition cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Try in Feed</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Result Evaluation Box */}
            <div className="p-3 rounded-xl bg-surface-subtle border border-border-default space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] text-content-muted">Keyword Matched:</span>
                {liveTestResult.isMatch ? (
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
                    <Check className="w-3.5 h-3.5" /> Valid "Done"
                  </span>
                ) : (
                  <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 font-mono text-[11px]">
                    <X className="w-3.5 h-3.5" /> Missing Keyword
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] text-content-muted">Cutoff Window:</span>
                {!liveTestResult.isLate ? (
                  <span className="font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1 font-mono text-[11px]">
                    <Check className="w-3.5 h-3.5" /> Before 10:25 AM
                  </span>
                ) : (
                  <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5" /> After 10:25:00 AM
                  </span>
                )}
              </div>

              <div className="pt-1 border-t border-border-subtle flex items-center justify-between">
                <span className="text-xs font-bold text-content-primary">Adjudication:</span>
                {liveTestResult.verdict === 'PASS' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-status-success/15 text-status-success border border-status-success/30 uppercase">
                    ⭐ On-Time &bull; No Penalty
                  </span>
                )}
                {liveTestResult.verdict === 'LATE' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-status-danger/15 text-status-danger border border-status-danger/30 uppercase">
                    🍕 +৳500 Party Fund Due
                  </span>
                )}
                {liveTestResult.verdict === 'REJECT' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-subtle text-content-muted border border-border-default uppercase">
                    ⚠️ Rejected &bull; No "Done"
                  </span>
                )}
              </div>
            </div>

            {/* Self-Governance Peer Charter Notice */}
            <div className="p-3 rounded-xl bg-status-warning/10 border border-status-warning/25 text-[11px] text-content-secondary flex items-start gap-2.5">
              <Pizza className="w-4 h-4 text-status-warning shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Peer-Governed Friday Fund:</strong> All ৳500 penalties fund department team snacks and Friday pizzas. Zero HR or management intrusion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
