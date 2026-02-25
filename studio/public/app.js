// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

let currentPageName = null;
let currentHtml = '';
let currentVersion = -1;
let viewportMode = 'desktop'; // 'desktop' | 'mobile'
let openPanelId = null;
let settingsConfigured = false; // true when API key is set
let hasAnyPages = false; // true when at least one page exists

// ---------------------------------------------------------------------------
// Custom icon registration (FluentIcons uses 16x16 viewBox)
// ---------------------------------------------------------------------------

if (typeof FluentIcons !== 'undefined' && FluentIcons.register) {
    // History icon — clock with hands (16x16)
    FluentIcons.register('History', 'M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1zm0 1a6 6 0 1 0 0 12A6 6 0 0 0 8 2zm.5 2a.5.5 0 0 1 .5.5V8l2.85 1.71a.5.5 0 1 1-.52.86L8.27 8.93A.5.5 0 0 1 8 8.5v-4a.5.5 0 0 1 .5-.5z');
    // Phone icon — mobile device (16x16)
    FluentIcons.register('Phone', 'M5 2.5A1.5 1.5 0 0 1 6.5 1h3A1.5 1.5 0 0 1 11 2.5v11A1.5 1.5 0 0 1 9.5 15h-3A1.5 1.5 0 0 1 5 13.5v-11zM6.5 2a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-.5-.5h-3zM7 12.5a1 1 0 1 1 2 0 1 1 0 0 1-2 0z');
    // Desktop icon — monitor (16x16)
    FluentIcons.register('Desktop', 'M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v7a1.5 1.5 0 0 1-1.5 1.5H10v1.5h1.5a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1H6V12H3.5A1.5 1.5 0 0 1 2 10.5v-7zM3.5 3a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-9zM7 12v1.5h2V12H7z');
}

// Helper: re-render icon on an element after changing data-icon
function rerenderIcon(el) {
    if (!el) return;
    el.removeAttribute('data-icon-rendered');
    // Remove existing SVG
    var svg = el.querySelector('svg');
    if (svg) svg.remove();
    if (typeof FluentLMIconComponent !== 'undefined') {
        FluentLMIconComponent.render(el);
    }
}

// ---------------------------------------------------------------------------
// DOM references
// ---------------------------------------------------------------------------

const preview = document.getElementById('preview');
const previewArea = document.getElementById('preview-area');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const saveBtnEl = document.getElementById('save-btn');
const chatMessages = document.getElementById('chat-messages');
const viewportBtn = document.getElementById('viewport-btn');

// Settings
const providerSelect = document.getElementById('provider-select');
const modelSelect = document.getElementById('model-select');
const modelSelectField = document.getElementById('model-select-field');
const modelInput = document.getElementById('model-input');
const modelInputField = document.getElementById('model-input-field');
const apiKeyInput = document.getElementById('api-key-input');
const themeSelect = document.getElementById('theme-select');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const modelAccordion = document.getElementById('model-accordion');
const appearanceAccordion = document.getElementById('appearance-accordion');

// Pages panel
const pageList = document.getElementById('page-list');
const newPageBtn = document.getElementById('new-page-btn');
const savePageSettingsBtn = document.getElementById('save-page-settings');
const pageFrameworkSelect = document.getElementById('page-framework-select');
const pageExtStyles = document.getElementById('page-ext-styles');
const pageExtScripts = document.getElementById('page-ext-scripts');

// New page modal (wizard)
const newPageModal = document.getElementById('new-page-modal');
const newPageName = document.getElementById('new-page-name');
const newPageDescription = document.getElementById('new-page-description');
const newPageFramework = document.getElementById('new-page-framework');
const newPageCoreLM = document.getElementById('new-page-corelm');
const newPageExtStyles = document.getElementById('new-page-ext-styles');
const newPageExtScripts = document.getElementById('new-page-ext-scripts');
const wizardBackBtn = document.getElementById('wizard-back-btn');
const wizardNextBtn = document.getElementById('wizard-next-btn');
const pageModeSelect = document.getElementById('page-mode-select');

// History
const versionList = document.getElementById('version-list');

// ---------------------------------------------------------------------------
// Panel management — only one panel open at a time
// ---------------------------------------------------------------------------

const panelIds = ['chat-panel', 'pages-panel', 'history-panel', 'settings-panel'];

function openPanel(panelId) {
    // Close any currently open panel
    if (openPanelId && openPanelId !== panelId) {
        closePanel(openPanelId);
    }

    const panel = document.getElementById(panelId);
    const overlay = document.getElementById(panelId + '-overlay');
    if (panel) {
        panel.classList.add('flm-panel--open');
    }
    if (overlay) {
        overlay.classList.add('flm-panel-overlay--active');
    }

    openPanelId = panelId;

    // Update toolbar active state
    document.querySelectorAll('.toolbar-btn[data-toolbar]').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-toolbar') === panelId);
    });

    // Load data for the panel
    if (panelId === 'history-panel' && currentPageName) {
        loadVersionHistory();
    }
    if (panelId === 'pages-panel') {
        loadPageList();
    }
}

