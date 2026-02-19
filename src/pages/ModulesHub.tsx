import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Building2, Brain, Box, Hand, MapPin, Shield, Lock, ArrowLeft, Loader2, ChevronLeft, ChevronRight, KeyRound } from "lucide-react";
import { ShaderSplash } from "@/components/ShaderSplash";
import { SchemaHubCard } from "@/components/SchemaHubCard";
import { SchemaWaveBackground } from "@/components/ui/SchemaWaveBackground";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Configuración completa de módulos con nombres actualizados
const modulesConfig = [
  {
    name: "motor_neuronal",
    title: "DENTAXY AI",
    subtitle: "Asistencia Cognitiva",
    description: "El clínico piensa.\nEl sistema redacta.\n\nLa narrativa se vuelve consistente, clara y reutilizable.\n\nNo es automatización.\nEs asistencia cognitiva.",
    icon: Brain,
    badge: "DENTAXY AI",
    rgbColor: "16, 185, 129", // Emerald-500
    accentColor: "#10B981",
    moduleInfo: {
      whatItDemonstrates: "La historia clínica ya no se escribe. Se construye.",
      problemItSolves: "Narrativa clínica profesional. Coherencia documental. Menos escritura, más criterio.",
      contextOfUse: "Documentación con peso legal. Expedientes que resisten auditorías.",
      publicTarget: "Profesionales que valoran su tiempo y la precisión de su documentación.",
      whatIncluded: ["Narrativa clínica profesional", "Coherencia documental", "Menos escritura, más criterio", "Documentación con peso legal"],
      whatNotIncluded: ["Diagnóstico automatizado", "Decisiones clínicas", "Reemplazo del criterio médico"],
    },
  },
  {
    name: "dicom",
    title: "DICOM",
    subtitle: "Visualización Médica",
    description: "La imagen clínica deja de ser un archivo.\nSe convierte en un espacio manipulable.\n\nDirecto. Seguro. Sin fricción.\n\nAquí la imagen no se envía.\nSe explora.",
    icon: Box,
    badge: "DICOM",
    rgbColor: "139, 92, 246", // Violet
    accentColor: "#8B5CF6",
    moduleInfo: {
      whatItDemonstrates: "La precisión clínica es la base de la confianza. Tu capacidad tecnológica define tu estándar de práctica.",
      problemItSolves: "Diagnóstico radiográfico instantáneo. Interpretación de archivos .dcm nativos sin software pesado. Eliminación de barreras técnicas para la visualización de alta fidelidad.",
      contextOfUse: "Entorno clínico digital y teleodontología. Consulta de gabinete o movilidad total. Fin de la dependencia de visores propietarios o archivos estáticos de baja resolución.",
      publicTarget: "Odontólogos y especialistas que exigen la máxima información diagnóstica de una panorámica y no aceptan menos que el formato original.",
      whatIncluded: [
        "Visualizador DICOM nativo: Renderizado fluido de radiografías panorámicas en el navegador.",
        "Acceso Universal: Compatibilidad total en Desktop y Mobile para revisiones en tiempo real.",
        "Herramientas de Precisión: Ajuste de contraste, brillo y zoom dinámico para detección de patologías.",
        "Seguridad de Datos: Gestión de archivos bajo estándares de identidad protegida"
      ],
      whatNotIncluded: ["Almacenamiento PACS completo", "Procesamiento de tomografías completas", "Envíos por canales inseguros"],
    },
  },
  {
    name: "academico",
    title: "DENTAXY UNIVERSIDADES",
    subtitle: "Plataforma Académica",
    description: "Donde la formación clínica deja de ser teoría.\n\nCada dato capturado tiene un propósito.\nCada práctica deja rastro.\nCada alumno opera dentro de un sistema mayor.\n\nEsto no es un formulario.\nEs el inicio de una red.",
    icon: GraduationCap,
    badge: "UNIVERSIDADES",
    rgbColor: "0, 163, 255", // Neon Tech Blue
    accentColor: "#00A3FF",
    moduleInfo: {
      whatItDemonstrates: "Lo que aquí se genera, no se pierde. Se transforma.",
      problemItSolves: "Clínicas universitarias conectadas. Operación geolocalizada. Datos clínicos estandarizados.",
      contextOfUse: "Supervisión institucional silenciosa. Red académica unificada.",
      publicTarget: "Instituciones que entienden que el control empieza en la formación.",
      whatIncluded: ["Clínicas universitarias conectadas", "Operación geolocalizada", "Datos clínicos estandarizados", "Supervisión institucional silenciosa"],
      whatNotIncluded: ["Acceso sin autorización", "Datos sin propósito", "Sistemas desconectados"],
    },
  },
  {
    name: "enterprise",
    title: "DENTAXY ENTERPRISE",
    subtitle: "Arquitectura Clínica",
    description: "La operación clínica como sistema.\n\nNo importa cuántas unidades, cuántos doctores o cuántos pacientes.\nLa información fluye.\nEl control permanece.\n\nEsto no escala clínicas.\nEstandariza decisiones.",
    icon: Building2,
    badge: "ENTERPRISE",
    rgbColor: "255, 255, 255", // White
    accentColor: "#FFFFFF",
    moduleInfo: {
      whatItDemonstrates: "Aquí no se improvisa. Se gobierna.",
      problemItSolves: "Arquitectura multi-entorno. Flujos clínicos continuos. Control administrativo central.",
      contextOfUse: "Seguridad por diseño. Operación que no depende de individuos.",
      publicTarget: "Clínicas que buscan trascender la dependencia del talento individual.",
      whatIncluded: ["Arquitectura multi-entorno", "Flujos clínicos continuos", "Control administrativo central", "Seguridad por diseño"],
      whatNotIncluded: ["Improvisación operativa", "Dependencia de personas", "Información fragmentada"],
    },
  },
  {
    name: "proyecto_stark",
    title: "PROYECTO STARK",
    subtitle: "CLASIFICADO",
    description: "Top Secret Development.\nAccess Restricted.",
    icon: Hand,
    badge: "CLASIFICADO",
    rgbColor: "255, 42, 42", // Neon Red
    accentColor: "#FF2A2A",
    isClassified: true,
    moduleInfo: {
      whatItDemonstrates: "Acceso restringido.",
      problemItSolves: "Clasificado.",
      contextOfUse: "Clasificado.",
      publicTarget: "Clasificado.",
      whatIncluded: [],
      whatNotIncluded: [],
    },
  },
];

