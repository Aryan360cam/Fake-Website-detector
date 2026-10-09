import { HomoglyphDetail } from '../types/detector';

interface LookalikeEntry {
  latin: string;
  script: string;
  name: string;
}

// Unicode confusable lookalikes targeting Latin characters
const CONFUSABLES_MAP: Record<string, LookalikeEntry> = {
  // Cyrillic
  '\u0430': { latin: 'a', script: 'Cyrillic', name: 'CYRILLIC SMALL LETTER A' },
  '\u0441': { latin: 'c', script: 'Cyrillic', name: 'CYRILLIC SMALL LETTER ES' },
  '\u0435': { latin: 'e', script: 'Cyrillic', name: 'CYRILLIC SMALL LETTER IE' },
  '\u0456': { latin: 'i', script: 'Cyrillic', name: 'CYRILLIC SMALL LETTER BYELORUSSIAN-UKRAINIAN I' },
  '\u0458': { latin: 'j', script: 'Cyrillic', name: 'CYRILLIC SMALL LETTER JE' },
  '\u043E': { latin: 'o', script: 'Cyrillic', name: 'CYRILLIC SMALL LETTER O' },
  '\u0440': { latin: 'p', script: 'Cyrillic', name: 'CYRILLIC SMALL LETTER ER' },
  '\u0455': { latin: 's', script: 'Cyrillic', name: 'CYRILLIC SMALL LETTER DZE' },
  '\u0443': { latin: 'y', script: 'Cyrillic', name: 'CYRILLIC SMALL LETTER U' },
  '\u0445': { latin: 'x', script: 'Cyrillic', name: 'CYRILLIC SMALL LETTER HA' },
  '\u044A': { latin: 'b', script: 'Cyrillic', name: 'CYRILLIC SMALL LETTER HARD SIGN' },
  // Greek
  '\u03B1': { latin: 'a', script: 'Greek', name: 'GREEK SMALL LETTER ALPHA' },
  '\u03B2': { latin: 'b', script: 'Greek', name: 'GREEK SMALL LETTER BETA' },
  '\u03B5': { latin: 'e', script: 'Greek', name: 'GREEK SMALL LETTER EPSILON' },
  '\u03B7': { latin: 'n', script: 'Greek', name: 'GREEK SMALL LETTER ETA' },
  '\u03B9': { latin: 'i', script: 'Greek', name: 'GREEK SMALL LETTER IOTA' },
  '\u03BA': { latin: 'k', script: 'Greek', name: 'GREEK SMALL LETTER KAPPA' },
  '\u03BD': { latin: 'v', script: 'Greek', name: 'GREEK SMALL LETTER NU' },
  '\u03BF': { latin: 'o', script: 'Greek', name: 'GREEK SMALL LETTER OMICRON' },
  '\u03C1': { latin: 'p', script: 'Greek', name: 'GREEK SMALL LETTER RHO' },
  '\u03C4': { latin: 't', script: 'Greek', name: 'GREEK SMALL LETTER TAU' },
  '\u03C5': { latin: 'u', script: 'Greek', name: 'GREEK SMALL LETTER UPSILON' },
  '\u03C7': { latin: 'x', script: 'Greek', name: 'GREEK SMALL LETTER CHI' },
  // Special/Punctuation homoglyphs
  '\u2010': { latin: '-', script: 'Hyphen', name: 'HYPHEN' },
  '\u2011': { latin: '-', script: 'Hyphen', name: 'NON-BREAKING HYPHEN' },
  '\u2013': { latin: '-', script: 'Hyphen', name: 'EN DASH' },
  '\u2014': { latin: '-', script: 'Hyphen', name: 'EM DASH' },
  '\u00B7': { latin: '.', script: 'Punctuation', name: 'MIDDLE DOT' },
  '\u2024': { latin: '.', script: 'Punctuation', name: 'ONE DOT LEADER' },
};

/**
 * Basic RFC 3492 Punycode decoder for client-side decoding
 */
export function decodePunycodeLabel(input: string): string {
  if (!input.toLowerCase().startsWith('xn--')) {
    return input;
  }
  const body = input.slice(4);
  const base = 36;
  const tmin = 1;
  const tmax = 26;
  const skew = 38;
  const damp = 700;
  const initialBias = 72;
  const initialN = 128;
  const delimiter = '-';

  const output: number[] = [];
  let n = initialN;
  let bias = initialBias;

  const basicLength = body.lastIndexOf(delimiter);
  let pos = 0;

  if (basicLength > 0) {
    for (let j = 0; j < basicLength; ++j) {
      const c = body.charCodeAt(j);
      if (c >= 0x80) throw new Error('Illegal input');
      output.push(c);
    }
    pos = basicLength + 1;
  }

  let i = 0;
  while (pos < body.length) {
    const oldi = i;
    let w = 1;
    let k = base;

    while (pos < body.length) {
      const char = body.charAt(pos++);
      let digit: number;
      if (char >= 'a' && char <= 'z') digit = char.charCodeAt(0) - 97;
      else if (char >= 'A' && char <= 'Z') digit = char.charCodeAt(0) - 65;
      else if (char >= '0' && char <= '9') digit = char.charCodeAt(0) - 48 + 26;
      else throw new Error('Illegal char');

      i += digit * w;
      const t = k <= bias ? tmin : k >= bias + tmax ? tmax : k - bias;
      if (digit < t) break;
      w *= base - t;
      k += base;
    }

    const delta = i - oldi;
    bias = adapt(delta, output.length + 1, oldi === 0);
    n += Math.floor(i / (output.length + 1));
    i %= output.length + 1;
    output.splice(i, 0, n);
    i++;
  }

  return String.fromCodePoint(...output);
}

function adapt(delta: number, numPoints: number, firstTime: boolean): number {
  let d = firstTime ? Math.floor(delta / 700) : Math.floor(delta / 2);
  d += Math.floor(d / numPoints);
  let k = 0;
  while (d > ((36 - 1) * 26) / 2) {
    d = Math.floor(d / (36 - 1));
    k += 36;
  }
  return Math.floor(k + ((36 - 1 + 1) * d) / (d + 38));
}

export function detectHomoglyphs(hostname: string): HomoglyphDetail {
  const parts = hostname.split('.');
  const suspiciousChars: HomoglyphDetail['suspiciousCharacters'] = [];
  let decodedHostname = hostname;
  let isPunycode = false;

  try {
    const decodedParts = parts.map((part) => {
      if (part.toLowerCase().startsWith('xn--')) {
        isPunycode = true;
        return decodePunycodeLabel(part);
      }
      return part;
    });
    decodedHostname = decodedParts.join('.');
  } catch {
    decodedHostname = hostname;
  }

  // Scan every character in the decoded hostname
  for (const char of decodedHostname) {
    if (CONFUSABLES_MAP[char]) {
      const entry = CONFUSABLES_MAP[char];
      suspiciousChars.push({
        char,
        codePoint: `U+${char.codePointAt(0)?.toString(16).toUpperCase().padStart(4, '0')}`,
        script: entry.script,
        latinLookalike: entry.latin,
      });
    }
  }

  return {
    hasHomoglyphs: suspiciousChars.length > 0 || isPunycode,
    punycode: hostname,
    decoded: decodedHostname,
    suspiciousCharacters: suspiciousChars,
  };
}
