/**
 * driveSnapshot.ts — Motor de Snapshot Local para Dentaxy
 *
 * Principio: UNA sola llamada a Google Drive al inicio de la sesión.
 * Todo el contenido (lista de pacientes + IDs de carpetas) se almacena
 * en localStorage para que el carrusel y las fichas abran en <5ms.
 *
 * Regla Dentaxy: Cero latencia, privacidad absoluta, cero costos de API.
 */

export interface PatientSnapshot {
  id: string;
  name: string;
  createdTime?: string;
  appProperties?: Record<string, string>;
  subfolderIds?: {
    notasId: string;
    gabineteId: string;
    consentimientosId: string;
    historiaId: string;
    odontogramaId: string;
  };
  gabineteSubfolderIds?: {
    radiografias: string;
    intraorales: string;
    paciente: string;
  };
}

export interface DriveSnapshot {
  rootFolderId: string;
  patients: PatientSnapshot[];
  loadedAt: number; // timestamp Unix ms
}

const SNAPSHOT_KEY = 'dentaxy_drive_snapshot_v1';
const DEFAULT_MAX_AGE_MS = 30 * 60 * 1000; // 30 minutos

// ─── Lectura / Escritura de snapshot ─────────────────────────────────────────

export function getSnapshot(): DriveSnapshot | null {
  try {
    const raw = localStorage.getItem(SNAPSHOT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DriveSnapshot;
  } catch {
    return null;
  }
}

export function saveSnapshot(snapshot: DriveSnapshot): void {
  try {
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot));
  } catch (e) {
    console.warn('[DentaxySnapshot] No se pudo guardar snapshot:', e);
  }
}

export function clearSnapshot(): void {
  localStorage.removeItem(SNAPSHOT_KEY);
}

/**
 * Devuelve true si el snapshot existe y tiene menos de maxAgeMs milisegundos.
 */
export function isSnapshotFresh(maxAgeMs = DEFAULT_MAX_AGE_MS): boolean {
  const snap = getSnapshot();
  if (!snap) return false;
  return Date.now() - snap.loadedAt < maxAgeMs;
}

// ─── Actualización incremental ────────────────────────────────────────────────

/**
 * Actualiza los datos de un paciente en el snapshot sin recargar Drive.
 * Usar tras guardar nota, historia clínica, cobros, etc.
 */
export function patchPatientInSnapshot(patientId: string, patch: Partial<PatientSnapshot>): void {
  const snap = getSnapshot();
  if (!snap) return;
  const idx = snap.patients.findIndex(p => p.id === patientId);
  if (idx === -1) return;
  snap.patients[idx] = { ...snap.patients[idx], ...patch };
  saveSnapshot(snap);
}

/**
 * Añade un paciente recién creado al snapshot sin recargar Drive.
 */
export function addPatientToSnapshot(patient: PatientSnapshot): void {
  const snap = getSnapshot();
  if (!snap) return;
  const exists = snap.patients.some(p => p.id === patient.id);
  if (exists) return;
  snap.patients = [patient, ...snap.patients];
  saveSnapshot(snap);
}

// ─── Carga masiva desde Drive ─────────────────────────────────────────────────

/**
 * loadDriveSnapshot — Carga TODO el contenido clínico de Drive en una sesión.
 *
 * Estrategia:
 * 1. Busca la carpeta raíz "Dentaxy"
 * 2. Lista TODOS los pacientes (subcarpetas)
 * 3. Para cada paciente, lista sus subcarpetas clínicas en paralelo
 * 4. Guarda todo en localStorage
 *
 * Se llama UNA sola vez al iniciar la app. Las fichas y el carrusel
 * consumen este snapshot directamente.
 */
