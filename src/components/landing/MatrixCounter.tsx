"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const MatrixCounter = () => {
  const [counter, setCounter] = useState(0);
  const [showSecondLine, setShowSecondLine] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => prev + 1);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSecondLine(true);
    }, 2000);

    const resetTimer = setInterval(() => {
      setShowSecondLine(false);
      setTimeout(() => setShowSecondLine(true), 2000);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearInterval(resetTimer);
    };
  }, []);

  const formatNumber = (num: number) => {
    return num.toString().padStart(8, "0");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="absolute top-6 right-6 z-20 font-mono text-right"
    >
      {/* Counter */}
      <div className="text-[10px] text-cyan-500/60 tracking-[0.3em] mb-1">
        {formatNumber(counter)}
      </div>

      {/* Main text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="space-y-0.5"
      >
        <div className="text-[11px] text-muted-foreground/50 tracking-widest">
          No es el futuro...
        </div>
        
        <motion.div
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={showSecondLine ? { 
            opacity: [0, 1, 1, 0.8, 1], 
            filter: ["blur(4px)", "blur(0px)", "blur(0px)", "blur(1px)", "blur(0px)"]
          } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="text-xs font-medium tracking-[0.2em] bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent"
        >
          Es DENTAXY.ai
        </motion.div>
      </motion.div>

      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="mt-2 h-px w-full bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent origin-right"
      />
    </motion.div>
  );
};
