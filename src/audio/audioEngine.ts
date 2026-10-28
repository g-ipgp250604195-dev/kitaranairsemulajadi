// Procedural Web Audio Engine & Malay Speech Narration Synthesizer
// Complies with zero 404 / zero external file dependencies requirement.

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMuted: boolean = false;
  private musicMuted: boolean = false;
  private voiceMuted: boolean = false;
  private sfxMuted: boolean = false;
  private activeMusicNodes: { stop: () => void }[] = [];
  private rainNode: AudioNode | null = null;
  private streamNode: AudioNode | null = null;
  private isPlayingBgm: boolean = false;
  private currentMood: string = '';
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private malayVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      window.speechSynthesis.onvoiceschanged = () => this.initVoices();
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.45, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.65, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    // Prioritize Malay (ms-MY, ms) or Indonesian (id-ID) as standard Malay phonetics
    const found =
      voices.find(v => v.lang.toLowerCase().includes('ms-my') || v.lang.toLowerCase() === 'ms') ||
      voices.find(v => v.lang.toLowerCase().includes('id-id') || v.lang.toLowerCase() === 'id') ||
      voices.find(v => v.name.toLowerCase().includes('malay') || v.name.toLowerCase().includes('indonesian')) ||
      voices.find(v => v.lang.startsWith('en-') && (v.name.includes('Natural') || v.name.includes('Online')));
    if (found) {
      this.malayVoice = found;
    }
  }

  public setMasterVolume(val: number) {
    this.initContext();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.75, this.ctx.currentTime);
    }
    if (this.isMuted) {
      this.stopNarration();
    }
    return this.isMuted;
  }

  public toggleVoice(): boolean {
    this.voiceMuted = !this.voiceMuted;
    if (this.voiceMuted) {
      this.stopNarration();
    }
    return this.voiceMuted;
  }

  public toggleMusic(): boolean {
    this.musicMuted = !this.musicMuted;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(this.musicMuted ? 0 : 0.45, this.ctx.currentTime);
    }
    return this.musicMuted;
  }

  public toggleSfx(): boolean {
    this.sfxMuted = !this.sfxMuted;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.sfxMuted ? 0 : 0.65, this.ctx.currentTime);
    }
    return this.sfxMuted;
  }

  // --- Web Speech API Narration ---
  public speakNarration(text: string, rate: number = 0.92, onEnd?: () => void) {
    if (this.voiceMuted || this.isMuted) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (!this.malayVoice) {
      this.initVoices();
    }
    if (this.malayVoice) {
      utterance.voice = this.malayVoice;
    }
    // Natural pitch and friendly school pace
    utterance.lang = this.malayVoice?.lang || 'ms-MY';
    utterance.rate = rate;
    utterance.pitch = 1.08;

    utterance.onend = () => {
      if (onEnd) onEnd();
      this.currentUtterance = null;
    };

    utterance.onerror = () => {
      this.currentUtterance = null;
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public stopNarration() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  // --- Procedural Sound Effects ---
  public playWaterDrip() {
    if (this.sfxMuted || this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(2400, now + 0.08);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  public playChime() {
    if (this.sfxMuted || this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime + idx * 0.09;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.7);
    });
  }

  public playCelebrationFanfare() {
    if (this.sfxMuted || this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const chords = [
      [523.25, 659.25, 783.99],       // C
      [587.33, 739.99, 880.00],       // D
      [659.25, 830.61, 987.77],       // E
      [1046.5, 1318.5, 1567.98]       // C High
    ];

    chords.forEach((chord, step) => {
      const now = (this.ctx?.currentTime || 0) + step * 0.22;
      chord.forEach(freq => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (step === 3 ? 1.4 : 0.4));

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + (step === 3 ? 1.5 : 0.45));
      });
    });
  }

  public playThunder() {
    if (this.sfxMuted || this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const bufferSize = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 1.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start();
    noise.stop(this.ctx.currentTime + 1.5);
  }

  // --- Ambient Loops & Dynamic Background Music ---
  public updateSceneAudio(mood: string, ambient: string) {
    this.initContext();
    if (!this.ctx) return;

    if (this.currentMood === mood) return;
    this.currentMood = mood;

    // Stop previous music loops
    this.stopBGM();

    // Spawn new ambient music according to mood
    switch (mood) {
      case 'peaceful':
      case 'celebratory':
        this.playMelodicChords([261.63, 329.63, 392.00, 523.25], 1.2, true);
        this.playGentleStream();
        break;
      case 'dry_heat':
        this.playDryHeatDrone();
        break;
      case 'rain_storm':
        this.playRainStormAmbience();
        break;
      case 'sombre':
      case 'wilting':
        this.playMelodicChords([220.00, 261.63, 329.63, 392.00], 2.2, false);
        break;
      case 'fragile':
        this.playMelodicChords([246.94, 293.66, 369.99, 440.00], 1.8, false);
        break;
      case 'curious':
        this.playMelodicChords([261.63, 311.13, 392.00, 466.16], 1.4, true);
        break;
    }
  }

  private playGentleStream() {
    if (!this.ctx || !this.musicGain) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02; // pinkish gentle stream
        lastOut = data[i];
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 850;
      filter.Q.value = 1.2;

      const gain = this.ctx.createGain();
      gain.gain.value = 0.08;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      noise.start();
      this.activeMusicNodes.push({
        stop: () => {
          try {
            noise.stop();
            noise.disconnect();
          } catch {}
        }
      });
    } catch {}
  }

  private playRainStormAmbience() {
    if (!this.ctx || !this.musicGain) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 600;

      const gain = this.ctx.createGain();
      gain.gain.value = 0.16;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      noise.start();
      this.activeMusicNodes.push({
        stop: () => {
          try {
            noise.stop();
            noise.disconnect();
          } catch {}
        }
      });
    } catch {}
  }

  private playDryHeatDrone() {
    if (!this.ctx || !this.musicGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.value = 65.4; // C2 drone
      osc2.type = 'sine';
      osc2.frequency.value = 130.8;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 220;

      gain.gain.value = 0.09;

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start();
      osc2.start();

      this.activeMusicNodes.push({
        stop: () => {
          try {
            osc.stop();
            osc2.stop();
            osc.disconnect();
            osc2.disconnect();
          } catch {}
        }
      });
    } catch {}
  }

  private playMelodicChords(frequencies: number[], intervalSec: number, major: boolean) {
    if (!this.ctx || !this.musicGain) return;

    let step = 0;
    const timer = setInterval(() => {
      if (!this.ctx || !this.musicGain || this.musicMuted || this.isMuted) return;
      const freq = frequencies[step % frequencies.length];
      step++;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = major ? 'sine' : 'triangle';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + intervalSec * 1.5);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + intervalSec * 1.6);
    }, intervalSec * 1000);

    this.activeMusicNodes.push({
      stop: () => {
        clearInterval(timer);
      }
    });
  }

  public stopBGM() {
    this.activeMusicNodes.forEach(node => {
      try {
        node.stop();
      } catch {}
    });
    this.activeMusicNodes = [];
  }

  public pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  public resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getStates() {
    return {
      isMuted: this.isMuted,
      musicMuted: this.musicMuted,
      voiceMuted: this.voiceMuted,
      sfxMuted: this.sfxMuted,
    };
  }
}

export const audioEngine = new AudioEngine();
