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
              
            </Card>
          </motion.div>}
      </AnimatePresence>
    </div>;
};