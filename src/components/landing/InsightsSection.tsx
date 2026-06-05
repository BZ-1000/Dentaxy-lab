import React, { useState, useRef, useEffect } from "react";
import { Search, ArrowRight, Sparkles, Clock, Globe } from "lucide-react";
import { chatWithAgent } from "../../services/gemini";

export const InsightsSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnded = () => {
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(err => console.log("Video play interrupted:", err));
      }
    }, 3000);
  };
  // --- Estados de Onboarding ---
  const [step, setStep] = useState(1); // 1: perfil, 2: sistema, 3: prioridad, 4: completado
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

  // Lista de recomendados del lado derecho (dinámica)
  const [recomendadosList, setRecomendadosList] = useState([
    {
      cat: "Caso de Éxito",
      title: "La UAZ adopta Dentaxy Seed: más de 500 estudiantes migran a expedientes digitales",
      time: "Hace 1 día",
      icon: "🎓",
      link: "#"
    },
    {
      cat: "Guía Técnica",
      title: "Configuración de firmas electrónicas avanzadas en PDF clínicos",
      time: "Hace 3 días",
      icon: "✍️",
      link: "#"
    },
    {
      cat: "Actualización",
      title: "Visualizador 3D: manipulación nativa de STL sin lags de GPU",
      time: "Hace 5 días",
      icon: "🧬",
      link: "#"
    },
    {
      cat: "Arquitectura",
      title: "Ecosistema Dentaxy: conectando laboratorios, clínicas y tiendas de insumos",
      time: "Hace 1 semana",
      icon: "⚡",
      link: "#"
    }
  ]);

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
      title: "Perfecto. He configurado tus recomendaciones a la derecha basadas en tu perfil clínico.",
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

  // Manejo de la selección de opciones de onboarding
  const handleCardClick = async (idx: number) => {
    if (step === 0 || step === 4) {
      // En paso 0 y 4, las tarjetas son de lectura (artículos estándar)
      // Puedes abrir un enlace o recomendación en el buscador
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

      // Disparar recomendación de IA basada en respuestas completas
      setIsLoading(true);
      setIaTag("Diagnóstico IA");
      setIaTitle("Analizando perfil clínico...");

      try {
        const query = `He completado mi diagnóstico. Perfil: Rol: ${selected === "redaccion" ? "Estudiante" : "Dentista"}, Sistema: ${updatedAnswers.currentSystem}, Prioridad: ${selected}. Recomiéndame qué buscar o explorar.`;
        const response = await chatWithAgent(query, updatedAnswers, []);
        
        // Limitar la respuesta de la tarjeta destacada para que no desborde (aprox 120 caracteres)
        const truncatedResponse = response.length > 140 ? response.slice(0, 137) + "..." : response;
        setIaTitle(truncatedResponse);

        // Personalizar la lista de recomendados de la derecha
        if (selected === "redaccion") {
          setRecomendadosList([
            { cat: "IA local", title: "Guía de Redacción determinista local", time: "Hace 1 hora", icon: "✍️", link: "#" },
            { cat: "Académico", title: "Expediente digital de Dentaxy Seed en la UAZ", time: "Hace 1 día", icon: "🎓", link: "#" },
            { cat: "Privacidad", title: "Cero APIs externas: historiales seguros localmente", time: "Hace 2 días", icon: "🛡️", link: "#" },
            { cat: "Tienda", title: "Dentaxy Shop: Insumos directos desde la ficha clínica", time: "Hace 1 semana", icon: "⚡", link: "#" }
          ]);
        } else if (selected === "privacidad") {
          setRecomendadosList([
            { cat: "Google Drive", title: "Cómo conectar tu Google Drive personal a Dentaxy", time: "Hace 30 min", icon: "📁", link: "#" },
            { cat: "Firma Electrónica", title: "Seguridad y validez legal en recetas en México", time: "Hace 2 días", icon: "✍️", link: "#" },
            { cat: "Soberanía", title: "Drive vs Bases de Datos Centralizadas en salud", time: "Hace 4 días", icon: "🌐", link: "#" },
            { cat: "Seguridad", title: "Cifrado por proximidad YubiKey para expedientes VIP", time: "Hace 1 semana", icon: "🔑", link: "#" }
          ]);
        } else {
          setRecomendadosList([
            { cat: "Visor 3D", title: "Visualizador DICOM nativo sin lag de GPU", time: "Hace 1 hora", icon: "🧬", link: "#" },
            { cat: "Visualizador STL", title: "Carga de archivos STL y modelos en la ficha", time: "Hace 2 días", icon: "📐", link: "#" },
            { cat: "Actualización", title: "Renderizado volumétrico 3D en dispositivos móviles", time: "Hace 3 días", icon: "📱", link: "#" },
            { cat: "Caso de Éxito", title: "Adopción de visor dental en clínicas CROID", time: "Hace 5 días", icon: "🏥", link: "#" }
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
    setStep(1);
    setAnswers({});
    setIaTag("Seguridad");
    setIaTitle("Por qué YubiKey y el control por proximidad definen el futuro de los expedientes VIP en México");
    setRecomendadosList([
      {
        cat: "Caso de Éxito",
        title: "La UAZ adopta Dentaxy Seed: más de 500 estudiantes migran a expedientes digitales",
        time: "Hace 1 día",
        icon: "🎓",
        link: "#"
      },
      {
        cat: "Guía Técnica",
        title: "Configuración de firmas electrónicas avanzadas en PDF clínicos",
        time: "Hace 3 días",
        icon: "✍️",
        link: "#"
      },
      {
        cat: "Actualización",
        title: "Visualizador 3D: manipulación nativa de STL sin lags de GPU",
        time: "Hace 5 días",
        icon: "🧬",
        link: "#"
      },
      {
        cat: "Arquitectura",
        title: "Ecosistema Dentaxy: conectando laboratorios, clínicas y tiendas de insumos",
        time: "Hace 1 semana",
        icon: "⚡",
        link: "#"
      }
    ]);
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
      // Limitar respuesta de la tarjeta para conservar la maquetación limpia
      const cleanResponse = response.length > 140 ? response.slice(0, 137) + "..." : response;
      setIaTitle(cleanResponse);

      // Recomendar en base a palabras clave de la búsqueda
      const cleanQ = queryText.toLowerCase();
      if (cleanQ.includes("seed") || cleanQ.includes("estudiante") || cleanQ.includes("universidad")) {
        setRecomendadosList([
          { cat: "Académico", title: "Dentaxy Seed: Gestor de clínicas universitarias", time: "Hace 10 min", icon: "🎓", link: "#" },
          { cat: "Caso UAZ", title: "UAZ y el expediente clínico digital estudiantil", time: "Hace 1 día", icon: "🏫", link: "#" },
          { cat: "Guía Alumno", title: "Llenado de historia clínica local en Dentaxy", time: "Hace 3 días", icon: "✍️", link: "#" },
          { cat: "Arquitectura", title: "Evaluación docente en tiempo real", time: "Hace 1 semana", icon: "⚡", link: "#" }
        ]);
      } else if (cleanQ.includes("drive") || cleanQ.includes("guardar") || cleanQ.includes("soberania") || cleanQ.includes("nube")) {
        setRecomendadosList([
          { cat: "Google Drive", title: "Configurar almacenamiento local en Drive", time: "Hace 5 min", icon: "📁", link: "#" },
          { cat: "Seguridad", title: "Soberanía digital: tus expedientes nunca en nuestra nube", time: "Hace 1 día", icon: "🛡️", link: "#" },
          { cat: "Cumplimiento", title: "Ley de salud de expedientes clínicos electrónicos", time: "Hace 2 días", icon: "📜", link: "#" },
          { cat: "Tecnología", title: "Estructura de JSON de pacientes en Drive", time: "Hace 5 días", icon: "⚡", link: "#" }
        ]);
      } else if (cleanQ.includes("3d") || cleanQ.includes("dicom") || cleanQ.includes("stl") || cleanQ.includes("tomografia")) {
        setRecomendadosList([
          { cat: "Visor 3D", title: "Manipulación de archivos DICOM en navegador", time: "Hace 2 min", icon: "🧬", link: "#" },
          { cat: "Modelos STL", title: "Importación STL de escáneres intraorales", time: "Hace 1 día", icon: "📐", link: "#" },
          { cat: "Mobile", title: "Visualización 3D fluida en iPad y smartphones", time: "Hace 3 días", icon: "📱", link: "#" },
          { cat: "Soporte CBCT", title: "Formatos de tomografías dentales soportados", time: "Hace 1 semana", icon: "⚡", link: "#" }
        ]);
      } else if (cleanQ.includes("privacidad") || cleanQ.includes("seguridad") || cleanQ.includes("redaccion") || cleanQ.includes("local")) {
        setRecomendadosList([
          { cat: "Privacidad Local", title: "Simulación de redacción de historias clínicas", time: "Hace 1 min", icon: "🛡️", link: "#" },
          { cat: "Cero APIs", title: "Por qué no usamos OpenAI/Claude en historias clínicas", time: "Hace 2 días", icon: "🧬", link: "#" },
          { cat: "YubiKey", title: "Autenticación por proximidad física YubiKey", time: "Hace 5 días", icon: "🔑", link: "#" },
          { cat: "Desarrollo", title: "Arquitectura determinista de redacción en Dentaxy", time: "Hace 1 semana", icon: "⚡", link: "#" }
        ]);
      }
    } catch (err) {
      console.error(err);
      setIaTitle("Disculpa, hubo un inconveniente al conectar con la IA de ventas. Pregúntame de nuevo o revisa las secciones.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full h-screen flex flex-col md:flex-row bg-white snap-start overflow-hidden relative">
      
      {/* Columna Izquierda: Contenido Principal */}
      <div className="flex-1 h-full flex flex-col justify-between pt-20 pb-6 px-6 md:px-10 lg:px-14 relative overflow-hidden z-10 bg-white">
        
        {/* Header Superior del Hub */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 w-full mb-4 z-10">
          {/* Píldoras de Categorías */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-full text-xs font-semibold shadow-sm cursor-pointer hover:bg-neutral-900 transition-colors">
              <img src="/Seed/diente.png" alt="DentaXy AI" className="w-3.5 h-3.5 object-contain" />
              DENTAXY AI
            </span>
            {["Todos", "Noticias", "Casos Clínicos", "Guías", "Recomendados"].map((cat) => (
              <span 
                key={cat} 
                className="px-4 py-2 bg-slate-50 hover:bg-black hover:text-white hover:border-black text-gray-600 rounded-full text-xs font-semibold border border-gray-200/50 transition-all duration-300 cursor-pointer shadow-sm"
              >
                {cat} +
              </span>
            ))}
          </div>
          
          {/* Selector de Idioma */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold cursor-pointer bg-slate-50 px-3 py-1.5 rounded-full border border-gray-200/50 self-start sm:self-auto hover:bg-slate-100 transition-colors">
            <Globe className="w-3.5 h-3.5" />
            <span>ES</span>
            <span className="text-[10px]">▼</span>
          </div>
        </div>

        {/* Sección Central: Artículo Destacado */}
        <div className="flex-1 flex flex-col justify-center relative my-2 z-10">
          
          {/* Contenido del Artículo */}
          <div className="max-w-xs z-10">
            <span className="inline-block px-2.5 py-0.5 bg-emerald-400 text-white rounded text-[9px] font-black uppercase tracking-wider mb-2 border border-emerald-300/30 shadow-[0_0_8px_#34d399]">
              {onboardingSteps[step].tag}
            </span>
            <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-2 font-semibold">
              <span>Redacción Médica IA</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Hace 2 horas</span>
            </div>
            
            <h2 className="text-xl md:text-2xl lg:text-[28px] font-extrabold text-slate-800 tracking-tight leading-snug mb-3">
              {onboardingSteps[step].title}
            </h2>
            
            {step === 0 && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] text-gray-400 font-bold bg-slate-50 px-2 py-0.5 rounded border border-gray-200/50">#RedaccionLocal</span>
                <span className="text-[10px] text-gray-400 font-bold bg-slate-50 px-2 py-0.5 rounded border border-gray-200/50">#SoberaniaDeDatos</span>
              </div>
            )}

            {step > 0 && step < 4 && (
              <div className="flex items-center gap-1.5 mb-4">
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

            <button 
              onClick={handleMainButtonClick}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all border border-gray-200 group"
            >
              {onboardingSteps[step].btnText}
              <ArrowRight className="w-3.5 h-3.5 text-emerald-500 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

        {/* Video de Animación de Dentaxy AI en la posición central del orbe */}
        <div className="absolute top-[48%] left-[58%] md:left-[61%] lg:left-[63%] -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] md:w-[320px] md:h-[320px] lg:w-[380px] lg:h-[380px] flex items-center justify-center z-0 pointer-events-none">
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

        {/* Sección Inferior: 3 Columnas de Artículos Secundarios (U Opciones de Onboarding) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100 w-full mt-2 z-10">
          {(step === 0 || step === 4 ? articulosOriginales : onboardingSteps[step].options || []).map((art, idx) => (
            <div 
              key={idx} 
              onClick={() => handleCardClick(idx)}
              className="flex flex-col justify-between group cursor-pointer p-4 rounded-xl hover:bg-black transition-all duration-300 border border-transparent hover:border-black shadow-sm"
            >
              <div>
                <span className="text-[10px] text-slate-600 group-hover:text-slate-400 font-extrabold uppercase tracking-wide transition-colors duration-300">{art.cat}</span>
                <h4 className="text-[13px] md:text-sm font-bold text-slate-800 group-hover:text-white transition-colors duration-300 mt-1 mb-1 line-clamp-2">
                  {art.title}
                </h4>
                <p className="text-xs text-gray-500 group-hover:text-slate-300 transition-colors duration-300 line-clamp-2 leading-relaxed">
                  {art.desc}
                </p>
              </div>
              <div className="w-6 h-0.5 bg-gray-200 group-hover:bg-emerald-400 transition-all duration-300 mt-2" />
            </div>
          ))}
        </div>

      </div>

      {/* Columna Derecha: Panel de Recomendados Vertical Completo (ocupa 100% alto) */}
      <div className="w-full md:w-[360px] lg:w-[420px] h-full bg-white border-t md:border-t-0 md:border-l border-gray-100 pt-24 pb-8 px-6 md:px-8 flex flex-col gap-6 overflow-y-auto shadow-[-12px_0_36px_rgba(0,0,0,0.02)] z-20">
        
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

        {/* Tarjeta Destacada con Filtro Gradiente Violeta (Dinámica) */}
        <div className="relative rounded-2xl overflow-hidden shadow-md group cursor-pointer aspect-[16/10] bg-slate-900 flex flex-col justify-end p-5 min-h-[160px]">
          {/* Imagen del Doctor */}
          <img 
            src="/lovable-uploads/dentist_avatar.png" 
            alt="Asistente de Ventas Dentaxy" 
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
                if (rec.link === "#") {
                  e.preventDefault();
                  setSearchValue(rec.title);
                  handleSearch(rec.title);
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
