/**
 * PresentationEditor.tsx — Dentaxy Admin
 * ─────────────────────────────────────────────────────────────────────────────
 * Editor de diapositivas tipo PowerPoint online.
 * Motor de canvas: tldraw v4 (getSnapshot / loadSnapshot son funciones importadas)
 * Persistencia: Supabase tabla presentation_slides
 * Reordenamiento: @dnd-kit/sortable
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Tldraw,
    getSnapshot,
    loadSnapshot,
    type Editor as TldrawEditor,
    type TLEditorSnapshot,
} from 'tldraw';
import 'tldraw/tldraw.css';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { supabase } from '@/integrations/supabase/client';
import {
    ChevronLeft,
    Plus,
    Trash2,
    Copy,
    ExternalLink,
    Save,
    GripVertical,
    Layout,
    FileText,
    Columns,
    CheckCircle2,
    Loader2,
    PenLine,
} from 'lucide-react';

/* ─── TIPOS ─────────────────────────────────────────────────── */
interface Slide {
    id: string;
    slide_order: number;
    title: string;
    tldraw_snapshot: TLEditorSnapshot | null;
}

/* ─── COLORES DENTAXY ───────────────────────────────────────── */
const B = {
    bg: '#FAFAFA',
    panel: '#FFFFFF',
    border: '#F0F0F0',
    accent: '#111827',
    green: '#10B981',
    indigo: '#6366F1',
    text: '#111',
    muted: '#999',
    activeBg: '#F0FFF4',
    danger: '#EF4444',
};

/* ─── PLANTILLAS ─────────────────────────────────────────────── */
const TEMPLATES = [
    { id: 'blank', label: 'En blanco', icon: <Layout size={16} /> },
    { id: 'title', label: 'Título centrado', icon: <FileText size={16} /> },
    { id: 'two-col', label: 'Dos columnas', icon: <Columns size={16} /> },
];

/* ─── HELPER: botón de acción pequeño ──────────────────────── */
function ActionBtn({
    icon, tooltip, onClick, danger = false,
}: {
    icon: React.ReactNode; tooltip: string; onClick: () => void; danger?: boolean;
}) {
    return (
        <button
            title={tooltip}
            onClick={onClick}
            style={{
                width: 24, height: 24, borderRadius: 6,
                border: `1px solid ${danger ? '#FCA5A5' : B.border}`,
                background: danger ? '#FFF5F5' : B.panel,
                color: danger ? B.danger : B.muted,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.15s ease',
            }}
        >
            {icon}
        </button>
    );
}

