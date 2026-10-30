import {
  PlayoutScheduleItem,
  LiveRadioStation,
  TalentContestant,
  AcademyCourse,
  StreamHealthMetric,
  AdInsertionSlot,
} from '../types/live-network';

export const MOCK_PLAYOUT_SCHEDULE: PlayoutScheduleItem[] = [
  {
    id: 'play-1',
    timeSlot: '06:00',
    durationMinutes: 90,
    title: 'Bom Dia Moçambique & Notícias Matinais',
    category: 'Notícias',
    streamSource: 'live-studio',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    thumbnail: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&auto=format&fit=crop&q=80',
    hasAdBreak: true,
    status: 'concluido'
  },
  {
    id: 'play-2',
    timeSlot: '07:30',
    durationMinutes: 60,
    title: 'UBlue Academy TV: Edição e Produção Móvel',
    category: 'Academy',
    streamSource: 'hls-vod',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
    hasAdBreak: false,
    status: 'concluido'
  },
  {
    id: 'play-3',
    timeSlot: '08:30',
    durationMinutes: 120,
    title: 'Top Ritmos do Índico & Marrabenta Live',
    category: 'Música',
    streamSource: 'partner-feed',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    hasAdBreak: true,
    status: 'concluido'
  },
  {
    id: 'play-4',
    timeSlot: '10:30',
    durationMinutes: 90,
    title: 'Estúdio Virtual UBlue: Debate Económico & M-Pesa',
    category: 'Notícias',
    streamSource: 'live-studio',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    hasAdBreak: true,
    status: 'concluido'
  },
  {
    id: 'play-5',
    timeSlot: '12:00',
    durationMinutes: 60,
    title: 'Jornal do Meio-Dia Universo Blue',
    category: 'Notícias',
    streamSource: 'live-studio',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    thumbnail: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80',
    hasAdBreak: true,
    status: 'concluido'
  },
  {
    id: 'play-6',
    timeSlot: '13:00',
    durationMinutes: 120,
    title: 'Noites de Maputo: Especial Bastidores (Série Original)',
    category: 'UBlue Originals',
    streamSource: 'hls-vod',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
    hasAdBreak: true,
    status: 'concluido'
  },
  {
    id: 'play-7',
    timeSlot: '15:00',
    durationMinutes: 90,
    title: 'Show da Tarde UBlue: Transmissão em Direto 24/7',
    category: 'Música',
    streamSource: 'live-studio',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    hasAdBreak: true,
    status: 'no-ar'
  },
  {
    id: 'play-8',
    timeSlot: '16:30',
    durationMinutes: 90,
    title: 'Giro Desportivo: Análise Moçambola 2026',
    category: 'Desporto',
    streamSource: 'partner-feed',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
    hasAdBreak: true,
    status: 'a-seguir'
  },
  {
    id: 'play-9',
    timeSlot: '18:00',
    durationMinutes: 120,
    title: 'Be Universe Talent Show: Gala ao Vivo das Províncias',
    category: 'Be Universe Show',
    streamSource: 'live-studio',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
    hasAdBreak: true,
    status: 'a-seguir'
  },
  {
    id: 'play-10',
    timeSlot: '20:00',
    durationMinutes: 60,
    title: 'Jornal da Noite UBlue & Notícias Internacionais',
    category: 'Notícias',
    streamSource: 'live-studio',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    thumbnail: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&auto=format&fit=crop&q=80',
    hasAdBreak: true,
    status: 'a-seguir'
  }
];

