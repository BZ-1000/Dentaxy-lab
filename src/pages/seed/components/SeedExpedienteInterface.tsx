import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { 
  X, Check, Upload, FileText, Plus, Image as ImageIcon, 
  PenTool, ChevronLeft, RefreshCw, FileSignature, Activity, BookOpen,
  Camera, User, ScanLine, ImagePlus, AlertTriangle, Download, FileCode,
  Stethoscope, ClipboardList
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  getGoogleAccessToken, 
  initializePatientFolders, 
  writeJsonFile, 
  readJsonFile, 
  listFiles, 
  uploadBinaryFile,
  fetchDriveFileBlobUrl,
  PatientDriveFolders,
  getOrCreateSubfolder
} from '../../../utils/driveHelper';
import { Odontograma } from '../../../components/historia-clinica/Odontograma';
import { generateOdontogramHTML } from '../../../lib/engine/generateOdontogramRedaction';
import { ConsentimientosModule } from './ConsentimientosModule';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PatientAvatarViewer } from '../../../components/meta3d/PatientAvatarViewer';
import { LocalDocumentScanner, ExtractedPatientData } from '../../../components/scanner/LocalDocumentScanner';

interface SeedExpedienteInterfaceProps {
  folder: {
    id: string; // ID de la carpeta en Drive
    name: string; // Nombre formateado (ej. "PEREZ, JUAN")
    appProperties?: {
      telefono?: string;
      motivo?: string;
      alergias?: string;
    };
  };
  onClose: () => void;
}

const convertUrlToBase64 = async (url: string): Promise<string> => {
  if (url.startsWith('data:')) return url;
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error('Error al convertir URL a Base64:', url, err);
    return '';
  }
};

