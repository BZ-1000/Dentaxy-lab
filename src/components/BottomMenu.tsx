
import { Home, Info, HelpCircle, Star, CreditCard, Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const BottomMenu = () => {
  const { toast } = useToast();
  const location = useLocation();

  const menuItems = [
    {
      icon: Home,
      label: "Inicio",
      path: "/"
    },
    {
      icon: Info,
      label: "Nosotros",
      path: "/nosotros"
    },
    {
      icon: HelpCircle,
      label: "Funciones",
      path: "/funciones"
    },
    {
      icon: Star,
      label: "Beneficios",
      path: "/beneficios"
    },
    {
      icon: CreditCard,
      label: "Planes",
      path: "/planes"
    },
    {
      icon: Mail,
      label: "Contacto",
      path: "/contacto"
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-lg z-50">
      <nav className="max-w-screen-xl mx-auto px-2">
        <div className="flex justify-around items-center h-12 overflow-x-auto">
          {menuItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`flex flex-col items-center gap-0.5 ${
                location.pathname === item.path 
                  ? 'text-primary dark:text-primary' 
                  : 'text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary'
              } transition-colors duration-200 min-w-[3.5rem]`}
            >
              <item.icon className="h-4 w-4" />
              <span className="text-[10px] whitespace-nowrap">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default BottomMenu;
