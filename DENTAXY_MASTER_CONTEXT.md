# DENTAXY — Documento Maestro de Contexto para IA

> **Propósito de este documento:** Proveer a cualquier IA (o persona nueva) un entendimiento completo, preciso y atómico de qué es Dentaxy, para qué sirve, cómo funciona internamente, a quién está dirigido, qué contiene actualmente su codebase, cuál es su arquitectura y cuáles son sus principios fundamentales de diseño. Este documento es la fuente de verdad número uno del proyecto.
>
> **Fecha de generación:** Marzo 2026  
> **Versión:** 1.0 — Documento Vivo

---

## ÍNDICE

1. [¿Qué es Dentaxy?](#1-qué-es-dentaxy)
2. [La Empresa y el Fundador](#2-la-empresa-y-el-fundador)
3. [El Problema que Resuelve](#3-el-problema-que-resuelve)
4. [Público Objetivo](#4-público-objetivo)
5. [El Ecosistema de Productos](#5-el-ecosistema-de-productos)
6. [Arquitectura Tecnológica](#6-arquitectura-tecnológica)
7. [El Principio Más Importante: La IA Sin API](#7-el-principio-más-importante-la-ia-sin-api)
8. [Módulos Actuales del Sistema](#8-módulos-actuales-del-sistema)
9. [El Motor Clínico — DentaxyFormPanel](#9-el-motor-clínico--dentaxyformpanel)
10. [Las 21 Secciones de la Historia Clínica](#10-las-21-secciones-de-la-historia-clínica)
11. [SmileEspejo — Vista de Expediente](#11-smileespejo--vista-de-expediente)
12. [El Panel de Administración](#12-el-panel-de-administración)
13. [Sistema de Demos y Control de Acceso](#13-sistema-de-demos-y-control-de-acceso)
14. [Dentaxy Shop](#14-dentaxy-shop)
15. [Dentaxy Seed](#15-dentaxy-seed)
16. [Dentaxy Universidades — La Presentación](#16-dentaxy-universidades--la-presentación)
17. [Supabase y Base de Datos](#17-supabase-y-base-de-datos)
18. [Stack Técnico Completo](#18-stack-técnico-completo)
19. [Identidad Visual y Marca](#19-identidad-visual-y-marca)
20. [Historial de Evolución (2022–2026)](#20-historial-de-evolución-20222026)
21. [Contexto de Alianzas y Validación](#21-contexto-de-alianzas-y-validación)
22. [Reglas de Desarrollo (Para la IA)](#22-reglas-de-desarrollo-para-la-ia)
23. [Estructura de Archivos Completa](#23-estructura-de-archivos-completa)
24. [Rutas de la Aplicación](#24-rutas-de-la-aplicación)

---

## 1. ¿Qué es Dentaxy?

**Dentaxy** (`dentaxy.com`) es una **plataforma de salud digital mexicana** que está revolucionando la odontología al eliminar completamente el uso de papel y los registros manuales en clínicas dentales y clínicas universitarias de odontología.

**En una frase:** Dentaxy convierte la carga administrativa del dentista —historias clínicas, expedientes, control de pacientes— en un sistema digital inteligente que se siente como IA, pero opera 100% localmente sin enviar datos a ningún servidor externo.

**Lo que NO es:** Dentaxy no es un simple formulario digital. Es un **Motor de Simulación Clínica** con:
- Redacción médica profesional generada localmente (sin OpenAI, sin Claude, sin APIs externas)
- Interfaz ultra-simple construida sobre años de investigación de carga cognitiva
- Arquitectura de privacidad de grado militar: los datos nunca salen del dispositivo del dentista

**Eslogan Principal:** *"De datos clínicos a decisiones inteligentes"*

**Sub-eslogan:** *"Redefiniendo la Educación Clínica"*

---

## 2. La Empresa y el Fundador

| Campo | Valor |
|---|---|
| **Fundador & CEO** | Braulio Zavala Uribe |
| **Empresa** | Dentaxy Technologies |
| **Dominio** | dentaxy.com |
| **País** | México |
| **Inicio del desarrollo** | 2022 |
| **Status actual** | Producción activa / El Momento Zero (2026) |
| **Modelo de desarrollo** | 1 Humano + Infinitas IAs (desde 2023) |
| **Reconocimiento** | 1er Lugar — Jornadas Internacionales de Investigación, UAZ |

El proyecto fue construido por **una sola persona** en perfecta sinergia con herramientas de IA (como Antigravity / Claude), construyendo a lo largo de 4 años una arquitectura que creció en paralelo con la explosión de la inteligencia artificial, aprovechando ese timing de forma calculada.

---

## 3. El Problema que Resuelve

Dentaxy diagnostica y ataca **4 Ejes Críticos** del sistema dental actual:

| Eje Crítico | El Status Quo | El Impacto Real | La Solución Dentaxy |
|---|---|---|---|
| 🎓 **Formación Clínica** | El 70% de la jornada se consume en burocracia manual (historias clínicas en papel) | Sub-optimización: el alumno egresa con menos horas de práctica real | ECE + IA Predictiva |
| 📋 **Control Académico** | Seguimiento en firmas físicas, listas de papel y datos dispersos | Vulnerabilidad: falta de trazabilidad, riesgo de fraude académico | Gestión Académica Centralizada |
| 💰 **Soberanía Financiera** | Cobros en efectivo sin integración CFDI, opacidad en el flujo | Fuga de capital: riesgo administrativo y desorden fiscal | Ecosistema Financiero Core |
| 🔧 **Activos e Insumos** | Inventarios manuales, material "invisible", pérdidas de instrumental | Descapitalización: pérdida recurrente de patrimonio institucional | Stock Inteligente |

### Evidencia Científica que Respalda el Problema

Dentaxy basa su propuesta en 4 estudios publicados:

1. **"Allocation of Physician Time in Ambulatory Practice"** (Annals of Internal Medicine) — Los clínicos dedican el doble de tiempo a registros (EHR) que al contacto con el paciente.
2. **"Cognitive Load Theory: Methods to Manage Complexity"** (PubMed/Springer) — La burocracia cognitiva bloquea el aprendizaje profundo en un 40%.
3. **"Tethered to the EHR"** (Annals of Family Medicine) — La fatiga EHR es el predictor #1 de errores clínicos.
4. **"Burnout and Satisfaction With Work-Life Balance Among US Physicians"** (JAMA) — El exceso administrativo reduce la empatía en etapas formativas.

### La Estadística Central de Dentaxy

- Sin tecnología: llenar una historia clínica completa = **2.8 horas**
- Con Dentaxy: **38 minutos** (reducción del 77%)
- Errores clínicos en registros de estudiantes: **>40%** → con Dentaxy: ~0%
- Costo de 50,000 notas/mes con GPT-4o: **$60,000 MXN** → con Dentaxy: **$0**

---

## 4. Público Objetivo

Dentaxy tiene **tres segmentos de usuarios claramente definidos:**

### Segmento 1: Universidades e Instituciones Educativas
- Facultades de odontología
- Clínicas universitarias (p.ej. UAZ, CROID)
- Directores académicos y coordinadores de clínica
- **Necesidad:** Control, trazabilidad, reducción de errores en alumnos, gestión de competencias en tiempo real

### Segmento 2: Dentistas Profesionales Independientes
- Consultores privados, especialistas
- Clínicas de uno o varios profesionales
- **Necesidad:** Agilidad en la documentación, historias clínicas de calidad legal, sin papel

### Segmento 3: Clínicas Enterprise / Cadenas
- Franquicias y grupos de clínicas con múltiples sucursales
- **Necesidad:** Estandarización operativa, control central, flujos clínicos continuos

### Segmento Emergente (2026+): Alumnos
- Odontólogos en formación que recibirán 50% de descuento en Dentaxy Seed al egresar de universidades aliadas (p.ej. UAZ)

---

## 5. El Ecosistema de Productos

Dentaxy no es un solo producto. Es un ecosistema de módulos:

```
DENTAXY Technologies
│
├── dentaxy.com           → Plataforma principal (dentistas profesionales)
│   ├── DENTAXY AI          → Motor de Historia Clínica con redacción local
│   ├── DICOM               → Visor de radiografías panorámicas
│   ├── DENTAXY ENTERPRISE  → Arquitectura multi-sucursal
│   └── PROYECTO STARK      → En desarrollo / clasificado
│
├── DENTAXY UNIVERSIDADES  → Plataforma académica para clínicas universitarias
│   └── Demo Interactivo con presentación institucional de 12 slides
│
├── DENTAXY SEED           → Versión para estudiantes y clínicas pequeñas
│   └── Login especial + landing propia (/seed)
│
└── DENTAXY SHOP           → E-commerce de insumos dentales
    └── Integración con pasarela de pagos + catálogo de productos
```

---

## 6. Arquitectura Tecnológica

### Stack Principal

| Capa | Tecnología |
|---|---|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 5 |
| **Styling** | TailwindCSS 3 + Radix UI |
| **Animaciones** | Framer Motion 12 |
| **Base de Datos** | Supabase (PostgreSQL + Realtime) |
| **Autenticación** | Supabase Auth + WebAuthn/Passkeys |
| **Deploy** | Vercel (con Edge Functions) |
| **Monitoreo** | Vercel Analytics + Speed Insights |
| **PDF** | jsPDF + pdf-lib (generación sin servidor) |
| **DICOM** | CornerstoneJS 4 (visor de radiografías) |
| **Pagos** | Stripe Checkout (para Shop) |
| **P2P** | PeerJS (para sincronización Nexus) |
| **OCR** | Tesseract.js (local, sin servidor) |
| **Iconos** | Lucide React |
| **Estado global** | React Context + custom hooks |

### Principios Arquitectónicos

1. **Offline-First:** El motor de historia clínica funciona sin internet
2. **Privacy by Design:** Datos clínicos nunca salen del navegador del usuario
3. **Zero-Cost AI:** Todo el procesamiento de IA es local (sin APIs de pago)
4. **Deterministic Engine:** No hay alucinaciones posibles; el texto viene de templates validados
5. **Progressive Disclosure:** El formulario muestra 1 sección a la vez; reduce errores en 34%
6. **Persistence sin "Guardar":** Todos los formularios persisten automáticamente en localStorage

---

## 7. El Principio Más Importante: La IA Sin API

> **REGLA ABSOLUTA:** La "IA" de Dentaxy NO llama a ningún LLM externo. Todo el texto clínico se genera localmente en el navegador.

Esta es la decisión arquitectónica más importante del proyecto. Aquí una comparación directa:

| Factor | IA Generativa (OpenAI/Claude) | Dentaxy Engine (Local) |
|---|---|---|
| **Privacidad** | Datos médicos salen a servidores de terceros | Datos nunca salen del navegador (PHI-safe) |
| **Costo** | Miles de tokens = dinero mensual | $0 perpetuo |
| **Velocidad** | 2–15 segundos (latencia de red + inferencia) | ~0ms (cómputo local en JavaScript) |
| **Alucinaciones** | Posibles; el LLM puede inventar | Imposible; texto de templates clínicos validados |
| **Confiabilidad** | Depende de que la API esté online | Funciona sin internet |
| **Variación** | Alta (impredecible) | Controlada (variantes aleatorias de frases médicas correctas) |

### ¿Cómo se genera el texto entonces?

El sistema utiliza **template literals con variantes controladas** y **funciones helper de mapeo semántico**:

```
1. El usuario llena un campo (ej: "masticación = Bilateral")
2. Una función helper mapea el valor a lenguaje médico: "bilateral" → "patrón de masticación bilateral"
3. Un template literal construye la oración: "El paciente refiere alimentación de tipo [X]. Su patrón de masticación es [Y]."
4. Si hay múltiples opciones de verbos/conectores, se elige aleatoriamente de un array controlado
5. El resultado es texto médico profesional, consistente y sin errores
```

El efecto se **siente** como IA porque usa lenguaje médico real con cierta variación gramatical, pero es 100% determinista y validado por clínicos.

---

## 8. Módulos Actuales del Sistema

### 8.1 DENTAXY AI (`/demo/ai`)
**El módulo núcleo.** Historia clínica digital con motor de redacción local.
- 21 secciones del expediente odontológico completo
- Redacción clínica profesional generada en ~0ms
- Vista previa "SmileEspejo" del documento en tiempo real
- Exportación a PDF con formato institucional
- Control de acceso mediante DemoGuard + tokens de Supabase

### 8.2 DICOM (`/demo/dicom`)
**Visualizador de imagenología dental.**
- Renderizado de archivos `.dcm` nativos en el navegador
- Potenciado por CornerstoneJS 4
- Ajuste de contraste, brillo y zoom dinámico
- Funciona sin software pesado ni plugins externos
- Datos de imagen nunca salen del dispositivo

### 8.3 DENTAXY UNIVERSIDADES (`/academico`)
**Plataforma académica para clínicas universitarias.**
- Gestión de clínicas múltiples (grid de clínicas)
- Cada clínica tiene su propia vista con lista de pacientes (`/academico/:clinicaId`)
- Formulario clínico completo integrado (DentaxyFormPanel)
- Supervisión institucional de avance de competencias

### 8.4 DENTAXY ENTERPRISE (`/enterprise`)
**Arquitectura multi-entorno para cadenas de clínicas.**
- Control administrativo central
- Flujos clínicos continuos entre sucursales
- Seguridad por diseño (operación sin intervención individual)

### 8.5 PROYECTO STARK (`/stark`)
**Clasificado.** En desarrollo activo. Acceso restringido.

### 8.6 DENTAXY SEED (`/seed`)
**Versión lite para estudiantes y clínicas pequeñas.**
- Landing propia en `/seed/overview`
- Login separado en `/seed`
- En colaboración con UAZ y CROID

### 8.7 DENTAXY SHOP (`/shop`)
**E-commerce de insumos dentales.**
- Login propio (`ShopAuthProvider`) en `/shop`
- Tienda en `/shop/tienda`
- Integración con Stripe Checkout

---

## 9. El Motor Clínico — DentaxyFormPanel

El `DentaxyFormPanel.tsx` es el **corazón de Dentaxy**. Es el componente orquestador de todo el flujo de historia clínica.

### Arquitectura del Panel

```
DentaxyFormPanel.tsx (Orquestador principal)
│
├── useHistoriaClinica()        → Hook: estado global del formulario (formData)
├── useGenerarTodasRedacciones()→ Hook: automatización secuencial de 21 secciones
│
├── ProgressLine.tsx            → Barra de progreso sticky (84px expandida / 16px compacta)
│
├── AnimatePresence             → Framer-motion: transición deslizante entre secciones
│   └── SectionCard.tsx         → Wrapper: modo 'form' o modo 'redaction'
│       └── [XxxCard].tsx       → 21 wrappers de sección
│           └── [XxxFormComponent].tsx → Formulario real de cada sección
│
└── CommandDock.tsx             → Barra de controles flotante (Atrás | Ver Redacción | Siguiente)
```

### Estados Centrales

```typescript
const [currentStep, setCurrentStep] = useState(0);       // 0-20: sección activa
const [direction, setDirection] = useState(0);            // 1=adelante, -1=atrás
const [viewMode, setViewMode] = useState<ViewMode>('form'); // 'form' | 'redaction'
const [generations, setGenerations] = useState<Record<string, any>>({}); // Textos generados
```

### Lógica de Progreso Visual

Cada sección puede tener uno de 4 estados:
- `'active'` → Verde brillante, sección actual
- `'completed'` → Verde completado (texto generado)
- `'skipped'` → Gris (sección pasada sin generar)
- `'pending'` → Gris (secciones futuras)

### Automatización Total

El hook `useGenerarTodasRedacciones` permite generar las 21 secciones secuencialmente en "modo demo":
1. Itera sobre todas las secciones
2. Activa cada sección programáticamente
3. Hace click en el botón "Generar" interno
4. Espera timeout + pasa a la siguiente
5. Dispara `window.dispatchEvent(new Event('dentaxy-generation-complete'))` al terminar

### Persistencia en localStorage

Los datos se guardan automáticamente sin necesidad de botón "Guardar":
```typescript
useEffect(() => {
  localStorage.setItem('interrogatorio-sistemas-formValues', JSON.stringify(formValues));
}, [formValues]);
```

---

## 10. Las 21 Secciones de la Historia Clínica

Este es el estándar odontológico completo implementado en Dentaxy:

| # | ID | Nombre Completo |
|---|---|---|
| I | `padecimiento` | Padecimiento Actual |
| II | `heredofamiliares` | Antecedentes Heredofamiliares |
| III | `noPatologicos` | Antecedentes No Patológicos |
| IV | `patologicos` | Antecedentes Patológicos |
| V | `alergicos` | Antecedentes Alérgicos |
| VI | `quirurgicos` | Antecedentes Quirúrgicos |
| VII | `hemorragicos` | Antecedentes Hemorrágicos |
| VIII | `ginecoObstetricos` | Antecedentes Gineco-obstétricos (solo mujeres) |
| IX | `interrogatorio` | Interrogatorio por Aparatos y Sistemas |
| X | `exploracionFisica` | Exploración Física |
| XI | `cabeza` | Examen de Cabeza |
| XII | `atm` | Articulación Craneomandibular |
| XIII | `cuello` | Examen de Cuello |
| XIV | `intrabucal` | Examen Intrabucal |
| XV | `salivales` | Glándulas Salivales |
| XVI | `oclusion` | Oclusión |
| XVII | `relacionDientes` | Relación de Dientes |
| XVIII | `lineaMedia` | Línea Media |
| XIX | `frenillos` | Frenillos |
| XX | `diagnostico` | Diagnóstico |
| XXI | `pronostico` | Pronóstico |

### Los 8 Sistemas del Interrogatorio (Sección IX)

La sección más compleja. Cubre:
1. Aparato Digestivo
2. Aparato Respiratorio
3. Aparato Cardiovascular
4. Aparato Genito-urinario
5. Sistema Endocrino
6. Sistema Tegumentario
7. Sistema Músculo-esquelético
8. Sistema Nervioso

Cada sistema tiene un **toggle "Aparato Sano"** que, al activarse, inyecta instantáneamente un texto pre-escrito y validado clínicamente. Si el toggle está desactivado, el sistema genera texto a partir de los campos del formulario (alimentación, masticación, síntomas, etc.).

---

## 11. SmileEspejo — Vista de Expediente

El `SmileEspejoPanel.tsx` es el componente de "espejo" que muestra el documento completo en tiempo real mientras el dentista llena el formulario.

**Características:**
- Panel derecho que muestra las 21 secciones con su contenido generado
- Indicadores "RECIBIENDO..." animados mientras una sección se genera
- Sectores especiales con subformularios para secciones complejas (interrogatorio, noPatológicos, ATM, etc.)
- Funciona mediante eventos del DOM (`dentaxy-copy-trigger`, `dentaxy-paste-trigger`, `dentaxy-clear-trigger`)
- Botón de copia al portapapeles de todo el expediente
- Header con estilo institucional azul (`#4766ac`)

---

## 12. El Panel de Administración

El Panel de Administración (`/admin/*`) es el centro de control de Dentaxy para el operador (CEO/Admin).

### Módulos del Admin Panel

| Ruta | Componente | Función |
|---|---|---|
| `/admin` | AdminLoginPage | Login con autenticación biométrica |
| `/admin/dashboard` | AdminDashboard | KPIs, métricas globales y resumen |
| `/admin/nexus-intel` | AdminNexusIntel | Inteligencia de datos y análisis avanzado |
| `/admin/ecosystem` | Ecosystem | Vista y control del ecosistema de módulos |
| `/admin/demos` | DemoControl | Gestión de tokens de demo, activar/desactivar accesos |
| `/admin/security` | Security | Seguridad, logs de intentos y control de acceso |
| `/admin/geomap` | GeoMap | Mapa geográfico de visitas y usuarios activos |
| `/admin/analytics` | Analytics | Estadísticas de uso y conversión |
| `/admin/communication` | Communication | Mensajería y notificaciones P2P |
| `/admin/presentation-remote` | PresentationRemote | Control remoto de la presentación universitaria |
| `/admin/presentation-editor` | PresentationEditor | Editor de presentaciones (tldraw canvas) |
| `/admin/students` | StudentModule | Módulo de gestión de alumnos |
| `/admin/modules` | ModulesManager | Habilitar/deshabilitar módulos en tiempo real |
| `/admin/audit` | AuditLogs | Registros de auditoría de todas las acciones |
| `/admin/settings` | Settings | Configuración global del sistema |

### Login Biométrico del Admin

El `BiometricLogin.tsx` implementa:
- WebAuthn / Passkeys (autenticación sin contraseña)
- `@simplewebauthn/browser` en el cliente
- `@simplewebauthn/server` en Edge Functions de Vercel
- Fallback a autenticación por contraseña clásica

---

## 13. Sistema de Demos y Control de Acceso

Dentaxy tiene un sistema sofisticado para controlar quién puede ver cada módulo.

### Componente DemoGuard

```tsx
<DemoGuard moduleName="motor_neuronal">
  <AIDemo />
</DemoGuard>
```

Cada módulo protegido está envuelto en `DemoGuard`, que verifica:
1. Si hay un `demo_session_token` válido en `sessionStorage`
2. Si el token está activo en la tabla `demo_sessions` de Supabase
3. Si el módulo específico está habilitado en `dentaxy_modules`

### Flujo de Acceso a Demos

```
Usuario llega a /hub
    ↓
elige módulo → "Probar Demo"
    ↓
¿El módulo tiene free_access = true en Supabase?
    ├── SÍ → Entra directamente
    └── NO → Solicita token
              ↓
          Usuario ingresa token → Supabase verifica:
              - Token existe en demo_links
              - No está revocado (is_revoked = false)
              - No expiró (expires_at)
              - Usos disponibles (current_uses < max_uses)
              ↓
          Si requires_user_info = true → Pide nombre y ubicación GPS
              ↓
          Registra sesión en demo_sessions
          Incrementa counter con RPC increment_demo_uses
          Redirige al módulo
```

### Control en Tiempo Real

El admin puede habilitar/deshabilitar módulos desde `/admin/modules` y el cambio se refleja **instantáneamente** en todos los usuarios conectados gracias a una suscripción Realtime de Supabase:

```typescript
const channel = supabase
  .channel('modules-realtime')
  .on('postgres_changes', { event: 'UPDATE', table: 'dentaxy_modules' }, ...)
  .subscribe();
```

### NFC — Verificación de Autenticidad

La ruta `/verify` expone `NFCVerify.tsx`, un sistema de verificación de documentos oficiales mediante NFC. El acceso solo es válido desde chips NFC autorizados (no indexable, no público).

---

## 14. Dentaxy Shop

**Ruta:** `/shop` (login) → `/shop/tienda` (tienda)

El Shop es el módulo de e-commerce para insumos dentales.

**Características:**
- Autenticación propia con `ShopAuthProvider` (Context independiente)
- Catálogo de productos dentales
- Integración con Stripe Checkout para pagos
- Página de éxito de donación en `/donation-success`

---

## 15. Dentaxy Seed

**Seed** es la versión simplificada de Dentaxy dirigida a:
- Estudiantes de odontología
- Clínicas pequeñas (como CROID)
- Partners académicos (UAZ)

**Rutas:**
- `/seed` → Login especial
- `/seed/overview` → Landing/Overview de Dentaxy Seed

**Propuesta de valor para alumnos UAZ:**
- 50% de descuento en paquete inicial al egresar
- Acceso gratuito durante primeros 6 meses

---

## 16. Dentaxy Universidades — La Presentación

**Ruta:** `/demo/presentacion`

La presentación es un demo interactivo de 12 slides construido en React + Framer Motion, diseñado específicamente para presentaciones ante universidades e instituciones.

### Estructura de los 12 Slides

| Slide | Nombre | Contenido |
|---|---|---|
| 0 | Cover | Logo animado Dentaxy.com/.ai, CTA "Explorar Cómo Funciona" |
| 1 | El Diagnóstico | Tabla de 4 Ejes Críticos con datos del status quo |
| 2 | Validación | 3 años de ingeniería, 1er lugar UAZ |
| 3 | El Acelerador | Cita del CEO, estadísticas: 21 secciones, 0seg redacción |
| 4 | Crecimiento Exponencial | Línea de tiempo 2022–2026, gráfica interactiva |
| 5 | Respaldo Global | Citas de Sam Altman y Jensen Huang |
| 6 | El Universo Dentaxy | Diagrama de nodos del ecosistema |
| 7 | Identidad y Gamificación | Skins (Esmeralda/Indigo/Aurora/CyberGold/Void), métricas de progreso |
| 8 | Motor de Simulación | Q&A "¿Es IA?", tabla de costos vs GPT-4o |
| 9 | UAZ Aliado Institucional | Propuesta financiera: $3.3M MXN, beneficios |
| 10 | Resultados en Tiempo Real | Tabla de calificaciones desde Supabase (realtime) |
| 11 | CTA Final | Call to Action |

### Características Técnicas de la Presentación

- **Navegación:** Teclado (←→ / Espacio), botones flotantes, control remoto desde Admin Panel
- **Componentes visuales:** Donut Chart (SVG puro), Line Chart exponencial animado, Node Diagram
- **Glassmorfismo:** Sistema .glass y .glass-heavy con backdrop-filter
- **Fuentes:** Syne (800w para títulos), Space Grotesk (500w para subtítulos), Inter (200-400w para cuerpo)
- **Responsive:** Sistema completo de CSS Custom Properties con media queries
- **Generación de PDF:** Funcion `generarPDF()` que abre ventana de impresión sin librerías externas
- **Calificaciones realtime:** Los directivos universitarios califican el proyecto (1–5 estrellas) y los votos aparecen en tiempo real vía Supabase

### Sistema de Control Remoto

El admin puede controlar la presentación desde `/admin/presentation-remote`:
- Desbloquear contenido de slides en tiempo real
- Avanzar/retroceder slides de forma remota
- Activar overlay especial de "Contenido Desbloqueado"

---

## 17. Supabase y Base de Datos

Dentaxy usa **Supabase** como backend completo.

### Tablas Principales

| Tabla | Función |
|---|---|
| `dentaxy_modules` | Estado de módulos (habilitado/deshabilitado/free_access) |
| `demo_links` | Tokens de demo (token, expires_at, max_uses, current_uses, is_revoked, requires_user_info, allowed_modules) |
| `demo_sessions` | Sesiones de demo registradas (user info, location, module_id) |
| `clinicas` | Clínicas universitarias registradas |
| `pacientes` | Pacientes de cada clínica |
| `historias_clinicas` | Expedientes guardados |
| `presentation_ratings` | Calificaciones de directivos universitarios (realtime) |

### Row Level Security (RLS)

Todas las tablas tienen políticas RLS activas. Los datos clínicos solo son accesibles por el usuario autenticado que los creó.

### Funciones RPC

- `increment_demo_uses(p_token)` → Incrementa el counter de usos de forma atómica y segura
- Otras funciones para manejo de permisos y validaciones

### Realtime

Dentaxy usa Supabase Realtime para:
1. Estado de módulos (Hub de módulos se actualiza instantáneamente)
2. Calificaciones de presentación (votos de directivos aparecen en tiempo real)
3. Sincronización P2P en modo demo

---

## 18. Stack Técnico Completo

### Dependencias Principales de Producción

```json
{
  "react": "^18.3.1",
  "react-router-dom": "^6.26.2",
  "framer-motion": "^12.23.12",
  "@supabase/supabase-js": "^2.49.1",
  "@tanstack/react-query": "^5.56.2",
  "lucide-react": "^0.462.0",
  "tailwindcss": "^3.4.11",
  "framer-motion": "^12.23.12",

  // DICOM Viewer
  "@cornerstonejs/core": "^4.16.1",
  "@cornerstonejs/tools": "^4.16.1",
  "dicom-parser": "^1.8.21",

  // PDF
  "jspdf": "^3.0.1",
  "pdf-lib": "^1.17.1",

  // Auth biométrica
  "@simplewebauthn/browser": "^13.2.2",

  // Pagos
  "stripe": "(via Edge Function)",

  // P2P
  "peerjs": "^1.5.5",

  // OCR local
  "tesseract.js": "^7.0.0",

  // Editor de presentaciones
  "tldraw": "^4.3.1",

  // AI local (HuggingFace en el navegador)
  "@huggingface/transformers": "^3.3.3",

  // Analytics
  "@vercel/analytics": "^1.5.0",
  "@vercel/speed-insights": "^1.3.1"
}
```

### Infraestructura de Deploy

- **Hosting:** Vercel (con auto-deploy desde GitHub)
- **Edge Functions:** En `/api/` para autenticación biométrica y Stripe
- **Dominio:** `dentaxy.com`
- **CDN:** Vercel Edge Network
- **Headers de seguridad:** Configurados en `vercel.json` (CSP, HSTS, X-Frame-Options)

---

## 19. Identidad Visual y Marca

### Paleta de Colores Principal

| Nombre | Hex | Uso |
|---|---|---|
| **Emerald Principal** | `#10B981` | Color de marca, progreso, acciones, éxito |
| **Emerald Dark** | `#059669` | Hover states del botón principal |
| **Indigo** | `#6366F1` | Módulo DICOM, validación, secundario |
| **Purple** | `#A855F7` | Módulo académico, categorías |
| **Pink** | `#EC4899` | Acento, diversidad de módulos |
| **Amber** | `#F59E0B` | Advertencias, módulo Shop |
| **Background Ultra Dark** | `#030712` | Fondo global de la presentación |
| **Dark Navy** | `#09090b` (zinc-950) | Fondo del formulario en dark mode |
| **Admin Blue** | `#4766ac` | Header del SmileEspejo / estilo institucional |

### Tipografía

| Fuente | Uso | Peso |
|---|---|---|
| **Syne** | Títulos principales, números estadísticos | 600, 700, 800 |
| **Space Grotesk** | Subtítulos, badges, etiquetas | 400, 500, 600 |
| **Inter** | Cuerpo de texto, párrafos largos | 200, 300, 400, 500 |

### Sistema de Glassmorfismo (Presentación)

```css
.glass {
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(32px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 24px;
}

.glass-heavy {
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(48px) saturate(200%);
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 28px;
}
```

### Estética General

- **Inspiración:** Apple (minimalismo, atención al detalle, elegancia)
- **Mood:** Futurista, oscuro, premium, médico-tecnológico
- **Filosofía UX:** "Menos es más" — ultra-simple para el dentista, poderoso por dentro
- **Animaciones:** Hardware-accelerated, spring physics, no son decoración sino orientación al usuario

---

## 20. Historial de Evolución (2022–2026)

### 2022 — Las Bases
- Drafts de arquitectura y prototipos con UAZ
- Recopilación de dataset anatómico odontológico
- Definición del estándar UX/UI (las 21 secciones)
- Pruebas de viabilidad generativa

### 2023 — Los Primeros Modelos
- Scaffold de componentes React Core
- Sistema de Diseño con Glassmorfismo base
- Lógica base de Progressive Disclosure
- Motor local de redacción clínica en Alpha

### 2024 — Dentaxy Core
- DentaxyFormPanel completo con State Management
- Integración temprana del DICOM Viewer
- Optimización de Providers globales
- Testing de carga cognitiva y rediseño UI
- Primeras versiones del Admin Panel

### 2025 — Crecimiento de Módulos
- Dentaxy Shop MVP con Stripe Checkout
- Modelos de Suscripción & ROI Tracker
- DentaxyGPT (DeepSeek-R1) & Luma Loaders
- Mejoras de performance e Historial Clínico completo
- Passkeys, WebAuthn & Notificaciones P2P
- Sistema de Demo Links con tokens

### 2026 — El Momento Zero (Despliegue Oficial)
- Optimización Caché & Apple-style animations
- Global DemoGuard & Advanced Auth Control
- Zero-Latency Inline Word-Stream
- Admin Panel completo & Nexus P2P Synchronization
- Sistema de presentaciones con control remoto
- NFC Verification de documentos
- **Production Rollout: El Momento Zero**

---

## 21. Contexto de Alianzas y Validación

### Universidad Autónoma de Zacatecas (UAZ)
- Es el aliado institucional principal
- **1er Lugar** en Jornadas Internacionales de Investigación UAZ
- Propuesta activa de implementación por $3,300,000 MXN (esquema semestral)
- Los alumnos UAZ recibirán 50% de descuento en Dentaxy Seed al egresar
- Demo de presentación diseñado específicamente para el contexto UAZ

### CROID
- Clínica universitaria colaboradora
- Target de Dentaxy Seed

### Validación Científica
El proyecto está avalado por estudios de:
- Annals of Internal Medicine (EHR Time Study)
- PubMed (Cognitive Load Theory)
- Annals of Family Medicine (EHR Burden)
- JAMA (Physician Burnout)
- Journal of Dental Education (Student Recordkeeping Errors)
- JAMIA (Progressive Disclosure Reduces Errors 34%)
- BMC Medical Education (2.8h → 38min)
- Sequoia Capital, McKinsey, Gartner (validación de timing tecnológico 2026)

---

## 22. Reglas de Desarrollo (Para la IA)

Si eres una IA ayudando en este proyecto, estas son las reglas absolutas:

### NUNCA
- ❌ Llamar a una API externa de IA (OpenAI, Claude, Gemini) para generar texto clínico
- ❌ Enviar datos de pacientes a servidores externos
- ❌ Complicar la interfaz del dentista (regla: menos es más)
- ❌ Romper el sistema de generación local; si necesitas texto nuevo, escribe el template directamente en el código
- ❌ Eliminar animaciones o micro-interacciones sin reemplazarlas por algo mejor

### SIEMPRE
- ✅ Escribir comentarios y documentación en **español**
- ✅ Priorizar privacidad de datos sobre cualquier otra consideración
- ✅ Mantener la arquitectura "offline-first" del motor de redacción
- ✅ Usar los design tokens establecidos (emerald como color primario)
- ✅ Usar el sistema de Progressive Disclosure (1 sección a la vez)
- ✅ Persitir datos en localStorage automáticamente (sin botón "Guardar")
- ✅ Consultar la guía de identidad de marca antes de crear UI nueva

### Cómo Agregar una Nueva Sección al Formulario

1. Agregar entrada en `seccionesGenerables` en `DentaxyFormPanel.tsx`
2. Crear el componente de formulario en `/src/components/historia-clinica/NuevaNombreForm.tsx`
3. Crear el wrapper Card en `/src/components/academico/sections/NuevaNombreCard.tsx`
4. Agregar el `case` correspondiente en `renderCurrentStepContent()` en `DentaxyFormPanel.tsx`
5. Agregar la entrada en `SmileEspejoPanel.tsx` para su visualización

### Cómo Modificar una Redacción Existente

Editar los template literals o las `redaccionesSinSintomas` en el archivo `.tsx` correspondiente dentro de `/src/components/historia-clinica/`.

---

## 23. Estructura de Archivos Completa

```
/Dentaxy-lab
│
├── src/
│   ├── App.tsx                         → Router principal con todas las rutas
│   ├── main.tsx                        → Entry point
│   │
│   ├── app/
│   │   ├── core/page.tsx               → Dentaxy Core (/core)
│   │   └── singularity/page.tsx        → Dentaxy Singularity (/singularity)
│   │
│   ├── components/
│   │   ├── AppleStyleDock.tsx          → Dock de navegación estilo macOS
│   │   ├── HistoriaClinica.tsx         → Componente legacy de historia clínica
│   │   ├── MedicationSearch.tsx        → Buscador de medicamentos
│   │   ├── SchemaHubCard.tsx           → Tarjeta del Hub de módulos
│   │   ├── ShaderSplash.tsx            → Pantalla de carga animada (Three.js)
│   │   ├── WikiSearch.tsx              → Buscador de WikiPedia/Médico
│   │   │
│   │   ├── academico/
│   │   │   ├── DentaxyFormPanel.tsx    → MOTOR PRINCIPAL (orquestador)
│   │   │   ├── SmileEspejoPanel.tsx    → Vista en espejo del expediente
│   │   │   ├── VistaDocumento.tsx      → Vista final del documento para PDF
│   │   │   ├── ClimuzacHeader.tsx      → Header de la clínica
│   │   │   ├── ClinicaCard.tsx         → Tarjeta de cada clínica
│   │   │   ├── ClinicasGrid.tsx        → Grid de clínicas universitarias
│   │   │   ├── ui/
│   │   │   │   ├── ProgressLine.tsx    → Barra de progreso animada (21 nodos)
│   │   │   │   ├── CommandDock.tsx     → Dock inferior de controles
│   │   │   │   └── SectionCard.tsx     → Wrapper form/redacción
│   │   │   └── sections/              → 21 wrappers de sección (uno por sección)
│   │   │
│   │   ├── admin/
│   │   │   ├── BiometricLogin.tsx      → Login con WebAuthn/Passkeys
│   │   │   ├── dashboard/              → Componentes del dashboard
│   │   │   ├── ecosystem/              → Vista del ecosistema
│   │   │   ├── security/               → Componentes de seguridad
│   │   │   └── communication/          → Módulo de comunicación
│   │   │
│   │   ├── demos/
│   │   │   └── DemoGuard.tsx           → Guardián de acceso a demos
│   │   │
│   │   ├── historia-clinica/           → Formularios de cada sección clínica
│   │   │   ├── InterrogatorioSistemas.tsx (1,875 líneas — 8 sistemas)
│   │   │   ├── ExamenCabeza.tsx        → Sección XI completa
│   │   │   ├── PadecimientoActual.tsx  → Sección I
│   │   │   └── ... (18 componentes más, uno por sección)
│   │   │
│   │   └── shop/                       → Componentes de la tienda
│   │
│   ├── contexts/
│   │   ├── AnalysisModeContext.tsx     → Modo análisis/selección de palabras
│   │   ├── AuthContext.tsx             → Autenticación global
│   │   ├── AdminAuthContext.tsx        → Autenticación del panel admin
│   │   ├── AcademicoContext.tsx        → Estado del módulo académico
│   │   └── ShopAuthContext.tsx         → Autenticación del shop
│   │
│   ├── hooks/
│   │   ├── useHistoriaClinica.ts       → Estado global del formulario clínico
│   │   ├── useGenerarTodasRedacciones.ts → Automatización secuencial
│   │   ├── useGlobalMetrics.ts         → Tracking de métricas globales
│   │   └── useDemoGuard.ts             → Validación de sesión de demo
│   │
│   ├── pages/
│   │   ├── Landing.tsx                 → Página de inicio (dentaxy.com)
│   │   ├── ModulesHub.tsx              → Hub de módulos (carrusel interactivo)
│   │   ├── Index.tsx                   → Página de app principal (/app)
│   │   │
│   │   ├── academico/                  → Páginas del módulo académico
│   │   │   ├── AcademicoDemo.tsx       → Lista de clínicas
│   │   │   └── ClinicaView.tsx         → Vista de una clínica específica
│   │   │
│   │   ├── admin/                      → Páginas del panel admin
│   │   │   ├── AdminLayout.tsx         → Layout del admin (sidebar + outlet)
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DemoControl.tsx
│   │   │   ├── PresentationRemote.tsx  → Control remoto de la presentación
│   │   │   └── PresentationEditor.tsx  → Editor de presentaciones (tldraw)
│   │   │
│   │   ├── demo/
│   │   │   ├── AIDemo.tsx              → Demo del motor de historia clínica
│   │   │   ├── DICOMDemo.tsx           → Demo del visor DICOM
│   │   │   ├── EnterpriseDemo.tsx      → Demo Enterprise
│   │   │   ├── StarkDemo.tsx           → Demo Proyecto Stark (clasificado)
│   │   │   └── DentaxyPresentation.tsx → Presentación universitaria (~2200 líneas)
│   │   │
│   │   ├── shop/
│   │   │   ├── ShopLogin.tsx
│   │   │   └── Shop.tsx
│   │   │
│   │   ├── seed/
│   │   │   ├── SeedLogin.tsx
│   │   │   └── SeedLanding.tsx
│   │   │
│   │   └── verify/
│   │       └── NFCVerify.tsx           → Verificación NFC de documentos
│   │
│   ├── integrations/
│   │   └── supabase/client.ts          → Cliente Supabase
│   │
│   ├── lib/
│   │   └── queryClient.ts              → Configuración de TanStack Query
│   │
│   ├── services/                       → Servicios y llamadas a APIs
│   │
│   ├── types/
│   │   └── historiaClinica.ts          → TypeScript types del FormDataState
│   │
│   └── utils/                          → Funciones de utilidad
│
├── api/                                → Edge Functions de Vercel
│
├── supabase/                           → Migraciones de Supabase
│
├── public/
│   └── brand/
│       ├── dentaxy-icon-solid.webp     → Ícono principal de Dentaxy
│       └── dentaxy-icon-outline.webp   → Ícono en outline
│
├── DENTAXY_MASTER_CONTEXT.md          → Este archivo
├── DENTAXY_FORM_AI_WORKING.md         → Manual técnico del motor de formulario
├── DENTAXY_DEMO_CONTEXT.md            → Contexto del demo universitario (código)
├── PRESENTACION_UNIVERSIDAD_TEXTO.md  → Texto completo de la presentación
├── DENTAXY_AUTH_SCHEMA.sql            → Esquema de autenticación
└── DENTAXY_SCHEMA_MAESTRO.sql         → Esquema maestro de la base de datos
```

---

## 24. Rutas de la Aplicación

| Ruta | Componente | Acceso |
|---|---|---|
| `/` | Landing | Público |
| `/hub` | ModulesHub | Público |
| `/modules` | ModulesHub | Público |
| `/about` / `/nosotros` | About | Público |
| `/como-funciona` | HowItWorks | Público |
| `/benefits` | Benefits | Público |
| `/contact` | Contact | Público |
| `/terms` | TermsAndConditions | Público |
| `/privacy` | PrivacyPolicy | Público |
| `/app` | Index | Acceso libre |
| `/core` | CorePage | Acceso libre |
| `/singularity` | SingularityPage | Acceso libre |
| `/academico` | AcademicoDemo | Acceso libre |
| `/academico/:clinicaId` | ClinicaView | Acceso libre |
| `/demo/ai` | AIDemo | DemoGuard (`motor_neuronal`) |
| `/demo/dicom` | DICOMDemo | DemoGuard (`dicom`) |
| `/enterprise` | EnterpriseDemo | DemoGuard (`enterprise`) |
| `/stark` | StarkDemo | DemoGuard (`proyecto_stark`) |
| `/demo/presentacion` | DentaxyPresentation | DemoGuard (`academico_presentacion`) |
| `/admin` | AdminLoginPage | Login Admin |
| `/admin/dashboard` | AdminDashboard | Admin Autenticado |
| `/admin/nexus-intel` | AdminNexusIntel | Admin Autenticado |
| `/admin/demos` | DemoControl | Admin Autenticado |
| `/admin/security` | Security | Admin Autenticado |
| `/admin/geomap` | GeoMap | Admin Autenticado |
| `/admin/analytics` | Analytics | Admin Autenticado |
| `/admin/communication` | Communication | Admin Autenticado |
| `/admin/presentation-remote` | PresentationRemote | Admin Autenticado |
| `/admin/presentation-editor` | PresentationEditor | Admin Autenticado |
| `/admin/students` | StudentModule | Admin Autenticado |
| `/admin/modules` | ModulesManager | Admin Autenticado |
| `/admin/audit` | AuditLogs | Admin Autenticado |
| `/admin/settings` | Settings | Admin Autenticado |
| `/shop` | ShopLogin | Shop Auth |
| `/shop/tienda` | Shop | Shop Autenticado |
| `/seed` | SeedLogin | Público |
| `/seed/overview` | SeedLanding | Público |
| `/verify` | NFCVerify | Solo NFC |
| `/donation-success` | DonationSuccess | Público |

---

## Notas Finales para la IA

### Si te preguntan "¿qué es Dentaxy?"
> Es una plataforma de salud digital mexicana que digitaliza completamente el expediente clínico odontológico. Su motor principal genera texto médico profesional de forma local (sin enviar datos a ningún servidor), eliminando la carga burocrática que consume el 70% del tiempo de un dentista.

### Si te preguntan "¿cómo funciona la IA de Dentaxy?"
> No hay una "IA" externa. El sistema usa templates literales con variantes controladas en JavaScript. El dentista llena un formulario simple (radio buttons, checkboxes), y el sistema ensambla párrafos médicos completos usando esas respuestas + funciones helper que mapean valores a lenguaje clínico correcto. El resultado es texto de calidad profesional generado en ~0ms, sin internet, sin costo por token, sin riesgo de alucinaciones.

### Si te preguntan "¿a quién va dirigido?"
> Tres segmentos: (1) Universidades de odontología que quieren modernizar sus clínicas educativas, (2) Dentistas profesionales independientes que quieren documentación sin papel, y (3) Clínicas Enterprise/cadenas que necesitan estandarización multi-sucursal.

### Si necesitas hacer un cambio de código
> Siempre leer primero el archivo relevante, respetar los design tokens (emerald = color primario), nunca llamar a APIs de IA externas, y documentar en español.

---

*Documento generado el 31 de marzo de 2026 — Dentaxy Technologies · dentaxy.com*
*Mantenido por: Braulio Zavala Uribe (CEO) + Antigravity (AI Engineering Partner)*
