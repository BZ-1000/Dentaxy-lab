import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, X, Heart } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const dailyPhrases = [
  "Menos papeles, más sonrisas.",
  "Tu tiempo vale más que el papeleo.",
  "Recupera el 70% de tu día.",
  "Más pacientes. Menos administración.",
  "Tu día, con más horas. Úsalas.",
  "Manos a la obra, no al papeleo.",
  "Dedícate a crear, no a documentar.",
  "Menos rutina, más vocación.",
  "Tu talento no está en teclear.",
  "Reenamórate de la odontología.",
  "Optimiza tu tiempo, maximiza tu éxito.",
  "La clínica del futuro es eficiente.",
  "Menos clics, más ganancias.",
  "El éxito es trabajar inteligente.",
  "Automatiza lo repetitivo. Domina lo excepcional."
];

export function DonationBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { session } = useAuth();

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
        
        // After 4 seconds, start typing the next phrase
        setTimeout(() => {
          setCurrentPhraseIndex((prev) => (prev + 1) % dailyPhrases.length);
          setDisplayedText("");
          setIsTyping(true);
        }, 4000);
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
      const { data, error } = await supabase.functions.invoke('create-donation', {
        body: { amount: 2000 } // $20 MXN in cents
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
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, y: 100 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 100, y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 right-6 z-50 max-w-xs"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/10 border-2 border-primary/20 shadow-xl backdrop-blur-sm">
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="absolute top-2 right-2 h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            >
              <X className="h-3 w-3" />
            </Button>

            {/* Animated background elements */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/10"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            <div className="relative p-4 space-y-3">
              {/* Header with coffee icon */}
              <div className="flex items-center gap-2">
                <motion.div
                  animate={isHovered ? { rotate: [0, -10, 10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                  className="bg-primary/10 p-2 rounded-full"
                >
                  <Coffee className="h-5 w-5 text-primary" />
                </motion.div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Dona un café
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    para el creador
                  </p>
                </div>
              </div>

              {/* Main message */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">
                    Frase del día
                  </p>
                  <div className="min-h-[32px] flex items-center">
                    <p className="text-xs text-foreground leading-relaxed font-medium">
                      "{displayedText}"
                      {isTyping && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          className="ml-1"
                        >
                          |
                        </motion.span>
                      )}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  Si te ahorré tiempo en la creación de tu historia clínica, invítame un café 
                  <span className="text-pink-500">😘</span>
                </p>
              </div>

              {/* Donation button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleDonate}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground text-sm font-medium shadow-md"
                  size="sm"
                >
                  {isProcessing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
                    />
                  ) : (
                    <Heart className="h-4 w-4 mr-2" />
                  )}
                  {isProcessing ? "Procesando..." : "Donar $20 MXN"}
                </Button>
              </motion.div>

              {/* Small decorative elements */}
              <div className="flex justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex gap-1"
                >
                  <div className="w-1 h-1 bg-primary/60 rounded-full"></div>
                  <div className="w-1 h-1 bg-secondary/60 rounded-full"></div>
                  <div className="w-1 h-1 bg-primary/60 rounded-full"></div>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}