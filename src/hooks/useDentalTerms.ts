
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
      // Enhanced search with better prioritization
      const cleanTerm = searchTerm.toLowerCase().trim();
      
      // First: Exact term matches (highest priority)
      const { data: exactMatches, error: exactError } = await supabase
        .from('dental_terms')
        .select('*')
        .ilike('termino', cleanTerm)
        .limit(3);

      if (exactError) {
        console.error('Error searching exact matches:', exactError);
      }

      // Second: Terms that start with the search term
      const { data: startsWithMatches, error: startsError } = await supabase
        .from('dental_terms')
        .select('*')
        .ilike('termino', `${cleanTerm}%`)
        .not('termino', 'ilike', cleanTerm) // Exclude exact matches already found
        .limit(4);

      if (startsError) {
        console.error('Error searching starts with matches:', startsError);
      }

      // Third: Terms containing the search term
      const { data: containsMatches, error: containsError } = await supabase
        .from('dental_terms')
        .select('*')
        .ilike('termino', `%${cleanTerm}%`)
        .not('termino', 'ilike', cleanTerm)
        .not('termino', 'ilike', `${cleanTerm}%`)
        .limit(3);

      if (containsError) {
        console.error('Error searching contains matches:', containsError);
      }

      // Fourth: Synonym matches
      const { data: synonymMatches, error: synonymError } = await supabase
        .from('dental_terms')
        .select('*')
        .contains('sinonimos', [cleanTerm])
        .limit(3);

      if (synonymError) {
        console.error('Error searching synonyms:', synonymError);
      }

      // Fifth: Definition matches (lower priority)
      const { data: definitionMatches, error: defError } = await supabase
        .from('dental_terms')
        .select('*')
        .ilike('definicion', `%${cleanTerm}%`)
        .limit(2);

      if (defError) {
        console.error('Error in definition search:', defError);
      }

      // Combine results with prioritization and remove duplicates
      const allMatches = [
        ...(exactMatches || []),
        ...(startsWithMatches || []),
        ...(containsMatches || []),
        ...(synonymMatches || []),
        ...(definitionMatches || [])
      ]
        .filter((term, index, self) => 
          self.findIndex(t => t.id === term.id) === index
        )
        .slice(0, 10); // Increased limit to 10 results

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
      // Check cache first
      if (sectionTerms[section]) {
        return sectionTerms[section];
      }

      const { data, error } = await supabase
        .from('dental_terms')
        .select('*')
        .eq('seccion_formulario', section)
        .order('categoria, subcategoria, termino');

      if (error) {
        console.error('Error fetching terms by section:', error);
        return [];
      }

      const terms = data || [];
      
      // Update cache
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
        .order('subcategoria, termino');

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

  const getRandomTerms = async (limit: number = 8): Promise<DentalTerm[]> => {
    try {
      // Get more varied random terms from different categories
      const { data, error } = await supabase
        .from('dental_terms')
        .select('*')
        .limit(limit * 4); // Get more terms for better randomization

      if (error) {
        console.error('Error fetching random terms:', error);
        return [];
      }

      // Improved randomization with category diversity
      const categorizedTerms = (data || []).reduce((acc, term) => {
        if (!acc[term.categoria]) {
          acc[term.categoria] = [];
        }
        acc[term.categoria].push(term);
        return acc;
      }, {} as Record<string, DentalTerm[]>);

      // Select random terms from different categories
      const randomTerms: DentalTerm[] = [];
      const categories = Object.keys(categorizedTerms);
      
      for (let i = 0; i < limit && categories.length > 0; i++) {
        const randomCategoryIndex = Math.floor(Math.random() * categories.length);
        const category = categories[randomCategoryIndex];
        const categoryTerms = categorizedTerms[category];
        
        if (categoryTerms.length > 0) {
          const randomTermIndex = Math.floor(Math.random() * categoryTerms.length);
          randomTerms.push(categoryTerms[randomTermIndex]);
          categoryTerms.splice(randomTermIndex, 1);
          
          // Remove category if empty
          if (categoryTerms.length === 0) {
            categories.splice(randomCategoryIndex, 1);
          }
        }
      }

      return randomTerms;
    } catch (error) {
      console.error('Error in getRandomTerms:', error);
      return [];
    }
  };

  const getSectionStats = async () => {
    try {
      const { data, error } = await supabase
        .from('dental_terms')
        .select('seccion_formulario, categoria')
        .not('seccion_formulario', 'is', null);

      if (error) {
        console.error('Error fetching section stats:', error);
        return {};
      }

      // Enhanced stats with category breakdown
      const stats = (data || []).reduce((acc, term) => {
        const section = term.seccion_formulario;
        if (!acc[section]) {
          acc[section] = {
            total: 0,
            categories: {}
          };
        }
        acc[section].total++;
        
        const category = term.categoria;
        if (!acc[section].categories[category]) {
          acc[section].categories[category] = 0;
        }
        acc[section].categories[category]++;
        
        return acc;
      }, {} as Record<string, any>);

      return stats;
    } catch (error) {
      console.error('Error in getSectionStats:', error);
      return {};
    }
  };

  // New method to get terms by multiple criteria
  const getAdvancedTerms = async (criteria: {
    section?: string;
    category?: string;
    subcategory?: string;
    searchTerm?: string;
  }): Promise<DentalTerm[]> => {
    try {
      let query = supabase.from('dental_terms').select('*');

      if (criteria.section) {
        query = query.eq('seccion_formulario', criteria.section);
      }
      if (criteria.category) {
        query = query.eq('categoria', criteria.category);
      }
      if (criteria.subcategory) {
        query = query.eq('subcategoria', criteria.subcategory);
      }
      if (criteria.searchTerm) {
        query = query.ilike('termino', `%${criteria.searchTerm}%`);
      }

      const { data, error } = await query
        .order('categoria, subcategoria, termino')
        .limit(20);

      if (error) {
        console.error('Error in advanced search:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAdvancedTerms:', error);
      return [];
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
    getAdvancedTerms,
    clearCache
  };
};
