import { GoogleAuth } from 'google-auth-library';
import { readFileSync, existsSync, writeFileSync } from 'fs';

// ============================================================
// CONFIGURACIÓN DE VERTEX AI — DENTAXY (GEMINI)
// Proyecto: project-1cdd7dad-a253-4e5a-ab3
// ============================================================

const PROJECT_ID = 'project-1cdd7dad-a253-4e5a-ab3';
const LOCATION = 'global';

// Modelos en orden de preferencia
const MODELOS = [
  'gemini-3.1-pro-preview',
  'gemini-1.5-pro-002', 
  'gemini-1.5-pro-001'
];

// Capturar argumentos
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log("\n📘 USO DEL ASISTENTE GEMINI — DENTAXY:");
  console.log("  bun run scripts/gemini-assistant.ts <archivo_a_editar> [archivos_contexto...] \"Tu instrucción\"");
  console.log("\n  Alias sugerido:");
  console.log("  gemini src/App.tsx \"Refactoriza esto\"\n");
  process.exit(1);
}

const instruction = args.pop()!;
const targetFile = args[0];
const contextFiles = args.slice(1);

if (!existsSync(targetFile)) {
  console.error(`❌ Error: El archivo destino '${targetFile}' no existe.`);
  process.exit(1);
}

async function runConModelo(modelId: string, accessToken: string): Promise<boolean> {
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

  // El endpoint cambia si es location 'global' o específico, pero Gemini 3.1 Pro usa 'global'
  const url = `https://aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${modelId}:generateContent`;

  const requestBody = {
    contents: [
      { role: 'user', parts: [{ text: finalPrompt }] }
    ],
    systemInstruction: {
      role: 'system',
      parts: [{ text: `Eres el CTO autónomo de Dentaxy Technologies. Tu objetivo es editar código de la forma más precisa y eficiente.
Reglas estrictas:
1. SOLO devuelve el código final completo del archivo solicitado.
2. CERO EXPLICACIONES. No digas "Aquí tienes", "Claro", "Hecho". Cada palabra cuesta tokens.
3. Envuelve tu código en UN SOLO bloque markdown (\`\`\` ... \`\`\`).
4. Recrea el archivo completo (incluyendo los imports originales que se mantienen) para poder sobrescribir directo.
5. Usa los archivos de referencia solo para entender el entorno, NO los modifiques en tu respuesta.
6. El proyecto usa React + TypeScript + Vite. Nunca quites tipos o importaciones necesarios.` }]
    },
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 0.1,
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`HTTP ${response.status}: ${err}`);
  }

  const json = await response.json();
  const output = json.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (output) {
    const match = output.match(/```[a-z]*\n([\s\S]*?)```/);

    if (match && match[1]) {
      writeFileSync(targetFile, match[1].trim() + '\n', 'utf-8');
      console.log(`✅ ¡Listo! ${targetFile} sobrescrito correctamente.`);
      console.log(`   Modelo usado: ${modelId} | Región: ${LOCATION}`);
      return true;
    } else {
      console.warn("⚠️ Gemini no devolvió un bloque de código válido. Respuesta cruda:");
      console.log(output);
      return true; 
    }
  }
  return false;
}

async function run() {
  const BLUE = "\x1b[34m"; // Azul
  const BOLD = "\x1b[1m";
  const RESET = "\x1b[0m";
  
  console.log(`${BLUE}${BOLD}
   GGGGGGGGGG  
  GG        GG 
 GG          GG
 GG            
 GG    GGGGGGGG
 GG          GG
  GG        GG 
   GGGGGGGGGG  ${RESET}`);

  console.log(`\n🚀 ${BLUE}Gemini 3.1 Pro${RESET} procesando: ${targetFile} ...`);

  let accessToken = "";
  try {
    const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    if (!tokenResponse.token) throw new Error("No token");
    accessToken = tokenResponse.token;
  } catch (error) {
    console.error("❌ Error de Autenticación de Google Cloud (GCP). Revisa tus credenciales.");
    process.exit(1);
  }

  for (const model of MODELOS) {
    try {
      const exitoso = await runConModelo(model, accessToken);
      if (exitoso) return;
    } catch (error: any) {
      const mensaje = error?.message || '';
      
      if (mensaje.includes('not found') || mensaje.includes('Quota') || mensaje.includes('404')) {
        console.warn(`⚠️  [${model}] No disponible. Probando siguiente...`);
        continue;
      }

      console.error(`❌ Error con Vertex AI [${model}]:`);
      console.error(mensaje);
      // No salir en caso de error HTTP para intentar el siguiente modelo
    }
  }

  console.error("\n❌ NINGÚN MODELO DE GEMINI DISPONIBLE.");
  process.exit(1);
}

run();
