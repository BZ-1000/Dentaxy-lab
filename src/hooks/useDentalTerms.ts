
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DentalTerm {
  id: string;
  termino: string;
  definicion: string;
  categoria: string;
  subcategoria?: string;
  sinonimos?: string[];
  contexto_uso?: string;
  seccion_formulario: string;
}

export const useDentalTerms = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<DentalTerm[]>([]);

  const searchTerms = async (searchTerm: string): Promise<DentalTerm[]> => {
    if (!searchTerm.trim()) {
      return [];
    }

    setIsSearching(true);
    try {
      // Buscar términos que coincidan exactamente o contengan el término de búsqueda
      const { data: exactMatches, error: exactError } = await supabase
        .from('dental_terms')
        .select('*')
        .ilike('termino', `%${searchTerm.toLowerCase()}%`)
        .limit(3);

      if (exactError) {
        console.error('Error searching exact matches:', exactError);
      }

      // Buscar también en sinónimos
      const { data: synonymMatches, error: synonymError } = await supabase
        .from('dental_terms')
        .select('*')
        .contains('sinonimos', [searchTerm.toLowerCase()])
        .limit(2);

      if (synonymError) {
        console.error('Error searching synonyms:', synonymError);
      }

      // Buscar por texto completo en definiciones
      const { data: textMatches, error: textError } = await supabase
        .from('dental_terms')
        .select('*')
        .textSearch('definicion', searchTerm, { type: 'websearch', config: 'spanish' })
        .limit(2);

      if (textError) {
        console.error('Error in text search:', textError);
      }

      // Combinar resultados y eliminar duplicados
      const allMatches = [...(exactMatches || []), ...(synonymMatches || []), ...(textMatches || [])]
        .filter((term, index, self) => self.findIndex(t => t.id === term.id) === index)
        .slice(0, 5); // Máximo 5 resultados

      setSearchResults(allMatches);
      return allMatches;
    } catch (error) {
      console.error('Error searching dental terms:', error);
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  const getTermsBySection = async (section: string): Promise<DentalTerm[]> => {
    try {
      const { data, error } = await supabase
        .from('dental_terms')
        .select('*')
        .eq('seccion_formulario', section)
        .order('termino');

      if (error) {
        console.error('Error fetching terms by section:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getTermsBySection:', error);
      return [];
    }
  };

  const getTermsByCategory = async (category: string): Promise<DentalTerm[]> => {
    try {
      const { data, error } = await supabase
        .from('dental_terms')
        .select('*')
        .eq('categoria', category)
        .order('termino');

      if (error) {
        console.error('Error fetching terms by category:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getTermsByCategory:', error);
      return [];
    }
  };

  return {
    isSearching,
    searchResults,
    searchTerms,
    getTermsBySection,
    getTermsByCategory
  };
};
