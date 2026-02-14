---
name: managing-studio-components
description: Manage the cloning, categorization, and persistence of UI/UX components in the Dentaxy Component Studio (Phase 3). Use this when the user asks to "save to canvas", "clone design", or "add to library".
---

# Studio Component Manager

Esta habilidad permite al agente Antigravity gestionar de manera experta la biblioteca de componentes en la Fase 3: Lienzo de Pruebas.

## Cuándo usar esta habilidad
- El usuario pide "clonar un diseño" o "guardar en el lienzo".
- Se requiere añadir nuevos elementos de UI (botones, inputs, layouts) a la biblioteca persistente.
- Se necesita organizar componentes complejos que contienen múltiples partes.

## Reglas de Oro de Clonación
1.  **Integridad Total**: Al clonar, se debe incluir el elemento **completo** (Full Structure) tal cual aparece en el diseño original. No simplificar ni omitir estilos.
2.  **Estructura Compuesta**:
    *   Si un componente tiene partes individuales (ej. una Navbar con botones y un logo), se crea una **carpeta dedicada** para ese conjunto.
    *   Dentro de la carpeta, el primer elemento debe ser el **"Elemento Completo"** (el ensamblaje final).
    *   Los elementos constituyentes se guardan por separado en la misma carpeta para su reutilización individual.
3.  **Nomenclatura Única**:
    *   Usar nombres cortos, reconocibles e **irrepetibles**.
    *   Prefijo recomendado para IDs: `comp-[nombre-del-elemento]-[variante]`.
4.  **Categorización Automática**:
    *   Si la categoría (carpeta) no existe (ej. "Textareas"), crearla automáticamente en la raíz adecuada (`root-ui` para componentes generales, `root-features` para piezas de lógica).
    *   No exceder en el número de carpetas; agrupar por afinidad lógica (ej. agrupar "Modals" y "Drawers" en "Overlays" si es necesario, o mantenerlos separados si son muchos).

## Flujo de Trabajo
- [ ] Identificar el componente a clonar y extraer su código JSX/CSS completo.
- [ ] Verificar si la carpeta de destino existe; crearla si es una categoría nueva.
- [ ] Generar un ID único e irrepetible para el componente.
- [ ] Insertar el componente en `INITIAL_ITEMS` dentro de `src/core/packages/studio/ComponentStudio.tsx`.
- [ ] Si es un componente compuesto, añadir tanto la versión "Full" como los sub-componentes.
- [ ] Validar que la transición a "Preview" funcione correctamente para el nuevo elemento.

## Ejemplo de Inserción (Código)
```tsx
{ 
    id: 'comp-apple-full-interface', 
    name: 'Apple Studio Full', 
    type: 'component', 
    parentId: 'folder-layouts-apple', 
    content: <FullInterfaceComponent /> 
}
```
