import React from "react";
import { AIInputWithLoading } from "@/components/ui/ai-input-with-loading";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles, Calendar, Zap, Activity, AlertCircle, MapPin, ShieldCheck, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

interface CaracteristicasDolorProps {
  dolor: {
    fechaInicio: string;
    condicionAparicion: string;
    frecuencia: string;
    caracter: string;
    intensidad: string;
    localizacion: {
      tipo: string;
      descripcion: string;
    };
    atenuacion: string;
    causaProvocado?: string;
    ubicacion?: string;
  };
  onDolorChange: (field: string, value: string | any) => void;
}

// --- Micro-Components ---

const ChatLabel = ({ children, icon: Icon }: { children: React.ReactNode, icon?: any }) => (
  <div className="flex items-start gap-3 mb-4 animate-in fade-in slide-in-from-left-2 duration-500">
    <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center -ml-1 -mt-2">
      {Icon ? (
        <div className="w-full h-full flex items-center justify-center text-zinc-800 dark:text-zinc-200">
          <Icon className="w-5 h-5" />
        </div>
      ) : (
        <img src="/dentaxy-ai-avatar.png" alt="Dentaxy AI" className="w-full h-full object-contain" />
      )}
    </div>
    <div className="bg-gray-100 dark:bg-zinc-800 px-5 py-3 rounded-2xl rounded-tl-sm text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm border border-gray-200/50 dark:border-white/5 leading-relaxed max-w-lg">
      {children}
    </div>
  </div>
);

