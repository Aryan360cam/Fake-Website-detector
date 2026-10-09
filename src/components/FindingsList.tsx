import React, { useState } from 'react';
import { AnalysisFinding, Severity } from '../types/detector';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface FindingsListProps {
  findings: AnalysisFinding[];
}

export const FindingsList: React.FC<FindingsListProps> = ({ findings }) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'pass'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFindings = findings.filter((f) => {
    if (filter === 'all') return true;
    return f.severity === filter;
  });

  const getSeverityBadge = (severity: Severity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Critical Threat</span>
          </span>
        );
      case 'warning':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Warning Flag</span>
          </span>
        );
      case 'pass':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Passed Verification</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            <Info className="h-3.5 w-3.5" />
            <span>Informational</span>
          </span>
        );
    }
  };

  const criticalCount = findings.filter((f) => f.severity === 'critical').length;
  const warningCount = findings.filter((f) => f.severity === 'warning').length;
  const passCount = findings.filter((f) => f.severity === 'pass').length;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-100">
            Detailed Diagnostic Findings ({findings.length})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Individual threat vectors, syntactic indicators, and protocol verification checks
          </p>
        </div>

        {/* Functional filter control */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition ${
              filter === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({findings.length})
          </button>
          <button
            onClick={() => setFilter('critical')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition ${
              filter === 'critical'
                ? 'bg-rose-950 text-rose-300 shadow-sm border border-rose-800/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Critical ({criticalCount})
          </button>
          <button
            onClick={() => setFilter('warning')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition ${
              filter === 'warning'
                ? 'bg-amber-950 text-amber-300 shadow-sm border border-amber-800/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Warnings ({warningCount})
          </button>
          <button
            onClick={() => setFilter('pass')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition ${
              filter === 'pass'
                ? 'bg-emerald-950 text-emerald-300 shadow-sm border border-emerald-800/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Passed ({passCount})
          </button>
        </div>
      </div>

      {/* Findings items */}
      <div className="mt-4 space-y-3">
        {filteredFindings.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500 rounded-lg bg-slate-950/40 border border-slate-800/50">
            No diagnostic findings matched the active filter ({filter}).
          </div>
        ) : (
          filteredFindings.map((finding) => {
            const isExpanded = expandedId === finding.id;
            return (
              <div
                key={finding.id}
                className="rounded-lg border border-slate-800/90 bg-slate-950/70 p-4 transition hover:border-slate-700/80"
              >
                <div
                  className="flex items-start justify-between gap-3 cursor-pointer select-none"
                  onClick={() => setExpandedId(isExpanded ? null : finding.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    {getSeverityBadge(finding.severity)}
                    <h4 className="text-sm font-semibold text-slate-100">
                      {finding.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {finding.scoreImpact > 0 && (
                      <span className="font-mono text-xs font-semibold text-rose-400 tabular-nums">
                        -{finding.scoreImpact} pts
                      </span>
                    )}
                    <button className="text-slate-400 hover:text-slate-200 p-0.5">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {finding.description}
                </p>

                {/* Expanded forensic context & advice */}
                {isExpanded && (
                  <div className="mt-3.5 space-y-2.5 pt-3 border-t border-slate-800 text-xs">
                    <div>
                      <span className="font-medium text-slate-400">Technical Details:</span>
                      <p className="mt-0.5 font-mono text-[11px] text-slate-300 bg-slate-900 p-2 rounded border border-slate-800/80">
                        {finding.technicalDetail}
                      </p>
                    </div>

                    <div className="rounded bg-emerald-950/20 p-2.5 border border-emerald-900/30 text-emerald-200/90">
                      <span className="font-semibold text-emerald-400">Defensive Action: </span>
                      {finding.recommendation}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
