import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
interface SidebarHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}
export const SidebarHeader = ({
  collapsed,
  onToggle
}: SidebarHeaderProps) => {
  return <div className="flex items-center justify-between p-4 border-b border-border bg-card">
      {collapsed ? <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={onToggle} className="flex items-center justify-center w-full p-2 hover:bg-accent rounded-lg transition-colors px-px">
                <img src="/lovable-uploads/47756bd5-fe5d-45cf-bbb4-f61daf4a38cd.png" alt="DENTAXY" className="w-8 h-8" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Expandir
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> : <div className="flex items-center gap-2">
          <img src="/lovable-uploads/47756bd5-fe5d-45cf-bbb4-f61daf4a38cd.png" alt="DENTAXY" className="w-8 h-8 flex-shrink-0" />
          <div>
            <h2 className="text-sm font-semibold">DENTAXY</h2>
            <p className="text-xs text-muted-foreground">Academy</p>
          </div>
        </div>}
      
      {!collapsed && <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onToggle} className="flex-shrink-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Colapsar
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>}
    </div>;
};