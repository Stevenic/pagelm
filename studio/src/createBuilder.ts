import { Builder, completePrompt } from '@pagelm/core';
import { createAnthropicBuilder, createAnthropicModel } from '@pagelm/anthropic';

export interface BuilderConfig {
    provider: string;
    apiKey: string;
    model: string;
    /** When true, builder operates in CoreLM mode */
    coreLM?: boolean;
}

const DEFAULT_MODELS: Record<string, string> = {
    anthropic: 'claude-sonnet-4-5',
    openai: 'gpt-4o',
    azure: 'gpt-4o',
    oss: '',
};

export function createBuilder(config: BuilderConfig): Builder {
    const { provider, apiKey, model } = config;

    if (!apiKey) {
        throw new Error(`No API key configured. Pass --api-key or set PAGELM_API_KEY.`);
    }

    const resolvedModel = model || DEFAULT_MODELS[provider] || '';

    switch (provider) {
        case 'anthropic': {
            const complete = createAnthropicModel({ apiKey, model: resolvedModel });
            return createAnthropicBuilder(complete, undefined, 'PageLM', {
                apiKey,
                model: resolvedModel,
                coreLM: config.coreLM,
            });
        }
        // openai, azure, oss builders are still TODO stubs — fail with a clear message
        case 'openai':
            throw new Error('OpenAI builder not yet implemented');
        case 'azure':
            throw new Error('Azure builder not yet implemented');
        case 'oss':
            throw new Error('OSS builder not yet implemented');
        default:
            throw new Error(`Unknown provider: ${provider}`);
    }
}
