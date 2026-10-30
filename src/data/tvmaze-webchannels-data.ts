import { TvmazeWebChannel, TvmazeEpisode } from '../types/tvmaze';

export const TVMAZE_WEBCHANNELS_URL = 'https://www.tvmaze.com/webchannels';
export const TVMAZE_API_BASE = 'https://api.tvmaze.com';

export const TVMAZE_CURATED_WEBCHANNELS: TvmazeWebChannel[] = [
  {
    id: 1,
    name: 'Netflix',
    slug: 'netflix',
    category: 'giant',
    country: null,
    officialSite: 'https://www.netflix.com/',
    logoBadge: '🔴 N',
    badgeColor: 'from-red-600 to-rose-950 text-white',
    description: 'A maior plataforma de streaming por subscrição do mundo, pioneira em lançamentos de temporadas completas e produções originais globais.',
    subscriberEstimate: '277M+ subscritores',
    flagshipShows: ['Stranger Things', 'Wednesday', 'Squid Game', 'Black Mirror', 'The Crown', 'Bridgerton'],
    features: ['4K Dolby Vision', 'Áudio Espacial', 'Catálogo em 190+ países', 'Download Offline'],
    isGlobal: true
  },
  {
    id: 3,
    name: 'Prime Video',
    slug: 'prime-video',
    category: 'giant',
    country: null,
    officialSite: 'https://www.primevideo.com/',
    logoBadge: '🔷 Prime',
    badgeColor: 'from-sky-600 to-blue-950 text-white',
    description: 'Serviço de streaming da Amazon com superproduções épicas, canais integrados (Prime Channels) e transmissões desportivas ao vivo.',
    subscriberEstimate: '200M+ membros',
    flagshipShows: ['The Boys', 'Fallout', 'The Lord of the Rings: The Rings of Power', 'Reacher', 'Invincible'],
    features: ['X-Ray com dados IMDb', 'Canais Adicionais', 'HDR10+', 'Transmissões Desportivas'],
    isGlobal: true
  },
  {
    id: 310,
    name: 'Apple TV+',
    slug: 'apple-tv',
    category: 'giant',
    country: null,
    officialSite: 'https://tv.apple.com/',
    logoBadge: '🍏 tv+',
    badgeColor: 'from-slate-700 to-black text-white',
    description: 'Streaming focado exclusivamente em produções originais de altíssimo orçamento cinematográfico, vencedoras de prémios Emmy e Óscares.',
    subscriberEstimate: '50M+ assinantes',
    flagshipShows: ['Ted Lasso', 'Severance', 'For All Mankind', 'The Morning Show', 'Slow Horses', 'Foundation'],
    features: ['Bitrate mais elevado da indústria', 'Dolby Atmos nativo', 'Qualidade de Cinema 4K'],
    isGlobal: true
  },
  {
    id: 287,
    name: 'Disney+',
    slug: 'disney',
    category: 'giant',
    country: null,
    officialSite: 'https://www.disneyplus.com/',
    logoBadge: '✨ Disney+',
    badgeColor: 'from-blue-600 to-indigo-950 text-white',
    description: 'Casa das maiores franquias da história: Disney, Pixar, Marvel Studios, Star Wars, National Geographic e conteúdo adulto Star.',
    subscriberEstimate: '150M+ assinantes',
    flagshipShows: ['The Mandalorian', 'Loki', 'Andor', 'WandaVision', 'Percy Jackson', 'Ahsoka'],
    features: ['IMAX Enhanced', 'Som DTS:X', 'Hubs de Franquias', 'Controlo Parental Robusto'],
    isGlobal: true
  },
  {
    id: 329,
    name: 'HBO Max (Max)',
    slug: 'hbo-max',
    category: 'giant',
    country: { name: 'United States', code: 'US', timezone: 'America/New_York' },
    officialSite: 'https://www.max.com/',
    logoBadge: '🟣 Max',
    badgeColor: 'from-purple-600 to-indigo-950 text-white',
    description: 'Lendárias produções HBO Prestige, universo DC Comics, Discovery, Warner Bros. Pictures e conteúdos CNN Originals.',
    subscriberEstimate: '100M+ assinantes',
    flagshipShows: ['The Last of Us', 'House of the Dragon', 'Succession', 'Euphoria', 'The White Lotus', 'The Penguin'],
    features: ['HBO Classics Remasterizados', 'Filmes Warner 4K', 'Desporto Eurosport/TNT'],
    isGlobal: false
  },
  {
    id: 107,
    name: 'Paramount+',
    slug: 'paramount',
    category: 'giant',
    country: { name: 'United States', code: 'US', timezone: 'America/New_York' },
    officialSite: 'https://www.paramountplus.com/',
    logoBadge: '🏔️ Paramount+',
    badgeColor: 'from-blue-500 to-sky-950 text-white',
    description: 'O universo Taylor Sheridan (Yellowstone), a franquia galáctica Star Trek, filmes Paramount Pictures e notícias CBS News.',
    subscriberEstimate: '71M+ subscritores',
    flagshipShows: ['Yellowstone (1883 / 1923)', 'Star Trek: Strange New Worlds', 'Mayor of Kingstown', 'Tulsa King', 'Halo'],
    features: ['UEFA Champions League (US)', 'Catálogo CBS All Access', 'Canais ao Vivo 24/7'],
    isGlobal: false
  },
  {
    id: 2,
    name: 'Hulu',
    slug: 'hulu',
    category: 'giant',
    country: { name: 'United States', code: 'US', timezone: 'America/New_York' },
    officialSite: 'https://www.hulu.com/',
    logoBadge: '🟢 Hulu',
    badgeColor: 'from-emerald-500 to-green-950 text-white',
    description: 'Dramas aclamados pelo FX, comédias modernas, produções originais Hulu Originals e programas de TV aberta americana no dia seguinte.',
    subscriberEstimate: '50M+ utilizadores',
    flagshipShows: ['The Bear', 'The Handmaid\'s Tale', 'Only Murders in the Building', 'Shōgun', 'Fargo'],
    features: ['Próximo dia na TV (Next-day TV)', 'FX on Hulu Hub', 'Hulu + Live TV Add-on'],
    isGlobal: false
  },
  {
    id: 21,
    name: 'YouTube Originals',
    slug: 'youtube',
    category: 'specialty',
    country: null,
    officialSite: 'https://www.youtube.com/',
    logoBadge: '▶️ YouTube',
    badgeColor: 'from-red-600 to-zinc-950 text-white',
    description: 'Conteúdo digital premium com os maiores criadores de conteúdo do planeta, séries documentais e shows originais.',
    subscriberEstimate: '100M+ YouTube Premium',
    flagshipShows: ['Cobra Kai (S1-S2)', 'Mind Field', 'Impulse', 'Wayne', 'Origin'],
    features: ['Integração com YouTube Music', 'Sem Anúncios', 'Reprodução em Segundo Plano'],
    isGlobal: true
  },
  {
    id: 388,
    name: 'Pluto TV',
    slug: 'pluto-tv',
    category: 'fast',
    country: null,
    officialSite: 'https://pluto.tv/',
    logoBadge: '🚀 Pluto TV',
    badgeColor: 'from-yellow-400 to-black text-black',
    description: 'Líder mundial em FAST (Free Ad-Supported Television). Mais de 250 canais temáticos lineares gratuitos com filmes e séries sob demanda.',
    subscriberEstimate: '80M+ MAUs gratuitos',
    flagshipShows: ['CSI: Crime Scene Investigation', 'Star Trek FAST', 'Doctor Who Classic', 'Baywatch 24/7'],
    features: ['100% Gratuito sem Registo', 'Guia EPG Linear 24/7', 'Canais de Maratona Única'],
    isGlobal: true
  },
  {
    id: 350,
    name: 'Tubi',
    slug: 'tubi',
    category: 'fast',
    country: { name: 'United States', code: 'US', timezone: 'America/New_York' },
    officialSite: 'https://tubitv.com/',
    logoBadge: '🟡 Tubi',
    badgeColor: 'from-amber-500 to-orange-950 text-white',
    description: 'O maior serviço gratuito de streaming de vídeos da FOX com mais de 50.000 títulos e centenas de canais ao vivo de notícias e entretenimento.',
    subscriberEstimate: '78M+ utilizadores ativos',
    flagshipShows: ['Tubi Originals Movies', 'Gordon Ramsay\'s Hell\'s Kitchen', 'The Masked Singer', 'Conan O\'Brien FAST'],
    features: ['Biblioteca gigantesca', 'Sem necessidade de subscrição', 'Suporte multiplataforma'],
    isGlobal: false
  },
  {
    id: 366,
    name: 'Crunchyroll',
    slug: 'crunchyroll',
    category: 'anime',
    country: null,
    officialSite: 'https://www.crunchyroll.com/',
    logoBadge: '🍥 Crunchyroll',
    badgeColor: 'from-orange-500 to-amber-950 text-white',
    description: 'O destino definitivo de animes no mundo, transmitindo simulcasts do Japão minutos após a exibição original com dobragens em várias línguas.',
    subscriberEstimate: '15M+ subscritores',
    flagshipShows: ['Demon Slayer', 'Attack on Titan', 'Jujutsu Kaisen', 'Solo Leveling', 'One Piece', 'Chainsaw Man'],
    features: ['Simulcast 1h após o Japão', 'Dobragens em Português', 'Catálogo de Mangás'],
    isGlobal: true
  },
  {
    id: 26,
    name: 'BBC iPlayer',
    slug: 'bbc-iplayer',
    category: 'regional',
    country: { name: 'United Kingdom', code: 'GB', timezone: 'Europe/London' },
    officialSite: 'https://www.bbc.co.uk/iplayer',
    logoBadge: '🇬🇧 iPlayer',
    badgeColor: 'from-pink-600 to-zinc-950 text-white',
    description: 'A joia da televisão pública britânica, com acesso a todos os canais da BBC ao vivo e um repositório riquíssimo de séries de época e documentários.',
    subscriberEstimate: 'Universal no Reino Unido',
    flagshipShows: ['Doctor Who', 'Peaky Blinders', 'Killing Eve', 'Sherlock', 'Planet Earth III', 'Happy Valley'],
    features: ['Transmissão em 4K HLG HDR', 'Arquivo de Rádio & Podcasts', 'Livre de anúncios comerciais'],
    isGlobal: false
  },
  {
    id: 347,
    name: 'Peacock',
    slug: 'peacock',
    category: 'giant',
    country: { name: 'United States', code: 'US', timezone: 'America/New_York' },
    officialSite: 'https://www.peacocktv.com/',
    logoBadge: '🦚 Peacock',
    badgeColor: 'from-teal-500 to-cyan-950 text-white',
    description: 'Plataforma de streaming da NBCUniversal com filmes Universal Pictures, Premier League, Jogos Olímpicos e séries originais da NBC.',
    subscriberEstimate: '34M+ subscritores',
    flagshipShows: ['Poker Face', 'Bel-Air', 'Twisted Metal', 'The Office (Superfan)', 'Ted: The Series'],
    features: ['Premier League ao vivo', 'WWE Network Hub', 'Episódios Superfan estendidos'],
    isGlobal: false
  },
  {
    id: 453,
    name: 'AMC+',
    slug: 'amc',
    category: 'specialty',
    country: { name: 'United States', code: 'US', timezone: 'America/New_York' },
    officialSite: 'https://www.amcplus.com/',
    logoBadge: '🎬 AMC+',
    badgeColor: 'from-red-700 to-stone-900 text-white',
    description: 'Destino de dramas de prestígio que moldaram a era de ouro da TV (Mad Men, Breaking Bad, The Walking Dead Universe e Anne Rice).',
    subscriberEstimate: '11M+ subscritores',
    flagshipShows: ['Interview with the Vampire', 'Dark Winds', 'The Walking Dead: Daryl Dixon', 'The Ones Who Live'],
    features: ['Inclui Shudder e Sundance Now', 'Estreias antecipadas em 7 dias'],
    isGlobal: false
  },
  {
    id: 503,
    name: 'MGM+',
    slug: 'mgm',
    category: 'specialty',
    country: { name: 'United States', code: 'US', timezone: 'America/New_York' },
    officialSite: 'https://www.mgmplus.com/',
    logoBadge: '🦁 MGM+',
    badgeColor: 'from-amber-600 to-yellow-950 text-white',
    description: 'Canal de entretenimento com séries originais aclamadas de mistério e ficção científica, além do catálogo histórico da Metro-Goldwyn-Mayer.',
    subscriberEstimate: '6M+ subscritores',
    flagshipShows: ['FROM', 'Godfather of Harlem', 'Billy the Kid', 'Beacon 23', 'Hotel Cocaine'],
    features: ['Biblioteca clássica MGM', 'Sem intervalos comerciais'],
    isGlobal: false
  },
  {
    id: 251,
    name: 'Globoplay',
    slug: 'globoplay',
    category: 'regional',
    country: { name: 'Brazil', code: 'BR', timezone: 'America/Sao_Paulo' },
    officialSite: 'https://globoplay.globo.com/',
    logoBadge: '🇧🇷 Globoplay',
    badgeColor: 'from-orange-600 to-rose-950 text-white',
    description: 'O maior serviço de streaming brasileiro, com novelas históricas, séries exclusivas de ficção, jornalismo e Big Brother Brasil ao vivo.',
    subscriberEstimate: '30M+ utilizadores',
    flagshipShows: ['Sob Pressão', 'Arcanjo Renegado', 'As Five', 'Os Outros', 'Renascer', 'Verdades Secretas'],
    features: ['Canais Globosat ao Vivo (SporTV, Multishow, GloboNews)', 'Áudio original em Português'],
    isGlobal: false
  },
  {
    id: 54,
    name: 'ITVX',
    slug: 'itvx',
    category: 'regional',
    country: { name: 'United Kingdom', code: 'GB', timezone: 'Europe/London' },
    officialSite: 'https://www.itvx.com/',
    logoBadge: '🇬🇧 ITVX',
    badgeColor: 'from-yellow-500 to-slate-900 text-white',
    description: 'Plataforma líder do canal comercial britânico ITV com milhares de horas de dramas criminais ingleses, realities e transmissões ao vivo.',
    subscriberEstimate: '40M+ utilizadores registados',
    flagshipShows: ['Broadchurch', 'Mr Bates vs The Post Office', 'Vera', 'The Long Shadow', 'Love Island'],
    features: ['Modelos Grátis e Premium', 'Lançamento antecipado de séries completas'],
    isGlobal: false
  },
  {
    id: 153,
    name: 'Rakuten Viki',
    slug: 'viki',
    category: 'specialty',
    country: null,
    officialSite: 'https://www.viki.com/',
    logoBadge: '🌸 Viki',
    badgeColor: 'from-cyan-600 to-blue-950 text-white',
    description: 'Comunidade global pioneira para amantes de K-Dramas, dramas chineses, taiwaneses e japoneses legendados por fãs em mais de 200 idiomas.',
    subscriberEstimate: '15M+ utilizadores mensais',
    flagshipShows: ['Descendants of the Sun', 'True Beauty', 'Goblin', 'What\'s Wrong with Secretary Kim'],
    features: ['Legendas Comunitárias Multilíngues', 'Learn Mode para aprender idiomas'],
    isGlobal: true
  },
  {
    id: 247,
    name: 'Shudder',
    slug: 'shudder',
    category: 'specialty',
    country: { name: 'United States', code: 'US', timezone: 'America/New_York' },
    officialSite: 'https://www.shudder.com/',
    logoBadge: '💀 Shudder',
    badgeColor: 'from-red-900 to-black text-white',
    description: 'Serviço de nicho estritamente dedicado ao terror, suspense sobrenatural e ficção sombria, curado por especialistas do género.',
    subscriberEstimate: '2M+ fãs de terror',
    flagshipShows: ['Creepshow', 'Slasher', 'The Boulet Brothers\' Dragula', 'Channel Zero'],
    features: ['Curadoria para fãs de terror', 'Exibições ao vivo Shudder TV'],
    isGlobal: false
  },
  {
    id: 202,
    name: 'Rakuten TV',
    slug: 'rakuten-tv',
    category: 'fast',
    country: null,
    officialSite: 'https://rakuten.tv/',
    logoBadge: '🇪🇺 Rakuten TV',
    badgeColor: 'from-red-600 to-zinc-950 text-white',
    description: 'Plataforma europeia que combina aluguer de lançamentos de cinema com mais de 100 canais FAST lineares gratuitos em toda a Europa.',
    subscriberEstimate: 'Presente em 42 países europeus',
    flagshipShows: ['Rakuten Stories Documentaries', 'Euronews FAST', 'Filmes Independentes Europeus'],
    features: ['FAST Channels gratuitos', 'Loja transacional 4K HDR'],
    isGlobal: true
  }
];

