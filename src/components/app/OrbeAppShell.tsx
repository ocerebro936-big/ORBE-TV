import React, { useState, useEffect } from 'react';
import { Tv, Bell, User, Play, Search, Home, Radio, Sparkles, Layers, ArrowLeft, Smartphone, Monitor, ShieldCheck, Flame, Film, Music, Newspaper, Trophy, Globe, Key, Copy, Check, CreditCard, Lock, CheckCircle2, Server, Zap, SlidersHorizontal, PlusCircle } from 'lucide-react';
import { Channel, Content, SubscriptionTier, UserProfile } from '../../types/content';
import { MOCK_CHANNELS, MOCK_CONTENT_CATALOG, UBLUE_PLANS } from '../../data/mock-content';
import { CURATED_IPTV_CHANNELS } from '../../data/iptv-channels-data';
import { LivePlayer } from './LivePlayer';
import { UnifiedSearch } from './UnifiedSearch';
import { ContentEngineViewer } from './ContentEngineViewer';
import { EPGGuide } from './EPGGuide';
import { ProfileModal } from './ProfileModal';
import { UpgradeModal } from './UpgradeModal';
import { TurboServerModal } from './TurboServerModal';
import { ChannelTunerModal } from '../tuner/ChannelTunerModal';
import { channelTunerService } from '../../services/channel-tuner-service';
import { entitlementEngine } from '../../engine/subscription-engine';
import { turboEdgeServer, ZeroDataSessionState } from '../../services/turbo-edge-server';
import { ChannelLogoBadge } from '../common/ChannelLogoBadge';
import {
  reiDosCanaisService,
  REIDOSCANAIS_PRELOADED_CHANNELS,
  REIDOSCANAIS_PRELOADED_SPORTS
} from '../../services/reidoscanais-service';

interface OrbeAppShellProps {
  onBackToPortal: () => void;
  user: UserProfile;
  onUpdateTier: (tier: SubscriptionTier) => void;
  onOpenPaymentModal: (tier?: SubscriptionTier) => void;
  onOpenTmdb?: () => void;
  onOpenTvmaze?: () => void;
  onOpenReiDosCanais?: () => void;
  onOpenAuth?: () => void;
  initialChannel?: Channel;
  initialCategory?: string;
}

