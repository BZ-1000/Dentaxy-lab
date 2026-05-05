/**
 * Biometric Lock System
 * Gestión del bloqueo biométrico del panel admin
 */

export type LockReason = 'manual' | 'inactivity' | 'policy' | 'session_expired';

export interface LockState {
    isLocked: boolean;
    reason: LockReason | null;
    lockedAt: number | null;
    lastActivity: number;
}

const LOCK_STATE_KEY = 'admin_panel_lock_state';
const INACTIVITY_TIMEOUT_KEY = 'admin_panel_inactivity_timeout';

/**
 * Obtiene el estado actual del bloqueo
 */
export function getLockState(): LockState {
    const stored = localStorage.getItem(LOCK_STATE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            // Si falla el parsing, retornar estado desbloqueado
        }
    }

    return {
        isLocked: false,
        reason: null,
        lockedAt: null,
        lastActivity: Date.now()
    };
}

/**
 * Guarda el estado del bloqueo
 */
function saveLockState(state: LockState): void {
    localStorage.setItem(LOCK_STATE_KEY, JSON.stringify(state));

    // Disparar evento personalizado para que los componentes se enteren
    window.dispatchEvent(new CustomEvent('panel-lock-change', { detail: state }));
}

/**
 * Bloquea el panel inmediatamente
 */
export function lockPanel(reason: LockReason = 'manual'): void {
    const state: LockState = {
        isLocked: true,
        reason,
        lockedAt: Date.now(),
        lastActivity: Date.now()
    };

    saveLockState(state);
    console.log('🔒 Panel bloqueado:', reason);
}

/**
 * Desbloquea el panel tras autenticación exitosa
 */
export function unlockPanel(): void {
    const state: LockState = {
        isLocked: false,
        reason: null,
        lockedAt: null,
        lastActivity: Date.now()
    };

    saveLockState(state);
    console.log('🔓 Panel desbloqueado');
}

/**
 * Actualiza el timestamp de última actividad
 */
export function updateLastActivity(): void {
    const state = getLockState();
    if (!state.isLocked) {
        state.lastActivity = Date.now();
        saveLockState(state);
    }
}

/**
 * Verifica si el panel está bloqueado
 */
export function isLocked(): boolean {
    return getLockState().isLocked;
}

/**
 * Obtiene el tiempo transcurrido desde que se bloqueó (en ms)
 */
export function getTimeSinceLock(): number {
    const state = getLockState();
    if (!state.isLocked || !state.lockedAt) return 0;
    return Date.now() - state.lockedAt;
}

/**
 * Obtiene el tiempo transcurrido desde la última actividad (en ms)
 */
export function getTimeSinceLastActivity(): number {
    const state = getLockState();
    return Date.now() - state.lastActivity;
}

/**
 * Configura el timeout de inactividad (en ms)
 */
export function setInactivityTimeout(timeoutMs: number): void {
    localStorage.setItem(INACTIVITY_TIMEOUT_KEY, timeoutMs.toString());
}

/**
 * Obtiene el timeout de inactividad configurado (en ms)
 * Por defecto: 5 minutos
 */
export function getInactivityTimeout(): number {
    const stored = localStorage.getItem(INACTIVITY_TIMEOUT_KEY);
    return stored ? parseInt(stored) : 5 * 60 * 1000; // 5 minutos por defecto
}

/**
 * Verifica si debe bloquearse por inactividad
 * Retorna true si el tiempo desde última actividad excede el timeout
 */
export function shouldLockByInactivity(): boolean {
    const timeout = getInactivityTimeout();
    if (timeout === 0) return false; // Si timeout es 0, inactividad está deshabilitada

    const timeSinceActivity = getTimeSinceLastActivity();
    return timeSinceActivity >= timeout;
}

/**
 * Inicia el monitoreo de inactividad
 * Retorna función para detener el monitoreo
 */
export function startInactivityMonitor(onLock?: () => void): () => void {
    const checkInterval = setInterval(() => {
        if (!isLocked() && shouldLockByInactivity()) {
            lockPanel('inactivity');
            if (onLock) onLock();
        }
    }, 10000); // Verificar cada 10 segundos

    // Retornar función para limpiar
    return () => clearInterval(checkInterval);
}

/**
 * Registra eventos de actividad del usuario
 */
export function registerActivityListeners(): () => void {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handler = () => updateLastActivity();

    events.forEach(event => {
        document.addEventListener(event, handler, { passive: true });
    });

    // Retornar función de limpieza
    return () => {
        events.forEach(event => {
            document.removeEventListener(event, handler);
        });
    };
}
