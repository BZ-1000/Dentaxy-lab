# CONTEXTO COMPLETO — Dentaxy Universidades Presentation
**Archivo generado automáticamente para transferencia de contexto a otra IA**
**Fecha:** Marzo 2026 | **Archivo fuente:** `src/pages/demo/DentaxyPresentation.tsx`

---

## ¿QUÉ ES ESTA PRESENTACIÓN?

Es una presentación interactiva de 11 slides construida en **React + Framer Motion** (TypeScript), diseñada para presentar Dentaxy a universidades dentales (principalmente la **UAZ — Universidad Autónoma de Zacatecas**). Se accede en la ruta `/presentation` de dentaxy.com.

Tiene dos modos de operación:
- **Modo controlado (presentador):** Un admin en `/admin/presentation-remote` controla el slide actual en tiempo real vía **Supabase Realtime**.
- **Modo manual (audiencia):** El usuario navega libremente con flechas o dots del header.

---

## STACK TÉCNICO

| Aspecto | Tecnología |
|---|---|
| Framework | React 18 + TypeScript |
| Animaciones | Framer Motion v12 |
| Backend / Sync | Supabase (Realtime + PostgreSQL) |
| Fuentes | Syne (títulos), Space Grotesk (UI), Inter (cuerpo) |
| Íconos | Lucide React |
| Estilo | Inline styles + CSS Custom Properties en bloque `<style>` |
| Tablas BD | `presentation_state`, `uaz_ratings` |

---

## PALETA DE COLORES DEL DISEÑO

| Color | Hex | Uso |
|---|---|---|
| Verde Dentaxy | `#10B981` | Color principal, acciones, éxito |
| Indigo | `#6366F1` | Validación, tecnología |
| Purple | `#A855F7` | Problema, simulación clínica |
| Pink | `#EC4899` | Personalización, autoridad |
| Gold | `#EAB308` | Crecimiento, timing 2026 |
| Fondo oscuro | `#030712` | Background global |

Estética: **Glassmorfismo oscuro** + neones + tipografía premium Apple-like.

---

## COMPONENTES REUTILIZABLES

### `GlassCard`
Card principal con `backdrop-filter: blur`, bordes semitransparentes y línea de color superior. Se adapta el `glow` por slide: `"green"`, `"blue"`, `"purple"`, `"pink"`, `"yellow"`.

### `Tag`
Etiqueta pequeña con punto pulsante animado. Ejemplo: `<Tag color="#A855F7">El Problema</Tag>`

### `H1`
Título principal usando `clamp(20px, 3.5vw, 44px)` con sombra y font Syne.

### `StatCard`
Tarjeta de estadística con número grande + label. Usado en Slide 3.

### `DonutChart`
SVG puro (sin motion.circle). Muestra la distribución 70% burocracia / 30% práctica.

### `LineChartExponencial`
SVG interactivo con nodos clickeables por año (2022–2026). Al hacer clic en un nodo, aparece un accordion con los avances de ese año.

### `NodeDiagram`
Diagrama de red SVG que muestra el ecosistema Dentaxy (Dentaxy Shop, Labs, AI Agents, UAZ Partners) conectados al nodo central.

---

## LOS 11 SLIDES

### Slide 0 — PORTADA (`Slide0Cover`)
**Propósito:** Primera impresión. El nombre "DENTAXY" con sufijo animado (`.com` ↔ `.ai`).
**Interacción:** Botón "EXPLORAR CÓMO FUNCIONA" → abre el popup del Demo de IA en vivo.
**Mensaje clave:** "El primer sistema de IA que convierte la carga administrativa en tiempo de aprendizaje exponencial."

---

