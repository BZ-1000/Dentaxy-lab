import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  Zap,
  Flame,
  Trophy,
  Heart,
  BookOpen,
  Sparkles,
  ChevronRight,
  X,
  ShieldCheck,
  BookMarked,
  Check,
  Clock,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  Award,
  ArrowRight,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import confetti from "canvas-confetti";

// --- TIPOS DE DATOS DE LA LECCIÓN INTERACTIVA QUIZ ---

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string; // Explicación clínica de Dex AI
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  xp: number;
  status: "completed" | "active" | "locked";
  questions: QuizQuestion[];
  bibliography: {
    title: string;
    authors: string;
    reference: string;
  }[];
}

export interface Unit {
  id: string;
  unitNumber: number;
  title: string;
  description: string;
  badge: string;
  color: string;
  lessons: Lesson[];
}

const INITIAL_UNITS: Unit[] = [
  {
    id: "unit-1",
    unitNumber: 1,
    title: "Unidad 1: Bases del Aislamiento Absoluto",
    description: "Domina el control de humedad, selección de grapas e invaginación bajo la NOM-004.",
    badge: "Fundamentos Clínicos",
    color: "from-emerald-500 to-teal-600",
    lessons: [
      {
        id: "les-1-1",
        title: "Selección e Identificación de Grapas (Clamps)",
        subtitle: "Anatomía retentiva y adaptaciones por cuadrante",
        duration: "4 min",
        xp: 50,
        status: "completed",
        questions: [
          {
            id: "q-1-1-1",
            question: "¿Cuál es el propósito clínico obligatorio de colocar una ligadura de hilo dental (30 cm) en la grapa antes de llevarla a boca?",
            options: [
              "Aumentar la fuerza de retención sobre el ecuador del diente.",
              "Prevenir la aspiración o ingesta accidental en caso de fractura metálica (Norma NOM-004).",
              "Facilitar la invaginación del hule en la papila interdental.",
              "Evitar la decoloración del esmalte por contacto directo.",
            ],
            correctIndex: 1,
            explanation:
              "Dex AI: De acuerdo con la norma NOM-004 y los protocolos de bioseguridad, la ligadura de seguridad es indispensable para recuperar inmediatamente la grapa si el metal se fractura por fatiga bajo tensión.",
          },
          {
            id: "q-1-1-2",
            question: "En un premolar superior con poca retención cervical, ¿qué grapa es la recomendada para evitar laceración de la encía libre?",
            options: [
              "Grapa #8A de bocado subgingival profundo.",
              "Grapa #00 o #2A de bocado estrecho y plano.",
              "Grapa #205 para molares inferiores.",
              "Grapa #212 de doble arco.",
            ],
            correctIndex: 1,
            explanation:
              "Dex AI: Las grapas #00 y #2A poseen un diseño adaptado para cuellos premolares estrechos, brindando estabilidad sin traumatizar la inserción epitelial.",
          },
        ],
        bibliography: [
          {
            title: "Sturdevant's Art and Science of Operative Dentistry",
            authors: "Ritter, A. V., Boushell, L. W., & Walter, R.",
            reference: "7th Edition (2018), Chapter 8: Field Isolation & Moisture Control Protocols, pp. 142–158.",
          },
          {
            title: "Cohen's Pathways of the Pulp",
            authors: "Berman, L. H., & Hargreaves, K. M.",
            reference: "12th Edition (2020), Chapter 4: Tooth Isolation and Asepsis in Endodontic Therapy.",
          },
        ],
      },
      {
        id: "les-1-2",
        title: "Perforación Técnica del Dique de Goma",
        subtitle: "Uso de plantilla Ainsworth y espaciamiento interdental",
        duration: "5 min",
        xp: 50,
        status: "completed",
        questions: [
          {
            id: "q-1-2-1",
            question: "¿Cuál es la distancia recomendada entre las perforaciones de la plantilla para evitar pliegues o filtración salival interdental?",
            options: [
              "1 a 2 mm de separación.",
              "4 mm entre bordes de perforaciones adyacentes.",
              "8 mm entre cada orificio.",
              "10 mm de espaciamiento.",
            ],
            correctIndex: 1,
            explanation:
              "Dex AI: Un espacio aproximado de 4 mm de hule sin perforar asegura que la papila interdental quede cubierta sin generar tensión excesiva ni pliegues redundantes.",
          },
          {
            id: "q-1-2-2",
            question: "¿Qué orificio de la perforadora Ainsworth se debe seleccionar para un molar ancla que llevará grapa?",
            options: [
              "Orificio menor #1.",
              "Orificio mediano #3.",
              "Orificio mayor #5.",
              "Orificio #2.",
            ],
            correctIndex: 2,
            explanation:
              "Dex AI: El orificio #5 (el más grande) está diseñado específicamente para molares ancla con grapa, permitiendo el paso del arco sin desgarro.",
          },
        ],
        bibliography: [
          {
            title: "Journal of Conservative Dentistry",
            authors: "Madhavan, S., et al.",
            reference: "Evaluación de la filtración microbiana en aislamiento absoluto con dique de hule mediano (2021).",
          },
        ],
      },
      {
        id: "les-1-3",
        title: "Inversión de Bordes e Invaginación en Surco Gingival",
        subtitle: "Sellado periférico hermético para evitar filtración salival",
        duration: "6 min",
        xp: 75,
        status: "active",
        questions: [
          {
            id: "q-1-3-1",
            question: "¿Hacia qué dirección clínica debe empujarse el borde del dique de goma para lograr la invaginación y sellado hermético?",
            options: [
              "En sentido oclusal / incisal.",
              "En sentido apical, introduciéndose suavemente hacia el surco gingival.",
              "Hacia los carrillos laterales.",
              "En sentido vestibular únicamente.",
            ],
            correctIndex: 1,
            explanation:
              "Dex AI: La invaginación empuja el borde del dique en dirección apical dentro del surco gingival. Al aplicar aire seco, el hule se enrolla creando una trampa física infranqueable contra la saliva y el fluido crevicular.",
          },
          {
            id: "q-1-3-2",
            question: "¿Qué maniobra combinada es ideal para fijar la invaginación en dientes anteriores sin necesidad de colocar grapas adicionales?",
            options: [
              "Hilo dental con nudo de cirujano en el cuello dentario + secado continuo con jeringa triple.",
              "Grabado con ácido fosfórico al 37% sobre el hule.",
              "Aplicación de cemento resinoso dual en el margen.",
              "Colocación de matriz metálica tofflemire.",
            ],
            correctIndex: 0,
            explanation:
              "Dex AI: El nudo de cirujano con hilo dental mantiene el dique comprimido apicalmente en el cuello del diente anterior sin requerir anestesia ni traumatizar el periodonto con grapas.",
          },
          {
            id: "q-1-3-3",
            question: "¿Qué indicador visual confirma que el campo operatorio tiene un aislamiento hermético perfecto?",
            options: [
              "Presencia de humedad brillante alrededor del margen.",
              "Ausencia total de pliegues y dique invaginado hacia el surco sin saliva visible.",
              "El dique de goma estirado hacia la cavidad oral.",
              "Bordes del hule levantados hacia oclusal.",
            ],
            correctIndex: 1,
            explanation:
              "Dex AI: El campo debe lucir completamente seco, mate y con el hule ajustado alrededor de cada diente libre de filtraciones.",
          },
        ],
        bibliography: [
          {
            title: "Sturdevant's Art and Science of Operative Dentistry",
            authors: "Ritter, A. V., et al.",
            reference: "7th Edition, Chapter 8: Rubber Dam Invagination Techniques, pp. 159–165.",
          },
          {
            title: "Operative Dentistry Journal",
            authors: "Magne, P., & Rubber Dam Study Group",
            reference: "Hermetic sealing efficiency in adhesive restorations (2019).",
          },
        ],
      },
    ],
  },
  {
    id: "unit-2",
    unitNumber: 2,
    title: "Unidad 2: Protocolos de Cementación Adhesiva",
    description: "Aprende el acondicionamiento de Zirconia, uso de cemento resinoso dual y curado por capas.",
    badge: "Rehabilitación Oral",
    color: "from-indigo-500 to-purple-600",
    lessons: [
      {
        id: "les-2-1",
        title: "Preparación y Grabado de Superficie para Zirconia",
        subtitle: "Arenado con alúmina y aplicación de primer MDP",
        duration: "5 min",
        xp: 60,
        status: "active",
        questions: [
          {
            id: "q-2-1-1",
            question: "Por criterio de adhesión química, ¿por qué NUNCA se debe limpiar la superficie interna de una restauración de Zirconia con Ácido Fosfórico?",
            options: [
              "Porque desgasta en exceso la estructura cristalina del zirconio.",
              "Porque los fosfatos del ácido ocupan los sitios reactivos del circonio e impiden el enlace químico con el primer 10-MDP.",
              "Porque produce tinción verdosa irreversible en el margen cerámico.",
              "Porque acelera peligrosamente la polimerización del cemento.",
            ],
            correctIndex: 1,
            explanation:
              "Dex AI: El ácido fosfórico deja residuos de fosfato que contaminan la superficie de la zirconia. Si se contamina con saliva o prueba en boca, debe limpiarse con Ivoclean (solución alcalina) o re-arenarse, NUNCA con ácido fosfórico.",
          },
          {
            id: "q-2-1-2",
            question: "¿Cuál es el tratamiento biomecánico estándar para micro-arenar la cara interna de una corona de Zirconia?",
            options: [
              "Grabado con ácido fluorhídrico al 9.5% por 20 segundos.",
              "Arenado con partículas de óxido de aluminio (Al2O3) de 50 µm a 2 bares de presión.",
              "Lavado únicamente con agua destilada a presión.",
              "Pulido con disco de caucho de grano grueso.",
            ],
            correctIndex: 1,
            explanation:
              "Dex AI: El arenado con alúmina a baja presión (2 bares) genera microrrugosidades esenciales para la traba mecánica sin inducir microfracturas de fase monoclínica.",
          },
        ],
        bibliography: [
          {
            title: "Contemporary Fixed Prosthodontics",
            authors: "Rosenstiel, S. F., Land, M. F., & Fujimoto, J.",
            reference: "5th Edition (2016), Chapter 26: Resin Luting Agents and Zirconia Surface Treatment.",
          },
          {
            title: "Journal of Adhesive Dentistry",
            authors: "Blatz, M. B., et al.",
            reference: "Resin-ceramic bonding protocols for high-strength ceramics (2020).",
          },
        ],
      },
      {
        id: "les-2-2",
        title: "Aplicación y Manipulación de Cemento Resinoso Dual",
        subtitle: "Mezcla homogénea, tiempo de trabajo y polimerización",
        duration: "6 min",
        xp: 75,
        status: "locked",
        questions: [],
        bibliography: [
          {
            title: "Journal of Adhesive Dentistry",
            authors: "Blatz, M. B., et al.",
            reference: "Resin-ceramic bonding: A review of the literature (2020).",
          },
        ],
      },
      {
        id: "les-2-3",
        title: "Fotocurado por Capas y Eliminación de Excesos",
        subtitle: "Técnica de gelificación rápida (Tack Cure 2-3s)",
        duration: "4 min",
        xp: 50,
        status: "locked",
        questions: [],
        bibliography: [
          {
            title: "Contemporary Fixed Prosthodontics",
            authors: "Rosenstiel, S. F., et al.",
            reference: "5th Edition, Chapter 26: Margin Cleaning Protocols.",
          },
        ],
      },
    ],
  },
  {
    id: "unit-3",
    unitNumber: 3,
    title: "Unidad 3: Endodoncia Básica & Conductometría",
    description: "Aperturas camerales, desbridamiento e instrumentación NiTi de última generación.",
    badge: "Próximamente Bloqueado",
    color: "from-zinc-400 to-zinc-600",
    lessons: [
      {
        id: "les-3-1",
        title: "Localización de Conductos y Apertura Cameral",
        subtitle: "Criterios anatómicos para molares e incisivos",
        duration: "7 min",
        xp: 80,
        status: "locked",
        questions: [],
        bibliography: [
          {
            title: "Cohen's Pathways of the Pulp",
            authors: "Berman, L. H., & Hargreaves, K. M.",
            reference: "12th Edition, Chapter 6: Access Cavity Preparation.",
          },
        ],
      },
    ],
  },
];