export async function loadDriveSnapshot(accessToken: string): Promise<DriveSnapshot | null> {
  try {
    // 1. Buscar carpeta raíz "Dentaxy"
    const queryRoot = encodeURIComponent(
      "name = 'Dentaxy' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
    );
    const resRoot = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${queryRoot}&fields=files(id)`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!resRoot.ok) throw new Error(`Error buscando carpeta raíz: ${resRoot.status}`);
    const dataRoot = await resRoot.json();

    if (!dataRoot.files || dataRoot.files.length === 0) {
      // No hay carpeta Dentaxy → snapshot vacío pero válido
      const emptySnap: DriveSnapshot = { rootFolderId: '', patients: [], loadedAt: Date.now() };
      saveSnapshot(emptySnap);
      return emptySnap;
    }

    const rootFolderId = dataRoot.files[0].id;

    // 2. Listar pacientes (subcarpetas de "Dentaxy")
    const queryPatients = encodeURIComponent(
      `'${rootFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
    );
    const resPatients = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${queryPatients}&fields=files(id,name,createdTime,appProperties)&orderBy=createdTime desc`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!resPatients.ok) throw new Error(`Error listando pacientes: ${resPatients.status}`);
    const dataPatients = await resPatients.json();

    const rawPatients: any[] = dataPatients.files || [];

    // 3. Para cada paciente, obtener IDs de subcarpetas en paralelo
    //    Usamos Promise.allSettled para que un error en un paciente no bloquee al resto.
    const patientsWithFolders = await Promise.allSettled(
      rawPatients.map(p => enrichPatientWithSubfolders(p, accessToken))
    );

    const patients: PatientSnapshot[] = patientsWithFolders.map((result, idx) => {
      if (result.status === 'fulfilled') return result.value;
      // Si falló, devolver los datos básicos del paciente sin subcarpetas
      return { ...rawPatients[idx] };
    });

    const snapshot: DriveSnapshot = {
      rootFolderId,
      patients,
      loadedAt: Date.now(),
    };

    saveSnapshot(snapshot);
    console.log(`[DentaxySnapshot] Snapshot cargado: ${patients.length} pacientes`);
    return snapshot;

  } catch (err) {
    console.error('[DentaxySnapshot] Error al cargar snapshot de Drive:', err);
    return null;
  }
}

/**
 * Enriquece los datos de un paciente con los IDs de sus subcarpetas clínicas.
 * Usa listas de archivos en vez de búsquedas individuales para minimizar llamadas.
 */
async function enrichPatientWithSubfolders(
  patient: any,
  accessToken: string
): Promise<PatientSnapshot> {
  try {
    // Listar TODAS las subcarpetas del paciente en UNA sola llamada
    const query = encodeURIComponent(
      `'${patient.id}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
    );
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!res.ok) return { ...patient };

    const data = await res.json();
    const folders: { id: string; name: string }[] = data.files || [];

    const find = (name: string) => folders.find(f => f.name === name)?.id || '';

    const notasId = find('Notas');
    const gabineteId = find('Gabinete');
    const consentimientosId = find('Consentimientos');
    const historiaId = find('Historia');
    const odontogramaId = find('Odontograma');

    const subfolderIds = notasId || gabineteId
      ? { notasId, gabineteId, consentimientosId, historiaId, odontogramaId }
      : undefined;

    // Si existe carpeta Gabinete, también obtener sus subcarpetas
    let gabineteSubfolderIds: PatientSnapshot['gabineteSubfolderIds'] = undefined;
    if (gabineteId) {
      const gQuery = encodeURIComponent(
        `'${gabineteId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
      );
      const gRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${gQuery}&fields=files(id,name)`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (gRes.ok) {
        const gData = await gRes.json();
        const gFolders: { id: string; name: string }[] = gData.files || [];
        const gFind = (name: string) => gFolders.find(f => f.name === name)?.id || '';
        const radiografias = gFind('Radiografias');
        const intraorales = gFind('Intraorales');
        const paciente = gFind('Paciente');
        if (radiografias || intraorales || paciente) {
          gabineteSubfolderIds = { radiografias, intraorales, paciente };
        }
      }
    }

    return { ...patient, subfolderIds, gabineteSubfolderIds };
  } catch {
    return { ...patient };
  }
}

// ─── Función de acceso conveniente ───────────────────────────────────────────

/**
 * Obtiene la lista de pacientes del snapshot local.
 * Si no hay snapshot, retorna null.
 */
export function getPatientsFromSnapshot(): PatientSnapshot[] | null {
  const snap = getSnapshot();
  return snap ? snap.patients : null;
}

/**
 * Obtiene los IDs de subcarpetas de un paciente desde el snapshot.
 */
export function getPatientSubfoldersFromSnapshot(patientId: string) {
  const snap = getSnapshot();
  if (!snap) return null;
  const patient = snap.patients.find(p => p.id === patientId);
  return patient?.subfolderIds || null;
}

/**
 * Obtiene los IDs de subcarpetas del gabinete de un paciente desde el snapshot.
 */
export function getPatientGabineteSubfoldersFromSnapshot(patientId: string) {
  const snap = getSnapshot();
  if (!snap) return null;
  const patient = snap.patients.find(p => p.id === patientId);
  return patient?.gabineteSubfolderIds || null;
}
