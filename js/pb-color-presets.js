// -- Page Builder: Theme System --
// Full page themes (background, text, section colors) plus accent color picker.
// Each theme overrides canvas CSS vars AND injects body/section-level styles.

var PB_THEMES = [
  {
    id: 'clean',
    label: 'Clean White',
    desc: 'Light, minimal, and professional',
    preview: { bg: '#ffffff', hero: '#f8fafc', accent: '#2563eb' },
    vars: {
      '--pb-primary': '#2563eb',
      '--pb-primary-hover': '#1d4ed8',
      '--pb-dark-bg': '#1e293b',
      '--pb-dark-bg-alt': '#334155',
      '--pb-gradient-start': '#f8fafc',
      '--pb-gradient-end': '#e2e8f0',
      '--pb-gradient-bold-start': '#1e293b',
      '--pb-gradient-bold-end': '#334155'
    },
    body: {
      background: '#ffffff',
      color: '#1a2332'
    },
    sections: {
      '.pb-hero': 'background:linear-gradient(135deg,#f8fafc 0%,#e2e8f0 100%);color:#111827',
      '.pb-hero h1': 'color:#111827',
      '.pb-hero p': 'color:#475569;opacity:1',
      '.pb-stats-row': 'background:#f1f5f9',
      '.pb-features': 'background:#ffffff',
      '.pb-testimonial': 'background:#f8fafc',
      '.pb-cta-section': 'background:#1e293b;color:#fff',
      '.pb-trust-bar': 'background:#f1f5f9'
    }
  },
  {
    id: 'patriot',
    label: 'Patriot',
    desc: 'Red, white, and blue -- IRS authority',
    preview: { bg: '#ffffff', hero: '#1b2a4a', accent: '#b91c1c' },
    vars: {
      '--pb-primary': '#b91c1c',
      '--pb-primary-hover': '#991b1b',
      '--pb-dark-bg': '#1b2a4a',
      '--pb-dark-bg-alt': '#0f1d36',
      '--pb-gradient-start': '#1b2a4a',
      '--pb-gradient-end': '#0f1d36',
      '--pb-gradient-bold-start': '#0a1628',
      '--pb-gradient-bold-end': '#1b2a4a'
    },
    body: {
      background: '#ffffff',
      color: '#1a2332'
    },
    sections: {
      '.pb-hero': 'background:linear-gradient(135deg,#1b2a4a 0%,#0f1d36 100%);color:#fff',
      '.pb-stats-row': 'background:#f0f4f8',
      '.pb-features': 'background:#ffffff',
      '.pb-testimonial': 'background:#fafbfd',
      '.pb-cta-section': 'background:#1b2a4a;color:#fff',
      '.pb-trust-bar': 'background:#f0f4f8',
      '.pb-trust-badge': 'border-color:#c7d2de',
      '.pb-counter-strip': 'background:#b91c1c'
    }
  },
  {
    id: 'dark',
    label: 'Dark Mode',
    desc: 'Sleek dark background, high contrast',
    preview: { bg: '#0f172a', hero: '#1e293b', accent: '#3b82f6' },
    vars: {
      '--pb-primary': '#3b82f6',
      '--pb-primary-hover': '#2563eb',
      '--pb-dark-bg': '#0f172a',
      '--pb-dark-bg-alt': '#1e293b',
      '--pb-gradient-start': '#0f172a',
      '--pb-gradient-end': '#1e293b',
      '--pb-gradient-bold-start': '#020617',
      '--pb-gradient-bold-end': '#1e293b'
    },
    body: {
      background: '#0f172a',
      color: '#e2e8f0'
    },
    sections: {
      '.pb-hero': 'background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);color:#fff',
      '.pb-stats-row': 'background:#1e293b',
      '.pb-stat-val': 'color:#f1f5f9',
      '.pb-stat-label': 'color:#94a3b8',
      '.pb-features': 'background:#0f172a',
      '.pb-features h2': 'color:#f1f5f9',
      '.pb-feat-card': 'border-color:#334155;background:#1e293b',
      '.pb-feat-card h3': 'color:#f1f5f9',
      '.pb-feat-card p': 'color:#94a3b8',
      '.pb-testimonial': 'background:#1e293b',
      '.pb-testimonial blockquote': 'color:#cbd5e1',
      '.pb-testimonial cite': 'color:#94a3b8',
      '.pb-testi-card': 'background:#0f172a;border-color:#334155',
      '.pb-testi-card blockquote': 'color:#cbd5e1',
      '.pb-testi-card cite': 'color:#94a3b8',
      '.pb-cta-section': 'background:#020617;color:#fff',
      '.pb-trust-bar': 'background:#1e293b',
      '.pb-trust-badge': 'background:#0f172a;border-color:#334155;color:#cbd5e1',
      '.pb-form-section': 'background:#0f172a',
      '.pb-form-section h2': 'color:#f1f5f9',
      '.pb-form input': 'background:#1e293b;border-color:#334155;color:#f1f5f9',
      '.pb-form textarea': 'background:#1e293b;border-color:#334155;color:#f1f5f9',
      '.pb-faq': 'background:#0f172a',
      '.pb-faq h2': 'color:#f1f5f9',
      '.pb-faq-item': 'border-color:#334155',
      '.pb-faq-item strong': 'color:#f1f5f9',
      '.pb-faq-item p': 'color:#94a3b8',
      '.pb-faq-accordion': 'border-color:#334155',
      '.pb-faq-accordion summary': 'color:#f1f5f9',
      '.pb-faq-accordion p': 'color:#94a3b8',
      '.pb-proof-logos': 'background:#0f172a',
      '.pb-proof-logos-heading': 'color:#64748b',
      '.pb-content-rich': 'background:transparent',
      '.pb-content-rich h2': 'color:#f1f5f9',
      '.pb-content-rich p': 'color:#94a3b8',
      '.pb-icon-list-section h2': 'color:#f1f5f9',
      '.pb-icon-list strong': 'color:#f1f5f9',
      '.pb-icon-list p': 'color:#94a3b8',
      '.pb-icon-list li': 'border-bottom-color:#1e293b',
      '.pb-alternating': 'background:#0f172a',
      '.pb-alt-text h3': 'color:#f1f5f9',
      '.pb-alt-text p': 'color:#94a3b8',
      '.pb-alt-accent': 'background:#1e293b;border-color:#475569',
      '.pb-hero-split': 'background:#0f172a',
      '.pb-hero-split-text h1': 'color:#f1f5f9',
      '.pb-hero-split-text p': 'color:#94a3b8',
      '.pb-img-placeholder': 'background:#1e293b;border-color:#475569;color:#64748b',
      '.pb-hero-minimal': 'background:#0f172a',
      '.pb-hero-minimal h1': 'color:#f1f5f9',
      '.pb-hero-minimal p': 'color:#94a3b8',
      '.pb-case-comparison': 'background:#0f172a',
      '.pb-case-comparison h2': 'color:#f1f5f9',
      '.pb-counter-strip': 'background:#020617',
      '.pb-trust-credentials': 'background:#0f172a',
      '.pb-trust-credentials h2': 'color:#f1f5f9',
      '.pb-cred-card': 'border-color:#334155;background:#1e293b',
      '.pb-cred-card strong': 'color:#f1f5f9',
      '.pb-cred-card p': 'color:#94a3b8',
      '.pb-divider hr': 'background:#334155',
      '.pb-text-block p': 'color:#94a3b8',
      '.pb-cta-card-section': 'background:#0f172a',
      '.pb-cta-card': 'border-color:#334155;background:#1e293b',
      '.pb-cta-card h2': 'color:#f1f5f9',
      '.pb-cta-card p': 'color:#94a3b8',
      '.pb-form-inline-section': 'background:#1e293b',
      '.pb-form-inline-section h2': 'color:#f1f5f9',
      '.pb-form-inline input': 'background:#0f172a;border-color:#334155;color:#f1f5f9',
      '.pb-faq-two-col': 'background:#0f172a',
      '.pb-faq-two-col h2': 'color:#f1f5f9',
      '.pb-testi-mini': 'background:#1e293b',
      '.pb-testi-mini blockquote': 'color:#cbd5e1',
      '.pb-testi-mini cite': 'color:#94a3b8',
      '.pb-case-timeline': 'background:#0f172a',
      '.pb-case-timeline h2': 'color:#f1f5f9',
      '.pb-timeline-step strong': 'color:#f1f5f9',
      '.pb-timeline-step p': 'color:#94a3b8',
      '.pb-timeline-step': 'border-bottom-color:#1e293b',
      '.pb-two-col-grid h3': 'color:#f1f5f9',
      '.pb-two-col-grid p': 'color:#94a3b8',
      '.pb-form-sidebar-section': 'background:#0f172a',
      '.pb-form-sidebar-benefits h2': 'color:#f1f5f9',
      '.pb-form-sidebar-benefits li': 'color:#cbd5e1;border-bottom-color:#1e293b',
      '.pb-form-sidebar-form h3': 'color:#f1f5f9'
    }
  },
  {
    id: 'warm',
    label: 'Warm Earth',
    desc: 'Earthy tones, approachable feel',
    preview: { bg: '#faf8f5', hero: '#292524', accent: '#b45309' },
    vars: {
      '--pb-primary': '#b45309',
      '--pb-primary-hover': '#92400e',
      '--pb-dark-bg': '#292524',
      '--pb-dark-bg-alt': '#1c1917',
      '--pb-gradient-start': '#292524',
      '--pb-gradient-end': '#1c1917',
      '--pb-gradient-bold-start': '#1c1917',
      '--pb-gradient-bold-end': '#431407'
    },
    body: {
      background: '#faf8f5',
      color: '#292524'
    },
    sections: {
      '.pb-hero': 'background:linear-gradient(135deg,#292524 0%,#1c1917 100%);color:#fff',
      '.pb-stats-row': 'background:#f5f0eb',
      '.pb-features': 'background:#faf8f5',
      '.pb-feat-card': 'border-color:#e7e0d8',
      '.pb-testimonial': 'background:#f5f0eb',
      '.pb-cta-section': 'background:#292524;color:#fff',
      '.pb-trust-bar': 'background:#f5f0eb',
      '.pb-trust-badge': 'border-color:#e7e0d8'
    }
  }
];

