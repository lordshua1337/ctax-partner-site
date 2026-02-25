// --- API Configuration ---
// WARNING: Client-side API key usage is for DEMO/DEVELOPMENT only.
// For production, route all AI requests through a backend proxy.
var CTAX_API_KEY = localStorage.getItem('ctax_api_key') || '';

function promptForApiKey() {
  var key = prompt(
    'Enter your Anthropic API key to use AI tools.\n\n' +
    'IMPORTANT: This key is stored in your browser (localStorage) ' +
    'and is visible in network requests. Only use a development key ' +
    'with spending limits enabled.\n\n' +
    'Get a key at: console.anthropic.com'
  );
  if (key && key.trim()) {
    CTAX_API_KEY = key.trim();
    localStorage.setItem('ctax_api_key', CTAX_API_KEY);
    return true;
  }
  return false;
}

function getApiHeaders() {
  return {
    'Content-Type': 'application/json',
    'anthropic-version': '2023-06-01',
    'anthropic-dangerous-direct-browser-access': 'true',
    'x-api-key': CTAX_API_KEY
  };
}

function clearApiKey() {
  CTAX_API_KEY = '';
  localStorage.removeItem('ctax_api_key');
}
// --- End API Configuration ---


(function(){document.querySelectorAll('.ft-year').forEach(function(e){e.textContent=new Date().getFullYear();});})();

// ── REVENUE CALCULATOR ──────────────────────────────────────
var rcNarrativeText = '';

function resetCalculator() {
  document.getElementById('rc-form-wrap').style.display = 'block';
  document.getElementById('rc-output').style.display = 'none';
  document.getElementById('rc-loading').style.display = 'none';
  rcNarrativeText = '';
}

function copyRcNarrative() {
  navigator.clipboard.writeText(rcNarrativeText).then(function(){
    var btn = document.querySelector('#rc-output .sb-copy-btn');
    if(btn){ var o=btn.textContent; btn.textContent='✓ Copied'; setTimeout(function(){btn.textContent=o;},2000); }
  });
}

async function generateProjection() {
  if (!CTAX_API_KEY) { if (!promptForApiKey()) { return; } }
  var type = document.getElementById('rc-type').value;
  var volume = document.getElementById('rc-volume').value;
  var income = document.getElementById('rc-income').value;
  var geo = document.getElementById('rc-geo').value;
  var referrals = document.getElementById('rc-referrals').value;
  var notes = document.getElementById('rc-notes').value.trim();

  if(!type || !volume || !income || !geo || !referrals) {
    alert('Please fill in all required fields.');
    return;
  }

  document.getElementById('rc-form-wrap').style.display = 'none';
  document.getElementById('rc-loading').style.display = 'block';
  document.getElementById('rc-output').style.display = 'none';

  var msgs = ['Analyzing your client base...','Modeling referral conversion rates...','Calculating revenue scenarios...','Writing your projection narrative...','Almost done...'];
  var mi = 0, mel = document.getElementById('rc-loading-msg');
  var mint = setInterval(function(){ mi=(mi+1)%msgs.length; mel.textContent=msgs[mi]; }, 3000);

  // Determine if partner is a tax professional (CPAs, EAs, EROs, tax preparers)
  var taxProfTypes = ['cpa','tax prep','ea ','enrolled agent','ero','efin','tax professional','accountant','bookkeeper'];
  var isTaxPro = taxProfTypes.some(function(t){ return type.toLowerCase().indexOf(t) !== -1; });

  var taxOpportunityBlock = isTaxPro
    ? 'TAX PREPARATION OPPORTUNITY (important — include this):\nFor this partner type, approximately 50% of their tax debt referrals will also need or benefit from ongoing tax preparation services. Community Tax handles this too — meaning partners are not losing clients to a competitor but are gaining a trusted back-office partner for complex cases. Reinforce that we support their practice, not compete with it. Frame this as: retained clients + added resolution revenue + peace of mind.'
    : 'TAX PREPARATION OPPORTUNITY (important — include this):\nThis partner type does NOT offer tax preparation services. That means beyond tax debt resolution revenue share, they have an additional unquantified upside: a meaningful portion of their client base likely needs tax preparation services as well. While we cannot project this precisely, note clearly that Community Tax also handles tax preparation — meaning this partner can refer both tax debt AND unfiled/unprepared returns. Frame this as an untapped adjacent revenue stream on top of the debt resolution numbers shown.';

  var prompt = 'You are a senior revenue analyst for Community Tax, a national IRS tax resolution firm with 15 years of experience, $2.3B in tax debt resolved, and a referral partner program.\n\n'
    + 'Key program facts:\n'
    + '- 18.6 million Americans owe $316B in overdue taxes\n'
    + '- ~80% referral-to-consultation conversion rate once a qualified client engages\n'
    + '- Partners earn meaningful revenue share per closed case\n'
    + '- Minimum qualifying tax debt: $7,000+ (single year or combined)\n'
    + '- Investigation fee: $295 per client ($500 additional for businesses)\n'
    + '- Average tax debt case value: $8,000–$80,000+ depending on complexity\n'
    + '- Partner revenue per closed case: $1,500–$4,000 depending on case complexity\n'
    + '- Typical referral-to-close timeline: 30–90 days\n'
    + '- Partners keep full client relationship — Community Tax works behind the scenes\n'
    + '- English and Spanish servicing available\n\n'
    + 'PARTNER PROFILE:\n'
    + '- Business type: ' + type + '\n'
    + '- Annual client volume: ' + volume + '\n'
    + '- Typical client income: ' + income + '\n'
    + '- Geographic reach: ' + geo + '\n'
    + '- Current referral activity: ' + referrals + (notes ? '\n- Additional context: ' + notes : '') + '\n\n'
    + taxOpportunityBlock + '\n\n'
    + 'Generate a revenue projection in EXACTLY this format, separated by "---SECTION---":\n\n'
    + 'SECTION 1 — JSON NUMBERS ONLY (no other text):\n'
    + '{"referrals_low": NUMBER, "referrals_high": NUMBER, "revenue_low": "$X,XXX", "revenue_high": "$XX,XXX", "cases_low": NUMBER, "cases_high": NUMBER}\n'
    + 'Estimate: what % of a ' + volume + '-client ' + type + ' book realistically has $7k+ unresolved tax debt given the ' + income + ' income bracket. Apply 15–25% identification rate and 70–80% conversion. Revenue per case: $1,500–$4,000.\n\n'
    + 'SECTION 2 — NARRATIVE (use <b>bold headlines</b> for each paragraph topic, NO asterisks, NO markdown, plain HTML only):\n'
    + 'Write 4 focused paragraphs. Paragraph 1: lead with the specific numbers for their practice. Paragraph 2: why their specific client base is a strong fit. Paragraph 3: the tax preparation opportunity angle (use the framing from the TAX PREPARATION OPPORTUNITY block above — tailored to whether they are or are not a tax pro). Paragraph 4: what year two looks like as the referral motion matures. Be specific to their practice type. No generic language. Format: <b>Headline</b> followed by the paragraph text. Do not use ** or markdown.\n\n'
    + 'SECTION 3 — BREAKDOWN (use <b>bold label:</b> format for each line, no bullets, no asterisks):\n'
    + 'Show the math in 5–6 lines: starting client volume → tax-affected % → qualified referrals → expected conversions → revenue range. Each line: <b>Label:</b> value and explanation.\n\n'
    + 'SECTION 4 — NEXT STEPS (use <b>bold action:</b> format, no bullets, no asterisks):\n'
    + '4 specific, actionable next steps tailored to a ' + type + '. Each line: <b>Action:</b> explanation.';

  try {
    var resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1400,
        messages: [{role: 'user', content: prompt}]
      })
    });
    if(!resp.ok) throw new Error(resp.status === 401 ? '401' : 'API returned ' + resp.status);
    var data = await resp.json();
    if(data.error) throw new Error(data.error.message || 'API error');
    var text = data.content && data.content[0] ? data.content[0].text : '';
    clearInterval(mint);

    var sections = text.split('---SECTION---');
    var numbersRaw = (sections[0] || '').trim();
    var narrative = (sections[1] || '').trim();
    var breakdown = (sections[2] || '').trim();
    var nextsteps = (sections[3] || '').trim();

    // Parse numbers
    var nums = {referrals_low:12,referrals_high:28,revenue_low:'$18,000',revenue_high:'$42,000',cases_low:8,cases_high:20};
    try {
      var jsonMatch = numbersRaw.match(/\{[\s\S]*\}/);
      if(jsonMatch) nums = JSON.parse(jsonMatch[0]);
    } catch(e){}

    rcNarrativeText = narrative;

    // Render numbers
    document.getElementById('rc-numbers').innerHTML =
      '<div style="background:var(--white);border:1px solid var(--off2);border-radius:11px;padding:24px;text-align:center">' +
        '<div style="font-size:15px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--slate);margin-bottom:8px">Qualified Referrals / Year</div>' +
        '<div style="font-family:\'DM Serif Display\',serif;font-size:36px;letter-spacing:-0.02em;background:linear-gradient(135deg,var(--blue),var(--cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">' + nums.referrals_low + '–' + nums.referrals_high + '</div>' +
        '<div style="font-size:15px;color:var(--slate);margin-top:4px">estimated annually</div>' +
      '</div>' +
      '<div style="background:var(--white);border:1px solid var(--off2);border-radius:11px;padding:24px;text-align:center">' +
        '<div style="font-size:15px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--slate);margin-bottom:8px">Closed Cases / Year</div>' +
        '<div style="font-family:\'DM Serif Display\',serif;font-size:36px;letter-spacing:-0.02em;background:linear-gradient(135deg,var(--blue),var(--cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">' + nums.cases_low + '–' + nums.cases_high + '</div>' +
        '<div style="font-size:15px;color:var(--slate);margin-top:4px">at ~80% conversion</div>' +
      '</div>' +
      '<div style="background:linear-gradient(135deg,var(--navy),var(--navy2));border-radius:11px;padding:24px;text-align:center">' +
        '<div style="font-size:15px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.72);margin-bottom:8px">Estimated Revenue Share</div>' +
        '<div style="font-family:\'DM Serif Display\',serif;font-size:30px;letter-spacing:-0.02em;color:var(--teal)">' + nums.revenue_low + '–' + nums.revenue_high + '</div>' +
        '<div style="font-size:15px;color:rgba(255,255,255,0.72);margin-top:4px">year one projection</div>' +
      '</div>';

    // Render narrative
    var cleanNarrative = narrative
      .replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>')  // convert any ** fallback to <b>
      .replace(/\n\n/g,'</p><p style="margin-top:16px">')
      .replace(/^/,'<p>');
    document.getElementById('rc-narrative').innerHTML = cleanNarrative + '</p>';

    // Render breakdown
    var bhtml = breakdown.split('\n').filter(function(l){return l.trim();}).map(function(l){
      // Strip any residual markdown asterisks
      var clean = l.replace(/^[•\-*]\s*/,'').replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>');
      return '<div style="margin-bottom:12px;font-size:15px;color:var(--body);line-height:1.6">' + clean + '</div>';
    }).join('');
    document.getElementById('rc-breakdown').innerHTML = bhtml;

    // Render next steps
    var nhtml = nextsteps.split('\n').filter(function(l){return l.trim();}).map(function(l){
      var clean = l.replace(/^[•\-*\d.]\s*/,'').replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>');
      return '<div style="margin-bottom:14px;font-size:15px;color:var(--body);line-height:1.6;padding-left:16px;border-left:2px solid var(--cyan)">' + clean + '</div>';
    }).join('');
    document.getElementById('rc-nextsteps').innerHTML = nhtml;

    document.getElementById('rc-meta').textContent = type + ' · ' + volume + ' clients · ' + geo;
    document.getElementById('rc-loading').style.display = 'none';
    document.getElementById('rc-output').style.display = 'block';

  } catch(err) {
    clearInterval(mint);
    document.getElementById('rc-loading').style.display = 'none';
    document.getElementById('rc-form-wrap').style.display = 'block';
    var errDiv = document.getElementById('rc-error');
    if(errDiv){
      var isAuth = err.message && err.message.indexOf('401') !== -1;
      var msg = isAuth
        ? 'Invalid API key. Please check your key and try again.'
        : 'Unable to generate projection right now. Please try again in a moment.';
      errDiv.innerHTML = msg + ' <a href="#" onclick="this.parentElement.style.display=\'none\';return false" style="color:inherit;text-decoration:underline;margin-left:8px">Dismiss</a>';
      errDiv.style.display='block';
    }
  }
}
// ── END REVENUE CALCULATOR ───────────────────────────────────

// ── SCRIPT BUILDER ──────────────────────────────────────────
var sbResults = {};

function switchSbTab(tab) {
  document.querySelectorAll('.sb-tab').forEach(function(t){t.classList.remove('active');});
  document.querySelectorAll('.sb-tab-panel').forEach(function(p){p.style.display='none';p.classList.remove('active');});
  var panels = document.querySelectorAll('.sb-tab-panel');
  var tabs = document.querySelectorAll('.sb-tab');
  var tabNames = ['conversation','email','objections','followup'];
  var idx = tabNames.indexOf(tab);
  if(idx >= 0 && tabs[idx]) tabs[idx].classList.add('active');
  var panel = document.getElementById('sbt-'+tab);
  if(panel){panel.style.display='block';panel.classList.add('active');}
}

function resetScriptBuilder() {
  document.getElementById('sb-form-wrap').style.display='block';
  document.getElementById('sb-output').style.display='none';
  document.getElementById('sb-loading').style.display='none';
  sbResults = {};
}

function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(function(){
    var orig = btn.textContent;
    btn.textContent = '✓ Copied';
    setTimeout(function(){btn.textContent=orig;}, 2000);
  });
}

