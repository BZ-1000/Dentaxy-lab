import { Tutorial } from '@/types/sidebar';

export const tutorials: Tutorial[] = [
  {
    id: 'llenar-historia-clinica',
    title: 'Cómo llenar la Historia Clínica',
    description: 'Guía paso a paso para completar el formulario completo',
    category: 'formulario',
    content: `
## Paso 1: Información del Paciente

Ingresa el nombre completo del paciente en el campo principal. Esta información será utilizada en todos los reportes generados.

## Paso 2: Padecimiento Actual

Describe los síntomas principales que presenta el paciente. Sé específico sobre:
- Localización del dolor o molestia
- Intensidad (escala del 1-10)
- Duración de los síntomas
- Factores que lo mejoran o empeoran

## Paso 3: Antecedentes

Completa todas las secciones de antecedentes de manera detallada:
- **Heredofamiliares**: Enfermedades en familiares directos
- **Personales no patológicos**: Hábitos, alimentación, higiene
- **Personales patológicos**: Enfermedades previas
- **Alérgicos**: Medicamentos, alimentos, materiales dentales
- **Quirúrgicos**: Cirugías previas
- **Hemorrágicos**: Tendencia al sangrado

## Paso 4: Exploración Física

Realiza una exploración completa de cabeza, cuello y cavidad oral. Documenta todos los hallazgos relevantes.

## Paso 5: Diagnóstico y Pronóstico

Establece un diagnóstico basado en los hallazgos y determina el pronóstico del paciente.

## Paso 6: Guardar

Presiona el botón "Guardar" para almacenar la historia clínica localmente.
    `,
    steps: [
      'Ingresa el nombre del paciente',
      'Completa el padecimiento actual',
      'Llena todos los antecedentes',
      'Realiza la exploración física',
      'Establece diagnóstico',
      'Guarda el formulario'
    ],
    duration: '10 min'
  },
  {
    id: 'usar-agenda',
    title: 'Cómo usar la Agenda',
    description: 'Aprende a programar y gestionar citas de pacientes',
    category: 'agenda',
    content: `
## Crear una Cita Nueva

1. Haz click en el botón "Nueva Cita"
2. Selecciona la fecha en el calendario
3. Elige la hora de la cita
4. Selecciona el tipo de consulta:
   - 🔵 Consulta general
   - 🟢 Revisión
   - 🟡 Limpieza
   - 🔴 Cirugía
   - 🟠 Urgencia
5. Agrega notas adicionales si es necesario
6. Presiona "Guardar"

## Editar o Cancelar Citas

- Click en cualquier cita existente para ver opciones
- Puedes editar todos los datos o marcar como completada
- Para cancelar, selecciona "Cancelar cita"

## Vistas del Calendario

Cambia entre tres vistas disponibles:
- **Día**: Ver citas por día
- **Semana**: Vista semanal completa
- **Mes**: Vista mensual general

## Recordatorios

Activa las notificaciones para recibir recordatorios 1 hora antes de cada cita.
    `,
    steps: [
      'Abre la sección Agenda',
      'Click en "Nueva Cita"',
      'Completa los datos',
      'Guarda la cita',
      'Configura recordatorios'
    ],
    duration: '5 min'
  },
  {
    id: 'generar-reportes',
    title: 'Generar Reportes PDF',
    description: 'Cómo crear y descargar reportes de historias clínicas',
    category: 'reportes',
    content: `
## Generar un Reporte

Una vez completada la historia clínica:

1. Revisa que todos los campos estén correctamente llenados
2. Presiona el botón "Generar PDF"
3. El sistema creará automáticamente un documento profesional
4. El PDF incluirá:
   - Logo de DENTAXY
   - Datos del paciente
   - Todos los antecedentes
   - Hallazgos de exploración física
   - Diagnóstico y pronóstico
   - Fecha y hora de generación

## Personalizar el Reporte

Puedes personalizar ciertos aspectos:
- Incluir o excluir secciones específicas
- Agregar notas adicionales al final
- Ajustar el formato de presentación

## Compartir el Reporte

Una vez generado el PDF:
- Descárgalo a tu dispositivo
- Compártelo por email
- Imprímelo para el expediente físico
- Guárdalo en tu sistema de archivos
    `,
    steps: [
      'Completa la historia clínica',
      'Click en "Generar PDF"',
      'Revisa el documento',
      'Descarga o comparte'
    ],
    duration: '3 min'
  },
  {
    id: 'guardar-plantillas',
    title: 'Usar Plantillas',
    description: 'Crea y reutiliza plantillas de formularios',
    category: 'general',
    content: `
## Crear una Plantilla

Si frecuentemente usas la misma configuración de historia clínica:

1. Llena el formulario con los datos comunes
2. Ve a "Formularios" en el sidebar
3. Click en "Guardar como plantilla"
4. Dale un nombre descriptivo
5. La plantilla quedará guardada para uso futuro

## Usar una Plantilla

1. Abre "Formularios"
2. Selecciona la plantilla deseada
3. Los campos se llenarán automáticamente
4. Modifica solo lo necesario para el paciente actual
5. Guarda como nueva historia clínica

## Gestionar Plantillas

- Edita plantillas existentes
- Elimina plantillas que ya no uses
- Renombra para mejor organización
- Comparte plantillas con colegas (próximamente)
    `,
    steps: [
      'Llena un formulario base',
      'Guarda como plantilla',
      'Usa la plantilla en nuevos casos',
      'Personaliza según necesidad'
    ],
    duration: '4 min'
  }
];
