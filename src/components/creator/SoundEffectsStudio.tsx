import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, VolumeX, Play, Music, Sparkles, CheckCircle2, 
  Radio, Bell, MessageSquare, DollarSign, Wand2, Shield, Info
} from 'lucide-react';
import { soundEffects, SOUND_EFFECTS_CATALOG, SoundEffectType } from '../../services/sound-effects';

export const SoundEffectsStudio: React.FC = () => {
  const [isMuted, setIsMuted] = useState(soundEffects.getMuted());
  const [volume, setVolume] = useState(soundEffects.getVolume() * 100);
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);

  // Canvas visualizer simulation
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let step = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#050814';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = activeSoundId ? '#00e5ff' : '#1e293b';
      ctx.beginPath();

      const sliceWidth = canvas.width / 60;
      let x = 0;

      for (let i = 0; i < 60; i++) {
        const amplitude = activeSoundId ? Math.sin((i + step) * 0.3) * 20 * (volume / 100) : Math.sin(i * 0.2) * 2;
        const y = canvas.height / 2 + amplitude;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.stroke();
      step += 1;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeSoundId, volume]);

  const handleToggleMute = () => {
    const newMute = !isMuted;
    setIsMuted(newMute);
    soundEffects.setMuted(newMute);
    if (!newMute) {
      soundEffects.play('notification');
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundEffects.setVolume(newVol / 100);
  };

  const handlePlaySound = (type: SoundEffectType) => {
    setActiveSoundId(type);
    soundEffects.play(type);
    setTimeout(() => {
      setActiveSoundId(null);
    }, 1000);
  };

  const getSoundIcon = (id: SoundEffectType) => {
    switch (id) {
      case 'notification':
        return <Bell className="w-5 h-5 text-cyan-400" />;
      case 'transmission_start':
        return <Radio className="w-5 h-5 text-rose-400" />;
      case 'transmission_end':
        return <Radio className="w-5 h-5 text-slate-400" />;
      case 'new_message':
        return <MessageSquare className="w-5 h-5 text-blue-400" />;
      case 'payment_success':
        return <DollarSign className="w-5 h-5 text-emerald-400" />;
      case 'content_ready':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-cyan-400" />
                Identidade Sonora UBlue TV
              </span>
              <span className="text-xs text-slate-400">Web Audio API Pure Synthesizer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Efeitos Sonoros da Plataforma
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Sons discretos, orgânicos e harmónicos que conferem sofisticação e clareza a cada ação na interface.
              Sintetizados em tempo real pelo navegador com zero latência.
            </p>
          </div>

          {/* Master Audio Controls */}
          <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl shadow-lg">
            <button
              onClick={handleToggleMute}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                isMuted
                  ? 'bg-rose-950/60 border border-rose-500/40 text-rose-400'
                  : 'bg-cyan-500 text-slate-950 shadow-md font-bold'
              }`}
              title={isMuted ? 'Desmutar Efeitos' : 'Mutar Efeitos'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Volume dos Sons:</span>
                <span className="font-mono text-cyan-400 font-bold">{isMuted ? 'Mudo' : `${Math.round(volume)}%`}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                disabled={isMuted}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-32 accent-cyan-400 cursor-pointer disabled:opacity-40"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Waveform Oscilloscope Display */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${activeSoundId ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`} />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Osciloscópio Espectral em Tempo Real
            </h4>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            {activeSoundId ? `Reproduzindo: ${activeSoundId}` : 'Aguardando Disparo de Áudio'}
          </span>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={80}
          className="w-full h-20 rounded-xl bg-[#050814] border border-slate-800 block"
        />
      </div>

      {/* Sound Catalog Grid (6 Sons) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SOUND_EFFECTS_CATALOG.map((item) => {
          const isPlaying = activeSoundId === item.id;
          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isPlaying
                  ? 'bg-blue-950/60 border-cyan-400 ring-2 ring-cyan-400/20 shadow-xl'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                    {getSoundIcon(item.id)}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white">{item.name}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">Duração: {item.durationSec}s</span>
                <button
                  onClick={() => handlePlaySound(item.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isPlaying
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isPlaying ? 'Reproduzindo...' : 'Testar Som'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
