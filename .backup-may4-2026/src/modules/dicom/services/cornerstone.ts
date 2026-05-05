import {
    init as csRenderInit,
    volumeLoader,
    metaData,
} from '@cornerstonejs/core';
import {
    addTool,
    PanTool,
    WindowLevelTool,
    StackScrollTool,
    ZoomTool,
    LengthTool,
    ProbeTool,
    ArrowAnnotateTool,
    RectangleROITool,
    AngleTool,
    EllipticalROITool,
    BidirectionalTool,
    ToolGroupManager,
    Enums as csToolsEnums,
} from '@cornerstonejs/tools';
import { initImageLoader } from './imageLoader';
import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import { init as initTools } from '@cornerstonejs/tools';

let isInitialized = false;

/**
 * Inicializa CornerstoneJS y registra las herramientas básicas y profesionales.
 * Se debe llamar una sola vez al montar la aplicación o el módulo DICOM.
 */
export const initCornerstone = async () => {
    // Evitar inicialización múltiple
    if (isInitialized) {
        console.log('✅ Cornerstone ya estaba inicializado');
        return;
    }

    try {
        console.log('🚀 Iniciando Cornerstone 3D...');

        // 1. Inicializar Core (Rendering Engine) PRIMERO
        await csRenderInit();
        console.log('   ✓ Cornerstone Core inicializado');

        // 2. Inicializar Tools
        initTools();
        console.log('   ✓ Cornerstone Tools inicializado');

        // Inicializar DICOM Image Loader
        console.log('   → Inicializando DICOM Image Loader...');
        initImageLoader();
        console.log('   ✓ DICOM Image Loader inicializado');

        // 4. Registrar el proveedor de metadatos de WADO-URI
        metaData.addProvider(
            (type, imageId) => cornerstoneDICOMImageLoader.wadouri.metaData.metaDataProvider(type, imageId),
            10000 // Prioridad alta
        );
        console.log('   ✓ Metadata provider registrado');

        // 5. Registrar Tools Básicas
        addTool(PanTool);
        addTool(WindowLevelTool);
        addTool(StackScrollTool);
        addTool(ZoomTool);
        addTool(LengthTool);
        addTool(ProbeTool);
        addTool(ArrowAnnotateTool);
        addTool(RectangleROITool);

        // 6. Registrar Tools Profesionales
        addTool(AngleTool);
        addTool(EllipticalROITool);
        addTool(BidirectionalTool);

        isInitialized = true;
        console.log('✅ Cornerstone 3D completamente inicializado');
    } catch (error) {
        console.error('❌ Error al inicializar CornerstoneJS:', error);
        throw error; // Re-lanzar para que el componente sepa que falló
    }
};

/**
 * Crea o recupera un ToolGroup básico para visualización 2D.
 * @param toolGroupId ID único para el grupo de herramientas
 */
export const initToolGroup = (toolGroupId: string) => {
    let toolGroup = ToolGroupManager.getToolGroup(toolGroupId);

    if (toolGroup) {
        return toolGroup;
    }

    toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

    if (!toolGroup) {
        throw new Error('No se pudo crear el ToolGroup');
    }

    // Añadir herramientas básicas al grupo
    toolGroup.addTool(PanTool.toolName);
    toolGroup.addTool(ZoomTool.toolName);
    toolGroup.addTool(WindowLevelTool.toolName);
    toolGroup.addTool(StackScrollTool.toolName);
    toolGroup.addTool(LengthTool.toolName);
    toolGroup.addTool(ProbeTool.toolName);
    toolGroup.addTool(ArrowAnnotateTool.toolName);
    toolGroup.addTool(RectangleROITool.toolName);

    // Añadir herramientas profesionales
    toolGroup.addTool(AngleTool.toolName);
    toolGroup.addTool(EllipticalROITool.toolName);
    toolGroup.addTool(BidirectionalTool.toolName);

    // Configurar bindings (ratón)
    toolGroup.setToolActive(WindowLevelTool.toolName, {
        bindings: [
            {
                mouseButton: csToolsEnums.MouseBindings.Primary, // Click izquierdo
            },
        ],
    });

    toolGroup.setToolActive(PanTool.toolName, {
        bindings: [
            {
                mouseButton: csToolsEnums.MouseBindings.Auxiliary, // Click central (rueda)
            },
        ],
    });

    toolGroup.setToolActive(ZoomTool.toolName, {
        bindings: [
            {
                mouseButton: csToolsEnums.MouseBindings.Secondary, // Click derecho
            },
        ],
    });

    // Activar StackScroll para que responda a la rueda del ratón
    // EL USUARIO QUIERE "BAJAR Y SUBIR COMO SCROLL DIRECTAMENTE EN LA RADIOGRAFÍA"
    // Esto significa que la rueda del ratón debe hacer PAN VERTICAL, no cambiar de imagen (stack scroll)
    // ni hacer zoom.

    // Desactivar StackScrollTool de la rueda
    // toolGroup.setToolActive(StackScrollTool.toolName);

    // Activar PanTool en la rueda del ratón
    // ELIMINADO: PanTool nativo no soporta bien delta de la rueda en todas las versiones

    // Dejamos la rueda libre para que el evento haga bubble al contenedor React (DicomViewport.tsx)
    // toolGroup.setToolActive(MouseWheelPanTool.toolName);

    // toolGroup.setToolActive(PanTool.toolName, {
    //     bindings: [
    //         {
    //             mouseButton: csToolsEnums.MouseBindings.Auxiliary, // Click central
    //         },
    //     ],
    // });

    console.log('✅ ToolGroup creado con herramientas profesionales:', toolGroupId);

    return toolGroup;
};
