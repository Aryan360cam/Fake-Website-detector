export interface TargetBrand {
  name: string;
  officialDomain: string;
  aliases: string[];
  keywords: string[];
  category: 'Banking & Finance' | 'Tech & Cloud' | 'E-Commerce' | 'Cryptocurrency' | 'Social & Gaming' | 'Logistics & Postal';
}

export const TARGET_BRANDS: TargetBrand[] = [
  {
    name: 'PayPal',
    officialDomain: 'paypal.com',
    aliases: ['paypal.me', 'paypal-objects.com'],
    keywords: ['paypal', 'paypa1', 'pay-pal', 'paypal-security', 'paypal-login'],
    category: 'Banking & Finance',
  },
  {
    name: 'Chase Bank',
    officialDomain: 'chase.com',
    aliases: ['jpmorganchase.com'],
    keywords: ['chase', 'chasebank', 'chase-security', 'chase-verify', 'chase-online'],
    category: 'Banking & Finance',
  },
  {
    name: 'Bank of America',
    officialDomain: 'bankofamerica.com',
    aliases: ['bofa.com'],
    keywords: ['bankofamerica', 'bofa', 'bank-of-america', 'bofa-auth'],
    category: 'Banking & Finance',
  },
  {
    name: 'Wells Fargo',
    officialDomain: 'wellsfargo.com',
    aliases: [],
    keywords: ['wellsfargo', 'wells-fargo', 'wellsfargo-verify'],
    category: 'Banking & Finance',
  },
  {
    name: 'Apple',
    officialDomain: 'apple.com',
    aliases: ['icloud.com', 'itunes.com'],
    keywords: ['apple', 'appleid', 'icloud', 'apple-support', 'apple-id', 'findmy-apple'],
    category: 'Tech & Cloud',
  },
  {
    name: 'Microsoft',
    officialDomain: 'microsoft.com',
    aliases: ['live.com', 'outlook.com', 'office.com', 'microsoftonline.com'],
    keywords: ['microsoft', 'micros0ft', 'office365', 'outlook', 'windows-defender', 'ms-support'],
    category: 'Tech & Cloud',
  },
  {
    name: 'Google',
    officialDomain: 'google.com',
    aliases: ['youtube.com', 'gmail.com', 'googlemail.com'],
    keywords: ['google', 'gooogle', 'g00gle', 'gmail-verify', 'google-security'],
    category: 'Tech & Cloud',
  },
  {
    name: 'Amazon',
    officialDomain: 'amazon.com',
    aliases: ['amazon.co.uk', 'amazon.de', 'aws.amazon.com', 'primevideo.com'],
    keywords: ['amazon', 'arnazon', 'amaz0n', 'amazon-order', 'amazon-refund', 'amazon-prime'],
    category: 'E-Commerce',
  },
  {
    name: 'Netflix',
    officialDomain: 'netflix.com',
    aliases: [],
    keywords: ['netflix', 'netf1ix', 'netflix-billing', 'netflix-update', 'netflix-renew'],
    category: 'Social & Gaming',
  },
  {
    name: 'Meta / Facebook',
    officialDomain: 'facebook.com',
    aliases: ['fb.com', 'meta.com', 'instagram.com', 'whatsapp.com'],
    keywords: ['facebook', 'faceb00k', 'instagram', 'whatsapp', 'meta-security', 'fb-appeals'],
    category: 'Social & Gaming',
  },
  {
    name: 'Steam',
    officialDomain: 'steampowered.com',
    aliases: ['steamcommunity.com'],
    keywords: ['steampowered', 'steamcommunity', 'steam-gift', 'steam-trade', 'steam-wallet'],
    category: 'Social & Gaming',
  },
  {
    name: 'MetaMask',
    officialDomain: 'metamask.io',
    aliases: [],
    keywords: ['metamask', 'meta-mask', 'metamask-restore', 'metamask-phrase', 'metamask-airdrop'],
    category: 'Cryptocurrency',
  },
  {
    name: 'Binance',
    officialDomain: 'binance.com',
    aliases: ['binance.us'],
    keywords: ['binance', 'binance-kyc', 'binance-reward', 'binance-auth'],
    category: 'Cryptocurrency',
  },
  {
    name: 'Coinbase',
    officialDomain: 'coinbase.com',
    aliases: [],
    keywords: ['coinbase', 'coinbase-pro', 'coinbase-verify', 'coinbase-help'],
    category: 'Cryptocurrency',
  },
  {
    name: 'DHL Express',
    officialDomain: 'dhl.com',
    aliases: ['dhl-express.com'],
    keywords: ['dhl', 'dhl-tracking', 'dhl-redelivery', 'dhl-package'],
    category: 'Logistics & Postal',
  },
  {
    name: 'USPS',
    officialDomain: 'usps.com',
    aliases: [],
    keywords: ['usps', 'usps-tracking', 'usps-redelivery', 'us-postal-service'],
    category: 'Logistics & Postal',
  },
  {
    name: 'Nike',
    officialDomain: 'nike.com',
    aliases: [],
    keywords: ['nike', 'nike-outlet', 'nike-clearance', 'nike-discount', 'nike-vip'],
    category: 'E-Commerce',
  },
];

