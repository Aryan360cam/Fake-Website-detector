import { TARGET_BRANDS, TargetBrand } from './threatDatabase';
import { ImpersonationCheck } from '../types/detector';

/**
 * Calculates Damerau-Levenshtein distance between two strings
 * Handles: insertions, deletions, substitutions, and adjacent transpositions.
 */
export function damerauLevenshteinDistance(source: string, target: string): number {
  const src = source.toLowerCase();
  const tgt = target.toLowerCase();
  const n = src.length;
  const m = tgt.length;

  if (n === 0) return m;
  if (m === 0) return n;

  const d: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = 0; i <= n; i++) d[i][0] = i;
  for (let j = 0; j <= m; j++) d[0][j] = j;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = src[i - 1] === tgt[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,      // deletion
        d[i][j - 1] + 1,      // insertion
        d[i - 1][j - 1] + cost // substitution
      );

      // Transposition
      if (i > 1 && j > 1 && src[i - 1] === tgt[j - 2] && src[i - 2] === tgt[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
      }
    }
  }

  return d[n][m];
}

/**
 * Checks for visual lookalike visual substitution patterns (e.g. rn -> m, vv -> w, 1 -> l)
 */
export function normalizeVisualTypos(str: string): string {
  return str
    .toLowerCase()
    .replace(/rn/g, 'm')
    .replace(/vv/g, 'w')
    .replace(/1/g, 'l')
    .replace(/0/g, 'o')
    .replace(/5/g, 's')
    .replace(/8/g, 'b');
}

/**
 * Evaluates whether a domain or its subdomains impersonate known brand targets
 */
export function checkBrandImpersonation(
  sld: string,
  fullHostname: string,
  subdomains: string[]
): ImpersonationCheck {
  const cleanSld = sld.toLowerCase();
  const cleanFull = fullHostname.toLowerCase();
  const normalizedSld = normalizeVisualTypos(cleanSld);

  for (const brand of TARGET_BRANDS) {
    const brandNameLower = brand.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const officialApex = brand.officialDomain.toLowerCase();
    const brandBase = officialApex.split('.')[0];

    // If it is the actual official domain or legitimate alias, it's NOT impersonating
    if (cleanFull === officialApex || cleanFull.endsWith('.' + officialApex) || brand.aliases.some(a => cleanFull === a || cleanFull.endsWith('.' + a))) {
      return {
        isImpersonating: false,
        brand: brand.name,
        officialDomain: brand.officialDomain,
        similarityScore: 1.0,
        attackType: 'none',
        explanation: `This is the officially verified domain for ${brand.name}.`,
      };
    }

    // 1. Subdomain spoof check: e.g. paypal.com.attacker.com or apple.id.attacker-portal.net
    if (subdomains.some((sub) => sub.toLowerCase().includes(brandBase) || sub.toLowerCase().includes(brandNameLower))) {
      return {
        isImpersonating: true,
        brand: brand.name,
        officialDomain: brand.officialDomain,
        similarityScore: 0.95,
        attackType: 'subdomain_spoof',
        explanation: `The subdomain "${subdomains.join('.')}" deliberately uses the brand name "${brand.name}" to deceive victims while pointing to a third-party root domain.`,
      };
    }

    // 2. Keyword combination spoof in SLD: e.g. "paypal-security" or "login-apple" or "chaseonline"
    const keywordMatch = brand.keywords.some((kw) => cleanSld.includes(kw.toLowerCase().replace(/[^a-z0-9]/g, '')));
    if (keywordMatch || cleanSld.includes(brandBase) || cleanSld.includes(brandNameLower)) {
      if (cleanSld !== brandBase) {
        return {
          isImpersonating: true,
          brand: brand.name,
          officialDomain: brand.officialDomain,
          similarityScore: 0.9,
          attackType: 'keyword_combination',
          explanation: `The domain label "${sld}" embeds the high-value brand name "${brand.name}" alongside deceptive modifier keywords.`,
        };
      }
    }

    // 3. Visual character substitution (e.g. paypa1 vs paypal, arnazon vs amazon)
    if (normalizedSld === brandBase && cleanSld !== brandBase) {
      return {
        isImpersonating: true,
        brand: brand.name,
        officialDomain: brand.officialDomain,
        similarityScore: 0.92,
        attackType: 'typosquatting',
        explanation: `Visual substitution detected: "${sld}" uses character swaps (such as 1 for l, or rn for m) to mimic "${brandBase}".`,
      };
    }

    // 4. Damerau-Levenshtein edit distance check
    const dist = damerauLevenshteinDistance(cleanSld, brandBase);
    const maxLen = Math.max(cleanSld.length, brandBase.length);
    const similarity = 1 - dist / maxLen;

    // High similarity threshold for brand spoofing (distance 1 or 2 on words length >= 5)
    if ((dist === 1 && brandBase.length >= 4) || (dist === 2 && brandBase.length >= 7)) {
      return {
        isImpersonating: true,
        brand: brand.name,
        officialDomain: brand.officialDomain,
        similarityScore: similarity,
        attackType: 'typosquatting',
        explanation: `Typosquatting variant of "${brand.name}" (${officialApex}). Damerau-Levenshtein distance of ${dist} indicates an intentional single-character misdirection.`,
      };
    }
  }

  return {
    isImpersonating: false,
    brand: '',
    officialDomain: '',
    similarityScore: 0,
    attackType: 'none',
    explanation: 'No known brand mimicry or typosquatting patterns detected against verified corporate registries.',
  };
}

