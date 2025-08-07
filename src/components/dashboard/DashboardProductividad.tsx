import React from 'react';
import { useActivityTracking } from '@/hooks/useActivityTracking';
import TiempoActividad from './TiempoActividad';
import MetricasPlataforma from './MetricasPlataforma';
import FeedActividadAI from './FeedActividadAI';
import ComposicionTecnologica from './ComposicionTecnologica';
import SistemaCalificacion from './SistemaCalificacion';
import RankingUsuarios from './RankingUsuarios';
import EventosActualizaciones from './EventosActualizaciones';

const DashboardProductividad = () => {
  // Track user activity automatically
  useActivityTracking();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">Dashboard de Productividad</h1>
          <p className="text-sm text-muted-foreground">
            Monitorea tu actividad, progreso y el pulso de la comunidad Dentaxy.ai
          </p>
        </div>

        {/* Compact Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Main Productivity Chart */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Productivity Chart */}
            <TiempoActividad />
            
            {/* Goals/Metrics Row */}
            <MetricasPlataforma />
            
            {/* Bottom Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ComposicionTecnologica />
              <SistemaCalificacion />
            </div>
          </div>

          {/* Right Column - Transaction History & Side Panel */}
          <div className="space-y-4">
            <FeedActividadAI />
            <RankingUsuarios />
            <EventosActualizaciones />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProductividad;