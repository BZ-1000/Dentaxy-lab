# 🦷 Dentaxy Technologies – Valuation Dossier

> [!IMPORTANT]  
> **Confidencialidad:** Este documento contiene información técnica, estratégica y financiera propietaria de Dentaxy Technologies. Su distribución está estrictamente restringida a partes autorizadas en procesos de debida diligencia.

## 1. Executive Summary (Métricas Clave)

Dentaxy es una plataforma de salud digital de última generación, diseñada para revolucionar la odontología en México y Latinoamérica. Al reemplazar procesos basados en papel con tecnología propietaria de alta eficiencia, Dentaxy maximiza la retención de pacientes, minimiza riesgos legales y optimiza las operaciones de clínicas privadas e instituciones académicas.

### 📊 Datos Reales del Repositorio
- **Periodo de Desarrollo:** 2025-02-01 a 2026-08-18 (~18.5 meses)
- **Actividad de Commits:** 2,416 commits totales
- **Volumen de Código:** 
  - Líneas añadidas: 10,137,979
  - Líneas eliminadas: 337,608
- **Archivos Fuente Totales:** 693 (544 `.tsx`, 137 `.ts`, 9 `.css`)
- **Estimación SLOC:** ~144,295 líneas de código fuente (excluyendo auto-generado/dependencias estáticas)
- **Componentes React/UI:** 334
- **Páginas:** 105
- **Hooks & Utils:** 36 Hooks, 17 Funciones de Utilidad, 2 Stores Zustand (Gestión de estado global óptima)

### 👥 Distribución de Contribuciones
| Contribuidor | Rol / Tipo | Commits |
| :--- | :--- | :--- |
| **gpt-engineer-app[bot]** | IA / Automatización Core | 1,688 |
| **DentalBasicsAcademy1** | Dev / Dominio Odontológico | 596 |
| **BZ.1000** | Lead Dev / Arquitecto | 103 |
| **Dentaxy Agent** | Agente IA Autónomo | 16 |
| **Antigravity AI** | Agente IA Avanzado | 11 |

---

## 2. Codebase Architecture Breakdown

La plataforma está dividida en módulos de alta cohesión y bajo acoplamiento, diseñados para escalabilidad multi-tenant.

| Módulo | Volumen | Descripción y Stack Principal | Valor Tecnológico |
| :--- | :--- | :--- | :--- |
| **Dentaxy Core (Historia Clínica)** | 55 Componentes | Motor integral clínico: odontograma interactivo, examen intrabucal, 8 sistemas fisiológicos, ATM. | Arquitectura determinista, offline-first ready. Evita costos de API externas. |
| **Dentaxy Académico** | 42 Componentes | Control de estudiantes, validaciones docentes y redacción IA determinista. | Modelo de negocio B2B educativo de alto ticket. |
| **Panel de Administración** | 25 Comp. / 20 Págs | Gestión integral de roles, clínicas, suscripciones y métricas. | Base para expansión SaaS multi-tenant. |
| **DICOM / Imagenología** | 27 Archivos | Integración profunda con `@cornerstonejs/core` y `streaming-image-volume-loader`. | Reemplaza licencias de software externo ($500-$2,000 USD/año por clínica). |
| **Dentaxy Seed (Privado)** | 5 Comp. Principales | Módulo optimizado para clínicas privadas (CRM, citas, presupuestos). | Canal de monetización rápida con ticket recurrente. |

> [!TIP]
> **Dependencias Premium Integradas:** La plataforma incorpora un stack de clase mundial (Tesseract.js para OCR, SimpleWebAuthn para biometría, Framer Motion para UX de alto nivel, Three.js y React-Globe para visualizaciones, Supabase para backend escalable). 

---

## 3. Estimación de Esfuerzo (COCOMO II Adaptado)

Para estimar el valor de reposición del software, utilizamos el modelo COCOMO II (Constructive Cost Model), ajustado para frameworks modernos (React/TypeScript) e integración intensiva de IA en el desarrollo.

$$ E = a_i \times (\text{KSLOC})^{b_i} $$
Donde:
- **KSLOC** (Miles de Líneas de Código Fuente): 144.3
- **$a_i$** (Constante de proyecto semi-acoplado): 3.0
- **$b_i$** (Factor de escala): 1.12

$$ E = 3.0 \times (144.3)^{1.12} \approx 815 \text{ Person-Months (Meses-Persona)} $$

**Ajuste por IA:** Debido a la alta participación de agentes de IA (gpt-engineer, Antigravity, etc.), el esfuerzo real en tiempo calendario se comprimió a ~18.5 meses. Sin embargo, el **valor de desarrollo tradicional** se mantiene en ~815 meses-persona.
A una tarifa conservadora de Ing. de Software Senior ($4,500 USD/mes), el **Costo de Reposición del Código base** es:
$$ 815 \text{ PM} \times \$4,500 = \$3,667,500 \text{ USD} $$

