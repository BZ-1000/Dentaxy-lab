import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Lock } from 'lucide-react';

const ShopFooter = () => {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Private notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
            <Lock className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-500">Acceso Privado</span>
          </div>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Dentaxy Shop se encuentra en fase privada de desarrollo.
          </p>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-border mb-8" />

        {/* Footer bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-foreground">Dentaxy Shop</span>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} DENTAXY Technologies. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ShopFooter;