// Accent color palette — user picks one to override --pb-primary
var PB_ACCENT_COLORS = [
  { id: 'blue',   color: '#2563eb', hover: '#1d4ed8', label: 'Blue' },
  { id: 'red',    color: '#dc2626', hover: '#b91c1c', label: 'Red' },
  { id: 'green',  color: '#16a34a', hover: '#15803d', label: 'Green' },
  { id: 'orange', color: '#ea580c', hover: '#c2410c', label: 'Orange' },
  { id: 'purple', color: '#7c3aed', hover: '#6d28d9', label: 'Purple' },
  { id: 'teal',   color: '#0d9488', hover: '#0f766e', label: 'Teal' },
  { id: 'pink',   color: '#db2777', hover: '#be185d', label: 'Pink' },
  { id: 'slate',  color: '#475569', hover: '#334155', label: 'Slate' }
];

// ══════════════════════════════════════════
//  Theme panel UI
// ══════════════════════════════════════════
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
    h += '<div class="pb-tp-prev-line" style="background:' + (theme.id === 'dark' ? '#334155' : '#e2e8f0') + '"></div>';
    h += '<div class="pb-tp-prev-line pb-tp-prev-line-short" style="background:' + (theme.id === 'dark' ? '#334155' : '#e2e8f0') + '"></div>';
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
  h += '<input type="color" class="pb-tp-color-input" value="' + (savedAccent.startsWith('#') ? savedAccent : '#2563eb') + '" onchange="pbSelectCustomAccent(this.value)">';
  h += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>';
  h += '</label>';
  h += '</div>';

  // Reset accent
  if (savedAccent) {
    h += '<button class="pb-tp-reset" onclick="pbResetAccent()">Reset to theme default</button>';
  }

  panel.innerHTML = h;
}