function closePanel(panelId) {
    const panel = document.getElementById(panelId);
    const overlay = document.getElementById(panelId + '-overlay');
    if (panel) {
        panel.classList.remove('flm-panel--open');
    }
    if (overlay) {
        overlay.classList.remove('flm-panel-overlay--active');
    }

    if (openPanelId === panelId) {
        openPanelId = null;
    }

    // Clear toolbar active state
    document.querySelectorAll('.toolbar-btn[data-toolbar]').forEach(function(btn) {
        if (btn.getAttribute('data-toolbar') === panelId) {
            btn.classList.remove('active');
        }
    });
}

function closeAllPanels() {
    panelIds.forEach(function(id) { closePanel(id); });
}

function togglePanel(panelId) {
    if (openPanelId === panelId) {
        closePanel(panelId);
    } else {
        openPanel(panelId);
    }
}

// Toolbar button clicks
document.querySelectorAll('.toolbar-btn[data-toolbar]').forEach(function(btn) {
    btn.addEventListener('click', function() {
        togglePanel(btn.getAttribute('data-toolbar'));
    });
});

// Panel close buttons
document.querySelectorAll('[data-panel-close]').forEach(function(btn) {
    btn.addEventListener('click', function() {
        var panel = btn.closest('.flm-panel');
        if (panel) closePanel(panel.id);
    });
});

// Panel overlay clicks close panel
document.querySelectorAll('.flm-panel-overlay').forEach(function(overlay) {
    overlay.addEventListener('click', function() {
        // Find matching panel
        var panelId = overlay.id.replace('-overlay', '');
        closePanel(panelId);
    });
});

// ---------------------------------------------------------------------------
// Toolbar state — disable buttons based on configuration/page state
// ---------------------------------------------------------------------------

function updateToolbarState() {
    var hasPage = !!currentPageName;

    // Buttons that require settings to be configured (all except Settings itself)
    var chatBtn = document.querySelector('.toolbar-btn[data-toolbar="chat-panel"]');
    var pagesBtn = document.querySelector('.toolbar-btn[data-toolbar="pages-panel"]');
    var historyBtn = document.querySelector('.toolbar-btn[data-toolbar="history-panel"]');

    // Settings not configured: only Settings is enabled
    if (!settingsConfigured) {
        if (chatBtn) chatBtn.disabled = true;
        if (pagesBtn) pagesBtn.disabled = true;
        if (historyBtn) historyBtn.disabled = true;
        if (viewportBtn) viewportBtn.disabled = true;
        if (saveBtnEl) saveBtnEl.disabled = true;
        return;
    }

    // Pages button requires at least one page to exist
    if (pagesBtn) pagesBtn.disabled = !hasAnyPages;

    if (chatBtn) chatBtn.disabled = !hasPage;
    if (historyBtn) historyBtn.disabled = !hasPage;
    if (viewportBtn) viewportBtn.disabled = !hasPage;
    if (saveBtnEl) saveBtnEl.disabled = !hasPage;
}

// ---------------------------------------------------------------------------
// Welcome page (shown when no page is loaded)
// ---------------------------------------------------------------------------

