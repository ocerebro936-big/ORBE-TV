import React, { useState } from 'react';
import { 
  Video, Mic, Tv, PlusCircle, TrendingUp, DollarSign, Users, Eye, 
  Sparkles, CheckCircle2, Shield, BarChart3, Filter, Clock, ArrowUpRight,
  Globe, Sliders, Volume2, Calendar, Bell, Music, ScrollText, Wand2, ShieldCheck
} from 'lucide-react';
import { CreatorCategory, CreatorContentItem, CreatorChannel } from '../../types/ecosystem';
import { ublueAI } from '../../services/ai-engine';
import { soundEffects } from '../../services/sound-effects';
import { MediaEnhancementStudio } from './MediaEnhancementStudio';
import { OpenBroadcastNetwork } from './OpenBroadcastNetwork';
import { OrbeScheduler } from './OrbeScheduler';
import { SmartNotificationSystem } from './SmartNotificationSystem';
import { SoundEffectsStudio } from './SoundEffectsStudio';
import { ManifestoSection } from './ManifestoSection';
import { RealBroadcastPlayer } from '../broadcast/RealBroadcastPlayer';
import { BroadcastMarketplace } from '../broadcast/BroadcastMarketplace';
import { BroadcastRightsClearance } from '../broadcast/BroadcastRightsClearance';

export type CreatorHubTab = 
  | 'content' 
  | 'real-broadcast'
  | 'marketplace'
  | 'clearance'
  | 'open-broadcast'
  | 'media-enhancement'
  | 'scheduler'
  | 'notifications'
  | 'sounds'
  | 'manifesto'
  | 'monetization' 
  | 'analytics';

interface CreatorHubProps {
  onOpenWallet: () => void;
  onOpenAIEngine: () => void;
  initialTab?: CreatorHubTab;
}