function copyAllScripts() {
  var all = Object.values(sbResults).join('\n\n---\n\n');
  navigator.clipboard.writeText(all).then(function(){
    var btn = event.target.closest('button');
    var orig = btn.innerHTML;
    btn.textContent = '✓ Copied All';
    setTimeout(function(){btn.innerHTML=orig;}, 2000);
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

function closeDropdowns(){
  // dropdowns close naturally on mouseleave — this is a no-op hook for future use
}

function toggleMobileNav(){
  var btn=document.getElementById('navHamburger');
  var drawer=document.getElementById('mobileNavDrawer');
  btn.classList.toggle('open');
  drawer.classList.toggle('open');
}
function closeMobileNav(){
  var btn=document.getElementById('navHamburger');
  var drawer=document.getElementById('mobileNavDrawer');
  if(btn) btn.classList.remove('open');
  if(drawer) drawer.classList.remove('open');
}

function showPage(id){
  var current = document.querySelector('.page.active');
  if(current){
    current.classList.add('page-exit');
    setTimeout(function(){
      current.classList.remove('active','page-exit');
      current.style.display='none';
      setTimeout(function(){ current.style.display=''; }, 50);
      _activatePage(id);
    }, 200);
  } else {
    _activatePage(id);
  }
}
function _activatePage(id){
  document.querySelectorAll('.nav-links a').forEach(function(a){a.classList.remove('active');});
  var p=document.getElementById('page-'+id);
  if(!p){
    p=document.getElementById('page-404');
  }
  if(p){
    p.style.display='block';
    p.classList.add('active','page-enter');
    setTimeout(function(){ p.classList.remove('page-enter'); p.style.display=''; }, 460);
    setTimeout(function(){ revealInView(p); }, 80);
  }
  var n=document.getElementById('nav-'+id);if(n)n.classList.add('active');
  window.scrollTo(0,0);
  if(id==='how'){setTimeout(initHowAnimations,60);}
  // close mobile nav
  var drawer=document.getElementById('mobileNavDrawer');
  var btn=document.getElementById('navHamburger');
  if(drawer)drawer.classList.remove('open');
  if(btn)btn.classList.remove('open');
}
function switchSeg(id,btn){
  document.querySelectorAll('.seg-panel').forEach(function(p){p.classList.remove('active');});
  document.querySelectorAll('.seg-tab').forEach(function(t){t.classList.remove('active');});
  var p=document.getElementById('seg-'+id);if(p)p.classList.add('active');
  btn.classList.add('active');
}
function switchFaq(id,btn){
  document.querySelectorAll('.faq-sec').forEach(function(s){s.classList.remove('active');});
  document.querySelectorAll('.faq-nb').forEach(function(b){b.classList.remove('active');});
  var s=document.getElementById('faq-'+id);if(s)s.classList.add('active');
  btn.classList.add('active');
}
function toggleFaq(el){
  var item=el.closest('.faq-item'),isOpen=item.classList.contains('open');
  item.closest('.faq-sec').querySelectorAll('.faq-item').forEach(function(i){i.classList.remove('open');});
  if(!isOpen)item.classList.add('open');
}
function handleApply(e) {
  if(e) e.preventDefault();
  var form = e.target;
  var data = new FormData(form);
  var lines = [];
  lines.push('Name: ' + (data.get('first_name')||'') + ' ' + (data.get('last_name')||''));
  lines.push('Email: ' + (data.get('email')||''));
  lines.push('Phone: ' + (data.get('phone')||''));
  lines.push('Company: ' + (data.get('company')||''));
  lines.push('Business Type: ' + (data.get('business_type')||''));
  lines.push('Client Volume: ' + (data.get('client_volume')||''));
  lines.push('States: ' + (data.get('states')||''));
  lines.push('Tier: ' + (data.get('tier')||'Not selected'));
  lines.push('Notes: ' + (data.get('notes')||''));
  var body = 'New Partner Application\n\n' + lines.join('\n');
  window.location.href = 'mailto:partners@communitytax.com?subject=' + encodeURIComponent('New Partner Application — ' + (data.get('company')||'')) + '&body=' + encodeURIComponent(body);
  var btn = form.querySelector('button[type="submit"], .f-submit');
  if(btn){btn.textContent='Sent — check your email client';btn.disabled=true;btn.style.opacity='0.7';}
}
function initHowAnimations(){
  var hp=document.getElementById('page-how');if(!hp)return;
  hp.querySelectorAll('.fade-up,.slide-up,.tl-cell,.ph-cell-a').forEach(function(el){el.classList.remove('in-view');});
  var line=document.getElementById('phasesLine');if(line)line.classList.remove('drawn');
  var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('in-view');});},{threshold:0.15});
  hp.querySelectorAll('.fade-up,.slide-up,.tl-cell').forEach(function(el){obs.observe(el);});
  var phObs=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        document.querySelectorAll('.ph-cell-a').forEach(function(c,i){setTimeout(function(){c.classList.add('in-view');},i*130);});
        setTimeout(function(){var l=document.getElementById('phasesLine');if(l)l.classList.add('drawn');},200);
        phObs.disconnect();
      }
    });
  },{threshold:0.3});
  var wrap=hp.querySelector('.phases-wrap');if(wrap)phObs.observe(wrap);
}

// Modal
var expCurrent=0,expTotal=4;
function openExploreModal(){
  expCurrent=0;updateExp();
  document.getElementById('exploreModal').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeExploreModal(){
  document.getElementById('exploreModal').classList.remove('open');
  document.body.style.overflow='';
}
function closeExploreModalBg(e){
  if(e.target===document.getElementById('exploreModal'))closeExploreModal();
}
function closeAndNav(page){
  closeExploreModal();
  setTimeout(function(){showPage(page);},220);
}
function shiftCard(dir){expCurrent=Math.max(0,Math.min(expTotal-1,expCurrent+dir));updateExp();}
function goToCard(i){expCurrent=i;updateExp();}
function updateExp(){
  document.getElementById('expTrack').style.transform='translateX(-'+(expCurrent*100)+'%)';
  document.querySelectorAll('.exp-dot').forEach(function(d,i){d.classList.toggle('active',i===expCurrent);});
  document.getElementById('expPrev').disabled=expCurrent===0;
  document.getElementById('expNext').disabled=expCurrent===expTotal-1;
  var hints=['Swipe or use arrows to explore','Keep going →','Almost there →','Ready to dive in?'];
  var hint=document.getElementById('expHint');if(hint)hint.textContent=hints[expCurrent];
}
document.addEventListener('keydown',function(e){
  if(!document.getElementById('exploreModal').classList.contains('open'))return;
  if(e.key==='Escape')closeExploreModal();
  if(e.key==='ArrowRight')shiftCard(1);
  if(e.key==='ArrowLeft')shiftCard(-1);
});

// Radar Chart
(function(){
  var dims = {
    v: {
      color:'#4BA3FF', spokeId:'spoke-v', dotId:'dot-v', lblId:'lbl-v',
      cx:210, cy:50,
      polyPoints: function(s){ return '210,'+(210-s)+' 370,210 210,370 50,210'; },
      tipAnchor: function(w,h){ return {x:w/2-124, y:40}; },
      eyebrow:'Value', quote:'"There\'s a gap in how most financial organizations serve clients with tax problems. We built a program to close it together."',
      body:'Every client you\'ve lost to a tax debt situation was money that didn\'t have to walk out the door. Partners who bring this program in unlock a revenue line nobody else saw coming.',
      items:['Do we solve a critical customer problem?','Total addressable market opportunity','Short-term SAM/SOM revenue potential','Company report card: customers, growth, sales']
    },
    r: {
      color:'#f87171', spokeId:'spoke-r', dotId:'dot-r', lblId:'lbl-r',
      cx:370, cy:210,
      polyPoints: function(s){ return '210,50 '+(210+s)+',210 210,370 50,210'; },
      tipAnchor: function(w,h){ return {x:w-268, y:h/2-110}; },
      eyebrow:'Risks', quote:'"We ask hard questions upfront so neither of us is surprised six months in."',
      body:'The compliance, security, and integration criteria aren\'t bureaucracy. They\'re how we make sure nothing surfaces six months in to embarrass either of us.',
      items:['Modern tech stack & integration capability','Competing products or competitor relationships','Support capabilities as we scale together','Privacy, security & compliance posture']
    },
    c: {
      color:'#00E5CC', spokeId:'spoke-c', dotId:'dot-c', lblId:'lbl-c',
      cx:210, cy:370,
      polyPoints: function(s){ return '210,50 370,210 210,'+(210+s)+' 50,210'; },
      tipAnchor: function(w,h){ return {x:w/2-124, y:h-290}; },
      eyebrow:'Commitment', quote:'"We\'re clear about what we need from you — and equally clear about what we handle ourselves."',
      body:'Everything we ask of you is finite and documented. A point of contact, a data agreement, a shared revenue structure. What we don\'t ask for is your team\'s bandwidth.',
      items:['Revenue share alignment and margin structure','Willingness to market and position CTAX','Dedicated primary point of contact','Standard data sharing agreement']
    },
    e: {
      color:'#c4a0ff', spokeId:'spoke-e', dotId:'dot-e', lblId:'lbl-e',
      cx:50, cy:210,
      polyPoints: function(s){ return '210,50 370,210 210,370 '+(210-s)+',210'; },
      tipAnchor: function(w,h){ return {x:20, y:h/2-110}; },
      eyebrow:'Effectiveness', quote:'"The partnerships that perform best are the ones where both sides bring real capability to the table."',
      body:'Most referral programs fail because there\'s no infrastructure for execution — no tracking, no accountability. We measure conversion at every stage.',
      items:['Industry expertise and vertical knowledge','Sales cycle and historical conversion rate','SSO integration willingness and timeline','Referral volume capacity']
    }
  };
  var fillMap={v:'rgba(75,163,255,0.13)',r:'rgba(248,113,113,0.1)',c:'rgba(0,229,204,0.09)',e:'rgba(196,160,255,0.1)'};
  var defaultPoly='210,100 310,210 210,320 110,210';
  var active=null, mode='explore', scores={v:3,r:3,c:3,e:3};

  function scoreToPoint(k,score){
    var d=dims[k],maxR=160,r=maxR*(score/5);
    var dx=d.cx-210,dy=d.cy-210,len=Math.sqrt(dx*dx+dy*dy);
    return {x:210+(dx/len)*r,y:210+(dy/len)*r};
  }

  function updateScorePoly(){
    var v=scoreToPoint('v',scores.v),r=scoreToPoint('r',scores.r),c=scoreToPoint('c',scores.c),e=scoreToPoint('e',scores.e);
    var poly=document.getElementById('radarScorePoly');
    if(poly)poly.setAttribute('points',v.x+','+v.y+' '+r.x+','+r.y+' '+c.x+','+c.y+' '+e.x+','+e.y);
    var avg=(scores.v+scores.r+scores.c+scores.e)/4;
    var stroke=avg>=4?'rgba(75,163,255,0.7)':avg>=3?'rgba(75,163,255,0.45)':'rgba(248,113,113,0.5)';
    var fill=avg>=4?'rgba(75,163,255,0.08)':avg>=3?'rgba(75,163,255,0.04)':'rgba(248,113,113,0.05)';
    if(poly){poly.setAttribute('stroke',stroke);poly.setAttribute('fill',fill);}
  }

  var descriptors={
    v:{
      1:"Tax debt situations rarely come up in your client relationships, and there's no established process for introducing outside services. That's okay — it just means we'd be building from zero together.",
      2:"You encounter tax debt issues occasionally but haven't formalized a way to address them. There's latent opportunity here that a light referral structure could start to unlock.",
      3:"A meaningful portion of your clients carry unresolved tax debt, and you have some structure for introducing third-party services — though it's not yet a formal process.",
      4:"Tax-related financial distress is a recurring theme in your book, and you already have some muscle memory for cross-referring or co-servicing clients who need outside help.",
      5:"Tax debt is a consistent, high-volume issue across your client base, and you have established workflows for connecting clients with specialized services. The opportunity here is immediate and significant."
    },
    r:{
      1:"Your infrastructure is still maturing — legacy systems, limited compliance documentation, or existing vendor relationships that could create conflicts. Nothing insurmountable, but worth addressing before we go deeper.",
      2:"You have some operational gaps that would need to be resolved before a formal partnership — whether that's tech stack limitations, compliance gray areas, or competing arrangements that need to be clarified.",
      3:"Your tech infrastructure is reasonably current, there are no major competitive conflicts, and your compliance posture is generally solid — though not fully documented at a partner level.",
      4:"You're operationally clean: modern stack, documented compliance practices, no meaningful conflicts, and a clear path to data-sharing agreements if needed.",
      5:"You have a mature, well-documented operational environment — enterprise-grade compliance, clean vendor relationships, and the infrastructure to support a deep integration with confidence on both sides."
    },
    c:{
      1:"Right now, bandwidth for a new program is limited and there's no clear internal owner. A partnership would be difficult to activate without someone to carry it forward on your side.",
      2:"There's genuine interest but limited capacity — you'd want a very lightweight structure with minimal asks on your team, and co-promotion isn't realistic in the near term.",
      3:"You're open to co-promoting the program and can assign someone to manage the relationship, but internal bandwidth is limited and you'd need a light-touch integration to get started.",
      4:"You have a designated person who can own this, organizational appetite to actively promote it, and a clear picture of how revenue share aligns with your existing model.",
      5:"You're fully bought in — dedicated internal champion, executive alignment, and a willingness to deeply integrate this into how you serve clients. This is a strategic partnership, not a side arrangement."
    },
    e:{
      1:"Your team doesn't yet have much familiarity with tax resolution services or referral-based revenue models, and there's no existing motion to build from. A partnership would require significant onboarding.",
      2:"You have some relevant expertise and a loose cross-sell process, but conversion of referrals has been inconsistent. The capability is there — it just needs structure.",
      3:"Your team understands the space and has a working referral or cross-sell motion — you've done something like this before, even if not at full scale.",
      4:"You have strong industry expertise, a proven referral process, and a track record of converting these opportunities. Your clients trust your recommendations and act on them.",
      5:"You're operating at the highest level — deep domain knowledge, a high-conversion referral engine, and the volume to make a Strategic-tier partnership the obvious structure for both sides."
    }
  };

  var resultTiers=[
    {test:function(s,a){return a<2.2||Math.min(s.v,s.r,s.c,s.e)<=1;},
     bg:'rgba(248,113,113,0.06)',border:'rgba(248,113,113,0.18)',icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
     title:"The timing might not be right — and that's worth knowing.",
     text:"Based on where you're landing, at least one dimension needs more foundation before a partnership would create real value for either of us. That's not a door closing — it's useful information. The organizations that work best with us tend to have a clear internal owner, some baseline client volume with tax exposure, and the operational footing to move quickly once they're in. If you're building toward that, we're happy to reconnect.",
     cta:null},
    {test:function(s,a){return a<3.0;},
     bg:'rgba(255,190,50,0.05)',border:'rgba(255,190,50,0.18)',icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 8 16 12 12 16 8 12 12 8"/></svg>',
     title:"There's something here — a few things to sort out first.",
     text:"You're showing up strong in some areas and lighter in others. That's actually pretty common at this stage — a lot of our best partners looked exactly like this when they first reached out. The FAQ walks through what the early partnership structure looks like and what we ask for on each side. Worth a read before we talk.",
     cta:'faq',ctaText:'See what the program actually asks for →',ctaStyle:'background:rgba(255,190,50,0.1);color:#f5c842;border:1px solid rgba(255,190,50,0.18)'},
    {test:function(s,a){return a<3.8&&Math.min(s.v,s.r,s.c,s.e)>=2;},
     bg:'rgba(11,95,216,0.06)',border:'rgba(75,163,255,0.18)',icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
     title:"This looks like a real fit.",
     text:"Across the dimensions that matter most for getting started, you're in a good place. A Direct partnership is probably the right structure — low overhead on your end, clear economics, and a path to deepening the relationship as volume grows. The intake form takes about five minutes and gets a conversation started.",
     cta:'apply',ctaText:'Start the conversation →',ctaStyle:'background:rgba(75,163,255,0.12);color:#4BA3FF;border:1px solid rgba(75,163,255,0.22)'},
    {test:function(s,a){return a>=3.8&&Math.min(s.v,s.r,s.c,s.e)>=3;},
     bg:'rgba(0,229,204,0.05)',border:'rgba(0,229,204,0.2)',icon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 8 16 12 12 16 8 12 12 8"/></svg>',
     title:"Strong alignment across the board.",
     text:"You're scoring well on every dimension — which usually means an Enterprise or Strategic structure is worth exploring. Those tiers come with meaningfully higher revenue share, a dedicated account relationship, and a more tailored integration. Norm handles these conversations directly and can walk you through what that looks like for your specific situation.",
     cta:'apply',ctaText:'Let\'s talk about a deeper structure →',ctaStyle:'background:rgba(0,229,204,0.1);color:#00E5CC;border:1px solid rgba(0,229,204,0.18)'}
  ];

  function updateResult(){
    var avg=(scores.v+scores.r+scores.c+scores.e)/4;
    var tier=resultTiers[0];
    for(var i=resultTiers.length-1;i>=0;i--){if(resultTiers[i].test(scores,avg)){tier=resultTiers[i];break;}}
    var el=document.getElementById('critResult');
    if(!el)return;
    el.style.background=tier.bg;el.style.borderColor=tier.border;
    var ctaHtml=tier.cta?['<button class="crit-result-cta" style="',tier.ctaStyle,'" onclick="showPage(&quot;',tier.cta,'&quot;">',(tier.ctaText||'Apply'),'</button>'].join(''):['<p style="font-size:15px;color:rgba(255,255,255,0.65);margin-top:4px">Address the low-scoring dimensions first, then revisit.</p>'].join('');
    el.innerHTML='<div class="crit-result-icon">'+tier.icon+'</div><div class="crit-result-body"><div class="crit-result-title">'+tier.title+'</div><p class="crit-result-text">'+tier.text+'</p>'+ctaHtml+'</div>';
    el.classList.add('show');
  }

  function fireSonar(k){
    var d=dims[k],g=document.getElementById('sonarGroup');
    if(!g)return;
    var c=document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('cx',d.cx);c.setAttribute('cy',d.cy);c.setAttribute('r','6');
    c.setAttribute('fill','none');c.setAttribute('stroke',d.color);c.setAttribute('stroke-width','1.5');c.setAttribute('opacity','0.9');
    g.appendChild(c);
    var start=null,dur=1100;
    function step(ts){
      if(!start)start=ts;var p=Math.min((ts-start)/dur,1);
      c.setAttribute('r',6+p*88);c.setAttribute('opacity',0.85*(1-p));
      if(p<1)requestAnimationFrame(step);else if(c.parentNode)c.parentNode.removeChild(c);
    }
    requestAnimationFrame(step);
  }

  function hideTooltip(){var t=document.getElementById('critTooltip');if(t)t.classList.remove('visible');}

  function showTooltip(k){
    var d=dims[k],wrap=document.querySelector('.crit-radar-svg-wrap'),t=document.getElementById('critTooltip');
    if(!t||!wrap)return;
    document.getElementById('ctLabel').textContent=d.eyebrow;
    document.getElementById('ctLabel').style.color=d.color;
    document.getElementById('ctQuote').textContent=d.quote;
    document.getElementById('ctBody').textContent=d.body;
    var list=document.getElementById('ctList');list.innerHTML='';
    d.items.forEach(function(item){var li=document.createElement('li');li.textContent=item;list.appendChild(li);});
    var bmap={v:'rgba(75,163,255,0.3)',r:'rgba(248,113,113,0.3)',c:'rgba(0,229,204,0.25)',e:'rgba(196,160,255,0.25)'};
    t.style.borderColor=bmap[k];
    var w=wrap.offsetWidth,h=wrap.offsetHeight,pos=d.tipAnchor(w,h);
    t.style.left=Math.max(0,Math.min(pos.x,w-258))+'px';
    t.style.top=Math.max(0,Math.min(pos.y,h-300))+'px';
    t.classList.add('visible');
  }

  function resetExplore(){
    Object.keys(dims).forEach(function(k){
      var d=dims[k];
      var spoke=document.getElementById(d.spokeId),dot=document.getElementById(d.dotId),lbl=document.getElementById(d.lblId);
      if(spoke){spoke.setAttribute('stroke-width','1');spoke.style.opacity='0.5';}
      if(dot){dot.setAttribute('r','5');dot.style.opacity='1';}
      if(lbl)lbl.style.opacity='0.55';
    });
    var poly=document.getElementById('radarPoly');
    if(poly){poly.setAttribute('points',defaultPoly);poly.setAttribute('stroke','rgba(75,163,255,0.4)');poly.setAttribute('fill','rgba(11,95,216,0.12)');}
    hideTooltip();active=null;
  }

  function activateDim(k){
    if(mode!=='explore')return;
    if(active===k){resetExplore();return;}
    Object.keys(dims).forEach(function(j){
      if(j===k)return;
      var dj=dims[j];
      var spoke=document.getElementById(dj.spokeId),dot=document.getElementById(dj.dotId),lbl=document.getElementById(dj.lblId);
      if(spoke){spoke.setAttribute('stroke-width','1');spoke.style.opacity='0.18';}
      if(dot){dot.setAttribute('r','4');dot.style.opacity='0.35';}
      if(lbl)lbl.style.opacity='0.18';
    });
    active=k;
    var d=dims[k];
    var spoke=document.getElementById(d.spokeId),dot=document.getElementById(d.dotId),lbl=document.getElementById(d.lblId);
    if(spoke){spoke.setAttribute('stroke',d.color);spoke.setAttribute('stroke-width','2.5');spoke.style.opacity='1';}
    if(dot){dot.setAttribute('r','8');dot.setAttribute('fill',d.color);dot.style.opacity='1';}
    if(lbl)lbl.style.opacity='1';
    var poly=document.getElementById('radarPoly');
    if(poly){poly.setAttribute('points',d.polyPoints(165));poly.setAttribute('stroke',d.color);poly.setAttribute('fill',fillMap[k]);}
    fireSonar(k);showTooltip(k);
  }

  window.onSlider=function(k,val){
    scores[k]=parseInt(val);
    document.getElementById('scoreVal-'+k).textContent=val;
    var sl=document.getElementById('slider-'+k);
    if(sl)sl.style.setProperty('--pct',((val-1)/4*100)+'%');
    var desc=document.getElementById('desc-'+k);
    if(desc&&descriptors[k])desc.textContent=descriptors[k][parseInt(val)];
    updateScorePoly();updateResult();fireSonar(k);
  };

  window.setCritMode=function(m){
    mode=m;
    document.getElementById('modeExplore').classList.toggle('active',m==='explore');
    document.getElementById('modeAssess').classList.toggle('active',m==='assess');
    var aw=document.getElementById('critAssessWrap'),hint=document.getElementById('critHint'),
        tt=document.getElementById('critTooltip'),sp=document.getElementById('radarScorePoly'),mp=document.getElementById('radarPoly');
    if(m==='explore'){
      if(aw)aw.classList.remove('show');if(hint)hint.style.display='';
      if(sp)sp.style.display='none';if(mp)mp.style.display='';
      resetExplore();
    } else {
      hideTooltip();
      if(aw)aw.classList.add('show');if(hint)hint.style.display='none';
      if(sp){sp.style.display='';updateScorePoly();}if(mp)mp.style.display='none';
      Object.keys(dims).forEach(function(k){
        var d=dims[k];
        var spoke=document.getElementById(d.spokeId),dot=document.getElementById(d.dotId),lbl=document.getElementById(d.lblId);
        if(spoke){spoke.setAttribute('stroke',d.color);spoke.setAttribute('stroke-width','1.5');spoke.style.opacity='0.55';}
        if(dot){dot.setAttribute('r','5');dot.style.opacity='0.8';}
        if(lbl)lbl.style.opacity='0.65';
      });
      updateResult();
      ['v','r','c','e'].forEach(function(k){
        var sl=document.getElementById('slider-'+k);
        if(sl)sl.style.setProperty('--pct',((scores[k]-1)/4*100)+'%');
        var desc=document.getElementById('desc-'+k);
        if(desc&&descriptors[k])desc.textContent=descriptors[k][scores[k]];
      });
    }
  };

  function initRadar(){
    Object.keys(dims).forEach(function(k){
      ['dot-'+k,'lbl-'+k,'spoke-'+k].forEach(function(id){
        var el=document.getElementById(id);if(!el)return;
        el.style.cursor='pointer';
        el.addEventListener('mouseenter',function(){if(mode==='explore')activateDim(k);});
        el.addEventListener('touchstart',function(e){e.preventDefault();if(mode==='explore')activateDim(k);},{passive:false});
      });
    });
    var wrap=document.querySelector('.crit-radar-svg-wrap');
    if(wrap)wrap.addEventListener('mouseleave',function(){if(mode==='explore')resetExplore();});
    document.addEventListener('touchstart',function(e){
      var w=document.querySelector('.crit-radar-svg-wrap');
      if(w&&!w.contains(e.target)&&active&&mode==='explore')resetExplore();
    },{passive:true});
    var poly=document.getElementById('radarPoly');
    if(poly){poly.setAttribute('points','210,210 210,210 210,210 210,210');setTimeout(function(){poly.setAttribute('points',defaultPoly);},80);}
    Object.keys(dims).forEach(function(k){
      var lbl=document.getElementById('lbl-'+k);if(lbl)lbl.style.opacity='0.55';
      var spoke=document.getElementById(dims[k].spokeId);if(spoke)spoke.style.opacity='0.5';
    });
  }

  var origShowPage3=window.showPage;
  window.showPage=function(id){origShowPage3(id);if(id==='how')setTimeout(initRadar,120);};
})();

function handleResourceDownload(btn, name) {
  var resources = {
    'Partner Program Overview': 'COMMUNITY TAX - PARTNER PROGRAM OVERVIEW\n\n1. About Community Tax\n- 15+ years in IRS tax resolution\n- $2.3B in tax debt resolved\n- 120,000+ clients served\n- Licensed in 48 states\n\n2. Partner Program\n- 3 tiers: Direct (8%), Enterprise (13%), Strategic (18%)\n- ~80% client conversion rate\n- $295 investigation fee (low barrier for clients)\n- Dedicated account manager for Enterprise+\n\n3. How It Works\n- You refer clients with IRS tax debt\n- We handle all resolution work\n- You earn revenue share on every case\n- Average case value: $15,000-$40,000\n\n4. Getting Started\n- Apply at partners.communitytax.com\n- 15-min intro call with partner manager\n- Sign agreement, get portal access\n- Submit first referral in < 1 week\n\nContact: partners@communitytax.com | 1-855-332-2873',
    'Revenue Share Breakdown': 'COMMUNITY TAX - REVENUE SHARE BREAKDOWN\n\nDirect Tier (8% share)\n- No minimum referrals\n- Self-service portal\n- Example: $20K case = $1,600 your share\n\nEnterprise Tier (13% share)\n- 10+ referrals/quarter\n- Dedicated account manager\n- Co-branded materials\n- Example: $20K case = $2,600 your share\n\nStrategic Tier (18% share)\n- 25+ referrals/quarter\n- API integration available\n- Custom reporting\n- White-label options\n- Example: $20K case = $3,600 your share\n\nPayout Schedule: Monthly, NET-30\nPayment Methods: ACH, Check\n\nContact: partners@communitytax.com',
    'Client Identification Guide': 'COMMUNITY TAX - CLIENT IDENTIFICATION GUIDE\n\nSigns Your Client May Need Tax Resolution:\n\n1. IRS Notices\n- CP14 (Balance Due)\n- CP501-CP504 (Collection notices)\n- Letter 1058 (Intent to Levy)\n- Letter 3172 (Notice of Federal Tax Lien)\n\n2. Verbal Cues\n- "I haven\'t filed in a few years"\n- "I owe the IRS but can\'t afford to pay"\n- "I got a letter about a lien/levy"\n- "My refund was offset"\n\n3. Financial Red Flags\n- Tax liens on credit report\n- Wage garnishment\n- Bank levy\n- Unfiled returns (2+ years)\n- Estimated debt > $10,000\n\nThe Conversation:\n"I work with a firm that specializes in IRS resolution. They\'ve resolved $2.3B in tax debt. The first step is a $295 investigation - would you like me to connect you?"\n\nContact: partners@communitytax.com',
    'Email Referral Template Pack': 'COMMUNITY TAX - EMAIL REFERRAL TEMPLATES\n\nTemplate 1: Initial Outreach\nSubject: Quick question about your tax situation\n\nHi [Name],\n\nDuring our recent conversation, you mentioned some concerns about [IRS notices/back taxes/unfiled returns]. I wanted to let you know about a resource that might help.\n\nI partner with Community Tax, a firm that specializes in IRS tax resolution. They\'ve helped resolve over $2.3 billion in tax debt for 120,000+ clients.\n\nThe first step is a $295 tax investigation where they review your full IRS account and present your options. No obligation beyond that.\n\nWould you like me to connect you? I can make a warm introduction.\n\nBest,\n[Your Name]\n\n---\nTemplate 2: Follow-Up\nSubject: Following up on tax resolution\n\nHi [Name], just checking in on this...',
    'Objection Handling Playbook': 'COMMUNITY TAX - OBJECTION HANDLING PLAYBOOK\n\nObjection: "I can\'t afford it"\nResponse: "The investigation is only $295, and resolution fees can be structured into affordable monthly payments. Most clients find the cost of NOT resolving far exceeds the cost of resolution - penalties and interest compound daily."\n\nObjection: "I\'ll handle it myself"\nResponse: "You absolutely can. But the IRS has a team of professionals on their side. Community Tax has enrolled agents and tax attorneys who negotiate these cases every day. Their clients see an average resolution of 70-80% of what they owe."\n\nObjection: "I don\'t trust tax resolution companies"\nResponse: "That\'s fair - there are bad actors in this space. Community Tax has been around 15 years, resolved $2.3B, and has 120K+ clients. They\'re BBB accredited. I personally partner with them because I trust them with my clients."\n\nObjection: "I\'ll wait and see"\nResponse: "The IRS charges penalties and interest daily. A $20K debt can grow to $30K in 18 months just from penalties. The sooner you act, the more options you have."',
    'Partner Kit: Everything You Need': 'COMMUNITY TAX - COMPLETE PARTNER KIT\n\nThis kit contains everything you need to start referring clients:\n\n1. Program Overview (see Partner Program Overview)\n2. Revenue Share Details (see Revenue Share Breakdown)\n3. Client Identification Guide (see guide)\n4. Email Templates (see template pack)\n5. Objection Handling (see playbook)\n6. Compliance Guidelines:\n   - Never guarantee specific outcomes\n   - Always disclose your referral relationship\n   - Direct clients to communitytax.com for verification\n   - Do not provide tax advice unless licensed\n\n7. Key Contacts:\n   Partner Support: partners@communitytax.com\n   New Partnerships: 1-855-332-2873\n   Hours: Mon-Fri, 8am-7pm CST\n\n8. Quick Start:\n   Step 1: Log in to Partner Portal\n   Step 2: Click "New Referral"\n   Step 3: Enter client name, phone, email, estimated debt\n   Step 4: We call them within 24 hours\n   Step 5: Track status in real-time'
  };

  var content = resources[name] || 'COMMUNITY TAX - ' + name.toUpperCase() + '\n\nThis resource is being prepared. Contact partners@communitytax.com for immediate access.';
  
  var blob = new Blob([content], {type: 'text/plain'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = name.replace(/[^a-zA-Z0-9 ]/g, '').replace(/ +/g, '-').toLowerCase() + '.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Downloaded';
  btn.style.background = 'rgba(0,229,204,0.1)';
  btn.style.color = 'var(--teal)';
  btn.style.borderColor = 'rgba(0,229,204,0.3)';
}
function handleResourceNotify() {
  var email = document.getElementById('res-notify-email').value;
  if (!email) return;
  document.getElementById('res-notify-msg').style.display = 'block';
  document.getElementById('res-notify-email').disabled = true;
  document.querySelector('.res-notify button').disabled = true;
}

// ── CLIENT QUALIFIER ──────────────────────────────────────
var cqAnalysisText = '';

function resetQualifier() {
  document.getElementById('cq-form-wrap').style.display = 'block';
  document.getElementById('cq-output').style.display = 'none';
  document.getElementById('cq-loading').style.display = 'none';
  document.getElementById('cq-error').style.display = 'none';
  cqAnalysisText = '';
}

function copyCqAnalysis() {
  navigator.clipboard.writeText(cqAnalysisText).then(function(){
    var btns = document.querySelectorAll('#cq-output .btn-s');
    btns.forEach(function(b){ if(b.textContent.indexOf('Copy')!==-1){ var o=b.innerHTML; b.innerHTML='Copied'; setTimeout(function(){b.innerHTML=o;},2000); }});
  });
}

async function qualifyClient() {
  if (!CTAX_API_KEY) { if (!promptForApiKey()) return; }

  var debt = document.getElementById('cq-debt').value;
  var issue = document.getElementById('cq-issue').value;
  var years = document.getElementById('cq-years').value;
  var notices = document.getElementById('cq-notices').value;
  var employment = document.getElementById('cq-employment').value;
  var notes = document.getElementById('cq-notes').value.trim();

  if (!debt || !issue || !years) {
    alert('Please fill in at least the tax debt, issue type, and years affected.');
    return;
  }

  document.getElementById('cq-form-wrap').style.display = 'none';
  document.getElementById('cq-loading').style.display = 'block';
  document.getElementById('cq-output').style.display = 'none';
  document.getElementById('cq-error').style.display = 'none';

  var msgs = ['Evaluating tax debt indicators...','Checking resolution eligibility...','Estimating case value...','Preparing talking points...'];
  var mi = 0, mel = document.getElementById('cq-loading-msg');
  var mint = setInterval(function(){ mi=(mi+1)%msgs.length; mel.textContent=msgs[mi]; }, 2500);

  var prompt = 'You are a senior intake analyst at Community Tax, a national IRS tax resolution firm (15 years, $2.3B resolved, 120K+ clients). A referral partner is asking whether a potential client is a good referral candidate.\n\n'
    + 'Program facts:\n'
    + '- Minimum qualifying tax debt: $7,000+\n'
    + '- Investigation fee: $295 ($500 for businesses)\n'
    + '- Average case value: $8,000-$80,000+\n'
    + '- Partner revenue per closed case: $1,500-$4,000\n'
    + '- Resolution options: Offer in Compromise (OIC), Installment Agreement (IA), Currently Not Collectible (CNC), Penalty Abatement, Innocent Spouse Relief, Lien/Levy Release, Audit Representation\n'
    + '- ~80% referral-to-consultation conversion rate\n'
    + '- Typical timeline: 30-90 days\n\n'
    + 'CLIENT PROFILE:\n'
    + '- Estimated tax debt: ' + debt + '\n'
    + '- Type of issue: ' + issue + '\n'
    + '- Years affected: ' + years + '\n'
    + '- IRS notices received: ' + (notices || 'Not provided') + '\n'
    + '- Employment type: ' + (employment || 'Not provided') + '\n'
    + (notes ? '- Additional context: ' + notes + '\n' : '')
    + '\nRespond in EXACTLY this format with sections separated by "---SECTION---":\n\n'
    + 'SECTION 1 — JSON (no other text):\n'
    + '{"verdict": "STRONG|LIKELY|WEAK|NOT_QUALIFIED", "verdict_title": "short title", "verdict_desc": "one sentence explanation", "resolution_path": "primary recommended program", "case_value_low": "$X,XXX", "case_value_high": "$XX,XXX", "commission_low": "$X,XXX", "commission_high": "$X,XXX"}\n'
    + 'Rules: verdict=STRONG if debt>$15k with active enforcement. LIKELY if debt>$7k with clear issue. WEAK if debt uncertain or borderline. NOT_QUALIFIED if debt clearly under $7k.\n\n'
    + 'SECTION 2 — ANALYSIS (2-3 paragraphs, use <b>bold</b> for key terms, no markdown/asterisks):\n'
    + 'Explain why this client does or does not qualify. Be specific about which resolution program fits and why. If the client has multiple issues, address each. Mention urgency factors (active levies, garnishments, etc.).\n\n'
    + 'SECTION 3 — TALKING POINTS (4-5 lines, each starting with <b>bold label:</b>):\n'
    + 'Give the partner specific things to say to this client. Frame each around the client\'s situation. Include how to bring up the $295 investigation fee naturally. Use plain, conversational language — not salesy.';

  try {
    var resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1200,
        messages: [{role: 'user', content: prompt}]
      })
    });
    if(!resp.ok) throw new Error(resp.status === 401 ? '401' : 'API returned ' + resp.status);
    var data = await resp.json();
    if(data.error) throw new Error(data.error.message || 'API error');
    var text = data.content && data.content[0] ? data.content[0].text : '';
    clearInterval(mint);

    var sections = text.split('---SECTION---');
    var jsonRaw = (sections[0] || '').trim();
    var analysis = (sections[1] || '').trim();
    var talking = (sections[2] || '').trim();

    // Parse JSON
    var result = {verdict:'LIKELY',verdict_title:'Likely Candidate',verdict_desc:'This client appears to be a reasonable referral.',resolution_path:'Installment Agreement',case_value_low:'$8,000',case_value_high:'$20,000',commission_low:'$1,500',commission_high:'$3,000'};
    try {
      var jm = jsonRaw.match(/\{[\s\S]*\}/);
      if(jm) result = JSON.parse(jm[0]);
    } catch(e){}

    // Store for copy
    cqAnalysisText = 'CLIENT QUALIFICATION ANALYSIS\n\nVerdict: ' + result.verdict_title + '\n' + result.verdict_desc + '\n\nResolution Path: ' + result.resolution_path + '\nEstimated Case Value: ' + result.case_value_low + ' - ' + result.case_value_high + '\nEstimated Commission: ' + result.commission_low + ' - ' + result.commission_high + '\n\n' + analysis.replace(/<[^>]+>/g, '') + '\n\nTalking Points:\n' + talking.replace(/<[^>]+>/g, '');

    // Verdict banner
    var verdictClass = 'cq-verdict-likely';
    var verdictIcon = '';
    if(result.verdict === 'STRONG'){ verdictClass = 'cq-verdict-strong'; verdictIcon = '\u2714'; }
    else if(result.verdict === 'LIKELY'){ verdictClass = 'cq-verdict-likely'; verdictIcon = '\u2714'; }
    else if(result.verdict === 'WEAK'){ verdictClass = 'cq-verdict-weak'; verdictIcon = '\u26A0'; }
    else if(result.verdict === 'NOT_QUALIFIED'){ verdictClass = 'cq-verdict-no'; verdictIcon = '\u2716'; }

    var vEl = document.getElementById('cq-verdict');
    vEl.className = 'cq-verdict ' + verdictClass;
    vEl.innerHTML = '<div class="cq-verdict-icon">' + verdictIcon + '</div><div class="cq-verdict-text"><div class="cq-verdict-title">' + (result.verdict_title || result.verdict) + '</div><div class="cq-verdict-desc">' + (result.verdict_desc || '') + '</div></div>';

    // Detail cards
    document.getElementById('cq-path').textContent = result.resolution_path || 'See analysis';
    document.getElementById('cq-value').textContent = (result.case_value_low || '$8,000') + ' \u2013 ' + (result.case_value_high || '$20,000');
    document.getElementById('cq-commission').textContent = (result.commission_low || '$1,500') + ' \u2013 ' + (result.commission_high || '$3,000');

    // Analysis & talking points
    document.getElementById('cq-analysis-text').innerHTML = analysis;
    document.getElementById('cq-talking-text').innerHTML = talking;

    document.getElementById('cq-loading').style.display = 'none';
    document.getElementById('cq-output').style.display = 'block';

  } catch(err) {
    clearInterval(mint);
    document.getElementById('cq-loading').style.display = 'none';
    document.getElementById('cq-form-wrap').style.display = 'block';
    var errDiv = document.getElementById('cq-error');
    var isAuth = err.message && err.message.indexOf('401') !== -1;
    var msg = isAuth
      ? 'Invalid API key. Please check your key and try again.'
      : 'Unable to qualify this client right now. Please try again in a moment.';
    errDiv.innerHTML = msg + ' <a href="#" onclick="document.getElementById(\'cq-error\').style.display=\'none\';return false" style="color:var(--blue);text-decoration:underline;margin-left:8px">Dismiss</a>';
    errDiv.style.display = 'block';
  }
}

