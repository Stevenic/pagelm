import { Builder, completePrompt, PromptCompletionArgs, AgentCompletion } from '@pagelm/core';

// ---------------------------------------------------------------------------
// Azure builder options
// ---------------------------------------------------------------------------

export interface AzureBuilderOptions {
    /** Azure OpenAI endpoint (e.g. https://myresource.openai.azure.com) */
    endpoint: string;
    /** Deployment name */
    deployment: string;
    /** API version (e.g. 2024-08-01-preview) */
    apiVersion: string;
    /** Azure API key */
    apiKey: string;
}

/**
 * Create an Azure OpenAI completePrompt function configured for a specific deployment.
 */
export function createAzureCompletePrompt(options: AzureBuilderOptions): completePrompt {
    // TODO: implement — instantiate AzureOpenAI client from openai SDK
    throw new Error('Not implemented');
}

/**
 * Create an Azure OpenAI-tuned builder.
 * Structurally identical to the OpenAI builder but configured for Azure endpoints.
 *
 * @param complete  The completePrompt function (already configured for Azure endpoint).
 * @param userInstructions  Optional user-level instructions from settings.
 * @param productName  Product name for branding in prompts (defaults to 'PageLM').
 */
export function createAzureBuilder(
    complete: completePrompt,
    userInstructions?: string,
    productName?: string
): Builder {
    // TODO: implement
    throw new Error('Not implemented');
}
