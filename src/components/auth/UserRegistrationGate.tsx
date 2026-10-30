import React, { useState } from 'react';
import {
  Tv,
  User,
  Smartphone,
  MapPin,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Zap,
  Globe,
  Radio,
  Play,
  Key
} from 'lucide-react';
import { UserProfile, SubscriptionTier } from '../../types/content';
import { authService, DEFAULT_PRESET_USERS } from '../../services/auth-service';
import { UBLUE_PLANS } from '../../data/mock-content';

interface UserRegistrationGateProps {
  onAuthenticated: (user: UserProfile) => void;
  onExploreAsGuest?: () => void;
}

const PROVINCES_MOZAMBIQUE = [
  'Maputo Cidade',
  'Maputo Província',
  'Gaza (Xai-Xai)',
  'Inhambane (Maxixe)',
  'Sofala (Beira)',
  'Manica (Chimoio)',
  'Tete',
  'Zambézia (Quelimane)',
  'Nampula',
  'Cabo Delgado (Pemba)',
  'Niassa (Lichinga)',
  'Diáspora / Internacional'
];

export const UserRegistrationGate: React.FC<UserRegistrationGateProps> = ({
  onAuthenticated,
  onExploreAsGuest
}) => {
  const [mode, setMode] = useState<'register' | 'login' | 'demo'>('register');

  // Register Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+258 84 ');
  const [email, setEmail] = useState('');
  const [province, setProvince] = useState('Maputo Cidade');
  const [pin, setPin] = useState('');
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('free');
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);

    if (!name.trim()) {
      setRegisterError('Por favor, indique o seu Nome Completo.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setRegisterError('Por favor, informe um número de telefone válido (ex: +258 84 123 4567).');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = authService.registerUser({
        name,
        phone,
        email,
        password: pin,
        province,
        initialTier: selectedTier
      });

      setIsLoading(false);
      if (res.success) {
        onAuthenticated(res.user);
      } else {
        setRegisterError(res.error || 'Erro ao criar conta.');
      }
    }, 400);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginIdentifier.trim()) {
      setLoginError('Informe o seu ID Único (ex: UB-842910), telefone ou email.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = authService.login(loginIdentifier, loginPin);
      setIsLoading(false);
      if (res.success) {
        onAuthenticated(res.user);
      } else {
        setLoginError(res.error || 'Credenciais inválidas.');
      }
    }, 400);
  };

  const handleSelectPreset = (preset: UserProfile) => {
    const user = authService.switchUser(preset.id);
    onAuthenticated(user);
  };

  const handleGuestEnter = () => {
    if (onExploreAsGuest) {
      onExploreAsGuest();
    } else {
      const guest = authService.createGuestUser();
      onAuthenticated(guest);
    }
  };

  return (
    <div className="min-h-screen bg-[#030612] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-xl rounded-3xl bg-[#070c22]/90 border border-blue-500/30 p-6 sm:p-8 shadow-2xl shadow-blue-950/80 backdrop-blur-xl">
        
        {/* Header / Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 p-[2px] shadow-lg shadow-blue-600/40 mb-3">
            <div className="w-full h-full bg-[#070b1e] rounded-[14px] flex items-center justify-center">
              <Tv className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              U<span className="text-blue-500">Blue</span> TV
            </h1>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-500/30">
              OFICIAL
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            O seu canal favorito, em qualquer lugar, a qualquer momento. Registe-se para acessar a transmissão ao vivo dos canais nacionais e internacionais.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-900/80 border border-slate-800 mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Criar Conta</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Já Tenho Conta</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('demo')}
            className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'demo'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Acesso Rápido</span>
          </button>
        </div>

        {/* Tab 1: Registration Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
            {registerError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{registerError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Nome Completo *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Armando Machava"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white text-xs placeholder:text-slate-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Número de Telemóvel *
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    required
                    placeholder="+258 84 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white text-xs placeholder:text-slate-500 font-mono transition-colors"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Compatível com M-Pesa, e-Mola e mKesh</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Província / Região
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white text-xs transition-colors cursor-pointer appearance-none"
                  >
                    {PROVINCES_MOZAMBIQUE.map((prov) => (
                      <option key={prov} value={prov} className="bg-slate-900 text-white">
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email (Opcional)
                </label>
                <input
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white text-xs placeholder:text-slate-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Criar Senha / PIN Rápido
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    placeholder="PIN de 4 ou 6 dígitos"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white text-xs placeholder:text-slate-500 font-mono transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Initial Subscription Tier Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Escolha o Pacote de Acesso Inicial:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {UBLUE_PLANS.map((plan) => {
                  const isSelected = selectedTier === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedTier(plan.id)}
                      className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-600/20 border-cyan-400 shadow-md ring-1 ring-cyan-400'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-[11px] font-black text-white">{plan.name}</div>
                      <div className="text-sm font-extrabold text-cyan-300 mt-0.5">
                        {plan.priceMT === 0 ? 'Grátis (0 MT)' : `${plan.priceMT} MT`}
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">{plan.quality}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Zero-Rating / Data Free feature notice */}
            <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-500/25 flex items-start gap-2.5 text-[11px] text-slate-300">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Servidor TurboEdge 2026:</strong> Ao criar a conta você recebe um <strong className="text-cyan-300">ID Único UBlue</strong> para pagamentos rápidos M-Pesa e transmissão sem consumo de megas após pagamento do pacote!
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-blue-600/40 cursor-pointer flex items-center justify-center gap-2 transform active:scale-[0.99] transition-all disabled:opacity-60"
            >
              <span>{isLoading ? 'Criando Conta...' : 'Criar Conta & Acessar UBlue TV'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Tab 2: Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            {loginError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                ID Único UBlue, Telefone ou Email *
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Ex: UB-842910 ou +258 84 123 4567"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white text-xs placeholder:text-slate-500 font-mono transition-colors"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                O seu ID Único foi atribuído na criação da conta (ex: UB-842910).
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Senha / PIN
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  placeholder="PIN de acesso (opcional para perfis abertos)"
                  value={loginPin}
                  onChange={(e) => setLoginPin(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white text-xs placeholder:text-slate-500 font-mono transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-blue-600/40 cursor-pointer flex items-center justify-center gap-2 transform active:scale-[0.99] transition-all disabled:opacity-60"
            >
              <span>{isLoading ? 'Verificando...' : 'Entrar na UBlue TV'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Tab 3: Quick Preset Demo Access */}
        {mode === 'demo' && (
          <div className="space-y-3 text-left">
            <p className="text-xs text-slate-300 mb-2">
              Selecione um perfil de demonstração para testar o ecossistema UBlue instantaneamente com 1 clique:
            </p>

            {DEFAULT_PRESET_USERS.map((preset) => (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-400/60 p-3 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-850 group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={preset.avatar}
                    alt={preset.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-blue-500/40"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {preset.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                        {preset.id}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Plano: <strong className="text-cyan-300 uppercase">{preset.subscription.tier}</strong></span>
                      <span>•</span>
                      <span>Saldo: <strong className="text-emerald-400">{preset.walletBalanceMT} MT</strong></span>
                    </div>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-blue-600/20 group-hover:bg-blue-600 text-cyan-300 group-hover:text-white text-xs font-bold transition-all flex items-center gap-1">
                  <span>Entrar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Guest fallback button */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Deseja apenas explorar?</span>
          <button
            type="button"
            onClick={handleGuestEnter}
            className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Experimentar como Visitante Livre (0 MT)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
