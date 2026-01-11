import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Package, Syringe, Trash2 } from 'lucide-react';
import ProductCard from './ProductCard';

interface Category {
  name: string;
  icon: React.ElementType;
  gradient: string;
  products: string[];
}

const categories: Category[] = [
  {
    name: 'Protección y Barrera',
    icon: Shield,
    gradient: 'from-emerald-500 to-emerald-600',
    products: [
      'Guantes de látex',
      'Guantes de nitrilo',
      'Cubrebocas quirúrgicos',
    ]
  },
  {
    name: 'Material de Curación y Consumo',
    icon: Package,
    gradient: 'from-blue-500 to-blue-600',
    products: [
      'Gasas',
      'Algodón dental',
      'Rollos de algodón',
      'Campos quirúrgicos',
      'Campos fenestrados',
    ]
  },
  {
    name: 'Agujas (uso dental)',
    icon: Syringe,
    gradient: 'from-purple-500 to-purple-600',
    products: [
      'Agujas dentales cortas',
      'Agujas dentales largas',
    ]
  },
  {
    name: 'Desechables Clínicos',
    icon: Trash2,
    gradient: 'from-orange-500 to-orange-600',
    products: [
      'Vasos desechables',
      'Eyector de saliva',
      'Puntas de succión',
      'Diques de hule',
    ]
  }
];

const ProductGrid = () => {
  return (
    <section className="py-16 sm:py-24 bg-muted/30">
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
            Catálogo de Productos
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Insumos de alta calidad para profesionales de la salud
          </p>
        </motion.div>

        {/* Categories */}
        <div className="space-y-16">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg`}>
                  <category.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
                  {category.name}
                </h3>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {category.products.map((product, productIndex) => (
                  <ProductCard
                    key={product}
                    name={product}
                    index={productIndex}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
