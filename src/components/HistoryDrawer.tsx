import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { LANGUAGES } from '../data/languages';
import {
  X,
  History,
  Trash2,
  Download,
  ExternalLink,
  Search,
  Clock,
  Code2,
  FileCode,
} from 'lucide-react';
import { exportHistoryAsJson } from '../utils/storage';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onDeleteItem,
  onClearAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.errorType.toLowerCase().includes(q) ||
      item.language.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.codeSnippet.toLowerCase().includes(q)
    );
  });

  const formatTimestamp = (ts: number): string => {
    const date = new Date(ts);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg h-full bg-[#080d18] border-l border-slate-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#0c1220]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Analysis History</h2>
              <p className="text-xs text-slate-400">
                {history.length} {history.length === 1 ? 'record' : 'records'} stored locally in your browser
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

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-800 bg-[#090f1d] flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search past errors..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#060912] border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {history.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => exportHistoryAsJson(history)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all"
                title="Export history as JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                type="button"
                onClick={onClearAll}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/30 transition-all"
                title="Clear all saved history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            </>
          )}
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs sm:text-sm">
              <History className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p>No error history yet.</p>
              <p className="text-slate-600 mt-1">
                Errors you analyze will automatically be preserved here.
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => {
              const langConfig = LANGUAGES[item.language];
              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-800/80 bg-[#060912] hover:border-emerald-500/40 hover:bg-[#090f1d] transition-all group flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                        style={{
                          backgroundColor: `${langConfig?.iconColor || '#10b981'}20`,
                          color: langConfig?.iconColor || '#10b981',
                        }}
                      >
                        {langConfig?.name || item.language}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(item.timestamp)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item.id);
                      }}
                      className="text-slate-600 hover:text-rose-400 p-1 rounded transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="font-bold text-xs font-mono text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                    {item.errorType}
                  </h4>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <pre className="text-[10px] font-mono text-slate-500 truncate max-w-[200px]">
                      {item.codeSnippet.split('\n')[0]}
                    </pre>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectHistoryItem(item);
                        onClose();
                      }}
                      className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <span>Reload</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
