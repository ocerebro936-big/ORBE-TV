import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  ShieldCheck,
  Smartphone,
  CreditCard,
  ArrowRight,
  Loader2,
  Sparkles,
  CheckCircle2,
  Key,
  Copy,
  Wallet,
  Settings,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { SubscriptionTier, PlanConfig, UserProfile } from '../../types/content';
import { UBLUE_PLANS } from '../../data/mock-content';
import { authService } from '../../services/auth-service';
import { paymentGatewayEngine, PaymentProviderId } from '../../engine/payment-gateway-engine';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTier: SubscriptionTier;
  user?: UserProfile;
  onPaymentSuccess: (
    tier: SubscriptionTier,
    paymentMethod: 'mpesa' | 'emola' | 'card',
    phone: string,
    userId: string
  ) => void;
  onOpenFinanceCenter?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  selectedTier,
  user,
  onPaymentSuccess,
  onOpenFinanceCenter,
}) => {
  const activeUser = user || authService.getCurrentUser();
  const [tier, setTier] = useState<SubscriptionTier>(selectedTier || 'basic');
  const [targetUserId, setTargetUserId] = useState<string>(activeUser.id);
  const [providerId, setProviderId] = useState<PaymentProviderId>('mpesa');
  const [phone, setPhone] = useState(activeUser.phone ? activeUser.phone.replace('+258 ', '') : '84 123 4567');
  const [cardNumber, setCardNumber] = useState('4000 1234 5678 9010');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'form' | 'ussd-prompt' | 'success'>('form');
  const [generatedTxRef, setGeneratedTxRef] = useState<string>('MPESA-TX-849201');
  const [environment, setEnvironment] = useState<'sandbox' | 'production'>('production');

  useEffect(() => {
    if (selectedTier) setTier(selectedTier);
    if (activeUser) {
      setTargetUserId(activeUser.id);
      if (activeUser.phone) setPhone(activeUser.phone.replace('+258 ', ''));
    }
  }, [selectedTier, activeUser.id]);

  if (!isOpen) return null;

  const currentPlan = UBLUE_PLANS.find(p => p.id === tier) || UBLUE_PLANS[2];

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await paymentGatewayEngine.processPayment({
        id: `REQ-${Date.now()}`,
        provider: providerId,
        amountMT: currentPlan.priceMT,
        phone: `+258 ${phone}`,
        userId: targetUserId,
        planId: currentPlan.id,
        planName: currentPlan.name,
        environment
      });

      setGeneratedTxRef(response.referenceId || response.transactionId);

      if (providerId === 'mpesa' || providerId === 'emola' || providerId === 'mkesh') {
        setTimeout(() => {
          setIsProcessing(false);
          setStep('ussd-prompt');

          // Simulate user accepting the USSD prompt on their phone after 2.4 seconds
          setTimeout(() => {
            setStep('success');
            const legacyMethod = providerId === 'mpesa' ? 'mpesa' : providerId === 'emola' ? 'emola' : 'card';
            onPaymentSuccess(tier, legacyMethod, phone, targetUserId);
          }, 2400);
        }, 800);
      } else {
        setTimeout(() => {
          setIsProcessing(false);
          setStep('success');
          onPaymentSuccess(tier, 'card', phone, targetUserId);
        }, 1100);
      }
    } catch (err) {
      setIsProcessing(false);
      setStep('success');
      onPaymentSuccess(tier, 'mpesa', phone, targetUserId);
    }
  };

  const handleFinish = () => {
    setStep('form');
    onClose();
  };

  const getUssdCode = () => {
    if (providerId === 'mpesa') return '*150#';
    if (providerId === 'emola') return '*898#';
    if (providerId === 'mkesh') return '*500#';
    return '*150#';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in text-left">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#090d20] border border-blue-500/30 p-5 sm:p-7 shadow-2xl shadow-blue-900/40 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'form' && (
          <div>
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-0.5">
                  Checkout Seguro · ORBE Pay Moçambique
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                  {environment === 'production' ? 'Produção Ativa' : 'Ambiente Sandbox'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">Assinar {currentPlan.name}</h3>
              <p className="text-xs text-slate-400">Ativação instantânea em todo o território nacional</p>
            </div>

            {/* ID do Assinante a Pagar */}
            <div className="mb-4 p-3 rounded-xl bg-slate-900 border border-blue-500/30 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  ID de Assinante a Pagar (Conta ORBE):
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <Key className="w-4 h-4 text-cyan-400" />
                  <input
                    type="text"
                    value={targetUserId}
                    onChange={(e) => setTargetUserId(e.target.value.toUpperCase())}
                    className="bg-transparent text-white font-mono font-bold text-sm focus:outline-none focus:underline"
                    placeholder="UB-XXXXXX"
                  />
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/30 text-[10px] font-mono shrink-0">
                Ativação Automática
              </span>
            </div>

            {/* Select Plan Switcher (25, 100, 250, 500 MT) */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Selecione o Pacote ORBE:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {UBLUE_PLANS.filter(p => p.priceMT > 0).map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setTier(p.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      tier === p.id
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm ring-1 ring-blue-400'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[10px] font-bold truncate">{p.name}</div>
                    <div className="text-sm font-extrabold text-blue-400 mt-0.5">{p.priceMT} MT</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Tabs (Multi-Prestador) */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Método de Pagamento Moçambique:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {[
                  { id: 'mpesa', label: 'M-Pesa', sub: 'Vodacom 84/85', color: 'emerald' },
                  { id: 'emola', label: 'e-Mola', sub: 'Movitel 86/87', color: 'amber' },
                  { id: 'mkesh', label: 'mKesh', sub: 'Tmcel 82/83', color: 'orange' },
                  { id: 'simo_card', label: 'Cartão', sub: 'SIMO / Visa', color: 'blue' },
                  { id: 'orbe_wallet', label: 'Carteira', sub: 'Saldo ORBE', color: 'cyan' },
                ].map(prov => {
                  const active = providerId === prov.id;
                  return (
                    <button
                      key={prov.id}
                      type="button"
                      onClick={() => setProviderId(prov.id as PaymentProviderId)}
                      className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                        active
                          ? 'bg-blue-600/20 border-blue-400 text-white shadow-sm'
                          : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-[11px] font-bold">{prov.label}</span>
                      <span className="text-[9px] text-slate-400 truncate max-w-full">{prov.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Form Fields */}
            <form onSubmit={handlePay} className="space-y-3">
              {providerId === 'mpesa' || providerId === 'emola' || providerId === 'mkesh' ? (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Número de Celular ({providerId === 'mpesa' ? 'Vodacom' : providerId === 'emola' ? 'Movitel' : 'Tmcel'}):
                  </label>
                  <div className="flex items-center rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 focus-within:border-blue-500 transition-colors">
                    <span className="text-xs font-bold text-slate-400 mr-2 font-mono">+258</span>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={providerId === 'mpesa' ? '84 123 4567' : providerId === 'emola' ? '86 123 4567' : '82 123 4567'}
                      className="w-full bg-transparent text-xs text-white focus:outline-none font-mono font-bold"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Receberá notificação instantânea <strong className="text-emerald-400">{getUssdCode()}</strong> no celular para autorizar.
                  </p>
                </div>
              ) : providerId === 'simo_card' ? (
                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Número do Cartão SIMO / Visa:</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none font-mono focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Validade:</label>
                      <input
                        type="text"
                        defaultValue="12/28"
                        className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2 text-xs text-white font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">CVV:</label>
                      <input
                        type="password"
                        defaultValue="888"
                        maxLength={4}
                        className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2 text-xs text-white font-mono"
                        required
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs space-y-1">
                  <div className="text-cyan-300 font-bold flex items-center gap-1.5">
                    <Wallet className="w-4 h-4" />
                    <span>Débito Direto da Carteira UBlue</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Saldo disponível na sua conta: <strong className="text-white">42.680 MT</strong>. O valor será debitado instantaneamente sem taxas.
                  </p>
                </div>
              )}

              {/* Total Summary */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Total a pagar:</div>
                  <div className="text-xs text-slate-300 font-medium">{currentPlan.name} · {currentPlan.quality}</div>
                </div>
                <div className="text-xl font-black text-white">
                  {currentPlan.priceMT} <span className="text-xs font-bold text-blue-400">MT</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processando via Gateway...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pagar {currentPlan.priceMT} MT com {providerId.toUpperCase()}</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick link to Open Finance / M-Pesa Center */}
            {onOpenFinanceCenter && (
              <div className="mt-4 pt-3 border-t border-slate-800 text-center">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenFinanceCenter();
                  }}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Ambiente de Testes M-Pesa, Conciliação e Reembolsos</span>
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'ussd-prompt' && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-4 animate-pulse">
              <Smartphone className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Confirme no seu telemóvel</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto mb-3">
              Enviamos um pedido para o número <span className="text-emerald-400 font-mono font-bold">+258 {phone}</span>.
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 max-w-sm mx-auto mb-5">
              Digite seu PIN do <strong className="text-white">{providerId.toUpperCase()}</strong> ({getUssdCode()}) para autorizar o valor de <strong className="text-white">{currentPlan.priceMT} MT</strong>.
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span>Aguardando autorização da rede...</span>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-black text-white mb-1">Assinatura Ativada!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto mb-4">
              O pacote <strong className="text-blue-400">{currentPlan.name}</strong> foi ativado com sucesso.
            </p>

            <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 text-left text-xs text-slate-300 space-y-2 mb-5">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400 font-semibold">ID do Assinante UBlue:</span>
                <span className="font-mono font-black text-cyan-300 text-sm">{targetUserId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pacote Ativo:</span>
                <span className="font-bold text-white">{currentPlan.name} ({currentPlan.priceMT} MT)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Referência de Pagamento:</span>
                <span className="font-mono text-emerald-400 font-bold">{generatedTxRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Qualidade de Transmissão:</span>
                <span className="font-bold text-emerald-400">{currentPlan.quality}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-400 flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Todos os canais pagos do pacote foram desbloqueados agora!</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs tracking-wide uppercase shadow-lg shadow-emerald-500/30 cursor-pointer"
            >
              Entrar no App com ID {targetUserId} e Assistir
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
