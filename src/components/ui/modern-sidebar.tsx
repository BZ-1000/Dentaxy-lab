
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
  const iconNode = typeof link.icon === 'object' && 'current' in link.icon ? (
    <>{link.icon}</>
  ) : (
    link.icon
  );

  return (
    <div className={cn("flex items-center justify-start gap-2 group/sidebar py-2 cursor-pointer", className)} onClick={link.onClick} {...props}>
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
