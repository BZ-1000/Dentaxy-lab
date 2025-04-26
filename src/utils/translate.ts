
// LibreTranslate API endpoint
const LIBRE_TRANSLATE_URL = 'https://libretranslate.de/translate';

export async function translateToSpanishWithGoogle(text: string): Promise<string> {
  if (!text) return '';
  
  try {
    const response = await fetch(LIBRE_TRANSLATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: 'es',
        format: 'text'
      })
    });

    const data = await response.json();
    if (data.translatedText) {
      return data.translatedText;
    }
    
    return text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

