
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Send, Bot, User, X, AlertTriangle, CheckCircle, Clock, Search, ArrowUp } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { TypewriterEffect } from "./ui/TypewriterEffect";
import { useAnalysisMode } from "@/contexts/AnalysisModeContext";

interface WikiSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  urgency?: 'low' | 'medium' | 'high' | 'emergency';
  isTyping?: boolean;
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

const loadingMessages = [
  "Analizando síntomas dentales...",
  "Consultando base de datos odontológica...",
  "Evaluando diagnóstico diferencial...",
  "Verificando protocolos de tratamiento...",
  "Revisando guías clínicas...",
  "Procesando información médica...",
  "Calculando nivel de urgencia...",
  "Preparando recomendaciones...",
  "Validando información clínica...",
  "Generando respuesta especializada...",
  "Accediendo a literatura médica...",
  "Cruzando datos de síntomas...",
  "Evaluando factores de riesgo...",
  "Analizando historial clínico...",
  "Consultando protocolos actualizados...",
  "Verificando contraindicaciones...",
  "Procesando datos clínicos...",
  "Elaborando diagnóstico diferencial...",
  "Revisando algoritmos de tratamiento...",
  "Finalizando análisis especializado..."
];

export function WikiSearch({ open, onOpenChange }: WikiSearchProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [hasGreeted, setHasGreeted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isAnalysisMode, setAnalysisMode } = useAnalysisMode();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
      
      if (!hasGreeted && messages.length === 0) {
        const greetingMessage: ChatMessage = {
          role: 'assistant',
          content: '¡Hola! Soy DentaxyGPT, tu asistente personal especializado en odontología. Estoy aquí para ayudarte con consultas sobre diagnósticos, tratamientos, urgencias dentales y farmacología básica.\n\n🟢 Nivel: Rutina\n\nPregúntame lo que necesites de forma específica y directa.',
          timestamp: new Date(),
          urgency: 'low'
        };
        setMessages([greetingMessage]);
        setHasGreeted(true);
      }
    }
  }, [open, hasGreeted, messages.length]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      let index = 0;
      setLoadingMessage(loadingMessages[0]);
      interval = setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[index]);
      }, 1200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  const getUrgencyIcon = (urgency?: string) => {
    switch (urgency) {
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'emergency':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const detectUrgency = (content: string): 'low' | 'medium' | 'high' | 'emergency' => {
    const emergencyKeywords = ['emergencia', '🚨', 'inmediata', 'grave', 'severo'];
    const highKeywords = ['urgencia', '🔴', '24 horas', 'urgente'];
    const mediumKeywords = ['preferente', '🟡', '1-3 días'];
    
    const lowerContent = content.toLowerCase();
    
    if (emergencyKeywords.some(keyword => lowerContent.includes(keyword))) return 'emergency';
    if (highKeywords.some(keyword => lowerContent.includes(keyword))) return 'high';
    if (mediumKeywords.some(keyword => lowerContent.includes(keyword))) return 'medium';
    return 'low';
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage = message.trim();
    setMessage("");

    if (inputRef.current) {
      inputRef.current.blur();
    }

    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const conversationHistory = messages
        .filter(msg => !(msg.role === 'assistant' && msg.content.includes('¡Hola! Soy DentaxyGPT')))
        .slice(-4)
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

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
          'X-Title': 'DentaxyGPT - Asistente Odontológico Especializado',
          'Origin': refererUrl
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.2-3b-instruct:free',
          messages: [
            {
              role: 'system',
              content: DENTAXY_SYSTEM_PROMPT
            },
            ...conversationHistory,
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.1,
          max_tokens: 200,
          top_p: 0.7,
          frequency_penalty: 0.6,
          presence_penalty: 0.4
        })
      });

      if (!response.ok) {
        let errorMessage = 'Error técnico temporal. Consulta directamente con un profesional odontológico.';
        
        if (response.status === 401) {
          errorMessage = 'Error de autenticación API. Verificando credenciales...';
        } else if (response.status === 429) {
          errorMessage = 'Servicio temporalmente saturado. Intenta en unos momentos.';
        } else if (response.status >= 500) {
          errorMessage = 'Servidor temporalmente no disponible. Consulta con un profesional.';
        } else if (response.status === 0 || !response.status) {
          errorMessage = 'Error de conexión. Verifica tu conexión a internet y el dominio.';
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      let aiResponse = data.choices?.[0]?.message?.content || 'Lo siento, no pude procesar tu consulta. Por favor, reformula tu pregunta de manera más específica.';

      aiResponse = aiResponse.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      const urgency = detectUrgency(aiResponse);

      const typingMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        urgency,
        isTyping: true
      };
      setMessages(prev => [...prev, typingMessage]);

    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: error instanceof Error ? error.message : 'Error técnico temporal. Consulta directamente con un profesional odontológico. Si es emergencia, acude al servicio de urgencias.',
        timestamp: new Date(),
        urgency: 'medium',
        isTyping: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setHasGreeted(false);
  };

  const handleTypingComplete = (messageIndex: number) => {
    setMessages(prev => prev.map((msg, index) => 
      index === messageIndex ? { ...msg, isTyping: false } : msg
    ));
  };

  const toggleAnalysisMode = () => {
    setAnalysisMode(!isAnalysisMode);
    if (!isAnalysisMode) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100">
            <img 
              src="/lovable-uploads/8d0bcc46-2c73-4647-8420-9aa25c312389.png" 
              alt="DentaxyGPT" 
              className="h-8 w-8" 
            />
            <div className="flex flex-col">
              <span>DentaxyGPT</span>
              <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                Asistente Odontológico Rápido y Preciso
              </span>
            </div>
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={isAnalysisMode ? "default" : "outline"}
              size="sm"
              onClick={toggleAnalysisMode}
              className={`text-xs transition-all duration-200 ${
                isAnalysisMode 
                  ? 'bg-black hover:bg-gray-800 text-white' 
                  : 'bg-black hover:bg-gray-800 text-white'
              }`}
            >
              <Search className="h-4 w-4 mr-1" />
              {isAnalysisMode ? 'Modo Análisis ON' : 'Análisis de Términos'}
            </Button>
            {messages.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearChat} 
                className="text-xs hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Limpiar chat
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-6 rounded-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border shadow-inner" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <img 
                src="/lovable-uploads/8d0bcc46-2c73-4647-8420-9aa25c312389.png" 
                alt="DentaxyGPT" 
                className="h-16 w-16 mb-6" 
              />
              <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-100">
                Iniciando DentaxyGPT...
              </h3>
              <p className="text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
                Preparando tu asistente odontológico personal...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {msg.role === 'user' ? null : (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-md">
                      <img 
                        src="/lovable-uploads/8d0bcc46-2c73-4647-8420-9aa25c312389.png" 
                        alt="DentaxyGPT" 
                        className="h-8 w-8" 
                      />
                    </div>
                  )}
                  <div className={`max-w-[75%] ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                    <div className={`p-4 rounded-2xl shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-black text-white' 
                        : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600'
                    }`}>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {msg.role === 'assistant' && msg.isTyping ? (
                            <TypewriterEffect 
                              text={msg.content}
                              speed={25}
                              onComplete={() => handleTypingComplete(index)}
                            />
                          ) : msg.role === 'assistant' ? (
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          ) : (
                            msg.content
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 mt-2 text-xs ${
                      msg.role === 'user' 
                        ? 'text-blue-600 dark:text-blue-400 justify-end' 
                        : 'text-slate-500 dark:text-slate-400 justify-start'
                    }`}>
                      {msg.role === 'assistant' && msg.urgency && getUrgencyIcon(msg.urgency)}
                      <span>{msg.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-md">
                    <img 
                      src="/lovable-uploads/8d0bcc46-2c73-4647-8420-9aa25c312389.png" 
                      alt="DentaxyGPT" 
                      className="h-8 w-8" 
                    />
                  </div>
                  <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-500 border-t-transparent"></div>
                      <span className="text-sm text-slate-600 dark:text-slate-300 animate-pulse">
                        {loadingMessage}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <div className="p-4">
          <div className="relative flex items-center bg-white dark:bg-slate-700 rounded-full border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow duration-200">
            <Input
              ref={inputRef}
              placeholder="Pregunta específica sobre odontología..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1 border-0 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full px-6 py-3"
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !message.trim()} 
              className="absolute right-2 h-10 w-10 rounded-full bg-white hover:bg-gray-50 text-black shadow-sm p-0 transition-all duration-200 hover:scale-105 border"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="px-4 pb-2">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span>
              <strong>Importante:</strong> Información orientativa. Consulta siempre con un profesional para diagnósticos definitivos.
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
