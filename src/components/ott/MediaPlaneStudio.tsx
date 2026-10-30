import React, { useState, useEffect, useRef } from 'react';
import { mediaPlaneEngine } from '../../engine/media-plane-engine';
import { IngestEndpointConfig, VideoResolution } from '../../types/ott-architecture';
import { Play, Pause, Radio, Cpu, Layers, Activity, Copy, Check, Eye, RefreshCw, Volume2, Maximize, ShieldAlert, Sparkles } from 'lucide-react';

export const MediaPlaneStudio: React.FC = () => {
  const [stream, setStream] = useState<IngestEndpointConfig>(mediaPlaneEngine.getStream());
  const [selectedResolution, setSelectedResolution] = useState<VideoResolution | 'auto'>('auto');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.85);
  const [manifestView, setManifestView] = useState<'master' | 'variant'>('master');
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [currentSeq, setCurrentSeq] = useState<number>(1420);
  const [simulatedFps, setSimulatedFps] = useState<number>(59.9);
  const [simulatedBitrate, setSimulatedBitrate] = useState<number>(4520);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Periodic updates for live streaming simulation
  useEffect(() => {
    const timer = setInterval(() => {
      mediaPlaneEngine.advanceSegments(stream.channelId);
      setCurrentSeq(prev => prev + 1);
      setSimulatedFps(+(59.5 + Math.random() * 0.8).toFixed(1));
      setSimulatedBitrate(Math.floor(4400 + Math.random() * 250));
    }, 4000);
    return () => clearInterval(timer);
  }, [stream.channelId]);

  // Video canvas visualizer animation
  useEffect(() => {
    let animId: number;
    let t = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      t += 0.04;
      const w = canvas.width;
      const h = canvas.height;

      // Dark studio background
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#040714');
      grad.addColorStop(0.5, '#0a122e');
      grad.addColorStop(1, '#050a1c');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      if (isPlaying) {
        // Glowing waves
        for (let j = 0; j < 3; j++) {
          ctx.beginPath();
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = j === 0 ? 'rgba(59, 130, 246, 0.7)' : j === 1 ? 'rgba(6, 182, 212, 0.6)' : 'rgba(168, 85, 247, 0.4)';
          for (let x = 0; x < w; x += 6) {
            const y = h / 2 + Math.sin(x * 0.015 + t + j) * (25 + j * 12) + Math.cos(x * 0.008 - t) * 15;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // Live watermark
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.font = 'bold 14px monospace';
        ctx.fillText('UBLUE TV 24/7 • EMISSÃO OFICIAL EM DIRETO', 24, 36);

        ctx.fillStyle = 'rgba(6, 182, 212, 0.9)';
        ctx.font = '11px monospace';
        const resText = selectedResolution === 'auto' ? 'AUTO (1080p ABR)' : selectedResolution;
        ctx.fillText(`HLS MASTER • ${resText} • ${simulatedFps} FPS • ${simulatedBitrate} kbps • SEG #${currentSeq}`, 24, 56);
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('STREAM EM PAUSA', w / 2, h / 2);
        ctx.textAlign = 'left';
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, selectedResolution, currentSeq, simulatedFps, simulatedBitrate]);

  const masterManifest = mediaPlaneEngine.generateMasterManifest(stream.channelId);
  const variantManifest = mediaPlaneEngine.generateVariantManifest(
    stream.channelId,
    selectedResolution === 'auto' ? '1080p' : selectedResolution
  );

  const handleCopyKey = () => {
    navigator.clipboard.writeText(stream.streamKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-slate-950 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono font-semibold border border-blue-500/20 mb-2">
            <Radio className="w-3.5 h-3.5" />
            <span>Pipeline de Vídeo • Ingest & Transcoding Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Media Plane Command & Control</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Monitorização em tempo real de entrada RTMP/SRT, cluster de transcodificação multi-bitrate H.264/AAC, empacotamento HLS e distribuição via Cloudflare CDN.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>INGEST ONLINE</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono font-medium border border-slate-700">
            {stream.activeViewers.toLocaleString()} Espectadores
          </div>
        </div>
      </div>

      {/* Main Grid: Player & Ingest Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Player Simulator (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl aspect-video flex flex-col justify-between">
            <canvas ref={canvasRef} width={640} height={360} className="w-full h-full object-cover" />

            {/* Overlaid Player Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-white font-bold">AO VIVO</span>
                  <span className="text-slate-500">•</span>
                  <span>Latência: 1.1s</span>
                </div>
              </div>

              {/* Bitrate Selector (ABR) */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Qualidade:</span>
                <select
                  value={selectedResolution}
                  onChange={(e) => setSelectedResolution(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-cyan-300 font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="auto">Auto (ABR Dinâmico)</option>
                  <option value="1080p">1080p Full HD (4.5M)</option>
                  <option value="720p">720p HD (2.4M)</option>
                  <option value="480p">480p SD (1.2M)</option>
                  <option value="360p">360p Eco (600k)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Transcoder Multi-bitrate Ladder Live State */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span>FFmpeg Transcoder Multi-Bitrate Output (Renditions Ativas)</span>
              </h3>
              <span className="text-[11px] font-mono text-emerald-400">GPU Cluster 0% Drops</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stream.renditions.map((r) => {
                const isActive = selectedResolution === 'auto' ? r.resolution === '1080p' : selectedResolution === r.resolution;
                return (
                  <div
                    key={r.resolution}
                    onClick={() => setSelectedResolution(r.resolution)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-950/60 border-blue-500 shadow-md shadow-blue-900/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-white">{r.resolution}</span>
                      <span className="text-[10px] font-mono text-cyan-400">{r.videoBitrateKbps}k</span>
                    </div>
                    <div className="text-[10px] text-slate-400">{r.width}x{r.height} @ {r.fps}fps</div>
                    <div className="text-[10px] text-slate-500 truncate mt-1">HLS {r.chunkDurationSec}s chunks</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Ingest Endpoints & HLS Manifest Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Ingest Server Configuration Box */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>Parâmetros de Ingest (Estúdios & Parceiros)</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono">RTMP URL (Primário):</label>
                <div className="font-mono text-[11px] text-slate-200 bg-slate-950 p-2 rounded-lg border border-slate-800 select-all truncate">
                  {stream.rtmpUrl}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono">SRT Caller URL (Baixa Latência):</label>
                <div className="font-mono text-[11px] text-cyan-300 bg-slate-950 p-2 rounded-lg border border-slate-800 select-all truncate">
                  {stream.srtUrl}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono">Chave de Transmissão (Stream Key):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    readOnly
                    value={stream.streamKey}
                    className="flex-1 font-mono text-[11px] text-amber-300 bg-slate-950 p-2 rounded-lg border border-slate-800 focus:outline-none"
                  />
                  <button
                    onClick={handleCopyKey}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                    title="Copiar Stream Key"
                  >
                    {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Codec Entrada: H.264 Main</span>
              <span>Áudio: AAC 48kHz</span>
            </div>
          </div>

          {/* HLS Manifest Live Inspector */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Manifesto HLS em Tempo Real</span>
              </h3>
              <div className="flex items-center gap-1 text-[10px] font-mono">
                <button
                  onClick={() => setManifestView('master')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    manifestView === 'master' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  master.m3u8
                </button>
                <button
                  onClick={() => setManifestView('variant')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    manifestView === 'variant' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  chunklist.m3u8
                </button>
              </div>
            </div>

            <pre className="p-3 rounded-xl bg-slate-950 text-[11px] font-mono text-cyan-300 border border-slate-800/80 max-h-56 overflow-y-auto leading-relaxed">
              {manifestView === 'master' ? masterManifest.rawManifestText : variantManifest}
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
};
