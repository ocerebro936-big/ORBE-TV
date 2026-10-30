import React, { useState } from 'react';
import { 
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, 
  Home, ArrowLeft, Volume2, VolumeX, Play, Pause, Power,
  Tv, Radio, Settings
} from 'lucide-react';

interface TvRemoteControlProps {
  onDpadPress: (direction: 'up' | 'down' | 'left' | 'right' | 'ok' | 'back' | 'home') => void;
}

export const TvRemoteControl: React.FC<TvRemoteControlProps> = ({ onDpadPress }) => {
  const [lastAction, setLastAction] = useState<string>('Pronto para navegar');

  const handlePress = (direction: 'up' | 'down' | 'left' | 'right' | 'ok' | 'back' | 'home', label: string) => {
    setLastAction(`Tecla: ${label}`);
    onDpadPress(direction);
    setTimeout(() => {
      // keep last action
    }, 1500);
  };

  return (
    <div className="w-56 bg-gradient-to-b from-slate-900 to-slate-950 p-4 rounded-3xl border-2 border-slate-700 shadow-2xl flex flex-col items-center gap-4 text-slate-300 font-sans select-none">
      {/* Remote Brand & Power */}
      <div className="w-full flex items-center justify-between px-1">
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-extrabold tracking-wider text-slate-400">UBLUE REMOTE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        </div>
        <button 
          onClick={() => setLastAction('TV Power Ligada')} 
          className="w-7 h-7 rounded-full bg-red-950 border border-red-500/40 text-red-400 flex items-center justify-center hover:bg-red-900 cursor-pointer active:scale-95"
          title="Ligar/Desligar TV"
        >
          <Power className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Screen feedback status */}
      <div className="w-full py-1 px-2 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-cyan-400 text-center truncate">
        {lastAction}
      </div>

      {/* D-Pad Nav Circular Controller */}
      <div className="relative w-36 h-36 rounded-full bg-slate-800 border-4 border-slate-700 shadow-inner flex items-center justify-center">
        {/* UP */}
        <button 
          onClick={() => handlePress('up', 'CIMA [▲]')}
          className="absolute top-1 w-10 h-8 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700/60 rounded-t-xl active:scale-90 cursor-pointer"
        >
          <ChevronUp className="w-5 h-5" />
        </button>

        {/* DOWN */}
        <button 
          onClick={() => handlePress('down', 'BAIXO [▼]')}
          className="absolute bottom-1 w-10 h-8 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700/60 rounded-b-xl active:scale-90 cursor-pointer"
        >
          <ChevronDown className="w-5 h-5" />
        </button>

        {/* LEFT */}
        <button 
          onClick={() => handlePress('left', 'ESQUERDA [◄]')}
          className="absolute left-1 w-8 h-10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700/60 rounded-l-xl active:scale-90 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* RIGHT */}
        <button 
          onClick={() => handlePress('right', 'DIREITA [►]')}
          className="absolute right-1 w-8 h-10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700/60 rounded-r-xl active:scale-90 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* CENTER OK BUTTON */}
        <button 
          onClick={() => handlePress('ok', 'SELECIONAR [OK]')}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/40 flex items-center justify-center active:scale-95 cursor-pointer ring-2 ring-cyan-400/40"
        >
          OK
        </button>
      </div>

      {/* Nav Keys (Back & Home) */}
      <div className="w-full grid grid-cols-2 gap-2">
        <button 
          onClick={() => handlePress('back', 'VOLTAR')}
          className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar</span>
        </button>
        <button 
          onClick={() => handlePress('home', 'INÍCIO')}
          className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
      </div>

      {/* Volume & Channel Rockers */}
      <div className="w-full grid grid-cols-2 gap-2 pt-1">
        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center gap-1 text-[10px]">
          <span className="font-bold text-slate-400">VOL</span>
          <div className="flex gap-2">
            <button onClick={() => setLastAction('Vol +')} className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-bold cursor-pointer">+</button>
            <button onClick={() => setLastAction('Vol -')} className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-bold cursor-pointer">-</button>
          </div>
        </div>
        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center gap-1 text-[10px]">
          <span className="font-bold text-slate-400">CH</span>
          <div className="flex gap-2">
            <button onClick={() => setLastAction('Canal Seguinte CH+')} className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold cursor-pointer">+</button>
            <button onClick={() => setLastAction('Canal Anterior CH-')} className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold cursor-pointer">-</button>
          </div>
        </div>
      </div>

      {/* Quick Color Hotkeys (Red, Green, Yellow, Blue) */}
      <div className="w-full flex items-center justify-between px-1 pt-1">
        <button onClick={() => setLastAction('Tecla Vermelha (Hoje)')} className="w-6 h-3 rounded-full bg-red-600 hover:opacity-80 cursor-pointer" title="Hoje"></button>
        <button onClick={() => setLastAction('Tecla Verde (Amanhã)')} className="w-6 h-3 rounded-full bg-emerald-500 hover:opacity-80 cursor-pointer" title="Amanhã"></button>
        <button onClick={() => setLastAction('Tecla Amarela (Favoritos)')} className="w-6 h-3 rounded-full bg-amber-400 hover:opacity-80 cursor-pointer" title="Favoritos"></button>
        <button onClick={() => setLastAction('Tecla Azul (Pesquisar)')} className="w-6 h-3 rounded-full bg-blue-500 hover:opacity-80 cursor-pointer" title="Pesquisa"></button>
      </div>
    </div>
  );
};
