
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PromptInputBox } from './ai-prompt-box';
import { TypewriterEffect } from './TypewriterEffect';
import { ScrollArea } from './scroll-area';

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

export function FloatingChatInput({ isOpen, onClose, onSend }: FloatingChatInputProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Simular respuesta de IA
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiResponse: ChatMessage = {
        role: 'assistant',
        content: `Definición de "${message}": Este es un término médico-dental que se refiere a...`,
        timestamp: new Date(),
        isTyping: true
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypingComplete = (messageIndex: number) => {
    setMessages(prev => prev.map((msg, index) => 
      index === messageIndex ? { ...msg, isTyping: false } : msg
    ));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop borroso */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Chat popup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src="/lovable-uploads/8d0bcc46-2c73-4647-8420-9aa25c312389.png" 
                    alt="DentaxyGPT" 
                    className="h-8 w-8" 
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Análisis de Términos
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Definiciones médicas instantáneas
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Chat area */}
              <div className="h-80">
                <ScrollArea className="h-full p-6">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <img 
                        src="/lovable-uploads/8d0bcc46-2c73-4647-8420-9aa25c312389.png" 
                        alt="DentaxyGPT" 
                        className="h-12 w-12 mb-4 opacity-50" 
                      />
                      <p className="text-gray-500 dark:text-gray-400">
                        Escribe un término médico para obtener su definición
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-2xl ${
                              message.role === 'user'
                                ? 'bg-black text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                            }`}
                          >
                            {message.role === 'assistant' && message.isTyping ? (
                              <TypewriterEffect 
                                text={message.content}
                                speed={25}
                                onComplete={() => handleTypingComplete(index)}
                              />
                            ) : (
                              <p className="text-sm">{message.content}</p>
                            )}
                            <p className={`text-xs mt-1 opacity-70 ${
                              message.role === 'user' ? 'text-gray-300' : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>

              {/* Input area */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <PromptInputBox
                  onSend={handleSend}
                  isLoading={isLoading}
                  placeholder="Escribe un término médico..."
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
