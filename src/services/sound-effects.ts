/**
 * UBlue Sound Effects Engine
 * Sintetizador Web Audio API puro para efeitos sonoros discretos e profissionais da UBlue TV.
 * Não depende de arquivos externos (.mp3/.wav), garantindo 100% de disponibilidade sem erros 404.
 */

export type SoundEffectType =
  | 'notification'
  | 'transmission_start'
  | 'transmission_end'
  | 'new_message'
  | 'payment_success'
  | 'content_ready';

export interface SoundEffectMeta {
  id: SoundEffectType;
  name: string;
  description: string;
  category: string;
  durationSec: number;
}

export const SOUND_EFFECTS_CATALOG: SoundEffectMeta[] = [
  {
    id: 'notification',
    name: 'Nova Notificação',
    description: 'Chime cristalino de 2 tons para avisos de programação e alertas.',
    category: 'Sistema & Alertas',
    durationSec: 0.6
  },
  {
    id: 'transmission_start',
    name: 'Início de Transmissão',
    description: 'Acorde harmónico ascendente futurista característico da UBlue TV.',
    category: 'Broadcast & Playout',
    durationSec: 1.2
  },
  {
    id: 'transmission_end',
    name: 'Fim de Transmissão',
    description: 'Resolução harmónica suave e elegante ao encerrar programa ou live.',
    category: 'Broadcast & Playout',
    durationSec: 1.0
  },
  {
    id: 'new_message',
    name: 'Nova Mensagem',
    description: 'Pop sutil e discreto para chat de criadores e interações.',
    category: 'Comunidade & Chat',
    durationSec: 0.25
  },
  {
    id: 'payment_success',
    name: 'Confirmação de Pagamento',
    description: 'Chime duplo afirmativo ao concluir assinatura ou repasse M-Pesa / E-Mola.',
    category: 'Monetização & Carteira',
    durationSec: 0.8
  },
  {
    id: 'content_ready',
    name: 'Conteúdo Disponível',
    description: 'Whoosh e sino brilhante indicando que o vídeo/áudio foi processado.',
    category: 'Engine & Mídia',
    durationSec: 0.7
  }
];

class SoundEngine {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.5; // 0.0 to 1.0
  private activeMusicInterval: number | null = null;
  private activeMusicGain: GainNode | null = null;

  constructor() {
    // Load preferences from localStorage if in browser
    if (typeof window !== 'undefined') {
      try {
        const savedMute = localStorage.getItem('ublue_sound_muted');
        if (savedMute !== null) {
          this.isMuted = savedMute === 'true';
        }
        const savedVol = localStorage.getItem('ublue_sound_volume');
        if (savedVol !== null) {
          this.volume = parseFloat(savedVol);
        }
      } catch (e) {
        // ignore
      }
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ublue_sound_muted', String(muted));
      } catch (e) {}
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ublue_sound_volume', String(this.volume));
      } catch (e) {}
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Executa a síntese de um efeito sonoro
   */
  public play(type: SoundEffectType) {
    if (this.isMuted) return;

    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.4, now);
    masterGain.connect(ctx.destination);

