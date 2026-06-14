import React from 'react';
import { Folder, Tags, ListFilter, Calendar, Plus, Share2, ChevronDown } from 'lucide-react';

export default function SeedActionBar() {
  return (
    <div className="w-full px-8 py-4 flex items-center justify-between relative z-40">
      
      {/* Izquierda: Filtros y Vistas */}
      <div className="flex items-center gap-3">
        {/* Folders */}
        <button className="seed-glass-button h-9 px-4 rounded-full flex items-center gap-2 text-xs font-medium">
          <Folder size={14} className="opacity-70" />
          <span>Folders (14)</span>
        </button>
        
        {/* Tags */}
        <button className="seed-glass-button h-9 px-4 rounded-full flex items-center gap-2 text-xs font-medium">
          <Tags size={14} className="opacity-70" />
          <span>Tags (44)</span>
        </button>
 
        {/* Small Dropdown */}
        <button className="seed-glass-button h-9 px-4 rounded-full flex items-center gap-2 text-xs font-medium">
          <ListFilter size={14} className="opacity-70" />
          <span>Small</span>
          <ChevronDown size={14} className="opacity-50 ml-1" />
        </button>
      </div>

      {/* Derecha: Acciones principales */}
      <div className="flex items-center gap-3">
        {/* Expert */}
        <button className="seed-glass-button h-9 px-4 rounded-full flex items-center gap-2 text-xs font-medium">
          <Share2 size={14} className="opacity-70" />
          <span>Expert</span>
        </button>
        
        {/* View tasks */}
        <button className="seed-glass-button h-9 px-4 rounded-full flex items-center gap-2 text-xs font-medium">
          <Calendar size={14} className="opacity-70" />
          <span>View tasks</span>
        </button>

        <button className="seed-glass-button h-9 px-4 rounded-full flex items-center gap-2 text-xs font-semibold text-[var(--seed-green)] border-[var(--seed-green-glow)] bg-[var(--seed-green-glow)] hover:opacity-90 transition">
          <Plus size={14} className="opacity-80" />
          <span>Add Contracts</span>
        </button>
      </div>

    </div>
  );
}