function getWelcomeHtml() {
    var isDark = document.documentElement.classList.contains('fluent-dark');
    var themeClass = isDark ? ' class="fluent-dark"' : '';

    return '<!DOCTYPE html>\n' +
    '<html lang="en"' + themeClass + '>\n' +
    '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">\n' +
    '<link rel="stylesheet" href="/frameworks/fluentlm/fluentlm.min.css">\n' +
    '<link rel="stylesheet" href="/frameworks/fluentlm/theme-light.css">\n' +
    '<link rel="stylesheet" href="/frameworks/fluentlm/theme-dark.css">\n' +
    '<style>\n' +
    '  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }\n' +
    '  body { font-family: var(--fontFamily); background: var(--bodyBackground); color: var(--bodyText);\n' +
    '    height: 100vh; overflow: hidden; position: relative; transition: background 0.25s, color 0.25s; }\n' +
    '\n' +
    '  /* Each prompt is anchored at the viewport center and animated along a\n' +
    '     straight-line path that enters from one edge, drifts toward the CTA,\n' +
    '     then exits off the opposite edge. Opacity fades in/out at the ends. */\n' +
    '  .floating-prompt { position: absolute; top: 50%; left: 50%; white-space: nowrap;\n' +
    '    pointer-events: none; color: var(--bodyText); font-weight: 400;\n' +
    '    will-change: transform, opacity; opacity: 0; }\n' +
    '\n' +
    '  /* 10 unique paths — each goes from off-screen → near center → off-screen opposite side */\n' +
    '  /* 1  top-left  →  bottom-right */\n' +
    '  @keyframes p1 {\n' +
    '    0%   { transform: translate(-95vw, -55vh); opacity: 0; }\n' +
    '    15%  { opacity: 0.15; }\n' +
    '    50%  { transform: translate(-8vw, -4vh); opacity: 0.16; }\n' +
    '    85%  { opacity: 0.15; }\n' +
    '    100% { transform: translate(80vw, 48vh); opacity: 0; }\n' +
    '  }\n' +
    '  /* 2  right  →  left */\n' +
    '  @keyframes p2 {\n' +
    '    0%   { transform: translate(70vw, -18vh); opacity: 0; }\n' +
    '    15%  { opacity: 0.13; }\n' +
    '    50%  { transform: translate(5vw, -6vh); opacity: 0.14; }\n' +
    '    85%  { opacity: 0.13; }\n' +
    '    100% { transform: translate(-85vw, 8vh); opacity: 0; }\n' +
    '  }\n' +
    '  /* 3  bottom-left  →  top-right */\n' +
    '  @keyframes p3 {\n' +
    '    0%   { transform: translate(-80vw, 55vh); opacity: 0; }\n' +
    '    15%  { opacity: 0.14; }\n' +
    '    50%  { transform: translate(-3vw, 5vh); opacity: 0.15; }\n' +
    '    85%  { opacity: 0.14; }\n' +
    '    100% { transform: translate(75vw, -48vh); opacity: 0; }\n' +
    '  }\n' +
    '  /* 4  top  →  bottom */\n' +
    '  @keyframes p4 {\n' +
    '    0%   { transform: translate(-25vw, -60vh); opacity: 0; }\n' +
    '    15%  { opacity: 0.12; }\n' +
    '    50%  { transform: translate(-12vw, -2vh); opacity: 0.14; }\n' +
    '    85%  { opacity: 0.12; }\n' +
    '    100% { transform: translate(2vw, 58vh); opacity: 0; }\n' +
    '  }\n' +
    '  /* 5  left  →  right */\n' +
    '  @keyframes p5 {\n' +
    '    0%   { transform: translate(-85vw, 12vh); opacity: 0; }\n' +
    '    15%  { opacity: 0.15; }\n' +
    '    50%  { transform: translate(-6vw, 3vh); opacity: 0.16; }\n' +
    '    85%  { opacity: 0.15; }\n' +
    '    100% { transform: translate(72vw, -6vh); opacity: 0; }\n' +
    '  }\n' +
    '  /* 6  bottom-right  →  top-left */\n' +
    '  @keyframes p6 {\n' +
    '    0%   { transform: translate(75vw, 52vh); opacity: 0; }\n' +
    '    15%  { opacity: 0.13; }\n' +
    '    50%  { transform: translate(6vw, 4vh); opacity: 0.14; }\n' +
    '    85%  { opacity: 0.13; }\n' +
    '    100% { transform: translate(-82vw, -46vh); opacity: 0; }\n' +
    '  }\n' +
    '  /* 7  top-right  →  bottom-left */\n' +
    '  @keyframes p7 {\n' +
    '    0%   { transform: translate(68vw, -50vh); opacity: 0; }\n' +
    '    15%  { opacity: 0.12; }\n' +
    '    50%  { transform: translate(4vw, -3vh); opacity: 0.13; }\n' +
    '    85%  { opacity: 0.12; }\n' +
    '    100% { transform: translate(-78vw, 50vh); opacity: 0; }\n' +
    '  }\n' +
    '  /* 8  bottom  →  top */\n' +
    '  @keyframes p8 {\n' +
    '    0%   { transform: translate(18vw, 58vh); opacity: 0; }\n' +
    '    15%  { opacity: 0.14; }\n' +
    '    50%  { transform: translate(8vw, 2vh); opacity: 0.15; }\n' +
    '    85%  { opacity: 0.14; }\n' +
    '    100% { transform: translate(-4vw, -56vh); opacity: 0; }\n' +
    '  }\n' +
    '  /* 9  upper-left  →  lower-right (shallow angle) */\n' +
    '  @keyframes p9 {\n' +
    '    0%   { transform: translate(-90vw, -10vh); opacity: 0; }\n' +
    '    15%  { opacity: 0.13; }\n' +
    '    50%  { transform: translate(-10vw, 6vh); opacity: 0.14; }\n' +
    '    85%  { opacity: 0.13; }\n' +
    '    100% { transform: translate(70vw, 22vh); opacity: 0; }\n' +
    '  }\n' +
    '  /* 10  lower-right  →  upper-left (shallow angle) */\n' +
    '  @keyframes p10 {\n' +
    '    0%   { transform: translate(80vw, 20vh); opacity: 0; }\n' +
    '    15%  { opacity: 0.12; }\n' +
    '    50%  { transform: translate(10vw, -5vh); opacity: 0.13; }\n' +
    '    85%  { opacity: 0.12; }\n' +
    '    100% { transform: translate(-75vw, -28vh); opacity: 0; }\n' +
    '  }\n' +
    '\n' +
    '  .center-block { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);\n' +
    '    text-align: center; z-index: 1; }\n' +
    '  .center-block h1 { font-size: 2.2rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--bodyText); }\n' +
    '  .center-block p { font-size: 1.15rem; color: var(--neutralSecondary); margin-bottom: 1.5rem; }\n' +
    '  .cta-btn { display: inline-block; padding: 0.6rem 1.5rem; font-size: 0.95rem; font-weight: 500;\n' +
    '    border: none; border-radius: 6px; cursor: pointer;\n' +
    '    background: var(--themePrimary); color: #fff; transition: background 0.15s; }\n' +
    '  .cta-btn:hover { background: var(--themeDarkAlt); }\n' +
    '</style></head><body>\n' +
    '  <span class="floating-prompt" style="font-size:1.05rem;animation:p1 24s linear infinite -7s">Build me a pricing page with three tiers</span>\n' +
    '  <span class="floating-prompt" style="font-size:0.95rem;animation:p2 28s linear infinite -19s">Create a dashboard with charts and metrics</span>\n' +
    '  <span class="floating-prompt" style="font-size:1rem;animation:p3 26s linear infinite -3s">Design a login form with social sign-in</span>\n' +
    '  <span class="floating-prompt" style="font-size:0.9rem;animation:p4 30s linear infinite -22s">Make a portfolio site with a project grid</span>\n' +
    '  <span class="floating-prompt" style="font-size:1.05rem;animation:p5 22s linear infinite -11s">Add a hero section with a gradient background</span>\n' +
    '  <span class="floating-prompt" style="font-size:0.9rem;animation:p6 27s linear infinite -15s">Create a FAQ page with expandable sections</span>\n' +
    '  <span class="floating-prompt" style="font-size:0.95rem;animation:p7 25s linear infinite -8s">Build a team page with photo cards</span>\n' +
    '  <span class="floating-prompt" style="font-size:1rem;animation:p8 29s linear infinite -25s">Design a settings page with toggle switches</span>\n' +
    '  <span class="floating-prompt" style="font-size:0.9rem;animation:p9 23s linear infinite -17s">Make a landing page for a SaaS product</span>\n' +
    '  <span class="floating-prompt" style="font-size:0.95rem;animation:p10 31s linear infinite -4s">Create a blog layout with sidebar navigation</span>\n' +
    '  <div class="center-block">\n' +
    '    <h1>PageLM Studio</h1>\n' +
    '    <p>Describe it. Build it. Ship it.</p>\n' +
    '    <button class="cta-btn" onclick="window.parent.postMessage({action:\'createPage\'},\'*\')">Create a Page</button>\n' +
    '  </div>\n' +
    '<script>\n' +
    '  window.addEventListener("message", function(e) {\n' +
    '    if (e.data && e.data.action === "setTheme") {\n' +
    '      if (e.data.dark) { document.documentElement.classList.add("fluent-dark"); }\n' +
    '      else { document.documentElement.classList.remove("fluent-dark"); }\n' +
    '    }\n' +
    '  });\n' +
    '</script>\n' +
    '</body></html>';
}

