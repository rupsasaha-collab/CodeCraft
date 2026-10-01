import React, { useState, useEffect, useRef } from 'react';
import { SupportedLanguage, AnalysisResult, HistoryItem, ExampleError } from './types';
import { LANGUAGES } from './data/languages';
import { Header } from './components/Header';
import { LanguageSelector } from './components/LanguageSelector';
import { CodeEditor } from './components/CodeEditor';
import { AnalysisLoading } from './components/AnalysisLoading';
import { AnalysisOutput } from './components/AnalysisOutput';
import { ExamplesModal } from './components/ExamplesModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ProjectInfoModal } from './components/ProjectInfoModal';
import {
  getSavedHistory,
  saveHistoryItem,
  deleteHistoryItem,
  clearAllHistory,
} from './utils/storage';
import {
  Sparkles,
  Play,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Bug,
  Code2,
  ShieldAlert,
  ArrowRight,
  Info,
  ServerCrash,
  Loader2,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ApiErrorInfo {
  title: string;
  message: string;
  isServiceUnavailable?: boolean;
  isRetryable?: boolean;
  technicalDetails?: string;
}

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('python');
  const [code, setCode] = useState<string>(LANGUAGES.python.placeholderCode);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [userContext, setUserContext] = useState<string>('');

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [apiError, setApiError] = useState<ApiErrorInfo | null>(null);

  // History and Modals
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isExamplesOpen, setIsExamplesOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isProjectInfoOpen, setIsProjectInfoOpen] = useState<boolean>(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Initialize history from localStorage
  useEffect(() => {
    setHistory(getSavedHistory());
  }, []);

  // Handle language switch
  const handleSelectLanguage = (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
    // If the current code is empty or matches another placeholder, switch placeholder
    const currentIsPlaceholder = Object.values(LANGUAGES).some(
      (l) => l.placeholderCode.trim() === code.trim()
    );
    if (!code.trim() || currentIsPlaceholder) {
      setCode(LANGUAGES[lang].placeholderCode);
    }
  };

  // Clear fields
  const handleClear = () => {
    setCode('');
    setErrorMessage('');
    setUserContext('');
    setApiError(null);
  };

  // Reset to default language placeholder
  const handleReset = () => {
    setCode(LANGUAGES[selectedLanguage].placeholderCode);
    setErrorMessage('');
    setUserContext('');
    setApiError(null);
    setAnalysisResult(null);
  };

  // Load selected example
  const handleSelectExample = (example: ExampleError) => {
    setSelectedLanguage(example.language);
    setCode(example.code);
    setErrorMessage(example.errorMessage);
    setUserContext(`Beginner example investigation: ${example.title}`);
    setApiError(null);
    setAnalysisResult(null);
  };

  // Load item from history
  const handleSelectHistoryItem = (item: HistoryItem) => {
    setSelectedLanguage(item.language);
    setCode(item.codeSnippet);
    setErrorMessage(item.errorMessageSnippet || '');
    setAnalysisResult(item.result);
    setApiError(null);

    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = deleteHistoryItem(id);
    setHistory(updated);
  };

  const handleClearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear all debugging history?')) {
      clearAllHistory();
      setHistory([]);
    }
  };

  // Execute Analysis
  const handleAnalyze = async (isRetryAttempt: boolean = false) => {
    if (!code.trim() && !errorMessage.trim()) {
      setApiError({
        title: 'Input Notice',
        message: 'Please enter some code or paste a compiler error message to begin analysis.',
        isServiceUnavailable: false,
        isRetryable: false,
      });
      return;
    }

    setIsAnalyzing(true);
    if (isRetryAttempt) {
      setIsRetrying(true);
    }
    setApiError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/analyze-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: selectedLanguage,
          code,
          errorMessage,
          userContext,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data || !data.success) {
        const is503 = response.status === 503 || data?.isServiceUnavailable;
        const is429 = response.status === 429;
        const fallbackMsg = is503
          ? 'The AI analysis model is currently experiencing high demand or is temporarily unavailable. Your code has been preserved. Please click Retry below to run your analysis again.'
          : is429
          ? 'The AI model is receiving high traffic. Please wait a few seconds and click Retry.'
          : 'Error analysis failed. Please verify your inputs and try again.';

        setApiError({
          title: is503
            ? 'AI Model Temporarily Unavailable (503)'
            : is429
            ? 'Model Traffic Limit (429)'
            : 'Analysis Notice',
          message: data?.message || fallbackMsg,
          isServiceUnavailable: is503 || is429,
          isRetryable: data?.retryable ?? true,
          technicalDetails: data?.technicalDetails,
        });
        return;
      }

      const result: AnalysisResult = data.data;
      setAnalysisResult(result);

      // Save to history
      const historyItem: HistoryItem = {
        id: `analysis_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        timestamp: Date.now(),
        language: selectedLanguage,
        codeSnippet: code,
        errorMessageSnippet: errorMessage,
        errorType: result.errorType,
        summary: result.summary,
        result,
      };

      const updatedHistory = saveHistoryItem(historyItem);
      setHistory(updatedHistory);

      // Confetti burst for successful diagnosis
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#10b981', '#34d399', '#38bdf8'],
      });

      // Smooth scroll down to the diagnostic report
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err: unknown) {
      console.error('Analysis request network error:', err);
      setApiError({
        title: 'Connection Issue',
        message: 'Could not connect to the CodeCraft analysis server. The service may be restarting or temporarily unreachable. Please click Retry to test again.',
        isServiceUnavailable: true,
        isRetryable: true,
      });
    } finally {
      setIsAnalyzing(false);
      setIsRetrying(false);
    }
  };

  // Shortcut: Cmd/Ctrl + Enter triggers analysis
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isAnalyzing) {
          handleAnalyze();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, errorMessage, userContext, selectedLanguage, isAnalyzing]);

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Header */}
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenExamples={() => setIsExamplesOpen(true)}
        onOpenProjectInfo={() => setIsProjectInfoOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-8">
        {/* Hero Banner / Headline */}
        <section className="relative text-center sm:text-left py-4 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-800/80">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen AI Debugger & Learning Companion</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
              Decode Errors. <span className="text-emerald-400">Build Solutions.</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Paste your buggy code or terminal errors in C, C++, Python, Java, JavaScript, or HTML/CSS.
              CodeCraft pinpoints the root cause, explains it in simple terms, and generates clean, verified fixes.
            </p>
          </div>

          {/* Quick Stats / Highlights */}
          <div className="grid grid-cols-3 gap-3 shrink-0 self-center sm:self-auto">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="block text-lg font-bold text-white font-mono">6</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase">Languages</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="block text-lg font-bold text-emerald-400 font-mono">AST</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase">Analysis</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="block text-lg font-bold text-sky-400 font-mono">100%</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase">Verified</span>
            </div>
          </div>
        </section>

        {/* Language Selection */}
        <section>
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onSelectLanguage={handleSelectLanguage}
            disabled={isAnalyzing}
          />
        </section>

        {/* Input Code Editor Area */}
        <section className="space-y-4">
          <CodeEditor
            language={selectedLanguage}
            code={code}
            onChangeCode={setCode}
            errorMessage={errorMessage}
            onChangeErrorMessage={setErrorMessage}
            userContext={userContext}
            onChangeUserContext={setUserContext}
            onClear={handleClear}
            onReset={handleReset}
            disabled={isAnalyzing}
          />

          {/* API / Validation / 503 Error Banner */}
          {apiError && (
            <div
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
                apiError.isServiceUnavailable
                  ? 'bg-amber-950/25 border-amber-500/40 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  {apiError.isServiceUnavailable ? (
                    <ServerCrash className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">
                        {apiError.title}
                      </span>
                      {apiError.isServiceUnavailable && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          503 Status
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                      {apiError.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {apiError.isRetryable && (
                    <button
                      type="button"
                      onClick={() => handleAnalyze(true)}
                      disabled={isAnalyzing}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {isRetrying ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-300" />
                      ) : (
                        <RotateCcw className="w-3.5 h-3.5 text-emerald-300" />
                      )}
                      <span>{isRetrying ? 'Retrying...' : 'Retry'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setApiError(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                    title="Dismiss notification"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Bar / Primary Trigger */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">
                  Ctrl
                </kbd>
                +
                <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">
                  Enter
                </kbd>
              </span>
              <span>to quick analyze</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsExamplesOpen(true)}
                disabled={isAnalyzing}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Load Sample Error</span>
              </button>

              <button
                type="button"
                onClick={() => handleAnalyze(false)}
                disabled={isAnalyzing}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>{isRetrying ? 'Retrying Analysis...' : 'Analyzing Bug...'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>{apiError?.isRetryable ? 'Retry Analysis' : 'Analyze Error'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Results / Diagnostic Output Section */}
        <section ref={resultsRef} className="pt-4 scroll-mt-20">
          {isAnalyzing && <AnalysisLoading />}

          {analysisResult && !isAnalyzing && (
            <AnalysisOutput
              result={analysisResult}
              originalCode={code}
              language={selectedLanguage}
            />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#060912] py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_6px_#10b981]" />
            <span className="text-slate-300 font-bold">CodeCraft</span>
            <span className="text-slate-600">•</span>
            <span>Decode Errors. Build Solutions.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsProjectInfoOpen(true)}
              className="hover:text-emerald-400 transition-colors"
            >
              Architecture & Documentation
            </button>
            <span>•</span>
            <button
              onClick={() => setIsExamplesOpen(true)}
              className="hover:text-emerald-400 transition-colors"
            >
              Error Catalog
            </button>
            <span>•</span>
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="hover:text-emerald-400 transition-colors"
            >
              History ({history.length})
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ExamplesModal
        isOpen={isExamplesOpen}
        onClose={() => setIsExamplesOpen(false)}
        onSelectExample={handleSelectExample}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onDeleteItem={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />

      <ProjectInfoModal
        isOpen={isProjectInfoOpen}
        onClose={() => setIsProjectInfoOpen(false)}
      />
    </div>
  );
}