export const CreatorHub: React.FC<CreatorHubProps> = ({
  onOpenWallet,
  onOpenAIEngine,
  initialTab = 'content',
}) => {
  const [activeTab, setActiveTab] = useState<CreatorHubTab>(initialTab);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isNewChannelModalOpen, setIsNewChannelModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');


  // Creator state
  const [channel, setChannel] = useState<CreatorChannel>({
    id: 'ch-matola-prod',
    name: 'Matola Media & Beats',
    handle: '@matolamedia',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
    subscribers: 24850,
    totalViews: 382400,
    totalEarningsMT: 42680,
    category: 'Música',
    verified: true,
  });

  const [contents, setContents] = useState<CreatorContentItem[]>([
    {
      id: 'c-101',
      title: 'A Nova Era da Marrabenta: Instrumentos e Ritmos',
      type: 'video',
      category: 'Música',
      thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      duration: '18:42',
      publishedAt: 'Ontem às 18:30',
      views: 14200,
      earningsMT: 1840,
      status: 'published',
      monetization: { viewsCpm: true, subscriptions: true, ads: true }
    },
    {
      id: 'c-102',
      title: 'Podcast Voz Urbana #12: Empreender na Cultura com Be Universe',
      type: 'podcast',
      category: 'Negócios',
      thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80',
      duration: '45:10',
      publishedAt: 'Há 3 dias',
      views: 28900,
      earningsMT: 3950,
      status: 'published',
      monetization: { viewsCpm: true, subscriptions: true, ads: true }
    },
    {
      id: 'c-103',
      title: 'Programa Especial: Noite de Talentos da Cidade',
      type: 'tv-show',
      category: 'Humor',
      thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
      duration: '52:15',
      publishedAt: 'Há 1 semana',
      views: 64100,
      earningsMT: 8200,
      status: 'published',
      monetization: { viewsCpm: true, subscriptions: true, ads: true }
    }
  ]);

  // Upload Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'video' | 'podcast' | 'tv-show'>('video');
  const [newCategory, setNewCategory] = useState<CreatorCategory>('Música');
  const [newDesc, setNewDesc] = useState('');
  const [cpmMonetized, setCpmMonetized] = useState(true);
  const [subMonetized, setSubMonetized] = useState(true);
  const [adMonetized, setAdMonetized] = useState(true);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiGeneratedSummary, setAiGeneratedSummary] = useState('');

  const categoriesList: CreatorCategory[] = [
    'Música',
    'Notícias',
    'Educação',
    'Humor',
    'Religião',
    'Negócios',
    'Tecnologia',
    'Desporto',
    'Infantil'
  ];

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newItem: CreatorContentItem = {
      id: `c-${Date.now()}`,
      title: newTitle,
      type: newType,
      category: newCategory,
      thumbnail: newType === 'video'
        ? 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80'
        : newType === 'podcast'
        ? 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&auto=format&fit=crop&q=80',
      duration: '22:00',
      publishedAt: 'Agora mesmo',
      views: 0,
      earningsMT: 0,
      status: 'published',
      monetization: {
        viewsCpm: cpmMonetized,
        subscriptions: subMonetized,
        ads: adMonetized
      },
      aiMetadata: {
        summary: aiGeneratedSummary || 'Processado com sucesso pelo UBlue AI Engine'
      }
    };

    setContents([newItem, ...contents]);
    setNewTitle('');
    setNewDesc('');
    setAiGeneratedSummary('');
    setIsUploadModalOpen(false);
  };

  const handleRunAISummarizer = async () => {
    if (!newTitle) {
      alert('Digite o título primeiro!');
      return;
    }
    setIsGeneratingAI(true);
    const res = await ublueAI.generateSummary(newTitle, newDesc || 'Programa cultural moçambicano');
    setAiGeneratedSummary(res.summary);
    setIsGeneratingAI(false);
  };

  const filteredContents = selectedCategory === 'Todas'
    ? contents
    : contents.filter(c => c.category === selectedCategory);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left space-y-8 animate-fade-in">
      
      {/* Top Banner Channel Profile */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="h-36 sm:h-48 w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${channel.banner})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        <div className="p-6 sm:p-8 relative -mt-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex items-end gap-5">
            <img
              src={channel.avatar}
              alt={channel.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-slate-900 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{channel.name}</h1>
                {channel.verified && (
                  <span className="text-blue-400" title="Canal Oficial Verificado">
                    <CheckCircle2 className="w-5 h-5 fill-blue-500/20" />
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-mono">
                {channel.handle} · Categoria: <span className="text-blue-400 font-bold">{channel.category}</span>
              </p>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-300 mt-2">
                <span>{channel.subscribers.toLocaleString('pt-PT')} subscritores</span>
                <span>·</span>
                <span>{channel.totalViews.toLocaleString('pt-PT')} visualizações</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publicar Conteúdo</span>
            </button>

            <button
              onClick={onOpenWallet}
              className="px-4 py-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 font-bold text-xs flex items-center gap-2 cursor-pointer"
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>{channel.totalEarningsMT.toLocaleString('pt-PT')} MT Saldo</span>
            </button>

            <button
              onClick={() => setIsNewChannelModalOpen(true)}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              + Criar Outro Canal
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
            <span>Rendimentos Totais</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {channel.totalEarningsMT.toLocaleString('pt-PT')} <span className="text-sm font-bold text-emerald-400">MT</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" />
            +18.4% este mês (M-Pesa pronto para levantamento)
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
            <span>Visualizações Mensais</span>
            <Eye className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            184.200
          </div>
          <div className="text-[11px] text-blue-400 mt-2 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" />
            +24.1% de alcance orgânico
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
            <span>CPM Médio Estimado</span>
            <BarChart3 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            130 <span className="text-sm font-bold text-purple-400">MT / 1k views</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 font-medium">
            Vídeos com monetização ativa
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
            <span>Assistente IA Integrado</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-sm font-bold text-white mb-1">
            UBlue AI Engine
          </div>
          <p className="text-[11px] text-slate-400 leading-tight mb-2">
            Legendas em Changana, resumos e sugestão de horários.
          </p>
          <button
            onClick={onOpenAIEngine}
            className="text-[11px] font-bold text-cyan-400 hover:underline flex items-center gap-1"
          >
            Abrir AI Studio →
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => {
            setActiveTab('content');
            soundEffects.play('new_message');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'content' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Meus Conteúdos ({contents.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('real-broadcast');
            soundEffects.play('transmission_start');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'real-broadcast' ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400/40' : 'text-red-400 hover:text-white'
          }`}
        >
          <Tv className="w-3.5 h-3.5 animate-pulse" />
          <span>Real Broadcast (CAT UTC+2)</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('marketplace');
            soundEffects.play('notification');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'marketplace' ? 'bg-blue-600 text-white shadow-md' : 'text-cyan-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Broadcast Marketplace</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('clearance');
            soundEffects.play('notification');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'clearance' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Direitos & Licenças</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('open-broadcast');
            soundEffects.play('notification');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'open-broadcast' ? 'bg-cyan-600 text-white shadow-md' : 'text-cyan-400 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Open Broadcast Network</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('media-enhancement');
            soundEffects.play('notification');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'media-enhancement' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Media Enhancement Engine</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('scheduler');
            soundEffects.play('notification');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'scheduler' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>UBlue Scheduler (Grelha 24/7)</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('notifications');
            soundEffects.play('notification');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'notifications' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-3.5 h-3.5 text-cyan-400" />
          <span>Sistema de Avisos</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('sounds');
            soundEffects.play('notification');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'sounds' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Music className="w-3.5 h-3.5 text-emerald-400" />
          <span>Efeitos Sonoros</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('manifesto');
            soundEffects.play('notification');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'manifesto' ? 'bg-purple-600 text-white shadow-md' : 'text-purple-400 hover:text-white'
          }`}
        >
          <ScrollText className="w-3.5 h-3.5" />
          <span>Manifesto UBlue</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('monetization');
            soundEffects.play('new_message');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'monetization' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Monetização</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('analytics');
            soundEffects.play('new_message');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'analytics' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Estatísticas</span>
        </button>
      </div>

      {/* Tab 1: Content Table */}
      {activeTab === 'content' && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Categorias:
            </span>
            <button
              onClick={() => setSelectedCategory('Todas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                selectedCategory === 'Todas' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Todas
            </button>
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* List of items */}
          <div className="space-y-3">
            {filteredContents.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-black shrink-0">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[9px] text-white">
                      {item.duration}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-500/20">
                        {item.type === 'video' ? 'VÍDEO' : item.type === 'podcast' ? 'PODCAST' : 'PROGRAMA TV'}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{item.category}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-400">{item.publishedAt}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{item.title}</h3>
                    {item.aiMetadata?.summary && (
                      <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                        IA: {item.aiMetadata.summary}
                      </p>
                    )}
                  </div>
                </div>

                {/* Metrics & Monetization badges */}
                <div className="flex items-center gap-5 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-800 text-xs">
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase">Visualizações</div>
                    <div className="font-extrabold text-white text-sm">
                      {item.views.toLocaleString('pt-PT')}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-400 text-[10px] uppercase">Ganhos</div>
                    <div className="font-extrabold text-emerald-400 text-sm">
                      {item.earningsMT.toLocaleString('pt-PT')} MT
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span
                      className={`px-2 py-1 rounded font-bold ${
                        item.monetization.viewsCpm
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                      title="Monetização por CPM de visualizações"
                    >
                      CPM
                    </span>
                    <span
                      className={`px-2 py-1 rounded font-bold ${
                        item.monetization.subscriptions
                          ? 'bg-blue-950/60 text-blue-400 border border-blue-500/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                      title="Monetização por receita de assinaturas UBlue"
                    >
                      Assinaturas
                    </span>
                    <span
                      className={`px-2 py-1 rounded font-bold ${
                        item.monetization.ads
                          ? 'bg-purple-950/60 text-purple-400 border border-purple-500/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                      title="Monetização por anúncios e publicidade"
                    >
                      Ads
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Monetization Info */}
      {activeTab === 'monetization' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">1. Monetização por Visualizações (CPM)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Você recebe de <strong>80 MT a 250 MT</strong> a cada 1.000 visualizações válidas no Universo Blue, com pagamentos depositados diretamente na sua carteira toda segunda-feira.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">2. Repasse de Assinaturas (Rev-Share)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Os criadores recebem uma fatia percentual dos pacotes de <strong>25 MT, 100 MT, 250 MT e 500 MT</strong> proporcionalmente aos minutos de retenção que seus conteúdos geram.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">3. Publicidade & Patrocínios de Marcas</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Conexão direta com anunciantes do <strong>UBlue Business Center</strong> para inserção de reclames em vídeo, menções no podcast e banners dentro do seu canal oficial.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Analytics */}
      {activeTab === 'analytics' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Retenção de Audiência & Demografia Moçambicana</h3>
            <span className="text-xs text-emerald-400 font-mono">Taxa Média de Retenção: 78.4%</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="font-bold text-white">Principais Províncias e Cidades:</div>
              <div className="flex justify-between"><span>Maputo Cidade:</span><span className="font-bold text-cyan-400">46%</span></div>
              <div className="flex justify-between"><span>Província de Maputo (Matola):</span><span className="font-bold text-cyan-400">22%</span></div>
              <div className="flex justify-between"><span>Sofala (Beira):</span><span className="font-bold text-cyan-400">14%</span></div>
              <div className="flex justify-between"><span>Nampula:</span><span className="font-bold text-cyan-400">11%</span></div>
              <div className="flex justify-between"><span>Diáspora Lusófona:</span><span className="font-bold text-cyan-400">7%</span></div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="font-bold text-white">Dispositivos & Conexão:</div>
              <div className="flex justify-between"><span>Telemóveis Android (Vodacom / Movitel / Tmcel):</span><span className="font-bold text-emerald-400">84%</span></div>
              <div className="flex justify-between"><span>Smart TVs & Computadores:</span><span className="font-bold text-emerald-400">16%</span></div>
              <div className="flex justify-between"><span>Qualidade Média Assistida:</span><span className="font-bold text-white">720p / 480p Otimizado</span></div>
              <div className="flex justify-between"><span>Economia de Dados Ativa:</span><span className="font-bold text-blue-400">Sim (AV1/H.265)</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Real Broadcast Network */}
      {activeTab === 'real-broadcast' && (
        <RealBroadcastPlayer
          onOpenMarketplace={() => setActiveTab('marketplace')}
          onOpenClearance={() => setActiveTab('clearance')}
        />
      )}

      {/* Tab: Broadcast Marketplace */}
      {activeTab === 'marketplace' && (
        <BroadcastMarketplace
          onOpenClearanceTab={() => setActiveTab('clearance')}
          onOpenWalletModal={onOpenWallet}
        />
      )}

      {/* Tab: Broadcast Rights & Clearance */}
      {activeTab === 'clearance' && (
        <BroadcastRightsClearance />
      )}

      {/* Tab: Open Broadcast Network */}
      {activeTab === 'open-broadcast' && (
        <OpenBroadcastNetwork />
      )}

      {/* Tab: Media Enhancement Engine */}
      {activeTab === 'media-enhancement' && (
        <MediaEnhancementStudio />
      )}

      {/* Tab: UBlue Scheduler */}
      {activeTab === 'scheduler' && (
        <OrbeScheduler />
      )}

      {/* Tab: Smart Notification System */}
      {activeTab === 'notifications' && (
        <SmartNotificationSystem />
      )}

      {/* Tab: Sound Effects Studio */}
      {activeTab === 'sounds' && (
        <SoundEffectsStudio />
      )}

      {/* Tab: Manifesto UBlue TV */}
      {activeTab === 'manifesto' && (
        <ManifestoSection />
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-left">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#090d20] border border-blue-500/30 p-6 sm:p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-1">Publicar Novo Conteúdo na ORBE</h3>
            <p className="text-xs text-slate-400 mb-6">Seu conteúdo será distribuído em todo o país e monetizado automaticamente.</p>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              {/* Type Switcher */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">Tipo de Conteúdo:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewType('video')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-bold cursor-pointer ${
                      newType === 'video' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Vídeo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('podcast')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-bold cursor-pointer ${
                      newType === 'podcast' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Podcast</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('tv-show')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-bold cursor-pointer ${
                      newType === 'tv-show' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>Programa TV</span>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Título:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Entrevista Exclusiva com Cantor da Marrabenta"
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 text-xs"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Categoria:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as CreatorCategory)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Description & AI Summarizer button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold">Descrição / Roteiro:</label>
                  <button
                    type="button"
                    onClick={handleRunAISummarizer}
                    disabled={isGeneratingAI}
                    className="text-[11px] text-cyan-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isGeneratingAI ? 'Gerando com IA...' : 'Gerar Resumo com UBlue AI'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Conte sobre o programa para os espectadores..."
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2.5 text-white text-xs focus:outline-none focus:border-blue-500"
                />
                {aiGeneratedSummary && (
                  <div className="mt-1.5 p-2 rounded-lg bg-blue-950/60 border border-blue-500/30 text-[11px] text-cyan-300">
                    <strong>Resumo IA:</strong> {aiGeneratedSummary}
                  </div>
                )}
              </div>

              {/* Monetization check */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="font-bold text-white block">Opções de Monetização:</span>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={cpmMonetized} onChange={(e) => setCpmMonetized(e.target.checked)} className="rounded" />
                  <span>Monetizar por CPM de visualizações (M-Pesa)</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={subMonetized} onChange={(e) => setSubMonetized(e.target.checked)} className="rounded" />
                  <span>Incluir no repasse de assinaturas UBlue</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={adMonetized} onChange={(e) => setAdMonetized(e.target.checked)} className="rounded" />
                  <span>Habilitar anúncios patrocinados do Business Center</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Concluir Publicação
                </button>
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Channel Modal */}
      {isNewChannelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-left">
          <div className="relative w-full max-w-md rounded-3xl bg-[#090d20] border border-blue-500/30 p-6 sm:p-7 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-1">Criar Novo Canal Próprio</h3>
            <p className="text-xs text-slate-400 mb-5">Tenha seu canal de TV digital transmitindo para todo Moçambique.</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Canal submetido com sucesso! Nossa equipe ativará a transmissão em até 2 horas.');
                setIsNewChannelModalOpen(false);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Nome do Canal:</label>
                <input type="text" placeholder="Ex: Rádio & TV Zambézia Live" className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2.5 text-white" required />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Identificador (@handle):</label>
                <input type="text" placeholder="@zambezialive" className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2.5 text-white font-mono" required />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Categoria Principal:</label>
                <select className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2 text-white">
                  {categoriesList.map(cat => <option key={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Número M-Pesa para Recebimentos:</label>
                <input type="text" placeholder="84 / 85 000 0000" className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2.5 text-white font-mono" required />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button type="submit" className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase cursor-pointer">
                  Registrar Canal
                </button>
                <button type="button" onClick={() => setIsNewChannelModalOpen(false)} className="py-3 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs cursor-pointer">
                  Fechar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
