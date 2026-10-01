import React from 'react';
import {
  X,
  BookOpen,
  Code2,
  Server,
  Layers,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  ExternalLink,
} from 'lucide-react';

interface ProjectInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectInfoModal: React.FC<ProjectInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl border border-slate-800 bg-[#090e1a] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0d1322]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-mono">
                CodeCraft <span className="text-emerald-400">Architecture</span>
              </h2>
              <p className="text-xs text-slate-400">
                Academic Project Demonstration & System Technical Overview
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
          {/* Project Abstract */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Project Mission & Abstract
            </h3>
            <p className="text-slate-300">
              <strong className="text-white">CodeCraft</strong> ("Decode Errors. Build Solutions.") is an automated debugging and software engineering mentor designed for computer science students and developers. It bridges the gap between cryptic compiler/runtime diagnostic messages (e.g., Segmentation Faults, NullPointerExceptions, IndexErrors) and conceptual programming understanding.
            </p>
          </div>

          {/* System Architecture */}
          <div>
            <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Full-Stack Architecture
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#060912] border border-slate-800">
                <span className="font-semibold text-emerald-300 block mb-1">
                  1. Client Layer (React 19 + TypeScript + Vite)
                </span>
                <p className="text-slate-400 text-xs leading-normal">
                  Responsive dark developer dashboard with syntax-highlighted editor, tab indentation handling, instant diff viewer, and localStorage session persistence.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#060912] border border-slate-800">
                <span className="font-semibold text-emerald-300 block mb-1">
                  2. Secure Proxy Server (Express + tsx)
                </span>
                <p className="text-slate-400 text-xs leading-normal">
                  Isolated Node.js proxy server managing Gemini SDK credentials securely on the server side. Zero API key leakage to browser bundles.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#060912] border border-slate-800">
                <span className="font-semibold text-emerald-300 block mb-1">
                  3. AI Engine (Google Gemini 3.8 Flash)
                </span>
                <p className="text-slate-400 text-xs leading-normal">
                  High-throughput reasoning model paired with strict JSON Schema generation for guaranteed structural error classification, root-cause derivation, and clean syntax synthesis.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#060912] border border-slate-800">
                <span className="font-semibold text-emerald-300 block mb-1">
                  4. Multi-Language Scope
                </span>
                <p className="text-slate-400 text-xs leading-normal">
                  Specialized support for C (memory/pointers), C++ (STL/templates), Python (tracebacks), Java (JVM exceptions), JavaScript (event-loop/async), and HTML/CSS.
                </p>
              </div>
            </div>
          </div>

          {/* Key Evaluation Highlights */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
            <h4 className="font-bold text-emerald-300 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Academic Evaluation Checklist
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero client-side secrets: all AI inference routed via protected backend API.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Line-level error pinpointing with visual Before & After diff comparison.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Pedagogical root-cause breakdowns with preventative coding tips.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Markdown diagnostic report generator ready for homework or lab exports.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#0c1220] flex items-center justify-between text-xs text-slate-400">
          <span>CodeCraft v1.0 • College Engineering Capstone</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
