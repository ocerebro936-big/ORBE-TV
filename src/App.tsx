/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/portal/Navbar';
import { HeroSection } from './components/portal/HeroSection';
import { WhatYouFindSection } from './components/portal/WhatYouFindSection';
import { PackagesSection } from './components/portal/PackagesSection';
import { ChannelsShowcase } from './components/portal/ChannelsShowcase';
import { DownloadSection } from './components/portal/DownloadSection';
import { FaqSection } from './components/portal/FaqSection';
import { RoadmapMilestones } from './components/portal/RoadmapMilestones';
import { Footer } from './components/portal/Footer';
import { DownloadModal } from './components/portal/DownloadModal';
import { PaymentModal } from './components/portal/PaymentModal';
import { ArchitectureModal } from './components/portal/ArchitectureModal';
import { ProfileModal } from './components/app/ProfileModal';
import { AuthModal } from './components/auth/AuthModal';
import { authService } from './services/auth-service';
import { OrbeFinanceCenter } from './components/finance/OrbeFinanceCenter';
import { ReiDosCanaisHub } from './components/reidoscanais/ReiDosCanaisHub';
import { OrbeAppShell } from './components/app/OrbeAppShell';
import { CreatorHub, CreatorHubTab } from './components/creator/CreatorHub';
import { BusinessCenter } from './components/business/BusinessCenter';
import { PartnerNetwork } from './components/partner/PartnerNetwork';
import { AIEngineStudio } from './components/ai/AIEngineStudio';
import { OriginalsStudio } from './components/originals/OriginalsStudio';
import { OrbeWalletModal } from './components/wallet/OrbeWalletModal';
import { PaymentsFinanceCenterModal } from './components/payments/PaymentsFinanceCenterModal';
import { OttEngineeringCenter } from './components/ott/OttEngineeringCenter';
import { WireframeStudio } from './components/wireframes/WireframeStudio';
import { IptvOrgHub } from './components/iptv/IptvOrgHub';
import { BroadcastAtlasHub } from './components/broadcast/BroadcastAtlasHub';
import { TmdbMoviesHub } from './components/tmdb/TmdbMoviesHub';
import { TvmazeWebChannelsHub } from './components/tvmaze/TvmazeWebChannelsHub';
import { ChannelTunerModal } from './components/tuner/ChannelTunerModal';
import { CorsBypassMonitorModal } from './components/common/CorsBypassMonitorModal';
import { MediaIngestionStudio } from './components/ingestion/MediaIngestionStudio';
import { GlobalPartnershipProposalModal } from './components/partner/GlobalPartnershipProposalModal';
import { OrbePayGatewayModal } from './components/payments/OrbePayGatewayModal';
import { Channel, SubscriptionTier, UserProfile } from './types/content';
import { OriginalShow } from './types/ecosystem';
import { IptvChannel } from './types/iptv';
import { AtlasStation } from './data/broadcast-atlas-data';
import { TmdbMovie } from './types/tmdb';
import { TMDB_IMAGE_BASE_W500 } from './data/tmdb-movies-data';
import { INITIAL_USER, MOCK_CHANNELS } from './data/mock-content';
import { entitlementEngine } from './engine/subscription-engine';
import { ArrowLeft, Video, Briefcase, Globe2, Bot, Star, Wallet, Tv, Cpu, Layers, Wand2, Globe, Calendar, ScrollText, Radio, Compass, Film, Trophy, CreditCard, Handshake } from 'lucide-react';
import { UserRegistrationGate } from './components/auth/UserRegistrationGate';
import { VirtualTVRemote } from './components/common/VirtualTVRemote';
import { useSmartDevice } from './services/device-adaptive-engine';

