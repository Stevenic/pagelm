// ---------------------------------------------------------------------------
// Minimal adapter — no framework, maps tokens to inline CSS with defaults
// ---------------------------------------------------------------------------

import type { StyleTokens, NodeType } from '@pagelm/corelm';
import type { CoreLMAdapter } from '../adapter';

// ---------------------------------------------------------------------------
// Token → CSS value maps
// ---------------------------------------------------------------------------

const SPACE_MAP: Record<string, string> = {
    none: '0', xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem', '2xl': '3rem', '3xl': '4rem',
};

const RADIUS_MAP: Record<string, string> = {
    none: '0', sm: '4px', md: '8px', lg: '12px', xl: '16px', full: '9999px',
};

const SHADOW_MAP: Record<string, string> = {
    none: 'none',
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
    xl: '0 20px 25px rgba(0,0,0,0.1)',
};

const COLOR_MAP: Record<string, string> = {
    primary: '#0078d4',
    secondary: '#6c757d',
    success: '#28a745',
    warning: '#ffc107',
    danger: '#dc3545',
    info: '#17a2b8',
    neutral: '#6c757d',
    surface: '#ffffff',
    background: '#f5f5f5',
    text: '#212529',
    textSecondary: '#6c757d',
    border: '#dee2e6',
    muted: '#f8f9fa',
};

const TYPOGRAPHY_MAP: Record<string, { fontSize: string; fontWeight: string; lineHeight: string }> = {
    display: { fontSize: '2.5rem', fontWeight: '700', lineHeight: '1.2' },
    headline: { fontSize: '2rem', fontWeight: '600', lineHeight: '1.25' },
    title: { fontSize: '1.5rem', fontWeight: '600', lineHeight: '1.3' },
    subtitle: { fontSize: '1.25rem', fontWeight: '500', lineHeight: '1.4' },
    body: { fontSize: '1rem', fontWeight: '400', lineHeight: '1.5' },
    caption: { fontSize: '0.875rem', fontWeight: '400', lineHeight: '1.4' },
    overline: { fontSize: '0.75rem', fontWeight: '600', lineHeight: '1.5' },
    code: { fontSize: '0.875rem', fontWeight: '400', lineHeight: '1.5' },
};

const FONT_WEIGHT_MAP: Record<string, string> = {
    normal: '400', medium: '500', semibold: '600', bold: '700',
};

const ALIGN_MAP: Record<string, string> = {
    start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch',
    between: 'space-between', around: 'space-around', evenly: 'space-evenly',
};

// ---------------------------------------------------------------------------
// Tag resolution
// ---------------------------------------------------------------------------

const TAG_MAP: Record<string, string> = {
    App: 'div', Page: 'main', Section: 'section', Box: 'div', Stack: 'div',
    Grid: 'div', Cluster: 'div', Spacer: 'div', Divider: 'hr',
    Heading: 'h2', Text: 'p', RichText: 'div', Image: 'img', Icon: 'span',
    Button: 'button', Link: 'a', Form: 'form', Input: 'input', Select: 'select',
    Checkbox: 'label', Card: 'div', List: 'ul', Table: 'table', Badge: 'span',
    Animate: 'div', Disclosure: 'details', Tabs: 'div', Dialog: 'dialog',
    ToastRegion: 'div',
};

// ---------------------------------------------------------------------------
// Adapter implementation
// ---------------------------------------------------------------------------

