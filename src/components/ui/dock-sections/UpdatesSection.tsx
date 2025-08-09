import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Package, AlertCircle } from 'lucide-react';
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

  if (error) {
    return (
      <Card className="shadow-sm bg-white border-border/50">
        <CardContent className="p-4 text-center">
          <p className="text-xs text-muted-foreground">Error al cargar actualizaciones</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm bg-white border-border/50 w-full">
      <CardHeader className="pb-1 md:pb-2">
        <CardTitle className="text-xs md:text-sm font-semibold flex items-center gap-1 md:gap-2 text-foreground">
          <motion.div
            className="w-3 h-3 md:w-4 md:h-4 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-1.5 h-1.5 md:w-2 md:h-2 text-primary-foreground" />
          </motion.div>
          Actualizaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 p-2 md:p-3">
        {loading ? (
          <div className="space-y-1 md:space-y-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="h-10 md:h-12 bg-muted/50 rounded-lg"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        ) : (
          <ScrollArea className="h-32 md:h-40">
            <AnimatePresence>
              <div className="space-y-1 md:space-y-2">
                {updates.map((update, index) => (
                  <motion.div
                    key={update.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group relative"
                  >
                    <motion.div
                      className="p-2 md:p-3 bg-muted/30 rounded-lg border border-border/30 hover:bg-muted/50 transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start gap-1 md:gap-2">
                        <div className="mt-0.5">
                          {getUpdateIcon(update.version)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-xs font-semibold text-foreground truncate">
                              {update.title}
                            </h4>
                            <Badge 
                              variant="secondary" 
                              className="text-xs px-1.5 py-0.5 h-auto bg-muted text-muted-foreground"
                            >
                              {update.version}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {update.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground font-medium">
                              {formatReleaseDate(update.release_date)}
                            </span>
                            {isToday(parseISO(update.release_date)) && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-green-500 rounded-full"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};