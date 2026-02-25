import * as cheerio from 'cheerio';
import type { AnyNode } from 'domhandler';

/**
 * Remove duplicate inline `<script>` blocks using a two-pass approach.
 *
 * **Pass 1 — ID-based dedup (deterministic):**
 * Groups inline scripts by their `id` attribute. If any group has 2+ scripts
 * with the same id, all but the **last** are removed.
 *
 * **Pass 2 — Declaration-overlap dedup (heuristic fallback):**
 * For scripts with no `id`, no `src`, and no `type="application/json"`,
 * compares top-level declaration names. When overlap >= 60% of the smaller
 * set (minimum 2 declarations each), the **first** script is removed.
 */
export function deduplicateInlineScripts(html: string): string {
    const $ = cheerio.load(html);

    const SYSTEM_IDS = new Set(['page-info', 'page-helpers', 'page-script', 'error']);

    // ── Pass 1: ID-based dedup ──────────────────────────────────────────
    const idGroups = new Map<string, cheerio.Cheerio<AnyNode>[]>();
    $('script').each(function (_, rawEl) {
        const el = $(rawEl);
        if (el.attr('src')) return;
        const id = el.attr('id');
        if (!id || SYSTEM_IDS.has(id)) return;

        if (!idGroups.has(id)) {
            idGroups.set(id, []);
        }
        idGroups.get(id)!.push(el);
    });

    for (const [, group] of idGroups) {
        if (group.length < 2) continue;
        for (let i = 0; i < group.length - 1; i++) {
            group[i].remove();
        }
    }

    // ── Pass 2: Declaration-overlap dedup (fallback for id-less scripts) ─
    interface ScriptInfo {
        el: cheerio.Cheerio<AnyNode>;
        declarations: Set<string>;
    }

    const declPattern = /(?:^|;|\n)\s*(?:let|const|var|function|class)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;

    const scripts: ScriptInfo[] = [];
    $('script').each(function (_, rawEl) {
        const el = $(rawEl);
        if (el.attr('src')) return;
        if (el.attr('id')) return;
        if ((el.attr('type') ?? '').toLowerCase() === 'application/json') return;

        const code = (el.html() ?? '').trim();
        if (!code) return;

        const declarations = new Set<string>();
        let m: RegExpExecArray | null;
        declPattern.lastIndex = 0;
        while ((m = declPattern.exec(code)) !== null) {
            declarations.add(m[1]);
        }

        scripts.push({ el, declarations });
    });

    // Compare each pair; mark earlier script for removal when overlap is high
    const toRemove = new Set<number>();
    for (let i = 0; i < scripts.length; i++) {
        if (toRemove.has(i)) continue;
        for (let j = i + 1; j < scripts.length; j++) {
            if (toRemove.has(j)) continue;

            const a = scripts[i].declarations;
            const b = scripts[j].declarations;

            // Both must have at least 2 declarations
            if (a.size < 2 || b.size < 2) continue;

            // Count overlap
            let overlap = 0;
            for (const name of a) {
                if (b.has(name)) overlap++;
            }

            const smallerSize = Math.min(a.size, b.size);
            if (overlap / smallerSize >= 0.6) {
                // Remove the first (older) script, keep the last (LLM fix)
                toRemove.add(i);
                break; // script i is already marked, move on
            }
        }
    }

    // Remove marked scripts
    for (const idx of toRemove) {
        scripts[idx].el.remove();
    }

    return $.html();
}

/**
 * Ensure `#page-helpers` and `#page-script` are the last children of <body>,
 * in that order. The LLM may move them during transformation; this guarantees
 * they always execute after the DOM is fully parsed.
 */
export function ensureScriptsBeforeBodyClose(html: string): string {
    const $ = cheerio.load(html);
    const body = $('body');
    if (body.length === 0) return html;

    // Capture outer HTML before removing so we can re-append
    const helpers = $('script#page-helpers');
    const pageScript = $('script#page-script');

    const helpersHtml = helpers.length > 0 ? $.html(helpers) : '';
    const pageScriptHtml = pageScript.length > 0 ? $.html(pageScript) : '';

    // Remove from current position and re-append at end of <body>
    if (helpers.length > 0) helpers.remove();
    if (pageScript.length > 0) pageScript.remove();
    if (helpersHtml) body.append(helpersHtml);
    if (pageScriptHtml) body.append(pageScriptHtml);

    return $.html();
}

/**
 * Inject an error script block into the page HTML.
 */
export function injectError(html: string, message: string, details: string): string {
    const $ = cheerio.load(html);
    const errorPayload = JSON.stringify({ message, details });
    const scriptTag = `<script id="error" type="application/json">${errorPayload}</script>`;

    // Remove any existing error block first
    $('script#error').remove();

    // Inject before closing </body> or at end
    if ($('body').length > 0) {
        $('body').append(scriptTag);
    } else {
        return html + scriptTag;
    }

    return $.html();
}

/**
 * Lightweight markdown-to-HTML converter for chat reply text.
 * Handles: code blocks, inline code, bold, italic, links, unordered/ordered lists, paragraphs.
 */
