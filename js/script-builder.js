// ── SCRIPT BUILDER ──────────────────────────────────────────
var sbResults = {};
var _sbCurrentTab = -1;
var _sbAnimating = false;
var _sbTabNames = ['conversation','email','objections','followup'];

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
  var all = Object.values(sbResults).join('\n\n---\n\n');
  navigator.clipboard.writeText(all).then(function(){
    var btn = event.target.closest('button');
    var orig = btn.innerHTML;
    btn.textContent = '✓ Copied All';
    setTimeout(function(){btn.innerHTML=orig;}, 2000);
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
  fetch('https://api.anthropic.com/v1/messages', {
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

  var prompt = 'You are an expert sales coach for Community Tax, a national IRS tax resolution firm. A partner professional needs referral scripts to introduce their client to Community Tax.\n\n' +
    'PARTNER PROFILE:\n- Professional type: ' + type + '\n- Communication style: ' + style + '\n- Preferred channel: ' + channel + '\n- Client relationship: ' + relationship + '\n\n' +
    'CLIENT SITUATION:\n' + situation + '\n\n' +
    'EXPECTED OBJECTION: ' + objection + '\n\n' +
    'Generate exactly 4 sections separated by "---SECTION---":\n\n' +
    'SECTION 1 - CONVERSATION SCRIPT\nA natural, word-for-word ' + channel + ' script for a ' + style + ' ' + type + ' to introduce Community Tax to this client. Include stage directions in [brackets]. Make it feel human, not salesy. 200-300 words.\n\n' +
    'SECTION 2 - EMAIL TEMPLATE\nComplete ready-to-send email only. Format EXACTLY as:\nSubject: [subject line]\n\n[email body]\nNo commentary, no labels, no explanation. Just the email.\n\n' +
    'SECTION 3 - OBJECTION RESPONSES\nExactly 3 objection/response pairs. Format each EXACTLY as:\n**Objection:** [client says this]\n**Response:** [partner says this]\n\nNothing else — no intro, no outro, just the 3 pairs.\n\n' +
    'SECTION 4 - DELIVERY TIPS\n4-5 short, specific tips for delivering this referral well given this specific situation and client. Plain bullet points, no headers.';

  try {
    var response = await fetch('https://api.anthropic.com/v1/messages', {
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

    fetch('https://api.anthropic.com/v1/messages', {
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

    document.getElementById('sb-output-meta').textContent = type + ' · ' + style + ' · ' + channel;
    document.getElementById('sb-loading').style.display='none';
    document.getElementById('sb-output').style.display='block';

    renderConversation(sbResults.conversation, 'out-conversation');
    renderEmail(sbResults.email, 'out-email');
    renderObjections(sbResults.objections, 'out-objections');
    renderFollowup('', 'out-followup');
    renderTips(sbResults.tips);

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
// ── END SCRIPT BUILDER ───────────────────────────────────────
