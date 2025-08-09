"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label, Pie, PieChart } from "recharts";
import {
  Users,
  ClipboardCheck,
  Timer,
  Award,
  ArrowUp,
  GitCommit,
  User,
} from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

// --- Tipos de Datos ---
interface User {
  name: string;
  avatar: string;
  time: number;
}

interface Update {
  version: string;
  description: string;
  date: string;
}

interface Contributor {
  name: string;
  avatar: string;
  role: string;
}

// --- Datos Simulados (Mock Data) ---
const topUsersData: User[] = [
  { name: "Ana López", avatar: "/placeholder.svg", time: 1240 },
  { name: "Carlos García", avatar: "/placeholder.svg", time: 1180 },
  { name: "Laura Martínez", avatar: "/placeholder.svg", time: 1150 },
  { name: "Javier Rodríguez", avatar: "/placeholder.svg", time: 1090 },
  { name: "Sofía Hernández", avatar: "/placeholder.svg", time: 1050 },
];

const updatesData: Update[] = [
  {
    version: "v1.2.5",
    description: "Mejora en la interfaz de usuario del dashboard de estadísticas.",
    date: "Hace 2 horas",
  },
  {
    version: "v1.2.4",
    description: "Optimización de la carga inicial de la aplicación.",
    date: "Ayer",
  },
  {
    version: "v1.2.3",
    description: "Corrección de errores menores en el formulario de historia clínica.",
    date: "Hace 3 días",
  },
];

const contributorsData: Contributor[] = [
    { name: "Dr. Ricardo Vargas", avatar: "/placeholder.svg", role: "Consultor Dental" },
    { name: "Ing. Sofía Castillo", avatar: "/placeholder.svg", role: "Desarrolladora Principal" },
    { name: "Lic. Andrea Meza", avatar: "/placeholder.svg", role: "Diseñadora UX/UI" },
    { name: "Usuario Beta", avatar: "/placeholder.svg", role: "Tester" },
];

const technologiesData = [
  { name: "TypeScript", value: 65, fill: "hsl(var(--primary))" },
  { name: "React", value: 20, fill: "hsl(var(--secondary))" },
  { name: "Tailwind CSS", value: 10, fill: "hsl(var(--muted-foreground))" },
  { name: "Otros", value: 5, fill: "hsl(var(--muted))" },
];

const chartConfig = {
  value: {
    label: "Porcentaje",
  },
  TypeScript: {
    label: "TypeScript",
    color: "hsl(var(--primary))",
  },
  React: {
    label: "React",
    color: "hsl(var(--secondary))",
  },
  "Tailwind CSS": {
    label: "Tailwind CSS",
    color: "hsl(var(--muted-foreground))",
  },
  Otros: {
    label: "Otros",
    color: "hsl(var(--muted))",
  },
};


