import React, { useState, useEffect } from 'react';
import {
  Search,
  Wifi,
  Zap,
  Radio,
  Play,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Globe,
  Tv,
  Film,
  Trophy,
  Newspaper,
  Music,
  ExternalLink,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  ultraTunerSignalEngine,
  TunerSearchResult,
  SignalMetrics,
  VERIFIED_REAL_INTERNET_CHANNELS
} from '../../services/ultra-tuner-signal-engine';
import { channelTunerService } from '../../services/channel-tuner-service';
import { Channel } from '../../types/content';
import { soundEffects } from '../../services/sound-effects';

interface UltraInternetTunerTabProps {
  onChannelTunedAndPlay: (channel: Channel) => void;
}

export const UltraInternetTunerTab: React.FC<UltraInternetTunerTabProps> = ({
  onChannelTunedAndPlay
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [channels, setChannels] = useState<TunerSearchResult[]>(() =>
    ultraTunerSignalEngine.searchChannels('', 'all')
  );
  const [signalMetrics, setSignalMetrics] = useState<SignalMetrics>(() =>
    ultraTunerSignalEngine.getSignalMetrics()
  );
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isBoostedNotice, setIsBoostedNotice] = useState(false);

  // Custom Stream Modal / State
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [customCategory, setCustomCategory] = useState('live');
  const [customCountry, setCustomCountry] = useState('Moçambique / Global');
  const [customError, setCustomError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = ultraTunerSignalEngine.subscribe(() => {
      setSignalMetrics(ultraTunerSignalEngine.getSignalMetrics());
    });
    return unsub;
  }, []);

  const handleSearch = (q: string, cat: string) => {
    setSearchQuery(q);
    setCategoryFilter(cat);
    const results = ultraTunerSignalEngine.searchChannels(q, cat);
    setChannels(results);
  };

  const handleScanFrequencies = async () => {
    setIsScanning(true);
    setScanProgress(0);
    soundEffects.play('notification');

    await ultraTunerSignalEngine.scanInternetFrequencies((progress) => {
      setScanProgress(progress);
    });

    setIsScanning(false);
    setChannels(ultraTunerSignalEngine.searchChannels(searchQuery, categoryFilter));
    soundEffects.play('transmission_start');
  };

  const handleBoost = () => {
    ultraTunerSignalEngine.boostSignalNow();
    soundEffects.play('transmission_start');
    setIsBoostedNotice(true);
    setTimeout(() => setIsBoostedNotice(false), 3000);
  };

  const handleTuneChannel = (res: TunerSearchResult) => {
    const currentTuned = channelTunerService.getTunedChannels();
    const nextNumber = currentTuned.length > 0
      ? Math.max(...currentTuned.map(c => c.number)) + 1
      : 80;

    const ublueChannel = ultraTunerSignalEngine.convertToUBlueChannel(res, nextNumber);
    channelTunerService.tuneChannel(ublueChannel);
    soundEffects.play('payment_success');
    onChannelTunedAndPlay(ublueChannel);
  };

  const handleAddCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customUrl.trim()) {
      setCustomError('Por favor preencha o nome do canal e a URL M3U8 do stream.');
      return;
    }
    if (!customUrl.startsWith('http://') && !customUrl.startsWith('https://')) {
      setCustomError('A URL deve iniciar com http:// ou https://');
      return;
    }

    const created = ultraTunerSignalEngine.addCustomStream({
      name: customName,
      streamUrl: customUrl,
      category: customCategory,
      country: customCountry
    });

    handleTuneChannel(created);
    setIsAddingCustom(false);
    setCustomName('');
    setCustomUrl('');
    setCustomError(null);
  };

  return (
    <div className="space-y-6 text-left">
      {/* ========================================================================= */}
      {/* SIGNAL BOOSTER TELEMETRY HERO CARD */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-[#071328] border border-cyan-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-mono font-black uppercase tracking-wider text-cyan-400">
                GERADOR DE SINAL ULTRA FORTE · LINHA DIRETA DE FIBRA & SATÉLITE
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Motor Tuner & Booster de Canais em Tempo Real
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
              Varredura profunda na internet em busca de emissões 100% reais, sem quedas ou congelamento, com chaveamento redundante multi-CDN (Akamai, CloudFront, Mux e Fastly).
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={handleBoost}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer transform active:scale-95"
            >
              <Zap className="w-4 h-4 fill-current text-yellow-300" />
              <span>{isBoostedNotice ? '✓ SINAL REFORÇADO (100%)' : 'Reforçar Sinal Agora'}</span>
            </button>

            <button
              onClick={handleScanFrequencies}
              disabled={isScanning}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? `Varrendo ${scanProgress}%` : 'Varredura Global'}</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 mt-4 pt-4 border-t border-slate-800/80">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-emerald-500/30">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Força do Sinal</div>
            <div className="text-base sm:text-lg font-black text-emerald-400 font-mono">
              {signalMetrics.strengthPercent}%
            </div>
            <div className="text-[9px] text-emerald-300 font-mono">Sem perda (0%)</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Potência RF / RSSI</div>
            <div className="text-base sm:text-lg font-black text-white font-mono">
              {signalMetrics.rssiDb} dBm
            </div>
            <div className="text-[9px] text-cyan-400 font-mono">SNR {signalMetrics.snrDb} dB</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Largura de Banda</div>
            <div className="text-base sm:text-lg font-black text-white font-mono">
              {signalMetrics.bitrateMbps} Mbps
            </div>
            <div className="text-[9px] text-slate-400 font-mono">1080p a 60 fps</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Latência ao Vivo</div>
            <div className="text-base sm:text-lg font-black text-cyan-400 font-mono">
              {signalMetrics.latencyMs} ms
            </div>
            <div className="text-[9px] text-emerald-400 font-mono">Ultra Low Latency</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Buffer Pré-Carregado</div>
            <div className="text-base sm:text-lg font-black text-white font-mono">
              {signalMetrics.bufferDurationSec}s
            </div>
            <div className="text-[9px] text-cyan-300 font-mono">Anti-congelamento</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Status do Link</div>
            <div className="text-base sm:text-lg font-black text-emerald-400 font-mono">
              {signalMetrics.status}
            </div>
            <div className="text-[9px] text-slate-400 font-mono">Multi-CDN Ativo</div>
          </div>
        </div>

        {/* Scan progress bar */}
        {isScanning && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-300 mb-1">
              <span>Sintonizando transponders de 470 a 860 MHz...</span>
              <span>{scanProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SEARCH & FILTERS BAR */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value, categoryFilter)}
            placeholder="Buscar canais na internet por nome, país, emissora ou programa (ex: Euronews, Red Bull, TV Brasil)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'news', label: 'Notícias' },
            { id: 'sports', label: 'Desporto' },
            { id: 'movies', label: 'Cinema' },
            { id: 'documentary', label: 'Ciência & Doc' },
            { id: 'music', label: 'Música' },
            { id: 'kids', label: 'Kids' },
            { id: 'general', label: 'Gerais' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSearch(searchQuery, cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                categoryFilter === cat.id
                  ? 'bg-cyan-600 text-slate-950 font-black'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}

          {/* Add custom stream button */}
          <button
            onClick={() => setIsAddingCustom(true)}
            className="px-3 py-1.5 rounded-xl bg-purple-950 border border-purple-500/50 hover:bg-purple-900 text-purple-300 text-xs font-bold whitespace-nowrap flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Link M3U8</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CUSTOM M3U8 STREAM FORM DRAWER */}
      {/* ========================================================================= */}
      {isAddingCustom && (
        <form
          onSubmit={handleAddCustomSubmit}
          className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-purple-500/40 shadow-xl space-y-3 animate-fade-in"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-purple-400" />
              <h4 className="text-sm font-bold text-white">Sintonizar Link Externo M3U8 / HLS</h4>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingCustom(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕ Fechar
            </button>
          </div>

          {customError && (
            <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{customError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Nome do Canal</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Ex: RTP África HD ou Canal Esportivo"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Categoria</label>
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="live">Geral / Ao Vivo</option>
                <option value="sports">Desporto</option>
                <option value="news">Notícias</option>
                <option value="music">Música</option>
                <option value="movies">Cinema</option>
                <option value="documentary">Documentários</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">
              URL da Transmissão (M3U8 / HLS / MP4)
            </label>
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://exemplo.com/live/stream.m3u8"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingCustom(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 text-xs font-medium hover:bg-slate-800 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Sintonizar & Adicionar à Grade</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* CHANNELS GRID (Real streams with 1-click play) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {channels.map((ch) => (
          <div
            key={ch.id}
            className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/50 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              <div className="flex items-start gap-3 mb-2.5">
                <img
                  src={ch.logo}
                  alt={ch.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
                      {ch.quality}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <Wifi className="w-3 h-3" />
                      <span>{ch.signalStrength}%</span>
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                    {ch.name}
                  </h4>
                  <div className="text-[11px] text-slate-400 truncate">
                    {ch.country} · {ch.language}
                  </div>
                </div>
              </div>

              {ch.currentProgram && (
                <div className="p-2 rounded-xl bg-slate-900/90 text-[11px] text-slate-300 mb-3 line-clamp-1 border border-slate-800/60">
                  <span className="text-cyan-400 font-bold mr-1">No ar:</span>
                  <span>{ch.currentProgram}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 gap-2">
              <span className="text-[10px] font-mono text-slate-400 truncate">
                {ch.provider}
              </span>

              <button
                onClick={() => handleTuneChannel(ch)}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-cyan-500 hover:text-black text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer transition-all transform active:scale-95"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Sintonizar & Assistir</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {channels.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <Radio className="w-10 h-10 mx-auto mb-2 text-slate-600 animate-pulse" />
          <p className="text-sm">Nenhum canal encontrado para a busca &quot;{searchQuery}&quot;.</p>
          <button
            onClick={() => handleSearch('', 'all')}
            className="mt-3 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
          >
            Limpar Filtros
          </button>
        </div>
      )}
    </div>
  );
};
