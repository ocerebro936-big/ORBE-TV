import React from 'react';
import { 
  Tv, Play, Search, Cast, User, Download, Radio, Film, Star, 
  RotateCw, Volume2, ShieldCheck, Heart, Share2, Sparkles, 
  ChevronRight, HardDrive, Wifi, Smartphone, CheckCircle2, Music
} from 'lucide-react';

interface MobileScreenProps {
  screenId: string;
  isSchematicMode: boolean;
}

export const MobileScreens: React.FC<MobileScreenProps> = ({ screenId, isSchematicMode }) => {
  // Screen 1: MOB-01 Home Feed Mobile
  if (screenId === 'mob-home') {
    return (
      <div className={`w-full max-w-[340px] mx-auto rounded-[32px] overflow-hidden border-[6px] border-slate-800 bg-[#050814] text-slate-100 font-sans shadow-2xl relative flex flex-col min-h-[580px]`}>
        {/* Mobile Notch Bar */}
        <div className="bg-[#050814] px-6 py-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>09:41</span>
          <div className="w-16 h-3.5 bg-slate-900 rounded-full mx-auto"></div>
          <div className="flex items-center gap-1">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Mobile App Bar */}
        <header className="px-4 py-2.5 flex items-center justify-between border-b border-slate-900 bg-[#060a1e]">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center font-bold text-white text-[10px]">
              UB
            </div>
            <span className="font-extrabold text-xs">UBlue TV</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Cast className="w-3.5 h-3.5" />
            <Search className="w-3.5 h-3.5" />
            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">
              <User className="w-3 h-3" />
            </div>
          </div>
        </header>

        {/* Scrollable Feed */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3.5 scrollbar-none">
          {isSchematicMode && (
            <div className="text-[9px] font-mono text-blue-300 bg-blue-950/80 p-1.5 rounded border border-blue-500/30">
              [MOB-01: HERO_16:9 + HORIZONTAL_RAILS]
            </div>
          )}

          {/* Hero Banner Card */}
          <div className="rounded-xl overflow-hidden bg-gradient-to-t from-blue-950 via-slate-900 to-slate-950 border border-slate-800 p-3 relative space-y-2">
            <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[9px] font-bold">
              AO VIVO AGORA
            </span>
            <h3 className="font-extrabold text-xs text-white leading-tight">
              Canal 01 UBlue: Jornal da Noite
            </h3>
            <p className="text-[10px] text-slate-300 line-clamp-2">
              Cobertura completa dos acontecimentos em Moçambique e no mundo.
            </p>
            <button className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer">
              <Play className="w-3 h-3 fill-current" />
              <span>Assistir Ao Vivo</span>
            </button>
          </div>

          {/* Live Channels Rail */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white text-[11px]">🔴 Canais Ao Vivo</span>
              <span className="text-[10px] text-blue-400">Ver mais</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { name: 'UBlue TV', res: '1080p' },
                { name: 'Be Universe', res: '720p' },
                { name: 'Rádio Moçambique', res: 'Áudio' },
              ].map((c, idx) => (
                <div key={idx} className="shrink-0 w-24 p-2 rounded-lg bg-slate-900 border border-slate-800 space-y-1 text-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600/30 text-blue-400 mx-auto flex items-center justify-center text-xs font-bold">
                    <Tv className="w-4 h-4" />
                  </div>
                  <p className="font-bold text-white text-[10px] truncate">{c.name}</p>
                  <span className="text-[8px] font-mono text-emerald-400">● {c.res}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top 10 Rail */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white text-[11px]">🇲🇿 Top 10 em Moçambique</span>
              <span className="text-[10px] text-blue-400">Ver tudo</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {['1. Estrelas de Maputo', '2. Ritmos do Índico', '3. O Resgate'].map((title, idx) => (
                <div key={idx} className="shrink-0 w-24 h-32 rounded-lg bg-slate-800 border border-slate-700 p-1.5 flex flex-col justify-end relative overflow-hidden">
                  <span className="absolute top-1 left-1 text-lg font-black text-blue-400/60 font-mono">#{idx + 1}</span>
                  <p className="text-[9px] font-bold text-white leading-tight drop-shadow">{title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation (5 Tabs) */}
        <div className="bg-[#040612] border-t border-slate-900 px-3 py-2 flex items-center justify-between text-[10px] font-semibold text-slate-400">
          <div className="flex flex-col items-center gap-0.5 text-blue-400">
            <Tv className="w-4 h-4" />
            <span>Início</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 hover:text-white cursor-pointer">
            <Play className="w-4 h-4" />
            <span>TV Direto</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 hover:text-white cursor-pointer">
            <Film className="w-4 h-4" />
            <span>Filmes</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 hover:text-white cursor-pointer">
            <Radio className="w-4 h-4" />
            <span>Rádios</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 hover:text-white cursor-pointer">
            <User className="w-4 h-4" />
            <span>Perfil</span>
          </div>
        </div>
      </div>
    );
  }

  // Screen 2: MOB-02 TV Ao Vivo & Mini-Player
  if (screenId === 'mob-live-tv') {
    return (
      <div className={`w-full max-w-[340px] mx-auto rounded-[32px] overflow-hidden border-[6px] border-slate-800 bg-[#030612] text-slate-100 font-sans shadow-2xl relative flex flex-col min-h-[580px]`}>
        {/* Notch */}
        <div className="bg-black px-6 py-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>09:41</span>
          <div className="w-16 h-3.5 bg-slate-900 rounded-full mx-auto"></div>
          <span>1080p</span>
        </div>

        {/* Sticky Video Player */}
        <div className="bg-black aspect-video relative flex flex-col justify-between p-2.5">
          <div className="flex items-center justify-between text-[9px] text-white">
            <span className="px-1.5 py-0.5 rounded bg-red-600 font-bold">EM DIRETO</span>
            <RotateCw className="w-3.5 h-3.5 text-slate-300" />
          </div>
          <div className="self-center w-9 h-9 rounded-full bg-blue-600/90 text-white flex items-center justify-center">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
          <div className="flex items-center justify-between text-[9px] text-slate-300">
            <span>UBlue TV Oficial</span>
            <span>Buffer: 4s</span>
          </div>
        </div>

        {/* Channel Info & Channels List Below */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-none">
          {isSchematicMode && (
            <div className="text-[9px] font-mono text-cyan-300 bg-cyan-950/80 p-1.5 rounded border border-cyan-500/30">
              [MOB-02: STICKY_PLAYER + VERTICAL_CHANNELS]
            </div>
          )}

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <h4 className="font-bold text-white text-xs">Jornal da Noite UBlue</h4>
            <p className="text-[10px] text-slate-400">Emissão ao vivo de Maputo • 19:30 - 20:30</p>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-white text-[11px] uppercase tracking-wider text-slate-400">
              Outros Canais Disponíveis
            </span>
            {[
              { num: '02', name: 'Be Universe Live', show: 'Talent Show Moçambique' },
              { num: '03', name: 'TV Moçambique News', show: 'Edição Especial das Províncias' },
              { num: '04', name: 'Super FM Maputo', show: 'Sessão Acústica Ao Vivo' },
            ].map((c, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-blue-900/60 text-blue-400 font-bold text-[10px] flex items-center justify-center">
                    {c.num}
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs">{c.name}</p>
                    <p className="text-[10px] text-slate-400">{c.show}</p>
                  </div>
                </div>
                <button className="text-blue-400 text-[11px] font-bold">Mudar</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Screen 3: MOB-03 VOD Details & Offline Download
  if (screenId === 'mob-vod-details') {
    return (
      <div className={`w-full max-w-[340px] mx-auto rounded-[32px] overflow-hidden border-[6px] border-slate-800 bg-[#050814] text-slate-100 font-sans shadow-2xl relative flex flex-col min-h-[580px]`}>
        {/* Notch */}
        <div className="bg-[#050814] px-6 py-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>09:41</span>
          <div className="w-16 h-3.5 bg-slate-900 rounded-full mx-auto"></div>
          <span>98%</span>
        </div>

        {/* Hero Backdrop */}
        <div className="h-44 bg-gradient-to-t from-[#050814] via-blue-950/60 to-slate-900 relative p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-white">
            <span className="font-bold">← Voltar</span>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-mono text-[9px] font-bold">
              UBLUE ORIGINAL
            </span>
            <h2 className="text-base font-black text-white">Be Universe: Estrelas de Maputo</h2>
          </div>
        </div>

        {/* Content Details & Download Button */}
        <div className="flex-1 p-3 space-y-3 overflow-y-auto scrollbar-none text-xs">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">+12</span>
            <span>2026</span>
            <span>1 Temporada</span>
            <span className="text-cyan-400 font-bold">4K UHD</span>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Reproduzir T1:E1</span>
            </button>
            <button className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer">
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Baixar</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            O maior reality show de descoberta de novos talentos musicais e performáticos de Moçambique, produzido em parceria com a Be Universe Agency.
          </p>

          <div className="space-y-1.5 pt-2">
            <span className="font-bold text-white text-[11px]">Episódios (Temporada 1)</span>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px]">
              <div>
                <p className="font-bold text-white">1. As Audições de Maputo</p>
                <p className="text-[9px] text-slate-400">48 min • Baixado no aparelho (240 MB)</p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Screen 4: MOB-04 Áudio & Rádios
  if (screenId === 'mob-audio-podcasts') {
    return (
      <div className={`w-full max-w-[340px] mx-auto rounded-[32px] overflow-hidden border-[6px] border-slate-800 bg-[#040714] text-slate-100 font-sans shadow-2xl relative flex flex-col min-h-[580px]`}>
        {/* Notch */}
        <div className="bg-[#040714] px-6 py-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>09:41</span>
          <div className="w-16 h-3.5 bg-slate-900 rounded-full mx-auto"></div>
          <span>Áudio</span>
        </div>

        <header className="px-4 py-2 border-b border-slate-900">
          <h3 className="font-bold text-xs text-white">Rádios Moçambique & Podcasts</h3>
        </header>

        <div className="flex-1 p-3 space-y-3 overflow-y-auto scrollbar-none">
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Estações FM Ao Vivo</span>
            {[
              { name: 'Rádio Moçambique (Nacional)', freq: '97.9 FM', city: 'Maputo' },
              { name: 'Super FM', freq: '101.9 FM', city: 'Maputo' },
              { name: 'Rádio Pax', freq: '103.0 FM', city: 'Beira' },
            ].map((r, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs">{r.name}</p>
                    <p className="text-[10px] text-slate-400">{r.freq} • {r.city}</p>
                  </div>
                </div>
                <button className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Mini Audio Player */}
        <div className="bg-[#060a1e] border-t border-slate-800 p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-[11px]">Rádio Moçambique FM</p>
              <p className="text-[9px] text-emerald-400 font-mono">AO VIVO • 64 kbps AAC</p>
            </div>
          </div>
          <button className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center">
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          </button>
        </div>
      </div>
    );
  }

  // Screen 5: MOB-05 Perfil & 1-Tap M-Pesa
  return (
    <div className={`w-full max-w-[340px] mx-auto rounded-[32px] overflow-hidden border-[6px] border-slate-800 bg-[#050814] text-slate-100 font-sans shadow-2xl relative flex flex-col min-h-[580px]`}>
      {/* Notch */}
      <div className="bg-[#050814] px-6 py-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>09:41</span>
        <div className="w-16 h-3.5 bg-slate-900 rounded-full mx-auto"></div>
        <span>Conta</span>
      </div>

      <div className="flex-1 p-3 space-y-3.5 overflow-y-auto scrollbar-none text-xs">
        {/* Profile Card */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-950 to-slate-900 border border-blue-500/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
            UB
          </div>
          <div>
            <h4 className="font-bold text-white text-xs">Alberto Matsinhe</h4>
            <p className="text-[10px] text-slate-400 font-mono">+258 84 391 8204</p>
          </div>
        </div>

        {/* 1-Tap M-Pesa Quick Renew */}
        <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-red-300 font-bold">PLANO BASIC (100 MT)</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Ativo</span>
          </div>
          <p className="text-[11px] text-white">Expira em 24 de Outubro de 2026</p>
          <button className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer">
            <span>Renovar com 1-Toque via M-Pesa</span>
          </button>
        </div>

        {/* Storage Bar */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-300 flex items-center gap-1"><HardDrive className="w-3.5 h-3.5 text-cyan-400" /> Memória Usada:</span>
            <span className="font-mono text-cyan-400">1.2 GB de 64 GB</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 w-[18%]"></div>
          </div>
          <p className="text-[9px] text-slate-400">3 episódios baixados para visualização offline.</p>
        </div>
      </div>
    </div>
  );
};
