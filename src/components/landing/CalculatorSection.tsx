import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Calculator, DollarSign, Clock, TrendingUp, Users, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";

export const CalculatorSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-20%" });
  const navigate = useNavigate();

  const [dentistas, setDentistas] = useState([5]);
  const [historiasPorDia, setHistoriasPorDia] = useState([10]);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Reset when out of view
  useEffect(() => {
    if (!isInView) {
      setHasAnimated(false);
    } else if (!hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView]);

  // Cálculos
  const costoHora = 25; // USD
  const diasTrabajo = 22;
  const tiempoTradicional = 45; // minutos
  const tiempoDentaxy = 8; // minutos
  const ahorroTiempo = tiempoTradicional - tiempoDentaxy;

  const ahorroMinutosDia = dentistas[0] * historiasPorDia[0] * ahorroTiempo;
  const ahorroHorasDia = ahorroMinutosDia / 60;
  const ahorroMensual = ahorroHorasDia * diasTrabajo * costoHora;
  const ahorroAnual = ahorroMensual * 12;

  const costoMensualDentaxy = 29 * dentistas[0];
  const roiMensual = costoMensualDentaxy > 0 
    ? ((ahorroMensual - costoMensualDentaxy) / costoMensualDentaxy) * 100 
    : 0;

  return (
    <section ref={ref} className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-12 snap-start">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Calculator className="w-4 h-4" />
          Calculadora de ROI
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          ¿Cuánto puedes ahorrar con Dentaxy?
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Personaliza los valores según tu clínica y descubre el impacto real en tu productividad.
        </p>
      </motion.div>

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="backdrop-blur-xl bg-card/80 rounded-2xl p-6 border border-border shadow-lg"
        >
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Tu Clínica</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">Dentistas</label>
                <span className="text-2xl font-bold text-primary">{dentistas[0]}</span>
              </div>
              <Slider
                value={dentistas}
                onValueChange={setDentistas}
                max={50}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">Historias/Día</label>
                <span className="text-2xl font-bold text-primary">{historiasPorDia[0]}</span>
              </div>
              <Slider
                value={historiasPorDia}
                onValueChange={setHistoriasPorDia}
                max={30}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="pt-4 border-t border-border text-xs text-muted-foreground space-y-1">
              <p>• Costo por hora: ${costoHora} USD</p>
              <p>• Días laborales/mes: {diasTrabajo}</p>
              <p>• Tiempo tradicional: {tiempoTradicional} min/historia</p>
              <p>• Con Dentaxy: {tiempoDentaxy} min/historia</p>
            </div>
          </div>
        </motion.div>

        {/* Results Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-2 space-y-4"
        >
          {/* ROI Highlight */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm mb-1">ROI Mensual</p>
                <motion.p
                  key={roiMensual}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-5xl font-bold"
                >
                  {roiMensual.toFixed(0)}%
                </motion.p>
                <p className="text-emerald-100 text-sm mt-1">Retorno de inversión</p>
              </div>
              <TrendingUp className="w-16 h-16 text-emerald-200/50" />
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.4 }}
              className="backdrop-blur-xl bg-blue-500/10 rounded-xl p-4 border border-blue-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">Ahorro/Día</h4>
              </div>
              <p className="text-2xl font-bold text-blue-600">{ahorroHorasDia.toFixed(1)}h</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.5 }}
              className="backdrop-blur-xl bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <h4 className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Ahorro/Mes</h4>
              </div>
              <p className="text-2xl font-bold text-emerald-600">${ahorroMensual.toLocaleString()}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.6 }}
              className="backdrop-blur-xl bg-purple-500/10 rounded-xl p-4 border border-purple-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300">Ahorro/Año</h4>
              </div>
              <p className="text-2xl font-bold text-purple-600">${ahorroAnual.toLocaleString()}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.7 }}
              className="backdrop-blur-xl bg-orange-500/10 rounded-xl p-4 border border-orange-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-orange-500" />
                <h4 className="text-sm font-medium text-orange-700 dark:text-orange-300">Costo Dentaxy</h4>
              </div>
              <p className="text-2xl font-bold text-orange-600">${costoMensualDentaxy}/mes</p>
            </motion.div>
          </div>

          {/* Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.8 }}
            className="backdrop-blur-xl bg-card/80 rounded-xl p-4 border border-border"
          >
            <h4 className="text-sm font-medium text-foreground mb-3">Tiempo por Historia Clínica</h4>
            <div className="flex gap-3">
              <div className="flex-1 bg-red-500/10 rounded-lg p-3 border border-red-500/20 text-center">
                <p className="text-xs text-red-600 font-medium mb-1">Tradicional</p>
                <p className="text-xl font-bold text-red-600">{tiempoTradicional} min</p>
              </div>
              <div className="flex-1 bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20 text-center">
                <p className="text-xs text-emerald-600 font-medium mb-1">Con Dentaxy</p>
                <p className="text-xl font-bold text-emerald-600">{tiempoDentaxy} min</p>
              </div>
              <div className="flex-1 bg-blue-500/10 rounded-lg p-3 border border-blue-500/20 text-center">
                <p className="text-xs text-blue-600 font-medium mb-1">Ahorro</p>
                <p className="text-xl font-bold text-blue-600">{ahorroTiempo} min</p>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.9 }}
          >
            <Button
              onClick={() => navigate("/hub")}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl py-6 text-base font-medium shadow-lg shadow-emerald-500/20"
            >
              Comenzar a Ahorrar Tiempo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
