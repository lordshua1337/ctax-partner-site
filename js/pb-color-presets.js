// -- Page Builder: Theme System --
// Semantic token flipping. Each theme re-declares --pb-* tokens on :root.
// No per-selector overrides needed because all blocks reference tokens.

var PB_THEMES = [
  {
    id: 'clean',
    label: 'Clean Light',
    desc: 'Light, minimal, and professional',
    preview: { bg: '#ffffff', hero: '#f8fafc', accent: '#0B5FD8' },
    tokens: {
      '--pb-bg-0': '#ffffff',
      '--pb-bg-1': '#f8fafc',
      '--pb-bg-2': '#f1f5f9',
      '--pb-bg-3': '#e2e8f0',
      '--pb-text-0': '#0f172a',
      '--pb-text-1': '#475569',
      '--pb-text-2': '#94a3b8',
      '--pb-border': '#e2e8f0',
      '--pb-border-subtle': '#f1f5f9',
      '--pb-accent': '#0B5FD8',
      '--pb-accent-hover': '#1470f0',
      '--pb-accent-soft': 'rgba(11, 95, 216, 0.08)',
      '--pb-accent-glow': 'rgba(11, 95, 216, 0.28)',
      '--pb-shadow-sm': '0 1px 2px rgba(0,0,0,0.04)',
      '--pb-shadow-md': '0 4px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
      '--pb-shadow-lg': '0 12px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
      '--pb-shadow-xl': '0 24px 80px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.04)',
      '--pb-glass-bg': 'rgba(255, 255, 255, 0.8)',
      '--pb-glass-border': 'rgba(255, 255, 255, 0.2)'
    }
  },
  {
    id: 'dark',
    label: 'Dark Mode',
    desc: 'Sleek dark background, high contrast',
    preview: { bg: '#0c1220', hero: '#111827', accent: '#3b82f6' },
    tokens: {
      '--pb-bg-0': '#0c1220',
      '--pb-bg-1': '#111827',
      '--pb-bg-2': '#1a2234',
      '--pb-bg-3': '#243044',
      '--pb-text-0': '#e8ecf2',
      '--pb-text-1': '#b0b8cc',
      '--pb-text-2': '#7889a4',
      '--pb-border': 'rgba(255,255,255,0.08)',
      '--pb-border-subtle': 'rgba(255,255,255,0.04)',
      '--pb-accent': '#3b82f6',
      '--pb-accent-hover': '#60a5fa',
      '--pb-accent-soft': 'rgba(59, 130, 246, 0.12)',
      '--pb-accent-glow': 'rgba(59, 130, 246, 0.35)',
      '--pb-shadow-sm': '0 1px 2px rgba(0,0,0,0.2)',
      '--pb-shadow-md': '0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)',
      '--pb-shadow-lg': '0 12px 40px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.2)',
      '--pb-shadow-xl': '0 24px 80px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.2)',
      '--pb-glass-bg': 'rgba(0, 0, 0, 0.4)',
      '--pb-glass-border': 'rgba(255, 255, 255, 0.06)'
    }
  },
  {
    id: 'patriot',
    label: 'Patriot',
    desc: 'Navy and red -- IRS authority feel',
    preview: { bg: '#0A1628', hero: '#112244', accent: '#dc2626' },
    tokens: {
      '--pb-bg-0': '#0A1628',
      '--pb-bg-1': '#112244',
      '--pb-bg-2': '#1a3160',
      '--pb-bg-3': '#244080',
      '--pb-text-0': '#e8ecf2',
      '--pb-text-1': '#b0b8cc',
      '--pb-text-2': '#7889a4',
      '--pb-border': 'rgba(255,255,255,0.08)',
      '--pb-border-subtle': 'rgba(255,255,255,0.04)',
      '--pb-accent': '#dc2626',
      '--pb-accent-hover': '#ef4444',
      '--pb-accent-soft': 'rgba(220, 38, 38, 0.12)',
      '--pb-accent-glow': 'rgba(220, 38, 38, 0.35)',
      '--pb-shadow-sm': '0 1px 2px rgba(0,0,0,0.2)',
      '--pb-shadow-md': '0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)',
      '--pb-shadow-lg': '0 12px 40px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.2)',
      '--pb-shadow-xl': '0 24px 80px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.2)',
      '--pb-glass-bg': 'rgba(0, 0, 0, 0.4)',
      '--pb-glass-border': 'rgba(255, 255, 255, 0.06)'
    }
  },
  {
    id: 'warm',
    label: 'Warm Earth',
    desc: 'Earthy tones, approachable feel',
    preview: { bg: '#faf8f5', hero: '#f5f0e8', accent: '#b45309' },
    tokens: {
      '--pb-bg-0': '#faf8f5',
      '--pb-bg-1': '#f5f0e8',
      '--pb-bg-2': '#ede5d8',
      '--pb-bg-3': '#e0d5c4',
      '--pb-text-0': '#1c1512',
      '--pb-text-1': '#6b5e52',
      '--pb-text-2': '#9a8e82',
      '--pb-border': '#e0d5c4',
      '--pb-border-subtle': '#ede5d8',
      '--pb-accent': '#b45309',
      '--pb-accent-hover': '#d97706',
      '--pb-accent-soft': 'rgba(180, 83, 9, 0.08)',
      '--pb-accent-glow': 'rgba(180, 83, 9, 0.28)',
      '--pb-shadow-sm': '0 1px 2px rgba(0,0,0,0.04)',
      '--pb-shadow-md': '0 4px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
      '--pb-shadow-lg': '0 12px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
      '--pb-shadow-xl': '0 24px 80px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.04)',
      '--pb-glass-bg': 'rgba(255, 255, 255, 0.8)',
      '--pb-glass-border': 'rgba(255, 255, 255, 0.2)'
    }
  }
];

