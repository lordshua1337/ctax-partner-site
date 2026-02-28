// --- Landing Page Builder (GrapesJS) ---
// Full drag-and-drop page builder powered by GrapesJS.
// Partners design referral/business landing pages with custom blocks,
// device preview, and HTML export.

var PB_STORAGE_KEY = 'ctax_pb_gjs';
var pbEditor = null;

// Starter templates
var PB_TEMPLATES = {
  referral: {
    label: 'Referral Page',
    desc: 'Client-facing page for IRS tax resolution referrals',
    html: [
      '<section class="pb-hero">',
      '  <h1>Struggling with IRS Tax Debt?</h1>',
      '  <p>Get expert help from licensed tax professionals. Free consultation, no obligation.</p>',
      '  <a class="pb-btn">Get Your Free Assessment</a>',
      '</section>',
      '<section class="pb-stats-row">',
      '  <div class="pb-stat"><span class="pb-stat-val">$2.3B</span><span class="pb-stat-label">Tax Debt Resolved</span></div>',
      '  <div class="pb-stat"><span class="pb-stat-val">10,000+</span><span class="pb-stat-label">Active Partners</span></div>',
      '  <div class="pb-stat"><span class="pb-stat-val">~80%</span><span class="pb-stat-label">Conversion Rate</span></div>',
      '  <div class="pb-stat"><span class="pb-stat-val">14 Yrs</span><span class="pb-stat-label">Experience</span></div>',
      '</section>',
      '<section class="pb-features">',
      '  <h2>Why Choose Us</h2>',
      '  <div class="pb-feat-grid">',
      '    <div class="pb-feat-card"><h3>Licensed Professionals</h3><p>Enrolled agents and tax attorneys who negotiate directly with the IRS on your behalf.</p></div>',
      '    <div class="pb-feat-card"><h3>Proven Track Record</h3><p>Over $2.3 billion in tax debt resolved for thousands of clients nationwide.</p></div>',
      '    <div class="pb-feat-card"><h3>Free Consultation</h3><p>No-obligation assessment to understand your options and next steps.</p></div>',
      '  </div>',
      '</section>',
      '<section class="pb-testimonial">',
      '  <blockquote>"I owed the IRS $47,000 and felt hopeless. Community Tax settled my case for $8,200. I finally sleep at night."</blockquote>',
      '  <cite>-- Michael R., Small Business Owner, TX</cite>',
      '</section>',
      '<section class="pb-cta-section">',
      '  <h2>Ready to Resolve Your Tax Debt?</h2>',
      '  <p>Schedule a free, no-obligation consultation today.</p>',
      '  <a class="pb-btn">Get Started Now</a>',
      '</section>',
      '<section class="pb-form-section">',
      '  <h2>Request Your Free Consultation</h2>',
      '  <form class="pb-form">',
      '    <input type="text" placeholder="Full Name"/>',
      '    <input type="email" placeholder="Email Address"/>',
      '    <input type="tel" placeholder="Phone Number"/>',
      '    <input type="text" placeholder="Estimated Tax Debt"/>',
      '    <button type="button" class="pb-btn">Submit Request</button>',
      '  </form>',
      '</section>'
    ].join('\n')
  },
  business: {
    label: 'Business Page',
    desc: 'Professional page showcasing your tax practice',
    html: [
      '<section class="pb-hero pb-hero-dark">',
      '  <h1>Your Trusted Tax Partner</h1>',
      '  <p>Full-service tax preparation and IRS resolution. Serving families and small businesses since 2012.</p>',
      '  <a class="pb-btn">Book a Consultation</a>',
      '</section>',
      '<section class="pb-trust-bar">',
      '  <span class="pb-trust-badge">IRS Authorized</span>',
      '  <span class="pb-trust-badge">BBB A+ Rated</span>',
      '  <span class="pb-trust-badge">NAEA Member</span>',
      '  <span class="pb-trust-badge">Certified EA</span>',
      '</section>',
      '<section class="pb-features">',
      '  <h2>Our Services</h2>',
      '  <div class="pb-feat-grid">',
      '    <div class="pb-feat-card"><h3>Tax Preparation</h3><p>Individual and business returns with maximum deductions guaranteed.</p></div>',
      '    <div class="pb-feat-card"><h3>IRS Resolution</h3><p>Offers in compromise, installment plans, and penalty abatement.</p></div>',
      '    <div class="pb-feat-card"><h3>Tax Planning</h3><p>Year-round strategy to minimize your tax burden legally.</p></div>',
      '  </div>',
      '</section>',
      '<section class="pb-testimonial">',
      '  <blockquote>"They saved us over $12,000 in our first year. Professional, responsive, and easy to work with."</blockquote>',
      '  <cite>-- Sarah K., Small Business Owner</cite>',
      '</section>',
      '<section class="pb-form-section">',
      '  <h2>Get in Touch</h2>',
      '  <form class="pb-form">',
      '    <input type="text" placeholder="Full Name"/>',
      '    <input type="email" placeholder="Email Address"/>',
      '    <input type="tel" placeholder="Phone Number"/>',
      '    <textarea placeholder="How can we help?"></textarea>',
      '    <button type="button" class="pb-btn">Send Message</button>',
      '  </form>',
      '</section>'
    ].join('\n')
  },
  minimal: {
    label: 'Minimal',
    desc: 'Clean one-section lead capture',
    html: [
      '<section class="pb-hero">',
      '  <h1>Resolve Your IRS Tax Debt</h1>',
      '  <p>Licensed professionals. Proven results. Free consultation.</p>',
      '  <a class="pb-btn">Start Now</a>',
      '</section>',
      '<section class="pb-form-section">',
      '  <h2>Request a Free Consultation</h2>',
      '  <form class="pb-form">',
      '    <input type="text" placeholder="Full Name"/>',
      '    <input type="email" placeholder="Email Address"/>',
      '    <input type="tel" placeholder="Phone Number"/>',
      '    <button type="button" class="pb-btn">Get Started</button>',
      '  </form>',
      '</section>'
    ].join('\n')
  }
};

