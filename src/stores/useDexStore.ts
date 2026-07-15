import { create } from 'zustand';

interface DexState {
  dexVoice: 'es-MX-JorgeNeural' | 'es-MX-DaliaNeural';
  setDexVoice: (voice: 'es-MX-JorgeNeural' | 'es-MX-DaliaNeural') => void;
  isListening: boolean;
  setIsListening: (val: boolean) => void;
  isSpeaking: boolean;
  setIsSpeaking: (val: boolean) => void;
  speakText: (text: string) => Promise<void>;
  stopSpeaking: () => void;
  currentAudio: HTMLAudioElement | null;
}

// Cliente Edge TTS a través de WebSocket en el Navegador
class EdgeTTSBrowser {
  private static wsUrl = "wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EAFF4E9787E79D5D8A6388B1";
  
  static async synthesize(text: string, voice: string = "es-MX-JorgeNeural"): Promise<Blob> {
    return new Promise((resolve, reject) => {
      let ws: WebSocket;
      try {
        ws = new WebSocket(this.wsUrl);
      } catch (err) {
        return reject(err);
      }

      const audioChunks: BlobPart[] = [];
      const requestId = this.generateRequestId();

      ws.binaryType = "arraybuffer";

      // Límite de tiempo por si queda colgado el socket
      const timeout = setTimeout(() => {
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close();
          reject(new Error("Timeout de conexión en Edge TTS"));
        }
      }, 5000);

      ws.onopen = () => {
        // 1. Mensaje de configuración inicial
        const configMsg = 
          "Content-Type:application/json; charset=utf-8\r\n" +
          "Path:speech.config\r\n\r\n" +
          JSON.stringify({
            context: {
              system: {
                name: "SpeechSDK",
                version: "1.30.0",
                build: "JavaScript",
                lang: "JavaScript"
              }
            }
          });
        ws.send(configMsg);

        // 2. Formatear la voz correctamente para Bing
        const voiceName = voice === "es-MX-JorgeNeural" 
          ? "Microsoft Server Speech Text to Speech Voice (es-MX, JorgeNeural)"
          : "Microsoft Server Speech Text to Speech Voice (es-MX, DaliaNeural)";

        // 3. Enviar SSML estructurado
        const ssml = 
          `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='es-MX'>` +
          `  <voice name='${voiceName}'>` +
          `    ${text}` +
          `  </voice>` +
          `</speak>`;

        const ssmlMsg = 
          `X-RequestId:${requestId}\r\n` +
          `Content-Type:application/ssml+xml\r\n` +
          `Path:ssml\r\n\r\n` +
          ssml;
        
        ws.send(ssmlMsg);
      };

      ws.onmessage = (event) => {
        if (typeof event.data === "string") {
          const textData = event.data;
          // Al recibir fin de turno, cerramos el websocket
          if (textData.includes("Path:turn.end")) {
            clearTimeout(timeout);
            ws.close();
            const blob = new Blob(audioChunks, { type: "audio/mpeg" });
            resolve(blob);
          }
        } else if (event.data instanceof ArrayBuffer) {
          // El protocolo ReadAloud de Edge envía una cabecera de texto precediendo a los bytes MP3.
          // Los primeros 2 bytes de cada mensaje binario indican la longitud de esa cabecera.
          const dataView = new DataView(event.data);
          const headerLength = dataView.getUint16(0);
          const audioOffset = headerLength + 2;
          
          if (event.data.byteLength > audioOffset) {
            const audioData = event.data.slice(audioOffset);
            audioChunks.push(audioData);
          }
        }
      };

      ws.onerror = (err) => {
        clearTimeout(timeout);
        console.error("Error en WebSocket de Edge TTS:", err);
        reject(err);
      };

      ws.onclose = () => {
        clearTimeout(timeout);
        if (audioChunks.length > 0) {
          const blob = new Blob(audioChunks, { type: "audio/mpeg" });
          resolve(blob);
        } else {
          reject(new Error("Conexión de Edge TTS cerrada sin recibir audio"));
        }
      };
    });
  }

  private static generateRequestId(): string {
    const chars = "0123456789abcdef";
    let id = "";
    for (let i = 0; i < 32; i++) {
      id += chars[Math.floor(Math.random() * 16)];
    }
    return id;
  }
}

export const useDexStore = create<DexState>((set, get) => {
  // Cargar voz preferida guardada
  const savedVoice = localStorage.getItem('dentaxy_dex_voice') as DexState['dexVoice'] || 'es-MX-JorgeNeural';

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
      const state = get();
      if (state.currentAudio) {
        state.currentAudio.pause();
        state.currentAudio = null;
      }
      window.speechSynthesis.cancel();
      set({ isSpeaking: false });
    },

    speakText: async (text) => {
      const state = get();
      state.stopSpeaking();
      set({ isSpeaking: true });

      try {
        // Intentar Edge TTS premium
        const blob = await EdgeTTSBrowser.synthesize(text, state.dexVoice);
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        
        set({ currentAudio: audio });

        audio.onended = () => {
          set({ isSpeaking: false, currentAudio: null });
          URL.revokeObjectURL(url);
        };

        audio.onerror = () => {
          console.warn("Fallo al reproducir audio de Edge TTS, usando fallback...");
          state.stopSpeaking();
          // Fallback a SpeechSynthesis
          runSpeechSynthesisFallback(text, () => {
            set({ isSpeaking: false });
          });
        };

        await audio.play();
      } catch (err) {
        console.warn("Fallo al sintetizar audio mediante Edge TTS, usando fallback...", err);
        // Fallback a SpeechSynthesis
        runSpeechSynthesisFallback(text, () => {
          set({ isSpeaking: false });
        });
      }
    }
  };
});

// Fallback robusto al motor de habla del navegador
function runSpeechSynthesisFallback(text: string, onEnded: () => void) {
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-MX";
    
    // Intentar buscar una voz en español mexicana o regional
    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find(v => v.lang.includes("es-MX")) || 
                    voices.find(v => v.lang.startsWith("es-"));
    if (esVoice) utterance.voice = esVoice;
    
    utterance.onend = () => {
      onEnded();
    };
    utterance.onerror = () => {
      onEnded();
    };
    
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error("Fallo definitivo en síntesis de voz:", err);
    onEnded();
  }
}
