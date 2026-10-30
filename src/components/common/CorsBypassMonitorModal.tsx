import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Shield,
  Activity,
  Play,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Terminal,
  ExternalLink,
  Copy,
  Check,
  Radio,
  FileCode,
  Layers,
  Sparkles
} from 'lucide-react';
import Hls from 'hls.js';

interface CorsBypassMonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUrl?: string;
}

const PRESET_STREAMS = [
  {
    name: 'NASA TV Public HD (Akamai)',
    url: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
    category: 'Documentário / Espaço'
  },
  {
    name: 'Deluxe Music HD (Akamai)',
    url: 'https://deluxemusic.akamaized.net/hls/live/2034960/deluxemusic/master.m3u8',
    category: 'Música 24/7'
  },
  {
    name: 'Red Bull TV Live HD (Akamai)',
    url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
    category: 'Desporto Radical'
  },
  {
    name: 'France 24 English HD (Akamai)',
    url: 'https://static.france24.com/live/F24_EN_LO_HLS/live_tv.m3u8',
    category: 'Notícias Internacionais'
  },
  {
    name: 'CBS News Live HD (Cloudfront)',
    url: 'https://live-fast-cbsnews.cbsnews.com/out/v1/55b657e4e3e34b97a0ae7dd453b0a790/master.m3u8',
    category: 'Notícias Globais'
  },
  {
    name: 'TMDb @genesiswine Curated Feed',
    url: 'https://cph-p2p-msl.akamaized.net/hls/live/200034/test/master.m3u8',
    category: 'Cinema TMDb'
  }
];

