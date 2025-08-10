
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarSection } from './SidebarSection';
import { ProductividadSection } from './ProductividadSection';
import { LiveMetricsSection } from './GoalsSection';
import { TechnologyUsageCard, CommunityOpinionCard } from './OutcomeStatsSection';

export const EstadisticasContent = () => {
  const isMobile = useIsMobile();

  return (
    <div className={`${isMobile ? 'flex flex-col' : 'flex'} relative min-h-screen`}>
      {/* Fondo sutil y animado (no en las cards) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-background"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 top-10 right-[-10%] h-64 w-64 rounded-full bg-primary/10 blur-3xl pulse"
      />

      {/* Barra Lateral Izquierda - ocupa toda la altura del contenedor */}
      {!isMobile && <SidebarSection />}

      {/* Contenido Principal */}
      <main className={`flex-1 ${isMobile ? 'p-3 space-y-3' : 'p-6 space-y-6'}`}>
        {/* Grid profesional, compacto y adaptable */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Mi Productividad (protagonista, 2 columnas) */}
          <div className="lg:col-span-2">
            <ProductividadSection />
          </div>

          {/* Columna derecha: métricas en vivo + lenguajes usados */}
          <div className="lg:col-span-2 space-y-4">
            <LiveMetricsSection />
            <TechnologyUsageCard />
          </div>

          {/* Segunda fila: opinión de la comunidad (ocupa todo el ancho) */}
          <div className="lg:col-span-4">
            <CommunityOpinionCard />
          </div>
        </div>

        {/* Barra Lateral en Móvil - al final y con separación */}
        {isMobile && (
          <div className="space-y-3 mt-6">
            <SidebarSection />
          </div>
        )}
      </main>
    </div>
  );
};
