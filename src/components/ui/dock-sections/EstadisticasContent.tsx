import { useIsMobile } from '@/hooks/use-mobile';
import { ProductividadSection } from './ProductividadSection';
import { LiveMetricsSection } from './LiveMetricsSection';
import { SidebarSection } from './SidebarSection';
import { TechnologyUsageSection } from './TechnologyUsageSection';
import { CommunityOpinionSection } from './CommunityOpinionSection';

export const EstadisticasContent = () => {
  const isMobile = useIsMobile();

  return (
    <div className={`bg-background min-h-screen h-full ${isMobile ? 'flex flex-col' : 'flex'}`}>
      {!isMobile && <SidebarSection />}

      <div className={`flex-1 ${isMobile ? 'p-3 space-y-4' : 'p-4 space-y-4'}`}>
        {/* Grid principal: Productividad + (Métricas en vivo / Tecnologías) */}
        <div className={isMobile ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-4 gap-4'}>
          <div className={isMobile ? 'w-full' : 'lg:col-span-2'}>
            <ProductividadSection />
          </div>
          <div>
            <LiveMetricsSection />
          </div>
          <div>
            <TechnologyUsageSection />
          </div>
        </div>

        {/* Opinión de la comunidad */}
        <div className={isMobile ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-4 gap-4'}>
          <div className="lg:col-span-4">
            <CommunityOpinionSection />
          </div>
        </div>

        {/* Sidebar en móvil al final */}
        {isMobile && (
          <div className="space-y-4 mt-6">
            <SidebarSection />
          </div>
        )}
      </div>
    </div>
  );
};
