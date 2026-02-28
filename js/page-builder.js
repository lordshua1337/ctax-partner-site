// --- Landing Page Builder (GrapesJS) ---
// Full drag-and-drop page builder powered by GrapesJS.
// Partners pick a stock design, then customize with blocks,
// device preview, style editing, and HTML export.

var PB_STORAGE_KEY = 'ctax_pb_gjs';
var PB_PAGES_KEY = 'ctax_pb_pages';
var pbEditor = null;
var pbPreviewActive = false;
var pbEditingSlug = null;

// PB_TEMPLATES, PB_ICONS, PB_SECTION_COLORS -- loaded from js/pb-templates.js
// PB_BLOCK_DEFS -- loaded from js/pb-blocks.js
// PB_COLOR_PRESETS, pbApplyColorPreset, pbBuildPresetSwatches -- loaded from js/pb-color-presets.js

// ══════════════════════════════════════════
//  Initialize editor
// ══════════════════════════════════════════
function pbInit() {
  var container = document.getElementById('gjs');
  if (!container || pbEditor) return;

  // Clear stale saves (one-time migration per version)
  if (!localStorage.getItem('ctax_pb_v3')) {
    localStorage.removeItem(PB_STORAGE_KEY);
    localStorage.setItem('ctax_pb_v3', '1');
  }

  // Load saved state or show template chooser for first visit
  var savedHtml = '';
  var savedCss = '';
  var isFirstVisit = false;
  try {
    var saved = localStorage.getItem(PB_STORAGE_KEY);
    if (saved) {
      var parsed = JSON.parse(saved);
      savedHtml = parsed.html || '';
      savedCss = parsed.css || '';
    }
  } catch (e) { /* no saved state */ }

  if (!savedHtml) {
    savedHtml = PB_TEMPLATES.referral.html;
    isFirstVisit = true;
  }

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
  });

  // Add custom blocks
  pbAddBlocks(pbEditor);

  // Auto-save on change
  pbEditor.on('change:changesCount', function() { pbSave(); });

  // Update block count
  pbEditor.on('component:add', pbUpdateCount);
  pbEditor.on('component:remove', pbUpdateCount);
  pbUpdateCount();

  // Keyboard shortcut for save
  pbEditor.Commands.add('pb:save', { run: function() { pbSave(); } });

  // Apply saved mode (guided/advanced)
  pbApplyMode(pbGetMode());

  // Apply saved color preset
  if (typeof pbRestorePreset === 'function') {
    pbRestorePreset();
  }

  // Auto-show template chooser on first visit
  if (isFirstVisit) {
    setTimeout(pbShowTemplates, 400);
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
  var fullHtml = '<!DOCTYPE html><html lang="en"><head>';
  fullHtml += '<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">';
  fullHtml += '<title>Preview</title>';
  fullHtml += '<style>' + presetCSS + '\n' + PB_CANVAS_CSS + '\n' + (css || '') + '</style>';
  fullHtml += '</head><body>' + html + '</body></html>';
  var win = window.open('', '_blank');
  if (win) {
    win.document.open();
    win.document.write(fullHtml);
    win.document.close();
  }
}

// Helper: inject canvas styles into the GrapesJS iframe
function pbInjectCanvasStyles() {
  if (!pbEditor) return;
  var frame = pbEditor.Canvas.getFrameEl();
  if (!frame) return;
  var doc = frame.contentDocument;
  if (!doc) return;
  if (doc.querySelector('style[data-pb-canvas]')) return;
  var links = doc.querySelectorAll('link[href*="pb-canvas"]');
  if (links.length > 0) return;
  var style = doc.createElement('style');
  style.setAttribute('data-pb-canvas', '1');
  style.textContent = PB_CANVAS_CSS;
  doc.head.appendChild(style);
}

// ══════════════════════════════════════════
//  Export HTML
// ══════════════════════════════════════════
function pbExportHTML() {
  if (!pbEditor) return;
  var html = pbEditor.getHtml();
  var css = pbEditor.getCss({ avoidProtected: true });

  var presetCSS = typeof pbGetPresetInlineCSS === 'function' ? pbGetPresetInlineCSS() : '';
  var fullHtml = '<!DOCTYPE html>\n<html lang="en">\n<head>\n';
  fullHtml += '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width,initial-scale=1.0">\n';
  fullHtml += '<title>My Landing Page</title>\n';
  fullHtml += '<style>\n' + presetCSS + '\n' + PB_CANVAS_CSS + '\n' + (css || '') + '\n</style>\n';
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

// Full-screen template chooser gallery
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
  var fullHtml = '<!DOCTYPE html><html lang="en"><head>';
  fullHtml += '<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">';
  fullHtml += '<style>' + presetCSS + '\n' + PB_CANVAS_CSS + '\n' + (css || '') + '</style>';
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