// Canvas styles injected into the GrapesJS iframe
var PB_CANVAS_CSS = [
  '* { margin:0; padding:0; box-sizing:border-box; }',
  'body { font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; color:#1a2332; line-height:1.6; background:#fff; }',
  // Hero
  '.pb-hero { padding:64px 32px; text-align:center; background:linear-gradient(135deg,#111827 0%,#1f2937 100%); color:#fff; }',
  '.pb-hero-dark { background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%); }',
  '.pb-hero h1 { font-size:36px; font-weight:800; margin-bottom:12px; letter-spacing:-0.02em; }',
  '.pb-hero p { font-size:16px; opacity:0.8; max-width:520px; margin:0 auto 24px; line-height:1.6; }',
  // Button
  '.pb-btn { display:inline-block; padding:12px 28px; background:#2563eb; color:#fff; font-size:14px; font-weight:700; border-radius:8px; text-decoration:none; border:none; cursor:pointer; letter-spacing:0.01em; }',
  '.pb-btn:hover { background:#1d4ed8; }',
  // Stats
  '.pb-stats-row { display:flex; justify-content:center; gap:48px; padding:40px 32px; background:#f8fafc; }',
  '.pb-stat { text-align:center; }',
  '.pb-stat-val { display:block; font-size:28px; font-weight:800; color:#111827; letter-spacing:-0.02em; }',
  '.pb-stat-label { display:block; font-size:13px; color:#64748b; margin-top:2px; }',
  // Features
  '.pb-features { padding:48px 32px; text-align:center; }',
  '.pb-features h2 { font-size:24px; font-weight:700; margin-bottom:24px; color:#111827; }',
  '.pb-feat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; max-width:800px; margin:0 auto; }',
  '.pb-feat-card { padding:24px; border:1px solid #e5e7eb; border-radius:10px; text-align:left; }',
  '.pb-feat-card h3 { font-size:15px; font-weight:700; margin-bottom:6px; color:#111827; }',
  '.pb-feat-card p { font-size:13px; color:#64748b; line-height:1.6; }',
  // Testimonial
  '.pb-testimonial { padding:40px 32px; background:#f8fafc; text-align:center; }',
  '.pb-testimonial blockquote { font-size:16px; font-style:italic; color:#374151; max-width:600px; margin:0 auto 12px; line-height:1.7; }',
  '.pb-testimonial cite { font-size:13px; color:#64748b; font-style:normal; font-weight:600; }',
  // CTA
  '.pb-cta-section { padding:48px 32px; text-align:center; background:#111827; color:#fff; }',
  '.pb-cta-section h2 { font-size:24px; font-weight:700; margin-bottom:8px; }',
  '.pb-cta-section p { font-size:14px; opacity:0.7; margin-bottom:20px; }',
  // Trust bar
  '.pb-trust-bar { display:flex; justify-content:center; gap:16px; padding:24px 32px; background:#f8fafc; flex-wrap:wrap; }',
  '.pb-trust-badge { padding:8px 16px; background:#fff; border:1px solid #e5e7eb; border-radius:6px; font-size:13px; font-weight:600; color:#374151; }',
  // Form
  '.pb-form-section { padding:48px 32px; text-align:center; }',
  '.pb-form-section h2 { font-size:22px; font-weight:700; margin-bottom:20px; color:#111827; }',
  '.pb-form { max-width:400px; margin:0 auto; text-align:left; }',
  '.pb-form input, .pb-form textarea { width:100%; padding:11px 14px; border:1px solid #d1d5db; border-radius:8px; font-size:14px; margin-bottom:10px; font-family:inherit; color:#111827; background:#fff; }',
  '.pb-form input:focus, .pb-form textarea:focus { outline:none; border-color:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,0.1); }',
  '.pb-form textarea { min-height:80px; resize:vertical; }',
  '.pb-form .pb-btn { width:100%; text-align:center; margin-top:4px; }',
  // Divider
  '.pb-divider { padding:16px 0; }',
  '.pb-divider hr { border:none; height:1px; background:#e5e7eb; }',
  // Text
  '.pb-text-block { padding:32px; max-width:700px; margin:0 auto; }',
  '.pb-text-block p { font-size:15px; color:#374151; line-height:1.7; }',
  // FAQ
  '.pb-faq { padding:48px 32px; }',
  '.pb-faq h2 { text-align:center; font-size:22px; font-weight:700; margin-bottom:24px; color:#111827; }',
  '.pb-faq-item { padding:16px 20px; border:1px solid #e5e7eb; border-radius:8px; margin-bottom:10px; max-width:600px; margin-left:auto; margin-right:auto; }',
  '.pb-faq-item strong { color:#111827; font-size:14px; }',
  '.pb-faq-item p { font-size:13px; color:#64748b; margin-top:4px; line-height:1.5; }',
  // Responsive in canvas
  '@media(max-width:600px) {',
  '  .pb-hero h1 { font-size:26px; }',
  '  .pb-feat-grid { grid-template-columns:1fr; }',
  '  .pb-stats-row { flex-wrap:wrap; gap:20px; }',
  '}'
].join('\n');