export const MOCK_RADIO_STATIONS: LiveRadioStation[] = [
  {
    id: 'rad-rm-antena',
    name: 'Rádio Moçambique (Antena Nacional)',
    frequency: '90.3 FM',
    city: 'Maputo',
    format: 'Icecast',
    bitrateKbps: 64,
    streamUrl: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    logo: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=160&auto=format&fit=crop&q=80',
    currentTrack: 'Jornal da Tarde — Emissora Oficial',
    currentHost: 'Locução Central RM',
    listenersCount: 18450,
    isLive: true
  },
  {
    id: 'rad-cidade-fm',
    name: 'Rádio Cidade Maputo',
    frequency: '97.9 FM',
    city: 'Maputo / Matola',
    format: 'Shoutcast',
    bitrateKbps: 96,
    streamUrl: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=160&auto=format&fit=crop&q=80',
    currentTrack: 'Pandza Mix & Sucessos Urbanos',
    currentHost: 'DJ Zico & Apresentadores Convidados',
    listenersCount: 14220,
    isLive: true
  },
  {
    id: 'rad-beira-indico',
    name: 'Rádio Beira do Índico',
    frequency: '101.4 FM',
    city: 'Beira, Sofala',
    format: 'Icecast',
    bitrateKbps: 64,
    streamUrl: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    logo: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=160&auto=format&fit=crop&q=80',
    currentTrack: 'Vozes do Centro: Debates Comunitários',
    currentHost: 'Alberto Machava',
    listenersCount: 8900,
    isLive: true
  },
  {
    id: 'rad-ublue-afrobeat',
    name: 'UBlue Afrobeat & Kizomba 24/7',
    frequency: 'Web Exclusivo',
    city: 'Maputo & Global',
    format: 'HLS Audio',
    bitrateKbps: 128,
    streamUrl: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    logo: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=160&auto=format&fit=crop&q=80',
    currentTrack: 'Non-Stop African Grooves Master HD',
    currentHost: 'Auto-DJ Universo Blue',
    listenersCount: 22100,
    isLive: true
  }
];

export const MOCK_TALENT_CONTESTANTS: TalentContestant[] = [
  {
    id: 'tal-1',
    name: 'Amina Selemane',
    artisticName: 'Amina Soul',
    province: 'Maputo Cidade',
    specialty: 'Canto & Marrabenta',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    votesCount: 48920,
    juryScore: 9.6,
    status: 'salvo',
    songOrAct: 'Interpretação de "Elisa Gomara Saia" em versão Acústica'
  },
  {
    id: 'tal-2',
    name: 'Eusébio Nhantumbo',
    artisticName: 'MC Nhantumbo',
    province: 'Gaza (Xai-Xai)',
    specialty: 'Produção Musical',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    votesCount: 37400,
    juryScore: 9.2,
    status: 'salvo',
    songOrAct: 'Fusão de Timbila Tradicional com Beats Urbanos'
  },
  {
    id: 'tal-3',
    name: 'Fátima Munguambe',
    artisticName: 'Fá Munguambe',
    province: 'Sofala (Beira)',
    specialty: 'Apresentação TV',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    votesCount: 32180,
    juryScore: 8.9,
    status: 'salvo',
    songOrAct: 'Apresentação de Talk-Show ao Vivo com improviso'
  },
  {
    id: 'tal-4',
    name: 'Júlio Cossa',
    artisticName: 'Julinho Riso',
    province: 'Inhambane',
    specialty: 'Humor & Standup',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    votesCount: 26400,
    juryScore: 8.4,
    status: 'zona-de-risco',
    songOrAct: 'Monólogo: "As Aventuras de Pegar Chapa na Cidade"'
  },
  {
    id: 'tal-5',
    name: 'Neusa Tivane',
    artisticName: 'Neusa AfroDance',
    province: 'Nampula',
    specialty: 'Dança Urbana',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    votesCount: 28950,
    juryScore: 8.7,
    status: 'salvo',
    songOrAct: 'Coreografia: "Ritmos do Norte & Dança Tufo Contemporânea"'
  }
];

