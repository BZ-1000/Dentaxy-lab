import { GoogleGenerativeAI } from "@google/generative-ai";

// Prompt del sistema para moldear la personalidad de la IA como el CTO/Guía de Dentaxy
const SYSTEM_PROMPT = `
Actúas como Antigravity, el CTO y Agente Guía de Ventas inteligente de Dentaxy.com. 
Tu misión es presentar de forma persuasiva, empática y tecnológica las soluciones de la plataforma Dentaxy.
Habla de los siguientes productos según corresponda:
- Dentaxy.com: La plataforma principal para odontólogos profesionales y especialistas. Reemplaza el papel por expedientes eficientes.
- Dentaxy Seed: Versión académica y de clínicas universitarias (como la UAZ y CROID) para estudiantes y profesores con control de correcciones docente.
- Dentaxy Shop: Módulo de e-commerce integrado para comprar insumos dentales.

Pilares técnicos clave de Dentaxy (debes destacarlos con orgullo):
1. Soberanía de Datos: Integramos el Google Drive personal del odontólogo. No guardamos historiales médicos en bases de datos propietarias de Dentaxy. Los datos son 100% del dentista y el paciente.
2. Privacidad Local y Costo Cero: Nuestra "IA" de redacción de historias clínicas es una simulación local determinista en el navegador. Cero llamadas a APIs de OpenAI o Claude. Cero costos de consumo y privacidad médica absoluta.
3. Visor 3D Nactivo: Contamos con un visor DICOM/CBCT y STL fluido que corre directo en el navegador de tu computadora o móvil.

Mantén tus respuestas estrictamente en español, breves, persuasivas, amigables y enfocadas a guiar al usuario a probar o entender la plataforma. Usa formato markdown ligero.
`;

// Respuestas locales estructuradas en caso de fallback
const FALLBACK_RESPONSES = {
  bienvenida: `¡Hola! Qué gusto saludarte. Soy tu asistente tecnológico de Dentaxy. Veo que has completado el diagnóstico. ¿Te gustaría saber más sobre cómo funciona la integración con Google Drive, la redacción médica local con costo cero, o el visor de archivos 3D/STL? Dime en qué puedo ayudarte hoy.`,
  
  seed: `**Dentaxy Seed** es nuestra solución enfocada en la academia y clínicas universitarias (como en la UAZ). Permite a los alumnos llenar sus historias clínicas de manera digital, estructurada y ágil, mientras que los profesores pueden revisar, corregir y calificar las entregas de manera centralizada. Elimina el desorden de carpetas físicas y las hojas perdidas de una vez por todas.`,
  
  drive: `En **Dentaxy** valoramos tu soberanía digital. A diferencia de otros softwares que guardan tus historias clínicas en servidores cerrados e inaccesibles, Dentaxy conecta con tu propio **Google Drive**. Cada expediente se guarda en tu nube personal como un archivo seguro y estructurado. Tú eres dueño absoluto de tu información y la de tus pacientes, cumpliendo con las leyes de salud de forma nativa.`,
  
  privacidad: `Nuestra herramienta de **Redacción Médica IA** funciona mediante una simulación de redacción local en tu navegador. **No enviamos los datos clínicos a APIs de terceros** (como OpenAI o Claude). Esto nos permite garantizar privacidad del 100% para los historiales médicos, respuesta instantánea sin lags de red y costo de generación de exactamente cero pesos.`,
  
  "3d": `Contamos con un **Visualizador Odontológico 3D (DICOM y STL)** integrado directamente en el navegador. Puedes cargar tomografías computarizadas (CBCT) o archivos STL de escaneos intraorales y manipular cortes axiales, sagitales o reconstrucciones tridimensionales en tiempo real, incluso desde un teléfono móvil, sin necesidad de instalar softwares pesados ni requerir tarjetas gráficas de gama alta.`,
  
  shop: `**Dentaxy Shop** es nuestra tienda integrada de insumos dentales. Te permite reabastecer tu consultorio con material de alta calidad a precios competitivos, pidiendo directamente desde la misma plataforma donde gestionas a tus pacientes para automatizar y ahorrar tiempo.`,
  
  general: `Entendido. Dentaxy está diseñado bajo el principio de que menos es más: interfaces ultra-simples para que los profesionales de la salud no pierdan tiempo lidiando con tecnologías complejas. Si gustas, puedes preguntarme sobre:
- La simulación local de redacción clínica.
- Cómo funciona la integración con tu propio Google Drive.
- El visor nativo DICOM/STL en 3D.
- La versión académica Dentaxy Seed.`
};

/**
 * Función que analiza el mensaje del usuario y devuelve una respuesta simulada de alta calidad
 */
