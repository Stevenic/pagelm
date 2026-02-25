// ---------------------------------------------------------------------------
// CoreLM document validator
// ---------------------------------------------------------------------------

import { CoreDocument, CoreNode, NODE_TYPES, NodeType } from './types';

export interface Diagnostic {
    severity: 'error' | 'warning';
    path: string;
    message: string;
}

const NODE_TYPE_SET = new Set<string>(NODE_TYPES);

// Patterns that indicate dangerous script content
const DANGEROUS_PATTERNS = [
    /\beval\s*\(/,
    /\bnew\s+Function\s*\(/,
    /\bimport\s*\(/,
];

/**
 * Validate a CoreDocument and return a list of diagnostics.
 * Checks:
 * - All IDs are unique
 * - All targetId refs in effects resolve to existing node IDs
 * - All NodeType values are known
 * - EventBinding types are valid
 * - Script modules pass sandbox checks (no eval, no dynamic Function)
 */
export function validateDocument(doc: CoreDocument): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    const allIds = new Set<string>();
    const allNodes: { node: CoreNode; path: string }[] = [];

    // Collect all nodes and check for duplicate IDs and valid types
    function walkNode(node: CoreNode, path: string): void {
        allNodes.push({ node, path });

        // Check ID uniqueness
        if (allIds.has(node.id)) {
            diagnostics.push({
                severity: 'error',
                path,
                message: `Duplicate node ID: "${node.id}"`,
            });
        }
        allIds.add(node.id);

        // Check node type
        if (!NODE_TYPE_SET.has(node.type)) {
            diagnostics.push({
                severity: 'error',
                path: `${path}.type`,
                message: `Unknown NodeType: "${node.type}"`,
            });
        }

        // Check event bindings
        if (node.events) {
            for (let i = 0; i < node.events.length; i++) {
                const binding = node.events[i];
                const ePath = `${path}.events[${i}]`;

                if (!binding.event) {
                    diagnostics.push({
                        severity: 'error',
                        path: ePath,
                        message: 'EventBinding missing "event" field',
                    });
                }

                if (!binding.do || binding.do.length === 0) {
                    diagnostics.push({
                        severity: 'warning',
                        path: ePath,
                        message: 'EventBinding has empty "do" array',
                    });
                }

                if (binding.do) {
                    for (let j = 0; j < binding.do.length; j++) {
                        const effect = binding.do[j];
                        if (!effect.type) {
                            diagnostics.push({
                                severity: 'error',
                                path: `${ePath}.do[${j}]`,
                                message: 'Effect missing "type" field',
                            });
                        }
                    }
                }
            }
        }

        // Recurse children
        if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
                walkNode(node.children[i], `${path}.children[${i}]`);
            }
        }
    }

    // Walk from the app root
    walkNode(doc.app, 'app');

    // Check all targetId references in effects resolve to existing node IDs
    for (const { node, path } of allNodes) {
        if (node.events) {
            for (let i = 0; i < node.events.length; i++) {
                const binding = node.events[i];
                if (binding.do) {
                    for (let j = 0; j < binding.do.length; j++) {
                        const effect = binding.do[j];
                        if (effect.target && (effect.type === 'toggleTarget' || effect.type === 'runAnimation' || effect.type === 'focus')) {
                            if (!allIds.has(effect.target)) {
                                diagnostics.push({
                                    severity: 'error',
                                    path: `${path}.events[${i}].do[${j}].target`,
                                    message: `Target ID "${effect.target}" does not exist in document`,
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    // Validate script modules
    if (doc.modules) {
        const moduleIds = new Set<string>();
        for (let i = 0; i < doc.modules.length; i++) {
            const mod = doc.modules[i];
            const mPath = `modules[${i}]`;

            if (moduleIds.has(mod.id)) {
                diagnostics.push({
                    severity: 'error',
                    path: `${mPath}.id`,
                    message: `Duplicate module ID: "${mod.id}"`,
                });
            }
            moduleIds.add(mod.id);

            // Sandbox checks
            for (const pattern of DANGEROUS_PATTERNS) {
                if (pattern.test(mod.source)) {
                    diagnostics.push({
                        severity: 'warning',
                        path: `${mPath}.source`,
                        message: `Module "${mod.id}" contains potentially dangerous pattern: ${pattern.source}`,
                    });
                }
            }
        }
    }

    return diagnostics;
}
