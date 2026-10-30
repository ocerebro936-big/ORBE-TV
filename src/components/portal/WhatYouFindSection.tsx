import React from 'react';
import { Tv, Film, Music, Newspaper, Trophy, Sparkles, Mic, Baby, Play, ArrowRight } from 'lucide-react';

interface WhatYouFindSectionProps {
  onCategoryClick: (category: string) => void;
}

export const WhatYouFindSection: React.FC<WhatYouFindSectionProps> = ({
  onCategoryClick,
}) => {
  const categories = [
    {
      id: 'live',
      title: 'TV AO VIVO',
      emoji: '🔴',
      icon: Tv,
      desc: 'Transmissões 24 horas por dia em alta definição, canais nacionais moçambicanos e internacionais.',
      accent: 'from-red-500/20 to-transparent border-red-500/30 hover:border-red-500/60',
      tagColor: 'text-red-400 bg-red-950/40',
      sample: 'ORBE Channel HD, TVM, STV, Miramar'
    },
    {
      id: 'tvmaze',
      title: 'TVmaze Web Channels',
      emoji: '📡',
      icon: Tv,
      desc: 'Diretório mundial de streaming (Netflix, Prime, Apple TV+, Pluto TV, Disney+) com grade de episódios ao vivo hoje.',
      accent: 'from-teal-500/20 to-transparent border-teal-500/30 hover:border-teal-500/60',
      tagColor: 'text-teal-400 bg-teal-950/40',
      sample: '24+ Web Networks, /schedule/web'
    },
    {
      id: 'reidoscanais',
      title: 'Rei dos Canais (Jogos & Futebol)',
      emoji: '👑',
      icon: Trophy,
      desc: 'Transmissões esportivas ao vivo, Brasileirão, SporTV, Premiere, CazéTV e grade EPG completa.',
      accent: 'from-amber-500/20 to-transparent border-amber-500/30 hover:border-amber-500/60',
      tagColor: 'text-amber-400 bg-amber-950/40',
      sample: 'Futebol Ao Vivo, Jogos de Hoje, SporTV'
    },
    {
      id: 'movies',
      title: 'Filmes e séries',
      emoji: '🎬',
      icon: Film,
      desc: 'Catálogo selecionado com o melhor do cinema lusófono, grandes sucessos mundiais e dublagens.',
      accent: 'from-amber-500/20 to-transparent border-amber-500/30 hover:border-amber-500/60',
      tagColor: 'text-amber-400 bg-amber-950/40',
      sample: 'Longas premiados, dramas e ação'
    },
    {
      id: 'music',
      title: 'Música',
      emoji: '🎵',
      icon: Music,
      desc: 'Marrabenta, Pandza, Kizomba, Afrobeat e os maiores festivais ao vivo do país e do continente.',
      accent: 'from-purple-500/20 to-transparent border-purple-500/30 hover:border-purple-500/60',
      tagColor: 'text-purple-400 bg-purple-950/40',
      sample: 'Top 100 Moçambique, Shows ao Vivo'
    },
    {
      id: 'news',
      title: 'Notícias',
      emoji: '📰',
      icon: Newspaper,
      desc: 'Informação em tempo real com apuração rigorosa de Moçambique, África Austral e do mundo.',
      accent: 'from-blue-500/20 to-transparent border-blue-500/30 hover:border-blue-500/60',
      tagColor: 'text-blue-400 bg-blue-950/40',
      sample: 'Jornais diários, Economia, Flash 24h'
    },
    {
      id: 'sports',
      title: 'Desporto',
      emoji: '⚽',
      icon: Trophy,
      desc: 'Cobertura especial do Moçambola, seleções nacionais, futebol internacional e artes marciais.',
      accent: 'from-emerald-500/20 to-transparent border-emerald-500/30 hover:border-emerald-500/60',
      tagColor: 'text-emerald-400 bg-emerald-950/40',
      sample: 'Moçambola, Champions, CAF, Boxe'
    },
    {
      id: 'originals',
      title: 'ORBE Originals',
      emoji: '⭐',
      icon: Sparkles,
      desc: 'Séries exclusivas, grandes entrevistas e documentários autorais produzidos no ORBE TV.',
      accent: 'from-cyan-500/20 to-transparent border-cyan-500/30 hover:border-cyan-500/60',
      tagColor: 'text-cyan-400 bg-cyan-950/40',
      sample: 'Vozes da Pérola, Conversa Blue'
    },
    {
      id: 'podcasts',
      title: 'Podcasts',
      emoji: '🎙️',
      icon: Mic,
      desc: 'Os melhores programas de conversa, negócios, tecnologia e cultura jovem em formato leve.',
      accent: 'from-pink-500/20 to-transparent border-pink-500/30 hover:border-pink-500/60',
      tagColor: 'text-pink-400 bg-pink-950/40',
      sample: 'Episódios completos em áudio e vídeo'
    },
    {
      id: 'kids',
      title: 'Kids',
      emoji: '👶',
      icon: Baby,
      desc: 'Ambiente seguro e lúdico para os pequenos, com desenhos educativos, cantigas e histórias africanas.',
      accent: 'from-yellow-500/20 to-transparent border-yellow-500/30 hover:border-yellow-500/60',
      tagColor: 'text-yellow-400 bg-yellow-950/40',
      sample: 'Turminha do Zico, Desenhos da Savana'
    }
  ];

  return (
    <section id="destaques" className="py-20 bg-[#050814] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
            <span>Catálogo Completo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            O QUE VOCÊ ENCONTRA
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Tudo o que você mais gosta em um só lugar. Selecione qualquer categoria para explorar no player.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => onCategoryClick(cat.id)}
                className={`group relative rounded-2xl p-6 bg-slate-900/50 border transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-gradient-to-b ${cat.accent}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{cat.emoji}</span>
                  <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-300 group-hover:text-white group-hover:bg-blue-600 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors flex items-center justify-between">
                  <span>{cat.title}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-400" />
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {cat.desc}
                </p>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[170px]">{cat.sample}</span>
                  <span className="text-blue-400 font-semibold group-hover:underline">Assistir</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
