
import React from "react";
import { BookOpen } from "lucide-react";

interface FormulariosSidebarMobileButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

const FormulariosSidebarMobileButton: React.FC<FormulariosSidebarMobileButtonProps> = ({ onClick, isOpen }) => {
  return (
    // Only show on mobile (hidden md:block hides on md and above)
    <div className="fixed top-4 left-4 z-50 md:hidden">
      <button
        aria-label="Abrir formularios"
        onClick={onClick}
        className="p-2 rounded-md bg-transparent hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
      >
        <BookOpen
          size={28}
          className="text-primary dark:text-primary"
          style={{ display: "block" }}
        />
      </button>
    </div>
  );
};

export default FormulariosSidebarMobileButton;

