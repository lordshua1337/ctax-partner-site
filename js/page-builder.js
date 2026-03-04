// --- Landing Page Builder (GrapesJS) ---
// Full drag-and-drop page builder powered by GrapesJS.
// Partners pick a stock design, then customize with blocks,
// device preview, style editing, and HTML export.

var PB_STORAGE_KEY = 'ctax_pb_gjs';
var PB_PAGES_KEY = 'ctax_pb_pages';
var pbEditor = null;
var pbPreviewActive = false;
var pbEditingSlug = null;

// PB_TEMPLATES, PB_ICONS, PB_SECTION_COLORS, PB_FONT_LINKS -- loaded from js/pb-templates.js
// PB_BLOCK_DEFS -- loaded from js/pb-blocks.js
// PB_THEMES, PB_ACCENT_COLORS -- loaded from js/pb-color-presets.js
// PB_COPY, PB_PERSONAS, pbApplyPersonaCopy -- loaded from js/pb-copy.js

// ══════════════════════════════════════════
//  Initialize editor
// ══════════════════════════════════════════
function pbInit() {
  var container = document.getElementById('gjs');
  if (!container || pbEditor) return;

  // Clear stale saves (one-time migration to v5 client-facing copy)
  if (!localStorage.getItem('ctax_pb_v5')) {
    localStorage.removeItem(PB_STORAGE_KEY);
    localStorage.removeItem('ctax_pb_v3');
    localStorage.removeItem('ctax_pb_v4');
    localStorage.removeItem('ctax_pb_persona');
    localStorage.removeItem('ctax_pb_theme');
    localStorage.removeItem('ctax_pb_accent');
    localStorage.setItem('ctax_pb_v5', '1');
  }

  // Restore previous session if partner has already onboarded
  var savedData = null;
  try {
    var raw = localStorage.getItem(PB_STORAGE_KEY);
    if (raw) savedData = JSON.parse(raw);
  } catch (e) { /* ignore corrupt data */ }
  var savedPersona = localStorage.getItem('ctax_pb_persona');
  var savedTheme = localStorage.getItem('ctax_pb_theme');
  var isFirstVisit = !savedPersona || !savedTheme || !savedData;
  var savedHtml = (savedData && savedData.html) ? savedData.html : PB_TEMPLATES.referral.html;
  var savedCss = (savedData && savedData.css) ? savedData.css : '';

  pbEditor = grapesjs.init({
    container: '#gjs',
    height: '100%',
    width: 'auto',
    components: savedHtml,
    style: savedCss,
    fromElement: false,
    storageManager: false,
    noticeOnUnload: false,
    canvas: {
      styles: ['/css/pb-canvas.css']
    },
    panels: { defaults: [] },
    deviceManager: {
      devices: [
        { id: 'desktop', name: 'Desktop', width: '' },
        { id: 'tablet', name: 'Tablet', width: '768px', widthMedia: '768px' },
        { id: 'mobile', name: 'Mobile', width: '375px', widthMedia: '480px' }
      ]
    },
    blockManager: {
      appendTo: '#pb-blocks',
      blocks: []
    },
    styleManager: {
      appendTo: '#pb-styles',
      sectors: [
        { name: 'Layout', open: true, buildProps: ['display', 'flex-direction', 'justify-content', 'align-items', 'flex-wrap', 'gap'] },
        { name: 'Dimension', open: false, buildProps: ['width', 'max-width', 'min-height', 'padding', 'margin'] },
        { name: 'Typography', open: false, buildProps: ['font-family', 'font-size', 'font-weight', 'color', 'line-height', 'text-align', 'letter-spacing'] },
        { name: 'Appearance', open: false, buildProps: ['background-color', 'background', 'border', 'border-radius', 'box-shadow', 'opacity'] }
      ]
    },
    selectorManager: { appendTo: '#pb-styles' },
    layerManager: { appendTo: '#pb-layers' }
  });

  // Ensure canvas styles are loaded (fallback: inject inline)
  pbEditor.on('canvas:frame:load', function() {
    pbInjectCanvasStyles();
    // Start countdown timers in the canvas
    pbStartCanvasCountdowns();
  });

  // Add custom blocks
  pbAddBlocks(pbEditor);

  // Auto-save on change
  pbEditor.on('change:changesCount', function() { pbSave(); });

  // Update block count + start countdowns on new blocks
  pbEditor.on('component:add', function() { pbUpdateCount(); setTimeout(pbStartCanvasCountdowns, 300); });
  pbEditor.on('component:remove', pbUpdateCount);
  pbUpdateCount();

  // Keyboard shortcut for save
  pbEditor.Commands.add('pb:save', { run: function() { pbSave(); } });

  // Keyboard shortcuts for undo/redo (Cmd+Z / Cmd+Shift+Z)
  document.addEventListener('keydown', function(e) {
    if (!pbEditor) return;
    if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
      if (e.shiftKey) {
        e.preventDefault();
        pbRedo();
      } else {
        e.preventDefault();
        pbUndo();
      }
    }
  });

  // Apply saved mode (guided/advanced)
  pbApplyMode(pbGetMode());

  // Apply saved theme
  if (typeof pbRestorePreset === 'function') {
    pbRestorePreset();
  }

  // Close theme panel on outside click
  document.addEventListener('click', function(e) {
    var panel = document.getElementById('pb-theme-panel');
    if (!panel || !panel.classList.contains('pb-theme-panel-open')) return;
    var wrap = e.target.closest('.pb-theme-wrap');
    if (!wrap) pbCloseThemePanel();
  });

  // Contextual color bar on component select
  pbEditor.on('component:selected', pbShowColorBar);
  pbEditor.on('component:deselected', pbHideColorBar);

  // Setup variant picker browse buttons on block categories
  setTimeout(pbSetupVariantPickers, 800);

  // Auto-show onboarding on first visit
  if (isFirstVisit) {
    setTimeout(pbShowOnboarding, 400);
  }
}

// ══════════════════════════════════════════
//  Block definitions
// ══════════════════════════════════════════
function pbAddBlocks(editor) {
  var bm = editor.Blocks;

  // Iterate PB_BLOCK_DEFS from pb-blocks.js
  if (typeof PB_BLOCK_DEFS !== 'undefined' && PB_BLOCK_DEFS.length > 0) {
    PB_BLOCK_DEFS.forEach(function(def) {
      var opts = {
        label: def.label,
        category: def.category,
        media: def.media,
        content: def.content
      };
      if (def.activate) opts.activate = true;
      if (def.select) opts.select = true;
      bm.add(def.id, opts);
    });
  }
}

// ══════════════════════════════════════════
//  Guided / Advanced mode
// ══════════════════════════════════════════
function pbGetMode() {
  return localStorage.getItem('ctax_pb_mode') || 'guided';
}

function pbSetMode(mode) {
  localStorage.setItem('ctax_pb_mode', mode);
  pbApplyMode(mode);
}

function pbApplyMode(mode) {
  // Toggle active class on mode buttons
  document.querySelectorAll('.pb-mode-btn').forEach(function(btn) {
    btn.classList.toggle('pb-mode-active', btn.getAttribute('data-mode') === mode);
  });

  // Guided: hide Styles and Layers tabs, force Blocks panel
  var stylesTab = document.querySelector('[data-panel="pb-styles"]');
  var layersTab = document.querySelector('[data-panel="pb-layers"]');

  if (mode === 'guided') {
    if (stylesTab) stylesTab.style.display = 'none';
    if (layersTab) layersTab.style.display = 'none';
    pbShowPanel('pb-blocks');
  } else {
    if (stylesTab) stylesTab.style.display = '';
    if (layersTab) layersTab.style.display = '';
  }
}

// ══════════════════════════════════════════
//  Utility functions
// ══════════════════════════════════════════
function pbSave() {
  if (!pbEditor) return;
  try {
    var data = {
      html: pbEditor.getHtml(),
      css: pbEditor.getCss({ avoidProtected: true })
    };
    localStorage.setItem(PB_STORAGE_KEY, JSON.stringify(data));
  } catch (e) { /* quota */ }
}

