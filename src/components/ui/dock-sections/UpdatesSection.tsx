import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Package, AlertCircle } from 'lucide-react';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { PLATFORM_UPDATES } from '@/data/updates';

const getUpdateIcon = (version: string) => {
  if (version.includes('beta') || version.includes('alpha')) {
    return <AlertCircle className="w-3 h-3 text-amber-500" />;
  }
  if (version.includes('major') || parseFloat(version.replace('v', '')) >= 2.0) {
    return <Sparkles className="w-3 h-3 text-purple-500" />;
  }
  return <Package className="w-3 h-3 text-blue-500" />;
};

const formatReleaseDate = (dateString: string) => {
  const date = parseISO(dateString);
  
  if (isToday(date)) {
    return 'Hoy';
  }
  if (isYesterday(date)) {
    return 'Ayer';
  }
  return format(date, 'dd MMM', { locale: es });
};

export const UpdatesSection = () => {
  const updates = PLATFORM_UPDATES;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleCardClick = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Card className="h-full flex flex-col bg-gradient-to-br from-card via-card to-card/80 border-border/30 shadow-md">
      <CardHeader className="pb-2 px-3 pt-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
          <motion.div
            className="w-4 h-4 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-2 h-2 text-primary-foreground" />
          </motion.div>
          Actualizaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 px-3 pb-3 pt-0">
        <ScrollArea className="h-full">
          <div className="space-y-2 pr-2">
            {updates.slice(0, 5).map((update, index) => {
              const isExpanded = expandedId === update.id;
              return (
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  <div 
                    onClick={() => handleCardClick(update.id)}
                    className="p-2.5 bg-gradient-to-r from-muted/20 to-muted/40 rounded-lg border border-border/20 hover:border-border/40 hover:shadow-sm transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 flex-shrink-0">
                        {getUpdateIcon(update.version)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <h4 className="text-xs font-medium text-foreground leading-tight line-clamp-1">
                            {update.title}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className="text-xs px-1.5 py-0.5 h-auto bg-background/50 border-border/40 flex-shrink-0"
                          >
                            {update.version}
                          </Badge>
                        </div>
                        <motion.p 
                          className={`text-xs text-muted-foreground leading-relaxed mb-2 ${!isExpanded ? 'line-clamp-2' : ''}`}
                          animate={{ height: isExpanded ? 'auto' : 'auto' }}
                          transition={{ duration: 0.2 }}
                        >
                          {update.description}
                        </motion.p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground/80 font-medium">
                            {formatReleaseDate(update.release_date)}
                          </span>
                          {isToday(parseISO(update.release_date)) && (
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};