import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard } from 'lucide-react';

export const SubscriptionStatus = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Estado de Suscripción
          </span>
        </CardTitle>
        <CardDescription>
          Información sobre tu plan actual
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Estado:</span>
            <Badge variant="secondary">Demo</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Plan:</span>
            <Badge className="bg-blue-500 text-white">
              Demo Gratuito
            </Badge>
          </div>
        </div>

        <div className="text-center p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Estás usando la versión demo con acceso completo
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