// ══════════════════════════════════════════
//  Apply theme
// ══════════════════════════════════════════
function pbGetTheme(themeId) {
  for (var i = 0; i < PB_THEMES.length; i++) {
    if (PB_THEMES[i].id === themeId) return PB_THEMES[i];
  }
  return PB_THEMES[0];
}

function pbSelectTheme(themeId) {
  localStorage.setItem('ctax_pb_theme', themeId);
  pbApplyThemeToCanvas();
  pbBuildThemePanel(); // refresh active states
}

function pbSelectAccent(accentId) {
  localStorage.setItem('ctax_pb_accent', accentId);
  pbApplyThemeToCanvas();
  pbBuildThemePanel();
}

function pbSelectCustomAccent(hex) {
  localStorage.setItem('ctax_pb_accent', hex);
  pbApplyThemeToCanvas();
  // Update active states
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
    return { color: saved, hover: pbDarkenHex(saved, 20) };
  }

  return null;
}

// Darken a hex color by a percentage (simple approach)
function pbDarkenHex(hex, percent) {
  var num = parseInt(hex.replace('#', ''), 16);
  var r = Math.max(0, (num >> 16) - Math.round(2.55 * percent));
  var g = Math.max(0, ((num >> 8) & 0x00FF) - Math.round(2.55 * percent));
  var b = Math.max(0, (num & 0x0000FF) - Math.round(2.55 * percent));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
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

  // 1. Set CSS custom properties
  var vars = Object.keys(theme.vars);
  for (var i = 0; i < vars.length; i++) {
    doc.documentElement.style.setProperty(vars[i], theme.vars[vars[i]]);
  }

  // 2. Apply body styles
  if (theme.body) {
    doc.body.style.background = theme.body.background || '';
    doc.body.style.color = theme.body.color || '';
  }

  // 3. Apply section overrides via a <style> tag
  var styleId = 'pb-theme-overrides';
  var existing = doc.getElementById(styleId);
  if (existing) existing.remove();

  if (theme.sections) {
    var css = '';
    var selectors = Object.keys(theme.sections);
    for (var j = 0; j < selectors.length; j++) {
      css += selectors[j] + '{' + theme.sections[selectors[j]] + '}\n';
    }

    var style = doc.createElement('style');
    style.id = styleId;
    style.textContent = css;
    doc.head.appendChild(style);
  }

  // 4. Apply accent override if set
  var accent = pbGetAccentOverride();
  if (accent) {
    doc.documentElement.style.setProperty('--pb-primary', accent.color);
    doc.documentElement.style.setProperty('--pb-primary-hover', accent.hover);
  }

  // Update toolbar theme button indicator
  pbUpdateThemeIndicator(theme, accent);
}

