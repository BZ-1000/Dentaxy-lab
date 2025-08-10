import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, X, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { ProductividadSection } from './ProductividadSection';
import { LiveMetricsSection } from './GoalsSection';
import { GreatLoanSection } from './GreatLoanSection';
import { TransactionSection } from './TransactionSection';
import { OutcomeStatsModern } from './OutcomeStatsSection';
import { BudgetSection } from './BudgetSection';
import { SidebarSection } from './SidebarSection';

export const EstadisticasContent = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRatingModal(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleStarClick = (starNumber: number) => {
    setRating(starNumber);
  };

  const handleStarHover = (starNumber: number) => {
    setHoveredStar(starNumber);
  };

  const handleCloseRating = () => {
    setShowRatingModal(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 ${isMobile ? 'flex flex-col' : 'flex'}`}>
      {/* Sidebar - Más alargada y elegante */}
      {!isMobile && (
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="w-80 min-h-screen"
        >
          <SidebarSection />
        </motion.div>
      )}

      {/* Contenido Principal */}
      <motion.div 
        className={`flex-1 ${isMobile ? 'p-4' : 'p-8'} space-y-8`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header con animación */}
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-blue-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            Bienvenido de vuelta, {user?.name || 'Usuario'}
          </p>
        </motion.div>

        {/* Grid Principal - Más espacioso y fluido */}
        <motion.div 
          className={isMobile ? "space-y-6" : "grid grid-cols-1 lg:grid-cols-4 gap-6"}
          variants={containerVariants}
        >
          {/* Mi Productividad - Card principal */}
          <motion.div 
            className={isMobile ? "w-full" : "lg:col-span-2"}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ProductividadSection />
          </motion.div>

          {/* Live Metrics */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <LiveMetricsSection />
          </motion.div>

          {/* Get Great Loan Card */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <GreatLoanSection />
          </motion.div>
        </motion.div>

        {/* Segunda Fila - Transaction History y Outcome Statistics */}
        <motion.div 
          className={isMobile ? "space-y-6" : "grid grid-cols-1 lg:grid-cols-2 gap-6"}
          variants={containerVariants}
        >
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <TransactionSection />
          </motion.div>
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <OutcomeStatsModern />
          </motion.div>
        </motion.div>

        {/* Tercera Fila - Budget */}
        <motion.div 
          className="w-full"
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <BudgetSection />
        </motion.div>

        {/* Barra Lateral en Móvil - Al final con mejor espaciado */}
        {isMobile && (
          <motion.div 
            className="space-y-6 mt-8"
            variants={itemVariants}
          >
            <SidebarSection />
          </motion.div>
        )}
      </motion.div>

      {/* Rating Modal - Rediseñado estilo Apple */}
      <AnimatePresence>
        {showRatingModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              opacity: { duration: 0.2 }
            }}
            className={`fixed ${isMobile ? 'bottom-4 left-4 right-4' : 'bottom-8 left-8'} z-50`}
          >
            <Card className={`
              bg-white/90 backdrop-blur-xl shadow-2xl border-0 
              ${isMobile ? 'w-full' : 'w-80'} 
              rounded-2xl overflow-hidden
            `}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">¿Cómo te sientes?</h3>
                    <p className="text-sm text-gray-500">Valora tu experiencia</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseRating}
                    className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex justify-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => handleStarHover(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="p-1 rounded-full hover:bg-yellow-50 transition-colors"
                    >
                      <Star
                        className={`w-7 h-7 transition-all duration-200 ${
                          star <= (hoveredStar || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-300'
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
                
                {rating > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-center"
                  >
                    <p className="text-sm text-gray-600 mb-3">
                      {rating === 5 ? "¡Excelente!" : 
                       rating === 4 ? "¡Muy bien!" :
                       rating === 3 ? "Está bien" :
                       rating === 2 ? "Puede mejorar" : "Necesitamos mejorar"}
                    </p>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl"
                      onClick={handleCloseRating}
                    >
                      Gracias por tu feedback
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};