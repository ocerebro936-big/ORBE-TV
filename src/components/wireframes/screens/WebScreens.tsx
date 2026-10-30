import React, { useState } from 'react';
import { 
  Tv, Play, Search, ShoppingBag, ShieldCheck, User, Volume2, Maximize, 
  Settings, CheckCircle2, ArrowRight, Smartphone, Filter, Star, Clock, 
  MessageSquare, Radio, Share2, Sparkles, ChevronRight, Layers, Lock,
  Flame, Calendar, CreditCard, RefreshCw
} from 'lucide-react';

interface WebScreenProps {
  screenId: string;
  isSchematicMode: boolean;
}

export const WebScreens: React.FC<WebScreenProps> = ({ screenId, isSchematicMode }) => {
  // Screen 1: WEB-01 Portal Principal
  if (screenId === 'web-home') {
    return (
      <div className={`w-full rounded-xl overflow-hidden border ${isSchematicMode ? 'bg-slate-950/90 border-dashed border-blue-500/50' : 'bg-[#050814] border-slate-800'} text-slate-100 font-sans`}>
        {/* Wireframe Tag if Schematic */}
        {isSchematicMode && (
          <div className="bg-blue-950/80 px-4 py-1.5 border-b border-blue-500/30 flex items-center justify-between text-[11px] font-mono text-blue-300">
            <span>[ZONE: HEADER_STICKY] Grid: 12-Cols | Max-W: 1440px | Gutter: 24px</span>
            <span className="bg-blue-500/20 px-2 py-0.5 rounded border border-blue-400/30">SCHEMATIC BLUEPRINT</span>
          </div>
        )}

        {/* Global Web Header */}
        <header className="px-6 py-3.5 border-b border-slate-800 flex items-center justify-between bg-[#060a1e]/90">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">
                <Tv className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm tracking-tight">U<span className="text-blue-500">Blue</span> TV</span>
            </div>
            <nav className="hidden md:flex items-center gap-4 text-xs text-slate-300">
              <span className="text-blue-400 font-bold border-b-2 border-blue-500 pb-0.5">Início</span>
              <span className="hover:text-white cursor-pointer">TV Ao Vivo</span>
              <span className="hover:text-white cursor-pointer">Filmes</span>
              <span className="hover:text-white cursor-pointer">Séries</span>
              <span className="hover:text-white cursor-pointer">Be Universe</span>
              <span className="hover:text-white cursor-pointer">Pacotes</span>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
              <Search className="w-3.5 h-3.5" />
              <span className="text-[11px]">Pesquisar canais, filmes...</span>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 cursor-pointer">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Assistir Agora</span>
            </button>
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <User className="w-3.5 h-3.5" />
            </div>
          </div>
        </header>

        {/* Hero Section Wireframe */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-slate-950">
          {isSchematicMode && (
            <div className="absolute top-2 right-2 text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
              [ZONE: HERO_STAGE_16:9] Dynamic HLS Stream + Dual CTA
            </div>
          )}
          <div className="max-w-4xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-red-600/90 text-white font-mono font-bold text-[10px] tracking-wider animate-pulse">
                ● EM DIRETO
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono">
                1080p 60fps • Moçambique
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              Canal UBlue TV 24/7 Oficial: Notícias, Cultura e Entretenimento
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              A transmissão principal da primeira plataforma OTT de Moçambique. Assista a programas exclusivos, coberturas ao vivo, reality shows e talentos da Be Universe Agency.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer">
                <Play className="w-4 h-4 fill-current" />
                <span>Assistir Canal Principal</span>
              </button>
              <button className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 cursor-pointer">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>Ver Guia EPG Completo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="px-6 py-3 bg-[#050814] border-y border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-bold cursor-pointer">Todos os Conteúdos</span>
          <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-300 hover:text-white border border-slate-800 cursor-pointer">TV Aberta & Cabo</span>
          <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-300 hover:text-white border border-slate-800 cursor-pointer">Filmes & Séries</span>
          <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-300 hover:text-white border border-slate-800 cursor-pointer">Música & Clipes</span>
          <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-300 hover:text-white border border-slate-800 cursor-pointer">Be Universe Originals</span>
          <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-300 hover:text-white border border-slate-800 cursor-pointer">Rádios Moçambique</span>
        </div>

        {/* Subscription Plans Matrix Preview */}
        <div className="p-6 bg-slate-950/60 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-400" />
                <span>Pacotes de Assinatura UBlue TV (Cobrança em Meticais MT)</span>
              </h3>
              <p className="text-[11px] text-slate-400">Pague instantaneamente via M-Pesa da Vodacom ou E-Mola da Movitel</p>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono">Sem fidelização • Cancele quando quiser</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { name: 'Livre', price: '0 MT', desc: 'Canais abertos + AVOD', badge: 'Gratuito' },
              { name: 'Start', price: '25 MT', desc: 'Acesso 3 dias ou fim de semana', badge: 'Popular' },
              { name: 'Basic', price: '100 MT', desc: '1 Mês • Qualidade 720p HD', badge: 'Ideal' },
              { name: 'Médio', price: '250 MT', desc: '1 Mês • 1080p FHD + 2 Telas', badge: 'Recomendado' },
              { name: 'Max', price: '500 MT', desc: '1 Mês • 4K UHD + 4 Telas + PPV', badge: 'VIP' },
            ].map((pkg, idx) => (
              <div key={idx} className={`p-3.5 rounded-xl border ${idx === 2 ? 'bg-blue-950/40 border-blue-500' : 'bg-slate-900/60 border-slate-800'} flex flex-col justify-between`}>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{pkg.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">{pkg.badge}</span>
                  </div>
                  <div className="text-base font-extrabold text-blue-400">{pkg.price}</div>
                  <p className="text-[10px] text-slate-400 mt-1">{pkg.desc}</p>
                </div>
                <button className="mt-3 w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold cursor-pointer">
                  Subscrever
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Screen 2: WEB-02 Web Player Ao Vivo & Catch-up
  if (screenId === 'web-player') {
    return (
      <div className={`w-full rounded-xl overflow-hidden border ${isSchematicMode ? 'bg-slate-950 border-dashed border-cyan-500/50' : 'bg-[#030612] border-slate-800'} text-slate-100 font-sans`}>
        {isSchematicMode && (
          <div className="bg-cyan-950/80 px-4 py-1.5 border-b border-cyan-500/30 flex items-center justify-between text-[11px] font-mono text-cyan-300">
            <span>[ZONE: SPLIT_LAYOUT_75_25] Player Stage (75%) + Interactive EPG/Chat (25%)</span>
            <span className="bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-400/30">PLAYER HLS ENGINE</span>
          </div>
        )}

        {/* Player Navigation Header */}
        <div className="px-4 py-2 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[10px] font-bold">LIVE</span>
            <span className="font-bold text-white">Canal 01: UBlue TV Notícias & Cultura</span>
            <span className="text-slate-400 hidden sm:inline">• Emissão Direta Maputo</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <span className="text-emerald-400 font-mono text-[11px]">HLS 1080p @ 4.8 Mbps</span>
            <span className="text-slate-300">Latência: 3.2s</span>
          </div>
        </div>

        {/* Split Area: Video Screen + Right Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[380px]">
          {/* Main Video Canvas (3 Cols = 75%) */}
          <div className="lg:col-span-3 bg-black relative flex flex-col justify-between p-4 min-h-[320px]">
            {/* Top Video Overlay */}
            <div className="flex items-center justify-between text-xs text-white drop-shadow">
              <div className="flex items-center gap-2 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span className="font-semibold text-[11px]">Jornal da Noite Moçambique</span>
              </div>
              <div className="bg-black/60 px-2 py-1 rounded-lg text-[10px] font-mono text-cyan-300">
                POP Maputo: 12ms
              </div>
            </div>

            {/* Center Play Indicator */}
            <div className="self-center flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white flex items-center justify-center shadow-xl shadow-blue-600/40 cursor-pointer">
                <Play className="w-7 h-7 fill-current ml-1" />
              </div>
              <span className="text-[11px] text-slate-300 bg-black/60 px-2.5 py-0.5 rounded-full">Transmitindo ao vivo</span>
            </div>

            {/* Bottom Scrubber & Controls OSD */}
            <div className="bg-gradient-to-t from-black/95 via-black/80 to-transparent p-3 rounded-lg space-y-2">
              {/* DVR Time Scrub Bar */}
              <div className="flex items-center gap-3 text-[10px] font-mono text-slate-300">
                <span className="text-red-400">AO VIVO</span>
                <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden relative cursor-pointer">
                  <div className="h-full bg-blue-500 w-[95%]"></div>
                </div>
                <span>-02:14:00 (DVR 2h)</span>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between text-slate-200 text-xs">
                <div className="flex items-center gap-3">
                  <button className="text-white hover:text-blue-400"><Play className="w-4 h-4 fill-current" /></button>
                  <button className="text-white hover:text-blue-400"><Volume2 className="w-4 h-4" /></button>
                  <span className="text-[11px] text-slate-400">19:42 / 20:30</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono border border-slate-700 cursor-pointer">
                    1080p FHD
                  </span>
                  <span className="hover:text-white cursor-pointer"><Settings className="w-4 h-4" /></span>
                  <span className="hover:text-white cursor-pointer"><Maximize className="w-4 h-4" /></span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar (1 Col = 25%): Tabs EPG vs Chat */}
          <div className="bg-[#050817] border-l border-slate-800 flex flex-col justify-between">
            <div className="border-b border-slate-800 flex text-xs font-semibold">
              <button className="flex-1 py-2.5 bg-blue-950/50 text-blue-400 border-b-2 border-blue-500 text-center">
                Programação EPG
              </button>
              <button className="flex-1 py-2.5 text-slate-400 hover:text-white text-center">
                Chat Ao Vivo (248)
              </button>
            </div>

            {/* EPG Schedule Timeline */}
            <div className="p-3 space-y-2 text-xs overflow-y-auto max-h-[280px]">
              <div className="p-2 rounded-lg bg-blue-950/30 border border-blue-500/40">
                <div className="flex items-center justify-between text-[10px] text-blue-400 font-mono">
                  <span>AGORA • 19:30 - 20:30</span>
                  <span className="px-1.5 py-0.2 rounded bg-blue-500 text-white text-[9px]">NO AR</span>
                </div>
                <p className="font-bold text-white text-xs mt-0.5">Jornal da Noite UBlue</p>
                <p className="text-[10px] text-slate-300">As principais notícias de Maputo, Beira e Nampula.</p>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono">20:30 - 21:30</div>
                <p className="font-semibold text-slate-200 text-xs">Be Universe Talent Show: Edição Especial</p>
                <p className="text-[10px] text-slate-400">Apresentação dos finalistas de canto e dança.</p>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono">21:30 - 23:00</div>
                <p className="font-semibold text-slate-200 text-xs">Cinema Moçambicano: O Resgate</p>
                <p className="text-[10px] text-slate-400">Filme original com áudio em português e changana.</p>
              </div>
            </div>

            {/* Channel Quick Switcher Footer */}
            <div className="p-2.5 border-t border-slate-800 bg-slate-950 text-[11px] flex items-center justify-between">
              <span className="text-slate-400">Outros canais:</span>
              <button className="text-blue-400 hover:text-white font-semibold">Ver todos (18)</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Screen 3: WEB-03 Catálogo VOD & Filtros
  if (screenId === 'web-vod-catalog') {
    return (
      <div className={`w-full rounded-xl overflow-hidden border ${isSchematicMode ? 'bg-slate-950 border-dashed border-cyan-500/50' : 'bg-[#050814] border-slate-800'} text-slate-100 font-sans p-6 space-y-5`}>
        {isSchematicMode && (
          <div className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 p-2 rounded border border-cyan-500/30 flex items-center justify-between">
            <span>[ZONE: VOD_CATALOG_GRID] Responsive 4-6 Col Matrix | Multi-attribute Filters</span>
            <span>GRID SYSTEM: 16px GAP</span>
          </div>
        )}

        {/* Toolbar & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white">Filtros:</span>
            <select className="bg-slate-950 border border-slate-700 text-xs rounded-lg px-2.5 py-1 text-slate-200">
              <option>Todos os Gêneros</option>
              <option>Ação & Aventura</option>
              <option>Drama</option>
              <option>Comédia</option>
              <option>Documentários</option>
            </select>
            <select className="bg-slate-950 border border-slate-700 text-xs rounded-lg px-2.5 py-1 text-slate-200">
              <option>Idioma: Todos</option>
              <option>Português</option>
              <option>Changana</option>
              <option>Macua</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Ordenar:</span>
            <select className="bg-slate-950 border border-slate-700 text-xs rounded-lg px-2.5 py-1 text-slate-200">
              <option>Mais Populares</option>
              <option>Adicionados Recentemente</option>
              <option>Melhor Classificados</option>
            </select>
          </div>
        </div>

        {/* VOD Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { title: 'Be Universe: Estrelas de Maputo', type: 'Reality Show', ep: 'T1 • 8 Episódios', badge: 'Original', tier: 'Livre' },
            { title: 'Ritmos do Índico', type: 'Música & Documentário', ep: '1h 45m', badge: '4K HDR', tier: 'Basic' },
            { title: 'Sombras do Zambeze', type: 'Série de Suspense', ep: 'T1 • 6 Episódios', badge: 'Novo', tier: 'Médio' },
            { title: 'Pérolas do Humor Moçambicano', type: 'Comédia', ep: 'Especial 50m', badge: 'Exclusivo', tier: 'Livre' },
          ].map((item, idx) => (
            <div key={idx} className="group rounded-xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-blue-500/80 transition-all p-2 flex flex-col justify-between">
              <div className="aspect-[16/10] bg-slate-800 rounded-lg relative overflow-hidden flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-blue-600/80 group-hover:scale-110 transition-transform flex items-center justify-center text-white">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
                <span className="absolute top-2 left-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-600 text-white font-bold">
                  {item.badge}
                </span>
                <span className="absolute bottom-2 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/80 text-cyan-300">
                  {item.tier}
                </span>
              </div>
              <div className="pt-2">
                <h4 className="font-bold text-white text-xs truncate group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span>{item.type}</span>
                  <span>{item.ep}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Screen 4: WEB-04 Checkout & Pagamento M-Pesa
  if (screenId === 'web-checkout') {
    return (
      <div className={`w-full rounded-xl overflow-hidden border ${isSchematicMode ? 'bg-slate-950 border-dashed border-red-500/50' : 'bg-[#080d24] border-slate-800'} text-slate-100 font-sans p-6 sm:p-8 max-w-xl mx-auto space-y-6`}>
        {isSchematicMode && (
          <div className="text-[11px] font-mono text-red-300 bg-red-950/60 p-2 rounded border border-red-500/30 flex items-center justify-between">
            <span>[ZONE: CHECKOUT_MPESA_MODAL] USSD Push Trigger (Vodacom M-Pesa / Movitel E-Mola)</span>
            <span>60s POLLING</span>
          </div>
        )}

        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
            <Lock className="w-3.5 h-3.5" />
            <span>Pagamento Seguro Móvel Moçambique</span>
          </div>
          <h2 className="text-xl font-bold text-white">Subscrever Pacote Basic (100 MT)</h2>
          <p className="text-xs text-slate-400">Válido por 30 dias • Acesso a todos os canais HD e catálogo</p>
        </div>

        {/* Method Picker */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Escolha o Método de Pagamento:</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border-2 border-red-600 bg-red-950/20 flex items-center gap-3 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-red-600 text-white font-bold flex items-center justify-center text-xs">M</div>
              <div>
                <p className="text-xs font-bold text-white">M-Pesa</p>
                <p className="text-[10px] text-slate-400">Vodacom Moçambique</p>
              </div>
            </div>
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center gap-3 cursor-pointer hover:border-slate-700">
              <div className="w-8 h-8 rounded-lg bg-orange-600 text-white font-bold flex items-center justify-center text-xs">E</div>
              <div>
                <p className="text-xs font-bold text-white">E-Mola</p>
                <p className="text-[10px] text-slate-400">Movitel Moçambique</p>
              </div>
            </div>
          </div>
        </div>

        {/* Phone Input Group */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Número de Telemóvel M-Pesa:</label>
          <div className="flex items-center rounded-xl bg-slate-950 border border-slate-700 px-3 py-2.5 text-xs">
            <span className="text-slate-400 font-mono mr-2 font-bold">+258</span>
            <input 
              type="text" 
              defaultValue="84 123 4567" 
              className="bg-transparent text-white font-mono font-bold focus:outline-none flex-1 text-sm"
            />
          </div>
          <p className="text-[10px] text-slate-400">Receberá um prompt USSD no seu telefone para autorizar com o seu PIN.</p>
        </div>

        {/* Action Button */}
        <button className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer">
          <ShieldCheck className="w-4 h-4" />
          <span>Confirmar e Pagar 100 MT via M-Pesa</span>
        </button>
      </div>
    );
  }

  // Screen 5: WEB-05 Perfil & Minha Conta
  return (
    <div className={`w-full rounded-xl overflow-hidden border ${isSchematicMode ? 'bg-slate-950 border-dashed border-blue-500/50' : 'bg-[#050814] border-slate-800'} text-slate-100 font-sans p-6 space-y-6`}>
      {isSchematicMode && (
        <div className="text-[11px] font-mono text-blue-300 bg-blue-950/60 p-2 rounded border border-blue-500/30 flex items-center justify-between">
          <span>[ZONE: USER_DASHBOARD] Account Subscriptions + Multi-Device Session Revocation</span>
          <span>ENTITLEMENTS ENGINE</span>
        </div>
      )}

      {/* Profile Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg text-white">
            UB
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Assinante UBlue Moçambique</h3>
            <p className="text-xs text-slate-400 font-mono">+258 84 987 6543 • Conta Verificada</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            Assinatura Ativa (Basic)
          </span>
          <button className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer">
            Fazer Upgrade
          </button>
        </div>
      </div>

      {/* Connected Devices Table */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
          Dispositivos Ativos (2 de 3 Telas em Uso)
        </h4>
        <div className="space-y-2">
          <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Tv className="w-4 h-4 text-blue-400" />
              <div>
                <p className="font-semibold text-white">Samsung Smart TV (Sala de Estar)</p>
                <p className="text-[10px] text-slate-400">Maputo • Transmitindo agora mesmo</p>
              </div>
            </div>
            <button className="text-red-400 hover:text-red-300 text-[11px] font-semibold">Desconectar</button>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <div>
                <p className="font-semibold text-white">Samsung Galaxy A54 (Android)</p>
                <p className="text-[10px] text-slate-400">Beira • Conectado via Vodacom 4G</p>
              </div>
            </div>
            <button className="text-red-400 hover:text-red-300 text-[11px] font-semibold">Desconectar</button>
          </div>
        </div>
      </div>
    </div>
  );
};
