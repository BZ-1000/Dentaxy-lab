import { useState } from 'react';
import { BookOpen, Clock } from 'lucide-react';
import { BaseOverlay } from './BaseOverlay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { tutorials } from '@/data/tutorials';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TutorialesOverlayProps {
  open: boolean;
  onClose: () => void;
}

export const TutorialesOverlay = ({ open, onClose }: TutorialesOverlayProps) => {
  const [selectedTutorial, setSelectedTutorial] = useState<string | null>(null);
  const currentTutorial = tutorials.find(t => t.id === selectedTutorial);

  if (currentTutorial) {
    return (
      <BaseOverlay open={open} onClose={onClose} title={currentTutorial.title} icon={BookOpen}>
        <div className="space-y-6">
          <Button variant="outline" onClick={() => setSelectedTutorial(null)}>
            ← Volver a tutoriales
          </Button>
          
          <div className="flex items-center gap-2">
            <Badge>{currentTutorial.category}</Badge>
            {currentTutorial.duration && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {currentTutorial.duration}
              </div>
            )}
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: currentTutorial.content.replace(/\n/g, '<br/>') }} />
          </div>

          {currentTutorial.steps && (
            <Card>
              <CardHeader>
                <CardTitle>Pasos Rápidos</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {currentTutorial.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}
        </div>
      </BaseOverlay>
    );
  }

  return (
    <BaseOverlay open={open} onClose={onClose} title="Guía de Uso" icon={BookOpen}>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="formulario">Formulario</TabsTrigger>
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>
        
        {['all', 'formulario', 'agenda', 'reportes', 'general'].map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {tutorials
                .filter(t => category === 'all' || t.category === category)
                .map((tutorial) => (
                  <Card 
                    key={tutorial.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedTutorial(tutorial.id)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                      <CardDescription>{tutorial.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{tutorial.category}</Badge>
                        {tutorial.duration && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {tutorial.duration}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </BaseOverlay>
  );
};
