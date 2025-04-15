import { Home, Info, HelpCircle, Award, DollarSign, Mail, Settings, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const BottomMenu = () => {
  const { toast } = useToast();
  const location = useLocation();

  const handleSettingsClick = () => {
    toast({
      title: "Ajustes",
      description: "Esta función estará disponible próximamente",
    });
  };

  const handleProfileClick = () => {
    toast({
      title: "Perfil",
      description: "Esta función estará disponible próximamente",
    });
  };

  const menuItems = [
    { path: '/', label: 'Inicio', icon: Home },
    { path: '/nosotros', label: 'Nosotros', icon: Info },
    { path: '/como-funciona', label: 'Funciones', icon: HelpCircle },
    { path: '/beneficios', label: 'Beneficios', icon: Award },
    { path: '/planes', label: 'Planes', icon: DollarSign },
    { path: '/contacto', label: 'Contacto', icon: Mail },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 md:top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t md:border-b border-gray-200 dark:border-gray-800 shadow-lg">
      <nav className="max-w-screen-xl mx-auto px-4" aria-label="Menu">
        <div className="flex justify-around items-center h-16 overflow-x-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col md:flex-row items-center gap-1 px-1 focus:outline-none ${
                location.pathname === item.path
                  ? 'text-primary dark:text-primary'
                  : 'text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary'
              } transition-colors duration-200`}
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              <span className="text-xs md:ml-1">{item.label}</span>
            </Link>
          ))}

          <button
            onClick={handleSettingsClick}
            className="flex flex-col md:flex-row items-center gap-1 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors duration-200 focus:outline-none"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" aria-hidden="true" />
            <span className="text-xs md:ml-1">Ajustes</span>
          </button>

          <button
            onClick={handleProfileClick}
            className="flex flex-col md:flex-row items-center gap-1 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors duration-200 focus:outline-none"
            aria-label="Profile"
          >
            <User className="h-5 w-5" aria-hidden="true" />
            <span className="text-xs md:ml-1">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default BottomMenu;
