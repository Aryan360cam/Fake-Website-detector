import React, { useState } from 'react';
import { analyzeUrl } from '../lib/analyzer';
import { AnalysisResult } from '../types/detector';
import { Layers, Download, Play, CheckCircle2, AlertTriangle, AlertOctagon, ExternalLink } from 'lucide-react';

const DEFAULT_BATCH = [
  'https://chase-online-verify-security.xyz',
  'https://github.com',
  'https://xn--appl-43d.com',
  'https://nike-official-outlet-clearance80.shop',
  'https://wikipedia.org',
  'http://192.168.1.1:8080/paypal',
];

interface BatchScannerProps {
  onSelectResult: (result: AnalysisResult) => void;
}

export const BatchScanner: React.FC<BatchScannerProps> = ({ onSelectResult }) => {
  const [inputText, setInputText] = useState(DEFAULT_BATCH.join('\n'));
  const [results, setResults] = useState<AnalysisResult[]>(() =>
    DEFAULT_BATCH.map((u) => analyzeUrl(u))
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRunBatch = () => {
    setIsProcessing(true);
    const lines = inputText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const analyzed = lines.map((u) => analyzeUrl(u));
    setResults(analyzed);
    setIsProcessing(false);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(results, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `phishguard_batch_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-400" />
              <span>Multi-URL Batch Security Auditor</span>
            </h2>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl leading-relaxed">
              Scan multiple suspect URLs simultaneously. Ideal for analyzing email phishing campaigns, security incident response triage, and comparing lookalike threat domains.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              disabled={results.length === 0}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-700 disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Audit JSON</span>
            </button>
          </div>
        </div>

        {/* Input box */}
        <div className="mt-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={5}
            placeholder="Paste one URL per line (e.g. https://domain1.com)..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-xs text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
          />

          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {inputText.split('\n').filter((l) => l.trim()).length} target URLs staged
            </span>
            <button
              onClick={handleRunBatch}
              disabled={isProcessing}
              className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400 active:scale-95"
            >
              <Play className="h-3.5 w-3.5" />
              <span>Audit All URLs</span>
            </button>
          </div>
        </div>
      </div>

      {/* High Density Data Grid */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-200">
            Batch Audit Results ({results.length})
          </span>
          <span>Click any row to open full forensic diagnosis</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-semibold">Target Domain</th>
                <th className="py-3 px-4 font-semibold text-center">Trust Index</th>
                <th className="py-3 px-4 font-semibold">Risk Classification</th>
                <th className="py-3 px-4 font-semibold">Primary Vector / Threat</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {results.map((r) => {
                const isDangerous = r.riskLevel === 'dangerous' || r.riskLevel === 'high_risk';
                const isSuspicious = r.riskLevel === 'suspicious';
                const isSafe = r.riskLevel === 'safe' || r.riskLevel === 'low';

                return (
                  <tr
                    key={r.id}
                    onClick={() => onSelectResult(r)}
                    className="hover:bg-slate-800/40 transition cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-medium text-slate-200 max-w-xs truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-[11px]">{r.parsed.protocol}://</span>
                        <span className="group-hover:text-emerald-400 transition">{r.parsed.hostname}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center tabular-nums font-bold">
                      <span
                        className={
                          r.trustScore >= 80
                            ? 'text-emerald-400'
                            : r.trustScore >= 50
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }
                      >
                        {r.trustScore}/100
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-sans font-medium">
                      {isSafe && (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-xs">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Verified Safe</span>
                        </span>
                      )}
                      {isSuspicious && (
                        <span className="inline-flex items-center gap-1 text-amber-400 text-xs">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span>Suspicious</span>
                        </span>
                      )}
                      {isDangerous && (
                        <span className="inline-flex items-center gap-1 text-rose-400 text-xs font-semibold">
                          <AlertOctagon className="h-3.5 w-3.5" />
                          <span>{r.verdict}</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-sans text-xs text-slate-300">
                      {r.impersonation.isImpersonating ? (
                        <span className="text-rose-400">Spoofing {r.impersonation.brand}</span>
                      ) : r.homoglyph.hasHomoglyphs ? (
                        <span className="text-rose-400">IDN Homoglyph Attack</span>
                      ) : r.findings.length > 0 ? (
                        <span className="text-slate-400">{r.findings[0].title}</span>
                      ) : (
                        <span className="text-slate-500">Standard Baseline</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectResult(r);
                        }}
                        className="text-xs font-sans font-semibold text-emerald-400 hover:text-emerald-300 transition"
                      >
                        View Audit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
