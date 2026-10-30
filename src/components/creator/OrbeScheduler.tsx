import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Radio, Play, ChevronRight, Bell, Sparkles, 
  Tv, Film, Music, BookOpen, AlertCircle, CheckCircle2, User, Eye, Sliders
} from 'lucide-react';
import { UBLUE_DAILY_SCHEDULE, ScheduleItem } from '../../data/enhancement-data';
import { soundEffects } from '../../services/sound-effects';

interface OrbeSchedulerProps {
  onNotifyProgram?: (program: ScheduleItem) => void;
}

export const OrbeScheduler: React.FC<OrbeSchedulerProps> = ({ onNotifyProgram }) => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(UBLUE_DAILY_SCHEDULE);
  const [selectedProgram, setSelectedProgram] = useState<ScheduleItem>(
    UBLUE_DAILY_SCHEDULE.find(p => p.isLiveNow) || UBLUE_DAILY_SCHEDULE[0]
  );
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isSlotRequestModalOpen, setIsSlotRequestModalOpen] = useState(false);
  const [reminderSetIds, setReminderSetIds] = useState<string[]>([]);
  const [liveProgress, setLiveProgress] = useState(52);

  // Progressive timer for live show
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveProgress(prev => (prev >= 100 ? 5 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleReminder = (prog: ScheduleItem) => {
    if (reminderSetIds.includes(prog.id)) {
      setReminderSetIds(reminderSetIds.filter(id => id !== prog.id));
    } else {
      setReminderSetIds([...reminderSetIds, prog.id]);
      soundEffects.play('notification');
      if (onNotifyProgram) {
        onNotifyProgram(prog);
      }
    }
  };

  const currentLive = schedule.find(p => p.isLiveNow) || schedule[4];

  const filteredSchedule = filterCategory === 'all'
    ? schedule
    : schedule.filter(p => p.category.toLowerCase().includes(filterCategory.toLowerCase()));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                UBlue Scheduler Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                Emissão Linear 24/7
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Grelha Oficial de Programação UBlue TV
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Estrutura automatizada de exibição contínua que combina produções locais, 
              conteúdos de criadores independentes e eventos ao vivo com transições perfeitas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsSlotRequestModalOpen(true);
                soundEffects.play('notification');
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Solicitar Slot de Exibição na Grelha</span>
            </button>
          </div>
        </div>
      </div>

      {/* LIVE NOW BAR (Destaque em Tempo Real) */}
      <div className="bg-slate-900 border-2 border-cyan-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative aspect-video w-full sm:w-56 rounded-xl overflow-hidden shrink-0 border border-slate-700">
              <img 
                src={currentLive.thumbnail} 
                alt={currentLive.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                AO VIVO AGORA
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-cyan-400 text-[10px] font-mono">
                {currentLive.timeSlot} – {currentLive.timeEnd}
              </div>
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-cyan-300 border border-cyan-500/30">
                  {currentLive.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">Classificação: {currentLive.ratingAge}</span>
                <span className="text-xs text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                  LUT: {currentLive.lutProfileApplied}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">{currentLive.title}</h3>
              <p className="text-xs text-slate-300 line-clamp-2">{currentLive.synopsis}</p>
              
              {/* Progress bar */}
              <div className="pt-2">
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Progresso do Programa:</span>
                  <span className="text-cyan-400 font-mono font-bold">{liveProgress}% concluído</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500" 
                    style={{ width: `${liveProgress}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6 space-y-3">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              A Seguir às 18:00:
            </span>
            <div>
              <p className="text-sm font-bold text-white">UBlue Originals: Be Universe Talent Show</p>
              <p className="text-xs text-slate-400">Emissão Especial ao Vivo com novos talentos de Maputo e Beira.</p>
            </div>
            <button
              onClick={() => handleToggleReminder(schedule[5])}
              className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                reminderSetIds.includes(schedule[5].id)
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{reminderSetIds.includes(schedule[5].id) ? 'Lembrete Ativado (Aviso 10m)' : 'Ativar Lembrete de Transmissão'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 24-HOUR INTERACTIVE TIMELINE GRID */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Grade de Programação 24 Horas
            </h3>
            <p className="text-xs text-slate-400">Clique em qualquer programa para ver sinopse, LUT e ativar avisos</p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {['all', 'notícias', 'documentário', 'música', 'filme', 'originals'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'Todos os Blocos' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-3">
          {filteredSchedule.map((item) => {
            const isReminderSet = reminderSetIds.includes(item.id);
            const isSelected = selectedProgram.id === item.id;

            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedProgram(item);
                  soundEffects.play('new_message');
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  item.isLiveNow
                    ? 'bg-blue-950/40 border-cyan-400/50 shadow-md'
                    : isSelected
                    ? 'bg-slate-800/80 border-slate-700'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start sm:items-center gap-4">
                  {/* Time Badge */}
                  <div className="flex flex-col items-center justify-center w-18 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-center shrink-0">
                    <span className="text-sm font-extrabold text-white font-mono">{item.timeSlot}</span>
                    <span className="text-[10px] text-slate-400 font-mono">até {item.timeEnd}</span>
                  </div>

                  {/* Thumbnail */}
                  <img 
                    src={item.thumbnail} 
                    alt={item.title} 
                    className="w-20 aspect-video object-cover rounded-lg hidden sm:block shrink-0 border border-slate-700"
                  />

                  {/* Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {item.isLiveNow && (
                        <span className="px-1.5 py-0.5 rounded bg-rose-500 text-white text-[9px] font-extrabold uppercase animate-pulse">
                          AO VIVO
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-cyan-300 border border-slate-700">
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Classificação: {item.ratingAge}</span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-1">{item.synopsis}</p>
                    <span className="text-[11px] text-slate-500 block">
                      Responsável: {item.presenterOrCreator} • Perfil de Cor: <span className="text-purple-400">{item.lutProfileApplied}</span>
                    </span>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-2 shrink-0 justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleReminder(item);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isReminderSet
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>{isReminderSet ? 'Aviso Ativo' : 'Lembrar-me'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slot Request Modal */}
      {isSlotRequestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-scaleUp">
            <h3 className="text-lg font-bold text-white mb-2">Solicitar Horário de Exibição na Grelha 24/7</h3>
            <p className="text-xs text-slate-400 mb-4">
              Selecione o melhor dia e horário para seu programa entrar na programação da UBlue TV.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-white block mb-1">Título da Obra ou Programa</label>
                <input 
                  type="text" 
                  placeholder="Ex: Minha Série / Podcast Gravado" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white block mb-1">Horário Pretendido</label>
                  <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white">
                    <option>09:00 – Bloco Manhã</option>
                    <option>14:00 – Sessão Tarde</option>
                    <option>18:00 – Horário Nobre</option>
                    <option>22:00 – Bloco Noturno</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white block mb-1">Dia da Semana</label>
                  <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white">
                    <option>Segunda-feira</option>
                    <option>Quarta-feira</option>
                    <option>Sexta-feira</option>
                    <option>Sábado Nobre</option>
                    <option>Domingo Família</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button 
                onClick={() => setIsSlotRequestModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  setIsSlotRequestModalOpen(false);
                  soundEffects.play('payment_success');
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg"
              >
                Confirmar Solicitação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
