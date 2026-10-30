import React, { useState } from 'react';
import { Globe2, Tv, Radio, Clapperboard, Video, Newspaper, Mic, Users, ShieldCheck, TrendingUp, CheckCircle, Plus, Send, FileText, Handshake } from 'lucide-react';
import { PartnerEntity } from '../../types/ecosystem';
import { GlobalPartnershipProposalModal } from './GlobalPartnershipProposalModal';

export const PartnerNetwork: React.FC = () => {
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [partners, setPartners] = useState<PartnerEntity[]>([
    {
      id: 'p-1',
      name: 'Rede de Televisões Regionais de Moçambique',
      type: 'tv-local',
      location: 'Beira, Sofala',
      reachEstimate: '450.000 espectadores',
      status: 'verified',
      channelsCount: 4,
      badge: 'PARCEIRO GOLD',
      logo: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=160&auto=format&fit=crop&q=80',
      bio: 'Associação de emissoras regionais que transmitem os principais acontecimentos culturais e comunitários do Centro do país.'
    },
    {
      id: 'p-2',
      name: 'Rádios Comunitárias do Índico',
      type: 'radio-comunitaria',
      location: 'Inhambane & Gaza',
      reachEstimate: '280.000 ouvintes',
      status: 'verified',
      channelsCount: 6,
      badge: 'ÁUDIO PARTNER',
      logo: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=160&auto=format&fit=crop&q=80',
      bio: 'Sinais FM transmitidos digitalmente via IP com compressão adaptativa para economizar dados móveis.'
    },
    {
      id: 'p-3',
      name: 'Cinema & Artes Audiovisuais Moçambique',
      type: 'produtora',
      location: 'Maputo',
      reachEstimate: '18 Filmes Licenciados',
      status: 'verified',
      channelsCount: 2,
      badge: 'PRODUTORA EXCLUSIVA',
      logo: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=160&auto=format&fit=crop&q=80',
      bio: 'Produtora cinematográfica responsável por documentários premiados e curtas-metragens lusófonos.'
    },
    {
      id: 'p-4',
      name: 'Coletivo de Podcasters e Criadores Digitais',
      type: 'podcaster',
      location: 'Nacional & Diáspora',
      reachEstimate: '120.000 streams/mês',
      status: 'verified',
      channelsCount: 12,
      badge: 'CREATOR ALLIANCE',
      logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=160&auto=format&fit=crop&q=80',
      bio: 'Agregação dos podcasts mais ouvidos de tecnologia, cultura urbana e debates sociopolíticos.'
    }
  ]);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [partnerType, setPartnerType] = useState<PartnerEntity['type']>('tv-local');
  const [partnerCity, setPartnerCity] = useState('Maputo');
  const [partnerStreamOrPortfolio, setPartnerStreamOrPortfolio] = useState('');

  const eligibleCategories = [
    { title: 'Televisões Locais', icon: Tv, desc: 'Sinais regionais e canais comunitários' },
    { title: 'Rádios Comunitárias', icon: Radio, desc: 'Emissoras FM e estações do interior' },
    { title: 'Estúdios de Produção', icon: Clapperboard, desc: 'Estruturas de gravação de som e imagem' },
    { title: 'Produtoras de Cinema', icon: Video, desc: 'Detentoras de direitos e catálogos de filmes' },
    { title: 'Jornalistas Independentes', icon: Newspaper, desc: 'Correspondentes e cronistas com credibilidade' },
    { title: 'Influenciadores Digitais', icon: Users, desc: 'Líderes de opinião com forte engajamento' },
    { title: 'Podcasters e Radialistas', icon: Mic, desc: 'Canais de áudio e talk shows em formato dinâmico' },
  ];

  const benefits = [
    {
      title: 'Distribuição Nacional',
      desc: 'Seu canal ou programa entregue com baixa latência para todos os cantos de Moçambique e diáspora.',
      icon: Globe2
    },
    {
      title: 'Novas Audiências',
      desc: 'Acesso imediato à base de utilizadores ativos do ORBE TV com sistema de recomendação por IA.',
      icon: Users
    },
    {
      title: 'Ferramentas de Monetização',
      desc: 'Receba receita por visualização, repasse de assinaturas e publicidade diretamente no M-Pesa.',
      icon: TrendingUp
    },
    {
      title: 'Estatísticas Detalhadas',
      desc: 'Painel em tempo real com minutos assistidos, retenção por minuto e demografia exata de telespectadores.',
      icon: Clapperboard
    },
    {
      title: 'Gestão de Direitos Autorais (DRM)',
      desc: 'Criptografia segura e proteção contra pirataria, garantindo que o seu conteúdo seja respeitado.',
      icon: ShieldCheck
    }
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const newPartner: PartnerEntity = {
      id: `p-${Date.now()}`,
      name: partnerName,
      type: partnerType,
      location: partnerCity,
      reachEstimate: 'Em Análise Inicial',
      status: 'pending',
      channelsCount: 1,
      badge: 'CANDIDATURA RECEBIDA',
      logo: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=160&auto=format&fit=crop&q=80',
      bio: `Candidatura enviada via ORBE Partner Network. Transmissão ou portfólio: ${partnerStreamOrPortfolio}`
    };

    setPartners([newPartner, ...partners]);
    setIsApplyModalOpen(false);
    setPartnerName('');
    alert('Candidatura submetida com sucesso! Nossa equipe entrará em contato em até 24h para envio das chaves de ingestão do sinal.');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left space-y-12 animate-fade-in">
      
      {/* Hero Presentation */}
      <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-blue-950/90 via-slate-900 to-slate-950 border border-blue-500/30 shadow-2xl relative">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/20">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Rede Oficial de Parceiros</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            ORBE Partner Network
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            Conectamos emissoras de TV locais, rádios comunitárias, produtoras cinematográficas e influenciadores a uma infraestrutura de distribuição digital de alta performance.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Aderir ao Programa de Parceiros</span>
            </button>

            <button
              onClick={() => setIsProposalModalOpen(true)}
              className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 hover:text-white border border-cyan-500/40 font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-cyan-950/40"
            >
              <Handshake className="w-4 h-4 text-cyan-400" />
              <span>Documento Proposta Comercial Global (Google & CDNs)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quem pode aderir */}
      <div className="space-y-4">
        <div className="text-xs font-bold text-blue-400 uppercase tracking-widest">
          Ecossistema Aberto
        </div>
        <h2 className="text-2xl font-bold text-white">Quem Pode Aderir à ORBE Partner Network</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {eligibleCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{cat.title}</h3>
                <p className="text-xs text-slate-400">{cat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benefícios */}
      <div className="space-y-4">
        <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
          Vantagens Estratégicas
        </div>
        <h2 className="text-2xl font-bold text-white">Benefícios para os Parceiros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{b.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Parceiros em Destaque */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Parceiros Conectados</h2>
          <span className="text-xs text-slate-400">{partners.length} entidades credenciadas</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {partners.map((p) => (
            <div key={p.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-4">
              <img src={p.logo} alt={p.name} className="w-16 h-16 rounded-xl object-cover border border-slate-800" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-500/20">
                    {p.badge}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-bold">{p.reachEstimate}</span>
                </div>
                <h3 className="text-sm font-bold text-white truncate">{p.name}</h3>
                <p className="text-xs text-slate-400 font-mono mb-2">{p.location}</p>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{p.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-left">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#090d20] border border-blue-500/30 p-6 sm:p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-1">Candidatura à ORBE Partner Network</h3>
            <p className="text-xs text-slate-400 mb-5">Junte sua emissora, estúdio ou produtora ao ecossistema.</p>

            <form onSubmit={handleApply} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Nome da Entidade / Canal:</label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="Ex: Rádio Comunitária Voz de Gaza"
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Tipo de Parceiro:</label>
                  <select
                    value={partnerType}
                    onChange={(e) => setPartnerType(e.target.value as any)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2.5 text-white"
                  >
                    <option value="tv-local">Televisão Local</option>
                    <option value="radio-comunitaria">Rádio Comunitária</option>
                    <option value="estudio">Estúdio de Gravação</option>
                    <option value="produtora">Produtora de Cinema</option>
                    <option value="jornalista">Jornalista</option>
                    <option value="influenciador">Influenciador</option>
                    <option value="podcaster">Podcaster</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Cidade / Província:</label>
                  <input
                    type="text"
                    value={partnerCity}
                    onChange={(e) => setPartnerCity(e.target.value)}
                    placeholder="Ex: Nampula, Beira, Matola"
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2.5 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Stream URL (HLS/RTMP) ou Portfólio:</label>
                <input
                  type="text"
                  value={partnerStreamOrPortfolio}
                  onChange={(e) => setPartnerStreamOrPortfolio(e.target.value)}
                  placeholder="https://exemplo.com/stream.m3u8 ou canal no YouTube"
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2.5 text-white font-mono"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 text-slate-300 text-[11px] space-y-1">
                <span className="font-bold text-white block">Processo de Homologação:</span>
                <div>1. Validação de direitos e licença de transmissão</div>
                <div>2. Teste de latência e compatibilidade com o Content Normalizer</div>
                <div>3. Publicação no catálogo e ativação de repasse M-Pesa</div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button type="submit" className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase cursor-pointer">
                  Enviar Proposta de Parceria
                </button>
                <button type="button" onClick={() => setIsApplyModalOpen(false)} className="py-3 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs cursor-pointer">
                  Fechar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Corporate Partnership Proposal Modal */}
      <GlobalPartnershipProposalModal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
      />

    </div>
  );
};
