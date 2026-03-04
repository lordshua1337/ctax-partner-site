// ── SCRIPT BUILDER ──────────────────────────────────────────
var sbResults = {};
var _sbCurrentTab = -1;
var _sbAnimating = false;
var _sbTabNames = ['conversation','email','objections','followup'];

// ── TEMPLATE LIBRARY ──────────────────────────────────────
var SB_TEMPLATES = [
  { name: 'Intro Email — CPA Client', icon: 'mail', type: 'CPA / Tax Preparer', style: 'warm and conversational', channel: 'email', relationship: 'long-term client I know well', objection: 'trust — skeptical about tax resolution firms', situation: 'Client owes approximately $25,000 in back taxes from 2020-2022. They mentioned it during our last tax prep meeting but seem overwhelmed and unsure where to start.' },
  { name: 'Cold Call — Mortgage Lead', icon: 'phone', type: 'Mortgage Broker / Loan Officer', style: 'direct and concise', channel: 'phone call', relationship: 'newer client, still building trust', objection: 'cost — they think they can\'t afford it', situation: 'Applicant\'s mortgage was denied due to an IRS tax lien showing on their credit report. Estimated debt around $40,000 across multiple years.' },
  { name: 'Follow-Up — Past Client', icon: 'refresh', type: 'Financial Advisor / Wealth Manager', style: 'formal and professional', channel: 'email', relationship: 'past client reconnecting', objection: 'avoidance — not ready to face the problem', situation: 'Former client reached out about retirement planning but casually mentioned owing the IRS about $18,000. They haven\'t filed in 3 years.' },
  { name: 'Objection Handler — Skeptic', icon: 'shield', type: 'Insurance Agent / Broker', style: 'educational and detailed', channel: 'in-person conversation', relationship: 'long-term client I know well', objection: 'already tried — had a bad experience before', situation: 'Client owes $55,000 and previously hired a tax resolution company that took their money and did nothing. Very skeptical but needs help — garnishment started last month.' },
  { name: 'Text Message — Quick Referral', icon: 'message', type: 'Bookkeeper / Accountant', style: 'warm and conversational', channel: 'text message', relationship: 'long-term client I know well', objection: 'minimizing — doesn\'t think it\'s that serious', situation: 'While doing their books I noticed $12,000 in IRS penalties accumulating. Client brushes it off saying they\'ll handle it but it\'s been 2 years.' },
  { name: 'Debt Counselor Handoff', icon: 'handshake', type: 'Debt Settlement / Credit Counselor', style: 'direct and concise', channel: 'phone call', relationship: 'newer client, still building trust', objection: 'cost — they think they can\'t afford it', situation: 'Client came in for credit card debt settlement but also has $70,000 in IRS debt with active bank levy. They\'re panicking about frozen accounts.' },
  { name: 'Real Estate — Lien Block', icon: 'home', type: 'Real Estate Agent / Broker', style: 'warm and conversational', channel: 'in-person conversation', relationship: 'newer client, still building trust', objection: 'avoidance — not ready to face the problem', situation: 'Seller can\'t close because of a federal tax lien on the property. Estimated IRS debt is $30,000-$45,000. Deal is at risk of falling through.' },
  { name: 'Attorney — Divorce Case', icon: 'scale', type: 'Attorney / Law Firm', style: 'formal and professional', channel: 'email', relationship: 'newer client, still building trust', objection: 'trust — skeptical about tax resolution firms', situation: 'Divorce client discovered their spouse hid $90,000 in unpaid business taxes. Client may qualify for innocent spouse relief. IRS has sent collection notices.' },
  { name: 'Fintech — Platform Alert', icon: 'zap', type: 'Fintech / Lending Platform', style: 'direct and concise', channel: 'email', relationship: 'referred client I haven\'t met yet', objection: 'minimizing — doesn\'t think it\'s that serious', situation: 'User flagged by our system for potential tax debt issues — estimated $15,000-$20,000 based on filed returns showing underpayment. No personal relationship.' },
  { name: 'Warm Intro — Referral Partner', icon: 'users', type: 'Other Financial Professional', style: 'educational and detailed', channel: 'in-person conversation', relationship: 'long-term client I know well', objection: 'cost — they think they can\'t afford it', situation: 'Long-time client just disclosed they owe $35,000 to the IRS and haven\'t filed in 4 years. They\'re self-employed and worried about losing everything.' }
];

