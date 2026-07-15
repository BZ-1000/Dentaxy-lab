// Tonos sintetizados con Web Audio API para efectos sonoros de la IA
const playActivationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;

    // Filtro maestro pasabajos idéntico para calidez
    const masterFilter = audioCtx.createBiquadFilter();
    masterFilter.type = 'lowpass';
    masterFilter.frequency.setValueAtTime(500, now);

    // Ganancia master igualada al mismo nivel que desactivación (0.75)
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.75, now);

    masterFilter.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    // Procesador espacial (Delay) idéntico para fluidez estéreo y amplitud
    const delayNode = audioCtx.createDelay(0.1);
    const feedbackGain = audioCtx.createGain();
    delayNode.delayTime.setValueAtTime(0.022, now); // Retardo idéntico a desactivación
    feedbackGain.gain.setValueAtTime(0.4, now);     // Feedback idéntico (40%)
    delayNode.connect(feedbackGain);
    feedbackGain.connect(delayNode);
    delayNode.connect(masterFilter);

    // Osciladores de alta calidad (2 sine + 1 triangle)
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const oscTriangle = audioCtx.createOscillator();

    osc1.type = 'sine';
    osc2.type = 'sine';
    oscTriangle.type = 'triangle';

    // Pitch sweep ascendente exacto y fluido (de 45Hz a 160Hz) en 0.6s
    const startFreq = 45;
    const endFreq = 160;
    osc1.frequency.setValueAtTime(startFreq, now);
    osc1.frequency.exponentialRampToValueAtTime(endFreq, now + 0.6);

    osc2.frequency.setValueAtTime(startFreq, now);
    osc2.frequency.exponentialRampToValueAtTime(endFreq, now + 0.6);

    oscTriangle.frequency.setValueAtTime(startFreq, now);
    oscTriangle.frequency.exponentialRampToValueAtTime(endFreq, now + 0.6);

    // Desafinación idéntica
    osc1.detune.setValueAtTime(-20, now);
    osc2.detune.setValueAtTime(20, now);
    oscTriangle.detune.setValueAtTime(5, now);

    // Filtro local plano (Q=1.0) para evitar picos resonantes de distorsión
    const localFilter = audioCtx.createBiquadFilter();
    localFilter.type = 'lowpass';
    localFilter.Q.setValueAtTime(1.0, now);
    localFilter.frequency.setValueAtTime(120, now);
    localFilter.frequency.exponentialRampToValueAtTime(500, now + 0.6);

    // Ganancia de energía igualada a 0.24 (al nivel de desactivación)
    // Usamos un ataque exponencial suave de 0.001 a 0.24 para eliminar el "pop" o transitorio de inicio que satura
    const energyGain = audioCtx.createGain();
    energyGain.gain.setValueAtTime(0.001, now);
    energyGain.gain.exponentialRampToValueAtTime(0.24, now + 0.08); // Ataque exponencial suave de 80ms
    energyGain.gain.setTargetAtTime(0, now + 0.12, 0.18);           // Decaimiento asintótico idéntico

    osc1.connect(localFilter);
    osc2.connect(localFilter);
    oscTriangle.connect(localFilter);
    localFilter.connect(energyGain);

    energyGain.connect(masterFilter);
    energyGain.connect(delayNode);

    osc1.start(now);
    osc2.start(now);
    oscTriangle.start(now);

    osc1.stop(now + 1.1);
    osc2.stop(now + 1.1);
    oscTriangle.stop(now + 1.1);
  } catch (error) {
    console.error("Error playing activation sound:", error);
  }
};

const playDeactivationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;

    const masterFilter = audioCtx.createBiquadFilter();
    masterFilter.type = 'lowpass';
    masterFilter.frequency.setValueAtTime(500, now);

    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.75, now);

    masterFilter.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    // Procesador espacial para la salida (Delay)
    const delayNode = audioCtx.createDelay(0.1);
    const feedbackGain = audioCtx.createGain();
    delayNode.delayTime.setValueAtTime(0.022, now);
    feedbackGain.gain.setValueAtTime(0.4, now);
    delayNode.connect(feedbackGain);
    feedbackGain.connect(delayNode);
    delayNode.connect(masterFilter);

    // Descendente de energía sub-grave
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const oscTriangle = audioCtx.createOscillator();

    osc1.type = 'sine';
    osc2.type = 'sine';
    oscTriangle.type = 'triangle';

    // Pitch sweep descendente grave (170Hz a 45Hz)
    osc1.frequency.setValueAtTime(170, now);
    osc1.frequency.exponentialRampToValueAtTime(45, now + 0.6);

    osc2.frequency.setValueAtTime(170, now);
    osc2.frequency.exponentialRampToValueAtTime(45, now + 0.6);

    oscTriangle.frequency.setValueAtTime(170, now);
    oscTriangle.frequency.exponentialRampToValueAtTime(45, now + 0.6);

    osc1.detune.setValueAtTime(-20, now);
    osc2.detune.setValueAtTime(20, now);
    oscTriangle.detune.setValueAtTime(5, now);

    const localFilter = audioCtx.createBiquadFilter();
    localFilter.type = 'lowpass';
    localFilter.frequency.setValueAtTime(500, now);
    localFilter.frequency.exponentialRampToValueAtTime(70, now + 0.6);

    const energyGain = audioCtx.createGain();
    energyGain.gain.setValueAtTime(0.24, now);
    energyGain.gain.setTargetAtTime(0, now + 0.05, 0.18); // Decaimiento asintótico para suavidad

    osc1.connect(localFilter);
    osc2.connect(localFilter);
    oscTriangle.connect(localFilter);
    localFilter.connect(energyGain);

    energyGain.connect(masterFilter);
    energyGain.connect(delayNode);

    // Whoosh de despresurización
    const sampleRate = audioCtx.sampleRate;
    const noiseDuration = 0.65;
    const noiseBufferSize = sampleRate * noiseDuration;
    const noiseBuffer = audioCtx.createBuffer(1, noiseBufferSize, sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBufferSize; i++) {
      noiseData[i] = Math.random() * 2 - 1;
    }
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.Q.setValueAtTime(5.0, now);
    noiseFilter.frequency.setValueAtTime(450, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(80, now + 0.55);

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.08, now);
    noiseGain.gain.setTargetAtTime(0, now + 0.05, 0.15);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterFilter);
    noiseGain.connect(delayNode);

    osc1.start(now);
    osc2.start(now);
    oscTriangle.start(now);
    noiseSource.start(now);

    osc1.stop(now + 1.1);
    osc2.stop(now + 1.1);
    oscTriangle.stop(now + 1.1);
    noiseSource.stop(now + 0.7);
  } catch (error) {
    console.error("Error playing deactivation sound:", error);
  }
};
