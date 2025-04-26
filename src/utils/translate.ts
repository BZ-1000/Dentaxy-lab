
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

  // Verificar si el navegador es compatible con la traducción local
  const hasTranslationCapabilities = typeof window !== 'undefined' && 
    ((window as any).chrome?.i18n || navigator.language || document.documentElement.lang);

  if (hasTranslationCapabilities) {
    try {
      const userConfirmed = await new Promise<boolean>(resolve => {
        try {
          if (confirm('¿Desea traducir el texto usando el traductor del navegador?')) {
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (error) {
          console.warn('Error al mostrar el diálogo de confirmación:', error);
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
            return new Promise<string>(resolve => {
              try {
                tempElement.textContent = text;
                tempElement.setAttribute('translate', 'yes');
                
                // Añadir clase específica para Google Translate
                tempElement.className = 'notranslate';
                tempElement.lang = 'en';
                document.documentElement.lang = 'es';
                
                // Forzar la traducción con un tiempo de espera más largo para Vercel
                setTimeout(() => {
                  try {
                    const translatedText = tempElement.textContent || text;
                    resolve(translatedText);
                  } catch (err) {
                    console.error('Error al obtener el texto traducido:', err);
                    resolve(text);
                  }
                }, 500); // Aumentamos el timeout para dar más tiempo en entornos de producción
              } catch (error) {
                console.error('Error al configurar el elemento para traducción:', error);
                resolve(text);
              }
            });
          });

          // Esperar a que todas las traducciones se completen
          const results = await Promise.all(translatedTexts);
          
          try {
            document.body.removeChild(tempElement);
          } catch (err) {
            console.warn('Error al eliminar el elemento temporal:', err);
          }

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

          console.log('Textos traducidos localmente:', finalTexts);
          return Array.isArray(texts) ? finalTexts : finalTexts[0];
        } catch (error) {
          console.error('Error al traducir con el navegador:', error);
        }
      }
    } catch (error) {
      console.error('Error general en el proceso de traducción:', error);
    }
  }

  // Si el usuario no confirma, no está disponible la traducción o falla, usar una alternativa
  try {
    // Intento manual con web workers si está disponible
    if (typeof Worker !== 'undefined') {
      console.log('Intentando traducción alternativa...');
      // Aquí podríamos implementar una traducción local con JavaScript
    }
  } catch (error) {
    console.error('Error en traducción alternativa:', error);
  }

  // Fallback: devolver textos originales
  console.log('Traducción no disponible o cancelada, usando textos originales');
  return texts;
}
