import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, X, Heart } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
const dailyPhrases = ["Menos papeles, más sonrisas.", "Tu tiempo vale más que el papeleo.", "Recupera el 70% de tu día.", "Más pacientes. Menos administración.", "Tu día, con más horas. Úsalas.", "Manos a la obra, no al papeleo.", "Dedícate a crear, no a documentar.", "Menos rutina, más vocación.", "Tu talento no está en teclear.", "Reenamórate de la odontología.", "Optimiza tu tiempo, maximiza tu éxito.", "La clínica del futuro es eficiente.", "Menos clics, más ganancias.", "El éxito es trabajar inteligente.", "Automatiza lo repetitivo. Domina lo excepcional."];
export function DonationBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    session
  } = useAuth();
  useEffect(() => {
    // Show banner after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsTyping(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!isTyping) return;
    const currentPhrase = dailyPhrases[currentPhraseIndex];
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex <= currentPhrase.length) {
        setDisplayedText(currentPhrase.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);

        // Change phrase daily (24 hours)
        setTimeout(() => {
          setCurrentPhraseIndex(prev => (prev + 1) % dailyPhrases.length);
          setDisplayedText("");
          setIsTyping(true);
        }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
      }
    }, 80);
    return () => clearInterval(typeInterval);
  }, [isTyping, currentPhraseIndex]);
  const handleDonate = async () => {
    if (!session) {
      toast.error("Debes iniciar sesión para donar");
      return;
    }
    setIsProcessing(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('create-donation', {
        body: {
          amount: 2000
        } // $20 MXN in cents
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error processing donation:', error);
      toast.error("Error al procesar la donación. Intenta de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };
  const handleClose = () => {
    setIsMinimized(true);
  };
  const handleExpand = () => {
    setIsMinimized(false);
  };
  return <AnimatePresence>
      {isVisible && <>
          {/* Minimized state */}
          {isMinimized ? <motion.div initial={{
        opacity: 0,
        scale: 0.8
      }} animate={{
        opacity: 1,
        scale: 1
      }} exit={{
        opacity: 0,
        scale: 0.8
      }} transition={{
        type: "spring",
        stiffness: 400,
        damping: 25
      }} className="fixed bottom-6 right-6 z-50">
              <motion.button onClick={handleExpand} whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} className="bg-white border border-gray-200 shadow-lg rounded-full px-3 py-2 flex items-center gap-2 hover:shadow-xl transition-shadow">
                <Coffee className="h-4 w-4 text-gray-700" />
                <span className="text-xs text-gray-600 font-medium">Donaciones</span>
              </motion.button>
            </motion.div> : (/* Full banner state */
      <motion.div initial={{
        opacity: 0,
        x: 100,
        y: 100
      }} animate={{
        opacity: 1,
        x: 0,
        y: 0
      }} exit={{
        opacity: 0,
        x: 100,
        y: 100
      }} transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }} className="fixed bottom-6 right-6 z-50 max-w-sm md:max-w-xs" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
              <Card className="relative overflow-hidden bg-white border border-gray-200 shadow-xl">
                {/* Apple-style close button */}
                <motion.button onClick={handleClose} whileHover={{
            scale: 1.1
          }} whileTap={{
            scale: 0.9
          }} className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center group transition-colors z-50 cursor-pointer bg-red-500 hover:bg-red-400 text-neutral-50">
                  <X className="h-3 w-3 text-red-100 group-hover:text-white transition-colors" />
                </motion.button>

                <div className="relative p-4 space-y-3 pr-8">
                  {/* Header with coffee icon */}
                  <div className="flex items-center gap-3">
                    <motion.div animate={isHovered ? {
                rotate: [0, -10, 10, 0]
              } : {}} transition={{
                duration: 0.5
              }} className="bg-gray-100 p-2 rounded-full">
                      <Coffee className="h-5 w-5 text-gray-700" />
                    </motion.div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        Dona un café
                      </h3>
                      <p className="text-xs text-gray-600">
                        para el creador
                      </p>
                    </div>
                  </div>

                  {/* Main message */}
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600 font-medium mb-1">
                        Frase del día
                      </p>
                      <div className="min-h-[28px] flex items-center">
                        <p className="text-xs text-gray-800 leading-relaxed font-medium">
                          "{displayedText}"
                          {isTyping && <motion.span animate={{
                      opacity: [1, 0]
                    }} transition={{
                      duration: 0.8,
                      repeat: Infinity
                    }} className="ml-1">
                              |
                            </motion.span>}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      Si te ahorré tiempo en la creación de tu historia clínica, invítame un café 
                      <span className="text-pink-500">😘</span>
                    </p>
                  </div>

                  {/* Donation button */}
                  <motion.div whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }}>
                    <Button onClick={handleDonate} disabled={isProcessing} className="w-full bg-black hover:bg-gray-800 text-white text-sm font-medium shadow-md border border-gray-300" size="sm">
                      {isProcessing ? <motion.div animate={{
                  rotate: 360
                }} transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }} className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" /> : <motion.div animate={{
                  scale: [1, 1.3, 1],
                  color: ["rgb(255, 255, 255)", "rgb(239, 68, 68)", "rgb(255, 255, 255)"]
                }} transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }} className="mr-2">
                          <Heart className="h-4 w-4" />
                        </motion.div>}
                      {isProcessing ? "Procesando..." : "Donar $20 MXN"}
                    </Button>
                  </motion.div>

                  {/* Small decorative elements */}
                  
                </div>
              </Card>
            </motion.div>)}
        </>}
    </AnimatePresence>;
}