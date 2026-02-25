---
name: responsive-adaptive-ui
description: >
  Sistema maestro de responsividad adaptativa para Dentaxy UI. Basado en las
  mejores metodologías open-source: CUBE CSS (Andy Bell), Every Layout (Heydon
  Pickering), Intrinsic Design (Jen Simmons) y las guías de Tailwind CSS v3.
  Usa este skill SIEMPRE que crees o modifiques un componente UI para garantizar
  que se vea perfectamente en todas las pantallas (móvil, tablet, desktop, 4K).
---

# Responsive Adaptive UI — Skill de Dentaxy

## Filosofía Central

> **"El diseño no cambia — los TAMAÑOS cambian."**

Esta skill aplica el principio de **Intrinsic Design**: los componentes se
adaptan matemáticamente al espacio disponible, sin romper la identidad visual.
Nunca alteramos colores, tipografía de marca, o layout estructural.

---

## 1. Breakpoints Estándar de Dentaxy

Usamos los breakpoints de **Tailwind CSS v3** con prefijos estándar:

| Prefijo | Mínimo | Dispositivo Objetivo           |
|---------|--------|-------------------------------|
| —       | 0px    | Móvil (portrait, ≤ 390px)     |
| `sm:`   | 640px  | Móvil landscape / tablet mini  |
| `md:`   | 768px  | Tablet (iPad, etc.)            |
| `lg:`   | 1024px | Laptop / Desktop pequeño       |
| `xl:`   | 1280px | Desktop estándar               |
| `2xl:`  | 1536px | Desktop grande / 4K            |

---

## 2. Reglas de Oro (OBLIGATORIAS)

### 2.1 — Contenedores Fluidos
```
❌ NUNCA uses:     w-[500px]  max-w-xs  (ficos sin breakpoints)
✅ SIEMPRE usa:    w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg
```

### 2.2 — Tipografía Escalable
```
❌ NUNCA uses:     text-2xl  (solo un tamaño)
✅ SIEMPRE usa:    text-lg sm:text-xl md:text-2xl lg:text-3xl
```

### 2.3 — Espaciado Proporcional
```
❌ NUNCA uses:     p-8  gap-12  (sin escala)
✅ SIEMPRE usa:    p-4 sm:p-6 md:p-8  gap-4 md:gap-8 lg:gap-12
```

### 2.4 — Grid Responsivo
```
❌ NUNCA uses:     grid-cols-3  (sin breakpoints)
✅ SIEMPRE usa:    grid-cols-1 sm:grid-cols-2 md:grid-cols-3
```

### 2.5 — Flex Direction Adaptativo
```
❌ NUNCA uses:     flex-row  (sin breakpoints en header/nav)
✅ SIEMPRE usa:    flex-col sm:flex-row
```

### 2.6 — Botones Adaptativos
Los botones NUNCA deben desbordar su contenedor:
```
❌ NUNCA uses:     px-8 py-3 (fijo sin contexto)
✅ SIEMPRE usa:    w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2 sm:py-3
```

---

## 3. Patrón de Card Adaptativa (Hub Cards)

Para cards que tienen modo compacto/expandido (como SchemaHubCard):

```tsx
// COMPACTO: fluido en todos los tamaños
<div className="w-full max-w-[280px] sm:max-w-xs md:max-w-sm lg:max-w-md mx-auto">

// EXPANDIDO: usa todo el ancho disponible con límite
<div className="w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto">
```

### Preview Area (visualizador dentro de la card)
```tsx
// Altura proporcional (no fija) para el preview
<div className="w-full aspect-video sm:h-32 md:h-40 lg:h-48 overflow-hidden">
```

---

## 4. Patrón de Layout Principal (Hub Page)

El layout del Hub debe usar `min-h-dvh` (dynamic viewport height) para evitar
problemas en iOS con el teclado virtual:

```tsx
<div className="min-h-dvh flex flex-col">
  {/* Header */}
  <header className="flex-shrink-0 px-3 sm:px-6 py-3 sm:py-4">
    {/* Contenido del header */}
  </header>
  
  {/* Carousel área central */}
  <main className="flex-1 flex items-center justify-center px-2 sm:px-4 py-2 min-h-0">
    {/* Carousel + Cards */}
  </main>
  
  {/* Footer */}
  <footer className="flex-shrink-0 px-3 sm:px-6 py-2 sm:py-4">
    {/* Footer content */}
  </footer>
</div>
```

---

## 5. Patrón de Header Adaptativo

Para headers con múltiples elementos (logo + botón + título centrado):

```tsx
// Móvil: logo + botón compactos
// Desktop: logo + botón expandidos + título centrado con position absolute
<div className="relative flex items-center justify-between sm:justify-center">
  <div className="flex items-center gap-2 sm:gap-4 z-10">
    <button className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm">...</button>
    <img className="h-5 w-5 sm:h-6 sm:w-6" />
    <h1 className="text-sm sm:text-base md:text-lg font-bold">...</h1>
  </div>
  <div className="hidden sm:block absolute left-1/2 -translate-x-1/2">
    {/* Etiqueta centrada — solo en sm+ */}
  </div>
</div>
```

---

## 6. Patrón de Expanded View Responsiva

Para vistas expandidas con múltiples columnas de información:

```tsx
// 1 col → 2 cols → 3 cols según pantalla
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  <div>Columna 1</div>
  <div>Columna 2</div>
  {/* En sm, col3 ocupa ambas columnas */}
  <div className="sm:col-span-2 lg:col-span-1">Columna 3</div>
</div>
```

---

## 7. Overflow y Scroll Seguro

En componentes con scroll:
```tsx
// Nunca overflow-hidden en el wrapper de una card expandida
// Usa overflow-y-auto con max-height relativo al viewport
<div className="overflow-y-auto max-h-[60vh] md:max-h-[70vh] overscroll-contain">
```

---

## 8. Checklist Pre-Commit (Aplicar siempre)

Antes de guardar cualquier componente, verifica:
- [ ] ¿Tiene breakpoints en `max-w-*`?
- [ ] ¿El grid usa `grid-cols-1 sm:grid-cols-N`?
- [ ] ¿Los paddings/gaps escalan con breakpoints?
- [ ] ¿Los botones tienen `w-full sm:w-auto` cuando corresponde?
- [ ] ¿Las alturas fijas (`h-48`) tienen alternativa para móvil?
- [ ] ¿El texto escala con breakpoints?
- [ ] ¿El layout usa `flex-col sm:flex-row` en lugar de `flex-row` solo?
- [ ] ¿El contenedor principal usa `min-h-dvh` en lugar de `min-h-screen`?

---

## 9. Fuentes y Referencias Open Source

Esta skill se basa en:
- **CUBE CSS**: https://cube.fyi (Andy Bell) — metodología de composición
- **Every Layout**: https://every-layout.dev (Heydon Pickering) — patrones resilientes
- **Intrinsic Sizing**: https://web.dev/intrinsic-design (Jen Simmons)
- **Tailwind CSS Responsive Design**: https://tailwindcss.com/docs/responsive-design
- **The Clamp Technique**: https://css-tricks.com/linearly-scale-font-size-with-css-clamp/

---

## 10. Clases CSS Personalizadas Recomendadas

Agrega estas utilities a `index.css` para uso en toda la app:

```css
/* Hub Card Responsive Base */
.hub-card-compact {
  @apply w-full max-w-[280px] sm:max-w-[320px] md:max-w-sm lg:max-w-md;
}

.hub-card-expanded {
  @apply w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-5xl;
}

/* Fluid Preview Area */
.card-preview-area {
  @apply w-full h-36 sm:h-40 md:h-44 lg:h-52 overflow-hidden;
}

/* Adaptive Button */
.btn-adaptive {
  @apply w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-xs sm:text-sm;
}
```
