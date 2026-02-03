---
name: planning-strategy
description: Generates comprehensive implementation plans before coding. Use when the user has requirements for a multi-step task.
---

# Planning Strategy

## Cuándo usar esta habilidad
- Cuando tienes requisitos claros y necesitas un plan de ejecución.
- Antes de modificar código complejo.
- Cuando el usuario pide "planificar" o "crear un plan".

## Flujo de Trabajo
1.  **Analizar Requisitos**: Entender qué quiere el usuario.
2.  **Crear Documento de Plan**: Generar un archivo `implementation_plan.md` (o similar).
3.  **Desglosar Tareas**: Dividir el trabajo en pasos pequeños (2-5 min).
4.  **Confirmar**: Pedir revisión al usuario.

## Instrucciones

El plan debe ser lo suficientemente detallado para que otro desarrollador (o tú mismo en el futuro) pueda ejecutarlo sin contexto adicional.

### Estructura del Plan

```markdown
# [Nombre de la Funcionalidad] - Plan de Implementación

**Objetivo:** [Descripción de una frase]
**Arquitectura:** [Enfoque técnico]

## Cambios Propuestos

### Componente: [Nombre]
- **Archivos:**
    - Crear: `ruta/archivo.ts`
    - Modificar: `ruta/existente.ts`
- **Detalle de Cambios:**
    1.  Escribir pruebas (TDD).
    2.  Implementar mínima funcionalidad.
    3.  Verificar.

## Plan de Verificación
- Comando exacto para probar: `npm test ...`
- Pasos manuales.
```

## Principios
- **DRY (Don't Repeat Yourself)**.
- **YAGNI (You Aren't Gonna Need It)**.
- **Rutas Exactas**: Siempre usa rutas absolutas o relativas desde la raíz.
- **TDD**: Si es posible, define las pruebas antes del código.