export const CorsBypassMonitorModal: React.FC<CorsBypassMonitorModalProps> = ({
  isOpen,
  onClose,
  initialUrl = ''
}) => {
  const [testUrl, setTestUrl] = useState(initialUrl || PRESET_STREAMS[0].url);
  const [proxyEndpoint, setProxyEndpoint] = useState<'/api/proxy-stream' | '/api/proxy-playlist'>('/api/proxy-playlist');
  const [healthStatus, setHealthStatus] = useState<{
    status: string;
    engine?: string;
    features?: string[];
    pingMs?: number;
  } | null>(null);
  const [isHealthLoading, setIsHealthLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'player' | 'manifest' | 'headers' | 'architecture'>('player');

  const [isLoadingStream, setIsLoadingStream] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [streamSuccess, setStreamSuccess] = useState(false);
  const [manifestPreview, setManifestPreview] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Ping /api/proxy-health
  const checkProxyHealth = async () => {
    setIsHealthLoading(true);
    const start = performance.now();
    try {
      const res = await fetch('/api/proxy-health');
      const ping = Math.round(performance.now() - start);
      if (res.ok) {
        const data = await res.json();
        setHealthStatus({ ...data, pingMs: ping });
      } else {
        setHealthStatus({ status: 'offline', pingMs: ping });
      }
    } catch {
      setHealthStatus({ status: 'offline', pingMs: Math.round(performance.now() - start) });
    } finally {
      setIsHealthLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkProxyHealth();
    }
  }, [isOpen]);

  // Load stream via CORS Proxy
  const handleTestStream = async (overrideUrl?: string) => {
    const target = overrideUrl || testUrl;
    if (!target) return;

    setIsLoadingStream(true);
    setStreamError(null);
    setStreamSuccess(false);

    // Destroy existing Hls instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const proxiedUrl = `${proxyEndpoint}?url=${encodeURIComponent(target)}`;

    // Also fetch manifest text preview
    try {
      const res = await fetch(proxiedUrl);
      if (res.ok) {
        const text = await res.text();
        setManifestPreview(text.slice(0, 3000));
      } else {
        setManifestPreview(`Erro ${res.status}: ${res.statusText}`);
      }
    } catch (e: any) {
      setManifestPreview(`Erro ao obter manifest: ${e?.message || e}`);
    }

    const video = videoRef.current;
    if (!video) {
      setIsLoadingStream(false);
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60
      });
      hlsRef.current = hls;

      hls.loadSource(proxiedUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoadingStream(false);
        setStreamSuccess(true);
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setIsLoadingStream(false);
          setStreamError(`Erro HLS (${data.type}): ${data.details}`);
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = proxiedUrl;
      video.addEventListener('loadedmetadata', () => {
        setIsLoadingStream(false);
        setStreamSuccess(true);
        video.play().catch(() => {});
      });
      video.addEventListener('error', () => {
        setIsLoadingStream(false);
        setStreamError('Falha ao reproduzir fluxo no player nativo.');
      });
    } else {
      setIsLoadingStream(false);
      setStreamError('Navegador não suporta HLS.');
    }
  };

  const copyProxiedUrl = () => {
    const url = `${window.location.origin}${proxyEndpoint}?url=${encodeURIComponent(testUrl)}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in text-left">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#070b1a] border border-cyan-500/30 p-5 sm:p-7 shadow-2xl shadow-cyan-950/70 text-slate-200">
        
        {/* Close Button */}
        <button
          onClick={() => {
            if (hlsRef.current) {
              hlsRef.current.destroy();
              hlsRef.current = null;
            }
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-cyan-400 uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30">
              <Sparkles className="w-3 h-3" />
              <span>Infraestrutura de Streaming UBlue</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">Proxy de Sinal & Inversor de Cabeçalhos CORS</h3>
          </div>
        </div>

        {/* Server Status Pill */}
        <div className="mb-5 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                healthStatus?.status === 'online' ? 'bg-emerald-400' : 'bg-amber-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                healthStatus?.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}></span>
            </span>
            <span className="font-semibold text-white">
              Status do Servidor Proxy: {healthStatus?.status === 'online' ? 'Ativo & Operacional' : 'Verificando...'}
            </span>
            {healthStatus?.pingMs !== undefined && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 font-mono text-[11px]">
                {healthStatus.pingMs}ms
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={checkProxyHealth}
              disabled={isHealthLoading}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isHealthLoading ? 'animate-spin text-cyan-400' : ''}`} />
              <span>Testar Ping</span>
            </button>
          </div>
        </div>

        {/* Presets Grid */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Sinais Externos Verificados (Prontos para Teste):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESET_STREAMS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  setTestUrl(preset.url);
                  handleTestStream(preset.url);
                }}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  testUrl === preset.url
                    ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-md shadow-cyan-950/60'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
                }`}
              >
                <div className="font-bold truncate text-[11px] sm:text-xs text-white">{preset.name}</div>
                <div className="text-[10px] text-cyan-400/90 truncate mt-0.5">{preset.category}</div>
              </button>
            ))}
          </div>
        </div>

        {/* URL Input Bar */}
        <div className="mb-5 space-y-2">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
            URL Alvo Externa (.m3u8, .ts ou API):
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              placeholder="https://servidor-externo.com/canal/index.m3u8"
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-white font-mono text-xs focus:outline-none transition-colors"
            />

            <select
              value={proxyEndpoint}
              onChange={(e) => setProxyEndpoint(e.target.value as any)}
              className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-cyan-300 focus:outline-none cursor-pointer"
            >
              <option value="/api/proxy-playlist">/api/proxy-playlist (Reescrita .m3u8)</option>
              <option value="/api/proxy-stream">/api/proxy-stream (Fluxo Binário/TS)</option>
            </select>

            <button
              onClick={() => handleTestStream()}
              disabled={isLoadingStream}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-600/30 cursor-pointer"
            >
              {isLoadingStream ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
              <span>Sintonizar via Proxy</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="truncate">
              Link Gerado: <span className="font-mono text-cyan-300">{`${proxyEndpoint}?url=${encodeURIComponent(testUrl.slice(0, 50))}...`}</span>
            </span>
            <button
              onClick={copyProxiedUrl}
              className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors shrink-0 ml-2 cursor-pointer font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar URL do Proxy'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('player')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'player' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Player Ao Vivo</span>
          </button>
          <button
            onClick={() => setActiveTab('manifest')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'manifest' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Playlist .m3u8 Reescrita</span>
          </button>
          <button
            onClick={() => setActiveTab('headers')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'headers' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Cabeçalhos Invertidos</span>
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'architecture' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Fluxo de Rede</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'player' && (
          <div className="space-y-3">
            <div className="relative aspect-video w-full rounded-2xl bg-black border border-slate-800 overflow-hidden flex items-center justify-center">
              <video
                ref={videoRef}
                controls
                playsInline
                className="w-full h-full object-contain"
              />

              {isLoadingStream && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                  <span className="text-xs text-white font-medium">Sintonizando e invertendo cabeçalhos CORS...</span>
                </div>
              )}

              {streamError && (
                <div className="absolute bottom-3 inset-x-3 p-3 rounded-xl bg-red-950/90 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{streamError}</span>
                </div>
              )}

              {streamSuccess && !isLoadingStream && (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Sinal Estável via Proxy CORS</span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'manifest' && (
          <div className="space-y-2">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Conteúdo da Playlist HLS após Reescrita Dinâmica:</span>
              <span className="text-[10px] text-cyan-400 font-mono">
                Segmentos (.ts) remapeados para /api/proxy-stream
              </span>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 max-h-72 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {manifestPreview || 'Clique em "Sintonizar via Proxy" para carregar e inspecionar a playlist.'}
            </pre>
          </div>
        )}

        {activeTab === 'headers' && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
            <h4 className="font-bold text-white text-sm font-sans flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Cabeçalhos HTTP Injetados pelo Servidor UBlue:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-emerald-400 font-bold">Access-Control-Allow-Origin:</span>
                <span className="text-white ml-2">*</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-emerald-400 font-bold">Access-Control-Allow-Methods:</span>
                <span className="text-white ml-2">GET, HEAD, OPTIONS</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-emerald-400 font-bold">Access-Control-Allow-Headers:</span>
                <span className="text-white ml-2">Range, Content-Type, Authorization, Accept</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-emerald-400 font-bold">Access-Control-Expose-Headers:</span>
                <span className="text-white ml-2">Content-Length, Content-Range, Accept-Ranges</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold">User-Agent (Mascarado):</span>
                <span className="text-slate-300 block text-[10px] mt-0.5 truncate">
                  Mozilla/5.0 (SmartTV; UBlueTV Proxy Engine/3.2; Linux) Chrome/124.0.0.0 Safari/537.36
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold">Referer (Upstream Spoofed):</span>
                <span className="text-slate-300 block text-[10px] mt-0.5 truncate">
                  Auto-detectado da origem original do sinal
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs leading-relaxed">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Como o Proxy Remove 100% dos Bloqueios:</span>
            </h4>
            <div className="space-y-2 text-slate-300">
              <p>
                1. <strong>Navegador / App:</strong> Pede o arquivo <code className="text-cyan-300 font-mono">/api/proxy-playlist?url=...</code> para a própria origem do UBlue TV. Zero bloqueio de mesma origem (same-origin).
              </p>
              <p>
                2. <strong>Backend Node.js (corsProxyServer.js):</strong> Conecta ao servidor CDN externo usando <code className="text-cyan-300 font-mono">axios</code> ou streaming fetch. Mascara o User-Agent e o cabeçalho Referer, contornando proteções anti-leech e anti-crawler.
              </p>
              <p>
                3. <strong>Inversão de Cabeçalhos:</strong> Devolve os dados para o player adicionando <code className="text-emerald-400 font-mono">Access-Control-Allow-Origin: *</code> e suporte a <code className="text-emerald-400 font-mono">Range: bytes</code> para busca e buffering veloz.
              </p>
              <p>
                4. <strong>Reescrita de Manifests .m3u8:</strong> As linhas com pedaços de vídeo (<code className="text-cyan-300 font-mono">.ts</code>, <code className="text-cyan-300 font-mono">.m4s</code>) e chaves de criptografia AES-128 são convertidas automaticamente para passar pelo proxy.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
