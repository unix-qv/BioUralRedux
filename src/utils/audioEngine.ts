// Web Audio API ambient lofi synthesizer for instant real playback
class AudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private gainNode: GainNode | null = null;
  private volume: number = 0.7;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play() {
    this.initContext();
    if (this.isPlaying || !this.ctx || !this.gainNode) return;
    this.isPlaying = true;

    // Play a gentle moody lofi / synth progression
    const chordNotes = [
      [220.0, 261.63, 329.63, 392.0], // Am7
      [196.0, 246.94, 293.66, 369.99], // Gmaj7
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [164.81, 207.65, 246.94, 329.63]  // E7
    ];

    let step = 0;
    const playChord = () => {
      if (!this.isPlaying || !this.ctx || !this.gainNode) return;
      const notes = chordNotes[step % chordNotes.length];
      step++;

      notes.forEach((freq) => {
        if (!this.ctx || !this.gainNode) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 1.2);
        filter.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + 3.8);

        const now = this.ctx.currentTime;
        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.08, now + 0.5);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.gainNode);

        osc.start(now);
        osc.stop(now + 4);
      });
    };

    playChord();
    this.timerId = window.setInterval(playChord, 3600);
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioEngine = new AudioEngine();
