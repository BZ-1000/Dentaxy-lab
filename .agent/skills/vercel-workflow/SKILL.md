
---
name: vercel-workflow
description: Gu?a maestra para gestionar despliegues, entornos y variables en Vercel de forma estandarizada.
---

# Vercel Workflow Master Guide

Esta habilidad proporciona el flujo de trabajo est?ndar para interactuar con Vercel CLI y gestionar el ciclo de vida de la aplicaci?n Dentaxy.

## 1. Comandos Esenciales (CLI)

Aseg?rate de tener Vercel CLI instalado: `npm i -g vercel` (o usa `npx vercel`).

### Despliegues
*   **Preview (Desarrollo/Staging):**
    ```bash
    npx vercel
    ```
    *Uso:* Para probar cambios en un entorno r?plica de producci?n antes de hacer merge.
    *Output:* URL ?nica de previsualizaci?n (e.g., `dentaxy-git-feat-login.vercel.app`).

*   **Producci?n:**
    ```bash
    npx vercel --prod
    ```
    *Uso:* **S?LO** cuando se necesita un hotfix urgente o despliegue manual saltando Git.
    *Preferible:* Hacer push a la rama `main` para disparar el CI/CD autom?tico.

### Gesti?n de Entorno
*   **Descargar Variables (Pull):**
    ```bash
    npx vercel env pull .env.local
    ```
    *Uso:* **CR?TICO** al iniciar sesi?n o cambiar de dispositivo. Sincroniza las variables de desarrollo con la nube.

*   **Vincular Proyecto:**
    ```bash
    npx vercel link
    ```
    *Uso:* Si el repositorio pierde la conexi?n con el proyecto de Vercel.

## 2. Estrategia de Ramas (Git Integration)

Dentaxy sigue el flujo estándar de Vercel:

| Rama Git | Entorno Vercel | URL | Comportamiento |
| :--- | :--- | :--- | :--- |
| `main` | **Production** | `dentaxy.com` | Despliegue autom?tico, optimizado. |
| `dev`, `staging` | **Preview** | `dentaxy-git-staging.vercel.app` | Entorno de pruebas compartido. |
| `feat/*` | **Preview** | `dentaxy-git-feat-xyz.vercel.app` | URL ?nica por cada rama/PR. |

> **Regla de Oro:** Nunca hagas push directo a `main` sin pasar por un Pull Request (PR) que genere una Preview URL para validaci?n.

## 3. ignorar Builds (Ignored Build Step)

Para ahorrar recursos, configura el "Ignored Build Step" en Vercel (Project Settings > Git) con el siguiente comando:

```bash
# S?lo construye si hay cambios en carpetas clave (src, public, package.json)
git diff HEAD^ HEAD --quiet .
```

Si el comando devuelve c?digo 1 (error/cambios), Vercel construye. Si devuelve 0 (sin cambios), omite la build.

## 4. Troubleshooting Com?n

*   **Error de Permisos:** Ejecuta `npx vercel login` para renovar credenciales.
*   **Build Fallida:** Revisa los logs en el dashboard o ejecuta `npx vercel build` localmente para replicar el proceso.
*   **Variables Perdidas:** Verifica que las variables est?n agregadas en el entorno correcto (Preview vs Production) en el dashboard de Vercel.
