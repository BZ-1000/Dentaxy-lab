import { Home, Menu, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";

const BottomMenu = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-lg z-50">
      <nav className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          <Link to="/" className="flex flex-col items-center gap-1 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
            <Home className="h-5 w-5" />
            <span className="text-xs">Inicio</span>
          </Link>
          
          <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
            <Menu className="h-5 w-5" />
            <span className="text-xs">Menú</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
            <Settings className="h-5 w-5" />
            <span className="text-xs">Ajustes</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
            <User className="h-5 w-5" />
            <span className="text-xs">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default BottomMenu;