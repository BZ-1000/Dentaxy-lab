
import React from 'react';
import { Home, FileText, Settings, User } from 'lucide-react';

export const AppleStyleDock = () => {
  const dockItems = [
    { icon: Home, label: 'Inicio' },
    { icon: FileText, label: 'Formularios' },
    { icon: User, label: 'Perfil' },
    { icon: Settings, label: 'Configuración' },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl px-4 py-2 shadow-lg border border-gray-200">
        <div className="flex items-center gap-2">
          {dockItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className="p-3 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
                aria-label={item.label}
              >
                <Icon className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
