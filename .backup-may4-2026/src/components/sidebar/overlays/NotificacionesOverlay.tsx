import { useState, useEffect } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { BaseOverlay } from './BaseOverlay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PLATFORM_UPDATES } from '@/data/updates';

interface NotificacionesOverlayProps {
  open: boolean;
  onClose: () => void;
}

export const NotificacionesOverlay = ({ open, onClose }: NotificacionesOverlayProps) => {
  const [readIds, setReadIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('dentaxy_read_notifications');
    if (stored) {
      setReadIds(JSON.parse(stored));
    }
  }, [open]);

  const markAllAsRead = () => {
    const allIds = PLATFORM_UPDATES.map(u => u.id);
    setReadIds(allIds);
    localStorage.setItem('dentaxy_read_notifications', JSON.stringify(allIds));
  };

  const markAsRead = (id: string) => {
    const updated = [...readIds, id];
    setReadIds(updated);
    localStorage.setItem('dentaxy_read_notifications', JSON.stringify(updated));
  };

  return (
    <BaseOverlay open={open} onClose={onClose} title="Notificaciones" icon={Bell}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {PLATFORM_UPDATES.length - readIds.length} notificaciones sin leer
          </p>
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Marcar todo como leído
          </Button>
        </div>

        <div className="space-y-3">
          {PLATFORM_UPDATES.map((update) => {
            const isRead = readIds.includes(update.id);
            return (
              <Card 
                key={update.id} 
                className={`cursor-pointer transition-colors ${isRead ? 'opacity-60' : 'border-primary'}`}
                onClick={() => !isRead && markAsRead(update.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{update.title}</CardTitle>
                    {!isRead && (
                      <Badge variant="default" className="text-xs">
                        Nuevo
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {update.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Actualización
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {update.version}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </BaseOverlay>
  );
};
