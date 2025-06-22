
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Send, Bot, User, X } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

interface WikiSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function WikiSearch({ open, onOpenChange }: WikiSearchProps) {
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
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Dentaxy Medical AI'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          messages: [
            {
              role: 'system',
              content: 'Eres un asistente médico especializado en odontología y medicina general. Proporcionas información médica precisa, diagnósticos preliminares y recomendaciones de tratamiento. Siempre recuerda que tu información no reemplaza la consulta médica profesional. Responde en español de manera clara y profesional.'
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'Lo siento, no pude procesar tu consulta.';

      // Add AI response to chat
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Lo siento, ocurrió un error al procesar tu consulta. Por favor, intenta nuevamente.',
        timestamp: new Date()
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
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <Bot className="h-6 w-6" />
            IA Médico - Asistente Odontológico
          </DialogTitle>
          {messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              className="text-xs"
            >
              Limpiar chat
            </Button>
          )}
        </DialogHeader>
        
        {/* Chat Messages */}
        <ScrollArea 
          className="flex-1 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 border"
          ref={scrollRef}
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-neutral-500">
              <Bot className="h-12 w-12 mb-4 text-blue-400" />
              <h3 className="text-lg font-medium mb-2">¡Hola! Soy tu asistente médico</h3>
              <p className="text-sm max-w-md">
                Puedes preguntarme sobre síntomas, diagnósticos, tratamientos odontológicos, 
                medicamentos y cualquier consulta médica general. ¿En qué puedo ayudarte hoy?
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white ml-auto'
                        : 'bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    <div
                      className={`text-xs mt-2 opacity-70 ${
                        msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500" />
                      <span className="text-sm text-gray-500">Pensando...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="flex gap-2 p-4 bg-gray-50 dark:bg-neutral-900 rounded-lg border">
          <Input
            ref={inputRef}
            placeholder="Escribe tu consulta médica aquí..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage}
            disabled={isLoading || !message.trim()}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Disclaimer */}
        <div className="text-xs text-gray-500 text-center px-4 pb-2">
          ⚠️ Esta información es solo orientativa. Siempre consulta con un profesional médico para diagnósticos y tratamientos.
        </div>
      </DialogContent>
    </Dialog>
  );
}
