# DENTAXY FORM: Manual Técnico Completo para IA

> **Propósito de este documento:** Permitir que cualquier IA o ingeniero comprenda a fondo la arquitectura, filosofía de diseño, lógica de estado y motor de redacción local del `DentaxyFormPanel`, el núcleo del sistema clínico de Dentaxy.

---

## 0. Filosofía Fundamental: No-API "IA" Determinista

Antes de entrar al código, es crucial entender la decisión arquitectónica más importante de Dentaxy:

> **"La IA de Dentaxy no llama a ningún LLM externo (OpenAI, Claude, etc.). Todo el texto clínico se genera localmente en el navegador del usuario."**

### ¿Por qué?

| Factor | Solución LLM externo | Solución Dentaxy (Local) |
|---|---|---|
| **Privacidad** | Datos médicos salen al servidor de terceros | Datos nunca salen del navegador (PHI-safe) |
| **Costo** | Miles de tokens = dinero | $0 perpetuo |
| **Velocidad** | 2–8 segundos (latencia de red + inferencia) | ~0ms (cómputo local en JS) |
| **Alucinaciones** | Posibles; el LLM puede inventar | Imposible; el texto viene de templates validados |
| **Confiabilidad** | Depende de que la API esté online | Funciona sin internet |

El resultado es un sistema que **se siente** como IA porque combina lenguaje médico profesional con variaciones gramaticales aleatorias controladas, pero es 100% determinista y controlado.

---

## 1. Mapa Arquitectónico General

```
App.tsx
└── AnalysisModeProvider (Context Global)
    └── DentaxyFormPanel.tsx  ← ORQUESTADOR PRINCIPAL
        ├── useHistoriaClinica()          ← Hook: gestiona el formData central
        ├── useGenerarTodasRedacciones()  ← Hook: automatiza la generación secuencial
        │
        ├── ProgressLine.tsx    ← UI: barra de progreso sticky superior
        │
        ├── AnimatePresence     ← Framer-motion: transición entre secciones
        │   └── SectionCard.tsx      ← UI: wrapper de cada sección
        │       └── [XxxCard].tsx    ← 21 wrappers de sección (en /sections/)
        │           └── [XxxFormComponent].tsx ← Componente de formulario real
        │
        └── CommandDock.tsx     ← UI: barra de controles flotante inferior
```

---

## 2. El Corazón: `DentaxyFormPanel.tsx` — Línea a Línea

Este es el **orquestador** de todo el flujo. Controla en qué sección está el usuario, guarda los textos generados y coordina la UI.

### 2.1 Las 21 Secciones Definidas

```tsx
// DentaxyFormPanel.tsx — Línea 66
const seccionesGenerables = [
  { id: 'padecimiento',       nombre: 'I. Padecimiento Actual' },
  { id: 'heredofamiliares',   nombre: 'II. Antecedentes Heredofamiliares' },
  { id: 'noPatologicos',      nombre: 'III. Antecedentes No Patológicos' },
  { id: 'patologicos',        nombre: 'IV. Antecedentes Patológicos' },
  { id: 'alergicos',          nombre: 'V. Antecedentes Alérgicos' },
  { id: 'quirurgicos',        nombre: 'VI. Antecedentes Quirúrgicos' },
  { id: 'hemorragicos',       nombre: 'VII. Antecedentes Hemorrágicos' },
  { id: 'ginecoObstetricos',  nombre: 'VIII. Antecedentes Gineco-obstétricos' },
  { id: 'interrogatorio',     nombre: 'IX. Interrogatorio por Sistemas' },
  { id: 'exploracionFisica',  nombre: 'X. Exploración Física' },
  { id: 'cabeza',             nombre: 'XI. Examen de Cabeza' },
  { id: 'atm',                nombre: 'XII. Articulación Craneomandibular' },
  { id: 'cuello',             nombre: 'XIII. Examen de Cuello' },
  { id: 'intrabucal',         nombre: 'XIV. Examen Intrabucal' },
  { id: 'salivales',          nombre: 'XV. Glándulas Salivales' },
  { id: 'oclusion',           nombre: 'XVI. Oclusión' },
  { id: 'relacionDientes',    nombre: 'XVII. Relación de Dientes' },
  { id: 'lineaMedia',         nombre: 'XVIII. Línea Media' },
  { id: 'frenillos',          nombre: 'XIX. Frenillos' },
  { id: 'diagnostico',        nombre: 'XX. Diagnóstico' },
  { id: 'pronostico',         nombre: 'XXI. Pronóstico' },
];
```

