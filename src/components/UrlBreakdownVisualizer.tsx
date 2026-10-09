import React from 'react';
import { ParsedUrlDetails } from '../types/detector';
import { ShieldAlert, Info } from 'lucide-react';

interface UrlBreakdownVisualizerProps {
  parsed: ParsedUrlDetails;
}

export const UrlBreakdownVisualizer: React.FC<UrlBreakdownVisualizerProps> = ({ parsed }) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <span>Forensic URL Anatomy Breakdown</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Dissecting the URL structure to expose deceptive prefixes, brand spoofing, and sneaky paths
          </p>
        </div>
        <div className="text-xs font-mono text-slate-400">
          Length: <span className="text-slate-200 tabular-nums">{parsed.length} chars</span>
        </div>
      </div>

      {/* Visual Token Ribbon */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5 rounded-lg bg-slate-950 p-3 font-mono text-xs sm:text-sm border border-slate-800/80 overflow-x-auto">
        {/* Protocol */}
        <span
          className={`px-2 py-1 rounded font-semibold ${
            parsed.protocol === 'https'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
          }`}
          title={parsed.protocol === 'https' ? 'Secure HTTPS TLS protocol' : 'Insecure unencrypted HTTP protocol'}
        >
          {parsed.protocol}://
        </span>

        {/* Subdomains */}
        {parsed.subdomain && (
          <span
            className="px-2 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-medium"
            title="Subdomain levels (frequently abused to mimic authentic brand names)"
          >
            {parsed.subdomain}.
          </span>
        )}

        {/* Second-Level Domain (SLD) */}
        <span
          className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold"
          title="The registered second-level domain name (this is the actual entity that owns the website)"
        >
          {parsed.domainName}
        </span>

        {/* TLD */}
        {parsed.tld && (
          <span
            className="px-2 py-1 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 font-semibold"
            title="Top-level domain extension"
          >
            .{parsed.tld}
          </span>
        )}

        {/* Port */}
        {parsed.port && (
          <span
            className="px-2 py-1 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30 font-medium"
            title="Explicit network port number"
          >
            :{parsed.port}
          </span>
        )}

        {/* Path & Query */}
        {(parsed.pathname !== '/' || parsed.search || parsed.hash) && (
          <span
            className="px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 truncate max-w-xs"
            title="Server resource route and query parameters"
          >
            {parsed.pathname}
            {parsed.search}
            {parsed.hash}
          </span>
        )}
      </div>

      {/* Explanatory Token Legend */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="flex items-start gap-2 p-2 rounded bg-slate-950/60 border border-slate-800/60">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 mt-1 shrink-0" />
          <div>
            <div className="font-medium text-slate-200">Registered Host (SLD)</div>
            <div className="text-[11px] text-slate-400">The actual legal domain owner</div>
          </div>
        </div>

        <div className="flex items-start gap-2 p-2 rounded bg-slate-950/60 border border-slate-800/60">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1 shrink-0" />
          <div>
            <div className="font-medium text-slate-200">Subdomain Prefix</div>
            <div className="text-[11px] text-slate-400">Can be named anything by owner</div>
          </div>
        </div>

        <div className="flex items-start gap-2 p-2 rounded bg-slate-950/60 border border-slate-800/60">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400 mt-1 shrink-0" />
          <div>
            <div className="font-medium text-slate-200">Top-Level Domain (TLD)</div>
            <div className="text-[11px] text-slate-400">Registry oversight tier</div>
          </div>
        </div>

        <div className="flex items-start gap-2 p-2 rounded bg-slate-950/60 border border-slate-800/60">
          <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${parsed.protocol === 'https' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
          <div>
            <div className="font-medium text-slate-200">Protocol ({parsed.protocol.toUpperCase()})</div>
            <div className="text-[11px] text-slate-400">{parsed.protocol === 'https' ? 'Encrypted transit' : 'Plaintext cleartext'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
