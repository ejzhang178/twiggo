let audioCtx = null;

function getContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function primeAudio() {
  getContext();
}

function beep(frequency, duration, type = 'sine') {
  const ctx = getContext();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);
}

export function playPop() {
  beep(440, 0.12, 'triangle');
}

export function playDing() {
  beep(880, 0.18, 'sine');
  setTimeout(() => beep(1320, 0.18, 'sine'), 100);
}

export function playOops() {
  beep(220, 0.25, 'sawtooth');
}
