import React, { useState } from 'react';
import { Sparkles, Film, Star, Play, Award, Users, Clapperboard, CheckCircle2, ArrowRight } from 'lucide-react';
import { OriginalShow } from '../../types/ecosystem';

interface OriginalsStudioProps {
  onWatchShow: (show: OriginalShow) => void;
}

export const OriginalsStudio: React.FC<OriginalsStudioProps> = ({ onWatchShow }) => {
  const [filter, setFilter] = useState<string>('Todos');
  const [isCastingModalOpen, setIsCastingModalOpen] = useState(false);

  const originals: OriginalShow[] = [
    {
      id: 'orig-1',
      title: 'A Grande Voz ORBE TV',
      type: 'Concurso de Talentos',
      description: 'O maior concurso musical de Moçambique, revelando novas vozes de todas as 11 províncias em colaboração com a Be Universe Agency.',
      coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      episodesCount: 12,
      talentAgency: 'Be Universe Agency',
      talents: ['Inês Tembe (Apresentadora)', 'DJ Zico (Jurado)', 'Talentos Be Universe'],
      premiereDate: 'Em Exibição Toda Sexta às 20h',
      status: 'Em Exibição',
      rating: 'Livre',
      featuredQuote: '“A plataforma definitiva para quem sonha cantar nos maiores palcos da África Lusófona.”'
    },
    {
      id: 'orig-2',
      title: 'Noites de Maputo: Sombras do Porto',
      type: 'Série',
      description: 'Thriller dramático gravado nas avenidas e vielas históricas da Baixa de Maputo, com elenco estelar formado por atores agenciados.',
      coverImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
      episodesCount: 8,
      talentAgency: 'Be Universe Agency',
      talents: ['Carlos Mondlane Jr.', 'Fátima Cossa', 'Atores Be Universe'],
      premiereDate: 'Temporada 1 Completa',
      status: 'Em Exibição',
      rating: '14+',
      featuredQuote: '“Uma produção que eleva o cinema e teledramaturgia nacional a padrões internacionais.”'
    },
    {
      id: 'orig-3',
      title: 'Vozes da Pérola: Raízes da Marrabenta',
      type: 'Documentário',
      description: 'Uma jornada sensorial pelos mestres que criaram a identidade sonora de Moçambique, com gravações raras e remasterização em som surround.',
      coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
      episodesCount: 4,
      talentAgency: 'ORBE Studios',
      talents: ['Mestres da Marrabenta', 'Orquestra ORBE'],
      premiereDate: 'Disponível no Pacote Médio & Max',
      status: 'Em Exibição',
      rating: 'Livre',
      featuredQuote: '“A memória viva da nossa pátria em alta definição 4K.”'
    },
    {
      id: 'orig-4',
      title: 'Mansão das Estrelas Moçambique',
      type: 'Reality Show',
      description: 'Criadores de conteúdo, influenciadores e artistas confinados em uma residência luxuosa na Costa do Sol com transmissões 24 horas.',
      coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
      episodesCount: 30,
      talentAgency: 'Be Universe Agency',
      talents: ['12 Influenciadores Be Universe', 'Apresentação ORBE Live'],
      premiereDate: 'Transmissão Diária',
      status: 'Em Exibição',
      rating: '12+',
      featuredQuote: '“O reality show mais assistido e comentado nas redes sociais de Moçambique.”'
    },
    {
      id: 'orig-5',
      title: 'Sessões Acústicas ORBE',
      type: 'Programa Musical',
      description: 'Apresentações intimistas gravadas no estúdio central da ORBE com novos arranjos de sucessos urbanos e tradicionais.',
      coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      episodesCount: 16,
      talentAgency: 'Be Universe Agency',
      talents: ['Banda ORBE', 'Convidados Semanais'],
      premiereDate: 'Todo Domingo às 17h',
      status: 'Em Exibição',
      rating: 'Livre',
      featuredQuote: '“Música pura, sem filtros, direto do coração de Maputo.”'
    },
    {
      id: 'orig-6',
      title: 'Conversa Blue VIP: O Futuro da Nação',
      type: 'Podcast Exclusivo',
      description: 'Líderes que transformam Moçambique em debates profundos sobre tecnologia, energia, finanças e cultura.',
      coverImage: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
      episodesCount: 24,
      talentAgency: 'ORBE Studios',
      talents: ['Apresentadores Residentes'],
      premiereDate: 'Episódios Semanais',
      status: 'Em Exibição',
      rating: 'Livre',
      featuredQuote: '“O podcast mais influente entre tomadores de decisão em África Austral.”'
    }
  ];

  const types = ['Todos', 'Concurso de Talentos', 'Série', 'Documentário', 'Reality Show', 'Programa Musical', 'Podcast Exclusivo'];

  const filtered = filter === 'Todos'
    ? originals
    : originals.filter(o => o.type === filter);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left space-y-12 animate-fade-in">
      
      {/* Studio Header */}
      <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 shadow-2xl relative">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>Produções Exclusivas</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            ORBE Originals Studio
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            Histórias nossas, feitas por nós e para o mundo. O estúdio oficial da plataforma produz séries, realities e concursos com padrões internacionais de pós-produção.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Fornecedora Oficial de Talentos: <strong className="text-cyan-400">Be Universe Agency</strong></span>
            </div>
            <button
              onClick={() => setIsCastingModalOpen(true)}
              className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Inscrever-se no Casting Be Universe
            </button>
          </div>
        </div>
      </div>

      {/* Be Universe Agency Talent Spotlight Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/50 via-slate-900 to-blue-950/50 border border-cyan-500/30 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center shadow-xl">
        <div className="lg:col-span-8 space-y-3">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Aliança Estratégica · Be Universe Agency</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            O celeiro dos maiores talentos da ORBE TV
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            A <strong>Be Universe Agency</strong> atua como a agência oficial de representação de atores, cantores, apresentadores e influenciadores digitais da ORBE TV. Todos os participantes de realities, apresentadores de programas ao vivo e elencos de séries são formados e preparados pela agência.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 pt-1">
            <span className="flex items-center gap-1.5 text-white">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Gestão de Carreira Artística
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 text-white">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              Castings para Novas Produções
            </span>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col items-center sm:items-end justify-center">
          <button
            onClick={() => setIsCastingModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Quero Fazer Parte do Elenco</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
              filter === t ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Originals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((show) => (
          <div
            key={show.id}
            className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group shadow-xl"
          >
            <div className="relative aspect-video overflow-hidden bg-black">
              <img
                src={show.coverImage}
                alt={show.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-600 text-white">
                  {show.type}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-slate-300 backdrop-blur-md">
                  {show.episodesCount} eps
                </span>
              </div>

              <div className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                {show.status}
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-[11px] font-mono text-cyan-300 block">{show.talentAgency}</span>
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                  {show.title}
                </h3>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {show.description}
              </p>

              <div className="p-3 rounded-xl bg-slate-950 text-[11px] text-slate-400 italic">
                {show.featuredQuote}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">{show.premiereDate}</span>
                <button
                  onClick={() => onWatchShow(show)}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Assistir</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Casting Modal */}
      {isCastingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-left">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#080d22] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-1">Casting Oficial · Be Universe Agency & UBlue TV</h3>
            <p className="text-xs text-slate-400 mb-5">Submeta seu perfil para concorrer a papéis em séries, realities e talk shows.</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Inscrição no casting submetida com sucesso! A equipe de seleção da Be Universe Agency analisará seu portfólio.');
                setIsCastingModalOpen(false);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Nome Completo:</label>
                <input type="text" placeholder="Seu nome artístico ou oficial" className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2.5 text-white" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Talento Principal:</label>
                  <select className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2.5 text-white">
                    <option>Ator / Atriz</option>
                    <option>Apresentador(a)</option>
                    <option>Cantor(a) / Voz</option>
                    <option>Humorista</option>
                    <option>Influenciador(a)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Cidade:</label>
                  <input type="text" placeholder="Maputo, Matola, Beira..." className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2.5 text-white" required />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Instagram ou Link do Vídeo de Apresentação:</label>
                <input type="text" placeholder="@seuusuario ou link do vídeo no drive/youtube" className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2.5 text-white font-mono" required />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Telefone (WhatsApp / M-Pesa):</label>
                <input type="text" placeholder="+258 84 000 0000" className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2.5 text-white font-mono" required />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button type="submit" className="flex-1 py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase cursor-pointer">
                  Enviar Candidatura ao Casting
                </button>
                <button type="button" onClick={() => setIsCastingModalOpen(false)} className="py-3 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs cursor-pointer">
                  Fechar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
