import { Label } from "@/components/ui/label";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { cn } from "@/lib/utils";

interface SintomasToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const SintomasToggle = ({ checked, onChange }: SintomasToggleProps) => {
  return (
    <div className="mb-4">
      <RainbowButton
        onClick={() => onChange(!checked)}
        className={cn(
          "text-sm text-black dark:text-white font-normal",
          checked && "scale-105"
        )}
      >
        Actualmente no refiere sintomatología
      </RainbowButton>
    </div>
  );
};

export default SintomasToggle;