import React, { useEffect, useState } from 'react';
import { useNode } from '@craftjs/core';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface StudioButtonProps {
    children?: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export const StudioButton = ({ children = "Button", variant = "default" }: StudioButtonProps) => {
    const { connectors: { connect, drag } } = useNode();

    return (
        <div ref={(ref) => connect(drag(ref as HTMLElement))} className="inline-block m-2">
            <Button variant={variant}>
                {children}
            </Button>
        </div>
    )
}

const StudioButtonSettings = () => {
    const { actions: { setProp }, props } = useNode((node) => ({
        props: node.data.props
    }));

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Texto</Label>
                <Input
                    value={props.children}
                    onChange={(e) => setProp((props: any) => props.children = e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label>Variante</Label>
                <Select
                    value={props.variant}
                    onValueChange={(value) => setProp((props: any) => props.variant = value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Variante" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="destructive">Destructive</SelectItem>
                        <SelectItem value="outline">Outline</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                        <SelectItem value="ghost">Ghost</SelectItem>
                        <SelectItem value="link">Link</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

StudioButton.craft = {
    displayName: 'Button',
    props: {
        children: 'Click me',
        variant: 'default'
    },
    related: {
        settings: StudioButtonSettings
    }
}
