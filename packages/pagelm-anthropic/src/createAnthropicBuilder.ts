import {
    Builder,
    BuilderResult,
    ContextSection,
    Attachment,
    ContentBlock,
    completePrompt,
    getTransformInstr,
    getCoreLMInstr,
    parseBuilderResponse,
    CHANGE_OPS_SCHEMA,
    CORE_OPS_SCHEMA,
} from '@pagelm/core';
import type { CoreOp } from '@pagelm/corelm';
import { hydrateCoreOps } from '@pagelm/corelm';
import { classifyRequest, Classification } from './classifier';
import { createAnthropicModel } from './anthropicModel';

// ---------------------------------------------------------------------------
// Builder options
// ---------------------------------------------------------------------------

export interface AnthropicBuilderOptions {
    apiKey?: string;
    model?: string;
    /** Optional wrapper applied to any internally-created model (e.g. for debug logging). */
    wrapModel?: (model: completePrompt) => completePrompt;
    /** When true, builder operates in CoreLM mode (returns CoreOp[] instead of ChangeOp[]). */
    coreLM?: boolean;
}

// ---------------------------------------------------------------------------
// Anthropic builder factory
// ---------------------------------------------------------------------------

/**
 * Create an Anthropic-tuned builder.
 *
 * Uses Anthropic's structured output (output_config / json_schema constrained decoding)
 * for reliable JSON change lists. When an Opus-class model is configured with an API key,
 * requests are routed through a Sonnet classifier: easy changes go to Sonnet, hard changes
 * and new builds go to the configured (Opus) model.
 *
 * @param complete  The completePrompt function (already configured with API key / model).
 * @param userInstructions  Optional user-level instructions from settings.
 * @param productName  Product name for branding in prompts (defaults to 'PageLM').
 * @param options  Optional API key and model name for classifier routing.
 */
export function createAnthropicBuilder(
    complete: completePrompt,
    userInstructions?: string,
    productName?: string,
    options?: AnthropicBuilderOptions
): Builder {
    const name = productName ?? 'PageLM';

    const isCoreLM = options?.coreLM ?? false;

    return {
        async run(currentPage, additionalSections, userMessage, newBuild, attachments?): Promise<BuilderResult> {
            try {
                // Choose build function based on mode
                const buildFn = isCoreLM
                    ? (model: completePrompt) => buildCoreLMWithModel(model, currentPage, additionalSections, userMessage, userInstructions, name, attachments)
                    : (model: completePrompt) => buildWithModel(model, currentPage, additionalSections, userMessage, userInstructions, name, attachments);

                const isOpus = options?.model?.startsWith('claude-opus-');

                // Non-Opus models or missing apiKey: skip classification
                if (!isOpus || !options?.apiKey) {
                    return buildFn(complete);
                }

                // Console errors bypass classification — always route to configured model
                if (userMessage.includes('CONSOLE_ERRORS:')) {
                    return buildFn(complete);
                }

                // Classify the request using Sonnet
                let classifierModel: completePrompt = createAnthropicModel({ apiKey: options.apiKey, model: 'claude-sonnet-4-5' });
                if (options.wrapModel) classifierModel = options.wrapModel(classifierModel);

                const classifyResult = await classifyRequest(classifierModel, currentPage.content, userMessage);

                // Questions — answer was already provided by the classifier
                if (classifyResult.classification === 'question') {
                    return { kind: 'reply', text: classifyResult.answer ?? '' };
                }

                // New builds always use the configured (Opus) model
                if (newBuild) {
                    return buildFn(complete);
                }

                // Easy changes use Sonnet
                if (classifyResult.classification === 'easy-change') {
                    let sonnet: completePrompt = createAnthropicModel({ apiKey: options.apiKey, model: 'claude-sonnet-4-5' });
                    if (options.wrapModel) sonnet = options.wrapModel(sonnet);
                    return buildFn(sonnet);
                }

                // Hard changes use the configured model
                return buildFn(complete);
            } catch (err: unknown) {
                return { kind: 'error', error: err instanceof Error ? err : new Error(String(err)) };
            }
        }
    };
}

// ---------------------------------------------------------------------------
// Build flow — shared prompt construction + model call + parsing
// ---------------------------------------------------------------------------

