import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const CommunityOpinionSection = () => {
  const [userRating, setUserRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState<Record<number, number>>({});
  const { user } = useAuth();

  useEffect(() => {
    const fetchRatings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userRatingData } = await supabase
          .from("user_ratings")
          .select("rating")
          .eq("user_id", user.id)
          .maybeSingle();
        if (userRatingData) setUserRating(userRatingData.rating);
      }

      const { data: ratings } = await supabase.from("user_ratings").select("rating");
      if (ratings && ratings.length > 0) {
        const total = ratings.length;
        const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
        const avg = sum / total;
        setTotalRatings(total);
        setAverageRating(Number(avg.toFixed(1)));

        const distribution = [0, 0, 0, 0, 0];
        ratings.forEach((r) => {
          if (r.rating >= 1 && r.rating <= 5) distribution[r.rating - 1]++;
        });
        setRatingDistribution(distribution);
      }
    };

    fetchRatings();
  }, []);

  const handleRating = async (rating: number) => {
    if (!user) {
      toast.error("Inicia sesión para valorar");
      return;
    }
    try {
      const { error } = await supabase
        .from("user_ratings")
        .upsert({ user_id: user.id, rating });
      if (error) throw error;
      setUserRating(rating);
      toast.success(`¡Gracias! Calificaste con ${rating} estrella${rating > 1 ? "s" : ""}`);
    } catch (error) {
      console.error("Error saving rating:", error);
      toast.error("No se pudo guardar tu calificación");
    }
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-primary/5 border border-primary/10 shadow-xl shadow-primary/10 rounded-3xl backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 rounded-3xl" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/60 via-accent to-primary/60 rounded-t-3xl" />
      
      <CardContent className="relative p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-5 sm:mb-6">
          <div className="relative">
            <span className="bg-gradient-to-br from-primary via-primary to-primary/90 rounded-2xl w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse shadow-lg shadow-accent/50" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Comunidad Dentaxy
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium bg-muted/30 px-3 py-1 rounded-full inline-block">
              {totalRatings > 0 ? `${totalRatings} valoraciones` : 'Sé el primero en valorar'}
            </p>
          </div>
        </div>

        {/* Sección de calificación elegante */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-muted/20 via-muted/10 to-muted/20 rounded-2xl p-4 border border-primary/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-3 shadow-inner">
                  <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    {averageRating.toFixed(1)}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        onClick={() => handleRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 rounded-full hover:bg-primary/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <Star
                          className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                            (hoveredStar > 0 ? star <= hoveredStar : star <= (userRating || averageRating))
                              ? 'text-yellow-400 fill-yellow-400 drop-shadow-lg'
                              : 'text-muted-foreground hover:text-yellow-300'
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {user ? 'Haz clic para calificar' : 'Inicia sesión para calificar'}
                  </p>
                </div>
              </div>
              {userRating > 0 && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-gradient-to-r from-accent/20 to-primary/20 text-primary border border-primary/20 px-3 py-2 rounded-2xl text-xs font-bold shadow-lg"
                >
                  Tu calificación: {userRating}★
                </motion.div>
              )}
            </div>
          </div>

          {/* Distribución elegante de calificaciones */}
          {totalRatings > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-muted/10 via-transparent to-muted/10 rounded-2xl p-4 border border-muted/20"
            >
              <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Distribución de calificaciones
              </h4>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = ratingDistribution[stars] || 0;
                  const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                  
                  return (
                    <motion.div 
                      key={stars} 
                      className="flex items-center gap-3 text-sm"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: (5 - stars) * 0.1 }}
                    >
                      <div className="flex items-center gap-1 min-w-[40px]">
                        <span className="text-muted-foreground font-bold">{stars}</span>
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      </div>
                      <div className="flex-1 bg-muted/30 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full shadow-inner"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ 
                            duration: 0.8, 
                            delay: (5 - stars) * 0.1,
                            ease: "easeOut"
                          }}
                        />
                      </div>
                      <motion.span 
                        className="min-w-[30px] text-right text-muted-foreground font-bold bg-muted/20 px-2 py-0.5 rounded-full text-xs"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: (5 - stars) * 0.1 + 0.5 }}
                      >
                        {count}
                      </motion.span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
