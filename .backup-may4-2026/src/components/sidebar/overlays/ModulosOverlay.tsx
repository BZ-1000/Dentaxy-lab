import { LayoutGrid, DollarSign, Users, BarChart3, Settings } from 'lucide-react';
import { BaseOverlay } from './BaseOverlay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ModulosOverlayProps {
  open: boolean;
  onClose: () => void;
}

export const ModulosOverlay = ({ open, onClose }: ModulosOverlayProps) => {
  const modules = [
    {
      id: 'facturacion',
      title: 'Facturación',
      description: 'Gestiona pagos y registros financieros',
      icon: DollarSign,
      available: false,
    },
    {
      id: 'pacientes-frecuentes',
      title: 'Pacientes Frecuentes',
      description: 'Acceso rápido a tus pacientes habituales',
      icon: Users,
      available: false,
    },
    {
      id: 'estadisticas',
      title: 'Estadísticas Clínicas',
      description: 'Visualiza métricas y reportes de tu práctica',
      icon: BarChart3,
      available: false,
    },
    {
      id: 'configuracion',
      title: 'Configuración',
      description: 'Ajusta las preferencias de la aplicación',
      icon: Settings,
      available: true,
    },
  ];

  return (
    <BaseOverlay open={open} onClose={onClose} title="Módulos Complementarios" icon={LayoutGrid}>
      <div className="grid gap-4 md:grid-cols-2">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Card 
              key={module.id}
              className={`cursor-pointer transition-all ${
                module.available 
                  ? 'hover:shadow-lg hover:border-primary' 
                  : 'opacity-60 cursor-not-allowed'
              }`}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    {!module.available && (
                      <span className="text-xs text-muted-foreground">Próximamente</span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{module.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 p-6 rounded-lg bg-muted">
        <h3 className="font-semibold mb-2">¿Necesitas algún módulo específico?</h3>
        <p className="text-sm text-muted-foreground">
          Estamos constantemente mejorando DENTAXY. Si tienes sugerencias de módulos que te gustaría ver, 
          contáctanos y lo consideraremos para futuras actualizaciones.
        </p>
      </div>
    </BaseOverlay>
  );
};