export type AppViewMode = 'portal' | 'app' | 'creator' | 'business' | 'partner' | 'ai' | 'originals' | 'ott-blueprint' | 'wireframes' | 'iptv' | 'broadcast-atlas' | 'tmdb' | 'tvmaze' | 'finance' | 'reidoscanais' | 'media-ingestion';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => authService.hasCompletedOnboarding());
  const { formFactor, setOverride } = useSmartDevice();
  const [isVirtualRemoteOpen, setIsVirtualRemoteOpen] = useState(false);
  const [isChannelTunerOpen, setIsChannelTunerOpen] = useState(false);
  const [isCorsBypassModalOpen, setIsCorsBypassModalOpen] = useState(false);
  const [isGlobalProposalOpen, setIsGlobalProposalOpen] = useState(false);
  const [isOrbePayOpen, setIsOrbePayOpen] = useState(false);

  const [viewMode, setViewMode] = useState<AppViewMode>('portal');
  const [creatorTab, setCreatorTab] = useState<CreatorHubTab>('content');
  const [user, setUser] = useState<UserProfile>(() => authService.getCurrentUser());
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [downloadModalOs, setDownloadModalOs] = useState<'android' | 'ios'>('android');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<SubscriptionTier>('basic');
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isFinanceCenterOpen, setIsFinanceCenterOpen] = useState(false);
  const [targetChannelForApp, setTargetChannelForApp] = useState<Channel | undefined>(MOCK_CHANNELS[0]);
  const [targetCategoryForApp, setTargetCategoryForApp] = useState<string | undefined>('all');

  const handleOpenDownload = (os: 'android' | 'ios' = 'android') => {
    setDownloadModalOs(os);
    setIsDownloadModalOpen(true);
  };

  const handleOpenPayment = (tier: SubscriptionTier = 'basic') => {
    setSelectedPlanForPayment(tier);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (
    tier: SubscriptionTier,
    paymentMethod: 'mpesa' | 'emola' | 'card',
    phone: string,
    targetUserId?: string
  ) => {
    const res = authService.processPaymentForId(
      targetUserId || user.id,
      tier,
      paymentMethod,
      phone
    );
    setUser(res.user);
  };

  const handleSwitchTierSimulation = (tier: SubscriptionTier) => {
    const updated = authService.simulateTier(user.id, tier);
    setUser(updated);
  };

  const handleWatchChannelFromPortal = (channel: Channel) => {
    setTargetChannelForApp(channel);
    setViewMode('app');
  };

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'tvmaze') {
      setViewMode('tvmaze');
      return;
    }
    if (categoryId === 'reidoscanais') {
      setViewMode('reidoscanais');
      return;
    }
    setTargetCategoryForApp(categoryId);
    const matchingChannel = MOCK_CHANNELS.find((c) => c.category === categoryId) || MOCK_CHANNELS[0];
    setTargetChannelForApp(matchingChannel);
    setViewMode('app');
  };

  const handleWatchOriginalShow = (show: OriginalShow) => {
    const matchingChannel = MOCK_CHANNELS.find(c => c.category === 'originals') || MOCK_CHANNELS[0];
    setTargetChannelForApp({
      ...matchingChannel,
      currentProgram: show.title,
      coverImage: show.coverImage
    });
    setViewMode('app');
  };

  const handleNextChannel = () => {
    const curIdx = MOCK_CHANNELS.findIndex((c) => c.id === targetChannelForApp?.id);
    const nextChan = MOCK_CHANNELS[(curIdx + 1) % MOCK_CHANNELS.length];
    setTargetChannelForApp(nextChan);
    setViewMode('app');
  };

  const handlePrevChannel = () => {
    const curIdx = MOCK_CHANNELS.findIndex((c) => c.id === targetChannelForApp?.id);
    const prevChan = MOCK_CHANNELS[(curIdx - 1 + MOCK_CHANNELS.length) % MOCK_CHANNELS.length];
    setTargetChannelForApp(prevChan);
    setViewMode('app');
  };

  const handleSelectChannelNumber = (num: number) => {
    const found = MOCK_CHANNELS.find((c) => c.number === num);
    if (found) {
      setTargetChannelForApp(found);
      setViewMode('app');
    }
  };

  // If user is not authenticated, show UserRegistrationGate before entering Home!
  if (!isAuthenticated) {
    return (
      <UserRegistrationGate
        onAuthenticated={(newUser) => {
          setUser(newUser);
          setIsAuthenticated(true);
        }}
        onExploreAsGuest={() => {
          const guest = authService.createGuestUser();
          setUser(guest);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Ecosystem Navigation Bar */}
      {viewMode !== 'app' && viewMode !== 'ott-blueprint' && viewMode !== 'wireframes' && (
        <Navbar
          onOpenApp={() => setViewMode('app')}
          onOpenDownload={() => handleOpenDownload('android')}
          onOpenPayment={handleOpenPayment}
          onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
          onOpenCreatorHub={() => {
            setCreatorTab('content');
            setViewMode('creator');
          }}
          onOpenMediaEnhancement={() => {
            setCreatorTab('media-enhancement');
            setViewMode('creator');
          }}
          onOpenBroadcastNetwork={() => {
            setCreatorTab('open-broadcast');
            setViewMode('creator');
          }}
          onOpenManifesto={() => {
            setCreatorTab('manifesto');
            setViewMode('creator');
          }}
          onOpenBusinessCenter={() => setViewMode('business')}
          onOpenPartnerNetwork={() => setViewMode('partner')}
          onOpenAIEngine={() => setViewMode('ai')}
          onOpenOriginals={() => setViewMode('originals')}
          onOpenWallet={() => setIsWalletModalOpen(true)}
          onOpenFinanceCenter={() => setIsFinanceCenterOpen(true)}
          onOpenOttBlueprint={() => setViewMode('ott-blueprint')}
          onOpenWireframes={() => setViewMode('wireframes')}
          onOpenIptv={() => setViewMode('iptv')}
          onOpenBroadcastAtlas={() => setViewMode('broadcast-atlas')}
          onOpenTmdb={() => setViewMode('tmdb')}
          onOpenTvmaze={() => setViewMode('tvmaze')}
          onOpenReiDosCanais={() => setViewMode('reidoscanais')}
          onOpenTuner={() => setIsChannelTunerOpen(true)}
          onOpenRemote={() => setIsVirtualRemoteOpen(true)}
          onOpenCorsProxy={() => setIsCorsBypassModalOpen(true)}
          onOpenMediaIngestion={() => setViewMode('media-ingestion')}
          onOpenGlobalProposal={() => setIsGlobalProposalOpen(true)}
          onOpenOrbePay={() => setIsOrbePayOpen(true)}
          currentDeviceMode={formFactor}
          onSelectDeviceMode={(mode) => setOverride(mode)}
          onLogout={() => {
            authService.logout();
            setIsAuthenticated(false);
          }}
          currentTier={user.subscription.tier}
          currentUser={user}
          onOpenAuth={() => setIsProfileModalOpen(true)}
          activeView={viewMode}
        />
      )}

      {/* Subheader bar when in non-portal views (simple, sleek 1-click back to portal) */}
      {viewMode !== 'portal' && viewMode !== 'app' && viewMode !== 'ott-blueprint' && viewMode !== 'wireframes' && (
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <button
              onClick={() => setViewMode('portal')}
              className="flex items-center gap-1.5 text-cyan-400 hover:text-white font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Portal Principal ORBE TV</span>
            </button>
            <span className="text-slate-400 font-mono text-[11px] capitalize">
              Visão: {viewMode}
            </span>
          </div>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {viewMode === 'portal' && (
          <>
            <HeroSection
              onOpenApp={() => setViewMode('app')}
              onOpenDownload={handleOpenDownload}
              onOpenOttBlueprint={() => setViewMode('ott-blueprint')}
              onOpenWireframes={() => setViewMode('wireframes')}
              onOpenBroadcastNetwork={() => {
                setCreatorTab('open-broadcast');
                setViewMode('creator');
              }}
              onOpenMediaEnhancement={() => {
                setCreatorTab('media-enhancement');
                setViewMode('creator');
              }}
              onOpenIptv={() => setViewMode('iptv')}
              onOpenBroadcastAtlas={() => setViewMode('broadcast-atlas')}
              onOpenReiDosCanais={() => setViewMode('reidoscanais')}
              onViewPackages={() => {
                const el = document.getElementById('pacotes');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <WhatYouFindSection onCategoryClick={handleCategoryClick} />

            <PackagesSection
              onSelectPlan={(tier) => {
                if (tier === 'free') {
                  setViewMode('app');
                } else {
                  handleOpenPayment(tier);
                }
              }}
              currentTier={user.subscription.tier}
            />

            <ChannelsShowcase
              onWatchChannel={handleWatchChannelFromPortal}
              userTier={user.subscription.tier}
              onUpgradePrompt={(channel) => handleOpenPayment(channel.requiredTier)}
              onOpenTuner={() => setIsChannelTunerOpen(true)}
            />

            <DownloadSection
              onOpenDownloadModal={handleOpenDownload}
              onOpenWebApp={() => setViewMode('app')}
            />

            {/* FASE 2: Roadmap and Milestones (Ano 1, 2, 3) */}
            <RoadmapMilestones />

            <FaqSection />
          </>
        )}

        {viewMode === 'app' && (
          <OrbeAppShell
            onBackToPortal={() => setViewMode('portal')}
            user={user}
            onUpdateTier={handleSwitchTierSimulation}
            onOpenPaymentModal={handleOpenPayment}
            onOpenTmdb={() => setViewMode('tmdb')}
            onOpenTvmaze={() => setViewMode('tvmaze')}
            onOpenReiDosCanais={() => setViewMode('reidoscanais')}
            onOpenAuth={() => setIsProfileModalOpen(true)}
            initialChannel={targetChannelForApp}
            initialCategory={targetCategoryForApp}
          />
        )}

        {viewMode === 'creator' && (
          <CreatorHub
            key={creatorTab}
            initialTab={creatorTab}
            onOpenWallet={() => setIsWalletModalOpen(true)}
            onOpenAIEngine={() => setViewMode('ai')}
          />
        )}

        {viewMode === 'business' && (
          <BusinessCenter
            onOpenWallet={() => setIsWalletModalOpen(true)}
            onOpenFinanceCenter={() => setIsFinanceCenterOpen(true)}
          />
        )}

        {viewMode === 'partner' && (
          <PartnerNetwork />
        )}

        {viewMode === 'ai' && (
          <AIEngineStudio />
        )}

        {viewMode === 'originals' && (
          <OriginalsStudio
            onWatchShow={handleWatchOriginalShow}
          />
        )}

        {viewMode === 'ott-blueprint' && (
          <OttEngineeringCenter
            onBackToPortal={() => setViewMode('portal')}
            onLaunchPlayer={() => setViewMode('app')}
          />
        )}

        {viewMode === 'wireframes' && (
          <WireframeStudio
            onBackToPortal={() => setViewMode('portal')}
            onLaunchPlayer={() => setViewMode('app')}
          />
        )}

        {viewMode === 'iptv' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <IptvOrgHub
              onWatchInMainPlayer={(iptvCh) => {
                const bridgedChannel: Channel = {
                  id: iptvCh.id,
                  number: 99,
                  name: iptvCh.name,
                  tagline: `${iptvCh.country} · ${iptvCh.provider || 'iptv-org'}`,
                  logo: iptvCh.logo,
                  coverImage: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&auto=format&fit=crop&q=80',
                  category: 'live',
                  requiredTier: 'free',
                  currentProgram: iptvCh.currentProgram || iptvCh.name,
                  nextProgram: iptvCh.nextProgram || 'Emissão Contínua 24/7',
                  viewers: 14500,
                  source: 'iptv-org',
                  provider: iptvCh.provider || 'iptv-org Global Network',
                  streamUrl: iptvCh.streamUrl,
                  videoType: 'hls',
                  badge: 'IPTV'
                };
                setTargetChannelForApp(bridgedChannel);
                setViewMode('app');
              }}
              onBackToPortal={() => setViewMode('portal')}
              onOpenBroadcastAtlas={() => setViewMode('broadcast-atlas')}
            />
          </div>
        )}

        {viewMode === 'broadcast-atlas' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <BroadcastAtlasHub
              onWatchInMainPlayer={(station: AtlasStation) => {
                const bridgedChannel: Channel = {
                  id: station.id,
                  number: 98,
                  name: station.name,
                  tagline: `${station.city}, ${station.country} · ${station.frequency}`,
                  logo: station.thumbnail,
                  coverImage: station.thumbnail,
                  category: 'live',
                  requiredTier: 'free',
                  currentProgram: `${station.name} (${station.callSign || 'LIVE'})`,
                  nextProgram: 'Transmissão Contínua 24/7 (Broadcast Atlas)',
                  viewers: 22400,
                  source: 'iptv-org',
                  provider: 'Broadcast Atlas (broadcastatlas.com)',
                  streamUrl: station.streamUrl,
                  videoType: 'hls',
                  badge: 'ATLAS'
                };
                setTargetChannelForApp(bridgedChannel);
                setViewMode('app');
              }}
              onBackToPortal={() => setViewMode('portal')}
              onOpenIptv={() => setViewMode('iptv')}
            />
          </div>
        )}

        {viewMode === 'tmdb' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <TmdbMoviesHub
              onWatchInPlayer={(movie: TmdbMovie) => {
                const cinemaChannel: Channel = {
                  id: `tmdb-${movie.id}`,
                  number: 88,
                  name: `Cinema: ${movie.title}`,
                  tagline: `${movie.genres?.join(', ') || 'Filme'} · TMDb ⭐ ${movie.vote_average.toFixed(1)}/10`,
                  logo: movie.poster_path ? `${TMDB_IMAGE_BASE_W500}${movie.poster_path}` : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80',
                  coverImage: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80',
                  category: 'movies',
                  requiredTier: 'free',
                  currentProgram: movie.title,
                  nextProgram: `Sinopse: ${movie.overview.substring(0, 90)}...`,
                  viewers: 18400,
                  source: 'movies-metadata',
                  provider: 'The Movie Database (TMDb)',
                  streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                  videoType: 'hls',
                  badge: 'TMDB'
                };
                setTargetChannelForApp(cinemaChannel);
                setViewMode('app');
              }}
              onBackToPortal={() => setViewMode('portal')}
              onOpenIptv={() => setViewMode('iptv')}
              onOpenBroadcastAtlas={() => setViewMode('broadcast-atlas')}
              onOpenTvmaze={() => setViewMode('tvmaze')}
            />
          </div>
        )}

        {viewMode === 'tvmaze' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <TvmazeWebChannelsHub
              onWatchInPlayer={(channel) => {
                setTargetChannelForApp(channel);
                setViewMode('app');
              }}
              onBackToPortal={() => setViewMode('portal')}
              onOpenIptv={() => setViewMode('iptv')}
              onOpenBroadcastAtlas={() => setViewMode('broadcast-atlas')}
              onOpenTmdb={() => setViewMode('tmdb')}
            />
          </div>
        )}

        {viewMode === 'finance' && (
          <OrbeFinanceCenter
            onBackToPortal={() => setViewMode('portal')}
            currentUser={user}
            onOpenPaymentModal={handleOpenPayment}
          />
        )}

        {viewMode === 'reidoscanais' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <ReiDosCanaisHub
              onWatchChannel={(channel) => {
                setTargetChannelForApp(channel);
                setViewMode('app');
              }}
              onBackToPortal={() => setViewMode('portal')}
            />
          </div>
        )}

        {viewMode === 'media-ingestion' && (
          <MediaIngestionStudio
            onBackToPortal={() => setViewMode('portal')}
            onPlayChannel={(channel) => {
              setTargetChannelForApp(channel);
              setViewMode('app');
            }}
          />
        )}
      </main>

      {/* Footer (Shown on non-app, non-ott-console, and non-wireframes views) */}
      {viewMode !== 'app' && viewMode !== 'ott-blueprint' && viewMode !== 'wireframes' && (
        <Footer
          onOpenApp={() => setViewMode('app')}
          onOpenDownload={() => handleOpenDownload('android')}
          onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
          onOpenOttBlueprint={() => setViewMode('ott-blueprint')}
          onOpenWireframes={() => setViewMode('wireframes')}
          onOpenCreatorHub={() => {
            setCreatorTab('content');
            setViewMode('creator');
          }}
          onOpenMediaEnhancement={() => {
            setCreatorTab('media-enhancement');
            setViewMode('creator');
          }}
          onOpenBroadcastNetwork={() => {
            setCreatorTab('open-broadcast');
            setViewMode('creator');
          }}
          onOpenManifesto={() => {
            setCreatorTab('manifesto');
            setViewMode('creator');
          }}
          onOpenBusinessCenter={() => setViewMode('business')}
          onOpenPartnerNetwork={() => setViewMode('partner')}
          onOpenAIEngine={() => setViewMode('ai')}
          onOpenOriginals={() => setViewMode('originals')}
          onOpenWallet={() => setIsWalletModalOpen(true)}
          onOpenFinanceCenter={() => setIsFinanceCenterOpen(true)}
          onOpenIptv={() => setViewMode('iptv')}
          onOpenBroadcastAtlas={() => setViewMode('broadcast-atlas')}
          onOpenTmdb={() => setViewMode('tmdb')}
          onOpenTvmaze={() => setViewMode('tvmaze')}
          onOpenReiDosCanais={() => setViewMode('reidoscanais')}
        />
      )}

      {/* Shared Modals */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        initialOs={downloadModalOs}
        onLaunchWebApp={() => setViewMode('app')}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        selectedTier={selectedPlanForPayment}
        user={user}
        onPaymentSuccess={handlePaymentSuccess}
        onOpenFinanceCenter={() => setIsFinanceCenterOpen(true)}
      />

      <ArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
        onOpenOttBlueprint={() => setViewMode('ott-blueprint')}
        onOpenCorsProxy={() => setIsCorsBypassModalOpen(true)}
      />

      <AuthModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={user}
        onUserChange={(updated) => setUser(updated)}
        onOpenPayment={(tier) => {
          setIsProfileModalOpen(false);
          handleOpenPayment(tier || user.subscription.tier);
        }}
      />

      <OrbeWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onPaySubscription={handleOpenPayment}
        onOpenFinanceCenter={() => setIsFinanceCenterOpen(true)}
      />

      <PaymentsFinanceCenterModal
        isOpen={isFinanceCenterOpen}
        onClose={() => setIsFinanceCenterOpen(false)}
        onOpenCheckout={(tier) => handleOpenPayment(tier as any)}
        onOpenFullScreen={() => setViewMode('finance')}
      />

      {/* Smart Virtual TV Remote Control */}
      <VirtualTVRemote
        isOpen={isVirtualRemoteOpen}
        onClose={() => setIsVirtualRemoteOpen(false)}
        currentChannelNumber={targetChannelForApp?.number || 1}
        currentChannelName={targetChannelForApp?.name || 'ORBE TV'}
        onNextChannel={handleNextChannel}
        onPrevChannel={handlePrevChannel}
        onSelectChannelNumber={handleSelectChannelNumber}
        onGoHome={() => setViewMode('portal')}
      />

      {/* Multi-Source Channel Tuner Modal (OMDb • TVmaze • TMDb @genesiswine) */}
      <ChannelTunerModal
        isOpen={isChannelTunerOpen}
        onClose={() => setIsChannelTunerOpen(false)}
        onChannelTunedAndPlay={(newChan) => {
          setTargetChannelForApp(newChan);
          setIsChannelTunerOpen(false);
          setViewMode('app');
        }}
      />

      {/* CORS Proxy & Stream Relayer Monitor & Diagnostic Studio */}
      <CorsBypassMonitorModal
        isOpen={isCorsBypassModalOpen}
        onClose={() => setIsCorsBypassModalOpen(false)}
        initialUrl={targetChannelForApp?.streamUrl}
      />

      {/* PILAR 2: Global Partnership Proposal Modal (Google, Akamai, Cloudflare, Telecoms) */}
      <GlobalPartnershipProposalModal
        isOpen={isGlobalProposalOpen}
        onClose={() => setIsGlobalProposalOpen(false)}
      />

      {/* PILAR 3: ORBE Pay Universal Payment Gateway & Settlement Console */}
      <OrbePayGatewayModal
        isOpen={isOrbePayOpen}
        onClose={() => setIsOrbePayOpen(false)}
        onSuccessPayment={(tier, method, phone) => {
          handlePaymentSuccess(tier as any, method as any, phone);
        }}
      />

    </div>
  );
}
