// Compiler
export { compileDocument } from './compile';

// Adapter interface
export type { CoreLMAdapter } from './adapter';

// Adapters
export { createFluentLMAdapter } from './adapters/fluentlm';
export { createNoneAdapter } from './adapters/none';

// Runtime (for direct access if needed)
export { getCoreLMRuntime } from './runtime';
