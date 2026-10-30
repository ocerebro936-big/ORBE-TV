export type SubscriptionTier = 'free' | 'start' | 'basic' | 'medio' | 'max';

export interface PlanConfig {
  id: SubscriptionTier;
  name: string;
  priceMT: number;
  period: string;
  badgeColor: string;
  popular?: boolean;
  description: string;
  screens: number;
  quality: 'SD (480p)' | 'HD (720p)' | 'Full HD (1080p)' | 'Ultra HD 4K';
  features: string[];
}

export interface Program {
  id: string;
  channelId: string;
  title: string;
  description: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  progressPercent: number;
  category: string;
  live?: boolean;
}

export interface Channel {
  id: string;
  number: number;
  name: string;
  tagline: string;
  logo: string;
  coverImage: string;
  category: 'live' | 'news' | 'sports' | 'music' | 'movies' | 'kids' | 'radio' | 'originals';
  requiredTier: SubscriptionTier;
  currentProgram: string;
  nextProgram: string;
  viewers: number;
  source: string;
  provider: string;
  streamUrl?: string;
  videoType: 'hls' | 'mp4' | 'simulated';
  badge?: string;
}

export interface Content {
  id: string;
  title: string;
  description: string;
  category: 'live' | 'music' | 'movies' | 'news' | 'sports' | 'originals' | 'podcasts' | 'kids';
  thumbnail: string;
  coverImage: string;
  duration?: string;
  year?: number;
  rating?: string;
  authorOrHost?: string;
  source: 'ublue-internal' | 'youtube' | 'partner-tv' | 'partner-radio' | 'news-rss' | 'sports-feed' | 'podcast-hub' | 'movies-metadata' | 'live-events' | 'epg';
  provider: string;
  contentId: string;
  rights: 'exclusive' | 'licensed' | 'public-broadcast' | 'fair-use-api';
  availability: 'all-regions' | 'mozambique-only' | 'lusophone';
  country: string;
  subscriptionTier: SubscriptionTier;
  liveNow?: boolean;
  viewersCount?: number;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  planName: string;
  amountMT: number;
  method: 'mpesa' | 'emola' | 'card' | 'wallet';
  phone: string;
  transactionRef: string;
  date: string;
  status: 'completed' | 'pending';
}

export interface UserSubscription {
  tier: SubscriptionTier;
  status: 'active' | 'expired' | 'trial';
  expiresAt: string;
  autoRenew: boolean;
  paymentMethod?: 'mpesa' | 'emola' | 'card' | 'wallet';
  accountPhone?: string;
  lastPaymentDate?: string;
  transactionRef?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  subscription: UserSubscription;
  savedChannels: string[];
  favoriteContent: string[];
  history: string[];
  walletBalanceMT?: number;
  createdAt?: string;
  paymentHistory?: PaymentRecord[];
}
