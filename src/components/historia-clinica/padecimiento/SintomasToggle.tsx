
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
          ? "bg-blue-500/10 text-blue-600 border-blue-200 hover:bg-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30" 
          : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
      )}
    >
      Actualmente no refiere sintomatología
      <span className="text-sm text-gray-400 dark:text-gray-500 ml-2">
        (Seleccionar para ocultar opciones de sintomatología)
      </span>
    </button>
  );
};

export default SintomasToggle;
