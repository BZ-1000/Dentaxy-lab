import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./button";

interface Props {
    children?: ReactNode;
    fallbackTitle?: string;
    componentName?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class DentaxyErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 m-4 bg-red-50 border border-red-200 rounded-xl flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-red-800">
                        {this.props.fallbackTitle || "Algo salió mal"}
                    </h3>
                    <p className="text-sm text-red-600 max-w-md">
                        Hubo un error al mostrar {this.props.componentName || "este componente"}.
                        <br />
                        <span className="text-xs font-mono opacity-80 mt-1 block bg-red-100/50 p-1 rounded">
                            {this.state.error?.message}
                        </span>
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            this.setState({ hasError: false, error: null });
                            window.location.reload();
                        }}
                        className="mt-2 border-red-300 text-red-700 hover:bg-red-100"
                    >
                        <RefreshCw className="w-3 h-3 mr-2" />
                        Recargar Página
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}
