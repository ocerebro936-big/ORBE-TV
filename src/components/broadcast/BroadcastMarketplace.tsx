import React, { useState } from 'react';
import {
  DollarSign,
  Tv,
  Calendar,
  Clock,
  TrendingUp,
  Users,
  Eye,
  CheckCircle2,
  AlertCircle,
  Filter,
  PlusCircle,
  ShieldCheck,
  Megaphone,
  Music,
  Film,
  GraduationCap,
  Sparkles,
  ArrowRight,
  BarChart3,
  CreditCard,
  FileText
} from 'lucide-react';
import {
  SLOT_PRICING_TIERS,
  MOCK_BROADCAST_MARKETPLACE_ITEMS
} from '../../data/real-broadcast-data';
import {
  BroadcastMarketplaceItem,
  BroadcastSlotTier,
  BroadcastContentType,
  CreatorMarketplaceProfile
} from '../../types/broadcast-network';
import { soundEffects } from '../../services/sound-effects';

interface BroadcastMarketplaceProps {
  onOpenClearanceTab?: () => void;
  onOpenWalletModal?: () => void;
}

export const BroadcastMarketplace: React.FC<BroadcastMarketplaceProps> = ({
  onOpenClearanceTab,
  onOpenWalletModal
}) => {
  const [items, setItems] = useState<BroadcastMarketplaceItem[]>(MOCK_BROADCAST_MARKETPLACE_ITEMS);
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);

  // Booking Form State
  const [bookTitle, setBookTitle] = useState<string>('');
  const [bookProfile, setBookProfile] = useState<CreatorMarketplaceProfile>('artista');
  const [bookType, setBookType] = useState<BroadcastContentType>('musica');
  const [bookTier, setBookTier] = useState<BroadcastSlotTier>('prime-time');
  const [bookDuration, setBookDuration] = useState<number>(5); // minutes
  const [bookSlotTime, setBookSlotTime] = useState<string>('20:00');
  const [bookOwnerName, setBookOwnerName] = useState<string>('Délio Silva Matola');
  const [bookNuit, setBookNuit] = useState<string>('104829104');
  const [bookPaymentMethod, setBookPaymentMethod] = useState<'mpesa' | 'emola' | 'card' | 'wallet'>('mpesa');
  const [bookPhone, setBookPhone] = useState<string>('+258 84 123 4567');
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);

  // Selected Tier Details
  const currentPricing = SLOT_PRICING_TIERS.find((t) => t.id === bookTier) || SLOT_PRICING_TIERS[3];
  
  // Calculate total budget in Meticais (MT)
  const calculateTotalCost = () => {
    const base = currentPricing.basePriceMT;
    if (bookDuration <= 2) return base;
    if (bookDuration <= 5) return Math.round(base * 1.4);
    if (bookDuration <= 15) return Math.round(base * 2.2);
    if (bookDuration <= 30) return Math.round(base * 3.5);
    return Math.round(base * 5.0);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle) return;

    const total = calculateTotalCost();

    const newItem: BroadcastMarketplaceItem = {
      id: `mkt-${Date.now()}`,
      creatorName: bookOwnerName || 'Criador UBlue',
      creatorProfile: bookProfile,
      title: bookTitle,
      contentType: bookType,
      targetSlot: bookSlotTime,
      tier: bookTier,
      durationMinutes: bookDuration,
      costMT: total,
      scheduledDate: 'Próxima Grelha · Em Aprovação',
      status: 'revisao_editorial',
      legalClearance: {
        contractNumber: `UBLUE-CLR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        rightsOwner: bookOwnerName,
        nuit: bookNuit || '400192837',
        territory: 'mz_exclusive',
        monetizationModel: 'revshare_70_30',
        revShareCreatorPercent: 70,
        revSharePlatformPercent: 30,
        signedAt: new Date().toISOString(),
        certificateHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        editorialChecklist: {
          gabinfoCompliance: true,
          incmBroadcastNorms: true,
          copyrightOwnershipVerified: true,
          ageClassification: 'Livre'
        }
      },
      liveStats: {
        peakViewers: 0,
        totalWatchTimeMinutes: 0,
        averageRetentionPercent: 0,
        revenueEarnedMT: 0,
        adInteractions: 0
      }
    };

    setItems([newItem, ...items]);
    setIsBookingModalOpen(false);
    setBookingSuccessMsg(`Reserva de transmissão criada com sucesso para "${bookTitle}"! Valor: ${total.toLocaleString('pt-PT')} MT`);
    soundEffects.play('payment_success');

    // Reset Form
    setBookTitle('');
  };

  const filteredItems = selectedFilter === 'todos'
    ? items
    : items.filter((item) => item.creatorProfile === selectedFilter);

  return (
    <div className="space-y-8 text-left">
      {/* Header Banner & UBlue TV Differential Statement */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Marketplace de Exibição & Promoção de Conteúdos</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            UBlue Sponsored Broadcast — "Pagar para Ser Visto"
          </h2>

          {/* Core positioning statement */}
          <blockquote className="border-l-4 border-cyan-400 pl-4 py-1 italic text-slate-200 text-sm sm:text-base leading-relaxed bg-white/5 rounded-r-xl pr-4">
            "A televisão onde qualquer criador, escola, empresa ou artista pode levar o seu conteúdo ao público através de programação real, transmissão profissional e monetização transparente."
          </blockquote>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Compre horários de exibição na grelha nacional de Moçambique sincronizada com o fuso <strong>CAT / UTC+2</strong>. Todos os conteúdos recebem revisão editorial e legal rigorosa antes de entrar no ar.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setIsBookingModalOpen(true);
                soundEffects.play('notification');
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 cursor-pointer flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Comprar Espaço de Transmissão</span>
            </button>

            {onOpenClearanceTab && (
              <button
                onClick={onOpenClearanceTab}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs cursor-pointer flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Ver Contratos & Direitos Autorais</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {bookingSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{bookingSuccessMsg}</span>
          </div>
          <button
            onClick={() => setBookingSuccessMsg(null)}
            className="text-slate-400 hover:text-white font-bold text-xs"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Pricing Matrix by Time Band */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-white">Tabela de Preços por Faixa Horária</h3>
            <p className="text-xs text-slate-400">Valores padronizados para exibição na grade oficial da UBlue TV</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-2.5 py-1 rounded-lg border border-cyan-800">
            Valores em Meticais (MT)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SLOT_PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`p-5 rounded-2xl border transition-all ${
                tier.id === 'prime-time'
                  ? 'bg-gradient-to-b from-rose-950/40 to-slate-900 border-rose-500/40 shadow-xl'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${tier.badgeColor}`}>
                  {tier.label}
                </span>
                <span className="text-xs font-mono text-slate-400">{tier.timeRange}</span>
              </div>

              <div className="mb-2">
                <div className="text-2xl font-black text-white">
                  {tier.basePriceMT.toLocaleString('pt-PT')} <span className="text-xs font-normal text-slate-400">MT / spot</span>
                </div>
                <div className="text-[11px] text-cyan-400 font-mono">
                  Alcance Médio: ~{tier.peakAudienceAvg.toLocaleString('pt-PT')} espectadores
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {tier.description}
              </p>

              <button
                onClick={() => {
                  setBookTier(tier.id);
                  setIsBookingModalOpen(true);
                  soundEffects.play('notification');
                }}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Selecionar Esta Faixa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Tracking & Telemetry Panel */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-white">
              Painel de Desempenho & Espaços Adquiridos
            </h3>
            <p className="text-xs text-slate-400">
              Acompanhe espectadores simultâneos, minutos assistidos e retorno gerado em tempo real
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs text-slate-500 font-bold mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Perfil:
            </span>
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'artista', label: 'Artistas (Música)' },
              { id: 'empresa', label: 'Empresas (Anúncios)' },
              { id: 'escola', label: 'Escolas (Cursos)' },
              { id: 'produtora', label: 'Produtoras (Filmes)' },
              { id: 'organizador', label: 'Organizadores (Eventos)' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  selectedFilter === f.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Telemetry Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Conteúdo / Criador</th>
                <th className="p-3.5">Horário & Faixa</th>
                <th className="p-3.5">Duração / Custo</th>
                <th className="p-3.5">Status Editorial</th>
                <th className="p-3.5">Espectadores</th>
                <th className="p-3.5">Tempo Assistido</th>
                <th className="p-3.5">Retenção</th>
                <th className="p-3.5">Receita Gerada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-white text-sm">{item.title}</div>
                    <div className="text-[11px] text-cyan-400 flex items-center gap-1">
                      <span>{item.creatorName}</span>
                      <span className="text-slate-500">·</span>
                      <span className="capitalize text-slate-400">({item.creatorProfile})</span>
                    </div>
                  </td>

                  <td className="p-3.5 whitespace-nowrap">
                    <div className="font-mono text-white font-semibold">{item.targetSlot} CAT</div>
                    <div className="text-[10px] text-slate-400">{item.scheduledDate}</div>
                  </td>

                  <td className="p-3.5 whitespace-nowrap">
                    <div className="font-mono text-white font-bold">{item.durationMinutes} min</div>
                    <div className="text-[11px] text-emerald-400 font-semibold">{item.costMT.toLocaleString('pt-PT')} MT</div>
                  </td>

                  <td className="p-3.5 whitespace-nowrap">
                    {item.status === 'no_ar' && (
                      <span className="px-2.5 py-1 rounded-md bg-red-600/20 text-red-400 border border-red-500/40 text-[10px] font-black uppercase flex items-center gap-1 w-max animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        NO AR AGORA
                      </span>
                    )}
                    {item.status === 'aprovado' && (
                      <span className="px-2.5 py-1 rounded-md bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3 h-3" />
                        Aprovado (Na Grelha)
                      </span>
                    )}
                    {item.status === 'revisao_editorial' && (
                      <span className="px-2.5 py-1 rounded-md bg-amber-600/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1 w-max">
                        <AlertCircle className="w-3 h-3" />
                        Revisão Jurídica INCM
                      </span>
                    )}
                  </td>

                  <td className="p-3.5 whitespace-nowrap font-mono text-cyan-300 font-bold">
                    {item.liveStats.peakViewers > 0
                      ? item.liveStats.peakViewers.toLocaleString('pt-PT')
                      : '—'}
                  </td>

                  <td className="p-3.5 whitespace-nowrap font-mono text-slate-300">
                    {item.liveStats.totalWatchTimeMinutes > 0
                      ? `${(item.liveStats.totalWatchTimeMinutes / 60).toFixed(0)} horas`
                      : '—'}
                  </td>

                  <td className="p-3.5 whitespace-nowrap font-mono text-emerald-400 font-bold">
                    {item.liveStats.averageRetentionPercent > 0
                      ? `${item.liveStats.averageRetentionPercent}%`
                      : '—'}
                  </td>

                  <td className="p-3.5 whitespace-nowrap font-mono text-white font-black">
                    {item.liveStats.revenueEarnedMT > 0
                      ? `${item.liveStats.revenueEarnedMT.toLocaleString('pt-PT')} MT`
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Modal ("Pagar para Ser Visto") */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-left">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#090d20] border border-blue-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xl font-bold text-white">Comprar Espaço de Exibição na UBlue TV</h3>
                <p className="text-xs text-slate-400">Serviço de promoção transparente e auditado com contrato digital</p>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
              {/* Step 1: Profile & Content Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Perfil do Solicitante:</label>
                  <select
                    value={bookProfile}
                    onChange={(e) => setBookProfile(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500"
                  >
                    <option value="artista">Artista / Músico</option>
                    <option value="empresa">Empresa / Anunciante Comercial</option>
                    <option value="escola">Escola / Universidade</option>
                    <option value="produtora">Produtora de Cinema / Vídeo</option>
                    <option value="organizador">Organizador de Eventos / Festivais</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Tipo de Conteúdo:</label>
                  <select
                    value={bookType}
                    onChange={(e) => setBookType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500"
                  >
                    <option value="musica">Música / Videoclipe</option>
                    <option value="video">Vídeo Geral / Curta-metragem</option>
                    <option value="documentario">Documentário</option>
                    <option value="empresa">Spot Publicitário Empresarial</option>
                    <option value="evento">Transmissão de Evento ao Vivo</option>
                    <option value="podcast">Podcast</option>
                    <option value="educacao">Curso / Tele-aula</option>
                  </select>
                </div>
              </div>

              {/* Title & Owner Info */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Título do Conteúdo / Campanha:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Videoclipe 'Menina da Polana' ou Campanha 'M-Pesa Empresas'"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Nome do Titular dos Direitos:</label>
                  <input
                    type="text"
                    required
                    value={bookOwnerName}
                    onChange={(e) => setBookOwnerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">NUIT da Entidade / Criador:</label>
                  <input
                    type="text"
                    required
                    value={bookNuit}
                    onChange={(e) => setBookNuit(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Step 2: Time Band & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Faixa Horária:</label>
                  <select
                    value={bookTier}
                    onChange={(e) => setBookTier(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500"
                  >
                    <option value="madrugada">Madrugada (00:00–06:00) · 2.500 MT</option>
                    <option value="manha">Manhã (06:00–12:00) · 6.800 MT</option>
                    <option value="tarde">Tarde (12:00–18:00) · 8.900 MT</option>
                    <option value="prime-time">Horário Nobre (18:00–23:00) · 19.500 MT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Duração da Exibição:</label>
                  <select
                    value={bookDuration}
                    onChange={(e) => setBookDuration(parseInt(e.target.value, 10))}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500"
                  >
                    <option value={1}>1 minuto (Spot Rápido)</option>
                    <option value={2}>2 minutos (Spot Padrão)</option>
                    <option value={5}>5 minutos (Videoclipe / Apresentação)</option>
                    <option value={15}>15 minutos (Bloco Especial / Curta)</option>
                    <option value={30}>30 minutos (Programa Completo)</option>
                    <option value={60}>60 minutos (Longa ou Evento)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Horário Sugerido (CAT):</label>
                  <input
                    type="time"
                    value={bookSlotTime}
                    onChange={(e) => setBookSlotTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="p-4 rounded-2xl bg-black/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">Forma de Pagamento Moçambique:</span>
                  <span className="text-sm font-black text-emerald-400">
                    Total: {calculateTotalCost().toLocaleString('pt-PT')} MT
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'mpesa', name: 'M-Pesa Vodacom', color: 'border-red-500 text-red-400' },
                    { id: 'emola', name: 'e-Mola Movitel', color: 'border-amber-500 text-amber-400' },
                    { id: 'card', name: 'Cartão / SIMO', color: 'border-blue-500 text-blue-400' },
                    { id: 'wallet', name: 'Saldo UBlue', color: 'border-cyan-500 text-cyan-400' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setBookPaymentMethod(m.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold ${
                        bookPaymentMethod === m.id
                          ? `bg-white/10 ${m.color} shadow-md`
                          : 'border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>

                {(bookPaymentMethod === 'mpesa' || bookPaymentMethod === 'emola') && (
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Número do Telemóvel para Débito:</label>
                    <input
                      type="tel"
                      value={bookPhone}
                      onChange={(e) => setBookPhone(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Legal Note */}
              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-[11px] text-slate-300 leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>
                  O conteúdo será submetido à revisão do departamento jurídico e editorial da UBlue TV para garantia de conformidade com as normas do INCM, GABINFO e direitos autorais vigentes.
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold uppercase tracking-wider shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  Confirmar Pagamento ({calculateTotalCost().toLocaleString('pt-PT')} MT)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
