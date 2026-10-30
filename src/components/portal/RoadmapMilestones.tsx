import React from 'react';
import { Target, Users, Globe2, Tv, TrendingUp, CheckCircle2, Sparkles, Award } from 'lucide-react';

export const RoadmapMilestones: React.FC = () => {
  const milestones = [
    {
      year: 'Ano 1',
      title: 'Consolidação Nacional & Moçambique',
      usersGoal: '50.000 utilizadores',
      partnersGoal: '100 parceiros credenciados',
      channelsGoal: '20 canais integrados ao vivo',
      highlight: 'Lançamento do Creator Hub e pagamentos via M-Pesa & E-Mola',
      status: 'Em Execução Acelerada',
      accent: 'border-blue-500/40 bg-gradient-to-b from-blue-950/60 to-slate-900',
      tagColor: 'text-blue-400 bg-blue-950 border-blue-500/30'
    },
    {
      year: 'Ano 2',
      title: 'Expansão Regional na África Austral',
      usersGoal: '250.000 utilizadores',
      partnersGoal: '500 parceiros comerciais e mídia',
      channelsGoal: 'Presença em Angola, África do Sul e Zimbábue',
      highlight: 'ORBE Originals internacionais com Be Universe Agency e CDN regional',
      status: 'Próxima Fase',
      accent: 'border-purple-500/40 bg-gradient-to-b from-purple-950/60 to-slate-900',
      tagColor: 'text-purple-400 bg-purple-950 border-purple-500/30'
    },
    {
      year: 'Ano 3',
      title: 'Liderança Absoluta no Streaming Lusófono',
      usersGoal: '1.000.000 de utilizadores',
      partnersGoal: 'Maior ecossistema de criadores de Moçambique',
      channelsGoal: '100+ canais de TV, rádios e eventos esportivos',
      highlight: 'Plataforma líder incontestável de distribuição de conteúdo',
      status: 'Visão de Longo Prazo',
      accent: 'border-amber-500/40 bg-gradient-to-b from-amber-950/60 to-slate-900',
      tagColor: 'text-amber-400 bg-amber-950 border-amber-500/30'
    }
  ];

  return (
    <section className="py-20 bg-[#050814] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Official Slogan Statement */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30">
            <Target className="w-3.5 h-3.5" />
            <span>Visão Estratégica & Roadmap</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Metas de Crescimento da Plataforma
          </h2>

          <div className="p-6 rounded-3xl bg-slate-900/90 border border-blue-500/30 max-w-2xl mx-auto shadow-2xl mt-4">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest block mb-1">
              Slogan Oficial
            </span>
            <div className="text-xl sm:text-2xl font-black text-white font-sans">
              🔵 ORBE TV — A NOVA ERA DA TELEVISÃO
            </div>
            <p className="text-base sm:text-lg text-blue-300 font-medium italic mt-2">
              "O seu canal favorito, em qualquer lugar, a qualquer momento."
            </p>
          </div>
        </div>

        {/* Milestones Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className={`p-7 rounded-3xl border flex flex-col justify-between shadow-xl transition-all duration-300 hover:-translate-y-1 ${m.accent}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-white">{m.year}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${m.tagColor}`}>
                    {m.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-4">{m.title}</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <Users className="w-4 h-4 text-blue-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Meta de Utilizadores</span>
                      <span className="font-extrabold text-white text-sm">{m.usersGoal}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <Globe2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Meta de Parceiros</span>
                      <span className="font-extrabold text-white text-sm">{m.partnersGoal}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <Tv className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Alcance & Canais</span>
                      <span className="font-extrabold text-white text-sm">{m.channelsGoal}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-300 font-medium flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{m.highlight}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
