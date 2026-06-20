import { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, state, error } = req.query;

  if (error) {
    console.error('Google OAuth Error:', error);
    return res.redirect('/seed/app?error=oauth_rejected');
  }

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'code is required' });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || 'http://localhost:8080/api/auth/google/callback'
    );

    // Intercambiar el código por los tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    // Solo obtenemos el refresh_token si el usuario concedió acceso offline y es la primera vez (prompt=consent)
    const refreshToken = tokens.refresh_token;

    if (!refreshToken) {
      // Si no nos dio un refresh_token, pudo haber sido que ya había autorizado antes sin prompt=consent.
      // Como forzamos prompt=consent en login.ts, esto no debería pasar a menos que haya un error extraño.
      console.warn("No se recibió refresh_token. El usuario ya había autorizado.");
      return res.redirect('/seed/app?error=no_refresh_token');
    }

    // Como no tenemos la Service Role Key para insertar directamente en Supabase desde aquí,
    // enviamos el token al frontend mediante el fragmento de la URL (hash) para que el frontend,
    // que sí tiene la sesión autenticada, lo guarde en la BD.
    // El hash no se envía al servidor ni se guarda en el historial de navegación fácilmente.
    const redirectUrl = `/seed/app#oauth_token=${encodeURIComponent(refreshToken)}`;
    
    res.redirect(redirectUrl);

  } catch (err: any) {
    console.error('Error intercambiando el código de OAuth:', err);
    res.redirect('/seed/app?error=oauth_exchange_failed');
  }
}