// Listen for messages from the welcome page iframe
window.addEventListener('message', function(e) {
    if (e.data && e.data.action === 'createPage') {
        handleNewPage();
    }
});

// ---------------------------------------------------------------------------
// Preview
// ---------------------------------------------------------------------------

function updatePreview(html) {
    var doc = preview.contentDocument;
    if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
    }
}

// ---------------------------------------------------------------------------
// Chat messages
// ---------------------------------------------------------------------------

function appendMessage(role, text) {
    var div = document.createElement('div');
    var roleClass = role === 'error' ? 'error' : (role === 'You' ? 'user' : 'system');
    div.className = 'chat-msg chat-msg-' + roleClass;

    var roleSpan = document.createElement('span');
    roleSpan.className = 'role role-' + roleClass;
    roleSpan.textContent = role;
    div.appendChild(roleSpan);

    var body = document.createElement('span');
    body.textContent = text;
    div.appendChild(body);

    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
}

function appendSpinner() {
    var div = document.createElement('div');
    div.className = 'chat-msg chat-msg-system';
    div.id = 'thinking-msg';

    var roleSpan = document.createElement('span');
    roleSpan.className = 'role role-system';
    roleSpan.textContent = 'PageLM';
    div.appendChild(roleSpan);

    var spinner = document.createElement('span');
    spinner.className = 'spinner';
    div.appendChild(spinner);

    var text = document.createTextNode(' Thinking...');
    div.appendChild(text);

    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeSpinner() {
    var el = document.getElementById('thinking-msg');
    if (el) el.remove();
}

// ---------------------------------------------------------------------------
// Page list
// ---------------------------------------------------------------------------

async function loadPageList() {
    try {
        var res = await fetch('/api/pages');
        var pages = await res.json();
        hasAnyPages = pages.length > 0;
        updateToolbarState();
        pageList.innerHTML = '';

        if (pages.length === 0) {
            pageList.innerHTML = '<div class="empty-state">No pages yet. Create one to get started.</div>';
            return;
        }

        pages.forEach(function(name) {
            var item = document.createElement('div');
            item.className = 'page-list-item' + (name === currentPageName ? ' active' : '');
            item.setAttribute('data-page', name);

            var label = document.createElement('span');
            label.textContent = name;
            item.appendChild(label);

            var deleteBtn = document.createElement('button');
            deleteBtn.className = 'flm-button flm-button--icon flm-button--subtle delete-page-btn';
            deleteBtn.setAttribute('data-icon', 'Delete');
            deleteBtn.setAttribute('aria-label', 'Delete ' + name);
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                handleDeletePage(name);
            });
            item.appendChild(deleteBtn);

            // Render icon on the dynamically created delete button
            if (typeof FluentLMIconComponent !== 'undefined') {
                FluentLMIconComponent.render(deleteBtn);
            }

            item.addEventListener('click', function() {
                selectPage(name);
            });

            pageList.appendChild(item);
        });
    } catch (err) {
        // ignore
    }
}

