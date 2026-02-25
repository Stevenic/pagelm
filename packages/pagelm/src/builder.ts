import { ChangeList } from './types';
import type { CoreOp } from '@pagelm/corelm';

// ---------------------------------------------------------------------------
// Provider types
// ---------------------------------------------------------------------------

export type ProviderName = 'Anthropic' | 'OpenAI' | 'Azure' | 'OSS';

// ---------------------------------------------------------------------------
// Multimodal content
// ---------------------------------------------------------------------------

export interface TextBlock {
    type: 'text';
    text: string;
}

export interface ImageBlock {
    type: 'image';
    mediaType: string;
    data: string;
}

export type ContentBlock = TextBlock | ImageBlock;

export type MessageContent = string | ContentBlock[];

/** Type guard: returns true when content is a multimodal ContentBlock array. */
export function isMultimodalContent(content: MessageContent): content is ContentBlock[] {
    return Array.isArray(content);
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

export interface Message {
    role: string;
    content: string;
    name?: string;
}

export interface SystemMessage extends Message {
    role: 'system';
}

export interface UserMessage {
    role: 'user';
    content: MessageContent;
    name?: string;
}

// ---------------------------------------------------------------------------
// Completions
// ---------------------------------------------------------------------------

export interface AgentCompletion<TValue> {
    completed: boolean;
    value?: TValue;
    error?: Error;
}

export interface PromptCompletionArgs {
    prompt: UserMessage;
    system?: SystemMessage;
    history?: Message[];
    temperature?: number;
    jsonMode?: boolean;
    /** JSON schema for structured output. When provided, the model is asked to return JSON conforming to this schema. */
    jsonSchema?: Record<string, unknown>;
    /** When true, system content is wrapped with cache_control for Anthropic prompt caching. */
    cacheSystem?: boolean;
    /** JSON schema for structured output via constrained decoding (Anthropic output_config). */
    outputSchema?: Record<string, unknown>;
}

export type completePrompt<TValue = string> = (args: PromptCompletionArgs) => Promise<AgentCompletion<TValue>>;

// ---------------------------------------------------------------------------
// Context sections — structured blocks passed to the builder
// ---------------------------------------------------------------------------

export interface ContextSection {
    /** Section title, e.g. "<CURRENT_PAGE>", "<SERVER_SCRIPTS>" */
    title: string;
    /** The text body of this section */
    content: string;
    /** How the model should work with this section (appended to instructions) */
    instructions: string;
}

// ---------------------------------------------------------------------------
// Builder result — discriminated union returned by Builder.run()
// ---------------------------------------------------------------------------

export type BuilderResult =
    | { kind: 'transforms'; changes: ChangeList }
    | { kind: 'coreOps'; ops: CoreOp[] }
    | { kind: 'reply'; text: string }
    | { kind: 'error'; error: Error };

// ---------------------------------------------------------------------------
// Attachments — images/files sent alongside the user message
// ---------------------------------------------------------------------------

export interface Attachment {
    mediaType: string;
    data: string;
    name?: string;
}

// ---------------------------------------------------------------------------
// Builder interface
// ---------------------------------------------------------------------------

export interface Builder {
    run(
        currentPage: ContextSection,
        additionalSections: ContextSection[],
        userMessage: string,
        newBuild: boolean,
        attachments?: Attachment[]
    ): Promise<BuilderResult>;
}
