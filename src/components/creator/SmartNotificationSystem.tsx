import React, { useState } from 'react';
import { 
  Bell, Smartphone, Globe, Mail, MessageCircle, Check, 
  Send, Sparkles, Volume2, ShieldCheck, Play, Clock, ArrowRight, Zap 
} from 'lucide-react';
import { DEFAULT_NOTIFICATION_CHANNELS, NotificationChannelConfig } from '../../data/enhancement-data';
import { soundEffects } from '../../services/sound-effects';

export const SmartNotificationSystem: React.FC = () => {
  const [channels, setChannels] = useState<NotificationChannelConfig[]>(DEFAULT_NOTIFICATION_CHANNELS);
  const [leadTimeMinutes, setLeadTimeMinutes] = useState<number>(10);
  const [customProgramTitle, setCustomProgramTitle] = useState("Histórias de Moçambique");
  const [selectedChannelForTest, setSelectedChannelForTest] = useState<'android' | 'iphone' | 'web' | 'whatsapp'>('android');
  const [lastNotificationReceived, setLastNotificationReceived] = useState<string | null>(null);

  const toggleChannel = (id: string) => {
    setChannels(channels.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
    soundEffects.play('notification');
  };

  const handleTriggerSimulatedNotification = () => {
    const message = `🎬 O documentário '${customProgramTitle}' começa em ${leadTimeMinutes} minutos na UBlue TV! Toque para assistir.`;
    setLastNotificationReceived(message);
    soundEffects.play('notification');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-cyan-400" />
                Sistema Inteligente de Avisos
              </span>
              <span className="text-xs text-slate-400">Multi-Channel Push & Webhooks</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Avisos Antecipados Pré-Transmissão
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Garante que nenhum espectador perca estreias, programas favoritos ou transmissões de criadores,
              com notificações personalizadas por Push (Android/iOS), Website, WhatsApp e Email.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTriggerSimulatedNotification}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Disparar Notificação Teste Agora</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Channels Config vs Live Device Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Channels Config */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-400" />
              Canais de Notificação Ativos
            </h3>
            <p className="text-xs text-slate-400">
              Configure onde o utilizador receberá os alertas de programas prestes a começar:
            </p>

            <div className="space-y-3">
              {channels.map((chan) => (
                <div
                  key={chan.id}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                    chan.enabled
                      ? 'bg-slate-800/80 border-slate-700'
                      : 'bg-slate-900/60 border-slate-800/80 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700">
                      {chan.id.includes('android') && <Smartphone className="w-5 h-5" />}
                      {chan.id.includes('ios') && <Smartphone className="w-5 h-5 text-slate-200" />}
                      {chan.id.includes('web') && <Globe className="w-5 h-5 text-blue-400" />}
                      {chan.id.includes('whatsapp') && <MessageCircle className="w-5 h-5 text-emerald-400" />}
                      {chan.id.includes('email') && <Mail className="w-5 h-5 text-amber-400" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{chan.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded">
                          {chan.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">{chan.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleChannel(chan.id)}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      chan.enabled ? 'bg-cyan-500' : 'bg-slate-700'
                    }`}
                  >
                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      chan.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Time Selection */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Tempo de Antecedência do Aviso
            </h4>
            <p className="text-xs text-slate-400">
              Quantos minutos antes do início do programa o alerta deve ser disparado:
            </p>

            <div className="grid grid-cols-4 gap-2 pt-2">
              {[5, 10, 15, 30].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    setLeadTimeMinutes(mins);
                    soundEffects.play('notification');
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    leadTimeMinutes === mins
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 border border-cyan-400/50'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {mins} Minutos Antes
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Device Simulator with Live Toast & Push */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                Simulador de Dispositivo Móvel
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <button
                  onClick={() => setSelectedChannelForTest('android')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${selectedChannelForTest === 'android' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Android
                </button>
                <button
                  onClick={() => setSelectedChannelForTest('iphone')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${selectedChannelForTest === 'iphone' ? 'bg-slate-200 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  iPhone
                </button>
                <button
                  onClick={() => setSelectedChannelForTest('whatsapp')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${selectedChannelForTest === 'whatsapp' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  WhatsApp
                </button>
              </div>
            </div>

            {/* Smartphone Mockup */}
            <div className="max-w-[280px] mx-auto bg-slate-950 border-4 border-slate-800 rounded-[36px] p-3 shadow-2xl relative overflow-hidden">
              {/* Dynamic Island / Speaker */}
              <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto mb-3" />

              {/* Lockscreen clock */}
              <div className="text-center py-4">
                <span className="text-xs text-slate-400">Sexta-feira, 25 de Setembro</span>
                <h2 className="text-4xl font-extrabold text-white font-mono mt-1">13:50</h2>
              </div>

              {/* Push Notification Card */}
              <div className="my-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-xl animate-fadeIn">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-cyan-500 flex items-center justify-center text-[9px] font-extrabold text-slate-950">
                      UB
                    </div>
                    <span className="text-[11px] font-bold text-white">UBlue TV</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono">Agora</span>
                </div>

                <p className="text-xs font-semibold text-white leading-tight">
                  🎬 O documentário '{customProgramTitle}' começa em {leadTimeMinutes} minutos!
                </p>
                <p className="text-[10px] text-slate-300 mt-1">
                  Transmissão ao vivo com áudio EBU R128 e LUT Documentary. Toque para sintonizar.
                </p>
              </div>

              {/* WhatsApp preview if selected */}
              {selectedChannelForTest === 'whatsapp' && (
                <div className="mt-2 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-200">
                  <div className="flex items-center gap-1 font-bold text-emerald-300 mb-0.5">
                    <MessageCircle className="w-3 h-3" /> UBlue TV Oficial (Verificado)
                  </div>
                  Olá! Seu programa agendado começa em breve na UBlue TV. Link: <span className="underline">live.ubluetv.com/historia</span>
                </div>
              )}

              {/* Bottom bar */}
              <div className="w-24 h-1 bg-slate-700 rounded-full mx-auto mt-16" />
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={handleTriggerSimulatedNotification}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline cursor-pointer"
              >
                Reproduzir Som de Notificação
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