> **Nota:** La sección `ginecoObstetricos` se filtra si `esMujer === false`. Esto hace que el array activo tenga 20 o 21 elementos.

### 2.2 Estado Central del Panel

```tsx
// DentaxyFormPanel.tsx — Línea 90
const [esMujer] = useState(false);         // Filtro de sección gineco
const [currentStep, setCurrentStep] = useState(0);  // 0-20: sección activa
const [direction, setDirection] = useState(0);       // 1=adelante, -1=atrás
const [viewMode, setViewMode] = useState<ViewMode>('form'); // 'form' | 'redaction'
const [isSectionExpanded, setIsSectionExpanded] = useState(true);
const [generations, setGenerations] = useState<Record<string, any>>({});
// ↑ El objeto más importante: almacena TODOS los textos generados
// { 'padecimiento': "El paciente refiere...", 'interrogatorio': "...", ... }
```

### 2.3 El Hook `useHistoriaClinica` — Fuente de Verdad del Formulario

```tsx
const {
  formData,                            // ← El estado global de TODO el formulario
  handlePadecimientoChange,            // ← Actualizador para la sección I
  handleInterrogatorioChange,          // ← Actualizador para la sección IX
  // ... un handler por sección (21 total)
  toggleService,                       // ← Para toggles de servicios/condiciones
} = useHistoriaClinica();
```

`formData` es un objeto profundo que refleja todos los campos de todas las 21 secciones. Cada `handleXxxChange` actualiza un slice específico de este objeto usando `setState` con spread operator inmutable.

### 2.4 Las Animaciones de Transición entre Secciones

```tsx
// DentaxyFormPanel.tsx — Línea 44
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,  // Entra desde la derecha (avance) o izquierda (retroceso)
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,             // Posición final: centrado
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 50 : -50, // Sale hacia la derecha o izquierda
    opacity: 0
  })
};
```

Estas variantes se usan dentro de `<AnimatePresence mode="wait" custom={direction}>`, dando a cada cambio de sección un deslizamiento direccional que indica al usuario si avanzó o retrocedió.

### 2.5 Renderizado Dinámico de Secciones

```tsx
// DentaxyFormPanel.tsx — Línea 209
const renderCurrentStepContent = () => {
  const section = seccionesActivas[currentStep];

  switch (section.id) {
    case 'padecimiento':
      return <PadecimientoCard
        formData={formData}
        handlePadecimientoChange={handlePadecimientoChange}
        handleDolorChange={handleDolorChange}
        handleSinSintomasChange={handleSinSintomasChange}
        onToggleViewMode={handleToggleViewMode}
        onSeccionGenerada={onSeccionGeneradaProp}
      />;
    // ... 20 cases más, uno por sección
  }
};
```

Es un `switch` simple con un `case` por cada ID de sección. Cada `case` devuelve el componente Card que corresponde, pasando exactamente los handlers necesarios del `formData`.

### 2.6 Callback de Generación Completada

```tsx
// DentaxyFormPanel.tsx — Línea 132
const handleContentGenerated = (seccionId: string, contenido: any, textoPlano?: string) => {
  // Guarda el texto en el objeto central `generations`
  setGenerations(prev => ({ ...prev, [seccionId]: contenido }));

  // Si el componente padre (VistaDocumento/SmileEspejo) escucha, notifica
  if (onSeccionGenerada && typeof contenido === 'string') {
    onSeccionGenerada(seccionId, contenido);
  } else if (onSeccionGenerada && textoPlano) {
    onSeccionGenerada(seccionId, textoPlano);
  }
};
```

Este callback es el "bus de eventos" del panel. Cuando una sección genera texto, lo notifica aquí, y el panel lo almacena en `generations`. Gracias a esto el estado está siempre centralizado aunque cada sección sea un componente independiente.

### 2.7 Lógica de Progreso Visual

