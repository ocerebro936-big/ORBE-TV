import { Channel } from '../types/content';
import { OmdbMovieDetail, OmdbSearchResultItem } from '../types/omdb';
import { omdbService, CURATED_OMDB_PRESETS } from './omdb-service';
import { TVMAZE_CURATED_WEBCHANNELS } from '../data/tvmaze-webchannels-data';
import { INITIAL_TMDB_FAVORITE_MOVIES, TMDB_IMAGE_BASE_W500 } from '../data/tmdb-movies-data';
import { TmdbMovie } from '../types/tmdb';

const STORAGE_KEY_TUNED_CHANNELS = 'ublue_custom_tuned_channels_v2';

// Safe streaming feeds for newly tuned channels
const RELIABLE_FEEDS = [
  'https://deluxemusic.akamaized.net/hls/live/2034960/deluxemusic/master.m3u8',
  'https://d2e1asnsl7br7b.cloudfront.net/7782/master.m3u8',
  'https://cph-p2p-msl.akamaized.net/hls/live/200034/test/master.m3u8',
  'https://live-fast-cbsnews.cbsnews.com/out/v1/55b657e4e3e34b97a0ae7dd453b0a790/master.m3u8',
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
];

/**
 * Pre-tuned channels from OMDb, TVmaze, and TMDb user @genesiswine
 * This guarantees the user has a full, exciting lineup of 30+ tuned channels!
 */
