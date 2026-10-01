import React from 'react';
import { SupportedLanguage } from '../types';
import { LANGUAGES } from '../data/languages';
import { Code2, Sparkles } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  disabled?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onSelectLanguage,
  disabled = false,
}) => {
  const languagesList = Object.values(LANGUAGES);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Programming Language</span>
        </label>
        <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
          Target: {LANGUAGES[selectedLanguage].compilerName}
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {languagesList.map((lang) => {
          const isSelected = selectedLanguage === lang.id;
          return (
            <button
              key={lang.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectLanguage(lang.id)}
              className={`group relative flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                isSelected
                  ? 'bg-emerald-500/10 border-emerald-500/60 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30'
                  : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 hover:border-slate-700'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: lang.iconColor }}
                />
                <span className="font-mono text-xs font-bold tracking-tight">
                  {lang.badge}
                </span>
              </div>
              <span className="text-[11px] font-medium mt-1 truncate max-w-full">
                {lang.name}
              </span>

              {isSelected && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#10b981]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
