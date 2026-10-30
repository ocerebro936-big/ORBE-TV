/**
 * Broadcast Atlas (broadcastatlas.com) Hub & Live Tuner
 * Direct connection to public live broadcasts, transmitters, and open streams worldwide.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Radio,
  Tv,
  Globe,
  MapPin,
  Volume2,
  VolumeX,
  Maximize2,
  ExternalLink,
  Compass,
  Signal,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Search,
  CheckCircle2,
  Sparkles,
  Satellite,
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  ATLAS_STATIONS,
  ATLAS_REGIONS,
  ATLAS_STATS,
  AtlasStation,
  AtlasRegion
} from '../../data/broadcast-atlas-data';
import { setupVideoStream, getChannelSources, StreamSourceOption } from '../../services/stream-resolver';
import { soundEffects } from '../../services/sound-effects';

interface BroadcastAtlasHubProps {
  onWatchInMainPlayer?: (station: AtlasStation) => void;
  onBackToPortal?: () => void;
  onOpenIptv?: () => void;
}

export const BroadcastAtlasHub: React.FC<BroadcastAtlasHubProps> = ({
  onWatchInMainPlayer,
  onBackToPortal,
  onOpenIptv
}) => {
  const [selectedStation, setSelectedStation] = useState<AtlasStation>(ATLAS_STATIONS[0]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<AtlasRegion>(ATLAS_REGIONS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.85);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [streamError, setStreamError] = useState(false);
  const [tunerFrequency, setTunerFrequency] = useState<number>(710.25);
  const [signalQuality, setSignalQuality] = useState<number>(98);
  const [isFineTuning, setIsFineTuning] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Filtered stations based on search and category
  const filteredStations = useMemo(() => {
    return ATLAS_STATIONS.filter((st) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.frequency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (st.callSign && st.callSign.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory =
        activeCategory === 'all' ||
        st.category === activeCategory ||
        (activeCategory === 'africa' && st.category === 'africa') ||
        (activeCategory === 'featured' && st.featured);

      return matchSearch && matchCategory;
    });
  }, [searchQuery, activeCategory]);

  // Sources for current station
  const sources: StreamSourceOption[] = useMemo(() => {
    const raw = getChannelSources(selectedStation.streamUrl, selectedStation.category, selectedStation.name);
    // Add any backup URLs defined in station
    if (selectedStation.backupUrls) {
      selectedStation.backupUrls.forEach((url, i) => {
        if (!raw.some((s) => s.url === url)) {
          raw.push({
            id: `atlas-backup-${i}`,
            label: `Atlas Relay ${i + 1}`,
            url,
            type: 'hls',
            description: 'Transmissão alternativa espelhada de alta disponibilidade',
            isRealBroadcast: true
          });
        }
      });
    }
    return raw;
  }, [selectedStation]);

  const currentSource = sources[sourceIndex] || sources[0];

  // Video stream initialization
  useEffect(() => {
    if (!videoRef.current || !currentSource) return;

    setStreamError(false);
    const video = videoRef.current;
    video.muted = isMuted;
    video.volume = volume;

    const cleanup = setupVideoStream(
      video,
      currentSource.url,
      {
        onError: (err: string) => {
          console.warn('Atlas stream error on', currentSource.label, err);
          if (sourceIndex + 1 < sources.length) {
            setSourceIndex((prev) => prev + 1);
          } else {
            setStreamError(true);
          }
        }
      }
    );

    return () => {
      cleanup();
    };
  }, [currentSource, isPlaying]);

  // Audio volume sync
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = volume;
    }
  }, [isMuted, volume]);

  // Audio spectrum visualization animation on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 32;
      const barWidth = canvas.width / bars - 2;

      for (let i = 0; i < bars; i++) {
        // Simulated RF spectrum response
        const wave = Math.sin(phase + i * 0.3) * 0.5 + 0.5;
        const noise = Math.random() * 0.2;
        const heightMultiplier = isPlaying && !isMuted ? wave * 0.8 + noise : 0.08 + Math.random() * 0.04;
        const barHeight = Math.max(4, canvas.height * heightMultiplier);

        const x = i * (barWidth + 2);
        const y = canvas.height - barHeight;

        const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
        grad.addColorStop(0, '#06b6d4'); // Cyan
        grad.addColorStop(0.5, '#3b82f6'); // Blue
        grad.addColorStop(1, '#1e1b4b'); // Indigo

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      phase += 0.12;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isMuted]);

  // Frequency tuner step handler
  const handleTuneStation = (station: AtlasStation) => {
    setSelectedStation(station);
    setSourceIndex(0);
    setStreamError(false);
    setIsPlaying(true);
    soundEffects.play('transmission_start');

    // Parse frequency digits
    const freqMatch = station.frequency.match(/[\d.]+/);
    if (freqMatch) {
      setTunerFrequency(parseFloat(freqMatch[0]));
    }
    // Random signal fluctuation
    setSignalQuality(Math.floor(92 + Math.random() * 7));
  };

  // Convert lat/lng to approximate SVG map percentage coordinates
  // Lat ranges -90 to 90, Lng ranges -180 to 180
  const getMapCoordinates = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x: Math.max(4, Math.min(96, x)), y: Math.max(6, Math.min(94, y)) };
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* TOP HEADER & INTRO */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950/60 to-indigo-950/80 border border-cyan-500/30 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Globe className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
                <span>Broadcast Atlas Official Directory</span>
              </span>
              <a
                href="https://broadcastatlas.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>broadcastatlas.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://github.com/iptv-org/awesome-iptv"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>iptv-org/awesome-iptv</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://github.com/iptv-org/awesome-iptv/discussions/categories/providers?discussions_q=is%3Aopen+category%3AProviders"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Provedores (Discussions)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              {onOpenIptv && (
                <button
                  onClick={onOpenIptv}
                  className="px-3 py-1 rounded-full bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400/40 text-cyan-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Tv className="w-3 h-3 text-cyan-400" />
                  <span>Ir para IPTV & Provedores</span>
                </button>
              )}
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>LIVE TUNER ATIVO</span>
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white flex items-center gap-3">
              <span>Broadcast Atlas</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
                · Live Tuner Mundial
              </span>
            </h1>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Aceda a transmissões públicas em direto, canais de notícias ao vivo (Reuters TV, DW, France 24, Euronews, Al Jazeera),
              câmaras terrestres e espaciais (NASA ISS, WildEarth Safari) e transmissores de alta potência mapeados geograficamente em todo o globo.
            </p>

            {/* Quick Metrics Bar */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Transmissões Globais</span>
                <span className="text-cyan-400 font-bold text-base font-mono">18,450+ feeds</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Transmissores Ativos</span>
                <span className="text-blue-400 font-bold text-base font-mono">3,820 torres</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Países Cobertos</span>
                <span className="text-emerald-400 font-bold text-base font-mono">142 nações</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Disponibilidade Média</span>
                <span className="text-amber-400 font-bold text-base font-mono">99.8% 24/7</span>
              </div>
            </div>
          </div>

          {/* Quick Zap to Featured Channels */}
          <div className="lg:w-72 shrink-0 p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/20 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sintonia Rápida</span>
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">Top Emissões</span>
            </div>

            <div className="space-y-1.5">
              {ATLAS_STATIONS.slice(0, 4).map((st) => (
                <button
                  key={st.id}
                  onClick={() => handleTuneStation(st)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                    selectedStation.id === st.id
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 font-bold shadow-md'
                      : 'hover:bg-slate-800/80 text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="block truncate font-medium">{st.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{st.city} · {st.countryCode}</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 shrink-0 bg-cyan-950/60 px-1.5 py-0.5 rounded">
                    {st.callSign || 'LIVE'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN STAGE: THE PHYSICAL-FEEL LIVE TUNER & PLAYER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* VIDEO DISPLAY & ON-AIR MONITOR (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-black border border-cyan-500/40 shadow-2xl aspect-video group">
            {/* Real HLS Video Tag */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              autoPlay
            />

            {/* CRT / Scanline subtle overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.5)_100%)]" />

            {/* Top HUD Overlay */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between text-xs z-10 pointer-events-auto">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono font-black text-[11px] tracking-wider flex items-center gap-1.5 shadow-lg animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span>ON AIR</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900/90 text-cyan-300 border border-cyan-500/30 font-mono text-[11px]">
                  {selectedStation.bandwidth}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 border border-slate-700 font-mono text-[11px] hidden sm:inline">
                  {selectedStation.frequency}
                </span>
              </div>

              {/* Unmute prompt & Controls */}
              <div className="flex items-center gap-2">
                {isMuted && (
                  <button
                    onClick={() => {
                      setIsMuted(false);
                      setVolume(0.9);
                      soundEffects.play('notification');
                    }}
                    className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer animate-bounce"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>ATIVAR ÁUDIO</span>
                  </button>
                )}

                {sources.length > 1 && (
                  <div className="hidden sm:flex items-center gap-1 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-700 text-[11px]">
                    <span className="text-slate-400">Fonte:</span>
                    <button
                      onClick={() => setSourceIndex((prev) => (prev + 1) % sources.length)}
                      className="text-cyan-300 hover:text-cyan-200 font-bold underline cursor-pointer"
                    >
                      {currentSource.label.split(' ')[0]} ({sourceIndex + 1}/{sources.length})
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white transition-colors cursor-pointer"
                  title={isMuted ? 'Desmutar' : 'Mutar'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
              </div>
            </div>

            {/* Error or fallback state banner */}
            {streamError && (
              <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center z-20 space-y-3">
                <Activity className="w-10 h-10 text-amber-400 animate-pulse" />
                <h4 className="text-white font-bold text-base">Sinal a Recalibrar</h4>
                <p className="text-slate-400 text-xs max-w-sm">
                  A tentar restabelecer ligação direta ao transponder de {selectedStation.city}.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSourceIndex((prev) => (prev + 1) % sources.length);
                      setStreamError(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Alternar Fonte ({sourceIndex + 1}/{sources.length})</span>
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Station Banner Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/70 to-transparent flex items-end justify-between text-xs z-10 pointer-events-auto">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-bold text-lg drop-shadow">{selectedStation.name}</h3>
                  <span className="text-xs text-cyan-300 font-mono font-semibold">[{selectedStation.callSign}]</span>
                </div>
                <p className="text-slate-300 text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span>{selectedStation.city}, {selectedStation.country}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400 font-mono text-[11px]">{selectedStation.transmitterTower.name}</span>
                </p>
              </div>

              {onWatchInMainPlayer && (
                <button
                  onClick={() => onWatchInMainPlayer(selectedStation)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 cursor-pointer"
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>Assistir no UBlue TV</span>
                </button>
              )}
            </div>
          </div>

          {/* TELEMETRY & AUDIO SPECTRUM STRIP */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center shrink-0">
                <Signal className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="space-y-0.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Lock de Transmissão:</span>
                  <span className="text-emerald-400 font-mono font-bold">{signalQuality}% LOCK</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-cyan-400 font-mono font-bold">-48 dBm</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Potência: <span className="text-slate-200">{selectedStation.transmitterTower.erp}</span> · Elevação: <span className="text-slate-200">{selectedStation.transmitterTower.elevation}</span>
                </div>
              </div>
            </div>

            {/* Spectrum Visualizer Canvas */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono hidden md:inline">RF Spectrum:</span>
              <canvas
                ref={canvasRef}
                width={160}
                height={32}
                className="w-40 h-8 rounded-lg bg-slate-950 border border-slate-800"
              />
            </div>
          </div>
        </div>

        {/* HARDWARE-FEEL LIVE TUNER DIAL & CONSOLE (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-cyan-500/30 p-5 shadow-2xl space-y-5">
            {/* Tuner Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
                  Broadcast Atlas · Live Tuner Console
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                PLL SYNTHESIZER
              </span>
            </div>

            {/* VFD Digital Frequency Display */}
            <div className="relative rounded-xl p-4 bg-black border-2 border-slate-800 shadow-inner overflow-hidden font-mono">
              <div className="flex items-center justify-between text-xs text-cyan-500/60 pb-1 border-b border-cyan-950">
                <span>TUNING FREQ</span>
                <span>CARRIER BAND</span>
                <span>STATUS</span>
              </div>

              <div className="flex items-baseline justify-between pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-cyan-400 tracking-wider drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]">
                    {tunerFrequency.toFixed(2)}
                  </span>
                  <span className="text-cyan-500 text-sm font-bold">MHz</span>
                </div>

                <div className="text-right">
                  <span className="text-emerald-400 font-bold text-xs block">
                    {selectedStation.callSign || 'VHF/UHF'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {selectedStation.countryCode} · {selectedStation.city}
                  </span>
                </div>
              </div>

              {/* Sub-line coordinates readout */}
              <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-900 mt-2">
                <span>LAT: {selectedStation.coordinates.lat.toFixed(4)}°</span>
                <span>LNG: {selectedStation.coordinates.lng.toFixed(4)}°</span>
                <span className="text-emerald-400 font-bold">● LOCKED</span>
              </div>
            </div>

            {/* Rotary Frequency Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>VHF-LO (54 MHz)</span>
                <span className="text-cyan-400 font-bold">{tunerFrequency.toFixed(1)} MHz</span>
                <span>UHF / OTT (890 MHz)</span>
              </div>
              <input
                type="range"
                min="54"
                max="890"
                step="0.25"
                value={tunerFrequency}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setTunerFrequency(val);
                  // Find closest station
                  const closest = ATLAS_STATIONS.reduce((prev, curr) => {
                    const prevF = parseFloat(prev.frequency.match(/[\d.]+/)?.[0] || '100');
                    const currF = parseFloat(curr.frequency.match(/[\d.]+/)?.[0] || '100');
                    return Math.abs(currF - val) < Math.abs(prevF - val) ? curr : prev;
                  });
                  if (closest.id !== selectedStation.id) {
                    setSelectedStation(closest);
                    setSourceIndex(0);
                  }
                }}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
              />
            </div>

            {/* Quick Band Selector Presets */}
            <div className="grid grid-cols-4 gap-2 text-xs font-mono">
              <button
                onClick={() => {
                  const st = ATLAS_STATIONS.find((s) => s.id === 'atlas-tvm-maputo') || ATLAS_STATIONS[0];
                  handleTuneStation(st);
                }}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-center cursor-pointer transition-colors"
              >
                <span className="block text-[10px] text-slate-400">VHF Ch 10</span>
                <span className="font-bold text-cyan-300 text-xs">210 MHz</span>
              </button>
              <button
                onClick={() => {
                  const st = ATLAS_STATIONS.find((s) => s.id === 'atlas-france24-en') || ATLAS_STATIONS[0];
                  handleTuneStation(st);
                }}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-center cursor-pointer transition-colors"
              >
                <span className="block text-[10px] text-slate-400">DVB-T Ch 35</span>
                <span className="font-bold text-cyan-300 text-xs">586 MHz</span>
              </button>
              <button
                onClick={() => {
                  const st = ATLAS_STATIONS.find((s) => s.id === 'atlas-reuters-live') || ATLAS_STATIONS[0];
                  handleTuneStation(st);
                }}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-center cursor-pointer transition-colors"
              >
                <span className="block text-[10px] text-slate-400">UHF Ch 51</span>
                <span className="font-bold text-cyan-300 text-xs">710 MHz</span>
              </button>
              <button
                onClick={() => {
                  const st = ATLAS_STATIONS.find((s) => s.id === 'atlas-nasa-iss') || ATLAS_STATIONS[0];
                  handleTuneStation(st);
                }}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-center cursor-pointer transition-colors"
              >
                <span className="block text-[10px] text-slate-400">Space Ku</span>
                <span className="font-bold text-cyan-300 text-xs">13.7 GHz</span>
              </button>
            </div>

            {/* Station Details Card */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Torre Emissora:</span>
                <span className="text-white font-medium">{selectedStation.transmitterTower.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Localização Geográfica:</span>
                <span className="text-cyan-300 font-mono">
                  {selectedStation.city}, {selectedStation.country}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Formato / Codec:</span>
                <span className="text-slate-200 font-mono">{selectedStation.bandwidth}</span>
              </div>
              <p className="text-slate-400 text-[11px] pt-1 border-t border-slate-900 leading-relaxed">
                {selectedStation.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE GLOBAL MAP / ATLAS (Geographically Mapped Broadcasts) */}
      <div className="rounded-3xl bg-slate-900/90 border border-cyan-500/20 p-6 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl md:text-2xl font-black text-white">
                Atlas Geográfico de Emissões Globais
              </h2>
            </div>
            <p className="text-slate-400 text-xs">
              Clique em qualquer baliza do planisfério para sintonizar a transmissão em direto daquela região.
            </p>
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {ATLAS_REGIONS.map((reg) => (
              <button
                key={reg.id}
                onClick={() => {
                  setSelectedRegion(reg);
                  soundEffects.play('notification');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedRegion.id === reg.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {reg.name}
              </button>
            ))}
          </div>
        </div>

        {/* SVG VECTOR WORLD MAP CANVAS */}
        <div className="relative w-full aspect-[2/1] rounded-2xl bg-[#030712] border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
          {/* Subtle Latitude & Longitude Grid Lines */}
          <svg className="absolute inset-0 w-full h-full stroke-slate-800/50 stroke-1 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <line x1="0%" y1="25%" x2="100%" y2="25%" strokeDasharray="3 3" />
            <line x1="0%" y1="50%" x2="100%" y2="50%" strokeDasharray="3 3" />
            <line x1="0%" y1="75%" x2="100%" y2="75%" strokeDasharray="3 3" />
            <line x1="25%" y1="0%" x2="25%" y2="100%" strokeDasharray="3 3" />
            <line x1="50%" y1="0%" x2="50%" y2="100%" strokeDasharray="3 3" />
            <line x1="75%" y1="0%" x2="75%" y2="100%" strokeDasharray="3 3" />
            {/* Equator & Prime Meridian highlight */}
            <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="rgba(6,182,212,0.2)" strokeWidth="1.5" />
            <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="rgba(6,182,212,0.2)" strokeWidth="1.5" />
          </svg>

          {/* Continents Outline Silhouette (Simplified Vector SVG) */}
          <svg className="absolute inset-0 w-full h-full fill-slate-900 stroke-slate-700/60 stroke-[0.8] opacity-75" viewBox="0 0 1000 500">
            {/* North America */}
            <path d="M120,80 Q220,70 260,110 Q280,160 250,220 Q200,240 170,220 Q120,180 120,80 Z" />
            {/* South America */}
            <path d="M260,250 Q330,260 330,330 Q310,420 270,450 Q230,380 240,300 Z" />
            {/* Europe */}
            <path d="M470,90 Q550,80 570,140 Q540,180 480,170 Q450,140 470,90 Z" />
            {/* Africa */}
            <path d="M480,190 Q580,180 580,260 Q570,360 520,420 Q460,370 450,260 Z" />
            {/* Asia */}
            <path d="M580,80 Q800,80 850,180 Q800,260 670,240 Q620,170 580,80 Z" />
            {/* Australia / Oceania */}
            <path d="M780,310 Q880,310 880,380 Q830,420 760,390 Q750,340 780,310 Z" />
          </svg>

          {/* Station Coordinates Beacons */}
          {ATLAS_STATIONS.map((station) => {
            const { x, y } = getMapCoordinates(station.coordinates.lat, station.coordinates.lng);
            const isSelected = selectedStation.id === station.id;

            return (
              <button
                key={station.id}
                onClick={() => handleTuneStation(station)}
                style={{ left: `${x}%`, top: `${y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20 focus:outline-none"
                title={`${station.name} (${station.city}, ${station.country})`}
              >
                {/* Pulsing ring */}
                <span
                  className={`absolute -inset-2 rounded-full ${
                    isSelected ? 'bg-cyan-400/40 animate-ping' : 'group-hover:bg-cyan-400/30'
                  }`}
                />

                {/* Central pin point */}
                <span
                  className={`relative block w-3.5 h-3.5 rounded-full border-2 transition-transform ${
                    isSelected
                      ? 'bg-cyan-400 border-white scale-125 shadow-[0_0_12px_#06b6d4]'
                      : 'bg-blue-600 border-slate-900 group-hover:scale-110 group-hover:bg-cyan-400'
                  }`}
                />

                {/* Floating Tooltip Label */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2.5 py-1 rounded-lg bg-slate-950/95 border border-cyan-500/40 text-[11px] text-white whitespace-nowrap shadow-xl pointer-events-none transition-all ${
                    isSelected ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 group-hover:scale-100'
                  }`}
                >
                  <span className="font-bold text-cyan-300 block">{station.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {station.city} · {station.frequency.split('·')[0]}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Map Footer Readout */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-400 font-mono bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>TRANSMISSORES ATIVOS: {ATLAS_STATIONS.length} ESTAÇÕES MAPEADAS</span>
            </span>
            <span className="hidden sm:inline text-cyan-400">
              SINTONIZADO: {selectedStation.name} ({selectedStation.city})
            </span>
          </div>
        </div>
      </div>

      {/* FILTER & STATIONS DIRECTORY GRID */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">Diretório de Canais e Transmissões</h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-mono">
              {filteredStations.length} estações
            </span>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por emissora, cidade, país..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'all', label: 'Todas as Emissões' },
            { id: 'featured', label: '⭐ Em Destaque' },
            { id: 'tv-news', label: 'Notícias 24/7 (Reuters, DW, F24)' },
            { id: 'africa', label: 'África & Moçambique' },
            { id: 'science-space', label: 'Espaço & Vida Selvagem' },
            { id: 'tv-general', label: 'Desporto & Entretenimento' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                soundEffects.play('notification');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Stations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStations.map((station) => {
            const isSelected = selectedStation.id === station.id;

            return (
              <div
                key={station.id}
                onClick={() => handleTuneStation(station)}
                className={`group relative rounded-2xl p-4 transition-all cursor-pointer overflow-hidden border ${
                  isSelected
                    ? 'bg-gradient-to-br from-cyan-950/40 via-blue-950/40 to-slate-900 border-cyan-400/50 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-400/30'
                    : 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                    <img
                      src={station.thumbnail}
                      alt={station.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-1 left-1 px-1 py-0.2 rounded bg-black/70 text-[9px] font-mono text-cyan-300">
                      {station.countryCode}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-white font-bold text-sm truncate group-hover:text-cyan-300 transition-colors">
                        {station.name}
                      </h4>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
                      )}
                    </div>

                    <p className="text-slate-400 text-xs flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{station.city}, {station.country}</span>
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/20">
                        {station.frequency.split('·')[0]}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        {station.bandwidth.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-400 text-xs mt-3 line-clamp-2 leading-relaxed">
                  {station.description}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 font-mono">
                    Torre: {station.transmitterTower.status}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTuneStation(station);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 group-hover:bg-cyan-500 group-hover:text-slate-950'
                    }`}
                  >
                    <span>{isSelected ? 'Sintonizado' : 'Sintonizar'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
