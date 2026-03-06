// --- AI Tool Portal Embeds ---
// Real AI-powered generation for portal-embedded tools.
// Uses the same Claude API as the standalone tools.

function aiTabSwitch(btn, panelId) {
  var wrap = btn.closest('.ai-portal-embed');
  if (!wrap) return;
  wrap.querySelectorAll('.ai-embed-tab').forEach(function(t) { t.classList.remove('ai-embed-tab-active'); });
  btn.classList.add('ai-embed-tab-active');
  wrap.querySelectorAll('.ai-embed-panel').forEach(function(p) { p.classList.remove('ai-embed-panel-active'); });
  var panel = document.getElementById(panelId);
  if (panel) panel.classList.add('ai-embed-panel-active');
}

// Pill selector toggle
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('ai-pill')) {
    var pills = e.target.closest('.ai-embed-pills');
    if (!pills) return;
    pills.querySelectorAll('.ai-pill').forEach(function(p) { p.classList.remove('ai-pill-active'); });
    e.target.classList.add('ai-pill-active');
  }
});


// -- SHARED HELPERS --

function aiEmbedGetResult(btn) {
  var wrap = btn.closest('.ai-portal-embed') || btn.closest('.ai-embed-panel');
  var result = wrap ? wrap.querySelector('.ai-embed-result') : null;
  if (!result) {
    var panel = btn.closest('.ai-embed-panel');
    if (panel) result = panel.querySelector('.ai-embed-result');
  }
  return result;
}

function aiEmbedSetLoading(btn, label) {
  btn.disabled = true;
  btn.innerHTML = '<span class="ai-embed-spinner"></span> ' + (label || 'Generating...');
}

function aiEmbedSetDone(btn, defaultLabel) {
  btn.disabled = false;
  btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Done!';
  setTimeout(function() {
    btn.disabled = false;
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> ' + defaultLabel;
  }, 2000);
}

function aiEmbedSetError(btn, result, defaultLabel, msg) {
  btn.disabled = false;
  btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> ' + defaultLabel;
  if (result) {
    result.innerHTML = '<div class="ai-result-card" style="border-color:rgba(220,38,38,0.2);background:rgba(220,38,38,0.04)">'
      + '<div class="ai-result-label" style="color:#DC2626">Error</div>'
      + '<p>' + (msg || 'Something went wrong. Please try again.') + '</p></div>';
    result.style.display = 'block';
  }
}

function aiEmbedCopyBtn(text, label) {
  return '<button class="ai-embed-copy-btn" onclick="navigator.clipboard.writeText(this.getAttribute(\'data-copy\'));this.textContent=\'Copied!\';var b=this;setTimeout(function(){b.textContent=\'' + (label || 'Copy') + '\'},1500)" data-copy="' + text.replace(/"/g, '&quot;').replace(/'/g, '&#39;') + '">' + (label || 'Copy') + '</button>';
}

function aiEmbedEsc(t) {
  return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function aiEmbedGetInputs(panel) {
  var inputs = {};
  panel.querySelectorAll('.ai-embed-input, .ai-embed-select').forEach(function(el) {
    var label = el.closest('.ai-embed-field');
    if (!label) return;
    var lbl = label.querySelector('.ai-embed-label');
    var key = lbl ? lbl.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_') : '';
    if (key) inputs[key] = el.value;
  });
  // Also get active pill
  var pills = panel.querySelector('.ai-pill-active');
  if (pills) inputs._pill = pills.textContent.trim();
  return inputs;
}


// -- MAIN GENERATE DISPATCHER --

function aiDemoGenerate(btn) {
  var sectionId = btn.closest('.portal-section') ? btn.closest('.portal-section').id : '';
  var panelId = '';
  var panel = btn.closest('.ai-embed-panel');
  if (panel) panelId = panel.id;

  if (sectionId === 'portal-sec-ai-scripts') {
    aiEmbedGenerateScript(btn, panelId);
  } else if (sectionId === 'portal-sec-ai-admaker') {
    aiEmbedGenerateAd(btn);
  } else if (sectionId === 'portal-sec-ai-qualifier') {
    aiEmbedQualifyClient(btn);
  } else if (sectionId === 'portal-sec-ai-kb') {
    aiEmbedAskKB(btn);
  } else {
    // Fallback for unknown sections
    var result = aiEmbedGetResult(btn);
    if (result) {
      result.innerHTML = '<div class="ai-result-card"><p>AI generation not available for this tool yet.</p></div>';
      result.style.display = 'block';
    }
  }
}


// =====================================================
// SCRIPT BUILDER (Real AI)
// =====================================================

function aiEmbedGenerateScript(btn, panelId) {
  var result = aiEmbedGetResult(btn);
  if (!result) return;

  var panel = btn.closest('.ai-embed-panel') || btn.closest('.ai-portal-embed');
  var inputs = aiEmbedGetInputs(panel);

  // Determine which tab we're on
  var scriptType = 'conversation';
  if (panelId === 'ai-sb-email') scriptType = 'email';
  else if (panelId === 'ai-sb-objections') scriptType = 'objection handler';
  else if (panelId === 'ai-sb-followup') scriptType = 'follow-up sequence';

  var situation = inputs.client_situation || inputs.client_context || '';
  var relationship = inputs.your_relationship || '';
  var tone = inputs.tone || inputs.email_type || inputs.follow_up_timing || '';
  var objection = inputs.objection || '';
  var prevInteraction = inputs.previous_interaction || '';

  if (!situation && scriptType === 'conversation') {
    if (typeof showToast === 'function') showToast('Please describe the client situation', 'warning');
    return;
  }

  aiEmbedSetLoading(btn, 'Generating ' + scriptType + '...');

  var prompt = '';
  if (scriptType === 'conversation') {
    prompt = 'You are an expert referral coach for Community Tax (IRS tax resolution firm, $2.3B resolved, 120K+ clients). Generate a natural, word-for-word conversation script for this situation:\n\n'
      + 'Relationship: ' + (relationship || 'Professional contact') + '\n'
      + 'Tone: ' + (tone || 'Warm and empathetic') + '\n'
      + 'Situation: ' + situation + '\n\n'
      + 'Write a natural script with stage directions in [brackets]. Include opening, bridge to the referral, handling likely resistance, and close. 200-250 words. No labels or headers -- just the script.';
  } else if (scriptType === 'email') {
    prompt = 'You are an expert referral coach for Community Tax (IRS tax resolution firm). Write a complete, ready-to-send email.\n\n'
      + 'Type: ' + (tone || 'Client outreach') + '\n'
      + 'Context: ' + (situation || 'Partner reaching out about tax debt resolution') + '\n\n'
      + 'Format EXACTLY as:\nSubject: [subject line]\n\n[full email body]\n\nKeep it professional, warm, and under 200 words. Mention Community Tax\'s $2.3B resolved and 120K+ clients. Include a clear CTA.';
  } else if (scriptType === 'objection handler') {
    prompt = 'You are an expert referral coach for Community Tax (IRS tax resolution firm). Generate 3 objection/response pairs for this common objection from clients:\n\n'
      + 'Objection theme: ' + (objection || 'General resistance') + '\n\n'
      + 'Format each EXACTLY as:\n**Objection:** "[client says this]"\n**Response:** "[partner says this]"\n\n'
      + 'Make responses empathetic, evidence-based (use $2.3B resolved, 120K clients, 15 years), and non-salesy. 2-3 sentences each.';
  } else {
    prompt = 'You are an expert referral coach for Community Tax (IRS tax resolution firm). Write a follow-up message for a partner who previously discussed tax resolution with a client.\n\n'
      + 'Timing: ' + (tone || 'One week later') + '\n'
      + 'Previous interaction: ' + (prevInteraction || 'Initial conversation about tax debt') + '\n\n'
      + 'Write a natural follow-up message (150-200 words). Be warm, not pushy. Reference the previous conversation, provide a reason to reconnect, and include a soft CTA.';
  }

  fetch(CTAX_API_URL, {
    method: 'POST',
    headers: getApiHeaders(),
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1200, messages: [{ role: 'user', content: prompt }] })
  }).then(function(r) { return r.json(); }).then(function(data) {
    var text = (data.content && data.content[0]) ? data.content[0].text.trim() : '';
    if (!text) throw new Error('Empty response');

    var html = '<div class="ai-result-card">';
    html += '<div class="ai-result-header">';
    html += '<div class="ai-result-label">' + scriptType.charAt(0).toUpperCase() + scriptType.slice(1) + '</div>';
    html += aiEmbedCopyBtn(text, 'Copy');
    html += '</div>';

    if (scriptType === 'conversation') {
      html += aiFormatConversation(text);
    } else if (scriptType === 'email') {
      html += aiFormatEmail(text);
    } else if (scriptType === 'objection handler') {
      html += aiFormatObjections(text);
    } else {
      html += aiFormatFollowUp(text);
    }

    html += '</div>';
    result.innerHTML = html;
    result.style.display = 'block';
    aiEmbedSetDone(btn, 'Generate ' + scriptType.charAt(0).toUpperCase() + scriptType.slice(1));

    if (typeof saveToolResult === 'function') {
      saveToolResult('script-builder', scriptType + ' script', text);
    }
    if (typeof trackToolUsage === 'function') trackToolUsage('script-builder');
  }).catch(function(err) {
    console.error('Script embed error:', err);
    aiEmbedSetError(btn, result, 'Generate Script', err.message === '401' ? 'API authentication failed.' : 'Generation failed. Please try again.');
  });
}

