
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

interface SintomasToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const SintomasToggle = ({ checked, onChange }: SintomasToggleProps) => {
  return (
    <div
      className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 w-full text-left cursor-pointer"
      onClick={() => onChange(!checked)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-500" />
          <Label className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Paciente sin sintomatología
          </Label>
        </div>
        <Switch
          id="sin-sintomas"
          checked={checked}
          onCheckedChange={onChange}
          className="data-[state=checked]:bg-blue-500"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      {checked && (
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 ml-7">
          Si el paciente no presenta síntomas, no es necesario rellenar la sección de características del dolor.
        </p>
      )}
    </div>
  );
};

export default SintomasToggle;
