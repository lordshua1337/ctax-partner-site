// -- Page Builder: Color scheme presets --
// Declares PB_COLOR_PRESETS and helper functions for applying/building swatches.

var PB_COLOR_PRESETS = [
  {
    id: 'blue',
    label: 'Professional Blue',
    swatch: '#2563eb',
    vars: {
      '--pb-primary': '#2563eb',
      '--pb-primary-hover': '#1d4ed8',
      '--pb-dark-bg': '#111827',
      '--pb-dark-bg-alt': '#1f2937',
      '--pb-gradient-start': '#111827',
      '--pb-gradient-end': '#1f2937',
      '--pb-gradient-bold-start': '#0f172a',
      '--pb-gradient-bold-end': '#312e81'
    }
  },
  {
    id: 'navy-gold',
    label: 'Warm Trust',
    swatch: '#b8860b',
    vars: {
      '--pb-primary': '#b8860b',
      '--pb-primary-hover': '#996f09',
      '--pb-dark-bg': '#1e3a5f',
      '--pb-dark-bg-alt': '#1a2e4a',
      '--pb-gradient-start': '#1e3a5f',
      '--pb-gradient-end': '#1a2e4a',
      '--pb-gradient-bold-start': '#0f1f38',
      '--pb-gradient-bold-end': '#2c1810'
    }
  },
  {
    id: 'slate',
    label: 'Modern Slate',
    swatch: '#475569',
    vars: {
      '--pb-primary': '#475569',
      '--pb-primary-hover': '#334155',
      '--pb-dark-bg': '#1e293b',
      '--pb-dark-bg-alt': '#334155',
      '--pb-gradient-start': '#1e293b',
      '--pb-gradient-end': '#334155',
      '--pb-gradient-bold-start': '#0f172a',
      '--pb-gradient-bold-end': '#1e293b'
    }
  },
  {
    id: 'green',
    label: 'Bold Green',
    swatch: '#16a34a',
    vars: {
      '--pb-primary': '#16a34a',
      '--pb-primary-hover': '#15803d',
      '--pb-dark-bg': '#0a0a0a',
      '--pb-dark-bg-alt': '#171717',
      '--pb-gradient-start': '#0a0a0a',
      '--pb-gradient-end': '#171717',
      '--pb-gradient-bold-start': '#052e16',
      '--pb-gradient-bold-end': '#0a0a0a'
    }
  },
  {
    id: 'earth',
    label: 'Warm Earth',
    swatch: '#b45309',
    vars: {
      '--pb-primary': '#b45309',
      '--pb-primary-hover': '#92400e',
      '--pb-dark-bg': '#292524',
      '--pb-dark-bg-alt': '#1c1917',
      '--pb-gradient-start': '#292524',
      '--pb-gradient-end': '#1c1917',
      '--pb-gradient-bold-start': '#1c1917',
      '--pb-gradient-bold-end': '#431407'
    }
  }
];

// Build the preset swatch buttons and inject into the toolbar container
function pbBuildPresetSwatches() {
  var container = document.getElementById('pb-preset-swatches');
  if (!container) return;

  var saved = localStorage.getItem('ctax_pb_preset') || 'blue';
  var html = '';

  PB_COLOR_PRESETS.forEach(function(preset) {
    var active = preset.id === saved ? ' pb-preset-swatch-active' : '';
    html += '<button class="pb-preset-swatch' + active + '" ';
    html += 'data-preset="' + preset.id + '" ';
    html += 'style="background:' + preset.swatch + '" ';
    html += 'title="' + preset.label + '" ';
    html += 'onclick="pbApplyColorPreset(\'' + preset.id + '\')"></button>';
  });

  container.innerHTML = html;
}

// Apply a color preset by setting CSS custom properties on the canvas iframe
function pbApplyColorPreset(presetId) {
  var preset = null;
  for (var i = 0; i < PB_COLOR_PRESETS.length; i++) {
    if (PB_COLOR_PRESETS[i].id === presetId) {
      preset = PB_COLOR_PRESETS[i];
      break;
    }
  }
  if (!preset) return;

  localStorage.setItem('ctax_pb_preset', presetId);

  // Apply to canvas iframe
  pbApplyPresetToCanvas(preset);

  // Update swatch active state
  document.querySelectorAll('.pb-preset-swatch').forEach(function(btn) {
    btn.classList.toggle('pb-preset-swatch-active', btn.getAttribute('data-preset') === presetId);
  });
}

// Apply preset CSS vars to the GrapesJS canvas iframe :root
function pbApplyPresetToCanvas(preset) {
  if (typeof pbEditor === 'undefined' || !pbEditor) return;
  var frame = pbEditor.Canvas.getFrameEl();
  if (!frame) return;
  var doc = frame.contentDocument;
  if (!doc || !doc.documentElement) return;

  var keys = Object.keys(preset.vars);
  for (var i = 0; i < keys.length; i++) {
    doc.documentElement.style.setProperty(keys[i], preset.vars[keys[i]]);
  }
}

// Restore saved preset on editor init
function pbRestorePreset() {
  pbBuildPresetSwatches();
  var saved = localStorage.getItem('ctax_pb_preset') || 'blue';
  // Delay slightly so the canvas iframe is ready
  setTimeout(function() {
    pbApplyColorPreset(saved);
  }, 600);
}

// Get the current preset's CSS var values as inline style text.
// Used by export and preview to bake colors into standalone HTML.
function pbGetPresetInlineCSS() {
  var saved = localStorage.getItem('ctax_pb_preset') || 'blue';
  var preset = null;
  for (var i = 0; i < PB_COLOR_PRESETS.length; i++) {
    if (PB_COLOR_PRESETS[i].id === saved) {
      preset = PB_COLOR_PRESETS[i];
      break;
    }
  }
  if (!preset) return '';

  var lines = [':root {'];
  var keys = Object.keys(preset.vars);
  for (var i = 0; i < keys.length; i++) {
    lines.push('  ' + keys[i] + ': ' + preset.vars[keys[i]] + ';');
  }
  lines.push('}');
  return lines.join('\n');
}
