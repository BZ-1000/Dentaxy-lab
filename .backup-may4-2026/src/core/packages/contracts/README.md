# Dentaxy Core: Contracts

## Propósito
Este módulo define las interfaces y tipos **fundamentales** que gobiernan la interacción entre los distintos módulos del Core. Es la "fuente de verdad" para asegurar que los componentes sean intercambiables.

## Contenido Esperado
- Definiciones de tipos TypeScript (`interfaces`, `types`).
- Contratos de entrada/salida para funciones críticas (ej. `IDocumentProcessor`, `IWritingEngine`).
- Constantes globales inmutables del sistema.

## Reglas
1. **Sin implementación lógica**: Solo definiciones de tipos.
2. **Sin dependencias externas**: No debe depender de librerías de UI o frameworks pesados.
3. **Portabilidad**: Si un módulo cumple con estos contratos, puede ser sustituido por otro sin romper el sistema.
