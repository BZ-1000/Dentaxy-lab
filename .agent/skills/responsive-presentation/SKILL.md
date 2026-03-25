---
name: responsive-presentation
description: >
  Sistema de responsividad específico para DentaxyPresentation.tsx (presentación de Dentaxy Universidades).
  Usa CSS Custom Properties + Media Queries definidos en el bloque FontLoader.
  Aplica SIEMPRE que se añada un nuevo slide, una nueva sección o un nuevo componente
  a la presentación, para garantizar que se vea correctamente en móvil (390px),
  tablet (768px) y desktop (1280px+).
---

# Skill: Responsive Presentation — Dentaxy Universidades

## Filosofía

> **"Todo slide nuevo debe funcionar en un iPhone antes de funcionar en un proyector."**

La presentación usa **inline styles** (no Tailwind) con un sistema de CSS Custom Properties
declaradas en el `FontLoader`. Este skill documenta ese sistema completo.

---

## 1. CSS Custom Properties Disponibles

Declaradas en `:root` dentro del bloque `<style>` del `FontLoader`:

| Variable | Móvil (0px) | Phablet (480px) | Tablet (768px) | Desktop (1024px) |
|---|---|---|---|---|
| `--slide-px` | `16px` | `28px` | `48px` | `80px` |
| `--slide-py` | `12px` | `16px` | `22px` | `28px` |
| `--card-px` | `20px` | `28px` | `36px` | `42px` |
| `--card-py` | `20px` | `24px` | `30px` | `36px` |
| `--donut-sz` | `130px` | `155px` | `175px` | `180px` |
| `--stat-num` | `clamp(20px,4vw,34px)` | — | — | — |

---

## 2. Clases CSS Helper Disponibles

Declaradas en el mismo bloque `<style>`:

```css
/* Grids que cambian de 1 → 2 columnas */
.pres-grid-2  { 1col → 2col a partir de 560px }

/* Grids que cambian de 1 → 2 → 3 columnas */
.pres-grid-3  { 1col → 2col (420px) → 3col (700px) }

/* Flex columna → fila */
.pres-flex-row { flex-col → flex-row a partir de 560px }

/* Tabla con scroll horizontal seguro */
.pres-table-wrap { overflow-x: auto, touch-scroll }

/* Ocultar dots del header en pantallas muy pequeñas */
.pres-dot-hide { display:none en ≤ 420px }

/* Donut: layout columna → fila a partir de 560px */
.donut-layout { flex-col → flex-row }

/* Botón full-width en móvil, auto en sm+ */
.pres-btn-full { w-full → w-auto a partir de 480px }
```

---

## 3. Reglas al Crear un Nuevo Slide

### 3.1 — Contenedor del slide
```tsx
// ✅ CORRECTO — usa min() para limitar y adaptar
<div style={{ maxWidth: "min(860px, 95vw)", width: "100%" }}>

// ❌ INCORRECTO — valor fijo que rompe en móvil
<div style={{ maxWidth: 860, width: "100%" }}>
```

### 3.2 — Grid de 2 columnas (listas de items)
```tsx
// ✅ CORRECTO
<div className="pres-grid-2">
  <div>Columna A</div>
  <div>Columna B</div>
</div>

// ❌ INCORRECTO
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
```

### 3.3 — Grid de 3 columnas (StatCards, features)
```tsx
// ✅ CORRECTO
<div className="pres-grid-3">
  <StatCard ... />
  <StatCard ... />
  <StatCard ... />
</div>

// ❌ INCORRECTO
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
```

### 3.4 — Padding de GlassCard
```tsx
// ✅ CORRECTO — el componente GlassCard ya usa var(--card-py) var(--card-px)
<GlassCard glow="green"> ... </GlassCard>

// Si necesitas un GlassCard especial:
<GlassCard style={{ padding: "var(--card-py) var(--card-px)" }}>
```

### 3.5 — Tipografía escalable
```tsx
// ✅ CORRECTO — usa clamp()
<p style={{ fontSize: "clamp(13px, 1.5vw, 17px)" }}>

// ❌ INCORRECTO — fijo
<p style={{ fontSize: 17 }}>
```

### 3.6 — Tablas
```tsx
// ✅ CORRECTO — siempre envolver en pres-table-wrap
<div className="pres-table-wrap">
  <table style={{ minWidth: 420 }}>
    ...
  </table>
</div>
```

### 3.7 — Botones CTA
```tsx
// ✅ CORRECTO — full en móvil, auto en sm+
<button className="pres-btn-full" style={{ display: "flex", alignItems: "center", ... }}>

// O usando inline style con width calculado:
<button style={{ width: "min(100%, 280px)", ... }}>
```

---

## 4. Checklist Pre-Commit (nuevo slide)

Antes de guardar un nuevo slide o componente de la presentación:

- [ ] El contenedor usa `maxWidth: "min(XXXpx, 95vw)"`?
- [ ] Los grids usan `.pres-grid-2` o `.pres-grid-3` en lugar de estilos fijos?
- [ ] Los paddings de cards usan `var(--card-py) var(--card-px)`?
- [ ] Los font-size usan `clamp()` en lugar de px fijos?
- [ ] Las tablas están envueltas en `.pres-table-wrap`?
- [ ] Los botones CTA tienen `w-full` en móvil?
- [ ] El layout usa `donut-layout` o `pres-flex-row` para flex responsivo?

---

## 5. Breakpoints de Referencia

| Breakpoint | Valor | Uso |
|---|---|---|
| Mobile | `0px` | Todo lo que se ve en iPhone (portrait) |
| Phablet | `480px` | iPhone landscape, botones `auto` |
| Tablet | `560px` | Grids de 2 columnas activos |
| Large Tablet | `700px` | Grids de 3 columnas activos |
| Desktop | `768px` | Padding grande, donut tamaño completo |
| Large Desktop | `1024px` | Padding máximo |
