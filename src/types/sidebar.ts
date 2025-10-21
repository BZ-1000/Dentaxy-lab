export interface Appointment {
  id: string;
  patient_name: string;
  date: string;
  time: string;
  type: 'consulta' | 'revision' | 'limpieza' | 'cirugia' | 'urgencia';
  notes?: string;
  status: 'pendiente' | 'completada' | 'cancelada';
  color: string;
  created_at: string;
  user_id?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'pendiente' | 'idea' | 'tarea';
  priority: 'alta' | 'media' | 'baja';
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  patient_name: string;
  service: string;
  amount: number;
  currency: string;
  date: string;
  status: 'pagado' | 'pendiente' | 'cancelado';
  notes?: string;
}

export interface FrequentPatient {
  id: string;
  name: string;
  last_visit: string;
  visit_count: number;
  avatar?: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: 'formulario' | 'agenda' | 'reportes' | 'general';
  content: string;
  media?: {
    type: 'image' | 'gif' | 'video';
    url: string;
  };
  steps?: string[];
  duration?: string;
}

export interface DashboardMetrics {
  patients_today: number;
  appointments_today: number;
  active_histories: number;
  last_updated: string;
}

export interface UserPreferences {
  calendar_view: 'day' | 'week' | 'month';
  notifications_enabled: boolean;
  theme: 'light' | 'dark';
}

export interface FormSection {
  id: string;
  title: string;
  scrollTo: string;
}