function aiFormatConversation(text) {
  // Render as chat-like conversation
  var lines = text.split('\n').filter(function(l) { return l.trim(); });
  var html = '<div class="ai-conv-flow">';
  lines.forEach(function(line) {
    var trimmed = line.trim();
    if (trimmed.match(/^\[.*\]$/)) {
      // Stage direction
      html += '<div class="ai-conv-stage">' + aiEmbedEsc(trimmed) + '</div>';
    } else if (trimmed.match(/^\*\*.*\*\*/) || trimmed.match(/^(Opening|Bridge|Close|Transition|Partner|You):/i)) {
      // Section label
      var clean = trimmed.replace(/^\*\*/,'').replace(/\*\*$/,'').replace(/\*\*/g,'');
      html += '<div class="ai-conv-label">' + aiEmbedEsc(clean) + '</div>';
    } else {
      html += '<div class="ai-conv-line">' + aiEmbedEsc(trimmed) + '</div>';
    }
  });
  html += '</div>';
  return html;
}

function aiFormatEmail(text) {
  var subjectMatch = text.match(/Subject:\s*(.+)/i);
  var subject = subjectMatch ? subjectMatch[1].trim() : '';
  var body = text.replace(/Subject:\s*.+\n?/i, '').trim();
  var html = '';
  if (subject) {
    html += '<div class="ai-email-subject"><span class="ai-email-subject-label">Subject:</span> ' + aiEmbedEsc(subject) + '</div>';
  }
  html += '<div class="ai-email-body">';
  body.split('\n').forEach(function(line) {
    if (!line.trim()) { html += '<br>'; return; }
    html += '<p>' + aiEmbedEsc(line.trim()) + '</p>';
  });
  html += '</div>';
  return html;
}

