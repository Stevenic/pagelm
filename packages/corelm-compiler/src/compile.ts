// ---------------------------------------------------------------------------
// CoreLM compiler — CoreDocument → HTML string
// ---------------------------------------------------------------------------

import type { CoreDocument, CoreNode, MotionSpec } from '@pagelm/corelm';
import type { CoreLMAdapter } from './adapter';
import { getCoreLMRuntime } from './runtime';

// Void elements that must not have closing tags
const VOID_ELEMENTS = new Set(['img', 'input', 'br', 'hr', 'meta', 'link']);

// ---------------------------------------------------------------------------
// Motion preset CSS keyframes
// ---------------------------------------------------------------------------

const MOTION_PRESETS: Record<string, string> = {
    fadeIn: '@keyframes core-motion-fadeIn{from{opacity:0}to{opacity:1}} .core-motion-fadeIn{animation:core-motion-fadeIn 0.3s ease forwards}',
    fadeOut: '@keyframes core-motion-fadeOut{from{opacity:1}to{opacity:0}} .core-motion-fadeOut{animation:core-motion-fadeOut 0.3s ease forwards}',
    slideUp: '@keyframes core-motion-slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}} .core-motion-slideUp{animation:core-motion-slideUp 0.3s ease forwards}',
    slideDown: '@keyframes core-motion-slideDown{from{transform:translateY(-20px);opacity:0}to{transform:translateY(0);opacity:1}} .core-motion-slideDown{animation:core-motion-slideDown 0.3s ease forwards}',
    slideLeft: '@keyframes core-motion-slideLeft{from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}} .core-motion-slideLeft{animation:core-motion-slideLeft 0.3s ease forwards}',
    slideRight: '@keyframes core-motion-slideRight{from{transform:translateX(-20px);opacity:0}to{transform:translateX(0);opacity:1}} .core-motion-slideRight{animation:core-motion-slideRight 0.3s ease forwards}',
    scaleIn: '@keyframes core-motion-scaleIn{from{transform:scale(0.9);opacity:0}to{transform:scale(1);opacity:1}} .core-motion-scaleIn{animation:core-motion-scaleIn 0.3s ease forwards}',
    scaleOut: '@keyframes core-motion-scaleOut{from{transform:scale(1);opacity:1}to{transform:scale(0.9);opacity:0}} .core-motion-scaleOut{animation:core-motion-scaleOut 0.3s ease forwards}',
    bounce: '@keyframes core-motion-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}} .core-motion-bounce{animation:core-motion-bounce 0.5s ease}',
    shake: '@keyframes core-motion-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}} .core-motion-shake{animation:core-motion-shake 0.4s ease}',
    pulse: '@keyframes core-motion-pulse{0%,100%{opacity:1}50%{opacity:0.5}} .core-motion-pulse{animation:core-motion-pulse 1s ease infinite}',
    spin: '@keyframes core-motion-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} .core-motion-spin{animation:core-motion-spin 1s linear infinite}',
};

// Toast CSS styles
const TOAST_CSS = `.core-toast-region,.flm-toast-region{position:fixed;bottom:1rem;right:1rem;z-index:10000;display:flex;flex-direction:column;gap:0.5rem}
.core-toast{padding:0.75rem 1rem;border-radius:6px;color:#fff;opacity:0;transition:opacity 0.3s;font-size:0.9rem;max-width:360px;box-shadow:0 4px 12px rgba(0,0,0,0.15)}
.core-toast--show{opacity:1}
.core-toast--info{background:#0078d4}
.core-toast--success{background:#28a745}
.core-toast--warning{background:#ffc107;color:#212529}
.core-toast--danger{background:#dc3545}`;

// ---------------------------------------------------------------------------
// Main compiler
// ---------------------------------------------------------------------------

/**
 * Compile a CoreDocument into a full HTML page string.
 */
export function compileDocument(doc: CoreDocument, adapter: CoreLMAdapter): string {
    const usedPresets = new Set<string>();
    const hasToast = hasNodeType(doc.app, 'ToastRegion');
    const hasEvents = hasAnyEvents(doc.app);
    const hasMotion = hasAnyMotion(doc.app);

    // Collect used motion presets
    collectMotionPresets(doc.app, usedPresets);

    // Build head
    const headParts: string[] = [];
    headParts.push('<meta charset="UTF-8">');
    headParts.push('<meta name="viewport" content="width=device-width, initial-scale=1.0">');

    const title = doc.app.props?.title ?? 'CoreLM Page';
    headParts.push(`<title>${escapeHtml(String(title))}</title>`);

    // Adapter assets
    const assets = adapter.assets();
    for (const href of assets.styles) {
        headParts.push(`<link rel="stylesheet" href="${escapeAttr(href)}">`);
    }

    // Document-level assets
    if (doc.assets?.styles) {
        for (const href of doc.assets.styles) {
            headParts.push(`<link rel="stylesheet" href="${escapeAttr(href)}">`);
        }
    }

    // Motion preset CSS
    if (usedPresets.size > 0) {
        const presetCss = Array.from(usedPresets)
            .map(p => MOTION_PRESETS[p])
            .filter(Boolean)
            .join('\n');
        if (presetCss) {
            headParts.push(`<style id="core-motion-presets">\n${presetCss}\n</style>`);
        }
    }

    // Toast CSS
    if (hasToast) {
        headParts.push(`<style id="core-toast-styles">\n${TOAST_CSS}\n</style>`);
    }

    // Build body
    const bodyContent = compileNode(doc.app, adapter);

    // Scripts
    const scriptParts: string[] = [];

    // Adapter scripts
    for (const src of assets.scripts) {
        scriptParts.push(`<script src="${escapeAttr(src)}"></script>`);
    }

    // Document-level scripts
    if (doc.assets?.scripts) {
        for (const src of doc.assets.scripts) {
            scriptParts.push(`<script src="${escapeAttr(src)}"></script>`);
        }
    }

    // State initialization
    if (doc.app.props?.state) {
        scriptParts.push(`<script id="core-state-init">window.__coreState = ${JSON.stringify(doc.app.props.state)};</script>`);
    }

    // CoreLM runtime (only if events or motion exist)
    if (hasEvents || hasMotion) {
        scriptParts.push(`<script id="core-runtime">\n${getCoreLMRuntime()}\n</script>`);
    }

    // Script modules (escape hatch)
    if (doc.modules) {
        for (const mod of doc.modules) {
            scriptParts.push(`<script type="module" id="core-module-${escapeAttr(mod.id)}">\n${mod.source}\n</script>`);
        }
    }

    const lang = doc.app.props?.lang ?? 'en';

    return [
        '<!DOCTYPE html>',
        `<html lang="${escapeAttr(String(lang))}">`,
        '<head>',
        headParts.join('\n'),
        '</head>',
        '<body>',
        bodyContent,
        scriptParts.join('\n'),
        '</body>',
        '</html>',
    ].join('\n');
}

// ---------------------------------------------------------------------------
// Node compiler
// ---------------------------------------------------------------------------