### Slide 1 — EL PROBLEMA (`Slide1Problem`)
**Color:** Púrpura (`#A855F7`)
**Propósito:** Mostrar el "Techo de Cristal Clínico". Los alumnos pasan el 70% del tiempo en burocracia y solo el 30% en práctica real.
**Visual:** `DonutChart` — gráfica de dona SVG con 70% burocracia (indigo/pink) y 30% práctica (verde).
**Cita:** _"Los alumnos de la UAZ son dentistas, no capturadores de datos."_
**Interacción:** Botón "VER ESTUDIO CIENTÍFICO" → abre `Popup Estudios Científicos` (4 estudios internacionales).
**Base científica del popup:**
  1. "Time and Motion" — Annals of Internal Medicine (70/30 split)
  2. Cognitive Load Theory — Sweller (40% reducción de retención)
  3. "Tethered to the EHR" — Annals of Family Medicine
  4. Burnout en estudiantes — JAMA Network

---

### Slide 2 — VALIDACIÓN (`Slide2Validation`)
**Color:** Azul/Indigo (`#6366F1`)
**Propósito:** Credibilidad. La sinergia "1 Humano + Infinitas IAs" desde 2023.
**Interacción:** Card de reconocimiento clickeable → abre imagen del diploma/reconocimiento.
**Reconocimiento:** **1er Lugar — Jornadas Internacionales de Investigación UAZ**
**Imagen:** `/brand/Reconocimiento.webp`

---

### Slide 3 — EL ACELERADOR (`Slide3Accelerator`)
**Color:** Verde (`#10B981`)
**Propósito:** Demostrar el valor real del sistema. Un alumno sin experiencia puede completar el interrogatorio de 8 sistemas fisiológicos en minutos.
**Estadísticas:**
  - 21 Secciones
  - 0 seg de Redacción IA
  - 8 Sistemas fisiológicos
**Cita:** _"Un alumno que jamás ha llenado una historia clínica completa el interrogatorio de 8 sistemas fisiológicos en minutos — donde antes necesitaba horas de plática de inducción."_ — Braulio Zavala Uribe, Founder & CEO
**Interacción:** Botón "VER EVIDENCIA CIENTÍFICA" → Popup de 4 estudios del acelerador:
  1. Error Patterns in Dental Student Clinical Recordkeeping — JDE (>40% errores en alumnos)
  2. Cognitive Load and Retention — Curva de Ebbinghaus (10-20% retención en inducción masiva)
  3. Progressive Disclosure Reduce Errores — JAMIA (34% menos errores)
  4. Tiempo Real: 2.8h → 38min con sistema digital — BMC Medical Education

---

### Slide 4 — CRECIMIENTO EXPONENCIAL (`Slide4Growth`)
**Color:** Dorado (`#EAB308`)
**Propósito:** Mostrar la trayectoria de desarrollo 2022–2026.
**Visual:** `LineChartExponencial` — gráfica de línea SVG interactiva con 5 nodos clickeables.
**Interacción de nodos:** Al clicar un año, aparece un accordion con el log de avances de ese año:

| Año | Log resumido |
|---|---|
| **2022** | Drafts UAZ, dataset anatómico, estándar UX de 21 secciones, pruebas de viabilidad |
| **2023** | Scaffold React Core, diseño glassmorfismo, Progressive Disclosure, motor local Alpha |
| **2024** | DentaxyFormPanel, DICOM Viewer, optimización de providers, rediseño UX |
| **2025** | Shop MVP + Stripe, modelos de suscripción, DentaxyGPT (DeepSeek-R1), Passkeys |
| **2026** | Caché Apple-style, DemoGuard, Zero-Latency Inline, Admin/Nexus P2P, Production Rollout |

**Cita:** _"No estamos persiguiendo una tendencia de 2026; pasamos los últimos 4 años construyendo la pista de aterrizaje."_
**Interacción adicional:** Botón "EL TIMING PERFECTO: 2026" → Popup con 4 estudios de timing:
  1. Sequoia Capital: AI's Act Two
  2. McKinsey: Healthcare como top 4 de productividad gen-AI
  3. Gartner Hype Cycle 2025-2026
  4. NBER: Pair-Programming AI reduce tiempos de despliegue 70%

---

### Slide 5 — RESPALDO GLOBAL (`Slide5Authority`)
**Color:** Rosa/Pink (`#EC4899`)
**Propósito:** Contextualizar con líderes globales que confirman la dirección tecnológica.
**Citas:**
  - **Sam Altman** (CEO, OpenAI): _"La IA será un multiplicador de la capacidad humana."_
  - **Jensen Huang** (CEO, NVIDIA): _"Estamos en el inicio de una nueva revolución industrial."_

