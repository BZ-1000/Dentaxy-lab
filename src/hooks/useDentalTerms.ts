
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
  const [sectionTerms, setSectionTerms] = useState<Record<string, DentalTerm[]>>({});

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
        .limit(5);

      if (exactError) {
        console.error('Error searching exact matches:', exactError);
      }

      // Buscar también en sinónimos
      const { data: synonymMatches, error: synonymError } = await supabase
        .from('dental_terms')
        .select('*')
        .contains('sinonimos', [searchTerm.toLowerCase()])
        .limit(3);

      if (synonymError) {
        console.error('Error searching synonyms:', synonymError);
      }

      // Buscar por texto completo en definiciones
      const { data: definitionMatches, error: defError } = await supabase
        .from('dental_terms')
        .select('*')
        .ilike('definicion', `%${searchTerm.toLowerCase()}%`)
        .limit(3);

      if (defError) {
        console.error('Error in definition search:', defError);
      }

      // Combinar resultados y eliminar duplicados
      const allMatches = [...(exactMatches || []), ...(synonymMatches || []), ...(definitionMatches || [])]
        .filter((term, index, self) => self.findIndex(t => t.id === term.id) === index)
        .slice(0, 8); // Máximo 8 resultados

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
      // Verificar si ya tenemos los términos en cache
      if (sectionTerms[section]) {
        return sectionTerms[section];
      }

      const { data, error } = await supabase
        .from('dental_terms')
        .select('*')
        .eq('seccion_formulario', section)
        .order('termino');

      if (error) {
        console.error('Error fetching terms by section:', error);
        return [];
      }

      const terms = data || [];
      
      // Actualizar cache
      setSectionTerms(prev => ({
        ...prev,
        [section]: terms
      }));

      return terms;
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

  const getTermsBySubcategory = async (subcategory: string): Promise<DentalTerm[]> => {
    try {
      const { data, error } = await supabase
        .from('dental_terms')
        .select('*')
        .eq('subcategoria', subcategory)
        .order('termino');

      if (error) {
        console.error('Error fetching terms by subcategory:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getTermsBySubcategory:', error);
      return [];
    }
  };

  const getRandomTerms = async (limit: number = 5): Promise<DentalTerm[]> => {
    try {
      const { data, error } = await supabase
        .from('dental_terms')
        .select('*')
        .limit(limit * 3); // Obtener más términos para seleccionar aleatoriamente

      if (error) {
        console.error('Error fetching random terms:', error);
        return [];
      }

      // Seleccionar términos aleatorios
      const shuffled = (data || []).sort(() => 0.5 - Math.random());
      return shuffled.slice(0, limit);
    } catch (error) {
      console.error('Error in getRandomTerms:', error);
      return [];
    }
  };

  const getSectionStats = async () => {
    try {
      const { data, error } = await supabase
        .from('dental_terms')
        .select('seccion_formulario')
        .not('seccion_formulario', 'is', null);

      if (error) {
        console.error('Error fetching section stats:', error);
        return {};
      }

      // Contar términos por sección
      const stats = (data || []).reduce((acc, term) => {
        acc[term.seccion_formulario] = (acc[term.seccion_formulario] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return stats;
    } catch (error) {
      console.error('Error in getSectionStats:', error);
      return {};
    }
  };

  const clearCache = () => {
    setSectionTerms({});
  };

  return {
    isSearching,
    searchResults,
    searchTerms,
    getTermsBySection,
    getTermsByCategory,
    getTermsBySubcategory,
    getRandomTerms,
    getSectionStats,
    clearCache
  };
};
