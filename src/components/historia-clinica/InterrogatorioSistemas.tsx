import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { AparatoDigestivo } from "./AparatoDigestivo";
import { AparatoCardioRespiratorio } from "./AparatoCardioRespiratorio";
import { SistemaNervioso } from "./SistemaNervioso";
import { SistemaEndocrino } from "./SistemaEndocrino";
import { SistemaMusculoEsqueletico } from "./SistemaMusculoEsqueletico";
import { SistemaGenitourinario } from "./SistemaGenitourinario";

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

export function InterrogatorioSistemas() {
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
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
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
              <AccordionItem value="datosPersonales">
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
                    <FormField
                      control={form.control}
                      name="edad"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Edad</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Edad"
                              type="number"
                              {...field}
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
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="genero"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Género</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona" />
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
                            <Input placeholder="Email" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="antecedentesMedicosPersonales">
                <AccordionTrigger>Antecedentes Médicos Personales</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="enfermedadesPrevias"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Enfermedades Previas</FormLabel>
                          <FormControl>
                            <Input placeholder="Enfermedades Previas" {...field} />
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
                            <Input placeholder="Alergias" {...field} />
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
                            <Input placeholder="Medicamentos Actuales" {...field} />
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
                            <Input placeholder="Cirugías Previas" {...field} />
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
                            <Input placeholder="Hospitalizaciones Previas" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="transfusiones"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Transfusiones</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="estiloDeVida">
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
                                <SelectValue placeholder="Selecciona" />
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
                                <SelectValue placeholder="Selecciona" />
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
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="AparatoDigestivo">
                <AccordionTrigger>Aparato Digestivo</AccordionTrigger>
                <AccordionContent>
                  <AparatoDigestivo
                    form={form}
                    generarRedaccionAparatoDigestivo={generarRedaccionAparatoDigestivo}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="AparatoCardioRespiratorio">
                <AccordionTrigger>Aparato Cardio-Respiratorio</AccordionTrigger>
                <AccordionContent>
                  <AparatoCardioRespiratorio form={form} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="SistemaNervioso">
                <AccordionTrigger>Sistema Nervioso</AccordionTrigger>
                <AccordionContent>
                  <SistemaNervioso form={form} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="SistemaEndocrino">
                <AccordionTrigger>Sistema Endocrino</AccordionTrigger>
                <AccordionContent>
                  <SistemaEndocrino form={form} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="SistemaMusculoEsqueletico">
                <AccordionTrigger>Sistema Musculo-Esquelético</AccordionTrigger>
                <AccordionContent>
                  <SistemaMusculoEsqueletico form={form} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="SistemaGenitourinario">
                <AccordionTrigger>Sistema Genitourinario</AccordionTrigger>
                <AccordionContent>
                  <SistemaGenitourinario form={form} />
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
