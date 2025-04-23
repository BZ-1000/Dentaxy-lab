
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AparatoCardioRespiratorioProps {
  form: any;
}

export const AparatoCardioRespiratorio: React.FC<AparatoCardioRespiratorioProps> = ({
  form,
}) => {
  return (
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
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="aparatoCardioRespiratorio.dolorToracico"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dolor Torácico</FormLabel>
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
        name="aparatoCardioRespiratorio.tos"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tos</FormLabel>
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
        name="aparatoCardioRespiratorio.expectoracion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Expectoración</FormLabel>
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
        name="aparatoCardioRespiratorio.edemaMiembrosInferiores"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Edema Miembros Inferiores</FormLabel>
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
        name="aparatoCardioRespiratorio.palpitaciones"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Palpitaciones</FormLabel>
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
  );
};
