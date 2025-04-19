
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase, getURL } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { Check, User, Lock } from "lucide-react";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "register";
  onSuccess: () => void;
}

export function AuthDialog({ isOpen, onClose, defaultMode = "login", onSuccess }: AuthDialogProps) {
  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          console.error('Error al iniciar sesión:', error);
          
          // Mensajes específicos para diferentes errores
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Credenciales inválidas. Por favor verifica tu email y contraseña.');
          } else if (error.message.includes('Email not confirmed')) {
            toast.error('Email no confirmado. Por favor verifica tu bandeja de entrada para confirmar tu email.');
          } else {
            toast.error(`Error al iniciar sesión: ${error.message}`);
          }
          throw error;
        }
        
        toast.success("¡Bienvenido de vuelta!");
        onSuccess();
      } else {
        // For signup, use the proper redirect URL
        const redirectUrl = `${window.location.origin}/auth/callback`;
        console.log("Redirect URL:", redirectUrl);
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl
          }
        });
        
        if (error) {
          console.error('Error al registrarse:', error);
          
          // Mensajes de error específicos
          if (error.message.includes('already registered')) {
            toast.error('Este correo ya está registrado. Por favor inicia sesión.');
          } else if (error.message.includes('Password should be')) {
            toast.error('La contraseña debe tener al menos 6 caracteres.');
          } else {
            toast.error(`Error al registrarse: ${error.message}`);
          }
          throw error;
        }
        
        if (data?.user?.identities?.length === 0) {
          // El usuario ya existe pero no ha iniciado sesión
          toast.error('Este correo ya está registrado. Por favor inicia sesión.');
          setMode("login");
        } else {
          toast.success("¡Cuenta creada exitosamente! Hemos enviado un correo de verificación a tu email.", {
            duration: 6000,
          });
          setMode("login");
        }
      }
      onClose();
    } catch (error: any) {
      console.error('Error de autenticación:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      console.log("Google redirect URL:", redirectUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent', // Force account selection
            hd: 'dentaxy.com', // Preferred domain (optional)
          },
          scopes: 'email profile',
        }
      });
      
      if (error) {
        console.error('Error al autenticarse con Google:', error);
        toast.error(`Error al autenticarse con Google: ${error.message}`);
        throw error;
      }
      
      toast.success("Redirigiendo a Google para autenticación...");
    } catch (error: any) {
      console.error('Error de autenticación con Google:', error);
      toast.error(`Error de autenticación con Google: ${error.message}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md space-y-6 rounded-xl border border-gray-200 bg-white p-6 text-gray-800 shadow-lg">
        <DialogTitle className="text-center text-3xl font-bold tracking-tight text-gray-900">
          {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
        </DialogTitle>
        
        <div className="text-center">
          {mode === "register" && (
            <p className="mt-2 text-sm text-gray-600">
              Únete al equipo Dental Basics Academy IA
            </p>
          )}
        </div>

        {/* Google login button moved to the top of the form */}
        <Button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 flex items-center justify-center gap-2 py-5"
        >
          <img
            src="https://www.google.com/favicon.ico"
            className="h-5 w-5"
            alt="Google"
          />
          <span className="font-medium">
            {mode === "login" ? "Iniciar sesión con Google" : "Registrarse con Google"}
          </span>
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">O continuar con email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-gray-50 border-gray-200 text-gray-900"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 flex items-center gap-2">
                <Lock className="h-4 w-4" /> Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 bg-gray-50 border-gray-200 text-gray-900"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
            disabled={loading}
          >
            {loading
              ? mode === "login"
                ? "Iniciando sesión..."
                : "Creando cuenta..."
              : mode === "login"
              ? "Iniciar Sesión"
              : "Crear Cuenta"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          {mode === "login" ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}{" "}
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="font-medium text-blue-600 hover:text-blue-800"
            type="button"
          >
            {mode === "login" ? "Regístrate" : "Inicia Sesión"}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}
