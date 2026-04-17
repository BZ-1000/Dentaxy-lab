// ─────────────────────────────────────────────────────────────────────────────
// GEO.TS — Motor de Geofencing para DentaXy UAO UAZ
// Zonas permitidas: Campus UAO UAZ (Begonias) + Oficina Dentaxy
// ─────────────────────────────────────────────────────────────────────────────

export interface GeoZona {
  nombre: string;
  lat: number;
  lng: number;
  radiusKm: number;
}

// ── Zonas fijas de acceso autorizado ──────────────────────────────────────────
const ZONAS_FIJAS: GeoZona[] = [
  {
    nombre: 'Campus UAO UAZ (Begonias, Guadalupe)',
    lat: 22.752317,
    lng: -102.531238,
    radiusKm: 1.5,
  },
  {
    // Oficina / Centro de Zacatecas (Dentaxy HQ)
    nombre: 'Oficina Dentaxy — Zacatecas Centro',
    lat: 22.7709,
    lng: -102.5832,
    radiusKm: 1.2,
  },
];

const EXTRA_ZONES_KEY = 'uao_geo_extra_zones';

// ── Fórmula Haversine ─────────────────────────────────────────────────────────
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Cargar zonas extra desde localStorage ────────────────────────────────────
export function getExtraZones(): GeoZona[] {
  try {
    const raw = localStorage.getItem(EXTRA_ZONES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ── Guardar una nueva zona calificada ────────────────────────────────────────
export function saveCustomZone(zona: GeoZona): void {
  const existing = getExtraZones();
  existing.push(zona);
  localStorage.setItem(EXTRA_ZONES_KEY, JSON.stringify(existing));
}

export function removeCustomZone(index: number): void {
  const existing = getExtraZones();
  existing.splice(index, 1);
  localStorage.setItem(EXTRA_ZONES_KEY, JSON.stringify(existing));
}

// ── Obtener ubicación actual ─────────────────────────────────────────────────
export function getCurrentPosition(): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalización no disponible en este navegador.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      (err) => reject(err),
      { timeout: 12000, maximumAge: 0, enableHighAccuracy: true }
    );
  });
}

// ── Función principal de verificación ────────────────────────────────────────
export async function checkGeofence(): Promise<{
  ok: boolean;
  zonaNombre?: string;
  distanciaKm?: number;
  error?: string;
}> {
  try {
    const coords = await getCurrentPosition();
    const { latitude, longitude } = coords;

    const todasLasZonas: GeoZona[] = [...ZONAS_FIJAS, ...getExtraZones()];

    for (const zona of todasLasZonas) {
      const dist = getDistanceKm(latitude, longitude, zona.lat, zona.lng);
      if (dist <= zona.radiusKm) {
        return { ok: true, zonaNombre: zona.nombre, distanciaKm: Math.round(dist * 1000) };
      }
    }

    // Ninguna zona coincide: calcular la más cercana para mostrar en el mensaje de error
    let menorDist = Infinity;
    let zonaBase = todasLasZonas[0];
    for (const zona of todasLasZonas) {
      const dist = getDistanceKm(latitude, longitude, zona.lat, zona.lng);
      if (dist < menorDist) { menorDist = dist; zonaBase = zona; }
    }

    return {
      ok: false,
      zonaNombre: zonaBase.nombre,
      distanciaKm: Math.round(menorDist * 1000),
      error: `Fuera de zona autorizada. Zona más cercana: "${zonaBase.nombre}" a ${(menorDist).toFixed(1)} km.`,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido de GPS.';
    return { ok: false, error: `No se pudo verificar tu ubicación: ${message}` };
  }
}
