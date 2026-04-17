/**
 * GeoMap.tsx — Panel CRUD de Zonas Geográficas
 * Administra las zonas seguras que el Demo Engine usa para restringir acceso por GPS.
 */
import React, { useState } from 'react';
import { Globe, MapPin, Plus, Trash2, Loader2, Wifi, WifiOff, Edit3, Check, X, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useGeoZones, GeoZone } from '@/hooks/useGeoZones';
import { getDistanceKm } from '@/pages/academico/utils/geo';

// ─── Formulario de zona ───────────────────────────────────────────────────────
interface ZoneFormState {
  name: string;
  lat: string;
  lng: string;
  radius_km: string;
  color: string;
  description: string;
}

const PRESET_COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'];

const EMPTY_FORM: ZoneFormState = {
  name: '', lat: '', lng: '', radius_km: '1.5', color: '#10B981', description: ''
};

// ─── Mapa visual estético (CSS puro, sin librería) ────────────────────────────
const ZoneMapVisual: React.FC<{ zones: GeoZone[] }> = ({ zones }) => {
  // Normaliza coordenadas de México a posiciones relativas en el contenedor
  const LAT_MIN = 14, LAT_MAX = 32.7;
  const LNG_MIN = -117, LNG_MAX = -86.7;

  const toPercent = (lat: number, lng: number) => ({
    top: `${((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * 100}%`,
    left: `${((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * 100}%`,
  });

  return (
    <div className="relative w-full h-48 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-white/10">
      {/* Grid */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      {/* Silueta estilizada de México */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <Globe className="w-32 h-32 text-white" />
      </div>

      {/* Label */}
      <p className="absolute top-3 left-3 text-[10px] font-mono text-white/40 uppercase tracking-widest">México · Vista Satelital</p>

      {/* Puntos de zona */}
      {zones.map((zone) => {
        const pos = toPercent(zone.lat, zone.lng);
        return (
          <div key={zone.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={pos}>
            {/* Radio visual */}
            <div className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full opacity-20"
              style={{ backgroundColor: zone.color }} />
            {/* Ping */}
            <div className="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full animate-ping opacity-40"
              style={{ backgroundColor: zone.color }} />
            {/* Punto central */}
            <div className="w-3 h-3 rounded-full border-2 border-white shadow-lg"
              style={{ backgroundColor: zone.color }} />
            {/* Etiqueta */}
            <div className="absolute left-4 top-0 whitespace-nowrap text-[9px] font-bold text-white/80 bg-black/60 px-1.5 py-0.5 rounded">
              {zone.name.split('(')[0].trim()}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Tarjeta de zona ──────────────────────────────────────────────────────────
const ZoneCard: React.FC<{
  zone: GeoZone;
  onDelete: (id: string) => void;
  userCoords: { lat: number; lng: number } | null;
}> = ({ zone, onDelete, userCoords }) => {
  const [confirming, setConfirming] = useState(false);
  const distance = userCoords
    ? getDistanceKm(userCoords.lat, userCoords.lng, zone.lat, zone.lng)
    : null;
  const isInside = distance !== null && distance <= zone.radius_km;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm group hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Indicador de color */}
          <div className="mt-0.5 w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
            style={{ backgroundColor: zone.color }} />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">{zone.name}</p>
            <p className="text-gray-400 text-xs mt-0.5 font-mono">
              {zone.lat.toFixed(4)}, {zone.lng.toFixed(4)} · {zone.radius_km} km
            </p>
            {zone.description && (
              <p className="text-gray-500 text-xs mt-1">{zone.description}</p>
            )}
          </div>
        </div>

        {/* Status GPS */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {distance !== null && (
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isInside ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'
            }`}>
              {isInside ? <Wifi className="w-2.5 h-2.5" /> : <WifiOff className="w-2.5 h-2.5" />}
              {isInside ? 'Dentro' : `${distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`}`}
            </span>
          )}

          {/* Eliminar */}
          {confirming ? (
            <div className="flex items-center gap-1">
              <button onClick={() => { onDelete(zone.id); setConfirming(false); }}
                className="p-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                <Check className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setConfirming(false)}
                className="p-1 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirming(true)}
              className="p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Panel principal ──────────────────────────────────────────────────────────
const GeoMap: React.FC = () => {
  const { zones, isLoading, createZone, deleteZone } = useGeoZones();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ZoneFormState>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  const handleDetectLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        setForm(f => ({ ...f, lat: latitude.toFixed(6), lng: longitude.toFixed(6) }));
        toast.success('Ubicación detectada');
        setIsLocating(false);
      },
      () => { toast.error('No se pudo acceder al GPS'); setIsLocating(false); },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('El nombre es requerido'); return; }
    const lat = parseFloat(form.lat);
    const lng = parseFloat(form.lng);
    const radius = parseFloat(form.radius_km);
    if (isNaN(lat) || isNaN(lng)) { toast.error('Coordenadas inválidas'); return; }
    if (isNaN(radius) || radius <= 0) { toast.error('El radio debe ser mayor a 0'); return; }

    setIsSaving(true);
    try {
      await createZone({
        name: form.name.trim(),
        lat, lng, radius_km: radius,
        color: form.color,
        description: form.description.trim(),
        is_active: true,
      });
      toast.success(`Zona "${form.name}" guardada`);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar zona');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteZone(id);
      toast.success('Zona eliminada');
    } catch (err: any) {
      toast.error('Error al eliminar zona');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <MapPin className="w-7 h-7 text-emerald-500" />
            GeoMap Control
          </h1>
          <p className="text-gray-400 font-medium mt-1">
            Zonas geográficas autorizadas para el Demo Engine · {zones.length} zona{zones.length !== 1 ? 's' : ''} activa{zones.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDetectLocation}
            disabled={isLocating}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
            Mi Ubicación
          </button>
          <button
            onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-gray-900/20 hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Nueva Zona
          </button>
        </div>
      </div>

      {/* Mapa visual */}
      <ZoneMapVisual zones={zones} />

      {/* Formulario de nueva zona */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-2 border-emerald-200/60 rounded-[2rem] p-6 space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-500" />
                Nueva Zona Segura
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombre */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Nombre de la Zona</label>
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Ej. Campus UAO UAZ"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400"
                  />
                </div>

                {/* Lat */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Latitud</label>
                  <input
                    value={form.lat}
                    onChange={e => setForm(f => ({ ...f, lat: e.target.value }))}
                    placeholder="22.7523"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400"
                  />
                </div>

                {/* Lng */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Longitud</label>
                  <input
                    value={form.lng}
                    onChange={e => setForm(f => ({ ...f, lng: e.target.value }))}
                    placeholder="-102.5312"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400"
                  />
                </div>

                {/* Radio */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Radio (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="50"
                    value={form.radius_km}
                    onChange={e => setForm(f => ({ ...f, radius_km: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400"
                  />
                </div>

                {/* Color */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Color</label>
                  <div className="flex items-center gap-2">
                    {PRESET_COLORS.map(c => (
                      <button
                        key={c}
                        onClick={() => setForm(f => ({ ...f, color: c }))}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${form.color === c ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* Descripción */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Descripción (opcional)</label>
                  <input
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Ej. Demo autorizado para alumnos de Odontología"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Guardar Zona
                </button>
                <button
                  onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}
                  className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de zonas */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
            Zonas Activas
          </h3>
          <span className="text-xs text-gray-400 font-mono">
            {userCoords ? `GPS: ${userCoords.lat.toFixed(4)}, ${userCoords.lng.toFixed(4)}` : 'GPS no detectado'}
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
          </div>
        ) : zones.length === 0 ? (
          <div className="text-center py-10">
            <Globe className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No hay zonas configuradas.</p>
            <p className="text-gray-300 text-xs">Crea una zona para restringir acceso por GPS.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {zones.map(zone => (
                <ZoneCard key={zone.id} zone={zone} onDelete={handleDelete} userCoords={userCoords} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="text-center">
        <p className="text-xs text-gray-400 font-mono">
          Las zonas se sincronizan en tiempo real con el Demo Engine · Radio mínimo recomendado: 0.3 km
        </p>
      </div>
    </div>
  );
};

export default GeoMap;
