import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  name: string;
  image?: string;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, image, index = 0 }) => {
  const handleWhatsAppClick = () => {
    // Placeholder - will be configured later
    const message = encodeURIComponent(`Hola, me interesa cotizar: ${name}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-card border border-border rounded-xl overflow-hidden hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300"
    >
      {/* Product Image */}
      <div className="aspect-square bg-muted/30 flex items-center justify-center p-8 relative overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <Package className="w-16 h-16 text-muted-foreground/30 group-hover:text-emerald-500/30 transition-colors duration-300" />
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <h3 className="font-medium text-foreground text-center line-clamp-2 min-h-[3rem]">
          {name}
        </h3>
        
        <p className="text-xs text-muted-foreground text-center">
          Precios disponibles por volumen
        </p>

        <Button
          onClick={handleWhatsAppClick}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-medium py-2 rounded-lg transition-all duration-300"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Cotizar por WhatsApp
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