interface ModuleState {
  is_enabled: boolean;
  status: string;
  free_access?: boolean;
}

export default function ModulesHub() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Estados del sistema
  const [showSplash, setShowSplash] = useState(true);
  const [showHub, setShowHub] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [modulesState, setModulesState] = useState<Record<string, ModuleState>>({});

  // Estados de demo
  const [targetModuleForDemo, setTargetModuleForDemo] = useState<string | null>(null);
  const [demoTokenInput, setDemoTokenInput] = useState('');
  const [demoStep, setDemoStep] = useState<'idle' | 'token' | 'form' | 'success'>('idle');
  const [showTokenInputInline, setShowTokenInputInline] = useState(false);
  const [isVerifyingToken, setIsVerifyingToken] = useState(false);
  const [isDemoDialogOpen, setIsDemoDialogOpen] = useState(false);
  const [validatedDemoData, setValidatedDemoData] = useState<any>(null);

  const [userName, setUserName] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [detailedLocation, setDetailedLocation] = useState<any>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Función centralizada para redirigir a módulos
  const redirectToModule = (moduleId: string) => {
    const routes: Record<string, string> = {
      'motor_neuronal': '/demo/ai',
      'dicom': '/demo/dicom',
      'academico': '/academico',
      'enterprise': '/enterprise',
      'proyecto_stark': '/stark'
    };

    const route = routes[moduleId] || '/hub';
    navigate(route);
  };

  const handleExplore = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNext = () => {
    setActiveModuleIndex((prev) => (prev + 1) % modulesConfig.length);
  };

  const handlePrev = () => {
    setActiveModuleIndex((prev) => (prev - 1 + modulesConfig.length) % modulesConfig.length);
  };

  const handleTryDemo = (moduleName: string) => {
    // Check if module has free access enabled
    const moduleState = modulesState[moduleName];

    if (moduleState?.free_access) {
      console.log(`🔓 [FREE ACCESS] Accediendo libremente a ${moduleName}`);
      toast.success("Acceso Libre Autorizado", {
        description: "Entrando al sistema...",
        duration: 3000
      });

      // Simular delay para UX
      setTimeout(() => {
        redirectToModule(moduleName);
      }, 800);
      return;
    }

    setTargetModuleForDemo(moduleName);
    setDemoTokenInput("");
    setDemoStep('token');
    setIsDemoDialogOpen(true);
  };

  // Enhanced verification for URL tokens
  const verifyDemoTokenFromURL = async (token: string) => {
    if (!token.trim()) {
      toast.error("Token inválido");
      return;
    }

    setIsVerifyingToken(true);
    try {
      // Check if token exists and is valid
      const { data: linkData, error } = await supabase
        .from('demo_links')
        .select('*')
        .eq('token', token)
        .maybeSingle();

      console.log('🔍 [DEMO] Verificando token:', token);

      if (error) {
        console.error('❌ [DEMO] Error BD:', error);
        throw new Error(`Error en base de datos: ${error.message}`);
      }

      if (!linkData) {
        console.warn('⚠️ [DEMO] Token no encontrado');
        throw new Error("Token inválido o no encontrado");
      }

      console.log('✅ [DEMO] Token encontrado, validando...');

      if (linkData.is_revoked) {
        throw new Error("Este token ha sido revocado");
      }

      if (new Date(linkData.expires_at) < new Date()) {
        throw new Error("Este token ha expirado");
      }

      if (linkData.current_uses >= linkData.max_uses) {
        throw new Error("Este token ha alcanzado el límite de usos");
      }

      // Check requirements
      if (linkData.requires_user_info) {
        setValidatedDemoData(linkData);
        setDemoStep('form');
        setIsDemoDialogOpen(true); // Open dialog if coming from URL
        setIsVerifyingToken(false);
        return;
      }

      // Store validated data
      setValidatedDemoData(linkData);

      // Log session directly if no extra info needed
      const { error: sessionError } = await supabase
        .from('demo_sessions')
        .insert({
          demo_link_id: linkData.id,
          module_id: targetModuleForDemo || linkData.allowed_modules?.[0] || 'hub',
          metadata: { user_agent: navigator.userAgent, source: 'url_autosignin' },
          full_name: 'Anónimo (URL)',
          location: { source: 'url' }
        });

      if (sessionError) console.error("Session log error:", sessionError);

      // Increment usage count via RPC
      const { error: incrementError } = await supabase.rpc('increment_demo_uses', { p_token: linkData.token });

      if (incrementError) {
        console.error('Error incrementing uses:', incrementError);
      }

      toast.success("Token validado. Accediendo...");
      setDemoStep('success');

      // Auto-redirect after success
      setTimeout(() => {
        // Fix: Prioritize targetModuleForDemo if set, otherwise fallback to allowed list
        const targetModule = targetModuleForDemo || linkData.allowed_modules?.[0] || 'motor_neuronal';
        redirectToModule(targetModule);
      }, 1500);

    } catch (err: any) {
      toast.error(err.message || "Error al verificar el token");
      setDemoStep('idle');
      setShowTokenInputInline(false);
    } finally {
      if (demoStep !== 'form') {
        setIsVerifyingToken(false);
      }
    }
  };

  const verifyDemoToken = async () => {
    let tokenToVerify = demoTokenInput.trim();
    // Helper to extract token if user pastes a full URL
    if (tokenToVerify.includes('demo=')) {
      try {
        const url = new URL(tokenToVerify);
        const tokenParam = url.searchParams.get('demo');
        if (tokenParam) tokenToVerify = tokenParam;
      } catch (e) {
        // If not a valid URL, try regex or leave as is
        const match = tokenToVerify.match(/[?&]demo=([^&]+)/);
        if (match) tokenToVerify = match[1];
      }
    }

    if (!tokenToVerify) {
      toast.error("Por favor ingresa un código de acceso válido");
      return;
    }

    setIsVerifyingToken(true);
    try {
      // 1. Check if token exists and is valid
      const { data: linkData, error } = await supabase
        .from('demo_links')
        .select('*')
        .eq('token', tokenToVerify)
        .maybeSingle(); // Use maybeSingle for safety

      if (error) {
        console.error('Database error:', error);
        throw new Error("Error al verificar el token");
      }

      if (!linkData) {
        throw new Error("Token inválido o no encontrado");
      }

      if (linkData.is_revoked) {
        throw new Error("Este token ha sido revocado");
      }

      if (new Date(linkData.expires_at) < new Date()) {
        throw new Error("Este token ha expirado");
      }

      if (linkData.current_uses >= linkData.max_uses) {
        throw new Error("Este token ha alcanzado el límite de usos");
      }

      // 2. Check if module is allowed (if restrictions exist)
      if (linkData.allowed_modules && linkData.allowed_modules.length > 0 && targetModuleForDemo) {
        if (!linkData.allowed_modules.includes(targetModuleForDemo)) {
          throw new Error("Este token no es válido para este módulo");
        }
      }

      // 3. Check for User Info Requirement
      if (linkData.requires_user_info) {
        setValidatedDemoData(linkData);
        setDemoStep('form');
        setIsVerifyingToken(false);
        return;
      }

      // 4. Register usage and session (No user info required)
      // We perform the session creation manually here to ensure we get the ID
      const { data: sessionData, error: sessionError } = await supabase
        .from('demo_sessions')
        .insert({
          demo_link_id: linkData.id,
          module_id: targetModuleForDemo || 'hub',
          metadata: { user_agent: navigator.userAgent, source: 'manual_entry' },
          full_name: 'Anónimo',
          location: {}
        })
        .select('id')
        .single();

      if (sessionError) console.error("Session log error:", sessionError);

      // Increment usage count via RPC for security
      const { error: incrementError } = await supabase.rpc('increment_demo_uses', { p_token: linkData.token });

      if (incrementError) {
        console.error('Error incrementing uses:', incrementError);
      }

      toast.success("Acceso autorizado. Iniciando demo...");
      setIsDemoDialogOpen(false);

      // Store in session storage with CORRECT KEYS used by hooks
      if (sessionData) {
        sessionStorage.setItem('demo_session_token', sessionData.id);
      } else {
        // Fallback if session creation failed but token is valid
        sessionStorage.setItem('demo_session_token', 'temp_valid_' + Date.now());
      }
      sessionStorage.setItem('demo_module', targetModuleForDemo || 'hub');

      // Clean up legacy key
      sessionStorage.removeItem('active_demo_token');

      // Redirect using centralized function
      if (targetModuleForDemo) {
        redirectToModule(targetModuleForDemo);
      }

    } catch (err: any) {
      toast.error(err.message || "Error al verificar el token");
      setIsVerifyingToken(false);
    }
  };

  const handleGetLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      toast.error("Tu navegador no soporta geolocalización");
      setIsLocating(false);
      return;
    }

    toast.info("Solicitando acceso a ubicación...", { duration: 2000 });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse geocoding using OpenStreetMap (Nominatim)
          // Using a free API, be mindful of rate limits in prod, but fine for demos
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.municipality || 'Ubicación desconocida';
          const country = data.address?.country || '';
          const state = data.address?.state || '';

          const formattedLocation = `${city}, ${state}, ${country}`.replace(/^, |, $/g, '').replace(/, ,/g, ',');

          setUserLocation(formattedLocation);
          setDetailedLocation({
            lat: latitude,
            lng: longitude,
            city,
            country,
            state,
            full_address: data.display_name,
            source: 'gps'
          });
          toast.success("Ubicación detectada correctamente");
        } catch (error) {
          console.error("Error geocoding:", error);
          setUserLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setDetailedLocation({
            lat: latitude,
            lng: longitude,
            source: 'gps_raw'
          });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        let msg = "No se pudo obtener la ubicación.";
        if (error.code === error.PERMISSION_DENIED) msg = "Acceso a ubicación denegado. Por favor permite el acceso.";
        if (error.code === error.TIMEOUT) msg = "Tiempo de espera agotado al obtener ubicación.";
        toast.error(msg);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };
  const handleCompleteDemoEntry = async () => {
    if (!validatedDemoData) return;

    if (validatedDemoData.requires_user_info) {
      if (!userName.trim() || (!userLocation.trim() && !detailedLocation)) {
        toast.error("Por favor completa todos los campos requeridos");
        return;
      }
    }

    setIsVerifyingToken(true);
    try {
      // Determine target module upfront to avoid race conditions
      // Priority: 1. Explicitly requested module (targetModuleForDemo)
      //           2. Module allowed by token (allowed_modules[0])
      //           3. Currently active module in carousel (modulesConfig[activeModuleIndex].name)
      //           4. Default to 'motor_neuronal'
      const targetModule = targetModuleForDemo ||
        validatedDemoData.allowed_modules?.[0] ||
        modulesConfig[activeModuleIndex]?.name ||
        'motor_neuronal';

      console.log('🚀 [DEMO ENTRY] Initiating entry sequence:', {
        targetModule,
        targetModuleForDemo,
        allowed: validatedDemoData.allowed_modules,
        activeIndex: activeModuleIndex,
        moduleNameAtIndex: modulesConfig[activeModuleIndex]?.name
      });

      // Register session with user info
      const locationData = detailedLocation || { city: userLocation, source: 'manual_input' };

      const { data: sessionData, error: sessionError } = await supabase
        .from('demo_sessions')
        .insert({
          demo_link_id: validatedDemoData.id,
          module_id: targetModule,
          metadata: { user_agent: navigator.userAgent, source: 'form_entry' },
          full_name: userName,
          location: locationData
        })
        .select('id')
        .single();

      if (sessionError) throw sessionError;

      // Increment usage count
      await supabase.rpc('increment_demo_uses', { p_token: validatedDemoData.token });

      // Save session
      if (sessionData) {
        sessionStorage.setItem('demo_session_token', sessionData.id);
      }
      // Force set the target module in session storage to ensure persistence across navigation
      sessionStorage.setItem('demo_module', targetModule);
      sessionStorage.removeItem('active_demo_token');

      // Close dialog and show success
      setIsDemoDialogOpen(false);
      toast.success(`Acceso concedido a: ${targetModule}`, { duration: 1500 });

      console.log('✅ [DEMO ENTRY] Session created, redirecting to:', targetModule);

      // Clean up state
      setDemoStep('idle');
      setUserName('');
      setUserLocation('');
      setDetailedLocation(null);
      setValidatedDemoData(null);
      setDemoTokenInput('');
      setIsVerifyingToken(false);

      // Redirect immediately
      // Using a short timeout to allow UI update, but ensuring navigation happens
      setTimeout(() => {
        redirectToModule(targetModule);
      }, 500);

    } catch (err: any) {
      console.error('❌ [DEMO ENTRY] Error:', err);
      toast.error(err.message || "Error al registrar la sesión");
      // Don't close dialog on error so user can retry
      setIsVerifyingToken(false);
    }
  };

  // Fetch module states from database
  useEffect(() => {
    const fetchModuleStates = async () => {
      try {
        const { data, error } = await supabase
          .from('dentaxy_modules')
          .select('name, is_enabled, status, free_access');

        if (error) throw error;

        const stateMap: Record<string, ModuleState> = {};
        data?.forEach((m: any) => {
          stateMap[m.name] = {
            is_enabled: m.is_enabled ?? false,
            status: m.status ?? 'blocked',
            free_access: m.free_access ?? false
          };
        });
        setModulesState(stateMap);
      } catch (error) {
        console.error('Error fetching module states:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModuleStates();

    // Real-time subscription for instant updates
    const channel = supabase
      .channel('modules-realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'dentaxy_modules' },
        (payload) => {
          try {
            // Robust validation before accessing properties
            if (!payload || typeof payload !== 'object') {
              console.warn('Invalid payload received:', payload);
              return;
            }

            if (!payload.new || typeof payload.new !== 'object') {
              console.warn('Invalid payload.new received:', payload);
              return;
            }

            const updated = payload.new as any;

            // Validate required fields exist and are correct type
            if (typeof updated.name !== 'string' ||
              typeof updated.is_enabled !== 'boolean' ||
              typeof updated.status !== 'string') {
              console.warn('Invalid module data structure:', updated);
              return;
            }

            // Safe to update state
            setModulesState((prev) => ({
              ...prev,
              [updated.name]: {
                is_enabled: updated.is_enabled,
                status: updated.status,
              },
            }));
          } catch (error) {
            console.error('Error processing real-time update:', error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Check if we should skip splash (coming back from a module)
  useEffect(() => {
    const skipSplash = sessionStorage.getItem("skipHubSplash");
    if (skipSplash) {
      setShowSplash(false);
      setShowHub(true);
      sessionStorage.removeItem("skipHubSplash");
    }
  }, []);

  // Process demo token from URL parameters
  useEffect(() => {
    const demoToken = searchParams.get('demo');
    if (demoToken && demoToken.trim()) {
      // Skip splash and start demo flow
      setShowSplash(false);
      setShowHub(true);
      setShowTokenInputInline(true);
      setDemoTokenInput(demoToken);
      setDemoStep('token');

      // Clear the query param to prevent loops on refresh
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);

      // Auto-validate the token after a short delay
      const timer = setTimeout(() => {
        verifyDemoTokenFromURL(demoToken);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setTimeout(() => setShowHub(true), 100);
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && <ShaderSplash onComplete={handleSplashComplete} />}
      </AnimatePresence>

      {/* Modules Hub */}
      <AnimatePresence>
        {showHub && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen relative"
          >
            {/* Fullscreen Wave Visualizer Background */}
            <SchemaWaveBackground color={modulesConfig[activeModuleIndex]?.rgbColor} />

            {/* Content - Compact Layout */}
            <div className="relative z-20 w-full h-screen overflow-hidden flex flex-col pointer-events-none">
              {/* Top Bar - Centered Title, Back Button Left */}
              <div className="pointer-events-auto flex-shrink-0 p-6 relative flex items-center justify-center z-50">
                <div className="absolute left-6 top-6 flex items-center gap-6">
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm text-white/60 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all duration-300 group"
                  >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-medium">Regresar</span>
                  </motion.button>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-3"
                  >
                    <img
                      src="/lovable-uploads/3236de6d-a3e4-4b81-9c83-b32690d4212d.png"
                      alt="DENTAXY"
                      className="h-6 w-6 opacity-80"
                    />
                    <h1 className="text-lg font-bold text-white tracking-tight">
                      DENTAXY <span className="text-white/50 font-normal">Technologies</span>
                    </h1>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <p className="text-white/40 text-[10px] uppercase tracking-wider font-mono bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">
                    selecciona un DENTAXY Demo
                  </p>
                </motion.div>
              </div>

              {/* Loading state */}
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center pointer-events-auto">
                  <Loader2 className="h-8 w-8 animate-spin text-white/40" />
                </div>
              ) : (
                /* Modules Carousel - Centered & Compact */
                <div className="flex-1 flex items-center justify-center pointer-events-auto min-h-0 relative">
                  <div className={`flex items-center justify-center gap-4 md:gap-12 w-full px-4 transition-all duration-500 ${isExpanded ? 'max-w-7xl' : 'max-w-7xl scale-90 md:scale-100'}`}>
                    {/* Previous Button */}
                    <motion.button
                      onClick={handlePrev}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex-shrink-0 w-10 h-10 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white/60 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all duration-300 flex items-center justify-center group"
                    >
                      <ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
                    </motion.button>

                    {/* Active Module Card */}
                    <div className="flex-1 flex items-center justify-center">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeModuleIndex}
                          initial={{ opacity: 0, scale: 0.9, x: 20 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.9, x: -20 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30
                          }}
                          className="w-full flex justify-center"
                        >
                          <SchemaHubCard
                            title={modulesConfig[activeModuleIndex].title}
                            subtitle={modulesConfig[activeModuleIndex].subtitle}
                            description={modulesConfig[activeModuleIndex].description}
                            badge={modulesConfig[activeModuleIndex].badge}
                            color={modulesConfig[activeModuleIndex].rgbColor}
                            onExplore={handleExplore}
                            onTryDemo={() => handleTryDemo(modulesConfig[activeModuleIndex].name)}
                            isActive={true}
                            isExpanded={isExpanded}
                            moduleInfo={modulesConfig[activeModuleIndex].moduleInfo}
                          />
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Next Button */}
                    <motion.button
                      onClick={handleNext}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex-shrink-0 w-10 h-10 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white/60 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all duration-300 flex items-center justify-center group"
                    >
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                    </motion.button>
                  </div>

                  {/* Module Indicator Dots */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                    {modulesConfig.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveModuleIndex(index)}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === activeModuleIndex
                          ? 'w-6 bg-white/80'
                          : 'bg-white/20 hover:bg-white/40'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Security Footer - Compact & Fixed Bottom */}
              <div className="pointer-events-auto flex-shrink-0 p-6 w-full">
                <motion.footer
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="w-full"
                >
                  <div className="max-w-2xl mx-auto">
                    <div
                      className="rounded-xl card-border p-3 transition-colors duration-500 backdrop-blur-xl"
                      style={{
                        background: `linear-gradient(135deg, rgba(${modulesConfig[activeModuleIndex]?.rgbColor},0.1), rgba(${modulesConfig[activeModuleIndex]?.rgbColor},0.05), transparent)`,
                        borderColor: `rgba(${modulesConfig[activeModuleIndex]?.rgbColor}, 0.5)`,
                        boxShadow: `0 0 100px -20px rgba(${modulesConfig[activeModuleIndex]?.rgbColor}, 0.5), 0 0 30px -10px rgba(${modulesConfig[activeModuleIndex]?.rgbColor}, 0.3)`
                      }}
                    >
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono">
                        {/* Location */}
                        <div className="flex items-center gap-2 text-white/50">
                          <MapPin className="h-3 w-3 text-emerald-500" />
                          <span>FRESNILLO / ZACATECAS / MX</span>
                        </div>

                        {/* Security Status */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-white/50">
                            <Lock className="h-3 w-3 text-amber-500" />
                            <span>AES-256</span>
                          </div>
                          <div className="h-3 w-px bg-white/20" />
                          <div className="flex items-center gap-2 text-white/50">
                            <Shield className="h-3 w-3 text-blue-500" />
                            <span>ZERO-TRUST</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2, delay: 1 }}
                            className="h-full"
                            style={{
                              background: "linear-gradient(90deg, #FF64C8, #64C8FF, #A855F7)",
                            }}
                          />
                        </div>
                        <span
                          className="text-[9px] font-mono font-bold"
                          style={{ color: "#FF64C8" }}
                        >
                          SECURE
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.footer>
              </div>
            </div>

            {/* Token Entry Dialog */}
            <Dialog open={isDemoDialogOpen} onOpenChange={(open) => {
              if (!open) {
                // Reset everything on close
                setDemoStep('idle');
                setUserName('');
                setUserLocation('');
                setDetailedLocation(null);
                setIsLocating(false);
                setDemoTokenInput('');
                // CRITICAL: Reset validated data so next open starts fresh
                setValidatedDemoData(null);
              } else {
                // Reset on open just in case
                setDemoStep('token');
                setValidatedDemoData(null);
              }
              setIsDemoDialogOpen(open);
            }}>
              <DialogContent className="border-white/10 bg-black/90 backdrop-blur-xl text-white max-w-sm rounded-[2rem]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-emerald-400" />
                    {demoStep === 'form' ? 'Información Requerida' : 'Acceso a Demo'}
                  </DialogTitle>
                  <DialogDescription className="text-white/60">
                    {demoStep === 'form'
                      ? 'Este demo requiere que ingreses tu nombre y ubicación para continuar.'
                      : 'Ingresa tu código de acceso único para explorar este módulo.'
                    }
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                  {demoStep === 'token' && (
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-white/50 transform translate-x-1">Código de Acceso</Label>
                      <Input
                        value={demoTokenInput}
                        onChange={(e) => setDemoTokenInput(e.target.value)}
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                        className="bg-white/5 border-white/10 focus:border-emerald-500/50 text-white font-mono text-center tracking-widest text-lg h-12 rounded-xl placeholder:text-white/20"
                      />
                    </div>
                  )}

                  {demoStep === 'form' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-white/50 transform translate-x-1">Tu Nombre Completo</Label>
                        <Input
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="Ej. Juan Pérez"
                          className="bg-white/5 border-white/10 focus:border-emerald-500/50 text-white h-12 rounded-xl placeholder:text-white/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-white/50 transform translate-x-1">Ubicación</Label>
                        <div className="relative">
                          <Input
                            value={userLocation}
                            readOnly
                            placeholder="Detectando ubicación..."
                            className="bg-white/5 border-white/10 text-white h-12 rounded-xl placeholder:text-white/20 pr-10"
                          />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleGetLocation}
                            disabled={isLocating || !!userLocation}
                            className={`absolute right-2 top-2 h-8 w-8 rounded-lg flex items-center justify-center transition-all ${userLocation
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                              }`}
                          >
                            {isLocating ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : userLocation ? (
                              <MapPin className="h-4 w-4" />
                            ) : (
                              <MapPin className="h-4 w-4" />
                            )}
                          </motion.button>
                        </div>
                        {!userLocation && (
                          <p className="text-[10px] text-white/40 pl-1">
                            * Debes permitir el acceso a la ubicación para continuar
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter className="sm:justify-between gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setIsDemoDialogOpen(false)}
                    className="text-white/60 hover:text-white hover:bg-white/5 rounded-xl"
                  >
                    Cancelar
                  </Button>

                  {demoStep === 'token' ? (
                    <Button
                      onClick={verifyDemoToken}
                      disabled={isVerifyingToken || !demoTokenInput}
                      className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-xl px-8"
                    >
                      {isVerifyingToken ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Verificando
                        </>
                      ) : (
                        "Siguiente"
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleCompleteDemoEntry}
                      disabled={isVerifyingToken || !userName || !userLocation}
                      className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-xl px-8"
                    >
                      {isVerifyingToken ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Activando
                        </>
                      ) : (
                        "Ingresar al Demo"
                      )}
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
