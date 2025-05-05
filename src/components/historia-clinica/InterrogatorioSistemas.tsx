
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface InterrogatorioSistemasProps {
  formData: any;
  handleInterrogatorioChange: (system: string, value: string) => void;
}

const InterrogatorioSistemas: React.FC<InterrogatorioSistemasProps> = ({ formData, handleInterrogatorioChange }) => {
  const [activeTab, setActiveTab] = useState('formulario');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [redactionContent, setRedactionContent] = useState<string>(() => {
    // Initialize redaction content based on existing form data
    return generateRedactionFromFormData(formData.interrogatorioSistemas);
  });

  const handleRedactionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRedactionContent(e.target.value);
    handleInterrogatorioChange('redaccion', e.target.value);
  };

  const generateAIRedaction = () => {
    setIsGeneratingAI(true);
    setTimeout(() => {
      const generatedContent = generateRedactionFromFormData(formData.interrogatorioSistemas);
      setRedactionContent(generatedContent);
      handleInterrogatorioChange('redaccion', generatedContent);
      setIsGeneratingAI(false);
      setActiveTab('redaccion');
    }, 1500);
  };

  const generateRedactionFromFormData = (data: any): string => {
    let redaction = '';

    // Hábitos alimenticios
    if (data.habitosAlimenticios === 'ninguno') {
      redaction += "Sin habitos alimenticios relevantes, se interrogo especificamente por: ingesta nocturna, picoteo frecuente, ayuno prolongado.\n";
    } else if (data.habitosAlimenticios) {
      redaction += `Hábitos alimenticios: ${data.habitosAlimenticios}.\n`;
    }

    // Hidratación
    if (data.hidratacion) {
      redaction += `Hidratación: ${data.hidratacion}.\n`;
    }

    // Ingesta de alcohol
    if (data.alcohol) {
      redaction += `Ingesta de alcohol: ${data.alcohol}.\n`;
    }

    // Tabaquismo
    if (data.tabaquismo) {
      redaction += `Tabaquismo: ${data.tabaquismo}.\n`;
    }

    // Ingesta de café
    if (data.cafe) {
      redaction += `Ingesta de café: ${data.cafe}.\n`;
    }

    // Ingesta de refrescos
    if (data.refrescos) {
      redaction += `Ingesta de refrescos: ${data.refrescos}.\n`;
    }

    // Tipo de dolor
    if (data.tipoDolor) {
      redaction += `Tipo de dolor: ${data.tipoDolor}.\n`;
    }

    // Fiebre
    if (data.fiebre) {
      redaction += `Fiebre: ${data.fiebre}.\n`;
    }

    // Tos
    if (data.tos) {
      redaction += `Tos: ${data.tos}.\n`;
    }

    // Tos con expectoración
    if (data.tosExpectoracion === 'no presenta tos con expectoracion') {
      redaction += `No presenta tos con expectoración.\n`;
    } else if (data.tosExpectoracion) {
      redaction += `Tos con expectoración: ${data.tosExpectoracion}.\n`;
    }

    // Disuria
    if (data.disuria) {
      redaction += `Disuria: ${data.disuria}.\n`;
    }

    // Hemianopsia
    if (data.hemianopsia) {
      redaction += `Hemianopsia: ${data.hemianopsia}.\n`;
    }

    // Polidipsia
    if (data.polidipsia) {
      redaction += `Polidipsia: ${data.polidipsia}.\n`;
    }

    // Cambios en el ritmo menstrual
    if (data.ritmoMenstrual === 'sin cambios en el ritmo menstrual') {
      redaction += `Sin cambios en el ritmo menstrual.\n`;
    } else if (data.ritmoMenstrual) {
      redaction += `Cambios en el ritmo menstrual: ${data.ritmoMenstrual}.\n`;
    }

    // Cambios en uñas
    if (data.cambiosUnias === 'sin cambios') {
      redaction += `Sin cambios en las uñas.\n`;
    } else if (data.cambiosUnias) {
      redaction += `Cambios en uñas: ${data.cambiosUnias}.\n`;
    }

    // Rigidez matutina
    if (data.rigidezMatutina === 'no presenta rigidez matutina') {
      redaction += `No presenta rigidez matutina.\n`;
    } else if (data.rigidezMatutina) {
      redaction += `Rigidez matutina: ${data.rigidezMatutina}.\n`;
    }

    return redaction;
  };

  return (
    <Card className="shadow-md mb-8">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Interrogatorio por Sistemas</h3>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="formulario">Formulario</TabsTrigger>
            <TabsTrigger value="redaccion">Redacción IA</TabsTrigger>
          </TabsList>
          
          <TabsContent value="formulario" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="habitosAlimenticios" className="mb-2 block font-medium">Hábitos alimenticios</Label>
                  <RadioGroup
                    value={formData.interrogatorioSistemas.habitosAlimenticios || ''}
                    onValueChange={(value) => handleInterrogatorioChange('habitosAlimenticios', value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ingesta nocturna" id="ingesta-nocturna" />
                      <Label htmlFor="ingesta-nocturna">Ingesta nocturna</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="picoteo frecuente" id="picoteo" />
                      <Label htmlFor="picoteo">Picoteo frecuente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ayuno prolongado" id="ayuno" />
                      <Label htmlFor="ayuno">Ayuno prolongado</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ninguno" id="ninguno-habitos" />
                      <Label htmlFor="ninguno-habitos">Ninguno</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="hidratacion" className="mb-2 block font-medium">Hidratación</Label>
                  <RadioGroup
                    value={formData.interrogatorioSistemas.hidratacion || ''}
                    onValueChange={(value) => handleInterrogatorioChange('hidratacion', value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="adecuada" id="hidratacion-adecuada" />
                      <Label htmlFor="hidratacion-adecuada">Adecuada</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="insuficiente" id="hidratacion-insuficiente" />
                      <Label htmlFor="hidratacion-insuficiente">Insuficiente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excesiva" id="hidratacion-excesiva" />
                      <Label htmlFor="hidratacion-excesiva">Excesiva</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="alcohol" className="mb-2 block font-medium">Ingesta de alcohol</Label>
                  <RadioGroup
                    value={formData.interrogatorioSistemas.alcohol || ''}
                    onValueChange={(value) => handleInterrogatorioChange('alcohol', value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no consume" id="no-alcohol" />
                      <Label htmlFor="no-alcohol">No consume</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ocasional" id="alcohol-ocasional" />
                      <Label htmlFor="alcohol-ocasional">Ocasional</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="regular" id="alcohol-regular" />
                      <Label htmlFor="alcohol-regular">Regular</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excesivo" id="alcohol-excesivo" />
                      <Label htmlFor="alcohol-excesivo">Excesivo</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tabaquismo" className="mb-2 block font-medium">Tabaquismo</Label>
                  <RadioGroup
                    value={formData.interrogatorioSistemas.tabaquismo || ''}
                    onValueChange={(value) => handleInterrogatorioChange('tabaquismo', value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no consume" id="no-tabaco" />
                      <Label htmlFor="no-tabaco">No consume</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ocasional" id="tabaco-ocasional" />
                      <Label htmlFor="tabaco-ocasional">Ocasional</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="regular" id="tabaco-regular" />
                      <Label htmlFor="tabaco-regular">Regular</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excesivo" id="tabaco-excesivo" />
                      <Label htmlFor="tabaco-excesivo">Excesivo</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="cafe" className="mb-2 block font-medium">Ingesta de café</Label>
                  <RadioGroup
                    value={formData.interrogatorioSistemas.cafe || ''}
                    onValueChange={(value) => handleInterrogatorioChange('cafe', value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no consume" id="no-cafe" />
                      <Label htmlFor="no-cafe">No consume</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1-2 tazas/día" id="cafe-moderado" />
                      <Label htmlFor="cafe-moderado">1-2 tazas/día</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3-5 tazas/día" id="cafe-alto" />
                      <Label htmlFor="cafe-alto">3-5 tazas/día</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="más de 5 tazas/día" id="cafe-excesivo" />
                      <Label htmlFor="cafe-excesivo">Más de 5 tazas/día</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="refrescos" className="mb-2 block font-medium">Ingesta de refrescos</Label>
                  <RadioGroup
                    value={formData.interrogatorioSistemas.refrescos || ''}
                    onValueChange={(value) => handleInterrogatorioChange('refrescos', value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no consume" id="no-refrescos" />
                      <Label htmlFor="no-refrescos">No consume</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ocasional" id="refrescos-ocasional" />
                      <Label htmlFor="refrescos-ocasional">Ocasional</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="regular" id="refrescos-regular" />
                      <Label htmlFor="refrescos-regular">Regular</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="diario" id="refrescos-diario" />
                      <Label htmlFor="refrescos-diario">Diario</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tipoDolor" className="mb-2 block font-medium">Tipo de dolor</Label>
                  <RadioGroup
                    value={formData.interrogatorioSistemas.tipoDolor || ''}
                    onValueChange={(value) => handleInterrogatorioChange('tipoDolor', value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no refiere" id="no-dolor" />
                      <Label htmlFor="no-dolor">No refiere</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="punzante" id="dolor-punzante" />
                      <Label htmlFor="dolor-punzante">Punzante</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="quemante" id="dolor-quemante" />
                      <Label htmlFor="dolor-quemante">Quemante</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cólico" id="dolor-colico" />
                      <Label htmlFor="dolor-colico">Cólico</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sordo" id="dolor-sordo" />
                      <Label htmlFor="dolor-sordo">Sordo</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="fiebre" className="mb-2 block font-medium">Fiebre</Label>
                  <RadioGroup
                    value={formData.interrogatorioSistemas.fiebre || ''}
                    onValueChange={(value) => handleInterrogatorioChange('fiebre', value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sin fiebre" id="sin-fiebre" />
                      <Label htmlFor="sin-fiebre">Sin fiebre</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="febrícula" id="febricula" />
                      <Label htmlFor="febricula">Febrícula</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fiebre moderada" id="fiebre-moderada" />
                      <Label htmlFor="fiebre-moderada">Fiebre moderada</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fiebre alta" id="fiebre-alta" />
                      <Label htmlFor="fiebre-alta">Fiebre alta</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="tos" className="mb-2 block font-medium">Tos</Label>
                  <RadioGroup
                    value={formData.interrogatorioSistemas.tos || ''}
                    onValueChange={(value) => handleInterrogatorioChange('tos', value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sin tos" id="sin-tos" />
                      <Label htmlFor="sin-tos">Sin tos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tos seca" id="tos-seca" />
                      <Label htmlFor="tos-seca">Tos seca</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tos productiva" id="tos-productiva" />
                      <Label htmlFor="tos-productiva">Tos productiva</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="tosExpectoracion" className="mb-2 block font-medium">Tos con expectoración</Label>
                  <RadioGroup
                    value={formData.interrogatorioSistemas.tosExpectoracion || ''}
                    onValueChange={(value) => handleInterrogatorioChange('tosExpectoracion', value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no presenta tos con expectoracion" id="sin-expectoracion" />
                      <Label htmlFor="sin-expectoracion">No presenta tos con expectoración</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Transparente" id="exp-transparente" />
                      <Label htmlFor="exp-transparente">Transparente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Amarilla" id="exp-amarilla" />
                      <Label htmlFor="exp-amarilla">Amarilla</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Verdosa" id="exp-verdosa" />
                      <Label htmlFor="exp-verdosa">Verdosa</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Hemoptoica" id="exp-hemoptoica" />
                      <Label htmlFor="exp-hemoptoica">Hemoptoica</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="disuria" className="mb-2 block font-medium">Disuria</Label>
                  <RadioGroup
                    value={formData.interrogatorioSistemas.disuria || ''}
                    onValueChange={(value) => handleInterrogatorioChange('disuria', value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ausente" id="disuria-ausente" />
                      <Label htmlFor="disuria-ausente">Ausente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="leve" id="disuria-leve" />
                      <Label htmlFor="disuria-leve">Leve</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderada" id="disuria-moderada" />
                      <Label htmlFor="disuria-moderada">Moderada</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="severa" id="disuria-severa" />
                      <Label htmlFor="disuria-severa">Severa</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="hemianopsia" className="mb-2 block font-medium">Hemianopsia</Label>
                  <RadioGroup
                    value={formData.interrogatorioSistemas.hemianopsia || ''}
                    onValueChange={(value) => handleInterrogatorioChange('hemianopsia', value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ausente" id="hemianopsia-ausente" />
                      <Label htmlFor="hemianopsia-ausente">Ausente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="presente" id="hemianopsia-presente" />
                      <Label htmlFor="hemianopsia-presente">Presente</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="polidipsia" className="mb-2 block font-medium">Polidipsia</Label>
                  <RadioGroup
                    value={formData.interrogatorioSistemas.polidipsia || ''}
                    onValueChange={(value) => handleInterrogatorioChange('polidipsia', value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ausente" id="polidipsia-ausente" />
                      <Label htmlFor="polidipsia-ausente">Ausente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="leve" id="polidipsia-leve" />
                      <Label htmlFor="polidipsia-leve">Leve</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderada" id="polidipsia-moderada" />
                      <Label htmlFor="polidipsia-moderada">Moderada</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="severa" id="polidipsia-severa" />
                      <Label htmlFor="polidipsia-severa">Severa</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="ritmoMenstrual" className="mb-2 block font-medium">Cambios en el ritmo menstrual</Label>
                  <RadioGroup
                    value={formData.interrogatorioSistemas.ritmoMenstrual || ''}
                    onValueChange={(value) => handleInterrogatorioChange('ritmoMenstrual', value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sin cambios en el ritmo menstrual" id="ritmo-sin-cambios" />
                      <Label htmlFor="ritmo-sin-cambios">Sin cambios en el ritmo menstrual</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Retrasos" id="ritmo-retrasos" />
                      <Label htmlFor="ritmo-retrasos">Retrasos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Amenorrea" id="ritmo-amenorrea" />
                      <Label htmlFor="ritmo-amenorrea">Amenorrea</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Ciclos cortos" id="ritmo-ciclos-cortos" />
                      <Label htmlFor="ritmo-ciclos-cortos">Ciclos cortos</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="cambiosUnias" className="mb-2 block font-medium">Cambios en uñas</Label>
                  <RadioGroup
                    value={formData.interrogatorioSistemas.cambiosUnias || ''}
                    onValueChange={(value) => handleInterrogatorioChange('cambiosUnias', value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sin cambios" id="unias-sin-cambios" />
                      <Label htmlFor="unias-sin-cambios">Sin cambios</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Frágiles" id="unias-fragiles" />
                      <Label htmlFor="unias-fragiles">Frágiles</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Quebradizas" id="unias-quebradizas" />
                      <Label htmlFor="unias-quebradizas">Quebradizas</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Deformadas" id="unias-deformadas" />
                      <Label htmlFor="unias-deformadas">Deformadas</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="rigidezMatutina" className="mb-2 block font-medium">Rigidez matutina</Label>
                  <RadioGroup
                    value={formData.interrogatorioSistemas.rigidezMatutina || ''}
                    onValueChange={(value) => handleInterrogatorioChange('rigidezMatutina', value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no presenta rigidez matutina" id="rigidez-no-presenta" />
                      <Label htmlFor="rigidez-no-presenta">No presenta rigidez matutina</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Menos de 30 min" id="rigidez-menos-30" />
                      <Label htmlFor="rigidez-menos-30">Menos de 30 min</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Más de 30 min" id="rigidez-mas-30" />
                      <Label htmlFor="rigidez-mas-30">Más de 30 min</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button 
                onClick={generateAIRedaction} 
                className="bg-blue-500 hover:bg-blue-600 text-white"
                disabled={isGeneratingAI}
              >
                {isGeneratingAI ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando redacción...
                  </>
                ) : (
                  'Generar redacción IA'
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="redaccion">
            <div className="min-h-[200px] bg-gray-50 dark:bg-gray-900 rounded-md p-4 mb-4">
              <Textarea 
                value={redactionContent} 
                onChange={handleRedactionChange}
                placeholder="La redacción generada por IA aparecerá aquí"
                className="min-h-[150px] border-none bg-transparent focus-visible:ring-0 resize-none whitespace-pre-wrap"
                data-redaction-content
              />
            </div>
            <div className="flex justify-end">
              <Button 
                onClick={generateAIRedaction} 
                className="bg-blue-500 hover:bg-blue-600 text-white"
                disabled={isGeneratingAI}
              >
                {isGeneratingAI ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Regenerando...
                  </>
                ) : (
                  'Regenerar redacción'
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InterrogatorioSistemas;
