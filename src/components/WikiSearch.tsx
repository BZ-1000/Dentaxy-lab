
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Search, X } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

interface WikiSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SearchCategory = "all" | "diseases" | "procedures" | "materials" | "anatomy" | "diagnostics" | "prevention";

const categoryOptions = {
  diseases: [
    "Caries dental",
    "Gingivitis",
    "Periodontitis",
    "Pulpitis",
    "Absceso dental",
    "Fluorosis dental",
    "Bruxismo",
    "Halitosis",
    "Maloclusión"
  ],
  procedures: [
    "Endodoncia",
    "Extracción dental",
    "Implantes dentales",
    "Ortodoncia",
    "Blanqueamiento dental",
    "Profilaxis dental",
    "Restauración dental",
    "Selladores dentales"
  ],
  materials: [
    "Amalgama dental",
    "Resina compuesta",
    "Ionómero de vidrio",
    "Porcelana dental",
    "Zirconia",
    "Gutapercha",
    "Alginato"
  ],
  anatomy: [
    "Esmalte dental",
    "Dentina",
    "Pulpa dental",
    "Ligamento periodontal",
    "Encía"
  ],
  diagnostics: [
    "Radiografía dental",
    "Tomografía dental",
    "Diagnóstico pulpar",
    "Sondaje periodontal"
  ],
  prevention: [
    "Higiene oral",
    "Flúor tópico",
    "Control de placa",
    "Selladores"
  ]
};

export function WikiSearch({ open, onOpenChange }: WikiSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>("all");
  const [expandedText, setExpandedText] = useState(false);
  const [highlightedText, setHighlightedText] = useState<string>("");
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
  const [isAccordionCustomExpanded, setIsAccordionCustomExpanded] = useState(false);
  const [isAccordionGeneratingExpanded, setIsAccordionGeneratingExpanded] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useDebouncedCallback(
    (term: string) => {
      if (term.trim()) {
        searchWikipedia(term);
      }
    },
    500
  );

  useEffect(() => {
    if (searchTerm.trim()) {
      debouncedSearch(searchTerm);
      // Always fetch suggestions when typing, regardless of category
      fetchSuggestions(searchTerm);
    } else {
      setSearchResults("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, debouncedSearch]);

  const fetchSuggestions = async (term: string) => {
    if (term.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `https://es.wikipedia.org/w/api.php?` +
        new URLSearchParams({
          action: "opensearch",
          format: "json",
          search: term,
          limit: "5",
          namespace: "0",
          origin: "*"
        })
      );

      const data = await response.json();
      if (data && data[1]) {
        setSuggestions(data[1]);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    searchWikipedia(suggestion);
  };

  const highlightSearchTerm = (text: string, term: string) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
  };

  const searchWikipedia = async (term: string = searchTerm) => {
    if (!term.trim()) return;
    
    setIsLoading(true);

    try {
      let gsrsearch = term;
      if (selectedCategory !== "all") {
        gsrsearch = `${term} ${selectedCategory}`;
      }
      
      const response = await fetch(
        `https://es.wikipedia.org/w/api.php?` +
        new URLSearchParams({
          action: "query",
          format: "json",
          prop: "extracts",
          exintro: "true",
          explaintext: "false",
          generator: "search",
          gsrlimit: "1",
          gsrsearch: gsrsearch,
          gsrnamespace: "0",
          origin: "*"
        })
      );

      const data = await response.json();
      
      if (data.query && data.query.pages) {
        const pages = Object.values(data.query.pages) as any[];
        
        if (pages.length > 0) {
          const extract = pages[0].extract || "No se encontraron resultados.";
          const highlighted = highlightSearchTerm(extract, term);
          
          // Format the text with enhanced styling
          const formattedExtract = `
            <div class="prose-lg">
              <div class="bg-gray-50 dark:bg-neutral-900 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-neutral-800">
                <h2 class="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">${pages[0].title}</h2>
                <div class="space-y-4">
                  <div class="text-justify leading-relaxed ${expandedText ? '' : 'line-clamp-4'}">
                    ${highlighted}
                  </div>
                  ${!expandedText ? `
                    <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button 
                        class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        onclick="window.expandText()"
                      >
                        Leer más...
                      </button>
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
          `;
          setHighlightedText(highlighted);
          setSearchResults(formattedExtract);
        } else {
          setSearchResults("No se encontraron resultados.");
        }
      } else {
        setSearchResults("No se encontraron resultados.");
      }
    } catch (error) {
      setSearchResults("Error al buscar. Por favor, intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add window function for expanding text
  useEffect(() => {
    // Define the expandText function on the window object
    window.expandText = () => {
      setExpandedText(true);
    };
    return () => {
      // Clean up by removing the function from window when component unmounts
      delete window.expandText;
    };
  }, []);

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults("");
    setShowSuggestions(false);
    setSuggestions([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSelectPresetTerm = (term: string) => {
    setSearchTerm(term);
    searchWikipedia(term);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchWikipedia();
    }
  };

  const handleSelectCategory = (category: SearchCategory) => {
    setSelectedCategory(category);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleResultClick = () => {
    setShowSuggestions(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Búsqueda de Información
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <div className="flex gap-2 my-4">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                placeholder="¿Qué deseas buscar?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button 
              onClick={() => searchWikipedia()}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Suggestions dropdown - Show when there are suggestions and showSuggestions is true */}
          {suggestions.length > 0 && showSuggestions && (
            <div className="absolute z-10 w-[calc(100%-5rem)] bg-white dark:bg-neutral-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 mt-1">
              <ul>
                {suggestions.map((suggestion, index) => (
                  <li 
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer flex items-center"
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    <Search className="h-3 w-3 mr-2 text-gray-400" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {!searchTerm && (
          <div className="bg-gray-50 dark:bg-neutral-900 p-3 rounded-md mb-2 border border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-medium mb-2">Filtros de búsqueda</h3>
            <div className="flex flex-wrap gap-2">
              {(["all", "diseases", "procedures", "materials", "anatomy", "diagnostics", "prevention"] as SearchCategory[]).map(category => (
                <Button
                  key={category}
                  size="sm"
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => handleSelectCategory(category)}
                  className="text-xs"
                >
                  {category === "all" ? "Todos" : 
                   category === "diseases" ? "Enfermedades" : 
                   category === "procedures" ? "Procedimientos" : 
                   category === "materials" ? "Materiales" :
                   category === "anatomy" ? "Anatomía" :
                   category === "diagnostics" ? "Diagnósticos" :
                   "Prevención"}
                </Button>
              ))}
            </div>

            {/* Preset terms based on selected category */}
            {selectedCategory !== "all" && categoryOptions[selectedCategory as keyof typeof categoryOptions] && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Términos comunes:</h4>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions[selectedCategory as keyof typeof categoryOptions].map((term, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      onClick={() => handleSelectPresetTerm(term)}
                      className="text-xs bg-white dark:bg-neutral-800 hover:bg-blue-50 dark:hover:bg-neutral-700"
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <ScrollArea 
          className="flex-1 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900"
          onClick={handleResultClick}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              {searchResults ? (
                <div 
                  className="text-sm leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: searchResults }}
                />
              ) : (
                <p className="text-center text-neutral-500">
                  Ingresa un término para comenzar la búsqueda
                </p>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
