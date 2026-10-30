import React, { useState, useEffect } from 'react';
import { X, Server, Zap, ShieldCheck, Wifi, Signal, CheckCircle2, ChevronRight, Lock, Activity, Sparkles, RefreshCw, Smartphone } from 'lucide-react';
import { turboEdgeServer, UBLUE_EDGE_SERVERS, EdgeServerInfo, ZeroDataSessionState } from '../../services/turbo-edge-server';
import { SubscriptionTier } from '../../types/content';

interface TurboServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  userTier: SubscriptionTier;
  onOpenPayment: () => void;
}

export const TurboServerModal: React.FC<TurboServerModalProps> = ({
  isOpen,
  onClose,
  userTier,
  onOpenPayment,
}) => {
  const [serverState, setServerState] = useState<ZeroDataSessionState>(() => turboEdgeServer.getState());
  const isPaid = turboEdgeServer.canAccessZeroData(userTier);

  useEffect(() => {
    const unsub = turboEdgeServer.subscribe(() => {
      setServerState(turboEdgeServer.getState());
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const currentServer = turboEdgeServer.getActiveServer();

  const handleSelectServer = (srvId: string) => {
    turboEdgeServer.setActiveServer(srvId);
  };

  const handleToggleZeroData = () => {
    if (!isPaid) {
      onOpenPayment();
      return;
    }
    turboEdgeServer.setZeroDataActive(!serverState.isZeroDataActive);
  };

  const handleSelectCarrier = (c: ZeroDataSessionState['carrier']) => {
    turboEdgeServer.setCarrier(c);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in text-left">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#0a102b] via-[#060a1e] to-[#040612] border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Servidores Potentes UBlue & Modo Sem Megas
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/40">
                  TurboEdge™
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transmissão local ultra-otimizada para Moçambique com Zero-Rating
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-300">
          
          {/* Zero Data / Sem Megas Banner */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isPaid && serverState.isZeroDataActive
              ? 'bg-gradient-to-r from-emerald-950/60 via-slate-900/80 to-blue-950/60 border-emerald-500/40 shadow-lg shadow-emerald-950/40'
              : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-sm font-black text-white">
                    Modo Sem Megas (Taxa Zero de Dados)
                  </span>
                  {isPaid ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                      DESBLOQUEADO (PACOTE PAGO)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                      BLOQUEADO (REQUER PACOTE PAGO)
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isPaid
                    ? 'Seu pacote está ativo! A UBlue subsidia e comprime o tráfego de vídeo diretamente no servidor local. Você assiste TV mesmo sem saldo de dados nos pacotes da operadora.'
                    : 'Após pagar qualquer pacote (a partir de 25 MT no Start, Basic, Médio ou Max), você ganha acesso aos Servidores Potentes com o Modo Sem Megas ativo!'}
                </p>
              </div>

              <div className="shrink-0">
                {isPaid ? (
                  <button
                    onClick={handleToggleZeroData}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md ${
                      serverState.isZeroDataActive
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>{serverState.isZeroDataActive ? 'Sem Megas ATIVADO' : 'Ativar Modo Sem Megas'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPayment();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-black shadow-lg shadow-blue-600/30 cursor-pointer flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pagar Pacote (25 MT) e Liberar</span>
                  </button>
                )}
              </div>
            </div>

            {/* Operator Selection */}
            {isPaid && (
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sua Operadora / Rede Móvel:</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['Vodacom Moçambique', 'Movitel', 'TMCEL', 'Rede Wi-Fi / Fibra'] as const).map((carrier) => (
                    <button
                      key={carrier}
                      onClick={() => handleSelectCarrier(carrier)}
                      className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        serverState.carrier === carrier
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {carrier}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Telemetry and Savings Counter */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 mb-0.5">Megas Economizados</div>
              <div className="text-lg font-black text-emerald-400">
                {serverState.dataSavedMB} MB
              </div>
              <div className="text-[9px] text-slate-500">Zero-Rating subsidiado</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 mb-0.5">Taxa de Compressão</div>
              <div className="text-lg font-black text-cyan-400">
                {(serverState.compressionRatio * 100).toFixed(0)}%
              </div>
              <div className="text-[9px] text-slate-500">AV1 / HEVC Micro-Chunk</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 mb-0.5">Latência no Servidor</div>
              <div className="text-lg font-black text-blue-400">
                {currentServer.latencyMs} ms
              </div>
              <div className="text-[9px] text-slate-500">Ping Ultra Rápido</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 mb-0.5">Capacidade Total</div>
              <div className="text-lg font-black text-purple-400">
                {currentServer.bandwidthGbps} Gbps
              </div>
              <div className="text-[9px] text-slate-500">Largura de Banda</div>
            </div>
          </div>

          {/* List of High-Power Edge Servers */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-blue-400" />
                <span>Escolher Servidor de Transmissão de Alta Potência</span>
              </h4>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                5 de 5 Online (99.98% Uptime)
              </span>
            </div>

            <div className="space-y-2">
              {UBLUE_EDGE_SERVERS.map((server) => {
                const isSelected = server.id === serverState.selectedServerId;
                return (
                  <div
                    key={server.id}
                    onClick={() => handleSelectServer(server.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-950/50 border-cyan-400 shadow-md shadow-blue-900/20'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{server.countryFlag}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs sm:text-sm">
                              {server.name}
                            </span>
                            {isSelected && (
                              <span className="px-1.5 py-0.2 rounded bg-cyan-500 text-black text-[9px] font-black uppercase">
                                Em Uso
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {server.datacenter} · {server.city}, {server.country}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-right">
                        <div>
                          <div className="text-xs font-mono font-bold text-emerald-400">
                            {server.latencyMs} ms
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {server.bandwidthGbps} Gbps
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-cyan-400 bg-cyan-500 text-black' : 'border-slate-700'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-[10px] text-slate-400">
                      <span>{server.description}</span>
                      {server.supportsZeroRating && (
                        <span className="text-emerald-400 font-semibold">
                          ✓ Suporta Modo Sem Megas (Vodacom, Movitel, TMCEL)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Infraestrutura Oficial Licenciada UBlue TV</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer transition-colors"
          >
            Concluir & Voltar ao Player
          </button>
        </div>

      </div>
    </div>
  );
};