export const OrbeAppShell: React.FC<OrbeAppShellProps> = ({
  onBackToPortal,
  user,
  onUpdateTier,
  onOpenPaymentModal,
  onOpenTmdb,
  onOpenTvmaze,
  onOpenReiDosCanais,
  onOpenAuth,
  initialChannel,
  initialCategory,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'channels' | 'player' | 'search' | 'engine' | 'profile'>('home');
  const [activeChannel, setActiveChannel] = useState<Channel>(initialChannel || MOCK_CHANNELS[0]);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || 'all');
  const [deviceMode, setDeviceMode] = useState<'responsive' | 'mobile-mockup'>('responsive');
  const [upgradeTarget, setUpgradeTarget] = useState<Channel | Content | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isTurboModalOpen, setIsTurboModalOpen] = useState(false);
  const [isTunerModalOpen, setIsTunerModalOpen] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>('Transmissão ao vivo dos canais nacionais e UBlue TurboEdge ativa!');
  const [turboState, setTurboState] = useState<ZeroDataSessionState>(() => turboEdgeServer.getState());
  const [tunedChannels, setTunedChannels] = useState<Channel[]>(() => channelTunerService.getTunedChannels());

  useEffect(() => {
    const unsubTurbo = turboEdgeServer.subscribe(() => {
      setTurboState(turboEdgeServer.getState());
    });
    const unsubTuner = channelTunerService.subscribe(() => {
      setTunedChannels(channelTunerService.getTunedChannels());
    });
    return () => {
      unsubTurbo();
      unsubTuner();
    };
  }, []);

  const userTier = user.subscription.tier;
  const currentPlan = UBLUE_PLANS.find(p => p.id === userTier) || UBLUE_PLANS[0];
  const canZeroData = turboEdgeServer.canAccessZeroData(userTier);
  const activeServer = turboEdgeServer.getActiveServer();

  const handleSelectChannel = (channel: Channel) => {
    const check = entitlementEngine.evaluateAccess(userTier, channel.requiredTier);
    if (!check.allowed) {
      setUpgradeTarget(channel);
      return;
    }
    setActiveChannel(channel);
    setActiveTab('player');
  };

  const handleSelectContent = (content: Content) => {
    const check = entitlementEngine.evaluateAccess(userTier, content.subscriptionTier);
    if (!check.allowed) {
      setUpgradeTarget(content);
      return;
    }
    // Simulate playing this content on live player with matching category channel
    const matchingChannel = MOCK_CHANNELS.find(c => c.category === content.category) || MOCK_CHANNELS[0];
    setActiveChannel({
      ...matchingChannel,
      currentProgram: content.title,
      coverImage: content.coverImage
    });
    setActiveTab('player');
  };

  const [copiedId, setCopiedId] = useState(false);

  const handleCopyId = (idToCopy: string) => {
    navigator.clipboard.writeText(idToCopy).catch(() => {});
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const quickCategories = [
    { id: 'all', name: '✨ Todos os Canais', icon: Sparkles },
    { id: 'reidoscanais', name: '👑 Rei dos Canais (Jogos & Futebol)', icon: Trophy },
    { id: 'tuner', name: '📡 Sintonizador (OMDb • TVmaze • TMDb)', icon: Radio },
    { id: 'genesiswine', name: '🍷 TMDb @genesiswine', icon: Sparkles },
    { id: 'omdb', name: '🎬 OMDb Cinema & Séries', icon: Film },
    { id: 'tvmaze', name: '📺 TVmaze Web Channels', icon: Tv },
    { id: 'free', name: '🟢 Canais Livres (0 MT)', icon: Sparkles },
    { id: 'mz', name: '🇲🇿 Moçambique & PALOP', icon: Globe },
    { id: 'originals', name: '⭐ UBlue Originais', icon: Zap },
    { id: 'sports', name: '⚽ Desporto', icon: Trophy },
    { id: 'news', name: '📰 Notícias 24/7', icon: Newspaper },
    { id: 'music', name: '🎵 Música & Ritmos', icon: Music },
    { id: 'kids', name: '👶 Kids & Família', icon: Sparkles },
    { id: 'paid', name: '🔒 Canais Premium', icon: Lock },
  ];

  const reiDosCanaisChannelsAsUBlue: Channel[] = [
    ...REIDOSCANAIS_PRELOADED_SPORTS.map(ev => reiDosCanaisService.tuneSportEventToUBlueChannel(ev)),
    ...REIDOSCANAIS_PRELOADED_CHANNELS.map(ch => reiDosCanaisService.tuneToUBlueChannel(ch))
  ];

  const iptvChannelsAsUBlue: Channel[] = CURATED_IPTV_CHANNELS.map((ch, idx) => ({
    id: ch.id,
    number: 50 + idx,
    name: ch.name,
    tagline: `${ch.country} · ${ch.provider || 'iptv-org'}`,
    logo: ch.logo,
    coverImage: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&auto=format&fit=crop&q=80',
    category: (ch.category as any) || 'live',
    requiredTier: 'free',
    currentProgram: ch.currentProgram || ch.name,
    nextProgram: ch.nextProgram || 'Emissão Contínua 24/7',
    viewers: 8500 + idx * 300,
    source: 'iptv-org',
    provider: ch.provider || 'iptv-org GitHub',
    streamUrl: ch.streamUrl,
    videoType: 'hls',
    badge: 'IPTV-ORG'
  }));

  // Merges default mock channels, Rei dos Canais live sports/channels, user tuned channels, plus IPTV
  const allAvailableChannels = [
    ...MOCK_CHANNELS,
    ...reiDosCanaisChannelsAsUBlue,
    ...tunedChannels,
    ...iptvChannelsAsUBlue
  ];

  const filteredChannels = activeCategory === 'all'
    ? allAvailableChannels
    : activeCategory === 'reidoscanais'
    ? allAvailableChannels.filter(c => c.badge?.includes('REI DOS CANAIS') || c.badge?.includes('AO VIVO') || c.id.startsWith('rc-') || c.provider.includes('Rei dos Canais'))
    : activeCategory === 'free'
    ? allAvailableChannels.filter(c => c.requiredTier === 'free')
    : activeCategory === 'paid'
    ? allAvailableChannels.filter(c => c.requiredTier !== 'free')
    : activeCategory === 'tuner'
    ? allAvailableChannels.filter(c => c.source.includes('omdb') || c.source.includes('tvmaze') || c.source.includes('genesiswine') || c.source.includes('tmdb'))
    : activeCategory === 'genesiswine'
    ? allAvailableChannels.filter(c => c.source.includes('genesiswine') || c.badge?.includes('genesiswine') || c.provider.includes('genesiswine'))
    : activeCategory === 'omdb'
    ? allAvailableChannels.filter(c => c.source.includes('omdb') || c.badge?.includes('OMDb') || c.provider.includes('OMDb'))
    : activeCategory === 'tvmaze'
    ? allAvailableChannels.filter(c => c.source.includes('tvmaze') || c.badge?.includes('TVMAZE') || c.provider.includes('tvmaze'))
    : activeCategory === 'originals'
    ? allAvailableChannels.filter(c => c.source === 'ublue-internal' || c.provider.includes('Universo Blue') || c.badge?.includes('ORIGINAL') || c.name.includes('UBlue'))
    : activeCategory === 'mz'
    ? allAvailableChannels.filter(c =>
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
    : activeCategory === 'iptv'
    ? iptvChannelsAsUBlue
    : activeCategory === 'tmdb'
    ? allAvailableChannels.filter(c => c.category === 'movies' || c.source.includes('tmdb'))
    : allAvailableChannels.filter(c => c.category === activeCategory);

  const recommendedContent = MOCK_CONTENT_CATALOG.slice(0, 4);

  // App Content Body
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6 text-left">
            {/* Top Broadcast Live Hero as in brief */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5 text-red-500 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  🔴 AO VIVO EM DESTAQUE
                </span>
                <span className="text-slate-400 font-mono">12.482 espectadores</span>
              </div>

              {/* Live Player Banner Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-800">
                <LivePlayer
                  channel={activeChannel}
                  userTier={userTier}
                  userId={user.id}
                  onUpgradeRequired={(ch) => setUpgradeTarget(ch)}
                  onSelectFreeChannel={() => {
                    const free = allAvailableChannels.find(c => c.requiredTier === 'free');
                    if (free) setActiveChannel(free);
                  }}
                  onNextChannel={() => {
                    const idx = allAvailableChannels.findIndex(c => c.id === activeChannel.id);
                    setActiveChannel(allAvailableChannels[(idx + 1) % allAvailableChannels.length]);
                  }}
                  onPrevChannel={() => {
                    const idx = allAvailableChannels.findIndex(c => c.id === activeChannel.id);
                    setActiveChannel(allAvailableChannels[(idx - 1 + allAvailableChannels.length) % allAvailableChannels.length]);
                  }}
                  onOpenTurboServers={() => setIsTurboModalOpen(true)}
                />
              </div>
            </div>

            {/* "O que você quer assistir?" Quick search trigger */}
            <div
              onClick={() => setActiveTab('search')}
              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 flex items-center justify-between text-xs cursor-pointer transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2.5 text-slate-400">
                <Search className="w-4 h-4 text-cyan-400" />
                <span>🔎 O que você quer assistir? (TVM, STV, Desporto, Música, Filmes...)</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-bold uppercase">Pesquisar</span>
            </div>

            {/* Quick Categories Bar as in brief */}
            <div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                Canais e Categorias
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {quickCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Channels Grid / Slider */}
            <div>
              <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-300">
                <span className="uppercase tracking-wider">Canais ao Vivo ({filteredChannels.length})</span>
                <button onClick={() => setActiveTab('channels')} className="text-blue-400 hover:underline cursor-pointer">
                  Ver Grade Completa →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {filteredChannels.slice(0, 8).map((ch) => (
                  <div
                    key={ch.id}
                    onClick={() => handleSelectChannel(ch)}
                    className="group relative rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-400/50 overflow-hidden cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div className="relative aspect-video bg-black overflow-hidden">
                      <img src={ch.coverImage} alt={ch.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-blue-600 text-white text-[9px] font-black">
                        #{ch.number}
                      </div>
                      <div className="absolute top-2 right-2">
                        {ch.requiredTier === 'free' ? (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 text-[9px] font-black shadow flex items-center gap-0.5">
                            <span>🟢 LIVRE</span>
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[9px] font-black shadow flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" />
                            <span>PAGO</span>
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-1 right-2 text-[9px] font-mono text-emerald-400">
                        {ch.viewers} ao vivo
                      </div>
                    </div>
                    <div className="p-2.5">
                      <div className="flex items-center gap-2 mb-1">
                        <ChannelLogoBadge channel={ch} size="xs" showCornerUBlueBadge={true} />
                        <div className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                          {ch.name}
                        </div>
                      </div>
                      <div className="text-[10px] text-cyan-400 truncate font-mono">
                        {ch.provider}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {ch.currentProgram}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recomendado para você as in brief */}
            <div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Recomendado para você
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {recommendedContent.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectContent(item)}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 flex items-center gap-3 cursor-pointer group transition-all"
                  >
                    <img src={item.thumbnail} alt={item.title} className="w-14 h-14 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-mono uppercase text-blue-400 font-bold block mb-0.5">
                        {item.category}
                      </span>
                      <div className="text-xs font-bold text-white group-hover:text-blue-400 truncate">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {item.authorOrHost || item.duration}
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        );

      case 'channels':
        return (
          <div className="space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div>
                <h3 className="text-lg font-bold text-white">Grade Completa de Canais UBlue TV</h3>
                <div className="text-xs text-slate-400">
                  Canais Livres (Abertos a 0 MT) e Canais Exclusivos para Assinantes com ID
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsTunerModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-blue-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/25 cursor-pointer transition-all active:scale-95"
                >
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>Sintonizar Novos Canais</span>
                </button>
                <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                  {allAvailableChannels.filter(c => c.requiredTier === 'free').length} Livres
                </span>
                <span className="text-xs text-amber-400 font-semibold bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                  {allAvailableChannels.filter(c => c.requiredTier !== 'free').length} Pagos
                </span>
              </div>
            </div>

            {/* Filter chips inside channels tab */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {quickCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredChannels.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => handleSelectChannel(ch)}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-400/50 cursor-pointer group transition-all flex flex-col justify-between shadow-md"
                >
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <ChannelLogoBadge channel={ch} size="md" showCornerUBlueBadge={true} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-xs font-black text-cyan-400 font-mono">#{ch.number}</span>
                          {ch.requiredTier === 'free' ? (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-black">
                              🟢 LIVRE (0 MT)
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-black flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" />
                              <span>{ch.requiredTier.toUpperCase()}</span>
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                          {ch.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{ch.tagline}</p>
                        <span className="text-[10px] font-mono text-cyan-400">{ch.provider}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 text-[11px] text-slate-300">
                    <span className="text-slate-400 text-[10px] block">No ar:</span>
                    <span className="font-medium line-clamp-1">{ch.currentProgram}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* EPG Schedule */}
            <div className="pt-4">
              <EPGGuide
                channels={MOCK_CHANNELS}
                selectedChannel={activeChannel}
                onSelectChannel={(ch) => setActiveChannel(ch)}
              />
            </div>
          </div>
        );

      case 'player': {
        const currentChannelIdx = allAvailableChannels.findIndex(c => c.id === activeChannel.id);
        const handlePlayerNextChannel = () => {
          const nextIdx = (currentChannelIdx + 1) % allAvailableChannels.length;
          setActiveChannel(allAvailableChannels[nextIdx]);
        };
        const handlePlayerPrevChannel = () => {
          const prevIdx = (currentChannelIdx - 1 + allAvailableChannels.length) % allAvailableChannels.length;
          setActiveChannel(allAvailableChannels[prevIdx]);
        };
        const handlePlayerSelectNumber = (num: number) => {
          const target = allAvailableChannels.find(c => c.number === num);
          if (target) setActiveChannel(target);
        };

        return (
          <div className="space-y-6 text-left">
            <LivePlayer
              channel={activeChannel}
              userTier={userTier}
              userId={user.id}
              onUpgradeRequired={(ch) => setUpgradeTarget(ch)}
              onSelectFreeChannel={() => {
                const free = allAvailableChannels.find(c => c.requiredTier === 'free');
                if (free) setActiveChannel(free);
              }}
              onOpenTurboServers={() => setIsTurboModalOpen(true)}
              onNextChannel={handlePlayerNextChannel}
              onPrevChannel={handlePlayerPrevChannel}
              onSelectChannelNumber={handlePlayerSelectNumber}
              onOpenTunerModal={() => setIsTunerModalOpen(true)}
              allChannels={allAvailableChannels}
            />

            {/* Channel Info & Switcher */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-4">
                <ChannelLogoBadge channel={activeChannel} size="lg" showCornerUBlueBadge={true} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold px-1.5 py-0.5 rounded bg-blue-600 text-white font-mono">
                      Canal {activeChannel.number}
                    </span>
                    <h3 className="text-base font-bold text-white">{activeChannel.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{activeChannel.tagline}</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-cyan-400">
                    <span>{activeChannel.provider}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-emerald-400 font-bold">{activeChannel.viewers.toLocaleString('pt-PT')} assistindo</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsTunerModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-900/80 to-blue-900/80 border border-purple-500/40 text-xs font-bold text-purple-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-600/20 active:scale-95"
                  title="Sintonizar Canais de OMDb, TVmaze e TMDb @genesiswine"
                >
                  <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                  <span>Sintonizador Multi-Fonte</span>
                </button>
                <button
                  onClick={() => setIsTurboModalOpen(true)}
                  className="px-3 py-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/80 transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                  title="Configurar Servidores Potentes e Modo Sem Megas"
                >
                  <Server className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Servidores & Sem Megas</span>
                </button>
                <button
                  onClick={() => setActiveTab('channels')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                >
                  Mudar de Canal
                </button>
                <button
                  onClick={() => setActiveTab('engine')}
                  className="px-3.5 py-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-xs font-semibold text-blue-300 hover:bg-blue-600/30 transition-colors cursor-pointer"
                >
                  Engine Info
                </button>
              </div>
            </div>

            {/* Embedded EPG */}
            <EPGGuide
              channels={MOCK_CHANNELS}
              selectedChannel={activeChannel}
              onSelectChannel={(ch) => setActiveChannel(ch)}
            />
          </div>
        );
      }

      case 'search':
        return (
          <UnifiedSearch
            onSelectChannel={handleSelectChannel}
            onSelectContent={handleSelectContent}
            userTier={userTier}
          />
        );

      case 'engine':
        return <ContentEngineViewer />;

      case 'profile':
        return (
          <div className="max-w-md mx-auto py-4">
            <ProfileModal
              isOpen={true}
              onClose={() => setActiveTab('home')}
              user={user}
              onSwitchTier={onUpdateTier}
              onOpenPayment={() => onOpenPaymentModal(userTier)}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col justify-between">
      
      {/* Top Banner Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#070b1e]/95 backdrop-blur-md border-b border-blue-900/20 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Back to Web Portal */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPortal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Portal Oficial</span>
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Tv className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold text-white">UBlue TV</span>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Mode Switcher, Sintonizador, TurboEdge Server & User Profile Pill */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Rei dos Canais Sports & Games Hub Button */}
            {onOpenReiDosCanais && (
              <button
                onClick={onOpenReiDosCanais}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-950 to-amber-900/80 border border-amber-500/50 text-amber-200 hover:text-white transition-all text-xs font-bold cursor-pointer shadow-md shadow-amber-600/20 active:scale-95"
                title="Hub Rei dos Canais (Futebol, Jogos & API)"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="hidden sm:inline">Rei dos Canais</span>
                <span className="text-[9px] bg-red-600 px-1 py-0.2 rounded text-white font-bold hidden md:inline">Ao Vivo</span>
              </button>
            )}

            {/* Multi-source Channel Tuner (OMDb, TVmaze, TMDb @genesiswine) */}
            <button
              onClick={() => setIsTunerModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-950 to-blue-950 border border-purple-500/40 text-purple-200 hover:text-white transition-all text-xs font-bold cursor-pointer shadow-md shadow-purple-600/20 active:scale-95"
              title="Sintonizar Novos Canais (OMDb • TVmaze • TMDb)"
            >
              <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span className="hidden sm:inline">Sintonizador Multi-Fonte</span>
            </button>

            {/* TurboEdge Server & Zero Data Button */}
            <button
              onClick={() => setIsTurboModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/80 transition-all text-xs font-mono cursor-pointer shadow-md"
              title="Servidores Potentes UBlue & Modo Sem Megas"
            >
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">{activeServer.city}</span>
              <span className="text-emerald-400 font-bold">{activeServer.latencyMs}ms</span>
              {turboState.isZeroDataActive && canZeroData ? (
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-300 text-[9px] font-bold border border-emerald-500/40 hidden sm:inline">
                  Sem Megas
                </span>
              ) : (
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30 hidden sm:inline">
                  TurboEdge
                </span>
              )}
            </button>

            {/* Toggle Device Mockup View */}
            <div className="hidden md:flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <button
                onClick={() => setDeviceMode('responsive')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  deviceMode === 'responsive' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Modo Tela Completa / Web TV"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceMode('mobile-mockup')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  deviceMode === 'mobile-mockup' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Modo Simulador Smartphone"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Notification Bell with In-App Popover */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationToast(!showNotificationToast)}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white relative cursor-pointer"
                title="Notificações"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              </button>
              {showNotificationToast && (
                <div className="absolute right-0 top-11 z-50 w-72 p-3 rounded-2xl bg-slate-950 border border-cyan-500/40 shadow-2xl text-xs text-left">
                  <div className="font-bold text-cyan-400 mb-1 flex items-center justify-between">
                    <span>Avisos UBlue TV</span>
                    <button onClick={() => setShowNotificationToast(false)} className="text-slate-400 hover:text-white">✕</button>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{notificationMsg}</p>
                  <div className="mt-2 text-[10px] text-emerald-400 font-mono">
                    ✓ Servidores PoP Moçambique operacionais
                  </div>
                </div>
              )}
            </div>

            {/* Profile / Tier Pill */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            >
              <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-lg object-cover" />
              <div className="text-left hidden sm:block">
                <div className="text-[11px] font-bold text-white line-clamp-1">{user.name.split(' ')[0]}</div>
                <div className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider">{currentPlan.name}</div>
              </div>
            </button>
          </div>

        </div>
      </header>

      {/* Launch Banner & Member ID Pass */}
      <div className="bg-gradient-to-r from-blue-950 via-[#071330] to-slate-950 border-b border-blue-500/30 px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-500/40 font-black text-[10px] tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>🚀 UBlue TV Lançamento Oficial</span>
            </span>

            <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1 rounded-xl border border-blue-500/30 font-mono text-slate-200">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400 text-[11px]">Seu ID Único:</span>
              <strong className="text-white font-black text-xs">{user.id}</strong>
              <button
                onClick={() => handleCopyId(user.id)}
                className="ml-1 p-0.5 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                title="Copiar ID"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              {copiedId && (
                <span className="text-[10px] text-emerald-400 font-bold ml-1 animate-fade-in">Copiado!</span>
              )}
            </div>

            <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black ${
              user.subscription.tier === 'free'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {user.subscription.tier === 'free'
                ? '🟢 Modo Livre (Pague para canais exclusivos)'
                : `⭐ Assinante Ativo (${currentPlan.name})`}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenPaymentModal(user.subscription.tier === 'free' ? 'basic' : user.subscription.tier)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-[11px] flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer active:scale-95 transition-all"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Pagar TV com meu ID</span>
            </button>
            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-[11px] flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Trocar / Criar ID</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Container: Handles full width or mobile frame mockup */}
      <main className="flex-1 py-6 px-4">
        {deviceMode === 'mobile-mockup' ? (
          <div className="max-w-sm mx-auto rounded-[40px] bg-slate-950 border-4 border-slate-800 p-4 shadow-2xl shadow-blue-950/60 relative overflow-hidden">
            {/* Phone notch */}
            <div className="w-28 h-4 bg-slate-900 rounded-full mx-auto mb-4" />
            
            {/* App View Inside Phone */}
            <div className="max-h-[750px] overflow-y-auto pr-1">
              {renderTabContent()}
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            {renderTabContent()}
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar as explicitly detailed in user prompt */}
      {/* ├─────────────────────────────────┤
          │ Início  Canais  Play  🔎 Perfil │
          └─────────────────────────────────┘ */}
      <footer className="sticky bottom-0 z-40 bg-[#070b1e]/95 backdrop-blur-xl border-t border-blue-900/30 px-4 py-2">
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1 text-center">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
              activeTab === 'home' ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span>Início</span>
          </button>

          <button
            onClick={() => setActiveTab('channels')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
              activeTab === 'channels' ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tv className="w-4 h-4 mb-0.5" />
            <span>Canais</span>
          </button>

          <button
            onClick={() => setActiveTab('player')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
              activeTab === 'player' ? 'text-cyan-300 bg-blue-600/30 scale-105' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Play className="w-4 h-4 fill-current mb-0.5" />
            <span>Play</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
              activeTab === 'search' ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-4 h-4 mb-0.5" />
            <span>Pesquisa</span>
          </button>

          <button
            onClick={() => setActiveTab('engine')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
              activeTab === 'engine' ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 mb-0.5" />
            <span>Engine</span>
          </button>
        </div>
      </footer>

      {/* Upgrade Entitlement Modal */}
      <UpgradeModal
        isOpen={Boolean(upgradeTarget)}
        onClose={() => setUpgradeTarget(null)}
        targetItem={upgradeTarget}
        userTier={userTier}
        userId={user.id}
        onConfirmUpgrade={(tier) => {
          setUpgradeTarget(null);
          onOpenPaymentModal(tier);
        }}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onSwitchTier={onUpdateTier}
        onOpenPayment={() => {
          setIsProfileOpen(false);
          onOpenPaymentModal(userTier);
        }}
      />

      {/* TurboEdge Server & Modo Sem Megas Modal */}
      <TurboServerModal
        isOpen={isTurboModalOpen}
        onClose={() => setIsTurboModalOpen(false)}
        userTier={userTier}
        onOpenPayment={() => {
          setIsTurboModalOpen(false);
          onOpenPaymentModal('start');
        }}
      />

      {/* Multi-Source Channel Tuner Modal (OMDb • TVmaze • TMDb @genesiswine) */}
      <ChannelTunerModal
        isOpen={isTunerModalOpen}
        onClose={() => setIsTunerModalOpen(false)}
        onChannelTunedAndPlay={(tunedChannel) => {
          setActiveChannel(tunedChannel);
          setActiveTab('player');
          setIsTunerModalOpen(false);
        }}
      />

    </div>
  );
};
