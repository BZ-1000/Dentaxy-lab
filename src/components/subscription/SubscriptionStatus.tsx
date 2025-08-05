import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { Calendar, CreditCard, RefreshCw, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const SubscriptionStatus = () => {
  const { subscription, user } = useAuth();
  const { loading, openCustomerPortal, refreshSubscription } = useSubscription();

  if (!user) return null;

  const formatSubscriptionEnd = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    } catch {
      return 'Fecha inválida';
    }
  };

  const getSubscriptionColor = (tier: string | null) => {
    switch (tier) {
      case 'Beta':
        return 'bg-blue-500';
      case 'Express':
        return 'bg-green-500';
      case 'Professional':
        return 'bg-purple-500';
      case 'Pro Monthly':
        return 'bg-red-500';
      case 'Student Semester':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Estado de Suscripción
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshSubscription}
            disabled={subscription.loading}
          >
            <RefreshCw className={`h-4 w-4 ${subscription.loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
        <CardDescription>
          Información sobre tu plan actual y suscripción
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Estado:</span>
            <Badge variant={subscription.subscribed ? "default" : "secondary"}>
              {subscription.subscribed ? "Activa" : "No activa"}
            </Badge>
          </div>
          
          {subscription.subscription_tier && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Plan:</span>
              <Badge 
                className={`text-white ${getSubscriptionColor(subscription.subscription_tier)}`}
              >
                {subscription.subscription_tier}
              </Badge>
            </div>
          )}
          
          {subscription.subscription_end && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Vence:</span>
              <span className="text-sm flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatSubscriptionEnd(subscription.subscription_end)}
              </span>
            </div>
          )}
        </div>

        {subscription.subscribed && (
          <Button
            variant="outline"
            className="w-full"
            onClick={openCustomerPortal}
            disabled={loading}
          >
            <Settings className="h-4 w-4 mr-2" />
            Gestionar Suscripción
          </Button>
        )}

        {!subscription.subscribed && (
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              No tienes una suscripción activa
            </p>
            <Button asChild>
              <a href="/plans">Ver Planes</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};