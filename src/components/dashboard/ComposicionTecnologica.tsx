import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Code, Database, Settings } from 'lucide-react';

const ComposicionTecnologica = () => {
  const outcomesData = [
    {
      name: 'Casos Exitosos',
      percentage: 78,
      color: 'bg-orange-500',
      icon: '🎯'
    },
    {
      name: 'Tiempo Ahorrado',
      percentage: 85,
      color: 'bg-green-500',
      icon: '⚡'
    },
    {
      name: 'Satisfacción',
      percentage: 92,
      color: 'bg-blue-500',
      icon: '⭐'
    }
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Outcome Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {outcomesData.map((outcome, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">{outcome.icon}</span>
                <span className="text-sm font-medium text-foreground">
                  {outcome.name}
                </span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {outcome.percentage}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 ${outcome.color} rounded-full transition-all duration-300`}
                style={{ width: `${outcome.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ComposicionTecnologica;