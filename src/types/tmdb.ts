export interface TmdbMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  genres?: string[];
  adult?: boolean;
  video?: boolean;
  is_favorite?: boolean;
  trailer_key?: string; // YouTube video ID
  stream_url?: string;
  director?: string;
  runtime?: number;
}

export interface TmdbFavoriteResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
}

export interface TmdbAccountConfig {
  accountId: string;
  apiToken: string;
  sessionId?: string;
  language: string;
  isConnected: boolean;
}
