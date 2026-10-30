import React, { useState } from 'react';
import { Copy, Check, Palette, Type, Grid, Smartphone, Tv, Sparkles } from 'lucide-react';

export const DesignTokensDrawer: React.FC = () => {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6 text-slate-100 font-sans">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-cyan-400" />
            <span>Design System Tokens & Guia de Estilo UBlue TV v1.0</span>
          </h3>
          <p className="text-xs text-slate-400">Padronização para equipas de UI/UX (Figma) e Engenharia Frontend</p>
        </div>
        <button
          onClick={() => handleCopy(`// Tailwind Theme Config UBlue TV
colors: {
  brand: {
    dark: '#050814',
    cinema: '#02040c',
    primary: '#2563EB',
    focus: '#00E5FF',
    mpesa: '#E60000',
    emola: '#FF6600',
    emerald: '#10B981',
  }
}`, 'all-tailwind')}
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          {copiedToken === 'all-tailwind' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
          <span>Copiar Config Tailwind</span>
        </button>
      </div>

      {/* Color Palette Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <span>Paleta de Cores Oficial</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { name: 'Deep Night Navy', hex: '#050814', usage: 'Fundo Geral Web & Mobile' },
            { name: 'Pure Cinema Dark', hex: '#02040c', usage: 'Fundo Smart TV & Players' },
            { name: 'UBlue Brand', hex: '#2563EB', usage: 'Botões Primários & Acentos' },
            { name: 'Cyan Neon Focus', hex: '#00E5FF', usage: 'Foco D-Pad Smart TV 10-Foot' },
            { name: 'Vodacom M-Pesa', hex: '#E60000', usage: 'Checkout & Botões M-Pesa' },
            { name: 'Movitel E-Mola', hex: '#FF6600', usage: 'Checkout & Botões E-Mola' },
            { name: 'Emerald Success', hex: '#10B981', usage: 'Status Ativo & Finanças' },
          ].map((c, idx) => (
            <div 
              key={idx} 
              onClick={() => handleCopy(c.hex, `color-${idx}`)}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer space-y-1.5 group"
            >
              <div className="h-10 rounded-lg w-full" style={{ backgroundColor: c.hex }}></div>
              <div>
                <p className="font-bold text-white text-xs truncate">{c.name}</p>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>{c.hex}</span>
                  <span className="opacity-0 group-hover:opacity-100 text-cyan-400">
                    {copiedToken === `color-${idx}` ? 'Copiado!' : 'Copiar'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography & Spacing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Typography */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-blue-400" />
            <span>Escala Tipográfica (Plus Jakarta Sans & Inter)</span>
          </h4>
          <ul className="text-xs space-y-1.5 text-slate-300">
            <li className="flex justify-between border-b border-slate-800 pb-1">
              <span className="font-black text-sm">Display Hero (TV & Web)</span>
              <span className="font-mono text-cyan-400">32px - 48px / Bold 800</span>
            </li>
            <li className="flex justify-between border-b border-slate-800 pb-1">
              <span className="font-bold">Títulos de Seção (H2/H3)</span>
              <span className="font-mono text-cyan-400">20px - 28px / SemiBold 600</span>
            </li>
            <li className="flex justify-between border-b border-slate-800 pb-1">
              <span>Corpo de Texto (Body)</span>
              <span className="font-mono text-slate-400">14px - 16px / Regular 400</span>
            </li>
            <li className="flex justify-between">
              <span className="text-[11px] font-mono">Timecodes & Moeda (MT)</span>
              <span className="font-mono text-emerald-400">JetBrains Mono / Tabular</span>
            </li>
          </ul>
        </div>

        {/* 8pt Grid & Safe Margins */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <Grid className="w-3.5 h-3.5 text-cyan-400" />
            <span>Grid System 8pt & Zonas de Segurança</span>
          </h4>
          <ul className="text-xs space-y-1.5 text-slate-300">
            <li className="flex justify-between border-b border-slate-800 pb-1">
              <span>Espaçamento Base (8pt)</span>
              <span className="font-mono text-slate-400">8px, 16px, 24px, 32px, 48px, 64px</span>
            </li>
            <li className="flex justify-between border-b border-slate-800 pb-1">
              <span>Touch Target Mínimo Mobile</span>
              <span className="font-mono text-emerald-400">48px x 48px (Acessibilidade)</span>
            </li>
            <li className="flex justify-between border-b border-slate-800 pb-1">
              <span>Overscan Safe Area TV</span>
              <span className="font-mono text-cyan-400">5% margem (96px horizontal)</span>
            </li>
            <li className="flex justify-between">
              <span>Mobile Notch & Home Bar</span>
              <span className="font-mono text-slate-400">env(safe-area-inset-top/bottom)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
