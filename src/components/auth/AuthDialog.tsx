
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase, getURL } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("¡Bienvenido de vuelta!");
        onSuccess();
      } else {
        // For signup, use the proper redirect URL
        const redirectUrl = `${window.location.origin}/auth/callback`;
        console.log("Redirect URL:", redirectUrl);
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl
          }
        });
        if (error) throw error;
        toast.success("¡Cuenta creada exitosamente! Hemos enviado un correo de verificación a tu email.");
        setMode("login");
      }
      onClose();
    } catch (error: any) {
      toast.error(`Error de autenticación: ${error.message}`);
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
      if (error) throw error;
    } catch (error: any) {
      toast.error(`Error de autenticación con Google: ${error.message}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md space-y-8 rounded-xl border border-gray-200 bg-white p-6 text-gray-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
          </h2>
          {mode === "register" && (
            <p className="mt-2 text-sm text-gray-600">
              Únete al equipo Dental Basics Academy IA
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 border-gray-200 focus:border-blue-300 focus:ring-blue-100"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 border-gray-200 focus:border-blue-300 focus:ring-blue-100"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">O continuar con</span>
            </div>
          </div>

          {/* Enhanced Google button */}
          <Button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 flex items-center justify-center gap-2 py-6 transition-all"
          >
            <img
              src="https://www.google.com/favicon.ico"
              className="mr-2 h-5 w-5"
              alt="Google"
            />
            <span className="font-medium">
              {mode === "login" ? "Iniciar sesión con Google" : "Registrarse con Google"}
            </span>
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
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
