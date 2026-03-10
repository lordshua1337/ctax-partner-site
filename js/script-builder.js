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

  // Parse text into chat-style bubbles
  var lines = text.split('\n');
  var bubbles = [];
  var currentSpeaker = '';
  var currentLines = [];

  lines.forEach(function(line) {
    var trimmed = line.trim();
    if (!trimmed) return;

    // Detect stage directions [like this]
    if (/^\[.*\]$/.test(trimmed)) {
      if (currentLines.length) {
        bubbles.push({ speaker: currentSpeaker, text: currentLines.join('\n') });
        currentLines = [];
      }
      bubbles.push({ speaker: 'stage', text: trimmed.replace(/^\[|\]$/g, '') });
      return;
    }

    // Detect speaker labels like "You:", "Partner:", "Client:", "Advisor:", etc.
    var speakerMatch = trimmed.match(/^(You|Partner|Advisor|Agent|Broker|Attorney|Counselor|Professional):\s*(.*)/i);
    var clientMatch = trimmed.match(/^(Client|Prospect|Customer|Them|Borrower|Seller):\s*(.*)/i);

    if (speakerMatch) {
      if (currentLines.length) bubbles.push({ speaker: currentSpeaker, text: currentLines.join('\n') });
      currentSpeaker = 'partner';
      currentLines = speakerMatch[2] ? [speakerMatch[2]] : [];
    } else if (clientMatch) {
      if (currentLines.length) bubbles.push({ speaker: currentSpeaker, text: currentLines.join('\n') });
      currentSpeaker = 'client';
      currentLines = clientMatch[2] ? [clientMatch[2]] : [];
    } else {
      if (!currentSpeaker) currentSpeaker = 'partner';
      currentLines.push(trimmed);
    }
  });
  if (currentLines.length) bubbles.push({ speaker: currentSpeaker, text: currentLines.join('\n') });

  // If we couldn't parse any bubbles, fall back to plain text
  var hasSpeakers = bubbles.some(function(b) { return b.speaker === 'partner' || b.speaker === 'client'; });

  var html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
    '<div style="font-size:13px;color:var(--slate)">Word-for-word script — use exactly as written or adapt to your voice.</div>' +
    '<button class="sb-copy-btn" onclick="copyText(sbResults.conversation, this)">Copy</button>' +
  '</div>';

  if (!hasSpeakers) {
    html += '<div style="white-space:pre-wrap;font-size:15px;line-height:1.8;color:var(--navy)">' + esc(text) + '</div>';
  } else {
    html += '<div class="sb-chat-thread">';
    bubbles.forEach(function(b) {
      if (b.speaker === 'stage') {
        html += '<div class="sb-stage-dir">' + esc(b.text) + '</div>';
      } else if (b.speaker === 'client') {
        html += '<div class="sb-bubble sb-bubble-client"><div class="sb-bubble-label">Client</div><div class="sb-bubble-text">' + esc(b.text) + '</div></div>';
      } else {
        html += '<div class="sb-bubble sb-bubble-partner"><div class="sb-bubble-label">You</div><div class="sb-bubble-text">' + esc(b.text) + '</div></div>';
      }
    });
    html += '</div>';
  }

  el.innerHTML = html;
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