function sbShowTemplates() {
  var wrap = document.getElementById('sb-template-library');
  if (!wrap) return;
  var isVisible = wrap.style.display !== 'none';
  wrap.style.display = isVisible ? 'none' : 'block';
  var btn = document.getElementById('sb-templates-toggle');
  if (btn) btn.textContent = isVisible ? 'Use a Template' : 'Hide Templates';
}

function sbUseTemplate(idx) {
  var t = SB_TEMPLATES[idx];
  if (!t) return;
  var fields = {
    'sb-type': t.type,
    'sb-style': t.style,
    'sb-channel': t.channel,
    'sb-situation': t.situation,
    'sb-relationship': t.relationship,
    'sb-objection': t.objection
  };
  Object.keys(fields).forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.value = fields[id];
  });
  // Hide template library after selection
  var wrap = document.getElementById('sb-template-library');
  if (wrap) wrap.style.display = 'none';
  var btn = document.getElementById('sb-templates-toggle');
  if (btn) btn.textContent = 'Use a Template';
  // Show toast
  if (typeof showToast === 'function') showToast('Template loaded — review inputs and generate', 'copied');
}

// ── RECENT RESULTS (shared across all tools) ──────────────
var TOOL_HISTORY_KEY = 'ctax_tool_history';

function saveToolResult(toolName, label, data) {
  try {
    var history = JSON.parse(localStorage.getItem(TOOL_HISTORY_KEY) || '[]');
    history.unshift({
      tool: toolName,
      label: label,
      data: data,
      timestamp: Date.now()
    });
    // Keep max 20 entries across all tools
    if (history.length > 20) history = history.slice(0, 20);
    localStorage.setItem(TOOL_HISTORY_KEY, JSON.stringify(history));
  } catch (e) { /* storage full or unavailable */ }
}

function getToolHistory(toolName) {
  try {
    var history = JSON.parse(localStorage.getItem(TOOL_HISTORY_KEY) || '[]');
    return toolName ? history.filter(function(h) { return h.tool === toolName; }).slice(0, 5) : history.slice(0, 10);
  } catch (e) { return []; }
}

function renderRecentResults(containerId, toolName) {
  var el = document.getElementById(containerId);
  if (!el) return;
  var items = getToolHistory(toolName);
  if (!items.length) {
    el.style.display = 'none';
    return;
  }
  el.style.display = 'block';
  var html = '<div class="rr-header"><div class="rr-title">Recent Results</div></div><div class="rr-list">';
  items.forEach(function(item, i) {
    var ago = timeAgo(item.timestamp);
    html += '<button class="rr-item" onclick="loadRecentResult(\'' + toolName + '\',' + i + ')">'
      + '<div class="rr-item-label">' + esc(item.label) + '</div>'
      + '<div class="rr-item-meta">' + ago + '</div>'
      + '</button>';
  });
  html += '</div>';
  el.innerHTML = html;
}

function timeAgo(ts) {
  var diff = Date.now() - ts;
  var mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return mins + 'm ago';
  var hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  var days = Math.floor(hrs / 24);
  return days + 'd ago';
}

function loadRecentResult(toolName, idx) {
  var items = getToolHistory(toolName);
  var item = items[idx];
  if (!item || !item.data) return;

  if (toolName === 'script-builder' && item.data.results) {
    sbResults = item.data.results;
    document.getElementById('sb-output-meta').textContent = item.data.meta || '';
    document.getElementById('sb-form-wrap').style.display = 'none';
    document.getElementById('sb-loading').style.display = 'none';
    document.getElementById('sb-output').style.display = 'block';
    renderConversation(sbResults.conversation || '', 'out-conversation');
    renderEmail(sbResults.email || '', 'out-email');
    renderObjections(sbResults.objections || '', 'out-objections');
    renderFollowup(sbResults.followup || '', 'out-followup');
    if (sbResults.tips) renderTips(sbResults.tips);
    switchSbTab('conversation');
  }
  if (toolName === 'client-qualifier' && item.data.text) {
    cqAnalysisText = item.data.text;
    // Re-parse and render
    if (typeof showToast === 'function') showToast('Loaded previous result', 'copied');
  }
}

