import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Star, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SistemaCalificacion = () => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) {
      checkExistingRating();
    }
  }, [user]);

  const checkExistingRating = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('user_ratings')
        .select('rating, feedback')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setHasRated(true);
        setCurrentRating(data.rating);
        setFeedback(data.feedback || '');
      }
    } catch (error) {
      // User hasn't rated yet
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para calificar');
      return;
    }

    if (rating === 0) {
      toast.error('Por favor selecciona una calificación');
      return;
    }

    setIsSubmitting(true);

    try {
      if (hasRated) {
        // Update existing rating
        await supabase
          .from('user_ratings')
          .update({
            rating,
            feedback,
            created_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } else {
        // Insert new rating
        await supabase
          .from('user_ratings')
          .insert({
            user_id: user.id,
            rating,
            feedback
          });
      }

      setHasRated(true);
      setCurrentRating(rating);
      setOpen(false);
      toast.success('¡Gracias por tu calificación!');
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Error al enviar la calificación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (currentRating: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-6 h-6 cursor-pointer transition-colors ${
          i < currentRating
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-muted-foreground hover:text-yellow-400'
        }`}
        onClick={interactive ? () => setRating(i + 1) : undefined}
      />
    ));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <MessageSquare className="h-4 w-4" />
          Califica Dentaxy.ai
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasRated ? (
          <div className="text-center space-y-3">
            <div className="flex justify-center gap-1">
              {renderStars(currentRating)}
            </div>
            <p className="text-sm text-muted-foreground">
              Ya has calificado la aplicación
            </p>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  Actualizar calificación
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Actualizar Calificación</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    ¿Qué tan útil ha sido Dentaxy.ai para optimizar tus historias clínicas? ¡Tu opinión nos ayuda a mejorar!
                  </p>
                  <div className="flex justify-center gap-1">
                    {renderStars(rating, true)}
                  </div>
                  <Textarea
                    placeholder="Comparte tu experiencia (opcional)"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || rating === 0}
                    className="w-full"
                  >
                    {isSubmitting ? 'Enviando...' : 'Actualizar Calificación'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Ayúdanos a mejorar con tu opinión
            </p>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="w-full" 
                  disabled={!user}
                >
                  {user ? 'Calificar Aplicación' : 'Inicia sesión para calificar'}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Califica Dentaxy.ai</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    ¿Qué tan útil ha sido Dentaxy.ai para optimizar tus historias clínicas? ¡Tu opinión nos ayuda a mejorar!
                  </p>
                  <div className="flex justify-center gap-1">
                    {renderStars(rating, true)}
                  </div>
                  <Textarea
                    placeholder="Comparte tu experiencia (opcional)"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || rating === 0}
                    className="w-full"
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Calificación'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SistemaCalificacion;