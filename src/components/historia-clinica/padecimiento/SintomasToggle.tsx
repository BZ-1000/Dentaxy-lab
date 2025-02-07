
import { RainbowButton } from "@/components/ui/rainbow-button";
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
        "w-full py-3 px-6 rounded-lg text-sm font-medium transition-all",
        checked 
          ? "bg-blue-500 text-white hover:bg-blue-600" 
          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
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
