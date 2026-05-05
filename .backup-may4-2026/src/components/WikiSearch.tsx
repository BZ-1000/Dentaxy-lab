
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Send, Bot, User, X, AlertTriangle, CheckCircle, Clock, Search, ArrowUp } from "lucide-react";
import { TypewriterEffect } from "./ui/TypewriterEffect";
import { useAnalysisMode } from "@/contexts/AnalysisModeContext";
import { supabase } from "@/integrations/supabase/client";

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

const loadingMessages = [
  "Buscando en la base de datos dental...",
  "Analizando términos odontológicos...",
  "Consultando definiciones especializadas...",
  "Procesando información clínica...",
  "Revisando sinónimos y contextos...",
  "Preparando respuesta especializada...",
  "Organizando resultados por relevancia...",
  "Validando información odontológica...",
  "Estructurando respuesta final...",
  "Finalizando búsqueda especializada..."
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
          content: '¡Hola! Soy DentaxyGPT, tu asistente especializado en terminología odontológica.\n\nPuedo ayudarte a:\n🔍 Buscar definiciones de términos dentales\n📚 Encontrar sinónimos y contextos\n🦷 Explicar conceptos odontológicos\n📋 Identificar en qué sección del formulario se aplican\n\n¿Qué término te gustaría consultar?',
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
      }, 800);
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
      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          message: userMessage
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error('Error en la comunicación con el servidor');
      }

      const aiResponse = data.response || 'Lo siento, no pude procesar tu consulta.';
      const urgency = 'low'; // Base de datos local siempre es rutina

      const typingMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        urgency,
        isTyping: true
      };
      setMessages(prev => [...prev, typingMessage]);

    } catch (error) {
      console.error('Error calling chat function:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: '❌ **Error de conexión**\n\nNo fue posible procesar tu consulta. Por favor, verifica tu conexión a internet e intenta nuevamente.',
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
                Base de Datos Dental Local
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
                Preparando tu consultor de terminología dental...
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
                        <div className="whitespace-pre-line leading-relaxed">
                          {msg.role === 'assistant' && msg.isTyping ? (
                            <TypewriterEffect 
                              text={msg.content}
                              speed={15}
                              onComplete={() => handleTypingComplete(index)}
                            />
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
              placeholder="Pregunta sobre terminología dental..."
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
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <CheckCircle className="h-4 w-4 text-blue-500" />
            <span>
              <strong>Base de datos local:</strong> Información verificada y especializada en odontología.
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
