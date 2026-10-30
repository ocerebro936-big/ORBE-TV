import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Globe2, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  Server, 
  Tv, 
  Download, 
  Printer, 
  Award, 
  ExternalLink, 
  Handshake, 
  Sparkles, 
  Clock, 
  DollarSign, 
  Cpu, 
  Building2, 
  Send,
  PenTool
} from 'lucide-react';

interface GlobalPartnershipProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPartner?: 'google' | 'akamai' | 'cloudflare' | 'telecoms';
}

export const GlobalPartnershipProposalModal: React.FC<GlobalPartnershipProposalModalProps> = ({
  isOpen,
  onClose,
  targetPartner = 'google'
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'architecture' | 'monetization' | 'sla' | 'mou'>('summary');
  const [partnerType, setPartnerType] = useState<'google' | 'akamai' | 'cloudflare' | 'telecoms'>(targetPartner);
  const [signerName, setSignerName] = useState('Eng. Direção Executiva UBlue');
  const [signerRole, setSignerRole] = useState('Chief Technology & Operations Officer');
  const [isSigned, setIsSigned] = useState(false);
  const [signedTimestamp, setSignedTimestamp] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignMoU = () => {
    setIsSigned(true);
    setSignedTimestamp(new Date().toLocaleString('pt-MZ'));
  };

  const handlePrintDocument = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-blue-900/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Document Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Handshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-800/40">
                  DOCUMENTO CORPORATIVO CONFIDENCIAL
                </span>
                <span className="text-xs text-slate-400">Ref: UBLUE-PROP-2026/GBL-01</span>
              </div>
              <h2 className="text-lg font-black text-white tracking-tight">
                PILAR 2: Proposta Comercial de Parceria Estratégica Global
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintDocument}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              title="Imprimir ou Salvar em PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Partner Select Pills */}
        <div className="bg-slate-950/80 px-6 py-3 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Parceiro Alvo da Proposta:</span>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'google', name: 'Google (Cloud & Ad Manager)', icon: Building2 },
                { id: 'akamai', name: 'Akamai Technologies', icon: Globe2 },
                { id: 'cloudflare', name: 'Cloudflare Edge CDN', icon: Server },
                { id: 'telecoms', name: 'Telecoms (Vodacom / Movitel / Tmcel)', icon: Cpu }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPartnerType(p.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors ${
                    partnerType === p.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <p.icon className="w-3.5 h-3.5" />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-cyan-400 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5" />
            <span>Validade: 24 Meses (África Austral & Global)</span>
          </div>
        </div>

        {/* Document Navigation Tabs */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-900/60 overflow-x-auto">
          {[
            { id: 'summary', label: '1. Resumo Executivo', icon: FileText },
            { id: 'architecture', label: '2. Arquitetura CDN & Peering', icon: Server },
            { id: 'monetization', label: '3. Monetização SSAI & Ad Manager', icon: DollarSign },
            { id: 'sla', label: '4. SLA & Resiliência 99.99%', icon: ShieldCheck },
            { id: 'mou', label: '5. Minuta MoU & Assinatura', icon: PenTool }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 border-b-2 ${
                activeTab === tab.id
                  ? 'border-cyan-400 text-cyan-300 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Document Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-slate-300 text-sm leading-relaxed">
          
          {/* TAB 1: EXECUTIVE SUMMARY */}
          {activeTab === 'summary' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-cyan-950/20 to-slate-900 border border-cyan-500/30">
                <h3 className="text-base font-black text-white flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span>Visão Estratégica: Liderança no Streaming Africano e Fast TV Lusófona</span>
                </h3>
                <p className="text-xs text-slate-300">
                  O ecossistema <strong>Universo Blue (UBlue TV)</strong> foi concebido para resolver a principal barreira de consumo de streaming no Sul da África: a combinação de alto custo de dados móveis com a carência de conteúdo local e internacional linear em canais gratuitos (FAST) e micro-pacotes acessíveis (M-Pesa / e-Mola).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <div className="text-cyan-400 font-black text-2xl mb-1">3.5M+</div>
                  <div className="text-xs font-bold text-white">Audiência Endereçável</div>
                  <div className="text-[11px] text-slate-400 mt-1">População conectada com smartphones e Smart TVs em Moçambique e diáspora.</div>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <div className="text-emerald-400 font-black text-2xl mb-1">&lt; 350 MB/h</div>
                  <div className="text-xs font-bold text-white">Consumo Otimizado HLS</div>
                  <div className="text-[11px] text-slate-400 mt-1">Transcodificação adaptativa H.264/H.265 com economia agressiva de pacotes.</div>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <div className="text-indigo-400 font-black text-2xl mb-1">94%</div>
                  <div className="text-xs font-bold text-white">Penetração Mobile Money</div>
                  <div className="text-[11px] text-slate-400 mt-1">Cobrança instantânea via M-Pesa e e-Mola sem necessidade de cartão de crédito.</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-300">
                  Proposta de Valor Para o Parceiro ({partnerType.toUpperCase()})
                </h4>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>Volume de Tráfego de Alta Fidelidade:</strong> Mais de 12 Petabytes projetados de tráfego de vídeo distribuído no primeiro ciclo de expansão.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>Monetização Programática Exclusiva:</strong> Inventário de publicidade de vídeo pré-roll e mid-roll com fill rate garantido via Google Ad Manager 360 e Open Bidding.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>Eficiência Operacional Extrema:</strong> Peering direto no MOZIX e servidores de borda (Edge PoP) que reduzem o custo de trânsito internacional das operadoras parceiras.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: TECHNICAL ARCHITECTURE & PEERING */}
          {activeTab === 'architecture' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Server className="w-5 h-5 text-cyan-400" />
                  <span>Topologia de Distribuição: Origin Shield + Edge Caching Local</span>
                </h3>
                <p className="text-xs text-slate-300">
                  Para contornar as rotas de trânsito marítimo submarino de alto custo (cabos SEACOM, EASSy e 2Africa), a UBlue TV propõe uma arquitetura mista com <strong>Origin Shield na Europa/GCP</strong> e <strong>Edge PoPs distribuídos em Moçambique (Maputo, Beira e Nampula)</strong>.
                </p>

                {/* Architecture ASCII diagram */}
                <div className="bg-black/60 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto leading-relaxed">
{` [ Fontes de Ingestão SRT / RTMP / HLS ]
                 │
                 ▼
  [ UBlue Origin Shield & Transcoder ] (GCP / Equinix)
                 │
                 ▼
     [ Global Edge CDN Tier ] (Google Cloud CDN / Akamai / Cloudflare)
                 │
      ┌──────────┴──────────┐
      ▼                     ▼
 [ Edge PoP Maputo ]   [ Edge PoP Beira & Nampula ]
 (Peering MOZIX)       (Peering Telecoms Locais)
      │                     │
      └──────────┬──────────┘
                 ▼
  [ 3.5M+ Dispositivos Finais: Smart TV, Android, Web, iOS ]`}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-1.5 text-cyan-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>Cache Hit Ratio Superior a 93%</span>
                  </h4>
                  <p className="text-slate-400">
                    Playlists HLS `.m3u8` e segmentos de vídeo `.ts`/`.m4s` armazenados em memória rápida nos nós de borda mais próximos dos utilizadores, eliminando o tráfego repetido e reduzindo a latência para menos de 28ms.
                  </p>
                </div>

                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Proteção DDoS e Mascaramento de Origem</span>
                  </h4>
                  <p className="text-slate-400">
                    Nenhum cliente se conecta diretamente ao servidor de ingestão original. Todos os acessos passam pelo filtro Web Application Firewall (WAF) e pelo proxy reverso CORS inteligente da UBlue.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SSAI MONETIZATION & GOOGLE AD MANAGER */}
          {activeTab === 'monetization' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span>Inserção Dinâmica de Publicidade no Servidor (SSAI)</span>
                </h3>
                <p className="text-xs text-slate-300">
                  A publicidade é costurada diretamente no fluxo de vídeo HLS no lado do servidor (Server-Side Ad Insertion) através de marcadores SCTE-35. Isso impede o bloqueio por AdBlockers e garante experiência contínua sem quebras de buffering entre a programação e os anúncios.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs mt-3">
                  <div className="bg-black/50 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">CPM Estimado Médio</span>
                    <span className="text-xl font-black text-emerald-400">$4.50 – $12.00</span>
                    <span className="text-[10px] text-slate-500 block mt-1">Dólares USD por 1.000 visualizações</span>
                  </div>

                  <div className="bg-black/50 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Modelo de Partilha (RevShare)</span>
                    <span className="text-xl font-black text-cyan-400">70% / 30%</span>
                    <span className="text-[10px] text-slate-500 block mt-1">70% Plataforma / 30% Parceiro Global</span>
                  </div>

                  <div className="bg-black/50 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Formatos VAST / VMAP</span>
                    <span className="text-xl font-black text-indigo-400">VAST 4.2</span>
                    <span className="text-[10px] text-slate-500 block mt-1">Pre-Roll, Mid-Roll e Bumpers</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <h4 className="font-bold text-white text-cyan-300">Integração com Google Ad Manager (GAM 360)</h4>
                <p className="text-slate-400">
                  Ativação de <strong>Open Bidding</strong> com anunciantes internacionais e marcas regionais de Moçambique (bancos, seguradoras, bens de consumo, cervejeiras, telecomunicações). Leilão em tempo real de milissegundos com renderização instantânea no player da Smart TV.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: SLA & 99.99% RESILIENCE */}
          {activeTab === 'sla' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <span>Garantia de Disponibilidade & Acordo de Nível de Serviço (SLA)</span>
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Parâmetro de Desempenho</th>
                        <th className="py-2.5 px-3">Meta Contratual UBlue</th>
                        <th className="py-2.5 px-3">Ação de Contingência</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      <tr>
                        <td className="py-3 px-3 font-semibold text-white">Disponibilidade de Sinal (Uptime)</td>
                        <td className="py-3 px-3 text-emerald-400 font-bold">99.99% (Four Nines)</td>
                        <td className="py-3 px-3 text-slate-400">Failover para CDN secundária em &lt; 1.2s</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-semibold text-white">Latência de Primeiro Frame (TTFB)</td>
                        <td className="py-3 px-3 text-cyan-400 font-bold">&lt; 180 ms</td>
                        <td className="py-3 px-3 text-slate-400">Pré-aquecimento de conexões no proxy</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-semibold text-white">Taxa de Rebuffering</td>
                        <td className="py-3 px-3 text-indigo-400 font-bold">&lt; 0.4% das sessões</td>
                        <td className="py-3 px-3 text-slate-400">Degradação automática para ABR 480p</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-semibold text-white">Retenção de Certificados SSL/CORS</td>
                        <td className="py-3 px-3 text-emerald-400 font-bold">100% Sempre Ativo</td>
                        <td className="py-3 px-3 text-slate-400">Proxy Inversor de Cabeçalhos local</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FORMAL MOU & DIGITAL SIGNATURE */}
          {activeTab === 'mou' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 font-serif text-slate-300 text-xs leading-relaxed">
                <div className="text-center pb-4 border-b border-slate-800 font-sans">
                  <h3 className="text-base font-black text-white tracking-wide uppercase">
                    Memorando de Entendimento e Parceria Tecnológica (MoU)
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Entre <strong>Universo Blue, Lda. (UBlue TV)</strong> e <strong>{partnerType.toUpperCase()} Inc. / Associadas</strong>
                  </p>
                </div>

                <p>
                  <strong>CLÁUSULA 1ª (OBJECTO):</strong> O presente instrumento estabelece os termos de cooperação técnica e comercial para a prestação de serviços de aceleração de conteúdo digital (CDN), co-locação de nós de borda (Edge PoP) e intermediação de publicidade digital em vídeo (SSAI/CSAI).
                </p>

                <p>
                  <strong>CLÁUSULA 2ª (OBRIGAÇÕES DE REDE):</strong> O Parceiro compromete-se a fornecer conectividade de alta disponibilidade (99.99%) e suporte a tráfego multi-bitrate HLS (.m3u8). A UBlue TV compromete-se a manter o tráfego originado em conformidade com as diretrizes de segurança, sem transmissões não licenciadas.
                </p>

                <p>
                  <strong>CLÁUSULA 3ª (CONFIDENCIALIDADE & PRAZO):</strong> As partes obrigam-se a manter estrita confidencialidade sobre métricas comerciais e dados de utilizadores pelo período de vigência de 24 (vinte e quatro) meses, renovável automaticamente.
                </p>
              </div>

              {/* Digital Signature Box */}
              <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <PenTool className="w-4 h-4 text-cyan-400" />
                    <span>Assinatura Digital & Carimbo de Integridade SHA-256</span>
                  </div>
                  {isSigned && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Formalmente Assinado</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  <div>
                    <label className="text-slate-400 block mb-1">Nome do Signatário Oficial</label>
                    <input
                      type="text"
                      value={signerName}
                      disabled={isSigned}
                      onChange={(e) => setSignerName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Cargo / Representação</label>
                    <input
                      type="text"
                      value={signerRole}
                      disabled={isSigned}
                      onChange={(e) => setSignerRole(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white disabled:opacity-60"
                    />
                  </div>
                </div>

                {isSigned ? (
                  <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl font-mono text-xs text-emerald-300 space-y-1">
                    <div className="font-bold flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-400" />
                      <span>Certificado Digital UBlue Trust Network emitido com sucesso</span>
                    </div>
                    <div className="text-[11px] text-emerald-400/80">
                      Signatário: {signerName} ({signerRole})
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Timestamp: {signedTimestamp} · Hash: e7f9b8c3a21d04e5a987c6b5d4e3f2a1
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSignMoU}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
                    >
                      <PenTool className="w-4 h-4" />
                      <span>Apor Assinatura Digital no Acordo</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Documento em formato padrão para submissão a comitês executivos de infraestrutura.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintDocument}
              className="px-4 py-2 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Exportar PDF / Imprimir</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              Concluir Revisão
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
