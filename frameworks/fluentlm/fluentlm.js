/**
 * FluentLM — Main Runtime
 *
 * On DOMContentLoaded, initializes the theme and walks the DOM to
 * enhance elements that need JS (icons, split buttons, toggles, etc.).
 *
 * Components that are pure CSS (Stack, Text, Label, Link, Separator,
 * Spinner, TextField, Checkbox, Dropdown, Breadcrumb, Image,
 * ProgressIndicator, Persona, Overlay) require no JS initialization.
 *
 * Load order:
 *   1. icons.js          (icon registry — no deps)
 *   2. components/*.js   (component modules — depend on FluentIcons)
 *   3. theme.js          (theme manager — no deps)
 *   4. fluentlm.js   (this file — orchestrator)
 */
var FluentLM = (function () {
  'use strict';

  var initialized = false;

  /**
   * Initialize all components on the page.
   * Safe to call multiple times (idempotent per element).
   * Optionally pass a root element to scope initialization.
   */
  function init(root) {
    // Theme
    FluentTheme.init();

    // Tier 1 components
    FluentLMIconComponent.init(root);
    FluentLMButtonComponent.init(root);
    FluentLMToggleComponent.init(root);
    FluentLMMessageBarComponent.init(root);
    FluentLMDropdownComponent.init(root);

    // Tier 2 components
    FluentLMSearchBoxComponent.init(root);
    FluentLMDialogComponent.init(root);
    FluentLMPanelComponent.init(root);
    FluentLMModalComponent.init(root);
    FluentLMCalloutComponent.init(root);
    FluentLMContextMenuComponent.init(root);
    FluentLMNavComponent.init(root);
    FluentLMPivotComponent.init(root);
    FluentLMTooltipComponent.init(root);
    FluentLMCommandBarComponent.init(root);

    // Tier 3 components
    FluentLMGroupedListComponent.init(root);
    FluentLMRatingComponent.init(root);
    FluentLMFacepileComponent.init(root);
    FluentLMSwatchColorPickerComponent.init(root);
    FluentLMDocumentCardComponent.init(root);
    FluentLMSpinButtonComponent.init(root);
    FluentLMSliderComponent.init(root);
    FluentLMComboBoxComponent.init(root);
    FluentLMTeachingBubbleComponent.init(root);
    FluentLMHoverCardComponent.init(root);
    FluentLMCoachmarkComponent.init(root);
    FluentLMDatePickerComponent.init(root);

    // Tier 4 components
    FluentLMTagPickerComponent.init(root);
    FluentLMOverflowSetComponent.init(root);
    FluentLMTimePickerComponent.init(root);

    initialized = true;
  }

  /**
   * Re-initialize new elements added after page load.
   * Call this after dynamically inserting HTML with flm-* components.
   * Optionally scope to a container element.
   */
  function refresh(root) {
    FluentLMIconComponent.init(root);
    FluentLMButtonComponent.init(root);
    FluentLMToggleComponent.init(root);
    FluentLMMessageBarComponent.init(root);
    FluentLMDropdownComponent.init(root);
    FluentLMSearchBoxComponent.init(root);
    FluentLMDialogComponent.init(root);
    FluentLMPanelComponent.init(root);
    FluentLMModalComponent.init(root);
    FluentLMCalloutComponent.init(root);
    FluentLMContextMenuComponent.init(root);
    FluentLMNavComponent.init(root);
    FluentLMPivotComponent.init(root);
    FluentLMTooltipComponent.init(root);
    FluentLMCommandBarComponent.init(root);

    // Tier 3 components
    FluentLMGroupedListComponent.init(root);
    FluentLMRatingComponent.init(root);
    FluentLMFacepileComponent.init(root);
    FluentLMSwatchColorPickerComponent.init(root);
    FluentLMDocumentCardComponent.init(root);
    FluentLMSpinButtonComponent.init(root);
    FluentLMSliderComponent.init(root);
    FluentLMComboBoxComponent.init(root);
    FluentLMTeachingBubbleComponent.init(root);
    FluentLMHoverCardComponent.init(root);
    FluentLMCoachmarkComponent.init(root);
    FluentLMDatePickerComponent.init(root);

    // Tier 4 components
    FluentLMTagPickerComponent.init(root);
    FluentLMOverflowSetComponent.init(root);
    FluentLMTimePickerComponent.init(root);
  }

  /**
   * Register a custom theme.
   * @param {string} name      - Theme identifier (e.g. 'highcontrast')
   * @param {string} className - CSS class applied to <html> (e.g. 'fluent-highcontrast')
   */
  function registerTheme(name, className) {
    FluentTheme.register(name, className);
  }

  /**
   * Set theme by name (e.g. 'light', 'dark', or any registered theme).
   */
  function setTheme(theme) {
    FluentTheme.setTheme(theme);
  }

  /**
   * Toggle to the next theme. Returns new theme name.
   */
  function toggleTheme() {
    return FluentTheme.toggle();
  }

  /**
   * Get current theme name.
   */
  function getTheme() {
    return FluentTheme.current();
  }

  // Auto-initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(); });
  } else {
    // DOM already ready (script loaded with defer or at end of body)
    init();
  }

  // Expose sub-component APIs for direct use
  return {
    init: init,
    refresh: refresh,
    registerTheme: registerTheme,
    setTheme: setTheme,
    toggleTheme: toggleTheme,
    getTheme: getTheme,
    dialog: typeof FluentLMDialogComponent !== 'undefined' ? FluentLMDialogComponent : null,
    panel: typeof FluentLMPanelComponent !== 'undefined' ? FluentLMPanelComponent : null,
    modal: typeof FluentLMModalComponent !== 'undefined' ? FluentLMModalComponent : null,
    callout: typeof FluentLMCalloutComponent !== 'undefined' ? FluentLMCalloutComponent : null,
    contextMenu: typeof FluentLMContextMenuComponent !== 'undefined' ? FluentLMContextMenuComponent : null,
    comboBox: typeof FluentLMComboBoxComponent !== 'undefined' ? FluentLMComboBoxComponent : null,
    datePicker: typeof FluentLMDatePickerComponent !== 'undefined' ? FluentLMDatePickerComponent : null,
    teachingBubble: typeof FluentLMTeachingBubbleComponent !== 'undefined' ? FluentLMTeachingBubbleComponent : null,
    hoverCard: typeof FluentLMHoverCardComponent !== 'undefined' ? FluentLMHoverCardComponent : null,
    tagPicker: typeof FluentLMTagPickerComponent !== 'undefined' ? FluentLMTagPickerComponent : null,
    overflowSet: typeof FluentLMOverflowSetComponent !== 'undefined' ? FluentLMOverflowSetComponent : null,
    timePicker: typeof FluentLMTimePickerComponent !== 'undefined' ? FluentLMTimePickerComponent : null
  };
})();

/**
 * FluentLM — Icon Registry
 *
 * SVG path data for commonly used Fluent UI icons.
 * Each entry is a 16x16 viewBox SVG path string.
 * Add icons as needed; the runtime looks them up by name via data-icon="Name".
 */
var FluentIcons = (function () {
  'use strict';

  // All paths drawn for 16x16 viewBox
  var icons = {
    // Navigation / UI
    ChevronDown:    'M3.15 5.65a.5.5 0 0 1 .7 0L8 9.79l4.15-4.14a.5.5 0 0 1 .7.7l-4.5 4.5a.5.5 0 0 1-.7 0l-4.5-4.5a.5.5 0 0 1 0-.7z',
    ChevronUp:      'M3.15 10.35a.5.5 0 0 1 0-.7L7.29 5.5a.5.5 0 0 1 .71 0l4.15 4.15a.5.5 0 0 1-.71.7L7.65 6.56l-3.8 3.79a.5.5 0 0 1-.7 0z',
    ChevronRight:   'M5.65 3.15a.5.5 0 0 1 .7 0l4.5 4.5a.5.5 0 0 1 0 .7l-4.5 4.5a.5.5 0 0 1-.7-.7L9.79 8 5.65 3.85a.5.5 0 0 1 0-.7z',
    ChevronLeft:    'M10.35 3.15a.5.5 0 0 1 0 .7L6.21 8l4.14 4.15a.5.5 0 0 1-.7.7l-4.5-4.5a.5.5 0 0 1 0-.7l4.5-4.5a.5.5 0 0 1 .7 0z',
    Cancel:         'M2.59 2.59a.5.5 0 0 1 .7 0L8 7.29l4.71-4.7a.5.5 0 0 1 .7.7L8.71 8l4.7 4.71a.5.5 0 0 1-.7.7L8 8.71l-4.71 4.7a.5.5 0 0 1-.7-.7L7.29 8 2.59 3.29a.5.5 0 0 1 0-.7z',
    More:           'M2 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm4.5 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm4.5 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0z',
    Search:         'M6.5 1a5.5 5.5 0 0 1 4.38 8.82l3.15 3.15a.5.5 0 0 1-.7.7l-3.15-3.14A5.5 5.5 0 1 1 6.5 1zm0 1a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z',
    Filter:         'M1.5 2h13a.5.5 0 0 1 .37.83L10 8.72V13.5a.5.5 0 0 1-.28.45l-3 1.5A.5.5 0 0 1 6 15V8.72L1.13 2.83A.5.5 0 0 1 1.5 2z',

    // Actions
    Add:            'M8 1.5a.5.5 0 0 1 .5.5v5.5H14a.5.5 0 0 1 0 1H8.5V14a.5.5 0 0 1-1 0V8.5H2a.5.5 0 0 1 0-1h5.5V2a.5.5 0 0 1 .5-.5z',
    Delete:         'M7 3h2a1 1 0 0 0-2 0zM6 3a2 2 0 1 1 4 0h4a.5.5 0 0 1 0 1h-.56l-1.22 9.17A2 2 0 0 1 10.24 15H5.76a2 2 0 0 1-1.98-1.83L2.56 4H2a.5.5 0 0 1 0-1h4zm1 3.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0v-5zm3 0a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0v-5z',
    Edit:           'M12.92 2.08a2.5 2.5 0 0 0-3.54 0L3.15 8.31a1.5 1.5 0 0 0-.4.65l-.9 3.15a.5.5 0 0 0 .62.62l3.15-.9a1.5 1.5 0 0 0 .65-.4l6.23-6.23a2.5 2.5 0 0 0 0-3.54l-.58-.58z',
    Save:           'M2 3a1 1 0 0 1 1-1h8.59a1.5 1.5 0 0 1 1.06.44l1.91 1.91a1.5 1.5 0 0 1 .44 1.06V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3zm3 9h6V9H5v3zm7 0v-3.5a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5V12H3V3h1v2.5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5V3h.59l1.91 1.91V12z',
    Copy:           'M4 4.09V10a2 2 0 0 0 2 2h5.91A2 2 0 0 1 10 13H6a3 3 0 0 1-3-3V6a2 2 0 0 1 1-1.91zM6 2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z',
    Undo:           'M3.21 5.5H10a3.5 3.5 0 1 1 0 7H8a.5.5 0 0 1 0-1h2a2.5 2.5 0 0 0 0-5H3.21l2.15 2.15a.5.5 0 0 1-.71.7l-3-3a.5.5 0 0 1 0-.7l3-3a.5.5 0 1 1 .7.7L3.22 5.5z',
    Redo:           'M12.79 5.5H6a3.5 3.5 0 1 0 0 7h2a.5.5 0 0 1 0 1H6a4.5 4.5 0 0 1 0-9h6.79l-2.15-2.15a.5.5 0 0 1 .71-.7l3 3a.5.5 0 0 1 0 .7l-3 3a.5.5 0 0 1-.7-.7L12.78 5.5z',
    Share:          'M12 2.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm0 8a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM5.5 8a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z',

    // Communication
    Mail:           'M2 4.5A1.5 1.5 0 0 1 3.5 3h9A1.5 1.5 0 0 1 14 4.5v7a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5v-7zM3.5 4a.5.5 0 0 0-.5.5v.3l5 3 5-3v-.3a.5.5 0 0 0-.5-.5h-9zM13 5.7 8.17 8.56a.5.5 0 0 1-.34 0L3 5.7v5.8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V5.7z',
    Send:           'M1.72 1.26a.5.5 0 0 1 .53-.05l12.5 6.25a.5.5 0 0 1 0 .9l-12.5 6.24a.5.5 0 0 1-.7-.58L3.27 8.5H7.5a.5.5 0 0 0 0-1H3.27L1.55 1.84a.5.5 0 0 1 .17-.58z',

    // Status
    Info:           'M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1zm0 1a6 6 0 1 0 0 12A6 6 0 0 0 8 2zm0 2.5a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zM8 7a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0v-4A.5.5 0 0 1 8 7z',
    Warning:        'M7.56 1.53a.5.5 0 0 1 .88 0l6.5 12A.5.5 0 0 1 14.5 14h-13a.5.5 0 0 1-.44-.73l6.5-12zM8 5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 1 0v-3A.5.5 0 0 0 8 5zm0 5.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5z',
    ErrorBadge:     'M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1zm0 1a6 6 0 1 0 0 12A6 6 0 0 0 8 2zm2.85 3.15a.5.5 0 0 1 0 .7L8.71 8l2.14 2.15a.5.5 0 0 1-.7.7L8 8.71l-2.15 2.14a.5.5 0 0 1-.7-.7L7.29 8 5.15 5.85a.5.5 0 0 1 .7-.7L8 7.29l2.15-2.14a.5.5 0 0 1 .7 0z',
    Completed:      'M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1zm0 1a6 6 0 1 0 0 12A6 6 0 0 0 8 2zm3.35 3.65a.5.5 0 0 1 0 .7l-4 4a.5.5 0 0 1-.7 0l-2-2a.5.5 0 0 1 .7-.7L7 9.29l3.65-3.64a.5.5 0 0 1 .7 0z',
    Blocked:        'M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1zm0 1a6 6 0 1 0 0 12A6 6 0 0 0 8 2zm3.46 2.54a.5.5 0 0 1 0 .7l-6.22 6.22a.5.5 0 0 1-.7-.7l6.22-6.22a.5.5 0 0 1 .7 0z',
    Checkmark:      'M13.86 3.66a.5.5 0 0 1-.02.7l-7.93 7.48a.5.5 0 0 1-.7-.02L2.16 8.59a.5.5 0 0 1 .72-.7l2.7 2.88 7.58-7.13a.5.5 0 0 1 .7.02z',

    // Objects
    Settings:       'M7.2 1a.8.8 0 0 0-.79.65l-.28 1.5a5.53 5.53 0 0 0-1.18.68l-1.42-.57a.8.8 0 0 0-.97.33l-.8 1.38a.8.8 0 0 0 .18.99l1.14.94a5.6 5.6 0 0 0 0 1.36l-1.14.94a.8.8 0 0 0-.18.98l.8 1.38a.8.8 0 0 0 .97.34l1.42-.57c.36.27.76.5 1.18.68l.28 1.5a.8.8 0 0 0 .79.66h1.6a.8.8 0 0 0 .79-.65l.28-1.5a5.5 5.5 0 0 0 1.18-.69l1.42.57a.8.8 0 0 0 .97-.33l.8-1.38a.8.8 0 0 0-.18-.99l-1.14-.94a5.5 5.5 0 0 0 0-1.36l1.14-.94a.8.8 0 0 0 .18-.98l-.8-1.38a.8.8 0 0 0-.97-.34l-1.42.57a5.5 5.5 0 0 0-1.18-.68l-.28-1.5A.8.8 0 0 0 8.8 1H7.2zM8 5.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z',
    Home:           'M7.65 1.15a.5.5 0 0 1 .7 0l6 6a.5.5 0 0 1-.7.7l-.65-.64V13a1 1 0 0 1-1 1h-2.5a.5.5 0 0 1-.5-.5V10H7v3.5a.5.5 0 0 1-.5.5H4a1 1 0 0 1-1-1V7.21l-.65.64a.5.5 0 0 1-.7-.7l6-6z',
    Calendar:       'M4.5 1a.5.5 0 0 1 .5.5V3h6V1.5a.5.5 0 0 1 1 0V3h1.5A1.5 1.5 0 0 1 15 4.5v8a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-8A1.5 1.5 0 0 1 2.5 3H4V1.5a.5.5 0 0 1 .5-.5zM14 7H2v5.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V7z',
    Person:         'M8 1a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 8c3.5 0 6 1.75 6 3.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-.5C2 10.75 4.5 9 8 9z',
    Document:       'M4 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5.41a1 1 0 0 0-.3-.7L9.3 1.28a1 1 0 0 0-.71-.29H4zm5 0v3.5a.5.5 0 0 0 .5.5H13',
    Attach:         'M7.73 1.82a3.01 3.01 0 0 1 4.24 0 3.01 3.01 0 0 1 0 4.24l-5.3 5.3a1.75 1.75 0 0 1-2.47-2.47l5.3-5.3a.5.5 0 0 1 .7.7l-5.3 5.3a.75.75 0 1 0 1.07 1.07l5.3-5.3a2.01 2.01 0 0 0-2.84-2.84l-5.3 5.3a3.25 3.25 0 1 0 4.6 4.6l5.3-5.3a.5.5 0 0 1 .7.7l-5.3 5.3a4.25 4.25 0 0 1-6-6l5.3-5.3z',
  };

  /**
   * Return an SVG element for the given icon name.
   * Returns null if the name is not registered.
   */
  function getSvg(name) {
    var path = icons[name];
    if (!path) return null;

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.style.width = '1em';
    svg.style.height = '1em';
    svg.style.fill = 'currentColor';

    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', path);
    svg.appendChild(p);
    return svg;
  }

  /**
   * Register a custom icon (or override a built-in one).
   */
  function register(name, pathData) {
    icons[name] = pathData;
  }

  return {
    getSvg: getSvg,
    register: register
  };
})();