function switchSbTab(tab) {
  var newIdx = _sbTabNames.indexOf(tab);
  if (newIdx < 0 || _sbAnimating) return;

  var tabs = document.querySelectorAll('.sb-tab');
  var oldIdx = _sbCurrentTab;
  var oldPanel = oldIdx >= 0 ? document.getElementById('sbt-' + _sbTabNames[oldIdx]) : null;
  var newPanel = document.getElementById('sbt-' + tab);
  if (!newPanel) return;

  // Update tab buttons
  tabs.forEach(function(t) { t.classList.remove('active'); });
  if (tabs[newIdx]) tabs[newIdx].classList.add('active');

  // No animation for initial display or same tab or reduced motion
  if (oldIdx < 0 || oldIdx === newIdx || prefersReducedMotion) {
    if (oldPanel && oldPanel !== newPanel) {
      oldPanel.style.display = 'none';
      oldPanel.classList.remove('active', 'sb-slide-out-left', 'sb-slide-out-right', 'sb-slide-in-left', 'sb-slide-in-right');
    }
    newPanel.style.display = 'block';
    newPanel.classList.add('active');
    newPanel.classList.remove('sb-slide-out-left', 'sb-slide-out-right', 'sb-slide-in-left', 'sb-slide-in-right');
    _sbCurrentTab = newIdx;
    return;
  }

  // Determine direction: moving right (newIdx > oldIdx) or left
  var goingRight = newIdx > oldIdx;
  var outClass = goingRight ? 'sb-slide-out-left' : 'sb-slide-out-right';
  var inClass = goingRight ? 'sb-slide-in-right' : 'sb-slide-in-left';

  _sbAnimating = true;

  // Slide out old panel
  if (oldPanel) {
    oldPanel.classList.remove('sb-slide-out-left', 'sb-slide-out-right', 'sb-slide-in-left', 'sb-slide-in-right');
    oldPanel.classList.add(outClass);
    oldPanel.addEventListener('animationend', function handler() {
      oldPanel.removeEventListener('animationend', handler);
      oldPanel.style.display = 'none';
      oldPanel.classList.remove('active', outClass);

      // Slide in new panel
      newPanel.style.display = 'block';
      newPanel.classList.add('active', inClass);
      newPanel.addEventListener('animationend', function handler2() {
        newPanel.removeEventListener('animationend', handler2);
        newPanel.classList.remove(inClass);
        _sbAnimating = false;
      });
    });
  }

  _sbCurrentTab = newIdx;
}

function resetScriptBuilder() {
  document.getElementById('sb-form-wrap').style.display='block';
  document.getElementById('sb-output').style.display='none';
  document.getElementById('sb-loading').style.display='none';
  sbResults = {};
  _sbCurrentTab = -1;
  _sbAnimating = false;
}

function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(function(){
    var orig = btn.textContent;
    btn.textContent = '✓ Copied';
    setTimeout(function(){btn.textContent=orig;}, 2000);
    if (typeof showToast === 'function') showToast('Copied to clipboard', 'copied');
  });
}

function copyAllScripts() {
  var btn = document.querySelector('[onclick*="copyAllScripts"]');
  var all = Object.values(sbResults).join('\n\n---\n\n');
  navigator.clipboard.writeText(all).then(function(){
    if (btn) {
      var orig = btn.innerHTML;
      btn.textContent = 'Copied All';
      setTimeout(function(){btn.innerHTML=orig;}, 2000);
    }
    if (typeof showToast === 'function') showToast('All scripts copied', 'copied');
  });
}

