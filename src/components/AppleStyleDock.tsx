
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, FileText, Search, Settings, User, Menu, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WikiSearch } from './WikiSearch';
import MedicationSearch from './MedicationSearch';

interface DockItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const DockItem: React.FC<DockItemProps> = ({ icon, label, onClick }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
    >
      <div className="text-2xl text-gray-800 dark:text-gray-200">{icon}</div>
      <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">{label}</span>
    </motion.div>
  );
};

interface AppleStyleDockProps {
  isOpen: boolean;
  onClose: () => void;
}

const AppleStyleDock: React.FC<AppleStyleDockProps> = ({ isOpen, onClose }) => {
  const [isWikiSearchOpen, setIsWikiSearchOpen] = useState(false);
  const [isMedicationSearchOpen, setIsMedicationSearchOpen] = useState(false);

  const dockVariants = {
    open: { 
      x: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.3, 
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
      } 
    },
    closed: { 
      x: "100%", 
      opacity: 0, 
      transition: { 
        duration: 0.3, 
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
      } 
    },
  };

  const handleWikiSearchOpen = () => {
    setIsWikiSearchOpen(true);
  };

  const handleWikiSearchClose = () => {
    setIsWikiSearchOpen(false);
  };

  const handleMedicationSearchOpen = () => {
    setIsMedicationSearchOpen(true);
  };

  const handleMedicationSearchClose = () => {
    setIsMedicationSearchOpen(false);
  };

  return (
    <>
      <WikiSearch open={isWikiSearchOpen} onOpenChange={setIsWikiSearchOpen} />
      {isMedicationSearchOpen && <MedicationSearch onClose={handleMedicationSearchClose} />}

      <motion.div
        className="fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-xl z-50"
        variants={dockVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        exit="closed"
      >
        {/* Close Button */}
        <div className="absolute top-4 left-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col h-full p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Menu</h2>

          <div className="flex flex-col space-y-4">
            <DockItem icon={<Home />} label="Dashboard" onClick={() => { alert('Dashboard clicked'); }} />
            <DockItem icon={<FileText />} label="New Document" onClick={() => { alert('New Document clicked'); }} />
            <DockItem icon={<Search />} label="Wiki Search" onClick={handleWikiSearchOpen} />
            <DockItem icon={<User />} label="Medication Search" onClick={handleMedicationSearchOpen} />
            <DockItem icon={<Settings />} label="Settings" onClick={() => { alert('Settings clicked'); }} />
          </div>

          <div className="mt-auto">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © 2024 Lovable. All rights reserved.
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default AppleStyleDock;
