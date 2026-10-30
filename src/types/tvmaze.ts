export interface TvmazeCountry {
  name: string;
  code: string;
  timezone: string;
}

export interface TvmazeWebChannel {
  id: number;
  name: string;
  country: TvmazeCountry | null;
  officialSite: string | null;
  slug?: string;
  category: 'giant' | 'fast' | 'regional' | 'anime' | 'specialty';
  logoBadge?: string;
  badgeColor?: string;
  description?: string;
  subscriberEstimate?: string;
  flagshipShows?: string[];
  features?: string[];
  isGlobal?: boolean;
}

export interface TvmazeShow {
  id: number;
  url: string;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string;
  runtime: number | null;
  averageRuntime?: number | null;
  premiered: string | null;
  ended?: string | null;
  officialSite: string | null;
  schedule: {
    time: string;
    days: string[];
  };
  rating: {
    average: number | null;
  };
  weight: number;
  network: {
    id: number;
    name: string;
    country: TvmazeCountry | null;
    officialSite: string | null;
  } | null;
  webChannel: TvmazeWebChannel | null;
  image: {
    medium: string;
    original: string;
  } | null;
  summary: string | null;
}

export interface TvmazeEpisode {
  id: number;
  url: string;
  name: string;
  season: number;
  number: number | null;
  type: string;
  airdate: string;
  airtime: string;
  airstamp: string;
  runtime: number | null;
  rating: {
    average: number | null;
  };
  image: {
    medium: string;
    original: string;
  } | null;
  summary: string | null;
  _links?: {
    self: { href: string };
    show?: { href: string; name: string };
  };
  _embedded?: {
    show: TvmazeShow;
  };
}

export interface TvmazeScheduleQuery {
  country?: string; // empty string for global only, 2-letter ISO for local, undefined for all
  date?: string;    // YYYY-MM-DD
}