```tsx
// DentaxyFormPanel.tsx — Línea 148
const getStepStatuses = () => {
  return seccionesActivas.map((seccion, index) => {
    if (index === currentStep) return 'active';     // Verde brillante + número
    if (generations[seccion.id]) return 'completed'; // Verde completado
    if (seccion.id === 'padecimiento') {             // Caso especial: sin generar botón
      if (formData.padecimientoActual.motivoConsulta?.length > 30)
        return 'completed';
    }
    if (index < currentStep) return 'skipped';       // Gris: pasado sin generar
    return 'pending';                                // Gris: futuro
  });
};
```

Este array de estados (`'active' | 'completed' | 'skipped' | 'pending'`) es el que consume `ProgressLine` para colorear cada nodo de la barra superior.

---

## 3. Componentes UI del Sistema

### 3.1 `ProgressLine.tsx` — La Barra de Progreso Inteligente

**Ubicación:** `src/components/academico/ui/ProgressLine.tsx`

Este componente es más sofisticado de lo que parece. Tiene **dos estados visuales** que se transforman con animación:

#### Estado A: Expandido (no hay scroll)
- Altura: `84px`
- Muestra: Nodos numerados (botones clicables del 1 al 21)
- El "pill" verde (`emerald-500`) crece desde la izquierda hasta el nodo activo
- Debajo: el nombre completo de la sección activa en `zinc-400`

#### Estado B: Compacto (hay scroll hacia abajo)
- Altura: `16px`
- Muestra: Solo una barra delgada con un badge central con el nombre de la sección
- Los nodos desaparecen con `opacity: 0`

```tsx
// ProgressLine.tsx — Línea 38
<motion.div
  className="w-full bg-white dark:bg-zinc-950..."
  animate={{
    height: isScrolled ? 16 : 84,  // ← Aquí está la magia
  }}
  transition={{ duration: 0.25, ease: [0.42, 0, 0.58, 1] }}
>
```

```tsx
// El "Pill" verde que avanza — Línea 67
<motion.div
  className="absolute bg-emerald-500 z-10 shadow-lg shadow-emerald-500/30 rounded-full..."
  animate={{
    // Crece en ancho según el paso actual
    width: ((currentStep + 1) * ITEM_WIDTH) + (currentStep * GAP_WIDTH) + 16,
    height: isScrolled ? 4 : 32  // Delgado en scroll, grueso cuando expandido
  }}
>
  {/* Efecto shimmer cuando isGenerating = true */}
  {isGenerating && (
    <motion.div
      className="absolute inset-0 bg-white/30 skew-x-12"
      initial={{ x: '-100%' }}
      animate={{ x: '200%' }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    />
  )}
</motion.div>
```

> **Truco visual clave:** El shimmer blanco inclinado (`skew-x-12`) que viaja de izquierda a derecha infinitamente da la sensación de que la barra "está trabajando", sin necesidad de un spinner separado.

### 3.2 `CommandDock.tsx` — El Dock Flotante Inferior

**Ubicación:** `src/components/academico/ui/CommandDock.tsx`

Es la barra de control anclada al fondo de la pantalla. Contiene 3 botones que cambian de tamaño y posición con Spring animations:

```
[ ← ]  [ Ver Redacción IA ]  [ Siguiente → ]
```

#### Botón "Atrás" (`←`)

```tsx
// CommandDock.tsx — Línea 40
<AnimatePresence mode="popLayout">
  {canGoPrev && (
    <motion.button
      initial={{ opacity: 0, width: 0, scale: 0.8 }}
      animate={{ opacity: 1, width: "64px", scale: 1 }}
      exit={{ opacity: 0, width: 0, scale: 0.8 }}
      // Spring animation: el botón "crece" desde 0 cuando hay sección anterior
      transition={{ type: "spring", stiffness: 400, damping: 15, bounce: 0.25 }}
      className="h-14 ... bg-gray-100 dark:bg-zinc-800 text-black ..."
    >
      <ChevronLeft className="w-5 h-5" />
    </motion.button>
  )}
</AnimatePresence>
```

Cuando `currentStep === 0` el botón desaparece animado. Cuando el usuario avanza a la sección 1, aparece "saliendo" como un resorte.

