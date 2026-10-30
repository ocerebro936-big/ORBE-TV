import React, { useState, useEffect } from 'react';
import { Play, Users, Lock, Sparkles, Tv, Radio, Music, Newspaper, Trophy, Zap, Globe, Smile, Film, ExternalLink } from 'lucide-react';
import { Channel, SubscriptionTier } from '../../types/content';
import { MOCK_CHANNELS } from '../../data/mock-content';
import { ChannelLogoBadge } from '../common/ChannelLogoBadge';
import { channelTunerService } from '../../services/channel-tuner-service';
import {
  reiDosCanaisService,
  REIDOSCANAIS_PRELOADED_CHANNELS,
  REIDOSCANAIS_PRELOADED_SPORTS
} from '../../services/reidoscanais-service';

interface ChannelsShowcaseProps {
  onWatchChannel: (channel: Channel) => void;
  userTier: SubscriptionTier;
  onUpgradePrompt: (channel: Channel) => void;
  onOpenTuner?: () => void;
}

export const ChannelsShowcase: React.FC<ChannelsShowcaseProps> = ({
  onWatchChannel,
  userTier,
  onUpgradePrompt,
  onOpenTuner,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [tunedChannels, setTunedChannels] = useState<Channel[]>(() => channelTunerService.getTunedChannels());

  useEffect(() => {
    const unsub = channelTunerService.subscribe(() => {
      setTunedChannels(channelTunerService.getTunedChannels());
    });
    return unsub;
  }, []);

  const reiDosCanaisChannels: Channel[] = [
    ...REIDOSCANAIS_PRELOADED_SPORTS.map(ev => reiDosCanaisService.tuneSportEventToUBlueChannel(ev)),
    ...REIDOSCANAIS_PRELOADED_CHANNELS.map(ch => reiDosCanaisService.tuneToUBlueChannel(ch))
  ];

  // Combined full channel catalog
  const allShowcaseChannels: Channel[] = [
    ...MOCK_CHANNELS,
    ...tunedChannels,
    ...reiDosCanaisChannels
  ];

  const filteredChannels = filter === 'all'
    ? allShowcaseChannels
    : filter === 'free'
    ? allShowcaseChannels.filter(c => c.requiredTier === 'free')
    : filter === 'omdb'
    ? allShowcaseChannels.filter(c => c.source.includes('omdb') || c.badge?.includes('OMDb') || c.provider.includes('omdbapi.com') || c.provider.includes('OMDb'))
    : filter === 'tvmaze'
    ? allShowcaseChannels.filter(c => c.source.includes('tvmaze') || c.badge?.includes('TVmaze') || c.provider.includes('tvmaze.com') || c.provider.includes('TVmaze'))
    : filter === 'genesiswine'
    ? allShowcaseChannels.filter(c => c.source.includes('genesiswine') || c.badge?.includes('genesiswine') || c.provider.includes('genesiswine') || c.name.includes('@genesiswine'))
    : filter === 'reidoscanais'
    ? allShowcaseChannels.filter(c => c.badge?.includes('REI DOS CANAIS') || c.badge?.includes('AO VIVO') || c.id.startsWith('rc-') || c.provider.includes('Rei dos Canais'))
    : filter === 'originals'
    ? allShowcaseChannels.filter(c => c.source === 'ublue-internal' || c.provider.includes('Universo Blue') || c.badge?.includes('ORIGINAL') || c.name.includes('UBlue'))
    : filter === 'mz'
    ? allShowcaseChannels.filter(c =>
        c.name.includes('TVM') ||
        c.name.includes('STV') ||
        c.name.includes('Miramar') ||
        c.name.includes('Sucesso') ||
        c.name.includes('KTV') ||
        c.name.includes('Eco TV') ||
        c.name.includes('TIM') ||
        c.name.includes('TPA') ||
        c.name.includes('TCV') ||
        c.provider.includes('Moçambique')
      )
    : filter === 'sports'
    ? allShowcaseChannels.filter(c => c.category === 'sports')
    : allShowcaseChannels.filter(c => c.category === filter);

  const getTierBadge = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'free':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600/90 text-white shadow-sm">0 MT (LIVRE)</span>;
      case 'start':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/40">🔒 Start (25 MT)</span>;
      case 'basic':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950/90 text-blue-300 border border-blue-500/40">🔒 Basic (100 MT)</span>;
      case 'medio':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950/90 text-purple-300 border border-purple-500/40">🔒 Médio (250 MT)</span>;
      case 'max':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950/90 text-amber-300 border border-amber-500/40">🔒 Max (500 MT)</span>;
    }
  };

  return (
    <section id="canais" className="py-20 bg-[#050814] relative text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">
              <Tv className="w-3.5 h-3.5" />
              <span>Programação em Tempo Real · OMDb • TVmaze • TMDb @genesiswine • Rei dos Canais</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Grade Expandida de Canais ({allShowcaseChannels.length}+ Canais)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Canais nacionais moçambicanos, curadoria exclusiva de @genesiswine na TMDb, produções OMDb, redes web TVmaze e transmissões esportivas do Rei dos Canais.
            </p>
          </div>

          {/* Sintonizar Mais Canais Button */}
          {onOpenTuner && (
            <button
              onClick={onOpenTuner}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-amber-500 hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Sintonizador Multi-Fonte (Sintonizar Outros)</span>
            </button>
          )}
        </div>

        {/* Interactive filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              filter === 'all' ? 'bg-blue-600 text-white font-bold shadow-md' : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            ✨ Todos ({allShowcaseChannels.length})
          </button>
          <button
            onClick={() => setFilter('omdb')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              filter === 'omdb' ? 'bg-amber-600 text-white font-bold shadow-md' : 'bg-slate-900/80 text-amber-400 hover:text-white border border-slate-800'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>🎬 OMDb API ({allShowcaseChannels.filter(c => c.source.includes('omdb') || c.badge?.includes('OMDb')).length})</span>
          </button>
          <button
            onClick={() => setFilter('tvmaze')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              filter === 'tvmaze' ? 'bg-teal-600 text-white font-bold shadow-md' : 'bg-slate-900/80 text-teal-400 hover:text-white border border-slate-800'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>📺 TVmaze Web ({allShowcaseChannels.filter(c => c.source.includes('tvmaze') || c.badge?.includes('TVmaze')).length})</span>
          </button>
          <button
            onClick={() => setFilter('genesiswine')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              filter === 'genesiswine' ? 'bg-purple-600 text-white font-bold shadow-md' : 'bg-slate-900/80 text-purple-400 hover:text-white border border-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>🍷 TMDb @genesiswine ({allShowcaseChannels.filter(c => c.source.includes('genesiswine') || c.name.includes('@genesiswine')).length})</span>
          </button>
          <button
            onClick={() => setFilter('reidoscanais')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              filter === 'reidoscanais' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'bg-slate-900/80 text-amber-300 hover:text-white border border-slate-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>👑 Rei dos Canais ({reiDosCanaisChannels.length})</span>
          </button>
          <button
            onClick={() => setFilter('free')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              filter === 'free' ? 'bg-emerald-600 text-white font-bold shadow-md' : 'bg-slate-900/80 text-emerald-400 hover:text-white border border-slate-800'
            }`}
          >
            🟢 Livres (0 MT)
          </button>
          <button
            onClick={() => setFilter('originals')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              filter === 'originals' ? 'bg-cyan-600 text-white font-bold shadow-md' : 'bg-slate-900/80 text-cyan-400 hover:text-white border border-slate-800'
            }`}
          >
            ⭐ UBlue Originais
          </button>
          <button
            onClick={() => setFilter('mz')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              filter === 'mz' ? 'bg-amber-600 text-white font-bold shadow-md' : 'bg-slate-900/80 text-amber-400 hover:text-white border border-slate-800'
            }`}
          >
            🇲🇿 Moçambique & PALOP
          </button>
          <button
            onClick={() => setFilter('sports')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              filter === 'sports' ? 'bg-blue-600 text-white font-bold shadow-md' : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            ⚽ Desporto
          </button>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredChannels.map((channel) => (
            <div
              key={channel.id}
              onClick={() => onWatchChannel(channel)}
              className="group relative rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between shadow-lg"
            >
              {/* Thumbnail with overlay */}
              <div className="relative aspect-video overflow-hidden bg-slate-950">
                <img
                  src={channel.coverImage}
                  alt={channel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Channel logo / number */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-blue-600 text-white text-[11px] font-black flex items-center justify-center shadow-md">
                    {channel.number}
                  </span>
                  {channel.badge && (
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-blue-950 text-cyan-300 border border-cyan-500/40">
                      {channel.badge.split('(')[0]}
                    </span>
                  )}
                </div>

                {/* Required tier badge */}
                <div className="absolute top-3 right-3">
                  {getTierBadge(channel.requiredTier)}
                </div>

                {/* Viewers */}
                <div className="absolute bottom-2 left-3 flex items-center gap-1.5 text-[11px] font-medium text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <Users className="w-3 h-3 text-cyan-400" />
                  <span>{channel.viewers.toLocaleString('pt-PT')} ao vivo</span>
                </div>

                {/* Hover Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <div className="w-12 h-12 rounded-full bg-cyan-500 text-black flex items-center justify-center shadow-xl shadow-cyan-500/50 transform scale-75 group-hover:scale-100 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Info area */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <ChannelLogoBadge channel={channel} size="sm" showCornerUBlueBadge={true} />
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {channel.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mb-3">
                    {channel.tagline}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-800/80">
                  <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider mb-0.5">
                    No ar agora:
                  </div>
                  <div className="text-xs text-slate-200 font-medium line-clamp-1">
                    {channel.currentProgram}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
