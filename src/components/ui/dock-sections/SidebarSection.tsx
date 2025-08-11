import { motion } from 'framer-motion';
import { SidebarHeader } from './SidebarHeader';
import { UpdatesSection } from './UpdatesSection';
import { ResourcesSection } from './ResourcesSection';

export const SidebarSection = () => {
  return (
    <motion.div 
      className="w-52 bg-background border-r border-border/50 flex flex-col h-full"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with Logo */}
      <SidebarHeader />
      
      {/* Content Area - Expandir al máximo */}
      <div className="flex-1 flex flex-col gap-3 p-3 overflow-hidden">
        {/* Actualizaciones - Altura fija optimizada */}
        <div className="flex-1 min-h-0">
          <UpdatesSection />
        </div>
        
        {/* Recursos Educativos - Altura fija optimizada */}
        <div className="flex-1 min-h-0">
          <ResourcesSection />
        </div>
      </div>
    </motion.div>
  );
};