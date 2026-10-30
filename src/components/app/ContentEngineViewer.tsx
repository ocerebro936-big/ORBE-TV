import React, { useState } from 'react';
import { Cpu, CheckCircle, RefreshCw, Power, Zap, Activity, Filter, Layers, Database } from 'lucide-react';
import { contentEngine } from '../../engine/content-normalizer';
import { UBlueContentPlugin } from '../../plugins/plugin-interface';

export const ContentEngineViewer: React.FC = () => {
  const [plugins, setPlugins] = useState<UBlueContentPlugin[]>(contentEngine.getPlugins());
  const [normalizedSample, setNormalizedSample] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'plugins' | 'normalizer' | 'logs'>('plugins');

  const handleToggle = (id: string) => {
    contentEngine.togglePlugin(id);
    setPlugins([...contentEngine.getPlugins()]);
  };

  const handleTestNormalize = () => {
    const rawData = {
      id: `ext-raw-${Math.floor(Math.random() * 9000) + 1000}`,
      title: 'Festival da Marrabenta 2026 - Ao Vivo na Cidade da Matola',
      description: 'Transmissão parceira com artistas convidados e orquestra popular.',
      category: 'music',
      provider: 'Matola Broadcasters Stream',
      rights: 'licensed',
      country: 'Moçambique',
      subscriptionTier: 'start',
      viewersCount: 9420,
      tags: ['música', 'marrabenta', 'matola', 'ao vivo']
    };

    const normalized = contentEngine.normalizeExternalItem(rawData, 'partner-tv');
    setNormalizedSample(normalized);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Núcleo de Agregação e Normalização</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            UBlue Content Engine Core
          </h2>
          <p className="text-xs text-slate-400">
            Gerenciamento de plugins autorizados em <code className="text-blue-400 font-mono">/plugins</code> e Content Normalizer.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>9 Conectores Ativos</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('plugins')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'plugins' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Plugins Ativos (/plugins)
        </button>
        <button
          onClick={() => setActiveTab('normalizer')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'normalizer' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Testar Content Normalizer
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'logs' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Pipeline & Segurança
        </button>
      </div>

      {/* Tab 1: Plugins */}
      {activeTab === 'plugins' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {plugins.map((plugin) => {
            const isActive = contentEngine.isPluginActive(plugin.id);
            return (
              <div
                key={plugin.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-900/80 border-slate-800 hover:border-blue-500/40'
                    : 'bg-slate-950/40 border-slate-900 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-extrabold text-blue-400">
                      /{plugin.id}
                    </span>
                    <button
                      onClick={() => handleToggle(plugin.id)}
                      className={`p-1 rounded-md transition-colors cursor-pointer ${
                        isActive ? 'text-emerald-400 hover:bg-emerald-950/50' : 'text-slate-500 hover:bg-slate-800'
                      }`}
                      title={isActive ? 'Desativar plugin' : 'Ativar plugin'}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="text-xs font-bold text-white mb-1">{plugin.name}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                    {plugin.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    {plugin.latencyMs}ms
                  </span>
                  <span className="text-slate-500">v{plugin.version}</span>
                  <span className={isActive ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {isActive ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Normalizer */}
      {activeTab === 'normalizer' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-1">Como funciona o Content Normalizer:</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Cada API parceira fornece formatos diferentes (XML, JSON, RSS, HLS streams). O Content Normalizer padroniza tudo em um único esquema oficial <code className="text-cyan-400 font-mono">UBlueContentItem</code> com controle de direitos, qualidade e plano mínimo.
            </p>
            <button
              onClick={handleTestNormalize}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Simular Ingestão e Normalização de Stream</span>
            </button>
          </div>

          {normalizedSample && (
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-cyan-400">Item Normalizado no UBlue Catalog:</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                  STATUS: INGEST_SUCCESS
                </span>
              </div>
              <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto p-3 bg-black/60 rounded-lg">
                {JSON.stringify(normalizedSample, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Security & Pipeline */}
      {activeTab === 'logs' && (
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 text-xs text-slate-300">
          <div className="font-bold text-white text-sm">Proteção contra Exposição de Chaves de API</div>
          <p className="leading-relaxed">
            Conforme a especificação de segurança (Seção 9):
          </p>
          <div className="p-3 rounded-lg bg-black/60 font-mono text-[11px] text-cyan-300 border border-slate-800">
            CLIENT (App / Web) → UBlue Gateway Core (Token JWT) → Plugin Server Seguro → APIs Externas Parceiras
          </div>
          <ul className="space-y-1.5 list-disc list-inside text-slate-400">
            <li>Nenhuma chave de parceiro (YouTube, feeds de esportes ou cinema) é compilada no APK ou exposta no bundle front-end.</li>
            <li>Cache local em servidor reduz custos de API externa em até 85%.</li>
            <li>Validação de geolocalização e plano do assinante feita em microssegundos antes de entregar a playlist HLS.</li>
          </ul>
        </div>
      )}
    </div>
  );
};
