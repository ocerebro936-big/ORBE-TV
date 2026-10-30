import React from 'react';
import { Check, Sparkles, Smartphone, Shield, Zap, Tv } from 'lucide-react';
import { UBLUE_PLANS } from '../../data/mock-content';
import { SubscriptionTier } from '../../types/content';

interface PackagesSectionProps {
  onSelectPlan: (tier: SubscriptionTier) => void;
  currentTier: SubscriptionTier;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  onSelectPlan,
  currentTier,
}) => {
  return (
    <section id="pacotes" className="py-20 bg-gradient-to-b from-[#050814] via-[#080d22] to-[#050814] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/20">
            <Tv className="w-3.5 h-3.5" />
            <span>Planos Flexíveis em Meticais</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            📺 PACOTES <span className="text-blue-500">ORBE TV</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Escolha o pacote perfeito para o seu bolso. Pague facilmente com <span className="text-emerald-400 font-semibold">M-Pesa</span> ou <span className="text-blue-400 font-semibold">E-Mola</span> (a partir de 25 MT) e desbloqueie os <span className="text-cyan-400 font-bold">Servidores Potentes ORBE</span> com o <span className="text-amber-400 font-bold">Modo Sem Megas (Taxa Zero)</span>!
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5 items-stretch">
          {UBLUE_PLANS.map((plan) => {
            const isCurrent = currentTier === plan.id;
            const isPopular = plan.popular;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl flex flex-col justify-between p-5 transition-all duration-300 ${
                  isPopular
                    ? 'bg-gradient-to-b from-blue-950/70 to-slate-900 border-2 border-blue-500 shadow-xl shadow-blue-500/20 lg:-translate-y-2'
                    : 'bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                    Mais Popular
                  </div>
                )}

                <div>
                  {/* Plan Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${plan.badgeColor}`}>
                      {plan.id === 'free' && '🆓 Gratuito'}
                      {plan.id === 'start' && '🟢 Económico'}
                      {plan.id === 'basic' && '🔵 Recomendado'}
                      {plan.id === 'medio' && '🟣 Completo'}
                      {plan.id === 'max' && '👑 VIP Máximo'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {plan.screens} {plan.screens === 1 ? 'tela' : 'telas'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-white">
                        {plan.priceMT === 0 ? '0' : plan.priceMT}
                      </span>
                      <span className="text-sm font-bold text-blue-400">MT</span>
                    </div>
                    <span className="text-xs text-slate-400">{plan.period}</span>
                  </div>

                  <p className="text-xs text-slate-300 mb-5 leading-relaxed min-h-[48px]">
                    {plan.description}
                  </p>

                  <div className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                    Qualidade: <span className="text-white font-bold">{plan.quality}</span>
                  </div>

                  {/* Features list */}
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plan Action CTA */}
                <div>
                  <button
                    onClick={() => onSelectPlan(plan.id)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                        : isPopular
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {isCurrent ? 'Plano Ativo' : plan.priceMT === 0 ? 'Acessar Grátis' : `Assinar por ${plan.priceMT} MT`}
                  </button>
                  <p className="text-[10px] text-center text-slate-500 mt-2">
                    M-Pesa · E-Mola · Cartão
                  </p>
                </div>

              </div>
            );
          })}
        </div>

        {/* Guarantee Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Sem fidelização e sem contratos</div>
              <div className="text-xs text-slate-400">Cancele ou mude de plano a qualquer momento pelo app com apenas 1 clique.</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              Ativação Instantânea
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              Simples no Celular
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
