/**
 * uaoMockData.ts
 * Datos reales y de demostración para DentaXy UAO Sync
 * Información basada en datos oficiales de la UAO — Universidad Autónoma de Zacatecas
 * Contacto oficial: uaodontologia@uaz.edu.mx · Tel: 492 923 1580
 */

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────────

export type RolId = 'director' | 'coordinador' | 'jefe' | 'docente' | 'alumno' | 'administrativo' | 'paciente';
export type NodoId = 'climuzac' | 'clizac' | 'clicamp' | 'clitacobor' | 'clijani' | 'especialidad';
export type EstadoNodo = 'activo' | 'incidencia' | 'cerrado';
export type EstadoPaciente = 'activo' | 'tratamiento' | 'alta' | 'espera';
export type EstadoCita = 'programada' | 'confirmada' | 'en_consulta' | 'completada' | 'cancelada' | 'no_show';

// ─────────────────────────────────────────────────────────────────────────────
// ROLES DEL SISTEMA
// ─────────────────────────────────────────────────────────────────────────────

export interface Rol {
  id: RolId;
  nombre: string;
  nombreCorto: string;
  descripcion: string;
  color: string;
  colorBg: string;
  colorRing: string;
  iniciales: string;
  icono: string;
  permisos: string[];
  restringido: string[];
  modulos: string[];
}