function compileNode(node: CoreNode, adapter: CoreLMAdapter): string {
    const props = node.props ?? {};
    const { tag, attrs } = adapter.resolveTag(node.type, props);

    // Resolve style tokens → CSS declarations
    const styleCss = node.style ? adapter.resolveStyle(node.style) : {};

    // Merge adapter-provided style with token styles
    const existingStyle = attrs['style'] ?? '';
    const tokenStyle = Object.entries(styleCss).map(([k, v]) => `${k}:${v}`).join(';');
    const combinedStyle = [existingStyle, tokenStyle].filter(Boolean).join(';');
    if (combinedStyle) {
        attrs['style'] = combinedStyle;
    }

    // Add data-core-id for runtime targeting
    attrs['data-core-id'] = node.id;

    // Add event bindings as data attribute
    if (node.events && node.events.length > 0) {
        attrs['data-core-events'] = JSON.stringify(node.events);
    }

    // Add motion spec as data attribute
    if (node.motion) {
        attrs['data-core-motion'] = JSON.stringify(node.motion);
    }

    // ARIA props
    if (props.ariaLabel) attrs['aria-label'] = String(props.ariaLabel);
    if (props.ariaDescribedBy) attrs['aria-describedby'] = String(props.ariaDescribedBy);
    if (props.role) attrs['role'] = String(props.role);
    if (props.id) attrs['id'] = String(props.id);

    // Build attribute string
    const attrStr = Object.entries(attrs)
        .map(([k, v]) => v === '' ? k : `${k}="${escapeAttr(v)}"`)
        .join(' ');

    const openTag = attrStr ? `<${tag} ${attrStr}>` : `<${tag}>`;

    // Void elements
    if (VOID_ELEMENTS.has(tag)) {
        return openTag;
    }

    // Content: text and/or children
    const parts: string[] = [];

    // Special handling for certain node types
    if (node.type === 'Checkbox') {
        const checked = props.checked ? ' checked' : '';
        const name = props.name ? ` name="${escapeAttr(String(props.name))}"` : '';
        parts.push(`<input type="checkbox" class="flm-checkbox-input"${checked}${name}>`);
        if (node.text) parts.push(`<span class="flm-checkbox-label">${escapeHtml(node.text)}</span>`);
    } else if (node.type === 'Select' && Array.isArray(props.options)) {
        for (const opt of props.options as Array<{ value: string; label: string; selected?: boolean }>) {
            const sel = opt.selected ? ' selected' : '';
            parts.push(`<option value="${escapeAttr(opt.value)}"${sel}>${escapeHtml(opt.label)}</option>`);
        }
    } else if (node.type === 'Table' && Array.isArray(props.headers)) {
        parts.push('<thead><tr>');
        for (const h of props.headers as string[]) {
            parts.push(`<th>${escapeHtml(h)}</th>`);
        }
        parts.push('</tr></thead>');
        if (Array.isArray(props.rows)) {
            parts.push('<tbody>');
            for (const row of props.rows as string[][]) {
                parts.push('<tr>');
                for (const cell of row) {
                    parts.push(`<td>${escapeHtml(String(cell))}</td>`);
                }
                parts.push('</tr>');
            }
            parts.push('</tbody>');
        }
    } else if (node.type === 'Tabs' && Array.isArray(props.tabs)) {
        parts.push('<div class="flm-pivot-tabs" role="tablist">');
        const tabs = props.tabs as Array<{ id: string; label: string; active?: boolean }>;
        for (const tab of tabs) {
            const activeClass = tab.active ? ' flm-pivot-tab--active' : '';
            parts.push(`<button class="flm-pivot-tab${activeClass}" role="tab" data-panel="${escapeAttr(tab.id)}">${escapeHtml(tab.label)}</button>`);
        }
        parts.push('</div>');
    } else if (node.type === 'Disclosure') {
        if (props.summary) {
            parts.push(`<summary>${escapeHtml(String(props.summary))}</summary>`);
        }
    } else if (node.type === 'Dialog') {
        if (props.title) {
            parts.push(`<div class="flm-dialog-header"><h2 class="flm-dialog-title">${escapeHtml(String(props.title))}</h2></div>`);
            parts.push('<div class="flm-dialog-body">');
        }
    } else if (node.type === 'RichText' && node.text) {
        // RichText text is treated as pre-formatted HTML
        parts.push(node.text);
    } else if (node.text) {
        parts.push(escapeHtml(node.text));
    }

    // Compile children
    if (node.children) {
        for (const child of node.children) {
            parts.push(compileNode(child, adapter));
        }
    }

    // Close dialog body wrapper if we opened one
    if (node.type === 'Dialog' && props.title) {
        parts.push('</div>');
    }

    return `${openTag}${parts.join('')}</${tag}>`;
}

// ---------------------------------------------------------------------------
// Tree inspection helpers
// ---------------------------------------------------------------------------

function hasNodeType(node: CoreNode, type: string): boolean {
    if (node.type === type) return true;
    return (node.children ?? []).some(c => hasNodeType(c, type));
}

function hasAnyEvents(node: CoreNode): boolean {
    if (node.events && node.events.length > 0) return true;
    return (node.children ?? []).some(c => hasAnyEvents(c));
}

function hasAnyMotion(node: CoreNode): boolean {
    if (node.motion) return true;
    return (node.children ?? []).some(c => hasAnyMotion(c));
}

function collectMotionPresets(node: CoreNode, presets: Set<string>): void {
    if (node.motion && node.motion.mode === 'preset') {
        presets.add(node.motion.preset);
    }
    if (node.children) {
        for (const child of node.children) {
            collectMotionPresets(child, presets);
        }
    }
}

// ---------------------------------------------------------------------------
// Escaping utilities
// ---------------------------------------------------------------------------

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function escapeAttr(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
