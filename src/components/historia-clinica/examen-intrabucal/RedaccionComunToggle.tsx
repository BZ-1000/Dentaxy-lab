import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Info } from "lucide-react";

interface RedaccionComunToggleProps {
  isActive: boolean;
  onChange: (value: boolean) => void;
}

const RedaccionComunToggle: React.FC<RedaccionComunToggleProps> = ({ isActive, onChange }) => {
  return (
    <div className="bg-blue-50/50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <Label htmlFor="redaccion-comun" className="text-base font-semibold text-blue-900 dark:text-blue-100 cursor-pointer">
              Redacción común sin anomalías
            </Label>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Se generará una redacción descriptiva profesional de estructuras orales sin alteraciones
            </p>
          </div>
        </div>
        <Switch
          id="redaccion-comun"
          checked={isActive}
          onCheckedChange={onChange}
          className="flex-shrink-0"
        />
      </div>
    </div>
  );
};

export default RedaccionComunToggle;
