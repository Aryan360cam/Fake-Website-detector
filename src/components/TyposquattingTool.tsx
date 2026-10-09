import React, { useState } from 'react';
import { generateTyposquattingVariations } from '../lib/typosquattingEngine';
import { ShieldCheck, ShieldAlert, AlertTriangle, ArrowRight, Sparkles, Copy, Check } from 'lucide-react';

interface TyposquattingToolProps {
  onTestUrl: (url: string) => void;
}

export const TyposquattingTool: React.FC<TyposquattingToolProps> = ({ onTestUrl }) => {
  const [inputDomain, setInputDomain] = useState('paypal.com');
  const [results, setResults] = useState(() => generateTyposquattingVariations('paypal.com'));
  const [copiedDomain, setCopiedDomain] = useState<string | null>(null);

  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputDomain.trim()) {
      setResults(generateTyposquattingVariations(inputDomain.trim()));
    }
  };

  const handleCopy = (domain: string) => {
    navigator.clipboard.writeText(domain);
    setCopiedDomain(domain);
    setTimeout(() => setCopiedDomain(null), 1500);
  };

  const presetExamples = ['paypal.com', 'apple.com', 'chase.com', 'netflix.com', 'binance.com'];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Brand Typosquatting & Lookalike Generator
        </h2>
        <p className="mt-1 text-sm text-slate-300 max-w-3xl leading-relaxed">
          Simulate how malicious cybercriminals weaponize typos, homoglyphs, visual letter substitutions, and combo-squatting against authentic websites. Enter any brand or your company domain to discover potential phishing spoof vectors.
        </p>

        {/* Input form */}
        <form onSubmit={handleGenerate} className="mt-5 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={inputDomain}
            onChange={(e) => setInputDomain(e.target.value)}
            placeholder="Enter legitimate domain (e.g. paypal.com, mycompany.org)"
            className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 font-mono text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400 active:scale-95 whitespace-nowrap shrink-0"
          >
            Generate Attack Vectors
          </button>
        </form>

        {/* Quick Presets */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400">Quick tests:</span>
          {presetExamples.map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setInputDomain(ex);
                setResults(generateTyposquattingVariations(ex));
              }}
              className="rounded bg-slate-800 px-2.5 py-1 text-slate-300 transition hover:bg-slate-700 hover:text-white font-mono"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Generated Lookalike Vectors ({results.length})</span>
          <span>Click "Audit in Scanner" to test any spoofed domain in real time</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {results.map((item, index) => {
            const isCopied = copiedDomain === item.domain;
            const badgeColor =
              item.dangerLevel === 'Critical'
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : item.dangerLevel === 'Severe'
                ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30';

            return (
              <div
                key={index}
                className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-4 transition hover:border-slate-700 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-sm font-bold text-slate-100 break-all">
                      {item.domain}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${badgeColor} whitespace-nowrap shrink-0`}>
                      {item.dangerLevel}
                    </span>
                  </div>

                  <div className="mt-1 text-xs font-medium text-emerald-400">
                    {item.type}
                  </div>

                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => handleCopy(item.domain)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy Domain</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onTestUrl(`https://${item.domain}`)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition"
                  >
                    <span>Audit in Scanner</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
