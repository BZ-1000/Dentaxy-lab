import { useState } from "react";
import { Home, Settings, User, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

const BottomMenu = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSettingsClick = () => {
    toast({
      title: "Ajustes",
      description: "Esta función estará disponible próximamente",
    });
  };

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Cerrar Sesión",
      description: "Sesión cerrada exitosamente",
    });
    setShowDropdown(false);
  };

  const handleChangeUsername = () => {
    toast({
      title: "Cambiar Nombre de Usuario",
      description: "Esta función estará disponible próximamente",
    });
    setShowDropdown(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-lg z-50">
      <nav className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center h-16 relative">
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 ${
              location.pathname === '/'
                ? 'text-primary dark:text-primary'
                : 'text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary'
            } transition-colors duration-200`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Inicio</span>
          </Link>

          <button
            onClick={handleSettingsClick}
            className="flex flex-col items-center gap-1 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors duration-200"
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs">Ajustes</span>
          </button>

          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="flex flex-col items-center gap-1 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors duration-200"
            >
              <User className="h-5 w-5" />
              <span className="text-xs">Perfil</span>
            </button>
            {showDropdown && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <button
                    onClick={handleChangeUsername}
                    className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                    role="menuitem"
                  >
                    Cambiar Nombre de Usuario
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                    role="menuitem"
                  >
                    Cerrar Sesión
                  </button>
                  <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                    Plan Actual: Beta
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default BottomMenu;
