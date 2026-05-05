import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProfileMenu } from './ProfileMenu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UserProfileCardProps {
  collapsed: boolean;
}

export const UserProfileCard = ({ collapsed }: UserProfileCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const userName = 'Usuario Demo';
  const userInitial = 'D';

  if (collapsed) {
    return (
      <div className="border-t border-border p-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-full h-12" 
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{userName}</p>
              <p className="text-xs text-muted-foreground">🆓 Demo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <ProfileMenu open={menuOpen} onOpenChange={setMenuOpen} />
      </div>
    );
  }

  return (
    <div className="border-t border-border p-4">
      <motion.div 
        className="flex items-center gap-3 cursor-pointer hover:bg-accent rounded-lg p-2 transition-colors" 
        onClick={() => setMenuOpen(!menuOpen)} 
        whileHover={{ scale: 1.02 }} 
        whileTap={{ scale: 0.98 }}
      >
        <Avatar className="h-10 w-10">
          <AvatarFallback>{userInitial}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{userName}</p>
          <p className="text-xs text-muted-foreground truncate">
            Médico Cirujano Dentista
          </p>
        </div>
        
        <Badge variant="secondary" className="text-xs">
          🆓 Demo
        </Badge>
      </motion.div>
      
      <AnimatePresence>
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }} 
            className="mt-2"
          />
        )}
      </AnimatePresence>
      
      <ProfileMenu open={menuOpen} onOpenChange={setMenuOpen} />
      
      <p className="text-xs text-muted-foreground text-center mt-2">
        v1.4.2
      </p>
    </div>
  );
};
