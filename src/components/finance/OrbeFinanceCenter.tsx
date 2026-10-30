import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Smartphone,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  FileText,
  DollarSign,
  Download,
  Users,
  Search,
  Filter,
  Check,
  X,
  ExternalLink,
  Building,
  Key,
  PieChart,
  BarChart3,
  Tv,
  Sparkles,
  Zap,
  Code2,
  Globe
} from 'lucide-react';
import {
  ubluePaymentEngine,
  LedgerTransaction,
  VendorPayoutRequest,
  AdCampaign,
  DailyReconciliationReport,
  PaymentProvider
} from '../../engine/payment-engine';
import { UBLUE_PLANS } from '../../data/mock-content';
import { SubscriptionTier, UserProfile } from '../../types/content';
import { TechnicalIntegrationLab } from './TechnicalIntegrationLab';
import { InternationalPaymentsLab } from './InternationalPaymentsLab';
import { SecurityComplianceLab } from './SecurityComplianceLab';

interface OrbeFinanceCenterProps {
  onBackToPortal?: () => void;
  currentUser?: UserProfile;
  onOpenPaymentModal?: (tier: SubscriptionTier) => void;
}

export const OrbeFinanceCenter: React.FC<OrbeFinanceCenterProps> = ({
  onBackToPortal,
  currentUser,
  onOpenPaymentModal
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'tech-lab'
    | 'international'
    | 'compliance'
    | 'checkout'
    | 'mpesa-lab'
    | 'ledger'
    | 'fraud-refunds'
    | 'vendor-payouts'
    | 'ads-engine'
    | 'dossier'
  >('tech-lab');

  const [transactions, setTransactions] = useState<LedgerTransaction[]>(() =>
    ubluePaymentEngine.getTransactions()
  );
  const [vendorPayouts, setVendorPayouts] = useState<VendorPayoutRequest[]>(() =>
    ubluePaymentEngine.getVendorPayouts()
  );
  const [adCampaigns, setAdCampaigns] = useState<AdCampaign[]>(() =>
    ubluePaymentEngine.getAdCampaigns()
  );
  const [reconciliation, setReconciliation] = useState<DailyReconciliationReport>(() =>
    ubluePaymentEngine.generateReconciliationReport()
  );

  // Subscribe to engine state
  useEffect(() => {
    const unsub = ubluePaymentEngine.subscribe(() => {
      setTransactions(ubluePaymentEngine.getTransactions());
      setVendorPayouts(ubluePaymentEngine.getVendorPayouts());
      setAdCampaigns(ubluePaymentEngine.getAdCampaigns());
      setReconciliation(ubluePaymentEngine.generateReconciliationReport());
    });
    return unsub;
  }, []);

  // Sandbox M-Pesa Interactive States
  const [sandboxPhone, setSandboxPhone] = useState('841234567');
  const [sandboxAmount, setSandboxAmount] = useState('100');
  const [sandboxTier, setSandboxTier] = useState<SubscriptionTier>('basic');
  const [sandboxLog, setSandboxLog] = useState<string[]>([
    'Iniciando M-Pesa OpenAPI Sandbox v1.4 (Vodafone Vodacom MZ)...',
    'Chave de API do servidor configurada com sucesso.',
    'Endpoint C2B: https://api.sandbox.vm.co.mz:18352/ipg/v1x/c2bPayment/singleStage/',
    'Aguardando testes de transação...'
  ]);
  const [isSimulatingApi, setIsSimulatingApi] = useState(false);
  const [queryTxId, setQueryTxId] = useState('MPESA-TX-849201');
  const [queryResult, setQueryResult] = useState<string | null>(null);

  // Refund states
  const [refundTargetId, setRefundTargetId] = useState('');
  const [refundReason, setRefundReason] = useState('Cobrança em duplicidade relatada pelo cliente');
  const [noticeMessage, setNoticeMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Vendor Payout Form
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorCategory, setNewVendorCategory] = useState<VendorPayoutRequest['category']>('Criador UBlue Originals');
  const [newVendorAmount, setNewVendorAmount] = useState('15000');
  const [newVendorProvider, setNewVendorProvider] = useState<PaymentProvider>('mpesa');
  const [newVendorPhone, setNewVendorPhone] = useState('84 000 1122');
  const [newVendorDesc, setNewVendorDesc] = useState('Pagamento de licença de conteúdo');

  // Interactive C2B Payment in Sandbox
  const handleSimulateC2BPush = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulatingApi(true);

    const plan = UBLUE_PLANS.find(p => p.id === sandboxTier) || UBLUE_PLANS[2];

    setSandboxLog(prev => [
      `[${new Date().toLocaleTimeString()}] > POST /c2bPayment/singleStage/ { amount: "${sandboxAmount}", phone: "258${sandboxPhone}", ref: "UBLUE-${sandboxTier.toUpperCase()}" }`,
      ...prev
    ]);

    setTimeout(async () => {
      const res = await ubluePaymentEngine.processCheckout({
        tier: sandboxTier,
        planName: plan.name,
        amountMT: Number(sandboxAmount),
        provider: 'mpesa',
        phone: `+258 ${sandboxPhone}`,
        userId: currentUser?.id || 'UB-842910',
        userName: currentUser?.name || 'Cliente M-Pesa'
      });

      setIsSimulatingApi(false);
      setSandboxLog(prev => [
        `[${new Date().toLocaleTimeString()}] < HTTP 200 OK: ConversationID: "${res.transaction.conversationId}", ResponseCode: "INS-0", TransactionID: "${res.transaction.referenceId}"`,
        `[${new Date().toLocaleTimeString()}] ✓ Webhook disparado com assinatura HMAC-SHA256 validada com sucesso!`,
        ...prev
      ]);

      setNoticeMessage({
        text: `Transação M-Pesa de ${sandboxAmount} MT processada e registrada no Livro-Razão!`,
        type: 'success'
      });
    }, 1200);
  };

  const handleQueryStatus = () => {
    const found = transactions.find(t => t.referenceId.toLowerCase() === queryTxId.toLowerCase() || t.id.toLowerCase() === queryTxId.toLowerCase());
    if (found) {
      setQueryResult(
        `STATUS: ${found.status} | Valor: ${found.amountMT} MT | Prestador: ${found.provider.toUpperCase()} | Data: ${found.timestamp} | Score Fraude: ${found.fraudScore}/100`
      );
    } else {
      setQueryResult(`Transação "${queryTxId}" não localizada na base do prestador.`);
    }
  };

  const handleExecuteRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundTargetId) {
      setNoticeMessage({ text: 'Informe o ID da transação a reembolsar!', type: 'error' });
      return;
    }

    const res = await ubluePaymentEngine.requestRefund(refundTargetId, refundReason, 'admin_financas');
    setNoticeMessage({
      text: res.message,
      type: res.success ? 'success' : 'error'
    });
    if (res.success) {
      setRefundTargetId('');
    }
  };

  const handleCreateVendorPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorName || Number(newVendorAmount) <= 0) {
      setNoticeMessage({ text: 'Preencha o nome do fornecedor e o valor correto!', type: 'error' });
      return;
    }

    ubluePaymentEngine.createVendorPayout({
      vendorName: newVendorName,
      category: newVendorCategory,
      amountMT: Number(newVendorAmount),
      provider: newVendorProvider,
      accountPhone: newVendorPhone,
      initiatorAdmin: 'admin_producao',
      description: newVendorDesc
    });

    setNoticeMessage({
      text: `Lote de pagamento de ${newVendorAmount} MT criado para "${newVendorName}" aguardando 2ª aprovação de segurança!`,
      type: 'success'
    });

    setNewVendorName('');
    setNewVendorAmount('15000');
  };

  const handleApprovePayout = (payoutId: string) => {
    const res = ubluePaymentEngine.approveVendorPayout(payoutId, 'superadmin_inacio');
    setNoticeMessage({
      text: res.message,
      type: res.success ? 'success' : 'error'
    });
  };

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col font-sans text-left">
      
      {/* Top Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-white">
                  UBlue Payment Engine & Ads Hub
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/40">
                  Fase 2 & 3
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Checkout de Pacotes, M-Pesa Sandbox, Livro-Razão, Reconciliação, Desembolsos B2B e Publicidade
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onBackToPortal && (
              <button
                onClick={onBackToPortal}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                Voltar ao Portal
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notice Banner */}
      {noticeMessage && (
        <div className="max-w-7xl mx-auto px-4 mt-4 w-full">
          <div className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-2 shadow-lg animate-fade-in ${
            noticeMessage.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
              : 'bg-red-950/80 border-red-500/50 text-red-300'
          }`}>
            <span className="font-semibold">{noticeMessage.text}</span>
            <button
              onClick={() => setNoticeMessage(null)}
              className="text-slate-400 hover:text-white font-bold px-2 py-0.5 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Body with Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none text-xs font-bold">
          <button
            onClick={() => setActiveTab('tech-lab')}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'tech-lab'
                ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4 text-cyan-300" />
            <span>Integração Técnica (Hands-on)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px]">M-Pesa & e-Mola</span>
          </button>

          <button
            onClick={() => setActiveTab('international')}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'international'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-300" />
            <span>6. Pagamentos Internacionais</span>
          </button>

          <button
            onClick={() => setActiveTab('compliance')}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'compliance'
                ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>7. Segurança, Compliance & Regulação</span>
          </button>

          <button
            onClick={() => setActiveTab('checkout')}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'checkout'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Checkout de Pacotes (25–500 MT)</span>
          </button>

          <button
            onClick={() => setActiveTab('mpesa-lab')}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'mpesa-lab'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-yellow-300" />
            <span>M-Pesa OpenAPI & Sandbox</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'ledger'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Livro-Razão & Reconciliação</span>
          </button>

          <button
            onClick={() => setActiveTab('fraud-refunds')}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'fraud-refunds'
                ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Alertas de Fraude & Reembolsos</span>
          </button>

          <button
            onClick={() => setActiveTab('vendor-payouts')}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'vendor-payouts'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Pagamentos Fornecedores (B2B)</span>
          </button>

          <button
            onClick={() => setActiveTab('ads-engine')}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'ads-engine'
                ? 'bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>UBlue Ads Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('dossier')}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'dossier'
                ? 'bg-gradient-to-r from-slate-700 to-slate-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Dossiê & Termos</span>
          </button>
        </div>

        {/* TAB: INTEGRAÇÃO TÉCNICA (HANDS-ON) */}
        {activeTab === 'tech-lab' && (
          <TechnicalIntegrationLab
            onPaymentSuccess={(tier) => {
              if (onOpenPaymentModal) onOpenPaymentModal(tier as any);
            }}
          />
        )}

        {/* TAB: PAGAMENTOS INTERNACIONAIS */}
        {activeTab === 'international' && (
          <InternationalPaymentsLab />
        )}

        {/* TAB: SEGURANÇA, COMPLIANCE & REGULAÇÃO */}
        {activeTab === 'compliance' && (
          <SecurityComplianceLab />
        )}

        {/* TAB 1: CHECKOUT DOS PACOTES */}
        {activeTab === 'checkout' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-950/60 via-slate-900 to-slate-950 border border-blue-500/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-black text-white">
                    Checkout Oficial de Pacotes UBlue TV
                  </h2>
                  <p className="text-xs text-slate-400">
                    Ativação automática através de carteiras móveis nacionais e cartões bancários.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400">Seu ID de Assinante:</span>
                  <span className="px-3 py-1 rounded-xl bg-blue-900/60 text-cyan-300 font-mono font-bold border border-blue-500/40">
                    {currentUser?.id || 'UB-842910'}
                  </span>
                </div>
              </div>

              {/* 4 Packages Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {UBLUE_PLANS.filter(p => p.id !== 'free').map((plan) => (
                  <div
                    key={plan.id}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-400/50 flex flex-col justify-between transition-all group shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${plan.badgeColor}`}>
                          {plan.name}
                        </span>
                        {plan.popular && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-blue-600 text-white">
                            Mais Vendido
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-1 my-3">
                        <span className="text-3xl font-black text-white font-mono">{plan.priceMT}</span>
                        <span className="text-sm font-bold text-cyan-400">MT</span>
                        <span className="text-[10px] text-slate-500">/ {plan.period}</span>
                      </div>

                      <p className="text-xs text-slate-300 mb-4 line-clamp-2">
                        {plan.description}
                      </p>

                      <ul className="space-y-1.5 text-[11px] text-slate-400 mb-5">
                        {plan.features.slice(0, 3).map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => onOpenPaymentModal && onOpenPaymentModal(plan.id)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-600/30 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Comprar por {plan.priceMT} MT</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Supported Providers Strip */}
              <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2 font-bold text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Prestadores Nacionais Integrados:</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap font-mono text-[11px]">
                  <span className="px-2.5 py-1 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 font-bold">
                    Vodafone M-Pesa (84/85)
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-orange-950/60 border border-orange-500/40 text-orange-300 font-bold">
                    Movitel e-Mola (86/87)
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-yellow-950/60 border border-yellow-500/40 text-yellow-300 font-bold">
                    TMCEL mKesh (82/83)
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-500/40 text-blue-300 font-bold">
                    Cartões Visa / Mastercard / SIMO
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: M-PESA OPENAPI & SANDBOX LAB */}
        {activeTab === 'mpesa-lab' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Interactive API Request Simulator */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                <Zap className="w-5 h-5 text-yellow-400" />
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Simulador M-Pesa C2B (Customer-to-Business)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Gera solicitação USSD Push no telemóvel do cliente conforme especificação oficial da Vodafone.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSimulateC2BPush} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Número de Celular Vodacom (Moçambique):
                  </label>
                  <div className="flex items-center rounded-xl bg-slate-950 border border-slate-700 overflow-hidden">
                    <span className="px-3 py-2 bg-slate-800 text-slate-300 font-mono text-xs">+258</span>
                    <input
                      type="text"
                      value={sandboxPhone}
                      onChange={(e) => setSandboxPhone(e.target.value)}
                      placeholder="841234567"
                      className="w-full bg-transparent px-3 py-2 text-white font-mono text-xs focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Pacote a Testar:
                    </label>
                    <select
                      value={sandboxTier}
                      onChange={(e) => {
                        const t = e.target.value as SubscriptionTier;
                        setSandboxTier(t);
                        const p = UBLUE_PLANS.find(plan => plan.id === t);
                        if (p) setSandboxAmount(String(p.priceMT));
                      }}
                      className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white"
                    >
                      <option value="start">UBlue Start (25 MT)</option>
                      <option value="basic">UBlue Basic (100 MT)</option>
                      <option value="medio">UBlue Médio (250 MT)</option>
                      <option value="max">UBlue Max (500 MT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Valor a Cobrar (MT):
                    </label>
                    <input
                      type="number"
                      value={sandboxAmount}
                      onChange={(e) => setSandboxAmount(e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white font-mono"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSimulatingApi}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold uppercase tracking-wider shadow-lg shadow-emerald-600/30 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSimulatingApi ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Enviando USSD Push para +258 {sandboxPhone}...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-current" />
                      <span>Disparar API C2B M-Pesa ({sandboxAmount} MT)</span>
                    </>
                  )}
                </button>
              </form>

              {/* Consulta de Estado de Transação */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Consulta de Estado (Query Transaction Status)</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={queryTxId}
                    onChange={(e) => setQueryTxId(e.target.value)}
                    placeholder="Referência ou ID"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                  />
                  <button
                    onClick={handleQueryStatus}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Consultar
                  </button>
                </div>
                {queryResult && (
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
                    {queryResult}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Real-time Developer Console Log */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between font-mono text-xs">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-white">M-Pesa Developer API Console</span>
                  </div>
                  <span className="text-[10px] text-slate-500">HMAC-SHA256 Active</span>
                </div>

                <div className="mt-3 space-y-2 max-h-80 overflow-y-auto text-[11px] text-slate-300">
                  {sandboxLog.map((log, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-lg ${
                        log.startsWith('✓')
                          ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                          : log.startsWith('[') && log.includes('HTTP 200')
                          ? 'bg-blue-950/40 text-cyan-300'
                          : 'bg-slate-900/40 text-slate-400'
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800 text-[10px] text-slate-500">
                Conectado ao Gateway M-Pesa Moçambique. Todas as chaves e segredos são armazenados em ambiente isolado no servidor.
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: LIVRO-RAZÃO (LEDGER) & RECONCILIAÇÃO CONTÁBIL */}
        {activeTab === 'ledger' && (
          <div className="space-y-6">
            
            {/* Daily Reconciliation Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Receita Bruta Liquidada</div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                  {reconciliation.totalGrossMT.toLocaleString('pt-PT')} MT
                </div>
                <div className="text-[10px] text-slate-500 mt-1">{reconciliation.totalTransactionsCount} transações registradas</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">M-Pesa (Vodacom)</div>
                <div className="text-xl sm:text-2xl font-black text-red-400 font-mono">
                  {reconciliation.mpesaShareMT.toLocaleString('pt-PT')} MT
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Canal majoritário (Moçambique)</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">e-Mola + mKesh</div>
                <div className="text-xl sm:text-2xl font-black text-orange-400 font-mono">
                  {(reconciliation.emolaShareMT + reconciliation.mkeshShareMT).toLocaleString('pt-PT')} MT
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Movitel & TMCEL integrados</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Status da Reconciliação</div>
                <div className="text-sm font-black text-emerald-400 flex items-center gap-1.5 mt-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>100% BALANCEADO</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Divergências: 0 MT</div>
              </div>
            </div>

            {/* Transaction Ledger Table */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>Livro-Razão Contábil Imutável (Transaction Ledger)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Todas as transações recebem carimbo cronológico e assinatura criptográfica auditável.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950/60 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">ID / Data</th>
                      <th className="py-2.5 px-3">Cliente / Conta</th>
                      <th className="py-2.5 px-3">Descrição / Pacote</th>
                      <th className="py-2.5 px-3">Prestador</th>
                      <th className="py-2.5 px-3">Valor</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-mono font-bold text-white">{tx.id}</div>
                          <div className="text-[10px] text-slate-500">{tx.timestamp}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-200">{tx.customerName}</div>
                          <div className="text-[10px] font-mono text-slate-400">{tx.phoneOrAccount}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-300">{tx.planName}</div>
                          <div className="text-[10px] font-mono text-cyan-400">{tx.referenceId}</div>
                        </td>
                        <td className="py-3 px-3 uppercase font-mono text-[11px]">
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            tx.provider === 'mpesa'
                              ? 'bg-red-950 text-red-300 border border-red-500/30'
                              : tx.provider === 'emola'
                              ? 'bg-orange-950 text-orange-300 border border-orange-500/30'
                              : tx.provider === 'mkesh'
                              ? 'bg-yellow-950 text-yellow-300 border border-yellow-500/30'
                              : 'bg-blue-950 text-blue-300 border border-blue-500/30'
                          }`}>
                            {tx.provider}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-sm">
                          <span className={tx.amountMT > 0 ? 'text-emerald-400' : 'text-slate-200'}>
                            {tx.amountMT > 0 ? `+${tx.amountMT}` : tx.amountMT} MT
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            tx.status === 'COMPLETED'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : tx.status === 'REVERSED'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                              : 'bg-red-500/20 text-red-300 border border-red-500/40'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: ALERTAS DE FRAUDE & REEMBOLSOS AUDITADOS */}
        {activeTab === 'fraud-refunds' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Alertas de Fraude */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Sistema de Prevenção & Alertas de Fraude
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Regras ativas: detecção de tentativas repetidas, assinatura inválida e IPs duplicados.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-300 font-bold">
                    <span>1. Proteção de Replay / Duplicidade:</span>
                    <span className="text-emerald-400 font-mono">ATIVO (60s Lock)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Bloqueia débitos duplicados de pacotes com mesmo telefone e ID em intervalo inferior a 60 segundos.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-300 font-bold">
                    <span>2. Verificação de Assinatura Webhook:</span>
                    <span className="text-emerald-400 font-mono">HMAC-SHA256 (Obrigatório)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Nenhum pagamento é confirmado sem que o cabeçalho X-Signature corresponda à chave secreta do M-Pesa.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-300 font-bold">
                    <span>3. Separação de Saldos Contábeis:</span>
                    <span className="text-emerald-400 font-mono">Zero Co-Mingling</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    O saldo contábil da UBlue permanece estritamente auditado e separado dos valores líquidos no banco.
                  </p>
                </div>
              </div>
            </div>

            {/* Emissão de Reembolso Auditado */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                <RefreshCw className="w-5 h-5 text-purple-400" />
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Solicitar Reembolso / Reversão de Transação
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Estornos só podem ser emitidos com motivo formal e registo auditável no livro-razão.
                  </p>
                </div>
              </div>

              <form onSubmit={handleExecuteRefund} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    ID da Transação (ex: TX-UB-90412):
                  </label>
                  <input
                    type="text"
                    value={refundTargetId}
                    onChange={(e) => setRefundTargetId(e.target.value)}
                    placeholder="Informe o ID exato da transação"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Motivo Formal do Reembolso:
                  </label>
                  <select
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white"
                  >
                    <option>Cobrança em duplicidade relatada pelo cliente</option>
                    <option>Cancelamento dentro do período de garantia legal</option>
                    <option>Falha de ativação técnica reportada no suporte</option>
                    <option>Solicitação de estorno autorizada pela gerência</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-[11px] text-purple-300">
                  ⚠️ O reembolso estorna o saldo original para a conta móvel ou cartão que efetuou a compra e remove a permissão do pacote.
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-wider cursor-pointer shadow-md"
                >
                  Processar Reversão / Reembolso
                </button>
              </form>
            </div>

          </div>
        )}

        {/* TAB 5: PAGAMENTOS A FORNECEDORES (B2B) */}
        {activeTab === 'vendor-payouts' && (
          <div className="space-y-6">
            
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Building className="w-4 h-4 text-cyan-400" />
                    <span>Pagamentos a Fornecedores & Criadores (B2B Disbursals)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Regra mandatória de segurança: Exige <strong>Dupla Aprovação Administrativa</strong> antes de qualquer transferência.
                  </p>
                </div>
              </div>

              {/* Payouts Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950/60 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Lote / Fornecedor</th>
                      <th className="py-2.5 px-3">Categoria</th>
                      <th className="py-2.5 px-3">Conta / Canal</th>
                      <th className="py-2.5 px-3">Valor</th>
                      <th className="py-2.5 px-3">Aprovações</th>
                      <th className="py-2.5 px-3">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {vendorPayouts.map((po) => (
                      <tr key={po.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-white">{po.vendorName}</div>
                          <div className="text-[10px] font-mono text-slate-500">{po.id} · {po.referenceId}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold">
                            {po.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-300">
                          {po.accountPhone} ({po.provider.toUpperCase()})
                        </td>
                        <td className="py-3 px-3 font-mono font-black text-sm text-white">
                          {po.amountMT.toLocaleString('pt-PT')} MT
                        </td>
                        <td className="py-3 px-3 text-[11px]">
                          <div>Iniciado por: <span className="font-mono text-cyan-400">{po.initiatorAdmin}</span></div>
                          {po.approverAdmin ? (
                            <div className="text-emerald-400 font-semibold">Aprovado: {po.approverAdmin}</div>
                          ) : (
                            <div className="text-amber-400 font-bold">Aguardando 2ª Aprovação</div>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {po.status === 'PENDING_APPROVAL' ? (
                            <button
                              onClick={() => handleApprovePayout(po.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-sm"
                            >
                              Aprovar & Pagar
                            </button>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase">
                              LIQUIDADO
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Create new Disbursal Batch Form */}
              <div className="pt-5 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-200 uppercase mb-3">
                  + Criar Novo Lote de Pagamento para Fornecedor
                </h4>
                <form onSubmit={handleCreateVendorPayout} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Nome da Empresa / Fornecedor:</label>
                    <input
                      type="text"
                      value={newVendorName}
                      onChange={(e) => setNewVendorName(e.target.value)}
                      placeholder="Ex: Rádio e TV Miramar Lda"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Categoria:</label>
                    <select
                      value={newVendorCategory}
                      onChange={(e) => setNewVendorCategory(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option>Criador UBlue Originals</option>
                      <option>Licenciamento de Canal</option>
                      <option>CDN / Infraestrutura</option>
                      <option>Marketing</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Valor (MT):</label>
                    <input
                      type="number"
                      value={newVendorAmount}
                      onChange={(e) => setNewVendorAmount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-slate-400 block mb-1">Conta ou Celular para Desembolso:</label>
                    <input
                      type="text"
                      value={newVendorPhone}
                      onChange={(e) => setNewVendorPhone(e.target.value)}
                      placeholder="+258 84 000 0000 ou IBAN"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                      required
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
                    >
                      Submeter para Dupla Aprovação
                    </button>
                  </div>
                </form>
              </div>

            </div>

          </div>
        )}

        {/* TAB 6: FASE 3 — UBLUE ADS ENGINE & PUBLICIDADE */}
        {activeTab === 'ads-engine' && (
          <div className="space-y-6">
            
            {/* Advertising Performance Metrics */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-950 border border-amber-500/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    UBlue Ads Engine (Contratos Diretos + Google Ad Manager)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Monetização institucional e vídeo-anúncios (Pre-roll, Bumper, Banners EPG) no player da UBlue TV.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/40">
                    Google Ad Manager Ready
                  </span>
                </div>
              </div>

              {/* Active Campaigns Table */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  Campanhas Comerciais em Andamento ({adCampaigns.length})
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {adCampaigns.map((camp) => (
                    <div
                      key={camp.id}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 flex flex-col justify-between transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-mono text-cyan-400 font-bold">{camp.id}</span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase">
                            {camp.status}
                          </span>
                        </div>

                        <div className="font-bold text-white text-sm mb-1">{camp.brandName}</div>
                        <div className="text-xs text-slate-300 mb-2">{camp.campaignTitle}</div>
                        <div className="text-[10px] text-amber-400 font-semibold mb-3">Formato: {camp.format}</div>

                        <div className="space-y-1.5 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 mb-3">
                          <div className="flex justify-between">
                            <span>Orçamento:</span>
                            <strong className="text-white font-mono">{camp.budgetMT.toLocaleString('pt-PT')} MT</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Impressões Entregues:</span>
                            <strong className="text-emerald-400 font-mono">{camp.impressionsDelivered.toLocaleString('pt-PT')}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>CTR Médio:</span>
                            <strong className="text-cyan-300 font-mono">{camp.ctrPercent}%</strong>
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 flex items-center justify-between">
                        <span>CPM: {camp.cpmMT} MT</span>
                        <span>{camp.targetProvinces[0]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Ad Pricing Table */}
              <div className="mt-6 pt-5 border-t border-slate-800/80">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
                  Tabela Oficial de Preços Publicitários UBlue TV (Meticais)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="font-bold text-white mb-0.5">Pre-Roll Vídeo (15s)</div>
                    <div className="text-lg font-black text-amber-400 font-mono">150 MT <span className="text-[10px]">/ CPM</span></div>
                    <div className="text-[10px] text-slate-400">Antes do canal abrir</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="font-bold text-white mb-0.5">Bumper Vídeo (6s)</div>
                    <div className="text-lg font-black text-amber-400 font-mono">100 MT <span className="text-[10px]">/ CPM</span></div>
                    <div className="text-[10px] text-slate-400">Não pulável no player</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="font-bold text-white mb-0.5">Banner no Guia EPG</div>
                    <div className="text-lg font-black text-amber-400 font-mono">80 MT <span className="text-[10px]">/ CPM</span></div>
                    <div className="text-[10px] text-slate-400">Exibição no rodapé da grade</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="font-bold text-white mb-0.5">Patrocínio Master de Canal</div>
                    <div className="text-lg font-black text-amber-400 font-mono">50.000 MT <span className="text-[10px]">/ mês</span></div>
                    <div className="text-[10px] text-slate-400">Watermark e naming rights</div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 7: DOSSIÊ INSTITUCIONAL & TERMOS LEGAIS */}
        {activeTab === 'dossier' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 text-xs text-slate-300">
            <div>
              <h3 className="text-lg font-black text-white mb-1">
                Dossiê Institucional & Políticas de Serviço UBlue TV
              </h3>
              <p className="text-slate-400">
                Documentação preparada para apresentação a operadoras (Vodacom, Movitel, TMCEL), anunciantes e entidades reguladoras de Moçambique.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>1. Dossiê Institucional UBlue TV</span>
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Apresentação corporativa da Universo Blue Comunicações Lda. Inclui audiência mapeada nas 10 províncias de Moçambique, grade de canais ao vivo e ecossistema de distribuição via servidores locais TurboEdge™.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>2. Política de Reembolso & Reclamações</span>
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Garantia de estorno integral em caso de falha de serviço ou cobrança em duplicidade dentro de 7 dias úteis. Processamento diretamente revertido para a carteira de origem (M-Pesa, e-Mola ou mKesh).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-blue-400" />
                  <span>3. Política de Privacidade & Proteção de Dados</span>
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Conformidade rigorosa: jamais armazenamos PINs de carteiras móveis ou dados confidenciais de cartões. Todas as comunicações utilizam criptografia TLS 1.3 e verificação de assinatura HMAC.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-amber-400" />
                  <span>4. Contrato de Patrocínio & Publicidade</span>
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Minuta contratual padrão para marcas moçambicanas, estipulando métricas de entrega, relatórios auditáveis com Google Ad Manager e prazos de pagamento a 30 dias com fatura pró-forma.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
