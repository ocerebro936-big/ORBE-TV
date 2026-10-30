import React, { useState, useEffect, useMemo } from 'react';
import {
  Film,
  Heart,
  Play,
  Star,
  Sparkles,
  Search,
  ExternalLink,
  RefreshCw,
  Key,
  ShieldCheck,
  Check,
  Clock,
  Info,
  X,
  Compass,
  Radio,
  ArrowLeft,
  Tv,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  Share2
} from 'lucide-react';
import { TmdbMovie, TmdbAccountConfig } from '../../types/tmdb';
import {
  INITIAL_TMDB_FAVORITE_MOVIES,
  TMDB_FAVORITE_ENDPOINT_TEMPLATE,
  TMDB_IMAGE_BASE_W500,
  TMDB_IMAGE_BASE_W1280
} from '../../data/tmdb-movies-data';
import { tmdbService } from '../../services/tmdb-service';
import { channelTunerService } from '../../services/channel-tuner-service';
import { Channel } from '../../types/content';

interface TmdbMoviesHubProps {
  onWatchInPlayer?: (movie: TmdbMovie) => void;
  onBackToPortal?: () => void;
  onOpenIptv?: () => void;
  onOpenBroadcastAtlas?: () => void;
  onOpenTvmaze?: () => void;
}