function pbUpdateCount() {
  var el = document.getElementById('pb-block-count');
  if (!el || !pbEditor) return;
  var wrapper = pbEditor.getWrapper();
  var count = wrapper ? wrapper.components().length : 0;
  el.textContent = count + ' section' + (count !== 1 ? 's' : '');
}

function pbSetDevice(device) {
  if (!pbEditor) return;
  pbEditor.setDevice(device);
  document.querySelectorAll('.pb-device-btn').forEach(function(btn) {
    btn.classList.toggle('pb-device-active', btn.getAttribute('data-device') === device);
  });
  // Phone frame for mobile preview
  var canvasArea = document.querySelector('.pb-canvas-area');
  if (canvasArea) {
    canvasArea.classList.toggle('pb-phone-frame', device === 'Mobile');
    canvasArea.classList.toggle('pb-tablet-frame', device === 'Tablet');
  }
}

function pbShowPanel(panel) {
  var panels = ['pb-blocks', 'pb-styles', 'pb-layers'];
  panels.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = (id === panel) ? 'block' : 'none';
  });
  document.querySelectorAll('.pb-panel-tab').forEach(function(btn) {
    btn.classList.toggle('pb-panel-tab-active', btn.getAttribute('data-panel') === panel);
  });
}

function pbUndo() {
  if (!pbEditor) return;
  pbEditor.UndoManager.undo();
}

function pbRedo() {
  if (!pbEditor) return;
  pbEditor.UndoManager.redo();
}

function pbPreview() {
  if (!pbEditor) return;
  var html = pbEditor.getHtml();
  var css = pbEditor.getCss({ avoidProtected: true });
  var presetCSS = typeof pbGetPresetInlineCSS === 'function' ? pbGetPresetInlineCSS() : '';
  var fontLinks = typeof PB_FONT_LINKS !== 'undefined' ? PB_FONT_LINKS : '';
  var fullHtml = '<!DOCTYPE html><html lang="en"><head>';
  fullHtml += '<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">';
  fullHtml += '<title>Preview</title>';
  fullHtml += fontLinks;
  fullHtml += '<style>' + PB_CANVAS_CSS + '\n' + presetCSS + '\n' + (css || '') + '</style>';
  fullHtml += '</head><body>' + html + '</body></html>';
  var win = window.open('', '_blank');
  if (win) {
    win.document.open();
    win.document.write(fullHtml);
    win.document.close();
  }
}

// Helper: inject canvas styles + fonts into the GrapesJS iframe
function pbInjectCanvasStyles() {
  if (!pbEditor) return;
  var frame = pbEditor.Canvas.getFrameEl();
  if (!frame) return;
  var doc = frame.contentDocument;
  if (!doc) return;

  // Inject font links if not already present
  if (!doc.querySelector('link[href*="DM+Sans"]')) {
    var fontHtml = typeof PB_FONT_LINKS !== 'undefined' ? PB_FONT_LINKS : '';
    if (fontHtml) {
      var temp = doc.createElement('div');
      temp.innerHTML = fontHtml;
      while (temp.firstChild) {
        doc.head.appendChild(temp.firstChild);
      }
    }
  }

  // Inject Playfair Display for boho theme
  var activeTheme = localStorage.getItem('ctax_pb_theme') || 'clean';
  if (activeTheme === 'warm' && !doc.querySelector('link[href*="Playfair+Display"]')) {
    var playfairLink = doc.createElement('link');
    playfairLink.rel = 'stylesheet';
    playfairLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap';
    doc.head.appendChild(playfairLink);
  }

  // Inject canvas styles if stylesheet link did not load
  if (doc.querySelector('style[data-pb-canvas]')) return;
  var links = doc.querySelectorAll('link[href*="pb-canvas"]');
  if (links.length > 0) return;
  if (typeof PB_CANVAS_CSS !== 'undefined' && PB_CANVAS_CSS) {
    var style = doc.createElement('style');
    style.setAttribute('data-pb-canvas', '1');
    style.textContent = PB_CANVAS_CSS;
    doc.head.appendChild(style);
  }
}

