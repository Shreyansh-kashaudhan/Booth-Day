export function playTone(frequency: number, durationMs: number, type: OscillatorType = "square") {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.value = 0.05;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
    osc.stop(ctx.currentTime + durationMs / 1000);
    osc.onended = () => ctx.close();
  } catch {
    // ponytail: browsers may block audio; UI stays usable
  }
}

export const sfx = {
  spin: () => playTone(180, 400, "sawtooth"),
  correct: () => playTone(660, 180),
  wrong: () => playTone(140, 220, "triangle"),
  countdown: () => playTone(440, 90),
  complete: () => {
    playTone(523, 120);
    setTimeout(() => playTone(659, 120), 110);
    setTimeout(() => playTone(784, 220), 220);
  },
};
