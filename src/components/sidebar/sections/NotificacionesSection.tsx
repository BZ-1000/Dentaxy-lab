import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { NotificacionesOverlay } from '../overlays/NotificacionesOverlay';
import { PLATFORM_UPDATES } from '@/data/updates';

interface NotificacionesSectionProps {
  collapsed: boolean;
}

export const NotificacionesSection = ({ collapsed }: NotificacionesSectionProps) => {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const readIds = JSON.parse(localStorage.getItem('dentaxy_read_notifications') || '[]');
    const unread = PLATFORM_UPDATES.filter(update => !readIds.includes(update.id)).length;
    setUnreadCount(unread);
  }, []);

  if (collapsed) {
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center p-4 hover:bg-accent transition-colors relative"
                onClick={() => setOverlayOpen(true)}
              >
                <Bell className="h-5 w-5 text-primary" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                    {unreadCount}
                  </span>
                )}
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Notificaciones</p>
              {unreadCount > 0 && <p className="text-xs">{unreadCount} nuevas</p>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <NotificacionesOverlay open={overlayOpen} onClose={() => setOverlayOpen(false)} />
      </>
    );
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left"
        onClick={() => setOverlayOpen(true)}
      >
        <Bell className="h-5 w-5 text-primary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Notificaciones</p>
          <p className="text-xs text-muted-foreground">Actualizaciones</p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="text-xs">
            {unreadCount}
          </Badge>
        )}
      </motion.button>
      <NotificacionesOverlay open={overlayOpen} onClose={() => setOverlayOpen(false)} />
    </>
  );
};