export const DEFAULT_TUNED_CHANNELS: Channel[] = [
  // --- 1. FROM TMDb USER @genesiswine (https://www.themoviedb.org/u/genesiswine) ---
  {
    id: 'genesiswine-dune2',
    number: 60,
    name: 'TMDb @genesiswine: Duna Parte 2',
    tagline: 'Favorito de @genesiswine na TMDb · Sci-Fi Épico',
    logo: 'https://image.tmdb.org/t/p/w500/czembW0Rk1Ke7ra2vX09r9i044p.jpg',
    coverImage: 'https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s520DRq.jpg',
    category: 'movies',
    requiredTier: 'free',
    currentProgram: 'Duna: Parte 2 (Direção: Denis Villeneuve)',
    nextProgram: 'Bastidores: A Jornada de Paul Atreides em Arrakis',
    viewers: 24500,
    source: 'tmdb-genesiswine',
    provider: 'TMDb @genesiswine (themoviedb.org/u/genesiswine)',
    streamUrl: 'https://deluxemusic.akamaized.net/hls/live/2034960/deluxemusic/master.m3u8',
    videoType: 'hls',
    badge: '🍷 @genesiswine TMDb'
  },
  {
    id: 'genesiswine-interstellar',
    number: 61,
    name: 'TMDb @genesiswine: Interstellar',
    tagline: 'Top Curadoria @genesiswine · Exploração Espacial',
    logo: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    coverImage: 'https://image.tmdb.org/t/p/w1280/rAiYTsqBkRefBXweC1KGaE1Ps0P.jpg',
    category: 'movies',
    requiredTier: 'free',
    currentProgram: 'Interstellar: A Travessia do Buraco de Minhoca',
    nextProgram: 'Debate Científico: A Física dos Buracos Negros',
    viewers: 19800,
    source: 'tmdb-genesiswine',
    provider: 'TMDb @genesiswine (themoviedb.org/u/genesiswine)',
    streamUrl: 'https://cph-p2p-msl.akamaized.net/hls/live/200034/test/master.m3u8',
    videoType: 'hls',
    badge: '🍷 @genesiswine TMDb'
  },
  {
    id: 'genesiswine-inception',
    number: 62,
    name: 'TMDb @genesiswine: A Origem',
    tagline: 'Favorito de @genesiswine · Christopher Nolan Masterpiece',
    logo: 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
    coverImage: 'https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    category: 'movies',
    requiredTier: 'free',
    currentProgram: 'A Origem (Inception) - No Labirinto dos Sonhos',
    nextProgram: 'Análise do Pião e Teorias de Desfecho',
    viewers: 16400,
    source: 'tmdb-genesiswine',
    provider: 'TMDb @genesiswine (themoviedb.org/u/genesiswine)',
    streamUrl: 'https://d2e1asnsl7br7b.cloudfront.net/7782/master.m3u8',
    videoType: 'hls',
    badge: '🍷 @genesiswine TMDb'
  },
  {
    id: 'genesiswine-blackpanther',
    number: 63,
    name: 'TMDb @genesiswine: Pantera Negra',
    tagline: 'Wakanda Para Sempre · Curadoria Africana @genesiswine',
    logo: 'https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8vlum.jpg',
    coverImage: 'https://image.tmdb.org/t/p/w1280/b6ZJZHUytAnAOK4NjRR4TeZSZCO.jpg',
    category: 'movies',
    requiredTier: 'free',
    currentProgram: 'Black Panther: A Ascensão de Wakanda',
    nextProgram: 'Cultura e Afrofuturismo no Cinema Mundial',
    viewers: 22100,
    source: 'tmdb-genesiswine',
    provider: 'TMDb @genesiswine (themoviedb.org/u/genesiswine)',
    streamUrl: 'https://deluxemusic.akamaized.net/hls/live/2034960/deluxemusic/master.m3u8',
    videoType: 'hls',
    badge: '🍷 @genesiswine TMDb'
  },
  {
    id: 'genesiswine-cidadededeus',
    number: 64,
    name: 'TMDb @genesiswine: Cidade de Deus',
    tagline: 'Obra-Prima Lusófona · ⭐ TMDb 8.4/10',
    logo: 'https://image.tmdb.org/t/p/w500/k7eYdWvhYQZRFsnWYZ6V25w26No.jpg',
    coverImage: 'https://image.tmdb.org/t/p/w1280/mDFVPzkzpU2iU0bXWd0R5o6hW1l.jpg',
    category: 'movies',
    requiredTier: 'free',
    currentProgram: 'Cidade de Deus: A Luta pela Sobrevivência',
    nextProgram: 'Entrevista com Fernando Meirelles e Elenco',
    viewers: 18700,
    source: 'tmdb-genesiswine',
    provider: 'TMDb @genesiswine (themoviedb.org/u/genesiswine)',
    streamUrl: 'https://live-fast-cbsnews.cbsnews.com/out/v1/55b657e4e3e34b97a0ae7dd453b0a790/master.m3u8',
    videoType: 'hls',
    badge: '🍷 @genesiswine TMDb'
  },
  {
    id: 'genesiswine-spiderverse',
    number: 65,
    name: 'TMDb @genesiswine: Aranhaverso',
    tagline: 'Miles Morales no Multiverso · Animação Vencedora',
    logo: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    coverImage: 'https://image.tmdb.org/t/p/w1280/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    category: 'movies',
    requiredTier: 'free',
    currentProgram: 'Homem-Aranha: Através do Aranhaverso',
    nextProgram: 'A Revolução da Animação 2D/3D no Cinema',
    viewers: 26300,
    source: 'tmdb-genesiswine',
    provider: 'TMDb @genesiswine (themoviedb.org/u/genesiswine)',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    videoType: 'hls',
    badge: '🍷 @genesiswine TMDb'
  },
  {
    id: 'genesiswine-deadpool',
    number: 66,
    name: 'TMDb @genesiswine: Deadpool & Wolverine',
    tagline: 'Super Sucesso Global 2024 · Humor e Ação Marvel',
    logo: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    coverImage: 'https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba16jBB1jv8vpH.jpg',
    category: 'movies',
    requiredTier: 'free',
    currentProgram: 'Deadpool & Wolverine: A Missão no Vazio',
    nextProgram: 'Erros de Gravação e Cenas Deletadas',
    viewers: 31200,
    source: 'tmdb-genesiswine',
    provider: 'TMDb @genesiswine (themoviedb.org/u/genesiswine)',
    streamUrl: 'https://deluxemusic.akamaized.net/hls/live/2034960/deluxemusic/master.m3u8',
    videoType: 'hls',
    badge: '🍷 @genesiswine TMDb'
  },
  {
    id: 'genesiswine-sonic3',
    number: 67,
    name: 'TMDb @genesiswine: Sonic 3',
    tagline: 'Sonic, Knuckles, Tails & Shadow · Aventura Familiar',
    logo: 'https://image.tmdb.org/t/p/w500/d8qPMm7fdi8w617q97g90H14pMv.jpg',
    coverImage: 'https://image.tmdb.org/t/p/w1280/zOpe0e7DES01D7z51Dy44xEN20U.jpg',
    category: 'kids',
    requiredTier: 'free',
    currentProgram: 'Sonic 3: O Filme - O Duelo com Shadow',
    nextProgram: 'Origem dos Jogos e Trilha Sonora Lendária',
    viewers: 15400,
    source: 'tmdb-genesiswine',
    provider: 'TMDb @genesiswine (themoviedb.org/u/genesiswine)',
    streamUrl: 'https://d2e1asnsl7br7b.cloudfront.net/7782/master.m3u8',
    videoType: 'hls',
    badge: '🍷 @genesiswine TMDb'
  },
  {
    id: 'genesiswine-reileao',
    number: 68,
    name: 'TMDb @genesiswine: O Rei Leão',
    tagline: 'As Terras do Reino em África · Clássico Imortal',
    logo: 'https://image.tmdb.org/t/p/w500/dzBtGoc5gW7iGv879t243oBq2o0.jpg',
    coverImage: 'https://image.tmdb.org/t/p/w1280/1TUg5pO1VZ4B0Q1ISk5k0w1y2aU.jpg',
    category: 'kids',
    requiredTier: 'free',
    currentProgram: 'O Rei Leão: O Ciclo da Vida em Alta Definição',
    nextProgram: 'Hakuna Matata: Especial Musical Africano',
    viewers: 18300,
    source: 'tmdb-genesiswine',
    provider: 'TMDb @genesiswine (themoviedb.org/u/genesiswine)',
    streamUrl: 'https://cph-p2p-msl.akamaized.net/hls/live/200034/test/master.m3u8',
    videoType: 'hls',
    badge: '🍷 @genesiswine TMDb'
  },
  {
    id: 'genesiswine-scarface',
    number: 69,
    name: 'TMDb @genesiswine: Scarface (1983)',
    tagline: 'Al Pacino como Tony Montana · Clássico Cult de Brian De Palma',
    logo: 'https://image.tmdb.org/t/p/w500/iQ5z9Tugv84gB6yX102jPkW1g1B.jpg',
    coverImage: 'https://image.tmdb.org/t/p/w1280/f5F4cRhv2F40Bv0iW8j6zYvNqJ0.jpg',
    category: 'movies',
    requiredTier: 'free',
    currentProgram: 'Scarface: O Império de Tony Montana',
    nextProgram: 'Documentário: A Criação de um Ícone do Cinema',
    viewers: 14700,
    source: 'tmdb-genesiswine',
    provider: 'TMDb @genesiswine (themoviedb.org/u/genesiswine)',
    streamUrl: 'https://live-fast-cbsnews.cbsnews.com/out/v1/55b657e4e3e34b97a0ae7dd453b0a790/master.m3u8',
    videoType: 'hls',
    badge: '🍷 @genesiswine TMDb'
  },

  // --- 2. FROM OMDb API (https://www.omdbapi.com/) ---
  {
    id: 'omdb-tt0133093',
    number: 70,
    name: 'OMDb: The Matrix (1999)',
    tagline: 'Sintonizado via OMDb API · ⭐ IMDb 8.7/10',
    logo: 'https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_SX300.jpg',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    category: 'movies',
    requiredTier: 'free',
    currentProgram: 'The Matrix: A Escolha da Pílula Vermelha',
    nextProgram: 'Making Of: Efeitos Especiais Revolucionários',
    viewers: 17200,
    source: 'omdb-api',
    provider: 'OMDb API (omdbapi.com)',
    streamUrl: 'https://live-fast-cbsnews.cbsnews.com/out/v1/55b657e4e3e34b97a0ae7dd453b0a790/master.m3u8',
    videoType: 'hls',
    badge: '🎬 OMDb API'
  },
  {
    id: 'omdb-tt0903747',
    number: 71,
    name: 'OMDb: Breaking Bad',
    tagline: 'Série Lendária · ⭐ IMDb 9.5/10 · OMDb Sintonizada',
    logo: 'https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjAtNjA5cfQ5ZTI5NTNhXkEyXkFqcGc@._V1_SX300.jpg',
    coverImage: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80',
    category: 'originals',
    requiredTier: 'free',
    currentProgram: 'Breaking Bad: Maratona de Episódios OMDb',
    nextProgram: 'Entrevista Exclusiva com Bryan Cranston',
    viewers: 28400,
    source: 'omdb-api',
    provider: 'OMDb API (omdbapi.com)',
    streamUrl: 'https://cph-p2p-msl.akamaized.net/hls/live/200034/test/master.m3u8',
    videoType: 'hls',
    badge: '🎬 OMDb Séries'
  },
  {
    id: 'omdb-resgate-maputo',
    number: 72,
    name: 'OMDb: O Resgate de Maputo',
    tagline: 'Cinema Lusófono · Ação e Espionagem Moçambicana',
    logo: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=800&auto=format&fit=crop&q=80',
    category: 'movies',
    requiredTier: 'free',
    currentProgram: 'O Resgate de Maputo (Operação África Austral)',
    nextProgram: 'Debate: A Nova Vaga do Cinema Moçambicano',
    viewers: 14100,
    source: 'omdb-api',
    provider: 'OMDb API (omdbapi.com)',
    streamUrl: 'https://deluxemusic.akamaized.net/hls/live/2034960/deluxemusic/master.m3u8',
    videoType: 'hls',
    badge: '🇲🇿 OMDb Cinema MZ'
  },
  {
    id: 'omdb-tt0944947',
    number: 73,
    name: 'OMDb: Game of Thrones',
    tagline: 'A Batalha pelos Sete Reinos · ⭐ IMDb 9.2/10',
    logo: 'https://m.media-amazon.com/images/M/MV5BMTNhMDJmNmYtNDBlNy00ODU5LWExNGUtNmRlNW桃花kEyXkFqcGc@._V1_SX300.jpg',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    category: 'originals',
    requiredTier: 'free',
    currentProgram: 'Game of Thrones: A Batalha dos Bastardos',
    nextProgram: 'O Dragão e o Lobo: Bastidores Épicos',
    viewers: 34100,
    source: 'omdb-api',
    provider: 'OMDb API (omdbapi.com)',
    streamUrl: 'https://d2e1asnsl7br7b.cloudfront.net/7782/master.m3u8',
    videoType: 'hls',
    badge: '🎬 OMDb Séries'
  },
  {
    id: 'omdb-tt0468569',
    number: 74,
    name: 'OMDb: The Dark Knight (Batman)',
    tagline: 'O Cavaleiro das Trevas · ⭐ IMDb 9.0/10 · Heath Ledger',
    logo: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    category: 'movies',
    requiredTier: 'free',
    currentProgram: 'Batman: O Cavaleiro das Trevas contra o Coringa',
    nextProgram: 'Tributo ao Coringa de Heath Ledger',
    viewers: 38200,
    source: 'omdb-api',
    provider: 'OMDb API (omdbapi.com)',
    streamUrl: 'https://cph-p2p-msl.akamaized.net/hls/live/200034/test/master.m3u8',
    videoType: 'hls',
    badge: '🎬 OMDb Cinema'
  },
  {
    id: 'omdb-tt0172495',
    number: 75,
    name: 'OMDb: Gladiador (Gladiator)',
    tagline: 'Vencedor de 5 Óscares · Russell Crowe no Coliseu',
    logo: 'https://m.media-amazon.com/images/M/MV5BYWQ4YmNjYjEtOWE1Zi00Y2U4LWI4NTAtMTU0MjkxNWQ1Dg@@._V1_SX300.jpg',
    coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    category: 'movies',
    requiredTier: 'free',
    currentProgram: 'Gladiador: Força e Honra na Roma Antiga',
    nextProgram: 'A História Real dos Gladiadores de Roma',
    viewers: 21400,
    source: 'omdb-api',
    provider: 'OMDb API (omdbapi.com)',
    streamUrl: 'https://live-fast-cbsnews.cbsnews.com/out/v1/55b657e4e3e34b97a0ae7dd453b0a790/master.m3u8',
    videoType: 'hls',
    badge: '🎬 OMDb Cinema'
  },
  {
    id: 'omdb-tt0110912',
    number: 76,
    name: 'OMDb: Pulp Fiction',
    tagline: 'Quentin Tarantino Masterpiece · Palma de Ouro em Cannes',
    logo: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGc@._V1_SX300.jpg',
    coverImage: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=800&auto=format&fit=crop&q=80',
    category: 'movies',
    requiredTier: 'free',
    currentProgram: 'Pulp Fiction: Tempo de Violência',
    nextProgram: 'Trilha Sonora Clássica e Cenas Memoráveis',
    viewers: 19800,
    source: 'omdb-api',
    provider: 'OMDb API (omdbapi.com)',
    streamUrl: 'https://deluxemusic.akamaized.net/hls/live/2034960/deluxemusic/master.m3u8',
    videoType: 'hls',
    badge: '🎬 OMDb Cinema'
  },
  {
    id: 'omdb-tt1630029',
    number: 77,
    name: 'OMDb: Avatar - O Caminho da Água',
    tagline: 'James Cameron · Os Oceanos e Criaturas de Pandora',
    logo: 'https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGc@._V1_SX300.jpg',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    category: 'movies',
    requiredTier: 'free',
    currentProgram: 'Avatar 2: A Tribo Metkayina e os Tulku',
    nextProgram: 'Tecnologia Subaquática de James Cameron',
    viewers: 29500,
    source: 'omdb-api',
    provider: 'OMDb API (omdbapi.com)',
    streamUrl: 'https://d2e1asnsl7br7b.cloudfront.net/7782/master.m3u8',
    videoType: 'hls',
    badge: '🎬 OMDb Cinema'
  },

  // --- 3. FROM TVmaze DASHBOARD & WEB CHANNELS (https://www.tvmaze.com/dashboard/index) ---
  {
    id: 'tvmaze-netflix-live',
    number: 80,
    name: 'TVmaze Web: Netflix Originals TV',
    tagline: 'TVmaze Web Schedule · Séries e Sucessos Mundiais',
    logo: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=800&auto=format&fit=crop&q=80',
    category: 'originals',
    requiredTier: 'free',
    currentProgram: 'Stranger Things & Squid Game: Sessão Especial',
    nextProgram: 'Round 6: Desafios e Bastidores da Produção',
    viewers: 35400,
    source: 'tvmaze-web',
    provider: 'TVmaze Web Channels (tvmaze.com)',
    streamUrl: 'https://cph-p2p-msl.akamaized.net/hls/live/200034/test/master.m3u8',
    videoType: 'hls',
    badge: '📺 TVmaze Netflix'
  },
  {
    id: 'tvmaze-appletv',
    number: 81,
    name: 'TVmaze Web: Apple TV+ Global Live',
    tagline: 'TVmaze Web Streaming Network · Produções de Prestígio',
    logo: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&auto=format&fit=crop&q=80',
    category: 'originals',
    requiredTier: 'free',
    currentProgram: 'Severance & Ted Lasso - Sessão Contínua',
    nextProgram: 'Foundation: A Saga Galáctica',
    viewers: 18900,
    source: 'tvmaze-web',
    provider: 'TVmaze Web Channels (tvmaze.com)',
    streamUrl: 'https://d2e1asnsl7br7b.cloudfront.net/7782/master.m3u8',
    videoType: 'hls',
    badge: '📺 TVmaze Apple'
  },
  {
    id: 'tvmaze-crunchyroll',
    number: 82,
    name: 'TVmaze Web: Crunchyroll Anime Live',
    tagline: 'Sintonizado via TVmaze Dashboard · Anime 24/7',
    logo: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    category: 'originals',
    requiredTier: 'free',
    currentProgram: 'Shingeki no Kyojin & Demon Slayer Simulcast',
    nextProgram: 'Jujutsu Kaisen: Nova Temporada',
    viewers: 31000,
    source: 'tvmaze-web',
    provider: 'TVmaze Web Channels (tvmaze.com)',
    streamUrl: 'https://deluxemusic.akamaized.net/hls/live/2034960/deluxemusic/master.m3u8',
    videoType: 'hls',
    badge: '📺 TVmaze Anime'
  },
  {
    id: 'tvmaze-prime',
    number: 83,
    name: 'TVmaze Web: Prime Video 24/7',
    tagline: 'Amazon Prime Original Series & Blockbusters',
    logo: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&auto=format&fit=crop&q=80',
    category: 'movies',
    requiredTier: 'free',
    currentProgram: 'The Boys & Fallout: Maratona Especial',
    nextProgram: 'Os Anéis do Poder: Terra-Média em 4K',
    viewers: 27800,
    source: 'tvmaze-web',
    provider: 'TVmaze Web Channels (tvmaze.com)',
    streamUrl: 'https://live-fast-cbsnews.cbsnews.com/out/v1/55b657e4e3e34b97a0ae7dd453b0a790/master.m3u8',
    videoType: 'hls',
    badge: '📺 TVmaze Prime'
  },
  {
    id: 'tvmaze-hbomax',
    number: 84,
    name: 'TVmaze Web: HBO Max Prestige',
    tagline: 'As Maiores Séries Dramáticas da Televisão Mundial',
    logo: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
    category: 'movies',
    requiredTier: 'free',
    currentProgram: 'House of the Dragon: A Dança dos Dragões',
    nextProgram: 'The Last of Us: A Travessia de Joel e Ellie',
    viewers: 33400,
    source: 'tvmaze-web',
    provider: 'TVmaze Web Channels (tvmaze.com)',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    videoType: 'hls',
    badge: '📺 TVmaze Max'
  },
  {
    id: 'tvmaze-disney',
    number: 85,
    name: 'TVmaze Web: Disney+ Star Wars & Marvel',
    tagline: 'O Universo de Star Wars, Marvel Studios e Pixar 24h',
    logo: 'https://images.unsplash.com/photo-1566140967404-b8b393279a2a?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80',
    category: 'kids',
    requiredTier: 'free',
    currentProgram: 'The Mandalorian & Grogu: Emissões Especiais',
    nextProgram: 'Loki: As Linhas Temporais do Multiverso',
    viewers: 22700,
    source: 'tvmaze-web',
    provider: 'TVmaze Web Channels (tvmaze.com)',
    streamUrl: 'https://d2e1asnsl7br7b.cloudfront.net/7782/master.m3u8',
    videoType: 'hls',
    badge: '📺 TVmaze Disney'
  },
  {
    id: 'tvmaze-paramount',
    number: 86,
    name: 'TVmaze Web: Paramount+ Action',
    tagline: 'Yellowstone, Star Trek, Tulsa King e Ação Ininterrupta',
    logo: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&auto=format&fit=crop&q=80',
    category: 'movies',
    requiredTier: 'free',
    currentProgram: 'Yellowstone: A Batalha pelo Rancho Dutton',
    nextProgram: 'Star Trek: Strange New Worlds',
    viewers: 17600,
    source: 'tvmaze-web',
    provider: 'TVmaze Web Channels (tvmaze.com)',
    streamUrl: 'https://cph-p2p-msl.akamaized.net/hls/live/200034/test/master.m3u8',
    videoType: 'hls',
    badge: '📺 TVmaze Paramount'
  },
  {
    id: 'tvmaze-plutotv',
    number: 87,
    name: 'TVmaze Web: Pluto TV Crime & Mystery',
    tagline: 'CSI, Forensic Files, Mistérios Não Resolvidos 24h',
    logo: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80',
    category: 'movies',
    requiredTier: 'free',
    currentProgram: 'Investigação Criminal: Casos Famosos',
    nextProgram: 'Perícia Forense Internacional',
    viewers: 16100,
    source: 'tvmaze-web',
    provider: 'TVmaze Web Channels (tvmaze.com)',
    streamUrl: 'https://live-fast-cbsnews.cbsnews.com/out/v1/55b657e4e3e34b97a0ae7dd453b0a790/master.m3u8',
    videoType: 'hls',
    badge: '📺 TVmaze Pluto'
  }
];

