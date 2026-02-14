import {
    ToolGroupManager,
    Enums as csToolsEnums,
} from '@cornerstonejs/tools';
import { getRenderingEngine, Types } from '@cornerstonejs/core';
import { useToolState } from './ToolState';
import { ToolNames } from './ToolRegistry';

class ToolControllerService {
    private toolGroupId: string | null = null;
    private renderingEngineId: string | null = null;
    private viewportId: string | null = null;

    initialize(toolGroupId: string, renderingEngineId: string, viewportId: string) {
        this.toolGroupId = toolGroupId;
        this.renderingEngineId = renderingEngineId;
        this.viewportId = viewportId;
    }

    activateTool(toolName: string) {
        if (!this.toolGroupId) return;

        const toolGroup = ToolGroupManager.getToolGroup(this.toolGroupId);
        if (!toolGroup) return;

        const { activeTool } = useToolState.getState();

        // Deactivate current tool if it's not the same
        if (activeTool && activeTool !== toolName) {
            // Some tools are passive/enabled, not active.
            // For simplicity, we assume primary mouse button binding for active tool.
            // We set the previous tool to 'Passive' or 'Enabled' depending on requirements.
            // Here we'll set it to 'Passive' so it can still be used if mapped to other buttons, 
            // but mostly we just want to unset the primary binding.
            toolGroup.setToolPassive(activeTool);
        }

        // Activate new tool
        // Check if it's a real Cornerstone tool or a virtual one (like Invert)
        if (this.isCornerstoneTool(toolName)) {
            toolGroup.setToolActive(toolName, {
                bindings: [{ mouseButton: csToolsEnums.MouseBindings.Primary }],
            });
        }

        useToolState.getState().setActiveTool(toolName);
    }

    private isCornerstoneTool(toolName: string): boolean {
        // Filter out virtual tools
        return ![ToolNames.Invert, ToolNames.RealSize, ToolNames.Reset].includes(toolName);
    }

    getRenderingEngine() {
        if (!this.renderingEngineId) return null;
        return getRenderingEngine(this.renderingEngineId);
    }

    getViewport() {
        const renderingEngine = this.getRenderingEngine();
        if (!renderingEngine || !this.viewportId) return null;
        return renderingEngine.getViewport(this.viewportId) as Types.IStackViewport;
    }
}

export const ToolController = new ToolControllerService();