/**
 * FluentLM — Theme Manager
 *
 * Handles theme switching via class on <html>.
 * Respects prefers-color-scheme on first load.
 *
 * Built-in themes: light, dark.
 * Register custom themes with FluentTheme.register(name, className).
 */
var FluentTheme = (function () {
  'use strict';

  var TRANSITION = 'fluent-theme-transition';
  var STORAGE_KEY = 'fluentlm-theme';

  // Theme registry: name → CSS class
  var themes = {
    light: 'fluentlm',
    dark: 'fluent-dark'
  };

  // Ordered list of theme names for cycling
  var themeOrder = ['light', 'dark'];

  /**
   * Register a custom theme.
   * @param {string} name  - Theme identifier (used with setTheme/getTheme)
   * @param {string} className - CSS class applied to <html>
   */
  function register(name, className) {
    if (!name || !className) { return; }
    themes[name] = className;
    if (themeOrder.indexOf(name) === -1) {
      themeOrder.push(name);
    }
  }

  function allClasses() {
    var classes = [];
    for (var key in themes) {
      if (themes.hasOwnProperty(key)) { classes.push(themes[key]); }
    }
    return classes;
  }

  function current() {
    var html = document.documentElement;
    for (var i = themeOrder.length - 1; i >= 0; i--) {
      if (html.classList.contains(themes[themeOrder[i]])) {
        return themeOrder[i];
      }
    }
    return 'light';
  }

  function setTheme(theme) {
    var className = themes[theme];
    if (!className) { return; }

    var html = document.documentElement;
    html.classList.add(TRANSITION);

    var classes = allClasses();
    for (var i = 0; i < classes.length; i++) {
      html.classList.remove(classes[i]);
    }
    html.classList.add(className);

    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* noop */ }

    setTimeout(function () {
      html.classList.remove(TRANSITION);
    }, 250);
  }

  function toggle() {
    var idx = themeOrder.indexOf(current());
    var next = themeOrder[(idx + 1) % themeOrder.length];
    setTheme(next);
    return current();
  }

  function init() {
    var html = document.documentElement;

    // 1. Check localStorage
    var stored;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { /* noop */ }

    if (stored && themes[stored]) {
      var classes = allClasses();
      for (var i = 0; i < classes.length; i++) {
        html.classList.remove(classes[i]);
      }
      html.classList.add(themes[stored]);
      return;
    }

    // 2. Check OS preference (only if no theme class is already set)
    var classes = allClasses();
    var hasTheme = false;
    for (var i = 0; i < classes.length; i++) {
      if (html.classList.contains(classes[i])) { hasTheme = true; break; }
    }
    if (!hasTheme) {
      var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.classList.add(prefersDark ? themes.dark : themes.light);
    }
  }

  return {
    init: init,
    current: current,
    setTheme: setTheme,
    toggle: toggle,
    register: register
  };
})();

/**
 * Button component JS — handles split buttons and icon injection.
 * Icon injection is delegated to FluentLMIconComponent.
 * This module handles data-split transformation.
 */
var FluentLMButtonComponent = (function () {
  'use strict';

  function init(root) {
    var els = (root || document).querySelectorAll('.flm-button[data-split]');
    for (var i = 0; i < els.length; i++) {
      renderSplit(els[i]);
    }
  }

  function renderSplit(btn) {
    // Skip if already rendered
    if (btn.getAttribute('data-split-rendered')) return;

    // Wrap button in a split container
    var wrapper = document.createElement('div');
    wrapper.className = 'flm-button-split';
    if (btn.classList.contains('flm-button--primary')) {
      wrapper.classList.add('flm-button-split--primary');
    }

    // Create caret button
    var caret = document.createElement('button');
    caret.className = 'flm-button-split-caret';
    caret.setAttribute('aria-label', 'See more options');
    caret.setAttribute('aria-haspopup', 'true');
    caret.type = 'button';

    var chevron = FluentIcons.getSvg('ChevronDown');
    if (chevron) {
      caret.appendChild(chevron);
    }

    // Insert wrapper and move button into it
    btn.parentNode.insertBefore(wrapper, btn);
    btn.removeAttribute('data-split');
    wrapper.appendChild(btn);
    wrapper.appendChild(caret);

    btn.setAttribute('data-split-rendered', 'true');
  }

  return { init: init };
})();

/**
 * Callout component JS — positions a callout relative to a target element.
 *
 * Usage:
 *   FluentLMCalloutComponent.show(calloutEl, targetEl)
 *   FluentLMCalloutComponent.hide(calloutEl)
 *
 * Or declarative: <button data-callout-toggle="my-callout">Toggle</button>
 */
var FluentLMCalloutComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var triggers = doc.querySelectorAll('[data-callout-toggle]');
    for (var i = 0; i < triggers.length; i++) {
      wireTrigger(triggers[i]);
    }
  }

  function wireTrigger(btn) {
    if (btn.getAttribute('data-callout-wired')) return;
    btn.addEventListener('click', function (e) {
      var id = btn.getAttribute('data-callout-toggle');
      var callout = document.getElementById(id);
      if (!callout) return;

      if (callout.classList.contains('flm-callout--visible')) {
        hide(callout);
      } else {
        show(callout, btn);
      }
      e.stopPropagation();
    });
    btn.setAttribute('data-callout-wired', 'true');
  }

  function show(callout, target) {
    // Position relative to target
    var rect = target.getBoundingClientRect();
    var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;

    callout.style.position = 'absolute';
    callout.style.left = rect.left + scrollX + 'px';
    callout.style.top = (rect.bottom + scrollY + 4) + 'px';

    callout.classList.add('flm-callout--visible');
    callout.classList.add('flm-callout--below');

    // Check if callout goes off-screen bottom, flip above if needed
    setTimeout(function () {
      var calloutRect = callout.getBoundingClientRect();
      if (calloutRect.bottom > window.innerHeight) {
        callout.classList.remove('flm-callout--below');
        callout.classList.add('flm-callout--above');
        callout.style.top = (rect.top + scrollY - calloutRect.height - 4) + 'px';
      }
    }, 0);

    // Click outside to dismiss
    var outsideHandler = function (e) {
      if (!callout.contains(e.target) && !target.contains(e.target)) {
        hide(callout);
        document.removeEventListener('click', outsideHandler);
      }
    };
    setTimeout(function () {
      document.addEventListener('click', outsideHandler);
    }, 0);
    callout._outsideHandler = outsideHandler;
  }

  function hide(callout) {
    callout.classList.remove('flm-callout--visible', 'flm-callout--below', 'flm-callout--above');
    if (callout._outsideHandler) {
      document.removeEventListener('click', callout._outsideHandler);
      delete callout._outsideHandler;
    }
  }

  return { init: init, show: show, hide: hide };
})();

/**
 * Coachmark component JS — pulsing beacon that opens a TeachingBubble on click.
 *
 * Usage:
 *   <div class="flm-coachmark" data-teachingbubble-toggle="tb1">
 *     <div class="flm-coachmark-dot"></div>
 *     <div class="flm-coachmark-ring"></div>
 *   </div>
 *   <div class="flm-teachingbubble" id="tb1">...</div>
 *
 * Uses MutationObserver to auto-hide beacon when the teaching bubble is dismissed.
 */
var FluentLMCoachmarkComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var coachmarks = doc.querySelectorAll('.flm-coachmark');
    for (var i = 0; i < coachmarks.length; i++) {
      wireCoachmark(coachmarks[i]);
    }
  }

  function wireCoachmark(el) {
    if (el.getAttribute('data-coachmark-wired')) return;

    var bubbleId = el.getAttribute('data-teachingbubble-toggle');
    if (!bubbleId) return;

    // Click handler to open teaching bubble
    el.addEventListener('click', function () {
      var bubble = document.getElementById(bubbleId);
      if (!bubble) return;

      if (typeof FluentLMTeachingBubbleComponent !== 'undefined') {
        FluentLMTeachingBubbleComponent.show(bubble, el);
      }
    });

    // Observe the teaching bubble for dismiss to hide beacon
    var bubble = document.getElementById(bubbleId);
    if (bubble && typeof MutationObserver !== 'undefined') {
      var observer = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
          if (mutations[i].attributeName === 'class') {
            if (!bubble.classList.contains('flm-teachingbubble--visible')) {
              el.classList.add('flm-coachmark--hidden');
              observer.disconnect();
            }
          }
        }
      });

      observer.observe(bubble, { attributes: true, attributeFilter: ['class'] });
    }

    el.setAttribute('data-coachmark-wired', 'true');
  }

  return { init: init };
})();

/**
 * ComboBox component JS — filterable dropdown with keyboard navigation.
 *
 * Usage:
 *   <div class="flm-combobox">
 *     <div class="flm-combobox-wrapper">
 *       <input class="flm-combobox-input" placeholder="Select...">
 *       <button class="flm-combobox-caret" data-icon="ChevronDown" aria-label="Toggle"></button>
 *     </div>
 *     <div class="flm-combobox-listbox">
 *       <div class="flm-combobox-option" data-value="a">Alpha</div>
 *       <div class="flm-combobox-option" data-value="b">Beta</div>
 *     </div>
 *   </div>
 *
 * Add data-multiselect on .flm-combobox for multi-select mode.
 */
var FluentLMComboBoxComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var combos = doc.querySelectorAll('.flm-combobox');
    for (var i = 0; i < combos.length; i++) {
      wireCombo(combos[i]);
    }
  }

  function wireCombo(el) {
    if (el.getAttribute('data-combobox-wired')) return;

    var input = el.querySelector('.flm-combobox-input');
    var caret = el.querySelector('.flm-combobox-caret');
    var listbox = el.querySelector('.flm-combobox-listbox');

    if (!input || !listbox) return;

    var multiselect = el.hasAttribute('data-multiselect');
    var highlighted = -1;

    function getOptions() {
      return listbox.querySelectorAll('.flm-combobox-option:not(.flm-combobox-option--disabled):not(.flm-combobox-option--hidden)');
    }

    function isOpen() {
      return listbox.classList.contains('flm-combobox-listbox--open');
    }

    function open() {
      document.dispatchEvent(new CustomEvent('flm-dismiss-pickers', { detail: { source: el } }));
      listbox.classList.add('flm-combobox-listbox--open');
      highlighted = -1;
      flipIfNeeded();
    }

    function close() {
      listbox.classList.remove('flm-combobox-listbox--open', 'flm-combobox-listbox--above');
      highlighted = -1;
      clearHighlight();
    }

    function flipIfNeeded() {
      setTimeout(function () {
        var rect = listbox.getBoundingClientRect();
        if (rect.bottom > window.innerHeight) {
          listbox.classList.add('flm-combobox-listbox--above');
        } else {
          listbox.classList.remove('flm-combobox-listbox--above');
        }
      }, 0);
    }

    function clearHighlight() {
      var opts = listbox.querySelectorAll('.flm-combobox-option--highlighted');
      for (var i = 0; i < opts.length; i++) {
        opts[i].classList.remove('flm-combobox-option--highlighted');
      }
    }

    function setHighlight(idx) {
      clearHighlight();
      var opts = getOptions();
      if (idx >= 0 && idx < opts.length) {
        highlighted = idx;
        opts[idx].classList.add('flm-combobox-option--highlighted');
        opts[idx].scrollIntoView({ block: 'nearest' });
      }
    }

    function filterOptions() {
      var text = input.value.toLowerCase();
      var allOpts = listbox.querySelectorAll('.flm-combobox-option');
      for (var i = 0; i < allOpts.length; i++) {
        var optText = allOpts[i].textContent.toLowerCase();
        if (text === '' || optText.indexOf(text) !== -1) {
          allOpts[i].classList.remove('flm-combobox-option--hidden');
        } else {
          allOpts[i].classList.add('flm-combobox-option--hidden');
        }
      }
      highlighted = -1;
    }

    function selectOption(opt) {
      var value = opt.getAttribute('data-value') || opt.textContent;
      var text = opt.textContent;

      if (multiselect) {
        opt.classList.toggle('flm-combobox-option--selected');
        // Build comma-separated value
        var selected = listbox.querySelectorAll('.flm-combobox-option--selected');
        var values = [];
        for (var i = 0; i < selected.length; i++) {
          values.push(selected[i].textContent);
        }
        input.value = values.join(', ');
      } else {
        // Clear previous selection
        var prev = listbox.querySelectorAll('.flm-combobox-option--selected');
        for (var j = 0; j < prev.length; j++) {
          prev[j].classList.remove('flm-combobox-option--selected');
        }
        opt.classList.add('flm-combobox-option--selected');
        input.value = text;
        el.setAttribute('data-value', value);
        close();
      }

      // Fire change event
      var evt = document.createEvent('Event');
      evt.initEvent('change', true, true);
      input.dispatchEvent(evt);
    }

    // Input events
    input.addEventListener('focus', function () {
      if (!isOpen()) open();
    });

    input.addEventListener('input', function () {
      if (!isOpen()) open();
      filterOptions();
    });

    // Caret toggle
    if (caret) {
      caret.addEventListener('click', function (e) {
        e.stopPropagation();
        if (isOpen()) {
          close();
        } else {
          filterOptions();
          open();
          input.focus();
        }
      });
    }

    // Keyboard navigation
    input.addEventListener('keydown', function (e) {
      var opts = getOptions();
      var len = opts.length;

      if (e.key === 'ArrowDown' || e.keyCode === 40) {
        e.preventDefault();
        if (!isOpen()) { open(); filterOptions(); }
        setHighlight(highlighted < len - 1 ? highlighted + 1 : 0);
      } else if (e.key === 'ArrowUp' || e.keyCode === 38) {
        e.preventDefault();
        if (!isOpen()) { open(); filterOptions(); }
        setHighlight(highlighted > 0 ? highlighted - 1 : len - 1);
      } else if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        if (highlighted >= 0 && highlighted < len) {
          selectOption(opts[highlighted]);
        }
      } else if (e.key === 'Escape' || e.keyCode === 27) {
        close();
      }
    });

    // Option click
    listbox.addEventListener('click', function (e) {
      var opt = e.target.closest('.flm-combobox-option');
      if (opt && !opt.classList.contains('flm-combobox-option--disabled')) {
        selectOption(opt);
      }
    });

    // Click outside
    document.addEventListener('click', function (e) {
      if (!el.contains(e.target) && isOpen()) {
        close();
      }
    });

    // Close when another picker opens
    document.addEventListener('flm-dismiss-pickers', function (e) {
      if (e.detail.source !== el && isOpen()) close();
    });

    el.setAttribute('data-combobox-wired', 'true');
  }

  return { init: init };
})();

/**
 * CommandBar component JS — injects icons for command bar items with data-icon.
 */
var FluentLMCommandBarComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    // Inject icons into commandbar items that have data-icon
    var items = doc.querySelectorAll('.flm-commandbar-item[data-icon]');
    for (var i = 0; i < items.length; i++) {
      FluentLMIconComponent.render(items[i]);
    }

    // Inject overflow icon
    var overflows = doc.querySelectorAll('.flm-commandbar-overflow');
    for (var j = 0; j < overflows.length; j++) {
      if (!overflows[j].getAttribute('data-icon-rendered')) {
        var svg = FluentIcons.getSvg('More');
        if (svg) {
          overflows[j].innerHTML = '';
          overflows[j].appendChild(svg);
          overflows[j].setAttribute('data-icon-rendered', 'true');
        }
      }
    }
  }

  return { init: init };
})();

/**
 * ContextualMenu component JS — show/hide, positioning, click-outside dismiss.
 *
 * Usage:
 *   FluentLMContextMenuComponent.show(menuEl, targetEl)
 *   FluentLMContextMenuComponent.hide(menuEl)
 *
 * Or: <button data-contextmenu-toggle="my-menu">Menu</button>
 * Or: Right-click trigger: <div data-contextmenu="my-menu">Right-click me</div>
 */
var FluentLMContextMenuComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    // Button triggers
    var triggers = doc.querySelectorAll('[data-contextmenu-toggle]');
    for (var i = 0; i < triggers.length; i++) {
      wireTrigger(triggers[i]);
    }

    // Right-click triggers
    var contextTriggers = doc.querySelectorAll('[data-contextmenu]');
    for (var j = 0; j < contextTriggers.length; j++) {
      wireContextTrigger(contextTriggers[j]);
    }

    // Wire menu item clicks for dismiss
    var menus = doc.querySelectorAll('.flm-contextmenu');
    for (var k = 0; k < menus.length; k++) {
      wireMenuItems(menus[k]);
    }
  }

  function wireTrigger(btn) {
    if (btn.getAttribute('data-cm-wired')) return;
    btn.addEventListener('click', function (e) {
      var id = btn.getAttribute('data-contextmenu-toggle');
      var menu = document.getElementById(id);
      if (!menu) return;
      if (menu.classList.contains('flm-contextmenu--visible')) {
        hide(menu);
      } else {
        show(menu, btn);
      }
      e.stopPropagation();
    });
    btn.setAttribute('data-cm-wired', 'true');
  }

  function wireContextTrigger(el) {
    if (el.getAttribute('data-cm-wired')) return;
    el.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      var id = el.getAttribute('data-contextmenu');
      var menu = document.getElementById(id);
      if (!menu) return;
      showAt(menu, e.pageX, e.pageY);
    });
    el.setAttribute('data-cm-wired', 'true');
  }

  function wireMenuItems(menu) {
    var items = menu.querySelectorAll('.flm-contextmenu-item');
    for (var i = 0; i < items.length; i++) {
      items[i].addEventListener('click', function () {
        hide(menu);
      });
    }
  }

  function show(menu, target) {
    var rect = target.getBoundingClientRect();
    var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    showAt(menu, rect.left + scrollX, rect.bottom + scrollY + 2);
  }

  function showAt(menu, x, y) {
    menu.style.position = 'absolute';
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.classList.add('flm-contextmenu--visible');

    // Reposition if off-screen
    setTimeout(function () {
      var menuRect = menu.getBoundingClientRect();
      if (menuRect.right > window.innerWidth) {
        menu.style.left = (x - menuRect.width) + 'px';
      }
      if (menuRect.bottom > window.innerHeight) {
        menu.style.top = (y - menuRect.height) + 'px';
      }
    }, 0);

    var outsideHandler = function (e) {
      if (!menu.contains(e.target)) {
        hide(menu);
        document.removeEventListener('click', outsideHandler);
      }
    };
    setTimeout(function () {
      document.addEventListener('click', outsideHandler);
    }, 0);
    menu._outsideHandler = outsideHandler;
  }

  function hide(menu) {
    menu.classList.remove('flm-contextmenu--visible');
    if (menu._outsideHandler) {
      document.removeEventListener('click', menu._outsideHandler);
      delete menu._outsideHandler;
    }
  }

  return { init: init, show: show, showAt: showAt, hide: hide };
})();

/**
 * DatePicker component JS — generates calendar grid and handles date selection.
 *
 * Usage:
 *   <div class="flm-datepicker">
 *     <label class="flm-label" for="dp1">Date</label>
 *     <div class="flm-datepicker-wrapper">
 *       <input class="flm-datepicker-input" id="dp1" placeholder="MM/DD/YYYY">
 *       <button class="flm-datepicker-icon" data-icon="Calendar" aria-label="Open calendar"></button>
 *     </div>
 *   </div>
 *
 * Attributes on .flm-datepicker:
 *   data-min-date="MM/DD/YYYY"
 *   data-max-date="MM/DD/YYYY"
 */
var FluentLMDatePickerComponent = (function () {
  'use strict';

  var DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  var MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  function init(root) {
    var doc = root || document;

    var pickers = doc.querySelectorAll('.flm-datepicker');
    for (var i = 0; i < pickers.length; i++) {
      wirePicker(pickers[i]);
    }
  }

  function wirePicker(el) {
    if (el.getAttribute('data-datepicker-wired')) return;

    var input = el.querySelector('.flm-datepicker-input');
    var iconBtn = el.querySelector('.flm-datepicker-icon');
    if (!input) return;

    var callout = null;
    var viewYear, viewMonth, selectedDate;

    // Parse min/max dates
    var minDate = parseDate(el.getAttribute('data-min-date'));
    var maxDate = parseDate(el.getAttribute('data-max-date'));

    function parseDate(str) {
      if (!str) return null;
      var parts = str.split('/');
      if (parts.length !== 3) return null;
      return new Date(parseInt(parts[2], 10), parseInt(parts[0], 10) - 1, parseInt(parts[1], 10));
    }

    function formatDate(d) {
      var mm = (d.getMonth() + 1);
      var dd = d.getDate();
      var yyyy = d.getFullYear();
      return (mm < 10 ? '0' : '') + mm + '/' + (dd < 10 ? '0' : '') + dd + '/' + yyyy;
    }

    function ensureCallout() {
      if (callout) return callout;

      callout = document.createElement('div');
      callout.className = 'flm-datepicker-callout';
      el.appendChild(callout);
      return callout;
    }

    function isOpen() {
      return callout && callout.classList.contains('flm-datepicker-callout--open');
    }

    function open() {
      document.dispatchEvent(new CustomEvent('flm-dismiss-pickers', { detail: { source: el } }));
      ensureCallout();
      var today = new Date();
      viewYear = selectedDate ? selectedDate.getFullYear() : today.getFullYear();
      viewMonth = selectedDate ? selectedDate.getMonth() : today.getMonth();
      renderCalendar();
      callout.classList.add('flm-datepicker-callout--open');
      flipIfNeeded();
    }

    function close() {
      if (callout) {
        callout.classList.remove('flm-datepicker-callout--open', 'flm-datepicker-callout--above');
      }
    }

    function flipIfNeeded() {
      setTimeout(function () {
        if (!callout) return;
        var rect = callout.getBoundingClientRect();
        if (rect.bottom > window.innerHeight) {
          callout.classList.add('flm-datepicker-callout--above');
        } else {
          callout.classList.remove('flm-datepicker-callout--above');
        }
      }, 0);
    }

    function renderCalendar() {
      var html = '';

      // Navigation
      html += '<div class="flm-datepicker-nav">';
      html += '<button class="flm-datepicker-nav-btn flm-datepicker-prev" data-icon="ChevronLeft" aria-label="Previous month"></button>';
      html += '<span class="flm-datepicker-month">' + MONTHS[viewMonth] + ' ' + viewYear + '</span>';
      html += '<button class="flm-datepicker-nav-btn flm-datepicker-next" data-icon="ChevronRight" aria-label="Next month"></button>';
      html += '</div>';

      // Weekday headers
      html += '<div class="flm-datepicker-weekdays">';
      for (var d = 0; d < 7; d++) {
        html += '<span class="flm-datepicker-weekday">' + DAYS[d] + '</span>';
      }
      html += '</div>';

      // Calendar grid (42 cells)
      html += '<div class="flm-datepicker-grid">';

      var firstDay = new Date(viewYear, viewMonth, 1).getDay();
      var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
      var daysInPrev = new Date(viewYear, viewMonth, 0).getDate();
      var today = new Date();
      today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      var cellDate;
      for (var i = 0; i < 42; i++) {
        var dayNum;
        var isOutside = false;
        var cellYear = viewYear;
        var cellMonth = viewMonth;

        if (i < firstDay) {
          // Previous month
          dayNum = daysInPrev - firstDay + i + 1;
          isOutside = true;
          cellMonth = viewMonth - 1;
          if (cellMonth < 0) { cellMonth = 11; cellYear--; }
        } else if (i - firstDay >= daysInMonth) {
          // Next month
          dayNum = i - firstDay - daysInMonth + 1;
          isOutside = true;
          cellMonth = viewMonth + 1;
          if (cellMonth > 11) { cellMonth = 0; cellYear++; }
        } else {
          dayNum = i - firstDay + 1;
        }

        cellDate = new Date(cellYear, cellMonth, dayNum);

        var classes = 'flm-datepicker-day';
        if (isOutside) classes += ' flm-datepicker-day--outside';
        if (cellDate.getTime() === today.getTime()) classes += ' flm-datepicker-day--today';
        if (selectedDate && cellDate.getTime() === selectedDate.getTime()) classes += ' flm-datepicker-day--selected';

        var disabled = false;
        if (minDate && cellDate < minDate) disabled = true;
        if (maxDate && cellDate > maxDate) disabled = true;
        if (disabled) classes += ' flm-datepicker-day--disabled';

        html += '<button class="' + classes + '" data-date="' + cellYear + '-' + cellMonth + '-' + dayNum + '"' +
                (disabled ? ' disabled' : '') + '>' + dayNum + '</button>';
      }

      html += '</div>';
      callout.innerHTML = html;

      // Wire navigation buttons
      var prevBtn = callout.querySelector('.flm-datepicker-prev');
      var nextBtn = callout.querySelector('.flm-datepicker-next');

      if (prevBtn) {
        // Disable prev button if at min date boundary
        if (minDate && viewYear === minDate.getFullYear() && viewMonth === minDate.getMonth()) {
          prevBtn.disabled = true;
        }
        prevBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          var newMonth = viewMonth - 1;
          var newYear = viewYear;
          if (newMonth < 0) { newMonth = 11; newYear--; }
          // Don't navigate before the month containing minDate
          if (minDate) {
            var minMonth = minDate.getFullYear() * 12 + minDate.getMonth();
            var targetMonth = newYear * 12 + newMonth;
            if (targetMonth < minMonth) return;
          }
          viewMonth = newMonth;
          viewYear = newYear;
          renderCalendar();
          if (typeof FluentLMIconComponent !== 'undefined') {
            FluentLMIconComponent.init(callout);
          }
        });
      }
      if (nextBtn) {
        // Disable next button if at max date boundary
        if (maxDate && viewYear === maxDate.getFullYear() && viewMonth === maxDate.getMonth()) {
          nextBtn.disabled = true;
        }
        nextBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          var newMonth = viewMonth + 1;
          var newYear = viewYear;
          if (newMonth > 11) { newMonth = 0; newYear++; }
          // Don't navigate past the month containing maxDate
          if (maxDate) {
            var maxMonth = maxDate.getFullYear() * 12 + maxDate.getMonth();
            var targetMonth = newYear * 12 + newMonth;
            if (targetMonth > maxMonth) return;
          }
          viewMonth = newMonth;
          viewYear = newYear;
          renderCalendar();
          if (typeof FluentLMIconComponent !== 'undefined') {
            FluentLMIconComponent.init(callout);
          }
        });
      }

      // Wire day clicks
      var days = callout.querySelectorAll('.flm-datepicker-day');
      for (var j = 0; j < days.length; j++) {
        days[j].addEventListener('click', function (e) {
          e.stopPropagation();
          var parts = this.getAttribute('data-date').split('-');
          selectedDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10), parseInt(parts[2], 10));
          input.value = formatDate(selectedDate);
          close();

          // Fire change event
          var evt = document.createEvent('Event');
          evt.initEvent('change', true, true);
          input.dispatchEvent(evt);
        });
      }

      // Init icons for nav buttons
      if (typeof FluentLMIconComponent !== 'undefined') {
        FluentLMIconComponent.init(callout);
      }
    }

    // Toggle on icon button click
    if (iconBtn) {
      iconBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (isOpen()) {
          close();
        } else {
          open();
        }
      });
    }

    // Open on input focus
    input.addEventListener('focus', function () {
      if (!isOpen()) open();
    });

    // Click outside to dismiss
    document.addEventListener('click', function (e) {
      if (!el.contains(e.target) && isOpen()) {
        close();
      }
    });

    // Keyboard: Escape closes
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        close();
      }
    });

    // Close when another picker opens
    document.addEventListener('flm-dismiss-pickers', function (e) {
      if (e.detail.source !== el && isOpen()) close();
    });

    el.setAttribute('data-datepicker-wired', 'true');
  }

  return { init: init };
})();

