import { AnthropicVertex } from '@anthropic-ai/vertex-sdk';
import { readFileSync, existsSync, writeFileSync } from 'fs';

// Capturar argumentos (todos menos los de bun/node)
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log("\n📘 USO OPTIMIZADO DEL ASISTENTE:");
  console.log("okey claude <archivo_a_editar> [archivos_contexto...] \"Tu instrucción final\"");
  console.log("\nEjemplo 1 (Un archivo): okey claude src/App.tsx \"Refactoriza esto\"");
  console.log("Ejemplo 2 (Con contexto): okey claude src/Boton.tsx src/tipos.ts \"Agrega el botón usando los tipos\"\n");
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

const client = new AnthropicVertex({
  region: 'us-east5',
  projectId: 'project-1cdd7dad-a253-4e5a-ab3',
});

async function run() {
  try {
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

    console.log(`\n🚀 Claude está analizando y reescribiendo: ${targetFile} ...`);
    
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5@20250929', 
      max_tokens: 4096,
      temperature: 0.1, // Temperatura súper baja para que no "alucine" ni invente cosas, código puramente determinista
      system: `Eres el CTO autónomo de Dentaxy. Tu objetivo es editar código de la forma más rápida y barata en tokens.
Reglas estrictas:
1. SOLO devuelve el código final completo del archivo solicitado.
2. CERO EXPLICACIONES. No digas "Aquí tienes", "Claro", "Hecho". Cada palabra cuesta tokens.
3. Envuelve tu código en UN SOLO bloque markdown (\`\`\` ... \`\`\`).
4. Recrea el archivo completo (incluyendo los imports originales que se mantienen) para poder sobrescribir directo.
5. Usa los archivos de referencia solo para entender el entorno, NO los modifiques en tu respuesta.`,
      messages: [{ role: 'user', content: finalPrompt }],
    });

    if (response.content[0].type === 'text') {
      const output = response.content[0].text;
      
      // Buscar y extraer ÚNICAMENTE el bloque de código usando Regex
      const match = output.match(/```[a-z]*\n([\s\S]*?)```/);
      
      if (match && match[1]) {
        // Sobrescribir directamente el archivo en el sistema de Dentaxy
        writeFileSync(targetFile, match[1].trim() + '\n', 'utf-8');
        console.log(`✅ ¡Magia pura! El archivo ${targetFile} se sobrescribió automáticamente.`);
      } else {
        console.warn("⚠️ Claude no devolvió un bloque de código válido. Respuesta cruda recibida:");
        console.log(output);
      }
    }
  } catch (error: any) {
    console.error("❌ Ocurrió un error con Vertex AI:");
    console.error(error.error ? JSON.stringify(error.error, null, 2) : error);
  }
}

run();
