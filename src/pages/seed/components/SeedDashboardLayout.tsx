import React from 'react';
import SeedKeyDates from './SeedKeyDates';
import SeedFolderCard from './SeedFolderCard';
import SeedEventList from './SeedEventList';

export default function SeedDashboardLayout() {
  return (
    <div className="w-full max-w-[98vw] mx-auto px-2 grid grid-cols-1 lg:grid-cols-[340px_1fr_340px] gap-2.5 items-end relative z-20">
      
      {/* Columna Izquierda: Key Dates */}
      <div className="h-[330px] transform translate-y-[36px]">
        <SeedKeyDates />
      </div>

      {/* Columna Central: Tarjeta Compliance */}
      <div className="h-[395px] relative">
        <SeedFolderCard />
      </div>

      {/* Columna Derecha: Event List */}
      <div className="h-[330px] transform translate-y-[36px]">
        <SeedEventList />
      </div>

    </div>
  );
}
