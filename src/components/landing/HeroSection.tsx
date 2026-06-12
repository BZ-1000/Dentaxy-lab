import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FutureButton } from "@/components/ui/FutureButton";


interface HeroSectionProps {
  onExplore?: () => void;
}
export const HeroSection = ({
  onExplore
}: HeroSectionProps) => {
  const fullText = "Más tiempo. Más tecnología. Más control. No es un software. Es Dentaxy.";
  const [currentText, setCurrentText] = useState("");
  const [animTrigger, setAnimTrigger] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Disparar animación mecánica al cargar la página y en bucle continuo cada 10 segundos
  useEffect(() => {
    setAnimTrigger(1);
    const interval = setInterval(() => {
      setAnimTrigger(prev => prev + 1);
    }, 10000); // 10 segundos
    return () => clearInterval(interval);
  }, []);

  // Control bidireccional del typewriter con pausa de 10 segundos al completarse
  useEffect(() => {
    if (!isDeleting) {
      // Escribiendo la frase
      if (currentText.length < fullText.length) {
        const timer = setTimeout(() => {
          setCurrentText(fullText.substring(0, currentText.length + 1));
        }, 60); // 60ms por carácter al escribir
        return () => clearTimeout(timer);
      } else {
        // Frase completada, esperar 10 segundos antes de comenzar a borrar
        const timer = setTimeout(() => {
          setIsDeleting(true);
        }, 10000);
        return () => clearTimeout(timer);
      }
    } else {
      // Borrando la frase
      if (currentText.length > 0) {
        const timer = setTimeout(() => {
          setCurrentText(fullText.substring(0, currentText.length - 1));
        }, 20); // 20ms por carácter al borrar (retroceso rápido)
        return () => clearTimeout(timer);
      } else {
        // Borrado completado, esperar 500ms antes de comenzar a escribir de nuevo
        const timer = setTimeout(() => {
          setIsDeleting(false);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [currentText, isDeleting]);

  return (
    <section className="relative h-[calc(100vh-4rem)] w-full max-w-full flex flex-col items-center justify-start pt-4 sm:pt-8 md:pt-12 bg-background px-4 sm:px-6 snap-start">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes cursor-blink {
          50% { opacity: 0; }
        }
        .animate-cursor-blink {
          animation: cursor-blink 0.8s step-end infinite;
        }
      ` }} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        className="text-center w-full relative z-20 px-4 flex flex-col items-center"
      >
        <div 
          onMouseEnter={() => setAnimTrigger(prev => prev + 1)}
          className="flex flex-col items-center cursor-pointer select-none group/logo"
        >
          <h1 className="text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[16.5vw] font-black tracking-tighter text-foreground mb-0 leading-[0.85] whitespace-nowrap flex" style={{ fontFamily: "'Bruno Ace SC', sans-serif" }}>
            {"DENTAXY".split("").map((char, idx) => (
              <MechanicalLetter 
                key={idx} 
                targetChar={char} 
                trigger={animTrigger} 
                delay={idx * 0.08} // Stagger de 0.08s
              />
            ))}
          </h1>
          <p className="text-base md:text-lg tracking-[0.4em] uppercase text-muted-foreground font-semibold mb-8 sm:mb-10 flex justify-center" style={{ fontFamily: "'Bruno Ace SC', sans-serif" }}>
            {"technologies".toUpperCase().split("").map((char, idx) => (
              <MechanicalLetter 
                key={idx} 
                targetChar={char} 
                trigger={animTrigger} 
                delay={0.7 + idx * 0.05} // Inicia a los 0.7s, después de DENTAXY, con stagger de 0.05s
              />
            ))}
          </p>
        </div>

        <p className="text-sm sm:text-base md:text-lg font-light text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto px-4 min-h-[4rem] sm:min-h-[2.5rem] flex items-center justify-center">
          <span>{currentText}</span>
          <span className="inline-block w-[2px] h-5 bg-muted-foreground ml-1 animate-cursor-blink"></span>
        </p>
        
        <FutureButton onClick={onExplore} className="mt-2" />
      </motion.div>

    </section>
  );
};

// Componente local auxiliar para letra con efecto split-flap / rotación mecánica 3D
const MechanicalLetter = ({ 
  targetChar, 
  trigger, 
  delay = 0 
}: { 
  targetChar: string; 
  trigger: number; 
  delay?: number;
}) => {
  const [displayChar, setDisplayChar] = useState(targetChar);
  const controls = useAnimation();
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@*";

  useEffect(() => {
    if (trigger > 0) {
      let ticks = 0;
      const maxTicks = 6;
      
      const interval = setInterval(() => {
        if (ticks < maxTicks - 1) {
          // Cambiar a carácter aleatorio para simular el dial mecánico
          setDisplayChar(chars[Math.floor(Math.random() * chars.length)]);
          ticks++;
        } else {
          setDisplayChar(targetChar);
          clearInterval(interval);
        }
      }, 75); // Intervalo más lento para notar cada paso (antes 50ms)

      // Animación de rotación 3D sobre el eje X más lenta (de 0.35s a 0.65s)
      controls.start({
        rotateX: [0, 90, 270, 360],
        opacity: [1, 0.4, 0.4, 1],
        transition: {
          duration: 0.65, // Duración total más pausada
          delay: delay,
          ease: "easeInOut"
        }
      }).then(() => {
        controls.set({ rotateX: 0 });
      });

      return () => clearInterval(interval);
    }
  }, [trigger, targetChar, controls, delay]);

  return (
    <motion.span
      animate={controls}
      className="inline-block"
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
    >
      {displayChar}
    </motion.span>
  );
};
