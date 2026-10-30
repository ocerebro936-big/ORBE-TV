/**
 * Especificações de Dados para:
 * 1. UBlue Media Enhancement Engine (Vision AI, 10 LUTs, Audio Engine)
 * 2. UBlue Open Broadcast Network (Perfis de criadores e Tipos de conteúdo)
 * 3. UBlue Scheduler (Grade de Programação 24/7)
 * 4. Sistema Inteligente de Avisos (Canais de notificação)
 */

export interface UBlueLUT {
  id: string;
  name: string;
  genre: string;
  description: string;
  filterCss: string;
  badgeColor: string;
  idealFor: string[];
  contrast: number; // percentage
  saturation: number;
  temperature: number; // kelvin shift
  recommendedGains: string;
}

export const UBLUE_LUTS: UBlueLUT[] = [
  {
    id: 'ublue-cinema',
    name: 'UBlue Cinema',
    genre: 'Cinema',
    description: 'Estética clássica de longa-metragem. Teal nas sombras, tons dourados nas peles e contraste rico.',
    filterCss: 'contrast(125%) saturate(115%) sepia(10%) hue-rotate(-5deg)',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    idealFor: ['Filmes', 'Curtas', 'Séries Dramáticas'],
    contrast: 125,
    saturation: 115,
    temperature: 5800,
    recommendedGains: '+1.5dB nos médios, curva em S nas altas luzes'
  },
  {
    id: 'ublue-premium',
    name: 'UBlue Premium',
    genre: 'Premium',
    description: 'Acabamento acetinado corporativo e televisivo de alto padrão. Destaque para tecidos, peles e iluminação controlada.',
    filterCss: 'contrast(115%) saturate(110%) brightness(103%)',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    idealFor: ['UBlue Originals', 'Grandes Entrevistas', 'Galas'],
    contrast: 115,
    saturation: 110,
    temperature: 5600,
    recommendedGains: 'Linearidade perfeita, pretos em 0 IRE'
  },
  {
    id: 'ublue-documentary',
    name: 'UBlue Documentary',
    genre: 'Documentário',
    description: 'Máxima fidelidade cromática e neutralidade. Preserva a luz natural de Moçambique sem artificialismos.',
    filterCss: 'contrast(108%) saturate(105%) brightness(100%)',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    idealFor: ['Documentários', 'Reportagens Culturais', 'Natureza'],
    contrast: 108,
    saturation: 105,
    temperature: 5500,
    recommendedGains: 'Curva neutra Rec.709, sem distorção espectral'
  },
  {
    id: 'ublue-music-video',
    name: 'UBlue Music Video',
    genre: 'Música',
    description: 'Cores vibrantes, pretos profundos e realce dinâmico em néon, luzes de palco e vestuário.',
    filterCss: 'contrast(135%) saturate(145%) hue-rotate(5deg)',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    idealFor: ['Videoclipes', 'Marrabenta', 'Amapiano', 'Hip Hop'],
    contrast: 135,
    saturation: 145,
    temperature: 6200,
    recommendedGains: 'Saturação seletiva de primárias e ganho nas altas'
  },
  {
    id: 'ublue-wedding',
    name: 'UBlue Wedding',
    genre: 'Eventos Sociais',
    description: 'Difusão suave nas altas luzes, tonalidade quente e romântica, pele aveludada e preservação do branco do vestido.',
    filterCss: 'contrast(102%) saturate(108%) brightness(108%) sepia(15%)',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    idealFor: ['Casamentos', 'Celebrações de Família', 'Bodas'],
    contrast: 102,
    saturation: 108,
    temperature: 4900,
    recommendedGains: 'Roll-off suave no branco, de-blemish de pele'
  },
  {
    id: 'ublue-news',
    name: 'UBlue News',
    genre: 'Jornalismo',
    description: 'Padrão estrito de emissão broadcast (EBU/SMPTE). Alta nitidez de texto em GC, luz balanceada e sem cintilação.',
    filterCss: 'contrast(112%) saturate(102%) brightness(102%)',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    idealFor: ['Telejornais', 'Debates Políticos', 'Boletins Económicos'],
    contrast: 112,
    saturation: 102,
    temperature: 5600,
    recommendedGains: 'Conformidade 100% com SMPTE 170M'
  },
  {
    id: 'ublue-sports',
    name: 'UBlue Sports',
    genre: 'Desporto',
    description: 'Realce dinâmico do verde da relva, contraste veloz para objetos em movimento rápido e claridade de bola/placar.',
    filterCss: 'contrast(130%) saturate(130%) brightness(104%)',
    badgeColor: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
    idealFor: ['Moçambola', 'Basquetebol', 'Corridas', 'Desportos'],
    contrast: 130,
    saturation: 130,
    temperature: 6000,
    recommendedGains: 'Aceleração de nitidez temporal e motion compensation'
  },
  {
    id: 'ublue-kids',
    name: 'UBlue Kids',
    genre: 'Infantil',
    description: 'Cores lúdicas, vivas e alegres. Primárias fortes (vermelho, amarelo e azul) estimulantes para o público infantil.',
    filterCss: 'contrast(120%) saturate(150%) brightness(110%)',
    badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    idealFor: ['Desenhos Animados', 'Contos Infantis', 'Aulas Divertidas'],
    contrast: 120,
    saturation: 150,
    temperature: 5800,
    recommendedGains: 'Gama estendida de primárias saturadas'
  },
  {
    id: 'ublue-vintage',
    name: 'UBlue Vintage',
    genre: 'Memória & Arquivo',
    description: 'Emulação orgânica de película 16mm/35mm dos anos 70/80 com granulação analógica sutil e pretos elevados.',
    filterCss: 'contrast(110%) saturate(80%) sepia(35%) brightness(96%)',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    idealFor: ['Arquivos Históricos', 'Homenagens', 'Clássicos'],
    contrast: 110,
    saturation: 80,
    temperature: 4200,
    recommendedGains: 'Simulação de halation e roll-off vintage'
  },
  {
    id: 'ublue-ultra-hdr',
    name: 'UBlue Ultra HDR',
    genre: 'HDR / 4K',
    description: 'Amplo alcance dinâmico estendido. Tone mapping inteligente de 10 bits para ecrãs OLED e Smart TVs 4K.',
    filterCss: 'contrast(140%) saturate(125%) brightness(105%)',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    idealFor: ['Produções 4K', 'Espetáculos Piromusicais', 'Documentários Épicos'],
    contrast: 140,
    saturation: 125,
    temperature: 6500,
    recommendedGains: 'BT.2020 / PQ HDR tone mapped to SDR'
  }
];

