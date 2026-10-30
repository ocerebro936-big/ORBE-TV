export type VideoResolution = '1080p' | '720p' | '480p' | '360p';

export interface TranscodeRendition {
  resolution: VideoResolution;
  width: number;
  height: number;
  videoBitrateKbps: number;
  audioBitrateKbps: number;
  fps: number;
  codec: string;
  profile: string;
  chunkDurationSec: number;
  segmentPrefix: string;
  bandwidth: number;
}

export interface IngestEndpointConfig {
  channelId: string;
  channelName: string;
  protocol: 'RTMP' | 'SRT' | 'WebRTC';
  rtmpUrl: string;
  srtUrl: string;
  streamKey: string;
  status: 'online' | 'idle' | 'transcoding' | 'error';
  incomingFps: number;
  incomingBitrateKbps: number;
  audioChannels: string;
  originServer: string;
  activeViewers: number;
  renditions: TranscodeRendition[];
}

export interface HlsMasterManifest {
  version: number;
  targetDuration: number;
  mediaSequence: number;
  renditions: {
    resolution: string;
    bandwidth: number;
    codecs: string;
    uri: string;
  }[];
  rawManifestText: string;
}

export interface MPesaTransactionPayload {
  transactionId: string;
  thirdPartyReference: string;
  customerMsisdn: string; // e.g. 258841234567
  amount: number;
  currency: 'MZN';
  serviceCode: string;
  timestamp: string;
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'REVERSED';
  responseCode: string;
  responseDesc: string;
}

export interface EMolaTransactionPayload {
  referenceNumber: string;
  clientPhone: string;
  amountMT: number;
  accountReference: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  authCode: string;
  timestamp: string;
}

export interface EntitlementTokenPayload {
  sub: string; // userId
  profileId: string;
  tier: string;
  entitledChannels: string[];
  entitledPPVs: string[];
  maxStreams: number;
  drmWidevinePssh?: string;
  drmFairPlayKeyUrl?: string;
  ipAddress: string;
  countryCode: string;
  iat: number;
  exp: number;
  jwtToken: string;
}

export interface TVODEvent {
  id: string;
  title: string;
  category: 'Concerto' | 'Luta MMA/Boxe' | 'Conferência' | 'Festival' | 'Be Universe Live';
  artistOrHost: string;
  priceMT: number;
  date: string;
  time: string;
  venue: string;
  bannerImage: string;
  ticketSold: number;
  capacity: number;
  status: 'upcoming' | 'live' | 'ended';
  streamKey: string;
  description: string;
  isPurchased?: boolean;
}

export interface AVODCampaign {
  id: string;
  advertiser: string;
  title: string;
  type: 'preroll' | 'midroll' | 'overlay' | 'banner';
  durationSec: number;
  skipAfterSec?: number;
  vastTagUrl: string;
  vmapOffset?: string; // e.g. 00:05:00
  budgetMT: number;
  cpmMT: number;
  impressionsDelivered: number;
  clickThroughUrl: string;
  status: 'active' | 'scheduled' | 'paused';
}

export interface BeUniverseItem {
  id: string;
  type: 'talent-show' | 'reality' | 'casting' | 'music' | 'podcast' | 'original-24h';
  title: string;
  season?: string;
  episode?: string;
  host: string;
  status: 'production' | 'ready' | 'airing-247' | 'auditions-open';
  viewsCount: number;
  coverImage: string;
  description: string;
  duration?: string;
  hlsStreamUrl?: string;
  storageGb: number;
}

export interface MozPopTelemetry {
  popId: string;
  city: string;
  ispPeering: string[];
  status: 'operational' | 'deploying' | 'planned';
  latencyMs: number;
  bandwidthGbps: number;
  cacheHitRatio: number;
  connectedSubscribers: number;
  phase: 'Fase 1' | 'Fase 2' | 'Fase 3';
}
