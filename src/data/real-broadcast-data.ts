/**
 * Dados e Configurações Oficiais da UBlue TV Real Broadcast Network
 * Sincronizados com o Fuso Horário de Moçambique (CAT / UTC+2)
 */

import { RealBroadcastProgram, SlotPricingTier, BroadcastMarketplaceItem } from '../types/broadcast-network';

export const SLOT_PRICING_TIERS: SlotPricingTier[] = [
  {
    id: 'madrugada',
    label: 'Madrugada',
    timeRange: '00:00 – 06:00',
    description: 'Menor custo por minuto. Ideal para reprises, documentários institucionais, testes de conteúdo e novos artistas independentes.',
    basePriceMT: 2500,
    audienceMultiplier: '1.0x',
    badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    peakAudienceAvg: 18500
  },
  {
    id: 'manha',
    label: 'Manhã',
    timeRange: '06:00 – 12:00',
    description: 'Custo médio. Grande alcance de trabalhadores, estudantes e famílias a começar o dia com música matinal e notícias.',
    basePriceMT: 6800,
    audienceMultiplier: '2.5x',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    peakAudienceAvg: 54000
  },
  {
    id: 'tarde',
    label: 'Tarde',
    timeRange: '12:00 – 18:00',
    description: 'Custo médio-alto. Excelente para escolas, cinema de tarde, cursos práticos e marcas de bens de consumo.',
    basePriceMT: 8900,
    audienceMultiplier: '3.2x',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    peakAudienceAvg: 72000
  },
  {
    id: 'prime-time',
    label: 'Horário Nobre (Prime Time)',
    timeRange: '18:00 – 23:00',
    description: 'Maior audiência nacional. Cobertura simultânea de Be Universe Talent Show, Jornal Principal e Cinema da Noite.',
    basePriceMT: 19500,
    audienceMultiplier: '6.8x',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    peakAudienceAvg: 198000
  }
];

