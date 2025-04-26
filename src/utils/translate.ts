
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

  // Verificar si el navegador tiene la funcionalidad de traducción de Google
  if (typeof window !== 'undefined' && window.chrome && window.chrome.i18n) {
    const userConfirmed = await new Promise<boolean>((resolve) => {
      if (confirm('¿Desea traducir el texto usando Google Translate del navegador?')) {
        resolve(true);
      } else {
        resolve(false);
      }
    });

    if (userConfirmed) {
      try {
        // Crear un elemento temporal para la traducción
        const tempElement = document.createElement('div');
        tempElement.style.display = 'none';
        document.body.appendChild(tempElement);

        // Procesar cada texto
        const translatedTexts = validTexts.map(text => {
          tempElement.textContent = text;
          // Trigger la traducción del navegador
          tempElement.setAttribute('translate', 'yes');
          // Esperar un momento para que la traducción ocurra
          return new Promise<string>(resolve => {
            setTimeout(() => {
              const translatedText = tempElement.textContent || text;
              resolve(translatedText);
            }, 100);
          });
        });

        const results = await Promise.all(translatedTexts);
        document.body.removeChild(tempElement);

        // Reemplazar solo los textos válidos en el array original
        let currentIndex = 0;
        const finalTexts = textsArray.map(text => {
          if (text && text !== 'N/A' && text.trim() !== '') {
            const translatedText = results[currentIndex];
            currentIndex++;
            return translatedText;
          }
          return text;
        });

        console.log('Textos traducidos:', finalTexts);
        return Array.isArray(texts) ? finalTexts : finalTexts[0];
      } catch (error) {
        console.error('Error al traducir con Google Translate:', error);
        return texts;
      }
    }
  }

  // Si el usuario no confirma o no está disponible Google Translate, devolver textos originales
  console.log('Traducción cancelada o no disponible, usando textos originales');
  return texts;
}
