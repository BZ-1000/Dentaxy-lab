/**
 * driveHelper.ts — Utilidades para la API de Google Drive
 * Gestiona subcarpetas y archivos clínicos bajo el esquema Zero-Storage.
 */

export interface PatientDriveFolders {
  notasId: string;
  gabineteId: string;
  consentimientosId: string;
  historiaId: string;
  odontogramaId: string;
}

/**
 * Obtener el token de acceso de Google del almacenamiento de sesión
 */
export function getGoogleAccessToken(): string | null {
  try {
    const seedUserStr = sessionStorage.getItem('seed_user');
    if (!seedUserStr) return null;
    const seedUser = JSON.parse(seedUserStr);
    return seedUser.googleAccessToken || null;
  } catch (e) {
    console.error("Error al leer googleAccessToken de sessionStorage:", e);
    return null;
  }
}

/**
 * Buscar o crear una subcarpeta específica bajo una carpeta padre
 */
export async function getOrCreateSubfolder(
  parentFolderId: string,
  folderName: string,
  accessToken: string
): Promise<string> {
  const query = encodeURIComponent(`'${parentFolderId}' in parents and name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`);
  
  const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id)`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  
  if (!searchRes.ok) {
    throw new Error(`Error buscando subcarpeta '${folderName}': ${searchRes.statusText}`);
  }
  
  const searchData = await searchRes.json();
  
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }
  
  // No existe, crearla
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId]
    })
  });
  
  if (!createRes.ok) {
    throw new Error(`Error creando subcarpeta '${folderName}': ${createRes.statusText}`);
  }
  
  const createData = await createRes.json();
  return createData.id;
}

/**
 * Inicializar todas las subcarpetas clínicas de un paciente
 */
export async function initializePatientFolders(
  patientFolderId: string,
  accessToken: string
): Promise<PatientDriveFolders> {
  const [notasId, gabineteId, consentimientosId, historiaId, odontogramaId] = await Promise.all([
    getOrCreateSubfolder(patientFolderId, 'Notas', accessToken),
    getOrCreateSubfolder(patientFolderId, 'Gabinete', accessToken),
    getOrCreateSubfolder(patientFolderId, 'Consentimientos', accessToken),
    getOrCreateSubfolder(patientFolderId, 'Historia', accessToken),
    getOrCreateSubfolder(patientFolderId, 'Odontograma', accessToken)
  ]);
  
  return { notasId, gabineteId, consentimientosId, historiaId, odontogramaId };
}

/**
 * Guardar o actualizar un archivo JSON en Drive
 */
export async function writeJsonFile(
  parentFolderId: string,
  fileName: string,
  data: any,
  accessToken: string
): Promise<string> {
  const query = encodeURIComponent(`'${parentFolderId}' in parents and name = '${fileName}' and trashed = false`);
  const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id)`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  
  const searchData = await searchRes.json();
  const fileExists = searchData.files && searchData.files.length > 0;
  const jsonString = JSON.stringify(data, null, 2);
  
  if (fileExists) {
    const fileId = searchData.files[0].id;
    // Actualizar contenido (media update)
    const updateRes = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: jsonString
    });
    
    if (!updateRes.ok) {
      throw new Error(`Error actualizando archivo ${fileName}: ${updateRes.statusText}`);
    }
    
    return fileId;
  } else {
    // Crear archivo mediante petición Multipart
    const boundary = 'dentaxy_json_boundary';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;
    
    const metadata = {
      name: fileName,
      mimeType: 'application/json',
      parents: [parentFolderId]
    };
    
    const bodyParts = [
      delimiter,
      `Content-Type: application/json; charset=UTF-8\r\n\r\n`,
      JSON.stringify(metadata),
      delimiter,
      `Content-Type: application/json\r\n\r\n`,
      jsonString,
      closeDelimiter
    ];
    
    const createRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: new Blob(bodyParts, { type: 'multipart/related' })
    });
    
    if (!createRes.ok) {
      throw new Error(`Error creando archivo ${fileName}: ${createRes.statusText}`);
    }
    
    const createData = await createRes.json();
    return createData.id;
  }
}

/**
 * Leer un archivo JSON de Drive
 */
export async function readJsonFile<T>(
  parentFolderId: string,
  fileName: string,
  accessToken: string
): Promise<T | null> {
  try {
    const query = encodeURIComponent(`'${parentFolderId}' in parents and name = '${fileName}' and trashed = false`);
    const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id)`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    const searchData = await searchRes.json();
    if (!searchData.files || searchData.files.length === 0) {
      return null;
    }
    
    const fileId = searchData.files[0].id;
    const downloadRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    if (!downloadRes.ok) {
      return null;
    }
    
    return await downloadRes.json() as T;
  } catch (e) {
    console.error(`Error leyendo archivo JSON ${fileName}:`, e);
    return null;
  }
}

/**
 * Listar los archivos dentro de una carpeta específica en Google Drive
 */
export async function listFiles(
  parentFolderId: string,
  accessToken: string
): Promise<any[]> {
  const query = encodeURIComponent(`'${parentFolderId}' in parents and trashed = false`);
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,createdTime,webContentLink,thumbnailLink)&orderBy=createdTime desc`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  
  if (!res.ok) {
    throw new Error(`Error al listar archivos: ${res.statusText}`);
  }
  
  const data = await res.json();
  return data.files || [];
}

/**
 * Descargar un archivo de Drive como un objeto URL local Blob para visualización directa en <img>
 */
export async function fetchDriveFileBlobUrl(
  fileId: string,
  accessToken: string
): Promise<string> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  
  if (!res.ok) {
    throw new Error(`Error al descargar archivo binario: ${res.statusText}`);
  }
  
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

/**
 * Subir un archivo binario a Drive usando FormData (multipart/form-data)
 * Compatible con CORS desde el navegador.
 */
export async function uploadBinaryFile(
  parentFolderId: string,
  fileName: string,
  mimeType: string,
  fileData: Blob | ArrayBuffer,
  accessToken: string
): Promise<string> {
  const fileBlob = fileData instanceof Blob ? fileData : new Blob([fileData], { type: mimeType });

  const metadata = JSON.stringify({
    name: fileName,
    parents: [parentFolderId]
  });

  const form = new FormData();
  form.append('metadata', new Blob([metadata], { type: 'application/json' }));
  form.append('file', fileBlob, fileName);

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`
        // NO especificar Content-Type aquí — FormData lo pone automáticamente con el boundary correcto
      },
      body: form
    }
  );

  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`[Drive Upload Error] ${res.status}:`, errorBody);
    throw new Error(`Error subiendo a Drive (${res.status}): ${errorBody}`);
  }

  const data = await res.json();
  if (!data.id) {
    throw new Error('Drive no devolvió un ID de archivo válido');
  }
  return data.id;
}
