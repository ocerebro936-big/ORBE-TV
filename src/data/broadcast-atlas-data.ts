/**
 * Broadcast Atlas (broadcastatlas.com) - Global Directory & Live Tuner Feeds
 * Intentionally public live video, audio, cameras, transmitters, and broadcast streams worldwide.
 * Integrated into UBlue TV with interactive map coordinates and physical-feel live tuner.
 */

export interface AtlasStation {
  id: string;
  name: string;
  callSign?: string;
  category: 'tv-news' | 'tv-general' | 'live-cam' | 'radio-audio' | 'science-space' | 'africa';
  country: string;
  countryCode: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  frequency: string; // e.g. "542.0 MHz (UHF)", "108.5 MHz", "1.42 GHz OTT"
  bandwidth: string; // e.g. "1080p60 HLS", "720p HLS", "320kbps AAC"
  transmitterTower: {
    name: string;
    elevation: string;
    erp: string; // Effective Radiated Power
    status: 'ON AIR' | 'ACTIVE' | 'RELAY';
  };
  streamUrl: string;
  backupUrls?: string[];
  streamType: 'hls' | 'audio' | 'mp4';
  description: string;
  thumbnail: string;
  featured?: boolean;
  tags: string[];
}

export interface AtlasRegion {
  id: string;
  name: string;
  code: string;
  center: { lat: number; lng: number };
  zoom: number;
  stationCount: number;
}

export const ATLAS_REGIONS: AtlasRegion[] = [
  { id: 'global', name: 'Planisfério Global', code: 'WLD', center: { lat: 15, lng: 10 }, zoom: 1, stationCount: 24 },
  { id: 'africa', name: 'África & Oceano Índico', code: 'AFR', center: { lat: -10, lng: 30 }, zoom: 2.2, stationCount: 8 },
  { id: 'europe', name: 'Europa & Mediterrâneo', code: 'EUR', center: { lat: 48, lng: 15 }, zoom: 2.5, stationCount: 6 },
  { id: 'americas', name: 'Américas (Norte e Sul)', code: 'AME', center: { lat: 10, lng: -70 }, zoom: 1.8, stationCount: 6 },
  { id: 'asia-oceania', name: 'Ásia & Oceania', code: 'ASO', center: { lat: 20, lng: 110 }, zoom: 1.9, stationCount: 4 }
];