export default function SeedExpedienteInterface({ folder, onClose }: SeedExpedienteInterfaceProps) {
  const [activeTab, setActiveTab] = useState<'ficha' | 'odontograma'>('ficha');
  const [subfolderIds, setSubfolderIds] = useState<PatientDriveFolders | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Radiografías y firma digital en el documento del paciente
  const [patientRadiographs, setPatientRadiographs] = useState<{ id: string; name: string; url: string }[]>([]);
  const [patientSignatureUrl, setPatientSignatureUrl] = useState<string | null>(null);

  // Escáner OCR Local Zero-Trust
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleScanComplete = (data: ExtractedPatientData) => {
    if (data.alergias || data.antecedentes) {
      setHistoryData(prev => ({
        ...prev,
        antecedentes: data.curp ? `CURP: ${data.curp} | ${prev.antecedentes}` : prev.antecedentes
      }));
    }
    toast.success(`Datos de ${data.nombreCompleto || 'paciente'} autocompletados localmente ✓`);
  };

  const handleUploadRadiograph = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newItems: { id: string; name: string; url: string }[] = [];
    Array.from(files).forEach((file, idx) => {
      const url = URL.createObjectURL(file);
      newItems.push({ id: `rad_${Date.now()}_${idx}`, name: file.name, url });
    });
    setPatientRadiographs(prev => [...prev, ...newItems]);
    toast.success(`${newItems.length} radiografía(s) adjuntada(s) al documento`);
  };

  const handleRemoveRadiograph = (id: string) => {
    setPatientRadiographs(prev => prev.filter(r => r.id !== id));
    toast.info('Radiografía removida');
  };

  // Estados de Notas de Evolución
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState({ tratamiento: '', evolucion: '', proximaCita: '' });
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any | null>(null);

  // Estados de Historia Clínica
  const [historyData, setHistoryData] = useState({
    alergias: folder.appProperties?.alergias || 'Ninguna',
    motivo: folder.appProperties?.motivo || 'Valoración general',
    antecedentes: 'Ninguno relevante',
    sistemicas: 'Ninguna'
  });
  const [isSavingHistory, setIsSavingHistory] = useState(false);

  // Estados de Gabinete
  const [expandedRightCard, setExpandedRightCard] = useState<'gabinete' | 'cobros'>('gabinete');
  const [gabineteSubfolders, setGabineteSubfolders] = useState<Record<string, string>>({});
  const [gabineteFiles, setGabineteFiles] = useState<any[]>([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [gabinetTab, setGabinetTab] = useState<'radiografias' | 'intraorales' | 'paciente'>('radiografias');
  const [gabinetDragging, setGabinetDragging] = useState(false);
  const gabinetInputRef = useRef<HTMLInputElement>(null);

  // Estados de Consentimientos y Presupuestos
  const [consentFiles, setConsentFiles] = useState<any[]>([]);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [signatureTarget, setSignatureTarget] = useState('');
  
  // Estado de Odontograma
  const [odontogramaState, setOdontogramaState] = useState<any>(null);
  const [hasOdontogramaChanged, setHasOdontogramaChanged] = useState(false);
  // Vista del documento del odontograma: 'paciente' = historia clínica resumida, 'diagnostico' = odontograma clínico
  const [odontDocView, setOdontDocView] = useState<'paciente' | 'diagnostico'>('diagnostico');
  // HTML del documento del odontograma generado automáticamente
  const [odontogramaHTML, setOdontogramaHTML] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);

  // Estados de Presupuesto/Cobros
  const [presupuesto, setPresupuesto] = useState<{ id: string; concepto: string; costo: number; status?: 'pendiente' | 'liquidado' }[]>([]);
  const [isAddingConcept, setIsAddingConcept] = useState(false);
  const [newConcept, setNewConcept] = useState({ concepto: '', costo: '' });

  // Token de Google — puede refrescarse si expira
  const [currentToken, setCurrentToken] = useState<string | null>(getGoogleAccessToken());
  // Archivo pendiente de resubida tras re-autenticación
  const pendingUploadRef = useRef<File | null>(null);
  const [showReAuthModal, setShowReAuthModal] = useState(false);
  // Ref para initExpediente — evita dependencia circular con reAuth
  const initExpedienteRef = useRef<((token: string) => Promise<void>) | null>(null);

  // Obtener Token de Google (usamos el estado para poder actualizarlo)
  const accessToken = currentToken;

  // Re-autenticación automática cuando el token expira
  const reAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const newToken = tokenResponse.access_token;
      // Actualizar el token en sessionStorage y en estado
      try {
        const seedUserStr = sessionStorage.getItem('seed_user');
        if (seedUserStr) {
          const seedUser = JSON.parse(seedUserStr);
          seedUser.googleAccessToken = newToken;
          sessionStorage.setItem('seed_user', JSON.stringify(seedUser));
        }
      } catch (e) { /* ignore */ }
      setCurrentToken(newToken);
      setShowReAuthModal(false);
      toast.success('Sesión renovada correctamente.');
      // Si hay un archivo pendiente de subida, reintentarlo
      if (pendingUploadRef.current) {
        const file = pendingUploadRef.current;
        pendingUploadRef.current = null;
        // Re-inicializar el expediente con el token nuevo y luego subir
        setTimeout(async () => {
          if (initExpedienteRef.current) await initExpedienteRef.current(newToken);
          setTimeout(() => handleMediaUploadWithToken(file, newToken), 800);
        }, 300);
      } else {
        // Solo re-inicializar el expediente
        if (initExpedienteRef.current) initExpedienteRef.current(newToken);
      }
    },
    onError: () => {
      toast.error('No se pudo renovar la sesión de Google. Recarga la página.');
      setShowReAuthModal(false);
    },
    scope: 'https://www.googleapis.com/auth/drive.file',
    prompt: 'none', // Intento silencioso primero
  });

  // 1. Inicializar Carpetas y Cargar Datos
  const loadPatientData = useCallback(async (folders: PatientDriveFolders, token: string) => {
    try {
      // Cargar Historia Clínica JSON
      const historyFile = await readJsonFile<any>(folders.historiaId, 'historia.json', token);
      if (historyFile) {
        setHistoryData(prev => ({ ...prev, ...historyFile }));
      }

      // Cargar Cobros JSON
      const cobrosFile = await readJsonFile<any>(folders.historiaId, 'cobros.json', token);
      if (cobrosFile && Array.isArray(cobrosFile)) {
        setPresupuesto(cobrosFile);
      }

      // Cargar Odontograma JSON
      const odontogramaFile = await readJsonFile<any>(folders.odontogramaId, 'odontograma.json', token);
      if (odontogramaFile) {
        setOdontogramaState(odontogramaFile);
      }

      // Cargar Notas de Evolución (Listar JSONs de notas)
      const noteFiles = await listFiles(folders.notasId, token);
      const loadedNotes = await Promise.all(
        noteFiles
          .filter(f => f.name.endsWith('.json'))
          .map(async (f) => {
            const content = await readJsonFile<any>(folders.notasId, f.name, token);
            return { id: f.id, name: f.name, ...content };
          })
      );
      // Ordenar por fecha desc
      setNotes(loadedNotes.sort((a, b) => b.timestamp - a.timestamp));

      // Cargar Gabinete (Listar imágenes y crear subcarpetas en Drive si no existen)
      const radioId = await getOrCreateSubfolder(folders.gabineteId, 'Radiografias', token);
      const intraId = await getOrCreateSubfolder(folders.gabineteId, 'Intraorales', token);
      const pacId = await getOrCreateSubfolder(folders.gabineteId, 'Paciente', token);
      
      setGabineteSubfolders({
        radiografias: radioId,
        intraorales: intraId,
        paciente: pacId
      });

      const [radioList, intraList, pacList] = await Promise.all([
        listFiles(radioId, token),
        listFiles(intraId, token),
        listFiles(pacId, token)
      ]);

      const processMedia = async (list: any[], category: string) => {
        return Promise.all(list.map(async (file) => {
          try {
            const blobUrl = await fetchDriveFileBlobUrl(file.id, token);
            return { ...file, blobUrl, category };
          } catch {
            return { ...file, category };
          }
        }));
      };

      const allMedia = [
        ...(await processMedia(radioList, 'radiografias')),
        ...(await processMedia(intraList, 'intraorales')),
        ...(await processMedia(pacList, 'paciente'))
      ];
      setGabineteFiles(allMedia);

      // Cargar Consentimientos (Listar imágenes/archivos)
      const consentList = await listFiles(folders.consentimientosId, token);
      const resolvedConsents = await Promise.all(
        consentList.map(async (file) => {
          try {
            const blobUrl = await fetchDriveFileBlobUrl(file.id, token);
            return { ...file, blobUrl };
          } catch {
            return file;
          }
        })
      );
      setConsentFiles(resolvedConsents);

      // Cargar Presupuesto JSON de Drive
      try {
        const presupuestoFile = await readJsonFile<any[]>(folders.historiaId, 'presupuesto.json', token);
        if (presupuestoFile) {
          setPresupuesto(presupuestoFile);
        } else {
          // Presupuesto por defecto para demo/nuevo paciente
          const defaultPresupuesto = [
            { id: '1', concepto: 'Limpieza con Ultrasonido', costo: 850 },
            { id: '2', concepto: 'Resina Estética Complex', costo: 1200 },
            { id: '3', concepto: 'Endodoncia Diente 14', costo: 3500 }
          ];
          setPresupuesto(defaultPresupuesto);
          await writeJsonFile(folders.historiaId, 'presupuesto.json', defaultPresupuesto, token);
        }
      } catch (err) {
        console.error("Error al cargar presupuesto de Drive:", err);
      }

    } catch (error) {
      console.error("Error al cargar expedientes desde Google Drive:", error);
      toast.error("Error al sincronizar con Google Drive");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función de inicialización del expediente (reutilizable para retry)
  const initExpediente = useCallback(async (token: string) => {
    try {
      setIsLoading(true);
      const folders = await initializePatientFolders(folder.id, token);
      setSubfolderIds(folders);
      await loadPatientData(folders, token);
    } catch (err: any) {
      const msg = err?.message || '';
      console.error("Error en inicialización del expediente:", msg);
      if (msg.includes('401') || msg.includes('invalid') || msg.includes('expired')) {
        toast.warning('Sesión de Google expirada. Renueva tu sesión.');
        setShowReAuthModal(true);
      } else {
        toast.error('Error al conectar con Google Drive. Verifica tu conexión.');
      }
      setIsLoading(false);
    }
  }, [folder.id, loadPatientData]);

  // Mantener la ref sincronizada con la versión más reciente
  initExpedienteRef.current = initExpediente;

  useEffect(() => {
    if (!accessToken) {
      toast.error('No se detectó sesión activa de Google');
      setIsLoading(false);
      return;
    }
    initExpediente(accessToken);
  }, [folder.id, accessToken, initExpediente]);

  // Cerrar al presionar la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !signatureModalOpen && !previewImage) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, signatureModalOpen, previewImage]);

  // 2. Guardar Notas de Evolución
  const handleSaveNote = async () => {
    if (!newNote.tratamiento || !newNote.evolucion) {
      toast.warning("Complete el tratamiento y la evolución");
      return;
    }
    if (!subfolderIds || !accessToken) return;

    try {
      const timestamp = Date.now();
      const fileName = `nota_${timestamp}.json`;
      const notePayload = {
        timestamp,
        dateString: new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }),
        ...newNote
      };

      setIsLoading(true);
      await writeJsonFile(subfolderIds.notasId, fileName, notePayload, accessToken);
      
      // Recargar notas
      const noteFiles = await listFiles(subfolderIds.notasId, accessToken);
      const loadedNotes = await Promise.all(
        noteFiles
          .filter(f => f.name.endsWith('.json'))
          .map(async (f) => {
            const content = await readJsonFile<any>(subfolderIds.notasId, f.name, accessToken);
            return { id: f.id, name: f.name, ...content };
          })
      );
      setNotes(loadedNotes.sort((a, b) => b.timestamp - a.timestamp));
      
      setNewNote({ tratamiento: '', evolucion: '', proximaCita: '' });
      setIsAddingNote(false);
      toast.success("Nota de evolución guardada en Drive");
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar nota");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Guardar Historia Clínica (Anamnesis)
  const handleSaveHistory = async () => {
    if (!subfolderIds || !accessToken) return;
    setIsSavingHistory(true);
    try {
      await writeJsonFile(subfolderIds.historiaId, 'historia.json', historyData, accessToken);
      toast.success("Historia clínica guardada con éxito");
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar historia clínica");
    } finally {
      setIsSavingHistory(false);
    }
  };

  // 4a. Función interna de subida con token explícito (permite retry con token fresco)
  const handleMediaUploadWithToken = async (file: File, token: string) => {
    const targetFolderId = gabineteSubfolders[gabinetTab];
    if (!targetFolderId) {
      toast.error('Carpeta de gabinete no encontrada. Recarga el expediente.');
      return;
    }
    try {
      setIsUploadingMedia(true);
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const fileId = await uploadBinaryFile(targetFolderId, sanitizedName, file.type, file, token);
      const blobUrl = URL.createObjectURL(file);
      setGabineteFiles(prev => [{ id: fileId, name: sanitizedName, mimeType: file.type, blobUrl, category: gabinetTab }, ...prev]);
      toast.success(`✅ Imagen guardada en ${gabinetTab}`);
    } catch (err: any) {
      console.error('[Dentaxy] Error en retry de subida:', err);
      toast.error(`Error al subir imagen: ${err?.message?.slice(0, 100)}`);
    } finally {
      setIsUploadingMedia(false);
    }
  };

  // 4. Carga de Imágenes de Gabinete
  const handleMediaUpload = async (fileOrEvent: React.ChangeEvent<HTMLInputElement> | File) => {
    let file: File;
    if ('target' in fileOrEvent) {
      if (!fileOrEvent.target.files || fileOrEvent.target.files.length === 0) return;
      file = fileOrEvent.target.files[0];
    } else {
      file = fileOrEvent;
    }

    // Validar sesión
    if (!accessToken) {
      toast.error("Sin sesión activa. Recarga la página e inicia sesión nuevamente.");
      return;
    }
    if (accessToken.startsWith('mock-')) {
      toast.error("Estás en modo simulación. Inicia sesión con Google real para subir archivos.");
      return;
    }
    if (!subfolderIds) {
      toast.error("Expediente no inicializado. Espera un momento y vuelve a intentarlo.");
      toast.loading('Reconectando con Drive...');
      pendingUploadRef.current = file;
      reAuth();
      return;
    }

    const targetFolderId = gabineteSubfolders[gabinetTab];
    if (!targetFolderId) {
      // Las subcarpetas de gabinete no están listas, reintentar en 1.5s
      toast.loading('Preparando carpetas...');
      setTimeout(() => handleMediaUpload(file), 1500);
      return;
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten archivos de imagen (JPG, PNG, HEIC, etc.)');
      return;
    }

    try {
      setIsUploadingMedia(true);

      // Test de conectividad: verificar token antes de subir
      const testRes = await fetch('https://www.googleapis.com/drive/v3/about?fields=user', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!testRes.ok) {
        // Token expirado — lanzar re-autenticación y guardar archivo para retry
        setIsUploadingMedia(false);
        pendingUploadRef.current = file;
        toast.warning('Tu sesión de Google expiró. Renovando automáticamente...');
        setShowReAuthModal(true);
        reAuth();
        return;
      }

      // Token válido — proceder con la subida
      await handleMediaUploadWithToken(file, accessToken!);

    } catch (err: any) {
      const msg = err?.message || 'Error desconocido';
      console.error('[Dentaxy] Error subiendo imagen:', msg);
      toast.error(`Drive: ${msg.slice(0, 120)}`);
    } finally {
      setIsUploadingMedia(false);
    }
  };

  // 5. Firma Digital de Consentimientos (Canvas)
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = true;
    ctx.beginPath();
    
    // Obtener coordenadas relativas
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#334155'; // Trazo gris oscuro para versión clara
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !subfolderIds || !accessToken) return;

    try {
      setIsLoading(true);
      const dataUrl = canvas.toDataURL('image/png');
      // Convertir dataUrl base64 a Blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      const fileName = `${signatureTarget.replace(/\s+/g, '_')}_firmado_${Date.now()}.png`;
      const fileId = await uploadBinaryFile(
        subfolderIds.consentimientosId,
        fileName,
        'image/png',
        blob,
        accessToken
      );

      setConsentFiles(prev => [{ id: fileId, name: fileName, mimeType: 'image/png', blobUrl: dataUrl }, ...prev]);
      setSignatureModalOpen(false);
      toast.success("Documento firmado guardado en Drive");
    } catch (err) {
      console.error(err);
      toast.error("Error al procesar la firma");
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Guardar Cambios de Odontograma
  const handleOdontogramaStateChange = (state: Record<number, any>) => {
    setOdontogramaState(state);
    setHasOdontogramaChanged(true);
    // Regenerar el documento clínico automáticamente
    const arr = Object.entries(state).map(([key, v]: [string, any]) => ({
      id: parseInt(key),
      state: v.clinicalState,
      surfaces: v.surfaces || {},
      mobility: v.mobility,
      cariesGrade: v.cariesGrade,
      crownType: v.crownType,
      pulpLabel: v.pulpLabel,
      materialType: v.materialType,
    }));
    setOdontogramaHTML(generateOdontogramHTML(arr as any));
  };

  const saveOdontogramaToDrive = async () => {
    if (!subfolderIds || !accessToken || !odontogramaState) return;
    setIsLoading(true);
    try {
  await writeJsonFile(subfolderIds.odontogramaId, 'odontograma.json', odontogramaState, accessToken);
      setHasOdontogramaChanged(false);
      toast.success("Odontograma guardado en Google Drive");
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar odontograma");
    } finally {
      setIsLoading(false);
    }
  };

  // 10. EXPORTAR ODONTOGRAMA EN .HTML INTERACTIVO AUTÓNOMO
    const handleExportOdontogramHTML = async () => {
    try {
      setIsLoading(true);
      const fechaStr = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
      const docContent = odontogramaHTML || '<p style="color:#9CA3AF;font-size:13px;text-align:center;padding:32px 0">Modifica el odontograma para generar el documento clínico.</p>';

      // ── Cargar imágenes base64 de dientes ────────────────────────────────
      const toothBase64Cache: Record<number, string> = {};
      const allToothIds = [18,17,16,15,14,13,12,11, 21,22,23,24,25,26,27,28, 48,47,46,45,44,43,42,41, 31,32,33,34,35,36,37,38];
      await Promise.all(allToothIds.map(async (id) => {
        toothBase64Cache[id] = await convertUrlToBase64(`/teeth/${id}.svg`);
      }));

      // ── Convertir radiografías a Base64 ──────────────────────────────────
      const radsBase64: { name: string; dataUrl: string }[] = [];
      for (const rad of patientRadiographs) {
        try {
          const b64 = await convertUrlToBase64(rad.url);
          radsBase64.push({ name: rad.name, dataUrl: b64 });
        } catch (_) {}
      }

      // ── Convertir firma a Base64 si existe ──────────────────────────────
      let signatureBase64: string | null = null;
      if (patientSignatureUrl) {
        try {
          signatureBase64 = await convertUrlToBase64(patientSignatureUrl);
        } catch (_) {}
      }

      // Colores normativos ADA
      const ADA_COLORS: Record<string, string> = {
        S: '#FFFFFF', C: '#EA4335', O: '#1A73E8', EI: '#EA4335',
        A: '#1A73E8', CR: '#1A73E8', PU: '#1A73E8', E: '#1A73E8',
        IM: '#1A73E8', SE: '#1A73E8', F: '#EA4335', MOV: '#1A73E8',
        RT: '#EA4335', OF: '#A52A2A', RR: '#EA4335', PC: '#1A73E8', PP: '#1A73E8',
      };

      const STATE_LABELS: Record<string, string> = {
        S: 'Sano', C: 'Caries', O: 'Obturado', EI: 'Ext. Indicada',
        A: 'Ausente', CR: 'Corona', PU: 'Puente', E: 'Endodoncia',
        IM: 'Implante', SE: 'Sellador', F: 'Fractura', MOV: 'Movilidad',
        RT: 'Rest. Temporal', OF: 'Obturación Filtrada', RR: 'Rem. Radicular',
        PC: 'Pulpectomía', PP: 'Pulpotomía',
      };

      // Arco permanente FDI
      const Q1 = [18,17,16,15,14,13,12,11];
      const Q2 = [21,22,23,24,25,26,27,28];
      const Q4 = [48,47,46,45,44,43,42,41];
      const Q3 = [31,32,33,34,35,36,37,38];
      const upperRow = [...Q1, ...Q2];
      const lowerRow = [...Q4, ...Q3];

      const getToothColor = (id: number): string => {
        if (!odontogramaState || !odontogramaState[id]) return '#FFFFFF';
        const t = odontogramaState[id];
        const s = t.clinicalState || t.state || 'S';
        if (s === 'S') return '#FFFFFF';
        return ADA_COLORS[s] || '#E5E7EB';
      };

      const getToothState = (id: number): string => {
        if (!odontogramaState || !odontogramaState[id]) return 'S';
        return odontogramaState[id].clinicalState || odontogramaState[id].state || 'S';
      };

      const getFaceColors = (id: number) => {
        if (!odontogramaState || !odontogramaState[id]) return {};
        const t = odontogramaState[id];
        return {
          top: t.top, bottom: t.bottom, left: t.left, right: t.right, center: t.center
        };
      };

      // Render de diente idéntico a DentaXy (Imágenes con máscaras CSS)
      const renderToothAnatomicalSVG = (id: number, isUpper: boolean): string => {
        const state = getToothState(id);
        const label = STATE_LABELS[state] || state;
        const faceColors = getFaceColors(id);
        const base64Img = toothBase64Cache[id] || '';

        const WHITE = '#FFFFFF';
        const backColor = isUpper ? faceColors.bottom : faceColors.top;
        const isBackActive = backColor && backColor.toUpperCase() !== WHITE;
        const centerColor = isUpper ? faceColors.top : faceColors.bottom;
        const isCenterActive = centerColor && centerColor.toUpperCase() !== WHITE;
        const oclusalColor = faceColors.center;
        const isOclusalActive = oclusalColor && oclusalColor.toUpperCase() !== WHITE;
        const leftColor = faceColors.left;
        const isLeftActive = leftColor && leftColor.toUpperCase() !== WHITE;
        const rightColor = faceColors.right;
        const isRightActive = rightColor && rightColor.toUpperCase() !== WHITE;

        const maskGradient = isUpper 
          ? 'linear-gradient(to bottom, transparent 35%, black 65%)' 
          : 'linear-gradient(to top, transparent 35%, black 65%)';

        const isUpperWisdom = id === 18 || id === 28;
        const isMolar = [6, 7, 8].includes(id % 10) && !isUpperWisdom;
        const imgWidth = isUpperWisdom ? 50 : isMolar ? 62 : 52;
        const containerWidth = isUpperWisdom ? 39 : isMolar ? 49 : 41;
        const objectPosition = isUpper ? 'bottom center' : 'top center';

        // Calcular curvatura tipo arco dental
        const position = id % 10;
        const CURVE_PX = [0, 4, 9, 15, 20, 24, 27, 29];
        const curveAmt = CURVE_PX[Math.min(position - 1, 7)];
        const curveTransform = `translateY(${isUpper ? Math.round(curveAmt * 0.75) : -Math.round(curveAmt * 0.5)}px)`;

        // Construir capas de fondo idénticas a ToothBox
        const bgLayers = [];
        if (isCenterActive) bgLayers.push(`radial-gradient(circle at center, ${centerColor} 25%, transparent 60%)`);
        if (isOclusalActive) bgLayers.push(`radial-gradient(ellipse 70% 35% at ${isUpper ? 'bottom' : 'top'} center, ${oclusalColor} 20%, transparent 60%)`);
        if (isLeftActive) bgLayers.push(`linear-gradient(to right, ${leftColor} 0%, transparent 40%)`);
        if (isRightActive) bgLayers.push(`linear-gradient(to left, ${rightColor} 0%, transparent 40%)`);
        const bgStyle = bgLayers.length > 0 ? `background: ${bgLayers.join(', ')}; mix-blend-mode: multiply;` : '';

        // Estilos en línea para replicar ToothBox.tsx en el export HTML
        return `
          <div class="tooth-container" data-tooth="${id}" data-state="${state}" data-label="${label}" style="width: ${containerWidth}px; transform: ${curveTransform};">
            <div class="tooth-wrapper" style="position: relative; display: flex; flex-direction: column; align-items: center; width: ${containerWidth}px; height: auto;">
              
              ${isBackActive ? `
              <div style="position: absolute; inset: 0; pointer-events: none; z-index: 1; filter: drop-shadow(0px 0px 4px ${backColor}) drop-shadow(0px 0px 10px ${backColor});">
                <img src="${base64Img}" alt="" style="width: 100%; height: 100%; object-fit: contain; object-position: ${objectPosition}; -webkit-mask-image: ${maskGradient}; mask-image: ${maskGradient};" />
              </div>
              ` : ''}

              <img src="${base64Img}" alt="Diente ${id}" style="width: ${imgWidth}px; max-height: 115px; object-fit: contain; object-position: ${objectPosition}; filter: drop-shadow(0px 3px 6px rgba(15, 25, 45, 0.25)); position: relative; z-index: 5; display: block;" />

              ${bgLayers.length > 0 ? `
              <div style="position: absolute; inset: 0; -webkit-mask-image: ${maskGradient}; mask-image: ${maskGradient}; pointer-events: none; z-index: 10;">
                <div style="position: absolute; inset: 0; ${bgStyle}"></div>
              </div>
              ` : ''}
              
              ${state === 'A' ? `
              <div style="position: absolute; inset: 0; z-index: 20; display: flex; align-items: center; justify-content: center;">
                 <svg viewBox="0 0 24 24" style="width: 24px; height: 24px; stroke: #1A73E8; stroke-width: 2; stroke-linecap: round;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </div>
              ` : ''}
              ${state === 'EI' || state === 'RR' ? `
              <div style="position: absolute; inset: 0; z-index: 20; display: flex; align-items: center; justify-content: center;">
                 <svg viewBox="0 0 24 24" style="width: 24px; height: 24px; stroke: #EA4335; stroke-width: 2; stroke-linecap: round;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </div>
              ` : ''}
              ${state === 'CR' ? `
              <div style="position: absolute; inset: 0; z-index: 20; display: flex; align-items: center; justify-content: center;">
                 <svg viewBox="0 0 24 24" style="width: 24px; height: 24px; fill: none; stroke: #1A73E8; stroke-width: 2;"><circle cx="12" cy="12" r="10"></circle></svg>
              </div>
              ` : ''}
              ${state === 'E' || state === 'PC' || state === 'PP' ? `
              <div style="position: absolute; inset: 0; z-index: 20; display: flex; align-items: center; justify-content: center;">
                 <div style="width: 3px; height: 100%; background-color: #1A73E8;"></div>
              </div>
              ` : ''}

            </div>
            <span class="tooth-number" style="margin-top: 8px;">${id}</span>
          </div>`;
      };

      const upperAnatomicalHTML = upperRow.map(id => renderToothAnatomicalSVG(id, true)).join('');
      const lowerAnatomicalHTML = lowerRow.map(id => renderToothAnatomicalSVG(id, false)).join('');

      // Consentimientos Requeridos (con textos idénticos a ConsentimientosModule)
      const presentTeeth = !odontogramaState ? [] : Object.values(odontogramaState);
      const hasCaries = presentTeeth.some((t: any) => t.clinicalState === 'C' || t.clinicalState === 'O' || t.clinicalState === 'OF' || t.state === 'C' || t.state === 'O' || t.state === 'OF');
      const hasEndo = presentTeeth.some((t: any) => t.clinicalState === 'E' || t.clinicalState === 'PC' || t.clinicalState === 'PP' || t.state === 'E' || t.state === 'PC' || t.state === 'PP');
      const hasExo = presentTeeth.some((t: any) => t.clinicalState === 'EI' || t.clinicalState === 'RR' || (t.clinicalState === 'MOV' && t.mobility === 3) || t.state === 'EI' || t.state === 'RR');
      const hasProtesis = presentTeeth.some((t: any) => t.clinicalState === 'CR' || t.clinicalState === 'PU' || t.clinicalState === 'IM' || t.state === 'CR' || t.state === 'PU' || t.state === 'IM');
      
      const consentsList: { title: string; category: string; text: string }[] = [
        {
          title: 'Consentimiento Informado General de Atención Odontológica',
          category: 'Atención General',
          text: `
            <p><strong>Descripción del Procedimiento:</strong> Consiste en la evaluación diagnóstica integral, toma de radiografías, fotografías clínicas, profilaxis (limpieza dental) y aplicaciones tópicas de flúor u otros agentes preventivos.</p>
            <h4 style="color:#0F172A; font-weight:700; margin-top:12px; margin-bottom:6px;">Riesgos y Complicaciones Posibles:</h4>
            <ul style="margin:0; padding-left:20px;">
              <li><strong>Sensibilidad Transitoria:</strong> Ligera sensibilidad al frío o calor tras la limpieza.</li>
              <li><strong>Sangrado Gingival Leve:</strong> Sangrado de las encías durante o inmediatamente después del sondaje periodontal o limpieza, especialmente si hay inflamación previa (gingivitis).</li>
            </ul>
            <h4 style="color:#0F172A; font-weight:700; margin-top:12px; margin-bottom:6px;">Alternativas de Tratamiento:</h4>
            <p style="margin:0;">No realizar la fase diagnóstica y preventiva, lo que impide detectar patologías a tiempo y aumenta el riesgo de pérdida dental.</p>
          `
        }
      ];

      if (hasCaries) {
        consentsList.push({
          title: 'Consentimiento Informado: Recambio de Obturación Filtrada (Resina Compuesta)',
          category: 'Operatoria Dental',
          text: `
            <p><strong>Descripción del Procedimiento:</strong> Consiste en la remoción total del material restaurador previo que presenta filtración marginal, eliminación de tejido cariado secundario (si existiera), acondicionamiento del tejido dentario y colocación de una nueva restauración estética de resina compuesta fotopolimerizable.</p>
            <h4 style="color:#0F172A; font-weight:700; margin-top:12px; margin-bottom:6px;">Riesgos y Complicaciones Posibles:</h4>
            <ul style="margin:0; padding-left:20px;">
              <li><strong>Sensibilidad Posoperatoria:</strong> Molestia temporal al frío, calor o a la masticación durante las primeras semanas.</li>
              <li><strong>Involucramiento Pulpar Inesperado:</strong> Si la filtración o caries previa es muy profunda, la remoción puede dejar expuesta la pulpa dentaria ("nervio"), requiriendo tratamiento de conductos (endodoncia).</li>
              <li><strong>Ajuste Oclusal:</strong> Necesidad de retoques posteriores en la mordida si se percibe un punto alto de contacto.</li>
              <li><strong>Fractura o Desprendimiento:</strong> Riesgo de fractura del material o de la estructura remanente ante cargas masticatorias excesivas o hábitos parafuncionales (bruxismo).</li>
            </ul>
            <h4 style="color:#0F172A; font-weight:700; margin-top:12px; margin-bottom:6px;">Alternativas de Tratamiento:</h4>
            <p style="margin:0;">Incrustación estética (cerámica/resina), corona de cobertura completa o abstención del tratamiento (lo cual incrementa el riesgo de avance de la caries e infección pulpar).</p>
          `
        });
      }

      if (hasEndo) {
        consentsList.push({
          title: 'Consentimiento Informado: Tratamiento de Conductos (Endodoncia)',
          category: 'Endodoncia',
          text: `
            <p><strong>Descripción del Procedimiento:</strong> Procedimiento destinado a conservar la pieza dentaria mediante la eliminación del tejido pulpar inflamado o infectado, la conformación, desinfección y posterior sellado tridimensional de los conductos radiculares.</p>
            <h4 style="color:#0F172A; font-weight:700; margin-top:12px; margin-bottom:6px;">Riesgos y Complicaciones Posibles:</h4>
            <ul style="margin:0; padding-left:20px;">
              <li><strong>Molestia o Inflamación Posoperatoria:</strong> Dolor moderado o inflamación en la zona tratada durante los días posteriores al tratamiento, manejable con analgésicos.</li>
              <li><strong>Anatomía Radicular Compleja / Instrumentación:</strong> Riesgo de fractura de instrumentos endodónticos dentro del conducto debido a curvaturas severas o calcificaciones, o perforación del conducto radicular.</li>
              <li><strong>Sobreobturación o Subobturación:</strong> Variación en el límite de sellado apical debida a variaciones anatómicas.</li>
              <li><strong>Sobreinfección o Fracaso Endodóntico:</strong> Persistencia de bacterias que podría requerir retratamiento endodóntico, cirugía periapical o la extracción del diente.</li>
              <li><strong>Fragilidad Estructural:</strong> Los dientes tratados endodónticamente pierden hidratación y estructura, volviéndose más frágiles y requiriendo obligatoriamente una restauración definitiva adecuada (poste/incrustación/corona) para evitar fracturas irreparables.</li>
            </ul>
            <h4 style="color:#0F172A; font-weight:700; margin-top:12px; margin-bottom:6px;">Alternativas de Tratamiento:</h4>
            <p style="margin:0;">Extracción de la pieza dentaria y posterior rehabilitación mediante prótesis fija, removible o implante dental.</p>
          `
        });
      }

      if (hasExo) {
        consentsList.push({
          title: 'Consentimiento Informado: Cirugía Oral y Exodoncia',
          category: 'Cirugía Oral',
          text: `
            <p><strong>Descripción del Procedimiento:</strong> Extirpación de la pieza dentaria indicada debido a patología pulpar irreversible, destrucción estructural severa, enfermedad periodontal avanzada o indicación ortodóntica. Incluye anestesia local, incisión (si aplica), extracción y sutura.</p>
            <h4 style="color:#0F172A; font-weight:700; margin-top:12px; margin-bottom:6px;">Riesgos y Complicaciones Posibles:</h4>
            <ul style="margin:0; padding-left:20px;">
              <li><strong>Hemorragia e Inflamación:</strong> Sangrado moderado e inflamación (edema) de la zona quirúrgica durante los primeros días.</li>
              <li><strong>Alveolitis:</strong> Infección o inflamación del lecho óseo debido a la pérdida del coágulo sanguíneo, provocando dolor intenso.</li>
              <li><strong>Lesión a Estructuras Adyacentes:</strong> Daño accidental a dientes vecinos, restauraciones previas o afectación temporal/permanente de nervios cercanos (causando parestesia o adormecimiento del labio o lengua).</li>
              <li><strong>Comunicación Oroantral:</strong> En el caso de extracciones de molares superiores, posible perforación hacia el seno maxilar.</li>
            </ul>
            <h4 style="color:#0F172A; font-weight:700; margin-top:12px; margin-bottom:6px;">Alternativas de Tratamiento:</h4>
            <p style="margin:0;">Ninguna, cuando el diagnóstico establece la no conservabilidad de la pieza.</p>
          `
        });
      }

      if (hasProtesis) {
        consentsList.push({
          title: 'Consentimiento Informado: Rehabilitación Protésica (Coronas / Puentes)',
          category: 'Rehabilitación Oral',
          text: `
            <p><strong>Descripción del Procedimiento:</strong> Preparación anatómica del diente remanente y confección de una estructura protésica fija (corona o incrustación) para restaurar la función masticatoria, estética y proteger al diente de posibles fracturas.</p>
            <h4 style="color:#0F172A; font-weight:700; margin-top:12px; margin-bottom:6px;">Riesgos y Complicaciones Posibles:</h4>
            <ul style="margin:0; padding-left:20px;">
              <li><strong>Sensibilidad:</strong> En dientes vitales, la preparación puede desencadenar sensibilidad térmica que, en algunos casos, derive en necesidad de tratamiento de conductos.</li>
              <li><strong>Desprendimiento o Fractura:</strong> La restauración puede aflojarse o fracturarse debido a masticación de alimentos muy duros, traumatismos o bruxismo severo.</li>
              <li><strong>Inflamación Gingival:</strong> Acumulación de placa si los márgenes protésicos dificultan la higiene, provocando inflamación o retracción de la encía a largo plazo.</li>
            </ul>
            <h4 style="color:#0F172A; font-weight:700; margin-top:12px; margin-bottom:6px;">Alternativas de Tratamiento:</h4>
            <p style="margin:0;">Abstención (riesgo muy alto de fractura coronaria o radicular en dientes debilitados) o exodoncia de la pieza y colocación de implante.</p>
          `
        });
      }

      const consentsHTML = consentsList.map((c, idx) => `
        <div class="consentimiento-block" style="border: 1px solid #E2E8F0; padding: 20px; border-radius: 12px; margin-bottom: 20px; background: #FFFFFF; page-break-inside: avoid;">
          <h3 style="color: #0F172A; font-size: 15px; font-weight: 800; margin-top: 0; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
             <span class="idx-badge">${idx + 1}</span> ${c.title}
          </h3>
          <div style="font-size: 13px; color: #475569; line-height: 1.6;">
            ${c.text}
          </div>
        </div>`).join('') + `
        <div style="background: #F8FAFC; border-left: 4px solid #10B981; padding: 16px; border-radius: 4px; margin-top: 20px; font-size: 12px; color: #334155; line-height: 1.6; page-break-inside: avoid;">
          <strong>Declaración del Paciente:</strong><br/>
          "He leído y comprendido la información sobre los procedimientos planteados, sus riesgos, beneficios y alternativas. He tenido la oportunidad de formular preguntas y todas han sido respondidas a mi satisfacción. Otorgo mi consentimiento de manera libre y voluntaria para la realización de los tratamientos descritos."
        </div>
      `;

      // Radiografías HTML
      const radsHTML = radsBase64.length > 0 ? `
        <div class="card">
          <div class="card-label">📁 ESTUDIOS COMPLEMENTARIOS Y RADIOGRAFÍAS ADJUNTAS (${radsBase64.length})</div>
          <div class="rads-grid">
            ${radsBase64.map(r => `
              <div class="rad-item">
                <img src="${r.dataUrl}" alt="${r.name}" onclick="openModal(this.src)" />
                <span>${r.name}</span>
              </div>`).join('')}
          </div>
        </div>` : '';

      // Firma HTML Dinámica e Interactiva
      const signatureHTML = signatureBase64 ? `
        <div class="signature-box signed" style="page-break-inside: avoid;">
          <div class="sig-header">
            <span class="badge-valid">✓ DOCUMENTO FIRMADO Y VALIDADO</span>
            <small>Firma Autógrafa Digital registrada</small>
          </div>
          <img src="${signatureBase64}" alt="Firma Autógrafa del Paciente" class="sig-img" />
          <p class="sig-name">${folder.name}</p>
          <small class="sig-date">Fecha de Firma: ${fechaStr}</small>
        </div>` : `
        <div class="signature-box unsigned interactive-signature" id="signatureContainer" style="page-break-inside: avoid; text-align: left;">
          <div style="margin-bottom: 16px;">
            <p style="color: #0F172A; font-size: 14px; font-weight: 800; margin: 0 0 4px 0;">Firma Digital del Paciente o Tutor</p>
            <p style="color: #64748B; font-size: 11px; margin: 0;">Por favor, firme en el recuadro inferior para aceptar legalmente los tratamientos propuestos.</p>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
            <div>
              <label style="display: block; font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 4px;">Nombre Completo</label>
              <input type="text" id="sigName" value="${folder.name}" style="width: 100%; padding: 8px 12px; border: 1px solid #E2E8F0; border-radius: 8px; font-size: 13px;" />
            </div>
            <div>
              <label style="display: block; font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 4px;">ID Expediente / Identificación</label>
              <input type="text" id="sigId" placeholder="Ej. DNI / CURP / Cédula" style="width: 100%; padding: 8px 12px; border: 1px solid #E2E8F0; border-radius: 8px; font-size: 13px;" />
            </div>
          </div>

          <div style="border: 2px dashed #CBD5E1; border-radius: 12px; background: #F8FAFC; position: relative; height: 180px; overflow: hidden; margin-bottom: 16px;">
            <canvas id="sigCanvas" style="width: 100%; height: 100%; cursor: crosshair; touch-action: none;"></canvas>
          </div>

          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button onclick="clearCanvas()" style="padding: 8px 16px; border: 1px solid #CBD5E1; background: #FFF; border-radius: 8px; color: #475569; font-weight: 600; cursor: pointer; font-size: 12px;">Limpiar Lienzo</button>
            <button onclick="saveSignature()" style="padding: 8px 16px; border: none; background: #10B981; border-radius: 8px; color: #FFF; font-weight: 600; cursor: pointer; font-size: 12px;">Guardar y Sellar Documento</button>
          </div>
        </div>

        <div id="lockedSignature" style="display: none; page-break-inside: avoid; text-align: center;" class="signature-box signed">
          <div class="sig-header">
            <span class="badge-valid">✓ DOCUMENTO FIRMADO Y SELLADO</span>
            <small style="display: block; margin-top: 8px; color: #10B981; font-weight: 700;">Firma Autógrafa Recabada en el Documento Digital</small>
          </div>
          <img id="lockedSigImg" src="" alt="Firma Autógrafa del Paciente" class="sig-img" />
          <p class="sig-name" id="lockedSigName"></p>
          <p style="font-size: 12px; color: #475569; margin: 4px 0 0 0;" id="lockedSigId"></p>
          <small class="sig-date" id="lockedSigDate"></small>
        </div>
        `;

      const toothInfoJSON = JSON.stringify(
        allToothIds.reduce((acc, id) => {
          const tooth = odontogramaState && odontogramaState[id];
          if (tooth) {
            const state = tooth.clinicalState || tooth.state || 'S';
            const faces = [
              tooth.top && tooth.top !== '#FFFFFF' ? 'Vestibular/Superior' : '',
              tooth.bottom && tooth.bottom !== '#FFFFFF' ? 'Palatino/Lingual/Inferior' : '',
              tooth.left && tooth.left !== '#FFFFFF' ? 'Mesial/Izquierda' : '',
              tooth.right && tooth.right !== '#FFFFFF' ? 'Distal/Derecha' : '',
              tooth.center && tooth.center !== '#FFFFFF' ? 'Oclusal/Centro' : ''
            ].filter(Boolean).join(', ');

            acc[id] = {
              state: state,
              label: STATE_LABELS[state] || 'Sano',
              diagnostico: tooth.diagnostico || '',
              tratamiento: tooth.tratamiento || '',
              observaciones: tooth.observaciones || '',
              surfaces: faces || 'Ninguna específica'
            };
          } else {
            acc[id] = {
              state: 'S',
              label: 'Sano',
              diagnostico: '',
              tratamiento: '',
              observaciones: '',
              surfaces: 'Ninguna específica'
            };
          }
          return acc;
        }, {} as Record<number, any>)
      );

      const htmlFile = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Expediente Clínico — ${folder.name} — Dentaxy</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #F1F5F9;
      color: #0F172A;
      min-height: 100vh;
      padding: 24px 12px;
    }
    .page-wrapper {
      max-width: 900px;
      margin: 0 auto;
    }
    .doc-header {
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
      border-radius: 24px;
      padding: 32px;
      color: white;
      margin-bottom: 24px;
      position: relative;
      box-shadow: 0 10px 30px rgba(15,23,42,0.15);
    }
    .doc-header h1 { font-size: 26px; font-weight: 900; letter-spacing: -0.5px; margin-bottom: 6px; }
    .doc-header .subtitle { font-size: 11px; opacity: 0.7; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
    .doc-header .meta { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 16px; }
    .doc-header .meta span { background: rgba(255,255,255,0.12); padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .action-bar { display: flex; gap: 10px; margin-bottom: 20px; }
    .btn-action {
      flex: 1; padding: 12px 16px; border-radius: 14px; border: none; font-size: 12px; font-weight: 700; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;
    }
    .btn-print { background: #0F172A; color: white; }
    .btn-ws { background: #10B981; color: white; }
    .card {
      background: #FFFFFF; border-radius: 20px; border: 1px solid #E2E8F0; padding: 24px; margin-bottom: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03), 0 6px 20px rgba(0,0,0,0.02);
    }
    .card-label { font-size: 10px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #64748B; margin-bottom: 18px; }
    
    /* Odontograma Anatómico Fiel */
    .arch-block { display: flex; justify-content: center; gap: 4px; overflow-x: auto; padding: 12px 0; }
    .tooth-container { display: flex; flex-direction: column; align-items: center; width: 38px; cursor: pointer; }
    .tooth-wrapper { width: 38px; height: 50px; }
    .tooth-svg { width: 100%; height: 100%; }
    .tooth-number { font-size: 10px; font-weight: 700; color: #64748B; margin-top: 4px; }
    .arch-divider { height: 1px; background: #E2E8F0; margin: 16px 0; }
    .tooth-container {
      cursor: pointer;
      transition: transform 0.15s ease, filter 0.15s ease;
    }
    .tooth-container:hover {
      transform: scale(1.1) !important;
      filter: drop-shadow(0 0 6px rgba(26, 115, 232, 0.4));
    }
    .selected-tooth {
      filter: drop-shadow(0 0 8px rgba(26, 115, 232, 0.7)) !important;
      transform: scale(1.15) !important;
    }

    /* Consentimientos Informados */
    .consent-detail { border: 1px solid #E2E8F0; border-radius: 14px; margin-bottom: 10px; overflow: hidden; background: #FFF; }
    .consent-detail summary { padding: 14px 16px; cursor: pointer; display: flex; align-items: center; gap: 12px; font-size: 13px; font-weight: 700; color: #1E293B; background: #F8FAFC; }
    .idx-badge { width: 22px; height: 22px; border-radius: 50%; background: #0F172A; color: #FFF; font-size: 11px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .consent-detail summary small { display: block; font-size: 10px; color: #64748B; font-weight: 500; }
    .consent-text { padding: 16px; font-size: 13px; line-height: 1.6; color: #475569; border-top: 1px solid #E2E8F0; background: #FFFFFF; }

    /* Radiografías Grid */
    .rads-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px; }
    .rad-item { border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; background: #090D16; text-align: center; }
    .rad-item img { width: 100%; height: 110px; object-fit: cover; cursor: pointer; transition: transform 0.2s; }
    .rad-item img:hover { transform: scale(1.04); }
    .rad-item span { display: block; padding: 6px; font-size: 10px; color: #94A3B8; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* Firma Box */
    .signature-box { border-radius: 16px; padding: 20px; text-align: center; }
    .signature-box.signed { background: #ECFDF5; border: 1.5px solid #10B981; }
    .signature-box.unsigned { background: #FFFBEB; border: 1.5px border-dashed #F59E0B; }
    .badge-valid { background: #10B981; color: white; font-size: 10px; font-weight: 800; padding: 4px 12px; border-radius: 20px; letter-spacing: 1px; }
    .sig-img { max-height: 80px; margin: 14px auto 6px; display: block; border-bottom: 1px stroke #000; }
    .sig-name { font-size: 14px; font-weight: 800; color: #0F172A; }
    .sig-date { font-size: 11px; color: #64748B; }

    /* Visor Modal */
    .modal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 9999; justify-content: center; align-items: center; padding: 20px; }
    .modal.active { display: flex; }
    .modal img { max-width: 90%; max-height: 85vh; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }

    @media print {
      .action-bar { display: none !important; }
      body { background: white; padding: 0; }
      .card { border: none; box-shadow: none; padding: 12px 0; }
    }
  </style>
</head>
<body>
  <div class="page-wrapper">
    <div class="doc-header">
      <div class="subtitle">DENTAXY · EXPEDIENTE DENTAL E HISTORIA CLINICA</div>
      <h1>${folder.name}</h1>
      <div class="meta">
        <span>📅 Emisión: ${fechaStr}</span>
        <span>📋 NOM-004-SSA3-2012</span>
        <span>🦷 Odontograma Anatómico Fiel</span>
      </div>
    </div>

    <!-- VII · Odontograma Anatómico Fiel DentaXy -->
    <div class="card">
      <div class="card-label">VII · ODONTOGRAMA ANATÓMICO DENTAXY — DENTICIÓN PERMANENTE (FDI)</div>
      <div style="font-size:10px;font-weight:700;color:#94A3B8;text-align:center;margin-bottom:8px">↑ ARCADIA SUPERIOR</div>
      <div class="arch-block">
        ${upperAnatomicalHTML}
      </div>
      <div class="arch-divider"></div>
      <div class="arch-block">
        ${lowerAnatomicalHTML}
      </div>
      <div style="font-size:10px;font-weight:700;color:#94A3B8;text-align:center;margin-top:8px">↓ ARCADIA INFERIOR</div>
    </div>

    <!-- Radiografías -->
    ${radsHTML}

    <!-- Diagnóstico y Plan -->
    <div class="card">
      <div class="card-label">VIII · DIAGNÓSTICO Y PLAN DE TRATAMIENTO SECTORIZADO</div>
      ${docContent}
    </div>

    <!-- Consentimientos Informados -->
    <div class="card">
      <div class="card-label">IX · CONSENTIMIENTOS INFORMADOS REQUERIDOS</div>
      ${consentsHTML}
    </div>

    <!-- Firma Autógrafa -->
    <div class="card">
      <div class="card-label">X · FIRMA AUTÓGRAFA DIGITAL Y VALIDACIÓN</div>
      ${signatureHTML}
    </div>
  </div>

  <!-- Modal de Zoom para Radiografías -->
  <div id="imgModal" class="modal" onclick="this.classList.remove('active')">
    <img id="modalImg" src="" alt="Radiografía Ampliada" />
  </div>

  <!-- Modal popup info de diente -->
  <div id="toothModal" style="display:none; position:fixed; inset:0; background:rgba(15,23,42,0.6); z-index:10000; justify-content:center; align-items:center; padding:16px; backdrop-filter:blur(4px);" onclick="if(event.target===this)closeToothModal()">
    <div id="toothModalBox" style="background:#ffffff; border-radius:20px; padding:24px; max-width:420px; width:100%; box-shadow: 0 20px 60px rgba(15,23,42,0.35); position:relative; max-height:85vh; overflow-y:auto; font-family:'Inter', sans-serif;">
      <button onclick="closeToothModal()" style="position:absolute; top:14px; right:14px; background:#F1F5F9; border:none; border-radius:50%; width:28px; height:28px; cursor:pointer; font-size:16px; color:#475569; display:flex; align-items:center; justify-content:center; line-height:1;">×</button>
      <div id="toothModalContent"></div>
    </div>
  </div>

  <script>
    // Base de Datos Clínica de los 32 Dientes
    const TOOTH_INFO = ${toothInfoJSON};

    const STATE_COLORS = {
      S: '#1D9E75', C: '#EA4335', O: '#1A73E8', EI: '#EA4335',
      A: '#1A73E8', CR: '#1A73E8', PU: '#1A73E8', E: '#1A73E8',
      IM: '#1A73E8', SE: '#1A73E8', F: '#EA4335', MOV: '#1A73E8',
      RT: '#EA4335', OF: '#A52A2A', RR: '#EA4335', PC: '#1A73E8', PP: '#1A73E8',
    };

    window.showToothInfo = function(id) {
      id = parseInt(id, 10);
      if (isNaN(id)) return;
      
      // Resaltar visualmente el diente seleccionado
      document.querySelectorAll('.tooth-container').forEach(function(el) {
        el.classList.remove('selected-tooth');
      });
      const tEl = document.querySelector('.tooth-container[data-tooth="' + id + '"]');
      if (tEl) tEl.classList.add('selected-tooth');

      const info = TOOTH_INFO[id] || { state: 'S', label: 'Sano', surfaces: 'Ninguna específica' };
      const color = STATE_COLORS[info.state] || '#1D9E75';
      const isSano = info.state === 'S';
      
      // Proponer tratamiento por defecto si no hay uno específico registrado
      let defaultTratamiento = info.tratamiento || '';
      if (!defaultTratamiento && !isSano) {
        const trats = {
          'C': 'Remoción del tejido cariado secundario o primario y colocación de restauración con resina compuesta estética fotopolimerizable.',
          'OF': 'Retiro de la resina filtrada previa, eliminación de caries recurrente y colocación de nueva restauración estética.',
          'EI': 'Exodoncia (extracción) de la pieza dental indicada con anestesia local y sutura.',
          'RR': 'Extirpación quirúrgica del resto radicular para prevenir infecciones y regularizar el reborde alveolar.',
          'E': 'Tratamiento de conductos radiculares (endodoncia) y reconstrucción coronaria.',
          'CR': 'Preparación de muñón y colocación de corona protésica de cobertura completa.',
          'MOV': 'Fijación/férula o tratamiento periodontal de soporte.',
          'RT': 'Colocación o recambio de cemento de restauración temporal.',
          'A': 'Planificación para reposición de espacio mediante puente de porcelana o implante osteointegrado.'
        };
        defaultTratamiento = trats[info.state] || 'Seguimiento y control clínico en la próxima sesión.';
      }

      let extra = '';
      if (info.surfaces && info.surfaces !== 'Ninguna específica') {
        extra += '<div style="margin-top:6px; padding:8px 12px; background:#F8FAFC; border-radius:8px; font-size:12px; color:#475569;"><strong>Caras / Superficies:</strong> ' + info.surfaces + '</div>';
      }
      if (info.observaciones) {
        extra += '<div style="margin-top:6px; padding:8px 12px; background:#F8FAFC; border-radius:8px; font-size:12px; color:#475569;"><strong>Observaciones:</strong> ' + info.observaciones + '</div>';
      }

      var html = '<div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;">'
        + '<div style="width:48px;height:48px;border-radius:50%;background:' + color + ';display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;font-weight:900;box-shadow:0 4px 12px ' + color + '40;">'
        + id
        + '</div>'
        + '<div>'
        + '<div style="font-size:18px;font-weight:900;color:#0F172A;">Diente Órgano OD ' + id + '</div>'
        + '<div style="font-size:13px;color:#64748B;margin-top:2px;">'
        + 'Arcada ' + (Math.floor(id/10) <= 2 ? 'Superior (Maxilar)' : 'Inferior (Mandíbula)')
        + '</div></div></div>';

      if (isSano) {
        html += '<div style="padding:16px;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;color:#15803D;font-weight:700;font-size:13px;text-align:center;">'
          + '✅ Pieza dental sana — sin patologías ni tratamientos registrados.'
          + '</div>';
      } else {
        html += '<div style="padding:12px 14px;background:' + color + '15;border-radius:12px;border-left:4px solid ' + color + ';font-size:14px;font-weight:800;color:' + color + ';margin-bottom:14px;">'
          + 'Diagnóstico / Hallazgo: ' + (info.diagnostico || info.label)
          + '</div>'
          + '<div style="padding:14px;background:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;font-size:13px;color:#92400E;line-height:1.5;">'
          + '<strong style="display:block;margin-bottom:4px;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">🛠️ Tratamiento Requerido:</strong>'
          + defaultTratamiento
          + '</div>'
          + extra;
      }

      html += '<button onclick="closeToothModal()" style="margin-top:18px;width:100%;padding:14px;background:#0F172A;color:#fff;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;">Cerrar Ventana</button>';

      document.getElementById('toothModalContent').innerHTML = html;
      document.getElementById('toothModal').style.display = 'flex';
    };

    window.closeToothModal = function() {
      document.getElementById('toothModal').style.display = 'none';
    };

    // Registrar clicks en dientes
    document.addEventListener('click', function(e) {
      const toothEl = e.target.closest('.tooth-container');
      if (toothEl) {
        const id = toothEl.getAttribute('data-tooth');
        if (id) window.showToothInfo(id);
      }
    });

    document.addEventListener('touchstart', function(e) {
      const toothEl = e.target.closest('.tooth-container');
      if (toothEl) {
        const id = toothEl.getAttribute('data-tooth');
        if (id) {
          window.showToothInfo(id);
        }
      }
    }, { passive: true });

    function openModal(src) {
      document.getElementById('modalImg').src = src;
      document.getElementById('imgModal').classList.add('active');
    }

    // Lógica de Firma Canvas
    const canvas = document.getElementById('sigCanvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let drawing = false;

      function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
      window.addEventListener('resize', resizeCanvas);
      setTimeout(resizeCanvas, 200);

      function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
      }

      function startDraw(e) {
        e.preventDefault();
        drawing = true;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
      }
      function draw(e) {
        if (!drawing) return;
        e.preventDefault();
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }
      function endDraw(e) {
        if (!drawing) return;
        e.preventDefault();
        drawing = false;
        ctx.closePath();
      }

      canvas.addEventListener('mousedown', startDraw);
      canvas.addEventListener('mousemove', draw);
      window.addEventListener('mouseup', endDraw);
      canvas.addEventListener('touchstart', startDraw, {passive: false});
      canvas.addEventListener('touchmove', draw, {passive: false});
      window.addEventListener('touchend', endDraw, {passive: false});
    }

    function clearCanvas() {
      const cvs = document.getElementById('sigCanvas');
      if(cvs) {
        const c = cvs.getContext('2d');
        c.clearRect(0, 0, cvs.width, cvs.height);
      }
    }

    function saveSignature() {
      const cvs = document.getElementById('sigCanvas');
      const name = document.getElementById('sigName').value.trim();
      const idStr = document.getElementById('sigId').value.trim();
      
      if (!name) {
        alert("Por favor, ingrese el nombre completo para firmar.");
        return;
      }
      
      const ctx = cvs.getContext('2d');
      const pixelBuffer = new Uint32Array(ctx.getImageData(0, 0, cvs.width, cvs.height).data.buffer);
      if (!pixelBuffer.some(color => color !== 0)) {
        alert("Por favor, realice su firma en el recuadro antes de guardar.");
        return;
      }

      const base64Sig = cvs.toDataURL('image/png');
      document.getElementById('signatureContainer').style.display = 'none';
      
      document.getElementById('lockedSigImg').src = base64Sig;
      document.getElementById('lockedSigName').innerText = name;
      document.getElementById('lockedSigId').innerText = idStr ? 'ID / Cédula: ' + idStr : '';
      
      const now = new Date();
      document.getElementById('lockedSigDate').innerText = 'Fecha de Firma: ' + now.toLocaleString('es-MX');
      
      document.getElementById('lockedSignature').style.display = 'block';
    }
  </script>
</body>
</html>`;

      const blob = new Blob([htmlFile], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Odontograma_${folder.name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success('Odontograma .html descargado exitosamente');
    } catch (e) {
      console.error(e);
      toast.error('Error al generar el archivo HTML');
    }
  };

  // 9. COBROS Y PRESUPUESTOS (Conectado a Drive)
  const saveCobrosToDrive = async (newCobros: any[]) => {
    if (!subfolderIds || !accessToken) return;
    try {
      await writeJsonFile(subfolderIds.historiaId, 'cobros.json', newCobros, accessToken);
    } catch (e) {
      console.error("Error guardando cobros", e);
      toast.error("Error al guardar cobros en Drive");
    }
  };
  const handleAddConcept = async () => {
    if (!newConcept.concepto || !newConcept.costo) return;
    const costoNum = parseFloat(newConcept.costo);
    if (isNaN(costoNum)) {
      toast.error("El costo debe ser un número válido");
      return;
    }
    const item = {
      id: Date.now().toString(),
      concepto: newConcept.concepto,
      costo: costoNum,
      status: 'pendiente' as const
    };

    const nuevoPresupuesto = [...presupuesto, item];
    setPresupuesto(nuevoPresupuesto);
    setNewConcept({ concepto: '', costo: '' });
    setIsAddingConcept(false);
    await saveCobrosToDrive(nuevoPresupuesto);
    toast.success("Tratamiento agregado y sincronizado");
  };

  const handleRemoveConcept = async (id: string) => {
    const nuevoPresupuesto = presupuesto.filter(item => item.id !== id);
    setPresupuesto(nuevoPresupuesto);
    await saveCobrosToDrive(nuevoPresupuesto);
    toast.success("Tratamiento eliminado");
  };

  const handleToggleStatus = async (id: string) => {
    const nuevoPresupuesto = presupuesto.map(item => 
      item.id === id ? { ...item, status: item.status === 'liquidado' ? 'pendiente' : 'liquidado' } : item
    );
    setPresupuesto(nuevoPresupuesto);
    await saveCobrosToDrive(nuevoPresupuesto);
    toast.success("Estado de pago actualizado");
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("Presupuesto Dental - Dentaxy", 14, 22);
      
      doc.setFontSize(12);
      doc.text(`Paciente: ${folder.name}`, 14, 32);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 40);
      
      const tableData = presupuesto.map(item => [
        item.concepto,
        item.costo.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }),
        item.status === 'liquidado' ? 'Pagado' : 'Pendiente'
      ]);

      const total = presupuesto.reduce((sum, item) => sum + item.costo, 0);
      const pagado = presupuesto.filter(item => item.status === 'liquidado').reduce((sum, item) => sum + item.costo, 0);
      const pendiente = total - pagado;

      tableData.push(['', '', '']);
      tableData.push([{ content: 'TOTAL PAGADO', styles: { fontStyle: 'bold' } }, { content: pagado.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }), styles: { fontStyle: 'bold', textColor: [34, 197, 94] } }, '']);
      tableData.push([{ content: 'SALDO PENDIENTE', styles: { fontStyle: 'bold' } }, { content: pendiente.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }), styles: { fontStyle: 'bold', textColor: [239, 68, 68] } }, '']);
      tableData.push([{ content: 'GRAN TOTAL', styles: { fontStyle: 'bold' } }, { content: total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }), styles: { fontStyle: 'bold' } }, '']);

      autoTable(doc, {
        startY: 48,
        head: [['Concepto', 'Costo', 'Estado']],
        body: tableData,
      });

      doc.save(`Presupuesto_${folder.name.replace(/[^a-z0-9]/gi, '_')}.pdf`);
      toast.success("PDF generado exitosamente");
    } catch (e) {
      console.error(e);
      toast.error("Error al generar PDF");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#eef0f3]/35 backdrop-blur-[24px] flex flex-col p-4 sm:p-6 lg:p-8 min-h-screen lg:h-screen lg:overflow-hidden overflow-y-auto select-none animate-in fade-in duration-500 ease-out">
      
      {/* --- CARGADOR DE DATOS DE DRIVE --- */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#eef0f3]/70 backdrop-blur-[32px] z-[300] flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-white blur-xl rounded-full" />
            <RefreshCw className="animate-spin text-slate-500 relative z-10" size={32} />
          </div>
          <p className="text-slate-600 text-xs font-bold uppercase tracking-wider animate-pulse">Sincronizando con Google Drive...</p>
        </div>
      )}

      {/* --- MODAL DE RE-AUTENTICACIÓN (token expirado) --- */}
      {showReAuthModal && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[400] flex items-center justify-center p-6">
          <div className="bg-white rounded-[28px] p-8 shadow-2xl max-w-sm w-full flex flex-col items-center gap-5 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="text-amber-500" size={28} />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-lg mb-1">Sesión expirada</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Tu sesión de Google Drive expiró (duran 1 hora). Por favor vuelve a autenticarte para continuar subiendo archivos.
              </p>
            </div>
            <button
              onClick={() => { reAuth(); }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
              Renovar con Google
            </button>
            <button
              onClick={() => setShowReAuthModal(false)}
              className="text-slate-400 text-sm hover:text-slate-600 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* --- CABECERA GLOBAL COMPARTIDA (fuera del grid para alineación perfecta) --- */}
      <div className="relative flex items-center justify-between w-full h-14 z-20 shrink-0 mb-5">
        {/* Identificador de Paciente */}
        <div className="flex items-center space-x-3 px-4 py-2 bg-white/40 border border-white/60 rounded-[20px] shadow-[0_8px_32px_0_rgba(163,177,198,0.2),inset_1px_1px_0_rgba(255,255,255,0.6)]">
          <button 
            onClick={onClose}
            className="p-2 bg-white/80 hover:bg-white border border-white/60 rounded-xl text-slate-700 hover:text-slate-900 transition-all active:scale-95 shadow-sm"
          >
            <ChevronLeft size={14} />
          </button>
          <div>
            <h2 className="text-xs font-extrabold text-slate-900 tracking-[0.08em] font-bruno uppercase leading-tight">{folder.name}</h2>
            <p className="text-[7px] text-slate-400 font-bold uppercase tracking-wider">Expediente · Seed</p>
          </div>
        </div>

        {/* Pestañas de Navegación — centradas absolutas */}
        <div className="absolute left-1/2 -translate-x-1/2 flex bg-white/40 border border-white/60 p-1.5 rounded-[22px] shadow-[0_8px_32px_rgba(163,177,198,0.15)] backdrop-blur-[16px]">
          <button
            onClick={() => setActiveTab('ficha')}
            className={`flex items-center space-x-2 px-5 py-2 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all ${
              activeTab === 'ficha' 
                ? 'bg-white text-slate-800 shadow-sm border border-white/80'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <BookOpen size={14} />
            <span>Ficha & Gabinete</span>
          </button>
          <button
            onClick={() => setActiveTab('odontograma')}
            className={`flex items-center space-x-2 px-5 py-2 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all ${
              activeTab === 'odontograma'
                ? 'bg-white text-slate-800 shadow-sm border border-white/80'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <Activity size={14} />
            <span>Odontograma</span>
          </button>
        </div>

        {/* Acciones del Odontograma (esquina derecha) */}
        <div className="flex items-center">
          {activeTab === 'odontograma' && hasOdontogramaChanged && (
            <button
              onClick={saveOdontogramaToDrive}
              className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-[10px] uppercase tracking-wider rounded-[18px] transition-all shadow-sm border border-white/80 active:scale-95"
            >
              <Check size={12} />
              <span>Guardar Dientes</span>
            </button>
          )}
        </div>
      </div>

      {/* --- LAYOUT BENTO GRID — arranca al mismo nivel en ambas columnas --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 relative z-10 pb-0">
        
        {/* COLUMNA IZQUIERDA + CENTRAL (col-span-8): Ficha y Odontograma */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6 h-full min-h-0">


          {/* Área de contenido del tab activo */}
          <div className="flex-1 overflow-visible relative h-full min-h-0">
            
            {activeTab === 'ficha' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch h-full overflow-visible min-h-0">
                
                {/* SUB-COLUMNA IZQUIERDA (Notas e Historia Clínica) */}
                <div className="flex flex-col gap-5 h-full overflow-hidden min-h-0 relative z-20">
                  
                  {/* NOTAS DE EVOLUCIÓN */}
                  <div className="bg-white/45 border border-white/80 rounded-[32px] p-5 backdrop-blur-[16px] shadow-[0_8px_32px_0_rgba(163,177,198,0.25),inset_1px_1px_0_rgba(255,255,255,0.65)] hover:bg-white/[0.55] hover:border-white transition-all duration-300 relative lg:flex-[1.3] flex flex-col min-h-[300px] overflow-hidden">
                    <div className="flex items-center justify-between mb-3 shrink-0">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                        <FileText size={15} className="text-slate-500" />
                        <span>Notas de Evolución</span>
                      </h3>
                      <button
                        onClick={() => setIsAddingNote(!isAddingNote)}
                        className="p-1.5 bg-white/60 hover:bg-white text-slate-700 border border-white/80 rounded-lg shadow-sm transition-all active:scale-95"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Timeline */}
                    <div className="w-full py-2 mb-3.5 border-b border-slate-200/40 select-none shrink-0">
                      <div className="text-left mb-2">
                        <span className="font-bruno text-[9.5px] font-bold text-[#00C980] block tracking-wider">
                          ¡YA CASI ESTAMOS AHÍ!
                        </span>
                        
                        <div className="relative mt-1.5 mb-1 pl-0.5">
                          <div className="inline-block px-2.5 py-0.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-[8.5px] font-bold shadow-sm relative z-10">
                            <div className="flex items-center gap-1 font-extrabold">
                              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                              Fase 3: Tratamiento Activo
                            </div>
                            <div className="absolute bottom-[-3.5px] left-4 w-1.5 h-1.5 rotate-45 border-r border-b bg-white border-slate-200" />
                          </div>
                        </div>
                      </div>

                      <div className="relative flex items-center justify-between w-full px-1">
                        <div className="absolute inset-x-0 h-2 bg-gradient-to-r from-emerald-950 via-emerald-50 to-zinc-200 rounded-full z-0 opacity-80 shadow-inner"
                          style={{
                            background: 'linear-gradient(90deg, #01281a 0%, #009c63 35%, #00d688 65%, #d1d5db 72%, #e5e7eb 100%)'
                          }}
                        />

                        {[
                          { label: 'Diag.', num: 1, active: true },
                          { label: 'Sane.', num: 2, active: true },
                          { label: 'Activo', num: 3, active: true },
                          { label: 'Recon.', num: 4, active: false },
                          { label: 'Alta', num: 5, active: false, last: true },
                        ].map((step, idx) => (
                          <div key={idx} className="flex flex-col items-center z-10">
                            {step.active ? (
                              <div className="w-4.5 h-4.5 rounded-full bg-white text-emerald-500 flex items-center justify-center shadow border border-emerald-500">
                                <span className="text-[8px] font-bold">✓</span>
                              </div>
                            ) : (
                              <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center text-[7.5px] font-bold ${
                                step.last 
                                  ? 'bg-slate-100 border-slate-250 text-slate-400' 
                                  : 'bg-slate-50 border-slate-200 text-slate-400'
                              }`}>
                                {step.num}
                              </div>
                            )}
                            <span className={`text-[7px] mt-0.5 font-bold tracking-tight text-center ${
                              step.active ? 'text-slate-700 font-extrabold' : 'text-slate-400'
                            }`}>
                              {step.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timeline Content */}
                    {isAddingNote ? (
                      <div className="space-y-3 p-4 bg-white/30 border border-white/60 rounded-2xl shadow-[inset_2px_2px_5px_rgba(163,177,198,0.1)] animate-in slide-in-from-top-2 duration-300 flex-1 overflow-y-auto custom-scrollbar text-left">
                        <textarea
                          placeholder="Tratamiento realizado..."
                          value={newNote.tratamiento}
                          onChange={(e) => setNewNote(prev => ({ ...prev, tratamiento: e.target.value }))}
                          className="w-full h-14 bg-white/50 border border-white/60 text-xs text-slate-800 p-3 rounded-xl outline-none focus:border-white shadow-[inset_2px_2px_5px_rgba(163,177,198,0.1)] placeholder-slate-400 resize-none font-semibold shrink-0"
                        />
                        <textarea
                          placeholder="Evolución clínica..."
                          value={newNote.evolucion}
                          onChange={(e) => setNewNote(prev => ({ ...prev, evolucion: e.target.value }))}
                          className="w-full h-14 bg-white/50 border border-white/60 text-xs text-slate-800 p-3 rounded-xl outline-none focus:border-white shadow-[inset_2px_2px_5px_rgba(163,177,198,0.1)] placeholder-slate-400 resize-none font-semibold shrink-0"
                        />
                        <input
                          type="text"
                          placeholder="Próxima sesión..."
                          value={newNote.proximaCita}
                          onChange={(e) => setNewNote(prev => ({ ...prev, proximaCita: e.target.value }))}
                          className="w-full bg-white/50 border border-white/60 text-xs text-slate-800 p-3 rounded-xl outline-none focus:border-white shadow-[inset_2px_2px_5px_rgba(163,177,198,0.1)] placeholder-slate-400 font-semibold shrink-0"
                        />
                        <div className="flex space-x-2 justify-end pt-1 shrink-0">
                          <button
                            onClick={() => setIsAddingNote(false)}
                            className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleSaveNote}
                            className="px-4 py-1.5 bg-white border border-white/85 text-slate-800 font-extrabold text-xs rounded-lg shadow-sm transition-all active:scale-95"
                          >
                            Guardar
                          </button>
                        </div>
                      </div>
                    ) : selectedNote ? (
                      <div className="p-4 bg-white/30 border border-white/60 rounded-2xl shadow-[inset_2px_2px_5px_rgba(163,177,198,0.1)] space-y-3 animate-in fade-in duration-300 relative flex-1 overflow-y-auto custom-scrollbar text-left">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] text-slate-400 font-bold uppercase">{selectedNote.dateString}</span>
                          <button 
                            onClick={() => setSelectedNote(null)}
                            className="text-xs text-slate-700 hover:underline font-bold"
                          >
                            Volver
                          </button>
                        </div>
                        <div>
                          <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Tratamiento:</h4>
                          <p className="text-xs text-slate-800 font-semibold leading-relaxed">{selectedNote.tratamiento}</p>
                        </div>
                        <div>
                          <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Evolución:</h4>
                          <p className="text-xs text-slate-800 font-semibold leading-relaxed">{selectedNote.evolucion}</p>
                        </div>
                        {selectedNote.proximaCita && (
                          <div>
                            <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Próxima sesión:</h4>
                            <p className="text-xs text-slate-600 font-semibold leading-relaxed">{selectedNote.proximaCita}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
                        {notes.length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-6 font-semibold">No hay notas de diario clínico</p>
                        ) : (
                          notes.map((note) => (
                            <div
                              key={note.id}
                              onClick={() => setSelectedNote(note)}
                              className="p-3 bg-white/20 hover:bg-white/60 rounded-xl cursor-pointer transition-all border border-white/30 hover:border-white shadow-sm flex items-center justify-between"
                            >
                              <div className="truncate pr-2 text-left">
                                <p className="text-xs font-bold text-slate-700 truncate">{note.tratamiento}</p>
                                <p className="text-[9px] text-slate-400 font-bold">{note.dateString}</p>
                              </div>
                              <ChevronLeft size={14} className="text-slate-400 rotate-180" />
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* HISTORIA CLÍNICA */}
                  <div className="bg-white/45 border border-white/80 rounded-[32px] p-5 backdrop-blur-[16px] shadow-[0_8px_32px_0_rgba(163,177,198,0.25),inset_1px_1px_0_rgba(255,255,255,0.65)] hover:bg-white/[0.55] hover:border-white transition-all duration-300 relative lg:flex-1 flex flex-col min-h-[220px] overflow-hidden">
                    <div className="flex items-center justify-between mb-3 shrink-0">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                        <BookOpen size={15} className="text-slate-500" />
                        <span>Historia Clínica</span>
                      </h3>
                      <button
                        onClick={() => setIsScannerOpen(true)}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 text-[10px] font-extrabold rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-1"
                        title="Escanear credencial INE / ID con IA Local"
                      >
                        <ScanLine size={12} className="text-emerald-600" />
                        <span>Escanear INE / ID</span>
                      </button>
                      <button
                        onClick={handleSaveHistory}
                        disabled={isSavingHistory}
                        className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-white/85 text-[10px] font-extrabold uppercase tracking-wider rounded-xl shadow-sm transition-all active:scale-95 shrink-0"
                      >
                        {isSavingHistory ? (
                          <RefreshCw size={12} className="animate-spin text-slate-600" />
                        ) : (
                          <>
                            <Check size={12} className="inline mr-1" />
                            <span>Guardar</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="space-y-3.5 flex-1 overflow-y-auto pr-1 custom-scrollbar text-left">
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Alergias del Paciente</label>
                        <input
                          type="text"
                          value={historyData.alergias}
                          onChange={(e) => setHistoryData(prev => ({ ...prev, alergias: e.target.value }))}
                          className="w-full bg-white/50 border border-white/60 text-xs text-slate-700 px-3.5 py-2.5 rounded-xl outline-none focus:border-white shadow-[inset_2px_2px_5px_rgba(163,177,198,0.1)] font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Motivo de Consulta</label>
                        <input
                          type="text"
                          value={historyData.motivo}
                          onChange={(e) => setHistoryData(prev => ({ ...prev, motivo: e.target.value }))}
                          className="w-full bg-white/50 border border-white/60 text-xs text-slate-700 px-3.5 py-2.5 rounded-xl outline-none focus:border-white shadow-[inset_2px_2px_5px_rgba(163,177,198,0.1)] font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Antecedentes Médicos</label>
                        <textarea
                          value={historyData.antecedentes}
                          onChange={(e) => setHistoryData(prev => ({ ...prev, antecedentes: e.target.value }))}
                          className="w-full h-16 bg-white/50 border border-white/60 text-xs text-slate-700 p-3 rounded-xl outline-none focus:border-white shadow-[inset_2px_2px_5px_rgba(163,177,198,0.1)] placeholder-slate-300 resize-none font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                </div>

                {/* SUB-COLUMNA CENTRAL (Avatar de Paciente — gigante y pegado al suelo) */}
                <div className="flex flex-col justify-end items-center h-full min-h-[520px] lg:min-h-0 relative pb-0 gap-0 overflow-visible z-0">

                  <div className="w-full h-full flex-1 flex flex-col items-center justify-end overflow-visible relative">
                    <PatientAvatarViewer
                      pacienteFolderId={gabineteSubfolders.paciente ?? null}
                      accessToken={accessToken}
                      patientName={folder.name}
                    />
                  </div>

                  {/* Botones de control inferiores (Flotantes sobre el avatar) */}
                  <div className="absolute bottom-2 z-30 w-full max-w-[320px] h-11 rounded-full flex items-center justify-between px-5 bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-[0_8px_25px_rgba(0,0,0,0.08)] pointer-events-auto transition-all hover:bg-white/95">
                    <div className="w-12 h-12 bg-blue-500/15 blur-md rounded-full absolute left-1/2 -translate-x-1/2 -top-3 pointer-events-none" />

                    <button className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 transition active:scale-90 cursor-pointer" title="Deshacer">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></svg>
                    </button>

                    <button className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 transition active:scale-90 cursor-pointer" title="Ajustar">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                    </button>

                    <button className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-500 text-white flex items-center justify-center shadow-[0_4px_14px_rgba(37,99,235,0.45)] hover:scale-105 active:scale-95 transition absolute left-1/2 -translate-x-1/2 -top-3 border border-white/30 z-20 cursor-pointer" title="Reiniciar Vista">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" /></svg>
                    </button>

                    <div className="w-8 h-8 shrink-0 pointer-events-none" />

                    <button className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 transition active:scale-90 cursor-pointer" title="Aleatorio">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" /><line x1="4" y1="4" x2="9" y2="9" /></svg>
                    </button>

                    <button className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 transition active:scale-90 cursor-pointer" title="Rehacer">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0 1 9-9 9 9 0 1 6 2.3l3 2.7" /></svg>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'odontograma' && (
              <div className="h-full w-full pb-6 animate-in fade-in duration-300">
                <div className="w-full bg-white/45 border border-white/80 rounded-[36px] p-6 shadow-[0_8px_32px_rgba(163,177,198,0.25),inset_1px_1px_0_rgba(255,255,255,0.65)] relative">
                  <div className="absolute w-[80%] h-[150px] bg-white rounded-full blur-[60px] -z-10 shadow-[0_0_120px_rgba(255,255,255,0.95)] left-[10%]" />
                  <Odontograma 
                    handleOdontogramaChange={handleOdontogramaStateChange}
                    initialTeethState={odontogramaState}
                    onRedaccionGenerada={(html) => setOdontogramaHTML(html)}
                  />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* COLUMNA DERECHA: Gabinete+Cobros en Ficha | Documento Odontograma en Odontograma */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-4 h-full min-h-0 lg:-mt-[72px] relative z-20">

          {/* ═══════════════════════════════════════════════════════════════════
              CARD UNIFICADO: DOCUMENTO DEL ODONTOGRAMA
              Solo visible cuando la pestaña activa es 'odontograma'
          ════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'odontograma' && (
            <div className="flex-1 min-h-0 flex flex-col bg-gradient-to-b from-white/80 to-slate-50/60 border border-white/90 rounded-[40px] shadow-[0_12px_40px_0_rgba(163,177,198,0.3),inset_2px_2px_0_rgba(255,255,255,0.9)] backdrop-blur-[24px] overflow-hidden animate-in fade-in duration-400">
              
              {/* ── Header del card ── */}
              <div className="shrink-0 px-6 pt-5 pb-4 border-b border-white/60">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[9px] font-extrabold tracking-[2px] uppercase text-slate-400">Documento Clínico</p>
                    <h3 className="text-[13px] font-black text-slate-800 tracking-tight leading-tight mt-0.5">Paciente · {folder.name}</h3>
                  </div>
                  {/* Botón Guardar .html — estilo igual al de Presupuesto */}
                  <button
                    onClick={handleExportOdontogramHTML}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-b from-[#111625] to-[#0d1020] hover:from-[#1a2035] hover:to-[#151a2e] text-white rounded-2xl text-[10px] font-extrabold uppercase tracking-wider shadow-[0_6px_16px_rgba(0,0,0,0.35),inset_0_2px_4px_rgba(255,255,255,0.08)] transition-all active:scale-95 border border-white/5"
                    title="Exportar odontograma como archivo .html interactivo"
                  >
                    <FileCode size={13} />
                    <span>Guardar .html</span>
                  </button>
                </div>

                {/* ── Toggle de vista ── */}
                <div className="flex bg-slate-100/80 border border-slate-200/60 p-1 rounded-2xl shadow-inner">
                  <button
                    onClick={() => setOdontDocView('paciente')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                      odontDocView === 'paciente'
                        ? 'bg-white text-slate-800 shadow-sm border border-white/80'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <ClipboardList size={12} />
                    <span>Doc. Paciente</span>
                  </button>
                  <button
                    onClick={() => setOdontDocView('diagnostico')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                      odontDocView === 'diagnostico'
                        ? 'bg-white text-slate-800 shadow-sm border border-white/80'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Stethoscope size={12} />
                    <span>Diagnóstico</span>
                  </button>
                </div>
              </div>

              {/* ── Contenido del documento ── */}
              <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-4">
                {odontDocView === 'diagnostico' ? (
                  /* Vista B: Documento del Odontograma Clínico */
                  <div>
                    {/* Título del documento */}
                    <div className="mb-4 pb-3 border-b border-slate-100">
                      <p className="text-[8px] font-extrabold tracking-[2px] uppercase text-slate-400 mb-1">Dentaxy · Expediente Digital</p>
                      <h4 className="text-[15px] font-black text-slate-900 leading-tight">Diagnóstico Odontológico</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">{folder.name} · {new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    </div>

                    {/* Documento generado por el motor de redacción */}
                    {odontogramaHTML ? (
                      <div
                        style={{
                          fontFamily: 'inherit',
                          fontSize: 14,
                          lineHeight: 1.65,
                          color: '#374151',
                        }}
                        dangerouslySetInnerHTML={{ __html: odontogramaHTML }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                        <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                          <Stethoscope size={22} className="text-slate-400" />
                        </div>
                        <div>
                          <p className="text-[12px] font-bold text-slate-600 mb-1">Sin hallazgos registrados</p>
                          <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[180px]">
                            Haz clic en los dientes del odontograma para registrar estados clínicos y el documento se generará automáticamente.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* ── Módulo de Radiografías y Estudios Adjuntos ── */}
                    <div className="mt-6 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Estudios Complementarios</p>
                          <h4 className="text-xs font-bold text-slate-800">Radiografías del Paciente</h4>
                        </div>
                        <label className="cursor-pointer px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition-all shadow-sm">
                          <Upload size={12} />
                          <span>Adjuntar Radiografía</span>
                          <input type="file" accept="image/*" multiple onChange={handleUploadRadiograph} className="hidden" />
                        </label>
                      </div>

                      {patientRadiographs.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {patientRadiographs.map(rad => (
                            <div key={rad.id} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-950">
                              <img src={rad.url} alt={rad.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              <button
                                type="button"
                                onClick={() => handleRemoveRadiograph(rad.id)}
                                className="absolute top-1.5 right-1.5 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remover radiografía"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 border border-dashed border-slate-200 rounded-xl text-center text-[11px] text-slate-400 font-medium">
                          No hay radiografías adjuntas a este documento.
                        </div>
                      )}
                    </div>

                    {/* ── Módulo de Consentimientos Informados y Firma Digital ── */}
                    <ConsentimientosModule
                      teethState={odontogramaState}
                      patientName={folder.name}
                      onSignedAndReady={(sigUrl) => setPatientSignatureUrl(sigUrl)}
                      onShareWhatsApp={() => {
                        const msg = `Hola ${folder.name}, le compartimos su expediente odontológico y consentimientos informados de DentaXy: ${window.location.href}`;
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      onShareNative={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: `Consentimientos Informados - ${folder.name}`,
                            text: `Expediente Odontológico y Consentimientos Informados de DentaXy para ${folder.name}`,
                            url: window.location.href,
                          }).catch(() => {});
                        } else {
                          const msg = `Hola ${folder.name}, le compartimos su expediente de DentaXy: ${window.location.href}`;
                          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
                        }
                      }}
                      onDownloadPDF={handleExportOdontogramHTML}
                    />
                  </div>
                ) : (
                  /* Vista A: Resumen del Paciente */
                  <div>
                    <div className="mb-4 pb-3 border-b border-slate-100">
                      <p className="text-[8px] font-extrabold tracking-[2px] uppercase text-slate-400 mb-1">Dentaxy · Expediente Digital</p>
                      <h4 className="text-[15px] font-black text-slate-900 leading-tight">Documento del Paciente</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">{folder.name} · {new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    </div>

                    {/* Ficha de datos del paciente */}
                    <div style={{ marginBottom: 14, padding: '12px 14px', borderRadius: 10, background: '#ffffff', border: '1px solid #e5e7eb' }}>
                      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 10 }}>I · DATOS GENERALES</p>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                          {[
                            ['Nombre', folder.name],
                            ['Motivo de consulta', historyData.motivo],
                            ['Alergias conocidas', historyData.alergias],
                            ['Antecedentes', historyData.antecedentes],
                            ['Enfermedades sistémicas', historyData.sistemicas],
                          ].map(([label, value]) => (
                            <tr key={label} style={{ borderBottom: '1px solid #F9FAFB' }}>
                              <td style={{ padding: '5px 0', fontSize: 10, fontWeight: 700, color: '#6B7280', width: '40%', paddingRight: 12 }}>{label}</td>
                              <td style={{ padding: '5px 0', fontSize: 12, color: '#374151' }}>{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Sección del odontograma simplificada */}
                    {odontogramaHTML ? (
                      <div
                        style={{ fontFamily: 'inherit', fontSize: 14, lineHeight: 1.65, color: '#374151' }}
                        dangerouslySetInnerHTML={{ __html: odontogramaHTML }}
                      />
                    ) : (
                      <div style={{ padding: '20px 0', textAlign: 'center', color: '#9CA3AF', fontSize: 12, fontWeight: 600 }}>
                        Sin hallazgos odontológicos registrados
                      </div>
                    )}

                    {/* ── Módulo de Radiografías y Estudios Adjuntos en Vista A ── */}
                    <div className="mt-6 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Estudios Complementarios</p>
                          <h4 className="text-xs font-bold text-slate-800">Radiografías del Paciente</h4>
                        </div>
                        <label className="cursor-pointer px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition-all shadow-sm">
                          <Upload size={12} />
                          <span>Adjuntar Radiografía</span>
                          <input type="file" accept="image/*" multiple onChange={handleUploadRadiograph} className="hidden" />
                        </label>
                      </div>

                      {patientRadiographs.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {patientRadiographs.map(rad => (
                            <div key={rad.id} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-950">
                              <img src={rad.url} alt={rad.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              <button
                                type="button"
                                onClick={() => handleRemoveRadiograph(rad.id)}
                                className="absolute top-1.5 right-1.5 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remover radiografía"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 border border-dashed border-slate-200 rounded-xl text-center text-[11px] text-slate-400 font-medium">
                          No hay radiografías adjuntas a este documento.
                        </div>
                      )}
                    </div>

                    {/* ── Módulo de Consentimientos Informados y Firma Digital ── */}
                    <ConsentimientosModule
                      teethState={odontogramaState}
                      patientName={folder.name}
                      onSignedAndReady={(sigUrl) => setPatientSignatureUrl(sigUrl)}
                      onShareWhatsApp={() => {
                        const msg = `Hola ${folder.name}, le compartimos su expediente odontológico y consentimientos informados de DentaXy: ${window.location.href}`;
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      onShareNative={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: `Consentimientos Informados - ${folder.name}`,
                            text: `Expediente Odontológico y Consentimientos Informados de DentaXy para ${folder.name}`,
                            url: window.location.href,
                          }).catch(() => {});
                        } else {
                          const msg = `Hola ${folder.name}, le compartimos su expediente de DentaXy: ${window.location.href}`;
                          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
                        }
                      }}
                      onDownloadPDF={handleExportOdontogramHTML}
                    />
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              CARDS ORIGINALES: solo visibles en la pestaña 'ficha'
          ════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'ficha' && (<>
          
          {/* GABINETE RADIOGRÁFICO / FOTOGRÁFICO (Rediseño Neumórfico Liquid Glass) */}
          <div 
            onClick={() => setExpandedRightCard('gabinete')}
            className={`bg-gradient-to-b from-white/70 to-slate-50/50 border border-white/90 rounded-[40px] pt-6 pb-4 px-5 shadow-[0_12px_40px_0_rgba(163,177,198,0.3),inset_2px_2px_0_rgba(255,255,255,0.9)] backdrop-blur-[24px] transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] relative flex flex-col overflow-hidden cursor-pointer ${
              expandedRightCard === 'gabinete' ? 'lg:flex-[2.5] flex-1 ring-2 ring-blue-400/50 ring-offset-2 ring-offset-[#eef0f3] min-h-[380px]' : 'lg:flex-[0.5] shrink-0 opacity-70 hover:opacity-100 min-h-[160px]'
            }`}
          >
            {/* Drop Zone (3D Volumetric) */}
            <div className="relative z-10 shrink-0 pb-4">
              <div
                onDragOver={(e) => { e.preventDefault(); setGabinetDragging(true); }}
                onDragLeave={() => setGabinetDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setGabinetDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleMediaUpload(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => gabinetInputRef.current?.click()}
                className={`relative border-2 border-transparent rounded-[32px] py-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-500 select-none ${
                  gabinetDragging
                    ? 'bg-blue-50/60 scale-[1.02] shadow-[inset_0_8px_32px_rgba(59,130,246,0.15)] border-blue-400/50'
                    : 'bg-white/40 shadow-[inset_0_4px_24px_rgba(255,255,255,0.9),0_4px_12px_rgba(163,177,198,0.1)] hover:bg-white/60 hover:shadow-[inset_0_4px_30px_rgba(255,255,255,1),0_8px_20px_rgba(59,130,246,0.1)] hover:border-blue-200/50'
                }`}
              >
                <div className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ease-out ${
                  gabinetDragging ? 'scale-110 shadow-[0_0_40px_rgba(59,130,246,0.5)]' : 'scale-100 hover:scale-105'
                }`}
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(219,234,254,1) 0%, rgba(147,197,253,0.7) 60%, rgba(59,130,246,0.2) 100%)',
                    boxShadow: 'inset 0 4px 8px rgba(255,255,255,0.9), inset 0 -4px 8px rgba(59,130,246,0.2), 0 8px 24px rgba(59,130,246,0.2), 0 0 0 1px rgba(255,255,255,0.5)'
                  }}
                >
                  <Upload size={28} className="text-blue-600 drop-shadow-md" strokeWidth={2.5} />
                  <div className="absolute inset-0 rounded-full blur-[16px] opacity-50" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)' }} />
                </div>
                <div className="text-center mt-1">
                  <p className="text-[13px] font-black text-slate-800 tracking-tight">
                    {gabinetDragging ? '¡SUELTA AQUÍ!' : 'ARRASTRE O CLIC PARA SUBIR IMAGEN'}
                  </p>
                  <p className="text-[10px] font-bold mt-1 text-slate-400 uppercase tracking-widest">
                    PNG, JPG, DICOM · max 50 MB
                  </p>
                </div>
                <input 
                  ref={gabinetInputRef}
                  type="file" 
                  accept="image/*" 
                  onChange={handleMediaUpload} 
                  className="hidden" 
                  disabled={isUploadingMedia}
                />
              </div>
            </div>

            {/* Uploading Status */}
            {isUploadingMedia && (
              <div className="rounded-2xl border border-slate-200 bg-white p-3 flex flex-col gap-2 relative overflow-hidden shadow-sm animate-pulse shrink-0 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <p className="text-[10px] font-bold truncate text-slate-750">Subiendo archivo...</p>
                    <p className="text-[8.5px] leading-none mt-0.5 text-slate-400">Sincronizando con Drive</p>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-0.5 shadow-inner">
                  <div className="bg-blue-500 h-full rounded-full w-[75%] transition-all duration-300" />
                </div>
              </div>
            )}

            {/* Gallery (Rounded Corners and Larger Thumbs) */}
            <div className="grid grid-cols-3 gap-4 flex-1 overflow-y-auto pr-1 custom-scrollbar mb-4">
              {gabineteFiles.filter(f => !f.category || f.category === gabinetTab).length === 0 ? (
                <div className="col-span-3 py-8 flex flex-col items-center justify-center gap-2 text-slate-400/70">
                  <Camera size={28} strokeWidth={1.5} />
                  <span className="text-[11px] font-extrabold uppercase tracking-wider opacity-80">Sin archivos</span>
                </div>
              ) : (
                gabineteFiles.filter(f => !f.category || f.category === gabinetTab).map((file) => (
                  <div 
                    key={file.id} 
                    onClick={() => setPreviewImage(file.blobUrl)}
                    className="aspect-square bg-white border border-white/60 rounded-[20px] overflow-hidden cursor-pointer hover:border-blue-300 transition-all duration-300 relative group shadow-[0_4px_12px_rgba(163,177,198,0.15)] hover:shadow-[0_8px_24px_rgba(59,130,246,0.2)] hover:scale-[1.03]"
                  >
                    {file.blobUrl ? (
                      <img src={file.blobUrl} alt={file.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50"><ImageIcon size={22} /></div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-[2px]">
                      <span className="text-[10px] text-white font-black uppercase tracking-widest bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20">Abrir</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Micromenu Inferior (Liquid Glass Bubble) */}
            <div className="relative z-10 shrink-0 mt-auto pt-3">
              <div className="h-[64px] rounded-full flex items-center justify-around px-2 relative bg-white/50 border border-white/70 shadow-[0_8px_32px_rgba(163,177,198,0.25),inset_0_4px_16px_rgba(255,255,255,0.8)] backdrop-blur-2xl">
                {/* Active Pill Indicator (Bubble) */}
                <div className="absolute inset-y-1.5 left-1.5 right-1.5 rounded-full overflow-hidden pointer-events-none">
                  <div
                    className="absolute h-full rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] border border-white/80"
                    style={{
                      width: 'calc(33.33% - 4px)',
                      left: gabinetTab === 'radiografias' ? '2px' : gabinetTab === 'intraorales' ? '33.33%' : 'calc(66.66% - 2px)',
                      background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.9) 0%, rgba(219,234,254,0.6) 100%)',
                      boxShadow: '0 4px 12px rgba(59,130,246,0.2), inset 0 2px 4px rgba(255,255,255,1)'
                    }}
                  />
                </div>
                
                {/* Tabs */}
                {[
                  { id: 'radiografias', label: 'Radiografías', icon: <ScanLine size={18} strokeWidth={2.5} /> },
                  { id: 'intraorales', label: 'Intraorales', icon: <Camera size={18} strokeWidth={2.5} /> },
                  { id: 'paciente', label: 'Foto Paciente', icon: <User size={18} strokeWidth={2.5} /> }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setGabinetTab(tab.id as any)}
                    className={`flex-1 flex flex-col items-center justify-center gap-1 h-full rounded-full transition-all duration-300 relative cursor-pointer z-10 ${
                      gabinetTab === tab.id ? 'text-blue-600 scale-105' : 'text-slate-400 hover:text-blue-400 hover:scale-105'
                    }`}
                  >
                    <span className={`relative transition-all duration-300 ${gabinetTab === tab.id ? 'drop-shadow-sm' : ''}`}>{tab.icon}</span>
                    <span className="relative text-[9px] font-black tracking-widest uppercase">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* COBROS Y FIRMAS (Rediseño Neumórfico Oscuro - Digital Wallet) */}
          <div 
            onClick={() => setExpandedRightCard('cobros')}
            className={`bg-[#111625] border border-white/5 rounded-[40px] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_2px_2px_4px_rgba(255,255,255,0.05)] transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] relative text-white flex flex-col overflow-hidden cursor-pointer ${
              expandedRightCard === 'cobros' ? 'lg:flex-[2.5] flex-1 ring-2 ring-blue-500/50 ring-offset-2 ring-offset-[#eef0f3] min-h-[480px]' : 'lg:flex-[0.5] shrink-0 opacity-70 hover:opacity-100 min-h-[160px]'
            }`}
          >            
            {/* Top Blue Card */}
            <div className="bg-gradient-to-br from-[#3b82f6] to-[#1e40af] rounded-[32px] p-6 pb-5 flex flex-col relative overflow-hidden shadow-[0_8px_32px_rgba(37,99,235,0.4),inset_0_2px_4px_rgba(255,255,255,0.3)] shrink-0 z-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              
              <div className="flex justify-between items-start mb-2 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/20 border border-white/30 flex items-center justify-center overflow-hidden shadow-inner">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=64&q=80" alt="Doctor" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] font-semibold text-blue-100">Dr. DENTX</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-blue-100 cursor-pointer hover:bg-white/20 transition-all">
                  <span className="text-xs font-serif font-bold italic">i</span>
                </div>
              </div>

              <div className="flex flex-col items-center text-center mt-2 relative z-10">
                <span className="text-[9px] uppercase tracking-[0.15em] font-extrabold text-blue-200/80 mb-1">Saldo Pendiente</span>
                <h2 className="text-[34px] leading-tight font-black font-bruno tracking-tight text-white drop-shadow-md">
                  {presupuesto.filter(item => item.status !== 'liquidado').reduce((sum, item) => sum + item.costo, 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                </h2>
              </div>

              {/* Tratamientos Rápidos */}
              <div className="flex justify-center gap-1.5 mt-5 relative z-10 flex-wrap px-2">
                {[
                  { id: 'resina', label: 'Resina', price: 800 },
                  { id: 'limpieza', label: 'Limpieza', price: 600 },
                  { id: 'extraccion', label: 'Extracción', price: 1000 },
                  { id: 'consulta', label: 'Consulta', price: 400 },
                ].map((t) => (
                  <button 
                    key={t.id} 
                    onClick={async () => {
                      const item = { id: Date.now().toString() + t.id, concepto: t.label, costo: t.price, status: 'pendiente' as const };
                      const nuevo = [...presupuesto, item];
                      setPresupuesto(nuevo);
                      await saveCobrosToDrive(nuevo);
                      toast.success(t.label + " agregado");
                    }}
                    className="px-2.5 py-1.5 rounded-full border border-blue-400/30 bg-blue-500/20 hover:bg-blue-400/40 text-blue-100 text-[10px] font-bold shadow-sm backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
                  >
                    + {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Listado de tratamiento interactivo (Glassmorphic panel) */}
            <div className="flex-1 flex flex-col gap-2 mt-4 px-2 overflow-hidden min-h-0 relative z-10">
              <div className="flex justify-between items-end px-1 mb-1 shrink-0">
                <span className="text-[11px] font-semibold text-slate-400">Últimos Conceptos</span>
                <span className="text-[9px] font-bold text-slate-500 hover:text-white cursor-pointer transition-colors border-b border-transparent hover:border-white">Ver todos</span>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                {presupuesto.length === 0 ? (
                  <div className="p-4 bg-white/[0.03] rounded-2xl text-center border border-white/5 shadow-inner">
                    <p className="text-[11px] text-slate-500 font-semibold">Sin conceptos registrados</p>
                  </div>
                ) : (
                  presupuesto.map((item) => (
                    <div 
                      key={item.id}
                      className="p-3 bg-white/[0.04] border border-white/5 rounded-2xl flex items-center justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_12px_rgba(0,0,0,0.1)] group transition-all hover:bg-white/[0.08]"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600 flex items-center justify-center shrink-0 shadow-sm">
                          <Activity size={14} className="text-blue-300" />
                        </div>
                        <div className="truncate text-left">
                          <p className="text-[12px] font-bold text-slate-200 truncate">{item.concepto}</p>
                          <span className="text-[9px] text-slate-500 font-semibold mt-0.5 block">Hoy • Cobro Drive</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => handleToggleStatus(item.id)}
                          className={`px-2 py-1 rounded-full text-[9px] font-bold border ${
                            item.status === 'liquidado' 
                              ? 'bg-green-500/20 border-green-400/30 text-green-300' 
                              : 'bg-orange-500/20 border-orange-400/30 text-orange-300'
                          } transition-colors uppercase`}
                        >
                          {item.status === 'liquidado' ? 'Pagado' : 'Pend.'}
                        </button>
                        <span className="text-[14px] font-black tracking-tight text-white">
                          {item.costo.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                        </span>
                        <button
                          onClick={() => handleRemoveConcept(item.id)}
                          className="w-6 h-6 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400/50 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                          title="Eliminar concepto"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bottom Controls (Volumetric Pill Buttons) */}
            <div className="shrink-0 mt-2 px-1 flex gap-2">
              {/* Add / Action Area */}
              {isAddingConcept ? (
                <div className="flex-1 p-3 bg-slate-800 border border-white/10 rounded-3xl flex flex-col gap-2.5 animate-in slide-in-from-bottom-2 duration-300 text-left shadow-xl relative z-20">
                  <input
                    type="text"
                    placeholder="Tratamiento..."
                    value={newConcept.concepto}
                    onChange={(e) => setNewConcept(prev => ({ ...prev, concepto: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 text-[12px] text-white px-3 py-2.5 rounded-xl outline-none focus:border-blue-500 font-semibold"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Costo..."
                      value={newConcept.costo}
                      onChange={(e) => setNewConcept(prev => ({ ...prev, costo: e.target.value }))}
                      className="flex-1 bg-slate-900 border border-slate-700 text-[12px] text-white px-3 py-2.5 rounded-xl outline-none focus:border-blue-500 font-semibold"
                    />
                    <button
                      onClick={handleAddConcept}
                      className="px-4 py-2 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-[10px] font-bold uppercase rounded-xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_4px_10px_rgba(37,99,235,0.4)] transition-all active:scale-95"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setIsAddingConcept(false)}
                      className="px-3 py-2 text-slate-400 hover:text-white text-[10px] font-bold uppercase"
                    >
                      X
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 grid grid-cols-[auto_auto_1fr_1fr] gap-2 pt-2 border-t border-white/5">
                  <button onClick={handleExportPDF} className="w-12 h-12 rounded-full bg-gradient-to-b from-[#32364c] to-[#1f2130] border border-white/10 flex items-center justify-center text-slate-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_8px_16px_rgba(0,0,0,0.4)] hover:brightness-110 hover:text-blue-400 active:scale-95 transition-all" title="Exportar PDF">
                    <FileText size={18} />
                  </button>
                  <button className="w-12 h-12 rounded-full bg-gradient-to-b from-[#32364c] to-[#1f2130] border border-white/10 flex items-center justify-center text-slate-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_8px_16px_rgba(0,0,0,0.4)] hover:brightness-110 active:scale-95 transition-all">
                    <RefreshCw size={18} />
                  </button>
                  
                  <button 
                    onClick={() => setIsAddingConcept(true)}
                    className="h-12 rounded-full bg-gradient-to-b from-[#3a3f58] to-[#252839] border border-white/10 flex items-center justify-center gap-1.5 text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.15),0_8px_16px_rgba(0,0,0,0.4)] hover:brightness-110 active:scale-95 transition-all px-2"
                  >
                    <span className="text-[12px] font-bold">Concepto</span>
                    <span className="font-extrabold text-blue-400">↓</span>
                  </button>
                  
                  <button className="h-12 rounded-full bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] border border-white/20 flex items-center justify-center gap-1.5 text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_8px_16px_rgba(37,99,235,0.4)] hover:brightness-110 active:scale-95 transition-all px-2">
                    <span className="text-[12px] font-bold">Abonar</span>
                    <span className="font-extrabold text-blue-200">↑</span>
                  </button>
                </div>
              )}
            </div>

          </div>

          </>)}

        </div>

      </div>

      {/* --- MODAL PARA FIRMA DIGITAL EN CANVAS (GLASSMORFISMO EN GRISES/BLANCOS) --- */}
      {signatureModalOpen && (
        <div className="fixed inset-0 z-[400] bg-slate-900/40 backdrop-blur-[12px] flex items-center justify-center p-4">
          <div className="w-full max-w-[540px] bg-white/95 border border-white rounded-[28px] p-6 shadow-2xl space-y-4 backdrop-blur-[20px]">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-extrabold text-slate-800">Firma Digital del Documento</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{signatureTarget}</p>
              </div>
              <button 
                onClick={() => setSignatureModalOpen(false)}
                className="p-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl border border-white/80 shadow-sm"
              >
                <X size={14} />
              </button>
            </div>

            {/* CANVAS DE DIBUJO CON SOPORTE TÁCTIL */}
            <div className="relative border border-white/80 rounded-2xl bg-white shadow-[inset_2px_2px_5px_rgba(163,177,198,0.15)] overflow-hidden">
              <canvas
                ref={canvasRef}
                width={492}
                height={220}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="cursor-crosshair w-full block touch-none"
              />
              <span className="absolute bottom-3 left-4 text-[9px] text-slate-400 font-bold uppercase pointer-events-none">Dibuje su firma en el panel</span>
            </div>

            <div className="flex justify-between items-center font-bold">
              <button
                onClick={clearCanvas}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-600 text-xs rounded-xl border border-slate-200 transition-all active:scale-95"
              >
                Limpiar
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSignatureModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveSignature}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs uppercase rounded-xl transition-all shadow-[0_4px_12px_rgba(15,23,42,0.25)] border border-slate-700 active:scale-95 font-extrabold"
                >
                  Confirmar Firma
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PREVISUALIZADOR DE IMAGEN EN FULLSCREEN --- */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-300"
          onClick={() => setPreviewImage(null)}
        >
          <button 
            onClick={() => setPreviewImage(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
          >
            <X size={20} />
          </button>
          <img src={previewImage} alt="Preview" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
        </div>
      )}

      {/* --- ESCÁNER OCR LOCAL ZERO-TRUST DE IDENTIFICACIÓN --- */}
      <LocalDocumentScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanComplete={handleScanComplete}
      />

    </div>
  );
}
