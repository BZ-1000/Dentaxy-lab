
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from "@/hooks/use-theme";
import { OtraCondicionInput } from '@/components/ui/OtraCondicionInput';
import { SelectableText } from '@/components/ui/SelectableText';
import { MarkdownText } from '@/components/ui/MarkdownText';
import { useAnalysisMode } from '@/contexts/AnalysisModeContext';

interface OtraCondicion {
  id: string;
  condicion: string;
  descripcion: string;
}

interface AntecedentesPersonalesPatologicosData {
  alergias: string;
  medicamentosActuales: string;
  cirugiasPrevias: string;
  hospitalizacionesPrevias: string;
  transfusionesSanguineas: boolean;
  enfermedadesCronicas: string;
  otrasCondiciones: OtraCondicion[];
}

interface AntecedentesPersonalesPatologicosProps {
  formData: {
    antecedentesPersonalesPatologicos: AntecedentesPersonalesPatologicosData;
  };
  onFormDataChange: (newData: any) => void;
}

const AntecedentesPersonalesPatologicos: React.FC<AntecedentesPersonalesPatologicosProps> = ({
  formData,
  onFormDataChange
}) => {
  const { theme } = useTheme();
  const { isAnalysisMode } = useAnalysisMode();
  const [animatingFields, setAnimatingFields] = useState<Set<string>>(new Set());
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const antecedentesData = formData.antecedentesPersonalesPatologicos;

  const triggerFieldAnimation = (fieldName: string) => {
    setAnimatingFields(prev => new Set(prev).add(fieldName));
    setTimeout(() => {
      setAnimatingFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(fieldName);
        return newSet;
      });
    }, 300);
  };

  const handleInputChange = (field: string, value: string | boolean | OtraCondicion[]) => {
    triggerFieldAnimation(field);
    onFormDataChange({
      ...formData,
      antecedentesPersonalesPatologicos: {
        ...antecedentesData,
        [field]: value
      }
    });
  };

  const handleOtraCondicionAdd = () => {
    const nuevaCondicion: OtraCondicion = {
      id: Date.now().toString(),
      condicion: '',
      descripcion: ''
    };
    
    handleInputChange('otrasCondiciones', [...antecedentesData.otrasCondiciones, nuevaCondicion]);
    toast.success("Nueva condición agregada");
  };

  const handleOtraCondicionRemove = (id: string) => {
    const condicionesActualizadas = antecedentesData.otrasCondiciones.filter(c => c.id !== id);
    handleInputChange('otrasCondiciones', condicionesActualizadas);
    toast.success("Condición eliminada");
  };

  const handleOtraCondicionChange = (id: string, field: 'condicion' | 'descripcion', value: string) => {
    const condicionesActualizadas = antecedentesData.otrasCondiciones.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    );
    handleInputChange('otrasCondiciones', condicionesActualizadas);
  };

  const CardWrapper = ({ children }: { children: React.ReactNode }) => (
    <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg transition-all duration-300 hover:shadow-xl`}>
      {children}
    </Card>
  );

  const InputWrapper = ({ children, field }: { children: React.ReactNode; field: string }) => (
    <motion.div
      animate={animatingFields.has(field) ? { scale: [1, 1.02, 1], opacity: [1, 0.8, 1] } : {}}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );

  const renderTextContent = (text: string) => {
    if (isAnalysisMode) {
      return <SelectableText text={text} />;
    }
    return <MarkdownText>{text}</MarkdownText>;
  };

  return (
    <div className="space-y-6">
      <CardWrapper>
        <CardHeader>
          <CardTitle className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
            {renderTextContent("Antecedentes Personales Patológicos")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Alergias */}
          <InputWrapper field="alergias">
            <div className="space-y-2">
              <Label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                {renderTextContent("Alergias (medicamentos, alimentos, sustancias)")}
              </Label>
              <Textarea
                placeholder="Describa las alergias conocidas del paciente..."
                value={antecedentesData.alergias}
                onChange={(e) => handleInputChange('alergias', e.target.value)}
                className={`min-h-[100px] ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-50 border-gray-300'} transition-colors duration-200`}
              />
            </div>
          </InputWrapper>

          {/* Medicamentos Actuales */}
          <InputWrapper field="medicamentosActuales">
            <div className="space-y-2">
              <Label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                {renderTextContent("Medicamentos Actuales")}
              </Label>
              <Textarea
                placeholder="Lista de medicamentos que toma actualmente..."
                value={antecedentesData.medicamentosActuales}
                onChange={(e) => handleInputChange('medicamentosActuales', e.target.value)}
                className={`min-h-[100px] ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-50 border-gray-300'} transition-colors duration-200`}
              />
            </div>
          </InputWrapper>

          {/* Cirugías Previas */}
          <InputWrapper field="cirugiasPrevias">
            <div className="space-y-2">
              <Label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                {renderTextContent("Cirugías Previas")}
              </Label>
              <Textarea
                placeholder="Historial de cirugías..."
                value={antecedentesData.cirugiasPrevias}
                onChange={(e) => handleInputChange('cirugiasPrevias', e.target.value)}
                className={`min-h-[100px] ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-50 border-gray-300'} transition-colors duration-200`}
              />
            </div>
          </InputWrapper>

          {/* Hospitalizaciones Previas */}
          <InputWrapper field="hospitalizacionesPrevias">
            <div className="space-y-2">
              <Label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                {renderTextContent("Hospitalizaciones Previas")}
              </Label>
              <Textarea
                placeholder="Historial de hospitalizaciones..."
                value={antecedentesData.hospitalizacionesPrevias}
                onChange={(e) => handleInputChange('hospitalizacionesPrevias', e.target.value)}
                className={`min-h-[100px] ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-50 border-gray-300'} transition-colors duration-200`}
              />
            </div>
          </InputWrapper>

          {/* Transfusiones Sanguíneas */}
          <InputWrapper field="transfusionesSanguineas">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="transfusiones"
                checked={antecedentesData.transfusionesSanguineas}
                onCheckedChange={(checked) => handleInputChange('transfusionesSanguineas', checked as boolean)}
                className={`${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
              />
              <Label htmlFor="transfusiones" className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                {renderTextContent("¿Ha recibido transfusiones sanguíneas?")}
              </Label>
            </div>
          </InputWrapper>

          {/* Enfermedades Crónicas */}
          <InputWrapper field="enfermedadesCronicas">
            <div className="space-y-2">
              <Label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                {renderTextContent("Enfermedades Crónicas")}
              </Label>
              <Textarea
                placeholder="Diabetes, hipertensión, enfermedades cardíacas, etc..."
                value={antecedentesData.enfermedadesCronicas}
                onChange={(e) => handleInputChange('enfermedadesCronicas', e.target.value)}
                className={`min-h-[100px] ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-50 border-gray-300'} transition-colors duration-200`}
              />
            </div>
          </InputWrapper>

          {/* Otras Condiciones */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                {renderTextContent("Otras Condiciones Médicas")}
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleOtraCondicionAdd}
                className={`${theme === 'dark' ? 'border-gray-600 text-gray-200 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} transition-colors duration-200`}
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </div>

            <AnimatePresence>
              {antecedentesData.otrasCondiciones.map((condicion, index) => (
                <motion.div
                  key={condicion.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <OtraCondicionInput
                    condicion={condicion}
                    onChange={(field, value) => handleOtraCondicionChange(condicion.id, field, value)}
                    onRemove={() => handleOtraCondicionRemove(condicion.id)}
                    theme={theme}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </CardWrapper>

      {isAutoSaving && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`text-center p-2 rounded-lg ${theme === 'dark' ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-700'}`}
        >
          {renderTextContent("Guardando cambios automáticamente...")}
        </motion.div>
      )}
    </div>
  );
};

export default AntecedentesPersonalesPatologicos;