function pbInit() {
  var container = document.getElementById('gjs');
  if (!container || pbEditor) return;

  // Load saved state or default template
  var savedHtml = '';
  var savedCss = '';
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
      styles: [],
      scripts: []
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
        {
          name: 'Layout',
          open: true,
          buildProps: ['display', 'flex-direction', 'justify-content', 'align-items', 'flex-wrap', 'gap']
        },
        {
          name: 'Dimension',
          open: false,
          buildProps: ['width', 'max-width', 'min-height', 'padding', 'margin']
        },
        {
          name: 'Typography',
          open: false,
          buildProps: ['font-family', 'font-size', 'font-weight', 'color', 'line-height', 'text-align', 'letter-spacing']
        },
        {
          name: 'Appearance',
          open: false,
          buildProps: ['background-color', 'background', 'border', 'border-radius', 'box-shadow', 'opacity']
        }
      ]
    },
    selectorManager: {
      appendTo: '#pb-styles'
    },
    layerManager: {
      appendTo: '#pb-layers'
    }
  });

  // Inject canvas styles
  var canvasDoc = pbEditor.Canvas.getDocument();
  if (canvasDoc) {
    var styleEl = canvasDoc.createElement('style');
    styleEl.textContent = PB_CANVAS_CSS;
    canvasDoc.head.appendChild(styleEl);
  }

  // Also inject on canvas frame load (for initial load)
  pbEditor.on('canvas:frame:load', function(opts) {
    var doc = opts.window.document;
    var style = doc.createElement('style');
    style.textContent = PB_CANVAS_CSS;
    doc.head.appendChild(style);
  });

  // Add custom blocks
  pbAddBlocks(pbEditor);

  // Auto-save on change
  pbEditor.on('change:changesCount', function() {
    pbSave();
  });

  // Update block count
  pbEditor.on('component:add', pbUpdateCount);
  pbEditor.on('component:remove', pbUpdateCount);
  pbUpdateCount();

  // Add keyboard shortcuts
  pbEditor.Commands.add('pb:save', { run: function() { pbSave(); } });
}

