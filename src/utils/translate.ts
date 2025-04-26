
interface TranslateResponse {
  translatedText: string;
}

export async function translateText(texts: string | string[]): Promise<string | string[]> {
  // Si recibimos un string único, lo convertimos en array para procesar uniformemente
  const textsArray = Array.isArray(texts) ? texts : [texts];
  
  // Filtrar textos vacíos o N/A
  const validTexts = textsArray.filter(text => text && text !== 'N/A' && text.trim() !== '');
  
  if (validTexts.length === 0) {
    return Array.isArray(texts) ? textsArray : textsArray[0];
  }

  try {
    // Crear un array de promesas para todas las traducciones
    const translationPromises = validTexts.map(text => 
      fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: 'es',
        }),
      }).then(response => response.ok ? response.json() : { translatedText: text })
    );

    // Ejecutar todas las traducciones en paralelo
    const results = await Promise.all(translationPromises);
    const translatedTexts = results.map(result => result.translatedText);

    // Reemplazar solo los textos válidos en el array original
    let currentIndex = 0;
    const finalTexts = textsArray.map(text => {
      if (text && text !== 'N/A' && text.trim() !== '') {
        const translatedText = translatedTexts[currentIndex];
        currentIndex++;
        return translatedText;
      }
      return text;
    });

    // Retornar en el mismo formato que se recibió
    return Array.isArray(texts) ? finalTexts : finalTexts[0];
  } catch (error) {
    console.error('Translation error:', error);
    return texts; // Return original text(s) if translation fails
  }
}
