import {
    WindowLevelTool,
    PanTool,
    ZoomTool,
    LengthTool,
    ProbeTool,
    RectangleROITool,
    EllipticalROITool, // CircleROI maps to Elliptical in CS3D usually, or Circle
    AngleTool,
    BidirectionalTool,
    ArrowAnnotateTool,
    DragProbeTool,
} from '@cornerstonejs/tools';

export const ToolNames = {
    WindowLevel: 'WindowLevel',
    Pan: 'Pan',
    Zoom: 'Zoom',
    Length: 'Length',
    Probe: 'Probe',
    RectangleROI: 'RectangleROI',
    CircleROI: 'CircleROI', // Maps to EllipticalROITool
    Angle: 'Angle',
    ArrowAnnotate: 'ArrowAnnotate',
    DragProbe: 'DragProbe',
    Invert: 'Invert', // Virtual tool
    RealSize: 'RealSize', // Virtual tool
    Reset: 'Reset', // Virtual tool
};

export const ToolRegistry = {
    [ToolNames.WindowLevel]: WindowLevelTool,
    [ToolNames.Pan]: PanTool,
    [ToolNames.Zoom]: ZoomTool,
    [ToolNames.Length]: LengthTool,
    [ToolNames.Probe]: ProbeTool,
    [ToolNames.RectangleROI]: RectangleROITool,
    [ToolNames.CircleROI]: EllipticalROITool,
    [ToolNames.Angle]: AngleTool,
    [ToolNames.ArrowAnnotate]: ArrowAnnotateTool,
    [ToolNames.DragProbe]: DragProbeTool,
};
