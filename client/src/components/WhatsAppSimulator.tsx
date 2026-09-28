import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  CheckCircle,
  Clock,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface SimulatorProps {
  onRunAdjudication: () => void;
}

export const WhatsAppSimulator: React.FC<SimulatorProps> = ({ onRunAdjudication }) => {
  const [messages, setMessages] = useState<
    Array<{ sender: string; time: string; text: string; status: 'VALID' | 'LATE' | 'IGNORED' }>
  >([
    { sender: 'Mahbubur Rahman', time: '10:12 AM', text: 'done', status: 'VALID' },
    { sender: 'Arif Hossain', time: '10:18 AM', text: 'Done', status: 'VALID' },
    { sender: 'Tanzina Akhter', time: '10:22 AM', text: 'Done for the day', status: 'VALID' },
    { sender: 'Kamrul Islam', time: '10:29 AM', text: 'done', status: 'LATE' },
    { sender: 'Random User', time: '10:31 AM', text: 'Good morning all!', status: 'IGNORED' },
  ]);

  const [inputSender, setInputSender] = useState('Farhan Ahmed');
  const [inputText, setInputText] = useState('done');
  const [inputTime, setInputTime] = useState('10:20');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSender || !inputText) return;

    // Check if before 10:25
    const [h, m] = inputTime.split(':').map(Number);
    const isLate = h > 10 || (h === 10 && m > 25);
    const isDone = inputText.toLowerCase().startsWith('done');

    const status: 'VALID' | 'LATE' | 'IGNORED' = isDone ? (isLate ? 'LATE' : 'VALID') : 'IGNORED';

    setMessages((prev) => [
      ...prev,
      {
        sender: inputSender,
        time: `${inputTime} ${h >= 12 ? 'PM' : 'AM'}`,
        text: inputText,
        status,
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl glass-panel p-6 border border-slate-200/80 dark:border-white/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold border border-emerald-500/20 mb-2">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Integration Test Lab</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Simulate Group Messages & 10:25 AM Cutoff Behavior
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Verify how the rules engine handles variations in timing, capitalization, and sender alias mapping prior to the 10:25:00 AM cutoff.
            </p>
          </div>

          <button
            onClick={onRunAdjudication}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 transition active:scale-95"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Adjudicate Current Stream</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Chat Simulator */}
        <div className="lg:col-span-2 rounded-3xl glass-panel border border-slate-200/80 dark:border-white/10 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                WA
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  Office Operations WhatsApp Group
                </h4>
                <p className="text-[10px] text-slate-400">120363024823482348@g.us • Live Listener</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Cutoff: 10:25:00 AM
            </span>
          </div>

          {/* Messages Stream */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-2 mb-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {m.sender}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{m.time}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-mono text-[11px] bg-white dark:bg-slate-800/80 px-2 py-1 rounded-lg inline-block border border-slate-200 dark:border-white/5">
                    "{m.text}"
                  </p>
                </div>

                <div>
                  {m.status === 'VALID' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      <CheckCircle className="w-3 h-3" />
                      <span>Valid (Before 10:25)</span>
                    </span>
                  )}
                  {m.status === 'LATE' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                      <Clock className="w-3 h-3" />
                      <span>Late (&gt;10:25 Cutoff)</span>
                    </span>
                  )}
                  {m.status === 'IGNORED' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 dark:bg-slate-800 text-slate-500">
                      <span>No "Done" Keyword</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-200 dark:border-white/10 flex flex-wrap gap-2 text-xs">
            <input
              type="text"
              value={inputSender}
              onChange={(e) => setInputSender(e.target.value)}
              placeholder="Sender Name"
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white flex-1 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="time"
              value={inputTime}
              onChange={(e) => setInputTime(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder='Message (e.g. "done")'
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white flex-1 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Simulate</span>
            </button>
          </form>
        </div>

        {/* Right: Statutory Architecture Info */}
        <div className="rounded-3xl glass-panel border border-slate-200/80 dark:border-white/10 p-5 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Article 1.1 Statutory Pipeline</span>
            </h4>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="font-bold text-slate-900 dark:text-white mb-0.5">
                  1. Biometric Ingestion
                </div>
                <p className="text-[11px] text-slate-400">
                  Retrieves employees punched into office hardware prior to 10:25 AM.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="font-bold text-slate-900 dark:text-white mb-0.5">
                  2. Keyword & Alias Reconciliation
                </div>
                <p className="text-[11px] text-slate-400">
                  Resolves WhatsApp display names & numbers against registered employee aliases.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="font-bold text-slate-900 dark:text-white mb-0.5">
                  3. Cutoff Adjudication
                </div>
                <p className="text-[11px] text-slate-400">
                  If <code className="text-cyan-400 font-mono">present && !doneSentBefore1025</code>: issues ৳500 statutory fine.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-400 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>Messages sent after 10:25:00 AM are flagged as late and rejected.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
