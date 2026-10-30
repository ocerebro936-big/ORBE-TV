import React, { useState } from 'react';
import { OTT_TECHNICAL_SPEC, SqlTableDefinition, ApiEndpointSpec } from '../../data/ott-technical-spec';
import { UBLUE_WIREFRAME_SPECS } from '../../data/wireframe-spec-data';
import { Copy, Check, Download, FileText, Database, Code2, Network, ShieldCheck, ChevronRight, Layers, Smartphone, Tv, Globe, Shield } from 'lucide-react';

export const TechnicalDocumentViewer: React.FC = () => {
  const [selectedSubTab, setSelectedSubTab] = useState<'blueprint' | 'sql' | 'apis' | 'flows' | 'wireframes'>('blueprint');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleDownloadMarkdown = () => {
    let md = `# ${OTT_TECHNICAL_SPEC.title}\n\n`;
    md += `**Versão:** ${OTT_TECHNICAL_SPEC.version} | **Data:** ${new Date().toISOString().slice(0, 10)}\n\n`;
    md += `## 1. Resumo Executivo\n${OTT_TECHNICAL_SPEC.executiveSummary}\n\n`;
    
    md += `## 2. Media Plane — Transcoding Ladder Multi-Bitrate\n\n`;
    md += `| Resolução | Dimensões | Bitrate Vídeo | Bitrate Áudio | FPS | Codec | Segmento |\n`;
    md += `|---|---|---|---|---|---|---|\n`;
    OTT_TECHNICAL_SPEC.transcodingLadder.forEach(l => {
      md += `| ${l.resolution} | ${l.width}x${l.height} | ${l.videoBitrateKbps} kbps | ${l.audioBitrateKbps} kbps | ${l.fps} | ${l.codec} | ${l.chunkDurationSec}s |\n`;
    });

    md += `\n## 3. Control Plane — Esquema Relacional PostgreSQL\n\n`;
    OTT_TECHNICAL_SPEC.postgresTables.forEach(t => {
      md += `### Tabela: ${t.tableName}\n${t.description}\n\n\`\`\`sql\n${t.sqlDdl}\n\`\`\`\n\n`;
    });

    md += `## 4. Contratos de API RESTful & Webhooks M-Pesa / E-Mola\n\n`;
    OTT_TECHNICAL_SPEC.apiSpecs.forEach(api => {
      md += `### ${api.method} ${api.path}\n**Módulo:** ${api.module}\n**Sumário:** ${api.summary}\n\n\`\`\`json\n// Request\n${api.requestBody || 'N/A'}\n\n// Response\n${api.responseBody}\n\`\`\`\n\n`;
    });

    md += `## 5. Estratégia de POPs Moçambique\n\n`;
    OTT_TECHNICAL_SPEC.mozambiquePops.forEach(p => {
      md += `- **${p.popId} (${p.city}):** ${p.status.toUpperCase()} | Latência: ${p.latencyMs}ms | Largura: ${p.bandwidthGbps} Gbps | Peering: ${p.ispPeering.join(', ')}\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'UBLUE_TV_TECHNICAL_SPEC_V1.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Action Buttons */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-slate-950 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono font-semibold border border-blue-500/20 mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Documento Técnico Oficial v1.0.0-PROD</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Especificação de Engenharia e Arquitetura OTT
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Pronto para entrega e implementação por equipas de desenvolvimento backend (NestJS), mobile (Kotlin/Swift), data engineers e administradores de infraestrutura.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => handleCopy(JSON.stringify(OTT_TECHNICAL_SPEC, null, 2), 'full-json')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer shadow-sm"
          >
            {copiedSection === 'full-json' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>Copiar JSON</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Baixar .MD Completo</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setSelectedSubTab('blueprint')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            selectedSubTab === 'blueprint' ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Network className="w-4 h-4" />
          <span>1. Blueprint Geral (Media vs Control)</span>
        </button>

        <button
          onClick={() => setSelectedSubTab('sql')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            selectedSubTab === 'sql' ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>2. Schema PostgreSQL DDL ({OTT_TECHNICAL_SPEC.postgresTables.length} tabelas)</span>
        </button>

        <button
          onClick={() => setSelectedSubTab('apis')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            selectedSubTab === 'apis' ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>3. Contratos de APIs & Webhooks</span>
        </button>

        <button
          onClick={() => setSelectedSubTab('flows')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            selectedSubTab === 'flows' ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>4. Fluxos de Utilizadores & Segurança</span>
        </button>

        <button
          onClick={() => setSelectedSubTab('wireframes')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            selectedSubTab === 'wireframes' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-md shadow-cyan-500/30' : 'text-emerald-400 hover:text-white hover:bg-slate-900 border border-emerald-500/30'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>5. Wireframes UI/UX Tela por Tela (18 Telas)</span>
        </button>
      </div>

      {/* SubTab 1: Blueprint Geral */}
      {selectedSubTab === 'blueprint' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-base font-bold text-white mb-3">1. Desacoplamento Fundamental da Plataforma</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              Seguindo a referência das principais operadoras OTT globais (Netflix, Hulu, Oxagile, Forasoft), a ORBE TV separa rigorosamente os planos de dados e controlo para evitar que picos de tráfego de vídeo saturem as operações de pagamento e autenticação:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Media Plane Box */}
              <div className="p-5 rounded-xl bg-slate-950 border border-blue-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                  <h4 className="text-sm font-black text-blue-400 uppercase tracking-wider">Media Plane (Pipeline de Vídeo)</h4>
                </div>
                <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <li>• <strong>Ingest RTMP/SRT:</strong> Endpoints de baixa latência distribuídos para estúdios Be Universe e canais parceiros.</li>
                  <li>• <strong>Transcoder Multi-Bitrate:</strong> Cluster FFmpeg / GPU gerando perfis de 1080p (4.5Mbps) até 360p (600kbps) para economia de dados celulares.</li>
                  <li>• <strong>Packaging HLS & MPEG-DASH:</strong> Segmentação em chunks de 4 segundos com indexação contínua.</li>
                  <li>• <strong>Origin Storage & Edge CDN:</strong> Armazenamento S3/MinIO e distribuição via Cloudflare CDN com cache hit superior a 95%.</li>
                  <li>• <strong>Players Multiplataforma:</strong> Hls.js (Web), ExoPlayer (Android), AVPlayer (iOS) e Tizen/webOS (Smart TVs).</li>
                </ul>
              </div>

              {/* Control Plane Box */}
              <div className="p-5 rounded-xl bg-slate-950 border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                  <h4 className="text-sm font-black text-emerald-400 uppercase tracking-wider">Control Plane (Inteligência & Negócio)</h4>
                </div>
                <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <li>• <strong>Gestão de Identidade:</strong> Autenticação por SMS OTP e passwords com múltiplos perfis (Adulto e Kids com PIN).</li>
                  <li>• <strong>Motor de Assinaturas (SVOD):</strong> Gestão dos 5 pacotes com validação de ciclo e auto-renovação.</li>
                  <li>• <strong>Gateways Moçambicanos:</strong> STK Push e webhooks C2B/B2C para Vodacom M-Pesa e Movitel E-Mola.</li>
                  <li>• <strong>Entitlements & DRM:</strong> Emissão de tokens JWT assinados com verificação de IP e integridade de dispositivo.</li>
                  <li>• <strong>Motor de Publicidade (AVOD):</strong> Servidor VAST 4.2 / VMAP para anúncios pré-roll e mid-roll com métricas de impressão.</li>
                  <li>• <strong>Pay-Per-View (TVOD):</strong> Venda de bilhetes digitais e controle de lotação para concertos e eventos ao vivo.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Transcoder Ladder Table */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-base font-bold text-white mb-2">Transcoding Ladder Multi-Bitrate Oficial</h3>
            <p className="text-xs text-slate-400 mb-4">
              Configuração otimizada para o padrão de conectividade moçambicano (3G/4G/5G móvel e fibra residencial).
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">Resolução</th>
                    <th className="py-2.5 px-3">Dimensões</th>
                    <th className="py-2.5 px-3">Bitrate Vídeo</th>
                    <th className="py-2.5 px-3">Bitrate Áudio</th>
                    <th className="py-2.5 px-3">FPS</th>
                    <th className="py-2.5 px-3">Codec Profile</th>
                    <th className="py-2.5 px-3">Segmento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {OTT_TECHNICAL_SPEC.transcodingLadder.map((r) => (
                    <tr key={r.resolution} className="hover:bg-slate-800/30">
                      <td className="py-3 px-3 font-bold text-blue-400">{r.resolution}</td>
                      <td className="py-3 px-3">{r.width}x{r.height}</td>
                      <td className="py-3 px-3">{r.videoBitrateKbps} kbps</td>
                      <td className="py-3 px-3">{r.audioBitrateKbps} kbps</td>
                      <td className="py-3 px-3">{r.fps} fps</td>
                      <td className="py-3 px-3 text-cyan-300">{r.codec}</td>
                      <td className="py-3 px-3">{r.chunkDurationSec}s HLS</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 2: SQL DDL */}
      {selectedSubTab === 'sql' && (
        <div className="space-y-6">
          <p className="text-xs text-slate-300">
            Estrutura de banco de dados relacional (PostgreSQL 16) com índices otimizados para alta concorrência e integridade referencial:
          </p>

          <div className="space-y-4">
            {OTT_TECHNICAL_SPEC.postgresTables.map((t) => (
              <div key={t.tableName} className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <span className="font-mono font-bold text-white text-sm">{t.tableName}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(t.sqlDdl, t.tableName)}
                    className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
                  >
                    {copiedSection === t.tableName ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copiar DDL</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400 mb-3">{t.description}</p>
                
                <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto border border-slate-800/80 leading-relaxed">
                  {t.sqlDdl}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 3: APIs */}
      {selectedSubTab === 'apis' && (
        <div className="space-y-6">
          <p className="text-xs text-slate-300">
            Contratos RESTful / OpenAPI 3.0 documentando os pontos de entrada do API Gateway (NestJS):
          </p>

          <div className="space-y-4">
            {OTT_TECHNICAL_SPEC.apiSpecs.map((api, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      api.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {api.method}
                    </span>
                    <span className="font-mono text-xs font-bold text-white">{api.path}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                    {api.module}
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-200 mb-1">{api.summary}</div>
                <p className="text-xs text-slate-400 mb-3">{api.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  {api.requestBody && (
                    <div>
                      <div className="text-[10px] uppercase text-slate-500 mb-1">Request Payload:</div>
                      <pre className="p-3 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 overflow-x-auto">
                        {api.requestBody}
                      </pre>
                    </div>
                  )}
                  <div className={api.requestBody ? '' : 'md:col-span-2'}>
                    <div className="text-[10px] uppercase text-slate-500 mb-1">Response (200 OK):</div>
                    <pre className="p-3 rounded-lg bg-slate-950 text-emerald-400 border border-slate-800 overflow-x-auto">
                      {api.responseBody}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 4: User Flows */}
      {selectedSubTab === 'flows' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-base font-bold text-white mb-2">Fluxos Críticos de Utilizadores</h3>
            <p className="text-xs text-slate-300 mb-4">
              Mapeamento sequencial dos principais caminhos de conversão e consumo no aplicativo e website:
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-bold text-blue-400 mb-1">A. Fluxo de Registo e Onboarding com Número Moçambique</div>
                <div className="font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre overflow-x-auto">
{`1. Utilizador introduz número de telemóvel (+258 84/85/86/87/82)
2. Backend valida formato nacional e despacha SMS com OTP de 6 dígitos
3. Utilizador insere OTP no modal de login
4. Sistema autentica, cria token JWT de sessão e perfil padrão
5. Acesso imediato aos Canais Livres (0 MT)`}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-bold text-emerald-400 mb-1">B. Fluxo de Subscrição SVOD com M-Pesa / E-Mola STK Push</div>
                <div className="font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre overflow-x-auto">
{`1. Utilizador seleciona pacote (ex: ORBE Basic - 100 MT)
2. Sistema chama API M-Pesa C2B com o MSISDN e referência única
3. Telemóvel do assinante exibe prompt nativo da Vodacom: "Inserir PIN M-Pesa para autorizar 100 MT a ORBE TV"
4. Utilizador introduz o PIN e Vodacom confirma transação
5. Webhook instantâneo recebido em /api/v1/payments/webhooks/mpesa-callback
6. Subscrição ativada no PostgreSQL e cache Redis limpo
7. Canais HD desbloqueados sem refresh do app`}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-bold text-amber-400 mb-1">C. Fluxo de Player com Verificação de Direitos (Entitlements) & AVOD</div>
                <div className="font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre overflow-x-auto">
{`1. Player solicita /api/v1/streams/{channelId}/playback-token
2. Control Plane valida validade da assinatura no Redis (< 2ms)
3. Se o canal requer anúncio (AVOD), o player carrega o pré-roll VAST 4.2
4. Inicia reprodução da playlist HLS master.m3u8 via Cloudflare CDN
5. Algoritmo ABR do player adapta resolução dinamicamente (1080p -> 720p -> 480p)`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 5: Wireframes UI/UX Tela por Tela */}
      {selectedSubTab === 'wireframes' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-slate-950 border border-blue-500/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
                18 Telas Mapeadas • 4 Plataformas
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Especificação Mestre de Wireframes e Arquitetura de Informação
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Estrutura wireframe tela por tela para orientar diretamente as equipas de Design de Interfaces (Figma) e Engenharia Frontend (React / Kotlin / Swift / Android TV).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Website */}
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <h4 className="font-bold text-white text-sm">1. Website & Portal Web</h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">5 Telas</span>
              </div>
              <ul className="text-xs space-y-1.5 text-slate-300">
                <li>• <strong>WEB-01:</strong> Portal Principal & Landing Page</li>
                <li>• <strong>WEB-02:</strong> Web Player Ao Vivo & Catch-Up TV (75/25 split)</li>
                <li>• <strong>WEB-03:</strong> Catálogo VOD & Filtros Avançados</li>
                <li>• <strong>WEB-04:</strong> Checkout M-Pesa / E-Mola USSD Push (60s)</li>
                <li>• <strong>WEB-05:</strong> Painel do Utilizador & Sessões Conectadas</li>
              </ul>
            </div>

            {/* 2. Admin Console */}
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-bold text-white text-sm">2. Painel Admin (Control Plane)</h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">5 Telas</span>
              </div>
              <ul className="text-xs space-y-1.5 text-slate-300">
                <li>• <strong>ADM-01:</strong> Executive Dashboard & NOC Streaming (CCU + CDN Gbps)</li>
                <li>• <strong>ADM-02:</strong> Gestão de Ingestão de Canais & Transcoding Ladder</li>
                <li>• <strong>ADM-03:</strong> Gestão de Assinantes & RBAC Multi-Papéis</li>
                <li>• <strong>ADM-04:</strong> Financeiro & Reconciliação M-Pesa / E-Mola</li>
                <li>• <strong>ADM-05:</strong> Servidor de Anúncios AVOD (VAST 4.2 / VMAP)</li>
              </ul>
            </div>

            {/* 3. Mobile Apps */}
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-cyan-400" />
                  <h4 className="font-bold text-white text-sm">3. Aplicação Mobile (Android & iOS)</h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">5 Telas</span>
              </div>
              <ul className="text-xs space-y-1.5 text-slate-300">
                <li>• <strong>MOB-01:</strong> Início (Home Feed 9:16 + Top 10 Moçambique)</li>
                <li>• <strong>MOB-02:</strong> TV Ao Vivo & Mini-Player com Rotação Automática</li>
                <li>• <strong>MOB-03:</strong> Ficha de Conteúdo VOD & Download Offline Encriptado</li>
                <li>• <strong>MOB-04:</strong> Rádios FM Moçambique & Podcasts Locais</li>
                <li>• <strong>MOB-05:</strong> Perfil, Gestão de Armazenamento & 1-Tap M-Pesa</li>
              </ul>
            </div>

            {/* 4. Smart TV */}
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tv className="w-5 h-5 text-amber-400" />
                  <h4 className="font-bold text-white text-sm">4. Smart TV (10-Foot UI)</h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">4 Telas + Remoto</span>
              </div>
              <ul className="text-xs space-y-1.5 text-slate-300">
                <li>• <strong>TV-01:</strong> Ecrã Inicial 10-Foot (Navegação D-Pad com anel de foco)</li>
                <li>• <strong>TV-02:</strong> Guia de Programação EPG em Grade Síncrona</li>
                <li>• <strong>TV-03:</strong> Player Smart TV Modo Cinema & OSD Remoto</li>
                <li>• <strong>TV-04:</strong> Hub de Canais & Categorias com Atalhos Numéricos</li>
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
