/**
 * useDemoTokenValidator.ts
 * Valida tokens del Demo Engine contra Supabase.
 * Primero busca en demo_links (Supabase), luego hace fallback a tokens locales.
 * Si el token tiene geofence activo, retorna los datos de la zona para que
 * el componente pueda verificar el GPS antes de redirigir.
 */
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GeoZoneData {
  name: string;
  lat: number;
  lng: number;
  radiusKm: number;
}

export interface TokenValidationResult {
  valid: boolean;
  source: 'supabase' | 'local' | null;
  requiresGeoCheck: boolean;
  geoZone?: GeoZoneData;
  allowedModules?: string[];
  requiresUserInfo?: boolean;
  errorMessage?: string;
  tokenRow?: Record<string, unknown>;
}

// Tokens locales del sistema UAO (fallback cuando no hay internet)
const LOCAL_UAO_TOKENS: Record<string, string> = {
  'TKN-DIR-2026': 'director',
  'TKN-COO-2026': 'coordinador',
  'TKN-JEF-2026': 'jefe',
  'TKN-DOC-2026': 'docente',
  'TKN-ALU-2026': 'alumno',
  'TKN-ADM-2026': 'administrativo',
  'TKN-PAC-2026': 'paciente',
};

export function useDemoTokenValidator() {
  const validateToken = useCallback(async (token: string): Promise<TokenValidationResult> => {
    const t = token.trim();
    if (!t) {
      return { valid: false, source: null, requiresGeoCheck: false, errorMessage: 'Token vacío' };
    }

    // ── 1. Buscar en Supabase Demo Engine ──────────────────────────────────────
    try {
      const { data: linkData, error } = await supabase
        .from('demo_links')
        .select('*')
        .eq('token', t)
        .maybeSingle();

      if (!error && linkData) {
        // Verificar expiración
        if (new Date(linkData.expires_at) < new Date()) {
          return { valid: false, source: 'supabase', requiresGeoCheck: false, errorMessage: 'Token expirado.' };
        }
        // Verificar usos
        if (linkData.current_uses >= linkData.max_uses) {
          return { valid: false, source: 'supabase', requiresGeoCheck: false, errorMessage: 'Este token ha alcanzado su límite de usos.' };
        }
        // Verificar revocación
        if (linkData.is_revoked) {
          return { valid: false, source: 'supabase', requiresGeoCheck: false, errorMessage: 'Token revocado.' };
        }

        // Token válido — verificar geofence
        const requiresGeoCheck = !!linkData.is_geo_fenced && !!linkData.geo_lat && !!linkData.geo_lng;

        return {
          valid: true,
          source: 'supabase',
          requiresGeoCheck,
          geoZone: requiresGeoCheck ? {
            name: linkData.geo_zone_name || 'Zona Autorizada',
            lat: linkData.geo_lat,
            lng: linkData.geo_lng,
            radiusKm: linkData.geo_radius_km ?? 1.5,
          } : undefined,
          allowedModules: linkData.allowed_modules ?? [],
          requiresUserInfo: linkData.requires_user_info ?? true,
          tokenRow: linkData,
        };
      }
    } catch {
      // Si falla la conexión a Supabase, caemos al fallback local
    }

    // ── 2. Fallback: tokens locales UAO ─────────────────────────────────────────
    // También revisar tokens en localStorage (generados por DemoContext)
    try {
      const localTokensRaw = localStorage.getItem('uao_demo_tokens');
      const localTokens: Record<string, string> = localTokensRaw
        ? JSON.parse(localTokensRaw)
        : LOCAL_UAO_TOKENS;

      if (localTokens[t]) {
        return {
          valid: true,
          source: 'local',
          requiresGeoCheck: false, // Los tokens locales nunca tienen geo
          allowedModules: ['academico'],
          requiresUserInfo: false,
        };
      }
    } catch { /* ignore */ }

    // Tokens locales hardcoded como último recurso
    if (LOCAL_UAO_TOKENS[t]) {
      return {
        valid: true,
        source: 'local',
        requiresGeoCheck: false,
        allowedModules: ['academico'],
        requiresUserInfo: false,
      };
    }

    return {
      valid: false,
      source: null,
      requiresGeoCheck: false,
      errorMessage: 'Token de acceso inválido o no encontrado.',
    };
  }, []);

  return { validateToken };
}
