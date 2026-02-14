---
name: cloning-elements
description: Extract the structure and style of any UI element to create high-fidelity reusable templates. Use this when the user says "clona el elemento" or "extrae este diseño".
---

# Element Cloner Skill

Esta habilidad permite al agente Antigravity transcribir el diseño exacto de un elemento de UI en código JSX/CSS reutilizable.

## Principios de Extracción
1.  **Fidelidad de Estilo**: Copiar exactamente todas las clases (Tailwind o CSS), bordes, sombras, gradientes y animaciones.
2.  **Abstracción de Contenido**: 
    *   Si el elemento original tiene un texto específico (ej. "Nombre del Paciente"), reemplazarlo por un placeholder genérico o una prop (ej. `{label}`).
    *   Mantener la estructura de contenedores intacta pero vaciar o generalizar el contenido para que sea un "Lienzo de Pruebas".
3.  **Descomposición Atómica**:
    *   Identificar el "Elemento Maestro" (el contenedor principal).
    *   Identificar las "Partes" (botones internos, iconos, secciones).
4.  **Integración con Studio**: Una vez extraído el código, se debe invocar la habilidad `managing-studio-components` para persistir el resultado.

## Flujo de Trabajo
- [ ] Analizar el código fuente del componente objetivo.
- [ ] Limpiar el contenido específico manteniendo la estructura visual.
- [ ] Crear la versión "FULL" (ensamblaje completo).
- [ ] Crear las versiones "PART" (sub-elementos individuales).
- [ ] Entregar el resultado a `managing-studio-components` para su registro en el Lienzo de Pruebas.

## Ejemplo de Clonación (Texto a Código)
"Clona el botón de explorar" -> Genera un botón con exactamente el mismo `className` de Apple, pero con texto genérico.
