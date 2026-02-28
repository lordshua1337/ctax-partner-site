// --- Landing Page Builder ---
// Drag-and-drop page builder for partners to create referral and
// business landing pages. Blocks are pre-designed, partners customize
// content and reorder via drag-and-drop.

var PB_STORAGE_KEY = 'ctax_page_builder_v1';

// Available block types
var PB_BLOCKS = [
  { type: 'hero', label: 'Hero Banner', icon: 'layout', desc: 'Full-width headline with subtitle and CTA button' },
  { type: 'features', label: 'Features Grid', icon: 'grid', desc: '3-column feature cards with icons' },
  { type: 'testimonial', label: 'Testimonial', icon: 'message-circle', desc: 'Client quote with attribution' },
  { type: 'cta', label: 'Call to Action', icon: 'arrow-right', desc: 'Centered CTA with heading and button' },
  { type: 'stats', label: 'Stats Row', icon: 'bar-chart-2', desc: 'Metric counters in a row' },
  { type: 'text', label: 'Text Block', icon: 'type', desc: 'Rich text paragraph section' },
  { type: 'form', label: 'Contact Form', icon: 'mail', desc: 'Lead capture form with fields' },
  { type: 'logo-bar', label: 'Logo Bar', icon: 'award', desc: 'Trust badges and partner logos' },
  { type: 'faq', label: 'FAQ Section', icon: 'help-circle', desc: 'Expandable questions and answers' },
  { type: 'divider', label: 'Divider', icon: 'minus', desc: 'Visual separator between sections' }
];

// Starter templates
var PB_TEMPLATES = {
  referral: {
    label: 'Referral Page',
    desc: 'Client-facing page for IRS resolution referrals',
    blocks: [
      { type: 'hero', content: { headline: 'Struggling with IRS Tax Debt?', subtitle: 'Get expert help from licensed tax professionals. Free consultation, no obligation.', cta: 'Get Free Assessment', ctaLink: '#contact' } },
      { type: 'stats', content: { items: [{ value: '$2.3B', label: 'Tax Debt Resolved' }, { value: '10,000+', label: 'Active Partners' }, { value: '~80%', label: 'Conversion Rate' }, { value: '14', label: 'Years of Experience' }] } },
      { type: 'features', content: { heading: 'Why Choose Us', items: [{ title: 'Licensed Professionals', desc: 'Enrolled agents and tax attorneys who negotiate directly with the IRS.' }, { title: 'Proven Track Record', desc: 'Over $2.3 billion in tax debt resolved for thousands of clients.' }, { title: 'Free Consultation', desc: 'No-obligation assessment to understand your options and next steps.' }] } },
      { type: 'testimonial', content: { quote: 'I owed the IRS $47,000 and felt hopeless. Community Tax settled my case for $8,200. I finally sleep at night.', name: 'Michael R.', role: 'Small Business Owner, TX' } },
      { type: 'cta', content: { heading: 'Ready to Resolve Your Tax Debt?', subtitle: 'Schedule a free, no-obligation consultation today.', cta: 'Get Started Now', ctaLink: '#contact' } },
      { type: 'form', content: { heading: 'Request Your Free Consultation', fields: ['Full Name', 'Email', 'Phone', 'Estimated Tax Debt'], button: 'Submit Request' } }
    ]
  },
  business: {
    label: 'Business Page',
    desc: 'Professional page showcasing your practice',
    blocks: [
      { type: 'hero', content: { headline: 'Your Trusted Tax Partner', subtitle: 'Full-service tax preparation and IRS resolution. Serving families and small businesses since 2012.', cta: 'Book a Consultation', ctaLink: '#contact' } },
      { type: 'logo-bar', content: { logos: ['IRS Authorized', 'BBB A+', 'NAEA Member', 'Certified EA'] } },
      { type: 'features', content: { heading: 'Our Services', items: [{ title: 'Tax Preparation', desc: 'Individual and business returns with maximum deductions guaranteed.' }, { title: 'IRS Resolution', desc: 'Offers in compromise, installment plans, and penalty abatement.' }, { title: 'Tax Planning', desc: 'Year-round strategy to minimize your tax burden legally.' }] } },
      { type: 'testimonial', content: { quote: 'They saved us over $12,000 in our first year. Professional, responsive, and easy to work with.', name: 'Sarah K.', role: 'Small Business Owner' } },
      { type: 'stats', content: { items: [{ value: '500+', label: 'Clients Served' }, { value: '12', label: 'Years Experience' }, { value: '4.9', label: 'Star Rating' }] } },
      { type: 'faq', content: { items: [{ q: 'What documents do I need?', a: 'W-2s, 1099s, and any deduction receipts.' }, { q: 'How much does it cost?', a: 'We offer free initial consultations.' }, { q: 'Can you help with back taxes?', a: 'Absolutely. We specialize in IRS resolution.' }] } },
      { type: 'form', content: { heading: 'Get in Touch', fields: ['Full Name', 'Email', 'Phone', 'How Can We Help?'], button: 'Send Message' } }
    ]
  },
  minimal: {
    label: 'Minimal',
    desc: 'Clean and simple one-section layout',
    blocks: [
      { type: 'hero', content: { headline: 'Resolve Your IRS Tax Debt', subtitle: 'Licensed professionals. Proven results. Free consultation.', cta: 'Start Now', ctaLink: '#contact' } },
      { type: 'form', content: { heading: 'Request a Free Consultation', fields: ['Full Name', 'Email', 'Phone'], button: 'Get Started' } }
    ]
  }
};

var PB_ICON_MAP = {
  'layout': '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/>',
  'grid': '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
  'message-circle': '<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>',
  'arrow-right': '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  'bar-chart-2': '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  'type': '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>',
  'mail': '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/>',
  'award': '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
  'help-circle': '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  'minus': '<line x1="5" y1="12" x2="19" y2="12"/>',
  'move': '<polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/>',
  'trash': '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>',
  'edit': '<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  'eye': '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  'download': '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>'
};

// Default page blocks
var PB_DEFAULT_BLOCKS = PB_TEMPLATES.referral.blocks;

function pbGetState() {
  try {
    var raw = localStorage.getItem(PB_STORAGE_KEY);
    if (!raw) return { blocks: JSON.parse(JSON.stringify(PB_DEFAULT_BLOCKS)), published: false, pageName: 'My Landing Page' };
    return JSON.parse(raw);
  } catch (e) {
    return { blocks: JSON.parse(JSON.stringify(PB_DEFAULT_BLOCKS)), published: false, pageName: 'My Landing Page' };
  }
}

function pbSaveState(state) {
  try {
    localStorage.setItem(PB_STORAGE_KEY, JSON.stringify(state));
  } catch (e) { /* quota */ }
}

function pbInit() {
  var canvas = document.getElementById('lpb-canvas');
  if (!canvas) return;
  var state = pbGetState();
  pbRenderCanvas(state);
  pbRenderBlockPalette();
  pbUpdateBlockCount(state);
}

function pbSvg(name) {
  return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (PB_ICON_MAP[name] || '') + '</svg>';
}

// Update block count badge in toolbar
function pbUpdateBlockCount(state) {
  var badge = document.getElementById('lpb-block-count');
  if (badge) badge.textContent = state.blocks.length + ' block' + (state.blocks.length !== 1 ? 's' : '');
}

// Render the main canvas with all blocks
function pbRenderCanvas(state) {
  var canvas = document.getElementById('lpb-canvas');
  if (!canvas) return;
  var html = '';

  state.blocks.forEach(function(block, i) {
    html += '<div class="lpb-block" data-index="' + i + '" draggable="true">';
    html += '<div class="lpb-block-toolbar">';
    html += '<span class="lpb-block-handle" title="Drag to reorder">' + pbSvg('move') + '</span>';
    html += '<span class="lpb-block-label">' + block.type.charAt(0).toUpperCase() + block.type.slice(1) + '</span>';
    html += '<div class="lpb-block-actions">';
    html += '<button class="lpb-block-btn" onclick="pbEditBlock(' + i + ')" title="Edit">' + pbSvg('edit') + '</button>';
    html += '<button class="lpb-block-btn" onclick="pbDuplicateBlock(' + i + ')" title="Duplicate"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button>';
    if (i > 0) html += '<button class="lpb-block-btn" onclick="pbMoveBlock(' + i + ',-1)" title="Move up"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg></button>';
    if (i < state.blocks.length - 1) html += '<button class="lpb-block-btn" onclick="pbMoveBlock(' + i + ',1)" title="Move down"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button>';
    html += '<button class="lpb-block-btn lpb-block-btn-danger" onclick="pbDeleteBlock(' + i + ')" title="Delete">' + pbSvg('trash') + '</button>';
    html += '</div></div>';
    html += '<div class="lpb-block-preview">';
    html += pbRenderBlockPreview(block);
    html += '</div>';
    html += '</div>';
  });

  if (state.blocks.length === 0) {
    html += '<div class="lpb-empty">';
    html += '<div class="lpb-empty-icon">' + pbSvg('layout') + '</div>';
    html += '<div class="lpb-empty-title">Start building your page</div>';
    html += '<div class="lpb-empty-desc">Drag blocks from the panel on the right or click the + button to add sections.</div>';
    html += '</div>';
  }

  canvas.innerHTML = html;
  pbInitDragDrop();
  pbUpdateBlockCount(state);
}

