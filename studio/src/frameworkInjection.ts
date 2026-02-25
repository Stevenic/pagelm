import type { PageSettings } from './workspace.js';

// ---------------------------------------------------------------------------
// Framework asset maps
// ---------------------------------------------------------------------------

interface FrameworkAssets {
    css: string[];
    js: string[];
}

const FRAMEWORK_ASSETS: Record<string, FrameworkAssets> = {
    fluentlm: {
        css: [
            '/frameworks/fluentlm/fluentlm.min.css',
            '/frameworks/fluentlm/theme-light.css',
            '/frameworks/fluentlm/theme-dark.css',
        ],
        js: ['/frameworks/fluentlm/fluentlm.min.js'],
    },
};

export function getFrameworkAssets(framework: string): FrameworkAssets {
    return FRAMEWORK_ASSETS[framework] ?? { css: [], js: [] };
}

// ---------------------------------------------------------------------------
// Fenced-block markers
// ---------------------------------------------------------------------------

const FW_BEGIN = '<!-- pagelm:framework:begin -->';
const FW_END = '<!-- pagelm:framework:end -->';
const EXT_BEGIN = '<!-- pagelm:external:begin -->';
const EXT_END = '<!-- pagelm:external:end -->';

// ---------------------------------------------------------------------------
// Strip
// ---------------------------------------------------------------------------

const FENCED_RE = /<!-- pagelm:(framework|external):begin -->[\s\S]*?<!-- pagelm:\1:end -->\n?/g;

export function stripInjectedSections(html: string): string {
    return html.replace(FENCED_RE, '');
}

// ---------------------------------------------------------------------------
// Build fenced blocks
// ---------------------------------------------------------------------------

function buildFrameworkBlock(framework: string): string {
    const assets = getFrameworkAssets(framework);
    if (assets.css.length === 0 && assets.js.length === 0) return '';
    const lines: string[] = [FW_BEGIN];
    for (const href of assets.css) {
        lines.push(`<link rel="stylesheet" href="${href}">`);
    }
    for (const src of assets.js) {
        lines.push(`<script src="${src}"></script>`);
    }
    lines.push(FW_END);
    return lines.join('\n');
}

function buildExternalBlock(settings: PageSettings): string {
    const styles = settings.externalStyles ?? [];
    const scripts = settings.externalScripts ?? [];
    if (styles.length === 0 && scripts.length === 0) return '';
    const lines: string[] = [EXT_BEGIN];
    for (const href of styles) {
        lines.push(`<link rel="stylesheet" href="${href}">`);
    }
    for (const src of scripts) {
        lines.push(`<script src="${src}"></script>`);
    }
    lines.push(EXT_END);
    return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Inject
// ---------------------------------------------------------------------------

export function injectFrameworkAndExternals(html: string, settings: PageSettings): string {
    // Strip any existing fenced blocks first
    let result = stripInjectedSections(html);

    const fwBlock = buildFrameworkBlock(settings.framework);
    const extBlock = buildExternalBlock(settings);
    const injection = [fwBlock, extBlock].filter(Boolean).join('\n');

    if (!injection) return result;

    // Try to insert after </title>
    const titleCloseIdx = result.indexOf('</title>');
    if (titleCloseIdx !== -1) {
        const insertPos = titleCloseIdx + '</title>'.length;
        result = result.slice(0, insertPos) + '\n' + injection + result.slice(insertPos);
        return result;
    }

    // Fallback: insert before </head>
    const headCloseIdx = result.indexOf('</head>');
    if (headCloseIdx !== -1) {
        result = result.slice(0, headCloseIdx) + injection + '\n' + result.slice(headCloseIdx);
        return result;
    }

    // No <head>: return as-is (shouldn't happen for well-formed HTML)
    return result;
}