/**
 * Dialog component JS — open/close, Escape key, overlay click dismiss.
 *
 * Usage:
 *   FluentLMDialogComponent.open('my-dialog')
 *   FluentLMDialogComponent.close('my-dialog')
 *
 * Or wire a trigger button:
 *   <button data-dialog-open="my-dialog">Open</button>
 */
var FluentLMDialogComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    // Wire trigger buttons
    var triggers = doc.querySelectorAll('[data-dialog-open]');
    for (var i = 0; i < triggers.length; i++) {
      wireOpen(triggers[i]);
    }

    // Wire close buttons inside dialogs
    var closeBtns = doc.querySelectorAll('.flm-dialog-close, [data-dialog-close]');
    for (var j = 0; j < closeBtns.length; j++) {
      wireClose(closeBtns[j]);
    }

    // Wire overlay click-to-dismiss (light dismiss)
    var overlays = doc.querySelectorAll('.flm-dialog-overlay[data-light-dismiss]');
    for (var k = 0; k < overlays.length; k++) {
      wireOverlayDismiss(overlays[k]);
    }
  }

  function wireOpen(btn) {
    if (btn.getAttribute('data-dialog-wired')) return;
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-dialog-open');
      open(id);
    });
    btn.setAttribute('data-dialog-wired', 'true');
  }

  function wireClose(btn) {
    if (btn.getAttribute('data-dialog-wired')) return;
    btn.addEventListener('click', function () {
      var overlay = btn.closest('.flm-dialog-overlay');
      if (overlay) {
        closeOverlay(overlay);
      }
    });
    btn.setAttribute('data-dialog-wired', 'true');
  }

  function wireOverlayDismiss(overlay) {
    if (overlay.getAttribute('data-dismiss-wired')) return;
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        closeOverlay(overlay);
      }
    });
    overlay.setAttribute('data-dismiss-wired', 'true');
  }

  function open(id) {
    var overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.add('flm-dialog-overlay--open');
    document.body.style.overflow = 'hidden';

    // Escape key listener
    var escHandler = function (e) {
      if (e.key === 'Escape') {
        closeOverlay(overlay);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
    overlay._escHandler = escHandler;

    // Focus first focusable element
    setTimeout(function () {
      var focusable = overlay.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable) focusable.focus();
    }, 50);
  }

  function close(id) {
    var overlay = document.getElementById(id);
    if (overlay) closeOverlay(overlay);
  }

  function closeOverlay(overlay) {
    overlay.classList.remove('flm-dialog-overlay--open');
    document.body.style.overflow = '';
    if (overlay._escHandler) {
      document.removeEventListener('keydown', overlay._escHandler);
      delete overlay._escHandler;
    }
  }

  return { init: init, open: open, close: close };
})();

/**
 * DocumentCard component JS — stub for icon injection via FluentLMIconComponent.
 */
var FluentLMDocumentCardComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var cards = doc.querySelectorAll('.flm-documentcard');
    for (var i = 0; i < cards.length; i++) {
      wireCard(cards[i]);
    }
  }

  function wireCard(card) {
    if (card.getAttribute('data-documentcard-wired')) return;

    // Icons are handled by FluentLMIconComponent.
    // Wire up any action buttons for focus management.
    var actions = card.querySelectorAll('.flm-documentcard-actions .flm-button');
    for (var i = 0; i < actions.length; i++) {
      actions[i].addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }

    card.setAttribute('data-documentcard-wired', 'true');
  }

  return { init: init };
})();

/**
 * Dropdown component JS — custom dropdown with keyboard navigation.
 *
 * Usage:
 *   <div class="flm-dropdown">
 *     <label class="flm-label" for="dd1">Country</label>
 *     <button class="flm-dropdown-trigger" id="dd1">
 *       <span class="flm-dropdown-title flm-dropdown-title--placeholder">Select…</span>
 *       <span class="flm-dropdown-caret" data-icon="ChevronDown"></span>
 *     </button>
 *     <div class="flm-dropdown-listbox">
 *       <div class="flm-dropdown-option" data-value="us">United States</div>
 *       <div class="flm-dropdown-option" data-value="gb">United Kingdom</div>
 *     </div>
 *   </div>
 *
 * Sets data-value on the root .flm-dropdown when an option is selected.
 * A hidden <input class="flm-dropdown-value"> is updated if present.
 */
var FluentLMDropdownComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var dropdowns = doc.querySelectorAll('.flm-dropdown');
    for (var i = 0; i < dropdowns.length; i++) {
      wireDropdown(dropdowns[i]);
    }
  }

  function wireDropdown(el) {
    if (el.getAttribute('data-dropdown-wired')) return;
    if (el.classList.contains('flm-dropdown--disabled')) return;

    var trigger = el.querySelector('.flm-dropdown-trigger');
    var listbox = el.querySelector('.flm-dropdown-listbox');

    if (!trigger || !listbox) return;

    var titleEl = trigger.querySelector('.flm-dropdown-title');
    var hiddenInput = el.querySelector('.flm-dropdown-value');
    var placeholder = titleEl ? titleEl.textContent : '';
    var highlighted = -1;

    function getOptions() {
      return listbox.querySelectorAll('.flm-dropdown-option:not(.flm-dropdown-option--disabled)');
    }

    function isOpen() {
      return listbox.classList.contains('flm-dropdown-listbox--open');
    }

    function open() {
      document.dispatchEvent(new CustomEvent('flm-dismiss-pickers', { detail: { source: el } }));
      listbox.classList.add('flm-dropdown-listbox--open');
      highlighted = -1;

      // Highlight current selection
      var opts = getOptions();
      for (var i = 0; i < opts.length; i++) {
        if (opts[i].classList.contains('flm-dropdown-option--selected')) {
          highlighted = i;
          opts[i].classList.add('flm-dropdown-option--highlighted');
          opts[i].scrollIntoView({ block: 'nearest' });
          break;
        }
      }

      flipIfNeeded();
    }

    function close() {
      listbox.classList.remove('flm-dropdown-listbox--open', 'flm-dropdown-listbox--above');
      highlighted = -1;
      clearHighlight();
    }

    function flipIfNeeded() {
      setTimeout(function () {
        var rect = listbox.getBoundingClientRect();
        if (rect.bottom > window.innerHeight) {
          listbox.classList.add('flm-dropdown-listbox--above');
        } else {
          listbox.classList.remove('flm-dropdown-listbox--above');
        }
      }, 0);
    }

    function clearHighlight() {
      var opts = listbox.querySelectorAll('.flm-dropdown-option--highlighted');
      for (var i = 0; i < opts.length; i++) {
        opts[i].classList.remove('flm-dropdown-option--highlighted');
      }
    }

    function setHighlight(idx) {
      clearHighlight();
      var opts = getOptions();
      if (idx >= 0 && idx < opts.length) {
        highlighted = idx;
        opts[idx].classList.add('flm-dropdown-option--highlighted');
        opts[idx].scrollIntoView({ block: 'nearest' });
      }
    }

    function selectOption(opt) {
      // Clear previous
      var prev = listbox.querySelectorAll('.flm-dropdown-option--selected');
      for (var i = 0; i < prev.length; i++) {
        prev[i].classList.remove('flm-dropdown-option--selected');
      }

      opt.classList.add('flm-dropdown-option--selected');

      var value = opt.getAttribute('data-value') || opt.textContent.trim();
      var text = opt.textContent.trim();

      if (titleEl) {
        titleEl.textContent = text;
        titleEl.classList.remove('flm-dropdown-title--placeholder');
      }

      el.setAttribute('data-value', value);

      if (hiddenInput) {
        hiddenInput.value = value;
      }

      close();

      // Fire change event
      var evt = document.createEvent('Event');
      evt.initEvent('change', true, true);
      el.dispatchEvent(evt);
    }

    // Toggle on click
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (isOpen()) {
        close();
      } else {
        open();
      }
    });

    // Keyboard navigation
    trigger.addEventListener('keydown', function (e) {
      var opts = getOptions();
      var len = opts.length;

      if (e.key === 'ArrowDown' || e.keyCode === 40) {
        e.preventDefault();
        if (!isOpen()) open();
        setHighlight(highlighted < len - 1 ? highlighted + 1 : 0);
      } else if (e.key === 'ArrowUp' || e.keyCode === 38) {
        e.preventDefault();
        if (!isOpen()) open();
        setHighlight(highlighted > 0 ? highlighted - 1 : len - 1);
      } else if (e.key === 'Enter' || e.keyCode === 13 || e.key === ' ' || e.keyCode === 32) {
        e.preventDefault();
        if (!isOpen()) {
          open();
        } else if (highlighted >= 0 && highlighted < len) {
          selectOption(opts[highlighted]);
        }
      } else if (e.key === 'Escape' || e.keyCode === 27) {
        close();
      }
    });

    // Option click
    listbox.addEventListener('click', function (e) {
      var opt = e.target.closest('.flm-dropdown-option');
      if (opt && !opt.classList.contains('flm-dropdown-option--disabled')) {
        selectOption(opt);
      }
    });

    // Click outside
    document.addEventListener('click', function (e) {
      if (!el.contains(e.target) && isOpen()) {
        close();
      }
    });

    // Close when another picker opens
    document.addEventListener('flm-dismiss-pickers', function (e) {
      if (e.detail.source !== el && isOpen()) close();
    });

    el.setAttribute('data-dropdown-wired', 'true');
  }

  return { init: init };
})();

/**
 * Facepile component JS — hides excess coins and injects +N overflow chip.
 */
var FluentLMFacepileComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var facepiles = doc.querySelectorAll('.flm-facepile');
    for (var i = 0; i < facepiles.length; i++) {
      wireFacepile(facepiles[i]);
    }
  }

  function wireFacepile(el) {
    if (el.getAttribute('data-facepile-wired')) return;

    var max = parseInt(el.getAttribute('data-max'), 10);
    if (!max || isNaN(max)) {
      el.setAttribute('data-facepile-wired', 'true');
      return;
    }

    var members = el.querySelectorAll('.flm-facepile-member');
    if (members.length <= max) {
      el.setAttribute('data-facepile-wired', 'true');
      return;
    }

    var overflow = members.length - max;

    // Hide excess members
    for (var i = max; i < members.length; i++) {
      members[i].style.display = 'none';
    }

    // Remove existing overflow chip if any
    var existing = el.querySelector('.flm-facepile-overflow');
    if (existing) {
      existing.parentNode.removeChild(existing);
    }

    // Inject overflow chip
    var chip = document.createElement('span');
    chip.className = 'flm-facepile-overflow';
    chip.textContent = '+' + overflow;

    // Insert after last visible member
    var lastVisible = members[max - 1];
    if (lastVisible.nextSibling) {
      el.insertBefore(chip, lastVisible.nextSibling);
    } else {
      el.appendChild(chip);
    }

    el.setAttribute('data-facepile-wired', 'true');
  }

  return { init: init };
})();

/**
 * GroupedList component JS — collapsible groups with chevron rotation.
 */
var FluentLMGroupedListComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var headers = doc.querySelectorAll('.flm-groupedlist-header');
    for (var i = 0; i < headers.length; i++) {
      wireHeader(headers[i]);
    }
  }

  function wireHeader(header) {
    if (header.getAttribute('data-groupedlist-wired')) return;

    header.addEventListener('click', function () {
      var items = header.nextElementSibling;
      if (!items || !items.classList.contains('flm-groupedlist-items')) return;

      var chevron = header.querySelector('.flm-groupedlist-chevron');
      var collapsed = items.classList.contains('flm-groupedlist-items--collapsed');

      if (collapsed) {
        items.classList.remove('flm-groupedlist-items--collapsed');
        if (chevron) chevron.classList.add('flm-groupedlist-chevron--expanded');
      } else {
        items.classList.add('flm-groupedlist-items--collapsed');
        if (chevron) chevron.classList.remove('flm-groupedlist-chevron--expanded');
      }
    });

    header.setAttribute('data-groupedlist-wired', 'true');
  }

  return { init: init };
})();

/**
 * HoverCard component JS — two-phase hover: compact after 500ms, expanded after 1500ms.
 *
 * Usage:
 *   <span class="flm-hovercard-host" data-hovercard-id="hc1">Hover over me</span>
 *   <div class="flm-hovercard" id="hc1">
 *     <div class="flm-hovercard-compact">Compact content</div>
 *     <div class="flm-hovercard-expanded">Expanded content</div>
 *   </div>
 */
var FluentLMHoverCardComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var hosts = doc.querySelectorAll('[data-hovercard-id]');
    for (var i = 0; i < hosts.length; i++) {
      wireHost(hosts[i]);
    }
  }

  function wireHost(host) {
    if (host.getAttribute('data-hovercard-wired')) return;

    var showTimer = null;
    var expandTimer = null;
    var card = null;

    function getCard() {
      if (!card) {
        var id = host.getAttribute('data-hovercard-id');
        card = document.getElementById(id);
      }
      return card;
    }

    host.addEventListener('mouseenter', function () {
      showTimer = setTimeout(function () {
        showCompact(getCard(), host);

        expandTimer = setTimeout(function () {
          showExpanded(getCard());
        }, 1000); // 1000ms after compact = 1500ms total
      }, 500);
    });

    host.addEventListener('mouseleave', function () {
      clearTimeout(showTimer);
      clearTimeout(expandTimer);

      // Delay hide to allow mouse to move to card
      var c = getCard();
      if (c) {
        setTimeout(function () {
          if (!c._hovered) {
            hide(c);
          }
        }, 100);
      }
    });

    // Keep card open while mouse is over it
    var hoverCardEl = getCard();
    if (hoverCardEl) {
      hoverCardEl.addEventListener('mouseenter', function () {
        hoverCardEl._hovered = true;
      });

      hoverCardEl.addEventListener('mouseleave', function () {
        hoverCardEl._hovered = false;
        clearTimeout(expandTimer);
        hide(hoverCardEl);
      });
    }

    host.setAttribute('data-hovercard-wired', 'true');
  }

  function showCompact(card, host) {
    if (!card) return;

    var rect = host.getBoundingClientRect();
    var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;

    card.style.position = 'absolute';
    card.style.left = rect.left + scrollX + 'px';
    card.style.top = (rect.bottom + scrollY + 4) + 'px';

    card.classList.add('flm-hovercard--visible');

    // Flip if off-screen
    setTimeout(function () {
      var cRect = card.getBoundingClientRect();
      if (cRect.bottom > window.innerHeight) {
        card.style.top = (rect.top + scrollY - cRect.height - 4) + 'px';
      }
      if (cRect.right > window.innerWidth) {
        card.style.left = (rect.right + scrollX - cRect.width) + 'px';
      }
    }, 0);
  }

  function showExpanded(card) {
    if (!card) return;
    var expanded = card.querySelector('.flm-hovercard-expanded');
    if (expanded) {
      expanded.classList.add('flm-hovercard-expanded--visible');
    }
  }

  function hide(card) {
    if (!card) return;
    card.classList.remove('flm-hovercard--visible');
    var expanded = card.querySelector('.flm-hovercard-expanded');
    if (expanded) {
      expanded.classList.remove('flm-hovercard-expanded--visible');
    }
  }

  return { init: init };
})();

/**
 * Icon component — resolves data-icon attributes to inline SVG.
 */
var FluentLMIconComponent = (function () {
  'use strict';

  function init(root) {
    var els = (root || document).querySelectorAll('[data-icon]');
    for (var i = 0; i < els.length; i++) {
      render(els[i]);
    }
  }

  function render(el) {
    // Skip if already rendered
    if (el.getAttribute('data-icon-rendered')) return;

    var name = el.getAttribute('data-icon');
    if (!name) return;

    var svg = FluentIcons.getSvg(name);
    if (!svg) return;

    // For .flm-icon elements or inline icon elements (i, span with data-icon only), replace contents
    if (el.classList.contains('flm-icon') || ((el.tagName === 'I' || el.tagName === 'SPAN') && el.childNodes.length === 0)) {
      el.innerHTML = '';
      el.appendChild(svg);
    }
    // For buttons / other elements, prepend icon
    else if (el.classList.contains('flm-button') || el.tagName === 'BUTTON' || el.tagName === 'A') {
      el.insertBefore(svg, el.firstChild);
      // Add a small space text node if there's text content after the icon
      if (el.childNodes.length > 1 && !el.classList.contains('flm-button--icon')) {
        svg.style.marginRight = '4px';
      }
    }

    el.setAttribute('data-icon-rendered', 'true');
  }

  return { init: init, render: render };
})();

/**
 * MessageBar component JS — auto-injects status icon and wires dismiss button.
 */
var FluentLMMessageBarComponent = (function () {
  'use strict';

  // Map messagebar type to icon name
  var typeIconMap = {
    'info':          'Info',
    'success':       'Completed',
    'warning':       'Warning',
    'severeWarning': 'Warning',
    'error':         'ErrorBadge',
    'blocked':       'Blocked'
  };

  function getType(el) {
    var classes = el.className;
    var types = Object.keys(typeIconMap);
    for (var i = 0; i < types.length; i++) {
      if (classes.indexOf('flm-messagebar--' + types[i]) !== -1) {
        return types[i];
      }
    }
    return 'info';
  }

  function init(root) {
    var els = (root || document).querySelectorAll('.flm-messagebar');
    for (var i = 0; i < els.length; i++) {
      render(els[i]);
    }
  }

  function render(el) {
    if (el.getAttribute('data-messagebar-rendered')) return;

    var type = getType(el);

    // Auto-inject icon if none exists
    if (!el.querySelector('.flm-messagebar-icon')) {
      var iconName = typeIconMap[type];
      var svg = FluentIcons.getSvg(iconName);
      if (svg) {
        var iconSpan = document.createElement('span');
        iconSpan.className = 'flm-messagebar-icon';
        iconSpan.appendChild(svg);
        el.insertBefore(iconSpan, el.firstChild);
      }
    }

    // Wrap bare text content in .flm-messagebar-text if not already wrapped
    if (!el.querySelector('.flm-messagebar-text')) {
      var children = Array.prototype.slice.call(el.childNodes);
      var textWrapper = document.createElement('span');
      textWrapper.className = 'flm-messagebar-text';
      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (!child.classList ||
            (!child.classList.contains('flm-messagebar-icon') &&
             !child.classList.contains('flm-messagebar-actions') &&
             !child.classList.contains('flm-messagebar-dismiss'))) {
          textWrapper.appendChild(child);
        }
      }
      // Insert text wrapper after the icon
      var icon = el.querySelector('.flm-messagebar-icon');
      if (icon) {
        icon.after(textWrapper);
      } else {
        el.insertBefore(textWrapper, el.firstChild);
      }
    }

    // Wire up dismiss button
    var dismiss = el.querySelector('.flm-messagebar-dismiss');
    if (dismiss) {
      dismiss.addEventListener('click', function () {
        el.style.display = 'none';
      });
    }

    // ARIA
    el.setAttribute('role', 'status');
    if (type === 'error' || type === 'blocked' || type === 'severeWarning') {
      el.setAttribute('role', 'alert');
    }

    el.setAttribute('data-messagebar-rendered', 'true');
  }

  return { init: init };
})();

/**
 * Modal component JS — open/close, Escape key, overlay dismiss.
 *
 * Usage:
 *   FluentLMModalComponent.open('my-modal')
 *   FluentLMModalComponent.close('my-modal')
 *
 * Trigger: <button data-modal-open="my-modal">Open</button>
 */
var FluentLMModalComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var triggers = doc.querySelectorAll('[data-modal-open]');
    for (var i = 0; i < triggers.length; i++) {
      wireTrigger(triggers[i]);
    }

    var closeBtns = doc.querySelectorAll('[data-modal-close]');
    for (var j = 0; j < closeBtns.length; j++) {
      wireClose(closeBtns[j]);
    }

    var overlays = doc.querySelectorAll('.flm-modal-overlay');
    for (var k = 0; k < overlays.length; k++) {
      wireOverlay(overlays[k]);
    }
  }

  function wireTrigger(btn) {
    if (btn.getAttribute('data-modal-wired')) return;
    btn.addEventListener('click', function () {
      open(btn.getAttribute('data-modal-open'));
    });
    btn.setAttribute('data-modal-wired', 'true');
  }

  function wireClose(btn) {
    if (btn.getAttribute('data-modal-wired')) return;
    btn.addEventListener('click', function () {
      var overlay = btn.closest('.flm-modal-overlay');
      if (overlay) closeOverlay(overlay);
    });
    btn.setAttribute('data-modal-wired', 'true');
  }

  function wireOverlay(overlay) {
    if (overlay.getAttribute('data-modal-overlay-wired')) return;
    // Only light-dismiss if not blocking
    if (overlay.hasAttribute('data-light-dismiss')) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeOverlay(overlay);
      });
    }
    overlay.setAttribute('data-modal-overlay-wired', 'true');
  }

  function open(id) {
    var overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.add('flm-modal-overlay--open');
    document.body.style.overflow = 'hidden';

    var escHandler = function (e) {
      if (e.key === 'Escape' && !overlay.hasAttribute('data-blocking')) {
        closeOverlay(overlay);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
    overlay._escHandler = escHandler;
  }

  function close(id) {
    var overlay = document.getElementById(id);
    if (overlay) closeOverlay(overlay);
  }

  function closeOverlay(overlay) {
    overlay.classList.remove('flm-modal-overlay--open');
    document.body.style.overflow = '';
    if (overlay._escHandler) {
      document.removeEventListener('keydown', overlay._escHandler);
      delete overlay._escHandler;
    }
  }

  return { init: init, open: open, close: close };
})();

/**
 * Nav component JS — collapsible groups and active link tracking.
 */
var FluentLMNavComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    // Wire collapsible group headers
    var headers = doc.querySelectorAll('.flm-nav-group-header');
    for (var i = 0; i < headers.length; i++) {
      wireGroupHeader(headers[i]);
    }

    // Wire nav link clicks
    var links = doc.querySelectorAll('.flm-nav-link');
    for (var j = 0; j < links.length; j++) {
      wireLink(links[j]);
    }
  }

  function wireGroupHeader(header) {
    if (header.getAttribute('data-nav-wired')) return;

    header.addEventListener('click', function () {
      var items = header.nextElementSibling;
      if (!items || !items.classList.contains('flm-nav-group-items')) return;

      var chevron = header.querySelector('.flm-nav-chevron');
      var collapsed = items.classList.contains('flm-nav-group-items--collapsed');

      if (collapsed) {
        items.classList.remove('flm-nav-group-items--collapsed');
        if (chevron) chevron.classList.add('flm-nav-chevron--expanded');
      } else {
        items.classList.add('flm-nav-group-items--collapsed');
        if (chevron) chevron.classList.remove('flm-nav-chevron--expanded');
      }
    });

    header.setAttribute('data-nav-wired', 'true');
  }

  function wireLink(link) {
    if (link.getAttribute('data-nav-wired')) return;

    link.addEventListener('click', function () {
      // Remove active from all links in this nav
      var nav = link.closest('.flm-nav');
      if (nav) {
        var allLinks = nav.querySelectorAll('.flm-nav-link');
        for (var i = 0; i < allLinks.length; i++) {
          allLinks[i].classList.remove('flm-nav-link--active');
        }
      }
      link.classList.add('flm-nav-link--active');
    });

    link.setAttribute('data-nav-wired', 'true');
  }

  return { init: init };
})();

/**
 * OverflowSet component JS — responsive container that hides items into
 * an overflow "..." menu.
 *
 * Usage:
 *   <div class="flm-overflowset">
 *     <div class="flm-overflowset-items">
 *       <button class="flm-overflowset-item" data-label="New" data-icon="Add">New</button>
 *       <button class="flm-overflowset-item" data-label="Edit" data-icon="Edit">Edit</button>
 *     </div>
 *     <button class="flm-overflowset-overflow" aria-label="More items">...</button>
 *     <div class="flm-overflowset-far">
 *       <button class="flm-overflowset-item" data-label="Settings">Settings</button>
 *     </div>
 *   </div>
 *
 * Attributes:
 *   data-overflow-order="N" on items — higher N overflows first.
 *   data-label — label shown in overflow menu.
 *   data-icon — icon name shown in overflow menu.
 */
var FluentLMOverflowSetComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;
    var sets = doc.querySelectorAll('.flm-overflowset');
    for (var i = 0; i < sets.length; i++) {
      wireSet(sets[i]);
    }
  }

  function wireSet(el) {
    if (el.getAttribute('data-overflowset-wired')) return;

    var itemsContainer = el.querySelector('.flm-overflowset-items');
    var overflowBtn = el.querySelector('.flm-overflowset-overflow');

    if (!itemsContainer) return;

    var menuEl = null;

    function getItems() {
      return itemsContainer.querySelectorAll('.flm-overflowset-item');
    }

    function recalculate() {
      var items = getItems();
      var i;

      // Show all items first to measure
      for (i = 0; i < items.length; i++) {
        items[i].classList.remove('flm-overflowset-item--hidden');
      }
      el.classList.remove('flm-overflowset--has-overflow');

      // Get available width
      var containerWidth = itemsContainer.offsetWidth;

      // Build array with overflow priority
      var itemData = [];
      for (i = 0; i < items.length; i++) {
        itemData.push({
          el: items[i],
          order: parseInt(items[i].getAttribute('data-overflow-order') || '0', 10),
          index: i,
          width: items[i].offsetWidth
        });
      }

      // Sort by overflow order descending (higher order overflows first), then by reverse DOM order
      itemData.sort(function (a, b) {
        if (b.order !== a.order) return b.order - a.order;
        return b.index - a.index;
      });

      // Measure total width
      var totalWidth = 0;
      var gap = 4; // matches var(--spacingS2) = 4px
      for (i = 0; i < items.length; i++) {
        totalWidth += items[i].offsetWidth + (i > 0 ? gap : 0);
      }

      // Account for overflow button width if we might need it
      var overflowBtnWidth = overflowBtn ? 36 : 0; // 32px + gap

      // Hide items until they fit
      var hiddenItems = [];
      var idx = 0;
      while (totalWidth > containerWidth && idx < itemData.length) {
        var item = itemData[idx];
        item.el.classList.add('flm-overflowset-item--hidden');
        totalWidth -= item.width + gap;
        // First time we overflow, account for the overflow button
        if (hiddenItems.length === 0) {
          totalWidth += overflowBtnWidth;
        }
        hiddenItems.push(item);
        idx++;
      }

      if (hiddenItems.length > 0) {
        el.classList.add('flm-overflowset--has-overflow');
      }
    }

    function buildOverflowMenu() {
      // Clean up existing menu
      if (menuEl) {
        if (menuEl.classList.contains('flm-contextmenu--visible')) {
          hideMenu();
          return;
        }
        menuEl.parentNode.removeChild(menuEl);
        menuEl = null;
      }

      var hiddenItems = itemsContainer.querySelectorAll('.flm-overflowset-item--hidden');
      if (hiddenItems.length === 0) return;

      menuEl = document.createElement('div');
      menuEl.className = 'flm-contextmenu';

      for (var i = 0; i < hiddenItems.length; i++) {
        var item = hiddenItems[i];
        var label = item.getAttribute('data-label') || item.textContent.trim();
        var icon = item.getAttribute('data-icon');

        var menuItem = document.createElement('button');
        menuItem.className = 'flm-contextmenu-item';

        if (icon) {
          var iconSpan = document.createElement('span');
          iconSpan.className = 'flm-contextmenu-item-icon';
          var svg = typeof FluentIcons !== 'undefined' ? FluentIcons.getSvg(icon) : null;
          if (svg) {
            iconSpan.appendChild(svg);
          }
          menuItem.appendChild(iconSpan);
        }

        var textSpan = document.createElement('span');
        textSpan.className = 'flm-contextmenu-item-text';
        textSpan.textContent = label;
        menuItem.appendChild(textSpan);

        // Proxy click to original item
        (function (originalItem) {
          menuItem.addEventListener('click', function () {
            hideMenu();
            originalItem.click();
          });
        })(item);

        menuEl.appendChild(menuItem);
      }

      document.body.appendChild(menuEl);
      showMenu();
    }

    function showMenu() {
      if (!menuEl || !overflowBtn) return;

      var rect = overflowBtn.getBoundingClientRect();
      var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;

      menuEl.style.position = 'absolute';
      menuEl.style.left = rect.left + scrollX + 'px';
      menuEl.style.top = (rect.bottom + scrollY + 2) + 'px';
      menuEl.classList.add('flm-contextmenu--visible');

      // Reposition if off-screen
      setTimeout(function () {
        var menuRect = menuEl.getBoundingClientRect();
        if (menuRect.right > window.innerWidth) {
          menuEl.style.left = (rect.right + scrollX - menuRect.width) + 'px';
        }
        if (menuRect.bottom > window.innerHeight) {
          menuEl.style.top = (rect.top + scrollY - menuRect.height - 2) + 'px';
        }
      }, 0);

      // Click outside to close
      var outsideHandler = function (e) {
        if (!menuEl.contains(e.target) && e.target !== overflowBtn) {
          hideMenu();
          document.removeEventListener('click', outsideHandler);
        }
      };
      setTimeout(function () {
        document.addEventListener('click', outsideHandler);
      }, 0);
      menuEl._outsideHandler = outsideHandler;
    }

    function hideMenu() {
      if (!menuEl) return;
      menuEl.classList.remove('flm-contextmenu--visible');
      if (menuEl._outsideHandler) {
        document.removeEventListener('click', menuEl._outsideHandler);
        delete menuEl._outsideHandler;
      }
      // Remove from DOM after transition
      setTimeout(function () {
        if (menuEl && menuEl.parentNode) {
          menuEl.parentNode.removeChild(menuEl);
        }
        menuEl = null;
      }, 200);
    }

    // Wire overflow button click
    if (overflowBtn) {
      overflowBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        buildOverflowMenu();
      });
    }

    // Observe size changes
    if (typeof ResizeObserver !== 'undefined') {
      var observer = new ResizeObserver(function () {
        recalculate();
      });
      observer.observe(el);
    } else {
      window.addEventListener('resize', recalculate);
    }

    // Initial calculation
    recalculate();

    el.setAttribute('data-overflowset-wired', 'true');
  }

  return { init: init };
})();

/**
 * Panel component JS — slide-in/out, Escape key, overlay dismiss.
 *
 * Usage:
 *   FluentLMPanelComponent.open('my-panel')
 *   FluentLMPanelComponent.close('my-panel')
 *
 * Trigger: <button data-panel-open="my-panel">Open</button>
 */
var FluentLMPanelComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var triggers = doc.querySelectorAll('[data-panel-open]');
    for (var i = 0; i < triggers.length; i++) {
      wireTrigger(triggers[i]);
    }

    var closeBtns = doc.querySelectorAll('.flm-panel-close, [data-panel-close]');
    for (var j = 0; j < closeBtns.length; j++) {
      wireClose(closeBtns[j]);
    }

    var overlays = doc.querySelectorAll('.flm-panel-overlay');
    for (var k = 0; k < overlays.length; k++) {
      wireOverlay(overlays[k]);
    }
  }

  function wireTrigger(btn) {
    if (btn.getAttribute('data-panel-wired')) return;
    btn.addEventListener('click', function () {
      open(btn.getAttribute('data-panel-open'));
    });
    btn.setAttribute('data-panel-wired', 'true');
  }

  function wireClose(btn) {
    if (btn.getAttribute('data-panel-wired')) return;
    btn.addEventListener('click', function () {
      var panel = btn.closest('.flm-panel');
      if (panel) closePanel(panel);
    });
    btn.setAttribute('data-panel-wired', 'true');
  }

  function wireOverlay(overlay) {
    if (overlay.getAttribute('data-panel-overlay-wired')) return;
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        var panel = overlay.nextElementSibling;
        if (panel && panel.classList.contains('flm-panel')) {
          closePanel(panel);
        }
      }
    });
    overlay.setAttribute('data-panel-overlay-wired', 'true');
  }

  function open(id) {
    var panel = document.getElementById(id);
    if (!panel) return;

    // Show overlay
    var overlay = panel.previousElementSibling;
    if (overlay && overlay.classList.contains('flm-panel-overlay')) {
      overlay.classList.add('flm-panel-overlay--open');
    }

    panel.classList.add('flm-panel--open');
    document.body.style.overflow = 'hidden';

    var escHandler = function (e) {
      if (e.key === 'Escape') {
        closePanel(panel);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
    panel._escHandler = escHandler;

    setTimeout(function () {
      var focusable = panel.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable) focusable.focus();
    }, 50);
  }

  function close(id) {
    var panel = document.getElementById(id);
    if (panel) closePanel(panel);
  }

  function closePanel(panel) {
    panel.classList.remove('flm-panel--open');

    var overlay = panel.previousElementSibling;
    if (overlay && overlay.classList.contains('flm-panel-overlay')) {
      overlay.classList.remove('flm-panel-overlay--open');
    }

    document.body.style.overflow = '';
    if (panel._escHandler) {
      document.removeEventListener('keydown', panel._escHandler);
      delete panel._escHandler;
    }
  }

  return { init: init, open: open, close: close };
})();

/**
 * Pivot component JS — tab switching.
 * Tabs reference panels by data-panel attribute.
 */
var FluentLMPivotComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var pivots = doc.querySelectorAll('.flm-pivot');
    for (var i = 0; i < pivots.length; i++) {
      wirePivot(pivots[i]);
    }
  }

  function wirePivot(pivot) {
    if (pivot.getAttribute('data-pivot-wired')) return;

    var tabs = pivot.querySelectorAll('.flm-pivot-tab');
    for (var i = 0; i < tabs.length; i++) {
      wireTab(pivot, tabs[i]);
    }

    pivot.setAttribute('data-pivot-wired', 'true');
  }

  function wireTab(pivot, tab) {
    tab.addEventListener('click', function () {
      if (tab.classList.contains('flm-pivot-tab--disabled')) return;

      // Deactivate all tabs
      var allTabs = pivot.querySelectorAll('.flm-pivot-tab');
      for (var i = 0; i < allTabs.length; i++) {
        allTabs[i].classList.remove('flm-pivot-tab--active');
        allTabs[i].setAttribute('aria-selected', 'false');
      }

      // Hide all panels
      var allPanels = pivot.querySelectorAll('.flm-pivot-panel');
      for (var j = 0; j < allPanels.length; j++) {
        allPanels[j].classList.remove('flm-pivot-panel--active');
      }

      // Activate clicked tab
      tab.classList.add('flm-pivot-tab--active');
      tab.setAttribute('aria-selected', 'true');

      // Show matching panel
      var panelId = tab.getAttribute('data-panel');
      if (panelId) {
        var panel = document.getElementById(panelId);
        if (panel) panel.classList.add('flm-pivot-panel--active');
      }
    });
  }

  return { init: init };
})();

/**
 * Rating component JS — stores selected rating value on the root element.
 */
var FluentLMRatingComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var ratings = doc.querySelectorAll('.flm-rating');
    for (var i = 0; i < ratings.length; i++) {
      wireRating(ratings[i]);
    }
  }

  function wireRating(rating) {
    if (rating.getAttribute('data-rating-wired')) return;

    var inputs = rating.querySelectorAll('.flm-rating-input');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('change', function () {
        if (this.checked) {
          rating.setAttribute('data-rating-value', this.value);
        }
      });
    }

    // Set initial value from pre-checked input
    var checked = rating.querySelector('.flm-rating-input:checked');
    if (checked) {
      rating.setAttribute('data-rating-value', checked.value);
    }

    rating.setAttribute('data-rating-wired', 'true');
  }

  return { init: init };
})();

/**
 * SearchBox component JS — injects search icon, wires clear button.
 */
var FluentLMSearchBoxComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var boxes = doc.querySelectorAll('.flm-searchbox');
    for (var i = 0; i < boxes.length; i++) {
      render(boxes[i]);
    }
  }

  function render(box) {
    if (box.getAttribute('data-searchbox-rendered')) return;

    // Inject search icon if not present
    var iconEl = box.querySelector('.flm-searchbox-icon');
    if (!iconEl) {
      iconEl = document.createElement('span');
      iconEl.className = 'flm-searchbox-icon';
      var svg = FluentIcons.getSvg('Search');
      if (svg) iconEl.appendChild(svg);
      box.insertBefore(iconEl, box.firstChild);
    }

    // Inject clear button if not present
    var clearBtn = box.querySelector('.flm-searchbox-clear');
    if (!clearBtn) {
      clearBtn = document.createElement('button');
      clearBtn.className = 'flm-searchbox-clear';
      clearBtn.setAttribute('aria-label', 'Clear search');
      clearBtn.type = 'button';
      var cancelSvg = FluentIcons.getSvg('Cancel');
      if (cancelSvg) clearBtn.appendChild(cancelSvg);
      box.appendChild(clearBtn);
    }

    var input = box.querySelector('.flm-searchbox-input');
    if (!input) { box.setAttribute('data-searchbox-rendered', 'true'); return; }

    // Toggle has-value class
    function updateHasValue() {
      if (input.value) {
        box.classList.add('flm-searchbox--has-value');
      } else {
        box.classList.remove('flm-searchbox--has-value');
      }
    }

    input.addEventListener('input', updateHasValue);
    updateHasValue();

    // Clear button click
    clearBtn.addEventListener('click', function () {
      input.value = '';
      updateHasValue();
      input.focus();
      // Fire input event so any listeners are notified
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    box.setAttribute('data-searchbox-rendered', 'true');
  }

  return { init: init };
})();

/**
 * Slider component JS — updates CSS variable for track fill and value display.
 */
var FluentLMSliderComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var sliders = doc.querySelectorAll('.flm-slider');
    for (var i = 0; i < sliders.length; i++) {
      wireSlider(sliders[i]);
    }
  }

  function wireSlider(el) {
    if (el.getAttribute('data-slider-wired')) return;

    var input = el.querySelector('.flm-slider-input');
    if (!input) return;

    var valueDisplay = el.querySelector('.flm-slider-value');

    function update() {
      var min = parseFloat(input.min) || 0;
      var max = parseFloat(input.max) || 100;
      var val = parseFloat(input.value) || 0;
      var pct = ((val - min) / (max - min)) * 100;
      input.style.setProperty('--flm-slider-fill', pct + '%');

      if (valueDisplay) {
        valueDisplay.textContent = input.value;
      }
    }

    input.addEventListener('input', update);
    input.addEventListener('change', update);

    // Set initial fill
    update();

    el.setAttribute('data-slider-wired', 'true');
  }

  return { init: init };
})();

/**
 * SpinButton component JS — wires increment/decrement buttons to numeric input.
 */
var FluentLMSpinButtonComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var spinButtons = doc.querySelectorAll('.flm-spinbutton');
    for (var i = 0; i < spinButtons.length; i++) {
      wireSpinButton(spinButtons[i]);
    }
  }

  function wireSpinButton(el) {
    if (el.getAttribute('data-spinbutton-wired')) return;

    var input = el.querySelector('.flm-spinbutton-input');
    if (!input) return;

    var decBtn = el.querySelector('.flm-spinbutton-btn--decrement');
    var incBtn = el.querySelector('.flm-spinbutton-btn--increment');

    // Inject icons if empty
    if (decBtn && !decBtn.innerHTML.trim()) {
      decBtn.setAttribute('data-icon', 'ChevronDown');
    }
    if (incBtn && !incBtn.innerHTML.trim()) {
      incBtn.setAttribute('data-icon', 'ChevronUp');
    }

    if (decBtn) {
      decBtn.addEventListener('click', function () {
        if (input.disabled) return;
        try { input.stepDown(); } catch (e) {
          input.value = (parseFloat(input.value) || 0) - (parseFloat(input.step) || 1);
        }
        fireChange(input);
      });
    }

    if (incBtn) {
      incBtn.addEventListener('click', function () {
        if (input.disabled) return;
        try { input.stepUp(); } catch (e) {
          input.value = (parseFloat(input.value) || 0) + (parseFloat(input.step) || 1);
        }
        fireChange(input);
      });
    }

    el.setAttribute('data-spinbutton-wired', 'true');
  }

  function fireChange(input) {
    var evt = document.createEvent('Event');
    evt.initEvent('change', true, true);
    input.dispatchEvent(evt);
  }

  return { init: init };
})();

/**
 * SwatchColorPicker component JS — manages selection state on color swatches.
 */
var FluentLMSwatchColorPickerComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var pickers = doc.querySelectorAll('.flm-swatchcolorpicker');
    for (var i = 0; i < pickers.length; i++) {
      wirePicker(pickers[i]);
    }
  }

  function wirePicker(picker) {
    if (picker.getAttribute('data-swatchcolorpicker-wired')) return;

    var cells = picker.querySelectorAll('.flm-swatchcolorpicker-cell');
    for (var i = 0; i < cells.length; i++) {
      wireCell(picker, cells[i]);
    }

    picker.setAttribute('data-swatchcolorpicker-wired', 'true');
  }

  function wireCell(picker, cell) {
    cell.addEventListener('click', function () {
      if (cell.disabled || cell.classList.contains('flm-swatchcolorpicker-cell--disabled')) return;

      // Clear previous selection
      var prev = picker.querySelector('.flm-swatchcolorpicker-cell--selected');
      if (prev) {
        prev.classList.remove('flm-swatchcolorpicker-cell--selected');
      }

      // Select this cell
      cell.classList.add('flm-swatchcolorpicker-cell--selected');

      // Store selected color on root
      var color = cell.getAttribute('data-color') || cell.style.backgroundColor || '';
      picker.setAttribute('data-selected', 'true');
      picker.setAttribute('data-selected-color', color);
    });
  }

  return { init: init };
})();

/**
 * TagPicker / PeoplePicker component JS — multi-select input with chip/tag UI.
 *
 * Usage:
 *   <div class="flm-tagpicker">
 *     <label class="flm-label">Tags</label>
 *     <div class="flm-tagpicker-well">
 *       <input class="flm-tagpicker-input" placeholder="Add tags…">
 *     </div>
 *     <div class="flm-tagpicker-listbox">
 *       <div class="flm-tagpicker-option" data-value="a">Alpha</div>
 *       <div class="flm-tagpicker-option" data-value="b">Beta</div>
 *     </div>
 *   </div>
 *
 * PeoplePicker variant: add flm-tagpicker--people on root, use
 *   data-initials="JD" and data-secondary="Engineer" on options.
 *
 * Attributes:
 *   data-max-tags="N" — limits number of selected tags.
 *   data-selected-values — CSV of selected values (auto-maintained).
 */
var FluentLMTagPickerComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;
    var pickers = doc.querySelectorAll('.flm-tagpicker');
    for (var i = 0; i < pickers.length; i++) {
      wirePicker(pickers[i]);
    }
  }

  function wirePicker(el) {
    if (el.getAttribute('data-tagpicker-wired')) return;
    if (el.classList.contains('flm-tagpicker--disabled')) return;

    var well = el.querySelector('.flm-tagpicker-well');
    var input = el.querySelector('.flm-tagpicker-input');
    var listbox = el.querySelector('.flm-tagpicker-listbox');

    if (!well || !input || !listbox) return;

    var isPeople = el.classList.contains('flm-tagpicker--people');
    var highlighted = -1;

    function getVisibleOptions() {
      return listbox.querySelectorAll('.flm-tagpicker-option:not(.flm-tagpicker-option--selected):not(.flm-tagpicker-option--hidden)');
    }

    function isOpen() {
      return listbox.classList.contains('flm-tagpicker-listbox--open');
    }

    function open() {
      listbox.classList.add('flm-tagpicker-listbox--open');
      highlighted = -1;
      flipIfNeeded();
    }

    function close() {
      listbox.classList.remove('flm-tagpicker-listbox--open', 'flm-tagpicker-listbox--above');
      highlighted = -1;
      clearHighlight();
    }

    function flipIfNeeded() {
      setTimeout(function () {
        var rect = listbox.getBoundingClientRect();
        if (rect.bottom > window.innerHeight) {
          listbox.classList.add('flm-tagpicker-listbox--above');
        } else {
          listbox.classList.remove('flm-tagpicker-listbox--above');
        }
      }, 0);
    }

    function clearHighlight() {
      var opts = listbox.querySelectorAll('.flm-tagpicker-option--highlighted');
      for (var i = 0; i < opts.length; i++) {
        opts[i].classList.remove('flm-tagpicker-option--highlighted');
      }
    }

    function setHighlight(idx) {
      clearHighlight();
      var opts = getVisibleOptions();
      if (idx >= 0 && idx < opts.length) {
        highlighted = idx;
        opts[idx].classList.add('flm-tagpicker-option--highlighted');
        opts[idx].scrollIntoView({ block: 'nearest' });
      }
    }

    function filterOptions() {
      var text = input.value.toLowerCase();
      var allOpts = listbox.querySelectorAll('.flm-tagpicker-option');
      for (var i = 0; i < allOpts.length; i++) {
        var optText = allOpts[i].textContent.toLowerCase();
        if (text === '' || optText.indexOf(text) !== -1) {
          allOpts[i].classList.remove('flm-tagpicker-option--hidden');
        } else {
          allOpts[i].classList.add('flm-tagpicker-option--hidden');
        }
      }
      highlighted = -1;
    }

    function getMaxTags() {
      var max = el.getAttribute('data-max-tags');
      return max ? parseInt(max, 10) : 0;
    }

    function getChips() {
      return well.querySelectorAll('.flm-tagpicker-chip');
    }

    function updateSelectedValues() {
      var chips = getChips();
      var values = [];
      for (var i = 0; i < chips.length; i++) {
        values.push(chips[i].getAttribute('data-value'));
      }
      el.setAttribute('data-selected-values', values.join(','));

      // Fire change event
      var evt = document.createEvent('Event');
      evt.initEvent('change', true, true);
      el.dispatchEvent(evt);
    }

    function addChip(opt) {
      var max = getMaxTags();
      if (max > 0 && getChips().length >= max) return;

      var value = opt.getAttribute('data-value') || opt.textContent.trim();
      var text = opt.getAttribute('data-value') ? opt.textContent.trim() : value;

      // For people picker, try to get just the name
      var nameEl = opt.querySelector('.flm-tagpicker-option-name');
      if (nameEl) {
        text = nameEl.textContent.trim();
      }

      var chip = document.createElement('span');
      chip.className = 'flm-tagpicker-chip';
      chip.setAttribute('data-value', value);

      // People variant: add small coin
      if (isPeople) {
        var initials = opt.getAttribute('data-initials') || '';
        if (initials) {
          var coin = document.createElement('span');
          coin.className = 'flm-tagpicker-chip-coin';
          coin.textContent = initials;
          chip.appendChild(coin);
        }
      }

      var textSpan = document.createElement('span');
      textSpan.className = 'flm-tagpicker-chip-text';
      textSpan.textContent = text;
      chip.appendChild(textSpan);

      var removeBtn = document.createElement('button');
      removeBtn.className = 'flm-tagpicker-chip-remove';
      removeBtn.setAttribute('aria-label', 'Remove ' + text);
      removeBtn.type = 'button';
      removeBtn.innerHTML = '<svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg"><path d="M1.17.46L4 3.3 6.83.46a.5.5 0 0 1 .71.71L4.7 4l2.84 2.83a.5.5 0 0 1-.71.71L4 4.7 1.17 7.54a.5.5 0 0 1-.71-.71L3.3 4 .46 1.17A.5.5 0 0 1 1.17.46z"/></svg>';
      chip.appendChild(removeBtn);

      // Insert chip before input
      well.insertBefore(chip, input);

      // Mark option as selected
      opt.classList.add('flm-tagpicker-option--selected');

      // Wire remove button
      removeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        removeChip(chip, opt);
      });

      input.value = '';
      filterOptions();
      updateSelectedValues();
    }

    function removeChip(chip, opt) {
      chip.parentNode.removeChild(chip);
      opt.classList.remove('flm-tagpicker-option--selected');
      updateSelectedValues();
      input.focus();
    }

    // Click on well focuses input
    well.addEventListener('click', function () {
      input.focus();
    });

    // Input events
    input.addEventListener('focus', function () {
      if (!isOpen()) {
        filterOptions();
        open();
      }
    });

    input.addEventListener('input', function () {
      if (!isOpen()) open();
      filterOptions();
    });

    // Keyboard navigation
    input.addEventListener('keydown', function (e) {
      var opts = getVisibleOptions();
      var len = opts.length;

      if (e.key === 'ArrowDown' || e.keyCode === 40) {
        e.preventDefault();
        if (!isOpen()) { filterOptions(); open(); }
        setHighlight(highlighted < len - 1 ? highlighted + 1 : 0);
      } else if (e.key === 'ArrowUp' || e.keyCode === 38) {
        e.preventDefault();
        if (!isOpen()) { filterOptions(); open(); }
        setHighlight(highlighted > 0 ? highlighted - 1 : len - 1);
      } else if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        if (highlighted >= 0 && highlighted < len) {
          addChip(opts[highlighted]);
          highlighted = -1;
        }
      } else if (e.key === 'Escape' || e.keyCode === 27) {
        close();
      } else if ((e.key === 'Backspace' || e.keyCode === 8) && input.value === '') {
        // Remove last chip on backspace with empty input
        var chips = getChips();
        if (chips.length > 0) {
          var lastChip = chips[chips.length - 1];
          var chipValue = lastChip.getAttribute('data-value');
          // Find corresponding option
          var allOpts = listbox.querySelectorAll('.flm-tagpicker-option');
          for (var i = 0; i < allOpts.length; i++) {
            var optVal = allOpts[i].getAttribute('data-value') || allOpts[i].textContent.trim();
            if (optVal === chipValue) {
              removeChip(lastChip, allOpts[i]);
              break;
            }
          }
        }
      }
    });

    // Option click
    listbox.addEventListener('click', function (e) {
      var opt = e.target.closest('.flm-tagpicker-option');
      if (opt && !opt.classList.contains('flm-tagpicker-option--selected')) {
        addChip(opt);
        input.focus();
      }
    });

    // Click outside
    document.addEventListener('click', function (e) {
      if (!el.contains(e.target) && isOpen()) {
        close();
      }
    });

    el.setAttribute('data-tagpicker-wired', 'true');
  }

  return { init: init };
})();

/**
 * TeachingBubble component JS — positioned inverted callout.
 *
 * Usage:
 *   <button data-teachingbubble-toggle="tb1">Learn more</button>
 *   <div class="flm-teachingbubble" id="tb1">
 *     <div class="flm-teachingbubble-beak"></div>
 *     <div class="flm-teachingbubble-header">
 *       <h3 class="flm-teachingbubble-headline">Title</h3>
 *       <button class="flm-teachingbubble-close" data-icon="Cancel" aria-label="Close"></button>
 *     </div>
 *     <div class="flm-teachingbubble-body">Body text</div>
 *     <div class="flm-teachingbubble-footer">
 *       <button class="flm-button">Got it</button>
 *     </div>
 *   </div>
 */
var FluentLMTeachingBubbleComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;

    var triggers = doc.querySelectorAll('[data-teachingbubble-toggle]');
    for (var i = 0; i < triggers.length; i++) {
      // Skip coachmarks — they wire their own click handler
      if (triggers[i].classList.contains('flm-coachmark')) continue;
      wireTrigger(triggers[i]);
    }

    // Wire close buttons
    var closeBtns = doc.querySelectorAll('.flm-teachingbubble-close');
    for (var j = 0; j < closeBtns.length; j++) {
      wireClose(closeBtns[j]);
    }

    // Wire footer buttons that should dismiss
    var footerBtns = doc.querySelectorAll('.flm-teachingbubble-footer .flm-button');
    for (var k = 0; k < footerBtns.length; k++) {
      wireFooterBtn(footerBtns[k]);
    }
  }

  function wireTrigger(btn) {
    if (btn.getAttribute('data-teachingbubble-wired')) return;

    btn.addEventListener('click', function (e) {
      var id = btn.getAttribute('data-teachingbubble-toggle');
      var bubble = document.getElementById(id);
      if (!bubble) return;

      if (bubble.classList.contains('flm-teachingbubble--visible')) {
        hide(bubble);
      } else {
        show(bubble, btn);
      }
      e.stopPropagation();
    });

    btn.setAttribute('data-teachingbubble-wired', 'true');
  }

  function wireClose(btn) {
    if (btn.getAttribute('data-teachingbubble-close-wired')) return;

    btn.addEventListener('click', function () {
      var bubble = btn.closest('.flm-teachingbubble');
      if (bubble) hide(bubble);
    });

    btn.setAttribute('data-teachingbubble-close-wired', 'true');
  }

  function wireFooterBtn(btn) {
    if (btn.getAttribute('data-teachingbubble-footer-wired')) return;

    btn.addEventListener('click', function () {
      var bubble = btn.closest('.flm-teachingbubble');
      if (bubble) hide(bubble);
    });

    btn.setAttribute('data-teachingbubble-footer-wired', 'true');
  }

  function show(bubble, target) {
    var rect = target.getBoundingClientRect();
    var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Account for positioned offset parent so absolute coords are correct
    var offsetX = 0;
    var offsetY = 0;
    var offsetParent = bubble.offsetParent;
    if (offsetParent && offsetParent !== document.body && offsetParent !== document.documentElement) {
      var parentRect = offsetParent.getBoundingClientRect();
      offsetX = parentRect.left + scrollX;
      offsetY = parentRect.top + scrollY;
    }

    bubble.style.position = 'absolute';
    bubble.style.left = (rect.left + scrollX - offsetX) + 'px';
    bubble.style.top = (rect.bottom + scrollY - offsetY + 8) + 'px';

    bubble.classList.add('flm-teachingbubble--visible');
    bubble.classList.remove('flm-teachingbubble--above');

    // Position beak to point at target center
    setTimeout(function () {
      var bRect = bubble.getBoundingClientRect();
      var beak = bubble.querySelector('.flm-teachingbubble-beak');
      if (beak) {
        var targetCenterX = rect.left + rect.width / 2;
        var beakLeft = targetCenterX - bRect.left - 8; // 8 = half of 16px beak
        beakLeft = Math.max(8, Math.min(beakLeft, bRect.width - 24));
        beak.style.left = beakLeft + 'px';
      }

      // Flip above if off-screen
      if (bRect.bottom > window.innerHeight) {
        bubble.classList.add('flm-teachingbubble--above');
        bubble.style.top = (rect.top + scrollY - offsetY - bRect.height - 8) + 'px';
      }
    }, 0);

    // Click outside to dismiss
    var outsideHandler = function (e) {
      if (!bubble.contains(e.target) && !target.contains(e.target)) {
        hide(bubble);
        document.removeEventListener('click', outsideHandler);
      }
    };
    setTimeout(function () {
      document.addEventListener('click', outsideHandler);
    }, 0);
    bubble._outsideHandler = outsideHandler;
  }

  function hide(bubble) {
    bubble.classList.remove('flm-teachingbubble--visible', 'flm-teachingbubble--above');
    if (bubble._outsideHandler) {
      document.removeEventListener('click', bubble._outsideHandler);
      delete bubble._outsideHandler;
    }
  }

  return { init: init, show: show, hide: hide };
})();

