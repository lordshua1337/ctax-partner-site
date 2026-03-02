// -- Page Builder: Theme System --
// Semantic token flipping. Each theme re-declares --pb-* tokens on :root.
// No per-selector overrides needed because all blocks reference tokens.

// ================================================================
//  Boho Earth Sub-Palettes
//  The warm theme uses one of these curated palettes instead of
//  a generic accent picker. Each palette has its own hero gradient,
//  accent, and warm-tone vibe.
// ================================================================
var PB_BOHO_PALETTES = [
  {
    id: 'desert',
    label: 'Desert Sand',
    desc: 'Sandy neutrals, terracotta, golden hour warmth',
    swatch: ['#d4a574', '#c4956a', '#a67c52', '#8b6844'],
    tokens: {
      '--pb-bg-0': '#faf6f1',
      '--pb-bg-1': '#f3ece3',
      '--pb-bg-2': '#e8dfd4',
      '--pb-bg-3': '#d6cbbf',
      '--pb-text-0': '#2c2218',
      '--pb-text-1': '#5c4f42',
      '--pb-text-2': '#8a7c6e',
      '--pb-border': '#d6cbbf',
      '--pb-border-subtle': '#e8dfd4',
      '--pb-accent': '#c4956a',
      '--pb-accent-hover': '#d4a574',
      '--pb-accent-soft': 'rgba(196, 149, 106, 0.10)',
      '--pb-accent-glow': 'rgba(196, 149, 106, 0.25)',
      '--pb-shadow-sm': '0 1px 3px rgba(44, 34, 24, 0.05)',
      '--pb-shadow-md': '0 4px 12px rgba(44, 34, 24, 0.07), 0 1px 3px rgba(44, 34, 24, 0.04)',
      '--pb-shadow-lg': '0 12px 40px rgba(44, 34, 24, 0.09), 0 4px 12px rgba(44, 34, 24, 0.05)',
      '--pb-shadow-xl': '0 24px 80px rgba(44, 34, 24, 0.12), 0 4px 12px rgba(44, 34, 24, 0.05)',
      '--pb-glass-bg': 'rgba(250, 246, 241, 0.85)',
      '--pb-glass-border': 'rgba(214, 203, 191, 0.4)'
    },
    hero: { bg1: '#3d3229', bg2: '#2c2218', bg3: '#4a3c2f', glow: 'rgba(196, 149, 106, 0.20)', cream: '#faf6f1' },
    gradient: ['#c4956a', '#d4a574']
  },
  {
    id: 'moss',
    label: 'Forest Moss',
    desc: 'Sage greens, olive, eucalyptus calm',
    swatch: ['#8fa67c', '#7d9468', '#6b8256', '#5a7048'],
    tokens: {
      '--pb-bg-0': '#f5f7f2',
      '--pb-bg-1': '#edf0e8',
      '--pb-bg-2': '#e0e5d8',
      '--pb-bg-3': '#ced6c4',
      '--pb-text-0': '#1e2a18',
      '--pb-text-1': '#3d4f35',
      '--pb-text-2': '#6e7d66',
      '--pb-border': '#ced6c4',
      '--pb-border-subtle': '#e0e5d8',
      '--pb-accent': '#7d9468',
      '--pb-accent-hover': '#8fa67c',
      '--pb-accent-soft': 'rgba(125, 148, 104, 0.10)',
      '--pb-accent-glow': 'rgba(125, 148, 104, 0.25)',
      '--pb-shadow-sm': '0 1px 3px rgba(30, 42, 24, 0.05)',
      '--pb-shadow-md': '0 4px 12px rgba(30, 42, 24, 0.07), 0 1px 3px rgba(30, 42, 24, 0.04)',
      '--pb-shadow-lg': '0 12px 40px rgba(30, 42, 24, 0.09), 0 4px 12px rgba(30, 42, 24, 0.05)',
      '--pb-shadow-xl': '0 24px 80px rgba(30, 42, 24, 0.12), 0 4px 12px rgba(30, 42, 24, 0.05)',
      '--pb-glass-bg': 'rgba(245, 247, 242, 0.85)',
      '--pb-glass-border': 'rgba(206, 214, 196, 0.4)'
    },
    hero: { bg1: '#2a3424', bg2: '#1e2a18', bg3: '#354030', glow: 'rgba(125, 148, 104, 0.20)', cream: '#f5f7f2' },
    gradient: ['#6b8256', '#8fa67c']
  },
  {
    id: 'clay',
    label: 'Terracotta',
    desc: 'Burnt orange, rust, warm clay tones',
    swatch: ['#c97b5a', '#b86e4d', '#a66040', '#8f5236'],
    tokens: {
      '--pb-bg-0': '#faf5f2',
      '--pb-bg-1': '#f3ece7',
      '--pb-bg-2': '#e8ddd6',
      '--pb-bg-3': '#d6c8bf',
      '--pb-text-0': '#2c1e18',
      '--pb-text-1': '#5c4a3e',
      '--pb-text-2': '#8a7468',
      '--pb-border': '#d6c8bf',
      '--pb-border-subtle': '#e8ddd6',
      '--pb-accent': '#b86e4d',
      '--pb-accent-hover': '#c97b5a',
      '--pb-accent-soft': 'rgba(184, 110, 77, 0.10)',
      '--pb-accent-glow': 'rgba(184, 110, 77, 0.25)',
      '--pb-shadow-sm': '0 1px 3px rgba(44, 30, 24, 0.05)',
      '--pb-shadow-md': '0 4px 12px rgba(44, 30, 24, 0.07), 0 1px 3px rgba(44, 30, 24, 0.04)',
      '--pb-shadow-lg': '0 12px 40px rgba(44, 30, 24, 0.09), 0 4px 12px rgba(44, 30, 24, 0.05)',
      '--pb-shadow-xl': '0 24px 80px rgba(44, 30, 24, 0.12), 0 4px 12px rgba(44, 30, 24, 0.05)',
      '--pb-glass-bg': 'rgba(250, 245, 242, 0.85)',
      '--pb-glass-border': 'rgba(214, 200, 191, 0.4)'
    },
    hero: { bg1: '#3d2920', bg2: '#2c1e18', bg3: '#4a342a', glow: 'rgba(184, 110, 77, 0.20)', cream: '#faf5f2' },
    gradient: ['#a66040', '#c97b5a']
  }
];


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
      '--pb-text-2': '#8b9bb5',
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
    preview: { bg: '#0A1628', hero: '#112244', accent: '#ef4444' },
    tokens: {
      '--pb-bg-0': '#0A1628',
      '--pb-bg-1': '#112244',
      '--pb-bg-2': '#1a3160',
      '--pb-bg-3': '#244080',
      '--pb-text-0': '#e8ecf2',
      '--pb-text-1': '#b0b8cc',
      '--pb-text-2': '#8b9bb5',
      '--pb-border': 'rgba(255,255,255,0.10)',
      '--pb-border-subtle': 'rgba(255,255,255,0.05)',
      '--pb-accent': '#ef4444',
      '--pb-accent-hover': '#f87171',
      '--pb-accent-soft': 'rgba(239, 68, 68, 0.14)',
      '--pb-accent-glow': 'rgba(239, 68, 68, 0.30)',
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
    label: 'Boho Earth',
    desc: 'Organic, layered, warm and grounded',
    preview: { bg: '#faf6f1', hero: '#3d3229', accent: '#c4956a' },
    // Base tokens are overwritten by the active boho palette
    tokens: PB_BOHO_PALETTES[0].tokens
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
//  Boho palette helpers
// ================================================================
function pbGetBohoPalette(paletteId) {
  for (var i = 0; i < PB_BOHO_PALETTES.length; i++) {
    if (PB_BOHO_PALETTES[i].id === paletteId) return PB_BOHO_PALETTES[i];
  }
  return PB_BOHO_PALETTES[0];
}

function pbGetActiveBohoPalette() {
  var saved = localStorage.getItem('ctax_pb_boho_palette') || 'desert';
  return pbGetBohoPalette(saved);
}

function pbSelectBohoPalette(paletteId) {
  localStorage.setItem('ctax_pb_boho_palette', paletteId);
  pbApplyThemeToCanvas();
  pbBuildThemePanel();
}


// ================================================================
//  SVG patterns for boho theme
// ================================================================
function pbBohoTextureSvg(accentColor) {
  // Layered organic pattern: dots, small diamonds, and leaf shapes
  var r = parseInt(accentColor.slice(1, 3), 16);
  var g = parseInt(accentColor.slice(3, 5), 16);
  var b = parseInt(accentColor.slice(5, 7), 16);
  var c1 = 'rgba(' + r + ',' + g + ',' + b + ',0.06)';
  var c2 = 'rgba(' + r + ',' + g + ',' + b + ',0.04)';
  var c3 = 'rgba(' + r + ',' + g + ',' + b + ',0.08)';
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E" +
    // Organic dots at various sizes
    "%3Ccircle cx='15' cy='15' r='1.5' fill='" + encodeURIComponent(c1) + "'/%3E" +
    "%3Ccircle cx='60' cy='8' r='1' fill='" + encodeURIComponent(c2) + "'/%3E" +
    "%3Ccircle cx='100' cy='25' r='1.8' fill='" + encodeURIComponent(c1) + "'/%3E" +
    "%3Ccircle cx='40' cy='50' r='1.2' fill='" + encodeURIComponent(c2) + "'/%3E" +
    "%3Ccircle cx='85' cy='65' r='1.5' fill='" + encodeURIComponent(c1) + "'/%3E" +
    "%3Ccircle cx='20' cy='90' r='1' fill='" + encodeURIComponent(c2) + "'/%3E" +
    "%3Ccircle cx='70' cy='100' r='1.3' fill='" + encodeURIComponent(c1) + "'/%3E" +
    // Small diamond shapes (boho geometric)
    "%3Cpath d='M110 55l3 5-3 5-3-5z' fill='" + encodeURIComponent(c3) + "'/%3E" +
    "%3Cpath d='M30 75l2 4-2 4-2-4z' fill='" + encodeURIComponent(c2) + "'/%3E" +
    // Tiny leaf curves
    "%3Cpath d='M50 30c4-3 8-2 8 2s-4 5-8 2' fill='none' stroke='" + encodeURIComponent(c2) + "' stroke-width='0.5'/%3E" +
    "%3Cpath d='M90 90c4-3 8-2 8 2s-4 5-8 2' fill='none' stroke='" + encodeURIComponent(c2) + "' stroke-width='0.5'/%3E" +
    "%3C/svg%3E";
}

function pbBohoWaveSvg(fillColor, accentColor) {
  // Big, bold, triple-layered hero-bottom wave with visible accent stroke
  var fill = encodeURIComponent(fillColor);
  var accent = accentColor ? encodeURIComponent(accentColor) : fill;
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 200' preserveAspectRatio='none'%3E" +
    // Layer 1: faint wide sweep
    "%3Cpath fill='" + fill + "' opacity='0.25' d='M0,40 C320,120 640,0 960,80 C1120,120 1280,20 1440,40 L1440,200 L0,200Z'/%3E" +
    // Layer 2: medium fill, offset rhythm
    "%3Cpath fill='" + fill + "' opacity='0.55' d='M0,80 C200,130 440,40 720,90 C1000,140 1200,50 1440,80 L1440,200 L0,200Z'/%3E" +
    // Layer 3: solid fill -- the definitive wave edge
    "%3Cpath fill='" + fill + "' d='M0,120 C240,160 480,80 720,120 C960,160 1200,75 1440,120 L1440,200 L0,200Z'/%3E" +
    // Accent stroke riding the top of layer 2 -- the visible decorative line
    "%3Cpath fill='none' stroke='" + accent + "' stroke-width='2' opacity='0.5' d='M0,78 C200,128 440,38 720,88 C1000,138 1200,48 1440,78'/%3E" +
    "%3C/svg%3E";
}

function pbBohoCardBorderSvg(accentColor) {
  // Woven/macrame-style top border for cards
  var r = parseInt(accentColor.slice(1, 3), 16);
  var g = parseInt(accentColor.slice(3, 5), 16);
  var b = parseInt(accentColor.slice(5, 7), 16);
  var c = 'rgba(' + r + ',' + g + ',' + b + ',0.3)';
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='6' viewBox='0 0 200 6'%3E" +
    "%3Cpath d='M0,3 Q10,0 20,3 T40,3 T60,3 T80,3 T100,3 T120,3 T140,3 T160,3 T180,3 T200,3' fill='none' stroke='" + encodeURIComponent(c) + "' stroke-width='1.5'/%3E" +
    "%3Cpath d='M0,3 Q10,6 20,3 T40,3 T60,3 T80,3 T100,3 T120,3 T140,3 T160,3 T180,3 T200,3' fill='none' stroke='" + encodeURIComponent(c) + "' stroke-width='1.5'/%3E" +
    "%3C/svg%3E";
}


function pbBohoSectionDividerSvg(bgColor, accentColor) {
  // Bold layered wave divider between sections -- impossible to miss
  var bg = encodeURIComponent(bgColor);
  var r = parseInt(accentColor.slice(1, 3), 16);
  var g = parseInt(accentColor.slice(3, 5), 16);
  var b = parseInt(accentColor.slice(5, 7), 16);
  var accentSolid = encodeURIComponent('rgba(' + r + ',' + g + ',' + b + ',0.35)');
  var accentFaint = encodeURIComponent('rgba(' + r + ',' + g + ',' + b + ',0.12)');
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 80' preserveAspectRatio='none'%3E" +
    // Background fill wave (the actual shape transition)
    "%3Cpath fill='" + bg + "' d='M0,40 C240,70 480,15 720,40 C960,65 1200,15 1440,40 L1440,80 L0,80Z'/%3E" +
    // Faint wide accent wave behind
    "%3Cpath fill='none' stroke='" + accentFaint + "' stroke-width='3' d='M0,30 C240,60 480,5 720,30 C960,55 1200,5 1440,30'/%3E" +
    // Bold accent wave stroke -- the signature boho line
    "%3Cpath fill='none' stroke='" + accentSolid + "' stroke-width='2' d='M0,38 C240,68 480,13 720,38 C960,63 1200,13 1440,38'/%3E" +
    "%3C/svg%3E";
}

function pbBohoFlourishSvg(accentColor) {
  // Bold decorative curly vine flourish under headings
  var r = parseInt(accentColor.slice(1, 3), 16);
  var g = parseInt(accentColor.slice(3, 5), 16);
  var b = parseInt(accentColor.slice(5, 7), 16);
  var c = encodeURIComponent('rgba(' + r + ',' + g + ',' + b + ',0.5)');
  var cFaint = encodeURIComponent('rgba(' + r + ',' + g + ',' + b + ',0.2)');
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 30'%3E" +
    // Main flowing S-curve (wider, more prominent)
    "%3Cpath d='M15,15 C35,3 55,27 80,15 C105,3 125,27 150,15 C165,8 180,18 185,15' fill='none' stroke='" + c + "' stroke-width='2' stroke-linecap='round'/%3E" +
    // Faint echo curve behind (depth)
    "%3Cpath d='M25,17 C45,5 60,25 80,17 C100,9 120,25 140,17' fill='none' stroke='" + cFaint + "' stroke-width='1.5' stroke-linecap='round'/%3E" +
    // Leaf sprigs
    "%3Cpath d='M45,8 C50,2 56,2 52,8' fill='" + cFaint + "' stroke='" + c + "' stroke-width='0.8'/%3E" +
    "%3Cpath d='M120,22 C125,28 131,28 127,22' fill='" + cFaint + "' stroke='" + c + "' stroke-width='0.8'/%3E" +
    "%3Cpath d='M68,20 C72,26 77,24 73,19' fill='" + cFaint + "' stroke='" + c + "' stroke-width='0.8'/%3E" +
    // Center diamond dot
    "%3Cpath d='M100,12 L103,15 L100,18 L97,15 Z' fill='" + c + "'/%3E" +
    // End dots
    "%3Ccircle cx='12' cy='15' r='2.5' fill='" + c + "'/%3E" +
    "%3Ccircle cx='188' cy='15' r='2.5' fill='" + c + "'/%3E" +
    "%3C/svg%3E";
}


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
  var savedBohoPalette = localStorage.getItem('ctax_pb_boho_palette') || 'desert';

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
    // For warm theme, show the active palette preview colors
    var previewBg = theme.preview.bg;
    var previewHero = theme.preview.hero;
    var previewAccent = theme.preview.accent;
    if (theme.id === 'warm') {
      var pal = pbGetBohoPalette(savedBohoPalette);
      previewBg = pal.tokens['--pb-bg-0'];
      previewHero = pal.hero.bg1;
      previewAccent = pal.tokens['--pb-accent'];
    }
    h += '<button class="pb-tp-card' + active + '" data-theme="' + theme.id + '" onclick="pbSelectTheme(\'' + theme.id + '\')">';
    h += '<div class="pb-tp-card-preview">';
    h += '<div class="pb-tp-prev-bg" style="background:' + previewBg + '">';
    h += '<div class="pb-tp-prev-hero" style="background:' + previewHero + '"></div>';
    h += '<div class="pb-tp-prev-body">';
    var lineColor = (theme.id === 'dark' || theme.id === 'patriot') ? 'rgba(255,255,255,0.1)' : (theme.id === 'warm' ? pal.tokens['--pb-border'] : '#e2e8f0');
    h += '<div class="pb-tp-prev-line" style="background:' + lineColor + '"></div>';
    h += '<div class="pb-tp-prev-line pb-tp-prev-line-short" style="background:' + lineColor + '"></div>';
    h += '</div>';
    h += '<div class="pb-tp-prev-btn" style="background:' + previewAccent + '"></div>';
    h += '</div>';
    h += '</div>';
    h += '<div class="pb-tp-card-label">' + theme.label + '</div>';
    h += '<div class="pb-tp-card-desc">' + theme.desc + '</div>';
    h += '</button>';
  });
  h += '</div>';

  // Accent color picker -- only for clean and dark themes
  var accentAllowed = (savedTheme === 'clean' || savedTheme === 'dark');
  if (accentAllowed) {
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
  }

  // Boho palette picker -- only for warm theme
  if (savedTheme === 'warm') {
    h += '<div class="pb-tp-section-label">Color Palette</div>';
    h += '<div class="pb-boho-palettes">';
    PB_BOHO_PALETTES.forEach(function(pal) {
      var active = pal.id === savedBohoPalette ? ' pb-boho-pal-active' : '';
      h += '<button class="pb-boho-pal' + active + '" onclick="pbSelectBohoPalette(\'' + pal.id + '\')">';
      h += '<div class="pb-boho-pal-swatches">';
      pal.swatch.forEach(function(color) {
        h += '<span class="pb-boho-swatch" style="background:' + color + '"></span>';
      });
      h += '</div>';
      h += '<div class="pb-boho-pal-label">' + pal.label + '</div>';
      h += '<div class="pb-boho-pal-desc">' + pal.desc + '</div>';
      h += '</button>';
    });
    h += '</div>';
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
  // Clear accent override for themes with curated palettes
  if (themeId !== 'clean' && themeId !== 'dark') {
    localStorage.removeItem('ctax_pb_accent');
  }
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


// ================================================================
//  Build Boho Earth CSS -- shared by canvas + export
// ================================================================
function pbBuildBohoCSS(pal) {
  var h = pal.hero;
  var cream = h.cream;
  var accentColor = pal.tokens['--pb-accent'];
  var accentHover = pal.tokens['--pb-accent-hover'];
  var texture = pbBohoTextureSvg(accentColor);
  var wave = pbBohoWaveSvg(cream, accentColor);
  var cardBorder = pbBohoCardBorderSvg(accentColor);
  var css = '';

  // ---- Hero wave override ----
  // Must fully reset ::after from base CSS (which sets inset:0, grid bg, 60px bg-size).
  // We replace the grid overlay with a bold organic wave pinned to the bottom.
  var heroAfterReset = 'content: ""; position: absolute; top: auto; right: 0; bottom: 0; left: 0; ' +
    'width: auto; height: 160px; z-index: 1; pointer-events: none; ' +
    'background-image: url("' + wave + '"); background-size: 100% 100%; background-repeat: no-repeat; background-position: bottom center;';

  // Hero centered
  css += '.pb-hero-centered { background: url("' + texture + '"), linear-gradient(160deg, ' + h.bg1 + ' 0%, ' + h.bg2 + ' 60%, ' + h.bg3 + ' 100%); color: ' + cream + '; }\n';
  css += '.pb-hero-centered::before { background: radial-gradient(ellipse at 50% 20%, ' + h.glow + ' 0%, transparent 55%); }\n';
  css += '.pb-hero-centered::after { ' + heroAfterReset + ' }\n';
  css += '.pb-hero-centered h1 { color: ' + cream + '; }\n';
  css += '.pb-hero-centered .pb-hero-sub { color: rgba(255,255,255,0.7); }\n';
  css += '.pb-hero-centered .pb-badge { color: ' + accentHover + '; background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.12); }\n';
  css += '.pb-hero-centered .pb-btn-secondary { color: ' + cream + '; border-color: rgba(255,255,255,0.25); }\n';
  css += '.pb-hero-centered .pb-btn-secondary:hover { background: rgba(255,255,255,0.08); }\n';
  css += '.pb-hero-centered .pb-trust-stats span { color: rgba(255,255,255,0.6); }\n';
  css += '.pb-hero-centered .pb-trust-stats strong { color: ' + cream + '; }\n';

  // Hero dark
  css += '.pb-hero-dark { background: url("' + texture + '"), linear-gradient(160deg, ' + h.bg2 + ' 0%, ' + h.bg3 + ' 50%, ' + h.bg1 + ' 100%); color: ' + cream + '; }\n';
  css += '.pb-hero-dark::before { background: radial-gradient(ellipse at 30% 50%, ' + h.glow + ' 0%, transparent 50%); }\n';
  css += '.pb-hero-dark::after { ' + heroAfterReset + ' }\n';
  css += '.pb-hero-dark h1 { color: ' + cream + '; }\n';
  css += '.pb-hero-dark .pb-hero-sub { color: rgba(255,255,255,0.7); }\n';
  css += '.pb-hero-dark .pb-badge { color: ' + accentHover + '; background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.12); }\n';
  css += '.pb-hero-dark .pb-btn-secondary { color: ' + cream + '; border-color: rgba(255,255,255,0.25); }\n';

  // CTA dark
  css += '.pb-cta-dark { background: url("' + texture + '"), linear-gradient(160deg, ' + h.bg1 + ' 0%, ' + h.bg2 + ' 100%); color: ' + cream + '; }\n';
  css += '.pb-cta-dark::before { background: radial-gradient(ellipse at 50% 50%, ' + h.glow + ' 0%, transparent 50%); }\n';
  css += '.pb-cta-dark h2 { color: ' + cream + '; }\n';
  css += '.pb-cta-dark p { color: rgba(255,255,255,0.7); }\n';
  css += '.pb-cta-dark .pb-cta-trust { color: rgba(255,255,255,0.4); }\n';

  // Organic section transitions (extra bottom padding for wave)
  css += '.pb-hero-centered { padding-bottom: calc(var(--pb-space-32) + 100px); }\n';
  css += '.pb-hero-dark { padding-bottom: calc(var(--pb-space-32) + 100px); }\n';

  // Boho typography: warmer font pairing
  css += 'h1, h2, h3, h4, h5, h6 { font-family: "Playfair Display", "DM Serif Display", Georgia, serif; }\n';
  css += 'body, p, li, span, a, input, textarea, button { font-family: "DM Sans", system-ui, sans-serif; font-weight: 300; }\n';

  // Pill-shaped buttons (organic, boho feel)
  css += '.pb-btn, .pb-btn-secondary { border-radius: var(--pb-radius-full); letter-spacing: 0.03em; }\n';

  // Softer card corners + woven top border
  css += '.pb-feat-card, .pb-testi-card, .pb-cred-card, .pb-faq-item, .pb-cta-card, .pb-form-card { border-radius: var(--pb-radius-xl); overflow: hidden; }\n';
  css += '.pb-feat-card::before, .pb-testi-card::before { content: ""; display: block; height: 4px; background: url("' + cardBorder + '") repeat-x; background-size: auto 4px; margin-bottom: 0; }\n';

  // Warm-toned gradient text
  css += '.pb-gradient-text { background: linear-gradient(135deg, ' + pal.gradient[0] + ', ' + pal.gradient[1] + '); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }\n';

  // ---- Bold boho section dividers ----
  var sectionWave = pbBohoSectionDividerSvg(pal.tokens['--pb-bg-0'], accentColor);
  var sectionWaveAlt = pbBohoSectionDividerSvg(pal.tokens['--pb-bg-1'], accentColor);
  // Ensure all content sections are positioned for pseudo-elements
  css += 'section, [class*="pb-hero"], [class*="pb-cta"], [class*="pb-feat"], [class*="pb-testi"], [class*="pb-process"], [class*="pb-faq-section"], [class*="pb-form-section"], [class*="pb-trust"], [class*="pb-proof"] { position: relative; }\n';

  // Wave tops on alternating sections -- 80px tall, unmissable
  css += '.pb-section-alt { border-top: none; margin-top: 80px; }\n';
  css += '.pb-section-alt::before { content: ""; position: absolute; top: -80px; left: 0; right: 0; height: 80px; background-image: url("' + sectionWaveAlt + '"); background-size: 100% 100%; background-repeat: no-repeat; pointer-events: none; z-index: 2; }\n';
  // Normal sections also get a wave top
  css += 'section:not(.pb-section-alt):not([class*="pb-hero"]):not([class*="pb-cta-dark"]):not([class*="pb-compliance"]) { margin-top: 80px; }\n';
  css += 'section:not(.pb-section-alt):not([class*="pb-hero"]):not([class*="pb-cta-dark"]):not([class*="pb-compliance"])::before { content: ""; position: absolute; top: -80px; left: 0; right: 0; height: 80px; background-image: url("' + sectionWave + '"); background-size: 100% 100%; background-repeat: no-repeat; pointer-events: none; z-index: 2; }\n';

  // Decorative curly flourish under section headings -- bigger, bolder
  var flourish = pbBohoFlourishSvg(accentColor);
  css += '.pb-section-sub::after { content: ""; display: block; width: 200px; height: 30px; margin: 20px auto 0; background-image: url("' + flourish + '"); background-size: contain; background-repeat: no-repeat; background-position: center; }\n';

  // Horizontal wavy line divider inside sections (between content blocks)
  css += '.pb-feat-grid, .pb-testi-grid, .pb-steps-grid { position: relative; }\n';

  // Icon containers get earthy, organic blob shapes
  css += '.pb-icon-wrap { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }\n';

  // Testimonial quote marks -- big and decorative
  css += '.pb-testi-card .pb-testi-text { font-style: italic; position: relative; padding-left: 28px; }\n';
  css += '.pb-testi-card .pb-testi-text::before { content: open-quote; position: absolute; left: 0; top: -12px; font-size: 64px; line-height: 1; color: var(--pb-accent); opacity: 0.4; font-family: "Playfair Display", Georgia, serif; }\n';

  // FAQ items: relaxed, organic feel
  css += '.pb-faq-item summary { font-weight: 400; letter-spacing: 0.01em; }\n';

  // Stats/numbers get the warm gradient
  css += '.pb-stat-number, .pb-proof-number { background: linear-gradient(135deg, ' + pal.gradient[0] + ', ' + pal.gradient[1] + '); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }\n';

  // Form sections get warm border treatment
  css += '.pb-form-card { border: 1px solid var(--pb-border); border-top: 3px solid var(--pb-accent); }\n';

  // Process/steps get organic connectors
  css += '.pb-step-number { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }\n';

  return css;
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

  // For warm theme, use the active boho palette tokens
  var tokens;
  var bohoPal = null;
  if (themeId === 'warm') {
    bohoPal = pbGetActiveBohoPalette();
    tokens = Object.assign({}, bohoPal.tokens);
  } else {
    tokens = Object.assign({}, theme.tokens);
  }

  // Apply accent override -- only for themes that support it
  var accent = null;
  if (themeId === 'clean' || themeId === 'dark') {
    accent = pbGetAccentOverride();
    if (accent) {
      tokens['--pb-accent'] = accent.color;
      tokens['--pb-accent-hover'] = accent.hover;
      tokens['--pb-accent-soft'] = pbAccentSoft(accent.color);
      tokens['--pb-accent-glow'] = pbAccentGlow(accent.color);
    }
  }

  var css = ':root {\n';
  var keys = Object.keys(tokens);
  for (var i = 0; i < keys.length; i++) {
    css += '  ' + keys[i] + ': ' + tokens[keys[i]] + ';\n';
  }
  css += '}\n';

  // Override hero/CTA sections that have hardcoded dark gradients in pb-canvas.css
  var bg0 = tokens['--pb-bg-0'];
  var bg1 = tokens['--pb-bg-1'];
  var text0 = tokens['--pb-text-0'];

  if (themeId === 'clean') {
    // Light theme: reset dark-by-default sections to light backgrounds
    var text1 = tokens['--pb-text-1'];
    var text2 = tokens['--pb-text-2'];
    var border = tokens['--pb-border'];
    css += '.pb-hero-centered { background: linear-gradient(135deg, ' + bg1 + ' 0%, ' + bg0 + ' 100%); color: ' + text0 + '; }\n';
    css += '.pb-hero-centered::before { background: radial-gradient(ellipse at 50% 0%, var(--pb-accent-soft) 0%, transparent 70%); }\n';
    css += '.pb-hero-centered::after { background-image: linear-gradient(' + border + '22 1px, transparent 1px), linear-gradient(90deg, ' + border + '22 1px, transparent 1px); }\n';
    css += '.pb-hero-centered h1 { color: ' + text0 + '; }\n';
    css += '.pb-hero-centered .pb-hero-sub { color: ' + text1 + '; }\n';
    css += '.pb-hero-centered .pb-badge { color: var(--pb-accent); background: var(--pb-accent-soft); border-color: var(--pb-accent-soft); }\n';
    css += '.pb-hero-centered .pb-btn-secondary { color: ' + text0 + '; border-color: ' + border + '; }\n';
    css += '.pb-hero-centered .pb-trust-stats span { color: ' + text1 + '; }\n';
    css += '.pb-hero-centered .pb-trust-stats strong { color: ' + text0 + '; }\n';
    css += '.pb-hero-dark { background: linear-gradient(135deg, ' + bg1 + ' 0%, ' + bg0 + ' 100%); color: ' + text0 + '; }\n';
    css += '.pb-hero-dark::before { background: radial-gradient(ellipse at 30% 50%, var(--pb-accent-soft) 0%, transparent 60%); }\n';
    css += '.pb-hero-dark::after { background-image: linear-gradient(' + border + '22 1px, transparent 1px), linear-gradient(90deg, ' + border + '22 1px, transparent 1px); }\n';
    css += '.pb-hero-dark h1 { color: ' + text0 + '; }\n';
    css += '.pb-hero-dark .pb-hero-sub { color: ' + text1 + '; }\n';
    css += '.pb-hero-dark .pb-badge { color: var(--pb-accent); background: var(--pb-accent-soft); border-color: var(--pb-accent-soft); }\n';
    css += '.pb-hero-dark .pb-btn-secondary { color: ' + text0 + '; border-color: ' + border + '; }\n';
    css += '.pb-hero-dark .pb-trust-stats span { color: ' + text1 + '; }\n';
    css += '.pb-hero-dark .pb-trust-stats strong { color: ' + text0 + '; }\n';
    css += '.pb-cta-dark { background: linear-gradient(135deg, ' + bg1 + ' 0%, ' + bg0 + ' 100%); color: ' + text0 + '; }\n';
    css += '.pb-cta-dark::before { background: radial-gradient(ellipse at 50% 50%, var(--pb-accent-soft) 0%, transparent 70%); }\n';
    css += '.pb-cta-dark h2 { color: ' + text0 + '; }\n';
    css += '.pb-cta-dark p { color: ' + text1 + '; }\n';
    css += '.pb-cta-dark .pb-cta-trust { color: ' + text2 + '; }\n';
  } else if (themeId === 'dark') {
    css += '.pb-hero-centered { background: linear-gradient(135deg, ' + bg0 + ' 0%, ' + bg1 + ' 100%); }\n';
    css += '.pb-hero-dark { background: linear-gradient(135deg, ' + bg0 + ' 0%, ' + bg1 + ' 100%); }\n';
    css += '.pb-cta-dark { background: linear-gradient(135deg, ' + bg0 + ' 0%, ' + bg1 + ' 100%); }\n';
    css += '.pb-hero-split { background: ' + bg0 + '; }\n';
    css += '.pb-hero-minimal { background: ' + bg0 + '; }\n';
    css += '.pb-hero-bold { background: ' + bg0 + '; }\n';
  } else if (themeId === 'patriot') {
    var bg2 = tokens['--pb-bg-2'];
    css += '.pb-hero-centered { background: linear-gradient(135deg, ' + bg0 + ' 0%, ' + bg1 + ' 100%); }\n';
    css += '.pb-hero-centered::before { background: radial-gradient(ellipse at 50% 0%, rgba(239, 68, 68, 0.12) 0%, transparent 55%); }\n';
    css += '.pb-hero-centered .pb-badge { color: #f87171; background: rgba(239, 68, 68, 0.12); border-color: rgba(239, 68, 68, 0.18); }\n';
    css += '.pb-hero-dark { background: linear-gradient(135deg, ' + bg0 + ' 0%, ' + bg2 + ' 100%); }\n';
    css += '.pb-hero-dark::before { background: radial-gradient(ellipse at 30% 50%, rgba(239, 68, 68, 0.12) 0%, transparent 55%); }\n';
    css += '.pb-hero-dark .pb-badge { color: #f87171; background: rgba(239, 68, 68, 0.12); border-color: rgba(239, 68, 68, 0.18); }\n';
    css += '.pb-cta-dark { background: linear-gradient(135deg, ' + bg0 + ' 0%, ' + bg1 + ' 100%); }\n';
    css += '.pb-cta-dark::before { background: radial-gradient(ellipse at 50% 50%, rgba(239, 68, 68, 0.12) 0%, transparent 50%); }\n';
    css += '.pb-hero-split { background: ' + bg0 + '; }\n';
    css += '.pb-hero-minimal { background: ' + bg0 + '; }\n';
    css += '.pb-hero-bold { background: ' + bg0 + '; }\n';
  } else if (themeId === 'warm') {
    css += pbBuildBohoCSS(bohoPal);
  }

  var style = doc.createElement('style');
  style.id = styleId;
  style.textContent = css;
  doc.head.appendChild(style);

  // Inject Playfair Display font for boho theme
  if (themeId === 'warm') {
    var fontId = 'pb-boho-font';
    var existingFont = doc.getElementById(fontId);
    if (!existingFont) {
      var link = doc.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap';
      doc.head.appendChild(link);
    }
  }

  // Update body background for exported look
  doc.body.style.background = tokens['--pb-bg-0'];
  doc.body.style.color = tokens['--pb-text-0'];

  // Update toolbar theme indicator
  pbUpdateThemeIndicator(theme, accent, bohoPal);
}

function pbUpdateThemeIndicator(theme, accent, bohoPal) {
  var trigger = document.querySelector('.pb-theme-trigger');
  if (!trigger) return;
  var color;
  if (bohoPal) {
    color = bohoPal.tokens['--pb-accent'];
  } else if (accent) {
    color = accent.color;
  } else {
    color = theme.tokens['--pb-accent'];
  }
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

  // For warm theme, use the active boho palette tokens
  var tokens;
  var bohoPal = null;
  if (themeId === 'warm') {
    bohoPal = pbGetActiveBohoPalette();
    tokens = Object.assign({}, bohoPal.tokens);
  } else {
    tokens = Object.assign({}, theme.tokens);
  }

  // Only apply accent override for themes that support it
  if ((themeId === 'clean' || themeId === 'dark') && accent) {
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

  // Override hero/CTA sections with hardcoded dark gradients
  var bg0 = tokens['--pb-bg-0'];
  var bg1 = tokens['--pb-bg-1'];
  var text0 = tokens['--pb-text-0'];

  if (themeId === 'clean') {
    var text1 = tokens['--pb-text-1'];
    var text2 = tokens['--pb-text-2'];
    var border = tokens['--pb-border'];
    lines.push('.pb-hero-centered { background: linear-gradient(135deg, ' + bg1 + ' 0%, ' + bg0 + ' 100%); color: ' + text0 + '; }');
    lines.push('.pb-hero-centered::before { background: radial-gradient(ellipse at 50% 0%, var(--pb-accent-soft) 0%, transparent 70%); }');
    lines.push('.pb-hero-centered::after { background-image: linear-gradient(' + border + '22 1px, transparent 1px), linear-gradient(90deg, ' + border + '22 1px, transparent 1px); }');
    lines.push('.pb-hero-centered h1 { color: ' + text0 + '; }');
    lines.push('.pb-hero-centered .pb-hero-sub { color: ' + text1 + '; }');
    lines.push('.pb-hero-centered .pb-badge { color: var(--pb-accent); background: var(--pb-accent-soft); border-color: var(--pb-accent-soft); }');
    lines.push('.pb-hero-centered .pb-btn-secondary { color: ' + text0 + '; border-color: ' + border + '; }');
    lines.push('.pb-hero-centered .pb-trust-stats span { color: ' + text1 + '; }');
    lines.push('.pb-hero-centered .pb-trust-stats strong { color: ' + text0 + '; }');
    lines.push('.pb-hero-dark { background: linear-gradient(135deg, ' + bg1 + ' 0%, ' + bg0 + ' 100%); color: ' + text0 + '; }');
    lines.push('.pb-hero-dark::before { background: radial-gradient(ellipse at 30% 50%, var(--pb-accent-soft) 0%, transparent 60%); }');
    lines.push('.pb-hero-dark::after { background-image: linear-gradient(' + border + '22 1px, transparent 1px), linear-gradient(90deg, ' + border + '22 1px, transparent 1px); }');
    lines.push('.pb-hero-dark h1 { color: ' + text0 + '; }');
    lines.push('.pb-hero-dark .pb-hero-sub { color: ' + text1 + '; }');
    lines.push('.pb-hero-dark .pb-badge { color: var(--pb-accent); background: var(--pb-accent-soft); border-color: var(--pb-accent-soft); }');
    lines.push('.pb-hero-dark .pb-btn-secondary { color: ' + text0 + '; border-color: ' + border + '; }');
    lines.push('.pb-hero-dark .pb-trust-stats span { color: ' + text1 + '; }');
    lines.push('.pb-hero-dark .pb-trust-stats strong { color: ' + text0 + '; }');
    lines.push('.pb-cta-dark { background: linear-gradient(135deg, ' + bg1 + ' 0%, ' + bg0 + ' 100%); color: ' + text0 + '; }');
    lines.push('.pb-cta-dark::before { background: radial-gradient(ellipse at 50% 50%, var(--pb-accent-soft) 0%, transparent 70%); }');
    lines.push('.pb-cta-dark h2 { color: ' + text0 + '; }');
    lines.push('.pb-cta-dark p { color: ' + text1 + '; }');
    lines.push('.pb-cta-dark .pb-cta-trust { color: ' + text2 + '; }');
  } else if (themeId === 'dark') {
    lines.push('.pb-hero-centered { background: linear-gradient(135deg, ' + bg0 + ' 0%, ' + bg1 + ' 100%); }');
    lines.push('.pb-hero-dark { background: linear-gradient(135deg, ' + bg0 + ' 0%, ' + bg1 + ' 100%); }');
    lines.push('.pb-cta-dark { background: linear-gradient(135deg, ' + bg0 + ' 0%, ' + bg1 + ' 100%); }');
  } else if (themeId === 'patriot') {
    var bg2 = tokens['--pb-bg-2'];
    lines.push('.pb-hero-centered { background: linear-gradient(135deg, ' + bg0 + ' 0%, ' + bg1 + ' 100%); }');
    lines.push('.pb-hero-centered::before { background: radial-gradient(ellipse at 50% 0%, rgba(239, 68, 68, 0.12) 0%, transparent 55%); }');
    lines.push('.pb-hero-centered .pb-badge { color: #f87171; background: rgba(239, 68, 68, 0.12); border-color: rgba(239, 68, 68, 0.18); }');
    lines.push('.pb-hero-dark { background: linear-gradient(135deg, ' + bg0 + ' 0%, ' + bg2 + ' 100%); }');
    lines.push('.pb-hero-dark::before { background: radial-gradient(ellipse at 30% 50%, rgba(239, 68, 68, 0.12) 0%, transparent 55%); }');
    lines.push('.pb-hero-dark .pb-badge { color: #f87171; background: rgba(239, 68, 68, 0.12); border-color: rgba(239, 68, 68, 0.18); }');
    lines.push('.pb-cta-dark { background: linear-gradient(135deg, ' + bg0 + ' 0%, ' + bg1 + ' 100%); }');
    lines.push('.pb-cta-dark::before { background: radial-gradient(ellipse at 50% 50%, rgba(239, 68, 68, 0.12) 0%, transparent 50%); }');
  } else if (themeId === 'warm') {
    lines.push(pbBuildBohoCSS(bohoPal));
    // Add Playfair Display font import for exported page
    lines.unshift('@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap");');
  }

  return lines.join('\n');
}

// Legacy compat
function pbBuildPresetSwatches() { /* no-op, replaced by theme panel */ }
function pbApplyColorPreset() { /* no-op */ }
