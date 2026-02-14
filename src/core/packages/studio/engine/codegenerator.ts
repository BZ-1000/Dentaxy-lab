import { ComponentNode } from './types';
import { componentRegistry } from './registry';

export const generateCode = (nodes: ComponentNode[]): string => {
    // Helper to format props
    const formatProps = (props: Record<string, any>) => {
        return Object.entries(props)
            .map(([key, value]) => {
                if (key === 'children') return ''; // Handled separately
                if (typeof value === 'string') return ` ${key}="${value}"`;
                if (typeof value === 'boolean') return value ? ` ${key}` : ` ${key}={false}`;
                if (typeof value === 'number') return ` ${key}={${value}}`;
                return ` ${key}={${JSON.stringify(value)}}`;
            })
            .join('');
    };

    // Recursive function to build JSX
    const buildJSX = (node: ComponentNode, depth: number = 2): string => {
        const config = componentRegistry[node.type];
        if (!config) return `{/* Unknown Component: ${node.type} */}`;

        const indent = '  '.repeat(depth);
        const propsString = formatProps(node.props);
        const ComponentName = node.type; // Assuming registry keys match import names

        // Check if component has children content (either nested nodes or simple text children)
        const hasChildrenNodes = node.children && node.children.length > 0;

        // Some components might store text content in a prop like 'content' or 'text', 
        // but if we want to support nested composition:
        let internalContent = '';

        if (hasChildrenNodes) {
            const childrenJSX = node.children!.map(child => buildJSX(child, depth + 1)).join('\n');
            internalContent = `\n${childrenJSX}\n${indent}`;
        }

        if (internalContent) {
            return `${indent}<${ComponentName}${propsString}>${internalContent}</${ComponentName}>`;
        } else {
            return `${indent}<${ComponentName}${propsString} />`;
        }
    };

    const imports = Array.from(new Set(nodes.map(n => n.type))).join(', ');

    return `import React from 'react';
import { ${imports} } from './components';

export default function Page() {
  return (
    <main>
${nodes.map(node => buildJSX(node)).join('\n')}
    </main>
  );
}
`;
};
