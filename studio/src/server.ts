import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import open from 'open';
import { transformPage, transformCorePage } from '@pagelm/core';
import type { CoreDocument } from '@pagelm/corelm';
import { compileDocument, createFluentLMAdapter, createNoneAdapter } from '@pagelm/corelm-compiler';
import { createBuilder, BuilderConfig } from './createBuilder.js';
import {
    init,
    validatePageName,
    listPages,
    createPage,
    getPageSettings,
    updatePageSettings,
    deletePage,
    getLatestVersion,
    getVersionHtml,
    getVersionTurn,
    saveVersion,
    getPageInfo,
    getGlobalSettings,
    saveGlobalSettings,
    loadCoreDocument,
    saveCoreDocument,
    getLatestCoreDocument,
    PageSettings,
    GlobalSettings,
} from './workspace.js';
import { stripInjectedSections, injectFrameworkAndExternals } from './frameworkInjection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface ServerOptions {
    port: number;
    provider: string;
    apiKey: string;
    model: string;
    debug?: boolean;
    debugPageUpdates?: boolean;
}

export function startServer(options: ServerOptions): void {
    const { port, provider, apiKey, model, debug, debugPageUpdates } = options;
    const cwd = process.cwd();

    // Ensure workspace directories exist
    init(cwd);

    const app = express();
    app.use(express.json({ limit: '50mb' }));

    // -----------------------------------------------------------------------
    // Static files
    // -----------------------------------------------------------------------

    const publicDir = resolve(__dirname, '..', 'public');
    app.use(express.static(publicDir));

    // Serve studio static files (studio.css, etc.)
    const staticFilesDir = resolve(__dirname, '..', 'static-files');
    app.use('/static-files', express.static(staticFilesDir));

    // Serve fluentlm assets at /fluentlm/ (for the builder shell UI)
    let fluentlmDir: string;
    try {
        const fluentlmPkg = resolve(__dirname, '..', '..', 'frameworks', 'fluentlm');
        if (existsSync(fluentlmPkg)) {
            fluentlmDir = fluentlmPkg;
        } else {
            fluentlmDir = fluentlmPkg; // fallback to same path
        }
    } catch {
        fluentlmDir = resolve(__dirname, '..', '..', 'frameworks', 'fluentlm');
    }
    app.use('/fluentlm', express.static(fluentlmDir));

    // Serve all page frameworks at /frameworks/
    const frameworksRoot = resolve(__dirname, '..', '..', 'frameworks');
    app.use('/frameworks', express.static(frameworksRoot));

    // -----------------------------------------------------------------------
    // Mutable config — load from global settings, override with CLI args
    // -----------------------------------------------------------------------

    const globalSettings = getGlobalSettings(cwd);
    let builderConfig: BuilderConfig = {
        provider: provider || globalSettings.provider,
        apiKey: apiKey || globalSettings.apiKey,
        model: model || globalSettings.model,
    };

    // -----------------------------------------------------------------------
    // API: GET/POST /api/settings (replaces /api/config)
    // -----------------------------------------------------------------------

    app.get('/api/settings', (_req, res) => {
        const settings = getGlobalSettings(cwd);
        res.json({
            provider: settings.provider,
            model: settings.model,
            hasApiKey: !!settings.apiKey,
            theme: settings.theme,
        });
    });

    app.post('/api/settings', (req, res) => {
        const body = req.body as Partial<GlobalSettings>;
        const current = getGlobalSettings(cwd);

        if (body.provider !== undefined) current.provider = body.provider;
        if (body.model !== undefined) current.model = body.model;
        if (body.apiKey !== undefined) current.apiKey = body.apiKey;
        if (body.theme !== undefined) current.theme = body.theme;

        saveGlobalSettings(cwd, current);

        // Update runtime config
        builderConfig.provider = current.provider;
        builderConfig.model = current.model;
        if (current.apiKey) builderConfig.apiKey = current.apiKey;

        res.json({
            provider: current.provider,
            model: current.model,
            hasApiKey: !!current.apiKey,
            theme: current.theme,
        });
    });

    // -----------------------------------------------------------------------
    // API: Pages CRUD
    // -----------------------------------------------------------------------

    // List pages
    app.get('/api/pages', (_req, res) => {
        res.json(listPages(cwd));
    });

    // Create page
    app.post('/api/pages', (req, res) => {
        const { name, framework, externalStyles, externalScripts, mode } = req.body as {
            name?: string;
            framework?: string;
            externalStyles?: string[];
            externalScripts?: string[];
            mode?: 'html' | 'corelm';
        };

        const trimmed = (name ?? '').trim();
        const err = validatePageName(trimmed);
        if (err) {
            res.status(400).json({ error: err });
            return;
        }

        const settings: PageSettings = {
            name: trimmed,
            framework: framework ?? 'fluentlm',
            externalStyles: externalStyles ?? [],
            externalScripts: externalScripts ?? [],
            mode: mode ?? 'html',
        };

        try {
            createPage(cwd, settings);
            res.status(201).json(settings);
        } catch (e: unknown) {
            res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
        }
    });

    // Get page info
    app.get('/api/pages/:name', (req, res) => {
        const { name } = req.params;
        try {
            const info = getPageInfo(cwd, name);
            res.json(info);
        } catch {
            res.status(404).json({ error: 'Page not found' });
        }
    });

    // Delete page
    app.delete('/api/pages/:name', (req, res) => {
        const { name } = req.params;
        try {
            deletePage(cwd, name);
            res.json({ ok: true });
        } catch (e: unknown) {
            res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
        }
    });

    // Update page settings
    app.post('/api/pages/:name/settings', (req, res) => {
        const { name } = req.params;
        const partial = req.body as Partial<PageSettings>;
        try {
            const updated = updatePageSettings(cwd, name, partial);
            res.json(updated);
        } catch {
            res.status(404).json({ error: 'Page not found' });
        }
    });

    // -----------------------------------------------------------------------
    // API: Versions
    // -----------------------------------------------------------------------

    // List versions with messages (for history panel)
    app.get('/api/pages/:name/versions', (req, res) => {
        const { name } = req.params;
        const latest = getLatestVersion(cwd, name);
        const versions: { version: number; message: string }[] = [];
        for (let i = 0; i <= latest; i++) {
            let message = '';
            try {
                const turn = getVersionTurn(cwd, name, i);
                message = turn.message || '';
            } catch { /* no turn metadata */ }
            versions.push({ version: i, message });
        }
        res.json(versions);
    });

    // Get specific version
    app.get('/api/pages/:name/versions/:ver', (req, res) => {
        const { name, ver } = req.params;
        const v = parseInt(ver, 10);
        try {
            const html = getVersionHtml(cwd, name, v);
            const turn = getVersionTurn(cwd, name, v);
            res.json({ html, turn, version: v });
        } catch {
            res.status(404).json({ error: 'Version not found' });
        }
    });

    // -----------------------------------------------------------------------
    // API: Transform
    // -----------------------------------------------------------------------

    app.post('/api/pages/:name/transform', async (req, res) => {
        const { name } = req.params;
        const { message, instructions } = req.body as {
            message: string;
            instructions?: string;
        };

        if (!message) {
            res.status(400).json({ error: 'message is required' });
            return;
        }

        if (debug) console.log(`[transform] page="${name}" message="${message.slice(0, 80)}${message.length > 80 ? '…' : ''}"`);

        try {
            // Load settings
            let settings: PageSettings;
            try {
                settings = getPageSettings(cwd, name);
            } catch {
                res.status(404).json({ error: 'Page not found' });
                return;
            }

            const pageMode = settings.mode ?? 'html';

            if (pageMode === 'corelm') {
                // ---------------------------------------------------------------
                // CoreLM mode
                // ---------------------------------------------------------------
                const coreLMBuilder = createBuilder({ ...builderConfig, coreLM: true });

                // Load or create CoreLM document
                const latest = getLatestCoreDocument(cwd, name);
                let coreDoc: CoreDocument;
                if (latest) {
                    coreDoc = latest.document as CoreDocument;
                } else {
                    // Default empty CoreLM document
                    coreDoc = {
                        version: '1.0',
                        app: {
                            id: 'app-root',
                            type: 'App',
                            props: { title: 'New Page', state: {} },
                            children: [],
                        },
                    };
                }

                const result = await transformCorePage({
                    document: coreDoc,
                    message,
                    instructions,
                    builder: coreLMBuilder,
                    additionalSections: [],
                    productName: 'PageLM',
                });

                if (!result.completed || !result.value) {
                    res.status(500).json({ error: result.error?.message ?? 'CoreLM transform failed' });
                    return;
                }

                if (debug) console.log(`[transform:corelm] changeCount=${result.value.changeCount}`);

                // Compile CoreLM document to HTML
                const adapter = settings.framework === 'fluentlm' ? createFluentLMAdapter() : createNoneAdapter();
                const compiledHtml = compileDocument(result.value.document, adapter);

                if (debugPageUpdates) console.log(`[transform:corelm] html output:\n${compiledHtml}`);

                // Save both CoreLM document and compiled HTML
                const turn = {
                    message,
                    response: { html: compiledHtml, changeCount: result.value.changeCount },
                };
                const version = saveVersion(cwd, name, compiledHtml, turn);
                saveCoreDocument(cwd, name, version, result.value.document);

                if (debug) console.log(`[transform:corelm] saved version=${version}`);

                res.json({
                    html: compiledHtml,
                    changeCount: result.value.changeCount,
                    version,
                });
            } else {
                // ---------------------------------------------------------------
                // HTML mode (existing flow)
                // ---------------------------------------------------------------
                const latestVer = getLatestVersion(cwd, name);
                let currentHtml: string;
                if (latestVer >= 0) {
                    currentHtml = getVersionHtml(cwd, name, latestVer);
                } else {
                    currentHtml = [
                        '<!DOCTYPE html>',
                        '<html><head><title>New Page</title></head>',
                        '<body>',
                        '  <div class="viewerPanel">',
                        '    <p>Hello from PageLM. Tell me what to build.</p>',
                        '  </div>',
                        '</body></html>',
                    ].join('\n');
                }

                // Strip framework sections before sending to LLM
                const stripped = stripInjectedSections(currentHtml);

                // Transform
                const builder = createBuilder(builderConfig);
                const result = await transformPage({
                    pageState: stripped,
                    message,
                    instructions,
                    builder,
                    additionalSections: [],
                    productName: 'PageLM',
                });

                if (!result.completed || !result.value) {
                    res.status(500).json({ error: result.error?.message ?? 'Transform failed' });
                    return;
                }

                if (debug) console.log(`[transform] changeCount=${result.value.changeCount}`);
                if (debugPageUpdates) console.log(`[transform] html output:\n${result.value.html}`);

                // Re-inject framework and externals
                const injected = injectFrameworkAndExternals(result.value.html, settings);

                // Save version
                const turn = {
                    message,
                    response: { html: result.value.html, changeCount: result.value.changeCount },
                };
                const version = saveVersion(cwd, name, injected, turn);

                if (debug) console.log(`[transform] saved version=${version}`);

                res.json({
                    html: injected,
                    changeCount: result.value.changeCount,
                    version,
                });
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            if (debug) console.error(`[transform] error: ${msg}`);
            res.status(500).json({ error: msg });
        }
    });

    // -----------------------------------------------------------------------
    // Start
    // -----------------------------------------------------------------------

    app.listen(port, () => {
        const url = `http://localhost:${port}`;
        console.log(`\nPageLM Studio — ${url}\n`);
        open(url).catch(() => { /* ignore if open fails */ });
    });
}