export const OFFICIAL_LINEAR_PROGRAMS: RealBroadcastProgram[] = [
  {
    id: 'prog-0600',
    timeSlot: '06:00',
    timeEnd: '08:00',
    title: 'Música Matinal: Despertar Moçambique',
    categoryName: 'Música',
    realMediaType: 'musica',
    presenter: 'DJ Kiko Matola & Selo Afro-Beat',
    synopsis: 'Comece a manhã com a melhor seleção de Marrabenta tradicional, Pandza acelerado, Afro-House e ritmos quentes do Índico.',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    ratingAge: 'Livre',
    commercialBreak: {
      hasBreak: true,
      breakStart: '07:45',
      breakDurationMinutes: 10,
      adSpots: [
        {
          id: 'ad-matinal-1',
          brand: 'M-Pesa Moçambique',
          headline: 'Transfira em segundos de manhã sem filas',
          category: 'Fintech',
          durationSec: 30,
          tagline: 'Facilita a sua vida no telemóvel'
        },
        {
          id: 'ad-matinal-2',
          brand: 'Chá Madal',
          headline: 'O sabor da Zambézia na sua mesa',
          category: 'Alimentação',
          durationSec: 30,
          tagline: 'Tradição e energia pura'
        }
      ],
      ubluePromos: [
        {
          id: 'promo-01',
          title: 'Grande Final do Be Universe Talent Show',
          scheduleNote: 'Hoje às 18:00 no Canal Principal',
          highlightBadge: 'ESTREIA HOJE'
        }
      ]
    },
    mediaPayload: {
      musicTrack: {
        title: 'Morena de Maputo (Marrabenta Mix)',
        artist: 'Délio & Grupo Marrabenta da Mafalala',
        album: 'Balanço da Pérola',
        genre: 'Marrabenta Moderna',
        tempoBpm: 122,
        audioProfile: 'EBU R128 (-14 LUFS) · Master 24-bit',
        lyricsSnippet: 'Ku khuluma ni wena, xikwembu xa mina... Sol a nascer sobre a Baía de Maputo!'
      }
    }
  },
  {
    id: 'prog-0800',
    timeSlot: '08:00',
    timeEnd: '09:00',
    title: 'Notícias da Manhã Moçambique (Edição Direta)',
    categoryName: 'Notícias',
    realMediaType: 'noticias',
    presenter: 'Samira Abdul & Nelson Chichava',
    synopsis: 'Primeira síntese informativa do país. Trânsito na Ponte Maputo-Katembe, cotações bancárias do Banco de Moçambique e política nacional.',
    thumbnail: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80',
    ratingAge: 'Livre',
    commercialBreak: {
      hasBreak: true,
      breakStart: '08:50',
      breakDurationMinutes: 10,
      adSpots: [
        {
          id: 'ad-noticias-1',
          brand: 'Standard Bank Moçambique',
          headline: 'Financiamento a PMEs e Empreendedores',
          category: 'Banca',
          durationSec: 45,
          tagline: 'Movendo o seu negócio para a frente'
        }
      ],
      ubluePromos: [
        {
          id: 'promo-02',
          title: 'Boletim Económico UBlue às 13:00',
          scheduleNote: 'Análise de mercado e exportações',
          highlightBadge: 'ECONOMIA'
        }
      ]
    },
    mediaPayload: {
      newsBulletin: {
        anchorName: 'Samira Abdul · Estúdio Central Maputo',
        liveLocation: 'Avenida 25 de Setembro, Maputo',
        breakingTicker: [
          'BANCO DE MOÇAMBIQUE MANTÉM TAXA MIMO ESTÁVEL EM 13.5%',
          'CORREDOR DE MAPUTO REGISTA NOVO RECORDE DE EXPORTAÇÃO FERROVIÁRIA',
          'PROVÍNCIA DE CABO DELGADO RECEBE NOVO PROGRAMA DE FORMAÇÃO PROFISSIONAL JOVEM',
          'M-PESA E EMOLA REGISTAM MAIS DE 18 MILHÕES DE TRANSAÇÕES NO TRIMESTRE'
        ],
        topStory: 'Governo e parceiros anunciam expansão da rede de fibra ótica nacional até ao Rovuma.',
        financials: {
          usdMzn: 63.85,
          zarMzn: 3.65,
          eurMzn: 69.40
        },
        weather: [
          { city: 'Maputo', tempC: 27, condition: 'Céu Limpo' },
          { city: 'Beira', tempC: 29, condition: 'Parcialmente Nublado' },
          { city: 'Nampula', tempC: 31, condition: 'Sol Radiante' },
          { city: 'Tete', tempC: 35, condition: 'Quente e Seco' }
        ]
      }
    }
  },
  {
    id: 'prog-0900',
    timeSlot: '09:00',
    timeEnd: '12:00',
    title: 'Educação: UBlue Academy & Inovação',
    categoryName: 'Educação',
    realMediaType: 'educacao',
    presenter: 'Prof. Hermenegildo Machel',
    synopsis: 'Aulas interativas para estudantes do ensino secundário e universitário: programação web, economia familiar e ciências da natureza.',
    thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    ratingAge: 'Livre',
    commercialBreak: {
      hasBreak: true,
      breakStart: '11:45',
      breakDurationMinutes: 15,
      adSpots: [
        {
          id: 'ad-edu-1',
          brand: 'Universidade Eduardo Mondlane',
          headline: 'Inscrições Abertas para Cursos Tecnológicos',
          category: 'Ensino Superior',
          durationSec: 45,
          tagline: 'Construindo o futuro de Moçambique'
        },
        {
          id: 'ad-edu-2',
          brand: 'Papelaria Académica Maputo',
          headline: 'Kits Escolares e Mochilas com 20% de Desconto',
          category: 'Comércio',
          durationSec: 30,
          tagline: 'O parceiro do estudante moçambicano'
        }
      ],
      ubluePromos: [
        {
          id: 'promo-edu',
          title: 'Torne-se Criador Parceiro no UBlue Creator Hub',
          scheduleNote: 'Monetize os seus cursos e vídeos',
          highlightBadge: 'CREATOR HUB'
        }
      ]
    },
    mediaPayload: {
      podcastInfo: {
        host: 'Prof. Hermenegildo Machel',
        guests: ['Dra. Amina Issufo (Matemática)', 'Eng. Rui Bila (Robótica Móvel)'],
        episodeTopic: 'Algoritmos na Prática: Como Construir Aplicativos Móveis em África',
        waveformStyle: 'neural-blue'
      }
    }
  },
  {
    id: 'prog-1200',
    timeSlot: '12:00',
    timeEnd: '12:15',
    title: 'Intervalo Comercial & Bloco Publicitário Principal',
    categoryName: 'Publicidade',
    realMediaType: 'comercial',
    presenter: 'Emissão Comercial Automática (UBlue Ad Server)',
    synopsis: 'Bloco institucional e de patrocinadores oficiais de 15 minutos sem interrupção de filmes ou notícias ao longo do dia.',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
    ratingAge: 'Livre',
    commercialBreak: {
      hasBreak: true,
      breakStart: '12:00',
      breakDurationMinutes: 15,
      adSpots: [
        {
          id: 'ad-noon-1',
          brand: 'Vodacom Moçambique',
          headline: 'Rede 5G chega a novas províncias',
          category: 'Telecomunicações',
          durationSec: 60,
          tagline: 'Tudo de bom para si'
        },
        {
          id: 'ad-noon-2',
          brand: 'Cervejas 2M',
          headline: 'O sabor da celebração moçambicana',
          category: 'Bebidas',
          durationSec: 45,
          tagline: 'Beber com moderação. Venda proibida a menores de 18 anos.'
        },
        {
          id: 'ad-noon-3',
          brand: 'TotalEnergies Moçambique',
          headline: 'Energia que move comunidades sustentáveis',
          category: 'Energia',
          durationSec: 45,
          tagline: 'Compromisso com o desenvolvimento local'
        }
      ],
      ubluePromos: [
        {
          id: 'promo-noon-1',
          title: 'Assine o Pacote UBlue Mega por 250 MT',
          scheduleNote: 'Acesso a mais de 80 canais e sem anúncios durante os filmes',
          highlightBadge: 'UPGRADE'
        },
        {
          id: 'promo-noon-2',
          title: 'Sessão Cinema às 14:00: O Resgate do Zambeze',
          scheduleNote: 'Produção 100% Moçambicana em Full HD',
          highlightBadge: 'CINEMA'
        }
      ]
    },
    mediaPayload: {}
  },
  {
    id: 'prog-1215',
    timeSlot: '12:15',
    timeEnd: '14:00',
    title: 'Programa Escolar: Saber & Crescer',
    categoryName: 'Escola',
    realMediaType: 'educacao',
    presenter: 'Tia Rosa & Turma do Índico',
    synopsis: 'Conteúdo infantil e juvenil educativo. Histórias tradicionais contadas pelos mais velhos, teatro de fantoches e experiências científicas simples.',
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
    ratingAge: 'Livre',
    commercialBreak: {
      hasBreak: true,
      breakStart: '13:50',
      breakDurationMinutes: 10,
      adSpots: [
        {
          id: 'ad-kids-1',
          brand: 'Leite Parmalat Moçambique',
          headline: 'Nutrição forte para crescer com saúde',
          category: 'Laticínios',
          durationSec: 30,
          tagline: 'O leite da família'
        }
      ],
      ubluePromos: [
        {
          id: 'promo-kids',
          title: 'UBlue Kids: Canal Infantil 24h no Pacote Básico',
          scheduleNote: 'Sem publicidade imprópria e 100% seguro',
          highlightBadge: 'KIDS'
        }
      ]
    },
    mediaPayload: {}
  },
  {
    id: 'prog-1400',
    timeSlot: '14:00',
    timeEnd: '18:00',
    title: 'Cinema de Tarde: O Resgate do Zambeze',
    categoryName: 'Cinema',
    realMediaType: 'filme',
    presenter: 'Cineastas Independentes de Moçambique',
    synopsis: 'Longa-metragem dramático de ação e bravura ambiental. Uma equipa de guarda-parques enfrenta caçadores furtivos ao longo do majestoso Rio Zambeze.',
    thumbnail: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&auto=format&fit=crop&q=80',
    ratingAge: '12+',
    commercialBreak: {
      hasBreak: true,
      breakStart: '17:45',
      breakDurationMinutes: 15,
      adSpots: [
        {
          id: 'ad-cine-1',
          brand: 'Emola Movitel',
          headline: 'Pague as suas contas de água e luz sem taxa',
          category: 'Carteira Móvel',
          durationSec: 45,
          tagline: 'O dinheiro rápido no seu telemóvel'
        },
        {
          id: 'ad-cine-2',
          brand: 'Coca-Cola Moçambique',
          headline: 'Sabor refrescante para a sua tarde',
          category: 'Bebidas',
          durationSec: 30,
          tagline: 'Sinta o sabor'
        }
      ],
      ubluePromos: [
        {
          id: 'promo-cine',
          title: 'Grande Estreia do Be Universe Talent Show às 18:00',
          scheduleNote: 'Votação ao vivo através do UBlue App',
          highlightBadge: 'EM DIRETO'
        }
      ]
    },
    mediaPayload: {
      movieDetails: {
        director: 'Inácio Tembe',
        runtime: '118 minutos',
        aspectRatio: '2.39:1 Cinemascope Widescreen',
        soundtrack: 'Orquestra Marrabenta e Sons Naturais de Gorongosa',
        currentSceneName: 'Cena 4: A Travessia na Garganta de Cahora Bassa',
        synopsisSummary: 'Gravações em 4K HDR nativas em Tete e Sofala com certificação de direitos UBlue Clearance.'
      }
    }
  },
  {
    id: 'prog-1800',
    timeSlot: '18:00',
    timeEnd: '20:00',
    title: 'Be Universe Talent Show (Ao Vivo em Direto)',
    categoryName: 'Talent Show',
    realMediaType: 'concerto',
    presenter: 'Stélio Mandlate & Be Universe Agency',
    synopsis: 'A maior batalha nacional de dança, canto, poesia e artes cênicas. Novos talentos disputam contratos e produção profissional.',
    thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
    ratingAge: 'Livre',
    commercialBreak: {
      hasBreak: true,
      breakStart: '19:45',
      breakDurationMinutes: 15,
      adSpots: [
        {
          id: 'ad-talent-1',
          brand: 'Bim - Banco Internacional de Moçambique',
          headline: 'Apoio oficial à cultura e juventude',
          category: 'Banca',
          durationSec: 45,
          tagline: 'O banco líder em Moçambique'
        },
        {
          id: 'ad-talent-2',
          brand: 'Toyota Moçambique',
          headline: 'Toyota Hilux: A força das estradas nacionais',
          category: 'Automóvel',
          durationSec: 45,
          tagline: 'Indestrutível'
        }
      ],
      ubluePromos: [
        {
          id: 'promo-talent',
          title: 'Jornal Principal às 20:00 com Reportagem Especial',
          scheduleNote: 'Cobertura completa com repórteres em direto',
          highlightBadge: 'INFORMAÇÃO'
        }
      ]
    },
    mediaPayload: {
      musicTrack: {
        title: 'Baila Marrabenta (Apresentação Finalista #04)',
        artist: 'Gisela Cossa · Concorrente Matola',
        album: 'Be Universe Season 1 Live',
        genre: 'Fusão Afro-Jazz',
        tempoBpm: 128,
        audioProfile: 'Multitrack 5.1 Surround Sound',
        lyricsSnippet: 'Xiluva xanga, nwana wa mbilu... Dança com a alma!'
      }
    }
  },
  {
    id: 'prog-2000',
    timeSlot: '20:00',
    timeEnd: '21:00',
    title: 'Jornal Principal das 20:00 (Prime Time)',
    categoryName: 'Notícias',
    realMediaType: 'noticias',
    presenter: 'Ernesto Bila & Fátima Langa',
    synopsis: 'O principal telejornal de Moçambique. Noticiário completo, correspondentes em todas as 11 províncias e debate com analistas.',
    thumbnail: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&auto=format&fit=crop&q=80',
    ratingAge: 'Livre',
    commercialBreak: {
      hasBreak: true,
      breakStart: '20:45',
      breakDurationMinutes: 15, // 20:45-20:55 publicidade (10m) + 20:55-21:00 promos (5m)
      adSpots: [
        {
          id: 'ad-prime-1',
          brand: 'M-Pesa Moçambique',
          headline: 'Envie dinheiro para qualquer telemóvel instantaneamente',
          category: 'Fintech',
          durationSec: 60,
          tagline: 'Seguro, simples e rápido'
        },
        {
          id: 'ad-prime-2',
          brand: 'Tmcel Moçambique Telecom',
          headline: 'Novos pacotes de dados ilimitados para a sua casa',
          category: 'Telecomunicações',
          durationSec: 60,
          tagline: 'Sempre consigo'
        },
        {
          id: 'ad-prime-3',
          brand: 'BCI - Banco Comercial e de Investimentos',
          headline: 'Crédito Habitação com taxas bonificadas',
          category: 'Banca',
          durationSec: 60,
          tagline: 'O seu banco de sempre'
        }
      ],
      ubluePromos: [
        {
          id: 'promo-prime-1',
          title: 'A Seguir: Filme da Noite "Noites Escuras de Nampula"',
          scheduleNote: 'Às 21:00 em Full HD 1080p',
          highlightBadge: '21:00 CINEMA'
        },
        {
          id: 'promo-prime-2',
          title: 'UBlue TV: A Televisão Aberta aos Criadores Nacionais',
          scheduleNote: 'Compre o seu espaço no Broadcast Marketplace',
          highlightBadge: 'MARKETPLACE'
        }
      ]
    },
    mediaPayload: {
      newsBulletin: {
        anchorName: 'Ernesto Bila & Fátima Langa · Bancada Central',
        liveLocation: 'Complexo Broadcast UBlue Maputo',
        breakingTicker: [
          'JORNAL PRINCIPAL: ASSEMBLEIA DA REPÚBLICA APROVA NOVO PACOTE DE INCENTIVO CULTURAL',
          'PORTO DA BEIRA EXPULSA NOVO RECORDE DE CARGA COM MAIS DE 300 MIL TONELADAS',
          'MOÇAMBOLA 2026: FERROVIÁRIO DE MAPUTO VENCE BLACK BULLS POR 2-1 NO ESTÁDIO DA MACHAVA',
          'UNIVERSIDADES DE MOÇAMBIQUE LANÇAM 500 BOLSAS DIGITAIS UBLUE ACADEMY'
        ],
        topStory: 'Grande plano de modernização tecnológica das telecomunicações em Moçambique recebe aprovação unânime.',
        financials: {
          usdMzn: 63.85,
          zarMzn: 3.65,
          eurMzn: 69.40
        },
        weather: [
          { city: 'Maputo', tempC: 22, condition: 'Brisa Fresca da Baía' },
          { city: 'Beira', tempC: 25, condition: 'Estável' },
          { city: 'Nampula', tempC: 26, condition: 'Céu Limpo' }
        ]
      }
    }
  },
  {
    id: 'prog-2100',
    timeSlot: '21:00',
    timeEnd: '23:00',
    title: 'Filme da Noite: Noites Escuras de Nampula',
    categoryName: 'Cinema',
    realMediaType: 'filme',
    presenter: 'Estúdios do Norte & UBlue Cinema',
    synopsis: 'Thriller policial e suspense psicológico gravado nas pedras misteriosas de Nampula e na Ilha de Moçambique.',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80',
    ratingAge: '14+',
    commercialBreak: {
      hasBreak: true,
      breakStart: '22:45',
      breakDurationMinutes: 15,
      adSpots: [
        {
          id: 'ad-night-1',
          brand: 'Hotel Polana Serena',
          headline: 'Requinte e história de frente para o mar',
          category: 'Hotelaria',
          durationSec: 45,
          tagline: 'A grande dama de Maputo'
        }
      ],
      ubluePromos: [
        {
          id: 'promo-night',
          title: 'Sessão Música Noturna com DJ Set às 23:00',
          scheduleNote: 'Música sem interrupções até à madrugada',
          highlightBadge: '23:00 MÚSICA'
        }
      ]
    },
    mediaPayload: {
      movieDetails: {
        director: 'Carlos dos Santos',
        runtime: '105 minutos',
        aspectRatio: '2.39:1 DCI 4K',
        soundtrack: 'Trilha Sonora Original Composta em Nampula',
        currentSceneName: 'Clímax: Confronto nas Fortificações Históricas da Ilha',
        synopsisSummary: 'Vencedor do Prémio de Melhor Fotografia no Festival de Cinema Lusófono.'
      }
    }
  },
  {
    id: 'prog-2300',
    timeSlot: '23:00',
    timeEnd: '01:00',
    title: 'Música Noturna: Sessão Lounge & Ritmos do Índico',
    categoryName: 'Música',
    realMediaType: 'musica',
    presenter: 'DJ Nandos & Convidados',
    synopsis: 'Encerramento de programação com Afro-Chill, Kizomba acústica, Soul moçambicano e performances íntimas gravadas em estúdio.',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    ratingAge: '10+',
    commercialBreak: {
      hasBreak: false,
      breakStart: '00:00',
      breakDurationMinutes: 5,
      adSpots: [],
      ubluePromos: [
        {
          id: 'promo-late',
          title: 'Programação de Madrugada UBlue',
          scheduleNote: '01:00 às 06:00 Documentários & Música Relax',
          highlightBadge: '24/7 NO AR'
        }
      ]
    },
    mediaPayload: {
      musicTrack: {
        title: 'Brisa da Ilha (Acoustic Night Live)',
        artist: 'Stewart Sukuma & Banda Nkhuvu',
        album: 'Noites do Índico',
        genre: 'Afro-Jazz & Marrabenta Acústica',
        tempoBpm: 92,
        audioProfile: 'Hi-Res Audio 96kHz/24-bit',
        lyricsSnippet: 'Uta phumela muti wanga... A brisa do mar embala os corações da terra.'
      }
    }
  }
];

