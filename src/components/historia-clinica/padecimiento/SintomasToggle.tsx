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
        <div className="p-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20 shadow-sm">
          <Label 
            htmlFor="sinSintomas" 
            className="text-lg font-mplus font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
          >
            Actualmente no refiere sintomatología
          </Label>
        </div>
      </div>
    </div>
  );
};

export default SintomasToggle;