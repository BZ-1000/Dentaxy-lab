
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
interface Links {
  label: string;
  href?: string;
  icon: React.JSX.Element | React.ReactNode;
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
  return <SidebarContext.Provider value={{
    open,
    setOpen,
    animate
  }}>
      {children}
    </SidebarContext.Provider>;
};
export const Sidebar = ({
  children,
  open,
  setOpen,
  animate
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>;
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
  const {
    open,
    setOpen,
    animate
  } = useSidebar();
  return <motion.div className={cn("h-full px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 w-[300px] flex-shrink-0", className)} animate={{
    width: animate ? open ? "300px" : "60px" : "300px"
  }} 
  // Removing the mouse enter/leave events
  {...props}>
      {children}
    </motion.div>;
};
export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const {
    open,
    setOpen
  } = useSidebar();
  return <>
      <motion.div className={cn("h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full")} {...props}>
        <div className="flex justify-end z-20 w-full">
          <Menu className="text-neutral-800 dark:text-neutral-200 cursor-pointer" onClick={() => setOpen(!open)} />
        </div>
        <AnimatePresence>
          {open && <motion.div initial={{
          x: "-100%",
          opacity: 0
        }} animate={{
          x: 0,
          opacity: 1
        }} exit={{
          x: "-100%",
          opacity: 0
        }} transition={{
          duration: 0.3,
          ease: "easeInOut"
        }} className={cn("fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between", className)}>
              <div className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200 cursor-pointer" onClick={() => setOpen(!open)}>
                <X />
              </div>
              {children}
            </motion.div>}
        </AnimatePresence>
      </motion.div>
    </>;
};
export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
}) => {
  const {
    open,
    animate
  } = useSidebar();
  // This fixes the TypeScript error by ensuring we're returning a React.ReactNode
  const content = <div className={cn("flex items-center justify-start gap-2 group/sidebar py-2 cursor-pointer", className)} onClick={link.onClick} {...props}>
      {link.icon}
      {typeof open === 'boolean' && (
        <motion.span animate={{
          display: animate ? open ? "inline-block" : "none" : "inline-block",
          opacity: animate ? open ? 1 : 0 : 1
        }} className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0 text-justify">
          {link.label}
        </motion.span>
      )}
    </div>;
  return content;
};
export const Logo = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return <div className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      {children}
      <motion.span initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} className="whitespace-pre text-base font-medium text-gray-700">Nube personal de formularios</motion.span>
    </div>;
};
export const LogoIcon = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return <div className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      {children}
    </div>;
};
