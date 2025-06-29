import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PromptInputBox } from './ai-prompt-box';
import { TypewriterEffect } from './TypewriterEffect';
import { useAnalysisMode } from '@/contexts/AnalysisModeContext';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
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
function ResponsePopup({
  message,
  onClose
}: ResponsePopupProps) {
  return <motion.div initial={{
    opacity: 0,
    y: 20,
    scale: 0.95
  }} animate={{
    opacity: 1,
    y: 0,
    scale: 1
  }} exit={{
    opacity: 0,
    y: 20,
    scale: 0.95
  }} className="fixed top-4 right-4 z-[9999] max-w-md">
      <div className="backdrop-blur-md border border-gray-600 rounded-2xl p-4 shadow-2xl bg-gray-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/8d0bcc46-2c73-4647-8420-9aa25c312389.png" alt="DentaxyGPT" className="h-6 w-6" />
            <span className="text-white text-sm font-medium">DentaxyGPT</span>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="text-white text-sm">
          {message.isTyping ? <TypewriterEffect text={message.content} speed={15} /> : <p className="whitespace-pre-line">{message.content}</p>}
        </div>
        
        <div className="text-gray-300 text-xs mt-2">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </motion.div>;
}
export function FloatingChatInput({
  isOpen,
  onClose,
  onSend
}: FloatingChatInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeResponse, setActiveResponse] = useState<ChatMessage | null>(null);
  const {
    isAnalysisMode
  } = useAnalysisMode();
  const handleSend = async (message: string) => {
    setIsLoading(true);
    onSend(message);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('chat', {
        body: {
          message: message
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
        content: '❌ **Error de conexión**\n\nNo fue posible procesar tu consulta. Verifica tu conexión a internet e intenta nuevamente.',
        timestamp: new Date(),
        isTyping: true
      };
      setActiveResponse(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const closeResponse = () => {
    setActiveResponse(null);
  };
  return <>
      <AnimatePresence>
        {isOpen && !isAnalysisMode && <div className="fixed bottom-0 left-0 right-0 z-[9998] flex justify-center pointer-events-none" style={{
        marginBottom: '120px'
      }}>
            <motion.div initial={{
          opacity: 0,
          y: 20,
          scale: 0.95
        }} animate={{
          opacity: 1,
          y: 0,
          scale: 1
        }} exit={{
          opacity: 0,
          y: 20,
          scale: 0.95
        }} style={{
          width: 'min(45vw, 350px)',
          maxWidth: '350px'
        }}>
              <div className="pointer-events-auto bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-600/50 shadow-2xl p-3 relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors z-10">
                  <X className="w-4 h-4" />
                </button>
                
                {/* Etiqueta versión experimental */}
                <div className="absolute -top-2 left-4 text-xs text-emerald-400 rounded-full font-medium shadow-sm px-[8px] py-0 my-[10px] bg-transparent mx-0">versión experimental</div>
                
                <PromptInputBox onSend={handleSend} isLoading={isLoading} placeholder="Escribe un término médico..." className="bg-transparent border-transparent text-sm min-h-[48px] pr-8" />
              </div>
            </motion.div>
          </div>}
      </AnimatePresence>

      <AnimatePresence>
        {activeResponse && <ResponsePopup message={activeResponse} onClose={closeResponse} />}
      </AnimatePresence>
    </>;
}