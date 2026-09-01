import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  ShoppingBag,
  Users,
  Sparkles,
  Plus,
  Search,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Heart,
  Share2,
  Tag,
  Phone,
  ShieldCheck,
  MapPin,
  Bot,
  Zap,
  X,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  Building2,
  Stethoscope,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// --- DUMMY DATA INICIAL ---

interface QnAPost {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  timeAgo: string;
  category: string;
  content: string;
  likes: number;
  repliesCount: number;
  userLiked?: boolean;
  userSaved?: boolean;
  isPendingDex?: boolean;
  dexAnswer?: {
    id: string;
    timestamp: string;
    protocolName: string;
    confidence: string;
    content: string[];
    helpfulCount: number;
  };
}

interface MercadoItem {
  id: string;
  title: string;
  price: number;
  condition: "Nuevo empacado" | "Excelente estado (9/10)" | "Poco uso (8/10)" | "Seminuevo";
  seller: string;
  sellerRole: string;
  location: string;
  category: string;
  image: string;
  description: string;
  verifiedSeller: boolean;
}

interface PacienteSolicitud {
  id: string;
  title: string;
  requirement: string;
  clinicLocation: string;
  schedule: string;
  author: string;
  semester: string;
  urgency: "Alta" | "Media" | "Baja";
  status: "Cupo disponible" | "Evaluación previa" | "Gratuito para paciente";
  tags: string[];
}

const INITIAL_QNA: QnAPost[] = [
  {
    id: "qna-dex-featured",
    title: "¿Cómo estabilizar la lectura del localizador de ápice en un conducto calcificado con humedad retenida?",
    author: "Dra. Valeria R.",
    authorRole: "Residente de Endodoncia • UAZ",
    authorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
    timeAgo: "Hace 12 min",
    category: "Endodoncia",
    content:
      "Tengo un paciente de 45 años en clínica. El molar #46 presenta conductos mesiales extremadamente calcificados y el localizador de ápice marca valores erráticos entre 10mm y APEX instantáneamente. Ya irrigué con NaOCl 2.5%, pero persiste la inestabilidad. ¿Cuál es el protocolo exacto recomendado para estabilizar el circuito?",
    likes: 18,
    repliesCount: 0,
    isPendingDex: true,
    dexAnswer: {
      id: "dex-ans-01",
      timestamp: "Ahora mismo (Asistencia Automatizada Dex AI)",
      protocolName: "Protocolo Dex AI v2.4 • Permeabilización y Conductometría Electrónica",
      confidence: "99.4% Precisión Clínica",
      content: [
        "1. Secado de la Cámara de Acceso: El exceso de irrigante líquido en la cámara de acceso genera derivación eléctrica hacia la mucosa periodontal, dando lecturas falsas de 'APEX'. Seca exhaustivamente la cámara con torundas de algodón estéril y deseca el conducto solo en el tercio medio con puntas de papel calibre #15 o #20.",
        "2. Aislamiento y Gancho Labial: Asegúrate de que el clip de labio esté colocado directamente sobre mucosa sana y seca. Si la saliva toca la grapa o la mucosa, la resistencia cae a cero.",
        "3. Estrategia de Lima Guía: Utiliza una lima C-Pilot o K-Flexofile de acero inoxidable calibre #08 o #10 impregnada con EDTA en gel (no solución fluida). La viscosidad del gel previene cortocircuitos por inundación.",
        "4. Confirmación Radiográfica (NOM-004): En conductos con atresia severa, corrobora la longitud electrónica obligatoriamente con una radiografía periapical ortorradial con lima in-situ antes de proceder a la preparación biomecánica.",
      ],
      helpfulCount: 42,
    },
  },
  {
    id: "qna-2",
    title: "Diferencia en resistencia al cizallamiento entre adhesivos de 7ma y 8va generación en dentina esclerótica",
    author: "Dr. Carlos M.",
    authorRole: "Especialista en Rehabilitación Oral",
    authorAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
    timeAgo: "Hace 2 horas",
    category: "Operatoria & Adhesión",
    content:
      "En cavidades no cariosas de clase V con dentina hipermineralizada o esclerótica, ¿han notado mejor retención clínica aplicando grabado ácido selectivo previo con sistemas de 8va generación universales frente a autograbado estricto?",
    likes: 24,
    repliesCount: 4,
  },
  {
    id: "qna-3",
    title: "¿Qué hilo retractor y calibre recomiendan para toma de impresión con silicona por adición en margen subgingival?",
    author: "Sofía L.",
    authorRole: "Estudiante 7mo Semestre • CROID",
    authorAvatar: "https://images.unsplash.com/photo-1594824813570-78a333e1033d?w=150&auto=format&fit=crop&q=80",
    timeAgo: "Hace 5 horas",
    category: "Prótesis Fija",
    content:
      "Tengo mi primera prueba de preparación para corona de zirconio este viernes. El margen quedó 0.5mm subgingival. ¿Es mejor la técnica de doble hilo #000 y #0 o basta con hilo único #00 impregnado en sulfato férrico?",
    likes: 12,
    repliesCount: 6,
  },
];