// TAB 3: Objection responses — expandable Q&A cards
function renderObjections(text, containerId) {
  var el = document.getElementById(containerId);
  if(!el) return;
  var html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">' +
    '<div style="font-size:13px;color:var(--slate)">Click each objection to reveal your response.</div>' +
    '<button class="sb-copy-btn" onclick="copyText(sbResults.objections, this)">Copy All</button>' +
  '</div>';

  var pairs = [];
  var raw = text.split(/\*\*Objection:\*\*|\*\*Response:\*\*/).filter(function(s){return s.trim();});
  if(raw.length >= 2) {
    for(var i=0; i<raw.length-1; i+=2) {
      pairs.push({q: raw[i].trim(), a: raw[i+1] ? raw[i+1].trim() : ''});
    }
  }

  if(pairs.length === 0) {
    html += '<div style="white-space:pre-wrap;font-size:15px;line-height:1.8">' + esc(text) + '</div>';
  } else {
    pairs.forEach(function(pair, i){
      var id = 'sb-obj-' + i;
      html += '<div class="sb-objection-card" style="background:var(--white);border:1px solid var(--off2);border-radius:10px;margin-bottom:14px;overflow:hidden">' +
        '<div class="sb-obj-trigger" onclick="toggleObjection(\'' + id + '\', this)" style="padding:18px 24px;cursor:pointer;display:flex;align-items:center;gap:14px;transition:background 0.15s" onmouseover="this.style.background=\'var(--off)\'" onmouseout="this.style.background=\'\'">' +
          '<div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,rgba(11,95,216,0.08),rgba(0,200,224,0.08));display:flex;align-items:center;justify-content:center;flex-shrink:0"><span style="font-size:14px;font-weight:700;color:var(--blue)">' + (i+1) + '</span></div>' +
          '<div style="flex:1;min-width:0"><div style="font-size:15px;font-weight:600;color:var(--navy)">' + esc(pair.q) + '</div></div>' +
          '<svg class="sb-obj-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--slate)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;transition:transform 0.2s"><polyline points="6 9 12 15 18 9"/></svg>' +
        '</div>' +
        '<div id="' + id + '" class="sb-obj-body" style="max-height:0;overflow:hidden;transition:max-height 0.3s ease">' +
          '<div style="padding:0 24px 20px;border-top:1px solid var(--off2)">' +
            '<div style="font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--blue);margin:16px 0 8px">Your Response</div>' +
            '<div style="font-size:15px;color:var(--body);line-height:1.75">' + esc(pair.a) + '</div>' +
            '<button class="sb-copy-btn" style="margin-top:12px;font-size:12px" onclick="copyText(' + JSON.stringify(pair.a).replace(/'/g, "\\'") + ', this)">Copy Response</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    });
  }
  el.innerHTML = html;
  // Auto-expand first objection
  setTimeout(function() {
    var first = document.getElementById('sb-obj-0');
    if (first) {
      first.style.maxHeight = first.scrollHeight + 'px';
      var chev = first.previousElementSibling.querySelector('.sb-obj-chevron');
      if (chev) chev.style.transform = 'rotate(180deg)';
    }
  }, 50);
}

function toggleObjection(id, trigger) {
  var body = document.getElementById(id);
  if (!body) return;
  var isOpen = body.style.maxHeight && body.style.maxHeight !== '0px';
  var chevron = trigger.querySelector('.sb-obj-chevron');
  if (isOpen) {
    body.style.maxHeight = '0px';
    if (chevron) chevron.style.transform = '';
  } else {
    body.style.maxHeight = body.scrollHeight + 'px';
    if (chevron) chevron.style.transform = 'rotate(180deg)';
  }
}

// TAB 4: Follow-up — timeline style
function renderFollowup(text, containerId) {
  var el = document.getElementById(containerId || 'out-followup');
  if(!el) return;
  if(!text) {
    el.innerHTML = '<div style="color:var(--slate);font-size:15px;font-style:italic">Generating follow-up sequence...</div>';
    return;
  }

  var channel = (document.getElementById('sb-channel') || {}).value || 'email';

  el.innerHTML =
    '<div class="sb-timeline">' +
      // Day 0 - Initial contact
      '<div class="sb-tl-item">' +
        '<div class="sb-tl-dot sb-tl-done"></div>' +
        '<div class="sb-tl-content">' +
          '<div class="sb-tl-day">Day 0</div>' +
          '<div class="sb-tl-label">Initial referral ' + esc(channel) + ' sent</div>' +
        '</div>' +
      '</div>' +
      // Day 5-7 - Follow-up
      '<div class="sb-tl-item">' +
        '<div class="sb-tl-dot sb-tl-active"></div>' +
        '<div class="sb-tl-content" style="flex:1">' +
          '<div class="sb-tl-day">Day 5\u20137</div>' +
          '<div class="sb-tl-label" style="margin-bottom:12px">Follow-up message</div>' +
          '<div style="background:#f8fafc;border:1px solid var(--off2);border-radius:10px;padding:20px 24px;position:relative">' +
            '<button class="sb-copy-btn" onclick="copyText(sbResults.followup, this)">Copy</button>' +
            '<div style="white-space:pre-wrap;font-size:15px;line-height:1.85;color:var(--navy);padding-right:60px">' + esc(text) + '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      // Day 14 - Soft check-in
      '<div class="sb-tl-item">' +
        '<div class="sb-tl-dot"></div>' +
        '<div class="sb-tl-content">' +
          '<div class="sb-tl-day">Day 14</div>' +
          '<div class="sb-tl-label">Soft check-in during next scheduled interaction</div>' +
        '</div>' +
      '</div>' +
      // Day 30 - Long-term
      '<div class="sb-tl-item sb-tl-last">' +
        '<div class="sb-tl-dot"></div>' +
        '<div class="sb-tl-content">' +
          '<div class="sb-tl-day">Day 30+</div>' +
          '<div class="sb-tl-label">Re-introduce if situation comes up naturally</div>' +
        '</div>' +
      '</div>' +
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

    // M2P2C2: Save cross-tool context
    if (typeof saveToolContext === 'function') {
      saveToolContext('script-builder', { type: type, channel: channel, style: style, situation: situation });
    }

    // M2P2C2: Show smart suggestions
    setTimeout(function() { if (typeof showSmartSuggestions === 'function') showSmartSuggestions('script-builder'); }, 500);

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


// ══════════════════════════════════════════
//  M2P1C2: Favorites System (cross-tool)
// ══════════════════════════════════════════

var TOOL_FAVORITES_KEY = 'ctax_tool_favorites';

function getToolFavorites() {
  try { return JSON.parse(localStorage.getItem(TOOL_FAVORITES_KEY) || '[]'); } catch (e) { return []; }
}

function setToolFavorites(favs) {
  try { localStorage.setItem(TOOL_FAVORITES_KEY, JSON.stringify(favs)); } catch (e) {}
}

function toggleFavorite(toolName, label, data) {
  var favs = getToolFavorites();
  var existIdx = favs.findIndex(function(f) { return f.tool === toolName && f.label === label; });
  if (existIdx >= 0) {
    favs.splice(existIdx, 1);
    setToolFavorites(favs);
    if (typeof showToast === 'function') showToast('Removed from favorites', 'info');
    return false;
  }
  favs.unshift({
    tool: toolName,
    label: label,
    data: data,
    favoritedAt: new Date().toISOString()
  });
  if (favs.length > 50) favs = favs.slice(0, 50);
  setToolFavorites(favs);
  if (typeof showToast === 'function') showToast('Added to favorites!', 'success');
  return true;
}

function isFavorited(toolName, label) {
  var favs = getToolFavorites();
  return favs.some(function(f) { return f.tool === toolName && f.label === label; });
}

function showFavoritesPanel() {
  var favs = getToolFavorites();

  var overlay = document.createElement('div');
  overlay.className = 'tf-overlay';
  overlay.id = 'tf-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) closeFavoritesPanel(); };

  var modal = document.createElement('div');
  modal.className = 'tf-modal';

  var html = '<div class="tf-header">';
  html += '<h3>Favorites</h3>';
  html += '<div class="tf-header-actions">';
  if (favs.length > 0) {
    html += '<button class="tf-btn-export" onclick="exportFavoritesAsText()">Export All</button>';
  }
  html += '<button class="tf-close" onclick="closeFavoritesPanel()">&times;</button>';
  html += '</div></div>';

  html += '<div class="tf-body">';
  if (favs.length === 0) {
    html += '<div class="tf-empty">No favorites yet. Star results from any tool to save them here.</div>';
  } else {
    // Group by tool
    var grouped = {};
    favs.forEach(function(f) {
      if (!grouped[f.tool]) grouped[f.tool] = [];
      grouped[f.tool].push(f);
    });

    var toolLabels = {
      'script-builder': 'Scripts',
      'ad-maker': 'Ads',
      'client-qualifier': 'Qualifications',
      'knowledge-base': 'Knowledge Base'
    };

    Object.keys(grouped).forEach(function(tool) {
      html += '<div class="tf-group">';
      html += '<div class="tf-group-title">' + (toolLabels[tool] || tool) + ' (' + grouped[tool].length + ')</div>';
      grouped[tool].forEach(function(fav) {
        var date = new Date(fav.favoritedAt);
        var dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        html += '<div class="tf-item">';
        html += '<div class="tf-item-info">';
        html += '<div class="tf-item-label">' + esc(fav.label) + '</div>';
        html += '<div class="tf-item-date">' + dateStr + '</div>';
        html += '</div>';
        html += '<div class="tf-item-actions">';
        html += '<button class="tf-item-load" onclick="closeFavoritesPanel();loadRecentResult(\'' + tool + '\',0)" title="Load">Load</button>';
        html += '<button class="tf-item-remove" onclick="removeFavoriteByLabel(\'' + tool + '\',\'' + esc(fav.label).replace(/'/g, "\\'") + '\')" title="Remove">&times;</button>';
        html += '</div>';
        html += '</div>';
      });
      html += '</div>';
    });
  }
  html += '</div>';

  modal.innerHTML = html;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function closeFavoritesPanel() {
  var el = document.getElementById('tf-overlay');
  if (el) el.remove();
}

function removeFavoriteByLabel(tool, label) {
  var favs = getToolFavorites().filter(function(f) { return !(f.tool === tool && f.label === label); });
  setToolFavorites(favs);
  closeFavoritesPanel();
  showFavoritesPanel();
}

function exportFavoritesAsText() {
  var favs = getToolFavorites();
  if (!favs.length) return;

  var text = '=== MY FAVORITES ===\nExported: ' + new Date().toLocaleString() + '\n\n';
  var toolLabels = { 'script-builder': 'SCRIPTS', 'ad-maker': 'ADS', 'client-qualifier': 'QUALIFICATIONS', 'knowledge-base': 'KNOWLEDGE BASE' };

  var grouped = {};
  favs.forEach(function(f) { if (!grouped[f.tool]) grouped[f.tool] = []; grouped[f.tool].push(f); });

  Object.keys(grouped).forEach(function(tool) {
    text += '\n--- ' + (toolLabels[tool] || tool.toUpperCase()) + ' ---\n\n';
    grouped[tool].forEach(function(fav, i) {
      text += (i + 1) + '. ' + fav.label + '\n';
      if (fav.data && fav.data.results) {
        if (fav.data.results.conversation) text += '\nConversation Script:\n' + fav.data.results.conversation + '\n';
        if (fav.data.results.email) text += '\nEmail:\n' + fav.data.results.email + '\n';
      }
      if (fav.data && fav.data.text) text += fav.data.text + '\n';
      text += '\n';
    });
  });

  var blob = new Blob([text], { type: 'text/plain' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'ctax-favorites.txt';
  a.click();
  URL.revokeObjectURL(url);
  if (typeof showToast === 'function') showToast('Favorites exported!', 'success');
}


// ══════════════════════════════════════════
//  M2P1C2: Batch Script Generation
// ══════════════════════════════════════════

var _sbBatchRunning = false;
var _sbBatchResults = [];

function sbShowBatchModal() {
  if (_sbBatchRunning) {
    if (typeof showToast === 'function') showToast('Batch generation already in progress.', 'warning');
    return;
  }

  var overlay = document.createElement('div');
  overlay.className = 'sb-batch-overlay';
  overlay.id = 'sb-batch-overlay';
  overlay.onclick = function(e) { if (e.target === overlay && !_sbBatchRunning) sbCloseBatch(); };

  var modal = document.createElement('div');
  modal.className = 'sb-batch-modal';

  var html = '<div class="sb-batch-header">';
  html += '<h3>Batch Generate Scripts</h3>';
  html += '<button class="sb-batch-close" onclick="sbCloseBatch()">&times;</button>';
  html += '</div>';
  html += '<div class="sb-batch-body">';
  html += '<p class="sb-batch-desc">Select templates to generate scripts for all at once. Each uses the template\'s pre-filled context.</p>';

  html += '<div class="sb-batch-select-all"><label><input type="checkbox" id="sb-batch-all" onchange="sbToggleBatchAll()"> Select All (' + SB_TEMPLATES.length + ' templates)</label></div>';

  html += '<div class="sb-batch-list">';
  SB_TEMPLATES.forEach(function(t, i) {
    html += '<label class="sb-batch-item">';
    html += '<input type="checkbox" value="' + i + '" class="sb-batch-cb">';
    html += '<div class="sb-batch-item-info">';
    html += '<div class="sb-batch-item-name">' + esc(t.name) + '</div>';
    html += '<div class="sb-batch-item-meta">' + esc(t.type) + ' · ' + esc(t.channel) + '</div>';
    html += '</div>';
    html += '</label>';
  });
  html += '</div>';

  html += '<div id="sb-batch-progress" class="sb-batch-progress" style="display:none">';
  html += '<div class="sb-batch-progress-bar"><div class="sb-batch-progress-fill" id="sb-batch-fill"></div></div>';
  html += '<div class="sb-batch-progress-text" id="sb-batch-text">0 / 0</div>';
  html += '</div>';

  html += '<div class="sb-batch-actions">';
  html += '<button class="sb-batch-btn-run" id="sb-batch-run" onclick="sbRunBatch()">Generate Selected</button>';
  html += '</div>';
  html += '</div>';

  modal.innerHTML = html;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function sbCloseBatch() {
  if (_sbBatchRunning) return;
  var el = document.getElementById('sb-batch-overlay');
  if (el) el.remove();
}

function sbToggleBatchAll() {
  var allChecked = document.getElementById('sb-batch-all').checked;
  document.querySelectorAll('.sb-batch-cb').forEach(function(cb) { cb.checked = allChecked; });
}

async function sbRunBatch() {
  if (!CTAX_API_KEY) { if (!promptForApiKey()) { return; } }

  var checkboxes = document.querySelectorAll('.sb-batch-cb:checked');
  var indices = [];
  checkboxes.forEach(function(cb) { indices.push(parseInt(cb.value)); });

  if (indices.length === 0) {
    if (typeof showToast === 'function') showToast('Select at least one template.', 'warning');
    return;
  }

  _sbBatchRunning = true;
  _sbBatchResults = [];
  var runBtn = document.getElementById('sb-batch-run');
  if (runBtn) runBtn.disabled = true;

  var progressEl = document.getElementById('sb-batch-progress');
  var fillEl = document.getElementById('sb-batch-fill');
  var textEl = document.getElementById('sb-batch-text');
  if (progressEl) progressEl.style.display = 'block';

  var total = indices.length;
  var completed = 0;

  for (var i = 0; i < indices.length; i++) {
    var idx = indices[i];
    var t = SB_TEMPLATES[idx];
    if (!t) continue;

    if (textEl) textEl.textContent = (completed + 1) + ' / ' + total + ' — ' + t.name;

    try {
      var icpBlock = '';
      if (typeof ICPContext !== 'undefined' && ICPContext.hasProfile()) {
        icpBlock = ICPContext.getPromptContext() + '\n\n';
      }

      var prompt = icpBlock + 'You are an expert sales coach for Community Tax. Generate a complete referral script.\n\n' +
        'PARTNER: ' + t.type + '\nSTYLE: ' + t.style + '\nCHANNEL: ' + t.channel + '\nRELATIONSHIP: ' + t.relationship + '\n' +
        'SITUATION: ' + t.situation + '\nOBJECTION: ' + t.objection + '\n\n' +
        'Generate 3 sections separated by "---SECTION---":\n' +
        '1. Conversation script (200-300 words)\n' +
        '2. Email template (Subject: line + body)\n' +
        '3. 3 objection/response pairs';

      var response = await fetch(CTAX_API_URL, {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1200,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      var data = await response.json();
      var text = data.content && data.content[0] ? data.content[0].text : '';
      var sections = text.split('---SECTION---');

      _sbBatchResults.push({
        template: t.name,
        type: t.type,
        channel: t.channel,
        conversation: (sections[0] || '').trim(),
        email: (sections[1] || '').trim(),
        objections: (sections[2] || '').trim()
      });

      // Save each to history
      saveToolResult('script-builder', t.name + ' (batch)', {
        results: { conversation: (sections[0] || '').trim(), email: (sections[1] || '').trim(), objections: (sections[2] || '').trim() },
        meta: t.type + ' · ' + t.style + ' · ' + t.channel
      });

    } catch (err) {
      _sbBatchResults.push({
        template: t.name,
        type: t.type,
        channel: t.channel,
        error: err.message || 'Generation failed'
      });
    }

    completed++;
    if (fillEl) fillEl.style.width = Math.round((completed / total) * 100) + '%';
  }

  _sbBatchRunning = false;
  if (runBtn) runBtn.disabled = false;
  if (textEl) textEl.textContent = 'Complete! ' + completed + ' scripts generated.';

  trackToolUsage('script-builder');

  // Show download button
  var actionsEl = document.querySelector('.sb-batch-actions');
  if (actionsEl) {
    actionsEl.innerHTML = '<button class="sb-batch-btn-download" onclick="sbDownloadBatch()">Download All Scripts</button>' +
      '<button class="sb-batch-btn-close" onclick="sbCloseBatch()">Close</button>';
  }
}

function sbDownloadBatch() {
  if (!_sbBatchResults.length) return;

  var text = '=== BATCH SCRIPT GENERATION ===\n';
  text += 'Generated: ' + new Date().toLocaleString() + '\n';
  text += 'Total: ' + _sbBatchResults.length + ' scripts\n';
  text += '='.repeat(50) + '\n\n';

  _sbBatchResults.forEach(function(r, i) {
    text += '\n' + '='.repeat(50) + '\n';
    text += (i + 1) + '. ' + r.template + '\n';
    text += 'Type: ' + r.type + ' | Channel: ' + r.channel + '\n';
    text += '='.repeat(50) + '\n\n';

    if (r.error) {
      text += '[ERROR] ' + r.error + '\n';
    } else {
      text += '--- CONVERSATION SCRIPT ---\n\n' + r.conversation + '\n\n';
      text += '--- EMAIL TEMPLATE ---\n\n' + r.email + '\n\n';
      text += '--- OBJECTION RESPONSES ---\n\n' + r.objections + '\n\n';
    }
  });

  var blob = new Blob([text], { type: 'text/plain' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'ctax-batch-scripts-' + new Date().toISOString().slice(0, 10) + '.txt';
  a.click();
  URL.revokeObjectURL(url);
  if (typeof showToast === 'function') showToast('All scripts downloaded!', 'success');
}


// ══════════════════════════════════════════
//  M2P1C2: Marketing Kit PDF Export (all tools)
// ══════════════════════════════════════════

function exportMarketingKit() {
  var history = getToolHistory();
  var favs = getToolFavorites();

  if (history.length === 0 && favs.length === 0) {
    if (typeof showToast === 'function') showToast('Generate some content first to export your marketing kit.', 'warning');
    return;
  }

  // Build HTML document for PDF
  var doc = document.createElement('div');
  doc.style.cssText = 'width:800px;padding:40px;font-family:system-ui,sans-serif;color:#111827;background:#fff';

  // Cover
  doc.innerHTML = '<div style="text-align:center;padding:80px 40px;margin-bottom:40px;background:linear-gradient(135deg,#0b5fd8 0%,#1e40af 100%);color:#fff;border-radius:16px">' +
    '<h1 style="font-size:36px;font-weight:800;margin:0 0 12px">My Marketing Kit</h1>' +
    '<p style="font-size:16px;opacity:0.85;margin:0">AI-Generated Content from CTAX Partner Portal</p>' +
    '<p style="font-size:14px;opacity:0.6;margin:16px 0 0">Generated ' + new Date().toLocaleDateString() + '</p>' +
    '</div>';

  // Stats summary
  var stats = getToolStats();
  var totalGen = 0;
  Object.keys(stats).forEach(function(k) { totalGen += stats[k].count || 0; });
  doc.innerHTML += '<div style="display:flex;gap:16px;margin-bottom:32px">' +
    '<div style="flex:1;padding:16px;background:#f0f9ff;border-radius:10px;text-align:center"><div style="font-size:28px;font-weight:800;color:#0b5fd8">' + totalGen + '</div><div style="font-size:12px;color:#6b7280">Total Generations</div></div>' +
    '<div style="flex:1;padding:16px;background:#f0fdf4;border-radius:10px;text-align:center"><div style="font-size:28px;font-weight:800;color:#059669">' + favs.length + '</div><div style="font-size:12px;color:#6b7280">Favorites Saved</div></div>' +
    '<div style="flex:1;padding:16px;background:#fef3c7;border-radius:10px;text-align:center"><div style="font-size:28px;font-weight:800;color:#d97706">' + history.length + '</div><div style="font-size:12px;color:#6b7280">Recent Results</div></div>' +
    '</div>';

  // Favorites section
  if (favs.length > 0) {
    doc.innerHTML += '<h2 style="font-size:22px;font-weight:700;margin:32px 0 16px;padding-bottom:8px;border-bottom:2px solid #e5e7eb">Starred Favorites</h2>';
    favs.forEach(function(fav) {
      doc.innerHTML += '<div style="margin-bottom:20px;padding:16px;border:1px solid #e5e7eb;border-radius:10px">' +
        '<div style="font-size:14px;font-weight:700;color:#0b5fd8;margin-bottom:8px">' + esc(fav.label) + '</div>';
      if (fav.data && fav.data.results) {
        if (fav.data.results.conversation) {
          doc.innerHTML += '<div style="font-size:12px;font-weight:600;color:#6b7280;margin:8px 0 4px">Conversation Script</div>' +
            '<div style="font-size:13px;line-height:1.6;white-space:pre-wrap">' + esc(fav.data.results.conversation).substring(0, 500) + '...</div>';
        }
        if (fav.data.results.email) {
          doc.innerHTML += '<div style="font-size:12px;font-weight:600;color:#6b7280;margin:8px 0 4px">Email Template</div>' +
            '<div style="font-size:13px;line-height:1.6;white-space:pre-wrap">' + esc(fav.data.results.email).substring(0, 500) + '...</div>';
        }
      }
      if (fav.data && fav.data.text) {
        doc.innerHTML += '<div style="font-size:13px;line-height:1.6;white-space:pre-wrap">' + esc(fav.data.text).substring(0, 500) + '...</div>';
      }
      doc.innerHTML += '</div>';
    });
  }

  // Recent history section
  if (history.length > 0) {
    doc.innerHTML += '<div style="page-break-before:always"></div>';
    doc.innerHTML += '<h2 style="font-size:22px;font-weight:700;margin:32px 0 16px;padding-bottom:8px;border-bottom:2px solid #e5e7eb">Recent Activity</h2>';
    history.slice(0, 10).forEach(function(item) {
      var toolLabels = { 'script-builder': 'Script', 'ad-maker': 'Ad', 'client-qualifier': 'Qualification', 'knowledge-base': 'KB' };
      doc.innerHTML += '<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #f3f4f6">' +
        '<span style="font-size:11px;font-weight:600;padding:2px 8px;background:#f3f4f6;border-radius:4px">' + (toolLabels[item.tool] || item.tool) + '</span>' +
        '<span style="font-size:13px;color:#111827">' + esc(item.label) + '</span>' +
        '<span style="font-size:11px;color:#9ca3af;margin-left:auto">' + timeAgo(item.timestamp) + '</span>' +
        '</div>';
    });
  }

  // Footer
  doc.innerHTML += '<div style="margin-top:40px;padding-top:16px;border-top:1px solid #e5e7eb;text-align:center;font-size:11px;color:#9ca3af">' +
    'Generated by CTAX Partner Portal | ' + new Date().toLocaleDateString() + '</div>';

  CTAX_PDF.exportElement(doc, 'CTAX-Marketing-Kit-' + new Date().toISOString().slice(0, 10) + '.pdf').then(function() {
    if (typeof showToast === 'function') showToast('Marketing Kit PDF exported!', 'success');
  });
}

// ══════════════════════════════════════════
//  M2P2C2: Cross-Tool Context Memory
// ══════════════════════════════════════════

var TOOL_CONTEXT_KEY = 'ctax_tool_context';

function getToolContext() {
  try { return JSON.parse(localStorage.getItem(TOOL_CONTEXT_KEY) || '{}'); } catch (e) { return {}; }
}

function setToolContext(ctx) {
  try { localStorage.setItem(TOOL_CONTEXT_KEY, JSON.stringify(ctx)); } catch (e) {}
}

// Save context after any tool generates output
function saveToolContext(toolName, context) {
  var ctx = getToolContext();
  ctx[toolName] = {
    context: context,
    timestamp: Date.now()
  };
  // Keep only the latest from each tool
  setToolContext(ctx);
}

// Get enriched context from all tools for any AI prompt
function getEnrichedContext() {
  var ctx = getToolContext();
  var parts = [];

  if (ctx['client-qualifier'] && ctx['client-qualifier'].context) {
    var cq = ctx['client-qualifier'].context;
    parts.push('PREVIOUS CLIENT QUALIFICATION:');
    if (cq.verdict) parts.push('- Verdict: ' + cq.verdict);
    if (cq.debt) parts.push('- Estimated Debt: $' + cq.debt);
    if (cq.issueType) parts.push('- Issue Type: ' + cq.issueType);
    if (cq.confidence) parts.push('- Confidence: ' + cq.confidence + '%');
    if (cq.analysis) parts.push('- Analysis Summary: ' + cq.analysis.substring(0, 200));
  }

  if (ctx['script-builder'] && ctx['script-builder'].context) {
    var sb = ctx['script-builder'].context;
    parts.push('PREVIOUS SCRIPT GENERATION:');
    if (sb.type) parts.push('- Partner Type: ' + sb.type);
    if (sb.channel) parts.push('- Channel: ' + sb.channel);
    if (sb.style) parts.push('- Style: ' + sb.style);
  }

  if (ctx['ad-maker'] && ctx['ad-maker'].context) {
    var am = ctx['ad-maker'].context;
    parts.push('PREVIOUS AD CREATION:');
    if (am.firm) parts.push('- Firm: ' + am.firm);
    if (am.tagline) parts.push('- Tagline: ' + am.tagline);
  }

  if (ctx['knowledge-base'] && ctx['knowledge-base'].context) {
    var kb = ctx['knowledge-base'].context;
    parts.push('PREVIOUS KB QUESTION:');
    if (kb.question) parts.push('- Question: ' + kb.question);
    if (kb.answer) parts.push('- Answer Summary: ' + kb.answer.substring(0, 200));
  }

  return parts.length > 0 ? '\n\nCROSS-TOOL CONTEXT (from partner\'s recent tool usage):\n' + parts.join('\n') + '\n\n' : '';
}


// ══════════════════════════════════════════
//  M2P2C2: Smart Suggestions (post-generation)
// ══════════════════════════════════════════

var TOOL_SUGGESTIONS = {
  'script-builder': [
    { tool: 'ad-maker', label: 'Create an Ad', desc: 'Generate a co-branded social ad using your script context', action: 'navToAdMaker' },
    { tool: 'client-qualifier', label: 'Qualify This Client', desc: 'Score the client before your conversation', action: 'navToQualifier' },
    { tool: 'page-builder', label: 'Build a Landing Page', desc: 'Create a page to send alongside your email', action: 'navToPageBuilder' }
  ],
  'ad-maker': [
    { tool: 'script-builder', label: 'Write a Script', desc: 'Generate a referral script to pair with your ad', action: 'navToScriptBuilder' },
    { tool: 'page-builder', label: 'Build a Landing Page', desc: 'Create a page that matches your ad campaign', action: 'navToPageBuilder' }
  ],
  'client-qualifier': [
    { tool: 'script-builder', label: 'Generate Scripts', desc: 'Create scripts tailored to this client\'s qualification', action: 'navToScriptBuilder' },
    { tool: 'ad-maker', label: 'Make an Ad', desc: 'Create targeted ads for similar client profiles', action: 'navToAdMaker' }
  ],
  'knowledge-base': [
    { tool: 'script-builder', label: 'Write a Script', desc: 'Use this knowledge to craft a conversation', action: 'navToScriptBuilder' },
    { tool: 'client-qualifier', label: 'Qualify a Client', desc: 'Apply what you learned to qualify a client', action: 'navToQualifier' }
  ]
};

function showSmartSuggestions(completedTool) {
  var suggestions = TOOL_SUGGESTIONS[completedTool];
  if (!suggestions || !suggestions.length) return;

  // Find or create the suggestions container
  var containerId = completedTool === 'script-builder' ? 'sb-output' :
                    completedTool === 'ad-maker' ? 'am-results' :
                    completedTool === 'client-qualifier' ? 'cq-output' :
                    completedTool === 'knowledge-base' ? 'kb-output' : null;

  if (!containerId) return;
  var container = document.getElementById(containerId);
  if (!container) return;

  // Remove existing suggestions
  var existing = container.querySelector('.smart-suggest');
  if (existing) existing.remove();

  var panel = document.createElement('div');
  panel.className = 'smart-suggest';

  var html = '<div class="smart-suggest-header">';
  html += '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>';
  html += '<span>What\'s Next?</span>';
  html += '</div>';
  html += '<div class="smart-suggest-list">';

  suggestions.forEach(function(s) {
    html += '<button class="smart-suggest-item" onclick="' + s.action + '()">';
    html += '<div class="smart-suggest-item-label">' + s.label + '</div>';
    html += '<div class="smart-suggest-item-desc">' + s.desc + '</div>';
    html += '</button>';
  });

  html += '</div>';
  panel.innerHTML = html;
  container.appendChild(panel);
}

// Navigation helpers for smart suggestions
function navToScriptBuilder() {
  if (typeof portalNav === 'function') {
    var nav = document.querySelector('[onclick*="portal-sec-scriptbuilder"]') || document.querySelector('[onclick*="portal-sec-ai-scriptbuilder"]');
    if (nav) { portalNav(nav, nav.getAttribute('onclick').match(/portal-sec-[^'")]+/)[0]); return; }
  }
  if (typeof showPage === 'function') showPage('scripts');
}

function navToAdMaker() {
  if (typeof portalNav === 'function') {
    var nav = document.querySelector('[onclick*="portal-sec-admaker"]') || document.querySelector('[onclick*="portal-sec-ai-admaker"]');
    if (nav) { portalNav(nav, nav.getAttribute('onclick').match(/portal-sec-[^'")]+/)[0]); return; }
  }
  if (typeof showPage === 'function') showPage('admaker');
}

function navToQualifier() {
  if (typeof portalNav === 'function') {
    var nav = document.querySelector('[onclick*="portal-sec-qualifier"]') || document.querySelector('[onclick*="portal-sec-ai-qualifier"]');
    if (nav) { portalNav(nav, nav.getAttribute('onclick').match(/portal-sec-[^'")]+/)[0]); return; }
  }
  if (typeof showPage === 'function') showPage('qualifier');
}

function navToPageBuilder() {
  if (typeof portalNav === 'function') {
    var nav = document.querySelector('[onclick*="portal-sec-pagebuilder"]');
    if (nav) { portalNav(nav, 'portal-sec-pagebuilder'); return; }
  }
  if (typeof showPage === 'function') showPage('portal');
}


// ══════════════════════════════════════════
//  M2P2C2: AI Pipeline (Chain Tools)
// ══════════════════════════════════════════

var _pipelineRunning = false;

function showPipelineModal() {
  if (_pipelineRunning) {
    if (typeof showToast === 'function') showToast('Pipeline already running.', 'warning');
    return;
  }

  var overlay = document.createElement('div');
  overlay.className = 'pipeline-overlay';
  overlay.id = 'pipeline-overlay';
  overlay.onclick = function(e) { if (e.target === overlay && !_pipelineRunning) closePipeline(); };

  var modal = document.createElement('div');
  modal.className = 'pipeline-modal';

  var html = '<div class="pipeline-header">';
  html += '<h3>AI Pipeline</h3>';
  html += '<button class="pipeline-close" onclick="closePipeline()">&times;</button>';
  html += '</div>';
  html += '<div class="pipeline-body">';
  html += '<p class="pipeline-desc">Run multiple tools in sequence. Each tool uses context from the previous one for smarter, connected outputs.</p>';

  // Pipeline steps
  html += '<div class="pipeline-steps">';
  html += '<div class="pipeline-step pipeline-step-active" id="pipeline-step-0">';
  html += '<div class="pipeline-step-num">1</div>';
  html += '<div class="pipeline-step-info">';
  html += '<div class="pipeline-step-title">Qualify Client</div>';
  html += '<div class="pipeline-step-desc">Analyze the client situation and get a score</div>';
  html += '</div>';
  html += '<div class="pipeline-step-status" id="pipeline-status-0">Ready</div>';
  html += '</div>';

  html += '<div class="pipeline-connector"><svg width="16" height="20" viewBox="0 0 16 20"><path d="M8 0v20M4 16l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></div>';

  html += '<div class="pipeline-step" id="pipeline-step-1">';
  html += '<div class="pipeline-step-num">2</div>';
  html += '<div class="pipeline-step-info">';
  html += '<div class="pipeline-step-title">Generate Scripts</div>';
  html += '<div class="pipeline-step-desc">Create tailored referral scripts using qualification data</div>';
  html += '</div>';
  html += '<div class="pipeline-step-status" id="pipeline-status-1">Waiting</div>';
  html += '</div>';

  html += '<div class="pipeline-connector"><svg width="16" height="20" viewBox="0 0 16 20"><path d="M8 0v20M4 16l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></div>';

  html += '<div class="pipeline-step" id="pipeline-step-2">';
  html += '<div class="pipeline-step-num">3</div>';
  html += '<div class="pipeline-step-info">';
  html += '<div class="pipeline-step-title">Create Ad</div>';
  html += '<div class="pipeline-step-desc">Generate a social media ad using the script context</div>';
  html += '</div>';
  html += '<div class="pipeline-step-status" id="pipeline-status-2">Waiting</div>';
  html += '</div>';
  html += '</div>';

  // Input fields
  html += '<div class="pipeline-inputs" id="pipeline-inputs">';
  html += '<div class="pipeline-input-group">';
  html += '<label>Estimated Tax Debt</label>';
  html += '<input type="text" id="pipeline-debt" class="pipeline-input" placeholder="e.g. $35,000">';
  html += '</div>';
  html += '<div class="pipeline-input-group">';
  html += '<label>Issue Type</label>';
  html += '<select id="pipeline-issue" class="pipeline-input">';
  html += '<option value="Back taxes / unfiled returns">Back taxes / unfiled returns</option>';
  html += '<option value="IRS audit / examination">IRS audit / examination</option>';
  html += '<option value="Tax lien on property">Tax lien on property</option>';
  html += '<option value="Wage garnishment">Wage garnishment</option>';
  html += '<option value="Bank levy">Bank levy</option>';
  html += '<option value="Penalty abatement">Penalty abatement</option>';
  html += '</select>';
  html += '</div>';
  html += '<div class="pipeline-input-group">';
  html += '<label>Your Practice Type</label>';
  html += '<select id="pipeline-type" class="pipeline-input">';
  html += '<option value="CPA / Tax Preparer">CPA / Tax Preparer</option>';
  html += '<option value="Financial Advisor">Financial Advisor</option>';
  html += '<option value="Insurance Agent">Insurance Agent</option>';
  html += '<option value="Mortgage Broker">Mortgage Broker</option>';
  html += '<option value="Attorney">Attorney</option>';
  html += '<option value="Other">Other</option>';
  html += '</select>';
  html += '</div>';
  html += '<div class="pipeline-input-group">';
  html += '<label>Firm Name</label>';
  html += '<input type="text" id="pipeline-firm" class="pipeline-input" placeholder="Your firm name">';
  html += '</div>';
  html += '</div>';

  html += '<div id="pipeline-results" class="pipeline-results" style="display:none"></div>';

  html += '<div class="pipeline-actions">';
  html += '<button class="pipeline-btn-run" id="pipeline-run" onclick="runPipeline()">Run Full Pipeline</button>';
  html += '</div>';
  html += '</div>';

  modal.innerHTML = html;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function closePipeline() {
  if (_pipelineRunning) return;
  var el = document.getElementById('pipeline-overlay');
  if (el) el.remove();
}

// ── PDF EXPORT ──────────────────────────────────────────
function downloadScriptPdf() {
  if (typeof CTAX_PDF === 'undefined') {
    if (typeof showToast === 'function') showToast('PDF system not loaded. Please refresh and try again.', 'error');
    return;
  }
  var meta = (document.getElementById('sb-output-meta') || {}).textContent || '';
  var doc = CTAX_PDF.createDoc();

  // Cover
  doc += CTAX_PDF.createCover('Referral Script Package', meta || 'Custom AI-Generated Scripts', 'Generated by CTAX Studios Script Builder');

  // Conversation Script
  doc += CTAX_PDF.createPage(
    '<h2 style="color:#0A1628;font-family:DM Serif Display,serif;font-size:22px;margin-bottom:16px">Conversation Script</h2>' +
    '<div style="white-space:pre-wrap;font-size:13px;line-height:1.8;color:#1a2a3a">' + CTAX_PDF.esc(sbResults.conversation || '') + '</div>'
  );

  // Email Template
  var emailText = sbResults.email || '';
  var subjectMatch = emailText.match(/^Subject:\s*(.+?)\n\n/i);
  var subject = subjectMatch ? subjectMatch[1].trim() : '';
  var body = subjectMatch ? emailText.slice(subjectMatch[0].length).trim() : emailText.trim();
  doc += CTAX_PDF.createPage(
    '<h2 style="color:#0A1628;font-family:DM Serif Display,serif;font-size:22px;margin-bottom:16px">Email Template</h2>' +
    (subject ? '<div style="background:#f0f4f8;border-radius:6px;padding:10px 14px;margin-bottom:14px;font-size:13px"><strong>Subject:</strong> ' + CTAX_PDF.esc(subject) + '</div>' : '') +
    '<div style="white-space:pre-wrap;font-size:13px;line-height:1.8;color:#1a2a3a">' + CTAX_PDF.esc(body) + '</div>'
  );

  // Objection Responses
  doc += CTAX_PDF.createPage(
    '<h2 style="color:#0A1628;font-family:DM Serif Display,serif;font-size:22px;margin-bottom:16px">Objection Responses</h2>' +
    '<div style="white-space:pre-wrap;font-size:13px;line-height:1.8;color:#1a2a3a">' + CTAX_PDF.esc(sbResults.objections || '') + '</div>'
  );

  // Follow-up
  if (sbResults.followup) {
    doc += CTAX_PDF.createPage(
      '<h2 style="color:#0A1628;font-family:DM Serif Display,serif;font-size:22px;margin-bottom:16px">Follow-Up Message</h2>' +
      '<div style="white-space:pre-wrap;font-size:13px;line-height:1.8;color:#1a2a3a">' + CTAX_PDF.esc(sbResults.followup) + '</div>'
    );
  }

  doc += '</div>';
  CTAX_PDF.renderPdf(doc, 'CTAX-Script-Package.pdf');
}

async function runPipeline() {
  if (!CTAX_API_KEY) { if (!promptForApiKey()) { return; } }

  var debt = (document.getElementById('pipeline-debt') || {}).value || '$25,000';
  var issue = (document.getElementById('pipeline-issue') || {}).value || 'Back taxes';
  var type = (document.getElementById('pipeline-type') || {}).value || 'CPA';
  var firm = (document.getElementById('pipeline-firm') || {}).value || 'My Firm';

  _pipelineRunning = true;
  var runBtn = document.getElementById('pipeline-run');
  if (runBtn) { runBtn.disabled = true; runBtn.textContent = 'Running...'; }

  var inputsEl = document.getElementById('pipeline-inputs');
  if (inputsEl) inputsEl.style.display = 'none';

  var resultsEl = document.getElementById('pipeline-results');
  if (resultsEl) { resultsEl.style.display = 'block'; resultsEl.innerHTML = ''; }

  // Step 1: Qualify
  updatePipelineStep(0, 'running');
  try {
    var qualPrompt = 'You are a client qualification expert for Community Tax. Analyze this potential client:\n' +
      'Debt: ' + debt + '\nIssue: ' + issue + '\n\n' +
      'Respond with a single JSON object (no markdown): {"verdict":"STRONG|LIKELY|WEAK","confidence":0-100,"caseValue":"$X-$Y","analysis":"2 sentences explaining the qualification"}';

    var qualRes = await fetch(CTAX_API_URL, {
      method: 'POST', headers: getApiHeaders(),
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 300, messages: [{ role: 'user', content: qualPrompt }] })
    });
    var qualData = await qualRes.json();
    var qualText = qualData.content && qualData.content[0] ? qualData.content[0].text.trim() : '';
    var qualResult = {};
    try { qualResult = JSON.parse(qualText); } catch (e) { qualResult = { verdict: 'LIKELY', confidence: 60, analysis: qualText }; }

    updatePipelineStep(0, 'done');
    addPipelineResult('Qualification', '<strong>' + (qualResult.verdict || 'LIKELY') + '</strong> (' + (qualResult.confidence || 60) + '% confidence)<br>' + esc(qualResult.analysis || ''));

    // Save context for next step
    saveToolContext('client-qualifier', { verdict: qualResult.verdict, debt: debt, issueType: issue, confidence: qualResult.confidence, analysis: qualResult.analysis });

  } catch (err) {
    updatePipelineStep(0, 'error');
    addPipelineResult('Qualification', '<span style="color:#dc2626">Error: ' + esc(err.message) + '</span>');
  }

  // Step 2: Generate Script
  updatePipelineStep(1, 'running');
  try {
    var scriptPrompt = getEnrichedContext() + 'Generate a short referral conversation script (150 words max) for a ' + type + ' referring a client to Community Tax. Client has ' + debt + ' in ' + issue + '. Warm, professional tone. Just the script, no labels.';

    var scriptRes = await fetch(CTAX_API_URL, {
      method: 'POST', headers: getApiHeaders(),
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 400, messages: [{ role: 'user', content: scriptPrompt }] })
    });
    var scriptData = await scriptRes.json();
    var scriptText = scriptData.content && scriptData.content[0] ? scriptData.content[0].text.trim() : '';

    updatePipelineStep(1, 'done');
    addPipelineResult('Script', '<div style="white-space:pre-wrap;font-size:13px;line-height:1.6">' + esc(scriptText.substring(0, 500)) + '</div>');

    saveToolContext('script-builder', { type: type, channel: 'conversation', style: 'warm', situation: debt + ' ' + issue });

  } catch (err) {
    updatePipelineStep(1, 'error');
    addPipelineResult('Script', '<span style="color:#dc2626">Error: ' + esc(err.message) + '</span>');
  }

  // Step 3: Generate Ad Headline
  updatePipelineStep(2, 'running');
  try {
    var adPrompt = getEnrichedContext() + 'Generate 1 short social media ad headline (max 8 words) and 1 tagline (max 15 words) for ' + firm + ' partnered with Community Tax. Target: people with IRS debt. Format exactly as:\nHeadline: [text]\nTagline: [text]';

    var adRes = await fetch(CTAX_API_URL, {
      method: 'POST', headers: getApiHeaders(),
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 100, messages: [{ role: 'user', content: adPrompt }] })
    });
    var adData = await adRes.json();
    var adText = adData.content && adData.content[0] ? adData.content[0].text.trim() : '';

    updatePipelineStep(2, 'done');
    addPipelineResult('Ad Copy', '<div style="font-size:13px;line-height:1.6">' + esc(adText) + '</div>');

    saveToolContext('ad-maker', { firm: firm, tagline: adText });

  } catch (err) {
    updatePipelineStep(2, 'error');
    addPipelineResult('Ad Copy', '<span style="color:#dc2626">Error: ' + esc(err.message) + '</span>');
  }

  _pipelineRunning = false;
  if (runBtn) { runBtn.disabled = false; runBtn.textContent = 'Run Again'; }
  if (typeof showToast === 'function') showToast('Pipeline complete! 3 tools chained.', 'success');
}

function updatePipelineStep(idx, status) {
  var stepEl = document.getElementById('pipeline-step-' + idx);
  var statusEl = document.getElementById('pipeline-status-' + idx);
  if (stepEl) {
    stepEl.className = 'pipeline-step';
    if (status === 'running') stepEl.classList.add('pipeline-step-running');
    if (status === 'done') stepEl.classList.add('pipeline-step-done');
    if (status === 'error') stepEl.classList.add('pipeline-step-error');
  }
  if (statusEl) {
    var labels = { running: 'Running...', done: 'Complete', error: 'Failed', waiting: 'Waiting' };
    statusEl.textContent = labels[status] || status;
  }
}

function addPipelineResult(title, html) {
  var el = document.getElementById('pipeline-results');
  if (!el) return;
  el.innerHTML += '<div class="pipeline-result-card">' +
    '<div class="pipeline-result-title">' + title + '</div>' +
    '<div class="pipeline-result-content">' + html + '</div>' +
    '</div>';
}


// ── END SCRIPT BUILDER ───────────────────────────────────────
