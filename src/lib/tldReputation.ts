import { TldReputation } from '../types/detector';

interface TldStats {
  rating: 'low' | 'moderate' | 'high' | 'critical';
  abuseRate: string;
  notes: string;
  isHighRisk: boolean;
}

const TLD_DATA: Record<string, TldStats> = {
  // Critical Risk TLDs (frequently free or cheap disposable domains favored by botnets & phishing kits)
  top: {
    rating: 'critical',
    abuseRate: 'High abuse volume (>42% malicious ratio in registrar audits)',
    notes: 'Cheap registrar pricing makes .top the highest-volume TLD for mass phishing kits and malicious payloads.',
    isHighRisk: true,
  },
  xyz: {
    rating: 'high',
    abuseRate: 'Elevated abuse volume (>28% flagged campaigns)',
    notes: 'Very popular among crypto drainer scams, wallet connection spoofers, and throwaway phishing pages.',
    isHighRisk: true,
  },
  buzz: {
    rating: 'critical',
    abuseRate: 'Extreme abuse ratio (>50% flagged by Spamhaus)',
    notes: 'Heavily abused for spam bot distribution, fake streaming services, and survey phishing.',
    isHighRisk: true,
  },
  click: {
    rating: 'critical',
    abuseRate: 'High abuse ratio (>38% malicious campaigns)',
    notes: 'Frequently leveraged in SMS phishing (smishing) links due to urgent click-bait naming.',
    isHighRisk: true,
  },
  rest: {
    rating: 'high',
    abuseRate: 'Elevated abuse ratio',
    notes: 'Commonly leveraged by disposable phishing proxies and credential harvesters.',
    isHighRisk: true,
  },
  country: {
    rating: 'critical',
    abuseRate: 'High abuse ratio',
    notes: 'Frequently utilized in fake postal tracking and logistics customs fee scams.',
    isHighRisk: true,
  },
  cfd: {
    rating: 'critical',
    abuseRate: 'Extreme abuse ratio',
    notes: 'Disposable ultra-low-cost TLD extensively abused for fake financial trading scams and crypto scams.',
    isHighRisk: true,
  },
  sbs: {
    rating: 'critical',
    abuseRate: 'Extreme abuse ratio',
    notes: 'Popularized among automated phishing generation tools targeting banking portals.',
    isHighRisk: true,
  },
  icu: {
    rating: 'high',
    abuseRate: 'Elevated abuse ratio',
    notes: 'High historical volume of credential harvesters and fake pharmacy spam.',
    isHighRisk: true,
  },
  bid: {
    rating: 'high',
    abuseRate: 'Elevated abuse ratio',
    notes: 'Commonly used in fake lottery, gaming item scams, and counterfeit retail auctions.',
    isHighRisk: true,
  },
  tk: {
    rating: 'critical',
    abuseRate: 'Free registry history - High historical abuse',
    notes: 'Formerly free Freenom TLD historically saturated with malware and phishing links.',
    isHighRisk: true,
  },
  ml: {
    rating: 'critical',
    abuseRate: 'Free registry history - High historical abuse',
    notes: 'High volume of automated botnet command-and-control domains and throwaway phishing links.',
    isHighRisk: true,
  },
  cam: {
    rating: 'high',
    abuseRate: 'High malicious ratio',
    notes: 'Frequently leveraged in blackmail/sextortion scams and malware redirectors.',
    isHighRisk: true,
  },
  work: {
    rating: 'high',
    abuseRate: 'Elevated abuse ratio',
    notes: 'Heavily abused in fake job offers, work-from-home scams, and corporate impersonation.',
    isHighRisk: true,
  },

  // Moderate / Watchlist TLDs
  info: {
    rating: 'moderate',
    abuseRate: 'Moderate abuse ratio',
    notes: 'General gTLD often picked for tech support alerts and informational impersonation sites.',
    isHighRisk: false,
  },
  online: {
    rating: 'moderate',
    abuseRate: 'Moderate abuse ratio',
    notes: 'Frequently used in fake login portals (e.g., bank-online.online).',
    isHighRisk: false,
  },
  site: {
    rating: 'moderate',
    abuseRate: 'Moderate abuse ratio',
    notes: 'Popular low-barrier gTLD with elevated presence in disposable phishing campaigns.',
    isHighRisk: false,
  },
  shop: {
    rating: 'moderate',
    abuseRate: 'Moderate to high in fake retail campaigns',
    notes: 'Commonly exploited by counterfeit luxury goods and non-delivery clearance stores.',
    isHighRisk: false,
  },
  space: {
    rating: 'moderate',
    abuseRate: 'Moderate abuse ratio',
    notes: 'Frequently used in Web3 airdrop phishing and fake NFT minting sites.',
    isHighRisk: false,
  },
  live: {
    rating: 'moderate',
    abuseRate: 'Moderate abuse ratio',
    notes: 'Popular among fake streaming events, postal delivery scams, and crypto giveaways.',
    isHighRisk: false,
  },
  support: {
    rating: 'moderate',
    abuseRate: 'Elevated impersonation incidence',
    notes: 'Often registered by attackers creating fake customer care and helpdesk portals.',
    isHighRisk: false,
  },

  // Low Risk / Trusted Standards
  com: {
    rating: 'low',
    abuseRate: 'Standard baseline gTLD',
    notes: 'Primary commercial TLD worldwide. Strict verification varies by registrar but baseline abuse ratio is low proportional to volume.',
    isHighRisk: false,
  },
  org: {
    rating: 'low',
    abuseRate: 'Standard baseline gTLD',
    notes: 'Primarily non-profit and open-source foundations. Generally reputable registrar oversight.',
    isHighRisk: false,
  },
  net: {
    rating: 'low',
    abuseRate: 'Standard baseline gTLD',
    notes: 'Traditional networking and internet infrastructure TLD.',
    isHighRisk: false,
  },
  edu: {
    rating: 'low',
    abuseRate: 'Strictly accredited institutions (<0.01% abuse)',
    notes: 'Restricted to accredited higher educational institutions. High degree of administrative vetting.',
    isHighRisk: false,
  },
  gov: {
    rating: 'low',
    abuseRate: 'Officially verified government entities only',
    notes: 'Restricted strictly to government agencies through strict federal/national identity verification.',
    isHighRisk: false,
  },
  mil: {
    rating: 'low',
    abuseRate: 'Strictly verified military',
    notes: 'Restricted strictly to authorized military branches.',
    isHighRisk: false,
  },
  io: {
    rating: 'low',
    abuseRate: 'Low abuse ratio',
    notes: 'Popular amongst developer tools, technology startups, and Web3 infrastructure.',
    isHighRisk: false,
  },
  dev: {
    rating: 'low',
    abuseRate: 'Low abuse ratio (Enforces HSTS by default)',
    notes: 'Google-managed TLD with enforced preloaded HSTS requiring strict HTTPS.',
    isHighRisk: false,
  },
  app: {
    rating: 'low',
    abuseRate: 'Low abuse ratio (Enforces HSTS by default)',
    notes: 'Google-managed TLD with mandatory preloaded HTTPS security.',
    isHighRisk: false,
  },
};

export function evaluateTld(tld: string): TldReputation {
  const cleanTld = tld.toLowerCase().replace(/^\./, '');
  
  if (TLD_DATA[cleanTld]) {
    const data = TLD_DATA[cleanTld];
    return {
      tld: cleanTld,
      riskRating: data.rating,
      abuseRate: data.abuseRate,
      reputationNotes: data.notes,
      isHighRiskForPhishing: data.isHighRisk,
    };
  }

  // Country code or unlisted generic TLD
  return {
    tld: cleanTld,
    riskRating: 'low',
    abuseRate: 'Normal baseline distribution',
    reputationNotes: 'Standard top-level domain without elevated systemic threat flags.',
    isHighRiskForPhishing: false,
  };
}
