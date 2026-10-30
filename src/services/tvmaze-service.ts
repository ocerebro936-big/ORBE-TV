import { TvmazeEpisode, TvmazeShow, TvmazeWebChannel } from '../types/tvmaze';
import {
  TVMAZE_API_BASE,
  TVMAZE_CURATED_WEBCHANNELS,
  INITIAL_FALLBACK_EPISODES
} from '../data/tvmaze-webchannels-data';

class TvmazeService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

  /**
   * Fetches the web schedule from https://api.tvmaze.com/schedule/web
   * @param country - optional ISO country code (e.g. 'US', 'GB', 'BR'). If empty string '', returns global only. If undefined, returns both.
   * @param date - optional YYYY-MM-DD date.
   */
  async getWebSchedule(country?: string, date?: string): Promise<{ episodes: TvmazeEpisode[]; isLive: boolean }> {
    const params = new URLSearchParams();
    if (country !== undefined) {
      params.set('country', country);
    }
    if (date) {
      params.set('date', date);
    }

    const queryStr = params.toString();
    const endpoint = `${TVMAZE_API_BASE}/schedule/web${queryStr ? `?${queryStr}` : ''}`;

    // Check memory cache
    const cached = this.cache.get(endpoint);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
      return { episodes: cached.data, isLive: true };
    }

    try {
      const response = await fetch(endpoint, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`TVmaze API responded with HTTP ${response.status}`);
      }

      const rawEpisodes: any[] = await response.json();
      
      // Clean and normalize
      const episodes: TvmazeEpisode[] = rawEpisodes.map((item) => ({
        id: item.id,
        url: item.url,
        name: item.name || 'Episódio Especial',
        season: item.season || 1,
        number: item.number ?? null,
        type: item.type || 'regular',
        airdate: item.airdate,
        airtime: item.airtime || '',
        airstamp: item.airstamp,
        runtime: item.runtime || null,
        rating: item.rating || { average: null },
        image: item.image || item._embedded?.show?.image || null,
        summary: item.summary,
        _embedded: item._embedded
      }));

      this.cache.set(endpoint, { data: episodes, timestamp: Date.now() });
      return { episodes, isLive: true };
    } catch (err) {
      console.warn('TVmaze API fetch failed, using curated data:', err);
      // Fallback
      return {
        episodes: INITIAL_FALLBACK_EPISODES,
        isLive: false
      };
    }
  }

  /**
   * Searches shows on TVmaze (useful for finding which web channel hosts a show)
   * https://api.tvmaze.com/search/shows?q=...
   */
  async searchShows(query: string): Promise<TvmazeShow[]> {
    if (!query.trim()) return [];

    const endpoint = `${TVMAZE_API_BASE}/search/shows?q=${encodeURIComponent(query.trim())}`;
    const cached = this.cache.get(endpoint);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
      return cached.data;
    }

    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const results = await response.json();
      const shows: TvmazeShow[] = results.map((r: any) => r.show);
      this.cache.set(endpoint, { data: shows, timestamp: Date.now() });
      return shows;
    } catch (err) {
      console.warn('TVmaze show search failed:', err);
      return [];
    }
  }

  /**
   * Fetches specific web channel info by id
   * https://api.tvmaze.com/webchannels/:id
   */
  async getWebChannel(id: number): Promise<TvmazeWebChannel | null> {
    const endpoint = `${TVMAZE_API_BASE}/webchannels/${id}`;
    const cached = this.cache.get(endpoint);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
      return cached.data;
    }

    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      this.cache.set(endpoint, { data, timestamp: Date.now() });
      return data;
    } catch {
      const found = TVMAZE_CURATED_WEBCHANNELS.find((c) => c.id === id);
      return found || null;
    }
  }

  /**
   * Returns list of top curated web channels
   */
  getCuratedChannels(): TvmazeWebChannel[] {
    return TVMAZE_CURATED_WEBCHANNELS;
  }
}

export const tvmazeService = new TvmazeService();
