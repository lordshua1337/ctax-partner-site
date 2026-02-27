
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
    if(typeof showToast === 'function') showToast('Projection copied to clipboard', 'copied');
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
        '<div style="font-family:\'DM Serif Display\',serif;font-size:36px;letter-spacing:-0.02em;background:linear-gradient(135deg,var(--blue),var(--cyan));background-size:200px 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">' + nums.referrals_low + '–' + nums.referrals_high + '</div>' +
        '<div style="font-size:15px;color:var(--slate);margin-top:4px">estimated annually</div>' +
      '</div>' +
      '<div style="background:var(--white);border:1px solid var(--off2);border-radius:11px;padding:24px;text-align:center">' +
        '<div style="font-size:15px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--slate);margin-bottom:8px">Closed Cases / Year</div>' +
        '<div style="font-family:\'DM Serif Display\',serif;font-size:36px;letter-spacing:-0.02em;background:linear-gradient(135deg,var(--blue),var(--cyan));background-size:200px 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">' + nums.cases_low + '–' + nums.cases_high + '</div>' +
        '<div style="font-size:15px;color:var(--slate);margin-top:4px">at ~80% conversion</div>' +
      '</div>' +
      '<div style="background:linear-gradient(135deg,var(--navy),var(--navy2));border-radius:11px;padding:24px;text-align:center">' +
        '<div style="font-size:15px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.72);margin-bottom:8px">Estimated Revenue Share</div>' +
        '<div style="font-family:\'DM Serif Display\',serif;font-size:30px;letter-spacing:-0.02em;color:var(--cyan-text)">' + nums.revenue_low + '–' + nums.revenue_high + '</div>' +
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
