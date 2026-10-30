import React, { useState } from 'react';
import { Calendar, Clock, Tv, Play, CheckCircle2, Film, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { PlayoutScheduleItem } from '../../types/live-network';
import { MOCK_PLAYOUT_SCHEDULE } from '../../data/live-network-data';

export const PlayoutScheduleManager: React.FC = () => {
  const [schedule, setSchedule] = useState<PlayoutScheduleItem[]>(MOCK_PLAYOUT_SCHEDULE);
  const [filterCategory, setFilterCategory] = useState<string>('Todas');

  const categories = ['Todas', 'Notícias', 'Música', 'ORBE Originals', 'Desporto', 'Be Universe Show', 'Academy'];

  const filtered = filterCategory === 'Todas'
    ? schedule
    : schedule.filter(s => s.category === filterCategory);

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Automação de Playout 24/7</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Grade de Programação Contínua (CAT / UTC+2)
          </h2>
          <p className="text-xs text-slate-400">
            Controle de playout ininterrupto com troca automática de blocos, vinhetas e inserção de publicidade.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          <Clock className="w-3.5 h-3.5" />
          <span>Fuso Horário: Maputo (África Austral)</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              filterCategory === cat ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Playout List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              item.status === 'no-ar'
                ? 'bg-blue-950/50 border-blue-500/60 shadow-xl shadow-blue-950/40 ring-1 ring-blue-500/40'
                : item.status === 'concluido'
                ? 'bg-slate-950/40 border-slate-900 opacity-60'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-black shrink-0">
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[9px] text-white">
                  {item.durationMinutes}m
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-black text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {item.timeSlot}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {item.category}
                  </span>
                  {item.hasAdBreak && (
                    <span className="text-[9px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30">
                      VAST Ad Break
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-white line-clamp-1">{item.title}</h3>
                <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                  Fonte: {item.streamSource.toUpperCase()} · Bitrate: 4.8 Mbps HLS
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-end text-xs shrink-0">
              {item.status === 'no-ar' ? (
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                  <span className="font-bold text-red-400 uppercase tracking-wider">Transmitindo Agora</span>
                </div>
              ) : item.status === 'concluido' ? (
                <span className="text-slate-500 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Exibido
                </span>
              ) : (
                <span className="text-cyan-400 font-semibold font-mono">
                  Programado ({item.timeSlot})
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
