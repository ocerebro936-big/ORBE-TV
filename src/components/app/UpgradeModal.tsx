import React from 'react';
import { X, Lock, Check, Zap, Sparkles } from 'lucide-react';
import { Channel, SubscriptionTier, Content } from '../../types/content';
import { UBLUE_PLANS } from '../../data/mock-content';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetItem: Channel | Content | null;
  userTier: SubscriptionTier;
  userId?: string;
  onConfirmUpgrade: (tier: SubscriptionTier) => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  targetItem,
  userTier,
  userId,
  onConfirmUpgrade,
}) => {
  if (!isOpen || !targetItem) return null;

  const requiredTier = 'requiredTier' in targetItem
    ? targetItem.requiredTier
    : targetItem.subscriptionTier;

  const targetPlan = UBLUE_PLANS.find(p => p.id === requiredTier) || UBLUE_PLANS[2];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-left">
      <div className="relative w-full max-w-md rounded-3xl bg-[#090d22] border border-blue-500/40 p-6 sm:p-7 shadow-2xl shadow-blue-900/50">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[2px] mx-auto mb-3 shadow-lg shadow-blue-600/30">
            <div className="w-full h-full bg-[#0a0f26] rounded-[14px] flex items-center justify-center text-cyan-300">
              <Lock className="w-6 h-6" />
            </div>
          </div>
          <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest block mb-1">
            UBlue Entitlement Engine · Canal Protegido
          </span>
          <h3 className="text-xl font-black text-white">
            {'name' in targetItem ? targetItem.name : targetItem.title}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Este canal requer o pacote <span className="text-blue-400 font-bold">{targetPlan.name}</span>.
          </p>
        </div>

        {/* Member ID Badge */}
        {userId && (
          <div className="mb-4 p-3 rounded-xl bg-slate-900/90 border border-blue-500/30 flex items-center justify-between text-xs">
            <span className="text-slate-400">ID do Assinante a Pagar:</span>
            <span className="font-mono font-bold text-cyan-300">{userId}</span>
          </div>
        )}

        {/* Plan card summary */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white">{targetPlan.name}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-white">{targetPlan.priceMT}</span>
              <span className="text-xs font-bold text-blue-400">MT/{targetPlan.period}</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-3">{targetPlan.description}</p>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {targetPlan.features.slice(0, 3).map((feat, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Free vs Paid channels reminder */}
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 mb-5">
          ✓ Canais Livres (TVM 1, TV Miramar, DW, Euronews, UBlue Geral) continuam gratuitos a 0 MT. Pague apenas para desbloquear canais exclusivos!
        </div>

        <button
          onClick={() => {
            onClose();
            onConfirmUpgrade(targetPlan.id);
          }}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>Pagar {targetPlan.priceMT} MT com M-Pesa e Desbloquear</span>
        </button>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          Ativação instantânea vinculada ao ID {userId || ''} via M-Pesa ou E-Mola
        </p>

      </div>
    </div>
  );
};
