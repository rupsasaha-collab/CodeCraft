import React, { useEffect, useState } from 'react';
import { Loader2, Bug, CheckCircle2, ShieldCheck, Terminal, Cpu } from 'lucide-react';

const ANALYSIS_STEPS = [
  { text: 'Parsing abstract syntax tree & token semantics...', icon: Terminal },
  { text: 'Tracing runtime exceptions, stack frames & memory bounds...', icon: Bug },
  { text: 'Diagnosing root cause and architectural constraints...', icon: Cpu },
  { text: 'Generating beginner-friendly, plain English explanation...', icon: ShieldCheck },
  { text: 'Synthesizing verified, production-quality corrected code...', icon: CheckCircle2 },
];

export const AnalysisLoading: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % ANALYSIS_STEPS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative rounded-2xl border border-emerald-500/30 bg-[#0a101f] p-8 shadow-[0_0_40px_rgba(16,185,129,0.12)] overflow-hidden">
      {/* Background glowing gradient */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto">
        {/* Pulsing Emerald Radar / Spinner */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)]">
            <Loader2 className="w-9 h-9 animate-spin text-emerald-400" />
          </div>
          <span className="absolute -bottom-2 -right-2 flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-6 w-6 bg-emerald-500 items-center justify-center text-[10px] font-bold text-slate-950">
              AI
            </span>
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          Decoding Errors & Building Solution...
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          CodeCraft is performing deep neural analysis with Google Gemini 3.8 Flash.
        </p>

        {/* Steps Tracker */}
        <div className="w-full space-y-2.5 text-left bg-[#070b14]/70 p-4 rounded-xl border border-slate-800/80">
          {ANALYSIS_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const Icon = step.icon;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs transition-all duration-300 ${
                  isCurrent
                    ? 'text-emerald-300 font-semibold translate-x-1'
                    : isCompleted
                    ? 'text-slate-400 opacity-60'
                    : 'text-slate-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                    isCurrent
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_8px_#10b981]'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-emerald-400 animate-pulse' : ''}`} />
                <span className="truncate">{step.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
