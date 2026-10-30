import React, { useState } from 'react';
import {
  X,
  User,
  Key,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Check,
  Copy,
  CheckCircle2,
  QrCode,
  Smartphone,
  LogOut,
  UserPlus,
  Lock,
  ArrowRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { UserProfile, SubscriptionTier } from '../../types/content';
import { authService, DEFAULT_PRESET_USERS } from '../../services/auth-service';
import { UBLUE_PLANS } from '../../data/mock-content';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserChange: (user: UserProfile) => void;
  onOpenPayment: (tier?: SubscriptionTier) => void;
  initialMode?: 'login' | 'register' | 'card';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  onOpenPayment,
  initialMode = 'card'
}) => {
  const [tab, setTab] = useState<'card' | 'login' | 'register'>(initialMode);
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('+258 84 ');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState<string | null>(null);
  const [createdUserSuccess, setCreatedUserSuccess] = useState<UserProfile | null>(null);

  // Copy status
  const [copiedId, setCopiedId] = useState(false);

  if (!isOpen) return null;

  const currentPlan = UBLUE_PLANS.find(p => p.id === currentUser.subscription.tier) || UBLUE_PLANS[0];

  const handleCopyId = (idToCopy: string) => {
    navigator.clipboard.writeText(idToCopy).catch(() => {});
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginIdentifier.trim()) {
      setLoginError('Por favor, informe o seu ID Único (ex: UB-842910), email ou telefone.');
      return;
    }

    const res = authService.login(loginIdentifier, loginPassword);
    if (res.success) {
      onUserChange(res.user);
      setTab('card');
    } else {
      setLoginError(res.error || 'Credenciais inválidas.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    const res = authService.registerUser({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword
    });

    if (res.success) {
      onUserChange(res.user);
      setCreatedUserSuccess(res.user);
      setTab('card');
    } else {
      setRegError(res.error || 'Erro ao criar conta.');
    }
  };

  const handleSelectPreset = (presetUser: UserProfile) => {
    const user = authService.switchUser(presetUser.id);
    onUserChange(user);
    setTab('card');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-left">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#080d22] border border-blue-500/40 p-6 sm:p-8 shadow-2xl shadow-blue-950/80 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="flex border-b border-slate-800 pb-2 mb-6 gap-2">
          <button
            onClick={() => setTab('card')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              tab === 'card'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Meu Cartão & ID</span>
          </button>

          <button
            onClick={() => setTab('login')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              tab === 'login'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Entrar com ID</span>
          </button>

          <button
            onClick={() => setTab('register')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              tab === 'register'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Criar Conta (Novo ID)</span>
          </button>
        </div>

        {/* TAB 1: CARTÃO DIGITAL & ID ÚNICO */}
        {tab === 'card' && (
          <div className="space-y-6">
            {createdUserSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-bounce">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                <span>
                  Conta criada com sucesso! O seu ID Único oficial é <strong>{createdUserSuccess.id}</strong>.
                </span>
              </div>
            )}

            {/* DIGITAL MEMBER CARD */}
            <div className="relative rounded-3xl p-6 bg-gradient-to-tr from-[#050c26] via-[#09153d] to-[#042857] border border-blue-400/40 shadow-2xl shadow-blue-900/40 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
              
              {/* Card Brand Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/40 font-black">
                    UB
                  </div>
                  <div>
                    <div className="text-sm font-black text-white tracking-wider uppercase">UBlue TV ID Pass</div>
                    <div className="text-[10px] text-cyan-300 font-mono">Universo Blue Digital Network</div>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-full bg-slate-900/80 border border-blue-400/30 text-[10px] font-bold text-cyan-300 font-mono">
                  {currentPlan.name.toUpperCase()}
                </div>
              </div>

              {/* Chip & NFC symbol */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-11 h-8 rounded-lg bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 border border-amber-300/60 shadow-sm flex items-center justify-center">
                  <div className="w-7 h-5 border border-amber-800/40 rounded-sm" />
                </div>
                <QrCode className="w-7 h-7 text-cyan-300/70" />
              </div>

              {/* Unique Member ID in Jumbo Typography */}
              <div className="mb-5">
                <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-widest mb-0.5">
                  ID Único de Assinante (Código de Pagamento):
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-blue-300">
                    {currentUser.id}
                  </div>
                  <button
                    onClick={() => handleCopyId(currentUser.id)}
                    className="p-1.5 rounded-lg bg-blue-950/80 hover:bg-blue-900 border border-blue-500/40 text-cyan-300 transition-colors cursor-pointer"
                    title="Copiar ID de Assinante"
                  >
                    {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  {copiedId && (
                    <span className="text-[10px] text-emerald-400 font-semibold animate-fade-in">Copiado!</span>
                  )}
                </div>
              </div>

              {/* Card Footer: User Name, Phone & Valid */}
              <div className="flex items-end justify-between pt-3 border-t border-blue-400/20 text-xs">
                <div>
                  <div className="font-bold text-white text-sm">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-300 font-mono">{currentUser.phone}</div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase">Validade</div>
                  <div className="text-[11px] font-mono text-cyan-300 font-bold">
                    {currentUser.subscription.expiresAt}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions with ID */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenPayment('basic');
                }}
                className="py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pagar TV com este ID</span>
              </button>

              <button
                onClick={() => handleCopyId(currentUser.id)}
                className="py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Copy className="w-4 h-4 text-cyan-400" />
                <span>Copiar Código do ID</span>
              </button>
            </div>

            {/* Status of Channels for this ID */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status dos Canais:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  currentUser.subscription.tier === 'free'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {currentUser.subscription.tier === 'free'
                    ? 'Apenas Canais Livres Liberados'
                    : `Canais Pagos Liberados (${currentPlan.name})`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Qualidade Permitida:</span>
                <span className="text-white font-bold">{currentPlan.quality}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Dispositivos em Simultâneo:</span>
                <span className="text-white font-bold">{currentPlan.screens} tela(s)</span>
              </div>
              {currentUser.subscription.lastPaymentDate && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Último Pagamento:</span>
                  <span className="text-cyan-300 font-mono">{currentUser.subscription.lastPaymentDate}</span>
                </div>
              )}
            </div>

            {/* Payment History vinculada ao ID */}
            {currentUser.paymentHistory && currentUser.paymentHistory.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Histórico de Faturas Pagas no ID:
                </h4>
                <div className="space-y-2">
                  {currentUser.paymentHistory.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-white">{rec.planName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Ref: {rec.transactionRef} • {rec.date}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-emerald-400">{rec.amountMT} MT</div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300">
                          {rec.method.toUpperCase()} Pago
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fast Account Switcher for Testing / Launch Demo */}
            <div className="pt-4 border-t border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 mb-2">
                Trocar de Conta para Testes do Lançamento:
              </div>
              <div className="grid grid-cols-3 gap-2">
                {DEFAULT_PRESET_USERS.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSelectPreset(u)}
                    className={`p-2 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                      currentUser.id === u.id
                        ? 'bg-blue-600/30 border-blue-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold truncate">{u.name.split(' ')[0]}</div>
                    <div className="text-[10px] text-cyan-300 font-mono">{u.id}</div>
                    <div className="text-[9px] text-slate-400 uppercase">{u.subscription.tier}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LOGIN COM ID */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Entrar no Universo Blue</h3>
              <p className="text-xs text-slate-400">
                Digite o seu <strong>ID Único de Assinante</strong> (ex: <code className="text-cyan-300 font-mono">UB-842910</code>) ou o seu email para acessar a TV e pagamentos.
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ID Único do Cliente, Email ou Telemóvel:
              </label>
              <input
                type="text"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="Ex: UB-842910 ou +258 84 123 4567"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-blue-400"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Palavra-passe / PIN do Assinante:
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 cursor-pointer flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" />
              <span>Entrar com meu ID</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setTab('register')}
                className="text-xs text-cyan-400 hover:underline cursor-pointer"
              >
                Não tem um ID? Clique aqui para criar sua conta gratuita e gerar seu ID único.
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: REGISTO (CRIAR NOVO ID) */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Criar Novo ID de Assinante</h3>
              <p className="text-xs text-slate-400">
                O seu ID único será gerado instantaneamente no cadastro. Com ele você poderá pagar a TV via M-Pesa, E-Mola e assistir canais em qualquer aparelho.
              </p>
            </div>

            {regError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{regError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nome Completo:
              </label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Ex: João Sitoe"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-teal-400"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Telemóvel (M-Pesa / E-Mola):
                </label>
                <input
                  type="text"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+258 84 ..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-teal-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email (Opcional):
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="joao@exemplo.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Definir Palavra-passe / Código de Segurança:
              </label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Mínimo 6 dígitos"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-teal-400"
                required
              />
            </div>

            <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-[11px] text-teal-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
              <span>
                Canais Livres (TVM 1, TV Miramar, DW, Euronews, UBlue Geral) ficam liberados imediatamente a 0 MT!
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-teal-500/30 cursor-pointer flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Gerar ID Único e Cadastrar Grátis</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