#### Botón Central "Ver Redacción IA"

```tsx
// CommandDock.tsx — Línea 64
// COLORES: Fondo blanco (#fff) con texto negro (#000) — clean & premium
// Cuando isGenerating: fondo zinc-100, texto zinc-400 (deshabilitado visual)
<motion.button
  layout  // ← Permite que el botón cambie de tamaño suavemente cuando aparece el botón "Atrás"
  onClick={onGenerate}
  disabled={isGenerating}
  className={cn(
    "h-14 flex-1 rounded-full font-bold text-sm shadow-xl ...",
    isGenerating
      ? "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
      : "bg-white text-black hover:bg-gray-50 active:scale-95"
  )}
>
```

La propiedad `layout` de Framer-motion hace que cuando el botón "Atrás" aparece o desaparece, el botón central se redimensione suavemente sin saltar.

#### Botón "Siguiente"

```tsx
// CommandDock.tsx — Línea 90
// COLOR: emerald-500 (#10B981) cuando hay siguiente sección
// COLOR: gray-300 cuando está en la última sección (deshabilitado)
<motion.button
  className={cn(
    "h-14 rounded-full text-white font-semibold ... shadow-emerald-500/20",
    !canGoNext
      ? "bg-gray-300 pointer-events-none w-14 px-0"  // Circulito gris
      : "bg-emerald-500 hover:bg-emerald-600 w-auto min-w-[120px]"  // Píldora verde
  )}
>
  {currentStep === totalSteps - 1 ? 'Finalizar' : 'Siguiente'}
  {currentStep === totalSteps - 1 ? <Check /> : <ChevronRight />}
</motion.button>
```

### 3.3 `SectionCard.tsx` — El Contenedor de Cada Sección

**Ubicación:** `src/components/academico/ui/SectionCard.tsx`

Es un wrapper minimalista que solo tiene **dos estados visuales** controlados por `viewMode`:

| `viewMode` | Lo que muestra |
|---|---|
| `'form'` | Los inputs del formulario (radios, checkboxes, textareas) |
| `'redaction'` | El texto médico generado (preview) |

```tsx
// SectionCard.tsx — Línea 42
{viewMode === 'form' ? (
  // MODO FORMULARIO: contenido real (inputs, selects, etc.)
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    {children}
  </div>
) : (
  // MODO REDACCIÓN: muestra el texto generado
  <div className="min-h-[300px] animate-in zoom-in-95 duration-300">
    {redactionPreview ? (
      typeof redactionPreview === 'string' ? (
        // Si es string: renderiza HTML (para textos con formato)
        <div
          className="prose dark:prose-invert text-zinc-700 dark:text-zinc-300 leading-relaxed font-mplus"
          dangerouslySetInnerHTML={{ __html: redactionPreview }}
        />
      ) : (
        // Si es ReactNode: renderiza componente (para secciones complejas)
        <div className="prose dark:prose-invert ...">{redactionPreview}</div>
      )
    ) : (
      // Placeholder si aún no hay texto generado
      <div className="flex flex-col items-center justify-center text-zinc-400 gap-3 opacity-60">
        <div className="w-12 h-12 rounded-full bg-zinc-200 animate-pulse" />
        <p className="text-sm">Esperando datos...</p>
      </div>
    )}
  </div>
)}
```

---

## 4. El Motor de Redacción — Ejemplo Completo: `InterrogatorioSistemas.tsx`

Esta es la sección más grande del formulario (1,875 líneas). Es un ejemplo perfecto de cómo funciona el patrón de redacción en todo el sistema.

### 4.1 Estado Local de la Sección

