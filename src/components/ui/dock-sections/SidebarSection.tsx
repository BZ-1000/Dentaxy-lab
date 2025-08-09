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
      <div className="flex-1 p-2 md:p-3 space-y-2 md:space-y-3 overflow-hidden">
        {/* Layout responsivo: vertical en móviles, horizontal en tablets+ */}
        <div className="flex flex-col lg:flex-col space-y-2 md:space-y-3 lg:space-y-3">
          {/* Actualizaciones Automáticas */}
          <UpdatesSection />
          
          {/* Recursos Educativos */}
          <ResourcesSection />
        </div>
      </div>
    </motion.div>
  );
};