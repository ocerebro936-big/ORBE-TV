import React from 'react';
import { 
  Activity, Users, DollarSign, Radio, Server, ShieldCheck, 
  AlertTriangle, Search, Filter, Download, Plus, Play, Pause, 
  RefreshCw, CheckCircle2, ChevronRight, Layers, PieChart, BarChart3,
  ExternalLink, Key, Clock, Settings, Wifi
} from 'lucide-react';

interface AdminScreenProps {
  screenId: string;
  isSchematicMode: boolean;
}

export const AdminScreens: React.FC<AdminScreenProps> = ({ screenId, isSchematicMode }) => {
  // Screen 1: ADM-01 Executive Dashboard & NOC
  if (screenId === 'adm-dashboard') {
    return (
      <div className={`w-full rounded-xl overflow-hidden border ${isSchematicMode ? 'bg-slate-950 border-dashed border-emerald-500/50' : 'bg-[#040714] border-slate-800'} text-slate-100 font-sans p-6 space-y-6`}>
        {isSchematicMode && (
          <div className="bg-emerald-950/80 px-4 py-1.5 rounded border border-emerald-500/30 flex items-center justify-between text-[11px] font-mono text-emerald-300">
            <span>[ZONE: NOC_EXECUTIVE_DASHBOARD] Realtime CCU + M-Pesa Inflow + Edge POP Health</span>
            <span className="bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30">TELEMETRY 3s WEBSOCKET</span>
          </div>
        )}

        {/* 4 KPI Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Receita M-Pesa / E-Mola Hoje</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">148.250 MT</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
              <span>↑ +18.4% vs ontem</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Espectadores Ao Vivo (CCU)</span>
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-blue-400 font-mono">24.890</div>
            <div className="text-[10px] text-blue-400 flex items-center gap-1 font-mono">
              <span>Pico no Canal 01 UBlue</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Consumo CDN Edge Total</span>
              <Wifi className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">42.8 Gbps</div>
            <div className="text-[10px] text-slate-400 font-mono">
              <span>Cache Hit Ratio: 97.4%</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Subscritores Ativos Pagantes</span>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">18.420</div>
            <div className="text-[10px] text-slate-400 font-mono">
              <span>+320 novos hoje</span>
            </div>
          </div>
        </div>

        {/* Realtime POP Status Cards */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-blue-400" />
              <span>Estado dos Edge POPs Locais Moçambique</span>
            </h4>
            <span className="text-[10px] text-emerald-400 font-mono">Todos os nós operacionais</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-white">POP Maputo (Principal)</p>
                <p className="text-[10px] text-slate-400">TDM-Vodacom Peering</p>
              </div>
              <div className="text-right">
                <span className="text-emerald-400 font-mono font-bold">8ms</span>
                <p className="text-[9px] text-slate-400">18.4 Gbps</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-white">POP Beira (Centro)</p>
                <p className="text-[10px] text-slate-400">Movitel-TDM Backbone</p>
              </div>
              <div className="text-right">
                <span className="text-emerald-400 font-mono font-bold">14ms</span>
                <p className="text-[9px] text-slate-400">12.1 Gbps</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-white">POP Nampula (Norte)</p>
                <p className="text-[10px] text-slate-400">Edge Cache Local</p>
              </div>
              <div className="text-right">
                <span className="text-emerald-400 font-mono font-bold">21ms</span>
                <p className="text-[9px] text-slate-400">8.6 Gbps</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Screen 2: ADM-02 Gestão de Canais & Transcoding Ladder
  if (screenId === 'adm-content-manager') {
    return (
      <div className={`w-full rounded-xl overflow-hidden border ${isSchematicMode ? 'bg-slate-950 border-dashed border-cyan-500/50' : 'bg-[#040714] border-slate-800'} text-slate-100 font-sans p-6 space-y-6`}>
        {isSchematicMode && (
          <div className="bg-cyan-950/80 px-4 py-1.5 rounded border border-cyan-500/30 flex items-center justify-between text-[11px] font-mono text-cyan-300">
            <span>[ZONE: CHANNEL_TRANSCODING_ORCHESTRATOR] Multi-Bitrate Ingestion RTMP/SRT • HLS Segments</span>
            <span className="bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-400/30">FFMPEG LADDER</span>
          </div>
        )}

        {/* Action Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Canais Lineares 24/7 & Ingestão de Vídeo</h3>
            <p className="text-xs text-slate-400">Gerir pontos de entrada RTMP, chaves de transmissão e perfis multi-bitrate</p>
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Novo Canal</span>
          </button>
        </div>

        {/* Channel Ingest Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Canal</th>
                <th className="py-2.5 px-4">Protocolo / URL</th>
                <th className="py-2.5 px-4">Ladder Transcoding</th>
                <th className="py-2.5 px-4">Estado</th>
                <th className="py-2.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              <tr className="hover:bg-slate-900/40">
                <td className="py-3 px-4 flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center font-bold text-white text-[10px]">
                    01
                  </div>
                  <div>
                    <p className="font-bold text-white">UBlue TV Oficial</p>
                    <p className="text-[10px] text-slate-400">Canal Principal</p>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                  rtmp://live.ubluetv.com/app/stream_key_ub01
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-300">
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800">1080p</span>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800">720p</span>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800">480p</span>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800">360p</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    ONLINE (60fps)
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button className="text-blue-400 hover:text-white font-semibold">Editar</button>
                  <button className="text-slate-400 hover:text-white">Logs</button>
                </td>
              </tr>

              <tr className="hover:bg-slate-900/40">
                <td className="py-3 px-4 flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-amber-600 flex items-center justify-center font-bold text-white text-[10px]">
                    02
                  </div>
                  <div>
                    <p className="font-bold text-white">Be Universe Live Stage</p>
                    <p className="text-[10px] text-slate-400">Talent Shows & Reality</p>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                  srt://live.ubluetv.com:9000?streamid=be_live
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-300">
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800">1080p</span>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800">720p</span>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800">480p</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    ONLINE (30fps)
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button className="text-blue-400 hover:text-white font-semibold">Editar</button>
                  <button className="text-slate-400 hover:text-white">Logs</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Screen 3: ADM-03 Gestão de Utilizadores & RBAC
  if (screenId === 'adm-users-rbac') {
    return (
      <div className={`w-full rounded-xl overflow-hidden border ${isSchematicMode ? 'bg-slate-950 border-dashed border-blue-500/50' : 'bg-[#040714] border-slate-800'} text-slate-100 font-sans p-6 space-y-6`}>
        {isSchematicMode && (
          <div className="bg-blue-950/80 px-4 py-1.5 rounded border border-blue-500/30 flex items-center justify-between text-[11px] font-mono text-blue-300">
            <span>[ZONE: SUBSCRIBERS_RBAC_ADMIN] Search by Phone (+258) • Tier Overrides • Sessions</span>
            <span className="bg-blue-500/20 px-2 py-0.5 rounded border border-blue-400/30">AUDIT LOGS ACTIVE</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar por telefone (+258) ou email..."
              className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Filtrar Pacote:</span>
            <select className="bg-slate-950 border border-slate-700 text-xs rounded-lg px-2 py-1 text-slate-200">
              <option>Todos os Planos</option>
              <option>Livre (0 MT)</option>
              <option>Basic (100 MT)</option>
              <option>Médio (250 MT)</option>
              <option>Max (500 MT)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Utilizador</th>
                <th className="py-2.5 px-4">Telefone Moçambique</th>
                <th className="py-2.5 px-4">Plano Atual</th>
                <th className="py-2.5 px-4">Método</th>
                <th className="py-2.5 px-4">Validade</th>
                <th className="py-2.5 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              <tr className="hover:bg-slate-900/40">
                <td className="py-3 px-4 font-bold text-white">Alberto Matsinhe</td>
                <td className="py-3 px-4 font-mono text-slate-300">+258 84 391 8204</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold text-[10px]">Basic (100 MT)</span></td>
                <td className="py-3 px-4 text-red-400 font-semibold text-[11px]">M-Pesa</td>
                <td className="py-3 px-4 text-slate-400">Até 24/10/2026</td>
                <td className="py-3 px-4 text-right"><button className="text-blue-400 hover:text-white">Gerir</button></td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-3 px-4 font-bold text-white">Fátima Nhantumbo</td>
                <td className="py-3 px-4 font-mono text-slate-300">+258 86 712 9011</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold text-[10px]">Max (500 MT)</span></td>
                <td className="py-3 px-4 text-orange-400 font-semibold text-[11px]">E-Mola</td>
                <td className="py-3 px-4 text-slate-400">Até 15/10/2026</td>
                <td className="py-3 px-4 text-right"><button className="text-blue-400 hover:text-white">Gerir</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Screen 4: ADM-04 Financeiro & Reconciliação
  if (screenId === 'adm-financial-reconciliation') {
    return (
      <div className={`w-full rounded-xl overflow-hidden border ${isSchematicMode ? 'bg-slate-950 border-dashed border-emerald-500/50' : 'bg-[#040714] border-slate-800'} text-slate-100 font-sans p-6 space-y-6`}>
        {isSchematicMode && (
          <div className="bg-emerald-950/80 px-4 py-1.5 rounded border border-emerald-500/30 flex items-center justify-between text-[11px] font-mono text-emerald-300">
            <span>[ZONE: RECONCILIATION_GATEWAY] Vodacom M-Pesa C2B / Movitel E-Mola Webhook Audit</span>
            <span className="bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30">AUTO-MATCH 99.8%</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Livro Razão de Transações & Reconciliação</h3>
            <p className="text-xs text-slate-400">Cruzamento de comprovativos com o gateway financeiro das operadoras móveis</p>
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Relatório Fiscal (.CSV)</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Data/Hora</th>
                <th className="py-2.5 px-4">ID Transação Vodacom/Movitel</th>
                <th className="py-2.5 px-4">MSISDN</th>
                <th className="py-2.5 px-4">Valor MT</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Recibo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              <tr className="hover:bg-slate-900/40">
                <td className="py-3 px-4 text-slate-400">25/09 10:04:12</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">NL492810X9</td>
                <td className="py-3 px-4 text-slate-300">+258 84 **** 204</td>
                <td className="py-3 px-4 text-white font-bold">100,00 MT</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">COMPLETED</span></td>
                <td className="py-3 px-4 text-right font-sans"><button className="text-blue-400 hover:text-white">Ver</button></td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="py-3 px-4 text-slate-400">25/09 09:58:33</td>
                <td className="py-3 px-4 text-orange-400 font-bold">EM84719230</td>
                <td className="py-3 px-4 text-slate-300">+258 86 **** 011</td>
                <td className="py-3 px-4 text-white font-bold">500,00 MT</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">COMPLETED</span></td>
                <td className="py-3 px-4 text-right font-sans"><button className="text-blue-400 hover:text-white">Ver</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Screen 5: ADM-05 Servidor de Anúncios AVOD
  return (
    <div className={`w-full rounded-xl overflow-hidden border ${isSchematicMode ? 'bg-slate-950 border-dashed border-amber-500/50' : 'bg-[#040714] border-slate-800'} text-slate-100 font-sans p-6 space-y-6`}>
      {isSchematicMode && (
        <div className="bg-amber-950/80 px-4 py-1.5 rounded border border-amber-500/30 flex items-center justify-between text-[11px] font-mono text-amber-300">
          <span>[ZONE: AVOD_AD_SERVER] VAST 4.2 / VMAP Cue Points Inserter • Frequency Capping</span>
          <span className="bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/30">SSAI ENGINE</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Campanhas Publicitárias (AVOD & Patrocínios)</h3>
          <p className="text-xs text-slate-400">Gestão de anúncios pre-roll e mid-roll para utilizadores do plano Livre</p>
        </div>
        <button className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer">
          <Plus className="w-3.5 h-3.5" />
          <span>Nova Campanha Publicitária</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-xs">Campanha: Vodacom Moçambique 5G</h4>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">ATIVA</span>
          </div>
          <p className="text-[11px] text-slate-400">Pre-roll 15 segundos • Segmentação: Maputo & Matola</p>
          <div className="space-y-1 pt-1 text-[11px] font-mono">
            <div className="flex justify-between text-slate-300">
              <span>Impressões: 84.500 / 100.000</span>
              <span className="text-emerald-400 font-bold">84.5%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 w-[84.5%]"></div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-xs">Campanha: Cerveja 2M Moçambique</h4>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">ATIVA</span>
          </div>
          <p className="text-[11px] text-slate-400">Mid-roll em eventos desportivos • Classificação +18</p>
          <div className="space-y-1 pt-1 text-[11px] font-mono">
            <div className="flex justify-between text-slate-300">
              <span>Impressões: 45.200 / 50.000</span>
              <span className="text-emerald-400 font-bold">90.4%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 w-[90.4%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
