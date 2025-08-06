import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Shield, Zap } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";
import { Badge } from "./badge";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface EmbeddedCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  planName: string;
  planPrice: string;
  planPeriod: string;
  planFeatures: string[];
}

export function EmbeddedCheckout({
  isOpen,
  onClose,
  planId,
  planName,
  planPrice,
  planPeriod,
  planFeatures
}: EmbeddedCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { createCheckoutSession } = useSubscription();
  const { session } = useAuth();

  const handlePayment = async () => {
    if (!session) {
      toast.error("Debes iniciar sesión para continuar");
      return;
    }

    setIsProcessing(true);
    try {
      const url = await createCheckoutSession(planId);
      if (url) {
        // Instead of opening in new tab, redirect in same window
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error("Error al procesar el pago. Intenta de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 border-2 border-primary/20 shadow-2xl">
              {/* Close button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="absolute top-4 right-4 h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100 z-10"
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Header */}
              <div className="relative bg-gradient-to-r from-primary to-primary/80 text-white p-6 pb-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <Badge className="bg-white/20 text-white">
                    Pago Seguro
                  </Badge>
                  <h2 className="text-xl font-bold">Confirmar Suscripción</h2>
                  <p className="text-white/90 text-sm">
                    Procesa tu pago de forma segura con Stripe
                  </p>
                </motion.div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <div className="absolute inset-0 bg-white rounded-full transform translate-x-16 -translate-y-8"></div>
                  <div className="absolute inset-0 bg-white rounded-full transform translate-x-8 -translate-y-12 scale-75"></div>
                </div>
              </div>

              {/* Plan details */}
              <div className="p-6 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-900">{planName}</h3>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{planPrice}</div>
                      <div className="text-xs text-gray-600">{planPeriod}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {planFeatures.slice(0, 3).map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {feature}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Security badges */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-4 py-3"
                >
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Shield className="h-4 w-4 text-green-600" />
                    Encriptado SSL
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Zap className="h-4 w-4 text-blue-600" />
                    Activación instantánea
                  </div>
                </motion.div>

                {/* Payment button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3"
                >
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold py-3 shadow-lg"
                    size="lg"
                  >
                    {isProcessing ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                    ) : (
                      <CreditCard className="h-5 w-5 mr-2" />
                    )}
                    {isProcessing ? "Procesando..." : `Pagar ${planPrice}`}
                  </Button>
                  
                  <p className="text-xs text-center text-gray-500">
                    Al continuar, aceptas nuestros términos de servicio y política de privacidad.
                  </p>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}