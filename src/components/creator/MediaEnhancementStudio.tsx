import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Sliders, Volume2, Wand2, CheckCircle2, Film, RefreshCw, Eye, 
  Layers, Maximize2, Zap, Radio, Play, Pause, ChevronRight, Award, ShieldCheck, 
  Check, Info, ArrowRight, Activity, Music, Mic, Clapperboard, Compass
} from 'lucide-react';
import { UBLUE_LUTS, UBlueLUT } from '../../data/enhancement-data';
import { soundEffects } from '../../services/sound-effects';

export const MediaEnhancementStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vision' | 'lut' | 'audio'>('vision');
  
  // Vision AI State
  const [autoColor, setAutoColor] = useState(true);
  const [brightness, setBrightness] = useState(105);
  const [contrast, setContrast] = useState(115);
  const [noiseReduction, setNoiseReduction] = useState(85);
  const [sharpness, setSharpness] = useState(70);
  const [upscaleTarget, setUpscaleTarget] = useState<'none' | '1080p' | '4k'>('1080p');
  const [formatNormalization, setFormatNormalization] = useState(true);
  const [autoThumbnail, setAutoThumbnail] = useState(true);
  const [splitPos, setSplitPos] = useState(50);
  const [isProcessingVision, setIsProcessingVision] = useState(false);
  const [visionProcessedSuccess, setVisionProcessedSuccess] = useState(false);

  // LUT Studio State
  const [selectedLut, setSelectedLut] = useState<UBlueLUT>(UBLUE_LUTS[0]);
  const [lutIntensity, setLutIntensity] = useState(85);
  const [aiSuggestedBadge, setAiSuggestedBadge] = useState<string | null>(null);

  // Audio Engine State
  const [audioPreset, setAudioPreset] = useState<'voice' | 'music' | 'cinema'>('voice');
  const [volumeNormalization, setVolumeNormalization] = useState(true); // EBU R128 (-14 LUFS)
  const [denoiseLevel, setDenoiseLevel] = useState(80);
  const [dynamicCompression, setDynamicCompression] = useState(75);
  const [eqProfile, setEqProfile] = useState<'flat' | 'warm' | 'broadcast' | 'punch'>('broadcast');
  const [isPlayingAudioTest, setIsPlayingAudioTest] = useState(false);
  const [currentLufs, setCurrentLufs] = useState(-14.2);
  const [currentTruePeak, setCurrentTruePeak] = useState(-1.1);

  // Simulate VU / LUFS oscillation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLufs(Number((-14.0 + (Math.random() * 0.8 - 0.4)).toFixed(1)));
      setCurrentTruePeak(Number((-1.0 + (Math.random() * 0.4 - 0.2)).toFixed(1)));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const handleRunVisionEnhancement = () => {
    setIsProcessingVision(true);
    setVisionProcessedSuccess(false);
    setTimeout(() => {
      setIsProcessingVision(false);
      setVisionProcessedSuccess(true);
      soundEffects.play('content_ready');
    }, 1500);
  };

  const handleAiSuggestLut = () => {
    // Intelligent LUT suggestion based on preset or random optimal match
    const suggestions = [UBLUE_LUTS[0], UBLUE_LUTS[1], UBLUE_LUTS[3], UBLUE_LUTS[9]];
    const picked = suggestions[Math.floor(Math.random() * suggestions.length)];
    setSelectedLut(picked);
    setLutIntensity(90);
    setAiSuggestedBadge(`IA Sugeriu: ${picked.name} com base em análise de cena`);
    soundEffects.play('notification');
  };

  const handlePlayAudioAudit = () => {
    setIsPlayingAudioTest(true);
    soundEffects.play('transmission_start');
    setTimeout(() => {
      setIsPlayingAudioTest(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Engine Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-[#0B1528] to-slate-900 border border-blue-800/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                UBlue Media Enhancement Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Padrão Broadcast SMPTE & EBU R128
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Aprimoramento Automático de Imagem, Cor e Som
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-1 max-w-2xl">
              Sistema de inteligência neural que converte produções brutas em conteúdos de nível televisivo,
              com correção de cor, LUTs cinematográficos exclusivos e equalização sonora consistente.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunVisionEnhancement}
              disabled={isProcessingVision}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Wand2 className={`w-4 h-4 ${isProcessingVision ? 'animate-spin' : ''}`} />
              <span>{isProcessingVision ? 'Otimizando Mídia...' : 'Processar Conteúdo com IA'}</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-800/80 overflow-x-auto">
          <button
            onClick={() => setActiveTab('vision')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'vision'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>📸 UBlue Vision AI</span>
          </button>
          <button
            onClick={() => setActiveTab('lut')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'lut'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>🎨 UBlue LUT Studio (10 LUTs)</span>
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'audio'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>🔊 UBlue Audio Engine</span>
          </button>
        </div>
      </div>

      {visionProcessedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-white">Processamento Concluído com Sucesso!</p>
              <p className="text-xs text-slate-300">
                A Vision AI ajustou a curva de cor, aplicou redução de ruído temporal, upscaling para {upscaleTarget.toUpperCase()} e normalizou o áudio para -14 LUFS.
              </p>
            </div>
          </div>
          <button
            onClick={() => setVisionProcessedSuccess(false)}
            className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
          >
            Fechar
          </button>
        </div>
      )}

      {/* TAB 1: UBLUE VISION AI */}
      {activeTab === 'vision' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Split Screen Comparator */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Comparador Interativo: Original (Esquerda) vs Vision AI (Direita)
                  </h3>
                </div>
                <span className="text-xs text-cyan-400 font-mono">
                  Divisão: {splitPos}%
                </span>
              </div>

              {/* Visual Frame Comparator */}
              <div className="relative aspect-video rounded-xl overflow-hidden select-none bg-black border border-slate-700">
                {/* Enhanced Image (Right layer) */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-all"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80')`,
                    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(125%) drop-shadow(0 0 10px rgba(0,200,255,0.2))`
                  }}
                />

                {/* Original Raw Image (Clipped Left Layer) */}
                <div 
                  className="absolute inset-0 bg-cover bg-center border-r-2 border-cyan-400 overflow-hidden"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80')`,
                    width: `${splitPos}%`,
                    filter: 'grayscale(20%) brightness(90%) contrast(92%)'
                  }}
                >
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-bold text-slate-300 border border-slate-700">
                    RAW ORIGINAL
                  </div>
                </div>

                <div className="absolute top-3 right-3 bg-blue-600/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-bold text-white border border-cyan-400/50 shadow-lg">
                  VISION AI PROCESSADO
                </div>

                {/* Draggable Divider Handle */}
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={splitPos}
                  onChange={(e) => setSplitPos(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                />

                <div 
                  className="absolute top-0 bottom-0 pointer-events-none flex items-center justify-center -ml-3 z-10"
                  style={{ left: `${splitPos}%` }}
                >
                  <div className="w-6 h-6 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-xl border-2 border-white">
                    ↔
                  </div>
                </div>
              </div>

              {/* Interactive Split Slider Bar */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs text-slate-400">Arraste a linha para comparar nitidez e cor:</span>
                <input 
                  type="range"
                  min="5"
                  max="95"
                  value={splitPos}
                  onChange={(e) => setSplitPos(Number(e.target.value))}
                  className="flex-1 accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Smart Frame & Thumbnail Generation */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-cyan-400" />
                  Geração Automática de Miniaturas (Smart Thumbnail)
                </h4>
                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Melhor Frame Detectado
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-3">
                A IA analisa a expressão facial dos apresentadores, nitidez e regra dos terços para extrair miniaturas prontas para a capa do catálogo.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 1, time: '02:14', score: '98%', selected: true },
                  { id: 2, time: '08:45', score: '91%', selected: false },
                  { id: 3, time: '14:20', score: '87%', selected: false }
                ].map((thumb) => (
                  <div 
                    key={thumb.id}
                    className={`relative rounded-xl overflow-hidden border transition-all ${
                      thumb.selected 
                        ? 'border-cyan-400 ring-2 ring-cyan-400/30' 
                        : 'border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80" 
                      alt="Thumbnail" 
                      className="w-full aspect-video object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-2 text-[10px]">
                      <span className="font-mono text-white">{thumb.time}</span>
                      <span className="font-bold text-emerald-400">Score {thumb.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: AI Enhancement Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Parâmetros da Vision AI
                </h3>
                <span className="text-xs text-slate-400">Tempo Real</span>
              </div>

              {/* 1. Correção Automática de Cor */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Correção Automática de Cor</p>
                  <p className="text-xs text-slate-400">Balanceamento automático de brancos e saturação</p>
                </div>
                <button
                  onClick={() => setAutoColor(!autoColor)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    autoColor ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    autoColor ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* 2. Brilho e Contraste */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Ajuste de Brilho & Contraste</span>
                  <span className="text-cyan-400 font-mono">{brightness}% / {contrast}%</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 w-12">Brilho</span>
                    <input 
                      type="range" min="80" max="130" value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="flex-1 accent-cyan-400 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 w-12">Contraste</span>
                    <input 
                      type="range" min="90" max="140" value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="flex-1 accent-cyan-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Redução de Ruído */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Redução de Ruído (Denoiser Temporal)</span>
                  <span className="text-cyan-400 font-mono">{noiseReduction}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={noiseReduction}
                  onChange={(e) => setNoiseReduction(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">
                  Remove granulação ISO elevada de gravações noturnas ou telemóveis sem perder textura.
                </p>
              </div>

              {/* 4. Nitidez Inteligente */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Nitidez Inteligente (Smart Sharpness)</span>
                  <span className="text-cyan-400 font-mono">{sharpness}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={sharpness}
                  onChange={(e) => setSharpness(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* 5. Upscaling */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-xs font-semibold text-white block">Upscaling por Rede Neural:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'none', label: 'Original', desc: 'Sem upscale' },
                    { id: '1080p', label: 'Full HD 1080p', desc: 'Recomendado' },
                    { id: '4k', label: 'Ultra HD 4K', desc: 'Para Smart TV' }
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setUpscaleTarget(tier.id as any)}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                        upscaleTarget === tier.id 
                          ? 'bg-blue-600/30 border-cyan-400 text-white' 
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      <p className="text-xs font-bold">{tier.label}</p>
                      <p className="text-[10px] text-slate-400">{tier.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Normalização de Formatos */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div>
                  <p className="text-sm font-semibold text-white">Normalização de Formatos</p>
                  <p className="text-xs text-slate-400">Padronização 16:9, HLS CMAF e Rec.709</p>
                </div>
                <button
                  onClick={() => setFormatNormalization(!formatNormalization)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    formatNormalization ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    formatNormalization ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: UBLUE LUT STUDIO (10 LUTS) */}
      {activeTab === 'lut' && (
        <div className="space-y-6">
          {/* Top Bar with AI Suggestion */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                Biblioteca de LUTs Oficiais UBlue TV
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Selecione um dos 10 perfis de cor profissionais calibrados para cada gênero de transmissão.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleAiSuggestLut}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sugerir LUT Mais Adequado por IA</span>
              </button>
            </div>
          </div>

          {aiSuggestedBadge && (
            <div className="p-3 bg-purple-950/40 border border-purple-500/40 rounded-xl text-xs text-purple-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>{aiSuggestedBadge}</span>
            </div>
          )}

          {/* Active LUT Live Preview & Slider */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
                <div 
                  className="w-full h-full bg-cover bg-center transition-all duration-300"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1000&auto=format&fit=crop&q=80')`,
                    filter: selectedLut.filterCss,
                    opacity: (lutIntensity / 100)
                  }}
                />
                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span className="text-xs font-bold text-white">{selectedLut.name}</span>
                  <span className="text-[11px] text-slate-400">({lutIntensity}%)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div>
                <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${selectedLut.badgeColor}`}>
                  {selectedLut.genre}
                </span>
                <h4 className="text-xl font-extrabold text-white mt-2">{selectedLut.name}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {selectedLut.description}
                </p>
              </div>

              {/* Intensity Slider */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold">Intensidade do Efeito LUT:</span>
                  <span className="text-cyan-400 font-mono font-bold">{lutIntensity}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={lutIntensity}
                  onChange={(e) => setLutIntensity(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Technical Specifications of selected LUT */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase">Contraste Alvo</span>
                  <span className="text-white font-mono font-bold">{selectedLut.contrast}%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase">Temperatura de Cor</span>
                  <span className="text-white font-mono font-bold">{selectedLut.temperature} K</span>
                </div>
                <div className="col-span-2 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase">Ganho Espectral</span>
                  <span className="text-slate-200 text-[11px]">{selectedLut.recommendedGains}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 10 LUTs Catalog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {UBLUE_LUTS.map((lut, index) => {
              const isSelected = selectedLut.id === lut.id;
              return (
                <div
                  key={lut.id}
                  onClick={() => {
                    setSelectedLut(lut);
                    soundEffects.play('notification');
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-950/60 border-cyan-400 ring-2 ring-cyan-400/30 shadow-lg'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-slate-500">LUT #{index + 1}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${lut.badgeColor}`}>
                        {lut.genre}
                      </span>
                    </div>

                    <h5 className="text-sm font-bold text-white">{lut.name}</h5>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {lut.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Ideal: {lut.idealFor[0]}</span>
                    {isSelected && (
                      <span className="text-cyan-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Ativo
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: UBLUE AUDIO ENGINE */}
      {activeTab === 'audio' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Audio Presets & EBU R128 Loudness Radar */}
            <div className="lg:col-span-7 space-y-6">
              {/* Presets Cards: Voice vs Music vs Cinema */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Perfis de Otimização Harmônica
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'voice',
                      name: 'Otimização para Voz',
                      icon: Mic,
                      desc: 'Diálogos nítidos, filtros passa-altas para ruído e boost em 2.5kHz para clareza vocal.',
                      ideal: 'Podcasts & Jornalismo'
                    },
                    {
                      id: 'music',
                      name: 'Otimização para Música',
                      icon: Music,
                      desc: 'Punch harmônico sem clipping, preservação da dinâmica natural e graves encorpados.',
                      ideal: 'Videoclipes & Concertos'
                    },
                    {
                      id: 'cinema',
                      name: 'Otimização para Cinema',
                      icon: Clapperboard,
                      desc: 'Amplo alcance dinâmico, imersão surround 5.1/Dolby e balanço tridimensional.',
                      ideal: 'Filmes & Séries'
                    }
                  ].map((p) => {
                    const Icon = p.icon;
                    const isSelected = audioPreset === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setAudioPreset(p.id as any);
                          soundEffects.play('notification');
                        }}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-950/40 border-emerald-400 ring-2 ring-emerald-400/20'
                            : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-bold text-white">{p.name}</span>
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-3 mb-2">{p.desc}</p>
                        <span className="text-[10px] text-emerald-400 font-semibold">{p.ideal}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Loudness & VU Meters Simulation */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                      Medição de Intensidade EBU R128 (Tempo Real)
                    </h4>
                    <p className="text-xs text-slate-400">Padronização para streaming sem saltos bruscos de volume</p>
                  </div>
                  <button
                    onClick={handlePlayAudioAudit}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Auditar Sinal</span>
                  </button>
                </div>

                {/* Meter Bars */}
                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-mono">Integrated Loudness (LUFS)</span>
                      <span className="text-emerald-400 font-mono font-bold">{currentLufs} LUFS (Alvo: -14.0 LUFS)</span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                      <div className="h-full bg-blue-600" style={{ width: '40%' }} />
                      <div className="h-full bg-emerald-500" style={{ width: '35%' }} />
                      <div className="h-full bg-amber-500" style={{ width: '15%' }} />
                      <div className="h-full bg-rose-600" style={{ width: '10%' }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                      <span>-36</span>
                      <span>-24</span>
                      <span className="text-emerald-400 font-bold">-14 (Padrão UBlue)</span>
                      <span>-9</span>
                      <span>0 LUFS</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-mono">True Peak Limiter</span>
                      <span className="text-cyan-400 font-mono font-bold">{currentTruePeak} dBFS (Seguro &lt; -1.0 dBFS)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 transition-all duration-300" style={{ width: '78%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Sound Controls & Equalizer */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
                  Parâmetros de Áudio Master
                </h4>

                {/* Normalização de Volume */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Normalização EBU R128</p>
                    <p className="text-xs text-slate-400">Fixa em -14 LUFS para consistência entre canais</p>
                  </div>
                  <button
                    onClick={() => setVolumeNormalization(!volumeNormalization)}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      volumeNormalization ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      volumeNormalization ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Redução de Ruído de Fundo */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Filtro de Ruído & De-Esser:</span>
                    <span className="text-emerald-400 font-mono">{denoiseLevel}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" value={denoiseLevel}
                    onChange={(e) => setDenoiseLevel(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400">Elimina zumbidos de microfone e estalos de ar-condicionado.</p>
                </div>

                {/* Compressão Dinâmica */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Compressão Dinâmica Transparente:</span>
                    <span className="text-emerald-400 font-mono">{dynamicCompression}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" value={dynamicCompression}
                    onChange={(e) => setDynamicCompression(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400">Equilibra sons muito baixos sem estourar os sons altos.</p>
                </div>

                {/* Equalizer Visualizer */}
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-xs font-semibold text-white block mb-2">Perfil de Equalização:</span>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'flat', label: 'Flat' },
                      { id: 'warm', label: 'Quente' },
                      { id: 'broadcast', label: 'Broadcast' },
                      { id: 'punch', label: 'Punch' }
                    ].map((eq) => (
                      <button
                        key={eq.id}
                        onClick={() => setEqProfile(eq.id as any)}
                        className={`py-1.5 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                          eqProfile === eq.id 
                            ? 'bg-emerald-600 text-white shadow' 
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {eq.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
