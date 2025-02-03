import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SintomasToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const SintomasToggle = ({ checked, onChange }: SintomasToggleProps) => {
  return (
    <div className="mb-4">
      <div 
        onClick={() => onChange(!checked)}
        className={cn(
          "inline-block cursor-pointer transition-all duration-300",
          "p-2 bg-gradient-to-r rounded-lg border shadow-sm",
          checked ? 
            "from-primary/20 to-secondary/20 border-primary/30 scale-105" : 
            "from-primary/10 to-secondary/10 border-primary/20 hover:scale-105"
        )}
      >
        <Label 
          htmlFor="sinSintomas" 
          className={cn(
            "text-lg font-mplus font-medium bg-clip-text text-transparent bg-gradient-to-r cursor-pointer",
            "transition-all duration-300",
            checked ? 
              "from-primary via-secondary to-primary" : 
              "from-primary to-secondary"
          )}
        >
          Actualmente no refiere sintomatología
        </Label>
      </div>
    </div>
  );
};

export default SintomasToggle;