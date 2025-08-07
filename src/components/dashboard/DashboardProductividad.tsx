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
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Dashboard de Productividad</h1>
          <p className="text-muted-foreground">
            Monitorea tu actividad, progreso y el pulso de la comunidad Dentaxy.ai
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Main Charts */}
          <div className="lg:col-span-8 space-y-6">
            {/* User Activity Chart */}
            <div className="grid grid-cols-1">
              <TiempoActividad />
            </div>

            {/* Platform Metrics */}
            <div className="grid grid-cols-1">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-foreground">Métricas Clave</h2>
                <MetricasPlataforma />
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ComposicionTecnologica />
              <SistemaCalificacion />
            </div>
          </div>

          {/* Right Column - Side Panel */}
          <div className="lg:col-span-4 space-y-6">
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