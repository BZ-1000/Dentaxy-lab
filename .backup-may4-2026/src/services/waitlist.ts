/**
 * waitlistService — Dentaxy Waitlist v2.1
 *
 * Arquitectura:
 *  - submitLead() → Google Apps Script (POST, Content-Type: text/plain, mode: no-cors)
 *  - getToggles() → Supabase tabla 'dentaxy_modules' columna 'waitlist_visible'
 *                   (Fase 2 la conecta; Fase 1 usa DEFAULT_TOGGLES = todos visibles)
 *  - updateToggle() → Supabase upsert (usado por panel admin en Fase 2)
 *
 * NOTA CORS: Google Apps Script bloquea pre-flight. Usar SIEMPRE:
 *   headers: { 'Content-Type': 'text/plain' }
 *   mode: 'no-cors'
 * Con no-cors la respuesta es "opaca" (status 0) — asumimos éxito si no hay error de red.
 */

import { supabase } from '@/integrations/supabase/client';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type WaitlistModule =
  | 'Seed'
  | 'Shop'
  | 'Lab'
  | 'Club'
  | 'News'
  | 'Aura'
  | 'Space'
  | 'MyLana';

export const WAITLIST_MODULE_KEYS: WaitlistModule[] = [
  'Seed', 'Shop', 'Lab', 'Club', 'News', 'Aura', 'Space', 'MyLana',
];

export interface WaitlistPayload {
  nombre: string;
  email: string;
  telefono: string;       // Obligatorio — respaldo si el correo cae en spam
  modulo: string;         // Puede ser uno o varios concatenados: "Seed, Lab, MyLana"
  archivoData?: string;   // base64 — solo cuando se selecciona Seed
  archivoNombre?: string;
  archivoMimeType?: string;
}

export type WaitlistToggles = Record<WaitlistModule, boolean>;

// ─── Configuración ────────────────────────────────────────────────────────────

/**
 * DEFAULT_TOGGLES: todos los módulos visibles.
 * Se usa como fallback cuando Supabase no está disponible o la columna
 * 'waitlist_visible' aún no existe (antes de que corra la migración de Fase 2).
 * Esto garantiza que el modal muestre TODOS los módulos desde el día 1.
 */
const DEFAULT_TOGGLES: WaitlistToggles = {
  Seed:   true,
  Shop:   true,
  Lab:    true,
  Club:   true,
  News:   true,
  Aura:   true,
  Space:  true,
  MyLana: true,
};

// v3.0 — Con envío de email de confirmación + organización por pestañas de módulo
const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzl6GEDxzlJddLzqJbq8ApTlLoNBOo5W2OOFEvIAKA7yu80aXSKZqjw4YP3w5brh7Pe/exec';

// ─── Servicio ─────────────────────────────────────────────────────────────────

export const waitlistService = {
  /**
   * Envía un lead a Google Apps Script.
   *
   * Restricciones técnicas de GAS:
   * - 'Content-Type: text/plain' evita el pre-flight OPTIONS (bloqueo CORS).
   * - 'mode: no-cors' hace la respuesta opaca (status 0) — no podemos leerla.
   * - Asumimos éxito si fetch() no lanza un error de red.
   */
  async submitLead(payload: WaitlistPayload): Promise<void> {
    // Validaciones mínimas del lado cliente
    if (!payload.nombre?.trim()) throw new Error('El nombre es obligatorio.');
    if (!payload.email?.trim()) throw new Error('El email es obligatorio.');
    if (!payload.telefono?.trim()) throw new Error('El teléfono es obligatorio.');
    if (!payload.modulo?.trim()) throw new Error('Debes seleccionar al menos un módulo.');

    const body = JSON.stringify(payload);

    console.log('[Waitlist] Enviando lead →', {
      nombre: payload.nombre,
      email: payload.email,
      telefono: payload.telefono,
      modulo: payload.modulo,
      tieneArchivo: !!payload.archivoData,
    });

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          // CRÍTICO: text/plain evita el pre-flight CORS de GAS
          'Content-Type': 'text/plain',
        },
        body,
        mode: 'no-cors',
      });

      // Con no-cors la respuesta es siempre opaca (status 0).
      // Si llegamos aquí sin excepción = la petición salió de la red correctamente.
      console.log('[Waitlist] Lead enviado exitosamente (respuesta opaca — modo no-cors).');
    } catch (networkError) {
      // Solo falla si hay un error de red real (sin internet, DNS fail, etc.)
      console.error('[Waitlist] Error de red al enviar lead:', networkError);
      throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
    }
  },

  /**
   * Obtiene los toggles de visibilidad en el modal de waitlist.
   *
   * Fase 1: Si la columna 'waitlist_visible' no existe aún en dentaxy_modules,
   *         o si hay cualquier error de Supabase, retorna DEFAULT_TOGGLES (todos visible).
   *         Esto garantiza que el modal funcione mientras se corre la migración de Fase 2.
   *
   * Fase 2: Una vez migrada la BD, esta función leerá correctamente los toggles
   *         controlados desde el panel admin (/admin/waitlist).
   */
  async getToggles(): Promise<WaitlistToggles> {
    try {
      const { data, error } = await supabase
        .from('dentaxy_modules')
        .select('name, waitlist_visible')
        .in('name', WAITLIST_MODULE_KEYS);

      if (error) {
        // Puede fallar si la columna aún no existe (antes de Fase 2) — es esperado
        console.warn('[Waitlist] getToggles → fallback a defaults:', error.message);
        return DEFAULT_TOGGLES;
      }

      if (!data || data.length === 0) {
        console.warn('[Waitlist] getToggles → sin datos en dentaxy_modules, usando defaults.');
        return DEFAULT_TOGGLES;
      }

      // Construir el mapa de toggles desde los registros de Supabase
      const toggleMap = WAITLIST_MODULE_KEYS.reduce<WaitlistToggles>((acc, key) => {
        const row = data.find((r) => r.name === key);
        // Si el registro existe y waitlist_visible está definido, usar ese valor.
        // Si no existe el registro o el campo es null → true por defecto (no bloquear).
        acc[key] = row?.waitlist_visible ?? true;
        return acc;
      }, { ...DEFAULT_TOGGLES });

      console.log('[Waitlist] Toggles cargados desde Supabase:', toggleMap);
      return toggleMap;
    } catch (unexpectedError) {
      console.error('[Waitlist] Error inesperado en getToggles:', unexpectedError);
      return DEFAULT_TOGGLES;
    }
  },

  /**
   * Actualiza la visibilidad de un módulo específico en la waitlist.
   * Usado por el panel admin en Fase 2 (/admin/waitlist).
   */
  async updateToggle(module: WaitlistModule, visible: boolean): Promise<void> {
    const { error } = await supabase
      .from('dentaxy_modules')
      .update({ waitlist_visible: visible })
      .eq('name', module);

    if (error) {
      console.error(`[Waitlist] Error actualizando toggle para ${module}:`, error);
      throw new Error(`No se pudo actualizar la visibilidad de ${module}.`);
    }

    console.log(`[Waitlist] Toggle actualizado → ${module}: ${visible}`);
  },

  /**
   * Actualiza TODOS los toggles en una sola operación.
   * Optimización para cuando el admin cambia múltiples módulos a la vez.
   */
  async updateAllToggles(toggles: WaitlistToggles): Promise<void> {
    const updates = WAITLIST_MODULE_KEYS.map((key) =>
      supabase
        .from('dentaxy_modules')
        .update({ waitlist_visible: toggles[key] })
        .eq('name', key)
    );

    const results = await Promise.allSettled(updates);
    const errors = results
      .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
      .map((r) => r.reason);

    if (errors.length > 0) {
      console.error('[Waitlist] Errores al actualizar toggles en lote:', errors);
      throw new Error('Algunos toggles no se pudieron actualizar. Revisa la consola.');
    }
  },
};
