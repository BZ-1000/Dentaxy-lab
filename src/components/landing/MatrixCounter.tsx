"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SyncedTypewriter } from "@/components/ui/synced-typewriter";

export const MatrixCounter = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => prev + 1);
    }, 50);

    return () => clearInterval(interval);
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
      <div className="text-[10px] text-blue-500 tracking-[0.3em] mb-1">
        {formatNumber(counter)}
      </div>

      {/* Main text */}
      <div className="space-y-0.5">
        <div className="text-[11px] text-muted-foreground tracking-widest">
          No es el futuro...
        </div>
        
        <div className="text-xs font-black tracking-tight">
          <span className="text-muted-foreground">Es </span>
          <span className="text-foreground">DENTAXY</span>
          <SyncedTypewriter className="text-blue-500" />
        </div>
      </div>

      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="mt-2 h-px w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent origin-right"
      />
    </motion.div>
  );
};
