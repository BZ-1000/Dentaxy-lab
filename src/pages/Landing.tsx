import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, Settings, Bell, User, Save, LogOut, Crown, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Database } from '@/types/supabase';
import AntecedentesPersonalesPatologicos from '@/components/historia-clinica/AntecedentesPersonalesPatologicos';
import { Checkbox } from "@/components/ui/checkbox";
import { Typewriter } from "@/components/ui/typewriter-text";
import type { PadecimientoActual, AntecedentesHeredoFamiliares, AntecedentesPersonalesNoPatologicos, AntecedentesAlergicos, AntecedentesHemorragicos, AntecedentesQuirurgicos, ExploracionFisica, ExamenCabeza } from '@/types/historiaClinica';

// Define missing types
type InterrogatorioSistemas = Record<string, any>;
type InformacionPrincipal = Record<string, any>;

const menuItems = [{
  label: "Nosotros",
  href: "/about"
}, {
  label: "Funciones",
  href: "/how-it-works"
}, {
  label: "Beneficios",
  href: "/benefits"
}, {
  label: "Planes",
  href: "/plans"
}, {
  label: "Contacto",
  href: "/contact"
}];

const LoadingScreen = ({
  visible,
  onComplete
}) => {
  const [displayText, setDisplayText] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const fullText = "Dental Basics Academy";
  
  const handleTypingComplete = () => {
    setTypingComplete(true);
    onComplete(); // Immediately call onComplete when typing finishes
  };

  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center bg-white ${visible ? 'visible' : 'hidden'}`}>
      <div className="flex items-center space-x-4">
        <img alt="Logo" src="/lovable-uploads/3236de6d-a3e4-4b81-9c83-b32690d4212d.png" className="h-16 w-16" />
        <h1 className="text-xl sm:text-3xl font-bold text-black text-center">
          <Typewriter 
            text={fullText} 
            speed={70}
            onComplete={handleTypingComplete}
          />
        </h1>
      </div>
    </div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<string>("");
  const [authDialog, setAuthDialog] = useState<{
    isOpen: boolean;
    mode: "login" | "register";
  }>({
    isOpen: false,
    mode: "login"
  });
  const [username, setUsername] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showPricingPopup, setShowPricingPopup] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasBetaPlan, setHasBetaPlan] = useState(false);
  const isMobile = useIsMobile();
  
  // Add new state for sticky header
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);

  // Add new state for terms acceptance
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  
  useEffect(() => {
    // Load username from localStorage first
    const storedUsername = localStorage.getItem('dentaxy_username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    setMounted(true);

    const getSession = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        checkUsername(session.user.id);
        checkUserPlan(session.user.id);
      }
    };
    getSession();
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session) {
        checkUsername(session.user.id);
        checkUserPlan(session.user.id);
      }
    });
    
    // Add scroll event listener for sticky header effect
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsHeaderSticky(true);
      } else {
        setIsHeaderSticky(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Handle loading screen completion
  const handleLoadingComplete = () => {
    setLoading(false);
  };
  
  const checkUsername = async (userId: string) => {
    try {
      // Check if we already have the username in localStorage
      const storedUsername = localStorage.getItem('dentaxy_username');
      if (storedUsername) {
        setUsername(storedUsername);
        setShowPopup(false);
        return;
      }

      const {
        data,
        error
      } = await supabase.from('user_profiles').select('id, username, created_at').eq('id', userId).single();
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      if (data?.username) {
        setUsername(data.username);
        // Store username in localStorage to avoid future prompts
        localStorage.setItem('dentaxy_username', data.username);
        setShowPopup(false);
      } else {
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error checking username:', error);
    }
  };
  
  const checkUserPlan = async (userId: string) => {
    try {
      const {
        data,
        error
      } = await supabase.from('user_plans').select('plan_type').eq('id', userId).maybeSingle();
      if (error) {
        console.error('Error checking plan:', error);
        return;
      }
      setHasBetaPlan(data?.plan_type === 'beta');
    } catch (error) {
      console.error('Error checking user plan:', error);
    }
  };
  
  const handleSelectBetaPlan = async () => {
    if (!session) {
      toast.error('Debes iniciar sesión para seleccionar un plan');
      return;
    }
    try {
      const {
        error
      } = await supabase.from('user_plans').upsert({
        id: session.user.id,
        plan_type: 'beta'
      });
      if (error) {
        console.error('Error details:', error);
        throw error;
      }
      setHasBetaPlan(true);
      setShowPricingPopup(false);
      toast.success('¡Plan Beta activado exitosamente!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al activar el plan');
    }
  };
  
  const handleItemClick = (label: string) => {
    setActiveItem(label);
    if (label === "perfil." && session) {
      setShowDropdown(!showDropdown);
    }
  };
  
  const handleLogin = () => {
    setAuthDialog({
      isOpen: true,
      mode: "login"
    });
  };
  
  const handleRegister = () => {
    setAuthDialog({
      isOpen: true,
      mode: "register"
    });
  };
  
  const handleAuthSuccess = () => {
    setAuthDialog({
      isOpen: false,
      mode: "login"
    });
  };
  
  const handleLogout = async () => {
    const {
      error
    } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    }
    setSession(null);
    setShowDropdown(false);
    setHasBetaPlan(false);
    toast.success('Sesión cerrada exitosamente');
  };

  const handleChangeUsername = () => {
    setShowPopup(true);
    setShowDropdown(false);
  };
  
  const handleBetaAccess = () => {
    if (!session) {
      toast.error('Debes iniciar sesión para acceder a la versión beta');
      setAuthDialog({
        isOpen: true,
        mode: "login"
      });
      return;
    }
    if (hasBetaPlan) {
      navigate('/app');
    } else {
      setShowPricingPopup(true);
    }
  };
  
  const [formData, setFormData] = useState({
    antecedentesPersonalesPatologicos: {
      nutricionales: {
        anorexia: false,
        bulimia: false,
        sobrepeso: false,
        obesidad: false,
        ninguna: true,
        otra: false,
        otraDescripcion: ''
      },
      cardiacos: {
        enfermedadCoronaria: false,
        arritmias: false,
        defectosCardiacosCongenitos: false,
        ninguna: true,
        otra: false,
        otraDescripcion: ''
      },
      hepaticos: {
        hepatitisA: false,
        hepatitisB: false,
        hepatitisC: false,
        higadoGraso: false,
        cirrosis: false,
        ninguna: true,
        otra: false,
        otraDescripcion: ''
      },
      enfermedadesTransmisionSexual: {
        vih: false,
        sifilis: false,
        gonorrea: false,
        herpesGenital: false,
        vph: false,
        ninguna: true,
        otra: false,
        otraDescripcion: ''
      },
      enfermedadesEruptivas: {
        sarampion: false,
        rubeola: false,
        escarlatina: false,
        varicela: false,
        paperas: false,
        ninguna: true,
        otra: false,
        otraDescripcion: ''
      },
      pulmonares: {
        neumonia: false,
        bronquitis: false,
        asma: false,
        epoc: false,
        ninguna: true,
        otra: false,
        otraDescripcion: ''
      },
      infecciosasParasitarias: {
        fiebreTifoidea: false,
        tuberculosis: false,
        amibiasis: false,
        giardiasis: false,
        ascariasis: false,
        ninguna: true,
        otra: false,
        otraDescripcion: ''
      },
      otrosPadecimientos: {
        ninguna: true,
        otra: false,
        otraDescripcion: ''
      }
    }
  });
  
  const handleAntecedentePatologicoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      antecedentesPersonalesPatologicos: {
        ...prev.antecedentesPersonalesPatologicos,
        [field]: value
      }
    }));
  };

  // Function to handle Instagram icon click
  const handleInstagramClick = () => {
    window.open('https://instagram.com/dentalbasicsacademy', '_blank');
  };

  // Fixed handleSaveUsername function to properly handle username existence
  const handleSaveUsername = async () => {
    if (!username.trim() || !acceptTerms || !acceptPrivacy) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }
    try {
      if (!session) {
        throw new Error('No session found');
      }
      setLoading(true);

      // Check if the username already exists (belonging to a different user)
      const {
        data: existingUser,
        error: checkError
      } = await supabase.from('user_profiles').select('id').eq('username', username.trim()).neq('id', session.user.id) // Exclude current user
      .single();

      // If there's a user with this username already
      if (existingUser) {
        toast.error('Este nombre de usuario ya está en uso. Por favor, intente con otro nombre.', {
          duration: 5000
        });
        setLoading(false);
        return;
      }
      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" which is good
        console.error('Error checking username:', checkError);
        toast.error('Error al verificar la disponibilidad del nombre de usuario');
        setLoading(false);
        return;
      }

      // Try to update first
      const {
        error: updateError
      } = await supabase.from('user_profiles').update({
        username: username.trim()
      }).eq('id', session.user.id);

      // If update fails (likely because the profile doesn't exist yet), insert new profile
      if (updateError) {
        console.log('Update failed, trying insert:', updateError);
        const {
          error: insertError
        } = await supabase.from('user_profiles').insert({
          id: session.user.id,
          username: username.trim(),
          created_at: new Date().toISOString()
        });
        if (insertError) {
          console.error('Insert error:', insertError);
          toast.error('Error al guardar nombre de usuario');
          setLoading(false);
          return;
        }
      }

      // Save username to localStorage to prevent future prompts
      localStorage.setItem('dentaxy_username', username.trim());

      // Success path - username was saved
      toast.success('Nombre de usuario guardado exitosamente');
      console.log('Username saved successfully, closing popup');

      // Close the popup with a small delay to ensure state updates properly
      setTimeout(() => {
        setShowPopup(false);
        setLoading(false);
      }, 500);
    } catch (error: any) {
      console.error('Error saving username:', error);
      toast.error('Error al guardar nombre de usuario: ' + (error.message || 'Error desconocido'));
      setLoading(false);
    }
  };
  
  if (loading && mounted) return <LoadingScreen visible={loading} onComplete={handleLoadingComplete} />;
  
  return <div className="min-h-screen w-full bg-white apple-minimalist">
      {/* Header with logo and navigation - Now with sticky effect for desktop */}
      <div className={`flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white ${isHeaderSticky && !isMobile ? 'fixed top-0 left-0 right-0 z-50 shadow-md transition-all duration-300' : 'shadow-sm'}`}>
        <div className="flex items-center gap-2">
          <img alt="Logo" src="/lovable-uploads/3236de6d-a3e4-4b81-9c83-b32690d4212d.png" className="h-8 w-8" />
          <span className="text-xs font-bold text-gray-700">Dental Basics Academy</span>
        </div>

        {/* Main horizontal navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {menuItems.map(item => <Link key={item.label} to={item.href} className={`text-gray-700 hover:text-blue-600 transition-colors text-sm ${activeItem === item.label ? 'font-medium' : 'font-normal'}`} onClick={() => setActiveItem(item.label)}>
              {item.label}
            </Link>)}
        </div>

        {/* Auth buttons */}
        <div className="flex gap-4">
          {!session ? <>
              <Button variant="default" onClick={handleLogin} className="bg-black text-white hover:bg-black/80 rounded-full">
                Iniciar sesión
              </Button>
              <Button variant="outline" onClick={handleRegister} className="bg-white text-black hover:bg-white/90 border-black rounded-full">
                Registrarse
              </Button>
            </> : <div className="flex items-center gap-4">
              <span className="text-black text-sm">{username}</span>
              <button onClick={() => setShowDropdown(!showDropdown)} className="relative">
                <UserCircle className="h-6 w-6 text-black" />
                {showDropdown && <div className="absolute top-full right-0 mt-2 w-48 p-2 bg-white rounded-xl shadow-lg z-50 border border-gray-200">
                    {hasBetaPlan && <div className="px-2 py-3 text-blue-600 text-sm rounded-lg w-full text-left flex items-center gap-x-2">
                        <Crown className="h-4 w-4" />
                        Plan Beta
                      </div>}
                    <button onClick={handleChangeUsername} className="px-2 py-3 text-gray-700 text-sm rounded-lg w-full text-left hover:bg-gray-100">
                      Cambiar nombre
                    </button>
                    <button onClick={() => setShowPricingPopup(true)} className="px-2 py-3 text-gray-700 text-sm rounded-lg w-full text-left hover:bg-gray-100 flex items-center gap-x-2">
                      <Crown className="h-4 w-4" />
                      Cambiar plan
                    </button>
                    <button onClick={handleLogout} className="px-2 py-3 text-red-500 text-sm rounded-lg w-full text-left hover:bg-gray-100 flex items-center gap-x-2">
                      <LogOut className="h-4 w-4" />
                      Cerrar sesión
                    </button>
                  </div>}
              </button>
            </div>}
        </div>
      </div>

      {/* Add padding to the content when header is sticky */}
      {isHeaderSticky && !isMobile && <div className="h-16"></div>}

      {/* Mobile Menu */}
      {isMobile && <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-4">
          <div className="flex justify-around">
            {menuItems.map(item => <Link key={item.label} to={item.href} className={`flex flex-col items-center text-xs ${activeItem === item.label ? 'text-blue-600' : 'text-gray-500'}`} onClick={() => setActiveItem(item.label)}>
                {item.label}
              </Link>)}
          </div>
          {showDropdown && <div className="absolute bottom-full mb-2 left-0 right-0 mx-4 py-2 bg-white rounded-xl border border-gray-200 shadow-xl">
              {session ? <>
                  <button onClick={handleChangeUsername} className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                    Cambiar nombre
                  </button>
                  <button onClick={() => setShowPricingPopup(true)} className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-x-2">
                    <Crown className="h-4 w-4" />
                    Cambiar plan
                  </button>
                  <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100">
                    Cerrar sesión
                  </button>
                </> : <>
                  <button onClick={handleLogin} className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                    Iniciar sesión
                  </button>
                  <button onClick={handleRegister} className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                    Registrarse
                  </button>
                </>}
            </div>}
        </div>}

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-4 pt-12 pb-32 max-w-5xl mx-auto py-[4px]">
        <div className="text-center w-full">
          <h1 className="mb-5 font-black text-black text-5xl text-center sm:text-8xl">
            DENTAXY
            <Typewriter 
              text={[".ai", ".com"]} 
              speed={100} 
              deleteSpeed={80} 
              delay={12000}
              loop={true}
              className="text-blue-500"
            />
          </h1>

          <div className="mb-5">
            <div className="inline-block bg-blue-500 text-white text-sm font-base rounded-full mx-0 my-0 px-[20px] py-px">
              Calidad y velocidad en redacción clínica, impulsada por inteligencia
              artificial
            </div>
          </div>

          <div className="mb-12">
            <button onClick={handleBetaAccess} className="rounded-full px-[20px] py-[8px] hover:bg-slate-1 text-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-gray-50 animate-wiggle">
              PRUEBA BETA
            </button>
          </div>

          <div className="apple-card p-8 mb-12 max-w-4xl mx-auto">
            <h2 className="mb-6 text-slate-600 mx-0 my--3 font-normal text-base text-justify">
                🔽 Demostracion de redacción automatica...
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <AntecedentesPersonalesPatologicos 
        formData={{
          antecedentesPersonalesPatologicos: formData.antecedentesPersonalesPatologicos,
          padecimientoActual: {} as any,
          antecedentesHeredoFamiliares: {} as any,
          antecedentesPersonalesNoPatologicos: {} as any,
          antecedentesAlergicos: {} as any,
          antecedentesHemorragicos: {} as any,
          antecedentesQuirurgicos: {} as any,
          interrogatorioSistemas: {} as any,
          exploracionFisica: {} as any,
          examenCabeza: {} as any,
          articulacionCraneomandibular: {} as any,
          examenCuello: {} as any,
          examenIntrabucal: {} as any,
          glandulasSalivales: {} as any,
          oclusion: {} as any,
          relacionDientes: {} as any,
          lineaMedia: {} as any,
          frenillos: {} as any,
          diagnostico: {} as any,
          pronostico: {} as any,
          serviciosDomiciliarios: '',
          pisosVivienda: '',
          materialVivienda: '',
          materialPiso: '',
          ventilacion: '',
          frecuenciaLimpieza: '',
          hacinamiento: '',
          frecuenciaBano: '',
          higieneBucal: {
            frecuenciaCepillado: '',
            usoHiloDental: '',
            tipoCerdas: '',
            cantidadPasta: '',
            marcaPasta: ''
          },
          alimentacion: {
            tipoDieta: '',
            frecuenciaComidas: '',
            tiposAlimentos: '',
            saltaComidas: '',
            consumoNutritivo: ''
          },
          grupoSanguineo: '',
          factorRh: '',
          inmunizaciones: '',
          peso: '',
          imc: '',
          talla: '',
          presionArterial: '',
          pulso: '',
          frecuenciaCardiaca: '',
          frecuenciaRespiratoria: '',
          temperatura: '',
          diagnosticos: '',
          pronosticos: ''
        }} 
        handleAntecedentePatologicoChange={handleAntecedentePatologicoChange} 
      />
            </div>
          </div>
        </div>
      </div>

      {/* Apple Style Footer */}
      <footer className="bg-white py-12 border-t border-gray-200">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Column 1 - Company Info */}
            <div className="flex flex-col space-y-3">
              <div className="flex items-center gap-2">
                <img alt="Logo" src="/lovable-uploads/3236de6d-a3e4-4b81-9c83-b32690d4212d.png" className="h-8 w-8" />
                <h3 className="text-lg font-semibold text-gray-800">Dentaxy</h3>
              </div>
              <p className="text-sm text-gray-500">Dental Basics Academy</p>
              <p className="text-xs text-gray-400">© 2025 Dentaxy.ai Todos los derechos reservados.</p>
              <p className="text-xs text-gray-400">© 2025 Dentaxy.com Todos los derechos reservados.</p>
              <div className="flex items-center">
                <a href="https://instagram.com/dentalbasicsacademy" target="_blank" rel="noopener noreferrer" onClick={e => {
                e.currentTarget.classList.add('animate-scaleClick');
                setTimeout(() => {
                  e.currentTarget.classList.remove('animate-scaleClick');
                }, 500);
              }} className="flex items-center hover:cursor-pointer transition-transform">
                  <img src="/lovable-uploads/d122138d-9f75-4331-a81b-fd93b1b2e542.png" alt="Instagram" className="h-6 w-6 mr-2 animate-wiggle" style={{
                  transformOrigin: 'center'
                }} />
                  <span className="text-sm text-gray-500">@dentalbasicsacademy</span>
                </a>
              </div>
            </div>
            
            {/* Column 2 - Quick Links */}
            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-4">Enlaces</h3>
              <ul className="space-y-2">
                {menuItems.map(item => <li key={item.label}>
                    <Link to={item.href} className="text-gray-500 hover:text-gray-800 transition-colors text-sm">
                      {item.label}
                    </Link>
                  </li>)}
              </ul>
            </div>
            
            {/* Column 3 - Legal */}
            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/terms" className="text-gray-500 hover:text-gray-800 transition-colors text-sm">
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-500 hover:text-gray-800 transition-colors text-sm">
                    Política de Privacidad
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-xs">Transformando la experiencia odontológica con inteligencia artificial</p>
          </div>
        </div>
      </footer>

      {/* Username Popup - Updated with welcome message and terms checkboxes */}
      {showPopup && session && <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-black mb-2">
            ¡Bienvenido a Dental Basics Academy!
          </h2>
          <p className="text-gray-600 mb-6">
            Para comenzar a utilizar nuestra plataforma, por favor ingresa tu nombre de usuario.
          </p>
          
          <Input type="text" placeholder="Ingresa tu nombre de usuario" value={username} onChange={e => setUsername(e.target.value)} className="mb-6" />
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" checked={acceptTerms} onCheckedChange={checked => setAcceptTerms(checked === true)} />
              <label htmlFor="terms" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Acepto los <Link to="/terms" className="text-blue-600 hover:underline" target="_blank">Términos y Condiciones</Link>
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="privacy" checked={acceptPrivacy} onCheckedChange={checked => setAcceptPrivacy(checked === true)} />
              <label htmlFor="privacy" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Acepto la <Link to="/privacy" className="text-blue-600 hover:underline" target="_blank">Política de Privacidad</Link>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button variant="ghost" onClick={() => setShowPopup(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveUsername} disabled={loading || !username.trim() || !acceptTerms || !acceptPrivacy} className={`${!acceptTerms || !acceptPrivacy || !username.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </div>
      </div>}

      {/* Pricing Popup */}
      {showPricingPopup && <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-black">Planes Disponibles</h2>
              <Button variant="ghost" onClick={() => setShowPricingPopup(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                  Disponible
                </div>
                <h3 className="text-xl font-bold text-black mb-4 mt-4">
                  Plan Beta
                </h3>
                <p className="text-gray-600 mb-6">
                  Acceso completo durante la fase beta
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <span className="mr-2 text-green-500">✓</span> Acceso a todas
                    las funciones
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="mr-2 text-green-500">✓</span> Soporte
                    prioritario
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="mr-2 text-green-500">✓</span> Beneficios
                    exclusivos
                  </li>
                </ul>
                <Button onClick={handleSelectBetaPlan} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  {hasBetaPlan ? "Plan Actual" : "Seleccionar Plan Beta"}
                </Button>
              </div>

              <div className="p-6 rounded-xl border border-gray-200 shadow-sm opacity-50">
                <h3 className="text-xl font-bold text-black mb-4">
                  Plan Básico
                </h3>
                <p className="text-gray-600 mb-6">Próximamente</p>
              </div>

              <div className="p-6 rounded-xl border border-gray-200 shadow-sm opacity-50">
                <h3 className="text-xl font-bold text-black mb-4">
                  Plan Premium
                </h3>
                <p className="text-gray-600 mb-6">Pr
