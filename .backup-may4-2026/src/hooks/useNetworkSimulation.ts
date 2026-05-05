
import { useEffect, useState } from 'react';
import { useLiveMetrics } from './useDashboardMetrics';

export function useNetworkSimulation() {
    const { data: realMetrics, isLoading } = useLiveMetrics();

    // Estados locales para simulación visual
    const [simulatedGlobalReach, setSimulatedGlobalReach] = useState(0);
    const [simulatedActiveNodes, setSimulatedActiveNodes] = useState(0);
    const [simulatedOps, setSimulatedOps] = useState(0);

    // Efecto de inicialización
    useEffect(() => {
        if (realMetrics) {
            setSimulatedGlobalReach(realMetrics.globalReach);
            setSimulatedActiveNodes(realMetrics.activeNodes);
            setSimulatedOps(realMetrics.operationsPerMinute);
        }
    }, [realMetrics]);

    // Efecto de "respiración" para dar vida a los números
    useEffect(() => {
        if (!realMetrics) return;

        const interval = setInterval(() => {
            // Variación pequeña aleatoria (+- 0.5%)
            const jitter = (val: number) => {
                const delta = val * 0.005;
                const change = (Math.random() * delta * 2) - delta;
                return Math.floor(val + change);
            };

            setSimulatedActiveNodes(prev => {
                const target = realMetrics.activeNodes;
                // Tendencia a regresar al valor real
                const diff = target - prev;
                return Math.floor(prev + (diff * 0.1) + ((Math.random() - 0.5) * 5));
            });

            setSimulatedOps(prev => {
                const target = realMetrics.operationsPerMinute;
                return Math.floor(prev + ((Math.random() - 0.5) * 50)); // Ops varían más
            });

        }, 2000);

        return () => clearInterval(interval);
    }, [realMetrics]);

    return {
        metrics: {
            ...realMetrics,
            globalReach: simulatedGlobalReach,
            activeNodes: simulatedActiveNodes,
            operationsPerMinute: simulatedOps,
            systemStatus: realMetrics?.systemStatus || 'operational',
            threatLevel: realMetrics?.threatLevel || 'low',
        },
        isLoading
    };
}