// Accent color palette -- user picks one to override accent tokens
var PB_ACCENT_COLORS = [
  { id: 'blue',   color: '#0B5FD8', hover: '#1470f0', label: 'Blue' },
  { id: 'red',    color: '#dc2626', hover: '#ef4444', label: 'Red' },
  { id: 'green',  color: '#16a34a', hover: '#22c55e', label: 'Green' },
  { id: 'orange', color: '#ea580c', hover: '#f97316', label: 'Orange' },
  { id: 'purple', color: '#7c3aed', hover: '#8b5cf6', label: 'Purple' },
  { id: 'teal',   color: '#0d9488', hover: '#14b8a6', label: 'Teal' },
  { id: 'pink',   color: '#db2777', hover: '#ec4899', label: 'Pink' },
  { id: 'slate',  color: '#475569', hover: '#64748b', label: 'Slate' }
];


// ================================================================
//  Theme panel UI
// ================================================================
function pbToggleThemePanel() {
  var panel = document.getElementById('pb-theme-panel');
  if (!panel) return;
  var isOpen = panel.classList.contains('pb-theme-panel-open');
  if (isOpen) {
    panel.classList.remove('pb-theme-panel-open');
    return;
  }
  pbBuildThemePanel();
  panel.classList.add('pb-theme-panel-open');
}

function pbCloseThemePanel() {
  var panel = document.getElementById('pb-theme-panel');
  if (panel) panel.classList.remove('pb-theme-panel-open');
}

function pbBuildThemePanel() {
  var panel = document.getElementById('pb-theme-panel');
  if (!panel) return;

  var savedTheme = localStorage.getItem('ctax_pb_theme') || 'clean';
  var savedAccent = localStorage.getItem('ctax_pb_accent') || '';

  var h = '<div class="pb-tp-header">';
  h += '<span class="pb-tp-title">Page Theme</span>';
  h += '<button class="pb-tp-close" onclick="pbCloseThemePanel()">';
  h += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  h += '</button>';
  h += '</div>';

  // Theme cards
  h += '<div class="pb-tp-section-label">Style</div>';
  h += '<div class="pb-tp-themes">';
  PB_THEMES.forEach(function(theme) {
    var active = theme.id === savedTheme ? ' pb-tp-card-active' : '';
    h += '<button class="pb-tp-card' + active + '" data-theme="' + theme.id + '" onclick="pbSelectTheme(\'' + theme.id + '\')">';
    h += '<div class="pb-tp-card-preview">';
    h += '<div class="pb-tp-prev-bg" style="background:' + theme.preview.bg + '">';
    h += '<div class="pb-tp-prev-hero" style="background:' + theme.preview.hero + '"></div>';
    h += '<div class="pb-tp-prev-body">';
    var lineColor = (theme.id === 'dark' || theme.id === 'patriot') ? 'rgba(255,255,255,0.1)' : '#e2e8f0';
    h += '<div class="pb-tp-prev-line" style="background:' + lineColor + '"></div>';
    h += '<div class="pb-tp-prev-line pb-tp-prev-line-short" style="background:' + lineColor + '"></div>';
    h += '</div>';
    h += '<div class="pb-tp-prev-btn" style="background:' + theme.preview.accent + '"></div>';
    h += '</div>';
    h += '</div>';
    h += '<div class="pb-tp-card-label">' + theme.label + '</div>';
    h += '<div class="pb-tp-card-desc">' + theme.desc + '</div>';
    h += '</button>';
  });
  h += '</div>';

  // Accent color picker
  h += '<div class="pb-tp-section-label">Accent Color</div>';
  h += '<div class="pb-tp-accents">';
  PB_ACCENT_COLORS.forEach(function(ac) {
    var active = ac.id === savedAccent ? ' pb-tp-accent-active' : '';
    h += '<button class="pb-tp-accent' + active + '" data-accent="' + ac.id + '" ';
    h += 'style="background:' + ac.color + '" ';
    h += 'title="' + ac.label + '" ';
    h += 'onclick="pbSelectAccent(\'' + ac.id + '\')"></button>';
  });
  // Custom color input
  h += '<label class="pb-tp-accent-custom" title="Custom color">';
  h += '<input type="color" class="pb-tp-color-input" value="' + (savedAccent.startsWith('#') ? savedAccent : '#0B5FD8') + '" onchange="pbSelectCustomAccent(this.value)">';
  h += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>';
  h += '</label>';
  h += '</div>';

  // Reset accent
  if (savedAccent) {
    h += '<button class="pb-tp-reset" onclick="pbResetAccent()">Reset to theme default</button>';
  }

  panel.innerHTML = h;
}