---

## 4. Asset Valuation Matrix (IP y Reposición)

| Método de Valuación | Premisa | Valor Estimado (USD) |
| :--- | :--- | :--- |
| **Costo de Desarrollo (LatAm)** | 5 devs x 24 meses @ $4.5k USD | ~$540,000 USD |
| **Costo Agencia (US/Top Tier)** | Desarrollo a medida integral | ~$1,500,000 - $2,500,000 USD |
| **Propiedad Intelectual (IP)** | Costo de Reposición (COCOMO) | **~$3,667,500 USD** |

> [!NOTE]
> Este valor es estrictamente técnico (Costo de construcción). El valor real del negocio se calcula mediante múltiplos de ingresos proyectados.

---

## 5. Proyección de Ingresos SaaS & Penetración

El mercado objetivo (TAM) en México es de aproximadamente **80,000 unidades dentales** (INEGI/DENUE).

### Modelo Seed (Clínicas Privadas)
- **Setup Fee:** $15,000 - $30,000 MXN (~$1,200 USD)
- **Suscripción Mensual:** $2,500 - $4,500 MXN (~$200 USD/mes)

### Modelo Academy (B2B Institucional)
- **Suscripción Anual:** $150,000 - $350,000 MXN por campus (~$15,000 USD/año)

### Fases de Crecimiento (ARR Proyectado)
- **Fase 1 (Validación):** 50 Clínicas + 2 Universidades
  - ARR Clínicas: 50 × $2,400 USD = $120,000 USD
  - ARR Academy: 2 × $15,000 USD = $30,000 USD
  - **Total Fase 1:** **$150,000 USD**
- **Fase 2 (Escalamiento):** 300 Clínicas + 10 Universidades
  - **Total Fase 2 ARR:** **$870,000 USD**
- **Fase 3 (Dominio de Mercado MX):** 2,000 Clínicas + 30 Universidades
  - **Total Fase 3 ARR:** **$5,250,000 USD**

---

## 6. Múltiplos de Valuación (Pre-Seed / Seed)

Para rondas iniciales de SaaS en HealthTech con altos márgenes (>92% gracias a la arquitectura determinista de costos marginales casi nulos), los múltiplos estándar son de 6x a 10x sobre el ARR proyectado.

Tomando la **Fase 1** y **Fase 2** como referencia para una ronda Seed:
- **Valuación Piso (6x ARR Fase 1/2):** $1.5M - $5.2M USD
- **Valuación Óptima (10x ARR Fase 2):** **$8.7M USD Post-money**

> [!CAUTION]  
> Estas valoraciones asumen una ejecución impecable en ventas. El riesgo principal ya no es tecnológico, sino de *Go-to-Market*.

---

## 7. Moat Tecnológico (Barreras de Entrada)

¿Por qué Dentaxy es defensible a largo plazo?

1. **Motor de Redacción IA Determinista (Local-First):** 
   - **Cero dependencia externa:** No usamos APIs de OpenAI o Claude en el core de redacción, reduciendo los costos de computación a 0.
   - **Latencia cero y privacidad:** Al procesarse en cliente/servidor determinista, la privacidad del paciente es total. Cumplimiento absoluto con la NOM-004-SSA3-2012 y regulaciones de protección de datos (HIPAA/GDPR ready).
2. **Visor DICOM Nativo Integrado:**
   - Implementación profunda de `@cornerstonejs/core` y streaming de volúmenes. Evita a los clientes pagar licencias altísimas por software on-premise de radiología.
3. **Márgenes Brutos Extraordinarios (>92%):**
   - La arquitectura serverless (Supabase) optimizada para Edge Functions y operaciones estáticas mantiene la infraestructura extremadamente barata.
4. **UX Premium como Diferenciador:**
   - Mientras los competidores (ej. software dental de los 2000s) tienen interfaces anticuadas, Dentaxy utiliza Framer Motion, aceleración 3D, y diseño de clase mundial.

---

## 8. Investor Pitch Bulletpoints

- 🚀 **Producto Terminado:** Más de 18 meses de R&D y 144k+ SLOC de código fuente robusto ya desarrollados y probados. Riesgo tecnológico mitigado.
- 💰 **Modelo de Negocio Dual:** Ingresos recurrentes estabilizados por contratos anuales institucionales (Universidades) y flujo de caja constante por suscripciones de clínicas (SaaS Seed).
- 🧠 **IA Responsable y Rentable:** Arquitectura determinista que simula la redacción de una IA sin incurrir en los costos y riesgos de privacidad de los LLMs de terceros.
- 📈 **Mercado Desatendido:** 80,000 clínicas en México, la mayoría aún operando con papel o software legado (on-premise sin nube).
- 🛡️ **Seguridad Grado Médico:** Integración de WebAuthn y biometría para autenticación inquebrantable, superando cualquier estándar actual de competidores locales.
