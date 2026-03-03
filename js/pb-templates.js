// -- Page Builder: Premium Template Definitions --
// Each template composes premium blocks from pb-blocks.js.
// Default copy targets END CLIENTS with tax problems (the audience of partner-built pages).
// Persona switching swaps text via pb-copy.js.

var PB_TEMPLATES = {

  // -- Lead Capture (conversion-focused, minimal) --
  leadcapture: {
    label: 'Lead Capture',
    desc: 'High-conversion page: bold headline, proof stats, and a focused lead capture form.',
    icon: 'target',
    sections: ['Hero', 'Stats', 'Form'],
    html: [
      '<section class="pb-hero-centered">',
      '  <div class="pb-badge">Trusted Tax Resolution</div>',
      '  <h1>Owe the IRS? There\'s a Path Forward.</h1>',
      '  <p class="pb-hero-sub">Your tax professional connected you with a licensed resolution team that has helped over 50,000 people settle IRS debt, stop penalties, and get a fresh start.</p>',
      '  <div class="pb-hero-actions">',
      '    <a href="#" class="pb-btn pb-btn-glow">Get a Free Consultation</a>',
      '    <a href="#" class="pb-btn-secondary">See How It Works</a>',
      '  </div>',
      '  <div class="pb-trust-row">',
      '    <div class="pb-trust-item"><span class="pb-trust-val">$2.3B+</span><span class="pb-trust-label">Resolved</span></div>',
      '    <div class="pb-trust-item"><span class="pb-trust-val">50K+</span><span class="pb-trust-label">Clients Helped</span></div>',
      '    <div class="pb-trust-item"><span class="pb-trust-val">A+</span><span class="pb-trust-label">BBB Rating</span></div>',
      '  </div>',
      '</section>',

      '<section class="pb-stats-row">',
      '  <div class="pb-stat"><span class="pb-stat-val pb-gradient-text">$2.3B</span><span class="pb-stat-label">Tax Debt Resolved</span></div>',
      '  <div class="pb-stat-sep" aria-hidden="true">&#8226;</div>',
      '  <div class="pb-stat"><span class="pb-stat-val pb-gradient-text">50K+</span><span class="pb-stat-label">People Helped</span></div>',
      '  <div class="pb-stat-sep" aria-hidden="true">&#8226;</div>',
      '  <div class="pb-stat"><span class="pb-stat-val pb-gradient-text">14 Yrs</span><span class="pb-stat-label">Experience</span></div>',
      '</section>',

      '<section class="pb-form-split">',
      '  <div class="pb-form-benefits">',
      '    <h2>Here Is What Happens Next</h2>',
      '    <ul>',
      '      <li><span class="pb-benefit-check">&#10003;</span> A licensed expert reviews your situation for free</li>',
      '      <li><span class="pb-benefit-check">&#10003;</span> We pull your IRS transcripts and identify every option</li>',
      '      <li><span class="pb-benefit-check">&#10003;</span> You get a clear plan with no obligation to proceed</li>',
      '      <li><span class="pb-benefit-check">&#10003;</span> If you move forward, we handle everything with the IRS</li>',
      '      <li><span class="pb-benefit-check">&#10003;</span> 100% confidential, no judgment, no pressure</li>',
      '    </ul>',
      '  </div>',
      '  <div class="pb-form-card">',
      '    <h3>Get Started</h3>',
      '    <form class="pb-form">',
      '      <label class="pb-form-label" for="pb-lc-name">Full Name</label>',
      '      <input id="pb-lc-name" type="text" placeholder="Full Name"/>',
      '      <label class="pb-form-label" for="pb-lc-email">Email Address</label>',
      '      <input id="pb-lc-email" type="email" placeholder="Email Address"/>',
      '      <label class="pb-form-label" for="pb-lc-phone">Phone Number</label>',
      '      <input id="pb-lc-phone" type="tel" placeholder="Phone Number"/>',
      '      <button type="button" class="pb-btn">Request Free Review</button>',
      '      <p class="pb-form-security">&#128274; Secure and confidential</p>',
      '    </form>',
      '  </div>',
      '</section>',

      '<section class="pb-compliance-footer" data-pb-locked="true">',
      '  <p>This page is published by an independent referral partner, not an employee or affiliate of Community Tax or the IRS.</p>',
      '  <p>Results vary based on individual circumstances. No specific outcome is guaranteed.</p>',
      '  <p>Community Tax is a licensed tax resolution firm. See ctax.com/disclosures for details.</p>',
      '</section>'
    ].join('\n')
  },

  // -- Authority / Credibility --
  authority: {
    label: 'Authority Page',
    desc: 'Credibility builder: dark hero, trust signals, features, process steps, FAQ, and strong CTA.',
    icon: 'shield',
    sections: ['Hero', 'Trust', 'Features', 'Process', 'FAQ', 'CTA'],
    html: [
      '<section class="pb-hero-dark">',
      '  <div class="pb-badge">Trusted by 50,000+ Clients Nationwide</div>',
      '  <h1>IRS Debt Does Not Have to Control Your Life</h1>',
      '  <p class="pb-hero-sub">Your tax professional referred you to the team that has resolved over $2.3 billion in tax debt. Let us find the best solution for your situation.</p>',
      '  <div class="pb-hero-actions">',
      '    <a href="#" class="pb-btn pb-btn-glow">Get Your Free Consultation</a>',
      '    <a href="#" class="pb-btn-secondary">See How It Works</a>',
      '  </div>',
      '  <div class="pb-trust-row">',
      '    <div class="pb-trust-item"><span class="pb-trust-val">$2.3B+</span><span class="pb-trust-label">Resolved</span></div>',
      '    <div class="pb-trust-item"><span class="pb-trust-val">50K+</span><span class="pb-trust-label">Clients Helped</span></div>',
      '    <div class="pb-trust-item"><span class="pb-trust-val">A+</span><span class="pb-trust-label">BBB Rating</span></div>',
      '  </div>',
      '</section>',

      '<section class="pb-trust-bar">',
      '  <span class="pb-trust-badge">IRS Authorized</span>',
      '  <span class="pb-trust-badge">BBB A+ Rated</span>',
      '  <span class="pb-trust-badge">NAEA Member</span>',
      '  <span class="pb-trust-badge">50K+ Clients</span>',
      '  <span class="pb-trust-badge">Licensed CPAs</span>',
      '</section>',

      '<section class="pb-features">',
      '  <h2>How We Resolve Your Tax Problem</h2>',
      '  <p class="pb-section-sub">Our licensed team handles every step so you can stop worrying about the IRS.</p>',
      '  <div class="pb-feat-grid">',
      '    <div class="pb-feat-card"><div class="pb-feat-icon">&#9733;</div><h3>Free Case Evaluation</h3><p>We review your IRS account, pull transcripts, and identify every option available to you -- at no cost.</p></div>',
      '    <div class="pb-feat-card"><div class="pb-feat-icon">&#9878;</div><h3>Licensed Tax Professionals</h3><p>Enrolled agents and CPAs authorized to represent you directly before the IRS.</p></div>',
      '    <div class="pb-feat-card"><div class="pb-feat-icon">&#8635;</div><h3>Proven Results</h3><p>Over $2.3 billion in tax debt resolved. Offers in compromise, installment plans, penalty abatements, and more.</p></div>',
      '  </div>',
      '</section>',

      '<section class="pb-process">',
      '  <h2>How It Works</h2>',
      '  <p class="pb-section-sub">Three simple steps to resolve your tax problem.</p>',
      '  <div class="pb-steps">',
      '    <div class="pb-step"><div class="pb-step-num">1</div><h3>Free Consultation</h3><p>Tell us about your situation. We pull your IRS records and review every option -- at no cost.</p></div>',
      '    <div class="pb-step"><div class="pb-step-num">2</div><h3>We Handle the IRS</h3><p>Our licensed team represents you directly and negotiates the best possible resolution.</p></div>',
      '    <div class="pb-step"><div class="pb-step-num">3</div><h3>Get Your Fresh Start</h3><p>Your debt is resolved, penalties are addressed, and you can move forward.</p></div>',
      '  </div>',
      '</section>',

      '<section class="pb-faq">',
      '  <h2>Frequently Asked Questions</h2>',
      '  <p class="pb-section-sub">Common questions from people dealing with IRS debt.</p>',
      '  <details class="pb-faq-accordion"><summary>How much does a consultation cost?</summary><p>Nothing. Your initial consultation is completely free, and there is no obligation to move forward.</p></details>',
      '  <details class="pb-faq-accordion"><summary>Can you really reduce what I owe the IRS?</summary><p>In many cases, yes. Through offers in compromise, penalty abatement, and other IRS programs, we can often reduce the total amount owed.</p></details>',
      '  <details class="pb-faq-accordion"><summary>Will the IRS stop contacting me?</summary><p>Once we take your case, the IRS communicates with us instead of you. Collection calls and letters should stop.</p></details>',
      '  <details class="pb-faq-accordion"><summary>How long does the process take?</summary><p>Most cases resolve in 3-6 months. We keep you informed at every stage.</p></details>',
      '</section>',

      '<section class="pb-cta-dark">',
      '  <h2>Ready to Resolve Your Tax Debt?</h2>',
      '  <p>Join the 50,000+ people who have already taken control of their IRS situation. Your free consultation takes less than 15 minutes.</p>',
      '  <a href="#" class="pb-btn pb-btn-glow">Get My Free Consultation</a>',
      '  <p class="pb-cta-trust">No cost. No obligation. 100% confidential.</p>',
      '</section>',

      '<section class="pb-compliance-footer" data-pb-locked="true">',
      '  <p>This page is published by an independent referral partner, not an employee or affiliate of Community Tax or the IRS.</p>',
      '  <p>Results vary based on individual circumstances. No specific outcome is guaranteed.</p>',
      '  <p>Community Tax is a licensed tax resolution firm. See ctax.com/disclosures for details.</p>',
      '</section>'
    ].join('\n')
  },

  // -- Educational --
  educational: {
    label: 'Educational',
    desc: 'Informative page: minimal hero, alternating feature sections, FAQ, testimonial, and soft CTA.',
    icon: 'book',
    sections: ['Hero', 'Features', 'FAQ', 'Testimonial', 'CTA'],
    html: [
      '<section class="pb-hero-minimal">',
      '  <div class="pb-accent-line" aria-hidden="true"></div>',
      '  <h1>You Deserve a Fresh Start with the IRS</h1>',
      '  <p>Licensed tax professionals. Proven results. A free consultation to explore your options.</p>',
      '  <a href="#" class="pb-btn">See How It Works</a>',
      '</section>',

      '<section class="pb-alternating">',
      '  <div class="pb-alt-row">',
      '    <div class="pb-alt-text"><h3>Stop the Calls and Letters</h3><p>Once we take your case, we contact the IRS on your behalf. The threatening letters and collection calls stop. You get breathing room.</p></div>',
      '    <div class="pb-alt-accent"></div>',
      '  </div>',
      '  <div class="pb-alt-row pb-alt-row-reverse">',
      '    <div class="pb-alt-text"><h3>Find Out What You Actually Owe</h3><p>Many people owe less than they think once penalties and interest are reviewed. We pull your IRS transcripts and build a complete picture of your situation.</p></div>',
      '    <div class="pb-alt-accent"></div>',
      '  </div>',
      '</section>',

      '<section class="pb-faq">',
      '  <h2>Frequently Asked Questions</h2>',
      '  <p class="pb-section-sub">Common questions about resolving IRS debt.</p>',
      '  <details class="pb-faq-accordion"><summary>Is the consultation really free?</summary><p>Yes. We review your case at no cost with zero obligation to proceed.</p></details>',
      '  <details class="pb-faq-accordion"><summary>Can you reduce what I owe?</summary><p>Often, yes. Through IRS programs like offers in compromise and penalty abatement, we can frequently lower the total balance.</p></details>',
      '  <details class="pb-faq-accordion"><summary>How long does resolution take?</summary><p>Most cases resolve in 3-6 months. We keep you updated throughout.</p></details>',
      '</section>',

      '<section class="pb-testimonial">',
      '  <blockquote>"I owed the IRS $47,000 and had no idea where to start. My CPA referred me here, and within six months the team got my balance reduced and set up a payment plan I could actually afford."</blockquote>',
      '  <div class="pb-testimonial-avatar">JR</div>',
      '  <cite>James R.</cite>',
      '  <span class="pb-cite-role">Houston, TX</span>',
      '  <p class="pb-results-vary">Individual results may vary based on your specific circumstances.</p>',
      '</section>',

      '<section class="pb-cta-card-section">',
      '  <div class="pb-cta-card">',
      '    <h2>Take the First Step Today</h2>',
      '    <p>A free, confidential consultation with a licensed tax professional. No commitment required -- just answers about your options.</p>',
      '    <a href="#" class="pb-btn">Get Started Free</a>',
      '  </div>',
      '</section>',

      '<section class="pb-compliance-footer" data-pb-locked="true">',
      '  <p>This page is published by an independent referral partner, not an employee or affiliate of Community Tax or the IRS.</p>',
      '  <p>Results vary based on individual circumstances. No specific outcome is guaranteed.</p>',
      '  <p>Community Tax is a licensed tax resolution firm. See ctax.com/disclosures for details.</p>',
      '</section>'
    ].join('\n')
  },

  // -- Appointment / Webinar --
  appointment: {
    label: 'Appointment',
    desc: 'Event-focused page: bold hero, stats, process steps, testimonials, and consultation form.',
    icon: 'video',
    sections: ['Hero', 'Stats', 'Process', 'Testimonials', 'Form'],
    html: [
      '<section class="pb-hero-bold">',
      '  <h1>The IRS Is Not Going Away. But Your Debt Can Be Resolved.</h1>',
      '  <p>Your tax professional connected you with experts who have settled over $2.3 billion in IRS debt. Find out what they can do for you.</p>',
      '  <a href="#" class="pb-btn pb-btn-glow">Schedule a Free Consultation</a>',
      '</section>',

      '<section class="pb-stats-row">',
      '  <div class="pb-stat"><span class="pb-stat-val pb-gradient-text">$2.3B</span><span class="pb-stat-label">Tax Debt Resolved</span></div>',
      '  <div class="pb-stat-sep" aria-hidden="true">&#8226;</div>',
      '  <div class="pb-stat"><span class="pb-stat-val pb-gradient-text">50K+</span><span class="pb-stat-label">People Helped</span></div>',
      '  <div class="pb-stat-sep" aria-hidden="true">&#8226;</div>',
      '  <div class="pb-stat"><span class="pb-stat-val pb-gradient-text">A+</span><span class="pb-stat-label">BBB Rating</span></div>',
      '</section>',

      '<section class="pb-process">',
      '  <h2>How It Works</h2>',
      '  <p class="pb-section-sub">Three simple steps to resolve your tax problem.</p>',
      '  <div class="pb-steps">',
      '    <div class="pb-step"><div class="pb-step-num">1</div><h3>Free Consultation</h3><p>Tell us about your situation. We review your IRS records at no cost.</p></div>',
      '    <div class="pb-step"><div class="pb-step-num">2</div><h3>We Handle the IRS</h3><p>Our licensed team negotiates the best possible resolution on your behalf.</p></div>',
      '    <div class="pb-step"><div class="pb-step-num">3</div><h3>Get Your Fresh Start</h3><p>Debt resolved, penalties addressed. Move forward without the IRS hanging over you.</p></div>',
      '  </div>',
      '</section>',

      '<section class="pb-testi-cards">',
      '  <div class="pb-testi-card">',
      '    <div class="pb-testi-stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>',
      '    <blockquote>"I was getting IRS letters every week and did not know what to do. They took over, stopped the collections, and got my penalties removed."</blockquote>',
      '    <cite>Maria S.</cite>',
      '    <p class="pb-results-vary">Results vary. Not a guarantee of specific outcomes.</p>',
      '  </div>',
      '  <div class="pb-testi-card">',
      '    <div class="pb-testi-stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>',
      '    <blockquote>"Three years of unfiled returns and a growing balance. They filed everything, negotiated with the IRS, and got me a manageable payment plan."</blockquote>',
      '    <cite>David T.</cite>',
      '    <p class="pb-results-vary">Results vary. Not a guarantee of specific outcomes.</p>',
      '  </div>',
      '</section>',

      '<section class="pb-form-section">',
      '  <h2>Request Your Free Consultation</h2>',
      '  <p class="pb-section-sub">Fill out the form below and a licensed tax expert will contact you within 24 hours.</p>',
      '  <form class="pb-form">',
      '    <label class="pb-form-label" for="pb-appt-name">Full Name</label>',
      '    <input id="pb-appt-name" type="text" placeholder="John Smith"/>',
      '    <label class="pb-form-label" for="pb-appt-email">Email Address</label>',
      '    <input id="pb-appt-email" type="email" placeholder="john@example.com"/>',
      '    <label class="pb-form-label" for="pb-appt-phone">Phone Number</label>',
      '    <input id="pb-appt-phone" type="tel" placeholder="(555) 123-4567"/>',
      '    <button type="button" class="pb-btn">Get My Free Consultation</button>',
      '    <p class="pb-form-security">&#128274; Your information is secure and never shared.</p>',
      '  </form>',
      '</section>',

      '<section class="pb-compliance-footer" data-pb-locked="true">',
      '  <p>This page is published by an independent referral partner, not an employee or affiliate of Community Tax or the IRS.</p>',
      '  <p>Results vary based on individual circumstances. No specific outcome is guaranteed.</p>',
      '  <p>Community Tax is a licensed tax resolution firm. See ctax.com/disclosures for details.</p>',
      '</section>'
    ].join('\n')
  },

  // -- Comparison --
  compare: {
    label: 'Comparison',
    desc: 'Credibility-focused: split hero, stats, feature showcase, testimonials, CTA, and consultation form.',
    icon: 'compare',
    sections: ['Hero', 'Stats', 'Features', 'Testimonials', 'CTA', 'Form'],
    html: [
      '<section class="pb-hero-split">',
      '  <div class="pb-hero-split-text">',
      '    <div class="pb-badge">Recommended by Your Tax Professional</div>',
      '    <h1>Stop IRS Penalties Before They Get Worse</h1>',
      '    <p>You were referred here because there is a real solution. Our licensed team resolves IRS debt every day -- liens, levies, wage garnishments, and back taxes.</p>',
      '    <div class="pb-hero-actions">',
      '      <a href="#" class="pb-btn">Request a Free Review</a>',
      '      <a href="#" class="pb-btn-secondary">Learn More</a>',
      '    </div>',
      '  </div>',
      '  <div class="pb-hero-split-img">',
      '    <div class="pb-img-placeholder">Your Image Here</div>',
      '  </div>',
      '</section>',

      '<section class="pb-stats-row">',
      '  <div class="pb-stat"><span class="pb-stat-val pb-gradient-text">$2.3B</span><span class="pb-stat-label">Tax Debt Resolved</span></div>',
      '  <div class="pb-stat-sep" aria-hidden="true">&#8226;</div>',
      '  <div class="pb-stat"><span class="pb-stat-val pb-gradient-text">50K+</span><span class="pb-stat-label">People Helped</span></div>',
      '  <div class="pb-stat-sep" aria-hidden="true">&#8226;</div>',
      '  <div class="pb-stat"><span class="pb-stat-val pb-gradient-text">A+</span><span class="pb-stat-label">BBB Rating</span></div>',
      '</section>',

      '<section class="pb-showcase">',
      '  <h2>Why Thousands of People Trust This Team</h2>',
      '  <p class="pb-section-sub">Four reasons clients choose Community Tax to resolve their IRS debt.</p>',
      '  <div class="pb-showcase-grid">',
      '    <div class="pb-feat-card"><div class="pb-feat-icon">&#36;</div><h3>Reduce What You Owe</h3><p>We negotiate directly with the IRS to lower your total balance, eliminate penalties, and find a payment plan that fits.</p></div>',
      '    <div class="pb-feat-card"><div class="pb-feat-icon">&#9734;</div><h3>14 Years of Results</h3><p>Over $2.3 billion resolved. A+ BBB rating. 50,000+ clients helped.</p></div>',
      '    <div class="pb-feat-card"><div class="pb-feat-icon">&#9878;</div><h3>Fully Licensed Team</h3><p>Enrolled agents and CPAs authorized to represent you before the IRS.</p></div>',
      '    <div class="pb-feat-card"><div class="pb-feat-icon">&#9998;</div><h3>Personalized Plan</h3><p>No cookie-cutter solutions. A resolution strategy based on your specific situation.</p></div>',
      '  </div>',
      '</section>',

      '<section class="pb-testi-cards">',
      '  <div class="pb-testi-card">',
      '    <div class="pb-testi-stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>',
      '    <blockquote>"I was getting IRS letters every week. They took over, stopped the collections, and got my penalties removed. Huge relief."</blockquote>',
      '    <cite>Maria S.</cite>',
      '    <p class="pb-results-vary">Results vary. Not a guarantee of specific outcomes.</p>',
      '  </div>',
      '  <div class="pb-testi-card">',
      '    <div class="pb-testi-stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>',
      '    <blockquote>"Three years of unfiled returns. They filed everything, negotiated with the IRS, and got me a manageable plan. I can finally sleep."</blockquote>',
      '    <cite>David T.</cite>',
      '    <p class="pb-results-vary">Results vary. Not a guarantee of specific outcomes.</p>',
      '  </div>',
      '</section>',

      '<section class="pb-cta-gradient">',
      '  <h2>Do Not Wait Until the IRS Takes Action</h2>',
      '  <p>Penalties and interest grow every day. The sooner you act, the more options you have.</p>',
      '  <a href="#" class="pb-btn">Request a Free Review</a>',
      '</section>',

      '<section class="pb-form-section">',
      '  <h2>Request Your Free Consultation</h2>',
      '  <p class="pb-section-sub">A licensed tax expert will review your situation and explain your options.</p>',
      '  <form class="pb-form">',
      '    <label class="pb-form-label" for="pb-cmp-name">Full Name</label>',
      '    <input id="pb-cmp-name" type="text" placeholder="Full Name"/>',
      '    <label class="pb-form-label" for="pb-cmp-email">Email Address</label>',
      '    <input id="pb-cmp-email" type="email" placeholder="Email Address"/>',
      '    <label class="pb-form-label" for="pb-cmp-phone">Phone Number</label>',
      '    <input id="pb-cmp-phone" type="tel" placeholder="Phone Number"/>',
      '    <button type="button" class="pb-btn">Get My Free Consultation</button>',
      '    <p class="pb-form-security">&#128274; Secure and confidential</p>',
      '  </form>',
      '</section>',

      '<section class="pb-compliance-footer" data-pb-locked="true">',
      '  <p>This page is published by an independent referral partner, not an employee or affiliate of Community Tax or the IRS.</p>',
      '  <p>Results vary based on individual circumstances. No specific outcome is guaranteed.</p>',
      '  <p>Community Tax is a licensed tax resolution firm. See ctax.com/disclosures for details.</p>',
      '</section>'
    ].join('\n')
  },

  // -- Full Referral (comprehensive) --
  referral: {
    label: 'Full Referral',
    desc: 'Comprehensive page: dark hero, stats, features, process, testimonial, FAQ, CTA, and form.',
    icon: 'funnel',
    sections: ['Hero', 'Stats', 'Features', 'Process', 'Testimonial', 'FAQ', 'CTA', 'Form'],
    html: [
      '<section class="pb-hero-dark">',
      '  <div class="pb-badge">Trusted by 50,000+ Clients Nationwide</div>',
      '  <h1>IRS Debt Does Not Have to Control Your Life</h1>',
      '  <p class="pb-hero-sub">Your tax professional referred you to the team that has resolved over $2.3 billion in tax debt. Let us find the best solution for your situation.</p>',
      '  <div class="pb-hero-actions">',
      '    <a href="#" class="pb-btn pb-btn-glow">Get Your Free Consultation</a>',
      '    <a href="#" class="pb-btn-secondary">See How It Works</a>',
      '  </div>',
      '  <div class="pb-trust-row">',
      '    <div class="pb-trust-item"><span class="pb-trust-val">$2.3B+</span><span class="pb-trust-label">Resolved</span></div>',
      '    <div class="pb-trust-item"><span class="pb-trust-val">50K+</span><span class="pb-trust-label">Clients Helped</span></div>',
      '    <div class="pb-trust-item"><span class="pb-trust-val">A+</span><span class="pb-trust-label">BBB Rating</span></div>',
      '  </div>',
      '</section>',

      '<section class="pb-stats-row">',
      '  <div class="pb-stat"><span class="pb-stat-val pb-gradient-text">$2.3B</span><span class="pb-stat-label">Tax Debt Resolved</span></div>',
      '  <div class="pb-stat-sep" aria-hidden="true">&#8226;</div>',
      '  <div class="pb-stat"><span class="pb-stat-val pb-gradient-text">50K+</span><span class="pb-stat-label">People Helped</span></div>',
      '  <div class="pb-stat-sep" aria-hidden="true">&#8226;</div>',
      '  <div class="pb-stat"><span class="pb-stat-val pb-gradient-text">14 Yrs</span><span class="pb-stat-label">Experience</span></div>',
      '</section>',

      '<section class="pb-features">',
      '  <h2>How We Resolve Your Tax Problem</h2>',
      '  <p class="pb-section-sub">Our licensed team handles every step so you can stop worrying about the IRS.</p>',
      '  <div class="pb-feat-grid">',
      '    <div class="pb-feat-card"><div class="pb-feat-icon">&#9733;</div><h3>Free Case Evaluation</h3><p>We review your IRS account and identify every option available to you -- at no cost.</p></div>',
      '    <div class="pb-feat-card"><div class="pb-feat-icon">&#9878;</div><h3>Licensed Tax Professionals</h3><p>Enrolled agents and CPAs authorized to represent you directly before the IRS.</p></div>',
      '    <div class="pb-feat-card"><div class="pb-feat-icon">&#8635;</div><h3>Proven Results</h3><p>Over $2.3 billion in tax debt resolved. We negotiate the best outcome for your case.</p></div>',
      '  </div>',
      '</section>',

      '<section class="pb-process">',
      '  <h2>How It Works</h2>',
      '  <p class="pb-section-sub">Three simple steps to resolve your tax problem.</p>',
      '  <div class="pb-steps">',
      '    <div class="pb-step"><div class="pb-step-num">1</div><h3>Free Consultation</h3><p>Tell us about your situation. We pull your IRS records and review every option.</p></div>',
      '    <div class="pb-step"><div class="pb-step-num">2</div><h3>We Handle the IRS</h3><p>Our licensed team represents you and negotiates the best resolution.</p></div>',
      '    <div class="pb-step"><div class="pb-step-num">3</div><h3>Get Your Fresh Start</h3><p>Debt resolved, penalties addressed. Move forward without the IRS hanging over you.</p></div>',
      '  </div>',
      '</section>',

      '<section class="pb-testimonial">',
      '  <blockquote>"I owed the IRS $47,000 and had no idea where to start. My CPA referred me here, and within six months the team got my balance reduced and set up a payment plan I could actually afford."</blockquote>',
      '  <div class="pb-testimonial-avatar">JR</div>',
      '  <cite>James R.</cite>',
      '  <span class="pb-cite-role">Houston, TX</span>',
      '  <p class="pb-results-vary">Individual results may vary based on your specific circumstances.</p>',
      '</section>',

      '<section class="pb-faq">',
      '  <h2>Frequently Asked Questions</h2>',
      '  <p class="pb-section-sub">Common questions from people dealing with IRS debt.</p>',
      '  <details class="pb-faq-accordion"><summary>How much does a consultation cost?</summary><p>Nothing. Your initial consultation is completely free with no obligation.</p></details>',
      '  <details class="pb-faq-accordion"><summary>Can you reduce what I owe?</summary><p>In many cases, yes. Through offers in compromise, penalty abatement, and other IRS programs.</p></details>',
      '  <details class="pb-faq-accordion"><summary>Will the IRS stop calling me?</summary><p>Once we file authorization, the IRS communicates with us instead of you.</p></details>',
      '  <details class="pb-faq-accordion"><summary>How long does it take?</summary><p>Most cases resolve in 3-6 months. We keep you informed at every stage.</p></details>',
      '</section>',

      '<section class="pb-cta-dark">',
      '  <h2>Ready to Resolve Your Tax Debt?</h2>',
      '  <p>Join the 50,000+ people who have already taken control of their IRS situation.</p>',
      '  <a href="#" class="pb-btn pb-btn-glow">Get My Free Consultation</a>',
      '  <p class="pb-cta-trust">No cost. No obligation. 100% confidential.</p>',
      '</section>',

      '<section class="pb-form-section">',
      '  <h2>Request Your Free Consultation</h2>',
      '  <p class="pb-section-sub">Fill out the form and a licensed tax expert will contact you within 24 hours.</p>',
      '  <form class="pb-form">',
      '    <label class="pb-form-label" for="pb-ref-name">Full Name</label>',
      '    <input id="pb-ref-name" type="text" placeholder="John Smith"/>',
      '    <label class="pb-form-label" for="pb-ref-email">Email Address</label>',
      '    <input id="pb-ref-email" type="email" placeholder="john@example.com"/>',
      '    <label class="pb-form-label" for="pb-ref-phone">Phone Number</label>',
      '    <input id="pb-ref-phone" type="tel" placeholder="(555) 123-4567"/>',
      '    <button type="button" class="pb-btn">Get My Free Consultation</button>',
      '    <p class="pb-form-security">&#128274; Secure and confidential</p>',
      '  </form>',
      '</section>',

      '<section class="pb-compliance-footer" data-pb-locked="true">',
      '  <p>This page is published by an independent referral partner, not an employee or affiliate of Community Tax or the IRS.</p>',
      '  <p>Results vary based on individual circumstances. No specific outcome is guaranteed.</p>',
      '  <p>Community Tax is a licensed tax resolution firm. See ctax.com/disclosures for details.</p>',
      '</section>'
    ].join('\n')
  }
};

