// Tonos sintetizados con Web Audio API
const playActivationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const playTone = (freq: number, start: number, duration: number) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + start);
      gain.gain.setValueAtTime(0, audioCtx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + start + 0.02);
      gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + start + duration);
      osc.start(audioCtx.currentTime + start);
      osc.stop(audioCtx.currentTime + start + duration);
    };
    playTone(523.25, 0, 0.10); // C5
    playTone(659.25, 0.08, 0.12); // E5
  } catch (error) {
    console.error("Error playing activation sound:", error);
  }
};

const playDeactivationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(329.63, audioCtx.currentTime); // E4
    osc.frequency.linearRampToValueAtTime(220.00, audioCtx.currentTime + 0.20); // A3
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.20);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.20);
  } catch (error) {
    console.error("Error playing deactivation sound:", error);
  }
};

export function GlobalDexBubble() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [illustrationImg, setIllustrationImg] = useState<string | null>(null);
  const [illustrationTitle, setIllustrationTitle] = useState<string>('');
  
  // Máquina de estados de voz ('SLEEPING' | 'LISTENING_COMMAND' | 'PROCESSING' | 'SPEAKING')
  const [voiceState, setVoiceState] = useState<'SLEEPING' | 'LISTENING_COMMAND' | 'PROCESSING' | 'SPEAKING'>('SLEEPING');

  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const conversationStateRef = useRef<'IDLE' | 'WAITING_COMMAND' | 'ADD_PATIENT_NAME' | 'ADD_PATIENT_PHONE' | 'ADD_PATIENT_CONFIRM'>('IDLE');
  const tempPatientRef = useRef({ name: '', phone: '' });

  // Zustand Store de DEX
  const { speakText, isSpeaking, setIsListening } = useDexStore();

  // Ocultar en la landing, panel admin y rutas de registro de pacientes
  const isLanding = location.pathname === "/";
  const isAdmin   = location.pathname.startsWith("/admin");
  const isPatient = location.pathname.startsWith("/paciente") || location.pathname.startsWith("/x");

  const resetInactivityTimeout = () => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    // Dar más tiempo si estamos a mitad de una conversación (15s)
    const timeoutDuration = conversationStateRef.current === 'IDLE' ? 5000 : 15000;
    
    inactivityTimeoutRef.current = setTimeout(() => {
      // Si no está reproduciendo voz y el chat no está abierto, cerramos y volvemos al estado inicial
      if (!useDexStore.getState().isSpeaking && !isChatOpen) {
        setResponseMessage(null);
        setIsInteracting(false);
        conversationStateRef.current = 'IDLE';
        setVoiceState('SLEEPING');
      }
    }, timeoutDuration);
  };

  useEffect(() => {
    if (!isSpeaking) {
      resetInactivityTimeout();
    } else {
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    }
  }, [isSpeaking, isChatOpen]);

  useEffect(() => {
    return () => {
      if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    };
  }, []);

  const handleAddPatientIntent = (data: string) => {
    if (data.length > 3) {
      const phoneRegex = /(?:tel[eé]fono|celular|numero|número)\s+(.+)/i;
      const match = data.match(phoneRegex);
      if (match) {
        tempPatientRef.current.name = data.replace(match[0], "").trim();
        tempPatientRef.current.phone = match[1].trim();
        conversationStateRef.current = 'ADD_PATIENT_CONFIRM';
        const msg = `Perfecto. Registrando a ${tempPatientRef.current.name} con teléfono ${tempPatientRef.current.phone}. ¿Confirma el registro?`;
        setResponseMessage(msg); speakText(msg);
      } else {
        tempPatientRef.current.name = data;
        conversationStateRef.current = 'ADD_PATIENT_PHONE';
        const msg = `Nombre registrado: ${data}. ¿Cuál es su número de teléfono?`;
        setResponseMessage(msg); speakText(msg);
      }
    } else {
      conversationStateRef.current = 'ADD_PATIENT_NAME';
      const msg = "Claro Doctor, ¿Cuál es el nombre completo del paciente?";
      setResponseMessage(msg); speakText(msg);
    }
  };

  const doCreatePatient = () => {
    const nameSnap = tempPatientRef.current.name;
    const phoneSnap = tempPatientRef.current.phone;
    const progressMsg = "Creando expediente...";
    setResponseMessage(progressMsg);
    conversationStateRef.current = 'IDLE';
    tempPatientRef.current = { name: '', phone: '' };

    (async () => {
      try {
        const seedUserStr = sessionStorage.getItem('seed_user');
        let accessToken: string | null = null;
        if (seedUserStr) {
          try { accessToken = JSON.parse(seedUserStr).googleAccessToken; } catch(e){}
        }

        if (accessToken) {
          // Buscar carpeta raíz Dentaxy
          const q = encodeURIComponent("name = 'Dentaxy' and mimeType = 'application/vnd.google-apps.folder' and trashed = false");
          const rootRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id)`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          const rootData = await rootRes.json();
          let parentId: string | null = null;
          if (rootData.files && rootData.files.length > 0) {
            parentId = rootData.files[0].id;
          } else {
            const cr = await fetch('https://www.googleapis.com/drive/v3/files', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: 'Dentaxy', mimeType: 'application/vnd.google-apps.folder' })
            });
            parentId = (await cr.json()).id;
          }

          // Crear carpeta del paciente
          const parts = nameSnap.trim().split(/\s+/);
          const last = parts.length > 1 ? parts[parts.length - 1] : parts[0];
          const first = parts.length > 1 ? parts.slice(0, -1).join(' ') : '';
          const folderName = first ? `${last.toUpperCase()}, ${first.toUpperCase()}` : last.toUpperCase();

          const patRes = await fetch('https://www.googleapis.com/drive/v3/files', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: folderName,
              mimeType: 'application/vnd.google-apps.folder',
              parents: [parentId],
              appProperties: { telefono: phoneSnap, motivo: 'Valoración inicial (DEX AI)', alergias: 'Ninguna' }
            })
          });

          if (patRes.ok) {
            window.dispatchEvent(new Event('patientCreated'));
          }
        }

        // Siempre crear localmente también (para que aparezca inmediatamente en UI)
        window.dispatchEvent(new CustomEvent('createNewPatientLocal', {
          detail: { name: nameSnap, telefono: phoneSnap }
        }));

        const doneMsg = "Paciente registrado exitosamente.";
        setResponseMessage(doneMsg); speakText(doneMsg);
        setTimeout(() => { setIsChatOpen(false); setResponseMessage(null); setIsInteracting(false); }, 4000);
      } catch (err) {
        // En caso de error de red, crear localmente
        window.dispatchEvent(new CustomEvent('createNewPatientLocal', {
          detail: { name: nameSnap, telefono: phoneSnap }
        }));
        const doneMsg = "Paciente registrado en sistema local.";
        setResponseMessage(doneMsg); speakText(doneMsg);
        setTimeout(() => { setIsChatOpen(false); setResponseMessage(null); setIsInteracting(false); }, 4000);
      }
    })();
  };

  const handlePatientNameInput = (name: string) => {
    handleAddPatientIntent(name);
  };

  const handlePatientPhoneInput = (phone: string) => {
    tempPatientRef.current.phone = phone;
    conversationStateRef.current = 'ADD_PATIENT_CONFIRM';
    const msg = `Perfecto. Registrando a ${tempPatientRef.current.name} con teléfono ${tempPatientRef.current.phone}. ¿Confirma el registro?`;
    setResponseMessage(msg); 
    speakText(msg);
  };

  const handlePatientConfirmInput = (text: string) => {
    const toWords = (s: string) => s.split(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9]+/).filter(Boolean);
    const words = toWords(text.toLowerCase());
    const confirmList = ["si", "sí", "claro", "confirmo", "confirmar", "confirma", "correcto", "ok", "okay", "dale", "perfecto", "adelante", "hazlo", "supuesto", "simon", "yes", "sip", "crear", "crea", "procede", "proceder", "graba", "grabar", "va", "andale", "ándale", "sure", "yep", "afirmativo"];
    const cancelList = ["no", "cancelar", "cancela", "olvidalo", "olvídalo", "detener", "parar", "rechazar", "rechaza"];
    const confirmed = confirmList.some(w => words.includes(w));
    const cancelled = cancelList.some(w => words.includes(w));
    if (confirmed) {
      doCreatePatient();
    } else if (cancelled) {
      const msg = "Registro cancelado, Doctor.";
      setResponseMessage(msg); speakText(msg);
      conversationStateRef.current = 'IDLE';
      tempPatientRef.current = { name: '', phone: '' };
    }
  };

  const handleVoiceCommand = (cmd: string) => {
    const cleanCmd = cmd.toLowerCase().replace(/^(hey dex|okey dex|ok dex|oye dex|okay dex|escucha dex|dex)\s*/i, "").trim();
    
    if (!cleanCmd) {
      const phrases = ["A la orden, Doctor.", "Dígame, Doctor, ¿en qué le asisto?", "A sus completas órdenes, Doctor.", "A su entera disposición, Doctor.", "Le escucho atentamente, Doctor.", "¿Qué se le ofrece, Doctor?", "Siempre a su disposición, Doctor.", "Listo para sus instrucciones, Doctor."];
      const phrase = phrases[Math.floor(Math.random() * phrases.length)];
      setResponseMessage(phrase); 
      speakText(phrase);
      conversationStateRef.current = 'WAITING_COMMAND';
      return;
    }

    const hardCancelPhrases = ["no nada", "no, nada", "olvídalo", "olvidalo", "cancelar todo"];
    if (hardCancelPhrases.some(p => cleanCmd.includes(p))) {
      setIsInteracting(false);
      setResponseMessage(null);
      conversationStateRef.current = 'IDLE';
      tempPatientRef.current = { name: '', phone: '' };
      return;
    }

    if (cleanCmd.includes("agrega paciente") || cleanCmd.includes("agregar paciente") || cleanCmd.includes("nuevo paciente") || cleanCmd.includes("registra paciente")) {
      const data = cleanCmd.replace(/.*(?:agrega|agregar|nuevo|registra)\s+paciente\s*/i, "").trim();
      handleAddPatientIntent(data);
    } else if (cleanCmd.includes("partes del diente") || cleanCmd.includes("muestra diente") || cleanCmd.includes("anatomia del diente") || cleanCmd.includes("anatomía del diente")) {
      setIllustrationImg("/Ilustraciones DEX/Partes del diente .png");
      setIllustrationTitle("Partes del Diente");
      const m = "Aquí tiene, Doctor. Las partes anatómicas del diente.";
      setResponseMessage(m); speakText(m);
      conversationStateRef.current = 'IDLE';
    } else if (cleanCmd.includes("fases de la caries") || cleanCmd.includes("caries") || cleanCmd.includes("etapas caries") || cleanCmd.includes("fases caries")) {
      setIllustrationImg("/Ilustraciones DEX/Fases de la caries dental.png");
      setIllustrationTitle("Fases de la Caries Dental");
      const m = "Aquí tiene, Doctor. Las fases de progresión de la caries dental.";
      setResponseMessage(m); speakText(m);
      conversationStateRef.current = 'IDLE';
    } else if (cleanCmd.includes("cerrar") || cleanCmd.includes("quita") || cleanCmd.includes("oculta")) {
      setIllustrationImg(null);
      const m = "Entendido, Doctor.";
      setResponseMessage(m); speakText(m);
      conversationStateRef.current = 'IDLE';
    } else {
      setChatInput(cleanCmd);
      setIsChatOpen(true);
      handleSendMessageWithText(cleanCmd);
    }
  };

  const processVoiceInput = (text: string) => {
    const cleaned = text.trim();
    if (!cleaned) return;

    if (conversationStateRef.current === 'ADD_PATIENT_NAME') {
      handlePatientNameInput(cleaned);
    } else if (conversationStateRef.current === 'ADD_PATIENT_PHONE') {
      handlePatientPhoneInput(cleaned);
    } else if (conversationStateRef.current === 'ADD_PATIENT_CONFIRM') {
      handlePatientConfirmInput(cleaned);
    } else if (conversationStateRef.current === 'WAITING_COMMAND') {
      handleVoiceCommand(cleaned);
    } else {
      handleVoiceCommand(cleaned);
    }
  };

  const handleSendMessageWithText = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setIsLoading(true);
    setResponseMessage("Pensando...");
    try {
      const defaultProfile = { role: "odontologo", currentSystem: "digital_basico", priority: "tecnologia" };
      const response = await chatWithAgent(text, defaultProfile, []);
      setResponseMessage(response);
      speakText(response);
    } catch {
      const errorMsg = "Lo siento, no pude conectar con mi motor neuronal local. ¿Puede preguntar de nuevo?";
      setResponseMessage(errorMsg);
      speakText(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Speech Recognition setup (Máquina de estados tipo Alexa)
  useEffect(() => {
    if (isLanding || isAdmin || isPatient) return;

    let recognition: any = null;
    let shouldListen = true;
    let silenceTimer: NodeJS.Timeout | null = null;
    let timeoutTimer: NodeJS.Timeout | null = null;
    let isFinished = false;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition no está soportado en este navegador.");
      return;
    }

    const startRecognition = () => {
      if (!shouldListen) return;
      try {
        recognition = new SpeechRecognition();
        
        if (voiceState === 'SLEEPING') {
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'es-MX';

          recognition.onstart = () => {
            useDexStore.getState().setIsListening(true);
          };

          recognition.onresult = (event: any) => {
            let latestTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
              latestTranscript += event.results[i][0].transcript;
            }
            const cleanLatest = latestTranscript.trim().toLowerCase();
            if (!cleanLatest) return;

            const wakeWords = ["hey dex", "okey dex", "oye dex", "ok dex", "okay dex", "escucha dex", "dex", "ex"];
            const hasWakeWord = wakeWords.some(w => cleanLatest.includes(w));

            if (hasWakeWord && !isFinished) {
              isFinished = true;
              recognition.abort();
              playActivationSound();
              setIsInteracting(true);
              
              // Eliminar wake word para ver si traía comando junto
              let cmd = cleanLatest;
              wakeWords.forEach(w => { cmd = cmd.replace(w, ""); });
              cmd = cmd.replace(/^[\s,]+|[\s,]+$/g, "").trim();

              if (cmd.length > 2) {
                setVoiceState('PROCESSING');
                processVoiceInput(cmd);
              } else {
                setVoiceState('LISTENING_COMMAND');
              }
            }
          };

          recognition.onend = () => {
            useDexStore.getState().setIsListening(false);
            if (shouldListen && voiceState === 'SLEEPING') {
              setTimeout(startRecognition, 150);
            }
          };

          recognition.onerror = (event: any) => {
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
              shouldListen = false;
            }
            useDexStore.getState().setIsListening(false);
          };

          recognition.start();

        } else if (voiceState === 'LISTENING_COMMAND') {
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.lang = 'es-MX';
          let finalTranscript = "";

          recognition.onstart = () => {
            useDexStore.getState().setIsListening(true);
            setResponseMessage("Escuchando, Doctor...");
            
            // Timeout de 6 segundos si el usuario no habla
            timeoutTimer = setTimeout(() => {
              if (shouldListen && voiceState === 'LISTENING_COMMAND') {
                recognition.abort();
                playDeactivationSound();
                setResponseMessage(null);
                setIsInteracting(false);
                conversationStateRef.current = 'IDLE';
                setVoiceState('SLEEPING');
              }
            }, 6000);
          };

          recognition.onresult = (event: any) => {
            if (timeoutTimer) clearTimeout(timeoutTimer);

            let interimTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcriptPart = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscript = (finalTranscript + " " + transcriptPart).trim();
              } else {
                interimTranscript = (interimTranscript + " " + transcriptPart).trim();
              }
            }

            const currentSpeech = (finalTranscript + " " + interimTranscript).trim();
            if (currentSpeech) {
              setResponseMessage(currentSpeech);
              
              if (silenceTimer) clearTimeout(silenceTimer);
              silenceTimer = setTimeout(() => {
                if (shouldListen && !isFinished) {
                  isFinished = true;
                  recognition.abort();
                  processVoiceInput(currentSpeech);
                }
              }, 1800);
            }
          };

          recognition.onend = () => {
            useDexStore.getState().setIsListening(false);
            if (timeoutTimer) clearTimeout(timeoutTimer);
            if (silenceTimer) clearTimeout(silenceTimer);
            
            if (shouldListen && voiceState === 'LISTENING_COMMAND' && !isFinished) {
              if (finalTranscript.trim()) {
                isFinished = true;
                processVoiceInput(finalTranscript);
              } else {
                playDeactivationSound();
                setResponseMessage(null);
                setIsInteracting(false);
                conversationStateRef.current = 'IDLE';
                setVoiceState('SLEEPING');
              }
            }
          };

          recognition.onerror = (event: any) => {
            useDexStore.getState().setIsListening(false);
          };

          recognition.start();
        }
      } catch (e) {
        console.error("Error en SpeechRecognition:", e);
      }
    };

    startRecognition();

    return () => {
      shouldListen = false;
      if (silenceTimer) clearTimeout(silenceTimer);
      if (timeoutTimer) clearTimeout(timeoutTimer);
      if (recognition) {
        try { recognition.abort(); } catch(e){}
      }
    };
  }, [isLanding, isAdmin, isPatient, voiceState]);

  // Sincronización con el estado de habla de DEX (evitar eco)
  useEffect(() => {
    if (isLanding || isAdmin || isPatient) return;

    if (isSpeaking) {
      setVoiceState('SPEAKING');
    } else {
      if (conversationStateRef.current !== 'IDLE') {
        playActivationSound();
        setVoiceState('LISTENING_COMMAND');
      } else {
        setVoiceState('SLEEPING');
      }
    }
  }, [isSpeaking, isLanding, isAdmin, isPatient]);
        } else if (voiceState === 'LISTENING_COMMAND') {
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.lang = 'es-MX';
          let finalTranscript = "";

          recognition.onstart = () => {
            useDexStore.getState().setIsListening(true);
            setResponseMessage("Escuchando, Doctor...");
            
            // Timeout de 4 segundos si el usuario no empieza a hablar
            timeoutTimer = setTimeout(() => {
              if (shouldListen && voiceState === 'LISTENING_COMMAND') {
                recognition.abort();
              }
            }, 4000);
          };

          recognition.onresult = (event: any) => {
            // Cancelar el timeout de inactividad inicial al detectar actividad
            if (timeoutTimer) {
              clearTimeout(timeoutTimer);
              timeoutTimer = null;
            }

            let interimTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcriptPart = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscript = (finalTranscript + " " + transcriptPart).trim();
              } else {
                interimTranscript = (interimTranscript + " " + transcriptPart).trim();
              }
            }

            const currentSpeech = (finalTranscript + " " + interimTranscript).trim();
            if (currentSpeech) {
              setResponseMessage(currentSpeech);
              
              // 1.8 segundos de silencio para procesar la orden
              if (silenceTimer) clearTimeout(silenceTimer);
              silenceTimer = setTimeout(() => {
                if (shouldListen && !isFinished) {
                  isFinished = true;
                  recognition.abort();
                  processVoiceInput(currentSpeech);
                }
              }, 1800);
            }
          };

          recognition.onend = () => {
            useDexStore.getState().setIsListening(false);
            if (timeoutTimer) clearTimeout(timeoutTimer);
            if (silenceTimer) clearTimeout(silenceTimer);
            
            if (shouldListen && voiceState === 'LISTENING_COMMAND' && !isFinished) {
              const cleanedText = finalTranscript.trim();
              if (cleanedText) {
                isFinished = true;
                processVoiceInput(cleanedText);
              } else {
                isFinished = true;
                playDeactivationSound();
                setResponseMessage(null);
                setIsInteracting(false);
                conversationStateRef.current = 'IDLE';
                setVoiceState('SLEEPING');
              }
            }
          };

          recognition.onerror = (event: any) => {
            useDexStore.getState().setIsListening(false);
            console.warn("Speech recognition error in active command listening:", event.error);
          };

          recognition.start();
        }
// Tonos sintetizados con Web Audio API (Efectos de Ciencia Ficción Cinematográfica)
const playActivationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;
    
    // Filtro analógico pasabajos cálido
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.setValueAtTime(8, now); // Resonancia alta para carácter sci-fi
    // Barrido de frecuencia del filtro (Filter Sweep)
    filter.frequency.setValueAtTime(150, now);
    filter.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.4);
    
    // Ganancia con ataque suave y decaimiento exponencial
    const mainGain = audioCtx.createGain();
    mainGain.gain.setValueAtTime(0, now);
    mainGain.gain.linearRampToValueAtTime(0.18, now + 0.08); 
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    
    // Dos osciladores desfinados (Detune) para crear textura y espacialidad (efecto coro)
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    
    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    
    // Frecuencias base graves (La2 = ~110Hz)
    const baseFreq = 110;
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, now + 0.18); // Subida de pitch
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.4);
    
    osc2.frequency.setValueAtTime(baseFreq, now);
    osc2.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, now + 0.18);
    osc2.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.4);
    
    osc1.detune.setValueAtTime(-15, now);
    osc2.detune.setValueAtTime(15, now);
    
    // Modulador LFO para trémolo orgánico rápido (vibrato de "materia viva")
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(14, now); // 14Hz rápido
    lfoGain.gain.setValueAtTime(12, now); // Variación de pitch
    
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfoGain.connect(osc2.frequency);
    
    // Conectar nodos
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(audioCtx.destination);
    
    osc1.start(now);
    osc2.start(now);
    lfo.start(now);
    
    osc1.stop(now + 0.45);
    osc2.stop(now + 0.45);
    lfo.stop(now + 0.45);
  } catch (error) {
    console.error("Error playing activation sound:", error);
  }
};

const playDeactivationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.setValueAtTime(6, now);
    // Filtro descendente
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(80, now + 0.55);
    
    const mainGain = audioCtx.createGain();
    mainGain.gain.setValueAtTime(0.18, now);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    
    osc1.type = 'triangle'; // Onda triángulo para sub-grave redondo
    osc2.type = 'sawtooth';  // Textura sci-fi filtrada
    
    const baseFreq = 165; // E3
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc1.frequency.linearRampToValueAtTime(55, now + 0.5); // Caída a La1 (muy grave y pesado)
    
    osc2.frequency.setValueAtTime(baseFreq, now);
    osc2.frequency.linearRampToValueAtTime(55, now + 0.5);
    
    osc1.detune.setValueAtTime(-12, now);
    osc2.detune.setValueAtTime(12, now);
    
    // LFO lento para efecto de desintegración/apagado
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(8, now); // Trémolo a 8Hz
    lfoGain.gain.setValueAtTime(15, now);
    
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfoGain.connect(osc2.frequency);
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(audioCtx.destination);
    
    osc1.start(now);
    osc2.start(now);
    lfo.start(now);
    
    osc1.stop(now + 0.55);
    osc2.stop(now + 0.55);
    lfo.stop(now + 0.55);
  } catch (error) {
    console.error("Error playing deactivation sound:", error);
  }
};

// Tonos sintetizados con Web Audio API (Materia Líquida Viviente - Organic/Fluid Sci-Fi)
const playActivationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;
    
    // ─── 1. WHOOSH HÚMEDO (DESPLAZAMIENTO DE FLUIDO) ───
    const sampleRate = audioCtx.sampleRate;
    const duration = 0.5; // Duración total
    const bufferSize = sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buffer;
    
    // Filtro de banda resonante para dar la sensación de "succión viscosa"
    const bandpass = audioCtx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.Q.setValueAtTime(3.5, now);
    // Barrido de frecuencia ascendente grave a medio
    bandpass.frequency.setValueAtTime(90, now);
    bandpass.frequency.exponentialRampToValueAtTime(450, now + 0.35);
    bandpass.frequency.exponentialRampToValueAtTime(150, now + 0.5);
    
    // Filtro pasabajos para redondear el sonido haciéndolo súper cálido y premium
    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(600, now);
    
    // Modulador rápido LFO para dar sensación de turbulencia líquida húmeda
    const fluidLfo = audioCtx.createOscillator();
    const fluidLfoGain = audioCtx.createGain();
    fluidLfo.type = 'sine';
    fluidLfo.frequency.setValueAtTime(24, now); // Trémolo a 24Hz
    fluidLfoGain.gain.setValueAtTime(35, now);
    
    fluidLfo.connect(fluidLfoGain);
    fluidLfoGain.connect(bandpass.frequency);
    
    // Ganancia envolvente del whoosh
    const whooshGain = audioCtx.createGain();
    whooshGain.gain.setValueAtTime(0, now);
    whooshGain.gain.linearRampToValueAtTime(0.22, now + 0.18); // Ataque de succión
    whooshGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5); // Decaimiento
    
    noiseSource.connect(bandpass);
    bandpass.connect(lowpass);
    lowpass.connect(whooshGain);
    whooshGain.connect(audioCtx.destination);
    
    // ─── 2. BURBUJAS VISCOSAS (HIDROGEL / FERROFLUIDO) ───
    const triggerBubble = (startTime: number, startFreq: number, endFreq: number, bubbleVol: number) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, now + startTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + startTime + 0.08); // Ascenso rápido de frecuencia
      
      gainNode.gain.setValueAtTime(0, now + startTime);
      gainNode.gain.linearRampToValueAtTime(bubbleVol, now + startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + startTime + 0.08);
      
      osc.connect(gainNode);
      gainNode.connect(lowpass); // Pasar por el pasabajos para mantener la calidez
      gainNode.connect(audioCtx.destination);
      
      osc.start(now + startTime);
      osc.stop(now + startTime + 0.09);
    };
    
    // Secuencia de burbujas viscosas superpuestas
    triggerBubble(0.02, 160, 320, 0.14);
    triggerBubble(0.08, 200, 380, 0.12);
    triggerBubble(0.15, 140, 290, 0.15);
    triggerBubble(0.24, 220, 420, 0.10);
    triggerBubble(0.32, 170, 340, 0.13);
    
    noiseSource.start(now);
    fluidLfo.start(now);
    
    noiseSource.stop(now + 0.5);
    fluidLfo.stop(now + 0.5);
  } catch (error) {
    console.error("Error playing activation fluid sound:", error);
  }
};

const playDeactivationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;
    
    // Whoosh descendente de disolución húmeda
    const sampleRate = audioCtx.sampleRate;
    const duration = 0.6;
    const bufferSize = sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buffer;
    
    const bandpass = audioCtx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.Q.setValueAtTime(4.0, now);
    // Barrido de frecuencia descendente
    bandpass.frequency.setValueAtTime(400, now);
    bandpass.frequency.exponentialRampToValueAtTime(70, now + 0.55);
    
    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(500, now);
    
    const fluidLfo = audioCtx.createOscillator();
    const fluidLfoGain = audioCtx.createGain();
    fluidLfo.type = 'sine';
    fluidLfo.frequency.setValueAtTime(16, now); // LFO líquido lento
    fluidLfoGain.gain.setValueAtTime(25, now);
    
    fluidLfo.connect(fluidLfoGain);
    fluidLfoGain.connect(bandpass.frequency);
    
    const whooshGain = audioCtx.createGain();
    whooshGain.gain.setValueAtTime(0.18, now);
    whooshGain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);
    
    noiseSource.connect(bandpass);
    bandpass.connect(lowpass);
    lowpass.connect(whooshGain);
    whooshGain.connect(audioCtx.destination);
    
    // Burbujas colapsando descendiendo en tono
    const triggerCollapseBubble = (startTime: number, startFreq: number, endFreq: number, bubbleVol: number) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, now + startTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + startTime + 0.12);
      
      gainNode.gain.setValueAtTime(0, now + startTime);
      gainNode.gain.linearRampToValueAtTime(bubbleVol, now + startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + startTime + 0.12);
      
      osc.connect(gainNode);
      gainNode.connect(lowpass);
      gainNode.connect(audioCtx.destination);
      
      osc.start(now + startTime);
      osc.stop(now + startTime + 0.13);
    };
    
    triggerCollapseBubble(0.05, 280, 130, 0.12);
    triggerCollapseBubble(0.18, 220, 100, 0.10);
    
    noiseSource.start(now);
    fluidLfo.start(now);
    
    noiseSource.stop(now + 0.6);
    fluidLfo.stop(now + 0.6);
  } catch (error) {
    console.error("Error playing deactivation fluid sound:", error);
  }
};
// Tonos sintetizados con Web Audio API (Tecnología Alienígena / Cristal de Energía Sci-Fi)
const playActivationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;
    
    // Filtro analógico pasabajos con resonancia media
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.setValueAtTime(5, now);
    filter.frequency.setValueAtTime(250, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 0.15);
    filter.frequency.exponentialRampToValueAtTime(350, now + 0.4);
    
    // Ganancia general con ataque rápido y decaimiento
    const mainGain = audioCtx.createGain();
    mainGain.gain.setValueAtTime(0, now);
    mainGain.gain.linearRampToValueAtTime(0.16, now + 0.04); 
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
    
    // ─── SÍNTESIS FM (MODULACIÓN DE FRECUENCIA ALIENÍGENA METÁLICA) ───
    const carrier1 = audioCtx.createOscillator();
    const carrier2 = audioCtx.createOscillator();
    carrier1.type = 'sawtooth';
    carrier2.type = 'triangle'; // Mezcla de formas para timbre rico y premium
    
    const baseFreq = 95; // Frecuencia grave profunda
    carrier1.frequency.setValueAtTime(baseFreq, now);
    carrier1.frequency.exponentialRampToValueAtTime(baseFreq * 2.5, now + 0.16); // Ascenso del pulso
    carrier1.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 0.38);
    
    carrier2.frequency.setValueAtTime(baseFreq, now);
    carrier2.frequency.exponentialRampToValueAtTime(baseFreq * 2.5, now + 0.16);
    carrier2.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 0.38);
    
    carrier1.detune.setValueAtTime(-20, now);
    carrier2.detune.setValueAtTime(20, now);
    
    // Modulador FM inarmónico para dar textura cristalina extraterrestre
    const modulator = audioCtx.createOscillator();
    const modulatorGain = audioCtx.createGain();
    modulator.type = 'sine';
    modulator.frequency.setValueAtTime(285, now); // Relación inarmónica ~3:1
    
    // Envolvente de modulación FM
    modulatorGain.gain.setValueAtTime(45, now);
    modulatorGain.gain.exponentialRampToValueAtTime(120, now + 0.12);
    modulatorGain.gain.exponentialRampToValueAtTime(5, now + 0.4);
    
    // LFO rápido para el temblor de motor alienígena (vibrato sci-fi)
    const sciFiLfo = audioCtx.createOscillator();
    const sciFiLfoGain = audioCtx.createGain();
    sciFiLfo.type = 'sine';
    sciFiLfo.frequency.setValueAtTime(32, now); // 32Hz rápido
    sciFiLfoGain.gain.setValueAtTime(15, now);
    
    // Conectar FM
    modulator.connect(modulatorGain);
    modulatorGain.connect(carrier1.frequency);
    modulatorGain.connect(carrier2.frequency);
    
    // Conectar LFO
    sciFiLfo.connect(sciFiLfoGain);
    sciFiLfoGain.connect(carrier1.frequency);
    sciFiLfoGain.connect(carrier2.frequency);
    
    // Conectar audio
    carrier1.connect(filter);
    carrier2.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(audioCtx.destination);
    
    carrier1.start(now);
    carrier2.start(now);
    modulator.start(now);
    sciFiLfo.start(now);
    
    carrier1.stop(now + 0.42);
    carrier2.stop(now + 0.42);
    modulator.stop(now + 0.42);
    sciFiLfo.stop(now + 0.42);
  } catch (error) {
    console.error("Error playing alien activation sound:", error);
  }
};

const playDeactivationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.setValueAtTime(4, now);
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(60, now + 0.5);
    
    const mainGain = audioCtx.createGain();
    mainGain.gain.setValueAtTime(0.18, now);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.52);
    
    const carrier1 = audioCtx.createOscillator();
    const carrier2 = audioCtx.createOscillator();
    carrier1.type = 'triangle';
    carrier2.type = 'sawtooth';
    
    const baseFreq = 160; // Mi3
    carrier1.frequency.setValueAtTime(baseFreq, now);
    carrier1.frequency.linearRampToValueAtTime(40, now + 0.48); // Caída grave
    
    carrier2.frequency.setValueAtTime(baseFreq, now);
    carrier2.frequency.linearRampToValueAtTime(40, now + 0.48);
    
    carrier1.detune.setValueAtTime(-15, now);
    carrier2.detune.setValueAtTime(15, now);
    
    // Modulador FM para el apagado
    const modulator = audioCtx.createOscillator();
    const modulatorGain = audioCtx.createGain();
    modulator.type = 'sine';
    modulator.frequency.setValueAtTime(480, now);
    modulatorGain.gain.setValueAtTime(80, now);
    modulatorGain.gain.exponentialRampToValueAtTime(2, now + 0.48);
    
    const sciFiLfo = audioCtx.createOscillator();
    const sciFiLfoGain = audioCtx.createGain();
    sciFiLfo.type = 'sine';
    sciFiLfo.frequency.setValueAtTime(18, now); // Temblor descendente
    sciFiLfoGain.gain.setValueAtTime(10, now);
    
    modulator.connect(modulatorGain);
    modulatorGain.connect(carrier1.frequency);
    modulatorGain.connect(carrier2.frequency);
    
    sciFiLfo.connect(sciFiLfoGain);
    sciFiLfoGain.connect(carrier1.frequency);
    sciFiLfoGain.connect(carrier2.frequency);
    
    carrier1.connect(filter);
    carrier2.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(audioCtx.destination);
    
    carrier1.start(now);
    carrier2.start(now);
    modulator.start(now);
    sciFiLfo.start(now);
    
    carrier1.stop(now + 0.52);
    carrier2.stop(now + 0.52);
    modulator.stop(now + 0.52);
    sciFiLfo.stop(now + 0.52);
  } catch (error) {
    console.error("Error playing alien deactivation sound:", error);
  }
};
// Tonos sintetizados con Web Audio API (Micro-sonidos de UI/UX de Ciencia Ficción Minimalista)
const playActivationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, now);
    
    // Ganancia minimalista y sutil (duración corta ~0.25s)
    const mainGain = audioCtx.createGain();
    mainGain.gain.setValueAtTime(0, now);
    mainGain.gain.linearRampToValueAtTime(0.08, now + 0.03); // Ataque inmediato y sutil
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25); // Caída rápida
    
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    osc1.type = 'sine';
    osc2.type = 'sine'; // Ondas puras sine para evitar pitidos chillones
    
    const baseFreq = 220; // La3 (cálido)
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 2.0, now + 0.12); // Asciende a La4 (440Hz)
    
    osc2.frequency.setValueAtTime(baseFreq, now);
    osc2.frequency.exponentialRampToValueAtTime(baseFreq * 2.0, now + 0.12);
    
    osc1.detune.setValueAtTime(-8, now);
    osc2.detune.setValueAtTime(8, now); // Coro estéreo sutil
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(audioCtx.destination);
    
    osc1.start(now);
    osc2.start(now);
    
    osc1.stop(now + 0.25);
    osc2.stop(now + 0.25);
  } catch (error) {
    console.error("Error playing activation sound:", error);
  }
};

const playDeactivationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    
    // Tono descendente corto (~0.28s)
    const mainGain = audioCtx.createGain();
    mainGain.gain.setValueAtTime(0.08, now);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    osc1.type = 'sine';
    osc2.type = 'sine';
    
    const baseFreq = 330; // Mi4
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.15); // Desciende a Mi3 (165Hz)
    
    osc2.frequency.setValueAtTime(baseFreq, now);
    osc2.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.15);
    
    osc1.detune.setValueAtTime(-6, now);
    osc2.detune.setValueAtTime(6, now);
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(audioCtx.destination);
    
    osc1.start(now);
    osc2.start(now);
    
    osc1.stop(now + 0.28);
    osc2.stop(now + 0.28);
  } catch (error) {
    console.error("Error playing deactivation sound:", error);
  }
};

// Radar pulse / click sutil para indicar procesamiento de fondo
const playProcessingPulse = (audioCtx: AudioContext) => {
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.12);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.012, now + 0.02); // Volumen extremadamente sutil e imperceptible
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.16);
  } catch (e) {
    console.error(e);
  }
};

  }, [isSpeaking, isLanding, isAdmin, isPatient]);

  // Efecto de pulso de radar / procesamiento en bucle (HUD click)
  useEffect(() => {
    if (isLanding || isAdmin || isPatient) return;
    
    let intervalId: NodeJS.Timeout | null = null;
    let audioCtx: AudioContext | null = null;
    
    if (isLoading && voiceState === 'PROCESSING') {
      try {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Tocar el primer pulso de inmediato
        playProcessingPulse(audioCtx);
        
        // Repetir el pulso rítmicamente cada 1.2 segundos
        intervalId = setInterval(() => {
          if (audioCtx) {
            playProcessingPulse(audioCtx);
          }
        }, 1200);
      } catch (e) {
        console.error("Error starting processing audio loop:", e);
      }
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (audioCtx) {
        try { audioCtx.close(); } catch(e){}
      }
    };
  }, [isLoading, voiceState, isLanding, isAdmin, isPatient]);

  if (isLanding || isAdmin || isPatient) return null;
// Tonos sintetizados con Web Audio API (Activación de Holograma / Sci-Fi Cristalino)
const playActivationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;
    
    // Filtro pasabajos cálido
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, now);
    
    // Ganancia general (ataque rápido y desvanecimiento suave)
    const mainGain = audioCtx.createGain();
    mainGain.gain.setValueAtTime(0, now);
    mainGain.gain.linearRampToValueAtTime(0.12, now + 0.04);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    
    // ─── 1. HAZ DE LUZ HOLOGRÁFICO (WHOOSH CRISTALINO) ───
    const sampleRate = audioCtx.sampleRate;
    const noiseDuration = 0.25;
    const bufferSize = sampleRate * noiseDuration;
    const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buffer;
    
    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.Q.setValueAtTime(4.0, now);
    noiseFilter.frequency.setValueAtTime(600, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(3000, now + 0.15); // Barrido ascendente brillante
    
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.06, now + 0.05);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    
    // ─── 2. DESTELLO CRISTALINO (ACORDE HOLOGRÁFICO EN CASCADA) ───
    const playHoloChirp = (delay: number, freq: number, duration: number, vol: number) => {
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      // Frecuencia subiendo ligeramente (vibración del haz de luz)
      osc.frequency.exponentialRampToValueAtTime(freq * 1.06, now + delay + duration);
      
      oscGain.gain.setValueAtTime(0, now + delay);
      oscGain.gain.linearRampToValueAtTime(vol, now + delay + 0.01);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
      
      osc.connect(oscGain);
      oscGain.connect(filter);
      
      osc.start(now + delay);
      osc.stop(now + delay + duration + 0.02);
    };
    
    // Arpegio Maj7 cristalino ultra-rápido (proyección del holograma)
    playHoloChirp(0.00, 523.25, 0.35, 0.06); // C5
    playHoloChirp(0.03, 659.25, 0.32, 0.06); // E5
    playHoloChirp(0.06, 783.99, 0.28, 0.06); // G5
    playHoloChirp(0.09, 987.77, 0.25, 0.07); // B5
    
    // ─── 3. SUB-BASE DEL PROYECTOR (CÁLIDO Y ESTABLE) ───
    const subOsc = audioCtx.createOscillator();
    const subGain = audioCtx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(110, now);
    subOsc.frequency.linearRampToValueAtTime(80, now + 0.3);
    
    subGain.gain.setValueAtTime(0, now);
    subGain.gain.linearRampToValueAtTime(0.08, now + 0.05);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    subOsc.connect(subGain);
    subGain.connect(audioCtx.destination);
    
    filter.connect(mainGain);
    mainGain.connect(audioCtx.destination);
    
    noiseSource.start(now);
    subOsc.start(now);
    
    noiseSource.stop(now + 0.25);
    subOsc.stop(now + 0.35);
  } catch (error) {
    console.error("Error playing activation hologram sound:", error);
  }
};

const playDeactivationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, now);
    filter.frequency.exponentialRampToValueAtTime(80, now + 0.35); // Colapso de frecuencia
    
    const mainGain = audioCtx.createGain();
    mainGain.gain.setValueAtTime(0.12, now);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    // Whoosh de colapso de luz del holograma
    const sampleRate = audioCtx.sampleRate;
    const noiseDuration = 0.3;
    const bufferSize = sampleRate * noiseDuration;
    const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buffer;
    
    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.Q.setValueAtTime(3.0, now);
    noiseFilter.frequency.setValueAtTime(2000, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(200, now + 0.25); // Barrido descendente
    
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.06, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    
    // Arpegio descendente cristalino (desvanecimiento del holograma)
    const playHoloDecay = (delay: number, freq: number, duration: number, vol: number) => {
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.92, now + delay + duration);
      
      oscGain.gain.setValueAtTime(vol, now + delay);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
      
      osc.connect(oscGain);
      oscGain.connect(filter);
      
      osc.start(now + delay);
      osc.stop(now + delay + duration + 0.02);
    };
    
    playHoloDecay(0.00, 987.77, 0.25, 0.07); // B5
    playHoloDecay(0.03, 783.99, 0.22, 0.06); // G5
    playHoloDecay(0.06, 659.25, 0.18, 0.06); // E5
    playHoloDecay(0.09, 523.25, 0.15, 0.06); // C5
    
    filter.connect(mainGain);
    mainGain.connect(audioCtx.destination);
    
    noiseSource.start(now);
    noiseSource.stop(now + 0.3);
  } catch (error) {
    console.error("Error playing deactivation hologram sound:", error);
  }
};

// Radar pulse / click sutil para indicar procesamiento de fondo
const playProcessingPulse = (audioCtx: AudioContext) => {
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.12);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.012, now + 0.02); // Volumen extremadamente sutil
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.16);
  } catch (e) {
    console.error(e);
  }
};
// Tonos sintetizados con Web Audio API (Activación de Holograma Cinematográfico - Hi-Fi y Duración Extendida)
const playActivationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;
    
    // Filtro maestro pasabajos cálido
    const masterFilter = audioCtx.createBiquadFilter();
    masterFilter.type = 'lowpass';
    masterFilter.frequency.setValueAtTime(3000, now);
    masterFilter.frequency.exponentialRampToValueAtTime(1500, now + 1.2);
    
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(1.0, now);
    
    masterFilter.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    // ─── FASE 1: ACUMULACIÓN DE ENERGÍA / CARGA (0.0s - 0.4s) ───
    const sampleRate = audioCtx.sampleRate;
    const noiseDuration = 0.45;
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
    noiseFilter.frequency.setValueAtTime(150, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(2000, now + 0.4); // Carga ascendente
    
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.09, now + 0.35);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterFilter);

    // Sub-base ascendente de carga
    const chargeOsc = audioCtx.createOscillator();
    const chargeGain = audioCtx.createGain();
    chargeOsc.type = 'triangle';
    chargeOsc.frequency.setValueAtTime(60, now);
    chargeOsc.frequency.exponentialRampToValueAtTime(160, now + 0.4);
    
    chargeGain.gain.setValueAtTime(0, now);
    chargeGain.gain.linearRampToValueAtTime(0.12, now + 0.35);
    chargeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
    
    chargeOsc.connect(chargeGain);
    chargeGain.connect(masterFilter);
    
    chargeOsc.start(now);
    chargeOsc.stop(now + 0.43);
    noiseSource.start(now);
    noiseSource.stop(now + 0.45);

    // ─── FASE 2: IGNICIÓN Y ESTABILIZACIÓN HOLOGRÁFICA (0.4s - 1.5s) ───
    const triggerHoloTone = (startTime: number, freq: number, duration: number, vol: number) => {
      const carrier = audioCtx.createOscillator();
      const carrierGain = audioCtx.createGain();
      carrier.type = 'sine';
      carrier.frequency.setValueAtTime(freq, now + startTime);
      carrier.frequency.linearRampToValueAtTime(freq * 1.01, now + startTime + duration);
      
      // Modulador FM inarmónico para dar brillo metálico cristalino premium
      const fmMod = audioCtx.createOscillator();
      const fmGain = audioCtx.createGain();
      fmMod.type = 'sine';
      fmMod.frequency.setValueAtTime(freq * 1.5, now + startTime); // Relación de 1.5
      
      fmGain.gain.setValueAtTime(vol * 80, now + startTime);
      fmGain.gain.exponentialRampToValueAtTime(vol * 5, now + startTime + duration);
      
      fmMod.connect(fmGain);
      fmGain.connect(carrier.frequency);
      
      // Envolvente de volumen (ataque rápido y decaimiento largo con cola)
      carrierGain.gain.setValueAtTime(0, now + startTime);
      carrierGain.gain.linearRampToValueAtTime(vol, now + startTime + 0.02);
      carrierGain.gain.exponentialRampToValueAtTime(0.001, now + startTime + duration);
      
      carrier.connect(carrierGain);
      carrierGain.connect(masterFilter);
      
      carrier.start(now + startTime);
      fmMod.start(now + startTime);
      
      carrier.stop(now + startTime + duration + 0.02);
      fmMod.stop(now + startTime + duration + 0.02);
    };

    // Disparar acorde de Do mayor novena (CMaj9) a los 0.4 segundos (duración de la cola: 1.1s)
    const holoStart = 0.4;
    triggerHoloTone(holoStart, 523.25, 1.1, 0.06);     // C5
    triggerHoloTone(holoStart + 0.02, 659.25, 1.0, 0.05); // E5
    triggerHoloTone(holoStart + 0.04, 783.99, 0.9, 0.05); // G5
    triggerHoloTone(holoStart + 0.06, 987.77, 0.8, 0.05); // B5
    triggerHoloTone(holoStart + 0.08, 1174.66, 0.7, 0.04); // D6 (Brillo holográfico premium)
    
    // Zumbido (Hum) constante del proyector holográfico
    const humOsc = audioCtx.createOscillator();
    const humGain = audioCtx.createGain();
    humOsc.type = 'triangle';
    humOsc.frequency.setValueAtTime(110, now + holoStart);
    
    // Trémolo lento para el Hum del proyector
    const tremolo = audioCtx.createOscillator();
    const tremoloGain = audioCtx.createGain();
    tremolo.type = 'sine';
    tremolo.frequency.setValueAtTime(5, now + holoStart); // 5Hz
    tremoloGain.gain.setValueAtTime(0.02, now + holoStart);
    
    tremolo.connect(tremoloGain);
    tremoloGain.connect(humGain.gain);
    
    humGain.gain.setValueAtTime(0, now + holoStart);
    humGain.gain.linearRampToValueAtTime(0.07, now + holoStart + 0.05);
    humGain.gain.exponentialRampToValueAtTime(0.001, now + holoStart + 1.1);
    
    humOsc.connect(humGain);
    humGain.connect(masterFilter);
    
    humOsc.start(now + holoStart);
    tremolo.start(now + holoStart);
    
    humOsc.stop(now + holoStart + 1.2);
    tremolo.stop(now + holoStart + 1.2);
  } catch (error) {
    console.error("Error playing cinema hologram activation sound:", error);
  }
};

const playDeactivationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;
    
    const masterFilter = audioCtx.createBiquadFilter();
    masterFilter.type = 'lowpass';
    masterFilter.frequency.setValueAtTime(2000, now);
    masterFilter.frequency.exponentialRampToValueAtTime(100, now + 1.2);
    
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(1.0, now);
    
    masterFilter.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    // Whoosh de colapso de partículas
    const sampleRate = audioCtx.sampleRate;
    const noiseDuration = 0.5;
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
    noiseFilter.Q.setValueAtTime(3.5, now);
    noiseFilter.frequency.setValueAtTime(2500, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(80, now + 0.45); // Colapso de frecuencia
    
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.08, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
    
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterFilter);
    
    // Notas descendentes y colapsando
    const playHoloDecay = (delay: number, freq: number, duration: number, vol: number) => {
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + delay + 0.35); // Colapso de pitch
      
      oscGain.gain.setValueAtTime(vol, now + delay);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
      
      osc.connect(oscGain);
      oscGain.connect(masterFilter);
      
      osc.start(now + delay);
      osc.stop(now + delay + duration + 0.02);
    };
    
    playHoloDecay(0.00, 1174.66, 0.4, 0.05); // D6
    playHoloDecay(0.02, 987.77, 0.45, 0.05); // B5
    playHoloDecay(0.04, 783.99, 0.5, 0.05);  // G5
    playHoloDecay(0.06, 659.25, 0.55, 0.05);  // E5
    playHoloDecay(0.08, 523.25, 0.6, 0.06);   // C5

    // Sub-hum descendente de colapso
    const humOsc = audioCtx.createOscillator();
    const humGain = audioCtx.createGain();
    humOsc.type = 'triangle';
    humOsc.frequency.setValueAtTime(110, now);
    humOsc.frequency.linearRampToValueAtTime(45, now + 0.8);
    
    humGain.gain.setValueAtTime(0.10, now);
    humGain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);
    
    humOsc.connect(humGain);
    humGain.connect(masterFilter);
    
    humOsc.start(now);
    noiseSource.start(now);
    
    humOsc.stop(now + 1.0);
    noiseSource.stop(now + 0.5);
  } catch (error) {
    console.error("Error playing cinema hologram deactivation sound:", error);
  }
};

// Radar pulse / click sutil para indicar procesamiento de fondo
const playProcessingPulse = (audioCtx: AudioContext) => {
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.12);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.012, now + 0.02); // Volumen extremadamente sutil
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.16);
  } catch (e) {
    console.error(e);
  }
};
// Tonos sintetizados con Web Audio API (Acumulación y Descenso de Energía - Sci-Fi Físico y Sobrio)
const playActivationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;
    
    // Filtro maestro pasabajos para eliminar frecuencias altas chillonas (corte a 600Hz máximo)
    const masterFilter = audioCtx.createBiquadFilter();
    masterFilter.type = 'lowpass';
    masterFilter.frequency.setValueAtTime(600, now);
    
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.75, now);
    
    masterFilter.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    // ─── 1. ACUMULACIÓN DE ENERGÍA (0.0s - 0.8s) ───
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'triangle';
    
    // Pitch sweep ascendente sobrio en el rango grave (55Hz a 125Hz)
    osc1.frequency.setValueAtTime(55, now);
    osc1.frequency.exponentialRampToValueAtTime(125, now + 0.8);
    
    osc2.frequency.setValueAtTime(55, now);
    osc2.frequency.exponentialRampToValueAtTime(125, now + 0.8);
    
    osc1.detune.setValueAtTime(-15, now);
    osc2.detune.setValueAtTime(15, now); // Desafinación para ensanchar el sonido
    
    // Filtro local resonante
    const energyFilter = audioCtx.createBiquadFilter();
    energyFilter.type = 'lowpass';
    energyFilter.Q.setValueAtTime(4.0, now);
    energyFilter.frequency.setValueAtTime(120, now);
    energyFilter.frequency.exponentialRampToValueAtTime(480, now + 0.8);
    
    const energyGain = audioCtx.createGain();
    energyGain.gain.setValueAtTime(0, now);
    energyGain.gain.linearRampToValueAtTime(0.18, now + 0.78);
    
    osc1.connect(energyFilter);
    osc2.connect(energyFilter);
    energyFilter.connect(energyGain);
    energyGain.connect(masterFilter);

    // Ruido denso de acumulación de partículas
    const sampleRate = audioCtx.sampleRate;
    const noiseDuration = 0.9;
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
    noiseFilter.Q.setValueAtTime(6.0, now);
    noiseFilter.frequency.setValueAtTime(90, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(450, now + 0.8);
    
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.10, now + 0.75);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterFilter);

    // ─── 2. VIBRACIÓN DE LA ENERGÍA ACUMULADA (0.8s - 1.4s) ───
    // LFO rápido para modular el pitch al final (vibración eléctrica)
    const vibrationLfo = audioCtx.createOscillator();
    const vibrationGain = audioCtx.createGain();
    vibrationLfo.type = 'sine';
    vibrationLfo.frequency.setValueAtTime(42, now); // Vibración rápida de 42Hz
    
    vibrationGain.gain.setValueAtTime(0, now);
    vibrationGain.gain.setValueAtTime(0, now + 0.78);
    vibrationGain.gain.linearRampToValueAtTime(20, now + 0.85); // Entra tras completarse la carga
    
    vibrationLfo.connect(vibrationGain);
    vibrationGain.connect(osc1.frequency);
    vibrationGain.connect(osc2.frequency);
    
    // Trémolo sobre el volumen final de la vibración
    const tremolo = audioCtx.createOscillator();
    const tremoloGain = audioCtx.createGain();
    tremolo.type = 'sine';
    tremolo.frequency.setValueAtTime(8, now); // Oscilación de volumen a 8Hz
    tremoloGain.gain.setValueAtTime(0.06, now);
    
    tremolo.connect(tremoloGain);
    tremoloGain.connect(energyGain.gain);

    // Fade-out exponencial de la energía vibrante
    energyGain.gain.setValueAtTime(0.18, now + 0.8);
    energyGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    osc1.start(now);
    osc2.start(now);
    noiseSource.start(now);
    vibrationLfo.start(now);
    tremolo.start(now);
    
    osc1.stop(now + 1.42);
    osc2.stop(now + 1.42);
    noiseSource.stop(now + 0.9);
    vibrationLfo.stop(now + 1.42);
    tremolo.stop(now + 1.42);
  } catch (error) {
    console.error("Error playing energy activation sound:", error);
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
    masterGain.gain.setValueAtTime(0.7, now);
    
    masterFilter.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    // Descendente de energía sub-grave
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'triangle';
    
    // Pitch sweep descendente grave (125Hz a 45Hz)
    osc1.frequency.setValueAtTime(125, now);
    osc1.frequency.exponentialRampToValueAtTime(45, now + 0.7);
    
    osc2.frequency.setValueAtTime(125, now);
    osc2.frequency.exponentialRampToValueAtTime(45, now + 0.7);
    
    osc1.detune.setValueAtTime(-15, now);
    osc2.detune.setValueAtTime(15, now);
    
    const energyFilter = audioCtx.createBiquadFilter();
    energyFilter.type = 'lowpass';
    energyFilter.frequency.setValueAtTime(450, now);
    energyFilter.frequency.exponentialRampToValueAtTime(80, now + 0.7);
    
    const energyGain = audioCtx.createGain();
    energyGain.gain.setValueAtTime(0.18, now);
    energyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
    
    osc1.connect(energyFilter);
    osc2.connect(energyFilter);
    energyFilter.connect(energyGain);
    energyGain.connect(masterFilter);

    // Whoosh descendente de despresurización
    const sampleRate = audioCtx.sampleRate;
    const noiseDuration = 0.7;
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
    noiseFilter.frequency.exponentialRampToValueAtTime(80, now + 0.65);
    
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.09, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterFilter);
    
    osc1.start(now);
    osc2.start(now);
    noiseSource.start(now);
    
    osc1.stop(now + 0.76);
    osc2.stop(now + 0.76);
    noiseSource.stop(now + 0.7);
  } catch (error) {
    console.error("Error playing energy deactivation sound:", error);
  }
};
// Tonos sintetizados con Web Audio API (Carga y Descenso de Energía Espacial - Sci-Fi Premium de Alta Calidad)
const playActivationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;
    
    // Filtro maestro pasabajos cálido (corte a 800Hz para mantener cuerpo y evitar siseos)
    const masterFilter = audioCtx.createBiquadFilter();
    masterFilter.type = 'lowpass';
    masterFilter.frequency.setValueAtTime(800, now);
    
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.85, now);
    
    masterFilter.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    // ─── EFECTO ESPACIAL / CHORUS DE ALTA CALIDAD (DELAY + RETROALIMENTACIÓN) ───
    // Genera grosor y amplitud de sonido para que "llene" todo el campo estéreo y no suene barato/plano
    const delayNode = audioCtx.createDelay(0.1);
    const feedbackGain = audioCtx.createGain();
    delayNode.delayTime.setValueAtTime(0.018, now); // Retardo de 18ms
    feedbackGain.gain.setValueAtTime(0.45, now);   // 45% retroalimentación
    
    delayNode.connect(feedbackGain);
    feedbackGain.connect(delayNode); // Bucle
    
    // Conectar el delay en paralelo
    delayNode.connect(masterFilter);

    // ─── 1. CARGA RÁPIDA DE ENERGÍA (0.0s - 0.45s) ───
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const oscTriangle = audioCtx.createOscillator();
    
    osc1.type = 'sine';
    osc2.type = 'sine';
    oscTriangle.type = 'triangle';
    
    // Pitch sweep ascendente rápido y denso (de 65Hz a 170Hz)
    const startFreq = 65;
    const endFreq = 170;
    osc1.frequency.setValueAtTime(startFreq, now);
    osc1.frequency.exponentialRampToValueAtTime(endFreq, now + 0.45);
    
    osc2.frequency.setValueAtTime(startFreq, now);
    osc2.frequency.exponentialRampToValueAtTime(endFreq, now + 0.45);
    
    oscTriangle.frequency.setValueAtTime(startFreq, now);
    oscTriangle.frequency.exponentialRampToValueAtTime(endFreq, now + 0.45);
    
    // Desafinación estéreo (grosor armónico premium)
    osc1.detune.setValueAtTime(-20, now);
    osc2.detune.setValueAtTime(20, now);
    oscTriangle.detune.setValueAtTime(5, now);
    
    // Filtro local resonante
    const localFilter = audioCtx.createBiquadFilter();
    localFilter.type = 'lowpass';
    localFilter.Q.setValueAtTime(3.0, now);
    localFilter.frequency.setValueAtTime(140, now);
    localFilter.frequency.exponentialRampToValueAtTime(550, now + 0.45);
    
    const energyGain = audioCtx.createGain();
    energyGain.gain.setValueAtTime(0, now);
    energyGain.gain.linearRampToValueAtTime(0.24, now + 0.42); // Ataque rápido de energía
    
    osc1.connect(localFilter);
    osc2.connect(localFilter);
    oscTriangle.connect(localFilter);
    localFilter.connect(energyGain);
    
    // Conectar tanto a master directo como al procesador espacial en paralelo
    energyGain.connect(masterFilter);
    energyGain.connect(delayNode);

    // Whoosh de partículas aéreas
    const sampleRate = audioCtx.sampleRate;
    const noiseDuration = 0.55;
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
    noiseFilter.frequency.setValueAtTime(120, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(500, now + 0.45);
    
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.08, now + 0.4);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterFilter);
    noiseGain.connect(delayNode);

    // ─── 2. VIBRACIÓN DE LA ENERGÍA (0.45s - 1.1s) ───
    // LFO que modula el pitch para dar vibración sónica / eléctrica
    const vibrationLfo = audioCtx.createOscillator();
    const vibrationGain = audioCtx.createGain();
    vibrationLfo.type = 'sine';
    vibrationLfo.frequency.setValueAtTime(36, now); // Vibración a 36Hz
    vibrationGain.gain.setValueAtTime(0, now);
    vibrationGain.gain.setValueAtTime(0, now + 0.43);
    vibrationGain.gain.linearRampToValueAtTime(18, now + 0.5); // Comienza al terminar la carga
    
    vibrationLfo.connect(vibrationGain);
    vibrationGain.connect(osc1.frequency);
    vibrationGain.connect(osc2.frequency);
    vibrationGain.connect(oscTriangle.frequency);
    
    // Trémolo sobre el volumen final de la vibración
    const tremolo = audioCtx.createOscillator();
    const tremoloGain = audioCtx.createGain();
    tremolo.type = 'sine';
    tremolo.frequency.setValueAtTime(7, now); // Oscilación de volumen a 7Hz
    tremoloGain.gain.setValueAtTime(0.05, now);
    
    tremolo.connect(tremoloGain);
    tremoloGain.connect(energyGain.gain);

    // Decaimiento asintótico curvo de alta calidad para evitar cortes y "pops" baratos
    energyGain.gain.setValueAtTime(0.24, now + 0.45);
    energyGain.gain.setTargetAtTime(0, now + 0.5, 0.16); // Decae de forma natural y ultra-suave

    osc1.start(now);
    osc2.start(now);
    oscTriangle.start(now);
    noiseSource.start(now);
    vibrationLfo.start(now);
    tremolo.start(now);
    
    osc1.stop(now + 1.25);
    osc2.stop(now + 1.25);
    oscTriangle.stop(now + 1.25);
    noiseSource.stop(now + 0.6);
    vibrationLfo.stop(now + 1.25);
    tremolo.stop(now + 1.25);
  } catch (error) {
    console.error("Error playing energy activation sound:", error);
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
    console.error("Error playing energy deactivation sound:", error);
  }
};
// Tonos sintetizados con Web Audio API (Carga y Descenso de Energía Espacial - Sci-Fi Premium de Alta Calidad)
const playActivationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;
    
    // Filtro maestro pasabajos idéntico para calidez
    const masterFilter = audioCtx.createBiquadFilter();
    masterFilter.type = 'lowpass';
    masterFilter.frequency.setValueAtTime(500, now);
    
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.75, now);
    
    masterFilter.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    // Procesador espacial (Delay) idéntico para fluidez estéreo y amplitud
    const delayNode = audioCtx.createDelay(0.1);
    const feedbackGain = audioCtx.createGain();
    delayNode.delayTime.setValueAtTime(0.018, now);
    feedbackGain.gain.setValueAtTime(0.4, now); // Retroalimentación idéntica
    delayNode.connect(feedbackGain);
    feedbackGain.connect(delayNode);
    delayNode.connect(masterFilter);

    // Osciladores idénticos de alta calidad (2 sine + 1 triangle)
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
    
    const localFilter = audioCtx.createBiquadFilter();
    localFilter.type = 'lowpass';
    localFilter.frequency.setValueAtTime(120, now);
    localFilter.frequency.exponentialRampToValueAtTime(500, now + 0.6);
    
    // Ganancia envolvente idéntica y no saturada
    const energyGain = audioCtx.createGain();
    energyGain.gain.setValueAtTime(0, now);
    energyGain.gain.linearRampToValueAtTime(0.24, now + 0.08); // Ataque de 80ms
    energyGain.gain.setTargetAtTime(0, now + 0.12, 0.18); // Decaimiento asintótico súper fluido
    
    osc1.connect(localFilter);
    osc2.connect(localFilter);
    oscTriangle.connect(localFilter);
    localFilter.connect(energyGain);
    
    energyGain.connect(masterFilter);
    energyGain.connect(delayNode);

    // Ruido de partículas muy atenuado idéntico al de desactivación
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
    noiseFilter.frequency.setValueAtTime(80, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(450, now + 0.55);
    
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.06, now + 0.08);
    noiseGain.gain.setTargetAtTime(0, now + 0.12, 0.15);
    
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
    console.error("Error playing energy activation sound:", error);
  }
};
// Tonos sintetizados con Web Audio API (Carga y Descenso de Energía Espacial - Sci-Fi Premium de Alta Calidad)
const playActivationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;
    
    // Filtro maestro pasabajos idéntico para calidez
    const masterFilter = audioCtx.createBiquadFilter();
    masterFilter.type = 'lowpass';
    masterFilter.frequency.setValueAtTime(500, now);
    
    // Bajamos la ganancia master a 0.50 (de 0.75) para evitar saturación digital
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.50, now);
    
    masterFilter.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    // Procesador espacial (Delay) idéntico para fluidez estéreo y amplitud
    const delayNode = audioCtx.createDelay(0.1);
    const feedbackGain = audioCtx.createGain();
    delayNode.delayTime.setValueAtTime(0.018, now);
    feedbackGain.gain.setValueAtTime(0.35, now); // Retroalimentación controlada
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
    
    // Filtro local plano (Q=1.0) para evitar picos resonantes que saturan al subir de frecuencia
    const localFilter = audioCtx.createBiquadFilter();
    localFilter.type = 'lowpass';
    localFilter.Q.setValueAtTime(1.0, now);
    localFilter.frequency.setValueAtTime(120, now);
    localFilter.frequency.exponentialRampToValueAtTime(500, now + 0.6);
    
    // Bajamos la ganancia de energía a 0.12 (de 0.24) para eliminar distorsión
    const energyGain = audioCtx.createGain();
    energyGain.gain.setValueAtTime(0, now);
    energyGain.gain.linearRampToValueAtTime(0.12, now + 0.08); // Ataque de 80ms
    energyGain.gain.setTargetAtTime(0, now + 0.12, 0.18); // Decaimiento asintótico súper fluido
    
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
    console.error("Error playing energy activation sound:", error);
  }
};
  } catch (error) {
    console.error("Error playing energy activation sound:", error);
  }
};
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
    console.error("Error playing energy activation sound:", error);
  }
};
      {/* ── Burbuja / Barra de Chat Expandible ── */}
      <motion.div
        initial={false}
        animate={isChatOpen ? {
          width:        isMobile ? "calc(100vw - 32px)" : 480,
          height:       64,
          borderRadius: 32,
          y: 0,
          x: 0,
        } : {
          width: isDexActive ? 110 : 96,
          height: isDexActive ? 110 : 96,
          borderRadius: isDexActive ? 55 : 48,
          y: [0, -6, 0],
          x: [0, 3, -3, 0],
          transition: {
            y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
            x: { repeat: Infinity, duration: 7, ease: "easeInOut" }
          }
        }}
        whileHover={!isChatOpen ? {
          scale: 1.05,
          boxShadow: isDexActive 
            ? "0 0 35px rgba(147,51,234,0.5)"
            : "0 15px 35px rgba(0,0,0,0.12)",
        } : undefined}
        whileTap={!isChatOpen ? { scale: 0.96 } : undefined}
        transition={isChatOpen ? { type: "spring", stiffness: 140, damping: 20 } : { type: "tween", ease: "easeInOut" }}
        className={`fixed z-[9999] flex items-center cursor-pointer transition-shadow duration-300 ${
          isChatOpen
            ? "bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-100 p-1"
            : isDexActive
              ? "bg-transparent shadow-[0_0_30px_rgba(147,51,234,0.4)] border border-purple-500/10"
              : "bg-transparent shadow-[0_10px_30px_rgba(0,0,0,0.08)] border-none"
        }`}
        style={{
          right:  isMobile ? 16 : 48,
          bottom: isMobile ? 24 : 24,
        }}
        onClick={() => {
          if (!isChatOpen) setIsChatOpen(true);
        }}
      >
        {/* Orbe de DEX */}
        <motion.div
          onClick={(e) => {
            if (isChatOpen) {
              e.stopPropagation();
              setIsChatOpen(false);
              setResponseMessage(null);
            }
          }}
          className="rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-transparent border-none shadow-none transition-all duration-300"
          style={{
            width:  isChatOpen ? 56 : isDexActive ? 102 : 88,
            height: isChatOpen ? 56 : isDexActive ? 102 : 88,
          }}
        >
          <video
            src="/logos/Dentaxy AI.mp4"
            autoPlay
            muted
            playsInline
            loop
            className={`w-full h-full object-cover scale-[1.06] select-none pointer-events-none ${isChatOpen ? '' : 'mix-blend-multiply'}`}
          />
        </motion.div>
      {/* ── Burbuja / Barra de Chat Expandible — idéntica al paso 4 de Insights ── */}
      <motion.div
        initial={false}
        animate={isChatOpen ? {
          width:        isMobile ? "calc(100vw - 32px)" : 480,
          height:       64,
          borderRadius: 32,
          y: 0,
          x: 0,
        } : {
          width: isDexActive ? 110 : 96,
          height: isDexActive ? 110 : 96,
          borderRadius: isDexActive ? 55 : 48,
          y: [0, -6, 0],
          x: [0, 3, 0, -3, 0],
          transition: {
            y: {
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut"
            },
            x: {
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut"
            }
          }
        }}
        whileHover={!isChatOpen ? {
          scale: 1.06,
          boxShadow: isDexActive 
            ? "0 0 45px rgba(147,51,234,0.65), 0 20px 48px rgba(0,0,0,0.25)"
            : "0 20px 48px rgba(0,0,0,0.18)",
          filter: "brightness(1.05)",
        } : undefined}
        whileTap={!isChatOpen ? { scale: 0.96 } : undefined}
        transition={isChatOpen ? { type: "spring", stiffness: 140, damping: 20 } : { type: "tween", ease: "easeInOut" }}
        className={`fixed z-[9999] flex items-center cursor-pointer transition-shadow duration-300 ${
          isChatOpen
            ? "bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-100 p-1"
            : isDexActive
              ? "bg-transparent shadow-[0_0_35px_rgba(147,51,234,0.45)] border border-purple-500/20"
              : "bg-transparent p-0"
        }`}
        style={{
          right:  isMobile ? 16 : 48,
          bottom: isMobile ? 24 : 24,
        }}
        onClick={() => {
          if (!isChatOpen) setIsChatOpen(true);
        }}
      >
        {/* Halo de Luz Negra / Ultravioleta por detrás */}
        {isDexActive && !isChatOpen && (
          <div className="absolute inset-0 rounded-full bg-purple-950/35 blur-[22px] scale-[1.3] animate-pulse -z-10 pointer-events-none" />
        )}

        {/* Orbe de DEX */}
        <motion.div
          onClick={(e) => {
            if (isChatOpen) {
              e.stopPropagation();
              setIsChatOpen(false);
              setResponseMessage(null);
            }
          }}
          className="rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-transparent border-none shadow-none transition-all duration-300"
          style={{
            width:  isChatOpen ? 56 : isDexActive ? 102 : 88,
            height: isChatOpen ? 56 : isDexActive ? 102 : 88,
          }}
        >
          <video
            src="/logos/Dentaxy AI.mp4"
            autoPlay
            muted
            playsInline
            loop
            className="w-full h-full object-cover scale-[1.3] select-none pointer-events-none"
          />
        </motion.div>
