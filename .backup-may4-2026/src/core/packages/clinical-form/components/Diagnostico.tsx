
import React, { useState } from 'react';
import { Minus, Maximize2, X, Copy, CheckCircle } from "lucide-react";
import { FormDataState } from '../types/historiaClinica';
import { Textarea } from "@/components/ui/textarea";

interface DiagnosticoProps {
  formData: FormDataState;
  handleDiagnosticoChange: (part: string, value: string | boolean) => void;
}

const Diagnostico: React.FC<DiagnosticoProps> = ({
  formData,
  handleDiagnosticoChange
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [diagnosticoText, setDiagnosticoText] = useState("");
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
    
    if (diagnosticoText) {
      navigator.clipboard.writeText(diagnosticoText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <div className="w-full bg-transparent">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center w-full">
            

          <div className="flex items-center gap-1 sm:gap-2">
            
            
            
          </div>
        </div>{/* cierra flex justify-center */}
        </div>

        <div className="flex justify-start px-6 py-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">XIX.</span> DIAGNÓSTICO
          </h2>
        </div>

        {!isMinimized && (
          <div className="p-6">
            <div className="relative">
              <Textarea
                value={diagnosticoText}
                onChange={(e) => setDiagnosticoText(e.target.value)}
                placeholder="Escriba el diagnóstico aquí..."
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

export default Diagnostico;
