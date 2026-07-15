import React, { useState, useRef } from 'react';
import { ChevronRight, ChevronLeft, Check, ShieldCheck, Stethoscope, MapPin, FileText, FolderHeart, User, ChevronDown, Phone } from 'lucide-react';
import LivePrescriptionPreview from './LivePrescriptionPreview';
import SignaturePad from './SignaturePad';
import { UNIVERSIDADES } from '@/data/universidades';

const COUNTRIES = [
  { code: 'MX', lada: '+52', flag: '🇲🇽', name: 'México' },
  { code: 'US', lada: '+1', flag: '🇺🇸', name: 'EE.UU.' },
  { code: 'ES', lada: '+34', flag: '🇪🇸', name: 'España' },
  { code: 'CO', lada: '+57', flag: '🇨🇴', name: 'Colombia' },
  { code: 'AR', lada: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: 'CL', lada: '+56', flag: '🇨🇱', name: 'Chile' },
  { code: 'PE', lada: '+51', flag: '🇵🇪', name: 'Perú' },
  { code: 'EC', lada: '+593', flag: '🇪🇨', name: 'Ecuador' },
  { code: 'VE', lada: '+58', flag: '🇻🇪', name: 'Venezuela' },
  { code: 'GT', lada: '+502', flag: '🇬🇹', name: 'Guatemala' }
];

// Función para formatear el número de teléfono local mexicano de 10 dígitos (XXX-XXX-XX-XX)
const formatLocalPhone = (val: string) => {
  if (!val) return '';
  
  // Limpiar caracteres no numéricos
  let clean = val.replace(/\D/g, '');
  
  // Limitar a los 10 dígitos del número telefónico en México
  if (clean.length > 10) {
    clean = clean.substring(0, 10);
  }
  
  // Reconstruir con el formato: XXX-XXX-XX-XX
  let formatted = '';
  if (clean.length > 0) {
    formatted += clean.substring(0, 3);
  }
  if (clean.length > 3) {
    formatted += '-' + clean.substring(3, 6);
  }
  if (clean.length > 6) {
    formatted += '-' + clean.substring(6, 8);
  }
  if (clean.length > 8) {
    formatted += '-' + clean.substring(8, 10);
  }
  
  return formatted;
};

interface SeedOnboardingProps {
  onComplete: (data: any) => void;
  theme?: 'dark' | 'light';
  initialData?: any;
}

