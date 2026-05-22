import { motion } from 'framer-motion';
export const SidebarHeader = () => {
  return <motion.div className="flex items-center gap-2 p-4 bg-white border-b border-border/50" initial={{
    opacity: 0,
    y: -10
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.3
  }}>
      <motion.div whileHover={{
      scale: 1.05
    }} whileTap={{
      scale: 0.95
    }} className="w-8 h-8 flex-shrink-0">
        <img src="/lovable-uploads/47756bd5-fe5d-45cf-bbb4-f61daf4a38cd.png" alt="DentaXy" className="w-full h-full object-contain" />
      </motion.div>
      <div className="flex-1 min-w-0">
        <h2 className="text-sm font-semibold text-foreground leading-tight">DENTAXY</h2>
        <p className="text-xs text-muted-foreground leading-tight">Technologies </p>
      </div>
    </motion.div>;
};