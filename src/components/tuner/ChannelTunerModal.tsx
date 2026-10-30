import React, { useState, useEffect } from 'react';
import {
  Radio,
  Tv,
  Film,
  Sparkles,
  Search,
  ExternalLink,
  CheckCircle2,
  X,
  Play,
  RotateCcw,
  Zap,
  Globe,
  SlidersHorizontal,
  Key,
  Trash2,
  Share2,
  Layers,
  Calendar,
  Check,
  Trophy
} from 'lucide-react';
import { Channel } from '../../types/content';
import { OmdbMovieDetail, OmdbSearchResultItem } from '../../types/omdb';
import { omdbService, CURATED_OMDB_PRESETS } from '../../services/omdb-service';
import { channelTunerService } from '../../services/channel-tuner-service';
import { netcomboService, NETCOMBO_CURATED_CHANNELS } from '../../services/netcombo-service';
import { NetComboChannelDoc } from '../../types/netcombo';
import { INITIAL_TMDB_FAVORITE_MOVIES, TMDB_IMAGE_BASE_W500 } from '../../data/tmdb-movies-data';
import { TVMAZE_CURATED_WEBCHANNELS } from '../../data/tvmaze-webchannels-data';
import { TmdbMovie } from '../../types/tmdb';
import { ReiDosCanaisHub } from '../reidoscanais/ReiDosCanaisHub';
import { UltraInternetTunerTab } from './UltraInternetTunerTab';

interface ChannelTunerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChannelTunedAndPlay: (channel: Channel) => void;
}

type TunerSourceTab = 'ultra_tuner' | 'reidoscanais' | 'netcombo' | 'omdb' | 'tvmaze' | 'genesiswine' | 'manage';

