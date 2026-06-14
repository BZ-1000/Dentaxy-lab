import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const CARDS_DATA = [
  { id: 1, label: 'Sec', percent: 0 },
  { id: 2, label: 'Lic', percent: 0 },
  { id: 3, label: 'Fin', percent: 0 },
  { id: 4, label: 'Cat', percent: 0 },
  { id: 5, label: 'Omt', percent: 0 },
  { id: 6, label: 'Corporate', percent: 87, active: true, sub: 'Jan 12 - May 12' },
  { id: 7, label: 'Compliance', percent: 0 },
  { id: 8, label: 'Edi', percent: 0 },
  { id: 9, label: 'Mn', percent: 0 },
  { id: 10, label: '', percent: 0 },
  { id: 11, label: '', percent: 0 },
  { id: 12, label: '', percent: 0 },
  { id: 13, label: '', percent: 0 },
  { id: 14, label: '', percent: 0 },
  { id: 15, label: '', percent: 0 },
  { id: 16, label: '', percent: 0 },
  { id: 17, label: '', percent: 0 },
];

export default function SeedCarousel() {
  const activeCard = CARDS_DATA.find(c => c.active);

  if (!activeCard) return null;

  return (
    <div className="relative w-full h-[320px] flex items-center justify-center z-30">
      
      <div className="flex items-center justify-center relative w-full max-w-5xl h-full">
        <div
          className="relative w-[210px] h-[300px] rounded-3xl transition-all duration-500 ease-out flex flex-col justify-between p-6 seed-carousel-active hover:scale-[1.03] cursor-pointer"
          style={{
            transform: 'translateZ(0)',
          }}
        >
          {/* Contenido de la Tarjeta */}
          <div className="flex justify-between items-start z-10">
            <div>
              <h3 className="text-white font-semibold text-xl leading-tight tracking-wide">{activeCard.label}</h3>
              <p className="text-white/75 text-xs mt-1.5 font-medium">{activeCard.sub}</p>
            </div>
            <ArrowUpRight size={18} className="text-white/80 hover:text-white transition" />
          </div>
          
          <div className="flex justify-between items-end z-10">
            <span className="text-white font-light text-[44px] leading-none tracking-tight">{activeCard.percent}%</span>
            <div className="w-2.5 h-2.5 rounded-full seed-green-dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
