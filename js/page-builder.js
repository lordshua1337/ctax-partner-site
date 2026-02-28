// --- Landing Page Builder (GrapesJS) ---
// Full drag-and-drop page builder powered by GrapesJS.
// Partners pick a stock design, then customize with blocks,
// device preview, style editing, and HTML export.

var PB_STORAGE_KEY = 'ctax_pb_gjs';
var PB_PAGES_KEY = 'ctax_pb_pages';
var pbEditor = null;
var pbPreviewActive = false;
var pbEditingSlug = null;

// ── Template definitions ──
// Each template has a label, description, icon identifier, and full HTML.
var PB_TEMPLATES = {
  referral: {
    label: 'Client Referral',
    desc: 'Full-funnel page: hero, social proof, features, testimonial, CTA, and lead form.',
    icon: 'funnel',
    sections: ['Hero', 'Stats', 'Features', 'Testimonial', 'CTA', 'Form'],
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
    label: 'Tax Practice',
    desc: 'Showcase your firm: trust badges, services grid, testimonial, and contact form.',
    icon: 'briefcase',
    sections: ['Hero', 'Trust Bar', 'Features', 'Testimonial', 'Form'],
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
  authority: {
    label: 'Authority Page',
    desc: 'Build trust and credibility: credentials, stats, FAQ, and a strong call to action.',
    icon: 'shield',
    sections: ['Hero', 'Trust Bar', 'Stats', 'FAQ', 'CTA'],
    html: [
      '<section class="pb-hero">',
      '  <h1>14 Years Resolving IRS Tax Debt</h1>',
      '  <p>Licensed enrolled agents and CPAs with a proven track record of helping Americans settle their tax obligations.</p>',
      '  <a class="pb-btn">Check Your Eligibility</a>',
      '</section>',
      '<section class="pb-trust-bar">',
      '  <span class="pb-trust-badge">IRS Authorized e-file Provider</span>',
      '  <span class="pb-trust-badge">BBB A+ Rated</span>',
      '  <span class="pb-trust-badge">NAEA Member</span>',
      '  <span class="pb-trust-badge">$2.3B+ Resolved</span>',
      '</section>',
      '<section class="pb-stats-row">',
      '  <div class="pb-stat"><span class="pb-stat-val">50,000+</span><span class="pb-stat-label">Cases Resolved</span></div>',
      '  <div class="pb-stat"><span class="pb-stat-val">83%</span><span class="pb-stat-label">Avg. Debt Reduction</span></div>',
      '  <div class="pb-stat"><span class="pb-stat-val">4.8/5</span><span class="pb-stat-label">Client Rating</span></div>',
      '  <div class="pb-stat"><span class="pb-stat-val">48hrs</span><span class="pb-stat-label">IRS Response Time</span></div>',
      '</section>',
      '<section class="pb-faq">',
      '  <h2>Common Questions</h2>',
      '  <div class="pb-faq-item"><strong>What is an Offer in Compromise?</strong><p>An OIC lets you settle your tax debt for less than you owe. Our team evaluates your eligibility and negotiates directly with the IRS.</p></div>',
      '  <div class="pb-faq-item"><strong>Will I get audited or penalized?</strong><p>No. Working with a licensed representative shows good faith. The IRS prefers resolution over enforcement.</p></div>',
      '  <div class="pb-faq-item"><strong>How much does it cost?</strong><p>Your initial consultation is free. We review your situation and present transparent pricing before any commitment.</p></div>',
      '  <div class="pb-faq-item"><strong>How long does resolution take?</strong><p>Most cases resolve in 3-6 months. Complex cases involving multiple years or business taxes may take longer.</p></div>',
      '</section>',
      '<section class="pb-cta-section">',
      '  <h2>Get Your Free Tax Debt Analysis</h2>',
      '  <p>Find out exactly where you stand and what options are available to you.</p>',
      '  <a class="pb-btn">Start Your Free Review</a>',
      '</section>'
    ].join('\n')
  },
  leadcapture: {
    label: 'Lead Capture',
    desc: 'Minimal high-conversion page: bold headline, key stats, and a focused lead form.',
    icon: 'target',
    sections: ['Hero', 'Stats', 'Form'],
    html: [
      '<section class="pb-hero">',
      '  <h1>Resolve Your IRS Tax Debt</h1>',
      '  <p>Licensed professionals. Proven results. Free consultation.</p>',
      '  <a class="pb-btn">Start Now</a>',
      '</section>',
      '<section class="pb-stats-row">',
      '  <div class="pb-stat"><span class="pb-stat-val">$2.3B</span><span class="pb-stat-label">Tax Debt Resolved</span></div>',
      '  <div class="pb-stat"><span class="pb-stat-val">50K+</span><span class="pb-stat-label">Clients Helped</span></div>',
      '  <div class="pb-stat"><span class="pb-stat-val">Free</span><span class="pb-stat-label">Consultation</span></div>',
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
  },
  webinar: {
    label: 'Webinar / Event',
    desc: 'Promote a webinar or live event: headline, key details, speaker bio, and registration.',
    icon: 'video',
    sections: ['Hero', 'Stats', 'Features', 'Testimonial', 'Form'],
    html: [
      '<section class="pb-hero pb-hero-dark">',
      '  <h1>Free Webinar: How to Settle IRS Tax Debt</h1>',
      '  <p>Join our licensed tax professionals for a live 30-minute session. Learn the exact steps to resolve your tax debt legally.</p>',
      '  <a class="pb-btn">Reserve Your Spot</a>',
      '</section>',
      '<section class="pb-stats-row">',
      '  <div class="pb-stat"><span class="pb-stat-val">Live</span><span class="pb-stat-label">30-Min Session</span></div>',
      '  <div class="pb-stat"><span class="pb-stat-val">Free</span><span class="pb-stat-label">No Obligation</span></div>',
      '  <div class="pb-stat"><span class="pb-stat-val">Q&A</span><span class="pb-stat-label">Ask Questions Live</span></div>',
      '</section>',
      '<section class="pb-features">',
      '  <h2>What You Will Learn</h2>',
      '  <div class="pb-feat-grid">',
      '    <div class="pb-feat-card"><h3>Your Options</h3><p>Offers in compromise, installment plans, penalty abatement, and which one fits your situation.</p></div>',
      '    <div class="pb-feat-card"><h3>The Process</h3><p>Step-by-step walkthrough of how IRS resolution works, from initial filing to final settlement.</p></div>',
      '    <div class="pb-feat-card"><h3>Common Mistakes</h3><p>The costly errors most people make when dealing with the IRS, and how to avoid them.</p></div>',
      '  </div>',
      '</section>',
      '<section class="pb-testimonial">',
      '  <blockquote>"This webinar gave me the confidence to finally deal with my $32K tax debt. I had no idea settling was even an option."</blockquote>',
      '  <cite>-- Lisa M., Webinar Attendee</cite>',
      '</section>',
      '<section class="pb-form-section">',
      '  <h2>Register for the Free Webinar</h2>',
      '  <form class="pb-form">',
      '    <input type="text" placeholder="Full Name"/>',
      '    <input type="email" placeholder="Email Address"/>',
      '    <input type="tel" placeholder="Phone Number"/>',
      '    <button type="button" class="pb-btn">Reserve My Spot</button>',
      '  </form>',
      '</section>'
    ].join('\n')
  },
  compare: {
    label: 'Comparison',
    desc: 'Compare your services to alternatives: side-by-side features, social proof, and CTA.',
    icon: 'compare',
    sections: ['Hero', 'Features', 'Stats', 'Testimonial', 'CTA', 'Form'],
    html: [
      '<section class="pb-hero">',
      '  <h1>Why Clients Choose Us Over DIY Tax Relief</h1>',
      '  <p>See how working with licensed professionals compares to going it alone or using discount services.</p>',
      '</section>',
      '<section class="pb-features">',
      '  <h2>The Difference Is Clear</h2>',
      '  <div class="pb-feat-grid">',
      '    <div class="pb-feat-card"><h3>Licensed Representation</h3><p>Enrolled agents and CPAs who are authorized to represent you before the IRS. Discount services use unlicensed staff.</p></div>',
      '    <div class="pb-feat-card"><h3>Full Case Management</h3><p>We handle everything from initial filing to final resolution. DIY means navigating IRS bureaucracy yourself.</p></div>',
      '    <div class="pb-feat-card"><h3>Transparent Pricing</h3><p>Flat fees with no hidden charges. Competitors often add surprise fees mid-case when you are locked in.</p></div>',
      '  </div>',
      '</section>',
      '<section class="pb-stats-row">',
      '  <div class="pb-stat"><span class="pb-stat-val">83%</span><span class="pb-stat-label">Avg. Reduction</span></div>',
      '  <div class="pb-stat"><span class="pb-stat-val">3-6 Mo</span><span class="pb-stat-label">Resolution Time</span></div>',
      '  <div class="pb-stat"><span class="pb-stat-val">4.8/5</span><span class="pb-stat-label">Client Rating</span></div>',
      '</section>',
      '<section class="pb-testimonial">',
      '  <blockquote>"I tried to handle it myself for two years and got nowhere. Community Tax resolved everything in four months. I wish I had called sooner."</blockquote>',
      '  <cite>-- David T., Small Business Owner, FL</cite>',
      '</section>',
      '<section class="pb-cta-section">',
      '  <h2>Stop Wondering. Start Resolving.</h2>',
      '  <p>Free consultation. No obligation. Real answers.</p>',
      '  <a class="pb-btn">Get Your Free Assessment</a>',
      '</section>',
      '<section class="pb-form-section">',
      '  <h2>Talk to a Tax Professional Today</h2>',
      '  <form class="pb-form">',
      '    <input type="text" placeholder="Full Name"/>',
      '    <input type="email" placeholder="Email Address"/>',
      '    <input type="tel" placeholder="Phone Number"/>',
      '    <input type="text" placeholder="Estimated Tax Debt"/>',
      '    <button type="button" class="pb-btn">Get Free Assessment</button>',
      '  </form>',
      '</section>'
    ].join('\n')
  }
};

// Canvas styles injected into the GrapesJS iframe (kept as fallback)
var PB_CANVAS_CSS = [
  '* { margin:0; padding:0; box-sizing:border-box; }',
  'body { font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; color:#1a2332; line-height:1.6; background:#fff; }',
  '.pb-hero { padding:64px 32px; text-align:center; background:linear-gradient(135deg,#111827 0%,#1f2937 100%); color:#fff; }',
  '.pb-hero-dark { background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%); }',
  '.pb-hero h1 { font-size:36px; font-weight:800; margin-bottom:12px; letter-spacing:-0.02em; }',
  '.pb-hero p { font-size:16px; opacity:0.8; max-width:520px; margin:0 auto 24px; line-height:1.6; }',
  '.pb-btn { display:inline-block; padding:12px 28px; background:#2563eb; color:#fff; font-size:14px; font-weight:700; border-radius:8px; text-decoration:none; border:none; cursor:pointer; letter-spacing:0.01em; }',
  '.pb-btn:hover { background:#1d4ed8; }',
  '.pb-stats-row { display:flex; justify-content:center; gap:48px; padding:40px 32px; background:#f8fafc; }',
  '.pb-stat { text-align:center; }',
  '.pb-stat-val { display:block; font-size:28px; font-weight:800; color:#111827; letter-spacing:-0.02em; }',
  '.pb-stat-label { display:block; font-size:13px; color:#64748b; margin-top:2px; }',
  '.pb-features { padding:48px 32px; text-align:center; }',
  '.pb-features h2 { font-size:24px; font-weight:700; margin-bottom:24px; color:#111827; }',
  '.pb-feat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; max-width:800px; margin:0 auto; }',
  '.pb-feat-card { padding:24px; border:1px solid #e5e7eb; border-radius:10px; text-align:left; }',
  '.pb-feat-card h3 { font-size:15px; font-weight:700; margin-bottom:6px; color:#111827; }',
  '.pb-feat-card p { font-size:13px; color:#64748b; line-height:1.6; }',
  '.pb-testimonial { padding:40px 32px; background:#f8fafc; text-align:center; }',
  '.pb-testimonial blockquote { font-size:16px; font-style:italic; color:#374151; max-width:600px; margin:0 auto 12px; line-height:1.7; }',
  '.pb-testimonial cite { font-size:13px; color:#64748b; font-style:normal; font-weight:600; }',
  '.pb-cta-section { padding:48px 32px; text-align:center; background:#111827; color:#fff; }',
  '.pb-cta-section h2 { font-size:24px; font-weight:700; margin-bottom:8px; }',
  '.pb-cta-section p { font-size:14px; opacity:0.7; margin-bottom:20px; }',
  '.pb-trust-bar { display:flex; justify-content:center; gap:16px; padding:24px 32px; background:#f8fafc; flex-wrap:wrap; }',
  '.pb-trust-badge { padding:8px 16px; background:#fff; border:1px solid #e5e7eb; border-radius:6px; font-size:13px; font-weight:600; color:#374151; }',
  '.pb-form-section { padding:48px 32px; text-align:center; }',
  '.pb-form-section h2 { font-size:22px; font-weight:700; margin-bottom:20px; color:#111827; }',
  '.pb-form { max-width:400px; margin:0 auto; text-align:left; }',
  '.pb-form input, .pb-form textarea { width:100%; padding:11px 14px; border:1px solid #d1d5db; border-radius:8px; font-size:14px; margin-bottom:10px; font-family:inherit; color:#111827; background:#fff; }',
  '.pb-form input:focus, .pb-form textarea:focus { outline:none; border-color:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,0.1); }',
  '.pb-form textarea { min-height:80px; resize:vertical; }',
  '.pb-form .pb-btn { width:100%; text-align:center; margin-top:4px; }',
  '.pb-divider { padding:16px 0; }',
  '.pb-divider hr { border:none; height:1px; background:#e5e7eb; }',
  '.pb-text-block { padding:32px; max-width:700px; margin:0 auto; }',
  '.pb-text-block p { font-size:15px; color:#374151; line-height:1.7; }',
  '.pb-faq { padding:48px 32px; }',
  '.pb-faq h2 { text-align:center; font-size:22px; font-weight:700; margin-bottom:24px; color:#111827; }',
  '.pb-faq-item { padding:16px 20px; border:1px solid #e5e7eb; border-radius:8px; margin-bottom:10px; max-width:600px; margin-left:auto; margin-right:auto; }',
  '.pb-faq-item strong { color:#111827; font-size:14px; }',
  '.pb-faq-item p { font-size:13px; color:#64748b; margin-top:4px; line-height:1.5; }',
  '@media(max-width:600px) {',
  '  .pb-hero h1 { font-size:26px; }',
  '  .pb-feat-grid { grid-template-columns:1fr; }',
  '  .pb-stats-row { flex-wrap:wrap; gap:20px; }',
  '}'
].join('\n');

// ── SVG icons for template cards ──
var PB_ICONS = {
  funnel: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
  briefcase: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>',
  shield: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>',
  target: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  video: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="15" height="16" rx="2"/><polygon points="22 8 17 12 22 16 22 8"/></svg>',
  compare: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="18" rx="1"/><line x1="6.5" y1="7" x2="6.5" y2="7.01"/><line x1="6.5" y1="11" x2="6.5" y2="11.01"/><line x1="17.5" y1="7" x2="17.5" y2="7.01"/><line x1="17.5" y1="11" x2="17.5" y2="11.01"/></svg>',
  blank: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>'
};

// ── Section color map for visual preview blocks ──
var PB_SECTION_COLORS = {
  Hero: '#1f2937',
  Stats: '#e2e5ea',
  Features: '#f3f4f6',
  Testimonial: '#e8edf2',
  CTA: '#1f2937',
  Form: '#f9fafb',
  'Trust Bar': '#edf0f3',
  FAQ: '#f3f4f6'
};

// ══════════════════════════════════════════
//  Initialize editor
// ══════════════════════════════════════════
function pbInit() {
  var container = document.getElementById('gjs');
  if (!container || pbEditor) return;

  // Clear stale pre-canvas-CSS saves (one-time migration)
  if (!localStorage.getItem('ctax_pb_v2')) {
    localStorage.removeItem(PB_STORAGE_KEY);
    localStorage.setItem('ctax_pb_v2', '1');
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
  var fullHtml = '<!DOCTYPE html><html lang="en"><head>';
  fullHtml += '<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">';
  fullHtml += '<title>Preview</title>';
  fullHtml += '<style>' + PB_CANVAS_CSS + '\n' + (css || '') + '</style>';
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
  var fullHtml = '<!DOCTYPE html><html lang="en"><head>';
  fullHtml += '<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">';
  fullHtml += '<style>' + PB_CANVAS_CSS + '\n' + (css || '') + '</style>';
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