export interface CreatorCategoryProfile {
  id: string;
  name: string;
  description: string;
  iconName: string;
  exampleUse: string;
}

export const CREATOR_PUBLISHERS: CreatorCategoryProfile[] = [
  {
    id: 'artistas',
    name: 'Artistas & Músicos',
    description: 'Compositores, cantores, DJs e bandas moçambicanas e africanas.',
    iconName: 'Music',
    exampleUse: 'Lançamento de videoclipes, faixas acústicas e lives'
  },
  {
    id: 'produtoras',
    name: 'Produtoras de Cinema & Vídeo',
    description: 'Empresas audiovisuais e casas de produção independentes.',
    iconName: 'Clapperboard',
    exampleUse: 'Longas, curtas-metragens, séries e telefilmes'
  },
  {
    id: 'escolas',
    name: 'Escolas',
    description: 'Instituições de ensino primário e secundário de todo o país.',
    iconName: 'GraduationCap',
    exampleUse: 'Aulas gravadas, feiras de ciências e peças teatrais'
  },
  {
    id: 'universidades',
    name: 'Universidades & Politécnicos',
    description: 'UEM, UP, ISCTEM, UniLúrio, UniZambeze e faculdades parceiras.',
    iconName: 'School',
    exampleUse: 'Aulas magnas, colóquios, pesquisas e debates académicos'
  },
  {
    id: 'empresas',
    name: 'Empresas & Startups',
    description: 'Corporações, marcas e PMEs do setor produtivo moçambicano.',
    iconName: 'Building2',
    exampleUse: 'Webinars, lançamentos de produtos e programas corporativos'
  },
  {
    id: 'igrejas',
    name: 'Igrejas & Comunidades de Fé',
    description: 'Entidades religiosas, coros gospel e movimentos comunitários.',
    iconName: 'HeartHandshake',
    exampleUse: 'Transmissão de cultos, concertos de louvor e programas sociais'
  },
  {
    id: 'ongs',
    name: 'ONGs & Associações',
    description: 'Organizações não-governamentais de desenvolvimento comunitário.',
    iconName: 'Globe',
    exampleUse: 'Campanhas de saúde, empoderamento feminino e meio ambiente'
  },
  {
    id: 'jornalistas',
    name: 'Jornalistas Independentes',
    description: 'Profissionais de imprensa, correspondentes provinciais e repórteres.',
    iconName: 'Newspaper',
    exampleUse: 'Investigações locais, reportagens do interior e podcasts de notícias'
  },
  {
    id: 'cineastas',
    name: 'Cineastas & Roteiristas',
    description: 'Diretores de cinema autoral, documentaristas e criadores de narrativas.',
    iconName: 'Film',
    exampleUse: 'Mostras de cinema moçambicano e festivais independentes'
  },
  {
    id: 'podcasters',
    name: 'Podcasters & Creators',
    description: 'Criadores de conteúdo nativos digitais, streamers e comentadores.',
    iconName: 'Mic',
    exampleUse: 'Mesas redondas, entrevistas em estúdio e vodcasts'
  }
];