// Offline database of verified malicious domains & signatures observed in active phishing / scam campaigns
export const KNOWN_MALICIOUS_DOMAINS: Array<{
  domain: string;
  threatType: string;
  target: string;
  description: string;
}> = [
  {
    domain: 'paypa1-security-login.top',
    threatType: 'Credential Harvester',
    target: 'PayPal',
    description: 'Impersonates PayPal with l->1 substitution and malicious .top TLD to steal credentials.',
  },
  {
    domain: 'chase-online-verify-security.xyz',
    threatType: 'Financial Phishing',
    target: 'Chase Bank',
    description: 'Deceptive banking multi-keyword subdomain spoof designed to harvest SSN and debit card details.',
  },
  {
    domain: 'metamask-restore-phrase-wallet.space',
    threatType: 'Crypto Wallet Drainer',
    target: 'MetaMask',
    description: 'Deceptive mnemonic seed phrase recovery portal configured to siphon private Ethereum keys.',
  },
  {
    domain: 'apple-support-id-cloud.cc',
    threatType: 'Account Takeover',
    target: 'Apple',
    description: 'Fake iCloud unlocked/lost-mode notification portal capturing 2FA verification codes.',
  },
  {
    domain: 'nike-official-outlet-clearance80.shop',
    threatType: 'Counterfeit Store Scam',
    target: 'Nike',
    description: 'Bogus e-commerce storefront offering 80% discounts to steal credit card payments and never ship.',
  },
  {
    domain: 'microsoft-security-defender-alert.info',
    threatType: 'Tech Support Scam',
    target: 'Microsoft',
    description: 'Lock-screen scam claiming Trojan-Spyware infection demanding victim call fake toll-free number.',
  },
  {
    domain: 'steamcommunity-trade-offers.bid',
    threatType: 'Inventory Stealer',
    target: 'Steam',
    description: 'Phishing clone requesting Steam OpenID authentication to hijack digital inventory skins.',
  },
  {
    domain: 'binance-kyc-reactivate.buzz',
    threatType: 'Exchange Drainer',
    target: 'Binance',
    description: 'Fake compliance urgency warning coercing users into entering API secret keys.',
  },
  {
    domain: 'amazon-prime-order-refund-hub.work',
    threatType: 'Refund Scam',
    target: 'Amazon',
    description: 'Phishing portal impersonating Amazon customer service for non-existent $999 unauthorized charge.',
  },
  {
    domain: 'dhl-express-package-redelivery.live',
    threatType: 'Smishing / Postal Scam',
    target: 'DHL',
    description: 'SMS-driven package fee redelivery scam asking for small $2.99 customs fee to steal full credit card.',
  },
];

// Offline list of renowned trusted apex domains
export const TRUSTED_OFFICIAL_DOMAINS = new Set([
  'google.com',
  'youtube.com',
  'apple.com',
  'icloud.com',
  'microsoft.com',
  'github.com',
  'gitlab.com',
  'wikipedia.org',
  'amazon.com',
  'netflix.com',
  'paypal.com',
  'chase.com',
  'bankofamerica.com',
  'wellsfargo.com',
  'facebook.com',
  'instagram.com',
  'whatsapp.com',
  'twitter.com',
  'x.com',
  'linkedin.com',
  'reddit.com',
  'nytimes.com',
  'bbc.com',
  'cnn.com',
  'reuters.com',
  'cloudflare.com',
  'openai.com',
  'anthropic.com',
  'stackoverflow.com',
  'mozilla.org',
  'w3.org',
  'gov.uk',
  'usa.gov',
  'irs.gov',
  'nike.com',
  'ebay.com',
  'spotify.com',
  'steampowered.com',
  'metamask.io',
  'binance.com',
  'coinbase.com',
  'dhl.com',
  'usps.com',
]);
