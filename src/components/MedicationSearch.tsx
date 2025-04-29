
import { useState, useEffect } from 'react';
import { X, Search, Star, StarOff, Filter, PillBottle, Stethoscope, Syringe, Bandage } from 'lucide-react';
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
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

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
      const response = await fetch(`https://api.fda.gov/drug/label.json?search=(openfda.brand_name:"${term}"+openfda.generic_name:"${term}")+AND+_exists_:openfda.brand_name&limit=10`);
      const data = await response.json();
      
      if (data.results) {
        // Primero formatear los resultados sin traducir
        const formattedResults: Medication[] = data.results.map((item: any) => ({
          id: item.id || item.openfda?.application_number?.[0] || Math.random().toString(36),
          brand_name: item.openfda?.brand_name?.[0] || 'N/A',
          generic_name: item.openfda?.generic_name?.[0] || 'N/A',
          route: item.openfda?.route?.[0] || 'N/A',
          dosage_form: item.openfda?.dosage_form?.[0] || 'N/A',
          active_ingredients: item.active_ingredient?.map((ing: string) => {
            const parts = ing.split(' ');
            return { name: parts.slice(0, -1).join(' '), strength: parts[parts.length - 1] };
          }),
          indications_and_usage: item.indications_and_usage?.[0],
          warnings: item.warnings?.[0],
          drug_class: item.openfda?.pharm_class_epc?.[0] || 'N/A'
        }));

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
        setResults([]);
        toast.info('No se encontraron resultados. Intente con otro término.');
      }
    } catch (error) {
      console.error('Error searching medications:', error);
      toast.error('Error al buscar medicamentos. Por favor intente de nuevo.');
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
      <DialogContent className="max-w-4xl w-[95%] h-[85vh] p-0 overflow-hidden flex flex-col bg-white dark:bg-neutral-900 rounded-xl">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl flex items-center gap-2 relative" translate="yes">
              <PillBottle className="h-6 w-6 text-emerald-500" />
              Búsqueda de Medicamentos
              <span className="text-xs text-blue-500 absolute top-full left-0 mt-1 whitespace-nowrap opacity-75" translate="yes">
                Recomendación: Utiliza Google Translate para traducciones
              </span>
            </DialogTitle>
          </div>
        </DialogHeader>
        
        
        
        <Tabs defaultValue="search" className="flex-1 overflow-hidden flex flex-col">
          <div className="px-6 pb-2">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="search" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900" translate="yes">
                Búsqueda
              </TabsTrigger>
              <TabsTrigger value="favorites" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900" translate="yes">
                Favoritos y Recientes
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
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      if (e.target.value.length >= 3) {
                        searchMedications(e.target.value);
                      }
                    }}
                    placeholder="Buscar medicamentos..." 
                    className="pl-10"
                    translate="yes"
                  />
                </div>
                <Button 
                  onClick={() => searchMedications(searchTerm)} 
                  disabled={searchTerm.length < 3 || isLoading}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  translate="yes"
                >
                  {isLoading ? "Buscando..." : "Buscar"}
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1 mr-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500" translate="yes">Filtros:</span>
                </div>
                
                {/* Medication Type Filters */}
                <Badge 
                  variant={activeFilter === 'all' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setActiveFilter('all')}
                  translate="yes"
                >
                  Todos
                </Badge>
                <Badge 
                  variant={activeFilter === 'antibiotics' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setActiveFilter('antibiotics')}
                  translate="yes"
                >
                  Antibióticos
                </Badge>
                <Badge 
                  variant={activeFilter === 'analgesics' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setActiveFilter('analgesics')}
                  translate="yes"
                >
                  Analgésicos
                </Badge>
                <Badge 
                  variant={activeFilter === 'anesthetics' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setActiveFilter('anesthetics')}
                  translate="yes"
                >
                  Anestésicos
                </Badge>
                <Badge 
                  variant={activeFilter === 'antiinflammatories' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setActiveFilter('antiinflammatories')}
                  translate="yes"
                >
                  Antiinflamatorios
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1 mr-2">
                  <Syringe className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500" translate="yes">Administración:</span>
                </div>
                
                {/* Route Filters */}
                <Badge 
                  variant={activeRoute === 'all' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setActiveRoute('all')}
                  translate="yes"
                >
                  Todas
                </Badge>
                <Badge 
                  variant={activeRoute === 'oral' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setActiveRoute('oral')}
                  translate="yes"
                >
                  Oral
                </Badge>
                <Badge 
                  variant={activeRoute === 'topical' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setActiveRoute('topical')}
                  translate="yes"
                >
                  Tópica
                </Badge>
                <Badge 
                  variant={activeRoute === 'injection' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setActiveRoute('injection')}
                  translate="yes"
                >
                  Inyectable
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1 mr-2">
                  <Stethoscope className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500" translate="yes">Uso Dental:</span>
                </div>
                
                {/* Usage Filters */}
                <Badge 
                  variant={activeUsage === 'all' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setActiveUsage('all')}
                  translate="yes"
                >
                  Todos
                </Badge>
                <Badge 
                  variant={activeUsage === 'post-surgical' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setActiveUsage('post-surgical')}
                  translate="yes"
                >
                  Post-quirúrgico
                </Badge>
                <Badge 
                  variant={activeUsage === 'infections' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setActiveUsage('infections')}
                  translate="yes"
                >
                  Infecciones
                </Badge>
                <Badge 
                  variant={activeUsage === 'acute-pain' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setActiveUsage('acute-pain')}
                  translate="yes"
                >
                  Dolor Agudo
                </Badge>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-2">
              {searchTerm.length < 3 ? (
                <div className="text-center py-8 text-gray-500" translate="yes">
                  <p>Escriba al menos 3 caracteres para buscar</p>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">Sugerencias:</p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm('acetaminophen');
                        searchMedications('acetaminophen');
                      }}
                      className="mr-2"
                      translate="yes"
                    >
                      Acetaminophen
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm('ibuprofen');
                        searchMedications('ibuprofen');
                      }}
                      className="mr-2"
                      translate="yes"
                    >
                      Ibuprofen
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm('amoxicillin');
                        searchMedications('amoxicillin');
                      }}
                      translate="yes"
                    >
                      Amoxicillin
                    </Button>
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div translate="yes">
                  <Accordion 
                    type="single" 
                    collapsible 
                    className="w-full"
                    onValueChange={(value) => {
                      setExpandedItem(value);
                    }}
                  >
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
                                {med.active_ingredients ? (
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
                                    translate="yes"
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
                                    translate="yes"
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
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500" translate="yes">
                  {isLoading ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                      <p>Buscando medicamentos...</p>
                    </div>
                  ) : (
                    <p>No se encontraron resultados</p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        
          <TabsContent value="favorites" className="flex-1 overflow-y-auto p-6 pt-0">
            <div className="space-y-6" translate="yes">
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