const INITIAL_MERCADO: MercadoItem[] = [
  {
    id: "mer-1",
    title: "Articulador Semiajustable Bio-Art A7 Plus + Arco Facial Elite",
    price: 3850,
    condition: "Excelente estado (9/10)",
    seller: "Luis G.",
    sellerRole: "8vo Semestre • CROID",
    location: "Zacatecas, ZAC",
    category: "Prótesis & Oclusión",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&auto=format&fit=crop&q=80",
    description: "Incluye estuche rígido, pletinas magnéticas de repuesto y arco facial completo. Calibrado y listo para laboratorio.",
    verifiedSeller: true,
  },
  {
    id: "mer-2",
    title: "Pieza de Mano Alta Velocidad KaVo Push Button (4 Orificios)",
    price: 2100,
    condition: "Nuevo empacado",
    seller: "Dra. Elena P.",
    sellerRole: "Docente Odontología • UAZ",
    location: "Guadalupe, ZAC",
    category: "Instrumental Rotatorio",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&auto=format&fit=crop&q=80",
    description: "Cabezal torque con iluminación LED integrada, rodamientos cerámicos de alta durabilidad. Sellada en caja original.",
    verifiedSeller: true,
  },
  {
    id: "mer-3",
    title: "Kit de Fresas de Diamante Komet Prótesis Fija (24 piezas)",
    price: 650,
    condition: "Poco uso (8/10)",
    seller: "Mateo S.",
    sellerRole: "6to Semestre • UAZ",
    location: "Zacatecas, ZAC",
    category: "Operatoria",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500&auto=format&fit=crop&q=80",
    description: "Fresas grano grueso y fino para tallado de bizcocho, chaflán y hombro redondeado. Esterilizadas en autoclave.",
    verifiedSeller: false,
  },
  {
    id: "mer-4",
    title: "Kit de Aislamiento Hu-Friedy + Arco de Young + Perforador Ainsworth",
    price: 1200,
    condition: "Seminuevo",
    seller: "Ana Paula V.",
    sellerRole: "7mo Semestre • CROID",
    location: "Fresnillo, ZAC",
    category: "Aislamiento",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format&fit=crop&q=80",
    description: "Portagrapas e instrumental de acero inoxidable grado quirúrgico. Incluye 12 grapas variadas de premolar y molar.",
    verifiedSeller: true,
  },
];

