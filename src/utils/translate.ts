
interface TranslateResponse {
  translatedText: string;
  error?: string;
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
    // Crear un array de promesas para todas las traducciones en paralelo
    const translationPromises = validTexts.map(async (text) => {
      try {
        // Intentar primero con LibreTranslate
        const response = await fetch('https://libretranslate.de/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            source: 'en',
            target: 'es'
          })
        });

        if (response.ok) {
          const data = await response.json();
          return data.translatedText || text;
        }
        
        // Si LibreTranslate falla, intentar con una API alternativa
        console.log('LibreTranslate falló, usando texto original:', text);
        return text;
      } catch (error) {
        console.log('Error en traducción:', error);
        return text; // Devolver el texto original si hay un error
      }
    });

    // Ejecutar todas las traducciones en paralelo
    const translatedTexts = await Promise.all(translationPromises);
    
    console.log('Textos traducidos:', translatedTexts);

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
    console.error('Error de traducción:', error);
    return texts; // Devolver textos originales si falla la traducción
  }
}
