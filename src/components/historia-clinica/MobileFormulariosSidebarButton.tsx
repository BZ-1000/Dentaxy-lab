
import React from "react";
import { BookOpen } from "lucide-react";

interface MobileFormulariosSidebarButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileFormulariosSidebarButton: React.FC<MobileFormulariosSidebarButtonProps> = ({ isOpen, onToggle }) => {
  return (
    <button
      aria-label="Mostrar formularios guardados"
      onClick={onToggle}
      className={`fixed top-4 left-4 z-50 flex items-center justify-center rounded-full bg-blue-600 p-3 shadow-lg transition-transform hover:bg-blue-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 md:hidden`}
      title="Mostrar formularios guardados"
      type="button"
    >
      <BookOpen className="h-6 w-6 text-white" />
    </button>
  );
};

export default MobileFormulariosSidebarButton;
