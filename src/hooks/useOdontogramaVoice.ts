/**
 * useOdontogramaVoice.ts — v3 "DentaXy Voice Assistant"
 * ─────────────────────────────────────────────────────
 * · Llenado en tiempo real: destaca el diente MIENTRAS el doctor habla
 * · TTS de confirmación ("OD 21, listo.") con pausa inteligente del micrófono
 * · Pronunciación correcta de "DentaXy" en síntesis de voz
 * · Parser multi-diente + grado de caries + deciduos FDI
 * · Reanuda automáticamente la escucha después de cada confirmación TTS
 * · Sin APIs externas · Web Speech API nativa · Costo $0
 */

import { useState, useCallback, useRef } from 'react';
import { ToothState } from '@/types/odontograma';

// ─────────────────────────────────────────────────────────────────────────────
// Diccionarios del parser (soporta sinónimos clínicos reales)
// ─────────────────────────────────────────────────────────────────────────────
const STATE_KEYWORDS: Record<string, ToothState> = {
  // Caries
  'caries':                   'C',
  'cavitado':                 'C',
  'cavidad':                  'C',
  'picado':                   'C',
  'picadura':                 'C',
  'lesión cariosa':           'C',
  'lesion cariosa':           'C',
  // Obturado
  'obturado':                 'O',
  'obturación':               'O',
  'restaurado':               'O',
  'restauración':             'O',
  'resina':                   'O',
  'amalgama':                 'O',
  'composite':                'O',
  // Ausente
  'ausente':                  'A',
  'extraído':                 'A',
  'faltante':                 'A',
  'no está':                  'A',
  'perdido':                  'A',
  // Extracción indicada
  'extracción indicada':      'EI',
  'indicar extracción':       'EI',
  'para extracción':          'EI',
  'por extraer':              'EI',
  'requiere extracción':      'EI',
  'extracción':               'EI',
  'extraer':                  'EI',
  // Corona
  'corona':                   'CR',
  'coronado':                 'CR',
  'prótesis fija':            'CR',
  'cap':                      'CR',
  // Puente
  'puente':                   'PU',
  'puente fijo':              'PU',
  'pontic':                   'PU',
  // Endodoncia
  'endodoncia':               'E',
  'conducto':                 'E',
  'tratamiento de conductos': 'E',
  'tratamiento de canal':     'E',
  'canal':                    'E',
  'pulpectomía':              'E',
  'pulpotomía':               'E',
  'matar el nervio':          'E',
  // Implante
  'implante':                 'IM',
  // Sellador
  'sellador':                 'SE',
  'sellante':                 'SE',
  'preventivo':               'SE',
  'sellado':                  'SE',
  // Fractura
  'fractura':                 'F',
  'fracturado':               'F',
  'roto':                     'F',
  'partida':                  'F',
  // Movilidad
  'movilidad':                'MOV',
  'móvil':                    'MOV',
  'flojo':                    'MOV',
  // Sano
  'sano':                     'S',
  'sin hallazgos':            'S',
  'limpiar':                  'S',
  'normal':                   'S',
};

const SURFACE_KEYWORDS: Record<string, string> = {
  'mesial':       'M',
  'mesio':        'M',
  'distal':       'D',
  'disto':        'D',
  'vestibular':   'V',
  'vestíbulo':    'V',
  'bucal':        'V',
  'labial':       'V',
  'lingual':      'L',
  'linguo':       'L',
  'palatino':     'L',
  'palatal':      'L',
  'oclusal':      'O',
  'ocluso':       'O',
  'incisal':      'I',
  'inciso':       'I',
  'borde':        'I',
};

const GRADE_WORDS: Record<string, number> = {
  'uno': 1, 'primero': 1, '1': 1, 'i': 1,
  'dos': 2, 'segundo': 2, '2': 2, 'ii': 2,
  'tres': 3, 'tercero': 3, '3': 3, 'iii': 3,
  'cuatro': 4, 'cuarto': 4, '4': 4, 'iv': 4,
};

// ─────────────────────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────────────────────
export interface ParsedVoiceCommand {
  toothId: number;
  state: ToothState;
  surfaces: string[];
  mobility?: 1 | 2 | 3;
  cariesGrade?: 1 | 2 | 3 | 4;
  rawText: string;
}

