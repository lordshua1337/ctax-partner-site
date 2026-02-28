// ── PARTNER KNOWLEDGE BASE ──────────────────────────────────────
var kbAnswerText = '';

var KB_SYSTEM = 'You are the Community Tax Partner Program knowledge base assistant. Answer partner questions accurately and concisely based on the following program documentation.\n\n'
  + 'ABOUT COMMUNITY TAX:\n'
  + '- National IRS tax resolution firm, 15+ years in business\n'
  + '- $2.3 billion in tax debt resolved for 120,000+ clients\n'
  + '- Licensed in 48 states\n'
  + '- Services: IRS representation, tax debt resolution, tax preparation\n'
  + '- Staff: Licensed Enrolled Agents (EAs) and Tax Attorneys\n'
  + '- Languages: English and Spanish\n'
  + '- BBB Accredited\n\n'
  + 'PARTNER PROGRAM OVERVIEW:\n'
  + '- Partners refer clients with IRS tax debt ($7,000+ minimum)\n'
  + '- Community Tax handles all resolution work behind the scenes\n'
  + '- Partner keeps full client relationship\n'
  + '- ~80% referral-to-consultation conversion rate\n'
  + '- Typical referral-to-close timeline: 30-90 days\n\n'
  + 'REVENUE SHARE TIERS:\n'
  + '- Direct Tier: 8% revenue share, no minimum referrals, self-service portal\n'
  + '- Enterprise Tier: 13% revenue share, 10+ referrals/quarter, dedicated account manager, co-branded materials\n'
  + '- Strategic Tier: 18% revenue share, 25+ referrals/quarter, API integration, custom reporting, white-label options\n'
  + '- Payout: Monthly, NET-30, via ACH or check\n'
  + '- Partner revenue per closed case: $1,500-$4,000 depending on complexity\n'
  + '- Average case value: $8,000-$80,000+\n\n'
  + 'THE PROCESS:\n'
  + '- Phase 1: Investigation ($295 fee, $500 for businesses) - review full IRS account, determine options\n'
  + '- Phase 2: Resolution - negotiate with IRS, implement chosen program\n'
  + '- Resolution options: Offer in Compromise (OIC), Installment Agreement (IA), Currently Not Collectible (CNC), Penalty Abatement, Innocent Spouse Relief, Lien/Levy Release, Audit Representation\n'
  + '- Partners earn revenue share when resolution fees are collected\n\n'
  + 'CLIENT QUALIFICATION:\n'
  + '- Minimum tax debt: $7,000+ (single year or combined)\n'
  + '- Can owe individual or business taxes\n'
  + '- All states except those where not licensed\n'
  + '- IRS notice types that indicate need: CP14 (Balance Due), CP501-CP504 (Collection), Letter 1058 (Intent to Levy), Letter 3172 (Federal Tax Lien)\n'
  + '- Red flags: unfiled returns 2+ years, wage garnishment, bank levy, tax lien on credit report, refund offset\n\n'
  + 'HOW TO SUBMIT A REFERRAL:\n'
  + '- Log in to Partner Portal\n'
  + '- Click "New Referral"\n'
  + '- Enter: client name, phone, email, estimated debt\n'
  + '- Community Tax calls the client within 24 hours\n'
  + '- Track status in real-time through portal\n'
  + '- Or contact partner support: partners@communitytax.com, 1-855-332-2873 (Mon-Fri, 8am-7pm CST)\n\n'
  + 'COMPLIANCE:\n'
  + '- Never guarantee specific outcomes to clients\n'
  + '- Always disclose your referral relationship\n'
  + '- Direct clients to communitytax.com for verification\n'
  + '- Do not provide tax advice unless licensed\n\n'
  + 'GETTING STARTED:\n'
  + '1. Apply at the partner site\n'
  + '2. 15-min intro call with partner manager\n'
  + '3. Sign agreement, get portal access\n'
  + '4. Submit first referral (can happen in < 1 week)\n\n'
  + 'COMMON OBJECTIONS & RESPONSES:\n'
  + '- "I can\'t afford it" → Investigation is only $295, resolution fees can be monthly payments, cost of NOT resolving is higher (penalties compound daily)\n'
  + '- "I\'ll handle it myself" → IRS has professionals, CTAX EAs/attorneys negotiate daily, clients see 70-80% resolution of what they owe\n'
  + '- "I don\'t trust tax resolution companies" → 15 years, $2.3B resolved, 120K clients, BBB accredited\n'
  + '- "I\'ll wait and see" → Penalties and interest are daily, $20K becomes $30K in 18 months\n\n'
  + 'INSTRUCTIONS:\n'
  + '- Answer in 2-4 concise paragraphs\n'
  + '- Use <b>bold</b> for key terms and numbers (no markdown, no asterisks)\n'
  + '- Be specific and cite exact numbers when possible\n'
  + '- If a question is outside program scope, say so and suggest contacting partners@communitytax.com\n'
  + '- Tone: professional, helpful, direct — not salesy\n'
  + '- Do NOT make up information not in the documentation above';

function askKbQuick(btn) {
  document.getElementById('kb-input').value = btn.textContent;
  askKnowledgeBase();
}

function copyKbAnswer() {
  navigator.clipboard.writeText(kbAnswerText).then(function(){
    var btn = document.getElementById('kb-copy-btn');
    if(btn){ var o=btn.innerHTML; btn.innerHTML='Copied'; setTimeout(function(){btn.innerHTML=o;},2000); }
  });
}

async function askKnowledgeBase() {
  var input = document.getElementById('kb-input');
  var question = input.value.trim();
  if (!question) return;
  if (!CTAX_API_KEY) { if (!promptForApiKey()) return; }

  // Move previous answer to history
  var answerEl = document.getElementById('kb-answer');
  if (answerEl.style.display === 'block') {
    var prevQ = answerEl.getAttribute('data-question');
    var prevA = document.getElementById('kb-answer-text').innerHTML;
    if (prevQ && prevA) {
      var histItem = document.createElement('div');
      histItem.className = 'kb-history-item';
      histItem.innerHTML = '<div class="kb-history-q">' + prevQ + '</div><div class="kb-history-a">' + prevA + '</div>';
      var histContainer = document.getElementById('kb-history');
      histContainer.insertBefore(histItem, histContainer.firstChild);
      // Keep max 5 history items
      while (histContainer.children.length > 5) histContainer.removeChild(histContainer.lastChild);
    }
  }

  var kbSection = document.getElementById('kb-answer-section');
  if (kbSection) kbSection.style.display = 'block';
  document.getElementById('kb-loading').style.display = 'block';
  answerEl.style.display = 'none';

  try {
    var resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        system: KB_SYSTEM,
        messages: [{role: 'user', content: question}]
      })
    });
    if(!resp.ok) throw new Error(resp.status === 401 ? '401' : 'API returned ' + resp.status);
    var data = await resp.json();
    if(data.error) throw new Error(data.error.message || 'API error');
    var text = data.content && data.content[0] ? data.content[0].text : 'No answer found.';

    kbAnswerText = text.replace(/<[^>]+>/g, '');
    document.getElementById('kb-answer-text').innerHTML = text;
    answerEl.setAttribute('data-question', question);
    document.getElementById('kb-loading').style.display = 'none';
    answerEl.style.display = 'block';
    input.value = '';
    input.focus();
    if (kbSection) kbSection.scrollIntoView({behavior:'smooth',block:'start'});

  } catch(err) {
    document.getElementById('kb-loading').style.display = 'none';
    var isAuth = err.message && err.message.indexOf('401') !== -1;
    var msg = isAuth
      ? 'Invalid API key. Please check your key and try again.'
      : 'Unable to search right now. Please try again in a moment.';
    alert(msg);
  }
}

// Revenue Calculator
var _calcTier=1;
var _tierRanges = {
  1: { min: 50, max: 999, step: 50, value: 500 },
  2: { min: 1000, max: 10000, step: 500, value: 3000 },
  3: { min: 10000, max: 50000, step: 1000, value: 20000 }
};
function selectTier(t){
  _calcTier=t;
  [1,2,3].forEach(function(n){
    var b=document.getElementById('tier-btn-'+n);
    if(b) b.classList.toggle('active',n===t);
  });
  var range = _tierRanges[t];
  var sl = document.getElementById('sl-clients');
  if (sl && range) {
    sl.min = range.min;
    sl.max = range.max;
    sl.step = range.step;
    sl.value = range.value;
  }
  calcUpdate();
}
function calcUpdate(){
  var slClients=document.getElementById('sl-clients');
  var slPct=document.getElementById('sl-pct');
  if(!slClients||!slPct) return;
  var clients=parseInt(slClients.value);
  var pct=parseInt(slPct.value);
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
  var el;
  el=document.getElementById('cv-clients'); if(el) el.textContent=clients.toLocaleString()+' clients';
  el=document.getElementById('cv-pct'); if(el) el.textContent=pct+'% of clients';
  el=document.getElementById('res-annual'); if(el) el.textContent='$'+annual.toLocaleString();
  el=document.getElementById('res-debtors'); if(el) el.textContent=debtors.toLocaleString();
  el=document.getElementById('res-referrals'); if(el) el.textContent=referrals.toLocaleString();
  el=document.getElementById('res-closed'); if(el) el.textContent=closed.toLocaleString();
  el=document.getElementById('res-percase'); if(el) el.textContent='$'+perCase.toLocaleString();
}
calcUpdate();

// Dynamic tier messaging on apply page
var tierMessages={
  'direct':'<strong>Direct tier</strong> is a great starting point — low requirements, no minimums, and you can upgrade anytime. Perfect for testing the program with your existing client base.',
  'enterprise':'<strong>Enterprise tier</strong> partners get API integration support, co-marketing resources, and dedicated revenue optimization. Ideal for platforms with 500+ active clients.',
  'strategic':'<strong>Strategic tier</strong> is our highest-engagement partnership — dedicated channel manager, MDF, QBRs, and custom revenue structure. Best for enterprise organizations with significant referral volume.',
  'unsure':'No problem — our team will assess your client base and volume during the intro call and recommend the tier that maximizes your revenue.'
};
function initTierRadios(){
  document.querySelectorAll('input[name="tier"]').forEach(function(r){
    if(r._tierWired) return;
    r._tierWired = true;
    r.addEventListener('change',function(){
      var bar=document.getElementById('tier-context-bar');
      var msg=document.getElementById('tier-context-msg');
      if(tierMessages[this.value]){
        msg.innerHTML=tierMessages[this.value];
        bar.style.display='block';
      }
    });
  });
}
initTierRadios();


