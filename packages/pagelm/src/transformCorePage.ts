// ---------------------------------------------------------------------------
// CoreLM page transformation orchestrator
// Parallel to transformPage.ts but for CoreLM-mode pages
// ---------------------------------------------------------------------------

import type { CoreDocument, CoreOp } from '@pagelm/corelm';
import { applyCoreOps, validateDocument } from '@pagelm/corelm';
import type { AgentCompletion, ContextSection, Builder, Attachment } from './builder';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TransformCorePageArgs {
    /** Current CoreLM document state */
    document: CoreDocument;
    /** User message / instruction */
    message: string;
    /** Optional additional instructions */
    instructions?: string;
    /** The builder to use */
    builder: Builder;
    /** Additional context sections */
    additionalSections: ContextSection[];
    /** Product name for branding */
    productName?: string;
    /** Optional image attachments */
    attachments?: Attachment[];
}

export interface TransformCorePageResult {
    /** Updated CoreLM document */
    document: CoreDocument;
    /** Number of operations applied */
    changeCount: number;
}

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------

/**
 * CoreLM page transformation orchestrator.
 *
 * 1. Serializes the CoreLM document as JSON for the builder context
 * 2. Calls the builder — expects CoreOp[] back via `coreOps` result kind
 * 3. Applies ops to the document
 * 4. Validates the result
 * 5. Returns updated document + change count
 */
export async function transformCorePage(args: TransformCorePageArgs): Promise<AgentCompletion<TransformCorePageResult>> {
    const { document: doc, message, builder, additionalSections, attachments } = args;

    try {
        // 1. Serialize CoreLM document as JSON for the CURRENT_PAGE context
        const docJson = JSON.stringify(doc, null, 2);
        const currentPage: ContextSection = {
            title: '<CURRENT_PAGE>',
            content: docJson,
            instructions: '',
        };

        // 2. Determine if this is a new build (document has no children on app)
        const newBuild = !doc.app.children || doc.app.children.length === 0;

        // 3. Call builder
        const result = await builder.run(currentPage, additionalSections, message, newBuild, attachments);

        // 4. Handle result
        switch (result.kind) {
            case 'coreOps': {
                const ops = result.ops as CoreOp[];
                const updatedDoc = applyCoreOps(doc, ops);

                // Validate
                const diagnostics = validateDocument(updatedDoc);
                const errors = diagnostics.filter(d => d.severity === 'error');
                if (errors.length > 0) {
                    console.warn(`[CoreLM] Validation warnings after applying ${ops.length} ops:`, errors.map(e => e.message).join('; '));
                }

                return {
                    completed: true,
                    value: { document: updatedDoc, changeCount: ops.length },
                };
            }
            case 'transforms': {
                // Legacy HTML transforms — shouldn't happen in CoreLM mode but handle gracefully
                return {
                    completed: true,
                    error: new Error('Builder returned HTML transforms in CoreLM mode'),
                };
            }
            case 'reply': {
                // Question response — return document unchanged
                return {
                    completed: true,
                    value: { document: doc, changeCount: 0 },
                };
            }
            case 'error': {
                return {
                    completed: true,
                    error: result.error,
                };
            }
        }
    } catch (err: unknown) {
        return {
            completed: true,
            error: err instanceof Error ? err : new Error(String(err)),
        };
    }
}
