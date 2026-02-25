import { mkdirSync, readdirSync, readFileSync, writeFileSync, rmSync, existsSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GlobalSettings {
    provider: string;
    model: string;
    apiKey: string;
    theme: string;
}

export interface PageSettings {
    name: string;
    framework: string;
    externalStyles: string[];
    externalScripts: string[];
    /** Page mode: "html" for legacy HTML transforms, "corelm" for structured CoreLM mode */
    mode: 'html' | 'corelm';
}

export interface PageInfo {
    settings: PageSettings;
    versionCount: number;
    latestHtml: string | null;
}

export interface VersionTurn {
    message: string;
    response: { html: string; changeCount: number };
}

// ---------------------------------------------------------------------------
// Global settings
// ---------------------------------------------------------------------------

const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
    provider: 'anthropic',
    model: 'claude-opus-4-6',
    apiKey: '',
    theme: 'system',
};

function globalSettingsPath(cwd: string): string {
    return join(cwd, '.pagelm', 'settings.json');
}

export function getGlobalSettings(cwd: string): GlobalSettings {
    const file = globalSettingsPath(cwd);
    if (!existsSync(file)) return { ...DEFAULT_GLOBAL_SETTINGS };
    try {
        const raw = JSON.parse(readFileSync(file, 'utf-8'));
        return { ...DEFAULT_GLOBAL_SETTINGS, ...raw };
    } catch {
        return { ...DEFAULT_GLOBAL_SETTINGS };
    }
}

export function saveGlobalSettings(cwd: string, settings: GlobalSettings): void {
    const dir = join(cwd, '.pagelm');
    mkdirSync(dir, { recursive: true });
    writeFileSync(globalSettingsPath(cwd), JSON.stringify(settings, null, 2));
}

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

function pagesDir(cwd: string): string {
    return join(cwd, '.pagelm', 'pages');
}

function pageDir(cwd: string, name: string): string {
    return join(pagesDir(cwd), name);
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

export function init(cwd: string): void {
    mkdirSync(pagesDir(cwd), { recursive: true });
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const PAGE_NAME_RE = /^[a-z0-9][a-z0-9-]*$/;
const MAX_NAME_LEN = 64;

export function validatePageName(name: string): string | null {
    if (!name) return 'Page name is required';
    if (name.length > MAX_NAME_LEN) return `Page name must be ${MAX_NAME_LEN} characters or fewer`;
    if (!PAGE_NAME_RE.test(name)) return 'Page name must be lowercase alphanumeric with hyphens (e.g. my-landing-page)';
    return null;
}

// ---------------------------------------------------------------------------
// Framework templates
// ---------------------------------------------------------------------------

export function getFrameworkTemplate(framework: string): string | null {
    if (!framework || framework === 'none') return null;
    const templatePath = resolve(__dirname, '..', '..', 'frameworks', framework, 'template.html');
    if (!existsSync(templatePath)) return null;
    return readFileSync(templatePath, 'utf-8');
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export function listPages(cwd: string): string[] {
    const dir = pagesDir(cwd);
    if (!existsSync(dir)) return [];
    return readdirSync(dir).filter((entry) => {
        const full = join(dir, entry);
        return statSync(full).isDirectory() && existsSync(join(full, 'settings.json'));
    });
}

export function createPage(cwd: string, settings: PageSettings): void {
    const dir = pageDir(cwd, settings.name);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'settings.json'), JSON.stringify(settings, null, 2));

    // Write framework template as version 0 if available
    const template = getFrameworkTemplate(settings.framework);
    if (template) {
        writeFileSync(join(dir, 'page-0.html'), template);
        writeFileSync(join(dir, 'page-0.json'), JSON.stringify({
            message: '',
            response: { html: template, changeCount: 0 },
        }, null, 2));
    }
}

export function getPageSettings(cwd: string, name: string): PageSettings {
    const file = join(pageDir(cwd, name), 'settings.json');
    return JSON.parse(readFileSync(file, 'utf-8'));
}

export function updatePageSettings(cwd: string, name: string, partial: Partial<PageSettings>): PageSettings {
    const settings = getPageSettings(cwd, name);
    Object.assign(settings, partial);
    writeFileSync(join(pageDir(cwd, name), 'settings.json'), JSON.stringify(settings, null, 2));
    return settings;
}

export function deletePage(cwd: string, name: string): void {
    rmSync(pageDir(cwd, name), { recursive: true, force: true });
}

// ---------------------------------------------------------------------------
// Versions
// ---------------------------------------------------------------------------

export function getLatestVersion(cwd: string, name: string): number {
    const dir = pageDir(cwd, name);
    if (!existsSync(dir)) return -1;
    let max = -1;
    for (const f of readdirSync(dir)) {
        const m = f.match(/^page-(\d+)\.html$/);
        if (m) {
            const n = parseInt(m[1], 10);
            if (n > max) max = n;
        }
    }
    return max;
}

export function getVersionHtml(cwd: string, name: string, ver: number): string {
    return readFileSync(join(pageDir(cwd, name), `page-${ver}.html`), 'utf-8');
}

export function getVersionTurn(cwd: string, name: string, ver: number): VersionTurn {
    return JSON.parse(readFileSync(join(pageDir(cwd, name), `page-${ver}.json`), 'utf-8'));
}

export function saveVersion(cwd: string, name: string, html: string, turn: VersionTurn): number {
    const next = getLatestVersion(cwd, name) + 1;
    const dir = pageDir(cwd, name);
    writeFileSync(join(dir, `page-${next}.html`), html);
    writeFileSync(join(dir, `page-${next}.json`), JSON.stringify(turn, null, 2));
    return next;
}

// ---------------------------------------------------------------------------
// Composite
// ---------------------------------------------------------------------------

export function getPageInfo(cwd: string, name: string): PageInfo {
    const settings = getPageSettings(cwd, name);
    const latest = getLatestVersion(cwd, name);
    return {
        settings,
        versionCount: latest + 1,
        latestHtml: latest >= 0 ? getVersionHtml(cwd, name, latest) : null,
    };
}

// ---------------------------------------------------------------------------
// CoreLM document storage
// ---------------------------------------------------------------------------

export function loadCoreDocument(cwd: string, name: string, ver: number): unknown {
    const file = join(pageDir(cwd, name), `page-${ver}.corelm.json`);
    return JSON.parse(readFileSync(file, 'utf-8'));
}

export function saveCoreDocument(cwd: string, name: string, ver: number, doc: unknown): void {
    const file = join(pageDir(cwd, name), `page-${ver}.corelm.json`);
    writeFileSync(file, JSON.stringify(doc, null, 2));
}

export function getLatestCoreDocument(cwd: string, name: string): { version: number; document: unknown } | null {
    const dir = pageDir(cwd, name);
    if (!existsSync(dir)) return null;
    let max = -1;
    for (const f of readdirSync(dir)) {
        const m = f.match(/^page-(\d+)\.corelm\.json$/);
        if (m) {
            const n = parseInt(m[1], 10);
            if (n > max) max = n;
        }
    }
    if (max < 0) return null;
    return { version: max, document: loadCoreDocument(cwd, name, max) };
}
