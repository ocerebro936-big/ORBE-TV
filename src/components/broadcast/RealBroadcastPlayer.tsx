import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Radio,
  Tv,
  Clock,
  Music,
  Film,
  Newspaper,
  Trophy,
  Megaphone,
  BookOpen,
  Mic,
  Calendar,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sliders,
  DollarSign
} from 'lucide-react';
import { OFFICIAL_LINEAR_PROGRAMS } from '../../data/real-broadcast-data';
import { RealBroadcastProgram } from '../../types/broadcast-network';
import { soundEffects } from '../../services/sound-effects';

interface RealBroadcastPlayerProps {
  onOpenMarketplace?: () => void;
  onOpenClearance?: () => void;
}

export const RealBroadcastPlayer: React.FC<RealBroadcastPlayerProps> = ({
  onOpenMarketplace,
  onOpenClearance
}) => {
  // Mozambique CAT (UTC+2) Live Clock
  const [catTime, setCatTime] = useState<string>('');
  const [catHourMin, setCatHourMin] = useState<string>('20:15');
  const [isLiveSync, setIsLiveSync] = useState<boolean>(true);
  const [selectedProgramIndex, setSelectedProgramIndex] = useState<number>(7); // Default to 20:00 Jornal Principal or 18:00
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.75);
  const [isMusicAudioActive, setIsMusicAudioActive] = useState<boolean>(false);
  const [musicBeat, setMusicBeat] = useState<number>(0);
  const [showMetadata, setShowMetadata] = useState<boolean>(false);
  const [activeCommercialIndex, setActiveCommercialIndex] = useState<number>(0);
  const [isInCommercialBreak, setIsInCommercialBreak] = useState<boolean>(false);
  const [commercialCountdown, setCommercialCountdown] = useState<number>(285); // seconds
  const [activeViewMode, setActiveViewMode] = useState<'main' | 'grid'>('main');

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Update Mozambique Time (CAT UTC+2)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to Maputo / CAT time zone (UTC+2)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Africa/Maputo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const formatter = new Intl.DateTimeFormat('pt-PT', options);
      const timeStr = formatter.format(now);
      setCatTime(timeStr);

      const hm = timeStr.slice(0, 5);
      setCatHourMin(hm);

      // If live sync is on, automatically pick the program matching current CAT hour
      if (isLiveSync) {
        const hour = parseInt(hm.slice(0, 2), 10);
        let matchIdx = 0;
        if (hour >= 6 && hour < 8) matchIdx = 0; // 06:00
        else if (hour >= 8 && hour < 9) matchIdx = 1; // 08:00
        else if (hour >= 9 && hour < 12) matchIdx = 2; // 09:00
        else if (hour === 12 && parseInt(hm.slice(3, 5), 10) < 15) matchIdx = 3; // 12:00
        else if (hour >= 12 && hour < 14) matchIdx = 4; // 12:15
        else if (hour >= 14 && hour < 18) matchIdx = 5; // 14:00
        else if (hour >= 18 && hour < 20) matchIdx = 6; // 18:00
        else if (hour >= 20 && hour < 21) matchIdx = 7; // 20:00
        else if (hour >= 21 && hour < 23) matchIdx = 8; // 21:00
        else matchIdx = 9; // 23:00

        setSelectedProgramIndex(matchIdx);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isLiveSync]);

  const currentProgram: RealBroadcastProgram = OFFICIAL_LINEAR_PROGRAMS[selectedProgramIndex] || OFFICIAL_LINEAR_PROGRAMS[0];

  // Manage real synthesized music playback when tuned to Música
  useEffect(() => {
    if (isPlaying && !isMuted && currentProgram.realMediaType === 'musica') {
      setIsMusicAudioActive(true);
      soundEffects.startMusicStream((beat) => {
        setMusicBeat(beat);
      });
    } else {
      setIsMusicAudioActive(false);
      soundEffects.stopMusicStream();
    }

    return () => {
      soundEffects.stopMusicStream();
    };
  }, [isPlaying, isMuted, currentProgram.realMediaType]);

  // Audio mute/unmute
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEffects.setMuted(nextMuted);
    if (nextMuted) {
      soundEffects.stopMusicStream();
      setIsMusicAudioActive(false);
    } else if (currentProgram.realMediaType === 'musica' && isPlaying) {
      soundEffects.startMusicStream((beat) => setMusicBeat(beat));
      setIsMusicAudioActive(true);
    }
  };

  // Sound jingle trigger for news or sports
  const handleTriggerMediaEffect = () => {
    if (currentProgram.realMediaType === 'noticias') {
      soundEffects.playNewsJingle();
    } else if (currentProgram.realMediaType === 'desporto' || currentProgram.realMediaType === 'concerto') {
      soundEffects.playSportsWhistle();
    } else {
      soundEffects.play('notification');
    }
  };

  // Canvas visualizer for the live broadcast stream
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

      // Studio background gradient according to category
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (currentProgram.realMediaType === 'musica') {
        grad.addColorStop(0, '#1a0b2e');
        grad.addColorStop(0.5, '#0b163b');
        grad.addColorStop(1, '#050714');
      } else if (currentProgram.realMediaType === 'noticias') {
        grad.addColorStop(0, '#0a1d3d');
        grad.addColorStop(0.5, '#0a152e');
        grad.addColorStop(1, '#040916');
      } else if (currentProgram.realMediaType === 'filme') {
        grad.addColorStop(0, '#1c130b');
        grad.addColorStop(0.5, '#120f1c');
        grad.addColorStop(1, '#050408');
      } else if (currentProgram.realMediaType === 'comercial') {
        grad.addColorStop(0, '#042838');
        grad.addColorStop(0.5, '#071829');
        grad.addColorStop(1, '#02070e');
      } else {
        grad.addColorStop(0, '#0d1e3d');
        grad.addColorStop(0.5, '#09152b');
        grad.addColorStop(1, '#030713');
      }

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ambient light beams
      const beamCount = 6;
      for (let i = 0; i < beamCount; i++) {
        const x = (canvas.width / beamCount) * i + Math.sin(frame * 0.02 + i) * 30;
        const beamGrad = ctx.createLinearGradient(x, 0, x + 80, canvas.height);
        beamGrad.addColorStop(0, 'rgba(59, 130, 246, 0.15)');
        beamGrad.addColorStop(1, 'rgba(59, 130, 246, 0)');
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 120, 0);
        ctx.lineTo(x + 240, canvas.height);
        ctx.lineTo(x - 50, canvas.height);
        ctx.closePath();
        ctx.fill();
      }

      // Audio reactive bars at bottom
      const bars = 48;
      const barW = canvas.width / bars;
      for (let i = 0; i < bars; i++) {
        const factor = Math.sin(frame * 0.08 + i * 0.25) * 0.5 + 0.5;
        const barH = 20 + factor * (canvas.height * 0.35);
        ctx.fillStyle = currentProgram.realMediaType === 'musica'
          ? `rgba(236, 72, 153, ${0.2 + factor * 0.5})`
          : `rgba(56, 189, 248, ${0.2 + factor * 0.4})`;
        ctx.fillRect(i * barW + 2, canvas.height - barH, barW - 4, barH);
      }

      // Live Watermark
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('UBLUE TV', 32, 42);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('REAL BROADCAST NETWORK · CAT UTC+2', 32, 60);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [currentProgram, isPlaying]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Mozambique Broadcast Network Banner & Clock */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/70 to-slate-900 border border-blue-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Tv className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black tracking-widest uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                EMISSÃO EM TEMPO REAL
              </span>
              <span className="text-xs font-mono text-cyan-400 font-bold">UBlue Broadcast Network</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              Televisão Linear Moçambicana 24/7
            </h2>
          </div>
        </div>

        {/* Master Clock (CAT / UTC+2) */}
        <div className="flex items-center gap-4 bg-black/60 border border-cyan-500/40 px-4 py-2.5 rounded-xl shadow-inner backdrop-blur-md">
          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1 justify-end">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>Horário Oficial de Moçambique</span>
            </div>
            <div className="text-xl sm:text-2xl font-mono font-black text-cyan-300 tracking-wider">
              {catTime || '20:15:00'} <span className="text-xs text-cyan-400/80">CAT (UTC+2)</span>
            </div>
          </div>

          <div className="border-l border-slate-700 pl-3 flex flex-col gap-1">
            <button
              onClick={() => {
                setIsLiveSync(!isLiveSync);
                soundEffects.play('notification');
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all ${
                isLiveSync
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isLiveSync ? '● Sincronizado ao Vivo' : '○ Modo Manual'}
            </button>
            <span className="text-[9px] text-slate-500 font-mono text-center">Maputo · Beira · Nampula</span>
          </div>
        </div>
      </div>

      {/* Main Broadcast Player Stage */}
      <div
        ref={containerRef}
        className="relative aspect-video w-full rounded-3xl bg-black overflow-hidden shadow-2xl border border-slate-800 group select-none flex flex-col justify-between"
      >
        {/* Animated Background Canvas */}
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* TOP OVERLAY: Channel Bar, Live Badge & Status */}
        <div className="relative z-10 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-md bg-red-600 text-white text-[11px] font-black tracking-wider flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>NO AR AGORA</span>
              </div>
              <div className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-mono">
                {currentProgram.timeSlot} – {currentProgram.timeEnd} CAT
              </div>
              <div className="px-2.5 py-1 rounded-md bg-blue-600/30 border border-blue-400/40 text-blue-300 text-xs font-bold">
                {currentProgram.categoryName}
              </div>
              <div className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono">
                Classificação: {currentProgram.ratingAge}
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white drop-shadow-md">
              {currentProgram.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl line-clamp-1">
              Apresentador: <span className="text-white font-semibold">{currentProgram.presenter}</span> · {currentProgram.synopsis}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMetadata(!showMetadata)}
              className="px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-cyan-500/40 text-xs font-mono text-cyan-300 hover:bg-black transition-colors cursor-pointer"
            >
              {showMetadata ? 'Ocultar Telemetria' : 'Telemetria SMPTE'}
            </button>
          </div>
        </div>

        {/* CENTER CONTENT: Dynamic Interactive Real Content according to category */}
        <div className="relative z-10 px-6 sm:px-10 flex-1 flex items-center justify-center">
          {/* CASE 1: 🎵 MÚSICA - A música toca realmente */}
          {currentProgram.realMediaType === 'musica' && currentProgram.mediaPayload.musicTrack && (
            <div className="w-full max-w-2xl bg-black/75 backdrop-blur-md border border-pink-500/30 p-6 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-6 animate-fade-in">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-2xl border-2 border-pink-500/50 flex-shrink-0 group">
                <img
                  src={currentProgram.thumbnail}
                  alt={currentProgram.title}
                  className={`w-full h-full object-cover transition-transform duration-1000 ${isMusicAudioActive ? 'rotate-[360deg] scale-105' : ''}`}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Music className="w-8 h-8 text-pink-400 animate-bounce" />
                </div>
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="px-2 py-0.5 rounded-md bg-pink-600/30 border border-pink-500/50 text-pink-300 text-[10px] font-bold uppercase tracking-wider">
                    🎵 Áudio Real Reproduzindo
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">120 BPM · Marrabenta Groove</span>
                </div>
                <div className="text-lg font-black text-white">
                  {currentProgram.mediaPayload.musicTrack.title}
                </div>
                <div className="text-xs text-pink-300 font-semibold">
                  {currentProgram.mediaPayload.musicTrack.artist} — {currentProgram.mediaPayload.musicTrack.album}
                </div>
                <div className="text-xs italic text-slate-300 bg-white/5 p-2 rounded-lg border border-white/10 font-serif">
                  "{currentProgram.mediaPayload.musicTrack.lyricsSnippet}"
                </div>

                {/* Real Sound state indicator */}
                <div className="flex items-center gap-3 pt-1 justify-center sm:justify-start text-xs">
                  <button
                    onClick={toggleMute}
                    className="px-3 py-1 rounded-md bg-pink-600 hover:bg-pink-500 text-white font-bold flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isMuted ? 'Ativar Som da Música' : 'Silenciar Música'}</span>
                  </button>
                  <span className="text-[11px] font-mono text-emerald-400">
                    {isMusicAudioActive ? '● Web Audio Synth Ativo' : '○ Áudio Pausado'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* CASE 2: 📰 NOTÍCIAS - Telejornal entra realmente no ar */}
          {currentProgram.realMediaType === 'noticias' && currentProgram.mediaPayload.newsBulletin && (
            <div className="w-full max-w-4xl space-y-3 animate-fade-in">
              {/* Studio News Card */}
              <div className="bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider">
                      📰 BANCADA CENTRAL DE NOTÍCIAS
                    </span>
                    <span className="text-xs font-mono text-cyan-300">
                      {currentProgram.mediaPayload.newsBulletin.anchorName}
                    </span>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-white leading-snug">
                    {currentProgram.mediaPayload.newsBulletin.topStory}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span>Directo de: <strong className="text-cyan-300">{currentProgram.mediaPayload.newsBulletin.liveLocation}</strong></span>
                    <button
                      onClick={handleTriggerMediaEffect}
                      className="px-2 py-0.5 rounded bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 text-[10px] font-mono border border-cyan-500/40 cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Ouvir Jingle do Telejornal</span>
                    </button>
                  </div>
                </div>

                {/* Financial Rates Widget */}
                <div className="bg-black/70 border border-white/10 rounded-xl p-3 text-xs font-mono space-y-1 w-full sm:w-56 flex-shrink-0">
                  <div className="text-[10px] font-bold text-slate-400 uppercase border-b border-slate-800 pb-1">
                    Cotação Banco de Moçambique
                  </div>
                  <div className="flex justify-between"><span>USD / MZN:</span><strong className="text-emerald-400">{currentProgram.mediaPayload.newsBulletin.financials.usdMzn} MT</strong></div>
                  <div className="flex justify-between"><span>EUR / MZN:</span><strong className="text-cyan-400">{currentProgram.mediaPayload.newsBulletin.financials.eurMzn} MT</strong></div>
                  <div className="flex justify-between"><span>ZAR / MZN:</span><strong className="text-amber-400">{currentProgram.mediaPayload.newsBulletin.financials.zarMzn} MT</strong></div>
                </div>
              </div>

              {/* Weather Banner */}
              <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none text-[11px] font-mono">
                <span className="text-slate-400 font-bold whitespace-nowrap">Meteorologia Moçambique:</span>
                {currentProgram.mediaPayload.newsBulletin.weather.map((w, idx) => (
                  <div key={idx} className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-slate-300 whitespace-nowrap flex items-center gap-1">
                    <span className="text-white font-semibold">{w.city}:</span>
                    <span className="text-amber-400 font-bold">{w.tempC}°C</span>
                    <span className="text-slate-400">({w.condition})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CASE 3: 🎬 FILME - Transmissão Completa com Letterbox */}
          {currentProgram.realMediaType === 'filme' && currentProgram.mediaPayload.movieDetails && (
            <div className="w-full max-w-3xl bg-black/85 backdrop-blur-md border border-amber-500/30 p-6 rounded-2xl shadow-2xl space-y-4 animate-fade-in text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Film className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-black text-amber-300 uppercase tracking-widest">
                    Sessão Grande Cinema Moçambicano
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-400">
                  {currentProgram.mediaPayload.movieDetails.aspectRatio} · {currentProgram.mediaPayload.movieDetails.runtime}
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-white">{currentProgram.title}</h3>
                <div className="text-xs text-amber-200">
                  Realização: <strong>{currentProgram.mediaPayload.movieDetails.director}</strong> · Trilha Sonora: {currentProgram.mediaPayload.movieDetails.soundtrack}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentProgram.mediaPayload.movieDetails.synopsisSummary}
                </p>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Cena em Exibição:</span>
                <span className="text-white font-bold">{currentProgram.mediaPayload.movieDetails.currentSceneName}</span>
                <span className="text-emerald-400 font-bold">TC 01:24:18:12</span>
              </div>
            </div>
          )}

          {/* CASE 4: 📢 INTERVALO COMERCIAL ESTRUTURADO (5m, 10m ou 15m) */}
          {(currentProgram.realMediaType === 'comercial' || isInCommercialBreak) && (
            <div className="w-full max-w-3xl bg-slate-950/90 backdrop-blur-md border-2 border-cyan-500/50 p-6 rounded-2xl shadow-2xl space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-cyan-400 animate-pulse" />
                  <span className="text-sm font-black text-cyan-300 uppercase tracking-wider">
                    Bloco Publicitário Oficial UBlue ({currentProgram.commercialBreak.breakDurationMinutes} Minutos)
                  </span>
                </div>
                <div className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
                  Volta à programação às {currentProgram.timeEnd}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentProgram.commercialBreak.adSpots.map((spot, idx) => (
                  <div
                    key={spot.id}
                    onClick={() => setActiveCommercialIndex(idx)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      activeCommercialIndex === idx
                        ? 'bg-blue-900/40 border-blue-400 shadow-lg'
                        : 'bg-black/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] font-mono text-cyan-400 mb-1">
                      <span>PATROCINADOR OFICIAL</span>
                      <span>{spot.durationSec}s Spot</span>
                    </div>
                    <div className="text-base font-bold text-white mb-1">{spot.brand}</div>
                    <div className="text-xs text-slate-300 mb-2">{spot.headline}</div>
                    <div className="text-[11px] text-slate-400 italic">"{spot.tagline}"</div>
                  </div>
                ))}
              </div>

              {/* UBlue Self Promos */}
              {currentProgram.commercialBreak.ubluePromos.length > 0 && (
                <div className="bg-blue-950/40 border border-blue-500/30 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px]">
                      {currentProgram.commercialBreak.ubluePromos[0].highlightBadge}
                    </span>
                    <span className="text-white font-semibold">
                      {currentProgram.commercialBreak.ubluePromos[0].title}
                    </span>
                  </div>
                  <span className="text-slate-300 text-[11px] font-mono">
                    {currentProgram.commercialBreak.ubluePromos[0].scheduleNote}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* CASE 5: 🎤 CONCERTO / TALENT SHOW / EDUCAÇÃO */}
          {currentProgram.realMediaType !== 'musica' &&
           currentProgram.realMediaType !== 'noticias' &&
           currentProgram.realMediaType !== 'filme' &&
           currentProgram.realMediaType !== 'comercial' &&
           !isInCommercialBreak && (
            <div className="w-full max-w-2xl bg-black/80 backdrop-blur-md border border-indigo-500/30 p-6 rounded-2xl shadow-2xl text-center space-y-3 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
                <Trophy className="w-4 h-4" />
                <span>Emissão Especial UBlue Live Network</span>
              </div>
              <h3 className="text-2xl font-black text-white">{currentProgram.title}</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                {currentProgram.synopsis}
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={handleTriggerMediaEffect}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-indigo-600/30"
                >
                  Aplaudir / Interagir com o Show
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Telemetry metadata overlay */}
        {showMetadata && (
          <div className="absolute top-20 right-6 z-30 w-80 rounded-2xl bg-slate-950/95 border border-cyan-500/50 p-4 text-[11px] font-mono text-slate-300 shadow-2xl backdrop-blur-md animate-fade-in space-y-2">
            <div className="text-xs font-bold text-cyan-400 border-b border-slate-800 pb-1 flex justify-between">
              <span>TELEMETRIA BROADCAST SMPTE</span>
              <span className="text-emerald-400">1080p50</span>
            </div>
            <div className="space-y-1">
              <div><span className="text-slate-500">timezone:</span> CAT (UTC+2) · Africa/Maputo</div>
              <div><span className="text-slate-500">linearSlot:</span> {currentProgram.timeSlot} – {currentProgram.timeEnd}</div>
              <div><span className="text-slate-500">audioNorm:</span> EBU R128 (-14.0 LUFS Target)</div>
              <div><span className="text-slate-500">videoCodec:</span> H.265 / HEVC Main 10 Broadcast</div>
              <div><span className="text-slate-500">bitrate:</span> 6.8 Mbps CBR Real-time</div>
              <div><span className="text-slate-500">clearance:</span> INCM & GABINFO Moçambique Compliant</div>
              <div><span className="text-slate-500">adInsertion:</span> SCTE-35 Cue Triggers Active</div>
            </div>
          </div>
        )}

        {/* BOTTOM CONTROLS & LINEAR TIMELINE */}
        <div className="relative z-10 p-4 sm:p-5 bg-gradient-to-t from-black via-black/80 to-transparent space-y-3">
          {/* Breaking News Ticker (Always active for authentic television feeling) */}
          {currentProgram.mediaPayload.newsBulletin && (
            <div className="bg-red-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 overflow-hidden shadow-md">
              <span className="bg-white text-red-600 px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider flex-shrink-0 animate-pulse">
                ÚLTIMA HORA
              </span>
              <div className="truncate font-sans font-semibold">
                {currentProgram.mediaPayload.newsBulletin.breakingTicker.join('  ✦  ')}
              </div>
            </div>
          )}

          {/* Timeline and Slot Selector Hopper */}
          <div className="flex items-center justify-between text-xs gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors cursor-pointer"
                title={isPlaying ? 'Pausar' : 'Reproduzir'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              <button
                onClick={toggleMute}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title={isMuted ? 'Ativar Som' : 'Silenciar'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Commercial break toggle simulator */}
              {currentProgram.commercialBreak.hasBreak && (
                <button
                  onClick={() => setIsInCommercialBreak(!isInCommercialBreak)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
                    isInCommercialBreak
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-amber-300'
                  }`}
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>{isInCommercialBreak ? 'Sair do Intervalo' : 'Simular Bloco Comercial'}</span>
                </button>
              )}
            </div>

            {/* Quick Hop to Program Slots */}
            <div className="hidden md:flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 overflow-x-auto max-w-xl scrollbar-none">
              {OFFICIAL_LINEAR_PROGRAMS.map((prog, idx) => (
                <button
                  key={prog.id}
                  onClick={() => {
                    setSelectedProgramIndex(idx);
                    setIsLiveSync(false);
                    soundEffects.play('notification');
                  }}
                  className={`px-2 py-1 rounded-lg text-[11px] font-mono whitespace-nowrap cursor-pointer transition-colors ${
                    selectedProgramIndex === idx
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {prog.timeSlot}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
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

      {/* Quick Action Cards for Marketplace & Rights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Broadcast Marketplace */}
        <div
          onClick={onOpenMarketplace}
          className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/60 to-slate-900 border border-blue-500/30 hover:border-blue-400 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
              Pagar para Ser Visto
            </span>
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
            Broadcast Marketplace
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mt-1">
            Compre horários de exibição na grelha 24/7 (Madrugada, Manhã, Tarde ou Prime Time) com faturação transparente em Meticais.
          </p>
        </div>

        {/* Card 2: Legal Clearance */}
        <div
          onClick={onOpenClearance}
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              Direitos & Licenças
            </span>
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
            Legal Clearance & Contratos Digitais
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mt-1">
            Gestão de direitos autorais para filmes, músicas e eventos com termos claros, geotargeting e divisão de receita (RevShare 70/30).
          </p>
        </div>

        {/* Card 3: Commercial Blocks */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-500/30 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Megaphone className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
              Blocos de 5, 10 e 15m
            </span>
          </div>
          <h3 className="text-base font-bold text-white">
            Publicidade Organizada
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mt-1">
            Intervalos comerciais estruturados sem interrupções indesejadas no meio de obras, respeitando a experiência do público moçambicano.
          </p>
        </div>
      </div>
    </div>
  );
};