function pbAddBlocks(editor) {
  var bm = editor.Blocks;

  bm.add('hero', {
    label: 'Hero',
    category: 'Sections',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="2" y1="9" x2="22" y2="9"/></svg>',
    content: '<section class="pb-hero"><h1>Your Headline Here</h1><p>A compelling subtitle that explains your value proposition clearly.</p><a class="pb-btn">Call to Action</a></section>'
  });

  bm.add('stats', {
    label: 'Stats Row',
    category: 'Sections',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    content: '<section class="pb-stats-row"><div class="pb-stat"><span class="pb-stat-val">100+</span><span class="pb-stat-label">Clients</span></div><div class="pb-stat"><span class="pb-stat-val">98%</span><span class="pb-stat-label">Satisfaction</span></div><div class="pb-stat"><span class="pb-stat-val">$1M+</span><span class="pb-stat-label">Resolved</span></div></section>'
  });

  bm.add('features', {
    label: 'Features',
    category: 'Sections',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    content: '<section class="pb-features"><h2>Why Choose Us</h2><div class="pb-feat-grid"><div class="pb-feat-card"><h3>Feature One</h3><p>Description of this feature and why it matters to your audience.</p></div><div class="pb-feat-card"><h3>Feature Two</h3><p>Description of this feature and why it matters to your audience.</p></div><div class="pb-feat-card"><h3>Feature Three</h3><p>Description of this feature and why it matters to your audience.</p></div></div></section>'
  });

  bm.add('testimonial', {
    label: 'Testimonial',
    category: 'Sections',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>',
    content: '<section class="pb-testimonial"><blockquote>"This is an amazing testimonial from a satisfied client who had a great experience."</blockquote><cite>-- Client Name, Title</cite></section>'
  });

  bm.add('cta', {
    label: 'CTA',
    category: 'Sections',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
    content: '<section class="pb-cta-section"><h2>Ready to Get Started?</h2><p>Take the next step today.</p><a class="pb-btn">Contact Us</a></section>'
  });

  bm.add('form', {
    label: 'Form',
    category: 'Sections',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg>',
    content: '<section class="pb-form-section"><h2>Get in Touch</h2><form class="pb-form"><input type="text" placeholder="Full Name"/><input type="email" placeholder="Email"/><input type="tel" placeholder="Phone"/><button type="button" class="pb-btn">Submit</button></form></section>'
  });

  bm.add('trust-bar', {
    label: 'Trust Bar',
    category: 'Sections',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    content: '<section class="pb-trust-bar"><span class="pb-trust-badge">IRS Authorized</span><span class="pb-trust-badge">BBB A+</span><span class="pb-trust-badge">NAEA Member</span><span class="pb-trust-badge">Licensed</span></section>'
  });

  bm.add('faq', {
    label: 'FAQ',
    category: 'Sections',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M9 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    content: '<section class="pb-faq"><h2>Frequently Asked Questions</h2><div class="pb-faq-item"><strong>How does the free consultation work?</strong><p>We review your tax situation and present your options at no cost.</p></div><div class="pb-faq-item"><strong>What resolution options exist?</strong><p>Offers in compromise, installment agreements, penalty abatement, and more.</p></div><div class="pb-faq-item"><strong>How long does it take?</strong><p>Most cases resolve within 3-6 months depending on complexity.</p></div></section>'
  });

  bm.add('text-block', {
    label: 'Text',
    category: 'Basic',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>',
    content: '<div class="pb-text-block"><p>Add your text content here. This is a flexible block for written content, descriptions, or any copy you need.</p></div>'
  });

  bm.add('divider', {
    label: 'Divider',
    category: 'Basic',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="3" y1="12" x2="21" y2="12"/></svg>',
    content: '<div class="pb-divider"><hr/></div>'
  });

  bm.add('button', {
    label: 'Button',
    category: 'Basic',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="8" width="18" height="8" rx="4"/></svg>',
    content: '<a class="pb-btn" style="display:inline-block;margin:16px auto;text-align:center;">Click Here</a>'
  });

  bm.add('image', {
    label: 'Image',
    category: 'Basic',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
    content: { type: 'image' },
    activate: true,
    select: true
  });

  bm.add('columns-2', {
    label: '2 Columns',
    category: 'Layout',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="9" height="16" rx="1"/><rect x="13" y="4" width="9" height="16" rx="1"/></svg>',
    content: '<div style="display:flex;gap:20px;padding:32px"><div style="flex:1;min-height:60px;border:1px dashed #d1d5db;border-radius:8px;padding:16px">Column 1</div><div style="flex:1;min-height:60px;border:1px dashed #d1d5db;border-radius:8px;padding:16px">Column 2</div></div>'
  });

  bm.add('columns-3', {
    label: '3 Columns',
    category: 'Layout',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="4" width="6" height="16" rx="1"/><rect x="9" y="4" width="6" height="16" rx="1"/><rect x="17" y="4" width="6" height="16" rx="1"/></svg>',
    content: '<div style="display:flex;gap:16px;padding:32px"><div style="flex:1;min-height:60px;border:1px dashed #d1d5db;border-radius:8px;padding:16px">Col 1</div><div style="flex:1;min-height:60px;border:1px dashed #d1d5db;border-radius:8px;padding:16px">Col 2</div><div style="flex:1;min-height:60px;border:1px dashed #d1d5db;border-radius:8px;padding:16px">Col 3</div></div>'
  });
}

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