export function simpleMarkdown(text: string): string {
    // Extract fenced code blocks first to protect their contents
    const codeBlocks: string[] = [];
    let processed = text.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
        const idx = codeBlocks.length;
        const escaped = escapeHtml(code.replace(/\n$/, ''));
        const langAttr = lang ? ` class="language-${escapeHtml(lang)}"` : '';
        codeBlocks.push(`<pre><code${langAttr}>${escaped}</code></pre>`);
        return `\x00CODEBLOCK${idx}\x00`;
    });

    // Split into paragraphs by blank lines
    const blocks = processed.split(/\n{2,}/);
    const htmlBlocks: string[] = [];

    for (const block of blocks) {
        const trimmed = block.trim();
        if (!trimmed) continue;

        // Code block placeholder
        if (/^\x00CODEBLOCK\d+\x00$/.test(trimmed)) {
            htmlBlocks.push(trimmed);
            continue;
        }

        // Unordered list (lines starting with - or *)
        if (/^[\-\*] /m.test(trimmed) && trimmed.split('\n').every(l => /^[\-\*] /.test(l.trim()) || l.trim() === '')) {
            const items = trimmed.split('\n')
                .map(l => l.trim())
                .filter(l => l)
                .map(l => `<li>${inlineMarkdown(l.replace(/^[\-\*] /, ''))}</li>`)
                .join('');
            htmlBlocks.push(`<ul>${items}</ul>`);
            continue;
        }

        // Ordered list (lines starting with 1. 2. etc.)
        if (/^\d+\. /m.test(trimmed) && trimmed.split('\n').every(l => /^\d+\. /.test(l.trim()) || l.trim() === '')) {
            const items = trimmed.split('\n')
                .map(l => l.trim())
                .filter(l => l)
                .map(l => `<li>${inlineMarkdown(l.replace(/^\d+\. /, ''))}</li>`)
                .join('');
            htmlBlocks.push(`<ol>${items}</ol>`);
            continue;
        }

        // Regular paragraph
        htmlBlocks.push(`<p>${inlineMarkdown(trimmed.replace(/\n/g, '<br>'))}</p>`);
    }

    // Restore code blocks
    let result = htmlBlocks.join('');
    result = result.replace(/\x00CODEBLOCK(\d+)\x00/g, (_m, idx) => codeBlocks[parseInt(idx)]);
    return result;
}

/** Apply inline markdown formatting: bold, italic, inline code, links. */
function inlineMarkdown(text: string): string {
    // Inline code (protect from further processing)
    const codes: string[] = [];
    let result = text.replace(/`([^`]+)`/g, (_m, code) => {
        const idx = codes.length;
        codes.push(`<code>${escapeHtml(code)}</code>`);
        return `\x00CODE${idx}\x00`;
    });

    // Bold (**text** or __text__)
    result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    result = result.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic (*text* or _text_)
    result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');
    result = result.replace(/(?<!\w)_(.+?)_(?!\w)/g, '<em>$1</em>');

    // Links [text](url)
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Restore inline code
    result = result.replace(/\x00CODE(\d+)\x00/g, (_m, idx) => codes[parseInt(idx)]);

    return result;
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/**
 * Find `needle` in `haystack` using whitespace-normalized comparison.
 * Collapses runs of whitespace into a single space for comparison purposes
 * but returns the position in the original string.
 * Returns null if no match found.
 */
export function normalizedIndexOf(haystack: string, needle: string): { start: number; end: number } | null {
    // Build a mapping from normalized-string positions to original-string positions
    const normChars: string[] = [];
    const origPositions: number[] = []; // origPositions[i] = original index of normChars[i]
    let inWhitespace = false;

    for (let i = 0; i < haystack.length; i++) {
        const ch = haystack[i];
        if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
            if (!inWhitespace) {
                normChars.push(' ');
                origPositions.push(i);
                inWhitespace = true;
            }
        } else {
            normChars.push(ch);
            origPositions.push(i);
            inWhitespace = false;
        }
    }

    const normHaystack = normChars.join('');

    // Normalize the needle the same way
    const normNeedle = needle.replace(/\s+/g, ' ');

    const idx = normHaystack.indexOf(normNeedle);
    if (idx === -1) return null;

    const start = origPositions[idx];
    // The end position: find the original position of the last matched char, then go one past
    const lastNormIdx = idx + normNeedle.length - 1;
    const lastOrigPos = origPositions[lastNormIdx];
    // Advance past any trailing whitespace that was collapsed in the original
    let end = lastOrigPos + 1;
    if (haystack[lastOrigPos] === ' ' || haystack[lastOrigPos] === '\t' || haystack[lastOrigPos] === '\n' || haystack[lastOrigPos] === '\r') {
        // The last matched normalized char was a whitespace collapse — extend to include all original whitespace
        while (end < haystack.length && (haystack[end] === ' ' || haystack[end] === '\t' || haystack[end] === '\n' || haystack[end] === '\r')) {
            end++;
        }
    }

    return { start, end };
}
