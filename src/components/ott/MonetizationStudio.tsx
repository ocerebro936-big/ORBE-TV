import React, { useState } from 'react';
import { controlPlaneEngine } from '../../engine/control-plane-engine';
import { TVODEvent, AVODCampaign } from '../../types/ott-architecture';
import { DollarSign, Ticket, Tv, Play, Check, ExternalLink, Calendar, MapPin, Sparkles, AlertCircle } from 'lucide-react';

export const MonetizationStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'svod' | 'avod' | 'tvod'>('tvod');
  const [tvodEvents, setTvodEvents] = useState<TVODEvent[]>(controlPlaneEngine.getTVODEvents());
  const [avodCampaigns, setAvodCampaigns] = useState<AVODCampaign[]>(controlPlaneEngine.getAVODCampaigns());
  const [purchasedEventId, setPurchasedEventId] = useState<string | null>(null);
  const [issuedTicket, setIssuedTicket] = useState<{ number: string; hash: string } | null>(null);
  
  // AVOD preview simulator
  const [simulatedAdPlaying, setSimulatedAdPlaying] = useState<boolean>(false);
  const [adCountdown, setAdCountdown] = useState<number>(5);

  const handleBuyTicket = (event: TVODEvent) => {
    const res = controlPlaneEngine.purchaseTVODTicket(event.id);
    setTvodEvents([...controlPlaneEngine.getTVODEvents()]);
    setPurchasedEventId(event.id);
    setIssuedTicket({ number: res.ticketNumber, hash: res.qrCodeHash });
  };

  const handleSimulateAdPlayback = () => {
    setSimulatedAdPlaying(true);
    setAdCountdown(5);
    const interval = setInterval(() => {
      setAdCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setSimulatedAdPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-slate-950 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-semibold border border-cyan-500/20 mb-2">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Motor de Monetização Híbrida</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">SVOD • AVOD • TVOD Engine</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            A combinação moderna de três fontes de receita: assinaturas recorrentes, servidor programático de publicidade VAST/VMAP e venda de bilhetes Pay-Per-View para concertos e eventos ao vivo.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('tvod')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'tvod' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            TVOD (Pay-Per-View)
          </button>
          <button
            onClick={() => setActiveTab('avod')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'avod' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            AVOD (Publicidade)
          </button>
          <button
            onClick={() => setActiveTab('svod')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'svod' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            SVOD (Assinaturas)
          </button>
        </div>
      </div>

      {/* TAB 1: TVOD (Pay-Per-View) */}
      {activeTab === 'tvod' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Ticket className="w-4 h-4 text-amber-400" />
              <span>Eventos Pay-Per-View Disponíveis (Concertos, Lutas MMA, Conferências)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Receita Direta por Evento</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tvodEvents.map((evt) => (
              <div key={evt.id} className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-amber-500/40 transition-all">
                <div>
                  <div className="relative aspect-video">
                    <img src={evt.bannerImage} alt={evt.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-amber-500/30">
                      {evt.category}
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-black shadow-lg">
                      {evt.priceMT} MT
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="text-sm font-bold text-white leading-snug">{evt.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{evt.description}</p>
                    
                    <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-cyan-400" />
                        <span>{evt.date} às {evt.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  {evt.isPurchased ? (
                    <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-center text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4" />
                      <span>Bilhete Digital Ativo</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleBuyTicket(evt)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
                    >
                      Comprar Acesso PPV ({evt.priceMT} MT)
                    </button>
                  )}
                  <div className="text-center text-[10px] text-slate-500 mt-2 font-mono">
                    {evt.ticketSold.toLocaleString()} bilhetes emitidos
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Digital Ticket Modal / Confirmation Preview */}
          {issuedTicket && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Bilhete Digital Pay-Per-View Emitido com Sucesso!</span>
                </div>
                <div className="font-mono text-sm font-bold text-white">Número: {issuedTicket.number}</div>
                <p className="text-xs text-slate-400">
                  O token DRM deste evento foi atrelado à sua conta. A transmissão 4K será desbloqueada automaticamente no horário do evento.
                </p>
              </div>

              <div className="px-4 py-2 rounded-xl bg-black/60 border border-amber-500/30 font-mono text-xs text-amber-300 text-center">
                SELO DIGITAL AUTENTICADO
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AVOD (Publicidade VAST / VMAP) */}
      {activeTab === 'avod' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Tv className="w-4 h-4 text-cyan-400" />
                  <span>Servidor de Anúncios VAST 4.2 / VMAP Moçambique</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Gerenciamento de campanhas publicitárias com inserção dinâmica (SSAI/CSAI) para monetizar assinantes de pacotes gratuitos e de entrada.
                </p>
              </div>

              <button
                onClick={handleSimulateAdPlayback}
                disabled={simulatedAdPlaying}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50 shrink-0"
              >
                {simulatedAdPlaying ? `Anúncio Rodando (${adCountdown}s)` : 'Simular Inserção Pré-Roll (15s)'}
              </button>
            </div>

            {/* Simulated Video Ad Player Banner */}
            {simulatedAdPlaying && (
              <div className="relative aspect-video max-w-xl mx-auto rounded-xl bg-black border border-cyan-500/50 overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-black font-black text-[10px]">
                    PUBLICIDADE • VAST 4.2
                  </span>
                  <span className="text-slate-300 font-mono text-[11px]">Vodacom M-Pesa Spot</span>
                </div>

                <div className="text-center space-y-2">
                  <div className="text-lg font-black text-cyan-400">Vodacom Moçambique — Tudo Bom</div>
                  <p className="text-xs text-slate-300">Pague a sua ORBE TV direto pelo M-Pesa sem complicações.</p>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="text-slate-400 text-[11px] font-mono">Vídeo 1 de 1</div>
                  <button className="px-3 py-1 rounded bg-slate-800 text-slate-300 text-xs font-mono">
                    Pular em {adCountdown}s...
                  </button>
                </div>
              </div>
            )}

            {/* Campaign Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">Anunciante</th>
                    <th className="py-2.5 px-3">Campanha</th>
                    <th className="py-2.5 px-3">Formato</th>
                    <th className="py-2.5 px-3">Duração</th>
                    <th className="py-2.5 px-3">CPM (MT)</th>
                    <th className="py-2.5 px-3">Impressões Entregues</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {avodCampaigns.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-3 font-bold text-white">{c.advertiser}</td>
                      <td className="py-3 px-3 text-cyan-300">{c.title}</td>
                      <td className="py-3 px-3 uppercase text-blue-400">{c.type}</td>
                      <td className="py-3 px-3">{c.durationSec}s</td>
                      <td className="py-3 px-3">{c.cpmMT} MT</td>
                      <td className="py-3 px-3 text-emerald-400">{c.impressionsDelivered.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">
                          {c.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SVOD (Assinaturas) */}
      {activeTab === 'svod' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-2">Visão Geral dos 5 Planos de Assinatura (SVOD)</h3>
            <p className="text-xs text-slate-400 mb-4">
              Distribuição de receita recorrente mensal (MRR) projetada para a base moçambicana:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {[
                { name: 'Canais Livres', price: '0 MT', cycle: 'Sempre Grátis', share: '35% da Base', color: 'border-slate-700' },
                { name: 'ORBE Start', price: '25 MT', cycle: 'por 7 dias', share: '30% da Base', color: 'border-emerald-500/50' },
                { name: 'ORBE Basic', price: '100 MT', cycle: 'por mês', share: '22% da Base', color: 'border-blue-500/50' },
                { name: 'ORBE Médio', price: '250 MT', cycle: 'por quinzena', share: '9% da Base', color: 'border-purple-500/50' },
                { name: 'ORBE Max', price: '500 MT', cycle: 'por mês', share: '4% da Base', color: 'border-amber-500/50' }
              ].map((p) => (
                <div key={p.name} className={`p-4 rounded-xl bg-slate-950 border ${p.color} space-y-1`}>
                  <div className="text-xs font-bold text-white">{p.name}</div>
                  <div className="text-base font-black text-cyan-400">{p.price}</div>
                  <div className="text-[10px] text-slate-500">{p.cycle}</div>
                  <div className="pt-2 mt-2 border-t border-slate-800 text-[10px] font-mono text-emerald-400">{p.share}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
