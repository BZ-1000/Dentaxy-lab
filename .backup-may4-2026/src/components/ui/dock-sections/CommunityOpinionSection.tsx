import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const CommunityOpinionSection = () => {
  const [userRating, setUserRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      setIsLoading(true);

      // Fetch all ratings for statistics
      const { data: ratings } = await supabase.from("user_ratings").select("rating");
      if (ratings && ratings.length > 0) {
        const total = ratings.length;
        const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
        const avg = sum / total;
        setTotalRatings(total);
        setAverageRating(Number(avg.toFixed(1)));

        const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratings.forEach((r) => {
          if (r.rating >= 1 && r.rating <= 5) {
            distribution[r.rating] = (distribution[r.rating] || 0) + 1;
          }
        });
        setRatingDistribution(distribution);
      }
      
      setIsLoading(false);
    };

    fetchRatings();
  }, []);

  const handleRating = async (rating: number) => {
    setUserRating(rating);
    toast.success(`¡Gracias por tu opinión! ${rating} estrella${rating > 1 ? "s" : ""}`);
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-accent/5 border-0 shadow-lg shadow-primary/5">
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-transparent backdrop-blur-xl" />
      
      <CardContent className="relative p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <span className="bg-gradient-to-br from-primary via-primary to-primary/80 rounded-xl w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs font-bold text-primary-foreground shadow-lg shadow-primary/25">
            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
          </span>
          <div>
            <h3 className="text-sm sm:text-base font-black bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
              Comunidad
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              {totalRatings > 0 ? `${totalRatings} valoraciones` : 'Sé el primero en valorar'}
            </p>
          </div>
        </div>

        {/* Rating section */}
        <div className="space-y-3">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                  {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        star <= averageRating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-muted/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
              {userRating > 0 && (
                <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
                  Tu voto: {userRating}★
                </span>
              )}
            </div>
            
            {/* Interactive rating buttons */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-muted-foreground">
                ¿Qué te parece?
              </p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={isLoading}
                    className="transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed relative group"
                  >
                    <Star
                      className={`w-6 h-6 sm:w-7 sm:h-7 transition-all duration-200 ${
                        (hoveredStar > 0 ? star <= hoveredStar : star <= userRating)
                          ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                          : 'text-muted-foreground/40'
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Distribución compacta */}
          {totalRatings > 0 && (
            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingDistribution[stars] || 0;
                const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                
                return (
                  <div key={stars} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-muted-foreground font-medium">{stars}</span>
                    <div className="flex-1 bg-muted/50 rounded-full h-1.5">
                      <motion.div
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: (5 - stars) * 0.05 }}
                      />
                    </div>
                    <span className="w-4 text-muted-foreground text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
