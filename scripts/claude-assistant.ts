import { AnthropicVertex } from '@anthropic-ai/vertex-sdk';
import { readFileSync, existsSync, writeFileSync } from 'fs';

// ============================================================
// CONFIGURACIÓN DE VERTEX AI — DENTAXY
// Proyecto: project-1cdd7dad-a253-4e5a-ab3
// Documentación cuotas: https://cloud.google.com/vertex-ai/generative-ai/docs/learn/model-versions
// ============================================================

const PROJECT_ID = 'project-1cdd7dad-a253-4e5a-ab3';

// Modelos en orden de preferencia (el más potente primero)
// Si el primer modelo no está disponible en la cuota, intenta el siguiente
const MODELOS = [
  { region: 'us-east5',   model: 'claude-sonnet-4-6' }, // Claude Sonnet 4.6 — El más reciente
  { region: 'us-central1', model: 'claude-sonnet-4-6' }, // Fallback región central
  { region: 'us-east5',   model: 'claude-sonnet-4-5@20250929' }, // Claude Sonnet 4.5
  { region: 'us-central1', model: 'claude-sonnet-4-5@20250929' }, // Fallback 4.5 central
];

// Capturar argumentos (todos menos los de bun/node)
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log("\n📘 USO DEL ASISTENTE CLAUDE — DENTAXY:");
  console.log("  bun run scripts/dev-assistant.ts <archivo_a_editar> [archivos_contexto...] \"Tu instrucción\"");
  console.log("\n  Alias corto (agregar a .bashrc):");
  console.log("  claude src/App.tsx \"Refactoriza esto\"");
  console.log("  claude src/Boton.tsx src/tipos.ts \"Agrega el botón usando los tipos\"\n");
  process.exit(1);
}

// El último argumento siempre es la instrucción en texto
const instruction = args.pop()!;
// El primer argumento es el archivo que se va a sobrescribir
const targetFile = args[0];
// Todo lo que quede en medio son archivos de lectura (contexto)
const contextFiles = args.slice(1);

if (!existsSync(targetFile)) {
  console.error(`❌ Error: El archivo destino '${targetFile}' no existe.`);
  process.exit(1);
}

async function runConModelo(region: string, model: string): Promise<boolean> {
  const client = new AnthropicVertex({ region, projectId: PROJECT_ID });

  const targetContent = readFileSync(targetFile, 'utf-8');

  let promptContext = "";
  if (contextFiles.length > 0) {
    promptContext += "--- ARCHIVOS DE REFERENCIA (Solo lectura, no los modifiques) ---\n";
    for (const file of contextFiles) {
      if (existsSync(file)) {
        promptContext += `\nArchivo: ${file}\n\`\`\`\n${readFileSync(file, 'utf-8')}\n\`\`\`\n`;
      }
    }
  }

  const finalPrompt = `${promptContext}\n--- ARCHIVO A EDITAR Y SOBRESCRIBIR (${targetFile}) ---\n\`\`\`\n${targetContent}\n\`\`\`\n\nINSTRUCCIÓN DEL USUARIO: "${instruction}"`;

  const response = await client.messages.create({
    model,
    max_tokens: 8192,
    temperature: 0.1,
    system: `Eres el CTO autónomo de Dentaxy Technologies. Tu objetivo es editar código de la forma más precisa y eficiente en tokens.
Reglas estrictas:
1. SOLO devuelve el código final completo del archivo solicitado.
2. CERO EXPLICACIONES. No digas "Aquí tienes", "Claro", "Hecho". Cada palabra cuesta tokens.
3. Envuelve tu código en UN SOLO bloque markdown (\`\`\` ... \`\`\`).
4. Recrea el archivo completo (incluyendo los imports originales que se mantienen) para poder sobrescribir directo.
5. Usa los archivos de referencia solo para entender el entorno, NO los modifiques en tu respuesta.
6. El proyecto usa React + TypeScript + Vite. Nunca quites tipos o importaciones necesarios.`,
    messages: [{ role: 'user', content: finalPrompt }],
  });

  if (response.content[0].type === 'text') {
    const output = response.content[0].text;
    const match = output.match(/```[a-z]*\n([\s\S]*?)```/);

    if (match && match[1]) {
      writeFileSync(targetFile, match[1].trim() + '\n', 'utf-8');
      console.log(`✅ ¡Listo! ${targetFile} sobrescrito correctamente.`);
      console.log(`   Modelo usado: ${model} | Región: ${region}`);
      return true;
    } else {
      console.warn("⚠️  Claude no devolvió un bloque de código. Respuesta cruda:");
      console.log(output);
      return true; // No fue error de cuota, fue respuesta inesperada
    }
  }
  return false;
}

async function run() {
  console.log(`\n🚀 Claude (Vertex AI) procesando: ${targetFile} ...`);

  for (const { region, model } of MODELOS) {
    try {
      const exitoso = await runConModelo(region, model);
      if (exitoso) return;
    } catch (error: any) {
      const codigo = error?.error?.code || error?.status;
      const mensaje = error?.error?.message || error?.message || '';

      // Si es 404 o 429, intentar el siguiente modelo
      if (codigo === 404 || codigo === 429 ||
          mensaje.includes('not found') ||
          mensaje.includes('Quota exceeded') ||
          mensaje.includes('RESOURCE_EXHAUSTED')) {
        console.warn(`⚠️  [${model}@${region}] No disponible (${codigo}). Probando siguiente...`);
        continue;
      }

      // Cualquier otro error, mostrar y detener
      console.error("❌ Error con Vertex AI:");
      console.error(error.error ? JSON.stringify(error.error, null, 2) : error.message);
      process.exit(1);
    }
  }

  // Si llegamos aquí, todos los modelos fallaron
  console.error("\n❌ NINGÚN MODELO DE CLAUDE DISPONIBLE.");
  console.error("   Posibles causas:");
  console.error("   1. El acceso a Claude NO está habilitado en tu proyecto GCP.");
  console.error("   2. La cuota de RPM está en 0 (solicitar aumento en consola).");
  console.error("\n   🔧 Solución (abrir en navegador):");
  console.error("   https://console.cloud.google.com/vertex-ai/publishers/anthropic/model-garden/claude-3-5-sonnet?project=" + PROJECT_ID);
  console.error("   → Clic en 'Enable' → 'Request quota increase' si aparece.\n");
  process.exit(1);
}

run();
