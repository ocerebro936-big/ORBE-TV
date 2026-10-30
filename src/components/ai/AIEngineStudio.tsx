import React, { useState } from 'react';
import { Sparkles, Bot, FileText, Subtitles, TrendingUp, BarChart2, Clock, Languages, RefreshCw, CheckCircle2, Zap } from 'lucide-react';
import { ublueAI, AISummaryResult, AISubtitlesResult, AITrendReport, AIScheduleSlot } from '../../services/ai-engine';

export const AIEngineStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'summarizer' | 'subtitles' | 'trends' | 'audience' | 'schedule' | 'translate'>('summarizer');

  // Summarizer state
  const [sumTitle, setSumTitle] = useState('Debate Cultural: O Futuro da Marrabenta e Pandza em Moçambique');
  const [sumDesc, setSumDesc] = useState('Conversa ao vivo com historiadores da música e jovens produtores de beats da Matola discutindo a internacionalização dos ritmos moçambicanos.');
  const [summaryResult, setSummaryResult] = useState<AISummaryResult | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Subtitles state
  const [subLang, setSubLang] = useState<'Português' | 'Changana' | 'Sena' | 'Inglês'>('Changana');
  const [subtitlesResult, setSubtitlesResult] = useState<AISubtitlesResult | null>(null);
  const [isGeneratingSubs, setIsGeneratingSubs] = useState(false);

  // Trends state
  const trends: AITrendReport[] = ublueAI.getTrendingTopics();

  // Audience state
  const audience = ublueAI.getAudienceAnalysis();

  // Scheduler state
  const scheduleSlots: AIScheduleSlot[] = ublueAI.getIdealPublishingSlots('Geral');

  // Translation state
  const [transLang, setTransLang] = useState<'Inglês' | 'Francês' | 'Changana'>('Inglês');
  const [transResult, setTransResult] = useState<{ title: string; desc: string } | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleGenerateSummary = async () => {
    setIsSummarizing(true);
    const res = await ublueAI.generateSummary(sumTitle, sumDesc);
    setSummaryResult(res);
    setIsSummarizing(false);
  };

  const handleGenerateSubtitles = async () => {
    setIsGeneratingSubs(true);
    const res = await ublueAI.generateSubtitles(sumTitle, subLang);
    setSubtitlesResult(res);
    setIsGeneratingSubs(false);
  };

  const handleTranslate = async () => {
    setIsTranslating(true);
    const res = await ublueAI.translateMetadata(sumTitle, sumDesc, transLang);
    setTransResult(res);
    setIsTranslating(false);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-cyan-950/80 via-slate-900 to-blue-950 border border-cyan-500/30 shadow-2xl relative">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Inteligência Artificial Nativa</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            UBlue AI Engine
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Motor de inteligência artificial otimizado para o ecossistema moçambicano. Automatiza legendagem em línguas nacionais, resumos para os utilizadores, análise preditiva de audiência e detecção de tendências.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('summarizer')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'summarizer' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Resumos Automáticos</span>
        </button>

        <button
          onClick={() => setActiveTab('subtitles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'subtitles' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Subtitles className="w-3.5 h-3.5" />
          <span>Legendas (Changana/Sena/PT)</span>
        </button>

        <button
          onClick={() => setActiveTab('trends')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'trends' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Detector de Tendências</span>
        </button>

        <button
          onClick={() => setActiveTab('audience')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'audience' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Análise de Audiência</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'schedule' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Horários Ideais</span>
        </button>

        <button
          onClick={() => setActiveTab('translate')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'translate' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Languages className="w-3.5 h-3.5" />
          <span>Tradução Multilíngue</span>
        </button>
      </div>

      {/* Tab 1: Summarizer */}
      {activeTab === 'summarizer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Gerador de Resumos com IA</span>
            </h3>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Título do Programa ou Episódio:</label>
              <input
                type="text"
                value={sumTitle}
                onChange={(e) => setSumTitle(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Descrição / Pauta:</label>
              <textarea
                rows={4}
                value={sumDesc}
                onChange={(e) => setSumDesc(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2.5 text-white"
              />
            </div>
            <button
              onClick={handleGenerateSummary}
              disabled={isSummarizing}
              className="w-full py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSummarizing ? 'Processando no UBlue AI Engine...' : 'Gerar Resumo & Destaques'}</span>
            </button>
          </div>

          <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-cyan-400 uppercase tracking-widest text-[11px]">Resultado do UBlue AI</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">STATUS: OK</span>
            </div>

            {summaryResult ? (
              <div className="space-y-3.5">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Resumo Automático:</span>
                  <p className="text-slate-200 leading-relaxed font-sans mt-0.5 text-sm">{summaryResult.summary}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold mb-1">Pontos Principais:</span>
                  <ul className="space-y-1 list-disc list-inside text-slate-300">
                    {summaryResult.bulletPoints.map((pt, i) => <li key={i}>{pt}</li>)}
                  </ul>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold mb-1">Tópicos Chave:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {summaryResult.keyTopics.map((k, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500/20 text-cyan-300 font-mono text-[10px]">
                        #{k}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                  <strong>Público Recomendado:</strong> {summaryResult.targetAudience}
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500">
                Clique em "Gerar Resumo" para processar o conteúdo.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Subtitles */}
      {activeTab === 'subtitles' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Subtitles className="w-4 h-4 text-cyan-400" />
              <span>Geração de Legendas Automáticas</span>
            </h3>
            <p className="text-slate-300 leading-relaxed">
              O motor transcreve o áudio do vídeo ou transmissão ao vivo e gera marcações de tempo sincronizadas em línguas nacionais e internacionais.
            </p>

            <div>
              <label className="text-slate-300 font-semibold block mb-1.5">Idioma Alvo:</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Português', 'Changana', 'Sena', 'Inglês'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSubLang(lang)}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs cursor-pointer ${
                      subLang === lang ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateSubtitles}
              disabled={isGeneratingSubs}
              className="w-full py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>{isGeneratingSubs ? 'Gerando legendas com IA...' : `Gerar em ${subLang}`}</span>
            </button>
          </div>

          <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-cyan-400 uppercase tracking-widest text-[11px]">
                Legendas Sincronizadas ({subtitlesResult ? subtitlesResult.language : subLang})
              </span>
              <span className="text-[10px] font-mono text-slate-400">FORMATO: WebVTT / SRT</span>
            </div>

            {subtitlesResult ? (
              <div className="space-y-3 font-mono">
                {subtitlesResult.cues.map((cue, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
                    <div className="text-[10px] text-cyan-400 font-bold mb-1">
                      {cue.start} --&gt; {cue.end}
                    </div>
                    <div className="text-white text-xs font-sans font-medium">{cue.text}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500">
                Clique no botão para gerar as marcações em {subLang}.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Trends */}
      {activeTab === 'trends' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Tendências Detectadas em Moçambique (Tempo Real)</h3>
            <span className="text-xs text-cyan-400 font-mono">Algoritmo UBlue Trend v2.4</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trends.map((tr, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-extrabold text-cyan-400 font-mono">{tr.trendingTopic}</span>
                    <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                      {tr.growthPercentage}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase mb-2">Categoria: {tr.category}</div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{tr.suggestedAction}</p>
                </div>
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Score de Viralidade:</span>
                  <div className="flex items-center gap-1 text-cyan-400 font-bold font-mono">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{tr.viralScore}/100</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Audience */}
      {activeTab === 'audience' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-white">Análise Preditiva de Audiência & Sentimento</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-xs block mb-1">Taxa de Retenção Média</span>
              <span className="text-3xl font-black text-emerald-400">{audience.retentionRate}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-xs block mb-1">Sentimento Positivo no Chat</span>
              <span className="text-3xl font-black text-cyan-400">{audience.sentiment.positive}%</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-xs block mb-1">Horário de Pico</span>
              <span className="text-xl font-bold text-white font-mono mt-1 block">{audience.peakHours}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="font-bold text-white mb-2">Principais Províncias Conectadas:</div>
              {audience.topLocations.map((loc, i) => (
                <div key={i} className="flex justify-between border-b border-slate-800/50 pb-1">
                  <span>{loc.split(' ')[0]}</span>
                  <span className="font-mono text-cyan-400 font-bold">{loc.split(' ')[1]}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="font-bold text-white mb-2">Dispositivos & Conexão:</div>
              <p className="leading-relaxed">{audience.mobileTrafficRatio}</p>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                A IA ajusta automaticamente a taxa de bits (bitrate) para utilizadores de dados móveis 3G/4G, reduzindo travamentos a zero.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Publishing Schedule */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Horários Ideais para Publicação & Lives</h3>
            <span className="text-xs text-cyan-400 font-mono">Otimizador de Alcance M-Pesa</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scheduleSlots.map((slot, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white">{slot.recommendedDay}</span>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                      {slot.peakReachPercentage}% Alcance
                    </span>
                  </div>
                  <div className="text-lg font-black text-cyan-400 font-mono mb-2">{slot.recommendedTime}</div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{slot.reason}</p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500">
                  Recomendação calculada por IA
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Translation */}
      {activeTab === 'translate' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Languages className="w-4 h-4 text-cyan-400" />
              <span>Tradução & Internacionalização</span>
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Traduza sinopses e metadados de programas para exportar para outros países da África Austral e do mundo.
            </p>

            <div>
              <label className="text-slate-300 font-semibold block mb-1.5">Traduzir Para:</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Inglês', 'Francês', 'Changana'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setTransLang(lang)}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs cursor-pointer ${
                      transLang === lang ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleTranslate}
              disabled={isTranslating}
              className="w-full py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <Languages className="w-4 h-4" />
              <span>{isTranslating ? 'Traduzindo com IA...' : `Traduzir para ${transLang}`}</span>
            </button>
          </div>

          <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-cyan-400 uppercase tracking-widest text-[11px]">
                Metadados Traduzidos ({transLang})
              </span>
              <span className="text-[10px] font-mono text-emerald-400">AI LOCALIZED</span>
            </div>

            {transResult ? (
              <div className="space-y-3 font-sans">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Título:</span>
                  <div className="text-base font-bold text-white mt-1">{transResult.title}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Sinopse:</span>
                  <p className="text-slate-300 leading-relaxed mt-1">{transResult.desc}</p>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500">
                Selecione o idioma e clique em Traduzir para visualizar.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
