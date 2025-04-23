import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const formSchema = z.object({
  // Datos personales
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  apellido: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres.",
  }),
  edad: z.number().min(0, {
    message: "La edad debe ser un número positivo.",
  }),
  fechaNacimiento: z.date(),
  genero: z.enum(['masculino', 'femenino', 'otro']),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email({
    message: "Por favor, introduce un email válido.",
  }).optional(),

  // Antecedentes médicos personales
  enfermedadesPrevias: z.string().optional(),
  alergias: z.string().optional(),
  medicamentosActuales: z.string().optional(),
  cirugiasPrevias: z.string().optional(),
  hospitalizacionesPrevias: z.string().optional(),
  transfusiones: z.boolean().default(false),

  // Estilo de vida
  tabaquismo: z.enum(['nunca', 'actual', 'pasado']).default('nunca'),
  alcoholismo: z.enum(['nunca', 'social', 'frecuente']).default('nunca'),
  actividadFisica: z.string().optional(),
  dieta: z.string().optional(),
  sueno: z.string().optional(),

  // Interrogatorio por aparatos y sistemas
  aparatoDigestivo: z.object({
    tipoAlimentacion: z.string().optional(),
    patronMasticacion: z.string().optional(),
    percepcionGusto: z.string().optional(),
    salivacion: z.string().optional(),
    dificultadDeglucion: z.enum(['sí', 'no']).default('no'),
    dolorDeglucion: z.enum(['sí', 'no']).default('no'),
    halitosis: z.enum(['sí', 'no']).default('no'),
    sintomasDigestivos: z.array(z.string()).optional(),
    frecuenciaEvacuacion: z.string().optional(),
  }).optional(),
  aparatoCardioRespiratorio: z.object({
    disnea: z.enum(['sí', 'no']).default('no'),
    dolorToracico: z.enum(['sí', 'no']).default('no'),
    tos: z.enum(['sí', 'no']).default('no'),
    expectoracion: z.enum(['sí', 'no']).default('no'),
    edemaMiembrosInferiores: z.enum(['sí', 'no']).default('no'),
    palpitaciones: z.enum(['sí', 'no']).default('no'),
  }).optional(),
  sistemaNervioso: z.object({
    cefalea: z.enum(['sí', 'no']).default('no'),
    mareos: z.enum(['sí', 'no']).default('no'),
    perdidaConocimiento: z.enum(['sí', 'no']).default('no'),
    alteracionesSensoriales: z.enum(['sí', 'no']).default('no'),
    debilidadMuscular: z.enum(['sí', 'no']).default('no'),
  }).optional(),
  sistemaEndocrino: z.object({
    intoleranciaCalorFrio: z.enum(['sí', 'no']).default('no'),
    cambiosPesoApetito: z.enum(['sí', 'no']).default('no'),
    sedExcesiva: z.enum(['sí', 'no']).default('no'),
    aumentoFrecuenciaUrina: z.enum(['sí', 'no']).default('no'),
    cambiosPielCabello: z.enum(['sí', 'no']).default('no'),
  }).optional(),
  sistemaMusculoEsqueletico: z.object({
    dolorArticular: z.enum(['sí', 'no']).default('no'),
    limitacionMovimiento: z.enum(['sí', 'no']).default('no'),
    debilidadMuscular: z.enum(['sí', 'no']).default('no'),
    inflamacionArticular: z.enum(['sí', 'no']).default('no'),
    rigidezMatutina: z.enum(['sí', 'no']).default('no'),
  }).optional(),
  sistemaGenitourinario: z.object({
    frecuenciaUrinaria: z.string().optional(),
    urgenciaUrinaria: z.enum(['sí', 'no']).default('no'),
    dolorAlOrinar: z.enum(['sí', 'no']).default('no'),
    sangreEnOrina: z.enum(['sí', 'no']).default('no'),
    incontinenciaUrinaria: z.enum(['sí', 'no']).default('no'),
  }).optional(),
});

