
import React, { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X, Eraser, Copy, CheckCircle } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatologiaToggle from './PatologiaToggle';

interface AntecedentesPersonalesPatologicosProps {
  formData: FormDataState;
  handleAntecedentePatologicoChange: (field: string, value: any) => void;
}

const AntecedentesPersonalesPatologicos: React.FC<AntecedentesPersonalesPatologicosProps> = ({
  formData,
  handleAntecedentePatologicoChange
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [redaccion, setRedaccion] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAnimatedText, setShowAnimatedText] = useState(false);
  const redaccionRef = useRef<HTMLDivElement>(null);
  const categories = [
    { id: "nutricionales", label: "Nutricionales" },
    { id: "metabolicos", label: "Metabólicos" },
    { id: "cardiovasculares", label: "Cardiovasculares" },
    { id: "pulmonares", label: "Pulmonares" },
    { id: "neurologicos", label: "Neurológicos" },
    { id: "infecciosos", label: "Infecciosos" },
    { id: "otrosPadecimientos", label: "Otros padecimientos" }
  ];

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    setIsMaximized(false);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsMinimized(false);
    setIsMaximized(false);
  };

  const getFriendlyNames = (category: string) => {
    const mapping: Record<string, Record<string, string>> = {
      nutricionales: {
        anorexia: "Anorexia",
        bulimia: "Bulimia",
        sobrepeso: "Sobrepeso",
        obesidad: "Obesidad",
        ninguna: "Ninguna",
        otra: "Otra"
      },
      metabolicos: {
        diabetes: "Diabetes",
        hipotiroidismo: "Hipotiroidismo",
        hipertiroidismo: "Hipertiroidismo",
        ninguna: "Ninguna",
        otra: "Otra"
      },
      cardiovasculares: {
        hipertensionArterial: "Hipertensión Arterial",
        cardiopatias: "Cardiopatías",
        arritmias: "Arritmias",
        insuficienciaCardiaca: "Insuficiencia Cardíaca",
        ninguna: "Ninguna",
        otra: "Otra"
      },
      pulmonares: {
        asma: "Asma",
        enfisema: "Enfisema",
        bronquitis: "Bronquitis",
        tuberculosis: "Tuberculosis",
        covid19: "COVID-19",
        ninguna: "Ninguna",
        otra: "Otra"
      },
      neurologicos: {
        epilepsia: "Epilepsia",
        parkinson: "Parkinson",
        alzheimer: "Alzheimer",
        migraña: "Migraña",
        cefalea: "Cefalea",
        ninguna: "Ninguna",
        otra: "Otra"
      },
      infecciosos: {
        vih: "VIH",
        hepatitisB: "Hepatitis B",
        hepatitisC: "Hepatitis C",
        sifilis: "Sífilis",
        herpes: "Herpes",
        ninguna: "Ninguna",
        otra: "Otra"
      },
      otrosPadecimientos: {
        cancer: "Cáncer",
        enfermedadRenal: "Enfermedad Renal",
        enfermedadHepatica: "Enfermedad Hepática",
        artritis: "Artritis",
        osteoporosis: "Osteoporosis",
        ninguna: "Ninguna",
        otra: "Otra"
      }
    };
    
    return mapping[category] || {};
  };

  const handlePatologiaChange = (category: string, condition: string, value: boolean) => {
    if (condition === 'ninguna' && value) {
      // Si se selecciona "ninguna", deseleccionar todas las demás opciones
      const updatedCategory = { ...formData.antecedentesPersonalesPatologicos[category] };
      Object.keys(updatedCategory).forEach(key => {
        if (key !== 'ninguna' && key !== 'otraDescripcion') {
          updatedCategory[key] = false;
        }
      });
      updatedCategory.ninguna = true;
      
      handleAntecedentePatologicoChange(category, updatedCategory);
    } else {
      // Si se selecciona cualquier otra opción, deseleccionar "ninguna"
      const updatedValue = { 
        ...formData.antecedentesPersonalesPatologicos[category], 
        [condition]: value 
      };
      
      if (condition !== 'ninguna' && value) {
        updatedValue.ninguna = false;
      }
      
      handleAntecedentePatologicoChange(category, updatedValue);
    }
  };

  const generarRedaccionIA = () => {
    setIsGenerating(true);
    setShowForm(false);
    setShowAnimatedText(true);
    
    // Scroll to the top of the component for better visibility of the animation
    setTimeout(() => {
      if (redaccionRef.current) {
        redaccionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);

    let texto = "Antecedentes Personales Patológicos:\n\n";
    
    categories.forEach(category => {
      const friendlyNames = getFriendlyNames(category.id);
      const categoryData = formData.antecedentesPersonalesPatologicos[category.id];
      const patologias = [];
      
      for (const [key, value] of Object.entries(categoryData)) {
        // Skip otraDescripcion as it's handled separately
        if (key === 'otraDescripcion') continue;
        
        if (value && key === 'ninguna') {
          patologias.push("No refiere antecedentes patológicos.");
          break;
        } else if (value && key === 'otra') {
          // Include the text from otraDescripcion instead of just saying "Otra"
          const otraDescripcion = categoryData.otraDescripcion;
          if (otraDescripcion && otraDescripcion.trim() !== '') {
            patologias.push(otraDescripcion);
          }
        } else if (value) {
          patologias.push(friendlyNames[key]);
        }
      }
      
      if (patologias.length > 0) {
        texto += `${category.label}: ${patologias.join(", ")}.\n`;
      }
    });
    
    // Simulate typing effect by setting state over time
    let timer = setTimeout(() => {
      setRedaccion(texto);
      setIsGenerating(false);
      setShowAnimatedText(false);
    }, 1000);

    return () => clearTimeout(timer);
  };

  const limpiarFormulario = () => {
    categories.forEach(category => {
      const emptyCategory = { ninguna: true };
      handleAntecedentePatologicoChange(category.id, emptyCategory);
    });
    setRedaccion("");
    setShowForm(true);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(redaccion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Typing effect animation component
  const TypingEffect = ({ text }: { text: string }) => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    
    useEffect(() => {
      if (currentIndex < text.length) {
        const timerId = setTimeout(() => {
          setDisplayText(prev => prev + text[currentIndex]);
          setCurrentIndex(currentIndex + 1);
        }, 5); // Adjustable typing speed (lower = faster)
        
        return () => clearTimeout(timerId);
      }
    }, [text, currentIndex]);
    
    return <div className="whitespace-pre-wrap">{displayText}</div>;
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`} ref={redaccionRef}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
              <button
                onClick={() => setShowForm(true)}
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${showForm ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}
              >
                Formulario
              </button>
              <button
                onClick={() => setShowForm(false)}
                className={`px-5 py-1.5 rounded-full transition-all duration-300 text-sm ${!showForm ? "bg-blue-500 text-white shadow-md" : "text-gray-700 dark:text-gray-300"}`}
              >
                Redacción IA
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleMinimize} className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
              <Minus className="w-4 h-4" />
            </button>
            <button onClick={handleMaximize} className="p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors">
              <Maximize2 className="w-4 h-4" />
            </button>
            <button onClick={handleClose} className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">IV.</span> ANTECEDENTES PERSONALES PATOLÓGICOS
          </h2>
        </div>

        {!isMinimized && <div className="p-6">
          {showForm ? (
            <div className="space-y-6">
              <Tabs defaultValue="nutricionales" className="w-full">
                <TabsList className="grid grid-cols-3 lg:grid-cols-7 mb-4">
                  {categories.map(category => (
                    <TabsTrigger key={category.id} value={category.id}>
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {categories.map(category => (
                  <TabsContent key={category.id} value={category.id} className="p-4 border rounded-md mt-2">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{category.label}</h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(getFriendlyNames(category.id)).map(([condition, label]) => (
                          <PatologiaToggle
                            key={condition}
                            label={label}
                            checked={formData.antecedentesPersonalesPatologicos[category.id]?.[condition] || false}
                            onChange={(value) => handlePatologiaChange(category.id, condition, value)}
                          />
                        ))}
                      </div>
                      
                      {formData.antecedentesPersonalesPatologicos[category.id]?.otra && (
                        <div className="mt-4">
                          <Label htmlFor={`${category.id}-otra-desc`}>Describa otra patología:</Label>
                          <Textarea
                            id={`${category.id}-otra-desc`}
                            value={formData.antecedentesPersonalesPatologicos[category.id]?.otraDescripcion || ''}
                            onChange={(e) => handleAntecedentePatologicoChange(`${category.id}.otraDescripcion`, e.target.value)}
                            placeholder={`Describa otra patología ${category.label.toLowerCase()}`}
                            className="mt-1"
                          />
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              <div className="flex justify-center gap-4 mt-6">
                <Button
                  onClick={generarRedaccionIA}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Generar Redacción IA
                </Button>
                <Button
                  onClick={limpiarFormulario}
                  variant="outline"
                  className="border-gray-300 text-gray-700 dark:text-gray-300"
                >
                  Limpiar Formulario
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-semibold">Redacción</h4>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="min-h-[200px] text-sm bg-white/50 dark:bg-gray-800/50 rounded p-3 whitespace-pre-wrap">
                  {showAnimatedText ? (
                    <TypingEffect text={redaccion} />
                  ) : (
                    redaccion
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={() => setShowForm(true)}
                  variant="outline"
                  className="border-gray-300 text-gray-700 dark:text-gray-300"
                >
                  Volver al Formulario
                </Button>
              </div>
            </div>
          )}
        </div>}
      </Card>
    </div>
  );
};

export default AntecedentesPersonalesPatologicos;