export const MOCK_BROADCAST_MARKETPLACE_ITEMS: BroadcastMarketplaceItem[] = [
  {
    id: 'mkt-001',
    creatorName: 'Délio & Banda Matola',
    creatorProfile: 'artista',
    title: 'Videoclipe Oficial: Menina da Polana',
    contentType: 'musica',
    targetSlot: '23:15',
    tier: 'prime-time',
    durationMinutes: 5,
    costMT: 19500,
    scheduledDate: 'Hoje · Horário Nobre',
    status: 'no_ar',
    legalClearance: {
      contractNumber: 'UBLUE-CLR-2026-0841',
      rightsOwner: 'Délio Silva Matola (Autor & Intérprete)',
      nuit: '104829104',
      territory: 'mz_exclusive',
      monetizationModel: 'revshare_70_30',
      revShareCreatorPercent: 70,
      revSharePlatformPercent: 30,
      signedAt: '2026-09-24T14:20:00Z',
      certificateHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      editorialChecklist: {
        gabinfoCompliance: true,
        incmBroadcastNorms: true,
        copyrightOwnershipVerified: true,
        ageClassification: 'Livre'
      }
    },
    liveStats: {
      peakViewers: 84200,
      totalWatchTimeMinutes: 395000,
      averageRetentionPercent: 91.4,
      revenueEarnedMT: 13650,
      adInteractions: 4120
    }
  },
  {
    id: 'mkt-002',
    creatorName: 'M-Pesa Moçambique S.A.',
    creatorProfile: 'empresa',
    title: 'Spot Publicitário: M-Pesa Empresas & Facturação',
    contentType: 'empresa',
    targetSlot: '20:45',
    tier: 'prime-time',
    durationMinutes: 2,
    costMT: 39000,
    scheduledDate: 'Hoje · Bloco Comercial das 20:45',
    status: 'aprovado',
    legalClearance: {
      contractNumber: 'UBLUE-CLR-2026-0912',
      rightsOwner: 'Vodacom Financial Services Moçambique',
      nuit: '400192837',
      territory: 'mz_exclusive',
      monetizationModel: 'patrocinio',
      revShareCreatorPercent: 0,
      revSharePlatformPercent: 100,
      signedAt: '2026-09-23T09:10:00Z',
      certificateHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      editorialChecklist: {
        gabinfoCompliance: true,
        incmBroadcastNorms: true,
        copyrightOwnershipVerified: true,
        ageClassification: 'Livre'
      }
    },
    liveStats: {
      peakViewers: 198000,
      totalWatchTimeMinutes: 396000,
      averageRetentionPercent: 98.2,
      revenueEarnedMT: 39000,
      adInteractions: 14890
    }
  },
  {
    id: 'mkt-003',
    creatorName: 'Instituto Politécnico da Beira',
    creatorProfile: 'escola',
    title: 'Curso Rápido: Gestão de Energia Solar Residencial',
    contentType: 'educacao',
    targetSlot: '09:15',
    tier: 'manha',
    durationMinutes: 15,
    costMT: 6800,
    scheduledDate: 'Amanhã · Faixa Educativa',
    status: 'aprovado',
    legalClearance: {
      contractNumber: 'UBLUE-CLR-2026-0775',
      rightsOwner: 'Direcção Pedagógica IPB Beira',
      nuit: '500294819',
      territory: 'palop',
      monetizationModel: 'revshare_70_30',
      revShareCreatorPercent: 70,
      revSharePlatformPercent: 30,
      signedAt: '2026-09-22T16:45:00Z',
      certificateHash: '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca7',
      editorialChecklist: {
        gabinfoCompliance: true,
        incmBroadcastNorms: true,
        copyrightOwnershipVerified: true,
        ageClassification: 'Livre'
      }
    },
    liveStats: {
      peakViewers: 42000,
      totalWatchTimeMinutes: 520000,
      averageRetentionPercent: 84.6,
      revenueEarnedMT: 4760,
      adInteractions: 2310
    }
  },
  {
    id: 'mkt-004',
    creatorName: 'Kanimambo Filmes & Produtora',
    creatorProfile: 'produtora',
    title: 'Curta-Metragem: Os Segredos da Macuti',
    contentType: 'video',
    targetSlot: '14:30',
    tier: 'tarde',
    durationMinutes: 20,
    costMT: 8900,
    scheduledDate: 'Quinta-Feira · Cinema de Tarde',
    status: 'revisao_editorial',
    legalClearance: {
      contractNumber: 'UBLUE-CLR-2026-1020',
      rightsOwner: 'Kanimambo Filmes Lda.',
      nuit: '400812948',
      territory: 'global',
      monetizationModel: 'revshare_70_30',
      revShareCreatorPercent: 70,
      revSharePlatformPercent: 30,
      signedAt: '2026-09-25T10:00:00Z',
      certificateHash: '12b6a8a4f91cf6456247fb217277685f76e06b9868e64e138a0cbf69e6ee08dd',
      editorialChecklist: {
        gabinfoCompliance: true,
        incmBroadcastNorms: true,
        copyrightOwnershipVerified: true,
        ageClassification: '12+'
      }
    },
    liveStats: {
      peakViewers: 0,
      totalWatchTimeMinutes: 0,
      averageRetentionPercent: 0,
      revenueEarnedMT: 0,
      adInteractions: 0
    }
  },
  {
    id: 'mkt-005',
    creatorName: 'Festival Sons do Índico 2026',
    creatorProfile: 'organizador',
    title: 'Transmissão do Concerto de Abertura na Praia da Costa do Sol',
    contentType: 'evento',
    targetSlot: '20:15',
    tier: 'prime-time',
    durationMinutes: 45,
    costMT: 28500,
    scheduledDate: 'Sábado · Especial de Fim de Semana',
    status: 'aprovado',
    legalClearance: {
      contractNumber: 'UBLUE-CLR-2026-1104',
      rightsOwner: 'Associação Cultural Marés do Sul',
      nuit: '400736182',
      territory: 'sadc',
      monetizationModel: 'patrocinio',
      revShareCreatorPercent: 80,
      revSharePlatformPercent: 20,
      signedAt: '2026-09-24T18:00:00Z',
      certificateHash: 'bc41cb02c3ef32f309d94943fa5e9ccbcf20cfb2e5519ec297aa056345ec4dd7',
      editorialChecklist: {
        gabinfoCompliance: true,
        incmBroadcastNorms: true,
        copyrightOwnershipVerified: true,
        ageClassification: 'Livre'
      }
    },
    liveStats: {
      peakViewers: 145000,
      totalWatchTimeMinutes: 2100000,
      averageRetentionPercent: 93.8,
      revenueEarnedMT: 22800,
      adInteractions: 11200
    }
  }
];
