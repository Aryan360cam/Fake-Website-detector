import React, { useState } from 'react';
import { analyzeUrl } from './lib/analyzer';
import { AnalysisResult } from './types/detector';
import { CleanScanResult } from './components/CleanScanResult';
import { CleanRecentScans } from './components/CleanRecentScans';
import { CleanHowItWorks } from './components/CleanHowItWorks';
import { JavaSourceView } from './components/JavaSourceView';
import { ShieldCheck, X, History, BookOpen, Globe, Code2 } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'phishguard_saved_checks';

const SAMPLE_LINKS = [
  { label: 'Fake Chase Bank', url: 'https://chase-online-verify-security.xyz/login/auth' },
  { label: 'Apple Lookalike (Cyrillic)', url: 'https://xn--appl-43d.com/id/sign-in' },
  { label: 'Nike Scam Store', url: 'https://nike-official-outlet-clearance80.shop' },
  { label: 'PayPal (Safe)', url: 'https://www.paypal.com' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'scanner' | 'recent' | 'guide' | 'java'>('scanner');
  const [urlInput, setUrlInput] = useState('https://chase-online-verify-security.xyz/login/auth');
  const [isScanning, setIsScanning] = useState(false);
  const [activeResult, setActiveResult] = useState<AnalysisResult | null>(() => {
    return analyzeUrl('https://chase-online-verify-security.xyz/login/auth');
  });

  const [history, setHistory] = useState<AnalysisResult[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore
    }
    return [];
  });

  const saveToHistory = (result: AnalysisResult) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.inputUrl !== result.inputUrl);
      const updated = [result, ...filtered].slice(0, 25);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Storage error ignore
      }
      return updated;
    });
  };

  const handleScan = (targetUrl: string) => {
    if (!targetUrl.trim()) return;
    setIsScanning(true);
    setUrlInput(targetUrl);

    // Natural feedback delay
    setTimeout(() => {
      const res = analyzeUrl(targetUrl);
      setActiveResult(res);
      saveToHistory(res);
      setIsScanning(false);
      setActiveTab('scanner');
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleScan(urlInput);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-100 selection:text-emerald-950">
      {/* Clean, authentic Header */}
      <header className="border-b border-slate-200/90 bg-white/95 backdrop-blur sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => setActiveTab('scanner')}
            className="flex items-center gap-2.5 text-left font-semibold tracking-tight group transition"
          >
            <div className="h-7 w-7 rounded-lg bg-emerald-900 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-emerald-950 tracking-tight">PhishGuard</span>
          </button>

          {/* Clean human nav */}
          <nav className="flex items-center gap-1 sm:gap-1.5 text-xs">
            <button
              onClick={() => setActiveTab('scanner')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition font-medium ${
                activeTab === 'scanner'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-950 hover:bg-slate-100'
              }`}
            >
              Scanner
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 ${
                activeTab === 'recent'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-950 hover:bg-slate-100'
              }`}
            >
              <History className="h-3.5 w-3.5" />
              <span>Recent ({history.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 ${
                activeTab === 'guide'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-950 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">How it works</span>
              <span className="sm:hidden">Guide</span>
            </button>
            <button
              onClick={() => setActiveTab('java')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 ${
                activeTab === 'java'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-950 hover:bg-slate-100'
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Java Code</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {activeTab === 'scanner' && (
          <div className="space-y-8">
            {/* Clean Hero */}
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Check if a website is safe before you click
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Detects fake login pages, lookalike brand domains, typosquatting, and scam sites right in your browser.
              </p>
            </div>

            {/* Clean Input Box */}
            <div className="space-y-3">
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex items-center rounded-xl border border-slate-300 bg-white shadow-xs focus-within:border-emerald-800 focus-within:ring-2 focus-within:ring-emerald-800/10 transition">
                  <div className="pl-4 text-emerald-800">
                    <Globe className="h-4 w-4" />
                  </div>

                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Paste website link (e.g. chase-online-verify-security.xyz)..."
                    className="w-full bg-transparent px-3 py-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-mono"
                    spellCheck="false"
                  />

                  {urlInput && (
                    <button
                      type="button"
                      onClick={() => setUrlInput('')}
                      className="p-1 mr-1 text-slate-400 hover:text-slate-600 transition"
                      title="Clear"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}

                  <div className="pr-2">
                    <button
                      type="submit"
                      disabled={!urlInput.trim() || isScanning}
                      className="rounded-lg bg-emerald-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50 active:scale-95 shrink-0 shadow-xs"
                    >
                      {isScanning ? 'Checking...' : 'Check Website'}
                    </button>
                  </div>
                </div>
              </form>

              {/* Sample link triggers */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 pt-1">
                <span>Try an example:</span>
                {SAMPLE_LINKS.map((sample) => (
                  <button
                    key={sample.label}
                    onClick={() => handleScan(sample.url)}
                    className="px-2 py-0.5 rounded-md bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 transition"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Display */}
            {activeResult && (
              <CleanScanResult
                result={activeResult}
                onScanAnother={() => {
                  setUrlInput('');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </div>
        )}

        {/* Recent Scans View */}
        {activeTab === 'recent' && (
          <CleanRecentScans
            history={history}
            onSelect={(item) => {
              setActiveResult(item);
              setUrlInput(item.inputUrl);
              setActiveTab('scanner');
            }}
            onClear={handleClearHistory}
          />
        )}

        {/* How It Works Guide View */}
        {activeTab === 'guide' && <CleanHowItWorks />}

        {/* Java Source Code View */}
        {activeTab === 'java' && <JavaSourceView />}
      </main>

      {/* Clean Human Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-slate-50/60 py-6 text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Built by <strong className="text-emerald-950 font-semibold">Aryan Verma</strong> • 100% Client-Side Privacy
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <button
              onClick={() => setActiveTab('scanner')}
              className="hover:text-emerald-900 transition"
            >
              Scanner
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className="hover:text-emerald-900 transition"
            >
              How it works
            </button>
            <button
              onClick={() => setActiveTab('java')}
              className="hover:text-emerald-900 transition"
            >
              Java Code
            </button>
            <span>No remote servers</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