async function selectPage(name) {
    if (!name) {
        currentPageName = null;
        currentHtml = '';
        currentVersion = -1;
        updatePreview(getWelcomeHtml());
        clearPageSettings();
        updateToolbarState();
        return;
    }

    try {
        var res = await fetch('/api/pages/' + encodeURIComponent(name));
        if (!res.ok) {
            appendMessage('error', 'Failed to load page');
            return;
        }
        var info = await res.json();
        currentPageName = name;
        currentVersion = info.versionCount - 1;

        if (info.latestHtml) {
            currentHtml = info.latestHtml;
        } else {
            currentHtml = '';
        }

        updatePreview(currentHtml);
        loadPageSettingsIntoPanel(info.settings);
        updateToolbarState();

        // Update page list active state
        document.querySelectorAll('.page-list-item').forEach(function(el) {
            el.classList.toggle('active', el.getAttribute('data-page') === name);
        });

        // Auto-open chat panel when a page is selected
        if (openPanelId === 'pages-panel') {
            openPanel('chat-panel');
        }
    } catch (err) {
        appendMessage('error', err.message || 'Failed to load page');
    }
}

function loadPageSettingsIntoPanel(settings) {
    pageFrameworkSelect.value = settings.framework || 'fluentlm';
    if (pageModeSelect) pageModeSelect.value = settings.mode || 'html';
    pageExtStyles.value = (settings.externalStyles || []).join('\n');
    pageExtScripts.value = (settings.externalScripts || []).join('\n');
}

function clearPageSettings() {
    pageFrameworkSelect.value = 'fluentlm';
    if (pageModeSelect) pageModeSelect.value = 'html';
    pageExtStyles.value = '';
    pageExtScripts.value = '';
}

// ---------------------------------------------------------------------------
// Page operations
// ---------------------------------------------------------------------------

function parseLines(text) {
    return text.split('\n').map(function(s) { return s.trim(); }).filter(Boolean);
}

// ---------------------------------------------------------------------------
// Wizard state
// ---------------------------------------------------------------------------

let wizardStep = 0;

function setWizardStep(step) {
    wizardStep = step;

    // Update panels
    document.querySelectorAll('.wizard-panel').forEach(function(panel, i) {
        panel.classList.toggle('wizard-panel--active', i === step);
    });

    // Update dots
    document.querySelectorAll('#wizard-dots .wizard-dot').forEach(function(dot, i) {
        dot.classList.remove('wizard-dot--active', 'wizard-dot--completed');
        if (i === step) {
            dot.classList.add('wizard-dot--active');
        } else if (i < step) {
            dot.classList.add('wizard-dot--completed');
        }
    });

    // Back button visibility (use visibility to preserve space for layout)
    wizardBackBtn.classList.toggle('wizard-back--hidden', step === 0);

    // Next button text
    wizardNextBtn.textContent = step === 2 ? 'Create' : 'Next';

    // Update disabled state
    updateWizardNextDisabled();
}

