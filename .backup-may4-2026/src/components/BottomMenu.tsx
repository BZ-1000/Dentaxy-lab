import { Home, Info, HelpCircle, Award, Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
const BottomMenu = () => {
  const {
    toast
  } = useToast();
  const location = useLocation();
  const handleSettingsClick = () => {
    toast({
      title: "Ajustes",
      description: "Esta función estará disponible próximamente"
    });
  };
  const handleProfileClick = () => {
    toast({
      title: "Perfil",
      description: "Esta función estará disponible próximamente"
    });
  };
  const menuItems = [{
    path: '/',
    label: 'Inicio',
    icon: Home
  }, {
    path: '/nosotros',
    label: 'Nosotros',
    icon: Info
  }, {
    path: '/como-funciona',
    label: 'Tecnologías',
    icon: HelpCircle
  }, {
    path: '/beneficios',
    label: 'Beneficios',
    icon: Award
  }, {
    path: '/contacto',
    label: 'Contacto',
    icon: Mail
  }];
  return <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-lg z-50">
      <nav className="max-w-screen-xl mx-auto px-2 md:px-4">
        <div className="flex justify-around items-center h-12 md:h-16 overflow-x-auto">
          {menuItems.map(item => <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-0.5 px-1 ${location.pathname === item.path ? 'text-primary dark:text-primary' : 'text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary'} transition-colors duration-200`}>
              <item.icon className="h-4 w-4 md:h-5 md:w-5" />
              <span className="text-[0.65rem] md:text-xs">{item.label}</span>
            </Link>)}
          
          
          
          
        </div>
      </nav>
    </div>;
};
export default BottomMenu;