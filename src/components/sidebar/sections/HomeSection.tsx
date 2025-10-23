import { useState } from 'react';
import { Home, Plus, Calendar as CalendarIcon, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HomeOverlay } from '../overlays/HomeOverlay';

interface HomeSectionProps {
  collapsed: boolean;
}

export const HomeSection = ({ collapsed }: HomeSectionProps) => {
  const [overlayOpen, setOverlayOpen] = useState(false);

  const handleClick = () => {
    setOverlayOpen(true);
  };

  if (collapsed) {
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center p-3 hover:bg-accent/50 transition-colors rounded-lg"
                onClick={handleClick}
              >
                <Home className="h-5 w-5" style={{ color: '#3B82F6', strokeWidth: 1.5 }} />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Inicio / Panel</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <HomeOverlay open={overlayOpen} onClose={() => setOverlayOpen(false)} />
      </>
    );
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-accent/50 transition-colors text-left rounded-lg"
        onClick={handleClick}
      >
        <Home className="h-5 w-5 flex-shrink-0" style={{ color: '#3B82F6', strokeWidth: 1.5 }} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Inicio</p>
          <p className="text-xs text-muted-foreground">Panel principal</p>
        </div>
      </motion.button>
      <HomeOverlay open={overlayOpen} onClose={() => setOverlayOpen(false)} />
    </>
  );
};
