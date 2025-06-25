
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PromptInputBox } from './ai-prompt-box';
import { TypewriterEffect } from './TypewriterEffect';
import { useAnalysisMode } from '@/contexts/AnalysisModeContext';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import DOMPurify from 'dompurify';

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
  // Convert markdown-style bold text to HTML safely
  const formatContent = (content: string) => {
    // Replace **text** with <strong>text</strong> safely
    const htmlContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Sanitize the HTML to prevent XSS attacks
    return DOMPurify.sanitize(htmlContent, { 
      ALLOWED_TAGS: ['strong', 'em', 'br', 'p'],
      ALLOWED_ATTR: [] 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed top-4 right-4 z-[9999] max-w-md"
    >
      <div className="backdrop-blur-md border border-gray-600 rounded-2xl p-4 shadow-2xl bg-gray-800">
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
            className="text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="text-white text-sm">
          {message.isTyping ? (
            <TypewriterEffect text={message.content} speed={25} />
          ) : (
            <div 
              dangerouslySetInnerHTML={{ 
                __html: formatContent(message.content) 
              }} 
            />
          )}
        </div>
        
        <div className="text-gray-300 text-xs mt-2">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
}

const DENTAXY_SYSTEM_PROMPT = `Eres DentaxyGPT, un asistente especializado en odontología que ayuda a explicar términos médicos dentales de manera clara y concisa. Tu objetivo es proporcionar definiciones precisas y útiles para estudiantes y profesionales de la odontología.

Cuando recibas un término médico dental:
1. Proporciona una definición clara y concisa
2. Explica su relevancia en el contexto odontológico
3. Si es apropiado, menciona sinónimos o términos relacionados
4. Mantén un tono profesional pero accesible
5. Limita tu respuesta a máximo 150 palabras

Si el término no está relacionado con odontología, indica que te especializas en términos dentales y sugiere reformular la consulta.`;

export function FloatingChatInput({ isOpen, onClose, onSend }: FloatingChatInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeResponse, setActiveResponse] = useState<ChatMessage | null>(null);
  const { isAnalysisMode } = useAnalysisMode();

  // Input validation and sanitization
  const validateAndSanitizeInput = (message: string): string => {
    // Trim whitespace and limit length
    const trimmed = message.trim();
    if (trimmed.length > 500) {
      throw new Error('El mensaje es demasiado largo. Máximo 500 caracteres.');
    }
    if (trimmed.length < 2) {
      throw new Error('El mensaje es demasiado corto. Mínimo 2 caracteres.');
    }
    
    // Basic content filtering - block potentially malicious patterns
    const suspiciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /data:text\/html/gi,
      /vbscript:/gi
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(trimmed)) {
        throw new Error('El contenido contiene elementos no permitidos.');
      }
    }
    
    return DOMPurify.sanitize(trimmed, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  };

  const handleSend = async (message: string) => {
    try {
      // Validate and sanitize input
      const sanitizedMessage = validateAndSanitizeInput(message);
      
      setIsLoading(true);
      onSend(sanitizedMessage);

      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          message: sanitizedMessage,
          systemPrompt: DENTAXY_SYSTEM_PROMPT
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error('Error en la comunicación con el servidor');
      }

      const newMessage: ChatMessage = {
        role: 'assistant',
        content: data.response || 'Lo siento, no pude procesar tu consulta.',
        timestamp: new Date(),
        isTyping: true
      };
      setActiveResponse(newMessage);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: error instanceof Error ? error.message : 'Lo siento, ocurrió un error al procesar tu consulta. Por favor, intenta nuevamente.',
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

  return (
    <>
      <AnimatePresence>
        {isOpen && !isAnalysisMode && (
          <div 
            className="fixed bottom-0 left-0 right-0 z-[9998] flex justify-center pointer-events-none" 
            style={{ marginBottom: '120px' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              style={{
                width: 'min(45vw, 350px)',
                maxWidth: '350px'
              }}
            >
              <div className="pointer-events-auto bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-600/50 shadow-2xl p-3 relative">
                <button 
                  onClick={onClose} 
                  className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors z-10"
                >
                  <X className="w-4 h-4" />
                </button>
                <PromptInputBox 
                  onSend={handleSend} 
                  isLoading={isLoading} 
                  placeholder="Escribe un término médico..." 
                  className="bg-transparent border-transparent text-sm min-h-[48px] pr-8" 
                />
              </div>
            </motion.div>
          </div>
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
