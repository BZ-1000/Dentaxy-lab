import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Zap,
  Calendar,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Eye,
  Filter,
  Download,
  RefreshCw,
  PieChart,
  Activity,
  DollarSign,
  Users,
  ShoppingCart,
  Globe
} from 'lucide-react';

interface StatItem {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  format: 'currency' | 'percentage' | 'number';
  icon: any;
  color: string;
  category: 'revenue' | 'users' | 'performance' | 'engagement';
}

interface ChartDataPoint {
  month: string;
  value: number;
  target: number;
}

export const OutcomeStatsModern = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'revenue' | 'users' | 'performance' | 'engagement'>('all');
  const [isAnimating, setIsAnimating] = useState(false);

  const stats: StatItem[] = [
    {
      id: 'revenue',
      label: 'Ingresos Totales',
      value: 284750,
      previousValue: 245600,
      format: 'currency',
      icon: DollarSign,
      color: 'from-emerald-400 to-emerald-600',
      category: 'revenue'
    },
    {
      id: 'conversion',
      label: 'Tasa Conversión',
      value: 3.42,
      previousValue: 2.98,
      format: 'percentage',
      icon: Target,
      color: 'from-blue-400 to-blue-600',
      category: 'performance'
    },
    {
      id: 'users',
      label: 'Usuarios Activos',
      value: 15847,
      previousValue: 14203,
      format: 'number',
      icon: Users,
      color: 'from-purple-400 to-purple-600',
      category: 'users'
    },
    {
      id: 'orders',
      label: 'Pedidos Completados',
      value: 1247,
      previousValue: 1089,
      format: 'number',
      icon: ShoppingCart,
      color: 'from-orange-400 to-red-500',
      category: 'engagement'
    },
    {
      id: 'growth',
      label: 'Crecimiento',
      value: 18.5,
      previousValue: 12.3,
      format: 'percentage',
      icon: TrendingUp,
      color: 'from-pink-400 to-rose-500',
      category: 'performance'
    },
    {
      id: 'reach',
      label: 'Alcance Global',
      value: 89.2,
      previousValue: 76.8,
      format: 'percentage',
      icon: Globe,
      color: 'from-cyan-400 to-teal-500',
      category: 'engagement'
    }
  ];

  const chartData: ChartDataPoint[] = [
    { month: 'Ene', value: 245, target: 220 },
    { month: 'Feb', value: 278, target: 240 },
    { month: 'Mar', value: 312, target: 260 },
    { month: 'Apr', value: 298, target: 280 },
    { month: 'May', value: 385, target: 300 },
    { month: 'Jun', value: 410, target: 320 },
  ];

  const periods = [
    { value: '7d', label: '7 días' },
    { value: '30d', label: '30 días' },
    { value: '90d', label: '90 días' }
  ];

  const categories = [
    { value: 'all', label: 'Todos', icon: BarChart3 },
    { value: 'revenue', label: 'Ingresos', icon: DollarSign },
    { value: 'users', label: 'Usuarios', icon: Users },
    { value: 'performance', label: 'Rendimiento', icon: Activity },
    { value: 'engagement', label: 'Engagement', icon: Target }
  ];

  const filteredStats = selectedCategory === 'all' 
    ? stats 
    : stats.filter(stat => stat.category === selectedCategory);

  const formatValue = (value: number, format: StatItem['format']) => {
    switch (format) {
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
        return value.toLocaleString();
      default:
        return value.toString();
    }
  };

  const getChangePercentage = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };

  const refreshData = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="h-full bg-gradient-to-br from-white via-gray-50/50 to-slate-100/50 border-gray-200/50 shadow-lg rounded-3xl overflow-hidden backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
                variants={isAnimating ? pulseVariants : {}}
                animate={isAnimating ? "pulse" : ""}
              >
                <BarChart3 className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Estadísticas de Resultados
                </CardTitle>
                <p className="text-sm text-gray-500">Análisis de rendimiento detallado</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refreshData}
                  className="h-9 w-9 p-0 rounded-full hover:bg-gray-100"
                >
                  <motion.div
                    animate={isAnimating ? { rotate: 360 } : {}}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </motion.div>
                </Button>
              </motion.div>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 rounded-full hover:bg-gray-100"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Period Selection */}
          <motion.div variants={itemVariants} className="flex gap-1 mb-4 p-1 bg-gray-100/80 rounded-2xl">
            {periods.map((period) => (
              <motion.button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value as any)}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                  selectedPeriod === period.value
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {period.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Category Filters */}
          <motion.div variants={itemVariants} className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <motion.button
                key={category.value}
                onClick={() => setSelectedCategory(category.value as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.value
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'bg-white/80 text-gray-600 hover:bg-white hover:text-gray-900 border border-gray-200/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <category.icon className="w-3 h-3" />
                {category.label}
              </motion.button>
            ))}
          </motion.div>
        </CardHeader>

        <CardContent className="p-6 pt-2">
          {/* Stats Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-2 gap-4 mb-6"
            >
              {filteredStats.map((stat, index) => {
                const changePercent = getChangePercentage(stat.value, stat.previousValue);
                const isPositive = changePercent >= 0;
                
                return (
                  <motion.div
                    key={stat.id}
                    variants={itemVariants}
                    className="p-4 rounded-2xl bg-white/80 border border-gray-200/50 hover:shadow-lg transition-all cursor-pointer group"
                    whileHover={{ scale: 1.02, y: -3 }}
                    custom={index}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <motion.div
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                          isPositive 
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                      >
                        {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {Math.abs(changePercent).toFixed(1)}%
                      </motion.div>
                    </div>
                    
                    <div>
                      <motion.p 
                        className="text-2xl font-bold text-gray-900 mb-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                      >
                        {formatValue(stat.value, stat.format)}
                      </motion.p>
                      <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                      <p className="text-xs text-gray-500">
                        Anterior: {formatValue(stat.previousValue, stat.format)}
                      </p>
                    </div>

                    {/* Mini Progress Bar */}
                    <div className="mt-3">
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${stat.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((stat.value / (stat.value + stat.previousValue)) * 100, 100)}%` }}
                          transition={{ delay: index * 0.1 + 0.7, duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Chart Section */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/60 rounded-2xl p-4 border border-gray-200/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-indigo-600" />
                Tendencia de Rendimiento
              </h4>
              <Badge className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white border-0 text-xs">
                Últimos 6 meses
              </Badge>
            </div>

            {/* Simple Chart Representation */}
            <div className="grid grid-cols-6 gap-2 h-32">
              {chartData.map((data, index) => {
                const maxValue = Math.max(...chartData.map(d => Math.max(d.value, d.target)));
                const valueHeight = (data.value / maxValue) * 100;
                const targetHeight = (data.target / maxValue) * 100;

                return (
                  <div key={data.month} className="flex flex-col items-center justify-end gap-1">
                    <div className="flex flex-col justify-end items-center w-full h-full gap-1">
                      {/* Target Bar */}
                      <motion.div
                        className="w-3 bg-gray-300 rounded-full opacity-60"
                        initial={{ height: 0 }}
                        animate={{ height: `${targetHeight}%` }}
                        transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
                      />
                      {/* Value Bar */}
                      <motion.div
                        className="w-4 bg-gradient-to-t from-indigo-400 to-purple-500 rounded-full shadow-sm"
                        initial={{ height: 0 }}
                        animate={{ height: `${valueHeight}%` }}
                        transition={{ delay: index * 0.1 + 0.2, duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{data.month}</span>
                  </div>
                );
              })}
            </div>

            {/* Chart Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full" />
                <span className="text-gray-600">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full" />
                <span className="text-gray-600">Objetivo</span>
              </div>
            </div>
          </motion.div>

          {/* Summary Stats */}
          <motion.div 
            variants={itemVariants}
            className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/50"
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <motion.p 
                  className="text-2xl font-bold text-indigo-600 mb-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                >
                  +24.5%
                </motion.p>
                <p className="text-xs text-gray-600">Crecimiento Promedio</p>
              </div>
              <div>
                <motion.p 
                  className="text-2xl font-bold text-purple-600 mb-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
                >
                  94%
                </motion.p>
                <p className="text-xs text-gray-600">Objetivos Alcanzados</p>
              </div>
              <div>
                <motion.p 
                  className="text-2xl font-bold text-emerald-600 mb-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, type: "spring", stiffness: 200 }}
                >
                  A+
                </motion.p>
                <p className="text-xs text-gray-600">Calificación</p>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};