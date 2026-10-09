import React from 'react';
import { AnalysisResult } from '../types/detector';
import { History, Trash2, ArrowRight, Download, ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

interface ScanHistoryViewProps {
  history: AnalysisResult[];
  onSelectResult: (result: AnalysisResult) => void;
  onClearHistory: () => void;
}

export const ScanHistoryView: React.FC<ScanHistoryViewProps> = ({
  history,
  onSelectResult,
  onClearHistory,
}) => {
  const handleExportHistory = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `phishguard_audit_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <History className="h-5 w-5 text-emerald-400" />
            <span>Audit History & Local Records</span>
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Locally stored security scans conducted during this browser session. Persisted in private client storage.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportHistory}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export History</span>
            </button>
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 rounded-lg border border-rose-900/50 bg-rose-950/40 px-3 py-1.5 text-xs font-medium text-rose-300 transition hover:bg-rose-900/60"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>

      {/* History Table */}
      {history.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-500">
          <History className="h-10 w-10 mx-auto text-slate-600 mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No Audits Recorded Yet</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Scan any website URL in the URL Scanner or test one of the quick presets to populate your local audit log.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 font-semibold">Timestamp</th>
                  <th className="py-3 px-4 font-semibold">Target Domain</th>
                  <th className="py-3 px-4 font-semibold text-center">Score</th>
                  <th className="py-3 px-4 font-semibold">Verdict</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {history.map((item) => {
                  const dateStr = new Date(item.analyzedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  });

                  return (
                    <tr
                      key={item.id}
                      onClick={() => onSelectResult(item)}
                      className="hover:bg-slate-800/40 transition cursor-pointer group"
                    >
                      <td className="py-3 px-4 text-slate-400 tabular-nums">
                        {dateStr}
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-200 truncate max-w-xs group-hover:text-emerald-400 transition">
                        {item.parsed.hostname}
                      </td>

                      <td className="py-3 px-4 text-center tabular-nums font-bold">
                        <span
                          className={
                            item.trustScore >= 80
                              ? 'text-emerald-400'
                              : item.trustScore >= 50
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }
                        >
                          {item.trustScore}/100
                        </span>
                      </td>

                      <td className="py-3 px-4 font-sans">
                        <span
                          className={`text-xs font-semibold ${
                            item.riskLevel === 'dangerous' || item.riskLevel === 'high_risk'
                              ? 'text-rose-400'
                              : item.riskLevel === 'suspicious'
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {item.verdict}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectResult(item);
                          }}
                          className="text-xs font-sans font-semibold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1 justify-end ml-auto"
                        >
                          <span>Open</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
