import { useIsMobile } from '@/hooks/use-mobile';
import { ProductividadSection } from './ProductividadSection';
import { LiveMetricsSection } from './LiveMetricsSection';
import { SidebarSection } from './SidebarSection';
import { TechnologyUsageSection } from './TechnologyUsageSection';
import { CommunityOpinionSection } from './CommunityOpinionSection';
import { SystemStatusSection } from './SystemStatusSection';

export const EstadisticasContent = () => {
  const isMobile = useIsMobile();

  return (
    <div className={`bg-background min-h-screen h-full ${isMobile ? 'flex flex-col' : 'flex'}`}>
      {!isMobile && <SidebarSection />}

      <div className={`flex-1 ${isMobile ? 'p-3 space-y-4' : 'p-4 space-y-4'}`}>
        {/* Grid principal reorganizado */}
        <div className={isMobile ? 'space-y-3' : 'grid grid-cols-1 lg:grid-cols-3 gap-4'}>
          {/* Columna 1: Productividad + Comunidad */}
          <div className={isMobile ? 'w-full space-y-3' : 'lg:col-span-2 space-y-4'}>
            <ProductividadSection />
            {!isMobile && <CommunityOpinionSection />}
          </div>
          
          {/* Columna 2: Tecnologías + Estado del Sistema */}
          <div className={isMobile ? 'w-full space-y-3' : 'lg:col-span-1 space-y-4'}>
            <TechnologyUsageSection />
            <SystemStatusSection />
            {isMobile && <CommunityOpinionSection />}
          </div>
        </div>

        {/* Métricas en vivo */}
        <div className="w-full">
          <LiveMetricsSection />
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