export const ROLES: Rol[] = [
  {
    id: 'director',
    nombre: 'Director General',
    nombreCorto: 'Director',
    descripcion: 'Supervisión total del sistema UAO. Acceso a todas las clínicas, finanzas y reportes institucionales.',
    color: '#B45309',
    colorBg: 'bg-amber-50 dark:bg-amber-950/30',
    colorRing: 'ring-amber-400',
    iniciales: 'DG',
    icono: '🏛️',
    permisos: ['Ver todas las clínicas', 'Reportes institucionales', 'Aprobar contratos', 'Gestión de personal', 'Finanzas globales', 'Configuración del sistema', 'Exportar a Rectoría UAZ'],
    restringido: [],
    modulos: ['director', 'nodos', 'reportes', 'finanzas', 'personal'],
  },
  {
    id: 'coordinador',
    nombre: 'Coordinador Académico',
    nombreCorto: 'Coordinador',
    descripcion: 'Control escolar, carga académica docente, plan SEM y evaluaciones institucionales.',
    color: '#1D4ED8',
    colorBg: 'bg-blue-50 dark:bg-blue-950/30',
    colorRing: 'ring-blue-400',
    iniciales: 'CA',
    icono: '📚',
    permisos: ['Carga académica docentes', 'Calendarios y semestres', 'Evaluación docente', 'Plan de estudios SEM', 'Ver clínicas (lectura)', 'Ver finanzas (lectura)'],
    restringido: ['Modificar finanzas', 'Configuración del sistema'],
    modulos: ['coordinador', 'nodos', 'reportes', 'personal'],
  },
  {
    id: 'jefe',
    nombre: 'Jefe de Clínica',
    nombreCorto: 'Jefe Clínica',
    descripcion: 'Supervisión completa del nodo asignado: pacientes, alumnos, inventario y bitácora diaria.',
    color: '#065F46',
    colorBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    colorRing: 'ring-emerald-400',
    iniciales: 'JC',
    icono: '🏥',
    permisos: ['Supervisar expedientes de su nodo', 'Aprobar historias clínicas', 'Asignar pacientes a alumnos', 'Inventario de su clínica', 'Bitácora diaria', 'Ver reportes de su nodo'],
    restringido: ['Otras clínicas', 'Finanzas globales'],
    modulos: ['jefe', 'nodos', 'inventario'],
  },
  {
    id: 'docente',
    nombre: 'Docente Clínico',
    nombreCorto: 'Docente',
    descripcion: 'Gestión de su grupo de alumnos, firma de historias clínicas y calificación de procedimientos.',
    color: '#4C1D95',
    colorBg: 'bg-violet-50 dark:bg-violet-950/30',
    colorRing: 'ring-violet-400',
    iniciales: 'DO',
    icono: '👨‍🏫',
    permisos: ['Ver expedientes de sus alumnos', 'Firmar y validar historias', 'Calificar procedimientos', 'Registrar notas de supervisión', 'Ver agenda de su grupo'],
    restringido: ['Expedientes de otros grupos', 'Administración financiera'],
    modulos: ['docente'],
  },
  {
    id: 'alumno',
    nombre: 'Alumno Clínico',
    nombreCorto: 'Alumno',
    descripcion: 'Acceso a sus pacientes asignados, creación de expedientes, historia clínica y agenda personal.',
    color: '#166534',
    colorBg: 'bg-green-50 dark:bg-green-950/30',
    colorRing: 'ring-green-400',
    iniciales: 'AL',
    icono: '🦷',
    permisos: ['Crear y editar sus expedientes', 'Odontograma + periodontograma', 'Plan de tratamiento', 'Agenda de sus pacientes', 'Ver su historial académico clínico'],
    restringido: ['Expedientes de otros alumnos', 'Finanzas y administración'],
    modulos: ['alumno'],
  },
  {
    id: 'administrativo',
    nombre: 'Administrativo',
    nombreCorto: 'Recepción',
    descripcion: 'Registro de pacientes nuevos, gestión de agenda general de la clínica y cobros.',
    color: '#374151',
    colorBg: 'bg-gray-50 dark:bg-gray-900/30',
    colorRing: 'ring-gray-400',
    iniciales: 'AD',
    icono: '🗂️',
    permisos: ['Registro de pacientes nuevos', 'Agenda general de la clínica', 'Cobros y recibos', 'Inventario básico', 'Ver expedientes (lectura)'],
    restringido: ['Historial clínico detallado', 'Reportes académicos'],
    modulos: ['administrativo'],
  },
  {
    id: 'paciente',
    nombre: 'Paciente',
    nombreCorto: 'Paciente',
    descripcion: 'Portal propio: consulta su expediente, citas, plan de tratamiento y estado de cuenta.',
    color: '#9D174D',
    colorBg: 'bg-rose-50 dark:bg-rose-950/30',
    colorRing: 'ring-rose-400',
    iniciales: 'PA',
    icono: '👤',
    permisos: ['Ver su expediente completo', 'Historial de tratamientos', 'Estado de su plan de tratamiento', 'Agendar / confirmar citas', 'Ver y pagar sus cobros'],
    restringido: ['Expedientes de otros pacientes', 'Módulos clínicos y académicos'],
    modulos: ['paciente'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// NODOS CLÍNICOS (información real UAO UAZ)
// ─────────────────────────────────────────────────────────────────────────────

export interface SubUnidad {
  id: string;
  nombre: string;
  descripcion: string;
  sillones: number;
  silloneActivos: number;
}

export interface JardinNinos {
  id: string;
  nombre: string;
  alumnos: number;
  ultimaVisita: string;
  proximaVisita: string;
  estado: 'activo' | 'pendiente' | 'completado';
}

export interface NodoClinico {
  id: NodoId;
  nombre: string;
  nombreCompleto: string;
  descripcion: string;
  direccion: string;
  horario: string;
  telefono: string;
  estado: EstadoNodo;
  color: string;
  colorBg: string;
  colorAccent: string;
  sillones: number;
  silloneActivos: number;
  alumnosActivos: number;
  pacientesHoy: number;
  tieneSubUnidades: boolean;
  subUnidades?: SubUnidad[];
  jardines?: JardinNinos[];
  incidencia?: string;
  badge?: string;
  esEspecialidad?: boolean;
}

export const NODOS: NodoClinico[] = [
  {
    id: 'climuzac',
    nombre: 'CLIMUZAC',
    nombreCompleto: 'Clínica Multidisciplinaria Zacatecas',
    descripcion: 'Clínica principal de la UAO. Dos unidades operando en el campus de Guadalupe con atención integral a la comunidad.',
    direccion: 'Calle Begonias s/n, Col. Centro, Guadalupe, Zac.',
    horario: 'Lun–Vie 9:00–13:00 / 15:00–19:00 · Sáb 9:00–17:00',
    telefono: '492 923 1580',
    estado: 'activo',
    color: '#059669',
    colorBg: 'from-emerald-500 to-teal-600',
    colorAccent: 'emerald',
    sillones: 24,
    silloneActivos: 21,
    alumnosActivos: 48,
    pacientesHoy: 36,
    tieneSubUnidades: true,
    subUnidades: [
      { id: 'climuzac-1', nombre: 'CLIMUZAC I', descripcion: 'Clínica principal — planta baja', sillones: 12, silloneActivos: 11 },
      { id: 'climuzac-2', nombre: 'CLIMUZAC II', descripcion: 'Segunda unidad — primer piso', sillones: 12, silloneActivos: 10 },
    ],
    badge: 'Nodo Principal',
  },
  {
    id: 'clizac',
    nombre: 'CLIZAC',
    nombreCompleto: 'Clínica Zacatecas',
    descripcion: 'Ubicada junto a la Facultad de Ingeniería en la Carretera a La Bufa. Nodo universitario de alta demanda.',
    direccion: 'Carretera a la Bufa S/N, junto a Fac. de Ingeniería, Zacatecas',
    horario: 'Lun–Vie 9:00–13:00 / 15:00–19:00 · Sáb 9:00–17:00',
    telefono: '492 923 1580',
    estado: 'activo',
    color: '#2563EB',
    colorBg: 'from-blue-500 to-indigo-600',
    colorAccent: 'blue',
    sillones: 14,
    silloneActivos: 14,
    alumnosActivos: 32,
    pacientesHoy: 22,
    tieneSubUnidades: false,
    badge: 'Campus La Bufa',
  },
  {
    id: 'clicamp',
    nombre: 'CLICAMP',
    nombreCompleto: 'Clínica Campus Siglo XXI',
    descripcion: 'El nodo más moderno de la UAO, ubicado en el Campus Siglo XXI. Infraestructura de última generación.',
    direccion: 'Campus Siglo XXI, Carretera Zac–Guadalajara Km 6, Ejido La Escondida. CP 98160',
    horario: 'Lun–Sáb 9:00–17:00',
    telefono: '492 923 1580',
    estado: 'activo',
    color: '#7C3AED',
    colorBg: 'from-violet-500 to-purple-600',
    colorAccent: 'violet',
    sillones: 18,
    silloneActivos: 16,
    alumnosActivos: 40,
    pacientesHoy: 28,
    tieneSubUnidades: false,
    badge: 'Campus Siglo XXI',
  },
  {
    id: 'clitacobor',
    nombre: 'CLITACO y CLIBOR',
    nombreCompleto: 'Clínica Tacoaleche y Clínica Bordes',
    descripcion: 'Dos clínicas comunitarias complementarias en el área de Tacoaleche y Bordes. Enfoque en atención preventiva y social.',
    direccion: 'Tacoaleche, Guadalupe, Zacatecas',
    horario: 'Lun–Vie 9:00–17:00',
    telefono: '492 923 1580',
    estado: 'incidencia',
    color: '#D97706',
    colorBg: 'from-amber-500 to-orange-600',
    colorAccent: 'amber',
    sillones: 10,
    silloneActivos: 8,
    alumnosActivos: 20,
    pacientesHoy: 14,
    tieneSubUnidades: true,
    subUnidades: [
      { id: 'clitaco', nombre: 'CLITACO', descripcion: 'Clínica Tacoaleche — atención comunitaria', sillones: 5, silloneActivos: 5 },
      { id: 'clibor', nombre: 'CLIBOR', descripcion: 'Clínica Bordes — servicios preventivos', sillones: 5, silloneActivos: 3 },
    ],
    incidencia: '2 sillones CLIBOR en mantenimiento preventivo',
    badge: 'Clínica Comunitaria',
  },
  {
    id: 'clijani',
    nombre: 'CLIJANI',
    nombreCompleto: 'Clínicas en Jardines de Niños',
    descripcion: 'Red de 9 jardines de niños con programa de atención odontológica preventiva. Convenios institucionales SEP.',
    direccion: 'Zona metropolitana de Zacatecas — Convenios con jardines de niños',
    horario: 'Visitas programadas — según calendario SEP',
    telefono: '492 923 1580',
    estado: 'activo',
    color: '#DB2777',
    colorBg: 'from-pink-500 to-rose-600',
    colorAccent: 'rose',
    sillones: 0,
    silloneActivos: 0,
    alumnosActivos: 18,
    pacientesHoy: 0,
    tieneSubUnidades: false,
    jardines: [
      { id: 'jn-1', nombre: 'J.N. Carmen Ramos del Río', alumnos: 42, ultimaVisita: '2026-03-15', proximaVisita: '2026-04-12', estado: 'activo' },
      { id: 'jn-2', nombre: 'J.N. Miguel Auza', alumnos: 38, ultimaVisita: '2026-03-18', proximaVisita: '2026-04-14', estado: 'activo' },
      { id: 'jn-3', nombre: 'J.N. María Enriqueta', alumnos: 45, ultimaVisita: '2026-03-20', proximaVisita: '2026-04-16', estado: 'activo' },
      { id: 'jn-4', nombre: 'J.N. Ignacio Hierro', alumnos: 35, ultimaVisita: '2026-02-28', proximaVisita: '2026-04-24', estado: 'pendiente' },
      { id: 'jn-5', nombre: 'J.N. Amado Nervo', alumnos: 40, ultimaVisita: '2026-03-05', proximaVisita: '2026-04-18', estado: 'activo' },
      { id: 'jn-6', nombre: 'J.N. Enrique C. Rébsamen', alumnos: 50, ultimaVisita: '2026-03-10', proximaVisita: '2026-04-22', estado: 'pendiente' },
      { id: 'jn-7', nombre: 'J.N. Revolución', alumnos: 33, ultimaVisita: '2026-03-22', proximaVisita: '2026-04-26', estado: 'activo' },
      { id: 'jn-8', nombre: 'J.N. Francisco González Bocanegra', alumnos: 28, ultimaVisita: '2026-04-01', proximaVisita: '2026-04-29', estado: 'activo' },
      { id: 'jn-9', nombre: 'J.N. Josefa Ortiz de Domínguez', alumnos: 44, ultimaVisita: '2026-03-25', proximaVisita: '2026-05-02', estado: 'completado' },
    ],
    badge: '9 Jardines de Niños',
  },
  {
    id: 'especialidad',
    nombre: 'Especialidad',
    nombreCompleto: 'Especialidad en Odontopediatría — CLIO',
    descripcion: 'Posgrado en Odontopediatría, fundado en 1992. El único posgrado de la UAO. Convenios con APAC y AMANC.',
    direccion: 'Campus principal UAO — Calle Begonias s/n, Guadalupe, Zac.',
    horario: 'Lun–Vie 9:00–19:00',
    telefono: '492 923 1580',
    estado: 'activo',
    color: '#DC2626',
    colorBg: 'from-red-500 to-rose-700',
    colorAccent: 'red',
    sillones: 8,
    silloneActivos: 8,
    alumnosActivos: 6,
    pacientesHoy: 12,
    tieneSubUnidades: false,
    badge: 'Posgrado · Única en la UAZ',
    esEspecialidad: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PLAN SEM — DATOS CURRICULARES REALES UAO
// ─────────────────────────────────────────────────────────────────────────────

export const MODULOS_SEM = [
  { num: 'I',   nombre: 'Comunidad', eje: 'Diagnóstico situacional comunitario', semestres: '1–2', color: 'emerald' },
  { num: 'II',  nombre: 'Grupo Social Niños', eje: 'Atención primaria en infantes', semestres: '3–4', color: 'blue' },
  { num: 'III', nombre: 'Binomio Materno-Infantil', eje: 'Atención a embarazadas y neonatos', semestres: '5–6', color: 'violet' },
  { num: 'IV',  nombre: 'Adolescente, Adulto y Senecto', eje: 'Atención integral del adulto', semestres: '7–8', color: 'amber' },
  { num: 'V',   nombre: 'Comunidad Final', eje: 'Gestión y epidemiología comunitaria', semestres: '9–10', color: 'rose' },
];

// ─────────────────────────────────────────────────────────────────────────────
// PACIENTES DEMO
// ─────────────────────────────────────────────────────────────────────────────

export interface PacienteDemo {
  id: string;
  nombre: string;
  edad: number;
  curp: string;
  diagnosticoPrincipal: string;
  alumnoAsignado: string;
  docenteSupervisor: string;
  nodo: NodoId;
  proximaCita: string;
  procedimientoNext: string;
  avanceTratamiento: number;
  estado: EstadoPaciente;
  saldo: number;
}

export const PACIENTES_DEMO: PacienteDemo[] = [
  {
    id: 'pac-001',
    nombre: 'María Guadalupe Flores Reyes',
    edad: 34,
    curp: 'FORM840315MZSLRL08',
    diagnosticoPrincipal: 'Caries dental múltiple + Gingivitis crónica',
    alumnoAsignado: 'Rodrigo Martínez Ávalos',
    docenteSupervisor: 'Dr. Carlos Soto Ramírez',
    nodo: 'climuzac',
    proximaCita: '2026-04-10 10:00',
    procedimientoNext: 'Restauración clase II OD 36',
    avanceTratamiento: 45,
    estado: 'activo',
    saldo: 380,
  },
  {
    id: 'pac-002',
    nombre: 'José Antonio Hernández Cruz',
    edad: 52,
    curp: 'HECJ740820HZSNRN03',
    diagnosticoPrincipal: 'Periodontitis estadio III, grado B',
    alumnoAsignado: 'Rodrigo Martínez Ávalos',
    docenteSupervisor: 'Dr. Carlos Soto Ramírez',
    nodo: 'climuzac',
    proximaCita: '2026-04-11 11:30',
    procedimientoNext: 'Raspado y alisado radicular cuadrante II',
    avanceTratamiento: 30,
    estado: 'tratamiento',
    saldo: 620,
  },
  {
    id: 'pac-003',
    nombre: 'Ana Sofía Ruiz Medina',
    edad: 8,
    curp: 'RUMA180502MZSIDN05',
    diagnosticoPrincipal: 'Caries dental ceo-d: 4. Hábito de succión digital.',
    alumnoAsignado: 'Daniela Quiñones López',
    docenteSupervisor: 'Dra. Patricia Vega Núñez',
    nodo: 'clijani',
    proximaCita: '2026-04-14 09:00',
    procedimientoNext: 'Aplicación de selladores OD 36, 46',
    avanceTratamiento: 70,
    estado: 'activo',
    saldo: 0,
  },
  {
    id: 'pac-004',
    nombre: 'Roberto Carlos Leal Sandoval',
    edad: 67,
    curp: 'LESA590112HZSELB02',
    diagnosticoPrincipal: 'Edentulismo parcial. Prótesis parcial removible indicada.',
    alumnoAsignado: 'Kevin Torres Espinoza',
    docenteSupervisor: 'Dr. Carlos Soto Ramírez',
    nodo: 'clicamp',
    proximaCita: '2026-04-15 16:00',
    procedimientoNext: 'Impresiones definitivas para prótesis inferiores',
    avanceTratamiento: 55,
    estado: 'tratamiento',
    saldo: 950,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// KPIs DASHBOARD DIRECTOR (datos simulados realistas)
// ─────────────────────────────────────────────────────────────────────────────

export const KPI_DIRECTOR = {
  alumnosActivos: 164,
  pacientesAtendidosMes: 1247,
  ingresosDelMes: 48650,
  alertasCriticas: 3,
  historiasGeneradasHoy: 87,
  clinicasActivas: 5,
  sillonesOcupados: 59,
  sillonesTotal: 74,
  procedimientosMes: 3892,
  metaProcedimientosMes: 4200,
};

export const ALERTAS_DEMO = [
  { id: 'a1', tipo: 'inventario', mensaje: 'Stock mínimo: Anestesia local Lidocaína 2% (CLIBOR)', urgencia: 'alta', nodo: 'CLITACO y CLIBOR' },
  { id: 'a2', tipo: 'equipo', mensaje: '2 sillones en mantenimiento preventivo (CLIBOR)', urgencia: 'media', nodo: 'CLITACO y CLIBOR' },
  { id: 'a3', tipo: 'academico', mensaje: '3 alumnos por debajo del 70% de procedimientos requeridos (CLIMUZAC)', urgencia: 'baja', nodo: 'CLIMUZAC' },
];

// ─────────────────────────────────────────────────────────────────────────────
// UTILIDADES
// ─────────────────────────────────────────────────────────────────────────────

export const getNodoById = (id: NodoId): NodoClinico | undefined => NODOS.find(n => n.id === id);
export const getRolById = (id: RolId): Rol | undefined => ROLES.find(r => r.id === id);