    switch (type) {
      case 'notification': {
        // Chime duplo agradável E5 (659Hz) -> A5 (880Hz)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        const gain2 = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(659.25, now); // E5

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, now + 0.12); // A5

        gain1.gain.setValueAtTime(0.6, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        gain2.gain.setValueAtTime(0.8, now + 0.12);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc1.connect(gain1);
        gain1.connect(masterGain);

        osc2.connect(gain2);
        gain2.connect(masterGain);

        osc1.start(now);
        osc1.stop(now + 0.45);
        osc2.start(now + 0.12);
        osc2.stop(now + 0.65);
        break;
      }

      case 'transmission_start': {
        // Acorde harmónico futurista UBlue (C4, G4, C5, E5) com leve filtro low-pass
        const freqs = [261.63, 392.0, 523.25, 659.25, 1046.5];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const startTime = now + idx * 0.08;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.001, startTime);
          gain.gain.linearRampToValueAtTime(0.25 / (idx + 1), startTime + 0.06);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(startTime);
          osc.stop(now + 1.25);
        });
        break;
      }

      case 'transmission_end': {
        // Resolução harmónica suave descendente (G5 -> E5 -> C5)
        const freqs = [783.99, 659.25, 523.25];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const startTime = now + idx * 0.15;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.35, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(startTime);
          osc.stop(startTime + 0.65);
        });
        break;
      }

      case 'new_message': {
        // Pop suave discreto
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 0.22);
        break;
      }

      case 'payment_success': {
        // Som afirmativo de sucesso financeiro (C5 -> E5 -> G5 em staccato e chime final)
        const freqs = [523.25, 659.25, 783.99, 1046.5];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = now + idx * 0.09;

          osc.type = idx === 3 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.4, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + (idx === 3 ? 0.6 : 0.25));

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(t);
          osc.stop(t + (idx === 3 ? 0.65 : 0.3));
        });
        break;
      }

      case 'content_ready': {
        // Som ascendente suave que confirma processamento pronto
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(329.63, now); // E4
        osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.4); // B5

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.35, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 0.75);
        break;
      }
    }
  }

  /**
   * Reproduz jingle oficial de notícias broadcast da UBlue TV
   */
  public playNewsJingle() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.45, now);
    masterGain.connect(ctx.destination);

    // Fanfarra clássica de telejornal: D4, F#4, A4, D5 em ritmo staccato triunfante
    const notes = [293.66, 369.99, 440.0, 587.33];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + idx * 0.12;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);

      // Low pass filter para som aveludado de metais
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, t);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + (idx === 3 ? 0.6 : 0.2));

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(t);
      osc.stop(t + (idx === 3 ? 0.65 : 0.25));
    });
  }

  /**
   * Reproduz ritmo real de Marrabenta / Afro-beats em loop sintetizado
   */
  public startMusicStream(onStep?: (beat: number) => void) {
    if (this.isMuted) return;
    this.stopMusicStream();

    const ctx = this.getContext();
    if (!ctx) return;

    // Escala pentatónica maior inspirada em ritmos do Índico (A, B, C#, E, F#)
    const melodyFreqs = [440.0, 493.88, 554.37, 659.25, 739.99, 880.0];
    const bassNotes = [110.0, 110.0, 146.83, 164.81]; // A2, D3, E3
    let step = 0;

    const tick = () => {
      if (!ctx || ctx.state === 'closed') return;
      const t = ctx.currentTime;

      // 1. Kick/Tambor grave
      if (step % 2 === 0) {
        const kickOsc = ctx.createOscillator();
        const kickGain = ctx.createGain();
        kickOsc.frequency.setValueAtTime(120, t);
        kickOsc.frequency.exponentialRampToValueAtTime(45, t + 0.15);
        kickGain.gain.setValueAtTime(this.volume * 0.5, t);
        kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        kickOsc.connect(kickGain);
        kickGain.connect(ctx.destination);
        kickOsc.start(t);
        kickOsc.stop(t + 0.22);
      }

      // 2. Linha de Baixo / Marrabenta groove
      const bassFreq = bassNotes[Math.floor(step / 4) % bassNotes.length];
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(bassFreq, t);
      bassGain.gain.setValueAtTime(this.volume * 0.25, t);
      bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      bassOsc.connect(bassGain);
      bassGain.connect(ctx.destination);
      bassOsc.start(t);
      bassOsc.stop(t + 0.24);

      // 3. Melodia de guitarra / xilofone timbila
      const noteFreq = melodyFreqs[(step * 2 + (step % 3)) % melodyFreqs.length];
      const melOsc = ctx.createOscillator();
      const melGain = ctx.createGain();
      melOsc.type = 'sine';
      melOsc.frequency.setValueAtTime(noteFreq, t);
      melGain.gain.setValueAtTime(this.volume * 0.18, t);
      melGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      melOsc.connect(melGain);
      melGain.connect(ctx.destination);
      melOsc.start(t);
      melOsc.stop(t + 0.2);

      if (onStep) onStep(step);
      step = (step + 1) % 16;
    };

    // 120 BPM (~250ms por semínima)
    tick();
    this.activeMusicInterval = window.setInterval(tick, 250);
  }

  /**
   * Pára o streaming de áudio sintetizado
   */
  public stopMusicStream() {
    if (this.activeMusicInterval !== null) {
      clearInterval(this.activeMusicInterval);
      this.activeMusicInterval = null;
    }
  }

  /**
   * Efeito sonoro de apito inicial e comemoração desportiva
   */
  public playSportsWhistle() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Apito duplo do árbitro
    [0, 0.25].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + delay;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2600, t);
      osc.frequency.exponentialRampToValueAtTime(2400, t + 0.15);

      gain.gain.setValueAtTime(this.volume * 0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    });
  }
}

export const soundEffects = new SoundEngine();
