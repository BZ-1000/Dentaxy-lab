import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Book, FileText, Play, BookOpen, GraduationCap, Star, ExternalLink } from 'lucide-react';
import { useResources } from '@/hooks/useResources';

const getResourceIcon = (type: string) => {
  switch (type) {
    case 'book':
      return <Book className="w-3 h-3 text-blue-500" />;
    case 'article':
      return <FileText className="w-3 h-3 text-green-500" />;
    case 'video':
      return <Play className="w-3 h-3 text-red-500" />;
    case 'guide':
      return <BookOpen className="w-3 h-3 text-purple-500" />;
    case 'course':
      return <GraduationCap className="w-3 h-3 text-amber-500" />;
    default:
      return <FileText className="w-3 h-3 text-muted-foreground" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'clinica':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'diagnostico':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'tratamiento':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'investigacion':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'clinica':
      return 'Clínica';
    case 'diagnostico':
      return 'Diagnóstico';
    case 'tratamiento':
      return 'Tratamiento';
    case 'investigacion':
      return 'Investigación';
    default:
      return 'General';
  }
};

export const ResourcesSection = () => {
  const { resources, loading, error } = useResources();

  if (error) {
    return (
      <Card className="h-full flex flex-col bg-gradient-to-br from-card via-card to-card/80 border-border/30 shadow-md">
        <CardContent className="p-3 text-center flex-1 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">Error al cargar recursos</p>
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
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <GraduationCap className="w-2 h-2 text-primary-foreground" />
          </motion.div>
          Recursos Educativos
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 px-3 pb-3 pt-0">
        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="h-16 bg-muted/40 rounded-lg"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        ) : (
          <ScrollArea className="h-full">
            <AnimatePresence>
              <div className="space-y-2 pr-2">
                {resources.slice(0, 6).map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group"
                  >
                    <motion.div
                      className="p-2.5 bg-gradient-to-r from-muted/20 to-muted/40 rounded-lg border border-border/20 hover:border-border/40 hover:shadow-sm transition-all duration-200 cursor-pointer"
                      whileHover={{ scale: 1.01, y: -1 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        if (resource.url) {
                          window.open(resource.url, '_blank');
                        }
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 flex-shrink-0">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <h4 className="text-xs font-medium text-foreground leading-tight line-clamp-1 flex items-center gap-1">
                              {resource.title}
                              {resource.is_featured && (
                                <Star className="w-2.5 h-2.5 text-amber-500 fill-current flex-shrink-0" />
                              )}
                            </h4>
                            {resource.url && (
                              <ExternalLink className="w-2.5 h-2.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                            )}
                          </div>
                          {resource.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2">
                              {resource.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between gap-2">
                            <Badge 
                              className={`text-xs px-1.5 py-0.5 h-auto border ${getCategoryColor(resource.category)} flex-shrink-0`}
                              variant="outline"
                            >
                              {getCategoryLabel(resource.category)}
                            </Badge>
                            {resource.author && (
                              <span className="text-xs text-muted-foreground/80 font-medium truncate">
                                {resource.author}
                              </span>
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