// -- Page Builder: Theme System --
// Semantic token flipping. Each theme re-declares --pb-* tokens on :root.
// No per-selector overrides needed because all blocks reference tokens.

// ================================================================
//  Boho Earth Sub-Palettes
//  The warm theme uses one of these curated palettes instead of
//  a generic accent picker. Each palette has its own hero gradient,
//  accent, and warm-tone vibe.
//
//  Palette direction (from reference images):
//  - Layered abstract mountain silhouettes
//  - Warm earth tones: cream, terracotta, rust, muted sage, charcoal
//  - Gold/warm accent lines as separators
//  - Proper contrast: dark text on light bg, light text on dark sections
// ================================================================
var PB_BOHO_PALETTES = [
  {
    id: 'desert',
    label: 'Desert Sand',
    desc: 'Terracotta, golden hour, warm clay',
    swatch: ['#a8784e', '#946640', '#7d5430', '#6b4828'],
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
      '--pb-accent': '#946640',
      '--pb-accent-hover': '#a8784e',
      '--pb-accent-soft': 'rgba(148, 102, 64, 0.10)',
      '--pb-accent-glow': 'rgba(148, 102, 64, 0.25)',
      '--pb-shadow-sm': '0 1px 3px rgba(44, 34, 24, 0.05)',
      '--pb-shadow-md': '0 4px 12px rgba(44, 34, 24, 0.07), 0 1px 3px rgba(44, 34, 24, 0.04)',
      '--pb-shadow-lg': '0 12px 40px rgba(44, 34, 24, 0.09), 0 4px 12px rgba(44, 34, 24, 0.05)',
      '--pb-shadow-xl': '0 24px 80px rgba(44, 34, 24, 0.12), 0 4px 12px rgba(44, 34, 24, 0.05)',
      '--pb-glass-bg': 'rgba(250, 246, 241, 0.85)',
      '--pb-glass-border': 'rgba(214, 203, 191, 0.4)'
    },
    // Mountain palette: cream sky -> terracotta peaks -> warm brown -> charcoal base
    mountains: { sky: '#faf6f1', peak: '#a8784e', mid: '#8b6844', base: '#3d2e22', accent: '#c4956a' },
    hero: { bg1: '#3d2e22', bg2: '#2c2218', bg3: '#4a3828', glow: 'rgba(196, 149, 106, 0.18)', cream: '#faf6f1' },
    gradient: ['#946640', '#a8784e']
  },
  {
    id: 'sage',
    label: 'Mountain Sage',
    desc: 'Muted sage, cream, warm charcoal',
    // Sage is MUTED -- olive/grey-green, not bright green
    swatch: ['#7d8572', '#6b7360', '#5a6250', '#4a5240'],
    tokens: {
      '--pb-bg-0': '#f7f6f2',
      '--pb-bg-1': '#efede6',
      '--pb-bg-2': '#e3e0d6',
      '--pb-bg-3': '#d4d0c4',
      '--pb-text-0': '#2a2822',
      '--pb-text-1': '#5a5648',
      '--pb-text-2': '#86826e',
      '--pb-border': '#d4d0c4',
      '--pb-border-subtle': '#e3e0d6',
      '--pb-accent': '#6b7360',
      '--pb-accent-hover': '#7d8572',
      '--pb-accent-soft': 'rgba(107, 115, 96, 0.10)',
      '--pb-accent-glow': 'rgba(107, 115, 96, 0.22)',
      '--pb-shadow-sm': '0 1px 3px rgba(42, 40, 34, 0.05)',
      '--pb-shadow-md': '0 4px 12px rgba(42, 40, 34, 0.07), 0 1px 3px rgba(42, 40, 34, 0.04)',
      '--pb-shadow-lg': '0 12px 40px rgba(42, 40, 34, 0.09), 0 4px 12px rgba(42, 40, 34, 0.05)',
      '--pb-shadow-xl': '0 24px 80px rgba(42, 40, 34, 0.12), 0 4px 12px rgba(42, 40, 34, 0.05)',
      '--pb-glass-bg': 'rgba(247, 246, 242, 0.85)',
      '--pb-glass-border': 'rgba(212, 208, 196, 0.4)'
    },
    // Teal-green mountains (like the triptych painting) -- cream sky -> teal -> dark blue-grey -> charcoal
    mountains: { sky: '#f7f6f2', peak: '#6d8a7a', mid: '#4a6860', base: '#2d3830', accent: '#7d8572' },
    hero: { bg1: '#2d3830', bg2: '#22302a', bg3: '#384840', glow: 'rgba(118, 126, 104, 0.18)', cream: '#f7f6f2' },
    gradient: ['#5a6250', '#7d8572']
  },
  {
    id: 'clay',
    label: 'Terracotta',
    desc: 'Burnt sienna, rust, deep clay',
    swatch: ['#c0623e', '#a8543a', '#8f4630', '#783826'],
    tokens: {
      '--pb-bg-0': '#faf5f0',
      '--pb-bg-1': '#f3ebe3',
      '--pb-bg-2': '#e8ddd3',
      '--pb-bg-3': '#d6c6b8',
      '--pb-text-0': '#2c1e16',
      '--pb-text-1': '#5c4538',
      '--pb-text-2': '#8a7060',
      '--pb-border': '#d6c6b8',
      '--pb-border-subtle': '#e8ddd3',
      '--pb-accent': '#a8543a',
      '--pb-accent-hover': '#c0623e',
      '--pb-accent-soft': 'rgba(168, 84, 58, 0.10)',
      '--pb-accent-glow': 'rgba(168, 84, 58, 0.25)',
      '--pb-shadow-sm': '0 1px 3px rgba(44, 30, 22, 0.05)',
      '--pb-shadow-md': '0 4px 12px rgba(44, 30, 22, 0.07), 0 1px 3px rgba(44, 30, 22, 0.04)',
      '--pb-shadow-lg': '0 12px 40px rgba(44, 30, 22, 0.09), 0 4px 12px rgba(44, 30, 22, 0.05)',
      '--pb-shadow-xl': '0 24px 80px rgba(44, 30, 22, 0.12), 0 4px 12px rgba(44, 30, 22, 0.05)',
      '--pb-glass-bg': 'rgba(250, 245, 240, 0.85)',
      '--pb-glass-border': 'rgba(214, 198, 184, 0.4)'
    },
    // Desert sunset mountains -- cream sky -> peach-orange -> rust -> charcoal base
    mountains: { sky: '#faf5f0', peak: '#c0623e', mid: '#8f4630', base: '#3a261c', accent: '#d4936a' },
    hero: { bg1: '#3a261c', bg2: '#2c1e16', bg3: '#4a3228', glow: 'rgba(168, 84, 58, 0.18)', cream: '#faf5f0' },
    gradient: ['#a8543a', '#c0623e']
  }
];


