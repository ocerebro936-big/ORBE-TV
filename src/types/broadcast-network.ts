/**
 * Tipos e Interfaces para:
 * 1. UBlue TV Real Broadcast Network (Emissão Linear em Tempo Real sincronizada com CAT / UTC+2)
 * 2. Blocos Publicitários Estruturados (5, 10 e 15 minutos)
 * 3. UBlue Sponsored Broadcast ("Pagar para Ser Visto")
 * 4. Broadcast Marketplace (Compra e Telemetria de Exibição)
 * 5. Direitos e Licenças de Transmissão (Legal Clearance, Contratos Digitais e RevShare)
 */

export type BroadcastSlotTier = 'madrugada' | 'manha' | 'tarde' | 'prime-time';

export type BroadcastContentType = 
  | 'video'
  | 'musica'
  | 'documentario'
  | 'empresa'
  | 'evento'
  | 'podcast'
  | 'noticias'
  | 'desporto'
  | 'educacao';

export type CreatorMarketplaceProfile = 
  | 'artista'
  | 'empresa'
  | 'escola'
  | 'produtora'
  | 'organizador';

export type TerritorialRights = 'mz_exclusive' | 'palop' | 'sadc' | 'global';

export type MonetizationContractModel = 
  | 'revshare_70_30'
  | 'flat_fee'
  | 'royalty_per_minute'
  | 'patrocinio';

export interface CommercialBreakConfig {
  hasBreak: boolean;
  breakStart: string; // ex: '20:45'
  breakDurationMinutes: 5 | 10 | 15;
  adSpots: {
    id: string;
    brand: string;
    headline: string;
    category: string;
    durationSec: number;
    tagline: string;
  }[];
  ubluePromos: {
    id: string;
    title: string;
    scheduleNote: string;
    highlightBadge: string;
  }[];
}

export interface RealBroadcastProgram {
  id: string;
  timeSlot: string; // '06:00', '08:00', etc.
  timeEnd: string;
  title: string;
  categoryName: string;
  realMediaType: 'musica' | 'noticias' | 'filme' | 'desporto' | 'podcast' | 'concerto' | 'comercial' | 'educacao';
  presenter: string;
  synopsis: string;
  thumbnail: string;
  ratingAge: string;
  commercialBreak: CommercialBreakConfig;
  mediaPayload: {
    musicTrack?: {
      title: string;
      artist: string;
      album: string;
      genre: string;
      tempoBpm: number;
      audioProfile: string;
      lyricsSnippet: string;
    };
    newsBulletin?: {
      anchorName: string;
      liveLocation: string;
      breakingTicker: string[];
      topStory: string;
      financials: {
        usdMzn: number;
        zarMzn: number;
        eurMzn: number;
      };
      weather: { city: string; tempC: number; condition: string }[];
    };
    movieDetails?: {
      director: string;
      runtime: string;
      aspectRatio: string;
      soundtrack: string;
      currentSceneName: string;
      synopsisSummary: string;
    };
    sportsMatch?: {
      homeTeam: string;
      awayTeam: string;
      competition: string;
      homeScore: number;
      awayScore: number;
      matchMinute: number;
      stadium: string;
      possession: string;
      shotsOnTarget: string;
      liveCommentary: string;
    };
    podcastInfo?: {
      host: string;
      guests: string[];
      episodeTopic: string;
      waveformStyle: string;
    };
  };
}

export interface BroadcastMarketplaceItem {
  id: string;
  creatorName: string;
  creatorProfile: CreatorMarketplaceProfile;
  title: string;
  contentType: BroadcastContentType;
  targetSlot: string;
  tier: BroadcastSlotTier;
  durationMinutes: number;
  costMT: number;
  scheduledDate: string;
  status: 'rascunho' | 'revisao_editorial' | 'aprovado' | 'no_ar' | 'concluido';
  legalClearance: {
    contractNumber: string;
    rightsOwner: string;
    nuit: string;
    territory: TerritorialRights;
    monetizationModel: MonetizationContractModel;
    revShareCreatorPercent: number; // e.g. 70
    revSharePlatformPercent: number; // e.g. 30
    signedAt: string;
    certificateHash: string;
    editorialChecklist: {
      gabinfoCompliance: boolean;
      incmBroadcastNorms: boolean;
      copyrightOwnershipVerified: boolean;
      ageClassification: 'Livre' | '10+' | '12+' | '16+' | '18+';
    };
  };
  liveStats: {
    peakViewers: number;
    totalWatchTimeMinutes: number;
    averageRetentionPercent: number;
    revenueEarnedMT: number;
    adInteractions: number;
  };
}

export interface SlotPricingTier {
  id: BroadcastSlotTier;
  label: string;
  timeRange: string;
  description: string;
  basePriceMT: number;
  audienceMultiplier: string;
  badgeColor: string;
  peakAudienceAvg: number;
}