export const INITIAL_FALLBACK_EPISODES: TvmazeEpisode[] = [
  {
    id: 3787314,
    url: 'https://www.tvmaze.com/episodes/3787314',
    name: 'O Despertar da Fronteira',
    season: 2,
    number: 4,
    type: 'regular',
    airdate: '2026-10-11',
    airtime: '20:00',
    airstamp: '2026-10-11T20:00:00+00:00',
    runtime: 52,
    rating: { average: 8.7 },
    image: {
      medium: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=600&q=80',
      original: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=1280&q=80'
    },
    summary: '<p>Uma nova aliança é testada nas terras altas enquanto os segredos guardados pela corporação começam a emergir.</p>',
    _embedded: {
      show: {
        id: 42109,
        url: 'https://www.tvmaze.com/shows/42109',
        name: 'The Diplomat',
        type: 'Scripted',
        language: 'English',
        genres: ['Drama', 'Thriller'],
        status: 'Running',
        runtime: 55,
        premiered: '2023-04-20',
        officialSite: 'https://www.netflix.com/title/81288983',
        schedule: { time: '', days: ['Sunday'] },
        rating: { average: 8.3 },
        weight: 98,
        network: null,
        webChannel: TVMAZE_CURATED_WEBCHANNELS[0], // Netflix
        image: {
          medium: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80',
          original: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1280&q=80'
        },
        summary: '<p>Em meio a uma crise internacional perigosa, uma diplomata de carreira precisa equilibrar seu trabalho de alto risco com seu casamento turbulento.</p>'
      }
    }
  },
  {
    id: 3787315,
    url: 'https://www.tvmaze.com/episodes/3787315',
    name: 'Protocolo de Emergência',
    season: 1,
    number: 8,
    type: 'regular',
    airdate: '2026-10-11',
    airtime: '21:00',
    airstamp: '2026-10-11T21:00:00+00:00',
    runtime: 60,
    rating: { average: 9.1 },
    image: {
      medium: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
      original: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1280&q=80'
    },
    summary: '<p>O clímax da temporada leva a equipe aos limites de suas decisões éticas durante a operação em alto mar.</p>',
    _embedded: {
      show: {
        id: 54101,
        url: 'https://www.tvmaze.com/shows/54101',
        name: 'Slow Horses',
        type: 'Scripted',
        language: 'English',
        genres: ['Drama', 'Espionage', 'Thriller'],
        status: 'Running',
        runtime: 45,
        premiered: '2022-04-01',
        officialSite: 'https://tv.apple.com/show/slow-horses',
        schedule: { time: '', days: ['Friday'] },
        rating: { average: 8.9 },
        weight: 96,
        network: null,
        webChannel: TVMAZE_CURATED_WEBCHANNELS[2], // Apple TV+
        image: {
          medium: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
          original: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1280&q=80'
        },
        summary: '<p>Uma equipe disfuncional de agentes do MI5 relegados à Slough House tenta desvendar conspirações que ameaçam a segurança britânica.</p>'
      }
    }
  },
  {
    id: 3787316,
    url: 'https://www.tvmaze.com/episodes/3787316',
    name: 'Sombras no Deserto',
    season: 2,
    number: 3,
    type: 'regular',
    airdate: '2026-10-11',
    airtime: '19:30',
    airstamp: '2026-10-11T19:30:00+00:00',
    runtime: 58,
    rating: { average: 8.8 },
    image: {
      medium: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      original: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1280&q=80'
    },
    summary: '<p>A busca por recursos preciosos revela uma facção oculta na Wasteland que ameaça o equilíbrio frágil das colónias.</p>',
    _embedded: {
      show: {
        id: 48512,
        url: 'https://www.tvmaze.com/shows/48512',
        name: 'Fallout',
        type: 'Scripted',
        language: 'English',
        genres: ['Action', 'Adventure', 'Sci-Fi'],
        status: 'Running',
        runtime: 60,
        premiered: '2024-04-10',
        officialSite: 'https://www.amazon.com/dp/B0CN4HV16N',
        schedule: { time: '', days: ['Thursday'] },
        rating: { average: 8.6 },
        weight: 99,
        network: null,
        webChannel: TVMAZE_CURATED_WEBCHANNELS[1], // Prime Video
        image: {
          medium: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
          original: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1280&q=80'
        },
        summary: '<p>Em um futuro pós-apocalíptico retrofuturista, cidadãos de refúgios subterrâneos são forçados a retornar à superfície devastada.</p>'
      }
    }
  },
  {
    id: 3787317,
    url: 'https://www.tvmaze.com/episodes/3787317',
    name: 'Espada de Vento e Fogo',
    season: 4,
    number: 7,
    type: 'regular',
    airdate: '2026-10-11',
    airtime: '18:00',
    airstamp: '2026-10-11T18:00:00+00:00',
    runtime: 24,
    rating: { average: 9.4 },
    image: {
      medium: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
      original: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1280&q=80'
    },
    summary: '<p>O treino intensivo com os Hashira chega à sua fase final com um confronto lendário.</p>',
    _embedded: {
      show: {
        id: 41258,
        url: 'https://www.tvmaze.com/shows/41258',
        name: 'Demon Slayer: Kimetsu no Yaiba',
        type: 'Animation',
        language: 'Japanese',
        genres: ['Action', 'Anime', 'Fantasy'],
        status: 'Running',
        runtime: 24,
        premiered: '2019-04-06',
        officialSite: 'https://kimetsu.com/anime/',
        schedule: { time: '23:15', days: ['Sunday'] },
        rating: { average: 9.0 },
        weight: 97,
        network: null,
        webChannel: TVMAZE_CURATED_WEBCHANNELS[10], // Crunchyroll
        image: {
          medium: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
          original: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1280&q=80'
        },
        summary: '<p>Tanjiro Kamado junta-se ao Esquadrão de Caçadores de Demónios para curar a sua irmã Nezuko e vingar a sua família.</p>'
      }
    }
  }
];