function esc(t){ return t.replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// TAB 1: Conversation script only — clean pre-wrap
function renderConversation(text, containerId) {
  var el = document.getElementById(containerId);
  if(!el) return;
  el.innerHTML =
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
      '<div style="font-size:13px;color:var(--slate)">Word-for-word script — use exactly as written or adapt to your voice.</div>' +
      '<button class="sb-copy-btn" onclick="copyText(sbResults.conversation, this)">Copy</button>' +
    '</div>' +
    '<div style="white-space:pre-wrap;font-size:15px;line-height:1.8;color:var(--navy)">' + esc(text) + '</div>';
}

// TAB 2: Email — copy block at top, design rationale below
function renderEmail(text, containerId) {
  var el = document.getElementById(containerId);
  if(!el) return;
  // Split subject from body if present
  var subjectMatch = text.match(/^Subject:\s*(.+?)\n\n/i);
  var subject = subjectMatch ? subjectMatch[1].trim() : '';
  var body = subjectMatch ? text.slice(subjectMatch[0].length).trim() : text.trim();

  el.innerHTML =
    // Copy-ready block
    '<div style="background:#f8fafc;border:1px solid var(--off2);border-radius:10px;padding:24px 28px;margin-bottom:24px;position:relative">' +
      '<button class="sb-copy-btn" onclick="copyText(sbResults.email, this)">Copy</button>' +
      (subject ? '<div style="font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--slate);margin-bottom:6px">Subject</div>' +
        '<div style="font-size:16px;font-weight:600;color:var(--navy);margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid var(--off2)">' + esc(subject) + '</div>' : '') +
      '<div style="white-space:pre-wrap;font-size:15px;line-height:1.85;color:var(--navy)">' + esc(body) + '</div>' +
    '</div>' +
    // Design rationale
    '<div style="background:rgba(11,95,216,0.04);border:1px solid rgba(11,95,216,0.1);border-radius:10px;padding:20px 24px" id="email-rationale-box">' +
      '<div style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--blue);margin-bottom:10px">Why this email works</div>' +
      '<div style="font-size:14px;color:var(--slate);line-height:1.7" id="email-rationale-text">Loading rationale...</div>' +
    '</div>';

  // Generate rationale async
  if(sbResults.emailRationale) {
    document.getElementById('email-rationale-text').textContent = sbResults.emailRationale;
  } else {
    generateEmailRationale(text);
  }
}

function generateEmailRationale(emailText) {
  var type = document.getElementById('sb-type') ? document.getElementById('sb-type').value : '';
  var style = document.getElementById('sb-style') ? document.getElementById('sb-style').value : '';
  fetch(CTAX_API_URL, {
    method: 'POST',
    headers: getApiHeaders(),
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [{role: 'user', content: 'In 3-4 sentences, explain why this referral email is designed to convert for a ' + type + ' with a ' + style + ' style. Focus on: subject line psychology, opening hook, why the CTA works. Be specific, not generic. Just the explanation, no headers.\n\nEmail:\n' + emailText}]
    })
  }).then(function(r){return r.json();}).then(function(d){
    var t = d.content && d.content[0] ? d.content[0].text.trim() : '';
    sbResults.emailRationale = t;
    var el = document.getElementById('email-rationale-text');
    if(el) el.textContent = t;
  }).catch(function(){
    var el = document.getElementById('email-rationale-text');
    if(el) el.textContent = 'The subject line creates curiosity without being clickbait. The opening leads with the client benefit before mentioning Community Tax. The CTA is low-commitment — a conversation, not a sale.';
  });
}

