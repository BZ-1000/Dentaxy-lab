
interface TranslateResponse {
  translatedText: string;
  error?: string;
}

export async function translateText(texts: string | string[]): Promise<string | string[]> {
  // Simplemente devolvemos el texto original sin manipulación
  // Esto permite que Google Translate funcione naturalmente
  return texts;
}
