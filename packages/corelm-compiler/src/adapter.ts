// ---------------------------------------------------------------------------
// CoreLM Adapter interface — maps CoreLM tokens to framework-specific output
// ---------------------------------------------------------------------------

import type { StyleTokens, NodeType } from '@pagelm/corelm';

export interface CoreLMAdapter {
    /** Map style tokens to CSS declarations (property: value pairs) */
    resolveStyle(tokens: StyleTokens): Record<string, string>;

    /** Map a NodeType + props to an HTML tag + default attributes */
    resolveTag(type: NodeType, props: Record<string, unknown>): { tag: string; attrs: Record<string, string> };

    /** Framework CSS/JS asset URLs to inject in <head> */
    assets(): { styles: string[]; scripts: string[] };
}