// Render a preview of a single block
function pbRenderBlockPreview(block) {
  var c = block.content;
  switch (block.type) {
    case 'hero':
      return '<div class="lpb-prev-hero">' +
        '<div class="lpb-prev-hero-h">' + (c.headline || 'Your Headline') + '</div>' +
        '<div class="lpb-prev-hero-sub">' + (c.subtitle || 'Your subtitle text goes here') + '</div>' +
        '<div class="lpb-prev-hero-cta">' + (c.cta || 'Call to Action') + '</div>' +
        '</div>';
    case 'features':
      var fhtml = '<div class="lpb-prev-features">';
      if (c.heading) fhtml += '<div class="lpb-prev-feat-heading">' + c.heading + '</div>';
      fhtml += '<div class="lpb-prev-feat-grid">';
      (c.items || []).forEach(function(item) {
        fhtml += '<div class="lpb-prev-feat-card"><div class="lpb-prev-feat-title">' + item.title + '</div><div class="lpb-prev-feat-desc">' + item.desc + '</div></div>';
      });
      fhtml += '</div></div>';
      return fhtml;
    case 'testimonial':
      return '<div class="lpb-prev-testimonial">' +
        '<div class="lpb-prev-quote">"' + (c.quote || 'Client testimonial goes here...') + '"</div>' +
        '<div class="lpb-prev-attribution">-- ' + (c.name || 'Client Name') + ', ' + (c.role || 'Title') + '</div>' +
        '</div>';
    case 'cta':
      return '<div class="lpb-prev-cta">' +
        '<div class="lpb-prev-cta-h">' + (c.heading || 'Ready to get started?') + '</div>' +
        '<div class="lpb-prev-cta-sub">' + (c.subtitle || '') + '</div>' +
        '<div class="lpb-prev-cta-btn">' + (c.cta || 'Get Started') + '</div>' +
        '</div>';
    case 'stats':
      var shtml = '<div class="lpb-prev-stats">';
      (c.items || []).forEach(function(item) {
        shtml += '<div class="lpb-prev-stat"><div class="lpb-prev-stat-val">' + item.value + '</div><div class="lpb-prev-stat-label">' + item.label + '</div></div>';
      });
      shtml += '</div>';
      return shtml;
    case 'text':
      return '<div class="lpb-prev-text">' + (c.body || '<p>Your text content goes here. Click edit to customize.</p>') + '</div>';
    case 'form':
      var formHtml = '<div class="lpb-prev-form">';
      if (c.heading) formHtml += '<div class="lpb-prev-form-heading">' + c.heading + '</div>';
      (c.fields || []).forEach(function(f) {
        formHtml += '<div class="lpb-prev-form-field"><span>' + f + '</span></div>';
      });
      formHtml += '<div class="lpb-prev-form-btn">' + (c.button || 'Submit') + '</div>';
      formHtml += '</div>';
      return formHtml;
    case 'logo-bar':
      var lhtml = '<div class="lpb-prev-logos">';
      (c.logos || ['IRS', 'BBB A+', 'NAEA', 'Trustpilot']).forEach(function(logo) {
        lhtml += '<div class="lpb-prev-logo-item">' + logo + '</div>';
      });
      lhtml += '</div>';
      return lhtml;
    case 'faq':
      var faqhtml = '<div class="lpb-prev-faq">';
      (c.items || []).forEach(function(item) {
        faqhtml += '<div class="lpb-prev-faq-item">' + item.q + '</div>';
      });
      if (!(c.items || []).length) {
        faqhtml += '<div class="lpb-prev-faq-item">How does the free consultation work?</div>';
        faqhtml += '<div class="lpb-prev-faq-item">What are my resolution options?</div>';
        faqhtml += '<div class="lpb-prev-faq-item">How long does the process take?</div>';
      }
      faqhtml += '</div>';
      return faqhtml;
    case 'divider':
      return '<div class="lpb-prev-divider"><hr></div>';
    default:
      return '<div style="padding:20px;color:var(--mist);font-size:13px">Unknown block type</div>';
  }
}

