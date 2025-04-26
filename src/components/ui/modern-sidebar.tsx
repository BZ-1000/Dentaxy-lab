import React, { useRef } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { motion, MotionValue } from 'framer-motion';

interface ModernSidebarProps {
  children: React.ReactNode;
}

const ModernSidebar = ({ children }: ModernSidebarProps) => {
  const ref = useRef(null);
  const [width, setWidth] = React.useState<number | MotionValue>(64);

  React.useEffect(() => {
    function handleResize() {
      if (ref.current && ref.current.offsetWidth > 64) {
        setWidth(256);
      } else {
        setWidth(64);
      }
    }

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative min-h-screen md:flex">
      <Sheet>
        <SheetTrigger asChild>
          <button className="md:hidden absolute top-4 left-4 rounded-sm border border-input bg-background px-4 py-2 font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <Menu className="w-5 h-5" />
          </button>
        </SheetTrigger>
        <SheetContent className="md:hidden w-64">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>
              Take control of your finances with our app.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      
      <motion.div
        ref={ref}
        className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-gray-50 border-r dark:bg-gray-800 dark:border-gray-700"
        style={{
          width: width instanceof MotionValue ? `${width.get()}px` : '64px'
        }}
      >
        <div className="flex items-center justify-center h-16 border-b dark:border-gray-700">
          <span className="text-lg font-semibold">DENTAXY.ai</span>
        </div>
        <div className="flex flex-col flex-grow p-4">
          <a href="#" className="flex items-center py-2 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
            Dashboard
          </a>
          <a href="#" className="flex items-center py-2 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
            Settings
          </a>
          <a href="#" className="flex items-center py-2 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
            Logout
          </a>
        </div>
      </motion.div>
      
      <div className="flex-1 md:ml-64">
        <main ref={ref}>{children}</main>
      </div>
    </div>
  );
};

export default ModernSidebar;
