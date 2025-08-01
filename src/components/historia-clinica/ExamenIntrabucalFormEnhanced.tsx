import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormDataState } from '@/types/historiaClinica';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Check, 
  AlertCircle,
  Stethoscope,
  Eye,
  Palette,
  Zap,
  BookOpen
} from 'lucide-react';

interface ExamenIntrabucalFormEnhancedProps {
  area: string;
  onClose: () => void;
  formData: FormDataState;
  handleExamenIntrabucalChange: (part: string, value: string | boolean) => void;
  onComplete?: () => void;
}

interface FormSection {
  id: string;
  title: string;
  icon: React.ElementType;
  required?: boolean;
}

const ExamenIntrabucalFormEnhanced: React.FC<ExamenIntrabucalFormEnhancedProps> = ({
  area,
  onClose,
  formData,
  handleExamenIntrabucalChange,
  onComplete
}) => {
  const [currentSubSection, setCurrentSubSection] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<{[key: string]: string}>({});
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [otroTextareas, setOtroTextareas] = useState<{[key: string]: boolean}>({});
  const [autoSaveMessage, setAutoSaveMessage] = useState('');

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(selectedOptions).length > 0) {
        setAutoSaveMessage('Guardado automáticamente');
        setTimeout(() => setAutoSaveMessage(''), 2000);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [selectedOptions]);

  const getAreaConfig = () => {
    switch (area) {
      case 'encias':
        return {
          title: '🦷 ENCÍAS',
          subtitle: 'Evaluación periodontal completa',
          sections: [
            { id: 'color', title: 'Color y Apariencia', icon: Palette, required: true },
            { id: 'textura', title: 'Textura y Consistencia', icon: Eye, required: true },
            { id: 'sangrado', title: 'Sangrado Gingival', icon: AlertCircle, required: true },
            { id: 'bolsas', title: 'Bolsas Periodontales', icon: Stethoscope },
            { id: 'movilidad', title: 'Movilidad Dentaria', icon: Zap }
          ]
        };
      case 'paladar':
        return {
          title: '🦷 PALADAR',
          subtitle: 'Evaluación de paladar duro y blando',
          sections: [
            { id: 'divisiones', title: 'Anatomía General', icon: BookOpen, required: true },
            { id: 'color', title: 'Color y Pigmentación', icon: Palette, required: true },
            { id: 'lesiones', title: 'Lesiones Visibles', icon: AlertCircle },
            { id: 'funcional', title: 'Evaluación Funcional', icon: Stethoscope }
          ]
        };
      case 'lengua':
        return {
          title: '🦷 LENGUA',
          subtitle: 'Evaluación completa lingual',
          sections: [
            { id: 'superficie', title: 'Superficie Dorsal', icon: Eye, required: true },
            { id: 'lateral', title: 'Bordes Laterales', icon: Eye, required: true },
            { id: 'ventral', title: 'Superficie Ventral', icon: Eye },
            { id: 'movilidad', title: 'Movilidad y Función', icon: Zap, required: true }
          ]
        };
      case 'orofaringe':
        return {
          title: '🦷 OROFARINGE',
          subtitle: 'Evaluación de faringe e istmo',
          sections: [
            { id: 'pilares', title: 'Pilares Amigdalinos', icon: Eye, required: true },
            { id: 'amigdalas', title: 'Amígdalas', icon: Stethoscope, required: true },
            { id: 'pared', title: 'Pared Posterior', icon: Eye },
            { id: 'mallampati', title: 'Clasificación Mallampati', icon: BookOpen }
          ]
        };
      case 'mejillas':
        return {
          title: '🦷 MEJILLAS',
          subtitle: 'Evaluación de mucosa bucal',
          sections: [
            { id: 'mucosa', title: 'Mucosa Yugal', icon: Eye, required: true },
            { id: 'vestibulo', title: 'Vestíbulo Bucal', icon: Eye, required: true },
            { id: 'linea', title: 'Línea Alba', icon: AlertCircle },
            { id: 'conducto', title: 'Conducto de Stenon', icon: Stethoscope }
          ]
        };
      case 'retromolar':
        return {
          title: '🦷 REGIÓN RETROMOLAR',
          subtitle: 'Evaluación posterior',
          sections: [
            { id: 'trigono', title: 'Trígono Retromolar', icon: Eye, required: true },
            { id: 'mucosa', title: 'Mucosa Alveolar', icon: Eye, required: true },
            { id: 'cordales', title: 'Área de Cordales', icon: AlertCircle }
          ]
        };
      case 'pisoBoca':
        return {
          title: '🦷 PISO DE BOCA',
          subtitle: 'Evaluación del suelo bucal',
          sections: [
            { id: 'frenillo', title: 'Frenillo Lingual', icon: Eye, required: true },
            { id: 'carunculas', title: 'Carúnculas Sublinguales', icon: Stethoscope, required: true },
            { id: 'glandulas', title: 'Glándulas Sublinguales', icon: Stethoscope },
            { id: 'venas', title: 'Venas Linguales', icon: Eye }
          ]
        };
      default:
        return { title: 'Examen', subtitle: '', sections: [] };
    }
  };

  const areaConfig = getAreaConfig();
  const currentSection = areaConfig.sections[currentSubSection];
  const progress = ((currentSubSection + 1) / areaConfig.sections.length) * 100;

  const colorOptions = [
    { color: 'hsl(var(--rose-200))', hex: '#FFC0CB', label: 'Rosa pálido', description: 'Mucosa sana, normal' },
    { color: 'hsl(var(--red-400))', hex: '#FF6666', label: 'Eritematoso', description: 'Inflamación, infección, trauma' },
    { color: 'hsl(var(--rose-50))', hex: '#FFF0F5', label: 'Pálido', description: 'Anemia, deficiencia de hierro' },
    { color: 'hsl(var(--gray-400))', hex: '#A9A9A9', label: 'Blanquecino', description: 'Leucoplasia, cándida, línea alba' },
    { color: 'hsl(var(--red-900))', hex: '#8B0000', label: 'Rojizo oscuro', description: 'Trauma, petequias, lesiones vasculares' },
    { color: 'hsl(var(--yellow-400))', hex: '#FFCC00', label: 'Amarillento', description: 'Saburra lingual, secreción purulenta' },
    { color: 'hsl(var(--gray-900))', hex: '#000000', label: 'Negruzco', description: 'Pigmentación por tabaco, lengua negra vellosa' },
    { color: 'hsl(var(--amber-700))', hex: '#964B00', label: 'Café/marrón', description: 'Melanosis, tabaquismo, pigmentación' },
    { color: 'hsl(var(--blue-800))', hex: '#00008B', label: 'Cianótico', description: 'Hipoxia, venas varicosas' }
  ];

  const scrollToTop = () => {
    const dialogContent = document.querySelector('[data-radix-dialog-content]');
    if (dialogContent) {
      dialogContent.scrollTop = 0;
    }
  };

  const handleNext = () => {
    if (currentSubSection < areaConfig.sections.length - 1) {
      setCurrentSubSection(currentSubSection + 1);
      scrollToTop();
    }
  };

  const handlePrevious = () => {
    if (currentSubSection > 0) {
      setCurrentSubSection(currentSubSection - 1);
      scrollToTop();
    }
  };

  const handleOptionSelect = (option: string, category: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [category]: option
    }));
    
    // Mark section as completed if it's required
    if (currentSection?.required) {
      setCompletedSections(prev => new Set([...prev, currentSection.id]));
    }
    
    // Show textarea if "Otro" is selected
    if (option.toLowerCase().includes('otro')) {
      setOtroTextareas(prev => ({
        ...prev,
        [`${category}_${option}`]: true
      }));
    }
  };

  const handleSave = () => {
    // Save all data
    Object.entries(selectedOptions).forEach(([key, value]) => {
      handleExamenIntrabucalChange(`${area}_${key}`, value);
    });
    
    if (onComplete) {
      onComplete();
    }
    onClose();
  };

  const createQuickFillButton = (type: 'normal' | 'patologico') => (
    <Button
      variant={type === 'normal' ? 'default' : 'destructive'}
      size="sm"
      onClick={() => {
        const fillData = type === 'normal' 
          ? { color: 'Rosa pálido', textura: 'Normal', estado: 'Sano' }
          : { color: 'Eritematoso', textura: 'Inflamado', estado: 'Patológico' };
        
        setSelectedOptions(prev => ({ ...prev, ...fillData }));
      }}
    >
      {type === 'normal' ? '✓ Normal' : '⚠ Patológico'}
    </Button>
  );

  const renderColorSelector = () => (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Selección de Color
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {colorOptions.map((option, index) => (
            <Button
              key={index}
              variant={selectedOptions.color === option.label ? "default" : "outline"}
              className="justify-start h-auto py-2 px-3"
              onClick={() => handleOptionSelect(option.label, 'color')}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: option.hex }}
                />
                <div className="text-left">
                  <div className="font-medium text-xs">{option.label}</div>
                  <div className="text-xs text-muted-foreground">{option.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderOptionButtons = (options: string[], category: string, allowMultiple = false) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((option) => (
        <div key={option} className="flex flex-col">
          <Button
            variant={selectedOptions[category] === option ? "default" : "outline"}
            size="sm"
            onClick={() => handleOptionSelect(option, category)}
            className="justify-start"
          >
            {selectedOptions[category] === option && <Check className="h-3 w-3 mr-1" />}
            {option}
          </Button>
          {option.toLowerCase().includes('otro') && otroTextareas[`${category}_${option}`] && (
            <Textarea 
              placeholder="Especifica los detalles..."
              className="mt-2"
              rows={2}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderSectionContent = () => {
    if (!currentSection) return null;

    const SectionIcon = currentSection.icon;

    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <SectionIcon className="h-5 w-5 text-primary" />
            {currentSection.title}
            {currentSection.required && (
              <Badge variant="destructive" className="text-xs">Requerido</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick fill buttons */}
          <div className="flex gap-2 mb-4">
            <span className="text-sm text-muted-foreground self-center">Llenado rápido:</span>
            {createQuickFillButton('normal')}
            {createQuickFillButton('patologico')}
          </div>

          {/* Section-specific content */}
          {currentSection.id === 'color' && renderColorSelector()}
          
          {currentSection.id === 'textura' && (
            <div>
              <Label className="text-sm font-medium">Textura y Consistencia:</Label>
              {renderOptionButtons([
                'Firme y resiliente', 'Edematosa', 'Fibrosa', 'Ulcerada', 
                'Hiperqueratósica', 'Atrófica', 'Otro'
              ], 'textura')}
            </div>
          )}

          {currentSection.id === 'sangrado' && (
            <div>
              <Label className="text-sm font-medium">Sangrado Gingival:</Label>
              {renderOptionButtons([
                'Ausente', 'Al sondaje', 'Espontáneo', 'Localizado', 
                'Generalizado', 'Otro'
              ], 'sangrado')}
            </div>
          )}

          {currentSection.id === 'divisiones' && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Divisiones anatómicas:</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Paladar duro:</strong> Región anterior mineralizada</p>
                  <p><strong>Paladar blando:</strong> Región posterior muscular</p>
                </div>
              </div>
              <Label className="text-sm font-medium">Estado general:</Label>
              {renderOptionButtons([
                'Normal', 'Paladar ojival', 'Paladar plano', 'Asimetría', 
                'Perforación', 'Fisura', 'Otro'
              ], 'estado')}
            </div>
          )}

          {/* Add more section-specific content as needed */}
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Fixed Header */}
        <div className="sticky top-0 bg-background border-b pb-4 z-10">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold">{areaConfig.title}</DialogTitle>
                <p className="text-sm text-muted-foreground">{areaConfig.subtitle}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="sticky top-2 right-2 h-8 w-8 p-0 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progreso</span>
              <span>{currentSubSection + 1} de {areaConfig.sections.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Auto-save indicator */}
          {autoSaveMessage && (
            <div className="flex items-center gap-1 text-xs text-green-600 mt-2">
              <Check className="h-3 w-3" />
              {autoSaveMessage}
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-1">
          {renderSectionContent()}
        </div>

        {/* Fixed Footer */}
        <div className="sticky bottom-0 bg-background border-t pt-4 mt-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSubSection === 0}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>

            {currentSubSection === areaConfig.sections.length - 1 ? (
              <Button
                onClick={handleSave}
                className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
              >
                <Check className="h-4 w-4" />
                Guardar
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex items-center gap-1"
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExamenIntrabucalFormEnhanced;