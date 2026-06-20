import React, { useState } from 'react';
import { User, Phone, ClipboardList, CheckCircle2, X, Plus, Sparkles } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

export default function SeedAddPatientView() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    telefono: '',
    motivo: 'primera',
    alergias: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.apellidos) return;
    setIsSubmitting(true);

    try {
      const seedUserStr = sessionStorage.getItem('seed_user');
      if (!seedUserStr) throw new Error("No hay sesión activa");
      
      const seedUser = JSON.parse(seedUserStr);
      const accessToken = seedUser.googleAccessToken;
      
      if (!accessToken) throw new Error("No hay conexión de Google Drive");

      // 1. Buscar la carpeta raíz 'Dentaxy'
      const query = encodeURIComponent("name = 'Dentaxy' and mimeType = 'application/vnd.google-apps.folder' and trashed = false");
      const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id)`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const searchData = await searchRes.json();
      
      let parentId = null;
      if (searchData.files && searchData.files.length > 0) {
        parentId = searchData.files[0].id;
      } else {
        const createRootRes = await fetch('https://www.googleapis.com/drive/v3/files', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: 'Dentaxy',
            mimeType: 'application/vnd.google-apps.folder'
          })
        });
        const rootData = await createRootRes.json();
        parentId = rootData.id;
      }

      // 2. Crear la carpeta del paciente
      const folderName = `${formData.apellidos.toUpperCase()}, ${formData.nombre}`;
      const createPatientRes = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [parentId],
          appProperties: {
            telefono: formData.telefono,
            motivo: formData.motivo,
            alergias: formData.alergias || 'Ninguna'
          }
        })
      });

      if (!createPatientRes.ok) {
        throw new Error("Error al crear carpeta del paciente");
      }

      console.log('Expediente creado en Drive exitosamente');
      window.dispatchEvent(new Event('patientCreated'));
      setIsSuccess(true);
    } catch (err) {
      console.error('Error guardando expediente:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', apellidos: '', telefono: '', motivo: 'primera', alergias: '' });
    setIsSuccess(false);
    setIsSubmitting(false);
    setIsFormOpen(false);
  };

  const cardStyle = {
    borderRadius: '30px',
    background: 'var(--seed-card-bg)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid var(--seed-card-border)',
    boxShadow: 'var(--seed-card-shadow), inset 0 1px 0 var(--seed-card-border)',
    color: 'var(--seed-text-main)'
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-sm px-6 z-30 animate-in fade-in zoom-in-95 duration-300">
        {/* Notificación de Éxito estilo Key Dates Material */}
        <div 
          className="p-8 flex flex-col items-center text-center relative overflow-hidden"
          style={cardStyle}
        >
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center border border-emerald-300 dark:border-emerald-500/30 mb-4">
             <CheckCircle2 size={28} className="text-emerald-500 dark:text-emerald-400" />
          </div>
          
          <h3 className="font-bold text-lg">Expediente Creado</h3>
          <p className="text-xs mt-2 leading-relaxed max-w-[280px]" style={{ color: 'var(--seed-text-muted)' }}>
            La subcarpeta del paciente se ha generado correctamente en <strong>Mis archivos dentaxy</strong> de tu Google Drive.
          </p>
          
          <button 
            onClick={resetForm}
            className="mt-6 w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-md"
          >
            Agregar otro paciente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center z-30 px-6">
      {!isFormOpen ? (
        /* Estado Inicial: Botón + con texto */
        <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in-95 duration-300">
          <button 
            onClick={() => setIsFormOpen(true)}
            className="w-16 h-16 rounded-full bg-slate-900/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg hover:border-slate-300 dark:hover:border-white/20"
          >
            <Plus size={28} />
          </button>
          <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--seed-text-muted)' }}>
            Agregar Paciente
          </span>
        </div>
      ) : (
        /* Formulario: Una sola tarjeta estilo Key Dates */
        <div 
          className="w-full max-w-md p-8 relative flex flex-col justify-between animate-in fade-in zoom-in-95 duration-300"
          style={cardStyle}
        >
          {/* Botón Cerrar */}
          <button 
            onClick={() => setIsFormOpen(false)}
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>

          {/* Cabecera */}
          <div className="mb-6">
            <h2 className="text-[16px] font-semibold tracking-wide">Ficha de Registro</h2>
            <p className="text-[10px] mt-0.5 font-medium tracking-wide animate-pulse" style={{ color: 'var(--seed-green)' }}>
              Sincronización en tiempo real con Drive
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--seed-text-muted)' }}>
                Nombre(s) *
              </label>
              <input 
                type="text" 
                required
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                className="w-full h-10 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500/40 dark:focus:border-emerald-400/40 focus:bg-white dark:focus:bg-white/10 transition-all" 
                placeholder="Nombre(s) del paciente" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--seed-text-muted)' }}>
                Apellidos *
              </label>
              <input 
                type="text" 
                required
                value={formData.apellidos}
                onChange={(e) => setFormData(prev => ({ ...prev, apellidos: e.target.value }))}
                className="w-full h-10 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500/40 dark:focus:border-emerald-400/40 focus:bg-white dark:focus:bg-white/10 transition-all" 
                placeholder="Apellidos" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--seed-text-muted)' }}>
                Teléfono de contacto
              </label>
              <input 
                type="tel" 
                value={formData.telefono}
                onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                className="w-full h-10 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500/40 dark:focus:border-emerald-400/40 focus:bg-white dark:focus:bg-white/10 transition-all" 
                placeholder="Número celular" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--seed-text-muted)' }}>
                Motivo de ingreso
              </label>
              <select 
                value={formData.motivo}
                onChange={(e) => setFormData(prev => ({ ...prev, motivo: e.target.value }))}
                className="w-full h-10 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500/40 dark:focus:border-emerald-400/40 focus:bg-white dark:focus:bg-white/10 transition-all cursor-pointer"
                style={{ color: 'var(--seed-text-main)' }}
              >
                <option value="primera" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Primera Vez / Valoración</option>
                <option value="urgencia" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Urgencia Dental</option>
                <option value="limpieza" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Limpieza / Profilaxis</option>
                <option value="ortodoncia" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Ortodoncia</option>
                <option value="cirugia" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Cirugía</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--seed-text-muted)' }}>
                Alergias / Patologías
              </label>
              <input 
                type="text" 
                value={formData.alergias}
                onChange={(e) => setFormData(prev => ({ ...prev, alergias: e.target.value }))}
                className="w-full h-10 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500/40 dark:focus:border-emerald-400/40 focus:bg-white dark:focus:bg-white/10 transition-all" 
                placeholder="Ej. Penicilina, Diabetes (Opcional)" 
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full h-11 rounded-xl bg-[var(--seed-green)] text-white text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              {isSubmitting ? 'Procesando...' : (
                <>
                  <Sparkles size={13} />
                  Autorizar y Guardar en Drive
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
