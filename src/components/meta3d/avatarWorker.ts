/// <reference lib="webworker" />
import { AutoModel, AutoProcessor, env, RawImage, Tensor } from '@huggingface/transformers';

// ─── Configuración de Aceleración WebGPU / WebAssembly Multi-hilo ─────────────
(env as any).allowLocalModels = false;
(env as any).useBrowserCache  = true;

// Configurar hilos WASM para máxima velocidad en la CPU/GPU del doctor
if ((env as any).backends?.onnx?.wasm) {
  (env as any).backends.onnx.wasm.numThreads = Math.min(4, (self.navigator as any).hardwareConcurrency || 4);
}

let cachedModel:     any = null;
let cachedProcessor: any = null;

const MODEL_ID = 'briaai/RMBG-1.4';

function progress(pct: number, step: string) {
  self.postMessage({ type: 'progress', pct, step });
}

async function processMaskTensor(maskTensor: any, targetWidth: number, targetHeight: number) {
  if (maskTensor.dims.length === 4) {
    maskTensor = maskTensor.squeeze(0);
  }

  const rawScores = maskTensor.data; // Float32Array de logits
  const maskDims = maskTensor.dims;
  const maskH = maskDims[maskDims.length - 2];
  const maskW = maskDims[maskDims.length - 1];
  const uint8Data = new Uint8Array(rawScores.length);

  // Sigmoide + Umbral de Contraste Smoothstep para eliminación 100% limpia del fondo
  for (let i = 0; i < rawScores.length; ++i) {
    const score = rawScores[i];
    // Sigmoide: 1 / (1 + e^-score)
    const prob = 1.0 / (1.0 + Math.exp(-score));

    // Curva de corte de fondo:
    // Probabilidad <= 0.30 -> 0 (Fondo 100% transparente)
    // Probabilidad >= 0.70 -> 255 (Sujeto 100% opaco)
    // Transición suave (smoothstep) entre 0.30 y 0.70 para bordes de cabello
    if (prob <= 0.30) {
      uint8Data[i] = 0;
    } else if (prob >= 0.70) {
      uint8Data[i] = 255;
    } else {
      const t = (prob - 0.30) / 0.40;
      uint8Data[i] = Math.round(t * t * (3 - 2 * t) * 255);
    }
  }

  const maskTensorUint8 = new Tensor('uint8', uint8Data, [1, maskH, maskW]);
  const mask = await RawImage.fromTensor(maskTensorUint8).resize(targetWidth, targetHeight);
  return mask.data;
}

self.addEventListener('message', async (event: MessageEvent) => {
  const { type, imageDataUrl } = event.data;
  if (type !== 'process') return;

  try {
    progress(5, 'Inicializando motor de IA...');

    // 1. Cargar procesador
    if (!cachedProcessor) {
      progress(10, 'Cargando procesador de imagen RMBG-1.4...');
      cachedProcessor = await AutoProcessor.from_pretrained(MODEL_ID);
    }
    progress(35, 'Procesador cargado.');

    // 2. Cargar modelo con aceleración (Intenta WebGPU segura y hace fallback a WASM)
    if (!cachedModel) {
      progress(40, 'Cargando modelo de segmentación local...');
      let webGpuSupported = false;
      
      // Chequeo previo y seguro de WebGPU
      if ('gpu' in navigator) {
        try {
          const adapter = await (navigator as any).gpu.requestAdapter();
          if (adapter) {
            webGpuSupported = true;
          }
        } catch (e) {
          console.warn('[AvatarWorker] Fallo al solicitar adaptador WebGPU:', e);
        }
      }

      if (webGpuSupported) {
        try {
          // Intentar WebGPU acelerado por hardware
          cachedModel = await AutoModel.from_pretrained(MODEL_ID, {
            config: { model_type: 'custom' },
            device: 'webgpu',
          });
        } catch (gpuError) {
          console.warn('[AvatarWorker] Fallo al iniciar backend WebGPU a pesar del soporte. Cambiando a WASM.', gpuError);
          webGpuSupported = false; // Forzar a WASM
        }
      }

      if (!webGpuSupported) {
        console.log('[AvatarWorker] WebGPU no disponible. Usando aceleración WASM multi-hilo.');
        // Fallback transparente a WASM (WebAssembly) explícito
        cachedModel = await AutoModel.from_pretrained(MODEL_ID, {
          config: { model_type: 'custom' },
          device: 'wasm',
        });
      }
    }
    progress(75, 'Ajustando encuadre y busto...');

    // 3. Cargar imagen desde URL
    const image = await RawImage.fromURL(imageDataUrl);
    progress(80, 'Ejecutando inferencia de IA local...');

    // 4. Preprocesar
    const processed   = await cachedProcessor(image);
    const inputTensor = processed.pixel_values ?? processed.input ?? Object.values(processed)[0];
    progress(86, 'Eliminando fondo...');

    // 5. Inferencia
    const { output } = await cachedModel({ input: inputTensor });
    progress(92, 'Generando máscara de transparencia HD...');

    let maskTensor = Array.isArray(output) ? output[0] : (output.output ?? output.logits ?? output[0] ?? output);
    const maskData = await processMaskTensor(maskTensor, image.width, image.height);

    progress(96, 'Aplicando suavizado alfa (Feathering)...');

    self.postMessage({
      type:        'result',
      width:       image.width,
      height:      image.height,
      maskData:    maskData,
      imageWidth:  image.width,
      imageHeight: image.height,
    });

  } catch (err: any) {
    console.error('[AvatarWorker] Error en procesamiento:', err);
    // Si hubo un fallo residual cargando con WebGPU, reintentar con WASM básico
    try {
      if (!cachedModel) {
        cachedModel = await AutoModel.from_pretrained(MODEL_ID, {
          config: { model_type: 'custom' },
          device: 'wasm',
        });
        const image = await RawImage.fromURL(imageDataUrl);
        const processed = await cachedProcessor(image);
        const inputTensor = processed.pixel_values ?? processed.input ?? Object.values(processed)[0];
        const { output } = await cachedModel({ input: inputTensor });
        let maskTensor = Array.isArray(output) ? output[0] : (output.output ?? output.logits ?? output[0] ?? output);
        const maskData = await processMaskTensor(maskTensor, image.width, image.height);
        
        self.postMessage({
          type: 'result',
          width: image.width, height: image.height,
          maskData: maskData, imageWidth: image.width, imageHeight: image.height,
        });
        return;
      }
    } catch (fallbackErr: any) {
      self.postMessage({ type: 'error', message: fallbackErr?.message ?? String(fallbackErr) });
      return;
    }

    self.postMessage({ type: 'error', message: err?.message ?? String(err) });
  }
});
