import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, X } from 'lucide-react';
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
  const {
    user
  } = useAuth();
  const isMobile = useIsMobile();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  useEffect(() => {
    // Show rating modal after 3 seconds
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
  return <div className={`bg-white h-full ${isMobile ? 'flex flex-col' : 'flex'}`}>
      {/* Barra Lateral Izquierda - Eventos */}
      {!isMobile && <SidebarSection />}

      {/* Contenido Principal */}
      <div className={`flex-1 ${isMobile ? 'p-2 space-y-3' : 'p-3 space-y-3'}`}>
        {/* Header */}
        <div className="text-center mb-3">
          
        </div>

        {/* Grid Principal - Cards Compactos */}
        <div className={isMobile ? "space-y-3" : "grid grid-cols-1 lg:grid-cols-4 gap-3"}>
          {/* Mi Productividad */}
          <div className={isMobile ? "w-full" : "lg:col-span-2"}>
            <ProductividadSection />
          </div>

          {/* Live Metrics */}
          <div>
            <LiveMetricsSection />
          </div>

          {/* Get Great Loan Card */}
          <div>
            <GreatLoanSection />
          </div>
        </div>

        {/* Segunda Fila - Transaction History y Outcome Statistics */}
        <div className={isMobile ? "space-y-3" : "grid grid-cols-1 lg:grid-cols-2 gap-3"}>
          <TransactionSection />
          <OutcomeStatsModern />
        </div>

        {/* Tercera Fila - Budget */}
        <div className="w-full">
          <BudgetSection />
        </div>

        {/* Barra Lateral en Móvil - Al final */}
        {isMobile && <div className="space-y-3 mt-6">
            <SidebarSection />
          </div>}
      </div>

      {/* Rating Modal - Fixed Bottom */}
      <AnimatePresence>
        {showRatingModal && <motion.div initial={{
        opacity: 0,
        y: 50
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: 50
      }} className={`fixed ${isMobile ? 'bottom-2 left-2 right-2' : 'bottom-4 left-4'} z-40`}>
            <Card className={`bg-white shadow-lg border ${isMobile ? 'w-full' : 'w-64'}`}>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-gray-100 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">5</span>
                  <h3 className="text-xs font-bold text-gray-900">Rate your experience</h3>
                  <button onClick={() => setShowRatingModal(false)} className="ml-auto text-gray-400 hover:text-gray-600">
                    <X size={12} />
                  </button>
                </div>
                
                <p className="text-xs text-gray-600 mb-2">Do you find the app easy to use?</p>
                
                <div className="flex justify-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map(star => <button key={star} onClick={() => handleStarClick(star)} onMouseEnter={() => handleStarHover(star)} onMouseLeave={() => setHoveredStar(0)} className="transition-transform hover:scale-110">
                      <Star size={16} className={`${star <= (hoveredStar || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} transition-colors`} />
                    </button>)}
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowRatingModal(false)} className="flex-1 text-xs h-6">
                    Cancel
                  </Button>
                  <Button onClick={() => {
                setShowRatingModal(false);
                // Handle rating submission here
              }} className="flex-1 text-xs h-6 bg-purple-600 hover:bg-purple-700" disabled={rating === 0}>
                    Submit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>}
      </AnimatePresence>
    </div>;
};