import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { FormDataState } from '@/types/historiaClinica';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SavedForm {
  nombre: string;
  data: FormDataState;
  fecha: Date;
}

interface FormCloudSidebarProps {
  onCargarFormulario: (data: FormDataState, nombre: string) => void;
  onGuardarCallback?: () => void;
}

export default function FormCloudSidebar({ 
  onCargarFormulario,
  onGuardarCallback
}: FormCloudSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formularios, setFormularios] = useState<SavedForm[]>([]);
  const [formularioAEliminar, setFormularioAEliminar] = useState<string | null>(null);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [hasNewForms, setHasNewForms] = useState(false);
  

  // Load saved forms from localStorage
  const loadSavedForms = () => {
    const keys = Object.keys(localStorage);
    const formKeys = keys.filter(key => key.startsWith('formulario_') && !key.includes('_examen-intrabucal-') && !key.includes('_interrogatorio-sistemas-'));
    
    const forms: SavedForm[] = formKeys.map(key => {
      const nombre = key.replace('formulario_', '');
      const dataStr = localStorage.getItem(key);
      if (dataStr) {
        try {
          const data = JSON.parse(dataStr);
          return {
            nombre,
            data,
            fecha: new Date()
          };
        } catch (e) {
          console.error('Error parsing saved form:', e);
          return null;
        }
      }
      return null;
    }).filter(Boolean) as SavedForm[];

    setFormularios(forms);
  };

  // Load forms on mount and check for new forms
  useEffect(() => {
    loadSavedForms();
    
    // Check if there are new forms since last view
    const lastViewedCount = localStorage.getItem('formularios_last_viewed_count');
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith('formulario_') && 
      !key.includes('_examen-intrabucal-') && 
      !key.includes('_interrogatorio-sistemas-')
    );
    const currentCount = keys.length;
    
    if (lastViewedCount === null || parseInt(lastViewedCount) < currentCount) {
      setHasNewForms(true);
    }
  }, []);

  useEffect(() => {
    if (sidebarOpen) {
      loadSavedForms();
      // Mark forms as viewed when sidebar opens
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('formulario_') && 
        !key.includes('_examen-intrabucal-') && 
        !key.includes('_interrogatorio-sistemas-')
      );
      localStorage.setItem('formularios_last_viewed_count', keys.length.toString());
      setHasNewForms(false);
    }
  }, [sidebarOpen]);

  // Intersection Observer to hide button only in main hero section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show button when main section is NOT visible (scrolled past it)
        // Hide button when main section IS visible (at the top)
        setShowButton(!entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '0px'
      }
    );

    // Find the main hero section
    const checkElement = () => {
      const heroSection = document.querySelector('[data-hero-section]');
      if (heroSection) {
        observer.observe(heroSection);
      } else {
        // Retry after a short delay if element not found yet
        setTimeout(checkElement, 500);
      }
    };

    checkElement();

    return () => {
      observer.disconnect();
    };
  }, []);



  const handleEliminarFormulario = (nombre: string) => {
    setFormularioAEliminar(nombre);
    setAlertDialogOpen(true);
  };

  const confirmarEliminacion = () => {
    if (!formularioAEliminar) return;

    // Delete main form
    localStorage.removeItem(`formulario_${formularioAEliminar}`);

    // Delete related data
    const areasIntrabucal = ['encias', 'paladar', 'orofaringe', 'mejillas', 'retromolar', 'lengua', 'pisoBoca'];
    areasIntrabucal.forEach(area => {
      localStorage.removeItem(`formulario_${formularioAEliminar}_examen-intrabucal-${area}`);
    });
    localStorage.removeItem(`formulario_${formularioAEliminar}_interrogatorio-sistemas-formValues`);

    // Update list
    setFormularios(prev => prev.filter(f => f.nombre !== formularioAEliminar));

    // Close dialog
    setAlertDialogOpen(false);
    setFormularioAEliminar(null);

    toast({
      title: "Formulario eliminado",
      description: `Se eliminó el formulario de ${formularioAEliminar}`
    });
  };

  const handleCargarFormulario = (nombre: string, data: FormDataState) => {
    // Load related intrabucal data
    const areasIntrabucal = ['encias', 'paladar', 'orofaringe', 'mejillas', 'retromolar', 'lengua', 'pisoBoca'];
    areasIntrabucal.forEach(area => {
      const areaData = localStorage.getItem(`formulario_${nombre}_examen-intrabucal-${area}`);
      if (areaData) {
        localStorage.setItem(`examen-intrabucal-${area}`, areaData);
      }
    });

    // Load interrogatorio data
    const interrogatorioData = localStorage.getItem(`formulario_${nombre}_interrogatorio-sistemas-formValues`);
    if (interrogatorioData) {
      localStorage.setItem('interrogatorio-sistemas-formValues', interrogatorioData);
    }

    onCargarFormulario(data, nombre);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Floating icon button - invisible only in hero section, visible everywhere else */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            className="fixed top-4 left-4 md:left-16 lg:left-20 z-50"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.3 
            }}
          >
            <button
              onClick={() => {
                setSidebarOpen(true);
              }}
              className="relative bg-primary hover:bg-primary/90 text-primary-foreground p-2.5 sm:p-3 lg:p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
              aria-label="Formularios guardados"
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              {formularios.length > 0 && hasNewForms && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center"
                >
                  {formularios.length}
                </motion.span>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sliding panel */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-full sm:w-80 bg-background border-r border-border shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-medium text-foreground">
                    Formularios
                  </h2>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* List of forms */}
              <ScrollArea className="flex-1 p-3">
                {formularios.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-xs">Sin formularios</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {formularios.map((form) => (
                      <motion.div
                        key={form.nombre}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                         className="group relative border rounded-lg p-3 transition-all cursor-pointer border-border bg-card hover:border-primary/50 hover:shadow-sm"
                        onClick={() => handleCargarFormulario(form.nombre, form.data)}
                      >
                        <div className="flex items-start gap-2.5">
                          <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-foreground truncate">
                              {form.nombre}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {form.fecha.toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEliminarFormulario(form.nombre);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-1"
                            aria-label="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirmation dialog for deletion */}
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el formulario de <strong>{formularioAEliminar}</strong>. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setAlertDialogOpen(false);
              setFormularioAEliminar(null);
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmarEliminacion}
              className="bg-red-500 hover:bg-red-600"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
