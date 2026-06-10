import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Sparkles, Clock, Globe } from "lucide-react";
import { chatWithAgent } from "../../services/gemini";
import { AppleTypewriter } from "@/components/ui/AppleTypewriter";

export const InsightsSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  const handleVideoEnded = () => {
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(err => console.log("Video play interrupted:", err));
      }
    }, 3000);
  };
  
  // --- Estados de Onboarding ---
  const [step, setStep] = useState(0); // 0: bienvenidos, 0.5: dex_presentacion, 1: perfil, 2: sistema, 3: prioridad, 4: completado
  const [answers, setAnswers] = useState<{
    role?: string;
    currentSystem?: string;
    priority?: string;
  }>({});

  // --- Estados de la IA en el Panel Derecho ---
  const [iaTag, setIaTag] = useState("Seguridad");
  const [iaTitle, setIaTitle] = useState("Por qué YubiKey y el control por proximidad definen el futuro de los expedientes VIP en México");
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [featuredImage, setFeaturedImage] = useState("/lovable-uploads/dentist_avatar.png");
  const [featuredLink, setFeaturedLink] = useState("#");

  // Lista de recomendados del lado derecho (dinámica, vacía al inicio)
  const [recomendadosList, setRecomendadosList] = useState<any[]>([]);

  // Artículos originales de la izquierda por defecto (paso 0 y paso 4)
  const articulosOriginales = [
    {
      cat: "Soberanía Digital",
      title: "Por qué almacenar en Google Drive personal supera a cualquier nube centralizada",
      desc: "La soberanía del paciente garantizada mediante integración nativa sin bases de datos propietarias intermedias."
    },
    {
      cat: "Privacidad Local",
      title: "Cero APIs externas: la simulación local de redacción que protege historiales médicos",
      desc: "Mapeo inteligente y procesamiento determinista en navegador para asegurar confidencialidad médica absoluta."
    },
    {
      cat: "Visualización 3D",
      title: "Visualizador odontológico CBCT/DICOM: renderizado nativo fluido",
      desc: "Manipulación de cortes axiales y reconstrucciones en tiempo real directamente desde navegadores móviles."
    }
  ];

  // Datos del Onboarding (Preguntas y opciones)
  const onboardingSteps = [
    {
      tag: "Mejor de la Semana",
      title: "El motor de redacción odontológica local acelera la entrega de diagnósticos clínicos en clínicas universitarias",
      btnText: "Iniciar diagnóstico de práctica"
    },
    {
      tag: "Pregunta 1 de 3",
      title: "¿Cuál es tu rol o perfil actual en el ecosistema de la odontología?",
      btnText: "Reiniciar diagnóstico",
      options: [
        {
          cat: "Perfil Profesional",
          title: "Estudiante / Pasante de Odontología",
          desc: "Deseo digitalizar mis historias clínicas académicas y recibir evaluaciones docente."
        },
        {
          cat: "Perfil Profesional",
          title: "Odontólogo Independiente",
          desc: "Busco optimizar los expedientes clínicos y la redacción de diagnósticos de mi consultorio privado."
        },
        {
          cat: "Perfil Profesional",
          title: "Clínica Especializada o Universidad",
          desc: "Coordinar múltiples sillones, doctores y optimizar flujos institucionales."
        }
      ]
    },
    {
      tag: "Pregunta 2 de 3",
      title: "¿Cómo gestionas actualmente el expediente e historias clínicas de tus pacientes?",
      btnText: "Reiniciar diagnóstico",
      options: [
        {
          cat: "Método Actual",
          title: "Expedientes en Papel y Físicos",
          desc: "Nuestros historiales clínicos, fichas y odontogramas se registran de forma manuscrita."
        },
        {
          cat: "Método Actual",
          title: "Archivos de Oficina (Excel, Word, PDF)",
          desc: "Guardamos fichas básicas en carpetas digitales en computadoras locales."
        },
        {
          cat: "Método Actual",
          title: "Software Dental de Terceros",
          desc: "Usamos un sistema propietario tradicional y buscamos mayor privacidad y soberanía."
        }
      ]
    },
    {
      tag: "Pregunta 3 de 3",
      title: "¿Cuál es tu reto o prioridad número uno en tu práctica dental hoy?",
      btnText: "Reiniciar diagnóstico",
      options: [
        {
          cat: "Prioridad Técnica",
          title: "Redacción Clínica Veloz",
          desc: "Redacción local rápida de historias clínicas en navegador con costo cero y sin APIs de terceros."
        },
        {
          cat: "Prioridad Técnica",
          title: "Soberanía en Google Drive",
          desc: "Garantizar que los datos médicos se guarden directamente en la cuenta de Drive personal."
        },
        {
          cat: "Prioridad Técnica",
          title: "Diagnóstico STL y DICOM",
          desc: "Manipular tomografías CBCT y escaneos intraorales nativamente en la web sin lags."
        }
      ]
    },
    {
      tag: "Diagnóstico Listo",
      title: "Perfecto. He configurado tus recomendaciones basadas en tu perfil clínico.",
      btnText: "Volver a diagnosticar"
    }
  ];

  const valueToLabel = (value?: string, stepIdx?: number): string => {
    if (!value) return "";
    const stepData = onboardingSteps[stepIdx || 1];
    if (!stepData.options) return value;
    const opt = stepData.options.find(o => o.title.toLowerCase().includes(value.toLowerCase()));
    return opt ? opt.title : value;
  };

  // Scroll suave al panel de recomendaciones en móvil al finalizar
  useEffect(() => {
    if (step === 4 && window.innerWidth < 768) {
      setTimeout(() => {
        const recommendedSection = document.getElementById("recommended-section");
        if (recommendedSection) {
          recommendedSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    }
  }, [step]);

  // Helpers para calcular palabras y delays secuenciales
  const countWords = (text?: string): number => {
    if (!text) return 0;
    return text.trim().split(/\s+/).length;
  };

  const countCardWords = (opt?: { cat?: string; title?: string; desc?: string }): number => {
    if (!opt) return 0;
    return countWords(opt.cat) + countWords(opt.title) + countWords(opt.desc);
  };

  // Conteo de palabras para el cálculo de delays
  const currentStepData = onboardingSteps[Math.floor(step)] || {};
  const qText = currentStepData.title || "";
  const qWords = countWords(qText);
  const speedFactor = 1.0 * 0.015; // Duración exacta por palabra
  const qDuration = qWords * speedFactor + 0.5;

  const opt1Delay = qDuration + 0.05;
  const opt1Words = currentStepData.options?.[0] ? countCardWords(currentStepData.options[0]) : 0;
  const opt1Duration = opt1Words * speedFactor + 0.5;

  const opt2Delay = opt1Delay + opt1Duration + 0.05;
  const opt2Words = currentStepData.options?.[1] ? countCardWords(currentStepData.options[1]) : 0;
  const opt2Duration = opt2Words * speedFactor + 0.5;

  const opt3Delay = opt2Delay + opt2Duration + 0.05;

  // Manejo de la selección de opciones de onboarding
  const handleCardClick = async (idx: number) => {
    if (step === 0 || step === 4) {
      const art = articulosOriginales[idx];
      setSearchValue(art.title);
      handleSearch(art.title);
      return;
    }

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

      // Disparar recomendación de IA basada en respuestas completas
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
        setIaTitle("Diagnóstico listo. Explora las secciones de Dentaxy Seed, Dentaxy.com o el visor 3D DICOM en el menú.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Botón principal de la izquierda (Iniciar / Reiniciar / Volver)
  const handleMainButtonClick = () => {
    setStep(0);
    setAnswers({});
    setIaTag("Seguridad");
    setIaTitle("Por qué YubiKey y el control por proximidad definen el futuro de los expedientes VIP en México");
    setFeaturedImage("/lovable-uploads/dentist_avatar.png");
    setFeaturedLink("#");
    setRecomendadosList([]);
  };

  // Buscar / Preguntar a la IA desde la barra superior de la derecha
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
      setIaTitle("Disculpa, hubo un inconveniente al conectar con la IA de ventas. Pregúntame de nuevo o revisa las secciones.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeaturedCardClick = () => {
    if (featuredLink && featuredLink !== "#") {
      navigate(featuredLink);
    }
  };

  return (
    <section className="w-full h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-white snap-start overflow-hidden relative">
      
      {/* Columna Izquierda: Contenido Principal */}
      <div className={`flex-1 h-full flex flex-col justify-center items-center py-8 px-4 md:px-10 lg:px-14 relative overflow-hidden z-10 bg-white transition-all duration-500 ease-in-out ${step === 4 ? "hidden md:flex" : "flex"}`}>
        
        {/* Estilos locales para ocultar la barra de scroll y dar estilo fino */}
        <style dangerouslySetInnerHTML={{ __html: `
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}} />

        {/* Sección Central: Artículo Destacado / Pregunta */}
        <div className={`flex flex-col justify-center relative my-4 z-10 w-full transition-all duration-500 ${step > 0 && step < 4 ? "max-w-5xl mx-auto" : "max-w-xl mx-auto"}`}>
          
          {step === 0 ? (
            /* Bienvenidos (Paso 0): Solo el video centrado y el botón negro */
            <div className="flex flex-col items-center justify-center w-full text-center py-6 animate-fade-in">
              <div className="w-44 h-44 md:w-56 md:h-56 rounded-full overflow-hidden bg-transparent mb-6 transition-all duration-700 animate-float shadow-[0_0_30px_rgba(0,0,0,0.02)]">
                <video 
                  src="/logos/Dentaxy AI.mp4" 
                  autoPlay 
                  muted 
                  playsInline 
                  loop
                  className="w-full h-full object-cover"
                />
              </div>
              <button 
                onClick={() => setStep(0.5)}
                className="bg-black hover:bg-neutral-900 text-white font-bold text-xs px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all border border-black mt-2"
              >
                Iniciar recorrido
              </button>
            </div>
          ) : step > 0 && step < 4 ? (
            /* Onboarding activo: Paso 0.5 (Presentación de Dex) o Pasos 1, 2, 3 (Preguntas) */
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 lg:gap-24 w-full text-center md:text-left">
              {/* Burbuja del agente de IA en móvil (Limpia sin bordes ni fondos) */}
              <div className="md:hidden flex flex-col items-center justify-center mb-5">
                <div className="w-36 h-36 rounded-full overflow-hidden bg-transparent">
                  <video 
                    src="/logos/Dentaxy AI.mp4" 
                    autoPlay 
                    muted 
                    playsInline 
                    loop
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Contenido de la Pregunta / Presentación */}
              <div className="flex-1 w-full max-w-xl z-10">
                <div className="flex flex-wrap items-center gap-3 mb-4 justify-center md:justify-start">
                  <span className="inline-block px-3.5 py-1.5 bg-[#10b981] text-white rounded text-sm font-semibold uppercase tracking-[0.08em] font-mono shadow-[0_0_12px_rgba(16,185,129,0.35)] border border-emerald-400/25">
                    {step === 0.5 ? "AGENTE DEX" : onboardingSteps[Math.floor(step)].tag}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <span>Redacción Médica IA</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Hace 2 horas</span>
                  </div>
                </div>
                
                {step === 0.5 ? (
                  <AppleTypewriter key="dex-intro" delay={0} speed={1.0}>
                    <h2 className="text-[clamp(24px,4vw,36px)] font-semibold text-slate-800 tracking-tight leading-snug mb-4 text-center md:text-left">
                      Hola, doctor. Soy Dex. Conozco cada rincón de este ecosistema y estoy aquí para diseñar tu entorno ideal.
                    </h2>
                  </AppleTypewriter>
                ) : (
                  <AppleTypewriter key={`q-${step}`} delay={0} speed={1.0}>
                    <h2 className="text-[clamp(24px,4vw,36px)] font-semibold text-slate-800 tracking-tight leading-snug mb-4 text-center md:text-left">
                      {onboardingSteps[Math.floor(step)].title}
                    </h2>
                  </AppleTypewriter>
                )}
                
                {step === 0.5 ? (
                  <button 
                    onClick={() => setStep(1)}
                    className="w-full bg-black hover:bg-neutral-800 text-white font-bold text-xs px-6 py-4 rounded-xl shadow-md hover:shadow-lg transition-all border border-black group mt-4 text-center"
                  >
                    Iniciar diagnóstico para optimizar mi consultorio y recibir recomendaciones personalizadas →
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 mb-4 justify-center md:justify-start">
                    <span className="text-[10px] text-gray-400 font-bold">Diagnóstico:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3].map((s) => (
                        <div 
                          key={s} 
                          className={`w-6 h-1 rounded-full transition-all ${
                            s <= step 
                              ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" 
                              : "bg-slate-100"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Lado Derecho: La burbuja Dentaxy AI en Desktop (Solo se muestra durante onboarding) */}
              <div className="hidden md:flex flex-shrink-0 items-center justify-center">
                <div className="w-[280px] h-[280px] lg:w-[340px] lg:h-[340px] rounded-full overflow-hidden bg-transparent">
                  <video 
                    src="/logos/Dentaxy AI.mp4" 
                    autoPlay 
                    muted 
                    playsInline 
                    loop
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Contenido para Paso 4 (Diagnóstico Listo) */
            <div className="max-w-xl z-10 animate-fade-in flex flex-col items-center md:items-start text-center md:text-left w-full mx-auto md:mx-0">
              <div className="flex flex-wrap items-center gap-3 mb-4 justify-center md:justify-start">
                <span className="inline-block px-3.5 py-1.5 bg-[#10b981] text-white rounded text-sm font-semibold uppercase tracking-[0.08em] font-mono shadow-[0_0_12px_rgba(16,185,129,0.35)] border border-emerald-400/25">
                  {onboardingSteps[4].tag}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <span>Redacción Médica IA</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Hace 2 horas</span>
                </div>
              </div>
              
              <AppleTypewriter key={`q-${step}`} delay={0} speed={1.0}>
                <h2 className="text-[clamp(24px,4vw,36px)] font-semibold text-slate-800 tracking-tight leading-snug mb-4">
                  {onboardingSteps[4].title}
                </h2>
              </AppleTypewriter>
              
              <button 
                onClick={handleMainButtonClick}
                className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all border border-gray-200 group"
              >
                {onboardingSteps[4].btnText}
                <ArrowRight className="w-3.5 h-3.5 text-emerald-500 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

        </div>

        {/* Video de Animación de Dentaxy AI en la posición central del orbe (Solo visible fuera del onboarding, para decorar en paso 4) */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] md:w-[320px] md:h-[320px] lg:w-[380px] lg:h-[380px] flex items-center justify-center z-0 pointer-events-none transition-all duration-500 ${step === 4 ? "opacity-30 md:opacity-40 scale-100" : "opacity-0 scale-90"}`}>
          <video 
            ref={videoRef}
            src="/logos/Dentaxy AI.mp4" 
            autoPlay 
            muted 
            playsInline 
            onEnded={handleVideoEnded}
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Sección Inferior: 3 Columnas de Artículos Secundarios u Opciones de Selección (Oculto en móvil y desktop en pasos 0 y 0.5 para mantener limpieza) */}
        <div className={`grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 pt-6 border-t border-gray-100 w-full mt-4 z-10 ${step >= 1 && step < 4 ? "grid max-h-[300px] md:max-h-none overflow-y-auto md:overflow-visible pb-2" : step === 4 ? "hidden md:grid" : "hidden"}`}>
          {(step < 1 || step === 4 ? articulosOriginales : onboardingSteps[Math.floor(step)].options || []).map((art, idx) => {
            const cardDelay = (step >= 1 && step < 4)
              ? (idx === 0 ? opt1Delay : idx === 1 ? opt2Delay : opt3Delay)
              : 0;

            return (
              <div 
                key={idx} 
                onClick={() => handleCardClick(idx)}
                className={`flex flex-col justify-between group cursor-pointer p-3 md:p-4 rounded-xl hover:bg-black transition-all duration-300 border border-transparent hover:border-black shadow-sm ${step >= 1 && step < 4 ? "bg-slate-50 hover:bg-black border-slate-100" : ""}`}
              >
                {step >= 1 && step < 4 ? (
                  <AppleTypewriter key={`opt-${step}-${idx}`} delay={cardDelay} speed={1.0}>
                    <div>
                      <span className="text-[10px] text-slate-600 group-hover:text-slate-400 font-extrabold uppercase tracking-wide transition-colors duration-300">
                        {art.cat}
                      </span>
                      <h4 className="text-[13px] md:text-sm font-bold text-slate-800 group-hover:text-white transition-colors duration-300 mt-1 mb-1 line-clamp-2">
                        {art.title}
                      </h4>
                      <p className="text-[11px] md:text-xs text-gray-500 group-hover:text-slate-300 transition-colors duration-300 line-clamp-2 leading-relaxed">
                        {art.desc}
                      </p>
                    </div>
                  </AppleTypewriter>
                ) : (
                  <div>
                    <span className="text-[10px] text-slate-600 group-hover:text-slate-400 font-extrabold uppercase tracking-wide transition-colors duration-300">
                      {art.cat}
                    </span>
                    <h4 className="text-[13px] md:text-sm font-bold text-slate-800 group-hover:text-white transition-colors duration-300 mt-1 mb-1 line-clamp-2">
                      {art.title}
                    </h4>
                    <p className="text-xs text-gray-500 group-hover:text-slate-300 transition-colors duration-300 line-clamp-2 leading-relaxed">
                      {art.desc}
                    </p>
                  </div>
                )}
                <div className="w-6 h-0.5 bg-gray-200 group-hover:bg-emerald-400 transition-all duration-300 mt-2" />
              </div>
            );
          })}
        </div>

      </div>

      {/* Columna Derecha: Panel de Recomendados Vertical Completo */}
      <div 
        id="recommended-section"
        className={`bg-white flex flex-col gap-6 overflow-y-auto z-20 transition-all duration-500 ease-in-out ${
          step === 4 
            ? "w-full md:w-[360px] lg:w-[420px] h-full opacity-100 px-6 md:px-8 pt-24 pb-8 border-t md:border-t-0 md:border-l border-gray-100 shadow-[-12px_0_36px_rgba(0,0,0,0.02)] pointer-events-auto" 
            : "w-0 md:w-0 h-0 md:h-full opacity-0 p-0 border-0 pointer-events-none overflow-hidden"
        }`}
      >
        
        {/* Buscador */}
        <form onSubmit={handleSearchSubmit} className="relative">
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
        <div className="flex items-center justify-between">
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
          className="relative rounded-2xl overflow-hidden shadow-md group cursor-pointer aspect-[16/10] bg-slate-900 flex flex-col justify-end p-5 min-h-[160px]"
        >
          {/* Vista Previa Real de la Página Recomendada */}
          <img 
            src={featuredImage} 
            alt="Recomendación Dentaxy" 
            className="absolute inset-0 w-full h-full object-cover object-top opacity-70 group-hover:scale-105 transition-transform duration-500"
          />
          {/* Overlay de gradiente violeta/lila de la captura */}
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
        <div className="flex flex-col gap-4">
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
              className="flex items-start justify-between gap-3 group cursor-pointer p-3 rounded-xl hover:bg-black transition-all duration-300 border border-transparent"
            >
              <div className="flex-1">
                <span className="text-[9px] text-gray-400 group-hover:text-slate-400 font-bold uppercase tracking-wider transition-colors duration-300">{rec.cat} • {rec.time}</span>
                <h5 className="text-xs font-bold text-slate-700 group-hover:text-white transition-colors duration-300 mt-0.5 leading-snug line-clamp-2">
                  {rec.title}
                </h5>
              </div>
              {/* Miniatura estilo icono premium */}
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

