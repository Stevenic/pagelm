import * as cheerio from 'cheerio';
import type { AnyNode } from 'domhandler';

/**
 * Assign sequential `data-node-id` to every element in the HTML.
 */
export function assignNodeIds(html: string): { html: string; nodeCount: number } {
    const $ = cheerio.load(html);

    let counter = 0;
    $('*').each(function (_, rawEl) {
        const el = $(rawEl);
        if (rawEl.type === 'tag' || rawEl.type === 'script' || rawEl.type === 'style') {
            el.attr('data-node-id', String(counter++));
        }
    });
    return { html: $.html(), nodeCount: counter };
}

/**
 * Remove all `data-node-id` attributes from the HTML.
 */
export function stripNodeIds(html: string): string {
    const $ = cheerio.load(html);
    $('[data-node-id]').removeAttr('data-node-id');
    return $.html();
}
