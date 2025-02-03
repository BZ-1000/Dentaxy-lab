export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;

  constructor() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.setupRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition();
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'es-ES';
  }

  startRecording(onResult: (text: string) => void, onError: (error: string) => void) {
    if (!this.recognition) {
      onError("Tu navegador no soporta el reconocimiento de voz");
      return;
    }

    this.recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };

    this.recognition.onerror = (event) => {
      onError(`Error en el reconocimiento de voz: ${event.error}`);
    };

    this.recognition.start();
  }

  stopRecording() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}

export const speechRecognitionService = new SpeechRecognitionService();