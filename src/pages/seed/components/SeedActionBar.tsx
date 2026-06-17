import React, { useState } from 'react';
import { Folder, Tags, ListFilter, Users, UserPlus, Share2, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';

interface SeedActionBarProps {
  onNavigate?: (view: 'CAROUSEL' | 'ADD_PATIENT' | 'PATIENTS_LIST') => void;
  currentView?: 'CAROUSEL' | 'ADD_PATIENT' | 'PATIENTS_LIST';
}

export default function SeedActionBar({ onNavigate, currentView }: SeedActionBarProps) {
  const [sortOrder, setSortOrder] = useState('alfabetico');

  // Estados de los filtros clínicos
  const [filters, setFilters] = useState({
    tratamiento: false,
    alta: false,
    urgencia: false,
    sistemicos: false,
  });

  const handleFilterChange = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full px-8 py-4 flex items-center justify-between relative z-40">
      
      {/* Izquierda: Filtros y Vistas */}
      <div className="flex items-center gap-3">
        {/* Expedientes Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              onClick={() => onNavigate?.('CAROUSEL')}
              className={`seed-glass-button h-9 px-4 rounded-full flex items-center gap-2 text-xs font-medium cursor-pointer transition-all ${
                currentView === 'CAROUSEL' 
                  ? 'bg-black/10 dark:bg-white/10 border-black/20 dark:border-white/30 font-semibold' 
                  : ''
              }`}
            >
              <Folder size={14} className="opacity-70" />
              <span>Expedientes</span>
              <ChevronDown size={14} className="opacity-50 ml-1" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-[var(--seed-card-bg)] backdrop-blur-2xl border border-[var(--seed-card-border)] text-[var(--seed-text-main)] shadow-2xl rounded-xl ml-8">
            <DropdownMenuLabel className="text-[var(--seed-text-muted)] font-semibold tracking-wide text-xs uppercase px-3 py-2">Tus Expedientes</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[var(--seed-card-border)]" />
            <div className="py-5 px-3 text-center text-xs text-[var(--seed-text-muted)] italic font-medium">
              Sin expedientes activos
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Filtros Clínicos Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="seed-glass-button h-9 px-4 rounded-full flex items-center gap-2 text-xs font-medium cursor-pointer">
              <Tags size={14} className="opacity-70" />
              <span>Filtros Clínicos</span>
              <ChevronDown size={14} className="opacity-50 ml-1" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-[var(--seed-card-bg)] backdrop-blur-2xl border border-[var(--seed-card-border)] text-[var(--seed-text-main)] shadow-2xl rounded-xl">
            <DropdownMenuLabel className="text-[var(--seed-text-muted)] font-semibold tracking-wide text-xs uppercase px-3 py-2">Estado del Paciente</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[var(--seed-card-border)]" />
            
            <DropdownMenuCheckboxItem 
              checked={filters.tratamiento} 
              onCheckedChange={() => handleFilterChange('tratamiento')}
              className="hover:bg-[var(--seed-row-hover)] focus:bg-[var(--seed-row-hover)] cursor-pointer text-xs font-medium px-3 py-2 text-[var(--seed-text-main)] focus:text-[var(--seed-text-main)] focus:outline-none"
            >
              En Tratamiento
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuCheckboxItem 
              checked={filters.alta} 
              onCheckedChange={() => handleFilterChange('alta')}
              className="hover:bg-[var(--seed-row-hover)] focus:bg-[var(--seed-row-hover)] cursor-pointer text-xs font-medium px-3 py-2 text-[var(--seed-text-main)] focus:text-[var(--seed-text-main)] focus:outline-none"
            >
              Alta Médica
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuCheckboxItem 
              checked={filters.urgencia} 
              onCheckedChange={() => handleFilterChange('urgencia')}
              className="hover:bg-[var(--seed-row-hover)] focus:bg-[var(--seed-row-hover)] cursor-pointer text-xs font-medium px-3 py-2 text-[var(--seed-text-main)] focus:text-[var(--seed-text-main)] focus:outline-none"
            >
              Urgencia / Seguimiento
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuCheckboxItem 
              checked={filters.sistemicos} 
              onCheckedChange={() => handleFilterChange('sistemicos')}
              className="hover:bg-[var(--seed-row-hover)] focus:bg-[var(--seed-row-hover)] cursor-pointer text-xs font-medium px-3 py-2 text-amber-500 dark:text-amber-300 focus:text-amber-600 dark:focus:text-amber-200 focus:outline-none"
            >
              Sistémicos / Alertas
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
 
        {/* Ordenar Por Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="seed-glass-button h-9 px-4 rounded-full flex items-center gap-2 text-xs font-medium cursor-pointer">
              <ListFilter size={14} className="opacity-70" />
              <span>Ordenar Por</span>
              <ChevronDown size={14} className="opacity-50 ml-1" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-[var(--seed-card-bg)] backdrop-blur-2xl border border-[var(--seed-card-border)] text-[var(--seed-text-main)] shadow-2xl rounded-xl">
            <DropdownMenuLabel className="text-[var(--seed-text-muted)] font-semibold tracking-wide text-xs uppercase px-3 py-2">Criterio de Orden</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[var(--seed-card-border)]" />
            <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
              <DropdownMenuRadioItem value="alfabetico" className="hover:bg-[var(--seed-row-hover)] focus:bg-[var(--seed-row-hover)] cursor-pointer text-xs font-medium px-3 py-2 text-[var(--seed-text-main)] focus:text-[var(--seed-text-main)] focus:outline-none">Alfabético</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="modificacion" className="hover:bg-[var(--seed-row-hover)] focus:bg-[var(--seed-row-hover)] cursor-pointer text-xs font-medium px-3 py-2 text-[var(--seed-text-main)] focus:text-[var(--seed-text-main)] focus:outline-none">Última Modificación</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="cita" className="hover:bg-[var(--seed-row-hover)] focus:bg-[var(--seed-row-hover)] cursor-pointer text-xs font-medium px-3 py-2 text-[var(--seed-text-main)] focus:text-[var(--seed-text-main)] focus:outline-none">Próxima Cita</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Derecha: Acciones principales */}
      <div className="flex items-center gap-3">
        {/* Expert */}
        <button className="seed-glass-button h-9 px-4 rounded-full flex items-center gap-2 text-xs font-medium cursor-not-allowed opacity-80" title="Próximamente">
          <Share2 size={14} className="opacity-70" />
          <span>Expert</span>
        </button>
        
        {/* Pacientes */}
        <button 
          onClick={() => onNavigate?.('PATIENTS_LIST')}
          className={`seed-glass-button h-9 px-4 rounded-full flex items-center gap-2 text-xs font-medium cursor-pointer transition-all ${
            currentView === 'PATIENTS_LIST' 
              ? 'bg-black/10 dark:bg-white/10 border-black/20 dark:border-white/30 font-semibold' 
              : ''
          }`}
        >
          <Users size={14} className="opacity-70" />
          <span>Pacientes</span>
        </button>

        {/* Agregar Paciente */}
        <button 
          onClick={() => onNavigate?.('ADD_PATIENT')}
          className="h-9 px-4 rounded-full flex items-center gap-2 text-xs font-bold transition-all cursor-pointer text-white active:scale-95 shadow-lg bg-verde-dentaxy-seed"
        >
          <UserPlus size={14} className="opacity-95" />
          <span>Agregar Paciente</span>
        </button>
      </div>

    </div>
  );
}
