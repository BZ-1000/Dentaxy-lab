/**
 * PlaceholderView.tsx
 * Vista placeholder para módulos en construcción
 * Muestra información del rol y modulos próximos — no es un 404, es un "coming soon" elegante
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Construction, ArrowLeft, ChevronRight } from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import UAOLayout from '../components/UAOLayout';

interface PlaceholderViewProps {
  moduloNombre: string;
  descripcion?: string;
  proximamente?: string[];
}

const PlaceholderContent: React.FC<PlaceholderViewProps> = ({
  moduloNombre,
  descripcion,
  proximamente = [],
}) => {
  const navigate = useNavigate();
  const { rolData } = useDemo();

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-lg mx-auto pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* Icono */}
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: rolData?.color ? rolData.color + '15' : '#F4F4F5' }}
          >
            <Construction className="h-8 w-8" style={{ color: rolData?.color ?? '#71717A' }} />
          </div>

          <h1 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
            {moduloNombre}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
            {descripcion ?? 'Este módulo está siendo implementado como parte de la Fase 2 del demo DentaXy UAO.'}
          </p>

          {/* Próximamente */}
          {proximamente.length > 0 && (
            <div className="text-left bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 mb-6">
              <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide mb-3">
                Próximamente en este módulo
              </p>
              <div className="space-y-2">
                {proximamente.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="flex items-center gap-2"
                  >
                    <ChevronRight className="h-3.5 w-3.5 shrink-0" style={{ color: rolData?.color }} />
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mx-auto px-4 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>
        </motion.div>
      </div>
    </div>
  );
};

const PlaceholderView: React.FC<PlaceholderViewProps> = (props) => (
  <UAOLayout>
    <PlaceholderContent {...props} />
  </UAOLayout>
);

export default PlaceholderView;
