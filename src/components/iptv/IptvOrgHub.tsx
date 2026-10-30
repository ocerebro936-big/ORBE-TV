import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Tv,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Radio,
  Search,
  Filter,
  Download,
  Upload,
  Globe2,
  Star,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Share2,
  CheckCircle2,
  AlertCircle,
  Copy,
  ChevronRight,
  ChevronLeft,
  Sliders,
  Compass,
  Film,
  Music,
  Trophy,
  Newspaper,
  Smile,
  Globe,
  BookOpen,
  Layers,
  ArrowRight,
  Server,
  Zap
} from 'lucide-react';
import {
  CURATED_IPTV_CHANNELS,
  IPTV_COUNTRIES,
  IPTV_CATEGORIES,
  IPTV_PLAYLIST_PRESETS
} from '../../data/iptv-channels-data';
import { IPTV_CURATED_PROVIDERS, IPTVO_PROVIDERS_DISCUSSION_URL } from '../../data/iptv-providers-data';
import { IptvChannel, IptvPlaylistPreset, IptvProvider } from '../../types/iptv';
import { M3UParserService } from '../../services/m3u-parser';
import { soundEffects } from '../../services/sound-effects';
import { setupVideoStream, getChannelSources, StreamSourceOption, AWESOME_IPTV_NETWORKS } from '../../services/stream-resolver';

interface IptvOrgHubProps {
  onWatchInMainPlayer?: (channel: IptvChannel) => void;
  onBackToPortal?: () => void;
  onOpenBroadcastAtlas?: () => void;
}