const INITIAL_PACIENTES: PacienteSolicitud[] = [
  {
    id: "pac-1",
    title: "Paciente para Exodoncia Molar Superior (Cirugía Oral I)",
    requirement:
      "Diente #16 o #26 con indicación de extracción por caries no restaurable o restos radiculares. Paciente normotenso con radiografía periapical previa.",
    clinicLocation: "Clínica Odontológica UAZ Siglo XXI • Unidad 4",
    schedule: "Lunes y Miércoles • 9:00 AM a 11:30 AM",
    author: "Andrea M.",
    semester: "7mo Semestre",
    urgency: "Alta",
    status: "Cupo disponible",
    tags: ["Cirugía", "Exodoncia", "NOM-004 Compliant"],
  },
  {
    id: "pac-2",
    title: "Paciente Infantil para Pulpotomía o Caries Profunda (Odontopediatría)",
    requirement:
      "Paciente pediátrico (5 a 9 años) con lesión cariosa en 2do molar primario sin sintomatología pulpar espontánea ni fístula visible.",
    clinicLocation: "Clínica Pediatría CROID",
    schedule: "Jueves • 3:00 PM",
    author: "Jorge H.",
    semester: "8vo Semestre",
    urgency: "Media",
    status: "Evaluación previa",
    tags: ["Pediatría", "Pulpotomía", "Profilaxis"],
  },
  {
    id: "pac-3",
    title: "Paciente para Tratamiento de Endodoncia Unirradicular",
    requirement:
      "Diente anterior superior (#11, #12 o #21) con diagnóstico de pulposis o necrosis sin curvatura apical severa.",
    clinicLocation: "Clínica Endodoncia UAZ",
    schedule: "Martes • 11:00 AM",
    author: "Fernanda C.",
    semester: "Residente Diplomado",
    urgency: "Media",
    status: "Gratuito para paciente",
    tags: ["Endodoncia", "Anteriores", "Atención Gratuita"],
  },
  {
    id: "pac-4",
    title: "Paciente para Profilaxis Profunda y Detartraje (Periodoncia)",
    requirement:
      "Paciente adulto con presencia de cálculo supragingival y subgingival moderado a severo. Tratamiento 100% gratuito.",
    clinicLocation: "Clínica Integral Dentaxy",
    schedule: "Viernes • 8:00 AM",
    author: "Daniel K.",
    semester: "5to Semestre",
    urgency: "Baja",
    status: "Gratuito para paciente",
    tags: ["Periodoncia", "Limpieza", "Gratis"],
  },
];

