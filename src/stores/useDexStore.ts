import { create } from 'zustand';

// ─────────────────────────────────────────────────────────────────────────────
// Tipos — solo voces VERIFICADAS que existen en la API de Microsoft
// ─────────────────────────────────────────────────────────────────────────────
export type DexVoiceId =
  | 'es-MX-JorgeNeural'
  | 'es-MX-DaliaNeural'
  | 'es-AR-ElenaNeural'
  | 'es-ES-ElviraNeural'
  | 'es-CO-SalomeNeural'
  | 'es-US-PalomaNeural'
  | 'es-CL-CatalinaNeural'
  | 'es-VE-PaolaNeural'
  | 'es-PE-CamilaNeural'
  | 'es-DO-RamonaNeural';

interface DexState {
  dexVoice: DexVoiceId;
  setDexVoice: (voice: DexVoiceId) => void;
  gender: 'male' | 'female';
  setGender: (g: 'male' | 'female') => void;
  isListening: boolean;
  setIsListening: (val: boolean) => void;
  isSpeaking: boolean;
  setIsSpeaking: (val: boolean) => void;
  speakText: (text: string, voiceOverride?: DexVoiceId) => Promise<void>;
  stopSpeaking: () => void;
  currentAudio: HTMLAudioElement | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Fallback: Web Speech API nativa
// Solo se usa si Edge TTS falla
// ─────────────────────────────────────────────────────────────────────────────
function speakWithNativeFallback(
  text: string,
  voiceId: DexVoiceId,
  onEnded: () => void
) {
  try {
    window.speechSynthesis.cancel();
    const isFemale = voiceId !== 'es-MX-JorgeNeural';

    const doSpeak = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-MX';
      const voices = window.speechSynthesis.getVoices();
      const esVoices = voices.filter(v => v.lang.startsWith('es'));
      if (esVoices.length > 0) {
        const femaleKw = ['dalia', 'elena', 'elvira', 'paloma', 'camila', 'salome', 'catalina', 'sabina', 'monica', 'laura', 'sofia', 'zira', 'female'];
        const maleKw = ['jorge', 'alvaro', 'diego', 'juan', 'male'];
        const kw = isFemale ? femaleKw : maleKw;
        const found = esVoices.find(v => kw.some(k => v.name.toLowerCase().includes(k)));
        utterance.voice = found ?? esVoices[0];
        if (isFemale && !found) utterance.pitch = 1.8;
      }
      
      let finished = false;
      const safeEnd = () => {
        if (finished) return;
        finished = true;
        clearTimeout(safety);
        onEnded();
      };
      
      utterance.onend = safeEnd;
      utterance.onerror = safeEnd;
      window.speechSynthesis.speak(utterance);
      
      // Fallback estricto por si el navegador jamás dispara onend
      const safety = setTimeout(safeEnd, Math.max(8000, text.length * 150));
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      const handler = () => {
        window.speechSynthesis.onvoiceschanged = null;
        doSpeak();
      };
      window.speechSynthesis.onvoiceschanged = handler;
      setTimeout(() => {
        if (window.speechSynthesis.onvoiceschanged === handler) {
          window.speechSynthesis.onvoiceschanged = null;
          doSpeak();
        }
      }, 300);
    } else {
      doSpeak();
    }
  } catch (_) {
    onEnded();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Motor: Llamada al Proxy de TTS local / backend
// ─────────────────────────────────────────────────────────────────────────────

const VALID_VOICES: DexVoiceId[] = [
  'es-MX-JorgeNeural',
  'es-MX-DaliaNeural',
  'es-AR-ElenaNeural',
  'es-ES-ElviraNeural',
  'es-CO-SalomeNeural',
  'es-US-PalomaNeural',
  'es-CL-CatalinaNeural',
  'es-VE-PaolaNeural',
  'es-PE-CamilaNeural',
  'es-DO-RamonaNeural',
];

export const useDexStore = create<DexState>((set, get) => {
  const raw = localStorage.getItem('dentaxy_dex_voice');
  let savedVoice: DexVoiceId = 'es-MX-JorgeNeural';
  if (raw && VALID_VOICES.includes(raw as DexVoiceId)) {
    savedVoice = raw as DexVoiceId;
  } else if (raw === 'female') {
    savedVoice = 'es-MX-DaliaNeural';
  }
  localStorage.setItem('dentaxy_dex_voice', savedVoice);

  // Leer género guardado (sincronizado con la voz)
  const savedGender: 'male' | 'female' =
    (localStorage.getItem('dex_gender') as 'male' | 'female') || 'male';

  return {
    dexVoice: savedVoice,

    setDexVoice: (voice) => {
      localStorage.setItem('dentaxy_dex_voice', voice);
      set({ dexVoice: voice });
    },

    gender: savedGender,
    setGender: (g) => {
      localStorage.setItem('dex_gender', g);
      set({ gender: g });
    },

    isListening: false,
    setIsListening: (val) => set({ isListening: val }),
    isSpeaking: false,
    setIsSpeaking: (val) => set({ isSpeaking: val }),
    currentAudio: null,

    stopSpeaking: () => {
      const { currentAudio } = get();
      if (currentAudio) {
        currentAudio.pause();
        set({ currentAudio: null });
      }
      window.speechSynthesis.cancel();
      set({ isSpeaking: false });
    },

    speakText: async (text, voiceOverride) => {
      // Sanitizar texto para mejorar la fluidez de voz (quitar comas, puntos no numéricos y palabras de sumisión)
      const cleanText = text
        .replace(/,/g, '')
        .replace(/[:;]/g, '')
        .replace(/(?<!\d)\.|\.(?!\d)/g, '')
        .replace(/\b(como ordene|a sus órdenes|a la orden|señor)\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanText) return;

      const state = get();
      state.stopSpeaking();
      set({ isSpeaking: true });

      const activeVoice: DexVoiceId = voiceOverride ?? state.dexVoice;

      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: cleanText, voice: activeVoice }),
        });
        
        if (!response.ok) {
          throw new Error('Edge TTS API falló');
        }

        const blob = await response.blob();
        if (blob.size === 0) {
          throw new Error('Edge TTS: audio vacío');
        }

        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        set({ currentAudio: audio });

        let finished = false;
        const safeEnd = () => {
          if (finished) return;
          finished = true;
          clearTimeout(safety);
          URL.revokeObjectURL(url);
          set({ isSpeaking: false, currentAudio: null });
        };
        const safety = setTimeout(safeEnd, Math.max(10000, cleanText.length * 200));

        audio.onended = safeEnd;
        audio.onerror = () => {
          safeEnd();
          speakWithNativeFallback(cleanText, activeVoice, () => set({ isSpeaking: false }));
        };

        await audio.play();
      } catch (err) {
        console.warn('Edge TTS proxy falló, usando fallback nativo:', err);
        speakWithNativeFallback(text, activeVoice, () => set({ isSpeaking: false }));
      }
    },
  };
});
