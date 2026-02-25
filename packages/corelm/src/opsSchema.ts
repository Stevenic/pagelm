// ---------------------------------------------------------------------------
// JSON Schema for CoreOp[] — used for Anthropic structured output
//
// Anthropic constrained decoding requires additionalProperties: false on every
// object, which prevents freeform objects. For fields like props, style, motion,
// and events we encode them as JSON strings. The builder parses them after.
// ---------------------------------------------------------------------------

import { NODE_TYPES } from './types';

const nodeTypeEnum = [...NODE_TYPES];

/**
 * CoreNode schema for structured output.
 * Freeform fields (props, style, events, motion) are JSON strings.
 */
const coreNodeInlineSchema: Record<string, unknown> = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        type: { type: 'string', enum: nodeTypeEnum },
        props: { type: 'string', description: 'JSON-encoded props object' },
        style: { type: 'string', description: 'JSON-encoded StyleTokens object' },
        events: { type: 'string', description: 'JSON-encoded EventBinding[] array' },
        motion: { type: 'string', description: 'JSON-encoded MotionSpec object' },
        children: { type: 'array', items: { $ref: '#/$defs/CoreNode' } },
        text: { type: 'string' },
    },
    required: ['id', 'type'],
    additionalProperties: false,
};

/**
 * JSON Schema for an array of CoreOp — the structured output the LLM returns.
 * Freeform object fields are encoded as JSON strings to satisfy Anthropic's
 * requirement that all objects have additionalProperties: false.
 */
export const CORE_OPS_SCHEMA: Record<string, unknown> = {
    type: 'array',
    items: {
        anyOf: [
            {
                type: 'object',
                properties: {
                    op: { type: 'string', const: 'updateProps' },
                    nodeId: { type: 'string' },
                    props: { type: 'string', description: 'JSON-encoded props to merge' },
                },
                required: ['op', 'nodeId', 'props'],
                additionalProperties: false,
            },
            {
                type: 'object',
                properties: {
                    op: { type: 'string', const: 'updateStyle' },
                    nodeId: { type: 'string' },
                    style: { type: 'string', description: 'JSON-encoded StyleTokens to merge' },
                },
                required: ['op', 'nodeId', 'style'],
                additionalProperties: false,
            },
            {
                type: 'object',
                properties: {
                    op: { type: 'string', const: 'updateText' },
                    nodeId: { type: 'string' },
                    text: { type: 'string' },
                },
                required: ['op', 'nodeId', 'text'],
                additionalProperties: false,
            },
            {
                type: 'object',
                properties: {
                    op: { type: 'string', const: 'replace' },
                    nodeId: { type: 'string' },
                    node: { $ref: '#/$defs/CoreNode' },
                },
                required: ['op', 'nodeId', 'node'],
                additionalProperties: false,
            },
            {
                type: 'object',
                properties: {
                    op: { type: 'string', const: 'delete' },
                    nodeId: { type: 'string' },
                },
                required: ['op', 'nodeId'],
                additionalProperties: false,
            },
            {
                type: 'object',
                properties: {
                    op: { type: 'string', const: 'insert' },
                    parentId: { type: 'string' },
                    position: { type: 'string', enum: ['prepend', 'append', 'before', 'after'] },
                    node: { $ref: '#/$defs/CoreNode' },
                },
                required: ['op', 'parentId', 'position', 'node'],
                additionalProperties: false,
            },
            {
                type: 'object',
                properties: {
                    op: { type: 'string', const: 'addEvent' },
                    nodeId: { type: 'string' },
                    event: { type: 'string', description: 'JSON-encoded EventBinding object' },
                },
                required: ['op', 'nodeId', 'event'],
                additionalProperties: false,
            },
            {
                type: 'object',
                properties: {
                    op: { type: 'string', const: 'removeEvent' },
                    nodeId: { type: 'string' },
                    eventIndex: { type: 'number' },
                },
                required: ['op', 'nodeId', 'eventIndex'],
                additionalProperties: false,
            },
            {
                type: 'object',
                properties: {
                    op: { type: 'string', const: 'updateAnimation' },
                    nodeId: { type: 'string' },
                    motion: { type: 'string', description: 'JSON-encoded MotionSpec object' },
                },
                required: ['op', 'nodeId', 'motion'],
                additionalProperties: false,
            },
        ],
    },
    $defs: {
        CoreNode: coreNodeInlineSchema,
    },
};

// ---------------------------------------------------------------------------
// Hydration — parse JSON-string fields back into objects after LLM response
// ---------------------------------------------------------------------------

/**
 * Parse JSON-encoded string fields in a CoreOp[] array back into proper objects.
 * Call this on the raw LLM response before passing to applyCoreOps().
 */
export function hydrateCoreOps(ops: Record<string, unknown>[]): Record<string, unknown>[] {
    return ops.map(op => {
        const result = { ...op };

        // Hydrate node fields (replace, insert)
        if (result.node && typeof result.node === 'object') {
            result.node = hydrateNode(result.node as Record<string, unknown>);
        }

        // Hydrate top-level JSON-string fields
        if (typeof result.props === 'string') result.props = tryParseJson(result.props);
        if (typeof result.style === 'string') result.style = tryParseJson(result.style);
        if (typeof result.event === 'string') result.event = tryParseJson(result.event);
        if (typeof result.motion === 'string') result.motion = tryParseJson(result.motion);

        return result;
    });
}

function hydrateNode(node: Record<string, unknown>): Record<string, unknown> {
    const result = { ...node };

    if (typeof result.props === 'string') result.props = tryParseJson(result.props);
    if (typeof result.style === 'string') result.style = tryParseJson(result.style);
    if (typeof result.events === 'string') result.events = tryParseJson(result.events);
    if (typeof result.motion === 'string') result.motion = tryParseJson(result.motion);

    if (Array.isArray(result.children)) {
        result.children = (result.children as Record<string, unknown>[]).map(hydrateNode);
    }

    return result;
}

function tryParseJson(str: string): unknown {
    try {
        return JSON.parse(str);
    } catch {
        return str;
    }
}
