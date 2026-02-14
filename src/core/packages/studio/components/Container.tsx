import React from 'react';
import { useNode } from '@craftjs/core';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ContainerProps {
    children?: React.ReactNode;
    background?: string;
    padding?: string;
    className?: string;
}

export const Container = ({ children, background, padding = '0', className }: ContainerProps) => {
    const { connectors: { connect, drag }, isHovered } = useNode((state) => ({
        isHovered: state.events.hovered
    }));

    return (
        <div
            ref={(ref) => connect(drag(ref as HTMLElement))}
            className={cn("min-w-[100px] min-h-[100px] relative transition-colors duration-200", className)}
            style={{
                background,
                padding: `${padding}px`,
                border: isHovered ? '1px dashed #3b82f6' : '1px dashed transparent', // Blue dashed border on hover
                boxShadow: isHovered ? 'inset 0 0 0 1px #3b82f6' : 'none'
            }}
        >
            {children}
        </div>
    );
};

export const ContainerSettings = () => {
    const { actions: { setProp }, props } = useNode((node) => ({
        props: node.data.props
    }));

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Fondo (Background)</Label>
                <div className="flex gap-2">
                    <div
                        className="w-8 h-8 rounded border border-slate-200"
                        style={{ background: props.background }}
                    />
                    <Input
                        value={props.background}
                        onChange={(e) => setProp((props: any) => props.background = e.target.value)}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Relleno (Padding)</Label>
                <Input
                    type="number"
                    value={props.padding}
                    onChange={(e) => setProp((props: any) => props.padding = e.target.value)}
                />
            </div>
        </div>
    )
}

Container.craft = {
    displayName: 'Container',
    props: {
        background: '#ffffff',
        padding: '20'
    },
    related: {
        settings: ContainerSettings
    }
}
