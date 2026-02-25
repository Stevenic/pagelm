import { Builder, completePrompt } from '@pagelm/core';

/**
 * Create an OSS model builder.
 * Uses text-based CHANGE_OPS_FORMAT_INSTRUCTION (no structured output).
 * Does not support image attachments.
 *
 * @param complete  The completePrompt function (already configured with API key / model).
 * @param userInstructions  Optional user-level instructions from settings.
 * @param productName  Product name for branding in prompts (defaults to 'PageLM').
 */
export function createOSSBuilder(
    complete: completePrompt,
    userInstructions?: string,
    productName?: string
): Builder {
    // TODO: implement
    throw new Error('Not implemented');
}
