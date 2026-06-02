# Especificación de Diseño: Animación de Entrada con Scroll-Driven en Dentaxy Seed

Este documento detalla el diseño técnico y estético para la animación de introducción controlada por scroll en la sección inicial negra de la landing page de Dentaxy Seed.

## 1. Objetivos del Sistema
- **Impacto Visual Premium:** Crear una experiencia inmersiva e imponente con una estética "Total White" sobre negro profundo (`bg-black`) y tipografía futurista `'Bruno Ace SC'`.
- **Scroll Fluido (Scroll-Linked):** Sincronizar de forma natural las animaciones con la rueda del ratón o trackpad del usuario utilizando `useScroll` y `useTransform` de Framer Motion.
- **Rendimiento Optimizado:** Evitar caídas de frames (manteniendo 60 FPS) mediante el uso de propiedades CSS aceleradas por GPU (`transform`, `opacity`, `filter`).

## 2. Arquitectura de Componentes
- **`ScrollIntroSection` (React Component):** Un componente modular que se integrará en `SeedLanding.tsx`.
- **Estructura HTML/Tailwind:**
  ```tsx
  <div className="relative w-full h-[300vh] bg-black">
    <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-black">
      {/* Contenido Animado */}
    </div>
  </div>
  ```

## 3. Comportamiento y Línea de Tiempo del Scroll

El scroll se mapea de `0` (inicio de la sección) a `1` (fin de la sección de `300vh`).

### A. Animación 1: Frase de Entrada/Salida
- **Frase:** *"Ayer era papel, hoy es software, el futuro es..."*
- **Estilos:** Minimalista, blanco puro (`text-white`), tipografía limpia sans-serif, tamaño responsivo.
- **Mapeo de Valores (0.0 a 1.0):**
  - **Scroll [0.00 - 0.20]:** Entrada desde abajo (`y: 80px` a `y: 0px`) y fade-in (`opacity: 0` a `opacity: 1`).
  - **Scroll [0.20 - 0.40]:** Estática al centro (`y: 0px`) con opacidad total (`opacity: 1`).
  - **Scroll [0.40 - 0.60]:** Salida hacia arriba (`y: 0px` a `y: -100px`) y fade-out (`opacity: 1` a `opacity: 0`).

### B. Animación 2: Eclipse de Marca (Superpuesto)
- **Marca:** *"DENTAXY"*
- **Estilos:** Tipografía `'Bruno Ace SC'`, font-bold, tracking-tight, blanca brillante, tamaño masivo.
- **Mapeo de Valores (0.0 a 1.0):**
  - **Scroll [0.00 - 0.45]:** Oculta por completo (`opacity: 0`, `scale: 0.75`, `filter: blur(12px)`).
  - **Scroll [0.45 - 0.75]:** Emergencia progresiva. La opacidad sube a `1`, el escalado va de `0.75` a `1.0`, y el desenfoque se reduce a `0px` (`blur(0px)`). Ocurre mientras la primera frase termina de subir, logrando el efecto de profundidad tridimensional "Eclipse".
  - **Scroll [0.75 - 1.00]:** Se queda fija en el centro con opacidad total, y se aplica un zoom sutil continuo de `scale: 1.0` a `scale: 1.08` para darle un dinamismo orgánico de profundidad al finalizar el scroll.

## 4. Aseguramiento de Rendimiento (CTO Checklist)
- Uso de `will-change-[transform,opacity,filter]` en los elementos de animación.
- Los valores de animación se asignan mediante `motion.div` con `style` de Framer Motion, evitando cambios en el Virtual DOM de React.
- Tipografía optimizada con renderizado nítido (`antialiased subpixel-antialiased`).