/* ─── MODAL PLANTILLAS ───────────────────────────────────────── */
function TemplateModal({ onSelect, onClose }: { onSelect: (id: string) => void; onClose: () => void; }) {
    return (
        <div
            style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
                backdropFilter: 'blur(4px)', zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: B.panel, borderRadius: 16, padding: '28px 24px',
                    width: 320, boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 style={{ fontSize: 16, fontWeight: 700, color: B.text, marginBottom: 6, fontFamily: 'Inter, sans-serif' }}>
                    Nueva Diapositiva
                </h3>
                <p style={{ fontSize: 12, color: B.muted, marginBottom: 20, fontFamily: 'Inter, sans-serif' }}>
                    Elige una plantilla para empezar
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {TEMPLATES.map((t) => (
                        <button key={t.id} onClick={() => onSelect(t.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '12px 16px', borderRadius: 10,
                                border: `1px solid ${B.border}`, background: B.bg,
                                cursor: 'pointer', transition: 'all 0.15s ease', textAlign: 'left',
                            }}
                            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.background = B.activeBg)}
                            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.background = B.bg)}
                        >
                            <span style={{ color: B.green }}>{t.icon}</span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: B.text, fontFamily: 'Inter, sans-serif' }}>
                                {t.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─── SLIDE ITEM (sortable) ──────────────────────────────────── */
function SlideItem({
    slide, index, isActive, onSelect, onDelete, onDuplicate, onRename,
}: {
    slide: Slide; index: number; isActive: boolean;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onRename: (id: string, title: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: slide.id });

    const [editing, setEditing] = useState(false);
    const [tempTitle, setTempTitle] = useState(slide.title);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);
    useEffect(() => { setTempTitle(slide.title); }, [slide.title]);

    const commitRename = () => {
        setEditing(false);
        const t = tempTitle.trim();
        if (t && t !== slide.title) onRename(slide.id, t);
        else setTempTitle(slide.title);
    };

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.5 : 1,
                display: 'flex', flexDirection: 'column', gap: 4,
                padding: '8px 10px', borderRadius: 10,
                border: isActive ? `1.5px solid ${B.green}` : `1px solid ${B.border}`,
                background: isActive ? B.activeBg : B.panel,
                cursor: isDragging ? 'grabbing' : 'pointer',
                userSelect: 'none',
                transition: 'all 0.15s ease',
            }}
            onClick={() => !editing && onSelect(slide.id)}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {/* Drag handle */}
                <div
                    {...attributes} {...listeners}
                    style={{ cursor: isDragging ? 'grabbing' : 'grab', color: B.muted, display: 'flex', flexShrink: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <GripVertical size={14} />
                </div>

                {/* Número */}
                <span style={{ fontSize: 10, fontWeight: 700, color: isActive ? B.green : B.muted, letterSpacing: '0.08em', fontFamily: 'Inter, sans-serif', flexShrink: 0 }}>
                    {String(index + 1).padStart(2, '0')}
                </span>

                {/* Título / input editable */}
                {editing ? (
                    <input
                        ref={inputRef} value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        onBlur={commitRename}
                        onKeyDown={(e) => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') { setEditing(false); setTempTitle(slide.title); } }}
                        onClick={(e) => e.stopPropagation()}
                        style={{ flex: 1, fontSize: 11, fontWeight: 600, color: B.text, border: 'none', outline: `1px solid ${B.green}`, borderRadius: 4, padding: '1px 4px', fontFamily: 'Inter, sans-serif', background: 'white' }}
                    />
                ) : (
                    <span
                        onDoubleClick={(e) => { e.stopPropagation(); setEditing(true); }}
                        style={{ flex: 1, fontSize: 11, fontWeight: 600, color: isActive ? B.text : B.muted, fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        title="Doble clic para renombrar"
                    >
                        {slide.title}
                    </span>
                )}
            </div>

            {/* Miniatura */}
            <div style={{
                height: 56, borderRadius: 6,
                background: isActive ? 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(99,102,241,0.06))' : 'linear-gradient(135deg, #F9FAFB, #F3F4F6)',
                border: `1px solid ${isActive ? 'rgba(16,185,129,0.2)' : B.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <span style={{ fontSize: 9, color: B.muted }}>
                    {slide.tldraw_snapshot ? '🎨 Canvas guardado' : '📄 En blanco'}
                </span>
            </div>

            {/* Acciones rápidas (solo cuando activo) */}
            {isActive && (
                <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                    <ActionBtn icon={<Copy size={11} />} tooltip="Duplicar" onClick={() => onDuplicate(slide.id)} />
                    <ActionBtn icon={<Trash2 size={11} />} tooltip="Eliminar" onClick={() => onDelete(slide.id)} danger />
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ═══════════════════════════════════════════════════════════════ */
export default function PresentationEditor() {
    const navigate = useNavigate();

    const [slides, setSlides] = useState<Slide[]>([]);
    const [activeSlideId, setActiveSlideId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedAt, setSavedAt] = useState<string | null>(null);
    const [showTemplateModal, setShowTemplateModal] = useState(false);

    const editorRef = useRef<TldrawEditor | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>();
    const isChangingSlide = useRef(false);

    /* ── DnD ────────────────────────────────────────────────────── */
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    /* ── CARGA INICIAL ──────────────────────────────────────────── */
    const loadSlides = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('presentation_slides')
            .select('*')
            .order('slide_order', { ascending: true });

        if (error) {
            console.error('[Editor] Error cargando slides:', error);
            setLoading(false);
            return;
        }

        if (data && data.length > 0) {
            setSlides(data as Slide[]);
            setActiveSlideId(data[0].id);
        } else {
            // Crear slide inicial
            const { data: ns } = await supabase
                .from('presentation_slides')
                .insert({ slide_order: 0, title: 'Diapositiva 1' })
                .select().single();
            if (ns) { setSlides([ns as Slide]); setActiveSlideId(ns.id); }
        }
        setLoading(false);
    }, []);

    useEffect(() => { loadSlides(); }, [loadSlides]);

    /* ── AUTO-SAVE con debounce ─────────────────────────────────── */
    const scheduleAutoSave = useCallback((slideId: string, snapshot: TLEditorSnapshot) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setSaving(true);
            await supabase
                .from('presentation_slides')
                .update({ tldraw_snapshot: snapshot as unknown as Record<string, unknown>, updated_at: new Date().toISOString() })
                .eq('id', slideId);
            setSavedAt(new Date().toLocaleTimeString('es-MX'));
            setSaving(false);
        }, 1500);
    }, []);

    /* ── GUARDAR SNAPSHOT DEL SLIDE ACTIVO ─────────────────────── */
    const saveCurrentSlide = useCallback(async () => {
        if (!editorRef.current || !activeSlideId) return;
        const snapshot = getSnapshot(editorRef.current.store);
        await supabase
            .from('presentation_slides')
            .update({ tldraw_snapshot: snapshot as unknown as Record<string, unknown>, updated_at: new Date().toISOString() })
            .eq('id', activeSlideId);
        setSlides((prev) =>
            prev.map((s) => s.id === activeSlideId ? { ...s, tldraw_snapshot: snapshot } : s)
        );
    }, [activeSlideId]);

    /* ── CAMBIAR SLIDE (guarda el actual antes) ─────────────────── */
    const handleSelectSlide = useCallback(async (targetId: string) => {
        if (targetId === activeSlideId || isChangingSlide.current) return;
        isChangingSlide.current = true;
        await saveCurrentSlide();
        setActiveSlideId(targetId);
        setSavedAt(null);
        isChangingSlide.current = false;
    }, [activeSlideId, saveCurrentSlide]);

    /* ── CARGAR SNAPSHOT CUANDO CAMBIA EL SLIDE ACTIVO ──────────── */
    useEffect(() => {
        if (!editorRef.current || !activeSlideId || isChangingSlide.current) return;
        const slide = slides.find((s) => s.id === activeSlideId);
        if (!slide) return;

        if (slide.tldraw_snapshot) {
            try {
                loadSnapshot(editorRef.current.store, slide.tldraw_snapshot as TLEditorSnapshot);
            } catch {
                // snapshot incompatible — limpiar
                const shapes = editorRef.current.getCurrentPageShapes();
                if (shapes.length > 0) editorRef.current.deleteShapes(shapes.map((s) => s.id));
            }
        } else {
            const shapes = editorRef.current.getCurrentPageShapes();
            if (shapes.length > 0) editorRef.current.deleteShapes(shapes.map((s) => s.id));
        }
    }, [activeSlideId, slides]);

    /* ── AÑADIR SLIDE ────────────────────────────────────────────── */
    const handleAddSlide = useCallback(async (_templateId = 'blank') => {
        setShowTemplateModal(false);
        const maxOrder = slides.reduce((m, s) => Math.max(m, s.slide_order), -1);
        const { data, error } = await supabase
            .from('presentation_slides')
            .insert({ slide_order: maxOrder + 1, title: `Diapositiva ${slides.length + 1}`, tldraw_snapshot: null })
            .select().single();
        if (error || !data) return;
        setSlides((prev) => [...prev, data as Slide]);
        setActiveSlideId(data.id);
    }, [slides]);

    /* ── ELIMINAR SLIDE ──────────────────────────────────────────── */
    const handleDeleteSlide = useCallback(async (slideId: string) => {
        if (slides.length <= 1) return;
        if (!window.confirm('¿Eliminar esta diapositiva?')) return;
        await supabase.from('presentation_slides').delete().eq('id', slideId);
        const updated = slides.filter((s) => s.id !== slideId);
        setSlides(updated);
        if (activeSlideId === slideId) setActiveSlideId(updated[0]?.id ?? null);
    }, [slides, activeSlideId]);

    /* ── DUPLICAR SLIDE ──────────────────────────────────────────── */
    const handleDuplicateSlide = useCallback(async (slideId: string) => {
        const source = slides.find((s) => s.id === slideId);
        if (!source) return;
        const { data, error } = await supabase
            .from('presentation_slides')
            .insert({ slide_order: source.slide_order + 0.5, title: `${source.title} (Copia)`, tldraw_snapshot: source.tldraw_snapshot })
            .select().single();
        if (error || !data) return;
        const all = [...slides, data as Slide].sort((a, b) => a.slide_order - b.slide_order)
            .map((s, i) => ({ ...s, slide_order: i }));
        setSlides(all);
        setActiveSlideId(data.id);
        await Promise.all(all.map((s) => supabase.from('presentation_slides').update({ slide_order: s.slide_order }).eq('id', s.id)));
    }, [slides]);

    /* ── RENOMBRAR SLIDE ─────────────────────────────────────────── */
    const handleRenameSlide = useCallback(async (slideId: string, title: string) => {
        await supabase.from('presentation_slides').update({ title }).eq('id', slideId);
        setSlides((prev) => prev.map((s) => s.id === slideId ? { ...s, title } : s));
    }, []);

    /* ── DRAG END (reordenar) ────────────────────────────────────── */
    const handleDragEnd = useCallback(async ({ active, over }: DragEndEvent) => {
        if (!over || active.id === over.id) return;
        const oldIdx = slides.findIndex((s) => s.id === active.id);
        const newIdx = slides.findIndex((s) => s.id === over.id);
        const reordered = arrayMove(slides, oldIdx, newIdx).map((s, i) => ({ ...s, slide_order: i }));
        setSlides(reordered);
        await Promise.all(reordered.map((s) => supabase.from('presentation_slides').update({ slide_order: s.slide_order }).eq('id', s.id)));
    }, [slides]);

    /* ── GUARDAR MANUAL ──────────────────────────────────────────── */
    const handleManualSave = useCallback(async () => {
        if (!editorRef.current || !activeSlideId) return;
        setSaving(true);
        const snapshot = getSnapshot(editorRef.current.store);
        await supabase
            .from('presentation_slides')
            .update({ tldraw_snapshot: snapshot as unknown as Record<string, unknown>, updated_at: new Date().toISOString() })
            .eq('id', activeSlideId);
        setSlides((prev) => prev.map((s) => s.id === activeSlideId ? { ...s, tldraw_snapshot: snapshot } : s));
        setSavedAt(new Date().toLocaleTimeString('es-MX'));
        setSaving(false);
    }, [activeSlideId]);

    const activeSlide = slides.find((s) => s.id === activeSlideId);

    /* ── LOADING SCREEN ─────────────────────────────────────────── */
    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: B.bg }}>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                <div style={{ textAlign: 'center' }}>
                    <Loader2 size={32} style={{ color: B.green, animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
                    <p style={{ fontSize: 13, color: B.muted, fontFamily: 'Inter, sans-serif' }}>Cargando diapositivas...</p>
                </div>
            </div>
        );
    }

    /* ─────────────────────────────────────────────────────────────── */
    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: B.bg, fontFamily: 'Inter, -apple-system, sans-serif', overflow: 'hidden' }}>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

            {/* ══ BARRA SUPERIOR ══════════════════════════════════════ */}
            <div style={{ height: 52, borderBottom: `1px solid ${B.border}`, background: B.panel, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10, flexShrink: 0 }}>

                {/* Volver */}
                <button
                    onClick={() => navigate('/admin/presentation-remote')}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: `1px solid ${B.border}`, background: 'white', color: B.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                >
                    <ChevronLeft size={14} /> Remote
                </button>

                {/* Logo */}
                <div style={{ width: 28, height: 28, borderRadius: 8, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#10B981', fontSize: 11, fontWeight: 800 }}>D</span>
                </div>

                {/* Título */}
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: B.text, letterSpacing: '-0.01em' }}>
                        Dentaxy{' '}
                        <span style={{ color: B.muted, fontWeight: 400 }}>Editor de Presentación</span>
                    </p>
                    {activeSlide && <p style={{ fontSize: 10, color: B.muted, marginTop: 1 }}>Slide activo: {activeSlide.title}</p>}
                </div>

                {/* Estado auto-save */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: saving ? B.indigo : savedAt ? B.green : B.muted, fontWeight: 500 }}>
                    {saving ? (
                        <><Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Guardando...</>
                    ) : savedAt ? (
                        <><CheckCircle2 size={12} /> Guardado {savedAt}</>
                    ) : <PenLine size={12} />}
                </div>

                {/* Guardar */}
                <button
                    onClick={handleManualSave}
                    disabled={saving}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', borderRadius: 8, border: 'none', background: '#111', color: 'white', fontSize: 12, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}
                >
                    <Save size={13} /> Guardar
                </button>

                {/* Preview */}
                <button
                    onClick={() => window.open('/demo/presentacion', '_blank')}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: `1px solid ${B.border}`, background: 'white', color: B.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                >
                    <ExternalLink size={13} /> Preview
                </button>
            </div>

            {/* ══ CUERPO ══════════════════════════════════════════════ */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                {/* ── PANEL IZQUIERDO ─────────────────────────────────── */}
                <div style={{ width: 220, borderRight: `1px solid ${B.border}`, background: B.panel, display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>

                    {/* Cabecera */}
                    <div style={{ padding: '12px 14px 8px', borderBottom: `1px solid ${B.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: B.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            Slides ({slides.length})
                        </span>
                        <button
                            onClick={() => setShowTemplateModal(true)}
                            style={{ width: 24, height: 24, borderRadius: 6, border: 'none', background: '#111', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    {/* Listado sortable */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={slides.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                                {slides.map((slide, index) => (
                                    <SlideItem
                                        key={slide.id}
                                        slide={slide}
                                        index={index}
                                        isActive={activeSlideId === slide.id}
                                        onSelect={handleSelectSlide}
                                        onDelete={handleDeleteSlide}
                                        onDuplicate={handleDuplicateSlide}
                                        onRename={handleRenameSlide}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    </div>

                    {/* Botón añadir inferior */}
                    <div style={{ padding: '10px 14px', borderTop: `1px solid ${B.border}` }}>
                        <button
                            onClick={() => setShowTemplateModal(true)}
                            style={{ width: '100%', padding: '9px 0', borderRadius: 8, border: `1px dashed ${B.border}`, background: 'transparent', color: B.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                            onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.borderColor = B.green; (e.currentTarget as HTMLElement).style.color = B.green; }}
                            onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.borderColor = B.border; (e.currentTarget as HTMLElement).style.color = B.muted; }}
                        >
                            <Plus size={13} /> Añadir diapositiva
                        </button>
                    </div>
                </div>

                {/* ── CANVAS TLDRAW ────────────────────────────────────── */}
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                    {activeSlideId ? (
                        <Tldraw
                            key={activeSlideId}
                            onMount={(editor: TldrawEditor) => {
                                editorRef.current = editor;

                                // Cargar snapshot del slide activo
                                const slide = slides.find((s) => s.id === activeSlideId);
                                if (slide?.tldraw_snapshot) {
                                    try {
                                        loadSnapshot(editor.store, slide.tldraw_snapshot as TLEditorSnapshot);
                                    } catch {
                                        // snapshot incompatible — empezar en blanco
                                    }
                                }

                                // Suscribirse a cambios del store para auto-save
                                editor.store.listen(() => {
                                    if (!isChangingSlide.current && activeSlideId) {
                                        const snapshot = getSnapshot(editor.store);
                                        scheduleAutoSave(activeSlideId, snapshot);
                                    }
                                }, { scope: 'document', source: 'user' });
                            }}
                        />
                    ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: B.muted, fontSize: 14 }}>
                            Selecciona o crea una diapositiva para empezar
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de plantillas */}
            {showTemplateModal && (
                <TemplateModal onSelect={handleAddSlide} onClose={() => setShowTemplateModal(false)} />
            )}
        </div>
    );
}
