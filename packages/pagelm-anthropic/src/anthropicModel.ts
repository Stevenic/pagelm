import Anthropic from '@anthropic-ai/sdk';
import {
    completePrompt,
    PromptCompletionArgs,
    AgentCompletion,
    isMultimodalContent,
} from '@pagelm/core';

export interface AnthropicModelArgs {
    apiKey: string;
    model: string;
    baseURL?: string;
    temperature?: number;
    maxRetries?: number;
}

/**
 * Build the messages array and system content for an Anthropic API request.
 */
export function buildAnthropicRequest(args: PromptCompletionArgs, defaultTemp: number): {
    messages: { role: string; content: string | Anthropic.ContentBlockParam[] }[];
    system: string | Anthropic.TextBlockParam[] | undefined;
    temperature: number;
    outputConfig?: Anthropic.OutputConfig;
} {
    const reqTemp = args.temperature ?? defaultTemp;

    const messages: { role: string; content: string | Anthropic.ContentBlockParam[] }[] = [];
    if (args.history) {
        for (const msg of args.history) {
            messages.push({ role: msg.role, content: msg.content });
        }
    }

    // Build user content — multimodal when ContentBlock[] is provided
    const promptContent = args.prompt.content;
    let userContent: string | Anthropic.ContentBlockParam[];
    if (isMultimodalContent(promptContent)) {
        userContent = promptContent.map(block => {
            if (block.type === 'text') {
                return { type: 'text' as const, text: block.text };
            }
            return {
                type: 'image' as const,
                source: { type: 'base64' as const, media_type: block.mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp', data: block.data },
            };
        });
    } else {
        userContent = promptContent;
    }

    // Structured output via output_config is incompatible with prefilling
    const useJsonPrefill = !args.outputSchema && (args.jsonMode || args.jsonSchema);
    if (useJsonPrefill) {
        messages.push({ role: 'user', content: userContent });
        messages.push({ role: 'assistant', content: '{' });
    } else {
        messages.push({ role: 'user', content: userContent });
    }

    let system = args.system?.content;
    if (args.jsonSchema) {
        const schemaInstruction = `\n\nYou must return valid JSON conforming to this schema:\n${JSON.stringify(args.jsonSchema)}`;
        system = system ? system + schemaInstruction : schemaInstruction;
    }

    // Wrap system content with cache_control for prompt caching
    const finalSystem: string | Anthropic.TextBlockParam[] | undefined = (system && args.cacheSystem)
        ? [{ type: 'text' as const, text: system, cache_control: { type: 'ephemeral' as const } }]
        : system;

    // Structured output config for constrained decoding
    const outputConfig: Anthropic.OutputConfig | undefined = args.outputSchema
        ? { format: { type: 'json_schema', schema: args.outputSchema } }
        : undefined;

    return { messages, system: finalSystem, temperature: reqTemp, outputConfig };
}

/**
 * Create a completePrompt function backed by the Anthropic SDK.
 */
export function createAnthropicModel(args: AnthropicModelArgs): completePrompt {
    const { apiKey, model, baseURL, temperature = 0.0, maxRetries } = args;

    const client = new Anthropic({ apiKey, baseURL, maxRetries });

    return async (completionArgs: PromptCompletionArgs): Promise<AgentCompletion<string>> => {
        const { messages, system: systemContent, temperature: reqTemp, outputConfig } = buildAnthropicRequest(completionArgs, temperature);

        const useJsonPrefill = !completionArgs.outputSchema && (completionArgs.jsonMode || completionArgs.jsonSchema);

        try {
            const stream = await client.messages.create({
                model,
                max_tokens: 32768,
                temperature: reqTemp,
                system: systemContent,
                messages: messages as Anthropic.MessageParam[],
                stream: true,
                ...(outputConfig && { output_config: outputConfig }),
            });

            let text = '';
            for await (const event of stream) {
                if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
                    text += event.delta.text;
                }
            }

            if (useJsonPrefill) {
                text = '{' + text;
            }

            return { completed: true, value: text };
        } catch (err: unknown) {
            let error: Error;
            if (err instanceof Anthropic.APIError && (err as any).status !== undefined) {
                error = new Error(err.message);
                error.name = err.name;
            } else {
                error = err as Error;
            }
            return { completed: false, error };
        }
    };
}
