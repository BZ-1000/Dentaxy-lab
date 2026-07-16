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
      utterance.onend = onEnded;
      utterance.onerror = onEnded;
      window.speechSynthesis.speak(utterance);
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

  return {
    dexVoice: savedVoice,

    setDexVoice: (voice) => {
      localStorage.setItem('dentaxy_dex_voice', voice);
      set({ dexVoice: voice });
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
      const state = get();
      state.stopSpeaking();
      set({ isSpeaking: true });

      const activeVoice: DexVoiceId = voiceOverride ?? state.dexVoice;

      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, voice: activeVoice }),
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

        audio.onended = () => {
          URL.revokeObjectURL(url);
          set({ isSpeaking: false, currentAudio: null });
        };
        audio.onerror = () => {
          URL.revokeObjectURL(url);
          set({ isSpeaking: false, currentAudio: null });
          speakWithNativeFallback(text, activeVoice, () => set({ isSpeaking: false }));
        };

        await audio.play();
      } catch (err) {
        console.warn('Edge TTS proxy falló, usando fallback nativo:', err);
        speakWithNativeFallback(text, activeVoice, () => set({ isSpeaking: false }));
      }
    },
  };
});
