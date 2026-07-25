/**
 * useOdontogramaVoice.ts — v4 "Semántico"
 * ─────────────────────────────────────────
 * · Buffer acumulador: NO aplica hasta que el doctor termina de hablar
 * · Ventana de silencio de 2 s después del último token final
 * · Confirmación TTS con voz seleccionada por el usuario
 * · Parser multi-diente + grado caries + superficies + material
 * · 100% offline · Web Speech API nativa · Costo $0
 */

import { useState, useCallback, useRef } from 'react';
import { ToothState } from '@/types/odontograma';

// ─────────────────────────────────────────────────────────────────────────────
// Diccionarios del parser
// ─────────────────────────────────────────────────────────────────────────────
const STATE_KEYWORDS: Record<string, ToothState> = {
  // Caries
  'caries': 'C', 'cavitado': 'C', 'cavidad': 'C', 'picado': 'C',
  'picadura': 'C', 'lesion cariosa': 'C', 'lesión cariosa': 'C',
  // Obturado (íntegro)
  'obturado': 'O', 'obturacion': 'O', 'obturación': 'O',
  'restaurado': 'O', 'restauracion': 'O', 'restauración': 'O',
  'composite': 'O',
  // Obturación Filtrada
  'filtrada': 'OF', 'filtrado': 'OF',
  'obturacion filtrada': 'OF', 'obturación filtrada': 'OF',
  'restauracion filtrada': 'OF', 'restauración filtrada': 'OF',
  'filtracion marginal': 'OF', 'filtración marginal': 'OF',
  'obturacion con filtracion': 'OF', 'obturación con filtración': 'OF',
  'caries secundaria': 'OF', 'caries recurrente': 'OF',
  // Ausente
  'ausente': 'A', 'extraido': 'A', 'extraído': 'A',
  'faltante': 'A', 'no esta': 'A', 'perdido': 'A',
  // Extracción indicada
  'extraccion indicada': 'EI', 'extracción indicada': 'EI',
  'indicar extraccion': 'EI', 'para extraccion': 'EI',
  'por extraer': 'EI', 'requiere extraccion': 'EI',
  // Corona
  'corona': 'CR', 'coronado': 'CR', 'protesis fija': 'CR', 'prótesis fija': 'CR',
  // Puente
  'puente': 'PU', 'puente fijo': 'PU',
  // Endodoncia
  'endodoncia': 'E', 'conducto': 'E', 'tratamiento de conductos': 'E',
  'canal': 'E', 'matar el nervio': 'E',
  // Pulpectomía
  'pulpectomia': 'PC', 'pulpectomía': 'PC',
  // Pulpotomía
  'pulpotomia': 'PP', 'pulpotomía': 'PP',
  // Implante
  'implante': 'IM',
  // Sellador
  'sellador': 'SE', 'sellante': 'SE', 'sellado': 'SE', 'preventivo': 'SE',
  // Fractura
  'fractura': 'F', 'fracturado': 'F', 'roto': 'F', 'partido': 'F',
  // Movilidad
  'movilidad': 'MOV', 'movil': 'MOV', 'móvil': 'MOV', 'flojo': 'MOV',
  // Desgaste
  'desgaste': 'DES', 'atricion': 'DES', 'atrición': 'DES', 'abrasion': 'DES', 'abrasión': 'DES',
  // Remanente radicular
  'remanente': 'RR', 'raiz retenida': 'RR', 'raíz retenida': 'RR',
  // Semi-impactado
  'semi impactado': 'SI', 'semiimpactado': 'SI', 'semi-impactado': 'SI',
  // Supernumerario
  'supernumerario': 'SN', 'diente extra': 'SN',
  // Aparato fijo
  'aparato fijo': 'AOF', 'brackets': 'AOF', 'bracket': 'AOF',
  // Aparato removible
  'aparato removible': 'AOR', 'placa removible': 'AOR',
  // Diastema
  'diastema': 'DIA',
  // Discromía
  'discromia': 'DIS', 'discrómico': 'DIS', 'manchado': 'DIS',
  // Ectópico
  'ectopico': 'ECT', 'ectópico': 'ECT',
  // En clavija
  'en clavija': 'CLV', 'clavija': 'CLV', 'conoide': 'CLV',
  // Extrusión
  'extruido': 'EXT', 'extrusion': 'EXT', 'extrusión': 'EXT',
  // Intrusión
  'intruido': 'INT', 'intrusion': 'INT', 'intrusión': 'INT',
  // Geminación/Fusión
  'geminacion': 'GF', 'geminación': 'GF', 'fusion': 'GF', 'fusión': 'GF',
  // Giroversión
  'giroversion': 'GV', 'giroversión': 'GV', 'girado': 'GV',
  // Migración
  'migracion': 'MIG', 'migración': 'MIG', 'migrado': 'MIG',
  // Restauración temporal
  'temporal': 'RT', 'restauracion temporal': 'RT', 'restauración temporal': 'RT',
  // Transposición
  'transposicion': 'TR', 'transposición': 'TR',
  // Sano
  'sano': 'S', 'sin hallazgos': 'S', 'normal': 'S', 'limpio': 'S',
};

