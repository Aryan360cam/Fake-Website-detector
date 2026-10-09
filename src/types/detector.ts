export type RiskLevel = 'safe' | 'low' | 'suspicious' | 'high_risk' | 'dangerous';

export type Severity = 'critical' | 'warning' | 'info' | 'pass';

export type ThreatCategory =
  | 'homoglyph'
  | 'typosquatting'
  | 'ip_hostname'
  | 'protocol_vulnerability'
  | 'malicious_tld'
  | 'url_obfuscation'
  | 'subdomain_deception'
  | 'scam_keywords'
  | 'known_threat_db'
  | 'brand_impersonation'
  | 'entropy_anomaly'
  | 'port_anomaly';

export interface AnalysisFinding {
  id: string;
  category: ThreatCategory;
  severity: Severity;
  title: string;
  description: string;
  technicalDetail: string;
  scoreImpact: number; // deducted points
  recommendation: string;
}

export interface ParsedUrlDetails {
  raw: string;
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  subdomain: string;
  domainName: string; // SLD (e.g., 'paypal' in 'paypal.com')
  tld: string;        // (e.g., 'com' or 'co.uk')
  isIpAddress: boolean;
  isPunycode: boolean;
  length: number;
}

export interface ImpersonationCheck {
  isImpersonating: boolean;
  brand: string;
  officialDomain: string;
  similarityScore: number;
  attackType: 'homoglyph' | 'typosquatting' | 'subdomain_spoof' | 'keyword_combination' | 'none';
  explanation: string;
}

export interface HomoglyphDetail {
  hasHomoglyphs: boolean;
  punycode: string;
  decoded: string;
  suspiciousCharacters: Array<{
    char: string;
    codePoint: string;
    script: string;
    latinLookalike: string;
  }>;
}

export interface TldReputation {
  tld: string;
  riskRating: 'low' | 'moderate' | 'high' | 'critical';
  abuseRate: string;
  reputationNotes: string;
  isHighRiskForPhishing: boolean;
}

export interface SimulatedDnsWhois {
  registrar: string;
  estimatedAgeCategory: 'newly_registered' | 'moderate' | 'established';
  estimatedDays: number;
  privacyShield: boolean;
  country: string;
  notes: string;
}

export interface AnalysisResult {
  id: string;
  inputUrl: string;
  normalizedUrl: string;
  parsed: ParsedUrlDetails;
  trustScore: number; // 0 to 100
  riskLevel: RiskLevel;
  verdict: string;
  summaryExplanation: string;
  findings: AnalysisFinding[];
  impersonation: ImpersonationCheck;
  homoglyph: HomoglyphDetail;
  tldReputation: TldReputation;
  simulatedWhois: SimulatedDnsWhois;
  analyzedAt: number;
  isOfflineAnalyzed: boolean;
}

export interface PresetSample {
  id: string;
  category: 'Banking Phishing' | 'Crypto Drainer' | 'Brand Impersonation' | 'Tech Support Scam' | 'Fake E-Commerce' | 'Verified Safe';
  title: string;
  url: string;
  expectedRisk: RiskLevel;
  description: string;
}

export interface ContentAnalysisResult {
  id: string;
  score: number;
  riskLevel: RiskLevel;
  detectedFlags: Array<{
    title: string;
    severity: Severity;
    pattern: string;
    explanation: string;
  }>;
  summary: string;
}
