import React, { useState } from 'react';
import { AnalysisResult } from '../types/detector';
import { ShieldCheck, ShieldAlert, AlertTriangle, AlertOctagon, CheckCircle2, Copy, Check } from 'lucide-react';

interface RiskScoreCardProps {
  result: AnalysisResult;
}

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return { text: 'text-emerald-400', stroke: '#34d399', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
    if (score >= 60) return { text: 'text-amber-400', stroke: '#fbbf24', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
    if (score >= 40) return { text: 'text-orange-400', stroke: '#fb923c', bg: 'bg-orange-500/10', border: 'border-orange-500/30' };
    return { text: 'text-rose-400', stroke: '#f87171', bg: 'bg-rose-500/10', border: 'border-rose-500/30' };
  };

  const getRiskIcon = () => {
    if (result.riskLevel === 'safe' || result.riskLevel === 'low') {
      return <ShieldCheck className="h-6 w-6 text-emerald-400" />;
    }
    if (result.riskLevel === 'suspicious') {
      return <AlertTriangle className="h-6 w-6 text-amber-400" />;
    }
    if (result.riskLevel === 'high_risk') {
      return <ShieldAlert className="h-6 w-6 text-orange-400" />;
    }
    return <AlertOctagon className="h-6 w-6 text-rose-400" />;
  };

  const colors = getScoreColor(result.trustScore);

  const handleCopyReport = () => {
    const reportText = `[PhishGuard Security Audit Report]
Target URL: ${result.inputUrl}
Normalized Host: ${result.parsed.hostname}
Trust Score: ${result.trustScore} / 100
Verdict: ${result.verdict}
Risk Tier: ${result.riskLevel.toUpperCase()}
Summary: ${result.summaryExplanation}

Key Findings (${result.findings.length}):
${result.findings.map(f => `- [${f.severity.toUpperCase()}] ${f.title}: ${f.description}`).join('\n')}

Audited locally by PhishGuard Client-Side Engine.`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-xl border ${colors.border} bg-slate-900/80 p-5 sm:p-6 shadow-xl relative overflow-hidden`}>
      {/* Background radial gradient accent */}
      <div className={`absolute top-0 right-0 w-64 h-64 ${colors.bg} rounded-full blur-3xl -z-10 pointer-events-none opacity-40`} />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left: Score Gauge and Main Verdict */}
        <div className="flex items-center gap-5 sm:gap-6">
          {/* Radial score ring */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-slate-800"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={colors.stroke}
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * result.trustScore) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={`text-2xl font-bold font-mono tabular-nums ${colors.text}`}>
                {result.trustScore}
              </span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                / 100
              </span>
            </div>
          </div>

          {/* Verdict details */}
          <div>
            <div className="flex items-center gap-2">
              {getRiskIcon()}
              <h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${colors.text}`}>
                {result.verdict}
              </h3>
            </div>
            <p className="mt-1 text-sm text-slate-300 max-w-xl">
              {result.summaryExplanation}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span>Risk Tier: <strong className="text-slate-200 capitalize">{result.riskLevel.replace('_', ' ')}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Findings Count: <strong className="text-slate-200 font-mono tabular-nums">{result.findings.length}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Client-Side Engine: <strong className="text-emerald-400">100% Offline Active</strong></span>
            </div>
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>Copied Report</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Export Audit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Indicators Grid */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
        <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800/60">
          <div className="text-[11px] text-slate-400 font-medium">Brand Impersonation</div>
          <div className="mt-1 text-xs font-semibold flex items-center gap-1.5">
            {result.impersonation.isImpersonating ? (
              <span className="text-rose-400">Spoofing {result.impersonation.brand}</span>
            ) : (
              <span className="text-emerald-400">No Mimicry Detected</span>
            )}
          </div>
        </div>

        <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800/60">
          <div className="text-[11px] text-slate-400 font-medium">Homoglyphs / Punycode</div>
          <div className="mt-1 text-xs font-semibold flex items-center gap-1.5">
            {result.homoglyph.hasHomoglyphs ? (
              <span className="text-rose-400">Active IDN Lookalikes</span>
            ) : (
              <span className="text-emerald-400">Clean Unicode Scripts</span>
            )}
          </div>
        </div>

        <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800/60">
          <div className="text-[11px] text-slate-400 font-medium">TLD Risk Profile</div>
          <div className="mt-1 text-xs font-semibold flex items-center gap-1.5">
            {result.tldReputation.isHighRiskForPhishing ? (
              <span className="text-amber-400 font-mono">.{result.tldReputation.tld} (High Abuse)</span>
            ) : (
              <span className="text-slate-200 font-mono">.{result.tldReputation.tld} (Normal)</span>
            )}
          </div>
        </div>

        <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800/60">
          <div className="text-[11px] text-slate-400 font-medium">Connection Protocol</div>
          <div className="mt-1 text-xs font-semibold flex items-center gap-1.5">
            {result.parsed.protocol === 'https' ? (
              <span className="text-emerald-400 font-mono">HTTPS (Encrypted)</span>
            ) : (
              <span className="text-rose-400 font-mono">HTTP (Cleartext)</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
