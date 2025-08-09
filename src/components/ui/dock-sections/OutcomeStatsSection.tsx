import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Star, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// --- Datos y Configuración de Estilo ---
// Paleta de colores mejorada con gradientes
const programmingLanguages = [
  { label: 'TypeScript', percentage: 35, gradient: 'from-blue-400 to-cyan-400' },
  { label: 'React/JSX', percentage: 28, gradient: 'from-sky-400 to-teal-400' },
  { label: 'JavaScript', percentage: 15, gradient: 'from-yellow-400 to-amber-500' },
  { label: 'CSS/Tailwind', percentage: 12, gradient: 'from-pink-400 to-rose-400' },
  { label: 'Dentaxy GPT', percentage: 8, gradient: 'from-purple-400 to-indigo-500' },
  { label: 'SQL', percentage: 2, gradient: 'from-emerald-400 to-green-500' },
];

// --- Componente Principal ---
export const OutcomeStatsModern = () => {
  const [userRating, setUserRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState([0, 0, 0, 0, 0]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRatings = async () => {
      // La lógica para obtener los datos de Supabase permanece igual
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

      const { data: ratings } = await supabase.from('user_ratings').select('rating');
      if (ratings && ratings.length > 0) {
        const total = ratings.length;
        const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
        const avg = sum / total;
        setTotalRatings(total);
        setAverageRating(Number(avg.toFixed(1)));

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

  const handleRating = async (rating) => {
    // La lógica para enviar la calificación permanece igual
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
      const { error } = await supabase.from('user_ratings').upsert({ user_id: user.id, rating: rating });
      if (error) throw error;
      setUserRating(rating);
      toast({
        title: "¡Gracias por tu opinión!",
        description: `Has calificado la aplicación con ${rating} estrella${rating > 1 ? 's' : ''}.`,
      });
      setTimeout(() => window.location.reload(), 1500); // Pequeño delay para que el usuario lea el toast
    } catch (error) {
      console.error('Error saving rating:', error);
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar tu calificación. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  // --- Variantes de Animación para Framer Motion ---
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const Section = ({ title, icon, children }) => (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-slate-100 p-2 rounded-lg">{icon}</div>
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl shadow-lg shadow-indigo-100/50 p-6 w-full max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* --- Columna 1: Lenguajes de Programación --- */}
        <Section title="Tecnologías Utilizadas" icon={<Code2 size={20} className="text-indigo-500" />}>
          {programmingLanguages.map((lang) => (
            <div key={lang.label}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-medium text-slate-700">{lang.label}</span>
                <span className="text-sm font-bold text-slate-500">{lang.percentage}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className={`h-2 rounded-full bg-gradient-to-r ${lang.gradient}`}
                  initial={{ width: '0%' }}
                  animate={{ width: `${lang.percentage}%` }}
                  transition={{ duration: 1, ease: 'circOut', delay: 0.2 }}
                />
              </div>
            </div>
          ))}
        </Section>

        {/* --- Columna 2: Calificaciones de la Comunidad --- */}
        <div className="border-t md:border-t-0 md:border-l border-slate-200/80 md:pl-8">
            <Section title="Opinión de la Comunidad" icon={<TrendingUp size={20} className="text-amber-500" />}>
            
            {/* Calificación General y Estrellas */}
            <div className="bg-slate-100/80 rounded-lg p-4 flex flex-col items-center text-center">
                <span className="text-sm font-medium text-slate-600">Calificación Promedio</span>
                <div className="flex items-center gap-2 my-2">
                    <span className="text-4xl font-bold text-slate-800">{averageRating}</span>
                    <div className="flex flex-col items-start">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={16} className={star <= averageRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}/>
                            ))}
                        </div>
                        <span className="text-xs text-slate-500">{totalRatings} calificaciones</span>
                    </div>
                </div>
                <span className="text-xs text-slate-500">¡Tu opinión es importante! Califícanos:</span>
                <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                            key={star}
                            whileHover={{ scale: 1.2, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRating(star)}
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(0)}
                        >
                            <Star
                                size={22}
                                className={`transition-colors duration-200 ${
                                star <= (hoveredStar || userRating)
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-300'
                                }`}
                            />
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Distribución de Calificaciones */}
            <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-600">Distribución</h4>
                {ratingDistribution.map((count, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                    <span className="font-medium text-slate-500">{5 - index}</span>
                    <Star size={12} className="text-amber-400 fill-amber-400"/>
                    <div className="flex-grow bg-slate-200 rounded-full h-1.5">
                    <motion.div
                        className="bg-amber-400 h-1.5 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: totalRatings > 0 ? `${(count / totalRatings) * 100}%` : '0%' }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                    </div>
                    <span className="w-6 text-right font-mono text-slate-500">{count}</span>
                </div>
                )).reverse()} {/* Para mostrar de 5 a 1 estrella */}
            </div>
            </Section>
        </div>
      </div>
    </motion.div>
  );
};