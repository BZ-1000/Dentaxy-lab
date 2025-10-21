import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronLeft } from 'lucide-react';

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const SidebarHeader = ({ collapsed, onToggle }: SidebarHeaderProps) => {
  return (
    <div className="flex items-center gap-2 p-3">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggle}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-accent transition-colors"
            >
              <img 
                src="/lovable-uploads/47756bd5-fe5d-45cf-bbb4-f61daf4a38cd.png" 
                alt="DENTAXY" 
                className="w-8 h-8"
              />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {!collapsed && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 min-w-0"
          >
            <h2 className="text-sm font-semibold">DENTAXY</h2>
            <p className="text-xs text-muted-foreground">Academy</p>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggle}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-accent transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          </motion.button>
        </>
      )}
    </div>
  );
};
