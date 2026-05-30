# Especificación de Diseño de Animaciones Premium - Dentaxy Seed

Este documento detalla la especificación técnica de animaciones ultra-fluidas y micro-interacciones interconectadas implementadas para la plataforma **Dentaxy Seed** (excluyendo el Hero Section original, que se mantiene intacto). La dirección estética se basa en la experiencia cinemática de precisión cibernética limpia y técnica de *factory.ai*.

## 1. Landing Page (Módulos Bento Grid y Secciones Inferiores)

### A. Animación de Entrada por Desplazamiento (Scroll-driven)
*   **Comportamiento**: Las Bento Cards y las secciones inferiores se revelan en cascada rápida con un desfase de tiempo (*stagger effect*) cuando entran en el viewport del usuario.
*   **Valores de Transición**:
    *   `duration`: 0.65s
    *   `ease`: Cubic Bezier `[0.16, 1, 0.3, 1]` (curva de aceleración/desaceleración elástica elegante).
    *   `y`: Desplazamiento de `15px` a `0px`.
    *   `staggerChildren`: 0.08s de delay acumulado por tarjeta.

### B. Hover Táctil Elástico (Cards)
*   **Comportamiento**: Al colocar el mouse sobre cualquiera de las Bento Cards, esta reacciona de forma sutil simulando un material físico elástico.
*   **Valores de Transición**:
    *   `scale`: De `1` a `1.015`.
    *   `type`: `'spring'`
    *   `stiffness`: 160
    *   `damping`: 15 (amortiguación que previene rebotes exagerados).
    *   **Estilo Visual**: Cambio del borde de `border-zinc-200` a `border-emerald-300/60` de forma progresiva (`transition-all duration-300`).

---

## 2. Demo Clínico Interactivo (`AnimatedDemoUI.tsx`)

### A. Transiciones de Distribución Compartida (Shared Layout)
*   **Comportamiento**: Las pestañas de la ficha clínica ("Antecedentes", "Odontograma", etc.) tendrán un indicador de selección fluido. Al hacer clic en una pestaña nueva, la línea de selección o fondo se desliza físicamente de forma elástica en lugar de reaparecer estáticamente.
*   **Valores de Transición**:
    *   `layoutId`: `"activeTabIndicator"`
    *   `type`: `'spring'`
    *   `stiffness`: 200
    *   `damping`: 22

### B. Redacción de Expediente Orgánico
*   **Comportamiento**: El bloque de texto autogenerado por la simulación clínica de redacción se presentará con un desvanecimiento escalonado palabra por palabra para simular la toma de notas en tiempo real.
*   **Valores de Transición**:
    *   `stagger`: 0.03s por palabra.
    *   `opacity`: De `0` a `1`.
    *   `filter`: De `blur(3px)` a `blur(0px)` para máxima elegancia estética.

---

## 3. Login & Onboarding (`SeedLogin.tsx`)

### A. Carrusel de Pasos Horizontal
*   **Comportamiento**: La transición entre la pantalla de login (código universal o Google Connect) y la pantalla de bienvenida con la foto del doctor se realiza mediante un deslizamiento lateral suave de 3D-low.
*   **Valores de Transición**:
    *   `x` de entrada: `30px`
    *   `x` de salida: `-30px`
    *   `opacity`: De `0` a `1` (entrada) y de `1` a `0` (salida).
    *   `duration`: 0.45s.
    *   `ease`: `[0.25, 1, 0.5, 1]`

### B. Estabilización de Órbitas de Sincronización
*   **Comportamiento**: La absorción de los iconos de Google Drive, Calendar, etc., hacia el logotipo de Dentaxy se realiza mediante transformaciones CSS directas en Framer Motion (`x`, `y`, `scale`), garantizando que se renderice directamente en el compositor de la GPU a 120Hz sin provocar bugs ni desbordamiento de scrollbars.
