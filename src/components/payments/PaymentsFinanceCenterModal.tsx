import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  ArrowRight,
  TrendingUp,
  FileText,
  DollarSign,
  Lock,
  Layers,
  Send,
  Sliders,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Code2,
  Globe,
  Maximize2
} from 'lucide-react';
import {
  paymentGatewayEngine,
  PAYMENT_PROVIDERS_MATRIX,
  PaymentProviderId,
  PaymentResponse,
  SupplierDisbursement,
  FraudAlert
} from '../../engine/payment-gateway-engine';
import { TechnicalIntegrationLab } from '../finance/TechnicalIntegrationLab';
import { InternationalPaymentsLab } from '../finance/InternationalPaymentsLab';
import { SecurityComplianceLab } from '../finance/SecurityComplianceLab';

interface PaymentsFinanceCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout?: (tierId: string) => void;
  onOpenFullScreen?: () => void;
}

export const PaymentsFinanceCenterModal: React.FC<PaymentsFinanceCenterModalProps> = ({
  isOpen,
  onClose,
  onOpenCheckout,
  onOpenFullScreen,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'tech_integration'
    | 'international_payments'
    | 'security_compliance'
    | 'mpesa_test'
    | 'benchmark'
    | 'reconciliation'
    | 'fraud'
    | 'disbursements'
    | 'production_checklist'
  >('tech_integration');

  // M-Pesa Sandbox state
  const [sandboxPhone, setSandboxPhone] = useState('841234567');
  const [sandboxAmount, setSandboxAmount] = useState('100');
  const [sandboxOutcome, setSandboxOutcome] = useState<'success' | 'insufficient_funds' | 'timeout'>('success');
  const [isSimulating, setIsSimulating] = useState(false);
  const [lastApiCallResponse, setLastApiCallResponse] = useState<any>(null);

  // Reconciliation state
  const [searchTxId, setSearchTxId] = useState('');
  const [queriedTx, setQueriedTx] = useState<PaymentResponse | null>(null);
  const [reconciliation, setReconciliation] = useState(() => paymentGatewayEngine.getReconciliationSummary());
  const [transactions, setTransactions] = useState(() => paymentGatewayEngine.getTransactions());

  // Reversal modal state
  const [reversalTargetTx, setReversalTargetTx] = useState<PaymentResponse | null>(null);
  const [reversalReason, setReversalReason] = useState<'insatisfacao' | 'duplicidade' | 'cobranca_indevida' | 'falha_sinal'>('duplicidade');
  const [reversalSuccessMsg, setReversalSuccessMsg] = useState<string | null>(null);

  // Fraud alerts state
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>(() => paymentGatewayEngine.getFraudAlerts());

  // Disbursements state
  const [disbursements, setDisbursements] = useState<SupplierDisbursement[]>(() => paymentGatewayEngine.getDisbursements());
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierPhone, setNewSupplierPhone] = useState('84 000 0000');
  const [newSupplierAmount, setNewSupplierAmount] = useState('15000');
  const [newSupplierConcept, setNewSupplierConcept] = useState('Direitos de Transmissão de Conteúdo');
  const [newSupplierType, setNewSupplierType] = useState<SupplierDisbursement['supplierType']>('canal_parceiro');
  const [isCreatingDisb, setIsCreatingDisb] = useState(false);

  if (!isOpen) return null;

  // Handle M-Pesa Sandbox simulation
  const handleSimulateMpesa = async () => {
    setIsSimulating(true);
    setLastApiCallResponse(null);

    const testPhone = sandboxOutcome === 'insufficient_funds' ? '840000999' : sandboxPhone;

    const res = await paymentGatewayEngine.processPayment({
      id: `SIM-${Date.now()}`,
      provider: 'mpesa',
      amountMT: Number(sandboxAmount),
      phone: testPhone,
      userId: 'UB-TEST-USER',
      planId: 'basic',
      planName: 'UBlue Basic',
      environment: 'sandbox'
    });

    setIsSimulating(false);
    setLastApiCallResponse(res);
    setReconciliation(paymentGatewayEngine.getReconciliationSummary());
    setTransactions(paymentGatewayEngine.getTransactions());
    setFraudAlerts([...paymentGatewayEngine.getFraudAlerts()]);
  };

  // Handle Query Transaction
  const handleQueryTx = async () => {
    if (!searchTxId.trim()) return;
    const res = await paymentGatewayEngine.queryTransaction(searchTxId.trim());
    setQueriedTx(res);
  };

  // Handle Reversal / Refund
  const handleConfirmReversal = async () => {
    if (!reversalTargetTx) return;
    const rev = await paymentGatewayEngine.requestReversal({
      originalTransactionId: reversalTargetTx.transactionId,
      amountMT: reversalTargetTx.amountMT,
      reason: reversalReason,
      requestedBy: 'Gestor Financeiro UBlue',
      notes: `Reversão aprovada pelo cliente.`
    });

    setReversalSuccessMsg(`Reembolso de ${rev.amountMT} MT processado! Código: ${rev.reversalId}`);
    setReconciliation(paymentGatewayEngine.getReconciliationSummary());
    setTransactions([...paymentGatewayEngine.getTransactions()]);
    setTimeout(() => {
      setReversalTargetTx(null);
      setReversalSuccessMsg(null);
    }, 2500);
  };

  // Handle Disbursement Flow (Maker-Checker)
  const handleVerifyDisb = (id: string) => {
    paymentGatewayEngine.verifyDisbursement(id, 'Verificador Interno UBlue');
    setDisbursements([...paymentGatewayEngine.getDisbursements()]);
  };

  const handleApproveDisb = async (id: string) => {
    await paymentGatewayEngine.approveAndDisburse(id, 'Diretor Financeiro Autorizado');
    setDisbursements([...paymentGatewayEngine.getDisbursements()]);
  };

  const handleCreateDisbursement = (e: React.FormEvent) => {
    e.preventDefault();
    paymentGatewayEngine.createDisbursement({
      supplierName: newSupplierName,
      supplierType: newSupplierType,
      msisdnOrAccount: newSupplierPhone,
      provider: 'mpesa',
      amountMT: Number(newSupplierAmount),
      concept: newSupplierConcept,
      maker: 'Operador Financeiro UBlue'
    });
    setDisbursements([...paymentGatewayEngine.getDisbursements()]);
    setIsCreatingDisb(false);
    setNewSupplierName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in text-left">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[850px] rounded-2xl bg-[#090d20] border border-blue-500/30 flex flex-col shadow-2xl shadow-blue-900/40 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                UBlue Pay · Centro de Engenharia Financeira
              </span>
              <span className="text-xs text-slate-400 font-mono">Vodacom OpenAPI · e-Mola · Banco de Moçambique</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-emerald-400" />
              <span>Gateway M-Pesa, e-Mola, Câmbio & Regulação</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {onOpenFullScreen && (
              <button
                onClick={() => {
                  onClose();
                  onOpenFullScreen();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                title="Abrir em ecrã inteiro"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Ecrã Inteiro</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-4 sm:px-6 bg-slate-950/60 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'tech_integration', label: 'Integração Técnica (Hands-on)', icon: Code2 },
            { id: 'international_payments', label: '6. Pagamentos Internacionais', icon: Globe },
            { id: 'security_compliance', label: '7. Segurança & Regulação', icon: ShieldCheck },
            { id: 'mpesa_test', label: 'Simulador M-Pesa', icon: Smartphone },
            { id: 'benchmark', label: 'Multi-Prestador MZ', icon: Sliders },
            { id: 'reconciliation', label: 'Conciliação Diária', icon: TrendingUp },
            { id: 'fraud', label: 'Alertas Antifraude', icon: ShieldCheck, badge: fraudAlerts.length },
            { id: 'disbursements', label: 'Fornecedores B2B', icon: DollarSign },
            { id: 'production_checklist', label: 'Checklist Produção', icon: Lock },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  active
                    ? 'border-emerald-400 text-emerald-400 bg-emerald-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-sm">

          {/* TAB: INTEGRAÇÃO TÉCNICA (HANDS-ON) */}
          {activeTab === 'tech_integration' && (
            <TechnicalIntegrationLab
              onPaymentSuccess={(tier) => {
                if (onOpenCheckout) onOpenCheckout(tier);
              }}
            />
          )}

          {/* TAB: PAGAMENTOS INTERNACIONAIS */}
          {activeTab === 'international_payments' && (
            <InternationalPaymentsLab />
          )}

          {/* TAB: SEGURANÇA, COMPLIANCE & REGULAÇÃO */}
          {activeTab === 'security_compliance' && (
            <SecurityComplianceLab />
          )}

          {/* TAB 1: M-PESA SANDBOX TESTER */}
          {activeTab === 'mpesa_test' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Ambiente de Testes OpenAPI Vodacom M-Pesa Moçambique</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Simula chamadas reais à API <code className="text-emerald-300 font-mono">POST /ipg/v2/vodacomMZ/c2bPayment/singleStage</code> com envio de Push USSD (*150#) para o assinante.
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold shrink-0">
                  SANDBOX ATIVO · PORT 443 SSL
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form de Disparo */}
                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
                  <h4 className="font-bold text-white text-sm uppercase tracking-wider text-slate-300">
                    Disparar Cobrança C2B (Customer to Business)
                  </h4>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">MSISDN do Cliente (Vodacom 84/85):</label>
                    <div className="flex items-center rounded-xl bg-slate-950 border border-slate-700 px-3 py-2">
                      <span className="text-xs text-slate-400 mr-2 font-mono">+258</span>
                      <input
                        type="text"
                        value={sandboxPhone}
                        onChange={(e) => setSandboxPhone(e.target.value)}
                        className="bg-transparent text-white font-mono text-sm w-full focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Valor do Pacote UBlue (Meticais):</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: '25 MT', val: '25' },
                        { label: '100 MT', val: '100' },
                        { label: '250 MT', val: '250' },
                        { label: '500 MT', val: '500' }
                      ].map(p => (
                        <button
                          key={p.val}
                          type="button"
                          onClick={() => setSandboxAmount(p.val)}
                          className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                            sandboxAmount === p.val
                              ? 'bg-blue-600 text-white border-blue-400'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Cenário de Teste a Simular:</label>
                    <select
                      value={sandboxOutcome}
                      onChange={(e) => setSandboxOutcome(e.target.value as any)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="success">INS-0: Cliente digita PIN correto (Aprovado)</option>
                      <option value="insufficient_funds">INS-1: Saldo M-Pesa Insuficiente</option>
                      <option value="timeout">INS-2006: Tempo Limite Excedido (Sem resposta USSD)</option>
                    </select>
                  </div>

                  <button
                    onClick={handleSimulateMpesa}
                    disabled={isSimulating}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {isSimulating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Aguardando resposta do nó M-Pesa...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Executar Teste C2B SingleStage ({sandboxAmount} MT)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Resposta da API M-Pesa */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between font-mono">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-xs">
                      <span className="text-slate-400 font-bold">Payload de Resposta JSON (OpenAPI v2)</span>
                      <span className="text-emerald-400">HTTP/1.1 200 OK</span>
                    </div>

                    {lastApiCallResponse ? (
                      <pre className="text-xs text-emerald-300/90 whitespace-pre-wrap overflow-x-auto p-3 rounded-xl bg-black/60 border border-slate-800/80 leading-relaxed max-h-72">
{JSON.stringify({
  output_ResponseCode: lastApiCallResponse.responseCode,
  output_ResponseDesc: lastApiCallResponse.responseDescription,
  output_TransactionID: lastApiCallResponse.transactionId,
  output_ConversationID: lastApiCallResponse.conversationId || 'AG_17288921_4812',
  output_ThirdPartyReference: lastApiCallResponse.referenceId,
  output_GrossAmountMT: lastApiCallResponse.amountMT,
  output_MpesaFeeMT: lastApiCallResponse.feeMT,
  output_NetSettledMT: lastApiCallResponse.netMT,
  output_Timestamp: lastApiCallResponse.timestamp
}, null, 2)}
                      </pre>
                    ) : (
                      <div className="py-16 text-center text-slate-600 text-xs">
                        Clique em "Executar Teste C2B SingleStage" para visualizar o payload retornado pela API M-Pesa.
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>ShortCode Empresa UBlue: <strong>171717</strong></span>
                    <span>Moeda: <strong>MZN (Meticais)</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AVALIAÇÃO MULTI-PRESTADOR */}
          {activeTab === 'benchmark' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  Matriz Comparativa de Gateways de Pagamento em Moçambique
                </h3>
                <p className="text-xs text-slate-400">
                  Avaliação independente para garantir que o motor UBlue suporte múltiplos prestadores sem dependência de fornecedor único.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PAYMENT_PROVIDERS_MATRIX.map(prov => (
                  <div
                    key={prov.id}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-white text-sm">{prov.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          ⭐ {prov.rating.toFixed(1)}/5
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mb-4">{prov.operator} · {prov.country}</div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-800/60">
                          <span className="text-slate-400">Taxa UBlue:</span>
                          <span className="font-bold text-emerald-400">{prov.feePercentage}% {prov.fixedFeeMT > 0 ? `+ ${prov.fixedFeeMT} MT` : ''}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-800/60">
                          <span className="text-slate-400">Tempo de Liquidação:</span>
                          <span className="font-semibold text-white">{prov.settlementTime}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-800/60">
                          <span className="text-slate-400">Quota de Mercado:</span>
                          <span className="font-semibold text-cyan-300">{prov.marketShareMZ}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-800/60">
                          <span className="text-slate-400">Protocolo Técnico:</span>
                          <span className="font-mono text-[11px] text-slate-300 truncate max-w-[170px]" title={prov.apiProtocol}>{prov.apiProtocol}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>C2B & Reversão</span>
                      </span>
                      <span className="text-slate-400">Status: <strong>Pronto</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: RECONCILIAÇÃO FINANCEIRA & CONSULTAS */}
          {activeTab === 'reconciliation' && (
            <div className="space-y-6">
              {/* Summary KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400">Receita Bruta Total</div>
                  <div className="text-xl sm:text-2xl font-black text-white mt-1">
                    {reconciliation.grossRevenueMT.toLocaleString()} <span className="text-xs font-bold text-blue-400">MT</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">{reconciliation.completedCount} transações aprovadas</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400">Taxas Retidas (Gateways)</div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
                    {reconciliation.totalFeesMT.toFixed(2)} <span className="text-xs font-bold">MT</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Média ~1.4% por transação</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400">Receita Líquida UBlue</div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
                    {reconciliation.netRevenueMT.toLocaleString()} <span className="text-xs font-bold">MT</span>
                  </div>
                  <div className="text-[10px] text-emerald-400/80 mt-1">Disponível para desembolso</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400">Discrepâncias / Falhas</div>
                  <div className="text-xl sm:text-2xl font-black text-cyan-400 mt-1">
                    0 <span className="text-xs font-normal text-slate-400">erros</span>
                  </div>
                  <div className="text-[10px] text-cyan-400/80 mt-1">100% conciliado com nós locais</div>
                </div>
              </div>

              {/* Transaction Status Query Search Bar */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Consultar Estado de Transação em Tempo Real (Vodacom Query API)
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchTxId}
                    onChange={(e) => setSearchTxId(e.target.value)}
                    placeholder="Ex: MP-89214-MZ ou MPESA-TX-849201"
                    className="flex-1 rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <button
                    onClick={handleQueryTx}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>Consultar</span>
                  </button>
                </div>

                {queriedTx && (
                  <div className="p-3 rounded-lg bg-slate-950 border border-blue-500/30 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">{queriedTx.transactionId}</span>
                      <span className="text-slate-400 ml-2">({queriedTx.provider.toUpperCase()} · {queriedTx.amountMT} MT)</span>
                      <p className="text-[11px] text-emerald-400 mt-0.5">{queriedTx.responseDescription}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {queriedTx.status.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Transactions Table */}
              <div className="space-y-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                  Histórico de Assinaturas e Liquidação
                </h4>
                <div className="border border-slate-800 rounded-xl overflow-hidden overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                        <th className="p-3">ID Transação</th>
                        <th className="p-3">Prestador</th>
                        <th className="p-3">Valor Bruto</th>
                        <th className="p-3">Taxa</th>
                        <th className="p-3">Valor Líquido</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Data</th>
                        <th className="p-3 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {transactions.map(tx => (
                        <tr key={tx.transactionId} className="hover:bg-slate-900/40">
                          <td className="p-3 font-mono font-bold text-white">{tx.transactionId}</td>
                          <td className="p-3 capitalize">{tx.provider}</td>
                          <td className="p-3 font-bold text-white">{tx.amountMT} MT</td>
                          <td className="p-3 text-amber-400">-{tx.feeMT} MT</td>
                          <td className="p-3 font-bold text-emerald-400">{tx.netMT} MT</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              tx.status === 'completed'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : tx.status === 'reversed'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}>
                              {tx.status === 'completed' ? 'Aprovado' : tx.status === 'reversed' ? 'Reembolsado' : 'Falha'}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400">{tx.timestamp}</td>
                          <td className="p-3 text-right">
                            {tx.status === 'completed' ? (
                              <button
                                onClick={() => setReversalTargetTx(tx)}
                                className="px-2 py-1 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              >
                                Reembolsar
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-500">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ALERTAS ANTIFRAUDE */}
          {activeTab === 'fraud' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-rose-400" />
                    <span>Motor Antifraude UBlue Shield (Proteção de Transações)</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Monitora velocidade anormal de pagamentos, números bloqueados e volumes anômalos em tempo real.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {fraudAlerts.length} Ocorrências
                </span>
              </div>

              <div className="space-y-3">
                {fraudAlerts.map(alert => (
                  <div
                    key={alert.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          alert.severity === 'alta' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          Gravidade {alert.severity}
                        </span>
                        <span className="text-xs font-bold text-white">{alert.id}</span>
                        <span className="text-xs text-slate-400">· {alert.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 font-medium">{alert.description}</p>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Telemóvel: <span className="font-mono text-cyan-300">{alert.phone}</span> · Utilizador: <span className="font-mono text-white">{alert.userId}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">Ação: <strong>{alert.actionTaken}</strong></span>
                      {alert.actionTaken !== 'liberado_manual' && (
                        <button
                          onClick={() => {
                            paymentGatewayEngine.resolveFraudAlert(alert.id);
                            setFraudAlerts([...paymentGatewayEngine.getFraudAlerts()]);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors cursor-pointer"
                        >
                          Liberar Manualmente
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PAGAMENTOS A FORNECEDORES (MAKER-CHECKER) */}
          {activeTab === 'disbursements' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    <span>Pagamentos a Fornecedores & Criadores (Maker-Checker B2C)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Fluxo administrativo de 2 níveis para repasse de receitas via M-Pesa B2C e Transferência SIMO.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreatingDisb(!isCreatingDisb)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Novo Desembolso</span>
                </button>
              </div>

              {/* Form de Criação de Desembolso */}
              {isCreatingDisb && (
                <form onSubmit={handleCreateDisbursement} className="p-4 rounded-xl bg-slate-900 border border-blue-500/30 space-y-3">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">Criar Nova Ordem de Pagamento</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Nome do Fornecedor / Criador:</label>
                      <input
                        type="text"
                        required
                        value={newSupplierName}
                        onChange={(e) => setNewSupplierName(e.target.value)}
                        placeholder="Ex: Produtora Marrabenta Viva"
                        className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Tipo de Fornecedor:</label>
                      <select
                        value={newSupplierType}
                        onChange={(e) => setNewSupplierType(e.target.value as any)}
                        className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2 text-xs text-white"
                      >
                        <option value="canal_parceiro">Canal Parceiro</option>
                        <option value="criador">Criador de Conteúdo</option>
                        <option value="infraestrutura_pop">Infraestrutura PoP / CDN</option>
                        <option value="direitos_transmissao">Direitos de Transmissão</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">M-Pesa / Conta SIMO:</label>
                      <input
                        type="text"
                        required
                        value={newSupplierPhone}
                        onChange={(e) => setNewSupplierPhone(e.target.value)}
                        className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Valor a Desembolsar (MT):</label>
                      <input
                        type="number"
                        required
                        value={newSupplierAmount}
                        onChange={(e) => setNewSupplierAmount(e.target.value)}
                        className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2 text-xs text-white font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Conceito / Justificativa:</label>
                    <input
                      type="text"
                      required
                      value={newSupplierConcept}
                      onChange={(e) => setNewSupplierConcept(e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2 text-xs text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingDisb(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                    >
                      Submeter para Verificação
                    </button>
                  </div>
                </form>
              )}

              {/* Tabela de Desembolsos */}
              <div className="space-y-3">
                {disbursements.map(d => (
                  <div
                    key={d.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{d.supplierName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300">
                          {d.supplierType}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          d.status === 'desembolsado'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : d.status === 'aprovado'
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {d.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{d.concept}</p>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Conta: <span className="font-mono text-emerald-400">{d.msisdnOrAccount}</span> · Solicitado por: <strong>{d.maker}</strong> ({d.requestedAt})
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-base font-black text-white">{d.amountMT.toLocaleString()} MT</div>
                        <div className="text-[10px] text-slate-400">{d.provider.toUpperCase()}</div>
                      </div>

                      {/* Maker-Checker Actions */}
                      {d.status === 'rascunho' && (
                        <button
                          onClick={() => handleVerifyDisb(d.id)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
                        >
                          Verificar (Checker)
                        </button>
                      )}
                      {d.status === 'verificado' && (
                        <button
                          onClick={() => handleApproveDisb(d.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black cursor-pointer"
                        >
                          Aprovar & Desembolsar
                        </button>
                      )}
                      {d.status === 'desembolsado' && (
                        <div className="text-[11px] text-emerald-400 font-mono">
                          TX: {d.disbursementTxId}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: CHECKLIST DE PRODUÇÃO VODACOM */}
          {activeTab === 'production_checklist' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30">
                <h3 className="text-base font-bold text-white mb-1">
                  Checklist para Migração do M-Pesa de Sandbox para Produção
                </h3>
                <p className="text-xs text-slate-300">
                  Passos formais exigidos pela Vodacom Moçambique para ativar o Shortcode oficial de produção da UBlue TV.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    step: '1. Acordo Comercial de Cobrança C2B',
                    desc: 'Contrato bilateral assinado com a Direção do M-Pesa Vodacom Moçambique com NUIT da Universo Blue.',
                    status: 'Assinado e Submetido'
                  },
                  {
                    step: '2. Par de Chaves Criptográficas RSA (2048-bit)',
                    desc: 'Chave pública carregada no Portal de Desenvolvedores Vodacom para encriptação da SecurityCredential da API.',
                    status: 'Configurado'
                  },
                  {
                    step: '3. IP Whitelisting nos Servidores Cloud da UBlue',
                    desc: 'Endereços IP estáticos dos gateways da UBlue registados na firewall segura da Vodacom em Matola.',
                    status: 'Validado'
                  },
                  {
                    step: '4. Testes de Transação e Reversão (UAT)',
                    desc: 'Execução bem-sucedida de casos de teste: C2B sucesso, saldo insuficiente e estorno em menos de 10 minutos.',
                    status: 'Concluído com Sucesso'
                  },
                  {
                    step: '5. Ativação de Produção e Live Push',
                    desc: 'Vodacom emite o Shortcode oficial de Produção com teto de transação configurado para 50.000 MT/dia.',
                    status: 'Aguardando Janela de Produção'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.step}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Reversal Confirmation Modal */}
        {reversalTargetTx && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-purple-500/40 p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-purple-400" />
                <span>Confirmar Reversão / Reembolso</span>
              </h3>
              <p className="text-xs text-slate-300">
                Você está prestes a devolver o valor de <strong className="text-white">{reversalTargetTx.amountMT} MT</strong> referente à transação <strong className="text-purple-300 font-mono">{reversalTargetTx.transactionId}</strong>.
              </p>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Motivo do Reembolso:</label>
                <select
                  value={reversalReason}
                  onChange={(e) => setReversalReason(e.target.value as any)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2.5 text-xs text-white"
                >
                  <option value="duplicidade">Cobrança em duplicidade</option>
                  <option value="insatisfacao">Insatisfação do assinante (prazo 24h)</option>
                  <option value="cobranca_indevida">Cobrança indevida / erro de digitação</option>
                  <option value="falha_sinal">Falha de sinal na transmissão</option>
                </select>
              </div>

              {reversalSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                  {reversalSuccessMsg}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setReversalTargetTx(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmReversal}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                >
                  Executar Estorno
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
