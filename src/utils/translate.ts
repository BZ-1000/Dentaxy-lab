
const GOOGLE_TRANSLATE_API_KEY = 'YOUR_API_KEY'; // This should be moved to Supabase secrets

export async function translateToSpanishWithGoogle(text: string): Promise<string> {
  if (!text) return '';
  
  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`,
      {
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
      }
    );

    const data = await response.json();
    if (data.data && data.data.translations && data.data.translations[0]) {
      return data.data.translations[0].translatedText;
    }
    
    return text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}
