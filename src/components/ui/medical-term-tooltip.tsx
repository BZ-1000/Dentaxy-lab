
import React, { useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useDentalTerms } from '@/hooks/useDentalTerms';
import { HelpCircle, BookOpen } from 'lucide-react';

interface MedicalTermTooltipProps {
  term: string;
  section?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}

export const MedicalTermTooltip: React.FC<MedicalTermTooltipProps> = ({
  term,
  section,
  children,
  showIcon = true
}) => {
  const [definition, setDefinition] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { searchTerms } = useDentalTerms();

  useEffect(() => {
    const fetchDefinition = async () => {
      if (!term) return;
      
      setIsLoading(true);
      try {
        const results = await searchTerms(term);
        if (results.length > 0) {
          // Priorizar términos de la misma sección si está disponible
          const sectionMatch = section 
            ? results.find(r => r.seccion_formulario === section)
            : null;
          
          setDefinition(sectionMatch || results[0]);
        }
      } catch (error) {
        console.error('Error fetching term definition:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDefinition();
  }, [term, section, searchTerms]);

  if (!definition && !isLoading) {
    return children || <span>{term}</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-1 cursor-help border-b border-dotted border-blue-400 hover:border-blue-600 text-blue-600 hover:text-blue-800 transition-colors">
            {children || term}
            {showIcon && <HelpCircle className="w-3 h-3" />}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm p-4 bg-white dark:bg-gray-800 border shadow-lg">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Cargando definición...</span>
            </div>
          ) : definition ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  {definition.termino}
                </h4>
              </div>
              
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {definition.definicion}
              </p>
              
              {definition.contexto_uso && (
                <p className="text-xs text-blue-600 dark:text-blue-400 italic">
                  {definition.contexto_uso}
                </p>
              )}
              
              <div className="flex flex-wrap gap-1 pt-2">
                {definition.categoria && (
                  <Badge variant="secondary" className="text-xs">
                    {definition.categoria}
                  </Badge>
                )}
                {definition.subcategoria && (
                  <Badge variant="outline" className="text-xs">
                    {definition.subcategoria}
                  </Badge>
                )}
              </div>
              
              {definition.sinonimos && definition.sinonimos.length > 0 && (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    También conocido como: {definition.sinonimos.join(', ')}
                  </span>
                </div>
              )}
            </div>
          ) : null}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
