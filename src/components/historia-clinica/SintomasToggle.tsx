
import { cn } from "@/lib/utils";

interface SintomasToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const SintomasToggle = ({ checked, onChange }: SintomasToggleProps) => {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "w-full py-3 px-6 rounded-lg text-sm font-medium transition-all border",
        checked 
          ? "bg-blue-500 text-white border-blue-600 hover:bg-blue-600 dark:bg-blue-600 dark:text-white dark:border-blue-700 dark:hover:bg-blue-700" 
          : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
      )}
    >
      Actualmente no refiere sintomatología
      <span className="text-sm text-blue-200 dark:text-blue-300 ml-2">
        (Seleccionar para ocultar opciones de sintomatología)
      </span>
    </button>
  );
};

export default SintomasToggle;