// TAB 3: Objection responses — clean Q&A pairs only
function renderObjections(text, containerId) {
  var el = document.getElementById(containerId);
  if(!el) return;
  var html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">' +
    '<div style="font-size:13px;color:var(--slate)">Three objection/response pairs tailored to your client situation.</div>' +
    '<button class="sb-copy-btn" onclick="copyText(sbResults.objections, this)">Copy All</button>' +
  '</div>';

  var blocks = text.split(/\n(?=\*\*Objection|\*\*Response:|\*\*Q:|\d+\.)/).filter(Boolean);
  // Re-join into pairs
  var pairs = [];
  var raw = text.split(/\*\*Objection:\*\*|\*\*Response:\*\*/).filter(function(s){return s.trim();});
  if(raw.length >= 2) {
    for(var i=0; i<raw.length-1; i+=2) {
      pairs.push({q: raw[i].trim(), a: raw[i+1] ? raw[i+1].trim() : ''});
    }
  }

  if(pairs.length === 0) {
    // Fallback: just show clean pre-wrap
    html += '<div style="white-space:pre-wrap;font-size:15px;line-height:1.8">' + esc(text) + '</div>';
  } else {
    pairs.forEach(function(pair, i){
      html += '<div style="background:var(--white);border:1px solid var(--off2);border-radius:10px;padding:20px 24px;margin-bottom:14px">' +
        '<div style="font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--slate);margin-bottom:8px">Objection ' + (i+1) + '</div>' +
        '<div style="font-size:15px;font-weight:600;color:var(--navy);margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--off2)">' + esc(pair.q) + '</div>' +
        '<div style="font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--blue);margin-bottom:8px">Your Response</div>' +
        '<div style="font-size:15px;color:var(--body);line-height:1.75">' + esc(pair.a) + '</div>' +
      '</div>';
    });
  }
  el.innerHTML = html;
}

// TAB 4: Follow-up — just the message, copy ready
function renderFollowup(text, containerId) {
  var el = document.getElementById(containerId || 'out-followup');
  if(!el) return;
  if(!text) {
    el.innerHTML = '<div style="color:var(--slate);font-size:15px;font-style:italic">Generating follow-up message...</div>';
    return;
  }
  el.innerHTML =
    '<div style="font-size:13px;color:var(--slate);margin-bottom:16px">Send this 5\u20137 days after your initial email if you haven\'t heard back.</div>' +
    '<div style="background:#f8fafc;border:1px solid var(--off2);border-radius:10px;padding:24px 28px;position:relative">' +
      '<button class="sb-copy-btn" onclick="copyText(sbResults.followup, this)">Copy</button>' +
      '<div style="white-space:pre-wrap;font-size:15px;line-height:1.85;color:var(--navy);padding-right:60px">' + esc(text) + '</div>' +
    '</div>';
}

function renderTips(text) {
  // Tips now live inside the conversation tab, not floating outside
  var el = document.getElementById('sb-tips-inner');
  if(!el) return;
  var lines = text.split('\n').filter(function(l){return l.trim();});
  if(!lines.length) return;
  var html = '<div style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--blue);margin-bottom:12px">Delivery Tips</div>';
  lines.forEach(function(line){
    html += '<div class="sb-tip"><div class="sb-tip-dot"></div><div>' + line.replace(/^[-•*]\s*/,'').replace(/</g,'&lt;') + '</div></div>';
  });
  el.innerHTML = html;
}

