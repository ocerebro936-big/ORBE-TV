import React, { useState } from 'react';
import { Briefcase, Video, Flag, Radio, Rocket, Percent, ShoppingBag, DollarSign, TrendingUp, CheckCircle2, ShieldCheck, Zap, Plus, ArrowRight, Megaphone, Smartphone } from 'lucide-react';
import { BusinessCampaign } from '../../types/ecosystem';
import { AdvertisingHub } from './AdvertisingHub';

interface BusinessCenterProps {
  onOpenWallet: () => void;
  onOpenFinanceCenter?: () => void;
}

export const BusinessCenter: React.FC<BusinessCenterProps> = ({ onOpenWallet, onOpenFinanceCenter }) => {
  const [activeTab, setActiveTab] = useState<'advertising_hub' | 'services' | 'campaigns' | 'calculator'>('advertising_hub');
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);

  // Active business campaigns
  const [campaigns, setCampaigns] = useState<BusinessCampaign[]>([
    {
      id: 'cmp-1',
      brandName: 'Vodacom Moçambique',
      title: 'Campanha Megas Ilimitados e M-Pesa Fácil',
      type: 'video-ad',
      budgetMT: 25000,
      spentMT: 18450,
      impressions: 142000,
      clicks: 8640,
      status: 'active',
      targetAudience: 'Todo Moçambique · Jovens e Profissionais',
      placement: 'Pre-roll'
    },
    {
      id: 'cmp-2',
      brandName: 'Cervejas de Moçambique',
      title: 'Patrocínio Oficial Moçambola 2026',
      type: 'event-streaming',
      budgetMT: 60000,
      spentMT: 45000,
      impressions: 310000,
      clicks: 19800,
      status: 'active',
      targetAudience: 'Maputo, Beira e Nampula · Fãs de Futebol',
      placement: 'Live Stream Overlay'
    },
    {
      id: 'cmp-3',
      brandName: 'Banco Comercial de Moçambique',
      title: 'Abertura de Conta Jovem sem Custos',
      type: 'sponsored-banner',
      budgetMT: 15000,
      spentMT: 15000,
      impressions: 98000,
      clicks: 5210,
      status: 'completed',
      targetAudience: 'Universitários e Empreendedores',
      placement: 'Hero Banner'
    }
  ]);

  // Calculator / New campaign state
  const [calcBudget, setCalcBudget] = useState(5000);
  const [calcService, setCalcService] = useState<'video-ad' | 'sponsored-banner' | 'event-streaming' | 'product-launch' | 'promo-campaign'>('video-ad');
  const [brandName, setBrandName] = useState('');
  const [campaignTitle, setCampaignTitle] = useState('');
  const [targetRegion, setTargetRegion] = useState('Todo Moçambique');

  const estimatedImpressions = Math.round(calcBudget * 7.5);
  const estimatedClicks = Math.round(estimatedImpressions * 0.055);

  const servicesList = [
    {
      id: 'video-ad',
      title: 'Publicidade em Vídeo',
      icon: Video,
      description: 'Anúncios em vídeo em alta definição exibidos antes e durante transmissões nos canais mais assistidos.',
      formats: 'Pre-roll 15s · Mid-roll 30s',
      cpmEstimate: '130 MT por mil impressões'
    },
    {
      id: 'sponsored-banner',
      title: 'Banners Patrocinados',
      icon: Flag,
      description: 'Banners estáticos e interativos posicionados no topo do portal UBlue, no player e no menu do aplicativo.',
      formats: 'Hero Banner · Overlay de Canal · Barra Superior',
      cpmEstimate: '75 MT por mil visualizações'
    },
    {
      id: 'event-streaming',
      title: 'Transmissão de Eventos',
      icon: Radio,
      description: 'Estrutura técnica completa para transmissão ao vivo de festivais, cúpulas empresariais e desporto com servidores locais.',
      formats: 'Transmissão HLS Full HD · Chat ao Vivo · Pay-Per-View',
      cpmEstimate: 'A partir de 15.000 MT por evento'
    },
    {
      id: 'product-launch',
      title: 'Lançamento de Produtos',
      icon: Rocket,
      description: 'Crie uma experiência imersiva com contagem regressiva, evento de apresentação e distribuição nacional instantânea.',
      formats: 'Página dedicada · Notificação Push para 50.000+ utilizadores',
      cpmEstimate: 'Pacote Especial de Lançamento'
    },
    {
      id: 'promo-campaign',
      title: 'Campanhas Promocionais',
      icon: Percent,
      description: 'Cupons exclusivos, sorteios ao vivo durante programas de entretenimento e interatividade com a audiência.',
      formats: 'Integração de Códigos USSD / WhatsApp',
      cpmEstimate: 'Personalizado de acordo com o alcance'
    },
    {
      id: 'marketplace',
      title: 'Marketplace de Serviços',
      icon: ShoppingBag,
      description: 'Exponha produtos físicos e serviços digitais diretamente na loja embutida do Universo Blue.',
      formats: 'Catálogo de Produtos · Pagamento integrado com M-Pesa',
      cpmEstimate: 'Comissão por venda concluída'
    }
  ];

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName || !campaignTitle) return;

    const newCmp: BusinessCampaign = {
      id: `cmp-${Date.now()}`,
      brandName,
      title: campaignTitle,
      type: calcService,
      budgetMT: calcBudget,
      spentMT: 0,
      impressions: 0,
      clicks: 0,
      status: 'active',
      targetAudience: targetRegion,
      placement: calcService === 'video-ad' ? 'Pre-roll' : calcService === 'sponsored-banner' ? 'Hero Banner' : 'Live Stream Overlay'
    };

    setCampaigns([newCmp, ...campaigns]);
    setBrandName('');
    setCampaignTitle('');
    setIsNewCampaignModalOpen(false);
    alert(`Campanha criada com sucesso! O orçamento de ${calcBudget} MT foi alocado via UBlue Business Gateway.`);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 border border-blue-500/30 shadow-2xl relative overflow-hidden">
        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/20">
            <Briefcase className="w-3.5 h-3.5" />
            <span>UBlue Business Center</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Conecte sua Marca à Maior Audiência de Streaming de Moçambique
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            Anuncie com precisão cirúrgica em canais de TV ao vivo, podcasts líderes e transmissões desportivas com relatórios transparentes e pagamento simplificado via M-Pesa e transferência bancária.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsNewCampaignModalOpen(true)}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Nova Campanha</span>
            </button>

            {onOpenFinanceCenter && (
              <button
                onClick={onOpenFinanceCenter}
                className="px-5 py-3.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors cursor-pointer flex items-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Centro Financeiro M-Pesa (Fase 2)</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('calculator')}
              className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Calcular Alcance & Orçamento (MT)
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('advertising_hub')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'advertising_hub' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Megaphone className="w-4 h-4 text-cyan-300" />
          <span>Publicidade & Media Kit 2026 (Fase 3)</span>
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'services' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Serviços Empresariais (6)
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'campaigns' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Campanhas Ativas ({campaigns.length})
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'calculator' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Simulador de ROI & Meticais
        </button>
      </div>

      {/* Tab 0: Publicidade & Media Kit (Fase 3) */}
      {activeTab === 'advertising_hub' && (
        <AdvertisingHub onOpenWallet={onOpenWallet} />
      )}

      {/* Tab 1: Services Catalog */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {servicesList.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{srv.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{srv.description}</p>
                  <div className="p-2.5 rounded-lg bg-slate-950/70 text-[11px] font-mono text-cyan-300 mb-4">
                    {srv.formats}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">{srv.cpmEstimate}</span>
                  <button
                    onClick={() => {
                      setCalcService(srv.id as any);
                      setIsNewCampaignModalOpen(true);
                    }}
                    className="text-blue-400 font-bold hover:underline flex items-center gap-0.5"
                  >
                    <span>Contratar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Campaigns */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {campaigns.map((cmp) => (
              <div
                key={cmp.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold text-cyan-400">{cmp.brandName}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-400 uppercase">
                      {cmp.type}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      cmp.status === 'active' ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {cmp.status === 'active' ? 'EM EXECUÇÃO' : 'FINALIZADA'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">{cmp.title}</h3>
                  <p className="text-xs text-slate-400">
                    Público: <strong className="text-slate-300">{cmp.targetAudience}</strong> · Posição: {cmp.placement}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Orçamento Total</span>
                    <span className="font-extrabold text-white text-sm">{cmp.budgetMT.toLocaleString('pt-PT')} MT</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Executado</span>
                    <span className="font-extrabold text-blue-400 text-sm">{cmp.spentMT.toLocaleString('pt-PT')} MT</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Impressões</span>
                    <span className="font-extrabold text-white text-sm">{cmp.impressions.toLocaleString('pt-PT')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Cliques Gerados</span>
                    <span className="font-extrabold text-emerald-400 text-sm">{cmp.clicks.toLocaleString('pt-PT')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Simulator / Calculator */}
      {activeTab === 'calculator' && (
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <h3 className="text-xl font-bold text-white">Simulador de Alcance de Campanha</h3>
            <p className="text-xs text-slate-300">
              Ajuste o valor do investimento para projetar o volume de telespectadores atingidos em Moçambique.
            </p>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                <span>Orçamento da Campanha (MT):</span>
                <span className="text-xl font-black text-emerald-400">{calcBudget.toLocaleString('pt-PT')} MT</span>
              </div>
              <input
                type="range"
                min={1000}
                max={100000}
                step={1000}
                value={calcBudget}
                onChange={(e) => setCalcBudget(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>1.000 MT</span>
                <span>25.000 MT</span>
                <span>50.000 MT</span>
                <span>100.000 MT</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tipo de Serviço:</label>
                <select
                  value={calcService}
                  onChange={(e) => setCalcService(e.target.value as any)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2.5 text-xs text-white"
                >
                  <option value="video-ad">Publicidade em Vídeo (Pre-roll)</option>
                  <option value="sponsored-banner">Banners Patrocinados</option>
                  <option value="event-streaming">Transmissão de Eventos</option>
                  <option value="product-launch">Lançamento de Produtos</option>
                  <option value="promo-campaign">Campanhas Promocionais</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Geolocalização Alvo:</label>
                <select
                  value={targetRegion}
                  onChange={(e) => setTargetRegion(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2.5 text-xs text-white"
                >
                  <option value="Todo Moçambique">Todo Moçambique (Nacional)</option>
                  <option value="Grande Maputo">Grande Maputo & Matola</option>
                  <option value="Região Centro">Região Centro (Beira, Tete, Chimoio)</option>
                  <option value="Região Norte">Região Norte (Nampula, Pemba, Nacala)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-950 border border-blue-500/30 space-y-4">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block">Projeção Estimada UBlue</span>
            
            <div>
              <span className="text-[11px] text-slate-400 block">Alcance Estimado:</span>
              <span className="text-3xl font-black text-white">{estimatedImpressions.toLocaleString('pt-PT')} <span className="text-sm font-semibold text-blue-400">impressões</span></span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block">Cliques / Conversões Diretas:</span>
              <span className="text-2xl font-black text-emerald-400">{estimatedClicks.toLocaleString('pt-PT')} <span className="text-sm font-semibold text-slate-300">visitas</span></span>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div>✓ Pagamento flexível com M-Pesa Corporativo</div>
              <div>✓ Relatório de desempenho em tempo real</div>
              <div>✓ Suporte dedicado do time comercial UBlue</div>
            </div>

            <button
              onClick={() => setIsNewCampaignModalOpen(true)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg cursor-pointer"
            >
              Lançar com Este Orçamento
            </button>
          </div>
        </div>
      )}

      {/* New Campaign Modal */}
      {isNewCampaignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-left">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#090d20] border border-blue-500/30 p-6 sm:p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-1">Criar Nova Campanha Corporativa</h3>
            <p className="text-xs text-slate-400 mb-5">Ativação rápida para empresas e marcas no ecossistema UBlue.</p>

            <form onSubmit={handleCreateCampaign} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Nome da Empresa / Marca:</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Ex: Coca-Cola Moçambique, Banco Comercial, etc."
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Título da Campanha:</label>
                <input
                  type="text"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  placeholder="Ex: Lançamento de Bebida Energética 2026"
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Orçamento (MT):</label>
                  <input
                    type="number"
                    value={calcBudget}
                    onChange={(e) => setCalcBudget(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2.5 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Método de Faturamento:</label>
                  <select className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2.5 text-white">
                    <option>M-Pesa Corporativo</option>
                    <option>E-Mola</option>
                    <option>Transferência Bancária (BIM/BCI/Standard)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 text-slate-300 text-[11px] space-y-1">
                <span className="font-bold text-white block">Previsão:</span>
                <div>Impressões estimadas: <strong className="text-cyan-400">{estimatedImpressions.toLocaleString('pt-PT')}</strong></div>
                <div>Cliques esperados: <strong className="text-emerald-400">{estimatedClicks.toLocaleString('pt-PT')}</strong></div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button type="submit" className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase cursor-pointer">
                  Confirmar e Ativar Campanha
                </button>
                <button type="button" onClick={() => setIsNewCampaignModalOpen(false)} className="py-3 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs cursor-pointer">
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
