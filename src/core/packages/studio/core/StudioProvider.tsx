import React from 'react';
import { Editor } from '@craftjs/core';
import { Container, ContainerSettings } from '../components/Container';
import { StudioButton } from '../components/StudioButton';
import { ArrowProgressDemo } from '../components/ArrowProgressDemo';

interface StudioProviderProps {
    children: React.ReactNode;
}

import { DentaxyErrorBoundary } from '@/components/ui/DentaxyErrorBoundary';

export const StudioProvider = ({ children }: StudioProviderProps) => {
    return (
        <Editor
            resolver={{
                Container,
                StudioButton,
                ArrowProgressDemo,
            }}
        >
            <DentaxyErrorBoundary>
                {children}
            </DentaxyErrorBoundary>
        </Editor>
    );
};