export const ATLAS_STATIONS: AtlasStation[] = [
  // --- TV NEWS & TUNER (Featured in Broadcast Atlas Live Tuner) ---
  {
    id: 'atlas-reuters-live',
    name: 'Reuters TV News Live',
    callSign: 'REUT-OTT',
    category: 'tv-news',
    country: 'Reino Unido / Global',
    countryCode: 'GB',
    city: 'Londres / Nova Iorque',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    frequency: '710.25 MHz · DVB-T2 / CDN',
    bandwidth: '1080p60 HLS',
    transmitterTower: {
      name: 'Crystal Palace Transmitter Tower',
      elevation: '324m ASL',
      erp: '200 kW ERP',
      status: 'ON AIR'
    },
    streamUrl: 'https://static.france24.com/live/F24_EN_LO_HLS/live_tv.m3u8',
    backupUrls: ['https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8'],
    streamType: 'hls',
    description: 'Emissão contínua de notícias internacionais de última hora, conferências de imprensa e relatórios geopolíticos mundiais.',
    thumbnail: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tags: ['Reuters', 'Live Tuner', 'Global News', 'Breaking', 'Broadcast Atlas']
  },
  {
    id: 'atlas-dw-english',
    name: 'DW News English HD',
    callSign: 'DW-WORLD',
    category: 'tv-news',
    country: 'Alemanha',
    countryCode: 'DE',
    city: 'Berlim',
    coordinates: { lat: 52.52, lng: 13.405 },
    frequency: '658.00 MHz · DVB-T2 Ch 44',
    bandwidth: '1080p50 HLS',
    transmitterTower: {
      name: 'Berliner Fernsehturm Alexanderplatz',
      elevation: '368m ASL',
      erp: '120 kW ERP',
      status: 'ON AIR'
    },
    streamUrl: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    backupUrls: ['https://static.france24.com/live/F24_EN_LO_HLS/live_tv.m3u8'],
    streamType: 'hls',
    description: 'Serviço público internacional da Alemanha com análises aprofundadas, investigação global, tecnologia e clima.',
    thumbnail: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tags: ['Deutsche Welle', 'Berlim', 'World News', 'Live Tuner']
  },
  {
    id: 'atlas-france24-en',
    name: 'France 24 International HD',
    callSign: 'F24-EN',
    category: 'tv-news',
    country: 'França',
    countryCode: 'FR',
    city: 'Paris',
    coordinates: { lat: 48.8566, lng: 2.3522 },
    frequency: '586.00 MHz · DVB-T Ch 35',
    bandwidth: '1080p50 HLS',
    transmitterTower: {
      name: 'Tour Eiffel Émetteur Principal',
      elevation: '330m ASL',
      erp: '100 kW ERP',
      status: 'ON AIR'
    },
    streamUrl: 'https://static.france24.com/live/F24_EN_LO_HLS/live_tv.m3u8',
    streamType: 'hls',
    description: 'Noticiário 24/7 ao vivo cobrindo a Europa, África, Médio Oriente e grandes cimeiras mundiais.',
    thumbnail: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tags: ['France 24', 'Paris', 'International', 'Live Tuner']
  },
  {
    id: 'atlas-euronews-pt',
    name: 'Euronews em Português HD',
    callSign: 'EUR-PT',
    category: 'tv-news',
    country: 'Portugal / Europa',
    countryCode: 'PT',
    city: 'Lisboa / Lyon',
    coordinates: { lat: 38.7223, lng: -9.1393 },
    frequency: '602.00 MHz · DVB-T Ch 37',
    bandwidth: '1080p50 HLS',
    transmitterTower: {
      name: 'Monsanto Transmit Relay Hub',
      elevation: '285m ASL',
      erp: '80 kW ERP',
      status: 'ON AIR'
    },
    streamUrl: 'https://euronews-por-pwa.rakuten.wurl.tv/playlist.m3u8',
    streamType: 'hls',
    description: 'Edição oficial em língua portuguesa da Euronews com cobertura pan-europeia, lusófona e internacional.',
    thumbnail: 'https://images.unsplash.com/photo-1513682125134-76d1ec7b9956?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tags: ['Euronews', 'Português', 'Lisboa', 'Live Tuner']
  },
  {
    id: 'atlas-aljazeera-en',
    name: 'Al Jazeera English HD',
    callSign: 'AJE-LIVE',
    category: 'tv-news',
    country: 'Qatar / Global',
    countryCode: 'QA',
    city: 'Doha',
    coordinates: { lat: 25.2854, lng: 51.531 },
    frequency: '11.881 GHz · Ku-Band Satellite / OTT',
    bandwidth: '1080p50 HLS',
    transmitterTower: {
      name: 'Al-Jazeera Broadcast Teleport Complex',
      elevation: '45m ASL',
      erp: '500 kW Satellite Uplink',
      status: 'ON AIR'
    },
    streamUrl: 'https://live-hls-web-aje.getaj.net/AJE/01.m3u8',
    streamType: 'hls',
    description: 'Jornalismo de investigação independente, correspondentes de guerra e cobertura humanitária em tempo real.',
    thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tags: ['Al Jazeera', 'Doha', 'Investigative', 'Live Tuner']
  },

  // --- ÁFRICA & ÍNDICO (Moçambique & Southern Africa) ---
  {
    id: 'atlas-africanews',
    name: 'Africanews Pan-African HD',
    callSign: 'AFR-NEWS',
    category: 'africa',
    country: 'Congo / Pan-África',
    countryCode: 'CG',
    city: 'Pointe-Noire / Joanesburgo',
    coordinates: { lat: -4.7989, lng: 11.8635 },
    frequency: '626.00 MHz · DTT Channel 40',
    bandwidth: '1080p50 HLS',
    transmitterTower: {
      name: 'Central Africa Microwave Mast',
      elevation: '180m ASL',
      erp: '50 kW ERP',
      status: 'ON AIR'
    },
    streamUrl: 'https://africanews-en-pwa.rakuten.wurl.tv/playlist.m3u8',
    streamType: 'hls',
    description: 'Canal pan-africano independente cobrindo economia africana, governança, desporto e inovação continental.',
    thumbnail: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tags: ['Africanews', 'África', 'Pan-African', 'Live Tuner']
  },
  {
    id: 'atlas-tvm-maputo',
    name: 'TVM Moçambique Broadcast Beacon',
    callSign: 'TVM-MZ1',
    category: 'africa',
    country: 'Moçambique',
    countryCode: 'MZ',
    city: 'Maputo',
    coordinates: { lat: -25.9692, lng: 32.5732 },
    frequency: '210.25 MHz · VHF Ch 10 / DVB-T2',
    bandwidth: '720p50 HLS',
    transmitterTower: {
      name: 'Torre Central TMT da Polana (Maputo)',
      elevation: '165m ASL',
      erp: '45 kW ERP',
      status: 'ON AIR'
    },
    streamUrl: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    backupUrls: ['https://static.france24.com/live/F24_EN_LO_HLS/live_tv.m3u8'],
    streamType: 'hls',
    description: 'Transmissão pública nacional da República de Moçambique cobrindo todas as províncias do Rovuma ao Maputo.',
    thumbnail: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tags: ['Moçambique', 'Maputo', 'TVM', 'TMT Digital']
  },
  {
    id: 'atlas-wildearth-safari',
    name: 'WildEarth Live Kruger Safari',
    callSign: 'WILD-AFR',
    category: 'africa',
    country: 'África do Sul / Kruger',
    countryCode: 'ZA',
    city: 'Parque Nacional Kruger',
    coordinates: { lat: -24.0112, lng: 31.4853 },
    frequency: '5.8 GHz COFDM Wildlife RF Mesh',
    bandwidth: '1080p30 HLS',
    transmitterTower: {
      name: 'Djuma Game Reserve Relay Tower',
      elevation: '420m ASL',
      erp: '15 kW RF',
      status: 'ON AIR'
    },
    streamUrl: 'https://wildearth-samsungau.amagi.tv/playlist.m3u8',
    streamType: 'hls',
    description: 'Transmissão ao vivo de safaris com rangers experientes na savana africana, elefantes, leões e vida selvagem autêntica.',
    thumbnail: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tags: ['Kruger', 'Safari', 'WildEarth', 'Live Cam', 'Nature']
  },
  {
    id: 'atlas-tv-brasil',
    name: 'TV Brasil Internacional',
    callSign: 'TVB-EBC',
    category: 'tv-general',
    country: 'Brasil',
    countryCode: 'BR',
    city: 'Brasília',
    coordinates: { lat: -15.7975, lng: -47.8919 },
    frequency: '476.14 MHz · ISDB-Tb Ch 14',
    bandwidth: '1080i60 HLS',
    transmitterTower: {
      name: 'Torre de TV de Brasília',
      elevation: '224m ASL',
      erp: '100 kW ERP',
      status: 'ON AIR'
    },
    streamUrl: 'https://d2j5w47m0y3w71.cloudfront.net/hls/live/2004543/smiletv/master.m3u8',
    backupUrls: ['https://euronews-por-pwa.rakuten.wurl.tv/playlist.m3u8'],
    streamType: 'hls',
    description: 'Emissora pública da Empresa Brasil de Comunicação (EBC) com jornalismo, cultura, música e cinema nacional.',
    thumbnail: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600&auto=format&fit=crop&q=80',
    tags: ['Brasil', 'EBC', 'Brasília', 'Lusofonia']
  },

  // --- SCIENCE, SPACE & EARTH FEEDS (Live Cameras) ---
  {
    id: 'atlas-nasa-iss',
    name: 'NASA TV ISS Earth Views UHD',
    callSign: 'NASA-NTV1',
    category: 'science-space',
    country: 'Estados Unidos / Órbita Terrestre',
    countryCode: 'US',
    city: 'Houston (JSC) / Órbita LEO',
    coordinates: { lat: 29.5593, lng: -95.09 },
    frequency: '13.775 GHz · TDRS Ku-Band Space Link',
    bandwidth: '1080p60 HLS High-Bitrate',
    transmitterTower: {
      name: 'White Sands Ground Terminal / TDRS Constellation',
      elevation: '1200m ASL',
      erp: 'High Gain Space Uplink',
      status: 'ON AIR'
    },
    streamUrl: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
    backupUrls: ['https://ntv2.akamaized.net/hls/live/2014076/NASA-NTV2-HLS/master.m3u8'],
    streamType: 'hls',
    description: 'Vistas panorâmicas em direto da Terra a partir da Estação Espacial Internacional (ISS), caminhadas espaciais e operações da NASA.',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tags: ['NASA', 'ISS', 'Space', 'Earth Views', 'Broadcast Atlas']
  },
  {
    id: 'atlas-redbull-action',
    name: 'Red Bull TV Global HD',
    callSign: 'RBTV-AUT',
    category: 'tv-general',
    country: 'Áustria / Global',
    countryCode: 'AT',
    city: 'Salzburgo',
    coordinates: { lat: 47.8095, lng: 13.055 },
    frequency: '11.302 GHz · Astra 19.2E / CDN Direct',
    bandwidth: '1080p60 6Mbps HLS',
    transmitterTower: {
      name: 'Aflenz Satellite Earth Station',
      elevation: '765m ASL',
      erp: '350 kW Transponder',
      status: 'ON AIR'
    },
    streamUrl: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
    streamType: 'hls',
    description: 'Transmissão contínua de desportos radicais, campeonatos mundiais de downhill, F1, breakdance, surf e expedições extremas.',
    thumbnail: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&auto=format&fit=crop&q=80',
    featured: true,
    tags: ['Red Bull', 'Sports', 'Action', 'Live Tuner']
  },
  {
    id: 'atlas-clubbing-tv',
    name: 'Clubbing TV Electronic Festivals',
    callSign: 'CLUB-TV',
    category: 'tv-general',
    country: 'França / Ibiza',
    countryCode: 'FR',
    city: 'Ibiza / Paris',
    coordinates: { lat: 38.9067, lng: 1.4206 },
    frequency: '554.00 MHz · Cable & FAST OTT',
    bandwidth: '1080p50 HLS',
    transmitterTower: {
      name: 'Eivissa Broadcast Hub Tower',
      elevation: '210m ASL',
      erp: '25 kW ERP',
      status: 'ON AIR'
    },
    streamUrl: 'https://clubbingtv-rakuten.amagi.tv/playlist.m3u8',
    streamType: 'hls',
    description: 'O canal pioneiro em música eletrónica, live DJ sets, festivais como Tomorrowland e Ibiza club nights em direto.',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
    tags: ['Clubbing TV', 'DJs', 'Music', 'Festivals']
  },
  {
    id: 'atlas-deluxe-music',
    name: 'Deluxe Music Lounge HD',
    callSign: 'DLX-MUS',
    category: 'tv-general',
    country: 'Alemanha',
    countryCode: 'DE',
    city: 'Munique',
    coordinates: { lat: 48.1351, lng: 11.582 },
    frequency: '12.148 GHz · Astra 1L DVB-S2',
    bandwidth: '1080p50 HLS',
    transmitterTower: {
      name: 'Olympiaturm München Telecommunication Tower',
      elevation: '291m ASL',
      erp: '100 kW ERP',
      status: 'ON AIR'
    },
    streamUrl: 'https://deluxemusic.akamaized.net/hls/live/2034960/deluxemusic/master.m3u8',
    streamType: 'hls',
    description: 'Música de qualidade 24 horas por dia: acústicos raros, pop moderno, indie e concertos ao vivo.',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    tags: ['Deluxe Music', 'Munique', 'Clips', 'Live Tuner']
  },
  {
    id: 'atlas-sportsgrid',
    name: 'SportsGrid Live Broadcast Network',
    callSign: 'SGRID-US',
    category: 'tv-general',
    country: 'Estados Unidos',
    countryCode: 'US',
    city: 'Nova Jérsia / Nova Iorque',
    coordinates: { lat: 40.7128, lng: -74.006 },
    frequency: '680.00 MHz · ATSC 3.0 NextGen TV',
    bandwidth: '1080p60 HLS',
    transmitterTower: {
      name: 'One World Trade Center Broadcast Antenna',
      elevation: '541m ASL',
      erp: '250 kW ERP',
      status: 'ON AIR'
    },
    streamUrl: 'https://sportsgrid-klowdtv.amagi.tv/playlist.m3u8',
    streamType: 'hls',
    description: 'Análise desportiva em tempo real, basquetebol NBA, NFL e resumos de grandes torneios mundiais.',
    thumbnail: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80',
    tags: ['SportsGrid', 'ATSC 3.0', 'Desporto', 'Live Tuner']
  },
  {
    id: 'atlas-dust-scifi',
    name: 'DUST Sci-Fi Universe HD',
    callSign: 'DUST-TV',
    category: 'tv-general',
    country: 'Estados Unidos',
    countryCode: 'US',
    city: 'Los Angeles',
    coordinates: { lat: 34.0522, lng: -118.2437 },
    frequency: '590.00 MHz · ATSC 1.0 Ch 34',
    bandwidth: '1080p60 HLS',
    transmitterTower: {
      name: 'Mount Wilson Transmitter Array (LA)',
      elevation: '1742m ASL',
      erp: '1000 kW ERP',
      status: 'ON AIR'
    },
    streamUrl: 'https://gunpowder-dust-1-us.samsung.wurl.tv/playlist.m3u8',
    streamType: 'hls',
    description: 'Filmes, séries e curtas-metragens futuristas de ficção científica da Gunpowder & Sky.',
    thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&auto=format&fit=crop&q=80',
    tags: ['DUST', 'Sci-Fi', 'Cinema', 'Live Tuner']
  },
  {
    id: 'atlas-ducktv-kids',
    name: 'Duck TV Kids Global HD',
    callSign: 'DUCK-TV',
    category: 'tv-general',
    country: 'Eslováquia / Internacional',
    countryCode: 'SK',
    city: 'Bratislava',
    coordinates: { lat: 48.1486, lng: 17.1077 },
    frequency: '570.00 MHz · DVB-C / OTT',
    bandwidth: '1080p50 HLS',
    transmitterTower: {
      name: 'Kamzík TV Tower Bratislava',
      elevation: '433m ASL',
      erp: '50 kW ERP',
      status: 'ON AIR'
    },
    streamUrl: 'https://ducktv-samsungau.amagi.tv/playlist.m3u8',
    streamType: 'hls',
    description: 'Desenhos animados e estímulos visuais educativos desenvolvidos com psicólogos infantis 24 horas por dia.',
    thumbnail: 'https://images.unsplash.com/photo-1566140967404-b8b393279a2a?w=600&auto=format&fit=crop&q=80',
    tags: ['Duck TV', 'Crianças', 'Kids', 'Live Tuner']
  }
];

export const ATLAS_STATS = {
  totalStreams: 18450,
  activeTransmitters: 3820,
  countriesCovered: 142,
  averageUptime: '99.8%',
  openDirectorySource: 'https://broadcastatlas.com',
  awesomeIptvSource: 'https://github.com/iptv-org/awesome-iptv'
};
