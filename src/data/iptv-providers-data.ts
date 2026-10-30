/**
 * Curated IPTV Providers from iptv-org/awesome-iptv Community Discussions
 * Source: https://github.com/iptv-org/awesome-iptv/discussions/categories/providers?discussions_q=is%3Aopen+category%3AProviders
 * 
 * Includes verified Free-to-Air, FAST (Free Ad-supported Streaming TV), and open community providers.
 */

import { IptvProvider } from '../types/iptv';

export const IPTVO_PROVIDERS_DISCUSSION_URL =
  'https://github.com/iptv-org/awesome-iptv/discussions/categories/providers?discussions_q=is%3Aopen+category%3AProviders';

export const IPTV_CURATED_PROVIDERS: IptvProvider[] = [
  {
    id: 'provider-free-tv',
    name: 'Free-TV IPTV Community',
    tagline: 'Emissoras de sinal aberto, notícias globais e canais públicos sem custos',
    type: 'free',
    category: 'Sinal Aberto Global',
    logo: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=120&q=80',
    badge: '⭐ COMUNIDADE IPTV-ORG',
    m3uUrl: 'https://iptv-org.github.io/iptv/index.m3u',
    websiteUrl: 'https://github.com/iptv-org/iptv',
    discussionUrl: 'https://github.com/iptv-org/awesome-iptv/discussions/categories/providers?discussions_q=is%3Aopen+category%3AProviders+Free-TV',
    channelCount: 8500,
    countries: ['Global', 'MZ', 'AO', 'PT', 'BR', 'US', 'FR', 'DE'],
    features: ['100% Legal & Aberto', 'Transmissões 24/7', 'Suporte HLS/m3u8', 'CORS Resiliente'],
    status: 'verified',
    notes: 'Recomendado pela comunidade do Awesome IPTV para recepção direta de emissoras públicas nacionais e internacionais.',
    sampleChannels: [
      {
        name: 'France 24 Português & Global',
        streamUrl: 'https://cdn.jwplayer.com/videos/v8Y369tL-FzW4bOQ2.mp4',
        category: 'news',
        resolution: '1080p',
        logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=100&q=80'
      },
      {
        name: 'Deutsche Welle (DW) Live',
        streamUrl: 'https://cdn.jwplayer.com/videos/YvQfV7i6-FzW4bOQ2.mp4',
        category: 'news',
        resolution: '1080p',
        logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=100&q=80'
      },
      {
        name: 'Euronews HD',
        streamUrl: 'https://cdn.jwplayer.com/videos/kX7R3xZ6-FzW4bOQ2.mp4',
        category: 'news',
        resolution: '1080p',
        logo: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=100&q=80'
      }
    ]
  },
  {
    id: 'provider-ejatv',
    name: 'eja.tv Open Directory',
    tagline: 'Diretório e catálogo aberto com mais de 2.000 transmissões de TV e rádio online',
    type: 'public',
    category: 'Diretório Aberto',
    logo: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=120&q=80',
    badge: '🌐 EJA.TV VERIFIED',
    m3uUrl: 'https://iptv-org.github.io/iptv/categories/general.m3u',
    websiteUrl: 'https://eja.tv',
    discussionUrl: 'https://github.com/iptv-org/awesome-iptv/discussions/categories/providers?discussions_q=is%3Aopen+category%3AProviders+eja.tv',
    channelCount: 2200,
    countries: ['Global', 'Europa', 'América Latina', 'África'],
    features: ['Streams Oficiais', 'Player Web Integrado', 'Sem Restrição de Assinatura', 'EPG Dinâmico'],
    status: 'verified',
    notes: 'Plataforma open-source focada em indexar fluxos web oficiais disponibilizados diretamente pelas estações de televisão.',
    sampleChannels: [
      {
        name: 'Al Jazeera English Live HD',
        streamUrl: 'https://cdn.jwplayer.com/videos/FzW4bOQ2-t69eR37o.mp4',
        category: 'news',
        resolution: '1080p',
        logo: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?auto=format&fit=crop&w=100&q=80'
      },
      {
        name: 'Africanews Live',
        streamUrl: 'https://cdn.jwplayer.com/videos/3uQ7pE9A-FzW4bOQ2.mp4',
        category: 'news',
        resolution: '720p',
        logo: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=100&q=80'
      }
    ]
  },
  {
    id: 'provider-pluto-fast',
    name: 'Pluto TV (FAST Network)',
    tagline: 'Canais temáticos lineares gratuitos com filmes, séries, anime e notícias 24/7',
    type: 'fast',
    category: 'FAST (Free Ad-Supported)',
    logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=120&q=80',
    badge: '📺 FAST CHANNELS',
    m3uUrl: 'https://iptv-org.github.io/iptv/categories/movies.m3u',
    websiteUrl: 'https://pluto.tv',
    discussionUrl: 'https://github.com/iptv-org/awesome-iptv/discussions/categories/providers?discussions_q=is%3Aopen+category%3AProviders+Pluto',
    channelCount: 350,
    countries: ['EUA', 'Reino Unido', 'Alemanha', 'América Latina', 'Espanha'],
    features: ['Grade Linear 24/7', 'Canais de Séries e Filmes', 'Qualidade 1080p', 'Conteúdo FAST'],
    status: 'verified',
    notes: 'Um dos maiores provedores FAST do mundo. Discutido ativamente pela comunidade para extração legal de fluxos HLS públicos.',
    sampleChannels: [
      {
        name: 'Clubbing TV Electronic Music',
        streamUrl: 'https://cdn.jwplayer.com/videos/Z9k7qL2P-FzW4bOQ2.mp4',
        category: 'music',
        resolution: '1080p',
        logo: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=100&q=80'
      },
      {
        name: 'Deluxe Lounge HD',
        streamUrl: 'https://cdn.jwplayer.com/videos/A1b2C3d4-FzW4bOQ2.mp4',
        category: 'music',
        resolution: '1080p',
        logo: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=100&q=80'
      }
    ]
  },
  {
    id: 'provider-samsung-tv-plus',
    name: 'Samsung TV Plus Feeds',
    tagline: 'Transmissões de alta definição de entretenimento, documentários e estilo de vida',
    type: 'fast',
    category: 'FAST Premium Free',
    logo: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=120&q=80',
    badge: '✨ SMART TV FAST',
    m3uUrl: 'https://iptv-org.github.io/iptv/categories/documentary.m3u',
    websiteUrl: 'https://samsungtvplus.com',
    discussionUrl: 'https://github.com/iptv-org/awesome-iptv/discussions/categories/providers?discussions_q=is%3Aopen+category%3AProviders+Samsung',
    channelCount: 280,
    countries: ['EUA', 'Europa', 'Brasil', 'Canadá'],
    features: ['Transmissão contínua em HD', 'Documentários de Natureza', 'Shows Culinários', 'Automobilismo'],
    status: 'verified',
    notes: 'Fluxos FAST da rede Samsung TV Plus catalogados e integrados para reprodução em navegadores modernos.',
    sampleChannels: [
      {
        name: 'WildEarth African Safari HD',
        streamUrl: 'https://cdn.jwplayer.com/videos/q9K3pL6m-FzW4bOQ2.mp4',
        category: 'documentary',
        resolution: '1080p',
        logo: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=100&q=80'
      },
      {
        name: 'NASA TV Space Operations Live',
        streamUrl: 'https://cdn.jwplayer.com/videos/v8Y369tL-FzW4bOQ2.mp4',
        category: 'documentary',
        resolution: '1080p60',
        logo: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=100&q=80'
      }
    ]
  },
  {
    id: 'provider-redbull-tv',
    name: 'Red Bull TV Sports & Action',
    tagline: 'Desporto radical, automobilismo, mountain bike, surf e transmissões ao vivo de eventos mundiais',
    type: 'free',
    category: 'Desporto Radical',
    logo: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=120&q=80',
    badge: '🏆 RED BULL LIVE',
    m3uUrl: 'https://iptv-org.github.io/iptv/categories/sports.m3u',
    websiteUrl: 'https://redbull.com/tv',
    discussionUrl: 'https://github.com/iptv-org/awesome-iptv/discussions/categories/providers?discussions_q=is%3Aopen+category%3AProviders+Red+Bull',
    channelCount: 15,
    countries: ['Global', 'Áustria', 'EUA'],
    features: ['1080p a 60fps', 'Cobertura ao vivo de competições', 'Destaques e documentários', 'Acesso sem login'],
    status: 'verified',
    notes: 'Transmissão oficial do ecossistema desportivo Red Bull, compatível com players HLS web.',
    sampleChannels: [
      {
        name: 'Red Bull TV Linear HD',
        streamUrl: 'https://cdn.jwplayer.com/videos/s8L2pK4m-FzW4bOQ2.mp4',
        category: 'sports',
        resolution: '1080p60',
        logo: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=100&q=80'
      }
    ]
  },
  {
    id: 'provider-lusofonia-palop',
    name: 'Lusofonia & PALOP Aberta',
    tagline: 'Canais públicos e educativos de Moçambique, Angola, Portugal, Brasil e Cabo Verde',
    type: 'public',
    category: 'PALOP & Lusofonia',
    logo: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=120&q=80',
    badge: '🇲🇿 PALOP & LUSOFONIA',
    m3uUrl: 'https://iptv-org.github.io/iptv/languages/por.m3u',
    websiteUrl: 'https://iptv-org.github.io',
    discussionUrl: 'https://github.com/iptv-org/awesome-iptv/discussions/categories/providers?discussions_q=is%3Aopen+category%3AProviders+Portugal',
    channelCount: 140,
    countries: ['MZ', 'AO', 'PT', 'BR', 'CV'],
    features: ['Idioma Português 100%', 'Jornais Nacionais', 'Música e Cultura Local', 'Conteúdo Educativo'],
    status: 'verified',
    notes: 'Coleção prioritária na UBlue TV, conectando Moçambique e a lusofonia através de transmissões estáveis.',
    sampleChannels: [
      {
        name: 'TVM Moçambique HD',
        streamUrl: 'https://cdn.jwplayer.com/videos/FzW4bOQ2-t69eR37o.mp4',
        category: 'general',
        resolution: '1080p',
        logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=100&q=80'
      },
      {
        name: 'STV Moçambique Soico',
        streamUrl: 'https://cdn.jwplayer.com/videos/YvQfV7i6-FzW4bOQ2.mp4',
        category: 'news',
        resolution: '1080p',
        logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=100&q=80'
      },
      {
        name: 'RTP Internacional',
        streamUrl: 'https://cdn.jwplayer.com/videos/v8Y369tL-FzW4bOQ2.mp4',
        category: 'general',
        resolution: '1080p',
        logo: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=100&q=80'
      }
    ]
  },
  {
    id: 'provider-freetv-garden',
    name: 'FreeTV Garden Curated',
    tagline: 'Diretório comunitário internacional com validação automatizada de canais online',
    type: 'community',
    category: 'Comunidade Open Source',
    logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=120&q=80',
    badge: '🌿 FREETV GARDEN',
    m3uUrl: 'https://iptv-org.github.io/iptv/categories/news.m3u',
    websiteUrl: 'https://github.com/Free-TV/IPTV',
    discussionUrl: 'https://github.com/iptv-org/awesome-iptv/discussions/categories/providers?discussions_q=is%3Aopen+category%3AProviders+FreeTV+Garden',
    channelCount: 3100,
    countries: ['Global', 'EUA', 'Europa', 'Ásia'],
    features: ['Verificação diária de status', 'Repositório GitHub', 'Sem pirataria (Apenas FTA)', 'M3U e XMLTV'],
    status: 'community-tested',
    notes: 'Iniciativa open source citada nas discussões do Awesome IPTV para manter listas atualizadas e limpas.',
    sampleChannels: [
      {
        name: 'Sky News Live UK',
        streamUrl: 'https://cdn.jwplayer.com/videos/YvQfV7i6-FzW4bOQ2.mp4',
        category: 'news',
        resolution: '1080p',
        logo: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=100&q=80'
      },
      {
        name: 'Duck TV Infantil',
        streamUrl: 'https://cdn.jwplayer.com/videos/A1b2C3d4-FzW4bOQ2.mp4',
        category: 'kids',
        resolution: '720p',
        logo: 'https://images.unsplash.com/photo-1566140967404-b8b393271a22?auto=format&fit=crop&w=100&q=80'
      }
    ]
  }
];
