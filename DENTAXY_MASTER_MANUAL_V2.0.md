# DENTAXY MASTER TECHNICAL MANUAL V2.0: Ecosistema y Motor Clínico Determinista

> **Propósito de este documento:** Proveer la estructura absoluta, filosofía y arquitectura de código del **Ecosistema Dentaxy**. Este es el mapa maestro para cualquier IA o Arquitecto de Software que asista en la construcción, escalabilidad o depuración de Dentaxy.com, sus módulos, y su orquestador clínico central.

---

## 0. Regla de Oro: La Filosofía "No-API" y Privacidad Total

El fundamento arquitectónico más importante de Dentaxy es la **Generación de Redacción Médica Determinista Local**.

> **🛑 NUNCA se deben enviar datos clínicos (PHI) a APIs externas como OpenAI o Claude para generar la narrativa médica.** Todos los textos clínicos se ensamblan directamente en el navegador de forma matemática, predecible e instantánea.

### ¿Por qué esta filosofía es el núcleo del proyecto?

| Pilar | Implicación Tecnológica | Solución Dentaxy |
|---|---|---|
| **Privacidad Absoluta** | Los datos de pacientes no pueden salir hacia servidores de terceros. | Todo el cómputo se realiza en el DOM del navegador del dentista. |
| **Costo Operativo $0** | Mantener escalabilidad masiva sin pagar por tokens de IA. | El motor usa plantillas literales de JS y *Math.random()* local. |
| **Latencia Cero** | Inmediatez en la experiencia del usuario clínico. | Cero llamadas a red = ~0ms de tiempo de redacción. |
| **Cero Alucinaciones** | La medicina requiere exactitud forense. | La lógica de Ensamblaje Determinista bloquea invenciones de IA. |

---

## 1. Mapa Arquitectónico del Ecosistema Multimódulo

Dentaxy pasó de ser un formulario clínico a un ecosistema integral enfocado en dentistas, estudiantes y laboratorios. Toda la navegación se maneja desde el Router central en `App.tsx`.

### 1.1. Los Módulos del Ecosistema
1. **Dentaxy Seed:** Core educativo para universidades (UAZ, UAO, CROID). Formación de estudiantes.
2. **Dentaxy Shop:** Módulo e-commerce privado para venta de insumos dentales. Usa `OrganicShopFrame`.
3. **Dentaxy Lab:** Eje de conexión entre dentista y laboratorio para envío de escaneos 3D y RX.
4. **Dentaxy Club & Space:** Networking profesional y diseño/arquitectura de clínicas inteligentes.
5. **Dentaxy Aura & News:** Módulos de estética e información científica.
6. **Dentaxy MyLana:** Gestión financiera radicalmente simple para el consultorio.
7. **Motor Neuronal & Stark:** Experimentos en visualizaciones DICOM y analítica de datos local.

### 1.2. Theme-Driven UI (CSS System)
Para que los módulos se sientan como partes de una suite pero con personalidad propia, Dentaxy utiliza un sistema de temas CSS locales que manipulan las "Custom Properties" (por ejemplo `.lab-theme`, `.seed-theme`, `.club-theme`). Estos temas alteran el `background`, `--primary-color` y `--accent-color` dinámicamente. 

Todos los componentes base utilizan **TailwindCSS** y **shadcn/ui**, siguiendo la regla de "Menos es Más" y diseño ultra-premium.

---

## 2. La Infraestructura de Captación y Backend

### 2.1. Waitlist V2.1: Consolidación Multimódulo
Todo el ecosistema utiliza un punto único de captura de red: `WaitlistMasterModal.tsx`. 
En la V2.1 se implementó lo siguiente:
- **Google Apps Script V3:** Actúa como un micro-backend que procesa POSTs del modal. GAS recibe el correo, el módulo de origen y registra en una Hoja de Cálculo, disparando correos HTML responsivos automáticos al usuario.
- **Supabase Admin Toggles:** En `/admin/waitlist`, podemos alternar la visibilidad y funcionamiento de este modal usando flags en la base de datos de Supabase, evitando despliegues en Vercel para activar/desactivar features temporales.

### 2.2. Seguridad Criptográfica Continua (NFCVerify)
Dentaxy genera un PDF final de la historia clínica. Para combatir la falsificación, se integra un UUID único en cada documento. Si el documento tiene NFC o es consultado online, la ruta `/verify` compara las credenciales contra la base de datos para avalar que el documento fue realmente emitido por el `DentaxyFormPanel` firmado criptográficamente.

---

## 3. El Corazón Clínico: `DentaxyFormPanel.tsx`

`DentaxyFormPanel` es el orquestador principal que monta, rastrea e inyecta estado a las 21 secciones de una historia clínica odontológica profesional.

### 3.1. Estado Global Centralizado
El hook `useHistoriaClinica` (en `/hooks/useHistoriaClinica.ts`) mantiene el `formData` absoluto. Es un estado profundo `Record<string, any>` que representa cada checkbox, radio y textarea de los 21 componentes. Cada sección tiene su propio `handle[Seccion]Change` inmutable.

### 3.2. Gestión de UI y Animaciones
Se utiliza `Framer Motion` intensivamente para lograr el nivel estético de la plataforma.
- `ProgressLine.tsx`: Barra pegada al top que gestiona dos tamaños (`isScrolled ? 16px : 84px`). Dibuja un "pill" esmeralda que crece indicando el progreso actual (0 a 21). Muestra un *shimmer* blanco de CSS durante las transiciones.
- `CommandDock.tsx`: Botonera anclada en la parte baja (`popLayout` + resortes) que permite avanzar, retroceder y solicitar la redacción.
- `SectionCard.tsx`: El contenedor polimórfico de cada sección. Recibe una prop mágica llamada `viewMode`. 
  - Si `viewMode === 'form'`, muestra el layout con checkboxes e inputs.
  - Si `viewMode === 'redaction'`, hace un renderizado `<div dangerouslySetInnerHTML />` de la narrativa médica.

