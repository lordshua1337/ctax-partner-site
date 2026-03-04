// ══════════════════════════════════════════
//  M1P1C3: AI PAGE GENERATOR
//  Describe your page, AI builds it
// ══════════════════════════════════════════

var PBAI_CACHE_KEY = 'ctax_pb_ai_history';

function pbaiShowGenerator() {
  var existing = document.getElementById('pbai-overlay');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.className = 'pb-tpl-overlay';
  overlay.id = 'pbai-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var modal = document.createElement('div');
  modal.className = 'pb-tpl-modal';
  modal.style.maxWidth = '680px';

  modal.innerHTML = '<div class="pb-tpl-header">'
    + '<div>'
    + '<div class="pb-tpl-title">AI Page Generator</div>'
    + '<div class="pb-tpl-subtitle">Describe the page you want, and AI will build it for you.</div>'
    + '</div>'
    + '<button class="pb-tpl-close" onclick="document.getElementById(\'pbai-overlay\').remove()">'
    + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
    + '</button>'
    + '</div>'
    + '<div id="pbai-body"></div>';

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  pbaiRenderForm();
}

function pbaiRenderForm() {
  var body = document.getElementById('pbai-body');
  if (!body) return;

  // Get saved persona
  var persona = localStorage.getItem('ctax_pb_persona') || 'cpa';
  var personaLabel = (typeof PB_PERSONAS !== 'undefined' && PB_PERSONAS[persona])
    ? PB_PERSONAS[persona].label : 'CPA / Tax Professional';

  var html = '<div class="pbai-form">';

  // Quick-start presets
  html += '<div class="pbai-presets">'
    + '<div class="pbai-presets-label">Quick Start</div>'
    + '<div class="pbai-presets-row">';

  var presets = [
    { label: 'Lead Capture', prompt: 'A clean lead capture page with a compelling hero, 3 benefits, trust signals, and a prominent form. Focus on urgency -- IRS penalties grow daily.' },
    { label: 'Tax Season Special', prompt: 'A seasonal promotion page for tax season. Hero with deadline urgency, countdown feel, step-by-step process, client testimonials, FAQ section, and a clear call-to-action form.' },
    { label: 'Educational Guide', prompt: 'An educational resource page that positions me as an expert. Start with a knowledge-based hero, include alternating content sections explaining tax resolution, add an FAQ, and finish with a soft consultation CTA.' },
    { label: 'Event / Webinar', prompt: 'A webinar registration page. Eye-catching dark hero with event details, speaker bio section, agenda/topics covered, social proof from past attendees, and a registration form with limited seats urgency.' },
    { label: 'Referral Partner', prompt: 'A page targeting other professionals who could refer clients to me. Explain the partnership opportunity, show revenue potential, include a process diagram, testimonials from existing partners, and a simple sign-up form.' },
    { label: 'Case Study', prompt: 'A case study page showcasing a successful client outcome (anonymized). Start with the problem, walk through the resolution process, show the results with numbers, and end with a CTA for similar situations.' }
  ];

  presets.forEach(function(p) {
    html += '<button class="pbai-preset-btn" onclick="pbaiSetPreset(\'' + p.prompt.replace(/'/g, "\\'") + '\')">' + p.label + '</button>';
  });

  html += '</div></div>';

  // Main prompt input
  html += '<div class="pbai-field">'
    + '<label class="pbai-label">Describe Your Page</label>'
    + '<textarea class="pbai-textarea" id="pbai-prompt" placeholder="Example: I want a page that explains tax resolution services to homeowners facing IRS liens. Include a hero with urgency, a 3-step process section, client testimonials, an FAQ about IRS liens, and a contact form." rows="5"></textarea>'
    + '<div class="pbai-hint">The more detail you provide, the better the result. Include specific sections, tone, and audience.</div>'
    + '</div>';

  // Options row
  html += '<div class="pbai-options">';

  // Tone
  html += '<div class="pbai-option">'
    + '<label class="pbai-label">Tone</label>'
    + '<select class="pbai-select" id="pbai-tone">'
    + '<option value="professional">Professional & Authoritative</option>'
    + '<option value="warm">Warm & Empathetic</option>'
    + '<option value="urgent">Urgent & Action-Driven</option>'
    + '<option value="educational">Educational & Informative</option>'
    + '</select>'
    + '</div>';

  // Target audience
  html += '<div class="pbai-option">'
    + '<label class="pbai-label">Target Audience</label>'
    + '<select class="pbai-select" id="pbai-audience">'
    + '<option value="individuals">Individuals with Tax Debt</option>'
    + '<option value="business">Business Owners</option>'
    + '<option value="homeowners">Homeowners (Lien Issues)</option>'
    + '<option value="self-employed">Self-Employed / 1099</option>'
    + '<option value="professionals">Professional Referral Partners</option>'
    + '</select>'
    + '</div>';

  html += '</div>';

  // Color scheme
  html += '<div class="pbai-options">';
  html += '<div class="pbai-option">'
    + '<label class="pbai-label">Color Scheme</label>'
    + '<select class="pbai-select" id="pbai-color">'
    + '<option value="blue">Blue / Trust (Default)</option>'
    + '<option value="dark">Dark / Authority</option>'
    + '<option value="green">Green / Growth</option>'
    + '<option value="neutral">Neutral / Clean</option>'
    + '</select>'
    + '</div>';

  // Section count
  html += '<div class="pbai-option">'
    + '<label class="pbai-label">Page Length</label>'
    + '<select class="pbai-select" id="pbai-length">'
    + '<option value="short">Short (3-4 sections)</option>'
    + '<option value="medium" selected>Medium (5-7 sections)</option>'
    + '<option value="long">Long (8-10 sections)</option>'
    + '</select>'
    + '</div>';

  html += '</div>';

  // Context info
  html += '<div class="pbai-context">'
    + '<div class="pbai-context-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></div>'
    + '<div class="pbai-context-text">Generating as <strong>' + personaLabel + '</strong>. '
    + 'The AI will use your partner profile and selected blocks to build a page you can immediately edit in the builder.</div>'
    + '</div>';

  // Generate button
  html += '<div class="pbai-actions">'
    + '<button class="btn btn-p" id="pbai-gen-btn" onclick="pbaiGenerate()" style="width:100%">Generate My Page</button>'
    + '</div>';

  // History section
  var history = pbaiGetHistory();
  if (history.length > 0) {
    html += '<div class="pbai-history">'
      + '<div class="pbai-history-label">Recent Generations</div>';
    history.slice(0, 3).forEach(function(entry, i) {
      html += '<div class="pbai-history-item" onclick="pbaiLoadFromHistory(' + i + ')">'
        + '<div class="pbai-history-prompt">' + (entry.prompt.length > 80 ? entry.prompt.substring(0, 80) + '...' : entry.prompt) + '</div>'
        + '<div class="pbai-history-meta">' + new Date(entry.timestamp).toLocaleDateString() + ' -- ' + entry.sections + ' sections</div>'
        + '</div>';
    });
    html += '</div>';
  }

  html += '</div>';
  body.innerHTML = html;
}

function pbaiSetPreset(prompt) {
  var textarea = document.getElementById('pbai-prompt');
  if (textarea) textarea.value = prompt;
}

// ── GENERATE ──────────────────────────────

async function pbaiGenerate() {
  var promptEl = document.getElementById('pbai-prompt');
  var prompt = promptEl ? promptEl.value.trim() : '';
  if (!prompt) {
    if (typeof showToast === 'function') showToast('Describe the page you want to create', 'error');
    return;
  }

  var tone = document.getElementById('pbai-tone');
  var audience = document.getElementById('pbai-audience');
  var color = document.getElementById('pbai-color');
  var length = document.getElementById('pbai-length');

  var toneVal = tone ? tone.value : 'professional';
  var audienceVal = audience ? audience.value : 'individuals';
  var colorVal = color ? color.value : 'blue';
  var lengthVal = length ? length.value : 'medium';

  var btn = document.getElementById('pbai-gen-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="bpp-spinner"></span> Building your page...';
  }

  var persona = localStorage.getItem('ctax_pb_persona') || 'cpa';

  var colorMap = {
    blue: { primary: '#0B5FD8', dark: '#0A1628', accent: '#2563eb', soft: '#EBF3FF' },
    dark: { primary: '#1a1a2e', dark: '#0f0f23', accent: '#e94560', soft: '#2a2a4a' },
    green: { primary: '#059669', dark: '#064e3b', accent: '#10b981', soft: '#ecfdf5' },
    neutral: { primary: '#374151', dark: '#111827', accent: '#6b7280', soft: '#f9fafb' }
  };
  var colors = colorMap[colorVal] || colorMap.blue;

  var sectionCount = lengthVal === 'short' ? '3-4' : lengthVal === 'long' ? '8-10' : '5-7';

  var systemPrompt = 'You are an expert landing page designer for the Community Tax partner program. '
    + 'You generate complete, production-ready HTML for landing pages. '
    + 'The HTML must be self-contained with inline styles. '
    + 'Use these colors: primary=' + colors.primary + ', dark=' + colors.dark + ', accent=' + colors.accent + ', soft background=' + colors.soft + '. '
    + 'Font: font-family: "DM Sans", sans-serif. Headings can use "DM Serif Display", serif. '
    + 'The partner is a ' + persona + '. '
    + 'Target audience: ' + audienceVal + '. '
    + 'Tone: ' + toneVal + '. '
    + 'Generate ' + sectionCount + ' sections. '
    + 'CRITICAL RULES: '
    + '1. Return ONLY the HTML wrapped in a single <div>. No markdown, no explanation, no code fences. '
    + '2. Every section must have proper padding (60px 24px minimum). '
    + '3. Max-width content containers at 1100px, centered. '
    + '4. Use responsive-friendly styles (no fixed widths over 1100px). '
    + '5. All form fields must have name attributes. '
    + '6. Include a compliance footer: "Community Tax is a BBB A+ rated company. Your information is secure and confidential." '
    + '7. Buttons should be styled with border-radius: 8px, padding: 14px 32px, font-weight: 600. '
    + '8. Use real, compelling copy specific to tax resolution -- no lorem ipsum. '
    + '9. Include data-section attributes on each section for the editor. '
    + '10. Images: use solid color backgrounds or gradients instead of img tags (no broken images).';

  var userPrompt = 'Build this landing page:\n\n' + prompt;

  try {
    if (typeof CTAX_API_KEY === 'undefined' || !CTAX_API_KEY) throw new Error('No API key');

    var resp = await fetch(CTAX_API_URL, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    if (!resp.ok) throw new Error('API ' + resp.status);
    var data = await resp.json();
    var text = data.content && data.content[0] ? data.content[0].text : '';

    // Extract HTML -- strip any code fences if present
    var html = text.replace(/```html?\n?/g, '').replace(/```\n?/g, '').trim();

    if (html.length < 100) throw new Error('Response too short');

    pbaiApplyToEditor(html, prompt, sectionCount);

  } catch (err) {
    // Fallback: build page from template blocks
    var fallbackHtml = pbaiBuildFallback(prompt, toneVal, audienceVal, colors, lengthVal);
    pbaiApplyToEditor(fallbackHtml, prompt, sectionCount);
  }
}

function pbaiApplyToEditor(html, prompt, sectionCount) {
  // Close the generator modal
  var overlay = document.getElementById('pbai-overlay');
  if (overlay) overlay.remove();

  // Load into GrapesJS editor
  if (typeof pbEditor !== 'undefined' && pbEditor) {
    pbEditor.setComponents(html);
    pbEditor.setStyle('');
    if (typeof pbInjectCanvasStyles === 'function') pbInjectCanvasStyles();
    if (typeof pbSave === 'function') pbSave();
    if (typeof pbUpdateCount === 'function') pbUpdateCount();
  }

  // Save to history
  pbaiSaveHistory({
    prompt: prompt,
    sections: sectionCount,
    timestamp: Date.now()
  });

  if (typeof portalToast === 'function') portalToast('AI page generated! Edit any section in the builder.', 'success');
}

// ── FALLBACK BUILDER ──────────────────────────────

function pbaiBuildFallback(prompt, tone, audience, colors, length) {
  var sections = [];
  var sectionCount = length === 'short' ? 4 : length === 'long' ? 9 : 6;

  // Determine content from prompt keywords
  var wantsFaq = /faq|question|asked/i.test(prompt);
  var wantsTestimonials = /testimon|review|client|success/i.test(prompt);
  var wantsProcess = /process|step|how|work/i.test(prompt);
  var wantsForm = /form|contact|sign|register|consult/i.test(prompt);
  var wantsStats = /stat|number|data|result/i.test(prompt);
  var wantsCaseStudy = /case|study|story|outcome/i.test(prompt);

  var headlineMap = {
    professional: { hero: 'Resolve Your Tax Debt with Confidence', sub: 'Expert guidance from an experienced partner you can trust.' },
    warm: { hero: 'You Deserve a Fresh Start', sub: 'We understand the stress of tax debt. Let us help you find a path forward.' },
    urgent: { hero: 'IRS Penalties Are Growing Every Day', sub: 'Take action now before your tax debt spirals out of control.' },
    educational: { hero: 'Understanding Your Tax Resolution Options', sub: 'Learn the proven strategies that have helped thousands of taxpayers find relief.' }
  };

  var headlines = headlineMap[tone] || headlineMap.professional;

  // HERO section
  sections.push(
    '<div data-section="hero" style="background:linear-gradient(155deg,' + colors.dark + ',' + colors.primary + ');padding:80px 24px;text-align:center;color:white">'
    + '<div style="max-width:800px;margin:0 auto">'
    + '<h1 style="font-family:DM Serif Display,serif;font-size:42px;margin:0 0 16px;line-height:1.15">' + headlines.hero + '</h1>'
    + '<p style="font-size:18px;opacity:0.85;margin:0 0 32px;line-height:1.6">' + headlines.sub + '</p>'
    + '<a href="#contact-form" style="display:inline-block;background:white;color:' + colors.primary + ';padding:16px 40px;border-radius:8px;font-weight:700;font-size:16px;text-decoration:none">Get Your Free Consultation</a>'
    + '</div></div>'
  );

  // STATS section
  if (wantsStats || sectionCount > 4) {
    sections.push(
      '<div data-section="stats" style="background:' + colors.soft + ';padding:48px 24px">'
      + '<div style="max-width:1100px;margin:0 auto;display:flex;justify-content:center;gap:48px;flex-wrap:wrap;text-align:center">'
      + '<div><div style="font-size:36px;font-weight:800;color:' + colors.primary + '">$181B+</div><div style="font-size:14px;color:#666">Outstanding IRS Tax Debt</div></div>'
      + '<div><div style="font-size:36px;font-weight:800;color:' + colors.primary + '">95%</div><div style="font-size:14px;color:#666">Client Satisfaction Rate</div></div>'
      + '<div><div style="font-size:36px;font-weight:800;color:' + colors.primary + '">10K+</div><div style="font-size:14px;color:#666">Cases Resolved</div></div>'
      + '<div><div style="font-size:36px;font-weight:800;color:' + colors.primary + '">A+</div><div style="font-size:14px;color:#666">BBB Rating</div></div>'
      + '</div></div>'
    );
  }

  // BENEFITS / FEATURES
  sections.push(
    '<div data-section="benefits" style="padding:64px 24px;background:white">'
    + '<div style="max-width:1100px;margin:0 auto;text-align:center">'
    + '<h2 style="font-family:DM Serif Display,serif;font-size:32px;color:' + colors.dark + ';margin:0 0 12px">Why Choose Us?</h2>'
    + '<p style="color:#666;margin:0 0 40px;font-size:16px">Comprehensive tax resolution services backed by real results.</p>'
    + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;text-align:left">'
    + pbaiFeatureCard('Enrolled Agents & CPAs', 'Our team includes IRS-credentialed professionals who know the tax code inside and out.', colors)
    + pbaiFeatureCard('Transparent Pricing', 'No hidden fees, no surprises. Know exactly what you are paying for before we start.', colors)
    + pbaiFeatureCard('Proven Results', 'Thousands of cases resolved with an average savings of 80% on IRS penalties and interest.', colors)
    + '</div></div></div>'
  );

  // PROCESS section
  if (wantsProcess || sectionCount > 5) {
    sections.push(
      '<div data-section="process" style="padding:64px 24px;background:' + colors.soft + '">'
      + '<div style="max-width:1100px;margin:0 auto;text-align:center">'
      + '<h2 style="font-family:DM Serif Display,serif;font-size:32px;color:' + colors.dark + ';margin:0 0 40px">How It Works</h2>'
      + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:32px">'
      + pbaiStepCard(1, 'Free Consultation', 'We review your tax situation and explain your options -- no obligation, no pressure.', colors)
      + pbaiStepCard(2, 'Investigation', 'Our team pulls your IRS transcripts and builds a complete picture of your case.', colors)
      + pbaiStepCard(3, 'Resolution', 'We negotiate directly with the IRS on your behalf to reduce what you owe.', colors)
      + pbaiStepCard(4, 'Fresh Start', 'Walk away with a manageable payment plan or significant reduction in your tax debt.', colors)
      + '</div></div></div>'
    );
  }

  // TESTIMONIALS
  if (wantsTestimonials || sectionCount > 5) {
    sections.push(
      '<div data-section="testimonials" style="padding:64px 24px;background:white">'
      + '<div style="max-width:1100px;margin:0 auto;text-align:center">'
      + '<h2 style="font-family:DM Serif Display,serif;font-size:32px;color:' + colors.dark + ';margin:0 0 40px">What Our Clients Say</h2>'
      + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px">'
      + pbaiTestimonialCard('"I owed the IRS $47,000 in back taxes. They got it reduced to $8,200. I could not believe it."', 'Michael R.', 'Small Business Owner', colors)
      + pbaiTestimonialCard('"After years of ignoring IRS letters, I finally got help. The team made the whole process painless."', 'Sarah L.', 'Freelance Designer', colors)
      + pbaiTestimonialCard('"Professional, transparent, and actually delivered on their promises. Worth every penny."', 'David K.', 'Restaurant Owner', colors)
      + '</div></div></div>'
    );
  }

  // CASE STUDY
  if (wantsCaseStudy) {
    sections.push(
      '<div data-section="case-study" style="padding:64px 24px;background:' + colors.soft + '">'
      + '<div style="max-width:800px;margin:0 auto">'
      + '<h2 style="font-family:DM Serif Display,serif;font-size:32px;color:' + colors.dark + ';text-align:center;margin:0 0 32px">Real Results: A Client Story</h2>'
      + '<div style="background:white;border-radius:12px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">'
      + '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:24px;text-align:center">'
      + '<div><div style="font-size:14px;color:#666;margin-bottom:4px">Original Debt</div><div style="font-size:24px;font-weight:700;color:#dc2626">$83,450</div></div>'
      + '<div><div style="font-size:14px;color:#666;margin-bottom:4px">Final Settlement</div><div style="font-size:24px;font-weight:700;color:' + colors.primary + '">$12,600</div></div>'
      + '<div><div style="font-size:14px;color:#666;margin-bottom:4px">Saved</div><div style="font-size:24px;font-weight:700;color:#059669">85%</div></div>'
      + '</div>'
      + '<p style="color:#444;line-height:1.7;margin:0">A self-employed contractor had accumulated over $83,000 in tax debt over 5 years of unfiled returns. After our investigation, we negotiated an Offer in Compromise that settled the entire debt for $12,600 -- a payment plan he could manage comfortably.</p>'
      + '</div></div></div>'
    );
  }

  // FAQ
  if (wantsFaq || sectionCount > 6) {
    sections.push(
      '<div data-section="faq" style="padding:64px 24px;background:white">'
      + '<div style="max-width:800px;margin:0 auto">'
      + '<h2 style="font-family:DM Serif Display,serif;font-size:32px;color:' + colors.dark + ';text-align:center;margin:0 0 40px">Frequently Asked Questions</h2>'
      + pbaiQA('How much does it cost to get started?', 'The initial consultation is free. If we determine we can help, the investigation fee is $295 which covers pulling your IRS transcripts and building your case strategy.', colors)
      + pbaiQA('Will this stop IRS collections?', 'Yes. Once we are engaged as your representative, we file a Power of Attorney (Form 2848) with the IRS which typically pauses active collections while we work your case.', colors)
      + pbaiQA('How long does the process take?', 'Most cases are resolved within 3-6 months, depending on complexity. Some straightforward cases can be resolved in as little as 30 days.', colors)
      + pbaiQA('What if I have unfiled tax returns?', 'We help with that too. Our team will prepare and file any missing returns as part of your resolution package.', colors)
      + '</div></div>'
    );
  }

  // CONTACT FORM
  if (wantsForm || true) {
    sections.push(
      '<div data-section="form" id="contact-form" style="padding:64px 24px;background:' + colors.dark + ';color:white">'
      + '<div style="max-width:600px;margin:0 auto;text-align:center">'
      + '<h2 style="font-family:DM Serif Display,serif;font-size:32px;margin:0 0 8px">Get Your Free Consultation</h2>'
      + '<p style="opacity:0.7;margin:0 0 32px;font-size:16px">Fill out the form below and we will reach out within 24 hours.</p>'
      + '<form style="display:flex;flex-direction:column;gap:12px;text-align:left">'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">'
      + '<input type="text" name="first_name" placeholder="First Name" style="padding:14px 16px;border:1.5px solid rgba(255,255,255,0.2);border-radius:8px;background:rgba(255,255,255,0.08);color:white;font-size:15px;font-family:DM Sans,sans-serif">'
      + '<input type="text" name="last_name" placeholder="Last Name" style="padding:14px 16px;border:1.5px solid rgba(255,255,255,0.2);border-radius:8px;background:rgba(255,255,255,0.08);color:white;font-size:15px;font-family:DM Sans,sans-serif">'
      + '</div>'
      + '<input type="email" name="email" placeholder="Email Address" style="padding:14px 16px;border:1.5px solid rgba(255,255,255,0.2);border-radius:8px;background:rgba(255,255,255,0.08);color:white;font-size:15px;font-family:DM Sans,sans-serif">'
      + '<input type="tel" name="phone" placeholder="Phone Number" style="padding:14px 16px;border:1.5px solid rgba(255,255,255,0.2);border-radius:8px;background:rgba(255,255,255,0.08);color:white;font-size:15px;font-family:DM Sans,sans-serif">'
      + '<select name="tax_debt" style="padding:14px 16px;border:1.5px solid rgba(255,255,255,0.2);border-radius:8px;background:rgba(255,255,255,0.08);color:white;font-size:15px;font-family:DM Sans,sans-serif">'
      + '<option value="">Estimated Tax Debt</option>'
      + '<option value="5000-15000">$5,000 - $15,000</option>'
      + '<option value="15000-50000">$15,000 - $50,000</option>'
      + '<option value="50000-100000">$50,000 - $100,000</option>'
      + '<option value="100000+">$100,000+</option>'
      + '</select>'
      + '<button type="submit" style="padding:16px;background:' + colors.accent + ';color:white;border:none;border-radius:8px;font-size:16px;font-weight:700;cursor:pointer;font-family:DM Sans,sans-serif">Request Free Consultation</button>'
      + '</form>'
      + '</div></div>'
    );
  }

  // COMPLIANCE FOOTER
  sections.push(
    '<div data-section="compliance" style="padding:24px;background:#f8f9fa;text-align:center;font-size:12px;color:#999;border-top:1px solid #eee">'
    + 'Community Tax is a BBB A+ rated company. Your information is secure and confidential. '
    + 'Results may vary based on individual circumstances. Community Tax and its affiliates do not provide legal advice.'
    + '</div>'
  );

  return sections.join('\n');
}

function pbaiFeatureCard(title, desc, colors) {
  return '<div style="background:' + colors.soft + ';border-radius:12px;padding:28px">'
    + '<h3 style="font-size:18px;font-weight:700;color:' + colors.dark + ';margin:0 0 8px">' + title + '</h3>'
    + '<p style="font-size:14px;color:#666;line-height:1.65;margin:0">' + desc + '</p>'
    + '</div>';
}

function pbaiStepCard(num, title, desc, colors) {
  return '<div style="text-align:center">'
    + '<div style="width:48px;height:48px;border-radius:50%;background:' + colors.primary + ';color:white;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:20px;margin:0 auto 12px">' + num + '</div>'
    + '<h3 style="font-size:18px;font-weight:700;color:' + colors.dark + ';margin:0 0 8px">' + title + '</h3>'
    + '<p style="font-size:14px;color:#666;line-height:1.6;margin:0">' + desc + '</p>'
    + '</div>';
}

function pbaiTestimonialCard(quote, name, role, colors) {
  return '<div style="background:#f9fafb;border-radius:12px;padding:28px;text-align:left;border-left:4px solid ' + colors.primary + '">'
    + '<p style="font-size:15px;color:#444;line-height:1.65;margin:0 0 16px;font-style:italic">' + quote + '</p>'
    + '<div><strong style="color:' + colors.dark + '">' + name + '</strong><span style="color:#888;font-size:13px"> -- ' + role + '</span></div>'
    + '</div>';
}

function pbaiQA(q, a, colors) {
  return '<div style="border-bottom:1px solid #eee;padding:20px 0">'
    + '<h4 style="font-size:16px;font-weight:600;color:' + colors.dark + ';margin:0 0 8px">' + q + '</h4>'
    + '<p style="font-size:14px;color:#666;line-height:1.65;margin:0">' + a + '</p>'
    + '</div>';
}

// ── HISTORY ──────────────────────────────

function pbaiGetHistory() {
  try { return JSON.parse(localStorage.getItem(PBAI_CACHE_KEY)) || []; }
  catch (e) { return []; }
}

function pbaiSaveHistory(entry) {
  var history = pbaiGetHistory();
  history.unshift(entry);
  if (history.length > 10) history = history.slice(0, 10);
  try { localStorage.setItem(PBAI_CACHE_KEY, JSON.stringify(history)); } catch (e) {}
}

function pbaiLoadFromHistory(index) {
  var history = pbaiGetHistory();
  if (history[index]) {
    var textarea = document.getElementById('pbai-prompt');
    if (textarea) textarea.value = history[index].prompt;
  }
}
