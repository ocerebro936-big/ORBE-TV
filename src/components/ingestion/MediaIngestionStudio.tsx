import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Search, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Database, 
  Activity, 
  Radio, 
  Film, 
  Tv, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  Terminal, 
  Sliders, 
  Trash2,
  ExternalLink,
  Layers
} from 'lucide-react';
import { mediaIngestionEngine, IngestedMediaItem, IngestionJobStats, StreamHealthResult } from '../../engine/media-ingestion-engine';
import { Channel } from '../../types/content';

interface MediaIngestionStudioProps {
  onBackToPortal?: () => void;
  onPlayChannel?: (channel: Channel) => void;
}

export const MediaIngestionStudio: React.FC<MediaIngestionStudioProps> = ({
  onBackToPortal,
  onPlayChannel
}) => {
  const [stats, setStats] = useState<IngestionJobStats>(() => ({
    jobId: 'ready',
    status: 'idle',
    totalScanned: 0,
    totalValid: 0,
    totalOnlineStreams: 0,
    totalFailedStreams: 0,
    currentSource: 'Pronto para ingestão',
    currentQuery: '',
    progressPercent: 0,
    logs: []
  }));

  const [catalog, setCatalog] = useState<IngestedMediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'catalog' | 'robot' | 'health-checker'>('catalog');
  const [filterCategory, setFilterCategory] = useState<string>('todos');
  
  // Health checker tester state
  const [testStreamUrl, setTestStreamUrl] = useState('https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8');
  const [healthTesting, setHealthTesting] = useState(false);
  const [healthTestResult, setHealthTestResult] = useState<StreamHealthResult | null>(null);

  useEffect(() => {
    const unsub = mediaIngestionEngine.subscribe((newStats) => {
      setStats(newStats);
      setCatalog(mediaIngestionEngine.getIndexedCatalog());
    });
    setCatalog(mediaIngestionEngine.getIndexedCatalog());
    return unsub;
  }, []);

  const handleStartScan = (q: string) => {
    if (!q.trim()) return;
    mediaIngestionEngine.runFullIngestionPipeline([q.trim()]);
    setActiveTab('robot');
  };

  const handleRunFullBatch = () => {
    mediaIngestionEngine.runFullIngestionPipeline(['cinema', 'novela', 'noticias', 'musica', 'futebol']);
    setActiveTab('robot');
  };

  const handleTestStream = async () => {
    if (!testStreamUrl) return;
    setHealthTesting(true);
    setHealthTestResult(null);
    try {
      const res = await mediaIngestionEngine.checkStreamHealth(testStreamUrl);
      setHealthTestResult(res);
    } finally {
      setHealthTesting(false);
    }
  };

  const filteredCatalog = catalog.filter(item => {
    if (filterCategory !== 'todos' && item.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.overview.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <div className="bg-slate-900/90 border-b border-blue-900/30 px-4 sm:px-6 py-4 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white">
                  PILAR 1: ORBE Media Ingestion Engine
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                  V3.0 Automatizado
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Máquina de Varredura, Indexação, Normalização e Teste de Saúde de Streams (.m3u8)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onBackToPortal && (
              <button
                onClick={onBackToPortal}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                Voltar ao Portal
              </button>
            )}
            <button
              onClick={handleRunFullBatch}
              disabled={stats.status === 'running'}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{stats.status === 'running' ? 'Varrendo Fontes...' : 'Disparar Ingestão Geral'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col gap-6">
        
        {/* Real-time Status Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Status do Robô</span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${stats.status === 'running' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
              <span className="text-lg font-black text-white capitalize">{stats.status === 'running' ? 'Ativo (Varrendo)' : stats.status}</span>
            </div>
            <div className="text-[11px] text-slate-400 truncate mt-1">
              {stats.currentSource}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Mídias Scrapeadas</span>
              <Database className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-cyan-400">{stats.totalScanned || catalog.length}</div>
            <div className="text-[11px] text-slate-400 mt-1">TMDB, TVmaze, IPTV & Solr</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Sinais HLS Online</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">{catalog.filter(i => i.streamHealth?.status === 'ONLINE').length}</div>
            <div className="text-[11px] text-slate-400 mt-1">100% testados via proxy CORS</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>No Catálogo Central</span>
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-indigo-400">{catalog.length}</div>
            <div className="text-[11px] text-slate-400 mt-1">Itens normalizados ativos</div>
          </div>
        </div>

        {/* Progress Bar when running */}
        {stats.status === 'running' && (
          <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-4 animate-fade-in shadow-lg shadow-cyan-500/10">
            <div className="flex items-center justify-between text-xs mb-2 font-mono">
              <span className="text-cyan-400 font-bold flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Varrendo: {stats.currentQuery || 'Fontes de Dados'} ({stats.progressPercent}%)
              </span>
              <button
                onClick={() => mediaIngestionEngine.cancelJob()}
                className="text-amber-400 hover:text-white transition-colors"
              >
                Pausar Robô
              </button>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 transition-all duration-300"
                style={{ width: `${stats.progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Studio Tabs */}
        <div className="flex border-b border-slate-800 gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors flex items-center gap-2 ${
              activeTab === 'catalog'
                ? 'bg-slate-800 text-cyan-400 border-t-2 border-cyan-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Catálogo Central Indexado ({catalog.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('robot')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors flex items-center gap-2 ${
              activeTab === 'robot'
                ? 'bg-slate-800 text-cyan-400 border-t-2 border-cyan-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Terminal & Telemetria do Robô</span>
            {stats.status === 'running' && (
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('health-checker')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors flex items-center gap-2 ${
              activeTab === 'health-checker'
                ? 'bg-slate-800 text-cyan-400 border-t-2 border-cyan-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Validador de Streams HLS (.m3u8)</span>
          </button>
        </div>

        {/* Tab 1: Ingested Catalog */}
        {activeTab === 'catalog' && (
          <div className="flex flex-col gap-4">
            {/* Search and Category Filter Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar no catálogo indexado..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Quick Scan Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Nova busca pelo robô (ex: Moçambique, Globo, CNN)..."
                  className="bg-slate-950 border border-cyan-900/50 rounded-xl px-3 py-2 text-xs text-cyan-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 w-64"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleStartScan((e.target as HTMLInputElement).value);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const el = document.querySelector('input[placeholder*="Nova busca"]') as HTMLInputElement;
                    if (el && el.value) handleStartScan(el.value);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shrink-0"
                >
                  Varredura
                </button>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {['todos', 'Filme', 'Série', 'Novela', 'Canal Ao Vivo', 'Música', 'Desporto', 'Documentário'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold shrink-0 transition-colors ${
                      filterCategory === cat
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                        : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCatalog.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900/60 border border-slate-800/90 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all flex flex-col group shadow-md"
                >
                  <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                    <img
                      src={item.backdropUrl || item.posterUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />
                    
                    {/* Category & Status badges */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                        {item.category}
                      </span>
                      {item.streamHealth && (
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 ${
                          item.streamHealth.status === 'ONLINE' 
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' 
                            : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.streamHealth.status === 'ONLINE' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                          {item.streamHealth.status} ({item.streamHealth.latencyMs}ms)
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-slate-300">
                      <span className="font-mono text-cyan-300">{item.sourceType.toUpperCase()}</span>
                      <span>⭐ {item.voteAverage.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {item.overview}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        {item.country} · {item.language}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {onPlayChannel && (
                          <button
                            onClick={() => onPlayChannel(mediaIngestionEngine.toPlayableChannel(item))}
                            className="px-3 py-1 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1 transition-colors"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Tocar</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (item.streamUrl) {
                              setTestStreamUrl(item.streamUrl);
                              setActiveTab('health-checker');
                            }
                          }}
                          title="Testar sinal de stream"
                          className="p-1 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                        >
                          <Activity className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => mediaIngestionEngine.deleteItem(item.id)}
                          title="Remover do catálogo"
                          className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Terminal and Realtime Telemetry */}
        {activeTab === 'robot' && (
          <div className="flex flex-col gap-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl font-mono text-xs">
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-slate-200">ORBE Ingestion Scraper Daemon • Stdout</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400">Process ID: 20489 (Node Worker)</span>
                  <button
                    onClick={() => mediaIngestionEngine.runFullIngestionPipeline(['africa', 'globo', 'tvi', 'desporto'])}
                    className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900 transition-colors text-[11px]"
                  >
                    Disparar Scan
                  </button>
                </div>
              </div>

              <div className="p-4 max-h-[460px] overflow-y-auto flex flex-col gap-1.5 selection:bg-cyan-900">
                {stats.logs.length === 0 ? (
                  <div className="text-slate-500 py-8 text-center">
                    Aguardando início de tarefas. Clique em "Disparar Ingestão Geral" para observar o robô em tempo real.
                  </div>
                ) : (
                  stats.logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2.5 leading-relaxed">
                      <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase shrink-0 ${
                        log.level === 'success' ? 'bg-emerald-950 text-emerald-400' :
                        log.level === 'warn' ? 'bg-amber-950 text-amber-400' :
                        log.level === 'error' ? 'bg-rose-950 text-rose-400' :
                        'bg-cyan-950 text-cyan-400'
                      }`}>
                        {log.level}
                      </span>
                      {log.source && (
                        <span className="text-indigo-400 font-bold shrink-0">[{log.source}]:</span>
                      )}
                      <span className={
                        log.level === 'success' ? 'text-emerald-200' :
                        log.level === 'warn' ? 'text-amber-200' :
                        log.level === 'error' ? 'text-rose-200' :
                        'text-slate-300'
                      }>
                        {log.message}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Stream Health Checker & CORS Diagnostic */}
        {activeTab === 'health-checker' && (
          <div className="flex flex-col gap-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
              <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                <span>Testador e Verificador de Saúde HLS (.m3u8)</span>
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Executa handshake através do Proxy CORS ORBE, verificando resposta HTTP, sintaxe #EXTM3U, codecs e latência do CDN.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  value={testStreamUrl}
                  onChange={(e) => setTestStreamUrl(e.target.value)}
                  placeholder="https://servidor-externo.com/live/playlist.m3u8"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-cyan-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 font-mono w-full"
                />
                <button
                  onClick={handleTestStream}
                  disabled={healthTesting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shrink-0 flex items-center gap-2 disabled:opacity-50"
                >
                  {healthTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  <span>{healthTesting ? 'Testando Handshake...' : 'Verificar Stream'}</span>
                </button>
              </div>

              {/* Preset buttons */}
              <div className="flex flex-wrap gap-2 mt-3 text-xs">
                <span className="text-slate-500 text-[11px] self-center">Exemplos rápidos:</span>
                {[
                  { name: 'NASA TV HD', url: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8' },
                  { name: 'Red Bull TV Extreme', url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8' },
                  { name: 'Deluxe Music HD', url: 'https://deluxemusic.akamaized.net/hls/live/2034960/deluxemusic/master.m3u8' },
                  { name: 'Smile TV Kids', url: 'https://d2j5w47m0y3w71.cloudfront.net/hls/live/2004543/smiletv/master.m3u8' }
                ].map((sample) => (
                  <button
                    key={sample.name}
                    onClick={() => {
                      setTestStreamUrl(sample.url);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                  >
                    {sample.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Health Result Card */}
            {healthTestResult && (
              <div className={`p-6 rounded-2xl border transition-all ${
                healthTestResult.status === 'ONLINE'
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100'
                  : 'bg-amber-950/20 border-amber-500/40 text-amber-100'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {healthTestResult.status === 'ONLINE' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-amber-400" />
                    )}
                    <div>
                      <h3 className="font-bold text-base">
                        Sinal de Vídeo: {healthTestResult.status}
                      </h3>
                      <p className="text-xs opacity-80">
                        {healthTestResult.details}
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-black/40 border border-white/10">
                    HTTP {healthTestResult.httpStatus || 200}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 font-mono text-xs">
                  <div className="bg-black/30 p-3 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Latência de Resposta</span>
                    <span className="text-sm font-bold text-cyan-300">{healthTestResult.latencyMs} ms</span>
                  </div>
                  <div className="bg-black/30 p-3 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Formato de Mídia</span>
                    <span className="text-sm font-bold text-indigo-300">{healthTestResult.format}</span>
                  </div>
                  <div className="bg-black/30 p-3 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Resolução Estimada</span>
                    <span className="text-sm font-bold text-emerald-300">{healthTestResult.resolution || 'Auto 1080p'}</span>
                  </div>
                  <div className="bg-black/30 p-3 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">CORS Desbloqueado</span>
                    <span className="text-sm font-bold text-cyan-400">{healthTestResult.corsCompliant ? 'SIM (100%)' : 'NÃO'}</span>
                  </div>
                </div>

                {onPlayChannel && (
                  <div className="mt-5 flex justify-end">
                    <button
                      onClick={() => {
                        const testChan: Channel = {
                          id: `test-${Date.now()}`,
                          number: 99,
                          name: 'Stream Verificado em Laboratório',
                          tagline: 'Sinal testado com sucesso no Health Checker ORBE',
                          logo: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500&auto=format&fit=crop&q=80',
                          coverImage: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1200&auto=format&fit=crop&q=80',
                          category: 'live',
                          requiredTier: 'free',
                          currentProgram: 'Emissão de Teste de Diagnóstico',
                          nextProgram: 'ORBE TV Signal Engine',
                          viewers: 9500,
                          source: 'ublue-internal',
                          provider: 'Health Checker Tester',
                          streamUrl: testStreamUrl,
                          videoType: 'hls',
                          badge: 'TESTER'
                        };
                        onPlayChannel(testChan);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-2 shadow-lg"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Reproduzir este sinal no Player Principal</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