async function generateScript() {
  if (!CTAX_API_KEY) { if (!promptForApiKey()) { return; } }
  var type = document.getElementById('sb-type').value;
  var style = document.getElementById('sb-style').value;
  var channel = document.getElementById('sb-channel').value;
  var situation = document.getElementById('sb-situation').value.trim();
  var relationship = document.getElementById('sb-relationship').value;
  var objection = document.getElementById('sb-objection').value;

  var missing = [];
  if(!type) missing.push('practice type');
  if(!style) missing.push('communication style');
  if(!channel) missing.push('channel');
  if(!situation) missing.push('client situation');
  if(!relationship) missing.push('relationship');
  if(!objection) missing.push('likely objection');
  if(missing.length) {
    var errEl = document.getElementById('sb-error');
    if(errEl) { errEl.textContent = 'Please fill in: ' + missing.join(', '); errEl.style.display='block'; }
    return;
  }
  var errEl = document.getElementById('sb-error');
  if(errEl) errEl.style.display='none';

  document.getElementById('sb-form-wrap').style.display='none';
  document.getElementById('sb-loading').style.display='block';
  document.getElementById('sb-output').style.display='none';

  var loadingMsgs = [
    'Analyzing your client situation...',
    'Crafting conversation flow...',
    'Writing your email template...',
    'Building objection responses...',
    'Adding final touches...'
  ];
  var msgEl = document.getElementById('sb-loading-msg');
  var msgIdx = 0;
  var msgInterval = setInterval(function(){
    msgIdx = (msgIdx + 1) % loadingMsgs.length;
    msgEl.textContent = loadingMsgs[msgIdx];
  }, 2800);

  var icpBlock = '';
  if (typeof ICPContext !== 'undefined' && ICPContext.hasProfile()) {
    icpBlock = ICPContext.getPromptContext() + '\n\nUse the ICP profile above to tailor scripts to this partner\'s specific client persona, red flags, and conversation style. Reference their ICP insights when relevant.\n\n';
  }

  var prompt = icpBlock + 'You are an expert sales coach for Community Tax, a national IRS tax resolution firm. A partner professional needs referral scripts to introduce their client to Community Tax.\n\n' +
    'PARTNER PROFILE:\n- Professional type: ' + type + '\n- Communication style: ' + style + '\n- Preferred channel: ' + channel + '\n- Client relationship: ' + relationship + '\n\n' +
    'CLIENT SITUATION:\n' + situation + '\n\n' +
    'EXPECTED OBJECTION: ' + objection + '\n\n' +
    'Generate exactly 4 sections separated by "---SECTION---":\n\n' +
    'SECTION 1 - CONVERSATION SCRIPT\nA natural, word-for-word ' + channel + ' script for a ' + style + ' ' + type + ' to introduce Community Tax to this client. Include stage directions in [brackets]. Make it feel human, not salesy. 200-300 words.\n\n' +
    'SECTION 2 - EMAIL TEMPLATE\nComplete ready-to-send email only. Format EXACTLY as:\nSubject: [subject line]\n\n[email body]\nNo commentary, no labels, no explanation. Just the email.\n\n' +
    'SECTION 3 - OBJECTION RESPONSES\nExactly 3 objection/response pairs. Format each EXACTLY as:\n**Objection:** [client says this]\n**Response:** [partner says this]\n\nNothing else — no intro, no outro, just the 3 pairs.\n\n' +
    'SECTION 4 - DELIVERY TIPS\n4-5 short, specific tips for delivering this referral well given this specific situation and client. Plain bullet points, no headers.';

  try {
    var response = await fetch(CTAX_API_URL, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1800,
        messages: [{role: 'user', content: prompt}]
      })
    });
    if(!response.ok) throw new Error(response.status === 401 ? '401' : 'API returned ' + response.status);
    var data = await response.json();
    if(data.error) throw new Error(data.error.message || 'API error');
    var text = data.content && data.content[0] ? data.content[0].text : '';
    if(!text) throw new Error('Empty response');

    clearInterval(msgInterval);

    var sections = text.split('---SECTION---');
    sbResults.conversation = (sections[0] || '').trim();
    sbResults.email = (sections[1] || '').trim();
    sbResults.objections = (sections[2] || '').trim();
    sbResults.tips = (sections[3] || '').trim();
    sbResults.followup = '';

    // Generate follow-up separately for speed
    var fuPrompt = 'Write a short, natural follow-up message (for ' + channel + ') from a ' + type + ' to a client who has been introduced to Community Tax but hasn\'t taken action yet. ' + style + ' tone. Client situation: ' + situation + '. 3-4 sentences max. Just the message text, no labels.';

    fetch(CTAX_API_URL, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{role: 'user', content: fuPrompt}]
      })
    }).then(function(r){return r.json();}).then(function(d){
      sbResults.followup = d.content && d.content[0] ? d.content[0].text.trim() : '';
      renderFollowup(sbResults.followup, 'out-followup');
    });

    // Generate 2 alternative tone variations (async, non-blocking)
    sbResults.variants = { original: { conversation: sbResults.conversation, email: sbResults.email } };
    var altTones = style === 'formal and professional'
      ? ['warm and conversational', 'direct and concise']
      : style === 'warm and conversational'
      ? ['formal and professional', 'direct and concise']
      : style === 'direct and concise'
      ? ['formal and professional', 'warm and conversational']
      : ['formal and professional', 'direct and concise'];

    altTones.forEach(function(altStyle, vi) {
      var varPrompt = icpBlock + 'Rewrite this referral script in a ' + altStyle + ' tone for a ' + type + ' talking to a client via ' + channel + '. Keep the same key points and Community Tax details. 200-300 words. No section labels, just the script.\n\nOriginal script:\n' + sbResults.conversation;
      fetch(CTAX_API_URL, {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 600,
          messages: [{role: 'user', content: varPrompt}]
        })
      }).then(function(r){return r.json();}).then(function(d){
        var altText = d.content && d.content[0] ? d.content[0].text.trim() : '';
        if (altText) {
          sbResults.variants[altStyle] = { conversation: altText };
          renderVariantButtons();
        }
      });
    });

    document.getElementById('sb-output-meta').textContent = type + ' · ' + style + ' · ' + channel;
    document.getElementById('sb-loading').style.display='none';
    document.getElementById('sb-output').style.display='block';

    renderConversation(sbResults.conversation, 'out-conversation');
    renderEmail(sbResults.email, 'out-email');
    renderObjections(sbResults.objections, 'out-objections');
    renderFollowup('', 'out-followup');
    renderTips(sbResults.tips);

    // Track usage
    trackToolUsage('script-builder');

    // Save to recent results
    saveToolResult('script-builder', type + ' · ' + channel, {
      results: { conversation: sbResults.conversation, email: sbResults.email, objections: sbResults.objections, tips: sbResults.tips, followup: '' },
      meta: type + ' · ' + style + ' · ' + channel
    });

    switchSbTab('conversation');

  } catch(err) {
    clearInterval(msgInterval);
    document.getElementById('sb-loading').style.display='none';
    document.getElementById('sb-form-wrap').style.display='block';
    var errEl = document.getElementById('sb-error');
    if(errEl) {
      var isAuth = err.message && (err.message.indexOf('401') !== -1 || err.message.indexOf('API key') !== -1);
      var msg = isAuth
        ? 'Invalid API key. Please check your key and try again.'
        : 'Unable to generate scripts right now. Please try again in a moment.';
      errEl.innerHTML = msg + ' <a href="#" onclick="this.parentElement.style.display=\'none\';return false" style="color:inherit;text-decoration:underline;margin-left:8px">Dismiss</a>';
      errEl.style.display='block';
    }
  }
}
// ── GENERATE FROM ICP ────────────────────────────────────────
function sbFillFromICP() {
  if (typeof ICPContext === 'undefined' || !ICPContext.hasProfile()) {
    if (typeof showToast === 'function') showToast('No ICP profile found. Build one first in the ICP Builder tool.', 'error');
    return;
  }
  var profile = ICPContext.load();
  if (!profile) return;

  // Map profession_type to select value
  var typeMap = {
    'cpa': 'CPA / Tax Preparer',
    'mortgage': 'Mortgage Broker / Loan Officer',
    'financial_advisor': 'Financial Advisor / Wealth Manager',
    'insurance': 'Insurance Agent / Broker',
    'bookkeeper': 'Bookkeeper / Accountant',
    'debt_settlement': 'Debt Settlement / Credit Counselor',
    'real_estate': 'Real Estate Agent / Broker',
    'attorney': 'Attorney / Law Firm',
    'fintech': 'Fintech / Lending Platform'
  };
  var profType = profile.profession_type || '';
  var matchedType = '';
  Object.keys(typeMap).forEach(function(key) {
    if (profType.toLowerCase().indexOf(key) !== -1) matchedType = typeMap[key];
  });
  if (matchedType) {
    var typeEl = document.getElementById('sb-type');
    if (typeEl) typeEl.value = matchedType;
  }

  // Auto-fill situation from ICP red flags
  if (profile.sections && profile.sections.red_flags) {
    var sitEl = document.getElementById('sb-situation');
    if (sitEl && !sitEl.value.trim()) {
      sitEl.value = 'Client fits our ICP profile. Key indicators: ' + profile.sections.red_flags.substring(0, 200);
    }
  }

  if (typeof showToast === 'function') showToast('ICP profile loaded into form', 'copied');
}