### 3.3. Las Secciones Quirúrgicas Reestructuradas
El array de secciones se compone de 21 tarjetas `XxxCard.tsx`. Secciones recientes que unifican especialidad médica dental:
`Padecimiento`, `Heredofamiliares`, `Interrogatorio Sistemas`, `Salivales`, `Oclusión`, `Línea Media`, `Frenillos`, hasta el `Diagnóstico` final.

---

## 4. El Motor de Redacción Dinámica (Ingeniería Detallada)

¿Cómo lograr que un Formulario redacte un texto natural y médico sin usar IAs basadas en la nube?
A través de Toggles "Sanos" y Lógica de Permutación semántica.

### 4.1. El Patrón "Aparato Sano" (Short-circuit Text)
Cada componente tiene un toggle principal (Ej. `[SistemasSinSíntomas]`).
Si el doctor activa "Aparato Sano", se inyecta instantáneamente un texto médico validado y riguroso. Sin calcular nada.

```typescript
if (checked) {
  // Lógica directa y determinista para textos sin anormalidades
  handleInterrogatorioChange(system, redaccionesSinSintomas[system]);
}
```

### 4.2. Lógica de Variación Matemática y Ensamblaje
Cuando el doctor elige síntomas manuales, se ejecuta el ensamblador. Para que no suene a "robot", usamos plantillas literales con permutaciones matemáticas (`Math.random()`).

```typescript
// Ejemplo de Variación de Texto (NO-API)
let cardiovascularText = "";
if (formValues.cardiovascular.dolorToracico) {
  const variaciones = [
    `El paciente refiere dolor torácico asociado a ${formValues.cardiovascular.dolorToracico}`,
    `Se documenta un cuadro que incluye dolor torácico manifestado como ${formValues.cardiovascular.dolorToracico}`
  ];
  cardiovascularText += variaciones[Math.floor(Math.random() * variaciones.length)];
}

// Helpers Médicos
const getDeglusionText = (value) => {
  if (value === "Dolor") return "odinofagia"; // Vocabulario hiper-profesional automático
  if (value === "Dificultad") return "disfagia detectada en la exploración";
  return "[sin especificar]";
};

cardiovascularText += `. Durante el examen clínico indica presentar ${getDeglusionText(formValues.deglusion)}.`;
```

Esta lógica se repite y se condensa en la cadena final. La latencia es microscópica ($< 1ms$), es robusta contra fallos y nunca va a alucinar cosas con el paciente.

---

## 5. Módulo de Editor Interactivo y Presentaciones (`tldraw`)

Dentro de la visión educativa de "Seed", Dentaxy cuenta con su propio PowerPoint en la web.
- `PresentationEditor.tsx`: Incorporación directa de `<Tldraw />` para permitir crear diapositivas en un lienzo de formato libre infinito y persistirlas serializadas como JSON a Supabase.
- `PresentationRemote.tsx`: Modo de control externo / presentador.
- `DentaxyPresentation.tsx`: El reproductor responsivo (usando Media Queries Nativas de Tailwind) que adapta la presentación institucional a dispositivos móviles. CUBE CSS se usa fuertemente aquí para que el layout mantenga su flujo "intrínseco" de componentes.

---

## 6. Integración y Automatizaciones Masivas

### 6.1. `useGenerarTodasRedacciones.ts`
El sistema tiene un botón de "Magic AI" falso (simulando una redacción de red para el asombro del usuario) que toma el formulario masivo e itera sección por sección. Modifica estéticamente el `currentStep`, pulsa el botón lógico de "Generar Redacción", simula una pausa humana de procesamiento y recolecta el output en un documento JSON agnóstico que el componente `SmileEspejoPanel.tsx` inyecta en el PDF.

### 6.2. `AnalysisModeContext.tsx`
Un contexto global que permite al usuario o doctor seleccionar partes del texto generado y marcarlo para resaltados en modo de auditoría legal/clínica.

---

## 7. Procedimiento Operativo Estándar para Inteligencias Artificiales

Cuando actúes sobre este código o amplíes la plataforma, TIENES que someterte a este protocolo Cero-Bullshit de Dentaxy:

1. **NO IMPORTES SERVICIOS EXTERNOS PARA LÓGICA CORE CLINICAL.** Jamás uses Langchain, OpenAI o Fetch a un LLM en el generador de la historia clínica.
2. **ESCRÍBELO EN ESPAÑOL.** Funciones, Props (cuando sea aplicable al dominio), comentarios y Readmes deben estar completamente en Español para el equipo.
3. **MANTÉN LA EFICIENCIA DE TAMAÑO.** Los componentes de renderizado de texto pueden crecer exponencialmente; mantén limpia la lógica del `Switch` / `If-Else`. Utiliza Helpers externos o diccionarios si el algoritmo crece de más.
4. **RESPETA EL ESTADO DE VERCEL.** Si falla el build, revisa importaciones *Case-Sensitive* y revisa si archivos nuevos están realmente integrados en el pipeline de GitHub Action/Build Server localmente antes de modificar infraestructuras de Vercel.
5. **AESTHETICS SON LA LEY.** Si un botón de UI te parece sencillo de dibujar, hazlo Premium. Si agregas componentes, utiliza glassmorphism ligero, bordes refinados, variantes oscuras/claras dinámicas (`dark:bg-zinc-900`) y microinteracciones de Framer Motion. Dentaxy compite contra corporaciones masivas ganándoles a nivel de diseño y experiencia de usuario.

---
*(Fin del Archivo Maestro de Ecosistema)*
