# Dentaxy Core: UI

## Propósito
Biblioteca de componentes visuales genéricos y agnósticos al producto.

## Responsabilidades
- Componentes base (Botones, Inputs, Cards).
- Visualizadores de documentos.
- Renderizadores de formularios (basados en `core/form`).

## Reglas
1. **Agnóstico al Producto**: Ningún componente debe saber si está en `Dentaxy Pro`, `Seed` o `Shop`.
2. **Sin Branding Hardcodeado**: Los estilos deben venir de temas o props, no estar fijos para una marca específica.
3. **Funcional**: Prioridad a la usabilidad clínica y velocidad.
