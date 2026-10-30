import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Maximize2,
  Minimize2,
  Radio,
  Users,
  Settings,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Server,
  Zap,
  Wifi,
  ChevronLeft,
  ChevronRight,
  Tv,
  ExternalLink,
  Hash,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { Channel, Program, SubscriptionTier } from '../../types/content';
import { entitlementEngine } from '../../engine/subscription-engine';
import { getChannelSources, setupVideoStream, StreamSourceOption } from '../../services/stream-resolver';
import { turboEdgeServer, ZeroDataSessionState } from '../../services/turbo-edge-server';
import { ultraTunerSignalEngine, SignalMetrics } from '../../services/ultra-tuner-signal-engine';
import { ChannelLogoBadge } from '../common/ChannelLogoBadge';
import { soundEffects } from '../../services/sound-effects';

interface LivePlayerProps {
  channel: Channel;
  userTier: SubscriptionTier;
  userId?: string;
  onUpgradeRequired: (channel: Channel) => void;
  onSelectFreeChannel?: () => void;
  onNextChannel?: () => void;
  onPrevChannel?: () => void;
  onSelectChannelNumber?: (channelNumber: number) => void;
  onOpenTurboServers?: () => void;
  onOpenTunerModal?: () => void;
  allChannels?: Channel[];
}

