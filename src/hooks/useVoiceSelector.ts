/**
 * useVoiceSelector.ts
 * Gestiona la lista de voces disponibles en el navegador/SO.
 * 100% offline — usa Web Speech API nativa.
 * Persiste la selección en localStorage.
 */
import { useState, useEffect, useCallback } from 'react';

export interface AvailableVoice {
  name: string;
  lang: string;
  voiceURI: string;
  isSpanish: boolean;
  isDefault: boolean;
}

const STORAGE_KEY = 'dentaxy_preferred_voice_uri';

export const useVoiceSelector = () => {
  const [voices, setVoices] = useState<AvailableVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) ?? '';
  });

  // Cargar voces disponibles del sistema
  const loadVoices = useCallback(() => {
    const raw = window.speechSynthesis.getVoices();
    if (raw.length === 0) return;

    const parsed: AvailableVoice[] = raw.map(v => ({
      name: v.name,
      lang: v.lang,
      voiceURI: v.voiceURI,
      isSpanish: v.lang.toLowerCase().startsWith('es'),
      isDefault: v.default,
    }));

    // Ordenar: español primero, luego el resto
    parsed.sort((a, b) => {
      if (a.isSpanish && !b.isSpanish) return -1;
      if (!a.isSpanish && b.isSpanish) return 1;
      return a.name.localeCompare(b.name);
    });

    setVoices(parsed);

    // Si no hay preferencia guardada, seleccionar primera voz en español
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const firstSpanish = parsed.find(v => v.isSpanish);
      if (firstSpanish) {
        setSelectedVoiceURI(firstSpanish.voiceURI);
        localStorage.setItem(STORAGE_KEY, firstSpanish.voiceURI);
      }
    }
  }, []);

  useEffect(() => {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, [loadVoices]);

  const selectVoice = useCallback((voiceURI: string) => {
    setSelectedVoiceURI(voiceURI);
    localStorage.setItem(STORAGE_KEY, voiceURI);
  }, []);

  // Reproduce una frase de prueba con la voz indicada
  const testVoice = useCallback((voiceURI: string) => {
    window.speechSynthesis.cancel();
    const raw = window.speechSynthesis.getVoices();
    const voice = raw.find(v => v.voiceURI === voiceURI);
    if (!voice) return;

    const utter = new SpeechSynthesisUtterance('¡Hola! Listo para dictar el odontograma');
    utter.voice = voice;
    utter.lang = voice.lang;
    utter.rate = 1.0;
    utter.pitch = 1.0;
    utter.volume = 0.9;
    window.speechSynthesis.speak(utter);
  }, []);

  return { voices, selectedVoiceURI, selectVoice, testVoice };
};
