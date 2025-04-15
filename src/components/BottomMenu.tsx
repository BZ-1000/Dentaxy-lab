
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
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-lg z-50">
      <nav className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center h-16 overflow-x-auto">
          {menuItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`flex flex-col items-center gap-1 px-1 ${
                location.pathname === item.path
                  ? 'text-primary dark:text-primary' 
                  : 'text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary'
              } transition-colors duration-200`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
          
          <button 
            onClick={handleSettingsClick}
            className="flex flex-col items-center gap-1 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors duration-200"
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs">Ajustes</span>
          </button>
          
          <button 
            onClick={handleProfileClick}
            className="flex flex-col items-center gap-1 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors duration-200"
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default BottomMenu;
