// ---------------------------------------------------------------------------
// CoreLM runtime — emitted as a <script> block in compiled pages
// Handles: event delegation, effects interpreter, state store, motion triggers
// ---------------------------------------------------------------------------

/**
 * Returns the CoreLM runtime JavaScript as a string template.
 * This is injected into compiled HTML pages.
 */
export function getCoreLMRuntime(): string {
    return `(function() {
  'use strict';

  // =========================================================================
  // State store
  // =========================================================================

  window.__coreState = window.__coreState || {};

  function getState(key) {
    return key.split('.').reduce(function(o, k) { return o && o[k]; }, window.__coreState);
  }

  function setState(key, value) {
    var parts = key.split('.');
    var obj = window.__coreState;
    for (var i = 0; i < parts.length - 1; i++) {
      if (!(parts[i] in obj)) obj[parts[i]] = {};
      obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
    syncDOM();
  }

  // =========================================================================
  // DOM sync — update data-bound elements when state changes
  // =========================================================================

  function syncDOM() {
    document.querySelectorAll('[data-core-bind]').forEach(function(el) {
      var key = el.getAttribute('data-core-bind');
      var val = getState(key);
      if (val !== undefined) {
        if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
          el.value = val;
        } else {
          el.textContent = String(val);
        }
      }
    });

    // Toggle visibility based on state
    document.querySelectorAll('[data-core-show]').forEach(function(el) {
      var key = el.getAttribute('data-core-show');
      var val = getState(key);
      el.style.display = val ? '' : 'none';
    });
  }

  // =========================================================================
  // Condition evaluator
  // =========================================================================

  function evaluateConditions(conditions) {
    if (!conditions || conditions.length === 0) return true;
    return conditions.every(function(c) {
      var val = getState(c.key);
      switch (c.op) {
        case 'eq': return val === c.value;
        case 'neq': return val !== c.value;
        case 'gt': return val > c.value;
        case 'lt': return val < c.value;
        case 'gte': return val >= c.value;
        case 'lte': return val <= c.value;
        case 'truthy': return !!val;
        case 'falsy': return !val;
        case 'contains': return Array.isArray(val) ? val.indexOf(c.value) !== -1 : String(val).indexOf(String(c.value)) !== -1;
        default: return true;
      }
    });
  }

  // =========================================================================
  // Effects interpreter
  // =========================================================================

  function executeEffect(effect, sourceEl) {
    switch (effect.type) {
      case 'toggleTarget': {
        var target = effect.target ? document.querySelector('[data-core-id="' + effect.target + '"]') : null;
        if (target) {
          var isHidden = target.style.display === 'none' || target.hidden;
          if (isHidden) { target.style.display = ''; target.hidden = false; }
          else { target.style.display = 'none'; }
        }
        break;
      }
      case 'setState':
        if (effect.key) setState(effect.key, effect.value);
        break;
      case 'appendStateArray': {
        if (effect.key) {
          var arr = getState(effect.key);
          if (!Array.isArray(arr)) arr = [];
          setState(effect.key, arr.concat([effect.value]));
        }
        break;
      }
      case 'fetchJson': {
        if (effect.url) {
          var opts = { method: effect.method || 'GET' };
          if (effect.body && opts.method !== 'GET') {
            opts.headers = { 'Content-Type': 'application/json' };
            opts.body = JSON.stringify(effect.body);
          }
          fetch(effect.url, opts)
            .then(function(r) { return r.json(); })
            .then(function(data) { if (effect.resultKey) setState(effect.resultKey, data); })
            .catch(function(err) { console.error('CoreLM fetchJson error:', err); });
        }
        break;
      }
      case 'emit': {
        var eventName = effect.event || 'core:event';
        document.dispatchEvent(new CustomEvent(eventName, { detail: { source: sourceEl } }));
        break;
      }
      case 'runAnimation': {
        var animTarget = effect.target ? document.querySelector('[data-core-id="' + effect.target + '"]') : sourceEl;
        if (animTarget && effect.animation) {
          animTarget.classList.add('core-animate-' + effect.animation);
          animTarget.addEventListener('animationend', function handler() {
            animTarget.classList.remove('core-animate-' + effect.animation);
            animTarget.removeEventListener('animationend', handler);
          });
        }
        break;
      }
      case 'focus': {
        var focusTarget = effect.selector ? document.querySelector(effect.selector)
          : (effect.target ? document.querySelector('[data-core-id="' + effect.target + '"]') : null);
        if (focusTarget) focusTarget.focus();
        break;
      }
      case 'toast': {
        var region = document.querySelector('[data-core-toast-region]') || document.querySelector('.flm-toast-region');
        if (region && effect.message) {
          var toast = document.createElement('div');
          toast.className = 'core-toast core-toast--' + (effect.variant || 'info');
          toast.textContent = effect.message;
          region.appendChild(toast);
          setTimeout(function() { toast.classList.add('core-toast--show'); }, 10);
          setTimeout(function() {
            toast.classList.remove('core-toast--show');
            setTimeout(function() { toast.remove(); }, 300);
          }, 3000);
        }
        break;
      }
    }
  }

  // =========================================================================
  // Event delegation
  // =========================================================================

  function handleCoreEvent(domEvent) {
    var el = domEvent.target.closest('[data-core-events]');
    if (!el) return;

    var bindings;
    try { bindings = JSON.parse(el.getAttribute('data-core-events')); }
    catch (e) { return; }

    bindings.forEach(function(binding) {
      if (binding.event !== domEvent.type) return;
      if (!evaluateConditions(binding.when)) return;
      (binding.do || []).forEach(function(effect) {
        executeEffect(effect, el);
      });
    });
  }

  // Register delegated event listeners for common events
  ['click', 'submit', 'input', 'change', 'focus', 'blur'].forEach(function(eventType) {
    document.addEventListener(eventType, handleCoreEvent, true);
  });

  // Hover events need special handling
  document.addEventListener('mouseenter', function(e) {
    var el = e.target.closest ? e.target.closest('[data-core-events]') : null;
    if (!el) return;
    var bindings;
    try { bindings = JSON.parse(el.getAttribute('data-core-events')); }
    catch (err) { return; }
    bindings.forEach(function(binding) {
      if (binding.event !== 'hover') return;
      if (!evaluateConditions(binding.when)) return;
      (binding.do || []).forEach(function(effect) { executeEffect(effect, el); });
    });
  }, true);

  // =========================================================================
  // Motion trigger evaluation
  // =========================================================================

  // onMount — run animations on page load
  document.querySelectorAll('[data-core-motion]').forEach(function(el) {
    var spec;
    try { spec = JSON.parse(el.getAttribute('data-core-motion')); } catch(e) { return; }
    if (!spec.trigger || spec.trigger === 'onMount') {
      applyMotion(el, spec);
    }
  });

  // onVisible — IntersectionObserver
  if (typeof IntersectionObserver !== 'undefined') {
    var visibleObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        var spec;
        try { spec = JSON.parse(entry.target.getAttribute('data-core-motion')); } catch(e) { return; }
        if (spec.trigger === 'onVisible') {
          applyMotion(entry.target, spec);
          visibleObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-core-motion]').forEach(function(el) {
      var spec;
      try { spec = JSON.parse(el.getAttribute('data-core-motion')); } catch(e) { return; }
      if (spec.trigger === 'onVisible') {
        visibleObserver.observe(el);
      }
    });
  }

  function applyMotion(el, spec) {
    if (spec.mode === 'preset') {
      el.classList.add('core-motion-' + spec.preset);
      if (spec.duration) el.style.animationDuration = spec.duration + 'ms';
      if (spec.delay) el.style.animationDelay = spec.delay + 'ms';
      if (spec.easing) el.style.animationTimingFunction = spec.easing;
    } else if (spec.mode === 'keyframes' && el.animate) {
      el.animate(spec.keyframes, {
        duration: spec.duration || 300,
        delay: spec.delay || 0,
        easing: spec.easing || 'ease',
        iterations: spec.iterations === 'infinite' ? Infinity : (spec.iterations || 1),
        fill: spec.fill || 'forwards'
      });
    }
  }

  // =========================================================================
  // Initial state sync
  // =========================================================================
  syncDOM();

})();`;
}
