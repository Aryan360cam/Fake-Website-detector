import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const CleanHowItWorks: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
      <div>
        <h2 className="text-lg font-bold text-slate-900">How fake websites trick people</h2>
        <p className="mt-1 text-sm text-slate-600 leading-relaxed">
          Phishing attacks rely on small visual deceptions that are easy to miss on a phone or when you are in a rush. Here are the 4 main techniques this tool checks for.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1 */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
            1. Lookalike Domains (Typosquatting)
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Swapping similar characters
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Attackers buy domains that look nearly identical to popular brands, such as replacing the letter <code className="text-emerald-900 bg-emerald-50 px-1 py-0.5 rounded font-mono font-bold">l</code> with the number <code className="text-emerald-900 bg-emerald-50 px-1 py-0.5 rounded font-mono font-bold">1</code> (<code className="text-red-700 font-mono">paypa1.com</code>) or combining letters like <code className="text-emerald-900 bg-emerald-50 px-1 py-0.5 rounded font-mono font-bold">rn</code> to look like <code className="text-emerald-900 bg-emerald-50 px-1 py-0.5 rounded font-mono font-bold">m</code> (<code className="text-red-700 font-mono">arnazon.com</code>).
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
            2. Cyrillic & Greek Lookalikes (Homoglyphs)
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Identical-looking foreign alphabets
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Certain letters in the Cyrillic alphabet (like Cyrillic <code className="text-emerald-900 bg-emerald-50 px-1 py-0.5 rounded font-mono font-bold">а</code>, <code className="text-emerald-900 bg-emerald-50 px-1 py-0.5 rounded font-mono font-bold">о</code>, <code className="text-emerald-900 bg-emerald-50 px-1 py-0.5 rounded font-mono font-bold">е</code>) look 100% identical to English letters. To your computer, however, they translate into a Punycode address like <code className="text-red-700 font-mono">xn--appl-43d.com</code>.
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
            3. Subdomain Deception
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Hiding the real domain at the end
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Anyone can create a subdomain like <code className="text-red-700 font-mono">paypal.com.account-verify.xyz</code>. On mobile screens where the address bar truncates, you only see "paypal.com", but the actual website you are visiting is <code className="text-emerald-950 font-mono font-bold">account-verify.xyz</code>.
          </p>
        </div>

        {/* Card 4 */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
            4. The Padlock Myth
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            HTTPS does NOT mean a site is authentic
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            HTTPS only means your connection to the server is encrypted. Anyone, including scammers, can get a free SSL certificate in seconds. Over 80% of modern phishing websites have the padlock icon!
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 leading-relaxed flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-emerald-800 shrink-0 mt-0.5" />
        <div>
          <strong className="text-emerald-950 font-bold">Private by design: </strong>
          This tool runs entirely in your web browser. No URLs or search queries are sent to any remote server or third party.
        </div>
      </div>
    </div>
  );
};
