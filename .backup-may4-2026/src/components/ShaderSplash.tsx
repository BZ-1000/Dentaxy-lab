import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dienteLogo from "@/assets/diente-logo.png";

interface ShaderSplashProps {
  onComplete: () => void;
}

export function ShaderSplash({ onComplete }: ShaderSplashProps) {
  const [phase, setPhase] = useState(0); // 0: tooth appears, 1: text emerges, 2: switch .ai/.com, 3: fade out
  const [showDotCom, setShowDotCom] = useState(false);

  useEffect(() => {
    // Phase 0: Tooth appears (instant)
    const timer1 = setTimeout(() => setPhase(1), 400); // Text emerges
    const timer2 = setTimeout(() => setPhase(2), 1200); // .ai glows
    const timer3 = setTimeout(() => setShowDotCom(true), 2000); // Switch to .com
    const timer4 = setTimeout(() => setPhase(3), 2800); // Start fade
    const timer5 = setTimeout(() => onComplete(), 3200); // Complete

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100000] bg-black flex items-center justify-center"
        >
          {/* Subtle radial glow behind tooth */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px]"
            style={{
              background: "radial-gradient(circle, rgba(100,200,255,0.3) 0%, transparent 70%)",
            }}
          />

          {/* Central container */}
          <div className="relative flex flex-col items-center">
            {/* Tooth Icon */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
              }}
              transition={{ 
                duration: 0.5, 
                ease: [0.34, 1.56, 0.64, 1], // Spring-like
              }}
              className="relative"
            >
              {/* Glow ring around tooth */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: phase >= 1 ? [0.3, 0.6, 0.3] : 0,
                  scale: phase >= 1 ? [1, 1.1, 1] : 0.8,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 -m-4"
                style={{
                  background: "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)",
                  filter: "blur(8px)",
                }}
              />
              
              <img
                src={dienteLogo}
                alt="Dentaxy"
                className="w-12 h-12 md:w-16 md:h-16 relative z-10"
                style={{
                  filter: phase >= 1 
                    ? "drop-shadow(0 0 20px rgba(59,130,246,0.6)) drop-shadow(0 0 40px rgba(59,130,246,0.3))" 
                    : "none",
                  transition: "filter 0.5s ease",
                }}
              />
            </motion.div>

            {/* Text container - emerges from below the tooth */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ 
                opacity: phase >= 1 ? 1 : 0, 
                y: phase >= 1 ? 0 : -10,
              }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="mt-4 flex items-baseline"
            >
              {/* DENTAXY text */}
              <motion.span
                className="text-2xl md:text-3xl font-black tracking-tight text-white"
                style={{
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                DENTAXY
              </motion.span>

              {/* .ai / .com suffix */}
              <AnimatePresence mode="wait">
                {!showDotCom ? (
                  <motion.span
                    key="ai"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                    }}
                    exit={{ opacity: 0, x: 5, filter: "blur(4px)" }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl md:text-3xl font-black tracking-tight"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      color: "#3b82f6",
                      textShadow: phase >= 2 
                        ? "0 0 10px rgba(59,130,246,0.8), 0 0 30px rgba(59,130,246,0.5), 0 0 50px rgba(59,130,246,0.3)"
                        : "none",
                      transition: "text-shadow 0.4s ease",
                    }}
                  >
                    .ai
                  </motion.span>
                ) : (
                  <motion.span
                    key="com"
                    initial={{ opacity: 0, x: -5, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl md:text-3xl font-black tracking-tight"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      color: "#3b82f6",
                      textShadow: "0 0 10px rgba(59,130,246,0.8), 0 0 30px rgba(59,130,246,0.5), 0 0 50px rgba(59,130,246,0.3)",
                    }}
                  >
                    .com
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Minimal loading indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 0.6 : 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 flex items-center gap-1.5"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                  className="w-1 h-1 rounded-full bg-blue-500"
                />
              ))}
            </motion.div>
          </div>

          {/* Corner tech detail - subtle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 0.3 : 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute bottom-6 left-6 text-[10px] font-mono text-white/30 tracking-widest"
          >
            LOADING DEMOS
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 0.3 : 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="absolute bottom-6 right-6 text-[10px] font-mono text-white/30 tracking-widest"
          >
            v2.0
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
