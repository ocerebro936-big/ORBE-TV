import React, { useState } from 'react';
import { 
  Globe, Shield, Smartphone, Tv, FileText, Layers, Download, 
  Copy, Check, ArrowLeft, Play, Eye, Code, Palette, Sparkles,
  ChevronRight, CheckCircle2, Monitor, Tablet
} from 'lucide-react';
import { UBLUE_WIREFRAME_SPECS, WireframePlatformId } from '../../data/wireframe-spec-data';
import { WebScreens } from './screens/WebScreens';
import { AdminScreens } from './screens/AdminScreens';
import { MobileScreens } from './screens/MobileScreens';
import { TvScreens } from './screens/TvScreens';
import { TvRemoteControl } from './TvRemoteControl';
import { DesignTokensDrawer } from './DesignTokensDrawer';

export type WireframeViewMode = 'schematic' | 'preview' | 'specs' | 'tokens';

interface WireframeStudioProps {
  onBackToPortal: () => void;
  onLaunchPlayer: () => void;
}

export const WireframeStudio: React.FC<WireframeStudioProps> = ({
  onBackToPortal,
  onLaunchPlayer
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<WireframePlatformId>('website');
  const [selectedScreenId, setSelectedScreenId] = useState<string>('web-home');
  const [viewMode, setViewMode] = useState<WireframeViewMode>('preview');
  const [copiedState, setCopiedState] = useState<string | null>(null);
  const [tvFocusedKey, setTvFocusedKey] = useState<string>('hero-play');

  const currentPlatformSpec = UBLUE_WIREFRAME_SPECS[selectedPlatform];
  const currentScreenSpec = currentPlatformSpec.screens.find(s => s.id === selectedScreenId) || currentPlatformSpec.screens[0];

  const handleSelectPlatform = (platform: WireframePlatformId) => {
    setSelectedPlatform(platform);
    setSelectedScreenId(UBLUE_WIREFRAME_SPECS[platform].screens[0].id);
  };

  const handleCopyMarkdown = () => {
    let md = `# WIREFRAME & UI/UX SPEC: ${currentScreenSpec.code} - ${currentScreenSpec.title}\n\n`;
    md += `**Plataforma:** ${currentPlatformSpec.name}\n`;
    md += `**Rota:** \`${currentScreenSpec.route}\`\n`;
    md += `**Objetivo:** ${currentScreenSpec.objective}\n\n`;
    
    md += `## 1. Grid & Layout System\n`;
    md += `- **Sistema:** ${currentScreenSpec.gridSystem}\n`;
    md += `- **Breakpoints:** ${currentScreenSpec.responsiveBreakpoints}\n\n`;

    md += `## 2. Componentes Chave\n`;
    currentScreenSpec.keyComponents.forEach(c => {
      md += `- ${c}\n`;
    });

    md += `\n## 3. Zonas do Wireframe\n`;
    currentScreenSpec.wireframeZones.forEach(z => {
      md += `### ${z.zoneName} (${z.dimensions})\n- Tipo: \`${z.componentType}\`\n- ${z.description}\n\n`;
    });

    md += `## 4. Interações do Utilizador\n`;
    currentScreenSpec.userActions.forEach(a => {
      md += `- ${a}\n`;
    });

    md += `\n## 5. Critérios de Aceitação (QA / Frontend)\n`;
    currentScreenSpec.acceptanceCriteria.forEach(ac => {
      md += `- [ ] ${ac}\n`;
    });

    navigator.clipboard.writeText(md);
    setCopiedState('screen-md');
    setTimeout(() => setCopiedState(null), 2500);
  };

  const handleDownloadFullDoc = () => {
    let fullMd = `# UBLUE TV v1.0 — ESPECIFICAÇÃO DE WIREFRAMES & UI/UX (TELA POR TELA)\n\n`;
    fullMd += `Documentação oficial para as equipas de Design de Interfaces (Figma) e Engenharia de Frontend.\n\n`;

    (Object.keys(UBLUE_WIREFRAME_SPECS) as WireframePlatformId[]).forEach(platKey => {
      const p = UBLUE_WIREFRAME_SPECS[platKey];
      fullMd += `\n=======================================================\n`;
      fullMd += `# PLATAFORMA: ${p.name.toUpperCase()} (${p.badge})\n`;
      fullMd += `Dispositivos Alvo: ${p.targetDevices}\n`;
      fullMd += `Método de Entrada: ${p.inputMethods}\n`;
      fullMd += `=======================================================\n\n`;

      p.screens.forEach(s => {
        fullMd += `## [${s.code}] ${s.title}\n`;
        fullMd += `**Rota / Deep Link:** \`${s.route}\`\n`;
        fullMd += `**Objetivo:** ${s.objective}\n`;
        fullMd += `**Grid:** ${s.gridSystem}\n\n`;
        fullMd += `### Componentes Principais:\n`;
        s.keyComponents.forEach(k => fullMd += `- ${k}\n`);
        fullMd += `\n### Zonas do Wireframe:\n`;
        s.wireframeZones.forEach(z => fullMd += `- **${z.zoneName}** (${z.dimensions}): ${z.description} [\`${z.componentType}\`]\n`);
        fullMd += `\n### Critérios de Aceitação:\n`;
        s.acceptanceCriteria.forEach(c => fullMd += `- ${c}\n`);
        fullMd += `\n---\n\n`;
      });
    });

    const blob = new Blob([fullMd], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'UBLUE_TV_WIREFRAMES_MASTER_SPEC.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#030614] text-slate-100 flex flex-col font-sans">
      
      {/* Top Studio Command Bar */}
      <header className="sticky top-0 z-40 bg-[#050818]/95 backdrop-blur-xl border-b border-blue-900/30 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToPortal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Voltar ao Portal</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-sm shadow-md shadow-cyan-500/20">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-white">ORBE TV</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                  UI/UX STUDIO TELA POR TELA
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Wireframes completos para Website, Painel Admin, Android e Smart TV
              </p>
            </div>
          </div>
        </div>

        {/* Global Export Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
            title="Copiar especificação desta tela em Markdown"
          >
            {copiedState === 'screen-md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden sm:inline">Copiar Tela (.MD)</span>
          </button>

          <button
            onClick={handleDownloadFullDoc}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar Guia UI/UX Completo</span>
          </button>

          <button
            onClick={onLaunchPlayer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-cyan-500/30 transition-all cursor-pointer"
          >
            <Play className="w-3 h-3 fill-current" />
            <span className="hidden sm:inline">Testar Player</span>
          </button>
        </div>
      </header>

      {/* 4 Main Platforms Switcher Tabs */}
      <div className="bg-[#05081c] border-b border-slate-800/80 px-4 sm:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold scrollbar-none py-0.5">
            <button
              onClick={() => handleSelectPlatform('website')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
                selectedPlatform === 'website'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 ring-1 ring-blue-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>1. Website & Portal</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 font-mono">5 Telas</span>
            </button>

            <button
              onClick={() => handleSelectPlatform('admin')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
                selectedPlatform === 'admin'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 ring-1 ring-blue-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>2. Painel Admin (Control Plane)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 font-mono">5 Telas</span>
            </button>

            <button
              onClick={() => handleSelectPlatform('mobile')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
                selectedPlatform === 'mobile'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 ring-1 ring-blue-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>3. Android & iOS App</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 font-mono">5 Telas</span>
            </button>

            <button
              onClick={() => handleSelectPlatform('smart-tv')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
                selectedPlatform === 'smart-tv'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 ring-1 ring-blue-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>4. Smart TV (10-Foot UI)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 font-mono">4 Telas + Remoto</span>
            </button>
          </div>

          {/* View Modes (Schematic vs Real UI vs Specs vs Tokens) */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'preview' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pré-visualização UI</span>
            </button>

            <button
              onClick={() => setViewMode('schematic')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'schematic' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Layout & Grid</span>
            </button>

            <button
              onClick={() => setViewMode('specs')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'specs' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Specs UX</span>
            </button>

            <button
              onClick={() => setViewMode('tokens')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'tokens' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tokens</span>
            </button>
          </div>
        </div>
      </div>

      {/* Screen Selector Secondary Rail */}
      <div className="bg-[#040715] border-b border-slate-800 px-4 sm:px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto text-xs font-semibold scrollbar-none py-0.5">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mr-2 shrink-0">
            Telas da Plataforma:
          </span>
          {currentPlatformSpec.screens.map((screen) => (
            <button
              key={screen.id}
              onClick={() => setSelectedScreenId(screen.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                selectedScreenId === screen.id
                  ? 'bg-blue-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-black/40 text-blue-400">{screen.code}</span>
              <span>{screen.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Screen Header Info Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-600 text-white font-bold">
                {currentScreenSpec.code}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                {currentScreenSpec.title}
              </h2>
            </div>
            <p className="text-xs text-slate-300">
              {currentScreenSpec.subtitle}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-slate-400">
              <span>Rota: <strong className="text-cyan-400 font-normal">{currentScreenSpec.route}</strong></span>
              <span>•</span>
              <span>Alvo: {currentPlatformSpec.targetDevices}</span>
              <span>•</span>
              <span>Entrada: {currentPlatformSpec.inputMethods}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              {copiedState === 'screen-md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copiar Specs</span>
            </button>
          </div>
        </div>

        {/* View Mode: Design Tokens Drawer */}
        {viewMode === 'tokens' && (
          <DesignTokensDrawer />
        )}

        {/* View Mode: Detailed UX Specs */}
        {viewMode === 'specs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Objective & Components */}
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                  🎯 Objetivo de Negócio & Experiência
                </h3>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {currentScreenSpec.objective}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                  🧱 Componentes Chave da Interface
                </h3>
                <ul className="space-y-2 text-xs">
                  {currentScreenSpec.keyComponents.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                  📐 Grid, Breakpoints & Resolução
                </h3>
                <div className="text-xs space-y-2 text-slate-300">
                  <p><strong className="text-white">Sistema de Grid:</strong> {currentScreenSpec.gridSystem}</p>
                  <p><strong className="text-white">Breakpoints:</strong> {currentScreenSpec.responsiveBreakpoints}</p>
                </div>
              </div>
            </div>

            {/* Wireframe Zones & Acceptance Criteria */}
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                  🗺️ Zonas e Dimensões do Wireframe
                </h3>
                <div className="space-y-2.5">
                  {currentScreenSpec.wireframeZones.map((z, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-bold text-cyan-400">{z.zoneName}</span>
                        <span className="text-[10px] text-slate-400">{z.dimensions}</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">{z.description}</p>
                      <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                        Componente: &lt;{z.componentType} /&gt;
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                  ✅ Critérios de Aceitação Técnica & UX
                </h3>
                <ul className="space-y-2 text-xs">
                  {currentScreenSpec.acceptanceCriteria.map((ac, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{ac}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* View Mode: Schematic & Preview Interactive Frame */}
        {(viewMode === 'preview' || viewMode === 'schematic') && (
          <div className="space-y-6">
            
            {/* Context Notice */}
            <div className="flex items-center justify-between text-xs px-2 text-slate-400">
              <span className="flex items-center gap-1.5 font-mono">
                {viewMode === 'schematic' ? (
                  <span className="text-cyan-400">● Modo Layout & Grid Ativo (Anotações de zonas)</span>
                ) : (
                  <span className="text-emerald-400">● Modo Pré-visualização UI de Alta Fidelidade</span>
                )}
              </span>
              <span>Proporção: {currentPlatformSpec.aspectRatio}</span>
            </div>

            {/* Platform 1: Website Screens */}
            {selectedPlatform === 'website' && (
              <div className="rounded-2xl border border-slate-800 bg-[#06091a] p-3 shadow-2xl">
                {/* Desktop Browser Chrome Mockup Header */}
                <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
                  </div>
                  <div className="w-1/2 max-w-md py-1 px-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-center text-slate-300 truncate">
                    https://ubluetv.com{currentScreenSpec.route}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">1920 x 1080 FHD</div>
                </div>

                <WebScreens 
                  screenId={selectedScreenId} 
                  isSchematicMode={viewMode === 'schematic'} 
                />
              </div>
            )}

            {/* Platform 2: Admin Dashboard Screens */}
            {selectedPlatform === 'admin' && (
              <div className="rounded-2xl border border-slate-800 bg-[#06091a] p-3 shadow-2xl">
                {/* Admin Desktop Window Header */}
                <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 mb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                    <span className="font-bold text-white text-xs">ORBE OTT Control Plane — Admin Console</span>
                  </div>
                  <div className="py-1 px-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300">
                    https://admin.ubluetv.com{currentScreenSpec.route}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400">TLS 1.3 • SuperAdmin Session</div>
                </div>

                <AdminScreens 
                  screenId={selectedScreenId} 
                  isSchematicMode={viewMode === 'schematic'} 
                />
              </div>
            )}

            {/* Platform 3: Mobile Android / iOS Screens */}
            {selectedPlatform === 'mobile' && (
              <div className="flex flex-col items-center justify-center py-4">
                <div className="text-center space-y-1 mb-4">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Moldura Mobile Responsiva (9:16)</span>
                  <p className="text-[11px] text-slate-400">Touch Target Mínimo: 48x48px • Suporte nativo a conexões 3G/4G/5G</p>
                </div>

                <MobileScreens 
                  screenId={selectedScreenId} 
                  isSchematicMode={viewMode === 'schematic'} 
                />
              </div>
            )}

            {/* Platform 4: Smart TV 10-Foot UI Screens + Remote Simulator */}
            {selectedPlatform === 'smart-tv' && (
              <div className="space-y-6">
                <div className="flex flex-col lg:flex-row items-start gap-6">
                  {/* TV Display Stage */}
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center justify-between text-xs px-2 text-slate-400">
                      <span className="font-mono text-cyan-400">TV Display: 16:9 • 10-Foot Cinema Mode</span>
                      <span className="text-slate-500">Android TV / Tizen OS / webOS</span>
                    </div>

                    <TvScreens 
                      screenId={selectedScreenId} 
                      isSchematicMode={viewMode === 'schematic'} 
                      focusedKey={tvFocusedKey}
                    />
                  </div>

                  {/* Interactive Smart TV Remote Control Panel */}
                  <div className="shrink-0 flex flex-col items-center space-y-3 w-full lg:w-auto">
                    <div className="text-center space-y-1">
                      <h4 className="text-xs font-bold text-white">Simulador de Controle Remoto</h4>
                      <p className="text-[10px] text-slate-400">Teste a navegação D-Pad em tempo real</p>
                    </div>

                    <TvRemoteControl 
                      onDpadPress={(dir) => {
                        setTvFocusedKey(`remote-${dir}`);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

    </div>
  );
};
