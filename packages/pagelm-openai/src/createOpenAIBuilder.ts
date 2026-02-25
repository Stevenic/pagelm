import { Builder, completePrompt } from '@pagelm/core';

/**
 * Create an OpenAI-tuned builder.
 * Uses OpenAI structured outputs (json_schema) for reliable JSON responses.
 *
 * @param complete  The completePrompt function (already configured with API key / model).
 * @param userInstructions  Optional user-level instructions from settings.
 * @param productName  Product name for branding in prompts (defaults to 'PageLM').
 */
export function createOpenAIBuilder(
    complete: completePrompt,
    userInstructions?: string,
    productName?: string
): Builder {
    // TODO: implement
    throw new Error('Not implemented');
}
