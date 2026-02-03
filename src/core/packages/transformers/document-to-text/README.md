# Dentaxy Core: Interpret

## Propósito
Cerebro encargado de entender el contenido de los documentos.

## Responsabilidades
- OCR (Reconocimiento Óptico de Caracteres).
- Parsing de estructuras.
- Detección de secciones dentro de un documento.
- Preparación de datos crudos para ser consumidos por formularios.

## Reglas
1. **Entrada**: Documento crudo (del módulo `document`).
2. **Salida**: Datos estructurados (JSON, objetos).
3. **Sin efectos secundarios**: Procesamiento puro donde sea posible.
