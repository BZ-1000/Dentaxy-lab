
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

const DENTAXY_SYSTEM_PROMPT = `Eres DentaxyGPT, un asistente de inteligencia artificial especializado en odontología. 

IMPORTANTE: 
- Responde SIEMPRE en español
- Sé DIRECTO y CONCISO
- Responde únicamente lo que se pregunta, sin información adicional
- Máximo 150 palabras por respuesta
- Ve al grano inmediatamente

Tu especialidad:
- Diagnósticos diferenciales rápidos
- Tratamientos específicos
- Urgencias odontológicas
- Farmacología dental básica

Estructura de respuesta:
1. Respuesta directa a la pregunta
2. Nivel de urgencia: 🟢 Rutina | 🟡 Preferente | 🔴 Urgencia | 🚨 Emergencia
3. Acción recomendada (máximo 1 línea)

Limitaciones:
- NO diagnostiques definitivamente
- NO prescribas medicamentos
- Siempre recomienda consulta profesional para confirmación

Responde de forma precisa y sin rodeos.`;

export function FloatingChatInput({ isOpen, onClose, onSend }: FloatingChatInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeResponse, setActiveResponse] = useState<ChatMessage | null>(null);
  const { isAnalysisMode, setAnalysisMode } = useAnalysisMode();

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);
    onSend(message);

    try {
      const currentDomain = window.location.hostname;
      let refererUrl = 'https://www.dentaxy.com';
      
      if (currentDomain.includes('dentaxy.com')) {
        refererUrl = currentDomain.includes('www.') ? 'https://www.dentaxy.com' : 'https://dentaxy.com';
      }

      // Detectar si es una consulta de análisis
      const isAnalysisQuery = message.includes('[Análisis:');
      let systemPrompt = DENTAXY_SYSTEM_PROMPT;
      
      if (isAnalysisQuery) {
        systemPrompt = `Eres DentaxyGPT, especializado en definiciones médicas odontológicas precisas.

IMPORTANTE:
- Responde SIEMPRE en español
- Proporciona definiciones claras y concisas
- Máximo 80 palabras por respuesta
- Incluye ejemplos relevantes cuando sea apropiado

Para términos médicos/odontológicos:
1. Definición precisa
2. Contexto clínico relevante
3. Ejemplo de uso (si aplica)

Mantén las respuestas breves y directas.`;
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
          'HTTP-Referer': refererUrl,
          'X-Title': 'DentaxyGPT - Asistente Odontológico Especializado',
          'Origin': refererUrl
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.2-3b-instruct:free',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.1,
          max_tokens: isAnalysisQuery ? 120 : 200,
          top_p: 0.7,
          frequency_penalty: 0.6,
          presence_penalty: 0.4
        })
      });

      if (!response.ok) {
        throw new Error('Error en la consulta. Intenta nuevamente.');
      }

      const data = await response.json();
      let aiResponse = data.choices?.[0]?.message?.content || 'Lo siento, no pude procesar tu consulta. Por favor, reformula tu pregunta de manera más específica.';

      aiResponse = aiResponse.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

      const typingMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        isTyping: true
      };
      setActiveResponse(typingMessage);
      onClose(); // Cerrar el input después de enviar

    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Error técnico temporal. Consulta directamente con un profesional odontológico.',
        timestamp: new Date(),
        isTyping: true
      };
      setActiveResponse(errorMessage);
      onClose();
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
          <span className="text-sm font-medium">🔍 Modo Análisis Activo - Selecciona cualquier término</span>
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
            className="fixed bottom-0 z-[9998] pointer-events-none"
            style={{
              marginBottom: '120px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(45vw, 350px)',
              maxWidth: '350px'
            }}
          >
            <div className="pointer-events-auto bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-600/50 shadow-2xl p-3">
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
