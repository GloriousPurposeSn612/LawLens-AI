import React from 'react';
import { Scale, ShieldCheck, Globe, Sun, Moon, FileText, AlertTriangle } from 'lucide-react';
import { Language } from '../../shared/types';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLoadSample: (sampleId: 'employment' | 'freelance' | 'injection') => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenLegalNotice: () => void;
  isLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  onLoadSample,
  isDark,
  onToggleTheme,
  onOpenLegalNotice,
  isLoading,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Scale className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xl tracking-tight text-white">LawLens <span className="text-indigo-400">AI</span></span>
            </div>
            <p className="text-xs text-slate-400">Understand. Verify. Act with clarity.</p>
          </div>
        </div>

        {/* Quick Sample Selector for Evaluators */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1">
          <span className="text-xs font-medium text-slate-400 whitespace-nowrap flex items-center gap-1">
            <FileText className="h-3.5 w-3.5 text-indigo-400" /> Demo Samples:
          </span>
          <button
            onClick={() => onLoadSample('employment')}
            disabled={isLoading}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 transition disabled:opacity-50 whitespace-nowrap"
          >
            Employment Offer
          </button>
          <button
            onClick={() => onLoadSample('freelance')}
            disabled={isLoading}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 transition disabled:opacity-50 whitespace-nowrap"
          >
            Freelance Contract
          </button>
          <button
            onClick={() => onLoadSample('injection')}
            disabled={isLoading}
            className="text-xs bg-red-950/60 hover:bg-red-900/60 text-red-300 px-2.5 py-1.5 rounded-lg border border-red-800/60 transition disabled:opacity-50 whitespace-nowrap flex items-center gap-1"
          >
            <AlertTriangle className="h-3 w-3" /> Security Test
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-lg border border-slate-700">
            <Globe className="h-3.5 w-3.5 text-slate-400 ml-1.5" />
            <button
              onClick={() => onLanguageChange('en')}
              className={`text-xs px-2 py-1 rounded-md font-medium transition ${language === 'en' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`text-xs px-2 py-1 rounded-md font-medium transition ${language === 'hi' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              हिंदी
            </button>
            <button
              onClick={() => onLanguageChange('hinglish')}
              className={`text-xs px-2 py-1 rounded-md font-medium transition ${language === 'hinglish' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Hinglish
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
            title="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-400" />}
          </button>

          {/* Legal Boundary Info */}
          <button
            onClick={onOpenLegalNotice}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-300 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 px-2.5 py-1.5 rounded-lg transition"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
            <span>Legal Boundary</span>
          </button>
        </div>
      </div>
    </header>
  );
};
