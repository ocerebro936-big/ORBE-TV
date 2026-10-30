/**
 * Types & Interfaces for iptv-org integration
 * Source: https://github.com/iptv-org/iptv
 */

export interface IptvChannel {
  id: string;
  name: string;
  logo: string;
  category: string;
  country: string;
  countryCode: string;
  language: string;
  streamUrl: string;
  resolution?: string;
  isNsfw?: boolean;
  status: 'online' | 'degraded' | 'offline';
  bitrate?: string;
  currentProgram?: string;
  nextProgram?: string;
  provider?: string;
  isFavorite?: boolean;
  epgId?: string;
}

export interface IptvCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface IptvCountry {
  code: string;
  name: string;
  flag: string;
  count: number;
}

export interface IptvPlaylistPreset {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  countryCode?: string;
  badge: string;
}

export interface IptvProvider {
  id: string;
  name: string;
  tagline: string;
  type: 'free' | 'fast' | 'public' | 'community' | 'hybrid';
  category: string;
  logo: string;
  badge: string;
  m3uUrl?: string;
  websiteUrl?: string;
  discussionUrl: string; // Direct link to discussions/categories/providers
  channelCount: number;
  countries: string[];
  features: string[];
  status: 'verified' | 'active' | 'community-tested';
  notes: string;
  sampleChannels: {
    name: string;
    streamUrl: string;
    category: string;
    resolution: string;
    logo: string;
  }[];
}