export const TmdbMoviesHub: React.FC<TmdbMoviesHubProps> = ({
  onWatchInPlayer,
  onBackToPortal,
  onOpenIptv,
  onOpenBroadcastAtlas,
  onOpenTvmaze
}) => {
  const [config, setConfig] = useState<TmdbAccountConfig>(() => tmdbService.getStoredConfig());
  const [movies, setMovies] = useState<TmdbMovie[]>(() => tmdbService.getLocalFavorites());
  const [selectedMovie, setSelectedMovie] = useState<TmdbMovie>(() => tmdbService.getLocalFavorites()[0] || INITIAL_TMDB_FAVORITE_MOVIES[0]);
  const [trailerMovie, setTrailerMovie] = useState<TmdbMovie | null>(null);
  const [detailModalMovie, setDetailModalMovie] = useState<TmdbMovie | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'demo'>('demo');
  const [statusMessage, setStatusMessage] = useState<string>('Catálogo de favoritos TMDb sincronizado em cache de alta fidelidade.');
  
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [tempAccountId, setTempAccountId] = useState<string>(config.accountId);
  const [tempApiToken, setTempApiToken] = useState<string>(config.apiToken);
  const [tempLanguage, setTempLanguage] = useState<string>(config.language || 'pt-PT');
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'recent' | 'popularity'>('rating');

  // Load and sync movies on mount or config change
  const loadFavorites = async (cfg: TmdbAccountConfig) => {
    setIsLoading(true);
    setSyncStatus('syncing');
    try {
      const result = await tmdbService.fetchAccountFavoriteMovies(
        cfg.accountId,
        cfg.apiToken,
        1,
        cfg.language
      );
      setMovies(result.response.results);
      if (result.response.results.length > 0) {
        setSelectedMovie(result.response.results[0]);
      }
      if (result.source === 'api') {
        setSyncStatus('success');
        setStatusMessage(`Sincronizado com sucesso via TMDb API v3 (${result.response.results.length} filmes favoritos).`);
      } else {
        setSyncStatus('demo');
        setStatusMessage(`Modo Curadoria Ativo (${result.response.results.length} filmes verificados da TMDb).`);
      }
    } catch (e) {
      console.error(e);
      setSyncStatus('demo');
      setStatusMessage('Falha ao conectar à API externa TMDb. Exibindo dados locais seguros.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites(config);
  }, []);

  const handleSaveConfig = () => {
    const updated: TmdbAccountConfig = {
      accountId: tempAccountId.trim() || '21589304',
      apiToken: tempApiToken.trim(),
      language: tempLanguage,
      isConnected: Boolean(tempApiToken.trim())
    };
    setConfig(updated);
    tmdbService.saveConfig(updated);
    setIsConfigModalOpen(false);
    loadFavorites(updated);
  };

  const handleToggleFavorite = async (e: React.MouseEvent, movie: TmdbMovie) => {
    e.stopPropagation();
    const newStatus = !movie.is_favorite;
    
    // Update local state immediately
    setMovies(prev =>
      newStatus
        ? prev.map(m => m.id === movie.id ? { ...m, is_favorite: true } : m)
        : prev.filter(m => m.id !== movie.id)
    );

    if (selectedMovie.id === movie.id) {
      setSelectedMovie(prev => ({ ...prev, is_favorite: newStatus }));
    }

    await tmdbService.toggleFavorite(config.accountId, config.apiToken, movie.id, newStatus);
  };

  // Filtered and sorted movies
  const filteredMovies = useMemo(() => {
    return movies
      .filter(m => {
        const matchesQuery = !searchQuery.trim() ||
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.original_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.overview.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesGenre = genreFilter === 'all' ||
          (m.genres && m.genres.some(g => g.toLowerCase() === genreFilter.toLowerCase()));

        return matchesQuery && matchesGenre;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.vote_average - a.vote_average;
        if (sortBy === 'recent') return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
        return b.popularity - a.popularity;
      });
  }, [movies, searchQuery, genreFilter, sortBy]);

  const resolvedEndpointUrl = `https://api.themoviedb.org/3/account/${config.accountId || '{account_id}'}/favorite/movies?language=${config.language || 'pt-PT'}&page=1`;

  const genresList = [
    { id: 'all', label: 'Todos os Géneros' },
    { id: 'Ficção Científica', label: '🚀 Ficção Científica' },
    { id: 'Ação', label: '💥 Ação' },
    { id: 'Aventura', label: '🧭 Aventura' },
    { id: 'Drama', label: '🎭 Drama' },
    { id: 'Crime', label: '🕵️ Crime' },
    { id: 'Animação', label: '🎨 Animação' },
    { id: 'Família', label: '👨‍👩‍👧 Família' },
    { id: 'Comédia', label: '🍿 Comédia' }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      {/* TOP NOTIFICATION / ENDPOINT BAR */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950/70 via-indigo-950/50 to-slate-900 border border-blue-500/30 p-5 md:p-6 shadow-2xl backdrop-blur-xl">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold tracking-wide">
                <Film className="w-3.5 h-3.5 text-blue-400" />
                TMDb API v3 Endpoint
              </span>
              <a
                href="https://www.themoviedb.org/u/genesiswine"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-purple-500/25 hover:bg-purple-500/35 text-purple-300 px-3 py-1 rounded-full border border-purple-500/40 transition-colors shadow-sm"
              >
                <span>🍷 Perfil TMDb @genesiswine</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
              <a
                href={resolvedEndpointUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-mono bg-slate-900/90 hover:bg-slate-800 text-cyan-300 px-3 py-1 rounded-full border border-cyan-500/30 transition-colors truncate max-w-xs md:max-w-md"
                title={resolvedEndpointUrl}
              >
                <span>/3/account/{config.accountId}/favorite/movies</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                syncStatus === 'success'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              }`}>
                {syncStatus === 'success' ? '● Conectado à API TMDb' : '● Curadoria @genesiswine Ativa'}
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Filmes Favoritos da Conta TMDb @genesiswine</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-600/30 text-purple-300 border border-purple-500/40">
                The Movie Database
              </span>
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Integração direta com o perfil e endpoint oficial <code className="text-cyan-300 bg-slate-900/80 px-1 py-0.5 rounded">themoviedb.org/u/genesiswine</code>. 
              Sincronize a sua conta real da TMDb, sintonize filmes diretamente na grelha UBlue TV e assista com transmissão em alta fidelidade.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
            >
              <Key className="w-4 h-4 text-white" />
              <span>Configurar Conta TMDb</span>
            </button>
            <button
              onClick={() => loadFavorites(config)}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
              title="Recarregar favoritos da TMDb"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
            </button>
            {onOpenTvmaze && (
              <button
                onClick={onOpenTvmaze}
                className="px-3 py-2 rounded-xl bg-teal-950/60 hover:bg-teal-900/60 text-teal-300 border border-teal-500/30 text-xs transition-colors flex items-center gap-1 cursor-pointer"
                title="Explorar TVmaze Web Channels"
              >
                <Tv className="w-3.5 h-3.5 text-teal-400" />
                <span>TVmaze Web</span>
              </button>
            )}
            {onBackToPortal && (
              <button
                onClick={onBackToPortal}
                className="px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Portal</span>
              </button>
            )}
          </div>
        </div>

        {/* Status text */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>{statusMessage}</span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span>Account ID: <strong className="text-white font-mono">{config.accountId}</strong></span>
            <span>•</span>
            <span>Idioma: <strong className="text-white">{config.language}</strong></span>
          </div>
        </div>
      </div>

      {/* FEATURED MOVIE HERO (CINEMATIC BACKDROP) */}
      {selectedMovie && (
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 group min-h-[420px] flex items-end">
          {/* Backdrop Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-100 group-hover:scale-105"
            style={{
              backgroundImage: `url(${selectedMovie.backdrop_path ? TMDB_IMAGE_BASE_W1280 + selectedMovie.backdrop_path : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80'})`
            }}
          />
          {/* Dark Cinematic Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />

          {/* Hero Content */}
          <div className="relative z-10 p-6 md:p-10 max-w-4xl space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-blue-600/90 text-white text-xs font-bold tracking-wide shadow-md">
                ⭐ {selectedMovie.vote_average.toFixed(1)} TMDb Score
              </span>
              <span className="text-xs text-slate-300 font-medium px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700">
                {new Date(selectedMovie.release_date).getFullYear()}
              </span>
              {selectedMovie.runtime && (
                <span className="text-xs text-slate-300 font-medium px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {selectedMovie.runtime} min
                </span>
              )}
              {selectedMovie.director && (
                <span className="text-xs text-slate-300 font-medium px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700">
                  Dir: {selectedMovie.director}
                </span>
              )}
              {selectedMovie.genres?.map(g => (
                <span key={g} className="text-xs text-cyan-300 font-medium px-2.5 py-1 rounded-full bg-cyan-950/50 border border-cyan-800/50">
                  {g}
                </span>
              ))}
            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {selectedMovie.title}
            </h2>

            {selectedMovie.original_title !== selectedMovie.title && (
              <p className="text-xs md:text-sm text-slate-400 italic">
                Título Original: {selectedMovie.original_title}
              </p>
            )}

            <p className="text-sm md:text-base text-slate-300 line-clamp-3 md:line-clamp-4 leading-relaxed max-w-2xl">
              {selectedMovie.overview}
            </p>

            <div className="flex items-center gap-3 pt-2 flex-wrap">
              {selectedMovie.trailer_key && (
                <button
                  onClick={() => setTrailerMovie(selectedMovie)}
                  className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-xl shadow-blue-600/30 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Ver Trailer Oficial</span>
                </button>
              )}
              
              {onWatchInPlayer && (
                <button
                  onClick={() => onWatchInPlayer(selectedMovie)}
                  className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-xl shadow-cyan-500/30 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Tv className="w-4 h-4" />
                  <span>Assistir no UBlue Cinema</span>
                </button>
              )}

              <button
                onClick={() => {
                  const chan = channelTunerService.tuneFromTmdbGenesiswine(selectedMovie);
                  if (onWatchInPlayer) onWatchInPlayer(selectedMovie);
                }}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm transition-all shadow-xl shadow-purple-600/30 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                title="Sintonizar como canal permanente na grelha UBlue TV"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Sintonizar na Grelha UBlue</span>
              </button>

              <button
                onClick={(e) => handleToggleFavorite(e, selectedMovie)}
                className={`px-4 py-3 rounded-2xl text-sm font-semibold transition-all border flex items-center gap-2 cursor-pointer ${
                  selectedMovie.is_favorite
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                    : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <Heart className={`w-4 h-4 ${selectedMovie.is_favorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{selectedMovie.is_favorite ? 'Nos Seus Favoritos' : 'Adicionar aos Favoritos'}</span>
              </button>

              <button
                onClick={() => setDetailModalMovie(selectedMovie)}
                className="px-4 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Info className="w-4 h-4" />
                <span>Sinopse Completa & Ficha</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Catálogo de Filmes Favoritos ({filteredMovies.length})</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                TMDb v3
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Filtre por categoria, faça pesquisas instantâneas ou altere a ordenação por avaliação.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Pesquisar por título ou resumo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-800 focus:border-blue-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="rating">Melhor Avaliação (Score)</option>
              <option value="recent">Mais Recentes</option>
              <option value="popularity">Mais Populares</option>
            </select>
          </div>
        </div>

        {/* Genre Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {genresList.map(g => (
            <button
              key={g.id}
              onClick={() => setGenreFilter(g.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                genreFilter === g.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* MOVIES GRID */}
      {filteredMovies.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3">
          <Film className="w-12 h-12 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-white">Nenhum filme favorito encontrado</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Não encontramos nenhum filme com os filtros ou pesquisa selecionada. Tente limpar os filtros ou conectar a sua conta TMDb.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setGenreFilter('all'); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMovies.map(movie => {
            const isCurrentSelected = selectedMovie?.id === movie.id;
            return (
              <div
                key={movie.id}
                onClick={() => setSelectedMovie(movie)}
                className={`group relative rounded-2xl overflow-hidden bg-slate-900 border transition-all duration-300 cursor-pointer flex flex-col ${
                  isCurrentSelected
                    ? 'border-blue-500 shadow-xl shadow-blue-500/20 ring-1 ring-blue-500'
                    : 'border-slate-800/80 hover:border-slate-700 hover:shadow-lg'
                }`}
              >
                {/* Poster Container */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
                  <img
                    src={movie.poster_path ? `${TMDB_IMAGE_BASE_W500}${movie.poster_path}` : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80'}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Rating Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-md border border-slate-700 text-[11px] font-bold text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{movie.vote_average.toFixed(1)}</span>
                  </div>

                  {/* Favorite Toggle Button */}
                  <button
                    onClick={(e) => handleToggleFavorite(e, movie)}
                    className="absolute top-2.5 right-2.5 p-2 rounded-full bg-slate-950/85 backdrop-blur-md hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer group/fav"
                    title={movie.is_favorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                  >
                    <Heart className={`w-3.5 h-3.5 transition-colors ${
                      movie.is_favorite ? 'fill-rose-500 text-rose-500' : 'text-slate-300 group-hover/fav:text-white'
                    }`} />
                  </button>

                  {/* Quick Action Overlay on hover */}
                  <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {movie.trailer_key && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTrailerMovie(movie);
                        }}
                        className="flex-1 py-1.5 px-2 bg-blue-600/90 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 backdrop-blur-md shadow-md cursor-pointer"
                      >
                        <Play className="w-2.5 h-2.5 fill-white" />
                        <span>Trailer</span>
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailModalMovie(movie);
                      }}
                      className="p-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-[10px] backdrop-blur-md border border-slate-700 cursor-pointer"
                      title="Ver detalhes"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Movie Info */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-1">
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1" title={movie.title}>
                      {movie.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {movie.genres?.join(', ') || 'Cinema'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                    <span>{movie.vote_count.toLocaleString()} votos</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CROSS-HUB NAVIGATION FOOTER */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-blue-400" />
          <span>Integrado com UBlue TV Cinema & The Movie Database (TMDb) API.</span>
        </div>
        <div className="flex items-center gap-3">
          {onOpenIptv && (
            <button
              onClick={onOpenIptv}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>IPTV Global Hub</span>
            </button>
          )}
          {onOpenBroadcastAtlas && (
            <button
              onClick={onOpenBroadcastAtlas}
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Broadcast Atlas</span>
            </button>
          )}
        </div>
      </div>

      {/* MODAL: CONFIGURAR CONTA TMDB */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-blue-500/30 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Configurar Conta TMDb</h3>
                  <p className="text-xs text-slate-400">Endpoint /3/account/&#123;account_id&#125;/favorite/movies</p>
                </div>
              </div>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Account ID (ID da Conta TMDb)
                </label>
                <input
                  type="text"
                  value={tempAccountId}
                  onChange={(e) => setTempAccountId(e.target.value)}
                  placeholder="Ex: 21589304 ou o seu ID de utilizador"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-xs text-white font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  O identificador numérico da sua conta obtido em themoviedb.org/settings/account.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  TMDb API Read Access Token (v4) ou API Key (v3)
                </label>
                <input
                  type="password"
                  value={tempApiToken}
                  onChange={(e) => setTempApiToken(e.target.value)}
                  placeholder="Bearer token (eyJ...) ou API Key (v3)"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-xs text-white font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Obtenha gratuitamente em themoviedb.org/settings/api. Se não fornecer, usaremos o modo de demonstração com os maiores filmes favoritos já sincronizados.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Idioma dos Títulos & Sinopses
                </label>
                <select
                  value={tempLanguage}
                  onChange={(e) => setTempLanguage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-xs text-white"
                >
                  <option value="pt-PT">Português (Moçambique & Portugal) - pt-PT</option>
                  <option value="pt-BR">Português (Brasil) - pt-BR</option>
                  <option value="en-US">Inglês - en-US</option>
                  <option value="es-ES">Espanhol - es-ES</option>
                </select>
              </div>

              {/* Endpoint Preview */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Preview do Pedido HTTP:</span>
                <p className="font-mono text-[11px] text-cyan-400 break-all">
                  GET https://api.themoviedb.org/3/account/{tempAccountId || '{account_id}'}/favorite/movies?language={tempLanguage}&page=1
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setTempAccountId('21589304');
                  setTempApiToken('');
                  setTempLanguage('pt-PT');
                }}
                className="px-3 py-2 text-xs text-slate-400 hover:text-white"
              >
                Restaurar Padrão
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsConfigModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveConfig}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar & Sincronizar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TRAILER PLAYER */}
      {trailerMovie && trailerMovie.trailer_key && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-blue-500/30 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-bold text-white">
                  Trailer Oficial: {trailerMovie.title}
                </span>
              </div>
              <button
                onClick={() => setTrailerMovie(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${trailerMovie.trailer_key}?autoplay=1&rel=0`}
                title={`Trailer - ${trailerMovie.title}`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-4 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
              <span>{trailerMovie.overview.substring(0, 120)}...</span>
              {onWatchInPlayer && (
                <button
                  onClick={() => {
                    const m = trailerMovie;
                    setTrailerMovie(null);
                    onWatchInPlayer(m);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shrink-0 ml-4 cursor-pointer"
                >
                  Assistir no UBlue Cinema
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DETALHES COMPLETOS DO FILME */}
      {detailModalMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
                  Ficha Técnica TMDb
                </span>
                <h3 className="text-2xl font-extrabold text-white">{detailModalMovie.title}</h3>
                <p className="text-xs text-slate-400 italic">Original: {detailModalMovie.original_title}</p>
              </div>
              <button
                onClick={() => setDetailModalMovie(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-4 items-start">
              <img
                src={detailModalMovie.poster_path ? `${TMDB_IMAGE_BASE_W500}${detailModalMovie.poster_path}` : ''}
                alt={detailModalMovie.title}
                className="w-32 rounded-xl shadow-lg border border-slate-800 shrink-0 object-cover aspect-[2/3]"
              />
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    ⭐ {detailModalMovie.vote_average.toFixed(1)} / 10
                  </span>
                  <span>({detailModalMovie.vote_count.toLocaleString()} avaliações)</span>
                  <span>•</span>
                  <span>{new Date(detailModalMovie.release_date).toLocaleDateString()}</span>
                </div>
                {detailModalMovie.director && (
                  <p><strong className="text-white">Realizador / Diretor:</strong> {detailModalMovie.director}</p>
                )}
                <p><strong className="text-white">Géneros:</strong> {detailModalMovie.genres?.join(', ') || 'N/A'}</p>
                <p><strong className="text-white">Popularidade TMDb:</strong> {detailModalMovie.popularity}</p>
                <p><strong className="text-white">ID TMDb:</strong> #{detailModalMovie.id}</p>
              </div>
            </div>

            <div className="space-y-1">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">Sinopse</h5>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                {detailModalMovie.overview}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              {detailModalMovie.trailer_key && (
                <button
                  onClick={() => {
                    const m = detailModalMovie;
                    setDetailModalMovie(null);
                    setTrailerMovie(m);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Ver Trailer</span>
                </button>
              )}
              {onWatchInPlayer && (
                <button
                  onClick={() => {
                    const m = detailModalMovie;
                    setDetailModalMovie(null);
                    onWatchInPlayer(m);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>Assistir no UBlue Cinema</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