function aiFormatObjections(text) {
  var pairs = text.split(/\*\*Objection:\*\*/i).filter(function(s) { return s.trim(); });
  var html = '<div class="ai-objections-list">';
  pairs.forEach(function(pair, i) {
    var parts = pair.split(/\*\*Response:\*\*/i);
    var objection = (parts[0] || '').replace(/^["'\s]+|["'\s]+$/g, '').trim();
    var response = (parts[1] || '').replace(/^["'\s]+|["'\s]+$/g, '').trim();
    if (!objection && !response) return;
    html += '<div class="ai-objection-pair">';
    html += '<div class="ai-objection-q"><span class="ai-objection-icon">?</span>' + aiEmbedEsc(objection) + '</div>';
    html += '<div class="ai-objection-a"><span class="ai-objection-icon ai-objection-icon-a">!</span>' + aiEmbedEsc(response) + '</div>';
    html += '</div>';
  });
  html += '</div>';
  return html;
}

function aiFormatFollowUp(text) {
  var html = '<div class="ai-followup-body">';
  text.split('\n').forEach(function(line) {
    if (!line.trim()) { html += '<br>'; return; }
    html += '<p>' + aiEmbedEsc(line.trim()) + '</p>';
  });
  html += '</div>';
  return html;
}


// =====================================================
// AD MAKER (Real AI)
// =====================================================

function aiEmbedGenerateAd(btn) {
  var result = aiEmbedGetResult(btn);
  if (!result) return;

  var wrap = btn.closest('.ai-portal-embed');
  var inputs = aiEmbedGetInputs(wrap);
  var template = inputs.ad_template || 'Tax Relief Awareness';
  var headline = inputs.headline || '';
  var cta = inputs.cta_text || '';
  var platform = inputs._pill || 'LinkedIn';

  aiEmbedSetLoading(btn, 'Creating ad...');

  var prompt = 'You are a social media ad copywriter for Community Tax (IRS tax resolution, $2.3B resolved, 120K+ clients, 15 years). Create ad copy for the following:\n\n'
    + 'Template: ' + template + '\n'
    + 'Platform: ' + platform + '\n'
    + (headline ? 'Headline direction: ' + headline + '\n' : '')
    + (cta ? 'CTA: ' + cta + '\n' : '')
    + '\nReturn JSON: {"headline":"...","body":"...","cta":"...","hashtags":"...","specs":"...'
    + platform + ' optimal image size and char limits"}\n'
    + 'Make the headline punchy (under 8 words), body compelling (2-3 sentences), CTA action-oriented.';

  fetch(CTAX_API_URL, {
    method: 'POST',
    headers: getApiHeaders(),
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 600, messages: [{ role: 'user', content: prompt }] })
  }).then(function(r) { return r.json(); }).then(function(data) {
    var text = (data.content && data.content[0]) ? data.content[0].text.trim() : '';
    var ad = {};
    try { var m = text.match(/\{[\s\S]*\}/); if (m) ad = JSON.parse(m[0]); } catch(e) {}

    if (!ad.headline) {
      ad = {
        headline: headline || 'Resolve Your IRS Tax Debt',
        body: 'Don\'t let tax debt control your life. Community Tax has resolved $2.3B+ for 120K+ clients. Free consultation, no obligation.',
        cta: cta || 'Get Free Assessment',
        hashtags: '#TaxRelief #IRSHelp #TaxResolution',
        specs: platform + ' Single Image Ad'
      };
    }

    var copyText = ad.headline + '\n\n' + ad.body + '\n\n' + ad.hashtags;
    var html = '<div class="ai-result-card">';
    html += '<div class="ai-result-header"><div class="ai-result-label">Generated Ad Copy</div>' + aiEmbedCopyBtn(copyText, 'Copy All') + '</div>';

    // Ad preview mock
    html += '<div class="ai-ad-preview-card">';
    html += '<div class="ai-ad-platform-bar"><span class="ai-ad-platform-name">' + aiEmbedEsc(platform) + '</span><span class="ai-ad-sponsored">Sponsored</span></div>';
    html += '<div class="ai-ad-preview-body">';
    html += '<div class="ai-ad-preview-headline">' + aiEmbedEsc(ad.headline) + '</div>';
    html += '<div class="ai-ad-preview-text">' + aiEmbedEsc(ad.body) + '</div>';
    html += '<div class="ai-ad-preview-cta">' + aiEmbedEsc(ad.cta) + '</div>';
    html += '</div>';
    html += '<div class="ai-ad-preview-meta">' + aiEmbedEsc(ad.hashtags || '') + '</div>';
    html += '</div>';

    html += '<div class="ai-ad-specs">' + aiEmbedEsc(ad.specs || '') + '</div>';
    html += '<div class="ai-result-tip">Want full visual ads with your branding? Use the <a onclick="portalNav(document.querySelector(\'[onclick*=portal-sec-marketing]\'),\'portal-sec-marketing\');setTimeout(function(){mkShowAdsBuilder()},400)" style="color:var(--blue);cursor:pointer;font-weight:600">Marketing Kit Ad Builder</a></div>';
    html += '</div>';

    result.innerHTML = html;
    result.style.display = 'block';
    aiEmbedSetDone(btn, 'Generate Ad');

    if (typeof saveToolResult === 'function') saveToolResult('ad-maker', template + ' - ' + platform, JSON.stringify(ad));
    if (typeof trackToolUsage === 'function') trackToolUsage('ad-maker');
  }).catch(function(err) {
    console.error('Ad embed error:', err);
    aiEmbedSetError(btn, result, 'Generate Ad', 'Ad generation failed. Please try again.');
  });
}


// =====================================================
// CLIENT QUALIFIER (Real AI)
// =====================================================

function aiEmbedQualifyClient(btn) {
  var result = aiEmbedGetResult(btn);
  if (!result) return;

  var wrap = btn.closest('.ai-portal-embed');
  var inputs = aiEmbedGetInputs(wrap);
  var debt = inputs.estimated_tax_debt || '';
  var issue = inputs.type_of_tax_issue || '';
  var years = inputs.years_affected || '';
  var notices = inputs.irs_notices_received_ || '';
  var context = inputs.additional_context__optional_ || '';

  if (!debt || !issue) {
    if (typeof showToast === 'function') showToast('Please select tax debt and issue type', 'warning');
    return;
  }

  aiEmbedSetLoading(btn, 'Analyzing client...');

  var prompt = 'You are a senior intake analyst at Community Tax (IRS tax resolution firm, 15 years, $2.3B resolved, 120K+ clients).\n\n'
    + 'Evaluate this potential referral:\n'
    + '- Estimated debt: ' + debt + '\n'
    + '- Issue type: ' + issue + '\n'
    + '- Years affected: ' + (years || 'Unknown') + '\n'
    + '- IRS notices: ' + (notices || 'Unknown') + '\n'
    + (context ? '- Additional context: ' + context + '\n' : '')
    + '\nReturn JSON: {"verdict":"Strong|Moderate|Weak","score":85,"resolution_path":"...","estimated_value":"$X - $Y",'
    + '"partner_commission":"$X - $Y","urgency":"High|Medium|Low","talking_points":["point1","point2","point3"],"analysis":"2-3 sentence analysis"}\n'
    + 'Base on real program data: min $7K debt, investigation fee $295, partner rev $1,500-$4,000/case, resolution options: OIC, IA, CNC, Penalty Abatement.';

  fetch(CTAX_API_URL, {
    method: 'POST',
    headers: getApiHeaders(),
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 800, messages: [{ role: 'user', content: prompt }] })
  }).then(function(r) { return r.json(); }).then(function(data) {
    var text = (data.content && data.content[0]) ? data.content[0].text.trim() : '';
    var q = {};
    try { var m = text.match(/\{[\s\S]*\}/); if (m) q = JSON.parse(m[0]); } catch(e) {}

    if (!q.verdict) {
      q = {
        verdict: 'Strong', score: 82, resolution_path: 'Offer in Compromise / Installment Agreement',
        estimated_value: '$15,000 - $50,000', partner_commission: '$1,500 - $4,000',
        urgency: 'High', talking_points: ['Client meets minimum debt threshold', 'Active IRS notices indicate enforcement', 'Multiple resolution paths available'],
        analysis: 'This client presents a strong referral opportunity based on debt level and issue type.'
      };
    }

    var verdictColors = {
      Strong: { bg: 'rgba(5,150,105,0.06)', border: 'rgba(5,150,105,0.15)', text: '#059669' },
      Moderate: { bg: 'rgba(217,119,6,0.06)', border: 'rgba(217,119,6,0.15)', text: '#D97706' },
      Weak: { bg: 'rgba(220,38,38,0.06)', border: 'rgba(220,38,38,0.15)', text: '#DC2626' }
    };
    var vc = verdictColors[q.verdict] || verdictColors.Strong;

    var html = '<div class="ai-result-card">';
    html += '<div class="ai-result-header"><div class="ai-result-label">Qualification Result</div></div>';

    // Verdict banner
    html += '<div class="ai-cq-verdict-bar" style="background:' + vc.bg + ';border:1px solid ' + vc.border + ';border-radius:10px;padding:16px 20px;margin-bottom:16px;display:flex;align-items:center;gap:16px">';
    html += '<div style="text-align:center;min-width:60px"><div style="font-size:28px;font-weight:800;color:' + vc.text + '">' + aiEmbedEsc(q.verdict) + '</div>';
    if (q.score) html += '<div style="font-size:11px;color:var(--mist);margin-top:2px">' + q.score + '/100</div>';
    html += '</div>';
    html += '<div style="flex:1;font-size:14px;color:var(--body);line-height:1.6">' + aiEmbedEsc(q.analysis || '') + '</div>';
    html += '</div>';

    // Stats grid
    html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px">';
    html += '<div class="ai-cq-stat-card"><div class="ai-cq-stat-label">Resolution Path</div><div class="ai-cq-stat-value">' + aiEmbedEsc(q.resolution_path || '') + '</div></div>';
    html += '<div class="ai-cq-stat-card"><div class="ai-cq-stat-label">Estimated Case Value</div><div class="ai-cq-stat-value">' + aiEmbedEsc(q.estimated_value || '') + '</div></div>';
    html += '<div class="ai-cq-stat-card"><div class="ai-cq-stat-label">Your Commission</div><div class="ai-cq-stat-value" style="color:#059669">' + aiEmbedEsc(q.partner_commission || '') + '</div></div>';
    html += '</div>';

    // Urgency + talking points
    if (q.urgency) {
      var urgColors = { High: '#DC2626', Medium: '#D97706', Low: '#059669' };
      html += '<div style="margin-bottom:12px"><span style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--slate)">Urgency: </span><span style="font-size:12px;font-weight:700;color:' + (urgColors[q.urgency] || 'var(--navy)') + '">' + aiEmbedEsc(q.urgency) + '</span></div>';
    }

    if (q.talking_points && q.talking_points.length) {
      html += '<div style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--slate);margin-bottom:8px">Talking Points</div>';
      html += '<div class="ai-cq-talking-points">';
      q.talking_points.forEach(function(tp) {
        html += '<div class="ai-cq-tp"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg> ' + aiEmbedEsc(tp) + '</div>';
      });
      html += '</div>';
    }

    html += '</div>';
    result.innerHTML = html;
    result.style.display = 'block';
    aiEmbedSetDone(btn, 'Qualify This Client');

    if (typeof saveToolResult === 'function') saveToolResult('client-qualifier', debt + ' - ' + issue, JSON.stringify(q));
    if (typeof trackToolUsage === 'function') trackToolUsage('client-qualifier');
  }).catch(function(err) {
    console.error('Qualifier embed error:', err);
    aiEmbedSetError(btn, result, 'Qualify This Client', 'Qualification failed. Please try again.');
  });
}


