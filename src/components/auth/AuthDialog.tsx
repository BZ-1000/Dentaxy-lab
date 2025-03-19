
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
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
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
      <DialogContent className="w-full max-w-md space-y-8 rounded-xl border border-white/10 bg-black/95 p-6 text-white backdrop-blur-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
          </h2>
          {mode === "register" && (
            <p className="mt-2 text-sm text-white/70">
              Únete al equipo Dental Basics Academy IA
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-white/10 text-white"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 bg-white/10 text-white"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-white text-black hover:bg-white/90"
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
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-black px-2 text-white">O continuar con</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border border-white/20 bg-transparent text-white hover:bg-white/10"
          >
            <img
              src="https://www.google.com/favicon.ico"
              className="mr-2 h-4 w-4"
              alt="Google"
            />
            Google
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-white/60">
          {mode === "login" ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}{" "}
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="font-medium text-white hover:text-white/90"
            type="button"
          >
            {mode === "login" ? "Regístrate" : "Inicia Sesión"}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}
