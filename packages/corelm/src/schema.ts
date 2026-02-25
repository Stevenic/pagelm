// ---------------------------------------------------------------------------
// JSON Schema (draft 2020-12) for CoreDocument
// Used for Anthropic structured output (outputSchema) and post-LLM validation
// ---------------------------------------------------------------------------

import { NODE_TYPES } from './types';

const styleTokensSchema: Record<string, unknown> = {
    type: 'object',
    properties: {
        space: {
            anyOf: [
                { type: 'string', enum: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] },
                {
                    type: 'object',
                    properties: {
                        x: { type: 'string', enum: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] },
                        y: { type: 'string', enum: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] },
                        top: { type: 'string', enum: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] },
                        right: { type: 'string', enum: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] },
                        bottom: { type: 'string', enum: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] },
                        left: { type: 'string', enum: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] },
                    },
                    additionalProperties: false,
                },
            ],
        },
        radius: { type: 'string', enum: ['none', 'sm', 'md', 'lg', 'xl', 'full'] },
        border: {
            type: 'object',
            properties: {
                width: { type: 'number' },
                style: { type: 'string', enum: ['solid', 'dashed', 'dotted', 'none'] },
                color: { type: 'string', enum: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral', 'surface', 'background', 'text', 'textSecondary', 'border', 'muted'] },
            },
            additionalProperties: false,
        },
        shadow: { type: 'string', enum: ['none', 'sm', 'md', 'lg', 'xl'] },
        color: { type: 'string', enum: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral', 'surface', 'background', 'text', 'textSecondary', 'border', 'muted'] },
        bg: { type: 'string', enum: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral', 'surface', 'background', 'text', 'textSecondary', 'border', 'muted'] },
        typography: { type: 'string', enum: ['display', 'headline', 'title', 'subtitle', 'body', 'caption', 'overline', 'code'] },
        layout: { type: 'string', enum: ['block', 'inline', 'flex', 'grid', 'hidden'] },
        align: { type: 'string', enum: ['start', 'center', 'end', 'stretch', 'between', 'around', 'evenly'] },
        justify: { type: 'string', enum: ['start', 'center', 'end', 'stretch', 'between', 'around', 'evenly'] },
        gap: { type: 'string', enum: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] },
        width: { type: 'string' },
        height: { type: 'string' },
        minWidth: { type: 'string' },
        maxWidth: { type: 'string' },
        minHeight: { type: 'string' },
        maxHeight: { type: 'string' },
        overflow: { type: 'string', enum: ['auto', 'hidden', 'scroll', 'visible'] },
        opacity: { type: 'number' },
        fontWeight: { type: 'string', enum: ['normal', 'medium', 'semibold', 'bold'] },
        fontSize: { type: 'string' },
        textAlign: { type: 'string', enum: ['left', 'center', 'right', 'justify'] },
        cursor: { type: 'string' },
        position: { type: 'string', enum: ['static', 'relative', 'absolute', 'fixed', 'sticky'] },
    },
    additionalProperties: false,
};

const conditionSchema: Record<string, unknown> = {
    type: 'object',
    properties: {
        key: { type: 'string' },
        op: { type: 'string', enum: ['eq', 'neq', 'gt', 'lt', 'gte', 'lte', 'truthy', 'falsy', 'contains'] },
        value: {},
    },
    required: ['key', 'op'],
    additionalProperties: false,
};

const effectSchema: Record<string, unknown> = {
    type: 'object',
    properties: {
        type: { type: 'string', enum: ['toggleTarget', 'setState', 'appendStateArray', 'fetchJson', 'emit', 'runAnimation', 'focus', 'toast'] },
        target: { type: 'string' },
        key: { type: 'string' },
        value: {},
        url: { type: 'string' },
        method: { type: 'string', enum: ['GET', 'POST', 'PUT', 'DELETE'] },
        body: {},
        resultKey: { type: 'string' },
        event: { type: 'string' },
        animation: { type: 'string' },
        message: { type: 'string' },
        variant: { type: 'string', enum: ['info', 'success', 'warning', 'danger'] },
        selector: { type: 'string' },
    },
    required: ['type'],
    additionalProperties: false,
};

const eventBindingSchema: Record<string, unknown> = {
    type: 'object',
    properties: {
        event: { type: 'string' },
        when: { type: 'array', items: conditionSchema },
        do: { type: 'array', items: effectSchema },
    },
    required: ['event', 'do'],
    additionalProperties: false,
};

const motionSpecSchema: Record<string, unknown> = {
    anyOf: [
        {
            type: 'object',
            properties: {
                mode: { type: 'string', const: 'preset' },
                preset: { type: 'string', enum: ['fadeIn', 'fadeOut', 'slideUp', 'slideDown', 'slideLeft', 'slideRight', 'scaleIn', 'scaleOut', 'bounce', 'shake', 'pulse', 'spin'] },
                duration: { type: 'number' },
                delay: { type: 'number' },
                easing: { type: 'string' },
                trigger: { type: 'string', enum: ['onMount', 'onVisible', 'onHover', 'onPress', 'onState'] },
                stateKey: { type: 'string' },
            },
            required: ['mode', 'preset'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                mode: { type: 'string', const: 'keyframes' },
                keyframes: { type: 'array', items: { type: 'object' } },
                duration: { type: 'number' },
                delay: { type: 'number' },
                easing: { type: 'string' },
                iterations: { anyOf: [{ type: 'number' }, { type: 'string', const: 'infinite' }] },
                fill: { type: 'string', enum: ['forwards', 'backwards', 'both', 'none'] },
                trigger: { type: 'string', enum: ['onMount', 'onVisible', 'onHover', 'onPress', 'onState'] },
                stateKey: { type: 'string' },
            },
            required: ['mode', 'keyframes'],
            additionalProperties: false,
        },
    ],
};

const nodeTypeEnum = [...NODE_TYPES];

const coreNodeSchema: Record<string, unknown> = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        type: { type: 'string', enum: nodeTypeEnum },
        props: { type: 'object' },
        style: styleTokensSchema,
        events: { type: 'array', items: eventBindingSchema },
        motion: motionSpecSchema,
        children: { type: 'array', items: { $ref: '#/$defs/CoreNode' } },
        text: { type: 'string' },
    },
    required: ['id', 'type'],
    additionalProperties: false,
};

const scriptModuleSchema: Record<string, unknown> = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        source: { type: 'string' },
    },
    required: ['id', 'source'],
    additionalProperties: false,
};

/**
 * JSON Schema for CoreDocument — used for Anthropic structured output
 * and post-LLM validation.
 */
export const CORE_DOCUMENT_SCHEMA: Record<string, unknown> = {
    type: 'object',
    properties: {
        version: { type: 'string' },
        app: { $ref: '#/$defs/CoreNode' },
        assets: {
            type: 'object',
            properties: {
                styles: { type: 'array', items: { type: 'string' } },
                scripts: { type: 'array', items: { type: 'string' } },
            },
            additionalProperties: false,
        },
        modules: { type: 'array', items: scriptModuleSchema },
    },
    required: ['version', 'app'],
    additionalProperties: false,
    $defs: {
        CoreNode: coreNodeSchema,
    },
};