// ── TOOL USAGE TRACKER ──────────────────────────────────────
var TOOL_STATS_KEY = 'ctax_tool_stats';

function trackToolUsage(toolName) {
  try {
    var stats = JSON.parse(localStorage.getItem(TOOL_STATS_KEY) || '{}');
    if (!stats[toolName]) stats[toolName] = { count: 0, lastUsed: 0 };
    stats[toolName].count++;
    stats[toolName].lastUsed = Date.now();
    localStorage.setItem(TOOL_STATS_KEY, JSON.stringify(stats));
  } catch (e) { /* storage unavailable */ }
}

function getToolStats() {
  try {
    return JSON.parse(localStorage.getItem(TOOL_STATS_KEY) || '{}');
  } catch (e) { return {}; }
}

function renderToolStats(containerId) {
  var el = document.getElementById(containerId);
  if (!el) return;
  var stats = getToolStats();
  var tools = [
    { key: 'script-builder', label: 'Scripts Generated', icon: 'edit' },
    { key: 'ad-maker', label: 'Ads Created', icon: 'image' },
    { key: 'client-qualifier', label: 'Clients Qualified', icon: 'search' },
    { key: 'knowledge-base', label: 'Questions Asked', icon: 'book' }
  ];
  var html = '<div class="ts-grid">';
  tools.forEach(function(t) {
    var count = stats[t.key] ? stats[t.key].count : 0;
    html += '<div class="ts-card">'
      + '<div class="ts-count">' + count + '</div>'
      + '<div class="ts-label">' + t.label + '</div>'
      + '</div>';
  });
  html += '</div>';
  el.innerHTML = html;
}