function getLocalAgentResponse(message: string, profile: { role?: string; currentSystem?: string; priority?: string }): string {
  const cleanMsg = message.toLowerCase();
  
  if (cleanMsg.includes("hola") || cleanMsg.includes("saludo") || cleanMsg.includes("bienvenida") || cleanMsg.includes("buenos") || cleanMsg.includes("buenas")) {
    let resp = `¡Hola! Un placer saludarte. `;
    if (profile.role === "estudiante" || profile.role === "universidad") {
      resp += `Como parte del sector académico, te recomiendo explorar **Dentaxy Seed** para la gestión de prácticas clínicas y docencia. `;
    } else if (profile.role === "odontologo" || profile.role === "clinica") {
      resp += `Como odontólogo profesional, te interesará ver cómo **Dentaxy** centraliza tus expedientes directamente en tu Google Drive personal con seguridad máxima. `;
    }
    resp += `\n\n¿Tienes alguna duda sobre la integración de Google Drive, la redacción local de expedientes, o el visor 3D DICOM/STL?`;
    return resp;
  }
  
  if (cleanMsg.includes("seed") || cleanMsg.includes("estudiante") || cleanMsg.includes("universidad") || cleanMsg.includes("escuela") || cleanMsg.includes("uaz") || cleanMsg.includes("alumno") || cleanMsg.includes("docente") || cleanMsg.includes("profesor")) {
    return FALLBACK_RESPONSES.seed;
  }
  
  if (cleanMsg.includes("drive") || cleanMsg.includes("google") || cleanMsg.includes("guardar") || cleanMsg.includes("almacenar") || cleanMsg.includes("nube") || cleanMsg.includes("servidor") || cleanMsg.includes("soberania") || cleanMsg.includes("propietaria")) {
    return FALLBACK_RESPONSES.drive;
  }
  
  if (cleanMsg.includes("privacidad") || cleanMsg.includes("seguridad") || cleanMsg.includes("api") || cleanMsg.includes("local") || cleanMsg.includes("openai") || cleanMsg.includes("claude") || cleanMsg.includes("chatgpt") || cleanMsg.includes("redaccion") || cleanMsg.includes("diagnostico") || cleanMsg.includes("historia") || cleanMsg.includes("expediente")) {
    return FALLBACK_RESPONSES.privacidad;
  }
  
  if (cleanMsg.includes("3d") || cleanMsg.includes("dicom") || cleanMsg.includes("stl") || cleanMsg.includes("tomografia") || cleanMsg.includes("radiografia") || cleanMsg.includes("escaner") || cleanMsg.includes("visor") || cleanMsg.includes("cbct")) {
    return FALLBACK_RESPONSES["3d"];
  }
  
  if (cleanMsg.includes("shop") || cleanMsg.includes("insumo") || cleanMsg.includes("comprar") || cleanMsg.includes("material") || cleanMsg.includes("tienda") || cleanMsg.includes("deposito")) {
    return FALLBACK_RESPONSES.shop;
  }

  // Generar respuesta personalizada por prioridad elegida
  if (profile.priority === "redaccion") {
    return `Veo que tu prioridad es agilizar la redacción clínica. En Dentaxy contamos con plantillas inteligentes adaptativas de redacción local. ¿Deseas que te explique cómo ahorramos tiempo en cada diagnóstico sin enviar datos al exterior?`;
  } else if (profile.priority === "privacidad") {
    return `Considerando que priorizas la soberanía de los datos, te recuerdo que en Dentaxy guardamos la información clínica directamente en tu Google Drive personal, asegurando privacidad médica absoluta. ¿Te gustaría saber cómo se configura la firma electrónica avanzada?`;
  } else if (profile.priority === "tecnologia") {
    return `Dado tu interés en el visor 3D nativo, puedes subir archivos DICOM (tomografías) o STL (modelos 3D de ortodoncia/prótesis) y manipularlos en tiempo real sin lags. ¿Tienes algún archivo de prueba que quieras procesar?`;
  }
  
  return FALLBACK_RESPONSES.general;
}

interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

/**
 * Función principal para interactuar con la IA de Dentaxy
 * Intenta conectar con Gemini a través del API Key de Google Cloud y, si no es posible, usa el fallback local.
 */
export async function chatWithAgent(
  message: string, 
  profile: { role?: string; currentSystem?: string; priority?: string },
  chatHistory: ChatMessage[]
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "tu_clave_de_api_aqui") {
    // Si no hay API Key configurada, respondemos de manera local e instantánea
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getLocalAgentResponse(message, profile));
      }, 600); // Pequeña latencia para simular el procesamiento de la IA
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Usamos gemini-1.5-flash por velocidad y eficiencia de costos
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT + `\nEl perfil actual del usuario es: 
      - Rol: ${profile.role || "No especificado"}
      - Sistema que usa hoy: ${profile.currentSystem || "No especificado"}
      - Prioridad en consulta: ${profile.priority || "No especificado"}
      Adapta tus explicaciones a este perfil cuando sea posible.`
    });

    // Mapear historial en formato compatible con Gemini SDK
    const formattedHistory = chatHistory.map(item => ({
      role: item.role,
      parts: [{ text: item.parts[0].text }]
    }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.warn("Error de conexión con Gemini, activando fallback local:", error);
    return getLocalAgentResponse(message, profile);
  }
}