// Block palette (sidebar)
function pbRenderBlockPalette() {
  var palette = document.getElementById('lpb-palette');
  if (!palette) return;
  var html = '<div class="lpb-palette-title">Add Blocks</div>';
  PB_BLOCKS.forEach(function(b) {
    html += '<div class="lpb-palette-item" draggable="true" data-block-type="' + b.type + '">';
    html += '<div class="lpb-palette-icon">' + pbSvg(b.icon) + '</div>';
    html += '<div class="lpb-palette-info"><div class="lpb-palette-name">' + b.label + '</div><div class="lpb-palette-desc">' + b.desc + '</div></div>';
    html += '</div>';
  });
  palette.innerHTML = html;
  pbInitPaletteDrag();
}

// Add a new block from palette
function pbAddBlock(type) {
  var state = pbGetState();
  var defaults = {
    'hero': { headline: 'Your Headline Here', subtitle: 'A compelling subtitle that explains your value proposition.', cta: 'Get Started', ctaLink: '#' },
    'features': { heading: 'Why Choose Us', items: [{ title: 'Feature 1', desc: 'Description of this feature.' }, { title: 'Feature 2', desc: 'Description of this feature.' }, { title: 'Feature 3', desc: 'Description of this feature.' }] },
    'testimonial': { quote: 'This is an amazing testimonial from a satisfied client.', name: 'Client Name', role: 'Title, Company' },
    'cta': { heading: 'Ready to Get Started?', subtitle: 'Take the next step today.', cta: 'Contact Us', ctaLink: '#' },
    'stats': { items: [{ value: '100+', label: 'Clients Served' }, { value: '98%', label: 'Satisfaction' }, { value: '$1M+', label: 'Resolved' }] },
    'text': { body: '<p>Add your text content here. This is a versatile block for any written content.</p>' },
    'form': { heading: 'Get in Touch', fields: ['Name', 'Email', 'Message'], button: 'Submit' },
    'logo-bar': { logos: ['Partner 1', 'Partner 2', 'Partner 3', 'Partner 4'] },
    'faq': { items: [{ q: 'Question 1?', a: 'Answer to question 1.' }, { q: 'Question 2?', a: 'Answer to question 2.' }] },
    'divider': {}
  };
  state.blocks.push({ type: type, content: defaults[type] || {} });
  pbSaveState(state);
  pbRenderCanvas(state);
  // Scroll to the newly added block
  var canvas = document.getElementById('lpb-canvas');
  if (canvas) {
    var newBlock = canvas.querySelector('[data-index="' + (state.blocks.length - 1) + '"]');
    if (newBlock) newBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  if (typeof portalToast === 'function') portalToast(type.charAt(0).toUpperCase() + type.slice(1) + ' block added', 'success');
}

// Move block up or down
function pbMoveBlock(index, direction) {
  var state = pbGetState();
  var newIndex = index + direction;
  if (newIndex < 0 || newIndex >= state.blocks.length) return;
  var temp = state.blocks[index];
  state.blocks[index] = state.blocks[newIndex];
  state.blocks[newIndex] = temp;
  pbSaveState(state);
  pbRenderCanvas(state);
}

// Duplicate a block
function pbDuplicateBlock(index) {
  var state = pbGetState();
  var original = state.blocks[index];
  if (!original) return;
  var clone = JSON.parse(JSON.stringify(original));
  state.blocks.splice(index + 1, 0, clone);
  pbSaveState(state);
  pbRenderCanvas(state);
  var canvas = document.getElementById('lpb-canvas');
  if (canvas) {
    var dup = canvas.querySelector('[data-index="' + (index + 1) + '"]');
    if (dup) dup.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  if (typeof portalToast === 'function') portalToast('Block duplicated', 'success');
}

// Delete a block
function pbDeleteBlock(index) {
  var state = pbGetState();
  state.blocks.splice(index, 1);
  pbSaveState(state);
  pbRenderCanvas(state);
  if (typeof portalToast === 'function') portalToast('Block removed', 'info');
}

// Edit a block (inline editing via modal)
function pbEditBlock(index) {
  var state = pbGetState();
  var block = state.blocks[index];
  if (!block) return;

  var overlay = document.createElement('div');
  overlay.className = 'lpb-edit-overlay';
  overlay.id = 'lpb-edit-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) pbCloseEdit(); };

  var modal = document.createElement('div');
  modal.className = 'lpb-edit-modal';

  var h = '<div class="lpb-edit-header">';
  h += '<div class="lpb-edit-title">Edit ' + block.type.charAt(0).toUpperCase() + block.type.slice(1) + '</div>';
  h += '<button class="lpb-edit-close" onclick="pbCloseEdit()">' + pbSvg('minus') + '</button>';
  h += '</div>';
  h += '<div class="lpb-edit-body">';
  h += pbBuildEditForm(block);
  h += '</div>';
  h += '<div class="lpb-edit-footer">';
  h += '<button class="lpb-edit-save" onclick="pbSaveEdit(' + index + ')">Save Changes</button>';
  h += '<button class="lpb-edit-cancel" onclick="pbCloseEdit()">Cancel</button>';
  h += '</div>';

  modal.innerHTML = h;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function pbBuildEditForm(block) {
  var c = block.content;
  var h = '';
  switch (block.type) {
    case 'hero':
      h += pbEditField('Headline', 'lpb-e-headline', c.headline);
      h += pbEditField('Subtitle', 'lpb-e-subtitle', c.subtitle);
      h += pbEditField('Button text', 'lpb-e-cta', c.cta);
      break;
    case 'testimonial':
      h += pbEditTextarea('Quote', 'lpb-e-quote', c.quote);
      h += pbEditField('Name', 'lpb-e-name', c.name);
      h += pbEditField('Role / Title', 'lpb-e-role', c.role);
      break;
    case 'cta':
      h += pbEditField('Heading', 'lpb-e-heading', c.heading);
      h += pbEditField('Subtitle', 'lpb-e-subtitle', c.subtitle);
      h += pbEditField('Button text', 'lpb-e-cta', c.cta);
      break;
    case 'text':
      h += pbEditTextarea('Content', 'lpb-e-body', c.body);
      break;
    case 'form':
      h += pbEditField('Heading', 'lpb-e-heading', c.heading);
      h += pbEditField('Button text', 'lpb-e-button', c.button);
      h += '<div class="lpb-edit-hint">Fields: ' + (c.fields || []).join(', ') + '</div>';
      break;
    case 'features':
      h += pbEditField('Section heading', 'lpb-e-heading', c.heading);
      (c.items || []).forEach(function(item, i) {
        h += '<div class="lpb-edit-subheading">Feature ' + (i + 1) + '</div>';
        h += pbEditField('Title', 'lpb-e-feat-title-' + i, item.title);
        h += pbEditField('Description', 'lpb-e-feat-desc-' + i, item.desc);
      });
      break;
    case 'stats':
      (c.items || []).forEach(function(item, i) {
        h += '<div class="lpb-edit-subheading">Stat ' + (i + 1) + '</div>';
        h += pbEditField('Value', 'lpb-e-stat-val-' + i, item.value);
        h += pbEditField('Label', 'lpb-e-stat-label-' + i, item.label);
      });
      break;
    case 'faq':
      (c.items || []).forEach(function(item, i) {
        h += '<div class="lpb-edit-subheading">FAQ ' + (i + 1) + '</div>';
        h += pbEditField('Question', 'lpb-e-faq-q-' + i, item.q);
        h += pbEditTextarea('Answer', 'lpb-e-faq-a-' + i, item.a);
      });
      break;
    case 'logo-bar':
      (c.logos || []).forEach(function(logo, i) {
        h += pbEditField('Badge ' + (i + 1), 'lpb-e-logo-' + i, logo);
      });
      break;
    default:
      h += '<div class="lpb-edit-hint">This block type has no editable fields.</div>';
  }
  return h;
}

function pbEditField(label, id, value) {
  return '<div class="lpb-edit-field"><label class="lpb-edit-label">' + label + '</label><input class="lpb-edit-input" id="' + id + '" type="text" value="' + (value || '').replace(/"/g, '&quot;') + '"></div>';
}

function pbEditTextarea(label, id, value) {
  return '<div class="lpb-edit-field"><label class="lpb-edit-label">' + label + '</label><textarea class="lpb-edit-input lpb-edit-textarea" id="' + id + '" rows="4">' + (value || '') + '</textarea></div>';
}

function pbSaveEdit(index) {
  var state = pbGetState();
  var block = state.blocks[index];
  if (!block) return;
  var c = block.content;
  var el;

  switch (block.type) {
    case 'hero':
      el = document.getElementById('lpb-e-headline'); if (el) c.headline = el.value;
      el = document.getElementById('lpb-e-subtitle'); if (el) c.subtitle = el.value;
      el = document.getElementById('lpb-e-cta'); if (el) c.cta = el.value;
      break;
    case 'testimonial':
      el = document.getElementById('lpb-e-quote'); if (el) c.quote = el.value;
      el = document.getElementById('lpb-e-name'); if (el) c.name = el.value;
      el = document.getElementById('lpb-e-role'); if (el) c.role = el.value;
      break;
    case 'cta':
      el = document.getElementById('lpb-e-heading'); if (el) c.heading = el.value;
      el = document.getElementById('lpb-e-subtitle'); if (el) c.subtitle = el.value;
      el = document.getElementById('lpb-e-cta'); if (el) c.cta = el.value;
      break;
    case 'text':
      el = document.getElementById('lpb-e-body'); if (el) c.body = el.value;
      break;
    case 'form':
      el = document.getElementById('lpb-e-heading'); if (el) c.heading = el.value;
      el = document.getElementById('lpb-e-button'); if (el) c.button = el.value;
      break;
    case 'features':
      el = document.getElementById('lpb-e-heading'); if (el) c.heading = el.value;
      (c.items || []).forEach(function(item, i) {
        el = document.getElementById('lpb-e-feat-title-' + i); if (el) item.title = el.value;
        el = document.getElementById('lpb-e-feat-desc-' + i); if (el) item.desc = el.value;
      });
      break;
    case 'stats':
      (c.items || []).forEach(function(item, i) {
        el = document.getElementById('lpb-e-stat-val-' + i); if (el) item.value = el.value;
        el = document.getElementById('lpb-e-stat-label-' + i); if (el) item.label = el.value;
      });
      break;
    case 'faq':
      (c.items || []).forEach(function(item, i) {
        el = document.getElementById('lpb-e-faq-q-' + i); if (el) item.q = el.value;
        el = document.getElementById('lpb-e-faq-a-' + i); if (el) item.a = el.value;
      });
      break;
    case 'logo-bar':
      (c.logos || []).forEach(function(logo, i) {
        el = document.getElementById('lpb-e-logo-' + i);
        if (el) c.logos[i] = el.value;
      });
      break;
  }

  pbSaveState(state);
  pbCloseEdit();
  pbRenderCanvas(state);
  if (typeof portalToast === 'function') portalToast('Block updated', 'success');
}

function pbCloseEdit() {
  var el = document.getElementById('lpb-edit-overlay');
  if (el) el.remove();
}

// Preview mode
function pbTogglePreview() {
  var builder = document.getElementById('lpb-builder');
  if (!builder) return;
  builder.classList.toggle('lpb-preview-mode');
  var btn = document.getElementById('lpb-preview-btn');
  if (btn) {
    var isPreview = builder.classList.contains('lpb-preview-mode');
    btn.innerHTML = isPreview ? (pbSvg('edit') + ' Edit') : (pbSvg('eye') + ' Preview');
  }
}

// Reset — show template chooser
function pbResetBuilder() {
  pbShowTemplateChooser();
}

// Template chooser overlay
function pbShowTemplateChooser() {
  var overlay = document.createElement('div');
  overlay.className = 'lpb-edit-overlay';
  overlay.id = 'lpb-template-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var modal = document.createElement('div');
  modal.className = 'lpb-edit-modal lpb-template-modal';

  var h = '<div class="lpb-edit-header">';
  h += '<div class="lpb-edit-title">Choose a Template</div>';
  h += '<button class="lpb-edit-close" onclick="document.getElementById(\'lpb-template-overlay\').remove()">' + pbSvg('minus') + '</button>';
  h += '</div>';
  h += '<div class="lpb-template-grid">';

  var keys = Object.keys(PB_TEMPLATES);
  keys.forEach(function(key) {
    var t = PB_TEMPLATES[key];
    h += '<div class="lpb-template-card" onclick="pbApplyTemplate(\'' + key + '\')">';
    h += '<div class="lpb-template-icon">' + pbSvg('layout') + '</div>';
    h += '<div class="lpb-template-name">' + t.label + '</div>';
    h += '<div class="lpb-template-desc">' + t.desc + '</div>';
    h += '<div class="lpb-template-count">' + t.blocks.length + ' blocks</div>';
    h += '</div>';
  });

  h += '<div class="lpb-template-card lpb-template-blank" onclick="pbApplyTemplate(\'blank\')">';
  h += '<div class="lpb-template-icon">' + pbSvg('minus') + '</div>';
  h += '<div class="lpb-template-name">Blank</div>';
  h += '<div class="lpb-template-desc">Start from scratch</div>';
  h += '<div class="lpb-template-count">0 blocks</div>';
  h += '</div>';

  h += '</div>';
  modal.innerHTML = h;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

// Apply a template
function pbApplyTemplate(key) {
  var blocks = [];
  if (key !== 'blank' && PB_TEMPLATES[key]) {
    blocks = JSON.parse(JSON.stringify(PB_TEMPLATES[key].blocks));
  }
  var state = { blocks: blocks, published: false, pageName: 'My Landing Page' };
  pbSaveState(state);
  var overlay = document.getElementById('lpb-template-overlay');
  if (overlay) overlay.remove();
  pbInit();
  if (typeof portalToast === 'function') {
    portalToast(key === 'blank' ? 'Starting from scratch' : PB_TEMPLATES[key].label + ' template applied', 'success');
  }
}

// Export page as standalone HTML
function pbExportHTML() {
  var state = pbGetState();
  var html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n';
  html += '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width,initial-scale=1.0">\n';
  html += '<title>' + (state.pageName || 'My Landing Page') + '</title>\n';
  html += '<style>\n';
  html += '*{margin:0;padding:0;box-sizing:border-box}\n';
  html += 'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#1a2332;line-height:1.6}\n';
  html += '.section{padding:48px 24px;max-width:900px;margin:0 auto}\n';
  html += '.hero{background:linear-gradient(135deg,#0B2A5E,#0B5FD8);color:#fff;text-align:center;padding:64px 24px;max-width:none}\n';
  html += '.hero h1{font-size:36px;font-weight:700;margin-bottom:12px}\n';
  html += '.hero p{font-size:16px;opacity:0.9;margin-bottom:24px;max-width:500px;margin-left:auto;margin-right:auto}\n';
  html += '.hero .btn{display:inline-block;padding:12px 28px;background:#fff;color:#0B5FD8;font-weight:700;border-radius:8px;text-decoration:none}\n';
  html += '.stats{display:flex;justify-content:center;gap:40px;padding:40px 24px;background:#f6f8fc;max-width:none}\n';
  html += '.stat{text-align:center}\n.stat-val{font-size:28px;font-weight:700;color:#0B5FD8}\n.stat-label{font-size:13px;color:#64748b}\n';
  html += '.feat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:16px}\n';
  html += '.feat-card{padding:20px;border:1px solid #e5e7eb;border-radius:10px}\n';
  html += '.feat-card h3{font-size:15px;margin-bottom:6px}\n.feat-card p{font-size:13px;color:#64748b}\n';
  html += '.quote-block{padding:24px;border-left:3px solid #0B5FD8;background:#f6f8fc;border-radius:0 10px 10px 0}\n';
  html += '.quote-block blockquote{font-style:italic;font-size:15px;margin-bottom:10px}\n.quote-block cite{font-size:13px;color:#64748b}\n';
  html += '.cta-block{text-align:center;padding:48px 24px;background:#f6f8fc;max-width:none}\n';
  html += '.cta-block h2{font-size:24px;margin-bottom:8px}\n.cta-block p{color:#64748b;margin-bottom:20px}\n';
  html += '.cta-block .btn{display:inline-block;padding:12px 28px;background:#0B5FD8;color:#fff;font-weight:700;border-radius:8px;text-decoration:none}\n';
  html += '.form-block{max-width:420px;margin:0 auto;text-align:center}\n.form-block h2{font-size:20px;margin-bottom:16px}\n';
  html += '.form-block input{width:100%;padding:10px 14px;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:10px;font-size:14px}\n';
  html += '.form-block button{width:100%;padding:12px;background:#0B5FD8;color:#fff;font-weight:700;border:none;border-radius:8px;font-size:14px;cursor:pointer}\n';
  html += '.logos{display:flex;justify-content:center;gap:20px;padding:32px 24px;flex-wrap:wrap;max-width:none}\n';
  html += '.logo-badge{padding:10px 20px;background:#f6f8fc;border:1px solid #e5e7eb;border-radius:8px;font-size:13px;font-weight:600;color:#64748b}\n';
  html += '.faq-list{display:flex;flex-direction:column;gap:10px}\n';
  html += '.faq-item{padding:14px 18px;border:1px solid #e5e7eb;border-radius:8px;font-size:14px}\n.faq-item strong{color:#0B5FD8}\n';
  html += '.divider{padding:16px 0}\n.divider hr{border:none;height:2px;background:linear-gradient(90deg,transparent,#e5e7eb,transparent)}\n';
  html += '</style>\n</head>\n<body>\n';

  state.blocks.forEach(function(block) {
    var c = block.content;
    switch (block.type) {
      case 'hero':
        html += '<div class="hero"><h1>' + (c.headline || '') + '</h1><p>' + (c.subtitle || '') + '</p><a href="' + (c.ctaLink || '#') + '" class="btn">' + (c.cta || '') + '</a></div>\n';
        break;
      case 'stats':
        html += '<div class="stats">';
        (c.items || []).forEach(function(s) { html += '<div class="stat"><div class="stat-val">' + s.value + '</div><div class="stat-label">' + s.label + '</div></div>'; });
        html += '</div>\n';
        break;
      case 'features':
        html += '<div class="section">';
        if (c.heading) html += '<h2 style="text-align:center;margin-bottom:16px">' + c.heading + '</h2>';
        html += '<div class="feat-grid">';
        (c.items || []).forEach(function(f) { html += '<div class="feat-card"><h3>' + f.title + '</h3><p>' + f.desc + '</p></div>'; });
        html += '</div></div>\n';
        break;
      case 'testimonial':
        html += '<div class="section"><div class="quote-block"><blockquote>"' + (c.quote || '') + '"</blockquote><cite>-- ' + (c.name || '') + ', ' + (c.role || '') + '</cite></div></div>\n';
        break;
      case 'cta':
        html += '<div class="cta-block"><h2>' + (c.heading || '') + '</h2><p>' + (c.subtitle || '') + '</p><a href="' + (c.ctaLink || '#') + '" class="btn">' + (c.cta || '') + '</a></div>\n';
        break;
      case 'form':
        html += '<div class="section"><div class="form-block">';
        if (c.heading) html += '<h2>' + c.heading + '</h2>';
        html += '<form>';
        (c.fields || []).forEach(function(f) { html += '<input type="text" placeholder="' + f + '">'; });
        html += '<button type="submit">' + (c.button || 'Submit') + '</button>';
        html += '</form></div></div>\n';
        break;
      case 'logo-bar':
        html += '<div class="logos">';
        (c.logos || []).forEach(function(l) { html += '<div class="logo-badge">' + l + '</div>'; });
        html += '</div>\n';
        break;
      case 'faq':
        html += '<div class="section"><div class="faq-list">';
        (c.items || []).forEach(function(item) { html += '<div class="faq-item"><strong>Q:</strong> ' + item.q + '</div>'; });
        html += '</div></div>\n';
        break;
      case 'text':
        html += '<div class="section">' + (c.body || '') + '</div>\n';
        break;
      case 'divider':
        html += '<div class="divider"><hr></div>\n';
        break;
    }
  });

  html += '</body>\n</html>';

  // Download as file
  var blob = new Blob([html], { type: 'text/html' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = (state.pageName || 'landing-page').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  if (typeof portalToast === 'function') portalToast('HTML file downloaded', 'success');
}

// Drag and drop for canvas blocks (reorder)
function pbInitDragDrop() {
  var canvas = document.getElementById('lpb-canvas');
  if (!canvas) return;
  var blocks = canvas.querySelectorAll('.lpb-block');
  var dragSrc = null;

  blocks.forEach(function(block) {
    block.addEventListener('dragstart', function(e) {
      dragSrc = this;
      this.classList.add('lpb-dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', this.getAttribute('data-index'));
    });
    block.addEventListener('dragend', function() {
      this.classList.remove('lpb-dragging');
      canvas.querySelectorAll('.lpb-block').forEach(function(b) { b.classList.remove('lpb-dragover'); });
    });
    block.addEventListener('dragover', function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      this.classList.add('lpb-dragover');
    });
    block.addEventListener('dragleave', function() {
      this.classList.remove('lpb-dragover');
    });
    block.addEventListener('drop', function(e) {
      e.preventDefault();
      this.classList.remove('lpb-dragover');
      if (dragSrc === this) return;
      var fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
      var toIndex = parseInt(this.getAttribute('data-index'));
      var state = pbGetState();
      var moved = state.blocks.splice(fromIndex, 1)[0];
      state.blocks.splice(toIndex, 0, moved);
      pbSaveState(state);
      pbRenderCanvas(state);
    });
  });
}

// Drag from palette to canvas (add new block)
function pbInitPaletteDrag() {
  var items = document.querySelectorAll('.lpb-palette-item');
  var canvas = document.getElementById('lpb-canvas');
  if (!canvas) return;

  items.forEach(function(item) {
    item.addEventListener('dragstart', function(e) {
      e.dataTransfer.setData('text/plain', 'new:' + this.getAttribute('data-block-type'));
      e.dataTransfer.effectAllowed = 'copy';
    });
  });

  canvas.addEventListener('dragover', function(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  });

  canvas.addEventListener('drop', function(e) {
    e.preventDefault();
    var data = e.dataTransfer.getData('text/plain');
    if (data.indexOf('new:') === 0) {
      var type = data.replace('new:', '');
      pbAddBlock(type);
    }
  });

  // Also allow click to add
  items.forEach(function(item) {
    item.addEventListener('click', function() {
      var type = this.getAttribute('data-block-type');
      pbAddBlock(type);
    });
  });
}
