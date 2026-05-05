/**
 * Password Strength Validation
 * Utilidades para validar y medir la fortaleza de contraseñas
 */

export interface PasswordStrength {
    /** Puntuación de 0-5 (0=muy débil, 5=muy fuerte) */
    score: 0 | 1 | 2 | 3 | 4 | 5;
    /** Sugerencias de mejora */
    feedback: string[];
    /** Indicadores de requisitos cumplidos */
    hasMinLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSymbol: boolean;
    isCommon: boolean;
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

// Lista de contraseñas comunes (top 100 más usadas)
const COMMON_PASSWORDS = [
    '123456', 'password', '12345678', 'qwerty', '123456789', '12345', '1234', '111111',
    '1234567', 'dragon', '123123', 'baseball', 'iloveyou', 'trustno1', '1234567890',
    'sunshine', 'master', '123321', '666666', 'photoshop', '1qaz2wsx', 'admin',
    'monkey', 'shadow', '654321', 'qwertyuiop', 'lovely', '7777777', '888888',
    'princess', 'dragon', 'password1', '123qwe', 'football', 'letmein', 'welcome',
    'solo', 'abc123', '121212', 'flower', '000000', 'superman', 'naruto',
    'master', 'freedom', 'whatever', 'qazwsx', 'trustno1', 'jordan',
    'starwars', 'password123', 'hello', 'charlie', 'test', 'computer',
    'michelle', 'michael', 'jessica', 'pepper', '1111', 'zxcvbnm', 'arsenal',
    'joshua', 'maggie', 'thomas', 'ginger', 'hunter', 'chocolate',
    'daniel', 'andrew', 'secret', 'hockey', 'london', 'william',
    'secret', 'summer', 'asdfgh', 'qwerty123', 'ashley', 'matthew',
    'thunder', 'harley', 'liverpool', 'buster', 'samantha', 'jennifer',
    'hannah', 'football1', 'taylor', 'sophie', 'golden', 'diamond',
    'jordan23', 'jackson', 'amanda', 'tigger', 'cookie', 'soccer', 'robert'
];

/**
 * Calcula la fortaleza de una contraseña
 */
export function calculatePasswordStrength(password: string): PasswordStrength {
    const feedback: string[] = [];

    // Requisitos básicos
    const hasMinLength = password.length >= 12;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const isCommon = isCommonPassword(password);

    // Calcular score base
    let score = 0;

    // Longitud
    if (password.length < 8) {
        score = 0;
        feedback.push('Muy corta (mínimo 12 caracteres recomendado)');
    } else if (password.length < 12) {
        score = 1;
        feedback.push('Aumenta la longitud a 12+ caracteres');
    } else if (password.length < 16) {
        score = 2;
    } else {
        score = 3;
    }

    // Complejidad
    const complexityScore = [hasUppercase, hasLowercase, hasNumber, hasSymbol]
        .filter(Boolean).length;

    score = Math.max(score, complexityScore);

    // Penalizaciones
    if (isCommon) {
        score = Math.max(0, score - 2);
        feedback.push('Esta contraseña es muy común y fácil de adivinar');
    }

    // Patrones repetitivos
    if (/(.)\1{2,}/.test(password)) { // ej: "aaa", "111"
        score = Math.max(0, score - 1);
        feedback.push('Evita caracteres repetidos');
    }

    if (/^[0-9]+$/.test(password)) { // Solo números
        score = Math.max(0, score - 2);
        feedback.push('No uses solo números');
    }

    if (/^[a-zA-Z]+$/.test(password)) { // Solo letras
        score = Math.max(0, score - 1);
        feedback.push('Agrega números y símbolos');
    }

    // Secuencias comunes (123, abc, qwerty)
    const sequences = ['123', '234', '345', '456', '567', '678', '789', '890',
        'abc', 'bcd', 'cde', 'def', 'efg', 'fgh',
        'qwe', 'wer', 'ert', 'rty', 'tyu', 'yui', 'uio', 'iop',
        'asd', 'sdf', 'dfg', 'fgh', 'ghj', 'hjk', 'jkl',
        'zxc', 'xcv', 'cvb', 'vbn', 'bnm'];

    const lowerPass = password.toLowerCase();
    if (sequences.some(seq => lowerPass.includes(seq))) {
        score = Math.max(0, score - 1);
        feedback.push('Evita secuencias de teclado');
    }

    // Bonificaciones
    if (password.length >= 20) {
        score = Math.min(5, score + 1);
    }

    if (hasUppercase && hasLowercase && hasNumber && hasSymbol && hasMinLength && !isCommon) {
        score = Math.min(5, score + 1);
    }

    // Feedback específico de requisitos faltantes
    if (!hasUppercase) feedback.push('Agrega al menos una mayúscula');
    if (!hasLowercase) feedback.push('Agrega al menos una minúscula');
    if (!hasNumber) feedback.push('Agrega al menos un número');
    if (!hasSymbol) feedback.push('Agrega al menos un símbolo (!@#$%&*)');

    // Si no hay feedback, dar uno positivo
    if (feedback.length === 0) {
        if (score >= 4) {
            feedback.push('¡Excelente contraseña! Muy segura.');
        } else if (score >= 3) {
            feedback.push('Buena contraseña, considera hacerla más larga.');
        }
    }

    return {
        score: score as 0 | 1 | 2 | 3 | 4 | 5,
        feedback,
        hasMinLength,
        hasUppercase,
        hasLowercase,
        hasNumber,
        hasSymbol,
        isCommon
    };
}

/**
 * Valida que una contraseña cumpla con los requisitos mínimos
 */
export function validatePasswordComplexity(password: string, userEmail?: string): ValidationResult {
    const errors: string[] = [];

    // Requisitos obligatorios
    if (password.length < 12) {
        errors.push('La contraseña debe tener al menos 12 caracteres');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Debe contener al menos una letra mayúscula');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Debe contener al menos una letra minúscula');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Debe contener al menos un número');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Debe contener al menos un símbolo especial');
    }

    if (isCommonPassword(password)) {
        errors.push('Esta contraseña es demasiado común, elige otra');
    }

    // No debe contener el email del usuario
    if (userEmail && password.toLowerCase().includes(userEmail.split('@')[0].toLowerCase())) {
        errors.push('La contraseña no debe contener tu nombre de usuario o email');
    }

    // No debe ser puramente numérica o alfabética
    if (/^[0-9]+$/.test(password)) {
        errors.push('No uses solo números');
    }

    if (/^[a-zA-Z]+$/.test(password)) {
        errors.push('Combina letras, números y símbolos');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Verifica si una contraseña está en la lista de contraseñas comunes
 */
export function isCommonPassword(password: string): boolean {
    const lowerPass = password.toLowerCase();
    return COMMON_PASSWORDS.some(common =>
        lowerPass === common ||
        lowerPass.includes(common) && common.length > 5
    );
}

/**
 * Genera descripción legible del nivel de fortaleza
 */
export function getStrengthLabel(score: number): {
    label: string;
    color: string;
    bgColor: string;
} {
    switch (score) {
        case 0:
            return { label: 'Muy Débil', color: 'text-red-700', bgColor: 'bg-red-500' };
        case 1:
            return { label: 'Débil', color: 'text-orange-700', bgColor: 'bg-orange-500' };
        case 2:
            return { label: 'Regular', color: 'text-yellow-700', bgColor: 'bg-yellow-500' };
        case 3:
            return { label: 'Buena', color: 'text-blue-700', bgColor: 'bg-blue-500' };
        case 4:
            return { label: 'Fuerte', color: 'text-emerald-700', bgColor: 'bg-emerald-500' };
        case 5:
            return { label: 'Muy Fuerte', color: 'text-green-700', bgColor: 'bg-green-600' };
        default:
            return { label: 'Desconocida', color: 'text-gray-700', bgColor: 'bg-gray-500' };
    }
}