class ChannelTunerService {
  private static instance: ChannelTunerService;
  private listeners: Array<() => void> = [];

  static getInstance(): ChannelTunerService {
    if (!ChannelTunerService.instance) {
      ChannelTunerService.instance = new ChannelTunerService();
    }
    return ChannelTunerService.instance;
  }

  subscribe(callback: () => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notify(): void {
    this.listeners.forEach(fn => {
      try {
        fn();
      } catch (e) {
        console.error(e);
      }
    });
  }

  /**
   * Get all tuned channels from storage or initialize with rich defaults
   * Guarantees newly added presets from OMDb, TVmaze and @genesiswine are always included!
   */
  getTunedChannels(): Channel[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_TUNED_CHANNELS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with DEFAULT_TUNED_CHANNELS so any new channels from OMDb, TVmaze, and @genesiswine
          // are automatically included even if the user had an older storage state!
          const existingIds = new Set(parsed.map((c: Channel) => c.id));
          const missingDefaults = DEFAULT_TUNED_CHANNELS.filter(d => !existingIds.has(d.id));
          if (missingDefaults.length > 0) {
            const combined = [...parsed, ...missingDefaults];
            this.saveTunedChannels(combined);
            return combined;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load tuned channels from storage', e);
    }
    // Return rich default tuned channels if none saved
    return [...DEFAULT_TUNED_CHANNELS];
  }

  /**
   * Tunes all 30 preset channels from OMDb, TVmaze, and TMDb @genesiswine in 1 click
   */
  tuneAllPresetSources(): Channel[] {
    const current = this.getTunedChannels();
    const existingIds = new Set(current.map(c => c.id));
    const missing = DEFAULT_TUNED_CHANNELS.filter(d => !existingIds.has(d.id));
    const merged = [...current, ...missing];
    this.saveTunedChannels(merged);
    return merged;
  }

  private saveTunedChannels(channels: Channel[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_TUNED_CHANNELS, JSON.stringify(channels));
      this.notify();
    } catch (e) {
      console.warn('Failed to save tuned channels', e);
    }
  }

