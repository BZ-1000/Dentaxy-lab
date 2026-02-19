import { useEffect, useState, useRef, useCallback } from 'react';
import Peer, { DataConnection } from 'peerjs';

export type LeadPayload = {
    full_name: string;
    phone: string;
    email?: string;
    source: 'Shop' | 'Seed';
    metadata?: Record<string, unknown>;
};

export type P2PMessage =
    | { type: 'lead'; data: LeadPayload }
    | { type: 'file'; name: string; mimeType: string; buffer: ArrayBuffer };

export const useP2P = () => {
    const [peerId, setPeerId] = useState<string>('');
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
    const [incomingFile, setIncomingFile] = useState<{ blob: Blob; name: string } | null>(null);
    const [incomingLead, setIncomingLead] = useState<LeadPayload | null>(null);
    const peerRef = useRef<Peer | null>(null);
    const connRef = useRef<DataConnection | null>(null);

    // ─── Manejo de conexiones entrantes (modo receptor – NexusIntel) ──────────
    const handleIncomingConnection = useCallback((conn: DataConnection) => {
        conn.on('open', () => {
            setConnectionStatus('connected');
            console.log('[P2P] Conexión entrante aceptada de:', conn.peer);
        });

        conn.on('data', (raw: unknown) => {
            const msg = raw as P2PMessage;
            console.log('[P2P] Datos recibidos:', msg.type);

            if (msg.type === 'lead') {
                setIncomingLead(msg.data);
            } else if (msg.type === 'file') {
                const blob = new Blob([msg.buffer], { type: msg.mimeType });
                setIncomingFile({ blob, name: msg.name });
            }
        });

        conn.on('close', () => {
            setConnectionStatus('idle');
            connRef.current = null;
        });

        conn.on('error', (err) => {
            console.error('[P2P] Error en conexión:', err);
            setConnectionStatus('error');
        });

        connRef.current = conn;
    }, []);

    // ─── Inicializar Peer (receptor fijo o emisor temporal) ───────────────────
    const initializePeer = useCallback((fixedId?: string): Promise<Peer> => {
        return new Promise((resolve, reject) => {
            // Destruir peer anterior si existe
            if (peerRef.current) {
                peerRef.current.destroy();
                peerRef.current = null;
            }

            const peer = fixedId ? new Peer(fixedId) : new Peer();

            peer.on('open', (id) => {
                console.log('[P2P] Peer inicializado con ID:', id);
                setPeerId(id);
                setConnectionStatus('idle');
                resolve(peer);
            });

            // Escuchar conexiones entrantes (modo receptor)
            peer.on('connection', (conn) => {
                console.log('[P2P] Conexión entrante de:', conn.peer);
                handleIncomingConnection(conn);
            });

            peer.on('error', (err) => {
                // Si el ID fijo ya está ocupado (otra pestaña), generar uno nuevo
                if (err.type === 'unavailable-id') {
                    console.warn('[P2P] ID fijo ocupado, generando uno nuevo...');
                    const fallback = new Peer();
                    fallback.on('open', (id) => {
                        setPeerId(id);
                        setConnectionStatus('idle');
                        fallback.on('connection', handleIncomingConnection);
                        peerRef.current = fallback;
                        resolve(fallback);
                    });
                    fallback.on('error', reject);
                } else {
                    console.error('[P2P] Error del Peer:', err);
                    setConnectionStatus('error');
                    reject(err);
                }
            });

            peerRef.current = peer;
        });
    }, [handleIncomingConnection]);

    // ─── Conectar al receptor y enviar datos de lead ──────────────────────────
    const sendLeadData = useCallback((
        remotePeerId: string,
        leadData: LeadPayload,
        file?: File
    ): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!peerRef.current) {
                reject(new Error('Peer no inicializado'));
                return;
            }

            setConnectionStatus('connecting');
            console.log('[P2P] Conectando a receptor:', remotePeerId);

            const conn = peerRef.current.connect(remotePeerId, {
                reliable: true,
                serialization: 'binary',
            });

            const timeout = setTimeout(() => {
                reject(new Error('Timeout: No se pudo conectar al receptor'));
                setConnectionStatus('error');
            }, 15000);

            conn.on('open', async () => {
                clearTimeout(timeout);
                setConnectionStatus('connected');
                console.log('[P2P] Conectado al receptor. Enviando datos...');

                // 1. Enviar datos del lead
                const leadMsg: P2PMessage = { type: 'lead', data: leadData };
                conn.send(leadMsg);

                // 2. Si hay archivo, leerlo y enviarlo
                if (file) {
                    try {
                        const buffer = await file.arrayBuffer();
                        const fileMsg: P2PMessage = {
                            type: 'file',
                            name: file.name,
                            mimeType: file.type || 'application/octet-stream',
                            buffer,
                        };
                        conn.send(fileMsg);
                        console.log('[P2P] Archivo enviado:', file.name);
                    } catch (err) {
                        console.error('[P2P] Error leyendo archivo:', err);
                    }
                }

                // Cerrar después de enviar
                setTimeout(() => {
                    conn.close();
                    resolve();
                }, 1000);
            });

            conn.on('error', (err) => {
                clearTimeout(timeout);
                console.error('[P2P] Error enviando:', err);
                setConnectionStatus('error');
                reject(err);
            });

            connRef.current = conn;
        });
    }, []);

    // ─── Limpiar al desmontar ─────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            if (peerRef.current) {
                peerRef.current.destroy();
                peerRef.current = null;
            }
        };
    }, []);

    return {
        peerId,
        connectionStatus,
        incomingFile,
        incomingLead,
        initializePeer,
        sendLeadData,
        peerRef,
    };
};
