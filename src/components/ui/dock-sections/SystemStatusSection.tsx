import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Server, Database, Zap, Cloud, Shield } from "lucide-react";
import { useState, useEffect } from "react";

const systemMetrics = [
  { label: "CPU", value: 23, icon: Server, color: "from-blue-500 to-blue-600", unit: "%" },
  { label: "RAM", value: 67, icon: Activity, color: "from-green-500 to-green-600", unit: "%" },
  { label: "DB", value: 14, icon: Database, color: "from-purple-500 to-purple-600", unit: "ms" },
  { label: "API", value: 99.9, icon: Zap, color: "from-yellow-500 to-yellow-600", unit: "%" },
  { label: "CDN", value: 28, icon: Cloud, color: "from-indigo-500 to-indigo-600", unit: "ms" },
  { label: "SSL", value: 100, icon: Shield, color: "from-emerald-500 to-emerald-600", unit: "%" },
];

export const SystemStatusSection = () => {
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    // Simular uptime que aumenta
    const interval = setInterval(() => {
      setUptime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${mins}m`;
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-accent/5 border-0 shadow-lg shadow-primary/5">
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-transparent backdrop-blur-xl" />
      
      <CardContent className="relative p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <span className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 rounded-xl w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-emerald-500/25">
            <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
          </span>
          <div>
            <h3 className="text-sm sm:text-base font-black bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
              Estado del Sistema
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              Uptime: {formatUptime(uptime + 2847392)} {/* Base uptime + real time */}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {systemMetrics.map((metric, idx) => {
            const Icon = metric.icon;
            const isHealthy = metric.label === "SSL" ? metric.value === 100 : 
                            metric.label === "API" ? metric.value >= 99 :
                            metric.label === "CPU" || metric.label === "RAM" ? metric.value < 80 :
                            metric.value < 50;
            
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="relative"
              >
                <div className="p-2 sm:p-3 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg border border-border/20">
                  <div className="flex items-center justify-between mb-1">
                    <Icon className={`w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`} />
                    <motion.div
                      className={`w-1.5 h-1.5 rounded-full ${isHealthy ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div className="text-xs font-semibold text-muted-foreground mb-0.5">
                    {metric.label}
                  </div>
                  <div className="text-sm sm:text-base font-black text-foreground">
                    {metric.value}{metric.unit}
                  </div>
                  
                  {/* Progress bar para métricas de porcentaje */}
                  {metric.unit === "%" && (
                    <div className="mt-1 w-full bg-muted/50 rounded-full h-1 overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${metric.color}`}
                        initial={{ width: "0%" }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Status general */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-3 p-2 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20 rounded-lg border border-emerald-200/50 dark:border-emerald-800/30"
        >
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 bg-emerald-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              Todos los sistemas operativos
            </span>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};