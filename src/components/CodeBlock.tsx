import React, { useState } from 'react';
import { Copy, Check, Download, AlertTriangle, FileCode } from 'lucide-react';
import { highlightCode } from '../utils/highlighter';
import confetti from 'canvas-confetti';

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  errorLine?: number | null;
  showLineNumbers?: boolean;
  maxHeight?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  filename,
  errorLine = null,
  showLineNumbers = true,
  maxHeight = 'max-h-[500px]',
}) => {
  const [copied, setCopied] = useState(false);

  const lines = code.split('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.8 },
        colors: ['#10b981', '#34d399', '#6ee7b7'],
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `solution-${Date.now()}.${getFileExtension(language)}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getFileExtension = (lang: string): string => {
    const extMap: Record<string, string> = {
      python: 'py',
      javascript: 'js',
      c: 'c',
      cpp: 'cpp',
      java: 'java',
      html_css: 'html',
      html: 'html',
      css: 'css',
    };
    return extMap[lang] || 'txt';
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#090e1a] shadow-xl">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          {/* macOS style dots */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <FileCode className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-mono font-medium text-slate-300">
            {filename || `solution.${getFileExtension(language)}`}
          </span>

          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-slate-800 text-slate-400 border border-slate-700/60">
            {language}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all"
            title="Download file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
            }`}
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className={`overflow-x-auto ${maxHeight} text-sm font-mono p-4 leading-relaxed`}>
        {showLineNumbers ? (
          <div className="table w-full">
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isError = errorLine === lineNum;
              const highlightedLine = highlightCode(line || ' ', language);

              return (
                <div
                  key={idx}
                  className={`table-row ${
                    isError
                      ? 'bg-rose-950/40 border-l-2 border-rose-500 text-rose-200'
                      : 'hover:bg-slate-800/30'
                  }`}
                >
                  <span
                    className={`table-cell select-none pr-4 text-right align-top text-xs w-10 ${
                      isError
                        ? 'text-rose-400 font-bold bg-rose-950/50'
                        : 'text-slate-600'
                    }`}
                  >
                    {isError ? (
                      <span className="flex items-center justify-end gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-400 inline" />
                        {lineNum}
                      </span>
                    ) : (
                      lineNum
                    )}
                  </span>
                  <span
                    className="table-cell whitespace-pre align-top pl-2"
                    dangerouslySetInnerHTML={{ __html: highlightedLine }}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <pre
            className="whitespace-pre overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: highlightCode(code, language) }}
          />
        )}
      </div>
    </div>
  );
};
