/**
 * patientCache.ts — Motor de Almacenamiento Local Determinista para Dentaxy
 * Regla de Desarrollo Dentaxy: Cero latencia, persistencia local-first.
 * 
 * Este módulo gestiona la caché de expedientes clínicos en localStorage/sessionStorage.
 * Permite renderizado INSTÁNTANEO (<5ms) de fichas, gabinete, odontogramas y notas
 * eliminando las peticiones de red repetitivas a Google Drive.
 */

export interface CachedPatientData {
  folderId: string;
  timestamp: number;
  subfolderIds?: {
    notasId: string;
    gabineteId: string;
    consentimientosId: string;
    historiaId: string;
    odontogramaId: string;
  };
  gabineteSubfolders?: {
    radiografias?: string;
    intraorales?: string;
    paciente?: string;
  };
  historyData?: {
    alergias: string;
    motivo: string;
    antecedentes: string;
    sistemicas: string;
    [key: string]: any;
  };
  notes?: any[];
  presupuesto?: any[];
  odontogramaState?: any;
  gabineteFiles?: any[]; // Solo metadatos (id, name, mimeType, category) — NO blobURLs
  consentFiles?: any[];  // Solo metadatos — NO blobURLs
}

const CACHE_PREFIX = 'dentaxy_patient_exp_v2_';
// Tiempo máximo de frescura para datos clínicos: 30 minutos
const DATA_MAX_AGE_MS = 30 * 60 * 1000;

export const patientCache = {
  /**
   * Obtener expediente completo desde caché local
   */
  get(folderId: string): CachedPatientData | null {
    if (typeof window === 'undefined' || !folderId) return null;
    try {
      const raw = localStorage.getItem(`${CACHE_PREFIX}${folderId}`);
      if (!raw) return null;
      return JSON.parse(raw) as CachedPatientData;
    } catch (e) {
      console.warn(`[DentaxyCache] Error al leer caché de expediente ${folderId}:`, e);
      return null;
    }
  },

  /**
   * Guardar o fusionar expediente completo en caché local
   */
  set(folderId: string, data: Partial<CachedPatientData>): void {
    if (typeof window === 'undefined' || !folderId) return;
    try {
      const existing = this.get(folderId) || { folderId, timestamp: Date.now() };
      const updated: CachedPatientData = {
        ...existing,
        ...data,
        timestamp: Date.now()
      };
      localStorage.setItem(`${CACHE_PREFIX}${folderId}`, JSON.stringify(updated));
    } catch (e) {
      console.warn(`[DentaxyCache] Error al guardar caché de expediente ${folderId}:`, e);
    }
  },

  /**
   * Actualizar un campo específico del expediente de forma atómica
   */
  updateField<K extends keyof CachedPatientData>(folderId: string, field: K, value: CachedPatientData[K]): void {
    if (typeof window === 'undefined' || !folderId) return;
    const current = this.get(folderId) || { folderId, timestamp: Date.now() };
    current[field] = value;
    current.timestamp = Date.now();
    try {
      localStorage.setItem(`${CACHE_PREFIX}${folderId}`, JSON.stringify(current));
    } catch (e) {
      console.warn(`[DentaxyCache] Error al actualizar campo ${String(field)} para ${folderId}:`, e);
    }
  },

  /**
   * Verifica si el caché de un paciente tiene datos completos y frescos.
   * "Completos" significa que tiene subfolderIds cargados.
   * "Frescos" significa que tienen menos de DATA_MAX_AGE_MS ms de antigüedad.
   */
  hasCompleteData(folderId: string): boolean {
    const cached = this.get(folderId);
    if (!cached) return false;
    if (!cached.subfolderIds) return false;
    const age = Date.now() - (cached.timestamp || 0);
    return age < DATA_MAX_AGE_MS;
  },

  /**
   * Devuelve los IDs de subcarpetas clínicas del paciente desde caché.
   */
  getSubfolderIds(folderId: string): CachedPatientData['subfolderIds'] | null {
    const cached = this.get(folderId);
    return cached?.subfolderIds || null;
  },

  /**
   * Guarda solo los IDs de subcarpetas sin tocar los demás datos.
   */
  setSubfolderIds(folderId: string, ids: CachedPatientData['subfolderIds']): void {
    this.updateField(folderId, 'subfolderIds', ids);
  },

  /**
   * Devuelve los IDs de subcarpetas del gabinete desde caché.
   */
  getGabineteSubfolders(folderId: string): CachedPatientData['gabineteSubfolders'] | null {
    const cached = this.get(folderId);
    return cached?.gabineteSubfolders || null;
  },

  /**
   * Cuántos minutos de antigüedad tienen los datos cacheados.
   */
  getAgeMinutes(folderId: string): number {
    const cached = this.get(folderId);
    if (!cached) return Infinity;
    return Math.round((Date.now() - cached.timestamp) / 60000);
  },

  /**
   * Limpiar la caché de un paciente o toda la app
   */
  clear(folderId?: string): void {
    if (typeof window === 'undefined') return;
    if (folderId) {
      localStorage.removeItem(`${CACHE_PREFIX}${folderId}`);
    } else {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    }
  }
};