export const CONTENT_TYPES_CATALOG = [
  { id: 'filmes', name: 'Filmes', icon: 'Film', defaultDuration: '90-120 min', quality: '4K / 1080p' },
  { id: 'series', name: 'Séries', icon: 'Tv', defaultDuration: '25-50 min/ep', quality: '1080p' },
  { id: 'novelas', name: 'Novelas', icon: 'Smile', defaultDuration: '45 min/ep', quality: '1080p' },
  { id: 'documentarios', name: 'Documentários', icon: 'Compass', defaultDuration: '30-90 min', quality: '4K / 1080p' },
  { id: 'curtas', name: 'Curtas-metragens', icon: 'Video', defaultDuration: '10-25 min', quality: '1080p' },
  { id: 'videoclipes', name: 'Videoclipes', icon: 'Music', defaultDuration: '3-6 min', quality: '4K / 1080p' },
  { id: 'podcasts', name: 'Podcasts & Vodcasts', icon: 'Mic', defaultDuration: '30-75 min', quality: '1080p / Áudio HQ' },
  { id: 'educativos', name: 'Programas Educativos', icon: 'BookOpen', defaultDuration: '20-40 min', quality: '1080p' },
  { id: 'eventos_ao_vivo', name: 'Eventos ao Vivo', icon: 'Radio', defaultDuration: '1-4 horas', quality: 'Low Latency HLS' },
  { id: 'concertos', name: 'Concertos & Festivais', icon: 'Sparkles', defaultDuration: '90-180 min', quality: '1080p / Áudio 5.1' },
  { id: 'entrevistas', name: 'Entrevistas & Talk Shows', icon: 'MessageSquare', defaultDuration: '30-60 min', quality: '1080p' },
];

export interface ScheduleItem {
  id: string;
  timeSlot: string; // e.g., "08:00"
  timeEnd: string;
  title: string;
  category: string;
  presenterOrCreator: string;
  synopsis: string;
  thumbnail: string;
  isLiveNow?: boolean;
  progressPercent?: number; // if live
  ratingAge: string;
  lutProfileApplied: string;
}