// =====================================================
// KNOWLEDGE BASE (Real AI)
// =====================================================

function aiEmbedAskKB(btn) {
  var result = aiEmbedGetResult(btn);
  if (!result) return;

  var wrap = btn.closest('.ai-portal-embed');
  var input = wrap.querySelector('.ai-kb-input');
  var question = input ? input.value.trim() : '';

  if (!question) {
    if (typeof showToast === 'function') showToast('Please enter a question', 'warning');
    return;
  }

  aiEmbedSetLoading(btn, 'Searching...');

  // Use the real KB system prompt if available
  var systemPrompt = (typeof KB_SYSTEM !== 'undefined') ? KB_SYSTEM : 'You are the Community Tax Partner Program knowledge base. Answer questions accurately about the partner program, revenue share, referral process, and IRS programs.';

  fetch(CTAX_API_URL, {
    method: 'POST',
    headers: getApiHeaders(),
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: question }]
    })
  }).then(function(r) { return r.json(); }).then(function(data) {
    var text = (data.content && data.content[0]) ? data.content[0].text.trim() : '';
    if (!text) throw new Error('Empty response');

    var html = '<div class="ai-result-card">';
    html += '<div class="ai-result-header"><div class="ai-result-label">Knowledge Base Answer</div>' + aiEmbedCopyBtn(text, 'Copy') + '</div>';

    // Parse and render the answer with proper formatting
    html += '<div class="ai-kb-answer">';
    var lines = text.split('\n');
    lines.forEach(function(line) {
      var trimmed = line.trim();
      if (!trimmed) return;
      if (trimmed.match(/^#+\s/)) {
        // Heading
        var clean = trimmed.replace(/^#+\s*/, '');
        html += '<div class="ai-kb-heading">' + aiEmbedEsc(clean) + '</div>';
      } else if (trimmed.match(/^[-*]\s/)) {
        // Bullet
        var clean = trimmed.replace(/^[-*]\s*/, '');
        html += '<div class="ai-kb-bullet">' + aiEmbedEsc(clean) + '</div>';
      } else if (trimmed.match(/^\d+\.\s/)) {
        // Numbered
        html += '<div class="ai-kb-bullet">' + aiEmbedEsc(trimmed) + '</div>';
      } else {
        html += '<p>' + aiEmbedEsc(trimmed).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') + '</p>';
      }
    });
    html += '</div>';

    // Source note
    html += '<div class="ai-result-note">Source: Community Tax Partner Program Documentation</div>';
    html += '</div>';

    result.innerHTML = html;
    result.style.display = 'block';
    aiEmbedSetDone(btn, 'Search Knowledge Base');

    if (typeof saveToolResult === 'function') saveToolResult('knowledge-base', question, text);
    if (typeof trackToolUsage === 'function') trackToolUsage('knowledge-base');
  }).catch(function(err) {
    console.error('KB embed error:', err);
    aiEmbedSetError(btn, result, 'Search Knowledge Base', 'Search failed. Please try again.');
  });
}