// --- Componente Principal ---
const EstadisticasContent = () => {
  const [activeUsers, setActiveUsers] = useState(0);
  const [copyClicks, setCopyClicks] = useState(42);
  const [avgTime, setAvgTime] = useState(15);
  const totalTechnologiesValue = technologiesData.reduce((acc, curr) => acc + curr.value, 0);

  useEffect(() => {
    // Simulación de usuarios activos en tiempo real
    const interval = setInterval(() => {
      setActiveUsers((prev) => Math.max(5, prev + Math.floor(Math.random() * 3) - 1));
      setCopyClicks((prev) => prev + Math.floor(Math.random() * 3));
      setAvgTime((prev) => parseFloat((prev + (Math.random() - 0.5) * 0.5).toFixed(1)));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // --- Renderizado de Componentes UI ---

  const MetricCard = ({ icon, title, value, unit }) => (
    <Card className="flex-1 min-w-[150px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          <span className="text-xs text-muted-foreground ml-1">{unit}</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 md:p-6 bg-background text-foreground space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Sección de Logros */}
      <Card className="w-full bg-primary/10 border-primary/20">
        <CardHeader>
            <div className="flex items-center space-x-4">
                <Award className="w-10 h-10 text-primary" />
                <div>
                    <CardTitle>Rango: Maestro Dentista Digital</CardTitle>
                    <CardDescription>¡Sigue así! Estás entre el 10% de los usuarios más activos.</CardDescription>
                </div>
            </div>
        </CardHeader>
      </Card>

      {/* Métricas en Vivo */}
      <section>
        <h2 className="text-xl font-bold mb-4">Métricas en Vivo</h2>
        <div className="flex flex-wrap gap-4">
          <MetricCard icon={<Users className="h-4 w-4 text-muted-foreground" />} title="Usuarios Activos" value={activeUsers} unit="en línea" />
          <MetricCard icon={<ClipboardCheck className="h-4 w-4 text-muted-foreground" />} title="Redacciones Copiadas" value={copyClicks} unit="clicks" />
          <MetricCard icon={<Timer className="h-4 w-4 text-muted-foreground" />} title="Sesión Promedio" value={avgTime} unit="min" />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            {/* Ranking de Usuarios */}
            <section>
                <h2 className="text-xl font-bold mb-4">Ranking de Usuarios</h2>
                <Card>
                    <CardContent className="p-4">
                        <Carousel
                            opts={{ align: "start", loop: true }}
                            orientation="vertical"
                            plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
                            className="w-full h-48"
                        >
                            <CarouselContent className="-mt-1 h-full">
                                {topUsersData.map((user, index) => (
                                    <CarouselItem key={index} className="pt-1 basis-1/3">
                                        <div className="p-1">
                                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-lg text-primary">{index + 1}</span>
                                                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                                                    <p className="font-semibold">{user.name}</p>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Timer className="w-4 h-4" />
                                                    <span>{user.time} min</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                    </CardContent>
                </Card>
            </section>
            
            {/* Colaboradores Destacados */}
            <section>
                <h2 className="text-xl font-bold mb-4">Colaboradores Destacados</h2>
                <Card>
                    <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {contributorsData.map((contributor, index) => (
                            <div key={index} className="flex flex-col items-center text-center">
                                <img src={contributor.avatar} alt={contributor.name} className="w-16 h-16 rounded-full mb-2" />
                                <p className="font-semibold text-sm">{contributor.name}</p>
                                <p className="text-xs text-muted-foreground">{contributor.role}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </section>
        </div>

        <div className="lg:col-span-1 space-y-6">
            {/* Tecnologías del Proyecto */}
            <section>
                <h2 className="text-xl font-bold mb-4">Tecnologías del Proyecto</h2>
                <Card className="flex flex-col">
                    <CardHeader className="items-center pb-0">
                        <CardTitle>Distribución de Código</CardTitle>
                        <CardDescription>Lenguajes y frameworks</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 pb-0">
                        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                                <Pie data={technologiesData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80}>
                                  <Label
                                    content={({ viewBox }) => {
                                      if (viewBox) {
                                        const { cx, cy } = viewBox;
                                        return (
                                          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                                            <tspan x={cx} y={cy - 10} className="text-2xl font-bold fill-foreground">
                                              {totalTechnologiesValue}%
                                            </tspan>
                                            <tspan x={cx} y={cy + 10} className="text-sm text-muted-foreground">
                                              Total
                                            </tspan>
                                          </text>
                                        );
                                      }
                                    }}
                                  />
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                    <CardContent className="p-4 text-sm">
                      <div className="flex flex-col gap-2">
                        {technologiesData.map(tech => (
                          <div key={tech.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tech.fill }} />
                              <span>{tech.name}</span>
                            </div>
                            <span>{tech.value}%</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                </Card>
            </section>

            {/* Eventos y Actualizaciones */}
            <section>
                <h2 className="text-xl font-bold mb-4">Eventos y Actualizaciones</h2>
                <Card>
                    <CardContent className="p-4 space-y-4">
                        {updatesData.map((update, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="p-2 bg-muted rounded-full">
                                    <GitCommit className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{update.version}</p>
                                    <p className="text-xs text-muted-foreground">{update.description}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{update.date}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </section>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasContent;