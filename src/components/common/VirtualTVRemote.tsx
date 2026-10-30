import React, { useState } from 'react';
import {
  Tv,
  Power,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Home,
  Menu,
  Radio,
  X,
  Sparkles,
  Maximize2
} from 'lucide-react';

interface VirtualTVRemoteProps {
  isOpen: boolean;
  onClose: () => void;
  onNextChannel?: () => void;
  onPrevChannel?: () => void;
  onSelectChannelNumber?: (channelNum: number) => void;
  onTogglePlay?: () => void;
  onToggleMute?: () => void;
  onToggleFullscreen?: () => void;
  onGoHome?: () => void;
  onOpenGuide?: () => void;
  currentChannelNumber?: number;
  currentChannelName?: string;
}

export const VirtualTVRemote: React.FC<VirtualTVRemoteProps> = ({
  isOpen,
  onClose,
  onNextChannel,
  onPrevChannel,
  onSelectChannelNumber,
  onTogglePlay,
  onToggleMute,
  onToggleFullscreen,
  onGoHome,
  onOpenGuide,
  currentChannelNumber,
  currentChannelName
}) => {
  const [typedDigits, setTypedDigits] = useState('');

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    const newDigits = (typedDigits + digit).slice(-2);
    setTypedDigits(newDigits);
    const num = parseInt(newDigits, 10);
    if (!isNaN(num) && onSelectChannelNumber) {
      onSelectChannelNumber(num);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in select-none">
      <div className="relative w-64 rounded-[32px] bg-gradient-to-b from-[#141b33] via-[#0b1024] to-[#060918] border-2 border-blue-500/40 p-4 shadow-2xl shadow-blue-950/90 text-center backdrop-blur-xl">
        
        {/* Top Header / TV Brand */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            <Tv className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-black tracking-wider text-white">UBlue TV Remote</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Fechar Comando"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Channel Indicator Screen */}
        <div className="my-3 p-2.5 rounded-2xl bg-black/70 border border-cyan-500/30 text-center font-mono">
          <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>CANAL ATUAL</span>
          </div>
          <div className="text-lg font-black text-white mt-0.5">
            CH #{currentChannelNumber || 1}
          </div>
          <div className="text-[10px] text-slate-300 truncate max-w-[200px] mx-auto">
            {currentChannelName || 'UBlue TV Oficial'}
          </div>
          {typedDigits && (
            <div className="text-[10px] text-yellow-300 font-bold mt-1">
              Digitando: {typedDigits}...
            </div>
          )}
        </div>

        {/* Power & Quick Action Row */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <button
            onClick={onTogglePlay}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex flex-col items-center justify-center transition-all cursor-pointer"
            title="Play / Pausa"
          >
            <Power className="w-3.5 h-3.5 text-red-400" />
            <span className="text-[9px] font-bold mt-0.5">Play</span>
          </button>
          <button
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex flex-col items-center justify-center transition-all cursor-pointer"
            title="Mudo"
          >
            <VolumeX className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[9px] font-bold mt-0.5">Mute</span>
          </button>
          <button
            onClick={onGoHome}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex flex-col items-center justify-center transition-all cursor-pointer"
            title="Home"
          >
            <Home className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[9px] font-bold mt-0.5">Home</span>
          </button>
          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex flex-col items-center justify-center transition-all cursor-pointer"
            title="Ecrã Inteiro"
          >
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[9px] font-bold mt-0.5">Ecrã</span>
          </button>
        </div>

        {/* Directional D-Pad (Navigation) */}
        <div className="relative w-36 h-36 mx-auto my-3 rounded-full bg-slate-900 border border-blue-500/30 flex items-center justify-center shadow-inner">
          {/* UP: Canal Anterior */}
          <button
            onClick={onPrevChannel}
            className="absolute top-1 left-1/2 -translate-x-1/2 p-2 text-slate-300 hover:text-white active:scale-95 transition-transform cursor-pointer"
            title="Canal Anterior (CH-)"
          >
            <ChevronUp className="w-5 h-5 text-cyan-300" />
          </button>

          {/* DOWN: Próximo Canal */}
          <button
            onClick={onNextChannel}
            className="absolute bottom-1 left-1/2 -translate-x-1/2 p-2 text-slate-300 hover:text-white active:scale-95 transition-transform cursor-pointer"
            title="Próximo Canal (CH+)"
          >
            <ChevronDown className="w-5 h-5 text-cyan-300" />
          </button>

          {/* LEFT */}
          <button
            onClick={onPrevChannel}
            className="absolute left-1 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-white active:scale-95 transition-transform cursor-pointer"
            title="Voltar"
          >
            <ChevronLeft className="w-5 h-5 text-slate-400" />
          </button>

          {/* RIGHT */}
          <button
            onClick={onNextChannel}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-white active:scale-95 transition-transform cursor-pointer"
            title="Avançar"
          >
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>

          {/* CENTER OK BUTTON */}
          <button
            onClick={onTogglePlay}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs shadow-lg shadow-blue-600/50 flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
            title="OK / Confirmar"
          >
            OK
          </button>
        </div>

        {/* Channel Up / Down Rockers */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={onPrevChannel}
            className="py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
          >
            <ChevronUp className="w-4 h-4" />
            <span>CH -</span>
          </button>
          <button
            onClick={onNextChannel}
            className="py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
          >
            <ChevronDown className="w-4 h-4" />
            <span>CH +</span>
          </button>
        </div>

        {/* Numeric Keypad for direct channel tuning */}
        <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-800">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleDigit(String(num))}
              className="py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs active:bg-blue-600 transition-colors cursor-pointer"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => setTypedDigits('')}
            className="py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 text-[10px] active:bg-red-600 transition-colors cursor-pointer"
          >
            CLR
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs active:bg-blue-600 transition-colors cursor-pointer"
          >
            0
          </button>
          {onOpenGuide ? (
            <button
              onClick={onOpenGuide}
              className="py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 font-bold text-[10px] active:bg-cyan-600 transition-colors cursor-pointer"
            >
              EPG
            </button>
          ) : (
            <div className="py-1.5" />
          )}
        </div>

      </div>
    </div>
  );
};
