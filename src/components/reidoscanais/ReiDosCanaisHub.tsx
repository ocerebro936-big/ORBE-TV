import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Tv,
  Search,
  Play,
  Calendar,
  Clock,
  Radio,
  Flame,
  Globe,
  Layers,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  ReiDosCanaisChannel,
  ReiDosCanaisSportEvent
} from '../../types/reidoscanais';
import {
  reiDosCanaisService,
  REIDOSCANAIS_PRELOADED_CHANNELS,
  REIDOSCANAIS_PRELOADED_SPORTS
} from '../../services/reidoscanais-service';
import { Channel } from '../../types/content';

interface ReiDosCanaisHubProps {
  onWatchChannel: (channel: Channel) => void;
  onBackToPortal?: () => void;
}

export const ReiDosCanaisHub: React.FC<ReiDosCanaisHubProps> = ({
  onWatchChannel,
  onBackToPortal
}) => {
  const [activeTab, setActiveTab] = useState<'sports' | 'channels' | 'search' | 'api_explorer'>('sports');

  // Channels state
  const [channels, setChannels] = useState<ReiDosCanaisChannel[]>(REIDOSCANAIS_PRELOADED_CHANNELS);
  const [selectedChannelCategory, setSelectedChannelCategory] = useState<string>('Todos');
  const [selectedChannelEmbedIndex, setSelectedChannelEmbedIndex] = useState<Record<string, number>>({});

  // Sports state
  const [sportsEvents, setSportsEvents] = useState<ReiDosCanaisSportEvent[]>(REIDOSCANAIS_PRELOADED_SPORTS);
  const [sportFilter, setSportFilter] = useState<'all' | 'live' | 'upcoming'>('all');

  // Global search state
  const [searchQuery, setSearchQuery] = useState('futebol');
  const [searchResults, setSearchResults] = useState<{
    channels: ReiDosCanaisChannel[];
    events: ReiDosCanaisSportEvent[];
  }>({
    channels: REIDOSCANAIS_PRELOADED_CHANNELS.filter(c => c.category === 'Esportes'),
    events: REIDOSCANAIS_PRELOADED_SPORTS
  });
  const [isSearching, setIsSearching] = useState(false);

  // Copy code helper
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Fetch real data on mount
  useEffect(() => {
    reiDosCanaisService.getChannels().then(setChannels);
    reiDosCanaisService.getLiveSports('live').then(setSportsEvents);
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    const data = await reiDosCanaisService.search(searchQuery);
    setSearchResults(data);
    setIsSearching(false);
  };

  const handleTuneChannel = (rc: ReiDosCanaisChannel, embedIdx = 0) => {
    const bridged = reiDosCanaisService.tuneToUBlueChannel(rc, embedIdx);
    onWatchChannel(bridged);
  };

  const handleTuneSport = (event: ReiDosCanaisSportEvent, embedIdx = 0) => {
    const bridged = reiDosCanaisService.tuneSportEventToUBlueChannel(event, embedIdx);
    onWatchChannel(bridged);
  };

  // Filter channels
  const filteredChannels = selectedChannelCategory === 'Todos'
    ? channels
    : channels.filter(c => c.category === selectedChannelCategory);

  // Filter sports
  const filteredSports = sportFilter === 'all'
    ? sportsEvents
    : sportsEvents.filter(s => s.status === sportFilter);

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/50 via-slate-900 to-yellow-950/30 border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                API OFICIAL · https://api.reidoscanais.si
              </span>
              <span className="text-xs font-mono text-slate-400">EPG Integrado · Multi-Servidores</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
              <span>👑 Rei dos Canais Hub</span>
              <span className="text-amber-400 text-lg font-mono">v1.2</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Grade ao vivo de canais abertos e por assinatura, eventos esportivos em tempo real com placar e programação EPG detalhada pronta para tocar no player ORBE.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onBackToPortal && (
              <button
                onClick={onBackToPortal}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                Voltar ao Portal
              </button>
            )}
            <button
              onClick={() => {
                const liveFlamengo = sportsEvents.find(s => s.status === 'live') || sportsEvents[0];
                if (liveFlamengo) handleTuneSport(liveFlamengo);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Assistir Jogo Ao Vivo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('sports')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'sports'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Trophy className="w-4 h-4 text-slate-950" />
          <span>1. Eventos Esportivos Ao Vivo ({sportsEvents.length})</span>
          <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] animate-pulse">AO VIVO</span>
        </button>

        <button
          onClick={() => setActiveTab('channels')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'channels'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Tv className="w-4 h-4 text-cyan-300" />
          <span>2. Canais de TV & EPG ({channels.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('search')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'search'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Search className="w-4 h-4 text-purple-300" />
          <span>3. Busca Global Rei dos Canais</span>
        </button>

        <button
          onClick={() => setActiveTab('api_explorer')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'api_explorer'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Globe className="w-4 h-4 text-emerald-300" />
          <span>Documentação & Exemplos de Código</span>
        </button>
      </div>

      {/* TAB 1: EVENTOS ESPORTIVOS AO VIVO */}
      {activeTab === 'sports' && (
        <div className="space-y-5 animate-fade-in">
          {/* Filter Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-mono">Filtrar status:</span>
              {(['all', 'live', 'upcoming'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setSportFilter(st)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    sportFilter === st
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {st === 'all' ? 'Todos os Jogos' : st === 'live' ? '🔴 Ao Vivo Agora' : '⏳ Próximos'}
                </button>
              ))}
            </div>

            <div className="text-slate-400 font-mono text-[11px]">
              Endpoint: <code className="text-amber-300">GET /sports?status=live</code>
            </div>
          </div>

          {/* Sports Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSports.map(evt => (
              <div
                key={evt.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all shadow-xl flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Header: Competition & Status Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-[10px] font-mono text-cyan-300 border border-slate-800">
                      {evt.competition}
                    </span>
                    {evt.status === 'live' ? (
                      <span className="px-2 py-0.5 rounded-full bg-red-600/30 text-red-300 text-[10px] font-bold border border-red-500/40 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                        AO VIVO {evt.score?.period ? `· ${evt.score.period}` : ''}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono">
                        {evt.start_time}
                      </span>
                    )}
                  </div>

                  {/* Teams / Confrontation */}
                  {evt.teams ? (
                    <div className="flex items-center justify-between py-2 border-y border-slate-800/80 my-2">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img
                          src={evt.teams.home.logo}
                          alt={evt.teams.home.name}
                          className="w-10 h-10 rounded-full object-cover bg-slate-950 border border-slate-800 p-0.5 shrink-0"
                          onError={(e) => { (e.target as any).style.display = 'none'; }}
                        />
                        <span className="text-sm font-bold text-white truncate">{evt.teams.home.name}</span>
                      </div>

                      {evt.score ? (
                        <div className="px-3 py-1 rounded-xl bg-slate-950 border border-amber-500/30 font-mono font-black text-lg text-amber-300 shrink-0 mx-2">
                          {evt.score.home} - {evt.score.away}
                        </div>
                      ) : (
                        <span className="text-xs font-mono text-slate-500 px-3">VS</span>
                      )}

                      <div className="flex items-center justify-end gap-3 flex-1 min-w-0 text-right">
                        <span className="text-sm font-bold text-white truncate">{evt.teams.away.name}</span>
                        <img
                          src={evt.teams.away.logo}
                          alt={evt.teams.away.name}
                          className="w-10 h-10 rounded-full object-cover bg-slate-950 border border-slate-800 p-0.5 shrink-0"
                          onError={(e) => { (e.target as any).style.display = 'none'; }}
                        />
                      </div>
                    </div>
                  ) : (
                    <h3 className="text-base font-black text-white">{evt.title}</h3>
                  )}

                  <p className="text-xs text-slate-400 leading-relaxed mt-2">{evt.description}</p>
                </div>

                {/* Footer: Embed Providers & Watch Button */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-500 font-mono">Sinais:</span>
                    {evt.embeds.map((emb, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300"
                      >
                        {emb.provider} ({emb.quality})
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleTuneSport(evt)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Assistir Partida</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CANAIS DE TV COM EPG */}
      {activeTab === 'channels' && (
        <div className="space-y-5 animate-fade-in">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
            {['Todos', 'Esportes', 'Entretenimento', 'Filmes & Séries', 'Notícias', 'Infantil'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedChannelCategory(cat)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                  selectedChannelCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Channels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChannels.map(ch => {
              const selectedEmbedIdx = selectedChannelEmbedIndex[ch.id] || 0;
              return (
                <div
                  key={ch.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    {/* Channel Top */}
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={ch.logo_url}
                        alt={ch.name}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-white truncate">{ch.name}</h4>
                          <span className="text-[10px] px-2 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono">
                            {ch.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{ch.description}</p>
                      </div>
                    </div>

                    {/* Integrated EPG Box */}
                    {ch.epg?.current && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="flex items-center gap-1 text-emerald-400 font-bold">
                            <Clock className="w-3 h-3" />
                            <span>NO AR AGORA</span>
                          </span>
                          <span className="font-mono">{ch.epg.current.formatted_time || 'Ao Vivo'}</span>
                        </div>
                        <div className="font-bold text-white text-xs truncate">
                          {ch.epg.current.title}
                        </div>
                        {ch.epg.current.description && (
                          <p className="text-[10px] text-slate-400 line-clamp-2">
                            {ch.epg.current.description}
                          </p>
                        )}

                        {ch.epg.next && (
                          <div className="pt-2 border-t border-slate-900 text-[10px] text-slate-400 flex items-center justify-between">
                            <span>A Seguir: <strong className="text-slate-300">{ch.epg.next.title}</strong></span>
                            <span className="font-mono">{ch.epg.next.formatted_time?.split(' ')[0]}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Multi-embed Switcher & Play Button */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Servidor de Reprodução:</span>
                      <div className="flex items-center gap-1">
                        {ch.embeds.map((emb, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedChannelEmbedIndex(prev => ({ ...prev, [ch.id]: idx }))}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                              selectedEmbedIdx === idx
                                ? 'bg-blue-600 text-white font-bold'
                                : 'bg-slate-950 text-slate-400 hover:text-white'
                            }`}
                          >
                            {emb.provider} ({emb.quality})
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleTuneChannel(ch, selectedEmbedIdx)}
                      className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Sintonizar {ch.name} no ORBE Player</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: BUSCA GLOBAL */}
      {activeTab === 'search' && (
        <div className="space-y-5 animate-fade-in">
          <form onSubmit={handleSearch} className="flex items-center gap-2 p-2 rounded-2xl bg-slate-900 border border-slate-800">
            <Search className="w-5 h-5 text-slate-400 ml-2" />
            <input
              type="text"
              placeholder="Pesquisar em toda a API Rei dos Canais (ex: futebol, globo, premiere, ufc)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md cursor-pointer transition-colors shrink-0 disabled:opacity-50"
            >
              {isSearching ? 'Buscando...' : 'Pesquisar na API'}
            </button>
          </form>

          {/* Search Result Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Canais encontrados */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-sm flex items-center justify-between">
                <span>Canais Encontrados ({searchResults.channels.length})</span>
                <span className="text-xs font-mono text-purple-300">GET /search?q={searchQuery}</span>
              </h4>

              {searchResults.channels.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">Nenhum canal encontrado para a busca.</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {searchResults.channels.map(ch => (
                    <div
                      key={ch.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-purple-500/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={ch.logo_url} alt={ch.name} className="w-9 h-9 rounded-lg object-cover bg-slate-900" />
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-white truncate">{ch.name}</h5>
                          <span className="text-[10px] text-slate-400 font-mono">{ch.category}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleTuneChannel(ch)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer shrink-0"
                      >
                        Sintonizar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Eventos esportivos encontrados */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-sm flex items-center justify-between">
                <span>Eventos Esportivos ({searchResults.events.length})</span>
                <span className="text-xs font-mono text-amber-300">Status Ao Vivo & Grade</span>
              </h4>

              {searchResults.events.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">Nenhum evento esportivo encontrado.</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {searchResults.events.map(ev => (
                    <div
                      key={ev.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-amber-500/40 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-white truncate">{ev.title}</h5>
                          {ev.status === 'live' && (
                            <span className="px-1.5 py-0.2 rounded bg-red-600 text-white text-[9px] font-bold animate-pulse">
                              AO VIVO
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{ev.competition}</span>
                      </div>
                      <button
                        onClick={() => handleTuneSport(ev)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer shrink-0"
                      >
                        Assistir
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: API EXPLORER & EXEMPLOS DE CÓDIGO */}
      {activeTab === 'api_explorer' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-400" />
              <span>Consumo da API Oficial Rei dos Canais (Node.js & cURL)</span>
            </h3>
            <p className="text-xs text-slate-300">
              Copie os snippets abaixo para integrar a API aos seus servidores ou pipelines de automação:
            </p>

            {/* Code Block */}
            <div className="relative rounded-2xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-slate-300">
              <button
                onClick={() => handleCopy(sampleCode, 'api-code')}
                className="absolute top-3 right-3 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedKey === 'api-code' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'api-code' ? 'Copiado' : 'Copiar Código'}</span>
              </button>
              <pre className="text-[11px] leading-relaxed overflow-x-auto">
                <code>{sampleCode}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const sampleCode = `const API = 'https://api.reidoscanais.si';

// 1. Listar todos os canais (com EPG incluído)
const channels = await fetch(\`\${API}/channels\`).then(r => r.json());

// 2. Eventos esportivos ao vivo agora
const live = await fetch(\`\${API}/sports?status=live\`).then(r => r.json());

// 3. Busca global
const results = await fetch(\`\${API}/search?q=futebol\`).then(r => r.json());

console.log(channels.data, live.data, results.data);`;
