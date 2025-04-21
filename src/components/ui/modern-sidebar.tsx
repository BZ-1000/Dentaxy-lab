
// Imports for React, types, utility functions
import React, { ReactNode } from 'react';
import { motion, MotionValue } from 'framer-motion';
import cn from 'clsx';  // Using clsx for classNames merging

// Define Links type properly to match usage in SidebarLink
export type Links = {
  label: string;
  icon: ReactNode | MotionValue<number> | MotionValue<string>;
  onClick?: () => void;
};

// Dummy implementation or import for useSidebar hook
// Since it's used in SidebarLink, we can simulate it or you can replace with actual implementation
// For now, a simple dummy hook returning default values
export function useSidebar() {
  return {
    open: true,
    animate: true,
  };
}

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
}) => {
  const { open, animate } = useSidebar();

  // Fix: Ensure icon is a ReactNode, not a MotionValue directly
  // If link.icon is MotionValue, wrap with React fragment to avoid passing MotionValue directly as ReactNode
  const iconNode =
    typeof link.icon === 'object' &&
    link.icon !== null &&
    'current' in link.icon ? (
      <>{link.icon}</>
    ) : (
      link.icon
    );

  return (
    <div
      className={cn(
        'flex items-center justify-start gap-2 group/sidebar py-2 cursor-pointer',
        className
      )}
      onClick={link.onClick}
      {...props}
    >
      {iconNode}
      {animate ? (
        open ? (
          <span className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0 text-justify">
            {link.label}
          </span>
        ) : null
      ) : (
        <span className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0 text-justify">
          {link.label}
        </span>
      )}
    </div>
  );
};
