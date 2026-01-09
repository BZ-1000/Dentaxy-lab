import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Calculator, Clock, Users, ArrowRight } from "lucide-react";
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

  // Cálculos de tiempo
  const diasTrabajo = 22;
  const tiempoTradicional = 45; // minutos
  const tiempoDentaxy = 8; // minutos
  const ahorroTiempo = tiempoTradicional - tiempoDentaxy;

  const ahorroMinutosDia = dentistas[0] * historiasPorDia[0] * ahorroTiempo;
  const ahorroHorasDia = ahorroMinutosDia / 60;
  const ahorroHorasMes = ahorroHorasDia * diasTrabajo;
  const ahorroHorasAnio = ahorroHorasMes * 12;

  return (
    <section 
      ref={ref} 
      className="min-h-screen w-full max-w-full flex flex-col items-center justify-center bg-background px-4 sm:px-6 py-12 sm:py-16 snap-start overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6 sm:mb-8 px-4"
      >
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-3 sm:mb-4">
          <Calculator className="w-3 h-3 sm:w-4 sm:h-4" />
          Calculadora de Tiempo
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">
          ¿Cuánto tiempo puedes ahorrar?
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
          Personaliza los valores según tu clínica y descubre el impacto real.
        </p>
      </motion.div>

      <div className="w-full max-w-4xl mx-auto">
        {/* Configuration Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="backdrop-blur-xl bg-card/80 rounded-2xl p-4 sm:p-6 border border-border shadow-lg mb-4 sm:mb-6"
        >
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <h3 className="font-semibold text-foreground text-sm sm:text-base">Configura tu clínica</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs sm:text-sm font-medium text-foreground">Número de dentistas</label>
                <span className="text-xl sm:text-2xl font-bold text-primary">{dentistas[0]}</span>
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
                <label className="text-xs sm:text-sm font-medium text-foreground">Historias por día</label>
                <span className="text-xl sm:text-2xl font-bold text-primary">{historiasPorDia[0]}</span>
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
          </div>
        </motion.div>

        {/* Results Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-xl bg-blue-500/10 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-blue-500/20 text-center"
          >
            <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-blue-500 mx-auto mb-1 sm:mb-2" />
            <p className="text-[10px] sm:text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">Ahorro/Día</p>
            <motion.p 
              key={ahorroHorasDia}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-lg sm:text-3xl font-bold text-blue-600"
            >
              {ahorroHorasDia.toFixed(1)}h
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-xl bg-emerald-500/10 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-emerald-500/20 text-center"
          >
            <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-500 mx-auto mb-1 sm:mb-2" />
            <p className="text-[10px] sm:text-xs font-medium text-emerald-700 dark:text-emerald-300 mb-1">Ahorro/Mes</p>
            <motion.p 
              key={ahorroHorasMes}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-lg sm:text-3xl font-bold text-emerald-600"
            >
              {ahorroHorasMes.toFixed(0)}h
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.5 }}
            className="backdrop-blur-xl bg-purple-500/10 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-purple-500/20 text-center"
          >
            <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-purple-500 mx-auto mb-1 sm:mb-2" />
            <p className="text-[10px] sm:text-xs font-medium text-purple-700 dark:text-purple-300 mb-1">Ahorro/Año</p>
            <motion.p 
              key={ahorroHorasAnio}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-lg sm:text-3xl font-bold text-purple-600"
            >
              {ahorroHorasAnio.toFixed(0)}h
            </motion.p>
          </motion.div>
        </div>

        {/* Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6 }}
          className="backdrop-blur-xl bg-card/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-border mb-4 sm:mb-6"
        >
          <h4 className="text-xs sm:text-sm font-medium text-foreground mb-3 text-center">Tiempo por Historia Clínica</h4>
          <div className="flex gap-2 sm:gap-3">
            <div className="flex-1 bg-red-500/10 rounded-lg p-2 sm:p-3 border border-red-500/20 text-center">
              <p className="text-[10px] sm:text-xs text-red-600 font-medium mb-1">Tradicional</p>
              <p className="text-base sm:text-xl font-bold text-red-600">{tiempoTradicional} min</p>
            </div>
            <div className="flex-1 bg-emerald-500/10 rounded-lg p-2 sm:p-3 border border-emerald-500/20 text-center">
              <p className="text-[10px] sm:text-xs text-emerald-600 font-medium mb-1">Con Dentaxy</p>
              <p className="text-base sm:text-xl font-bold text-emerald-600">{tiempoDentaxy} min</p>
            </div>
            <div className="flex-1 bg-blue-500/10 rounded-lg p-2 sm:p-3 border border-blue-500/20 text-center">
              <p className="text-[10px] sm:text-xs text-blue-600 font-medium mb-1">Ahorro</p>
              <p className="text-base sm:text-xl font-bold text-blue-600">{ahorroTiempo} min</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.7 }}
        >
          <Button
            onClick={() => navigate("/hub")}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl py-5 sm:py-6 text-sm sm:text-base font-medium shadow-lg shadow-emerald-500/20"
          >
            Comenzar a Ahorrar Tiempo
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
