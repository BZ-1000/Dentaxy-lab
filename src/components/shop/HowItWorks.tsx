import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, MessageCircle, CheckCircle, Truck } from 'lucide-react';

const steps = [
  {
    icon: ShoppingCart,
    title: 'Selecciona los productos',
    description: 'Explora nuestro catálogo y elige lo que necesitas',
  },
  {
    icon: MessageCircle,
    title: 'Cotiza por WhatsApp',
    description: 'Envíanos tu lista para cotización personalizada',
  },
  {
    icon: CheckCircle,
    title: 'Confirmamos disponibilidad',
    description: 'Verificamos stock y te enviamos precio final',
  },
  {
    icon: Truck,
    title: 'Entrega rápida',
    description: 'Recibe tus productos en tiempo récord',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            ¿Cómo Funciona?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Proceso simple y rápido para obtener tus insumos
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative text-center"
            >
              {/* Connector line (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-emerald-500/50 to-emerald-500/10" />
              )}

              {/* Step number */}
              <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold mb-4">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 mb-4 mx-auto">
                <step.icon className="w-7 h-7 text-emerald-500" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
