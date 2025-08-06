import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, X, Heart } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";

export function DonationBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Show banner after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleDonate = () => {
    // Open donation link - you can replace this with your actual donation URL
    window.open('https://paypal.me/yourhandle/20', '_blank');
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
          className="fixed bottom-6 right-6 z-50"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200/50 shadow-lg max-w-sm">
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="absolute top-2 right-2 h-6 w-6 p-0 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
            >
              <X className="h-3 w-3" />
            </Button>

            {/* Animated background elements */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-amber-100/20 to-orange-100/20"
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
                  className="bg-amber-100 p-2 rounded-full"
                >
                  <Coffee className="h-5 w-5 text-amber-600" />
                </motion.div>
                <div>
                  <h3 className="text-sm font-semibold text-amber-900">
                    Dona un café
                  </h3>
                  <p className="text-xs text-amber-700">
                    para el creador
                  </p>
                </div>
              </div>

              {/* Main message */}
              <div className="space-y-2">
                <p className="text-xs text-amber-800 leading-relaxed">
                  <span className="font-medium">"Tu café de hoy es la nueva función de mañana."</span>
                </p>
                <p className="text-xs text-amber-700 flex items-center gap-1">
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
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-medium shadow-md"
                  size="sm"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Donar $20 MXN
                </Button>
              </motion.div>

              {/* Small decorative elements */}
              <div className="flex justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex gap-1"
                >
                  <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}