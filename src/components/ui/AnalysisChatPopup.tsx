
import { useState, useRef, useEffect } from 'react';
import { X, Bot, User } from 'lucide-react';
import { TypewriterEffect } from './TypewriterEffect';
import { PromptInputBox } from './ai-prompt-box';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface AnalysisChatPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialText?: string;
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

export function AnalysisChatPopup({ open, onOpenChange, initialText }: AnalysisChatPopupProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open && initialText && messages.length === 0) {
      sendMessage(initialText);
    }
  }, [open, initialText]);

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://www.dentaxy.com',
          'X-Title': 'DentaxyGPT - Análisis de Términos Odontológicos',
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
              content: `Define el término odontológico: "${userMessage}"`
            }
          ],
          temperature: 0.1,
          max_tokens: 200,
        })
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();
      let aiResponse = data.choices?.[0]?.message?.content || 'Lo siento, no pude procesar tu consulta. Por favor, reformula tu pregunta de manera más específica.';

      const typingMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        isTyping: true
      };
      setMessages(prev => [...prev, typingMessage]);

    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Error técnico temporal. Consulta directamente con un profesional odontológico.',
        timestamp: new Date(),
        isTyping: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypingComplete = (messageIndex: number) => {
    setMessages(prev => prev.map((msg, index) => 
      index === messageIndex ? { ...msg, isTyping: false } : msg
    ));
  };

  const clearChat = () => {
    setMessages([]);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/8d0bcc46-2c73-4647-8420-9aa25c312389.png" 
              alt="DentaxyGPT" 
              className="h-8 w-8" 
            />
            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Análisis de Términos
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Consulta términos odontológicos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button 
                onClick={clearChat}
                className="text-xs px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-full transition-colors"
              >
                Limpiar
              </button>
            )}
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-hidden">
          <div 
            ref={scrollRef}
            className="h-full overflow-y-auto p-6 space-y-4"
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <img 
                  src="/lovable-uploads/8d0bcc46-2c73-4647-8420-9aa25c312389.png" 
                  alt="DentaxyGPT" 
                  className="h-16 w-16 mb-4 opacity-50" 
                />
                <p className="text-slate-500 dark:text-slate-400">
                  Escribe un término odontológico para comenzar...
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    {message.role === 'user' ? (
                      <User className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                    ) : (
                      <img 
                        src="/lovable-uploads/8d0bcc46-2c73-4647-8420-9aa25c312389.png" 
                        alt="DentaxyGPT" 
                        className="h-6 w-6" 
                      />
                    )}
                  </div>
                  <div className={`max-w-[80%] ${message.role === 'user' ? 'mr-auto' : 'ml-auto'}`}>
                    <div className={`p-3 rounded-2xl ${
                      message.role === 'user' 
                        ? 'bg-black text-white' 
                        : 'bg-slate-100 dark:bg-slate-700'
                    }`}>
                      <div className="text-sm">
                        {message.role === 'assistant' && message.isTyping ? (
                          <TypewriterEffect 
                            text={message.content}
                            speed={25}
                            onComplete={() => handleTypingComplete(index)}
                          />
                        ) : (
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        )}
                      </div>
                    </div>
                    <div className={`text-xs text-slate-400 mt-1 ${
                      message.role === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/8d0bcc46-2c73-4647-8420-9aa25c312389.png" 
                    alt="DentaxyGPT" 
                    className="h-6 w-6" 
                  />
                </div>
                <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-500 border-t-transparent"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Analizando término...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-600">
          <PromptInputBox
            onSend={sendMessage}
            isLoading={isLoading}
            placeholder="Escribe un término odontológico..."
            className="!bg-slate-50 dark:!bg-slate-700 !border-slate-200 dark:!border-slate-600"
          />
        </div>
      </motion.div>
    </div>
  );
}
