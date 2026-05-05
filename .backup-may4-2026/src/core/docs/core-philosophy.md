# Filosofía de Dentaxy Core

## Definición
Dentaxy Core es el **núcleo lógico y estructural** del ecosistema Dentaxy. Define cómo se representa, transforma, valida y convierte la información clínica en documentos.

## Principios Absolutos
1. **Sin UI Compleja**: No renderiza interfaces de usuario final ni flujos de navegación.
2. **Sin Skills**: No contiene lógica de negocio específica de un producto ("Skill").
3. **Pureza**: Funciona mediante transformación de datos y aplicación de reglas.

## Las 5 Piezas del Core (Packages)

### 1. Contracts (`packages/contracts`)
**La Ley.** Define interfaces, tipos y esquemas. Nada ejecutable. Todo lo demás debe cumplir estos contratos.

### 2. Data Models (`packages/data-models`)
**El ADN.** Estructuras de datos base (Historia Clínica, Interrogatorio) y su versionado. Sin lógica, solo estructura.

### 3. Transformers (`packages/transformers`)
**El Corazón.** Módulos puros que transforman datos:
- Texto -> Estructura
- Estructura -> Formulario
- Datos -> Documento
Cada transformador hace UNA cosa y no sabe quién lo usa.

### 4. Rules (`packages/rules`)
**La Coherencia.** Validadores, dependencias entre campos y lógica de estados válidos.

### 5. Core Engine (`packages/core-engine`)
**El Orquestador.** Coordinador interno que ejecuta transformadores y reglas en orden. No decide UX.

## Fase 1: Ingesta y Digitalización
El Core provee capacidades para:
- **Ingestion**: Detectar y normalizar archivos de entrada.
- **Document Viewer**: Visualizar y editar documentos digitalizados (vía TipTap).
- **Storage**: Abstracción de guardado.

---
*Este documento es la fuente de verdad arquitectónica para cualquier desarrollo en Dentaxy Core.*