function generarRedaccionAparatoDigestivo(datos: {
  tipoAlimentacion?: string;
  patronMasticacion?: string;
  percepcionGusto?: string;
  salivacion?: string;
  dificultadDeglucion?: "sí" | "no";
  dolorDeglucion?: "sí" | "no";
  halitosis?: "sí" | "no";
  sintomasDigestivos?: string[];
  frecuenciaEvacuacion?: string;
}) {
  const {
    tipoAlimentacion = "sin especificar",
    patronMasticacion = "sin especificar",
    percepcionGusto = "sin especificar",
    salivacion = "sin especificar",
    dificultadDeglucion = "no",
    dolorDeglucion = "no",
    halitosis = "no",
    sintomasDigestivos = [],
    frecuenciaEvacuacion = "sin especificar",
  } = datos;

  const todosNinguno =
    sintomasDigestivos.length === 0 ||
    sintomasDigestivos.every(
      (sintoma) => sintoma.toLowerCase() === "ninguno"
    );

  let parrafo = `El paciente refiere alimentación ${tipoAlimentacion} y patrón de masticación ${patronMasticacion}. `;
  parrafo += `Reporta ${percepcionGusto} en la percepción del gusto y salivación ${salivacion}. `;

  if (dificultadDeglucion === "sí" || dolorDeglucion === "sí") {
    parrafo += `Presenta dificultad o dolor al tragar. `;
  } else {
    parrafo += `No presenta dificultad ni dolor al tragar. `;
  }

  parrafo += halitosis === "sí" ? "Presenta halitosis. " : "No presenta halitosis. ";

  if (!todosNinguno) {
    const sintomasValidos = sintomasDigestivos.filter(
      (s) => s.toLowerCase() !== "ninguno"
    );
    if (sintomasValidos.length > 0) {
      parrafo += `Refirió ${sintomasValidos.join(" y ")}. `;
    }
  }

  parrafo += `La frecuencia de evacuación es de ${frecuenciaEvacuacion}. `;

  if (todosNinguno) {
    parrafo +=
      "El paciente niega alteraciones relacionadas al sistema digestivo. Se interrogó específicamente sobre distensión abdominal, estreñimiento, plenitud posprandial, pirosis, dolor abdominal, náuseas, vómito y reflujo.";
  }

  return parrafo.trim();
}

