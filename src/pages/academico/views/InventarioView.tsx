/**
 * InventarioView.tsx — Fase 5B
 * Sistema de inventario de materiales dentales — todos los nodos UAO
 * Alertas de stock crítico, registro de movimientos, órdenes de compra
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, AlertTriangle, CheckCircle2, Plus,
  Search, Filter, TrendingDown, ArrowDown,
  RefreshCw, ShoppingCart, Building2, X
} from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import UAOLayout from '../components/UAOLayout';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA INVENTARIO
// ─────────────────────────────────────────────────────────────────────────────

type NivelStock = 'critico' | 'bajo' | 'normal' | 'exceso';
type CategoriaInsumo = 'resinas' | 'anestesia' | 'endodoncia' | 'proteccion' | 'cirugia' | 'impresion' | 'ortodoncia' | 'limpieza';

interface Insumo {
  id: string;
  nombre: string;
  categoria: CategoriaInsumo;
  unidad: string;
  stockActual: number;
  stockMinimo: number;
  stockMaximo: number;
  nivel: NivelStock;
  nodo: string;
  proveedor: string;
  ultimoMovimiento: string;
  precio: number;
}

const INSUMOS: Insumo[] = [
  // Críticos
  { id: 'i01', nombre: 'Anestesia Lidocaína 2% c/epinefrina', categoria: 'anestesia', unidad: 'cartuchos', stockActual: 12, stockMinimo: 50, stockMaximo: 200, nivel: 'critico', nodo: 'CLIMUZAC I', proveedor: 'OdontoSupplies MX', ultimoMovimiento: '2026-04-06', precio: 18 },
  { id: 'i02', nombre: 'Guantes latex S',                      categoria: 'proteccion', unidad: 'cajas',      stockActual: 3,  stockMinimo: 10, stockMaximo: 30,  nivel: 'critico', nodo: 'CLIBOR',     proveedor: 'MedLine Zac',      ultimoMovimiento: '2026-04-05', precio: 95 },
  { id: 'i03', nombre: 'Conos de papel #25',                    categoria: 'endodoncia', unidad: 'cajas',      stockActual: 5,  stockMinimo: 20, stockMaximo: 100, nivel: 'critico', nodo: 'CLIZAC',     proveedor: 'Dentsply MX',      ultimoMovimiento: '2026-04-04', precio: 130 },
  // Bajos
  { id: 'i04', nombre: 'Resina Z350 XT A2',                    categoria: 'resinas',    unidad: 'jeringuillas', stockActual: 8, stockMinimo: 15, stockMaximo: 60, nivel: 'bajo', nodo: 'CLIMUZAC I', proveedor: '3M Espe',         ultimoMovimiento: '2026-04-07', precio: 420 },
  { id: 'i05', nombre: 'Agujas dentales cortas 27G',            categoria: 'anestesia', unidad: 'cajas',        stockActual: 6, stockMinimo: 12, stockMaximo: 50, nivel: 'bajo', nodo: 'CLICAMP',    proveedor: 'OdontoSupplies MX', ultimoMovimiento: '2026-04-06', precio: 75 },
  { id: 'i06', nombre: 'Limas K #15-40 (set)',                  categoria: 'endodoncia', unidad: 'paquetes',    stockActual: 7, stockMinimo: 12, stockMaximo: 40, nivel: 'bajo', nodo: 'CLIZAC',     proveedor: 'Dentsply MX',      ultimoMovimiento: '2026-04-03', precio: 280 },
  { id: 'i07', nombre: 'Cemento temporal Cavit',                categoria: 'endodoncia', unidad: 'tubos',       stockActual: 9, stockMinimo: 15, stockMaximo: 50, nivel: 'bajo', nodo: 'CLIMUZAC II', proveedor: '3M Espe',         ultimoMovimiento: '2026-04-05', precio: 85 },
  // Normales
  { id: 'i08', nombre: 'Cubrebocas N95',                       categoria: 'proteccion', unidad: 'cajas',      stockActual: 28, stockMinimo: 10, stockMaximo: 60, nivel: 'normal', nodo: 'CLIMUZAC I', proveedor: 'MedLine Zac',      ultimoMovimiento: '2026-04-08', precio: 240 },
  { id: 'i09', nombre: 'Eyector desechable',                   categoria: 'limpieza',   unidad: 'bolsas',     stockActual: 45, stockMinimo: 20, stockMaximo: 100, nivel: 'normal', nodo: 'CLIMUZAC I', proveedor: 'OdontoSupplies MX', ultimoMovimiento: '2026-04-07', precio: 55 },
  { id: 'i10', nombre: 'Alginato Jeltrate',                    categoria: 'impresion',  unidad: 'bolsas',     stockActual: 18, stockMinimo: 8,  stockMaximo: 40, nivel: 'normal', nodo: 'CLICAMP',    proveedor: 'Dentsply MX',      ultimoMovimiento: '2026-04-06', precio: 165 },
  { id: 'i11', nombre: 'Silicona por adición',                 categoria: 'impresion',  unidad: 'kits',       stockActual: 14, stockMinimo: 5,  stockMaximo: 25, nivel: 'normal', nodo: 'CLIMUZAC II', proveedor: '3M Espe',         ultimoMovimiento: '2026-04-05', precio: 890 },
  { id: 'i12', nombre: 'Brackets metálicos 0.22 (set)',        categoria: 'ortodoncia', unidad: 'sets',       stockActual: 22, stockMinimo: 10, stockMaximo: 50, nivel: 'normal', nodo: 'CLIMUZAC I', proveedor: 'OrthoStar MX',    ultimoMovimiento: '2026-04-04', precio: 620 },
];

const CATEGORIAS: { id: CategoriaInsumo | 'todas'; label: string; emoji: string }[] = [
  { id: 'todas',     label: 'Todo',         emoji: '📦' },
  { id: 'anestesia', label: 'Anestesia',    emoji: '💉' },
  { id: 'resinas',   label: 'Resinas',      emoji: '🦷' },
  { id: 'endodoncia',label: 'Endodoncia',   emoji: '🔩' },
  { id: 'proteccion',label: 'Protección',   emoji: '🧤' },
  { id: 'impresion', label: 'Impresión',    emoji: '🫙' },
  { id: 'ortodoncia',label: 'Ortodoncia',   emoji: '⚙️' },
  { id: 'cirugia',   label: 'Cirugía',      emoji: '✂️' },
  { id: 'limpieza',  label: 'Limpieza',     emoji: '🧼' },
];

const nivelConfig: Record<NivelStock, { cls: string; label: string; dot: string }> = {
  critico: { cls: 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400', label: '🔴 Crítico', dot: 'bg-red-500' },
  bajo:    { cls: 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400', label: '🟡 Stock bajo', dot: 'bg-amber-500' },
  normal:  { cls: 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400', label: '🟢 Normal', dot: 'bg-emerald-500' },
  exceso:  { cls: 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400', label: '🔵 Exceso', dot: 'bg-blue-500' },
};

// ─────────────────────────────────────────────────────────────────────────────
// MODAL ORDEN DE COMPRA
// ─────────────────────────────────────────────────────────────────────────────

const ModalOrdenCompra: React.FC<{
  insumos: Insumo[];
  onClose: () => void;
}> = ({ insumos, onClose }) => {
  const urgentes = insumos.filter(i => i.nivel === 'critico' || i.nivel === 'bajo');
  const [enviado, setEnviado] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">Orden de Compra de Emergencia</h2>
            <p className="text-xs text-zinc-400 mt-0.5">{urgentes.length} insumos por debajo del mínimo</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <X className="h-4 w-4 text-zinc-500" />
          </button>
        </div>

        {!enviado ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {urgentes.map(ins => {
                const faltante = ins.stockMaximo - ins.stockActual;
                return (
                  <div key={ins.id} className={cn(
                    'flex items-center gap-3 p-3 rounded-2xl border',
                    ins.nivel === 'critico'
                      ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/40'
                      : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40'
                  )}>
                    <AlertTriangle className={cn('h-4 w-4 shrink-0', ins.nivel === 'critico' ? 'text-red-500' : 'text-amber-500')} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">{ins.nombre}</p>
                      <p className="text-[10px] text-zinc-500">{ins.nodo} · {ins.proveedor}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">+{faltante} {ins.unidad}</p>
                      <p className="text-[10px] text-zinc-400">${(faltante * ins.precio).toLocaleString('es-MX')}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-zinc-100 dark:border-zinc-800 p-5">
              <div className="flex justify-between text-sm mb-4">
                <span className="text-zinc-500">Total estimado:</span>
                <span className="font-bold text-zinc-900 dark:text-white">
                  ${urgentes.reduce((s, i) => s + ((i.stockMaximo - i.stockActual) * i.precio), 0).toLocaleString('es-MX')} MXN
                </span>
              </div>
              <button
                onClick={() => setEnviado(true)}
                className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-sm rounded-2xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
              >
                Enviar solicitud a Dirección
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center mb-4"
            >
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </motion.div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">¡Solicitud enviada!</h3>
            <p className="text-xs text-zinc-400 mt-1">El director recibirá la orden de compra para autorización</p>
            <button onClick={onClose} className="mt-6 px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold rounded-xl">
              Cerrar
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// INVENTARIO VIEW
// ─────────────────────────────────────────────────────────────────────────────

const InventarioViewContent: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useDemo();
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<CategoriaInsumo | 'todas'>('todas');
  const [nivelFiltro, setNivelFiltro] = useState<NivelStock | 'todos'>('todos');
  const [showOrden, setShowOrden] = useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) navigate('/academico');
  }, [isAuthenticated, navigate]);

  const insumosFiltrados = INSUMOS.filter(ins => {
    const matchBusqueda = ins.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                          ins.nodo.toLowerCase().includes(busqueda.toLowerCase());
    const matchCategoria = categoriaFiltro === 'todas' || ins.categoria === categoriaFiltro;
    const matchNivel = nivelFiltro === 'todos' || ins.nivel === nivelFiltro;
    return matchBusqueda && matchCategoria && matchNivel;
  });

  const criticos = INSUMOS.filter(i => i.nivel === 'critico').length;
  const bajos = INSUMOS.filter(i => i.nivel === 'bajo').length;
  const normales = INSUMOS.filter(i => i.nivel === 'normal').length;

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Inventario de Materiales</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Red clínica UAO — {INSUMOS.length} insumos registrados</p>
        </div>
        <div className="flex gap-2">
          {(criticos + bajos) > 0 && (
            <button
              onClick={() => setShowOrden(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-lg shadow-red-200 dark:shadow-red-950/40"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Orden de compra ({criticos + bajos})
            </button>
          )}
        </div>
      </motion.div>

      {/* KPIs rápidos */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Stock crítico', count: criticos, color: '#DC2626', bg: 'bg-red-50 dark:bg-red-950/20 border-red-200/60 dark:border-red-800/40', onClick: () => setNivelFiltro('critico') },
          { label: 'Stock bajo',    count: bajos,    color: '#D97706', bg: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-800/40', onClick: () => setNivelFiltro('bajo') },
          { label: 'Normal',        count: normales,  color: '#059669', bg: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/40', onClick: () => setNivelFiltro('normal') },
        ].map((k, i) => (
          <motion.button
            key={k.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={k.onClick}
            className={cn('rounded-2xl border p-4 text-left cursor-pointer hover:scale-[1.02] transition-transform', k.bg)}
          >
            <p className="text-2xl font-bold" style={{ color: k.color }}>{k.count}</p>
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mt-0.5">{k.label}</p>
          </motion.button>
        ))}
      </div>

      {/* Filtros */}
      <div className="space-y-3 mb-4">
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar insumo o nodo..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
          />
        </div>

        {/* Chips de categoría */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIAS.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoriaFiltro(cat.id)}
              className={cn(
                'flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all whitespace-nowrap shrink-0',
                categoriaFiltro === cat.id
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                  : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              )}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Reset filtros si hay activos */}
        {(nivelFiltro !== 'todos' || categoriaFiltro !== 'todas') && (
          <button
            onClick={() => { setNivelFiltro('todos'); setCategoriaFiltro('todas'); }}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            <X className="h-3 w-3" /> Limpiar filtros
          </button>
        )}
      </div>

      {/* Tabla de insumos */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/40">
                {['Insumo', 'Nodo', 'Stock', 'Nivel', 'Último movimiento'].map(h => (
                  <th key={h} className="text-[10px] text-zinc-400 font-semibold text-left px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {insumosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-xs text-zinc-400">
                    No se encontraron insumos con los filtros aplicados
                  </td>
                </tr>
              ) : insumosFiltrados.map((ins, i) => {
                const cfg = nivelConfig[ins.nivel];
                const pct = Math.round((ins.stockActual / ins.stockMaximo) * 100);
                return (
                  <motion.tr
                    key={ins.id}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-t border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-white">{ins.nombre}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">{ins.proveedor}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-medium px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full">
                        {ins.nodo.split('/')[0]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="text-xs font-bold text-zinc-900 dark:text-white">
                            {ins.stockActual} <span className="font-normal text-zinc-400">/ {ins.stockMaximo} {ins.unidad}</span>
                          </p>
                          <div className="w-20 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mt-1">
                            <div
                              className={cn(
                                'h-full rounded-full',
                                ins.nivel === 'critico' ? 'bg-red-500' :
                                ins.nivel === 'bajo' ? 'bg-amber-500' : 'bg-emerald-500'
                              )}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', cfg.cls)}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[11px] text-zinc-500">
                        {new Date(ins.ultimoMovimiento).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                      </p>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal orden de compra */}
      <AnimatePresence>
        {showOrden && (
          <ModalOrdenCompra insumos={INSUMOS} onClose={() => setShowOrden(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

const InventarioView: React.FC = () => (
  <UAOLayout>
    <InventarioViewContent />
  </UAOLayout>
);

export default InventarioView;