export interface VoiceFeedback {
  type: 'success' | 'error' | 'listening' | 'idle';
  message: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Parser determinista — retorna array (soporta múltiples dientes)
// ─────────────────────────────────────────────────────────────────────────────
export const parseVoiceCommand = (transcript: string): ParsedVoiceCommand[] => {
  const text = transcript
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quitar acentos
    .replace(/\bóclusal\b/g, 'oclusal')
    .replace(/\bdiente\b/g, '')
    .trim();

  // Extraer TODOS los números FDI (permanentes 11-48 y deciduos 51-85)
  const toothRegex = /\b([1-4][1-8]|[5-8][1-5])\b/g;
  const matches = [...text.matchAll(toothRegex)];
  if (matches.length === 0) return [];
  const toothIds = matches.map(m => parseInt(m[1], 10));

  // Detectar estado — busca la clave más larga primero para evitar ambigüedades
  let detectedState: ToothState | null = null;
  const sortedKeys = Object.keys(STATE_KEYWORDS).sort((a, b) => b.length - a.length);
  for (const kw of sortedKeys) {
    if (text.includes(kw)) { detectedState = STATE_KEYWORDS[kw]; break; }
  }
  if (!detectedState) return [];

  // Detectar superficies
  const surfaces: string[] = [];
  for (const [kw, s] of Object.entries(SURFACE_KEYWORDS)) {
    if (text.includes(kw) && !surfaces.includes(s)) surfaces.push(s);
  }

  // Detectar grado (para caries o movilidad)
  const gradoMatch = text.match(/grado\s+(\w+)/i);
  let grade: number | undefined;
  if (gradoMatch) {
    const gw = gradoMatch[1].toLowerCase();
    grade = GRADE_WORDS[gw];
  }

  let mobility: 1 | 2 | 3 | undefined;
  let cariesGrade: 1 | 2 | 3 | 4 | undefined;
  if (detectedState === 'MOV') {
    mobility = (grade as 1|2|3) ?? 1;
  } else if (detectedState === 'C') {
    cariesGrade = (grade as 1|2|3|4) ?? 2; // Default G2 si el doctor no especifica
  }

  return toothIds.map(toothId => ({
    toothId,
    state: detectedState!,
    surfaces,
    mobility,
    cariesGrade,
    rawText: transcript,
  }));
};

// ─────────────────────────────────────────────────────────────────────────────
// Motor TTS — Síntesis de voz con pronunciación correcta de "DentaXy"
// Pausa el reconocimiento durante el speech y lo reanuda al terminar
// ─────────────────────────────────────────────────────────────────────────────
const speakText = (
  text: string,
  onEnd?: () => void,
  preferMale = true
) => {
  window.speechSynthesis.cancel();

  // Corrección de pronunciación: "DentaXy" → "Dentaxi" (fonética española)
  const spoken = text
    .replace(/DentaXy/gi, 'Dentaxi')
    .replace(/dentaxy/gi, 'Dentaxi');

  const utter = new SpeechSynthesisUtterance(spoken);
  utter.lang = 'es-MX';
  utter.rate = 1.1;
  utter.pitch = 1.0;
  utter.volume = 0.9;

  // Seleccionar voz masculina si está disponible
  const loadVoiceAndSpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0 && preferMale) {
      const male = voices.find(v =>
        v.lang.includes('es') && (
          v.name.toLowerCase().includes('pablo') ||
          v.name.toLowerCase().includes('male') ||
          v.name.toLowerCase().includes('jorge') ||
          v.name.toLowerCase().includes('google español') ||
          v.name.toLowerCase().includes('google es')
        )
      ) || voices.find(v => v.lang.includes('es'));
      if (male) utter.voice = male;
    }
    if (onEnd) utter.onend = onEnd;
    window.speechSynthesis.speak(utter);
  };

  // Las voces pueden no estar listas de inmediato
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = loadVoiceAndSpeak;
  } else {
    loadVoiceAndSpeak();
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Hook principal
// ─────────────────────────────────────────────────────────────────────────────
interface UseOdontogramaVoiceProps {
  onCommand: (command: ParsedVoiceCommand) => void;
  onPendingTooth?: (id: number | null) => void; // Para resaltar diente en tiempo real
}

export const useOdontogramaVoice = ({ onCommand, onPendingTooth }: UseOdontogramaVoiceProps) => {
  const [isListening, setIsListening]   = useState(false);
  const [transcript, setTranscript]     = useState('');
  const [feedback, setFeedback]         = useState<VoiceFeedback>({ type: 'idle', message: '' });
  const recognitionRef                  = useRef<any>(null);
  const isListeningRef                  = useRef(false); // Ref para el closure de onEnd
  const isSpeakingRef                   = useRef(false); // Ref para evitar re-entradas

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
      recognitionRef.current = null;
    }
    window.speechSynthesis.cancel();
    setIsListening(false);
    setFeedback({ type: 'idle', message: '' });
    setTranscript('');
    onPendingTooth?.(null);
  }, [onPendingTooth]);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setFeedback({ type: 'error', message: 'Tu navegador no soporta dictado por voz. Usa Chrome o Edge.' });
      return;
    }

    const createAndStart = () => {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.lang = 'es-MX';
      recognition.continuous = true;
      recognition.interimResults = true;   // Resultados en tiempo real
      recognition.maxAlternatives = 3;     // Considera 3 interpretaciones para mayor precisión

      recognition.onstart = () => {
        if (!isSpeakingRef.current) {
          setIsListening(true);
          isListeningRef.current = true;
        }
        setFeedback({ type: 'listening', message: 'Escuchando… Diga p.ej. "OD 21 caries grado 2 mesial"' });
      };

      recognition.onresult = (event: any) => {
        const results = Array.from(event.results as SpeechRecognitionResultList);
        const lastResult = results[results.length - 1] as SpeechRecognitionResult;

        // ── Resultados intermedios: resaltar diente en tiempo real ────────────
        if (!lastResult.isFinal) {
          const interimText = lastResult[0].transcript;
          setTranscript(interimText);

          // Detectar si ya mencionó un diente → iluminarlo inmediatamente
          const toothRegex = /\b([1-4][1-8]|[5-8][1-5])\b/g;
          const matches = [...interimText.matchAll(toothRegex)];
          if (matches.length > 0) {
            onPendingTooth?.(parseInt(matches[0][1], 10));
          } else {
            onPendingTooth?.(null);
          }
          return;
        }

        // ── Resultado final: aplicar comando ─────────────────────────────────
        onPendingTooth?.(null);
        const finalText = lastResult[0].transcript;
        setTranscript(finalText);

        // Intentar todas las alternativas de reconocimiento
        let commands: ParsedVoiceCommand[] = [];
        for (let i = 0; i < lastResult.length; i++) {
          commands = parseVoiceCommand(lastResult[i].transcript);
          if (commands.length > 0) break;
        }

        if (commands.length === 0) {
          const raw = finalText.toLowerCase();
          const hasToothId = raw.match(/\b([1-4][1-8]|[5-8][1-5])\b/);
          if (hasToothId || raw.includes('od') || raw.includes('diente')) {
            setFeedback({ type: 'error', message: `⚠ No reconocí: "${finalText}". Intente de nuevo.` });
            setTimeout(() => {
              if (isListeningRef.current) setFeedback({ type: 'listening', message: 'Escuchando…' });
            }, 2500);
          }
          return;
        }

        // ── Aplicar todos los comandos del utterance ──────────────────────────
        commands.forEach(cmd => onCommand(cmd));

        const cmd       = commands[0];
        const n         = commands.length;
        const surfStr   = cmd.surfaces.length > 0 ? ` · ${cmd.surfaces.join('-')}` : '';
        const gradeStr  = cmd.cariesGrade
          ? ` · Grado ${['I','II','III','IV'][cmd.cariesGrade - 1]}`
          : cmd.mobility
            ? ` · Grado ${['I','II','III'][cmd.mobility - 1]}`
            : '';

        setFeedback({
          type: 'success',
          message: `✓ ${n > 1 ? `${n} dientes` : `OD ${cmd.toothId}`} — ${cmd.state}${gradeStr}${surfStr}`,
        });

        // ── TTS de confirmación con pausa inteligente del micrófono ──────────
        isSpeakingRef.current = true;
        try { recognition.stop(); } catch (_) {}

        const ttsText = n > 1
          ? `${n} dientes actualizados. Listo.`
          : `OD ${cmd.toothId}, listo.`;

        speakText(ttsText, () => {
          isSpeakingRef.current = false;
          // Reanudar escucha después de confirmar
          if (isListeningRef.current) {
            setTimeout(() => {
              try { createAndStart(); } catch (_) {}
              setFeedback({ type: 'listening', message: 'Escuchando…' });
            }, 250);
          }
        });
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'no-speech') return; // Silencio normal — ignorar
        if (event.error === 'aborted') return;   // Parada intencional por TTS
        setFeedback({ type: 'error', message: `Error de micrófono: ${event.error}` });
      };

      recognition.onend = () => {
        // Reiniciar si NO fue detenido intencionalmente ni por TTS
        if (isListeningRef.current && !isSpeakingRef.current) {
          setTimeout(() => {
            try { recognition.start(); } catch (_) {}
          }, 100);
        } else if (!isListeningRef.current) {
          setIsListening(false);
        }
      };

      recognition.start();
    };

    isListeningRef.current = true;
    setIsListening(true);
    createAndStart();
  }, [onCommand, onPendingTooth]);

  const toggleListening = useCallback(() => {
    if (isListeningRef.current) {
      stopListening();
    } else {
      startListening();
    }
  }, [startListening, stopListening]);

  return {
    isListening,
    toggleListening,
    stopListening,
    transcript,
    feedback,
    speakText,
  };
};
