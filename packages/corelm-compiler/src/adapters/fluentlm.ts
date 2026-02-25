// ---------------------------------------------------------------------------
// FluentLM adapter — maps CoreLM tokens to FluentLM CSS classes and variables
// ---------------------------------------------------------------------------

import type { StyleTokens, NodeType } from '@pagelm/corelm';
import type { CoreLMAdapter } from '../adapter';

// ---------------------------------------------------------------------------
// Token → FluentLM CSS variable maps
// ---------------------------------------------------------------------------

const SPACE_MAP: Record<string, string> = {
    none: '0', xs: 'var(--spacingXS)', sm: 'var(--spacingS1)', md: 'var(--spacingM)',
    lg: 'var(--spacingL1)', xl: 'var(--spacingXL)', '2xl': 'var(--spacingXXL)', '3xl': 'var(--spacingXXXL)',
};

const RADIUS_MAP: Record<string, string> = {
    none: '0', sm: 'var(--borderRadiusSmall)', md: 'var(--borderRadiusMedium)',
    lg: 'var(--borderRadiusLarge)', xl: 'var(--borderRadiusXLarge)', full: '9999px',
};

const SHADOW_MAP: Record<string, string> = {
    none: 'none', sm: 'var(--shadow2)', md: 'var(--shadow4)', lg: 'var(--shadow8)', xl: 'var(--shadow16)',
};

const COLOR_MAP: Record<string, string> = {
    primary: 'var(--themePrimary)',
    secondary: 'var(--neutralSecondary)',
    success: 'var(--greenText)',
    warning: 'var(--yellowText)',
    danger: 'var(--redText)',
    info: 'var(--blueText)',
    neutral: 'var(--neutralPrimary)',
    surface: 'var(--bodyBackground)',
    background: 'var(--bodyBackground)',
    text: 'var(--bodyText)',
    textSecondary: 'var(--neutralSecondary)',
    border: 'var(--neutralLight)',
    muted: 'var(--neutralLighter)',
};

const BG_COLOR_MAP: Record<string, string> = {
    primary: 'var(--themePrimary)',
    secondary: 'var(--neutralLighter)',
    success: 'var(--greenBackground)',
    warning: 'var(--yellowBackground)',
    danger: 'var(--redBackground)',
    info: 'var(--blueBackground)',
    neutral: 'var(--neutralLighter)',
    surface: 'var(--bodyBackground)',
    background: 'var(--bodyBackground)',
    text: 'var(--bodyText)',
    textSecondary: 'var(--neutralSecondary)',
    border: 'var(--neutralLight)',
    muted: 'var(--neutralLighterAlt)',
};

const TYPOGRAPHY_MAP: Record<string, { fontSize: string; fontWeight: string; lineHeight: string }> = {
    display: { fontSize: '2.5rem', fontWeight: '700', lineHeight: '1.2' },
    headline: { fontSize: '2rem', fontWeight: '600', lineHeight: '1.25' },
    title: { fontSize: 'var(--fontSizeXL)', fontWeight: '600', lineHeight: '1.3' },
    subtitle: { fontSize: 'var(--fontSizeLarge)', fontWeight: '500', lineHeight: '1.4' },
    body: { fontSize: 'var(--fontSizeMedium)', fontWeight: '400', lineHeight: '1.5' },
    caption: { fontSize: 'var(--fontSizeSmall)', fontWeight: '400', lineHeight: '1.4' },
    overline: { fontSize: 'var(--fontSizeXSmall)', fontWeight: '600', lineHeight: '1.5' },
    code: { fontSize: 'var(--fontSizeSmall)', fontWeight: '400', lineHeight: '1.5' },
};

const FONT_WEIGHT_MAP: Record<string, string> = {
    normal: '400', medium: '500', semibold: '600', bold: '700',
};

const ALIGN_MAP: Record<string, string> = {
    start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch',
    between: 'space-between', around: 'space-around', evenly: 'space-evenly',
};

// ---------------------------------------------------------------------------
// Tag + class resolution for FluentLM components
// ---------------------------------------------------------------------------

export function createFluentLMAdapter(): CoreLMAdapter {
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
                const c = tokens.border.color ? (COLOR_MAP[tokens.border.color] ?? tokens.border.color) : 'var(--neutralLight)';
                css['border'] = `${w}px ${s} ${c}`;
            }
            if (tokens.shadow) css['box-shadow'] = SHADOW_MAP[tokens.shadow] ?? 'none';
            if (tokens.color) css['color'] = COLOR_MAP[tokens.color] ?? tokens.color;
            if (tokens.bg) css['background-color'] = BG_COLOR_MAP[tokens.bg] ?? tokens.bg;
            if (tokens.typography) {
                const t = TYPOGRAPHY_MAP[tokens.typography];
                if (t) {
                    css['font-size'] = t.fontSize;
                    css['font-weight'] = t.fontWeight;
                    css['line-height'] = t.lineHeight;
                    if (tokens.typography === 'code') css['font-family'] = 'var(--fontFamilyMonospace, monospace)';
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
            const attrs: Record<string, string> = {};

            switch (type) {
                case 'App':
                    return { tag: 'div', attrs: { class: 'flm-app' } };
                case 'Page':
                    return { tag: 'main', attrs: { class: 'flm-page' } };
                case 'Section':
                    return { tag: 'section', attrs: { class: 'flm-section' } };
                case 'Box':
                    return { tag: 'div', attrs: { class: 'flm-box' } };
                case 'Stack':
                    return { tag: 'div', attrs: { class: 'flm-stack' } };
                case 'Grid': {
                    const cols = props.columns ?? 'auto';
                    attrs['class'] = 'flm-grid';
                    attrs['style'] = `grid-template-columns:${typeof cols === 'number' ? `repeat(${cols}, 1fr)` : String(cols)}`;
                    return { tag: 'div', attrs };
                }
                case 'Cluster':
                    return { tag: 'div', attrs: { class: 'flm-cluster', style: 'display:flex;flex-wrap:wrap' } };
                case 'Spacer': {
                    const size = props.size ?? '1rem';
                    return { tag: 'div', attrs: { 'aria-hidden': 'true', style: `height:${size};flex-shrink:0` } };
                }
                case 'Divider':
                    return { tag: 'hr', attrs: { class: 'flm-divider' } };
                case 'Heading': {
                    const level = typeof props.level === 'number' ? props.level : 2;
                    return { tag: `h${Math.min(Math.max(level, 1), 6)}`, attrs: {} };
                }
                case 'Text':
                    return { tag: 'p', attrs: {} };
                case 'RichText':
                    return { tag: 'div', attrs: { class: 'flm-richtext' } };
                case 'Image':
                    if (props.src) attrs['src'] = String(props.src);
                    if (props.alt) attrs['alt'] = String(props.alt);
                    return { tag: 'img', attrs };
                case 'Icon':
                    if (props.name) attrs['data-icon'] = String(props.name);
                    return { tag: 'span', attrs };
                case 'Button': {
                    attrs['class'] = 'flm-button';
                    const variant = props.variant;
                    if (variant === 'primary') attrs['class'] = 'flm-button flm-button--primary';
                    else if (variant === 'subtle') attrs['class'] = 'flm-button flm-button--subtle';
                    else if (variant === 'icon') attrs['class'] = 'flm-button flm-button--icon';
                    if (props.disabled) attrs['disabled'] = '';
                    if (props.icon) attrs['data-icon'] = String(props.icon);
                    return { tag: 'button', attrs };
                }
                case 'Link':
                    if (props.href) attrs['href'] = String(props.href);
                    if (props.target) attrs['target'] = String(props.target);
                    return { tag: 'a', attrs };
                case 'Form':
                    attrs['class'] = 'flm-form';
                    if (props.action) attrs['action'] = String(props.action);
                    if (props.method) attrs['method'] = String(props.method);
                    return { tag: 'form', attrs };
                case 'Input': {
                    attrs['class'] = 'flm-textfield-input';
                    attrs['type'] = String(props.inputType ?? props.type ?? 'text');
                    if (props.placeholder) attrs['placeholder'] = String(props.placeholder);
                    if (props.name) attrs['name'] = String(props.name);
                    if (props.value !== undefined) attrs['value'] = String(props.value);
                    if (props.required) attrs['required'] = '';
                    if (props.disabled) attrs['disabled'] = '';
                    return { tag: 'input', attrs };
                }
                case 'Select':
                    attrs['class'] = 'flm-dropdown-select';
                    if (props.name) attrs['name'] = String(props.name);
                    if (props.disabled) attrs['disabled'] = '';
                    return { tag: 'select', attrs };
                case 'Checkbox':
                    attrs['class'] = 'flm-checkbox';
                    return { tag: 'label', attrs };
                case 'Card':
                    return { tag: 'div', attrs: { class: 'flm-card' } };
                case 'List':
                    return { tag: 'ul', attrs: { class: 'flm-list' } };
                case 'Table':
                    return { tag: 'table', attrs: { class: 'flm-table' } };
                case 'Badge':
                    return { tag: 'span', attrs: { class: 'flm-badge' } };
                case 'Animate':
                    return { tag: 'div', attrs: { class: 'flm-animate' } };
                case 'Disclosure':
                    return { tag: 'details', attrs: { class: 'flm-disclosure' } };
                case 'Tabs':
                    return { tag: 'div', attrs: { class: 'flm-pivot' } };
                case 'Dialog': {
                    attrs['class'] = 'flm-dialog';
                    attrs['role'] = 'dialog';
                    attrs['aria-modal'] = 'true';
                    if (props.open) attrs['open'] = '';
                    return { tag: 'dialog', attrs };
                }
                case 'ToastRegion':
                    return { tag: 'div', attrs: { class: 'flm-toast-region', 'aria-live': 'polite' } };
                default:
                    return { tag: 'div', attrs: {} };
            }
        },

        assets() {
            return {
                styles: [
                    '/frameworks/fluentlm/fluentlm.min.css',
                    '/frameworks/fluentlm/theme-light.css',
                ],
                scripts: ['/frameworks/fluentlm/fluentlm.min.js'],
            };
        },
    };
}