export const ChannelTunerModal: React.FC<ChannelTunerModalProps> = ({
  isOpen,
  onClose,
  onChannelTunedAndPlay
}) => {
  const [activeTab, setActiveTab] = useState<TunerSourceTab>('ultra_tuner');
  
  // Tuned channels list
  const [tunedChannels, setTunedChannels] = useState<Channel[]>(() => channelTunerService.getTunedChannels());

  // NetCombo / Claro TV state
  const [netcomboCity, setNetcomboCity] = useState('1'); // 1 = SP, 2 = RJ, 3 = BSB
  const [netcomboSearch, setNetcomboSearch] = useState('');
  const [netcomboChannels, setNetcomboChannels] = useState<NetComboChannelDoc[]>(NETCOMBO_CURATED_CHANNELS);
  const [selectedNetcomboChannel, setSelectedNetcomboChannel] = useState<NetComboChannelDoc | null>(NETCOMBO_CURATED_CHANNELS[3]);
  const [isLoadingNetcombo, setIsLoadingNetcombo] = useState(false);
  const [isCurlModalOpen, setIsCurlModalOpen] = useState(false);

  // OMDb search state
  const [omdbQuery, setOmdbQuery] = useState('');
  const [omdbType, setOmdbType] = useState<'all' | 'movie' | 'series'>('all');
  const [omdbResults, setOmdbResults] = useState<OmdbSearchResultItem[]>(() =>
    CURATED_OMDB_PRESETS.map(p => ({
      Title: p.Title,
      Year: p.Year,
      imdbID: p.imdbID,
      Type: (p.Type as any) || 'movie',
      Poster: p.Poster || ''
    }))
  );
  const [isSearchingOmdb, setIsSearchingOmdb] = useState(false);
  const [omdbApiKey, setOmdbApiKey] = useState(() => omdbService.getApiKey());
  const [isOmdbKeyOpen, setIsOmdbKeyOpen] = useState(false);

  // Success alert toast
  const [justTunedChannel, setJustTunedChannel] = useState<Channel | null>(null);

  // Subscribe to channel tuner service updates
  useEffect(() => {
    const unsub = channelTunerService.subscribe(() => {
      setTunedChannels(channelTunerService.getTunedChannels());
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  // Search OMDb
  const handleSearchOmdb = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!omdbQuery.trim()) {
      setOmdbResults(CURATED_OMDB_PRESETS.map(p => ({
        Title: p.Title,
        Year: p.Year,
        imdbID: p.imdbID,
        Type: (p.Type as any) || 'movie',
        Poster: p.Poster || ''
      })));
      return;
    }

    setIsSearchingOmdb(true);
    try {
      const typeParam = omdbType === 'all' ? undefined : omdbType;
      const results = await omdbService.searchMovies(omdbQuery, typeParam);
      setOmdbResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingOmdb(false);
    }
  };

  // Tune from OMDb
  const handleTuneOmdb = async (item: OmdbSearchResultItem) => {
    try {
      const detail = await omdbService.getMovieDetail(item.imdbID);
      const newChan = channelTunerService.tuneFromOmdb(detail);
      setJustTunedChannel(newChan);
      setTimeout(() => setJustTunedChannel(null), 3000);
      onChannelTunedAndPlay(newChan);
    } catch (e) {
      console.error(e);
    }
  };

  // Tune from TMDb @genesiswine
  const handleTuneGenesiswine = (movie: TmdbMovie) => {
    const newChan = channelTunerService.tuneFromTmdbGenesiswine(movie);
    setJustTunedChannel(newChan);
    setTimeout(() => setJustTunedChannel(null), 3000);
    onChannelTunedAndPlay(newChan);
  };

  // Tune from TVmaze
  const handleTuneTvmaze = (webCh: typeof TVMAZE_CURATED_WEBCHANNELS[0]) => {
    const newChan: Channel = {
      id: `tvmaze-${webCh.id}`,
      number: 80 + Math.floor(Math.random() * 15),
      name: `TVmaze: ${webCh.name}`,
      tagline: `${webCh.category} · ${webCh.country?.name || 'Global'} · Rede Digital TVmaze`,
      logo: webCh.logoBadge || 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      category: 'originals',
      requiredTier: 'free',
      currentProgram: `${webCh.name} - Emissão Contínua`,
      nextProgram: 'Próxima transmissão em rede web global',
      viewers: 18000 + Math.floor(Math.random() * 9000),
      source: 'tvmaze-web',
      provider: 'TVmaze Web Channels (tvmaze.com)',
      streamUrl: 'https://deluxemusic.akamaized.net/hls/live/2034960/deluxemusic/master.m3u8',
      videoType: 'hls',
      badge: '📺 TVMAZE WEB'
    };
    channelTunerService.tuneChannel(newChan);
    setJustTunedChannel(newChan);
    setTimeout(() => setJustTunedChannel(null), 3000);
    onChannelTunedAndPlay(newChan);
  };

  // Tune from NetCombo / Claro TV Brasil
  const handleTuneNetcombo = (doc: NetComboChannelDoc) => {
    const channel = netcomboService.tuneToUBlueChannel(doc);
    channelTunerService.tuneChannel(channel);
    setJustTunedChannel(channel);
    setTimeout(() => setJustTunedChannel(null), 3000);
    onChannelTunedAndPlay(channel);
  };

  // Search Netcombo
  const handleSearchNetcombo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoadingNetcombo(true);
    const results = await netcomboService.fetchChannels(netcomboCity, netcomboSearch);
    setNetcomboChannels(results);
    setIsLoadingNetcombo(false);
  };

  // Tune all movies from genesiswine
  const handleTuneAllGenesiswine = () => {
    INITIAL_TMDB_FAVORITE_MOVIES.forEach(movie => {
      channelTunerService.tuneFromTmdbGenesiswine(movie);
    });
    setTunedChannels(channelTunerService.getTunedChannels());
    const firstChan = channelTunerService.getTunedChannels()[0];
    if (firstChan) {
      setJustTunedChannel(firstChan);
      setTimeout(() => setJustTunedChannel(null), 3000);
      onChannelTunedAndPlay(firstChan);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Sintonizador Inteligente Multi-Fonte
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                  SINAL ATIVO 100%
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sintonize novos canais, filmes e séries diretamente de OMDb, TVmaze e TMDb @genesiswine.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success toast notification */}
        {justTunedChannel && (
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-300 animate-fade-in">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Canal <strong>{justTunedChannel.name}</strong> sintonizado no <strong>Ch. {justTunedChannel.number}</strong>! Já a reproduzir no player.
              </span>
            </div>
            <span className="text-[11px] font-mono bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-200">
              Sinal Conectado
            </span>
          </div>
        )}

        {/* Quick Tune All 3 Requested Sources Banner */}
        <div className="mx-6 mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/70 via-blue-950/70 to-amber-950/70 border border-purple-500/40 flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-blue-600 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-md">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-black text-white flex items-center gap-2">
                <span>Sintonizador Instantâneo das 3 Fontes Oficiais</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-300 font-mono font-bold">30+ Novos Canais</span>
              </h4>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300 mt-0.5">
                <a href="https://www.omdbapi.com/" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:underline flex items-center gap-0.5">
                  OMDb API <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <span>·</span>
                <a href="https://www.tvmaze.com/dashboard/index" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline flex items-center gap-0.5">
                  TVmaze Dashboard <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <span>·</span>
                <a href="https://www.themoviedb.org/u/genesiswine" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline flex items-center gap-0.5">
                  TMDb @genesiswine <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              const allTuned = channelTunerService.tuneAllPresetSources();
              setTunedChannels(allTuned);
              const firstNew = allTuned.find(c => c.id.startsWith('genesiswine-') || c.id.startsWith('omdb-') || c.id.startsWith('tvmaze-')) || allTuned[0];
              if (firstNew) {
                setJustTunedChannel(firstNew);
                setTimeout(() => setJustTunedChannel(null), 3000);
                onChannelTunedAndPlay(firstNew);
              }
            }}
            className="w-full md:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-95 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>Sintonizar Todos os 30 Novos Canais Agora</span>
          </button>
        </div>

        {/* Source Navigation Tabs */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-800 bg-slate-900/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {/* TAB 0: ULTRA INTERNET TUNER & SIGNAL BOOSTER */}
            <button
              onClick={() => setActiveTab('ultra_tuner')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'ultra_tuner'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30 font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-yellow-300 fill-current" />
              <span>⚡ Motor Tuner & Sinal Ultra Forte</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-400/30 text-cyan-200 font-mono font-bold">LIVE</span>
            </button>

            <button
              onClick={() => setActiveTab('reidoscanais')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'reidoscanais'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>👑 Rei dos Canais (Esportes & EPG)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/30 text-amber-950 font-mono font-bold">API</span>
            </button>

            <button
              onClick={() => setActiveTab('netcombo')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'netcombo'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5 text-rose-300" />
              <span>Claro TV / NetCombo (280 Canais Solr)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/30 text-rose-200 font-mono font-bold">API</span>
            </button>

            <button
              onClick={() => setActiveTab('omdb')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'omdb'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>OMDb API</span>
            </button>

            <button
              onClick={() => setActiveTab('tvmaze')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'tvmaze'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>TVmaze Web Channels</span>
            </button>

            <button
              onClick={() => setActiveTab('genesiswine')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'genesiswine'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20 font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>TMDb @genesiswine</span>
            </button>

            <button
              onClick={() => setActiveTab('manage')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'manage'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20 font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Sintonizados ({tunedChannels.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-[11px] font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              Tuner Engine v3.2
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 0: ULTRA INTERNET TUNER & SINAL ULTRA FORTE */}
          {activeTab === 'ultra_tuner' && (
            <div className="animate-fade-in">
              <UltraInternetTunerTab
                onChannelTunedAndPlay={(ch) => {
                  setJustTunedChannel(ch);
                  setTimeout(() => setJustTunedChannel(null), 3000);
                  onChannelTunedAndPlay(ch);
                }}
              />
            </div>
          )}

          {/* TAB 1: REI DOS CANAIS API (ESPORTES & EPG) */}
          {activeTab === 'reidoscanais' && (
            <div className="animate-fade-in">
              <ReiDosCanaisHub
                onWatchChannel={(ch) => {
                  channelTunerService.tuneChannel(ch);
                  setJustTunedChannel(ch);
                  setTimeout(() => setJustTunedChannel(null), 3000);
                  onChannelTunedAndPlay(ch);
                }}
              />
            </div>
          )}
          
          {/* TAB 0.5: CLARO TV / NETCOMBO SOLR API */}
          {activeTab === 'netcombo' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-red-950/30 border border-rose-500/30">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-rose-300">
                      Integração Solr Gatekeeper: Claro TV / NetCombo Brasil
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                      280 CANAIS DISPONÍVEIS
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Grade oficial da Claro TV / NetCombo via Solr API (<code className="text-rose-300 font-mono">programacao.netcombo.com.br/gatekeeper/canal/select</code>). Sintonize qualquer canal diretamente no player UBlue.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsCurlModalOpen(!isCurlModalOpen)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-rose-300 border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>{isCurlModalOpen ? 'Ocultar cURL' : 'Ver cURL & Solr JSON'}</span>
                  </button>
                </div>
              </div>

              {/* cURL & JSON Spec Inspector */}
              {isCurlModalOpen && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs animate-scale-in">
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-bold text-rose-400">cURL Solr Gatekeeper NetCombo:</span>
                    <span className="text-[10px] text-slate-500">HTTP GET /gatekeeper/canal/select</span>
                  </div>
                  <pre className="p-3 rounded-lg bg-slate-900/90 text-[11px] text-slate-300 overflow-x-auto leading-relaxed border border-slate-800">
{`curl 'https://programacao.netcombo.com.br/gatekeeper/canal/select?q=id_cidade:1&callback=callbackChannels&json.wrf=callbackChannels&wt=json&rows=10&start=0&sort=cn_canal%20asc&fl=id_canal%20st_canal%20cn_canal%20nome%20url_imagem&fq=nome:*' \\
  -H 'Sec-Fetch-Mode: no-cors' \\
  -H 'Referer: https://www.net.com.br/tv-por-assinatura/programacao/grade'`}
                  </pre>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Os documentos retornados contêm <code className="text-rose-300 font-mono">id_canal</code>, <code className="text-rose-300 font-mono">cn_canal</code> (número do canal na grade), <code className="text-rose-300 font-mono">nome</code>, <code className="text-rose-300 font-mono">st_canal</code> e <code className="text-rose-300 font-mono">url_imagem</code> (logo oficial da operadora).
                  </p>
                </div>
              )}

              {/* Search & City Filter Bar */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                <form onSubmit={handleSearchNetcombo} className="flex flex-col sm:flex-row items-center gap-3">
                  {/* City Selector */}
                  <div className="w-full sm:w-52">
                    <select
                      value={netcomboCity}
                      onChange={(e) => {
                        setNetcomboCity(e.target.value);
                        netcomboService.fetchChannels(e.target.value, netcomboSearch).then(setNetcomboChannels);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-rose-500 cursor-pointer"
                    >
                      <option value="1">📍 São Paulo (id_cidade:1)</option>
                      <option value="2">📍 Rio de Janeiro (id_cidade:2)</option>
                      <option value="3">📍 Brasília (id_cidade:3)</option>
                      <option value="4">📍 Belo Horizonte (id_cidade:4)</option>
                      <option value="5">📍 Porto Alegre (id_cidade:5)</option>
                    </select>
                  </div>

                  {/* Search Bar */}
                  <div className="flex-1 flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 w-full focus-within:border-rose-500 transition-colors">
                    <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="Pesquisar por nome ou número (ex: TV Brasil, 1, 4, Globo, CNN)..."
                      value={netcomboSearch}
                      onChange={(e) => setNetcomboSearch(e.target.value)}
                      className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                    {netcomboSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          setNetcomboSearch('');
                          netcomboService.fetchChannels(netcomboCity).then(setNetcomboChannels);
                        }}
                        className="text-slate-400 hover:text-white text-xs px-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoadingNetcombo}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>{isLoadingNetcombo ? 'Consultando...' : 'Filtrar Grade'}</span>
                  </button>
                </form>

                {/* Quick categories */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pt-1">
                  <span className="text-slate-500 mr-1 font-mono">Filtro rápido:</span>
                  {['Todos', 'Aberto', 'Público', 'Educativo', 'Comunitário', 'Notícias', 'Esportes', 'Filmes'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        if (cat === 'Todos') {
                          setNetcomboSearch('');
                          netcomboService.fetchChannels(netcomboCity).then(setNetcomboChannels);
                        } else {
                          setNetcomboSearch(cat);
                          netcomboService.fetchChannels(netcomboCity, cat).then(setNetcomboChannels);
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500/50 text-slate-300 whitespace-nowrap cursor-pointer transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Channels Grid & EPG Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Canais List (2 Colunas) */}
                <div className="lg:col-span-2 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Canais listados: {netcomboChannels.length}</span>
                    <span>Ordenação: cn_canal asc</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                    {netcomboChannels.map((doc) => {
                      const isSelected = selectedNetcomboChannel?.id_canal === doc.id_canal;
                      return (
                        <div
                          key={doc.id_canal}
                          className={`p-3.5 rounded-xl border transition-all text-left flex flex-col justify-between ${
                            isSelected
                              ? 'bg-rose-950/30 border-rose-500 shadow-md shadow-rose-900/20'
                              : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="px-2 py-0.5 rounded bg-rose-600/30 text-rose-300 font-mono font-black text-xs border border-rose-500/30">
                                CH {doc.cn_canal}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono uppercase">
                                ID {doc.id_canal}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 mb-2">
                              {doc.url_imagem && doc.url_imagem.trim().length > 5 ? (
                                <img
                                  src={doc.url_imagem.trim()}
                                  alt={doc.nome}
                                  className="w-10 h-10 rounded-lg object-contain bg-slate-900 p-1 border border-slate-800 shrink-0"
                                  onError={(e) => {
                                    (e.target as any).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-slate-500 border border-slate-800 shrink-0 font-bold text-xs">
                                  {doc.cn_canal}
                                </div>
                              )}
                              <div className="min-w-0">
                                <h4 className="text-xs font-black text-white truncate">{doc.nome}</h4>
                                <span className="text-[10px] text-slate-400 font-mono block truncate">
                                  slug: {doc.st_canal}
                                </span>
                              </div>
                            </div>

                            {doc.categoria && (
                              <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 mb-3">
                                {doc.categoria}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-slate-900">
                            <button
                              type="button"
                              onClick={() => setSelectedNetcomboChannel(doc)}
                              className="flex-1 py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-semibold text-slate-300 cursor-pointer text-center transition-colors"
                            >
                              Ver EPG
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTuneNetcombo(doc)}
                              className="flex-1 py-1.5 px-2 rounded-lg bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-black text-[11px] shadow-sm cursor-pointer flex items-center justify-center gap-1 transition-all"
                            >
                              <Play className="w-3 h-3 fill-white" />
                              <span>Sintonizar</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* EPG Preview Panel (1 Coluna) */}
                <div className="space-y-4">
                  {selectedNetcomboChannel ? (
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 sticky top-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-rose-400" />
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                            Grade EPG: {selectedNetcomboChannel.nome}
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded">
                          CH {selectedNetcomboChannel.cn_canal}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {netcomboService.getProgramsForChannel(selectedNetcomboChannel).map((prog, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl border text-left space-y-1 ${
                              prog.ao_vivo
                                ? 'bg-rose-950/30 border-rose-500/40 text-slate-200'
                                : 'bg-slate-950 border-slate-800/80 text-slate-400'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[11px] font-bold text-white">
                                {prog.hora_inicio} - {prog.hora_fim}
                              </span>
                              {prog.ao_vivo && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-600 text-white font-black uppercase">
                                  No Ar Agora
                                </span>
                              )}
                            </div>
                            <h5 className="text-xs font-bold text-rose-200">{prog.titulo}</h5>
                            <p className="text-[10px] text-slate-400 leading-relaxed">{prog.sinopse}</p>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleTuneNetcombo(selectedNetcomboChannel)}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Sintonizar {selectedNetcomboChannel.nome} no Player</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-xs text-slate-500 rounded-2xl bg-slate-900/40 border border-slate-800">
                      Selecione um canal da lista para visualizar a programação EPG.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: OMDb API */}
          {activeTab === 'omdb' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 to-slate-800/40 border border-amber-500/20">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-amber-300">
                      Integração OMDb API (Open Movie Database)
                    </h3>
                    <a
                      href="https://www.omdbapi.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 underline underline-offset-2"
                    >
                      omdbapi.com <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Pesquise qualquer título cinematográfico internacional ou africano para convertê-lo instantaneamente num canal ao vivo na sua grelha.
                  </p>
                </div>

                <button
                  onClick={() => setIsOmdbKeyOpen(!isOmdbKeyOpen)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>Configurar API Key</span>
                </button>
              </div>

              {/* API Key Drawer */}
              {isOmdbKeyOpen && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">
                      Chave de API OMDb (omdbapi.com/apikey.aspx)
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Chave atual: {omdbApiKey}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={omdbApiKey}
                      onChange={(e) => setOmdbApiKey(e.target.value)}
                      placeholder="Ex: trilogy ou sua chave de omdbapi.com"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                    />
                    <button
                      onClick={() => {
                        omdbService.setApiKey(omdbApiKey);
                        setIsOmdbKeyOpen(false);
                      }}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Salvar
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    A chave pública <code>trilogy</code> já vem pré-configurada com cache inteligente de alta velocidade.
                  </p>
                </div>
              )}

              {/* Search Bar */}
              <form onSubmit={handleSearchOmdb} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={omdbQuery}
                    onChange={(e) => setOmdbQuery(e.target.value)}
                    placeholder="Pesquisar filme, série ou documentário no OMDb (ex: Matrix, Interstellar, Dune, Resgate)..."
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={omdbType}
                    onChange={(e) => setOmdbType(e.target.value as any)}
                    className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-2xl px-3 py-2.5 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="all">Todos os Tipos</option>
                    <option value="movie">Apenas Filmes</option>
                    <option value="series">Apenas Séries</option>
                  </select>

                  <button
                    type="submit"
                    disabled={isSearchingOmdb}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-2xl flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSearchingOmdb ? (
                      <span className="animate-spin text-sm">⏳</span>
                    ) : (
                      <Search className="w-3.5 h-3.5" />
                    )}
                    <span>Sintonizar</span>
                  </button>
                </div>
              </form>

              {/* OMDb Results Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Resultados disponíveis para sintonização:</span>
                  <span className="font-mono">{omdbResults.length} títulos encontrados</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {omdbResults.map((item) => (
                    <div
                      key={item.imdbID}
                      className="group bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/50 rounded-2xl p-3 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-0.5"
                    >
                      <div>
                        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-900 mb-3 border border-slate-800">
                          <img
                            src={item.Poster && item.Poster !== 'N/A' ? item.Poster : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80'}
                            alt={item.Title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] font-mono text-amber-300 border border-amber-500/30">
                            {item.Year}
                          </div>
                          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/90 text-[10px] uppercase font-semibold text-slate-300">
                            {item.Type}
                          </div>
                        </div>

                        <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-300 line-clamp-1 transition-colors">
                          {item.Title}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          IMDb ID: {item.imdbID}
                        </p>
                      </div>

                      <button
                        onClick={() => handleTuneOmdb(item)}
                        className="mt-3 w-full py-2 bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 hover:border-amber-500 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Sintonizar no UBlue</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TVmaze Web Channels */}
          {activeTab === 'tvmaze' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-950/30 to-slate-800/40 border border-blue-500/20">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-blue-300">
                      TVmaze Dashboard & Web Channels
                    </h3>
                    <a
                      href="https://www.tvmaze.com/dashboard/index"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 underline underline-offset-2"
                    >
                      tvmaze.com/dashboard <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Redes de streaming e canais web mundiais catalogados pelo TVmaze. Sintonize canais de animação, séries e plataformas globais.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    api.tvmaze.com/webchannels
                  </span>
                </div>
              </div>

              {/* TVmaze Web Channels Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {TVMAZE_CURATED_WEBCHANNELS.map((webCh) => (
                  <div
                    key={webCh.id}
                    className="group bg-slate-950/60 border border-slate-800/80 hover:border-blue-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-blue-500/5"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={webCh.logoBadge || 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500&auto=format&fit=crop&q=80'}
                          alt={webCh.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-100 group-hover:text-blue-300 transition-colors">
                            {webCh.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {webCh.country?.name || 'Global'} · {webCh.category}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2">
                        {webCh.description}
                      </p>

                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-mono">
                          HD 1080p Web Feed
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          ● Ao Vivo
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleTuneTvmaze(webCh)}
                      className="mt-4 w-full py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 hover:border-blue-500 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Sintonizar no UBlue TV</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TMDb @genesiswine */}
          {activeTab === 'genesiswine' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-purple-900/20 to-slate-800/40 border border-purple-500/30">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-purple-600/30 border border-purple-400/30">
                    GW
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">
                        Curadoria TMDb Oficial: @genesiswine
                      </h3>
                      <a
                        href="https://www.themoviedb.org/u/genesiswine"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-purple-300 hover:text-purple-200 flex items-center gap-1 underline underline-offset-2"
                      >
                        themoviedb.org/u/genesiswine <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-xs text-purple-200/80 mt-1 max-w-xl">
                      Catálogo exclusivo dos filmes favoritos e watchlist do utilizador <strong>genesiswine</strong> na TMDb. Sintonize filmes épicos com um único clique.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleTuneAllGenesiswine}
                  className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/20 flex items-center gap-2 shrink-0 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Sintonizar Coleção Inteira</span>
                </button>
              </div>

              {/* Films Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {INITIAL_TMDB_FAVORITE_MOVIES.map((movie) => (
                  <div
                    key={movie.id}
                    className="group bg-slate-950/60 border border-slate-800/80 hover:border-purple-500/50 rounded-2xl p-3 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-purple-500/5"
                  >
                    <div>
                      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-900 mb-3 border border-slate-800">
                        <img
                          src={movie.poster_path ? `${TMDB_IMAGE_BASE_W500}${movie.poster_path}` : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80'}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-950/90 text-[10px] font-mono text-purple-300 border border-purple-500/30">
                          ⭐ {movie.vote_average.toFixed(1)}
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-slate-100 group-hover:text-purple-300 line-clamp-1 transition-colors">
                        {movie.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                        {movie.overview}
                      </p>
                    </div>

                    <button
                      onClick={() => handleTuneGenesiswine(movie)}
                      className="mt-3 w-full py-2 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 hover:border-purple-500 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Sintonizar Filme</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Manage Tuned Channels */}
          {activeTab === 'manage' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-cyan-300">
                    Grelha de Canais Sintonizados pelo Utilizador
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Estes canais estão integrados no seu ecossistema UBlue TV e disponíveis no player e controle remoto.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const restored = channelTunerService.restoreDefaultPresets();
                    setTunedChannels(restored);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Predefinições</span>
                </button>
              </div>

              <div className="divide-y divide-slate-800/80 rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/50">
                {tunedChannels.map((channel) => (
                  <div
                    key={channel.id}
                    className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-900/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                        <img
                          src={channel.logo}
                          alt={channel.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                            Ch. {channel.number}
                          </span>
                          <span className="text-xs font-bold text-white">
                            {channel.name}
                          </span>
                          {channel.badge && (
                            <span className="text-[10px] font-semibold text-purple-300 bg-purple-950/60 px-2 py-0.2 rounded-full border border-purple-800/40">
                              {channel.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {channel.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onChannelTunedAndPlay(channel);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Assistir</span>
                      </button>

                      <button
                        onClick={() => channelTunerService.removeTunedChannel(channel.id)}
                        className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                        title="Remover canal sintonizado"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>Fontes conectadas: <strong>OMDb API</strong>, <strong>TVmaze</strong> e <strong>TMDb @genesiswine</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer transition-colors"
            >
              Fechar Sintonizador
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
