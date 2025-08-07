import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Code, Database, Settings } from 'lucide-react';

const ComposicionTecnologica = () => {
  const techStack = [
    {
      name: 'React/TypeScript',
      percentage: 85,
      icon: Code,
      color: 'bg-blue-500',
      description: 'Frontend & Lógica'
    },
    {
      name: 'Backend',
      percentage: 10,
      icon: Database,
      color: 'bg-green-500',
      description: 'Supabase & Edge Functions'
    },
    {
      name: 'Herramientas/Config',
      percentage: 5,
      icon: Settings,
      color: 'bg-purple-500',
      description: 'Build & Deploy'
    }
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Composición Tecnológica</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {techStack.map((tech, index) => {
          const IconComponent = tech.icon;
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {tech.name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {tech.percentage}%
                </span>
              </div>
              <Progress 
                value={tech.percentage} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {tech.description}
              </p>
            </div>
          );
        })}
        
        <div className="pt-4 border-t border-border">
          <div className="text-center space-y-1">
            <p className="text-xs font-medium text-foreground">Stack Principal</p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>React</span>
              <span>•</span>
              <span>TypeScript</span>
              <span>•</span>
              <span>Supabase</span>
              <span>•</span>
              <span>Tailwind</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComposicionTecnologica;