import { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

// Usamos las variables que se usan en frontend (VITE_) porque Vercel también las tiene, 
// o definimos genéricas si existen.
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Validar autenticación con Supabase
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // 2. Obtener el refresh_token del doctor
    const { data: integration, error: dbError } = await supabase
      .from('doctor_integrations')
      .select('refresh_token')
      .eq('doctor_id', user.id)
      .eq('provider', 'google_drive')
      .single();

    if (dbError || !integration?.refresh_token) {
      return res.status(403).json({ error: 'Drive not connected or token missing' });
    }

    // 3. Configurar Google API y generar access_token temporal
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({ refresh_token: integration.refresh_token });
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // 4. Crear carpeta en Drive (Arquitectura Zero-Storage)
    const { formData } = req.body;
    const folderName = `${formData.apellidos || ''}, ${formData.nombre || ''} - Expediente`.trim();

    const fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    };

    const driveRes = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id, name',
    });

    // Devolvemos éxito confirmando que se creó en Drive, sin guardar nada clínico en Supabase
    return res.status(200).json({ 
      success: true, 
      folderId: driveRes.data.id,
      message: 'Expediente creado en el Google Drive del doctor.'
    });

  } catch (error: any) {
    console.error("Error en upload-patient:", error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
