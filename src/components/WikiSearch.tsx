
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Send, Bot, User, X, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

interface WikiSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  urgency?: 'low' | 'medium' | 'high' | 'emergency';
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
  "Generando respuesta especializada..."
];

export function WikiSearch({
  open,
  onOpenChange
}: WikiSearchProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Cycling loading messages
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

    // Add user message to chat
    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Prepare conversation context (last 6 messages for context)
      const conversationHistory = messages.slice(-6).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'DentaxyGPT - Asistente Odontológico Especializado'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1-distill-qwen-14b:free',
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
          temperature: 0.2, // Reduced for more focused responses
          max_tokens: 300, // Reduced for concise answers
          top_p: 0.8,
          frequency_penalty: 0.5, // Higher to reduce repetition
          presence_penalty: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`Error de API: ${response.status}`);
      }

      const data = await response.json();
      let aiResponse = data.choices[0]?.message?.content || 'Lo siento, no pude procesar tu consulta. Por favor, reformula tu pregunta de manera más específica.';

      // Detect urgency level from AI response
      const urgency = detectUrgency(aiResponse);

      // Add AI response to chat
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        urgency
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Error técnico temporal. Consulta directamente con un profesional odontológico. Si es emergencia, acude al servicio de urgencias.',
        timestamp: new Date(),
        urgency: 'medium'
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
        </DialogHeader>
        
        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-6 rounded-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border shadow-inner" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <img 
                src="/lovable-uploads/8d0bcc46-2c73-4647-8420-9aa25c312389.png" 
                alt="DentaxyGPT" 
                className="h-16 w-16 mb-6" 
              />
              <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-100">
                ¡Hola! Soy DentaxyGPT
              </h3>
              <p className="text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
                Tu asistente odontológico rápido y preciso. Pregúntame directamente sobre síntomas dentales, 
                urgencias o tratamientos. Respondo de forma concisa y al grano.
              </p>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Optimizado para respuestas rápidas:</strong> Pregunta específicamente lo que necesitas saber.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                      : 'bg-white dark:bg-slate-700'
                  }`}>
                    {msg.role === 'user' ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <img 
                        src="/lovable-uploads/8d0bcc46-2c73-4647-8420-9aa25c312389.png" 
                        alt="DentaxyGPT" 
                        className="h-8 w-8" 
                      />
                    )}
                  </div>
                  <div className={`max-w-[75%] ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                    <div className={`p-4 rounded-2xl shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                        : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600'
                    }`}>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {msg.content}
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

        {/* Input Area */}
        <div className="p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-600 shadow-lg">
          <div className="flex gap-3">
            <Input
              ref={inputRef}
              placeholder="Pregunta específica sobre odontología..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !message.trim()} 
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Enhanced Disclaimer */}
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
