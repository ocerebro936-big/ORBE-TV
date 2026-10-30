import { Content, Channel, Program, SubscriptionTier } from '../types/content';
import { UBlueContentPlugin } from '../plugins/plugin-interface';
import { createPluginRegistry } from '../plugins/registry';
import { MOCK_CHANNELS, MOCK_CONTENT_CATALOG } from '../data/mock-content';

export interface UnifiedSearchResults {
  query: string;
  totalResults: number;
  live: Channel[];
  music: Content[];
  channels: Channel[];
  podcasts: Content[];
  movies: Content[];
  sports: Content[];
  news: Content[];
  originals: Content[];
  allNormalized: Content[];
  sourcesHit: string[];
}

export class UBlueContentEngine {
  private plugins: UBlueContentPlugin[];
  private activePluginIds: Set<string>;
  private catalogCache: Content[] = [];
  private channelsCache: Channel[] = [];

  constructor() {
    this.plugins = createPluginRegistry();
    this.activePluginIds = new Set(this.plugins.map(p => p.id));
    this.catalogCache = [...MOCK_CONTENT_CATALOG];
    this.channelsCache = [...MOCK_CHANNELS];
  }

  getPlugins(): UBlueContentPlugin[] {
    return this.plugins;
  }

  isPluginActive(id: string): boolean {
    return this.activePluginIds.has(id);
  }

  togglePlugin(id: string): boolean {
    if (this.activePluginIds.has(id)) {
      this.activePluginIds.delete(id);
      return false;
    } else {
      this.activePluginIds.add(id);
      return true;
    }
  }

  /**
   * Content Normalizer: Takes raw heterogenous inputs from external connectors
   * and maps them into a pristine, unified UBlue Content schema with uniform
   * branding, access metadata, and security attributes.
   */
  normalizeExternalItem(raw: Record<string, unknown>, sourcePlugin: string): Content {
    return {
      id: String(raw.id || `norm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`),
      title: String(raw.title || 'Conteúdo UBlue'),
      description: String(raw.description || 'Disponível no Universo Blue'),
      category: (raw.category as Content['category']) || 'music',
      thumbnail: String(raw.thumbnail || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'),
      coverImage: String(raw.coverImage || raw.thumbnail || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80'),
      duration: raw.duration ? String(raw.duration) : undefined,
      year: typeof raw.year === 'number' ? raw.year : 2026,
      rating: raw.rating ? String(raw.rating) : 'Livre',
      authorOrHost: raw.authorOrHost ? String(raw.authorOrHost) : undefined,
      source: (sourcePlugin as Content['source']) || 'ublue-internal',
      provider: String(raw.provider || 'UBlue Normalized Engine'),
      contentId: String(raw.contentId || raw.id || 'ext-item'),
      rights: (raw.rights as Content['rights']) || 'licensed',
      availability: (raw.availability as Content['availability']) || 'all-regions',
      country: String(raw.country || 'Moçambique'),
      subscriptionTier: (raw.subscriptionTier as SubscriptionTier) || 'start',
      liveNow: Boolean(raw.liveNow),
      viewersCount: typeof raw.viewersCount === 'number' ? raw.viewersCount : 1200,
      tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : ['ublue']
    };
  }

  /**
   * Unified Search Engine: Queries all active plugins & normalizes the results into
   * a single cohesive view where the user doesn't know nor care where the stream originated.
   */
  async unifiedSearch(query: string): Promise<UnifiedSearchResults> {
    const q = query.trim().toLowerCase();
    const sourcesHit: string[] = [];

    // Query active plugins
    const searchPromises = this.plugins
      .filter(p => this.activePluginIds.has(p.id))
      .map(async p => {
        sourcesHit.push(p.name);
        try {
          return await p.search(q);
        } catch {
          return [];
        }
      });

    const pluginResults = (await Promise.all(searchPromises)).flat();

    // Also search channels
    const matchedChannels = this.channelsCache.filter(ch =>
      ch.name.toLowerCase().includes(q) ||
      ch.tagline.toLowerCase().includes(q) ||
      ch.currentProgram.toLowerCase().includes(q) ||
      ch.category.toLowerCase().includes(q)
    );

    // Filter combined normalized content
    const allNormalized = Array.from(
      new Map([...this.catalogCache, ...pluginResults].map(item => [item.id, item])).values()
    ).filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q))
    );

    const live = matchedChannels.filter(c => c.category === 'live');
    const music = allNormalized.filter(c => c.category === 'music');
    const podcasts = allNormalized.filter(c => c.category === 'podcasts');
    const movies = allNormalized.filter(c => c.category === 'movies');
    const sports = allNormalized.filter(c => c.category === 'sports');
    const news = allNormalized.filter(c => c.category === 'news');
    const originals = allNormalized.filter(c => c.category === 'originals');

    return {
      query,
      totalResults: matchedChannels.length + allNormalized.length,
      live,
      channels: matchedChannels,
      music,
      podcasts,
      movies,
      sports,
      news,
      originals,
      allNormalized,
      sourcesHit
    };
  }

  getAllChannels(): Channel[] {
    return this.channelsCache;
  }

  getAllContent(): Content[] {
    return this.catalogCache;
  }

  async getScheduleForChannel(channelId: string): Promise<Program[]> {
    const epgPlugin = this.plugins.find(p => p.id === 'epg');
    if (epgPlugin && this.activePluginIds.has('epg')) {
      return await epgPlugin.getSchedule(channelId);
    }
    return [];
  }
}

export const contentEngine = new UBlueContentEngine();
