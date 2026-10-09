import React from 'react';
import { AnalysisResult } from '../types/detector';
import { History, Trash2, ArrowRight, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface CleanRecentScansProps {
  history: AnalysisResult[];
  onSelect: (result: AnalysisResult) => void;
  onClear: () => void;
}

export const CleanRecentScans: React.FC<CleanRecentScansProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-12 text-center text-slate-500 shadow-xs">
        <History className="h-8 w-8 mx-auto text-slate-400 mb-3" />
        <h3 className="text-sm font-semibold text-slate-800">No recent scans</h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
          Websites you check during this session will be listed here for quick reference.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-emerald-900" />
          <h3 className="text-sm font-bold text-slate-900">
            Recent Checks ({history.length})
          </h3>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-600 transition"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Clear list</span>
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {history.map((item) => {
          const isDangerous = item.riskLevel === 'dangerous';
          const isSuspicious = item.riskLevel === 'suspicious' || item.riskLevel === 'high_risk';
          const dateStr = new Date(item.analyzedAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className="py-3.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 px-2 rounded-lg transition"
            >
              <div className="flex items-center gap-3 truncate">
                <div className="shrink-0">
                  {isDangerous ? (
                    <ShieldAlert className="h-4 w-4 text-red-600" />
                  ) : isSuspicious ? (
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  ) : (
                    <ShieldCheck className="h-4 w-4 text-emerald-800" />
                  )}
                </div>

                <div className="truncate">
                  <div className="text-xs font-semibold text-slate-900 truncate font-mono">
                    {item.parsed.hostname}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {item.verdict}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                  {dateStr}
                </span>

                <span
                  className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                    isDangerous
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : isSuspicious
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  }`}
                >
                  {item.trustScore}%
                </span>

                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
