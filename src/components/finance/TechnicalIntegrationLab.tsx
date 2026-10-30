import React, { useState } from 'react';
import {
  Code2,
  Terminal,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Send,
  Smartphone,
  Shield,
  FileText,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  Database,
  Lock,
  Server,
  Play
} from 'lucide-react';
import {
  paymentGatewayEngine,
  PaymentRequest,
  PaymentResponse,
  WebhookEvent,
  IdempotencyRecord,
  ReconciliationItem
} from '../../engine/payment-gateway-engine';
import { UBLUE_PLANS } from '../../data/mock-content';

interface TechnicalIntegrationLabProps {
  onPaymentSuccess?: (tier: string) => void;
}

export const TechnicalIntegrationLab: React.FC<TechnicalIntegrationLabProps> = ({
  onPaymentSuccess
}) => {
  const [subSection, setSubSection] = useState<'apis_webhooks' | 'sandbox_idempotency' | 'reconciliation' | 'checkout_project'>('checkout_project');

  // Copy helper
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // --- 1. APIS & WEBHOOKS STATE ---
  const [selectedLanguage, setSelectedLanguage] = useState<'curl' | 'typescript' | 'python' | 'php'>('typescript');
  const [apiEndpointMode, setApiEndpointMode] = useState<'mpesa_c2b' | 'emola_ussd' | 'webhook_verify'>('mpesa_c2b');
  const [webhookLogs, setWebhookLogs] = useState<WebhookEvent[]>(() => paymentGatewayEngine.getWebhookLogs());
  const [testWebhookUrl, setTestWebhookUrl] = useState('https://api.ubluetv.mz/v1/webhooks/payments');
  const [isSendingWebhook, setIsSendingWebhook] = useState(false);
  const [webhookSecretKey, setWebhookSecretKey] = useState('whsec_ublue_mz_live_94819284029410');

  const handleDispatchTestWebhook = () => {
    setIsSendingWebhook(true);
    setTimeout(() => {
      const dummyPayload = {
        transactionId: `MP-${Math.floor(10000000 + Math.random() * 90000000)}`,
        referenceId: `MPESA-TX-${Math.floor(100000 + Math.random() * 900000)}`,
        provider: 'mpesa',
        amountMT: 250,
        feeMT: 3.75,
        netMT: 246.25,
        status: 'completed',
        planId: 'medio',
        userId: 'UB-USER-44129',
        customerPhone: '+258 84 123 4567',
        timestamp: new Date().toLocaleTimeString('pt-MZ')
      };
      paymentGatewayEngine.triggerWebhook({
        event: 'c2b.payment.completed',
        payload: dummyPayload
      });
      setWebhookLogs([...paymentGatewayEngine.getWebhookLogs()]);
      setIsSendingWebhook(false);
    }, 700);
  };

  // --- 2. SANDBOX & IDEMPOTENCY STATE ---
  const [idempotencyKey, setIdempotencyKey] = useState(() => `idem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
  const [sandboxPhone, setSandboxPhone] = useState('841234567');
  const [sandboxAmount, setSandboxAmount] = useState('100');
  const [sandboxProvider, setSandboxProvider] = useState<'mpesa' | 'emola'>('mpesa');
  const [simulatedFailure, setSimulatedFailure] = useState<'none' | 'insufficient_funds' | 'user_cancel' | 'timeout'>('none');
  const [idempotencyHistory, setIdempotencyHistory] = useState<IdempotencyRecord[]>(() => paymentGatewayEngine.getIdempotencyRecords());
  const [lastSandboxResponse, setLastSandboxResponse] = useState<{ response: PaymentResponse; cached: boolean } | null>(null);
  const [isProcessingSandbox, setIsProcessingSandbox] = useState(false);

  const handleGenerateNewIdempotencyKey = () => {
    setIdempotencyKey(`idem-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`);
  };

  const handleTestIdempotentExecution = async () => {
    setIsProcessingSandbox(true);
    let phoneToUse = sandboxPhone;
    if (simulatedFailure === 'insufficient_funds') phoneToUse = '840000999';
    if (simulatedFailure === 'user_cancel') phoneToUse = '840000111';

    const req: PaymentRequest = {
      id: `REQ-${Date.now()}`,
      provider: sandboxProvider,
      amountMT: Number(sandboxAmount),
      phone: `+258${phoneToUse}`,
      userId: 'UB-DEV-USER',
      planId: 'basic',
      planName: 'ORBE Basic 100 MT',
      environment: 'sandbox'
    };

    const res = await paymentGatewayEngine.processWithIdempotency(req, idempotencyKey);
    setLastSandboxResponse(res);
    setIdempotencyHistory([...paymentGatewayEngine.getIdempotencyRecords()]);
    setIsProcessingSandbox(false);
  };

  // --- 3. RECONCILIATION STATE ---
  const [reconciliationItems, setReconciliationItems] = useState<ReconciliationItem[]>(() =>
    paymentGatewayEngine.getReconciliationItems()
  );
  const [isAutoReconciling, setIsAutoReconciling] = useState(false);

  const handleResolveReconciliation = (id: string) => {
    paymentGatewayEngine.resolveReconciliationItem(id);
    setReconciliationItems([...paymentGatewayEngine.getReconciliationItems()]);
  };

  const handleRunAutoReconciliation = () => {
    setIsAutoReconciling(true);
    setTimeout(() => {
      reconciliationItems.forEach(i => paymentGatewayEngine.resolveReconciliationItem(i.id));
      setReconciliationItems([...paymentGatewayEngine.getReconciliationItems()]);
      setIsAutoReconciling(false);
    }, 1200);
  };

  // --- 4. CHECKOUT PROJECT M-PESA & E-MOLA (HANDS-ON) ---
  const [checkoutProvider, setCheckoutProvider] = useState<'mpesa' | 'emola'>('mpesa');
  const [checkoutPlanId, setCheckoutPlanId] = useState('medio'); // 250 MT
  const [checkoutPhone, setCheckoutPhone] = useState('841234567');
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'ussd_push' | 'confirmed'>('form');
  const [virtualUssdPin, setVirtualUssdPin] = useState('');
  const [ussdError, setUssdError] = useState<string | null>(null);
  const [checkoutResult, setCheckoutResult] = useState<PaymentResponse | null>(null);

  const selectedPlan = UBLUE_PLANS.find(p => p.id === checkoutPlanId) || UBLUE_PLANS[3];

  const handleInitiateCheckout = () => {
    if (!checkoutPhone || checkoutPhone.length < 8) {
      alert('Por favor insira um número de telefone válido (ex: 841234567 ou 861234567)');
      return;
    }
    setCheckoutStep('ussd_push');
    setVirtualUssdPin('');
    setUssdError(null);
  };

  const handleConfirmUssdPin = async () => {
    if (virtualUssdPin.length !== 4) {
      setUssdError('O PIN deve conter exatamente 4 dígitos.');
      return;
    }

    const req: PaymentRequest = {
      id: `UB-CHK-${Date.now()}`,
      provider: checkoutProvider,
      amountMT: selectedPlan.priceMT,
      phone: `+258${checkoutPhone}`,
      userId: 'UB-CONSUMER-2026',
      customerName: 'Assinante ORBE TV',
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      environment: 'sandbox'
    };

    const res = await paymentGatewayEngine.processPayment(req);
    setCheckoutResult(res);
    setCheckoutStep('confirmed');
    if (onPaymentSuccess && res.success) {
      onPaymentSuccess(selectedPlan.id);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Sub-navigation bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        <button
          onClick={() => setSubSection('checkout_project')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            subSection === 'checkout_project'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Smartphone className="w-4 h-4 text-cyan-300" />
          <span>Projeto: Checkout M-Pesa & e-Mola</span>
          <span className="px-1.5 py-0.2 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px]">Hands-on</span>
        </button>

        <button
          onClick={() => setSubSection('apis_webhooks')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            subSection === 'apis_webhooks'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Code2 className="w-4 h-4 text-emerald-300" />
          <span>APIs REST, Autenticação & Webhooks</span>
        </button>

        <button
          onClick={() => setSubSection('sandbox_idempotency')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            subSection === 'sandbox_idempotency'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-lg shadow-purple-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Zap className="w-4 h-4 text-purple-300" />
          <span>Sandbox & Idempotência (UUID)</span>
        </button>

        <button
          onClick={() => setSubSection('reconciliation')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            subSection === 'reconciliation'
              ? 'bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <RefreshCw className="w-4 h-4 text-amber-300" />
          <span>Reconciliação Diária & Extratos</span>
        </button>
      </div>

      {/* 1. PROJETO CHECKOUT INTERATIVO M-PESA & E-MOLA */}
      {subSection === 'checkout_project' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-cyan-950/50 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono uppercase tracking-wider mb-1">
                <span>Laboratório de Pagamentos Móveis Moçambique</span>
                <span>•</span>
                <span>Vodacom M-Pesa + Movitel e-Mola</span>
              </div>
              <h3 className="text-lg font-black text-white">
                Simulador Hands-on: Experiência de Checkout do Assinante
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Teste o fluxo ponta a ponta: seleção do plano ORBE TV, envio da notificação USSD Push ao telemóvel do cliente (*150# / *898#), digitação do PIN na tela do aparelho, ativação atômica e emissão da factura fiscal.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                GATEWAYS ONLINE D+0
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Coluna Esquerda: Configuração do Checkout (7 Colunas) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Seleção do Prestador */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  1. Escolha o Prestador de Carteira Móvel (Moçambique)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setCheckoutProvider('mpesa');
                      if (checkoutPhone.startsWith('86') || checkoutPhone.startsWith('87')) setCheckoutPhone('841234567');
                    }}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                      checkoutProvider === 'mpesa'
                        ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-black text-emerald-400">Vodacom M-Pesa</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        *150# USSD
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Rede Vodacom (84/85) · Taxa 1.5% · Liquidação instantânea
                    </p>
                    {checkoutProvider === 'mpesa' && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setCheckoutProvider('emola');
                      if (checkoutPhone.startsWith('84') || checkoutPhone.startsWith('85')) setCheckoutPhone('861234567');
                    }}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                      checkoutProvider === 'emola'
                        ? 'bg-amber-950/40 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-black text-amber-400">Movitel e-Mola</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        *898# USSD
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Rede Movitel (86/87) · Taxa 1.2% · Liquidação instantânea
                    </p>
                    {checkoutProvider === 'emola' && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400" />
                    )}
                  </button>
                </div>

                {/* Seleção de Pacote */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    2. Escolha o Pacote de Streaming ORBE TV
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'start', name: 'Start', price: 25, period: 'Semanal' },
                      { id: 'basic', name: 'Basic', price: 100, period: 'Mensal' },
                      { id: 'medio', name: 'Médio', price: 250, period: 'Mensal' },
                      { id: 'max', name: 'Max 4K', price: 500, period: 'Mensal' },
                    ].map(p => (
                      <button
                        key={p.id}
                        onClick={() => setCheckoutPlanId(p.id)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          checkoutPlanId === p.id
                            ? 'bg-blue-600/30 border-blue-400 text-white font-bold shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-xs font-semibold text-slate-300">{p.name}</div>
                        <div className="text-base font-black text-cyan-300 my-0.5">{p.price} MT</div>
                        <div className="text-[10px] text-slate-400">{p.period}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* MSISDN Input */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    3. Número de Telefone Móvel (MSISDN):
                  </label>
                  <div className="flex items-center rounded-xl bg-slate-950 border border-slate-700 px-3 py-2.5 focus-within:border-cyan-400 transition-colors">
                    <span className="text-xs text-slate-400 font-mono mr-2">+258</span>
                    <input
                      type="text"
                      value={checkoutPhone}
                      onChange={(e) => setCheckoutPhone(e.target.value)}
                      placeholder={checkoutProvider === 'mpesa' ? '84 123 4567' : '86 123 4567'}
                      className="bg-transparent text-white font-mono text-sm w-full focus:outline-none"
                    />
                    <span className="text-[11px] text-slate-400 font-mono px-2 py-0.5 rounded bg-slate-800">
                      {checkoutProvider === 'mpesa' ? 'Vodacom' : 'Movitel'}
                    </span>
                  </div>
                </div>

                {/* Ação de Iniciar */}
                {checkoutStep === 'form' && (
                  <button
                    onClick={handleInitiateCheckout}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-black text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Disparar Push USSD ({selectedPlan.priceMT} MT)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {checkoutStep !== 'form' && (
                  <button
                    onClick={() => {
                      setCheckoutStep('form');
                      setVirtualUssdPin('');
                      setCheckoutResult(null);
                    }}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                  >
                    ← Alterar dados ou reiniciar simulação
                  </button>
                )}
              </div>

              {/* Informações Técnicas da Transação */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Protocolo de Integração:</span>
                  <span className="font-mono text-cyan-300">
                    {checkoutProvider === 'mpesa' ? 'OpenAPI C2B v2 (REST/JSON)' : 'e-Mola Direct API v1'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Autenticação:</span>
                  <span className="font-mono text-slate-300">Bearer Token + Chave RSA Pública</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Tempo Médio de Resposta:</span>
                  <span className="font-mono text-emerald-400">800ms - 1.5s</span>
                </div>
              </div>
            </div>

            {/* Coluna Direita: Simulador de Smartphone Físico (5 Colunas) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="text-xs font-mono text-slate-400 mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Simulador de Aparelho do Assinante</span>
              </div>

              {/* Moldura de Smartphone Elegante */}
              <div className="w-[310px] rounded-[38px] bg-slate-950 p-3.5 border-4 border-slate-700 shadow-2xl shadow-blue-900/30 relative">
                {/* Speaker e Câmera */}
                <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-3 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-900" />
                  <div className="w-8 h-1 bg-slate-700 rounded-full" />
                </div>

                {/* Ecrã do Celular */}
                <div className="w-full min-h-[460px] bg-gradient-to-b from-[#060a1a] to-[#0a102a] rounded-[26px] p-4 flex flex-col justify-between border border-slate-800 text-center relative overflow-hidden">
                  {/* Status Bar */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono border-b border-slate-800/50 pb-1.5">
                    <span>{new Date().toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="uppercase text-cyan-400 font-bold">
                      {checkoutProvider === 'mpesa' ? 'Vodacom 4G' : 'Movitel 4G'}
                    </span>
                    <span>100% 🔋</span>
                  </div>

                  {/* Estado 1: Aguardando Disparo */}
                  {checkoutStep === 'form' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-10">
                      <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Smartphone className="w-8 h-8" />
                      </div>
                      <h4 className="text-sm font-bold text-white">Ecrã de Espera</h4>
                      <p className="text-[11px] text-slate-400 px-4">
                        Clique no botão &quot;Disparar Push USSD&quot; no painel ao lado para receber a solicitação de pagamento.
                      </p>
                    </div>
                  )}

                  {/* Estado 2: Diálogo USSD Push na Tela */}
                  {checkoutStep === 'ussd_push' && (
                    <div className="flex-1 flex flex-col justify-center space-y-4 py-4 animate-scale-in">
                      <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 text-left shadow-xl space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400 border-b border-slate-800 pb-2">
                          <span>{checkoutProvider === 'mpesa' ? 'M-PESA NOTIFICAÇÃO' : 'E-MOLA NOTIFICAÇÃO'}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">C2B</span>
                        </div>

                        <p className="text-xs text-slate-200 leading-relaxed font-sans">
                          Deseja pagar <strong className="text-emerald-400">{selectedPlan.priceMT}.00 MT</strong> para <strong className="text-white">UBLUE TV SERVIÇOS DIGITAIS</strong> (Ref: {selectedPlan.name})?
                        </p>

                        <div className="pt-2">
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                            Digite seu PIN de 4 dígitos:
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            value={virtualUssdPin}
                            onChange={(e) => setVirtualUssdPin(e.target.value.replace(/\D/g, ''))}
                            placeholder="••••"
                            className="w-full text-center tracking-widest text-lg font-mono bg-slate-950 border border-cyan-400/50 rounded-xl py-2 text-white focus:outline-none focus:border-cyan-300"
                          />
                        </div>

                        {ussdError && (
                          <p className="text-[10px] text-rose-400 font-medium">{ussdError}</p>
                        )}

                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={() => setCheckoutStep('form')}
                            className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleConfirmUssdPin}
                            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-xs font-bold text-white shadow-md cursor-pointer"
                          >
                            Confirmar PIN
                          </button>
                        </div>
                      </div>

                      {/* Teclado Numérico Virtual */}
                      <div className="grid grid-cols-3 gap-1.5 pt-2">
                        {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '✓'].map((k) => (
                          <button
                            key={k}
                            onClick={() => {
                              if (k === 'C') setVirtualUssdPin('');
                              else if (k === '✓') handleConfirmUssdPin();
                              else if (virtualUssdPin.length < 4) setVirtualUssdPin(prev => prev + k);
                            }}
                            className="py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-white font-mono text-sm font-bold border border-slate-800/80 cursor-pointer active:scale-95 transition-transform"
                          >
                            {k}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Estado 3: Sucesso e Recibo Digital */}
                  {checkoutStep === 'confirmed' && checkoutResult && (
                    <div className="flex-1 flex flex-col justify-center space-y-3 py-4 animate-fade-in text-left">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>

                      <div className="text-center">
                        <h4 className="text-sm font-black text-white">Transação Aprovada!</h4>
                        <p className="text-[11px] text-emerald-300">
                          Plano {selectedPlan.name} ativado instantaneamente na ORBE TV.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[10px] space-y-1.5 font-mono text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Recibo:</span>
                          <span className="text-cyan-300 font-bold">{checkoutResult.referenceId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Valor Cobrado:</span>
                          <span className="text-white font-bold">{checkoutResult.amountMT} MT</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Taxa Rede ({checkoutResult.provider}):</span>
                          <span>{checkoutResult.feeMT} MT</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Código Autorização:</span>
                          <span className="text-emerald-400">{checkoutResult.responseCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">NUIT Fiscal ORBE:</span>
                          <span>400892104</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setCheckoutStep('form');
                          setVirtualUssdPin('');
                          setCheckoutResult(null);
                        }}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md cursor-pointer text-center"
                      >
                        Nova Simulação de Compra
                      </button>
                    </div>
                  )}

                  {/* Home indicator bar */}
                  <div className="w-20 h-1 bg-slate-700 rounded-full mx-auto mt-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. APIS REST, AUTENTICAÇÃO & WEBHOOKS */}
      {subSection === 'apis_webhooks' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Especificação e Gerador de Código */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-black text-white text-sm">Explorador de APIs REST ORBE Gateway</h4>
                </div>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  {(['curl', 'typescript', 'python', 'php'] as const).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                        selectedLanguage === lang
                          ? 'bg-emerald-500 text-slate-950'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Endpoint Selector */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setApiEndpointMode('mpesa_c2b')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    apiEndpointMode === 'mpesa_c2b'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  POST /c2bPayment/singleStage
                </button>
                <button
                  onClick={() => setApiEndpointMode('emola_ussd')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    apiEndpointMode === 'emola_ussd'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  POST /emola/initiatePush
                </button>
                <button
                  onClick={() => setApiEndpointMode('webhook_verify')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    apiEndpointMode === 'webhook_verify'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Verificar HMAC-SHA256
                </button>
              </div>

              {/* Code Snippet Box */}
              <div className="relative rounded-xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                <button
                  onClick={() => handleCopy(getCodeSnippet(apiEndpointMode, selectedLanguage), 'code-snippet')}
                  className="absolute top-3 right-3 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedKey === 'code-snippet' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'code-snippet' ? 'Copiado' : 'Copiar'}</span>
                </button>
                <pre className="text-[11px] leading-relaxed">
                  <code>{getCodeSnippet(apiEndpointMode, selectedLanguage)}</code>
                </pre>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1">
                <p><strong>Autenticação:</strong> Bearer Token gerado via troca de <code className="text-cyan-300 font-mono">API Key</code> criptografada com a chave pública RSA 2048-bit da Vodacom/Movitel.</p>
                <p><strong>Segurança:</strong> Comunicação restrita via TLS 1.3 com Whitelist de IPs de servidores ORBE em Maputo.</p>
              </div>
            </div>

            {/* Painel de Webhooks Interativo */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <h4 className="font-black text-white text-sm">Disparador & Inspetor de Webhooks</h4>
                </div>
                <button
                  onClick={handleDispatchTestWebhook}
                  disabled={isSendingWebhook}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Send className={`w-3.5 h-3.5 ${isSendingWebhook ? 'animate-spin' : ''}`} />
                  <span>{isSendingWebhook ? 'Disparando...' : 'Testar Disparo'}</span>
                </button>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">URL de Destino do Webhook:</label>
                <input
                  type="text"
                  value={testWebhookUrl}
                  onChange={(e) => setTestWebhookUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Chave Secreta para Assinatura (HMAC Secret):</label>
                <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 px-3 py-2">
                  <Lock className="w-3.5 h-3.5 text-slate-400 mr-2" />
                  <input
                    type="password"
                    value={webhookSecretKey}
                    onChange={(e) => setWebhookSecretKey(e.target.value)}
                    className="w-full bg-transparent text-xs font-mono text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Log Recente de Webhooks */}
              <div>
                <label className="text-xs text-slate-400 block mb-2 font-bold uppercase tracking-wider">
                  Histórico de Eventos Disparados ({webhookLogs.length})
                </label>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {webhookLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-emerald-400">{log.event}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 truncate">
                        Assinatura: <span className="text-amber-300">{log.signature}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-slate-900">
                        <span>Ref: {log.payload.referenceId || log.payload.transactionId}</span>
                        <span className="font-bold text-cyan-300">{log.payload.amountMT} MT</span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                          HTTP {log.responseStatus} OK
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SANDBOX & IDEMPOTÊNCIA */}
      {subSection === 'sandbox_idempotency' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                <span>Prevenção de Cobranças Duplicadas via Chave de Idempotência</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Em redes móveis na África Subsaariana com perda de pacotes ou instabilidade de sinal, requisições repetidas podem debitar o cliente duas vezes. O cabeçalho <code className="text-purple-300 font-mono">X-Idempotency-Key</code> garante execução única e atômica.
              </p>
            </div>
            <div className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 text-xs font-mono font-bold border border-purple-500/30">
              IDEMPOTENCY ENGINE v2.4
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Painel de Teste de Idempotência */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-sm">Disparar Teste de Idempotência</h4>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-slate-400">X-Idempotency-Key (UUID / Chave Única):</label>
                  <button
                    onClick={handleGenerateNewIdempotencyKey}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
                  >
                    + Gerar Nova Chave
                  </button>
                </div>
                <input
                  type="text"
                  value={idempotencyKey}
                  onChange={(e) => setIdempotencyKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Prestador:</label>
                  <select
                    value={sandboxProvider}
                    onChange={(e) => setSandboxProvider(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="mpesa">M-Pesa (Vodacom)</option>
                    <option value="emola">e-Mola (Movitel)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Valor (MT):</label>
                  <input
                    type="number"
                    value={sandboxAmount}
                    onChange={(e) => setSandboxAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Simular Cenário de Erro:</label>
                <select
                  value={simulatedFailure}
                  onChange={(e) => setSimulatedFailure(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="none">Cenário Normal (Sucesso 200 INS-0)</option>
                  <option value="insufficient_funds">Saldo Insuficiente (INS-10)</option>
                  <option value="user_cancel">Cancelado pelo Utilizador no USSD</option>
                </select>
              </div>

              <button
                onClick={handleTestIdempotentExecution}
                disabled={isProcessingSandbox}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-4 h-4 text-yellow-300" />
                <span>
                  {isProcessingSandbox ? 'Processando...' : 'Executar Chamada com Chave de Idempotência'}
                </span>
              </button>

              {lastSandboxResponse && (
                <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 animate-fade-in ${
                  lastSandboxResponse.cached
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                    : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                }`}>
                  <div className="flex items-center justify-between font-bold">
                    <span>
                      {lastSandboxResponse.cached
                        ? '⚡ RESPOSTA RECUPERADA DO CACHE ATÔMICO'
                        : '✓ TRANSAÇÃO NOVA PROCESSADA'}
                    </span>
                    <span className="font-mono text-[10px]">
                      {lastSandboxResponse.cached ? 'X-Cache: HIT-IDEMPOTENT' : 'X-Cache: MISS-STORED'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {lastSandboxResponse.response.responseDescription}
                  </p>
                  <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                    ID: {lastSandboxResponse.response.transactionId} | Ref: {lastSandboxResponse.response.referenceId}
                  </div>
                </div>
              )}
            </div>

            {/* Tabela de Chaves no Cache */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-bold text-white text-sm">Chaves Registadas na Memória Atômica</h4>
                <span className="text-xs font-mono text-slate-400">{idempotencyHistory.length} chaves ativas</span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {idempotencyHistory.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">Nenhuma chave gerada ainda nesta sessão.</p>
                ) : (
                  idempotencyHistory.map((item) => (
                    <div
                      key={item.key}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-purple-300 truncate max-w-[200px]">
                          {item.key}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(item.createdAt).toLocaleTimeString('pt-MZ')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Hash: {item.requestHash}</span>
                        <span className="text-emerald-400 font-bold">{item.response.amountMT} MT</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. RECONCILIAÇÃO CONTÁBIL DIÁRIA */}
      {subSection === 'reconciliation' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-amber-400" />
                <span>Reconciliação Automática: Extrato das Operadoras vs Ledger Interno ORBE</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Compara os arquivos MT940 / CSV fornecidos pela Vodacom M-Pesa e Movitel e-Mola com os registos internos de assinaturas para identificar transações órfãs, falhas de webhook ou divergências de comissões.
              </p>
            </div>
            <button
              onClick={handleRunAutoReconciliation}
              disabled={isAutoReconciling}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${isAutoReconciling ? 'animate-spin' : ''}`} />
              <span>{isAutoReconciling ? 'Conciliando Extratos...' : 'Executar Auto-Conciliação'}</span>
            </button>
          </div>

          {/* Lista de Registos da Conciliação */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h4 className="font-bold text-white text-sm">Transações do Fechamento Diário</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
                  <tr>
                    <th className="p-3">Ref Externa</th>
                    <th className="p-3">Prestador</th>
                    <th className="p-3 text-right">Extrato Operadora</th>
                    <th className="p-3 text-right">Ledger ORBE</th>
                    <th className="p-3 text-right">Comissão</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {reconciliationItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-950/40 transition-colors">
                      <td className="p-3 font-mono font-bold text-cyan-300">{item.externalRef}</td>
                      <td className="p-3 uppercase font-mono text-[11px] text-slate-300">{item.provider}</td>
                      <td className="p-3 text-right font-mono text-white font-bold">{item.operatorAmountMT} MT</td>
                      <td className="p-3 text-right font-mono text-slate-300">{item.internalAmountMT} MT</td>
                      <td className="p-3 text-right font-mono text-slate-400">{item.operatorFeeMT} MT</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'matched'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : item.status === 'fee_discrepancy'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {item.status === 'matched'
                            ? 'CONCILIADO'
                            : item.status === 'fee_discrepancy'
                            ? 'DIFERENÇA TAXA'
                            : 'ÓRFÃO NO EXTRATO'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {!item.resolved ? (
                          <button
                            onClick={() => handleResolveReconciliation(item.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold cursor-pointer transition-colors"
                          >
                            Conciliar
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-mono">OK</span>
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
    </div>
  );
};

// Helper for generating code snippets
function getCodeSnippet(endpoint: 'mpesa_c2b' | 'emola_ussd' | 'webhook_verify', lang: 'curl' | 'typescript' | 'python' | 'php'): string {
  if (endpoint === 'mpesa_c2b') {
    if (lang === 'typescript') {
      return `import axios from 'axios';

// Iniciar Pagamento C2B M-Pesa Moçambique
export async function initiateMpesaPayment(params: {
  amount: number;
  phone: string; // 25884xxxxxxx
  reference: string;
}) {
  const token = await getMpesaBearerToken();

  const response = await axios.post(
    'https://api.sandbox.vm.co.mz:18352/ipg/v1x/c2bPayment/singleStage/',
    {
      input_TransactionReference: params.reference,
      input_CustomerMSISDN: params.phone,
      input_Amount: params.amount.toString(),
      input_ThirdPartyReference: \`UB-\${Date.now()}\`,
      input_ServiceProviderCode: '171717'
    },
    {
      headers: {
        'Authorization': \`Bearer \${token}\`,
        'X-Idempotency-Key': crypto.randomUUID(),
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data; // { output_ResponseCode: "INS-0", ... }
}`;
    }
    if (lang === 'curl') {
      return `curl -X POST https://api.sandbox.vm.co.mz:18352/ipg/v1x/c2bPayment/singleStage/ \\
  -H "Authorization: Bearer <BEARER_TOKEN>" \\
  -H "X-Idempotency-Key: e827d042-8391-49b2-b139-2a91040a4911" \\
  -H "Content-Type: application/json" \\
  -d '{
    "input_TransactionReference": "UBLUE-MEDIO",
    "input_CustomerMSISDN": "258841234567",
    "input_Amount": "250",
    "input_ThirdPartyReference": "UB-9481920",
    "input_ServiceProviderCode": "171717"
  }'`;
    }
    if (lang === 'python') {
      return `import requests
import uuid

def initiate_mpesa_payment(amount: float, phone: str, reference: str):
    url = "https://api.sandbox.vm.co.mz:18352/ipg/v1x/c2bPayment/singleStage/"
    headers = {
        "Authorization": f"Bearer {get_token()}",
        "X-Idempotency-Key": str(uuid.uuid4()),
        "Content-Type": "application/json"
    }
    payload = {
        "input_TransactionReference": reference,
        "input_CustomerMSISDN": phone,
        "input_Amount": str(amount),
        "input_ThirdPartyReference": f"UB-{uuid.uuid4().hex[:8]}",
        "input_ServiceProviderCode": "171717"
    }
    response = requests.post(url, json=payload, headers=headers)
    return response.json()`;
    }
    return `<?php
// PHP cURL M-Pesa C2B
$ch = curl_init('https://api.sandbox.vm.co.mz:18352/ipg/v1x/c2bPayment/singleStage/');
$data = json_encode([
    'input_TransactionReference' => 'UBLUE-MEDIO',
    'input_CustomerMSISDN' => '258841234567',
    'input_Amount' => '250',
    'input_ThirdPartyReference' => 'UB-' . time(),
    'input_ServiceProviderCode' => '171717'
]);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $bearerToken,
    'X-Idempotency-Key: ' . uniqid('idem_', true),
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
?>`;
  }

  if (endpoint === 'emola_ussd') {
    return `// Iniciação USSD Movitel e-Mola *898#
POST https://api.emola.movitel.co.mz/v1/direct-charge
Headers:
  Authorization: Bearer <EMOLA_AUTH_TOKEN>
  X-Idempotency-Key: <UUIDv4>
  Content-Type: application/json

Body:
{
  "merchantId": "UBLUE_ENTERTAINMENT_MZ",
  "msisdn": "258861234567",
  "amount": 250.00,
  "currency": "MZN",
  "orderId": "UB-ORDER-882194",
  "callbackUrl": "https://api.ubluetv.mz/v1/webhooks/emola"
}`;
  }

  return `import crypto from 'crypto';

// Validação de Assinatura Webhook (HMAC-SHA256)
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string,
  webhookSecret: string
): boolean {
  // Cabeçalho no formato: t=1728900000,v1=a849f1...
  const parts = signatureHeader.split(',');
  const timestamp = parts.find(p => p.startsWith('t='))?.replace('t=', '');
  const signature = parts.find(p => p.startsWith('v1='))?.replace('v1=', '');

  if (!timestamp || !signature) return false;

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(\`\${timestamp}.\${rawBody}\`)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}`;
}
