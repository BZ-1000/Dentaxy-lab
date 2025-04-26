import React, { useState, useEffect, useRef, ReactNode } from "react";
import { motion, useTransform, useScroll } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { translateText } from "@/utils/translate";

interface ModernSidebarProps {
  children: ReactNode;
}

const ModernSidebar: React.FC<ModernSidebarProps> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [translatedName, setTranslatedName] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const translateUserName = async () => {
      if (user?.user_metadata?.full_name) {
        const translated = await translateText(user.user_metadata.full_name);
        if (typeof translated === 'string') {
          setTranslatedName(translated);
        } else if (Array.isArray(translated) && translated.length > 0) {
          setTranslatedName(translated[0]);
        }
      }
    };

    translateUserName();
  }, [user]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setUser(null);
      localStorage.removeItem("userSession");
      navigate("/auth/login");
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const width = useTransform(scrollYProgress, [0, 1], [200, 50]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="relative min-h-screen md:flex">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden absolute top-4 left-4 z-50">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-64">
          <SheetHeader className="space-y-2 text-left">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>
              Explore the app and manage your account.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            {user ? (
              <div className="flex items-center space-x-4 p-2">
                <Avatar>
                  <AvatarImage src={user?.user_metadata?.avatar_url as string} />
                  <AvatarFallback>
                    {user?.user_metadata?.full_name
                      ?.split(" ")
                      .map((n: string) => n?.[0])
                      .join("")
                      .toUpperCase() || "NA"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {translatedName || user?.user_metadata?.full_name || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {user?.email || "N/A"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-2">
                <Link to="/auth/login">
                  <Button variant="outline">Login</Button>
                </Link>
              </div>
            )}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="menu">
                <AccordionTrigger>Menu</AccordionTrigger>
                <AccordionContent>
                  <Link to="/app">
                    <Button variant="ghost" className="w-full justify-start">
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button variant="ghost" className="w-full justify-start">
                      About
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="ghost" className="w-full justify-start">
                      Contact
                    </Button>
                  </Link>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="legal">
                <AccordionTrigger>Legal</AccordionTrigger>
                <AccordionContent>
                  <Link to="/terms">
                    <Button variant="ghost" className="w-full justify-start">
                      Terms of Service
                    </Button>
                  </Link>
                  <Link to="/privacy">
                    <Button variant="ghost" className="w-full justify-start">
                      Privacy Policy
                    </Button>
                  </Link>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {user && (
              <Button
                variant="destructive"
                className="w-full mt-4"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <motion.div
        ref={ref}
        className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-gray-50 border-r dark:bg-gray-800 dark:border-gray-700"
        style={{ width: typeof width === 'object' ? width : `${width}px` }}
      >
        <div className="flex items-center justify-center h-16 shrink-0">
          <Link to="/" className="font-bold text-xl">
            DENTAXY.ai
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col space-y-1">
            {user ? (
              <div className="flex items-center space-x-4 p-4">
                <Avatar>
                  <AvatarImage src={user?.user_metadata?.avatar_url as string} />
                  <AvatarFallback>
                    {user?.user_metadata?.full_name
                      ?.split(" ")
                      .map((n: string) => n?.[0])
                      .join("")
                      .toUpperCase() || "NA"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {translatedName || user?.user_metadata?.full_name || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {user?.email || "N/A"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <Link to="/auth/login">
                  <Button variant="outline">Login</Button>
                </Link>
              </div>
            )}
            <Link
              to="/app"
              className="block py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              to="/about"
              className="block py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Contact
            </Link>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="legal">
                <AccordionTrigger>Legal</AccordionTrigger>
                <AccordionContent>
                  <Link to="/terms">
                    <Button variant="ghost" className="w-full justify-start">
                      Terms of Service
                    </Button>
                  </Link>
                  <Link to="/privacy">
                    <Button variant="ghost" className="w-full justify-start">
                      Privacy Policy
                    </Button>
                  </Link>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {user && (
              <Button
                variant="destructive"
                className="w-full mt-4"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            )}
          </nav>
        </div>
      </motion.div>

      <div className="flex-1 md:ml-64">
        <main ref={ref}>{children}</main>
      </div>
    </div>
  );
};

export default ModernSidebar;
