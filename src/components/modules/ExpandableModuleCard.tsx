import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DemoAccessPanel } from './DemoAccessPanel';

interface ModuleInfo {
  whatItDemonstrates: string;
  problemItSolves: string;
  contextOfUse: string;
  publicTarget: string;
  whatIncluded: string[];
  whatNotIncluded: string[];
}

interface ExpandableModuleCardProps {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  badge: string;
  gradient: string;
  accentColor: string;
  glowColor: string;
  borderGradient: string;
  moduleInfo: ModuleInfo;
  delay?: number;
  prefilledToken?: string;
  isClassified?: boolean;
}

export function ExpandableModuleCard({
  name,
  title,
  subtitle,
  description,
  icon: Icon,
  badge,
  gradient,
  accentColor,
  glowColor,
  borderGradient,
  moduleInfo,
  delay = 0,
  prefilledToken,
  isClassified = false,
}: ExpandableModuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAccessPanel, setShowAccessPanel] = useState(false);

  const handleCardClick = () => {
    // Proyecto Stark no es expandible
    if (isClassified) return;
    if (!showAccessPanel) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleProbarDemo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAccessPanel(true);
  };

  const handleCloseAccessPanel = () => {
    setShowAccessPanel(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onClick={handleCardClick}
      className={cn(
        'relative group rounded-2xl p-[1px] overflow-hidden',
        'transition-all duration-300',
        isClassified ? 'cursor-default' : 'cursor-pointer'
      )}
      style={{
        background: borderGradient,
      }}
    >
      {/* Glow effect on hover */}
      <div
        className={cn(
          'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl',
          glowColor
        )}
      />

      {/* Card content */}
      <motion.div
        layout
        className={cn(
          'relative rounded-2xl p-6',
          'backdrop-blur-xl bg-black/60 border border-white/10',
          'flex flex-col'
        )}
      >
        {/* Background gradient */}
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-300 opacity-30 group-hover:opacity-50',
            gradient
          )}
        />

        {/* Top section */}
        <div className="relative z-10">
          {/* Badge and expand indicator */}
          <div className="flex items-center justify-between mb-4">
            <span
              className={cn(
                'text-[10px] font-bold tracking-wider px-3 py-1 rounded-full',
                'border uppercase bg-white/10 border-white/20 text-white/70',
                isClassified && 'bg-red-500/20 border-red-500/30 text-red-400'
              )}
            >
              {badge}
            </span>
            {!isClassified && (
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="h-4 w-4 text-white/40" />
              </motion.div>
            )}
          </div>

          {/* Icon */}
          <div
            className={cn(
              'w-14 h-14 rounded-xl flex items-center justify-center mb-4',
              'bg-gradient-to-br',
              gradient
            )}
            style={{ boxShadow: `0 0 30px ${accentColor}40` }}
          >
            <Icon className="h-7 w-7 text-white" strokeWidth={1.5} />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-white/90 transition-colors">
            {title}
          </h3>
          <p className="text-sm font-medium text-white/60 mb-3">{subtitle}</p>
        </div>

        {/* Description - always visible (except for classified) */}
        {!isClassified && (
          <div className="relative z-10">
            <p className="text-sm text-white/50 leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>
        )}

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && !showAccessPanel && !isClassified && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 overflow-hidden"
            >
              <div className="pt-6 space-y-4">
                {/* Divider */}
                <div
                  className="h-[1px] w-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${accentColor}50, transparent)`,
                  }}
                />

                {/* Micro-section points */}
                <div className="space-y-2">
                  {moduleInfo.whatIncluded.map((item, i) => (
                    <p key={i} className="text-sm text-white/60 flex items-start gap-2">
                      <span style={{ color: accentColor }}>•</span>
                      {item}
                    </p>
                  ))}
                </div>

                {/* Closing statement */}
                {moduleInfo.whatItDemonstrates && (
                  <div className="pt-2">
                    <p className="text-sm text-white/70 italic">
                      {moduleInfo.whatItDemonstrates}
                    </p>
                  </div>
                )}

                {/* CTA Button */}
                <button
                  onClick={handleProbarDemo}
                  className={cn(
                    'w-full py-3 rounded-xl font-semibold text-white',
                    'transition-all duration-300 hover:scale-[1.02]',
                    'bg-gradient-to-r'
                  )}
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${accentColor}, ${accentColor}aa)`,
                    boxShadow: `0 4px 20px ${accentColor}40`,
                  }}
                >
                  PROBAR DEMO
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Demo Access Panel (inline) */}
        <AnimatePresence>
          {showAccessPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <DemoAccessPanel
                moduleName={name}
                moduleTitle={title}
                accentColor={accentColor}
                onClose={handleCloseAccessPanel}
                prefilledToken={prefilledToken}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
