// ══════════════════════════════════════════
//  M2P3C3: AI WRITING ASSISTANT
//  Contextual writing panel with real-time
//  AI suggestions, tone control, templates,
//  version history, and multi-format export
// ══════════════════════════════════════════

var AWR_STORAGE_KEY = 'ctax_ai_writer';
var AWR_HISTORY_KEY = 'ctax_ai_writer_history';

var AWR_TONES = [
  { id: 'professional', label: 'Professional', desc: 'Formal, authoritative, trust-building' },
  { id: 'conversational', label: 'Conversational', desc: 'Warm, friendly, approachable' },
  { id: 'urgent', label: 'Urgent', desc: 'Time-sensitive, action-driving' },
  { id: 'educational', label: 'Educational', desc: 'Informative, teaching-focused' },
  { id: 'empathetic', label: 'Empathetic', desc: 'Understanding, supportive, caring' }
];

var AWR_AUDIENCES = [
  { id: 'partner', label: 'Referral Partner', desc: 'CPAs, attorneys, financial advisors' },
  { id: 'client', label: 'End Client', desc: 'Taxpayer with IRS issues' },
  { id: 'prospect', label: 'Cold Prospect', desc: 'No existing relationship' },
  { id: 'internal', label: 'Internal Team', desc: 'Training materials, SOPs' }
];

