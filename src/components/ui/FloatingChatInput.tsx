
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PromptInputBox } from './ai-prompt-box';
import { TypewriterEffect } from './TypewriterEffect';

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

// Componente para el popup de respuesta
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
      className="fixed top-4 right-4 z-50 max-w-md"
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
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
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

export function FloatingChatInput({ isOpen, onClose, onSend }: FloatingChatInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeResponse, setActiveResponse] = useState<ChatMessage | null>(null);

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);
    onSend(message);

    try {
      // Simular respuesta de IA
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiResponse: ChatMessage = {
        role: 'assistant',
        content: `Definición de "${message}": Este es un término médico-dental que se refiere a...`,
        timestamp: new Date(),
        isTyping: true
      };

      setActiveResponse(aiResponse);
      onClose(); // Cerrar el input después de enviar
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeResponse = () => {
    setActiveResponse(null);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-md mx-4"
          >
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-600/50 p-3 shadow-2xl">
              <PromptInputBox
                onSend={handleSend}
                isLoading={isLoading}
                placeholder="Escribe un término médico..."
                className="bg-gray-800/90 border-gray-600/50 text-sm"
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
