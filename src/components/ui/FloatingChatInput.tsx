
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PromptInputBox } from './ai-prompt-box';
import { TypewriterEffect } from './TypewriterEffect';
import { useAnalysisMode } from '@/contexts/AnalysisModeContext';
import { X } from 'lucide-react';

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

const DENTAXY_SYSTEM_PROMPT = `Eres DentaxyGPT, un asistente médico especializado en odontología. Tu función es ayudar a los profesionales dentales con consultas médicas, procedimientos, diagnósticos y recomendaciones de tratamiento.

IMPORTANTE:
- Responde SIEMPRE en español
- Proporciona información médica precisa y actualizada
- Incluye referencias a literatura médica cuando sea posible
- Mantén un tono profesional y empático
- Si una consulta está fuera de tu área de expertise, indica claramente las limitaciones

Para consultas médicas específicas:
1. Analiza los síntomas o situación presentada
2. Proporciona información diagnóstica relevante
3. Sugiere opciones de tratamiento apropiadas
4. Incluye recomendaciones de seguimiento
5. Advierte sobre posibles complicaciones

Recuerda que tus respuestas son para apoyo educativo y no reemplazan el juicio clínico profesional.`;

export function FloatingChatInput({ isOpen, onClose, onSend }: FloatingChatInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeResponse, setActiveResponse] = useState<ChatMessage | null>(null);
  const { isAnalysisMode, setAnalysisMode } = useAnalysisMode();

  const handleSend = async (message: string) => {
    setIsLoading(true);
    
    try {
      const currentDomain = window.location.hostname;
      let refererUrl = 'https://www.dentaxy.com';
      
      if (currentDomain.includes('dentaxy.com')) {
        refererUrl = currentDomain.includes('www.') ? 'https://www.dentaxy.com' : 'https://dentaxy.com';
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
          'HTTP-Referer': refererUrl,
          'X-Title': 'DentaxyGPT - Asistente Médico Odontológico',
          'Origin': refererUrl
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.2-3b-instruct:free',
          messages: [
            {
              role: 'system',
              content: DENTAXY_SYSTEM_PROMPT
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.3,
          max_tokens: 500,
          top_p: 0.8,
          frequency_penalty: 0.5,
          presence_penalty: 0.3
        })
      });

      if (!response.ok) {
        throw new Error('Error al obtener respuesta del servidor');
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || 'No se pudo procesar la consulta. Intenta nuevamente.';
      
      const responseMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse.trim(),
        timestamp: new Date(),
        isTyping: true
      };
      
      setActiveResponse(responseMessage);
      onSend(message);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Error al procesar la consulta. Por favor, verifica tu conexión e intenta nuevamente.',
        timestamp: new Date(),
        isTyping: false
      };
      setActiveResponse(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-[9998] pointer-events-auto"
            style={{ marginBottom: '100px' }}
          >
            <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-600/50 shadow-2xl p-3 w-[350px]">
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
