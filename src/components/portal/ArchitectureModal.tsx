import React, { useState } from 'react';
import { X, Layers, ShieldCheck, Cpu, Database, Network, Key, CheckCircle, Zap } from 'lucide-react';
import { contentEngine } from '../../engine/content-normalizer';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOttBlueprint?: () => void;
  onOpenCorsProxy?: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
  onOpenOttBlueprint,
  onOpenCorsProxy,
}) => {
  const [activeTab, setActiveTab] = useState<'flow' | 'plugins' | 'security' | 'entitlement' | 'cors-proxy'>('flow');

  if (!isOpen) return null;

  const plugins = contentEngine.getPlugins();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-left">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#080c1e] border border-blue-500/30 p-6 sm:p-8 shadow-2xl shadow-blue-900/40">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-1 px-2.5 py-0.5 rounded-full bg-blue-950/60 border border-blue-500/20">
            <Cpu className="w-3.5 h-3.5" />
            <span>Engenharia de Software UBlue</span>
          </div>
          <h3 className="text-2xl font-black text-white">Arquitetura Técnica do Ecossistema</h3>
          <p className="text-xs text-slate-300">
            UBlue Content Engine, Plugin Gateway, CORS Bypass Proxy & Subscription Engine.
          </p>
        </div>

        {/* Callout to OTT Engineering Center & CORS Monitor */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {onOpenOttBlueprint && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-cyan-950/60 border border-blue-500/40 flex flex-col justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>Centro de Engenharia OTT</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Media Plane (RTMP/SRT), Control Plane, PostgreSQL DDL e APIs OpenAPI.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenOttBlueprint();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue-600/30 text-center"
              >
                Abrir Cockpit OTT &rarr;
              </button>
            </div>
          )}

          {onOpenCorsProxy && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-emerald-950/60 border border-cyan-500/40 flex flex-col justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Monitor CORS Proxy & Relayer</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Inversor de cabeçalhos, teste de streams .m3u8/.ts e bypass de User-Agent.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenCorsProxy();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-emerald-600/30 text-center"
              >
                Testar Sinais no Proxy &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 mb-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'flow' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Diagrama do Ecossistema
          </button>
          <button
            onClick={() => setActiveTab('cors-proxy')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'cors-proxy' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🛡️ CORS Proxy & Relayer
          </button>
          <button
            onClick={() => setActiveTab('plugins')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'plugins' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Conectores & Plugins (/plugins)
          </button>
          <button
            onClick={() => setActiveTab('entitlement')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'entitlement' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Subscription & Entitlements
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'security' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Segurança & Proteção de Chaves
          </button>
        </div>

        {/* Tab 1: Flow */}
        {activeTab === 'flow' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Network className="w-4 h-4 text-blue-400" />
                <span>Separação de Camadas: Portal Web vs. App & Core</span>
              </h4>

              <div className="font-mono text-[11px] sm:text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800/80 overflow-x-auto leading-relaxed whitespace-pre">
{`                 UBLUE ECOSYSTEM
                       │
          ┌────────────┴────────────┐
          │                         │
     UBlue Website             UBlue App
     (Porta de Entrada)        (Experiência TV)
          │                         │
     Marketing                    Player HLS
     Downloads APK/PWA            EPG Guide
     Pacotes (MT)                 Live Channels
     Pagamentos M-Pesa            Search Unificada
     Suporte                      Plugin Hub
          │                         │
          └────────────┬────────────┘
                       ↓
                UBLUE API CORE
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
   User Engine    Content Engine   Payment Engine
   (Perfis/Auth)  (Normalizer/EPG) (M-Pesa/E-Mola)
        │              │              │
        └──────────────┼──────────────┘
                       ↓
                UBLUE DATABASE`}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs font-bold text-cyan-400 mb-1">O Site Oficial (Fase 1)</div>
                <p className="text-xs text-slate-300">
                  Responsável por atrair, converter, explicar os pacotes a partir de 25 MT, processar o pagamento via M-Pesa/E-Mola e direcionar o download do APK Android ou PWA.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs font-bold text-blue-400 mb-1">O App & Content Engine (Fase 2 & 3)</div>
                <p className="text-xs text-slate-300">
                  Entrega a televisão ao vivo, normaliza conteúdos de múltiplos parceiros e garante que o usuário desfrute de streaming com latência mínima e sem fragmentação.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Plugins */}
        {activeTab === 'plugins' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Cada conector no diretório <code className="text-blue-400 font-mono">/plugins</code> conversa com uma API autorizada e obedece à interface TypeScript estrita <code className="text-cyan-400 font-mono">UBlueContentPlugin</code>:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {plugins.map((plugin) => (
                <div key={plugin.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-white">/{plugin.id}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {plugin.latencyMs}ms
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-blue-300 mb-1">{plugin.name}</div>
                    <p className="text-[11px] text-slate-400 leading-tight mb-2">{plugin.description}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                    <span>v{plugin.version}</span>
                    <span className="text-emerald-400 font-medium">● Conectado</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Entitlement */}
        {activeTab === 'entitlement' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-2">Hierarquia de Direitos e Desbloqueio</h4>
              <div className="font-mono text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800/80 leading-relaxed whitespace-pre overflow-x-auto">
{`Utilizador
     ↓
Conta UBlue
     ↓
Plano Ativo (Livre -> Start 25MT -> Basic 100MT -> Médio 250MT -> Max 500MT)
     ↓
Entitlements Engine Check
     ↓
Pode assistir canal selecionado?
   ↙       ↘
 SIM       NÃO
  ↓         ↓
PLAYER   🔒 Modal Elegante de Upgrade`}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              Os pacotes e canais são configuráveis no servidor sem necessidade de atualizar o aplicativo instalado no telemóvel dos utilizadores.
            </div>
          </div>
        )}

        {/* Tab 4: Security */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30">
                <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">
                  ❌ Abordagem Insegura (Errada)
                </div>
                <div className="font-mono text-xs text-slate-300 bg-slate-950/80 p-3 rounded-lg border border-red-500/20 leading-relaxed whitespace-pre">
{`APP → API externa
   [API_KEY_EXPOSTA]`}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Chaves vazadas em decompilação de APKs, sem controle de taxa e custos descontrolados.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                  ✅ Arquitetura UBlue TV (Correta)
                </div>
                <div className="font-mono text-xs text-slate-300 bg-slate-950/80 p-3 rounded-lg border border-emerald-500/20 leading-relaxed whitespace-pre">
{`APP
 ↓ (Tokens Bearer seguros)
UBlue API Core
 ↓
Plugin Server Seguro
 ↓ (Chaves protegidas no servidor)
API Externa / Parceiro`}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Proteção completa contra fraudes, controle de cache, direitos autorais e limites de requisição.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: CORS Proxy & Relayer */}
        {activeTab === 'cors-proxy' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Proxy de Sinal e Inversor de Cabeçalhos (corsProxyServer.js)</span>
                </h4>
                {onOpenCorsProxy && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCorsProxy();
                    }}
                    className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold cursor-pointer transition-colors"
                  >
                    Abrir Monitor & Testador &rarr;
                  </button>
                )}
              </div>

              <div className="font-mono text-[11px] sm:text-xs text-cyan-300 bg-slate-950 p-4 rounded-xl border border-slate-800 leading-relaxed whitespace-pre overflow-x-auto">
{`NAVEGADOR / APP (SmartTV / Telemóvel)
       │
       │ GET /api/proxy-playlist?url=https://origem.com/live.m3u8
       ▼
UBLUE BACKEND (corsProxyServer.js / Node.js)
       │
       ├─ Mascaramento User-Agent: Mozilla/5.0 (SmartTV; UBlueTV Engine/3.2)
       ├─ Mascaramento Referer: https://origem.com
       ├─ Suporte a Cabeçalho Range: bytes (Zero atraso de buffer)
       │
       ▼
ORIGEM EXTERNA (CDN Akamai, Cloudflare, Amagi, FAST)
       │
       │ Devolve stream binário ou playlist .m3u8
       ▼
UBLUE STREAM RELAYER
       │
       ├─ Reescrita dinâmica de segmentos: chunk1.ts → /api/proxy-stream?url=...
       ├─ Reescrita de chaves AES-128: #EXT-X-KEY → /api/proxy-stream?url=...
       ├─ Inversão de Cabeçalhos: Access-Control-Allow-Origin: *
       │
       ▼
PLAYER HLS.JS (Reprodução Direta Instantânea Sem Erro de CORS)`}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="font-bold text-emerald-400 mb-1">1. /api/proxy-playlist</div>
                <p className="text-slate-400 text-[11px]">
                  Processa manifests m3u8, convertendo todas as referências de vídeo e áudio em endpoints locais permitidos.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="font-bold text-cyan-400 mb-1">2. /api/proxy-stream</div>
                <p className="text-slate-400 text-[11px]">
                  Transmissão streaming sem buffer em memória via <code className="text-slate-200">pipe()</code>, com suporte total a seeking HTTP 206.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="font-bold text-blue-400 mb-1">3. /api/proxy-health</div>
                <p className="text-slate-400 text-[11px]">
                  Diagnóstico contínuo e monitor de latência para failover transparente entre nós espelho.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
