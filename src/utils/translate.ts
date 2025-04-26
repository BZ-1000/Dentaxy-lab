
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

  // Simplemente devolvemos el texto original
  // Esta función ahora solo actúa como un pasante, para que el usuario utilice Google Translate del navegador
  console.log('Traducción delegada al navegador');
  return texts;
}
