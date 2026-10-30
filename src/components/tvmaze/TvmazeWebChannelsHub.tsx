import React, { useState, useEffect, useMemo } from 'react';
import {
  Tv,
  Globe,
  ExternalLink,
  Play,
  Search,
  Sparkles,
  Calendar,
  Layers,
  Clock,
  Star,
  CheckCircle2,
  RefreshCw,
  Terminal,
  ShieldCheck,
  Zap,
  Info,
  X,
  Radio,
  ArrowRight,
  SlidersHorizontal,
  ChevronRight,
  Filter
} from 'lucide-react';
import {
  TvmazeWebChannel,
  TvmazeEpisode,
  TvmazeShow
} from '../../types/tvmaze';
import {
  TVMAZE_WEBCHANNELS_URL,
  TVMAZE_CURATED_WEBCHANNELS
} from '../../data/tvmaze-webchannels-data';
import { tvmazeService } from '../../services/tvmaze-service';
import { Channel } from '../../types/content';

interface TvmazeWebChannelsHubProps {
  onWatchInPlayer?: (channel: Channel) => void;
  onBackToPortal?: () => void;
  onOpenIptv?: () => void;
  onOpenBroadcastAtlas?: () => void;
  onOpenTmdb?: () => void;
}

type HubTab = 'directory' | 'schedule' | 'search' | 'api';

