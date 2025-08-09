import { motion } from 'framer-motion';
import { SidebarHeader } from './SidebarHeader';
import { UpdatesSection } from './UpdatesSection';
import { ResourcesSection } from './ResourcesSection';

export const SidebarSection = () => {
  return (
    <motion.div 
      className="w-56 md:w-48 lg:w-56 bg-white border-r border-border/50 flex flex-col h-full"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with Logo */}
      <SidebarHeader />
      
      {/* Content Area */}
      <div className="flex-1 p-2 md:p-3 gap-2 md:gap-3 overflow-hidden flex flex-col min-h-0">
        {/* Actualizaciones Automáticas - 50% del espacio */}
        <div className="flex-1 min-h-0">
          <UpdatesSection />
        </div>
        
        {/* Recursos Educativos - 50% del espacio */}
        <div className="flex-1 min-h-0">
          <ResourcesSection />
        </div>
      </div>
    </motion.div>
  );
};