export const LivePlayer: React.FC<LivePlayerProps> = ({
  channel,
  userTier,
  userId,
  onUpgradeRequired,
  onSelectFreeChannel,
  onNextChannel,
  onPrevChannel,
  onSelectChannelNumber,
  onOpenTurboServers,
  onOpenTunerModal,
  allChannels = []
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85); // 0.0 to 1.0
  const [quality, setQuality] = useState<'Auto (1080p)' | '720p' | '480p' | '360p Otimizado'>('Auto (1080p)');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showMiniRemote, setShowMiniRemote] = useState(true);
  const [showKeypad, setShowKeypad] = useState(false);
  const [dialedNumber, setDialedNumber] = useState('');
  const [showMetadata, setShowMetadata] = useState(false);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [streamNotice, setStreamNotice] = useState<string | null>(null);
  const [isAutoFallback, setIsAutoFallback] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSignalBoosted, setIsSignalBoosted] = useState(false);
  const [signalMetrics, setSignalMetrics] = useState<SignalMetrics>(() => ultraTunerSignalEngine.getSignalMetrics());
  const [turboState, setTurboState] = useState<ZeroDataSessionState>(() => turboEdgeServer.getState());

  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check entitlement
  const accessCheck = entitlementEngine.evaluateAccess(userTier, channel.requiredTier);
  const isChannelUnlocked = accessCheck.allowed || isPreviewMode;
  const canZeroData = turboEdgeServer.canAccessZeroData(userTier);
  const activeServer = turboEdgeServer.getActiveServer();

  // Listen to signal engine & turbo updates
  useEffect(() => {
    const unsubSignal = ultraTunerSignalEngine.subscribe(() => {
      setSignalMetrics(ultraTunerSignalEngine.getSignalMetrics());
    });
    const unsubTurbo = turboEdgeServer.subscribe(() => {
      setTurboState(turboEdgeServer.getState());
    });
    return () => {
      unsubSignal();
      unsubTurbo();
    };
  }, []);

  // Sync volume & mute state with actual HTML5 video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = volume;
    video.muted = isMuted;
  }, [volume, isMuted]);

  // Data saving counter in zero data mode
  useEffect(() => {
    if (!isPlaying || !turboState.isZeroDataActive || !canZeroData) return;
    const interval = window.setInterval(() => {
      turboEdgeServer.recordWatchSession(4);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, turboState.isZeroDataActive, canZeroData]);

  // Sources with multi-mirror failover
  const sources = getChannelSources(channel.streamUrl, channel.category, channel.name);
  const currentSource = sources[sourceIndex] || sources[0];

  // Reset to primary source when channel changes
  useEffect(() => {
    setSourceIndex(0);
    setIsAutoFallback(false);
    setStreamNotice(null);
    setIsVideoReady(false);
    triggerControlsDisplay();
  }, [channel.id]);

  // Trigger controls on screen touch / mouse move with auto-hide timer
  const triggerControlsDisplay = () => {
    setShowControls(true);
    setShowMiniRemote(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying && !showKeypad) {
        setShowControls(false);
        setShowMiniRemote(false);
      }
    }, 4500);
  };

  // Screen click/touch handler: toggles or resets controls
  const handleScreenTouch = (e: React.MouseEvent | React.TouchEvent) => {
    // If clicked on interactive control, let control handle it
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('select')) {
      return;
    }
    if (!showControls) {
      triggerControlsDisplay();
    } else {
      // If already shown, tapping screen toggles off or keeps alive
      triggerControlsDisplay();
    }
  };

  // Setup video playback via stream-resolver (HLS.js + CORS fallback)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isChannelUnlocked) return;
    if (!currentSource) return;

    setIsVideoReady(false);

    const cleanup = setupVideoStream(video, currentSource.url, {
      onSuccess: () => {
        setIsVideoReady(true);
        setStreamNotice(null);
      },
      onError: (msg, isCorsOrNetwork) => {
        setIsVideoReady(false);
        if (isCorsOrNetwork && sources.length > 1 && sourceIndex < sources.length - 1) {
          // Automatic failover to next verified mirror
          setStreamNotice(`Sinal alternado para Servidor Espelho HD (${sources[(sourceIndex + 1) % sources.length].label}).`);
          setIsAutoFallback(true);
          setSourceIndex((prev) => (prev + 1) % sources.length);
        } else {
          setStreamNotice(msg);
        }
      }
    });

    return () => {
      cleanup();
    };
  }, [currentSource?.url, isChannelUnlocked, sourceIndex]);

  // Handle play/pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlaying]);

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {
        // Fallback for mobile iOS safari
        if (videoRef.current && (videoRef.current as any).webkitEnterFullscreen) {
          (videoRef.current as any).webkitEnterFullscreen();
        }
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
    triggerControlsDisplay();
  };

  // Picture in Picture Toggle
  const togglePictureInPicture = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (video.requestPictureInPicture) {
        await video.requestPictureInPicture();
      }
    } catch {
      // PiP not supported on some browsers
    }
    triggerControlsDisplay();
  };

  // Volume Handlers
  const handleVolumeUp = () => {
    setVolume((prev) => {
      const next = Math.min(1.0, parseFloat((prev + 0.1).toFixed(2)));
      if (next > 0 && isMuted) setIsMuted(false);
      return next;
    });
    triggerControlsDisplay();
  };

  const handleVolumeDown = () => {
    setVolume((prev) => {
      const next = Math.max(0.0, parseFloat((prev - 0.1).toFixed(2)));
      return next;
    });
    triggerControlsDisplay();
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
    soundEffects.play('notification');
    triggerControlsDisplay();
  };

  // Signal Booster Action
  const handleBoostSignal = () => {
    ultraTunerSignalEngine.boostSignalNow();
    setIsSignalBoosted(true);
    soundEffects.play('transmission_start');
    setStreamNotice('⚡ SINAL ULTRA FORTE: Buffer de 45s pré-carregado! Qualidade travada em 1080p60.');
    setTimeout(() => setIsSignalBoosted(false), 3000);
    triggerControlsDisplay();
  };

  // Channel switching handlers
  const handleNext = () => {
    if (onNextChannel) {
      soundEffects.play('notification');
      onNextChannel();
      triggerControlsDisplay();
    }
  };

  const handlePrev = () => {
    if (onPrevChannel) {
      soundEffects.play('notification');
      onPrevChannel();
      triggerControlsDisplay();
    }
  };

  // Keypad number dial
  const handleKeypadPress = (num: number) => {
    const newDial = dialedNumber + num.toString();
    setDialedNumber(newDial);
    soundEffects.play('notification');

    // If channel exists, auto jump after 2 digits or user enters
    const targetChannel = allChannels.find(c => c.number === parseInt(newDial, 10));
    if (targetChannel && onSelectChannelNumber) {
      onSelectChannelNumber(targetChannel.number);
      setTimeout(() => {
        setDialedNumber('');
        setShowKeypad(false);
      }, 800);
    }
    triggerControlsDisplay();
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        setIsPlaying((p) => !p);
        triggerControlsDisplay();
      } else if (e.key === 'm') {
        setIsMuted((m) => !m);
        triggerControlsDisplay();
      } else if (e.key === 'f') {
        toggleFullscreen();
      } else if (e.key === 'ArrowRight' && onNextChannel) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && onPrevChannel) {
        handlePrev();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleVolumeUp();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleVolumeDown();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNextChannel, onPrevChannel, isMuted, volume]);

  if (!accessCheck.allowed && !isPreviewMode) {
    const suggestedPlan = accessCheck.suggestedPlan || { name: 'UBlue Basic', priceMT: 100, period: 'por mês' };
    return (
      <div className="relative aspect-video w-full rounded-2xl bg-gradient-to-b from-[#0a0f29] via-[#060a1e] to-[#030612] border border-blue-500/40 overflow-hidden flex flex-col items-center justify-center p-6 text-center shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 animate-pulse">
          <AlertCircle className="w-7 h-7" />
        </div>
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-blue-500/30 text-[11px] font-mono text-cyan-300 mb-2">
          <span>ID de Assinante:</span>
          <strong className="text-white font-bold">{userId || 'UB-100201'}</strong>
          <span className="text-amber-400 font-semibold ml-1">· Status: {userTier === 'free' ? 'Livre (Não Pago)' : userTier.toUpperCase()}</span>
        </div>

        <h3 className="text-lg sm:text-2xl font-black text-white mb-1.5">
          🔒 {channel.name}
        </h3>
        
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mb-3 leading-relaxed">
          Este canal é restrito a assinantes ativos do pacote {channel.requiredTier.toUpperCase()}. O sinal de transmissão em direto está operacional e pronto para desbloqueio contínuo.
        </p>

        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-[11px] text-emerald-300 max-w-md mb-4 text-left flex items-start gap-2">
          <span className="text-base shrink-0">🟢</span>
          <div>
            <strong>Sinal Operacional 100%:</strong> Transmissão de alta potência via satélite e fibra. Assista em modo prévia ou desbloqueie via M-Pesa / e-Mola.
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onUpgradeRequired(channel)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-600/40 cursor-pointer flex items-center gap-2 transform active:scale-95 transition-all"
          >
            <span>💳 Pagar {suggestedPlan.priceMT} MT com meu ID ({userId || 'UB-100201'})</span>
          </button>

          <button
            onClick={() => setIsPreviewMode(true)}
            className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-600/30 cursor-pointer flex items-center gap-1.5 transform active:scale-95 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Assistir Sinal em Direto (Prévia)</span>
          </button>

          {onSelectFreeChannel && (
            <button
              onClick={onSelectFreeChannel}
              className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs cursor-pointer transition-colors"
            >
              📺 Ver Canais Livres (0 MT)
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onClick={handleScreenTouch}
      onTouchStart={handleScreenTouch}
      onMouseMove={triggerControlsDisplay}
      className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden shadow-2xl group select-none border border-slate-800 cursor-pointer"
    >
      {/* Real Broadcast Video Element */}
      <video
        ref={videoRef}
        playsInline
        autoPlay
        muted={isMuted}
        onLoadedData={() => setIsVideoReady(true)}
        onPlaying={() => {
          setIsVideoReady(true);
          setIsPlaying(true);
        }}
        onError={() => setIsVideoReady(false)}
        className="w-full h-full object-cover bg-black"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Real Digital Tuner Sync Screen while stream connects (disappears as soon as stream plays) */}
      {!isVideoReady && (
        <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-center p-4 z-10 pointer-events-none">
          <div className="relative mb-3">
            <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-cyan-400">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div className="text-sm font-black text-white flex items-center gap-2">
            <span>Sintonizando Sinal Real HD</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <div className="text-xs text-slate-400 font-mono mt-1">
            {channel.name} · Frequência 742 MHz · {channel.provider}
          </div>
          <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-[11px] font-mono text-emerald-400">
            <Wifi className="w-3.5 h-3.5" />
            <span>Sinal {signalMetrics.strengthPercent}% ({signalMetrics.rssiDb} dBm)</span>
          </div>
        </div>
      )}

      {/* Paused Overlay */}
      {!isPlaying && isVideoReady && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 z-15 pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(true);
            }}
            className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-xl shadow-blue-600/50 mb-3 cursor-pointer transform active:scale-95 transition-all"
          >
            <Play className="w-7 h-7 fill-current ml-1" />
          </button>
          <div className="text-sm font-bold text-white">Transmissão em Pausa</div>
          <div className="text-xs text-slate-400">Toque no ecrã para continuar assistindo ao vivo</div>
        </div>
      )}

      {/* Stream Notice Toast */}
      {streamNotice && (
        <div className="absolute top-16 left-4 z-30 px-3.5 py-2 rounded-xl bg-black/85 border border-cyan-500/50 text-cyan-200 text-xs flex items-center gap-2 backdrop-blur-md animate-fade-in shadow-xl">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="font-medium">{streamNotice}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setStreamNotice(null);
            }}
            className="text-slate-400 hover:text-white font-bold text-xs ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Official UBlue TV Corner Watermark (Always subtly present) */}
      <div className="absolute top-3.5 right-3.5 z-25 pointer-events-none select-none flex flex-col items-end gap-1">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-cyan-400/30 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[11px] font-black tracking-wider uppercase text-white font-mono">
            UBlue TV
          </span>
          <span className="text-[9px] font-extrabold text-cyan-400 bg-cyan-950/80 px-1 py-0.2 rounded border border-cyan-500/40">
            HD
          </span>
        </div>
        {turboState.isZeroDataActive && canZeroData && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-950/90 backdrop-blur-md border border-emerald-500/50 text-[9px] font-mono font-bold text-emerald-300 shadow-md">
            <Zap className="w-2.5 h-2.5 fill-current text-emerald-400" />
            <span>Sem Megas (0 MB)</span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TOP HEADER CONTROLS (Appears on touch/tap) */}
      {/* ========================================================================= */}
      <div
        className={`absolute top-0 inset-x-0 bg-gradient-to-b from-black/90 via-black/50 to-transparent p-4 z-30 flex items-center justify-between transition-opacity duration-300 ${
          showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 flex-wrap">
          {/* Live Badge */}
          <div className="px-2.5 py-1 rounded-md bg-red-600 text-white text-[11px] font-black tracking-wider flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>AO VIVO</span>
          </div>

          {/* Current Channel Pill */}
          <div className="px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md border border-slate-700 text-white text-xs font-bold flex items-center gap-1.5">
            <span className="text-cyan-400 font-mono">CH {channel.number}</span>
            <span className="text-slate-300 font-medium truncate max-w-[140px] sm:max-w-[200px]">{channel.name}</span>
          </div>

          {/* Signal Booster Pill & Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleBoostSignal();
            }}
            className={`px-2.5 py-1 rounded-md border text-[11px] font-mono flex items-center gap-1.5 cursor-pointer shadow-md transition-all ${
              isSignalBoosted
                ? 'bg-emerald-600 text-white border-emerald-400 animate-pulse'
                : 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/80'
            }`}
            title="Reforçar sinal e pré-carregar buffer"
          >
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span>{signalMetrics.strengthPercent}%</span>
            <span className="hidden sm:inline text-[9px] uppercase tracking-wider text-emerald-200">
              {isSignalBoosted ? 'REFORÇADO!' : '⚡ REFORÇAR'}
            </span>
          </button>
        </div>

        {/* Right side icons: PiP and Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Tuner Open Button */}
          {onOpenTunerModal && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenTunerModal();
              }}
              className="p-2 rounded-xl bg-purple-950/80 border border-purple-500/40 hover:bg-purple-900 text-purple-200 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-md"
              title="Abrir Sintonizador Potente de Canais"
            >
              <Radio className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden md:inline">Sintonizador</span>
            </button>
          )}

          {/* PiP Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePictureInPicture();
            }}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer shadow-md"
            title="Picture-in-Picture (Minimizar na tela)"
          >
            <ExternalLink className="w-4 h-4 text-cyan-400" />
          </button>

          {/* PROMINENT FULLSCREEN BUTTON (As requested: "aparecer os icons de full screen") */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all cursor-pointer transform active:scale-95"
            title={isFullscreen ? 'Sair do Ecrã Inteiro' : 'Ecrã Inteiro (Full Screen)'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Minimizar' : 'Ecrã Inteiro'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FLOATING MINI REMOTE HUD (As requested: "um mini remote de mudar canais e aumentar volume, mute") */}
      {/* ========================================================================= */}
      <div
        className={`absolute bottom-16 sm:bottom-20 inset-x-0 flex justify-center z-35 transition-all duration-300 ${
          showMiniRemote ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="mx-3 px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-cyan-500/40 backdrop-blur-xl shadow-2xl flex items-center gap-2 sm:gap-3 flex-wrap justify-center text-white"
        >
          {/* CH - Button */}
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 hover:bg-slate-800 text-cyan-300 flex items-center gap-1 cursor-pointer transition-all active:scale-90"
            title="Canal Anterior (CH -)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-[11px] font-black font-mono">CH-</span>
          </button>

          {/* Central Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center cursor-pointer shadow-md shadow-blue-600/40 transition-all active:scale-95"
            title={isPlaying ? 'Pausar' : 'Reproduzir'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          {/* CH + Button */}
          <button
            onClick={handleNext}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 hover:bg-slate-800 text-cyan-300 flex items-center gap-1 cursor-pointer transition-all active:scale-90"
            title="Próximo Canal (CH +)"
          >
            <span className="text-[11px] font-black font-mono">CH+</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Vertical Divider */}
          <div className="h-6 w-px bg-slate-700 hidden sm:block" />

          {/* VOL - Button */}
          <button
            onClick={handleVolumeDown}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 hover:bg-slate-800 text-slate-200 cursor-pointer transition-all active:scale-90"
            title="Diminuir Volume (VOL -)"
          >
            <Volume1 className="w-4 h-4" />
          </button>

          {/* Volume Slider & Percent Feedback */}
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setVolume(val);
                if (val > 0 && isMuted) setIsMuted(false);
                triggerControlsDisplay();
              }}
              className="w-16 sm:w-20 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              title={`Volume: ${Math.round(volume * 100)}%`}
            />
            <span className="text-[10px] font-mono text-cyan-300 font-bold w-7 text-right">
              {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
            </span>
          </div>

          {/* VOL + Button */}
          <button
            onClick={handleVolumeUp}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 hover:bg-slate-800 text-slate-200 cursor-pointer transition-all active:scale-90"
            title="Aumentar Volume (VOL +)"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* MUTE / DESMUTAR Button */}
          <button
            onClick={handleToggleMute}
            className={`p-2 rounded-xl border cursor-pointer transition-all active:scale-90 ${
              isMuted
                ? 'bg-red-950/80 border-red-500 text-red-400 shadow-md shadow-red-500/20 animate-pulse'
                : 'bg-slate-900 border-slate-700 hover:border-cyan-400 text-slate-200'
            }`}
            title={isMuted ? 'Desmutar Som' : 'Silenciar (Mute)'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Keypad Trigger Button */}
          {allChannels.length > 0 && onSelectChannelNumber && (
            <button
              onClick={() => setShowKeypad(!showKeypad)}
              className={`p-2 rounded-xl border text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${
                showKeypad
                  ? 'bg-cyan-600 text-slate-950 border-cyan-400'
                  : 'bg-slate-900 border-slate-700 text-cyan-300 hover:border-cyan-400'
              }`}
              title="Teclado Numérico de Canais"
            >
              <Hash className="w-3.5 h-3.5" />
              <span>Nº</span>
            </button>
          )}

          {/* Fullscreen icon inside mini remote for immediate access */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/50 hover:bg-cyan-900 text-cyan-300 cursor-pointer transition-all active:scale-90"
            title="Ecrã Inteiro"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* QUICK CHANNEL KEYPAD DRAWER (When Nº button is clicked) */}
      {/* ========================================================================= */}
      {showKeypad && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-28 left-1/2 -translate-x-1/2 z-40 p-3 rounded-2xl bg-slate-950/95 border border-cyan-500/50 shadow-2xl backdrop-blur-xl animate-fade-in w-64"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="text-[11px] font-black text-cyan-400 uppercase tracking-wider">
              Digitar Canal: {dialedNumber || '___'}
            </span>
            <button
              onClick={() => {
                setShowKeypad(false);
                setDialedNumber('');
              }}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                onClick={() => handleKeypadPress(n)}
                className="py-2 rounded-xl bg-slate-900 hover:bg-cyan-600 hover:text-black border border-slate-800 text-white font-mono font-bold text-sm cursor-pointer transition-colors active:scale-90"
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setDialedNumber('')}
              className="py-2 rounded-xl bg-slate-900/60 text-slate-400 text-xs font-mono font-bold cursor-pointer"
            >
              C
            </button>
            <button
              onClick={() => handleKeypadPress(0)}
              className="py-2 rounded-xl bg-slate-900 hover:bg-cyan-600 hover:text-black border border-slate-800 text-white font-mono font-bold text-sm cursor-pointer transition-colors active:scale-90"
            >
              0
            </button>
            <button
              onClick={() => {
                const targetChannel = allChannels.find(c => c.number === parseInt(dialedNumber, 10));
                if (targetChannel && onSelectChannelNumber) {
                  onSelectChannelNumber(targetChannel.number);
                  setShowKeypad(false);
                  setDialedNumber('');
                }
              }}
              className="py-2 rounded-xl bg-blue-600 text-white text-xs font-mono font-bold cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BOTTOM INFO BAR */}
      {/* ========================================================================= */}
      <div
        className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 sm:p-4 z-25 transition-opacity duration-300 ${
          showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChannelLogoBadge channel={channel} size="md" showCornerUBlueBadge={true} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider font-mono">
                  Canal {channel.number} · {channel.name}
                </span>
                {channel.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-950 border border-blue-500/40 text-blue-300 font-bold hidden sm:inline">
                    {channel.badge}
                  </span>
                )}
              </div>
              <div className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                {channel.currentProgram}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quality Selector */}
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value as any)}
              className="bg-black/60 border border-white/20 rounded-lg text-[11px] text-slate-200 px-2 py-1 focus:outline-none focus:border-cyan-500 cursor-pointer hidden sm:block"
            >
              <option value="Auto (1080p)">Auto (1080p)</option>
              <option value="720p">720p HD</option>
              <option value="480p">480p SD</option>
              <option value="360p Otimizado">360p (Economia)</option>
            </select>

            {/* Direct Fullscreen Button in Bottom Bar */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Tela Cheia"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