/**
 * Generator function that outputs educational simulated lookalike vectors
 * for any given brand domain to demonstrate how attackers attack organizations.
 */
export function generateTyposquattingVariations(inputDomain: string): Array<{
  domain: string;
  type: string;
  dangerLevel: 'High' | 'Severe' | 'Critical';
  explanation: string;
}> {
  const parts = inputDomain.toLowerCase().replace(/^https?:\/\//, '').split('/')[0].split('.');
  const base = parts[0] || 'brand';
  const tld = parts.length > 1 ? parts.slice(1).join('.') : 'com';

  const results: Array<{
    domain: string;
    type: string;
    dangerLevel: 'High' | 'Severe' | 'Critical';
    explanation: string;
  }> = [];

  // 1. Homoglyphs / Visual Substitutions
  if (base.includes('a')) {
    results.push({
      domain: `${base.replace('a', '\u0430')}.${tld}`,
      type: 'Homoglyph Attack (Cyrillic a)',
      dangerLevel: 'Critical',
      explanation: 'Uses Cyrillic "а" (U+0430). Renders visually identical to human eyes in many browsers.',
    });
  }
  if (base.includes('l')) {
    results.push({
      domain: `${base.replace('l', '1')}.${tld}`,
      type: 'Number Substitution',
      dangerLevel: 'Severe',
      explanation: 'Replaces lowercase "l" with digit "1", highly deceptive on mobile screens.',
    });
  }
  if (base.includes('m')) {
    results.push({
      domain: `${base.replace('m', 'rn')}.${tld}`,
      type: 'Comboglyph ("rn" for "m")',
      dangerLevel: 'Severe',
      explanation: 'Combines letters "r" and "n" to mimic lowercase "m" in standard sans-serif typefaces.',
    });
  }
  if (base.includes('o')) {
    results.push({
      domain: `${base.replace('o', '0')}.${tld}`,
      type: 'Zero Substitution',
      dangerLevel: 'High',
      explanation: 'Replaces letter "o" with digit "0".',
    });
  }

  // 2. Omission
  if (base.length > 3) {
    const omitted = base.slice(0, 1) + base.slice(2);
    results.push({
      domain: `${omitted}.${tld}`,
      type: 'Character Omission',
      dangerLevel: 'High',
      explanation: 'Drops the second character, targeting users who make quick typing typos.',
    });
  }

  // 3. Double Keypress / Repetition
  const doubled = base.slice(0, 2) + base[1] + base.slice(2);
  results.push({
    domain: `${doubled}.${tld}`,
    type: 'Keypress Repetition',
    dangerLevel: 'High',
    explanation: 'Duplicates a character mimicking a sticky key or double tap on touchscreens.',
  });

  // 4. Keyword Affixation (Combo-squatting)
  results.push({
    domain: `${base}-login.${tld}`,
    type: 'Action Affix (Combo-squatting)',
    dangerLevel: 'Critical',
    explanation: 'Appends "-login" to trick victims into believing it is a dedicated sign-in gateway.',
  });
  results.push({
    domain: `${base}-security-verify.xyz`,
    type: 'Urgency Affix + Abused TLD',
    dangerLevel: 'Critical',
    explanation: 'Combines trust terms with a high-abuse TLD to run mass credential harvesting.',
  });
  results.push({
    domain: `support-${base}.${tld}`,
    type: 'Prepend Spoof',
    dangerLevel: 'Severe',
    explanation: 'Prepends "support-" to build social engineering trust for tech support scams.',
  });

  // 5. TLD Swap
  const badTlds = ['top', 'xyz', 'buzz', 'click'];
  for (const bTld of badTlds) {
    if (bTld !== tld) {
      results.push({
        domain: `${base}.${bTld}`,
        type: `TLD Swap (.${bTld})`,
        dangerLevel: 'High',
        explanation: `Registers identical brand name under high-abuse TLD .${bTld} often ignored by brand watchdogs.`,
      });
      break;
    }
  }

  return results;
}
