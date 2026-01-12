export interface ClinicaUAO {
  id: string;
  nombre: string;
  nombreCorto: string;
  ubicacion: string;
  tipo: 'integracion' | 'universitaria' | 'alto_flujo' | 'comunitaria';
  descripcion: string;
  horario: string;
  caracteristicasEspeciales: string[];
  coordenadas: { lat: number; lng: number };
  activa: boolean;
  badge?: string;
  subtitulo: string;
}

export const clinicasUAO: ClinicaUAO[] = [
  {
    id: 'climuzac',
    nombre: 'CLIMUZAC',
    nombreCorto: 'CLIMUZAC',
    subtitulo: 'Dentaxy × Smile',
    ubicacion: 'Begonias s/n, Guadalupe',
    tipo: 'integracion',
    descripcion: 'Integración académica con sistema clínico existente. Dentaxy redacta, Smile recibe.',
    horario: 'Lunes a Viernes + Sábado',
    caracteristicasEspeciales: [
      'Vista dividida Dentaxy + Smile',
      'Flujo de datos bidireccional',
      'Compatibilidad con sistemas legados'
    ],
    coordenadas: { lat: 22.7636, lng: -102.5052 },
    activa: true,
    badge: 'Integración'
  },
  {
    id: 'clizac',
    nombre: 'CLIZAC',
    nombreCorto: 'CLIZAC',
    subtitulo: 'Clínica Universitaria',
    ubicacion: 'Carretera a la Bufa',
    tipo: 'universitaria',
    descripcion: 'Flujo clínico estándar con estandarización completa y trazabilidad documental.',
    horario: 'Lunes a Viernes + Sábado',
    caracteristicasEspeciales: [
      'Formulario clínico completo',
      'Vista previa documental',
      'Guardado institucional'
    ],
    coordenadas: { lat: 22.7744, lng: -102.5734 },
    activa: true
  },
  {
    id: 'clicamp',
    nombre: 'CLICAMP',
    nombreCorto: 'CLICAMP',
    subtitulo: 'Campus Siglo XXI',
    ubicacion: 'Campus Siglo XXI',
    tipo: 'alto_flujo',
    descripcion: 'Clínica de alto flujo con capacidad de escalabilidad entre sedes.',
    horario: 'Lunes a Sábado',
    caracteristicasEspeciales: [
      'Alto flujo de pacientes',
      'Sincronización entre sedes',
      'Mismo estándar clínico'
    ],
    coordenadas: { lat: 22.7589, lng: -102.5123 },
    activa: true,
    badge: 'Alto Flujo'
  },
  {
    id: 'clijanis',
    nombre: 'CLIJANIS',
    nombreCorto: 'CLIJANIS',
    subtitulo: 'Brigadas y Odontopediatría',
    ubicacion: 'Múltiples ubicaciones',
    tipo: 'comunitaria',
    descripcion: 'Programas comunitarios, brigadas y atención odontopediátrica en jardines de niños.',
    horario: 'Variable según programa',
    caracteristicasEspeciales: [
      'Formulario odontopediátrico',
      'Selector de ubicación',
      'Registro poblacional',
      'Censos epidemiológicos'
    ],
    coordenadas: { lat: 22.7700, lng: -102.5500 },
    activa: true,
    badge: 'Comunitario'
  }
];

export const getClinicaById = (id: string): ClinicaUAO | undefined => {
  return clinicasUAO.find(clinica => clinica.id === id);
};
