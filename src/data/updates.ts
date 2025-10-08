// Configuración de actualizaciones de la plataforma
// Edita este archivo para actualizar el contenido sin usar la base de datos

export interface Update {
  id: string;
  version: string;
  title: string;
  description: string;
  release_date: string;
}

export const PLATFORM_UPDATES: Update[] = [
  {
    id: '1',
    version: 'v1.5.0',
    title: 'Mejoras de Rendimiento',
    description: 'Optimización general del sistema para una experiencia más fluida y rápida.',
    release_date: new Date().toISOString(), // Hoy
  },
  {
    id: '2',
    version: 'v1.4.2',
    title: 'Nuevas Funcionalidades',
    description: 'Agregamos toggles para interrogatorio por aparatos y sistemas.',
    release_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Ayer
  },
  {
    id: '3',
    version: 'v1.4.0',
    title: 'Interfaz Mejorada',
    description: 'Rediseño de la interfaz para una mejor experiencia de usuario.',
    release_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    version: 'v1.3.5',
    title: 'Correcciones de Errores',
    description: 'Solución de problemas menores y mejoras de estabilidad.',
    release_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    version: 'v1.3.0',
    title: 'Sistema de Métricas',
    description: 'Nuevo sistema de seguimiento de métricas en tiempo real.',
    release_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
