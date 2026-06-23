import React, { useState, useEffect, useRef } from 'react';
import { Send, ChevronDown, Check } from 'lucide-react';
import { CLIQuestion } from './useFormCLI';

interface SeedFormConsoleProps {
  question: CLIQuestion | null;
  onSubmit: (answer: string | number) => void;
  onPrev?: () => void;
  canGoPrev?: boolean;
}

export default function SeedFormConsole({ question, onSubmit, onPrev, canGoPrev }: SeedFormConsoleProps) {
  const [selectedOption, setSelectedOption] = useState<number | string | null>(null);
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Reset local state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setInputText(question?.defaultValue?.toString() || '');
    if (question?.type === 'text') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [question]);

  // Keyboard navigation for options
  useEffect(() => {
    if (!question || question.type !== 'options' || !question.options) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Find numbers 1-9
      const num = parseInt(e.key);
      if (!isNaN(num) && num > 0 && num <= (question.options?.length || 0)) {
        const opt = question.options![num - 1];
        setSelectedOption(opt.id);
        onSubmit(opt.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question, onSubmit]);

  const handleTextSubmit = () => {
    if (inputText.trim()) {
      onSubmit(inputText.trim());
      setInputText('');
    }
  };

  if (!question) return null;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[800px] z-50">
      <div className="mx-auto w-[65%] min-w-[400px] bg-white dark:bg-zinc-900 rounded-[20px] shadow-[0_8px_24px_-4px_rgba(0,0,0,0.4)] border border-black/5 flex flex-col overflow-hidden transition-all duration-300">
        
        {/* Header - Terminal Style */}
        <div className="flex items-center justify-between w-full h-6 px-[18px] pb-1 border-b border-black/[0.06] mb-0.5 mt-2">
          <div className="flex items-center gap-2 text-[9.5px] font-bold text-slate-400 tracking-wider uppercase">
            <span>Dentaxy AI — Expediente Clínico</span>
          </div>
          <ChevronDown size={13} className="text-slate-300" />
        </div>

        <div className="flex-1 overflow-y-auto px-[18px] py-2 flex flex-col justify-start">
          {/* Question Text */}
          <div className="text-[19px] sm:text-[20px] font-medium text-slate-700 dark:text-zinc-200 leading-snug tracking-tight mb-4">
            {question.text}
          </div>

          {/* Options Render */}
          {question.type === 'options' && question.options && (
            <div className="flex flex-col gap-1.5 w-full pb-4">
              {question.options.map((opt, idx) => {
                const isSelected = selectedOption === opt.id;
                return (
                  <div 
                    key={opt.id}
                    onClick={() => {
                      setSelectedOption(opt.id);
                      onSubmit(opt.id);
                    }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg border text-left cursor-pointer transition-all duration-150 ${
                      isSelected 
                        ? 'bg-zinc-50 border-zinc-200 text-slate-800 shadow-sm' 
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-zinc-50/50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded text-[11px] font-semibold border flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'bg-zinc-200 text-zinc-800 border-zinc-300 font-extrabold shadow-sm' 
                        : 'bg-zinc-100 text-zinc-500 border-zinc-200 font-normal'
                    }`}>
                      {idx + 1}
                    </div>
                    <span className="text-[12.5px] font-medium">
                      {opt.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Text Input Render */}
          {question.type === 'text' && (
            <div className="w-full flex items-end gap-2 pb-3">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleTextSubmit();
                  }
                }}
                placeholder={question.placeholder || 'Escribe tu respuesta...'}
                className="w-full max-h-[120px] min-h-[44px] bg-transparent resize-none outline-none text-[14px] text-slate-700 dark:text-zinc-200 placeholder:text-slate-400 py-3 scrollbar-none"
                rows={1}
              />
              <button 
                onClick={handleTextSubmit}
                disabled={!inputText.trim()}
                className="mb-2 w-8 h-8 rounded-full bg-[#0ecf8e] text-white flex items-center justify-center hover:bg-[#25dba0] disabled:opacity-50 disabled:bg-zinc-200 disabled:text-zinc-400 transition-all shadow-sm"
              >
                <Send size={14} className="ml-0.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Back button outside the console */}
      {canGoPrev && (
        <div className="w-full flex justify-center mt-3">
          <button
            onClick={onPrev}
            className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 dark:text-zinc-500 transition-all cursor-pointer bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full border border-black/5"
          >
            ← Volver a la pregunta anterior
          </button>
        </div>
      )}
    </div>
  );
}
