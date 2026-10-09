import React from 'react';
import { ShieldCheck, History } from 'lucide-react';

interface NavbarProps {
  activeTab: 'scanner' | 'typosquat' | 'sandbox' | 'batch' | 'guide' | 'history';
  onSelectTab: (tab: 'scanner' | 'typosquat' | 'sandbox' | 'batch' | 'guide' | 'history') => void;
  historyCount: number;
  onQuickDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  historyCount,
  onQuickDemo,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={() => onSelectTab('scanner')}
          className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-emerald-400 transition-colors"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span>PhishGuard</span>
        </button>

        {/* Zone 2: 4-5 concise single-line text links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectTab('scanner')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'scanner'
                ? 'text-emerald-400 border-b-2 border-emerald-400 pb-0.5'
                : 'hover:text-white'
            }`}
          >
            URL Scanner
          </button>
          <button
            onClick={() => onSelectTab('typosquat')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'typosquat'
                ? 'text-emerald-400 border-b-2 border-emerald-400 pb-0.5'
                : 'hover:text-white'
            }`}
          >
            Lookalike Generator
          </button>
          <button
            onClick={() => onSelectTab('sandbox')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'sandbox'
                ? 'text-emerald-400 border-b-2 border-emerald-400 pb-0.5'
                : 'hover:text-white'
            }`}
          >
            Content Inspector
          </button>
          <button
            onClick={() => onSelectTab('batch')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'batch'
                ? 'text-emerald-400 border-b-2 border-emerald-400 pb-0.5'
                : 'hover:text-white'
            }`}
          >
            Batch Auditor
          </button>
          <button
            onClick={() => onSelectTab('guide')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'guide'
                ? 'text-emerald-400 border-b-2 border-emerald-400 pb-0.5'
                : 'hover:text-white'
            }`}
          >
            Scam Patterns
          </button>
          <button
            onClick={() => onSelectTab('history')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'history'
                ? 'text-emerald-400 border-b-2 border-emerald-400 pb-0.5'
                : 'hover:text-white'
            }`}
          >
            <History className="h-4 w-4" />
            <span>Audits ({historyCount})</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onQuickDemo}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400 whitespace-nowrap shrink-0 active:scale-95"
          >
            Test Phishing Sample
          </button>
        </div>
      </div>

      {/* Mobile nav drawer tabs */}
      <div className="flex md:hidden items-center gap-2 overflow-x-auto px-4 py-2 border-t border-slate-900 text-xs">
        <button
          onClick={() => onSelectTab('scanner')}
          className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 ${
            activeTab === 'scanner' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Scanner
        </button>
        <button
          onClick={() => onSelectTab('typosquat')}
          className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 ${
            activeTab === 'typosquat' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Lookalike Tool
        </button>
        <button
          onClick={() => onSelectTab('sandbox')}
          className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 ${
            activeTab === 'sandbox' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Inspector
        </button>
        <button
          onClick={() => onSelectTab('batch')}
          className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 ${
            activeTab === 'batch' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Batch
        </button>
        <button
          onClick={() => onSelectTab('guide')}
          className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 ${
            activeTab === 'guide' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Guide
        </button>
        <button
          onClick={() => onSelectTab('history')}
          className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 ${
            activeTab === 'history' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400'
          }`}
        >
          History ({historyCount})
        </button>
      </div>
    </header>
  );
};
