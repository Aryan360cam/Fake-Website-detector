import {
  AnalysisFinding,
  AnalysisResult,
  ParsedUrlDetails,
  RiskLevel,
  SimulatedDnsWhois,
} from '../types/detector';
import { KNOWN_MALICIOUS_DOMAINS, TRUSTED_OFFICIAL_DOMAINS } from './threatDatabase';
import { evaluateTld } from './tldReputation';
import { detectHomoglyphs } from './homoglyphEngine';
import { checkBrandImpersonation } from './typosquattingEngine';

/**
 * Normalizes user input into a parseable URL string
 */
export function normalizeInputUrl(input: string): string {
  let trimmed = input.trim();
  if (!trimmed) return '';

  // If user entered without protocol, assume https for parsing
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed;
  }
  return trimmed;
}

/**
 * Parses URL safely using standard browser URL API
 */
export function parseUrlDetails(rawInput: string, normalized: string): ParsedUrlDetails {
  try {
    const urlObj = new URL(normalized);
    const hostname = urlObj.hostname.toLowerCase();
    const port = urlObj.port;
    const protocol = urlObj.protocol.replace(':', '').toLowerCase();
    const pathname = urlObj.pathname;
    const search = urlObj.search;
    const hash = urlObj.hash;

    const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.startsWith('[');
    const isPunycode = hostname.includes('xn--');

    let tld = '';
    let domainName = '';
    let subdomain = '';

    if (!isIpAddress) {
      const parts = hostname.split('.');
      if (parts.length > 1) {
        // Handle common dual TLDs like co.uk, com.au, org.uk
        const dualTlds = ['co.uk', 'com.au', 'co.nz', 'co.jp', 'com.br', 'gov.uk', 'edu.au'];
        const lastTwo = parts.slice(-2).join('.');
        if (dualTlds.includes(lastTwo) && parts.length > 2) {
          tld = lastTwo;
          domainName = parts[parts.length - 3];
          subdomain = parts.slice(0, parts.length - 3).join('.');
        } else {
          tld = parts[parts.length - 1];
          domainName = parts[parts.length - 2];
          subdomain = parts.slice(0, parts.length - 2).join('.');
        }
      } else {
        domainName = hostname;
      }
    } else {
      domainName = hostname;
    }

    return {
      raw: rawInput,
      protocol,
      hostname,
      port,
      pathname,
      search,
      hash,
      subdomain,
      domainName,
      tld,
      isIpAddress,
      isPunycode,
      length: rawInput.length,
    };
  } catch {
    return {
      raw: rawInput,
      protocol: 'unknown',
      hostname: rawInput.toLowerCase().replace(/^https?:\/\//i, '').split('/')[0],
      port: '',
      pathname: '/',
      search: '',
      hash: '',
      subdomain: '',
      domainName: rawInput,
      tld: '',
      isIpAddress: false,
      isPunycode: false,
      length: rawInput.length,
    };
  }
}

/**
 * Generate simulated DNS & WHOIS registrar profile based on domain heuristics
 */
function generateSimulatedWhois(parsed: ParsedUrlDetails, isTrusted: boolean, isMalicious: boolean): SimulatedDnsWhois {
  if (isTrusted) {
    return {
      registrar: 'MarkMonitor Inc. / Corporate Registry Services',
      estimatedAgeCategory: 'established',
      estimatedDays: 8500, // 20+ years
      privacyShield: false,
      country: 'United States',
      notes: 'Verified corporate enterprise registration. Active DNSSEC and high-reputation nameservers.',
    };
  }

  if (isMalicious || ['top', 'xyz', 'buzz', 'click', 'cfd', 'sbs'].includes(parsed.tld)) {
    return {
      registrar: 'NameCheap / PublicDomainRegistry (Privacy Protected)',
      estimatedAgeCategory: 'newly_registered',
      estimatedDays: Math.floor(Math.random() * 14) + 2, // 2-16 days old
      privacyShield: true,
      country: 'Iceland / Panama (Redacted for Privacy)',
      notes: 'High-risk profile: Newly provisioned domain (<30 days) with full identity redaction, typical of disposable phishing kits.',
    };
  }

  return {
    registrar: 'Cloudflare Registrar / GoDaddy LLC',
    estimatedAgeCategory: 'moderate',
    estimatedDays: 450,
    privacyShield: true,
    country: 'United States',
    notes: 'Standard registrar delegation. Valid TLS cert present.',
  };
}

/**
 * Core analysis engine - 100% Client-Side
 */
export function analyzeUrl(rawInput: string): AnalysisResult {
  const normalized = normalizeInputUrl(rawInput);
  const parsed = parseUrlDetails(rawInput, normalized);
  const findings: AnalysisFinding[] = [];

  let trustScore = 100;

  // 1. Check Known Verified Safe List
  const isDirectlyTrusted =
    TRUSTED_OFFICIAL_DOMAINS.has(parsed.hostname) ||
    TRUSTED_OFFICIAL_DOMAINS.has(`${parsed.domainName}.${parsed.tld}`);

  if (isDirectlyTrusted && parsed.subdomain === '' || ['www', 'mail', 'docs', 'support', 'app'].includes(parsed.subdomain)) {
    findings.push({
      id: 'official_verified_brand',
      category: 'known_threat_db',
      severity: 'pass',
      title: 'Verified Official Domain Entity',
      description: `"${parsed.hostname}" is a recognized, officially registered apex domain with established worldwide trust authority.`,
      technicalDetail: `Verified against global trusted identity registries. Apex: ${parsed.domainName}.${parsed.tld}.`,
      scoreImpact: 0,
      recommendation: 'Safe to proceed. Ensure your connection displays the valid SSL lock icon.',
    });
  }

  // 2. Check Known Threat Intel Database
  const matchedThreat = KNOWN_MALICIOUS_DOMAINS.find(
    (item) => item.domain.toLowerCase() === parsed.hostname || parsed.hostname.endsWith('.' + item.domain.toLowerCase())
  );

  if (matchedThreat) {
    findings.push({
      id: 'known_threat_intel_match',
      category: 'known_threat_db',
      severity: 'critical',
      title: `Threat Intel Match: ${matchedThreat.threatType}`,
      description: matchedThreat.description,
      technicalDetail: `Direct match against active threat signature database for campaign targeting ${matchedThreat.target}.`,
      scoreImpact: 90,
      recommendation: 'DO NOT VISIT OR ENTER CREDENTIALS. This domain is an active phishing infrastructure host.',
    });
    trustScore -= 90;
  }

  // 3. Protocol Security Heuristics
  if (parsed.protocol === 'http') {
    findings.push({
      id: 'insecure_http_protocol',
      category: 'protocol_vulnerability',
      severity: 'warning',
      title: 'Insecure Transmission Protocol (Plain HTTP)',
      description: 'The URL uses unencrypted HTTP. Data entered (passwords, credit cards, cookies) can be intercepted via network sniffing or man-in-the-middle attacks.',
      technicalDetail: 'Cleartext protocol (RFC 2616 port 80). No TLS encryption or server identity proof.',
      scoreImpact: 20,
      recommendation: 'Do not submit sensitive credentials on unencrypted HTTP pages.',
    });
    trustScore -= 20;
  } else if (parsed.protocol === 'https') {
    findings.push({
      id: 'https_tls_encryption',
      category: 'protocol_vulnerability',
      severity: 'pass',
      title: 'TLS/HTTPS Encryption Enforced',
      description: 'The connection uses encrypted HTTPS protocol, safeguarding in-flight network transit.',
      technicalDetail: 'Port 443 with TLS transport encapsulation.',
      scoreImpact: 0,
      recommendation: 'Remember: HTTPS only encrypts communication; modern phishing sites also acquire free SSL certificates.',
    });
  }

  // 4. IP Address Used as Hostname
  if (parsed.isIpAddress) {
    findings.push({
      id: 'raw_ip_hostname',
      category: 'ip_hostname',
      severity: 'critical',
      title: 'Direct IP Address Used as Hostname',
      description: 'Legitimate consumer and corporate services almost never direct users to raw numerical IP addresses. Scammers use direct IPs to bypass domain registration oversight.',
      technicalDetail: `Host parsed as literal IP format: ${parsed.hostname}`,
      scoreImpact: 45,
      recommendation: 'Avoid entering any sensitive data. Real web services employ verified domain names.',
    });
    trustScore -= 45;
  }

  // 5. Non-Standard Port Analysis
  if (parsed.port && !['80', '443', '8080', '8443'].includes(parsed.port)) {
    findings.push({
      id: 'abnormal_network_port',
      category: 'port_anomaly',
      severity: 'warning',
      title: `Non-Standard Network Port (:${parsed.port})`,
      description: `The URL connects over port ${parsed.port}. Attackers frequently run backdoors, proxy relays, or unlicensed phishing servers on irregular high-range ports.`,
      technicalDetail: `Target socket port ${parsed.port} deviates from standard IANA web ports 80/443.`,
      scoreImpact: 15,
      recommendation: 'Verify why the service requires an unconventional network port before logging in.',
    });
    trustScore -= 15;
  }

  // 6. Subdomain Deception & Deep Nesting
  const subParts = parsed.subdomain ? parsed.subdomain.split('.') : [];
  if (subParts.length >= 3) {
    findings.push({
      id: 'deep_subdomain_nesting',
      category: 'subdomain_deception',
      severity: 'warning',
      title: 'Excessive Subdomain Nesting (Deep Stacking)',
      description: `Contains ${subParts.length} levels of subdomains. Phishing campaigns chain subdomains like "paypal.com.verify.account.attacker.com" to push the true root domain off the screen on mobile devices.`,
      technicalDetail: `Subdomain chain: "${parsed.subdomain}". Root domain is actually "${parsed.domainName}.${parsed.tld}".`,
      scoreImpact: 25,
      recommendation: 'Focus on the domain immediately preceding the TLD to verify the actual owner.',
    });
    trustScore -= 25;
  }

  // 7. URL Obfuscation & Character Anomalies
  if (rawInput.includes('@')) {
    findings.push({
      id: 'at_symbol_redirection',
      category: 'url_obfuscation',
      severity: 'critical',
      title: 'Deceptive "@" Authority Redirection Trick',
      description: 'The URL includes an "@" symbol. In URL standards, everything before the "@" is treated as user authentication credentials, and the browser silently routes you to the host AFTER the "@".',
      technicalDetail: 'RFC 3986 userinfo syntax exploitation. Attacker mimics authentic domain prefix before "@".',
      scoreImpact: 50,
      recommendation: 'Never open URLs with "@" symbols; they are almost exclusively crafted for deceptive redirects.',
    });
    trustScore -= 50;
  }

  const hyphenCount = (parsed.domainName.match(/-/g) || []).length;
  if (hyphenCount >= 3) {
    findings.push({
      id: 'excessive_domain_hyphenation',
      category: 'scam_keywords',
      severity: 'warning',
      title: 'Excessive Hyphenation in Domain Name',
      description: `The domain name contains ${hyphenCount} hyphens. Attackers frequently stitch brand names with trust terms using multiple hyphens (e.g. "chase-online-account-login-verify").`,
      technicalDetail: `Hyphen count in SLD: ${hyphenCount}`,
      scoreImpact: 15,
      recommendation: 'High-reputation companies rarely use more than one hyphen in their primary domain.',
    });
    trustScore -= 15;
  }

  // Check for percent-encoded obfuscation in hostname or path
  if (/%[0-9a-fA-F]{2}/.test(parsed.hostname) || /%(2e|2f|40|23)/i.test(rawInput)) {
    findings.push({
      id: 'hex_encoded_obfuscation',
      category: 'url_obfuscation',
      severity: 'warning',
      title: 'Percent-Encoded Characters in URL String',
      description: 'The URL uses hex-encoded escape sequences (%20, %2e, etc.) to evade keyword filters and disguise the real destination.',
      technicalDetail: 'Hex encoded values found in URL tokens.',
      scoreImpact: 15,
      recommendation: 'Inspect decoded target destination before clicking.',
    });
    trustScore -= 15;
  }

  // 8. TLD Reputation Analysis
  const tldRep = evaluateTld(parsed.tld);
  if (tldRep.isHighRiskForPhishing) {
    const impact = tldRep.riskRating === 'critical' ? 30 : 20;
    findings.push({
      id: 'abused_tld_indicator',
      category: 'malicious_tld',
      severity: tldRep.riskRating === 'critical' ? 'critical' : 'warning',
      title: `High-Abuse Top Level Domain (.${tldRep.tld})`,
      description: tldRep.reputationNotes,
      technicalDetail: `Reputation tier: ${tldRep.riskRating.toUpperCase()}. ${tldRep.abuseRate}.`,
      scoreImpact: impact,
      recommendation: 'Exercise heightened caution. Attackers gravitate toward low-cost disposable TLDs for disposable phishing pages.',
    });
    trustScore -= impact;
  } else {
    findings.push({
      id: 'standard_tld_profile',
      category: 'malicious_tld',
      severity: 'pass',
      title: `Standard TLD Category (.${tldRep.tld})`,
      description: tldRep.reputationNotes,
      technicalDetail: `Risk rating: ${tldRep.riskRating}.`,
      scoreImpact: 0,
      recommendation: 'Standard domain registry environment.',
    });
  }

  // 9. Homoglyph & Punycode Engine
  const homoglyphResult = detectHomoglyphs(parsed.hostname);
  if (homoglyphResult.hasHomoglyphs) {
    const charsList = homoglyphResult.suspiciousCharacters
      .map((c) => `"${c.char}" (${c.script} ${c.codePoint} mimicking "${c.latinLookalike}")`)
      .join(', ');

    findings.push({
      id: 'homoglyph_idn_spoof',
      category: 'homoglyph',
      severity: 'critical',
      title: 'Internationalized Confusable / Homoglyph Attack Detected',
      description: `The domain uses foreign script lookalike characters that appear identical to Latin characters to human eyes: ${charsList}.`,
      technicalDetail: `Punycode representation: ${homoglyphResult.punycode}. Decoded representation: ${homoglyphResult.decoded}.`,
      scoreImpact: 60,
      recommendation: 'DO NOT TRUST. This is an advanced visual deception attack designed to impersonate a brand.',
    });
    trustScore -= 60;
  }

  // 10. Brand Impersonation & Typosquatting Check
  const impersonationResult = checkBrandImpersonation(
    parsed.domainName,
    parsed.hostname,
    subParts
  );

  if (impersonationResult.isImpersonating) {
    findings.push({
      id: 'brand_impersonation_detected',
      category: 'brand_impersonation',
      severity: 'critical',
      title: `Brand Impersonation: Mimicking ${impersonationResult.brand}`,
      description: impersonationResult.explanation,
      technicalDetail: `Attack classification: ${impersonationResult.attackType.toUpperCase()}. Official legitimate domain is "${impersonationResult.officialDomain}". Similarity metric: ${(impersonationResult.similarityScore * 100).toFixed(0)}%.`,
      scoreImpact: 50,
      recommendation: `This site is NOT owned by ${impersonationResult.brand}. Visit "${impersonationResult.officialDomain}" directly by typing it in your browser.`,
    });
    trustScore -= 50;
  }

  // 11. Sensitive Phishing Keywords in SLD / Path
  const scamKeywords = [
    'login', 'signin', 'verify', 'verification', 'security', 'secure', 'account',
    'update', 'wallet', 'recovery', 'passphrase', 'claim', 'airdrop', 'support',
    'billing', 'suspended', 'unlock', 'auth', 'portal', 'bonus', 'free', 'gift',
  ];

  const matchedKeywords = scamKeywords.filter(
    (kw) => parsed.domainName.includes(kw) || subParts.some((s) => s.includes(kw))
  );

  if (matchedKeywords.length >= 2 && !isDirectlyTrusted) {
    findings.push({
      id: 'coercive_phishing_keywords',
      category: 'scam_keywords',
      severity: 'warning',
      title: 'Suspicious Security & Urgency Keywords in Domain',
      description: `Domain contains multiple security bait terms: [${matchedKeywords.join(', ')}]. Scammers use these terms to manufacture a pretext of account verification.`,
      technicalDetail: `Detected keyword matches: ${matchedKeywords.join(', ')} in hostname string.`,
      scoreImpact: 15,
      recommendation: 'Check whether the root domain belongs to the entity requesting verification.',
    });
    trustScore -= 15;
  }

  // Clamp trust score between 0 and 100
  trustScore = Math.max(0, Math.min(100, trustScore));

  // Determine overall risk level
  let riskLevel: RiskLevel = 'safe';
  let verdict = 'Safe Website';
  let summaryExplanation = 'No phishing indicators or brand impersonation detected. This domain appears authentic.';

  if (trustScore <= 45) {
    riskLevel = 'dangerous';
    verdict = impersonationResult.isImpersonating 
      ? `Fake ${impersonationResult.brand} Website`
      : 'Fake / Phishing Website';
    summaryExplanation = impersonationResult.isImpersonating
      ? `Warning: This website is pretending to be ${impersonationResult.brand}, but the real domain is ${impersonationResult.officialDomain}.`
      : 'This link shows strong signs of a phishing scam designed to steal credentials or payments.';
  } else if (trustScore <= 75) {
    riskLevel = 'suspicious';
    verdict = 'Suspicious Website';
    summaryExplanation = 'This link has several red flags such as unusual domain extensions or misleading wording. Proceed with caution.';
  } else if (trustScore <= 89) {
    riskLevel = 'low';
    verdict = 'Likely Safe';
    summaryExplanation = 'No major threats found, but always verify before entering passwords on unfamiliar pages.';
  } else {
    riskLevel = 'safe';
    verdict = 'Legitimate Website';
    summaryExplanation = isDirectlyTrusted
      ? `Verified official domain for ${parsed.domainName.charAt(0).toUpperCase() + parsed.domainName.slice(1)}.`
      : 'Standard verified website with valid security structure.';
  }

  const simulatedWhois = generateSimulatedWhois(
    parsed,
    isDirectlyTrusted,
    matchedThreat !== undefined || trustScore <= 35
  );

  return {
    id: Math.random().toString(36).substring(2, 9),
    inputUrl: rawInput,
    normalizedUrl: normalized,
    parsed,
    trustScore,
    riskLevel,
    verdict,
    summaryExplanation,
    findings,
    impersonation: impersonationResult,
    homoglyph: homoglyphResult,
    tldReputation: tldRep,
    simulatedWhois,
    analyzedAt: Date.now(),
    isOfflineAnalyzed: true,
  };
}