var PB_THEMES = [
  {
    id: 'clean',
    label: 'Clean Light',
    desc: 'Minimal, versatile -- any accent works',
    preview: { bg: '#ffffff', hero: '#fafafa', accent: '#18181B' },
    tokens: {
      '--pb-bg-0': '#ffffff',
      '--pb-bg-1': '#fafafa',
      '--pb-bg-2': '#f4f4f5',
      '--pb-bg-3': '#e4e4e7',
      '--pb-text-0': '#18181b',
      '--pb-text-1': '#71717a',
      '--pb-text-2': '#8a8a92',
      '--pb-border': '#e4e4e7',
      '--pb-border-subtle': '#f4f4f5',
      '--pb-accent': '#18181b',
      '--pb-accent-hover': '#27272a',
      '--pb-accent-soft': 'rgba(24, 24, 27, 0.06)',
      '--pb-accent-glow': 'rgba(24, 24, 27, 0.15)',
      // Shadow-border hybrid (Vercel-style)
      '--pb-shadow-sm': '0 0 0 1px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.05)',
      '--pb-shadow-md': '0 0 0 1px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.04)',
      '--pb-shadow-lg': '0 0 0 1px rgba(0,0,0,0.03), 0 4px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08)',
      '--pb-shadow-xl': '0 0 0 1px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 24px 48px rgba(0,0,0,0.12)',
      '--pb-glass-bg': 'rgba(255, 255, 255, 0.8)',
      '--pb-glass-border': 'rgba(0, 0, 0, 0.04)'
    }
  },
  {
    id: 'dark',
    label: 'Monochrome',
    desc: 'Pure black, white, grey -- zero color',
    preview: { bg: '#0a0a0a', hero: '#141414', accent: '#ffffff' },
    tokens: {
      '--pb-bg-0': '#0a0a0a',
      '--pb-bg-1': '#141414',
      '--pb-bg-2': '#1c1c1c',
      '--pb-bg-3': '#262626',
      '--pb-text-0': '#ededed',
      '--pb-text-1': '#a0a0a0',
      '--pb-text-2': '#6b6b6b',
      '--pb-border': 'rgba(255,255,255,0.08)',
      '--pb-border-subtle': 'rgba(255,255,255,0.04)',
      '--pb-accent': '#ffffff',
      '--pb-accent-hover': '#ededed',
      '--pb-accent-soft': 'rgba(255, 255, 255, 0.06)',
      '--pb-accent-glow': 'rgba(255, 255, 255, 0.12)',
      '--pb-btn-text': '#0a0a0a',
      '--pb-shadow-sm': '0 1px 2px rgba(0,0,0,0.4)',
      '--pb-shadow-md': '0 4px 12px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3)',
      '--pb-shadow-lg': '0 12px 40px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.3)',
      '--pb-shadow-xl': '0 24px 80px rgba(0,0,0,0.7), 0 4px 12px rgba(0,0,0,0.3)',
      '--pb-glass-bg': 'rgba(20, 20, 20, 0.8)',
      '--pb-glass-border': 'rgba(255, 255, 255, 0.06)'
    }
  },
  {
    id: 'patriot',
    label: 'Authority',
    desc: 'Navy + crimson -- institutional trust',
    preview: { bg: '#ffffff', hero: '#0A1628', accent: '#B82025' },
    tokens: {
      // Authority theme uses WHITE base + dark navy hero sections (not all-navy)
      '--pb-bg-0': '#ffffff',
      '--pb-bg-1': '#f7f8fa',
      '--pb-bg-2': '#eef0f4',
      '--pb-bg-3': '#d8dce3',
      '--pb-text-0': '#1a1f2b',
      '--pb-text-1': '#5a6577',
      '--pb-text-2': '#8a94a6',
      '--pb-border': '#d8dce3',
      '--pb-border-subtle': '#eef0f4',
      // Muted crimson -- Harvard, not fire truck
      '--pb-accent': '#B82025',
      '--pb-accent-hover': '#9A1A1E',
      '--pb-accent-soft': 'rgba(184, 32, 37, 0.08)',
      '--pb-accent-glow': 'rgba(184, 32, 37, 0.20)',
      // Navy-tinted shadows
      '--pb-shadow-sm': '0 1px 2px rgba(27, 46, 75, 0.06)',
      '--pb-shadow-md': '0 4px 12px rgba(27, 46, 75, 0.08), 0 1px 3px rgba(27, 46, 75, 0.05)',
      '--pb-shadow-lg': '0 12px 40px rgba(27, 46, 75, 0.10), 0 4px 12px rgba(27, 46, 75, 0.06)',
      '--pb-shadow-xl': '0 24px 80px rgba(27, 46, 75, 0.14), 0 4px 12px rgba(27, 46, 75, 0.06)',
      '--pb-glass-bg': 'rgba(255, 255, 255, 0.85)',
      '--pb-glass-border': 'rgba(27, 46, 75, 0.08)'
    }
  },
  {
    id: 'midnight',
    label: 'Midnight',
    desc: 'Dark with ambient gradient glows',
    preview: { bg: '#09090b', hero: '#131316', accent: '#818cf8' },
    tokens: {
      '--pb-bg-0': '#09090b',
      '--pb-bg-1': '#131316',
      '--pb-bg-2': '#1c1c22',
      '--pb-bg-3': '#26262e',
      '--pb-text-0': '#ececef',
      '--pb-text-1': '#9393a0',
      '--pb-text-2': '#5c5c6b',
      '--pb-border': 'rgba(255,255,255,0.08)',
      '--pb-border-subtle': 'rgba(255,255,255,0.04)',
      '--pb-accent': '#818cf8',
      '--pb-accent-hover': '#a5b4fc',
      '--pb-accent-soft': 'rgba(129, 140, 248, 0.10)',
      '--pb-accent-glow': 'rgba(129, 140, 248, 0.25)',
      '--pb-btn-text': '#0a0a0f',
      '--pb-shadow-sm': '0 1px 2px rgba(0,0,0,0.4)',
      '--pb-shadow-md': '0 4px 12px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3)',
      '--pb-shadow-lg': '0 12px 40px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.3)',
      '--pb-shadow-xl': '0 24px 80px rgba(0,0,0,0.7), 0 4px 12px rgba(0,0,0,0.3)',
      '--pb-glass-bg': 'rgba(19, 19, 22, 0.7)',
      '--pb-glass-border': 'rgba(255, 255, 255, 0.08)'
    }
  },
  {
    id: 'warm',
    label: 'Boho Earth',
    desc: 'Organic mountains, warm earth tones',
    preview: { bg: '#faf6f1', hero: '#3d2e22', accent: '#946640' },
    tokens: PB_BOHO_PALETTES[0].tokens
  },
  {
    id: 'corporate',
    label: 'Corporate Blue',
    desc: 'Professional blue, high trust, clean',
    preview: { bg: '#f8fafc', hero: '#1e3a5f', accent: '#2563eb' },
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
      '--pb-accent': '#2563eb',
      '--pb-accent-hover': '#3b82f6',
      '--pb-accent-soft': 'rgba(37, 99, 235, 0.08)',
      '--pb-accent-glow': 'rgba(37, 99, 235, 0.20)',
      '--pb-shadow-sm': '0 1px 2px rgba(15, 23, 42, 0.05)',
      '--pb-shadow-md': '0 4px 12px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.04)',
      '--pb-shadow-lg': '0 12px 40px rgba(15, 23, 42, 0.10), 0 4px 12px rgba(15, 23, 42, 0.05)',
      '--pb-shadow-xl': '0 24px 80px rgba(15, 23, 42, 0.12), 0 4px 12px rgba(15, 23, 42, 0.05)',
      '--pb-glass-bg': 'rgba(255, 255, 255, 0.85)',
      '--pb-glass-border': 'rgba(37, 99, 235, 0.08)'
    }
  },
  {
    id: 'luxury',
    label: 'Luxury Dark',
    desc: 'Black + gold -- premium feel',
    preview: { bg: '#0c0c0c', hero: '#1a1a1a', accent: '#d4a843' },
    tokens: {
      '--pb-bg-0': '#0c0c0c',
      '--pb-bg-1': '#161616',
      '--pb-bg-2': '#1f1f1f',
      '--pb-bg-3': '#2a2a2a',
      '--pb-text-0': '#f5f0e8',
      '--pb-text-1': '#b8a88a',
      '--pb-text-2': '#7a6e5c',
      '--pb-border': 'rgba(212, 168, 67, 0.15)',
      '--pb-border-subtle': 'rgba(212, 168, 67, 0.06)',
      '--pb-accent': '#d4a843',
      '--pb-accent-hover': '#e2bc5e',
      '--pb-accent-soft': 'rgba(212, 168, 67, 0.10)',
      '--pb-accent-glow': 'rgba(212, 168, 67, 0.25)',
      '--pb-btn-text': '#0c0c0c',
      '--pb-shadow-sm': '0 1px 2px rgba(0,0,0,0.5)',
      '--pb-shadow-md': '0 4px 12px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.4)',
      '--pb-shadow-lg': '0 12px 40px rgba(0,0,0,0.7), 0 4px 12px rgba(0,0,0,0.4)',
      '--pb-shadow-xl': '0 24px 80px rgba(0,0,0,0.8), 0 4px 12px rgba(0,0,0,0.4)',
      '--pb-glass-bg': 'rgba(22, 22, 22, 0.85)',
      '--pb-glass-border': 'rgba(212, 168, 67, 0.12)'
    }
  },
  {
    id: 'fresh',
    label: 'Fresh Green',
    desc: 'Clean, natural, trustworthy',
    preview: { bg: '#fafdf7', hero: '#f0fdf4', accent: '#16a34a' },
    tokens: {
      '--pb-bg-0': '#fafdf7',
      '--pb-bg-1': '#f0fdf4',
      '--pb-bg-2': '#dcfce7',
      '--pb-bg-3': '#bbf7d0',
      '--pb-text-0': '#14532d',
      '--pb-text-1': '#3f6212',
      '--pb-text-2': '#65a30d',
      '--pb-border': '#bbf7d0',
      '--pb-border-subtle': '#dcfce7',
      '--pb-accent': '#16a34a',
      '--pb-accent-hover': '#22c55e',
      '--pb-accent-soft': 'rgba(22, 163, 74, 0.08)',
      '--pb-accent-glow': 'rgba(22, 163, 74, 0.20)',
      '--pb-shadow-sm': '0 1px 2px rgba(20, 83, 45, 0.05)',
      '--pb-shadow-md': '0 4px 12px rgba(20, 83, 45, 0.07), 0 1px 3px rgba(20, 83, 45, 0.04)',
      '--pb-shadow-lg': '0 12px 40px rgba(20, 83, 45, 0.09), 0 4px 12px rgba(20, 83, 45, 0.05)',
      '--pb-shadow-xl': '0 24px 80px rgba(20, 83, 45, 0.12), 0 4px 12px rgba(20, 83, 45, 0.05)',
      '--pb-glass-bg': 'rgba(250, 253, 247, 0.85)',
      '--pb-glass-border': 'rgba(22, 163, 74, 0.08)'
    }
  },
  {
    id: 'sunset',
    label: 'Warm Sunset',
    desc: 'Orange + coral -- energetic, warm',
    preview: { bg: '#fffbeb', hero: '#fff7ed', accent: '#ea580c' },
    tokens: {
      '--pb-bg-0': '#fffbeb',
      '--pb-bg-1': '#fff7ed',
      '--pb-bg-2': '#ffedd5',
      '--pb-bg-3': '#fed7aa',
      '--pb-text-0': '#431407',
      '--pb-text-1': '#7c2d12',
      '--pb-text-2': '#c2410c',
      '--pb-border': '#fed7aa',
      '--pb-border-subtle': '#ffedd5',
      '--pb-accent': '#ea580c',
      '--pb-accent-hover': '#f97316',
      '--pb-accent-soft': 'rgba(234, 88, 12, 0.08)',
      '--pb-accent-glow': 'rgba(234, 88, 12, 0.20)',
      '--pb-shadow-sm': '0 1px 2px rgba(67, 20, 7, 0.05)',
      '--pb-shadow-md': '0 4px 12px rgba(67, 20, 7, 0.07), 0 1px 3px rgba(67, 20, 7, 0.04)',
      '--pb-shadow-lg': '0 12px 40px rgba(67, 20, 7, 0.09), 0 4px 12px rgba(67, 20, 7, 0.05)',
      '--pb-shadow-xl': '0 24px 80px rgba(67, 20, 7, 0.12), 0 4px 12px rgba(67, 20, 7, 0.05)',
      '--pb-glass-bg': 'rgba(255, 251, 235, 0.85)',
      '--pb-glass-border': 'rgba(234, 88, 12, 0.08)'
    }
  }
];

