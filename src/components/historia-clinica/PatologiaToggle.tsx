
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertCircle, EyeOff, Eye } from "lucide-react";

interface PatologiaToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const PatologiaToggle = ({ checked, onChange }: PatologiaToggleProps) => {
  const handleToggleClick = () => {
    onChange(!checked);
  };

  return (
    <div
      className="bg-emerald-50 dark:bg-emerald-900/20 p-2 sm:p-4 rounded-lg border border-blue-100 dark:border-blue-800 w-full text-left cursor-pointer"
      onClick={handleToggleClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 sm:gap-2">
          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
          <Label className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-1">
            Paciente no presenta ninguna patología
            {checked ? (
              <span className="ml-1 sm:ml-2 text-xs text-green-500 bg-green-50 dark:bg-green-900/20 px-1 sm:px-2 py-0.5 rounded-full flex items-center gap-1">
                <EyeOff className="h-3 w-3" />
                <span className="hidden sm:inline">Secciones ocultas</span>
                <span className="sm:hidden">Ocultas</span>
              </span>
            ) : (
              <span className="ml-1 sm:ml-2 text-xs text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-1 sm:px-2 py-0.5 rounded-full flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span className="hidden sm:inline">Secciones visibles</span>
                <span className="sm:hidden">Visibles</span>
              </span>
            )}
          </Label>
        </div>
        <Switch
          id="sin-patologia"
          checked={checked}
          onCheckedChange={onChange}
          className="data-[state=checked]:bg-emerald-500 scale-75 sm:scale-100"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      {checked && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 sm:mt-2 ml-5 sm:ml-7">
          Preciona el boton generar redaccion IA. No es necesario rellenar el resto del formulario.
        </p>
      )}
    </div>
  );
};

export default PatologiaToggle;
