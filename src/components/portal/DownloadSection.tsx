import React, { useState } from 'react';
import { Smartphone, Apple, Download, QrCode, CheckCircle, Wifi, Battery, HardDrive, ShieldCheck } from 'lucide-react';

interface DownloadSectionProps {
  onOpenDownloadModal: (os?: 'android' | 'ios') => void;
  onOpenWebApp: () => void;
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({
  onOpenDownloadModal,
  onOpenWebApp,
}) => {
  return (
    <section id="download" className="py-20 bg-gradient-to-b from-[#050814] via-[#090e24] to-[#050814] relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 lg:p-16 bg-gradient-to-r from-blue-950/80 via-slate-900 to-slate-950 border border-blue-500/30 shadow-2xl shadow-blue-950/50 relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Big Pitch */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/20">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Aplicativo Nativo e Otimizado</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
                BAIXE O <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">UBLUE TV</span> E ENTRE NO UNIVERSO BLUE
              </h2>

              <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
                Leve todos os seus canais favoritos no bolso. O aplicativo oficial foi projetado especificamente para as redes móveis moçambicanas, economizando dados e garantindo streaming fluido sem travamentos.
              </p>

              {/* The 4-step user journey from user prompt */}
              <div className="mb-8 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Como funciona em 4 passos simples:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                    <span className="block text-blue-400 font-extrabold text-sm mb-0.5">1. Descobrir</span>
                    <span className="text-[11px] text-slate-400">Conheça os canais</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                    <span className="block text-emerald-400 font-extrabold text-sm mb-0.5">2. Escolher</span>
                    <span className="text-[11px] text-slate-400">A partir de 25 MT</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                    <span className="block text-cyan-400 font-extrabold text-sm mb-0.5">3. Baixar</span>
                    <span className="text-[11px] text-slate-400">Instalação leve</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                    <span className="block text-purple-400 font-extrabold text-sm mb-0.5">4. Entrar</span>
                    <span className="text-[11px] text-slate-400">Assistir na hora</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onOpenDownloadModal('android')}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-600/30 flex items-center gap-3 group cursor-pointer"
                >
                  <Smartphone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <span className="block text-[10px] uppercase font-semibold text-blue-100">Disponível Agora</span>
                    <span>Baixar para Android (.APK)</span>
                  </div>
                </button>

                <button
                  onClick={() => onOpenDownloadModal('ios')}
                  className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm tracking-wide border border-slate-700 hover:border-slate-600 flex items-center gap-3 group cursor-pointer"
                >
                  <Apple className="w-5 h-5 group-hover:scale-110 transition-transform text-slate-300" />
                  <div className="text-left">
                    <span className="block text-[10px] uppercase font-semibold text-slate-400">iPhone & iPad</span>
                    <span>Versão iOS / PWA</span>
                  </div>
                </button>

                <button
                  onClick={onOpenWebApp}
                  className="px-4 py-3.5 rounded-xl text-slate-300 hover:text-white font-semibold text-xs tracking-wide border border-transparent hover:border-slate-700 transition-colors"
                >
                  Abrir no Navegador (Web) →
                </button>
              </div>

            </div>

            {/* Right Column: Phone Visual Mockup & Spec Box */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-sm rounded-3xl p-6 bg-slate-900/90 border border-blue-500/20 shadow-xl">
                
                {/* Tech Highlights */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-white">UBlue TV App v1.4.2</span>
                  </div>
                  <span className="text-xs font-mono text-cyan-400">18.4 MB</span>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <HardDrive className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Download ultra leve (apenas 18.4 megabytes)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Wifi className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Funciona mesmo com sinal 3G ou rede oscilante</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Battery className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Baixo consumo de bateria com aceleração gráfica</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Instalação 100% segura e livre de anúncios invasivos</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-8 h-8 text-blue-400" />
                    <div className="text-[11px] text-slate-400">
                      <span className="text-white font-semibold block">Escanear QR Code</span>
                      No celular para instalar
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenDownloadModal('android')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-semibold hover:bg-blue-600/30 transition-colors"
                  >
                    Ver QR Code
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
