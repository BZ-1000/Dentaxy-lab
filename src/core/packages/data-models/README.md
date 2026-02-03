# Dentaxy Core: Form

## Propósito
Definición estructural y lógica de los formularios clínicos.

## Responsabilidades
- Definir modelos de formulario (Section, Field, Input).
- Gestionar reglas de validación y dependencia entre campos.
- Tipos de datos soportados.

## Reglas
1. **NO UI**: Este módulo NO contiene componentes visuales (React, HTML). Solo define *qué* es el formulario, no *cómo* se ve.
2. **Reutilizable**: Un mismo modelo de formulario debe poder renderizarse en Web, Móvil o PDF.
3. **Serializable**: La definición completa de un formulario debe poder guardarse como JSON.
