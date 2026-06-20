import React from 'react';
import SeedKeyDates from './SeedKeyDates';
import SeedFolderCard from './SeedFolderCard';
import SeedEventList from './SeedEventList';

export default function SeedDashboardLayout({ 
  activePatient,
  isFolderHovered,
  onFolderHoverChange,
  onOpenFolder
}: { 
  activePatient?: any;
  isFolderHovered?: boolean;
  onFolderHoverChange?: (hovered: boolean) => void;
  onOpenFolder?: (folder: any, rect: DOMRect) => void;
}) {
  return (
    <div className="w-full max-w-[98vw] mx-auto px-2 grid grid-cols-1 lg:grid-cols-[340px_1fr_340px] gap-2.5 items-end relative z-20">
      
      {/* Columna Izquierda: Key Dates */}
      <div className={`h-[330px] transform translate-y-[36px] transition-all duration-500 ${isFolderHovered ? 'blur-[2px] opacity-60 pointer-events-none' : ''}`}>
        <SeedKeyDates />
      </div>

      {/* Columna Central: Tarjeta Compliance */}
      <div className="h-[395px] relative">
        <SeedFolderCard 
          activePatient={activePatient} 
          onHoverChange={onFolderHoverChange} 
          onOpenFolder={onOpenFolder}
        />
      </div>

      {/* Columna Derecha: Event List */}
      <div className={`h-[330px] transform translate-y-[36px] transition-all duration-500 ${isFolderHovered ? 'blur-[2px] opacity-60 pointer-events-none' : ''}`}>
        <SeedEventList />
      </div>

    </div>
  );
}
