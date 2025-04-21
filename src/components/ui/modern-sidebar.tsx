
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext, ReactNode } from "react";
import { AnimatePresence, motion, MotionValue, useMotionValue, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";

interface Links {
  label: string;
  href?: string;
  icon: React.ReactNode | MotionValue<string | number>;
  onClick?: () => void;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return <SidebarContext.Provider
    value={{
      open,
      setOpen,
      animate
    }}
  >
      {children}
    </SidebarContext.Provider>;
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...props} />
    </>;
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();

  // Fixed width property - use explicit string width
  const sidebarWidth = animate ? (open ? "300px" : "60px") : "300px";

  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 flex-shrink-0",
        className
      )}
      animate={{
        width: sidebarWidth
      }}
      style={{ width: sidebarWidth }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen } = useSidebar();

  return (
    <>
      <div className="h-14 md:hidden flex items-center px-4 bg-neutral-100 dark:bg-neutral-800">
        <button
          onClick={() => setOpen(true)}
          className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg"
        >
          <Menu className="h-6 w-6 text-neutral-800 dark:text-neutral-200" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className={cn(
              "fixed inset-0 z-50 bg-white dark:bg-neutral-900 md:hidden",
              className
            )}
            {...props}
          >
            <div className="flex flex-col h-full p-4">
              <button
                onClick={() => setOpen(false)}
                className="self-end p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg mb-4"
              >
                <X className="h-6 w-6 text-neutral-800 dark:text-neutral-200" />
              </button>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

function MotionValueIcon({ icon }: { icon: MotionValue<string | number> }) {
  // We'll subscribe to changes and rerender accordingly.
  // This helper component unwraps the MotionValue and renders it as text.
  const [currentValue, setCurrentValue] = React.useState(icon.get());

  React.useEffect(() => {
    return icon.onChange((latest) => {
      setCurrentValue(latest);
    });
  }, [icon]);

  return <>{String(currentValue)}</>;
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

  // Handle the icon: if it's a MotionValue, unwrap it using MotionValueIcon; otherwise, render directly
  let iconToRender: React.ReactNode;

  if (
    typeof link.icon === "object" &&
    link.icon !== null &&
    "onChange" in link.icon &&
    typeof (link.icon as MotionValue<any>).get === "function"
  ) {
    // It's a MotionValue, render the current value with subscription
    iconToRender = <MotionValueIcon icon={link.icon as MotionValue<string | number>} />;
  } else {
    // Normal ReactNode or JSX.Element
    iconToRender = React.isValidElement(link.icon) ? link.icon : <>{link.icon}</>;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2 cursor-pointer",
        className
      )}
      onClick={link.onClick}
      {...props}
    >
      {iconToRender}
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

export const Logo = ({
  children
}: {
  children: ReactNode;
}) => {
  return <div className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      {children}
      <div className="whitespace-pre text-base font-medium text-gray-700">Nube personal de formularios</div>
    </div>;
};

export const LogoIcon = ({
  children
}: {
  children: ReactNode;
}) => {
  return <div className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      {children}
    </div>;
};

