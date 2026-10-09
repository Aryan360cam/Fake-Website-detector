import React from 'react';
import { ShieldAlert, BookOpen, ExternalLink, ArrowRight, CheckCircle2 } from 'lucide-react';

interface EducationalGuideProps {
  onLoadExampleUrl: (url: string) => void;
}

const THREAT_PATTERNS = [
  {
    title: '1. Banking & Account Credential Phishing',
    technique: 'Subdomain Stacking & Combo-Squatting',
    exampleUrl: 'https://chase-online-verify-security.xyz/login/auth',
    description:
      'Attackers configure deceptive domains packed with security buzzwords like "verify", "security-alert", and "login". On smartphones, the browser address bar often hides the real root domain.',
    telltaleSigns: [
      'Root domain does not match the bank official dot-com address',
      'Uses newly created disposable TLDs (.xyz, .top, .buzz, .sbs)',
      'Requires entering debit card PIN, SSN, or full security questions',
    ],
  },
  {
    title: '2. Internationalized Homoglyph (IDN) Attacks',
    technique: 'Visual Character Substitution via Unicode Punycode',
    exampleUrl: 'https://xn--appl-43d.com/id/sign-in',
    description:
      'Using Cyrillic or Greek characters that look 100% indistinguishable from Latin characters (e.g. Cyrillic "а" U+0430 for Latin "a"). Under the hood, DNS resolves it as a punycode string like "xn--appl-43d.com".',
    telltaleSigns: [
      'Browser address bar displays "xn--" instead of English letters',
      'Received through unprompted security reset emails or SMS',
      'SSL certificate issued just days prior by automated free certificate authorities',
    ],
  },
  {
    title: '3. Web3 Crypto Wallet Drainers',
    technique: 'Mnemonic Seed Phrase Solicitation & Malicious Permit Calls',
    exampleUrl: 'https://metamask-restore-phrase-wallet.space/connect',
    description:
      'Lures crypto holders with fake airdrops, NFT claims, or wallet security synchronization. Coerces victims into submitting their 12 or 24-word secret recovery phrase.',
    telltaleSigns: [
      'Explicit form requesting 12/24 recovery words (legitimate dApps NEVER ask for this)',
      'Urgent countdown claiming an airdrop will be forfeited',
      'Requests "Approve All" unlimited ERC-20 token allowance permissions',
    ],
  },
  {
    title: '4. Fake Clearance & Non-Delivery Stores',
    technique: 'Unrealistic Discount Storefronts & Counterfeit Brands',
    exampleUrl: 'https://nike-official-outlet-clearance80.shop',
    description:
      'Cloned storefronts advertising 80-90% discounts on luxury fashion, electronics, or sneakers. Victims pay and either receive cheap knockoffs or nothing at all while having their payment cards stolen.',
    telltaleSigns: [
      'Brand new domain registered within the last 90 days',
      'No physical street address or only generic contact email forms',
      'Prices uniformly discounted across every catalog item',
    ],
  },
  {
    title: '5. Tech Support & Browser Lockout Scams',
    technique: 'Fake System Diagnostics & Toll-Free Phone Trap',
    exampleUrl: 'https://microsoft-security-defender-alert.info/trojan-lock',
    description:
      'Full-screen popups that make browser sounds and display simulated Windows Defender or macOS security warnings, claiming your device is compromised and instructing you to call a toll-free number.',
    telltaleSigns: [
      'Urgent warnings telling you NOT to turn off your machine',
      'Telephone number presented to fix an "operating system error"',
      'Legitimate OS vendors never prompt you to call phone numbers for malware',
    ],
  },
];

export const EducationalGuide: React.FC<EducationalGuideProps> = ({ onLoadExampleUrl }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-emerald-400" />
          <span>Scam Patterns & Phishing Archetypes Guide</span>
        </h2>
        <p className="mt-1 text-sm text-slate-300 max-w-3xl leading-relaxed">
          Understanding the psychological and technical mechanics behind fraudulent websites is your strongest defense. Here are the 5 most prevalent web attack patterns observed globally today.
        </p>
      </div>

      {/* Threat Pattern Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {THREAT_PATTERNS.map((pattern, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-slate-900/60 p-5 transition hover:border-slate-700"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-100">
                  {pattern.title}
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 shrink-0">
                  {pattern.technique}
                </span>
              </div>

              <p className="mt-2.5 text-xs text-slate-300 leading-relaxed">
                {pattern.description}
              </p>

              <div className="mt-4 space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Key Warning Flags:
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {pattern.telltaleSigns.map((sign, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-1.5">
                      <span className="text-rose-400 text-sm leading-none mt-0.5">•</span>
                      <span>{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500 truncate max-w-[200px]">
                {pattern.exampleUrl.replace(/^https?:\/\//, '')}
              </span>
              <button
                onClick={() => onLoadExampleUrl(pattern.exampleUrl)}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
              >
                <span>Audit Sample</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* Action Card: How to Report Phishing */}
        <div className="flex flex-col justify-between rounded-xl border border-emerald-800/50 bg-emerald-950/20 p-5">
          <div>
            <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>How to Safely Report Malicious Websites</span>
            </h3>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              When you encounter a confirmed fraudulent or phishing domain, reporting it protects millions of other users by triggering browser-level blocking across Chrome, Firefox, Safari, and Edge.
            </p>

            <div className="mt-4 space-y-2 text-xs text-slate-200">
              <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800">
                <strong className="text-emerald-400">Google Safe Browsing:</strong> Submit the URL at safebrowsing.google.com to trigger the red warning banner in Chrome & Android.
              </div>
              <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800">
                <strong className="text-emerald-400">Anti-Phishing Working Group (APWG):</strong> Forward phishing emails to reportphishing@apwg.org.
              </div>
              <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800">
                <strong className="text-emerald-400">Registrar Abuse Contact:</strong> Look up the domain registrar and send an abuse ticket requesting domain suspension.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
