import { Home, Plus, Calendar, Search, FileText, Users } from 'lucide-react';
import { BaseOverlay } from './BaseOverlay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppointments } from '@/hooks/useAppointments';

interface HomeOverlayProps {
  open: boolean;
  onClose: () => void;
}

export const HomeOverlay = ({ open, onClose }: HomeOverlayProps) => {
  const { getTodayAppointments } = useAppointments();
  const todayAppointments = getTodayAppointments();

  const userName = 'Usuario';
  const currentDate = new Date().toLocaleDateString('es-MX', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  // Get stored forms count
  const savedFormsCount = () => {
    try {
      const forms = JSON.parse(localStorage.getItem('savedForms') || '[]');
      return forms.length;
    } catch {
      return 0;
    }
  };

  return (
    <BaseOverlay open={open} onClose={onClose} title="Panel Principal" icon={Home}>
      <div className="space-y-6">
        {/* Greeting */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold mb-2">
            {greeting()}, Dr. {userName} 👋
          </h1>
          <p className="text-muted-foreground">{currentDate}</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Citas Hoy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="h-8 w-8 text-primary" />
                <span className="text-3xl font-bold">{todayAppointments.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Historias Clínicas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FileText className="h-8 w-8 text-primary" />
                <span className="text-3xl font-bold">{savedFormsCount()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pacientes Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-8 w-8 text-primary" />
                <span className="text-3xl font-bold">{savedFormsCount()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Accesos Rápidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Nueva Historia Clínica
            </Button>
            <Button className="w-full justify-start" variant="outline" size="lg">
              <Calendar className="mr-2 h-5 w-5" />
              Ver Agenda del Día
            </Button>
            <Button className="w-full justify-start" variant="outline" size="lg">
              <Search className="mr-2 h-5 w-5" />
              Buscar Paciente
            </Button>
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        {todayAppointments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Citas de Hoy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {todayAppointments.map((apt) => (
                  <div 
                    key={apt.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                  >
                    <div>
                      <p className="font-medium">{apt.patient_name}</p>
                      <p className="text-sm text-muted-foreground">{apt.type}</p>
                    </div>
                    <span className="text-sm font-medium">{apt.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </BaseOverlay>
  );
};
