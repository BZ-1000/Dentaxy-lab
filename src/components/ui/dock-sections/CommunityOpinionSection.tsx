import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const CommunityOpinionSection = () => {
  const [userRating, setUserRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState<number[]>([0, 0, 0, 0, 0]);
  const { toast } = useToast();

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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Inicia sesión para calificar",
        description: "Necesitas una cuenta para poder dejar tu opinión.",
        variant: "destructive",
      });
      return;
    }
    try {
      const { error } = await supabase
        .from("user_ratings")
        .upsert({ user_id: user.id, rating });
      if (error) throw error;
      setUserRating(rating);
      toast({
        title: "¡Gracias por tu opinión!",
        description: `Has calificado la aplicación con ${rating} estrella${rating > 1 ? "s" : ""}.`,
      });
    } catch (error) {
      console.error("Error saving rating:", error);
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar tu calificación. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            ★
          </span>
          <h3 className="text-sm font-semibold text-foreground">Opinión de la Comunidad</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Izquierda: Resumen y calificación del usuario */}
          <div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center text-center">
            <span className="text-xs font-medium text-muted-foreground">Calificación Promedio</span>
            <div className="flex items-center gap-2 my-2">
              <span className="text-4xl font-bold text-foreground">{averageRating}</span>
              <div className="flex flex-col items-start">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= averageRating ? "text-primary fill-primary" : "text-muted-foreground"}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{totalRatings} calificaciones</span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">¡Tu opinión es importante! Califícanos:</span>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileHover={{ scale: 1.15, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  aria-label={`Calificar ${star} estrellas`}
                >
                  <Star
                    size={22}
                    className={
                      star <= (hoveredStar || userRating)
                        ? "text-primary fill-primary"
                        : "text-muted-foreground"
                    }
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Derecha: Distribución */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">Distribución</h4>
            {[...ratingDistribution].reverse().map((count, revIndex) => {
              const starValue = 5 - revIndex; // 5 a 1
              const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
              return (
                <div key={starValue} className="flex items-center gap-2 text-xs">
                  <span className="font-medium text-muted-foreground w-3 text-right">{starValue}</span>
                  <Star size={12} className="text-primary fill-primary" />
                  <div className="flex-grow bg-muted rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className="bg-primary h-1.5 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                  <span className="w-6 text-right font-mono text-muted-foreground">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
