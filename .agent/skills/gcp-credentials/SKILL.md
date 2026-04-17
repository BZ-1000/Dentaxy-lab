---
name: gcp-credentials
description: Protocolo de gestión de tokens y credenciales de Google Cloud Platform para el proyecto Dentaxy. Define el comportamiento de fallback automático cuando la cuenta principal agota su cuota. Usar SIEMPRE que se ejecuten tareas que involucren APIs de Google Cloud (Vertex AI, Cloud Storage, Speech-to-Text, etc.).
---

# Gestión de Credenciales GCP — Protocolo Dentaxy

## Cuentas Disponibles

### Cuenta Principal (por defecto)
- **Autenticación:** Credenciales de entorno `GOOGLE_APPLICATION_CREDENTIALS` o ADC (Application Default Credentials).
- **Estado:** Activa en condiciones normales.

### Cuenta de Respaldo (Service Account)
- **Ruta del archivo:** `/home/bz1000/Dentaxy-lab/credentials/archivo.json`
- **Tipo:** Service Account Key (JSON)
- **Uso:** Exclusivo cuando la cuenta principal falla por cuota agotada.

> [!CAUTION]
> El directorio `credentials/` está en `.gitignore`. **NUNCA** commitar el archivo JSON al repositorio. No incluirlo en ningún log ni respuesta visible.

---

## Protocolo de Fallback Automático

### Trigger de Activación
El cambio a la cuenta de respaldo ocurre automáticamente cuando el agente detecta **cualquiera** de los siguientes errores en una respuesta de API de Google Cloud:

| Código de Error | Mensaje | Acción |
|---|---|---|
| `429` | `RESOURCE_EXHAUSTED` | → Cambiar a Service Account |
| `429` | `Quota exceeded` | → Cambiar a Service Account |
| `403` | `Daily limit exceeded` | → Cambiar a Service Account |

### Procedimiento de Cambio

```bash
# Exportar la ruta al Service Account de respaldo
export GOOGLE_APPLICATION_CREDENTIALS="/home/bz1000/Dentaxy-lab/credentials/archivo.json"
```

El agente ejecutará este comando antes de reintentar la operación fallida.

### Mensaje de Confirmación Obligatorio
Cuando se realice el cambio, el agente DEBE notificar al usuario con exactamente este mensaje:

> **"Tokens principales agotados. Utilizando ahora credenciales de Google Cloud de respaldo."**

---

## Arquitectura de Privacidad (Regla de Oro)

Ninguna de las funciones de IA de Dentaxy (Motor de Redacción, Historia Clínica, etc.) envía datos clínicos a APIs externas. Las credenciales GCP se utilizan exclusivamente para:

- **Vertex AI / Gemini API:** Únicamente para funciones auxiliares del agente de desarrollo (Antigravity).
- **Cloud Storage:** Respaldo de assets no clínicos si aplica.
- **Speech-to-Text:** Dictado de voz local que no almacena datos.

**Los datos de pacientes NUNCA salen del dispositivo del dentista.**

---

## Verificación de Cuota Actual

Para verificar el estado de la cuota antes de una tarea intensiva:

```bash
# Verificar cuota de la cuenta activa
gcloud auth list
gcloud quota quotas list --service=generativelanguage.googleapis.com
```

---

## Notas de Seguridad

- El archivo `archivo.json` tiene permisos `600` (solo lectura por el propietario).
- Rotar el Service Account cada 90 días desde la consola de GCP.
- URL de consola: https://console.cloud.google.com/iam-admin/serviceaccounts
