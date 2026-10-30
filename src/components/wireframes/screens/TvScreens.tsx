import React from 'react';
import { 
  Tv, Play, Calendar, Film, Search, Settings, Radio, 
  Volume2, Maximize2, SkipForward, Rewind, Sparkles, Star,
  Info, Clock, Check
} from 'lucide-react';

interface TvScreenProps {
  screenId: string;
  isSchematicMode: boolean;
  focusedKey?: string;
}

export const TvScreens: React.FC<TvScreenProps> = ({ screenId, isSchematicMode, focusedKey = 'hero-play' }) => {
  // Screen 1: TV-01 Home 10-Foot
  if (screenId === 'tv-home') {
    return (
      <div className={`w-full rounded-2xl overflow-hidden border-[8px] border-slate-900 bg-[#02040c] text-slate-100 font-sans shadow-2xl relative flex min-h-[460px]`}>
        {/* 10-Foot Left Navigation Sidebar */}
        <div className="w-16 bg-[#040717] border-r border-slate-800/80 p-3 flex flex-col items-center justify-between">
          <div className="space-y-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-extrabold text-white text-xs">
              UB
            </div>
            <div className="space-y-4 text-slate-400">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/50">
                <Tv className="w-5 h-5" />
              </div>
              <div className="p-2 hover:text-white cursor-pointer">
                <Film className="w-5 h-5" />
              </div>
              <div className="p-2 hover:text-white cursor-pointer">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="p-2 hover:text-white cursor-pointer">
                <Search className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="p-2 hover:text-white cursor-pointer text-slate-400">
            <Settings className="w-5 h-5" />
          </div>
        </div>

        {/* 10-Foot Main TV Stage */}
        <div className="flex-1 p-6 flex flex-col justify-between relative bg-gradient-to-r from-blue-950/70 via-slate-950 to-slate-950">
          {isSchematicMode && (
            <div className="absolute top-3 right-4 text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-500/30">
              [TV-01: 10-FOOT_CINEMA_STAGE] D-Pad Active Focus Ring: #00E5FF • Safe Margin 5%
            </div>
          )}

          {/* Spotlight Billboard */}
          <div className="max-w-2xl space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded bg-red-600 text-white font-mono font-bold text-xs">
                ● EM DIRETO NA TV
              </span>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                4K HDR • 60 FPS
              </span>
            </div>
            <h1 className="text-3xl font-black text-white leading-tight">
              UBlue TV: O Seu Canal Favorito
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              Transmissão contínua em ultra alta definição. Notícias ao minuto, os maiores eventos culturais de Moçambique e reality shows Be Universe Originals.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <button className="px-6 py-3 rounded-xl bg-cyan-400 text-black font-extrabold text-xs flex items-center gap-2 ring-4 ring-cyan-400/50 shadow-xl shadow-cyan-500/30 scale-105 transition-all">
                <Play className="w-4 h-4 fill-current" />
                <span>[OK] Assistir Canal Ao Vivo</span>
              </button>
              <button className="px-5 py-3 rounded-xl bg-slate-900 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Guia da Programação</span>
              </button>
            </div>
          </div>

          {/* Bottom Horizontal Rail */}
          <div className="space-y-2 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-white text-xs uppercase tracking-wider">Canais em Destaque na TV</span>
              <span className="text-[10px] text-slate-400 font-mono">Navegue com as setas [◄] [►]</span>
            </div>
            <div className="flex items-center gap-3 overflow-x-hidden">
              {[
                { ch: '01', name: 'UBlue TV News', show: 'Jornal da Noite' },
                { ch: '02', name: 'Be Universe Live', show: 'Talent Show Moçambique' },
                { ch: '03', name: 'Cinema Moçambique', show: 'O Resgate (2026)' },
                { ch: '04', name: 'Super Rádio TV', show: 'Top Acústico' },
              ].map((c, idx) => (
                <div 
                  key={idx} 
                  className={`w-44 p-3 rounded-xl border flex flex-col justify-between ${
                    idx === 0 
                      ? 'bg-blue-950/80 border-cyan-400 ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/30' 
                      : 'bg-slate-900/80 border-slate-800 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-400 font-bold text-xs">CH {c.ch}</span>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  </div>
                  <div className="pt-2">
                    <p className="font-bold text-white text-xs truncate">{c.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{c.show}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Screen 2: TV-02 EPG Guide 10-Foot
  if (screenId === 'tv-epg-guide') {
    return (
      <div className={`w-full rounded-2xl overflow-hidden border-[8px] border-slate-900 bg-[#040714] text-slate-100 font-sans shadow-2xl p-6 space-y-4 min-h-[460px]`}>
        {isSchematicMode && (
          <div className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 p-2 rounded border border-cyan-500/30 flex items-center justify-between">
            <span>[TV-02: 10-FOOT_EPG_GRID] Synchronous Matrix • Channel Column (Fix) + Timeline Blocks</span>
            <span>REMOTE ARROWS [▲] [▼] [◄] [►]</span>
          </div>
        )}

        {/* Focused Program Detailed Header */}
        <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-mono text-xs font-bold">CH 01</span>
              <h3 className="font-bold text-base text-white">Jornal da Noite UBlue (19:30 - 20:30)</h3>
            </div>
            <span className="text-xs font-mono text-cyan-400">Pressione [OK] para Sintonizar</span>
          </div>
          <p className="text-xs text-slate-300">
            Acompanhe o sumário completo das principais reportagens e entrevistas de Moçambique, África Austral e do mundo.
          </p>
        </div>

        {/* EPG Grid */}
        <div className="space-y-2">
          {/* Time Header */}
          <div className="grid grid-cols-5 gap-2 text-xs font-mono text-slate-400 pl-32">
            <span>19:00</span>
            <span>19:30</span>
            <span>20:00</span>
            <span>20:30</span>
            <span>21:00</span>
          </div>

          {/* Row 1 */}
          <div className="flex items-center gap-2">
            <div className="w-28 p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-white shrink-0">
              01 UBlue TV
            </div>
            <div className="flex-1 grid grid-cols-4 gap-2 text-xs">
              <div className="col-span-2 p-2.5 rounded-lg bg-cyan-950/80 border-2 border-cyan-400 font-bold text-white ring-2 ring-cyan-400/40">
                19:30 Jornal da Noite (NO AR)
              </div>
              <div className="col-span-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
                20:30 Be Universe Show
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex items-center gap-2">
            <div className="w-28 p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-white shrink-0">
              02 Be Universe
            </div>
            <div className="flex-1 grid grid-cols-4 gap-2 text-xs">
              <div className="col-span-1 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
                19:00 Talentos
              </div>
              <div className="col-span-3 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
                19:45 Reality Show: Grande Final Maputo
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Screen 3: TV-03 Cinema Player Mode
  if (screenId === 'tv-cinema-player') {
    return (
      <div className={`w-full rounded-2xl overflow-hidden border-[8px] border-slate-900 bg-black text-slate-100 font-sans shadow-2xl relative flex flex-col justify-between p-6 min-h-[460px]`}>
        {/* Top Info */}
        <div className="flex items-center justify-between text-xs text-white drop-shadow">
          <div className="flex items-center gap-3 bg-black/60 px-3 py-1.5 rounded-xl backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="font-bold text-sm">Canal 01: UBlue TV 4K</span>
          </div>
          <div className="bg-black/60 px-3 py-1.5 rounded-xl text-xs font-mono text-cyan-300">
            AUDIO: 5.1 DOLBY • 4K HDR10
          </div>
        </div>

        {/* Center Playing Watermark */}
        <div className="self-center text-center space-y-2 opacity-30">
          <Tv className="w-16 h-16 mx-auto text-blue-400" />
          <p className="text-xs font-mono tracking-widest uppercase">Transmissão Cinematográfica 10-Foot</p>
        </div>

        {/* Bottom OSD Remote Controls */}
        <div className="bg-gradient-to-t from-black via-black/90 to-transparent p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
            <span className="text-cyan-400 font-bold">19:54:10</span>
            <span>Jornal da Noite Moçambique • Bloco de Desporto</span>
            <span className="text-red-400 font-bold">AO VIVO</span>
          </div>

          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400 w-[78%]"></div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-4">
              <span className="px-2.5 py-1 rounded-lg bg-cyan-400 text-black font-extrabold flex items-center gap-1.5 ring-2 ring-cyan-400/50">
                [OK] Pausar
              </span>
              <span>[◄ / ►] Recuar / Avançar</span>
              <span>[▲] Legendas & Áudio</span>
              <span>[▼] Trocar de Canal</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs">
              <span>CH+ / CH- Muda Canal</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Screen 4: TV-04 Hub de Canais
  return (
    <div className={`w-full rounded-2xl overflow-hidden border-[8px] border-slate-900 bg-[#040714] text-slate-100 font-sans shadow-2xl p-6 space-y-5 min-h-[460px]`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Hub de Canais & Redes Parceiras UBlue TV</h2>
          <p className="text-xs text-slate-400">Navegue pelas emissoras abertas e canais premium de Moçambique</p>
        </div>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-500/30">
          Total: 18 Canais
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { ch: '01', name: 'UBlue TV Principal', category: 'Notícias & Geral', res: '4K HDR' },
          { ch: '02', name: 'Be Universe Live', category: 'Talent & Reality', res: '1080p' },
          { ch: '03', name: 'Moçambique Cinema', category: 'Filmes Nacionais', res: '1080p' },
          { ch: '04', name: 'UBlue Desporto', category: 'Futebol Moçambola', res: '4K 60fps' },
        ].map((c, idx) => (
          <div 
            key={idx} 
            className={`p-4 rounded-xl border flex flex-col justify-between aspect-video ${
              idx === 0 
                ? 'bg-blue-950 border-cyan-400 ring-4 ring-cyan-400/40 shadow-xl shadow-cyan-500/30' 
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-cyan-400 font-bold text-xs">CH {c.ch}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-emerald-400">{c.res}</span>
            </div>
            <div>
              <p className="font-extrabold text-white text-sm">{c.name}</p>
              <p className="text-[10px] text-slate-400">{c.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
