import React, { useRef, useState } from 'react';
import { SupportedLanguage } from '../types';
import { LANGUAGES } from '../data/languages';
import {
  FileCode,
  Trash2,
  Upload,
  Copy,
  Terminal,
  RotateCcw,
  Sparkles,
  Info,
  Maximize2,
  Check,
} from 'lucide-react';

interface CodeEditorProps {
  language: SupportedLanguage;
  code: string;
  onChangeCode: (newCode: string) => void;
  errorMessage: string;
  onChangeErrorMessage: (newError: string) => void;
  userContext: string;
  onChangeUserContext: (newContext: string) => void;
  onClear: () => void;
  onReset: () => void;
  disabled?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  code,
  onChangeCode,
  errorMessage,
  onChangeErrorMessage,
  userContext,
  onChangeUserContext,
  onClear,
  onReset,
  disabled = false,
}) => {
  const [activeTab, setActiveTab] = useState<'code' | 'error' | 'context'>('code');
  const [copiedCode, setCopiedCode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const langConfig = LANGUAGES[language];
  const codeLines = code.split('\n');
  const lineCount = codeLines.length;

  // Handle Tab key in code editor
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const spaces = '  '; // 2 spaces

      const updated = code.substring(0, start) + spaces + code.substring(end);
      onChangeCode(updated);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + spaces.length;
      }, 0);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onChangeCode(content);
        setActiveTab('code');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCopyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-[#090d18] shadow-2xl overflow-hidden transition-all duration-300">
      {/* Editor Header / Tabs */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-[#0d1322] border-b border-slate-800 gap-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'code'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-400" />
            <span>Code Input</span>
            {code.trim().length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('error')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'error'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.15)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-rose-400" />
            <span>Compiler / Error Output</span>
            {errorMessage.trim().length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('context')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'context'
                ? 'bg-sky-500/15 text-sky-300 border border-sky-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Additional Notes</span>
            <span className="sm:hidden">Notes</span>
          </button>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-1.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".py,.js,.jsx,.ts,.tsx,.c,.cpp,.h,.hpp,.java,.html,.css,.txt"
          />

          <button
            type="button"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all"
            title="Upload source file from computer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Upload</span>
          </button>

          {code.trim().length > 0 && (
            <button
              type="button"
              onClick={handleCopyCode}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all"
              title="Copy code"
            >
              {copiedCode ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span className="hidden md:inline">{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          )}

          <button
            type="button"
            disabled={disabled}
            onClick={onClear}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 border border-slate-800 hover:border-rose-900/50 transition-all"
            title="Clear all text in active fields"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={onReset}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all"
            title="Reset to template placeholder"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Editor Main Content Area */}
      <div className="relative min-h-[340px] sm:min-h-[400px] flex flex-col bg-[#070b14]">
        {activeTab === 'code' && (
          <div className="relative flex flex-1 overflow-hidden">
            {/* Line numbers gutter */}
            <div className="select-none py-4 px-3 bg-[#0a0f1d] border-r border-slate-800/80 text-right text-xs font-mono text-slate-600 w-12 sm:w-14">
              {Array.from({ length: Math.max(lineCount, 12) }, (_, i) => (
                <div key={i} className="leading-6">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Textarea */}
            <div className="relative flex-1">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => onChangeCode(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                placeholder={`// Paste your ${langConfig.name} code here...\n// Or click 'Try Examples' in the top bar to inspect realistic beginner errors.`}
                spellCheck={false}
                className="w-full h-full min-h-[340px] sm:min-h-[400px] p-4 bg-transparent text-slate-100 font-mono text-sm leading-6 resize-none focus:outline-none placeholder:text-slate-600"
              />
            </div>
          </div>
        )}

        {activeTab === 'error' && (
          <div className="p-4 flex-1 flex flex-col bg-[#0a0d18]">
            <div className="mb-2 flex items-center justify-between text-xs text-rose-300">
              <span className="flex items-center gap-1.5 font-semibold">
                <Terminal className="w-4 h-4 text-rose-400" />
                Paste Compiler Error, Stack Trace, or Terminal Output
              </span>
              <span className="text-slate-500 font-mono text-[11px]">
                e.g. GCC error, Python Traceback, Java Exception
              </span>
            </div>
            <textarea
              value={errorMessage}
              onChange={(e) => onChangeErrorMessage(e.target.value)}
              disabled={disabled}
              placeholder={`Paste the terminal output or compiler error message here...\nExample:\nTraceback (most recent call last):\n  File "app.py", line 12, in <module>\n    total += numbers[i]\nIndexError: list index out of range`}
              spellCheck={false}
              className="w-full flex-1 min-h-[300px] p-3.5 rounded-xl bg-[#060810] border border-rose-900/40 text-rose-200/90 font-mono text-xs leading-5 resize-none focus:outline-none focus:ring-1 focus:ring-rose-500/50 placeholder:text-slate-700"
            />
          </div>
        )}

        {activeTab === 'context' && (
          <div className="p-4 flex-1 flex flex-col bg-[#090e1a]">
            <div className="mb-2 flex items-center justify-between text-xs text-sky-300">
              <span className="flex items-center gap-1.5 font-semibold">
                <Info className="w-4 h-4 text-sky-400" />
                Additional Details / What You Tried (Optional)
              </span>
            </div>
            <textarea
              value={userContext}
              onChange={(e) => onChangeUserContext(e.target.value)}
              disabled={disabled}
              placeholder="Describe what you want this code to achieve, specific environment constraints (e.g. college assignment requirements, memory limits, compiler flags), or what you have tried so far..."
              className="w-full flex-1 min-h-[300px] p-3.5 rounded-xl bg-[#060810] border border-sky-900/40 text-slate-200 font-sans text-sm leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-sky-500/50 placeholder:text-slate-600"
            />
          </div>
        )}
      </div>

      {/* Editor Footer Status Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-[#0a0f1d] border-t border-slate-800 text-[11px] font-mono text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: langConfig.iconColor }}
            />
            {langConfig.name} ({langConfig.extension})
          </span>
          <span>
            {lineCount} {lineCount === 1 ? 'line' : 'lines'}
          </span>
          <span>{code.length} characters</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-slate-600">
            Tab key: 2 spaces
          </span>
          {errorMessage.trim().length > 0 && (
            <span className="text-rose-400/90 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              Terminal log attached
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
