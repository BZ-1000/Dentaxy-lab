import { motion } from "framer-motion";
import { Star, Zap } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface BetaBannerProps {
  hasBetaPlan: boolean;
  onSelectBeta: () => void;
  className?: string;
}

export function BetaBanner({ hasBetaPlan, onSelectBeta, className }: BetaBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-6",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-amber-100 rounded-full p-2">
            <Star className="h-4 w-4 text-amber-600 fill-current" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-900 text-sm">Plan Beta</h3>
            <p className="text-xs text-amber-700">Acceso completo gratuito durante la fase beta</p>
          </div>
        </div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            size="sm"
            onClick={onSelectBeta}
            disabled={hasBetaPlan}
            className={cn(
              "text-xs h-8 px-4",
              hasBetaPlan 
                ? "bg-amber-200 text-amber-800 cursor-default" 
                : "bg-amber-500 hover:bg-amber-600 text-white"
            )}
          >
            {hasBetaPlan ? (
              <>
                <Zap className="h-3 w-3 mr-1" />
                Plan Actual
              </>
            ) : (
              "Unirse a Beta"
            )}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}