
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
  children: React.ReactNode;
  className?: string;
  size?: number;
  icon?: React.ReactNode;
  label?: string;
}

const DockItem = ({
  children,
  className,
  size = 6,
  icon,
  label,
}: Props) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const itemSize = isHovered ? size * 1.75 : size;

  return (
    <motion.div
      className="group relative flex items-center justify-center"
      style={{ height: itemSize * 4, width: itemSize * 4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && label ? (
          <motion.div
            className="absolute top-0 z-10 rounded-md bg-black/80 px-2 py-1 text-xs text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {label}
          </motion.div>
        ) : null}
      </AnimatePresence>
      <motion.div
        className={cn(
          'flex items-center justify-center rounded-full border border-white/10 bg-black/40 text-white shadow-lg backdrop-blur-sm transition-all duration-200',
          className
        )}
        style={{ height: itemSize * 4, width: itemSize * 4 }}
      >
        {icon || children}
      </motion.div>
    </motion.div>
  );
};

export const AppleStyleDock = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2">
      <motion.div
        className="flex h-16 items-end gap-4 rounded-2xl border border-white/20 bg-black/70 px-4 pb-3 backdrop-blur-xl"
        style={{ originY: '100%' }}
      >
        <div 
          onClick={() => navigate('/')} 
          className="cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-full w-full text-neutral-600 dark:text-neutral-300 hover:text-blue-500 transition-colors"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
};
