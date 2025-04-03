
import React, { useState, useEffect } from 'react';
import { FormDataState } from '@/types/historiaClinica';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { getInitialFormState } from '@/utils/initialFormState';
import { Trash2, Save, Upload, FilePlus, X, FolderOpen, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface FormulariosSidebarProps {
  onCargarFormulario: (data: FormDataState, nombre: string) => void;
  onGuardarFormulario: (nombre: string) => void;
  onCerrarFormulario: () => void;
  onResetFormulario: () => void;
  pacienteActual?: string;
}

const FormulariosSidebar = ({
  onCargarFormulario,
  onGuardarFormulario,
  onCerrarFormulario,
  onResetFormulario,
  pacienteActual = ''
}: FormulariosSidebarProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [guardados, setGuardados] = useState<string[]>([]);
  const [nombreFormulario, setNombreFormulario] = useState('');
  const [userId, setUserId] = useState<string>('');

  // Get current user's unique identifier (this is a simple solution that uses localStorage with a userId prefix)
  useEffect(() => {
    // Generate a unique user ID if one doesn't exist
    let currentUserId = localStorage.getItem('historia_clinica_user_id');
    if (!currentUserId) {
      currentUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('historia_clinica_user_id', currentUserId);
    }
    setUserId(currentUserId);
    
    actualizarListaGuardados(currentUserId);
  }, []);

  const actualizarListaGuardados = (currentUserId: string) => {
    const formularios: string[] = [];
    // Use the userId as a prefix for all storage keys
    const prefix = `${currentUserId}_formulario_`;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        formularios.push(key.replace(prefix, ''));
      }
    }
    
    setGuardados(formularios);
  };

  const handleGuardar = () => {
    if (!nombreFormulario.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingrese un nombre para el formulario",
        variant: "destructive"
      });
      return;
    }
    
    onGuardarFormulario(nombreFormulario);
    setNombreFormulario('');
    actualizarListaGuardados(userId);
    
    toast({
      title: "Formulario guardado",
      description: `El formulario "${nombreFormulario}" ha sido guardado exitosamente.`
    });
  };

  const handleCargar = (nombre: string) => {
    try {
      const key = `${userId}_formulario_${nombre}`;
      const formData = localStorage.getItem(key);
      
      if (formData) {
        const parsedData: FormDataState = JSON.parse(formData);
        onCargarFormulario(parsedData, nombre);
        setIsOpen(false);
        
        toast({
          title: "Formulario cargado",
          description: `El formulario "${nombre}" ha sido cargado exitosamente.`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar el formulario.",
        variant: "destructive"
      });
    }
  };

  const handleEliminar = (nombre: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const key = `${userId}_formulario_${nombre}`;
      localStorage.removeItem(key);
      actualizarListaGuardados(userId);
      
      if (pacienteActual === nombre) {
        onCerrarFormulario();
      }
      
      toast({
        title: "Formulario eliminado",
        description: `El formulario "${nombre}" ha sido eliminado.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el formulario.",
        variant: "destructive"
      });
    }
  };

  const handleCerrar = () => {
    onCerrarFormulario();
    setIsOpen(false);
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        
        // Validate the structure to make sure it's a valid form
        if (!parsed || !parsed.padecimientoActual) {
          throw new Error("Formato de formulario inválido");
        }
        
        // Prompt user for a name
        const nombre = prompt("Ingrese un nombre para el formulario importado:");
        if (!nombre || !nombre.trim()) return;
        
        // Save the imported form
        const key = `${userId}_formulario_${nombre}`;
        localStorage.setItem(key, content);
        actualizarListaGuardados(userId);
        
        toast({
          title: "Formulario importado",
          description: `El formulario "${nombre}" ha sido importado exitosamente.`
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "El archivo no contiene un formulario válido.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const handleDownload = (nombre: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const key = `${userId}_formulario_${nombre}`;
      const formData = localStorage.getItem(key);
      
      if (formData) {
        // Create a blob and download link
        const blob = new Blob([formData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${nombre}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo descargar el formulario.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        className="fixed left-4 top-4 z-50 rounded-full p-3 bg-blue-500 text-white shadow-lg hover:bg-blue-600"
        aria-label="Formularios guardados"
      >
        <FolderOpen className="h-6 w-6" />
      </Button>

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle className="text-center text-xl font-bold mb-4">Formularios Guardados</DrawerTitle>
          </DrawerHeader>
          
          <div className="px-4 pb-6">
            <div className="flex items-end gap-2 mb-6">
              <div className="flex-1">
                <Label htmlFor="nombreFormulario">Nombre del formulario</Label>
                <Input 
                  id="nombreFormulario"
                  value={nombreFormulario} 
                  onChange={e => setNombreFormulario(e.target.value)} 
                  placeholder="Nombre del paciente" 
                />
              </div>
              <Button onClick={handleGuardar} disabled={!nombreFormulario.trim()} className="bg-green-600 hover:bg-green-700 text-white">
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </Button>
            </div>
            
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold">Formularios disponibles</h3>
              <div>
                <label htmlFor="upload-form" className="cursor-pointer">
                  <div className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700">
                    <Upload className="w-4 h-4" />
                    <span>Importar</span>
                  </div>
                  <input 
                    id="upload-form" 
                    type="file" 
                    accept=".json" 
                    className="hidden" 
                    onChange={handleUpload} 
                  />
                </label>
              </div>
            </div>
            
            {guardados.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FilePlus className="mx-auto h-12 w-12 mb-2 opacity-20" />
                <p>No hay formularios guardados</p>
              </div>
            ) : (
              <div className="grid gap-2">
                {guardados.map(nombre => (
                  <div 
                    key={nombre}
                    onClick={() => handleCargar(nombre)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      pacienteActual === nombre 
                        ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500' 
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="font-medium truncate">{nombre}</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => handleDownload(nombre, e)} 
                        className="p-1 text-blue-500 hover:text-blue-700"
                        title="Descargar formulario"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={(e) => handleEliminar(nombre, e)} 
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Eliminar formulario"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DrawerFooter className="pt-2">
            <Button variant="outline" onClick={handleCerrar}>
              <X className="w-4 h-4 mr-2" />
              Cerrar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default FormulariosSidebar;
