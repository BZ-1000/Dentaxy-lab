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
  const [recienGuardado, setRecienGuardado] = useState<string | null>(null);

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

  // Load forms on mount and when sidebar opens
  useEffect(() => {
    loadSavedForms();
  }, []);

  useEffect(() => {
    if (sidebarOpen) {
      loadSavedForms();
    }
  }, [sidebarOpen]);

  // Listen for storage changes (new saves)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('formulario_') && !e.key.includes('_examen-intrabucal-') && !e.key.includes('_interrogatorio-sistemas-')) {
        const nombre = e.key.replace('formulario_', '');
        setRecienGuardado(nombre);
        loadSavedForms();
        
        // Clear animation after 2 seconds
        setTimeout(() => {
          setRecienGuardado(null);
        }, 2000);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Custom event for same-window storage updates
  useEffect(() => {
    const handleCustomSave = (e: CustomEvent) => {
      const nombre = e.detail.nombre;
      setRecienGuardado(nombre);
      loadSavedForms();
      
      setTimeout(() => {
        setRecienGuardado(null);
      }, 2000);
      
      if (onGuardarCallback) {
        onGuardarCallback();
      }
    };

    window.addEventListener('formularioGuardado' as any, handleCustomSave as any);
    return () => window.removeEventListener('formularioGuardado' as any, handleCustomSave as any);
  }, [onGuardarCallback]);

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

    toast({
      title: "Formulario cargado",
      description: `Se cargó el formulario de ${nombre}`
    });
  };

  return (
    <>
      {/* Floating icon button */}
      <motion.div
        className="fixed top-20 right-4 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <button
          onClick={() => setSidebarOpen(true)}
          className="relative bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
          aria-label="Formularios guardados"
        >
          <BookOpen className="w-6 h-6" />
          {formularios.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
            >
              {formularios.length}
            </motion.span>
          )}
        </button>
      </motion.div>

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
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Formularios Guardados
                  </h2>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* List of forms */}
              <ScrollArea className="flex-1 p-4">
                {formularios.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No hay formularios guardados</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formularios.map((form) => (
                      <motion.div
                        key={form.nombre}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`border rounded-lg p-4 hover:shadow-md transition-all ${
                          recienGuardado === form.nombre 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 animate-pulse' 
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-750'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">👤</span>
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {form.nombre}
                              </h3>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <span>📅</span>
                              <span>{form.fecha.toLocaleDateString()} {form.fecha.toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleCargarFormulario(form.nombre, form.data)}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                            size="sm"
                          >
                            Cargar
                          </Button>
                          <Button
                            onClick={() => handleEliminarFormulario(form.nombre)}
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
