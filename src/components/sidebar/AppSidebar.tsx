import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SidebarHeader } from './SidebarHeader';
import { HomeSection } from './sections/HomeSection';
import { AgendaSection } from './sections/AgendaSection';
import { HistoriaClinicaNav } from './sections/HistoriaClinicaNav';
import { NotasSection } from './sections/NotasSection';
import { TutorialesSection } from './sections/TutorialesSection';
import { NotificacionesSection } from './sections/NotificacionesSection';
import { ModulosSection } from './sections/ModulosSection';
import { UserProfileCard } from './footer/UserProfileCard';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppSidebarProps {
  className?: string;
}

export const AppSidebar = ({ className }: AppSidebarProps) => {
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem('sidebar_collapsed');
    return stored === 'true';
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', collapsed.toString());
    
    // Dispatch event to notify Index.tsx about sidebar state change
    window.dispatchEvent(new CustomEvent('sidebar-state-change', { 
      detail: { collapsed } 
    }));
  }, [collapsed]);

  const toggleCollapsed = () => setCollapsed(!collapsed);
  const toggleMobileOpen = () => setMobileOpen(!mobileOpen);

  // Desktop sidebar - Fixed lateral sidebar (not overlay)
  const DesktopSidebar = () => (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 56 : 220 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'hidden md:flex flex-col h-screen bg-background border-r border-border/50 fixed left-0 top-0 z-[60]',
        className
      )}
    >
      <SidebarHeader collapsed={collapsed} onToggle={toggleCollapsed} />
      
      <div className="flex-1 overflow-y-auto custom-scrollbar sidebar-content">
        <div className="py-1.5 px-2">
          <HomeSection collapsed={collapsed} />
          <AgendaSection collapsed={collapsed} />
          <HistoriaClinicaNav collapsed={collapsed} />
          <NotasSection collapsed={collapsed} />
          <TutorialesSection collapsed={collapsed} />
          <NotificacionesSection collapsed={collapsed} />
          <ModulosSection collapsed={collapsed} />
        </div>
      </div>
      
      <UserProfileCard collapsed={collapsed} />
    </motion.aside>
  );

  // Mobile sidebar (overlay)
  const MobileSidebar = () => (
    <AnimatePresence>
      {mobileOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden"
            onClick={toggleMobileOpen}
          />
          
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-screen w-[220px] bg-background border-r border-border/50 z-[60] md:hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <img 
                  src="/lovable-uploads/47756bd5-fe5d-45cf-bbb4-f61daf4a38cd.png" 
                  alt="DENTAXY" 
                  className="w-8 h-8"
                />
                <span className="font-semibold">DENTAXY</span>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleMobileOpen}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="py-1.5 px-2">
                <HomeSection collapsed={false} />
                <AgendaSection collapsed={false} />
                <HistoriaClinicaNav collapsed={false} />
                <NotasSection collapsed={false} />
                <TutorialesSection collapsed={false} />
                <NotificacionesSection collapsed={false} />
                <ModulosSection collapsed={false} />
              </div>
            </div>
            
            <UserProfileCard collapsed={false} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  // Mobile toggle button (hamburger)
  const MobileToggle = () => (
    <Button
      variant="outline"
      size="icon"
      className="fixed top-4 left-4 z-40 md:hidden"
      onClick={toggleMobileOpen}
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </Button>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
      <MobileToggle />
    </>
  );
};
