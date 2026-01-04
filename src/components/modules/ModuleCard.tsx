import { motion } from "framer-motion";
import { LucideIcon, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  badge: string;
  gradient: string;
  accentColor: string;
  glowColor: string;
  borderGradient: string;
  isActive?: boolean;
  isSecret?: boolean;
  onClick: () => void;
  delay?: number;
}

export function ModuleCard({
  title,
  subtitle,
  description,
  icon: Icon,
  badge,
  gradient,
  accentColor,
  glowColor,
  borderGradient,
  isActive = false,
  isSecret = false,
  onClick,
  delay = 0,
}: ModuleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -5 }}
      onClick={onClick}
      className={cn(
        "relative group cursor-pointer rounded-2xl p-[1px] overflow-hidden",
        "transition-all duration-300"
      )}
      style={{
        background: borderGradient,
      }}
    >
      {/* Glow effect on hover */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl",
          glowColor
        )}
      />

      {/* Card content */}
      <div
        className={cn(
          "relative rounded-2xl p-6 h-full min-h-[280px]",
          "backdrop-blur-xl bg-black/60 border border-white/10",
          "flex flex-col justify-between",
          isSecret && "overflow-hidden"
        )}
      >
        {/* Background gradient */}
        <div
          className={cn(
            "absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-300",
            gradient
          )}
        />

        {/* Scanlines effect for secret card */}
        {isSecret && (
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(255,255,255,0.03) 2px,
                  rgba(255,255,255,0.03) 4px
                )`,
              }}
            />
          </div>
        )}

        {/* Top section */}
        <div className="relative z-10">
          {/* Badge */}
          <div className="flex items-center justify-between mb-4">
            <span
              className={cn(
                "text-[10px] font-bold tracking-wider px-3 py-1 rounded-full",
                "border uppercase",
                isActive
                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                  : isSecret
                  ? "bg-red-500/20 border-red-500/50 text-red-400 animate-pulse"
                  : "bg-white/10 border-white/20 text-white/70"
              )}
            >
              {badge}
            </span>
            {!isActive && !isSecret && (
              <Lock className="h-4 w-4 text-white/30" />
            )}
          </div>

          {/* Icon */}
          <div
            className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center mb-4",
              "bg-gradient-to-br",
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

        {/* Description */}
        <div className="relative z-10">
          <p className="text-sm text-white/50 leading-relaxed line-clamp-3">
            {description}
          </p>

          {/* Action hint */}
          <div className="mt-4 flex items-center gap-2">
            <div
              className="h-[2px] flex-1 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${accentColor}, transparent)`,
              }}
            />
            <span className="text-[10px] text-white/40 uppercase tracking-wider">
              {isActive ? "Acceder" : isSecret ? "Clasificado" : "Próximamente"}
            </span>
          </div>
        </div>

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          }}
        />
      </div>
    </motion.div>
  );
}
