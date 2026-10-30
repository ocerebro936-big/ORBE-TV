import React from 'react';
import { Tv, Smartphone, Shield, Heart, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onOpenApp: () => void;
  onOpenDownload: () => void;
  onOpenArchitecture: () => void;
  onOpenOttBlueprint?: () => void;
  onOpenWireframes?: () => void;
  onOpenCreatorHub?: () => void;
  onOpenBusinessCenter?: () => void;
  onOpenPartnerNetwork?: () => void;
  onOpenAIEngine?: () => void;
  onOpenOriginals?: () => void;
  onOpenWallet?: () => void;
  onOpenFinanceCenter?: () => void;
  onOpenMediaEnhancement?: () => void;
  onOpenBroadcastNetwork?: () => void;
  onOpenManifesto?: () => void;
  onOpenIptv?: () => void;
  onOpenBroadcastAtlas?: () => void;
  onOpenTmdb?: () => void;
  onOpenTvmaze?: () => void;
  onOpenReiDosCanais?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenApp,
  onOpenDownload,
  onOpenArchitecture,
  onOpenOttBlueprint,
  onOpenWireframes,
  onOpenCreatorHub,
  onOpenBusinessCenter,
  onOpenPartnerNetwork,
  onOpenAIEngine,
  onOpenOriginals,
  onOpenWallet,
  onOpenFinanceCenter,
  onOpenMediaEnhancement,
  onOpenBroadcastNetwork,
  onOpenManifesto,
  onOpenIptv,
  onOpenBroadcastAtlas,
  onOpenTmdb,
  onOpenTvmaze,
  onOpenReiDosCanais,
}) => {
  return (
    <footer className="bg-[#030612] border-t border-slate-900 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                <Tv className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                U<span className="text-blue-500">Blue</span> TV
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              O ecossistema oficial de streaming do Universo Blue. Projetado para levar o melhor da televisão, música e desporto a todos os moçambicanos de forma leve, acessível e inovadora.
            </p>
            <p className="text-[11px] text-cyan-400 font-semibold">
              "O seu canal favorito, em qualquer lugar, a qualquer momento."
            </p>
            <div className="pt-2 text-xs text-slate-500 space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span>Maputo · Moçambique</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                <span>universeblue20@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-500" />
                <span>Suporte 24h: +258 84 000 0000</span>
              </div>
            </div>
          </div>

          {/* FASE 2 Ecosystem Hubs */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Ecossistema FASE 2</h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={onOpenCreatorHub} className="hover:text-blue-400 transition-colors text-left flex items-center gap-1.5">
                  <span>🎥 Creator Hub</span>
                </button>
              </li>
              {onOpenBroadcastNetwork && (
                <li>
                  <button onClick={onOpenBroadcastNetwork} className="hover:text-cyan-400 transition-colors text-left flex items-center gap-1.5">
                    <span>🌐 Open Broadcast Network</span>
                  </button>
                </li>
              )}
              {onOpenIptv && (
                <li>
                  <button onClick={onOpenIptv} className="hover:text-cyan-300 transition-colors text-left flex items-center gap-1.5 font-semibold text-cyan-400">
                    <span>📡 IPTV Global (iptv-org)</span>
                  </button>
                </li>
              )}
              {onOpenBroadcastAtlas && (
                <li>
                  <button onClick={onOpenBroadcastAtlas} className="hover:text-cyan-300 transition-colors text-left flex items-center gap-1.5 font-semibold text-blue-400">
                    <span>🧭 Broadcast Atlas (Live Tuner)</span>
                  </button>
                </li>
              )}
              {onOpenTmdb && (
                <li>
                  <button onClick={onOpenTmdb} className="hover:text-blue-300 transition-colors text-left flex items-center gap-1.5 font-semibold text-blue-400">
                    <span>🎬 TMDb Favoritos (api.themoviedb.org)</span>
                  </button>
                </li>
              )}
              {onOpenTvmaze && (
                <li>
                  <button onClick={onOpenTvmaze} className="hover:text-teal-300 transition-colors text-left flex items-center gap-1.5 font-semibold text-teal-400">
                    <span>📡 TVmaze Web Channels (tvmaze.com)</span>
                  </button>
                </li>
              )}
              {onOpenReiDosCanais && (
                <li>
                  <button onClick={onOpenReiDosCanais} className="hover:text-amber-300 transition-colors text-left flex items-center gap-1.5 font-bold text-amber-400">
                    <span>👑 Rei dos Canais (Futebol & Jogos Ao Vivo)</span>
                  </button>
                </li>
              )}
              {onOpenMediaEnhancement && (
                <li>
                  <button onClick={onOpenMediaEnhancement} className="hover:text-blue-300 transition-colors text-left flex items-center gap-1.5">
                    <span>✨ Media Enhancement (Vision/LUTs)</span>
                  </button>
                </li>
              )}
              {onOpenManifesto && (
                <li>
                  <button onClick={onOpenManifesto} className="hover:text-purple-300 transition-colors text-left flex items-center gap-1.5">
                    <span>📜 Manifesto UBlue TV</span>
                  </button>
                </li>
              )}
              <li>
                <button onClick={onOpenBusinessCenter} className="hover:text-cyan-400 transition-colors text-left flex items-center gap-1.5">
                  <span>💼 Business Center</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenPartnerNetwork} className="hover:text-emerald-400 transition-colors text-left flex items-center gap-1.5">
                  <span>🌍 Partner Network</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenOriginals} className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5">
                  <span>⭐ UBlue Originals</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenAIEngine} className="hover:text-cyan-300 transition-colors text-left flex items-center gap-1.5">
                  <span>🤖 UBlue AI Engine</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenWallet} className="hover:text-emerald-300 transition-colors text-left flex items-center gap-1.5">
                  <span>💳 UBlue Wallet (M-Pesa)</span>
                </button>
              </li>
              {onOpenFinanceCenter && (
                <li>
                  <button onClick={onOpenFinanceCenter} className="hover:text-emerald-300 transition-colors text-left flex items-center gap-1.5 font-bold text-emerald-400">
                    <span>⚡ Centro Financeiro & M-Pesa (Fase 2)</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Pacotes */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Planos UBlue</h4>
            <ul className="space-y-2.5">
              <li><span className="hover:text-white">🆓 Canais Livres (0 MT)</span></li>
              <li><span className="hover:text-white">🟢 UBlue Start (25 MT)</span></li>
              <li><span className="hover:text-white">🔵 UBlue Basic (100 MT)</span></li>
              <li><span className="hover:text-white">🟣 UBlue Médio (250 MT)</span></li>
              <li><span className="hover:text-white">👑 UBlue Max (500 MT)</span></li>
            </ul>
          </div>

          {/* Parceiros de Talento */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Parceiros & Apps</h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={onOpenOriginals} className="hover:text-blue-400 transition-colors text-left">
                  Be Universe Agency (Talentos)
                </button>
              </li>
              <li>
                <button onClick={onOpenDownload} className="hover:text-blue-400 transition-colors text-left">
                  Download Android APK
                </button>
              </li>
              <li>
                <button onClick={onOpenDownload} className="hover:text-blue-400 transition-colors text-left">
                  Instalar no iPhone (PWA)
                </button>
              </li>
              <li>
                <button onClick={onOpenOttBlueprint || onOpenArchitecture} className="hover:text-cyan-300 transition-colors text-left flex items-center gap-1 text-cyan-400 font-semibold">
                  <span>Engenharia OTT v1.0</span>
                  <span className="text-[10px] px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Spec</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenWireframes} className="hover:text-emerald-300 transition-colors text-left flex items-center gap-1 text-emerald-400 font-semibold">
                  <span>Wireframes UI/UX</span>
                  <span className="text-[10px] px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Telas</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenArchitecture} className="hover:text-blue-400 transition-colors text-left flex items-center gap-1">
                  <span>UBlue Content Engine</span>
                  <span className="text-[10px] px-1 py-0.5 rounded bg-blue-500/20 text-blue-400">Core</span>
                </button>
              </li>
              <li><span className="text-slate-500">M-Pesa & E-Mola Integrados</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-300">
          <div>
            © {new Date().getFullYear()} UBlue TV · Universo Blue. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Termos de Serviço</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacidade</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Licenças de Conteúdo</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