function updateWizardNextDisabled() {
    if (wizardStep === 0) {
        wizardNextBtn.disabled = !newPageName.value.trim();
    } else {
        wizardNextBtn.disabled = false;
    }
}

function handleWizardNext() {
    if (wizardStep < 2) {
        setWizardStep(wizardStep + 1);
    } else {
        handleCreatePage();
    }
}

function handleWizardBack() {
    if (wizardStep > 0) {
        setWizardStep(wizardStep - 1);
    }
}

function handleNewPage() {
    newPageName.value = '';
    newPageDescription.value = '';
    newPageFramework.value = 'fluentlm';
    if (newPageCoreLM) newPageCoreLM.checked = false;
    newPageExtStyles.value = '';
    newPageExtScripts.value = '';
    setWizardStep(0);
    // Open modal
    if (newPageModal) {
        newPageModal.classList.add('flm-modal-overlay--open');
    }
    newPageName.focus();
}

function closeNewPageModal() {
    if (newPageModal) {
        newPageModal.classList.remove('flm-modal-overlay--open');
    }
}

async function handleCreatePage() {
    var name = newPageName.value.trim();
    if (!name) return;

    var description = newPageDescription.value.trim();

    try {
        var res = await fetch('/api/pages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name,
                framework: newPageFramework.value,
                mode: (newPageCoreLM && newPageCoreLM.checked) ? 'corelm' : 'html',
                externalStyles: parseLines(newPageExtStyles.value),
                externalScripts: parseLines(newPageExtScripts.value),
            }),
        });

        if (!res.ok) {
            var data = await res.json().catch(function() { return { error: res.statusText }; });
            appendMessage('error', data.error || 'Failed to create page');
            return;
        }

        closeNewPageModal();
        await loadPageList();
        await selectPage(name);
        appendMessage('PageLM', 'Created page: ' + name);

        // If a description was provided, auto-send it as the first transform
        if (description) {
            appendMessage('You', description);
            sendBtn.disabled = true;
            appendSpinner();

            try {
                var tRes = await fetch('/api/pages/' + encodeURIComponent(name) + '/transform', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: description }),
                });

                removeSpinner();

                if (tRes.ok) {
                    var tData = await tRes.json();
                    currentHtml = tData.html;
                    currentVersion = tData.version;
                    updatePreview(currentHtml);
                    appendMessage('PageLM', 'Applied ' + tData.changeCount + ' change(s). Version ' + tData.version);
                } else {
                    var tErr = await tRes.json().catch(function() { return { error: tRes.statusText }; });
                    appendMessage('error', tErr.error || 'Transform failed');
                }
            } catch (transformErr) {
                removeSpinner();
                appendMessage('error', transformErr.message || 'Network error during transform');
            } finally {
                sendBtn.disabled = false;
                chatInput.focus();
            }
        }
    } catch (err) {
        appendMessage('error', err.message || 'Failed to create page');
    }
}

async function handleDeletePage(name) {
    if (!name) return;
    if (!confirm('Delete page "' + name + '"? This cannot be undone.')) return;

    try {
        await fetch('/api/pages/' + encodeURIComponent(name), { method: 'DELETE' });
        appendMessage('PageLM', 'Deleted page: ' + name);
        if (currentPageName === name) {
            currentPageName = null;
            currentHtml = '';
            currentVersion = -1;
            updatePreview(getWelcomeHtml());
            clearPageSettings();
            updateToolbarState();
        }
        await loadPageList();
    } catch (err) {
        appendMessage('error', err.message || 'Failed to delete page');
    }
}

// ---------------------------------------------------------------------------
// Transform (chat send)
// ---------------------------------------------------------------------------

async function handleSend() {
    var message = chatInput.value.trim();
    if (!message) return;
    if (!currentPageName) {
        appendMessage('error', 'Select or create a page first.');
        return;
    }

    chatInput.value = '';
    appendMessage('You', message);
    sendBtn.disabled = true;
    appendSpinner();

    try {
        var res = await fetch('/api/pages/' + encodeURIComponent(currentPageName) + '/transform', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message }),
        });

        removeSpinner();

        if (!res.ok) {
            var data = await res.json().catch(function() { return { error: res.statusText }; });
            appendMessage('error', data.error || 'Request failed');
            return;
        }

        var data = await res.json();
        currentHtml = data.html;
        currentVersion = data.version;
        updatePreview(currentHtml);
        appendMessage('PageLM', 'Applied ' + data.changeCount + ' change(s). Version ' + data.version);
    } catch (err) {
        removeSpinner();
        appendMessage('error', err.message || 'Network error');
    } finally {
        sendBtn.disabled = false;
        chatInput.focus();
    }
}

