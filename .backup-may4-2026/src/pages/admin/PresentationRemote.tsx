import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight, AlertTriangle, Wifi, WifiOff, PenLine } from 'lucide-react';

const TOTAL_SLIDES = 11;

export default function PresentationRemote() {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [manualMode, setManualMode] = useState(false);
    const [notes, setNotes] = useState('');
    const [connected, setConnected] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [openingHub, setOpeningHub] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>();

    // Cargar estado inicial
    useEffect(() => {
        const loadState = async () => {
            const { data } = await supabase
                .from('presentation_state')
                .select('current_slide, manual_mode')
                .eq('id', 1)
                .single();
            if (data) {
                setCurrentSlide(data.current_slide);
                setManualMode(data.manual_mode);
            }
        };
        loadState();
    }, []);

    // Cargar notas del slide actual
    useEffect(() => {
        const loadNotes = async () => {
            const { data } = await supabase
                .from('presentation_notes')
                .select('content')
                .eq('slide_id', currentSlide)
                .single();
            setNotes(data?.content || '');
        };
        loadNotes();
    }, [currentSlide]);

    // Suscripción Realtime al estado
    useEffect(() => {
        const channel = supabase
            .channel('remote-state')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'presentation_state',
            }, (payload) => {
                const row = payload.new as any;
                setCurrentSlide(row.current_slide);
                setManualMode(row.manual_mode);
            })
            .subscribe((status) => {
                setConnected(status === 'SUBSCRIBED');
            });

        return () => { supabase.removeChannel(channel); };
    }, []);

    // Navegar slide
    const goToSlide = useCallback(async (slideIdx: number) => {
        const clamped = Math.max(0, Math.min(TOTAL_SLIDES - 1, slideIdx));
        setCurrentSlide(clamped);
        await supabase
            .from('presentation_state')
            .update({ current_slide: clamped, updated_at: new Date().toISOString() })
            .eq('id', 1);
    }, []);

    // Toggle modo manual / emergencia
    const toggleManualMode = useCallback(async () => {
        const newMode = !manualMode;
        setManualMode(newMode);
        await supabase
            .from('presentation_state')
            .update({ manual_mode: newMode, updated_at: new Date().toISOString() })
            .eq('id', 1);
    }, [manualMode]);

    // Abrir /hub remotamente en todos los viewers
    const openHubRemote = useCallback(async () => {
        setOpeningHub(true);
        // Abrir localmente también
        window.open('/hub', '_blank');
        // Disparar a todos los viewers via Supabase
        await supabase
            .from('presentation_state')
            .update({ open_hub: true, updated_at: new Date().toISOString() })
            .eq('id', 1);
        // Resetear después de 2s para que no se dispare de nuevo
        setTimeout(async () => {
            await supabase
                .from('presentation_state')
                .update({ open_hub: false })
                .eq('id', 1);
            setOpeningHub(false);
        }, 2000);
    }, []);

    // Auto-save notas con debounce 1s
    const handleNotesChange = (text: string) => {
        setNotes(text);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            await supabase
                .from('presentation_notes')
                .upsert({ slide_id: currentSlide, content: text, updated_at: new Date().toISOString() });
        }, 1000);
    };

    const slideNames = [
        'Portada', 'Problema', 'Validación', 'Acelerador',
        'Crecimiento', 'Autoridad', 'Ecosistema', 'Personalización',
        'Motor de Simulación', 'UAZ: Propuesta', 'Resultados UAZ',
    ];

    // Vista Launcher
    if (!fullscreen) {
        return (
            <div style={{
                width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', background: '#FAFAFA',
                fontFamily: "'Inter', -apple-system, sans-serif",
            }}>
                <div style={{ textAlign: 'center', maxWidth: 340 }}>
                    {/* Logo */}
                    <div style={{
                        width: 64, height: 64, borderRadius: 16, background: '#111',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 24px', boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                    }}>
                        <span style={{ color: '#10B981', fontSize: 20, fontWeight: 800 }}>D</span>
                    </div>

                    <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', letterSpacing: '-0.03em', marginBottom: 6 }}>
                        Dentaxy Remote
                    </h1>
                    <p style={{ fontSize: 13, color: '#999', marginBottom: 32, lineHeight: 1.6 }}>
                        Control remoto para la presentación.<br />Abre la presentación en otra pantalla.
                    </p>

                    {/* Status de conexión */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        fontSize: 11, color: connected ? '#10B981' : '#EF4444',
                        marginBottom: 24, fontWeight: 500,
                    }}>
                        {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
                        {connected ? 'Conectado a Supabase Realtime' : 'Conectando...'}
                    </div>

                    {/* Iniciar */}
                    <button
                        onClick={() => setFullscreen(true)}
                        style={{
                            width: '100%', padding: '16px 0', borderRadius: 14,
                            background: '#111', color: 'white', border: 'none',
                            fontSize: 15, fontWeight: 600, cursor: 'pointer',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => { (e.target as HTMLElement).style.background = '#333'; }}
                        onMouseOut={(e) => { (e.target as HTMLElement).style.background = '#111'; }}
                    >
                        Iniciar Presentación
                    </button>
                </div>
            </div>
        );
    }

    // Vista Control Fullscreen
    return (
        <div style={{
            width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column',
            background: 'white', fontFamily: "'Inter', -apple-system, sans-serif",
            position: 'relative', overflow: 'hidden',
        }}>

            {/* ── HEADER ── */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 20px', borderBottom: '1px solid #F0F0F0',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: 8, background: '#111',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <span style={{ color: '#10B981', fontSize: 11, fontWeight: 800 }}>D</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#111', letterSpacing: '-0.01em' }}>Remote</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* Status */}
                    <span style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        fontSize: 10, fontWeight: 500, color: connected ? '#10B981' : '#EF4444',
                    }}>
                        <span style={{
                            width: 5, height: 5, borderRadius: '50%',
                            background: connected ? '#10B981' : '#EF4444',
                        }} />
                        {connected ? 'LIVE' : 'OFF'}
                    </span>

                    {/* Slide counter */}
                    <span style={{ fontSize: 12, fontWeight: 500, color: '#999' }}>
                        {String(currentSlide + 1).padStart(2, '0')} / {String(TOTAL_SLIDES).padStart(2, '0')}
                    </span>
                </div>
            </div>

            {/* ── SLIDE NAME ── */}
            <div style={{ padding: '20px 20px 12px', textAlign: 'center' }}>
                <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', color: '#CCC', textTransform: 'uppercase', marginBottom: 4 }}>
                    Slide actual
                </p>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: '#111', letterSpacing: '-0.03em' }}>
                    {slideNames[currentSlide] || `Slide ${currentSlide + 1}`}
                </h2>
            </div>

            {/* ── SLIDE DOTS ── */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 5, padding: '0 20px 16px' }}>
                {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goToSlide(i)}
                        style={{
                            width: i === currentSlide ? 22 : 6, height: 6,
                            borderRadius: 3, border: 'none', cursor: 'pointer', padding: 0,
                            background: i === currentSlide ? '#111' : '#E5E5E5',
                            transition: 'all 0.3s ease',
                        }}
                    />
                ))}
            </div>

            {/* ── TELEPROMPTER ── */}
            <div style={{ flex: 1, padding: '0 20px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                    flex: 1, borderRadius: 16, border: '1px solid #F0F0F0',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 14px', borderBottom: '1px solid #F5F5F5',
                    }}>
                        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', color: '#BBB', textTransform: 'uppercase' }}>
                            Teleprompter
                        </span>
                        <span style={{ fontSize: 9, color: '#CCC', fontWeight: 500 }}>Auto-save</span>
                    </div>
                    <textarea
                        value={notes}
                        onChange={(e) => handleNotesChange(e.target.value)}
                        placeholder="Escribe tus notas para esta diapositiva..."
                        style={{
                            flex: 1, width: '100%', padding: '14px 16px',
                            border: 'none', outline: 'none', resize: 'none',
                            fontSize: 15, lineHeight: 1.7, color: '#333',
                            fontFamily: "'Inter', sans-serif", fontWeight: 400,
                            background: 'transparent',
                        }}
                    />
                </div>
            </div>

            {/* ── BOTÓN DE EMERGENCIA ── */}
            <div style={{ padding: '12px 20px 8px', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                {/* Botón Abrir Hub */}
                <button
                    onClick={openHubRemote}
                    disabled={openingHub}
                    style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        padding: '10px 16px', borderRadius: 12,
                        border: 'none',
                        background: openingHub ? '#D1FAE5' : 'linear-gradient(135deg, #10B981, #059669)',
                        color: openingHub ? '#065F46' : 'white',
                        fontSize: 13, fontWeight: 600, cursor: openingHub ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: openingHub ? 'none' : '0 4px 16px rgba(16,185,129,0.35)',
                    }}
                >
                    <span>{openingHub ? '\u2705' : '\u26a1'}</span>
                    {openingHub ? 'Hub abierto en audiencia' : 'Abrir /hub en audiencia'}
                </button>

                {/* ── NUEVO: Botón de Edición de Presentación ── */}
                <button
                    onClick={() => navigate('/admin/presentation-editor')}
                    style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        padding: '10px 16px', borderRadius: 12,
                        border: '1.5px solid rgba(99,102,241,0.4)',
                        background: 'rgba(99,102,241,0.08)',
                        color: '#6366F1',
                        fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.15)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.6)';
                    }}
                    onMouseOut={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.08)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.4)';
                    }}
                >
                    <PenLine size={14} />
                    Edición de Presentación
                </button>

                <button
                    onClick={toggleManualMode}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '8px 16px', borderRadius: 100,
                        border: manualMode ? '1.5px solid #F59E0B' : '1px solid #E5E5E5',
                        background: manualMode ? '#FFFBEB' : 'white',
                        color: manualMode ? '#92400E' : '#999',
                        fontSize: 11, fontWeight: 600, cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                >
                    <AlertTriangle size={12} />
                    {manualMode ? 'MODO MANUAL ACTIVO' : 'MODO MANUAL / EMERGENCIA'}
                </button>
            </div>

            {/* ── CONTROLES DE NAVEGACIÓN ── */}
            <div style={{
                padding: '12px 20px 28px',
                display: 'flex', gap: 10,
            }}>
                {/* Atrás */}
                <button
                    onClick={() => goToSlide(currentSlide - 1)}
                    disabled={currentSlide === 0}
                    style={{
                        width: 64, height: 64, borderRadius: 20,
                        border: '1px solid #E5E5E5', background: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: currentSlide === 0 ? 'default' : 'pointer',
                        opacity: currentSlide === 0 ? 0.3 : 1,
                        transition: 'all 0.2s',
                        flexShrink: 0,
                    }}
                >
                    <ChevronLeft size={24} color="#111" />
                </button>

                {/* Siguiente */}
                <button
                    onClick={() => goToSlide(currentSlide + 1)}
                    disabled={currentSlide === TOTAL_SLIDES - 1}
                    style={{
                        flex: 1, height: 64, borderRadius: 20,
                        border: 'none', background: '#111', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        fontSize: 15, fontWeight: 600, cursor: 'pointer',
                        opacity: currentSlide === TOTAL_SLIDES - 1 ? 0.4 : 1,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        transition: 'all 0.2s',
                    }}
                >
                    Siguiente
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}
