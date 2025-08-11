import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sparkles, Package, AlertCircle, ExternalLink, Eye, ChevronDown } from 'lucide-react';
import { useUpdates } from '@/hooks/useUpdates';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

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
  const { updates, loading, error } = useUpdates();
  const [openUpdate, setOpenUpdate] = useState<string | null>(null);

  if (error) {
    return (
      <Card className="h-full flex flex-col bg-gradient-to-br from-card via-card to-card/80 border-border/30 shadow-md">
        <CardContent className="p-3 text-center flex-1 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">Error al cargar actualizaciones</p>
        </CardContent>
      </Card>
    );
  }

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
        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="h-14 bg-muted/40 rounded-lg"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        ) : (
          <ScrollArea className="h-full">
            <AnimatePresence>
              <div className="space-y-2 pr-2">
                {updates.slice(0, 5).map((update, index) => {
                  const isOpen = openUpdate === update.id;
                  
                  return (
                    <motion.div
                      key={update.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group"
                    >
                      <Collapsible 
                        open={isOpen}
                        onOpenChange={(open) => setOpenUpdate(open ? update.id : null)}
                      >
                        <CollapsibleTrigger asChild>
                          <motion.div
                            className="p-2.5 bg-gradient-to-r from-muted/20 to-muted/40 rounded-lg border border-border/20 hover:border-border/40 hover:shadow-sm transition-all duration-200 cursor-pointer group w-full"
                            whileHover={{ scale: 1.01, y: -1 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <div className="flex items-start gap-2">
                              <div className="mt-0.5 flex-shrink-0">
                                {getUpdateIcon(update.version)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-1 mb-1">
                                  <h4 className="text-xs font-medium text-foreground leading-tight line-clamp-1 flex items-center gap-1">
                                    {update.title}
                                  </h4>
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <Badge 
                                      variant="outline" 
                                      className="text-xs px-1.5 py-0.5 h-auto bg-background/50 border-border/40"
                                    >
                                      {update.version}
                                    </Badge>
                                    <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground/80 font-medium">
                                    {formatReleaseDate(update.release_date)}
                                  </span>
                                  {isToday(parseISO(update.release_date)) && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent className="mt-2">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-2.5"
                          >
                            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                              <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                {update.description}
                              </p>
                            </div>
                          </motion.div>
                        </CollapsibleContent>
                      </Collapsible>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};