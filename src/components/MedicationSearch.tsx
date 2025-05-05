import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X, Pill, Info, ExternalLink, Copy, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface MedicationResult {
  id: string;
  name: string;
  active_ingredients: string[];
  dosage_forms: string[];
  route: string;
  description?: string;
  indications?: string[];
  contraindications?: string[];
  side_effects?: string[];
  interactions?: string[];
  warnings?: string[];
  pregnancy_category?: string;
  nursing_mothers?: string;
  pediatric_use?: string;
  geriatric_use?: string;
  dosage?: string;
  administration?: string;
  storage?: string;
  pharmacology?: string;
  mechanism_of_action?: string;
  pharmacokinetics?: string;
  half_life?: string;
  excretion?: string;
  drug_class?: string;
}

const MedicationSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<MedicationResult[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<MedicationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Mock API call - replace with actual API in production
  const searchMedications = async (term: string): Promise<MedicationResult[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    const mockData: MedicationResult[] = [
      {
        id: '1',
        name: 'Amoxicillin',
        active_ingredients: ['Amoxicillin trihydrate'],
        dosage_forms: ['Capsule', 'Tablet', 'Suspension'],
        route: 'Oral',
        description: 'Amoxicillin is a penicillin antibiotic that fights bacteria. It is used to treat many different types of infection caused by bacteria, such as tonsillitis, bronchitis, pneumonia, and infections of the ear, nose, throat, skin, or urinary tract.',
        indications: ['Infections caused by susceptible strains of gram-positive and gram-negative bacteria', 'Upper and lower respiratory tract infections', 'Genitourinary tract infections', 'Skin and skin structure infections'],
        contraindications: ['Hypersensitivity to penicillins', 'History of penicillin-associated cholestatic jaundice/hepatic dysfunction'],
        side_effects: ['Diarrhea', 'Nausea', 'Vomiting', 'Rash', 'Urticaria', 'Anaphylaxis (rare)'],
        interactions: ['Probenecid', 'Allopurinol', 'Oral contraceptives', 'Anticoagulants'],
        warnings: ['Clostridium difficile-associated diarrhea', 'Potential for superinfection'],
        pregnancy_category: 'B',
        nursing_mothers: 'Amoxicillin is excreted in human milk in small amounts. Caution should be exercised when administered to nursing women.',
        pediatric_use: 'Safe for use in children. Dosage should be adjusted based on age and weight.',
        geriatric_use: 'No overall differences in safety or effectiveness have been observed between elderly and younger patients.',
        dosage: 'Adults: 250-500 mg every 8 hours or 500-875 mg every 12 hours depending on the severity of infection. Children: 20-90 mg/kg/day in divided doses.',
        administration: 'May be taken with or without food. Capsules should be swallowed whole with water.',
        storage: 'Store at room temperature away from moisture, heat, and light.',
        pharmacology: 'Bactericidal action against susceptible organisms during the stage of active multiplication.',
        mechanism_of_action: 'Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins.',
        pharmacokinetics: 'Rapidly absorbed from the gastrointestinal tract. Food does not interfere with absorption.',
        half_life: '1-1.5 hours',
        excretion: 'Primarily renal',
        drug_class: 'Penicillin antibiotic'
      },
      {
        id: '2',
        name: 'Ibuprofen',
        active_ingredients: ['Ibuprofen'],
        dosage_forms: ['Tablet', 'Capsule', 'Suspension', 'Gel'],
        route: 'Oral, Topical',
        description: 'Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID). It works by reducing hormones that cause inflammation and pain in the body.',
        indications: ['Pain relief', 'Inflammation reduction', 'Fever reduction', 'Treatment of rheumatoid arthritis', 'Treatment of osteoarthritis'],
        contraindications: ['Hypersensitivity to ibuprofen or other NSAIDs', 'History of asthma, urticaria, or allergic-type reactions after taking aspirin or other NSAIDs', 'In the setting of CABG surgery'],
        side_effects: ['Dyspepsia', 'Nausea', 'Heartburn', 'Dizziness', 'Rash', 'Edema', 'Hypertension'],
        interactions: ['Aspirin', 'Anticoagulants', 'ACE inhibitors', 'Diuretics', 'Lithium'],
        warnings: ['Cardiovascular thrombotic events', 'GI bleeding, ulceration, and perforation', 'Hepatotoxicity', 'Hypertension', 'Renal toxicity'],
        pregnancy_category: 'C (D in 3rd trimester)',
        nursing_mothers: 'Ibuprofen is excreted in human milk in very small amounts. Caution should be exercised when administered to nursing women.',
        pediatric_use: 'Safety and effectiveness in pediatric patients have been established for fever reduction and pain relief.',
        geriatric_use: 'Elderly patients are at increased risk for serious GI events and renal toxicity.',
        dosage: 'Adults: 200-400 mg every 4-6 hours as needed, not to exceed 3200 mg per day. Children: 5-10 mg/kg every 6-8 hours, not to exceed 40 mg/kg/day.',
        administration: 'Take with food or milk to reduce stomach upset.',
        storage: 'Store at room temperature away from moisture and heat.',
        pharmacology: 'Inhibits prostaglandin synthesis by decreasing the activity of the enzyme cyclooxygenase.',
        mechanism_of_action: 'Inhibits both COX-1 and COX-2 enzymes, reducing prostaglandin synthesis.',
        pharmacokinetics: 'Rapidly absorbed from the gastrointestinal tract. Food delays absorption.',
        half_life: '1.8-2 hours',
        excretion: 'Primarily renal',
        drug_class: 'Nonsteroidal anti-inflammatory drug (NSAID)'
      },
      {
        id: '3',
        name: 'Metformin',
        active_ingredients: ['Metformin hydrochloride'],
        dosage_forms: ['Tablet', 'Extended-release tablet', 'Solution'],
        route: 'Oral',
        description: 'Metformin is an oral diabetes medicine that helps control blood sugar levels. It is used together with diet and exercise to improve blood sugar control in adults with type 2 diabetes mellitus.',
        indications: ['Type 2 diabetes mellitus'],
        contraindications: ['Renal disease or renal dysfunction', 'Acute or chronic metabolic acidosis', 'Hypersensitivity to metformin'],
        side_effects: ['Diarrhea', 'Nausea', 'Vomiting', 'Flatulence', 'Abdominal discomfort', 'Lactic acidosis (rare but serious)'],
        interactions: ['Cationic drugs', 'Alcohol', 'Iodinated contrast materials', 'Carbonic anhydrase inhibitors'],
        warnings: ['Lactic acidosis', 'Vitamin B12 deficiency', 'Hypoglycemia when used with other glucose-lowering medications'],
        pregnancy_category: 'B',
        nursing_mothers: 'Metformin is excreted in human milk in small amounts. Caution should be exercised when administered to nursing women.',
        pediatric_use: 'Safety and effectiveness have been established in pediatric patients 10-16 years of age.',
        geriatric_use: 'Elderly patients are at increased risk for lactic acidosis. Dose selection should be cautious.',
        dosage: 'Initial: 500 mg twice daily or 850 mg once daily. Maintenance: 2000-2550 mg daily in divided doses.',
        administration: 'Take with meals to reduce gastrointestinal side effects.',
        storage: 'Store at room temperature away from moisture and heat.',
        pharmacology: 'Decreases hepatic glucose production, decreases intestinal absorption of glucose, and improves insulin sensitivity.',
        mechanism_of_action: 'Decreases hepatic glucose production and intestinal absorption of glucose and improves insulin sensitivity by increasing peripheral glucose uptake and utilization.',
        pharmacokinetics: 'Slowly and incompletely absorbed from the gastrointestinal tract. Food decreases the extent and slightly delays absorption.',
        half_life: '6.2 hours',
        excretion: 'Primarily renal',
        drug_class: 'Biguanide'
      }
    ];
    
    // Filter based on search term
    if (!term) return [];
    return mockData.filter(med => 
      med.name.toLowerCase().includes(term.toLowerCase()) || 
      med.active_ingredients.some(ing => ing.toLowerCase().includes(term.toLowerCase()))
    );
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    setResults([]);
    setSelectedMedication(null);
    
    try {
      const searchResults = await searchMedications(searchTerm);
      setResults(searchResults);
    } catch (error) {
      console.error('Error searching medications:', error);
      toast({
        title: "Error",
        description: "Failed to search medications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setSelectedMedication(null);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleSelectMedication = (medication: MedicationResult) => {
    setSelectedMedication(medication);
    setActiveTab('general');
  };

  const handleCopySection = (section: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedSection(section);
    
    toast({
      title: "Copied to clipboard",
      description: `${section} information copied successfully.`,
    });
    
    setTimeout(() => {
      setCopiedSection(null);
    }, 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search for medications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyPress}
              className="pl-10 pr-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button onClick={handleSearch} disabled={!searchTerm.trim() || isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : results.length > 0 && !selectedMedication ? (
          <div className="grid grid-cols-1 gap-4">
            {results.map((medication) => (
              <Card 
                key={medication.id} 
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleSelectMedication(medication)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center">
                        <Pill className="h-4 w-4 mr-2 text-blue-500" />
                        {medication.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {medication.active_ingredients.join(', ')}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {medication.dosage_forms.map((form, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {form}
                          </Badge>
                        ))}
                        <Badge variant="outline" className="text-xs bg-blue-50">
                          {medication.route}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-500">
                      <Info className="h-4 w-4 mr-1" /> Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : selectedMedication ? (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold flex items-center">
                    <Pill className="h-5 w-5 mr-2 text-blue-500" />
                    {selectedMedication.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedMedication.active_ingredients.join(', ')}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedMedication(null)}
                >
                  Back to Results
                </Button>
              </div>
              
              <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="px-4 border-b">
                  <TabsList className="w-full justify-start h-12 bg-transparent">
                    <TabsTrigger value="general" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20">
                      General
                    </TabsTrigger>
                    <TabsTrigger value="indications" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20">
                      Indications
                    </TabsTrigger>
                    <TabsTrigger value="dosage" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20">
                      Dosage
                    </TabsTrigger>
                    <TabsTrigger value="warnings" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20">
                      Warnings
                    </TabsTrigger>
                    <TabsTrigger value="pharmacology" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20">
                      Pharmacology
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <ScrollArea className="h-[500px]">
                  <TabsContent value="general" className="p-4 space-y-4 mt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold">Description</h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleCopySection('Description', selectedMedication.description || '')}
                                className="h-6 px-2"
                              >
                                {copiedSection === 'Description' ? (
                                  <Check className="h-3.5 w-3.5 text-green-500" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy to clipboard</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="text-sm">{selectedMedication.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="text-md font-semibold">Drug Class</h3>
                        <p className="text-sm">{selectedMedication.drug_class}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-md font-semibold">Route</h3>
                        <p className="text-sm">{selectedMedication.route}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-md font-semibold">Dosage Forms</h3>
                        <div className="flex flex-wrap gap-1">
                          {selectedMedication.dosage_forms.map((form, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {form}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-md font-semibold">Pregnancy Category</h3>
                        <p className="text-sm">{selectedMedication.pregnancy_category || 'Not specified'}</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="indications" className="p-4 space-y-4 mt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold">Indications</h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleCopySection('Indications', (selectedMedication.indications || []).join('\n• '))}
                                className="h-6 px-2"
                              >
                                {copiedSection === 'Indications' ? (
                                  <Check className="h-3.5 w-3.5 text-green-500" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy to clipboard</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedMedication.indications?.map((indication, idx) => (
                          <li key={idx} className="text-sm">{indication}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold">Contraindications</h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleCopySection('Contraindications', (selectedMedication.contraindications || []).join('\n• '))}
                                className="h-6 px-2"
                              >
                                {copiedSection === 'Contraindications' ? (
                                  <Check className="h-3.5 w-3.5 text-green-500" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy to clipboard</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedMedication.contraindications?.map((contraindication, idx) => (
                          <li key={idx} className="text-sm">{contraindication}</li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="dosage" className="p-4 space-y-4 mt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold">Dosage</h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleCopySection('Dosage', selectedMedication.dosage || '')}
                                className="h-6 px-2"
                              >
                                {copiedSection === 'Dosage' ? (
                                  <Check className="h-3.5 w-3.5 text-green-500" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy to clipboard</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="text-sm">{selectedMedication.dosage}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold">Administration</h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleCopySection('Administration', selectedMedication.administration || '')}
                                className="h-6 px-2"
                              >
                                {copiedSection === 'Administration' ? (
                                  <Check className="h-3.5 w-3.5 text-green-500" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy to clipboard</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="text-sm">{selectedMedication.administration}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Special Populations</h3>
                      
                      <div className="space-y-1">
                        <h4 className="text-md font-medium">Pediatric Use</h4>
                        <p className="text-sm">{selectedMedication.pediatric_use}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-md font-medium">Geriatric Use</h4>
                        <p className="text-sm">{selectedMedication.geriatric_use}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-md font-medium">Nursing Mothers</h4>
                        <p className="text-sm">{selectedMedication.nursing_mothers}</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="warnings" className="p-4 space-y-4 mt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold">Warnings</h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleCopySection('Warnings', (selectedMedication.warnings || []).join('\n• '))}
                                className="h-6 px-2"
                              >
                                {copiedSection === 'Warnings' ? (
                                  <Check className="h-3.5 w-3.5 text-green-500" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy to clipboard</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedMedication.warnings?.map((warning, idx) => (
                          <li key={idx} className="text-sm">{warning}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold">Side Effects</h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleCopySection('Side Effects', (selectedMedication.side_effects || []).join('\n• '))}
                                className="h-6 px-2"
                              >
                                {copiedSection === 'Side Effects' ? (
                                  <Check className="h-3.5 w-3.5 text-green-500" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy to clipboard</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedMedication.side_effects?.map((effect, idx) => (
                          <li key={idx} className="text-sm">{effect}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold">Drug Interactions</h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleCopySection('Drug Interactions', (selectedMedication.interactions || []).join('\n• '))}
                                className="h-6 px-2"
                              >
                                {copiedSection === 'Drug Interactions' ? (
                                  <Check className="h-3.5 w-3.5 text-green-500" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy to clipboard</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedMedication.interactions?.map((interaction, idx) => (
                          <li key={idx} className="text-sm">{interaction}</li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="pharmacology" className="p-4 space-y-4 mt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold">Mechanism of Action</h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleCopySection('Mechanism of Action', selectedMedication.mechanism_of_action || '')}
                                className="h-6 px-2"
                              >
                                {copiedSection === 'Mechanism of Action' ? (
                                  <Check className="h-3.5 w-3.5 text-green-500" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy to clipboard</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="text-sm">{selectedMedication.mechanism_of_action}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold">Pharmacokinetics</h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleCopySection('Pharmacokinetics', selectedMedication.pharmacokinetics || '')}
                                className="h-6 px-2"
                              >
                                {copiedSection === 'Pharmacokinetics' ? (
                                  <Check className="h-3.5 w-3.5 text-green-500" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy to clipboard</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="text-sm">{selectedMedication.pharmacokinetics}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="text-md font-semibold">Half-life</h3>
                        <p className="text-sm">{selectedMedication.half_life}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-md font-semibold">Excretion</h3>
                        <p className="text-sm">{selectedMedication.excretion}</p>
                      </div>
                    </div>
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </CardContent>
          </Card>
        ) : searchTerm && !isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No medications found matching "{searchTerm}"</p>
            <p className="text-sm text-gray-400 mt-2">Try a different search term or check the spelling</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MedicationSearch;
