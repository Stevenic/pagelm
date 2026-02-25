import { ChangeList } from './types';
import { BuilderResult } from './builder';

/**
 * Parse a JSON change list from the model's raw response text.
 * Handles responses that may include markdown fences or extra text around the JSON.
 */
export function parseChangeList(response: string): ChangeList {
    // Try direct parse first
    try {
        const parsed = JSON.parse(response);
        if (Array.isArray(parsed)) return parsed as ChangeList;
    } catch {
        // fall through to extraction
    }

    // Try to extract JSON array from the response
    const match = response.match(/\[[\s\S]*\]/);
    if (match) {
        try {
            const parsed = JSON.parse(match[0]);
            if (Array.isArray(parsed)) return parsed as ChangeList;
        } catch {
            // fall through
        }
    }

    throw new Error('Failed to parse change list from model response');
}

/**
 * Parse the raw model response into a BuilderResult.
 * Tries JSON object with kind discriminator, bare array, then falls back to
 * extracting a JSON array from response text via parseChangeList.
 */
export function parseBuilderResponse(raw: string): BuilderResult {
    // Try parsing as a JSON object with a kind discriminator
    try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            if (parsed.kind === 'transforms' && Array.isArray(parsed.changes)) {
                return { kind: 'transforms', changes: parsed.changes };
            }
            if (parsed.kind === 'reply' && typeof parsed.text === 'string') {
                return { kind: 'reply', text: parsed.text };
            }
        }
        // Bare array — backward compat
        if (Array.isArray(parsed)) {
            return { kind: 'transforms', changes: parsed };
        }
    } catch {
        // fall through to parseChangeList extraction
    }

    // Fall back to extracting a JSON array from the response text
    try {
        const changes = parseChangeList(raw);
        return { kind: 'transforms', changes };
    } catch {
        return { kind: 'error', error: new Error('Failed to parse model response as JSON') };
    }
}
