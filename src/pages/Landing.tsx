
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Shield, Clock } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/historia-clinica');
  };

  const features = [
    {
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      title: "Historia Clínica Digital",
      description: "Crea y gestiona historias clínicas completas de forma digital y organizada."
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Gestión de Pacientes",
      description: "Administra la información de tus pacientes de manera eficiente y segura."
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: "Seguridad de Datos",
      description: "Protección avanzada de la información médica con estándares de seguridad."
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-600" />,
      title: "Ahorro de Tiempo",
      description: "Optimiza tu tiempo con formularios inteligentes y procesos automatizados."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            HistoriaClínica+
          </div>
          <div className="space-x-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Iniciar Sesión
            </Button>
            <Button onClick={() => navigate('/register')}>
              Registrarse
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Gestión Inteligente de
            <span className="text-blue-600 dark:text-blue-400"> Historia Clínica</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Revoluciona la manera en que gestionas las historias clínicas de tus pacientes 
            con nuestra plataforma digital avanzada, segura y fácil de usar.
          </p>
          <div className="space-x-4">
            <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-3">
              Comenzar Ahora
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Ver Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            ¿Listo para comenzar?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Únete a miles de profesionales de la salud que ya confían en nuestra plataforma.
          </p>
          <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-3">
            Crear Historia Clínica
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 HistoriaClínica+. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