var AWR_TYPES = [
  { id: 'email', label: 'Email', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6' },
  { id: 'script', label: 'Phone Script', icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z' },
  { id: 'social', label: 'Social Post', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
  { id: 'ad', label: 'Ad Copy', icon: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0' },
  { id: 'blog', label: 'Blog Post', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8' },
  { id: 'sms', label: 'SMS / Text', icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' },
  { id: 'letter', label: 'Formal Letter', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 002 2h2a2 2 0 002-2 M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { id: 'landing', label: 'Landing Page', icon: 'M3 3h18v18H3z M3 9h18 M9 21V9' },
  { id: 'presentation', label: 'Slide Deck', icon: 'M2 3h20v14H2z M8 21l4-4 4 4' },
  { id: 'freeform', label: 'Freeform', icon: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z' }
];

var AWR_STARTERS = [
  { label: 'Partner Introduction Email', prompt: 'Write an introductory email to a potential referral partner (CPA, attorney, or financial advisor) explaining the Community Tax referral program. Include the $295 investigation fee, average client savings, and partner benefits.', type: 'email', tone: 'professional', audience: 'partner' },
  { label: 'Client Outreach Script', prompt: 'Write a phone script for calling a client who mentioned owing the IRS during a recent meeting. Be empathetic, explain tax resolution simply, and suggest the $295 investigation as next step.', type: 'script', tone: 'empathetic', audience: 'client' },
  { label: 'Tax Season Social Post', prompt: 'Write a LinkedIn post about how financial professionals can help clients who owe the IRS. Include a stat about tax debt, the referral program benefits, and a call to action.', type: 'social', tone: 'professional', audience: 'partner' },
  { label: 'Urgency Follow-Up Email', prompt: 'Write a follow-up email to a prospect who has not responded to the initial outreach. Create urgency around growing IRS penalties and the benefits of acting now.', type: 'email', tone: 'urgent', audience: 'prospect' },
  { label: 'Educational Blog Post', prompt: 'Write a blog post explaining the 4 main IRS resolution programs: Offer in Compromise, Installment Agreement, Currently Not Collectible, and Penalty Abatement. Target financial professionals who want to understand what happens after they refer a client.', type: 'blog', tone: 'educational', audience: 'partner' },
  { label: 'Client Success SMS', prompt: 'Write 3 SMS text message variations to let a past client know about tax resolution services. Keep each under 160 characters. Include a way to respond.', type: 'sms', tone: 'conversational', audience: 'client' },
  { label: 'Webinar Invite Email', prompt: 'Write an email inviting referral partners to a live webinar about "How to Earn $500+ Per Tax Resolution Referral". Include date placeholder, topics covered, and registration CTA.', type: 'email', tone: 'professional', audience: 'partner' },
  { label: 'Objection Handler Guide', prompt: 'Write a guide addressing the top 5 client objections to tax resolution: cost concerns, skepticism about firms, thinking it is not serious, already tried before, and not ready to face the problem. Include response scripts for each.', type: 'freeform', tone: 'educational', audience: 'internal' }
];

// ── MAIN PANEL ──────────────────────────────────────

function awrShowWriter() {
  var existing = document.getElementById('awr-overlay');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.id = 'awr-overlay';
  overlay.className = 'awr-overlay';
  overlay.innerHTML = '<div class="awr-panel">' +
    '<div class="awr-sidebar" id="awr-sidebar"></div>' +
    '<div class="awr-main">' +
      '<div class="awr-toolbar" id="awr-toolbar"></div>' +
      '<div class="awr-editor-wrap" id="awr-editor-wrap"></div>' +
    '</div>' +
  '</div>';

  document.body.appendChild(overlay);
  requestAnimationFrame(function() { overlay.classList.add('awr-visible'); });

  awrRenderSidebar();
  awrRenderToolbar();
  awrRenderEditor();
  awrLoadDraft();
}

function awrClose() {
  awrSaveDraft();
  var overlay = document.getElementById('awr-overlay');
  if (overlay) {
    overlay.classList.remove('awr-visible');
    setTimeout(function() { overlay.remove(); }, 250);
  }
}

// ── SIDEBAR ────────────────────────────────────────

function awrRenderSidebar() {
  var sidebar = document.getElementById('awr-sidebar');
  if (!sidebar) return;

  var html = '<div class="awr-side-header">' +
    '<h3 class="awr-side-title">AI Writer</h3>' +
    '<button class="awr-side-close" onclick="awrClose()">&times;</button>' +
  '</div>';

  // Content type selector
  html += '<div class="awr-side-section">';
  html += '<div class="awr-side-label">Content Type</div>';
  html += '<div class="awr-type-grid">';
  for (var i = 0; i < AWR_TYPES.length; i++) {
    var t = AWR_TYPES[i];
    html += '<button class="awr-type-btn' + (i === 0 ? ' awr-type-active' : '') + '" data-type="' + t.id + '" onclick="awrSetType(this,\'' + t.id + '\')" title="' + t.label + '">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="' + t.icon + '"/></svg>' +
      '<span>' + t.label + '</span>' +
    '</button>';
  }
  html += '</div></div>';

  // Tone selector
  html += '<div class="awr-side-section">';
  html += '<div class="awr-side-label">Tone</div>';
  html += '<div class="awr-tone-list">';
  for (var j = 0; j < AWR_TONES.length; j++) {
    var tone = AWR_TONES[j];
    html += '<label class="awr-tone-opt" for="awr-tone-' + tone.id + '">' +
      '<input type="radio" name="awr-tone" id="awr-tone-' + tone.id + '" value="' + tone.id + '"' + (j === 0 ? ' checked' : '') + '>' +
      '<span class="awr-tone-label">' + tone.label + '</span>' +
    '</label>';
  }
  html += '</div></div>';

  // Audience selector
  html += '<div class="awr-side-section">';
  html += '<div class="awr-side-label">Audience</div>';
  html += '<select id="awr-audience" class="awr-select">';
  for (var k = 0; k < AWR_AUDIENCES.length; k++) {
    var aud = AWR_AUDIENCES[k];
    html += '<option value="' + aud.id + '">' + aud.label + ' -- ' + aud.desc + '</option>';
  }
  html += '</select></div>';

  // Length control
  html += '<div class="awr-side-section">';
  html += '<div class="awr-side-label">Length</div>';
  html += '<div class="awr-length-btns">';
  html += '<button class="awr-len-btn" data-len="short" onclick="awrSetLength(this,\'short\')">Short</button>';
  html += '<button class="awr-len-btn awr-len-active" data-len="medium" onclick="awrSetLength(this,\'medium\')">Medium</button>';
  html += '<button class="awr-len-btn" data-len="long" onclick="awrSetLength(this,\'long\')">Long</button>';
  html += '</div></div>';

  // Quick starters
  html += '<div class="awr-side-section">';
  html += '<div class="awr-side-label">Quick Starters</div>';
  html += '<div class="awr-starters">';
  for (var s = 0; s < AWR_STARTERS.length; s++) {
    html += '<button class="awr-starter-btn" onclick="awrUseStarter(' + s + ')">' + AWR_STARTERS[s].label + '</button>';
  }
  html += '</div></div>';

  // Version history
  html += '<div class="awr-side-section">';
  html += '<div class="awr-side-label">Saved Drafts</div>';
  html += '<div id="awr-drafts-list" class="awr-drafts-list"></div>';
  html += '</div>';

  sidebar.innerHTML = html;
  awrRenderDraftsList();
}

function awrSetType(btn, typeId) {
  document.querySelectorAll('.awr-type-btn').forEach(function(b) { b.classList.remove('awr-type-active'); });
  btn.classList.add('awr-type-active');
  window._awrType = typeId;
}

function awrSetLength(btn, len) {
  document.querySelectorAll('.awr-len-btn').forEach(function(b) { b.classList.remove('awr-len-active'); });
  btn.classList.add('awr-len-active');
  window._awrLength = len;
}

function awrUseStarter(idx) {
  var starter = AWR_STARTERS[idx];
  if (!starter) return;

  // Set prompt
  var promptEl = document.getElementById('awr-prompt');
  if (promptEl) promptEl.value = starter.prompt;

  // Set type
  var typeBtn = document.querySelector('.awr-type-btn[data-type="' + starter.type + '"]');
  if (typeBtn) awrSetType(typeBtn, starter.type);

  // Set tone
  var toneRadio = document.getElementById('awr-tone-' + starter.tone);
  if (toneRadio) toneRadio.checked = true;

  // Set audience
  var audSelect = document.getElementById('awr-audience');
  if (audSelect) audSelect.value = starter.audience;

  if (typeof showToast === 'function') showToast('Starter loaded -- hit Generate', 'copied');
}

// ── TOOLBAR ────────────────────────────────────────

function awrRenderToolbar() {
  var toolbar = document.getElementById('awr-toolbar');
  if (!toolbar) return;

  toolbar.innerHTML = '<div class="awr-tb-left">' +
    '<button class="awr-tb-btn" onclick="awrAiRewrite(\'shorter\')" title="Make shorter">Shorter</button>' +
    '<button class="awr-tb-btn" onclick="awrAiRewrite(\'longer\')" title="Make longer">Longer</button>' +
    '<button class="awr-tb-btn" onclick="awrAiRewrite(\'punchier\')" title="More impactful">Punchier</button>' +
    '<button class="awr-tb-btn" onclick="awrAiRewrite(\'simpler\')" title="Simplify language">Simpler</button>' +
    '<button class="awr-tb-btn" onclick="awrAiRewrite(\'formal\')" title="More formal">Formal</button>' +
    '<button class="awr-tb-btn" onclick="awrAiRewrite(\'casual\')" title="More casual">Casual</button>' +
  '</div>' +
  '<div class="awr-tb-right">' +
    '<span class="awr-word-count" id="awr-word-count">0 words</span>' +
    '<button class="awr-tb-btn awr-tb-copy" onclick="awrCopyOutput()">Copy</button>' +
    '<button class="awr-tb-btn awr-tb-export" onclick="awrExportPdf()">PDF</button>' +
    '<button class="awr-tb-btn awr-tb-save" onclick="awrSaveVersion()">Save</button>' +
  '</div>';
}

// ── EDITOR ──────────────────────────────────────────

function awrRenderEditor() {
  var wrap = document.getElementById('awr-editor-wrap');
  if (!wrap) return;

  wrap.innerHTML = '<div class="awr-prompt-row">' +
    '<textarea id="awr-prompt" class="awr-prompt" placeholder="Describe what you want to write. Be specific about the topic, purpose, and any details to include..." rows="3"></textarea>' +
    '<button class="awr-generate-btn" onclick="awrGenerate()" id="awr-gen-btn">Generate</button>' +
  '</div>' +
  '<div class="awr-output-area">' +
    '<textarea id="awr-output" class="awr-output" placeholder="Your AI-generated content will appear here. You can also type or paste content directly and use the toolbar buttons to refine it." rows="18"></textarea>' +
  '</div>' +
  '<div class="awr-suggestions" id="awr-suggestions"></div>';

  // Word count listener
  var output = document.getElementById('awr-output');
  if (output) {
    output.addEventListener('input', awrUpdateWordCount);
  }
}

function awrUpdateWordCount() {
  var output = document.getElementById('awr-output');
  var counter = document.getElementById('awr-word-count');
  if (!output || !counter) return;
  var text = output.value.trim();
  var words = text ? text.split(/\s+/).length : 0;
  counter.textContent = words + ' word' + (words !== 1 ? 's' : '');
}

// ── GENERATE ──────────────────────────────────────

async function awrGenerate() {
  var promptEl = document.getElementById('awr-prompt');
  var outputEl = document.getElementById('awr-output');
  var genBtn = document.getElementById('awr-gen-btn');
  if (!promptEl || !outputEl) return;

  var prompt = promptEl.value.trim();
  if (!prompt) {
    if (typeof showToast === 'function') showToast('Enter a prompt describing what you want to write', 'error');
    return;
  }

  var type = window._awrType || 'email';
  var length = window._awrLength || 'medium';
  var toneRadio = document.querySelector('input[name="awr-tone"]:checked');
  var tone = toneRadio ? toneRadio.value : 'professional';
  var audSelect = document.getElementById('awr-audience');
  var audience = audSelect ? audSelect.value : 'partner';

  var typeObj = AWR_TYPES.find(function(t) { return t.id === type; });
  var toneObj = AWR_TONES.find(function(t) { return t.id === tone; });
  var audObj = AWR_AUDIENCES.find(function(a) { return a.id === audience; });

  // Length mapping
  var lengthGuide = { short: '100-200 words', medium: '300-500 words', long: '700-1000 words' };

  if (genBtn) { genBtn.textContent = 'Generating...'; genBtn.disabled = true; }
  outputEl.value = 'Generating content...';

  var apiAvailable = typeof CTAX_API_URL !== 'undefined' && typeof getApiHeaders === 'function';
  var result = '';

  if (apiAvailable) {
    try {
      // Get ICP context if available
      var icpContext = '';
      try {
        var saved = localStorage.getItem('bp_saved_inputs');
        if (saved) {
          var icp = JSON.parse(saved);
          icpContext = '\n\nPartner context: ' + (icp.practiceType || '') + ', ' + (icp.practiceLabel || '') + ' practice.';
        }
      } catch (e) {}

      var systemPrompt = 'You are an expert marketing copywriter for Community Tax, a tax resolution company. You write content for their referral partner program, helping partners (CPAs, attorneys, financial advisors) bring in clients who owe the IRS.\n\n' +
        'Content type: ' + (typeObj ? typeObj.label : type) + '\n' +
        'Tone: ' + (toneObj ? toneObj.label + ' -- ' + toneObj.desc : tone) + '\n' +
        'Target audience: ' + (audObj ? audObj.label + ' -- ' + audObj.desc : audience) + '\n' +
        'Target length: ' + (lengthGuide[length] || '300-500 words') + '\n' +
        icpContext + '\n\n' +
        'Key facts you can reference:\n' +
        '- Community Tax has resolved 10,000+ cases\n' +
        '- Average client saves $8,400\n' +
        '- BBB A+ rated, 4.8 star reviews\n' +
        '- Investigation fee is $295 (transparent, upfront)\n' +
        '- Partners earn $500+ per qualified referral\n' +
        '- Programs: Offer in Compromise, Installment Agreement, Currently Not Collectible, Penalty Abatement\n' +
        '- 1 in 6 Americans owes the IRS\n\n' +
        'Write the content directly. Do not include meta-commentary. Use markdown formatting (bold, headers, bullets) where appropriate.';

      var resp = await fetch(CTAX_API_URL, {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2500,
          system: systemPrompt,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      var data = await resp.json();
      if (data.content && data.content[0] && data.content[0].text) {
        result = data.content[0].text;
      }
    } catch (e) {
      // Fall through to fallback
    }
  }

  if (!result) {
    result = awrGetFallback(type, tone, audience, prompt);
  }

  outputEl.value = result;
  awrUpdateWordCount();
  awrShowSuggestions(type, tone);

  if (genBtn) { genBtn.textContent = 'Generate'; genBtn.disabled = false; }

  // Auto-save draft
  awrSaveDraft();
}

// ── AI REWRITE ──────────────────────────────────────

async function awrAiRewrite(direction) {
  var outputEl = document.getElementById('awr-output');
  if (!outputEl || !outputEl.value.trim()) {
    if (typeof showToast === 'function') showToast('Generate or type content first', 'error');
    return;
  }

  var current = outputEl.value.trim();
  var apiAvailable = typeof CTAX_API_URL !== 'undefined' && typeof getApiHeaders === 'function';

  if (!apiAvailable) {
    if (typeof showToast === 'function') showToast('AI rewrite requires API connection', 'error');
    return;
  }

  var instructions = {
    shorter: 'Make this content significantly shorter while keeping the key message and CTA. Cut filler words, remove redundant points, and tighten every sentence.',
    longer: 'Expand this content with more detail, examples, and supporting points. Add depth without being repetitive. Maintain the same tone and structure.',
    punchier: 'Rewrite this to be more impactful and memorable. Use stronger verbs, shorter sentences, and more compelling language. Make every word count.',
    simpler: 'Simplify this content. Use shorter words, simpler sentence structures, and a more accessible reading level. A 6th grader should understand it.',
    formal: 'Rewrite in a more formal, professional tone. Use proper business language, avoid contractions, and maintain a dignified register.',
    casual: 'Rewrite in a more casual, conversational tone. Use contractions, shorter sentences, and a friendly voice. Like talking to a colleague.'
  };

  // Show loading state
  var originalText = outputEl.value;
  outputEl.value = 'Rewriting (' + direction + ')...';

  try {
    var resp = await fetch(CTAX_API_URL, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2500,
        messages: [{
          role: 'user',
          content: instructions[direction] + '\n\nContent to rewrite:\n\n' + current.substring(0, 3000)
        }]
      })
    });

    var data = await resp.json();
    if (data.content && data.content[0] && data.content[0].text) {
      outputEl.value = data.content[0].text;
      awrUpdateWordCount();
      if (typeof showToast === 'function') showToast('Rewritten (' + direction + ')', 'copied');
    } else {
      outputEl.value = originalText;
    }
  } catch (e) {
    outputEl.value = originalText;
    if (typeof showToast === 'function') showToast('Rewrite failed -- try again', 'error');
  }
}

// ── SUGGESTIONS ────────────────────────────────────

function awrShowSuggestions(type, tone) {
  var sugEl = document.getElementById('awr-suggestions');
  if (!sugEl) return;

  var suggestions = [];

  if (type === 'email') {
    suggestions = [
      'Add a P.S. line with a secondary CTA or personal touch',
      'Try A/B testing 2-3 subject line variations',
      'Include a specific number or stat in the first line to hook attention',
      'End with a question to encourage reply'
    ];
  } else if (type === 'script') {
    suggestions = [
      'Add pause markers [pause] for natural delivery',
      'Include 2-3 objection responses inline',
      'Start with a pattern interrupt to grab attention',
      'End with a clear next step (not "let me know")'
    ];
  } else if (type === 'social') {
    suggestions = [
      'Lead with a surprising stat or question',
      'Use line breaks for readability on mobile',
      'Include 3-5 relevant hashtags for discovery',
      'Add a clear CTA at the end (link, DM, comment)'
    ];
  } else if (type === 'ad') {
    suggestions = [
      'Test urgency vs. aspiration in your headline',
      'Keep Google ads under 30-char headline / 90-char description',
      'Use numbers and specifics ("$8,400 saved" vs. "save money")',
      'Include social proof (10,000+ cases, BBB A+)'
    ];
  } else if (type === 'blog') {
    suggestions = [
      'Add internal links to related resources',
      'Include a meta description for SEO (under 160 chars)',
      'Break up long sections with subheadings every 200-300 words',
      'End with a clear CTA and link to partner signup'
    ];
  } else {
    suggestions = [
      'Read it aloud to check flow and natural language',
      'Cut any sentence that does not advance the message',
      'Replace jargon with plain language where possible',
      'Add a specific CTA -- never leave the reader wondering "now what?"'
    ];
  }

  var html = '<div class="awr-sug-label">Writing Tips</div>';
  for (var i = 0; i < suggestions.length; i++) {
    html += '<div class="awr-sug-item">' + awrEsc(suggestions[i]) + '</div>';
  }

  sugEl.innerHTML = html;
}

// ── COPY & EXPORT ──────────────────────────────────

function awrCopyOutput() {
  var output = document.getElementById('awr-output');
  if (!output || !output.value.trim()) {
    if (typeof showToast === 'function') showToast('Nothing to copy', 'error');
    return;
  }
  if (navigator.clipboard) {
    navigator.clipboard.writeText(output.value).then(function() {
      if (typeof showToast === 'function') showToast('Copied to clipboard', 'copied');
    });
  }
}

function awrExportPdf() {
  var output = document.getElementById('awr-output');
  if (!output || !output.value.trim()) {
    if (typeof showToast === 'function') showToast('Nothing to export', 'error');
    return;
  }

  var type = window._awrType || 'email';
  var typeObj = AWR_TYPES.find(function(t) { return t.id === type; });
  var label = typeObj ? typeObj.label : 'Content';

  var el = document.createElement('div');
  el.style.cssText = 'padding:40px;max-width:700px;margin:0 auto;font-family:Georgia,serif;color:#1a1a1a';
  el.innerHTML = '<div style="text-align:center;padding:30px 0;border-bottom:2px solid #0B5FD8;margin-bottom:30px">' +
    '<h1 style="font-size:24px;color:#0B5FD8;margin:0">' + awrEsc(label) + '</h1>' +
    '<p style="color:#666;margin:8px 0 0;font-size:14px">Generated by Community Tax AI Writing Assistant</p>' +
    '<p style="color:#999;margin:4px 0 0;font-size:12px">' + new Date().toLocaleDateString() + '</p>' +
  '</div>' +
  '<div style="line-height:1.8;font-size:15px;white-space:pre-wrap">' + awrEsc(output.value) + '</div>';

  CTAX_PDF.exportElement(el, 'ctax-' + type + '.pdf');
}

// ── DRAFT & VERSION SYSTEM ─────────────────────────

function awrSaveDraft() {
  var prompt = document.getElementById('awr-prompt');
  var output = document.getElementById('awr-output');
  if (!prompt || !output) return;

  var draft = {
    prompt: prompt.value || '',
    output: output.value || '',
    type: window._awrType || 'email',
    length: window._awrLength || 'medium',
    timestamp: Date.now()
  };

  try { localStorage.setItem(AWR_STORAGE_KEY, JSON.stringify(draft)); } catch (e) {}
}

function awrLoadDraft() {
  try {
    var draft = JSON.parse(localStorage.getItem(AWR_STORAGE_KEY));
    if (draft) {
      var prompt = document.getElementById('awr-prompt');
      var output = document.getElementById('awr-output');
      if (prompt && draft.prompt) prompt.value = draft.prompt;
      if (output && draft.output) output.value = draft.output;
      if (draft.type) {
        var btn = document.querySelector('.awr-type-btn[data-type="' + draft.type + '"]');
        if (btn) awrSetType(btn, draft.type);
      }
      if (draft.length) {
        var lenBtn = document.querySelector('.awr-len-btn[data-len="' + draft.length + '"]');
        if (lenBtn) awrSetLength(lenBtn, draft.length);
      }
      awrUpdateWordCount();
    }
  } catch (e) {}
}

function awrSaveVersion() {
  var output = document.getElementById('awr-output');
  var prompt = document.getElementById('awr-prompt');
  if (!output || !output.value.trim()) {
    if (typeof showToast === 'function') showToast('Nothing to save', 'error');
    return;
  }

  var type = window._awrType || 'email';
  var typeObj = AWR_TYPES.find(function(t) { return t.id === type; });

  var version = {
    title: (typeObj ? typeObj.label : type) + ' -- ' + new Date().toLocaleDateString(),
    prompt: prompt ? prompt.value : '',
    output: output.value,
    type: type,
    timestamp: Date.now()
  };

  try {
    var history = JSON.parse(localStorage.getItem(AWR_HISTORY_KEY) || '[]');
    history.unshift(version);
    if (history.length > 20) history = history.slice(0, 20);
    localStorage.setItem(AWR_HISTORY_KEY, JSON.stringify(history));
  } catch (e) {}

  awrRenderDraftsList();
  if (typeof showToast === 'function') showToast('Version saved', 'copied');
}

function awrRenderDraftsList() {
  var list = document.getElementById('awr-drafts-list');
  if (!list) return;

  try {
    var history = JSON.parse(localStorage.getItem(AWR_HISTORY_KEY) || '[]');
    if (history.length === 0) {
      list.innerHTML = '<div class="awr-no-drafts">No saved versions yet</div>';
      return;
    }

    var html = '';
    for (var i = 0; i < Math.min(history.length, 8); i++) {
      html += '<div class="awr-draft-item" onclick="awrLoadVersion(' + i + ')">' +
        '<span class="awr-draft-title">' + awrEsc(history[i].title) + '</span>' +
        '<span class="awr-draft-date">' + awrTimeAgo(history[i].timestamp) + '</span>' +
      '</div>';
    }
    list.innerHTML = html;
  } catch (e) {
    list.innerHTML = '<div class="awr-no-drafts">No saved versions yet</div>';
  }
}

function awrLoadVersion(idx) {
  try {
    var history = JSON.parse(localStorage.getItem(AWR_HISTORY_KEY) || '[]');
    if (history[idx]) {
      var v = history[idx];
      var prompt = document.getElementById('awr-prompt');
      var output = document.getElementById('awr-output');
      if (prompt) prompt.value = v.prompt || '';
      if (output) output.value = v.output || '';
      if (v.type) {
        var btn = document.querySelector('.awr-type-btn[data-type="' + v.type + '"]');
        if (btn) awrSetType(btn, v.type);
      }
      awrUpdateWordCount();
      if (typeof showToast === 'function') showToast('Version loaded', 'copied');
    }
  } catch (e) {}
}

// ── FALLBACK ──────────────────────────────────────

function awrGetFallback(type, tone, audience, prompt) {
  var templates = {
    email: 'Subject: Quick question about your tax-burdened clients\n\nHi [Name],\n\nI am reaching out because I work with a program that helps financial professionals like you assist clients who are dealing with IRS tax issues.\n\nHere is what makes this different:\n\n- Your clients get a transparent $295 investigation -- no surprises\n- Average savings of $8,400 through proven resolution programs\n- You earn $500+ for every qualified referral\n- 10,000+ cases successfully resolved (BBB A+ rated)\n\nThe truth is, many of your clients are quietly dealing with IRS problems. They are embarrassed to bring it up. When you can offer a solution, you become more than their [professional type] -- you become the person who changed their financial life.\n\nWould it be worth a 10-minute call this week to see how this fits your practice?\n\nBest regards,\n[Your Name]\n\nP.S. Our most active partners refer 3-5 clients per month and earn $1,500-$2,500 in additional revenue. Happy to share case studies if helpful.',

    script: 'PHONE SCRIPT: Tax Resolution Referral Conversation\n\n[OPENING]\n"Hi [Name], this is [Your Name]. Thanks for taking my call. I wanted to talk to you about something I have been hearing from a lot of my clients lately -- IRS tax issues. Do you have a minute?"\n\n[DISCOVERY]\n"The reason I bring it up is that about 1 in 6 Americans owes back taxes, and most people do not realize there are legitimate programs to resolve it. Have you been getting any IRS notices or are you aware of any outstanding tax debt?"\n\n[IF YES - EXPLORE]\n"I appreciate you sharing that. Can I ask -- roughly how much do you think you owe? And how long has this been going on?"\n\n[IF NO - PLANT SEED]\n"That is great to hear. But if anyone in your circle ever mentions IRS issues, I want you to know I have a resource that can help. Can I send you some info to keep on file?"\n\n[TRANSITION]\n"Here is what I recommend as a next step. There is a $295 investigation where a team of enrolled agents and tax attorneys pulls your IRS transcripts and shows you exactly what your options are. No surprises, no pressure. Most clients end up saving 50-80% of what they owe."\n\n[OBJECTION: TOO EXPENSIVE]\n"I understand the concern. Think of it this way -- the $295 gets you a full picture of your situation and your options. Most clients save thousands. And the longer you wait, the more penalties and interest pile up. This is actually the most cost-effective first step."\n\n[OBJECTION: SKEPTICAL]\n"That is a totally fair concern. This company has resolved over 10,000 cases, has a BBB A+ rating, and 4.8 stars from real clients. I would not recommend them if I had not done my homework."\n\n[CLOSE]\n"So here is what I would suggest -- let me connect you with the team for a no-obligation conversation. They can review your situation and give you a clear picture of your options. Can I set that up for you?"',

    social: 'LINKEDIN POST:\n\nHere is something most financial professionals miss:\n\n1 in 6 of your clients owes the IRS.\n\nThey will not tell you about it. They are embarrassed. They think nothing can be done.\n\nBut when you can connect them with a team that has resolved 10,000+ cases and saves clients an average of $8,400...\n\nYou are not just their advisor anymore. You are the person who changed their financial life.\n\nIf you are a CPA, attorney, or financial advisor interested in helping clients with IRS issues (and earning $500+ per referral), I would love to connect.\n\nDrop a comment or DM me for details.\n\n#TaxResolution #ReferralPartners #FinancialAdvisors #CPAs #IRSDebt\n\n---\n\nFACEBOOK POST:\n\nDid you know that 1 in 6 Americans owes money to the IRS?\n\nIf that includes you or someone you know, here are the facts:\n\n- You might qualify to settle for less than you owe\n- Payment plans are available for any budget\n- Penalties can often be reduced or removed\n- The IRS offers programs most people do not know about\n\nOur team has helped 10,000+ people resolve their tax debt. The first step is a transparent $295 investigation.\n\nComment HELP or DM for details. No judgment, just solutions.\n\n---\n\nX (TWITTER) POST:\n\nOwing the IRS feels hopeless. But it is not.\n\n10,000+ cases resolved. Average savings of $8,400. BBB A+ rated.\n\nIf you or someone you know needs help with tax debt, DMs are open.\n\nThe first step is just $295.',

    ad: 'GOOGLE ADS:\n\nAd 1 (Partner-Focused):\nHeadline: Earn $500+ Per Tax Resolution Referral\nDescription: CPAs, attorneys, and advisors are earning extra revenue by referring clients with IRS issues. No license needed. 10,000+ cases resolved. BBB A+ rated.\nCTA: Learn More\n\nAd 2 (Client-Focused):\nHeadline: Owe the IRS? Resolve Your Tax Debt\nDescription: Most clients save 50-80% on what they owe. Transparent $295 investigation. No surprises. Enrolled agents negotiate directly with the IRS.\nCTA: Get Free Assessment\n\nAd 3 (Urgency):\nHeadline: IRS Penalties Growing Daily?\nDescription: Every day you wait, your tax debt increases. Our team has resolved 10,000+ cases with avg savings of $8,400. Start with $295 investigation.\nCTA: Stop the Clock\n\n---\n\nFACEBOOK ADS:\n\nAd 1:\nHeadline: Your Clients Are Hiding Something\nBody: 1 in 6 Americans owes the IRS. As a financial professional, you can help them AND earn referral fees. Our partner program handles everything.\nCTA: Learn More\n\nAd 2:\nHeadline: Owe Back Taxes? Here Is Your Way Out\nBody: 10,000+ people have resolved their IRS debt through our programs. Average savings: $8,400. Start with a $295 investigation -- no surprises.\nCTA: See If You Qualify\n\n---\n\nLINKEDIN ADS:\n\nAd 1:\nHeadline: Add Tax Resolution to Your Practice\nBody: Financial professionals are earning $500+ per referral by connecting clients with tax resolution experts. No additional licensing. Free training provided.\nCTA: Request Partner Kit',

    blog: '# How to Help Your Clients Resolve IRS Tax Debt (A Guide for Financial Professionals)\n\nAs a financial professional, you have likely encountered clients who owe money to the IRS. Maybe it came up during tax preparation. Maybe it surfaced during a mortgage application. Or maybe you noticed it in their financial statements.\n\nThe question is: what did you do about it?\n\nIf the answer is "nothing," you are not alone. Most professionals do not know how to help clients with tax resolution. But the opportunity is significant -- both for your clients and for your practice.\n\n## The Scale of the Problem\n\nAccording to IRS data, Americans collectively owe over $114 billion in unpaid taxes. That is not just corporations and wealthy tax evaders. It is everyday people:\n\n- Self-employed individuals who fell behind on quarterly payments\n- People who went through a divorce, job loss, or medical emergency\n- Small business owners with payroll tax issues\n- Retirees who did not plan for taxes on distributions\n\nStatistically, 1 in 6 Americans owes the IRS. That means several of your clients are dealing with this right now.\n\n## Understanding Tax Resolution Programs\n\nThe IRS offers several legitimate programs to resolve tax debt:\n\n**Offer in Compromise (OIC):** Settling the full debt for a reduced amount. The IRS considers your ability to pay, income, expenses, and asset equity.\n\n**Installment Agreement:** Monthly payment plans that stop collection actions. Available for almost anyone who owes.\n\n**Currently Not Collectible (CNC):** If a taxpayer truly cannot pay, the IRS can pause all collection activity. This stops levies, garnishments, and liens.\n\n**Penalty Abatement:** The IRS can reduce or eliminate penalties for first-time offenders or those with reasonable cause.\n\n## How the Referral Process Works\n\nYou do not need to become a tax expert. A referral partnership works like this:\n\n1. Client mentions IRS issues during a meeting\n2. You make a warm introduction to the resolution team\n3. The team handles everything from there\n4. Client gets professional help, you earn a referral fee\n\nThe engagement starts with a $295 investigation. During this phase, enrolled agents pull IRS transcripts, analyze the situation, and present all available options.\n\n## Results That Speak for Themselves\n\n- 10,000+ cases successfully resolved\n- Average client savings of $8,400\n- BBB A+ rating with 4.8-star average reviews\n- Partners earn $500+ per qualified referral\n\n## Getting Started\n\nIf you are a CPA, attorney, financial advisor, mortgage broker, or any professional who encounters clients with tax issues, a referral partnership could be a valuable addition to your practice.\n\nYou help your clients. You earn referral fees. Everyone wins.\n\n[Contact us to learn more about our referral partner program.]',

    sms: 'SMS 1 (Intro):\nHi [Name], this is [Your Name]. I work with a team that helps people resolve IRS tax debt. If you or anyone you know needs help, I can make an intro. Reply YES for details.\n\nSMS 2 (Value):\nQuick FYI: our tax resolution partners have saved clients avg $8,400 on IRS debt. Most people qualify for relief but do not know it. Reply INFO to learn more.\n\nSMS 3 (Urgency):\nIRS penalties grow daily. If you have been putting off dealing with tax debt, acting now can save thousands. Free 5-min call available. Reply HELP to start.',

    letter: '[Your Letterhead]\n[Date]\n\n[Recipient Name]\n[Title]\n[Company]\n[Address]\n\nDear [Mr./Ms. Last Name],\n\nI am writing to introduce you to a referral partnership opportunity that I believe would be of significant value to your practice and your clients.\n\nAs a fellow financial professional, you are likely aware that approximately one in six Americans carries some form of outstanding IRS tax debt. Many of these individuals are clients of professionals like us -- people who trust us with their financial well-being but may be reluctant to discuss their tax issues.\n\nCommunity Tax has developed a referral partner program specifically designed for professionals in our field. The program allows you to connect clients who have IRS issues with a team of enrolled agents and tax attorneys who specialize in tax resolution.\n\nHere is how the process works:\n\n1. When a client mentions IRS issues, you make a warm introduction.\n2. The Community Tax team conducts a comprehensive $295 investigation.\n3. They present the client with all available resolution options.\n4. Resolution is implemented, and your client receives professional advocacy throughout the process.\n\nThe results have been substantial: over 10,000 cases resolved, with average client savings exceeding $8,400. The company holds a BBB A+ rating and maintains a 4.8-star average from verified client reviews.\n\nFor your practice, each qualified referral generates $500 or more in referral compensation, with no cap on the number of referrals.\n\nI would welcome the opportunity to discuss this program with you in greater detail. Please feel free to contact me at [phone] or [email] at your convenience.\n\nSincerely,\n\n[Your Name]\n[Title]\n[Contact Information]',

    video: 'VIDEO SCRIPT: Why Financial Pros Are Adding Tax Resolution (60 sec)\n\n[0:00-0:10] HOOK\n"If 1 in 6 of your clients owes the IRS, what are you doing about it? Most financial professionals say: nothing. Here is why that is a mistake."\n\n[0:10-0:25] PROBLEM\n"Your clients trust you. But they are not telling you everything. Tax debt is one of the most common -- and most hidden -- financial problems in America. Over $114 billion in unpaid taxes. And the penalties grow every single day."\n\n[0:25-0:40] SOLUTION\n"Our partner program gives you a simple answer. When a client mentions IRS issues, you make an introduction. Our team of enrolled agents and tax attorneys handles everything from there. Average savings: $8,400 per client."\n\n[0:40-0:55] PROOF + BENEFIT\n"10,000 cases resolved. BBB A-plus rated. And you earn $500 or more for every qualified referral. No licensing required. No risk. Just a better way to serve your clients."\n\n[0:55-1:00] CTA\n"Click the link to schedule a 10-minute partner call. It might be the best business decision you make this year."',

    newsletter: 'DID YOU KNOW?\n\nOne in six Americans owes money to the IRS. That means several of your clients -- or people in your network -- are quietly dealing with tax debt right now.\n\nThe good news? There are legitimate IRS programs that can help:\n\n-- Offer in Compromise: Settle for less than you owe\n-- Installment Agreements: Affordable monthly payment plans\n-- Penalty Abatement: Reduce or eliminate IRS penalties\n-- Currently Not Collectible: Pause collections if you cannot pay\n\nOur tax resolution team has helped 10,000+ people navigate these programs, with average savings of $8,400 per case.\n\nThe first step is always a transparent $295 investigation -- no surprises, no pressure. Just a clear picture of your options.\n\n[Learn More About Tax Resolution ->]',

    landing: '# Resolve Your IRS Tax Debt\n\nStop the stress. Stop the penalties. Start your fresh start.\n\n[HERO SECTION]\nHeadline: Owe the IRS? There Is a Way Forward.\nSubheadline: 10,000+ cases resolved. Average savings of $8,400. BBB A+ rated.\nCTA: Get Your Free Assessment\n\n[TRUST BAR]\nBBB A+ Rated | 10,000+ Cases Resolved | 4.8 Star Reviews | Enrolled Agents & Tax Attorneys\n\n[HOW IT WORKS]\n1. Free Assessment -- Tell us about your situation (5 minutes)\n2. $295 Investigation -- We pull your IRS transcripts and analyze options\n3. Resolution Plan -- Your dedicated team negotiates with the IRS\n4. Fresh Start -- Resolve your debt and move forward with confidence\n\n[PROGRAMS]\n-- Offer in Compromise: Settle for less than you owe\n-- Installment Agreement: Affordable monthly payments\n-- Penalty Abatement: Reduce or remove IRS penalties\n-- Currently Not Collectible: Pause collections\n\n[TESTIMONIAL]\n"I owed $45,000 to the IRS and thought my life was over. The team helped me settle for $12,000 and set up a payment plan I could actually afford. I wish I had called sooner." -- Former Client\n\n[FAQ SECTION]\nQ: How much does it cost?\nA: The investigation is $295. Resolution fees depend on your case.\n\nQ: Will this stop IRS collection?\nA: In most cases, yes. Once we are engaged, we communicate with the IRS on your behalf.\n\n[FINAL CTA]\nEvery day you wait, penalties and interest grow. Take the first step today.\n[Get Your Free Assessment]',

    presentation: 'SLIDE DECK: Tax Resolution Referral Partnership\n\nSLIDE 1 -- TITLE\nTax Resolution Referral Partnership\nHelp your clients. Grow your practice. Earn referral fees.\n\nSLIDE 2 -- THE PROBLEM\n1 in 6 Americans owes the IRS\n$114B+ in unpaid taxes nationwide\nYour clients are dealing with this silently\nPenalties grow 0.5-1% every month they wait\n\nSLIDE 3 -- THE OPPORTUNITY\nMost financial professionals have no answer for clients with IRS issues\nThis creates a gap in your service offering\nClients go elsewhere -- or worse, do nothing\nYou can fill this gap without becoming a tax expert\n\nSLIDE 4 -- HOW IT WORKS\n1. Client mentions IRS issues\n2. You make a warm introduction\n3. Our team handles everything\n4. Client gets resolution, you earn referral fee\n\nSLIDE 5 -- THE INVESTIGATION ($295)\nEnrolled agents pull IRS transcripts\nFull analysis of tax situation\nAll available options presented\nNo surprises, no pressure\nTypical turnaround: 2-4 weeks\n\nSLIDE 6 -- RESOLUTION PROGRAMS\nOffer in Compromise -- settle for less\nInstallment Agreement -- monthly payments\nCurrently Not Collectible -- pause collections\nPenalty Abatement -- reduce penalties\nInnocent Spouse Relief -- separate liability\n\nSLIDE 7 -- RESULTS\n10,000+ cases resolved\nAverage savings: $8,400\nBBB A+ rating\n4.8 star average reviews\n\nSLIDE 8 -- PARTNER BENEFITS\n$500+ per qualified referral\nNo cap on referrals\nNo licensing required\nFree training and materials\nDedicated partner support\n\nSLIDE 9 -- WHO PARTNERS WITH US\nCPAs and Tax Preparers\nAttorneys and Law Firms\nFinancial Advisors\nMortgage Brokers\nInsurance Agents\nReal Estate Professionals\nDebt Counselors\n\nSLIDE 10 -- NEXT STEPS\nSchedule a 10-minute partner call\nReceive your partner kit\nStart referring clients\nGet paid for every qualified referral\n\n[Contact: partners@communitytax.com]',

    freeform: 'TAX RESOLUTION OVERVIEW\n\nWhat is Tax Resolution?\nTax resolution is the process of working with the IRS to resolve outstanding tax debt. This can include negotiating settlements, setting up payment plans, reducing penalties, or pausing collections.\n\nWho Needs It?\nAnyone who owes the IRS more than they can comfortably pay. This includes individuals with back taxes, unfiled returns, wage garnishments, bank levies, or tax liens.\n\nHow Does It Work?\n\n1. Investigation Phase ($295)\n- Enrolled agents pull official IRS transcripts\n- Full analysis of tax situation and compliance history\n- All available resolution options identified\n- Client receives a clear picture of their situation\n\n2. Resolution Phase\n- Dedicated team negotiates with the IRS\n- Appropriate program(s) selected and pursued\n- Client receives ongoing updates and advocacy\n- Resolution typically takes 3-9 months\n\nAvailable Programs:\n- Offer in Compromise: Settle debt for less than owed\n- Installment Agreement: Affordable monthly payments\n- Currently Not Collectible: Pause all IRS collections\n- Penalty Abatement: Reduce or eliminate penalties\n- Innocent Spouse Relief: Separate liability in divorce cases\n- Wage Garnishment Release: Stop paycheck deductions\n- Bank Levy Release: Unfreeze bank accounts\n- Lien Subordination: Allow property sales despite liens\n\nResults:\n- 10,000+ cases successfully resolved\n- Average client saves $8,400\n- BBB A+ rating, 4.8 star reviews\n- Team includes enrolled agents and tax attorneys'
  };

  return templates[type] || templates.freeform;
}

// ── UTILITIES ──────────────────────────────────────

function awrEsc(str) {
  if (!str) return '';
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function awrTimeAgo(ts) {
  if (!ts) return '';
  var diff = Date.now() - ts;
  var mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  var hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  var days = Math.floor(hrs / 24);
  return days + 'd ago';
}
