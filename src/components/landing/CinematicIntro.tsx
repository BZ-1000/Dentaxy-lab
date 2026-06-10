import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro = ({ onComplete }: CinematicIntroProps) => {
  const phrases = [
    "Hola, doctor. Soy Dex.",
    "Conozco cada rincón de este ecosistema.",
    "Estoy aquí para diseñar tu entorno ideal.",
    "Comencemos con tres preguntas breves."
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentPhrase = phrases[currentPhraseIndex];

    if (!isDeleting) {
      // Escribiendo
      if (displayedText.length < currentPhrase.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentPhrase.substring(0, displayedText.length + 1));
        }, 40); // 40ms por caracter
      } else {
        // Frase completa
        if (currentPhraseIndex === phrases.length - 1) {
          // En la última frase, mostramos el botón y no borramos
          setShowButton(true);
        } else {
          // Esperar 1.8 segundos antes de empezar a borrar
          timer = setTimeout(() => {
            setIsDeleting(true);
          }, 1800);
        }
      }
    } else {
      // Borrando
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(displayedText.substring(0, displayedText.length - 1));
        }, 15); // Borrado ágil: 15ms por caracter
      } else {
        // Borrado terminado, pasar a la siguiente frase
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => prev + 1);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentPhraseIndex]);

  const handleStart = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 800); // 0.8s cubic-bezier
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center transition-opacity duration-800 ease-[cubic-bezier(0.25,1,0.5,1)] ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Estilos locales para las animaciones y el cursor de Dex */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes dex-cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes dex-logo-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}} />

      <div className="flex flex-col items-center justify-center max-w-xl px-6 text-center select-none">
        
        {/* Logo de DentaXy AI Centrado */}
        <div 
          className="mb-8"
          style={{ animation: "dex-logo-float 4s ease-in-out infinite" }}
        >
          <img 
            src="/lovable-uploads/3236de6d-a3e4-4b81-9c83-b32690d4212d.png" 
            alt="DentaXy" 
            className="w-16 h-16 md:w-20 md:h-20 object-contain animate-none"
          />
        </div>

        {/* Contenedor de Texto con Apple Typewriter */}
        <div className="min-h-[60px] flex items-center justify-center">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-800 tracking-tight leading-snug">
            {displayedText}
            <span 
              className="inline-block w-[3px] h-[1.1em] bg-[#2563eb] ml-1.5 align-middle"
              style={{ animation: "dex-cursor-blink 0.8s infinite" }}
            />
          </h2>
        </div>

        {/* Botón Circular Minimalista de Inicio */}
        <div className={`mt-8 transition-all duration-700 ${showButton ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
          <button
            onClick={handleStart}
            aria-label="Comenzar diagnóstico"
            className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-all duration-300 shadow-sm hover:shadow-md bg-white text-gray-500 group focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform duration-300" />
          </button>
        </div>

      </div>
    </div>
  );
};
