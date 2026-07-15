import React, { useEffect, useState } from 'react';
import { User, ShieldCheck, MapPin, Activity, FileText, CheckCircle2, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { QRCodeSVG } from 'qrcode.react';

interface PreviewProps {
  doctorName: string;
  cedulaGeneral: string;
  institucion: string;
  hasSpecialty: boolean;
  especialidad: string;
  cedulaEspecialidad: string;
  institucionEspecialidad: string;
  clinicName: string;
  calle: string;
  noExt: string;
  noInt: string;
  colonia: string;
  cp: string;
  municipio: string;
  estado: string;
  telefono: string;
  signature: string;
  theme: 'dark' | 'light';
  activeTab?: 'perfil' | 'receta' | 'historia' | 'ubicacion';
  doctorPhoto?: string;
  rfc?: string;
  fechaNacimiento?: string;
  vigencia?: string;
}

// Hook auxiliar para simular un glitch / decodificación técnica en cambios de texto
function useGlitchReveal(text: string) {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayText('');
      return;
    }
    
    setIsGlitching(true);
    let iterations = 0;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*';
    
    const interval = setInterval(() => {
      setDisplayText(prev => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iterations) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
      });

      if (iterations >= text.length) {
        clearInterval(interval);
        setIsGlitching(false);
      }
      iterations += Math.ceil(text.length / 10) || 1;
    }, 40);

    return () => clearInterval(interval);
  }, [text]);

  return { displayText, isGlitching };
}

interface BarcodeProps {
  value: string;
  height?: number;
}