// ── TONE VARIANT SWITCHER ────────────────────────────────────
function renderVariantButtons() {
  var container = document.getElementById('sb-variant-bar');
  if (!container || !sbResults.variants) return;
  var keys = Object.keys(sbResults.variants);
  if (keys.length < 2) { container.style.display = 'none'; return; }
  container.style.display = 'flex';

  var toneLabels = {
    'original': 'Original',
    'formal and professional': 'Formal',
    'warm and conversational': 'Warm',
    'direct and concise': 'Direct',
    'educational and detailed': 'Educational'
  };

  var html = '<span class="sb-var-label">Tone:</span>';
  keys.forEach(function(key) {
    var label = toneLabels[key] || key;
    var active = key === (sbResults._activeVariant || 'original') ? ' sb-var-active' : '';
    html += '<button class="sb-var-btn' + active + '" onclick="switchVariant(\'' + key.replace(/'/g, "\\'") + '\')">' + label + '</button>';
  });
  container.innerHTML = html;
}

function switchVariant(key) {
  if (!sbResults.variants || !sbResults.variants[key]) return;
  sbResults._activeVariant = key;
  var v = sbResults.variants[key];
  if (v.conversation) {
    var el = document.getElementById('out-conversation');
    if (el) {
      el.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
          '<div style="font-size:13px;color:var(--slate)">Word-for-word script — use exactly as written or adapt to your voice.</div>' +
          '<button class="sb-copy-btn" onclick="copyText(sbResults.variants[\'' + key.replace(/'/g, "\\'") + '\'].conversation, this)">Copy</button>' +
        '</div>' +
        '<div style="white-space:pre-wrap;font-size:15px;line-height:1.8;color:var(--navy)">' + esc(v.conversation) + '</div>';
    }
  }
  renderVariantButtons();
}

// ── END SCRIPT BUILDER ───────────────────────────────────────