// Device switching
function pbSetDevice(device) {
  if (!pbEditor) return;
  pbEditor.setDevice(device);
  // Update active button
  document.querySelectorAll('.pb-device-btn').forEach(function(btn) {
    btn.classList.toggle('pb-device-active', btn.getAttribute('data-device') === device);
  });
}

// Panel switching (blocks / styles / layers)
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

// Export as HTML file
function pbExportHTML() {
  if (!pbEditor) return;
  var html = pbEditor.getHtml();
  var css = pbEditor.getCss({ avoidProtected: true });

  var fullHtml = '<!DOCTYPE html>\n<html lang="en">\n<head>\n';
  fullHtml += '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width,initial-scale=1.0">\n';
  fullHtml += '<title>My Landing Page</title>\n';
  fullHtml += '<style>\n' + PB_CANVAS_CSS + '\n' + (css || '') + '\n</style>\n';
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

// Load a template
function pbLoadTemplate(key) {
  if (!pbEditor || !PB_TEMPLATES[key]) return;
  var t = PB_TEMPLATES[key];
  pbEditor.setComponents(t.html);
  pbEditor.setStyle('');
  pbSave();
  pbUpdateCount();
  if (typeof portalToast === 'function') portalToast(t.label + ' loaded', 'success');
}

// Clear canvas
function pbClearCanvas() {
  if (!pbEditor) return;
  pbEditor.setComponents('');
  pbEditor.setStyle('');
  pbSave();
  pbUpdateCount();
  if (typeof portalToast === 'function') portalToast('Canvas cleared', 'info');
}

// Template chooser modal
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
  h += '<div class="pb-tpl-title">Choose a Template</div>';
  h += '<button class="pb-tpl-close" onclick="document.getElementById(\'pb-template-overlay\').remove()">';
  h += '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  h += '</button>';
  h += '</div>';
  h += '<div class="pb-tpl-grid">';

  var keys = Object.keys(PB_TEMPLATES);
  keys.forEach(function(key) {
    var t = PB_TEMPLATES[key];
    h += '<div class="pb-tpl-card" onclick="pbLoadTemplate(\'' + key + '\');document.getElementById(\'pb-template-overlay\').remove();">';
    h += '<div class="pb-tpl-card-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg></div>';
    h += '<div class="pb-tpl-card-name">' + t.label + '</div>';
    h += '<div class="pb-tpl-card-desc">' + t.desc + '</div>';
    h += '</div>';
  });

  h += '<div class="pb-tpl-card pb-tpl-card-blank" onclick="pbClearCanvas();document.getElementById(\'pb-template-overlay\').remove();">';
  h += '<div class="pb-tpl-card-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>';
  h += '<div class="pb-tpl-card-name">Blank</div>';
  h += '<div class="pb-tpl-card-desc">Start from scratch</div>';
  h += '</div>';

  h += '</div>';
  modal.innerHTML = h;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

// Destroy editor when leaving the section
function pbDestroy() {
  if (pbEditor) {
    pbSave();
    pbEditor.destroy();
    pbEditor = null;
  }
}