```tsx
// InterrogatorioSistemas.tsx — Línea 25
const [showForm, setShowForm] = useState(true);        // true=formulario, false=redacción

const [formValues, setFormValues] = useState({         // ← Estado local de ESTE formulario
  digestivo: {
    alimentacion: "",          // "Blanda" | "Fibrosa" | "Combinada"
    masticacion: "",           // "Unilateral" | "Bilateral" | "Anterior"
    percepcionGusto: "",       // "Normal" | "Disminucion" | "Alterados"
    salivacion: "",            // "Normal" | "Aumentada" | "Disminuida"
    deglusion: "",             // "No" | "Dificultad" | "Dolor"
    halitosis: "",             // "Sí" | "No"
    sintomasDigestivos: [],    // string[] — checkboxes múltiples
    // ... más campos
  },
  respiratorio: { /* ... */ },
  cardiovascular: { /* ... */ },
  genitoUrinario: { /* ... */ },
  endocrino: { /* ... */ },
  tegumentario: { /* ... */ },
  musculoEsqueletico: { /* ... */ },
  nervioso: { /* ... */ },
});

const [sintomasToggle, setSintomasToggle] = useState({  // ← Toggles "Aparato Sano"
  digestivo: false,
  respiratorio: false,
  // ... uno por sistema
});

const [redacciones, setRedacciones] = useState({       // ← Textos generados por sistema
  digestivo: "",
  respiratorio: "",
  // ...
});
```

### 4.2 Persistencia en localStorage

Los formularios de Dentaxy persisten automáticamente en `localStorage`, sin necesidad de "Guardar":

```tsx
// InterrogatorioSistemas.tsx — Línea 178
// Guardar cada vez que el formulario cambia
useEffect(() => {
  localStorage.setItem('interrogatorio-sistemas-formValues', JSON.stringify(formValues));
}, [formValues]);

// Cargar al montar el componente
useEffect(() => {
  const savedData = localStorage.getItem('interrogatorio-sistemas-formValues');
  if (savedData) {
    setFormValues(JSON.parse(savedData));
  }
}, []);
```

Esto garantiza que si el dentista cierra el tab accidentalmente, los datos no se pierden.

### 4.3 El Toggle "Sin Síntomas" — Redacción Instantánea

Este es el patrón más elegante del sistema. Cuando el dentista activa "Aparato Sano" para un sistema:

```tsx
// InterrogatorioSistemas.tsx — Línea 292
const handleSintomasToggle = (system: string, checked: boolean) => {
  setSintomasToggle(prev => ({ ...prev, [system]: checked }));

  if (checked) {
    // ← ACCIÓN INMEDIATA: usar redacción de alta calidad pre-escrita por clínicos
    const redaccionPredeterminada = redaccionesSinSintomas[system];
    handleInterrogatorioChange(system, redaccionPredeterminada);
    setRedacciones(prev => ({ ...prev, [system]: redaccionPredeterminada }));
  } else {
    // ← Limpiar para que el formulario genere nuevo texto
    handleInterrogatorioChange(system, "");
    setRedacciones(prev => ({ ...prev, [system]: "" }));
  }
};
```

Ejemplo del texto pre-escrito para el aparato digestivo (firmado clínicamente):

```tsx
// InterrogatorioSistemas.tsx — Línea 282
const redaccionesSinSintomas = {
  digestivo: "El paciente refiere llevar una alimentación combinada con adecuado consumo de alimentos blandos y fibrosos. Presenta un patrón de masticación bilateral, lo que permite un proceso adecuado de trituración de los alimentos. La percepción del gusto se mantiene íntegra, sin alteraciones referidas. La producción de saliva se percibe suficiente y constante, sin sensación de sequedad o exceso. No reporta dificultad ni dolor al deglutir. Niega halitosis. No presenta síntomas digestivos como distensión abdominal, estreñimiento, plenitud posprandial, pirosis, dolor abdominal, náusea, vómito ni reflujo. Mantiene un apetito estable, sin cambios referidos. ...",

  cardiovascular: "El paciente no refiere dolor torácico ni en reposo ni en relación con el esfuerzo. No ha presentado episodios de lipotimia o síncope. Refiere no percibir irregularidades en el ritmo cardíaco, sin palpitaciones ni latidos acelerados o débiles. ...",
  // ... 6 sistemas más
};
```

### 4.4 El Motor de Redacción Dinámica — Template Literal con Variantes

Cuando el toggle está desactivado y el usuario llenó el formulario manualmente:

