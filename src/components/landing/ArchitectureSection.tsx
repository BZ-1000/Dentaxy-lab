import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export const ArchitectureSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="h-screen flex items-center bg-background px-6 snap-start">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
        {/* Text Left */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="lg:col-span-2 space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            Diseñada como infraestructura, no como una app más
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Dentaxy está construida como una arquitectura modular que permite integrar 
            inteligencia artificial, flujos clínicos, academia y visualización avanzada 
            sin fricción.
          </p>
        </motion.div>

        {/* Visual Right - Abstract Nodes */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-3 relative h-80 md:h-96"
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
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 2, delay: 0.5 }}
            />
            <motion.path
              d="M100,80 L200,150 L300,80"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              fill="none"
              strokeOpacity="0.5"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.8 }}
            />
            <motion.path
              d="M100,220 L200,150 L300,220"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              fill="none"
              strokeOpacity="0.5"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
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
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: node.delay }}
                />
                <motion.circle
                  cx={node.cx}
                  cy={node.cy}
                  r="6"
                  fill="hsl(var(--primary))"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: node.delay + 0.2 }}
                />
                <motion.text
                  x={node.cx}
                  y={node.cy + 35}
                  textAnchor="middle"
                  className="text-[10px] fill-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
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
