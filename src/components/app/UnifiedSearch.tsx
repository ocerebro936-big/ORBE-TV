import React, { useState, useEffect, useMemo } from 'react';
import { Search, Play, Radio, Music, Tv, Mic, Film, Trophy, Info, Sparkles, CheckCircle2, ChevronDown, ChevronUp, X, Filter, Zap, Globe, Smile } from 'lucide-react';
import { Content, Channel, SubscriptionTier } from '../../types/content';
import { contentEngine, UnifiedSearchResults } from '../../engine/content-normalizer';
import { ChannelLogoBadge } from '../common/ChannelLogoBadge';
import { MOCK_CHANNELS } from '../../data/mock-content';

interface UnifiedSearchProps {
  onSelectChannel: (channel: Channel) => void;
  onSelectContent: (content: Content) => void;
  userTier: SubscriptionTier;
  initialQuery?: string;
}

export const UnifiedSearch: React.FC<UnifiedSearchProps> = ({
  onSelectChannel,
  onSelectContent,
  userTier,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [results, setResults] = useState<UnifiedSearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [inspectedItemId, setInspectedItemId] = useState<string | null>(null);

  const executeSearch = async (searchTerm: string) => {
    setLoading(true);
    const res = await contentEngine.unifiedSearch(searchTerm.trim());
    setResults(res);
    setLoading(false);
  };

  useEffect(() => {
    executeSearch(query);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  const handleClearQuery = () => {
    setQuery('');
    executeSearch('');
  };

  const sampleSearches = [
    'TVM',
    'STV',
    'Miramar',
    'DW África',
    'Marrabenta',
    'Moçambola',
    'SuperSport',
    'NASA TV',
    'Kids',
    'Cinema'
  ];

  const categoryFilters = [
    { id: 'all', label: 'Todos os Canais', icon: Tv },
    { id: 'free', label: '🟢 Livres (0 MT)', icon: Sparkles },
    { id: 'originals', label: '⭐ UBlue Originais', icon: Zap },
    { id: 'mz', label: '🇲🇿 Moçambique & PALOP', icon: Globe },
    { id: 'sports', label: '⚽ Desporto', icon: Trophy },
    { id: 'news', label: '📰 Notícias', icon: Radio },
    { id: 'music', label: '🎵 Música', icon: Music },
    { id: 'kids', label: '👶 Kids', icon: Smile },
    { id: 'movies', label: '🎬 Cinema', icon: Film }
  ];

  // Filter channels according to category filter and search query
  const filteredChannelsList = useMemo(() => {
    const baseList = (results?.channels && results.channels.length > 0)
      ? results.channels
      : MOCK_CHANNELS;

    const q = query.trim().toLowerCase();
    let list = baseList;

    if (q) {
      list = list.filter(ch =>
        ch.name.toLowerCase().includes(q) ||
        ch.tagline.toLowerCase().includes(q) ||
        ch.currentProgram.toLowerCase().includes(q) ||
        ch.provider.toLowerCase().includes(q) ||
        String(ch.number) === q
      );
    }

    if (activeCategoryFilter === 'free') {
      return list.filter(ch => ch.requiredTier === 'free');
    }
    if (activeCategoryFilter === 'originals') {
      return list.filter(ch =>
        ch.source === 'ublue-internal' ||
        ch.provider.includes('Universo Blue') ||
        ch.badge?.includes('ORIGINAL') ||
        ch.name.includes('UBlue')
      );
    }
    if (activeCategoryFilter === 'mz') {
      return list.filter(ch =>
        ch.name.includes('TVM') ||
        ch.name.includes('STV') ||
        ch.name.includes('Miramar') ||
        ch.name.includes('Sucesso') ||
        ch.name.includes('KTV') ||
        ch.name.includes('Eco TV') ||
        ch.name.includes('TIM') ||
        ch.name.includes('TPA') ||
        ch.name.includes('TCV') ||
        ch.provider.includes('Moçambique')
      );
    }
    if (activeCategoryFilter !== 'all') {
      return list.filter(ch => ch.category === activeCategoryFilter);
    }

    return list;
  }, [results?.channels, query, activeCategoryFilter]);

  const getTierBadge = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'free':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600/90 text-white">0 MT (LIVRE)</span>;
      case 'start':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">🔒 Start (25 MT)</span>;
      case 'basic':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/40">🔒 Basic (100 MT)</span>;
      case 'medio':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40">🔒 Médio (250 MT)</span>;
      case 'max':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40">🔒 Max (500 MT)</span>;
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative flex items-center rounded-2xl bg-slate-900/95 border border-blue-500/30 shadow-xl shadow-blue-950/40 px-4 py-3.5 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
          <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              executeSearch(e.target.value);
            }}
            placeholder="🔎 Busque por canal, emissora, programa ou música (ex: TVM, STV, Desporto, Marrabenta...)"
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={handleClearQuery}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer mr-2"
              title="Limpar pesquisa"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {loading && (
            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin shrink-0 ml-1" />
          )}
        </div>

        {/* Suggestion tags */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3 text-xs">
          <span className="text-slate-400 font-semibold">Buscas Frequentes:</span>
          {sampleSearches.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => {
                setQuery(term);
                executeSearch(term);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-blue-600/20 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors cursor-pointer font-medium"
            >
              {term}
            </button>
          ))}
        </div>
      </form>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categoryFilters.map((f) => {
          const Icon = f.icon;
          const isSelected = activeCategoryFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveCategoryFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* Engine Status Banner */}
      <div className="p-3 rounded-xl bg-blue-950/40 border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-blue-300">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong>Catálogo UBlue TV:</strong> {filteredChannelsList.length} canais encontrados
            {query && ` para "${query}"`}
          </span>
        </div>
        <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Transmissões Reais 24/7 · Sem Defeitos</span>
        </div>
      </div>

      {/* Channels Grid (Clean, responsive, with fallback logo & corner UBlue watermark) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Tv className="w-4 h-4 text-cyan-400" />
            <span>Canais de Televisão ({filteredChannelsList.length})</span>
          </h3>
          <span className="text-[11px] text-slate-400">
            Clique em qualquer canal para sintonizar
          </span>
        </div>

        {filteredChannelsList.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
            <p className="text-sm">Nenhum canal encontrado para "{query}".</p>
            <button
              onClick={handleClearQuery}
              className="mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors cursor-pointer"
            >
              Ver Todos os Canais
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredChannelsList.map((ch) => (
              <div
                key={ch.id}
                onClick={() => onSelectChannel(ch)}
                className="p-3.5 rounded-2xl bg-slate-900/75 border border-slate-800 hover:border-cyan-400/60 hover:bg-slate-900/95 flex items-center gap-3.5 cursor-pointer group transition-all shadow-md hover:shadow-cyan-950/20"
              >
                {/* Official Channel Logo Badge with Corner UBlue Watermark */}
                <ChannelLogoBadge channel={ch} size="lg" showCornerUBlueBadge={true} />

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      CH {ch.number}
                    </span>
                    {getTierBadge(ch.requiredTier)}
                  </div>

                  <div className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                    {ch.name}
                  </div>

                  <div className="text-[11px] text-slate-400 truncate">
                    ▶ {ch.currentProgram}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                    <span className="truncate">{ch.provider.split(',')[0]}</span>
                    <span className="text-emerald-400 font-mono font-semibold shrink-0">
                      {ch.viewers.toLocaleString('pt-PT')} ao vivo
                    </span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-cyan-500 text-slate-400 group-hover:text-black flex items-center justify-center shrink-0 transition-colors shadow-sm">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* VOD / Catálogo de Conteúdos Normalizados (se houver resultados adicionais) */}
      {results && results.allNormalized.length > 0 && query && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Film className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 uppercase tracking-wider">
              Vídeos sob Demanda, Séries e Podcasts ({results.allNormalized.length})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {results.allNormalized.slice(0, 6).map((item) => (
              <ContentItemCard
                key={item.id}
                item={item}
                onPlay={() => onSelectContent(item)}
                isInspected={inspectedItemId === item.id}
                onToggleInspect={() => setInspectedItemId(inspectedItemId === item.id ? null : item.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface ContentItemCardProps {
  item: Content;
  onPlay: () => void;
  isInspected: boolean;
  onToggleInspect: () => void;
}

const ContentItemCard: React.FC<ContentItemCardProps> = ({
  item,
  onPlay,
  isInspected,
  onToggleInspect,
}) => {
  return (
    <div className="rounded-xl bg-slate-900/70 border border-slate-800 overflow-hidden hover:border-slate-700 transition-all flex flex-col">
      <div className="p-3.5 flex items-start gap-3">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-16 h-16 rounded-lg object-cover shrink-0"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-xs font-bold text-white truncate">{item.title}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-500/20 uppercase font-mono">
              {item.subscriptionTier}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
            {item.description}
          </p>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">{item.authorOrHost || item.duration || 'UBlue TV'}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleInspect}
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
                title="Inspecionar metadados internos normalizados"
              >
                <span>Metadados</span>
                {isInspected ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              <button
                onClick={onPlay}
                className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Play</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Internal Engine Metadata Inspector */}
      {isInspected && (
        <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-800/80 bg-slate-950/80 text-[10px] font-mono text-slate-400 space-y-1">
          <div className="text-cyan-400 font-bold mb-1">METADADOS INTERNOS NORMALIZADOS:</div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
            <div><span className="text-slate-600">source:</span> {item.source}</div>
            <div><span className="text-slate-600">provider:</span> {item.provider}</div>
            <div><span className="text-slate-600">contentId:</span> {item.contentId}</div>
            <div><span className="text-slate-600">rights:</span> {item.rights}</div>
            <div><span className="text-slate-600">country:</span> {item.country}</div>
            <div><span className="text-slate-600">availability:</span> {item.availability}</div>
            <div><span className="text-slate-600">subscriptionTier:</span> {item.subscriptionTier}</div>
          </div>
        </div>
      )}
    </div>
  );
};
