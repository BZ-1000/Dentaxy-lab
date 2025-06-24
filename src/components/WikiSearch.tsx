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

const DENTAXY_SYSTEM_PROMPT = `Eres DentaxyGPT, un asistente de inteligencia artificial especializado en odontología y medicina oral. Tu misión es proporcionar información médica precisa, confiable y actualizada en el campo odontológico.

**Tu identidad y presentación:**
- Siempre te presentas como "DentaxyGPT, tu asistente odontológico especializado"
- Eres profesional, empático y preciso en tus respuestas
- Mantienes un enfoque clínico pero accesible para pacientes y profesionales

**Tu conocimiento especializado incluye:**
- Anatomía dental y estructuras orales (dientes, encías, periodonto, ATM)
- Patologías orales: caries, gingivitis, periodontitis, pulpitis, abscesos, lesiones de mucosa oral
- Emergencias odontológicas: traumatismos, infecciones severas, hemorragias, luxaciones
- Farmacología odontológica: antibióticos, analgésicos, anestésicos locales
- Procedimientos: endodoncia, periodoncia, cirugía oral, prótesis, ortodoncia
- Prevención: higiene oral, flúor, selladores, dieta y salud oral
- Radiología dental: interpretación de radiografías periapicales, panorámicas, CBCT

**Estructura de tus respuestas:**
1. **Saludo profesional** (solo en la primera interacción)
2. **Análisis de los síntomas** presentados
3. **Posibles diagnósticos** (diagnóstico diferencial cuando sea apropiado)
4. **Nivel de urgencia** usando estos íconos:
   - 🟢 Consulta de rutina (puede esperar días/semanas)
   - 🟡 Consulta preferente (dentro de 1-3 días)
   - 🔴 Urgencia (dentro de 24 horas)
   - 🚨 Emergencia (atención inmediata)
5. **Recomendaciones de tratamiento** inicial o medidas de alivio
6. **Cuándo buscar atención profesional** específica
7. **Medidas preventivas** cuando sea relevante

**Limitaciones importantes:**
- NO puedes diagnosticar definitivamente (solo sugerir posibilidades)
- NO puedes prescribir medicamentos (solo mencionar opciones que el dentista podría considerar)
- SIEMPRE recomiendas consulta profesional para confirmación diagnóstica
- Para emergencias médicas graves, recomiendas acudir al servicio de urgencias

**Responde SIEMPRE en español** con terminología médica apropiada pero explicada de manera comprensible.

Recuerda: Tu información es orientativa y educativa. La consulta con un profesional odontológico es indispensable para un diagnóstico y tratamiento adecuados.`;

export function WikiSearch({
  open,
  onOpenChange
}: WikiSearchProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
      // Prepare conversation context (last 10 messages for context)
      const conversationHistory = messages.slice(-10).map(msg => ({
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
          model: 'google/gemma-3n-e4b-it:free',
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
          temperature: 0.4, // Reduced for more consistent, precise responses
          max_tokens: 1500, // Increased for more detailed responses
          top_p: 0.9,
          frequency_penalty: 0.3, // Reduce repetition
          presence_penalty: 0.1 // Encourage diverse vocabulary
        })
      });

      if (!response.ok) {
        throw new Error(`Error de API: ${response.status}`);
      }

      const data = await response.json();
      let aiResponse = data.choices[0]?.message?.content || 'Lo siento, no pude procesar tu consulta. Por favor, reformula tu pregunta.';

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
        content: 'Disculpa, estoy experimentando dificultades técnicas en este momento. Como DentaxyGPT, te recomiendo que consultes directamente con un profesional odontológico para tu consulta. Si es una emergencia, no dudes en acudir al servicio de urgencias más cercano.',
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
              src="/lovable-uploads/f3d0d575-258c-44ef-a500-2a819a3d7043.png" 
              alt="DentaxyGPT" 
              className="h-8 w-8 rounded-lg shadow-md" 
            />
            <div className="flex flex-col">
              <span>DentaxyGPT</span>
              <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                Asistente Odontológico Especializado
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
              <div className="bg-gradient-to-br from-blue-500 to-emerald-500 p-4 rounded-2xl shadow-lg mb-6">
                <img 
                  src="/lovable-uploads/f3d0d575-258c-44ef-a500-2a819a3d7043.png" 
                  alt="DentaxyGPT" 
                  className="h-12 w-12" 
                />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-100">
                ¡Hola! Soy DentaxyGPT
              </h3>
              <p className="text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
                Tu asistente odontológico especializado. Puedo ayudarte con consultas sobre síntomas dentales, 
                diagnósticos preliminares, tratamientos, emergencias odontológicas y prevención oral.
              </p>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Recuerda:</strong> Mi información es orientativa. Siempre consulta con un profesional para diagnósticos definitivos.
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
                      : 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white'
                  }`}>
                    {msg.role === 'user' ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <img 
                        src="/lovable-uploads/f3d0d575-258c-44ef-a500-2a819a3d7043.png" 
                        alt="DentaxyGPT" 
                        className="h-5 w-5" 
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
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-md">
                    <img 
                      src="/lovable-uploads/f3d0d575-258c-44ef-a500-2a819a3d7043.png" 
                      alt="DentaxyGPT" 
                      className="h-5 w-5" 
                    />
                  </div>
                  <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-500 border-t-transparent"></div>
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        DentaxyGPT está analizando tu consulta...
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
              placeholder="Describe tus síntomas o consulta odontológica..."
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
              <strong>Importante:</strong> Esta información es orientativa y educativa. 
              Para diagnósticos definitivos y tratamientos, consulta siempre con un profesional odontológico.
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
