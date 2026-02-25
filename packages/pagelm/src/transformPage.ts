import * as cheerio from 'cheerio';
import { AgentCompletion, ContextSection } from './builder';
import { TransformPageArgs, TransformPageResult, ChangeList, InlineQA } from './types';
import { assignNodeIds, stripNodeIds } from './nodeIds';
import { deduplicateInlineScripts, ensureScriptsBeforeBodyClose, injectError, simpleMarkdown } from './htmlUtils';
import { normalizedIndexOf } from './htmlUtils';

/**
 * Core page transformation orchestrator.
 *
 * 1. Assigns data-node-id to every element
 * 2. Calls the builder to generate change operations
 * 3. Applies changes and cleans up the HTML
 */
export async function transformPage(args: TransformPageArgs): Promise<AgentCompletion<TransformPageResult>> {
    const { message, builder, additionalSections } = args;
    const pageState = args.pageState;

    // 1. Assign data-node-id to every element
    const { html: annotatedHtml } = assignNodeIds(pageState);

    try {
        // 2. Build CURRENT_PAGE section
        const currentPage: ContextSection = {
            title: '<CURRENT_PAGE>',
            content: annotatedHtml,
            instructions: '',
        };

        // 3. Determine newBuild: if isBuilder, count children in the chat feed
        let newBuild = false;
        if (args.isBuilder && args.inlineQA) {
            const $ = cheerio.load(annotatedHtml);
            const messageCount = $(`${args.inlineQA.feedSelector} > *`).length;
            newBuild = messageCount <= 1;
        }

        // 4. Call builder
        const result = await builder.run(currentPage, additionalSections, message, newBuild, args.attachments);

        // 5. Switch on result kind
        switch (result.kind) {
            case 'transforms': {
                const applied = applyChangeList(annotatedHtml, result.changes);
                const clean = stripNodeIds(applied);
                const deduped = deduplicateInlineScripts(clean);
                const safe = ensureScriptsBeforeBodyClose(deduped);
                return { completed: true, value: { html: safe, changeCount: result.changes.length } };
            }
            case 'reply': {
                const withReply = args.inlineQA
                    ? appendInlineQA(annotatedHtml, message, result.text, args.inlineQA)
                    : annotatedHtml;
                const clean = stripNodeIds(withReply);
                const deduped = deduplicateInlineScripts(clean);
                const safe = ensureScriptsBeforeBodyClose(deduped);
                return { completed: true, value: { html: safe, changeCount: 0 } };
            }
            case 'error': {
                const cleanOriginal = stripNodeIds(annotatedHtml);
                const errorMessage = result.error.message;
                const errorHtml = injectError(cleanOriginal, 'Something went wrong try again', errorMessage);
                return { completed: true, value: { html: errorHtml, changeCount: 0 } };
            }
            default: {
                // Handle unknown result kinds (e.g. coreOps sent to HTML-mode orchestrator)
                const cleanOriginal = stripNodeIds(annotatedHtml);
                return { completed: true, value: { html: cleanOriginal, changeCount: 0 } };
            }
        }
    } catch (err: unknown) {
        // On any error: return original page with error block injected
        const cleanOriginal = stripNodeIds(annotatedHtml);
        const errorMessage = err instanceof Error ? err.message : String(err);
        const errorHtml = injectError(cleanOriginal, 'Something went wrong try again', errorMessage);
        return { completed: true, value: { html: errorHtml, changeCount: 0 } };
    }
}

// ---------------------------------------------------------------------------
// Inline Q&A — append question + answer to the chat feed
// ---------------------------------------------------------------------------

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function appendInlineQA(html: string, userMessage: string, answerText: string, qa: InlineQA): string {
    const $ = cheerio.load(html);
    const feed = $(qa.feedSelector);
    if (feed.length === 0) return html;

    const questionContent = qa.markdown ? simpleMarkdown(userMessage) : escapeHtml(userMessage);
    const answerContent = qa.markdown ? simpleMarkdown(answerText) : escapeHtml(answerText);

    feed.append(qa.questionTemplate.replace('{{message}}', questionContent));
    feed.append(qa.answerTemplate.replace('{{message}}', answerContent));

    return $.html();
}

// ---------------------------------------------------------------------------
// Change list application
// ---------------------------------------------------------------------------

/**
 * Check whether an element has the `data-locked` attribute.
 */
function isElementLocked(el: ReturnType<cheerio.CheerioAPI>): boolean {
    return el.attr('data-locked') !== undefined;
}

/**
 * Apply a list of CRUD operations to annotated HTML (elements must have `data-node-id`).
 */
export function applyChangeList(html: string, changes: ChangeList): string {
    const $ = cheerio.load(html);

    for (const change of changes) {
        switch (change.op) {
            case 'update': {
                const el = $(`[data-node-id="${change.nodeId}"]`);
                if (el.length === 0) break;
                el.html(change.html);
                break;
            }
            case 'replace': {
                const el = $(`[data-node-id="${change.nodeId}"]`);
                if (el.length === 0) break;
                if (isElementLocked(el)) break;
                el.replaceWith(change.html);
                break;
            }
            case 'delete': {
                const el = $(`[data-node-id="${change.nodeId}"]`);
                if (el.length === 0) break;
                if (isElementLocked(el)) break;
                el.remove();
                break;
            }
            case 'insert': {
                const parent = $(`[data-node-id="${change.parentId}"]`);
                if (parent.length === 0) throw new Error(`insert: parent node ${change.parentId} not found`);
                switch (change.position) {
                    case 'prepend': parent.prepend(change.html); break;
                    case 'append': parent.append(change.html); break;
                    case 'before': parent.before(change.html); break;
                    case 'after': parent.after(change.html); break;
                    default: throw new Error(`insert: unknown position "${(change as any).position}"`);
                }
                break;
            }
            case 'style-element': {
                const el = $(`[data-node-id="${change.nodeId}"]`);
                if (el.length === 0) break;
                if (isElementLocked(el)) break;
                el.attr('style', change.style);
                break;
            }
            case 'search-replace': {
                const el = $(`[data-node-id="${change.nodeId}"]`);
                if (el.length === 0) break;
                const content = el.html() ?? '';
                const exactIdx = content.indexOf(change.search);
                if (exactIdx !== -1) {
                    el.html(content.slice(0, exactIdx) + change.replace + content.slice(exactIdx + change.search.length));
                } else {
                    const norm = normalizedIndexOf(content, change.search);
                    if (norm) {
                        el.html(content.slice(0, norm.start) + change.replace + content.slice(norm.end));
                    }
                }
                break;
            }
            case 'search-insert': {
                const el = $(`[data-node-id="${change.nodeId}"]`);
                if (el.length === 0) break;
                const content = el.html() ?? '';
                const exactIdx = content.indexOf(change.after);
                if (exactIdx !== -1) {
                    const insertPos = exactIdx + change.after.length;
                    el.html(content.slice(0, insertPos) + change.content + content.slice(insertPos));
                } else {
                    const norm = normalizedIndexOf(content, change.after);
                    if (norm) {
                        el.html(content.slice(0, norm.end) + change.content + content.slice(norm.end));
                    }
                }
                break;
            }
            default:
                throw new Error(`Unknown change op: "${(change as any).op}"`);
        }
    }

    return $.html();
}
