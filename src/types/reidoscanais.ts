/**
 * Rei dos Canais API Specification & Types
 * Endpoint Base: https://api.reidoscanais.si
 */

export interface ReiDosCanaisEmbed {
  provider: string;   // ex: "Servidor 1", "Premiere", "CazéTV", "CDN Rápido"
  quality: string;    // ex: "HD", "FHD", "4K", "SD"
  embed_url: string;  // Stream ou iframe embed URL
}

export interface ReiDosCanaisEPGItem {
  title: string;
  description?: string;
  formatted_time?: string;
  start_time?: number;
  end_time?: number;
  image?: string;
}

export interface ReiDosCanaisEPG {
  current?: ReiDosCanaisEPGItem;
  next?: ReiDosCanaisEPGItem;
}

export interface ReiDosCanaisChannel {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  category: 'Esportes' | 'Entretenimento' | 'Filmes & Séries' | 'Notícias' | 'Infantil' | 'Abertos' | string;
  embeds: ReiDosCanaisEmbed[];
  epg?: ReiDosCanaisEPG;
}

export interface ReiDosCanaisTeam {
  name: string;
  logo: string;
}

export interface ReiDosCanaisSportEvent {
  id: string;
  title: string;
  description: string;
  poster: string;
  category: 'Futebol' | 'Basquete' | 'Fórmula 1' | 'Lutas / MMA' | 'Tênis' | string;
  competition: string;
  teams?: {
    home: ReiDosCanaisTeam;
    away: ReiDosCanaisTeam;
  };
  start_time: string;
  start_timestamp: number;
  status: 'live' | 'upcoming' | 'finished';
  popular?: boolean;
  score?: {
    home: number;
    away: number;
    period?: string;
  };
  embeds: ReiDosCanaisEmbed[];
}

export interface ReiDosCanaisChannelsResponse {
  success: boolean;
  data: ReiDosCanaisChannel[];
  total: number;
}

export interface ReiDosCanaisSportsResponse {
  success: boolean;
  data: ReiDosCanaisSportEvent[];
  total: number;
}

export interface ReiDosCanaisSearchResponse {
  success: boolean;
  data: {
    channels: ReiDosCanaisChannel[];
    events: ReiDosCanaisSportEvent[];
  };
  meta: {
    query: string;
    total_channels: number;
    total_events: number;
  };
}