// SVG icons for template cards
var PB_ICONS = {
  funnel: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
  shield: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>',
  target: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  book: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>',
  video: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="15" height="16" rx="2"/><polygon points="22 8 17 12 22 16 22 8"/></svg>',
  compare: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="18" rx="1"/></svg>',
  blank: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>'
};

// Section color map for visual preview blocks
var PB_SECTION_COLORS = {
  Hero: '#1e293b',
  Stats: '#e2e5ea',
  Features: '#f3f4f6',
  Process: '#f9fafb',
  Testimonial: '#e8edf2',
  Testimonials: '#e8edf2',
  Trust: '#edf0f3',
  CTA: '#1e293b',
  Form: '#f8fafc',
  FAQ: '#f3f4f6',
  'Trust Bar': '#edf0f3'
};

// Canvas styles (inline fallback). Must match css/pb-canvas.css.
// This is loaded as a string for injecting into the iframe and for export.
var PB_CANVAS_CSS = '';
(function() {
  // Load from the CSS file at runtime via fetch, or use the file-based load.
  // The canonical source is css/pb-canvas.css loaded by GrapesJS canvas.styles config.
  // This variable is kept for legacy export compatibility.
  // It will be populated by pbInjectCanvasStyles if the stylesheet link fails.
  try {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/css/pb-canvas.css', false);
    xhr.send();
    if (xhr.status === 200) {
      PB_CANVAS_CSS = xhr.responseText;
    }
  } catch (e) {
    // Fallback: will be injected via the link tag in canvas.styles
  }
})();

// Font link tags for injecting into canvas and export
var PB_FONT_LINKS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet">';
