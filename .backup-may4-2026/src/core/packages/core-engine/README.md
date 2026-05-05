# Dentaxy Core: State

## Propósito
Gestión central del estado de la aplicación clínica dentro del Core.

## Responsabilidades
- Máquina de estados global (ej. Documentoargado -> Interpretando -> Validando -> Redactando).
- Coordinación entre módulos (Interpret -> Form -> Writing).
- Gestión de "Store" clínico temporal.

## Reglas
1. **Flujo Unidireccional**: El estado debe fluir de forma predecible.
2. **Agnóstico de Framework**: Preferiblemente usar patrones que no aten la lógica de estado exclusivamente a React (aunque se usen hooks para la integración).