const Barcode: React.FC<BarcodeProps> = ({ value, height = 30 }) => {
  // Mapa de Code 39
  const code39Map: Record<string, string> = {
    '0': '000110100', '1': '100100001', '2': '001100001', '3': '101100000',
    '4': '000110001', '5': '100110000', '6': '001110000', '7': '000100101',
    '8': '100100100', '9': '001100100',
    'A': '100001001', 'B': '001001001', 'C': '101001000', 'D': '000011001',
    'E': '100011000', 'F': '001011000', 'G': '000001101', 'H': '100001100',
    'I': '001001100', 'J': '000011100', 'K': '100000011', 'L': '001000011',
    'M': '101000010', 'N': '000010011', 'O': '100010010', 'P': '001010010',
    'Q': '000000111', 'R': '100000110', 'S': '001000110', 'T': '000010110',
    'U': '110000001', 'V': '011000001', 'W': '111000000', 'X': '010010001',
    'Y': '110010000', 'Z': '011010000', '-': '010000101', '.': '110000100',
    ' ': '011000100', '*': '010010100'
  };

  // Agregar asteriscos de inicio/fin y sanitizar a Code 39
  const codeVal = `*${value.trim().toUpperCase().replace(/[^A-Z0-9\-\.\s]/g, '') || 'SEED'}*`;
  const bars: { isBlack: boolean; isWide: boolean }[] = [];

  for (let i = 0; i < codeVal.length; i++) {
    const char = codeVal[i];
    const pattern = code39Map[char] || code39Map['*'];

    for (let j = 0; j < 9; j++) {
      const isBlack = j % 2 === 0;
      const isWide = pattern[j] === '1';
      bars.push({ isBlack, isWide });
    }

    if (i < codeVal.length - 1) {
      bars.push({ isBlack: false, isWide: false });
    }
  }

  return (
    <div className="flex items-end justify-center select-none bg-white px-2 py-1 rounded shadow-sm shrink-0 w-full">
      <div className="flex items-stretch w-full justify-between" style={{ height: `${height}px` }}>
        {bars.map((bar, idx) => (
          <div
            key={idx}
            className={bar.isBlack ? 'bg-neutral-900' : 'bg-transparent'}
            style={{
              width: bar.isWide ? '1.5px' : '0.5px',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default function LivePrescriptionPreview({
  doctorName,
  cedulaGeneral,
  institucion,
  hasSpecialty,
  especialidad,
  cedulaEspecialidad,
  institucionEspecialidad,
  clinicName,
  calle,
  noExt,
  noInt,
  colonia,
  cp,
  municipio,
  estado,
  telefono,
  signature,
  activeTab = 'perfil',
  doctorPhoto = '',
  rfc = '',
  fechaNacimiento = '',
  vigencia = 'ACTIVA'
}: PreviewProps) {
  const { user } = useAuth();
  
  // Decodificaciones digitales
  const nameReveal = useGlitchReveal(doctorName.trim() || 'NOMBRE DEL MÉDICO');
  const cedulaReveal = useGlitchReveal(cedulaGeneral.trim() || 'XXXXXXX');
  const instReveal = useGlitchReveal(institucion.trim() || 'UNIVERSIDAD EMISORA');
  const clinicReveal = useGlitchReveal(clinicName.trim() || 'CLÍNICA DENTAL');

  // Dirección
  const domParts = [
    calle,
    noExt ? `Ext. ${noExt}` : '',
    noInt ? `Int. ${noInt}` : '',
    colonia,
    cp ? `C.P. ${cp}` : '',
    municipio,
    estado
  ].filter(p => p.trim() !== '').join(', ');
  const displayDom = domParts || 'CALLE FALSA 123, COLONIA CENTRO, C.P. 00000, CIUDAD, ESTADO';
  const domReveal = useGlitchReveal(displayDom);

  // Trigger de cambios combinados para disparar la animación glitch de COFILD
  const [cofildText, setCofildText] = useState('COFILD');
  useEffect(() => {
    // Al haber cualquier cambio en el onboarding, reiniciamos el glitch del sello COFILD
    setCofildText('');
    const t = setTimeout(() => setCofildText('COFILD'), 50);
    return () => clearTimeout(t);
  }, [doctorName, cedulaGeneral, clinicName, institucion, displayDom]);

  const cofildReveal = useGlitchReveal(cofildText);

  // Clases Estilo Papel Blanco Sólido Texturizado (Sin Neumorfismo)
  const containerBg = 'bg-[#fbfbf9] text-neutral-900 shadow-[0_30px_70px_rgba(0,0,0,0.25)]';
  const textPrimary = 'text-neutral-900';
  const textMuted = 'text-neutral-500';
  const textTitle = 'text-neutral-700';
  const badgeBg = 'bg-neutral-900/5 border-neutral-900/10 text-neutral-700';
  const rxLine = 'border-neutral-200';
  const blockFlatClass = 'bg-neutral-50/50 border border-neutral-200/60 rounded-[20px] p-4.5';

  // 1. RENDER VISTA PERFIL (DISEÑO SCI-FI / IDENTIFICACIÓN MILITAR "OSHIMA" EN VERSIÓN BLANCA ORIGINAL)
  const renderPerfilView = () => {
    // Formatear Nombre del doctor en APELLIDOS, NOMBRE
    const rawName = doctorName.trim() || 'ZAVALA, ALEJANDRO';
    const formattedName = rawName.toUpperCase();
    
    // Si el teléfono no tiene la lada (+52) de forma explícita, se la anteponemos para la credencial
    const cleanPhone = telefono.trim();
    const formattedPhone = cleanPhone 
      ? (cleanPhone.startsWith('+52') ? cleanPhone : `+52 ${cleanPhone}`) 
      : '+52 493-181-59-59';

    return (
      <div className="flex-1 flex flex-col justify-center py-6 px-4 animate-fade-in-up font-mono text-neutral-800 text-[9px] select-none">
        
        {/* Tarjeta Rectangular Central de Identificación (Neumorfismo Blanco Limpio con Cabecera COFILD Inferior) */}
        <div className="pt-8 pb-5 px-8 rounded-[28px] flex flex-col bg-gradient-to-br from-[#ffffff] to-[#f3f4f6] shadow-[inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.9),_inset_1.5px_1.5px_3px_rgba(0,0,0,0.02),_-12px_-12px_28px_#b2c1ce,_12px_12px_28px_#ffffff] relative transition-all duration-300 hover:scale-[1.01]">
          
          <div className="flex gap-8 w-full">
            
            {/* Columna Izquierda: Foto de perfil y Código de Barras Único (delgado y largo) en la base */}
            <div className="flex flex-col gap-3 shrink-0 w-[155px]">
              
              {/* Foto de perfil con malla metálica de fondo */}
              <div 
                className="w-[155px] h-[195px] border border-neutral-400 rounded-xl overflow-hidden relative flex items-center justify-center bg-[#f0f0ed] shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06),_1.5px_1.5px_3px_#ffffff]"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, #d4d4cf 0px, #d4d4cf 1px, transparent 1px, transparent 8px), repeating-linear-gradient(-45deg, #d4d4cf 0px, #d4d4cf 1px, transparent 1px, transparent 8px)'
                }}
              >
                {doctorPhoto ? (
                  <img 
                    src={doctorPhoto} 
                    alt="Doctor" 
                    className="w-full h-full object-cover filter grayscale contrast-[1.15] mix-blend-multiply" 
                  />
                ) : (
                  // Silueta del médico monocromática sci-fi
                  <div className="w-full h-full flex flex-col justify-end items-center opacity-85 pt-10">
                    <svg viewBox="0 0 100 100" className="w-[90%] h-[90%] text-neutral-600/80 mix-blend-multiply">
                      <path fill="currentColor" d="M50 22c7.5 0 13.5 6 13.5 13.5S57.5 49 50 49s-13.5-6-13.5-13.5S42.5 22 50 22zm0 31.5c15 0 27 9 27 22.5v4.5H23v-4.5c0-13.5 12-22.5 27-22.5z" />
                    </svg>
                  </div>
                )}
                
                {/* Esquinas de Mira fotográficas decorativas */}
                <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-neutral-600" />
                <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-neutral-600" />
                <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-neutral-600" />
                <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-neutral-600" />
              </div>

              {/* Código de barras único Code 39 delgado y largo bajo la foto */}
              <div className="flex flex-col items-center font-mono w-full">
                <Barcode value={`DX-${cedulaGeneral || 'SEED'}`} height={18} />
                <span className="text-[7.5px] font-black text-neutral-500 tracking-[0.25em] mt-1.5 uppercase leading-none select-all">
                  * DX.{cedulaGeneral || 'SEED'} *
                </span>
              </div>

            </div>

            {/* Columna Derecha: Datos Clínicos HUD / Bio-Datos */}
            <div className="flex-1 flex flex-col justify-between py-1 text-[11px] leading-relaxed text-neutral-850">
              <div>
                {/* Nombre completo */}
                <div className="text-[20px] font-black tracking-wider text-neutral-900 leading-tight uppercase whitespace-normal break-words mb-2" style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}>
                  {formattedName}
                </div>
                
                {/* Cargo / Rol Rectangular Oscuro */}
                <div className="flex mb-2.5">
                  <span className="bg-neutral-900 text-white px-3.5 py-1 text-[11px] font-black tracking-widest uppercase rounded">
                    {hasSpecialty && especialidad.trim() ? especialidad.toUpperCase() : 'MÉDICO PRESCRIPTOR'}
                  </span>
                </div>

                <div className="text-[10px] font-black text-neutral-500 uppercase tracking-wider leading-tight mb-3 truncate max-w-xs" title={hasSpecialty && institucionEspecialidad.trim() ? `${institucion}, ${institucionEspecialidad}` : institucion}>
                  {hasSpecialty && institucionEspecialidad.trim() 
                    ? `${institucion.toUpperCase()}, ${institucionEspecialidad.toUpperCase()}` 
                    : (institucion.toUpperCase() || 'UNIVERSIDAD EMISORA')}
                </div>

                {/* Datos Profesionales Oficiales en 3 Columnas (Cédula, Registro Federal, Fecha de Nacimiento, Vigencia, Especialidad) */}
                <div className="flex flex-col w-full mb-3.5 select-none">
                  {/* Haz de luz/Línea horizontal superior futurista */}
                  <div className="h-[1px] bg-gradient-to-r from-transparent via-neutral-300/70 to-transparent w-full" />
                  
                  <div className="grid grid-cols-3 gap-x-4 py-2.5 text-[9.5px] font-bold text-neutral-750 leading-normal">
                    {/* Columna 1: General */}
                    <div className="flex flex-col gap-1 pl-1">
                      <div className="flex flex-col">
                        <span className="text-neutral-500 uppercase tracking-wider text-[7.5px] font-black">CÉDULA PROFESIONAL:</span>
                        <span className="text-neutral-955 font-mono font-black">{cedulaGeneral || 'PENDIENTE'}</span>
                      </div>
                      <div className="flex flex-col mt-0.5">
                        <span className="text-neutral-500 uppercase tracking-wider text-[7.5px] font-black">REGISTRO FEDERAL:</span>
                        <span className="text-neutral-955 font-mono font-black truncate max-w-full">{rfc.toUpperCase() || 'PENDIENTE'}</span>
                      </div>
                    </div>
                    {/* Columna 2: Telemetría */}
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-col">
                        <span className="text-neutral-500 uppercase tracking-wider text-[7.5px] font-black">FECHA DE NACIMIENTO:</span>
                        <span className="text-neutral-955 font-mono font-black">{fechaNacimiento || 'PENDIENTE'}</span>
                      </div>
                      <div className="flex flex-col mt-0.5">
                        <span className="text-neutral-500 uppercase tracking-wider text-[7.5px] font-black">VIGENCIA:</span>
                        <span className="text-neutral-955 font-mono font-black">{vigencia.toUpperCase() || 'ACTIVA'}</span>
                      </div>
                    </div>
                    {/* Columna 3: Especialidad */}
                    <div className="flex flex-col gap-1 pr-1">
                      <div className="flex flex-col">
                        <span className="text-neutral-500 uppercase tracking-wider text-[7.5px] font-black">CÉDULA ESPECIALIDAD:</span>
                        <span className="text-neutral-955 font-mono font-black">
                          {hasSpecialty && cedulaEspecialidad.trim() ? cedulaEspecialidad : 'SIN REGISTRO'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Haz de luz/Línea horizontal inferior futurista */}
                  <div className="h-[1px] bg-gradient-to-r from-transparent via-neutral-300/70 to-transparent w-full" />
                </div>
              </div>

              {/* Fila de Teléfono, Datos de Contacto, Firma y Código QR */}
              <div className="grid grid-cols-12 items-start w-full mt-3 gap-3">
                
                {/* Columna Izquierda (Col-span-3): Código QR de Verificación */}
                <div className="col-span-3 shrink-0 flex items-center justify-start bg-transparent -mt-2">
                  <QRCodeSVG 
                    value={`https://dentaxy.com/verify/dr-${(cedulaGeneral || 'SEED').toUpperCase()}`}
                    size={68}
                    bgColor="#ffffff"
                    fgColor="#171717"
                    level="M"
                  />
                </div>

                {/* Columna Central (Col-span-4): Firma Digital del Doctor (Sin bordes verticales) */}
                <div className="col-span-4 flex flex-col items-center justify-end h-full px-2 min-h-[64px]">
                  <div className="flex-grow flex items-center justify-center w-full min-h-[44px]">
                    {signature ? (
                      <img src={signature} alt="Firma Doctor" className="max-h-[42px] max-w-full object-contain filter dark:invert-0 select-none pointer-events-none" />
                    ) : (
                      <div className="text-[7.5px] text-neutral-400 font-mono tracking-widest uppercase select-none italic text-center leading-normal">
                        FIRMA DIGITAL<br/>PENDIENTE
                      </div>
                    )}
                  </div>
                  {/* Línea horizontal de firma técnica punteada muy sutil */}
                  <div className="w-full border-t border-dashed border-neutral-300/40 mt-1" />
                  <span className="text-[6.5px] font-black tracking-widest text-neutral-500 uppercase mt-0.5" style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}>
                    FIRMA DIGITAL
                  </span>
                </div>

                {/* Columna Derecha (Col-span-5): Datos de Contacto y Sello COFILD en la Base */}
                <div className="col-span-5 flex flex-col items-end text-right font-mono leading-normal pl-1">
                  
                  {/* Teléfono de contacto */}
                  <div className="flex items-center gap-1 text-[11px] font-black tracking-wide text-neutral-900 leading-none">
                    <Phone size={9} className="text-neutral-500 shrink-0" strokeWidth={2.5} />
                    <span>{formattedPhone}</span>
                  </div>
                  
                  {/* Correo electrónico */}
                  <span className="text-[9.5px] text-neutral-500 font-bold tracking-wider block mt-0.5 truncate max-w-full">
                    {user?.email || 'doctor@dentaxy.com'}
                  </span>

                  {/* Logotipo circular Dentistry y Siglas COFILD pegadas en tipografía Bruno Ace SC (Dentro de la Tarjeta con Efecto de Resplandor y Glitch) */}
                  <div className="flex items-center gap-1 mt-0.5 select-none pr-1.5 pl-1 py-0.5 rounded">
                    <span 
                      className={`text-[12px] font-black tracking-[0.25em] uppercase mr-[-6px] transition-all duration-300 ${cofildReveal.isGlitching ? 'text-neutral-900 drop-shadow-[0_0_2px_rgba(255,255,255,0.9)] scale-[1.03]' : 'text-neutral-600'}`} 
                      style={{ fontFamily: '"Bruno Ace SC", sans-serif' }}
                    >
                      {cofildReveal.displayText}
                    </span>
                    <img 
                      src="/brand/dentistry-logo.png" 
                      alt="Dentistry Logo" 
                      className={`h-[46px] w-auto object-contain select-none pointer-events-none transition-all duration-300 filter dark:invert-0 ${cofildReveal.isGlitching ? 'brightness-125 scale-[1.03] drop-shadow-[0_0_3px_rgba(255,255,255,0.85)]' : 'opacity-95'}`} 
                    />
                  </div>
                </div>
                
              </div>            

            </div>
          </div>



        </div>

      </div>
    );
  };

  // 2. RENDER VISTA HISTORIA CLÍNICA (ESTILO EXPEDIENTE CLÍNICO DE PAPEL TEXTURIZADO)
  const renderHistoriaView = () => {
    return (
      <div className="flex-1 flex flex-col justify-between py-1 animate-fade-in-up">
        <div>
          {/* Header del Expediente */}
          <div className="flex justify-between items-center border-b border-neutral-200 pb-3 mb-4">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest">HISTORIA CLÍNICA INTEGRAL</span>
              <span className="text-[12px] font-black text-neutral-800 tracking-wider">EXPEDIENTE DIGITAL DENTAXY</span>
            </div>
            <span className="text-[8.5px] font-mono bg-neutral-900/5 text-neutral-600 border border-neutral-200 px-2 py-0.5 rounded-full font-bold">
              SYS-NOM-024
            </span>
          </div>

          <div className="space-y-3.5">
            {/* Ficha de Identificación */}
            <div className="bg-neutral-50/50 border border-neutral-200/50 rounded-2xl p-3.5">
              <div className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-1.5">Ficha de Identificación</div>
              <div className="grid grid-cols-2 gap-2 text-[9px] text-neutral-600 font-mono">
                <div>PACIENTE: <span className="font-bold text-neutral-700">ANÓNIMO DEMO</span></div>
                <div>GÉNERO: <span className="font-bold text-neutral-700">MASCULINO</span></div>
                <div>EDAD: <span className="font-bold text-neutral-700">28 AÑOS</span></div>
                <div>EXPEDIENTE: <span className="font-bold text-neutral-700">#0001-SEED</span></div>
              </div>
            </div>

            {/* Anamnesis / Antecedentes */}
            <div className="bg-neutral-50/50 border border-neutral-200/50 rounded-2xl p-3.5">
              <div className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-1.5">Antecedentes Clínicos Relevantes</div>
              <ul className="text-[9px] text-neutral-600 space-y-1">
                <li className="flex items-center gap-1.5"><CheckCircle2 size={10} className="text-neutral-500" /> Antecedentes Heredofamiliares: Sin patologías relevantes.</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 size={10} className="text-neutral-500" /> Patológicos Personales: Alergia declarada a la Penicilina.</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 size={10} className="text-neutral-500" /> Padecimiento Actual: Gingivitis marginal crónica y caries grado II.</li>
              </ul>
            </div>

            {/* Plan de Tratamiento */}
            <div className="bg-neutral-50/50 border border-neutral-200/50 rounded-2xl p-3.5">
              <div className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-1">Plan de Intervención / Diagnóstico</div>
              <p className="text-[9.5px] font-medium text-neutral-750">
                1. Profilaxis ultrasónica profunda. 2. Restauración directa con resina en órganos dentales 14 y 26. 3. Indicación de técnica de cepillado Bass modificada.
              </p>
            </div>
          </div>
        </div>

        {/* Sello de Autorización de la Historia Clínica */}
        <div className="border-t border-neutral-200 pt-3 flex justify-between items-center text-[8px] font-mono text-neutral-400">
          <span>MÉDICO PRESCRIPTOR: {doctorName.trim() ? doctorName.toUpperCase() : 'MÉDICO'}</span>
          <span>FIRMA ELECTRÓNICA REGISTRADA</span>
        </div>
      </div>
    );
  };

  // 3. RENDER VISTA RECETA MÉDICA (COMPACTA Y DE PAPEL BLANCO)
  const renderRecetaView = () => {
    return (
      <div className="flex-1 flex flex-col justify-between py-1 animate-fade-in-up">
        <div>
          <div className={`flex justify-between items-center mb-3 text-[8.5px] font-mono ${textMuted}`}>
            <span>FECHA: {new Date().toLocaleDateString('es-MX')}</span>
            <span>PESO: 75 kg | TALLA: 1.75 m</span>
          </div>
          
          <div className={`text-lg font-black italic mb-2.5 font-serif ${textMuted}`}>Rx</div>

          <div className="grid grid-cols-2 gap-3 mb-3.5">
            <div className={`${blockFlatClass} flex flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between">
                  <h4 className={`text-[11px] font-black uppercase ${textPrimary}`}>Amoxicilina</h4>
                  <span className={`text-[7px] border px-2 py-0.5 rounded-full font-bold ${badgeBg}`}>
                    Genérico
                  </span>
                </div>
                <p className={`text-[8.5px] ${textMuted} mt-0.5`}>Cápsulas 500 mg</p>
              </div>
              <p className={`text-[9px] font-semibold text-neutral-700 border-t border-neutral-200/40 pt-2 mt-2`}>
                Tomar 1 cápsula cada 8 horas por vía oral durante 7 días.
              </p>
            </div>
            
            <div className={`${blockFlatClass} flex flex-col justify-between`}>
              <div>
                <h4 className={`text-[11px] font-black uppercase ${textPrimary}`}>Ibuprofeno</h4>
                <p className={`text-[8.5px] ${textMuted} mt-0.5`}>Tabletas 400 mg</p>
              </div>
              <p className={`text-[9px] font-semibold text-neutral-700 border-t border-neutral-200/40 pt-2 mt-2`}>
                Tomar 1 tableta cada 8 horas por vía oral en caso de dolor.
              </p>
            </div>
          </div>
        </div>

        {/* Firma Autógrafa e Identificación de Receta */}
        <div className={`pt-3 flex flex-col items-center border-t relative z-10 ${rxLine}`}>
          <div className="w-44 h-10 mb-1 flex items-center justify-center relative border-b border-neutral-200">
            {signature ? (
              <img 
                src={signature} 
                alt="Firma" 
                className="max-w-full max-h-full object-contain z-10 mix-blend-multiply" 
              />
            ) : (
              <span className={`text-[8px] italic ${textMuted} z-0`}>Firma del profesional</span>
            )}
          </div>
          <p className={`text-[8.5px] font-black uppercase tracking-wider ${textPrimary} leading-none mt-1`}>
            {doctorName.trim() ? doctorName.toUpperCase() : 'NOMBRE DEL MÉDICO'}
          </p>
          <p className={`text-[7px] font-bold uppercase tracking-widest ${textMuted}`}>FIRMA DEL MÉDICO PRESCRIPTOR</p>
        </div>
      </div>
    );
  };

  // 4. RENDER VISTA UBICACIÓN (HUD CON RADAR PÁGINAS GEOLOCALIZACIÓN)
  const renderUbicacionView = () => {
    return (
      <div className="flex-1 flex gap-5 animate-fade-in-up">
        {/* Radar Map HUD simulado en el lado izquierdo */}
        <div className="w-1/3 rounded-[24px] overflow-hidden relative bg-neutral-900 border border-white/10 flex items-center justify-center">
          
          {/* Círculos de Radar Concéntricos */}
          <div className="absolute w-20 h-20 rounded-full border border-neutral-700/30 animate-ping opacity-25" />
          <div className="absolute w-14 h-14 rounded-full border border-neutral-700/50" />
          <div className="absolute w-8 h-8 rounded-full border border-neutral-600/70" />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1] animate-pulse" />
          
          {/* Líneas en Cruz */}
          <div className="absolute inset-y-2 left-1/2 w-[0.5px] bg-neutral-700/40" />
          <div className="absolute inset-x-2 top-1/2 h-[0.5px] bg-neutral-700/40" />

          {/* Telemetría Radar */}
          <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[6.5px] font-mono text-neutral-450">
            <span>AZ: 247°</span>
            <span>GPS: OK</span>
          </div>
        </div>

        {/* Información del Establecimiento / Dirección */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[7.5px] bg-neutral-900/10 border border-neutral-900/10 text-neutral-600 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                GEOLOCALIZACIÓN DE CLÍNICA
              </span>
            </div>
            <h3 className={`text-[16px] font-black uppercase leading-tight mb-2 tracking-wide ${clinicReveal.isGlitching ? 'text-indigo-600 font-mono animate-pulse' : 'text-neutral-800'}`}>
              {clinicReveal.displayText}
            </h3>

            <div className="space-y-3 mt-4">
              <div className="border-l-2 border-neutral-350 pl-3">
                <span className="text-[7.5px] font-black text-neutral-400 uppercase tracking-widest block">Dirección Oficial</span>
                <p className={`text-[10px] font-bold text-neutral-700 uppercase leading-snug ${domReveal.isGlitching ? 'text-neutral-600 font-mono animate-pulse' : ''}`}>
                  {domReveal.displayText}
                </p>
              </div>

              {telefono && (
                <div className="border-l-2 border-neutral-350 pl-3">
                  <span className="text-[7.5px] font-black text-neutral-400 uppercase tracking-widest block">Contacto de Consultorio</span>
                  <span className="text-[10.5px] font-mono font-black text-neutral-700 block tracking-wider mt-0.5">TEL: {telefono}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-neutral-900/5 rounded-2xl p-3 border border-neutral-200/40 flex items-center gap-2 text-neutral-500">
            <MapPin size={14} className="text-neutral-500 flex-shrink-0" />
            <p className="text-[8px] uppercase tracking-wider font-bold leading-normal">
              Dirección guardada reactivamente bajo lineamientos de COFEPRIS para recetas.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const isPerfil = activeTab === 'perfil';

  return (
    <div className={`relative w-full max-w-[690px] rounded-[32px] overflow-hidden flex flex-col transition-all duration-500 transform origin-top mx-auto ${
      isPerfil 
        ? 'bg-transparent shadow-none border-none px-4 py-4' 
        : `${containerBg} px-16 py-12 shadow-xl`
    }`}>
      
      {/* EFECTO TEXTURIZADO DE PAPEL (RUIDO DE FONDO EN MULTIPLY) - Solo si no es perfil */}
      {!isPerfil && (
        <>
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.075] mix-blend-multiply pointer-events-none z-0" />
          <div className="absolute inset-y-0 left-0 w-1/2 pointer-events-none bg-gradient-to-r from-black/[0.01] to-transparent z-0" />
          <div className="absolute inset-y-0 right-0 w-1/2 pointer-events-none bg-gradient-to-l from-black/[0.015] to-transparent z-0" />
        </>
      )}

      {/* RENDERIZADO CONDICIONAL DE LA VISTA SEGÚN TABS */}
      {activeTab === 'perfil' && renderPerfilView()}
      {activeTab === 'receta' && renderRecetaView()}
      {activeTab === 'historia' && renderHistoriaView()}
      {activeTab === 'ubicacion' && renderUbicacionView()}

      {/* Sci-Fi Grid Watermark - Solo si no es perfil */}
      {!isPerfil && (
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" 
             style={{ 
               backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', 
               backgroundSize: '24px 24px' 
             }} 
        />
      )}

    </div>
  );
}
