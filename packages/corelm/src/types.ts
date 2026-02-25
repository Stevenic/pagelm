// ---------------------------------------------------------------------------
// CoreLM — Typed UI Intermediate Representation
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Node types — the 28 constrained UI primitives
// ---------------------------------------------------------------------------

export type NodeType =
    | 'App'
    | 'Page'
    | 'Section'
    | 'Box'
    | 'Stack'
    | 'Grid'
    | 'Cluster'
    | 'Spacer'
    | 'Divider'
    | 'Heading'
    | 'Text'
    | 'RichText'
    | 'Image'
    | 'Icon'
    | 'Button'
    | 'Link'
    | 'Form'
    | 'Input'
    | 'Select'
    | 'Checkbox'
    | 'Card'
    | 'List'
    | 'Table'
    | 'Badge'
    | 'Animate'
    | 'Disclosure'
    | 'Tabs'
    | 'Dialog'
    | 'ToastRegion';

export const NODE_TYPES: readonly NodeType[] = [
    'App', 'Page', 'Section', 'Box', 'Stack', 'Grid', 'Cluster',
    'Spacer', 'Divider', 'Heading', 'Text', 'RichText', 'Image',
    'Icon', 'Button', 'Link', 'Form', 'Input', 'Select', 'Checkbox',
    'Card', 'List', 'Table', 'Badge', 'Animate', 'Disclosure',
    'Tabs', 'Dialog', 'ToastRegion',
];

// ---------------------------------------------------------------------------
// Style tokens — semantic design tokens
// ---------------------------------------------------------------------------

export type SpaceToken = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type RadiusToken = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ShadowToken = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type ColorRole = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'surface' | 'background' | 'text' | 'textSecondary' | 'border' | 'muted';
export type TypographyToken = 'display' | 'headline' | 'title' | 'subtitle' | 'body' | 'caption' | 'overline' | 'code';
export type LayoutToken = 'block' | 'inline' | 'flex' | 'grid' | 'hidden';
export type AlignToken = 'start' | 'center' | 'end' | 'stretch' | 'between' | 'around' | 'evenly';

export interface StyleTokens {
    space?: SpaceToken | { x?: SpaceToken; y?: SpaceToken; top?: SpaceToken; right?: SpaceToken; bottom?: SpaceToken; left?: SpaceToken };
    radius?: RadiusToken;
    border?: { width?: number; style?: 'solid' | 'dashed' | 'dotted' | 'none'; color?: ColorRole };
    shadow?: ShadowToken;
    color?: ColorRole;
    bg?: ColorRole;
    typography?: TypographyToken;
    layout?: LayoutToken;
    align?: AlignToken;
    justify?: AlignToken;
    gap?: SpaceToken;
    width?: string;
    height?: string;
    minWidth?: string;
    maxWidth?: string;
    minHeight?: string;
    maxHeight?: string;
    overflow?: 'auto' | 'hidden' | 'scroll' | 'visible';
    opacity?: number;
    fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
    fontSize?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    cursor?: string;
    position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
}

// ---------------------------------------------------------------------------
// Actions — what a user interaction can trigger
// ---------------------------------------------------------------------------

export type ActionType = 'navigate' | 'open' | 'scrollTo' | 'toggle' | 'set' | 'submit' | 'copy' | 'emit' | 'toast';

export interface Action {
    type: ActionType;
    /** URL for navigate/open, selector for scrollTo, state key for toggle/set */
    target?: string;
    /** Value for set action */
    value?: unknown;
    /** Toast message text */
    message?: string;
    /** Event name for emit */
    event?: string;
}

// ---------------------------------------------------------------------------
// Conditions — when predicates for event bindings
// ---------------------------------------------------------------------------

export interface Condition {
    /** State key to test */
    key: string;
    /** Comparison operator */
    op: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'truthy' | 'falsy' | 'contains';
    /** Value to compare against (not needed for truthy/falsy) */
    value?: unknown;
}

// ---------------------------------------------------------------------------
// Effects — imperative side effects triggered by events
// ---------------------------------------------------------------------------

