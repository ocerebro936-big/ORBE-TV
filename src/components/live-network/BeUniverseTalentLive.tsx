import React, { useState } from 'react';
import { Star, Trophy, Users, Heart, Sparkles, Award, CheckCircle2, MessageSquare, Send } from 'lucide-react';
import { TalentContestant } from '../../types/live-network';
import { MOCK_TALENT_CONTESTANTS } from '../../data/live-network-data';

interface BeUniverseTalentLiveProps {
  onOpenWallet?: () => void;
}

export const BeUniverseTalentLive: React.FC<BeUniverseTalentLiveProps> = () => {
  const [contestants, setContestants] = useState<TalentContestant[]>(MOCK_TALENT_CONTESTANTS);
  const [votedMap, setVotedMap] = useState<Record<string, number>>({});
  const [liveChatMessages, setLiveChatMessages] = useState<Array<{ user: string; text: string; time: string }>>([
    { user: 'Zito Maputo', text: 'Amina Soul tem uma voz impressionante! Marrabenta no sangue!', time: '15:42' },
    { user: 'Carla Beira', text: 'Votando direto da Beira! Júlio Cossa merece ficar no programa!', time: '15:43' },
    { user: 'Be Universe Agency', text: 'Os 3 finalistas terão contrato de gravação internacional garantido!', time: '15:44' },
    { user: 'Gildo Nampula', text: 'A mistura da Timbila com Trap ficou inacreditável. 10/10!', time: '15:45' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleFreeVote = (cId: string) => {
    setContestants(prev => prev.map(c => {
      if (c.id === cId) {
        return { ...c, votesCount: c.votesCount + 1 };
      }
      return c;
    }));
    setVotedMap(prev => ({ ...prev, [cId]: (prev[cId] || 0) + 1 }));
  };

  const handleSuperVoteMpesa = (cId: string) => {
    setContestants(prev => prev.map(c => {
      if (c.id === cId) {
        return { ...c, votesCount: c.votesCount + 10 };
      }
      return c;
    }));
    setVotedMap(prev => ({ ...prev, [cId]: (prev[cId] || 0) + 10 }));
    alert('Super Voto M-Pesa (10 votos) registrado com sucesso para o concorrente!');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setLiveChatMessages([
      ...liveChatMessages,
      { user: 'Você (Telespectador)', text: chatInput, time: 'Agora' }
    ]);
    setChatInput('');
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Reality & Concurso ao Vivo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Be Universe Talent Show: Gala das Províncias
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1">
            Produzido pela <strong>Be Universe Agency</strong> com transmissão ao vivo na ORBE TV. Vote no seu talento favorito para garantir a permanência no programa.
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Votos Computados</span>
          <span className="text-3xl font-black text-amber-400 font-mono">
            {contestants.reduce((acc, c) => acc + c.votesCount, 0).toLocaleString('pt-PT')}
          </span>
          <span className="text-[11px] text-emerald-400 font-medium block mt-0.5">
            ● Linhas de Votação Abertas
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Contestants Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Concorrentes no Palco</h3>
            <span className="text-xs text-slate-400">Classificação em Tempo Real</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contestants.map((c, idx) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3 mb-3">
                    <img src={c.avatar} alt={c.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500/30" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-purple-950 text-purple-300">
                          #{idx + 1}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          c.status === 'salvo' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-red-950 text-red-400 border border-red-500/30'
                        }`}>
                          {c.status === 'salvo' ? 'SALVO' : 'ZONA DE RISCO'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white truncate mt-1">{c.artisticName}</h4>
                      <p className="text-[11px] text-slate-400">{c.province} · {c.specialty}</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/70 text-[11px] text-slate-300 mb-3">
                    <span className="text-slate-500 text-[10px] block">Apresentação:</span>
                    <span className="font-medium line-clamp-2">{c.songOrAct}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs mb-4">
                    <span className="text-slate-400">Nota do Júri Técnico:</span>
                    <span className="font-mono font-bold text-amber-400 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {c.juryScore} / 10
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs mb-3 font-mono">
                    <span className="text-slate-400">Total de Votos:</span>
                    <span className="font-extrabold text-white text-sm">{c.votesCount.toLocaleString('pt-PT')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handleFreeVote(c.id)}
                    className="py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>Votar Grátis</span>
                  </button>

                  <button
                    onClick={() => handleSuperVoteMpesa(c.id)}
                    className="py-2 px-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    title="Voto turbinado via M-Pesa (10 MT)"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>+10 M-Pesa</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Chat & Audience Feedback */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between h-[520px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span>Chat ao Vivo dos Telespectadores</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">ATIVO</span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 text-xs">
              {liveChatMessages.map((msg, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                    <span className="font-bold text-cyan-300">{msg.user}</span>
                    <span className="font-mono">{msg.time}</span>
                  </div>
                  <p className="text-slate-200 leading-snug">{msg.text}</p>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-3 border-t border-slate-800">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Envie sua torcida ao vivo..."
              className="flex-1 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
