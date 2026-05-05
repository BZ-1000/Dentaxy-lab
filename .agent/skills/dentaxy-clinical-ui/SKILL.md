---
name: dentaxy-clinical-ui
description: >
  Sistema de diseño maestro para la interfaz clínica de Dentaxy (demo/ai).
  Define el estándar visual y de código para TODOS los componentes de la
  historia clínica: formularios, tablas de redacción, botones de selección y
  tipografía. Usar SIEMPRE antes de crear o modificar cualquier componente
  dentro de src/components/historia-clinica/ o src/components/academico/.
---

# Sistema de Diseño Clínico Dentaxy (`demo/ai`)

Este documento es la **fuente única de verdad** para el diseño visual y el
motor de redacción de la Historia Clínica Digital de Dentaxy.

---

## 1. Filosofía: "Total White"

El formulario clínico debe sentirse como un expediente médico de papel
digitalizado con precisión quirúrgica. Las reglas son:

- **Sin colores temáticos** en secciones de formulario (nada de azul, rosa,
  verde, amarillo en cards o bordes).
- **Sin fondos de color** en paneles (siempre `bg-white` o `bg-transparent`).
- **Sin bordes marcados** entre preguntas (solo `border-gray-100` o nada).
- **Solo zinc-800** para botones activos/seleccionados.
- **Tipografía `M PLUS 1p` o `Inter`** (la del sistema), nunca `monospace`
  excepto en los `labels` de las tablas de redacción (ver sección 3).

---

## 2. Botones de Selección Clínica (Sí / No / Opciones)

Estos son los botones que aparecen en cada pregunta de la Historia Clínica.

### Estado ACTIVO (seleccionado):
```
bg-zinc-800 text-white shadow-sm rounded-lg px-4 py-1.5 text-sm font-medium
```

### Estado INACTIVO (no seleccionado):
```
bg-white text-gray-600 border border-gray-200 hover:border-gray-400
rounded-lg px-4 py-1.5 text-sm font-medium
```

### Código de referencia (componente reutilizable):
```tsx
const Btn = ({ active, label, onClick }: {
  active: boolean; label: string; onClick: () => void;
}) => (
  <button
    type="button"
    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClick(); }}
    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
      active
        ? 'bg-zinc-800 text-white shadow-sm'
        : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
    }`}
  >
    {label}
  </button>
);
```

---

## 3. Tablas de Redacción Clínica

Hay **dos estilos** de tabla, cada uno para un contexto específico. Nunca
mezclar estilos ni inventar un tercer patrón.

---

### 3A. Tabla Simple — "Estilo Datos Generales"

**Cuándo usar:** Para datos tipo campo–valor donde hay 2 columnas. Ejemplos:
Datos Generales, Exploración Física (Signos Vitales), Antecedentes
Quirúrgicos.

**Estructura HTML exacta:**
```html
<table style="width:100%;border-collapse:collapse;">
  <tbody>
    <tr>
      <td style="
        font-family:'DM Mono',monospace;
        font-size:11px;
        font-weight:500;
        letter-spacing:0.04em;
        color:#888;
        text-transform:uppercase;
        width:38%;
        padding:11px 16px 11px 0;
        vertical-align:top;
        border-bottom:1px solid #e5e7eb;
      ">NOMBRE DEL CAMPO</td>
      <td style="
        font-size:14px;
        font-weight:300;
        color:#3a3a3a;
        padding:11px 0 11px 16px;
        vertical-align:top;
        border-bottom:1px solid #e5e7eb;
      ">Valor del campo</td>
    </tr>
    <!-- Fila alternada (par): agregar style="background:#f9fafb;" al <tr> -->
  </tbody>
</table>
```

**Reglas:**
- Columna izquierda: `DM Mono`, `11px`, `#888`, `UPPERCASE`.
- Columna derecha: `14px`, `font-weight:300`, `#3a3a3a`.
- Filas impares: fondo blanco. Filas pares: `background:#f9fafb`.
- Sin bordes laterales, solo `border-bottom`.

---

### 3B. Tabla Clínica Detallada — "Estilo Odontograma / Plan de Tratamiento"

**Cuándo usar:** Para tablas con cabecera (thead) y múltiples columnas con
significado clínico. Ejemplos: Plan de Tratamiento, Diagnósticos CIE-10,
resumen del Odontograma.

**Estructura HTML exacta:**
```html
<table style="width:100%;border-collapse:collapse;font-size:13px;">
  <thead>
    <tr style="border-bottom:2px solid #e5e7eb;">
      <th style="
        font-family:'DM Mono',monospace;
        font-size:10px;
        font-weight:600;
        letter-spacing:0.08em;
        color:#6b7280;
        text-transform:uppercase;
        padding:8px 12px 8px 0;
        text-align:left;
      ">OD</th>
      <th style="/* igual que arriba */">Procedimiento</th>
      <th style="/* igual que arriba */">Prioridad</th>
      <th style="/* igual que arriba */">Tiempo</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid #f3f4f6;">
      <td style="
        font-size:13px;
        font-weight:500;
        color:#374151;
        padding:10px 12px 10px 0;
        vertical-align:top;
      ">OD 25</td>
      <td style="
        font-size:13px;
        font-weight:300;
        color:#6b7280;
        padding:10px 0 10px 12px;
        vertical-align:top;
      ">Restauración composite</td>
    </tr>
  </tbody>
</table>
```

**Reglas:**
- `thead`: `DM Mono`, `10px`, `#6b7280`, `UPPERCASE`, `letter-spacing:0.08em`.
- `thead` separador: `border-bottom:2px solid #e5e7eb`.
- `tbody` celdas: `13px`, datos principales `#374151`, datos secundarios `#6b7280`.
- `tbody` separadores: `border-bottom:1px solid #f3f4f6` (casi invisible).
- Sin bordes laterales ni fondo de color en thead.

---

## 4. Motores de Redacción (Regla de Oro)

- **NUNCA** se llama a `onToggleViewMode()` dentro del motor de redacción.
  El motor solo llama a `onRedaccionGenerada(content)` y nada más.
- El formulario NUNCA desaparece automáticamente.
- El motor se dispara en un `useEffect` que observa los campos del formulario.
- El texto generado debe ser **fluido y en prosa** para los componentes de
  antecedentes, y en **formato tabla HTML** para datos cuantificables.

---

## 5. Estructura de Secciones Clínicas

Cada sección de la Historia Clínica sigue esta jerarquía:

```
SectionCard (contenedor externo con título "Total White")
  └── ComponenteConcreto (ej: AntecedentesHemorragicos)
        ├── Preguntas con botones Sí/No (estilo 3A)
        ├── Sub-preguntas condicionadas (solo si respuesta = Sí)
        └── useEffect → motor de redacción silencioso
```

- Los **footers** de cada sección solo tienen el botón ghost `Reiniciar Sección`.
- No hay botones `Generar IA`, `Ver Redacción`, `Copiar`, ni `Limpiar` visibles.

---

## 6. Tipografía del Odontograma

Los números FDI de los dientes deben usar:
```
font-family: ui-sans-serif, system-ui, sans-serif
font-size: 9px
font-weight: 600
color: #6B7280
letter-spacing: -0.3px
```

**Nunca** usar `monospace` para los números de los dientes.
