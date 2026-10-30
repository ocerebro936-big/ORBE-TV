import React, { useState } from 'react';
import { Radio, Play, Pause, Volume2, VolumeX, Wifi, Users, Music, Disc3, Sparkles } from 'lucide-react';
import { LiveRadioStation } from '../../types/live-network';
import { MOCK_RADIO_STATIONS } from '../../data/live-network-data';

export const LiveRadioHub: React.FC = () => {
  const [stations] = useState<LiveRadioStation[]>(MOCK_RADIO_STATIONS);
  const [activeStation, setActiveStation] = useState<LiveRadioStation>(MOCK_RADIO_STATIONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);

  const togglePlay = (st: LiveRadioStation) => {
    if (activeStation.id === st.id) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveStation(st);
      setIsPlaying(true);
    }
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
            <Radio className="w-3.5 h-3.5" />
            <span>Rádio Integrada & Áudio IP</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Emissoras Nacionais FM & Streams Icecast/Shoutcast
          </h2>
          <p className="text-xs text-slate-400">
            Transmissões em áudio ultra-leve de 64 a 128 kbps. Gasta o mínimo de megas e funciona perfeitamente até no 2G/3G.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
          <Wifi className="w-3.5 h-3.5" />
          <span>Codec AAC-LC / MP3 Otimizado</span>
        </div>
      </div>

      {/* Main Active Radio Player Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-950 border border-amber-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-black shrink-0 border border-amber-500/40 shadow-xl">
            <img src={activeStation.logo} alt={activeStation.name} className="w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
              <Disc3 className={`w-10 h-10 text-amber-400 ${isPlaying ? 'animate-spin' : ''}`} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-black">
                {activeStation.frequency}
              </span>
              <span className="text-xs font-mono text-slate-400">{activeStation.city}</span>
              <span className="text-xs text-slate-600">·</span>
              <span className="text-xs font-mono text-cyan-400">{activeStation.format} {activeStation.bitrateKbps}kbps</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">{activeStation.name}</h3>
            <p className="text-xs sm:text-sm text-amber-300 font-semibold mt-1">
              No Ar: {activeStation.currentTrack}
            </p>
            <span className="text-xs text-slate-400 font-medium mt-0.5 block">
              Com: {activeStation.currentHost}
            </span>
          </div>
        </div>

        {/* Player Controls & Visualizer */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shadow-lg shadow-amber-500/30 transition-transform active:scale-95 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          <div className="text-right">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5 justify-end">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>{activeStation.listenersCount.toLocaleString('pt-PT')} ouvintes agora</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1">
              Consumo de Dados: ~28 MB / hora
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Stations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stations.map((st) => (
          <div
            key={st.id}
            onClick={() => togglePlay(st)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              activeStation.id === st.id && isPlaying
                ? 'bg-amber-950/40 border-amber-500/60 shadow-lg'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-start gap-3 mb-3">
                <img src={st.logo} alt={st.name} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500 text-black">
                      {st.frequency}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono truncate">{st.city}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{st.name}</h4>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-950/60 text-[11px] text-slate-300 mb-3">
                <span className="text-slate-500 text-[10px] block">Tocando Agora:</span>
                <span className="font-semibold line-clamp-1">{st.currentTrack}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400 font-mono">{st.format} {st.bitrateKbps}k</span>
              <span className="text-amber-400 font-bold flex items-center gap-1">
                {activeStation.id === st.id && isPlaying ? 'No Ar' : 'Ouvir Rádio'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
