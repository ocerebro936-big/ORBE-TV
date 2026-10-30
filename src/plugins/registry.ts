import { UBlueContentPlugin } from './plugin-interface';
import { Content, Category, Channel, Program } from '../types/content';
import { MOCK_CHANNELS, MOCK_CONTENT_CATALOG, MOCK_SCHEDULES, CATEGORIES_LIST } from '../data/mock-content';

class BasePlugin implements UBlueContentPlugin {
  id: string;
  name: string;
  version: string;
  description: string;
  status: 'active' | 'standby' | 'error';
  latencyMs: number;
  provider: string;
  authRequired: boolean;

  constructor(
    id: string,
    name: string,
    version: string,
    description: string,
    provider: string,
    latencyMs: number = 45
  ) {
    this.id = id;
    this.name = name;
    this.version = version;
    this.description = description;
    this.provider = provider;
    this.status = 'active';
    this.latencyMs = latencyMs;
    this.authRequired = true;
  }

  async search(query: string): Promise<Content[]> {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return MOCK_CONTENT_CATALOG.filter(item => {
      const matchSource = item.source.toLowerCase().includes(this.id.split('-')[0]);
      const matchText = item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q));
      return matchText;
    });
  }

  async getCategories(): Promise<Category[]> {
    return CATEGORIES_LIST;
  }

  async getContent(id: string): Promise<Content | null> {
    return MOCK_CONTENT_CATALOG.find(c => c.id === id) || null;
  }

  async getLiveChannels(): Promise<Channel[]> {
    return MOCK_CHANNELS.filter(ch => {
      if (this.id === 'partner-tv') return ch.source === 'partner-tv';
      if (this.id === 'partner-radio') return ch.source === 'partner-radio';
      if (this.id === 'sports') return ch.source === 'sports-feed';
      return ch.source === 'ublue-internal';
    });
  }

  async getSchedule(channelId: string): Promise<Program[]> {
    return MOCK_SCHEDULES[channelId] || [];
  }
}

// 1. YouTube Connector Plugin
export class YouTubePlugin extends BasePlugin {
  constructor() {
    super(
      'youtube',
      'YouTube Media Connector',
      '1.4.0',
      'Integra transmissões autorizadas, clipes musicais e canais parceiros verificados do YouTube.',
      'Google / YouTube Cloud API',
      38
    );
  }

  override async search(query: string): Promise<Content[]> {
    const q = query.toLowerCase();
    return MOCK_CONTENT_CATALOG.filter(c => c.source === 'youtube' && (
      c.title.toLowerCase().includes(q) || c.tags.some(t => t.includes(q))
    ));
  }
}

// 2. Partner TV Plugin
export class PartnerTVPlugin extends BasePlugin {
  constructor() {
    super(
      'partner-tv',
      'Partner TV Ingestion Plugin',
      '2.1.0',
      'Conecta sinais de emissoras parceiras e canais regionais moçambicanos via HLS/SRT seguro.',
      'Moçambique Broadcasters Alliance',
      42
    );
  }

  override async getLiveChannels(): Promise<Channel[]> {
    return MOCK_CHANNELS.filter(c => c.source === 'partner-tv');
  }
}

// 3. Partner Radio Plugin
export class PartnerRadioPlugin extends BasePlugin {
  constructor() {
    super(
      'partner-radio',
      'Partner Radio Audio Hub',
      '1.2.0',
      'Streams de áudio em tempo real de emissoras de rádio FM e canais de streaming de áudio.',
      'Rádio Moçambique & Independent FM API',
      24
    );
  }

  override async getLiveChannels(): Promise<Channel[]> {
    return MOCK_CHANNELS.filter(c => c.source === 'partner-radio');
  }
}

// 4. EPG Plugin
export class EPGPlugin extends BasePlugin {
  constructor() {
    super(
      'epg',
      'EPG XMLTV Metadata Plugin',
      '3.0.2',
      'Agrega e sincroniza guias eletrônicos de programação semanal com fuso de Maputo (CAT / UTC+2).',
      'UBlue EPG Aggregator Engine',
      18
    );
  }

  override async getSchedule(channelId: string): Promise<Program[]> {
    return MOCK_SCHEDULES[channelId] || [
      {
        id: `epg-${channelId}-now`,
        channelId,
        title: 'Programação Regular UBlue',
        description: 'Transmissão contínua em alta definição.',
        startTime: '12:00',
        endTime: '18:00',
        progressPercent: 55,
        category: 'Geral',
        live: true
      }
    ];
  }
}

// 5. Movies Metadata Plugin
export class MoviesMetadataPlugin extends BasePlugin {
  constructor() {
    super(
      'movies-metadata',
      'Movies & VOD Metadata Engine',
      '2.5.0',
      'Indexação de filmes, sinopses, posters em alta resolução e licenças de distribuição.',
      'Cinema Lusofonia DB API',
      55
    );
  }

  override async search(query: string): Promise<Content[]> {
    const q = query.toLowerCase();
    return MOCK_CONTENT_CATALOG.filter(c => c.category === 'movies' && (
      c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    ));
  }
}

// 6. News Plugin
export class NewsPlugin extends BasePlugin {
  constructor() {
    super(
      'news',
      'Realtime News Feed Plugin',
      '1.8.0',
      'Agregação de notícias de última hora, cotações de câmbio e alertas informativos oficiais.',
      'Agência de Informação de Moçambique & RSS Hub',
      32
    );
  }

  override async search(query: string): Promise<Content[]> {
    const q = query.toLowerCase();
    return MOCK_CONTENT_CATALOG.filter(c => c.category === 'news' && (
      c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    ));
  }
}

// 7. Sports Plugin
export class SportsPlugin extends BasePlugin {
  constructor() {
    super(
      'sports',
      'Sports Live Score & Matches',
      '2.2.1',
      'Dados de jogos ao vivo, placares do Moçambola, ligas internacionais e transmissões.',
      'SportsData Africa Gateway',
      29
    );
  }

  override async search(query: string): Promise<Content[]> {
    const q = query.toLowerCase();
    return MOCK_CONTENT_CATALOG.filter(c => c.category === 'sports' && (
      c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    ));
  }
}

// 8. Podcasts Plugin
export class PodcastsPlugin extends BasePlugin {
  constructor() {
    super(
      'podcasts',
      'Podcasts & Audio Series Ingest',
      '1.3.4',
      'Indexador de podcasts africanos e globais com suporte a streaming de baixa largura de banda.',
      'African Podcast Syndicate',
      41
    );
  }

  override async search(query: string): Promise<Content[]> {
    const q = query.toLowerCase();
    return MOCK_CONTENT_CATALOG.filter(c => c.category === 'podcasts' && (
      c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    ));
  }
}

// 9. Live Events Plugin
export class LiveEventsPlugin extends BasePlugin {
  constructor() {
    super(
      'live-events',
      'Live Events & PPV Gateway',
      '2.0.0',
      'Gerencia festivais ao vivo, conferências e transmissões especiais em tempo real com ingressos/planos.',
      'UBlue Event Streaming Network',
      35
    );
  }

  override async getLiveChannels(): Promise<Channel[]> {
    return MOCK_CHANNELS.filter(c => c.category === 'live');
  }
}

export function createPluginRegistry(): UBlueContentPlugin[] {
  return [
    new YouTubePlugin(),
    new PartnerTVPlugin(),
    new PartnerRadioPlugin(),
    new EPGPlugin(),
    new MoviesMetadataPlugin(),
    new NewsPlugin(),
    new SportsPlugin(),
    new PodcastsPlugin(),
    new LiveEventsPlugin(),
  ];
}
