import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

const HistoriaClinica = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    // Información General
    fechaCreacion: '',
    autorizo: '',
    pacienteId: '',
    pacienteNombre: '',
    alumno: '',
    
    // A. General
    padecimientoActual: {
      sinSintomas: false,
      fechaAparicion: '',
      evolucion: '',
      estadoActual: '',
      dolor: {
        fechaInicio: '',
        condicionAparicion: '', // 'provocado' | 'espontaneo'
        frecuencia: '', // 'intermitente' | 'continuo'
        caracter: '', // 'pulsatil' | 'sordo' | 'quemante' | 'opresivo'
        localizacion: {
          tipo: '', // 'localizado' | 'irradiado'
          descripcion: ''
        },
        atenuacion: ''
      }
    },
    
    // Antecedentes Heredo Familiares
    padre: '',
    madre: '',
    abueloPaterno: '',
    abuelaPaterna: '',
    abueloMaterno: '',
    abuelaMaterna: '',
    tios: '',
    hermanos: '',
    enfermedadesCronicasFamiliares: '',
    
    // A.1 Antecedentes Personales No Patológicos
    serviciosDomiciliarios: '',
    pisosVivienda: '',
    materialVivienda: '',
    materialPiso: '',
    ventilacion: '',
    frecuenciaLimpieza: '',
    hacinamiento: '',
    frecuenciaBano: '',
    higieneBucal: {
      frecuenciaCepillado: '',
      usoHiloDental: '',
      tipoCerdas: '',
      cantidadPasta: '',
      marcaPasta: '',
    },
    alimentacion: {
      tipoDieta: '',
      frecuenciaComidas: '',
      tiposAlimentos: '',
      saltaComidas: '',
      consumoNutritivo: '',
    },
    grupoSanguineo: '',
    factorRh: '',
    inmunizaciones: '',
    
    // A.2 Antecedentes Personales Patológicos
    nutricionales: '',
    cardiacos: '',
    hepaticos: '',
    enfermedadesTransmisionSexual: '',
    
    // A.3 Antecedentes Alérgicos
    alergias: '',
    anestesia: '',
    reaccionesAdversas: '',
    adicciones: '',
    
    // A.4 Antecedentes Médicos y Quirúrgicos
    tratamientoReciente: '',
    hospitalizacionReciente: '',
    medicamentosActuales: '',
    
    // A.5 Antecedentes Hemorrágicos
    transfusiones: '',
    
    // A.6 Antecedentes Gineco-Obstétricos
    embarazos: '',
    partos: '',
    cesareas: '',
    abortos: '',
    complicaciones: '',
    
    // B. Interrogatorio por Aparatos y Sistemas
    digestivo: {
      dieta: '',
      masticacion: '',
      alteracionesGusto: '',
      dificultadesDeglutir: '',
      problemasGastricos: '',
      evacuaciones: '',
    },
    respiratorio: {
      tipoRespiracion: '',
      problemaRespiratorio: '',
      dolorToracico: '',
    },
    cardiovascular: {
      dolorPrecordial: '',
      lipotimia: '',
      taquicardia: '',
      observaciones: '',
    },
    
    // C. Exploración Física
    peso: '',
    imc: '',
    talla: '',
    presionArterial: '',
    pulso: '',
    frecuenciaCardiaca: '',
    frecuenciaRespiratoria: '',
    temperatura: '',
    
    // D. Articulación Craneomandibular
    dolorMasticar: '',
    dificultadHablar: '',
    ruidoArticular: '',
    patronAbertura: '',
    observacionesArticulacion: '',
    
    // E. Examen Intrabucal
    mucosas: {
      mejillas: '',
      lengua: '',
      pisoBoca: '',
      regionRetromolar: '',
      paladar: '',
      orofaringe: '',
      encias: '',
      istmoFauces: '',
    },
    
    // Diagnóstico y Pronóstico
    diagnosticos: '',
    pronosticos: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePadecimientoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      padecimientoActual: {
        ...prev.padecimientoActual,
        [field]: value
      }
    }));
  };

  const handleDolorChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      padecimientoActual: {
        ...prev.padecimientoActual,
        dolor: {
          ...prev.padecimientoActual.dolor,
          [field]: value
        }
      }
    }));
  };

  const handleSinSintomasChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      padecimientoActual: {
        ...prev.padecimientoActual,
        sinSintomas: checked
      }
    }));
  };

  const generarResumen = async () => {
    const resumenGenerado = `
      HISTORIA CLÍNICA ODONTOLÓGICA
      
      Fecha de creación: ${formData.fechaCreacion}
      Autorizó: ${formData.autorizo}
      Paciente: ${formData.pacienteId} - ${formData.pacienteNombre}
      Alumno: ${formData.alumno}
      
      PADECIMIENTO ACTUAL:
      ${formData.padecimientoActual.sinSintomas ? "Actualmente no refiere sintomatología" : `
      Fecha de aparición: ${formData.padecimientoActual.fechaAparicion}
      Evolución: ${formData.padecimientoActual.evolucion}
      Estado Actual: ${formData.padecimientoActual.estadoActual}
      Dolor: 
        Fecha de inicio: ${formData.padecimientoActual.dolor.fechaInicio}
        Condición de aparición: ${formData.padecimientoActual.dolor.condicionAparicion}
        Frecuencia: ${formData.padecimientoActual.dolor.frecuencia}
        Carácter: ${formData.padecimientoActual.dolor.caracter}
        Localización: ${formData.padecimientoActual.dolor.localizacion.tipo} - ${formData.padecimientoActual.dolor.localizacion.descripcion}
        Atenuación: ${formData.padecimientoActual.dolor.atenuacion}
      `}
      
      ANTECEDENTES HEREDO FAMILIARES:
      Padre: ${formData.padre}
      Madre: ${formData.madre}
      
      SIGNOS VITALES:
      Peso: ${formData.peso} kg
      Talla: ${formData.talla} m
      IMC: ${formData.imc}
      Presión Arterial: ${formData.presionArterial}
      
      DIAGNÓSTICOS:
      ${formData.diagnosticos}
      
      PRONÓSTICOS:
      ${formData.pronosticos}
    `;
    
    setResumen(resumenGenerado);
    toast({
      title: "Historia Clínica Generada",
      description: "El resumen de la historia clínica ha sido generado exitosamente.",
    });
  };

  const [resumen, setResumen] = useState('');

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">Historia Clínica Odontológica</h1>
      <h2 className="text-2xl font-semibold mb-4 text-center">Universidad Autónoma de Zacatecas</h2>
      
      <div className="grid gap-8">
        {/* Información General */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Información General</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="fechaCreacion">Fecha de Creación</Label>
              <Input
                id="fechaCreacion"
                name="fechaCreacion"
                type="date"
                value={formData.fechaCreacion}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="autorizo">Autorizó</Label>
              <Input
                id="autorizo"
                name="autorizo"
                value={formData.autorizo}
                onChange={handleInputChange}
                placeholder="Nombre del autorizante"
              />
            </div>
            <div>
              <Label htmlFor="pacienteId">ID Paciente</Label>
              <Input
                id="pacienteId"
                name="pacienteId"
                value={formData.pacienteId}
                onChange={handleInputChange}
                placeholder="Número de identificación"
              />
            </div>
            <div>
              <Label htmlFor="pacienteNombre">Nombre del Paciente</Label>
              <Input
                id="pacienteNombre"
                name="pacienteNombre"
                value={formData.pacienteNombre}
                onChange={handleInputChange}
                placeholder="Nombre completo"
              />
            </div>
          </div>
        </Card>

        {/* Padecimiento Actual - Updated Section */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Padecimiento Actual</h3>
          
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sinSintomas"
                checked={formData.padecimientoActual.sinSintomas}
                onCheckedChange={handleSinSintomasChange}
              />
              <Label htmlFor="sinSintomas">Actualmente no refiere sintomatología</Label>
            </div>
          </div>

          {!formData.padecimientoActual.sinSintomas && (
            <div className="space-y-4">
              <div>
                <Label>Fecha de aparición del síntoma principal</Label>
                <Input
                  type="date"
                  value={formData.padecimientoActual.fechaAparicion}
                  onChange={(e) => handlePadecimientoChange('fechaAparicion', e.target.value)}
                />
              </div>

              <div>
                <Label>Evolución</Label>
                <Textarea
                  value={formData.padecimientoActual.evolucion}
                  onChange={(e) => handlePadecimientoChange('evolucion', e.target.value)}
                  placeholder="Describa la evolución de los síntomas"
                />
              </div>

              <div>
                <Label>Estado Actual</Label>
                <Textarea
                  value={formData.padecimientoActual.estadoActual}
                  onChange={(e) => handlePadecimientoChange('estadoActual', e.target.value)}
                  placeholder="Describa el estado actual de los síntomas"
                />
              </div>

              {/* Sección de Dolor */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="text-lg font-semibold">Características del Dolor</h4>
                
                <div>
                  <Label>Fecha de inicio del dolor</Label>
                  <Input
                    type="date"
                    value={formData.padecimientoActual.dolor.fechaInicio}
                    onChange={(e) => handleDolorChange('fechaInicio', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Condición de aparición</Label>
                  <RadioGroup
                    value={formData.padecimientoActual.dolor.condicionAparicion}
                    onValueChange={(value) => handleDolorChange('condicionAparicion', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="provocado" id="provocado" />
                      <Label htmlFor="provocado">Provocado</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="espontaneo" id="espontaneo" />
                      <Label htmlFor="espontaneo">Espontáneo</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Frecuencia</Label>
                  <RadioGroup
                    value={formData.padecimientoActual.dolor.frecuencia}
                    onValueChange={(value) => handleDolorChange('frecuencia', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="intermitente" id="intermitente" />
                      <Label htmlFor="intermitente">Intermitente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="continuo" id="continuo" />
                      <Label htmlFor="continuo">Continuo</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Carácter del dolor</Label>
                  <RadioGroup
                    value={formData.padecimientoActual.dolor.caracter}
                    onValueChange={(value) => handleDolorChange('caracter', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pulsatil" id="pulsatil" />
                      <Label htmlFor="pulsatil">Pulsátil</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sordo" id="sordo" />
                      <Label htmlFor="sordo">Sordo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="quemante" id="quemante" />
                      <Label htmlFor="quemante">Quemante</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="opresivo" id="opresivo" />
                      <Label htmlFor="opresivo">Opresivo</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Localización del dolor</Label>
                  <RadioGroup
                    value={formData.padecimientoActual.dolor.localizacion.tipo}
                    onValueChange={(value) => {
                      setFormData(prev => ({
                        ...prev,
                        padecimientoActual: {
                          ...prev.padecimientoActual,
                          dolor: {
                            ...prev.padecimientoActual.dolor,
                            localizacion: {
                              ...prev.padecimientoActual.dolor.localizacion,
                              tipo: value
                            }
                          }
                        }
                      }));
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="localizado" id="localizado" />
                      <Label htmlFor="localizado">Localizado</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="irradiado" id="irradiado" />
                      <Label htmlFor="irradiado">Irradiado</Label>
                    </div>
                  </RadioGroup>
                  <Input
                    className="mt-2"
                    placeholder="Descripción de la localización"
                    value={formData.padecimientoActual.dolor.localizacion.descripcion}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        padecimientoActual: {
                          ...prev.padecimientoActual,
                          dolor: {
                            ...prev.padecimientoActual.dolor,
                            localizacion: {
                              ...prev.padecimientoActual.dolor.localizacion,
                              descripcion: e.target.value
                            }
                          }
                        }
                      }));
                    }}
                  />
                </div>

                <div>
                  <Label>Atenuación</Label>
                  <Textarea
                    value={formData.padecimientoActual.dolor.atenuacion}
                    onChange={(e) => handleDolorChange('atenuacion', e.target.value)}
                    placeholder="Condiciones que exacerban o disminuyen el dolor"
                  />
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Antecedentes Heredo Familiares */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Antecedentes Heredo Familiares</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="padre">Padre</Label>
              <Input
                id="padre"
                name="padre"
                value={formData.padre}
                onChange={handleInputChange}
                placeholder="Estado de salud del padre"
              />
            </div>
            <div>
              <Label htmlFor="madre">Madre</Label>
              <Input
                id="madre"
                name="madre"
                value={formData.madre}
                onChange={handleInputChange}
                placeholder="Estado de salud de la madre"
              />
            </div>
          </div>
        </Card>

        {/* Signos Vitales */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Signos Vitales</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input
                id="peso"
                name="peso"
                type="number"
                value={formData.peso}
                onChange={handleInputChange}
                placeholder="Peso en kilogramos"
              />
            </div>
            <div>
              <Label htmlFor="talla">Talla (m)</Label>
              <Input
                id="talla"
                name="talla"
                type="number"
                step="0.01"
                value={formData.talla}
                onChange={handleInputChange}
                placeholder="Altura en metros"
              />
            </div>
            <div>
              <Label htmlFor="presionArterial">Presión Arterial</Label>
              <Input
                id="presionArterial"
                name="presionArterial"
                value={formData.presionArterial}
                onChange={handleInputChange}
                placeholder="mmHg"
              />
            </div>
          </div>
        </Card>

        {/* Diagnóstico y Pronóstico */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Diagnóstico y Pronóstico</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="diagnosticos">Diagnósticos</Label>
              <Textarea
                id="diagnosticos"
                name="diagnosticos"
                value={formData.diagnosticos}
                onChange={handleInputChange}
                placeholder="Diagnósticos"
                className="h-32"
              />
            </div>
            <div>
              <Label htmlFor="pronosticos">Pronósticos</Label>
              <Textarea
                id="pronosticos"
                name="pronosticos"
                value={formData.pronosticos}
                onChange={handleInputChange}
                placeholder="Pronósticos"
                className="h-32"
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-8 flex justify-center">
        <Button 
          onClick={generarResumen}
          className="bg-primary hover:bg-primary/90"
        >
          Generar Historia Clínica
        </Button>
      </div>

      {resumen && (
        <Card className="mt-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Historia Clínica Generada</h2>
          <div className="whitespace-pre-line bg-gray-50 p-4 rounded-lg">
            {resumen}
          </div>
        </Card>
      )}
    </div>
  );
};

export default HistoriaClinica;
