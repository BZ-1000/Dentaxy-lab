# DENTAXY — Documento Maestro de Contexto para IA (Dentaxy Maestro)

> **Propósito de este documento:** Proveer a cualquier IA (o socio estratégico) un entendimiento completo, preciso, atómico y profundamente emotivo de qué es Dentaxy, para qué sirve, cómo funciona internamente, a quién está dirigido, cuál es su arquitectura actual y cuáles son sus principios fundamentales de diseño y negocio. Este documento representa la fuente de verdad número uno del proyecto, alineado con el despliegue del ecosistema de **Dentaxy Seed** y la postulación al Hackatón XPRIZE en Los Ángeles.
>
> **Fecha de actualización:** Mayo 2026  
> **Versión:** 2.0 — Documento Vivo de la Colección VanGox  
> **Mantenido por:** Braulio Zavala Uribe (CEO & CTO) + Antigravity (AI Engineering Partner)

---

## ÍNDICE

1. [¿Qué es Dentaxy?](#1-qué-es-dentaxy)
2. [La Empresa, el Fundador y la Filosofía de Aprendizaje](#2-la-empresa-el-fundador-y-la-filosofía-de-aprendizaje)
3. [El Problema que Resuelve](#3-el-problema-que-resuelve)
4. [Público Objetivo](#4-público-objetivo)
5. [El Ecosistema de Productos (Eje Dentaxy Seed)](#5-el-ecosistema-de-productos-eje-dentaxy-seed)
6. [La Soberanía de Datos: Ecosistema Google Invisible](#6-la-soberanía-de-datos-ecosistema-google-invisible)
7. [El Principio de "IA Sin API" (Local y Determinista)](#7-el-principio-de-ia-sin-api-local-y-determinista)
8. [Arquitectura Tecnológica Completa](#8-arquitectura-tecnológica-completa)
9. [El Motor Clínico — DentaxyFormPanel](#9-el-motor-clínico--dentaxyformpanel)
10. [Las 22 Secciones de la Historia Clínica (NOM-004-SSA3-2012)](#10-las-22-secciones-de-la-historia-clínica-nom-004-ssa3-2012)
11. [Odontograma por Voz en Español](#11-odontograma-por-voz-en-español)
12. [El Panel de Administración y Nexus P2P](#12-el-panel-de-administración-y-nexus-p2p)
13. [Sistema de Demos y Control de Acceso (DemoGuard)](#13-sistema-de-demos-y-control-de-acceso-demoguard)
14. [Dentaxy Shop y Monetización Cruzada](#14-dentaxy-shop-y-monetización-cruzada)
15. [Dentaxy Seed (Plan Maestro de 90 Días y XPRIZE)](#15-dentaxy-seed-plan-maestro-de-90-días-y-xprize)
16. [El Agente Concierge Interactivo Híbrido](#16-el-agente-concierge-interactivo-híbrido)
17. [Dentaxy Universidades: La Presentación Interactiva](#17-dentaxy-universidades-la-presentación-interactiva)
18. [Supabase y Esquema de Base de Datos](#18-supabase-y-esquema-de-base-de-datos)
19. [Identidad Visual, Marca y Diseño Emotivo](#19-identidad-visual-marca-y-diseño-emotivo)
20. [Historial de Evolución (2022–2026)](#20-historial-de-evolución-20222026)
21. [Contexto de Alianzas y Validación (El Triunfo UAZ)](#21-contexto-de-alianzas-y-validación-el-triunfo-uaz)
22. [Reglas de Desarrollo (Para la IA)](#22-reglas-de-desarrollo-para-la-ia)
23. [Estructura de Archivos Completa](#23-estructura-de-archivos-completa)
24. [Rutas Activas e Indexación](#24-rutas-activas-e-indexación)

---

## 1. ¿Qué es Dentaxy?

**Dentaxy** (`dentaxy.com`) es una plataforma de infraestructura y salud digital que está revolucionando la odontología en México y el mercado hispanohablante al erradicar completamente el uso de papel en los expedientes clínicos. 

Dentaxy representa la primera gran obra de **La Colección VanGox** —una suite de software vertical dedicada a dignificar y automatizar las profesiones más sobrecargadas administrativamente del mundo de habla hispana (incluyendo desarrollos planificados como *MedeXy* para medicina general y *NutriXion* para nutrición).

**En una frase:** Dentaxy convierte la agobiante carga burocrática del dentista en un flujo digital automatizado de **costo marginal $0**, con un motor clínico que se siente como IA pero procesa los datos 100% de manera local y descentralizada en el dispositivo del doctor.

---

## 2. La Empresa, el Fundador y la Filosofía de Aprendizaje

### Datos de la Empresa
- **Razón Social:** Dentaxy Technologies
- **Estudio Matriz:** VanGox Studio (La Colección VanGox)
- **Fundador & CTO:** Braulio Zavala Uribe
- **Ubicación:** Zacatecas, México
- **Timing Tecnológico:** 4 años de desarrollo independiente (2022–2026) culminando en el despliegue del ecosistema Seed y la postulación al hackatón XPRIZE en Los Ángeles.

### El Perfil del Fundador (Braulio Zavala Uribe)
Braulio Zavala Uribe es un **desarrollador y fundador neurodivergente con altas capacidades cognitivas** y un modelo de aprendizaje profundamente autodidacta. Su capacidad para conceptualizar sistemas hiper-complejos le ha permitido construir, de forma solitaria, un ecosistema de software que supera las 103,400 líneas de código estructurado de grado empresarial.

> [!NOTE]
> **Filosofía de Certificaciones y Validación:**
> Al ser un autodidacta de alto rendimiento, Braulio adquiere conocimientos técnicos, clínicos y de negocios a través de la investigación directa de documentos científicos, código fuente y experimentación autónoma. Sus certificaciones —como el certificado de finalización del curso *"Cómo crear y lanzar una empresa"* (concluido el 6 de abril de 2026, con duración de 6 horas en 2 módulos con autoevaluación) o sus credenciales otorgadas por Google— son perseguidas y presentadas de manera estratégica para fines de **validación institucional y formalidad externa** ante universidades, corporativos y comités de inversión que requieren metodologías tradicionales de acreditación, más que como su vía primaria de adquisición de conocimiento.

---

## 3. El Problema que Resuelve

El sistema de salud y la formación odontológica actual se enfrentan a **4 Ejes Críticos** insostenibles que bloquean el desarrollo profesional y dañan la rentabilidad:

| Eje Crítico | El Status Quo | El Impacto Real | La Solución Dentaxy |
|---|---|---|---|
| 🎓 **Formación Clínica** | El 70% de la jornada se consume en burocracia manual (historias clínicas en papel de 22 secciones). | Sub-optimización: el alumno de odontología egresa con menos horas de práctica real. | **ECE (Expediente Clínico Electrónico)** interactivo con motor local predictivo. |
| 📋 **Control Académico** | Seguimiento en firmas físicas, listas de papel y datos aislados. | Vulnerabilidad: falta de trazabilidad, riesgo de fraude y pérdida de expedientes escolares. | **UAO Sync:** Panel de supervisión docente en tiempo real. |
| 💰 **Soberanía Financiera** | Cobros en efectivo, registros dispersos y opacidad en el flujo de caja. | Descapitalización y falta de control sobre los ingresos reales del consultorio. | **Dentaxy MyLana:** Módulo financiero ultra-simple integrado. |
| 🔧 **Activos e Insumos** | Inventarios manuales, material "invisible" y desabasto constante. | Fuga de capital: pérdida recurrente de patrimonio clínico y retrasos de tratamiento. | **Dentaxy Shop:** E-commerce cerrado y control de inventario local. |

### Rigor Científico y Fórmulas de Eficiencia

Dentaxy modela la carga cognitiva y de tiempo mediante análisis matemáticos validados.

#### 1. Reducción de la Carga Cognitiva ($C_L$)
La carga cognitiva en el llenado manual de 22 secciones clínicas se modela como:
$$C_L = \sum_{i=1}^{N} \frac{D_i \cdot T_i}{S_i}$$
Donde:
- $D_i$ representa la dificultad clínica inherente a la sección $i$.
- $T_i$ es el tiempo consumido en la redacción manual.
- $S_i$ es el soporte tecnológico de automatización de Dentaxy. Cuando el motor de redacción determinista actúa ($S_i \to \infty$), el tiempo de redacción tiende a cero y la carga cognitiva disminuye de forma exponencial, liberando ancho de banda mental para el cuidado del paciente.

#### 2. Eficiencia en la Gestión de Tiempo ($\eta$)
La eficiencia clínica se calcula mediante la fórmula:
$$\eta = \frac{T_{manual} - T_{dentaxy}}{T_{manual}} \times 100\%$$
Considerando los promedios validados clínicamente en universidades mexicanas:
$$\eta = \frac{168\text{ min} - 38\text{ min}}{168\text{ min}} \times 100\% \approx 77.38\%$$
Dentaxy reduce el tiempo invertido en burocracia de **2.8 horas (168 minutos) a solo 38 minutos**, con un costo de tokens marginal e invariable de **$0.00 USD**.

---

## 4. Público Objetivo

1. **Universidades e Instituciones Educativas (UAZ, CLIMUZAC, etc.):** Facultades que requieren auditar y supervisar a cientos de alumnos en formación en tiempo real bajo estrictos estándares clínicos.
2. **Dentistas Profesionales Egresados:** Jóvenes odontólogos que salen al mercado laboral y necesitan digitalizar su consultorio sin la fricción ni los costos prohibitivos de los softwares tradicionales.
3. **Clínicas Privadas y Especialistas (CROID, Cadenas):** Clínicas que necesitan estandarización legal, velocidad en consulta y soberanía total sobre su información.

---

## 5. El Ecosistema de Productos (Eje Dentaxy Seed)

El universo Dentaxy está diseñado en una topología de módulos interconectados donde **Dentaxy Seed** actúa como el núcleo principal de entrada y conversión.

```
                  ┌────────────────────────────────────────┐
                  │          La Colección VanGox           │
                  └───────────────────┬────────────────────┘
                                      │
                  ┌───────────────────▼────────────────────┐
                  │             DENTAXY SEED               │
                  │   (Núcleo del Consultorio y Alumno)    │
                  └─────────┬───────────────────┬──────────┘
                            │                   │
         ┌──────────────────▼──┐             ┌──▼──────────────────┐
         │    Dentaxy Shop     │             │     Dentaxy Lab     │
         │ (Insumos con Stripe)│             │ (Escaneos 3D y RX)  │
         └──────────────────┬──┘             └──┬──────────────────┘
                            │                   │
         ┌──────────────────▼──┐             ┌──▼──────────────────┐
         │ Dentaxy Club/Space  │             │  Dentaxy Aura/News  │
         │ (Diseño y Networking│             │ (Cédulas y Ciencia) │
         └──────────────────┬──┘             └──┬──────────────────┘
                            │                   │
         ┌──────────────────▼──┐             ┌──▼──────────────────┐
         │   Dentaxy MyLana    │             │ Motor Stark/Neuronal│
         │ (Finanzas en Sheets)│             │  (Cornerstone DICOM)│
         └─────────────────────┘             └─────────────────────┘
```

1. **Dentaxy Seed:** El núcleo clínico-educativo. Formación universitaria conectada con la práctica privada. Incluye el motor de 22 secciones y subdominios personalizados.
2. **Dentaxy Shop:** E-commerce privado de insumos odontológicos integrado con Stripe Checkout. Los dentistas compran sus materiales directamente desde su flujo de trabajo.
3. **Dentaxy Lab:** Eje de comunicación digital que conecta el consultorio con laboratorios de impresión 3D y escaneo dental, permitiendo transferencias de archivos STL y Rx.
4. **Dentaxy Club & Space:** Plataforma de networking profesional y servicio premium de diseño de interiores y arquitectura física para clínicas dentales de alta tecnología.
5. **Dentaxy Aura & News:** Identidad digital médica verificada automáticamente a través de la SEP (cédula profesional) acoplada con un lector de feed científico y casos clínicos.
6. **Dentaxy MyLana:** Mapeo de ingresos y egresos de manera ultra-simple. Genera reportes en tiempo real directamente en la nube del usuario.
7. **Motor Stark & Neuronal:** Visor DICOM nativo ultraligero que permite leer radiografías en formato `.dcm` localmente mediante CornerstoneJS 4 sin complementos externos.

---

## 6. La Soberanía de Datos: Ecosistema Google Invisible

La mayor innovación arquitectónica de Dentaxy y su mayor diferenciador contra competidores tradicionales (como Dentalink o Smile Software) radica en la **Soberanía y Descentralización de los Datos Médicos**.

En lugar de almacenar expedientes y datos personales de salud en servidores centrales de Dentaxy —lo cual representa un riesgo legal gigantesco en México (Ley Federal de Protección de Datos Personales en Posesión de Particulares) y altos costos de almacenamiento—, Dentaxy implementa el **Ecosistema Google Invisible**:

```
                       ┌─────────────────────────┐
                       │   Interfaz de Dentaxy   │
                       └────────────┬────────────┘
                                    │ (OAuth2)
                      ┌─────────────▼─────────────┐
                      │    API Google Invisible   │
                      └─────────────┬─────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         │                          │                          │
┌────────▼────────┐        ┌────────▼────────┐        ┌────────▼────────┐
│  Google Drive   │        │ Google Calendar │        │  Google Sheets  │
│  (Expedientes   │        │ (Agenda y Citas │        │ (Finanzas con   │
│   HTML/Docs)    │        │  Sincronizadas) │        │  MyLana Local)  │
└─────────────────┘        └─────────────────┘        └─────────────────┘
```

- **Google Drive API (Soberanía Absoluta):** El doctor inicia sesión de forma segura y autoriza a Dentaxy a interactuar con su propia cuenta de Google. Dentaxy crea de forma transparente una estructura de carpetas en el Drive personal del doctor: `Dentaxy Seed/Expedientes/[Folio]-[Nombre Paciente].html`. Al guardar un expediente, el HTML renderizado se sube de forma instantánea al Drive del doctor. Si el doctor decide dejar Dentaxy mañana, sus expedientes clínicos siguen siendo de su propiedad en su propia cuenta de Google.
- **Google Calendar API (Agenda Gratis e Invisible):** Las citas y consultas generadas en Dentaxy se inyectan directamente en el Google Calendar personal del odontólogo, disparando alertas nativas y notificaciones móviles de forma automática al paciente y al doctor sin requerir servidores de mensajería adicionales.
- **Google Sheets API (MyLana Financiero):** Los ingresos y egresos registrados en el módulo financiero de Dentaxy se sincronizan con una hoja de cálculo estructurada en el Drive del doctor, permitiéndole interactuar con sus finanzas tanto en Dentaxy como directamente en Excel o Sheets.
- **Google Docs & Forms:** Genera notas clínicas editables mediante Google Docs y permite crear pre-consultas inteligentes a través de Google Forms nativos cuyos datos se importan automáticamente al expediente clínico de Dentaxy.
- **Google Meet:** Integra teleconsultas instantáneas sin costos de infraestructura de videollamada para el consultorio.

---

## 7. El Principio de "IA Sin API" (Local y Determinista)

> **REGLA FUNDAMENTAL DE INGENIERÍA:** Dentaxy NO utiliza llamadas a APIs de lenguaje externas (como GPT-4o, Claude 3.5, etc.) para la generación del texto de los expedientes médicos.

Esta decisión arquitectónica estratégica proporciona las siguientes ventajas operativas y comerciales:

1. **Costo Marginal Cero ($0.00):** Escalar a 100,000 consultorios no incrementa el costo de computación de IA. El procesamiento se ejecuta en el procesador del cliente.
2. **Latencia <1ms:** Generación instantánea en tiempo real sin esperas de red.
3. **Privacidad Militar (PHI-Safe):** Los datos médicos estructurados nunca son expuestos a empresas de inteligencia artificial externas.
4. **Ausencia Total de Alucinaciones:** Un error en un expediente clínico puede costar una demanda legal. Dentaxy utiliza lógica combinatoria determinista y templates clínicos robustos estructurados mediante TypeScript y helpers semánticos.

```typescript
// Ejemplo conceptual del motor determinista local en JavaScript/TypeScript
export const generarExamenCabeza = (valores: ExamenCabezaForm) => {
  const { articulacion, musculos, asimetria } = valores;
  
  const intro = "A la inspección clínica de la cabeza y estructuras cráneo-faciales, ";
  const asimetriaText = asimetria 
    ? "se observa una ligera asimetría facial aparente a expensas de la línea media. "
    : "se aprecia una simetría facial conservada, proporcional en sus tres tercios faciales. ";
    
  const atmText = articulacion === "normal"
    ? "La articulación craneomandibular se reporta asintomática, con movimientos de apertura y cierre normales."
    : `Se detecta alteración funcional en articulación craneomandibular caracterizada por ${articulacion}.`;

  return `${intro}${asimetriaText}${atmText}`;
};
```

---

## 8. Arquitectura Tecnológica Completa

- **Framework:** React 18 + TypeScript (tipado estricto)
- **Compilador:** Vite 5
- **Estilos:** Vanilla CSS / TailwindCSS 3 (estilos fluidos y premium)
- **Animaciones:** Framer Motion 12 + Apple Dock Custom Interpolation
- **Base de Datos & Backend:** Supabase (PostgreSQL para metadata de usuarios, autenticación y base de datos Realtime)
- **Imagenología:** CornerstoneJS v4 (visor nativo DICOM para radiografías)
- **Sincronización:** Google OAuth2 + Google APIs v3 nativas en cliente
- **Pasarela de Pagos:** Stripe Checkout (tienda de insumos Shop)

---

## 9. El Motor Clínico — DentaxyFormPanel

El orquestador de la historia clínica es `DentaxyFormPanel.tsx`. Utiliza un sistema de **Progressive Disclosure** (diseño paso a paso de carga cognitiva mínima) y **localStorage síncrono** que evita cualquier pérdida de información si el navegador se cierra.

### Estados y Flujo
El motor transiciona dinámicamente entre el modo `form` (entrada de variables de selección simple, radio buttons o campos de texto guiados) y el modo `redaction` (el renderizado simulador del texto clínico en tipografía tipo máquina de escribir clásica Apple-style).

---

## 10. Las 22 Secciones de la Historia Clínica (NOM-004-SSA3-2012)

Dentaxy implementa con rigor absoluto la norma oficial mexicana de expediente clínico, dividida en 22 secciones interconectadas:

1. **Padecimiento Actual:** Motivo principal y semiología de la consulta.
2. **Antecedentes Heredofamiliares:** Historial de patologías genéticas directas.
3. **Antecedentes No Patológicos:** Hábitos de higiene, alimentación y estilo de vida.
4. **Antecedentes Patológicos:** Enfermedades sistémicas del paciente.
5. **Antecedentes Alérgicos:** Alergias a medicamentos, alimentos o látex.
6. **Antecedentes Quirúrgicos:** Operaciones y cirugías previas.
7. **Antecedentes Hemorrágicos:** Trastornos de coagulación o sangrados excesivos.
8. **Antecedentes Gineco-obstétricos:** Historial obstétrico (cuando aplica).
9. **Interrogatorio por Aparatos y Sistemas (complejo, 8 sistemas):** Gastrointestinal, respiratorio, cardiovascular, genitourinario, endocrino, tegumentario, músculo-esquelético y nervioso.
10. **Exploración Física:** Signos vitales completos e inspección somática general.
11. **Examen de Cabeza:** Inspección de cráneo y proporciones faciales.
12. **Articulación Craneomandibular (ATM):** Ruidos, dolor y rango de apertura.
13. **Examen de Cuello:** Cadena ganglionar y tiroides.
14. **Examen Intrabucal:** Tejidos blandos, carrillos, paladar, encías y lengua.
15. **Glándulas Salivales:** Conductos de Stenon/Wharton, permeabilidad y xerostomía.
16. **Oclusión:** Clasificación de Angle, llaves molar y canina.
17. **Relación de Dientes:** Malposiciones y apiñamientos aparentes.
18. **Línea Media:** Desviaciones dentales vs esqueléticas.
19. **Frenillos:** Inserciones labiales, linguales y limitaciones de movilidad.
20. **Odontograma Interactivo:** Registro anatómico dental de 32 dientes permanentes + 20 deciduos.
21. **Diagnóstico:** Codificación clínica presuntiva o definitiva.
22. **Pronóstico y Plan de Tratamiento:** Firma, folio y propuesta terapéutica estructurada.

---

## 11. Odontograma por Voz en Español

Construido bajo un principio de hiperfoco en un solo día, el **Odontograma por Voz** de Dentaxy es una innovación única en el mercado hispanohablante.

- **Tecnología:** Web Speech API nativa (sin procesamiento en servidores externos, costo $0).
- **Funcionamiento:** Escucha de manera pasiva y parsea la sintaxis clínica estándar dental: **"od 21 caries mesial"**, **"od 36 ausente"**, **"od 18 restauración oclusal"**.
- **Acción Inmediata:** La cara anatómica del diente dibujado en formato SVG puro cambia instantáneamente de color (rojo para caries, azul para restauraciones, negro para ausente, etc.) bajo la norma ADA.
- **Valor Clínico:** El dentista trabaja de forma estéril y "manos libres", eliminando la fricción de tocar pantallas o teclados con guantes contaminados y eliminando la necesidad de contar con un asistente dental físico en sala para transcribir el odontograma.

---

## 12. El Panel de Administración y Nexus P2P

El Panel de Control de Dentaxy (`/admin`) permite monitorizar el estado de la aplicación mediante telemetría en tiempo real:

- **Ecosystem Control:** Habilita o deshabilita módulos globalmente de forma síncrona en todos los clientes conectados a través del canal Realtime de Supabase.
- **Nexus P2P:** Protocolo de sincronización local utilizando WebRTC (PeerJS) que permite a las sucursales compartir metadata local y bases de datos directamente sin pasar por servidores en la nube.
- **Biometric Login:** Seguridad biométrica Passkeys (WebAuthn) con claves criptográficas para proteger los datos administrativos de la aplicación de ataques de fuerza bruta.

---

## 13. Sistema de Demos y Control de Acceso (DemoGuard)

Para proteger y monetizar los módulos más premium del ecosistema, Dentaxy cuenta con el componente `DemoGuard.tsx`.

El acceso no autorizado se restringe de manera automática, solicitando un `demo_session_token` de Supabase. El admin puede generar tokens con límites de usos y fechas de expiración exactas, obteniendo estadísticas GPS y telemetría de cada usuario que explora el sistema de demostración de Dentaxy.

---

## 14. Dentaxy Shop y Monetización Cruzada

El módulo de e-commerce privado de insumos dentales (`/shop/tienda`) permite generar monetización cruzada de altísima rentabilidad:

- **Stripe Checkout integrado:** Venta directa de material (resinas, guantes, instrumental de alta gama) integrado directamente con el inventario del consultorio.
- **Efecto Multipicador:** Si el consultorio registra que el stock de anestesia está llegando a niveles críticos durante la consulta, el sistema puede proponer la compra con un solo clic desde el panel de Dentaxy, convirtiendo un canal de soporte administrativo en un motor generador de transacciones recurrentes.

---

## 15. Dentaxy Seed (Plan Maestro de 90 Días y XPRIZE)

Para el Hackatón de XPRIZE en Los Ángeles, el foco absoluto es el desarrollo y maduración en 90 días de **Dentaxy Seed** para consolidar el modelo de negocio en universidades y consultorios independientes de México.

### 📅 Plan Maestro Semana a Semana (Fase Crítica Sprint 1)

```
┌───────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐
│  Martes   │───>│ Miércoles │───>│  Jueves   │───>│  Viernes  │───>│  Sábado   │
│ 22 Secs   │    │ Google    │    │ Historial │    │ UX + Voz  │    │Prueba Real│
│ Perfectas │    │ Drive Sync│    │  y Citas  │    │ en Tablet │    │ en CROID  │
└───────────┘    └───────────┘    └───────────┘    └───────────┘    └───────────┘
```

- **Martes (Hoy):** Pulido final de las 22 secciones de historia clínica. Verificación de renderizado impecable en modo pantalla dividida (Split Screen).
- **Miércoles (Crítico):** Sincronización transparente con Google Drive. Creación de la plantilla HTML del expediente con membrete oficial y subida inmediata al Drive del doctor al presionar "Guardar".
- **Jueves:** Sincronización con Google Calendar. Creación y calendarización automática de citas desde el panel de Dentaxy y visualización interna del historial de pacientes recuperando la metadata desde Drive.
- **Viernes:** Optimización visual adaptativa (Responsive) para tablets (dispositivo de uso primario por los odontólogos) y asistente de voz en el navegador.
- **Sábado (Prueba de Fuego):** Prueba real en consultorio clínico (CROID / CLIMUZAC). El odontólogo utiliza el sistema de forma autónoma sin asistencia humana. Corrección inmediata nocturna de puntos de fricción observados.
- **Lunes:** Puesta en producción y despliegue del software vivo con cero fricciones operativas.

### 💰 Estructura de Precios Transparente y Rentable

| Plan | Costo Mensual | Características Incluidas | Limitaciones |
|---|---|---|---|
| **Semilla** | **$149 MXN/mes** *(Precio fundador)* | 22 secciones de Historia Clínica, motor determinista local $0, sincronización a Drive y subdominio personalizado. | Sin Google Calendar, sin comandos de voz. |
| **Raíz** | **$249 MXN/mes** *(Lanzamiento oficial)* | Todo lo del plan Semilla + Sincronización con Google Calendar, comandos de voz básicos y visor DICOM. | Sin reporte financiero avanzado. |
| **Clínica** | **$349 MXN/mes** *(Enterprise)* | Todo lo del plan Raíz + MyLana financiero sincronizado con Google Sheets, Google Forms de pre-consulta y soporte prioritario. | Hasta 2 doctores por sucursal. |

### Criterios de Éxito: "El Test del Doctor de 40 Años"
El software Dentaxy Seed se considera aprobado y listo para comercialización únicamente cuando un odontólogo de 40 años sin afinidad especial por la tecnología es capaz de:
1. Iniciar sesión y autenticar su cuenta de Google de forma autónoma.
2. Completar un expediente clínico completo sin requerir asistencia telefónica o técnica.
3. Observar la aparición inmediata del archivo HTML en su Google Drive.
4. Generar la siguiente cita en el calendario interno de Dentaxy de forma fluida.

---

## 16. El Agente Concierge Interactivo Híbrido

Para la próxima semana está programado el despliegue del **Agente Concierge Interactivo Híbrido**, una pieza de software clave para optimizar la retención y la conversión de clientes en la plataforma.

### 🤖 Arquitectura del Concierge Agent

El Concierge es un agente interactivo visible en pantalla que actúa como asistente y guía del usuario en tiempo real. Puede navegar de forma inteligente por la página web, mover secciones de Dentaxy, hacer scroll automático, rellenar campos de demostración y acompañar visualmente al doctor.

Para evitar costos inviables de infraestructura de inteligencia artificial y garantizar la **rentabilidad absoluta del negocio**, el agente concierge implementa una **arquitectura híbrida**:

```
                       ┌─────────────────────────┐
                       │  Input del Odontólogo   │
                       └────────────┬────────────┘
                                    │
                      ┌─────────────▼─────────────┐
                      │   Clasificador de Input   │
                      └─────────────┬─────────────┘
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         │ (Coincidencia con Reglas Locales: 90%)              │ (Intención Compleja: 10%)
┌────────▼────────┐                                   ┌────────▼────────┐
│  Código Puro    │                                   │   Gemini API    │
│  (Costo $0)     │                                   │   (Costo Mín)   │
├─────────────────┤                                   ├─────────────────┤
│ Acciones pre-   │                                   │ Inferencia de   │
│ codificadas:    │                                   │ intenciones no  │
│ - "Muéstrame"   │                                   │ mapeadas y      │
│ - "Navega a"    │                                   │ comandos        │
│ - "Precios"     │                                   │ complejos.      │
└─────────────────┘                                   └─────────────────┘
```

- **Capa Local Determinista (Código Puro - 90% de los casos):** Si el usuario escribe consultas previsibles u operativas como *"¿cuánto cuesta el plan clínica?"*, *"muéstrame el odontograma"* o *"quiero ver el historial de pacientes"*, el sistema mapea la consulta mediante expresiones regulares y tokens locales de forma síncrona, ejecutando las acciones de scroll y despliegue del componente a costo de tokens cero y velocidad inmediata.
- **Capa de Inteligencia Cognitiva (Gemini API - 10% de los casos):** Solo en caso de que el usuario formule una intención compleja o ambigua que no pueda ser mapeada por la capa determinista, la aplicación consume de forma balanceada la API de Gemini para analizar la intención del usuario y transformarla en comandos estructurados que el agente del navegador ejecuta en la UI local.

---

## 17. Dentaxy Universidades: La Presentación Interactiva

Para la validación del modelo B2B e institucional, Dentaxy cuenta con la ruta `/demo/presentacion`, un sistema de demostración de **12 slides interactivos** controlados remotamente por el panel administrativo.

- **Glassmorphic UI:** Interfaz basada en HSL tailoreado y efectos de desenfoque de fondo (.glass y .glass-heavy) con tipografías premium como *Syne* y *Space Grotesk*.
- **Realtime Rating:** Los directivos académicos que visualizan la presentación pueden calificar el proyecto en tiempo real otorgando estrellas (1–5). Sus votos se visualizan al instante en la diapositiva final de resultados gracias a la base reactiva de Supabase.

---

## 18. Supabase y Esquema de Base de Datos

Las tablas principales almacenan metadata e información administrativa, asegurando que ningún dato clínico comprometido de pacientes resida en la infraestructura central:

- `dentaxy_modules`: Habilitación en tiempo real de módulos del ecosistema.
- `demo_sessions`: Registro de uso, ubicaciones geográficas y telemetría de accesos a demos.
- `waitlist_users`: Tabla de leads y preventa conectada con Google Apps Script.
- `presentation_ratings`: Calificaciones en tiempo real para demos universitarios.

---

## 19. Identidad Visual, Marca y Diseño Emotivo

La interfaz de Dentaxy huye de la estética monótona y deprimente de los portales de salud gubernamentales o tradicionales. Dentaxy evoca sofisticación visual de grado premium:

- **Paleta de Colores Curada:** `#1D9E75` (Emerald Mint primario), `#1A73E8` (Google Blue de integración), `#0A0A0F` (Void Black de fondo profundo), y gradientes dinámicos HSL.
- **Glassmorphism:** Uso estratégico de fondos traslúcidos difuminados, sombras sutiles y micro-interacciones responsivas de Framer Motion.
- **Tipografía de Carácter:** *Bricolage Grotesque* para un tono moderno pero riguroso, mezclada con la elegancia literaria de *Instrument Serif* y el detalle tecnológico de *DM Mono*.

---

## 20. Historial de Evolución (2022–2026)

- **2022-2023 (Los Orígenes):** Concepción teórica y creación del motor local determinista de redacción en fase de pruebas primarias.
- **2024 (La Arquitectura):** Creación del gestor de estados globales de la historia clínica `useHistoriaClinica` y el visor DICOM integrado.
- **2025 (La Expansión):** Desarrollo del ecosistema del Shop, control de acceso mediante tokens y biometría Passkeys en `/admin`.
- **2026 (El Momento Zero y XPRIZE):** Despliegue de Dentaxy Seed, integración de almacenamiento en Google Drive invisible, odontograma por voz, y preparación final para la validación comercial en CROID y la UAZ.

---

## 21. Contexto de Alianzas y Validación (El Triunfo UAZ)

El mayor aval del ecosistema Dentaxy está compuesto por sus alianzas directas en el estado de Zacatecas:

- **1er Lugar de Investigación Académica:** Otorgado formalmente en las **Jornadas Internacionales de Investigación de la UAZ**, validando el impacto metodológico de la reducción del 77% del tiempo burocrático y la erradicación del error de expediente en alumnos.
- **LOI UAZ en Negociación:** Una propuesta formal de implementación valorada en **$330,000 MXN** que abarca los campus CLIMUZAC, CLIZAC, CLICAMP y CLIJANIS bajo el sistema UAO Sync, validando el encaje de mercado institucional antes del lanzamiento público general del ecosistema.

---

## 22. Reglas de Desarrollo (Para la IA)

Si eres una IA actuando como Ingeniero de Software Senior en este proyecto, tus lineamientos obligatorios son:

### NUNCA
- ❌ Romper la regla del **costo marginal $0**: no agregues APIs externas para la redacción clínica.
- ❌ Modificar o eliminar la estructura de las **22 secciones** NOM-004-SSA3-2012 sin consultar al fundador.
- ❌ Guardar información confidencial de salud (PHI) de pacientes en las tablas globales de Supabase (recuerda que para eso existe el almacenamiento directo en el Drive del doctor).
- ❌ Usar inglés en interacciones, documentación de código o comentarios (regla: strictly Spanish).

### SIEMPRE
- ✅ Diseñar interfaces premium, responsivas y de estética "Wow" inspiradas en Google Design y VanGox Studio.
- ✅ Respetar y validar los flujos de `localStorage` y persistencia síncrona en el cliente.
- ✅ Escribir código escalable bajo TypeScript estructurado y modularizado.

---

## 23. Estructura de Archivos Completa

El codebase se organiza en módulos lógicos que facilitan el escalamiento síncrono del sistema operativo:

```
/Dentaxy-lab
├── src/
│   ├── App.tsx                         → Router con todas las vistas de la app
│   ├── main.tsx                        → Punto de entrada React
│   │
│   ├── app/
│   │   ├── core/page.tsx               → Dentaxy Core
│   │   └── singularity/page.tsx        → Vista conceptual de IA
│   │
│   ├── components/
│   │   ├── AppleStyleDock.tsx          → Dock interactivo
│   │   ├── MedicationSearch.tsx        → Buscador médico local
│   │   │
│   │   ├── academico/                  → Módulo universitario
│   │   │   ├── DentaxyFormPanel.tsx    → MOTOR CLÍNICO ORQUESTADOR
│   │   │   ├── SmileEspejoPanel.tsx    → Vista paralela del expediente
│   │   │   ├── VistaDocumento.tsx      → Render de PDF imprimible
│   │   │   └── ui/
│   │   │       ├── ProgressLine.tsx    → Progress bar interactiva de 22 nodos
│   │   │       └── CommandDock.tsx     → Dock inferior de navegación
│   │   │
│   │   ├── admin/                      → Componentes de administración
│   │   │   ├── BiometricLogin.tsx      → Passkeys / WebAuthn
│   │   │   └── ...
│   │   │
│   │   ├── historia-clinica/           → Los 22 componentes de formulario
│   │   │   ├── InterrogatorioSistemas.tsx
│   │   │   └── ...
│   │   │
│   │   └── shop/                       → Módulo de tienda
│   │
│   ├── contexts/
│   │   ├── AcademicoContext.tsx        → Estado clínico universitario
│   │   └── AuthContext.tsx             → Gestión de usuarios
│   │
│   ├── hooks/
│   │   ├── useHistoriaClinica.ts       → Hook de persistencia y estado de formulario
│   │   └── useGenerarTodasRedacciones.ts → Script de automatización de consulta
│   │
│   ├── pages/
│   │   ├── Landing.tsx                 → Home de dentaxy.com
│   │   ├── ModulesHub.tsx              → Hub de accesos a módulos
│   │   │
│   │   ├── admin/                      → Vistas de administración
│   │   │   ├── Dashboard.tsx           → KPIs principales
│   │   │   ├── SeedManager.tsx         → Control de leads de Seed
│   │   │   └── ...
│   │   │
│   │   └── seed/                       → Entorno Seed
│   │       ├── SeedLogin.tsx           → Acceso con Google OAuth2
│   │       ├── SeedLanding.tsx         → Landing de conversión comercial
│   │       └── SeedOnboardingModal.tsx → Onboarding guiado para doctores
│   │
│   └── utils/
│
├── DENTAXY_MASTER_CONTEXT.md          → Este manual de la verdad
├── XPRIZE_SUBMISSION.md                → Propuesta de postulación en Los Ángeles
└── package.json
```

---

## 24. Rutas Activas e Indexación

| Ruta | Componente | Propósito Comercial |
|---|---|---|
| `/` | Landing | Posicionamiento de marca |
| `/seed/overview` | SeedLanding | Captación de consultorios privados ($249 MXN) |
| `/seed` | SeedLogin | Autenticación y acceso a Seed |
| `/demo/ai` | AIDemo | Prueba del motor de 22 secciones sin cuenta |
| `/demo/dicom` | DICOMDemo | Demostración del visualizador panorámico local |
| `/shop/tienda` | Shop | Canal de monetización cruzada de insumos |
| `/academico` | AcademicoDemo | Gestión universitaria de avance clínico |
| `/admin/dashboard` | AdminDashboard | Monitorización de tracción y telemetría de base |

---
*Este documento es la fuente de verdad absoluta de Dentaxy. Ninguna modificación arquitectónica debe llevarse a cabo omitiendo estas directrices. El que define la categoría no compite, dicta las reglas.*
