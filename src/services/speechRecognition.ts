
export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;

  constructor() {
    this.initializeRecognition();
  }

  private initializeRecognition() {
    if (typeof window === 'undefined') return;
    
    try {
      if ('webkitSpeechRecognition' in window) {
        this.recognition = new (window as any).webkitSpeechRecognition();
        this.setupRecognition();
      } else if ('SpeechRecognition' in window) {
        this.recognition = new (window as any).SpeechRecognition();
        this.setupRecognition();
      }
    } catch (error) {
      console.error("Error initializing speech recognition:", error);
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    try {
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'es-ES';
    } catch (error) {
      console.error("Error setting up recognition:", error);
    }
  }

  async checkMicrophonePermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Release the stream immediately after checking
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error("Microphone permission error:", error);
      return false;
    }
  }

  async startRecording(onResult: (text: string) => void, onError: (error: string) => void) {
    // First check if the browser supports speech recognition
    if (!this.recognition) {
      onError("Tu navegador no soporta el reconocimiento de voz");
      return;
    }

    // Check microphone permission
    const permissionGranted = await this.checkMicrophonePermission();
    if (!permissionGranted) {
      onError("Se requiere permiso para acceder al micrófono");
      return;
    }

    // Setup recognition event handlers
    this.recognition.onresult = (event) => {
      try {
        const text = event.results[0][0].transcript;
        onResult(text);
      } catch (error) {
        console.error("Error processing recognition result:", error);
        onError("Error al procesar el reconocimiento de voz");
      }
    };

    this.recognition.onerror = (event) => {
      let errorMsg = `Error en el reconocimiento de voz: ${event.error}`;
      
      if (event.error === 'not-allowed') {
        errorMsg = "No se ha permitido el acceso al micrófono. Por favor, verifica los permisos en tu navegador.";
      } else if (event.error === 'no-speech') {
        errorMsg = "No se detectó ninguna voz. Por favor, habla más fuerte o verifica tu micrófono.";
      }
      
      onError(errorMsg);
    };

    // Start the recognition
    try {
      this.recognition.start();
    } catch (error) {
      console.error("Error starting recognition:", error);
      onError("Error al iniciar el reconocimiento de voz");
    }
  }

  stopRecording() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error("Error stopping recognition:", error);
      }
    }
  }
}

export const speechRecognitionService = new SpeechRecognitionService();