export function createNoneAdapter(): CoreLMAdapter {
    return {
        resolveStyle(tokens: StyleTokens): Record<string, string> {
            const css: Record<string, string> = {};

            if (tokens.space) {
                if (typeof tokens.space === 'string') {
                    css['padding'] = SPACE_MAP[tokens.space] ?? tokens.space;
                } else {
                    if (tokens.space.x) { css['padding-left'] = SPACE_MAP[tokens.space.x] ?? '0'; css['padding-right'] = SPACE_MAP[tokens.space.x] ?? '0'; }
                    if (tokens.space.y) { css['padding-top'] = SPACE_MAP[tokens.space.y] ?? '0'; css['padding-bottom'] = SPACE_MAP[tokens.space.y] ?? '0'; }
                    if (tokens.space.top) css['padding-top'] = SPACE_MAP[tokens.space.top] ?? '0';
                    if (tokens.space.right) css['padding-right'] = SPACE_MAP[tokens.space.right] ?? '0';
                    if (tokens.space.bottom) css['padding-bottom'] = SPACE_MAP[tokens.space.bottom] ?? '0';
                    if (tokens.space.left) css['padding-left'] = SPACE_MAP[tokens.space.left] ?? '0';
                }
            }
            if (tokens.radius) css['border-radius'] = RADIUS_MAP[tokens.radius] ?? tokens.radius;
            if (tokens.border) {
                const w = tokens.border.width ?? 1;
                const s = tokens.border.style ?? 'solid';
                const c = tokens.border.color ? (COLOR_MAP[tokens.border.color] ?? tokens.border.color) : COLOR_MAP.border;
                css['border'] = `${w}px ${s} ${c}`;
            }
            if (tokens.shadow) css['box-shadow'] = SHADOW_MAP[tokens.shadow] ?? 'none';
            if (tokens.color) css['color'] = COLOR_MAP[tokens.color] ?? tokens.color;
            if (tokens.bg) css['background-color'] = COLOR_MAP[tokens.bg] ?? tokens.bg;
            if (tokens.typography) {
                const t = TYPOGRAPHY_MAP[tokens.typography];
                if (t) {
                    css['font-size'] = t.fontSize;
                    css['font-weight'] = t.fontWeight;
                    css['line-height'] = t.lineHeight;
                    if (tokens.typography === 'code') css['font-family'] = 'monospace';
                    if (tokens.typography === 'overline') css['text-transform'] = 'uppercase';
                }
            }
            if (tokens.layout) {
                if (tokens.layout === 'hidden') css['display'] = 'none';
                else css['display'] = tokens.layout;
            }
            if (tokens.align) css['align-items'] = ALIGN_MAP[tokens.align] ?? tokens.align;
            if (tokens.justify) css['justify-content'] = ALIGN_MAP[tokens.justify] ?? tokens.justify;
            if (tokens.gap) css['gap'] = SPACE_MAP[tokens.gap] ?? tokens.gap;
            if (tokens.width) css['width'] = tokens.width;
            if (tokens.height) css['height'] = tokens.height;
            if (tokens.minWidth) css['min-width'] = tokens.minWidth;
            if (tokens.maxWidth) css['max-width'] = tokens.maxWidth;
            if (tokens.minHeight) css['min-height'] = tokens.minHeight;
            if (tokens.maxHeight) css['max-height'] = tokens.maxHeight;
            if (tokens.overflow) css['overflow'] = tokens.overflow;
            if (tokens.opacity !== undefined) css['opacity'] = String(tokens.opacity);
            if (tokens.fontWeight) css['font-weight'] = FONT_WEIGHT_MAP[tokens.fontWeight] ?? tokens.fontWeight;
            if (tokens.fontSize) css['font-size'] = tokens.fontSize;
            if (tokens.textAlign) css['text-align'] = tokens.textAlign;
            if (tokens.cursor) css['cursor'] = tokens.cursor;
            if (tokens.position) css['position'] = tokens.position;

            return css;
        },

        resolveTag(type: NodeType, props: Record<string, unknown>): { tag: string; attrs: Record<string, string> } {
            const tag = TAG_MAP[type] ?? 'div';
            const attrs: Record<string, string> = {};

            switch (type) {
                case 'Heading': {
                    const level = typeof props.level === 'number' ? props.level : 2;
                    return { tag: `h${Math.min(Math.max(level, 1), 6)}`, attrs };
                }
                case 'Image':
                    if (props.src) attrs['src'] = String(props.src);
                    if (props.alt) attrs['alt'] = String(props.alt);
                    break;
                case 'Link':
                    if (props.href) attrs['href'] = String(props.href);
                    if (props.target) attrs['target'] = String(props.target);
                    break;
                case 'Input':
                    attrs['type'] = String(props.inputType ?? props.type ?? 'text');
                    if (props.placeholder) attrs['placeholder'] = String(props.placeholder);
                    if (props.name) attrs['name'] = String(props.name);
                    if (props.value !== undefined) attrs['value'] = String(props.value);
                    if (props.required) attrs['required'] = '';
                    if (props.disabled) attrs['disabled'] = '';
                    break;
                case 'Select':
                    if (props.name) attrs['name'] = String(props.name);
                    if (props.disabled) attrs['disabled'] = '';
                    break;
                case 'Checkbox':
                    break;
                case 'Button':
                    if (props.disabled) attrs['disabled'] = '';
                    if (props.variant) attrs['data-variant'] = String(props.variant);
                    break;
                case 'Form':
                    if (props.action) attrs['action'] = String(props.action);
                    if (props.method) attrs['method'] = String(props.method);
                    break;
                case 'Stack':
                    attrs['style'] = 'display:flex;flex-direction:column';
                    break;
                case 'Grid': {
                    const cols = props.columns ?? 'auto';
                    attrs['style'] = `display:grid;grid-template-columns:${typeof cols === 'number' ? `repeat(${cols}, 1fr)` : String(cols)}`;
                    break;
                }
                case 'Cluster':
                    attrs['style'] = 'display:flex;flex-wrap:wrap';
                    break;
                case 'Spacer': {
                    const size = props.size ?? '1rem';
                    attrs['style'] = `height:${size};flex-shrink:0`;
                    attrs['aria-hidden'] = 'true';
                    break;
                }
                case 'Dialog':
                    if (props.open) attrs['open'] = '';
                    break;
            }

            return { tag, attrs };
        },

        assets() {
            return { styles: [], scripts: [] };
        },
    };
}
