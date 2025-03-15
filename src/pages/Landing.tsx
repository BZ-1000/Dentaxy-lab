import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";
import { ModeToggle } from "@/components/mode-toggle";
import { useTheme } from 'next-themes';

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor, introduce un correo electrónico válido.",
  }),
  password: z.string().min(8, {
    message: "La contraseña debe tener al menos 8 caracteres.",
  }),
});

export default function Landing() {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { theme } = useTheme();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      router.push("/dashboard");
    }
  }, [session, router]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const signInResponse = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      if (signInResponse?.error) {
        toast({
          title: "Error al iniciar sesión",
          description:
            "No se pudo iniciar sesión. Verifica tus credenciales o inténtalo de nuevo más tarde.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Inicio de sesión exitoso",
          description: "¡Bienvenido de nuevo!",
        });
        router.push("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Icons.logo className="h-8 w-auto mr-2 text-blue-600" />
                <span className="font-semibold text-gray-800 dark:text-white">
                  Formulario IA
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <ModeToggle />
              {session?.user ? (
                <Button variant="outline" onClick={() => signOut()}>
                  Cerrar Sesión
                </Button>
              ) : (
                <>
                  <Link href="/register">
                    <Button variant="ghost">Registrarse</Button>
                  </Link>
                  <Link href="/login">
                    <Button>Iniciar Sesión</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <header className="bg-blue-600 text-white py-20">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">
            Simplifica tu Proceso de Creación de Historias Clínicas
          </h1>
          <p className="text-xl mb-8">
            Utiliza nuestra plataforma impulsada por IA para generar historias
            clínicas precisas y detalladas en minutos.
          </p>
          <Link href="/dashboard">
            <Button className="bg-white text-blue-600 hover:bg-blue-100">
              Comienza Ahora
            </Button>
          </Link>
        </div>
      </header>

      <section className="py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
              ¿Por qué usar Formulario IA?
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Icons.check className="h-6 w-6 text-green-500 mr-2" />
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Ahorro de Tiempo:</span>{" "}
                  Genera historias clínicas rápidamente.
                </p>
              </li>
              <li className="flex items-start">
                <Icons.check className="h-6 w-6 text-green-500 mr-2" />
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Precisión Mejorada:</span>{" "}
                  Reduce errores y asegura la integridad de los datos.
                </p>
              </li>
              <li className="flex items-start">
                <Icons.check className="h-6 w-6 text-green-500 mr-2" />
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Fácil de Usar:</span> Interfaz
                  intuitiva para una experiencia de usuario óptima.
                </p>
              </li>
            </ul>
          </div>
          <div className="relative">
            <img
              src="/hero.webp"
              alt="Interfaz de Formulario IA"
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      <section className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-8">
            Regístrate y Comienza a Transformar tu Práctica Médica
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            Únete a nuestra comunidad de profesionales de la salud que ya están
            beneficiándose de la eficiencia y precisión de Formulario IA.
          </p>
          <Link href="/register">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Crear Cuenta
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Formulario IA. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