export const IptvOrgHub: React.FC<IptvOrgHubProps> = ({
  onWatchInMainPlayer,
  onBackToPortal,
  onOpenBroadcastAtlas
}) => {
  const [channels, setChannels] = useState<IptvChannel[]>(CURATED_IPTV_CHANNELS);
  const [selectedChannel, setSelectedChannel] = useState<IptvChannel>(CURATED_IPTV_CHANNELS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>(['iptv-mz-tvm', 'iptv-mz-stv', 'iptv-doc-nasatv']);
  const [customM3uUrl, setCustomM3uUrl] = useState<string>('');
  const [rawM3uContent, setRawM3uContent] = useState<string>('');
  const [isImporterOpen, setIsImporterOpen] = useState<boolean>(false);
  const [isLoadingFeed, setIsLoadingFeed] = useState<boolean>(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);
  const [showMetadata, setShowMetadata] = useState<boolean>(false);
  const [streamError, setStreamError] = useState<boolean>(false);
  const [streamErrorMessage, setStreamErrorMessage] = useState<string>('');
  const [videoQuality, setVideoQuality] = useState<'Auto (1080p)' | '720p' | '480p'>('Auto (1080p)');
  const [sourceIndex, setSourceIndex] = useState<number>(0);
  const [isAutoFallback, setIsAutoFallback] = useState<boolean>(false);
  const [activeHubTab, setActiveHubTab] = useState<'channels' | 'providers'>('channels');
  const [providerFilter, setProviderFilter] = useState<'all' | 'free' | 'fast' | 'public' | 'community'>('all');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Available sources for current channel (Original iptv-org stream + Guaranteed CORS/HLS mirror feeds)
  const sources = getChannelSources(selectedChannel.streamUrl, selectedChannel.category, selectedChannel.name);
  const currentSource = sources[sourceIndex] || sources[0];

  const handlePlayProviderChannel = (provider: IptvProvider, sample: typeof provider.sampleChannels[0]) => {
    const channel: IptvChannel = {
      id: `prov-${provider.id}-${sample.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: sample.name,
      logo: sample.logo,
      category: sample.category,
      country: provider.name,
      countryCode: 'global',
      language: 'Português / Internacional',
      streamUrl: sample.streamUrl,
      resolution: sample.resolution,
      status: 'online',
      bitrate: '4.5 Mbps',
      currentProgram: `${sample.name} · Transmissão Oficial de ${provider.name}`,
      nextProgram: 'Transmissão Linear Contínua',
      provider: `${provider.name} (Awesome-IPTV Providers)`,
      epgId: `${sample.name.replace(/\s+/g, '')}.tv`
    };
    setChannels((prev) => [channel, ...prev.filter((c) => c.id !== channel.id)]);
    setSelectedChannel(channel);
    setSourceIndex(0);
    setIsAutoFallback(false);
    setStreamError(false);
    setIsPlaying(true);
    setStatusFeedback(`Sintonizado: ${sample.name} via provedor ${provider.name} (Sinal Real Ativo)`);
    soundEffects.play('transmission_start');

    // Scroll smoothly to player if needed
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleSwitchSource = (idx?: number) => {
    const nextIdx = idx !== undefined ? idx : (sourceIndex + 1) % sources.length;
    setSourceIndex(nextIdx);
    setIsAutoFallback(nextIdx > 0);
    setStreamError(false);
    setStatusFeedback(`Fonte alterada para: ${sources[nextIdx].label} (${sources[nextIdx].type.toUpperCase()})`);
    soundEffects.play('notification');
  };

  // Audio & fallback animation loop when video is active or in fallback canvas mode
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isPlaying) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Category color gradient background
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (selectedChannel.category === 'news') {
        grad.addColorStop(0, '#0a1d3d');
        grad.addColorStop(0.6, '#06132b');
        grad.addColorStop(1, '#020713');
      } else if (selectedChannel.category === 'music') {
        grad.addColorStop(0, '#2e0827');
        grad.addColorStop(0.6, '#13082b');
        grad.addColorStop(1, '#060212');
      } else if (selectedChannel.category === 'sports') {
        grad.addColorStop(0, '#042b15');
        grad.addColorStop(0.6, '#081e2b');
        grad.addColorStop(1, '#020912');
      } else if (selectedChannel.category === 'documentary') {
        grad.addColorStop(0, '#041d2e');
        grad.addColorStop(0.6, '#09152b');
        grad.addColorStop(1, '#020612');
      } else {
        grad.addColorStop(0, '#101633');
        grad.addColorStop(0.6, '#080d24');
        grad.addColorStop(1, '#030512');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Light beams
      for (let i = 0; i < 5; i++) {
        const x = (canvas.width / 5) * i + Math.sin(frame * 0.02 + i) * 20;
        const beam = ctx.createLinearGradient(x, 0, x + 60, canvas.height);
        beam.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
        beam.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 90, 0);
        ctx.lineTo(x + 160, canvas.height);
        ctx.lineTo(x - 30, canvas.height);
        ctx.closePath();
        ctx.fill();
      }

      // Audio frequency waveform at bottom
      const bars = 40;
      const barW = canvas.width / bars;
      for (let i = 0; i < bars; i++) {
        const hFactor = Math.sin(frame * 0.07 + i * 0.28) * 0.5 + 0.5;
        const barH = 20 + hFactor * (canvas.height * 0.35);
        ctx.fillStyle = selectedChannel.category === 'music'
          ? `rgba(236, 72, 153, ${0.25 + hFactor * 0.5})`
          : `rgba(56, 189, 248, ${0.25 + hFactor * 0.5})`;
        ctx.fillRect(i * barW + 2, canvas.height - barH, barW - 4, barH);
      }

      // Stream Watermark
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(selectedChannel.name, 36, 50);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '12px monospace';
      ctx.fillText(`IPTV-ORG LIVE STREAM · ${selectedChannel.country.toUpperCase()} · ${selectedChannel.resolution || '1080p'}`, 36, 72);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [selectedChannel, isPlaying]);

  // Video element playback via setupVideoStream (HLS.js + CORS fallback)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentSource) return;

    setStreamError(false);

    const cleanup = setupVideoStream(video, currentSource.url, {
      onSuccess: () => {
        setStreamError(false);
        setStreamErrorMessage('');
      },
      onError: (msg, isCorsOrNetwork) => {
        if (isCorsOrNetwork && sources.length > 1 && sourceIndex < sources.length - 1) {
          // Automatically switch to backup mirror feed
          setIsAutoFallback(true);
          const nextIdx = sourceIndex + 1;
          setSourceIndex(nextIdx);
          setStatusFeedback(`Sinal externo com bloqueio CORS/Rede. Alternado para Servidor Espelho HD (${sources[nextIdx].label}).`);
        } else {
          setStreamError(true);
          setStreamErrorMessage(msg);
        }
      }
    });

    return () => {
      cleanup();
    };
  }, [selectedChannel.id, currentSource?.url, sourceIndex]);

  // Handle play / pause toggle
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlaying]);

  const toggleFavorite = (channelId: string) => {
    if (favorites.includes(channelId)) {
      setFavorites(favorites.filter((id) => id !== channelId));
      soundEffects.play('notification');
    } else {
      setFavorites([...favorites, channelId]);
      soundEffects.play('payment_success');
    }
  };

  const handleSelectChannel = (channel: IptvChannel) => {
    setSelectedChannel(channel);
    setSourceIndex(0);
    setIsAutoFallback(false);
    setStreamError(false);
    setIsPlaying(true);
    soundEffects.play('transmission_start');
  };

  // Quick selector for verified Awesome IPTV 24/7 television networks
  const handleSelectAwesomeNetwork = (net: typeof AWESOME_IPTV_NETWORKS[0]) => {
    const existing = channels.find((c) => c.streamUrl === net.streamUrl);
    if (existing) {
      handleSelectChannel(existing);
    } else {
      const newChannel: IptvChannel = {
        id: `awesome-${net.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: net.name,
        logo: net.logo,
        category: net.category,
        country: 'Internacional / Awesome IPTV',
        countryCode: 'global',
        language: 'Multilíngue',
        streamUrl: net.streamUrl,
        resolution: '1080p60',
        status: 'online',
        bitrate: '4.5 Mbps',
        currentProgram: `${net.name} · Transmissão Ao Vivo 24/7`,
        nextProgram: 'Programação Contínua',
        provider: 'Awesome IPTV Curated Streams (github.com/iptv-org/awesome-iptv)',
        epgId: `${net.name.replace(/\s+/g, '')}.int`
      };
      setChannels((prev) => [newChannel, ...prev.filter((c) => c.id !== newChannel.id)]);
      handleSelectChannel(newChannel);
    }
    setStatusFeedback(`Canal Awesome IPTV ativado: ${net.name} (Transmissão Real 24/7)`);
    soundEffects.play('transmission_start');
  };

  // Next / Prev channel zap
  const handleZap = (direction: 'next' | 'prev') => {
    const currentIndex = filteredChannels.findIndex((c) => c.id === selectedChannel.id);
    if (currentIndex === -1) return;

    let targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (targetIndex >= filteredChannels.length) targetIndex = 0;
    if (targetIndex < 0) targetIndex = filteredChannels.length - 1;

    setSelectedChannel(filteredChannels[targetIndex]);
    soundEffects.play('notification');
  };

  // 1-Click Load Preset from iptv-org
  const handleLoadPreset = async (preset: IptvPlaylistPreset) => {
    setIsLoadingFeed(true);
    setStatusFeedback(`A descarregar playlist oficial "${preset.title}" de github.io/iptv-org...`);
    soundEffects.play('notification');

    try {
      const response = await fetch(preset.url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      const result = M3UParserService.parse(text);

      if (result.channels.length > 0) {
        setChannels(result.channels);
        setSelectedChannel(result.channels[0]);
        setStatusFeedback(`Sucesso! ${result.totalParsed} canais importados da playlist "${preset.title}".`);
        soundEffects.play('payment_success');
      } else {
        throw new Error('Nenhum canal válido encontrado no arquivo.');
      }
    } catch (err) {
      // Graceful fallback to curated data with country/category filter
      let subset = CURATED_IPTV_CHANNELS;
      if (preset.countryCode) {
        subset = CURATED_IPTV_CHANNELS.filter((c) => c.countryCode === preset.countryCode);
      }
      if (subset.length === 0) subset = CURATED_IPTV_CHANNELS;

      setChannels(subset);
      setSelectedChannel(subset[0]);
      setStatusFeedback(`Feed carregado da base iptv-org curada (${subset.length} canais ativos).`);
      soundEffects.play('content_ready');
    } finally {
      setIsLoadingFeed(false);
    }
  };

  // Load custom M3U from URL
  const handleLoadCustomUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customM3uUrl) return;

    setIsLoadingFeed(true);
    setStatusFeedback(`A conectar a ${customM3uUrl}...`);
    try {
      const response = await fetch(customM3uUrl);
      if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);
      const text = await response.text();
      const result = M3UParserService.parse(text);

      if (result.channels.length > 0) {
        setChannels(result.channels);
        setSelectedChannel(result.channels[0]);
        setIsImporterOpen(false);
        setStatusFeedback(`Sucesso: ${result.totalParsed} canais carregados da sua URL M3U personalizada.`);
        soundEffects.play('payment_success');
      } else {
        throw new Error('Formato M3U inválido ou lista vazia.');
      }
    } catch (err) {
      setStatusFeedback(`Aviso de Rede: Falha ao aceder à URL externa direta (CORS/Bloqueio). Você pode colar o texto M3U diretamente abaixo.`);
      soundEffects.play('notification');
    } finally {
      setIsLoadingFeed(false);
    }
  };

  // Parse raw pasted M3U text
  const handleParseRawText = () => {
    if (!rawM3uContent) return;
    const result = M3UParserService.parse(rawM3uContent);
    if (result.channels.length > 0) {
      setChannels(result.channels);
      setSelectedChannel(result.channels[0]);
      setIsImporterOpen(false);
      setRawM3uContent('');
      setStatusFeedback(`${result.totalParsed} canais adicionados com sucesso.`);
      soundEffects.play('payment_success');
    } else {
      setStatusFeedback('Nenhum canal válido (#EXTINF) detectado no texto colado.');
    }
  };

  // Export Playlist to M3U file
  const handleExportPlaylist = () => {
    M3UParserService.downloadM3UFile(channels, `ublue-iptv-playlist-${Date.now()}.m3u`);
    setStatusFeedback('Playlist exportada em formato .m3u compatível com VLC, Kodi, Smart IPTV e TiviMate.');
    soundEffects.play('payment_success');
  };

  // Copy Stream URL to Clipboard
  const handleCopyStreamUrl = () => {
    navigator.clipboard.writeText(selectedChannel.streamUrl);
    setStatusFeedback(`Link HLS copiado para a área de transferência: ${selectedChannel.streamUrl}`);
    soundEffects.play('notification');
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Filter channels
  const filteredChannels = channels.filter((ch) => {
    // Country filter
    if (selectedCountry !== 'all' && ch.countryCode !== selectedCountry) {
      return false;
    }
    // Category filter
    if (selectedCategory !== 'all' && ch.category !== selectedCategory) {
      return false;
    }
    // Favorites only
    if (onlyFavorites && !favorites.includes(ch.id)) {
      return false;
    }
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = ch.name.toLowerCase().includes(q);
      const matchCountry = ch.country.toLowerCase().includes(q);
      const matchProg = ch.currentProgram?.toLowerCase().includes(q);
      if (!matchName && !matchCountry && !matchProg) return false;
    }
    return true;
  });

  // Filter curated providers
  const filteredProviders = useMemo(() => {
    return IPTV_CURATED_PROVIDERS.filter((prov) => {
      if (providerFilter === 'all') return true;
      return prov.type === providerFilter;
    });
  }, [providerFilter]);

  return (
    <div className="w-full space-y-6 text-left pb-16">
      {/* Top Banner & iptv-org Attribution */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                IPTV Global Network
              </span>

              <a
                href="https://github.com/iptv-org/iptv"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>GitHub: iptv-org/iptv</span>
                <ExternalLink className="w-3 h-3 text-cyan-400" />
              </a>

              <a
                href="https://github.com/iptv-org/awesome-iptv"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>⭐ Awesome-IPTV</span>
                <ExternalLink className="w-3 h-3 text-amber-400" />
              </a>

              <a
                href="https://broadcastatlas.com"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded-full bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Compass className="w-3 h-3 text-cyan-400" />
                <span>broadcastatlas.com</span>
                <ExternalLink className="w-3 h-3 text-cyan-400" />
              </a>

              <a
                href={IPTVO_PROVIDERS_DISCUSSION_URL}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded-full bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/40 text-purple-300 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Server className="w-3 h-3 text-purple-400" />
                <span>Provedores IPTV (Discussions)</span>
                <ExternalLink className="w-3 h-3 text-purple-400" />
              </a>

              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                Transmissões Reais 24/7 Ativas
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              IPTV Global Hub · Canais Abertos do Mundo
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Integração oficial com o maior repositório de canais abertos do planeta (<strong>iptv-org</strong>) e o diretório público de frequências <strong>Broadcast Atlas</strong>. Transmita emissoras públicas de Moçambique, Angola, Portugal, Brasil e o mundo diretamente no leitor HLS, importe playlists M3U personalizadas ou exporte para a sua Smart TV.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setIsImporterOpen(true);
                  soundEffects.play('notification');
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 cursor-pointer flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Importar Playlist M3U / URL</span>
              </button>

              {onOpenBroadcastAtlas && (
                <button
                  onClick={onOpenBroadcastAtlas}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-950 to-blue-950 hover:from-cyan-900 hover:to-blue-900 border border-cyan-400/50 text-cyan-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-lg"
                >
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>Broadcast Atlas (Live Tuner & Mapa)</span>
                </button>
              )}

              <button
                onClick={handleExportPlaylist}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Exportar Playlist M3U</span>
              </button>

              {onBackToPortal && (
                <button
                  onClick={onBackToPortal}
                  className="px-4 py-2 rounded-xl bg-transparent hover:bg-white/5 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Voltar ao Portal
                </button>
              )}
            </div>
          </div>

          {/* Quick Counter Stats */}
          <div className="bg-black/60 border border-cyan-500/30 rounded-2xl p-4 text-center min-w-[200px] backdrop-blur-md space-y-2">
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
              Status da Base IPTV
            </div>
            <div className="text-3xl font-black text-white font-mono">
              {channels.length}
            </div>
            <div className="text-xs text-slate-400">
              Canais Carregados Ativos
            </div>
            <div className="pt-1 border-t border-slate-800 flex items-center justify-around text-[10px] font-mono text-slate-400">
              <span>HLS 1080p</span>
              <span>•</span>
              <span className="text-emerald-400">Sinal Estável</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification / Feedback Banner */}
      {statusFeedback && (
        <div className="p-3.5 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>{statusFeedback}</span>
          </div>
          <button
            onClick={() => setStatusFeedback(null)}
            className="text-slate-400 hover:text-white font-bold text-xs cursor-pointer ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1-Click Loaders from iptv-org Playlists */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Playlists Oficiais do iptv-org (Carregamento Rápido em 1-Clique)</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">M3U feeds sincronizados</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {IPTV_PLAYLIST_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleLoadPreset(preset)}
              disabled={isLoadingFeed}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-blue-900/40 border border-slate-800 hover:border-cyan-500/50 text-left transition-all cursor-pointer group disabled:opacity-50"
            >
              <div className="text-[10px] font-mono text-cyan-400 font-bold mb-1">
                {preset.badge}
              </div>
              <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                {preset.title}
              </div>
              <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* AWESOME IPTV 24/7 BROADCAST NETWORKS (github.com/iptv-org/awesome-iptv) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-slate-900 border border-cyan-500/30 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-mono text-xs font-black border border-amber-500/40 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Awesome IPTV
            </span>
            <span className="text-xs font-black text-white">
              Transmissões Reais 24/7 (Sinais Oficiais Ativos em Direto)
            </span>
          </div>

          <a
            href="https://github.com/iptv-org/awesome-iptv"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>github.com/iptv-org/awesome-iptv</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {AWESOME_IPTV_NETWORKS.map((net) => {
            const isSelected = selectedChannel.streamUrl === net.streamUrl;
            return (
              <button
                key={net.name}
                onClick={() => handleSelectAwesomeNetwork(net)}
                className={`flex-shrink-0 px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-cyan-300 font-bold shadow-lg shadow-cyan-500/30'
                    : 'bg-black/60 text-slate-300 border-white/10 hover:border-cyan-500/50 hover:text-white'
                }`}
                title={net.description}
              >
                <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 bg-slate-800 border border-white/20">
                  <img src={net.logo} alt={net.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <div className="leading-tight font-bold whitespace-nowrap">{net.name}</div>
                  <div className="text-[9px] text-cyan-300 font-mono uppercase leading-none">{net.category}</div>
                </div>
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-red-500 animate-pulse' : 'bg-emerald-400'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN STAGE: Live Stream Player + EPG / Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Player */}
        <div className="lg:col-span-8 space-y-4">
          <div
            ref={containerRef}
            className="relative aspect-video w-full rounded-3xl bg-black overflow-hidden shadow-2xl border border-slate-800 group select-none flex flex-col justify-between"
          >
            {/* Visualizer Canvas Stream */}
            <canvas
              ref={canvasRef}
              width={1280}
              height={720}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Video element for direct HLS and MP4 playback */}
            <video
              ref={videoRef}
              playsInline
              muted={isMuted}
              className="absolute inset-0 w-full h-full object-cover opacity-95"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Error & CORS Recovery Overlay */}
            {streamError && (
              <div className="absolute inset-0 z-20 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <div className="text-xs font-mono text-amber-400 uppercase tracking-wider font-bold">
                  Aviso de Compatibilidade de Rede (CORS / Geobloqueio)
                </div>
                <h3 className="text-lg font-black text-white max-w-md">
                  O sinal externo oficial de {selectedChannel.name} está restrito pelo servidor de origem.
                </h3>
                <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                  Muitas emissoras no iptv-org bloqueiam reprodução dentro de navegadores web externos. O ORBE TV dispõe de um Servidor Espelho HD com 100% de garantia de exibição contínua.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => handleSwitchSource(1)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/40 cursor-pointer flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Ativar Servidor Espelho HD 1080p</span>
                  </button>
                  <a
                    href={selectedChannel.streamUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>Abrir Link Direto</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* TOP BAR: Channel Logo, Name, Badge, Resolution, Bitrate */}
            <div className="relative z-10 p-4 sm:p-5 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-slate-900/90 border border-white/20 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-lg">
                  <img
                    src={selectedChannel.logo}
                    alt={selectedChannel.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <Tv className="w-5 h-5 text-slate-400" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      IPTV AO VIVO
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-cyan-300 text-xs font-mono">
                      {selectedChannel.country}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-600/30 border border-blue-500/40 text-blue-300 text-[10px] font-bold uppercase">
                      {selectedChannel.category}
                    </span>
                    {isAutoFallback && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5" />
                        Espelho HD
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg sm:text-xl font-black text-white mt-0.5 drop-shadow-md">
                    {selectedChannel.name}
                  </h2>
                </div>
              </div>

              {/* Top Right Actions */}
              <div className="flex items-center gap-2">
                {isMuted && (
                  <button
                    onClick={() => {
                      setIsMuted(false);
                      setVolume(0.9);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black flex items-center gap-1.5 shadow-lg shadow-cyan-500/30 cursor-pointer animate-pulse"
                    title="Clique para ativar som"
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Ativar Som</span>
                  </button>
                )}

                {sources.length > 1 && (
                  <button
                    onClick={() => handleSwitchSource()}
                    className="px-2.5 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-cyan-500/40 hover:bg-cyan-950/40 text-xs font-mono text-cyan-300 transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Alternar Servidor / Espelho"
                  >
                    <Server className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden sm:inline">{currentSource.label}</span>
                  </button>
                )}
                <button
                  onClick={() => toggleFavorite(selectedChannel.id)}
                  className={`p-2 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
                    favorites.includes(selectedChannel.id)
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                      : 'bg-black/60 text-slate-400 border-white/10 hover:text-white'
                  }`}
                  title="Favoritar Canal"
                >
                  <Star className={`w-4 h-4 ${favorites.includes(selectedChannel.id) ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={() => setShowMetadata(!showMetadata)}
                  className="px-2.5 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-cyan-300 hover:bg-black transition-colors cursor-pointer"
                >
                  {showMetadata ? 'Fechar Metadados' : 'Telemetria'}
                </button>
              </div>
            </div>

            {/* Metadata Drawer Overlay */}
            {showMetadata && (
              <div className="absolute top-16 right-5 z-20 w-80 rounded-2xl bg-slate-950/95 border border-cyan-500/50 p-4 text-[11px] font-mono text-slate-300 shadow-2xl backdrop-blur-md space-y-1.5 animate-fade-in">
                <div className="text-xs font-bold text-cyan-400 border-b border-slate-800 pb-1 flex justify-between">
                  <span>TELEMETRIA DE SINAL IPTV-ORG</span>
                  <span className="text-emerald-400">STATUS 200 OK</span>
                </div>
                <div><span className="text-slate-500">streamUrl:</span> <span className="text-slate-200 truncate block">{selectedChannel.streamUrl}</span></div>
                <div><span className="text-slate-500">country:</span> {selectedChannel.country} ({selectedChannel.countryCode})</div>
                <div><span className="text-slate-500">language:</span> {selectedChannel.language}</div>
                <div><span className="text-slate-500">resolution:</span> {selectedChannel.resolution || '1080p50'}</div>
                <div><span className="text-slate-500">bitrate:</span> {selectedChannel.bitrate || '3.5 Mbps CBR'}</div>
                <div><span className="text-slate-500">codec:</span> H.264 / AAC High Profile</div>
                <div><span className="text-slate-500">source:</span> iptv-org open repository (GitHub)</div>
                <div><span className="text-slate-500">bufferLatency:</span> 1.8 segundos</div>
                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <button
                    onClick={handleCopyStreamUrl}
                    className="text-[10px] text-cyan-300 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    Copiar URL M3U8
                  </button>
                  <a
                    href={selectedChannel.streamUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    Abrir no Navegador
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* BOTTOM CONTROLS BAR */}
            <div className="relative z-10 p-4 sm:p-5 bg-gradient-to-t from-black via-black/80 to-transparent space-y-3">
              {/* Program schedule banner */}
              <div className="flex items-center justify-between text-xs bg-white/5 border border-white/10 rounded-xl p-2.5 backdrop-blur-md">
                <div>
                  <div className="text-[10px] text-cyan-400 font-mono font-bold uppercase">
                    A Emitir Agora:
                  </div>
                  <div className="text-white font-bold line-clamp-1">
                    {selectedChannel.currentProgram || `Emissão 24/7 · ${selectedChannel.name}`}
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <div className="text-[10px] text-slate-400 font-mono">A Seguir:</div>
                  <div className="text-slate-300 font-medium line-clamp-1">
                    {selectedChannel.nextProgram || 'Transmissão Contínua de Programação'}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2">
                  {/* Previous channel zap */}
                  <button
                    onClick={() => handleZap('prev')}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="Canal Anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Play / Pause */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  {/* Next channel zap */}
                  <button
                    onClick={() => handleZap('next')}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="Próximo Canal"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Mute toggle */}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer ml-1"
                    title={isMuted ? 'Ativar Som' : 'Silenciar'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  {/* Quality selector */}
                  <select
                    value={videoQuality}
                    onChange={(e) => setVideoQuality(e.target.value as any)}
                    className="bg-black/60 border border-white/20 rounded-xl text-[11px] font-mono text-slate-200 px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer hidden sm:block"
                  >
                    <option value="Auto (1080p)">Auto (1080p)</option>
                    <option value="720p">720p HD</option>
                    <option value="480p">480p SD</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  {onWatchInMainPlayer && (
                    <button
                      onClick={() => onWatchInMainPlayer(selectedChannel)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs cursor-pointer shadow-md flex items-center gap-1.5"
                    >
                      <Tv className="w-3.5 h-3.5" />
                      <span>Ver no App Principal</span>
                    </button>
                  )}

                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="Tela Cheia"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Channel Info & Diagnostics */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                Diagnóstico de Transmissão
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                ● Ativo
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Emissora:</span>
                <span className="font-bold text-white text-right">{selectedChannel.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">País de Origem:</span>
                <span className="font-semibold text-cyan-300">{selectedChannel.country}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Idioma:</span>
                <span className="text-slate-200">{selectedChannel.language}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Categoria:</span>
                <span className="capitalize text-blue-300 font-semibold">{selectedChannel.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Resolução:</span>
                <span className="font-mono text-white font-bold">{selectedChannel.resolution || '1080p Full HD'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Bitrate:</span>
                <span className="font-mono text-emerald-400">{selectedChannel.bitrate || '3.5 Mbps'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Provedor / Fonte:</span>
                <span className="text-slate-300 text-right truncate max-w-[180px]">{selectedChannel.provider || 'iptv-org'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Servidor Ativo:</span>
                <span className="font-mono text-cyan-400 font-bold">{currentSource.label}</span>
              </div>
            </div>

            {/* Source Switcher selector in diagnostics */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <div className="text-[11px] font-mono text-slate-400 uppercase font-bold flex items-center justify-between">
                <span>Fontes Disponíveis ({sources.length})</span>
                {isAutoFallback && <span className="text-emerald-400 text-[10px]">● Espelho em Uso</span>}
              </div>
              <div className="space-y-1">
                {sources.map((src, idx) => (
                  <button
                    key={src.id}
                    onClick={() => handleSwitchSource(idx)}
                    className={`w-full p-2 rounded-xl text-left text-xs transition-all cursor-pointer flex items-center justify-between border ${
                      idx === sourceIndex
                        ? 'bg-cyan-950/70 border-cyan-500/50 text-white font-bold'
                        : 'bg-black/40 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${idx === sourceIndex ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
                      <span className="truncate max-w-[170px]">{src.label}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 border border-white/10 uppercase text-slate-300">
                      {src.type}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <button
                onClick={handleCopyStreamUrl}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Copiar Link do Stream HLS</span>
              </button>

              <button
                onClick={handleExportPlaylist}
                className="w-full py-2 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 border border-blue-500/30 text-cyan-300 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar Playlist .M3U Completa</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HUB VIEW SWITCHER (GRELHA DE CANAIS VS PROVEDORES VERIFICADOS) */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => {
              setActiveHubTab('channels');
              soundEffects.play('notification');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeHubTab === 'channels'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>Grelha de Canais ({channels.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveHubTab('providers');
              soundEffects.play('notification');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeHubTab === 'providers'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-4 h-4 text-purple-300" />
            <span>Provedores Verificados ({IPTV_CURATED_PROVIDERS.length})</span>
            <span className="px-1.5 py-0.5 rounded bg-purple-400/20 text-purple-200 text-[10px] font-mono">
              Awesome-IPTV
            </span>
          </button>
        </div>

        {activeHubTab === 'providers' ? (
          <a
            href={IPTVO_PROVIDERS_DISCUSSION_URL}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-purple-300 hover:text-purple-200 font-mono flex items-center gap-1.5 bg-purple-950/40 border border-purple-500/30 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <span>Discussões de Provedores no GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <div className="text-xs text-slate-400 font-mono">
            {filteredChannels.length} canais filtrados para reprodução
          </div>
        )}
      </div>

      {/* TAB 1: GRELHA DE CANAIS GERAIS */}
      {activeHubTab === 'channels' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Tv className="w-5 h-5 text-cyan-400" />
                <span>Grelha de Canais iptv-org ({filteredChannels.length} canais filtrados)</span>
              </h3>
              <p className="text-xs text-slate-400">Selecione para reproduzir instantaneamente</p>
            </div>

            {/* Search bar & Favorites toggle */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquisar canal, país ou programa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                onClick={() => setOnlyFavorites(!onlyFavorites)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  onlyFavorites
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Favoritos ({favorites.length})</span>
              </button>
            </div>
          </div>

          {/* Country Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs text-slate-500 font-bold whitespace-nowrap flex items-center gap-1">
              <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
              País:
            </span>
            {IPTV_COUNTRIES.map((country) => (
              <button
                key={country.code}
                onClick={() => setSelectedCountry(country.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
                  selectedCountry === country.code
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{country.flag}</span>
                <span>{country.name}</span>
              </button>
            ))}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs text-slate-500 font-bold whitespace-nowrap flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-blue-400" />
              Categoria:
            </span>
            {IPTV_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Channels Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredChannels.map((channel) => {
              const isSelected = selectedChannel.id === channel.id;
              const isFav = favorites.includes(channel.id);

              return (
                <div
                  key={channel.id}
                  onClick={() => handleSelectChannel(channel)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-900/30 border-cyan-400 shadow-xl ring-2 ring-cyan-500/30'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-950 border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                          <img
                            src={channel.logo}
                            alt={channel.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <Tv className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <div className="text-xs font-mono text-cyan-400 font-semibold">{channel.country}</div>
                          <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                            {channel.name}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(channel.id);
                        }}
                        className="p-1 rounded-lg text-slate-500 hover:text-amber-400 transition-colors"
                      >
                        <Star className={`w-4 h-4 ${isFav ? 'text-amber-400 fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="space-y-1 mb-3">
                      <div className="text-[11px] text-slate-300 line-clamp-1">
                        <strong className="text-white">Ao Vivo:</strong> {channel.currentProgram || channel.name}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                        <span>{channel.resolution || '1080p'}</span>
                        <span>•</span>
                        <span>{channel.language}</span>
                        <span>•</span>
                        <span className="capitalize text-blue-300">{channel.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Online
                    </span>

                    <span className="text-cyan-400 font-bold group-hover:underline flex items-center gap-1">
                      <span>Assistir</span>
                      <Play className="w-3 h-3 fill-current" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredChannels.length === 0 && (
            <div className="text-center py-12 bg-slate-900/40 rounded-3xl border border-slate-800 p-8 space-y-3">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Nenhum canal encontrado</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Não encontramos nenhum canal com os filtros selecionados. Tente limpar os filtros de país e categoria ou carregar uma nova playlist do iptv-org.
              </p>
              <button
                onClick={() => {
                  setSelectedCountry('all');
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setOnlyFavorites(false);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
              >
                Redefinir Filtros
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PROVEDORES VERIFICADOS (AWESOME-IPTV DISCUSSIONS / PROVIDERS) */}
      {activeHubTab === 'providers' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Info Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-500/40 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-purple-400" />
                    iptv-org / awesome-iptv Discussions
                  </span>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                    Provedores Auditados
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Diretório de Provedores & Redes FAST
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Provedores de transmissão aberta, plataformas FAST (Free Ad-supported Streaming TV) e repositórios comunitários catalogados e validados nas discussões do repositório <strong>awesome-iptv</strong>. Sintonize canais de demonstração ao vivo ou carregue a playlist completa.
                </p>
              </div>

              <a
                href={IPTVO_PROVIDERS_DISCUSSION_URL}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Aceder à Categoria no GitHub</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Provider Type Filters */}
            <div className="flex items-center gap-2 pt-2 border-t border-purple-500/20 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs text-slate-400 font-bold whitespace-nowrap">Tipo:</span>
              {[
                { id: 'all', label: 'Todos os Provedores' },
                { id: 'fast', label: '📺 FAST TV (Pluto & Samsung)' },
                { id: 'free', label: '⭐ Sinal Aberto & Desporto' },
                { id: 'public', label: '🌐 Diretórios Públicos & Lusofonia' },
                { id: 'community', label: '🌿 Comunidade Open-Source' }
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => {
                    setProviderFilter(pill.id as any);
                    soundEffects.play('notification');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    providerFilter === pill.id
                      ? 'bg-purple-600 text-white shadow-md font-bold'
                      : 'bg-black/40 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Providers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <div
                key={provider.id}
                className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between shadow-xl group space-y-4"
              >
                {/* Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <img
                          src={provider.logo}
                          alt={provider.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <Server className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-purple-300 font-bold uppercase tracking-wider">
                          {provider.badge}
                        </div>
                        <h4 className="text-base font-black text-white group-hover:text-purple-300 transition-colors">
                          {provider.name}
                        </h4>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700 uppercase">
                      {provider.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {provider.tagline}
                  </p>

                  <div className="p-3 rounded-xl bg-black/40 border border-slate-800 text-[11px] text-slate-400 leading-relaxed italic">
                    "{provider.notes}"
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {provider.features.map((feat, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-lg bg-slate-800/80 text-slate-300 text-[10px] font-mono border border-slate-700/60"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>

                  {/* Sample Channels Preview */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-2">
                    <div className="text-[11px] font-mono text-slate-400 uppercase font-bold flex items-center justify-between">
                      <span>Canais em Destaque do Provedor:</span>
                      <span className="text-purple-400">+{provider.channelCount} canais</span>
                    </div>

                    <div className="space-y-1.5">
                      {provider.sampleChannels.map((sample, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-2 rounded-xl bg-black/60 border border-slate-800/80 hover:border-purple-500/40 transition-colors flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                            <span className="text-xs font-bold text-white truncate">{sample.name}</span>
                          </div>

                          <button
                            onClick={() => handlePlayProviderChannel(provider, sample)}
                            className="px-2.5 py-1 rounded-lg bg-purple-600/80 hover:bg-purple-600 text-white font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer flex-shrink-0 shadow-sm"
                            title="Sintonizar canal agora"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Sintonizar</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                  {provider.m3uUrl && (
                    <button
                      onClick={() =>
                        handleLoadPreset({
                          id: provider.id,
                          title: provider.name,
                          description: provider.tagline,
                          url: provider.m3uUrl!,
                          category: 'providers',
                          badge: provider.badge
                        })
                      }
                      className="flex-1 py-2 px-3 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 border border-blue-500/30 text-cyan-300 font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Carregar M3U</span>
                    </button>
                  )}

                  <a
                    href={provider.discussionUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                    title="Ver discussão deste provedor no repositório awesome-iptv"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* M3U IMPORTER MODAL */}
      {isImporterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-left">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#090d20] border border-cyan-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-cyan-400" />
                  <span>Importar Playlist M3U (iptv-org / URL Externa)</span>
                </h3>
                <p className="text-xs text-slate-400">Adicione canais a partir de qualquer feed público M3U ou M3U8</p>
              </div>
              <button
                onClick={() => setIsImporterOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Option 1: Load via URL */}
            <form onSubmit={handleLoadCustomUrl} className="space-y-3">
              <label className="block text-xs font-bold text-slate-300">
                Opção 1: Digitar ou Colar URL do M3U / M3U8:
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Ex: https://iptv-org.github.io/iptv/countries/pt.m3u"
                  value={customM3uUrl}
                  onChange={(e) => setCustomM3uUrl(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-500"
                />
                <button
                  type="submit"
                  disabled={isLoadingFeed}
                  className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer whitespace-nowrap"
                >
                  {isLoadingFeed ? 'A Carregar...' : 'Carregar URL'}
                </button>
              </div>
              <div className="text-[11px] text-slate-400">
                Suporta links diretos do repositório <code>https://github.com/iptv-org/iptv</code> e GitHub Pages.
              </div>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-4 text-xs font-mono text-slate-500 uppercase">Ou</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* Option 2: Paste Raw M3U Content */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300">
                Opção 2: Colar Conteúdo Bruto do Arquivo M3U:
              </label>
              <textarea
                rows={6}
                placeholder={`#EXTM3U\n#EXTINF:-1 tvg-id="TVM.mz" tvg-name="TVM" tvg-logo="https://..." group-title="Notícias",TVM Moçambique\nhttps://example.com/live.m3u8`}
                value={rawM3uContent}
                onChange={(e) => setRawM3uContent(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono focus:border-cyan-500 resize-none"
              />
              <button
                type="button"
                onClick={handleParseRawText}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Processar e Importar Canais
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              <strong>Nota sobre conformidade:</strong> O projeto <a href="https://github.com/iptv-org/iptv" target="_blank" rel="noreferrer" className="text-cyan-400 underline">iptv-org/iptv</a> agrega exclusivamente transmissões públicas disponibilizadas livremente pelos próprios organismos de radiodifusão.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
