import React, { useState } from 'react';
import { 
  Globe, UploadCloud, CheckCircle2, AlertCircle, Clock, DollarSign, 
  Users, Film, Music, Tv, BookOpen, Radio, Sparkles, Building2, 
  GraduationCap, School, HeartHandshake, Newspaper, Clapperboard, Mic, 
  ArrowRight, ShieldCheck, Zap, Plus, Filter, Eye
} from 'lucide-react';
import { CREATOR_PUBLISHERS, CONTENT_TYPES_CATALOG } from '../../data/enhancement-data';
import { soundEffects } from '../../services/sound-effects';

export const OpenBroadcastNetwork: React.FC = () => {
  const [selectedPublisher, setSelectedPublisher] = useState<string>('artistas');
  const [selectedContentType, setSelectedContentType] = useState<string>('documentarios');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Fields
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [duration, setDuration] = useState('45 min');
  const [monetizationModel, setMonetizationModel] = useState<'free' | 'subscription' | 'payperview'>('subscription');
  const [ppvPriceMT, setPpvPriceMT] = useState(50);
  const [fileSimulated, setFileSimulated] = useState<string | null>(null);

  // Submissions state
  const [submissions, setSubmissions] = useState([
    {
      id: 'sub-01',
      title: 'Histórias Ocultas da Ilha de Moçambique',
      publisherType: 'Cineastas & Roteiristas',
      contentType: 'Documentários',
      submittedDate: 'Hoje, 09:15',
      status: 'review_vision_ai', // 'submitted', 'review_vision_ai', 'editorial', 'approved_schedule', 'live'
      monetization: 'Assinatura UBlue + Ads',
      estimatedRevenueMT: 12400
    },
    {
      id: 'sub-02',
      title: 'Concerto Solidário: Sons da Paz Beira 2026',
      publisherType: 'Produtoras de Cinema & Vídeo',
      contentType: 'Concertos & Festivais',
      submittedDate: 'Ontem, 16:30',
      status: 'approved_schedule',
      monetization: 'Pay-Per-View M-Pesa (50 MT)',
      estimatedRevenueMT: 38900
    },
    {
      id: 'sub-03',
      title: 'Aula Magna: Inteligência Artificial no Desenvolvimento Africano',
      publisherType: 'Universidades & Politécnicos',
      contentType: 'Programas Educativos',
      submittedDate: 'Há 2 dias',
      status: 'live',
      monetization: 'Livre / Acesso Aberto',
      estimatedRevenueMT: 4500
    }
  ]);

  const handleCompleteSubmission = () => {
    const newEntry = {
      id: `sub-${Date.now().toString().slice(-4)}`,
      title: title || 'Produção Independente UBlue',
      publisherType: CREATOR_PUBLISHERS.find(p => p.id === selectedPublisher)?.name || 'Criador',
      contentType: CONTENT_TYPES_CATALOG.find(c => c.id === selectedContentType)?.name || 'Conteúdo',
      submittedDate: 'Agora',
      status: 'review_vision_ai',
      monetization: monetizationModel === 'payperview' ? `Pay-Per-View (${ppvPriceMT} MT)` : 'Assinatura UBlue',
      estimatedRevenueMT: 15000
    };

    setSubmissions([newEntry, ...submissions]);
    setIsSubmitModalOpen(false);
    setStep(1);
    setTitle('');
    setSynopsis('');
    setFileSimulated(null);
    soundEffects.play('content_ready');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">Submetido</span>;
      case 'review_vision_ai':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 flex items-center gap-1"><Sparkles className="w-3 h-3 animate-spin" /> Análise Vision AI & Áudio</span>;
      case 'approved_schedule':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/60 text-amber-300 border border-amber-500/40 flex items-center gap-1"><Clock className="w-3 h-3" /> Aprovado na Grelha</span>;
      case 'live':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> No Ar / Disponível</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero of Open Broadcast Network */}
      <div className="relative rounded-2xl bg-gradient-to-r from-blue-900/60 via-slate-900 to-indigo-950/70 border border-blue-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                UBlue Open Broadcast Network
              </span>
              <span className="text-xs text-slate-400">Emissão Aberta & Descentralizada</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              A Televisão Aberta a Todos os Criadores
            </h2>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              Artistas, escolas, produtoras, universidades, igrejas e jornalistas podem submeter obras 
              audiovisuais para distribuição em todo o país e no mundo, com monetização direta via M-Pesa e E-Mola.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => {
                setIsSubmitModalOpen(true);
                soundEffects.play('notification');
              }}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Submeter Novo Conteúdo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quem Pode Publicar (10 Perfis) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              Quem Pode Publicar na UBlue TV?
            </h3>
            <p className="text-xs text-slate-400">10 Categorias de criadores com canais e credenciais dedicadas</p>
          </div>
          <span className="text-xs text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
            100% Descentralizado
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CREATOR_PUBLISHERS.map((pub) => {
            const isSelected = selectedPublisher === pub.id;
            return (
              <div
                key={pub.id}
                onClick={() => {
                  setSelectedPublisher(pub.id);
                  soundEffects.play('new_message');
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-blue-950/60 border-cyan-400 ring-2 ring-cyan-400/20' 
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-700 text-slate-300'}`}>
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{pub.name}</h4>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                  {pub.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tipos de Conteúdo Suportados (11 Tipos) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
          <Film className="w-4 h-4 text-cyan-400" />
          Formatos e Tipos de Conteúdo Aceitos
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Desde videoclipes de 3 minutos até longas-metragens 4K e transmissões de eventos ao vivo
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {CONTENT_TYPES_CATALOG.map((item) => {
            const isSelected = selectedContentType === item.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedContentType(item.id);
                  soundEffects.play('new_message');
                }}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-cyan-950/40 border-cyan-400 text-white' 
                    : 'bg-slate-800/30 border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <p className="text-xs font-bold">{item.name}</p>
                <span className="text-[10px] text-slate-400 block mt-1">{item.quality}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submissions Pipeline & Revenue Tracking */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">Pipeline de Submissões e Ganhos</h3>
            <p className="text-xs text-slate-400">Acompanhamento do status editorial e receitas geradas em Meticais</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Total Arrecadado</span>
            <span className="text-xl font-extrabold text-emerald-400 font-mono">
              {submissions.reduce((acc, curr) => acc + curr.estimatedRevenueMT, 0).toLocaleString()} MT
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Conteúdo</th>
                <th className="pb-3 font-semibold">Produtor</th>
                <th className="pb-3 font-semibold">Data</th>
                <th className="pb-3 font-semibold">Monetização</th>
                <th className="pb-3 font-semibold">Status do Pipeline</th>
                <th className="pb-3 font-semibold text-right">Receita (MT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-800/30">
                  <td className="py-3 font-semibold text-white">{sub.title}</td>
                  <td className="py-3 text-slate-300">{sub.publisherType}</td>
                  <td className="py-3 text-slate-400">{sub.submittedDate}</td>
                  <td className="py-3 text-cyan-300">{sub.monetization}</td>
                  <td className="py-3">{getStatusBadge(sub.status)}</td>
                  <td className="py-3 text-right font-mono font-bold text-emerald-400">
                    +{sub.estimatedRevenueMT.toLocaleString()} MT
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submission Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scaleUp">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Submissão para a Open Broadcast Network</h3>
                <p className="text-xs text-slate-400">Passo {step} de 3 — Distribuição nacional e global</p>
              </div>
              <button 
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-white block mb-1">Título do Conteúdo</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Documentário Gorongosa: Vozes da Conservação"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white block mb-1">Sinopse do Conteúdo</label>
                    <textarea 
                      rows={3}
                      placeholder="Descreva a história, os protagonistas e relevância cultural..."
                      value={synopsis}
                      onChange={(e) => setSynopsis(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-white block mb-1">Perfil do Publicador</label>
                      <select 
                        value={selectedPublisher} 
                        onChange={(e) => setSelectedPublisher(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        {CREATOR_PUBLISHERS.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-white block mb-1">Tipo de Conteúdo</label>
                      <select 
                        value={selectedContentType} 
                        onChange={(e) => setSelectedContentType(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        {CONTENT_TYPES_CATALOG.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-700 hover:border-cyan-400 rounded-2xl p-8 text-center bg-slate-800/30 transition-all cursor-pointer">
                    <UploadCloud className="w-10 h-10 text-cyan-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-white">Arraste seu arquivo de vídeo master ou clique para selecionar</p>
                    <p className="text-xs text-slate-400 mt-1">MP4, MOV, ProRes ou MKV (Até 100GB via Ingest SRT/S3)</p>
                    
                    <button 
                      onClick={() => setFileSimulated('master_video_prores422_ublue.mov (3.4 GB)')}
                      className="mt-4 px-4 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs text-white"
                    >
                      Simular Upload de Arquivo
                    </button>

                    {fileSimulated && (
                      <p className="text-xs text-emerald-400 font-mono mt-3">✓ Arquivo carregado: {fileSimulated}</p>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-slate-300 space-y-1">
                    <p className="font-bold text-cyan-300">Integração Automática com Media Enhancement Engine:</p>
                    <p>Ao submeter, o arquivo passa automaticamente pela UBlue Vision AI e normalização sonora EBU R128.</p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <label className="text-xs font-semibold text-white block">Modelo de Monetização Pretendido:</label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div 
                      onClick={() => setMonetizationModel('subscription')}
                      className={`p-3 rounded-xl border cursor-pointer ${
                        monetizationModel === 'subscription' 
                          ? 'border-cyan-400 bg-cyan-950/40 text-white' 
                          : 'border-slate-800 bg-slate-800/30 text-slate-400'
                      }`}
                    >
                      <p className="text-xs font-bold">Catálogo Geral</p>
                      <p className="text-[11px] mt-1">Remuneração por visualizações nos planos da UBlue TV.</p>
                    </div>

                    <div 
                      onClick={() => setMonetizationModel('payperview')}
                      className={`p-3 rounded-xl border cursor-pointer ${
                        monetizationModel === 'payperview' 
                          ? 'border-cyan-400 bg-cyan-950/40 text-white' 
                          : 'border-slate-800 bg-slate-800/30 text-slate-400'
                      }`}
                    >
                      <p className="text-xs font-bold">Pay-Per-View M-Pesa</p>
                      <p className="text-[11px] mt-1">Cobrança individual por ingresso ou aluguel de 48h.</p>
                    </div>

                    <div 
                      onClick={() => setMonetizationModel('free')}
                      className={`p-3 rounded-xl border cursor-pointer ${
                        monetizationModel === 'free' 
                          ? 'border-cyan-400 bg-cyan-950/40 text-white' 
                          : 'border-slate-800 bg-slate-800/30 text-slate-400'
                      }`}
                    >
                      <p className="text-xs font-bold">Acesso Livre</p>
                      <p className="text-[11px] mt-1">Conteúdo aberto com monetização por inserções de patrocínio.</p>
                    </div>
                  </div>

                  {monetizationModel === 'payperview' && (
                    <div className="p-3 bg-slate-800/60 rounded-xl space-y-2">
                      <label className="text-xs text-white">Preço do Ingresso por Espectador (MT):</label>
                      <input 
                        type="number" 
                        value={ppvPriceMT} 
                        onChange={(e) => setPpvPriceMT(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white"
                      />
                      <p className="text-[11px] text-slate-400">80% do valor líquido vai direto para a sua carteira M-Pesa / E-Mola.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between">
              {step > 1 ? (
                <button
                  onClick={() => setStep((step - 1) as any)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Voltar
                </button>
              ) : <div />}

              {step < 3 ? (
                <button
                  onClick={() => setStep((step + 1) as any)}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <span>Continuar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleCompleteSubmission}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enviar para Aprovação</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
