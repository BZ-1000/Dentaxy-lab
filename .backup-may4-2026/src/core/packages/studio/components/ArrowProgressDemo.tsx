import React from 'react';
import { useNode } from '@craftjs/core';
import { ArrowProgressLine } from '@/core/packages/clinical-form/ui/ArrowProgressLine';

interface ArrowProgressDemoProps {
    totalSteps?: number;
    currentStep?: number;
    stepNames?: string[];
}

export const ArrowProgressDemo = ({
    totalSteps = 5,
    currentStep = 2,
    stepNames = ['Datos', 'Queja', 'Sistemas', 'Examen', 'Diagnóstico']
}: ArrowProgressDemoProps) => {
    const { connectors: { connect, drag } } = useNode();

    // Logic to ensure stepNames matches totalSteps (simplified for demo)
    const effectiveStepNames = stepNames.length >= totalSteps
        ? stepNames.slice(0, totalSteps)
        : [...stepNames, ...Array(totalSteps - stepNames.length).fill('Step')];

    // Mock statuses
    const stepStatuses: any[] = Array(totalSteps).fill('pending').map((_, i) =>
        i < currentStep ? 'completed' : i === currentStep ? 'active' : 'pending'
    );

    return (
        <div ref={(ref) => connect(drag(ref as HTMLElement))} className="w-full my-2">
            <ArrowProgressLine
                totalSteps={totalSteps}
                currentStep={currentStep}
                isGenerating={false}
                stepNames={effectiveStepNames}
                onStepClick={() => { }}
                stepStatuses={stepStatuses}
            />
        </div>
    )
}

ArrowProgressDemo.craft = {
    displayName: 'Progreso',
    props: {
        totalSteps: 5,
        currentStep: 2,
        stepNames: ['Datos', 'Queja', 'Sistemas', 'Examen', 'Diagnóstico']
    }
}
