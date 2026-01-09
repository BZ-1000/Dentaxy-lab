import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export const ArchitectureSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-20%" });
  const [animationKey, setAnimationKey] = useState(0);

  // Reset animation when out of view
  useEffect(() => {
    if (!isInView) {
      setAnimationKey(prev => prev + 1);
    }
  }, [isInView]);

  return (
    <section 
      ref={ref} 
      className="min-h-screen w-full max-w-full flex items-center justify-center bg-background px-4 sm:px-6 py-12 sm:py-16 snap-start overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
        {/* Text - On top for mobile */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-2/5 space-y-4 sm:space-y-6 text-center lg:text-left order-1"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
            Diseñada como infraestructura, no como una app más
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
            Dentaxy está construida como una arquitectura modular que permite integrar 
            inteligencia artificial, flujos clínicos, academia y visualización avanzada 
            sin fricción.
          </p>
        </motion.div>

        {/* Visual - Below for mobile */}
        <motion.div
          key={animationKey}
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-3/5 h-64 sm:h-80 md:h-96 order-2"
        >
          <svg viewBox="0 0 400 300" className="w-full h-full">
            {/* Connection Lines */}
            <motion.path
              d="M50,150 Q150,100 200,150 T350,150"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4,4"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 2, delay: 0.5 }}
            />
            <motion.path
              d="M100,80 L200,150 L300,80"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              fill="none"
              strokeOpacity="0.5"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.5, delay: 0.8 }}
            />
            <motion.path
              d="M100,220 L200,150 L300,220"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              fill="none"
              strokeOpacity="0.5"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.5, delay: 1 }}
            />
            
            {/* Nodes */}
            {[
              { cx: 50, cy: 150, delay: 0.3, label: "Data" },
              { cx: 200, cy: 150, delay: 0.5, label: "Core" },
              { cx: 350, cy: 150, delay: 0.7, label: "Output" },
              { cx: 100, cy: 80, delay: 0.9, label: "AI" },
              { cx: 300, cy: 80, delay: 1.1, label: "Academia" },
              { cx: 100, cy: 220, delay: 1.3, label: "Clínica" },
              { cx: 300, cy: 220, delay: 1.5, label: "3D" },
            ].map((node, i) => (
              <motion.g key={i}>
                <motion.circle
                  cx={node.cx}
                  cy={node.cy}
                  r="20"
                  fill="hsl(var(--primary))"
                  fillOpacity="0.1"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.5, delay: node.delay }}
                />
                <motion.circle
                  cx={node.cx}
                  cy={node.cy}
                  r="6"
                  fill="hsl(var(--primary))"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.3, delay: node.delay + 0.2 }}
                />
                <motion.text
                  x={node.cx}
                  y={node.cy + 35}
                  textAnchor="middle"
                  className="text-[10px] fill-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: node.delay + 0.3 }}
                >
                  {node.label}
                </motion.text>
              </motion.g>
            ))}
          </svg>
        </motion.div>
      </div>
    </section>
  );
};