// Revenue Calculator
var _calcTier=1;
function selectTier(t){
  _calcTier=t;
  [1,2,3].forEach(function(n){
    var b=document.getElementById('tier-btn-'+n);
    if(b) b.classList.toggle('active',n===t);
  });
  calcUpdate();
}
function calcUpdate(){
  var clients=parseInt(document.getElementById('sl-clients').value);
  var pct=parseInt(document.getElementById('sl-pct').value);
  var tier=_calcTier;
  var tierNames=['Direct','Enterprise','Strategic'];
  var tierShare=[0.08,0.13,0.18];
  var avgCase=4800;
  var convRate=0.80;
  var referralRate=0.35;
  var debtors=Math.round(clients*(pct/100));
  var referrals=Math.round(debtors*referralRate);
  var closed=Math.round(referrals*convRate);
  var perCase=Math.round(avgCase*tierShare[tier-1]);
  var annual=closed*perCase;
  document.getElementById('cv-clients').textContent=clients.toLocaleString()+' clients';
  document.getElementById('cv-pct').textContent=pct+'% of clients';
  document.getElementById('res-annual').textContent='$'+annual.toLocaleString();
  document.getElementById('res-debtors').textContent=debtors.toLocaleString();
  document.getElementById('res-referrals').textContent=referrals.toLocaleString();
  document.getElementById('res-closed').textContent=closed.toLocaleString();
  document.getElementById('res-percase').textContent='$'+perCase.toLocaleString();
}
calcUpdate();

// Dynamic tier messaging on apply page
var tierMessages={
  'direct':'<strong>Direct tier</strong> is a great starting point — low requirements, no minimums, and you can upgrade anytime. Perfect for testing the program with your existing client base.',
  'enterprise':'<strong>Enterprise tier</strong> partners get API integration support, co-marketing resources, and dedicated revenue optimization. Ideal for platforms with 500+ active clients.',
  'strategic':'<strong>Strategic tier</strong> is our highest-engagement partnership — dedicated channel manager, MDF, QBRs, and custom revenue structure. Best for enterprise organizations with significant referral volume.',
  'unsure':'No problem — our team will assess your client base and volume during the intro call and recommend the tier that maximizes your revenue.'
};
document.querySelectorAll('input[name="tier"]').forEach(function(r){
  r.addEventListener('change',function(){
    var bar=document.getElementById('tier-context-bar');
    var msg=document.getElementById('tier-context-msg');
    if(tierMessages[this.value]){
      msg.innerHTML=tierMessages[this.value];
      bar.style.display='block';
    }
  });
});