export default function DentaxyAcademyCursos() {
  const navigate = useNavigate();

  // Estados gamificados Duolingo
  const [streakDays, setStreakDays] = useState(7);
  const [dexXP, setDexXP] = useState(1250);
  const [userLevel] = useState("Nivel 4 • Interno Dental");
  const [hearts, setHearts] = useState(5);
  const [units, setUnits] = useState<Unit[]>(INITIAL_UNITS);

  // ESTADO DE LA SESIÓN DE PRÁCTICA QUIZ INTERACTIVA DUOLINGO
  const [activeQuizLesson, setActiveQuizLesson] = useState<Lesson | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  // Calcular progreso total de la carrera
  const totalLessons = units.flatMap(u => u.lessons).length;
  const completedLessonsCount = units.flatMap(u => u.lessons).filter(l => l.status === "completed").length;
  const overallProgressPercent = Math.round((completedLessonsCount / totalLessons) * 100);

  // Iniciar lección interactiva (Quiz Mode)
  const handleOpenLessonQuiz = (lesson: Lesson) => {
    if (lesson.status === "locked") {
      toast.error("Lección Bloqueada 🔒", {
        description: "Completa las lecciones previas en el camino de aprendizaje para desbloquear esta unidad.",
      });
      return;
    }

    if (!lesson.questions || lesson.questions.length === 0) {
      toast.info("Lección en desarrollo", {
        description: "Esta lección se desbloqueará próximamente con nuevos casos clínicos.",
      });
      return;
    }

    // Resetear estados del Quiz
    setActiveQuizLesson(lesson);
    setCurrentQuestionIdx(0);
    setSelectedOptionIdx(null);
    setIsAnswerChecked(false);
    setIsCorrect(null);
    setQuizScore(0);
    setIsQuizCompleted(false);
  };

  // Comprobar respuesta de la pregunta actual
  const handleCheckAnswer = () => {
    if (selectedOptionIdx === null || !activeQuizLesson) return;

    const currentQuestion = activeQuizLesson.questions[currentQuestionIdx];
    const correct = selectedOptionIdx === currentQuestion.correctIndex;

    setIsAnswerChecked(true);
    setIsCorrect(correct);

    if (correct) {
      setQuizScore(prev => prev + 1);
      // Disparar confeti pequeño de respuesta correcta
      try {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.8 },
        });
      } catch {
        // Fallback
      }
    } else {
      // Restar una vida si se equivoca
      setHearts(prev => Math.max(0, prev - 1));
    }
  };

  // Avanzar a la siguiente pregunta o finalizar el Quiz
  const handleNextQuestion = () => {
    if (!activeQuizLesson) return;

    if (currentQuestionIdx + 1 < activeQuizLesson.questions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOptionIdx(null);
      setIsAnswerChecked(false);
      setIsCorrect(null);
    } else {
      // FINALIZACIÓN DEL QUIZ DE LA LECCIÓN
      setIsQuizCompleted(true);
      const earnedXP = activeQuizLesson.xp;
      setDexXP(prev => prev + earnedXP);
      setStreakDays(prev => prev + 1);

      // Lanzar confeti de celebración
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // Fallback
      }

      // Actualizar lección a completada en el camino de aprendizaje
      setUnits(prevUnits =>
        prevUnits.map(unit => {
          const updatedLessons = unit.lessons.map((les, idx, arr) => {
            if (les.id === activeQuizLesson.id) {
              return { ...les, status: "completed" as const };
            }
            if (idx > 0 && arr[idx - 1].id === activeQuizLesson.id && les.status === "locked") {
              return { ...les, status: "active" as const };
            }
            return les;
          });
          return { ...unit, lessons: updatedLessons };
        })
      );
    }
  };

  // Cerrar el modal del Quiz
  const handleCloseQuiz = () => {
    setActiveQuizLesson(null);
    setSelectedOptionIdx(null);
    setIsAnswerChecked(false);
    setIsCorrect(null);
    setIsQuizCompleted(false);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50/70 text-zinc-900 font-sans selection:bg-emerald-500 selection:text-white relative pb-28">
      {/* DECORACIÓN AMBIENTAL ELEGANTE */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl" />
      </div>

      {/* TOP NAVIGATION BAR TOTAL WHITE / GLASSMORPHISM */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Volver */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/academy")}
              className="p-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Academy</span>
            </button>
            <div className="h-4 w-px bg-zinc-200" />
            <span className="font-extrabold text-base sm:text-lg text-zinc-900 font-sans">
              Cursos & <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-black">Guías Clínicas</span>
            </span>
          </div>

          {/* DASHBOARD DUOLINGO GAMIFICADO EN HEADER */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Racha */}
            <div
              className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-xs font-bold text-amber-700 shadow-2xs"
              title="Días seguidos de estudio"
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce-subtle" />
              <span>{streakDays} Días</span>
            </div>

            {/* Dex XP */}
            <div
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full text-xs font-bold text-emerald-700 shadow-2xs"
              title="Puntos de experiencia clínica acumulados"
            >
              <Zap className="w-4 h-4 text-emerald-600 fill-emerald-500" />
              <span>{dexXP} XP</span>
            </div>

            {/* Vidas / Corazones */}
            <div
              className="flex items-center gap-1 px-3 py-1 bg-rose-50 border border-rose-200/80 rounded-full text-xs font-bold text-rose-700 shadow-2xs"
              title="Vidas de práctica activa"
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>{hearts}/5</span>
            </div>

          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 pt-8">
        
        {/* DUOLINGO HERO PROGRESS BANNER */}
        <div className="mb-10 p-6 sm:p-7 bg-white/80 backdrop-blur-xl border border-zinc-200/80 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full text-[11px] font-extrabold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-emerald-600" />
              <span>{userLevel}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
              Ruta de Aprendizaje Clínico NOM-004
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500">
              Completa lecciones interactivas estilo Duolingo, responde preguntas clínicas de opción múltiple y respalda cada procedimiento con evidencia científica real.
            </p>

            {/* Barra de progreso global estilo Duolingo */}
            <div className="pt-3">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-700 mb-1.5">
                <span>Progreso Total del Plan</span>
                <span className="text-emerald-600">{overallProgressPercent}% Completado</span>
              </div>
              <div className="h-3.5 w-full bg-zinc-100 rounded-full overflow-hidden p-0.5 border border-zinc-200/70">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-full shadow-inner"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CAMINO DE APRENDIZAJE EN ZIGZAG (LEARNING PATH - DUOLINGO STYLE) */}
        <div className="space-y-16">
          {units.map(unit => (
            <section key={unit.id} className="relative">
              
              {/* HEADER DE LA UNIDAD */}
              <div className="mb-8 p-5 sm:p-6 bg-white/90 backdrop-blur-xl border border-zinc-200/80 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full text-[11px] font-extrabold uppercase tracking-wider mb-2 inline-block">
                    {unit.badge}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
                    {unit.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">{unit.description}</p>
                </div>

                <div className="shrink-0">
                  <span className="px-3 py-1.5 bg-zinc-900 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                    <BookOpen className="w-3.5 h-3.5" />
                    {unit.lessons.filter(l => l.status === "completed").length} / {unit.lessons.length} Lecciones
                  </span>
                </div>
              </div>

              {/* CAMINO EN ZIGZAG CON NODOS INTERACTIVOS */}
              <div className="relative py-4 flex flex-col items-center space-y-12">
                
                {/* LÍNEA CONECTORA PUNTUADA DE FONDO */}
                <div className="absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-1 border-r-2 border-dashed border-zinc-300 pointer-events-none z-0" />

                {unit.lessons.map((lesson, index) => {
                  const offsets = ["sm:-translate-x-16", "translate-x-0", "sm:translate-x-16"];
                  const offsetClass = offsets[index % offsets.length];

                  const isCompleted = lesson.status === "completed";
                  const isActive = lesson.status === "active";
                  const isLocked = lesson.status === "locked";

                  return (
                    <div
                      key={lesson.id}
                      className={`relative z-10 flex flex-col items-center ${offsetClass} transition-transform duration-300`}
                    >
                      {/* NODO CIRCULAR PRINCIPAL ESTILO DUOLINGO */}
                      <button
                        onClick={() => handleOpenLessonQuiz(lesson)}
                        disabled={isLocked}
                        className={`relative group w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
                          isCompleted
                            ? "bg-zinc-900 text-white shadow-xl border-4 border-emerald-400 hover:scale-105"
                            : isActive
                            ? "bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.5)] border-4 border-white ring-4 ring-emerald-200 animate-pulse hover:scale-110"
                            : "bg-zinc-200 text-zinc-400 border-4 border-zinc-300 opacity-60 cursor-not-allowed"
                        }`}
                      >
                        {/* ICONO DEL NODO */}
                        {isCompleted && <CheckCircle2 className="w-8 h-8 text-emerald-400" />}
                        {isActive && <Zap className="w-8 h-8 fill-white text-white animate-bounce-subtle" />}
                        {isLocked && <Lock className="w-7 h-7 text-zinc-400" />}

                        {/* PUNTOS XP BADGE EN EL NODO */}
                        <span
                          className={`absolute -bottom-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full border shadow-xs ${
                            isCompleted
                              ? "bg-emerald-500 text-white border-emerald-400"
                              : isActive
                              ? "bg-zinc-900 text-emerald-400 border-zinc-800"
                              : "bg-zinc-300 text-zinc-600 border-zinc-400"
                          }`}
                        >
                          +{lesson.xp} XP
                        </span>
                      </button>

                      {/* TÍTULO Y SUBTÍTULO DEBAJO DEL NODO */}
                      <div className="mt-4 text-center max-w-[200px]">
                        <h4
                          onClick={() => !isLocked && handleOpenLessonQuiz(lesson)}
                          className={`text-xs sm:text-sm font-bold tracking-tight leading-snug cursor-pointer ${
                            isCompleted ? "text-zinc-900" : isActive ? "text-emerald-700 font-extrabold" : "text-zinc-400"
                          }`}
                        >
                          {lesson.title}
                        </h4>
                        <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">
                          ⏱️ {lesson.duration}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* ========================================================= */}
      {/* MODAL DE SESIÓN DE PRÁCTICA / QUIZ INTERACTIVO DUOLINGO  */}
      {/* ========================================================= */}
      <AnimatePresence>
        {activeQuizLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-zinc-900/50 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white border border-zinc-200 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col relative"
            >
              {/* HEADER DEL QUIZ CON BARRA DE PROGRESO Y CORAZONES */}
              <div className="p-4 sm:p-6 border-b border-zinc-200 flex items-center justify-between gap-4 bg-white/90 backdrop-blur-md">
                <button
                  onClick={handleCloseQuiz}
                  className="p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 cursor-pointer"
                  title="Salir de la práctica"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Barra de progreso del Quiz */}
                {!isQuizCompleted && activeQuizLesson.questions.length > 0 && (
                  <div className="flex-1 max-w-md">
                    <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden p-0.5 border border-zinc-200">
                      <motion.div
                        className="h-full bg-emerald-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${((currentQuestionIdx + (isAnswerChecked ? 1 : 0)) / activeQuizLesson.questions.length) * 100}%`,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}

                {/* Vidas restantes */}
                <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 rounded-full text-xs font-extrabold text-rose-600">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>{hearts} Vidas</span>
                </div>
              </div>

              {/* CONTENIDO PRINCIPAL DE LA PREGUNTA */}
              <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
                {!isQuizCompleted ? (
                  activeQuizLesson.questions.length > 0 ? (
                    <div className="space-y-6">
                      
                      {/* Indicador de Pregunta */}
                      <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold">
                        <span>PREGUNTA {currentQuestionIdx + 1} DE {activeQuizLesson.questions.length}</span>
                        <span className="text-emerald-600 font-bold">+{activeQuizLesson.xp} XP al finalizar</span>
                      </div>

                      {/* Texto de la Pregunta */}
                      <h3 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight leading-snug">
                        {activeQuizLesson.questions[currentQuestionIdx].question}
                      </h3>

                      {/* Opciones de Respuesta */}
                      <div className="space-y-3 pt-2">
                        {activeQuizLesson.questions[currentQuestionIdx].options.map((option, idx) => {
                          const isSelected = selectedOptionIdx === idx;
                          let optionStyle = "border-zinc-200 bg-white hover:border-zinc-400 hover:bg-slate-50 text-zinc-800";

                          if (isSelected) {
                            optionStyle = "border-zinc-900 bg-zinc-900 text-white font-semibold shadow-md";
                          }

                          if (isAnswerChecked) {
                            if (idx === activeQuizLesson.questions[currentQuestionIdx].correctIndex) {
                              optionStyle = "border-emerald-500 bg-emerald-500 text-white font-bold shadow-md";
                            } else if (isSelected && !isCorrect) {
                              optionStyle = "border-rose-500 bg-rose-500 text-white font-bold";
                            }
                          }

                          return (
                            <button
                              key={idx}
                              disabled={isAnswerChecked}
                              onClick={() => setSelectedOptionIdx(idx)}
                              className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all duration-200 flex items-center justify-between cursor-pointer ${optionStyle}`}
                            >
                              <span className="pr-3">{option}</span>
                              {isAnswerChecked && idx === activeQuizLesson.questions[currentQuestionIdx].correctIndex && (
                                <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                              )}
                              {isAnswerChecked && isSelected && !isCorrect && (
                                <XCircle className="w-5 h-5 text-white shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                    </div>
                  ) : null
                ) : (
                  /* PANTALLA DE FELICITACIONES / COMPLETADO TIPO DUOLINGO */
                  <div className="text-center py-6 space-y-6">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg border-4 border-emerald-200 animate-bounce-subtle">
                      <Trophy className="w-10 h-10" />
                    </div>

                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                        ¡Lección Completada!
                      </h2>
                      <p className="text-sm text-zinc-500 mt-1">
                        Has superado los criterios clínicos con éxito.
                      </p>
                    </div>

                    {/* Stats de la lección */}
                    <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                      <div className="p-4 bg-slate-50 border border-zinc-200 rounded-2xl text-center">
                        <span className="block text-2xl font-black text-emerald-600">+{activeQuizLesson.xp}</span>
                        <span className="text-[11px] text-zinc-500 font-bold uppercase">Dex XP Ganados</span>
                      </div>
                      <div className="p-4 bg-slate-50 border border-zinc-200 rounded-2xl text-center">
                        <span className="block text-2xl font-black text-amber-500 flex items-center justify-center gap-1">
                          <Flame className="w-5 h-5 fill-amber-500" />
                          {streakDays}
                        </span>
                        <span className="text-[11px] text-zinc-500 font-bold uppercase">Racha de Días</span>
                      </div>
                    </div>

                    {/* SECCIÓN CRÍTICA: EVIDENCIA CIENTÍFICA / BIBLIOGRAFÍA MÉDICA REAL */}
                    <div className="text-left p-5 bg-zinc-900 text-white rounded-2xl space-y-3 shadow-md">
                      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                        <BookMarked className="w-5 h-5 text-emerald-400" />
                        <h4 className="text-xs font-bold tracking-tight text-white uppercase tracking-wider">
                          Evidencia Científica & Bibliografía Médica
                        </h4>
                      </div>

                      <div className="space-y-2 text-xs text-zinc-300">
                        {activeQuizLesson.bibliography.map((bib, idx) => (
                          <div key={idx} className="pl-3 border-l-2 border-emerald-500 space-y-0.5">
                            <p className="font-semibold text-white">{bib.title}</p>
                            <p className="text-zinc-400 text-[11px]">{bib.authors}</p>
                            <p className="text-emerald-400 font-mono text-[10px]">{bib.reference}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* BOTTOM SHEET DE FEEDBACK TIPO DUOLINGO */}
              {!isQuizCompleted && (
                <div
                  className={`p-5 border-t transition-all ${
                    isAnswerChecked
                      ? isCorrect
                        ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                        : "bg-rose-50 border-rose-300 text-rose-950"
                      : "bg-white border-zinc-200"
                  }`}
                >
                  <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    {!isAnswerChecked ? (
                      <div className="w-full flex items-center justify-between gap-4">
                        <span className="text-xs text-zinc-500 font-medium hidden sm:inline">
                          Selecciona una opción para comprobar tu respuesta.
                        </span>
                        <Button
                          disabled={selectedOptionIdx === null}
                          onClick={handleCheckAnswer}
                          className="w-full sm:w-auto ml-auto bg-zinc-900 hover:bg-zinc-800 text-white rounded-full px-8 py-2.5 text-xs font-bold shadow-md cursor-pointer disabled:opacity-40"
                        >
                          Comprobar Respuesta
                        </Button>
                      </div>
                    ) : (
                      <div className="w-full space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            {isCorrect ? (
                              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                            ) : (
                              <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                            )}
                            <div>
                              <h4 className="text-sm font-extrabold">
                                {isCorrect ? "¡Excelente! Respuesta Clínicamente Correcta" : "Respuesta Incorrecta (-1 Vida)"}
                              </h4>
                              <p className="text-xs mt-0.5 leading-relaxed font-normal">
                                {activeQuizLesson.questions[currentQuestionIdx].explanation}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-2">
                          <Button
                            onClick={handleNextQuestion}
                            className={`rounded-full px-8 py-2.5 text-xs font-bold shadow-md cursor-pointer ${
                              isCorrect
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                : "bg-rose-600 hover:bg-rose-700 text-white"
                            }`}
                          >
                            Continuar <ArrowRight className="w-4 h-4 ml-1.5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* FOOTER BOTÓN CONTINUAR AL FINALIZAR */}
              {isQuizCompleted && (
                <div className="p-5 bg-white border-t border-zinc-200 flex justify-end">
                  <Button
                    onClick={handleCloseQuiz}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-full px-8 py-2.5 text-xs font-bold shadow-md cursor-pointer"
                  >
                    Volver al Camino de Aprendizaje
                  </Button>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