function InterrogatorioSistemas() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      edad: 0,
      fechaNacimiento: new Date(),
      genero: "masculino",
      direccion: "",
      telefono: "",
      email: "",
      enfermedadesPrevias: "",
      alergias: "",
      medicamentosActuales: "",
      cirugiasPrevias: "",
      hospitalizacionesPrevias: "",
      transfusiones: false,
      tabaquismo: "nunca",
      alcoholismo: "nunca",
      actividadFisica: "",
      dieta: "",
      sueno: "",
      aparatoDigestivo: {
        tipoAlimentacion: "",
        patronMasticacion: "",
        percepcionGusto: "",
        salivacion: "",
        dificultadDeglucion: "no",
        dolorDeglucion: "no",
        halitosis: "no",
        sintomasDigestivos: [],
        frecuenciaEvacuacion: "",
      },
      aparatoCardioRespiratorio: {
        disnea: "no",
        dolorToracico: "no",
        tos: "no",
        expectoracion: "no",
        edemaMiembrosInferiores: "no",
        palpitaciones: "no",
      },
      sistemaNervioso: {
        cefalea: "no",
        mareos: "no",
        perdidaConocimiento: "no",
        alteracionesSensoriales: "no",
        debilidadMuscular: "no",
      },
      sistemaEndocrino: {
        intoleranciaCalorFrio: "no",
        cambiosPesoApetito: "no",
        sedExcesiva: "no",
        aumentoFrecuenciaUrina: "no",
        cambiosPielCabello: "no",
      },
      sistemaMusculoEsqueletico: {
        dolorArticular: "no",
        limitacionMovimiento: "no",
        debilidadMuscular: "no",
        inflamacionArticular: "no",
        rigidezMatutina: "no",
      },
      sistemaGenitourinario: {
        frecuenciaUrinaria: "",
        urgenciaUrinaria: "no",
        dolorAlOrinar: "no",
        sangreEnOrina: "no",
        incontinenciaUrinaria: "no",
      },
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interrogatorio por Aparatos y Sistemas</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Accordion type="single" collapsible>
              <AccordionItem value="DatosPersonales">
                <AccordionTrigger>Datos Personales</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="apellido"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apellido</FormLabel>
                          <FormControl>
                            <Input placeholder="Apellido" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="edad"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Edad</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Edad"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fechaNacimiento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha de Nacimiento</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              value={field.value ? field.value.toISOString().split('T')[0] : ''}
                              onChange={(e) => field.onChange(new Date(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="genero"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Género</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un género" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="masculino">Masculino</SelectItem>
                              <SelectItem value="femenino">Femenino</SelectItem>
                              <SelectItem value="otro">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="direccion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dirección</FormLabel>
                          <FormControl>
                            <Input placeholder="Dirección" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="telefono"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <Input placeholder="Teléfono" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="AntecedentesMedicos">
                <AccordionTrigger>Antecedentes Médicos Personales</AccordionTrigger>
                <AccordionContent>
                  <FormField
                    control={form.control}
                    name="enfermedadesPrevias"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enfermedades Previas</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Listado de enfermedades previas"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="alergias"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alergias</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Listado de alergias"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medicamentosActuales"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medicamentos Actuales</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Listado de medicamentos actuales"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cirugiasPrevias"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cirugías Previas</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Listado de cirugías previas"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hospitalizacionesPrevias"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hospitalizaciones Previas</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Listado de hospitalizaciones previas"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="transfusiones"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Transfusiones</FormLabel>
                          <FormDescription>
                            ¿Ha recibido alguna transfusión de sangre?
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="EstiloDeVida">
                <AccordionTrigger>Estilo de Vida</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tabaquismo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tabaquismo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona una opción" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="nunca">Nunca</SelectItem>
                              <SelectItem value="actual">Actual</SelectItem>
                              <SelectItem value="pasado">Pasado</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="alcoholismo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alcoholismo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona una opción" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="nunca">Nunca</SelectItem>
                              <SelectItem value="social">Social</SelectItem>
                              <SelectItem value="frecuente">Frecuente</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="actividadFisica"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Actividad Física</FormLabel>
                        <FormControl>
                          <Input placeholder="Actividad Física" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dieta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dieta</FormLabel>
                        <FormControl>
                          <Input placeholder="Dieta" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sueno"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sueño</FormLabel>
                        <FormControl>
                          <Input placeholder="Sueño" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="AparatoDigestivo">
                <AccordionTrigger>Aparato Digestivo</AccordionTrigger>
                <AccordionContent>
                  <FormField
                    control={form.control}
                    name="aparatoDigestivo.tipoAlimentacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Alimentación</FormLabel>
                        <FormControl>
                          <Input placeholder="Tipo de Alimentación" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="aparatoDigestivo.patronMasticacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patrón de Masticación</FormLabel>
                        <FormControl>
                          <Input placeholder="Patrón de Masticación" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="aparatoDigestivo.percepcionGusto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Percepción del Gusto</FormLabel>
                        <FormControl>
                          <Input placeholder="Percepción del Gusto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="aparatoDigestivo.salivacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salivación</FormLabel>
                        <FormControl>
                          <Input placeholder="Salivación" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="aparatoDigestivo.dificultadDeglucion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dificultad al Deglutir</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sí">Sí</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="aparatoDigestivo.dolorDeglucion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dolor al Deglutir</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sí">Sí</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="aparatoDigestivo.halitosis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Halitosis</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sí">Sí</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="aparatoDigestivo.sintomasDigestivos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Síntomas Digestivos</FormLabel>
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="distension"
                              checked={field.value?.includes("Distensión Abdominal")}
                              onCheckedChange={(checked) => {
                                const value = checked
                                  ? [...(field.value || []), "Distensión Abdominal"]
                                  : field.value?.filter((v) => v !== "Distensión Abdominal")
                                field.onChange(value)
                              }}
                            />
                            <label
                              htmlFor="distension"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Distensión Abdominal
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="estrenimiento"
                              checked={field.value?.includes("Estreñimiento")}
                              onCheckedChange={(checked) => {
                                const value = checked
                                  ? [...(field.value || []), "Estreñimiento"]
                                  : field.value?.filter((v) => v !== "Estreñimiento")
                                field.onChange(value)
                              }}
                            />
                            <label
                              htmlFor="estrenimiento"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Estreñimiento
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="plenitud"
                              checked={field.value?.includes("Plenitud Posprandial")}
                              onCheckedChange={(checked) => {
                                const value = checked
                                  ? [...(field.value || []), "Plenitud Posprandial"]
                                  : field.value?.filter((v) => v !== "Plenitud Posprandial")
                                field.onChange(value)
                              }}
                            />
                            <label
                              htmlFor="plenitud"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Plenitud Posprandial
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="pirosis"
                              checked={field.value?.includes("Pirosis")}
                              onCheckedChange={(checked) => {
                                const value = checked
                                  ? [...(field.value || []), "Pirosis"]
                                  : field.value?.filter((v) => v !== "Pirosis")
                                field.onChange(value)
                              }}
                            />
                            <label
                              htmlFor="pirosis"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Pirosis
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="dolorAbdominal"
                              checked={field.value?.includes("Dolor Abdominal")}
                              onCheckedChange={(checked) => {
                                const value = checked
                                  ? [...(field.value || []), "Dolor Abdominal"]
                                  : field.value?.filter((v) => v !== "Dolor Abdominal")
                                field.onChange(value)
                              }}
                            />
                            <label
                              htmlFor="dolorAbdominal"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Dolor Abdominal
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="nauseas"
                              checked={field.value?.includes("Náuseas")}
                              onCheckedChange={(checked) => {
                                const value = checked
                                  ? [...(field.value || []), "Náuseas"]
                                  : field.value?.filter((v) => v !== "Náuseas")
                                field.onChange(value)
                              }}
                            />
                            <label
                              htmlFor="nauseas"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Náuseas
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="vomito"
                              checked={field.value?.includes("Vómito")}
                              onCheckedChange={(checked) => {
                                const value = checked
                                  ? [...(field.value || []), "Vómito"]
                                  : field.value?.filter((v) => v !== "Vómito")
                                field.onChange(value)
                              }}
                            />
                            <label
                              htmlFor="vomito"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Vómito
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="reflujo"
                              checked={field.value?.includes("Reflujo")}
                              onCheckedChange={(checked) => {
                                const value = checked
                                  ? [...(field.value || []), "Reflujo"]
                                  : field.value?.filter((v) => v !== "Reflujo")
                                field.onChange(value)
                              }}
                            />
                            <label
                              htmlFor="reflujo"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Reflujo
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="ninguno"
                              checked={field.value?.includes("Ninguno")}
                              onCheckedChange={(checked) => {
                                const value = checked
                                  ? [...(field.value || []), "Ninguno"]
                                  : field.value?.filter((v) => v !== "Ninguno")
                                field.onChange(value)
                              }}
                            />
                            <label
                              htmlFor="ninguno"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Ninguno
                            </label>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="aparatoDigestivo.frecuenciaEvacuacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frecuencia de Evacuación</FormLabel>
                        <FormControl>
                          <Input placeholder="Frecuencia de Evacuación" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="mt-4 p-4 bg-muted rounded-md">
                    <p>{generarRedaccionAparatoDigestivo(form.getValues("aparatoDigestivo"))}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="AparatoCardioRespiratorio">
                <AccordionTrigger>Aparato Cardio-Respiratorio</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="aparatoCardioRespiratorio.disnea"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Disnea</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sí">Sí</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </
