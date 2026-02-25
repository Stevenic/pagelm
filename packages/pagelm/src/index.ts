// Types
export type {
    TransformPageArgs,
    TransformPageResult,
    ChangeOp,
    ChangeList,
    InlineQA,
} from './types';

// Builder types
export type {
    Builder,
    BuilderResult,
    ContextSection,
    Attachment,
    ProviderName,
    completePrompt,
    PromptCompletionArgs,
    AgentCompletion,
    TextBlock,
    ImageBlock,
    ContentBlock,
    MessageContent,
    Message,
    SystemMessage,
    UserMessage,
} from './builder';

export { isMultimodalContent } from './builder';

// Schemas
export {
    CHANGE_OPS_SCHEMA,
    OPENAI_CHANGE_OPS_SCHEMA,
    CHANGE_OPS_FORMAT_INSTRUCTION,
} from './schemas';

// Instructions
export { getTransformInstr, getMessageFormat } from './instructions';

// Node IDs
export { assignNodeIds, stripNodeIds } from './nodeIds';

// HTML utilities
export {
    deduplicateInlineScripts,
    ensureScriptsBeforeBodyClose,
    injectError,
    simpleMarkdown,
    normalizedIndexOf,
} from './htmlUtils';

// Parsing
export { parseChangeList, parseBuilderResponse } from './parseChangeList';

// Orchestrator
export { transformPage, applyChangeList } from './transformPage';

// CoreLM instructions
export { getCoreLMInstr } from './corelmInstructions';

// CoreLM schemas
export { CORE_OPS_SCHEMA } from './corelmSchemas';

// CoreLM orchestrator
export { transformCorePage } from './transformCorePage';
export type { TransformCorePageArgs, TransformCorePageResult } from './transformCorePage';