// ---------------------------------------------------------------------------
// Version history
// ---------------------------------------------------------------------------

async function loadVersionHistory() {
    if (!currentPageName) {
        versionList.innerHTML = '<div class="empty-state">Select a page to see its history.</div>';
        return;
    }

    try {
        var res = await fetch('/api/pages/' + encodeURIComponent(currentPageName) + '/versions');
        var versions = await res.json();

        versionList.innerHTML = '';

        if (versions.length === 0) {
            versionList.innerHTML = '<div class="empty-state">No versions yet.</div>';
            return;
        }

        versions.forEach(function(v) {
            var item = document.createElement('div');
            item.className = 'version-item' + (v.version === currentVersion ? ' active' : '');

            var label = document.createElement('span');
            label.className = 'version-label';
            label.textContent = 'v' + v.version;
            item.appendChild(label);

            var msg = document.createElement('span');
            msg.className = 'version-message';
            msg.textContent = v.message || '(initial)';
            item.appendChild(msg);

            item.addEventListener('click', function() {
                previewVersion(v.version);
            });

            versionList.appendChild(item);
        });
    } catch (err) {
        versionList.innerHTML = '<div class="empty-state">Failed to load history.</div>';
    }
}

async function previewVersion(ver) {
    if (!currentPageName) return;
    try {
        var res = await fetch('/api/pages/' + encodeURIComponent(currentPageName) + '/versions/' + ver);
        if (!res.ok) return;
        var data = await res.json();
        currentHtml = data.html;
        currentVersion = ver;
        updatePreview(currentHtml);

        // Update active state in version list
        document.querySelectorAll('.version-item').forEach(function(el, i) {
            el.classList.toggle('active', i === ver);
        });
    } catch (err) {
        // ignore
    }
}

// ---------------------------------------------------------------------------
// Viewport toggle
// ---------------------------------------------------------------------------

function toggleViewport() {
    if (viewportMode === 'desktop') {
        viewportMode = 'mobile';
        previewArea.classList.add('mobile-viewport');
        viewportBtn.classList.add('active');
    } else {
        viewportMode = 'desktop';
        previewArea.classList.remove('mobile-viewport');
        viewportBtn.classList.remove('active');
    }
}

// ---------------------------------------------------------------------------
// Save / download HTML
// ---------------------------------------------------------------------------

