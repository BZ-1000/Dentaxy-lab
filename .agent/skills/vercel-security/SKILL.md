
---
name: vercel-security
description: Guía experta para configurar seguridad, headers y protección DDoS en Vercel.
---

# Vercel Security Masterclass

Esta habilidad te ayuda a fortificar tu aplicación Dentaxy utilizando las herramientas nativas de Vercel.

## 1. Headers de Seguridad (vercel.json)

Asegúrate de tener configurados los siguientes headers en tu `vercel.json` para cumplir con estándares de seguridad modernos.

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:;"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=(self)"
        }
      ]
    }
  ]
}
```

> **Importante:** Ajusta la `Content-Security-Policy` (CSP) según las necesidades de tus scripts externos y APIs (Google Analytics, Stripe, Supabase, etc.).

## 2. Protección DDoS (Firewall)

Vercel incluye protección DDoS básica en todos los planes.
Para ataques más sofisticados (Pro/Enterprise):

*   **Attack Challenge Mode:** Actívalo en el Dashboard bajo Security > Attack Challenge Mode si detectas tráfico inusual.
*   **Firewall Rules:** Bloquea IPs, países o User-Agents específicos.

## 3. Edge Middleware (Autenticación/Geo-Bloqueo)

Usa Edge Middleware para verificar autenticación o bloquear regiones *antes* de que la petición toque tu servidor/función.

```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Geo-Bloqueo: Bloquear acceso desde cierto país (ej: RU)
  if (request.geo?.country === 'RU') {
    return new NextResponse('Access Denied', { status: 403 });
  }

  return NextResponse.next();
}
```

## 4. Variables de Entorno Seguras

*   Nunca comitees `.env` o `.env.local`.
*   Usa el Dashboard de Vercel para gestionar secretos de producción.
*   Rota las claves de API periódicamente.