// Accent color palette -- user picks one to override accent tokens
// Available on Clean Light only (other themes have curated palettes)
var PB_ACCENT_COLORS = [
  { id: 'default', color: '#18181b', hover: '#27272a', label: 'Default' },
  { id: 'blue',    color: '#2563eb', hover: '#3b82f6', label: 'Blue' },
  { id: 'red',     color: '#dc2626', hover: '#ef4444', label: 'Red' },
  { id: 'green',   color: '#16a34a', hover: '#22c55e', label: 'Green' },
  { id: 'orange',  color: '#ea580c', hover: '#f97316', label: 'Orange' },
  { id: 'purple',  color: '#7c3aed', hover: '#8b5cf6', label: 'Purple' },
  { id: 'teal',    color: '#0d9488', hover: '#14b8a6', label: 'Teal' },
  { id: 'pink',    color: '#db2777', hover: '#ec4899', label: 'Pink' },
  { id: 'slate',   color: '#475569', hover: '#64748b', label: 'Slate' }
];


// ================================================================
//  Font Pairings (10 curated Google Fonts combos)
// ================================================================

var PB_FONT_PAIRINGS = [
  { id: 'classic', label: 'Classic', heading: 'DM Serif Display', body: 'DM Sans', desc: 'Default -- elegant serif + clean sans', googleUrl: '' },
  { id: 'modern', label: 'Modern', heading: 'Inter', body: 'Inter', desc: 'Clean and geometric', googleUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap' },
  { id: 'editorial', label: 'Editorial', heading: 'Playfair Display', body: 'Source Sans 3', desc: 'Magazine-style contrast', googleUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+3:wght@300;400;600&display=swap' },
  { id: 'geometric', label: 'Geometric', heading: 'Space Grotesk', body: 'DM Sans', desc: 'Tech-forward precision', googleUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap' },
  { id: 'humanist', label: 'Humanist', heading: 'Libre Baskerville', body: 'Nunito Sans', desc: 'Warm and readable', googleUrl: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Nunito+Sans:wght@300;400;600&display=swap' },
  { id: 'bold', label: 'Bold', heading: 'Oswald', body: 'Lato', desc: 'High impact headlines', googleUrl: 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Lato:wght@300;400;700&display=swap' },
  { id: 'elegant', label: 'Elegant', heading: 'Cormorant Garamond', body: 'Montserrat', desc: 'Luxury and refinement', googleUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Montserrat:wght@300;400;600&display=swap' },
  { id: 'techy', label: 'Techy', heading: 'JetBrains Mono', body: 'Inter', desc: 'Developer aesthetic', googleUrl: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@300;400;600&display=swap' },
  { id: 'warm', label: 'Warm', heading: 'Merriweather', body: 'Open Sans', desc: 'Friendly and approachable', googleUrl: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Open+Sans:wght@300;400;600&display=swap' },
  { id: 'clean', label: 'Clean', heading: 'Poppins', body: 'Poppins', desc: 'Round and modern', googleUrl: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap' }
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
//  SVG generators -- Boho Earth
// ================================================================

// Abstract layered mountain landscape (inspired by reference images)
// Creates overlapping mountain silhouettes with gold accent lines between layers
function pbBohoMountainSvg(mtn) {
  var sky = encodeURIComponent(mtn.sky);
  var peak = encodeURIComponent(mtn.peak);
  var mid = encodeURIComponent(mtn.mid);
  var base = encodeURIComponent(mtn.base);
  var accent = encodeURIComponent(mtn.accent);
  // Sun circle (golden hour)
  var sun = encodeURIComponent(mtn.accent);
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 500' preserveAspectRatio='xMidYMid slice'%3E" +
    // Sky background
    "%3Crect width='1440' height='500' fill='" + sky + "'/%3E" +
    // Sun circle
    "%3Ccircle cx='320' cy='140' r='50' fill='" + sun + "' opacity='0.6'/%3E" +
    // Back mountain range (lightest)
    "%3Cpath fill='" + peak + "' opacity='0.4' d='M0,280 C180,180 320,200 500,160 C680,120 820,200 1000,170 C1180,140 1300,190 1440,210 L1440,500 L0,500Z'/%3E" +
    // Gold accent line on back range
    "%3Cpath fill='none' stroke='" + accent + "' stroke-width='1.5' opacity='0.3' d='M0,280 C180,180 320,200 500,160 C680,120 820,200 1000,170 C1180,140 1300,190 1440,210'/%3E" +
    // Mid mountain range
    "%3Cpath fill='" + peak + "' opacity='0.7' d='M0,330 C200,250 400,290 600,240 C800,190 1000,270 1200,230 C1350,210 1400,250 1440,260 L1440,500 L0,500Z'/%3E" +
    // Gold accent line on mid range
    "%3Cpath fill='none' stroke='" + accent + "' stroke-width='1' opacity='0.25' d='M0,330 C200,250 400,290 600,240 C800,190 1000,270 1200,230 C1350,210 1400,250 1440,260'/%3E" +
    // Front-mid range (darker)
    "%3Cpath fill='" + mid + "' d='M0,370 C240,310 480,360 720,320 C960,280 1200,340 1440,330 L1440,500 L0,500Z'/%3E" +
    // Foreground mountain (darkest)
    "%3Cpath fill='" + base + "' d='M0,420 C200,380 440,410 700,390 C960,370 1180,400 1440,380 L1440,500 L0,500Z'/%3E" +
    "%3C/svg%3E";
}

// Organic wave for hero bottom transition
function pbBohoWaveSvg(fillColor, accentColor) {
  var fill = encodeURIComponent(fillColor);
  var accent = accentColor ? encodeURIComponent(accentColor) : fill;
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 200' preserveAspectRatio='none'%3E" +
    "%3Cpath fill='" + fill + "' opacity='0.25' d='M0,40 C320,120 640,0 960,80 C1120,120 1280,20 1440,40 L1440,200 L0,200Z'/%3E" +
    "%3Cpath fill='" + fill + "' opacity='0.55' d='M0,80 C200,130 440,40 720,90 C1000,140 1200,50 1440,80 L1440,200 L0,200Z'/%3E" +
    "%3Cpath fill='" + fill + "' d='M0,120 C240,160 480,80 720,120 C960,160 1200,75 1440,120 L1440,200 L0,200Z'/%3E" +
    "%3Cpath fill='none' stroke='" + accent + "' stroke-width='1.5' opacity='0.35' d='M0,78 C200,128 440,38 720,88 C1000,138 1200,48 1440,78'/%3E" +
    "%3C/svg%3E";
}

// Section divider wave
function pbBohoSectionDividerSvg(bgColor, accentColor) {
  var bg = encodeURIComponent(bgColor);
  var r = parseInt(accentColor.slice(1, 3), 16);
  var g = parseInt(accentColor.slice(3, 5), 16);
  var b = parseInt(accentColor.slice(5, 7), 16);
  var accentLine = encodeURIComponent('rgba(' + r + ',' + g + ',' + b + ',0.25)');
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 80' preserveAspectRatio='none'%3E" +
    "%3Cpath fill='" + bg + "' d='M0,40 C240,70 480,15 720,40 C960,65 1200,15 1440,40 L1440,80 L0,80Z'/%3E" +
    "%3Cpath fill='none' stroke='" + accentLine + "' stroke-width='1.5' d='M0,38 C240,68 480,13 720,38 C960,63 1200,13 1440,38'/%3E" +
    "%3C/svg%3E";
}

// Decorative flourish under headings
function pbBohoFlourishSvg(accentColor) {
  var r = parseInt(accentColor.slice(1, 3), 16);
  var g = parseInt(accentColor.slice(3, 5), 16);
  var b = parseInt(accentColor.slice(5, 7), 16);
  var c = encodeURIComponent('rgba(' + r + ',' + g + ',' + b + ',0.45)');
  var cFaint = encodeURIComponent('rgba(' + r + ',' + g + ',' + b + ',0.18)');
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 30'%3E" +
    "%3Cpath d='M15,15 C35,3 55,27 80,15 C105,3 125,27 150,15 C165,8 180,18 185,15' fill='none' stroke='" + c + "' stroke-width='1.8' stroke-linecap='round'/%3E" +
    "%3Cpath d='M45,8 C50,2 56,2 52,8' fill='" + cFaint + "' stroke='" + c + "' stroke-width='0.8'/%3E" +
    "%3Cpath d='M120,22 C125,28 131,28 127,22' fill='" + cFaint + "' stroke='" + c + "' stroke-width='0.8'/%3E" +
    "%3Cpath d='M100,12 L103,15 L100,18 L97,15 Z' fill='" + c + "'/%3E" +
    "%3Ccircle cx='12' cy='15' r='2' fill='" + c + "'/%3E" +
    "%3Ccircle cx='188' cy='15' r='2' fill='" + c + "'/%3E" +
    "%3C/svg%3E";
}

// Woven card top border
function pbBohoCardBorderSvg(accentColor) {
  var r = parseInt(accentColor.slice(1, 3), 16);
  var g = parseInt(accentColor.slice(3, 5), 16);
  var b = parseInt(accentColor.slice(5, 7), 16);
  var c = 'rgba(' + r + ',' + g + ',' + b + ',0.3)';
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='6' viewBox='0 0 200 6'%3E" +
    "%3Cpath d='M0,3 Q10,0 20,3 T40,3 T60,3 T80,3 T100,3 T120,3 T140,3 T160,3 T180,3 T200,3' fill='none' stroke='" + encodeURIComponent(c) + "' stroke-width='1.5'/%3E" +
    "%3Cpath d='M0,3 Q10,6 20,3 T40,3 T60,3 T80,3 T100,3 T120,3 T140,3 T160,3 T180,3 T200,3' fill='none' stroke='" + encodeURIComponent(c) + "' stroke-width='1.5'/%3E" +
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
    h += '<button class="pb-tp-card' + active + '" onclick="pbSelectTheme(\'' + theme.id + '\')">';
    h += '<div class="pb-tp-preview" style="background:' + theme.preview.bg + '">';
    h += '<div class="pb-tp-prev-hero" style="background:' + theme.preview.hero + '"></div>';
    h += '<div class="pb-tp-prev-accent" style="background:' + theme.preview.accent + '"></div>';
    h += '</div>';
    h += '<div class="pb-tp-label">' + theme.label + '</div>';
    h += '<div class="pb-tp-desc">' + theme.desc + '</div>';
    h += '</button>';
  });
  h += '</div>';

  // Accent colors -- only for Clean Light
  if (savedTheme === 'clean') {
    h += '<div class="pb-tp-section-label">Accent Color</div>';
    h += '<div class="pb-tp-accents">';
    PB_ACCENT_COLORS.forEach(function(ac) {
      var active = ac.id === savedAccent || (!savedAccent && ac.id === 'default') ? ' pb-tp-accent-active' : '';
      h += '<button class="pb-tp-accent' + active + '" style="background:' + ac.color + '" onclick="pbSelectAccent(\'' + ac.id + '\')" title="' + ac.label + '"></button>';
    });
    h += '</div>';
  }

  // Boho palettes -- only for warm theme
  if (savedTheme === 'warm') {
    h += '<div class="pb-tp-section-label">Palette</div>';
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

  // Font picker
  var savedFont = localStorage.getItem('ctax_pb_font') || 'classic';
  h += '<div class="pb-tp-section-label">Font Pairing</div>';
  h += '<div class="pb-tp-fonts">';
  PB_FONT_PAIRINGS.forEach(function(fp) {
    var active = fp.id === savedFont ? ' pb-tp-font-active' : '';
    h += '<button class="pb-tp-font' + active + '" onclick="pbSelectFont(\'' + fp.id + '\')">';
    h += '<span class="pb-tp-font-sample" style="font-family:\'' + fp.heading + '\', serif">Aa</span>';
    h += '<span class="pb-tp-font-info">';
    h += '<span class="pb-tp-font-name">' + fp.label + '</span>';
    h += '<span class="pb-tp-font-desc">' + fp.desc + '</span>';
    h += '</span>';
    h += '</button>';
  });
  h += '</div>';

  // Section background picker
  h += '<div class="pb-tp-section-label">Section Backgrounds</div>';
  h += '<div class="pb-tp-bg-options">';
  var bgOptions = [
    { cls: '', label: 'Default' },
    { cls: 'pb-bg-gradient-warm', label: 'Warm' },
    { cls: 'pb-bg-gradient-cool', label: 'Cool' },
    { cls: 'pb-bg-gradient-sunset', label: 'Sunset' },
    { cls: 'pb-bg-gradient-forest', label: 'Forest' },
    { cls: 'pb-bg-pattern-dots', label: 'Dots' },
    { cls: 'pb-bg-pattern-grid', label: 'Grid' },
    { cls: 'pb-bg-pattern-diagonal', label: 'Diagonal' }
  ];
  bgOptions.forEach(function(opt) {
    h += '<button class="pb-tp-bg-btn" onclick="pbApplySectionBg(\'' + opt.cls + '\')" title="' + opt.label + '">';
    h += '<span class="pb-tp-bg-preview ' + opt.cls + '"></span>';
    h += '<span>' + opt.label + '</span>';
    h += '</button>';
  });
  h += '</div>';
  h += '<p class="pb-tp-bg-hint">Select a section in the editor, then click a background to apply it.</p>';

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
  if (themeId !== 'clean') {
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

function pbSelectFont(fontId) {
  localStorage.setItem('ctax_pb_font', fontId);
  pbApplyFontToCanvas();
  pbBuildThemePanel();
}

function pbApplyFontToCanvas() {
  if (!pbEditor) return;
  var fontId = localStorage.getItem('ctax_pb_font') || 'classic';
  var pairing = null;
  for (var i = 0; i < PB_FONT_PAIRINGS.length; i++) {
    if (PB_FONT_PAIRINGS[i].id === fontId) { pairing = PB_FONT_PAIRINGS[i]; break; }
  }
  if (!pairing) return;

  // Inject Google Font link into canvas iframe
  var frame = pbEditor.Canvas.getFrameEl();
  if (frame && frame.contentDocument && pairing.googleUrl) {
    var doc = frame.contentDocument;
    var existingLink = doc.getElementById('pb-google-font');
    if (existingLink) existingLink.remove();
    var link = doc.createElement('link');
    link.id = 'pb-google-font';
    link.rel = 'stylesheet';
    link.href = pairing.googleUrl;
    doc.head.appendChild(link);
  }

  // Apply font CSS variables via inline style injection
  if (frame && frame.contentDocument) {
    var doc = frame.contentDocument;
    var existingStyle = doc.getElementById('pb-font-override');
    if (existingStyle) existingStyle.remove();
    var style = doc.createElement('style');
    style.id = 'pb-font-override';
    style.textContent = ':root { --pb-font-heading: "' + pairing.heading + '", serif; --pb-font-body: "' + pairing.body + '", sans-serif; }';
    doc.head.appendChild(style);
  }
}

function pbApplySectionBg(className) {
  if (!pbEditor) return;
  var selected = pbEditor.getSelected();
  if (!selected) {
    if (typeof showToast === 'function') showToast('Select a section first, then choose a background', 'info');
    return;
  }

  // Remove existing background classes
  var bgClasses = ['pb-bg-gradient-warm', 'pb-bg-gradient-cool', 'pb-bg-gradient-sunset', 'pb-bg-gradient-forest', 'pb-bg-pattern-dots', 'pb-bg-pattern-grid', 'pb-bg-pattern-diagonal'];
  var currentClasses = selected.getClasses ? selected.getClasses() : [];
  bgClasses.forEach(function(cls) {
    if (currentClasses.indexOf(cls) !== -1) {
      selected.removeClass(cls);
    }
  });

  // Add new class if not "Default"
  if (className) {
    selected.addClass(className);
  }
  if (typeof pbSave === 'function') pbSave();
  if (typeof showToast === 'function') showToast('Background applied', 'success');
}

function pbGetAccentOverride() {
  var saved = localStorage.getItem('ctax_pb_accent');
  if (!saved || saved === 'default') return null;
  for (var i = 0; i < PB_ACCENT_COLORS.length; i++) {
    if (PB_ACCENT_COLORS[i].id === saved) {
      return { color: PB_ACCENT_COLORS[i].color, hover: PB_ACCENT_COLORS[i].hover };
    }
  }
  if (saved.startsWith('#')) {
    return { color: saved, hover: pbLightenHex(saved, 15) };
  }
  return null;
}

function pbLightenHex(hex, percent) {
  var num = parseInt(hex.replace('#', ''), 16);
  var r = Math.min(255, (num >> 16) + Math.round(2.55 * percent));
  var g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round(2.55 * percent));
  var b = Math.min(255, (num & 0x0000FF) + Math.round(2.55 * percent));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

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
//  Theme-specific CSS builders
// ================================================================

// -- Clean Light: accent-flexible, shadow-border cards, generous spacing --
function pbBuildCleanCSS(tokens) {
  var bg0 = tokens['--pb-bg-0'];
  var bg1 = tokens['--pb-bg-1'];
  var text0 = tokens['--pb-text-0'];
  var text1 = tokens['--pb-text-1'];
  var text2 = tokens['--pb-text-2'];
  var border = tokens['--pb-border'];
  var css = '';
  // Heroes become light
  css += '.pb-hero-centered { background: ' + bg1 + '; color: ' + text0 + '; }\n';
  css += '.pb-hero-centered::before { background: radial-gradient(ellipse at 50% 0%, var(--pb-accent-soft) 0%, transparent 60%); }\n';
  css += '.pb-hero-centered::after { background-image: linear-gradient(' + border + '22 1px, transparent 1px), linear-gradient(90deg, ' + border + '22 1px, transparent 1px); }\n';
  css += '.pb-hero-centered h1 { color: ' + text0 + '; }\n';
  css += '.pb-hero-centered .pb-hero-sub { color: ' + text1 + '; }\n';
  css += '.pb-hero-centered .pb-badge { color: var(--pb-accent); background: var(--pb-accent-soft); border-color: var(--pb-accent-soft); }\n';
  css += '.pb-hero-centered .pb-btn-secondary { color: ' + text0 + '; border-color: ' + border + '; }\n';
  css += '.pb-hero-centered .pb-trust-stats span { color: ' + text1 + '; }\n';
  css += '.pb-hero-centered .pb-trust-stats strong { color: ' + text0 + '; }\n';
  // Dark hero variant -> light
  css += '.pb-hero-dark { background: ' + bg1 + '; color: ' + text0 + '; }\n';
  css += '.pb-hero-dark::before { background: radial-gradient(ellipse at 30% 50%, var(--pb-accent-soft) 0%, transparent 60%); }\n';
  css += '.pb-hero-dark::after { background-image: linear-gradient(' + border + '22 1px, transparent 1px), linear-gradient(90deg, ' + border + '22 1px, transparent 1px); }\n';
  css += '.pb-hero-dark h1, .pb-hero-dark .pb-hero-sub, .pb-hero-dark .pb-badge { color: ' + text0 + '; }\n';
  css += '.pb-hero-dark .pb-hero-sub { color: ' + text1 + '; }\n';
  css += '.pb-hero-dark .pb-badge { color: var(--pb-accent); background: var(--pb-accent-soft); border-color: var(--pb-accent-soft); }\n';
  css += '.pb-hero-dark .pb-btn-secondary { color: ' + text0 + '; border-color: ' + border + '; }\n';
  css += '.pb-hero-dark .pb-trust-stats span { color: ' + text1 + '; }\n';
  css += '.pb-hero-dark .pb-trust-stats strong { color: ' + text0 + '; }\n';
  // CTA sections -> light
  css += '.pb-cta-dark { background: ' + bg1 + '; color: ' + text0 + '; }\n';
  css += '.pb-cta-dark::before { background: radial-gradient(ellipse at 50% 50%, var(--pb-accent-soft) 0%, transparent 60%); }\n';
  css += '.pb-cta-dark h2 { color: ' + text0 + '; }\n';
  css += '.pb-cta-dark p { color: ' + text1 + '; }\n';
  css += '.pb-cta-dark .pb-cta-trust { color: ' + text2 + '; }\n';
  // Cards: shadow-border hybrid -- nearly invisible border, soft layered shadow
  css += '.pb-feat-card, .pb-testi-card, .pb-cred-card, .pb-cta-card, .pb-form-card { border: 1px solid rgba(0,0,0,0.04); }\n';
  css += '.pb-feat-card:hover, .pb-testi-card:hover, .pb-cred-card:hover { border-color: rgba(0,0,0,0.08); }\n';
  // Button style: solid accent, clean radius
  css += '.pb-btn { border-radius: 10px; font-weight: 600; letter-spacing: 0; }\n';
  css += '.pb-btn-secondary { border-radius: 10px; }\n';
  return css;
}

// -- Monochrome Dark: pure B/W/G, noise texture, glass-edge cards --
function pbBuildMonoCSS(tokens) {
  var bg0 = tokens['--pb-bg-0'];
  var bg1 = tokens['--pb-bg-1'];
  var css = '';
  // Hero backgrounds
  css += '.pb-hero-centered { background: ' + bg0 + '; }\n';
  css += '.pb-hero-dark { background: ' + bg0 + '; }\n';
  css += '.pb-cta-dark { background: ' + bg0 + '; }\n';
  css += '.pb-hero-split { background: ' + bg0 + '; }\n';
  css += '.pb-hero-minimal { background: ' + bg0 + '; }\n';
  css += '.pb-hero-bold { background: ' + bg0 + '; }\n';
  // Glass-edge cards: top-lit border simulates physical panels
  css += '.pb-feat-card, .pb-testi-card, .pb-cred-card, .pb-faq-item, .pb-cta-card, .pb-form-card { ';
  css += 'background: #141414; ';
  css += 'border: 1px solid rgba(255,255,255,0.06); ';
  css += 'border-top-color: rgba(255,255,255,0.10); }\n';
  // Hover: border brightens slightly
  css += '.pb-feat-card:hover, .pb-testi-card:hover, .pb-cred-card:hover { ';
  css += 'border-color: rgba(255,255,255,0.10); ';
  css += 'border-top-color: rgba(255,255,255,0.14); }\n';
  // Buttons: white on black, clean
  css += '.pb-btn { background: #ffffff; color: #0a0a0a; border: none; font-weight: 600; }\n';
  css += '.pb-btn:hover { background: #ededed; }\n';
  css += '.pb-btn-secondary { color: #ededed; border-color: rgba(255,255,255,0.2); }\n';
  css += '.pb-btn-secondary:hover { background: rgba(255,255,255,0.06); }\n';
  // Gradient text becomes white (no color in monochrome)
  css += '.pb-gradient-text { background: none; -webkit-text-fill-color: #ffffff; color: #ffffff; }\n';
  // Noise texture on hero sections for analog richness
  var noise = "data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";
  css += '.pb-hero-centered::after, .pb-hero-dark::after { ';
  css += 'background-image: url("' + noise + '"); ';
  css += 'background-size: 256px 256px; opacity: 0.02; }\n';
  // Section alternation: just slightly lighter surface
  css += '.pb-section-alt { background: #141414; }\n';
  return css;
}

// -- Authority (Patriot): White base + navy hero, crimson accent, institutional borders --
function pbBuildAuthorityCSS(tokens) {
  var text0 = tokens['--pb-text-0'];
  var text1 = tokens['--pb-text-1'];
  var text2 = tokens['--pb-text-2'];
  var border = tokens['--pb-border'];
  var css = '';
  // Heroes stay dark navy -- authoritative
  var navy1 = '#0A1628';
  var navy2 = '#1B2E4B';
  css += '.pb-hero-centered { background: linear-gradient(135deg, ' + navy1 + ' 0%, ' + navy2 + ' 100%); color: #e8ecf2; }\n';
  css += '.pb-hero-centered::before { background: radial-gradient(ellipse at 50% 0%, rgba(184, 32, 37, 0.10) 0%, transparent 55%); }\n';
  css += '.pb-hero-centered::after { background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); }\n';
  css += '.pb-hero-centered h1 { color: #ffffff; }\n';
  css += '.pb-hero-centered .pb-hero-sub { color: rgba(255,255,255,0.7); }\n';
  css += '.pb-hero-centered .pb-badge { color: #f87171; background: rgba(184, 32, 37, 0.15); border-color: rgba(184, 32, 37, 0.25); }\n';
  css += '.pb-hero-centered .pb-btn-secondary { color: #ffffff; border-color: rgba(255,255,255,0.25); }\n';
  css += '.pb-hero-centered .pb-trust-stats span { color: rgba(255,255,255,0.5); }\n';
  css += '.pb-hero-centered .pb-trust-stats strong { color: #ffffff; }\n';
  // Hero dark variant
  css += '.pb-hero-dark { background: linear-gradient(135deg, ' + navy1 + ' 0%, #142440 100%); color: #e8ecf2; }\n';
  css += '.pb-hero-dark::before { background: radial-gradient(ellipse at 30% 50%, rgba(184, 32, 37, 0.10) 0%, transparent 55%); }\n';
  css += '.pb-hero-dark h1 { color: #ffffff; }\n';
  css += '.pb-hero-dark .pb-hero-sub { color: rgba(255,255,255,0.7); }\n';
  css += '.pb-hero-dark .pb-badge { color: #f87171; background: rgba(184, 32, 37, 0.15); border-color: rgba(184, 32, 37, 0.25); }\n';
  css += '.pb-hero-dark .pb-btn-secondary { color: #ffffff; border-color: rgba(255,255,255,0.25); }\n';
  // CTA dark -> navy
  css += '.pb-cta-dark { background: linear-gradient(135deg, ' + navy1 + ' 0%, ' + navy2 + ' 100%); color: #e8ecf2; }\n';
  css += '.pb-cta-dark::before { background: radial-gradient(ellipse at 50% 50%, rgba(184, 32, 37, 0.10) 0%, transparent 50%); }\n';
  css += '.pb-cta-dark h2 { color: #ffffff; }\n';
  css += '.pb-cta-dark p { color: rgba(255,255,255,0.7); }\n';
  css += '.pb-cta-dark .pb-cta-trust { color: rgba(255,255,255,0.4); }\n';
  // Institutional left-border accent on cards
  css += '.pb-feat-card, .pb-cred-card { border-left: 4px solid #B82025; }\n';
  // Gradient text: uses crimson to navy
  css += '.pb-gradient-text { background: linear-gradient(135deg, #B82025, #1B2E4B); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }\n';
  // Buttons: solid crimson primary
  css += '.pb-btn { background: linear-gradient(135deg, #B82025, #9A1A1E); }\n';
  // Muted gold accent for special highlights (optional -- via accent-soft)
  css += '.pb-stat-number, .pb-proof-number { color: #B82025; -webkit-text-fill-color: #B82025; background: none; }\n';
  return css;
}

// -- Midnight Gradient: ambient orbs, glassmorphism, deep purple/teal glows --
function pbBuildMidnightCSS(tokens) {
  var bg0 = tokens['--pb-bg-0'];
  var bg1 = tokens['--pb-bg-1'];
  var css = '';
  // Hero sections
  css += '.pb-hero-centered { background: ' + bg0 + '; position: relative; }\n';
  css += '.pb-hero-dark { background: ' + bg0 + '; position: relative; }\n';
  css += '.pb-cta-dark { background: ' + bg0 + '; }\n';
  css += '.pb-hero-split { background: ' + bg0 + '; }\n';
  css += '.pb-hero-minimal { background: ' + bg0 + '; }\n';
  css += '.pb-hero-bold { background: ' + bg0 + '; }\n';
  // Ambient gradient orbs -- decorative, positioned in bottom 40% of hero via base CSS top: 50%
  css += '.pb-hero-centered::before { background: radial-gradient(600px circle at 75% 50%, rgba(76, 29, 149, 0.15) 0%, transparent 60%); }\n';
  css += '.pb-hero-centered::after { background-image: none; background: radial-gradient(500px circle at 20% 80%, rgba(19, 78, 74, 0.12) 0%, transparent 60%); inset: 0; height: auto; }\n';
  css += '.pb-hero-dark::before { background: radial-gradient(500px circle at 30% 50%, rgba(76, 29, 149, 0.15) 0%, transparent 50%); }\n';
  css += '.pb-hero-dark::after { background-image: none; background: radial-gradient(600px circle at 80% 70%, rgba(19, 78, 74, 0.12) 0%, transparent 50%); inset: 0; height: auto; }\n';
  // Glass cards with backdrop-filter
  css += '.pb-feat-card, .pb-testi-card, .pb-cred-card, .pb-faq-item, .pb-cta-card, .pb-form-card { ';
  css += 'background: rgba(19, 19, 22, 0.7); ';
  css += 'border: 1px solid rgba(255,255,255,0.08); ';
  css += 'backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }\n';
  css += '.pb-feat-card:hover, .pb-testi-card:hover, .pb-cred-card:hover { ';
  css += 'border-color: rgba(129, 140, 248, 0.2); ';
  css += 'box-shadow: 0 0 20px rgba(129, 140, 248, 0.08); }\n';
  // CTA button with glow -- dark text on bright purple for 6.6:1 contrast
  css += '.pb-btn { color: #0a0a0f; box-shadow: 0 0 20px rgba(129, 140, 248, 0.25), 0 0 60px rgba(129, 140, 248, 0.08); }\n';
  css += '.pb-btn:hover { box-shadow: 0 0 30px rgba(129, 140, 248, 0.35), 0 0 80px rgba(129, 140, 248, 0.12); }\n';
  // Gradient text: purple to teal
  css += '.pb-gradient-text { background: linear-gradient(135deg, #818cf8, #14b8a6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }\n';
  // Section alt background
  css += '.pb-section-alt { background: #131316; }\n';
  return css;
}

// -- Boho Earth: mountain landscapes, organic waves, warm serif headings --
function pbBuildBohoCSS(pal) {
  var h = pal.hero;
  var mtn = pal.mountains;
  var cream = h.cream;
  var accentColor = pal.tokens['--pb-accent'];
  var accentHover = pal.tokens['--pb-accent-hover'];
  var mountainBg = pbBohoMountainSvg(mtn);
  var wave = pbBohoWaveSvg(cream, accentColor);
  var cardBorder = pbBohoCardBorderSvg(accentColor);
  var css = '';

  // FIX 1: Hero wave -- use !important on key properties to beat base
  // pb-canvas.css ::after which sets inset:0. Also allow overflow so
  // the wave is not clipped by the hero container.
  var heroAfterReset =
    'content: "" !important; ' +
    'position: absolute !important; ' +
    'top: auto !important; right: 0 !important; bottom: 0 !important; left: 0 !important; ' +
    'width: auto !important; height: 160px !important; ' +
    'z-index: 1; pointer-events: none; ' +
    'background-image: url("' + wave + '") !important; ' +
    'background-size: 100% 100% !important; ' +
    'background-repeat: no-repeat !important; ' +
    'background-position: bottom center !important;';

  // FIX 5: Allow wave to paint outside hero bounds
  css += '.pb-hero-centered, .pb-hero-dark { overflow: visible !important; }\n';

  css += '.pb-hero-centered { background: url("' + mountainBg + '") center/cover no-repeat; color: ' + cream + '; }\n';
  css += '.pb-hero-centered::before { top: 0; left: 0; width: 100%; height: 100%; transform: none; background: linear-gradient(to bottom, transparent 40%, ' + h.bg2 + ' 100%); }\n';
  css += '.pb-hero-centered::after { ' + heroAfterReset + ' }\n';
  css += '.pb-hero-centered h1 { color: ' + cream + '; text-shadow: 0 2px 12px rgba(0,0,0,0.3); }\n';
  css += '.pb-hero-centered .pb-hero-sub { color: rgba(255,255,255,0.8); }\n';
  css += '.pb-hero-centered .pb-badge { color: ' + accentHover + '; background: rgba(255,255,255,0.10); border-color: rgba(255,255,255,0.15); }\n';
  css += '.pb-hero-centered .pb-btn-secondary { color: ' + cream + '; border-color: rgba(255,255,255,0.3); }\n';
  css += '.pb-hero-centered .pb-btn-secondary:hover { background: rgba(255,255,255,0.08); }\n';
  css += '.pb-hero-centered .pb-trust-stats span { color: rgba(255,255,255,0.6); }\n';
  css += '.pb-hero-centered .pb-trust-stats strong { color: ' + cream + '; }\n';

  // Hero dark variant: also uses mountain backdrop
  css += '.pb-hero-dark { background: url("' + mountainBg + '") center bottom/cover no-repeat; color: ' + cream + '; }\n';
  css += '.pb-hero-dark::before { top: 0; left: 0; width: 100%; height: 100%; transform: none; background: linear-gradient(to bottom, transparent 30%, ' + h.bg2 + ' 100%); }\n';
  css += '.pb-hero-dark::after { ' + heroAfterReset + ' }\n';
  css += '.pb-hero-dark h1 { color: ' + cream + '; text-shadow: 0 2px 12px rgba(0,0,0,0.3); }\n';
  css += '.pb-hero-dark .pb-hero-sub { color: rgba(255,255,255,0.8); }\n';
  css += '.pb-hero-dark .pb-badge { color: ' + accentHover + '; background: rgba(255,255,255,0.10); border-color: rgba(255,255,255,0.15); }\n';
  css += '.pb-hero-dark .pb-btn-secondary { color: ' + cream + '; border-color: rgba(255,255,255,0.3); }\n';

  // Hero split / minimal / bold variants
  css += '.pb-hero-split { background: ' + pal.tokens['--pb-bg-0'] + '; }\n';
  css += '.pb-hero-minimal { background: ' + pal.tokens['--pb-bg-0'] + '; }\n';
  css += '.pb-hero-bold { background: ' + pal.tokens['--pb-bg-0'] + '; }\n';

  // CTA dark
  css += '.pb-cta-dark { background: linear-gradient(160deg, ' + h.bg1 + ' 0%, ' + h.bg2 + ' 100%); color: ' + cream + '; }\n';
  css += '.pb-cta-dark::before { background: radial-gradient(ellipse at 50% 50%, ' + h.glow + ' 0%, transparent 50%); }\n';
  css += '.pb-cta-dark h2 { color: ' + cream + '; }\n';
  css += '.pb-cta-dark p { color: rgba(255,255,255,0.7); }\n';
  css += '.pb-cta-dark .pb-cta-trust { color: rgba(255,255,255,0.4); }\n';

  // Extra bottom padding for wave
  css += '.pb-hero-centered { padding-bottom: calc(var(--pb-space-32) + 100px); }\n';
  css += '.pb-hero-dark { padding-bottom: calc(var(--pb-space-32) + 100px); }\n';

  // Typography: warm serif for headings
  css += 'h1, h2, h3, h4, h5, h6 { font-family: "Playfair Display", "DM Serif Display", Georgia, serif; }\n';

  // FIX 3: Scope font-weight: 300 to body text only -- NOT buttons, stats,
  // badges, or anything that needs visual weight
  css += 'body, p, li { font-family: "DM Sans", system-ui, sans-serif; font-weight: 300; }\n';
  css += 'input, textarea { font-family: "DM Sans", system-ui, sans-serif; }\n';
  // Restore weight on interactive + emphasis elements
  css += '.pb-btn, .pb-btn-secondary, button { font-family: "DM Sans", system-ui, sans-serif; font-weight: 600; }\n';
  css += '.pb-badge, .pb-stat-val, .pb-trust-val, .pb-stat-label, .pb-trust-label, strong, b { font-weight: 600; }\n';
  css += '.pb-counter-item strong, .pb-form-label, .pb-benefit-check { font-weight: 600; }\n';
  css += 'a { font-family: "DM Sans", system-ui, sans-serif; }\n';
  css += 'span { font-family: inherit; }\n';

  // Pill-shaped buttons
  css += '.pb-btn, .pb-btn-secondary { border-radius: var(--pb-radius-full); letter-spacing: 0.03em; }\n';

  // Softer card corners + woven top border
  css += '.pb-feat-card, .pb-testi-card, .pb-cred-card, .pb-faq-item, .pb-cta-card, .pb-form-card { border-radius: var(--pb-radius-xl); overflow: hidden; }\n';
  css += '.pb-feat-card::before, .pb-testi-card::before { content: ""; display: block; height: 4px; background: url("' + cardBorder + '") repeat-x; background-size: auto 4px; margin-bottom: 0; }\n';

  // Warm gradient text
  css += '.pb-gradient-text { background: linear-gradient(135deg, ' + pal.gradient[0] + ', ' + pal.gradient[1] + '); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }\n';

  // Section dividers
  // FIX 2: Exclude utility/compact sections from wave dividers.
  // Stats rows, trust bars, logo bars, counter strips, and compliance
  // footers should NOT get 80px wave dividers above them.
  var sectionWave = pbBohoSectionDividerSvg(pal.tokens['--pb-bg-0'], accentColor);
  var sectionWaveAlt = pbBohoSectionDividerSvg(pal.tokens['--pb-bg-1'], accentColor);
  css += 'section, [class*="pb-hero"], [class*="pb-cta"], [class*="pb-feat"], [class*="pb-testi"], [class*="pb-process"], [class*="pb-faq-section"], [class*="pb-form-section"], [class*="pb-trust"], [class*="pb-proof"] { position: relative; }\n';
  css += '.pb-section-alt { border-top: none; margin-top: 80px; }\n';
  css += '.pb-section-alt::before { content: ""; position: absolute; top: -80px; left: 0; right: 0; height: 80px; background-image: url("' + sectionWaveAlt + '"); background-size: 100% 100%; background-repeat: no-repeat; pointer-events: none; z-index: 2; }\n';

  // Divider exclusion list: compact utility sections that should NOT
  // have a wave + 80px gap above them
  var noWave = ':not(.pb-section-alt)' +
    ':not([class*="pb-hero"])' +
    ':not([class*="pb-cta-dark"])' +
    ':not([class*="pb-compliance"])' +
    ':not(.pb-stats-row)' +
    ':not(.pb-trust-bar)' +
    ':not(.pb-counter-strip)' +
    ':not(.pb-logo-bar)';

  css += 'section' + noWave + ' { margin-top: 80px; }\n';
  css += 'section' + noWave + '::before { content: ""; position: absolute; top: -80px; left: 0; right: 0; height: 80px; background-image: url("' + sectionWave + '"); background-size: 100% 100%; background-repeat: no-repeat; pointer-events: none; z-index: 2; }\n';

  // FIX 4: Sections directly after a hero should not double-up the
  // wave gap -- the hero's own bottom wave handles the transition.
  // Use a smaller margin and no divider for the first non-hero section.
  css += '[class*="pb-hero"] + section { margin-top: 0 !important; }\n';
  css += '[class*="pb-hero"] + section::before { display: none !important; }\n';

  // Flourish under section subtitles
  var flourish = pbBohoFlourishSvg(accentColor);
  css += '.pb-section-sub::after { content: ""; display: block; width: 200px; height: 30px; margin: 20px auto 0; background-image: url("' + flourish + '"); background-size: contain; background-repeat: no-repeat; background-position: center; }\n';

  // Organic blob shapes on icons
  css += '.pb-icon-wrap { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }\n';
  css += '.pb-step-number { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }\n';

  // Testimonial decorative quotes
  css += '.pb-testi-card .pb-testi-text { font-style: italic; position: relative; padding-left: 28px; }\n';
  css += '.pb-testi-card .pb-testi-text::before { content: open-quote; position: absolute; left: 0; top: -12px; font-size: 64px; line-height: 1; color: var(--pb-accent); opacity: 0.35; font-family: "Playfair Display", Georgia, serif; }\n';

  // Stats gradient
  css += '.pb-stat-number, .pb-proof-number { background: linear-gradient(135deg, ' + pal.gradient[0] + ', ' + pal.gradient[1] + '); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }\n';

  // Form accent top
  css += '.pb-form-card { border: 1px solid var(--pb-border); border-top: 3px solid var(--pb-accent); }\n';

  return css;
}


// ================================================================
//  Apply theme + accent to the GrapesJS canvas
// ================================================================
function pbApplyThemeToCanvas() {
  if (typeof pbEditor === 'undefined' || !pbEditor) return;
  var frame = pbEditor.Canvas.getFrameEl();
  if (!frame) return;
  var doc = frame.contentDocument;
  if (!doc || !doc.documentElement) return;

  var themeId = localStorage.getItem('ctax_pb_theme') || 'clean';
  var theme = pbGetTheme(themeId);

  var styleId = 'pb-theme-tokens';
  var existing = doc.getElementById(styleId);
  if (existing) existing.remove();

  // Resolve tokens
  var tokens;
  var bohoPal = null;
  if (themeId === 'warm') {
    bohoPal = pbGetActiveBohoPalette();
    tokens = Object.assign({}, bohoPal.tokens);
  } else {
    tokens = Object.assign({}, theme.tokens);
  }

  // Accent override (Clean Light only)
  var accent = null;
  if (themeId === 'clean') {
    accent = pbGetAccentOverride();
    if (accent) {
      tokens['--pb-accent'] = accent.color;
      tokens['--pb-accent-hover'] = accent.hover;
      tokens['--pb-accent-soft'] = pbAccentSoft(accent.color);
      tokens['--pb-accent-glow'] = pbAccentGlow(accent.color);
    }
  }

  // Build :root token block
  var css = ':root {\n';
  var keys = Object.keys(tokens);
  for (var i = 0; i < keys.length; i++) {
    css += '  ' + keys[i] + ': ' + tokens[keys[i]] + ';\n';
  }
  css += '}\n';

  // Theme-specific CSS
  if (themeId === 'clean') {
    css += pbBuildCleanCSS(tokens);
  } else if (themeId === 'dark') {
    css += pbBuildMonoCSS(tokens);
  } else if (themeId === 'patriot') {
    css += pbBuildAuthorityCSS(tokens);
  } else if (themeId === 'midnight') {
    css += pbBuildMidnightCSS(tokens);
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

  // Update body bg
  doc.body.style.background = tokens['--pb-bg-0'];
  doc.body.style.color = tokens['--pb-text-0'];

  // Apply selected font pairing
  if (typeof pbApplyFontToCanvas === 'function') {
    pbApplyFontToCanvas();
  }

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

  var tokens;
  var bohoPal = null;
  if (themeId === 'warm') {
    bohoPal = pbGetActiveBohoPalette();
    tokens = Object.assign({}, bohoPal.tokens);
  } else {
    tokens = Object.assign({}, theme.tokens);
  }

  if (themeId === 'clean' && accent) {
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
  lines.push('body { background: ' + tokens['--pb-bg-0'] + '; color: ' + tokens['--pb-text-0'] + '; }');

  if (themeId === 'clean') {
    lines.push(pbBuildCleanCSS(tokens));
  } else if (themeId === 'dark') {
    lines.push(pbBuildMonoCSS(tokens));
  } else if (themeId === 'patriot') {
    lines.push(pbBuildAuthorityCSS(tokens));
  } else if (themeId === 'midnight') {
    lines.push(pbBuildMidnightCSS(tokens));
  } else if (themeId === 'warm') {
    lines.push(pbBuildBohoCSS(bohoPal));
    lines.unshift('@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap");');
  }

  return lines.join('\n');
}

// Legacy compat
function pbBuildPresetSwatches() { /* no-op, replaced by theme panel */ }
function pbApplyColorPreset() { /* no-op */ }
