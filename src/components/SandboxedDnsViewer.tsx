import React from 'react';
import { AnalysisResult } from '../types/detector';
import { Globe, Server, Shield, KeyRound, ExternalLink } from 'lucide-react';

interface SandboxedDnsViewerProps {
  result: AnalysisResult;
}

export const SandboxedDnsViewer: React.FC<SandboxedDnsViewerProps> = ({ result }) => {
  const { simulatedWhois, homoglyph, impersonation, parsed } = result;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Box 1: Registrar & Domain Age Heuristics */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Globe className="h-4 w-4 text-emerald-400" />
          <h4 className="text-sm font-semibold text-slate-100">
            Registrar & Domain Age Diagnostics
          </h4>
        </div>

        <div className="mt-3 space-y-2.5 text-xs">
          <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Designated Registrar:</span>
            <span className="font-mono text-slate-200 text-right font-medium truncate max-w-[200px]">
              {simulatedWhois.registrar}
            </span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Estimated Registration Age:</span>
            <span className="font-mono tabular-nums text-slate-200">
              {simulatedWhois.estimatedDays > 365
                ? `~${Math.round(simulatedWhois.estimatedDays / 365)} years (${simulatedWhois.estimatedDays} days)`
                : `${simulatedWhois.estimatedDays} days (Newly provisioned)`}
            </span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Identity Privacy Guard:</span>
            <span className={`font-medium ${simulatedWhois.privacyShield ? 'text-amber-400' : 'text-slate-300'}`}>
              {simulatedWhois.privacyShield ? 'Shield Active (Identity Redacted)' : 'Public Corporate Contact'}
            </span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Registry Geo Jurisdiction:</span>
            <span className="font-mono text-slate-200">{simulatedWhois.country}</span>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 leading-relaxed bg-slate-950 p-2.5 rounded border border-slate-800/80">
            <strong className="text-slate-300">Heuristic Assessment: </strong>
            {simulatedWhois.notes}
          </div>
        </div>
      </div>

      {/* Box 2: Homoglyph & Confusable Unicode Analysis */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <KeyRound className="h-4 w-4 text-cyan-400" />
          <h4 className="text-sm font-semibold text-slate-100">
            Internationalized IDN & Character Inspection
          </h4>
        </div>

        <div className="mt-3 space-y-2.5 text-xs">
          <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Punycode Encoding:</span>
            <span className="font-mono text-slate-200 font-medium truncate max-w-[220px]">
              {homoglyph.punycode}
            </span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Visual Unicode Representation:</span>
            <span className="font-mono text-slate-200 font-medium truncate max-w-[220px]">
              {homoglyph.decoded}
            </span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Confusable Homoglyph Found:</span>
            <span className={`font-semibold ${homoglyph.hasHomoglyphs ? 'text-rose-400' : 'text-emerald-400'}`}>
              {homoglyph.hasHomoglyphs ? 'YES (High Deception Risk)' : 'No (Standard ASCII)'}
            </span>
          </div>

          {homoglyph.suspiciousCharacters.length > 0 ? (
            <div className="pt-1 space-y-1.5">
              <span className="text-[11px] font-medium text-rose-300">Flagged Non-Latin Characters:</span>
              <div className="space-y-1">
                {homoglyph.suspiciousCharacters.map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1.5 rounded bg-rose-950/30 border border-rose-900/40 text-[11px]">
                    <span className="font-mono text-rose-200">
                      '{c.char}' ({c.codePoint})
                    </span>
                    <span className="text-slate-400">
                      {c.script} → mimics Latin '<strong className="text-white">{c.latinLookalike}</strong>'
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="pt-2 text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800/80">
              <strong className="text-slate-300">Clean Encoding: </strong>
              All characters in the domain string belong to the standard ASCII character set without mixed-script homoglyph obfuscation.
            </div>
          )}
        </div>
      </div>

      {/* Box 3: Brand Mimicry & Typosquatting Match */}
      {impersonation.isImpersonating && (
        <div className="md:col-span-2 rounded-xl border border-rose-800/60 bg-rose-950/20 p-5">
          <div className="flex items-center gap-2 pb-3 border-b border-rose-800/40">
            <Shield className="h-4 w-4 text-rose-400" />
            <h4 className="text-sm font-semibold text-rose-200">
              Active Brand Mimicry Alert: Impersonating {impersonation.brand}
            </h4>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded bg-slate-950/80 border border-slate-800">
              <div className="text-slate-400 text-[11px]">Target Brand</div>
              <div className="font-semibold text-slate-100 mt-0.5">{impersonation.brand}</div>
            </div>

            <div className="p-3 rounded bg-slate-950/80 border border-slate-800">
              <div className="text-slate-400 text-[11px]">Official Legitimate URL</div>
              <div className="font-mono font-semibold text-emerald-400 mt-0.5">
                https://{impersonation.officialDomain}
              </div>
            </div>

            <div className="p-3 rounded bg-slate-950/80 border border-slate-800">
              <div className="text-slate-400 text-[11px]">Attack Vector</div>
              <div className="font-semibold text-amber-400 mt-0.5 capitalize">
                {impersonation.attackType.replace('_', ' ')}
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-rose-300 leading-relaxed">
            {impersonation.explanation}
          </p>
        </div>
      )}
    </div>
  );
};
