import { Attachment, Builder, ContextSection } from './builder';

// ---------------------------------------------------------------------------
// Inline Q&A — optional chat-feed appending for "reply" results
// ---------------------------------------------------------------------------

export interface InlineQA {
    /** CSS selector for the chat feed container (e.g. "#chatMessages"). */
    feedSelector: string;
    /**
     * HTML template for the user's question.
     * Use `{{message}}` as the placeholder for the message text.
     * @example '<div class="chat-message"><p><strong>User:</strong> {{message}}</p></div>'
     */
    questionTemplate: string;
    /**
     * HTML template for the assistant's answer.
     * Use `{{message}}` as the placeholder for the answer text.
     * @example '<div class="chat-message"><p><strong>PageLM:</strong> {{message}}</p></div>'
     */
    answerTemplate: string;
    /**
     * When true, the question and answer text are run through `simpleMarkdown()`
     * before template interpolation. Defaults to false (plain-text / HTML-escaped).
     */
    markdown?: boolean;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TransformPageArgs {
    pageState: string;
    message: string;
    instructions?: string;
    builder: Builder;
    additionalSections: ContextSection[];
    /** True when this is the builder page (has chat panel). */
    isBuilder?: boolean;
    /** Product name for branding in prompts (defaults to 'PageLM'). */
    productName?: string;
    /** Optional image attachments sent alongside the user message. */
    attachments?: Attachment[];
    /**
     * When provided, "reply" results from the builder append the user question
     * and assistant answer into the chat feed using the given templates.
     * When omitted, "reply" results return the page unchanged.
     */
    inlineQA?: InlineQA;
}

export type ChangeOp =
    | { op: "update"; nodeId: string; html: string }
    | { op: "replace"; nodeId: string; html: string }
    | { op: "delete"; nodeId: string }
    | { op: "insert"; parentId: string; position: "prepend" | "append" | "before" | "after"; html: string }
    | { op: "style-element"; nodeId: string; style: string }
    | { op: "search-replace"; nodeId: string; search: string; replace: string }
    | { op: "search-insert"; nodeId: string; after: string; content: string };

export type ChangeList = ChangeOp[];

export interface TransformPageResult {
    html: string;
    changeCount: number;
}
