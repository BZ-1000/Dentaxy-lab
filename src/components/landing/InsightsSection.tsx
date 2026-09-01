import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Search } from "lucide-react";
import { motion, useMotionValue } from "framer-motion";
import { AppleTypewriter } from "@/components/ui/AppleTypewriter";
import { chatWithAgent } from "@/services/gemini";

export const InsightsSection = ({ mainRef }: { mainRef?: React.RefObject<HTMLDivElement> } = {}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight > window.innerWidth
  );

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // MotionValues del orbe — posición y tamaño controlados por scroll sin re-render de React
  const orbTop = useMotionValue("100%");
  const orbLeft = useMotionValue("50%");
  const orbTransformY = useMotionValue("-38%");
  const orbSize = useMotionValue(360); // px — inicializado en el tamaño base para móviles

  // Estado para controlar cuándo inicia la animación de escritura
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const typingStartedRef = useRef(false);

  // --- Estados de Onboarding ---
  const [step, setStep] = useState(0); // 0: Bienvenidos/Soy DEX, 1: Perfil, 2: Sistema, 3: Prioridad, 4: Completado
  const [answers, setAnswers] = useState<{
    role?: string;
    currentSystem?: string;
    priority?: string;
  }>({});

  // --- Estados de la IA en el Panel Derecho (Recomendados) ---
  const [iaTag, setIaTag] = useState("Seguridad");
  const [iaTitle, setIaTitle] = useState("Por qué YubiKey y el control por proximidad definen el futuro de los expedientes VIP en México");
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [featuredImage, setFeaturedImage] = useState("/lovable-uploads/dentist_avatar.png");
  const [featuredLink, setFeaturedLink] = useState("#");
  const [recomendadosList, setRecomendadosList] = useState<any[]>([]);
  
  // --- Estados del Chat Flotante (ChatGPT Style) ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");

  // Datos de las preguntas de Onboarding
  const onboardingSteps = [
    {
      tag: "AGENTE DEX",
      title: "Soy DEX 👋",
      btnText: "Guiarme en Dentaxy →"
    },
    {
      tag: "Pregunta 1 de 3",
      title: "¿En qué etapa estás dentro de la odontología?",
      btnText: "Reiniciar diagnóstico",
      options: [
        {
          cat: "Perfil Profesional",
          title: "🎓 Estudiante",
          desc: ""
        },
        {
          cat: "Perfil Profesional",
          title: "🦷 Odontólogo",
          desc: ""
        },
        {
          cat: "Perfil Profesional",
          title: "🏥 Clínica o Univ.",
          desc: ""
        }
      ]
    },
    {
      tag: "Pregunta 2 de 3",
      title: "¿Cómo manejas hoy la información de tus pacientes?",
      btnText: "Reiniciar diagnóstico",
      options: [
        {
          cat: "Método Actual",
          title: "📝 Papel Físico",
          desc: ""
        },
        {
          cat: "Método Actual",
          title: "💻 Excel / Word",
          desc: ""
        },
        {
          cat: "Método Actual",
          title: "⚙️ Otro Software",
          desc: ""
        }
      ]
    },
    {
      tag: "Pregunta 3 de 3",
      title: "¿Qué te gustaría mejorar primero en tu práctica?",
      btnText: "Reiniciar diagnóstico",
      options: [
        {
          cat: "Prioridad Técnica",
          title: "⚡ Rapidez",
          desc: ""
        },
        {
          cat: "Prioridad Técnica",
          title: "🛡️ Control",
          desc: ""
        },
        {
          cat: "Prioridad Técnica",
          title: "🔍 Diagnóstico",
          desc: ""
        }
      ]
    },
    {
      tag: "Diagnóstico Listo",
      title: "Perfecto. He configurado tus recomendaciones basadas en tu perfil clínico.",
      btnText: "Volver a diagnosticar"
    }
  ];

  useEffect(() => {
    const mainElement = document.querySelector("main");
    if (!mainElement) return;

    const handleScroll = () => {
      const scrollTop = mainElement.scrollTop;
      const clientHeight = mainElement.clientHeight || window.innerHeight;
      const progress = Math.min(Math.max(scrollTop / clientHeight, 0), 1);

      // ─── Orbe ───
      const op = Math.min(progress / 0.8, 1);
      const currentIsPortrait = window.innerHeight > window.innerWidth;
      const isMd = window.innerWidth >= 768;

      if (currentIsPortrait) {
        // En pantallas verticales, el orbe se mantiene centrado horizontalmente
        orbLeft.set("50%");
        // Sube un poco más para no tapar los textos inferiores
        orbTop.set(`${100 - op * 75}%`);
        orbTransformY.set(`${-38 - op * 4}%`);

        // Tamaño del orbe en vertical: más pequeño para evitar interferencias
        const startSize = Math.min(window.innerWidth * 0.6, 280);
        const endSize = Math.min(window.innerWidth * 0.7, 340);
        orbSize.set(startSize + op * (endSize - startSize));
      } else {
        // En pantallas horizontales (desktop / landscape)
        orbLeft.set(`${50 + op * 25}%`);
        orbTop.set(`${100 - op * 50}%`);
        orbTransformY.set(`${-38 - op * 12}%`);

        const startSize = isMd ? 360 : 280;
        const endSize   = isMd ? 420 : 320;
        orbSize.set(startSize + op * (endSize - startSize));
      }

      // Trigger de animación cuando pasamos del 25% de la transición
      if (progress > 0.25) {
        if (!typingStartedRef.current) {
          typingStartedRef.current = true;
          setHasStartedTyping(true);
        }
      } else if (progress < 0.05) {
        // Reset al hacer scroll hacia arriba del todo para que se repita la experiencia
        if (typingStartedRef.current) {
          typingStartedRef.current = false;
          setHasStartedTyping(false);
          handleResetDiagnostic();
        }
      }
    };

    handleScroll();
    mainElement.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      mainElement.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [orbTop, orbLeft, orbTransformY, orbSize]);

  // Manejo de la selección de opciones de onboarding
  const handleCardClick = async (idx: number) => {
    let updatedAnswers = { ...answers };
    if (step === 1) {
      const selected = idx === 0 ? "estudiante" : idx === 1 ? "odontologo" : "clinica";
      updatedAnswers = { ...answers, role: selected };
      setAnswers(updatedAnswers);
      setStep(2);
    } else if (step === 2) {
      const selected = idx === 0 ? "papel" : idx === 1 ? "digital_basico" : "software_tercero";
      updatedAnswers = { ...answers, currentSystem: selected };
      setAnswers(updatedAnswers);
      setStep(3);
    } else if (step === 3) {
      const selected = idx === 0 ? "redaccion" : idx === 1 ? "privacidad" : "tecnologia";
      updatedAnswers = { ...answers, priority: selected };
      setAnswers(updatedAnswers);
      setStep(4);

      // Configurar imagen destacada y enlace de destino según prioridad
      if (selected === "redaccion") {
        setFeaturedImage("/logos/seed_preview.png");
        setFeaturedLink("/seed");
      } else if (selected === "privacidad") {
        setFeaturedImage("/logos/drive_preview.png");
        setFeaturedLink("/hub");
      } else {
        setFeaturedImage("/logos/dicom_preview.png");
        setFeaturedLink("/demo/dicom");
      }

      setIsLoading(true);
      setIaTag("Diagnóstico IA");
      setIaTitle("Analizando perfil clínico...");

      try {
        const query = `He completado mi diagnóstico. Perfil: Rol: ${selected === "redaccion" ? "Estudiante" : "Dentista"}, Sistema: ${updatedAnswers.currentSystem}, Prioridad: ${selected}. Recomiéndame qué buscar o explorar.`;
        const response = await chatWithAgent(query, updatedAnswers, []);
        
        const truncatedResponse = response.length > 140 ? response.slice(0, 137) + "..." : response;
        setIaTitle(truncatedResponse);

        // Personalizar la lista de recomendados de la derecha
        if (selected === "redaccion") {
          setRecomendadosList([
            { cat: "IA local", title: "Guía de Redacción determinista local", time: "Hace 1 hora", icon: "✍️", link: "/demo/ai" },
            { cat: "Académico", title: "Expediente digital de Dentaxy Seed en la UAZ", time: "Hace 1 día", icon: "🎓", link: "/seed" },
            { cat: "Privacidad", title: "Cero APIs externas: historiales seguros localmente", time: "Hace 2 días", icon: "🛡️", link: "/como-funciona" },
            { cat: "Tienda", title: "Dentaxy Shop: Insumos directos desde la ficha clínica", time: "Hace 1 semana", icon: "⚡", link: "/shop" }
          ]);
        } else if (selected === "privacidad") {
          setRecomendadosList([
            { cat: "Google Drive", title: "Cómo conectar tu Google Drive personal a Dentaxy", time: "Hace 30 min", icon: "📁", link: "/hub" },
            { cat: "Firma Electrónica", title: "Seguridad y validez legal en recetas en México", time: "Hace 2 días", icon: "✍️", link: "/benefits" },
            { cat: "Soberanía", title: "Drive vs Bases de Datos Centralizadas en salud", time: "Hace 4 días", icon: "🌐", link: "/about" },
            { cat: "Seguridad", title: "Cifrado por proximidad YubiKey para expedientes VIP", time: "Hace 1 semana", icon: "🔑", link: "/admin/security" }
          ]);
        } else {
          setRecomendadosList([
            { cat: "Visor 3D", title: "Visualizador DICOM nativo sin lag de GPU", time: "Hace 1 hora", icon: "🧬", link: "/demo/dicom" },
            { cat: "Visualizador STL", title: "Carga de archivos STL y modelos en la ficha", time: "Hace 2 días", icon: "📐", link: "/demo/dicom" },
            { cat: "Mobile", title: "Renderizado volumétrico 3D en dispositivos móviles", time: "Hace 3 días", icon: "📱", link: "/como-funciona" },
            { cat: "Caso de Éxito", title: "Adopción de visor dental en clínicas CROID", time: "Hace 5 días", icon: "🏥", link: "/seed" }
          ]);
        }
      } catch (err) {
        console.error(err);
        setIaTitle("Diagnóstico listo. Explora las secciones de Dentaxy Seed, Dentaxy.com o el visor 3D DICOM.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResetDiagnostic = () => {
    setStep(0);
    setAnswers({});
    setIaTag("Seguridad");
    setIaTitle("Por qué YubiKey y el control por proximidad definen el futuro de los expedientes VIP en México");
    setFeaturedImage("/lovable-uploads/dentist_avatar.png");
    setFeaturedLink("#");
    setRecomendadosList([]);
    setIsChatOpen(false);
    setChatInput("");
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || isLoading) return;
    handleSearch(chatInput);
    setChatInput("");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchValue);
  };

  const handleSearch = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    setIsLoading(true);
    setIaTag("Asistente IA");
    setIaTitle("Pensando respuesta...");

    try {
      const response = await chatWithAgent(queryText, answers, []);
      const cleanResponse = response.length > 140 ? response.slice(0, 137) + "..." : response;
      setIaTitle(cleanResponse);

      const cleanQ = queryText.toLowerCase();
      if (cleanQ.includes("seed") || cleanQ.includes("estudiante") || cleanQ.includes("universidad")) {
        setFeaturedImage("/logos/seed_preview.png");
        setFeaturedLink("/seed");
        setRecomendadosList([
          { cat: "Académico", title: "Dentaxy Seed: Gestor de clínicas universitarias", time: "Hace 10 min", icon: "🎓", link: "/seed" },
          { cat: "Caso UAZ", title: "UAZ y el expediente clínico digital estudiantil", time: "Hace 1 día", icon: "🏫", link: "/seed" },
          { cat: "Guía Alumno", title: "Llenado de historia clínica local en Dentaxy", time: "Hace 3 días", icon: "✍️", link: "/demo/ai" },
          { cat: "Arquitectura", title: "Evaluación docente en tiempo real", time: "Hace 1 semana", icon: "⚡", link: "/seed" }
        ]);
      } else if (cleanQ.includes("drive") || cleanQ.includes("guardar") || cleanQ.includes("soberania") || cleanQ.includes("nube")) {
        setFeaturedImage("/logos/drive_preview.png");
        setFeaturedLink("/hub");
        setRecomendadosList([
          { cat: "Google Drive", title: "Configurar almacenamiento local en Drive", time: "Hace 5 min", icon: "📁", link: "/hub" },
          { cat: "Seguridad", title: "Soberanía digital: tus expedientes nunca en nuestra nube", time: "Hace 1 día", icon: "🛡️", link: "/como-funciona" },
          { cat: "Cumplimiento", title: "Ley de salud de expedientes clínicos electrónicos", time: "Hace 2 días", icon: "📜", link: "/about" },
          { cat: "Tecnología", title: "Estructura de JSON de pacientes en Drive", time: "Hace 5 días", icon: "⚡", link: "/hub" }
        ]);
      } else if (cleanQ.includes("3d") || cleanQ.includes("dicom") || cleanQ.includes("stl") || cleanQ.includes("tomografia")) {
        setFeaturedImage("/logos/dicom_preview.png");
        setFeaturedLink("/demo/dicom");
        setRecomendadosList([
          { cat: "Visor 3D", title: "Manipulación de archivos DICOM en navegador", time: "Hace 2 min", icon: "🧬", link: "/demo/dicom" },
          { cat: "Modelos STL", title: "Importación STL de escáneres intraorales", time: "Hace 1 día", icon: "📐", link: "/demo/dicom" },
          { cat: "Mobile", title: "Visualización 3D fluida en iPad y smartphones", time: "Hace 3 días", icon: "📱", link: "/como-funciona" },
          { cat: "Soporte CBCT", title: "Formatos de tomografías dentales soportados", time: "Hace 1 semana", icon: "⚡", link: "/demo/dicom" }
        ]);
      } else if (cleanQ.includes("privacidad") || cleanQ.includes("seguridad") || cleanQ.includes("redaccion") || cleanQ.includes("local")) {
        setFeaturedImage("/logos/drive_preview.png");
        setFeaturedLink("/hub");
        setRecomendadosList([
          { cat: "Privacidad Local", title: "Simulación de redacción de historias clínicas", time: "Hace 1 min", icon: "🛡️", link: "/demo/ai" },
          { cat: "Cero APIs", title: "Por qué no usamos OpenAI/Claude en historias clínicas", time: "Hace 2 días", icon: "🧬", link: "/demo/ai" },
          { cat: "YubiKey", title: "Autenticación por proximidad física YubiKey", time: "Hace 5 días", icon: "🔑", link: "/admin/security" },
          { cat: "Desarrollo", title: "Arquitectura determinista de redacción en Dentaxy", time: "Hace 1 semana", icon: "⚡", link: "/como-funciona" }
        ]);
      }
    } catch (err) {
      console.error(err);
      setIaTitle("Disculpa, hubo un inconveniente al conectar con la IA de ventas. Pregúntame de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeaturedCardClick = () => {
    if (featuredLink && featuredLink !== "#") {
      navigate(featuredLink);
    }
  };

  const isStep4 = step === 4;

  return (
    <section
      ref={sectionRef}
      id="insights-section"
      className={`w-full snap-start relative flex transition-all duration-500 ${
        isStep4 
          ? "flex-col md:flex-row-reverse bg-slate-50 h-auto min-h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] overflow-y-auto md:overflow-hidden" 
          : "flex-col md:flex-row bg-white h-[calc(100vh-4rem)] overflow-hidden"
      }`}
    >
      {/* ── Orbe DEX Estándar (Pasos 0 a 3) ── */}
      {!isStep4 && (
        <motion.div
          id="dentaxy-ai-orb"
          layoutId="dentaxy-landing-orb-shared"
          style={{
            position: "fixed",
            left: orbLeft,
            top: orbTop,
            translateX: "-50%",
            translateY: orbTransformY,
            width: orbSize,
            height: orbSize,
            zIndex: 100,
          }}
          className="rounded-full overflow-hidden pointer-events-auto bg-transparent flex items-center justify-center border-none shadow-none"
        >
          <video
            src="/logos/Dentaxy AI.mp4"
            autoPlay
            muted
            playsInline
            loop
            className="w-full h-full object-cover scale-[1.06] select-none pointer-events-none"
          />
        </motion.div>
      )}

      {/* ── Barra de Chat Estilo ChatGPT (Paso 4) ── */}
      {isStep4 && (
        <motion.div
          layoutId="dentaxy-landing-orb-parent"
          initial={false}
          animate={{
            width: isChatOpen ? (isPortrait ? "calc(100% - 32px)" : 480) : 96,
            height: isChatOpen ? 64 : 96,
            borderRadius: isChatOpen ? 32 : 48,
          }}
          whileHover={!isChatOpen ? {
            scale: 1.06,
            boxShadow: "0 20px 48px rgba(0,0,0,0.18)",
            filter: "brightness(1.05)"
          } : undefined}
          whileTap={!isChatOpen ? { scale: 0.96 } : undefined}
          transition={{ type: "spring", stiffness: 140, damping: 20 }}
          className="fixed z-[100] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-100 flex items-center p-1 cursor-pointer"
          style={{
            right: isPortrait ? "16px" : "48px",
            bottom: isPortrait ? "24px" : "24px",
          }}
          onClick={() => {
            if (!isChatOpen) {
              setIsChatOpen(true);
            }
          }}
        >
          {/* Orbe de DEX en la izquierda de la barra de chat */}
          <motion.div
            layoutId="dentaxy-landing-orb-shared"
            onClick={(e) => {
              if (isChatOpen) {
                e.stopPropagation();
                setIsChatOpen(false);
              }
            }}
            className="rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-transparent transition-all duration-300 border-none shadow-none"
            style={{
              width: isChatOpen ? 56 : 88,
              height: isChatOpen ? 56 : 88,
            }}
          >
            <video
              src="/logos/Dentaxy AI.mp4"
              autoPlay
              muted
              playsInline
              loop
              className="w-full h-full object-cover scale-[1.06] select-none pointer-events-none"
            />
          </motion.div>

          {/* Caja de Entrada de Texto estilo ChatGPT */}
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="flex-1 flex items-center ml-3 pr-2"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Pregunta lo que quieras"
                className="flex-1 bg-transparent border-none outline-none text-slate-800 text-sm font-semibold placeholder-slate-400 py-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />

              {/* Icono de Micrófono */}
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>

              {/* Botón de Enviar (círculo negro con ondas) */}
              <button
                onClick={handleSendMessage}
                className="w-10 h-10 bg-black hover:bg-neutral-800 rounded-full flex items-center justify-center text-white transition-colors shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="5" y="10" width="2" height="4" rx="1" />
                  <rect x="9" y="7" width="2" height="10" rx="1" />
                  <rect x="13" y="5" width="2" height="14" rx="1" />
                  <rect x="17" y="8" width="2" height="8" rx="1" />
                </svg>
              </button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* ── Columna Izquierda: Preguntas e Intro ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isStep4 ? 0 : (hasStartedTyping ? 1 : 0),
          width: isStep4 ? 0 : "auto"
        }}
        transition={{ duration: 0.5 }}
        className={`flex-1 h-full flex z-10 pointer-events-none transition-all duration-500 overflow-hidden ${
          isStep4 
            ? "w-0 max-w-0 opacity-0 pointer-events-none" 
            : (isPortrait 
                ? "flex-col justify-end pb-8 items-center text-center w-full" 
                : "items-center w-full")
        }`}
      >
        {/* Contenedor de texto */}
        {hasStartedTyping && (
          <div
            className={`pointer-events-auto w-full max-w-[520px] ${
              isPortrait ? "px-6 mx-auto flex flex-col items-center" : ""
            }`}
            style={isPortrait ? undefined : { marginLeft: "clamp(4rem, 16vw, 22rem)" }}
          >
            {/* Badge + meta con entrada suave */}
            <motion.div
              key={`badge-${step}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`flex flex-wrap items-center gap-3 mb-5 ${
                isPortrait ? "justify-center" : ""
              }`}
            >
              <span className="inline-block px-2 py-0.5 bg-[#00f5a0] text-black rounded-[4px] text-[10px] font-bold uppercase tracking-[0.12em] font-mono shadow-[0_0_15px_rgba(0,245,160,0.6)] border border-[#00f5a0]/30">
                {step === 0 ? "AGENTE DEX" : onboardingSteps[step].tag}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <span>Redacción Médica IA</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Hace 2 horas
                </span>
              </div>
            </motion.div>

            {/* Paso 0: Introducción de DEX */}
            {step === 0 && (
              <>
                <div className="space-y-3 mb-7">
                  <AppleTypewriter key="dex-intro" speed={1.1} delay={0.2}>
                    <p className="text-base md:text-lg text-gray-500 font-semibold tracking-wide">
                      Hola, doctor.
                    </p>
                    <h2 
                      className="text-[clamp(36px,5.5vw,56px)] font-normal text-slate-900 tracking-tight leading-none"
                      style={{ fontFamily: "'Bruno Ace SC', sans-serif" }}
                    >
                      Soy DEX 👋
                    </h2>
                    <p className="text-lg md:text-xl font-bold text-slate-800 tracking-tight leading-snug pt-1">
                      Sé que tu tiempo es valioso.
                    </p>
                    <p className="text-base md:text-lg text-gray-600 leading-relaxed font-medium">
                      Estoy aquí para acompañarte en Dentaxy y llevarte directo a lo que necesitas, sin que tengas que buscarlo.
                    </p>
                  </AppleTypewriter>
                </div>

                <motion.button
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 0.6, ease: "easeOut" }}
                  onClick={() => setStep(1)}
                  className="w-full bg-black hover:bg-neutral-800 text-white font-bold text-sm px-6 py-4 rounded-xl shadow-md hover:shadow-lg transition-all border border-black"
                >
                  Guiarme en Dentaxy →
                </motion.button>
              </>
            )}

            {/* Pasos 1, 2, 3: Preguntas de diagnóstico */}
            {step > 0 && step < 4 && (
              <>
                <div className="mb-4">
                  <AppleTypewriter key={`q-${step}`} speed={1.0} delay={0.1}>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                      {onboardingSteps[step].title}
                    </h2>
                  </AppleTypewriter>
                </div>

                {/* Indicador de progreso */}
                <div className={`flex items-center gap-1.5 mb-5 ${
                  isPortrait ? "justify-center" : ""
                }`}>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Diagnóstico:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((s) => (
                      <div 
                        key={s} 
                        className={`w-6 h-1 rounded-full transition-all ${
                          s <= step 
                            ? "bg-[#00f5a0] shadow-[0_0_8px_rgba(0,245,160,0.5)]" 
                            : "bg-slate-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Opciones con entrada stagger */}
                <motion.div
                  key={`opts-${step}`}
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                  className="space-y-3"
                >
                  {onboardingSteps[step].options?.map((opt, idx) => (
                    <motion.button
                      key={idx}
                      variants={{
                        hidden: { opacity: 0, y: 8 },
                        show: { opacity: 1, y: 0 }
                      }}
                      onClick={() => handleCardClick(idx)}
                      className="w-full text-center py-5 px-6 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-black hover:text-white transition-all duration-300 group shadow-sm flex items-center justify-center min-h-[64px]"
                    >
                      <span className="text-[15px] md:text-[17px] font-bold text-slate-800 group-hover:text-white tracking-tight uppercase">
                        {opt.title}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>

                {/* Botón de reiniciar */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={handleResetDiagnostic}
                  className={`mt-6 text-xs text-slate-400 hover:text-slate-600 font-bold flex items-center gap-1.5 transition-colors ${
                    isPortrait ? "mx-auto" : ""
                  }`}
                >
                  ← Reiniciar diagnóstico
                </motion.button>
              </>
            )}

          </div>
        )}
      </motion.div>

      {/* ── Columna Derecha de Visualización (Vista Previa de la Página en Step 4) ── */}
      {isStep4 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full md:flex-1 h-auto min-h-[400px] md:h-full flex flex-col items-center justify-start pt-8 md:pt-4 px-6 pb-6 bg-slate-50 pointer-events-auto md:overflow-y-auto"
          onClick={() => {
            if (featuredLink && featuredLink !== "#") {
              navigate(featuredLink);
            }
          }}
        >
          <div className="w-full max-w-[940px] aspect-[16/9.6] bg-white rounded-3xl border border-slate-200 shadow-[0_24px_50px_rgba(0,0,0,0.04)] overflow-hidden hover:scale-[1.01] hover:shadow-[0_32px_64px_rgba(0,0,0,0.06)] transition-all duration-500 flex flex-col cursor-pointer group relative shrink-0">
            
            {/* Barra de cabecera del navegador simulado */}
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200/80 flex items-center justify-between shrink-0">
              {/* Botones estilo Mac */}
              <div className="flex items-center gap-1.5 w-20">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              
              {/* Barra de dirección URL */}
              <div className="flex-1 max-w-[420px] mx-auto bg-slate-100/85 border border-slate-250/50 px-4 py-1.5 rounded-xl text-center select-none text-[11px] font-mono text-slate-500 flex items-center justify-center gap-1">
                <span className="text-slate-355 select-none">https://</span>
                <span className="font-bold text-slate-700 select-none">dentaxy.com</span>
                <span className="text-slate-800 select-none font-semibold">{featuredLink}</span>
              </div>

              {/* Estado de carga */}
              <div className="w-20 flex justify-end">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
                  VISTA PREVIA
                </span>
              </div>
            </div>

            {/* Contenedor del IFrame Escalado */}
            <div className="flex-1 w-full bg-slate-900 relative overflow-hidden select-none">
              {featuredLink && featuredLink.startsWith("/") ? (
                <iframe
                  key={featuredLink}
                  src={featuredLink}
                  title={`Vista Previa de ${featuredLink}`}
                  loading="lazy"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  className="absolute top-0 left-0 border-none select-none pointer-events-none origin-top-left"
                  style={{
                    width: "200%",
                    height: "200%",
                    transform: "scale(0.5)",
                    overflow: "hidden"
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-semibold">
                  Cargando vista previa de la página...
                </div>
              )}
            </div>

            {/* Efecto de Overlay en Hover */}
            <div className="absolute inset-0 bg-slate-900/0 hover:bg-slate-900/[0.01] flex items-center justify-center transition-all duration-300">
              <div className="bg-black text-white px-5 py-3 rounded-full text-xs font-black tracking-wider uppercase opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 shadow-xl transition-all duration-300">
                Explorar Sección Completa →
              </div>
            </div>
          </div>

          {/* Diálogo con la personalidad de DEX debajo de la tarjeta de vista previa */}
          <div className="w-full max-w-[940px] mt-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex items-start gap-4 hover:border-slate-300 transition-all duration-300 pointer-events-auto shrink-0">
            {/* Pequeño orbe de DEX */}
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-100 bg-slate-50 flex items-center justify-center">
              <video
                src="/logos/Dentaxy AI.mp4"
                autoPlay
                muted
                playsInline
                loop
                className="w-full h-full object-cover scale-[1.06] select-none pointer-events-none"
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-white bg-black px-2.5 py-0.5 rounded tracking-widest font-mono uppercase">
                  DEX AI
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Comentario del Asistente
                </span>
              </div>
              <p className="text-[15px] text-slate-600 leading-relaxed font-semibold">
                {featuredLink === "/seed" ? (
                  <>
                    <span className="font-extrabold text-slate-900">Dentaxy Seed</span> está diseñado especialmente para la nueva generación de odontólogos y estudiantes. Automatiza la redacción clínica localmente, reduciendo tus tareas de papel a cero segundos. <span className="text-slate-800 font-extrabold">¡Si me lo preguntas, es una verdadera obra de arte! 🎨🦷</span>
                  </>
                ) : featuredLink === "/hub" || featuredLink === "/benefits" ? (
                  <>
                    La seguridad en <span className="font-extrabold text-slate-900">Dentaxy Core</span> es absoluta. Conectamos tus expedientes directamente a tu propio Google Drive encriptado. Cero servidores centrales, soberanía total de datos. <span className="text-slate-800 font-extrabold">¡Privacidad absoluta e inviolable! 🛡️🔐</span>
                  </>
                ) : (
                  <>
                    Nuestro <span className="font-extrabold text-slate-900">Visor DICOM 3D</span> integrado procesa radiografías y tomografías directo en el navegador con aceleración por GPU. <span className="text-slate-800 font-extrabold">¡Una obra maestra de ingeniería para tu clínica! 💀🔬</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Columna Derecha: Panel de Recomendados Vertical Completo ── */}
      <div 
        id="recommended-section"
        className={`bg-white flex flex-col gap-6 z-20 transition-all duration-500 ease-in-out ${
          isStep4 
            ? "w-full md:w-[360px] lg:w-[420px] h-auto md:h-full md:overflow-y-auto opacity-100 px-6 md:px-8 pt-6 md:pt-4 pb-32 md:pb-6 border-t md:border-t-0 md:border-r border-gray-100 shadow-[12px_0_36px_rgba(0,0,0,0.02)] pointer-events-auto mr-auto" 
            : "w-0 md:w-0 h-0 md:h-full opacity-0 p-0 border-0 pointer-events-none overflow-hidden"
        }`}
      >
        {/* Buscador */}
        <form onSubmit={handleSearchSubmit} className="relative shrink-0">
          <input 
            type="text" 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Buscar artículo, tag, categoría..." 
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-gray-100 rounded-2xl text-xs font-semibold text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-200 transition-all"
          />
          <button type="submit" className="absolute left-3.5 top-3.5">
            <Search className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors" />
          </button>
        </form>

        {/* Recomendado Header */}
        <div className="flex items-center justify-between shrink-0">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Recomendados</h3>
          <span 
            onClick={() => handleSearch("todos")}
            className="text-xs text-blue-500 font-bold hover:underline cursor-pointer"
          >
            Ver todos &gt;
          </span>
        </div>

        {/* Tarjeta Destacada Dinámica */}
        <div 
          onClick={handleFeaturedCardClick}
          className="relative rounded-2xl overflow-hidden shadow-md group cursor-pointer aspect-[16/10] bg-slate-900 flex flex-col justify-end p-5 min-h-[160px] shrink-0"
        >
          <img 
            src={featuredImage} 
            alt="Recomendación Dentaxy" 
            className="absolute inset-0 w-full h-full object-cover object-top opacity-70 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/95 via-purple-800/40 to-blue-900/10 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-800/50 to-indigo-800/50 mix-blend-color" />
          
          <div className="relative z-10">
            <span className="inline-block px-2 py-0.5 bg-white/20 text-white backdrop-blur-sm rounded text-[9px] font-bold uppercase tracking-wider mb-2">
              {iaTag}
            </span>
            <h4 className={`text-sm font-bold text-white leading-snug group-hover:underline ${isLoading ? "animate-pulse" : ""}`}>
              {iaTitle}
            </h4>
          </div>
        </div>

        {/* Lista de Recomendados Secundarios (Dinámica) */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-1">
          {recomendadosList.map((rec, idx) => (
            <a 
              key={idx} 
              href={rec.link}
              onClick={(e) => {
                if (rec.link.startsWith("#")) {
                  e.preventDefault();
                  setSearchValue(rec.title);
                  handleSearch(rec.title);
                } else {
                  e.preventDefault();
                  navigate(rec.link);
                }
              }}
              className="flex items-start justify-between gap-3 group cursor-pointer p-3 rounded-xl hover:bg-black transition-all duration-300 border border-transparent shrink-0"
            >
              <div className="flex-1">
                <span className="text-[9px] text-gray-400 group-hover:text-slate-400 font-bold uppercase tracking-wider transition-colors duration-300">{rec.cat} • {rec.time}</span>
                <h5 className="text-xs font-bold text-slate-700 group-hover:text-white transition-colors duration-300 mt-0.5 leading-snug line-clamp-2">
                  {rec.title}
                </h5>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-white/10 border border-gray-100 group-hover:border-transparent flex items-center justify-center text-lg shadow-sm transition-all flex-shrink-0">
                {rec.icon}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};


