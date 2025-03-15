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
      className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 w-full text-left cursor-pointer"
      onClick={handleToggleClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-500" />
          <Label className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-1">
            Paciente no presenta ninguna patología
            {checked ? (
              <span className="ml-2 text-xs text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <EyeOff className="h-3 w-3" />
                Secciones ocultas
              </span>
            ) : (
              <span className="ml-2 text-xs text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Secciones visibles
              </span>
            )}
          </Label>
        </div>
        <Switch
          id="sin-patologia"
          checked={checked}
          onCheckedChange={onChange}
          className="data-[state=checked]:bg-blue-500"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      {checked && (
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 ml-7">
          Preciona el boton generar redaccion IA. No es necesario rellenar el resto del formulario.
        </p>
      )}
    </div>
  );
};

export default PatologiaToggle;
