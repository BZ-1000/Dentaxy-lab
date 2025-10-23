
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X, Copy, CheckCircle } from "lucide-react";
import { FormDataState } from '@/types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";

interface PronosticoProps {
  formData: FormDataState;
  handlePronosticoChange: (part: string, value: string | boolean) => void;
}

const Pronostico: React.FC<PronosticoProps> = ({
  formData,
  handlePronosticoChange
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [pronosticoText, setPronosticoText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    setIsMaximized(false);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsMinimized(false);
    setIsMaximized(false);
  };

  const handleCopy = async () => {
    try {
      const { trackCopyClick } = await import('@/utils/trackCopyClick');
      trackCopyClick();
    } catch (error) {
      console.error('Error tracking copy:', error);
    }
    
    if (pronosticoText) {
      navigator.clipboard.writeText(pronosticoText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-0.5 sm:p-1">
              <button className="px-3 sm:px-5 py-1 sm:py-1.5 rounded-full transition-all duration-300 text-xs sm:text-sm bg-blue-500 text-white shadow-md">
                Formulario
              </button>
              <button className="px-3 sm:px-5 py-1 sm:py-1.5 rounded-full transition-all duration-300 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                Redacción IA
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={handleMinimize} className="p-0.5 sm:p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button onClick={handleMaximize} className="p-0.5 sm:p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors">
              <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button onClick={handleClose} className="p-0.5 sm:p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        <div className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">XX.</span> PRONÓSTICO
          </h2>
        </div>

        {!isMinimized && (
          <div className="p-6">
            <div className="relative">
              <Textarea
                value={pronosticoText}
                onChange={(e) => setPronosticoText(e.target.value)}
                placeholder="Escriba el pronóstico aquí..."
                className="min-h-[200px] pr-12 resize-none"
              />
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={copied ? "Copiado" : "Copiar"}
              >
                {copied ? (
                  <CheckCircle className="h-5 w-5 text-green-500 animate-scale-in" />
                ) : (
                  <Copy className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Pronostico;