export const TvmazeWebChannelsHub: React.FC<TvmazeWebChannelsHubProps> = ({
  onWatchInPlayer,
  onBackToPortal,
  onOpenIptv,
  onOpenBroadcastAtlas,
  onOpenTmdb
}) => {
  const [activeTab, setActiveTab] = useState<HubTab>('directory');
  
  // Channels directory state
  const [channelCategory, setChannelCategory] = useState<string>('all');
  const [channelSearch, setChannelSearch] = useState<string>('');
  const [selectedChannel, setSelectedChannel] = useState<TvmazeWebChannel | null>(null);

  // Web schedule state
  const [scheduleCountry, setScheduleCountry] = useState<string>('all');
  const [scheduleDate, setScheduleDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [scheduleEpisodes, setScheduleEpisodes] = useState<TvmazeEpisode[]>([]);
  const [isScheduleLoading, setIsScheduleLoading] = useState<boolean>(true);
  const [isLiveSchedule, setIsLiveSchedule] = useState<boolean>(false);
  const [scheduleSearch, setScheduleSearch] = useState<string>('');
  const [selectedEpisode, setSelectedEpisode] = useState<TvmazeEpisode | null>(null);

  // Show search state
  const [showSearchQuery, setShowSearchQuery] = useState<string>('Stranger Things');
  const [searchedShows, setSearchedShows] = useState<TvmazeShow[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
  const [selectedShow, setSelectedShow] = useState<TvmazeShow | null>(null);

  // API Console state
  const [apiEndpoint, setApiEndpoint] = useState<string>('https://api.tvmaze.com/schedule/web');
  const [apiResponse, setApiResponse] = useState<string>('Clique em "Executar Pedido" para testar em tempo real.');
  const [apiStatus, setApiStatus] = useState<number | null>(null);
  const [apiLatency, setApiLatency] = useState<number | null>(null);
  const [isApiLoading, setIsApiLoading] = useState<boolean>(false);

  // Fetch web schedule
  const loadSchedule = async (countryValue: string, dateValue: string) => {
    setIsScheduleLoading(true);
    try {
      // In TVmaze API:
      // country === 'all' -> no country param (both global and local)
      // country === 'global' -> country="" (only global)
      // country === 'US'/'GB'/'BR' -> country="US"
      const apiCountry = countryValue === 'all' ? undefined : (countryValue === 'global' ? '' : countryValue);
      const res = await tvmazeService.getWebSchedule(apiCountry, dateValue);
      setScheduleEpisodes(res.episodes);
      setIsLiveSchedule(res.isLive);
    } catch {
      // Handled in service
    } finally {
      setIsScheduleLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule(scheduleCountry, scheduleDate);
  }, [scheduleCountry, scheduleDate]);

  // Initial show search
  useEffect(() => {
    const performSearch = async () => {
      setIsSearchLoading(true);
      try {
        const results = await tvmazeService.searchShows(showSearchQuery);
        setSearchedShows(results);
      } finally {
        setIsSearchLoading(false);
      }
    };
    performSearch();
  }, [showSearchQuery]);

  // Filter channels
  const filteredChannels = useMemo(() => {
    return TVMAZE_CURATED_WEBCHANNELS.filter((ch) => {
      const matchesCategory = channelCategory === 'all' || ch.category === channelCategory;
      const q = channelSearch.toLowerCase();
      const matchesSearch = !q ||
        ch.name.toLowerCase().includes(q) ||
        (ch.description && ch.description.toLowerCase().includes(q)) ||
        (ch.flagshipShows && ch.flagshipShows.some(s => s.toLowerCase().includes(q)));
      return matchesCategory && matchesSearch;
    });
  }, [channelCategory, channelSearch]);

  // Filter episodes
  const filteredEpisodes = useMemo(() => {
    if (!scheduleSearch.trim()) return scheduleEpisodes;
    const q = scheduleSearch.toLowerCase();
    return scheduleEpisodes.filter((ep) => {
      const showName = ep._embedded?.show?.name?.toLowerCase() || '';
      const epName = ep.name?.toLowerCase() || '';
      const channelName = ep._embedded?.show?.webChannel?.name?.toLowerCase() || '';
      return showName.includes(q) || epName.includes(q) || channelName.includes(q);
    });
  }, [scheduleEpisodes, scheduleSearch]);

  // Convert episode or webchannel to a playable UBlue Channel
  const handleWatchEpisode = (ep: TvmazeEpisode) => {
    if (!onWatchInPlayer) return;
    const show = ep._embedded?.show;
    const webCh = show?.webChannel;
    const playableChannel: Channel = {
      id: `tvmaze-ep-${ep.id}`,
      number: 800 + (ep.id % 100),
      name: show ? `${show.name} - S${ep.season}E${ep.number || 1}` : ep.name,
      tagline: webCh?.name || 'TVmaze Web Channel',
      logo: ep.image?.medium || show?.image?.medium || 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=600&q=80',
      coverImage: ep.image?.original || ep.image?.medium || show?.image?.original || 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1200&q=80',
      category: 'movies',
      requiredTier: 'free',
      currentProgram: ep.name,
      nextProgram: ep.summary?.replace(/<[^>]+>/g, '').substring(0, 90) || 'Emissão Web',
      viewers: 9400,
      source: 'webchannel',
      provider: webCh?.name || 'TVmaze Web Channels',
      streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      videoType: 'hls',
      badge: 'TVMAZE'
    };
    onWatchInPlayer(playableChannel);
  };

  const handleWatchChannelStream = (ch: TvmazeWebChannel) => {
    if (!onWatchInPlayer) return;
    const playableChannel: Channel = {
      id: `tvmaze-ch-${ch.id}`,
      number: 900 + (ch.id % 100),
      name: `${ch.name} Stream`,
      tagline: `${ch.country ? ch.country.name : 'Global'} · TVmaze Web Channel`,
      logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=600&q=80',
      coverImage: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1200&q=80',
      category: 'movies',
      requiredTier: 'free',
      currentProgram: ch.flagshipShows?.[0] || 'Programação Original',
      nextProgram: ch.description ? ch.description.substring(0, 90) : 'Transmissão Contínua',
      viewers: 12500,
      source: 'webchannel',
      provider: ch.name,
      streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      videoType: 'hls',
      badge: 'TVMAZE'
    };
    onWatchInPlayer(playableChannel);
  };

  // Run API tester
  const handleRunApiTest = async () => {
    setIsApiLoading(true);
    const start = performance.now();
    try {
      const res = await fetch(apiEndpoint);
      const latency = Math.round(performance.now() - start);
      setApiLatency(latency);
      setApiStatus(res.status);
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2).slice(0, 5000));
    } catch (err: any) {
      setApiStatus(0);
      setApiResponse(`Erro na requisição: ${err.message}`);
    } finally {
      setIsApiLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 pb-20">
      {/* Top Breadcrumb & Quick Jump */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          {onBackToPortal && (
            <button
              onClick={onBackToPortal}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-medium cursor-pointer"
            >
              ← Portal UBlue
            </button>
          )}
          <span className="text-slate-600">/</span>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1">
              <Tv className="w-3 h-3" />
              TVmaze.com
            </span>
            <span className="text-slate-300 text-sm font-semibold">Web Channels Directory</span>
          </div>
        </div>

        {/* Ecosystem Jump Buttons */}
        <div className="flex items-center gap-2">
          {onOpenTmdb && (
            <button
              onClick={onOpenTmdb}
              className="px-3 py-1.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 border border-blue-500/30 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              🎬 TMDb Favoritos
            </button>
          )}
          {onOpenBroadcastAtlas && (
            <button
              onClick={onOpenBroadcastAtlas}
              className="px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              📡 Broadcast Atlas
            </button>
          )}
          {onOpenIptv && (
            <button
              onClick={onOpenIptv}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              🌐 IPTV Global
            </button>
          )}
          <a
            href={TVMAZE_WEBCHANNELS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            Abrir tvmaze.com/webchannels
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-br from-teal-950/50 via-slate-900 to-indigo-950/50 p-6 sm:p-10 mb-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-bold tracking-wide uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Diretório Oficial de Web & Streaming Networks
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-mono">
              GET /schedule/web
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              API Aberta (Sem Chave)
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            TVmaze <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-400">Web Channels</span> & Streaming Hub
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
            O catálogo mundial de redes de streaming digital, canais FAST e plataformas OTT conectadas em tempo real ao ecossistema <strong>TVmaze</strong>. Acompanhe estreias de episódios hoje, descubra produções originais e sintonize diretamente no leitor UBlue TV.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2 border-t border-slate-800/80">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5">
              <div className="text-xs text-slate-400 font-medium">Plataformas Catalogadas</div>
              <div className="text-xl sm:text-2xl font-bold text-teal-300 mt-1">24+ Redes</div>
              <div className="text-[11px] text-slate-500">Globais, FAST e Regionais</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5">
              <div className="text-xs text-slate-400 font-medium">Episódios Hoje</div>
              <div className="text-xl sm:text-2xl font-bold text-cyan-300 mt-1">
                {scheduleEpisodes.length > 0 ? `${scheduleEpisodes.length} Airings` : 'Carregando...'}
              </div>
              <div className="text-[11px] text-slate-500">Live Web Schedule</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5">
              <div className="text-xs text-slate-400 font-medium">Status da REST API</div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                200 OK
              </div>
              <div className="text-[11px] text-slate-500">Rate: 20 req / 10s</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5">
              <div className="text-xs text-slate-400 font-medium">Licença de Dados</div>
              <div className="text-xl sm:text-2xl font-bold text-amber-300 mt-1">CC BY-SA 4.0</div>
              <div className="text-[11px] text-slate-500">TVmaze Attribution</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 mb-8 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('directory')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'directory'
              ? 'border-teal-400 text-teal-300 bg-teal-500/10 rounded-t-xl'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          Diretório de Web Channels ({TVMAZE_CURATED_WEBCHANNELS.length})
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'schedule'
              ? 'border-teal-400 text-teal-300 bg-teal-500/10 rounded-t-xl'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Lançamentos Web Hoje ({scheduleEpisodes.length})
        </button>

        <button
          onClick={() => setActiveTab('search')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'search'
              ? 'border-teal-400 text-teal-300 bg-teal-500/10 rounded-t-xl'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Search className="w-4 h-4" />
          Pesquisar Séries em Web Channels
        </button>

        <button
          onClick={() => setActiveTab('api')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'api'
              ? 'border-teal-400 text-teal-300 bg-teal-500/10 rounded-t-xl'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4" />
          Console de API TVmaze
        </button>
      </div>

      {/* TAB 1: DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'giant', label: 'Gigantes do Streaming' },
                { id: 'fast', label: 'Grátis / FAST' },
                { id: 'regional', label: 'Regionais & TV Aberta' },
                { id: 'anime', label: 'Anime & Manga' },
                { id: 'specialty', label: 'Especialidades' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setChannelCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    channelCategory === cat.id
                      ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Pesquisar streaming ou série original..."
                value={channelSearch}
                onChange={(e) => setChannelSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-teal-400 transition-colors"
              />
              {channelSearch && (
                <button
                  onClick={() => setChannelSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Channels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChannels.map((channel) => (
              <div
                key={channel.id}
                className="bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-teal-950/30 group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-2 rounded-xl bg-gradient-to-br ${channel.badgeColor || 'from-slate-700 to-slate-900 text-white'} text-sm font-bold shadow-md flex items-center justify-center`}>
                        {channel.logoBadge || channel.name.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                            {channel.name}
                          </h3>
                          {channel.isGlobal && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                              Global
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          {channel.country ? (
                            <span>{channel.country.name} ({channel.country.code})</span>
                          ) : (
                            <span className="flex items-center gap-1 text-slate-400">
                              <Globe className="w-3 h-3 text-teal-400" /> Multi-País
                            </span>
                          )}
                          <span>•</span>
                          <span className="text-teal-400 font-mono text-[11px]">ID #{channel.id}</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={`https://www.tvmaze.com/webchannels/${channel.id}/${channel.slug || channel.name.toLowerCase()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Abrir no TVmaze"
                      className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                    {channel.description}
                  </p>

                  {/* Flagship Shows */}
                  {channel.flagshipShows && (
                    <div className="mb-4">
                      <div className="text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        Originais em Destaque:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {channel.flagshipShows.slice(0, 4).map((show, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setShowSearchQuery(show);
                              setActiveTab('search');
                            }}
                            className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-teal-950/80 border border-slate-700 hover:border-teal-500/40 text-[11px] text-slate-300 hover:text-teal-300 transition-colors cursor-pointer"
                          >
                            {show}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Features Tag */}
                  {channel.features && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {channel.features.slice(0, 2).map((feat, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800/60 text-slate-400 border border-slate-800">
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-500 font-medium">
                    {channel.subscriberEstimate || 'Catálogo Digital'}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedChannel(channel)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Detalhes
                    </button>
                    {onWatchInPlayer && (
                      <button
                        onClick={() => handleWatchChannelStream(channel)}
                        className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-md shadow-teal-500/20"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        Sintonizar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SCHEDULE */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {/* Country selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-teal-400" /> País:
                </span>
                <select
                  value={scheduleCountry}
                  onChange={(e) => setScheduleCountry(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-teal-400"
                >
                  <option value="all">Todas as Redes (Globais + Locais)</option>
                  <option value="global">Apenas Globais (Netflix, Prime, Apple TV+)</option>
                  <option value="US">Estados Unidos (US - Hulu, Max, Tubi)</option>
                  <option value="GB">Reino Unido (GB - BBC iPlayer, ITVX)</option>
                  <option value="BR">Brasil (BR - Globoplay)</option>
                  <option value="JP">Japão (JP - Animes)</option>
                </select>
              </div>

              {/* Date selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-400" /> Data:
                </span>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-teal-400"
                />
              </div>

              <button
                onClick={() => loadSchedule(scheduleCountry, scheduleDate)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                title="Atualizar Programação"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScheduleLoading ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
            </div>

            {/* Filter search */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filtrar episódios de hoje..."
                value={scheduleSearch}
                onChange={(e) => setScheduleSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-teal-400 transition-colors"
              />
            </div>
          </div>

          {/* Live Status notification */}
          <div className="flex items-center justify-between text-xs px-2 text-slate-400">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isLiveSchedule ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span>
                {isLiveSchedule
                  ? `Sincronização ao vivo com https://api.tvmaze.com/schedule/web (${scheduleEpisodes.length} episódios encontrados)`
                  : 'Modo de contingência / cache de alta velocidade ativado.'}
              </span>
            </div>
            <span>Data: {scheduleDate}</span>
          </div>

          {/* Episode Grid */}
          {isScheduleLoading ? (
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <RefreshCw className="w-8 h-8 text-teal-400 animate-spin mb-3" />
              <p className="text-slate-300 text-sm font-medium">Buscando programação digital no TVmaze...</p>
              <p className="text-slate-500 text-xs mt-1">Carregando catálogo de transmissões e streaming para {scheduleDate}</p>
            </div>
          ) : filteredEpisodes.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
              <Tv className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">Nenhum episódio encontrado</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                Não há episódios cadastrados para esta data ou filtro de país. Tente selecionar &quot;Todas as Redes&quot; ou verificar a data de hoje.
              </p>
              <button
                onClick={() => {
                  setScheduleCountry('all');
                  setScheduleSearch('');
                }}
                className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs"
              >
                Limpar Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredEpisodes.map((ep) => {
                const show = ep._embedded?.show;
                const channel = show?.webChannel;
                const imageUrl = ep.image?.medium || show?.image?.medium || 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=600&q=80';
                
                return (
                  <div
                    key={ep.id}
                    className="bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/40 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 group"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={ep.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />

                        {/* Badges */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          {channel && (
                            <span className="px-2 py-0.5 rounded-md bg-teal-950/80 backdrop-blur-md border border-teal-500/40 text-[10px] font-bold text-teal-300">
                              {channel.name}
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-white">
                            S{ep.season.toString().padStart(2, '0')}E{(ep.number || 1).toString().padStart(2, '0')}
                          </span>
                        </div>

                        {ep.rating?.average && (
                          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 font-bold text-[10px] flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-current" />
                            {ep.rating.average}
                          </div>
                        )}

                        {/* Airtime bottom badge */}
                        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-slate-300">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-teal-400" />
                            {ep.airtime || 'Hoje'} {ep.runtime ? `(${ep.runtime} min)` : ''}
                          </span>
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-4">
                        <div className="text-[11px] text-teal-400 font-semibold tracking-wide uppercase truncate mb-1">
                          {show?.name || 'Série Web'}
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-1 mb-2">
                          {ep.name}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                          {ep.summary?.replace(/<[^>]+>/g, '') || show?.summary?.replace(/<[^>]+>/g, '') || 'Novo episódio lançado na programação web oficial.'}
                        </p>

                        {/* Genres */}
                        {show?.genres && show.genres.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {show.genres.slice(0, 2).map((g, idx) => (
                              <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                                {g}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Buttons */}
                    <div className="p-4 pt-0 border-t border-slate-800/80 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedEpisode(ep)}
                        className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium text-center transition-colors cursor-pointer"
                      >
                        Sinopse
                      </button>
                      <button
                        onClick={() => handleWatchEpisode(ep)}
                        className="flex-1 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer shadow-md shadow-teal-500/20"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        Assistir
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SHOW SEARCH */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          {/* Search bar */}
          <div className="bg-slate-900/70 p-6 rounded-2xl border border-slate-800 max-w-3xl mx-auto">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Search className="w-4 h-4 text-teal-400" />
              Pesquisar em Qual Plataforma Web a Série Está Disponível
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Consulte qualquer show para descobrir a sua Web Channel de origem, sinopse, classificação e status de produção.
            </p>

            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ex: Stranger Things, The Boys, Ted Lasso, House of the Dragon..."
                value={showSearchQuery}
                onChange={(e) => setShowSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-teal-400 transition-colors"
              />
            </div>

            {/* Quick tags */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-500">Exemplos rápidos:</span>
              {['Stranger Things', 'Fallout', 'The Bear', 'Slow Horses', 'Severance', 'Demon Slayer'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setShowSearchQuery(tag)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {isSearchLoading ? (
            <div className="flex items-center justify-center p-12">
              <RefreshCw className="w-6 h-6 text-teal-400 animate-spin" />
            </div>
          ) : searchedShows.length === 0 ? (
            <div className="text-center p-12 text-slate-400 text-xs">
              Nenhuma série encontrada para &quot;{showSearchQuery}&quot;.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {searchedShows.map((show) => (
                <div
                  key={show.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 rounded-2xl p-4 flex flex-col justify-between transition-all"
                >
                  <div className="flex gap-4 mb-4">
                    {/* Poster */}
                    <div className="w-24 h-36 flex-shrink-0 bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
                      <img
                        src={show.image?.medium || 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=300&q=80'}
                        alt={show.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        {show.webChannel ? (
                          <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold">
                            📡 {show.webChannel.name}
                          </span>
                        ) : show.network ? (
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold">
                            📺 {show.network.name}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                            Digital Web
                          </span>
                        )}

                        {show.rating?.average && (
                          <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5 ml-auto">
                            ★ {show.rating.average}
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-white line-clamp-1 mb-1">
                        {show.name}
                      </h4>

                      <div className="text-[11px] text-slate-400 mb-2">
                        {show.premiered ? show.premiered.slice(0, 4) : 'N/A'} • {show.status}
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                        {show.summary?.replace(/<[^>]+>/g, '') || 'Sem sinopse disponível.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                    <a
                      href={show.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-400 hover:text-teal-300 flex items-center gap-1 text-[11px]"
                    >
                      Página no TVmaze
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    {show.officialSite && (
                      <a
                        href={show.officialSite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                      >
                        Site Oficial
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: API CONSOLE */}
      {activeTab === 'api' && (
        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-teal-400" />
                  Console de Desenvolvimento TVmaze REST API
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Teste chamadas HTTP reais diretamente para o cluster público do TVmaze. CORS aberto habilitado para clientes web.
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  access-control-allow-origin: *
                </span>
              </div>
            </div>

            {/* Quick endpoints selector */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { name: 'Web Schedule Geral', url: 'https://api.tvmaze.com/schedule/web' },
                { name: 'Web Schedule (Apenas Globais)', url: 'https://api.tvmaze.com/schedule/web?country=' },
                { name: 'Web Schedule (EUA)', url: 'https://api.tvmaze.com/schedule/web?country=US' },
                { name: 'Canal Netflix (ID 1)', url: 'https://api.tvmaze.com/webchannels/1' },
                { name: 'Pesquisa Stranger Things', url: 'https://api.tvmaze.com/search/shows?q=stranger+things' }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setApiEndpoint(item.url)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
                    apiEndpoint === item.url
                      ? 'bg-teal-500 text-slate-950 font-bold'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Request Builder Bar */}
            <div className="flex gap-2 mb-4">
              <div className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono font-bold text-teal-400 flex items-center">
                GET
              </div>
              <input
                type="text"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-teal-400"
              />
              <button
                onClick={handleRunApiTest}
                disabled={isApiLoading}
                className="px-5 py-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {isApiLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Zap className="w-3.5 h-3.5" />
                )}
                Executar Pedido
              </button>
            </div>

            {/* Response metadata */}
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400 mb-2">
              <span>Status: <strong className={apiStatus === 200 ? 'text-emerald-400' : 'text-slate-300'}>{apiStatus || '---'}</strong></span>
              <span>Latência: <strong className="text-teal-400">{apiLatency ? `${apiLatency} ms` : '---'}</strong></span>
              <span>Formato: <strong className="text-slate-300">application/json</strong></span>
            </div>

            {/* Response Viewer */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-96">
              <pre>{apiResponse}</pre>
            </div>

            {/* Documentation Reference Card */}
            <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="font-bold text-white mb-1">Como filtrar Web Channels na API:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li><strong>Omitir &apos;country&apos;</strong>: Devolve canais locais e globais simultaneamente.</li>
                  <li><strong>country=&quot;&quot;</strong>: Devolve exclusivamente plataformas globais (Netflix, Apple, etc.).</li>
                  <li><strong>country=:code</strong>: Devolve canais locais ligados àquele código ISO (e.g. GB, US).</li>
                </ul>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="font-bold text-white mb-1">Diretório Web Oficial:</div>
                <p className="text-slate-300 mb-2">
                  Consulte a listagem gráfica completa e navegue pelas 28 páginas de web networks registradas:
                </p>
                <a
                  href={TVMAZE_WEBCHANNELS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
                >
                  https://www.tvmaze.com/webchannels
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CHANNEL DETAILS */}
      {selectedChannel && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedChannel(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className={`px-4 py-3 rounded-2xl bg-gradient-to-br ${selectedChannel.badgeColor || 'from-slate-700 to-slate-900 text-white'} text-xl font-bold shadow-lg`}>
                {selectedChannel.logoBadge || selectedChannel.name.slice(0, 2)}
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">{selectedChannel.name}</h3>
                <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                  <span>ID TVmaze #{selectedChannel.id}</span>
                  <span>•</span>
                  <span>{selectedChannel.country ? selectedChannel.country.name : 'Plataforma Global'}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {selectedChannel.description}
            </p>

            {selectedChannel.flagshipShows && (
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-2">
                  Grandes Franquias & Originais:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedChannel.flagshipShows.map((show, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200">
                      {show}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedChannel.features && (
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Tecnologia e Recursos:
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedChannel.features.map((feat, i) => (
                    <div key={i} className="text-xs text-slate-300 flex items-center gap-1.5 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                      {feat}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-800">
              {selectedChannel.officialSite && (
                <a
                  href={selectedChannel.officialSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  Abrir Website Oficial
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <a
                href={`https://www.tvmaze.com/webchannels/${selectedChannel.id}/${selectedChannel.slug || selectedChannel.name.toLowerCase()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                Ver Perfil no TVmaze
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              {onWatchInPlayer && (
                <button
                  onClick={() => {
                    handleWatchChannelStream(selectedChannel);
                    setSelectedChannel(null);
                  }}
                  className="ml-auto px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-teal-500/20"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Sintonizar no UBlue TV
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EPISODE DETAILS */}
      {selectedEpisode && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedEpisode(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-xs text-teal-400 font-bold uppercase tracking-wider">
                {selectedEpisode._embedded?.show?.name || 'Série Web'}
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                {selectedEpisode.name}
              </h3>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-white font-mono">
                  S{selectedEpisode.season.toString().padStart(2, '0')}E{(selectedEpisode.number || 1).toString().padStart(2, '0')}
                </span>
                <span>•</span>
                <span>{selectedEpisode.airdate}</span>
                {selectedEpisode.runtime && <span>• {selectedEpisode.runtime} min</span>}
              </div>
            </div>

            {selectedEpisode.image?.medium && (
              <div className="rounded-2xl overflow-hidden aspect-video bg-slate-950 mb-4 border border-slate-800">
                <img
                  src={selectedEpisode.image.original || selectedEpisode.image.medium}
                  alt={selectedEpisode.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="text-sm text-slate-300 leading-relaxed mb-6">
              {selectedEpisode.summary?.replace(/<[^>]+>/g, '') || 'Sinopse não disponível para este episódio.'}
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <a
                href={selectedEpisode.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
              >
                Ver no TVmaze
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => {
                  handleWatchEpisode(selectedEpisode);
                  setSelectedEpisode(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-teal-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Assistir no UBlue TV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