export const UBLUE_DAILY_SCHEDULE: ScheduleItem[] = [
  {
    id: 'prog-0800',
    timeSlot: '08:00',
    timeEnd: '09:00',
    title: 'UBlue Notícias: Manhã Moçambique',
    category: 'Notícias',
    presenterOrCreator: 'Redação UBlue & Jornalistas Parceiros',
    synopsis: 'Abertura do dia com os acontecimentos mais marcantes em Maputo, Beira, Nampula e nas províncias, câmbio do Metical e previsão do tempo.',
    thumbnail: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80',
    ratingAge: 'Livre',
    lutProfileApplied: 'UBlue News'
  },
  {
    id: 'prog-0900',
    timeSlot: '09:00',
    timeEnd: '10:00',
    title: 'Documentário: Histórias de Moçambique',
    category: 'Documentário',
    presenterOrCreator: 'Produtora Pérola do Índico & Cineastas',
    synopsis: 'Uma jornada visual pelas tradições do norte ao sul: a arte maconde, a arquitetura da Ilha de Moçambique e a conservação da Gorongosa.',
    thumbnail: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600&auto=format&fit=crop&q=80',
    ratingAge: 'Livre',
    lutProfileApplied: 'UBlue Documentary'
  },
  {
    id: 'prog-1000',
    timeSlot: '10:00',
    timeEnd: '12:00',
    title: 'UBlue Som & Ritmo: Marrabenta & Urban Beats',
    category: 'Música',
    presenterOrCreator: 'Be Universe Agency & Matola Media',
    synopsis: 'Os lançamentos em alta das paradas musicais moçambicanas, videoclipes premiados, sessões acústicas e entrevistas exclusivas.',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    ratingAge: '10+',
    lutProfileApplied: 'UBlue Music Video'
  },
  {
    id: 'prog-1200',
    timeSlot: '12:00',
    timeEnd: '14:00',
    title: 'Programa Escolar: Saber & Crescer',
    category: 'Educação',
    presenterOrCreator: 'Rede de Escolas & Universidades Parceiras',
    synopsis: 'Conteúdo curricular interativo, matemática lúdica, ciências naturais, literatura moçambicana e dicas para preparação de exames.',
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
    ratingAge: 'Livre',
    lutProfileApplied: 'UBlue Kids'
  },
  {
    id: 'prog-1400',
    timeSlot: '14:00',
    timeEnd: '18:00',
    title: 'Sessão Cinema: O Resgate do Zambeze',
    category: 'Filme',
    presenterOrCreator: 'Estúdios Independentes de Moçambique',
    synopsis: 'Aclamado longa-metragem de aventura e suspense gravado nas paisagens majestosas ao longo do Rio Zambeze.',
    thumbnail: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=600&auto=format&fit=crop&q=80',
    ratingAge: '12+',
    isLiveNow: true,
    progressPercent: 48,
    lutProfileApplied: 'UBlue Cinema'
  },
  {
    id: 'prog-1800',
    timeSlot: '18:00',
    timeEnd: '20:00',
    title: 'UBlue Originals: Be Universe Talent Show',
    category: 'UBlue Originals',
    presenterOrCreator: 'Be Universe Agency',
    synopsis: 'A maior competição artística do país. Novos talentos disputam bolsas de produção e contrato oficial de lançamento nacional.',
    thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
    ratingAge: 'Livre',
    lutProfileApplied: 'UBlue Premium'
  },
  {
    id: 'prog-2000',
    timeSlot: '20:00',
    timeEnd: '22:00',
    title: 'Evento Especial: Concerto ao Vivo Maputo Jazz Night',
    category: 'Evento Especial',
    presenterOrCreator: 'UBlue Live Network & Centro Cultural',
    synopsis: 'Transmissão direta com som surround 5.1 e multicâmera com os maiores mestres do jazz e da marrabenta instrumental.',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    ratingAge: '12+',
    lutProfileApplied: 'UBlue Ultra HDR'
  },
  {
    id: 'prog-2200',
    timeSlot: '22:00',
    timeEnd: '00:00',
    title: 'Noite de Cinema: Sombras na Savana',
    category: 'Cinema',
    presenterOrCreator: 'Cineastas Africanos Associados',
    synopsis: 'Thriller psicológico aclamado em festivais internacionais. Uma narrativa profunda sobre mistério e resiliência humana.',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop&q=80',
    ratingAge: '16+',
    lutProfileApplied: 'UBlue Cinema'
  }
];

export interface NotificationChannelConfig {
  id: 'android_push' | 'ios_push' | 'web_toast' | 'email' | 'whatsapp';
  name: string;
  deviceIcon: string;
  badge: string;
  description: string;
  enabled: boolean;
  leadTimeMinutes: number; // e.g., 10 minutes before
}

export const DEFAULT_NOTIFICATION_CHANNELS: NotificationChannelConfig[] = [
  {
    id: 'android_push',
    name: 'Push no Android',
    deviceIcon: 'Smartphone',
    badge: 'FCM / Google Services',
    description: 'Notificação imediata no ecrã bloqueado de qualquer smartphone Android.',
    enabled: true,
    leadTimeMinutes: 10
  },
  {
    id: 'ios_push',
    name: 'Push no iPhone',
    deviceIcon: 'Apple',
    badge: 'APNs / Apple Push',
    description: 'Banner nativo com suporte a pré-visualização de imagem e som customizado.',
    enabled: true,
    leadTimeMinutes: 10
  },
  {
    id: 'web_toast',
    name: 'Aviso no Website',
    deviceIcon: 'Globe',
    badge: 'In-App Web Toast',
    description: 'Aviso visual e sonoro no canto do navegador quando o utilizador estiver no portal.',
    enabled: true,
    leadTimeMinutes: 5
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Oficial (Opt-in)',
    deviceIcon: 'MessageCircle',
    badge: 'Meta Business Cloud API',
    description: 'Mensagem direta com link inteligente de 1 toque para abrir o player ao vivo.',
    enabled: false,
    leadTimeMinutes: 15
  },
  {
    id: 'email',
    name: 'Email Informativo',
    deviceIcon: 'Mail',
    badge: 'Boletim Diário',
    description: 'Resumo da grelha de programação e destaques da noite enviado por email.',
    enabled: false,
    leadTimeMinutes: 30
  }
];
