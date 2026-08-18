import React, { useRef, useEffect, useState, useCallback } from "react";
import { Clock, Search, Send } from "lucide-react";
import { motion, useMotionValue } from "framer-motion";
import { chatWithAgent } from "@/services/gemini";

// Respuestas con redacción directa, clara y alta legibilidad (sin font-mono)
const ACADEMY_ANSWERS: Record<string, { title: string; subtitle: string; content: string[]; badge: string; icon: string }> = {
  que_es: {
    title: "¿Qué es Dentaxy Academy?",
    subtitle: "Plataforma de salud digital para facultades de odontología y clínicas universitarias.",
    badge: "Visión General",
    icon: "🎓",
    content: [
      "Dentaxy Academy es el módulo especializado de Dentaxy diseñado para facultades de odontología y clínicas universitarias en México.",
      "Reemplaza los expedientes de papel por historias clínicas digitales inteligentes, guiadas en 20 pasos de alta eficiencia.",
      "Procesa todo localmente en tu dispositivo sin enviar datos médicos a servidores o APIs externas.",
      "Validado en instituciones como la Universidad Autónoma de Zacatecas (UAZ) y clínicas como CROID.",
    ],
  },
  nom004: {
    title: "Historia Clínica NOM-004-SSA3-2012",
    subtitle: "Generación automática y cumplimiento legal en segundos.",
    badge: "Normativa Legal",
    icon: "📋",
    content: [
      "Genera la historia clínica completa cumpliendo al 100% con la NOM-004-SSA3-2012 de la Secretaría de Salud.",
      "Ensambla automáticamente motivo de consulta, interrogatorio, diagnóstico presuntivo, plan de tratamiento y nota de evolución.",
      "Sin párrafos vacíos, sin improvisaciones y sin omisiones clínicas.",
      "Permite adjuntar consentimiento informado firmado digitalmente por el paciente y alumno.",
    ],
  },
  privacidad: {
    title: "Privacidad & Motor Local Determinista",
    subtitle: "0 APIs externas, 0 datos en servidores ajenos.",
    badge: "Seguridad Absoluta",
    icon: "🔒",
    content: [
      "Los datos médicos de tus pacientes NUNCA salen de tu computadora o dispositivo.",
      "Nuestra 'IA' funciona mediante un motor de redacción determinista local que ejecuta scripts dentro del código de tu página.",
      "Auditoría de red garantizada: 0 bytes enviados a api.openai.com o api.claude.ai.",
      "Cumplimiento estricto con la Ley Federal de Protección de Datos Personales (LFPDPPP).",
    ],
  },
};

const THREE_MAIN_QUESTIONS = [
  { key: "que_es", title: "🎓 ¿QUÉ ES DENTAXY ACADEMY?" },
  { key: "nom004", title: "📋 HISTORIA CLÍNICA NOM-004" },
  { key: "privacidad", title: "🔒 PRIVACIDAD & MOTOR LOCAL" },
];