// ── AD MAKER ──
var amLogoDataUrl = null;
var CTAX_LOGO_WHITE = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMjUwNi4zMyAyNzAuMzMiPgogIDxkZWZzPgogICAgPHN0eWxlPgogICAgICAuY2xzLTEgewogICAgICAgIGZpbGw6IHVybCgjbGluZWFyLWdyYWRpZW50LTMpOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6IHVybCgjbGluZWFyLWdyYWRpZW50LTIpOwogICAgICB9CgogICAgICAuY2xzLTMgewogICAgICAgIGZpbGw6IHVybCgjbGluZWFyLWdyYWRpZW50KTsKICAgICAgfQoKICAgICAgLmNscy00IHsKICAgICAgICBmaWxsOiAjZTJlY2VmOwogICAgICB9CiAgICA8L3N0eWxlPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQiIHgxPSIxOS4yMiIgeTE9Ii4wNCIgeDI9IjIwNi42NCIgeTI9IjE4OS4wMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM0OGVhZDYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNDUiIHN0b3AtY29sb3I9IiNhMWYyZmYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNjBlN2ZmIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQtMiIgeDE9IjM4LjQ4IiB5MT0iNjIuMzMiIHgyPSIxNzEuNTciIHkyPSIyMDguNiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMxOGQxZjgiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDBiNGRlIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQtMyIgeDE9Ii04Ni43MSIgeTE9IjIxNy41NSIgeDI9IjI2My4zNSIgeTI9IjM5LjQyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2UyZWNlZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMjYyYjQiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxnIGlkPSJMYXllcl8xLTIiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+CiAgICA8Zz4KICAgICAgPGc+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0zIiBkPSJNMjcxLjY0LDE0NS41Yy0xLjMxLDE5LjkzLTcuMDIsMzguNzQtMTYuMTksNTUuNDloLTExMy41Yy0uNDcuMDktMS4wMy4wOS0xLjU5LjA5LTEuOTYsMC0zLjkzLS4wOS01Ljg5LS4xOS0yLjE1LS4wOS00LjQtLjM3LTYuNTUtLjY2LTEuNTktLjE5LTMuMTgtLjM3LTQuNjgtLjc1LS44NC0uMDktMS42OC0uMjgtMi41My0uNDctMi4wNi0uMzctNC4xMi0uOTQtNi4wOC0xLjUtMS42OC0uNDctMy4yNy0uOTQtNC45Ni0xLjUtLjI4LS4wOS0uNTYtLjE5LS44NC0uMjgtMS41LS41Ni0yLjktMS4xMi00LjMtMS42OC0xLjY4LS42Ni0zLjI4LTEuNC00Ljg3LTIuMDZsLS4wOS0uMDljLS4xOS0uMDktLjM3LS4xOS0uNTYtLjI4LS4yOC0uMDktLjY2LS4yOC0uOTQtLjQ3LTIuOS0xLjQtNS42MS0yLjk5LTguMzMtNC42OC0uMDksMC0uMjgtLjA5LS4zNy0uMTktMS4xMi0uNjYtMi4xNS0xLjQtMy4xOC0yLjE1LS4xOS0uMDktLjI4LS4xOS0uMzctLjI4LTEuMzEtLjg0LTIuNjItMS43OC0zLjg0LTIuODFoLS4wOWMtLjk0LS43NS0xLjg3LTEuNTktMi44MS0yLjI1LS45NC0uODQtMS43OC0xLjUtMi42Mi0yLjI1LS45NC0uNzUtMS43OC0xLjU5LTIuNjItMi40M2wtMi41My0yLjUzYy0yLjI1LTIuMjUtNC4zLTQuNjgtNi4yNy03LjExLTEuMDMtMS4yMi0xLjk2LTIuNTMtMi45LTMuODQtMS44Ny0yLjUzLTMuNjUtNS4yNC01LjMzLTcuOTUtMy40Ni01LjgtNi4yNy0xMi4wNy04LjUxLTE4LjUzLS43NS0yLjA2LTEuMzEtNC4xMi0xLjg3LTYuMTgtLjQ3LTEuNTktLjk0LTMuMjctMS4zMS01LjA1LS42Ni0yLjktMS4xMi01LjgtMS41LTguODktLjM3LTIuMTUtLjU2LTQuMy0uNjYtNi40Ni0uMTktMi4zNC0uMjgtNC43Ny0uMjgtNy4xMSwwLTUuMjQuMzctMTAuMzksMS4yMi0xNS40NC4xOS0xLjU5LjQ3LTMuMTguODQtNC42OC4xOS0xLjQuNDctMi43MS44NC00LjAyLjE5LTEuMTIuNDctMi4yNS45NC0zLjM3LjE5LTEuMzEuNTYtMi41MywxLjAzLTMuNzQuMjgtMS4xMi42Ni0yLjI1LDEuMTItMy4zNy41Ni0xLjY4LDEuMTItMy4yOCwxLjg3LTQuODcsMS4yMi0zLjA5LDIuNzEtNi4xOCw0LjIxLTkuMDgsMS4zMS0yLjM0LDIuNzEtNC42OCw0LjEyLTYuOTIsMS41LTIuMjUsMy4wOS00LjQsNC42OC02LjU1LDEuNTktMi4xNSwzLjM3LTQuMjEsNS4xNS02LjE4LDEuNzgtMi4wNiwzLjY1LTMuOTMsNS42MS01LjgsMS43OC0xLjY4LDMuNTYtMy4yNyw1LjUyLTQuNzcuNTYtLjU2LDEuMTItLjk0LDEuNjgtMS4zMSwxLjIyLTEuMTIsMi42Mi0yLjA2LDMuOTMtMi45OS42Ni0uNDcsMS4zMS0uOTQsMS45Ny0xLjMxLDEuOTctMS40LDQuMDItMi42Miw2LjE4LTMuODQsMi43MS0xLjUsNS42MS0yLjk5LDguNTItNC4yMSwxLjY4LS43NSwzLjM3LTEuNSw1LjE1LTIuMDYuNDctLjE5LDEuMDMtLjM3LDEuNS0uNTYsMi4zNC0uODQsNC43Ny0xLjU5LDcuMi0yLjI1LjQ3LS4xOSwxLjAzLS4yOCwxLjU5LS40Ny41Ni0uMDksMS4wMy0uMTksMS41OS0uMzcuOTQtLjI4LDIuMDYtLjM3LDMuMDktLjY2aC4zN2MxLjAzLS4yOCwyLjA2LS40NywzLjA5LS41Ni42NS0uMDksMS4yMi0uMTksMS43OC0uMjgsMS42OC0uMTksMy4yNy0uMzcsNC44Ny0uNDdoLjE5cS4wOS0uMDkuMTktLjA5aC4wOWMuMzcsMCwuODQsMCwxLjMxLS4wOS4zNywwLC44NC0uMDksMS4yMi0uMDkuMjgtLjA5LjQ3LS4wOS42Ni0uMDloMS4zMWMtMzguMDgsMi4zNC02OC4xMiwzMy45Ny02OC4xMiw3Mi43LDAsNy41OCwxLjEyLDE0Ljg4LDMuMzcsMjEuOCw5LjA4LDI4LjQ1LDM1LjQ2LDQ5LjMxLDY2LjYyLDUwLjkuOTQuMDksMS44Ny4wOSwyLjgxLjA5aDEyOS42OVoiLz4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0yNTUuNDUsMjAwLjk5Yy0xNS40NywyOC41OS00MC45Myw1MC45Ny03MS43NCw2Mi40OC0xMy4zLDQuOTctMjcuNTYsNi44Ni00MS43Niw2Ljg2aDBjLTM3LjI0LDAtNzEuMDItMTMuNjYtOTYuNDctMzUuOTNDMTkuMjgsMjExLjE5LDIuMjUsMTc4LjcyLjE5LDE0Mi40MWMtLjA5LTIuMTUtLjE5LTQuMjEtLjE5LTYuMzYsMC00LjYuMjUtOS4xMS41OS0xMy41NC4zMi00LjA3Ljk2LTguMTIsMS43OS0xMi4xMi41OC0yLjgsMS4xNS01LjYsMS45Mi04LjNDMTkuMDksNDYuMTMsNzAuNDYsMy45MywxMzIuNjguMjhxLS4wOSwwLS4xOS4wOWgtLjE5Yy0xLjU5LjA5LTMuMTguMjgtNC43Ny41Ni0uNjYsMC0xLjIyLjA5LTEuODcuMTktMS4wMy4wOS0yLjA2LjI4LTMuMDkuNTZoLS4wOXEtLjA5LDAtLjE5LjA5Yy0xLjEyLjE5LTIuMTUuMzctMy4xOC42Ni0uNDcuMDktMS4wMy4xOS0xLjU5LjI4LS41Ni4xOS0xLjEyLjI4LTEuNTkuNDctMTUuODEsNC4yMS0zMC4wNCwxMi4yNi00MS42NCwyMy4zLTUuODksNS40My0xMS4wNCwxMS43LTE1LjQ0LDE4LjUzLTEwLjIsMTUuOTEtMTYuMTksMzUtMTYuMTksNTUuNDksMCwxOS4wOSw1LjE1LDM2Ljk2LDE0LjEzLDUyLjIxLDEuNjgsMi43MSwzLjQ2LDUuNDMsNS4zMyw3Ljk1Ljk0LDEuMzEsMS44NywyLjYyLDIuOSwzLjg0LDEuOTcsMi40Myw0LjAyLDQuODcsNi4yNyw3LjExLDEuNjgsMS42OCwzLjM3LDMuMzcsNS4xNSw0Ljk2LDEuNzgsMS41LDMuNTYsMi45OSw1LjQzLDQuNDloLjA5YzEuMjIsMS4wMywyLjUzLDEuOTYsMy44NCwyLjgxLjA5LjA5LjE5LjE5LjM3LjI4LDEuMDMuNzUsMi4wNiwxLjUsMy4xOCwyLjE1LjA5LjA5LjI4LjE5LjM3LjE5LDIuNzEsMS42OCw1LjQzLDMuMjgsOC4zMyw0LjY4LjI4LjE5LjY2LjM3Ljk0LjQ3LjE5LjA5LjM3LjE5LjU2LjI4LDEuNTkuNzUsMy4yOCwxLjUsNC45NiwyLjE1LDEuNC41NiwyLjgxLDEuMTIsNC4zLDEuNjgsMy44NCwxLjMxLDcuNzcsMi40MywxMS44OCwzLjI4Ljg0LjE5LDEuNjguMzcsMi41My40NywxLjUuMzcsMy4wOS41Niw0LjY4Ljc1LDIuMTUuMjgsNC40LjU2LDYuNTUuNjYsMS45Ni4wOSwzLjkzLjE5LDUuODkuMTkuNTYsMCwxLjEyLDAsMS41OS0uMDloMTEzLjVaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjcyLjAxLDEzNi4wNWMwLDMuMTgtLjA5LDYuMjctLjM3LDkuNDVoLTEyOS42OWMtLjk0LDAtMS44NywwLTIuODEtLjA5LTMxLjE2LTEuNTktNTcuNTUtMjIuNDYtNjYuNjItNTAuOS0yLjI1LTYuOTItMy4zNy0xNC4yMi0zLjM3LTIxLjhDNjkuMTUsMzMuOTcsOTkuMTksMi4zNCwxMzcuMjcsMGM3NC41OC43NSwxMzQuNzQsNjEuMzgsMTM0Ljc0LDEzNi4wNVoiLz4KICAgICAgPC9nPgogICAgICA8Zz4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Ik00OTAuNDUsMjA0LjU2Yy0xLjgsMS41MS01LjE1LDMuNTMtMTAuMDQsNi4wOS00Ljg5LDIuNTYtMTAuODcsNC44Mi0xNy45NCw2Ljc3LTcuMDcsMS45NS0xNC44OSwyLjg1LTIzLjQ2LDIuNzEtMTMuMDgtLjMtMjQuNzgtMi42Ny0zNS4wOC03LjExLTEwLjMtNC40My0xOS4wMy0xMC40OS0yNi4xNy0xOC4xNi03LjE0LTcuNjctMTIuNi0xNi40Ny0xNi4zNi0yNi4zOS0zLjc2LTkuOTMtNS42NC0yMC41My01LjY0LTMxLjgxLDAtMTIuNjMsMS45Mi0yNC4yMSw1Ljc1LTM0Ljc0LDMuODQtMTAuNTMsOS4zMi0xOS42MywxNi40Ny0yNy4zLDcuMTQtNy42NywxNS42OC0xMy42MSwyNS42LTE3LjgyLDkuOTItNC4yMSwyMC45LTYuMzEsMzIuOTQtNi4zMSwxMS4xMywwLDIwLjk4LDEuNTEsMjkuNTUsNC41MSw4LjU3LDMuMDEsMTUuNTYsNi4yNCwyMC45OCw5LjdsLTEyLjg2LDMwLjkxYy0zLjc2LTIuODYtOC43Ni01LjgzLTE1LTguOTEtNi4yNC0zLjA4LTEzLjQyLTQuNjMtMjEuNTQtNC42My02LjMyLDAtMTIuMzcsMS4zMi0xOC4xNiwzLjk1LTUuNzksMi42My0xMC45MSw2LjM2LTE1LjM0LDExLjE3LTQuNDQsNC44MS03LjkzLDEwLjQyLTEwLjQ5LDE2LjgxLTIuNTYsNi4zOS0zLjgzLDEzLjM1LTMuODMsMjAuODcsMCw3Ljk3LDEuMTYsMTUuMjcsMy41LDIxLjg4LDIuMzMsNi42Miw1LjY4LDEyLjI5LDEwLjA0LDE3LjAzczkuNTksOC4zOSwxNS42OCwxMC45NGM2LjA5LDIuNTYsMTIuOTcsMy44NCwyMC42NCwzLjg0LDguODcsMCwxNi40Ny0xLjQzLDIyLjc4LTQuMjksNi4zMi0yLjg1LDExLjEzLTUuODYsMTQuNDQtOS4wMmwxMy41NCwyOS4zM1oiLz4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Ik01MzEuMDYsMTM1LjUzYzAtMTEuNDMsMi4xOC0yMi4yNiw2LjU0LTMyLjQ5LDQuMzYtMTAuMjMsMTAuNDEtMTkuMjksMTguMTYtMjcuMTgsNy43NC03LjksMTYuNzMtMTQuMSwyNi45Ni0xOC42MSwxMC4yMi00LjUxLDIxLjItNi43NywzMi45NC02Ljc3czIyLjQ4LDIuMjUsMzIuNzEsNi43NywxOS4yOSwxMC43MSwyNy4xOCwxOC42MWM3LjksNy45LDE0LjA2LDE2Ljk2LDE4LjUsMjcuMTgsNC40NCwxMC4yMyw2LjY2LDIxLjA2LDYuNjYsMzIuNDlzLTIuMjIsMjIuNzEtNi42NiwzMi45NGMtNC40NCwxMC4yMy0xMC42LDE5LjIxLTE4LjUsMjYuOTYtNy44OSw3Ljc1LTE2Ljk2LDEzLjgtMjcuMTgsMTguMTYtMTAuMjMsNC4zNi0yMS4xMyw2LjU0LTMyLjcxLDYuNTRzLTIyLjcxLTIuMTgtMzIuOTQtNi41NGMtMTAuMjMtNC4zNi0xOS4yMi0xMC40MS0yNi45Ni0xOC4xNi03Ljc1LTcuNzQtMTMuOC0xNi43My0xOC4xNi0yNi45Ni00LjM2LTEwLjIzLTYuNTQtMjEuMjEtNi41NC0zMi45NFpNNTY0LjksMTM1LjUzYzAsNy4zNywxLjMyLDE0LjI1LDMuOTUsMjAuNjQsMi42Myw2LjQsNi4zMiwxMi4wNCwxMS4wNSwxNi45Miw0Ljc0LDQuODksMTAuMjMsOC42OCwxNi40NywxMS4zOSw2LjI0LDIuNzEsMTMuMDUsNC4wNiwyMC40MSw0LjA2czEzLjY1LTEuMzUsMTkuNzQtNC4wNmM2LjA5LTIuNzEsMTEuMzktNi41LDE1LjktMTEuMzksNC41MS00Ljg5LDguMDQtMTAuNTMsMTAuNi0xNi45MiwyLjU2LTYuMzksMy44NC0xMy4yNywzLjg0LTIwLjY0cy0xLjMyLTE0LjUxLTMuOTUtMjAuOThjLTIuNjMtNi40Ni02LjI0LTEyLjE1LTEwLjgzLTE3LjAzLTQuNTktNC44OS05Ljk2LTguNjktMTYuMTMtMTEuMzktNi4xNy0yLjcxLTEyLjg2LTQuMDYtMjAuMDgtNC4wNnMtMTMuOTEsMS4zNS0yMC4wOCw0LjA2Yy02LjE3LDIuNzEtMTEuNTgsNi41MS0xNi4yNCwxMS4zOS00LjY2LDQuODktOC4yNywxMC41Ny0xMC44MywxNy4wMy0yLjU2LDYuNDctMy44NCwxMy40Ni0zLjg0LDIwLjk4WiIvPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtNCIgZD0iTTc1MS40NiwyMTguMzJWNDUuNTJoLjIybDkyLjI3LDEzMC44NS0xMy45OS0zLjE2LDkyLjA0LTEyNy42OWguNDV2MTcyLjhoLTMyLjcxdi05OS4wNGwyLjAzLDE2LjkyLTU2LjE3LDc5Ljg2aC0uNDVsLTU3Ljc1LTc5Ljg2LDUuNjQtMTUuNTd2OTcuNjhoLTMxLjU4WiIvPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtNCIgZD0iTTk4Ny44OCwyMTguMzJWNDUuNTJoLjIybDkyLjI3LDEzMC44NS0xMy45OS0zLjE2LDkyLjA0LTEyNy42OWguNDV2MTcyLjhoLTMyLjcxdi05OS4wNGwyLjAzLDE2LjkyLTU2LjE3LDc5Ljg2aC0uNDVsLTU3Ljc1LTc5Ljg2LDUuNjQtMTUuNTd2OTcuNjhoLTMxLjU4WiIvPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtNCIgZD0iTTEyNTMuNjMsMTU2Ljk2YzAsNS4yNywxLjU4LDEwLjMsNC43NCwxNS4xMiwzLjE2LDQuODEsNy4zMyw4LjcyLDEyLjUyLDExLjczLDUuMTksMy4wMSwxMC44Niw0LjUxLDE3LjAzLDQuNTEsNi43NywwLDEyLjc4LTEuNSwxOC4wNS00LjUxLDUuMjYtMy4wMSw5LjQzLTYuOTIsMTIuNTItMTEuNzMsMy4wOC00LjgxLDQuNjItOS44NSw0LjYyLTE1LjEyVjUyLjI5aDMyLjI2djEwNS4zNWMwLDEyLjE4LTMuMDEsMjIuOTgtOS4wMiwzMi4zNy02LjAyLDkuNC0xNC4xNCwxNi43Ny0yNC4zNiwyMi4xMS0xMC4yMyw1LjM0LTIxLjU4LDguMDEtMzQuMDcsOC4wMXMtMjMuNTctMi42Ny0zMy43My04LjAxYy0xMC4xNS01LjM0LTE4LjI0LTEyLjcxLTI0LjI1LTIyLjExLTYuMDItOS40LTkuMDItMjAuMTktOS4wMi0zMi4zN1Y1Mi4yOWgzMi43MXYxMDQuNjdaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy00IiBkPSJNMTU2Ni4wNywyMjUuMDlsLTEyNS44OC0xMTMuNyw5LjcsNS40MS42OCwxMDEuNTJoLTMzLjE2VjQ1Ljc1aDEuMzVsMTIzLjE3LDExMy4yNS03LjIyLTMuMTYtLjY4LTEwMy41NWgzMi45NHYxNzIuOGgtLjlaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy00IiBkPSJNMTYzMi40LDUyLjI5aDMyLjcxdjE2Ni4wNGgtMzIuNzFWNTIuMjlaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy00IiBkPSJNMTcyMy43Niw1Mi4yOWgxMTEuODl2MzEuNThoLTQwLjM4djEzNC40NWgtMzIuNzFWODMuODdoLTM4Ljgxdi0zMS41OFoiLz4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Ik0xOTMyLjg4LDE2Ni42NmwtNjEuMTMtMTE0LjM4aDQwLjM4bDQyLjg2LDg2LjE3LTkuNy42OCw0Mi4xOC04Ni44NWg0MC4zOWwtNjIuMjYsMTE0LjM4djUxLjY2aC0zMi43MXYtNTEuNjZaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy00IiBkPSJNMjA2Ni40Myw1OC4xNWgxMDQuOXYxMC42aC00Ny4xNXYxNDkuNTdoLTExLjA1VjY4Ljc1aC00Ni43di0xMC42WiIvPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtNCIgZD0iTTIyMDYuMDcsMjE4LjMybDY3LjY4LTE2Ny4xNmguOWw2Ny42OCwxNjcuMTZoLTEyLjQxbC01OC44OC0xNDkuNTcsNy42Ny00LjI5LTYxLjU5LDE1My44NWgtMTEuMDVaTTIyMzguNzgsMTU0LjkzaDcxLjA2bDMuMTYsMTAuMzhoLTc2LjkzbDIuNzEtMTAuMzhaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy00IiBkPSJNMjM4Ni4wOSwyMTguMzJsNTQuMTQtODQuNiw1Ljg2LDkuNy00Ni40Nyw3NC45aC0xMy41M1pNMjM4OC4zNSw1OC4xNWgxMy43NmwxMDQuMjIsMTYwLjE3aC0xMy45OWwtMTA0LTE2MC4xN1pNMjQ0NS40MiwxMzAuMTJsNDQuODktNzEuOTZoMTMuMDhsLTUxLjY2LDgwLjc2LTYuMzItOC44WiIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4=';  // white SVG embedded
var CTAX_LOGO_BLUE  = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMjUwNi4zMyAyNzAuMzMiPgogIDxkZWZzPgogICAgPHN0eWxlPgogICAgICAuY2xzLTEgewogICAgICAgIGZpbGw6IHVybCgjbGluZWFyLWdyYWRpZW50LTMpOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6IHVybCgjbGluZWFyLWdyYWRpZW50LTIpOwogICAgICB9CgogICAgICAuY2xzLTMgewogICAgICAgIGZpbGw6IHVybCgjbGluZWFyLWdyYWRpZW50KTsKICAgICAgfQoKICAgICAgLmNscy00IHsKICAgICAgICBmaWxsOiAjMmQ1NTkzOwogICAgICB9CiAgICA8L3N0eWxlPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQiIHgxPSIxOS4yMiIgeTE9Ii4wNCIgeDI9IjIwNi42NCIgeTI9IjE4OS4wMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM0OGVhZDYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNDUiIHN0b3AtY29sb3I9IiNhMWYyZmYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNjBlN2ZmIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQtMiIgeDE9IjM4LjQ4IiB5MT0iNjIuMzMiIHgyPSIxNzEuNTciIHkyPSIyMDguNiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMxOGQxZjgiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDBiNGRlIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQtMyIgeDE9Ii04Ni43MSIgeTE9IjIxNy41NSIgeDI9IjI2My4zNSIgeTI9IjM5LjQyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzJkNTU5MyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMjYyYjQiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxnIGlkPSJMYXllcl8xLTIiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+CiAgICA8Zz4KICAgICAgPHBhdGggY2xhc3M9ImNscy0zIiBkPSJNMjcxLjY0LDE0NS41Yy0xLjMxLDE5LjkzLTcuMDIsMzguNzQtMTYuMTksNTUuNDloLTExMy41Yy0uNDcuMDktMS4wMy4wOS0xLjU5LjA5LTEuOTYsMC0zLjkzLS4wOS01Ljg5LS4xOS0yLjE1LS4wOS00LjQtLjM3LTYuNTUtLjY2LTEuNTktLjE5LTMuMTgtLjM3LTQuNjgtLjc1LS44NC0uMDktMS42OC0uMjgtMi41My0uNDctMi4wNi0uMzctNC4xMi0uOTQtNi4wOC0xLjUtMS42OC0uNDctMy4yNy0uOTQtNC45Ni0xLjUtLjI4LS4wOS0uNTYtLjE5LS44NC0uMjgtMS41LS41Ni0yLjktMS4xMi00LjMtMS42OC0xLjY4LS42Ni0zLjI4LTEuNC00Ljg3LTIuMDZsLS4wOS0uMDljLS4xOS0uMDktLjM3LS4xOS0uNTYtLjI4LS4yOC0uMDktLjY2LS4yOC0uOTQtLjQ3LTIuOS0xLjQtNS42MS0yLjk5LTguMzMtNC42OC0uMDksMC0uMjgtLjA5LS4zNy0uMTktMS4xMi0uNjYtMi4xNS0xLjQtMy4xOC0yLjE1LS4xOS0uMDktLjI4LS4xOS0uMzctLjI4LTEuMzEtLjg0LTIuNjItMS43OC0zLjg0LTIuODFoLS4wOWMtLjk0LS43NS0xLjg3LTEuNTktMi44MS0yLjI1LS45NC0uODQtMS43OC0xLjUtMi42Mi0yLjI1LS45NC0uNzUtMS43OC0xLjU5LTIuNjItMi40M2wtMi41My0yLjUzYy0yLjI1LTIuMjUtNC4zLTQuNjgtNi4yNy03LjExLTEuMDMtMS4yMi0xLjk2LTIuNTMtMi45LTMuODQtMS44Ny0yLjUzLTMuNjUtNS4yNC01LjMzLTcuOTUtMy40Ni01LjgtNi4yNy0xMi4wNy04LjUxLTE4LjUzLS43NS0yLjA2LTEuMzEtNC4xMi0xLjg3LTYuMTgtLjQ3LTEuNTktLjk0LTMuMjctMS4zMS01LjA1LS42Ni0yLjktMS4xMi01LjgtMS41LTguODktLjM3LTIuMTUtLjU2LTQuMy0uNjYtNi40Ni0uMTktMi4zNC0uMjgtNC43Ny0uMjgtNy4xMSwwLTUuMjQuMzctMTAuMzksMS4yMi0xNS40NC4xOS0xLjU5LjQ3LTMuMTguODQtNC42OC4xOS0xLjQuNDctMi43MS44NC00LjAyLjE5LTEuMTIuNDctMi4yNS45NC0zLjM3LjE5LTEuMzEuNTYtMi41MywxLjAzLTMuNzQuMjgtMS4xMi42Ni0yLjI1LDEuMTItMy4zNy41Ni0xLjY4LDEuMTItMy4yOCwxLjg3LTQuODcsMS4yMi0zLjA5LDIuNzEtNi4xOCw0LjIxLTkuMDgsMS4zMS0yLjM0LDIuNzEtNC42OCw0LjEyLTYuOTIsMS41LTIuMjUsMy4wOS00LjQsNC42OC02LjU1LDEuNTktMi4xNSwzLjM3LTQuMjEsNS4xNS02LjE4LDEuNzgtMi4wNiwzLjY1LTMuOTMsNS42MS01LjgsMS43OC0xLjY4LDMuNTYtMy4yNyw1LjUyLTQuNzcuNTYtLjU2LDEuMTItLjk0LDEuNjgtMS4zMSwxLjIyLTEuMTIsMi42Mi0yLjA2LDMuOTMtMi45OS42Ni0uNDcsMS4zMS0uOTQsMS45Ny0xLjMxLDEuOTctMS40LDQuMDItMi42Miw2LjE4LTMuODQsMi43MS0xLjUsNS42MS0yLjk5LDguNTItNC4yMSwxLjY4LS43NSwzLjM3LTEuNSw1LjE1LTIuMDYuNDctLjE5LDEuMDMtLjM3LDEuNS0uNTYsMi4zNC0uODQsNC43Ny0xLjU5LDcuMi0yLjI1LjQ3LS4xOSwxLjAzLS4yOCwxLjU5LS40Ny41Ni0uMDksMS4wMy0uMTksMS41OS0uMzcuOTQtLjI4LDIuMDYtLjM3LDMuMDktLjY2aC4zN2MxLjAzLS4yOCwyLjA2LS40NywzLjA5LS41Ni42NS0uMDksMS4yMi0uMTksMS43OC0uMjgsMS42OC0uMTksMy4yNy0uMzcsNC44Ny0uNDdoLjE5cS4wOS0uMDkuMTktLjA5aC4wOWMuMzcsMCwuODQsMCwxLjMxLS4wOS4zNywwLC44NC0uMDksMS4yMi0uMDkuMjgtLjA5LjQ3LS4wOS42Ni0uMDloMS4zMWMtMzguMDgsMi4zNC02OC4xMiwzMy45Ny02OC4xMiw3Mi43LDAsNy41OCwxLjEyLDE0Ljg4LDMuMzcsMjEuOCw5LjA4LDI4LjQ1LDM1LjQ2LDQ5LjMxLDY2LjYyLDUwLjkuOTQuMDksMS44Ny4wOSwyLjgxLjA5aDEyOS42OVoiLz4KICAgICAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMjU1LjQ1LDIwMC45OWMtMTUuNDcsMjguNTktNDAuOTMsNTAuOTctNzEuNzQsNjIuNDgtMTMuMyw0Ljk3LTI3LjU2LDYuODYtNDEuNzYsNi44NmgwYy0zNy4yNCwwLTcxLjAyLTEzLjY2LTk2LjQ3LTM1LjkzQzE5LjI4LDIxMS4xOSwyLjI1LDE3OC43Mi4xOSwxNDIuNDFjLS4wOS0yLjE1LS4xOS00LjIxLS4xOS02LjM2LDAtNC42LjI1LTkuMTEuNTktMTMuNTQuMzItNC4wNy45Ni04LjEyLDEuNzktMTIuMTIuNTgtMi44LDEuMTUtNS42LDEuOTItOC4zQzE5LjA5LDQ2LjEzLDcwLjQ2LDMuOTMsMTMyLjY4LjI4cS0uMDksMC0uMTkuMDloLS4xOWMtMS41OS4wOS0zLjE4LjI4LTQuNzcuNTYtLjY2LDAtMS4yMi4wOS0xLjg3LjE5LTEuMDMuMDktMi4wNi4yOC0zLjA5LjU2aC0uMDlxLS4wOSwwLS4xOS4wOWMtMS4xMi4xOS0yLjE1LjM3LTMuMTguNjYtLjQ3LjA5LTEuMDMuMTktMS41OS4yOC0uNTYuMTktMS4xMi4yOC0xLjU5LjQ3LTE1LjgxLDQuMjEtMzAuMDQsMTIuMjYtNDEuNjQsMjMuMy01Ljg5LDUuNDMtMTEuMDQsMTEuNy0xNS40NCwxOC41My0xMC4yLDE1LjkxLTE2LjE5LDM1LTE2LjE5LDU1LjQ5LDAsMTkuMDksNS4xNSwzNi45NiwxNC4xMyw1Mi4yMSwxLjY4LDIuNzEsMy40Niw1LjQzLDUuMzMsNy45NS45NCwxLjMxLDEuODcsMi42MiwyLjksMy44NCwxLjk3LDIuNDMsNC4wMiw0Ljg3LDYuMjcsNy4xMSwxLjY4LDEuNjgsMy4zNywzLjM3LDUuMTUsNC45NiwxLjc4LDEuNSwzLjU2LDIuOTksNS40Myw0LjQ5aC4wOWMxLjIyLDEuMDMsMi41MywxLjk2LDMuODQsMi44MS4wOS4wOS4xOS4xOS4zNy4yOCwxLjAzLjc1LDIuMDYsMS41LDMuMTgsMi4xNS4wOS4wOS4yOC4xOS4zNy4xOSwyLjcxLDEuNjgsNS40MywzLjI4LDguMzMsNC42OC4yOC4xOS42Ni4zNy45NC40Ny4xOS4wOS4zNy4xOS41Ni4yOCwxLjU5Ljc1LDMuMjgsMS41LDQuOTYsMi4xNSwxLjQuNTYsMi44MSwxLjEyLDQuMywxLjY4LDMuODQsMS4zMSw3Ljc3LDIuNDMsMTEuODgsMy4yOC44NC4xOSwxLjY4LjM3LDIuNTMuNDcsMS41LjM3LDMuMDkuNTYsNC42OC43NSwyLjE1LjI4LDQuNC41Niw2LjU1LjY2LDEuOTYuMDksMy45My4xOSw1Ljg5LjE5LjU2LDAsMS4xMiwwLDEuNTktLjA5aDExMy41WiIvPgogICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yNzIuMDEsMTM2LjA1YzAsMy4xOC0uMDksNi4yNy0uMzcsOS40NWgtMTI5LjY5Yy0uOTQsMC0xLjg3LDAtMi44MS0uMDktMzEuMTYtMS41OS01Ny41NS0yMi40Ni02Ni42Mi01MC45LTIuMjUtNi45Mi0zLjM3LTE0LjIyLTMuMzctMjEuOEM2OS4xNSwzMy45Nyw5OS4xOSwyLjM0LDEzNy4yNywwYzc0LjU4Ljc1LDEzNC43NCw2MS4zOCwxMzQuNzQsMTM2LjA1WiIvPgogICAgICA8Zz4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Ik00OTAuNDUsMjA0LjU2Yy0xLjgsMS41MS01LjE1LDMuNTMtMTAuMDQsNi4wOS00Ljg5LDIuNTYtMTAuODcsNC44Mi0xNy45NCw2Ljc3LTcuMDcsMS45NS0xNC44OSwyLjg1LTIzLjQ2LDIuNzEtMTMuMDgtLjMtMjQuNzgtMi42Ny0zNS4wOC03LjExLTEwLjMtNC40My0xOS4wMy0xMC40OS0yNi4xNy0xOC4xNi03LjE0LTcuNjctMTIuNi0xNi40Ny0xNi4zNi0yNi4zOS0zLjc2LTkuOTMtNS42NC0yMC41My01LjY0LTMxLjgxLDAtMTIuNjMsMS45Mi0yNC4yMSw1Ljc1LTM0Ljc0LDMuODQtMTAuNTMsOS4zMi0xOS42MywxNi40Ny0yNy4zLDcuMTQtNy42NywxNS42OC0xMy42MSwyNS42LTE3LjgyLDkuOTItNC4yMSwyMC45LTYuMzEsMzIuOTQtNi4zMSwxMS4xMywwLDIwLjk4LDEuNTEsMjkuNTUsNC41MSw4LjU3LDMuMDEsMTUuNTYsNi4yNCwyMC45OCw5LjdsLTEyLjg2LDMwLjkxYy0zLjc2LTIuODYtOC43Ni01LjgzLTE1LTguOTEtNi4yNC0zLjA4LTEzLjQyLTQuNjMtMjEuNTQtNC42My02LjMyLDAtMTIuMzcsMS4zMi0xOC4xNiwzLjk1LTUuNzksMi42My0xMC45MSw2LjM2LTE1LjM0LDExLjE3LTQuNDQsNC44MS03LjkzLDEwLjQyLTEwLjQ5LDE2LjgxLTIuNTYsNi4zOS0zLjgzLDEzLjM1LTMuODMsMjAuODcsMCw3Ljk3LDEuMTYsMTUuMjcsMy41LDIxLjg4LDIuMzMsNi42Miw1LjY4LDEyLjI5LDEwLjA0LDE3LjAzczkuNTksOC4zOSwxNS42OCwxMC45NGM2LjA5LDIuNTYsMTIuOTcsMy44NCwyMC42NCwzLjg0LDguODcsMCwxNi40Ny0xLjQzLDIyLjc4LTQuMjksNi4zMi0yLjg1LDExLjEzLTUuODYsMTQuNDQtOS4wMmwxMy41NCwyOS4zM1oiLz4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Ik01MzEuMDYsMTM1LjUzYzAtMTEuNDMsMi4xOC0yMi4yNiw2LjU0LTMyLjQ5LDQuMzYtMTAuMjMsMTAuNDEtMTkuMjksMTguMTYtMjcuMTgsNy43NC03LjksMTYuNzMtMTQuMSwyNi45Ni0xOC42MSwxMC4yMi00LjUxLDIxLjItNi43NywzMi45NC02Ljc3czIyLjQ4LDIuMjUsMzIuNzEsNi43NywxOS4yOSwxMC43MSwyNy4xOCwxOC42MWM3LjksNy45LDE0LjA2LDE2Ljk2LDE4LjUsMjcuMTgsNC40NCwxMC4yMyw2LjY2LDIxLjA2LDYuNjYsMzIuNDlzLTIuMjIsMjIuNzEtNi42NiwzMi45NGMtNC40NCwxMC4yMy0xMC42LDE5LjIxLTE4LjUsMjYuOTYtNy44OSw3Ljc1LTE2Ljk2LDEzLjgtMjcuMTgsMTguMTYtMTAuMjMsNC4zNi0yMS4xMyw2LjU0LTMyLjcxLDYuNTRzLTIyLjcxLTIuMTgtMzIuOTQtNi41NGMtMTAuMjMtNC4zNi0xOS4yMi0xMC40MS0yNi45Ni0xOC4xNi03Ljc1LTcuNzQtMTMuOC0xNi43My0xOC4xNi0yNi45Ni00LjM2LTEwLjIzLTYuNTQtMjEuMjEtNi41NC0zMi45NFpNNTY0LjksMTM1LjUzYzAsNy4zNywxLjMyLDE0LjI1LDMuOTUsMjAuNjQsMi42Myw2LjQsNi4zMiwxMi4wNCwxMS4wNSwxNi45Miw0Ljc0LDQuODksMTAuMjMsOC42OCwxNi40NywxMS4zOSw2LjI0LDIuNzEsMTMuMDUsNC4wNiwyMC40MSw0LjA2czEzLjY1LTEuMzUsMTkuNzQtNC4wNmM2LjA5LTIuNzEsMTEuMzktNi41LDE1LjktMTEuMzksNC41MS00Ljg5LDguMDQtMTAuNTMsMTAuNi0xNi45MiwyLjU2LTYuMzksMy44NC0xMy4yNywzLjg0LTIwLjY0cy0xLjMyLTE0LjUxLTMuOTUtMjAuOThjLTIuNjMtNi40Ni02LjI0LTEyLjE1LTEwLjgzLTE3LjAzLTQuNTktNC44OS05Ljk2LTguNjktMTYuMTMtMTEuMzktNi4xNy0yLjcxLTEyLjg2LTQuMDYtMjAuMDgtNC4wNnMtMTMuOTEsMS4zNS0yMC4wOCw0LjA2Yy02LjE3LDIuNzEtMTEuNTgsNi41MS0xNi4yNCwxMS4zOS00LjY2LDQuODktOC4yNywxMC41Ny0xMC44MywxNy4wMy0yLjU2LDYuNDctMy44NCwxMy40Ni0zLjg0LDIwLjk4WiIvPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtNCIgZD0iTTc1MS40NiwyMTguMzJWNDUuNTJoLjIybDkyLjI3LDEzMC44NS0xMy45OS0zLjE2LDkyLjA0LTEyNy42OWguNDV2MTcyLjhoLTMyLjcxdi05OS4wNGwyLjAzLDE2LjkyLTU2LjE3LDc5Ljg2aC0uNDVsLTU3Ljc1LTc5Ljg2LDUuNjQtMTUuNTd2OTcuNjhoLTMxLjU4WiIvPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtNCIgZD0iTTk4Ny44OCwyMTguMzJWNDUuNTJoLjIybDkyLjI3LDEzMC44NS0xMy45OS0zLjE2LDkyLjA0LTEyNy42OWguNDV2MTcyLjhoLTMyLjcxdi05OS4wNGwyLjAzLDE2LjkyLTU2LjE3LDc5Ljg2aC0uNDVsLTU3Ljc1LTc5Ljg2LDUuNjQtMTUuNTd2OTcuNjhoLTMxLjU4WiIvPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtNCIgZD0iTTEyNTMuNjMsMTU2Ljk2YzAsNS4yNywxLjU4LDEwLjMsNC43NCwxNS4xMiwzLjE2LDQuODEsNy4zMyw4LjcyLDEyLjUyLDExLjczLDUuMTksMy4wMSwxMC44Niw0LjUxLDE3LjAzLDQuNTEsNi43NywwLDEyLjc4LTEuNSwxOC4wNS00LjUxLDUuMjYtMy4wMSw5LjQzLTYuOTIsMTIuNTItMTEuNzMsMy4wOC00LjgxLDQuNjItOS44NSw0LjYyLTE1LjEyVjUyLjI5aDMyLjI2djEwNS4zNWMwLDEyLjE4LTMuMDEsMjIuOTgtOS4wMiwzMi4zNy02LjAyLDkuNC0xNC4xNCwxNi43Ny0yNC4zNiwyMi4xMS0xMC4yMyw1LjM0LTIxLjU4LDguMDEtMzQuMDcsOC4wMXMtMjMuNTctMi42Ny0zMy43My04LjAxYy0xMC4xNS01LjM0LTE4LjI0LTEyLjcxLTI0LjI1LTIyLjExLTYuMDItOS40LTkuMDItMjAuMTktOS4wMi0zMi4zN1Y1Mi4yOWgzMi43MXYxMDQuNjdaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy00IiBkPSJNMTU2Ni4wNywyMjUuMDlsLTEyNS44OC0xMTMuNyw5LjcsNS40MS42OCwxMDEuNTJoLTMzLjE2VjQ1Ljc1aDEuMzVsMTIzLjE3LDExMy4yNS03LjIyLTMuMTYtLjY4LTEwMy41NWgzMi45NHYxNzIuOGgtLjlaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy00IiBkPSJNMTYzMi40LDUyLjI5aDMyLjcxdjE2Ni4wNGgtMzIuNzFWNTIuMjlaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy00IiBkPSJNMTcyMy43Niw1Mi4yOWgxMTEuODl2MzEuNThoLTQwLjM4djEzNC40NWgtMzIuNzFWODMuODdoLTM4Ljgxdi0zMS41OFoiLz4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Ik0xOTMyLjg4LDE2Ni42NmwtNjEuMTMtMTE0LjM4aDQwLjM4bDQyLjg2LDg2LjE3LTkuNy42OCw0Mi4xOC04Ni44NWg0MC4zOWwtNjIuMjYsMTE0LjM4djUxLjY2aC0zMi43MXYtNTEuNjZaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy00IiBkPSJNMjA2Ni40Myw1OC4xNWgxMDQuOXYxMC42aC00Ny4xNXYxNDkuNTdoLTExLjA1VjY4Ljc1aC00Ni43di0xMC42WiIvPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtNCIgZD0iTTIyMDYuMDcsMjE4LjMybDY3LjY4LTE2Ny4xNmguOWw2Ny42OCwxNjcuMTZoLTEyLjQxbC01OC44OC0xNDkuNTcsNy42Ny00LjI5LTYxLjU5LDE1My44NWgtMTEuMDVaTTIyMzguNzgsMTU0LjkzaDcxLjA2bDMuMTYsMTAuMzhoLTc2LjkzbDIuNzEtMTAuMzhaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy00IiBkPSJNMjM4Ni4wOSwyMTguMzJsNTQuMTQtODQuNiw1Ljg2LDkuNy00Ni40Nyw3NC45aC0xMy41M1pNMjM4OC4zNSw1OC4xNWgxMy43NmwxMDQuMjIsMTYwLjE3aC0xMy45OWwtMTA0LTE2MC4xN1pNMjQ0NS40MiwxMzAuMTJsNDQuODktNzEuOTZoMTMuMDhsLTUxLjY2LDgwLjc2LTYuMzItOC44WiIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4=';  // blue SVG embedded
var amCurrentTemplate = 1;

// Wire logo upload
(function(){
  function initLogoUpload(){
    var input = document.getElementById('am-logo-input');
    var label = document.getElementById('am-logo-label');
    var drop  = document.getElementById('am-logo-drop');
    if(!input || input._wired) return;
    input._wired = true;
    input.addEventListener('change', function(){
      var file = input.files && input.files[0];
      if(!file) return;
      var reader = new FileReader();
      reader.onload = function(e){
        amLogoDataUrl = e.target.result;
        if(label) label.textContent = '✓ ' + file.name;
        if(drop){ drop.style.borderColor='var(--blue)'; drop.style.background='rgba(11,95,216,0.04)'; }
      };
      reader.readAsDataURL(file);
    });
  }
  var origShow = window.showPage;
  window.showPage = function(id){
    if(origShow) origShow(id);
    if(id==='admaker') setTimeout(initLogoUpload, 100);
  };
  setTimeout(initLogoUpload, 600);
})();

function selectTemplate(n){
  amCurrentTemplate = n;
  document.querySelectorAll('.am-tpl-opt').forEach(function(el){ el.classList.remove('am-tpl-selected'); });
  var sel = document.querySelector('.am-tpl-opt[data-tpl="'+n+'"]');
  if(sel) sel.classList.add('am-tpl-selected');
}

