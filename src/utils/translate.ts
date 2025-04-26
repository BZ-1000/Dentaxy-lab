
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

  // Simplemente devolvemos los textos originales sin manipulación
  // Esta versión simplificada es compatible con Google Translate
  console.log('Usando textos originales para compatibilidad con Google Translate');
  return texts;
}
