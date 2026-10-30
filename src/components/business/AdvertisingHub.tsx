import React, { useState } from 'react';
import {
  Megaphone,
  Globe,
  FileText,
  DollarSign,
  TrendingUp,
  Video,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  Download,
  Building2,
  MapPin,
  Phone,
  Mail,
  Play,
  RotateCcw,
  Sparkles,
  BarChart3,
  Layers,
  Code2
} from 'lucide-react';
import {
  adNetworkEngine,
  UBLUE_RATE_CARD,
  SAMPLE_VIDEO_ADS,
  AdRateCardItem,
  VideoAdCreative
} from '../../engine/ad-network-engine';

interface AdvertisingHubProps {
  onBackToPortal?: () => void;
  onOpenWallet?: () => void;
}

export const AdvertisingHub: React.FC<AdvertisingHubProps> = ({
  onBackToPortal,
  onOpenWallet,
}) => {
  const [activeTab, setActiveTab] = useState<'institutional_adsense' | 'rate_card' | 'proposal_generator' | 'video_vast' | 'client_report'>('institutional_adsense');

  // AdSense & Legal state
  const [activeLegalSubTab, setActiveLegalSubTab] = useState<'about' | 'privacy' | 'terms' | 'contacts' | 'adsense_audit'>('adsense_audit');
  const [adsTxtCopied, setAdsTxtCopied] = useState(false);
  const adsTxtContent = adNetworkEngine.getAdsTxtContent();
  const complianceChecks = adNetworkEngine.runAdSenseComplianceAudit();

  // Rate card & Proposal state
  const [selectedFormat, setSelectedFormat] = useState<string>('preroll-15s');
  const [clientCompany, setClientCompany] = useState('Vodacom Moçambique, S.A.');
  const [clientNuit, setClientNuit] = useState('400192841');
  const [campaignWeeks, setCampaignWeeks] = useState(4);
  const [expectedImpressions, setExpectedImpressions] = useState(50000);
  const [proposalGenerated, setProposalGenerated] = useState(false);

  // Video Ad Player Demo state
  const [activeAdDemo, setActiveAdDemo] = useState<VideoAdCreative>(SAMPLE_VIDEO_ADS[0]);
  const [adSecondsRemaining, setAdSecondsRemaining] = useState(5);
  const [adCanSkip, setAdCanSkip] = useState(false);
  const [adPlaying, setAdPlaying] = useState(true);
  const [adSkipped, setAdSkipped] = useState(false);
  const [showVastXml, setShowVastXml] = useState(false);

  // Performance Report state
  const report = adNetworkEngine.getMockCampaignReport();

  const currentRateCard = UBLUE_RATE_CARD.find(r => r.id === selectedFormat) || UBLUE_RATE_CARD[0];
  const calculatedCostMT = Math.max(
    currentRateCard.minimumInvestmentMT,
    (expectedImpressions / 1000) * currentRateCard.pricePerThousandMT
  );

  const handleCopyAdsTxt = () => {
    navigator.clipboard?.writeText(adsTxtContent);
    setAdsTxtCopied(true);
    setTimeout(() => setAdsTxtCopied(false), 2000);
  };

  const handleRestartAdDemo = () => {
    setAdSkipped(false);
    setAdPlaying(true);
    setAdSecondsRemaining(5);
    setAdCanSkip(false);
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-950/60 to-purple-900/40 border border-blue-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                Fase 3 · Publicidade & Parcerias Comerciais
              </span>
              <span className="text-xs text-slate-400">Moçambique & Diáspora</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              UBlue Ad Network & Media Kit 2026
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Monetização independente e de alta performance: anúncios de vídeo VAST/VMAP no player, contratos diretos para empresas moçambicanas, páginas institucionais e conformidade total com o Google AdSense e Ad Manager.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('proposal_generator')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Gerar Fatura Proforma</span>
            </button>
            <button
              onClick={() => setActiveTab('video_vast')}
              className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Video className="w-4 h-4 text-emerald-400" />
              <span>Testar Player VAST</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'institutional_adsense', label: '1. Website & AdSense', icon: Globe },
          { id: 'rate_card', label: '2. Tabela de Preços (Rate Card)', icon: DollarSign },
          { id: 'proposal_generator', label: '3. Contrato de Patrocínio', icon: FileText },
          { id: 'video_vast', label: '4. Publicidade em Vídeo (VAST)', icon: Video },
          { id: 'client_report', label: '5. Relatório de Resultados', icon: BarChart3 },
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                active
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: WEBSITE UBLUE & ADSENSE COMPLIANCE */}
      {activeTab === 'institutional_adsense' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <span>Páginas Institucionais e Candidatura Google AdSense</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Requisitos essenciais para aprovação da conta AdSense da Universo Blue TV.
                </p>
              </div>

              {/* Sub-tabs */}
              <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                {[
                  { id: 'adsense_audit', label: 'Auditoria AdSense' },
                  { id: 'about', label: 'Sobre Nós' },
                  { id: 'privacy', label: 'Privacidade' },
                  { id: 'terms', label: 'Termos' },
                  { id: 'contacts', label: 'Contactos' },
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveLegalSubTab(sub.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeLegalSubTab === sub.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-tab: Auditoria AdSense */}
            {activeLegalSubTab === 'adsense_audit' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {complianceChecks.map(check => (
                    <div key={check.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{check.label}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{check.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Arquivo ads.txt Oficial */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-emerald-400" />
                      <span>Ficheiro Oficial /ads.txt</span>
                    </span>
                    <button
                      onClick={handleCopyAdsTxt}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white font-medium flex items-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{adsTxtCopied ? 'Copiado!' : 'Copiar ads.txt'}</span>
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-emerald-300 p-3 rounded-lg bg-black/60 border border-slate-800 overflow-x-auto">
                    {adsTxtContent}
                  </pre>
                  <p className="text-[11px] text-slate-400">
                    O ficheiro ads.txt declara a Universo Blue como vendedora direta autorizada de inventário para o Google e redes programáticas.
                  </p>
                </div>
              </div>
            )}

            {/* Sub-tab: Sobre Nós */}
            {activeLegalSubTab === 'about' && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300 leading-relaxed">
                <h4 className="text-sm font-bold text-white">Sobre a UBlue TV — Universo Blue Moçambique</h4>
                <p>
                  A <strong>UBlue TV</strong> é a principal plataforma de streaming e agregação de canais lineares de televisão e estações de rádio em Moçambique e no espaço da CPLP. Nascida com o propósito de democratizar o acesso à informação e à cultura lusófona, combinamos tecnologia de ponta, infraestrutura local com servidores de baixa latência e apoio incondicional aos criadores de conteúdo nacionais.
                </p>
                <p>
                  Oferecemos transmissões de notícias, música urbana, Marrabenta, desporto nacional e internacional, documentários e produções originais (UBlue Originals) com suporte ao inovador <strong>Modo Sem Megas</strong> subsidiado para utilizadores com pacotes ativos.
                </p>
              </div>
            )}

            {/* Sub-tab: Privacidade */}
            {activeLegalSubTab === 'privacy' && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300 leading-relaxed">
                <h4 className="text-sm font-bold text-white">Política de Privacidade e Proteção de Dados</h4>
                <p>
                  A Universo Blue compromete-se a respeitar e proteger a privacidade de todos os utilizadores. Os dados recolhidos (como número de telefone para autenticação M-Pesa/e-Mola e identificador anônimo de dispositivo) destinam-se exclusivamente à prestação de serviços de streaming, cobrança de assinaturas autorizadas e melhoria da experiência de navegação.
                </p>
                <p>
                  Não vendemos, partilhamos ou divulgamos informações pessoais a terceiros não autorizados. Todos os dados financeiros são processados diretamente através de canais bancários e gateways oficiais certificados pela Vodacom, Movitel, Tmcel e Rede SIMO.
                </p>
              </div>
            )}

            {/* Sub-tab: Termos */}
            {activeLegalSubTab === 'terms' && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300 leading-relaxed">
                <h4 className="text-sm font-bold text-white">Termos e Condições de Uso</h4>
                <p>
                  O acesso aos conteúdos da UBlue TV está sujeito aos planos de assinatura em vigor (Canais Livres 0 MT, UBlue Start 25 MT, Basic 100 MT, Médio 250 MT e Max 500 MT). A subscrição permite a utilização pessoal e intransferível nos dispositivos compatíveis cadastrados.
                </p>
                <p>
                  É expressamente proibida a retransmissão comercial não autorizada, gravação para fins lucrativos ou manipulação dos sinais protegidos por direitos autorais.
                </p>
              </div>
            )}

            {/* Sub-tab: Contactos */}
            {activeLegalSubTab === 'contacts' && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white">Sede UBlue Moçambique</h5>
                    <p className="text-slate-400 mt-0.5">Av. Julius Nyerere, Bairro Polana Cimento, Maputo, Moçambique</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white">Linha de Apoio & WhatsApp</h5>
                    <p className="text-slate-400 mt-0.5">+258 84 123 4567 / +258 86 987 6543</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white">Parcerias & Publicidade</h5>
                    <p className="text-slate-400 mt-0.5">comercial@ublue.tv / publicidade@universoblue.mz</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white">Registo Comercial & NUIT</h5>
                    <p className="text-slate-400 mt-0.5">NUIT: 400.918.231 · Conservatória do Registo de Maputo</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* TAB 2: TABELA DE PREÇOS (RATE CARD) */}
      {activeTab === 'rate_card' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">
              Tabela Oficial de Preços de Publicidade (Rate Card Moçambique 2026)
            </h3>
            <p className="text-xs text-slate-400">
              Formatos flexíveis para empresas moçambicanas com custos em Meticais (MT) calculados por CPM ou pacote mensal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {UBLUE_RATE_CARD.map(card => (
              <div
                key={card.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-1">
                    {card.durationOrSize}
                  </span>
                  <h4 className="font-bold text-white text-base">{card.formatName}</h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{card.description}</p>

                  <div className="mt-4 pt-3 border-t border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">CPM (por 1.000 visualizações):</span>
                      <span className="font-black text-emerald-400">{card.pricePerThousandMT} MT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Investimento Mínimo:</span>
                      <span className="font-bold text-white">{card.minimumInvestmentMT.toLocaleString()} MT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Alcance Estimado:</span>
                      <span className="text-cyan-300 font-semibold">{card.reachEstimate}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setSelectedFormat(card.id);
                      setActiveTab('proposal_generator');
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Simular este Formato</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CONTRATO DE PATROCÍNIO & FATURA PROFORMA */}
      {activeTab === 'proposal_generator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Form de Configuração da Campanha */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <span>Simulador de Proposta & Contrato de Patrocínio</span>
              </h3>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Empresa Anunciante (Moçambique):</label>
                <input
                  type="text"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">NUIT da Empresa:</label>
                <input
                  type="text"
                  value={clientNuit}
                  onChange={(e) => setClientNuit(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Formato Publicitário:</label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2.5 text-xs text-white"
                >
                  {UBLUE_RATE_CARD.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.formatName} ({r.pricePerThousandMT} MT CPM)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Meta de Impressões:</label>
                  <input
                    type="number"
                    step={5000}
                    value={expectedImpressions}
                    onChange={(e) => setExpectedImpressions(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2.5 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Duração (Semanas):</label>
                  <input
                    type="number"
                    min={1}
                    max={52}
                    value={campaignWeeks}
                    onChange={(e) => setCampaignWeeks(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2.5 text-xs text-white font-bold"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Total Proforma Estimado:</div>
                  <div className="text-[11px] text-slate-500">{expectedImpressions.toLocaleString()} impressões · {campaignWeeks} semanas</div>
                </div>
                <div className="text-2xl font-black text-emerald-400">
                  {calculatedCostMT.toLocaleString()} <span className="text-xs font-bold text-white">MT</span>
                </div>
              </div>

              <button
                onClick={() => setProposalGenerated(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Emitir Fatura Proforma e Minuta de Contrato</span>
              </button>
            </div>

            {/* Visualizador de Minuta de Contrato & Proforma */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between text-xs font-mono space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
                  <span className="font-bold text-white">FATURA PROFORMA & CONTRATO UBLUE TV</span>
                  <span className="text-emerald-400">PROFORMA-2026-MZ-89</span>
                </div>

                <div className="space-y-3 mt-4 text-slate-300">
                  <div className="p-3 rounded-lg bg-black/60 border border-slate-800 space-y-1">
                    <div><strong>FORNECEDOR:</strong> Universo Blue Televisão Digital, Lda</div>
                    <div><strong>NUIT:</strong> 400.918.231 · Maputo, Moçambique</div>
                    <div className="pt-2 border-t border-slate-800/80"><strong>CLIENTE ANUNCIANTE:</strong> {clientCompany}</div>
                    <div><strong>NUIT DO CLIENTE:</strong> {clientNuit}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-black/60 border border-slate-800 space-y-1">
                    <div><strong>FORMATO:</strong> {currentRateCard.formatName}</div>
                    <div><strong>VOLUME CONTRATADO:</strong> {expectedImpressions.toLocaleString()} Visualizações</div>
                    <div><strong>PERÍODO DE VEICULAÇÃO:</strong> {campaignWeeks} Semanas</div>
                    <div><strong>LOCALIZAÇÃO:</strong> 11 Províncias de Moçambique & Diáspora</div>
                  </div>

                  <div className="flex justify-between items-center text-sm font-bold text-white pt-2 border-t border-slate-800">
                    <span>VALOR TOTAL LÍQUIDO:</span>
                    <span className="text-emerald-400 text-base">{calculatedCostMT.toLocaleString()} MT</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Válido por 30 dias após emissão</span>
                <span className="text-cyan-300 font-bold">Autenticado com Assinatura Digital UBlue</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 4: PUBLICIDADE EM VÍDEO (VAST / VMAP) */}
      {activeTab === 'video_vast' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">
              Player Interativo de Publicidade em Vídeo (VAST 4.2 / VMAP)
            </h3>
            <p className="text-xs text-slate-400">
              Demonstração ao vivo de vídeo Pre-roll antes do início da transmissão com contagem regressiva e botão de pular aos 5s.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Simulador de Player com Anúncio Real */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="relative aspect-video rounded-xl bg-black overflow-hidden border border-slate-800 flex items-center justify-center">
                
                {/* Vídeo do Anúncio ou Conteúdo */}
                <video
                  key={activeAdDemo.videoUrl}
                  src={activeAdDemo.videoUrl}
                  autoPlay
                  muted
                  playsInline
                  loop={!adPlaying}
                  className="w-full h-full object-cover"
                />

                {/* Overlay do Anúncio em Execução */}
                {!adSkipped && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 p-4 flex flex-col justify-between pointer-events-none">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                        Anúncio · {activeAdDemo.durationSec}s
                      </span>
                      <span className="text-xs font-bold text-white drop-shadow">
                        {activeAdDemo.advertiser}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pointer-events-auto">
                      <div className="text-xs text-white">
                        <div className="font-bold">{activeAdDemo.campaignTitle}</div>
                        <a
                          href={activeAdDemo.clickThroughUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-cyan-400 underline hover:text-cyan-300"
                        >
                          {activeAdDemo.ctaText} →
                        </a>
                      </div>

                      <button
                        onClick={() => setAdSkipped(true)}
                        className="px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black text-white text-xs font-bold border border-white/20 transition-all cursor-pointer pointer-events-auto"
                      >
                        Pular Anúncio
                      </button>
                    </div>
                  </div>
                )}

                {/* Conteúdo após Anúncio */}
                {adSkipped && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
                    <div className="text-center text-white">
                      <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                      <div className="text-sm font-bold">Transmissão Principal UBlue TV em Direto</div>
                      <p className="text-xs text-slate-300 mt-1">Anúncio concluído com sucesso</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs">
                <button
                  onClick={handleRestartAdDemo}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Repetir Demonstração</span>
                </button>

                <button
                  onClick={() => setShowVastXml(!showVastXml)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{showVastXml ? 'Ocultar XML VAST' : 'Ver XML VAST 4.2'}</span>
                </button>
              </div>
            </div>

            {/* VAST 4.2 Code Inspector */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between font-mono text-xs">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400 mb-3">
                  <span className="font-bold text-white">XML VAST 4.2 (Gerado pelo AdEngine)</span>
                  <span className="text-cyan-400">IAB Standard Compliant</span>
                </div>
                <pre className="text-xs text-cyan-300/90 whitespace-pre-wrap overflow-x-auto p-3 rounded-xl bg-black/60 border border-slate-800/80 max-h-72 leading-relaxed">
                  {adNetworkEngine.generateVastXml(activeAdDemo)}
                </pre>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Google Ad Manager Ready</span>
                <span>Skip Offset: <strong>5 segundos</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: RELATÓRIO DE RESULTADOS PARA EMPRESAS */}
      {activeTab === 'client_report' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">
                Relatório de Performance de Campanha (Painel do Anunciante)
              </h3>
              <p className="text-xs text-slate-400">
                Cliente: <strong className="text-white">{report.clientName}</strong> · Período: {report.period}
              </p>
            </div>
            <button
              onClick={() => alert('Relatório analítico em PDF descarregado com sucesso.')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Relatório PDF</span>
            </button>
          </div>

          {/* KPIs Principais */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Total de Impressões</div>
              <div className="text-2xl font-black text-white mt-1">{report.totalImpressions.toLocaleString()}</div>
              <div className="text-[10px] text-emerald-400 mt-1">100% validadas por VAST</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Cliques no Anúncio</div>
              <div className="text-2xl font-black text-cyan-400 mt-1">{report.totalClicks.toLocaleString()}</div>
              <div className="text-[10px] text-cyan-400 mt-1">Redirecionados para oferta</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">CTR Médio (Taxa de Clique)</div>
              <div className="text-2xl font-black text-blue-400 mt-1">{report.averageCtr}%</div>
              <div className="text-[10px] text-blue-400 mt-1">2.4x superior à média web</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Taxa de Conclusão de Vídeo</div>
              <div className="text-2xl font-black text-purple-400 mt-1">{report.viewCompletionRate}%</div>
              <div className="text-[10px] text-purple-400 mt-1">Assistido até o final</div>
            </div>
          </div>

          {/* Distribuição por Províncias de Moçambique */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="font-bold text-white text-sm">
              Distribuição Geográfica de Visualizações (Províncias de Moçambique)
            </h4>
            <div className="space-y-3">
              {report.reachByProvince.map(prov => (
                <div key={prov.province} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-white">{prov.province}</span>
                    <span className="text-slate-400">{prov.impressions.toLocaleString()} visualizações ({prov.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                      style={{ width: `${prov.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