---

### Slide 6 — ECOSISTEMA DENTAXY (`Slide6Ecosystem`)
**Color:** Verde (`#10B981`)
**Propósito:** Mostrar el universo de productos Dentaxy y la seguridad institucional.
**Visual:** `NodeDiagram` — red SVG con 4 nodos satélite:
  - Dentaxy Shop (insumos dentales, e-commerce)
  - Dentaxy Labs (I+D)
  - AI Agents
  - UAZ Partners
**Seguridad:** Arquitectura Offline-First + Encriptación de Grado Médico.
**CTA:** Botón "EXPLORAR MÓDULOS" → abre `/hub` en nueva pestaña.

---

### Slide 7 — PERSONALIZACIÓN Y GAMIFICACIÓN (`Slide7Personalization`)
**Color:** Rosa/Pink (`#EC4899`)
**Propósito:** Mostrar que Dentaxy se puede personalizar por tema/skin.
**Skins disponibles:**
  1. Esmeralda (Default) — `#10B981`
  2. Indigo Neon (Pro) — `#6366F1`
  3. Aurora (Premium) — `#EC4899` / `#A855F7`
  4. Cyber Gold (Elite) — `#F59E0B`
  5. Void Dark (Stealth) — blanco/transparente
**Visual:** Preview de barras de progreso gamificadas:
  - Progreso Clínico: 82%
  - Retención: 67%
  - Evaluaciones: 91%
**Interacción:** Clic en cada skin cambia las barras y el botón CTA.

---

### Slide 8 — MOTOR DE SIMULACIÓN CLÍNICA (`Slide8SimEngine`)
**Color:** Púrpura (`#A855F7`)
**Propósito:** Responder la pregunta más frecuente y explicar la diferencia vs IA generativa.
**Pregunta frecuente:** _"¿Entonces Dentaxy es una IA que escribe mis notas?"_
**Respuesta:** No. Es un **Motor de Simulación Clínica** — árboles de decisión deterministas entrenados con IA, que generan texto clínico exacto, sin errores y sin costo de API.
**Cards expandibles** (clic para abrir):
  1. 🔒 Privacidad — Procesamiento 100% local vs IA en servidores externos
  2. ⚡ Zero Latency — Milisegundos vs 5-15 seg de espera de ChatGPT
  3. 💰 Costo $0 — Tabla comparativa: 50,000 notas con GPT-4o = $60,000 MXN vs Dentaxy = $0
  4. 🧠 Simulación vs IA — Margen de error cero, soberanía tecnológica, ingeniería propia

---

### Slide 9 — UAZ: ALIADO INSTITUCIONAL (`Slide9UAZ`)
**Color:** Verde (`#10B981`)
**Propósito:** Presentar la propuesta comercial concreta para la UAZ.
**Dos columnas:**

**Col 1 — Propuesta Financiera y Lanzamiento:**
- 💰 Inversión Institucional: $3,300,000 MXN (esquema semestral)
- 🟢 Implementación 2026: Full Access Institucional sin costo
- 📅 Operación 2027: Licenciamiento semestral (soporte, nube, updates)

**Col 2 — Beneficios de Ecosistema Evolutivo:**
- 🔧 6 meses de prueba gratuita en cada nueva tecnología Dentaxy
- 🎓 50% de descuento en paquete inicial Dentaxy Seed para alumnos UAZ

**Sección de Calificación:**
- Botón ⭐ "CALIFICAR AQUÍ" → abre modal de calificación con:
  - 5 estrellas interactivas (hover animado)
  - Campo: Nombre del directivo
  - Campo: Cargo / Institución
  - Guarda en tabla Supabase `uaz_ratings`

---

