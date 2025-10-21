import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileMenu } from './ProfileMenu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UserProfileCardProps {
  collapsed: boolean;
}

export const UserProfileCard = ({ collapsed }: UserProfileCardProps) => {
  const { user, subscription } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario';
  const userInitial = userName[0].toUpperCase();
  const subscriptionTier = subscription.subscription_tier || 'beta';
  const tierLabel = subscriptionTier === 'pro' ? '💎 Pro' : '🆓 Beta';
  const tierVariant = subscriptionTier === 'pro' ? 'default' : 'secondary';

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
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{userName}</p>
              <p className="text-xs text-muted-foreground">{tierLabel}</p>
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
          <AvatarImage src={user.user_metadata?.avatar_url} />
          <AvatarFallback>{userInitial}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{userName}</p>
          <p className="text-xs text-muted-foreground truncate">
            Médico Cirujano Dentista
          </p>
        </div>
        
        <Badge variant={tierVariant} className="text-xs">
          {tierLabel}
        </Badge>
      </motion.div>
      
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 flex gap-2"
          >
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 text-xs"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              💎 Ver planes
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <ProfileMenu open={menuOpen} onOpenChange={setMenuOpen} />
      
      <p className="text-xs text-muted-foreground text-center mt-2">
        v1.4.2
      </p>
    </div>
  );
};
