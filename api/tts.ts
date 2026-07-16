import type { VercelRequest, VercelResponse } from '@vercel/node';
import { EdgeTTS } from 'edge-tts-universal';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const { text, voice } = req.body;

  if (!text || !voice) {
    return res.status(400).json({ error: 'Missing text or voice in request body' });
  }

  try {
    const tts = new EdgeTTS(text, voice);
    const result = await tts.synthesize();
    const buffer = Buffer.from(await result.audio.arrayBuffer());

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 's-maxage=31536000, stale-while-revalidate'); // Cache audio heavily
    res.send(buffer);
  } catch (error: any) {
    console.error('[Vercel Edge TTS Error]', error);
    res.status(500).json({ error: error.message || String(error) });
  }
}
