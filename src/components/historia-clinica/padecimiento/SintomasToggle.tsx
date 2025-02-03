import { Label } from "@/components/ui/label";
import { AnimatedCheckbox } from "@/components/ui/custom-checkbox";

interface SintomasToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const SintomasToggle = ({ checked, onChange }: SintomasToggleProps) => {
  return (
    <div className="mb-4">
      <div className="flex items-center space-x-2">
        <AnimatedCheckbox 
          id="sinSintomas"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <Label htmlFor="sinSintomas">Actualmente no refiere sintomatología</Label>
      </div>
    </div>
  );
};

export default SintomasToggle;