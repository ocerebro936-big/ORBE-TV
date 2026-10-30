import React, { useState } from 'react';
import { OTT_TECHNICAL_SPEC } from '../../data/ott-technical-spec';
import { MozPopTelemetry } from '../../types/ott-architecture';
import { Server, Activity, Globe2, Shield, Database, HardDrive, Cpu, Radio, Zap, CheckCircle2 } from 'lucide-react';

export const InfrastructurePopsStudio: React.FC = () => {
  const [pops, setPops] = useState<MozPopTelemetry[]>(OTT_TECHNICAL_SPEC.mozambiquePops);
  const [selectedPop, setSelectedPop] = useState<MozPopTelemetry>(pops[0]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-slate-950 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono font-semibold border border-blue-500/20 mb-2">
            <Server className="w-3.5 h-3.5" />
            <span>Infraestrutura Nuvem & Topologia de POPs Moçambique</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Edge CDN & POPs Roadmap (Fase 1 &rarr; 2 &rarr; 3)</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Estratégia híbrida: Cloudflare Global CDN + Cluster de Transcodificação Hetzner/AWS na Fase 1, evoluindo para Pontos de Presença (POPs) no MOZ-IX em Maputo, Beira e Nampula na Fase 2 e peering direto com ISPs na Fase 3.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-emerald-400 text-xs font-mono font-bold border border-slate-700">
            96.4% Cache Hit Ratio Global
          </span>
        </div>
      </div>

      {/* Observability Metrics (Prometheus / Grafana Live Simulator) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Egress CDN Total</span>
            <Activity className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">14.8 Gbps</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1">● 98.2% via Edge Cache</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Rebuffering Rate</span>
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono">0.32%</div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">&lt; 0.5% Meta SLA OTT</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Latência Média Maputo</span>
            <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-cyan-400 font-mono">12 ms</div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">MOZ-IX Peering Local</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Cluster Transcode</span>
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-black text-purple-400 font-mono">4 Nós Ativos</div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">0% Frame Drops</div>
        </div>
      </div>

      {/* Mozambique POPs Interactive Explorer */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-cyan-400" />
          <span>Presença de Rede em Moçambique (POPs Locais)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pops.map((p) => {
            const isSelected = selectedPop.popId === p.popId;
            return (
              <div
                key={p.popId}
                onClick={() => setSelectedPop(p)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-950/60 border-blue-500 shadow-lg shadow-blue-900/30'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-white">{p.city}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    p.status === 'operational'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : p.status === 'deploying'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {p.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-slate-400 font-mono text-[11px]">{p.popId}</div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                    <span className="text-slate-500">Latência:</span>
                    <span className="font-mono text-cyan-300">{p.latencyMs} ms</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Capacidade:</span>
                    <span className="font-mono text-white">{p.bandwidthGbps} Gbps</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Assinantes:</span>
                    <span className="font-mono text-emerald-400">{p.connectedSubscribers.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected POP Detail */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
          <div className="font-bold text-white flex items-center justify-between">
            <span>Interconexões e Peering de {selectedPop.city} ({selectedPop.popId}):</span>
            <span className="text-blue-400 font-mono">{selectedPop.phase}</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {selectedPop.ispPeering.map((isp) => (
              <span key={isp} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-mono">
                {isp}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Cloud & Backend Stack Diagram */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Server className="w-4 h-4 text-blue-400" />
          <span>Matriz de Serviços de Infraestrutura Inicial</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 font-bold text-cyan-300 mb-1">
              <Globe2 className="w-4 h-4" />
              <span>Edge CDN & WAF (Cloudflare)</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              DNS Anycast com terminação SSL rápida, mitigação DDoS de Camada 7, caching agressivo de segmentos `.ts` e Workers para validação de JWT na borda.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 font-bold text-blue-300 mb-1">
              <Cpu className="w-4 h-4" />
              <span>Transcode & Origin (Hetzner / AWS)</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Servidores dedicados com GPUs NVIDIA para codificação simultânea de múltiplos canais 24/7 com baixíssimo custo por gigabit transmitido.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 font-bold text-emerald-300 mb-1">
              <Database className="w-4 h-4" />
              <span>Bancos de Dados (PostgreSQL + Redis)</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              PostgreSQL 16 com replicação para leituras rápidas, e Redis Cluster em memória para cache de sessões de utilizadores e EPG em tempo real.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 font-bold text-purple-300 mb-1">
              <Server className="w-4 h-4" />
              <span>Backend (Node.js NestJS Microservices)</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Microserviços modulares com API Gateway, autenticação JWT, integração com gateways Vodacom/Movitel e filas RabbitMQ para transcodificação assíncrona.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 font-bold text-amber-300 mb-1">
              <Radio className="w-4 h-4" />
              <span>Motor de Pesquisa (OpenSearch)</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Indexação de catálogo completo de canais, artistas Be Universe, notícias e episódios com pesquisa instantânea e autocompletion sem latência.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 font-bold text-pink-300 mb-1">
              <Activity className="w-4 h-4" />
              <span>Observabilidade (Grafana + Elastic)</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Métricas de QoE em tempo real enviadas pelos players dos telemóveis (rebuffering, bitrate switches) e rastreamento de erros de pagamento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
