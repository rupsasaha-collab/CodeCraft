import React, { useState } from 'react';
import { EXAMPLE_ERRORS } from '../data/examples';
import { ExampleError, SupportedLanguage } from '../types';
import { LANGUAGES } from '../data/languages';
import {
  X,
  Sparkles,
  Search,
  ArrowRight,
  Filter,
  Check,
  Code2,
  Terminal,
} from 'lucide-react';

interface ExamplesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExample: (example: ExampleError) => void;
}

export const ExamplesModal: React.FC<ExamplesModalProps> = ({
  isOpen,
  onClose,
  onSelectExample,
}) => {
  const [selectedLangFilter, setSelectedLangFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredExamples = EXAMPLE_ERRORS.filter((ex) => {
    const matchesLang = selectedLangFilter === 'all' || ex.language === selectedLangFilter;
    const matchesSearch =
      searchQuery === '' ||
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.errorType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLang && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl border border-slate-800 bg-[#090e1a] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0d1322]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Beginner Error Library
              </h2>
              <p className="text-xs text-slate-400">
                Explore classic bugs across C, C++, Python, Java, JavaScript & HTML/CSS
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

        {/* Filter and Search Bar */}
        <div className="p-4 sm:px-6 bg-[#0a0f1d] border-b border-slate-800 flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by error name, concept, or keyword (e.g. segfault, index out of range, null pointer)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#060912] border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Language Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedLangFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedLangFilter === 'all'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-800/40'
              }`}
            >
              All ({EXAMPLE_ERRORS.length})
            </button>
            {Object.values(LANGUAGES).map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLangFilter(lang.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedLangFilter === lang.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-800/40'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Examples Grid List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredExamples.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No matching error examples found. Try a different keyword or language filter.
            </div>
          ) : (
            filteredExamples.map((example) => {
              const langConfig = LANGUAGES[example.language];
              return (
                <div
                  key={example.id}
                  className="group p-4 rounded-xl border border-slate-800/80 bg-[#070b14] hover:bg-[#0c1220] hover:border-emerald-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                        style={{
                          backgroundColor: `${langConfig.iconColor}20`,
                          color: langConfig.iconColor,
                          border: `1px solid ${langConfig.iconColor}40`,
                        }}
                      >
                        {langConfig.name}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400">
                        {example.difficulty}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {example.tag}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                      {example.title}
                    </h3>

                    <p className="text-xs font-mono text-rose-400/90 truncate">
                      {example.errorType}
                    </p>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      {example.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectExample(example);
                      onClose();
                    }}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all shrink-0"
                  >
                    <span>Load Code</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
