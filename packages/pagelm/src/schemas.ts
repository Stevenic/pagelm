// ---------------------------------------------------------------------------
// Change operations output format — text instruction for non-structured builders
// ---------------------------------------------------------------------------

/**
 * Text instruction that tells the model to return a JSON array of change operations.
 * Append this to <INSTRUCTIONS> for builders that don't support structured outputs.
 */
export const CHANGE_OPS_FORMAT_INSTRUCTION = `Return a JSON array of change operations to apply to the page. Do NOT return the full HTML page.

Each operation must be one of:
{ "op": "update", "nodeId": "<data-node-id>", "html": "<new innerHTML>" }
  — replaces the innerHTML of the target element

{ "op": "replace", "nodeId": "<data-node-id>", "html": "<new outerHTML>" }
  — replaces the entire element (outerHTML) with new markup

{ "op": "delete", "nodeId": "<data-node-id>" }
  — removes the element from the page

{ "op": "insert", "parentId": "<data-node-id>", "position": "prepend"|"append"|"before"|"after", "html": "<new element HTML>" }
  — inserts new HTML relative to the parent element

{ "op": "style-element", "nodeId": "<data-node-id>", "style": "<css style string>" }
  — sets the style attribute of the target element (must be unlocked)

{ "op": "search-replace", "nodeId": "<data-node-id>", "search": "<exact text to find>", "replace": "<replacement text>" }
  — finds exact text within a script/style block and replaces it. Use empty string for replace to delete.

{ "op": "search-insert", "nodeId": "<data-node-id>", "after": "<exact text to find>", "content": "<new lines to insert>" }
  — inserts new content immediately after the matched text in a script/style block.

For partial edits to large scripts/styles, use search-replace or search-insert instead of
replacing the entire block with update.
Copy the search/after text exactly as it appears in the source.
When making multiple edits to the same block, ensure each search string targets distinct text.
To delete code, use search-replace with an empty replace string.

Return ONLY the JSON array. Example:
[
  { "op": "update", "nodeId": "5", "html": "<p>Hello world</p>" },
  { "op": "insert", "parentId": "3", "position": "append", "html": "<div class=\\"msg\\">New message</div>" }
]`;

// ---------------------------------------------------------------------------
// Change operations JSON schema — for structured output (constrained decoding)
// ---------------------------------------------------------------------------

/**
 * JSON schema matching the ChangeOp union type for Anthropic structured outputs.
 * The top-level schema is an array of change operations.
 */
export const CHANGE_OPS_SCHEMA: Record<string, unknown> = {
    type: 'array',
    items: {
        anyOf: [
            {
                type: 'object',
                properties: {
                    op: { type: 'string', const: 'update' },
                    nodeId: { type: 'string' },
                    html: { type: 'string' },
                },
                required: ['op', 'nodeId', 'html'],
                additionalProperties: false,
            },
            {
                type: 'object',
                properties: {
                    op: { type: 'string', const: 'replace' },
                    nodeId: { type: 'string' },
                    html: { type: 'string' },
                },
                required: ['op', 'nodeId', 'html'],
                additionalProperties: false,
            },
            {
                type: 'object',
                properties: {
                    op: { type: 'string', const: 'delete' },
                    nodeId: { type: 'string' },
                },
                required: ['op', 'nodeId'],
                additionalProperties: false,
            },
            {
                type: 'object',
                properties: {
                    op: { type: 'string', const: 'insert' },
                    parentId: { type: 'string' },
                    position: { type: 'string', enum: ['prepend', 'append', 'before', 'after'] },
                    html: { type: 'string' },
                },
                required: ['op', 'parentId', 'position', 'html'],
                additionalProperties: false,
            },
            {
                type: 'object',
                properties: {
                    op: { type: 'string', const: 'style-element' },
                    nodeId: { type: 'string' },
                    style: { type: 'string' },
                },
                required: ['op', 'nodeId', 'style'],
                additionalProperties: false,
            },
            {
                type: 'object',
                properties: {
                    op: { type: 'string', const: 'search-replace' },
                    nodeId: { type: 'string' },
                    search: { type: 'string' },
                    replace: { type: 'string' },
                },
                required: ['op', 'nodeId', 'search', 'replace'],
                additionalProperties: false,
            },
            {
                type: 'object',
                properties: {
                    op: { type: 'string', const: 'search-insert' },
                    nodeId: { type: 'string' },
                    after: { type: 'string' },
                    content: { type: 'string' },
                },
                required: ['op', 'nodeId', 'after', 'content'],
                additionalProperties: false,
            },
        ],
    },
};

/**
 * OpenAI structured outputs require a root-level object.
 * This wraps CHANGE_OPS_SCHEMA in { changes: [...] }.
 */
export const OPENAI_CHANGE_OPS_SCHEMA: Record<string, unknown> = {
    type: 'object',
    properties: {
        changes: CHANGE_OPS_SCHEMA,
    },
    required: ['changes'],
    additionalProperties: false,
};
