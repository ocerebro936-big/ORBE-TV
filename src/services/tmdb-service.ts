import { TmdbMovie, TmdbFavoriteResponse, TmdbAccountConfig } from '../types/tmdb';
import { INITIAL_TMDB_FAVORITE_MOVIES, TMDB_GENRES } from '../data/tmdb-movies-data';

const TMDB_API_BASE = 'https://api.themoviedb.org/3';
const STORAGE_KEY_CONFIG = 'ublue_tmdb_config_v1';
const STORAGE_KEY_FAVORITES = 'ublue_tmdb_favorites_v1';

export class TmdbService {
  private static instance: TmdbService;

  static getInstance(): TmdbService {
    if (!TmdbService.instance) {
      TmdbService.instance = new TmdbService();
    }
    return TmdbService.instance;
  }

  /**
   * Retrieves saved account configuration from localStorage or default
   */
  getStoredConfig(): TmdbAccountConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed reading TMDB config from localStorage', e);
    }
    return {
      accountId: '21589304',
      apiToken: '',
      language: 'pt-PT',
      isConnected: false
    };
  }

  saveConfig(config: TmdbAccountConfig): void {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.warn('Failed saving TMDB config', e);
    }
  }

  /**
   * Get cached local favorites list
   */
  getLocalFavorites(): TmdbMovie[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_FAVORITES);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed loading local favorites', e);
    }
    return INITIAL_TMDB_FAVORITE_MOVIES;
  }

  saveLocalFavorites(movies: TmdbMovie[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(movies));
    } catch (e) {
      console.warn('Failed saving local favorites', e);
    }
  }

  /**
   * Fetches favorite movies using:
   * GET https://api.themoviedb.org/3/account/{account_id}/favorite/movies
   */
  async fetchAccountFavoriteMovies(
    accountId: string,
    tokenOrKey: string,
    page: number = 1,
    language: string = 'pt-PT',
    sortBy: string = 'created_at.desc'
  ): Promise<{ response: TmdbFavoriteResponse; source: 'api' | 'cached' }> {
    const cleanAccountId = accountId.trim() || '{account_id}';
    const targetUrl = `${TMDB_API_BASE}/account/${cleanAccountId}/favorite/movies?language=${language}&page=${page}&sort_by=${sortBy}`;

    if (!tokenOrKey.trim()) {
      // Offline/Demo Mode with local storage
      const local = this.getLocalFavorites();
      return {
        response: {
          page: 1,
          results: local,
          total_pages: 1,
          total_results: local.length
        },
        source: 'cached'
      };
    }

    try {
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };

      let finalUrl = targetUrl;
      if (tokenOrKey.startsWith('eyJ') || tokenOrKey.length > 50) {
        // Bearer v4 Read Access Token
        headers['Authorization'] = `Bearer ${tokenOrKey.trim()}`;
      } else {
        // Standard API Key (v3)
        finalUrl += `&api_key=${encodeURIComponent(tokenOrKey.trim())}`;
      }

      const res = await fetch(finalUrl, {
        method: 'GET',
        headers
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      
      const mappedResults: TmdbMovie[] = (data.results || []).map((m: any) => ({
        ...m,
        is_favorite: true,
        genres: (m.genre_ids || []).map((id: number) => TMDB_GENRES[id] || 'Cinema')
      }));

      // Cache locally
      this.saveLocalFavorites(mappedResults);

      return {
        response: {
          page: data.page || 1,
          results: mappedResults,
          total_pages: data.total_pages || 1,
          total_results: data.total_results || mappedResults.length
        },
        source: 'api'
      };
    } catch (err) {
      console.warn('Error fetching TMDB favorite movies, falling back to curated list:', err);
      const local = this.getLocalFavorites();
      return {
        response: {
          page: 1,
          results: local,
          total_pages: 1,
          total_results: local.length
        },
        source: 'cached'
      };
    }
  }

  /**
   * Toggles movie favorite status:
   * POST https://api.themoviedb.org/3/account/{account_id}/favorite
   */
  async toggleFavorite(
    accountId: string,
    tokenOrKey: string,
    movieId: number,
    favorite: boolean
  ): Promise<{ success: boolean; syncedWithApi: boolean }> {
    // 1. Optimistic update to local storage
    const local = this.getLocalFavorites();
    let updated: TmdbMovie[];
    if (favorite) {
      const existing = local.find(m => m.id === movieId);
      if (existing) {
        updated = local.map(m => m.id === movieId ? { ...m, is_favorite: true } : m);
      } else {
        const foundInInitial = INITIAL_TMDB_FAVORITE_MOVIES.find(m => m.id === movieId);
        if (foundInInitial) {
          updated = [ { ...foundInInitial, is_favorite: true }, ...local ];
        } else {
          updated = local;
        }
      }
    } else {
      updated = local.filter(m => m.id !== movieId);
    }
    this.saveLocalFavorites(updated);

    // 2. If API token provided, sync to TMDB account
    if (tokenOrKey.trim()) {
      try {
        const cleanAccountId = accountId.trim();
        let targetUrl = `${TMDB_API_BASE}/account/${cleanAccountId}/favorite`;
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        };

        if (tokenOrKey.startsWith('eyJ') || tokenOrKey.length > 50) {
          headers['Authorization'] = `Bearer ${tokenOrKey.trim()}`;
        } else {
          targetUrl += `?api_key=${encodeURIComponent(tokenOrKey.trim())}`;
        }

        const res = await fetch(targetUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            media_type: 'movie',
            media_id: movieId,
            favorite
          })
        });

        if (res.ok) {
          return { success: true, syncedWithApi: true };
        }
      } catch (err) {
        console.warn('Failed syncing favorite with TMDB API', err);
      }
    }

    return { success: true, syncedWithApi: false };
  }
}

export const tmdbService = TmdbService.getInstance();
