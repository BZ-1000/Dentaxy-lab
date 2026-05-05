
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface TextDefinitionPopupProps {
  isOpen: boolean;
  position: { x: number; y: number } | null;
  selectedText: string;
  definition: string;
  isLoading: boolean;
  onClose: () => void;
}

export function TextDefinitionPopup({ 
  isOpen, 
  position, 
  selectedText, 
  definition, 
  isLoading, 
  onClose 
}: TextDefinitionPopupProps) {
  if (!isOpen || !position) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="fixed z-[10000] pointer-events-auto"
        style={{
          left: Math.min(position.x, window.innerWidth - 320),
          top: Math.max(position.y - 10, 10),
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 max-w-xs">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/8d0bcc46-2c73-4647-8420-9aa25c312389.png" 
                alt="DentaxyGPT" 
                className="h-5 w-5" 
              />
              <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                {selectedText}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                <span>Obteniendo definición...</span>
              </div>
            ) : (
              <p className="leading-relaxed">{definition}</p>
            )}
          </div>
        </div>
        
        {/* Flecha indicadora */}
        <div 
          className="absolute w-3 h-3 bg-white dark:bg-gray-800 border-l border-b border-gray-200 dark:border-gray-700 transform rotate-45"
          style={{
            left: '20px',
            top: '-6px',
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
