
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Search } from "lucide-react";

interface WikiSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WikiSearch({ open, onOpenChange }: WikiSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const searchWikipedia = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://es.wikipedia.org/w/api.php?` +
        new URLSearchParams({
          action: "query",
          format: "json",
          prop: "extracts",
          exintro: "true",
          explaintext: "true",
          generator: "search",
          gsrlimit: "1",
          gsrsearch: searchTerm,
          origin: "*"
        })
      );

      const data = await response.json();
      
      if (data.query && data.query.pages) {
        const page = Object.values(data.query.pages)[0] as any;
        setSearchResults(page.extract || "No se encontraron resultados.");
      } else {
        setSearchResults("No se encontraron resultados.");
      }
    } catch (error) {
      setSearchResults("Error al buscar. Por favor, intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchWikipedia();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Búsqueda de Información</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-2 my-4">
          <Input
            placeholder="¿Qué deseas buscar?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={searchWikipedia}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              {searchResults ? (
                <p className="text-sm leading-relaxed">{searchResults}</p>
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
