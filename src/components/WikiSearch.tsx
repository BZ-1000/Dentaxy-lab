import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { toast } from "sonner";

interface WikiResult {
  pageid: number;
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
}

export function WikiSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<WikiResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setSearchTerm('');
      setResults([]);
    }
  }, [open]);

  const searchWikipedia = async () => {
    if (!searchTerm) {
      toast.error('Por favor, introduce un término de búsqueda.');
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts|pageimages&formatversion=2&exsentences=3&exlimit=10&piprop=thumbnail&pilimit=10&pithumbsize=200&titles=${searchTerm}`;
      const response = await fetch(endpoint);
      const data = await response.json();

      if (data.query?.pages) {
        setResults(Object.values(data.query.pages) as WikiResult[]);
      } else {
        setResults([]);
        toast.info('No se encontraron resultados.');
      }
    } catch (error) {
      console.error('Error searching Wikipedia:', error);
      toast.error('Error al buscar en Wikipedia. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95%] h-[75vh] p-6 overflow-hidden flex flex-col bg-white dark:bg-neutral-900 rounded-xl">
        <DialogHeader className="pb-4">
          <DialogTitle>Búsqueda en Wikipedia</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar en Wikipedia..."
              className="pl-10"
            />
          </div>
          <Button onClick={searchWikipedia} disabled={isLoading}>
            {isLoading ? "Buscando..." : "Buscar"}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {results.length > 0 ? (
            results.map((result) => (
              <div key={result.pageid} className="mb-4 p-4 border rounded-md">
                <h3 className="text-lg font-semibold mb-2">{result.title}</h3>
                {result.thumbnail && (
                  <img
                    src={result.thumbnail.source}
                    alt={result.title}
                    className="float-right ml-4 w-32 rounded"
                  />
                )}
                <p className="text-sm" dangerouslySetInnerHTML={{ __html: result.extract }} />
                <a
                  href={`https://en.wikipedia.org/?curid=${result.pageid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline block mt-2"
                >
                  Leer más en Wikipedia
                </a>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <p>Buscando en Wikipedia...</p>
                </div>
              ) : (
                <p>No se encontraron resultados.</p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
