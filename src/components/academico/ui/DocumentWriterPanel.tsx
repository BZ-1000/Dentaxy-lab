import React from 'react';
import { motion } from 'framer-motion';
import { X, FileText, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AppleTypewriter } from '@/components/ui/AppleTypewriter';

interface DocumentWriterPanelProps {
  generations: Record<string, string | React.ReactNode>;
  seccionesActivas: Array<{ id: string, nombre: string }>;
  onClose: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const DocumentWriterPanel: React.FC<DocumentWriterPanelProps> = ({
  generations,
  seccionesActivas,
  onClose,
  isExpanded,
  onToggleExpand
}) => {
  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        "h-full bg-slate-50 dark:bg-zinc-950 border-l border-border relative flex flex-col shadow-2xl z-40 transition-all duration-500 will-change-[width]",
        isExpanded ? "w-1/2" : "w-1/3 min-w-[400px]"
      )}
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-border/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur">
        <div className="flex items-center gap-2 text-primary font-medium">
          <FileText className="w-4 h-4 text-emerald-500" />
          <span className="text-sm">Documento Clínico</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onToggleExpand} className="h-8 w-8 text-muted-foreground hover:text-foreground">
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-muted-foreground hover:text-red-500">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Pages / Document Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-zinc-100 dark:bg-black/40 custom-scrollbar">
        {/* Render a physical paper look */}
        <div className="bg-white dark:bg-zinc-900 w-full min-h-[800px] shadow-sm ring-1 ring-black/5 dark:ring-white/10 p-8 md:p-12 font-mplus prose prose-sm dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200">
          
          {/* Header of paper */}
          <div className="border-b-2 border-black/10 dark:border-white/10 pb-4 mb-8 text-center text-xs uppercase tracking-widest text-zinc-500">
            Historia Clínica
          </div>

          {Object.keys(generations).length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-40 py-20 text-center">
              <FileText className="w-12 h-12 mb-4" />
              <p>El documento mágico está listo.</p>
              <p className="text-xs">Presiona Siguiente para comenzar a redactar.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {seccionesActivas.map(seccion => {
                const content = generations[seccion.id];
                if (!content) return null;
                
                return (
                  <div key={seccion.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-4 border-l-2 border-primary pl-3 bg-primary/5 py-1">
                      {seccion.nombre.replace(/^[MDCLXVI]+\.\s/, '')}
                    </h3>
                    
                    {/* Render Content */}
                    <div className="text-justify leading-relaxed">
                      {typeof content === 'string' ? (
                          <div dangerouslySetInnerHTML={{ __html: content }} />
                      ) : (
                          <>{content}</>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
};
