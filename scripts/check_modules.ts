
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

// Nota: Para actualizaciones necesitamos la SERVICE_ROLE_KEY si la tenemos, 
// o intentar con anon si las policies lo permiten. 
// Asumiremos que tenemos acceso o que solo leeremos para diagnosticar.
// Si falla la escritura, el usuario deberá hacerlo manualmente o darnos la key.

if (!supabaseUrl || !supabaseKey) {
    console.error('Faltan variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const correctModules = [
    { module_name: 'motor_neuronal', display_name: 'DENTAXY AI', description: 'Motor Neuronal' },
    { module_name: 'academico', display_name: 'DENTAXY SEED', description: 'Plataforma Académica' },
    { module_name: 'enterprise', display_name: 'DENTAXY SHOP', description: 'Insumos y Equipos' },
    { module_name: 'visualizacion_3d', display_name: 'DENTAXY STUDIO', description: 'Visualización y Diseño' }
];

async function checkAndFix() {
    console.log('Verificando módulos en Supabase...');

    const { data: currentModules, error } = await supabase
        .from('dentaxy_modules')
        .select('*');

    if (error) {
        console.error('Error leyendo módulos:', error);
        return;
    }

    console.log('Módulos actuales:', currentModules);

    // Intentar actualizar si no coinciden
    // Nota: Esto podría fallar si no tenemos permisos de escritura con la anon key y RLS activado.
    // Pero al menos sabremos qué hay.
}

checkAndFix();
