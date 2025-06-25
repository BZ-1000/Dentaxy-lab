import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PromptInputBox } from './ai-prompt-box';
import { TypewriterEffect } from './TypewriterEffect';
import { useAnalysisMode } from '@/contexts/AnalysisModeContext';
import { X } from 'lucide-react';

// ... (El resto de tus componentes como ResponsePopup y las interfaces no cambian)

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface FloatingChatInputProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: string) => void;
}

interface ResponsePopupProps {
  message: ChatMessage;
  onClose: () => void;
}

function ResponsePopup({ message, onClose }: ResponsePopupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed top-4 right-4 z-[9999] max-w-md"
    >
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/8d0bcc46-2c73-4647-8420-9aa25c312389.png" 
              alt="DentaxyGPT" 
              className="h-6 w-6" 
            />
            <span className="text-white text-sm font-medium">DentaxyGPT</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="text-white text-sm">
          {message.isTyping ? (
            <TypewriterEffect 
              text={message.content}
              speed={25}
            />
          ) : (
            <p>{message.content}</p>
          )}
        </div>
        
        <div className="text-gray-400 text-xs mt-2">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
}

const DENTAXY_SYSTEM_PROMPT = `Eres DentaxyGPT...`; // El prompt no cambia

export function FloatingChatInput({ isOpen, onClose, onSend }: FloatingChatInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeResponse, setActiveResponse] = useState<ChatMessage | null>(null);
  const { isAnalysisMode, setAnalysisMode } = useAnalysisMode();

  const handleSend = async (message: string) => {
    // ... (Tu lógica de handleSend no necesita cambios)
  };

  const closeResponse = () => {
    setActiveResponse(null);
  };

  const handleCloseAnalysisMode = () => {
    setAnalysisMode(false);
  };

  return (
    <>
      {/* Indicador de modo análisis */}
      {isAnalysisMode && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
        >
          <span className="text-sm font-medium">🔍 Modo Análisis Activo - Haz clic en cualquier palabra</span>
          <button
            onClick={handleCloseAnalysisMode}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {isOpen && (
          // CAMBIO 1: Contenedor padre que se encarga del posicionamiento y centrado.
          <div
            className="fixed bottom-0 left-0 right-0 z-[9998] flex justify-center pointer-events-none"
            style={{ marginBottom: '100px' }}
          >
            <div
              className="pointer-events-auto bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-600/50 shadow-2xl p-3"
              style={{ width: '350px' }}
            >
              <PromptInputBox
                onSend={handleSend}
                isLoading={isLoading}
                placeholder="Escribe un término médico..."
                className="bg-transparent border-transparent text-sm min-h-[48px]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeResponse && (
          <ResponsePopup 
            message={activeResponse} 
            onClose={closeResponse}
          />
        )}
      </AnimatePresence>
    </>
  );
}
