export interface ClinicaUAO {
  id: string;
  nombre: string;
  nombreCorto: string;
  subtitulo: string;
  ubicacion: string;
  tipo: 'integracion' | 'universitaria' | 'alto_flujo' | 'comunitaria';
  descripcion: string;
  horario: string;
  caracteristicasEspeciales: string[];
  coordenadas: { lat: number; lng: number };
  activa: boolean;
  badge?: string;
  // New fields for narrative
  narrativa: string;
  tagline: string;
  accentColor: 'emerald' | 'blue' | 'violet' | 'amber';
}

export const clinicasUAO: ClinicaUAO[] = [
  {
    id: 'climuzac',
    nombre: 'CLIMUZAC',
    nombreCorto: 'CLIMUZAC',
    subtitulo: 'Dentaxy × Smile',
    ubicacion: 'Begonias s/n, Col. Lázaro Cárdenas, Guadalupe',
    tipo: 'integracion',
    descripcion: 'Integración académica con sistema clínico existente. Dentaxy redacta, Smile recibe.',
    horario: 'Lunes a Viernes 8:00-14:00 · Sábado 8:00-13:00',
    caracteristicasEspeciales: [
      'Vista dividida Dentaxy + Smile',
      'Flujo de datos bidireccional',
      'Compatibilidad con sistemas legados'
    ],
    coordenadas: { lat: 22.7636, lng: -102.5052 },
    activa: true,
    badge: 'Integración Activa',
    narrativa: 'Donde dos sistemas convergen. Dentaxy redacta. Smile recibe. La coexistencia que transforma la práctica clínica institucional.',
    tagline: 'Integración institucional',
    accentColor: 'emerald'
  },
  {
    id: 'clizac',
    nombre: 'CLIZAC',
    nombreCorto: 'CLIZAC',
    subtitulo: 'Clínica Universitaria Central',
    ubicacion: 'Carretera a la Bufa, Campus UAZ',
    tipo: 'universitaria',
    descripcion: 'Flujo clínico estándar con estandarización completa y trazabilidad documental.',
    horario: 'Lunes a Viernes 8:00-20:00',
    caracteristicasEspeciales: [
      'Formulario clínico completo',
      'Vista previa documental',
      'Guardado institucional'
    ],
    coordenadas: { lat: 22.7744, lng: -102.5734 },
    activa: true,
    badge: 'Campus Central',
    narrativa: 'El estándar comienza aquí. Cada procedimiento documentado. Cada alumno trazable. El orden que define la excelencia académica.',
    tagline: 'Formación de élite',
    accentColor: 'blue'
  },
  {
    id: 'clicamp',
    nombre: 'CLICAMP',
    nombreCorto: 'CLICAMP',
    subtitulo: 'Campus Siglo XXI',
    ubicacion: 'Campus UAZ Siglo XXI, Módulo Clínico',
    tipo: 'alto_flujo',
    descripcion: 'Clínica de alto flujo con capacidad de escalabilidad entre sedes.',
    horario: 'Lunes a Viernes 7:00-21:00',
    caracteristicasEspeciales: [
      'Alto flujo de pacientes',
      'Sincronización entre sedes',
      'Mismo estándar clínico'
    ],
    coordenadas: { lat: 22.7589, lng: -102.5123 },
    activa: true,
    narrativa: 'Un sistema, múltiples sedes. La escalabilidad que prepara para el volumen real. Infraestructura sin límites operativos.',
    tagline: 'Alto rendimiento',
    accentColor: 'violet'
  },
  {
    id: 'clijanis',
    nombre: 'CLIJANIS',
    nombreCorto: 'CLIJANIS',
    subtitulo: 'Brigadas Comunitarias',
    ubicacion: 'Rotativo — Comunidades del Estado de Zacatecas',
    tipo: 'comunitaria',
    descripcion: 'Programas comunitarios, brigadas y atención odontopediátrica en jardines de niños.',
    horario: 'Según programación de brigadas',
    caracteristicasEspeciales: [
      'Formulario odontopediátrico',
      'Selector de ubicación',
      'Registro poblacional',
      'Censos epidemiológicos'
    ],
    coordenadas: { lat: 22.7700, lng: -102.5500 },
    activa: true,
    badge: 'Brigadas Activas',
    narrativa: 'Donde la comunidad se conecta. Censos que revelan patrones. Datos que transforman políticas. El impacto social medible.',
    tagline: 'Impacto comunitario',
    accentColor: 'amber'
  }
];

export const getClinicaById = (id: string): ClinicaUAO | undefined => {
  return clinicasUAO.find(clinica => clinica.id === id);
};
