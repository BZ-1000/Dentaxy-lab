
import React from 'react';
import { FileText, User, Heart, Users, Stethoscope, Brain, Activity, Calendar, Save, Download, Upload, RotateCcw } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export interface FormulariosSidebarProps {
  onCargarFormulario: (data: any, nombre: any) => void;
  onGuardarFormulario: (nombre: any) => void;
  onCerrarFormulario: () => void;
  onResetFormulario: () => void;
  pacienteActual: string;
}

const FormulariosSidebar = ({ 
  onCargarFormulario, 
  onGuardarFormulario, 
  onCerrarFormulario, 
  onResetFormulario, 
  pacienteActual 
}: FormulariosSidebarProps) => {
  const formularios = [
    { nombre: 'Información Principal', icono: User, color: 'text-blue-600' },
    { nombre: 'Padecimiento Actual', icono: FileText, color: 'text-green-600' },
    { nombre: 'Antecedentes Heredo Familiares', icono: Users, color: 'text-purple-600' },
    { nombre: 'Antecedentes Personales No Patológicos', icono: Heart, color: 'text-pink-600' },
    { nombre: 'Antecedentes Personales Patológicos', icono: Stethoscope, color: 'text-red-600' },
    { nombre: 'Antecedentes Alérgicos', icono: Activity, color: 'text-yellow-600' },
    { nombre: 'Antecedentes Quirúrgicos', icono: Brain, color: 'text-indigo-600' },
    { nombre: 'Antecedentes Hemorrágicos', icono: Activity, color: 'text-orange-600' },
    { nombre: 'Antecedentes Gineco Obstétricos', icono: Calendar, color: 'text-teal-600' },
    { nombre: 'Interrogatorio por Sistemas', icono: Stethoscope, color: 'text-gray-600' },
    { nombre: 'Exploración Física', icono: Activity, color: 'text-cyan-600' },
    { nombre: 'Examen de Cabeza', icono: Brain, color: 'text-lime-600' },
    { nombre: 'Examen de Cuello', icono: Activity, color: 'text-emerald-600' },
    { nombre: 'Examen Intrabucal', icono: FileText, color: 'text-rose-600' },
    { nombre: 'Glándulas Salivales', icono: Activity, color: 'text-violet-600' },
    { nombre: 'Articulación Craneomandibular', icono: Activity, color: 'text-amber-600' },
    { nombre: 'Oclusión', icono: FileText, color: 'text-slate-600' },
    { nombre: 'Relación de Dientes', icono: FileText, color: 'text-stone-600' },
    { nombre: 'Línea Media', icono: Activity, color: 'text-zinc-600' },
    { nombre: 'Frenillos', icono: Activity, color: 'text-neutral-600' },
    { nombre: 'Diagnóstico', icono: Stethoscope, color: 'text-sky-600' },
    { nombre: 'Pronóstico', icono: Brain, color: 'text-blue-500' },
  ];

  const acciones = [
    { nombre: 'Guardar', icono: Save, accion: () => onGuardarFormulario(pacienteActual), color: 'text-green-600' },
    { nombre: 'Cargar', icono: Upload, accion: () => {}, color: 'text-blue-600' },
    { nombre: 'Exportar', icono: Download, accion: () => {}, color: 'text-purple-600' },
    { nombre: 'Reset', icono: RotateCcw, accion: onResetFormulario, color: 'text-red-600' },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Formularios</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {formularios.map((formulario) => (
                <SidebarMenuItem key={formulario.nombre}>
                  <SidebarMenuButton>
                    <formulario.icono className={`h-4 w-4 ${formulario.color}`} />
                    <span>{formulario.nombre}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Acciones</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {acciones.map((accion) => (
                <SidebarMenuItem key={accion.nombre}>
                  <SidebarMenuButton onClick={accion.accion}>
                    <accion.icono className={`h-4 w-4 ${accion.color}`} />
                    <span>{accion.nombre}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default FormulariosSidebar;