function handleSave() {
    if (!currentHtml) return;
    var blob = new Blob([currentHtml], { type: 'text/html' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = (currentPageName || 'page') + '.html';
    a.click();
    URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------

function applyTheme(theme) {
    var html = document.documentElement;
    if (theme === 'dark') {
        html.classList.add('fluent-dark');
        if (typeof FluentLM !== 'undefined' && FluentLM.setTheme) {
            FluentLM.setTheme('dark');
        }
    } else if (theme === 'light') {
        html.classList.remove('fluent-dark');
        if (typeof FluentLM !== 'undefined' && FluentLM.setTheme) {
            FluentLM.setTheme('light');
        }
    } else {
        // system
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            html.classList.add('fluent-dark');
            if (typeof FluentLM !== 'undefined' && FluentLM.setTheme) {
                FluentLM.setTheme('dark');
            }
        } else {
            html.classList.remove('fluent-dark');
            if (typeof FluentLM !== 'undefined' && FluentLM.setTheme) {
                FluentLM.setTheme('light');
            }
        }
    }

    // Sync theme to preview iframe (for welcome page)
    syncThemeToPreview();
}

function syncThemeToPreview() {
    var isDark = document.documentElement.classList.contains('fluent-dark');
    if (preview && preview.contentWindow) {
        preview.contentWindow.postMessage({ action: 'setTheme', dark: isDark }, '*');
    }
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
    if (themeSelect && themeSelect.value === 'system') {
        applyTheme('system');
    }
});

// ---------------------------------------------------------------------------
// Settings (global)
// ---------------------------------------------------------------------------

// Toggle model field between dropdown (anthropic) and text input (others)
function updateModelField() {
    var isAnthropic = providerSelect.value === 'anthropic';
    modelSelectField.style.display = isAnthropic ? '' : 'none';
    modelInputField.style.display = isAnthropic ? 'none' : '';
}

providerSelect.addEventListener('change', updateModelField);

// Enable/disable model fields and save button based on API key state
function updateSettingsFieldState() {
    var hasKey = settingsConfigured || apiKeyInput.value.trim().length > 0;
    modelSelect.disabled = !hasKey;
    modelInput.disabled = !hasKey;
    saveSettingsBtn.disabled = !hasKey;
}

apiKeyInput.addEventListener('input', updateSettingsFieldState);

// Get the current model value from whichever field is active
function getModelValue() {
    if (providerSelect.value === 'anthropic') {
        return modelSelect.value;
    }
    return modelInput.value;
}

// Set model value into the correct field
function setModelValue(model) {
    if (providerSelect.value === 'anthropic') {
        // If the model matches one of the dropdown options, select it
        var options = Array.from(modelSelect.options).map(function(o) { return o.value; });
        if (options.indexOf(model) !== -1) {
            modelSelect.value = model;
        } else {
            // Default to first option if model doesn't match
            modelSelect.selectedIndex = 0;
        }
    } else {
        modelInput.value = model || '';
    }
}

async function loadSettings() {
    try {
        var res = await fetch('/api/settings');
        var data = await res.json();
        providerSelect.value = data.provider;
        updateModelField();
        setModelValue(data.model || '');
        apiKeyInput.placeholder = data.hasApiKey ? '(configured)' : 'sk-...';
        if (themeSelect) themeSelect.value = data.theme || 'system';
        applyTheme(data.theme || 'system');
        settingsConfigured = !!data.hasApiKey;
        updateToolbarState();
        updateSettingsFieldState();

        // Accordion states: configured → Appearance open, Model closed
        // Not configured → Appearance closed, Model open
        if (modelAccordion) {
            modelAccordion.open = !data.hasApiKey;
        }
        if (appearanceAccordion) {
            appearanceAccordion.open = !!data.hasApiKey;
        }

        return data;
    } catch (err) {
        return null;
    }
}

async function handleSaveSettings() {
    var body = {};
    if (providerSelect.value) body.provider = providerSelect.value;
    var modelVal = getModelValue();
    if (modelVal) body.model = modelVal;
    if (apiKeyInput.value) body.apiKey = apiKeyInput.value;
    if (themeSelect) body.theme = themeSelect.value;

    try {
        var res = await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        var data = await res.json();
        providerSelect.value = data.provider;
        updateModelField();
        setModelValue(data.model || '');
        apiKeyInput.value = '';
        apiKeyInput.placeholder = data.hasApiKey ? '(configured)' : 'sk-...';
        if (themeSelect) themeSelect.value = data.theme || 'system';
        applyTheme(data.theme || 'system');
        settingsConfigured = !!data.hasApiKey;
        updateToolbarState();
        updateSettingsFieldState();
        closePanel('settings-panel');

        // After configuring settings, show welcome page if no page loaded
        if (settingsConfigured && !currentPageName) {
            updatePreview(getWelcomeHtml());
        }
    } catch (err) {
        appendMessage('error', 'Failed to save settings: ' + err.message);
    }
}

// Save page settings
async function handleSavePageSettings() {
    if (!currentPageName) {
        appendMessage('error', 'Select a page first.');
        return;
    }
    try {
        await fetch('/api/pages/' + encodeURIComponent(currentPageName) + '/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                framework: pageFrameworkSelect.value,
                mode: pageModeSelect ? pageModeSelect.value : 'html',
                externalStyles: parseLines(pageExtStyles.value),
                externalScripts: parseLines(pageExtScripts.value),
            }),
        });
        // Settings saved silently — no chat message
    } catch (err) {
        appendMessage('error', 'Failed to save page settings: ' + err.message);
    }
}

// ---------------------------------------------------------------------------
// Event listeners
// ---------------------------------------------------------------------------

sendBtn.addEventListener('click', handleSend);
saveBtnEl.addEventListener('click', handleSave);
viewportBtn.addEventListener('click', toggleViewport);
saveSettingsBtn.addEventListener('click', handleSaveSettings);
savePageSettingsBtn.addEventListener('click', handleSavePageSettings);
newPageBtn.addEventListener('click', handleNewPage);
wizardNextBtn.addEventListener('click', handleWizardNext);
wizardBackBtn.addEventListener('click', handleWizardBack);

// Enable/disable Next button as user types page name
newPageName.addEventListener('input', updateWizardNextDisabled);

chatInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
});

newPageName.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        if (!wizardNextBtn.disabled) {
            handleWizardNext();
        }
    }
});

// ---------------------------------------------------------------------------
// Init — smart startup
// ---------------------------------------------------------------------------

(async function init() {
    // Load settings and apply theme
    var settings = await loadSettings();

    // Load page list
    await loadPageList();

    // Smart startup behavior
    if (!settings || !settings.hasApiKey) {
        // No API key → open Settings panel
        openPanel('settings-panel');
    } else {
        // Check if there are pages
        try {
            var res = await fetch('/api/pages');
            var pages = await res.json();
            if (pages.length === 0) {
                // No pages → show welcome page, all panels closed
                updatePreview(getWelcomeHtml());
            } else {
                // Select first page and open chat
                await selectPage(pages[0]);
                openPanel('chat-panel');
            }
        } catch (err) {
            updatePreview(getWelcomeHtml());
        }
    }
})();
