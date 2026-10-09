import React, { useState } from 'react';
import { Search, Globe, X, ArrowRight, Sparkles } from 'lucide-react';
import { PRESET_SAMPLES } from '../lib/presets';
import { PresetSample } from '../types/detector';

interface UrlInputBarProps {
  onAnalyze: (url: string) => void;
  isAnalyzing: boolean;
  currentUrl: string;
}

export const UrlInputBar: React.FC<UrlInputBarProps> = ({
  onAnalyze,
  isAnalyzing,
  currentUrl,
}) => {
  const [inputVal, setInputVal] = useState(currentUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onAnalyze(inputVal.trim());
    }
  };

  const handleSelectPreset = (preset: PresetSample) => {
    setInputVal(preset.url);
    onAnalyze(preset.url);
  };

  const handleClear = () => {
    setInputVal('');
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center rounded-xl border border-slate-700 bg-slate-900/90 shadow-2xl transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
          <div className="pl-4 text-slate-400">
            <Globe className="h-5 w-5" />
          </div>

          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Paste suspicious website URL (e.g. chase-online-verify-security.xyz or xn--appl-43d.com)"
            className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none font-mono"
            autoComplete="off"
            spellCheck="false"
          />

          {inputVal && (
            <button
              type="button"
              onClick={handleClear}
              className="mr-2 text-slate-400 hover:text-slate-200 transition p-1"
              title="Clear input"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <div className="pr-2">
            <button
              type="submit"
              disabled={!inputVal.trim() || isAnalyzing}
              className="flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50 disabled:pointer-events-none active:scale-95"
            >
              {isAnalyzing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Analyze Domain</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Quick Test Presets Section */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Instant Threat & Benchmark Presets</span>
          </span>
          <span className="hidden sm:inline text-slate-500">
            Click any signature to run client-side detection heuristics
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESET_SAMPLES.slice(0, 4).map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectPreset(sample)}
              className="flex flex-col text-left rounded-lg border border-slate-800 bg-slate-900/60 p-2.5 transition hover:border-slate-700 hover:bg-slate-800/60 group"
            >
              <span className="text-xs font-medium text-slate-200 group-hover:text-emerald-400 truncate">
                {sample.title}
              </span>
              <span className="text-[11px] font-mono text-slate-500 truncate mt-0.5">
                {sample.url.replace(/^https?:\/\//, '')}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESET_SAMPLES.slice(4, 8).map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectPreset(sample)}
              className="flex flex-col text-left rounded-lg border border-slate-800 bg-slate-900/60 p-2.5 transition hover:border-slate-700 hover:bg-slate-800/60 group"
            >
              <span className="text-xs font-medium text-slate-200 group-hover:text-emerald-400 truncate">
                {sample.title}
              </span>
              <span className="text-[11px] font-mono text-slate-500 truncate mt-0.5">
                {sample.url.replace(/^https?:\/\//, '')}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
