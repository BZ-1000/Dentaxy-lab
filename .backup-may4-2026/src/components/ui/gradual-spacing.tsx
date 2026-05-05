
"use client";

import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface GradualSpacingProps {
  text: string;
  duration?: number;
  delayMultiple?: number;
  framerProps?: Variants;
  className?: string;
  textAlign?: "left" | "center" | "right" | "justify";
}

function GradualSpacing({
  text,
  duration = 0.3,
  delayMultiple = 0.02,
  framerProps = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  },
  className,
  textAlign = "center",
}: GradualSpacingProps) {
  const containerClass = useMemo(() => ({
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    justify: "justify-between",
  }[textAlign]), [textAlign]);

  const chars = useMemo(() => text.split(""), [text]);

  return (
    <div className={`flex ${containerClass} space-x-1`}>
      {chars.map((char, i) => (
        <motion.h1
          key={i}
          initial="hidden"
          animate="visible"
          variants={framerProps}
          transition={{ 
            duration, 
            delay: i * delayMultiple,
          }}
          className={cn("drop-shadow-sm", className)}
        >
          {char === " " ? <span>&nbsp;</span> : char}
        </motion.h1>
      ))}
    </div>
  );
}

export { GradualSpacing };