function resizeAd(ratio, realW, realH){
  document.querySelectorAll('.am-size-btn').forEach(function(b){ b.classList.remove('am-size-active'); });
  var btn = document.querySelector('.am-size-btn[data-size="'+ratio+'"]');
  if(btn) btn.classList.add('am-size-active');

  var lbl = document.getElementById('am-size-label');
  if(lbl) lbl.textContent = realW + ' × ' + realH + 'px · ' + ratio;

  window._amRealW = realW;
  window._amRealH = realH;

  // Display at 50%
  var dispW = Math.round(realW * 0.5);
  var dispH = Math.round(realH * 0.5);

  var canvas = document.getElementById('am-ad-canvas');
  var outer  = document.getElementById('am-ad-outer');
  if(!canvas || !outer) return;

  canvas.style.width  = dispW + 'px';
  canvas.style.height = dispH + 'px';
  canvas.style.transform = '';
  outer.style.width   = dispW + 'px';
  outer.style.height  = dispH + 'px';

  var inputs = window._amInputs || {};

  // Pass REAL dimensions for font scaling, but render into display-sized container
  // buildStaticCard uses dims for math only — CSS fills the container via width/height:100%
  canvas.innerHTML = buildStaticCard(
    inputs.firm     || '',
    inputs.platform || 'Facebook',
    inputs.color    || '#0B5FD8',
    inputs.tagline  || '',
    amLogoDataUrl,
    amCurrentTemplate,
    {w: realW, h: realH}   // ← real dims so font math is correct
  );
}


function generateStaticAd(){
  var firm     = (document.getElementById('am-firm')    || {value:''}).value.trim();
  var platform = (document.getElementById('am-platform')|| {value:'Facebook'}).value;
  var color    = (document.getElementById('am-color')   || {value:'#0B5FD8'}).value;
  var tagline  = (document.getElementById('am-tagline') || {value:''}).value.trim();
  var errEl    = document.getElementById('am-error');

  if(!firm){
    if(errEl){ errEl.textContent='Please enter your firm name.'; errEl.style.display='block'; }
    return;
  }
  if(errEl) errEl.style.display='none';

  // Store inputs for resize
  window._amInputs = {firm:firm, platform:platform, color:color, tagline:tagline};
  window._amRealW = 1200;
  window._amRealH = 628;

  var resultsEl = document.getElementById('am-results');
  var formEl    = document.getElementById('am-form-wrap');
  if(formEl)    formEl.style.display = 'none';
  if(resultsEl){ resultsEl.style.visibility='hidden'; resultsEl.style.display='block'; }

  // Init at 16:9
  setTimeout(function(){
    resizeAd('16:9', 1200, 628);
    if(resultsEl) resultsEl.style.visibility = '';
  }, 30);
}