const SURFACE_KEYWORDS: Record<string, string> = {
  'mesial': 'M', 'mesio': 'M',
  'distal': 'D', 'disto': 'D',
  'vestibular': 'V', 'vestibulo': 'V', 'bucal': 'V', 'labial': 'V',
  'lingual': 'L', 'linguo': 'L', 'palatino': 'L', 'palatal': 'L',
  'oclusal': 'O', 'ocluso': 'O',
  'incisal': 'I', 'inciso': 'I', 'borde': 'I',
};

const MATERIAL_KEYWORDS: Record<string, string> = {
  'amalgama': 'AM',
  'resina': 'R', 'composite': 'R',
  'ionomero': 'IV', 'ionómero': 'IV', 'ionómero de vidrio': 'IV',
  'incrustacion metalica': 'IM', 'incrustación metálica': 'IM',
  'incrustacion estetica': 'IE', 'incrustación estética': 'IE',
};

const GRADE_WORDS: Record<string, number> = {
  'uno': 1, 'primero': 1, '1': 1,
  'dos': 2, 'segundo': 2, '2': 2,
  'tres': 3, 'tercero': 3, '3': 3,
  'cuatro': 4, 'cuarto': 4, '4': 4,
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
  materialType?: string;
  rawText: string;
}

export interface VoiceFeedback {
  type: 'success' | 'error' | 'listening' | 'idle' | 'waiting';
  message: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Parser determinista
// ─────────────────────────────────────────────────────────────────────────────
export const parseVoiceCommand = (transcript: string): ParsedVoiceCommand[] => {
  const text = transcript
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\boclusal\b/g, 'oclusal')
    .replace(/\bdiente\b/g, '')
    .trim();

  // Extraer números FDI
  const toothRegex = /\b([1-4][1-8]|[5-8][1-5])\b/g;
  const matches = [...text.matchAll(toothRegex)];
  if (matches.length === 0) return [];
  const toothIds = matches.map(m => parseInt(m[1], 10));

  // Detectar estado — clave más larga primero
  let detectedState: ToothState | null = null;
  const sortedKeys = Object.keys(STATE_KEYWORDS).sort((a, b) => b.length - a.length);
  for (const kw of sortedKeys) {
    if (text.includes(kw)) { detectedState = STATE_KEYWORDS[kw]; break; }
  }
  if (!detectedState) return [];

  // Superficies
  const surfaces: string[] = [];
  for (const [kw, s] of Object.entries(SURFACE_KEYWORDS)) {
    if (text.includes(kw) && !surfaces.includes(s)) surfaces.push(s);
  }

  // Material restaurador
  let materialType: string | undefined;
  const sortedMat = Object.keys(MATERIAL_KEYWORDS).sort((a, b) => b.length - a.length);
  for (const kw of sortedMat) {
    if (text.includes(kw)) { materialType = MATERIAL_KEYWORDS[kw]; break; }
  }

  // Grado
  const gradoMatch = text.match(/grado\s+(\w+)/i);
  let grade: number | undefined;
  if (gradoMatch) {
    grade = GRADE_WORDS[gradoMatch[1].toLowerCase()];
  }

