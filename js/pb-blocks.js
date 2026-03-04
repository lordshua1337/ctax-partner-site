// -- Page Builder: Premium Block Library --
// Each block uses only --pb-* design tokens so themes flip automatically.
// Default copy targets END CLIENTS with tax problems (the audience of partner-built pages).
// Persona switching swaps text via pb-copy.js.

var PB_BLOCK_DEFS = [

  // ================================================================
  //  HEROES (5 variants)
  // ================================================================

  {
    id: 'hero-centered',
    label: 'Hero: Centered',
    category: 'Heroes',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="7" y1="10" x2="17" y2="10"/><line x1="9" y1="14" x2="15" y2="14"/></svg>',
    content: [
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
      '</section>'
    ].join('\n')
  },

  {
    id: 'hero-split',
    label: 'Hero: Split Layout',
    category: 'Heroes',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="13" y1="3" x2="13" y2="21"/></svg>',
    content: [
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
      '</section>'
    ].join('\n')
  },

  {
    id: 'hero-dark',
    label: 'Hero: Dark Gradient',
    category: 'Heroes',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="6" y1="9" x2="18" y2="9"/><line x1="8" y1="13" x2="16" y2="13"/><circle cx="12" cy="17" r="1.5"/></svg>',
    content: [
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
      '  <div class="pb-accent-line" aria-hidden="true"></div>',
      '  <h1>You Deserve a Fresh Start with the IRS</h1>',
      '  <p>Licensed tax professionals. Proven results. A free consultation to explore your options.</p>',
      '  <a href="#" class="pb-btn">Get Started Free</a>',
      '</section>'
    ].join('\n')
  },

  {
    id: 'hero-bold',
    label: 'Hero: Bold Statement',
    category: 'Heroes',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="5" y1="12" x2="19" y2="12" stroke-width="2"/></svg>',
    content: [
      '<section class="pb-hero-bold">',
      '  <h1>The IRS Is Not Going Away. But Your Debt Can Be Resolved.</h1>',
      '  <p>Your tax professional connected you with experts who have settled over $2.3 billion in IRS debt. Find out what they can do for you.</p>',
      '  <a href="#" class="pb-btn pb-btn-glow">Get a Free Consultation</a>',
      '</section>'
    ].join('\n')
  },

  {
    id: 'hero-video',
    label: 'Hero: Video Embed',
    category: 'Heroes',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="18" rx="2"/><polygon points="10 8 16 12 10 16" fill="currentColor" opacity="0.3"/></svg>',
    content: [
      '<section class="pb-hero-video">',
      '  <div class="pb-hero-video-text">',
      '    <div class="pb-badge">See How It Works</div>',
      '    <h1>Watch How We Resolve IRS Debt</h1>',
      '    <p>In under 2 minutes, see how our licensed team has helped over 50,000 people settle tax debt, stop collections, and move forward.</p>',
      '    <a href="#" class="pb-btn pb-btn-glow">Get a Free Consultation</a>',
      '  </div>',
      '  <div class="pb-hero-video-embed">',
      '    <div class="pb-video-wrapper">',
      '      <div class="pb-video-placeholder" onclick="this.innerHTML=\'<iframe src=&quot;https://www.youtube.com/embed/dQw4w9WgXcQ&quot; frameborder=&quot;0&quot; allow=&quot;autoplay; encrypted-media&quot; allowfullscreen style=&quot;width:100%;height:100%;position:absolute;inset:0&quot;></iframe>\';this.style.cursor=\'default\'">',
      '        <svg width="64" height="64" viewBox="0 0 24 24" fill="var(--pb-accent)" stroke="none"><polygon points="5 3 19 12 5 21"/></svg>',
      '        <span>Click to play video</span>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</section>'
    ].join('\n')
  },

  {
    id: 'hero-countdown',
    label: 'Hero: Countdown Timer',
    category: 'Heroes',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    content: [
      '<section class="pb-hero-countdown">',
      '  <div class="pb-badge">Limited Time Offer</div>',
      '  <h1>Free Tax Debt Analysis -- Offer Ends Soon</h1>',
      '  <p class="pb-hero-sub">For a limited time, get a complete IRS account review at no cost. Find out exactly what you owe and what options are available.</p>',
      '  <div class="pb-countdown" data-pb-hours="48">',
      '    <div class="pb-countdown-block"><span class="pb-cd-num" data-pb-unit="days">02</span><span class="pb-cd-label">Days</span></div>',
      '    <div class="pb-countdown-sep">:</div>',
      '    <div class="pb-countdown-block"><span class="pb-cd-num" data-pb-unit="hours">00</span><span class="pb-cd-label">Hours</span></div>',
      '    <div class="pb-countdown-sep">:</div>',
      '    <div class="pb-countdown-block"><span class="pb-cd-num" data-pb-unit="minutes">00</span><span class="pb-cd-label">Minutes</span></div>',
      '    <div class="pb-countdown-sep">:</div>',
      '    <div class="pb-countdown-block"><span class="pb-cd-num" data-pb-unit="seconds">00</span><span class="pb-cd-label">Seconds</span></div>',
      '  </div>',
      '  <a href="#" class="pb-btn pb-btn-glow">Claim Your Free Analysis</a>',
      '  <p class="pb-cta-trust">No cost. No obligation. Available for a limited time.</p>',
      '</section>'
    ].join('\n')
  },

  {
    id: 'hero-split-form',
    label: 'Hero: Split + Form',
    category: 'Heroes',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="13" y1="3" x2="13" y2="21"/><line x1="15" y1="8" x2="20" y2="8"/><line x1="15" y1="11" x2="20" y2="11"/><line x1="15" y1="14" x2="20" y2="14"/></svg>',
    content: [
      '<section class="pb-hero-split-form">',
      '  <div class="pb-hero-split-text">',
      '    <div class="pb-badge">Referred by Your Tax Professional</div>',
      '    <h1>Resolve Your IRS Debt. Start With a Free Review.</h1>',
      '    <p>Over 50,000 people have used this team to settle tax debt, stop penalties, and get a fresh start. Your tax professional sent you here because it works.</p>',
      '    <div class="pb-trust-row pb-trust-row-compact">',
      '      <div class="pb-trust-item"><span class="pb-trust-val">$2.3B+</span><span class="pb-trust-label">Resolved</span></div>',
      '      <div class="pb-trust-item"><span class="pb-trust-val">A+</span><span class="pb-trust-label">BBB Rating</span></div>',
      '      <div class="pb-trust-item"><span class="pb-trust-val">14 Yrs</span><span class="pb-trust-label">Experience</span></div>',
      '    </div>',
      '  </div>',
      '  <div class="pb-hero-form-card">',
      '    <h3>Get Your Free Consultation</h3>',
      '    <p>Fill this out and a tax expert will call you within 24 hours.</p>',
      '    <form class="pb-form">',
      '      <input type="text" placeholder="Full Name"/>',
      '      <input type="email" placeholder="Email Address"/>',
      '      <input type="tel" placeholder="Phone Number"/>',
      '      <button type="button" class="pb-btn">Get My Free Review</button>',
      '      <p class="pb-form-security">&#128274; 100% confidential. No spam.</p>',
      '    </form>',
      '  </div>',
      '</section>'
    ].join('\n')
  },

  // ================================================================
  //  SOCIAL PROOF (3 variants)
  // ================================================================

  {
    id: 'proof-stats',
    label: 'Stats Row',
    category: 'Social Proof',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    content: [
      '<section class="pb-stats-row">',
      '  <div class="pb-stat"><span class="pb-stat-val pb-gradient-text">$2.3B</span><span class="pb-stat-label">Tax Debt Resolved</span></div>',
      '  <div class="pb-stat-sep" aria-hidden="true">&#8226;</div>',
      '  <div class="pb-stat"><span class="pb-stat-val pb-gradient-text">50K+</span><span class="pb-stat-label">People Helped</span></div>',
      '  <div class="pb-stat-sep" aria-hidden="true">&#8226;</div>',
      '  <div class="pb-stat"><span class="pb-stat-val pb-gradient-text">4.8/5</span><span class="pb-stat-label">Client Rating</span></div>',
      '  <div class="pb-stat-sep" aria-hidden="true">&#8226;</div>',
      '  <div class="pb-stat"><span class="pb-stat-val pb-gradient-text">14 Yrs</span><span class="pb-stat-label">Experience</span></div>',
      '</section>'
    ].join('\n')
  },

  {
    id: 'proof-logos',
    label: 'Logo Bar',
    category: 'Social Proof',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="5" height="3" rx="0.5"/><rect x="9.5" y="6" width="5" height="3" rx="0.5"/><rect x="17" y="6" width="5" height="3" rx="0.5"/></svg>',
    content: [
      '<section class="pb-logo-bar">',
      '  <p class="pb-logo-bar-heading">As Seen On</p>',
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
      '  <span class="pb-counter-sep" aria-hidden="true">|</span>',
      '  <div class="pb-counter-item"><strong>50,000+</strong> Helped</div>',
      '  <span class="pb-counter-sep" aria-hidden="true">|</span>',
      '  <div class="pb-counter-item"><strong>4.8/5</strong> Rating</div>',
      '</section>'
    ].join('\n')
  },

  // ================================================================
  //  FEATURES / BENEFITS (4 variants)
  // ================================================================

  {
    id: 'feat-cards',
    label: 'Icon Card Grid',
    category: 'Features',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>',
    content: [
      '<section class="pb-features">',
      '  <h2>How We Resolve Your Tax Problem</h2>',
      '  <p class="pb-section-sub">Our licensed team handles every step so you can stop worrying about the IRS.</p>',
      '  <div class="pb-feat-grid">',
      '    <div class="pb-feat-card">',
      '      <div class="pb-feat-icon">&#9733;</div>',
      '      <h3>Free Case Evaluation</h3>',
      '      <p>We review your IRS account, pull transcripts, and identify every option available to you -- at no cost.</p>',
      '    </div>',
      '    <div class="pb-feat-card">',
      '      <div class="pb-feat-icon">&#9878;</div>',
      '      <h3>Licensed Tax Professionals</h3>',
      '      <p>Enrolled agents and CPAs authorized to represent you directly before the IRS. Fully licensed and insured.</p>',
      '    </div>',
      '    <div class="pb-feat-card">',
      '      <div class="pb-feat-icon">&#8635;</div>',
      '      <h3>Proven Results</h3>',
      '      <p>Over $2.3 billion in tax debt resolved. We negotiate offers in compromise, installment plans, penalty abatements, and more.</p>',
      '    </div>',
      '  </div>',
      '</section>'
    ].join('\n')
  },

  {
    id: 'feat-icon-list',
    label: 'Icon List',
    category: 'Features',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><polyline points="4 6 5 7 7 5"/><polyline points="4 12 5 13 7 11"/><polyline points="4 18 5 19 7 17"/></svg>',
    content: [
      '<section class="pb-icon-list-section">',
      '  <h2>What to Expect When You Work With Us</h2>',
      '  <p class="pb-section-sub">From your first call to resolution, here is what we provide.</p>',
      '  <ul class="pb-icon-list">',
      '    <li><span class="pb-check-icon">&#10003;</span><div><strong>Free, No-Obligation Consultation</strong><p>Talk to a tax expert about your situation. No pressure, no fees, no commitment required.</p></div></li>',
      '    <li><span class="pb-check-icon">&#10003;</span><div><strong>Full IRS Representation</strong><p>We deal with the IRS on your behalf. You do not have to call them, attend hearings, or handle paperwork.</p></div></li>',
      '    <li><span class="pb-check-icon">&#10003;</span><div><strong>Every Resolution Option Explored</strong><p>Offers in compromise, installment agreements, penalty abatement, currently not collectible status, and more.</p></div></li>',
      '    <li><span class="pb-check-icon">&#10003;</span><div><strong>Transparent Updates</strong><p>Know exactly where your case stands. Regular updates and a dedicated case manager throughout the process.</p></div></li>',
      '  </ul>',
      '</section>'
    ].join('\n')
  },

  {
    id: 'feat-alternating',
    label: 'Alternating Sections',
    category: 'Features',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="9" height="7" rx="1"/><rect x="13" y="3" width="9" height="7" rx="1" fill="currentColor" opacity="0.15"/><rect x="2" y="14" width="9" height="7" rx="1" fill="currentColor" opacity="0.15"/><rect x="13" y="14" width="9" height="7" rx="1"/></svg>',
    content: [
      '<section class="pb-alternating">',
      '  <div class="pb-alt-row">',
      '    <div class="pb-alt-text">',
      '      <h3>Stop the Calls and Letters</h3>',
      '      <p>Once we take your case, we contact the IRS on your behalf. The threatening letters and collection calls stop. You get breathing room to focus on your life.</p>',
      '    </div>',
      '    <div class="pb-alt-accent"></div>',
      '  </div>',
      '  <div class="pb-alt-row pb-alt-row-reverse">',
      '    <div class="pb-alt-text">',
      '      <h3>Find Out What You Actually Owe</h3>',
      '      <p>Many people owe less than they think once penalties and interest are reviewed. We pull your IRS transcripts and build a complete picture of your situation -- often uncovering options you did not know existed.</p>',
      '    </div>',
      '    <div class="pb-alt-accent"></div>',
      '  </div>',
      '</section>'
    ].join('\n')
  },

  {
    id: 'feat-showcase',
    label: 'Feature Showcase',
    category: 'Features',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    content: [
      '<section class="pb-showcase">',
      '  <h2>Why Thousands of People Trust This Team</h2>',
      '  <p class="pb-section-sub">Four reasons clients choose Community Tax to resolve their IRS debt.</p>',
      '  <div class="pb-showcase-grid">',
      '    <div class="pb-feat-card"><div class="pb-feat-icon">&#36;</div><h3>Reduce What You Owe</h3><p>We negotiate directly with the IRS to lower your total balance, eliminate penalties, and find a payment plan that fits your budget.</p></div>',
      '    <div class="pb-feat-card"><div class="pb-feat-icon">&#9734;</div><h3>14 Years of Results</h3><p>Over $2.3 billion in tax debt resolved. A+ BBB rating. 50,000+ clients helped nationwide.</p></div>',
      '    <div class="pb-feat-card"><div class="pb-feat-icon">&#9878;</div><h3>Fully Licensed Team</h3><p>Enrolled agents and CPAs authorized to represent you before the IRS. Every process follows federal guidelines.</p></div>',
      '    <div class="pb-feat-card"><div class="pb-feat-icon">&#9998;</div><h3>Personalized Plan</h3><p>No cookie-cutter solutions. We build a resolution strategy based on your specific financial situation and IRS history.</p></div>',
      '  </div>',
      '</section>'
    ].join('\n')
  },

  // ================================================================
  //  TESTIMONIALS (3 variants)
  // ================================================================

  {
    id: 'testimonial-large',
    label: 'Testimonial: Large Quote',
    category: 'Testimonials',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>',
    content: [
      '<section class="pb-testimonial">',
      '  <blockquote>"I owed the IRS $47,000 and had no idea where to start. My CPA referred me here, and within six months the team got my balance reduced and set up a payment plan I could actually afford. I wish I had done this sooner."</blockquote>',
      '  <div class="pb-testimonial-avatar">JR</div>',
      '  <cite>James R.</cite>',
      '  <span class="pb-cite-role">Houston, TX</span>',
      '  <p class="pb-results-vary">Individual results may vary based on your specific circumstances.</p>',
      '</section>'
    ].join('\n')
  },

  {
    id: 'testimonial-cards',
    label: 'Testimonial: Card Grid',
    category: 'Testimonials',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="9" height="16" rx="1"/><rect x="13" y="4" width="9" height="16" rx="1"/></svg>',
    content: [
      '<section class="pb-testi-cards">',
      '  <div class="pb-testi-card">',
      '    <div class="pb-testi-stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>',
      '    <blockquote>"I was getting IRS letters every week and did not know what to do. My accountant said to call these guys. They took over, stopped the collections, and got my penalties removed. Huge relief."</blockquote>',
      '    <cite>Maria S.</cite>',
      '    <p class="pb-results-vary">Results vary. Not a guarantee of specific outcomes.</p>',
      '  </div>',
      '  <div class="pb-testi-card">',
      '    <div class="pb-testi-stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>',
      '    <blockquote>"I had three years of unfiled returns and a growing balance. They filed everything, negotiated with the IRS, and got me into a manageable payment plan. I can finally sleep at night."</blockquote>',
      '    <cite>David T.</cite>',
      '    <p class="pb-results-vary">Results vary. Not a guarantee of specific outcomes.</p>',
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
      '<section class="pb-testi-strip">',
      '  <div class="pb-testi-mini"><blockquote>"Got my $47K balance reduced. Life-changing."</blockquote><cite>James R.</cite></div>',
      '  <div class="pb-testi-mini"><blockquote>"They stopped the IRS letters in two weeks."</blockquote><cite>Maria S.</cite></div>',
      '  <div class="pb-testi-mini"><blockquote>"Finally filed 3 years of returns. Huge relief."</blockquote><cite>David T.</cite></div>',
      '</section>'
    ].join('\n')
  },

  // ================================================================
  //  CTAs (3 variants)
  // ================================================================

  {
    id: 'cta-dark',
    label: 'CTA: Dark Banner',
    category: 'CTAs',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="20" height="12" rx="2" fill="currentColor" opacity="0.1"/><line x1="7" y1="10" x2="17" y2="10"/><rect x="9" y="13" width="6" height="2" rx="1"/></svg>',
    content: [
      '<section class="pb-cta-dark">',
      '  <h2>Ready to Resolve Your Tax Debt?</h2>',
      '  <p>Join the 50,000+ people who have already taken control of their IRS situation. Your free consultation takes less than 15 minutes.</p>',
      '  <a href="#" class="pb-btn pb-btn-glow">Get My Free Consultation</a>',
      '  <p class="pb-cta-trust">No cost. No obligation. 100% confidential.</p>',
      '</section>'
    ].join('\n')
  },

  {
    id: 'cta-gradient',
    label: 'CTA: Gradient',
    category: 'CTAs',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></svg>',
    content: [
      '<section class="pb-cta-gradient">',
      '  <h2>Do Not Wait Until the IRS Takes Action</h2>',
      '  <p>Penalties and interest grow every day. The sooner you act, the more options you have. Talk to a licensed expert today.</p>',
      '  <a href="#" class="pb-btn">Request a Free Review</a>',
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
      '    <h2>Take the First Step Today</h2>',
      '    <p>A free, confidential consultation with a licensed tax professional. No commitment required -- just answers about your options.</p>',
      '    <a href="#" class="pb-btn">Get Started Free</a>',
      '  </div>',
      '</section>'
    ].join('\n')
  },

  // ================================================================
  //  FORMS / LEAD CAPTURE (3 variants)
  // ================================================================

  {
    id: 'form-full',
    label: 'Form: Full Width',
    category: 'Forms',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg>',
    content: [
      '<section class="pb-form-section">',
      '  <h2>Request Your Free Consultation</h2>',
      '  <p class="pb-section-sub">Fill out the form below and a licensed tax expert will contact you within 24 hours to discuss your options.</p>',
      '  <form class="pb-form">',
      '    <label class="pb-form-label" for="pb-name">Full Name</label>',
      '    <input id="pb-name" type="text" placeholder="John Smith"/>',
      '    <label class="pb-form-label" for="pb-email">Email Address</label>',
      '    <input id="pb-email" type="email" placeholder="john@example.com"/>',
      '    <label class="pb-form-label" for="pb-phone">Phone Number</label>',
      '    <input id="pb-phone" type="tel" placeholder="(555) 123-4567"/>',
      '    <button type="button" class="pb-btn">Get My Free Consultation</button>',
      '    <p class="pb-form-security">&#128274; Your information is secure and never shared.</p>',
      '  </form>',
      '</section>'
    ].join('\n')
  },

  {
    id: 'form-split',
    label: 'Form: Split Layout',
    category: 'Forms',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="9" height="18" rx="1"/><rect x="13" y="3" width="9" height="18" rx="1"/></svg>',
    content: [
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
      '      <label class="pb-form-label" for="pb-split-name">Full Name</label>',
      '      <input id="pb-split-name" type="text" placeholder="Full Name"/>',
      '      <label class="pb-form-label" for="pb-split-email">Email Address</label>',
      '      <input id="pb-split-email" type="email" placeholder="Email Address"/>',
      '      <label class="pb-form-label" for="pb-split-phone">Phone Number</label>',
      '      <input id="pb-split-phone" type="tel" placeholder="Phone Number"/>',
      '      <button type="button" class="pb-btn">Request Free Review</button>',
      '      <p class="pb-form-security">&#128274; Secure and confidential</p>',
      '    </form>',
      '  </div>',
      '</section>'
    ].join('\n')
  },

  {
    id: 'form-minimal',
    label: 'Form: Minimal',
    category: 'Forms',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="8" width="20" height="8" rx="2"/><line x1="7" y1="12" x2="7.01" y2="12"/></svg>',
    content: [
      '<section class="pb-form-minimal">',
      '  <form class="pb-form">',
      '    <label class="pb-form-label" for="pb-min-name">Full Name</label>',
      '    <input id="pb-min-name" type="text" placeholder="Full Name"/>',
      '    <label class="pb-form-label" for="pb-min-email">Email Address</label>',
      '    <input id="pb-min-email" type="email" placeholder="Email Address"/>',
      '    <label class="pb-form-label" for="pb-min-phone">Phone Number</label>',
      '    <input id="pb-min-phone" type="tel" placeholder="Phone Number"/>',
      '    <button type="button" class="pb-btn">Get My Free Consultation</button>',
      '  </form>',
      '</section>'
    ].join('\n')
  },

  // ================================================================
  //  TRUST / CREDENTIALS (3 variants)
  // ================================================================

  {
    id: 'trust-badges',
    label: 'Trust: Badge Row',
    category: 'Trust',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    content: [
      '<section class="pb-trust-bar">',
      '  <span class="pb-trust-badge">IRS Authorized</span>',
      '  <span class="pb-trust-badge">BBB A+ Rated</span>',
      '  <span class="pb-trust-badge">NAEA Member</span>',
      '  <span class="pb-trust-badge">50K+ Clients</span>',
      '  <span class="pb-trust-badge">Licensed CPAs</span>',
      '</section>'
    ].join('\n')
  },

  {
    id: 'trust-credentials',
    label: 'Trust: Credentials Grid',
    category: 'Trust',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>',
    content: [
      '<section class="pb-trust-credentials">',
      '  <h2>Why You Can Trust This Team</h2>',
      '  <p class="pb-section-sub">The professionals working on your case are fully licensed and highly experienced.</p>',
      '  <div class="pb-cred-grid">',
      '    <div class="pb-cred-card"><div class="pb-cred-icon">&#9733;</div><strong>IRS Authorized</strong><p>Official e-file provider with direct IRS access</p></div>',
      '    <div class="pb-cred-card"><div class="pb-cred-icon">&#9733;</div><strong>BBB A+ Rated</strong><p>Top rating from the Better Business Bureau</p></div>',
      '    <div class="pb-cred-card"><div class="pb-cred-icon">&#9733;</div><strong>NAEA Member</strong><p>National Association of Enrolled Agents</p></div>',
      '  </div>',
      '</section>'
    ].join('\n')
  },

  {
    id: 'trust-partner',
    label: 'Trust: Partner Bar',
    category: 'Trust',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="5" height="3" rx="0.5"/><rect x="9.5" y="6" width="5" height="3" rx="0.5"/><rect x="17" y="6" width="5" height="3" rx="0.5"/></svg>',
    content: [
      '<section class="pb-logo-bar">',
      '  <p class="pb-logo-bar-heading">Backed By</p>',
      '  <div class="pb-logo-row">',
      '    <div class="pb-logo-placeholder">Community Tax</div>',
      '    <div class="pb-logo-placeholder">IRS Authorized</div>',
      '    <div class="pb-logo-placeholder">BBB A+</div>',
      '  </div>',
      '</section>'
    ].join('\n')
  },

  // ================================================================
  //  FAQ (2 variants)
  // ================================================================

  {
    id: 'faq-accordion',
    label: 'FAQ: Accordion',
    category: 'FAQ',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M9 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    content: [
      '<section class="pb-faq">',
      '  <h2>Frequently Asked Questions</h2>',
      '  <p class="pb-section-sub">Common questions from people dealing with IRS debt.</p>',
      '  <details class="pb-faq-accordion"><summary>How much does a consultation cost?</summary><p>Nothing. Your initial consultation is completely free, and there is no obligation to move forward. We review your situation, explain your options, and let you decide.</p></details>',
      '  <details class="pb-faq-accordion"><summary>Can you really reduce what I owe the IRS?</summary><p>In many cases, yes. Through offers in compromise, penalty abatement, and other IRS programs, we can often reduce the total amount owed. Every case is different, which is why we start with a free review.</p></details>',
      '  <details class="pb-faq-accordion"><summary>Will the IRS stop contacting me?</summary><p>Once we take your case and file the proper authorization, the IRS communicates with us instead of you. Collection calls and threatening letters should stop.</p></details>',
      '  <details class="pb-faq-accordion"><summary>How long does the process take?</summary><p>Most cases resolve in 3-6 months. Complex cases involving multiple years or business taxes may take longer. We keep you informed at every stage.</p></details>',
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
      '  <p class="pb-section-sub">Quick answers about resolving your tax debt.</p>',
      '  <div class="pb-faq-grid">',
      '    <div class="pb-faq-item"><strong>Is the consultation really free?</strong><p>Yes. We review your case at no cost with zero obligation to proceed.</p></div>',
      '    <div class="pb-faq-item"><strong>Can you reduce what I owe?</strong><p>Often, yes. Through IRS programs like offers in compromise and penalty abatement.</p></div>',
      '    <div class="pb-faq-item"><strong>Will the IRS stop calling me?</strong><p>Once we file authorization, the IRS contacts us instead of you.</p></div>',
      '    <div class="pb-faq-item"><strong>How long does it take?</strong><p>Most cases resolve in 3-6 months. We keep you updated throughout.</p></div>',
      '  </div>',
      '</section>'
    ].join('\n')
  },

  // ================================================================
  //  PROCESS / HOW IT WORKS (2 variants)
  // ================================================================

  {
    id: 'process-steps',
    label: 'Process: Numbered Steps',
    category: 'Process',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="5" r="3"/><circle cx="12" cy="12" r="3"/><circle cx="12" cy="19" r="3"/></svg>',
    content: [
      '<section class="pb-process">',
      '  <h2>How It Works</h2>',
      '  <p class="pb-section-sub">Three simple steps to resolve your tax problem.</p>',
      '  <div class="pb-steps">',
      '    <div class="pb-step">',
      '      <div class="pb-step-num">1</div>',
      '      <h3>Free Consultation</h3>',
      '      <p>Tell us about your situation. We pull your IRS records and review every option available to you -- at no cost.</p>',
      '    </div>',
      '    <div class="pb-step">',
      '      <div class="pb-step-num">2</div>',
      '      <h3>We Handle the IRS</h3>',
      '      <p>Our licensed team represents you directly with the IRS. We negotiate the best possible resolution for your case.</p>',
      '    </div>',
      '    <div class="pb-step">',
      '      <div class="pb-step-num">3</div>',
      '      <h3>Get Your Fresh Start</h3>',
      '      <p>Your debt is resolved, penalties are addressed, and you can move forward without the IRS hanging over your head.</p>',
      '    </div>',
      '  </div>',
      '</section>'
    ].join('\n')
  },

  {
    id: 'process-timeline',
    label: 'Process: Timeline',
    category: 'Process',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="2" x2="12" y2="22"/><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>',
    content: [
      '<section class="pb-timeline">',
      '  <h2>Your Path to Resolution</h2>',
      '  <p class="pb-section-sub">From your first call to a fresh start -- here is what to expect.</p>',
      '  <div class="pb-timeline-list">',
      '    <div class="pb-timeline-item"><div class="pb-timeline-dot" aria-hidden="true"></div><strong>Day 1: Free Consultation</strong><p>Talk to a licensed tax expert. No cost, no obligation. We review your situation and explain your options.</p></div>',
      '    <div class="pb-timeline-item"><div class="pb-timeline-dot" aria-hidden="true"></div><strong>Week 1: Case Investigation</strong><p>We pull your IRS transcripts and build a complete picture. You may owe less than you think.</p></div>',
      '    <div class="pb-timeline-item"><div class="pb-timeline-dot" aria-hidden="true"></div><strong>Months 1-6: IRS Negotiation</strong><p>Our team negotiates with the IRS on your behalf. You get regular updates and never have to call the IRS yourself.</p></div>',
      '    <div class="pb-timeline-item"><div class="pb-timeline-dot" aria-hidden="true"></div><strong>Resolution: Fresh Start</strong><p>Your case is resolved. Debt reduced or settled, penalties addressed, and you can move on with your life.</p></div>',
      '  </div>',
      '</section>'
    ].join('\n')
  },

  // ================================================================
  //  COMPLIANCE FOOTER (auto-added, locked)
  // ================================================================

  {
    id: 'compliance-footer',
    label: 'Compliance Footer',
    category: 'Compliance',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    content: [
      '<section class="pb-compliance-footer" data-pb-locked="true">',
      '  <p>This page is published by an independent referral partner, not an employee or affiliate of Community Tax or the IRS.</p>',
      '  <p>Results vary based on individual circumstances. No specific outcome is guaranteed.</p>',
      '  <p>Community Tax is a licensed tax resolution firm. See ctax.com/disclosures for details.</p>',
      '</section>'
    ].join('\n')
  },

  // ================================================================
  //  BASIC BLOCKS
  // ================================================================

  {
    id: 'text-block',
    label: 'Text',
    category: 'Basic',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>',
    content: '<div class="pb-text-block"><p>Add your text content here. This is a flexible block for any copy you need.</p></div>'
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
    content: '<a href="#" class="pb-btn" style="display:inline-block;margin:16px auto;text-align:center;">Click Here</a>'
  },

  {
    id: 'image',
    label: 'Image',
    category: 'Basic',
    media: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
    content: { type: 'image' },
    activate: true,
    select: true
  }
];
