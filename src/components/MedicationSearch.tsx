import { useState, useEffect } from 'react';
import { X, Search, Star, StarOff, Filter, Pill, Stethoscope, Syringe, Bandage } from 'lucide-react';
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

// Type definitions
type Medication = {
  id: string;
  brand_name: string;
  generic_name: string;
  route: string;
  dosage_form: string;
  active_ingredients?: { name: string; strength: string }[];
  indications_and_usage?: string;
  warnings?: string;
  drug_class?: string;
};

type FilterType = 'all' | 'antibiotics' | 'analgesics' | 'anesthetics' | 'antiinflammatories';
type RouteType = 'all' | 'oral' | 'topical' | 'injection';
type UsageType = 'all' | 'post-surgical' | 'infections' | 'acute-pain';

export function MedicationSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Medication[]>([]);
  const [favorites, setFavorites] = useState<Medication[]>([]);
  const [recentSearches, setRecentSearches] = useState<Medication[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeRoute, setActiveRoute] = useState<RouteType>('all');
  const [activeUsage, setActiveUsage] = useState<UsageType>('all');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Load saved data from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('medication-favorites');
    const savedRecent = localStorage.getItem('medication-recent');
    
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Error parsing saved favorites:', e);
      }
    }
    
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
  }, []);

  // Save to localStorage when favorites or recent searches change
  useEffect(() => {
    localStorage.setItem('medication-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('medication-recent', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const searchMedications = async (term: string) => {
    if (!term || term.length < 3) return;
    if (isOffline) {
      toast.error('Sin conexión. Mostrando resultados guardados.');
      return;
    }
    
    try {
      setIsLoading(true);
      // Fix the OpenFDA API query to use proper syntax
      // Using exact parameter with term enclosed in quotes for better search results
      const encodedTerm = encodeURIComponent(term);
      console.log(`Searching for: ${encodedTerm}`);
      
      // Modified search query to work better with OpenFDA API
      const url = `https://api.fda.gov/drug/label.json?search=(openfda.brand_name:"${encodedTerm}"+openfda.generic_name:"${encodedTerm}")&limit=10`;
      console.log(`API URL: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API response:', data);
      
      if (data.results && data.results.length > 0) {
        const formattedResults: Medication[] = data.results.map((item: any) => {
          // Extract openfda data safely
          const openfda = item.openfda || {};
          
          return {
            id: item.id || openfda.application_number?.[0] || Math.random().toString(36),
            brand_name: openfda.brand_name?.[0] || 'N/A',
            generic_name: openfda.generic_name?.[0] || 'N/A',
            route: openfda.route?.[0] || 'N/A',
            dosage_form: openfda.dosage_form?.[0] || 'N/A',
            active_ingredients: item.active_ingredient?.map((ing: string) => {
              const parts = ing.split(' ');
              return { 
                name: parts.slice(0, -1).join(' ') || 'Unknown', 
                strength: parts[parts.length - 1] || 'N/A' 
              };
            }) || [],
            indications_and_usage: item.indications_and_usage?.[0] || 'No disponible',
            warnings: item.warnings?.[0] || 'No disponible',
            drug_class: openfda.pharm_class_epc?.[0] || 'N/A'
          };
        });

        // Apply filters
        let filteredResults = formattedResults;
        
        if (activeFilter !== 'all') {
          filteredResults = filteredResults.filter(med => {
            const className = (med.drug_class || '').toLowerCase();
            switch (activeFilter) {
              case 'antibiotics': return className.includes('antibiotic');
              case 'analgesics': return className.includes('analgesic');
              case 'anesthetics': return className.includes('anesthetic');
              case 'antiinflammatories': return className.includes('antiinflammatory');
              default: return true;
            }
          });
        }
        
        if (activeRoute !== 'all') {
          filteredResults = filteredResults.filter(med => 
            (med.route || '').toLowerCase().includes(activeRoute)
          );
        }
        
        if (activeUsage !== 'all') {
          filteredResults = filteredResults.filter(med => {
            const indications = (med.indications_and_usage || '').toLowerCase();
            switch (activeUsage) {
              case 'post-surgical': return indications.includes('surgery') || indications.includes('surgical');
              case 'infections': return indications.includes('infection');
              case 'acute-pain': return indications.includes('pain') && indications.includes('acute');
              default: return true;
            }
          });
        }
        
        console.log('Filtered results:', filteredResults);
        setResults(filteredResults);
        
        // Add to recent searches
        if (filteredResults.length > 0) {
          const firstResult = filteredResults[0];
          setRecentSearches(prev => {
            const exists = prev.some(item => item.id === firstResult.id);
            if (!exists) {
              return [firstResult, ...prev].slice(0, 5);
            }
            return prev;
          });
        }
      } else {
        console.log('No results found or invalid response format');
        setResults([]);
        toast.info('No se encontraron medicamentos con ese término');
      }
    } catch (error) {
      console.error('Error searching medications:', error);
      toast.error('Error al buscar medicamentos: ' + (error instanceof Error ? error.message : 'Error desconocido'));
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to try alternate search if first one fails
  const tryAlternateSearch = async (term: string) => {
    try {
      setIsLoading(true);
      // Use a more generic search that might yield more results
      const url = `https://api.fda.gov/drug/label.json?search=${term}&limit=10`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        // Format results same as before
        const formattedResults = data.results.map((item: any) => {
          const openfda = item.openfda || {};
          return {
            id: Math.random().toString(36),
            brand_name: openfda.brand_name?.[0] || 'N/A',
            generic_name: openfda.generic_name?.[0] || 'N/A',
            route: openfda.route?.[0] || 'N/A',
            dosage_form: openfda.dosage_form?.[0] || 'N/A',
            active_ingredients: [],
            indications_and_usage: item.indications_and_usage?.[0] || 'No disponible',
            warnings: item.warnings?.[0] || 'No disponible',
            drug_class: openfda.pharm_class_epc?.[0] || 'N/A'
          };
        });
        
        setResults(formattedResults);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Error in alternate search:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (medication: Medication) => {
    setFavorites(prev => {
      const existingIndex = prev.findIndex(item => item.id === medication.id);
      if (existingIndex >= 0) {
        return prev.filter(item => item.id !== medication.id);
      } else {
        return [...prev, medication];
      }
    });
  };

  const isFavorite = (id: string) => favorites.some(item => item.id === id);

  // Calculate dosage by weight (simplified example)
  const calculateDosage = (genericName: string, weight: number) => {
    const lowerGenericName = genericName.toLowerCase();
    
    if (lowerGenericName.includes('amoxicillin')) {
      return `${(weight * 12.5).toFixed(1)} mg cada 8 horas`;
    } else if (lowerGenericName.includes('ibuprofen')) {
      return `${(weight * 5).toFixed(1)} mg cada 6-8 horas`;
    } else if (lowerGenericName.includes('acetaminophen') || lowerGenericName.includes('paracetamol')) {
      return `${(weight * 10).toFixed(1)} mg cada 6 horas`;
    } else {
      return 'Dosificación no disponible';
    }
  };

  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full p-0 max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl flex items-center gap-2">
              <Pill className="h-6 w-6 text-emerald-500" />
              Búsqueda de Medicamentos
            </DialogTitle>
          </div>
        </DialogHeader>
        
        {isOffline && (
          <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-700 p-4 mx-6">
            <p className="text-sm">
              Sin conexión a internet. Mostrando solo medicamentos guardados en caché.
            </p>
          </div>
        )}
        
        <Tabs defaultValue="search" className="flex-1 overflow-hidden flex flex-col">
          <div className="px-6 pb-2">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="search">Búsqueda</TabsTrigger>
              <TabsTrigger value="favorites">Favoritos y Recientes</TabsTrigger>
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
                    onKeyDown={(e) => e.key === 'Enter' && searchMedications(searchTerm)}
                    placeholder="Buscar medicamentos..." 
                    className="pl-10"
                  />
                </div>
                <Button 
                  onClick={() => searchMedications(searchTerm)} 
                  disabled={searchTerm.length < 3 || isLoading}
                >
                  {isLoading ? "Buscando..." : "Buscar"}
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1 mr-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Filtros:</span>
                </div>
                
                {/* Medication Type Filters */}
                <Badge 
                  variant={activeFilter === 'all' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setActiveFilter('all')}
                >
                  Todos
                </Badge>
                <Badge 
                  variant={activeFilter === 'antibiotics' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setActiveFilter('antibiotics')}
                >
                  Antibióticos
                </Badge>
                <Badge 
                  variant={activeFilter === 'analgesics' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setActiveFilter('analgesics')}
                >
                  Analgésicos
                </Badge>
                <Badge 
                  variant={activeFilter === 'anesthetics' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setActiveFilter('anesthetics')}
                >
                  Anestésicos
                </Badge>
                <Badge 
                  variant={activeFilter === 'antiinflammatories' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setActiveFilter('antiinflammatories')}
                >
                  Antiinflamatorios
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1 mr-2">
                  <Syringe className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Administración:</span>
                </div>
                
                {/* Route Filters */}
                <Badge 
                  variant={activeRoute === 'all' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setActiveRoute('all')}
                >
                  Todas
                </Badge>
                <Badge 
                  variant={activeRoute === 'oral' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setActiveRoute('oral')}
                >
                  Oral
                </Badge>
                <Badge 
                  variant={activeRoute === 'topical' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setActiveRoute('topical')}
                >
                  Tópica
                </Badge>
                <Badge 
                  variant={activeRoute === 'injection' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setActiveRoute('injection')}
                >
                  Inyectable
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1 mr-2">
                  <Stethoscope className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Uso Dental:</span>
                </div>
                
                {/* Usage Filters */}
                <Badge 
                  variant={activeUsage === 'all' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setActiveUsage('all')}
                >
                  Todos
                </Badge>
                <Badge 
                  variant={activeUsage === 'post-surgical' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setActiveUsage('post-surgical')}
                >
                  Post-quirúrgico
                </Badge>
                <Badge 
                  variant={activeUsage === 'infections' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setActiveUsage('infections')}
                >
                  Infecciones
                </Badge>
                <Badge 
                  variant={activeUsage === 'acute-pain' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setActiveUsage('acute-pain')}
                >
                  Dolor Agudo
                </Badge>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto mt-4 space-y-4">
              {results.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {results.map((med) => (
                    <AccordionItem key={med.id} value={med.id}>
                      <AccordionTrigger className="hover:bg-gray-50 p-2 rounded-md">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex flex-col items-start">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{med.brand_name}</span>
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation();
                                  toggleFavorite(med);
                                }}
                                className="p-1 rounded-full hover:bg-gray-100"
                              >
                                {isFavorite(med.id) ? (
                                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                ) : (
                                  <StarOff className="h-4 w-4 text-gray-400" />
                                )}
                              </button>
                            </div>
                            <span className="text-sm text-gray-500">{med.generic_name}</span>
                          </div>
                          <div className="flex items-center">
                            <Badge variant="outline" className="ml-2">
                              {med.dosage_form}
                            </Badge>
                            <Badge variant="outline" className="ml-2">
                              {med.route}
                            </Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 p-2">
                          <div>
                            <h4 className="font-semibold text-sm">Ingredientes Activos:</h4>
                            <ul className="list-disc pl-5 text-sm">
                              {med.active_ingredients && med.active_ingredients.length > 0 ? (
                                med.active_ingredients.map((ing, i) => (
                                  <li key={i}>{ing.name} ({ing.strength})</li>
                                ))
                              ) : (
                                <li>Información no disponible</li>
                              )}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-sm">Indicaciones y Uso:</h4>
                            <p className="text-sm whitespace-pre-wrap">
                              {med.indications_and_usage || 'Información no disponible'}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-sm">Advertencias:</h4>
                            <p className="text-sm whitespace-pre-wrap">
                              {med.warnings || 'Información no disponible'}
                            </p>
                          </div>
                          
                          <div className="bg-blue-50 p-4 rounded-md">
                            <h4 className="font-semibold text-sm flex items-center gap-2">
                              <Bandage className="h-4 w-4" />
                              Dosificación Referencial:
                            </h4>
                            
                            <div className="mt-2">
                              <p className="text-xs mb-2">
                                Ingrese el peso del paciente para obtener una dosificación orientativa:
                              </p>
                              
                              <div className="flex items-center gap-2">
                                <Input 
                                  type="number" 
                                  placeholder="Peso (kg)" 
                                  className="w-24 text-sm" 
                                  id={`weight-${med.id}`}
                                  min="1"
                                  max="150"
                                />
                                <Button 
                                  size="sm" 
                                  variant="secondary"
                                  onClick={() => {
                                    const weightInput = document.getElementById(`weight-${med.id}`) as HTMLInputElement;
                                    const weight = parseFloat(weightInput.value);
                                    if (weight && weight > 0) {
                                      const dosage = calculateDosage(med.generic_name, weight);
                                      document.getElementById(`dosage-${med.id}`)!.textContent = dosage;
                                    }
                                  }}
                                >
                                  Calcular
                                </Button>
                              </div>
                              
                              <div className="mt-2">
                                <p className="text-sm">Dosis sugerida: <span id={`dosage-${med.id}`}>-</span></p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Nota: Esta es una referencia general. La dosificación debe ser determinada por un profesional médico.
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Add attempt alternate search button for when no active ingredients found */}
                          {(!med.active_ingredients || med.active_ingredients.length === 0) && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => tryAlternateSearch(med.generic_name || med.brand_name)}
                              className="w-full mt-2"
                            >
                              Buscar más información
                            </Button>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {isLoading ? 'Buscando medicamentos...' : 'No se encontraron resultados'}
                  {!isLoading && searchTerm.length >= 3 && (
                    <div className="mt-4">
                      <p className="text-sm mb-2">Prueba estas búsquedas populares:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {['acetaminophen', 'ibuprofen', 'amoxicillin', 'lidocaine'].map(term => (
                          <Badge 
                            key={term}
                            variant="outline" 
                            className="cursor-pointer"
                            onClick={() => {
                              setSearchTerm(term);
                              searchMedications(term);
                            }}
                          >
                            {term}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="favorites" className="flex-1 overflow-y-auto p-6 pt-0">
            <div className="space-y-6">
              {recentSearches.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2 text-gray-500 text-sm">Búsquedas recientes</h3>
                  <div className="space-y-2">
                    {recentSearches.map(med => (
                      <div key={`recent-${med.id}`} className="p-2 border rounded-md flex items-center justify-between">
                        <div>
                          <p className="font-medium">{med.brand_name}</p>
                          <p className="text-sm text-gray-500">{med.generic_name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{med.dosage_form}</Badge>
                          <button 
                            onClick={() => toggleFavorite(med)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            {isFavorite(med.id) ? (
                              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            ) : (
                              <StarOff className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="font-medium mb-2 text-gray-500 text-sm">Medicamentos favoritos</h3>
                {favorites.length > 0 ? (
                  <div className="space-y-2">
                    {favorites.map(med => (
                      <div key={`fav-${med.id}`} className="p-2 border rounded-md flex items-center justify-between">
                        <div>
                          <p className="font-medium">{med.brand_name}</p>
                          <p className="text-sm text-gray-500">{med.generic_name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{med.dosage_form}</Badge>
                          <button 
                            onClick={() => toggleFavorite(med)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    Aún no has añadido medicamentos a favoritos
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
