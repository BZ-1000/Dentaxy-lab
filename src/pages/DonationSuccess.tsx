import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Coffee, Heart, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function DonationSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-background to-secondary/10 border-2 border-primary/20 shadow-2xl">
          {/* Animated background */}
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

          <div className="relative p-8 text-center space-y-6">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: 0.2, 
                type: "spring", 
                stiffness: 300, 
                damping: 20 
              }}
              className="flex justify-center"
            >
              <div className="relative">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="bg-green-100 p-4 rounded-full"
                >
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </motion.div>
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1] 
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    delay: 0.5 
                  }}
                  className="absolute -top-2 -right-2 bg-primary/20 p-2 rounded-full"
                >
                  <Coffee className="h-6 w-6 text-primary" />
                </motion.div>
              </div>
            </motion.div>

            {/* Thank you message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h1 className="text-2xl font-bold text-foreground">
                ¡Gracias por el café! ☕
              </h1>
              
              {showMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-3"
                >
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                    <p className="text-sm text-foreground leading-relaxed">
                      Tu apoyo significa mucho para el desarrollo continuo de Dentaxy. 
                      Cada café se convierte en nuevas funcionalidades que harán tu trabajo más eficiente.
                    </p>
                  </div>
                  
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
                  >
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>Hecho con amor para odontólogos</span>
                    <Heart className="h-4 w-4 text-red-500" />
                  </motion.div>
                </motion.div>
              )}
            </motion.div>

            {/* Session info */}
            {sessionId && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3"
              >
                <p>ID de transacción:</p>
                <p className="font-mono break-all">{sessionId}</p>
              </motion.div>
            )}

            {/* Return button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Button
                onClick={handleGoHome}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium shadow-lg"
                size="lg"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Dentaxy
              </Button>
            </motion.div>

            {/* Decorative elements */}
            <div className="flex justify-center pt-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
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
    </div>
  );
}