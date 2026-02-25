// ---------------------------------------------------------------------------
// CoreLM change operations — parallel to ChangeOp in @pagelm/core
// ---------------------------------------------------------------------------

import { CoreNode, CoreDocument, StyleTokens, EventBinding, MotionSpec } from './types';

// ---------------------------------------------------------------------------
// CoreOp union type
// ---------------------------------------------------------------------------

export type CoreOp =
    | { op: 'updateProps'; nodeId: string; props: Record<string, unknown> }
    | { op: 'updateStyle'; nodeId: string; style: Partial<StyleTokens> }
    | { op: 'updateText'; nodeId: string; text: string }
    | { op: 'replace'; nodeId: string; node: CoreNode }
    | { op: 'delete'; nodeId: string }
    | { op: 'insert'; parentId: string; position: 'prepend' | 'append' | 'before' | 'after'; node: CoreNode }
    | { op: 'addEvent'; nodeId: string; event: EventBinding }
    | { op: 'removeEvent'; nodeId: string; eventIndex: number }
    | { op: 'updateAnimation'; nodeId: string; motion: MotionSpec };

// ---------------------------------------------------------------------------
// Immutable apply — returns new document with ops applied
// ---------------------------------------------------------------------------

/**
 * Apply CoreOps to a CoreDocument immutably.
 * Returns a new document with all ops applied in order.
 */
export function applyCoreOps(doc: CoreDocument, ops: CoreOp[]): CoreDocument {
    let result = structuredClone(doc);

    for (const op of ops) {
        switch (op.op) {
            case 'updateProps': {
                const node = findNode(result.app, op.nodeId);
                if (node) {
                    node.props = { ...node.props, ...op.props };
                }
                break;
            }
            case 'updateStyle': {
                const node = findNode(result.app, op.nodeId);
                if (node) {
                    node.style = { ...node.style, ...op.style };
                }
                break;
            }
            case 'updateText': {
                const node = findNode(result.app, op.nodeId);
                if (node) {
                    node.text = op.text;
                }
                break;
            }
            case 'replace': {
                result = { ...result, app: replaceNode(result.app, op.nodeId, op.node) as typeof result.app };
                break;
            }
            case 'delete': {
                result = { ...result, app: deleteNode(result.app, op.nodeId) as typeof result.app };
                break;
            }
            case 'insert': {
                result = { ...result, app: insertNode(result.app, op.parentId, op.position, op.node) as typeof result.app };
                break;
            }
            case 'addEvent': {
                const node = findNode(result.app, op.nodeId);
                if (node) {
                    node.events = [...(node.events ?? []), op.event];
                }
                break;
            }
            case 'removeEvent': {
                const node = findNode(result.app, op.nodeId);
                if (node && node.events) {
                    node.events = node.events.filter((_, i) => i !== op.eventIndex);
                }
                break;
            }
            case 'updateAnimation': {
                const node = findNode(result.app, op.nodeId);
                if (node) {
                    node.motion = op.motion;
                }
                break;
            }
        }
    }

    return result;
}

// ---------------------------------------------------------------------------
// Tree helpers
// ---------------------------------------------------------------------------

function findNode(root: CoreNode, id: string): CoreNode | null {
    if (root.id === id) return root;
    if (root.children) {
        for (const child of root.children) {
            const found = findNode(child, id);
            if (found) return found;
        }
    }
    return null;
}

function replaceNode(root: CoreNode, id: string, replacement: CoreNode): CoreNode {
    if (root.id === id) return replacement;
    if (!root.children) return root;
    return {
        ...root,
        children: root.children.map(child => replaceNode(child, id, replacement)),
    };
}

function deleteNode(root: CoreNode, id: string): CoreNode {
    if (!root.children) return root;
    return {
        ...root,
        children: root.children
            .filter(child => child.id !== id)
            .map(child => deleteNode(child, id)),
    };
}

function insertNode(root: CoreNode, parentId: string, position: 'prepend' | 'append' | 'before' | 'after', node: CoreNode): CoreNode {
    if (root.id === parentId && (position === 'prepend' || position === 'append')) {
        const children = root.children ?? [];
        return {
            ...root,
            children: position === 'prepend' ? [node, ...children] : [...children, node],
        };
    }

    if (!root.children) return root;

    // Handle before/after by looking for parentId's child
    if (position === 'before' || position === 'after') {
        const idx = root.children.findIndex(c => c.id === parentId);
        if (idx !== -1) {
            const newChildren = [...root.children];
            const insertIdx = position === 'before' ? idx : idx + 1;
            newChildren.splice(insertIdx, 0, node);
            return { ...root, children: newChildren };
        }
    }

    return {
        ...root,
        children: root.children.map(child => insertNode(child, parentId, position, node)),
    };
}
