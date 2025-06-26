
import React from 'react';
import { motion } from 'framer-motion';

interface GlowMenuProps {
  children: React.ReactNode;
  className?: string;
}

const GlowMenu: React.FC<GlowMenuProps> = ({ children, className = '' }) => {
  const glowVariants = {
    initial: { opacity: 0 },
    hover: { 
      opacity: 1,
      transition: { 
        duration: 0.3, 
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, scale: 0.95 },
    hover: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        opacity: { 
          duration: 0.2, 
          ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
        },
        scale: { 
          duration: 0.3, 
          type: "spring",
          stiffness: 300, 
          damping: 20 
        }
      }
    }
  };

  return (
    <div className={`relative group ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg blur-lg"
        variants={glowVariants}
        initial="initial"
        whileHover="hover"
      />
      
      <motion.div
        className="relative"
        variants={itemVariants}
        initial="initial"
        whileHover="hover"
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          duration: 0.3
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default GlowMenu;
