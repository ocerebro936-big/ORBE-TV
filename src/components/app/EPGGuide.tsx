import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Tv, Play, Radio } from 'lucide-react';
import { Channel, Program } from '../../types/content';
import { contentEngine } from '../../engine/content-normalizer';

interface EPGGuideProps {
  channels: Channel[];
  selectedChannel: Channel;
  onSelectChannel: (channel: Channel) => void;
}

export const EPGGuide: React.FC<EPGGuideProps> = ({
  channels,
  selectedChannel,
  onSelectChannel,
}) => {
  const [schedule, setSchedule] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    contentEngine.getScheduleForChannel(selectedChannel.id).then((programs) => {
      if (isMounted) {
        setSchedule(programs);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedChannel]);

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Guia Eletrónico de Programação (EPG)
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">Fuso: Maputo (CAT / UTC+2)</span>
      </div>

      {/* Channel selector horizontal pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {channels.map((ch) => (
          <button
            key={ch.id}
            onClick={() => onSelectChannel(ch)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              selectedChannel.id === ch.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span className="w-4 h-4 rounded bg-slate-950 text-[10px] font-black flex items-center justify-center">
              {ch.number}
            </span>
            <span>{ch.name}</span>
          </button>
        ))}
      </div>

      {/* Schedule Timeline */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 space-y-3">
        <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
          <span>Programação para {selectedChannel.name}:</span>
          <span className="text-cyan-400 font-mono">Plugin EPG v3.0.2</span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-500">Carregando programação do canal...</div>
        ) : schedule.length > 0 ? (
          <div className="space-y-2.5">
            {schedule.map((prog) => (
              <div
                key={prog.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  prog.live
                    ? 'bg-blue-950/40 border-blue-500/40 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span className="font-mono text-xs font-bold text-white">
                      {prog.startTime} - {prog.endTime}
                    </span>
                    {prog.live && (
                      <span className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[9px] font-black uppercase">
                        No Ar Agora
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {prog.category}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-100 mb-1">{prog.title}</div>
                <p className="text-[11px] text-slate-400">{prog.description}</p>

                {prog.live && (
                  <div className="mt-2.5">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Progresso da transmissão</span>
                      <span className="font-mono">{prog.progressPercent}%</span>
                    </div>
                    <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                        style={{ width: `${prog.progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-400">
            Programação padrão contínua 24h em alta definição.
          </div>
        )}
      </div>
    </div>
  );
};