```tsx
// InterrogatorioSistemas.tsx — Línea 330
const generateAndUpdateRedacciones = () => {
  const newRedacciones = { ...redacciones };

  // === SISTEMA DIGESTIVO ===
  let digestivoText = "";
  if (!sintomasToggle.digestivo) {  // Solo si NO es "Aparato Sano"

    digestivoText = `El paciente refiere alimentación de tipo ${formValues.digestivo.alimentacion || "[sin especificar]"}. `;
    digestivoText += `Su patrón de masticación es ${formValues.digestivo.masticacion || "[sin especificar]"}. `;
    digestivoText += `Manifiesta ${getPercepcionGustoText()}. `;

    if (formValues.digestivo.sintomasDigestivos.includes("Ninguno")) {
      // Si marcó "Ninguno" en los síntomas:
      digestivoText += " El paciente niega alteraciones relacionadas al sistema digestivo. Se interrogó específicamente sobre distensión abdominal, estreñimiento, pirosis, dolor abdominal, náuseas, vómito y reflujo.";
    } else {
      // Si marcó síntomas específicos:
      digestivoText += ` Ha experimentado los siguientes síntomas digestivos: ${formValues.digestivo.sintomasDigestivos.join(", ")}.`;
    }

    newRedacciones.digestivo = digestivoText;
    handleInterrogatorioChange('digestivo', digestivoText); // ← Notifica al formData global
  }

  // === SISTEMA CARDIOVASCULAR (con variantes aleatorias) ===
  let cardiovascularText = "";
  if (!sintomasToggle.cardiovascular) {

    if (formValues.cardiovascular.dolorToracico === "No refiere dolor torácico") {
      cardiovascularText += "El paciente niega dolor torácico. ";
    } else if (formValues.cardiovascular.dolorToracico) {
      // VARIANTES ALEATORIAS ← así evitamos que suene robótico
      const variaciones = [
        `El paciente refiere dolor torácico de tipo ${formValues.cardiovascular.dolorToracico}`,
        `Se documenta la presencia de dolor torácico caracterizado como ${formValues.cardiovascular.dolorToracico}`
      ];
      cardiovascularText += variaciones[Math.floor(Math.random() * variaciones.length)];

      if (formValues.cardiovascular.dolorToracicoDetalle) {
        const conectores = ["especificando que", "señalado por el paciente con evolución de"];
        cardiovascularText += `, ${conectores[Math.floor(Math.random() * conectores.length)]} ${formValues.cardiovascular.dolorToracicoDetalle}. `;
      }
    }
    // ... continúa con lipotimia, ritmo cardíaco, síntomas asociados, etc.
    newRedacciones.cardiovascular = cardiovascularText;
  }
};
```

### 4.5 Funciones Helper para Mapeo Semántico

Los valores del formulario son códigos cortos (`"Disminucion"`, `"Alterados"`). Las funciones helper los convierten a lenguaje médico correcto:

```tsx
// InterrogatorioSistemas.tsx — Línea 596
const getPercepcionGustoText = () => {
  switch (formValues.digestivo.percepcionGusto) {
    case "Normal":     return "no percibir alteraciones del gusto";
    case "Disminucion": return "hipogeusia";                           // ← Término médico correcto
    case "Alterados":  return "disgeusia (sabores metálicos, amargos, etc.)";
    default:           return "[sin especificar]";
  }
};

const getSalivacionText = () => {
  switch (formValues.digestivo.salivacion) {
    case "Normal":     return "se encuentra presente en cantidad y consistencia adecuadas";
    case "Aumentada":  return "aumentada";
    case "Disminuida": return "disminuida";
    default:           return "[sin especificar]";
  }
};

const getDeglusiónText = () => {
  switch (formValues.digestivo.deglusion) {
    case "No":         return "no refiere dificultad";
    case "Dificultad": return "presenta dificultad sin dolor";
    case "Dolor":      return "presenta odinofagia";  // ← Término médico exacto
    default:           return "[sin especificar]";
  }
};
```

---

## 5. `AnalysisModeContext.tsx` — El Modo Análisis Global

Este contexto permite a cualquier parte de la app saber si el usuario está en "modo análisis" (seleccionando palabras del texto generado para modificarlo).

```tsx
// AnalysisModeContext.tsx
interface AnalysisModeContextType {
  isAnalysisMode: boolean;     // ¿Está activo el modo análisis?
  selectedText: string;        // Texto juntos de las palabras seleccionadas
  selectedWords: string[];     // Array de palabras seleccionadas individualmente
  toggleWord: (word: string) => void;   // Agrega o quita una palabra del array
  clearSelection: () => void;           // Limpia toda la selección
  // ...posición del cursor para el popup contextual
  selectedPosition: { x: number; y: number } | null;
}
```

