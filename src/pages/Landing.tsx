import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { LogOut, Save, Crown, UserCircle } from 'lucide-react';
import type { Database } from '@/types/supabase';

const Landing = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [activeItem, setActiveItem] = useState<string>("Inicio");
  const [authDialog, setAuthDialog] = useState<{
    isOpen: boolean;
    mode: "login" | "register";
  }>({
    isOpen: false,
    mode: "login"
  });
  const [username, setUsername] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showPricingPopup, setShowPricingPopup] = useState<boolean>(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasBetaPlan, setHasBetaPlan] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
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
    return () => subscription.unsubscribe();
  }, []);

  const checkUsername = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, username, created_at')
        .eq('id', userId)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data?.username) {
        setUsername(data.username);
      } else {
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error checking username:', error);
    }
  };

  const checkUserPlan = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_plans')
        .select('plan_type')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) {
        console.error('Error checking plan:', error);
        return;
      }
      
      setHasBetaPlan(data?.plan_type === 'beta');
    } catch (error) {
      console.error('Error checking user plan:', error);
    }
  };

  const handleSaveUsername = async () => {
    if (!session || !username.trim()) {
      toast.error('Por favor ingresa un nombre de usuario');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert([{
          id: session.user.id,
          username: username.trim()
        }], {
          onConflict: 'id'
        });
        
      if (error) throw error;
      
      setShowPopup(false);
      toast.success('¡Nombre de usuario guardado exitosamente!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBetaPlan = async () => {
    if (!session) {
      toast.error('Debes iniciar sesión para seleccionar un plan');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('user_plans')
        .upsert({
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
    const { error } = await supabase.auth.signOut();
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

  useEffect(() => {
    setMounted(true);
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        checkUsername(session.user.id);
        checkUserPlan(session.user.id);
      }
    };
    
    getSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session) {
        checkUsername(session.user.id);
        checkUserPlan(session.user.id);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* Simple Header */}
      <header className="relative z-50 flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <img src="/diente.png" alt="Logo" className="h-8 w-8" />
          {!isMobile && (
            <span className="text-sm sm:text-base font-semibold text-black">
              Dental Basics Academy IA
            </span>
          )}
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <button onClick={() => setActiveItem("Inicio")} 
            className={`text-sm font-medium ${activeItem === "Inicio" ? "text-blue-600" : "text-gray-700"}`}>
            Inicio
          </button>
          <button onClick={() => setActiveItem("Perfil") & (session && setShowDropdown(!showDropdown))}
            className={`text-sm font-medium ${activeItem === "Perfil" ? "text-blue-600" : "text-gray-700"}`}>
            Perfil
          </button>
          <button onClick={() => setShowPricingPopup(true)}
            className={`text-sm font-medium ${activeItem === "Planes" ? "text-blue-600" : "text-gray-700"}`}>
            Planes
          </button>
          <button onClick={() => setActiveItem("Nosotros")}
            className={`text-sm font-medium ${activeItem === "Nosotros" ? "text-blue-600" : "text-gray-700"}`}>
            Nosotros
          </button>
        </nav>
        
        <div className="flex gap-4">
          {!session ? (
            <>
              {!isMobile ? (
                <>
                  <Button onClick={handleLogin} 
                    className="bg-black text-white hover:bg-black/80">
                    Iniciar Sesión
                  </Button>
                  <Button onClick={handleRegister}
                    className="bg-black text-white hover:bg-black/80">
                    Registrarse
                  </Button>
                </>
              ) : (
                <Button onClick={handleLogin} size="icon" 
                  className="bg-black text-white hover:bg-black/80">
                  <UserCircle className="h-5 w-5" />
                </Button>
              )}
            </>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-black text-sm">{username}</span>
              <Button onClick={() => setShowDropdown(!showDropdown)} size="icon"
                className="bg-black text-white hover:bg-black/80">
                <UserCircle className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
        
        <AnimatePresence>
          {showDropdown && session && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full right-4 z-[60] w-48 p-2 bg-white rounded-xl shadow-lg mt-2 flex flex-col gap-2"
            >
              {hasBetaPlan && (
                <div className="px-2 py-3 text-blue-600 text-sm rounded-lg w-full text-left flex items-center gap-x-2">
                  <Crown className="h-4 w-4" />
                  Plan Beta
                </div>
              )}
              <motion.button
                onClick={handleChangeUsername}
                whileHover={{ backgroundColor: "#f7f7f7" }}
                whileTap={{ scale: 0.95 }}
                className="px-2 py-3 text-gray-700 text-sm rounded-lg w-full text-left flex items-center gap-x-2"
              >
                Cambiar nombre
              </motion.button>
              <motion.button
                onClick={() => setShowPricingPopup(true)}
                whileHover={{ backgroundColor: "#f7f7f7" }}
                whileTap={{ scale: 0.95 }}
                className="px-2 py-3 text-gray-700 text-sm rounded-lg w-full text-left flex items-center gap-x-2"
              >
                <Crown className="h-4 w-4" />
                Cambiar plan
              </motion.button>
              <motion.button
                onClick={handleLogout}
                whileHover={{ backgroundColor: "#f7f7f7" }}
                whileTap={{ scale: 0.95 }}
                className="px-2 py-3 text-red-500 text-sm rounded-lg w-full text-left flex items-center gap-x-2"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex justify-around items-center p-3">
          <button onClick={() => setActiveItem("Inicio")} 
            className={`text-xs ${activeItem === "Inicio" ? "text-blue-600" : "text-gray-600"}`}>
            Inicio
          </button>
          <button onClick={() => setActiveItem("Perfil") & (session && setShowDropdown(!showDropdown))}
            className={`text-xs ${activeItem === "Perfil" ? "text-blue-600" : "text-gray-600"}`}>
            Perfil
          </button>
          <button onClick={() => setShowPricingPopup(true)}
            className={`text-xs ${activeItem === "Planes" ? "text-blue-600" : "text-gray-600"}`}>
            Planes
          </button>
          <button onClick={() => setActiveItem("Nosotros")}
            className={`text-xs ${activeItem === "Nosotros" ? "text-blue-600" : "text-gray-600"}`}>
            Nosotros
          </button>
        </nav>
      )}

      {/* Main Content */}
      <main className="relative z-40 flex flex-col items-center justify-center px-4 pt-16 pb-20 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-black mb-3 tracking-tight">
          DENTAXY<span className="text-blue-600">.ai</span>
        </h1>
        
        <div className="bg-blue-600 text-white py-3 px-8 rounded-full mb-10 text-center">
          <p className="text-sm md:text-base">
            Inteligencias artificiales para odontólogos
          </p>
        </div>
        
        <Button 
          onClick={handleBetaAccess} 
          className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors rounded-full px-10 py-6 text-lg font-medium shadow-sm"
        >
          Prueba BETA
        </Button>
      </main>

      {/* Username Popup */}
      {showPopup && session && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Bienvenido!</h2>
            <p className="text-gray-600 mb-6">Por favor, ingresa tu nombre de usuario para continuar.</p>
            <div className="space-y-4">
              <Input 
                type="text" 
                placeholder="Nombre de usuario" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                className="border-gray-300" 
              />
              <Button 
                onClick={handleSaveUsername} 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Guardando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Guardar
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Popup */}
      {showPricingPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Planes Disponibles</h2>
              <Button 
                variant="ghost" 
                onClick={() => setShowPricingPopup(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
                  Disponible
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 mt-4">Plan Beta</h3>
                <p className="text-gray-500 mb-6">Acceso completo durante la fase beta</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-600">
                    <span className="mr-2 text-blue-600">✓</span> Acceso a todas las funciones
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="mr-2 text-blue-600">✓</span> Soporte prioritario
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="mr-2 text-blue-600">✓</span> Beneficios exclusivos
                  </li>
                </ul>
                <Button 
                  onClick={handleSelectBetaPlan} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {hasBetaPlan ? "Plan Actual" : "Seleccionar Plan Beta"}
                </Button>
              </div>
              
              <div className="p-6 rounded-xl border border-gray-200 shadow-sm opacity-50">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Plan Básico</h3>
                <p className="text-gray-500 mb-6">Próximamente</p>
              </div>
              
              <div className="p-6 rounded-xl border border-gray-200 shadow-sm opacity-50">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Plan Premium</h3>
                <p className="text-gray-500 mb-6">Próximamente</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <AuthDialog 
        isOpen={authDialog.isOpen} 
        onClose={() => setAuthDialog({ ...authDialog, isOpen: false })} 
        defaultMode={authDialog.mode} 
        onSuccess={handleAuthSuccess} 
      />
    </div>
  );
};

export default Landing;