async function buildWithModel(
    model: completePrompt,
    currentPage: ContextSection,
    additionalSections: ContextSection[],
    userMessage: string,
    userInstructions: string | undefined,
    productName: string,
    attachments?: Attachment[]
): Promise<BuilderResult> {
    // -- System message: all static content (cacheable) --
    const systemParts: string[] = [];
    for (const section of additionalSections) {
        if (section.content) {
            systemParts.push(`${section.title}\n${section.content}`);
        }
    }

    const instructionParts: string[] = [];
    if (userInstructions?.trim()) {
        instructionParts.push(userInstructions);
    }
    for (const section of additionalSections) {
        if (section.instructions?.trim()) {
            instructionParts.push(section.instructions);
        }
    }
    instructionParts.push(getTransformInstr(productName));
    const instructions = instructionParts.filter(s => s.trim() !== '').join('\n');
    systemParts.push(`<INSTRUCTIONS>\n${instructions}`);

    const systemContent = systemParts.join('\n\n');

    // -- User message: dynamic content only (current page + user message) --
    const promptText = `${currentPage.title}\n${currentPage.content}\n\n<USER_MESSAGE>\n${userMessage}`;

    // Build prompt content — multimodal when image attachments are present
    const imageAttachments = (attachments ?? []).filter(a => a.mediaType.startsWith('image/'));
    let promptContent: string | ContentBlock[];
    if (imageAttachments.length > 0) {
        const blocks: ContentBlock[] = [{ type: 'text', text: promptText }];
        for (const att of imageAttachments) {
            blocks.push({ type: 'image', mediaType: att.mediaType, data: att.data });
        }
        promptContent = blocks;
    } else {
        promptContent = promptText;
    }

    // -- Call model --
    const result = await model({
        system: { role: 'system', content: systemContent },
        prompt: { role: 'user', content: promptContent },
        cacheSystem: true,
        outputSchema: CHANGE_OPS_SCHEMA,
    });

    if (!result.completed) {
        return { kind: 'error', error: result.error ?? new Error('Model call failed') };
    }

    // -- Parse response --
    return parseBuilderResponse(result.value!);
}

// ---------------------------------------------------------------------------
// CoreLM build flow — returns CoreOp[] instead of ChangeOp[]
// ---------------------------------------------------------------------------

async function buildCoreLMWithModel(
    model: completePrompt,
    currentPage: ContextSection,
    additionalSections: ContextSection[],
    userMessage: string,
    userInstructions: string | undefined,
    productName: string,
    attachments?: Attachment[]
): Promise<BuilderResult> {
    // -- System message: all static content (cacheable) --
    const systemParts: string[] = [];
    for (const section of additionalSections) {
        if (section.content) {
            systemParts.push(`${section.title}\n${section.content}`);
        }
    }

    const instructionParts: string[] = [];
    if (userInstructions?.trim()) {
        instructionParts.push(userInstructions);
    }
    for (const section of additionalSections) {
        if (section.instructions?.trim()) {
            instructionParts.push(section.instructions);
        }
    }
    instructionParts.push(getCoreLMInstr(productName));
    const instructions = instructionParts.filter(s => s.trim() !== '').join('\n');
    systemParts.push(`<INSTRUCTIONS>\n${instructions}`);

    const systemContent = systemParts.join('\n\n');

    // -- User message: dynamic content only (current document + user message) --
    const promptText = `${currentPage.title}\n${currentPage.content}\n\n<USER_MESSAGE>\n${userMessage}`;

    // Build prompt content — multimodal when image attachments are present
    const imageAttachments = (attachments ?? []).filter(a => a.mediaType.startsWith('image/'));
    let promptContent: string | ContentBlock[];
    if (imageAttachments.length > 0) {
        const blocks: ContentBlock[] = [{ type: 'text', text: promptText }];
        for (const att of imageAttachments) {
            blocks.push({ type: 'image', mediaType: att.mediaType, data: att.data });
        }
        promptContent = blocks;
    } else {
        promptContent = promptText;
    }

    // -- Call model with CoreOp schema --
    const result = await model({
        system: { role: 'system', content: systemContent },
        prompt: { role: 'user', content: promptContent },
        cacheSystem: true,
        outputSchema: CORE_OPS_SCHEMA,
    });

    if (!result.completed) {
        return { kind: 'error', error: result.error ?? new Error('Model call failed') };
    }

    // -- Parse response as CoreOp[] --
    try {
        const raw = result.value!;
        let parsed: Record<string, unknown>[];

        if (typeof raw === 'string') {
            // Try to extract JSON array from the response
            const trimmed = raw.trim();
            const jsonStart = trimmed.indexOf('[');
            const jsonEnd = trimmed.lastIndexOf(']');
            if (jsonStart !== -1 && jsonEnd !== -1) {
                parsed = JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1));
            } else {
                // Might be a reply/question
                return { kind: 'reply', text: raw };
            }
        } else {
            parsed = raw as unknown as Record<string, unknown>[];
        }

        if (!Array.isArray(parsed)) {
            return { kind: 'error', error: new Error('CoreLM response is not an array') };
        }

        // Hydrate JSON-string fields back into objects
        const ops = hydrateCoreOps(parsed) as unknown as CoreOp[];

        return { kind: 'coreOps', ops };
    } catch (err: unknown) {
        return { kind: 'error', error: err instanceof Error ? err : new Error(String(err)) };
    }
}