```tsx
// Cómo funciona toggleWord:
const toggleWord = (word: string) => {
  setSelectedWords(prev => {
    const exists = prev.includes(word);
    const updated = exists
      ? prev.filter(w => w !== word)  // Deseleccionar
      : [...prev, word];              // Seleccionar
    setSelectedText(updated.join(' ')); // Actualiza el string completo
    return updated;
  });
};
```

---

## 6. Paleta Visual y Design Tokens del Form Panel

| Elemento | Clase/Color | Hex |
|---|---|---|
| Fondo general | `bg-white dark:bg-zinc-950` | `#fff / #09090b` |
| Pill de progreso activo | `bg-emerald-500` | `#10B981` |
| Sombra del pill | `shadow-emerald-500/30` | `rgba(16,185,129, 0.3)` |
| Botón "Siguiente" activo | `bg-emerald-500 hover:bg-emerald-600` | `#10B981 / #059669` |
| Botón "Siguiente" final | `bg-gray-300` | `#D1D5DB` |
| Botón "Atrás" | `bg-gray-100 dark:bg-zinc-800` | `#F3F4F6 / #27272A` |
| Botón central "Ver Redacción" | `bg-white text-black` | `#fff / #000` |
| Texto nombres de sección | `text-zinc-400 dark:text-zinc-500` | `#A1A1AA / #71717A` |
| Texto redactado | `text-zinc-700 dark:text-zinc-300` | `#3F3F46 / #D4D4D8` |
| Borde secciones del form | `border-gray-200 dark:border-gray-700` | `#E5E7EB / #374151` |
| Toggle "Sin síntomas" ON | `bg-emerald-500` | `#10B981` |
| Overlay automación | `border-emerald-500/30 text-emerald-600` | con backdrop-blur |
| Track de progreso (vacío) | `bg-gray-100 dark:bg-zinc-800` | `#F3F4F6 / #27272A` |

---

## 7. Flujo Completo de Uso — Paso a Paso

```
1. El usuario accede al panel (Dentaxy Seed o Demo Universitario).

2. DentaxyFormPanel monta con currentStep = 0 (Padecimiento Actual).

3. ProgressLine muestra los 21 círculos numerados. El círculo 1 está cubierto
   por el "pill" verde esmeralda.

4. El usuario ve el SectionCard con el formulario real de Padecimiento.
   - Puede llenar campos manualmente (radio buttons, checkboxes, textareas)
   - O activar el toggle "Sin Síntomas" para respuesta instantánea

5. El usuario presiona "Ver Redacción IA" en el CommandDock.
   - handleGenerateCurrent() busca el botón "Generar" DENTRO de la sección activa
     usando querySelector en el DOM:
       const generateButton = sectionContainer.querySelectorAll('button')
         .find(btn => btn.textContent?.includes('Generar'));
       generateButton.click();
   - El componente de la sección genera el texto con su motor local.
   - Llama handleContentGenerated('padecimiento', textoGenerado).
   - viewMode cambia a 'redaction', y SectionCard muestra el texto.

6. El usuario presiona "Siguiente →".
   - currentStep pasa de 0 a 1.
   - direction = 1 (avance).
   - AnimatePresence ejecuta la transición: sección 1 sale a la izquierda,
     sección 2 entra desde la derecha (x: 50 → 0).
   - ProgressLine: el pill verde crece hacia el nodo 2.

7. El proceso se repite para las 21 secciones.

8. Al final, generations contiene:
   {
     padecimiento: "El paciente acude por...",
     heredofamiliares: "Sin antecedentes heredofamiliares de relevancia...",
     interrogatorio: {
       digestivo: "El paciente refiere...",
       cardiovascular: "El paciente no refiere..."
     },
     // ... 18 más
   }

9. Este objeto se pasa a VistaDocumento / SmileEspejoPanel para renderizar
   la Historia Clínica completa en formato PDF descargable.
```

---

## 8. Automatización Total (`useGenerarTodasRedacciones`)