export default function ClubPage() {
  const navigate = useNavigate();

  // Estados principales
  const [activeTab, setActiveTab] = useState<"dudas" | "mercado" | "pacientes">("dudas");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  // Modo Desarrollador / Demo Dex AI
  const [dexTriggered, setDexTriggered] = useState(true); // Inicialmente activado para impresionar
  const [isAnalyzingDex, setIsAnalyzingDex] = useState(false);

  // Listas de datos dinámicas en memoria
  const [qnaList, setQnaList] = useState<QnAPost[]>(INITIAL_QNA);
  const [mercadoList] = useState<MercadoItem[]>(INITIAL_MERCADO);
  const [pacientesList] = useState<PacienteSolicitud[]>(INITIAL_PACIENTES);

  // Formulario nueva publicación
  const [newPostType, setNewPostType] = useState<"duda" | "mercado" | "paciente">("duda");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory] = useState("General");

  // Manejar activación manual de Dex AI
  const handleToggleDexAI = () => {
    if (dexTriggered) {
      setDexTriggered(false);
      toast.info("Respuesta de Dex AI ocultada", {
        description: "Haz clic en 'Forzar respuesta de Dex' para ver la simulación en vivo.",
      });
    } else {
      setIsAnalyzingDex(true);
      toast.loading("Dex AI analizando caso clínico...", { id: "dex-loading" });
      setTimeout(() => {
        setIsAnalyzingDex(false);
        setDexTriggered(true);
        toast.dismiss("dex-loading");
        toast.success("¡Dex AI ha resuelto la duda clínica!", {
          description: "Respuesta determinista local generada en 0.2s sin latencia externa.",
        });
      }, 900);
    }
  };

  // Manejar Like
  const handleLikePost = (id: string) => {
    setQnaList(prev =>
      prev.map(item => {
        if (item.id === id) {
          const liked = !item.userLiked;
          return {
            ...item,
            userLiked: liked,
            likes: liked ? item.likes + 1 : item.likes - 1,
          };
        }
        return item;
      })
    );
  };

  // Crear post nuevo
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error("Por favor completa el título y la descripción.");
      return;
    }

    if (newPostType === "duda") {
      const newEntry: QnAPost = {
        id: `qna-${Date.now()}`,
        title: newTitle,
        content: newContent,
        category: newCategory || "General",
        author: "Tú (Usuario Dentaxy)",
        authorRole: "Estudiante de Odontología",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        timeAgo: "Hace un momento",
        likes: 1,
        repliesCount: 0,
      };
      setQnaList([newEntry, ...qnaList]);
      toast.success("¡Duda clínica publicada exitosamente en el Club!");
    } else {
      toast.success("¡Publicación enviada a la comunidad!");
    }

    setNewTitle("");
    setNewContent("");
    setShowNewPostModal(false);
  };

  // Filtrado simple
  const filteredQna = qnaList.filter(
    item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMercado = mercadoList.filter(
    item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.seller.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPacientes = pacientesList.filter(
    item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.requirement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.clinicLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-slate-50/70 text-zinc-900 font-sans selection:bg-emerald-500 selection:text-white relative pb-24">
      {/* BACKGROUND DECORATION ELEGANTE GLASSMORPHISM */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-200/50 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-indigo-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl" />
      </div>

      {/* TOP NAVIGATION BAR TOTAL WHITE / GLASSMORPHISM */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Lado Izquierdo: Volver y Branding */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/academy")}
              className="p-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Volver a Dentaxy Academy"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Academy</span>
            </button>
            <div className="h-4 w-px bg-zinc-200" />
            
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg text-zinc-900 font-sans flex items-center gap-1.5">
                Dentaxy <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-black">Club</span>
              </span>
              <span className="hidden md:inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Gremio Dental
              </span>
            </div>
          </div>

          {/* Centro: Search Input */}
          <div className="flex-1 max-w-md hidden sm:block relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar dudas clínicas, materiales o pacientes..."
              className="pl-9 pr-4 py-1.5 h-9 bg-zinc-100/80 border-transparent focus:border-zinc-300 focus:bg-white text-xs rounded-full transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Lado Derecho: Controles y Botón Nuevo Post */}
          <div className="flex items-center gap-2">
            {/* Botón Modo Dev Dex AI */}
            <button
              onClick={handleToggleDexAI}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer shadow-sm ${
                dexTriggered
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                  : "bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200"
              }`}
              title="Alternar respuesta de Dex AI para la demo"
            >
              <Zap className={`w-3.5 h-3.5 ${dexTriggered ? "text-emerald-600 fill-emerald-500" : ""}`} />
              <span className="hidden md:inline">
                {dexTriggered ? "Dex AI: Activo" : "Forzar Dex AI"}
              </span>
            </button>

            {/* Crear Publicación */}
            <Button
              onClick={() => setShowNewPostModal(true)}
              className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-full px-4 py-1.5 h-9 text-xs font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* HERO SECTION DECORATIVA TOTAL WHITE */}
        <div className="mb-8 p-6 sm:p-8 bg-white/80 backdrop-blur-xl border border-zinc-200/80 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 rounded-full border border-zinc-200 text-zinc-600 text-[11px] font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Red Social & Foro Odontológico de México</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight mb-2 font-sans">
              Dentaxy <span className="text-zinc-500 font-light">Academy Club</span>
            </h1>
            <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
              Resuelve dudas clínicas al instante con la asistencia local de{" "}
              <strong className="text-emerald-700 font-semibold">Dex AI</strong>, adquiere o vende instrumental entre universitarios e intercambia requerimientos de pacientes bajo la norma NOM-004.
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
            <div className="p-3 bg-zinc-50 border border-zinc-200/70 rounded-2xl text-center">
              <span className="block text-xl font-bold text-zinc-900">1,492</span>
              <span className="text-[11px] text-zinc-500 font-medium">Miembros activos</span>
            </div>
            <div className="p-3 bg-emerald-50/60 border border-emerald-200/70 rounded-2xl text-center">
              <span className="block text-xl font-bold text-emerald-700 flex items-center justify-center gap-1">
                <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                99.8%
              </span>
              <span className="text-[11px] text-emerald-800 font-medium">Respuestas Dex AI</span>
            </div>
          </div>
        </div>

        {/* MENÚ DE PESTAÑAS (3 SECCIONES PRINCIPALES) */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-white/90 backdrop-blur-md border border-zinc-200/80 p-1.5 rounded-2xl shadow-sm inline-flex gap-1 w-full max-w-2xl">
            
            {/* Pestaña 1: Dudas Clínicas */}
            <button
              onClick={() => setActiveTab("dudas")}
              className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "dudas"
                  ? "bg-zinc-900 text-white shadow-md"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Dudas Clínicas</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-mono">
                Q&A
              </span>
            </button>

            {/* Pestaña 2: Mercado Dental */}
            <button
              onClick={() => setActiveTab("mercado")}
              className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "mercado"
                  ? "bg-zinc-900 text-white shadow-md"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Mercado Dental</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-400 font-mono">
                Store
              </span>
            </button>

            {/* Pestaña 3: Intercambio de Pacientes */}
            <button
              onClick={() => setActiveTab("pacientes")}
              className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "pacientes"
                  ? "bg-zinc-900 text-white shadow-md"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Pacientes</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-full text-[10px] bg-indigo-500/20 text-indigo-400 font-mono">
                NOM-004
              </span>
            </button>

          </div>
        </div>

        {/* BUSCADOR MÓVIL */}
        <div className="sm:hidden mb-6">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar en el Club..."
              className="pl-9 pr-4 py-2 bg-white border-zinc-200 text-xs rounded-xl"
            />
          </div>
        </div>

        {/* CONTENIDO DE LAS PESTAÑAS */}
        <AnimatePresence mode="wait">
          
          {/* ======================================================== */}
          {/* PESTAÑA 1: DUDAS CLÍNICAS (Q&A) CON INTEGRACIÓN DEX AI  */}
          {/* ======================================================== */}
          {activeTab === "dudas" && (
            <motion.div
              key="tab-dudas"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {filteredQna.map(post => {
                const isFeatured = post.id === "qna-dex-featured";

                return (
                  <article
                    key={post.id}
                    className={`bg-white/80 backdrop-blur-xl border rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all ${
                      isFeatured ? "border-emerald-300/80 bg-white" : "border-zinc-200/80"
                    }`}
                  >
                    {/* Header de la Pregunta */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.authorAvatar}
                          alt={post.author}
                          className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-zinc-900">{post.author}</h4>
                            <span className="text-xs text-zinc-400">• {post.timeAgo}</span>
                          </div>
                          <p className="text-xs text-zinc-500">{post.authorRole}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-full text-xs font-semibold">
                          {post.category}
                        </span>
                        {isFeatured && !dexTriggered && (
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[11px] font-bold animate-pulse flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Esperando Dex AI (&lt;10m)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Título y Cuerpo */}
                    <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-3 tracking-tight leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-sm text-zinc-600 leading-relaxed mb-6 font-normal">
                      {post.content}
                    </p>

                    {/* INTERVENCIÓN REVOLUCIONARIA DE DEX AI (ASISTENTE ASISTIDO LOCAL) */}
                    {isFeatured && (
                      <div className="mt-6 mb-6">
                        {isAnalyzingDex && (
                          <div className="p-6 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl flex items-center justify-center gap-3 text-emerald-800 text-sm font-semibold animate-pulse">
                            <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
                            <span>Dex AI está analizando los criterios clínicos del caso...</span>
                          </div>
                        )}

                        {!dexTriggered && !isAnalyzingDex && (
                          <div className="p-4 bg-zinc-50 border border-dashed border-zinc-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                            <div className="flex items-center gap-2 text-xs text-zinc-600">
                              <Bot className="w-4 h-4 text-emerald-600" />
                              <span>Esta pregunta aún no tiene respuesta de humanos. Dex AI entrará a resolver en 10 min.</span>
                            </div>
                            <Button
                              onClick={handleToggleDexAI}
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-full px-4 cursor-pointer"
                            >
                              <Zap className="w-3.5 h-3.5 mr-1 fill-white" />
                              Forzar respuesta de Dex
                            </Button>
                          </div>
                        )}

                        {dexTriggered && post.dexAnswer && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="relative border border-emerald-400/50 rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-emerald-50/80 via-white/95 to-teal-50/60 backdrop-blur-xl shadow-[0_10px_35px_rgba(16,185,129,0.12)] overflow-hidden"
                          >
                            {/* Aura Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-300/30 rounded-full blur-2xl pointer-events-none" />

                            {/* Badge Cabeza de Dex */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-emerald-200/80">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-emerald-400 flex items-center justify-center shadow-md border border-emerald-500/40 shrink-0">
                                  <Zap className="w-5 h-5 fill-emerald-400" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-extrabold text-sm text-zinc-900 tracking-wide font-sans">
                                      Dex AI Assistant
                                    </span>
                                    <span className="px-2 py-0.5 bg-emerald-500 text-white rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                                      Asistente Oficial
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-emerald-800 font-medium">
                                    {post.dexAnswer.protocolName}
                                  </p>
                                </div>
                              </div>

                              <div className="text-right hidden sm:block">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  {post.dexAnswer.confidence}
                                </span>
                              </div>
                            </div>

                            {/* Pasos clínicos redactados determinísticamente */}
                            <div className="space-y-3 text-xs sm:text-sm text-zinc-700 leading-relaxed font-sans">
                              <p className="font-semibold text-zinc-900">
                                Protocolo clínico recomendado para conductometría en conductos con atresia calcificada:
                              </p>
                              {post.dexAnswer.content.map((step, idx) => (
                                <div key={idx} className="p-3 bg-white/90 border border-emerald-100 rounded-xl shadow-2xs text-zinc-800">
                                  {step}
                                </div>
                              ))}
                            </div>

                            {/* Footer de Feedback Dex */}
                            <div className="mt-5 pt-3 border-t border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
                              <span className="font-medium flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                Respuesta determinista local • Sin costo de API externa
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-zinc-500">
                                  ¿Fue útil? ({post.dexAnswer.helpfulCount})
                                </span>
                                <button
                                  onClick={() => toast.success("¡Gracias por tu retroalimentación!")}
                                  className="p-1.5 hover:bg-emerald-100 rounded-lg text-emerald-700 transition-colors cursor-pointer"
                                >
                                  <ThumbsUp className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Acciones e Interacción del Post */}
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100 text-xs text-zinc-500">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center gap-1.5 hover:text-rose-600 transition-colors cursor-pointer ${
                            post.userLiked ? "text-rose-600 font-bold" : ""
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${post.userLiked ? "fill-rose-600 text-rose-600" : ""}`} />
                          <span>{post.likes} Me gusta</span>
                        </button>

                        <button className="flex items-center gap-1.5 hover:text-zinc-900 transition-colors cursor-pointer">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.repliesCount} Respuestas</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toast.success("Enlace copiado al portapapeles")}
                          className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                          title="Compartir"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toast.info("Publicación guardada en tus marcadores")}
                          className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                          title="Guardar"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* PESTAÑA 2: MERCADO DENTAL (COMPRA Y VENTA GLASSMORPHISM) */}
          {/* ======================================================== */}
          {activeTab === "mercado" && (
            <motion.div
              key="tab-mercado"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
            >
              {filteredMercado.map(item => (
                <div
                  key={item.id}
                  className="bg-white/80 backdrop-blur-xl border border-zinc-200/80 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:border-zinc-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Header Imagen / Categoria */}
                    <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-5 bg-zinc-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold text-zinc-900 shadow-sm border border-white">
                        ${item.price.toLocaleString("es-MX")} MXN
                      </span>
                      <span className="absolute top-3 right-3 bg-zinc-900/80 text-white backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {item.condition}
                      </span>
                    </div>

                    {/* Vendedor */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{item.seller}</span>
                        {item.verifiedSeller && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100" />
                        )}
                        <span className="text-zinc-300">•</span>
                        <span>{item.sellerRole}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-zinc-900 mb-2 group-hover:text-emerald-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-600 line-clamp-2 mb-4 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Footer & Ubicación */}
                  <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-zinc-400">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{item.location}</span>
                    </div>
                    <Button
                      onClick={() =>
                        toast.success(`Abriendo chat con ${item.seller} para adquirir ${item.title}`)
                      }
                      size="sm"
                      className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs rounded-full px-4 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 mr-1.5" />
                      Contactar
                    </Button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* PESTAÑA 3: INTERCAMBIO DE PACIENTES (CUMPLIENDO NOM-004)  */}
          {/* ======================================================== */}
          {activeTab === "pacientes" && (
            <motion.div
              key="tab-pacientes"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Alerta de Confidencialidad NOM-004 */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-start gap-3 text-xs text-emerald-900">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Privacidad y Cumplimiento NOM-004:</strong> Todas las publicaciones de esta sección contienen únicamente requerimientos clínicos odontológicos sin datos personales ni identidades reales de pacientes.
                </div>
              </div>

              {filteredPacientes.map(item => (
                <div
                  key={item.id}
                  className="bg-white/80 backdrop-blur-xl border border-zinc-200/80 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-zinc-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                        {item.status}
                      </span>
                      <span className="text-xs font-medium text-zinc-400">• Urgencia: {item.urgency}</span>
                    </div>

                    <h3 className="text-lg font-bold text-zinc-900">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                      {item.requirement}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-2">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="font-medium text-zinc-700">{item.clinicLocation}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{item.schedule}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Stethoscope className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{item.author} ({item.semester})</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 w-full md:w-auto flex items-center justify-end">
                    <Button
                      onClick={() =>
                        toast.success(`Solicitud enviada a ${item.author} para coordinar atención clínica.`)
                      }
                      className="w-full md:w-auto bg-zinc-900 hover:bg-zinc-800 text-white rounded-full px-6 py-2 text-xs font-semibold shadow-md cursor-pointer"
                    >
                      Postular Paciente
                    </Button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* MODAL CREAR NUEVA PUBLICACIÓN */}
      <AnimatePresence>
        {showNewPostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowNewPostModal(false)}
                className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-zinc-900 mb-1">Nueva Publicación en el Club</h2>
              <p className="text-xs text-zinc-500 mb-6">
                Selecciona la categoría e ingresa los detalles para compartir con el gremio.
              </p>

              <form onSubmit={handleCreatePost} className="space-y-4">
                {/* Selector Tipo */}
                <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setNewPostType("duda")}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      newPostType === "duda" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-500"
                    }`}
                  >
                    Duda Clínica
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPostType("mercado")}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      newPostType === "mercado" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-500"
                    }`}
                  >
                    Venta Material
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPostType("paciente")}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      newPostType === "paciente" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-500"
                    }`}
                  >
                    Paciente NOM
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Título</label>
                  <Input
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="Ej. Duda en técnica de impresión o Venta de Articulador..."
                    className="text-xs rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Descripción Detallada</label>
                  <textarea
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    rows={4}
                    placeholder="Escribe aquí los detalles del caso, especificaciones o requerimientos..."
                    className="w-full text-xs p-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewPostModal(false)}
                    className="rounded-full text-xs cursor-pointer"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-zinc-900 text-white rounded-full text-xs px-5 cursor-pointer">
                    Publicar Ahora
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
