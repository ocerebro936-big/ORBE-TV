import React, { useState, useEffect } from 'react';
import { 
  X, 
  CreditCard, 
  Smartphone, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Send, 
  RotateCcw, 
  Terminal, 
  Users, 
  ArrowRight, 
  Check, 
  Copy, 
  ExternalLink, 
  Wallet, 
  DollarSign, 
  Globe2, 
  Zap,
  Lock,
  Layers,
  FileCheck
} from 'lucide-react';
import { 
  paymentGatewayEngine, 
  PaymentProviderId, 
  PaymentRequest, 
  PaymentResponse, 
  SupplierDisbursement, 
  WebhookEvent 
} from '../../engine/payment-gateway-engine';

interface OrbePayGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessPayment?: (tier: string, method: string, phone: string) => void;
}

export const OrbePayGatewayModal: React.FC<OrbePayGatewayModalProps> = ({
  isOpen,
  onClose,
  onSuccessPayment
}) => {
  const [activeTab, setActiveTab] = useState<'checkout' | 'webhooks' | 'maker-checker' | 'ledger'>('checkout');

  // Checkout simulator state
  const [selectedProvider, setSelectedProvider] = useState<PaymentProviderId>('mpesa');
  const [amountMT, setAmountMT] = useState<number>(25);
  const [customerPhone, setCustomerPhone] = useState('841234567');
  const [customerName, setCustomerName] = useState('Dércio Fernandes');
  const [selectedPlan, setSelectedPlan] = useState<'start' | 'super' | 'mega' | 'custom'>('start');
  const [environment, setEnvironment] = useState<'sandbox' | 'production'>('sandbox');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastPaymentResponse, setLastPaymentResponse] = useState<PaymentResponse | null>(null);

  // Webhooks state
  const [webhookUrl, setWebhookUrl] = useState('https://api.orbe.tv/webhooks/payment-listener');
  const [selectedWebhookEvent, setSelectedWebhookEvent] = useState<'c2b.payment.completed' | 'b2c.payout.settled' | 'reversal.processed'>('c2b.payment.completed');
  const [webhookLogs, setWebhookLogs] = useState<WebhookEvent[]>([]);
  const [isSendingWebhook, setIsSendingWebhook] = useState(false);

  // Maker-Checker state
  const [disbursements, setDisbursements] = useState<SupplierDisbursement[]>([]);
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierAmount, setNewSupplierAmount] = useState<number>(500);
  const [newSupplierMsisdn, setNewSupplierMsisdn] = useState('849876543');
  const [newSupplierType, setNewSupplierType] = useState<SupplierDisbursement['supplierType']>('criador');
  const [disbursementMsg, setDisbursementMsg] = useState<string | null>(null);

  // Transactions ledger
  const [transactions, setTransactions] = useState<PaymentResponse[]>([]);
  const [reversalLoadingId, setReversalLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen]);

  const refreshData = () => {
    setTransactions(paymentGatewayEngine.getTransactions());
    setDisbursements(paymentGatewayEngine.getDisbursements());
    setWebhookLogs(paymentGatewayEngine.getWebhookLogs());
  };

  if (!isOpen) return null;

  const handleProcessCheckout = async () => {
    setIsProcessing(true);
    setLastPaymentResponse(null);

    try {
      const req: PaymentRequest = {
        id: `req-${Date.now()}`,
        provider: selectedProvider,
        amountMT: amountMT,
        phone: customerPhone,
        userId: 'usr-sim-01',
        customerName: customerName,
        planId: selectedPlan,
        planName: `Plano UBlue ${selectedPlan.toUpperCase()}`,
        environment: environment
      };

      const res = await paymentGatewayEngine.processPayment(req);
      setLastPaymentResponse(res);
      refreshData();

      if (res.success && onSuccessPayment) {
        onSuccessPayment(selectedPlan, selectedProvider, customerPhone);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendSimulatedWebhook = async () => {
    setIsSendingWebhook(true);
    try {
      const mockPayload = {
        transactionId: lastPaymentResponse?.transactionId || `TX-MP-${Date.now()}`,
        provider: selectedProvider,
        amountMT: amountMT,
        customerPhone: customerPhone,
        status: 'completed',
        currency: 'MZN',
        timestamp: new Date().toISOString()
      };

      paymentGatewayEngine.triggerWebhook({
        event: selectedWebhookEvent,
        payload: mockPayload
      });
      refreshData();
    } finally {
      setIsSendingWebhook(false);
    }
  };

  const handleCreateDisbursement = async () => {
    if (!newSupplierName.trim() || newSupplierAmount <= 0) return;

    paymentGatewayEngine.createDisbursement({
      supplierName: newSupplierName,
      supplierType: newSupplierType,
      msisdnOrAccount: newSupplierMsisdn,
      provider: 'mpesa',
      amountMT: newSupplierAmount,
      concept: `Repasse de Direitos Autorais / Audiência UBlue (${newSupplierType})`,
      maker: 'Financeiro UBlue (Maker)'
    });

    setDisbursementMsg(`Ordem de repasse de ${newSupplierAmount} MT criada para aprovação.`);
    setNewSupplierName('');
    setTimeout(() => setDisbursementMsg(null), 4000);
    refreshData();
  };

  const handleApproveDisbursement = async (id: string) => {
    await paymentGatewayEngine.approveAndDisburse(id, 'Auditoria Executiva (Checker)');
    refreshData();
  };

  const handleReversal = async (txId: string, amount: number) => {
    setReversalLoadingId(txId);
    try {
      await paymentGatewayEngine.requestReversal({
        originalTransactionId: txId,
        amountMT: amount,
        reason: 'cobranca_indevida',
        requestedBy: 'Operador Suporte UBlue'
      });
      refreshData();
    } finally {
      setReversalLoadingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-blue-900/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/40">
                  ARQUITETURA OFICIAL UBLUE PAY
                </span>
                <span className="text-xs text-slate-400">Gateway Universal & Settlement Engine</span>
              </div>
              <h2 className="text-lg font-black text-white tracking-tight">
                PILAR 3: UBlue Pay — Gateway de Pagamentos & Webhooks
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800 text-xs">
              <button
                onClick={() => setEnvironment('sandbox')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  environment === 'sandbox' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                Sandbox
              </button>
              <button
                onClick={() => setEnvironment('production')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  environment === 'production' ? 'bg-emerald-500 text-white' : 'text-slate-400'
                }`}
              >
                Produção
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-900/60 overflow-x-auto">
          {[
            { id: 'checkout', label: '1. Simulador de Checkout (C2B)', icon: Smartphone },
            { id: 'webhooks', label: '2. Webhooks & HMAC SHA-256', icon: Terminal },
            { id: 'maker-checker', label: '3. Repasse Maker-Checker (B2C)', icon: Users },
            { id: 'ledger', label: '4. Livro-Razão & Conciliação', icon: Layers }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-2 border-b-2 ${
                activeTab === tab.id
                  ? 'border-emerald-400 text-emerald-300 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-slate-300 text-sm leading-relaxed">

          {/* TAB 1: CHECKOUT SIMULATOR */}
          {activeTab === 'checkout' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              {/* Left Form */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>Configuração da Transação UBlue Pay</span>
                </h3>

                {/* Provider Selector */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1.5 font-semibold">
                    Método de Pagamento Moçambicano / Internacional
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'mpesa', name: 'Vodacom M-Pesa', badge: 'Taxa 1.5%' },
                      { id: 'emola', name: 'Movitel e-Mola', badge: 'Taxa 1.2%' },
                      { id: 'mkesh', name: 'Tmcel mKesh', badge: 'Taxa 1.0%' },
                      { id: 'simo_card', name: 'SIMO / Visa & MC', badge: 'Taxa 2.2%' },
                      { id: 'ublue_wallet', name: 'Carteira UBlue Pay', badge: 'Sem Taxa' }
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedProvider(p.id as any)}
                        className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          selectedProvider === p.id
                            ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="font-bold text-[11px]">{p.name}</span>
                        <span className="text-[10px] text-emerald-400 mt-1">{p.badge}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Plan / Amount pills */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1.5 font-semibold">
                    Valor da Assinatura / Pacote
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { id: 'start', label: 'Start (24h)', amount: 25 },
                      { id: 'super', label: 'Super (7 Dias)', amount: 150 },
                      { id: 'mega', label: 'Mega (30 Dias)', amount: 350 }
                    ].map((plan) => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => {
                          setSelectedPlan(plan.id as any);
                          setAmountMT(plan.amount);
                        }}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          amountMT === plan.amount
                            ? 'bg-blue-600/30 border-cyan-400 text-cyan-300 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <div>{plan.amount} MT</div>
                        <div className="text-[10px] opacity-75">{plan.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Phone & Customer */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">MSISDN / Telefone</label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="841234567"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Nome do Assinante</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Nome do cliente"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProcessCheckout}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Enviando USSD Push para {customerPhone}...</span>
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4" />
                      <span>Simular Pagamento C2B ({amountMT} MT)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Output Receipt */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Comprovativo Digital UBlue Pay</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      SSL TLS 1.3 Seguro
                    </span>
                  </div>

                  {lastPaymentResponse ? (
                    <div className="space-y-3 font-mono text-xs">
                      <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-emerald-300">
                        <div className="flex items-center gap-2 font-bold mb-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>PAGAMENTO APROVADO COM SUCESSO</span>
                        </div>
                        <div className="text-[11px] opacity-90">
                          {lastPaymentResponse.responseDescription}
                        </div>
                      </div>

                      <div className="bg-black/50 p-4 rounded-xl border border-slate-800/80 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-500">ID da Transação:</span>
                          <span className="text-cyan-300 font-bold">{lastPaymentResponse.transactionId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Referência Operadora:</span>
                          <span className="text-white">{lastPaymentResponse.referenceId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Provedor:</span>
                          <span className="text-emerald-400 uppercase">{lastPaymentResponse.provider}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Valor Bruto:</span>
                          <span className="text-white">{lastPaymentResponse.amountMT.toFixed(2)} MT</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Taxa de Gateway:</span>
                          <span className="text-amber-400">-{lastPaymentResponse.feeMT.toFixed(2)} MT</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-slate-800 font-bold">
                          <span className="text-white">Líquido Creditado:</span>
                          <span className="text-emerald-400">{lastPaymentResponse.netMT.toFixed(2)} MT</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-500 text-xs">
                      <Smartphone className="w-10 h-10 mx-auto text-slate-600 mb-2 opacity-50" />
                      Configure os parâmetros ao lado e clique em "Simular Pagamento" para emitir a ordem USSD Push.
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Reconciliação Automática no Core</span>
                  <span>Webhook Disparado: Sim</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WEBHOOKS & HMAC SHA-256 */}
          {activeTab === 'webhooks' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span>Emissor & Validador de Webhooks em Tempo Real</span>
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
                    HMAC SHA-256 Signatures
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Evento do Webhook</label>
                    <select
                      value={selectedWebhookEvent}
                      onChange={(e) => setSelectedWebhookEvent(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                    >
                      <option value="c2b.payment.completed">c2b.payment.completed (Pagamento Efetuado)</option>
                      <option value="b2c.payout.settled">b2c.payout.settled (Repasse a Criador Liquidado)</option>
                      <option value="reversal.processed">reversal.processed (Estorno Processado)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Endpoint de Callback do Parceiro</label>
                    <input
                      type="text"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSendSimulatedWebhook}
                    disabled={isSendingWebhook}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-2 shadow-lg transition-all"
                  >
                    {isSendingWebhook ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Disparar Webhook Assinado de Teste</span>
                  </button>
                </div>
              </div>

              {/* Webhook Delivery Logs */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden font-mono text-xs">
                <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-slate-300">Histórico de Disparos de Webhook ({webhookLogs.length})</span>
                  <span className="text-[11px] text-slate-500">Retentativas: Backoff Exponencial Ativo</span>
                </div>

                <div className="p-4 max-h-[300px] overflow-y-auto space-y-3">
                  {webhookLogs.length === 0 ? (
                    <div className="text-slate-500 py-6 text-center">Nenhum evento de webhook disparado nesta sessão.</div>
                  ) : (
                    webhookLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-black/40 border border-slate-800/80 rounded-xl space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-cyan-400 font-bold">{log.event}</span>
                          <span className="text-slate-500">{log.timestamp}</span>
                        </div>
                        <div className="text-slate-400 text-[10px] truncate">
                          Assinatura: {log.signature}
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-emerald-400">Status: {log.status} (HTTP {log.responseStatus || 200})</span>
                          <span className="text-[10px] text-slate-500">Tentativas: {log.attempts}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MAKER-CHECKER DISBURSEMENTS */}
          {activeTab === 'maker-checker' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>Repasse B2C com Dupla Autorização (Maker-Checker)</span>
                  </h3>
                  <span className="text-xs text-slate-400">Garante conformidade com normas do Banco de Moçambique</span>
                </div>

                {disbursementMsg && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{disbursementMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Beneficiário / Parceiro</label>
                    <input
                      type="text"
                      placeholder="Ex: Cinema & Artes Moçambique"
                      value={newSupplierName}
                      onChange={(e) => setNewSupplierName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Categoria de Parceiro</label>
                    <select
                      value={newSupplierType}
                      onChange={(e) => setNewSupplierType(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="criador">Criador / Produtor</option>
                      <option value="canal_parceiro">Canal de TV Parceiro</option>
                      <option value="direitos_transmissao">Direitos de Transmissão</option>
                      <option value="infraestrutura_pop">Infraestrutura Edge PoP</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Valor do Repasse (MT)</label>
                    <input
                      type="number"
                      value={newSupplierAmount}
                      onChange={(e) => setNewSupplierAmount(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleCreateDisbursement}
                      className="w-full py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                    >
                      Criar Ordem (Maker)
                    </button>
                  </div>
                </div>
              </div>

              {/* Disbursements Table */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left font-mono">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Beneficiário</th>
                      <th className="py-2.5 px-3">Tipo</th>
                      <th className="py-2.5 px-3">Valor</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Ação (Checker)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {disbursements.map((d) => (
                      <tr key={d.id}>
                        <td className="py-3 px-3 font-semibold text-white">{d.supplierName}</td>
                        <td className="py-3 px-3 capitalize text-slate-400">{d.supplierType}</td>
                        <td className="py-3 px-3 text-emerald-400 font-bold">{d.amountMT.toLocaleString()} MT</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            d.status === 'desembolsado' ? 'bg-emerald-950 text-emerald-400' :
                            d.status === 'aprovado' ? 'bg-cyan-950 text-cyan-400' :
                            'bg-amber-950 text-amber-400'
                          }`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {d.status === 'rascunho' || d.status === 'verificado' ? (
                            <button
                              onClick={() => handleApproveDisbursement(d.id)}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                            >
                              Aprovar (Checker)
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-500">Liquidado ✓</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: LEDGER & REVERSAL */}
          {activeTab === 'ledger' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Livro-Razão de Pagamentos & Estornos Auditados</span>
                </h3>
                <span className="text-xs text-slate-400">Total Transações: {transactions.length}</span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left font-mono">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Transação</th>
                      <th className="py-2.5 px-3">Provedor</th>
                      <th className="py-2.5 px-3">Valor Bruto</th>
                      <th className="py-2.5 px-3">Taxa</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Estorno (Reversal)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {transactions.map((t) => (
                      <tr key={t.transactionId}>
                        <td className="py-3 px-3 font-semibold text-white">
                          <div>{t.transactionId}</div>
                          <div className="text-[10px] text-slate-500">{t.timestamp}</div>
                        </td>
                        <td className="py-3 px-3 uppercase text-cyan-300">{t.provider}</td>
                        <td className="py-3 px-3 text-white font-bold">{t.amountMT.toFixed(2)} MT</td>
                        <td className="py-3 px-3 text-amber-400">{t.feeMT.toFixed(2)} MT</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            t.status === 'completed' ? 'bg-emerald-950 text-emerald-400' :
                            t.status === 'reversed' ? 'bg-rose-950 text-rose-400' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {t.status === 'completed' ? (
                            <button
                              onClick={() => handleReversal(t.transactionId, t.amountMT)}
                              disabled={reversalLoadingId === t.transactionId}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-rose-900/60 hover:text-rose-200 text-slate-400 transition-colors"
                            >
                              {reversalLoadingId === t.transactionId ? 'Estornando...' : 'Estornar'}
                            </button>
                          ) : (
                            <span className="text-[11px] text-rose-400">Estornado ✓</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Motor homologado para liquidação instantânea M-Pesa, e-Mola e cartões bancários.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Fechar Console
          </button>
        </div>

      </div>
    </div>
  );
};
