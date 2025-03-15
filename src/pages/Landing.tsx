import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Settings, Bell, User, Save, LogOut, Crown, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Database } from '@/types/supabase';
const menuItems = [{
  label: "Menu",
  href: "#"
}, {
  label: "settings.",
  href: "#"
}, {
  label: "perfil.",
  href: "#"
}, {
  label: "nosotros",
  href: "#"
}];
const Landing = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [activeItem, setActiveItem] = useState<string>("Menu");
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
      const {
        data,
        error
      } = await supabase.from('user_profiles').select('id, username, created_at').eq('id', userId).single();
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
  const handleSaveUsername = async () => {
    if (!session || !username.trim()) {
      toast.error('Por favor ingresa un nombre de usuario');
      return;
    }
    setLoading(true);
    try {
      const {
        error
      } = await supabase.from('user_profiles').upsert([{
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
  if (!mounted) return null;
  return <div className="min-h-screen w-full bg-white">
      {/* Header with logo and navigation */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <img src="/diente.png" alt="Logo" className="h-12 w-12" />
        </div>

        {/* Main horizontal navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {menuItems.map(item => <button key={item.label} onClick={() => handleItemClick(item.label)} className={`text-black hover:text-black/70 text-sm ${activeItem === item.label ? 'font-medium' : 'font-normal'}`}>
              {item.label}
            </button>)}
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

      {/* Mobile Menu */}
      {isMobile && <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-4">
          <div className="flex justify-around">
            {menuItems.map(item => <button key={item.label} onClick={() => handleItemClick(item.label)} className={`flex flex-col items-center text-xs ${activeItem === item.label ? 'text-blue-600' : 'text-gray-500'}`}>
                {item.label}
              </button>)}
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
      <div className="flex flex-col items-center justify-center px-4 pt-16 pb-32 max-w-5xl mx-auto">
        <div className="text-center w-full">
          <h1 className="mb-8 font-black text-black text-7xl sm:text-8xl">
            DENTAXY.ai
          </h1>
          
          <div className="mb-16">
            <div className="inline-block bg-blue-500 text-white rounded-full text-lg font-medium px-[24px] py-px">
              REDACCIÓN CLÍNICA CON INTELIGENCIA ARTIFICIAL
            </div>
          </div>
          
          <div className="mb-16">
            <button onClick={handleBetaAccess} className="bg-[#00BCD4] hover:bg-[#00ACC1] text-white font-bold py-4 px-12 rounded-full text-xl">
              PRUEBA BETA
            </button>
          </div>

          <div className="border border-gray-200 rounded-3xl p-8 mb-12">
            <h2 className="text-xl font-bold mb-4 text-center">
              "DEMOSTRACIÓN DE REDACCIÓN AUTOMÁTICA"
            </h2>
            <div className="h-60 flex items-center justify-center text-gray-400">
              Vista previa de la demostración
            </div>
          </div>

          <p className="text-center text-gray-600 text-sm max-w-3xl mx-auto">
            "Revisado y aprobado por líderes en odontología clínica, incluyendo el Dr. Alejandro Fuentes, la Dra. Mariana López y el Dr. Ricardo Méndez."
          </p>
        </div>
      </div>

      {/* Username Popup */}
      {showPopup && session && <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-black mb-4">¡Bienvenido!</h2>
            <p className="text-gray-600 mb-6">Por favor, ingresa tu nombre de usuario para continuar.</p>
            <div className="space-y-4">
              <Input type="text" placeholder="Nombre de usuario" value={username} onChange={e => setUsername(e.target.value)} className="bg-white border-gray-300" />
              <Button onClick={handleSaveUsername} className="w-full bg-blue-600 text-white hover:bg-blue-700" disabled={loading}>
                {loading ? <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Guardando...
                  </span> : <span className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Guardar
                  </span>}
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
                <h3 className="text-xl font-bold text-black mb-4 mt-4">Plan Beta</h3>
                <p className="text-gray-600 mb-6">Acceso completo durante la fase beta</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <span className="mr-2 text-green-500">✓</span> Acceso a todas las funciones
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="mr-2 text-green-500">✓</span> Soporte prioritario
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="mr-2 text-green-500">✓</span> Beneficios exclusivos
                  </li>
                </ul>
                <Button onClick={handleSelectBetaPlan} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  {hasBetaPlan ? "Plan Actual" : "Seleccionar Plan Beta"}
                </Button>
              </div>
              
              <div className="p-6 rounded-xl border border-gray-200 shadow-sm opacity-50">
                <h3 className="text-xl font-bold text-black mb-4">Plan Básico</h3>
                <p className="text-gray-600 mb-6">Próximamente</p>
              </div>
              
              <div className="p-6 rounded-xl border border-gray-200 shadow-sm opacity-50">
                <h3 className="text-xl font-bold text-black mb-4">Plan Premium</h3>
                <p className="text-gray-600 mb-6">Próximamente</p>
              </div>
            </div>
          </div>
        </div>}

      {/* Auth Dialog */}
      <AuthDialog isOpen={authDialog.isOpen} onClose={() => setAuthDialog({
      ...authDialog,
      isOpen: false
    })} defaultMode={authDialog.mode} onSuccess={handleAuthSuccess} />
    </div>;
};
export default Landing;