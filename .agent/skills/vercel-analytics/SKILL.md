
---
name: vercel-analytics
description: Guía de integración de Vercel Analytics para rastreo de eventos personalizados y métricas detalladas.
---

# Vercel Analytics Pro Guide

Esta habilidad proporciona las mejores prácticas para extender las capacidades de `@vercel/analytics` más allá de las visitas básicas.

## 1. Configuración Básica (Recordatorio)

Asegúrate de que `Analytics` esté inicializado en tu `_app.tsx` o `layout.tsx`:

```tsx
import { Analytics } from '@vercel/analytics/react';

export default function Layout({ children }) {
  return (
    <html lang="es">
      <head>
        <title>Dentaxy</title>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## 2. Eventos Personalizados (Custom Events)

Rastrea acciones clave del usuario (ej: completar un registro, compra, error crítico) usando `track`.

```tsx
import { track } from '@vercel/analytics';

// Ejemplo: Registro de usuario exitoso
function onSignupSuccess(userId: string) {
  track('Signup', {
    method: 'email', // o 'google', 'apple'
    plan: 'free',    // o 'pro'
  });
}

// Ejemplo: Error en pago
function onPaymentError(errorType: string) {
  track('PaymentError', {
    type: errorType,
  });
}
```

> **Nota:** Los nombres de eventos deben ser descriptivos y consistentes (CamelCase recomendado).

## 3. Audiencias (Audiences)

Segmenta tus usuarios basándote en propiedades personalizadas.

*   Ve al Dashboard de Vercel > Analytics > Audiences.
*   Crea una audiencia basada en los eventos `track` que implementaste.
*   Ejemplo: "Usuarios Pro" (donde `plan` == `pro`).

## 4. Debugging en Desarrollo

Por defecto, Analytics no envía datos en `localhost` para no ensuciar las métricas.
Para probarlo:

1.  Habilita el modo debug:
    ```tsx
    <Analytics debug={true} />
    ```
2.  Verifica la consola del navegador. Verás logs con prefijo `[Vercel Analytics]`.
3.  **Recuerda quitar `debug={true}` antes de producción.**

## 5. Límites

*   Estándar (Hobby): Retención limitada.
*   Pro: Retención extendida y mayor límite de eventos.
*   Revisa la cuota en tu Dashboard si notas pérdida de datos.
