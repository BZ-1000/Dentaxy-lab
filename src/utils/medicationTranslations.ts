
// Common medication translations
export const medicationTranslations: { [key: string]: string } = {
  'acetaminofen': 'acetaminophen',
  'ibuprofeno': 'ibuprofen',
  'amoxicilina': 'amoxicillin',
  'paracetamol': 'acetaminophen',
  'aspirina': 'aspirin',
  // Add more common translations as needed
};

// Translate medication-related text
export const translateToSpanish = (text: string): string => {
  // Common medical terms translations
  const translations: { [key: string]: string } = {
    'headache': 'dolor de cabeza',
    'backache': 'dolor de espalda',
    'toothache': 'dolor de muelas',
    'fever': 'fiebre',
    'pain': 'dolor',
    'capsule': 'cápsula',
    'oral': 'oral',
    'injection': 'inyección',
    'topical': 'tópico',
    'warnings': 'advertencias',
    'side effects': 'efectos secundarios',
    'dosage': 'dosis',
    'use': 'uso',
    'tablet': 'tableta',
    'cream': 'crema',
    'ointment': 'ungüento',
    'solution': 'solución',
    'suspension': 'suspensión',
    'drops': 'gotas',
    'spray': 'aerosol',
    'syrup': 'jarabe',
    'gel': 'gel',
    'powder': 'polvo',
    'patch': 'parche',
    'inhaler': 'inhalador',
    // Add more translations as needed
  };

  let translatedText = text.toLowerCase();
  
  // Replace English terms with Spanish translations
  Object.entries(translations).forEach(([eng, esp]) => {
    translatedText = translatedText.replace(
      new RegExp(eng, 'gi'), 
      esp
    );
  });

  return translatedText;
};

// Translate search term from Spanish to English
export const translateSearchTerm = (term: string): string => {
  const lowerTerm = term.toLowerCase();
  
  // Check if there's a direct translation
  if (medicationTranslations[lowerTerm]) {
    return medicationTranslations[lowerTerm];
  }
  
  // If no direct translation, return original term
  return term;
};