Para el modo "demo" o cuando el dentista quiere generar todas las secciones en lote:

```tsx
// DentaxyFormPanel.tsx — Línea 176
const { isGenerating, progress, generarTodo } = useGenerarTodasRedacciones(
  seccionesActivas,
  handleGenerationComplete,  // Callback cuando termina todo
  onSectionActive           // Callback cuando activa una sección en la generación
);
```

Este hook:
1. Itera sobre todas las 21 secciones secuencialmente
2. Para cada una, activa `onSectionActive(sectionId)` → mueve el `currentStep`
3. Hace click programático en el botón "Generar" de la sección
4. Espera un timeout configurable antes de pasar a la siguiente
5. Actualiza `progress` (porcentaje) para el overlay flotante
6. Al terminar, dispara `window.dispatchEvent(new Event('dentaxy-generation-complete'))`

El overlay flotante muestra el progreso:
```tsx
// DentaxyFormPanel.tsx — Línea 456
{isGenerating && progress && (
  <motion.div
    className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur border border-emerald-500/30
               text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl ... shadow-lg"
  >
    <Loader2 className="h-4 w-4 animate-spin" />
    <span className="text-[10px] font-bold uppercase">Dentaxy AI Running</span>
    <span className="text-xs text-zinc-600">{progress.percentage}% Completado</span>
  </motion.div>
)}
```

---

## 9. Estructura de Archivos Completa

```
src/
├── components/
│   ├── academico/
│   │   ├── DentaxyFormPanel.tsx         ← ORQUESTADOR (478 líneas)
│   │   ├── VistaDocumento.tsx           ← Vista del doc final listo para PDF
│   │   ├── SmileEspejoPanel.tsx         ← Panel completo con tooth chart
│   │   ├── ui/
│   │   │   ├── ProgressLine.tsx          ← Barra de progreso animada
│   │   │   ├── CommandDock.tsx           ← Dock de controles flotante
│   │   │   └── SectionCard.tsx          ← Contenedor form/redacción
│   │   └── sections/
│   │       ├── PadecimientoCard.tsx      ← Wrapper Sección I
│   │       ├── HeredofamiliaresCard.tsx  ← Wrapper Sección II
│   │       │   ... (19 más, uno por sección)
│   │       └── PronosticoCard.tsx        ← Wrapper Sección XXI
│   │
│   └── historia-clinica/
│       ├── InterrogatorioSistemas.tsx   ← Motor IX (1,875 líneas / 8 sistemas)
│       ├── AntecedentesHeredoFamiliares.tsx
│       ├── AntecedentesPersonalesNoPatologicos.tsx
│       ├── ExamenCabeza.tsx             ← Motor XI (41k bytes)
│       ├── ArticulacionCraneomandibular.tsx
│       │   ... (todos los componentes de formulario)
│       └── PadecimientoActual.tsx
│
├── contexts/
│   └── AnalysisModeContext.tsx          ← Context selector de palabras
│
├── hooks/
│   ├── useHistoriaClinica.ts            ← Estado global del formulario
│   └── useGenerarTodasRedacciones.ts    ← Automatización secuencial
│
└── types/
    └── historiaClinica.ts               ← Types del FormDataState
```

---

## 10. Resumen para IA

Si una IA necesita hacer un cambio en este sistema, los puntos clave son:

1. **Para agregar una nueva sección:** Agregar entrada en `seccionesGenerables` en `DentaxyFormPanel.tsx`, crear el componente en `/historia-clinica/`, crear el wrapper Card en `/sections/`, agregar el `case` en `renderCurrentStepContent()`.

2. **Para modificar la redacción de un sistema:** Editar los template literals o las `redaccionesSinSintomas` en el archivo `.tsx` de esa sección.

3. **Para cambiar los colores:** Los tokens del sistema están en Tailwind (`emerald-500`, `zinc-950`, etc.). Los colores principales son esmeralda para progreso/éxito y zinc para neutros.

4. **Para agregar variación lingüística:** Agregar más strings al array `variaciones[]` dentro del bloque de generación correspondiente.

5. **NUNCA** llamar a una API externa de IA. Si se necesita texto nuevo, se escribe el template directamente en el código.
