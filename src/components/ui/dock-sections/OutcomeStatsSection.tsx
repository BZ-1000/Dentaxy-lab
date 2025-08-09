import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Code, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const programmingLanguages = [
  { label: 'TypeScript', percentage: 35, color: 'bg-blue-500' },
  { label: 'React/JSX', percentage: 28, color: 'bg-cyan-500' },
  { label: 'JavaScript', percentage: 15, color: 'bg-yellow-500' },
  { label: 'CSS/Tailwind', percentage: 12, color: 'bg-pink-500' },
  { label: 'Dentaxy GPT', percentage: 8, color: 'bg-purple-500' },
  { label: 'SQL', percentage: 2, color: 'bg-green-500' },
];

export const OutcomeStatsSection = () => {
  const [userRating, setUserRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState<number[]>([0, 0, 0, 0, 0]);
  const { toast } = useToast();

  // Fetch user's current rating and overall statistics
  useEffect(() => {
    const fetchRatings = async () => {
      // Get user's current rating
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userRatingData } = await supabase
          .from('user_ratings')
          .select('rating')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (userRatingData) {
          setUserRating(userRatingData.rating);
        }
      }

      // Get overall rating statistics
      const { data: ratings } = await supabase
        .from('user_ratings')
        .select('rating');

      if (ratings && ratings.length > 0) {
        const total = ratings.length;
        const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
        const avg = sum / total;
        
        setTotalRatings(total);
        setAverageRating(Number(avg.toFixed(1)));

        // Calculate distribution
        const distribution = [0, 0, 0, 0, 0];
        ratings.forEach(r => {
          if (r.rating >= 1 && r.rating <= 5) {
            distribution[r.rating - 1]++;
          }
        });
        setRatingDistribution(distribution);
      }
    };

    fetchRatings();
  }, []);

  const handleRating = async (rating: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para calificar la aplicación",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_ratings')
        .upsert({
          user_id: user.id,
          rating: rating,
        });

      if (error) throw error;

      setUserRating(rating);
      toast({
        title: "¡Gracias por tu calificación!",
        description: `Has calificado Dentaxy con ${rating} estrella${rating > 1 ? 's' : ''}`,
      });

      // Refresh statistics
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Error saving rating:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar tu calificación",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <span className="bg-muted rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">4</span>
          Lenguajes de programación utilizados en dentaxy
          <Code size={12} className="ml-auto text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 p-2 space-y-3">
        {/* Programming Languages Section */}
        <div className="space-y-2">
          {programmingLanguages.map((lang, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">{lang.label}</span>
                <span className="text-xs font-bold text-foreground">{lang.percentage}%</span>
              </div>
              <Progress value={lang.percentage} className="h-1" />
            </div>
          ))}
        </div>

        {/* Rating Section */}
        <div className="border-t border-border pt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">Califica Dentaxy</span>
            <div className="text-xs text-muted-foreground">
              ⭐ {averageRating} ({totalRatings})
            </div>
          </div>
          
          {/* Star Rating */}
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="p-0.5"
              >
                <Star
                  size={14}
                  className={`transition-colors ${
                    star <= (hoveredStar || userRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              </motion.button>
            ))}
          </div>

          {/* Rating Distribution Chart */}
          <div className="space-y-1">
            {ratingDistribution.map((count, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-3">{index + 1}</span>
                <div className="flex-1 bg-muted rounded-full h-1">
                  <div
                    className="bg-primary h-1 rounded-full transition-all duration-300"
                    style={{
                      width: totalRatings > 0 ? `${(count / totalRatings) * 100}%` : '0%'
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-4">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};