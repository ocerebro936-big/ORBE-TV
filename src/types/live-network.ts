export type VirtualStudioScene =
  | 'central-maputo'
  | 'newsroom-24h'
  | 'estudio-acustico'
  | 'talent-stage';

export interface LowerThirdOverlay {
  active: boolean;
  kicker: string;
  headline: string;
  subline: string;
  theme: 'breaking-news' | 'standard-blue' | 'talent-gold' | 'sports-green';
}

export interface PlayoutScheduleItem {
  id: string;
  timeSlot: string; // "14:00"
  durationMinutes: number;
  title: string;
  category: 'Notícias' | 'Música' | 'UBlue Originals' | 'Desporto' | 'Be Universe Show' | 'Academy';
  streamSource: 'live-studio' | 'hls-vod' | 'youtube-relay' | 'partner-feed';
  streamUrl: string;
  thumbnail: string;
  hasAdBreak: boolean;
  status: 'concluido' | 'no-ar' | 'a-seguir';
}

export interface LiveRadioStation {
  id: string;
  name: string;
  frequency: string;
  city: string;
  format: 'Icecast' | 'Shoutcast' | 'HLS Audio';
  bitrateKbps: number;
  streamUrl: string;
  logo: string;
  currentTrack: string;
  currentHost: string;
  listenersCount: number;
  isLive: boolean;
}

export interface TalentContestant {
  id: string;
  name: string;
  artisticName: string;
  province: string;
  specialty: 'Canto & Marrabenta' | 'Dança Urbana' | 'Apresentação TV' | 'Humor & Standup' | 'Produção Musical';
  avatar: string;
  votesCount: number;
  juryScore: number; // 0-10
  status: 'em-competicao' | 'salvo' | 'zona-de-risco';
  songOrAct: string;
}

export interface AcademyCourse {
  id: string;
  title: string;
  instructor: string;
  role: string;
  thumbnail: string;
  duration: string;
  modulesCount: number;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  studentsEnrolled: number;
  certificateProvided: boolean;
  description: string;
  videoPreviewUrl?: string;
}

export interface StreamHealthMetric {
  channelId: string;
  channelName: string;
  ingestFormat: 'HLS (.m3u8)' | 'RTMP' | 'MPEG-DASH';
  resolution: string;
  fps: number;
  bitrateMbps: number;
  latencyMs: number;
  cdnCacheHitRatio: number;
  drmStatus: 'Protegido (AES-128)' | 'ClearKey' | 'Aberto Legal';
  healthStatus: 'excelente' | 'estavel' | 'degradado';
  activeViewers: number;
}

export interface AdInsertionSlot {
  id: string;
  campaignTitle: string;
  advertiser: string;
  adDurationSeconds: number;
  type: 'Pre-roll' | 'Mid-roll' | 'L-Shape Banner' | 'Ticker Sponsor';
  cpmMT: number;
  budgetMT: number;
  targetChannels: string[];
}