  /**
   * Adds or updates a tuned channel
   */
  tuneChannel(channel: Channel): Channel {
    const list = this.getTunedChannels();
    const existingIndex = list.findIndex(c => c.id === channel.id);

    let assignedChannel: Channel;
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...channel };
      assignedChannel = list[existingIndex];
    } else {
      // Pick next available channel number starting from 60
      const nextNumber = channel.number && channel.number > 0
        ? channel.number
        : Math.max(60, ...(list.map(c => c.number || 0))) + 1;
      assignedChannel = { ...channel, number: nextNumber };
      list.unshift(assignedChannel);
    }

    this.saveTunedChannels(list);
    return assignedChannel;
  }

  /**
   * Tune from OMDb Search Item or Detail
   */
  tuneFromOmdb(omdbItem: OmdbMovieDetail | OmdbSearchResultItem): Channel {
    const list = this.getTunedChannels();
    const nextNumber = Math.max(70, ...(list.map(c => c.number || 0))) + 1;
    const channel = omdbService.convertOmdbToChannel(omdbItem, nextNumber);
    return this.tuneChannel(channel);
  }

  /**
   * Tune from TMDb movie (specifically for user @genesiswine)
   */
  tuneFromTmdbGenesiswine(movie: TmdbMovie): Channel {
    const list = this.getTunedChannels();
    const nextNumber = Math.max(60, ...(list.map(c => c.number || 0))) + 1;
    const poster = movie.poster_path
      ? `${TMDB_IMAGE_BASE_W500}${movie.poster_path}`
      : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80';
    const backdrop = movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
      : poster;

    const streamIndex = Math.abs(movie.id) % RELIABLE_FEEDS.length;

    const channel: Channel = {
      id: `genesiswine-${movie.id}`,
      number: nextNumber,
      name: `TMDb @genesiswine: ${movie.title}`,
      tagline: `Curadoria @genesiswine · TMDb ⭐ ${movie.vote_average.toFixed(1)}/10`,
      logo: poster,
      coverImage: backdrop,
      category: 'movies',
      requiredTier: 'free',
      currentProgram: movie.title,
      nextProgram: `Sinopse: ${movie.overview.substring(0, 85)}...`,
      viewers: 15000 + Math.floor(Math.random() * 12000),
      source: 'tmdb-genesiswine',
      provider: 'TMDb @genesiswine (themoviedb.org/u/genesiswine)',
      streamUrl: RELIABLE_FEEDS[streamIndex],
      videoType: 'hls',
      badge: '🍷 @genesiswine'
    };

    return this.tuneChannel(channel);
  }

  /**
   * Remove a tuned channel
   */
  removeTunedChannel(channelId: string): void {
    const list = this.getTunedChannels().filter(c => c.id !== channelId);
    this.saveTunedChannels(list);
  }

  /**
   * Restore all default pre-tuned channels
   */
  restoreDefaultPresets(): Channel[] {
    this.saveTunedChannels([...DEFAULT_TUNED_CHANNELS]);
    return [...DEFAULT_TUNED_CHANNELS];
  }
}

export const channelTunerService = ChannelTunerService.getInstance();
