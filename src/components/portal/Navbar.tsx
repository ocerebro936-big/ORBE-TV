import React, { useState } from 'react';
import {
  Tv,
  Play,
  Smartphone,
  User,
  LogOut,
  Wallet,
  CreditCard,
  Key,
  Radio,
  Sliders,
  ChevronDown,
  Wrench,
  Monitor,
  Tablet,
  Check,
  Trophy
} from 'lucide-react';
import { SubscriptionTier, UserProfile } from '../../types/content';
import { DeviceFormFactor } from '../../services/device-adaptive-engine';

interface NavbarProps {
  onOpenApp: () => void;
  onOpenDownload: () => void;
  onOpenPayment: (tier?: SubscriptionTier) => void;
  onOpenArchitecture: () => void;
  onOpenCreatorHub: () => void;
  onOpenBusinessCenter: () => void;
  onOpenPartnerNetwork: () => void;
  onOpenAIEngine: () => void;
  onOpenOriginals: () => void;
  onOpenWallet: () => void;
  onOpenFinanceCenter?: () => void;
  onOpenOttBlueprint?: () => void;
  onOpenWireframes?: () => void;
  onOpenMediaEnhancement?: () => void;
  onOpenBroadcastNetwork?: () => void;
  onOpenManifesto?: () => void;
  onOpenIptv?: () => void;
  onOpenBroadcastAtlas?: () => void;
  onOpenTmdb?: () => void;
  onOpenTvmaze?: () => void;
  onOpenReiDosCanais?: () => void;
  onOpenTuner?: () => void;
  onOpenRemote?: () => void;
  onOpenCorsProxy?: () => void;
  onOpenMediaIngestion?: () => void;
  onOpenGlobalProposal?: () => void;
  onOpenOrbePay?: () => void;
  onLogout?: () => void;
  currentDeviceMode?: DeviceFormFactor;
  onSelectDeviceMode?: (mode: DeviceFormFactor) => void;
  currentTier: SubscriptionTier;
  currentUser?: UserProfile;
  onOpenAuth: () => void;
  activeView?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenApp,
  onOpenDownload,
  onOpenPayment,
  onOpenArchitecture,
  onOpenCreatorHub,
  onOpenBusinessCenter,
  onOpenPartnerNetwork,
  onOpenAIEngine,
  onOpenOriginals,
  onOpenWallet,
  onOpenFinanceCenter,
  onOpenOttBlueprint,
  onOpenWireframes,
  onOpenMediaEnhancement,
  onOpenBroadcastNetwork,
  onOpenManifesto,
  onOpenIptv,
  onOpenBroadcastAtlas,
  onOpenTmdb,
  onOpenTvmaze,
  onOpenReiDosCanais,
  onOpenTuner,
  onOpenRemote,
  onOpenCorsProxy,
  onOpenMediaIngestion,
  onOpenGlobalProposal,
  onOpenOrbePay,
  onLogout,
  currentDeviceMode = 'desktop',
  onSelectDeviceMode,
  currentTier,
  currentUser,
  onOpenAuth,
  activeView = 'portal',
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDeviceMenuOpen, setIsDeviceMenuOpen] = useState(false);
  const [isAdminToolsOpen, setIsAdminToolsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#050814]/94 border-b border-blue-900/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group shrink-0"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-400 p-[2px] shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#070b1e] rounded-[10px] flex items-center justify-center">
              <Tv className="w-5 h-5 text-blue-400 group-hover:text-cyan-300 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                <span className="text-blue-500">ORBE</span>
              </span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                TV
              </span>
            </div>
            <p className="text-[10px] tracking-widest uppercase text-slate-400 font-medium">
              A nova era da televisão
            </p>
          </div>
        </div>

        {/* Clean, Consumer-Friendly Navigation (Clutter hidden) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <a href="#inicio" className="hover:text-white transition-colors">Início</a>
          
          <button
            onClick={onOpenApp}
            className={`flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer ${
              activeView === 'app' ? 'text-cyan-300 font-bold' : ''
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>Canais Ao Vivo</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-red-600/30 text-red-400 font-bold border border-red-500/30">
              Direto
            </span>
          </button>

          <a href="#destaques" className="hover:text-white transition-colors">O Que Encontra</a>
          <a href="#pacotes" className="hover:text-white transition-colors">Pacotes (MT)</a>

          {onOpenFinanceCenter && (
            <button
              onClick={onOpenFinanceCenter}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>M-Pesa / Finanças</span>
            </button>
          )}

          <button
            onClick={onOpenOriginals}
            className={`flex items-center gap-1 hover:text-white transition-colors cursor-pointer ${
              activeView === 'originals' ? 'text-amber-400 font-bold' : ''
            }`}
          >
            <span>ORBE Originais</span>
          </button>

          {onOpenReiDosCanais && (
            <button
              onClick={onOpenReiDosCanais}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeView === 'reidoscanais'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Rei dos Canais</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/25 text-amber-300 font-bold border border-amber-500/30">
                Jogos Ao Vivo
              </span>
            </button>
          )}

          {onOpenMediaIngestion && (
            <button
              onClick={onOpenMediaIngestion}
              className={`hidden xl:flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all cursor-pointer ${
                activeView === 'media-ingestion'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10'
              }`}
              title="Pilar 1: Robô de Ingestão e Verificação de Streams"
            >
              <span>🤖 Ingestão</span>
            </button>
          )}

          {onOpenGlobalProposal && (
            <button
              onClick={onOpenGlobalProposal}
              className="hidden 2xl:flex items-center gap-1.5 px-2 py-1 rounded-lg text-blue-300 hover:text-white hover:bg-blue-500/10 transition-all cursor-pointer"
              title="Pilar 2: Proposta Comercial de Parcerias Globais (Google & CDNs)"
            >
              <span>🤝 Parcerias Globais</span>
            </button>
          )}

          {onOpenOrbePay && (
            <button
              onClick={onOpenOrbePay}
              className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all cursor-pointer font-bold"
              title="Pilar 3: ORBE Pay Gateway Universal & Webhooks"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>ORBE Pay</span>
            </button>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Smart Device Adaptive Mode Switcher */}
          {onSelectDeviceMode && (
            <div className="relative">
              <button
                onClick={() => setIsDeviceMenuOpen(!isDeviceMenuOpen)}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-700/80 text-cyan-300 hover:text-white hover:border-cyan-500/50 transition-all cursor-pointer shadow-sm"
                title="Trocar Adaptação de Dispositivo (Telemóvel, PC, Tablet, Smart TV)"
              >
                {currentDeviceMode === 'mobile' && <Smartphone className="w-3.5 h-3.5 text-cyan-400" />}
                {currentDeviceMode === 'tablet' && <Tablet className="w-3.5 h-3.5 text-cyan-400" />}
                {currentDeviceMode === 'desktop' && <Monitor className="w-3.5 h-3.5 text-cyan-400" />}
                {currentDeviceMode === 'tv' && <Tv className="w-3.5 h-3.5 text-cyan-400" />}
                <span className="capitalize">{currentDeviceMode === 'tv' ? 'Smart TV' : currentDeviceMode}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isDeviceMenuOpen && (
                <div className="absolute right-0 top-12 z-50 w-48 rounded-2xl bg-[#090e24] border border-blue-500/40 p-2 shadow-2xl text-xs text-left animate-fade-in">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">
                    Adaptação de Ecrã:
                  </div>
                  {[
                    { id: 'mobile' as DeviceFormFactor, label: '📱 Telemóvel (Mobile)', desc: 'Menu inferior de polegar' },
                    { id: 'tablet' as DeviceFormFactor, label: '📱 Tablet / iPad', desc: 'Grelha equilibrada' },
                    { id: 'desktop' as DeviceFormFactor, label: '💻 Computador / PC', desc: 'Atalhos de teclado e ecrã largo' },
                    { id: 'tv' as DeviceFormFactor, label: '📺 Smart TV (10 Pés)', desc: 'Cartões grandes e comando' }
                  ].map((modeItem) => (
                    <button
                      key={modeItem.id}
                      onClick={() => {
                        onSelectDeviceMode(modeItem.id);
                        setIsDeviceMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                        currentDeviceMode === modeItem.id
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div>{modeItem.label}</div>
                        <div className="text-[9px] opacity-70">{modeItem.desc}</div>
                      </div>
                      {currentDeviceMode === modeItem.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Multi-Source Tuner Button */}
          {onOpenTuner && (
            <button
              onClick={onOpenTuner}
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold bg-purple-950/70 border border-purple-500/50 text-purple-200 hover:bg-purple-900/70 transition-all cursor-pointer shadow-sm"
              title="Sintonizar Novos Canais (OMDb • TVmaze • TMDb)"
            >
              <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>Sintonizador</span>
            </button>
          )}

          {/* Virtual TV Remote Button */}
          {onOpenRemote && (
            <button
              onClick={onOpenRemote}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold bg-blue-950/60 border border-blue-500/40 text-cyan-300 hover:bg-blue-900/60 transition-all cursor-pointer shadow-sm"
              title="Abrir Comando Remoto da TV"
            >
              <Tv className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Comando TV</span>
            </button>
          )}

          {/* Watch Now Button */}
          <button
            onClick={onOpenApp}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 transition-all active:scale-95 cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Assistir TV</span>
          </button>

          {/* Pay TV with ID Button */}
          <button
            onClick={() => onOpenPayment(currentUser?.subscription.tier === 'free' ? 'basic' : currentUser?.subscription.tier)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-600/20 border border-blue-500/40 text-cyan-300 hover:bg-blue-600/30 transition-all shadow-sm cursor-pointer"
            title="Pagar Assinatura de TV com ID"
          >
            <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pagar TV</span>
          </button>

          {/* User Account / ID Pill with Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-blue-500/40 hover:border-cyan-400 text-slate-200 transition-all cursor-pointer shadow-sm group"
              title={`Assinante: ${currentUser?.name || 'Conta ORBE'} (ID: ${currentUser?.id || 'Entrar com ID'})`}
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1.5px] shrink-0">
                <div className="w-full h-full bg-[#0a0f26] rounded-[6px] flex items-center justify-center text-[10px] font-black text-cyan-300">
                  UB
                </div>
              </div>
              <div className="text-left hidden md:block">
                <div className="text-[11px] font-mono font-black text-cyan-300 leading-tight">
                  {currentUser?.id ? currentUser.id : 'Entrar com ID'}
                </div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                  {currentUser?.subscription.tier === 'free' ? '🟢 Livre (0 MT)' : `⭐ ${currentUser?.subscription.tier?.toUpperCase()}`}
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-white" />
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl bg-[#080d22] border border-blue-500/40 p-3 shadow-2xl shadow-blue-950/80 text-xs text-left animate-fade-in backdrop-blur-xl">
                
                {/* User Info Header */}
                <div className="pb-3 border-b border-slate-800">
                  <div className="font-bold text-white text-sm truncate">{currentUser?.name || 'Assinante ORBE'}</div>
                  <div className="text-[11px] font-mono text-cyan-300 mt-0.5">{currentUser?.id}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{currentUser?.phone}</div>
                </div>

                {/* Primary User Actions */}
                <div className="py-2 space-y-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-xl text-slate-200 hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4 text-cyan-400" />
                    <span>Meu Cartão & ID Digital</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenWallet();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-xl text-slate-200 hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Wallet className="w-4 h-4 text-emerald-400" />
                    <span>Carteira ORBE (Saldo MT)</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenDownload();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-xl text-slate-200 hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4 text-blue-400" />
                    <span>Baixar Aplicativo Android/iOS</span>
                  </button>
                </div>

                {/* Technical & Admin Tools (Neatly Hidden for Normal Users) */}
                <div className="pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => setIsAdminToolsOpen(!isAdminToolsOpen)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-cyan-300 flex items-center justify-between transition-colors text-[11px] font-bold cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-slate-400" />
                      <span>Ferramentas Técnicas & Admin</span>
                    </div>
                    <ChevronDown className={`w-3 h-3 transition-transform ${isAdminToolsOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isAdminToolsOpen && (
                    <div className="mt-1 pl-2 space-y-1 text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                      {onOpenOttBlueprint && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenOttBlueprint();
                          }}
                          className="w-full text-left py-1 hover:text-cyan-300 transition-colors cursor-pointer"
                        >
                          📐 Blueprint de Engenharia OTT
                        </button>
                      )}
                      {onOpenWireframes && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenWireframes();
                          }}
                          className="w-full text-left py-1 hover:text-emerald-300 transition-colors cursor-pointer"
                        >
                          📱 Wireframes & Telas UI/UX
                        </button>
                      )}
                      {onOpenCreatorHub && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenCreatorHub();
                          }}
                          className="w-full text-left py-1 hover:text-blue-300 transition-colors cursor-pointer"
                        >
                          🎥 Creator Hub & Grelha 24/7
                        </button>
                      )}
                      {onOpenBusinessCenter && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenBusinessCenter();
                          }}
                          className="w-full text-left py-1 hover:text-cyan-300 transition-colors cursor-pointer"
                        >
                          💼 Business & Publicidade (Fase 3)
                        </button>
                      )}
                      {onOpenIptv && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenIptv();
                          }}
                          className="w-full text-left py-1 hover:text-cyan-300 transition-colors cursor-pointer"
                        >
                          📡 IPTV Global (iptv-org Hub)
                        </button>
                      )}
                      {onOpenTmdb && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenTmdb();
                          }}
                          className="w-full text-left py-1 hover:text-blue-300 transition-colors cursor-pointer"
                        >
                          🎬 TMDb API Favoritos
                        </button>
                      )}
                      {onOpenTvmaze && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenTvmaze();
                          }}
                          className="w-full text-left py-1 hover:text-teal-300 transition-colors cursor-pointer"
                        >
                          📺 TVmaze Web Channels
                        </button>
                      )}
                      {onOpenReiDosCanais && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenReiDosCanais();
                          }}
                          className="w-full text-left py-1 hover:text-amber-300 transition-colors cursor-pointer text-amber-400 font-semibold flex items-center justify-between"
                        >
                          <span>👑 Rei dos Canais (Jogos & Futebol)</span>
                          <span className="text-[9px] bg-red-600/40 text-red-300 px-1 rounded">Ao Vivo</span>
                        </button>
                      )}
                      {onOpenTuner && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenTuner();
                          }}
                          className="w-full text-left py-1 hover:text-purple-300 transition-colors cursor-pointer text-purple-300 font-semibold flex items-center justify-between"
                        >
                          <span>📡 Sintonizador (OMDb • TVmaze • TMDb)</span>
                          <span className="text-[9px] bg-purple-600/40 text-purple-200 px-1 rounded">Novo</span>
                        </button>
                      )}
                      {onOpenCorsProxy && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenCorsProxy();
                          }}
                          className="w-full text-left py-1 hover:text-cyan-300 transition-colors cursor-pointer text-cyan-300 font-semibold flex items-center justify-between"
                        >
                          <span>🛡️ Monitor CORS Proxy & Stream Relayer</span>
                          <span className="text-[9px] bg-cyan-600/40 text-cyan-200 px-1 rounded">CORS 0%</span>
                        </button>
                      )}
                      {onOpenMediaIngestion && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenMediaIngestion();
                          }}
                          className="w-full text-left py-1 hover:text-cyan-300 transition-colors cursor-pointer text-cyan-400 font-bold flex items-center justify-between"
                        >
                          <span>🤖 Pilar 1: Ingestion Engine & Scraper</span>
                          <span className="text-[9px] bg-cyan-600/40 text-cyan-200 px-1 rounded">Robô</span>
                        </button>
                      )}
                      {onOpenGlobalProposal && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenGlobalProposal();
                          }}
                          className="w-full text-left py-1 hover:text-blue-300 transition-colors cursor-pointer text-blue-300 font-semibold flex items-center justify-between"
                        >
                          <span>🤝 Pilar 2: Proposta Parcerias Globais</span>
                          <span className="text-[9px] bg-blue-600/40 text-blue-200 px-1 rounded">Google/CDN</span>
                        </button>
                      )}
                      {onOpenOrbePay && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenOrbePay();
                          }}
                          className="w-full text-left py-1 hover:text-emerald-300 transition-colors cursor-pointer text-emerald-400 font-bold flex items-center justify-between"
                        >
                          <span>💳 Pilar 3: ORBE Pay Gateway & Webhooks</span>
                          <span className="text-[9px] bg-emerald-600/40 text-emerald-200 px-1 rounded">Pagamentos</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Logout Button */}
                {onLogout && (
                  <div className="pt-2 mt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-xl text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors font-bold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      <span>Terminar Sessão / Trocar Conta</span>
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
