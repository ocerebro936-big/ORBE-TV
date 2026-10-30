import React, { useState } from 'react';
import { TechnicalDocumentViewer } from './TechnicalDocumentViewer';
import { MediaPlaneStudio } from './MediaPlaneStudio';
import { ControlPlaneStudio } from './ControlPlaneStudio';
import { MonetizationStudio } from './MonetizationStudio';
import { BeUniversePipelineStudio } from './BeUniversePipelineStudio';
import { InfrastructurePopsStudio } from './InfrastructurePopsStudio';
import { WireframeStudio } from '../wireframes/WireframeStudio';
import { MediaEnhancementStudio } from '../creator/MediaEnhancementStudio';
import { OpenBroadcastNetwork } from '../creator/OpenBroadcastNetwork';
import { OrbeScheduler } from '../creator/OrbeScheduler';
import { ManifestoSection } from '../creator/ManifestoSection';
import { 
  FileText, 
  Radio, 
  Users, 
  DollarSign, 
  Star, 
  Server, 
  ArrowLeft, 
  Play, 
  ShieldCheck, 
  Layers, 
  Activity,
  Cpu,
  Wand2,
  Globe,
  Calendar,
  ScrollText
} from 'lucide-react';

export type OttTab = 
  | 'doc' 
  | 'wireframes' 
  | 'media-enhancement'
  | 'scheduler'
  | 'open-broadcast'
  | 'media' 
  | 'control' 
  | 'monetization' 
  | 'be-universe' 
  | 'infrastructure'
  | 'manifesto';

interface OttEngineeringCenterProps {
  onBackToPortal: () => void;
  onLaunchPlayer: () => void;
  initialTab?: OttTab;
}

export const OttEngineeringCenter: React.FC<OttEngineeringCenterProps> = ({
  onBackToPortal,
  onLaunchPlayer,
  initialTab = 'doc'
}) => {
  const [activeTab, setActiveTab] = useState<OttTab>(initialTab);

  return (
    <div className="min-h-screen bg-[#040714] text-slate-100 flex flex-col font-sans">
      
      {/* Top Engineering Nav / Command Bar */}
      <header className="sticky top-0 z-40 bg-[#060a1e]/95 backdrop-blur-xl border-b border-blue-900/30 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Brand & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToPortal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Voltar ao Portal</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1.5px] flex items-center justify-center">
              <div className="w-full h-full bg-[#060a1e] rounded-[7px] flex items-center justify-center">
                <Cpu className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-white">ORBE TV</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  OTT CORE v1.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Media Plane & Control Plane Engineering Console
              </p>
            </div>
          </div>
        </div>

        {/* Center: Realtime Telemetry Badge */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>MEDIA PLANE: ONLINE</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-400">
            <span>CONTROL PLANE: 100% HEALTH</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>POP MAPUTO: 12ms</span>
          </div>
        </div>

        {/* Right Action: Launch Live TV Player & Wireframes */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('wireframes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'wireframes'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Wireframes UI/UX</span>
          </button>

          <button
            onClick={onLaunchPlayer}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Assistir Web Player</span>
          </button>
        </div>
      </header>

      {/* Main Tab Navigation Bar */}
      <div className="bg-[#050817] border-b border-slate-800/80 px-4 sm:px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto text-xs font-semibold scrollbar-none py-1">
          <button
            onClick={() => setActiveTab('doc')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
              activeTab === 'doc'
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Documento Técnico Completo</span>
          </button>

          <button
            onClick={() => setActiveTab('wireframes')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
              activeTab === 'wireframes'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-md shadow-cyan-500/30'
                : 'text-emerald-300 hover:text-white hover:bg-slate-900 border border-emerald-500/40'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Wireframes UI/UX (Tela por Tela)</span>
          </button>

          <button
            onClick={() => setActiveTab('media-enhancement')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
              activeTab === 'media-enhancement'
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                : 'text-cyan-300 hover:text-white hover:bg-slate-900 border border-cyan-500/30'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Media Enhancement (Vision AI + 10 LUTs + Audio EBU)</span>
          </button>

          <button
            onClick={() => setActiveTab('scheduler')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
              activeTab === 'scheduler'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                : 'text-indigo-300 hover:text-white hover:bg-slate-900 border border-indigo-500/30'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>ORBE Scheduler (Grelha 24/7)</span>
          </button>

          <button
            onClick={() => setActiveTab('open-broadcast')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
              activeTab === 'open-broadcast'
                ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30'
                : 'text-cyan-300 hover:text-white hover:bg-slate-900 border border-cyan-500/30'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Open Broadcast Network</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
              activeTab === 'media'
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Media Plane (RTMP/SRT • HLS • Transcoder)</span>
          </button>

          <button
            onClick={() => setActiveTab('control')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
              activeTab === 'control'
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Control Plane (M-Pesa • E-Mola • Entitlements)</span>
          </button>

          <button
            onClick={() => setActiveTab('monetization')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
              activeTab === 'monetization'
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Monetização (SVOD • AVOD • TVOD PPV)</span>
          </button>

          <button
            onClick={() => setActiveTab('be-universe')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
              activeTab === 'be-universe'
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Be Universe Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab('infrastructure')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
              activeTab === 'infrastructure'
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Infraestrutura & POPs Moçambique</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'doc' && <TechnicalDocumentViewer />}
        {activeTab === 'wireframes' && (
          <WireframeStudio 
            onBackToPortal={onBackToPortal} 
            onLaunchPlayer={onLaunchPlayer} 
          />
        )}
        {activeTab === 'media-enhancement' && <MediaEnhancementStudio />}
        {activeTab === 'scheduler' && <OrbeScheduler />}
        {activeTab === 'open-broadcast' && <OpenBroadcastNetwork />}
        {activeTab === 'media' && <MediaPlaneStudio />}
        {activeTab === 'control' && <ControlPlaneStudio />}
        {activeTab === 'monetization' && <MonetizationStudio />}
        {activeTab === 'be-universe' && <BeUniversePipelineStudio />}
        {activeTab === 'infrastructure' && <InfrastructurePopsStudio />}
        {activeTab === 'manifesto' && <ManifestoSection />}
      </main>

    </div>
  );
};
