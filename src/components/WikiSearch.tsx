
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Search, X, Filter, ArrowDown } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

interface WikiSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SearchCategory = "all" | "diseases" | "procedures" | "materials";

interface SearchFilters {
  category: SearchCategory;
  precision: "normal" | "high";
}

export function WikiSearch({ open, onOpenChange }: WikiSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category: "all",
    precision: "normal"
  });
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Define debounced search function
  const debouncedSearch = useDebouncedCallback(
    (term: string) => {
      if (term.trim()) {
        searchWikipedia(term);
      }
    },
    500 // 500ms delay
  );

  useEffect(() => {
    if (searchTerm.trim()) {
      debouncedSearch(searchTerm);
      fetchSuggestions(searchTerm);
    } else {
      setSearchResults("");
      setSuggestions([]);
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

  const searchWikipedia = async (term: string = searchTerm) => {
    if (!term.trim()) return;
    
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      // Modify the search parameters based on filters
      let gsrlimit = filters.precision === "high" ? "3" : "1";
      let gsrnamespace = "0";
      
      // Apply category filter if needed
      let gsrsearch = term;
      if (filters.category !== "all") {
        gsrsearch = `${term} ${filters.category}`;
      }
      
      const response = await fetch(
        `https://es.wikipedia.org/w/api.php?` +
        new URLSearchParams({
          action: "query",
          format: "json",
          prop: "extracts",
          exintro: "true",
          explaintext: "true",
          generator: "search",
          gsrlimit: gsrlimit,
          gsrsearch: gsrsearch,
          gsrnamespace: gsrnamespace,
          origin: "*"
        })
      );

      const data = await response.json();
      
      if (data.query && data.query.pages) {
        const pages = Object.values(data.query.pages) as any[];
        
        if (pages.length > 0) {
          // For "high precision" mode, combine multiple results
          if (filters.precision === "high" && pages.length > 1) {
            const combinedResults = pages
              .sort((a, b) => a.index - b.index)
              .map(page => `<strong>${page.title}</strong>: ${page.extract}`)
              .join("\n\n");
            
            setSearchResults(combinedResults);
          } else {
            // Normal mode - just show first result
            setSearchResults(pages[0].extract || "No se encontraron resultados.");
          }
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

  const handleSelectSuggestion = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    searchWikipedia(suggestion);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults("");
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchWikipedia();
    }
  };

  const renderCategoryButtons = () => (
    <div className="flex flex-wrap gap-2 mb-3">
      {(["all", "diseases", "procedures", "materials"] as SearchCategory[]).map(category => (
        <Button
          key={category}
          size="sm"
          variant={filters.category === category ? "default" : "outline"}
          onClick={() => setFilters({...filters, category})}
          className="text-xs"
        >
          {category === "all" ? "Todos" : 
           category === "diseases" ? "Enfermedades" : 
           category === "procedures" ? "Procedimientos" : 
           "Materiales"}
        </Button>
      ))}
    </div>
  );

  const renderPrecisionToggle = () => (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-sm">Precisión:</span>
      <Button
        size="sm"
        variant={filters.precision === "normal" ? "default" : "outline"}
        onClick={() => setFilters({...filters, precision: "normal"})}
        className="text-xs"
      >
        Normal
      </Button>
      <Button
        size="sm"
        variant={filters.precision === "high" ? "default" : "outline"}
        onClick={() => setFilters({...filters, precision: "high"})}
        className="text-xs"
      >
        Alta
      </Button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Búsqueda de Información</DialogTitle>
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
            <Button
              onClick={toggleFilters}
              variant="outline"
              className={showFilters ? "bg-blue-100 dark:bg-blue-900" : ""}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
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
                <li className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <ArrowDown className="h-3 w-3 mr-2" />
                  Presiona Enter para buscar
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Filter options */}
        {showFilters && (
          <div className="bg-gray-50 dark:bg-neutral-900 p-3 rounded-md mb-2 border border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-medium mb-2">Filtros avanzados</h3>
            {renderCategoryButtons()}
            {renderPrecisionToggle()}
          </div>
        )}

        <ScrollArea className="flex-1 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              {searchResults ? (
                <div 
                  className="text-sm leading-relaxed"
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
