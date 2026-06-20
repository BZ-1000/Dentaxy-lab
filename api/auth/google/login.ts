import { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_id } = req.query;

  if (!user_id || typeof user_id !== 'string') {
    return res.status(400).json({ error: 'user_id is required' });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:8080/api/auth/google/callback'
  );

  const scopes = [
    'https://www.googleapis.com/auth/drive.file'
  ];

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // Forzamos a que nos den el refresh token
    scope: scopes,
    state: user_id, // Pasamos el user_id en el estado para recuperarlo en el callback
    include_granted_scopes: true
  });

  // Redirigimos al usuario a la página de consentimiento de Google
  res.redirect(authorizationUrl);
}
