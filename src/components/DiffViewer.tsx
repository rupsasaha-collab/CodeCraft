import React, { useState } from 'react';
import { Columns, SplitSquareVertical, ArrowRight } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

interface DiffViewerProps {
  originalCode: string;
  correctedCode: string;
  language: string;
  errorLine?: number | null;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  originalCode,
  correctedCode,
  language,
  errorLine,
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <SplitSquareVertical className="w-3.5 h-3.5 text-emerald-400" />
          <span>Before & After Code Comparison</span>
        </span>

        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              viewMode === 'split'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Side-by-Side
          </button>
          <button
            type="button"
            onClick={() => setViewMode('unified')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              viewMode === 'unified'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Corrected Only
          </button>
        </div>
      </div>

      {viewMode === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Original Buggy Code */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1.5 px-2">
              <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Original Code (With Bug)
              </span>
              {errorLine && (
                <span className="text-[11px] font-mono text-rose-400/80">
                  Failing at line {errorLine}
                </span>
              )}
            </div>
            <CodeBlock
              code={originalCode || '// No original code supplied'}
              language={language}
              filename="original_with_bug"
              errorLine={errorLine}
              maxHeight="max-h-[420px]"
            />
          </div>

          {/* Corrected Code */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1.5 px-2">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                Corrected Code (CodeCraft Fix)
              </span>
              <span className="text-[11px] font-mono text-emerald-400/80">
                Verified & Formatted
              </span>
            </div>
            <CodeBlock
              code={correctedCode}
              language={language}
              filename="corrected_solution"
              maxHeight="max-h-[420px]"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <CodeBlock
            code={correctedCode}
            language={language}
            filename="corrected_solution"
            maxHeight="max-h-[500px]"
          />
        </div>
      )}
    </div>
  );
};
