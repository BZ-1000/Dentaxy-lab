import React, { useState, useEffect, useCallback } from 'react';
import {
    Search,
    User,
    Mail,
    Smartphone,
    CheckCircle2,
    WifiOff,
    Loader2,
    Send,
    Radio,
    Zap,
    ChevronDown,
    ChevronUp,
    Package,
    Clock,
    Tag,
    Sparkles,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { leadsService, Lead } from '@/services/leads';
import { useP2P, LeadPayload } from '@/hooks/useP2P';
import { toast } from 'sonner';

// IDs recibidos por P2P en ESTA sesión (para el badge "Nuevo")
const sessionNewIds = new Set<string>();

const DentaxyNexus: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [leads, setLeads] = useState<Lead[]>([]);
    const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPublishing, setIsPublishing] = useState(true);
    const [newThisSession, setNewThisSession] = useState<Set<string>>(new Set());
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [showRecent, setShowRecent] = useState(true);

    // P2P Hook (modo receptor)
    const { peerId, connectionStatus, incomingLead, incomingFile, initializePeer } = useP2P();

    // ── Cargar datos desde Supabase ─────────────────────────────────────────
    const fetchLeads = useCallback(async () => {
        try {
            const data = await leadsService.getLeads();
            setLeads(data);
        } catch (error) {
            console.error('[DentaxyNexus] Error cargando leads:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchRecent = useCallback(async () => {
        try {
            const data = await leadsService.getRecentLeads(10);
            setRecentLeads(data);
        } catch (error) {
            console.error('[DentaxyNexus] Error cargando leads recientes:', error);
        }
    }, []);

    // ── Inicialización: P2P + suscripción Supabase en tiempo real ─────────
    useEffect(() => {
        const setup = async () => {
            try {
                setIsPublishing(true);
                const baseId = `dentaxy-nexus-${window.location.hostname.replace(/\./g, '-')}`;
                let peer;
                try {
                    peer = await initializePeer(baseId);
                } catch {
                    peer = await initializePeer();
                }
                if (peer.id) {
                    await leadsService.saveReceiverPeerId(peer.id);
                    toast.success('🛰️ DENTAXY Nexus activo', {
                        description: `Canal P2P listo: ${peer.id.substring(0, 16)}...`,
                        duration: 5000,
                    });
                }
            } catch (err) {
                console.error('[DentaxyNexus] Error inicializando receptor P2P:', err);
                toast.error('Error al activar el canal P2P');
            } finally {
                setIsPublishing(false);
            }
        };

        setup();

        // Suscripción realtime: cada nuevo lead en Supabase refresca el panel
        const subscription = leadsService.subscribeToLeads(() => {
            fetchLeads();
            fetchRecent();
        });

        fetchLeads();
        fetchRecent();

        return () => {
            subscription.unsubscribe();
            leadsService.saveReceiverPeerId('').catch(() => { });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Cuando llega un lead vía P2P: marcarlo como "nuevo esta sesión" ───
    useEffect(() => {
        if (!incomingLead) return;

        toast.success(`📡 Nuevo lead de ${incomingLead.source}`, {
            description: `${incomingLead.full_name} · ${incomingLead.phone}`,
            duration: 8000,
        });

        // Refrescar datos desde Supabase (el emisor también ya guardó allí)
        setTimeout(() => {
            fetchLeads();
            fetchRecent().then(() => {
                // Marcar el lead más reciente como "nuevo" después de cargar
                setRecentLeads(prev => {
                    if (prev.length > 0) {
                        const newestId = prev[0].id;
                        sessionNewIds.add(newestId);
                        setNewThisSession(new Set(sessionNewIds));
                    }
                    return prev;
                });
            });
        }, 2000);
    }, [incomingLead, fetchLeads, fetchRecent]);

    // ── Cuando llega un archivo vía P2P ──────────────────────────────────
    useEffect(() => {
        if (!incomingFile) return;
        toast.success('📎 Historia clínica recibida', {
            description: `Archivo: ${incomingFile.name}`,
            duration: 8000,
        });
    }, [incomingFile]);

    const handleSendEmail = async (lead: Lead | LeadPayload, template: string) => {
        toast.promise(
            fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: (lead as Lead).email || '',
                    name: lead.full_name,
                    template,
                }),
            }),
            {
                loading: 'Enviando transmisión cifrada...',
                success: 'Protocolo ejecutado.',
                error: 'Fallo en la transmisión.',
            }
        );
    };

    // ── Filtrado unificado: busca en TODOS los leads ──────────────────────
    const q = searchTerm.toLowerCase().trim();

    const filteredLeads = leads.filter(lead => {
        if (!q) return true;
        return (
            lead.full_name.toLowerCase().includes(q) ||
            lead.phone.includes(q) ||
            (lead.email || '').toLowerCase().includes(q) ||
            lead.source.toLowerCase().includes(q)
        );
    });

    const filteredRecent = recentLeads.filter(lead => {
        if (!q) return true;
        return (
            lead.full_name.toLowerCase().includes(q) ||
            lead.phone.includes(q) ||
            (lead.email || '').toLowerCase().includes(q) ||
            lead.source.toLowerCase().includes(q)
        );
    });

    // Estado del canal P2P para el badge
    const channelStatus = isPublishing
        ? { label: 'Publicando canal...', color: 'text-amber-500', icon: Loader2, pulse: true }
        : peerId
            ? { label: 'Canal P2P Activo', color: 'text-emerald-500', icon: Radio, pulse: true }
            : { label: 'Canal Inactivo', color: 'text-zinc-400', icon: WifiOff, pulse: false };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-end justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
                        DENTAXY Nexus{' '}
                        <span className="text-emerald-500 text-lg font-mono px-2 py-0.5 bg-emerald-50 rounded-md">
                            Live Command
                        </span>
                    </h1>
                    <p className="mt-1 font-medium text-zinc-400">
                        Centro táctico de identidades y datos en tiempo real
                    </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                    {/* Status del canal P2P */}
                    <Badge variant="outline" className="h-10 px-4 gap-2 text-zinc-500 font-mono">
                        <channelStatus.icon
                            className={`h-3 w-3 ${channelStatus.color} ${channelStatus.pulse ? 'animate-pulse' : ''}`}
                        />
                        <span className={channelStatus.color}>{channelStatus.label}</span>
                    </Badge>

                    {/* PeerID activo */}
                    {peerId && (
                        <Badge
                            variant="outline"
                            className="h-10 px-3 gap-1 text-xs font-mono text-zinc-400 max-w-[220px]"
                            title={peerId}
                        >
                            <Zap className="h-3 w-3 text-amber-400 shrink-0" />
                            <span className="truncate">{peerId.substring(0, 20)}...</span>
                        </Badge>
                    )}
                </div>
            </div>

            {/* ── Sección RECIENTES (últimos 10 leads desde Supabase) ────── */}
            {(filteredRecent.length > 0 || q) && (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 space-y-3">
                    <button
                        onClick={() => setShowRecent(v => !v)}
                        className="w-full flex items-center justify-between gap-2 text-sm font-semibold text-emerald-700"
                    >
                        <span className="flex items-center gap-2">
                            <Radio className="h-4 w-4 animate-pulse" />
                            Leads recientes ({filteredRecent.length}
                            {q ? ` de ${recentLeads.length}` : ''})
                            {newThisSession.size > 0 && (
                                <Badge className="bg-emerald-500 text-white text-[10px] h-5 px-1.5">
                                    +{newThisSession.size} nuevos hoy
                                </Badge>
                            )}
                        </span>
                        {showRecent
                            ? <ChevronUp className="h-4 w-4" />
                            : <ChevronDown className="h-4 w-4" />}
                    </button>

                    <AnimatePresence>
                        {showRecent && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2"
                            >
                                {filteredRecent.length === 0 && q && (
                                    <p className="text-sm text-zinc-400 text-center py-4">
                                        Sin resultados para "{q}" en leads recientes.
                                    </p>
                                )}
                                {filteredRecent.map((lead) => {
                                    const isNew = newThisSession.has(lead.id);
                                    const isExpanded = expandedId === lead.id;
                                    const meta = lead.metadata as Record<string, string> | undefined;

                                    return (
                                        <motion.div
                                            key={lead.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`bg-white rounded-xl border overflow-hidden ${isNew ? 'border-emerald-300 shadow-sm shadow-emerald-100' : 'border-emerald-100'}`}
                                        >
                                            {/* Fila principal */}
                                            <button
                                                onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                                                className="w-full flex items-center justify-between p-3 hover:bg-emerald-50/50 transition-colors text-left"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0
                                                        ${lead.source === 'Shop' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                                        {lead.full_name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-zinc-900 flex items-center gap-1.5">
                                                            {lead.full_name}
                                                            {isNew && (
                                                                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                                                                    <Sparkles className="h-2.5 w-2.5" /> Nuevo
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-zinc-400">
                                                            {lead.phone} · {lead.source} ·{' '}
                                                            {new Date(lead.created_at).toLocaleString('es-MX', {
                                                                hour: '2-digit', minute: '2-digit',
                                                                day: '2-digit', month: 'short',
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {lead.source === 'Seed' && (lead.metadata as Record<string, string>)?.data_donation_consent
                                                            ? '📎 Con historia'
                                                            : '📋 Datos'}
                                                    </Badge>
                                                    {isExpanded
                                                        ? <ChevronUp className="h-4 w-4 text-emerald-500" />
                                                        : <ChevronDown className="h-4 w-4 text-zinc-400" />}
                                                </div>
                                            </button>

                                            {/* Panel expandido */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="border-t border-emerald-100 bg-emerald-50/30 px-4 py-4"
                                                    >
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            <div className="flex items-center gap-2">
                                                                <User className="h-4 w-4 text-emerald-500 shrink-0" />
                                                                <div>
                                                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Nombre completo</p>
                                                                    <p className="text-sm font-medium text-zinc-800">{lead.full_name}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Smartphone className="h-4 w-4 text-emerald-500 shrink-0" />
                                                                <div>
                                                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Teléfono</p>
                                                                    <p className="text-sm font-medium text-zinc-800">{lead.phone}</p>
                                                                </div>
                                                            </div>
                                                            {lead.email && (
                                                                <div className="flex items-center gap-2">
                                                                    <Mail className="h-4 w-4 text-emerald-500 shrink-0" />
                                                                    <div>
                                                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Correo electrónico</p>
                                                                        <p className="text-sm font-medium text-zinc-800 break-all">{lead.email}</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center gap-2">
                                                                <Package className="h-4 w-4 text-emerald-500 shrink-0" />
                                                                <div>
                                                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Fuente</p>
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className={`text-xs mt-0.5 ${lead.source === 'Shop'
                                                                            ? 'bg-emerald-100 text-emerald-700'
                                                                            : 'bg-indigo-100 text-indigo-700'}`}
                                                                    >
                                                                        {lead.source}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="h-4 w-4 text-emerald-500 shrink-0" />
                                                                <div>
                                                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Registrado</p>
                                                                    <p className="text-sm font-medium text-zinc-800">
                                                                        {new Date(lead.created_at).toLocaleString('es-MX')}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            {meta?.client_type && (
                                                                <div className="flex items-center gap-2">
                                                                    <Tag className="h-4 w-4 text-emerald-500 shrink-0" />
                                                                    <div>
                                                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Tipo de cliente</p>
                                                                        <p className="text-sm font-medium text-zinc-800 capitalize">{meta.client_type}</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {meta?.data_donation_consent && (
                                                                <div className="flex items-center gap-2">
                                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                                                    <div>
                                                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Donación de datos</p>
                                                                        <p className="text-sm font-medium text-zinc-800">
                                                                            {meta.data_donation_consent === 'true' ? '✅ Autorizado' : '❌ No autorizado'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Toolbar de búsqueda */}
            <div className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-white p-2 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <Input
                        placeholder="Buscar por nombre, teléfono, correo o fuente..."
                        className="h-10 border-0 bg-transparent pl-10 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <div className="h-6 w-px bg-zinc-100" />
                {/* Contador de resultados */}
                {q && (
                    <span className="text-xs text-zinc-400 font-mono pr-2">
                        {filteredLeads.length} resultado{filteredLeads.length !== 1 ? 's' : ''}
                    </span>
                )}
            </div>

            {/* Lead Feed Grid — todos los leads históricos de Supabase */}
            <div className="grid gap-4">
                {isLoading ? (
                    <div className="text-center py-16">
                        <Loader2 className="h-8 w-8 text-zinc-300 mx-auto mb-3 animate-spin" />
                        <p className="text-zinc-400">Cargando inteligencia...</p>
                    </div>
                ) : filteredLeads.length === 0 ? (
                    <div className="text-center py-16">
                        <Radio className="h-8 w-8 text-zinc-200 mx-auto mb-3" />
                        <p className="text-zinc-400">
                            {q
                                ? `Sin resultados para "${searchTerm}".`
                                : isPublishing
                                    ? 'Activando canal P2P...'
                                    : 'Sin señales activas en rango.'}
                        </p>
                        {peerId && !isPublishing && !q && (
                            <p className="text-xs text-zinc-300 mt-2 font-mono">
                                Canal listo en: {peerId.substring(0, 24)}...
                            </p>
                        )}
                    </div>
                ) : (
                    filteredLeads.map((lead) => (
                        <motion.div
                            key={lead.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group relative overflow-hidden rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="flex items-center justify-between flex-wrap gap-4">

                                {/* Lead Info */}
                                <div className="flex items-center gap-4">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl font-bold text-lg shrink-0
                                        ${lead.source === 'Shop' ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700'}`}>
                                        {lead.full_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-zinc-900 text-lg flex items-center gap-2">
                                            {lead.full_name}
                                            {newThisSession.has(lead.id) && (
                                                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                                                    <Sparkles className="h-2.5 w-2.5" /> Nuevo
                                                </span>
                                            )}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-zinc-500 flex-wrap">
                                            <Smartphone className="h-3 w-3" />
                                            <span>{lead.phone}</span>
                                            {lead.email && (
                                                <>
                                                    <span className="text-zinc-300">·</span>
                                                    <Mail className="h-3 w-3" />
                                                    <span>{lead.email}</span>
                                                </>
                                            )}
                                            <span className="text-zinc-300">·</span>
                                            <Badge variant="secondary" className="text-xs font-normal">
                                                {lead.source}
                                            </Badge>
                                            {lead.metadata && (lead.metadata as Record<string, string>).client_type && (
                                                <Badge variant="outline" className="text-xs font-normal capitalize">
                                                    {(lead.metadata as Record<string, string>).client_type}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-zinc-400 mt-1">
                                            {new Date(lead.created_at).toLocaleString('es-MX')}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col items-end mr-2">
                                        <span className="text-xs font-mono text-zinc-400">Estado</span>
                                        {lead.status === 'pending' && (
                                            <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                                                <Loader2 className="h-3 w-3 animate-spin" /> En espera
                                            </span>
                                        )}
                                        {lead.status === 'connected' && (
                                            <span className="text-xs font-bold text-emerald-500">Conectado</span>
                                        )}
                                        {lead.status === 'completed' && (
                                            <span className="text-xs font-bold text-blue-500">Completado</span>
                                        )}
                                    </div>

                                    {/* Quick Notify */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-10 w-10 rounded-xl border-zinc-200"
                                            >
                                                <Send className="h-4 w-4 text-zinc-600" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
                                            <DropdownMenuLabel className="text-xs font-normal text-zinc-400">
                                                Protocolos de Respuesta Rápida
                                            </DropdownMenuLabel>
                                            <DropdownMenuItem
                                                onClick={() => handleSendEmail(lead, 'shop_welcome')}
                                                className="gap-2 cursor-pointer focus:bg-emerald-50 focus:text-emerald-700 rounded-lg"
                                            >
                                                <Mail className="h-4 w-4" /> Bienvenida Shop
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleSendEmail(lead, 'seed_access')}
                                                className="gap-2 cursor-pointer focus:bg-indigo-50 focus:text-indigo-700 rounded-lg"
                                            >
                                                <Mail className="h-4 w-4" /> Acceso Seed
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => handleSendEmail(lead, 'p2p_success')}
                                                className="gap-2 cursor-pointer focus:bg-zinc-100 rounded-lg"
                                            >
                                                <CheckCircle2 className="h-4 w-4" /> Confirmar P2P
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DentaxyNexus;
