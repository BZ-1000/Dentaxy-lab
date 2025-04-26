import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModernSidebar } from '@/components/ui/modern-sidebar';
import { CreditCard, File, FileText, LayoutDashboard, Logout, Moon, Sun, User } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { enUS } from 'date-fns/locale'

const Landing = () => {
  const handlePruebaBeta = () => {
    localStorage.clear(); // Limpiar todo el almacenamiento local
    window.location.reload(); // Forzar recarga completa
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Bienvenido a la Nube Personal de Formularios IA</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <p>Esta es una aplicación de prueba para generar historias clínicas con inteligencia artificial.</p>
                <p>Puedes crear, guardar y generar informes de tus formularios de manera eficiente.</p>
                <p>Comienza ahora y experimenta el futuro de la gestión de historias clínicas.</p>
              </div>
              <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                <p className="text-gray-900">¿Listo para empezar?</p>
                <p>
                  <Link to="/app" className="text-blue-600 hover:text-blue-800 transition-colors">
                    Ir a la aplicación &rarr;
                  </Link>
                </p>
                <Button 
                  onClick={handlePruebaBeta}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
                >
                  Prueba Beta
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
