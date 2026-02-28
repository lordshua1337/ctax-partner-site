// -- Page Builder: Block definitions --
// Array of block objects consumed by pbAddBlocks() in page-builder.js.
// Each entry: { id, label, category, media (SVG), content (HTML string) }

var PB_BLOCK_DEFS = [

  // ── Heroes (4 variants) ──

  {
    id: 'hero-centered',
    label: 'Hero: Centered',
    category: 'Heroes',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="7" y1="10" x2="17" y2="10"/><line x1="9" y1="14" x2="15" y2="14"/></svg>',
    content: '<section class="pb-hero"><h1>Owe the IRS More Than $10,000?</h1><p>Find out your tax relief options in a free, confidential consultation with licensed professionals.</p><a class="pb-btn">Get Your Free Analysis</a></section>'
  },
  {
    id: 'hero-split',
    label: 'Hero: Split Layout',
    category: 'Heroes',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="13" y1="3" x2="13" y2="21"/></svg>',
    content: [
      '<section class="pb-hero-split">',
      '  <div class="pb-hero-split-text">',
      '    <h1>Take Control of Your IRS Tax Debt</h1>',
      '    <p>Our licensed tax professionals have helped over 50,000 Americans resolve their tax debt. Find out what options are available to you -- for free.</p>',
      '    <a class="pb-btn">Start My Free Consultation</a>',
      '  </div>',
      '  <div class="pb-hero-split-img">',
      '    <div class="pb-img-placeholder">Your Image Here</div>',
      '  </div>',
      '</section>'
    ].join('\n')
  },
  {
    id: 'hero-gradient',
    label: 'Hero: Bold Gradient',
    category: 'Heroes',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="6" y1="9" x2="18" y2="9"/><line x1="8" y1="13" x2="16" y2="13"/><circle cx="12" cy="17" r="1.5"/></svg>',
    content: [
      '<section class="pb-hero-gradient">',
      '  <h1>Struggling with IRS Tax Debt?</h1>',
      '  <p>You are not alone. Over 50,000 people have trusted us to resolve their tax problems. $2.3 billion in debt resolved and counting.</p>',
      '  <a class="pb-btn">Get Your Free Assessment</a>',
      '  <div class="pb-hero-trust-inline">',
      '    <span>$2.3B Resolved</span>',
      '    <span>50K+ Helped</span>',
      '    <span>4.8/5 Rating</span>',
      '  </div>',
      '</section>'
    ].join('\n')
  },
  {
    id: 'hero-minimal',
    label: 'Hero: Minimal',
    category: 'Heroes',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="6" y1="8" x2="6" y2="8.01" stroke-width="3"/><line x1="6" y1="11" x2="14" y2="11"/><line x1="6" y1="15" x2="11" y2="15"/></svg>',
    content: [
      '<section class="pb-hero-minimal">',
      '  <div class="pb-hero-accent-line"></div>',
      '  <h1>Resolve Your IRS Tax Debt</h1>',
      '  <p>Licensed professionals. Proven results. Free consultation.</p>',
      '  <a class="pb-btn">Check My Options</a>',
      '</section>'
    ].join('\n')
  },

  // ── Social Proof (3 variants) ──

  {
    id: 'proof-stats',
    label: 'Stats Row',
    category: 'Social Proof',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    content: '<section class="pb-stats-row"><div class="pb-stat"><span class="pb-stat-val">$2.3B</span><span class="pb-stat-label">Tax Debt Resolved</span></div><div class="pb-stat"><span class="pb-stat-val">50K+</span><span class="pb-stat-label">People Helped</span></div><div class="pb-stat"><span class="pb-stat-val">4.8/5</span><span class="pb-stat-label">Client Rating</span></div><div class="pb-stat"><span class="pb-stat-val">14 Yrs</span><span class="pb-stat-label">Experience</span></div></section>'
  },
  {
    id: 'proof-logos',
    label: 'As Featured In',
    category: 'Social Proof',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="5" height="3" rx="0.5"/><rect x="9.5" y="6" width="5" height="3" rx="0.5"/><rect x="17" y="6" width="5" height="3" rx="0.5"/><rect x="5.5" y="12" width="5" height="3" rx="0.5"/><rect x="13" y="12" width="5" height="3" rx="0.5"/></svg>',
    content: [
      '<section class="pb-proof-logos">',
      '  <p class="pb-proof-logos-heading">As Seen In</p>',
      '  <div class="pb-logo-row">',
      '    <div class="pb-logo-placeholder">CNN</div>',
      '    <div class="pb-logo-placeholder">Forbes</div>',
      '    <div class="pb-logo-placeholder">Fox News</div>',
      '    <div class="pb-logo-placeholder">NBC</div>',
      '    <div class="pb-logo-placeholder">USA Today</div>',
      '  </div>',
      '</section>'
    ].join('\n')
  },
  {
    id: 'proof-counter',
    label: 'Counter Strip',
    category: 'Social Proof',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="9" width="20" height="6" rx="1"/><line x1="9" y1="9" x2="9" y2="15"/><line x1="15" y1="9" x2="15" y2="15"/></svg>',
    content: [
      '<section class="pb-counter-strip">',
      '  <div class="pb-counter-item"><strong>$2.3B</strong> Resolved</div>',
      '  <span class="pb-counter-sep">|</span>',
      '  <div class="pb-counter-item"><strong>50,000+</strong> Helped</div>',
      '  <span class="pb-counter-sep">|</span>',
      '  <div class="pb-counter-item"><strong>4.8/5</strong> Rating</div>',
      '</section>'
    ].join('\n')
  },

  // ── Benefits (3 variants) ──

  {
    id: 'feat-cards',
    label: 'Benefits: 3 Cards',
    category: 'Benefits',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    content: [
      '<section class="pb-features">',
      '  <h2>How We Help You Take Control</h2>',
      '  <div class="pb-feat-grid">',
      '    <div class="pb-feat-card"><h3>Stop Wage Garnishments</h3><p>We intervene with the IRS to halt garnishments, levies, and liens -- often within days of starting your case.</p></div>',
      '    <div class="pb-feat-card"><h3>Reduce What You Owe</h3><p>Our team negotiates directly with the IRS to lower your total debt through proven resolution programs.</p></div>',
      '    <div class="pb-feat-card"><h3>No Surprises, No Judgment</h3><p>Flat-fee pricing with no hidden costs. We have seen every situation and we are here to help.</p></div>',
      '  </div>',
      '</section>'
    ].join('\n')
  },
  {
    id: 'feat-icon-list',
    label: 'Benefits: Icon List',
    category: 'Benefits',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><polyline points="4 6 5 7 7 5"/><polyline points="4 12 5 13 7 11"/><polyline points="4 18 5 19 7 17"/></svg>',
    content: [
      '<section class="pb-icon-list-section">',
      '  <h2>What You Get</h2>',
      '  <ul class="pb-icon-list">',
      '    <li><span class="pb-check-icon">&#10003;</span><div><strong>Free Tax Debt Analysis</strong><p>We review your complete tax situation and tell you exactly where you stand.</p></div></li>',
      '    <li><span class="pb-check-icon">&#10003;</span><div><strong>Licensed Representation</strong><p>Enrolled agents and CPAs who are authorized to speak to the IRS on your behalf.</p></div></li>',
      '    <li><span class="pb-check-icon">&#10003;</span><div><strong>Personalized Resolution Plan</strong><p>A clear, step-by-step plan tailored to your unique financial situation.</p></div></li>',
      '    <li><span class="pb-check-icon">&#10003;</span><div><strong>Ongoing Support</strong><p>We stay with you through every stage until your case is fully resolved.</p></div></li>',
      '  </ul>',
      '</section>'
    ].join('\n')
  },
  {
    id: 'feat-alternating',
    label: 'Benefits: Alternating',
    category: 'Benefits',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="9" height="7" rx="1"/><rect x="13" y="3" width="9" height="7" rx="1" fill="currentColor" opacity="0.15"/><rect x="2" y="14" width="9" height="7" rx="1" fill="currentColor" opacity="0.15"/><rect x="13" y="14" width="9" height="7" rx="1"/></svg>',
    content: [
      '<section class="pb-alternating">',
      '  <div class="pb-alt-row">',
      '    <div class="pb-alt-text"><h3>Stop the IRS From Taking Your Paycheck</h3><p>Wage garnishments can take up to 70% of your income. We work to stop them quickly so you can focus on getting back on your feet.</p></div>',
      '    <div class="pb-alt-accent"></div>',
      '  </div>',
      '  <div class="pb-alt-row pb-alt-row-reverse">',
      '    <div class="pb-alt-text"><h3>Settle Your Debt for Less Than You Owe</h3><p>Through the IRS Offer in Compromise program, many of our clients pay only a fraction of their original tax debt.</p></div>',
      '    <div class="pb-alt-accent"></div>',
      '  </div>',
      '</section>'
    ].join('\n')
  },

  // ── Testimonials (3 variants) ──

  {
    id: 'testimonial-centered',
    label: 'Testimonial: Quote',
    category: 'Testimonials',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>',
    content: '<section class="pb-testimonial"><blockquote>"I owed the IRS $47,000 and was terrified. They settled my case for $8,200. For the first time in years, I can sleep at night."</blockquote><cite>-- Michael R., Houston, TX</cite></section>'
  },
  {
    id: 'testimonial-cards',
    label: 'Testimonial: Two Cards',
    category: 'Testimonials',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="9" height="16" rx="1"/><rect x="13" y="4" width="9" height="16" rx="1"/></svg>',
    content: [
      '<section class="pb-testimonial-cards">',
      '  <div class="pb-testi-card">',
      '    <div class="pb-testi-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>',
      '    <blockquote>"They saved me over $30,000 and handled everything. I did not have to talk to the IRS once."</blockquote>',
      '    <cite>-- Sarah K., Denver, CO</cite>',
      '  </div>',
      '  <div class="pb-testi-card">',
      '    <div class="pb-testi-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>',
      '    <blockquote>"I was so ashamed of my tax debt. Their team was compassionate and professional from day one."</blockquote>',
      '    <cite>-- David T., Tampa, FL</cite>',
      '  </div>',
      '</section>'
    ].join('\n')
  },
  {
    id: 'testimonial-strip',
    label: 'Testimonial: Mini Strip',
    category: 'Testimonials',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="6" width="6" height="12" rx="1"/><rect x="9" y="6" width="6" height="12" rx="1"/><rect x="17" y="6" width="6" height="12" rx="1"/></svg>',
    content: [
      '<section class="pb-testimonial-strip">',
      '  <div class="pb-testi-mini"><blockquote>"Settled $47K for $8,200."</blockquote><cite>-- Michael R.</cite></div>',
      '  <div class="pb-testi-mini"><blockquote>"Saved me over $30,000."</blockquote><cite>-- Sarah K.</cite></div>',
      '  <div class="pb-testi-mini"><blockquote>"Resolved in 4 months."</blockquote><cite>-- David T.</cite></div>',
      '</section>'
    ].join('\n')
  },

  // ── CTAs (3 variants) ──

  {
    id: 'cta-dark',
    label: 'CTA: Dark Banner',
    category: 'CTAs',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="20" height="12" rx="2" fill="currentColor" opacity="0.1"/><line x1="7" y1="10" x2="17" y2="10"/><rect x="9" y="13" width="6" height="2" rx="1"/></svg>',
    content: '<section class="pb-cta-section"><h2>You Deserve a Fresh Start</h2><p>See if you qualify for tax debt relief -- it takes less than 2 minutes.</p><a class="pb-btn">Check My Options Now</a></section>'
  },
  {
    id: 'cta-gradient',
    label: 'CTA: Gradient',
    category: 'CTAs',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></svg>',
    content: [
      '<section class="pb-cta-gradient">',
      '  <h2>Do Not Wait Until It Gets Worse</h2>',
      '  <p>The IRS adds penalties and interest every day. Get your free assessment now.</p>',
      '  <a class="pb-btn pb-btn-glow">Get My Free Assessment</a>',
      '</section>'
    ].join('\n')
  },
  {
    id: 'cta-card',
    label: 'CTA: Inline Card',
    category: 'CTAs',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="6" width="16" height="12" rx="2"/><line x1="8" y1="10" x2="16" y2="10"/><rect x="10" y="13" width="4" height="2" rx="1"/></svg>',
    content: [
      '<section class="pb-cta-card-section">',
      '  <div class="pb-cta-card">',
      '    <h2>Ready to Resolve Your Tax Debt?</h2>',
      '    <p>Take the first step. Your consultation is 100% free and confidential.</p>',
      '    <a class="pb-btn">Start My Free Review</a>',
      '  </div>',
      '</section>'
    ].join('\n')
  },

  // ── Forms (3 variants) ──

  {
    id: 'form-stacked',
    label: 'Form: Stacked',
    category: 'Forms',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg>',
    content: '<section class="pb-form-section"><h2>Get Your Free, Confidential Consultation</h2><form class="pb-form"><input type="text" placeholder="Full Name"/><input type="email" placeholder="Email Address"/><input type="tel" placeholder="Phone Number"/><button type="button" class="pb-btn">Get My Free Analysis</button></form></section>'
  },
  {
    id: 'form-inline',
    label: 'Form: Inline',
    category: 'Forms',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="8" width="20" height="8" rx="2"/><line x1="7" y1="12" x2="7.01" y2="12"/><line x1="12" y1="12" x2="12.01" y2="12"/><line x1="17" y1="12" x2="17.01" y2="12"/></svg>',
    content: [
      '<section class="pb-form-inline-section">',
      '  <h2>Get Started in Seconds</h2>',
      '  <form class="pb-form-inline">',
      '    <input type="text" placeholder="Full Name"/>',
      '    <input type="email" placeholder="Email"/>',
      '    <input type="tel" placeholder="Phone"/>',
      '    <button type="button" class="pb-btn">Get My Free Analysis</button>',
      '  </form>',
      '</section>'
    ].join('\n')
  },
  {
    id: 'form-sidebar',
    label: 'Form: With Benefits',
    category: 'Forms',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="9" height="18" rx="1"/><rect x="13" y="3" width="9" height="18" rx="1"/><line x1="15" y1="8" x2="20" y2="8"/><line x1="15" y1="12" x2="20" y2="12"/><line x1="15" y1="16" x2="20" y2="16"/></svg>',
    content: [
      '<section class="pb-form-sidebar-section">',
      '  <div class="pb-form-sidebar-benefits">',
      '    <h2>Why Choose Us</h2>',
      '    <ul>',
      '      <li>Free, no-obligation consultation</li>',
      '      <li>Licensed enrolled agents and CPAs</li>',
      '      <li>$2.3 billion in tax debt resolved</li>',
      '      <li>Transparent, flat-fee pricing</li>',
      '      <li>BBB A+ rated, 4.8/5 client rating</li>',
      '    </ul>',
      '  </div>',
      '  <div class="pb-form-sidebar-form">',
      '    <h3>Get Your Free Analysis</h3>',
      '    <form class="pb-form">',
      '      <input type="text" placeholder="Full Name"/>',
      '      <input type="email" placeholder="Email Address"/>',
      '      <input type="tel" placeholder="Phone Number"/>',
      '      <button type="button" class="pb-btn">Get Started</button>',
      '    </form>',
      '  </div>',
      '</section>'
    ].join('\n')
  },

  // ── Trust (3 variants) ──

  {
    id: 'trust-badges',
    label: 'Trust: Badges',
    category: 'Trust',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    content: '<section class="pb-trust-bar"><span class="pb-trust-badge">IRS Authorized</span><span class="pb-trust-badge">BBB A+ Rated</span><span class="pb-trust-badge">NAEA Member</span><span class="pb-trust-badge">50K+ Clients</span></section>'
  },
  {
    id: 'trust-credentials',
    label: 'Trust: Credentials',
    category: 'Trust',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    content: [
      '<section class="pb-trust-credentials">',
      '  <h2>Our Credentials</h2>',
      '  <div class="pb-cred-grid">',
      '    <div class="pb-cred-card"><div class="pb-cred-icon">&#9733;</div><strong>IRS Authorized</strong><p>Official e-file provider with direct IRS access</p></div>',
      '    <div class="pb-cred-card"><div class="pb-cred-icon">&#9733;</div><strong>BBB A+ Rated</strong><p>Top rating from the Better Business Bureau</p></div>',
      '    <div class="pb-cred-card"><div class="pb-cred-icon">&#9733;</div><strong>NAEA Member</strong><p>National Association of Enrolled Agents</p></div>',
      '    <div class="pb-cred-card"><div class="pb-cred-icon">&#9733;</div><strong>Licensed CPAs</strong><p>Certified public accountants on staff</p></div>',
      '  </div>',
      '</section>'
    ].join('\n')
  },
  {
    id: 'trust-media',
    label: 'Trust: Media Logos',
    category: 'Trust',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="5" height="3" rx="0.5"/><rect x="9.5" y="6" width="5" height="3" rx="0.5"/><rect x="17" y="6" width="5" height="3" rx="0.5"/></svg>',
    content: [
      '<section class="pb-proof-logos">',
      '  <p class="pb-proof-logos-heading">As Seen On</p>',
      '  <div class="pb-logo-row">',
      '    <div class="pb-logo-placeholder">CNN</div>',
      '    <div class="pb-logo-placeholder">Forbes</div>',
      '    <div class="pb-logo-placeholder">Fox News</div>',
      '    <div class="pb-logo-placeholder">NBC</div>',
      '  </div>',
      '</section>'
    ].join('\n')
  },

  // ── FAQ (2 variants) ──

  {
    id: 'faq-accordion',
    label: 'FAQ: Accordion',
    category: 'FAQ',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M9 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    content: [
      '<section class="pb-faq">',
      '  <h2>Frequently Asked Questions</h2>',
      '  <details class="pb-faq-accordion"><summary>Can I really settle my tax debt for less?</summary><p>Yes. The IRS Offer in Compromise program lets qualifying taxpayers settle for a fraction of what they owe. We evaluate your eligibility and handle the negotiation.</p></details>',
      '  <details class="pb-faq-accordion"><summary>Will the IRS come after me if I get help?</summary><p>No. Working with a licensed representative shows good faith. The IRS prefers resolution over enforcement.</p></details>',
      '  <details class="pb-faq-accordion"><summary>What does this cost?</summary><p>Your initial consultation is completely free. We present transparent, flat-fee pricing before you commit to anything.</p></details>',
      '  <details class="pb-faq-accordion"><summary>How long does the process take?</summary><p>Most cases resolve in 3-6 months. We keep you informed every step of the way.</p></details>',
      '</section>'
    ].join('\n')
  },
  {
    id: 'faq-two-col',
    label: 'FAQ: Two Columns',
    category: 'FAQ',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="9" height="8" rx="1"/><rect x="13" y="3" width="9" height="8" rx="1"/><rect x="2" y="13" width="9" height="8" rx="1"/><rect x="13" y="13" width="9" height="8" rx="1"/></svg>',
    content: [
      '<section class="pb-faq-two-col">',
      '  <h2>Common Questions</h2>',
      '  <div class="pb-faq-grid">',
      '    <div class="pb-faq-item"><strong>Can I settle for less?</strong><p>Yes. The IRS OIC program lets qualifying taxpayers settle for a fraction of what they owe.</p></div>',
      '    <div class="pb-faq-item"><strong>Will I get in trouble?</strong><p>No. Seeking help shows good faith. The IRS prefers resolution over enforcement.</p></div>',
      '    <div class="pb-faq-item"><strong>What does it cost?</strong><p>Your first consultation is free. We present flat-fee pricing before any commitment.</p></div>',
      '    <div class="pb-faq-item"><strong>How long does it take?</strong><p>Most cases resolve in 3-6 months depending on complexity.</p></div>',
      '  </div>',
      '</section>'
    ].join('\n')
  },

  // ── Case Study (2 variants) ──

  {
    id: 'case-comparison',
    label: 'Case: Before/After',
    category: 'Case Study',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="9" height="16" rx="1"/><rect x="13" y="4" width="9" height="16" rx="1"/><line x1="6.5" y1="8" x2="6.5" y2="8.01" stroke-width="3"/><line x1="17.5" y1="8" x2="17.5" y2="8.01" stroke-width="3"/></svg>',
    content: [
      '<section class="pb-case-comparison">',
      '  <h2>Real Results From Real Clients</h2>',
      '  <div class="pb-case-cards">',
      '    <div class="pb-case-card pb-case-before">',
      '      <div class="pb-case-label">Before</div>',
      '      <div class="pb-case-amount">$47,000</div>',
      '      <p>Owed to the IRS with penalties growing. Facing wage garnishment and bank levies.</p>',
      '    </div>',
      '    <div class="pb-case-card pb-case-after">',
      '      <div class="pb-case-label">After</div>',
      '      <div class="pb-case-amount">$8,200</div>',
      '      <p>Settled through Offer in Compromise. All garnishments stopped. Case closed in 4 months.</p>',
      '    </div>',
      '  </div>',
      '</section>'
    ].join('\n')
  },
  {
    id: 'case-timeline',
    label: 'Case: Process Steps',
    category: 'Case Study',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="2" x2="12" y2="22"/><circle cx="12" cy="5" r="2"/><circle cx="12" cy="11" r="2"/><circle cx="12" cy="17" r="2"/></svg>',
    content: [
      '<section class="pb-case-timeline">',
      '  <h2>How the Process Works</h2>',
      '  <div class="pb-timeline">',
      '    <div class="pb-timeline-step"><div class="pb-timeline-num">1</div><div><strong>Free Consultation</strong><p>We review your tax situation and explain your options -- no cost, no obligation.</p></div></div>',
      '    <div class="pb-timeline-step"><div class="pb-timeline-num">2</div><div><strong>Investigation</strong><p>Our team pulls your IRS transcripts and builds a complete picture of your case.</p></div></div>',
      '    <div class="pb-timeline-step"><div class="pb-timeline-num">3</div><div><strong>Negotiation</strong><p>We negotiate with the IRS on your behalf for the best possible resolution.</p></div></div>',
      '    <div class="pb-timeline-step"><div class="pb-timeline-num">4</div><div><strong>Resolution</strong><p>Your case is settled. Garnishments stop. You get a fresh start.</p></div></div>',
      '  </div>',
      '</section>'
    ].join('\n')
  },

  // ── Content (2 variants) ──

  {
    id: 'content-rich',
    label: 'Text: Single Column',
    category: 'Content',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>',
    content: [
      '<section class="pb-content-rich">',
      '  <h2>Understanding Your Tax Relief Options</h2>',
      '  <p>If you owe the IRS more than $10,000, you may qualify for one of several resolution programs. An Offer in Compromise lets you settle your tax debt for less than the full amount owed. Installment agreements spread your payments over time. Penalty abatement can reduce or eliminate penalties that have accumulated on your account.</p>',
      '  <p>The right option depends on your financial situation, how much you owe, and how long the debt has been outstanding. Our licensed professionals evaluate every case individually and recommend the best path forward.</p>',
      '</section>'
    ].join('\n')
  },
  {
    id: 'content-two-col',
    label: 'Text: Two Columns',
    category: 'Content',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="9" height="16" rx="1"/><rect x="13" y="4" width="9" height="16" rx="1"/><line x1="4" y1="8" x2="9" y2="8"/><line x1="15" y1="8" x2="20" y2="8"/></svg>',
    content: [
      '<section class="pb-content-two-col">',
      '  <div class="pb-two-col-grid">',
      '    <div>',
      '      <h3>For Individuals</h3>',
      '      <p>Whether you have unfiled returns, owe back taxes, or are facing garnishments, we have helped tens of thousands of individuals get their lives back on track. Our team handles everything so you can focus on what matters.</p>',
      '    </div>',
      '    <div>',
      '      <h3>For Small Businesses</h3>',
      '      <p>Payroll tax problems, unfiled business returns, and IRS audits can threaten your livelihood. We specialize in business tax resolution and work to protect your business while resolving your obligations.</p>',
      '    </div>',
      '  </div>',
      '</section>'
    ].join('\n')
  },

  // ── Basic blocks (kept from original) ──

  {
    id: 'text-block',
    label: 'Text',
    category: 'Basic',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>',
    content: '<div class="pb-text-block"><p>Add your text content here. This is a flexible block for written content, descriptions, or any copy you need.</p></div>'
  },
  {
    id: 'divider',
    label: 'Divider',
    category: 'Basic',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="3" y1="12" x2="21" y2="12"/></svg>',
    content: '<div class="pb-divider"><hr/></div>'
  },
  {
    id: 'button',
    label: 'Button',
    category: 'Basic',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="8" width="18" height="8" rx="4"/></svg>',
    content: '<a class="pb-btn" style="display:inline-block;margin:16px auto;text-align:center;">Click Here</a>'
  },
  {
    id: 'image',
    label: 'Image',
    category: 'Basic',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
    content: { type: 'image' },
    activate: true,
    select: true
  },

  // ── Layout blocks ──

  {
    id: 'columns-2',
    label: '2 Columns',
    category: 'Layout',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="9" height="16" rx="1"/><rect x="13" y="4" width="9" height="16" rx="1"/></svg>',
    content: '<div style="display:flex;gap:20px;padding:32px"><div style="flex:1;min-height:60px;border:1px dashed #d1d5db;border-radius:8px;padding:16px">Column 1</div><div style="flex:1;min-height:60px;border:1px dashed #d1d5db;border-radius:8px;padding:16px">Column 2</div></div>'
  },
  {
    id: 'columns-3',
    label: '3 Columns',
    category: 'Layout',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="4" width="6" height="16" rx="1"/><rect x="9" y="4" width="6" height="16" rx="1"/><rect x="17" y="4" width="6" height="16" rx="1"/></svg>',
    content: '<div style="display:flex;gap:16px;padding:32px"><div style="flex:1;min-height:60px;border:1px dashed #d1d5db;border-radius:8px;padding:16px">Col 1</div><div style="flex:1;min-height:60px;border:1px dashed #d1d5db;border-radius:8px;padding:16px">Col 2</div><div style="flex:1;min-height:60px;border:1px dashed #d1d5db;border-radius:8px;padding:16px">Col 3</div></div>'
  }
];