const ChipSelector = ({ options, value, onChange, className }: { options: { label: string, value: string }[], value: string, onChange: (val: string) => void, className?: string }) => (
  <div className={cn("flex flex-wrap gap-2", className)}>
    {options.map((opt) => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        className={cn(
          "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
          value === opt.value
            ? "bg-zinc-50 border-2 border-zinc-900 text-zinc-900 shadow-sm transform scale-105" // Active: Thick Border + Black Text (No Bold)
            : "bg-white border border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 hover:bg-zinc-50" // Inactive
        )}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

const GoogleInput = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("relative bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-zinc-500/20 focus-within:border-zinc-500 transition-all overflow-hidden", className)}>
    {children}
  </div>
);

// --- Component ---

const CaracteristicasDolor = ({ dolor, onDolorChange }: CaracteristicasDolorProps) => {
  const defaultLocalizacion = "Localizado en ";
  const defaultCausaProvocado = "Provocado con ";

  return (
    <div className="space-y-12">

      {/* 1. Timeline & Aparición */}
      <section className="space-y-6">
        <div>
          <ChatLabel>¿Desde <strong>cuándo</strong> siente este dolor y cómo aparece?</ChatLabel>
          <div className="pl-11 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Fecha de Inicio</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-zinc-800 transition-colors">
                  <Calendar className="w-5 h-5 opacity-80" strokeWidth={1.5} />
                </div>
                <input
                  type="date"
                  value={dolor.fechaInicio}
                  onChange={(e) => onDolorChange("fechaInicio", e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border-2 border-transparent hover:bg-zinc-100 focus:bg-white focus:border-zinc-900/10 rounded-2xl outline-none transition-all duration-300 font-medium text-zinc-900 shadow-sm cursor-pointer appearance-none dark:bg-zinc-900/50 dark:text-zinc-100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Modo de Aparición</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => onDolorChange("condicionAparicion", "espontaneo")}
                  className={cn(
                    "p-4 rounded-2xl border text-left transition-all duration-200", // Increased padding/radius
                    dolor.condicionAparicion === "espontaneo"
                      ? "bg-indigo-50 border-2 border-indigo-600 text-indigo-900 shadow-sm ring-0" // Hollow Colored Active
                      : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50"
                  )}
                >
                  <div className={cn("font-bold text-sm", dolor.condicionAparicion === "espontaneo" ? "text-indigo-700" : "text-zinc-700")}>Espontáneo</div>
                  <div className="text-[10px] opacity-70">Aparece solo</div>
                </button>
                <button
                  onClick={() => onDolorChange("condicionAparicion", "provocado")}
                  className={cn(
                    "p-4 rounded-2xl border text-left transition-all duration-200",
                    dolor.condicionAparicion === "provocado"
                      ? "bg-amber-50 border-2 border-amber-600 text-amber-900 shadow-sm ring-0" // Hollow Colored Active
                      : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50"
                  )}
                >
                  <div className={cn("font-bold text-sm", dolor.condicionAparicion === "provocado" ? "text-amber-700" : "text-zinc-700")}>Provocado</div>
                  <div className="text-[10px] opacity-70">Requiere estímulo</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Causa del Provocado (Conditional) */}
        {dolor.condicionAparicion === "provocado" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
            <ChatLabel>¿Qué <strong>estímulo</strong> provoca el dolor?</ChatLabel>
            <div className="pl-11 relative">
              <AIInputWithLoading
                value={dolor.causaProvocado || defaultCausaProvocado}
                onChange={(val) => {
                  onDolorChange("causaProvocado", val.startsWith(defaultCausaProvocado) ? val : defaultCausaProvocado + val);
                }}
                className="bg-transparent"
              />
            </div>
          </motion.div>
        )}
      </section>



      {/* 2. Cualidades del Dolor */}
      <section>
        <ChatLabel>Descríbeme las <strong>cualidades</strong> del dolor:</ChatLabel>
        <div className="pl-11 space-y-6">

          {/* Frecuencia */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Frecuencia</span>
            <ChipSelector
              value={dolor.frecuencia}
              onChange={(val) => onDolorChange("frecuencia", val)}
              options={[
                { label: "Intermitente (Va y viene)", value: "intermitente" },
                { label: "Continua (Todo el tiempo)", value: "continua" }
              ]}
            />
          </div>

          {/* Carácter */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Tipo de Dolor (Carácter)</span>
            <ChipSelector
              value={dolor.caracter}
              onChange={(val) => onDolorChange("caracter", val)}
              options={[
                { label: "Pulsátil (Latido)", value: "pulsatil" },
                { label: "Sordo (Molestia)", value: "sordo" },
                { label: "Quemante (Ardor)", value: "quemante" },
                { label: "Opresivo (Presión)", value: "opresivo" }
              ]}
            />
          </div>

          {/* Intensidad (Slider Visual) */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Intensidad</span>
            <div className="flex gap-2">
              {['leve', 'moderada', 'severa'].map((level, idx) => (
                <button
                  key={level}
                  onClick={() => onDolorChange("intensidad", level)}
                  className={cn(
                    "flex-1 py-3 rounded-xl border transition-all relative overflow-hidden",
                    dolor.intensidad === level
                      ? level === 'leve' ? "bg-green-100 border-green-300 text-green-700" :
                        level === 'moderada' ? "bg-yellow-100 border-yellow-300 text-yellow-700" :
                          "bg-red-100 border-red-300 text-red-700"
                      : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-400"
                  )}
                >
                  <span className="relative z-10 font-bold capitalize">{level}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      <hr className="border-dashed border-gray-200 dark:border-zinc-800" />

      {/* 3. Localización */}
      <section>
        <ChatLabel>¿Dónde se <strong>localiza</strong> exactamente?</ChatLabel>
        <div className="pl-11 space-y-4">
          <ChipSelector
            value={dolor.ubicacion || ''}
            onChange={(val) => {
              onDolorChange("ubicacion", val);
              // Sync with Redaction Logic (Capitalized)
              onDolorChange("localizacion", {
                ...dolor.localizacion,
                tipo: val === 'localizado' ? 'Localizado' : val === 'irradiado' ? 'Irradiado' : ''
              });
            }}
            options={[
              { label: "Localizado (Punto exacto)", value: "localizado" },
              { label: "Irradiado (Se expande)", value: "irradiado" }
            ]}
          />

          {dolor.ubicacion === 'localizado' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative">
              <AIInputWithLoading
                value={dolor.localizacion?.descripcion || defaultLocalizacion}
                onChange={(val) => {
                  const finalVal = val.startsWith(defaultLocalizacion) ? val : defaultLocalizacion + val;
                  onDolorChange("localizacion", { ...dolor.localizacion, descripcion: finalVal });
                }}
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* 4. Atenuación */}
      <section>
        <ChatLabel>¿Hay algo que lo <strong>alivie</strong>?</ChatLabel>
        <div className="pl-11 relative">
          <AIInputWithLoading
            value={dolor.atenuacion}
            onChange={(val) => onDolorChange("atenuacion", val)}
            placeholder="Ej. analgésicos, compresas frías..."
          />
        </div>
      </section>

    </div>
  );
};

export default CaracteristicasDolor;