function pbUpdateThemeIndicator(theme, accent) {
  var trigger = document.querySelector('.pb-theme-trigger');
  if (!trigger) return;
  var color = accent ? accent.color : theme.vars['--pb-primary'];
  trigger.style.borderColor = color;
  trigger.style.boxShadow = '0 0 0 1px ' + color + '33';
}

// ══════════════════════════════════════════
//  Restore on editor init
// ══════════════════════════════════════════
function pbRestorePreset() {
  // Delay so the canvas iframe is ready
  setTimeout(function() {
    pbApplyThemeToCanvas();
  }, 600);
}

// ══════════════════════════════════════════
//  Export helpers (used by preview and export)
// ══════════════════════════════════════════

// Get inline CSS that bakes the current theme into standalone HTML
function pbGetPresetInlineCSS() {
  var themeId = localStorage.getItem('ctax_pb_theme') || 'clean';
  var theme = pbGetTheme(themeId);
  var accent = pbGetAccentOverride();

  var lines = [':root {'];
  var vars = Object.keys(theme.vars);
  for (var i = 0; i < vars.length; i++) {
    lines.push('  ' + vars[i] + ': ' + theme.vars[vars[i]] + ';');
  }

  // Override primary with accent
  if (accent) {
    lines.push('  --pb-primary: ' + accent.color + ';');
    lines.push('  --pb-primary-hover: ' + accent.hover + ';');
  }

  lines.push('}');

  // Body styles
  if (theme.body) {
    lines.push('body {');
    if (theme.body.background) lines.push('  background: ' + theme.body.background + ';');
    if (theme.body.color) lines.push('  color: ' + theme.body.color + ';');
    lines.push('}');
  }

  // Section overrides
  if (theme.sections) {
    var selectors = Object.keys(theme.sections);
    for (var j = 0; j < selectors.length; j++) {
      lines.push(selectors[j] + ' { ' + theme.sections[selectors[j]] + ' }');
    }
  }

  return lines.join('\n');
}

// Legacy compat — old code called pbBuildPresetSwatches
function pbBuildPresetSwatches() { /* no-op, replaced by theme panel */ }
function pbApplyColorPreset() { /* no-op */ }