// ══════════════════════════════════════════
//  Export HTML
// ══════════════════════════════════════════
function pbExportHTML() {
  if (!pbEditor) return;
  var html = pbEditor.getHtml();
  var css = pbEditor.getCss({ avoidProtected: true });

  // Auto-append compliance footer if not present
  html = pbEnsureComplianceFooter(html);

  var presetCSS = typeof pbGetPresetInlineCSS === 'function' ? pbGetPresetInlineCSS() : '';
  var fontLinks = typeof PB_FONT_LINKS !== 'undefined' ? PB_FONT_LINKS : '';
  var fullHtml = '<!DOCTYPE html>\n<html lang="en">\n<head>\n';
  fullHtml += '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width,initial-scale=1.0">\n';
  fullHtml += '<title>My Landing Page</title>\n';
  fullHtml += fontLinks + '\n';
  fullHtml += '<style>\n' + PB_CANVAS_CSS + '\n' + presetCSS + '\n' + (css || '') + '\n</style>\n';
  fullHtml += '</head>\n<body>\n' + html + '\n</body>\n</html>';

  var blob = new Blob([fullHtml], { type: 'text/html' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'landing-page.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  if (typeof portalToast === 'function') portalToast('HTML exported', 'success');
}

// ══════════════════════════════════════════
//  Template system
// ══════════════════════════════════════════
function pbLoadTemplate(key) {
  if (!pbEditor || !PB_TEMPLATES[key]) return;
  var t = PB_TEMPLATES[key];
  pbEditor.setComponents(t.html);
  pbEditor.setStyle('');
  pbInjectCanvasStyles();
  pbSave();
  pbUpdateCount();

  // Lock compliance footer components after a short delay for DOM readiness
  setTimeout(function() {
    pbLockComplianceFooter();
  }, 500);

  if (typeof portalToast === 'function') portalToast(t.label + ' loaded', 'success');
}

function pbClearCanvas() {
  if (!pbEditor) return;
  pbEditor.setComponents('');
  pbEditor.setStyle('');
  pbSave();
  pbUpdateCount();
  if (typeof portalToast === 'function') portalToast('Canvas cleared', 'info');
}

// Build a visual mini-preview showing section blocks
function pbBuildPreview(sections) {
  var h = '<div class="pb-tpl-preview">';
  sections.forEach(function(name) {
    var bg = PB_SECTION_COLORS[name] || '#f3f4f6';
    var isDark = (bg === '#1f2937');
    var textColor = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)';
    h += '<div class="pb-tpl-preview-block" style="background:' + bg + ';color:' + textColor + '">';
    h += '<span>' + name + '</span>';
    h += '</div>';
  });
  h += '</div>';
  return h;
}

// ================================================================
//  Onboarding flow: persona -> template -> theme
// ================================================================
var pbOnboardState = { persona: 'cpa', template: 'leadcapture', theme: 'clean', accent: '', bohoPalette: 'desert' };

function pbShowOnboarding() {
  var existing = document.getElementById('pb-onboard-overlay');
  if (existing) existing.remove();

  pbOnboardState = { persona: 'cpa', template: 'leadcapture', theme: 'clean', accent: '', bohoPalette: 'desert' };

  var overlay = document.createElement('div');
  overlay.className = 'pb-tpl-overlay';
  overlay.id = 'pb-onboard-overlay';

  var modal = document.createElement('div');
  modal.className = 'pb-tpl-modal';
  modal.id = 'pb-onboard-modal';

  pbRenderOnboardStep(modal, 1);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function pbRenderOnboardStep(modal, step) {
  if (!modal) modal = document.getElementById('pb-onboard-modal');
  if (!modal) return;

  var h = '';

  if (step === 1) {
    // Step 1: Persona
    h += '<div class="pb-tpl-header">';
    h += '<div><div class="pb-tpl-title">What type of professional are you?</div>';
    h += '<div class="pb-tpl-subtitle">We will tailor the copy and messaging to your industry.</div></div>';
    h += '</div>';
    h += '<div class="pb-tpl-grid">';

    var personas = typeof PB_PERSONAS !== 'undefined' ? PB_PERSONAS : [];
    personas.forEach(function(p) {
      var active = p.id === pbOnboardState.persona ? ' pb-tpl-card-active' : '';
      h += '<div class="pb-tpl-card' + active + '" onclick="pbOnboardSelectPersona(\'' + p.id + '\')">';
      h += '<div class="pb-tpl-preview" style="display:flex;align-items:center;justify-content:center;font-size:40px;min-height:80px;background:var(--portal-bg-tertiary, #f1f5f9)">' + p.icon + '</div>';
      h += '<div class="pb-tpl-card-body" style="padding:12px">';
      h += '<div class="pb-tpl-card-name">' + p.label + '</div>';
      h += '<div class="pb-tpl-card-desc">' + p.desc + '</div>';
      h += '</div></div>';
    });

    h += '</div>';
    h += '<div class="pb-onboard-footer">';
    h += '<button class="pb-btn" onclick="pbRenderOnboardStep(null, 2)">Next: Choose Template</button>';
    h += '</div>';

  } else if (step === 2) {
    // Step 2: Template
    h += '<div class="pb-tpl-header">';
    h += '<div><div class="pb-tpl-title">What is the goal of your page?</div>';
    h += '<div class="pb-tpl-subtitle">Pick a template structure. You can change everything later.</div></div>';
    h += '<button class="pb-tpl-close" onclick="pbRenderOnboardStep(null, 1)" style="background:none;border:none;cursor:pointer;padding:8px">';
    h += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg> Back';
    h += '</button>';
    h += '</div>';
    h += '<div class="pb-tpl-grid">';

    var keys = Object.keys(PB_TEMPLATES);
    keys.forEach(function(key) {
      var t = PB_TEMPLATES[key];
      var iconSvg = PB_ICONS[t.icon] || PB_ICONS.funnel;
      var active = key === pbOnboardState.template ? ' pb-tpl-card-active' : '';
      h += '<div class="pb-tpl-card' + active + '" onclick="pbOnboardSelectTemplate(\'' + key + '\')">';
      h += pbBuildPreview(t.sections);
      h += '<div class="pb-tpl-card-body">';
      h += '<div class="pb-tpl-card-icon">' + iconSvg + '</div>';
      h += '<div class="pb-tpl-card-info">';
      h += '<div class="pb-tpl-card-name">' + t.label + '</div>';
      h += '<div class="pb-tpl-card-desc">' + t.desc + '</div>';
      h += '</div></div></div>';
    });

    h += '</div>';
    h += '<div class="pb-onboard-footer">';
    h += '<button class="pb-btn-secondary" onclick="pbRenderOnboardStep(null, 1)">Back</button>';
    h += '<button class="pb-btn" onclick="pbRenderOnboardStep(null, 3)">Next: Pick a Look</button>';
    h += '</div>';

  } else if (step === 3) {
    // Step 3: Theme + Accent
    h += '<div class="pb-tpl-header">';
    h += '<div><div class="pb-tpl-title">Pick a look</div>';
    h += '<div class="pb-tpl-subtitle">Choose a visual style and accent color for your page.</div></div>';
    h += '<button class="pb-tpl-close" onclick="pbRenderOnboardStep(null, 2)" style="background:none;border:none;cursor:pointer;padding:8px">';
    h += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg> Back';
    h += '</button>';
    h += '</div>';

    // Theme cards
    h += '<div class="pb-tp-themes" style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;padding:0 24px;margin-bottom:24px">';
    PB_THEMES.forEach(function(theme) {
      var active = theme.id === pbOnboardState.theme ? ' pb-tp-card-active' : '';
      // For warm theme, use the active boho palette preview colors
      var previewBg = theme.preview.bg;
      var previewHero = theme.preview.hero;
      var previewAccent = theme.preview.accent;
      if (theme.id === 'warm') {
        var bPal = pbGetBohoPalette(pbOnboardState.bohoPalette);
        previewBg = bPal.tokens['--pb-bg-0'];
        previewHero = bPal.hero.bg1;
        previewAccent = bPal.tokens['--pb-accent'];
      }
      h += '<button class="pb-tp-card' + active + '" onclick="pbOnboardSelectTheme(\'' + theme.id + '\')" style="text-align:center">';
      h += '<div class="pb-tp-card-preview">';
      h += '<div class="pb-tp-prev-bg" style="background:' + previewBg + '">';
      h += '<div class="pb-tp-prev-hero" style="background:' + previewHero + '"></div>';
      h += '<div class="pb-tp-prev-body">';
      var lineColor;
      if (theme.id === 'dark' || theme.id === 'patriot') {
        lineColor = 'rgba(255,255,255,0.1)';
      } else if (theme.id === 'warm') {
        lineColor = pbGetBohoPalette(pbOnboardState.bohoPalette).tokens['--pb-border'];
      } else {
        lineColor = '#e2e8f0';
      }
      h += '<div class="pb-tp-prev-line" style="background:' + lineColor + '"></div>';
      h += '<div class="pb-tp-prev-line pb-tp-prev-line-short" style="background:' + lineColor + '"></div>';
      h += '</div>';
      h += '<div class="pb-tp-prev-btn" style="background:' + previewAccent + '"></div>';
      h += '</div></div>';
      h += '<div class="pb-tp-card-label">' + theme.label + '</div>';
      h += '</button>';
    });
    h += '</div>';

    // Accent colors -- only for clean and dark themes
    var accentOk = (pbOnboardState.theme === 'clean' || pbOnboardState.theme === 'dark');
    if (accentOk) {
      h += '<div style="padding:0 24px;margin-bottom:24px">';
      h += '<div class="pb-tp-section-label" style="margin-bottom:8px">Accent Color</div>';
      h += '<div class="pb-tp-accents">';
      PB_ACCENT_COLORS.forEach(function(ac) {
        var active = ac.id === pbOnboardState.accent ? ' pb-tp-accent-active' : '';
        h += '<button class="pb-tp-accent' + active + '" style="background:' + ac.color + '" title="' + ac.label + '" onclick="pbOnboardSelectAccent(\'' + ac.id + '\')"></button>';
      });
      h += '</div></div>';
    }

    // Boho palette picker -- only for warm theme
    if (pbOnboardState.theme === 'warm') {
      h += '<div style="padding:0 24px;margin-bottom:24px">';
      h += '<div class="pb-tp-section-label" style="margin-bottom:8px">Color Palette</div>';
      h += '<div class="pb-boho-palettes" style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">';
      PB_BOHO_PALETTES.forEach(function(pal) {
        var active = pal.id === pbOnboardState.bohoPalette ? ' pb-boho-pal-active' : '';
        h += '<button class="pb-boho-pal' + active + '" onclick="pbOnboardSelectBohoPalette(\'' + pal.id + '\')">';
        h += '<div class="pb-boho-pal-swatches">';
        pal.swatch.forEach(function(color) {
          h += '<span class="pb-boho-swatch" style="background:' + color + '"></span>';
        });
        h += '</div>';
        h += '<div class="pb-boho-pal-label">' + pal.label + '</div>';
        h += '<div class="pb-boho-pal-desc">' + pal.desc + '</div>';
        h += '</button>';
      });
      h += '</div></div>';
    }

    h += '<div class="pb-onboard-footer">';
    h += '<button class="pb-btn-secondary" onclick="pbRenderOnboardStep(null, 2)">Back</button>';
    h += '<button class="pb-btn pb-btn-glow" onclick="pbOnboardBuild()">Build My Page</button>';
    h += '</div>';
  }

  modal.innerHTML = h;
}

function pbOnboardSelectPersona(id) {
  pbOnboardState.persona = id;
  pbRenderOnboardStep(null, 1);
}

function pbOnboardSelectTemplate(key) {
  pbOnboardState.template = key;
  pbRenderOnboardStep(null, 2);
}

function pbOnboardSelectTheme(id) {
  pbOnboardState.theme = id;
  // Reset accent when theme changes so the theme default is used
  pbOnboardState.accent = '';
  // Reset boho palette to default when switching to warm
  if (id === 'warm') {
    pbOnboardState.bohoPalette = pbOnboardState.bohoPalette || 'desert';
  }
  pbRenderOnboardStep(null, 3);
}

function pbOnboardSelectBohoPalette(id) {
  pbOnboardState.bohoPalette = id;
  pbRenderOnboardStep(null, 3);
}

function pbOnboardSelectAccent(id) {
  // Toggle: clicking same accent again deselects it (use theme default)
  pbOnboardState.accent = (pbOnboardState.accent === id) ? '' : id;
  pbRenderOnboardStep(null, 3);
}

function pbOnboardBuild() {
  // Apply selections
  localStorage.setItem('ctax_pb_theme', pbOnboardState.theme);
  // Only override accent if user explicitly picked one; otherwise use theme default
  if (pbOnboardState.accent) {
    localStorage.setItem('ctax_pb_accent', pbOnboardState.accent);
  } else {
    localStorage.removeItem('ctax_pb_accent');
  }
  // Save boho palette if warm theme is selected
  if (pbOnboardState.theme === 'warm') {
    localStorage.setItem('ctax_pb_boho_palette', pbOnboardState.bohoPalette || 'desert');
  }
  localStorage.setItem('ctax_pb_persona', pbOnboardState.persona);

  // Load template into canvas
  pbLoadTemplate(pbOnboardState.template);

  // Close overlay immediately so user sees the canvas
  var overlay = document.getElementById('pb-onboard-overlay');
  if (overlay) overlay.remove();

  // Apply theme + persona copy after canvas has settled
  // Use multiple attempts to handle GrapesJS frame reload timing
  var _applyCount = 0;
  function _applyThemeAndCopy() {
    _applyCount++;
    if (typeof pbApplyThemeToCanvas === 'function') {
      pbApplyThemeToCanvas();
    }
    if (typeof pbApplyPersonaCopy === 'function') {
      pbApplyPersonaCopy(pbOnboardState.persona);
    }
    // Re-apply once more after a delay to catch any frame reloads
    if (_applyCount < 3) {
      setTimeout(_applyThemeAndCopy, 500);
    }
  }
  setTimeout(_applyThemeAndCopy, 400);

  if (typeof portalToast === 'function') {
    portalToast('Page built! Start customizing.', 'success');
  }
}

// ══════════════════════════════════════════
//  Variant Picker Modal
// ══════════════════════════════════════════

// Group blocks by category for the variant picker
function pbGetBlocksByCategory() {
  if (typeof PB_BLOCK_DEFS === 'undefined') return {};
  var cats = {};
  PB_BLOCK_DEFS.forEach(function(def) {
    var cat = def.category || 'Other';
    if (!cats[cat]) cats[cat] = [];
    cats[cat].push(def);
  });
  return cats;
}

function pbShowVariantPicker(category) {
  var cats = pbGetBlocksByCategory();
  var variants = cats[category];
  if (!variants || variants.length === 0) return;

  // If only 1 variant, insert directly
  if (variants.length === 1) {
    pbInsertBlockContent(variants[0].content);
    return;
  }

  var existing = document.querySelector('.pb-variant-overlay');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.className = 'pb-variant-overlay pb-variant-open';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var modal = document.createElement('div');
  modal.className = 'pb-variant-modal';

  var h = '<div class="pb-variant-header">';
  h += '<h3>Choose a ' + category.replace(/s$/, '') + ' Style</h3>';
  h += '<button class="pb-variant-close" onclick="this.closest(\'.pb-variant-overlay\').remove()">';
  h += '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  h += '</button></div>';

  h += '<div class="pb-variant-grid">';
  variants.forEach(function(v) {
    // Strip category prefix from label for cleaner display
    var name = v.label.replace(/^[^:]+:\s*/, '') || v.label;
    h += '<div class="pb-variant-card" onclick="pbPickVariant(\'' + v.id + '\')">';
    h += '<div class="pb-variant-preview">' + (v.media || '') + '<div style="margin-top:4px">' + name + '</div></div>';
    h += '<div class="pb-variant-name">' + name + '</div>';
    h += '</div>';
  });
  h += '</div>';

  modal.innerHTML = h;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function pbPickVariant(blockId) {
  // Find the block definition
  if (typeof PB_BLOCK_DEFS === 'undefined') return;
  var def = null;
  for (var i = 0; i < PB_BLOCK_DEFS.length; i++) {
    if (PB_BLOCK_DEFS[i].id === blockId) { def = PB_BLOCK_DEFS[i]; break; }
  }
  if (!def) return;

  pbInsertBlockContent(def.content);

  // Close picker
  var overlay = document.querySelector('.pb-variant-overlay');
  if (overlay) overlay.remove();
}

function pbInsertBlockContent(html) {
  if (!window.pbEditor) return;
  var wrapper = window.pbEditor.getWrapper();
  if (!wrapper) return;
  wrapper.append(html);

  // Lock compliance footer if just inserted
  setTimeout(function() {
    if (typeof pbLockComplianceFooter === 'function') {
      pbLockComplianceFooter();
    }
  }, 200);
}

// Wire up category headings in the GrapesJS block sidebar
function pbSetupVariantPickers() {
  if (!window.pbEditor) return;
  var panels = window.pbEditor.Panels;
  // Listen for category titles being rendered in the blocks panel
  // Use MutationObserver on the blocks container
  var blocksEl = document.querySelector('#gjs .gjs-blocks-cs');
  if (!blocksEl) return;

  // Check periodically for category titles (GrapesJS renders them async)
  var attempts = 0;
  var checkInterval = setInterval(function() {
    attempts++;
    var catTitles = blocksEl.querySelectorAll('.gjs-block-category .gjs-title');
    if (catTitles.length > 0 || attempts > 20) {
      clearInterval(checkInterval);
      catTitles.forEach(function(titleEl) {
        var catName = titleEl.textContent.trim();
        // Add a "Browse Variants" button next to category title
        if (titleEl.querySelector('.pb-cat-browse')) return;
        var btn = document.createElement('span');
        btn.className = 'pb-cat-browse';
        btn.textContent = 'Browse';
        btn.style.cssText = 'margin-left:auto;font-size:10px;font-weight:600;color:#2563eb;cursor:pointer;padding:2px 6px;border-radius:4px;background:rgba(37,99,235,0.08)';
        btn.onclick = function(e) {
          e.stopPropagation();
          pbShowVariantPicker(catName);
        };
        titleEl.style.display = 'flex';
        titleEl.style.alignItems = 'center';
        titleEl.appendChild(btn);
      });
    }
  }, 300);
}

// Legacy: still show templates gallery when toolbar button is clicked
function pbShowTemplates() {
  var existing = document.getElementById('pb-template-overlay');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.className = 'pb-tpl-overlay';
  overlay.id = 'pb-template-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var modal = document.createElement('div');
  modal.className = 'pb-tpl-modal';

  var h = '<div class="pb-tpl-header">';
  h += '<div>';
  h += '<div class="pb-tpl-title">Choose a Design</div>';
  h += '<div class="pb-tpl-subtitle">Pick a starting point, then customize every section in the editor.</div>';
  h += '</div>';
  h += '<button class="pb-tpl-close" onclick="document.getElementById(\'pb-template-overlay\').remove()">';
  h += '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  h += '</button>';
  h += '</div>';
  h += '<div class="pb-tpl-grid">';

  var keys = Object.keys(PB_TEMPLATES);
  keys.forEach(function(key) {
    var t = PB_TEMPLATES[key];
    var iconSvg = PB_ICONS[t.icon] || PB_ICONS.funnel;
    h += '<div class="pb-tpl-card" onclick="pbLoadTemplate(\'' + key + '\');document.getElementById(\'pb-template-overlay\').remove();">';
    h += pbBuildPreview(t.sections);
    h += '<div class="pb-tpl-card-body">';
    h += '<div class="pb-tpl-card-icon">' + iconSvg + '</div>';
    h += '<div class="pb-tpl-card-info">';
    h += '<div class="pb-tpl-card-name">' + t.label + '</div>';
    h += '<div class="pb-tpl-card-desc">' + t.desc + '</div>';
    h += '</div>';
    h += '</div>';
    h += '</div>';
  });

  // Blank option
  h += '<div class="pb-tpl-card pb-tpl-card-blank" onclick="pbClearCanvas();document.getElementById(\'pb-template-overlay\').remove();">';
  h += '<div class="pb-tpl-preview pb-tpl-preview-blank"><div class="pb-tpl-preview-plus">' + PB_ICONS.blank + '</div></div>';
  h += '<div class="pb-tpl-card-body">';
  h += '<div class="pb-tpl-card-icon">' + PB_ICONS.blank + '</div>';
  h += '<div class="pb-tpl-card-info">';
  h += '<div class="pb-tpl-card-name">Blank Canvas</div>';
  h += '<div class="pb-tpl-card-desc">Start from scratch and build your own layout.</div>';
  h += '</div></div></div>';

  h += '</div>';
  modal.innerHTML = h;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

// ══════════════════════════════════════════
//  Published pages: localStorage data layer
// ══════════════════════════════════════════
function pbGetPages() {
  try {
    var raw = localStorage.getItem(PB_PAGES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function pbSetPages(pages) {
  try {
    localStorage.setItem(PB_PAGES_KEY, JSON.stringify(pages));
  } catch (e) { /* quota */ }
}

function pbFindPage(slug) {
  var pages = pbGetPages();
  for (var i = 0; i < pages.length; i++) {
    if (pages[i].slug === slug) return pages[i];
  }
  return null;
}

// ══════════════════════════════════════════
//  Publish flow
// ══════════════════════════════════════════
function pbOpenPublishModal() {
  if (!pbEditor) return;
  var modal = document.getElementById('pb-publish-modal');
  if (!modal) return;
  var slugInput = document.getElementById('pb-pub-slug');
  var titleInput = document.getElementById('pb-pub-title');
  var errEl = document.getElementById('pb-pub-error');
  if (errEl) errEl.textContent = '';
  // Pre-fill if editing an existing page
  if (pbEditingSlug) {
    var existing = pbFindPage(pbEditingSlug);
    if (existing) {
      if (slugInput) slugInput.value = existing.slug;
      if (titleInput) titleInput.value = existing.title;
    }
  } else {
    if (slugInput) slugInput.value = '';
    if (titleInput) titleInput.value = '';
  }
  modal.classList.add('pb-pub-modal-open');
}

function pbClosePublishModal() {
  var modal = document.getElementById('pb-publish-modal');
  if (modal) modal.classList.remove('pb-pub-modal-open');
}

// ── Bug Report ──
function pbShowBugReport() {
  var modal = document.getElementById('pb-bug-modal');
  if (!modal) return;
  var desc = document.getElementById('pb-bug-desc');
  var steps = document.getElementById('pb-bug-steps');
  var err = document.getElementById('pb-bug-error');
  var success = document.getElementById('pb-bug-success');
  if (desc) desc.value = '';
  if (steps) steps.value = '';
  if (err) err.textContent = '';
  if (success) success.style.display = 'none';
  modal.classList.add('pb-pub-modal-open');
}

function pbCloseBugReport() {
  var modal = document.getElementById('pb-bug-modal');
  if (modal) modal.classList.remove('pb-pub-modal-open');
}

function pbSubmitBugReport() {
  var desc = (document.getElementById('pb-bug-desc') || {}).value || '';
  var steps = (document.getElementById('pb-bug-steps') || {}).value || '';
  var err = document.getElementById('pb-bug-error');
  var success = document.getElementById('pb-bug-success');

  if (!desc.trim()) {
    if (err) err.textContent = 'Please describe the issue.';
    return;
  }
  if (err) err.textContent = '';

  // Store bug reports in localStorage for now
  var reports = [];
  try { reports = JSON.parse(localStorage.getItem('ctax_pb_bugs') || '[]'); } catch (e) {}
  reports.push({
    desc: desc.trim(),
    steps: steps.trim(),
    date: new Date().toISOString(),
    theme: localStorage.getItem('ctax_pb_theme') || '',
    persona: localStorage.getItem('ctax_pb_persona') || ''
  });
  localStorage.setItem('ctax_pb_bugs', JSON.stringify(reports));

  if (success) success.style.display = 'block';
  setTimeout(pbCloseBugReport, 1500);
}

function pbValidateSlug(slug) {
  if (!slug) return 'Slug is required.';
  if (slug.length < 2) return 'Slug must be at least 2 characters.';
  if (slug.length > 60) return 'Slug must be 60 characters or less.';
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return 'Slug can only contain lowercase letters, numbers, and hyphens.';
  }
  return null;
}

function pbPublish() {
  if (!pbEditor) return;
  var slugInput = document.getElementById('pb-pub-slug');
  var titleInput = document.getElementById('pb-pub-title');
  var errEl = document.getElementById('pb-pub-error');
  if (!slugInput || !titleInput) return;

  var slug = slugInput.value.trim().toLowerCase();
  var title = titleInput.value.trim() || slug;

  // Validate slug format
  var slugErr = pbValidateSlug(slug);
  if (slugErr) {
    if (errEl) errEl.textContent = slugErr;
    return;
  }

  // Publish validation (CTA + form required)
  var validation = pbValidateForPublish();
  if (!validation.valid) {
    if (errEl) errEl.textContent = validation.errors.join(' ');
    return;
  }

  // Show claims warnings (non-blocking)
  if (validation.warnings.length > 0) {
    var proceed = confirm('Claims warnings found:\n\n' + validation.warnings.join('\n') + '\n\nPublish anyway?');
    if (!proceed) return;
  }

  // Check duplicate (allow same slug when editing that slug)
  var pages = pbGetPages();
  var duplicate = false;
  for (var i = 0; i < pages.length; i++) {
    if (pages[i].slug === slug && slug !== pbEditingSlug) {
      duplicate = true;
      break;
    }
  }
  if (duplicate) {
    if (errEl) errEl.textContent = 'A page with this slug already exists.';
    return;
  }

  var html = pbEditor.getHtml();

  // Auto-append compliance footer if not present
  html = pbEnsureComplianceFooter(html);

  var css = pbEditor.getCss({ avoidProtected: true });
  var now = new Date().toISOString();

  // Build page object
  var page = {
    slug: slug,
    title: title,
    html: html,
    css: css,
    publishedAt: now,
    updatedAt: now
  };

  // Update existing or add new
  var found = false;
  var updatedPages = pages.map(function(p) {
    if (p.slug === pbEditingSlug || p.slug === slug) {
      found = true;
      return Object.assign({}, p, {
        slug: slug,
        title: title,
        html: html,
        css: css,
        updatedAt: now
      });
    }
    return p;
  });
  if (!found) {
    updatedPages = pages.concat([page]);
  }

  pbSetPages(updatedPages);
  pbEditingSlug = slug;
  pbClosePublishModal();
  if (typeof showToast === 'function') {
    showToast('Published! Live at #lp/' + slug, 'success');
  }
}

function pbUnpublish(slug) {
  var pages = pbGetPages();
  var filtered = pages.filter(function(p) { return p.slug !== slug; });
  pbSetPages(filtered);
  if (pbEditingSlug === slug) pbEditingSlug = null;
  if (typeof showToast === 'function') {
    showToast('Page unpublished', 'info');
  }
}

// ══════════════════════════════════════════
//  My Pages dashboard
// ══════════════════════════════════════════
function pbRenderMyPages() {
  var container = document.getElementById('pb-my-pages-grid');
  if (!container) return;
  var pages = pbGetPages();

  if (pages.length === 0) {
    container.innerHTML = '<div class="pb-mp-empty">' +
      '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>' +
      '<h3>No published pages yet</h3>' +
      '<p>Open the Page Builder, design your page, and click Publish to see it here.</p>' +
      '</div>';
    return;
  }

  var html = '';
  pages.forEach(function(page) {
    var date = new Date(page.publishedAt);
    var dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    // Build a mini HTML preview string (truncate for display)
    var previewHtml = '<!DOCTYPE html><html><head><style>' +
      'body{margin:0;font-family:sans-serif;transform-origin:top left;pointer-events:none}' +
      (page.css || '') + '</style></head><body>' +
      (page.html || '') + '</body></html>';

    html += '<div class="pb-mp-card">';
    html += '<div class="pb-mp-preview">';
    html += '<iframe class="pb-mp-iframe" srcdoc="' + pbEscapeAttr(previewHtml) + '" sandbox="allow-same-origin" tabindex="-1"></iframe>';
    html += '</div>';
    html += '<div class="pb-mp-info">';
    html += '<div class="pb-mp-title">' + pbEscapeHtml(page.title) + '</div>';
    html += '<div class="pb-mp-slug">#lp/' + pbEscapeHtml(page.slug) + '</div>';
    html += '<div class="pb-mp-date">Published ' + dateStr + '</div>';
    html += '</div>';
    html += '<div class="pb-mp-actions">';
    html += '<button class="pb-mp-btn" onclick="pbViewPage(\'' + pbEscapeAttr(page.slug) + '\')" title="View live page">';
    html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> View';
    html += '</button>';
    html += '<button class="pb-mp-btn" onclick="pbEditPage(\'' + pbEscapeAttr(page.slug) + '\')" title="Edit in builder">';
    html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Edit';
    html += '</button>';
    html += '<button class="pb-mp-btn" onclick="pbDuplicatePage(\'' + pbEscapeAttr(page.slug) + '\')" title="Duplicate page">';
    html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Duplicate';
    html += '</button>';
    html += '<button class="pb-mp-btn" onclick="pbCopyPageUrl(\'' + pbEscapeAttr(page.slug) + '\')" title="Copy live URL">';
    html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg> Copy URL';
    html += '</button>';
    html += '<button class="pb-mp-btn pb-mp-btn-danger" onclick="pbConfirmUnpublish(\'' + pbEscapeAttr(page.slug) + '\')" title="Unpublish">';
    html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg> Unpublish';
    html += '</button>';
    html += '</div>';
    html += '</div>';
  });
  container.innerHTML = html;
}

function pbViewPage(slug) {
  if (typeof showPage === 'function') {
    showPage('lp/' + slug);
  } else {
    window.location.hash = 'lp/' + slug;
  }
}

function pbEditPage(slug) {
  var page = pbFindPage(slug);
  if (!page) return;
  pbEditingSlug = slug;
  // Navigate to page builder section
  var nav = document.querySelector('[onclick*="portal-sec-page-builder"]');
  if (nav) {
    portalNav(nav, 'portal-sec-page-builder');
  }
  // Load the page content into the editor after init
  setTimeout(function() {
    pbLoadFromSlug(slug);
  }, 500);
}

function pbLoadFromSlug(slug) {
  if (!pbEditor) return;
  var page = pbFindPage(slug);
  if (!page) return;
  pbEditor.setComponents(page.html || '');
  pbEditor.setStyle(page.css || '');
  pbInjectCanvasStyles();
  pbSave();
  pbUpdateCount();
  pbEditingSlug = slug;
  if (typeof showToast === 'function') {
    showToast('Editing: ' + page.title, 'info');
  }
}

function pbConfirmUnpublish(slug) {
  if (confirm('Unpublish "' + slug + '"? This removes the live page.')) {
    pbUnpublish(slug);
    pbRenderMyPages();
  }
}

function pbDuplicatePage(slug) {
  var page = pbFindPage(slug);
  if (!page) return;
  var pages = pbGetPages();
  var newSlug = slug + '-copy';
  var counter = 1;
  while (pages.some(function(p) { return p.slug === newSlug; })) {
    counter++;
    newSlug = slug + '-copy-' + counter;
  }
  var now = new Date().toISOString();
  var newPage = {
    slug: newSlug,
    title: page.title + ' (Copy)',
    html: page.html,
    css: page.css,
    publishedAt: now,
    updatedAt: now
  };
  pbSetPages(pages.concat([newPage]));
  pbRenderMyPages();
  if (typeof showToast === 'function') {
    showToast('Duplicated as "' + newSlug + '"', 'success');
  }
}

function pbCopyPageUrl(slug) {
  var url = window.location.origin + window.location.pathname + '#lp/' + slug;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(function() {
      if (typeof showToast === 'function') {
        showToast('URL copied to clipboard', 'success');
      }
    }).catch(function() {
      pbFallbackCopyText(url);
    });
  } else {
    pbFallbackCopyText(url);
  }
}

function pbFallbackCopyText(text) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch (e) { /* ignore */ }
  document.body.removeChild(ta);
  if (typeof showToast === 'function') {
    showToast('URL copied to clipboard', 'success');
  }
}

// ══════════════════════════════════════════
//  Split-pane real-time preview
// ══════════════════════════════════════════
function pbTogglePreview() {
  pbPreviewActive = !pbPreviewActive;
  var body = document.querySelector('.pb-body');
  var pane = document.getElementById('pb-preview-pane');
  var btn = document.getElementById('pb-preview-toggle');

  if (!body || !pane) return;

  if (pbPreviewActive) {
    body.classList.add('pb-body-split');
    pane.style.display = 'flex';
    if (btn) btn.classList.add('pb-tool-btn-active');
    pbUpdatePreview();
    // Listen for changes
    if (pbEditor) {
      pbEditor.on('change:changesCount', pbUpdatePreview);
      pbEditor.on('component:update', pbUpdatePreview);
    }
  } else {
    body.classList.remove('pb-body-split');
    pane.style.display = 'none';
    if (btn) btn.classList.remove('pb-tool-btn-active');
    if (pbEditor) {
      pbEditor.off('change:changesCount', pbUpdatePreview);
      pbEditor.off('component:update', pbUpdatePreview);
    }
  }
}

function pbUpdatePreview() {
  if (!pbEditor || !pbPreviewActive) return;
  var iframe = document.getElementById('pb-preview-iframe');
  if (!iframe) return;

  var html = pbEditor.getHtml();
  var css = pbEditor.getCss({ avoidProtected: true });
  var presetCSS = typeof pbGetPresetInlineCSS === 'function' ? pbGetPresetInlineCSS() : '';
  var fontLinks = typeof PB_FONT_LINKS !== 'undefined' ? PB_FONT_LINKS : '';
  var fullHtml = '<!DOCTYPE html><html lang="en"><head>';
  fullHtml += '<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">';
  fullHtml += fontLinks;
  fullHtml += '<style>' + PB_CANVAS_CSS + '\n' + presetCSS + '\n' + (css || '') + '</style>';
  fullHtml += '</head><body>' + html + '</body></html>';
  iframe.srcdoc = fullHtml;
}

// ══════════════════════════════════════════
//  Helpers
// ══════════════════════════════════════════
function pbEscapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function pbEscapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ══════════════════════════════════════════
//  Contextual Color Bar
// ══════════════════════════════════════════

var PB_TEXT_COLORS = [
  { color: '#111827', label: 'Black' },
  { color: '#ffffff', label: 'White' },
  { color: '#1e3a5f', label: 'Navy' },
  { color: '#475569', label: 'Slate' },
  { color: '#2563eb', label: 'Blue' }
];

var PB_BTN_COLORS = [
  { color: '#2563eb', label: 'Blue' },
  { color: '#dc2626', label: 'Red' },
  { color: '#16a34a', label: 'Green' },
  { color: '#1e3a5f', label: 'Navy' },
  { color: '#ea580c', label: 'Orange' }
];

var PB_BG_COLORS = [
  { color: '#ffffff', label: 'White' },
  { color: '#f8fafc', label: 'Light Gray' },
  { color: '#111827', label: 'Dark' },
  { color: '#1e3a5f', label: 'Navy' },
  { color: '#0f172a', label: 'Midnight' }
];

// Detect what kind of element is selected
function pbGetColorContext(component) {
  if (!component) return null;
  var tag = (component.get('tagName') || '').toLowerCase();
  var classes = component.getClasses ? component.getClasses().join(' ') : '';

  // Buttons
  if (tag === 'button' || tag === 'a' && classes.indexOf('pb-btn') !== -1) {
    return 'button';
  }
  if (classes.indexOf('pb-btn') !== -1) {
    return 'button';
  }

  // Text elements
  if (['h1','h2','h3','h4','h5','h6','p','span','li','strong','em','blockquote','cite','label'].indexOf(tag) !== -1) {
    return 'text';
  }

  // Sections / divs with background potential
  if (tag === 'div' || tag === 'section') {
    return 'section';
  }

  return null;
}

function pbShowColorBar(component) {
  var bar = document.getElementById('pb-color-bar');
  if (!bar) return;

  // Image tools (background removal)
  if (pbShowImageTools(component)) {
    var h = '<div class="pb-cb-row">';
    h += '<span class="pb-cb-label">Image Tools</span>';
    h += '<div class="pb-cb-swatches">';
    h += '<button class="pb-cb-img-btn" onclick="pbRemoveBackground(pbEditor.getSelected())" title="Remove background from this image">';
    h += '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/></svg>';
    h += ' Remove Background';
    h += '</button>';
    h += '</div></div>';
    bar.innerHTML = h;
    bar.classList.add('pb-color-bar-open');
    return;
  }

  var context = pbGetColorContext(component);
  if (!context) {
    pbHideColorBar();
    return;
  }

  var h = '';

  if (context === 'text') {
    h += pbBuildColorRow('Text Color', 'color', PB_TEXT_COLORS, component);
  } else if (context === 'button') {
    h += pbBuildColorRow('Button Color', 'background-color', PB_BTN_COLORS, component);
    h += pbBuildColorRow('Text Color', 'color', PB_TEXT_COLORS, component);
  } else if (context === 'section') {
    h += pbBuildColorRow('Background', 'background-color', PB_BG_COLORS, component);
    h += pbBuildColorRow('Text Color', 'color', PB_TEXT_COLORS, component);
  }

  bar.innerHTML = h;
  bar.classList.add('pb-color-bar-open');
}

function pbHideColorBar() {
  var bar = document.getElementById('pb-color-bar');
  if (bar) {
    bar.classList.remove('pb-color-bar-open');
  }
}

function pbBuildColorRow(label, cssProp, presets, component) {
  // Get current value from the component
  var current = '';
  if (component && component.getStyle) {
    current = component.getStyle()[cssProp] || '';
  }

  var h = '<div class="pb-cb-row">';
  h += '<span class="pb-cb-label">' + label + '</span>';
  h += '<div class="pb-cb-swatches">';

  presets.forEach(function(p) {
    var active = (current && pbNormalizeColor(current) === pbNormalizeColor(p.color)) ? ' pb-cb-swatch-active' : '';
    var border = (p.color === '#ffffff' || p.color === '#f8fafc') ? ';border-color:rgba(0,0,0,0.15)' : '';
    h += '<button class="pb-cb-swatch' + active + '" ';
    h += 'style="background:' + p.color + border + '" ';
    h += 'title="' + p.label + '" ';
    h += 'onclick="pbApplyColor(\'' + cssProp + '\',\'' + p.color + '\')"></button>';
  });

  // Custom hex input
  h += '<label class="pb-cb-custom" title="Custom color">';
  h += '<input type="color" class="pb-cb-color-input" value="' + (current || '#000000') + '" ';
  h += 'onchange="pbApplyColor(\'' + cssProp + '\',this.value)">';
  h += '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.71 5.63l-2.34-2.34a1 1 0 00-1.41 0l-14 14V21h3.71l14-14a1 1 0 000-1.41z"/></svg>';
  h += '</label>';

  h += '</div>';
  h += '</div>';
  return h;
}

function pbApplyColor(cssProp, color) {
  if (!pbEditor) return;
  var selected = pbEditor.getSelected();
  if (!selected) return;

  var style = Object.assign({}, selected.getStyle());
  style[cssProp] = color;
  selected.setStyle(style);
  pbSave();

  // Refresh the color bar to show active state
  pbShowColorBar(selected);
}

// Normalize color for comparison (handles rgb vs hex)
function pbNormalizeColor(color) {
  if (!color) return '';
  color = color.trim().toLowerCase();
  // If it's already hex, return it
  if (color.charAt(0) === '#') return color;
  // Try to parse rgb(r,g,b)
  var match = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
  if (match) {
    var r = parseInt(match[1]).toString(16).padStart(2, '0');
    var g = parseInt(match[2]).toString(16).padStart(2, '0');
    var b = parseInt(match[3]).toString(16).padStart(2, '0');
    return '#' + r + g + b;
  }
  return color;
}

// ══════════════════════════════════════════
//  Countdown timer for canvas preview
// ══════════════════════════════════════════
function pbStartCanvasCountdowns() {
  if (!pbEditor) return;
  var frame = pbEditor.Canvas.getFrameEl();
  if (!frame || !frame.contentDocument) return;
  var doc = frame.contentDocument;
  var els = doc.querySelectorAll('.pb-countdown');
  els.forEach(function(el) {
    var hours = parseInt(el.getAttribute('data-pb-hours')) || 48;
    var end = Date.now() + hours * 3600000;
    function tick() {
      var left = Math.max(0, end - Date.now());
      var d = Math.floor(left / 86400000);
      var h = Math.floor((left % 86400000) / 3600000);
      var m = Math.floor((left % 3600000) / 60000);
      var s = Math.floor((left % 60000) / 1000);
      var dn = el.querySelector('[data-pb-unit="days"]');
      var hn = el.querySelector('[data-pb-unit="hours"]');
      var mn = el.querySelector('[data-pb-unit="minutes"]');
      var sn = el.querySelector('[data-pb-unit="seconds"]');
      if (dn) dn.textContent = String(d).padStart(2, '0');
      if (hn) hn.textContent = String(h).padStart(2, '0');
      if (mn) mn.textContent = String(m).padStart(2, '0');
      if (sn) sn.textContent = String(s).padStart(2, '0');
      if (left > 0) requestAnimationFrame(tick);
    }
    tick();
  });
}

// ══════════════════════════════════════════
//  Start fresh (re-run onboarding wizard)
// ══════════════════════════════════════════
function pbStartFresh() {
  if (pbEditor) {
    var wrapper = pbEditor.getWrapper();
    var hasContent = wrapper && wrapper.components().length > 0;
    if (hasContent && !confirm('Start a new page? Current unsaved work will be lost.')) {
      return;
    }
  }
  localStorage.removeItem(PB_STORAGE_KEY);
  localStorage.removeItem('ctax_pb_persona');
  localStorage.removeItem('ctax_pb_theme');
  localStorage.removeItem('ctax_pb_accent');
  localStorage.removeItem('ctax_pb_boho_palette');
  pbEditingSlug = null;
  pbShowOnboarding();
}

// ══════════════════════════════════════════
//  Background Removal (Canvas API)
// ══════════════════════════════════════════

function pbRemoveBackground(component) {
  if (!component) return;
  var src = component.get('src') || (component.getAttributes && component.getAttributes().src);
  if (!src) {
    if (typeof showToast === 'function') showToast('Select an image first', 'info');
    return;
  }

  // Show processing state
  if (typeof showToast === 'function') showToast('Removing background...', 'info');

  var img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function() {
    try {
      var canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var data = imageData.data;

      // Sample corners to detect background color
      var samples = [];
      var w = canvas.width;
      var h = canvas.height;
      var samplePoints = [
        [0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1],
        [Math.floor(w * 0.1), 0], [Math.floor(w * 0.9), 0],
        [0, Math.floor(h * 0.1)], [w - 1, Math.floor(h * 0.1)]
      ];

      samplePoints.forEach(function(pt) {
        var idx = (pt[1] * w + pt[0]) * 4;
        samples.push([data[idx], data[idx + 1], data[idx + 2]]);
      });

      // Average the corner samples for background color
      var bgR = 0, bgG = 0, bgB = 0;
      samples.forEach(function(s) { bgR += s[0]; bgG += s[1]; bgB += s[2]; });
      bgR = Math.round(bgR / samples.length);
      bgG = Math.round(bgG / samples.length);
      bgB = Math.round(bgB / samples.length);

      // Remove pixels similar to background (tolerance-based)
      var tolerance = 40;
      for (var i = 0; i < data.length; i += 4) {
        var dr = Math.abs(data[i] - bgR);
        var dg = Math.abs(data[i + 1] - bgG);
        var db = Math.abs(data[i + 2] - bgB);
        var distance = Math.sqrt(dr * dr + dg * dg + db * db);
        if (distance < tolerance) {
          data[i + 3] = 0; // fully transparent
        } else if (distance < tolerance * 1.5) {
          // Feather edges for smoother result
          var alpha = Math.round(((distance - tolerance) / (tolerance * 0.5)) * 255);
          data[i + 3] = Math.min(data[i + 3], alpha);
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Convert to data URL and update the component
      var newSrc = canvas.toDataURL('image/png');
      component.set('src', newSrc);
      if (component.addAttributes) {
        component.addAttributes({ src: newSrc });
      }
      pbSave();
      if (typeof showToast === 'function') showToast('Background removed', 'success');
    } catch (e) {
      if (typeof showToast === 'function') showToast('Could not remove background -- image may be cross-origin', 'error');
    }
  };
  img.onerror = function() {
    if (typeof showToast === 'function') showToast('Could not load image for processing', 'error');
  };
  img.src = src;
}

// Show background removal button when image is selected
function pbShowImageTools(component) {
  if (!component) return false;
  var tag = (component.get('tagName') || '').toLowerCase();
  var type = component.get('type') || '';
  if (tag !== 'img' && type !== 'image') return false;
  return true;
}

// ══════════════════════════════════════════
//  Exit builder (back to portal dashboard)
// ══════════════════════════════════════════
function pbExitBuilder() {
  var nav = document.querySelector('[onclick*="portal-sec-dashboard"]');
  if (nav && typeof portalNav === 'function') {
    portalNav(nav, 'portal-sec-dashboard');
  }
}

// ══════════════════════════════════════════
//  Preview as live page
// ══════════════════════════════════════════
// Auto-publishes to a preview slot, exits the builder,
// navigates to My Pages, then opens the live viewer.
function pbPreviewLive() {
  if (!pbEditor) return;

  var slug = pbEditingSlug || '_preview';
  var title = 'Preview';

  // If editing a named page, use its title
  if (pbEditingSlug) {
    var existing = pbFindPage(pbEditingSlug);
    if (existing) title = existing.title;
  }

  // Save current canvas to the page slot
  var html = pbEditor.getHtml();
  var css = pbEditor.getCss({ avoidProtected: true });
  var now = new Date().toISOString();
  var pages = pbGetPages();

  var page = {
    slug: slug,
    title: title,
    html: html,
    css: css,
    publishedAt: now,
    updatedAt: now
  };

  // Update existing or add new
  var found = false;
  var updatedPages = pages.map(function(p) {
    if (p.slug === slug) {
      found = true;
      return Object.assign({}, p, { html: html, css: css, updatedAt: now });
    }
    return p;
  });
  if (!found) {
    updatedPages = pages.concat([page]);
  }
  pbSetPages(updatedPages);

  // Navigate to the live page viewer (exits immersive mode automatically)
  if (typeof showPage === 'function') {
    showPage('lp/' + slug);
  }
}

// ══════════════════════════════════════════
//  Compliance Footer (auto-append + locked)
// ══════════════════════════════════════════

var PB_COMPLIANCE_HTML = [
  '<section class="pb-compliance-footer" data-pb-locked="true">',
  '  <p>This page is published by an independent referral partner, not an employee or affiliate of Community Tax or the IRS.</p>',
  '  <p>Results vary based on individual circumstances. No specific outcome is guaranteed.</p>',
  '  <p>Community Tax is a licensed tax resolution firm. See ctax.com/disclosures for details.</p>',
  '</section>'
].join('\n');

// Ensure compliance footer exists in the HTML string
function pbEnsureComplianceFooter(html) {
  if (!html) return html;
  if (html.indexOf('pb-compliance-footer') !== -1) return html;
  return html + '\n' + PB_COMPLIANCE_HTML;
}

// Lock compliance footer components (prevent deletion in GrapesJS)
function pbLockComplianceFooter() {
  if (!pbEditor) return;
  var wrapper = pbEditor.getWrapper();
  if (!wrapper) return;

  wrapper.components().forEach(function(comp) {
    var el = comp.getEl();
    if (el && el.getAttribute && el.getAttribute('data-pb-locked') === 'true') {
      comp.set('removable', false);
      comp.set('copyable', false);
      comp.set('draggable', false);
      comp.set('badgable', true);
      comp.set('layerable', true);
    }
  });
}


// ══════════════════════════════════════════
//  Claims Validator
// ══════════════════════════════════════════

var PB_RED_FLAG_PATTERNS = [
  { pattern: /settle\s+for\s+pennies/i, msg: '"Settle for pennies" -- potentially misleading claim.' },
  { pattern: /pennies\s+on\s+the\s+dollar/i, msg: '"Pennies on the dollar" -- potentially misleading claim.' },
  { pattern: /guaranteed\s+(results?|resolution|outcome)/i, msg: '"Guaranteed results" -- no outcome can be guaranteed.' },
  { pattern: /guarantee[ds]?\s+.{0,20}(results?|resolution|outcome)/i, msg: 'Guarantee language near results -- no outcome can be guaranteed.' },
  { pattern: /irs\s+(agent|officer|representative)/i, msg: 'Language that may imply IRS affiliation.' },
  { pattern: /affiliated?\s+with\s+the\s+irs/i, msg: 'IRS affiliation claim -- partners are not IRS affiliates.' },
  { pattern: /eliminat(e|ing)\s+(your\s+)?debt/i, msg: '"Eliminate debt" -- potentially misleading.' },
  { pattern: /wipe\s+out/i, msg: '"Wipe out" -- potentially misleading language.' },
  { pattern: /erase\s+(your\s+)?(tax\s+)?debt/i, msg: '"Erase debt" -- potentially misleading.' }
];

function pbScanClaims(html) {
  var warnings = [];
  PB_RED_FLAG_PATTERNS.forEach(function(rule) {
    if (rule.pattern.test(html)) {
      warnings.push(rule.msg);
    }
  });
  return warnings;
}


// ══════════════════════════════════════════
//  Publish Validation
// ══════════════════════════════════════════

function pbValidateForPublish() {
  if (!pbEditor) return { valid: true, warnings: [], errors: [] };
  var html = pbEditor.getHtml();
  var errors = [];
  var warnings = [];

  // Check for at least one CTA button
  if (html.indexOf('pb-btn') === -1) {
    errors.push('Page has no CTA button. Add at least one call-to-action.');
  }

  // Check for at least one form
  if (html.indexOf('<form') === -1 && html.indexOf('pb-form') === -1) {
    errors.push('Page has no lead capture form. Add at least one form.');
  }

  // Scan for red-flag claims
  var claimWarnings = pbScanClaims(html);
  warnings = warnings.concat(claimWarnings);

  return { valid: errors.length === 0, warnings: warnings, errors: errors };
}


// ══════════════════════════════════════════
//  Lifecycle
// ══════════════════════════════════════════
function pbDestroy() {
  if (pbEditor) {
    pbSave();
    pbEditor.destroy();
    pbEditor = null;
  }
  pbPreviewActive = false;
}
