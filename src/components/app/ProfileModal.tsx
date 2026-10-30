import React from 'react';
import { X, User, Shield, CreditCard, Sparkles, Check, Smartphone } from 'lucide-react';
import { UserProfile, SubscriptionTier } from '../../types/content';
import { UBLUE_PLANS } from '../../data/mock-content';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSwitchTier: (tier: SubscriptionTier) => void;
  onOpenPayment: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSwitchTier,
  onOpenPayment,
}) => {
  if (!isOpen) return null;

  const currentPlan = UBLUE_PLANS.find(p => p.id === user.subscription.tier) || UBLUE_PLANS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-left">
      <div className="relative w-full max-w-md rounded-2xl bg-[#080d20] border border-blue-500/30 p-6 sm:p-7 shadow-2xl shadow-blue-900/40">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Card */}
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-800">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500/50 shadow-md"
          />
          <div>
            <h3 className="text-base font-bold text-white">{user.name}</h3>
            <p className="text-xs text-slate-400">{user.email}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${currentPlan.badgeColor}`}>
                {currentPlan.name}
              </span>
              <span className="text-[10px] text-emerald-400">Ativo</span>
            </div>
          </div>
        </div>

        {/* Subscription Details Box */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 mb-6 space-y-2.5 text-xs">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            Detalhes do Plano UBlue
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Plano Atual:</span>
            <span className="font-bold text-white">{currentPlan.name} ({currentPlan.priceMT} MT)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Qualidade de Vídeo:</span>
            <span className="font-semibold text-emerald-400">{currentPlan.quality}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Telas Permitidas:</span>
            <span className="text-slate-200">{currentPlan.screens} telas</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Método de Renovação:</span>
            <span className="text-slate-200 uppercase font-mono">{user.subscription.paymentMethod || 'M-Pesa'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Válido até:</span>
            <span className="font-mono text-cyan-400">{user.subscription.expiresAt}</span>
          </div>
        </div>

        {/* Change Tier Selector (Simulation for testing different entitlement states) */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-slate-300 block mb-2">
            Trocar Plano (Simulação do Subscription Engine):
          </label>
          <div className="grid grid-cols-2 gap-2">
            {UBLUE_PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => onSwitchTier(plan.id)}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                  user.subscription.tier === plan.id
                    ? 'bg-blue-600/30 border-blue-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="font-bold">{plan.name}</div>
                <div className="text-[11px] text-blue-400">{plan.priceMT} MT</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            onClose();
            onOpenPayment();
          }}
          className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 cursor-pointer"
        >
          Fazer Upgrade ou Renovar via M-Pesa
        </button>

      </div>
    </div>
  );
};
