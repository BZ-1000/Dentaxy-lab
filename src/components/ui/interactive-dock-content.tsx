import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface DockWithContentProps {
  className?: string
  items: {
    id: string
    icon: LucideIcon
    label: string
    content: React.ReactNode
  }[]
}

interface DockIconButtonProps {
  icon: LucideIcon
  label: string
  onClick?: () => void
  className?: string
  isActive?: boolean
}

const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-2, 2, -2],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
}

const DockIconButton = React.forwardRef<HTMLButtonElement, DockIconButtonProps>(
  ({ icon: Icon, label, onClick, className, isActive }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={cn(
          "relative group p-3 rounded-lg",
          "hover:bg-secondary transition-colors",
          isActive && "bg-primary/10 border border-primary/20",
          className
        )}
      >
        <Icon className={cn(
          "w-5 h-5 transition-colors",
          isActive ? "text-primary" : "text-foreground"
        )} />
        <span className={cn(
          "absolute -top-8 left-1/2 -translate-x-1/2",
          "px-2 py-1 rounded text-xs",
          "bg-popover text-popover-foreground",
          "opacity-0 group-hover:opacity-100",
          "transition-opacity whitespace-nowrap pointer-events-none"
        )}>
          {label}
        </span>
      </motion.button>
    )
  }
)
DockIconButton.displayName = "DockIconButton"

const DockWithContent = React.forwardRef<HTMLDivElement, DockWithContentProps>(
  ({ items, className }, ref) => {
    const [activeTab, setActiveTab] = React.useState<string | null>(null)

    const handleTabClick = (itemId: string) => {
      setActiveTab(activeTab === itemId ? null : itemId)
    }

    return (
      <div ref={ref} className={cn("w-full", className)}>
        {/* Dock */}
        <div className="w-full h-16 flex items-center justify-center p-2 mb-6">
          <motion.div
            initial="initial"
            animate="animate"
            variants={floatingAnimation}
            className={cn(
              "flex items-center gap-1 p-2 rounded-2xl",
              "backdrop-blur-lg border shadow-lg",
              "bg-background/90 border-border",
              "hover:shadow-xl transition-shadow duration-300"
            )}
          >
            {items.map((item) => (
              <DockIconButton 
                key={item.id} 
                icon={item.icon}
                label={item.label}
                onClick={() => handleTabClick(item.id)}
                isActive={activeTab === item.id}
              />
            ))}
          </motion.div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeTab && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-6xl mx-auto"
            >
              <div className={cn(
                "bg-white/95 backdrop-blur-sm",
                "border border-gray-200/60 rounded-xl shadow-lg",
                "p-6 mb-8"
              )}>
                {items.find(item => item.id === activeTab)?.content}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)
DockWithContent.displayName = "DockWithContent"

export { DockWithContent }