  let mobility: 1 | 2 | 3 | undefined;
  let cariesGrade: 1 | 2 | 3 | 4 | undefined;
  if (detectedState === 'MOV') mobility = (grade as 1|2|3) ?? 1;
  else if (detectedState === 'C') cariesGrade = (grade as 1|2|3|4) ?? 2;

  return toothIds.map(toothId => ({
    toothId, state: detectedState!, surfaces,
    mobility, cariesGrade, materialType, rawText: transcript,
  }));
};

// ─────────────────────────────────────────────────────────────────────────────
// TTS con voz seleccionada por el usuario
// ─────────────────────────────────────────────────────────────────────────────
export const speakText = (
  text: string,
  onEnd?: () => void,
  preferredVoiceURI?: string
) => {
  window.speechSynthesis.cancel();
  const spoken = text.replace(/DentaXy/gi, 'Dentaxi').replace(/dentaxy/gi, 'Dentaxi');
  const utter = new SpeechSynthesisUtterance(spoken);
  utter.lang = 'es-MX';
  utter.rate = 1.1;
  utter.pitch = 1.0;
  utter.volume = 0.9;

  const loadVoiceAndSpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      // Usar la voz preferida del usuario si está disponible
      if (preferredVoiceURI) {
        const preferred = voices.find(v => v.voiceURI === preferredVoiceURI);
        if (preferred) { utter.voice = preferred; }
      } else {
        // Fallback: primera voz en español
        const esVoice = voices.find(v => v.lang.includes('es')) || null;
        if (esVoice) utter.voice = esVoice;
      }
    }
    if (onEnd) utter.onend = onEnd;
    window.speechSynthesis.speak(utter);
  };

  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = loadVoiceAndSpeak;
  } else {
    loadVoiceAndSpeak();
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Hook principal — v4 Semántico
// ─────────────────────────────────────────────────────────────────────────────
interface UseOdontogramaVoiceProps {
  onCommand: (command: ParsedVoiceCommand) => void;
  onPendingTooth?: (id: number | null) => void;
  preferredVoiceURI?: string;
}

// Silencio requerido (ms) después del último token antes de aplicar
const SILENCE_WINDOW_MS = 2000;

export const useOdontogramaVoice = ({
  onCommand,
  onPendingTooth,
  preferredVoiceURI,
}: UseOdontogramaVoiceProps) => {
  const [isListening, setIsListening]   = useState(false);
  const [transcript, setTranscript]     = useState('');
  const [feedback, setFeedback]         = useState<VoiceFeedback>({ type: 'idle', message: '' });

  const recognitionRef   = useRef<any>(null);
  const isListeningRef   = useRef(false);
  const isSpeakingRef    = useRef(false);

  // ── Buffer semántico ────────────────────────────────────────────────────────
  // Acumula todo el texto del utterance actual antes de parsear
  const utteranceBufferRef = useRef<string>('');
  const silenceTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  // Aplica el buffer acumulado como comando
  const flushBuffer = useCallback(() => {
    const bufferText = utteranceBufferRef.current.trim();
    if (!bufferText) return;
    utteranceBufferRef.current = '';

    let commands: ParsedVoiceCommand[] = [];
    commands = parseVoiceCommand(bufferText);

    if (commands.length === 0) {
      const lower = bufferText.toLowerCase();
      const hasId = lower.match(/\b([1-4][1-8]|[5-8][1-5])\b/);
      if (hasId || lower.includes('od') || lower.includes('diente')) {
        setFeedback({ type: 'error', message: `⚠ No reconocí: "${bufferText}". Intente de nuevo.` });
        setTimeout(() => {
          if (isListeningRef.current) setFeedback({ type: 'listening', message: 'Escuchando…' });
        }, 2500);
      }
      return;
    }

    // Aplicar todos los comandos del utterance
    commands.forEach(cmd => onCommand(cmd));

    const cmd = commands[0];
    const n = commands.length;
    const surfStr  = cmd.surfaces.length > 0 ? ` · ${cmd.surfaces.join('-')}` : '';
    const gradeStr = cmd.cariesGrade
      ? ` · G${['I','II','III','IV'][cmd.cariesGrade - 1]}`
      : cmd.mobility
        ? ` · G${['I','II','III'][cmd.mobility - 1]}`
        : '';
    const matStr = cmd.materialType ? ` · ${cmd.materialType}` : '';

    setFeedback({
      type: 'success',
      message: `✓ ${n > 1 ? `${n} dientes` : `OD ${cmd.toothId}`} — ${cmd.state}${gradeStr}${surfStr}${matStr}`,
    });

    // TTS de confirmación
    isSpeakingRef.current = true;
    try { recognitionRef.current?.stop(); } catch (_) {}

    const ttsText = n > 1
      ? `${n} dientes actualizados. Listo.`
      : `OD ${cmd.toothId}, listo.`;

    speakText(ttsText, () => {
      isSpeakingRef.current = false;
      if (isListeningRef.current) {
        setTimeout(() => {
          try { createAndStart(); } catch (_) {}
          setFeedback({ type: 'listening', message: 'Escuchando…' });
        }, 250);
      }
    }, preferredVoiceURI);
  }, [onCommand, preferredVoiceURI]); // eslint-disable-line

  // ── Crear y arrancar reconocimiento ────────────────────────────────────────
  const createAndStart = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'es-MX';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      if (!isSpeakingRef.current) {
        setIsListening(true);
        isListeningRef.current = true;
      }
      setFeedback({ type: 'listening', message: 'Escuchando… Ej: "OD 21 caries grado 3 mesial"' });
    };

    recognition.onresult = (event: any) => {
      const results = Array.from(event.results as SpeechRecognitionResultList);
      const lastResult = results[results.length - 1] as SpeechRecognitionResult;

      // ── Resultado INTERMEDIO: resaltar diente en tiempo real ──────────────
      if (!lastResult.isFinal) {
        const interimText = lastResult[0].transcript;
        setTranscript(interimText);
        const toothRegex = /\b([1-4][1-8]|[5-8][1-5])\b/g;
        const ms = [...interimText.matchAll(toothRegex)];
        onPendingTooth?.(ms.length > 0 ? parseInt(ms[0][1], 10) : null);
        return;
      }

      // ── Resultado FINAL: acumular en el buffer semántico ─────────────────
      onPendingTooth?.(null);
      const finalText = lastResult[0].transcript;
      setTranscript(finalText);

      // Acumular fragmento (puede ser parte de un utterance largo)
      utteranceBufferRef.current = (utteranceBufferRef.current + ' ' + finalText).trim();

      // Mostrar que estamos procesando
      setFeedback({
        type: 'waiting',
        message: `⏳ Procesando: "${utteranceBufferRef.current}"`,
      });

      // Reiniciar ventana de silencio — aplicar cuando el doctor deje de hablar
      clearSilenceTimer();
      silenceTimerRef.current = setTimeout(() => {
        flushBuffer();
      }, SILENCE_WINDOW_MS);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') return;
      if (event.error === 'aborted') return;
      setFeedback({ type: 'error', message: `Error de micrófono: ${event.error}` });
    };

    recognition.onend = () => {
      if (isListeningRef.current && !isSpeakingRef.current) {
        setTimeout(() => {
          try { recognition.start(); } catch (_) {}
        }, 100);
      } else if (!isListeningRef.current) {
        setIsListening(false);
      }
    };

    recognition.start();
  }, [flushBuffer, onPendingTooth]);

  // ── API pública ─────────────────────────────────────────────────────────────
  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    clearSilenceTimer();
    utteranceBufferRef.current = '';
    try { recognitionRef.current?.stop(); } catch (_) {}
    recognitionRef.current = null;
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
      setFeedback({ type: 'error', message: 'Tu navegador no soporta voz. Usa Chrome o Edge.' });
      return;
    }
    isListeningRef.current = true;
    setIsListening(true);
    createAndStart();
  }, [createAndStart]);

  const toggleListening = useCallback(() => {
    if (isListeningRef.current) stopListening();
    else startListening();
  }, [startListening, stopListening]);

  return { isListening, toggleListening, stopListening, startListening, transcript, feedback, speakText };
};