### Slide 10 — RESULTADOS EN TIEMPO REAL (`Slide10Results`)
**Color:** Púrpura (`#A855F7`)
**Propósito:** Mostrar en vivo las calificaciones que los directivos van enviando durante la presentación.
**Visual:** Promedio de aceptación en tiempo real + tabla con:
  - Nombre del directivo
  - Cargo
  - Calificación (⭐)
  - Badge de validación ("✓ Proyecto Validado" / "○ En revisión")
**Fuente de datos:** Supabase Realtime — tabla `uaz_ratings`.

---

## POPUPS Y MODALES

| Popup | Disparado por | Contenido |
|---|---|---|
| **AI Demo en Vivo** | Botón en Slide 0 | Abre `DentaxyFormPanel` completo (la app real) en un panel full-screen |
| **Reconocimiento UAZ** | Card en Slide 2 | Imagen del diploma del 1er Lugar UAZ |
| **Base Científica Problema** | Botón en Slide 1 | 4 estudios con links, botón "Descargar PDF" |
| **Evidencia Acelerador** | Botón en Slide 3 | 4 estudios con links, botón "Descargar PDF" |
| **Timing Perfecto 2026** | Botón en Slide 4 | 4 estudios con links, botón "Descargar PDF" |
| **Invitación Hub** | Admin remoto | Overlay que invita a explorar `/hub` |
| **Calificación UAZ** | Botón en Slide 9 | Formulario de estrellas + nombre + cargo |

---

## CONTROL REMOTO (PresentationRemote)

El admin en `/admin/presentation-remote` puede:
- Cambiar el slide actual → se sincroniza vía Supabase Realtime en tiempo real con todos los espectadores
- Activar/desactivar `manual_mode` para permitir/bloquear navegación local de la audiencia
- Disparar el comando `open_hub` → aparece el overlay "Explorar Módulos" en las pantallas de la audiencia

**Tabla Supabase:** `presentation_state` con campos: `id`, `current_slide`, `manual_mode`, `open_hub`

---

## GENERACIÓN DE PDFs

Los 3 popups de estudios tienen botón "Descargar PDF". Generan un documento HTML que se imprime con `window.print()`. Incluyen:
- Header con logo Dentaxy
- Tag de sección
- Cada estudio con número, título, dato, referencia y link
- Footer con fecha y copyright

---

## SISTEMA RESPONSIVO (Implementado)

CSS Custom Properties que escalan en 4 breakpoints:

```
--slide-px:  16px → 28px → 48px → 80px
--slide-py:  12px → 16px → 22px → 28px
--card-px:   20px → 28px → 36px → 42px
--card-py:   20px → 24px → 30px → 36px
--donut-sz: 130px → 155px → 175px → 180px
```

Clases helper: `.pres-grid-2`, `.pres-grid-3`, `.donut-layout`, `.pres-table-wrap`, `.pres-btn-full`, `.pres-dot-hide`

---

## MENSAJES CLAVE DE LA PRESENTACIÓN

1. **El problema:** Los alumnos pasan 70% del tiempo en burocracia, solo 30% practicando — respaldado por estudios internacionales.
2. **La solución:** Dentaxy reduce el tiempo de historia clínica de 2.8h a 38min con un motor determinista (no IA generativa).
3. **La tecnología:** Zero Latency, $0 costo operativo, privacidad absoluta (datos nunca salen del dispositivo).
4. **La tracción:** 4 años de desarrollo, 1er Lugar UAZ, en sincronía con el Momento Zero de la IA (Act Two de Sequoia).
5. **La propuesta:** $3.3M MXN inversión institucional, Full Access 2026 gratuito, licenciamiento anual desde 2027.

---

## ARCHIVOS RELACIONADOS

| Archivo | Propósito |
|---|---|
| `src/pages/demo/DentaxyPresentation.tsx` | Componente principal (2112 líneas) |
| `src/pages/admin/PresentationRemote.tsx` | Control remoto del admin |
| `public/brand/dentaxy-icon-solid.webp` | Logo de Dentaxy |
| `public/brand/Reconocimiento.webp` | Imagen del diploma UAZ |
| `.agent/skills/responsive-presentation/SKILL.md` | Sistema responsivo documentado |

---

*Documento generado por Antigravity AI — Dentaxy Technologies — Marzo 2026*