export default function SeedOnboarding({ onComplete, theme = 'light', initialData }: SeedOnboardingProps) {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'perfil' | 'receta' | 'historia' | 'ubicacion'>('perfil');
  
  // States - Profesionales
  const [doctorName, setDoctorName] = useState(initialData?.doctorName || '');
  const [cedulaGeneral, setCedulaGeneral] = useState(initialData?.cedulaGeneral || '');
  const [institucion, setInstitucion] = useState(initialData?.institucion || '');
  const [hasSpecialty, setHasSpecialty] = useState(initialData?.hasSpecialty || false);
  const [especialidad, setEspecialidad] = useState(initialData?.especialidad || '');
  const [cedulaEspecialidad, setCedulaEspecialidad] = useState(initialData?.cedulaEspecialidad || '');
  const [institucionEspecialidad, setInstitucionEspecialidad] = useState(initialData?.institucionEspecialidad || '');
  const [doctorPhoto, setDoctorPhoto] = useState(initialData?.doctorPhoto || '');

  // States - Establecimiento
  const [clinicName, setClinicName] = useState(initialData?.clinicName || '');
  const [calle, setCalle] = useState(initialData?.calle || '');
  const [noExt, setNoExt] = useState(initialData?.noExt || '');
  const [noInt, setNoInt] = useState(initialData?.noInt || '');
  const [colonia, setColonia] = useState(initialData?.colonia || '');
  const [cp, setCp] = useState(initialData?.cp || '');
  const [municipio, setMunicipio] = useState(initialData?.municipio || '');
  const [estado, setEstado] = useState(initialData?.estado || '');
  const [telefono, setTelefono] = useState(initialData?.telefono || '');
  const [rfc, setRfc] = useState(initialData?.rfc || '');
  const [fechaNacimiento, setFechaNacimiento] = useState(initialData?.fechaNacimiento || '');
  const [vigencia, setVigencia] = useState(initialData?.vigencia || 'ACTIVA');
  const [selectedCountry, setSelectedCountry] = useState({ code: 'MX', lada: '+52', flag: '🇲🇽', name: 'México' });
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const countryBtnRef = useRef<HTMLButtonElement>(null);
  
  // States - Firma
  const [signature, setSignature] = useState(initialData?.signature || '');

  // Autocompletado de Universidades (SEP)
  const [filteredUnis, setFilteredUnis] = useState<typeof UNIVERSIDADES>([]);
  const [showUnis, setShowUnis] = useState(false);
  const [filteredUnisEsp, setFilteredUnisEsp] = useState<typeof UNIVERSIDADES>([]);
  const [showUnisEsp, setShowUnisEsp] = useState(false);

  const handleInstitucionChange = (val: string) => {
    setInstitucion(val);
    if (val.trim().length > 0) {
      const search = val.toLowerCase();
      const filtered = UNIVERSIDADES.filter(uni => 
        uni.nombre.toLowerCase().includes(search) || 
        uni.siglas.toLowerCase().includes(search) ||
        uni.ubicacion.toLowerCase().includes(search) ||
        uni.entidad.toLowerCase().includes(search)
      );
      setFilteredUnis(filtered.slice(0, 5));
      setShowUnis(true);
    } else {
      setFilteredUnis([]);
      setShowUnis(false);
    }
  };

  const handleInstitucionEspChange = (val: string) => {
    setInstitucionEspecialidad(val);
    if (val.trim().length > 0) {
      const search = val.toLowerCase();
      const filtered = UNIVERSIDADES.filter(uni => 
        uni.nombre.toLowerCase().includes(search) || 
        uni.siglas.toLowerCase().includes(search) ||
        uni.ubicacion.toLowerCase().includes(search) ||
        uni.entidad.toLowerCase().includes(search)
      );
      setFilteredUnisEsp(filtered.slice(0, 5));
      setShowUnisEsp(true);
    } else {
      setFilteredUnisEsp([]);
      setShowUnisEsp(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (val.toLowerCase().startsWith('dr. ') || val.toLowerCase().startsWith('dra. ')) {
      val = val.substring(4).trim();
    }
    setDoctorName(val);
  };

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
    else {
      onComplete({
        doctorName,
        cedulaGeneral,
        institucion,
        hasSpecialty,
        especialidad,
        cedulaEspecialidad,
        institucionEspecialidad,
        doctorPhoto,
        clinicName,
        calle,
        noExt,
        noInt,
        colonia,
        cp,
        municipio,
        estado,
        telefono,
        rfc,
        fechaNacimiento,
        vigencia,
        signature
      });
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center gap-3.5 mb-10 select-none justify-center">
        {[1, 2].map((s) => (
          <React.Fragment key={s}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all duration-500 border border-white/20 ${
              step === s 
                ? 'bg-[#e0e4eb] text-neutral-800 shadow-[inset_3px_3px_6px_#beccd9,_inset_-3px_-3px_6px_#ffffff]' 
                : step > s 
                  ? 'bg-[#e0e4eb] text-neutral-600 shadow-[3px_3px_6px_#beccd9,_-3px_-3px_6px_#ffffff]' 
                  : 'bg-[#e0e4eb] text-neutral-400 shadow-[2px_2px_4px_#beccd9,_-2px_-2px_4px_#ffffff] opacity-70'
            }`} style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}>
              {s < step ? <Check size={14} className="stroke-[3]" /> : s}
            </div>
            {s < 2 && (
              <div className={`w-12 h-1 rounded-full transition-all duration-500 ${
                step > s ? 'bg-neutral-400 shadow-[inset_1px_1px_2px_#beccd9]' : 'bg-[#e0e4eb] shadow-[inset_1px_1px_2px_#beccd9]'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const isStep1Valid = doctorName.trim() && cedulaGeneral.trim() && institucion.trim() && signature !== '' && rfc.trim() && fechaNacimiento.trim() && vigencia.trim();
  const isStep2Valid = clinicName.trim() && calle.trim() && cp.trim() && municipio.trim() && estado.trim();

  const canContinue = 
    (step === 1 && isStep1Valid) || 
    (step === 2 && isStep2Valid);

  // Clases Estilo Neumorfismo Soft UI Claro (#e0e4eb)
  const bgMainClass = 'bg-[#e0e4eb] text-neutral-800';
  const inputClass = 'w-full bg-[#e0e4eb] border-0 rounded-[18px] px-4 py-3.5 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300/40 shadow-[inset_4px_4px_8px_#beccd9,_inset_-4px_-4px_8px_#ffffff] transition-all duration-300';
  
  // Labels con alto contraste y tipografía Bruno Ace SC (Gris oscuro elegante estándar de Tailwind, tamaño 9.5px)
  const labelClass = 'block text-[9.5px] font-black uppercase tracking-wider text-neutral-700 mb-1.5';
  
  // Pestañas seleccionables neumórficas (Reestablecidas al menú original sin DEX)
  const tabs = [
    { id: 'perfil', label: 'Médico', icon: User },
    { id: 'receta', label: 'Receta', icon: FileText },
    { id: 'historia', label: 'Hist. Clínica', icon: FolderHeart },
    { id: 'ubicacion', label: 'Ubicación', icon: MapPin }
  ] as const;

  return (
    <div className={`fixed inset-0 z-[999] flex flex-col md:flex-row ${bgMainClass} overflow-hidden font-sans`}>
      
      {/* Left Column: Form & Interaction (Neumorfismo Alto Total Sin Bordes Cortados) */}
      <div className="w-full md:w-1/2 lg:w-5/12 h-screen flex flex-col p-8 lg:p-12 overflow-y-auto scrollbar-hide relative z-25 bg-[#e0e4eb] shadow-[8px_0_24px_#beccd9] border-r border-white/40">
        
        {/* Título de Marca estilo Bloqueo (Metálico / Bruno Ace SC) */}
        <div className="text-center px-4 w-full flex flex-col items-center mb-8 mt-2 select-none">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-650 bg-clip-text text-transparent drop-shadow-[1px_1px_1px_rgba(255,255,255,0.8)] mb-0 leading-none uppercase whitespace-nowrap flex justify-center" style={{ fontFamily: "'Bruno Ace SC', sans-serif" }}>
            Dentaxy
          </h1>
          <p className="text-[10px] tracking-[0.4em] uppercase bg-gradient-to-b from-neutral-700 via-neutral-600 to-neutral-500 bg-clip-text text-transparent font-black mt-1.5 flex justify-center" style={{ fontFamily: "'Bruno Ace SC', sans-serif" }}>
            Technologies
          </p>
        </div>

        {renderStepIndicator()}

        <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto my-auto">
          
          {step === 1 && (
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-5 text-neutral-850">
                <Stethoscope size={20} className="text-neutral-600" />
                <h2 className="text-xl font-black uppercase tracking-wider" style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}>
                  Identidad Profesional
                </h2>
              </div>
              <p className="text-neutral-600 text-xs leading-relaxed mb-8">
                De acuerdo con la NOM-024, sus datos deben registrarse tal como aparecen en su título profesional. <strong className="text-neutral-900 font-black">Evite utilizar abreviaturas como "Dr." o "Dra.".</strong>
              </p>

              <div className="space-y-5">
                
                {/* Fila: Selector de Foto Neumórfico Opcional + Nombre del Médico */}
                <div className="flex gap-5 items-start">
                  
                  {/* Carga de Foto Opcional */}
                  <div className="flex flex-col items-center select-none shrink-0">
                    <label className={labelClass} style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}>Foto (Opcional)</label>
                    <div 
                      onClick={() => document.getElementById('photo-upload')?.click()}
                      className={`w-24 h-24 rounded-[20px] bg-[#e0e4eb] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border border-white/20 relative overflow-hidden ${doctorPhoto ? 'shadow-[inset_2.5px_2.5px_5px_#beccd9,_inset_-2.5px_-2.5px_5px_#ffffff]' : 'shadow-[3px_3px_6px_#beccd9,_-3px_-3px_6px_#ffffff] hover:shadow-[inset_1px_1px_2.5px_#beccd9]'}`}
                    >
                      {doctorPhoto ? (
                        <>
                          <img src={doctorPhoto} alt="Doctor" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/45 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <span className="text-[7.5px] text-white font-black uppercase tracking-widest leading-none text-center px-1">Cambiar</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-center p-2 text-neutral-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5 text-neutral-450 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-[7px] font-black tracking-widest text-neutral-455 uppercase leading-none mt-0.5">Cargar</span>
                        </div>
                      )}
                    </div>
                    <input 
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setDoctorPhoto(event.target.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {doctorPhoto && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setDoctorPhoto('');
                        }}
                        className="text-[7.5px] font-black uppercase tracking-wider text-red-500 hover:text-red-600 mt-2 cursor-pointer transition-colors"
                        style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>

                  {/* Nombre Completo */}
                  <div className="flex-grow">
                    <label className={labelClass} style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}>Nombre Completo</label>
                    <input 
                      type="text" 
                      value={doctorName}
                      onChange={handleNameChange}
                      className={inputClass}
                      placeholder="Ej. Juan Pérez Gómez"
                    />
                  </div>

                </div>
                
                {/* Teléfono de Contacto */}
                <div className="mb-4">
                  <label className={labelClass} style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}>Teléfono de Contacto</label>
                  <div className="w-full bg-[#e0e4eb] rounded-[18px] border-0 flex items-stretch overflow-visible shadow-[inset_4px_4px_8px_#beccd9,_inset_-4px_-4px_8px_#ffffff] focus-within:ring-2 focus-within:ring-neutral-300/40 transition-all duration-300">
                    <button
                      ref={countryBtnRef}
                      type="button"
                      onClick={() => {
                        if (countryBtnRef.current) {
                          const rect = countryBtnRef.current.getBoundingClientRect();
                          setDropdownPos({ top: rect.bottom + 6, left: rect.left, width: 220 });
                        }
                        setShowCountryDropdown(v => !v);
                      }}
                      className="bg-neutral-300/20 px-4 flex items-center gap-2 border-r border-white/10 select-none cursor-pointer hover:bg-neutral-300/40 transition-colors shrink-0 rounded-l-[18px] focus:outline-none"
                    >
                      <span className="text-base leading-none">{selectedCountry.flag}</span>
                      <span className="text-[12px] font-bold text-neutral-700">{selectedCountry.lada}</span>
                      <ChevronDown size={10} className={`text-neutral-450 transition-transform duration-200 ${showCountryDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Input de Teléfono de 10 dígitos locales */}
                    <input 
                      type="tel" 
                      value={telefono}
                      onChange={(e) => setTelefono(formatLocalPhone(e.target.value))}
                      className="flex-grow bg-transparent border-0 px-4 py-3.5 text-neutral-900 placeholder-neutral-400 focus:outline-none text-sm"
                      placeholder="493-181-59-59"
                    />

                    {/* Dropdown de países en fixed */}
                    {showCountryDropdown && (
                      <div
                        style={{ position: 'fixed', top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width, zIndex: 9999 }}
                        className="rounded-2xl border border-neutral-250/30 bg-[#e0e4eb] shadow-xl overflow-y-auto max-h-60 animate-fade-in-up"
                      >
                        {COUNTRIES.map(country => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => {
                              setSelectedCountry(country);
                              setShowCountryDropdown(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-neutral-300/30 transition-colors cursor-pointer ${
                              selectedCountry.code === country.code ? 'bg-neutral-300/50' : ''
                            }`}
                          >
                            <span className="text-base">{country.flag}</span>
                            <span className="text-[11px] font-semibold text-neutral-750 flex-1">{country.name}</span>
                            <span className="text-[10px] font-mono text-neutral-500">{country.lada}</span>
                            {selectedCountry.code === country.code && (
                              <span className="text-neutral-800 text-xs font-bold">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass} style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}>Cédula</label>
                    <input 
                      type="text" 
                      value={cedulaGeneral}
                      onChange={(e) => setCedulaGeneral(e.target.value)}
                      className={inputClass}
                      placeholder="Número de cédula"
                    />
                  </div>
                   <div className="relative">
                    <label className={labelClass} style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}>Institución</label>
                    <input 
                      type="text" 
                      value={institucion}
                      onChange={(e) => handleInstitucionChange(e.target.value)}
                      onBlur={() => setTimeout(() => setShowUnis(false), 200)}
                      onFocus={() => {
                        if (institucion.trim().length > 0) setShowUnis(true);
                      }}
                      className={inputClass}
                      placeholder="Universidad emisora"
                    />
                    {showUnis && filteredUnis.length > 0 && (
                      <div className="absolute z-50 left-0 right-0 mt-1.5 rounded-2xl border border-neutral-250/20 bg-[#e0e4eb] shadow-xl overflow-hidden animate-fade-in-up max-h-52 overflow-y-auto">
                        {filteredUnis.map(uni => (
                          <button
                            key={uni.id}
                            type="button"
                            onMouseDown={() => {
                              setInstitucion(uni.nombre);
                              setShowUnis(false);
                            }}
                            className="w-full flex flex-col items-start px-4 py-2.5 hover:bg-neutral-300/40 text-left border-b border-white/10 last:border-0 transition-colors cursor-pointer"
                          >
                            <span className="text-[11px] font-bold text-neutral-850">{uni.nombre} ({uni.siglas})</span>
                            <span className="text-[9px] text-neutral-500 font-semibold">{uni.ubicacion}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className={labelClass} style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}>Registro Federal</label>
                    <input 
                      type="text" 
                      value={rfc}
                      onChange={(e) => setRfc(e.target.value)}
                      className={inputClass}
                      placeholder="RFC"
                    />
                  </div>
                  <div>
                    <label className={labelClass} style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}>Fecha de Nacimiento</label>
                    <input 
                      type="date" 
                      value={fechaNacimiento}
                      onChange={(e) => setFechaNacimiento(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className={labelClass} style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}>Vigencia</label>
                    <input 
                      type="text" 
                      value={vigencia}
                      onChange={(e) => setVigencia(e.target.value)}
                      className={inputClass}
                      placeholder="Ej. ACTIVA"
                    />
                  </div>
                </div>

                <div className="pt-5 border-t border-white/20">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5.5 h-5.5 rounded-lg border border-white/20 flex items-center justify-center transition-all duration-300 ${hasSpecialty ? 'bg-[#e0e4eb] text-neutral-800 shadow-[inset_2px_2px_4px_#beccd9,_inset_-2px_-2px_4px_#ffffff]' : 'bg-[#e0e4eb] shadow-[2px_2px_4px_#beccd9,_-2px_-2px_4px_#ffffff] group-hover:shadow-[inset_1px_1px_2px_#beccd9]'}`}>
                      {hasSpecialty && <Check size={12} className="stroke-[3]" />}
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-neutral-700">Tengo una especialidad profesional</span>
                    <input type="checkbox" className="hidden" checked={hasSpecialty} onChange={() => setHasSpecialty(!hasSpecialty)} />
                  </label>
                </div>

                {hasSpecialty && (
                  <div className="space-y-4 animate-fade-in-up mt-4 p-5 bg-[#e0e4eb] shadow-[inset_3px_3px_6px_#beccd9,_inset_-3px_-3px_6px_#ffffff] rounded-2xl border border-white/10">
                    <div>
                      <label className={labelClass} style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}>Especialidad</label>
                      <input 
                        type="text" 
                        value={especialidad}
                        onChange={(e) => setEspecialidad(e.target.value)}
                        className={inputClass}
                        placeholder="Ej. Ortodoncia y Ortopedia Maxilofacial"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass} style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}>Cédula</label>
                        <input 
                          type="text" 
                          value={cedulaEspecialidad}
                          onChange={(e) => setCedulaEspecialidad(e.target.value)}
                          className={inputClass}
                          placeholder="Número de cédula"
                        />
                      </div>
                       <div className="relative">
                        <label className={labelClass} style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}>Institución</label>
                        <input 
                          type="text" 
                          value={institucionEspecialidad}
                          onChange={(e) => handleInstitucionEspChange(e.target.value)}
                          onBlur={() => setTimeout(() => setShowUnisEsp(false), 200)}
                          onFocus={() => {
                            if (institucionEspecialidad.trim().length > 0) setShowUnisEsp(true);
                          }}
                          className={inputClass}
                          placeholder="Universidad emisora"
                        />
                        {showUnisEsp && filteredUnisEsp.length > 0 && (
                          <div className="absolute z-50 left-0 right-0 mt-1.5 rounded-2xl border border-neutral-250/20 bg-[#e0e4eb] shadow-xl overflow-hidden animate-fade-in-up max-h-52 overflow-y-auto">
                            {filteredUnisEsp.map(uni => (
                              <button
                                key={uni.id}
                                type="button"
                                onMouseDown={() => {
                                  setInstitucionEspecialidad(uni.nombre);
                                  setShowUnisEsp(false);
                                }}
                                className="w-full flex flex-col items-start px-4 py-2.5 hover:bg-neutral-300/40 text-left border-b border-white/10 last:border-0 transition-colors cursor-pointer"
                              >
                                <span className="text-[11px] font-bold text-neutral-850">{uni.nombre} ({uni.siglas})</span>
                                <span className="text-[9px] text-neutral-500 font-semibold">{uni.ubicacion}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Firma Autógrafa Digital al final de la Identidad Profesional */}
              <div className="pt-5 border-t border-white/20 mt-5">
                <label className={labelClass} style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}>Firma Digital del Doctor</label>
                <p className="text-neutral-600 text-xs leading-relaxed mb-3">
                  Plasma tu firma autógrafa. Ésta se incrustará automáticamente en tu credencial y documentos clínicos.
                </p>
                <div className="mb-4">
                  <SignaturePad onSignatureChange={setSignature} theme="light" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-5 text-neutral-850">
                <MapPin size={20} className="text-neutral-600" />
                <h2 className="text-xl font-black uppercase tracking-wider" style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}>
                  Datos del Establecimiento
                </h2>
              </div>
              <p className="text-neutral-600 text-xs leading-relaxed mb-8">
                Información de su consultorio o clínica, requerida por COFEPRIS para la validez de sus recetas médicas.
              </p>

              <div className="space-y-4">
                <div>
                  <label className={labelClass} style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}>Clínica</label>
                  <input 
                    type="text" 
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    className={inputClass}
                    placeholder="Ej. Clínica Dental Sonrisas"
                  />
                </div>
                
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-8">
                    <label className={labelClass} style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}>Calle</label>
                    <input 
                      type="text" 
                      value={calle}
                      onChange={(e) => setCalle(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass} style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}>Ext</label>
                    <input 
                      type="text" 
                      value={noExt}
                      onChange={(e) => setNoExt(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass} style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}>Int</label>
                    <input 
                      type="text" 
                      value={noInt}
                      onChange={(e) => setNoInt(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass} style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}>Colonia</label>
                    <input 
                      type="text" 
                      value={colonia}
                      onChange={(e) => setColonia(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass} style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}>C.P.</label>
                    <input 
                      type="text" 
                      value={cp}
                      onChange={(e) => setCp(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass} style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}>Municipio</label>
                    <input 
                      type="text" 
                      value={municipio}
                      onChange={(e) => setMunicipio(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass} style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}>Estado</label>
                    <input 
                      type="text" 
                      value={estado}
                      onChange={(e) => setEstado(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-8 mt-auto border-t border-white/20 pb-2">
          <button
            onClick={prevStep}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all duration-300 bg-[#e0e4eb] rounded-xl text-neutral-600 hover:text-black shadow-[2px_2px_5px_#beccd9,_-2px_-2px_5px_#ffffff] hover:shadow-[inset_1px_1px_2px_#beccd9]`}
            style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}
          >
            <ChevronLeft size={16} /> Atrás
          </button>
          
          <button
            onClick={nextStep}
            disabled={!canContinue}
            className={`flex items-center gap-2 px-9 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${
              canContinue 
                ? 'bg-[#e0e4eb] text-neutral-800 shadow-[5px_5px_10px_#beccd9,_-5px_-5px_10px_#ffffff] hover:shadow-[inset_2.5px_2.5px_5px_#beccd9,_inset_-2.5px_-2.5px_5px_#ffffff] transform active:scale-95' 
                : 'bg-[#e0e4eb] text-neutral-455 cursor-not-allowed shadow-[inset_2px_2px_5px_#beccd9,_inset_-2px_-2px_5px_#ffffff] opacity-75'
            }`}
            style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}
          >
            {step === 2 ? 'Finalizar' : 'Continuar'} <ChevronRight size={16} />
          </button>
        </div>

      </div>

      {/* Right Column: Neumorphic Menu Tabs Selector & Document Canvas (Subido verticalmente con justify-start y pt) */}
      <div className="hidden md:flex flex-1 relative flex-col items-center justify-start pt-16 lg:pt-24 p-8 lg:p-12 overflow-y-auto scrollbar-hide z-20">
        
        {/* Pestañas Neumórficas Seleccionables Dinámicas (Menú original restaurado sin DEX) */}
        <div className="w-full max-w-[500px] flex gap-2.5 mb-7 items-center justify-center select-none bg-[#e0e4eb] p-2 rounded-[24px] shadow-[inset_3px_3px_6px_#beccd9,_inset_-3px_-3px_6px_#ffffff]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const TabIcon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-11 rounded-full flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-wider transition-all duration-550 ease-out border border-white/10 ${
                  isActive 
                    ? 'flex-grow w-36 bg-[#e0e4eb] text-neutral-800 shadow-[inset_3px_3px_6px_#beccd9,_inset_-3px_-3px_6px_#ffffff]' 
                    : 'w-24 bg-[#e0e4eb] text-neutral-500 shadow-[3px_3px_6px_#beccd9,_-3px_-3px_6px_#ffffff] hover:text-neutral-700 hover:shadow-[1px_1px_3px_#beccd9]'
                }`}
                style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}
              >
                <TabIcon size={12} className={isActive ? 'text-neutral-800' : 'text-neutral-400'} />
                <span className={isActive ? 'opacity-100 scale-100 max-w-full duration-550' : 'opacity-0 scale-90 max-w-0 overflow-hidden duration-300'}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative z-25 w-full flex justify-center">
          <LivePrescriptionPreview 
            doctorName={doctorName}
            cedulaGeneral={cedulaGeneral}
            institucion={institucion}
            hasSpecialty={hasSpecialty}
            especialidad={especialidad}
            cedulaEspecialidad={cedulaEspecialidad}
            institucionEspecialidad={institucionEspecialidad}
            clinicName={clinicName}
            calle={calle}
            noExt={noExt}
            noInt={noInt}
            colonia={colonia}
            cp={cp}
            municipio={municipio}
            estado={estado}
            telefono={selectedCountry.lada + " " + telefono}
            signature={signature}
            theme="light"
            activeTab={activeTab}
            doctorPhoto={doctorPhoto}
            rfc={rfc}
            fechaNacimiento={fechaNacimiento}
            vigencia={vigencia}
          />
        </div>
      </div>
    </div>
  );
}