export const MOCK_ACADEMY_COURSES: AcademyCourse[] = [
  {
    id: 'acad-1',
    title: 'Produção Audiovisual com Telemóvel em Moçambique',
    instructor: 'Inácio Chissano',
    role: 'Diretor de Fotografia UBlue Studios',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
    duration: '6 Horas · 12 Módulos',
    modulesCount: 12,
    level: 'Iniciante',
    studentsEnrolled: 1840,
    certificateProvided: true,
    description: 'Aprenda a filmar reportagens, entrevistas e videoclipes em 4K usando apenas seu smartphone e iluminação de baixo custo.'
  },
  {
    id: 'acad-2',
    title: 'Locução, Apresentação de TV e Postura de Palco',
    instructor: 'Margarida Tembe',
    role: 'Apresentadora Líder Be Universe Agency',
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    duration: '4 Horas · 8 Módulos',
    modulesCount: 8,
    level: 'Intermediário',
    studentsEnrolled: 2410,
    certificateProvided: true,
    description: 'Técnicas de dicção, leitura de teleprompter, modulação de voz para rádio e desenvoltura em frente às câmeras de transmissão ao vivo.'
  },
  {
    id: 'acad-3',
    title: 'Monetização de Streaming e Gestão de Direitos Digitais',
    instructor: 'Equipe Jurídica e Comercial UBlue TV',
    role: 'Especialistas em OTT & M-Pesa',
    thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
    duration: '3.5 Horas · 6 Módulos',
    modulesCount: 6,
    level: 'Avançado',
    studentsEnrolled: 980,
    certificateProvided: true,
    description: 'Como registrar suas obras, receber royalties, integrar carteira M-Pesa e vender publicidade no UBlue Business Center.'
  }
];

export const MOCK_STREAM_HEALTH: StreamHealthMetric[] = [
  {
    channelId: 'ublue-247-live',
    channelName: 'UBlue TV Canal 24/7 (Sinal Mestre)',
    ingestFormat: 'HLS (.m3u8)',
    resolution: '1080p60 (Full HD)',
    fps: 60,
    bitrateMbps: 4.8,
    latencyMs: 145,
    cdnCacheHitRatio: 98.4,
    drmStatus: 'Protegido (AES-128)',
    healthStatus: 'excelente',
    activeViewers: 32450
  },
  {
    channelId: 'ublue-news-desk',
    channelName: 'UBlue Newsroom & Ticker Feed',
    ingestFormat: 'RTMP',
    resolution: '720p30 (Otimizado)',
    fps: 30,
    bitrateMbps: 2.4,
    latencyMs: 110,
    cdnCacheHitRatio: 99.1,
    drmStatus: 'ClearKey',
    healthStatus: 'excelente',
    activeViewers: 14890
  },
  {
    channelId: 'partner-tvm-feed',
    channelName: 'Relay TV Parceira Nacional (M3U Ingest)',
    ingestFormat: 'HLS (.m3u8)',
    resolution: '720p25',
    fps: 25,
    bitrateMbps: 2.1,
    latencyMs: 320,
    cdnCacheHitRatio: 94.2,
    drmStatus: 'Aberto Legal',
    healthStatus: 'estavel',
    activeViewers: 18900
  },
  {
    channelId: 'radio-icecast-hub',
    channelName: 'Icecast/Shoutcast Audio Gateway',
    ingestFormat: 'HLS (.m3u8)',
    resolution: 'Audio Stereo',
    fps: 0,
    bitrateMbps: 0.128,
    latencyMs: 65,
    cdnCacheHitRatio: 99.8,
    drmStatus: 'Aberto Legal',
    healthStatus: 'excelente',
    activeViewers: 42100
  }
];

export const MOCK_BREAKING_NEWS_TICKER = [
  '🔴 UBlue TV LIVE NETWORK: Transmissão ininterrupta 24 horas por dia no ar em todo Moçambique',
  '⚽ MOÇAMBOLA 2026: Dérbi de Maputo tem transmissão confirmada em 1080p na UBlue TV',
  '⭐ BE UNIVERSE TALENT SHOW: Votações abertas para a Grande Gala de Eliminação via M-Pesa e Web',
  '💰 ECONOMIA: Cotação do Metical mantém estabilidade em Maputo nas transações comerciais',
  '🎓 UBLUE ACADEMY: Abertas 500 bolsas gratuitas para curso de Produção Audiovisual Digital'
];
