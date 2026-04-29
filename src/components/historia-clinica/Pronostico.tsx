
import React, { useState } from 'react';
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
      <div className="w-full bg-transparent">

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
      </div>
    </div>
  );
};

export default Pronostico;
