
---
name: vercel-speed-insights
description: Guía de integración de Vercel Speed Insights para monitorear y optimizar Core Web Vitals.
---

# Vercel Speed Insights Integration

Esta habilidad te guía en la configuración y uso de `@vercel/speed-insights` para asegurar una experiencia de usuario ultrarrápida (Core Web Vitals).

## 1. Instalación y Setup

Asegúrate de haber instalado el paquete:
```bash
npm i @vercel/speed-insights
```

Intégralo en tu archivo raíz (`_app.tsx`, `layout.tsx`, o `main.tsx`):

```tsx
import { SpeedInsights } from "@vercel/speed-insights/react"

export default function Layout({ children }) {
  return (
    <html lang="es">
      <head>
        <title>Dentaxy</title>
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

## 2. Métricas Clave (Core Web Vitals)

Vercel Speed Insights monitorea automáticamente:

*   **LCP (Largest Contentful Paint):** Tiempo de carga del elemento más grande.
    *   *Meta:* < 2.5s
    *   *Optimización:* Optimiza imágenes, usa CDN, prioriza carga crítica.
*   **FID (First Input Delay) / INP (Interaction to Next Paint):** Interactividad.
    *   *Meta:* < 100ms (FID) / < 200ms (INP)
    *   *Optimización:* Reduce JS bloqueante, divide código (code splitting).
*   **CLS (Cumulative Layout Shift):** Estabilidad visual.
    *   *Meta:* < 0.1
    *   *Optimización:* Asigna dimensiones explícitas a imágenes/videos, evita inyectar contenido dinámico arriba.

## 3. Dashboard

Accede a tus métricas en Vercel Dashboard > Speed Insights.
Aquí podrás ver:
*   Puntuación de Rendimiento Real (RUM) basada en usuarios reales.
*   Desglose por dispositivo, navegador y país.
*   Páginas con peor rendimiento.

## 4. Estrategias de Optimización (Dentaxy Specific)

*   **Imágenes:** Usa `next/image` o formatos modernos (WebP/AVIF).
*   **Fuentes:** Usa `next/font` para optimizar la carga de fuentes y evitar saltos (CLS).
*   **Scripts de Terceros:** Carga scripts no esenciales con `strategy="lazyOnload"` o `worker`.
