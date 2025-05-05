import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateExamenCabezaReport } from '@/services/geminiService';
import { AnimatedTextareaWithTyping } from '@/components/ui/AnimatedTextareaWithTyping';
import { CaracteristicaFacial } from '@/types/historiaClinica';

// Fix the typing for handleCaracteristicaChange to handle complex objects correctly
const caracteristicaFacialToString = (caracteristica: CaracteristicaFacial | string | boolean): string => {
  if (typeof caracteristica === 'boolean') {
    return caracteristica ? 'presente' : 'ausente';
  }
  
  if (typeof caracteristica === 'string') {
    return caracteristica;
  }
  
  return JSON.stringify(caracteristica);
};

const ExamenCabeza = ({ formData, handleExamenCabezaChange }) => {
  const [activeTab, setActiveTab] = useState("formulario");
  const [redaccion, setRedaccion] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  const handleCaracteristicaChange = (part: string, field: string, value: string) => {
    // For simple string field updates
    if (typeof formData.examenCabeza[part] === 'string' || typeof formData.examenCabeza[part] === 'boolean') {
      handleExamenCabezaChange(part, value);
      return;
    }
    
    // For complex CaracteristicaFacial objects
    const currentPart = formData.examenCabeza[part] || {};
    handleExamenCabezaChange(part, {
      ...currentPart,
      [field]: value
    });
  };
  
  const handleLunaresPresencia = (value: boolean) => {
    const currentLunares = formData.examenCabeza.lunares || {};
    handleExamenCabezaChange('lunares', {
      ...currentLunares,
      presente: value
    });
  };
  
  const handleCicatricesPresencia = (value: boolean) => {
    const currentCicatrices = formData.examenCabeza.cicatrices || {};
    handleExamenCabezaChange('cicatrices', {
      ...currentCicatrices,
      presente: value
    });
  };
  
  const handleAsimetriasPresencia = (value: boolean) => {
    const currentAsimetrias = formData.examenCabeza.asimetriasFaciales || {};
    handleExamenCabezaChange('asimetriasFaciales', {
      ...currentAsimetrias,
      presente: value
    });
  };
  
  const handleEdemaPresencia = (value: boolean) => {
    const currentEdema = formData.examenCabeza.edema || {};
    handleExamenCabezaChange('edema', {
      ...currentEdema,
      presente: value
    });
  };
  
  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      const report = await generateExamenCabezaReport(formData);
      setRedaccion(prev => ({ ...prev, examenCabeza: report }));
      setActiveTab("redaccion");
      toast({
        title: "Redacción generada",
        description: "La redacción del examen de cabeza ha sido generada exitosamente."
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
        <CardTitle>Examen de Cabeza</CardTitle>
        <CardDescription>
          Detalles del examen físico de la cabeza del paciente
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="formulario">Formulario</TabsTrigger>
          <TabsTrigger value="redaccion">Redacción IA</TabsTrigger>
        </TabsList>
        
        <TabsContent value="formulario">
          <CardContent className="space-y-6">
            {/* Sin hallazgos */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sin-hallazgos" 
                  checked={formData.examenCabeza.sinHallazgos || false}
                  onCheckedChange={(checked) => handleExamenCabezaChange("sinHallazgos", checked)}
                />
                <Label htmlFor="sin-hallazgos" className="text-base font-medium">Sin hallazgos</Label>
              </div>
            </div>
            
            {/* Type of cranium */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Tipo de cráneo</label>
              <RadioGroup 
                className="flex flex-wrap gap-2"
                value={formData.examenCabeza.tipoCraneo || ""}
                onValueChange={(value) => handleExamenCabezaChange("tipoCraneo", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normocéfalo" id="craneo-normocefalo" />
                  <Label htmlFor="craneo-normocefalo">Normocéfalo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="braquicéfalo" id="craneo-braquicefalo" />
                  <Label htmlFor="craneo-braquicefalo">Braquicéfalo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dolicocéfalo" id="craneo-dolicocefalo" />
                  <Label htmlFor="craneo-dolicocefalo">Dolicocéfalo</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Type of profile */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Tipo de perfil</label>
              <RadioGroup 
                className="flex flex-wrap gap-2"
                value={formData.examenCabeza.tipoPerfil || ""}
                onValueChange={(value) => handleExamenCabezaChange("tipoPerfil", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recto" id="perfil-recto" />
                  <Label htmlFor="perfil-recto">Recto</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="convexo" id="perfil-convexo" />
                  <Label htmlFor="perfil-convexo">Convexo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="concavo" id="perfil-concavo" />
                  <Label htmlFor="perfil-concavo">Cóncavo</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Tez */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Tez</label>
              <Input 
                type="text"
                value={formData.examenCabeza.tez || ""}
                onChange={(e) => handleExamenCabezaChange("tez", e.target.value)}
                placeholder="Ingrese la tez del paciente"
              />
            </div>
            
            {/* Estado de la piel */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Estado de la piel</label>
              <Input 
                type="text"
                value={formData.examenCabeza.estadoPiel || ""}
                onChange={(e) => handleExamenCabezaChange("estadoPiel", e.target.value)}
                placeholder="Ingrese el estado de la piel"
              />
            </div>
            
            {/* Lunares */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="lunares-presentes" 
                  checked={formData.examenCabeza.lunares?.presente || false}
                  onCheckedChange={handleLunaresPresencia}
                />
                <Label htmlFor="lunares-presentes" className="text-base font-medium">Lunares faciales</Label>
              </div>
              
              {formData.examenCabeza.lunares?.presente && (
                <div className="space-y-4 pl-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tamaño</Label>
                      <Select 
                        value={formData.examenCabeza.lunares?.tamanio || ""}
                        onValueChange={(value) => handleCaracteristicaChange("lunares", "tamanio", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tamaño" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pequeño">Pequeño</SelectItem>
                          <SelectItem value="mediano">Mediano</SelectItem>
                          <SelectItem value="grande">Grande</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Color</Label>
                      <Select 
                        value={formData.examenCabeza.lunares?.color || ""}
                        onValueChange={(value) => handleCaracteristicaChange("lunares", "color", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="marrón claro">Marrón claro</SelectItem>
                          <SelectItem value="marrón oscuro">Marrón oscuro</SelectItem>
                          <SelectItem value="negro">Negro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Bordes</Label>
                      <Select 
                        value={formData.examenCabeza.lunares?.bordes || ""}
                        onValueChange={(value) => handleCaracteristicaChange("lunares", "bordes", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar bordes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="regulares">Regulares</SelectItem>
                          <SelectItem value="irregulares">Irregulares</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Localización</Label>
                      <Input 
                        type="text"
                        value={formData.examenCabeza.lunares?.localizacion || ""}
                        onChange={(e) => handleCaracteristicaChange("lunares", "localizacion", e.target.value)}
                        placeholder="Localización del lunar"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lunares-detalles">Detalles adicionales</Label>
                    <Textarea 
                      id="lunares-detalles" 
                      value={formData.examenCabeza.lunares?.detalles || ""}
                      onChange={(e) => handleCaracteristicaChange("lunares", "detalles", e.target.value)}
                      placeholder="Descripción detallada de los lunares"
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Cicatrices */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="cicatrices-presentes" 
                  checked={formData.examenCabeza.cicatrices?.presente || false}
                  onCheckedChange={handleCicatricesPresencia}
                />
                <Label htmlFor="cicatrices-presentes" className="text-base font-medium">Cicatrices faciales</Label>
              </div>
              
              {formData.examenCabeza.cicatrices?.presente && (
                <div className="space-y-4 pl-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Elevación</Label>
                      <Select 
                        value={formData.examenCabeza.cicatrices?.elevacion || ""}
                        onValueChange={(value) => handleCaracteristicaChange("cicatrices", "elevacion", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar elevación" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="plano">Plano</SelectItem>
                          <SelectItem value="elevado">Elevado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <Select 
                        value={formData.examenCabeza.cicatrices?.tipo || ""}
                        onValueChange={(value) => handleCaracteristicaChange("cicatrices", "tipo", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quirúrgica">Quirúrgica</SelectItem>
                          <SelectItem value="traumática">Traumática</SelectItem>
                          <SelectItem value="acneica">Acneica</SelectItem>
                          <SelectItem value="queloide">Queloide</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Antigüedad</Label>
                      <Select 
                        value={formData.examenCabeza.cicatrices?.antiguedad || ""}
                        onValueChange={(value) => handleCaracteristicaChange("cicatrices", "antiguedad", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar antigüedad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nueva">Nueva</SelectItem>
                          <SelectItem value="antigua">Antigua</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Coloración</Label>
                      <Select 
                        value={formData.examenCabeza.cicatrices?.coloracion || ""}
                        onValueChange={(value) => handleCaracteristicaChange("cicatrices", "coloracion", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar coloración" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hipopigmentada">Hipopigmentada</SelectItem>
                          <SelectItem value="hiperpigmentada">Hiperpigmentada</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cicatrices-detalles">Detalles adicionales</Label>
                    <Textarea 
                      id="cicatrices-detalles" 
                      value={formData.examenCabeza.cicatrices?.detalles || ""}
                      onChange={(e) => handleCaracteristicaChange("cicatrices", "detalles", e.target.value)}
                      placeholder="Descripción detallada de las cicatrices"
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Asimetrías faciales */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="asimetrias-presentes" 
                  checked={formData.examenCabeza.asimetriasFaciales?.presente || false}
                  onCheckedChange={handleAsimetriasPresencia}
                />
                <Label htmlFor="asimetrias-presentes" className="text-base font-medium">Asimetrías faciales</Label>
              </div>
              
              {formData.examenCabeza.asimetriasFaciales?.presente && (
                <div className="space-y-4 pl-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Zona Afectada</Label>
                      <Select 
                        value={formData.examenCabeza.asimetriasFaciales?.zonaAfectada || ""}
                        onValueChange={(value) => handleCaracteristicaChange("asimetriasFaciales", "zonaAfectada", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar zona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mandíbula">Mandíbula</SelectItem>
                          <SelectItem value="mejillas">Mejillas</SelectItem>
                          <SelectItem value="ojos">Ojos</SelectItem>
                          <SelectItem value="nariz">Nariz</SelectItem>
                          <SelectItem value="frente">Frente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Posible Causa</Label>
                      <Select 
                        value={formData.examenCabeza.asimetriasFaciales?.posibleCausa || ""}
                        onValueChange={(value) => handleCaracteristicaChange("asimetriasFaciales", "posibleCausa", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar causa" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="congénita">Congénita</SelectItem>
                          <SelectItem value="traumática">Traumática</SelectItem>
                          <SelectItem value="muscular">Muscular</SelectItem>
                          <SelectItem value="otra">Otra</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="asimetrias-detalles">Detalles adicionales</Label>
                    <Textarea 
                      id="asimetrias-detalles" 
                      value={formData.examenCabeza.asimetriasFaciales?.detalles || ""}
                      onChange={(e) => handleCaracteristicaChange("asimetriasFaciales", "detalles", e.target.value)}
                      placeholder="Descripción detallada de las asimetrías"
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Edema */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="edema-presente" 
                  checked={formData.examenCabeza.edema?.presente || false}
                  onCheckedChange={handleEdemaPresencia}
                />
                <Label htmlFor="edema-presente" className="text-base font-medium">Edema facial</Label>
              </div>
              
              {formData.examenCabeza.edema?.presente && (
                <div className="space-y-4 pl-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo de Edema</Label>
                      <Select 
                        value={formData.examenCabeza.edema?.tipoEdema || ""}
                        onValueChange={(value) => handleCaracteristicaChange("edema", "tipoEdema", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="localizado">Localizado</SelectItem>
                          <SelectItem value="difuso">Difuso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Dolor</Label>
                      <Select 
                        value={formData.examenCabeza.edema?.dolor || ""}
                        onValueChange={(value) => handleCaracteristicaChange("edema", "dolor", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar dolor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="presente">Presente</SelectItem>
                          <SelectItem value="ausente">Ausente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Consistencia</Label>
                      <Input 
                        type="text"
                        value={formData.examenCabeza.edema?.consistencia || ""}
                        onChange={(e) => handleCaracteristicaChange("edema", "consistencia", e.target.value)}
                        placeholder="Consistencia del edema"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Coloración</Label>
                      <Input 
                        type="text"
                        value={formData.examenCabeza.edema?.coloracion || ""}
                        onChange={(e) => handleCaracteristicaChange("edema", "coloracion", e.target.value)}
                        placeholder="Coloración del edema"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edema-detalles">Detalles adicionales</Label>
                    <Textarea 
                      id="edema-detalles" 
                      value={formData.examenCabeza.edema?.detalles || ""}
                      onChange={(e) => handleCaracteristicaChange("edema", "detalles", e.target.value)}
                      placeholder="Descripción detallada del edema"
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Otros hallazgos */}
            <div className="space-y-2">
              <Label htmlFor="otros-hallazgos">Otros hallazgos</Label>
              <Textarea 
                id="otros-hallazgos" 
                value={formData.examenCabeza.otrosHallazgos || ""}
                onChange={(e) => handleExamenCabezaChange("otrosHallazgos", e.target.value)}
                placeholder="Ingrese otros hallazgos relevantes"
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              onClick={handleGenerateReport} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando Redacción...
                </>
              ) : "Generar Redacción IA"}
            </Button>
          </CardFooter>
        </TabsContent>
        
        <TabsContent value="redaccion">
          <CardContent className="p-6">
            <div className="min-h-[200px] bg-gray-50 dark:bg-gray-900 p-4 rounded-md whitespace-pre-wrap" data-redaction-content>
              {redaccion.examenCabeza || "No se ha generado redacción aún. Complete el formulario y genere la redacción."}
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ExamenCabeza;
