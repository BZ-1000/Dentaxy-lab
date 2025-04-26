import { useState } from 'react';
import { X, Search, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

type WikiResult = {
  id: string;
  title: string;
  snippet: string;
  url: string;
  fullText?: string;
};

export function WikiSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<WikiResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Load saved data from localStorage
  useState(() => {
    const savedRecent = localStorage.getItem('wiki-recent-searches');
    
    if (savedRecent) {
      try {
        setRecentSearches(JSON.parse(savedRecent));
      } catch (e) {
        console.error('Error parsing saved recent searches:', e);
      }
    }
    
    // Set up online/offline detection
    const handleOnlineStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  });

  // Save to localStorage when recent searches change
  useState(() => {
    localStorage.setItem('wiki-recent-searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const searchWikipedia = async (term: string) => {
    if (!term || term.length < 3) return;
    if (isOffline) {
      toast.error('Sin conexión. No se puede realizar la búsqueda.');
      return;
    }
    
    try {
      setIsLoading(true);
      // Use the MediaWiki API to search Wikipedia
      const response = await fetch(`https://es.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(term)}&utf8=1&srlimit=10`);
      const data = await response.json();
      
      if (data.query && data.query.search) {
        const formattedResults: WikiResult[] = data.query.search.map((item: any) => ({
          id: item.pageid.toString(),
          title: item.title,
          snippet: item.snippet.replace(/<\/?span[^>]*>/g, ''),
          url: `https://es.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`,
        }));

        setResults(formattedResults);
        
        // Add to recent searches
        setRecentSearches(prev => {
          const exists = prev.includes(term);
          if (!exists) {
            return [term, ...prev].slice(0, 5);
          }
          return prev;
        });
      } else {
        setResults([]);
        toast.info('No se encontraron resultados. Intente con otro término.');
      }
    } catch (error) {
      console.error('Error searching Wikipedia:', error);
      toast.error('Error al buscar en Wikipedia. Por favor intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecentSearch = (term: string) => {
    setSearchTerm(term);
    searchWikipedia(term);
  };

  const fetchArticleContent = async (pageId: string) => {
    try {
      const response = await fetch(`https://es.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&pageids=${pageId}&exintro=1&explaintext=1`);
      const data = await response.json();
      
      if (data.query && data.query.pages && data.query.pages[pageId]) {
        const article = data.query.pages[pageId];
        
        // Update the result with the full text
        setResults(prev => prev.map(result => {
          if (result.id === pageId) {
            return { ...result, fullText: article.extract };
          }
          return result;
        }));
      }
    } catch (error) {
      console.error('Error fetching article content:', error);
    }
  };

  // This function handles the text expansion without using window.expandText
  const handleExpandText = (event: React.MouseEvent<HTMLButtonElement>) => {
    const textElement = event.currentTarget.previousElementSibling as HTMLElement;
    if (textElement) {
      if (textElement.classList.contains('line-clamp-3')) {
        textElement.classList.remove('line-clamp-3');
        event.currentTarget.textContent = 'Ver menos';
      } else {
        textElement.classList.add('line-clamp-3');
        event.currentTarget.textContent = 'Ver más';
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95%] h-[85vh] p-0 overflow-hidden flex flex-col bg-white dark:bg-neutral-900 rounded-xl">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl flex items-center gap-2">
              <Search className="h-6 w-6 text-blue-500" />
              Búsqueda en Wikipedia Dental
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="search" className="flex-1 overflow-hidden flex flex-col">
          <div className="px-6 pb-2">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="search" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
                Búsqueda
              </TabsTrigger>
              <TabsTrigger value="recent" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
                Búsquedas Recientes
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="search" className="flex-1 overflow-hidden flex flex-col p-6 pt-0">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar en Wikipedia..." 
                    className="pl-10"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        searchWikipedia(searchTerm);
                      }
                    }}
                  />
                </div>
                <Button 
                  onClick={() => searchWikipedia(searchTerm)} 
                  disabled={searchTerm.length < 3 || isLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {isLoading ? "Buscando..." : "Buscar"}
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant="outline" 
                  className="cursor-pointer"
                  onClick={() => {
                    setSearchTerm('Caries dental');
                    searchWikipedia('Caries dental');
                  }}
                >
                  Caries dental
                </Badge>
                <Badge 
                  variant="outline" 
                  className="cursor-pointer"
                  onClick={() => {
                    setSearchTerm('Periodontitis');
                    searchWikipedia('Periodontitis');
                  }}
                >
                  Periodontitis
                </Badge>
                <Badge 
                  variant="outline" 
                  className="cursor-pointer"
                  onClick={() => {
                    setSearchTerm('Endodoncia');
                    searchWikipedia('Endodoncia');
                  }}
                >
                  Endodoncia
                </Badge>
                <Badge 
                  variant="outline" 
                  className="cursor-pointer"
                  onClick={() => {
                    setSearchTerm('Ortodoncia');
                    searchWikipedia('Ortodoncia');
                  }}
                >
                  Ortodoncia
                </Badge>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-2">
              {searchTerm.length < 3 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Escriba al menos 3 caracteres para buscar</p>
                </div>
              ) : results.length > 0 ? (
                <div>
                  <Accordion 
                    type="single" 
                    collapsible 
                    className="w-full"
                    value={expandedItem || undefined}
                    onValueChange={(value) => {
                      setExpandedItem(value);
                      if (value) {
                        fetchArticleContent(value);
                      }
                    }}
                  >
                    {results.map((result) => (
                      <AccordionItem key={result.id} value={result.id}>
                        <AccordionTrigger className="hover:bg-gray-50 p-2 rounded-md">
                          <div className="text-left">
                            <h3 className="font-medium">{result.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-1" 
                               dangerouslySetInnerHTML={{ __html: result.snippet }}
                            />
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4">
                          {result.fullText ? (
                            <div className="space-y-4">
                              <div>
                                <p className="line-clamp-3 text-sm">{result.fullText}</p>
                                <button 
                                  className="text-blue-500 text-sm mt-2"
                                  onClick={handleExpandText}
                                >
                                  Ver más
                                </button>
                              </div>
                              <div>
                                <a 
                                  href={result.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-blue-500"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  Ver artículo completo en Wikipedia
                                </a>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center p-4">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {isLoading ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <p>Buscando en Wikipedia...</p>
                    </div>
                  ) : (
                    <p>No se encontraron resultados</p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="recent" className="flex-1 overflow-hidden p-6 pt-0">
            <div className="space-y-4">
              <h3 className="font-medium mb-2">Búsquedas recientes</h3>
              {recentSearches.length > 0 ? (
                <div className="space-y-2">
                  {recentSearches.map((term, index) => (
                    <div 
                      key={index} 
                      className="p-3 border rounded-md flex justify-between items-center cursor-pointer hover:bg-gray-50"
                      onClick={() => handleRecentSearch(term)}
                    >
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-gray-400" />
                        <span>{term}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRecentSearches(prev => prev.filter((_, i) => i !== index));
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No hay búsquedas recientes
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
