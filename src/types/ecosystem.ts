export type CreatorCategory =
  | 'Música'
  | 'Notícias'
  | 'Educação'
  | 'Humor'
  | 'Religião'
  | 'Negócios'
  | 'Tecnologia'
  | 'Desporto'
  | 'Infantil';

export interface CreatorContentItem {
  id: string;
  title: string;
  type: 'video' | 'podcast' | 'tv-show';
  category: CreatorCategory;
  thumbnail: string;
  duration: string;
  publishedAt: string;
  views: number;
  earningsMT: number;
  status: 'published' | 'processing' | 'draft';
  monetization: {
    viewsCpm: boolean;
    subscriptions: boolean;
    ads: boolean;
  };
  aiMetadata?: {
    summary?: string;
    subtitlesLanguages?: string[];
    idealPublishSlot?: string;
    sentimentScore?: number;
  };
}

export interface CreatorChannel {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  banner: string;
  subscribers: number;
  totalViews: number;
  totalEarningsMT: number;
  category: CreatorCategory;
  verified: boolean;
}

export interface BusinessCampaign {
  id: string;
  brandName: string;
  title: string;
  type: 'video-ad' | 'sponsored-banner' | 'event-streaming' | 'product-launch' | 'promo-campaign';
  budgetMT: number;
  spentMT: number;
  impressions: number;
  clicks: number;
  status: 'active' | 'scheduled' | 'completed';
  targetAudience: string;
  placement: 'Pre-roll' | 'Mid-roll' | 'Hero Banner' | 'Live Stream Overlay';
}

export interface PartnerEntity {
  id: string;
  name: string;
  type: 'tv-local' | 'radio-comunitaria' | 'estudio' | 'produtora' | 'jornalista' | 'influenciador' | 'podcaster';
  location: string;
  reachEstimate: string;
  status: 'verified' | 'pending' | 'reviewing';
  channelsCount: number;
  badge: string;
  logo: string;
  bio: string;
}

export interface WalletTransaction {
  id: string;
  type: 'earning' | 'subscription-fee' | 'ppv-ticket' | 'transfer-out' | 'transfer-in' | 'withdrawal';
  amountMT: number;
  description: string;
  timestamp: string;
  method: 'M-Pesa' | 'E-Mola' | 'Cartão' | 'Transferência Bancária' | 'Saldo ORBE';
  status: 'concluido' | 'processando' | 'falha';
  referenceId: string;
}

export interface OrbeWalletState {
  balanceMT: number;
  pendingMT: number;
  totalWithdrawnMT: number;
  phoneNumber: string;
  transactions: WalletTransaction[];
}

// Alias for backwards compatibility
export type UBlueWalletState = OrbeWalletState;

export interface OriginalShow {
  id: string;
  title: string;
  type: 'Série' | 'Documentário' | 'Reality Show' | 'Concurso de Talentos' | 'Programa Musical' | 'Podcast Exclusivo';
  description: string;
  coverImage: string;
  episodesCount: number;
  talentAgency: 'Be Universe Agency' | 'UBlue Studios' | 'ORBE Studios';
  talents: string[];
  premiereDate: string;
  status: 'Em Exibição' | 'Brevemente' | 'Em Produção';
  rating: string;
  featuredQuote: string;
}
