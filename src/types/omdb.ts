export interface OmdbSearchResultItem {
  Title: string;
  Year: string;
  imdbID: string;
  Type: 'movie' | 'series' | 'episode';
  Poster: string;
}

export interface OmdbSearchResponse {
  Search?: OmdbSearchResultItem[];
  totalResults?: string;
  Response: 'True' | 'False';
  Error?: string;
}

export interface OmdbMovieDetail {
  Title: string;
  Year: string;
  Rated?: string;
  Released?: string;
  Runtime?: string;
  Genre?: string;
  Director?: string;
  Writer?: string;
  Actors?: string;
  Plot?: string;
  Language?: string;
  Country?: string;
  Awards?: string;
  Poster?: string;
  Ratings?: Array<{ Source: string; Value: string }>;
  Metascore?: string;
  imdbRating?: string;
  imdbVotes?: string;
  imdbID: string;
  Type?: string;
  totalSeasons?: string;
  Response: 'True' | 'False';
  Error?: string;
}

export interface OmdbTunerPreset {
  title: string;
  imdbId: string;
  category: 'movies' | 'originals' | 'kids' | 'sports' | 'live';
  streamUrl: string;
  tagline: string;
}
