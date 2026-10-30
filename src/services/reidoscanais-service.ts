import {
  ReiDosCanaisChannel,
  ReiDosCanaisSportEvent,
  ReiDosCanaisChannelsResponse,
  ReiDosCanaisSportsResponse,
  ReiDosCanaisSearchResponse
} from '../types/reidoscanais';
import { Channel } from '../types/content';

export const REIDOSCANAIS_PRELOADED_CHANNELS: ReiDosCanaisChannel[] = [
  {
    id: 'globo-sp',
    name: 'Globo SP HD',
    description: 'Canal de televisão líder aberta brasileira com novelas, jornalismo e futebol ao vivo.',
    logo_url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=300&auto=format&fit=crop&q=80',
    category: 'Entretenimento',
    embeds: [
      { provider: 'Servidor 1 (Ultra Fast)', quality: 'FHD', embed_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
      { provider: 'Servidor 2 (Backup)', quality: 'HD', embed_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ],
    epg: {
      current: {
        title: 'Jornal Nacional',
        description: 'As principais notícias do Brasil e do mundo com cobertura especial ao vivo.',
        formatted_time: 'Hoje, das 20:30 às 21:20',
        start_time: Math.floor(Date.now() / 1000) - 1200,
        end_time: Math.floor(Date.now() / 1000) + 1800,
        image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=500&auto=format&fit=crop&q=80'
      },
      next: {
        title: 'Novela das 9: Renascer',
        description: 'Capítulo especial com grandes revelações e emoções.',
        formatted_time: 'Hoje, das 21:20 às 22:25'
      }
    }
  },
  {
    id: 'sportv-hd',
    name: 'SporTV HD',
    description: 'O canal campeão com transmissões esportivas nacionais, debates e cobertura olímpica.',
    logo_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&auto=format&fit=crop&q=80',
    category: 'Esportes',
    embeds: [
      { provider: 'Servidor CDN 1', quality: 'FHD 60fps', embed_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
      { provider: 'Servidor CDN 2', quality: 'HD', embed_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ],
    epg: {
      current: {
        title: 'Troca de Passes Ao Vivo',
        description: 'Análise aprofundada dos jogos da rodada com time de comentaristas.',
        formatted_time: 'Hoje, das 21:00 às 22:30',
        start_time: Math.floor(Date.now() / 1000) - 900,
        end_time: Math.floor(Date.now() / 1000) + 2700,
        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop&q=80'
      },
      next: {
        title: 'Seleção SporTV',
        description: 'O melhor debate sobre tática e mercado do futebol.',
        formatted_time: 'Hoje, das 22:30 às 00:00'
      }
    }
  },
  {
    id: 'premiere-clubes',
    name: 'Premiere Clubes HD',
    description: 'O melhor do Brasileirão Série A e B, Copa do Brasil e Estaduais 24 horas por dia.',
    logo_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&auto=format&fit=crop&q=80',
    category: 'Esportes',
    embeds: [
      { provider: 'Premiere Play Servidor 1', quality: 'FHD', embed_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
      { provider: 'Servidor 2 Alternativo', quality: 'HD', embed_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ],
    epg: {
      current: {
        title: 'Flamengo x Palmeiras (Pré-Jogo)',
        description: 'Aquecimento direto do Maracanã para a grande decisão do Brasileirão.',
        formatted_time: 'Hoje, das 20:00 às 21:00',
        start_time: Math.floor(Date.now() / 1000) - 1500,
        end_time: Math.floor(Date.now() / 1000) + 2100,
        image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500&auto=format&fit=crop&q=80'
      },
      next: {
        title: 'Flamengo x Palmeiras (Ao Vivo)',
        description: 'Transmissão com narração exclusiva Premiere.',
        formatted_time: 'Hoje, das 21:00 às 23:15'
      }
    }
  },
  {
    id: 'cazetv-ao-vivo',
    name: 'CazéTV HD',
    description: 'O fenômeno do streaming com Casimiro Miguel: Brasileirão, Jogos Olímpicos e transmissões descontraídas.',
    logo_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&auto=format&fit=crop&q=80',
    category: 'Esportes',
    embeds: [
      { provider: 'YouTube / Live Feed', quality: '1080p60', embed_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ],
    epg: {
      current: {
        title: 'CazéTV Live: Reações da Rodada',
        description: 'Casimiro e convidados comentando os melhores lances e memes do futebol.',
        formatted_time: 'Hoje, das 19:30 às 23:00',
        start_time: Math.floor(Date.now() / 1000) - 3000,
        end_time: Math.floor(Date.now() / 1000) + 4000
      },
      next: {
        title: 'Pós-Jogo com Galera',
        description: 'Entrevistas na zona mista e melhores momentos.',
        formatted_time: 'Hoje, das 23:00 às 01:00'
      }
    }
  },
  {
    id: 'espn-brasil',
    name: 'ESPN Brasil HD',
    description: 'Premier League, La Liga, NBA, NFL e o tradicional SportsCenter.',
    logo_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80',
    category: 'Esportes',
    embeds: [
      { provider: 'Star+ Servidor 1', quality: 'FHD', embed_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ],
    epg: {
      current: {
        title: 'SportsCenter Brasil',
        description: 'O programa esportivo mais premiado da TV com os gols internacionais.',
        formatted_time: 'Hoje, das 20:00 às 21:30'
      },
      next: {
        title: 'Linha de Passe',
        description: 'Mesa redonda sobre o futebol brasileiro.',
        formatted_time: 'Hoje, das 21:30 às 23:00'
      }
    }
  },
  {
    id: 'telecine-premium',
    name: 'Telecine Premium HD',
    description: 'Os maiores lançamentos do cinema hollywoodiano e sucessos de bilheteria direto na sua tela.',
    logo_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&auto=format&fit=crop&q=80',
    category: 'Filmes & Séries',
    embeds: [
      { provider: 'Servidor 1', quality: 'FHD', embed_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ],
    epg: {
      current: {
        title: 'Top Gun: Maverick',
        description: 'Após mais de 30 anos como um dos melhores aviadores da Marinha, Pete Mitchell treina graduados para uma missão especializada.',
        formatted_time: 'Hoje, das 20:00 às 22:15'
      },
      next: {
        title: 'Missão Impossível: Acerto de Contas',
        description: 'Ethan Hunt e sua equipe devem rastrear uma arma aterrorizante.',
        formatted_time: 'Hoje, das 22:15 às 01:00'
      }
    }
  },
  {
    id: 'hbo-brasil',
    name: 'HBO HD Brasil',
    description: 'Séries aclamadas pelo Emmy, produções originais e estreias semanais exclusivas.',
    logo_url: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&auto=format&fit=crop&q=80',
    category: 'Filmes & Séries',
    embeds: [
      { provider: 'Max Servidor 1', quality: '4K / FHD', embed_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ],
    epg: {
      current: {
        title: 'A Casa do Dragão (Temporada 2)',
        description: 'A guerra civil na Casa Targaryen atinge um clímax sangrento em Westeros.',
        formatted_time: 'Hoje, das 21:00 às 22:15'
      },
      next: {
        title: 'The Last of Us',
        description: 'Joel e Ellie atravessam os Estados Unidos pós-apocalíptico.',
        formatted_time: 'Hoje, das 22:15 às 23:20'
      }
    }
  },
  {
    id: 'discovery-channel',
    name: 'Discovery Channel HD',
    description: 'Ciência, sobrevivência, natureza, tecnologia e os mistérios do planeta Terra.',
    logo_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&auto=format&fit=crop&q=80',
    category: 'Entretenimento',
    embeds: [
      { provider: 'Discovery Feed 1', quality: 'HD', embed_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ],
    epg: {
      current: {
        title: 'Largados e Pelados Brasil',
        description: 'Sobrevivencialistas enfrentam biomas inóspitos sem suprimentos por 21 dias.',
        formatted_time: 'Hoje, das 20:40 às 21:40'
      },
      next: {
        title: 'Febre do Ouro',
        description: 'Mineradores arriscam tudo em busca de ouro no Alasca.',
        formatted_time: 'Hoje, das 21:40 às 22:40'
      }
    }
  },
  {
    id: 'cartoon-network',
    name: 'Cartoon Network HD',
    description: 'O melhor da animação mundial para crianças e jovens: clássicos e novas aventuras.',
    logo_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80',
    category: 'Infantil',
    embeds: [
      { provider: 'Kids Stream 1', quality: 'HD', embed_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ],
    epg: {
      current: {
        title: 'O Incrível Mundo de Gumball',
        description: 'As desventuras hilárias de Gumball Watterson e seu irmão Darwin.',
        formatted_time: 'Hoje, das 20:00 às 21:00'
      },
      next: {
        title: 'Hora de Aventura',
        description: 'Finn e Jake exploram a mágica Terra de Ooo.',
        formatted_time: 'Hoje, das 21:00 às 22:00'
      }
    }
  },
  {
    id: 'cnn-brasil',
    name: 'CNN Brasil HD',
    description: 'Jornalismo 24 horas ao vivo com apuração em tempo real, economia e política internacional.',
    logo_url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=300&auto=format&fit=crop&q=80',
    category: 'Notícias',
    embeds: [
      { provider: 'CNN Feed 1', quality: 'FHD', embed_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ],
    epg: {
      current: {
        title: 'CNN Prime Time',
        description: 'Análise dos fatos mais relevantes do dia com comentaristas de Brasília e SP.',
        formatted_time: 'Hoje, das 20:00 às 22:00'
      },
      next: {
        title: 'CNN Agora',
        description: 'Giro de notícias mundiais e mercado financeiro.',
        formatted_time: 'Hoje, das 22:00 às 23:00'
      }
    }
  }
];

export const REIDOSCANAIS_PRELOADED_SPORTS: ReiDosCanaisSportEvent[] = [
  {
    id: 'flamengo-x-palmeiras-2026',
    title: 'Flamengo x Palmeiras',
    description: 'Grande clássico interestadual válido pelo Campeonato Brasileiro Série A 2026.',
    poster: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
    category: 'Futebol',
    competition: 'Campeonato Brasileiro Série A',
    teams: {
      home: {
        name: 'Flamengo',
        logo: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=100&auto=format&fit=crop&q=80'
      },
      away: {
        name: 'Palmeiras',
        logo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&auto=format&fit=crop&q=80'
      }
    },
    start_time: 'Hoje, 21:00',
    start_timestamp: Math.floor(Date.now() / 1000) - 1800,
    status: 'live',
    popular: true,
    score: {
      home: 2,
      away: 1,
      period: "2º Tempo (68')"
    },
    embeds: [
      { provider: 'Premiere 1 (Ultra)', quality: '1080p 60fps', embed_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
      { provider: 'SporTV 1', quality: 'HD', embed_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ]
  },
  {
    id: 'real-madrid-x-barcelona',
    title: 'Real Madrid x Barcelona (El Clásico)',
    description: 'O maior clássico do planeta ao vivo pelo Campeonato Espanhol La Liga.',
    poster: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop&q=80',
    category: 'Futebol',
    competition: 'La Liga EA Sports',
    teams: {
      home: { name: 'Real Madrid', logo: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=100&auto=format&fit=crop&q=80' },
      away: { name: 'Barcelona', logo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&auto=format&fit=crop&q=80' }
    },
    start_time: 'Hoje, 20:45',
    start_timestamp: Math.floor(Date.now() / 1000) - 3600,
    status: 'live',
    popular: true,
    score: {
      home: 3,
      away: 2,
      period: "2º Tempo (82')"
    },
    embeds: [
      { provider: 'ESPN Brasil Feed 1', quality: '1080p HD', embed_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ]
  },
  {
    id: 'mocambique-x-africa-sul',
    title: 'Moçambique (Mambas) x África do Sul (Bafana Bafana)',
    description: 'Confronto decisivo da COSAFA Cup e Eliminatórias da Copa Africana das Nações (CAN).',
    poster: 'https://images.unsplash.com/photo-1489944445391-11dd35574549?w=800&auto=format&fit=crop&q=80',
    category: 'Futebol',
    competition: 'Copa Africana de Nações (CAF / COSAFA)',
    teams: {
      home: { name: 'Moçambique (Mambas)', logo: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&auto=format&fit=crop&q=80' },
      away: { name: 'África do Sul', logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80' }
    },
    start_time: 'Amanhã, 18:00',
    start_timestamp: Math.floor(Date.now() / 1000) + 72000,
    status: 'upcoming',
    popular: true,
    embeds: [
      { provider: 'TVM Desporto', quality: 'HD', embed_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ]
  },
  {
    id: 'ufc-main-card',
    title: 'UFC Fight Night: Disputa de Cinturão',
    description: 'Card principal com estrelas do MMA mundial e disputa pelo título peso médio.',
    poster: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80',
    category: 'Lutas / MMA',
    competition: 'Ultimate Fighting Championship',
    start_time: 'Hoje, 22:00',
    start_timestamp: Math.floor(Date.now() / 1000) + 3600,
    status: 'live',
    popular: true,
    embeds: [
      { provider: 'UFC Fight Pass Oficial', quality: '1080p', embed_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ]
  },
  {
    id: 'manchester-city-x-arsenal',
    title: 'Manchester City x Arsenal',
    description: 'Duelo direto pela liderança da Premier League inglesa.',
    poster: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&auto=format&fit=crop&q=80',
    category: 'Futebol',
    competition: 'Premier League',
    start_time: 'Sábado, 16:30',
    start_timestamp: Math.floor(Date.now() / 1000) + 120000,
    status: 'upcoming',
    embeds: [
      { provider: 'ESPN 1', quality: '4K', embed_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    ]
  }
];

class ReiDosCanaisService {
  private customChannels: ReiDosCanaisChannel[] = [];
  private customSports: ReiDosCanaisSportEvent[] = [];

  // Obter lista de canais com EPG
  async getChannels(): Promise<ReiDosCanaisChannel[]> {
    try {
      const res = await fetch('/api/reidoscanais-proxy/channels');
      if (res.ok) {
        const json: ReiDosCanaisChannelsResponse = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          return [...json.data, ...this.customChannels];
        }
      }
    } catch {
      // Fallback gracioso para dados locais
    }
    return [...REIDOSCANAIS_PRELOADED_CHANNELS, ...this.customChannels];
  }

  // Obter eventos esportivos ao vivo
  async getLiveSports(status: 'live' | 'upcoming' = 'live'): Promise<ReiDosCanaisSportEvent[]> {
    try {
      const res = await fetch(`/api/reidoscanais-proxy/sports?status=${status}`);
      if (res.ok) {
        const json: ReiDosCanaisSportsResponse = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          return json.data;
        }
      }
    } catch {
      // Fallback
    }
    const all = [...REIDOSCANAIS_PRELOADED_SPORTS, ...this.customSports];
    return status === 'live' ? all.filter(s => s.status === 'live') : all;
  }

  // Busca global
  async search(query: string): Promise<{ channels: ReiDosCanaisChannel[]; events: ReiDosCanaisSportEvent[] }> {
    const q = query.toLowerCase().trim();
    if (!q) {
      return {
        channels: await this.getChannels(),
        events: await this.getLiveSports('live')
      };
    }

    try {
      const res = await fetch(`/api/reidoscanais-proxy/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const json: ReiDosCanaisSearchResponse = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch {
      // Fallback
    }

    // Busca local instantânea
    const allChannels = await this.getChannels();
    const allSports = [...REIDOSCANAIS_PRELOADED_SPORTS, ...this.customSports];

    const filteredChannels = allChannels.filter(
      c => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );

    const filteredEvents = allSports.filter(
      e => e.title.toLowerCase().includes(q) || e.competition.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)
    );

    return {
      channels: filteredChannels,
      events: filteredEvents
    };
  }

  // Converte um canal Rei dos Canais para o formato nativo Channel do UBlue
  tuneToUBlueChannel(rc: ReiDosCanaisChannel, embedIndex = 0): Channel {
    const stream = rc.embeds && rc.embeds[embedIndex]
      ? rc.embeds[embedIndex].embed_url
      : 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

    const currentProg = rc.epg?.current?.title || `${rc.name} - Ao Vivo`;
    const nextProg = rc.epg?.next?.title || 'Programação ao vivo contínua 24h';

    return {
      id: `rc-${rc.id}`,
      number: 70 + Math.abs(rc.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 25,
      name: rc.name,
      tagline: `${rc.category} · Rei dos Canais API (${rc.embeds[embedIndex]?.quality || 'HD'})`,
      logo: rc.logo_url,
      coverImage: rc.epg?.current?.image || rc.logo_url || 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1200&auto=format&fit=crop&q=80',
      category: rc.category === 'Esportes' ? 'sports' : rc.category === 'Filmes & Séries' ? 'movies' : 'live',
      requiredTier: 'free',
      currentProgram: currentProg,
      nextProgram: nextProg,
      viewers: 32000 + Math.floor(Math.random() * 15000),
      source: 'iptv-org',
      provider: `Rei dos Canais (${rc.embeds[embedIndex]?.provider || 'Stream Direto'})`,
      streamUrl: stream,
      videoType: 'hls',
      badge: '👑 REI DOS CANAIS'
    };
  }

  // Converte um evento esportivo para um canal reproduzível no UBlue Player
  tuneSportEventToUBlueChannel(event: ReiDosCanaisSportEvent, embedIndex = 0): Channel {
    const stream = event.embeds && event.embeds[embedIndex]
      ? event.embeds[embedIndex].embed_url
      : 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

    const scoreText = event.score ? `[${event.score.home} x ${event.score.away} ${event.score.period || ''}] ` : '';

    return {
      id: `rc-sport-${event.id}`,
      number: 10,
      name: `⚽ ${event.title}`,
      tagline: `${scoreText}${event.competition} · Transmissão Ao Vivo (${event.embeds[embedIndex]?.provider || 'Premiere'})`,
      logo: event.poster,
      coverImage: event.poster,
      category: 'sports',
      requiredTier: 'free',
      currentProgram: `${event.title} - ${event.competition}`,
      nextProgram: 'Pós-jogo e melhores momentos',
      viewers: 64200,
      source: 'iptv-org',
      provider: `Rei dos Canais Sports (${event.embeds[embedIndex]?.provider || 'HD Ao Vivo'})`,
      streamUrl: stream,
      videoType: 'hls',
      badge: '🏆 AO VIVO'
    };
  }
}

export const reiDosCanaisService = new ReiDosCanaisService();