function buildStaticCard(firm, platform, brandColor, tagline, logoUrl, tpl, dims){
  var w = dims ? dims.w : 600;
  var h = dims ? dims.h : 314;

  var configs = {
    1: { bg:'linear-gradient(135deg,#0A1628 0%,#112244 60%,#1a3160 100%)', text:'#fff', sub:'rgba(255,255,255,0.82)', ctaBg:brandColor, ctaText:'#fff', pill:'rgba(255,255,255,0.38)', div:'rgba(255,255,255,0.1)' },
    2: { bg:'linear-gradient(135deg,'+brandColor+' 0%,#0099CC 100%)',       text:'#fff', sub:'rgba(255,255,255,0.88)', ctaBg:'#fff',       ctaText:brandColor, pill:'rgba(255,255,255,0.55)', div:'rgba(255,255,255,0.18)' },
    3: { bg:'#ffffff', text:'#0A1628', sub:'rgba(10,22,40,0.72)', ctaBg:brandColor, ctaText:'#fff', pill:'rgba(10,22,40,0.38)', div:'rgba(10,22,40,0.08)' }
  };
  var t = configs[tpl] || configs[1];

  // Community Tax logo — white for dark/gradient templates, blue for white template
  var ctaxSrc = (tpl === 3) ? CTAX_LOGO_BLUE : CTAX_LOGO_WHITE;
  var ctaxOpacity = '1';
  function ctaxLogo(h){ return '<img src="'+ctaxSrc+'" style="height:'+h+';width:auto;object-fit:contain">'; }

  // Partner logo or firm name text
  var partnerLogo = function(h, maxW, fs){
    return logoUrl
      ? '<img src="'+logoUrl+'" style="height:'+h+';width:auto;max-width:160px;object-fit:contain;filter:'+(tpl===3?'none':'brightness(0) invert(1)')+'">'
      : '<span style="font-family:DM Sans,sans-serif;font-weight:700;color:'+t.text+';font-size:'+fs+'">'+firm+'</span>';
  };

  var tagEl = function(fs){
    return tagline ? '<div style="font-size:'+fs+';color:'+t.sub+';margin-top:3px">'+tagline+'</div>' : '';
  };

  var ctaBlock = function(fs, lineFs){
    var name = firm || 'your advisor';
    return '<div>'
      +'<div style="font-size:'+fs+';font-weight:700;color:'+t.text+'">Ready to resolve your tax debt?</div>'
      +'<div style="font-size:'+lineFs+';color:'+t.sub+';margin-top:5px">Speak with <span style="color:'+t.text+';font-weight:600">'+name+'</span> for a free referral to Community Tax.</div>'
      +'</div>';
  };

  // Detect format
  var ratio = w / h;
  var fmt = ratio > 1.6 ? '16x9' : ratio > 1.1 ? '5x4' : Math.abs(ratio-1) < 0.15 ? '1x1' : ratio > 0.65 ? '4x5' : '9x16';

  var wrap = function(pad, content){
    return '<div style="width:100%;height:100%;background:'+t.bg+';font-family:DM Sans,sans-serif;box-sizing:border-box;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;padding:'+pad+'">'+content+'</div>';
  };
  var divider = function(h){ return '<div style="width:1px;height:'+h+';background:'+t.div+'"></div>'; };
  var eyebrow = function(fs){ return '<div style="font-size:'+fs+';font-weight:700;letter-spacing:0.2em;text-transform:uppercase;background:linear-gradient(90deg,#a8b4c4,#d4dde8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:1em">TAX DEBT RELIEF</div>'; };
  var ctaBtn = function(fs, pad, r, txt){
    return '<div style="background:'+t.ctaBg+';color:'+t.ctaText+';font-size:'+fs+';font-weight:700;padding:'+pad+';border-radius:'+r+';white-space:nowrap;text-align:center">'+txt+' →</div>';
  };
  var referral = function(fs, align){
    return '<div style="font-size:'+fs+';color:'+t.pill+';text-align:'+(align||'left')+'">Referred by '+firm+'</div>';
  };

  if(fmt === '16x9'){
    return wrap('26px 32px',
      '<div style="display:flex;justify-content:space-between;align-items:center">'
        +'<div style="flex:1;min-width:0">'+partnerLogo('28px','','15px')+tagEl('10px')+'</div>'
        +'<div style="flex-shrink:0;display:flex;align-items:center;gap:8px">'+divider('20px')+ctaxLogo('22px')+'</div>'
      +'</div>'
      +'<div>'+eyebrow('9px')
        +'<div style="font-family:DM Serif Display,serif;font-size:38px;line-height:1.08;color:'+t.text+';letter-spacing:-0.02em">Owe the IRS? <span style=\"background:linear-gradient(90deg,#0B5FD8,#00C8E0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text\">There’s a Way Out.</span></div>'
      +'</div>'
      +'<div>'
        +'<div style="font-size:13px;color:'+t.sub+';line-height:1.5;margin-bottom:10px">$2.3B resolved. Confidential consultations. Real relief for real people.</div>'
        +ctaBlock('13px','12px')
      +'</div>'
    );
  }

  if(fmt === '1x1'){
    return wrap('36px 40px',
      '<div style="display:flex;justify-content:space-between;align-items:center">'
        +'<div style="flex:1;min-width:0">'+partnerLogo('32px','','17px')+tagEl('12px')+'</div>'
        +'<div style="flex-shrink:0;display:flex;align-items:center;gap:10px">'+divider('24px')+ctaxLogo('26px')+'</div>'
      +'</div>'
      +'<div>'+eyebrow('11px')
        +'<div style="font-family:DM Serif Display,serif;font-size:52px;line-height:1.06;color:'+t.text+';letter-spacing:-0.02em">You Don’t Have to<br>Face the <span style=\"background:linear-gradient(90deg,#0B5FD8,#00C8E0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text\">IRS Alone.</span></div>'
        +'<div style="font-size:16px;color:'+t.sub+';line-height:1.55;margin-top:20px;max-width:80%">120,000+ clients helped. No judgment. Real results.</div>'
      +'</div>'
      +ctaBlock('15px','13px')
    );
  }

  if(fmt === '4x5'){
    return wrap('40px 44px',
      '<div style="display:flex;justify-content:space-between;align-items:center">'
        +'<div style="flex:1;min-width:0">'+partnerLogo('30px','','16px')+tagEl('11px')+'</div>'
        +'<div style="flex-shrink:0">'+ctaxLogo('26px')+'</div>'
      +'</div>'
      +'<div>'+eyebrow('11px')
        +'<div style="font-family:DM Serif Display,serif;font-size:58px;line-height:1.06;color:'+t.text+';letter-spacing:-0.025em">IRS Debt<br>Stealing Your<br><span style=\"background:linear-gradient(90deg,#0B5FD8,#00C8E0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text\">Peace of Mind?</span></div>'
        +'<div style="font-size:17px;color:'+t.sub+';line-height:1.6;margin-top:24px">We’ve helped 120,000+ clients resolve tax debt — quietly, legally, for less than you think.</div>'
      +'</div>'
      +ctaBlock('16px','14px')
    );
  }

  if(fmt === '9x16'){
    return wrap('56px 48px',
      '<div style="display:flex;justify-content:space-between;align-items:center">'
        +'<div style="flex:1;min-width:0">'+partnerLogo('36px','','18px')+tagEl('13px')+'</div>'
        +'<div style="flex-shrink:0">'+ctaxLogo('30px')+'</div>'
      +'</div>'
      +'<div>'+eyebrow('13px')
        +'<div style="font-family:DM Serif Display,serif;font-size:80px;line-height:1.04;color:'+t.text+';letter-spacing:-0.025em">IRS Debt<br>Stealing<br>Your <span style=\"background:linear-gradient(90deg,#0B5FD8,#00C8E0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text\">Peace<br>of Mind?</span></div>'
        +'<div style="font-size:20px;color:'+t.sub+';line-height:1.65;margin-top:32px">We’ve helped 120,000+ clients resolve tax debt quietly and legally.</div>'
      +'</div>'
      +ctaBlock('20px','17px')
    );
  }

  // 5:4
  return wrap('32px 40px',
    '<div style="display:flex;justify-content:space-between;align-items:flex-start">'
      +'<div>'+partnerLogo('30px','','16px')+tagEl('11px')+'</div>'
      +'<div style="display:flex;align-items:center;gap:10px">'+divider('22px')+ctaxLogo('24px')+'</div>'
    +'</div>'
    +'<div>'+eyebrow('10px')
      +'<div style="font-family:DM Serif Display,serif;font-size:52px;line-height:1.07;color:'+t.text+';letter-spacing:-0.02em">Owe the IRS?<br><span style=\"background:linear-gradient(90deg,#0B5FD8,#00C8E0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text\">There’s a Way Out.</span></div>'
    +'</div>'
    +'<div>'
      +'<div style="font-size:14px;color:'+t.sub+';line-height:1.5;margin-bottom:10px">$2.3B resolved. Confidential. Real relief for real people.</div>'
      +ctaBlock('14px','12px')
    +'</div>'
  );
}


function downloadStaticAd(){
  var canvas = document.getElementById('am-ad-canvas');
  if(!canvas){ return; }
  if(typeof html2canvas === 'undefined'){
    var s = document.createElement('script');
    s.src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    s.onload = function(){ runDownload(canvas); };
    document.head.appendChild(s);
  } else {
    runDownload(canvas);
  }
}

function runDownload(el){
  var firm = (document.getElementById('am-firm')||{value:'partner'}).value.trim() || 'partner';
  var realW = window._amRealW || 1200;
  var realH = window._amRealH || 628;
  // Canvas is displayed at 50%, so scale:2 gives us full resolution
  html2canvas(el, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null
  }).then(function(cv){
    var a = document.createElement('a');
    a.href = cv.toDataURL('image/png');
    a.download = firm.replace(/\s+/g,'-').toLowerCase() + '-ctax-' + realW + 'x' + realH + '.png';
    a.click();
  });
}

function resetAdMaker(){
  var f = document.getElementById('am-form-wrap');
  var r = document.getElementById('am-results');
  if(f) f.style.display = 'block';
  if(r) r.style.display = 'none';
  amLogoDataUrl = null;
  var label = document.getElementById('am-logo-label');
  var drop  = document.getElementById('am-logo-drop');
  if(label) label.textContent = 'Click to upload PNG or SVG';
  if(drop){ drop.style.borderColor=''; drop.style.background=''; }
  var input = document.getElementById('am-logo-input');
  if(input){ input.value=''; input._wired=false; }
  setTimeout(function(){
    var i = document.getElementById('am-logo-input');
    if(i && !i._wired){
      i._wired=true;
      i.addEventListener('change', function(){
        var file=i.files&&i.files[0]; if(!file)return;
        var reader=new FileReader();
        reader.onload=function(e){
          amLogoDataUrl=e.target.result;
          var lbl=document.getElementById('am-logo-label');
          var drp=document.getElementById('am-logo-drop');
          if(lbl) lbl.textContent='✓ '+file.name;
          if(drp){ drp.style.borderColor='var(--blue)'; drp.style.background='rgba(11,95,216,0.04)'; }
        };
        reader.readAsDataURL(file);
      });
    }
  }, 100);
}
// ── END AD MAKER ─────────────────────────────────────────────

(function(){
  var ro=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in-view');ro.unobserve(e.target);}});},{threshold:0.12});
  var rv=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');rv.unobserve(e.target);}});},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
  function initReveal(){
    var h=document.getElementById('page-home');if(!h)return;
    // Handle .scroll-reveal (adds .in-view)
    h.querySelectorAll('.scroll-reveal').forEach(function(el){el.classList.remove('in-view');ro.observe(el);});
    // Handle .reveal (adds .visible)
    h.querySelectorAll('.reveal').forEach(function(el){el.classList.remove('visible');rv.observe(el);});
  }
  window.initReveal=initReveal;
  window.revealInView=function(el){if(el){el.querySelectorAll('.scroll-reveal').forEach(function(s){ro.observe(s);});el.querySelectorAll('.reveal').forEach(function(s){rv.observe(s);});}};
  function animCount(el){
    var tgt=parseFloat(el.getAttribute('data-target'));
    var pre=el.getAttribute('data-prefix')||'',suf=el.getAttribute('data-suffix')||'';
    var isF=(tgt%1!==0),dur=1800,t0=null;
    el.classList.add('counting');
    function step(ts){
      if(!t0)t0=ts;
      var p=Math.min((ts-t0)/dur,1),ease=p===1?1:1-Math.pow(2,-10*p),cur=ease*tgt;
      el.textContent=pre+(isF?cur.toFixed(1):Math.floor(cur))+suf;
      if(p<1)requestAnimationFrame(step);
      else{el.textContent=pre+(isF?tgt.toFixed(1):Math.floor(tgt))+suf;el.classList.remove('counting');}
    }
    requestAnimationFrame(step);
  }
  var co=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){animCount(e.target);co.unobserve(e.target);}});},{threshold:0.5});
  function initScrollCounters(){document.querySelectorAll('#page-home .counter').forEach(function(el){co.observe(el);});}
  function fireHeroCounters(){document.querySelectorAll('#page-home .hero-counter').forEach(function(el){el.textContent=(el.getAttribute('data-prefix')||'')+'0'+(el.getAttribute('data-suffix')||'');animCount(el);});}


  window.addEventListener('load',function(){initReveal();initScrollCounters();setTimeout(fireHeroCounters,2300);});
  var _orig=window.showPage;
  window.showPage=function(id){
    _orig(id);
    if(id==='home'){
      var s=document.querySelector('.h-stats');if(s){s.style.animation='none';s.offsetHeight;s.style.animation='';}
      // Reset hero text animations on revisit
      ['.h-badge','.h-title','.h-sub','.h-cta-row'].forEach(function(sel){
        var el=document.querySelector(sel);if(!el)return;
        el.style.opacity='';el.style.animation='none';el.offsetHeight;el.style.animation='';
      });
      setTimeout(function(){initReveal();document.querySelectorAll('#page-home .counter').forEach(function(el){var p=el.getAttribute('data-prefix')||'';el.textContent=p+'0';co.observe(el);});},80);
      setTimeout(fireHeroCounters,2380);
    }
    if(id==='how'){setTimeout(initHowAnimations,60);}
  };
})();


// ── SOCIAL PROOF TICKER ──────────────────────────────────────
(function(){
  var proofs = [
    {text:'A CPA in Houston just submitted a referral', time:'2 minutes ago'},
    {text:'Partner in Phoenix earned $2,400 this month', time:'15 minutes ago'},
    {text:'New Enterprise partner joined from Dallas', time:'28 minutes ago'},
    {text:'$34,200 in tax debt resolved for a referred client', time:'1 hour ago'},
    {text:'Mortgage broker in Atlanta saved 3 loans this week', time:'2 hours ago'},
    {text:'Strategic partner hit $50K quarterly earnings', time:'3 hours ago'},
    {text:'Financial advisor in NYC referred 5 clients today', time:'4 hours ago'},
    {text:'Law firm partner earned $4,800 on one referral', time:'5 hours ago'}
  ];
  var idx = 0;
  function showProof(){
    var ticker = document.getElementById('social-proof-ticker');
    var textEl = document.getElementById('proof-text');
    var timeEl = document.getElementById('proof-time');
    if(!ticker||!textEl||!timeEl) return;
    textEl.textContent = proofs[idx].text;
    timeEl.textContent = proofs[idx].time;
    ticker.style.display = 'block';
    ticker.style.animation = 'slideInUp 0.4s ease';
    idx = (idx + 1) % proofs.length;
    setTimeout(function(){
      ticker.style.animation = 'slideOutDown 0.4s ease forwards';
      setTimeout(function(){ ticker.style.display = 'none'; }, 400);
    }, 5000);
  }
  // Start after 8 seconds, repeat every 25 seconds
  setTimeout(function(){
    showProof();
    setInterval(showProof, 25000);
  }, 8000);
})();

// ── COOKIE CONSENT ──────────────────────────────────────
function acceptCookies(){
  localStorage.setItem('ctax_cookies_accepted','1');
  document.getElementById('cookie-consent').style.display='none';
}
(function(){
  if(!localStorage.getItem('ctax_cookies_accepted')){
    setTimeout(function(){
      var el = document.getElementById('cookie-consent');
      if(el) el.style.display='flex';
    }, 3000);
  }
})();

// ── CHAT WIDGET ──────────────────────────────────────
function toggleChat(){
  var bubble = document.getElementById('chat-bubble');
  var iconMsg = document.getElementById('chat-icon-msg');
  var iconX = document.getElementById('chat-icon-x');
  if(!bubble) return;
  var open = bubble.style.display === 'block';
  bubble.style.display = open ? 'none' : 'block';
  if(iconMsg) iconMsg.style.display = open ? 'block' : 'none';
  if(iconX) iconX.style.display = open ? 'none' : 'block';
}

// ── DARK MODE ──────────────────────────────────────
function toggleDarkMode(){
  var current = document.documentElement.getAttribute('data-theme');
  var next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ctax_theme', next);
  var btn = document.getElementById('dark-mode-icon');
  if(btn) btn.textContent = next === 'dark' ? '\u2600' : '\u263E';
}
(function(){
  var saved = localStorage.getItem('ctax_theme');
  if(saved === 'dark'){
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

// ── SMOOTH PAGE TRANSITIONS ──────────────────────────────────────
// Enhance existing showPage with animation class
(function(){
  var origShow = window.showPage;
  if(!origShow) return;
  window.showPage = function(id){
    origShow(id);
    var page = document.getElementById('page-' + id);
    if(page){
      page.classList.remove('page-entering');
      void page.offsetHeight;
      page.classList.add('page-entering');
    }
  };
})();

// ── FORM SUBMISSION (mailto fallback) ──────────────────────────────────────
function handleContactSubmit(e){
  if(e) e.preventDefault();
  var form = e.target;
  var data = new FormData(form);
  var name = data.get('name');
  var email = data.get('email');
  var subject = data.get('subject');
  var message = data.get('message');
  if(!name||!email||!message){alert('Please fill in all required fields.');return;}
  var body = 'Name: '+name+'\nEmail: '+email+'\n\n'+message;
  var mailto = 'mailto:partners@communitytax.com?subject='+encodeURIComponent(subject||'Partner Inquiry')+'&body='+encodeURIComponent(body);
  window.location.href = mailto;
  var btn = form.querySelector('button[type="submit"]');
  if(btn){btn.textContent='Sent — check your email client';btn.disabled=true;btn.style.opacity='0.7';}
}


// ── ONBOARDING CHECKLIST ──────────────────────────────────────
function toggleOnboardStep(el) {
  var step = el.closest('.ob-step');
  if (!step) return;
  step.classList.toggle('ob-done');
  updateOnboardProgress();
}
function updateOnboardProgress() {
  var steps = document.querySelectorAll('.ob-step');
  var done = document.querySelectorAll('.ob-step.ob-done');
  var pct = Math.round((done.length / steps.length) * 100);
  var bar = document.getElementById('onboard-bar');
  if (bar) bar.style.width = pct + '%';
  var complete = document.getElementById('onboard-complete');
  if (complete) complete.style.display = pct === 100 ? 'block' : 'none';
}


// ── ANIMATED COUNTERS ON ANY PAGE ──────────────────────────────────────
(function(){
  var counted = new Set();
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting && !counted.has(entry.target)){
        counted.add(entry.target);
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count-to')) || 0;
        var prefix = el.getAttribute('data-count-prefix') || '';
        var suffix = el.getAttribute('data-count-suffix') || '';
        var duration = 1500;
        var start = performance.now();
        function tick(now){
          var elapsed = now - start;
          var progress = Math.min(elapsed / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var current = Math.round(target * eased);
          el.textContent = prefix + current.toLocaleString() + suffix;
          if(progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }
    });
  }, {threshold:0.3});
  document.querySelectorAll('[data-count-to]').forEach(function(el){ obs.observe(el); });
})();
