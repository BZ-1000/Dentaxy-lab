import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { generateInterrogatorioReport } from '@/services/geminiService';
import { Loader2 } from 'lucide-react';
import { AnimatedTextareaWithTyping } from '@/components/ui/AnimatedTextareaWithTyping';
import { useToast } from '@/hooks/use-toast';

interface InterrogatorioSistemasProps {
  formData: any;
  handleInterrogatorioChange: (field: string, value: string) => void;
}

const InterrogatorioSistemas = ({ formData, handleInterrogatorioChange }: InterrogatorioSistemasProps) => {
  const [activeTab, setActiveTab] = useState("formulario");
  const [redaccion, setRedaccion] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      const report = await generateInterrogatorioReport(formData);
      setRedaccion(prev => ({ ...prev, interrogatorio: report }));
      setActiveTab("redaccion");
      toast({
        title: "Redacción generada",
        description: "La redacción del interrogatorio por sistemas ha sido generada exitosamente."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar la redacción. Por favor, intente nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Interrogatorio por Sistemas</CardTitle>
        <CardDescription>
          Historial de signos y síntomas por sistema
        </CardDescription>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="formulario">Formulario</TabsTrigger>
          <TabsTrigger value="redaccion">Redacción IA</TabsTrigger>
        </TabsList>
        <TabsContent value="formulario">
          <CardContent className="space-y-6">
            {/* Sistema Respiratorio */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Sistema Respiratorio</h3>
              
              {/* Tos con expectoración */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Tos con expectoración</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.tosExpectoracion || ""}
                  onValueChange={(value) => handleInterrogatorioChange("tosExpectoracion", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no presenta" id="tosExpectoracion-no" />
                    <Label htmlFor="tosExpectoracion-no">No presenta tos con expectoración</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="transparente" id="tosExpectoracion-transparente" />
                    <Label htmlFor="tosExpectoracion-transparente">Transparente</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="amarilla" id="tosExpectoracion-amarilla" />
                    <Label htmlFor="tosExpectoracion-amarilla">Amarilla</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="verdosa" id="tosExpectoracion-verdosa" />
                    <Label htmlFor="tosExpectoracion-verdosa">Verdosa</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hemoptoica" id="tosExpectoracion-hemoptoica" />
                    <Label htmlFor="tosExpectoracion-hemoptoica">Hemoptoica</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Disnea */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Disnea</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.disnea || ""}
                  onValueChange={(value) => handleInterrogatorioChange("disnea", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ninguna" id="disnea-ninguna" />
                    <Label htmlFor="disnea-ninguna">Ninguna</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="de esfuerzo" id="disnea-esfuerzo" />
                    <Label htmlFor="disnea-esfuerzo">De esfuerzo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paroxística nocturna" id="disnea-paroxistica" />
                    <Label htmlFor="disnea-paroxistica">Paroxística nocturna</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ortopnea" id="disnea-ortopnea" />
                    <Label htmlFor="disnea-ortopnea">Ortopnea</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Sibilancias */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Sibilancias</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.sibilancias || ""}
                  onValueChange={(value) => handleInterrogatorioChange("sibilancias", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="sibilancias-no" />
                    <Label htmlFor="sibilancias-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="sibilancias-si" />
                    <Label htmlFor="sibilancias-si">Sí</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Dolor torácico */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Dolor torácico</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.dolorToracico || ""}
                  onValueChange={(value) => handleInterrogatorioChange("dolorToracico", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="dolorToracico-no" />
                    <Label htmlFor="dolorToracico-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="dolorToracico-si" />
                    <Label htmlFor="dolorToracico-si">Sí</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            {/* Sistema Cardiovascular */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Sistema Cardiovascular</h3>
              
              {/* Palpitaciones */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Palpitaciones</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.palpitaciones || ""}
                  onValueChange={(value) => handleInterrogatorioChange("palpitaciones", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="palpitaciones-no" />
                    <Label htmlFor="palpitaciones-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="palpitaciones-si" />
                    <Label htmlFor="palpitaciones-si">Sí</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Edema */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Edema</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.edema || ""}
                  onValueChange={(value) => handleInterrogatorioChange("edema", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="edema-no" />
                    <Label htmlFor="edema-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="edema-si" />
                    <Label htmlFor="edema-si">Sí</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Sincope */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Síncope</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.sincope || ""}
                  onValueChange={(value) => handleInterrogatorioChange("sincope", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="sincope-no" />
                    <Label htmlFor="sincope-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="sincope-si" />
                    <Label htmlFor="sincope-si">Sí</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            {/* Sistema Digestivo */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Sistema Digestivo</h3>
              
              {/* Nauseas */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Náuseas</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.nauseas || ""}
                  onValueChange={(value) => handleInterrogatorioChange("nauseas", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="nauseas-no" />
                    <Label htmlFor="nauseas-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="nauseas-si" />
                    <Label htmlFor="nauseas-si">Sí</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Vómitos */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Vómitos</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.vomitos || ""}
                  onValueChange={(value) => handleInterrogatorioChange("vomitos", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="vomitos-no" />
                    <Label htmlFor="vomitos-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="vomitos-si" />
                    <Label htmlFor="vomitos-si">Sí</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Diarrea */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Diarrea</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.diarrea || ""}
                  onValueChange={(value) => handleInterrogatorioChange("diarrea", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="diarrea-no" />
                    <Label htmlFor="diarrea-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="diarrea-si" />
                    <Label htmlFor="diarrea-si">Sí</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Estreñimiento */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Estreñimiento</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.estrenimiento || ""}
                  onValueChange={(value) => handleInterrogatorioChange("estrenimiento", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="estrenimiento-no" />
                    <Label htmlFor="estrenimiento-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="estrenimiento-si" />
                    <Label htmlFor="estrenimiento-si">Sí</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            {/* Sistema Urinario */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Sistema Urinario</h3>
              
              {/* Disuria */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Disuria</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.disuria || ""}
                  onValueChange={(value) => handleInterrogatorioChange("disuria", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="disuria-no" />
                    <Label htmlFor="disuria-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="disuria-si" />
                    <Label htmlFor="disuria-si">Sí</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Polaquiuria */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Polaquiuria</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.polaquiuria || ""}
                  onValueChange={(value) => handleInterrogatorioChange("polaquiuria", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="polaquiuria-no" />
                    <Label htmlFor="polaquiuria-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="polaquiuria-si" />
                    <Label htmlFor="polaquiuria-si">Sí</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Urgencia miccional */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Urgencia miccional</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.urgenciaMiccional || ""}
                  onValueChange={(value) => handleInterrogatorioChange("urgenciaMiccional", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="urgenciaMiccional-no" />
                    <Label htmlFor="urgenciaMiccional-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="urgenciaMiccional-si" />
                    <Label htmlFor="urgenciaMiccional-si">Sí</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Nicturia */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Nicturia</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.nicturia || ""}
                  onValueChange={(value) => handleInterrogatorioChange("nicturia", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="nicturia-no" />
                    <Label htmlFor="nicturia-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="nicturia-si" />
                    <Label htmlFor="nicturia-si">Sí</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            {/* Sistema Músculo-esquelético */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Sistema Músculo-esquelético</h3>
              
              {/* Artralgias */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Artralgias</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.artralgias || ""}
                  onValueChange={(value) => handleInterrogatorioChange("artralgias", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="artralgias-no" />
                    <Label htmlFor="artralgias-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="artralgias-si" />
                    <Label htmlFor="artralgias-si">Sí</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Mialgias */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Mialgias</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.mialgias || ""}
                  onValueChange={(value) => handleInterrogatorioChange("mialgias", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="mialgias-no" />
                    <Label htmlFor="mialgias-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="mialgias-si" />
                    <Label htmlFor="mialgias-si">Sí</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Rigidez matutina */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Rigidez matutina</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.rigidezMatutina || ""}
                  onValueChange={(value) => handleInterrogatorioChange("rigidezMatutina", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no presenta" id="rigidezMatutina-no" />
                    <Label htmlFor="rigidezMatutina-no">No presenta rigidez matutina</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="menos de 30 min" id="rigidezMatutina-menos" />
                    <Label htmlFor="rigidezMatutina-menos">Menos de 30 min</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="más de 30 min" id="rigidezMatutina-mas" />
                    <Label htmlFor="rigidezMatutina-mas">Más de 30 min</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            {/* Sistema Nervioso */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Sistema Nervioso</h3>
              
              {/* Cefalea */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Cefalea</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.cefalea || ""}
                  onValueChange={(value) => handleInterrogatorioChange("cefalea", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="cefalea-no" />
                    <Label htmlFor="cefalea-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="cefalea-si" />
                    <Label htmlFor="cefalea-si">Sí</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Mareos */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Mareos</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.mareos || ""}
                  onValueChange={(value) => handleInterrogatorioChange("mareos", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="mareos-no" />
                    <Label htmlFor="mareos-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="mareos-si" />
                    <Label htmlFor="mareos-si">Sí</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Parestesias */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Parestesias</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.parestesias || ""}
                  onValueChange={(value) => handleInterrogatorioChange("parestesias", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="parestesias-no" />
                    <Label htmlFor="parestesias-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="parestesias-si" />
                    <Label htmlFor="parestesias-si">Sí</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            {/* Sistema Endocrino */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Sistema Endocrino</h3>
              
              {/* Polidipsia */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Polidipsia</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.polidipsia || ""}
                  onValueChange={(value) => handleInterrogatorioChange("polidipsia", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="polidipsia-no" />
                    <Label htmlFor="polidipsia-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="polidipsia-si" />
                    <Label htmlFor="polidipsia-si">Sí</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Poliuria */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Poliuria</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.poliuria || ""}
                  onValueChange={(value) => handleInterrogatorioChange("poliuria", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="poliuria-no" />
                    <Label htmlFor="poliuria-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="poliuria-si" />
                    <Label htmlFor="poliuria-si">Sí</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Polifagia */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Polifagia</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.polifagia || ""}
                  onValueChange={(value) => handleInterrogatorioChange("polifagia", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="polifagia-no" />
                    <Label htmlFor="polifagia-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="polifagia-si" />
                    <Label htmlFor="polifagia-si">Sí</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Cambios en el ritmo menstrual */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Cambios en el ritmo menstrual</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.cambiosMenstruales || ""}
                  onValueChange={(value) => handleInterrogatorioChange("cambiosMenstruales", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sin cambios" id="cambiosMenstruales-sin" />
                    <Label htmlFor="cambiosMenstruales-sin">Sin cambios en el ritmo menstrual</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="retrasos" id="cambiosMenstruales-retrasos" />
                    <Label htmlFor="cambiosMenstruales-retrasos">Retrasos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="amenorrea" id="cambiosMenstruales-amenorrea" />
                    <Label htmlFor="cambiosMenstruales-amenorrea">Amenorrea</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ciclos cortos" id="cambiosMenstruales-ciclos" />
                    <Label htmlFor="cambiosMenstruales-ciclos">Ciclos cortos</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            {/* Sistema Tegumentario */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Sistema Tegumentario</h3>
              
              {/* Cambios en piel */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Cambios en piel</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.cambiosPiel || ""}
                  onValueChange={(value) => handleInterrogatorioChange("cambiosPiel", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="cambiosPiel-no" />
                    <Label htmlFor="cambiosPiel-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="cambiosPiel-si" />
                    <Label htmlFor="cambiosPiel-si">Sí</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Cambios en cabello */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Cambios en cabello</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.cambiosCabello || ""}
                  onValueChange={(value) => handleInterrogatorioChange("cambiosCabello", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="cambiosCabello-no" />
                    <Label htmlFor="cambiosCabello-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="cambiosCabello-si" />
                    <Label htmlFor="cambiosCabello-si">Sí</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Cambios en uñas */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Cambios en uñas</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.cambiosUnas || ""}
                  onValueChange={(value) => handleInterrogatorioChange("cambiosUnas", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sin cambios" id="cambiosUnas-sin" />
                    <Label htmlFor="cambiosUnas-sin">Sin cambios</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="frágiles" id="cambiosUnas-fragiles" />
                    <Label htmlFor="cambiosUnas-fragiles">Frágiles</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="quebradizas" id="cambiosUnas-quebradizas" />
                    <Label htmlFor="cambiosUnas-quebradizas">Quebradizas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="deformadas" id="cambiosUnas-deformadas" />
                    <Label htmlFor="cambiosUnas-deformadas">Deformadas</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            {/* Otros */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Otros</h3>
              
              {/* Fiebre */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Fiebre</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas.fiebre || ""}
                  onValueChange={(value) => handleInterrogatorioChange("fiebre", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="fiebre-no" />
                    <Label htmlFor="fiebre-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="fiebre-si" />
                    <Label htmlFor="fiebre-si">Sí</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Pérdida de peso */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Pérdida de peso</label>
                <RadioGroup 
                  className="flex flex-wrap gap-2"
                  value={formData.interrogatorioSistemas