// ================================================================
//  Apply theme -- just swap :root tokens
// ================================================================
function pbGetTheme(themeId) {
  for (var i = 0; i < PB_THEMES.length; i++) {
    if (PB_THEMES[i].id === themeId) return PB_THEMES[i];
  }
  return PB_THEMES[0];
}

function pbSelectTheme(themeId) {
  localStorage.setItem('ctax_pb_theme', themeId);
  pbApplyThemeToCanvas();
  pbBuildThemePanel();
}

function pbSelectAccent(accentId) {
  localStorage.setItem('ctax_pb_accent', accentId);
  pbApplyThemeToCanvas();
  pbBuildThemePanel();
}

function pbSelectCustomAccent(hex) {
  localStorage.setItem('ctax_pb_accent', hex);
  pbApplyThemeToCanvas();
  document.querySelectorAll('.pb-tp-accent').forEach(function(btn) {
    btn.classList.remove('pb-tp-accent-active');
  });
}

function pbResetAccent() {
  localStorage.removeItem('ctax_pb_accent');
  pbApplyThemeToCanvas();
  pbBuildThemePanel();
}

function pbGetAccentOverride() {
  var saved = localStorage.getItem('ctax_pb_accent');
  if (!saved) return null;

  // Check preset accents
  for (var i = 0; i < PB_ACCENT_COLORS.length; i++) {
    if (PB_ACCENT_COLORS[i].id === saved) {
      return { color: PB_ACCENT_COLORS[i].color, hover: PB_ACCENT_COLORS[i].hover };
    }
  }

  // Custom hex
  if (saved.startsWith('#')) {
    return { color: saved, hover: pbLightenHex(saved, 15) };
  }

  return null;
}

// Lighten a hex color by a percentage
function pbLightenHex(hex, percent) {
  var num = parseInt(hex.replace('#', ''), 16);
  var r = Math.min(255, (num >> 16) + Math.round(2.55 * percent));
  var g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round(2.55 * percent));
  var b = Math.min(255, (num & 0x0000FF) + Math.round(2.55 * percent));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Compute accent-soft and accent-glow from a hex color
function pbAccentSoft(hex) {
  var num = parseInt(hex.replace('#', ''), 16);
  var r = (num >> 16) & 0xFF;
  var g = (num >> 8) & 0xFF;
  var b = num & 0xFF;
  return 'rgba(' + r + ', ' + g + ', ' + b + ', 0.08)';
}

function pbAccentGlow(hex) {
  var num = parseInt(hex.replace('#', ''), 16);
  var r = (num >> 16) & 0xFF;
  var g = (num >> 8) & 0xFF;
  var b = num & 0xFF;
  return 'rgba(' + r + ', ' + g + ', ' + b + ', 0.28)';
}

// Apply theme + accent to the GrapesJS canvas
function pbApplyThemeToCanvas() {
  if (typeof pbEditor === 'undefined' || !pbEditor) return;
  var frame = pbEditor.Canvas.getFrameEl();
  if (!frame) return;
  var doc = frame.contentDocument;
  if (!doc || !doc.documentElement) return;

  var themeId = localStorage.getItem('ctax_pb_theme') || 'clean';
  var theme = pbGetTheme(themeId);

  // Build a single <style> block that re-declares all :root tokens
  var styleId = 'pb-theme-tokens';
  var existing = doc.getElementById(styleId);
  if (existing) existing.remove();

  var tokens = Object.assign({}, theme.tokens);

  // Apply accent override if set
  var accent = pbGetAccentOverride();
  if (accent) {
    tokens['--pb-accent'] = accent.color;
    tokens['--pb-accent-hover'] = accent.hover;
    tokens['--pb-accent-soft'] = pbAccentSoft(accent.color);
    tokens['--pb-accent-glow'] = pbAccentGlow(accent.color);
  }

  var css = ':root {\n';
  var keys = Object.keys(tokens);
  for (var i = 0; i < keys.length; i++) {
    css += '  ' + keys[i] + ': ' + tokens[keys[i]] + ';\n';
  }
  css += '}\n';

  // For dark themes, override hero sections that have hardcoded gradients
  var isDark = (themeId === 'dark' || themeId === 'patriot');
  if (isDark) {
    var bg0 = tokens['--pb-bg-0'];
    var bg1 = tokens['--pb-bg-1'];
    css += '.pb-hero-centered { background: linear-gradient(135deg, ' + bg0 + ' 0%, ' + bg1 + ' 100%); }\n';
    css += '.pb-hero-dark { background: linear-gradient(135deg, ' + bg0 + ' 0%, ' + bg1 + ' 100%); }\n';
    css += '.pb-cta-dark { background: linear-gradient(135deg, ' + bg0 + ' 0%, ' + bg1 + ' 100%); }\n';
    css += '.pb-hero-split { background: ' + bg0 + '; }\n';
    css += '.pb-hero-minimal { background: ' + bg0 + '; }\n';
    css += '.pb-hero-bold { background: ' + bg0 + '; }\n';
  }

  if (themeId === 'warm') {
    css += '.pb-hero-centered { background: linear-gradient(135deg, #292524 0%, #1c1917 100%); color: #fff; }\n';
    css += '.pb-hero-dark { background: linear-gradient(135deg, #1c1917 0%, #431407 100%); color: #fff; }\n';
    css += '.pb-cta-dark { background: linear-gradient(135deg, #292524 0%, #1c1917 100%); color: #fff; }\n';
  }

  var style = doc.createElement('style');
  style.id = styleId;
  style.textContent = css;
  doc.head.appendChild(style);

  // Update body background for exported look
  doc.body.style.background = tokens['--pb-bg-0'];
  doc.body.style.color = tokens['--pb-text-0'];

  // Update toolbar theme indicator
  pbUpdateThemeIndicator(theme, accent);
}

function pbUpdateThemeIndicator(theme, accent) {
  var trigger = document.querySelector('.pb-theme-trigger');
  if (!trigger) return;
  var color = accent ? accent.color : theme.tokens['--pb-accent'];
  trigger.style.borderColor = color;
  trigger.style.boxShadow = '0 0 0 1px ' + color + '33';
}


// ================================================================
//  Restore on editor init
// ================================================================
function pbRestorePreset() {
  setTimeout(function() {
    pbApplyThemeToCanvas();
  }, 600);
}


// ================================================================
//  Export helper -- bake theme + accent into standalone HTML
// ================================================================
function pbGetPresetInlineCSS() {
  var themeId = localStorage.getItem('ctax_pb_theme') || 'clean';
  var theme = pbGetTheme(themeId);
  var accent = pbGetAccentOverride();

  var tokens = Object.assign({}, theme.tokens);

  if (accent) {
    tokens['--pb-accent'] = accent.color;
    tokens['--pb-accent-hover'] = accent.hover;
    tokens['--pb-accent-soft'] = pbAccentSoft(accent.color);
    tokens['--pb-accent-glow'] = pbAccentGlow(accent.color);
  }

  var lines = [':root {'];
  var keys = Object.keys(tokens);
  for (var i = 0; i < keys.length; i++) {
    lines.push('  ' + keys[i] + ': ' + tokens[keys[i]] + ';');
  }
  lines.push('}');

  // Body background
  lines.push('body { background: ' + tokens['--pb-bg-0'] + '; color: ' + tokens['--pb-text-0'] + '; }');

  // Dark theme hero overrides for standalone HTML
  var isDark = (themeId === 'dark' || themeId === 'patriot');
  if (isDark) {
    lines.push('.pb-hero-centered { background: linear-gradient(135deg, ' + tokens['--pb-bg-0'] + ' 0%, ' + tokens['--pb-bg-1'] + ' 100%); }');
    lines.push('.pb-hero-dark { background: linear-gradient(135deg, ' + tokens['--pb-bg-0'] + ' 0%, ' + tokens['--pb-bg-1'] + ' 100%); }');
    lines.push('.pb-cta-dark { background: linear-gradient(135deg, ' + tokens['--pb-bg-0'] + ' 0%, ' + tokens['--pb-bg-1'] + ' 100%); }');
  }

  if (themeId === 'warm') {
    lines.push('.pb-hero-centered { background: linear-gradient(135deg, #292524 0%, #1c1917 100%); color: #fff; }');
    lines.push('.pb-hero-dark { background: linear-gradient(135deg, #1c1917 0%, #431407 100%); color: #fff; }');
    lines.push('.pb-cta-dark { background: linear-gradient(135deg, #292524 0%, #1c1917 100%); color: #fff; }');
  }

  return lines.join('\n');
}

// Legacy compat
function pbBuildPresetSwatches() { /* no-op, replaced by theme panel */ }
function pbApplyColorPreset() { /* no-op */ }
