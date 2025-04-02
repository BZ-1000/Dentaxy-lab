
import { useTheme } from "@/hooks/use-theme";
import { useEffect, useState, useRef } from "react";

interface ResumenHistoriaClinicaProps {
  resumen: string;
}

const ResumenHistoriaClinica = ({ resumen }: ResumenHistoriaClinicaProps) => {
  const { theme } = useTheme();
  const [animatedText, setAnimatedText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (resumen && !isAnimating) {
      setIsAnimating(true);
      setAnimatedText("");
      
      let i = 0;
      const speed = Math.max(5, 50 / (resumen.length / 200)); // Adjust speed based on text length
      
      clearInterval(animationRef.current);
      
      // Auto-scroll to the top of the container when animation starts
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      
      animationRef.current = setInterval(() => {
        if (i < resumen.length) {
          setAnimatedText(prev => prev + resumen.charAt(i));
          i++;
        } else {
          clearInterval(animationRef.current);
          setIsAnimating(false);
        }
      }, speed);
    }
    
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [resumen]);

  if (!resumen) return null;

  return (
    <div className="mt-8 animate-fade-in" ref={containerRef}>
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90 transition-colors duration-200`}>
        <h2 className={`text-2xl font-semibold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
          Historia Clínica Generada con IA
        </h2>
        <div className="prose dark:prose-invert max-w-none">
          <pre className={`whitespace-pre-line ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} p-6 rounded-lg text-sm transition-colors duration-200 text-justify`}>
            {isAnimating ? animatedText : resumen}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ResumenHistoriaClinica;
