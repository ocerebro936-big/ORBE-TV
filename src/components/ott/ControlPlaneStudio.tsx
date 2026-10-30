import React, { useState } from 'react';
import { controlPlaneEngine } from '../../engine/control-plane-engine';
import { MPesaTransactionPayload, EntitlementTokenPayload } from '../../types/ott-architecture';
import { Users, Key, CreditCard, ShieldCheck, RefreshCw, Send, CheckCircle2, AlertTriangle, ArrowRight, Lock } from 'lucide-react';

export const ControlPlaneStudio: React.FC = () => {
  const [transactions, setTransactions] = useState<MPesaTransactionPayload[]>(controlPlaneEngine.getMPesaTransactions());
  const [phoneNumber, setPhoneNumber] = useState<string>('841234567');
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; priceMT: number }>({ name: 'basic', priceMT: 100 });
  const [isProcessingPush, setIsProcessingPush] = useState<boolean>(false);
  const [latestTxResult, setLatestTxResult] = useState<MPesaTransactionPayload | null>(null);
  
  // Entitlement simulation
  const [tokenPayload, setTokenPayload] = useState<EntitlementTokenPayload>(
    controlPlaneEngine.generateEntitlementToken('usr_mz_8819283', 'basic')
  );
  const [inspectedTier, setInspectedTier] = useState<string>('basic');

  const handleSimulateMPesa = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPush(true);
    setLatestTxResult(null);

    // Simulate STK push roundtrip with telco network latency
    setTimeout(async () => {
      const result = await controlPlaneEngine.simulateMPesaPayment(phoneNumber, selectedPlan.priceMT, selectedPlan.name);
      setTransactions(controlPlaneEngine.getMPesaTransactions());
      setLatestTxResult(result);
      setIsProcessingPush(false);

      if (result.status === 'SUCCESSFUL') {
        const updatedToken = controlPlaneEngine.generateEntitlementToken('usr_mz_8819283', selectedPlan.name);
        setTokenPayload(updatedToken);
        setInspectedTier(selectedPlan.name);
      }
    }, 1200);
  };

  const handleRegenerateToken = (tier: string) => {
    setInspectedTier(tier);
    const tok = controlPlaneEngine.generateEntitlementToken('usr_mz_8819283', tier);
    setTokenPayload(tok);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-slate-950 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold border border-emerald-500/20 mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Control Plane • Auth, Subscriptions & Gateways</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Control Plane & Gateways Moçambique</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Orquestração de utilizadores, multi-perfis familiares com PIN parental, integração nativa M-Pesa / E-Mola e verificação de direitos via tokens JWT criptografados.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-emerald-400 text-xs font-mono font-bold border border-slate-700">
            ● NestJS API Gateway Online
          </span>
        </div>
      </div>

      {/* Grid: M-Pesa STK Sandbox & Entitlements Token */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: M-Pesa & E-Mola Interactive STK Sandbox (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Simulador STK Push M-Pesa (Vodacom) & E-Mola (Movitel)</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Dispara a chamada C2B real ao gateway e simula a autorização por PIN no telemóvel do assinante:
            </p>

            <form onSubmit={handleSimulateMPesa} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 uppercase block mb-1">
                  Número de Telemóvel Moçambique (+258)
                </label>
                <div className="flex items-center">
                  <span className="bg-slate-800 text-slate-300 px-3 py-2 rounded-l-xl text-xs font-mono border border-r-0 border-slate-700">
                    +258
                  </span>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="84 123 4567"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-r-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 uppercase block mb-1">
                  Pacote para Cobrança
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan({ name: 'start', priceMT: 25 })}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedPlan.name === 'start' ? 'bg-emerald-950/60 border-emerald-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-bold">UBlue Start</div>
                    <div className="text-[11px] text-emerald-400 font-mono">25 MT / 7 dias</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan({ name: 'basic', priceMT: 100 })}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedPlan.name === 'basic' ? 'bg-blue-950/60 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-bold">UBlue Basic</div>
                    <div className="text-[11px] text-blue-400 font-mono">100 MT / mês</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan({ name: 'medio', priceMT: 250 })}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedPlan.name === 'medio' ? 'bg-purple-950/60 border-purple-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-bold">UBlue Médio</div>
                    <div className="text-[11px] text-purple-400 font-mono">250 MT / quinzena</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan({ name: 'max', priceMT: 500 })}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedPlan.name === 'max' ? 'bg-amber-950/60 border-amber-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-bold">UBlue Max</div>
                    <div className="text-[11px] text-amber-400 font-mono">500 MT / mês</div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessingPush}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {isProcessingPush ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Aguardando Confirmação de PIN no Telemóvel...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Disparar STK Push ({selectedPlan.priceMT} MT)</span>
                  </>
                )}
              </button>
            </form>

            {/* Last Transaction Status */}
            {latestTxResult && (
              <div className={`mt-4 p-3.5 rounded-xl border text-xs ${
                latestTxResult.status === 'SUCCESSFUL'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-red-950/40 border-red-500/40 text-red-200'
              }`}>
                <div className="flex items-center gap-2 font-bold mb-1">
                  {latestTxResult.status === 'SUCCESSFUL' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  )}
                  <span>Status: {latestTxResult.status} ({latestTxResult.responseCode})</span>
                </div>
                <p className="text-[11px] text-slate-300">{latestTxResult.responseDesc}</p>
                <div className="mt-2 text-[10px] font-mono text-slate-400">
                  ID: {latestTxResult.transactionId} | Ref: {latestTxResult.thirdPartyReference}
                </div>
              </div>
            )}
          </div>

          {/* Transactions Ledger */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              Histórico de Cobranças & Webhooks Recebidos
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {transactions.map((tx) => (
                <div key={tx.transactionId} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-mono font-bold text-white text-[11px]">{tx.customerMsisdn}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{tx.transactionId}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-emerald-400">+{tx.amount} MT</div>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Entitlements Engine & Token Inspector (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-blue-400" />
                <span>Entitlement Engine & Token JWT Assinado</span>
              </h3>
              <div className="flex items-center gap-1">
                {['free', 'start', 'basic', 'medio', 'max'].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => handleRegenerateToken(tier)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer uppercase ${
                      inspectedTier === tier ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Token temporário emitido pelo backend com chave privada RSA-256 e verificado pelo Cloudflare Edge Worker antes de liberar o manifesto HLS:
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <div><span className="text-slate-500">sub (UserId):</span> <span className="text-cyan-300">{tokenPayload.sub}</span></div>
                <div><span className="text-slate-500">tier:</span> <span className="text-blue-400 font-bold uppercase">{tokenPayload.tier}</span></div>
                <div><span className="text-slate-500">maxConcurrentStreams:</span> <span className="text-amber-400">{tokenPayload.maxStreams} telas</span></div>
                <div><span className="text-slate-500">entitledChannels:</span> <span className="text-emerald-300">[{tokenPayload.entitledChannels.join(', ')}]</span></div>
                <div><span className="text-slate-500">countryFence:</span> <span className="text-white">MZ (Moçambique)</span></div>
                <div><span className="text-slate-500">drmWidevine:</span> <span className="text-slate-400 truncate block">{tokenPayload.drmWidevinePssh}</span></div>
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Encoded Bearer JWT:</label>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-blue-500/20 text-[10px] text-cyan-400 break-all select-all font-mono leading-tight">
                  {tokenPayload.jwtToken}
                </div>
              </div>
            </div>
          </div>

          {/* Parental PIN & Multi-Profile Card */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Perfis Familiares & Controlo Parental</span>
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-white mb-0.5">Perfil 1: Titular (Adulto)</div>
                <div className="text-[11px] text-slate-400">Classificação Livre e 18+</div>
                <span className="inline-block mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                  Sem restrição
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-amber-300 mb-0.5">Perfil 2: Crianças (Kids)</div>
                <div className="text-[11px] text-slate-400">Apenas canais infantis & educativos</div>
                <span className="inline-block mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                  PIN Ativo (****)
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
