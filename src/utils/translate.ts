
interface TranslateResponse {
  translatedText: string;
}

export async function translateText(text: string): Promise<string> {
  // Si el texto está vacío, es 'N/A' o undefined, devolvemos el texto original
  if (!text || text === 'N/A' || text.trim() === '') return text;
  
  try {
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: 'es',
      }),
    });

    if (!response.ok) {
      console.error('Translation error:', response.statusText);
      return text; // Return original text if translation fails
    }

    const data: TranslateResponse = await response.json();
    return data.translatedText || text; // Ensure we return the original text if translation is empty
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
}
