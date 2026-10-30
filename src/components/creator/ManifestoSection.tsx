import React, { useState } from 'react';
import { 
  ScrollText, Copy, Check, Share2, Award, Sparkles, 
  Quote, ShieldCheck, Heart, Globe, ArrowRight 
} from 'lucide-react';
import { soundEffects } from '../../services/sound-effects';

export const ManifestoSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const manifestoText = `A UBlue TV nasce para dar voz, imagem e oportunidade a todos os criadores.

Acreditamos que talento, conhecimento e criatividade não devem ficar limitados pela distância, pelos recursos ou pela falta de acesso aos meios de comunicação tradicionais.

A nossa missão é conectar artistas, escolas, empresas, produtores, cineastas, músicos, educadores e comunidades a uma audiência cada vez maior, através de uma plataforma moderna, acessível e aberta à inovação.

Queremos que qualquer pessoa, em qualquer lugar, possa criar, partilhar e distribuir conteúdos de qualidade para o mundo.

A UBlue TV valoriza a criatividade, a educação, a cultura, o empreendedorismo e a tecnologia como motores de transformação social e económica.

Mais do que uma televisão, somos um ecossistema digital de oportunidades.

UBlue TV — Universo Blue.
O seu canal favorito, em qualquer lugar, a qualquer momento.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(manifestoText);
    setCopied(true);
    soundEffects.play('notification');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Manifesto Certificate Card */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#091224] via-[#050814] to-[#04060E] border-2 border-cyan-500/30 p-8 sm:p-14 overflow-hidden shadow-2xl max-w-4xl mx-auto">
        {/* Glow ambient effects */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center relative z-10 space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-widest shadow-inner">
            <ScrollText className="w-4 h-4 text-cyan-400" />
            Documento Fundador • Universo Blue
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Manifesto UBlue TV
          </h2>
          <p className="text-cyan-400 text-sm sm:text-base font-medium tracking-wide">
            "Seu canal favorito, em qualquer lugar, a qualquer momento."
          </p>
        </div>

        {/* Decorative Quote Icon */}
        <div className="text-cyan-500/20 flex justify-center mb-6">
          <Quote className="w-16 h-16 rotate-180" />
        </div>

        {/* Manifesto Content */}
        <div className="relative z-10 space-y-6 text-slate-200 text-base sm:text-lg leading-relaxed text-center font-serif italic max-w-2xl mx-auto">
          <p className="font-semibold text-white text-xl sm:text-2xl not-italic font-sans">
            A UBlue TV nasce para dar voz, imagem e oportunidade a todos os criadores.
          </p>

          <p>
            Acreditamos que talento, conhecimento e criatividade não devem ficar limitados pela distância, pelos recursos ou pela falta de acesso aos meios de comunicação tradicionais.
          </p>

          <p>
            A nossa missão é conectar artistas, escolas, empresas, produtores, cineastas, músicos, educadores e comunidades a uma audiência cada vez maior, através de uma plataforma moderna, acessível e aberta à inovação.
          </p>

          <p className="text-cyan-200 font-medium not-italic font-sans">
            Queremos que qualquer pessoa, em qualquer lugar, possa criar, partilhar e distribuir conteúdos de qualidade para o mundo.
          </p>

          <p>
            A UBlue TV valoriza a criatividade, a educação, a cultura, o empreendedorismo e a tecnologia como motores de transformação social e económica.
          </p>

          <div className="pt-4 pb-2">
            <span className="block text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 not-italic font-sans tracking-tight">
              Mais do que uma televisão, somos um ecossistema digital de oportunidades.
            </span>
          </div>

          <div className="pt-6 border-t border-slate-800/80 not-italic font-sans">
            <h4 className="text-lg font-extrabold text-white tracking-wider uppercase">
              UBlue TV — Universo Blue
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Moçambique & Diáspora • Maputo • Beira • Nampula • Mundo
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-xs text-slate-400">Compromisso Editorial & Acesso Universal</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Manifesto Copiado!' : 'Copiar Texto Completo'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