export const AcademyInsightsSection = ({ mainRef }: { mainRef: React.RefObject<HTMLDivElement> }) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const orbTop = useMotionValue("100%");
  const orbLeft = useMotionValue("50%");
  const orbTransformY = useMotionValue("-38%");
  const orbSize = useMotionValue(360);

  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const typingStartedRef = useRef(false);

  // Estado de respuesta activa
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [openInputText, setOpenInputText] = useState("");
  const [customAnswer, setCustomAnswer] = useState<string | null>(null);
  const [isSearchingCustom, setIsSearchingCustom] = useState(false);

  useEffect(() => {
    const mainElement = mainRef.current || document.querySelector("main");
    if (!mainElement) return;

    const handleScroll = () => {
      const scrollTop = mainElement.scrollTop;
      const clientHeight = mainElement.clientHeight || window.innerHeight;
      const progress = Math.min(Math.max(scrollTop / clientHeight, 0), 1);

      const op = Math.min(progress / 0.8, 1);
      const currentIsPortrait = window.innerHeight > window.innerWidth;
      const isMd = window.innerWidth >= 768;

      if (currentIsPortrait) {
        orbLeft.set("50%");
        orbTop.set(`${100 - op * 75}%`);
        orbTransformY.set(`${-38 - op * 4}%`);

        const startSize = Math.min(window.innerWidth * 0.6, 280);
        const endSize = Math.min(window.innerWidth * 0.7, 340);
        orbSize.set(startSize + op * (endSize - startSize));
      } else {
        orbLeft.set(`${50 + op * 25}%`);
        orbTop.set(`${100 - op * 50}%`);
        orbTransformY.set(`${-38 - op * 12}%`);

        const startSize = isMd ? 360 : 280;
        const endSize = isMd ? 420 : 320;
        orbSize.set(startSize + op * (endSize - startSize));
      }

      if (progress > 0.25) {
        if (!typingStartedRef.current) {
          typingStartedRef.current = true;
          setHasStartedTyping(true);
        }
      } else if (progress < 0.05) {
        if (typingStartedRef.current) {
          typingStartedRef.current = false;
          setHasStartedTyping(false);
          setSelectedKey(null);
          setCustomAnswer(null);
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
  }, [orbTop, orbLeft, orbTransformY, orbSize, mainRef]);

  const handleSelectQuestion = (key: string) => {
    setSelectedKey(key);
    setCustomAnswer(null);
  };

  const handleCustomSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!openInputText.trim() || isSearchingCustom) return;

      const q = openInputText.trim().toLowerCase();
      setOpenInputText("");
      setIsSearchingCustom(true);

      let matched: string | null = null;
      if (q.includes("nom") || q.includes("expediente") || q.includes("norma") || q.includes("historia")) matched = "nom004";
      else if (q.includes("privac") || q.includes("segur") || q.includes("dato") || q.includes("api")) matched = "privacidad";
      else if (q.includes("academy") || q.includes("que es") || q.includes("qué es")) matched = "que_es";

      if (matched) {
        setSelectedKey(matched);
        setCustomAnswer(null);
        setIsSearchingCustom(false);
      } else {
        try {
          const res = await chatWithAgent(q, {}, []);
          setCustomAnswer(res);
          setSelectedKey(null);
        } catch {
          setCustomAnswer(
            "Dentaxy Academy es la versión universitaria de Dentaxy. Permite generar expedientes NOM-004 en segundos, sin papel, con 100% de privacidad local en tu dispositivo y acceso sin costo para estudiantes."
          );
          setSelectedKey(null);
        } finally {
          setIsSearchingCustom(false);
        }
      }
    },
    [openInputText, isSearchingCustom]
  );

  const activeAnswer = selectedKey ? ACADEMY_ANSWERS[selectedKey] : null;

  return (
    <section
      ref={sectionRef}
      id="insights-section"
      className="w-full snap-start relative flex flex-col md:flex-row bg-white h-[calc(100vh-4rem)] overflow-hidden"
    >
      {/* ── Orbe DEX 3D (Idéntico a la landing original) ── */}
      <motion.div
        id="dentaxy-ai-orb"
        layoutId="dentaxy-academy-orb-shared"
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

      {/* ── Columna Izquierda: 3 Píldoras Grandes Directas + Input para otra pregunta ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hasStartedTyping ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className={`flex-1 h-full flex z-10 pointer-events-none transition-all duration-500 overflow-hidden ${
          isPortrait
            ? "flex-col justify-end pb-8 items-center text-center w-full"
            : "items-center w-full"
        }`}
      >
        {hasStartedTyping && (
          <div
            className={`pointer-events-auto w-full max-w-[540px] ${
              isPortrait ? "px-6 mx-auto flex flex-col items-center" : ""
            }`}
            style={isPortrait ? undefined : { marginLeft: "clamp(4rem, 16vw, 22rem)" }}
          >
            {/* Badge de cabecera con tipografía sans limpia */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-wrap items-center gap-3 mb-5 ${isPortrait ? "justify-center" : ""}`}
            >
              <span className="inline-block px-3 py-1 bg-[#7c3aed] text-white rounded-md text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                AGENTE DEX
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                <span>Dentaxy Academy</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Hace 2 horas
                </span>
              </div>
            </motion.div>

            {/* ── RESPUESTA DESPLEGADA (Al dar clic en una de las 3 píldoras o preguntar) ── */}
            {activeAnswer || customAnswer ? (
              <motion.div
                key={selectedKey || "custom"}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider">
                    {activeAnswer?.badge || "Respuesta de Dex"}
                  </span>
                  <button
                    onClick={() => { setSelectedKey(null); setCustomAnswer(null); }}
                    className="text-xs text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1 transition-colors"
                  >
                    ← Volver a las preguntas
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <span>{activeAnswer?.icon || "✨"}</span>
                    <span>{activeAnswer?.title || "Información de Dentaxy Academy"}</span>
                  </h3>
                  {activeAnswer?.subtitle && (
                    <p className="text-xs font-semibold text-purple-700">
                      {activeAnswer.subtitle}
                    </p>
                  )}
                  <div className="space-y-2.5 pt-1">
                    {activeAnswer ? (
                      activeAnswer.content.map((paragraph, i) => (
                        <p key={i} className="text-sm md:text-[15px] text-slate-800 leading-relaxed font-sans font-medium flex items-start gap-2.5">
                          <span className="text-purple-600 font-bold text-base leading-none mt-0.5">•</span>
                          <span>{paragraph}</span>
                        </p>
                      ))
                    ) : (
                      <p className="text-sm md:text-[15px] text-slate-800 leading-relaxed font-sans font-medium">
                        {customAnswer}
                      </p>
                    )}
                  </div>
                </div>

                {/* Input siempre disponible para otra pregunta con tipografía legible */}
                <form onSubmit={handleCustomSubmit} className="pt-2">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all">
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={openInputText}
                      onChange={(e) => setOpenInputText(e.target.value)}
                      placeholder="Hacer otra pregunta a Dex..."
                      className="flex-1 bg-transparent border-none outline-none text-sm font-sans font-medium text-slate-900 placeholder:text-slate-400"
                    />
                    <button
                      type="submit"
                      disabled={!openInputText.trim() || isSearchingCustom}
                      className="px-4 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl font-sans text-xs font-bold disabled:opacity-40 transition-colors shrink-0 flex items-center gap-1.5"
                    >
                      <span>Preguntar</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              /* ── 3 PÍLDORAS GRANDES DIRECTAS (Hover Iluminado Morado Translúcido + Letra Blanca/Alta visibilidad) ── */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="mb-4">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                    ¿Qué deseas conocer sobre Dentaxy Academy?
                  </h2>
                </div>

                {/* 3 Píldoras Grandes Directas con Hover de Morado Iluminado (Brillo neón suave, no morado sólido opaco) */}
                <div className="space-y-3">
                  {THREE_MAIN_QUESTIONS.map((q) => (
                    <button
                      key={q.key}
                      onClick={() => handleSelectQuestion(q.key)}
                      className="w-full text-center py-5 px-6 rounded-2xl border border-slate-200/90 bg-slate-50/90 hover:bg-purple-50 hover:border-purple-400 hover:shadow-[0_0_24px_rgba(168,85,247,0.22)] transition-all duration-300 group shadow-sm flex items-center justify-center min-h-[64px]"
                    >
                      <span className="text-[15px] md:text-[17px] font-extrabold text-slate-900 group-hover:text-purple-900 tracking-tight uppercase transition-colors">
                        {q.title}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Input para otra pregunta (Con tipografía legible font-sans y placeholder limpio) */}
                <form onSubmit={handleCustomSubmit} className="pt-2">
                  <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 shadow-sm focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all">
                    <Search className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={openInputText}
                      onChange={(e) => setOpenInputText(e.target.value)}
                      placeholder="Escribe cualquier otra pregunta para Dex..."
                      className="flex-1 bg-transparent border-none outline-none text-sm font-sans font-medium text-slate-900 placeholder:text-slate-400"
                    />
                    <button
                      type="submit"
                      disabled={!openInputText.trim() || isSearchingCustom}
                      className="px-4 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl font-sans text-xs font-bold disabled:opacity-40 transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Preguntar</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </section>
  );
};
