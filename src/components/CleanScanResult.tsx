import React, { useState } from 'react';
import { AnalysisResult } from '../types/detector';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
} from 'lucide-react';

interface CleanScanResultProps {
  result: AnalysisResult;
  onScanAnother: () => void;
}

export const CleanScanResult: React.FC<CleanScanResultProps> = ({ result, onScanAnother }) => {
  const [copied, setCopied] = useState(false);

  const isDangerous = result.riskLevel === 'dangerous';
  const isSuspicious = result.riskLevel === 'suspicious' || result.riskLevel === 'high_risk';
  const isSafe = result.riskLevel === 'safe' || result.riskLevel === 'low';

  const handleCopy = () => {
    const text = `PhishGuard Scan Report
Target: ${result.inputUrl}
Verdict: ${result.verdict}
Safety Score: ${result.trustScore}/100
Summary: ${result.summaryExplanation}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Main Status Banner */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 transition-all shadow-xs ${
          isDangerous
            ? 'border-red-200 bg-red-50/70 text-red-950'
            : isSuspicious
            ? 'border-amber-200 bg-amber-50/70 text-amber-950'
            : 'border-emerald-300 bg-emerald-50/80 text-emerald-950'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-xl shrink-0 ${
                isDangerous
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : isSuspicious
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-emerald-800 text-white shadow-xs'
              }`}
            >
              {isDangerous ? (
                <ShieldAlert className="h-7 w-7" />
              ) : isSuspicious ? (
                <AlertTriangle className="h-7 w-7" />
              ) : (
                <ShieldCheck className="h-7 w-7" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    isDangerous
                      ? 'bg-red-600 text-white font-bold'
                      : isSuspicious
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-emerald-900 text-white font-bold'
                  }`}
                >
                  {isDangerous ? 'Dangerous' : isSuspicious ? 'Suspicious' : 'Safe'}
                </span>
                <span className="text-xs font-mono font-medium text-slate-500">
                  Confidence: {result.trustScore}/100
                </span>
              </div>

              <h2 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {result.verdict}
              </h2>

              <p className="mt-1 text-sm text-slate-700 leading-relaxed max-w-2xl">
                {result.summaryExplanation}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-xs transition"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-800" />
                  <span className="text-emerald-900 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Report</span>
                </>
              )}
            </button>
            <button
              onClick={onScanAnother}
              className="px-3 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-medium transition shadow-xs"
            >
              Check Another
            </button>
          </div>
        </div>

        {/* Safety Score Bar */}
        <div className="mt-6 pt-5 border-t border-slate-200/80">
          <div className="flex justify-between items-center text-xs mb-1.5 text-slate-600">
            <span>Safety Confidence Score</span>
            <span className="font-semibold text-slate-900 font-mono">{result.trustScore}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${
                isDangerous ? 'bg-red-600' : isSuspicious ? 'bg-amber-600' : 'bg-emerald-800'
              }`}
              style={{ width: `${result.trustScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Plain-English URL Dissection */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900">Where this link actually leads</h3>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-sm break-all text-slate-700">
          <span className="text-slate-400">{result.parsed.protocol}://</span>
          {result.parsed.subdomain && (
            <span className="text-amber-700 font-medium">{result.parsed.subdomain}.</span>
          )}
          <span className="text-slate-950 font-bold bg-amber-100/60 px-1 py-0.5 rounded border border-amber-300/60">
            {result.parsed.domainName}
          </span>
          <span className="text-slate-500 font-semibold">.{result.parsed.tld}</span>
          <span className="text-slate-400 text-xs">
            {result.parsed.pathname !== '/' ? result.parsed.pathname : ''}
            {result.parsed.search}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-slate-500">True Root Domain</div>
            <div className="font-bold text-slate-900 font-mono mt-0.5 truncate">
              {result.parsed.domainName}.{result.parsed.tld}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-slate-500">Protocol</div>
            <div className="font-semibold text-slate-900 font-mono mt-0.5 uppercase">
              {result.parsed.protocol}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-slate-500">Domain Extension</div>
            <div className="font-semibold text-slate-900 font-mono mt-0.5">
              .{result.parsed.tld}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-slate-500">Subdomains</div>
            <div className="font-semibold text-slate-900 font-mono mt-0.5 truncate">
              {result.parsed.subdomain || 'None'}
            </div>
          </div>
        </div>

        {result.impersonation.isImpersonating && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-950">
            <strong className="text-red-900 font-bold">Deception Warning: </strong>
            This site uses the name of <strong>{result.impersonation.brand}</strong> in its address,
            but the real official website owned by {result.impersonation.brand} is{' '}
            <strong className="underline text-red-900 font-mono">https://{result.impersonation.officialDomain}</strong>.
          </div>
        )}

        {result.homoglyph.hasHomoglyphs && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-950">
            <strong className="text-red-900 font-bold">Homoglyph Attack: </strong>
            The domain contains foreign script letters disguised to look identical to standard letters. The actual DNS address is{' '}
            <strong className="text-slate-900 font-mono">{result.homoglyph.punycode}</strong>.
          </div>
        )}
      </div>

      {/* 3. Security Checklist */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900">Security Checks</h3>

        <div className="divide-y divide-slate-100">
          {/* Check 1: Impersonation */}
          <div className="py-3.5 flex items-start justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-900">Brand Impersonation & Typosquatting</div>
              <div className="text-slate-600">
                {result.impersonation.isImpersonating
                  ? `Spoofing ${result.impersonation.brand} using character swaps or word additions`
                  : 'No mimicry of recognized banks, tech companies, or retailers'}
              </div>
            </div>
            <div className="shrink-0 mt-0.5">
              {result.impersonation.isImpersonating ? (
                <span className="flex items-center gap-1 text-red-600 font-bold">
                  <XCircle className="h-4 w-4" /> Flagged
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-800 font-bold">
                  <CheckCircle2 className="h-4 w-4" /> Passed
                </span>
              )}
            </div>
          </div>

          {/* Check 2: Homoglyph */}
          <div className="py-3.5 flex items-start justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-900">Lookalike Characters (Homoglyphs)</div>
              <div className="text-slate-600">
                {result.homoglyph.hasHomoglyphs
                  ? 'Uses foreign Unicode letters to disguise the destination address'
                  : 'Standard Latin ASCII characters only'}
              </div>
            </div>
            <div className="shrink-0 mt-0.5">
              {result.homoglyph.hasHomoglyphs ? (
                <span className="flex items-center gap-1 text-red-600 font-bold">
                  <XCircle className="h-4 w-4" /> Flagged
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-800 font-bold">
                  <CheckCircle2 className="h-4 w-4" /> Passed
                </span>
              )}
            </div>
          </div>

          {/* Check 3: TLD Reputation */}
          <div className="py-3.5 flex items-start justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-900">Domain Extension Reputation (.{result.parsed.tld})</div>
              <div className="text-slate-600">
                {result.tldReputation.isHighRiskForPhishing
                  ? `.${result.parsed.tld} has an unusually high abuse rate in global phishing reports`
                  : `.${result.parsed.tld} is a standard, reputable domain extension`}
              </div>
            </div>
            <div className="shrink-0 mt-0.5">
              {result.tldReputation.isHighRiskForPhishing ? (
                <span className="flex items-center gap-1 text-amber-700 font-bold">
                  <AlertTriangle className="h-4 w-4" /> High Abuse TLD
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-800 font-bold">
                  <CheckCircle2 className="h-4 w-4" /> Normal
                </span>
              )}
            </div>
          </div>

          {/* Check 4: Protocol */}
          <div className="py-3.5 flex items-start justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-900">Connection Encryption (HTTPS)</div>
              <div className="text-slate-600">
                {result.parsed.protocol === 'https'
                  ? 'Connection is encrypted using HTTPS'
                  : 'Unencrypted plain HTTP connection (data can be intercepted)'}
              </div>
            </div>
            <div className="shrink-0 mt-0.5">
              {result.parsed.protocol === 'https' ? (
                <span className="flex items-center gap-1 text-emerald-800 font-bold">
                  <CheckCircle2 className="h-4 w-4" /> Encrypted
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-600 font-bold">
                  <XCircle className="h-4 w-4" /> Insecure
                </span>
              )}
            </div>
          </div>

          {/* Check 5: URL Tricks */}
          <div className="py-3.5 flex items-start justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-900">URL Deception & Subdomain Stacking</div>
              <div className="text-slate-600">
                {result.parsed.raw.includes('@')
                  ? 'Uses the "@" symbol to trick users about where the link leads'
                  : result.parsed.subdomain.split('.').length >= 3
                  ? 'Excessive subdomains chained to hide the true domain on mobile screens'
                  : 'Normal link structure without deceptive tricks'}
              </div>
            </div>
            <div className="shrink-0 mt-0.5">
              {result.parsed.raw.includes('@') || result.parsed.subdomain.split('.').length >= 3 ? (
                <span className="flex items-center gap-1 text-red-600 font-bold">
                  <XCircle className="h-4 w-4" /> Suspicious
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-800 font-bold">
                  <CheckCircle2 className="h-4 w-4" /> Clean
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Actionable Advice */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900">What should you do?</h3>
        {isDangerous ? (
          <div className="space-y-2 text-xs text-slate-700">
            <p className="flex items-start gap-2">
              <span className="text-red-600 font-bold text-sm leading-none">•</span>
              <span><strong>Do not visit this link or enter any information.</strong> Do not enter passwords, email addresses, credit cards, or security codes.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-red-600 font-bold text-sm leading-none">•</span>
              <span>If you received this in an email or text message claiming to be an urgent notice from your bank or account, <strong>delete the message</strong>.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-red-600 font-bold text-sm leading-none">•</span>
              <span>If you need to access your account, open a fresh browser tab and manually type the official website address.</span>
            </p>
          </div>
        ) : isSuspicious ? (
          <div className="space-y-2 text-xs text-slate-700">
            <p className="flex items-start gap-2">
              <span className="text-amber-700 font-bold text-sm leading-none">•</span>
              <span><strong>Double check the address bar carefully.</strong> Make sure the domain name matches the company you intend to visit.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-amber-700 font-bold text-sm leading-none">•</span>
              <span>Avoid downloading files or making payments unless you can independently verify who owns this website.</span>
            </p>
          </div>
        ) : (
          <div className="space-y-2 text-xs text-slate-700">
            <p className="flex items-start gap-2">
              <span className="text-emerald-800 font-bold text-sm leading-none">•</span>
              <span>This domain appears authentic and matches standard security best practices.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-emerald-800 font-bold text-sm leading-none">•</span>
              <span>As a general security habit, always verify the padlock icon in your browser address bar.</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
