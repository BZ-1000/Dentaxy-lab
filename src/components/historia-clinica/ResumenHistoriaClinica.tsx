
import { useTheme } from "@/hooks/use-theme";
import { useState, useEffect } from "react";
import { Typewriter } from "@/components/ui/typewriter-text";

interface ResumenHistoriaClinicaProps {
  resumen: string;
}

const ResumenHistoriaClinica = ({ resumen }: ResumenHistoriaClinicaProps) => {
  const { theme } = useTheme();
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (resumen) {
      setIsTyping(true);
    }
  }, [resumen]);

  if (!resumen) return null;

  return (
    <div className="mt-8 animate-fade-in">
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90 transition-colors duration-200`}>
        <h2 className={`text-2xl font-semibold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
          Historia Clínica Generada con IA
        </h2>
        <div className="prose dark:prose-invert max-w-none">
          <pre className={`whitespace-pre-line ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} p-6 rounded-lg text-sm transition-colors duration-200`}>
            {isTyping ? (
              <Typewriter 
                text={resumen} 
                speed={5}
                cursor=""
                delay={10}
                onComplete={() => setIsTyping(false)}
              />
            ) : (
              resumen
            )}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ResumenHistoriaClinica;
