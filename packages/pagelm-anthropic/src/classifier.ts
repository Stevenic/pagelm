import { completePrompt } from '@pagelm/core';

// ---------------------------------------------------------------------------
// Request classification
// ---------------------------------------------------------------------------

export type Classification = 'hard-change' | 'easy-change' | 'question';

export interface ClassifyResult {
    classification: Classification;
    /** When classification is "question", this contains the answer text. */
    answer?: string;
}

const CLASSIFIER_SYSTEM_PROMPT = `You classify user messages for a web page builder. Default to a change request. Only classify as "question" when the user is purely asking for information with zero implication that anything should change.

<DECISION_RULES>
Step 1 — Does the message describe a problem, bug, broken behavior, or something that should be different?
  Yes → it is a change request (the user wants it fixed). Go to step 2.
  No  → go to step 3.

Step 2 — How complex is the change?
  Simple (text edits, color/style changes, adding/removing a single element, toggling visibility, minor CSS tweaks) → "easy-change"
  Complex (new features, games, animations, restructuring components, significant JS logic, forms with validation, multi-step work) → "hard-change"

Step 3 — Is the message a direct, explicit question asking for information only? Examples: "What color is the header?", "How many sections are there?", "What font is the title using?"
  Yes, and there is absolutely no suggestion that anything should change → "question"
  Otherwise → treat as a change request, go to step 2.

<OUTPUT_FORMAT>
Return only JSON. No other text.
- Change: { "classification": "easy-change" } or { "classification": "hard-change" }
- Question: { "classification": "question", "answer": "<brief answer>" }`;

/**
 * Classify a user request against the current page to determine routing.
 * Uses a lightweight model call to categorize as easy-change, hard-change, or question.
 *
 * @param complete  A completePrompt function configured for the classifier model (e.g. Sonnet).
 * @param pageHtml  The current page HTML.
 * @param userMessage  The user's message.
 */
export async function classifyRequest(
    complete: completePrompt,
    pageHtml: string,
    userMessage: string
): Promise<ClassifyResult> {
    try {
        const result = await complete({
            system: { role: 'system', content: CLASSIFIER_SYSTEM_PROMPT },
            prompt: { role: 'user', content: `<PAGE_HTML>\n${pageHtml}\n</PAGE_HTML>\n\n<USER_MESSAGE>\n${userMessage}\n</USER_MESSAGE>` },
            jsonMode: true,
        });

        if (!result.completed || !result.value) {
            return { classification: 'hard-change' };
        }

        const parsed = JSON.parse(result.value);
        const c = parsed.classification;
        if (c === 'question') {
            return { classification: 'question', answer: typeof parsed.answer === 'string' ? parsed.answer : '' };
        }
        if (c === 'easy-change' || c === 'hard-change') {
            return { classification: c };
        }
        return { classification: 'hard-change' };
    } catch {
        return { classification: 'hard-change' };
    }
}
