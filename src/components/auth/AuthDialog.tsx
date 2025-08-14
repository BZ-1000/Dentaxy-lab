
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
        onClose();
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
          onClose();
          // Optionally redirect to verification page or keep closed
        }
      }
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
            prompt: 'consent'
          }
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
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
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
