
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AparatoDigestivoProps {
  form: any; // form instance from react-hook-form, typed in parent.
  generarRedaccionAparatoDigestivo: (datos: any) => string; // formatter function from parent.
}

export const AparatoDigestivo: React.FC<AparatoDigestivoProps> = ({
  form,
  generarRedaccionAparatoDigestivo,
}) => {
  return (
    <>
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
              {[
                "Distensión Abdominal",
                "Estreñimiento",
                "Plenitud Posprandial",
                "Pirosis",
                "Dolor Abdominal",
                "Náuseas",
                "Vómito",
                "Reflujo",
                "Ninguno",
              ].map((sintoma) => (
                <div key={sintoma} className="flex items-center space-x-2">
                  <Checkbox
                    id={sintoma.toLowerCase().replace(/\s/g, "")}
                    checked={field.value?.includes(sintoma)}
                    onCheckedChange={(checked) => {
                      const value = checked
                        ? [...(field.value || []), sintoma]
                        : field.value?.filter((v: string) => v !== sintoma);
                      field.onChange(value);
                    }}
                  />
                  <label
                    htmlFor={sintoma.toLowerCase().replace(/\s/g, "")}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {sintoma}
                  </label>
                </div>
              ))}
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
    </>
  );
};

