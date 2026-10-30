import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Camera,
  Layers,
  Radio,
  Tv,
  Sparkles,
  Sliders,
  AlertCircle,
  Users,
  Film,
  Zap,
  Globe2,
  Settings,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { VirtualStudioScene, LowerThirdOverlay, PlayoutScheduleItem } from '../../types/live-network';
import { MOCK_PLAYOUT_SCHEDULE, MOCK_BREAKING_NEWS_TICKER } from '../../data/live-network-data';

interface VirtualStudioPlayerProps {
  onOpenStudioControls?: () => void;
  onSelectScene?: (scene: VirtualStudioScene) => void;
}

export const VirtualStudioPlayer: React.FC<VirtualStudioPlayerProps> = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeScene, setActiveScene] = useState<VirtualStudioScene>('central-maputo');
  const [activeCamera, setActiveCamera] = useState<'cam1' | 'cam2' | 'cam3'>('cam1');
  const [customHlsUrl, setCustomHlsUrl] = useState('');
  const [useCustomStream, setUseCustomStream] = useState(false);
  const [isStudioControlsOpen, setIsStudioControlsOpen] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);

  // Lower third graphics generator state
  const [lowerThird, setLowerThird] = useState<LowerThirdOverlay>({
    active: true,
    kicker: 'DIRETO · MAPUTO',
    headline: 'UBLUE TV LIVE NETWORK EM OPERAÇÃO 24/7',
    subline: 'O seu canal favorito, em qualquer lugar, a qualquer momento.',
    theme: 'standard-blue'
  });

  // Current playout item
  const currentItem = MOCK_PLAYOUT_SCHEDULE.find(p => p.status === 'no-ar') || MOCK_PLAYOUT_SCHEDULE[6];
  const nextItem = MOCK_PLAYOUT_SCHEDULE.find(p => p.status === 'a-seguir') || MOCK_PLAYOUT_SCHEDULE[7];

  // Canvas animation ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-rotate ticker headlines
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % MOCK_BREAKING_NEWS_TICKER.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Studio canvas animation engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isPlaying || useCustomStream) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Studio background based on activeScene
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (activeScene === 'central-maputo') {
        grad.addColorStop(0, '#0a1936');
        grad.addColorStop(0.5, '#0e2452');
        grad.addColorStop(1, '#050a1c');
      } else if (activeScene === 'newsroom-24h') {
        grad.addColorStop(0, '#091c33');
        grad.addColorStop(0.5, '#0c1b30');
        grad.addColorStop(1, '#020713');
      } else if (activeScene === 'estudio-acustico') {
        grad.addColorStop(0, '#2b1406');
        grad.addColorStop(0.5, '#1e1108');
        grad.addColorStop(1, '#0a0603');
      } else {
        // talent-stage
        grad.addColorStop(0, '#2d0f36');
        grad.addColorStop(0.5, '#190a29');
        grad.addColorStop(1, '#070211');
      }

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Studio virtual ambient lights / beams
      const beamX = (Math.sin(frame * 0.02) * 0.4 + 0.5) * canvas.width;
      const beamGrad = ctx.createRadialGradient(beamX, 80, 10, beamX, 80, canvas.width * 0.6);
      if (activeScene === 'talent-stage') {
        beamGrad.addColorStop(0, 'rgba(217, 70, 239, 0.35)');
        beamGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else if (activeScene === 'estudio-acustico') {
        beamGrad.addColorStop(0, 'rgba(245, 158, 11, 0.25)');
        beamGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        beamGrad.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
        beamGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }
      ctx.fillStyle = beamGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3. Virtual studio floor grid with perspective
      ctx.strokeStyle = activeScene === 'talent-stage' ? 'rgba(232, 121, 249, 0.15)' : 'rgba(56, 189, 248, 0.12)';
      ctx.lineWidth = 1;
      const floorY = canvas.height * 0.65;
      for (let x = -canvas.width; x <= canvas.width * 2; x += 60) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, floorY - 50);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = floorY; y <= canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 4. Studio Virtual Screen in background (animated audio waveform / graph)
      const screenW = canvas.width * 0.55;
      const screenH = canvas.height * 0.35;
      const screenX = (canvas.width - screenW) / 2;
      const screenY = canvas.height * 0.15;

      ctx.fillStyle = 'rgba(7, 13, 33, 0.85)';
      ctx.fillRect(screenX, screenY, screenW, screenH);
      ctx.strokeStyle = activeScene === 'talent-stage' ? 'rgba(232, 121, 249, 0.6)' : 'rgba(59, 130, 246, 0.6)';
      ctx.strokeRect(screenX, screenY, screenW, screenH);

      // Audio bars inside background studio screen
      const bars = 24;
      const barW = (screenW - 20) / bars;
      for (let i = 0; i < bars; i++) {
        const h = Math.abs(Math.sin(frame * 0.08 + i * 0.4)) * (screenH * 0.6) + 10;
        ctx.fillStyle = activeScene === 'talent-stage' ? '#d946ef' : activeScene === 'estudio-acustico' ? '#f59e0b' : '#38bdf8';
        ctx.fillRect(screenX + 10 + i * barW, screenY + screenH - h - 5, barW - 3, h);
      }

      // 5. Studio On-Air Desk / Podium
      ctx.fillStyle = '#0b1329';
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, canvas.height * 0.78, canvas.width * 0.35, 45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(96, 165, 250, 0.4)';
      ctx.stroke();

      // Camera Angle Indicator text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText(`[${activeCamera.toUpperCase()}] · ${activeScene.toUpperCase()} · 1080p60`, 25, 35);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, activeScene, activeCamera, useCustomStream]);

  return (
    <div className="space-y-4 text-left">
      {/* Broadcast Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-red-600/20">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white">ORBE TV Live Network</span>
              <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-black uppercase animate-pulse">
                Canal 24/7 No Ar
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Estúdio Virtual com Playout Automatizado · Transmissão Mestre Nacional
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Scene Selector */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveScene('central-maputo')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeScene === 'central-maputo' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Estúdio Central
            </button>
            <button
              onClick={() => setActiveScene('newsroom-24h')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeScene === 'newsroom-24h' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Newsroom 24h
            </button>
            <button
              onClick={() => setActiveScene('talent-stage')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeScene === 'talent-stage' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Talent Stage
            </button>
            <button
              onClick={() => setActiveScene('estudio-acustico')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeScene === 'estudio-acustico' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Acústico
            </button>
          </div>

          <button
            onClick={() => setIsStudioControlsOpen(!isStudioControlsOpen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Master Switcher</span>
          </button>
        </div>
      </div>

      {/* Main Broadcast Screen Area */}
      <div
        ref={containerRef}
        className="relative aspect-video w-full rounded-3xl bg-black border border-slate-800 overflow-hidden shadow-2xl select-none group"
      >
        {useCustomStream && customHlsUrl ? (
          <video
            src={customHlsUrl}
            autoPlay
            controls
            className="w-full h-full object-cover"
          />
        ) : (
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            className="w-full h-full object-cover"
          />
        )}

        {/* Channel Logo Watermark */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 shadow-lg">
          <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-white text-[11px] font-black">
            U
          </div>
          <span className="text-xs font-black text-white">UBLUE <span className="text-blue-400">TV</span></span>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse ml-1" />
        </div>

        {/* Top Left Program & Live Viewers info */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 text-xs">
          <div className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-extrabold flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>EM DIRETO</span>
          </div>

          <div className="px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-white font-medium flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>32.450 telespectadores</span>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-cyan-300 font-mono text-[11px]">
            {activeCamera === 'cam1' ? 'CAM 1 · GERAL' : activeCamera === 'cam2' ? 'CAM 2 · APRESENTADOR' : 'CAM 3 · PLATEIA'}
          </div>
        </div>

        {/* Lower Third (GC) Graphic Overlay on Broadcast */}
        {lowerThird.active && (
          <div className="absolute bottom-10 left-6 z-20 max-w-xl animate-fade-in">
            <div className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-t-lg shadow-md ${
              lowerThird.theme === 'breaking-news'
                ? 'bg-red-600 text-white'
                : lowerThird.theme === 'talent-gold'
                ? 'bg-amber-500 text-black'
                : lowerThird.theme === 'sports-green'
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 text-white'
            }`}>
              {lowerThird.kicker}
            </div>
            <div className="p-3.5 rounded-b-xl rounded-tr-xl bg-slate-950/95 backdrop-blur-xl border border-white/20 shadow-2xl">
              <h2 className="text-sm sm:text-base font-black text-white tracking-tight line-clamp-1">
                {lowerThird.headline}
              </h2>
              <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                {lowerThird.subline}
              </p>
            </div>
          </div>
        )}

        {/* Breaking News Ticker on Screen Bottom */}
        <div className="absolute bottom-0 inset-x-0 z-20 h-8 bg-gradient-to-r from-red-700 via-red-600 to-blue-900 flex items-center px-4 overflow-hidden border-t border-red-500/40">
          <div className="bg-black/40 px-2 py-0.5 rounded text-[10px] font-black uppercase text-white tracking-widest mr-3 shrink-0">
            NOTÍCIAS 24H
          </div>
          <div className="text-xs font-semibold text-white truncate font-sans">
            {MOCK_BREAKING_NEWS_TICKER[tickerIndex]}
          </div>
        </div>

        {/* Hover Media Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col justify-end p-6 pb-12 pointer-events-none">
          <div className="flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              <div className="text-xs text-slate-300 font-medium">
                No Ar: <strong className="text-white">{currentItem.title}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveCamera(activeCamera === 'cam1' ? 'cam2' : activeCamera === 'cam2' ? 'cam3' : 'cam1')}
                className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Alternar Ângulo ({activeCamera.toUpperCase()})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Playout Bar: No Ar & A Seguir */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-blue-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={currentItem.thumbnail} alt={currentItem.title} className="w-16 h-12 rounded-xl object-cover" />
            <div>
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block">No Ar Agora ({currentItem.timeSlot})</span>
              <div className="text-xs font-bold text-white line-clamp-1">{currentItem.title}</div>
              <span className="text-[10px] text-slate-400 font-mono">Duração: {currentItem.durationMinutes} min</span>
            </div>
          </div>
          <span className="px-2 py-1 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase">
            Direto
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={nextItem.thumbnail} alt={nextItem.title} className="w-16 h-12 rounded-xl object-cover" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">A Seguir ({nextItem.timeSlot})</span>
              <div className="text-xs font-bold text-slate-200 line-clamp-1">{nextItem.title}</div>
              <span className="text-[10px] text-slate-400 font-mono">Duração: {nextItem.durationMinutes} min</span>
            </div>
          </div>
          <span className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-[10px] font-bold uppercase">
            Grade 24h
          </span>
        </div>
      </div>

      {/* Virtual Studio Master Switcher Drawer */}
      {isStudioControlsOpen && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-blue-500/40 space-y-6 animate-fade-in text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-black text-white">Mesa de Controle Master (Virtual Studio NOC)</h3>
            </div>
            <button
              onClick={() => setIsStudioControlsOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              Fechar Painel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Camera Switcher */}
            <div className="space-y-3">
              <span className="font-bold text-white uppercase text-[11px] block">1. Switcher de Câmeras</span>
              <div className="grid grid-cols-3 gap-2">
                {(['cam1', 'cam2', 'cam3'] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => setActiveCamera(c)}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs cursor-pointer ${
                      activeCamera === c ? 'bg-red-600 text-white border-red-500' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {c.toUpperCase()}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400">
                Alterna entre os ângulos virtuais de enquadramento do apresentador e do cenário 3D.
              </p>
            </div>

            {/* 2. Lower Third Editor */}
            <div className="space-y-2">
              <span className="font-bold text-white uppercase text-[11px] block">2. Gerador de Caracteres (GC)</span>
              <input
                type="text"
                value={lowerThird.headline}
                onChange={(e) => setLowerThird({ ...lowerThird, headline: e.target.value })}
                placeholder="Manchete do GC"
                className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2 text-white text-xs"
              />
              <input
                type="text"
                value={lowerThird.subline}
                onChange={(e) => setLowerThird({ ...lowerThird, subline: e.target.value })}
                placeholder="Subtítulo do GC"
                className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2 text-white text-xs"
              />
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setLowerThird({ ...lowerThird, active: !lowerThird.active })}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer ${
                    lowerThird.active ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {lowerThird.active ? 'GC No Ar' : 'GC Oculto'}
                </button>
                <select
                  value={lowerThird.theme}
                  onChange={(e) => setLowerThird({ ...lowerThird, theme: e.target.value as any })}
                  className="rounded-lg bg-slate-900 border border-slate-700 p-1.5 text-white text-xs"
                >
                  <option value="standard-blue">Tema Padrão Azul</option>
                  <option value="breaking-news">Breaking News Vermelho</option>
                  <option value="talent-gold">Talent Show Dourado</option>
                  <option value="sports-green">Desporto Verde</option>
                </select>
              </div>
            </div>

            {/* 3. Real Stream HLS Input */}
            <div className="space-y-2">
              <span className="font-bold text-white uppercase text-[11px] block">3. Ingestão HLS Real (.m3u8)</span>
              <input
                type="text"
                value={customHlsUrl}
                onChange={(e) => setCustomHlsUrl(e.target.value)}
                placeholder="https://exemplo.com/stream.m3u8"
                className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2 text-white text-xs font-mono"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUseCustomStream(!useCustomStream)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer ${
                    useCustomStream ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {useCustomStream ? 'Usando Stream HLS' : 'Usar Simulação 3D'}
                </button>
                <span className="text-[10px] text-slate-400">
                  Compatível com IPTV-Org e RTMP
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
