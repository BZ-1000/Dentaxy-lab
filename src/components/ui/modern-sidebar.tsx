// Use proper type casting to fix the ReactNode | MotionValue issue
// The line with the error is likely in an animation component using framer-motion

import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from './theme-provider';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { Button } from './button';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItemProps {
  to: string;
  children: React.ReactNode;
  exact?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, children, exact = false }) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <NavLink
      to={to}
      className={`flex items-center space-x-2 rounded-md p-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-secondary data-[active=true]:text-accent-foreground ${isActive ? 'bg-secondary text-accent-foreground' : ''}`}
      data-active={isActive}
    >
      {children}
    </NavLink>
  );
};

const ModernSidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error al cerrar sesión: ' + error.message);
    } else {
      toast.success('Sesión cerrada exitosamente');
      navigate('/auth/login');
    }
  };

  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 200, damping: 30 } },
    closed: { x: "-100%", transition: { type: "spring", stiffness: 200, damping: 30 } },
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="p-1.5">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <motion.div
          className="flex h-full flex-col gap-6 bg-card text-card-foreground shadow-xl"
          variants={sidebarVariants}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
        >
          <SheetHeader className="px-6 pt-6">
            <SheetTitle>Menú</SheetTitle>
            <SheetDescription>
              Navega a través de la aplicación.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-1 px-6">
            <NavItem to="/app" exact>
              Inicio
            </NavItem>
            <NavItem to="/app/pacientes">
              Pacientes
            </NavItem>
            <NavItem to="/app/historia-clinica">
              Historia Clínica
            </NavItem>
            <NavItem to="/app/finanzas">
              Finanzas
            </NavItem>
            <NavItem to="/app/calendario">
              Calendario
            </NavItem>
            <NavItem to="/app/configuracion">
              Configuración
            </NavItem>
          </div>

          <div className="border-t border-secondary px-6 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? <MoonIcon className="mr-2 h-4 w-4" /> : <SunIcon className="mr-2 h-4 w-4" />}
                {theme === "light" ? "Oscuro" : "Claro"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Configuración
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
};

export default ModernSidebar;