/**
 * TimePicker component JS — scrollable time-slot dropdown with filtering.
 *
 * Usage:
 *   <div class="flm-timepicker" data-increment="30" data-use-12h data-min-time="09:00" data-max-time="17:00">
 *     <label class="flm-label" for="tp1">Time</label>
 *     <div class="flm-timepicker-wrapper">
 *       <input class="flm-timepicker-input" id="tp1" placeholder="Select a time…">
 *       <button class="flm-timepicker-icon" data-icon="Clock" aria-label="Open time picker"></button>
 *     </div>
 *   </div>
 *
 * Attributes on .flm-timepicker:
 *   data-increment="30"    — minute increment (default 30)
 *   data-use-12h           — 12-hour format with AM/PM (default 24h)
 *   data-min-time="09:00"  — earliest available time (HH:MM, 24h)
 *   data-max-time="17:00"  — latest available time (HH:MM, 24h)
 */
var FluentLMTimePickerComponent = (function () {
  'use strict';

  function init(root) {
    var doc = root || document;
    var pickers = doc.querySelectorAll('.flm-timepicker');
    for (var i = 0; i < pickers.length; i++) {
      wirePicker(pickers[i]);
    }
  }

  function wirePicker(el) {
    if (el.getAttribute('data-timepicker-wired')) return;

    var input = el.querySelector('.flm-timepicker-input');
    var iconBtn = el.querySelector('.flm-timepicker-icon');

    if (!input) return;

    // Configuration
    var increment = parseInt(el.getAttribute('data-increment'), 10) || 30;
    var use12h = el.hasAttribute('data-use-12h');
    var minTime = parseTime(el.getAttribute('data-min-time'));
    var maxTime = parseTime(el.getAttribute('data-max-time'));

    var highlighted = -1;

    // Create listbox
    var listbox = document.createElement('div');
    listbox.className = 'flm-timepicker-listbox';
    el.appendChild(listbox);

    // Generate options
    generateOptions();

    function parseTime(str) {
      if (!str) return null;
      var parts = str.split(':');
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }

    function padTwo(n) {
      return n < 10 ? '0' + n : '' + n;
    }

    function formatTime(totalMinutes) {
      var h = Math.floor(totalMinutes / 60) % 24;
      var m = totalMinutes % 60;
      if (use12h) {
        var period = h < 12 ? 'AM' : 'PM';
        var h12 = h % 12;
        if (h12 === 0) h12 = 12;
        return h12 + ':' + padTwo(m) + ' ' + period;
      }
      return padTwo(h) + ':' + padTwo(m);
    }

    function generateOptions() {
      listbox.innerHTML = '';
      for (var t = 0; t < 1440; t += increment) {
        if (minTime !== null && t < minTime) continue;
        if (maxTime !== null && t > maxTime) continue;
        var opt = document.createElement('div');
        opt.className = 'flm-timepicker-option';
        opt.setAttribute('data-value', padTwo(Math.floor(t / 60)) + ':' + padTwo(t % 60));
        opt.textContent = formatTime(t);
        listbox.appendChild(opt);
      }
    }

    function getOptions() {
      return listbox.querySelectorAll('.flm-timepicker-option:not(.flm-timepicker-option--hidden)');
    }

    function isOpen() {
      return listbox.classList.contains('flm-timepicker-listbox--open');
    }

    function open() {
      document.dispatchEvent(new CustomEvent('flm-dismiss-pickers', { detail: { source: el } }));
      listbox.classList.add('flm-timepicker-listbox--open');
      highlighted = -1;
      flipIfNeeded();
      scrollToSelected();
    }

    function close() {
      listbox.classList.remove('flm-timepicker-listbox--open', 'flm-timepicker-listbox--above');
      highlighted = -1;
      clearHighlight();
    }

    function flipIfNeeded() {
      setTimeout(function () {
        var rect = listbox.getBoundingClientRect();
        if (rect.bottom > window.innerHeight) {
          listbox.classList.add('flm-timepicker-listbox--above');
        } else {
          listbox.classList.remove('flm-timepicker-listbox--above');
        }
      }, 0);
    }

    function scrollToSelected() {
      setTimeout(function () {
        // Scroll to selected option, or nearest-to-current-time option
        var selected = listbox.querySelector('.flm-timepicker-option--selected');
        if (selected) {
          selected.scrollIntoView({ block: 'nearest' });
          return;
        }
        // Find nearest to current time
        var now = new Date();
        var nowMinutes = now.getHours() * 60 + now.getMinutes();
        var opts = getOptions();
        var bestOpt = null;
        var bestDiff = Infinity;
        for (var i = 0; i < opts.length; i++) {
          var val = parseTime(opts[i].getAttribute('data-value'));
          var diff = Math.abs(val - nowMinutes);
          if (diff < bestDiff) {
            bestDiff = diff;
            bestOpt = opts[i];
          }
        }
        if (bestOpt) {
          bestOpt.scrollIntoView({ block: 'nearest' });
        }
      }, 0);
    }

    function clearHighlight() {
      var opts = listbox.querySelectorAll('.flm-timepicker-option--highlighted');
      for (var i = 0; i < opts.length; i++) {
        opts[i].classList.remove('flm-timepicker-option--highlighted');
      }
    }

    function setHighlight(idx) {
      clearHighlight();
      var opts = getOptions();
      if (idx >= 0 && idx < opts.length) {
        highlighted = idx;
        opts[idx].classList.add('flm-timepicker-option--highlighted');
        opts[idx].scrollIntoView({ block: 'nearest' });
      }
    }

    function filterOptions() {
      var text = input.value.toLowerCase();
      var allOpts = listbox.querySelectorAll('.flm-timepicker-option');
      for (var i = 0; i < allOpts.length; i++) {
        var optText = allOpts[i].textContent.toLowerCase();
        if (text === '' || optText.indexOf(text) !== -1) {
          allOpts[i].classList.remove('flm-timepicker-option--hidden');
        } else {
          allOpts[i].classList.add('flm-timepicker-option--hidden');
        }
      }
      highlighted = -1;
    }

    function selectOption(opt) {
      var value = opt.getAttribute('data-value');
      var text = opt.textContent;

      // Clear previous selection
      var prev = listbox.querySelectorAll('.flm-timepicker-option--selected');
      for (var j = 0; j < prev.length; j++) {
        prev[j].classList.remove('flm-timepicker-option--selected');
      }
      opt.classList.add('flm-timepicker-option--selected');
      input.value = text;
      el.setAttribute('data-value', value);
      close();

      // Reset filter so all options are visible next time
      filterOptions();

      // Fire change event
      var evt = document.createEvent('Event');
      evt.initEvent('change', true, true);
      input.dispatchEvent(evt);
    }

    // Input events
    input.addEventListener('focus', function () {
      if (!isOpen()) open();
    });

    input.addEventListener('input', function () {
      if (!isOpen()) open();
      filterOptions();
    });

    // Icon toggle
    if (iconBtn) {
      iconBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (isOpen()) {
          close();
        } else {
          filterOptions();
          open();
          input.focus();
        }
      });
    }

    // Keyboard navigation
    input.addEventListener('keydown', function (e) {
      var opts = getOptions();
      var len = opts.length;

      if (e.key === 'ArrowDown' || e.keyCode === 40) {
        e.preventDefault();
        if (!isOpen()) { open(); filterOptions(); }
        setHighlight(highlighted < len - 1 ? highlighted + 1 : 0);
      } else if (e.key === 'ArrowUp' || e.keyCode === 38) {
        e.preventDefault();
        if (!isOpen()) { open(); filterOptions(); }
        setHighlight(highlighted > 0 ? highlighted - 1 : len - 1);
      } else if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        if (highlighted >= 0 && highlighted < len) {
          selectOption(opts[highlighted]);
        }
      } else if (e.key === 'Escape' || e.keyCode === 27) {
        close();
      }
    });

    // Option click
    listbox.addEventListener('click', function (e) {
      var opt = e.target.closest('.flm-timepicker-option');
      if (opt) {
        selectOption(opt);
      }
    });

    // Click outside
    document.addEventListener('click', function (e) {
      if (!el.contains(e.target) && isOpen()) {
        close();
      }
    });

    // Close when another picker opens
    document.addEventListener('flm-dismiss-pickers', function (e) {
      if (e.detail.source !== el && isOpen()) close();
    });

    el.setAttribute('data-timepicker-wired', 'true');
  }

  return { init: init };
})();

/**
 * Toggle component JS — initializes state text from data-on / data-off.
 * The CSS handles display via content: attr(data-on) / attr(data-off)
 * using the :checked sibling selector, so this module only needs to
 * handle any initial ARIA setup.
 */
var FluentLMToggleComponent = (function () {
  'use strict';

  function init(root) {
    var els = (root || document).querySelectorAll('.flm-toggle');
    for (var i = 0; i < els.length; i++) {
      render(els[i]);
    }
  }

  function render(el) {
    var input = el.querySelector('.flm-toggle-input');
    if (!input) return;

    // Set initial ARIA
    input.setAttribute('role', 'switch');
    input.setAttribute('aria-checked', input.checked ? 'true' : 'false');

    // Keep aria-checked in sync
    input.addEventListener('change', function () {
      input.setAttribute('aria-checked', input.checked ? 'true' : 'false');
    });
  }

  return { init: init };
})();

/**
 * Tooltip component JS — shows tooltip on hover/focus of host elements.
 *
 * Usage: <span class="flm-tooltip-host" data-tooltip="Help text">Hover me</span>
 * Or: <span class="flm-tooltip-host" data-tooltip-id="my-tooltip">Hover me</span>
 *     <div id="my-tooltip" class="flm-tooltip">Rich tooltip content</div>
 */
var FluentLMTooltipComponent = (function () {
  'use strict';

  var activeTooltip = null;
  var showDelay = 300;

  function init(root) {
    var doc = root || document;

    var hosts = doc.querySelectorAll('.flm-tooltip-host, [data-tooltip]');
    for (var i = 0; i < hosts.length; i++) {
      wireHost(hosts[i]);
    }
  }

  function wireHost(host) {
    if (host.getAttribute('data-tooltip-wired')) return;

    var timer = null;

    host.addEventListener('mouseenter', function () {
      timer = setTimeout(function () { showForHost(host); }, showDelay);
    });

    host.addEventListener('mouseleave', function () {
      clearTimeout(timer);
      hideActive();
    });

    host.addEventListener('focus', function () {
      timer = setTimeout(function () { showForHost(host); }, showDelay);
    });

    host.addEventListener('blur', function () {
      clearTimeout(timer);
      hideActive();
    });

    host.setAttribute('data-tooltip-wired', 'true');
  }

  function showForHost(host) {
    hideActive();

    var tooltip;
    var tooltipId = host.getAttribute('data-tooltip-id');

    if (tooltipId) {
      tooltip = document.getElementById(tooltipId);
    } else {
      // Create a dynamic tooltip from data-tooltip text
      var text = host.getAttribute('data-tooltip');
      if (!text) return;

      tooltip = document.createElement('div');
      tooltip.className = 'flm-tooltip';
      tooltip.textContent = text;
      tooltip._dynamic = true;
      document.body.appendChild(tooltip);
    }

    if (!tooltip) return;

    // Position below host
    var rect = host.getBoundingClientRect();
    var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;

    tooltip.style.position = 'absolute';
    tooltip.style.left = rect.left + scrollX + 'px';
    tooltip.style.top = (rect.bottom + scrollY + 4) + 'px';
    tooltip.classList.add('flm-tooltip--visible');

    activeTooltip = tooltip;

    // Flip if off-screen
    setTimeout(function () {
      var tRect = tooltip.getBoundingClientRect();
      if (tRect.bottom > window.innerHeight) {
        tooltip.style.top = (rect.top + scrollY - tRect.height - 4) + 'px';
      }
      if (tRect.right > window.innerWidth) {
        tooltip.style.left = (rect.right + scrollX - tRect.width) + 'px';
      }
    }, 0);
  }

  function hideActive() {
    if (!activeTooltip) return;
    activeTooltip.classList.remove('flm-tooltip--visible');
    if (activeTooltip._dynamic) {
      activeTooltip.parentNode.removeChild(activeTooltip);
    }
    activeTooltip = null;
  }

  return { init: init };
})();
