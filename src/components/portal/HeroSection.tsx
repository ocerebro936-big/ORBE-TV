import React from 'react';
import { Play, Smartphone, Apple, CheckCircle2, ShieldCheck, Zap, Radio, Users, Cpu, FileText, Layers, Globe, Wand2, Compass, Trophy } from 'lucide-react';

interface HeroSectionProps {
  onOpenApp: () => void;
  onOpenDownload: (os?: 'android' | 'ios') => void;
  onViewPackages: () => void;
  onOpenOttBlueprint?: () => void;
  onOpenWireframes?: () => void;
  onOpenMediaEnhancement?: () => void;
  onOpenBroadcastNetwork?: () => void;
  onOpenIptv?: () => void;
  onOpenBroadcastAtlas?: () => void;
  onOpenReiDosCanais?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenApp,
  onOpenDownload,
  onViewPackages,
  onOpenOttBlueprint,
  onOpenWireframes,
  onOpenMediaEnhancement,
  onOpenBroadcastNetwork,
  onOpenIptv,
  onOpenBroadcastAtlas,
  onOpenReiDosCanais,
}) => {
  return (
    <section id="inicio" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background Ambient Glow & Starfields */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-blue-600/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />
      
      {/* Subtle Grid lines */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Live Indicator Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-6 shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="tracking-wide">TRANSMISSÃO AO VIVO</span>
          <span className="text-slate-500">·</span>
          <span className="flex items-center gap-1 text-slate-300">
            <Users className="w-3 h-3 text-cyan-400" />
            12.482 assistindo agora
          </span>
        </div>

        {/* The Exact Brand Statement Requested */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-2 font-sans">
          ORBE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-300">TV</span>
        </h1>
        
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-wider text-slate-200 uppercase mb-3">
          A NOVA ERA DA TELEVISÃO
        </h2>

        <p className="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-cyan-300 mb-2 tracking-wide font-sans">
          "O seu canal favorito, em qualquer lugar, a qualquer momento."
        </p>

        <p className="text-xs sm:text-sm font-medium text-slate-400 mb-8 max-w-xl mx-auto">
          Streaming ao vivo · Creator Hub · Business Center · Partner Network · ORBE AI Engine
        </p>

        {/* Main CTA Hero Action: ASSISTIR AGORA */}
        <div className="max-w-md mx-auto mb-8">
          <button
            onClick={onOpenApp}
            className="w-full py-4 sm:py-5 px-8 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-lg sm:text-xl tracking-wider uppercase shadow-2xl shadow-blue-600/50 hover:shadow-cyan-500/50 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 border border-blue-400/30 flex items-center justify-center gap-3.5 group cursor-pointer"
          >
            <span className="w-3.5 h-3.5 rounded-full bg-red-500 animate-pulse shadow-sm shadow-red-400"></span>
            <span>ASSISTIR AGORA</span>
            <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
          </button>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Acesso instantâneo via navegador no PC, celular ou Smart TV
          </p>
        </div>

        {/* Secondary Primary Action: BAIXAR APP */}
        <div className="pt-4 pb-6">
          <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-200 uppercase tracking-widest mb-4">
            <Smartphone className="w-4 h-4 text-blue-400" />
            <span>BAIXAR APP UBLUE TV</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => onOpenDownload('android')}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 hover:border-blue-500/60 shadow-lg shadow-black/40 transition-all active:scale-95 group text-left cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Baixar APK / Play</span>
                <span className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">Android</span>
              </div>
            </button>

            <button
              onClick={() => onOpenDownload('ios')}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 hover:border-blue-500/60 shadow-lg shadow-black/40 transition-all active:scale-95 group text-left cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 group-hover:scale-110 transition-transform">
                <Apple className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">PWA / TestFlight</span>
                <span className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors">iPhone</span>
              </div>
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            {onOpenReiDosCanais && (
              <button
                onClick={onOpenReiDosCanais}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-950/80 to-amber-900/60 hover:from-amber-900 hover:to-amber-800/80 border border-amber-500/60 text-amber-200 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-amber-950/50 group"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform animate-pulse" />
                <span>Rei dos Canais (Futebol & Esportes)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-600 text-white font-black animate-pulse">JOGOS HOJE</span>
              </button>
            )}

            {onOpenIptv && (
              <button
                onClick={onOpenIptv}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-400/50 text-cyan-200 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-cyan-950/50 group"
              >
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>IPTV Global Hub (iptv-org)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">80k+ Stars</span>
              </button>
            )}

            {onOpenBroadcastAtlas && (
              <button
                onClick={onOpenBroadcastAtlas}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 border border-cyan-500/50 text-cyan-200 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-blue-950/50 group"
              >
                <Compass className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-45 transition-transform" />
                <span>Broadcast Atlas (Live Tuner & Mapa)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/25 text-cyan-300 font-bold">Ao Vivo</span>
              </button>
            )}

            {onOpenBroadcastNetwork && (
              <button
                onClick={onOpenBroadcastNetwork}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm group"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
                <span>Open Broadcast Network</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">10 Perfis</span>
              </button>
            )}

            {onOpenMediaEnhancement && (
              <button
                onClick={onOpenMediaEnhancement}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-950/50 hover:bg-blue-900/70 border border-blue-500/40 text-blue-200 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm group"
              >
                <Wand2 className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>Media Enhancement Engine (10 LUTs + Vision AI)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-cyan-300 font-bold">Audio EBU</span>
              </button>
            )}

            {onOpenWireframes && (
              <button
                onClick={onOpenWireframes}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm group"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Wireframes UI/UX (Tela por Tela)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">18 Telas</span>
              </button>
            )}
          </div>
        </div>

        {/* Feature Highlights bar */}
        <div className="pt-8 border-t border-slate-800/80 mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
            <Zap className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Modo Sem Megas</div>
              <div className="text-[11px] text-slate-400">Taxa zero após pagar pacote</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
            <Radio className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">A partir de 25 MT</div>
              <div className="text-[11px] text-slate-400">M-Pesa e E-Mola na hora</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">100% Autorizado</div>
              <div className="text-[11px] text-slate-400">APIs e parceiros legais</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
            <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Multi-dispositivo</div>
              <div className="text-[11px] text-slate-400">Telemóvel, PC e TV</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