export type EffectType = 'toggleTarget' | 'setState' | 'appendStateArray' | 'fetchJson' | 'emit' | 'runAnimation' | 'focus' | 'toast';

export interface Effect {
    type: EffectType;
    /** Target node ID or state key depending on effect type */
    target?: string;
    /** State key for setState/appendStateArray */
    key?: string;
    /** Value for setState */
    value?: unknown;
    /** URL for fetchJson */
    url?: string;
    /** HTTP method for fetchJson */
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    /** Body for fetchJson */
    body?: unknown;
    /** State key to store fetchJson result */
    resultKey?: string;
    /** Event name for emit */
    event?: string;
    /** Animation name for runAnimation */
    animation?: string;
    /** Toast message for toast effect */
    message?: string;
    /** Toast variant */
    variant?: 'info' | 'success' | 'warning' | 'danger';
    /** Selector for focus effect */
    selector?: string;
}

// ---------------------------------------------------------------------------
// Event bindings
// ---------------------------------------------------------------------------

export interface EventBinding {
    /** DOM event name (e.g. "click", "submit", "input", "change", "hover") */
    event: string;
    /** Optional conditions that must all be true for effects to run */
    when?: Condition[];
    /** Effects to execute when the event fires (and conditions pass) */
    do: Effect[];
}

// ---------------------------------------------------------------------------
// Motion / Animation
// ---------------------------------------------------------------------------

export type MotionTrigger = 'onMount' | 'onVisible' | 'onHover' | 'onPress' | 'onState';

export interface MotionPreset {
    mode: 'preset';
    preset: 'fadeIn' | 'fadeOut' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight'
        | 'scaleIn' | 'scaleOut' | 'bounce' | 'shake' | 'pulse' | 'spin';
    duration?: number;
    delay?: number;
    easing?: string;
    trigger?: MotionTrigger;
    stateKey?: string;
}

export interface MotionKeyframes {
    mode: 'keyframes';
    keyframes: Record<string, Record<string, string | number>>[];
    duration?: number;
    delay?: number;
    easing?: string;
    iterations?: number | 'infinite';
    fill?: 'forwards' | 'backwards' | 'both' | 'none';
    trigger?: MotionTrigger;
    stateKey?: string;
}

export type MotionSpec = MotionPreset | MotionKeyframes;

// ---------------------------------------------------------------------------
// Script modules (escape hatch)
// ---------------------------------------------------------------------------

export interface ScriptModule {
    /** Unique identifier for this module */
    id: string;
    /** Raw JavaScript source */
    source: string;
}

export interface ModuleBinding {
    /** Module ID to reference */
    moduleId: string;
    /** Function name to call on the module */
    handler: string;
}

// ---------------------------------------------------------------------------
// Core node
// ---------------------------------------------------------------------------

export interface CoreNode {
    /** Unique identifier within the document */
    id: string;
    /** Node type — determines rendering semantics */
    type: NodeType;
    /** Arbitrary props (type-specific) */
    props?: Record<string, unknown>;
    /** Semantic style tokens */
    style?: StyleTokens;
    /** Event bindings */
    events?: EventBinding[];
    /** Motion/animation spec */
    motion?: MotionSpec;
    /** Child nodes */
    children?: CoreNode[];
    /** Text content (for leaf nodes like Text, Heading, Button, etc.) */
    text?: string;
}

// ---------------------------------------------------------------------------
// App node — special root-level node
// ---------------------------------------------------------------------------

export interface AppNode extends CoreNode {
    type: 'App';
    props?: Record<string, unknown> & {
        title?: string;
        lang?: string;
        state?: Record<string, unknown>;
    };
}

// ---------------------------------------------------------------------------
// Core document — top-level wrapper
// ---------------------------------------------------------------------------

export interface CoreDocument {
    /** CoreLM spec version */
    version: string;
    /** Root app node */
    app: AppNode;
    /** Optional asset references */
    assets?: {
        styles?: string[];
        scripts?: string[];
    };
    /** Optional script modules (escape hatch) */
    modules?: ScriptModule[];
}
