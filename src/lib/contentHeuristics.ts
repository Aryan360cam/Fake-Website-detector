import { ContentAnalysisResult, Severity, RiskLevel } from '../types/detector';

interface HeuristicRule {
  id: string;
  title: string;
  severity: Severity;
  pattern: RegExp;
  points: number;
  explanation: string;
}

const HEURISTIC_RULES: HeuristicRule[] = [
  {
    id: 'crypto_seed_phrase',
    title: 'Seed Phrase / Private Key Solicitation',
    severity: 'critical',
    pattern: /(12[\s-]word|24[\s-]word|secret\s*recovery\s*phrase|seed\s*phrase|private\s*key|mnemonic|enter\s*your\s*passphrase)/i,
    points: 45,
    explanation: 'Legitimate Web3 wallets never ask for your 12-24 word seed phrase on a webpage. This is an explicit wallet drainer signature.',
  },
  {
    id: 'urgency_coercion',
    title: 'Urgency & Account Suspension Threat',
    severity: 'warning',
    pattern: /(account\s*(will\s*be\s*suspended|permanently\s*disabled|terminated)|act\s*within\s*\d+\s*(hours|minutes)|immediate\s*action\s*required|unauthorized\s*activity\s*detected)/i,
    points: 20,
    explanation: 'Scammers manufacture artificial urgency to force victims into making panicked decisions without checking the URL.',
  },
  {
    id: 'fake_tech_support',
    title: 'Tech Support Lockout Pattern',
    severity: 'critical',
    pattern: /(windows\s*defender\s*error|trojan\s*virus\s*detected|do\s*not\s*shut\s*down|call\s*(apple|microsoft|support)\s*(toll[\s-]free|helpdesk|\+?1?[-\s]?\d{3}[-\s]?\d{3}[-\s]?\d{4}))/i,
    points: 40,
    explanation: 'Deceptive popup simulating operating system diagnostics to scam victims into calling fraudulent call centers.',
  },
  {
    id: 'password_insecure_target',
    title: 'Password Harvesting Form',
    severity: 'critical',
    pattern: /<input[^>]*type=["']password["'][^>]*>|<form[^>]*action=["'](http:\/\/|https:\/\/[^"']*(google\.docs|telegram|formspree|discord\.com\/api\/webhooks))/i,
    points: 35,
    explanation: 'Detects password collection inputs routing credentials to third-party webhooks, Telegram bots, or unencrypted endpoints.',
  },
  {
    id: 'counterfeit_huge_discount',
    title: 'Unrealistic Clearance / Counterfeit Storefront',
    severity: 'warning',
    pattern: /(80%[\s-]off|90%[\s-]off|clearance\s*sale\s*today\s*only|free\s*shipping\s*worldwide\s*today|outlet\s*factory\s*warehouse\s*liquidation)/i,
    points: 18,
    explanation: 'Excessive liquidation discounts on branded goods are common markers of fraudulent non-delivery storefronts.',
  },
  {
    id: 'lottery_gift_trap',
    title: 'Unsolicited Prize / Reward Lure',
    severity: 'warning',
    pattern: /(congratulations\s*you\s*have\s*been\s*selected|claim\s*your\s*\$?\d+\s*(gift\s*card|reward|voucher)|spin\s*to\s*win|amazon\s*shopper\s*survey\s*prize)/i,
    points: 22,
    explanation: 'Reward traps trick victims into completing questionnaires and paying nominal shipping fees to harvest credit card data.',
  },
  {
    id: 'obfuscated_js',
    title: 'Script Obfuscation / Dynamic Execution',
    severity: 'critical',
    pattern: /(eval\s*\(\s*(unescape|atob|window\[)|document\.write\s*\(\s*unescape|String\.fromCharCode\s*\(\s*\d+\s*,\s*\d+)/i,
    points: 30,
    explanation: 'Detects obfuscated JavaScript packers commonly deployed to evade static security crawlers and antivirus scanners.',
  },
  {
    id: 'fake_security_badges',
    title: 'Superficial Trust Seal Fabrication',
    severity: 'info',
    pattern: /(100%\s*verified\s*secure|mcafee\s*secure\s*seal|norton\s*secured\s*badge|ssl\s*256[\s-]bit\s*encryption\s*guaranteed)/i,
    points: 10,
    explanation: 'Phishing pages frequently plaster static fake trust logos to induce a false sense of legitimacy.',
  },
];

export function analyzeContentSnippet(text: string): ContentAnalysisResult {
  const flags: ContentAnalysisResult['detectedFlags'] = [];
  let totalDeduction = 0;

  for (const rule of HEURISTIC_RULES) {
    if (rule.pattern.test(text)) {
      flags.push({
        title: rule.title,
        severity: rule.severity,
        pattern: rule.pattern.toString(),
        explanation: rule.explanation,
      });
      totalDeduction += rule.points;
    }
  }

  const rawScore = Math.max(0, 100 - totalDeduction);
  let riskLevel: RiskLevel = 'safe';
  let summary = 'No dangerous deceptive patterns found in the inspected content.';

  if (rawScore < 40) {
    riskLevel = 'dangerous';
    summary = 'Severe malicious indicators detected. The content exhibits clear hallmarks of active phishing or financial deception.';
  } else if (rawScore < 70) {
    riskLevel = 'suspicious';
    summary = 'Suspicious elements identified. High presence of urgency, unrealistic claims, or deceptive trust cues.';
  } else if (rawScore < 90) {
    riskLevel = 'low';
    summary = 'Minor flags observed, but overall low probability of targeted scam mechanics.';
  }

  return {
    id: Math.random().toString(36).substring(2, 9),
    score: rawScore,
    riskLevel,
    detectedFlags: flags,
    summary,
  };
}
