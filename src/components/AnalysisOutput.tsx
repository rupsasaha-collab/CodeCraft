import React, { useState } from 'react';
import { AnalysisResult, SupportedLanguage } from '../types';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Lightbulb,
  ShieldCheck,
  FileCheck,
  Sparkles,
  BookOpen,
  ArrowRight,
  Share2,
  Copy,
  Check,
  Code2,
  Terminal,
} from 'lucide-react';
import { DiffViewer } from './DiffViewer';
import confetti from 'canvas-confetti';

interface AnalysisOutputProps {
  result: AnalysisResult;
  originalCode: string;
  language: SupportedLanguage;
}

export const AnalysisOutput: React.FC<AnalysisOutputProps> = ({
  result,
  originalCode,
  language,
}) => {
  const [copiedReport, setCopiedReport] = useState(false);

  // Severity color badge mapping
  const severityConfig = {
    critical: {
      bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      icon: AlertCircle,
      label: 'Critical Error',
    },
    warning: {
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      icon: AlertTriangle,
      label: 'Warning / Flaw',
    },
    info: {
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      icon: CheckCircle,
      label: 'Notice',
    },
  }[result.severity || 'critical'];

  const SeverityIcon = severityConfig.icon;

  const handleExportMarkdown = async () => {
    const md = `# CodeCraft Error Diagnostic Report
**Language:** ${language.toUpperCase()}  
**Error Type:** ${result.errorType}  
**Category:** ${result.category}  
**Severity:** ${result.severity.toUpperCase()}  
${result.errorLine ? `**Location:** Line ${result.errorLine}\n` : ''}

## Summary
${result.summary}

## Plain English Explanation
${result.simpleExplanation}

## Root Cause Analysis
${result.rootCause}

## Step-by-Step Solution
${result.stepsToFix.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## Corrected Code
\`\`\`${language}
${result.correctedCode}
\`\`\`

## Key Changes Made
${result.codeDiffSummary.map((d) => `- **${d.lineOrSection}**: ${d.change} (Reason: ${d.reason})`).join('\n')}

## Prevention & Best Practices
${result.preventionTips.map((tip) => `- ${tip}`).join('\n')}

## Educational Concept
${result.educationalConcept}
`;

    try {
      await navigator.clipboard.writeText(md);
      setCopiedReport(true);
      confetti({
        particleCount: 20,
        spread: 30,
        origin: { y: 0.8 },
      });
      setTimeout(() => setCopiedReport(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Banner / Error Classification */}
      <div className="rounded-2xl border border-slate-800 bg-[#0a101f] p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-40 bg-emerald-500/5 rounded-bl-full pointer-events-none" />

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              {/* Severity Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${severityConfig.bg}`}
              >
                <SeverityIcon className="w-3.5 h-3.5" />
                {severityConfig.label}
              </span>

              {/* Category Badge */}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700">
                {result.category}
              </span>

              {/* Error Line if applicable */}
              {result.errorLine && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-medium bg-rose-500/15 text-rose-300 border border-rose-500/30">
                  Line {result.errorLine}
                </span>
              )}

              {/* Educational Concept Pill */}
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-sky-500/15 text-sky-300 border border-sky-500/30">
                <BookOpen className="w-3 h-3 text-sky-400" />
                {result.educationalConcept}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight break-words">
              {result.errorType}
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              {result.summary}
            </p>
          </div>

          {/* Quick Share / Export Report */}
          <button
            type="button"
            onClick={handleExportMarkdown}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
              copiedReport
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-600'
            }`}
            title="Copy full diagnostic report formatted as Markdown"
          >
            {copiedReport ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Report Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-emerald-400" />
                <span>Export Report (.md)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Two Column Layout: Simple Explanation & Possible Root Cause */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Simple Explanation for Beginners */}
        <div className="rounded-2xl border border-emerald-500/20 bg-[#091322] p-5 shadow-lg flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-emerald-400">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
              <Lightbulb className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="font-bold text-sm tracking-wide uppercase text-white">
              Simple Explanation
            </h3>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed flex-1">
            {result.simpleExplanation}
          </p>
        </div>

        {/* Possible Root Cause */}
        <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-5 shadow-lg flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-sky-400">
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center border border-sky-500/30">
              <HelpCircle className="w-4 h-4 text-sky-400" />
            </div>
            <h3 className="font-bold text-sm tracking-wide uppercase text-white">
              Underlying Cause
            </h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed flex-1">
            {result.rootCause}
          </p>
        </div>
      </div>

      {/* Step-by-Step Solution */}
      <div className="rounded-2xl border border-slate-800 bg-[#090e1a] p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="font-bold text-sm sm:text-base text-white">
            Step-by-Step Action Plan
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {result.stepsToFix.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/30 transition-all"
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-sm text-slate-200 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Corrected Code & Before/After Diff */}
      <div className="rounded-2xl border border-slate-800 bg-[#090d18] p-5 sm:p-6 shadow-2xl">
        <DiffViewer
          originalCode={originalCode}
          correctedCode={result.correctedCode}
          language={language}
          errorLine={result.errorLine}
        />
      </div>

      {/* Changes Summary Breakdown */}
      {result.codeDiffSummary && result.codeDiffSummary.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-5 sm:p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/30">
              <FileCheck className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-white">
              Exact Modifications Breakdown
            </h3>
          </div>

          <div className="space-y-3">
            {result.codeDiffSummary.map((diff, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800"
              >
                <div className="flex items-start gap-2.5">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-800 text-purple-300 border border-purple-500/30 shrink-0">
                    {diff.lineOrSection}
                  </span>
                  <div>
                    <span className="text-sm font-semibold text-white block">
                      {diff.change}
                    </span>
                    <span className="text-xs text-slate-400 leading-relaxed block mt-0.5">
                      {diff.reason}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prevention & Best Practices + Verification Test Case */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Prevention Tips */}
        <div className="rounded-2xl border border-slate-800 bg-[#080d1a] p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-3 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <h3 className="font-bold text-sm text-white">
              Prevention & Best Practices
            </h3>
          </div>
          <ul className="space-y-2">
            {result.preventionTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Verification Test Case */}
        {result.testCase && (
          <div className="rounded-2xl border border-slate-800 bg-[#080d1a] p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-3 text-amber-400">
              <Terminal className="w-4 h-4" />
              <h3 className="font-bold text-sm text-white">
                How to Verify This Fix
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              Run this sample input or command to verify the bug is eliminated:
            </p>
            <pre className="p-3 rounded-xl bg-[#060810] border border-slate-800 text-xs font-mono text-emerald-300 whitespace-pre-wrap overflow-x-auto">
              {result.testCase}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
